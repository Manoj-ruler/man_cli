// W4.2 (research/RESEARCH_PLAN_E2E.md): re-run the full v0.2 analysis chain on benchmark v0.2.1,
// WITHOUT touching any frozen file in this checkout.
//
//   node research/experiments/run_v0_2_1.js
//       real run: reads research/datasets/termassist_bench_v0.2.1_validated.{json,csv} and
//       research/datasets/review/human_review_results_v0.2.1.json (built by build_v0_2_1.js --confirm),
//       writes research/results/v0.2.1/ (refused if it already exists, or if the build was synthetic).
//   node research/experiments/run_v0_2_1.js --dry-run --bench-dir <dir> [--out <dir>]
//       test run on a synthetic build (build_v0_2_1.js --proposal <synthetic> --out <dir>); writes
//       OUTSIDE research/ (default <dir>/results_v0.2.1) and stamps every output SYNTHETIC.
//
// How: it creates a disposable git worktree at the committed HEAD, links research/node_modules
// (the pinned embedding model lives there), puts the v0.2.1 files AT THE v0.2 PATHS inside that
// worktree only (so C.frozen('v0.2') is false and the published-count guards are skipped), runs
//   check_model_cache.js -> run_all_v0_2.js -> run_review_r1.js
// there, copies the result folders back under the output root with their relative paths kept, writes
// RUN_MANIFEST.json (commit, Node, input and output SHA-256), and removes the worktree.
// It refuses to run with uncommitted changes to research/experiments/ or cli/, because the worktree
// would not contain them.
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2), flag = f => args.includes(f), val = f => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
const DRY = flag('--dry-run');
const die = m => { console.error('ABORT: ' + m); process.exit(1); };
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const git = (a, cwd = ROOT) => execFileSync('git', a, { cwd, encoding: 'utf8' }).trim();
const inside = (base, p) => { const r = path.relative(base, path.resolve(p)); return !r.startsWith('..') && !path.isAbsolute(r); };

// ---- inputs ----
const benchDir = DRY ? val('--bench-dir') : path.join(ROOT, 'research/datasets');
if (!benchDir) die('--dry-run needs --bench-dir <dir> (the --out of a test build_v0_2_1.js run)');
const IN = { json: path.join(benchDir, 'termassist_bench_v0.2.1_validated.json'), csv: path.join(benchDir, 'termassist_bench_v0.2.1_validated.csv'), review: path.join(benchDir, 'review/human_review_results_v0.2.1.json'), manifest: path.join(benchDir, 'VALIDATED_BENCHMARK_MANIFEST_v0.2.1.json') };
for (const f of Object.values(IN)) if (!fs.existsSync(f)) die(`missing ${f}`);
const manifest = JSON.parse(fs.readFileSync(IN.manifest, 'utf8'));
if (!DRY && manifest.synthetic) die('the v0.2.1 build is marked synthetic; the real run needs a real build');
const outRoot = DRY ? (val('--out') || path.join(benchDir, 'results_v0.2.1')) : path.join(ROOT, 'research/results/v0.2.1');
if (DRY && inside(path.join(ROOT, 'research'), outRoot)) die('a dry run must write outside research/');
if (fs.existsSync(outRoot) && fs.readdirSync(outRoot).length) die(`${outRoot} already exists and is not empty; results are never overwritten`);
const dirty = git(['status', '--porcelain', '--', 'research/experiments', 'cli']);
if (dirty) die('uncommitted changes in research/experiments or cli; commit first so the worktree matches:\n' + dirty);
const commit = git(['rev-parse', 'HEAD']);

