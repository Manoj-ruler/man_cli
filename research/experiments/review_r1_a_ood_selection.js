// T18 / REV-14 (review round 1): how much could the v0.2 OOD selection procedure inflate the OOD result?
//
// Facts established first (guards):
//   - all 35 drafted OOD candidates were accepted unchanged (v0.2_candidates.json vs the benchmark);
//   - the adjudication report's "never exceeds" values: top-1 BM25 7.39 and top-1 cosine 0.31 over the
//     35 added OOD queries (they are observed maxima, not pre-set cut-offs);
//   - the T2 detection counts (detector 9/15 and 25/35, baseline 4/15 and 13/35).
// Then:
//   1. raw-score profile of each group (original 15 OOD, added 35 OOD, non-OOD), incl. how many
//      queries in each group would pass the "screen" (BM25 <= 7.39 and cosine <= 0.31);
//   2. rates (not counts) per OOD group with Wilson CIs, and the detector-minus-baseline gain per group
//      with a bootstrap CI for the difference in gains between groups;
//   3. how strongly the raw screening scores relate to the detector's feature (the fused,
//      per-query-normalized top-1 score; T19): Spearman correlations and the detector feature's
//      distribution inside vs outside the screen, among non-OOD queries;
//   4. per-fold detector thresholds (fused scale) next to the fraction of each group below them.
const fs = require('fs');
const path = require('path');
const { C, writeOut, rawTopScores } = require('./review_r1_common');
const B = 10000;

const D = C.load('v0.2');
const raw = rawTopScores('v0.2');
const drafts = C.rd('research/datasets/v0.2_candidates.json').ood_candidates;
const num = id => +id.slice(4);
const ood = D.ids.filter(D.isOOD), non = D.ids.filter(id => !D.isOOD(id));
const orig = ood.filter(id => num(id) <= 150), added = ood.filter(id => num(id) > 150);

// ---- guards ----
C.guard('drafted OOD candidates', drafts.length, 35, 0);
C.guard('added OOD queries identical to drafts', added.filter(id => drafts.includes(D.qById.get(id).query)).length, 35, 0);
C.guard('max top-1 BM25 over added OOD (report: 7.39)', +Math.max(...added.map(id => raw.get(id).bm25)).toFixed(2), 7.39, 0.005);
C.guard('max top-1 cosine over added OOD (report: 0.31)', +Math.max(...added.map(id => raw.get(id).cos)).toFixed(2), 0.31, 0.005);
const t2 = C.rd('research/results/phase1/phase1_t2_ood_breakdown.json').versions['v0.2'].groups;
const g = name => t2.find(x => x.group.startsWith(name));
// per-query detector decisions, reconstructed exactly as T2 does: fold threshold on top1_score
const thr = D.selective.ood_detection.per_fold.map(f => f.selected_threshold);
const detRejects = id => D.featById.get(id).top1_score < thr[D.folds.assignment[id]];
const baseRejects = id => { const r = D.repro.find(x => x.id === id); return !(r.actual.confidence > 0 && r.actual.score >= 2.0); };
C.guard('detector rejects, original 15', orig.filter(detRejects).length, g('source: original').tuned_rejects.k, 0);
C.guard('detector rejects, added 35', added.filter(detRejects).length, g('source: added').tuned_rejects.k, 0);
C.guard('baseline rejects, original 15', orig.filter(baseRejects).length, g('source: original').baseline_rejects.k, 0);
C.guard('baseline rejects, added 35', added.filter(baseRejects).length, g('source: added').baseline_rejects.k, 0);
C.guard('detector false rejections (11/159)', non.filter(detRejects).length, 11, 0);

// ---- 1. raw-score profile ----
const screen = id => raw.get(id).bm25 <= 7.39 && raw.get(id).cos <= 0.31;
const q = (arr, p) => { const s = arr.slice().sort((a, b) => a - b); return +s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))].toFixed(3); };
const profile = ids => ({ n: ids.length, bm25_median: q(ids.map(id => raw.get(id).bm25), 0.5), bm25_max: +Math.max(...ids.map(id => raw.get(id).bm25)).toFixed(3),
  cos_median: q(ids.map(id => raw.get(id).cos), 0.5), cos_max: +Math.max(...ids.map(id => raw.get(id).cos)).toFixed(3),
  pass_screen: C.wilson(ids.filter(screen).length, ids.length) });
const nonCtl = non.filter(id => !D.isCanonical(id));
const profiles = { original_ood_15: profile(orig), added_ood_35: profile(added), non_ood_159: profile(non), non_ood_controls_excluded_134: profile(nonCtl) };

