// Phase 10 (E9) -- functional evaluation: does the retrieved command actually WORK, not just
// match the gold string? Executed ONLY inside disposable temp-directory sandboxes, NEVER
// against the host system, and ONLY for a carefully scoped, hand-verified-safe subset of the
// benchmark. Scope decisions and why they were excluded are stated explicitly, per the plan's
// "skip categories that can't be sandboxed safely and say so" instruction.
//
// SCOPE: git (14 queries) and filesystem (1 query) categories only, restricted further to gold
// commands that are:
//   (a) placeholder-free (no 'path/to/', 'filename', 'oldname', 'branch-name', etc. -- these are
//       template commands that need argument substitution this phase does not attempt),
//   (b) non-interactive (excludes `git rebase -i`, which opens an editor and would hang a
//       non-interactive script indefinitely),
//   (c) host-safe (excludes `git config --global ...`, which would mutate the operator's real
//       global git identity -- this is exactly the kind of host-affecting command the plan
//       forbids running for real).
// EXCLUDED, explicitly: docker (15), npm (9 -- network-dependent, non-deterministic latency),
// network/curl/ssh/kubernetes/aws (require live external services), process/permissions/
// security/disk/system (destructive or host-state-changing by nature), and any filesystem query
// whose gold command references a specific file/path placeholder (11 of 12 filesystem queries).
//
// SUCCESS DEFINITION (stated explicitly, a deliberate simplification): "functional success" here
// means the command exits with code 0 against a realistic fixture. This is retrieval-vs-execution
// correctness, not full semantic/side-effect verification (e.g. "did git stash actually stash the
// right file") -- building a bespoke assertion oracle per query is out of scope for this phase and
// would need its own validation effort; this is documented as a limitation, not hidden.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..', '..');
const candidates = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/reliability/candidates.json'), 'utf-8')).candidates;

const SAFE_QUERY_IDS = ['TA-B001', 'TA-B002', 'TA-B026', 'TA-B030', 'TA-B035', 'TA-B045', 'TA-B051', 'TA-B055', 'TA-B067', 'TA-B077', 'TA-B103', 'TA-B105', 'TA-B122', 'TA-B123', 'TA-B005'];
const EXECUTION_TIMEOUT_MS = 8000;

// Env hardening: force non-interactive, no-pager execution so nothing can hang waiting for a
// terminal (defense in depth, even though the selected commands shouldn't trigger a pager/editor).
const SAFE_ENV = { ...process.env, GIT_PAGER: 'cat', PAGER: 'cat', GIT_TERMINAL_PROMPT: '0', GIT_EDITOR: 'true', GIT_SEQUENCE_EDITOR: 'true' };

function mkTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

// --- Sandbox fixtures (built once, then copied fresh for every command execution) ---
function buildGitFixture() {
  const dir = mkTempDir('termassist-git-fixture-');
  const run = (cmd) => execSync(cmd, { cwd: dir, env: SAFE_ENV, stdio: 'pipe', timeout: EXECUTION_TIMEOUT_MS });

  run('git init -q -b main');
  run('git config user.email "sandbox@local.test"'); // LOCAL to this repo only, never --global
  run('git config user.name "Sandbox"');

  for (let i = 1; i <= 8; i++) {
    fs.writeFileSync(path.join(dir, 'file.txt'), `revision ${i}\n`);
    run(`git add -A`);
    run(`git commit -q -m "commit ${i}"`);
  }
  run('git branch feature'); // so `git branch -a` has more than one branch
  // NOTE: deliberately NOT pre-adding a remote here. An earlier version of this fixture added
  // one defensively (unrelated to any gold command in the safe set), which caused TA-B051's
  // retrieved command (`git remote add origin ...`) to fail with "remote already exists" --
  // a fixture artifact, not a finding about the retrieved command's real validity. Caught
  // during result review and removed before reporting any number.

  // Leave uncommitted state so status/diff/stash have something to act on
  fs.writeFileSync(path.join(dir, 'file.txt'), 'uncommitted change\n');
  fs.writeFileSync(path.join(dir, 'untracked.txt'), 'untracked\n');

  return dir;
}

function buildFilesystemFixture() {
  const dir = mkTempDir('termassist-fs-fixture-');
  fs.writeFileSync(path.join(dir, 'visible.txt'), 'hello\n');
  fs.writeFileSync(path.join(dir, '.hidden.txt'), 'hidden\n');
  try { execSync(`attrib +h ".hidden.txt"`, { cwd: dir, timeout: EXECUTION_TIMEOUT_MS }); } catch (e) { /* attrib best-effort on non-Windows */ }
  return dir;
}

