// TEST-04 (approved by the author 2026-09-29): the CLI's control flow, with execution, the prompt and
// the network replaced by recorders (helpers/stub_exec.js; fails closed with exit 99). HOME and
// USERPROFILE point at a fresh temporary directory, so the real ~/.termassist is never touched.
// Checks the behaviour the paper describes (§3, §6): refusal and its exit code, the pre-filled prompt,
// the shell used on Enter, Ctrl+C, no network with sync off, and that a failed command exits 0 (I-10).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const CLI = path.join(ROOT, 'cli/index.js');
const STUB = path.join(__dirname, 'helpers/stub_exec.js');
const { search } = require(path.join(ROOT, 'cli/search.js'));

// The CLI needs its two UI dependencies (chalk, @inquirer/prompts) installed in cli/. Without them it
// exits 1 before doing anything, and every flow test below would fail for an unrelated reason.
let cliDepsMissing = null;
for (const dep of ['chalk', '@inquirer/prompts']) {
  try { require.resolve(dep, { paths: [path.join(ROOT, 'cli')] }); } catch { cliDepsMissing = dep; }
}
test('CLI dependencies are installed (run: cd cli && npm ci)', () => {
  assert.strictEqual(cliDepsMissing, null, `cannot resolve "${cliDepsMissing}" from cli/; run: cd cli && npm ci`);
});

const flow = (name, fn) => test(name, { skip: cliDepsMissing ? 'CLI dependencies missing (cd cli && npm ci)' : false }, fn);
const realCfg = path.join(os.homedir(), '.termassist', 'config.json');
const realCfgStat = fs.existsSync(realCfg) ? fs.statSync(realCfg).mtimeMs : null;

function run(query, env = {}) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'ta-cli-test-'));
  const logFile = path.join(home, 'stub.jsonl');
  const r = spawnSync(process.execPath, ['--require', STUB, CLI, ...query.split(' ')], {
    env: { ...process.env, HOME: home, USERPROFILE: home, TA_STUB_LOG: logFile, ...env }, encoding: 'utf8', timeout: 30000
  });
  const events = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];
  const cfg = path.join(home, '.termassist', 'config.json');
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, events, config: fs.existsSync(cfg) ? JSON.parse(fs.readFileSync(cfg, 'utf8')) : null };
}
const execs = ev => ev.filter(e => e.kind === 'exec');

flow('stub is active before the CLI runs', () => {
  const r = run('teach me how to play guitar');
  assert.notStrictEqual(r.status, 99, 'stub self-check failed: ' + r.stderr);
  assert.ok(r.events.some(e => e.kind === 'stub_ready'));
});

flow('refusal: "No confident match found", exit 1, nothing executed', () => {
  const r = run('teach me how to play guitar');
  assert.strictEqual(r.status, 1);
  assert.match(r.stdout, /No confident match found/);
  assert.strictEqual(execs(r.events).length, 0);
});

flow('match + Enter: prompt pre-filled with the command; one execSync through the platform shell', () => {
  const q = 'list running processes';
  const want = search(q);
  assert.ok(want.confidence >= 30, 'fixture query must be answered');
  const r = run(q, { TA_STUB_PROMPT: 'accept' });
  assert.strictEqual(r.status, 0);
  const prompt = r.events.find(e => e.kind === 'prompt');
  assert.strictEqual(prompt.default, want.command);
  const ex = execs(r.events);
  assert.strictEqual(ex.length, 1);
  assert.strictEqual(ex[0].fn, 'execSync');
  assert.strictEqual(ex[0].command, want.command);
  assert.strictEqual(ex[0].options.shell, os.platform() === 'win32' ? 'powershell.exe' : undefined);
  assert.match(r.stdout, new RegExp(`confidence: ${want.confidence}%`));
});

flow('Ctrl+C at the prompt: exit 0, nothing executed', () => {
  const r = run('list running processes', { TA_STUB_PROMPT: 'exit' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(execs(r.events).length, 0);
});

flow('clearing the prompt: nothing executed', () => {
  const r = run('list running processes', { TA_STUB_PROMPT: 'clear' });
  assert.strictEqual(execs(r.events).length, 0);
});

flow('sync off by default: config created with sync_enabled false, no network call', () => {
  const r = run('list running processes', { TA_STUB_PROMPT: 'accept' });
  assert.ok(r.config, 'config.json should be created on first matched query');
  assert.strictEqual(r.config.sync_enabled, false);
  assert.strictEqual(r.events.filter(e => e.kind === 'network').length, 0);
});

flow('a failing command prints the failure message but exits 0 (audit I-10)', () => {
  const r = run('list running processes', { TA_STUB_PROMPT: 'accept', TA_STUB_EXEC: 'throw' });
  assert.strictEqual(r.status, 0);
  assert.match(r.stderr, /Command failed to execute or was aborted/);
});

test('the real ~/.termassist/config.json was not touched', () => {
  const now = fs.existsSync(realCfg) ? fs.statSync(realCfg).mtimeMs : null;
  assert.strictEqual(now, realCfgStat);
});
