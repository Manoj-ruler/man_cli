// T18 / REV-49 (review round 1, DA M3): is the OOD "doubling" more than a stricter threshold?
//
// The paper compares two operating points: the baseline's fixed rule (reject if raw BM25 < 2.0) and the
// tuned detector (reject if the hybrid's fused top-1 score < a per-fold threshold). A stricter threshold
// on the baseline's own score would also reject more OOD queries, at the cost of more false rejections.
// Here both scores are compared as ranking features, threshold-free and at matched false-rejection rates.
//
//   1. OOD-detection AUROC of each score (all queries: OOD = positive), pooled, with a paired stratified
//      bootstrap CI for the difference (10,000 resamples, seed 42).
//   2. The two committed operating points (rejections of OOD / false rejections of non-OOD).
//   3. In-sample ROC sweep of each score: OOD rejection achievable at a false-rejection rate no higher
//      than 0/n, the detector's observed rate (11/159 on v0.2, 6/135 on v0.1), 5% and 10%. This sweep is
//      DESCRIPTIVE: it picks thresholds on the same data for both scores (equal footing), unlike the
//      nested detector, so it bounds what either score could do rather than estimating a deployed rate.
// Guards: the committed operating points (baseline 4/15 and 17/50; detector 7/15 and 34/50; false
// rejections 6/135 and 11/159) and the pooled detector AUROC from T3.
const { C, writeOut } = require('./review_r1_common');
const B = 10000;

