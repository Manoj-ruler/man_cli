// T3 (research/PLAN_TASKS.md): selective prediction that does not depend on how tied confidence
// values happen to be ordered, plus the bootstrap intervals the spec requires (section 8.2, gate D-3).
//
// Why: the hybrid confidence (top1_score) is exactly 1.0 for 96/150 (v0.1) and 110/209 (v0.2)
// queries. run_selective_prediction.js sorts by score with a stable sort, so inside a tie block the
// queries are answered in benchmark-ID order, and any coverage point inside the block depends on
// that order. Here each coverage point uses the EXPECTED risk under a uniformly random order within
// tie blocks (exact, no simulation), and AURC is the mean of that expected risk over all coverages.
//
// Reported per version, for the hybrid confidence and the shipped baseline confidence, on all
// queries and with the 25 canonical controls excluded:
//   - tie-block summary; expected risk at 25/50/75% coverage; best and worst case at 50%;
//   - AURC (tie-aware), oracle AURC and excess AURC, with 95% bootstrap CIs, and the paired
//     hybrid-minus-baseline AURC difference;
//   - correctness AUROC (does the confidence rank correct answers above wrong ones?), with CI.
// Plus pooled OOD-detection and ambiguity-detection AUROC with 95% bootstrap CIs.
// Guards: the committed ID-ordered hybrid risk-coverage curve and the committed mean-over-folds
// detection AUROCs must be reproduced.

const C = require('./phase1_common');
const B = 10000;

// expected risk at every coverage k = 1..n, ties broken uniformly at random (exact expectation)
function tieAwareCurve(items) { // items: [{conf, err}]
  const s = items.slice().sort((a, b) => b.conf - a.conf);
  const blocks = []; let i = 0;
  while (i < s.length) { let j = i; while (j + 1 < s.length && s[j + 1].conf === s[i].conf) j++; blocks.push({ start: i, size: j - i + 1, errs: s.slice(i, j + 1).reduce((a, x) => a + x.err, 0), conf: s[i].conf }); i = j + 1; }
  const risk = new Array(s.length); let errsBefore = 0;
  for (const b of blocks) { for (let t = 1; t <= b.size; t++) { const k = b.start + t; risk[k - 1] = (errsBefore + b.errs * t / b.size) / k; } errsBefore += b.errs; }
  return { risk, blocks };
}
const aurcOf = items => { const r = tieAwareCurve(items).risk; return r.reduce((a, x) => a + x, 0) / r.length; };
// oracle: every correct answer ranked above every error (distinct confidences, so no ties)
const oracleAurc = items => aurcOf(items.map((x, i) => ({ conf: x.err ? -1 - i : 1e9 - i, err: x.err })));
function riskAtCoverage(curve, n, c) { const k = Math.max(1, Math.round(c * n)); return curve.risk[k - 1]; }
function bestWorstAt(items, c) {
  const { blocks } = tieAwareCurve(items), n = items.length, k = Math.round(c * n); let errs = 0;
  for (const b of blocks) {
    if (b.start + b.size <= k) { errs += b.errs; continue; }
    const take = k - b.start; if (take <= 0) break;
    const worst = errs + Math.min(b.errs, take), best = errs + Math.max(0, take - (b.size - b.errs));
    return { k, best: C.r4(best / k), worst: C.r4(worst / k), tie_block_size: b.size, tie_block_confidence: b.conf };
  }
  return { k, best: C.r4(errs / k), worst: C.r4(errs / k), tie_block_size: 0 };
}

function selective(D, signal, filter) {
  const hybHit = D.variants.hybrid_reliability.hitOf, baseHit = D.variants.baseline_confidence.hitOf;
  const conf = signal === 'hybrid' ? D.variants.hybrid_reliability.rawOf : D.variants.baseline_confidence.rawOf;
  const hit = signal === 'hybrid' ? hybHit : baseHit;
  const ids = D.ids.filter(filter);
  const items = ids.map(id => ({ conf: conf.get(id), err: hit.get(id) ? 0 : 1 }));
  const curve = tieAwareCurve(items), n = items.length;
  const biggest = curve.blocks.reduce((a, b) => (b.size > a.size ? b : a));
  const aurc = aurcOf(items), oracle = oracleAurc(items);
  const bs = C.bootstrap(n, idx => aurcOf(idx.map(i => items[i])), { B });
  const corrAuroc = C.auroc(items.map(x => ({ score: x.conf, pos: !x.err })));
  const bsA = C.bootstrap(n, idx => C.auroc(idx.map(i => ({ score: items[i].conf, pos: !items[i].err }))), { B });
  return { n, errors: items.reduce((a, x) => a + x.err, 0), distinct_confidence_values: curve.blocks.length,
    largest_tie_block: { size: biggest.size, share: C.r4(biggest.size / n), confidence: biggest.conf, errors_inside: biggest.errs },
    expected_risk: { cov25: C.r4(riskAtCoverage(curve, n, 0.25)), cov50: C.r4(riskAtCoverage(curve, n, 0.5)), cov75: C.r4(riskAtCoverage(curve, n, 0.75)), cov100: C.r4(curve.risk[n - 1]) },
    cov50_best_worst_over_tie_orders: bestWorstAt(items, 0.5),
    aurc: C.r4(aurc), aurc_ci95: [bs.lo, bs.hi], oracle_aurc: C.r4(oracle), excess_aurc: C.r4(aurc - oracle),
    correctness_auroc: C.r4(corrAuroc), correctness_auroc_ci95: [bsA.lo, bsA.hi], items };
}

