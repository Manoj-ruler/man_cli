// RELEASE-01 (research/task_plan/TASK_BACKLOG.md; approved by the author 2026-09-29): does the
// evaluated system equal what npm users installed?
//
// Finding that motivated this script: the published npm package @manoj-ruler/termassist@1.0.1
// (research/release_check/npm-1.0.1/, downloaded 2026-09-29) has code identical to the repository's
// cli/ after line-ending normalization, but its corpus has 380 records (240 visible on win32).
// The evaluated repository corpus has 431 (279 visible on win32): commit 68fef07 added 51 records
// 38 minutes after 1.0.1 was published, and they were never published.
//
// This script measures the consequence without changing anything that exists:
//   1. Guard: rebuilds each benchmark row's status from the repository's cli/search.js with the
//      reproduction rule of reproduce_baseline.js and checks it equals the committed status for
//      every row of research/results/baseline/reproduction-results.json (v0.1) and
//      research/results/v0.2/reproduction-results.json (v0.2).
//   2. Runs the PUBLISHED package's own search() (which reads the published corpus) on the same
//      queries with the same rule, and reports: changed top-1 commands, status counts, overall
//      accuracy (the paper's 67.3% definition), non-control in-scope accuracy, OOD rejections, the
//      mean confidence of wrong answered queries, and the benchmark items whose gold/acceptable
//      commands exist only in the unpublished 51 records.
// Output: research/results/release_check/published_corpus_check.json (new directory; nothing
// existing is modified). Must run on win32 (the benchmark and corpus view are win32).
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..', '..');
const rel = p => path.join(ROOT, p);
if (os.platform() !== 'win32') { console.error('ABORT: must run on win32'); process.exit(1); }

const PUB = rel('research/release_check/npm-1.0.1/package');
const repoSearch = require(rel('cli/search.js')).search;
const pubSearch = require(path.join(PUB, 'search.js')).search;
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');             // binary (the tarball)
// text inputs: LF-normalized, like the benchmark manifests, so a CRLF checkout (core.autocrlf=true)
// records the same hashes (found by the REPRO-01 clean-clone run, 2026-09-30)
const textSha = f => crypto.createHash('sha256').update(fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')).digest('hex');

const checks = [];
const guard = (label, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); checks.push({ label, got, want, ok }); return ok; };

// the reproduction rule of reproduce_baseline.js:105-130
function statusOf(expected, valid, res) {
  const retrieved = res.confidence > 0 && res.score >= 2.0;
  if (expected === 'OOD') return retrieved ? 'OOD_FALSE_ACCEPT' : 'OOD_CORRECT_REJECTION';
  if (expected === 'AMBIGUOUS') return !retrieved ? 'REJECTED' : valid.has(res.command) ? 'AMBIGUOUS_CORRECT' : 'AMBIGUOUS_INCORRECT';
  return !retrieved ? 'REJECTED' : valid.has(res.command) ? 'CORRECT' : 'INCORRECT';
}
const GOOD = new Set(['CORRECT', 'AMBIGUOUS_CORRECT', 'OOD_CORRECT_REJECTION']);
const WRONG = new Set(['INCORRECT', 'AMBIGUOUS_INCORRECT', 'OOD_FALSE_ACCEPT']);

const pubCorpus = JSON.parse(fs.readFileSync(path.join(PUB, 'data/commands.json'), 'utf8'));
const repoCorpus = JSON.parse(fs.readFileSync(rel('cli/data/commands.json'), 'utf8'));
const pubCmds = new Set(pubCorpus.map(r => r.command));
const unpublished = repoCorpus.filter(r => !pubCmds.has(r.command));
const winVis = r => !r.os || r.os.includes('all') || r.os.includes('win32');