// ---- disposable worktree ----
const wt = fs.mkdtempSync(path.join(os.tmpdir(), 'ta-v021-'));
fs.rmSync(wt, { recursive: true, force: true });
git(['worktree', 'add', '--detach', wt, commit]);
const t0 = Date.now();
let ok = false;
try {
  if (!fs.existsSync(path.join(ROOT, 'research/node_modules/@xenova/transformers/package.json'))) throw new Error('research/node_modules is not installed (npm ci in research/)');
  fs.symlinkSync(path.join(ROOT, 'research/node_modules'), path.join(wt, 'research/node_modules'), 'junction');
  // v0.2.1 files at the v0.2 paths, inside the worktree only
  fs.copyFileSync(IN.json, path.join(wt, 'research/datasets/termassist_bench_v0.2_validated.json'));
  fs.copyFileSync(IN.csv, path.join(wt, 'research/datasets/termassist_bench_v0.2_validated.csv'));
  fs.copyFileSync(IN.review, path.join(wt, 'research/datasets/review/human_review_results_v0.2.json'));
  // The step list is read from run_all_v0_2.js itself (so the two cannot drift), minus the generate_*
  // steps: those render the paper's v0.2 tables and figures, not results, and one of them
  // (generate_sensitivity_table.js) requires the answerable subsets of v0.1 and v0.2 to coincide,
  // which the v0.2.1 defect fixes break by design.
  const runAll = fs.readFileSync(path.join(wt, 'research/experiments/run_all_v0_2.js'), 'utf8');
  const listed = [...runAll.match(/const steps = \[([\s\S]*?)\];/)[1].matchAll(/'([^']+\.js)'/g)].map(m => m[1]);
  if (listed.length < 20) throw new Error('could not read the step list from run_all_v0_2.js');
  const steps = ['check_model_cache.js', ...listed.filter(s => !s.startsWith('generate_')), 'run_review_r1.js'];
  console.log(`steps (${steps.length}): ${steps.join(', ')}`);
  for (const s of steps) {
    console.log(`\n=== ${s} (worktree) ===`);
    execFileSync('node', [path.join(wt, 'research/experiments', s)], { cwd: wt, stdio: 'inherit' });
  }
  // ---- copy results back ----
  const COPY = ['research/results/v0.2', 'research/results/phase1', 'research/results/review_r1', 'research/results/seed_repeat', 'research/results/stats'];
  const outFiles = {};
  for (const rel of COPY) {
    const src = path.join(wt, rel);
    if (!fs.existsSync(src)) continue;
    const dst = path.join(outRoot, path.relative('research/results', rel));
    fs.cpSync(src, dst, { recursive: true });
    (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else outFiles[path.relative(outRoot, p).replace(/\\/g, '/')] = sha(p); } })(dst);
  }
  fs.writeFileSync(path.join(outRoot, 'RUN_MANIFEST.json'), JSON.stringify({
    stamp: DRY ? 'SYNTHETIC TEST RUN -- NOT REAL RESULTS' : null,
    what: 'Full v0.2 analysis chain re-run on benchmark v0.2.1 (the run_all_v0_2.js steps except the generate_* table/figure renderers, then run_review_r1.js) in a disposable worktree; v0.2.1 placed at the v0.2 paths inside that worktree only. Folders keep their research/results/ layout; files named v0.2 inside them hold v0.2.1 results. v0.1 sections are unchanged re-runs.',
    commit, node: process.version, platform: `${os.platform()} ${os.release()}`, seconds: Math.round((Date.now() - t0) / 1000),
    benchmark_manifest: { file: path.basename(IN.manifest), synthetic: !!manifest.synthetic },
    input_sha256: Object.fromEntries(Object.entries(IN).map(([k, f]) => [k, sha(f)])),
    output_sha256: outFiles, generated_at: new Date().toISOString()
  }, null, 2));
  ok = true;
  console.log(`\nwrote ${Object.keys(outFiles).length} result files + RUN_MANIFEST.json to ${outRoot}${DRY ? ' [SYNTHETIC]' : ''}`);
} finally {
  // The node_modules link MUST go before the worktree: on Windows `git worktree remove --force`
  // follows a junction and deletes the target's contents (it emptied research/node_modules, and with
  // it the pinned model cache, on 2026-09-29). Unlink it, confirm it is gone, and only then remove the
  // worktree; if the link cannot be removed, leave the worktree in place rather than risk the target.
  const link = path.join(wt, 'research/node_modules');
  let linkGone = false;
  try { if (fs.lstatSync(link, { throwIfNoEntry: false })) fs.unlinkSync(link); linkGone = !fs.lstatSync(link, { throwIfNoEntry: false }); }
  catch (e) { console.error('warning: could not unlink ' + link + ': ' + e.message); }
  if (linkGone) {
    try { git(['worktree', 'remove', '--force', wt]); } catch (e) { console.error('warning: could not remove worktree ' + wt + ': ' + e.message); }
  } else {
    console.error(`warning: left the worktree at ${wt} because its node_modules link is still present; remove the link by hand (rmdir, not rm -r), then run: git worktree remove --force ${wt}`);
  }
  if (!fs.existsSync(path.join(ROOT, 'research/node_modules/@xenova/transformers/package.json'))) {
    console.error('ERROR: research/node_modules/@xenova/transformers is missing after cleanup; run npm ci in research/ and node research/experiments/check_model_cache.js --fetch');
    process.exitCode = 1;
  }
  if (!ok) process.exitCode = 1;
}