const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  // guard 1: reproduce the committed ID-ordered hybrid curve exactly
  const f = D.feats.slice().sort((a, b) => b.top1_score - a.top1_score); let w = 0;
  const idOrder = f.map((x, i) => { if (!x.hit) w++; return { coverage: C.r4((i + 1) / f.length), risk: C.r4(w / (i + 1)) }; });
  C.guard(`${v} committed ID-ordered risk-coverage curve`, idOrder.map(p => [p.coverage, p.risk]), D.selective.risk_coverage_curve.map(p => [p.coverage, p.risk]), 0);
  // guard 2: reproduce committed mean-over-folds AUROCs
  const fold = id => D.folds.assignment[id];
  const meanFoldAuroc = (scoreKey, posKey) => { const a = []; for (let k = 0; k < D.folds.k; k++) { const it = D.ids.filter(id => fold(id) === k).map(id => ({ score: -D.featById.get(id)[scoreKey], pos: D.featById.get(id)[posKey] })); const x = C.auroc(it); if (x !== null) a.push(+x.toFixed(4)); } return a.reduce((s, x) => s + x, 0) / a.length; };
  C.guard(`${v} OOD mean-over-folds AUROC`, C.r4(meanFoldAuroc('top1_score', 'is_ood')), D.selective.ood_detection.mean_test_auroc);
  C.guard(`${v} ambiguity mean-over-folds AUROC`, C.r4(meanFoldAuroc('margin', 'is_ambiguous')), D.selective.ambiguity_detection.mean_test_auroc);

  const sel = {};
  for (const [label, filter] of [['all', () => true], ['controls_excluded', id => !D.isCanonical(id)]]) {
    const h = selective(D, 'hybrid', filter), b = selective(D, 'baseline', filter);
    const n = h.items.length;
    const diff = C.bootstrap(n, idx => aurcOf(idx.map(i => h.items[i])) - aurcOf(idx.map(i => b.items[i])), { B });
    delete h.items; delete b.items;
    sel[label] = { hybrid: h, baseline: b, aurc_difference_hybrid_minus_baseline: { point: C.r4(h.aurc - b.aurc), ci95: [diff.lo, diff.hi] } };
  }
  const detection = {};
  for (const [name, scoreKey, posKey] of [['ood', 'top1_score', 'is_ood'], ['ambiguity', 'margin', 'is_ambiguous']]) {
    const items = D.feats.map(x => ({ score: -x[scoreKey], pos: !!x[posKey] }));
    const pos = items.filter(x => x.pos), neg = items.filter(x => !x.pos);
    const rng = C.mulberry32(42), vals = [];
    for (let k = 0; k < B; k++) vals.push(C.auroc([...pos.map(() => pos[Math.floor(rng() * pos.length)]), ...neg.map(() => neg[Math.floor(rng() * neg.length)])]));
    vals.sort((a, b) => a - b);
    detection[name] = { feature: scoreKey, positives: pos.length, pooled_auroc: C.r4(C.auroc(items)), ci95: [C.r4(C.percentile(vals, 0.025)), C.r4(C.percentile(vals, 0.975))], mean_over_folds_auroc_committed: D.selective[name === 'ood' ? 'ood_detection' : 'ambiguity_detection'].mean_test_auroc };
  }
  result.versions[v] = { selective: sel, detection_auroc: detection, id_ordered_cov50_committed: D.selective.risk_coverage_curve.find(p => p.coverage === 0.5) || null };
}

const guards = C.assertGuards('phase1_t3_selective_ties');
C.writeOut('phase1_t3_selective_ties', { task: 'T3: tie-aware risk-coverage, AURC and AUROC with bootstrap CIs', method: 'expected risk under uniformly random order within tie blocks (exact); AURC = mean expected risk over coverage k=1..n; oracle AURC ranks all correct answers first; bootstrap percentile CIs, stratified for detection AUROC', bootstrap: { B, seed: 42 }, reproduction_checks: guards.map(g => ({ label: g.label, ok: true })), ...result });

for (const [v, R] of Object.entries(result.versions)) {
  console.log(`\n=== ${v} ===`);
  for (const [label, S] of Object.entries(R.selective)) for (const sig of ['hybrid', 'baseline']) {
    const x = S[sig];
    console.log(`  [${label}] ${sig.padEnd(8)} n=${x.n} errors=${x.errors} distinct=${x.distinct_confidence_values} largest tie ${x.largest_tie_block.size} (${(100 * x.largest_tie_block.share).toFixed(0)}%) | risk@50 ${x.expected_risk.cov50} (tie-order range ${x.cov50_best_worst_over_tie_orders.best}-${x.cov50_best_worst_over_tie_orders.worst}) | AURC ${x.aurc} ${JSON.stringify(x.aurc_ci95)} oracle ${x.oracle_aurc} | corr-AUROC ${x.correctness_auroc} ${JSON.stringify(x.correctness_auroc_ci95)}`);
  }
  for (const [label, S] of Object.entries(R.selective)) console.log(`  [${label}] AURC hybrid-baseline ${S.aurc_difference_hybrid_minus_baseline.point} ${JSON.stringify(S.aurc_difference_hybrid_minus_baseline.ci95)}`);
  for (const [k, d] of Object.entries(R.detection_auroc)) console.log(`  ${k} detection: pooled AUROC ${d.pooled_auroc} ${JSON.stringify(d.ci95)} (mean over folds, committed: ${d.mean_over_folds_auroc_committed})`);
}