// ---- 2. rates and gain difference ----
const rates = ids => ({ detector: C.wilson(ids.filter(detRejects).length, ids.length), baseline: C.wilson(ids.filter(baseRejects).length, ids.length),
  gain_pp: C.r4(100 * (ids.filter(detRejects).length - ids.filter(baseRejects).length) / ids.length) });
const gain = ids => (ids.filter(detRejects).length - ids.filter(baseRejects).length) / ids.length;
// stratified bootstrap: resample within each group
const rng = C.mulberry32(42), diffs = [];
for (let b = 0; b < B; b++) {
  const rs = arr => arr.map(() => arr[Math.floor(rng() * arr.length)]);
  diffs.push(100 * (gain(rs(added)) - gain(rs(orig))));
}
diffs.sort((a, b) => a - b);
const gainDiff = { added_minus_original_pp: C.r4(100 * (gain(added) - gain(orig))), ci95: [C.r4(C.percentile(diffs, 0.025)), C.r4(C.percentile(diffs, 0.975))] };

// ---- 3. raw screening scores vs the detector's fused feature ----
function spearman(x, y) {
  const rank = v => { const idx = v.map((a, i) => [a, i]).sort((a, b) => a[0] - b[0]); const r = new Array(v.length); let i = 0;
    while (i < idx.length) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1; i = j + 1; } return r; };
  const rx = rank(x), ry = rank(y), n = x.length, mx = rx.reduce((a, b) => a + b, 0) / n, my = ry.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (rx[i] - mx) * (ry[i] - my); sxx += (rx[i] - mx) ** 2; syy += (ry[i] - my) ** 2; }
  return C.r4(sxy / Math.sqrt(sxx * syy));
}
const fused = id => D.featById.get(id).top1_score;
const relation = {
  spearman_all_209: { bm25_vs_fused: spearman(D.ids.map(id => raw.get(id).bm25), D.ids.map(fused)), cos_vs_fused: spearman(D.ids.map(id => raw.get(id).cos), D.ids.map(fused)) },
  spearman_non_ood_159: { bm25_vs_fused: spearman(non.map(id => raw.get(id).bm25), non.map(fused)), cos_vs_fused: spearman(non.map(id => raw.get(id).cos), non.map(fused)) },
  non_ood_inside_screen: { n: non.filter(screen).length, detector_rejects: C.wilson(non.filter(screen).filter(detRejects).length, non.filter(screen).length), fused_median: non.filter(screen).length ? q(non.filter(screen).map(fused), 0.5) : null },
  non_ood_outside_screen: { n: non.filter(id => !screen(id)).length, detector_rejects: C.wilson(non.filter(id => !screen(id)).filter(detRejects).length, non.filter(id => !screen(id)).length), fused_median: q(non.filter(id => !screen(id)).map(fused), 0.5) },
  share_top1_score_exactly_1: { ood_original: C.wilson(orig.filter(id => fused(id) === 1).length, orig.length), ood_added: C.wilson(added.filter(id => fused(id) === 1).length, added.length), non_ood: C.wilson(non.filter(id => fused(id) === 1).length, non.length) }
};

// ---- 4. per-fold thresholds ----
const perFold = thr.map((t, k) => ({ fold: k, threshold: t, original_ood_in_fold: orig.filter(id => D.folds.assignment[id] === k).length, added_ood_in_fold: added.filter(id => D.folds.assignment[id] === k).length }));

const guards = C.assertGuards('review_r1_a_ood_selection');
const result = {
  task: 'T18 / REV-14: OOD selection effect (v0.2)',
  facts: { drafted_ood_candidates: 35, accepted_unchanged: 35, discarded: 0, edited: 0,
    note: 'The 7.39 / 0.31 values are the maxima observed over the 35 added OOD queries after drafting (v0.2_ADJUDICATION_REPORT.md: "never exceeds"), used to confirm OOD status; no candidate was discarded or edited, so the screen selected nothing out. Any selection effect would have to come from how candidates were drafted, not from filtering.' },
  detector_feature_note: 'The OOD detector thresholds the hybrid fused top-1 score (per-query min-max normalized; 1.0 when BM25 and dense top-1 agree), not raw BM25 or cosine (see research/paper/T19_IMPLEMENTATION_FACTS.md). The baseline rejects on raw BM25 < 2.0.',
  profiles, rates: { original_ood_15: rates(orig), added_ood_35: rates(added), all_ood_50: rates(ood) }, gain_difference: gainDiff,
  relation_raw_screen_vs_detector_feature: relation, per_fold_thresholds: perFold,
  bootstrap: { B, seed: 42, method: 'stratified within group' }, reproduction_checks: guards
};
writeOut('review_r1_a_ood_selection', result);
console.log(JSON.stringify({ profiles, rates: result.rates, gainDiff, relation }, null, 1));
