// POST-HOC sensitivity analysis (written after the raw v0.1/v0.2 results were known -- exploratory,
// not confirmatory). Question: do the paper's main comparisons depend on the ambiguous-labeled
// queries whose label an independent reviewer disputed (bare-keyword-style queries)?
//
// Rule declared BEFORE looking at any outcome: a "bare-keyword" query is an AMBIGUOUS-labeled query
// consisting of a single whitespace-delimited token. Applied uniformly to v0.1 AND v0.2 ambiguous
// queries, not only the newly added ones.
//
// Evaluation subsets (accuracy / ambiguity AUROC / calibration are each recomputed on them):
//   ALL         : reference; must reproduce the already-reported numbers (checked, script aborts if not)
//   DROP_NEW_BK : drop the single-token AMBIGUOUS queries added in v0.2 (id > TA-B150)
//   DROP_ALL_BK : drop every single-token AMBIGUOUS query (v0.1's and v0.2's)
//   ANSWERABLE  : drop every AMBIGUOUS query (label-uncertainty-free subset)
//
// What is NOT re-run: fusion alpha and detector thresholds are NOT re-tuned on the reduced sets
// (the nested-CV tuning ran on the full benchmark). Calibration IS re-fit with the dropped ids
// excluded from both fit and evaluation, keeping the original fold assignment. OOD rejection is not
// recomputed: relabeling ambiguous<->answerable cannot change it (both are "non-OOD" negatives), and
// the OOD query set itself is unchanged by every subset above.

const fs = require('fs');
const path = require('path');
const isotonic = require('./isotonic');