const VERS = {
  'v0.1': { bench: 'research/datasets/termassist_bench_v0.1_validated.json', review: 'research/datasets/review/human_review_results.json', repro: 'research/results/baseline/reproduction-results.json' },
  'v0.2': { bench: 'research/datasets/termassist_bench_v0.2_validated.json', review: 'research/datasets/review/human_review_results_v0.2.json', repro: 'research/results/v0.2/reproduction-results.json' }
};
const inputs = {};
const out = { versions: {} };
for (const [v, P] of Object.entries(VERS)) {
  [P.bench, P.review, P.repro].forEach(p => { inputs[p] = textSha(rel(p)); });
  const queries = JSON.parse(fs.readFileSync(rel(P.bench), 'utf8')).queries;
  const reviews = new Map(JSON.parse(fs.readFileSync(rel(P.review), 'utf8')).map(r => [r.id, r]));
  const repro = new Map(JSON.parse(fs.readFileSync(rel(P.repro), 'utf8')).map(r => [r.id, r]));
  const rows = queries.map(q => {
    const r = reviews.get(q.id);
    const expected = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT'));
    const gold = q.gold_command || (r ? r.final_gold_command : null);
    const valid = new Set([gold, ...(Array.isArray(q.acceptable_commands) ? q.acceptable_commands : [])].filter(Boolean));
    const a = repoSearch(q.query), b = pubSearch(q.query);
    return { id: q.id, query: q.query, canonical: q.query_type === 'canonical', expected, valid,
      repo: { command: a.command, score: +a.score.toFixed(4), confidence: a.confidence, status: statusOf(expected, valid, a) },
      pub: { command: b.command, score: +b.score.toFixed(4), confidence: b.confidence, status: statusOf(expected, valid, b) } };
  });
  // guard: the repository run reproduces every committed status and command
  const mism = rows.filter(x => { const c = repro.get(x.id); return !c || c.evaluation.status !== x.repo.status || c.actual.command !== x.repo.command; }).map(x => x.id);
  guard(`${v} repository search() reproduces committed command and status for every row`, mism, []);
  const summ = side => {
    const s = {}; rows.forEach(x => { s[x[side].status] = (s[x[side].status] || 0) + 1; });
    const inScopeNC = rows.filter(x => x.expected !== 'OOD' && !x.canonical);
    const wrong = rows.filter(x => WRONG.has(x[side].status));
    // raw shipped-confidence ECE, controls excluded, 10 equal-width bins; hit = CORRECT or
    // AMBIGUOUS_CORRECT (phase1_common.js baseline_confidence variant)
    const nc = rows.filter(x => !x.canonical).map(x => ({ conf: x[side].confidence / 100, hit: (x[side].status === 'CORRECT' || x[side].status === 'AMBIGUOUS_CORRECT') ? 1 : 0 }));
    const bins = Array.from({ length: 10 }, () => ({ c: 0, h: 0, n: 0 }));
    nc.forEach(({ conf, hit }) => { const i = Math.min(9, Math.floor(conf * 10)); bins[i].c += conf; bins[i].h += hit; bins[i].n++; });
    const ece = bins.reduce((t, b) => t + (b.n ? (b.n / nc.length) * Math.abs(b.c / b.n - b.h / b.n) : 0), 0);
    return {
      raw_ece_controls_excluded: +ece.toFixed(4),
      status_counts: s,
      overall_accuracy: { k: rows.filter(x => GOOD.has(x[side].status)).length, n: rows.length },
      non_control_in_scope_hits: { k: inScopeNC.filter(x => x[side].status === 'CORRECT' || x[side].status === 'AMBIGUOUS_CORRECT').length, n: inScopeNC.length },
      ood_rejected: { k: rows.filter(x => x[side].status === 'OOD_CORRECT_REJECTION').length, n: rows.filter(x => x.expected === 'OOD').length },
      wrong_answered: wrong.length,
      mean_confidence_of_wrong_answered: wrong.length ? +(wrong.reduce((t, x) => t + x[side].confidence, 0) / wrong.length).toFixed(2) : null
    };
  };
  const b = JSON.parse(fs.readFileSync(rel('research/results/review_r1/review_r1_b_calibration.json'), 'utf8'));
  guard(`${v} repository raw ECE (controls excluded) equals review_r1_b`, summ('repo').raw_ece_controls_excluded, b.versions[v].baseline_confidence.controls_excluded.uncalibrated.ece_equal_width_10);
  const changed = rows.filter(x => x.repo.command !== x.pub.command || x.repo.status !== x.pub.status);
  const goldOnlyUnpublished = rows.filter(x => x.valid.size && [...x.valid].every(c => !pubCmds.has(c))).map(x => x.id);
  out.versions[v] = {
    n: rows.length,
    evaluated_repository_corpus: summ('repo'),
    published_npm_corpus: summ('pub'),
    changed_items: changed.map(x => ({ id: x.id, query: x.query, expected: x.expected, repository: x.repo, published: x.pub })),
    items_whose_every_valid_command_is_unpublished: goldOnlyUnpublished
  };
}
if (checks.some(c => !c.ok)) { checks.filter(c => !c.ok).forEach(c => console.error('FAIL', c.label, JSON.stringify(c.got).slice(0, 300))); console.error('ABORT: guards failed; nothing written'); process.exit(1); }

const OUTDIR = rel('research/results/release_check');
fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(path.join(OUTDIR, 'published_corpus_check.json'), JSON.stringify({
  task: 'RELEASE-01: published npm 1.0.1 vs the evaluated repository corpus',
  published_package: { name: '@manoj-ruler/termassist', version: '1.0.1', tarball_sha256: sha(rel('research/release_check/npm-1.0.1/manoj-ruler-termassist-1.0.1.tgz')), corpus_records: pubCorpus.length, corpus_win32_visible: pubCorpus.filter(winVis).length },
  evaluated_repository: { corpus_records: repoCorpus.length, corpus_win32_visible: repoCorpus.filter(winVis).length, unpublished_records: unpublished.length, unpublished_win32_visible: unpublished.filter(winVis).length, unpublished_command_ids: unpublished.map(r => r.command_id) },
  code_identity: 'index.js, search.js, interactive.js, sync.js, test_filter.js and custom_snippets.json are identical after LF normalization; config.js, package.json and README.md are byte-identical (see research/release_check/RELEASE-01_result.md)',
  input_sha256: inputs,
  reproduction_checks: checks.map(({ label, ok }) => ({ label, ok })),
  ...out,
  generated_at: new Date().toISOString()
}, null, 2));
for (const [v, R] of Object.entries(out.versions)) {
  const f = s => `raw ECE ${s.raw_ece_controls_excluded}; overall ${s.overall_accuracy.k}/${s.overall_accuracy.n}; non-control in-scope ${s.non_control_in_scope_hits.k}/${s.non_control_in_scope_hits.n}; OOD rejected ${s.ood_rejected.k}/${s.ood_rejected.n}; wrong answered ${s.wrong_answered} (mean conf ${s.mean_confidence_of_wrong_answered})`;
  console.log(`\n${v}: ${R.changed_items.length} items change\n  repository: ${f(R.evaluated_repository_corpus)}\n  published : ${f(R.published_npm_corpus)}\n  items answerable only with unpublished records: ${R.items_whose_every_valid_command_is_unpublished.length}`);
}
console.log(`\nall ${checks.length} guards passed; wrote research/results/release_check/published_corpus_check.json`);
