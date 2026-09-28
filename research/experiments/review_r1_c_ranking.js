// T18 / REV-26 (review round 1: R1 W12, DA M2): a paired interval for the correctness-AUROC difference.
//
// Correctness AUROC = how well a system's confidence ranks its own correct answers above its errors
// (answering an OOD query counts as an error, as in T3). The two systems are scored on the same queries,
// each on its own answers, so the bootstrap resamples query ids (paired) and recomputes both AUROCs.
// Guards: the point AUROCs reproduce T3 (phase1_t3_selective_ties.json) for all queries and with the
// canonical controls excluded.
const { C, writeOut } = require('./review_r1_common');
const B = 10000;
const t3 = C.rd('research/results/phase1/phase1_t3_selective_ties.json');
const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const H = D.variants.hybrid_reliability, Bs = D.variants.baseline_confidence;
  const out = {};
  for (const [mode, filter] of [['all', () => true], ['controls_excluded', id => !D.isCanonical(id)]]) {
    const ids = D.ids.filter(filter), n = ids.length;
    const au = (sig, idx) => C.auroc(idx.map(i => ({ score: sig.rawOf.get(ids[i]), pos: sig.hitOf.get(ids[i]) === 1 })));
    const all = [...Array(n).keys()];
    const aH = au(H, all), aB = au(Bs, all);
    C.guard(`${v} ${mode} hybrid correctness AUROC`, C.r4(aH), t3.versions[v].selective[mode].hybrid.correctness_auroc);
    C.guard(`${v} ${mode} baseline correctness AUROC`, C.r4(aB), t3.versions[v].selective[mode].baseline.correctness_auroc);
    const d = C.bootstrap(n, idx => { const x = au(H, idx), y = au(Bs, idx); return x === null || y === null ? null : x - y; }, { B });
    const oneSided = d.vals.filter(x => x <= 0).length / d.vals.length;
    out[mode] = { n, hybrid: C.r4(aH), baseline: C.r4(aB), difference: C.r4(aH - aB), difference_ci95: [d.lo, d.hi], share_of_resamples_le_0: C.r4(oneSided) };
  }
  result.versions[v] = out;
}
const guards = C.assertGuards('review_r1_c_ranking');
writeOut('review_r1_c_ranking', { task: 'T18 / REV-26: paired bootstrap CI for the correctness-AUROC difference (hybrid minus shipped baseline)', bootstrap: { B, seed: 42, method: 'paired over query ids' }, reproduction_checks: guards, ...result });
for (const [v, R] of Object.entries(result.versions)) for (const [m, x] of Object.entries(R)) console.log(`${v} ${m.padEnd(17)} n=${x.n} hybrid ${x.hybrid} baseline ${x.baseline} diff ${x.difference} ${JSON.stringify(x.difference_ci95)} (P(diff<=0)=${x.share_of_resamples_le_0})`);