function execCommand(command, cwd, isPowerShell) {
  const fullCmd = isPowerShell ? `powershell -NoProfile -NonInteractive -Command "${command.replace(/"/g, '\\"')}"` : command;
  try {
    const stdout = execSync(fullCmd, { cwd, env: SAFE_ENV, stdio: 'pipe', timeout: EXECUTION_TIMEOUT_MS, shell: true }).toString();
    return { exitCode: 0, stdout: stdout.slice(0, 500), stderr: '', timedOut: false };
  } catch (err) {
    return {
      exitCode: err.status !== null && err.status !== undefined ? err.status : -1,
      stdout: (err.stdout || '').toString().slice(0, 500),
      stderr: (err.stderr || '').toString().slice(0, 500),
      timedOut: err.signal === 'SIGTERM' || /ETIMEDOUT/.test(String(err.message))
    };
  }
}

function isPowerShellCommand(cmd) {
  return /^(Get-|New-|Remove-|Move-|Copy-|Set-)/i.test(cmd.trim());
}

function main() {
  const results = [];

  const gitFixture = buildGitFixture();
  const fsFixture = buildFilesystemFixture();

  SAFE_QUERY_IDS.forEach(id => {
    const entry = candidates.find(c => c.system === 'hybrid' && c.id === id);
    if (!entry) { console.warn(`Skipping ${id}: not found in hybrid candidates`); return; }

    const isGit = entry.gold_command.trim().startsWith('git');
    const fixture = isGit ? gitFixture : fsFixture;
    const isPs = isPowerShellCommand(entry.gold_command);

    // Fresh copy of the fixture for EACH command, so gold and retrieved start from identical
    // state and neither run can contaminate the other.
    const goldSandbox = mkTempDir('termassist-run-');
    copyDir(fixture, goldSandbox);
    const goldResult = execCommand(entry.gold_command, goldSandbox, isPs);
    fs.rmSync(goldSandbox, { recursive: true, force: true });

    const retrievedSandbox = mkTempDir('termassist-run-');
    copyDir(fixture, retrievedSandbox);
    const retrievedResult = execCommand(entry.top1_command, retrievedSandbox, isPowerShellCommand(entry.top1_command));
    fs.rmSync(retrievedSandbox, { recursive: true, force: true });

    results.push({
      id, category: isGit ? 'git' : 'filesystem',
      query: entry.query_type,
      gold_command: entry.gold_command,
      retrieved_command: entry.top1_command,
      retrieval_textually_correct: entry.gold_command === entry.top1_command,
      gold_functional_success: goldResult.exitCode === 0,
      gold_exit_code: goldResult.exitCode,
      gold_stderr_snippet: goldResult.stderr.slice(0, 200),
      retrieved_functional_success: retrievedResult.exitCode === 0,
      retrieved_exit_code: retrievedResult.exitCode,
      retrieved_stderr_snippet: retrievedResult.stderr.slice(0, 200)
    });
  });

  fs.rmSync(gitFixture, { recursive: true, force: true });
  fs.rmSync(fsFixture, { recursive: true, force: true });

  const totalGoldSuccess = results.filter(r => r.gold_functional_success).length;
  const totalRetrievedSuccess = results.filter(r => r.retrieved_functional_success).length;
  const textuallyCorrectButFunctionallyFailed = results.filter(r => r.retrieval_textually_correct && !r.retrieved_functional_success);
  const textuallyWrongButFunctionallySucceeded = results.filter(r => !r.retrieval_textually_correct && r.retrieved_functional_success);

  const summary = {
    experiment_id: 'E9-functional-evaluation',
    scope: `${results.length} queries (git + filesystem categories, placeholder-free, non-interactive, host-safe gold commands only -- see file header for full exclusion rationale)`,
    excluded_categories: ['docker', 'npm', 'network', 'curl', 'ssh', 'kubernetes', 'aws', 'process', 'permissions', 'security', 'disk', 'system'],
    excluded_within_scope_categories: 'git config --global (host-mutating), git rebase -i (interactive/hang risk), and all placeholder-containing commands (11/12 filesystem, 10/24 git)',
    n_evaluated: results.length,
    gold_functional_success_rate: +(totalGoldSuccess / results.length).toFixed(3),
    retrieved_functional_success_rate: +(totalRetrievedSuccess / results.length).toFixed(3),
    retrieval_textual_accuracy_on_this_subset: +(results.filter(r => r.retrieval_textually_correct).length / results.length).toFixed(3),
    textually_correct_but_functionally_failed_count: textuallyCorrectButFunctionallyFailed.length,
    textually_wrong_but_functionally_succeeded_count: textuallyWrongButFunctionallySucceeded.length,
    generated_at: new Date().toISOString()
  };

  const outDir = path.join(projectRoot, 'research/results/functional');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'functional-eval-results.json'), JSON.stringify({ summary, results }, null, 2), 'utf-8');

  console.log(JSON.stringify(summary, null, 2));
  console.log('\nPer-query results:');
  results.forEach(r => console.log(`  ${r.id} [${r.category}] textual_match=${r.retrieval_textually_correct} gold_exit=${r.gold_exit_code} retrieved_exit=${r.retrieved_exit_code}`));
  console.log(`\nWrote ${path.join(outDir, 'functional-eval-results.json')}`);
}

main();