const projectRoot = path.join(__dirname, '..', '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));
const N_BOOT = 10000, SEED = 42;

function mulberry32(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function logChoose(n, k) { if (k < 0 || k > n) return -Infinity; let r = 0; for (let i = 0; i < k; i++) r += Math.log(n - i) - Math.log(i + 1); return r; }
function binomCdf(n, k, p) { let s = 0; for (let i = 0; i <= k; i++) s += Math.exp(logChoose(n, i) + i * Math.log(p) + (n - i) * Math.log(1 - p)); return s; }
function exactMcNemar(b, c) { const n = b + c; if (n === 0) return 1; return Math.min(1, 2 * binomCdf(n, Math.min(b, c), 0.5)); }
function percentile(sorted, p) { const idx = (sorted.length - 1) * p, lo = Math.floor(idx), hi = Math.ceil(idx); return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo); }
function ece(pairs, nBins = 10) {
  const bins = Array.from({ length: nBins }, () => ({ sc: 0, sh: 0, n: 0 }));
  pairs.forEach(({ conf, hit }) => { let i = Math.floor(conf * nBins); if (i >= nBins) i = nBins - 1; if (i < 0) i = 0; bins[i].sc += conf; bins[i].sh += hit; bins[i].n++; });
  let g = 0; bins.forEach(b => { if (b.n) g += (b.n / pairs.length) * Math.abs(b.sc / b.n - b.sh / b.n); });
  return g;
}
function auroc(items, scoreKey, posKey) { // lower score => positive, average ranks for ties (same as run_selective_prediction*.js)
  const pos = items.filter(i => i[posKey]), neg = items.filter(i => !i[posKey]);
  if (!pos.length || !neg.length) return null;
  const all = items.map(i => ({ s: -i[scoreKey], p: i[posKey] })).sort((a, b) => a.s - b.s);
  const ranks = new Array(all.length); let i = 0;
  while (i < all.length) { let j = i; while (j + 1 < all.length && all[j + 1].s === all[i].s) j++; for (let x = i; x <= j; x++) ranks[x] = (i + j) / 2 + 1; i = j + 1; }
  let rs = 0; all.forEach((it, k) => { if (it.p) rs += ranks[k]; });
  return (rs - pos.length * (pos.length + 1) / 2) / (pos.length * neg.length);
}

function analyse(label, paths, isNewId) {
  const bench = rd(paths.bench).queries;
  const queryOf = new Map(bench.map(q => [q.id, q.query]));
  const abl = rd(paths.ablation).conditions;
  const cls = new Map(abl.A3.per_query.map(r => [r.id, r.classification]));
  const folds = rd(paths.folds), feats = rd(paths.reliability).features;
  const featOf = new Map(feats.map(f => [f.id, f]));
  const tok = id => queryOf.get(id).trim().split(/\s+/).length;
  const isAmb = id => cls.get(id) === 'AMBIGUOUS';
  const isBK = id => isAmb(id) && tok(id) === 1;
  const allIds = Object.keys(folds.assignment);

  const subsets = {
    ALL: () => false,
    DROP_NEW_BK: id => isBK(id) && isNewId(id),
    DROP_ALL_BK: id => isBK(id),
    ANSWERABLE: id => isAmb(id)
  };
  if (label === 'v0.1') delete subsets.DROP_NEW_BK; // v0.1 has no "new" queries

  const hitMap = c => new Map(abl[c].per_query.filter(r => r.classification !== 'OOD').map(r => [r.id, r.hit ? 1 : 0]));
  const H = { A0: hitMap('A0'), A2: hitMap('A2'), A3: hitMap('A3') };

  const out = { benchmark: label, subsets: {} };
  for (const [name, drop] of Object.entries(subsets)) {
    const rng = mulberry32(SEED);
    const ids = [...H.A0.keys()].filter(id => !drop(id));
    const n = ids.length;
    const acc = m => ids.reduce((s, id) => s + m.get(id), 0) / n;
    function compare(mA, mB) {
      let a = 0, b = 0; ids.forEach(id => { const x = mA.get(id), y = mB.get(id); if (x && !y) a++; else if (!x && y) b++; });
      const deltas = [];
      for (let k = 0; k < N_BOOT; k++) { let d = 0; for (let i = 0; i < n; i++) { const id = ids[Math.floor(rng() * n)]; d += mB.get(id) - mA.get(id); } deltas.push(d / n); }
      deltas.sort((x, y) => x - y);
      return { a_only_correct: a, b_only_correct: b, exact_mcnemar_p: +exactMcNemar(a, b).toFixed(6), delta_pp: +((acc(mB) - acc(mA)) * 100).toFixed(2), ci95_pp: [+(percentile(deltas, 0.025) * 100).toFixed(1), +(percentile(deltas, 0.975) * 100).toFixed(1)] };
    }
    const res = {
      n_nonOOD_evaluated: n, n_dropped: [...H.A0.keys()].length - n,
      accuracy_pct: { A0_bm25: +(acc(H.A0) * 100).toFixed(2), A2_dense: +(acc(H.A2) * 100).toFixed(2), A3_hybrid: +(acc(H.A3) * 100).toFixed(2) },
      A0_vs_A3: compare(H.A0, H.A3),
      A2_vs_A3: compare(H.A2, H.A3)
    };

    // calibration: refit isotonic on the kept ids (same folds), evaluate on kept ids
    const keep = allIds.filter(id => !drop(id));
    const rawOf = new Map(feats.map(f => [f.id, f.top1_score])), hitOf = new Map(feats.map(f => [f.id, f.hit ? 1 : 0]));
    const before = [], after = [];
    for (let tf = 0; tf < folds.k; tf++) {
      const testIds = keep.filter(id => folds.assignment[id] === tf), devIds = keep.filter(id => folds.assignment[id] !== tf);
      const blocks = isotonic.fit(devIds.map(id => ({ x: rawOf.get(id), y: hitOf.get(id) })));
      testIds.forEach(id => { before.push({ conf: rawOf.get(id), hit: hitOf.get(id) }); after.push({ conf: isotonic.predict(blocks, rawOf.get(id)), hit: hitOf.get(id) }); });
    }
    const m = before.length; let nonPos = 0; const reds = [];
    for (let k = 0; k < N_BOOT; k++) { const idx = new Array(m); for (let i = 0; i < m; i++) idx[i] = Math.floor(rng() * m); const r = ece(idx.map(i => before[i])) - ece(idx.map(i => after[i])); reds.push(r); if (r <= 0) nonPos++; }
    reds.sort((x, y) => x - y);
    res.calibration = { n_pooled: m, ece_before: +ece(before).toFixed(4), ece_after: +ece(after).toFixed(4), relative_reduction_pct: +((ece(before) - ece(after)) / ece(before) * 100).toFixed(1), ci95_reduction: [+percentile(reds, 0.025).toFixed(4), +percentile(reds, 0.975).toFixed(4)], one_sided_p: +Math.max(1 / N_BOOT, nonPos / N_BOOT).toFixed(6) };

    // ambiguity-detection AUROC (margin feature; mean of per-fold AUROCs over the kept queries, as originally computed)
    const aucs = [];
    for (let tf = 0; tf < folds.k; tf++) {
      const items = keep.filter(id => folds.assignment[id] === tf).map(id => featOf.get(id));
      const a = auroc(items, 'margin', 'is_ambiguous'); if (a !== null) aucs.push(a);
    }
    res.ambiguity_auroc_mean_over_folds = +(aucs.reduce((s, x) => s + x, 0) / aucs.length).toFixed(4);
    res.ambiguity_positives_kept = keep.filter(id => featOf.get(id).is_ambiguous).length;
    out.subsets[name] = res;
  }
  return out;
}

const v01 = analyse('v0.1', { bench: 'research/datasets/termassist_bench_v0.1_validated.json', ablation: 'research/results/ablation/ablation-results.json', folds: 'research/results/hybrid/folds.json', reliability: 'research/results/reliability/reliability_features.json' }, () => false);
const v02 = analyse('v0.2', { bench: 'research/datasets/termassist_bench_v0.2_validated.json', ablation: 'research/results/v0.2/ablation-results.json', folds: 'research/results/v0.2/folds.json', reliability: 'research/results/v0.2/reliability_features.json' }, id => +id.slice(-3) > 150);

// --- reproduction guard: ALL subset must match what the paper already reports ---
const expect = [
  ['v0.1 A0vsA3 p', v01.subsets.ALL.A0_vs_A3.exact_mcnemar_p, 0.015625, 1e-6],
  ['v0.2 A0vsA3 p', v02.subsets.ALL.A0_vs_A3.exact_mcnemar_p, 0.070313, 1e-6],
  ['v0.2 A2vsA3 p', v02.subsets.ALL.A2_vs_A3.exact_mcnemar_p, 0.012726, 1e-6],
  ['v0.2 ECE before', v02.subsets.ALL.calibration.ece_before, 0.3237, 1e-4],
  ['v0.2 ECE after', v02.subsets.ALL.calibration.ece_after, 0.0738, 1e-4],
  ['v0.1 ECE before', v01.subsets.ALL.calibration.ece_before, 0.2741, 1e-4],
  ['v0.1 ECE after', v01.subsets.ALL.calibration.ece_after, 0.0537, 1e-4]
];
let bad = 0;
expect.forEach(([n, got, want, tol]) => { const ok = Math.abs(got - want) <= tol; if (!ok) bad++; console.log(`${ok ? 'OK  ' : 'FAIL'} reproduce ${n}: got ${got}, reported ${want}`); });
if (bad) { console.error(`\nABORT: ${bad} reproduction check(s) failed -- subset numbers below would not be trustworthy.`); process.exit(1); }

const outDir = path.join(projectRoot, 'research/results/stats');
fs.writeFileSync(path.join(outDir, 'sensitivity-bare-keyword-results.json'), JSON.stringify({ experiment_id: 'sensitivity-bare-keyword', status: 'post-hoc, exploratory', rule: 'bare-keyword = AMBIGUOUS-labeled query with exactly one whitespace-delimited token; applied uniformly to v0.1 and v0.2', not_rerun: 'alpha and detector thresholds not re-tuned; OOD rejection not recomputed (unaffected by ambiguous relabeling)', versions: [v01, v02], generated_at: new Date().toISOString() }, null, 2), 'utf-8');

[v01, v02].forEach(v => {
  console.log(`\n=== ${v.benchmark} ===`);
  for (const [name, r] of Object.entries(v.subsets)) {
    console.log(`[${name}] n=${r.n_nonOOD_evaluated} (dropped ${r.n_dropped})  acc BM25/dense/hybrid = ${r.accuracy_pct.A0_bm25}/${r.accuracy_pct.A2_dense}/${r.accuracy_pct.A3_hybrid}`);
    console.log(`     A0->A3 ${r.A0_vs_A3.delta_pp}pp CI ${JSON.stringify(r.A0_vs_A3.ci95_pp)} discordant ${r.A0_vs_A3.a_only_correct}/${r.A0_vs_A3.b_only_correct} p=${r.A0_vs_A3.exact_mcnemar_p}`);
    console.log(`     A2->A3 ${r.A2_vs_A3.delta_pp}pp CI ${JSON.stringify(r.A2_vs_A3.ci95_pp)} discordant ${r.A2_vs_A3.a_only_correct}/${r.A2_vs_A3.b_only_correct} p=${r.A2_vs_A3.exact_mcnemar_p}`);
    console.log(`     calibration ECE ${r.calibration.ece_before}->${r.calibration.ece_after} (${r.calibration.relative_reduction_pct}% rel.) one-sided p=${r.calibration.one_sided_p}   ambiguity AUROC ${r.ambiguity_auroc_mean_over_folds} (positives ${r.ambiguity_positives_kept})`);
  }
});
console.log('\nWrote research/results/stats/sensitivity-bare-keyword-results.json');
