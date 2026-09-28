// Shared loaders and statistics for the Phase 1 analysis corrections (research/PLAN_TASKS.md T1-T5).
// Everything here is post hoc and exploratory: the v0.1/v0.2 results were known before these
// analyses were written. Every Phase 1 script must first reproduce the committed numbers it builds
// on (via `guard`) and aborts before writing anything if a reproduction check fails.

const fs = require('fs');
const path = require('path');
const isotonic = require('./isotonic');

const root = path.join(__dirname, '..', '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf-8').replace(/\r\n/g, '\n'));
const OUT_DIR = path.join(root, 'research/results/phase1');

const PATHS = {
  'v0.1': {
    bench: 'research/datasets/termassist_bench_v0.1_validated.json', folds: 'research/results/hybrid/folds.json',
    feats: 'research/results/reliability/reliability_features.json', cands: 'research/results/reliability/candidates.json',
    repro: 'research/results/baseline/reproduction-results.json', ablation: 'research/results/ablation/ablation-results.json',
    selective: 'research/results/reliability/selective-prediction-results.json', calibration: 'research/calibration/calibration-results.json',
    safety: 'research/results/safety/safety-eval-results.json'
  },
  'v0.2': {
    bench: 'research/datasets/termassist_bench_v0.2_validated.json', folds: 'research/results/v0.2/folds.json',
    feats: 'research/results/v0.2/reliability_features.json', cands: 'research/results/v0.2/candidates.json',
    repro: 'research/results/v0.2/reproduction-results.json', ablation: 'research/results/v0.2/ablation-results.json',
    selective: 'research/results/v0.2/selective-prediction-results.json', calibration: 'research/results/v0.2/calibration-results.json',
    safety: 'research/results/v0.2/safety-eval-results.json'
  }
};

function minMax(map) {
  const v = [...map.values()], lo = Math.min(...v), hi = Math.max(...v), r = hi - lo, out = new Map();
  for (const [k, x] of map) out.set(k, r > 1e-9 ? (x - lo) / r : 0.5);
  return out;
}

// Loads one benchmark version. Confidence variants are built exactly as run_calibration.js does.
function load(version) {
  const P = PATHS[version];
  const queries = rd(P.bench).queries;
  const folds = rd(P.folds);
  const feats = rd(P.feats).features;
  const cands = rd(P.cands).candidates;
  const repro = rd(P.repro);
  const ablation = rd(P.ablation);
  const cls = new Map(ablation.conditions.A3.per_query.map(r => [r.id, r.classification]));
  const qById = new Map(queries.map(q => [q.id, q]));
  const featById = new Map(feats.map(f => [f.id, f]));
  const isMatch = (c) => new Set([c.gold_command, ...(c.acceptable_commands || [])].filter(Boolean)).has(c.top1_command);
  const dense = cands.filter(c => c.system === 'dense');
  const variants = {
    baseline_confidence: { rawOf: new Map(repro.map(r => [r.id, r.actual.confidence / 100])), hitOf: new Map(repro.map(r => [r.id, ['CORRECT', 'AMBIGUOUS_CORRECT'].includes(r.evaluation.status) ? 1 : 0])) },
    margin_confidence: { rawOf: minMax(new Map(feats.map(f => [f.id, f.margin]))), hitOf: new Map(feats.map(f => [f.id, f.hit ? 1 : 0])) },
    semantic_confidence: { rawOf: minMax(new Map(dense.map(c => [c.id, c.top1_score]))), hitOf: new Map(dense.map(c => [c.id, isMatch(c) ? 1 : 0])) },
    hybrid_reliability: { rawOf: new Map(feats.map(f => [f.id, f.top1_score])), hitOf: new Map(feats.map(f => [f.id, f.hit ? 1 : 0])) }
  };
  return { version, P, queries, qById, folds, ids: Object.keys(folds.assignment), feats, featById, cands, repro, ablation, cls, variants,
    selective: rd(P.selective), calibration: rd(P.calibration), safety: rd(P.safety),
    isCanonical: id => qById.get(id).query_type === 'canonical', isOOD: id => cls.get(id) === 'OOD' };
}