const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const ood = D.ids.filter(D.isOOD), non = D.ids.filter(id => !D.isOOD(id));
  const repro = new Map(D.repro.map(r => [r.id, r]));
  const thr = D.selective.ood_detection.per_fold.map(f => f.selected_threshold);
  const detRejects = id => D.featById.get(id).top1_score < thr[D.folds.assignment[id]];
  const baseRejects = id => { const r = repro.get(id); return !(r.actual.confidence > 0 && r.actual.score >= 2.0); };
  // "OOD-ness" scores: higher = more likely OOD
  const sBase = id => -repro.get(id).actual.score;          // raw BM25 top-1 (the baseline's decision variable)
  const sDet = id => -D.featById.get(id).top1_score;         // hybrid fused top-1 (the detector's feature)

  const want = { 'v0.1': { bo: 4, do: 7, df: 6 }, 'v0.2': { bo: 17, do: 34, df: 11 } }[v];
  C.guard(`${v} baseline OOD rejections`, ood.filter(baseRejects).length, want.bo, 0);
  C.guard(`${v} detector OOD rejections`, ood.filter(detRejects).length, want.do, 0);
  C.guard(`${v} detector false rejections`, non.filter(detRejects).length, want.df, 0);
  C.guard(`${v} baseline false rejections`, non.filter(baseRejects).length, 0, 0);
  const t3 = C.rd('research/results/phase1/phase1_t3_selective_ties.json').versions[v].detection_auroc.ood.pooled_auroc;
  const items = s => D.ids.map(id => ({ score: s(id), pos: D.isOOD(id) }));
  C.guard(`${v} pooled detector AUROC (T3)`, C.r4(C.auroc(items(sDet))), t3);

  // 1. AUROCs and paired stratified bootstrap of the difference
  const aBase = C.auroc(items(sBase)), aDet = C.auroc(items(sDet));
  const rng = C.mulberry32(42), dv = [], bv = [], tv = [];
  for (let b = 0; b < B; b++) {
    const rp = ood.map(() => ood[Math.floor(rng() * ood.length)]), rn = non.map(() => non[Math.floor(rng() * non.length)]);
    const ids = [...rp, ...rn], mk = s => ids.map(id => ({ score: s(id), pos: D.isOOD(id) }));
    const x = C.auroc(mk(sBase)), y = C.auroc(mk(sDet)); bv.push(x); tv.push(y); dv.push(y - x);
  }
  [dv, bv, tv].forEach(a => a.sort((p, q) => p - q));
  const ci = a => [C.r4(C.percentile(a, 0.025)), C.r4(C.percentile(a, 0.975))];

  // 3. in-sample ROC sweep: best OOD rejection at false-rejection rate <= target
  function sweep(s, maxFr) {
    const cands = [...new Set(D.ids.map(s))].sort((a, b) => a - b);
    let best = { ood_rejected: 0, false_rejected: 0 };
    for (const t of cands) { // reject if score >= t
      const fr = non.filter(id => s(id) >= t).length, tp = ood.filter(id => s(id) >= t).length;
      if (fr <= maxFr && tp > best.ood_rejected) best = { ood_rejected: tp, false_rejected: fr };
    }
    return best;
  }
  const targets = { zero: 0, detector_observed: want.df, five_pct: Math.floor(0.05 * non.length), ten_pct: Math.floor(0.10 * non.length) };
  const matched = {};
  for (const [k, maxFr] of Object.entries(targets)) {
    const b0 = sweep(sBase, maxFr), d0 = sweep(sDet, maxFr);
    matched[k] = { max_false_rejections: maxFr, of_non_ood: non.length, baseline_score: { ...b0, rate: C.r4(b0.ood_rejected / ood.length) }, detector_feature: { ...d0, rate: C.r4(d0.ood_rejected / ood.length) } };
  }

  // 4. Nested tuned threshold on the BASELINE's own score, with exactly the detector's protocol
  //    (run_selective_prediction.js): per test fold, sweep observed dev values, predict OOD if the
  //    score is below the threshold, keep the threshold maximizing F1 (OOD = positive) on the 4 dev
  //    folds, apply once to the test fold. This is the fair "stricter threshold" comparator.
  const rawScore = id => repro.get(id).actual.score;
  function f1At(ids, t) { let tp = 0, fp = 0, fn = 0; ids.forEach(id => { const p = rawScore(id) < t, y = D.isOOD(id); if (p && y) tp++; else if (p) fp++; else if (y) fn++; }); const pr = tp + fp ? tp / (tp + fp) : 0, rc = tp + fn ? tp / (tp + fn) : 0; return pr + rc ? 2 * pr * rc / (pr + rc) : 0; }
  const baseThr = [], tunedBaseRejects = new Set();
  for (let k = 0; k < D.folds.k; k++) {
    const dev = D.ids.filter(id => D.folds.assignment[id] !== k), test = D.ids.filter(id => D.folds.assignment[id] === k);
    let best = { t: null, f1: -1 };
    for (const t of [...new Set(dev.map(rawScore))].sort((a, b) => a - b)) { const f = f1At(dev, t); if (f > best.f1) best = { t, f1: f }; }
    baseThr.push(C.r4(best.t)); test.forEach(id => { if (rawScore(id) < best.t) tunedBaseRejects.add(id); });
  }
  const tb = id => tunedBaseRejects.has(id);
  const mcn = (a, b, ids) => { const aOnly = ids.filter(id => a(id) && !b(id)).length, bOnly = ids.filter(id => b(id) && !a(id)).length; return { a_only: aOnly, b_only: bOnly, exact_mcnemar_p: C.p4(C.exactMcNemar(aOnly, bOnly)) }; };
  const nestedBaseline = {
    per_fold_thresholds_raw_bm25: baseThr,
    ood_rejected: C.wilson(ood.filter(tb).length, ood.length), false_rejected: C.wilson(non.filter(tb).length, non.length),
    versus_tuned_detector: { on_ood_detector_vs_tuned_baseline: mcn(detRejects, tb, ood), on_non_ood_false_rejections_detector_vs_tuned_baseline: mcn(detRejects, tb, non) }
  };

  result.versions[v] = {
    n_ood: ood.length, n_non_ood: non.length, nested_tuned_baseline_threshold: nestedBaseline,
    auroc: { baseline_raw_bm25: C.r4(aBase), baseline_ci95: ci(bv), detector_fused_top1: C.r4(aDet), detector_ci95: ci(tv), difference_detector_minus_baseline: C.r4(aDet - aBase), difference_ci95: ci(dv) },
    committed_operating_points: { baseline_rule_bm25_lt_2: { ood_rejected: C.wilson(ood.filter(baseRejects).length, ood.length), false_rejected: C.wilson(non.filter(baseRejects).length, non.length) },
      tuned_detector_nested: { ood_rejected: C.wilson(ood.filter(detRejects).length, ood.length), false_rejected: C.wilson(non.filter(detRejects).length, non.length) } },
    in_sample_matched_false_rejection: matched
  };
}
const guards = C.assertGuards('review_r1_e_ood_operating_points');
writeOut('review_r1_e_ood_operating_points', { task: 'T18 / REV-49: OOD detection as a ranking and at matched false-rejection rates', note: 'Sweep thresholds are chosen in-sample for both scores (descriptive upper bound on equal footing); the committed detector is nested.', bootstrap: { B, seed: 42, method: 'paired, stratified by OOD/non-OOD' }, reproduction_checks: guards, ...result });
for (const [v, R] of Object.entries(result.versions)) {
  console.log(`\n=== ${v} === AUROC baseline ${R.auroc.baseline_raw_bm25} ${JSON.stringify(R.auroc.baseline_ci95)} | detector ${R.auroc.detector_fused_top1} ${JSON.stringify(R.auroc.detector_ci95)} | diff ${R.auroc.difference_detector_minus_baseline} ${JSON.stringify(R.auroc.difference_ci95)}`);
  for (const [k, m] of Object.entries(R.in_sample_matched_false_rejection)) console.log(`  FR<=${m.max_false_rejections}/${m.of_non_ood}: baseline score rejects ${m.baseline_score.ood_rejected}/${R.n_ood} (FR ${m.baseline_score.false_rejected}), detector feature ${m.detector_feature.ood_rejected}/${R.n_ood} (FR ${m.detector_feature.false_rejected})`);
}