// ---- statistics ----
function mulberry32(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function eceOf(pairs, nBins = 10) {
  const b = Array.from({ length: nBins }, () => ({ c: 0, h: 0, n: 0 }));
  pairs.forEach(({ conf, hit }) => { let i = Math.floor(conf * nBins); if (i >= nBins) i = nBins - 1; if (i < 0) i = 0; b[i].c += conf; b[i].h += hit; b[i].n++; });
  let g = 0; b.forEach(x => { if (x.n) g += (x.n / pairs.length) * Math.abs(x.c / x.n - x.h / x.n); });
  return g;
}
const brierOf = pairs => pairs.reduce((a, { conf, hit }) => a + (conf - hit) ** 2, 0) / pairs.length;
const r4 = x => +x.toFixed(4);
const p4 = x => +x.toPrecision(4); // p-values: significant figures, so tiny p is not rounded to 0
function percentile(sorted, p) { const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo); }
function wilson(k, n, z = 1.96) {
  if (!n) return { k, n, rate: null, lo: null, hi: null };
  const p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, m = (z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d;
  return { k, n, rate: r4(p), lo: r4(Math.max(0, c - m)), hi: r4(Math.min(1, c + m)) };
}
function exactMcNemar(b, c) {
  const n = b + c; if (!n) return 1;
  let s = 0; const k = Math.min(b, c);
  for (let i = 0; i <= k; i++) { let lc = 0; for (let j = 0; j < i; j++) lc += Math.log(n - j) - Math.log(j + 1); s += Math.exp(lc + n * Math.log(0.5)); }
  return Math.min(1, 2 * s);
}
// AUROC with average ranks for ties (same as run_selective_prediction.js). items: [{score, pos}], higher score => more positive.
function auroc(items) {
  const pos = items.filter(i => i.pos).length, neg = items.length - pos; if (!pos || !neg) return null;
  const s = items.slice().sort((a, b) => a.score - b.score); const ranks = new Array(s.length); let i = 0;
  while (i < s.length) { let j = i; while (j + 1 < s.length && s[j + 1].score === s[i].score) j++; for (let x = i; x <= j; x++) ranks[x] = (i + j) / 2 + 1; i = j + 1; }
  let rs = 0; s.forEach((it, k) => { if (it.pos) rs += ranks[k]; });
  return (rs - pos * (pos + 1) / 2) / (pos * neg);
}
// Generic bootstrap over indices 0..n-1: stat(idxArray) -> number. Returns percentile CI.
function bootstrap(n, stat, { B = 10000, seed = 42 } = {}) {
  const rng = mulberry32(seed), vals = [];
  for (let b = 0; b < B; b++) { const idx = new Array(n); for (let i = 0; i < n; i++) idx[i] = Math.floor(rng() * n); const v = stat(idx); if (v !== null && !Number.isNaN(v)) vals.push(v); }
  vals.sort((a, b) => a - b);
  return { lo: r4(percentile(vals, 0.025)), hi: r4(percentile(vals, 0.975)), B, seed, valid: vals.length, vals };
}

// Nested-CV calibration: fit on dev folds (optionally filtered), apply to test fold (optionally filtered).
// method: 'none' | 'isotonic' | a custom {fit(devPairs)->model, predict(model,x)}.
function nestedCalibrate(D, variantName, method, { fitFilter = () => true, evalFilter = () => true } = {}) {
  const { rawOf, hitOf } = D.variants[variantName];
  const K = D.folds.k, before = [], after = [], ids = [];
  for (let tf = 0; tf < K; tf++) {
    const test = D.ids.filter(id => D.folds.assignment[id] === tf && evalFilter(id));
    const dev = D.ids.filter(id => D.folds.assignment[id] !== tf && fitFilter(id));
    const devPairs = dev.map(id => ({ x: rawOf.get(id), y: hitOf.get(id) }));
    let predict;
    if (method === 'none') predict = x => x;
    else if (method === 'isotonic') { const blocks = isotonic.fit(devPairs); predict = x => isotonic.predict(blocks, x); }
    else { const m = method.fit(devPairs); predict = x => method.predict(m, x); }
    test.forEach(id => { const x = rawOf.get(id), y = hitOf.get(id); before.push({ conf: x, hit: y }); after.push({ conf: predict(x), hit: y }); ids.push(id); });
  }
  return { before, after, ids };
}

// Reproduction guard.
const checks = [];
function guard(label, got, want, tol = 1e-4) { const ok = typeof want === 'number' ? Math.abs(got - want) <= tol : JSON.stringify(got) === JSON.stringify(want); checks.push({ label, got, want, ok }); return ok; }
function assertGuards(scriptName) {
  checks.forEach(c => console.log(`${c.ok ? 'OK  ' : 'FAIL'} reproduce ${c.label}: got ${JSON.stringify(c.got)}, committed ${JSON.stringify(c.want)}`));
  const bad = checks.filter(c => !c.ok).length;
  if (bad) { console.error(`\nABORT (${scriptName}): ${bad} reproduction check(s) failed -- nothing written.`); process.exit(1); }
  console.log(`all ${checks.length} reproduction checks passed\n`);
  return checks.map(({ label, got, want }) => ({ label, got, want }));
}
function writeOut(name, obj) {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = { status: 'post hoc, exploratory (research/PLAN_TASKS.md Phase 1)', generated_by: `research/experiments/${name}.js`, ...obj, generated_at: new Date().toISOString() };
  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(out, null, 2), 'utf-8');
  console.log(`wrote research/results/phase1/${name}.json`);
}

module.exports = { root, rd, PATHS, load, mulberry32, eceOf, brierOf, r4, p4, percentile, wilson, exactMcNemar, auroc, bootstrap, nestedCalibrate, guard, assertGuards, writeOut };
