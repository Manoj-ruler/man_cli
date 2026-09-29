// S11 / REV-23 (review round 1, suggested; approved by the author 2026-09-29): do the headline results
// depend on the one fold partition (seed 42)?
//
// For each of 20 fold seeds (42 and 1..19), rebuild the stratified 5-fold partition exactly as
// build_folds.js / build_folds_v0_2.js do (class from the human review decision, else the query-type
// fallback; classes in sorted order; mulberry32(seed) Fisher-Yates shuffle within class; round-robin
// fold assignment), then re-run every fold-dependent step of the committed protocol:
//   - hybrid alpha per test fold: grid 0.0-1.0, maximize non-OOD accuracy on the 4 dev folds, ties go
//     to the alpha closest to 0.5 (run_hybrid.js); each query's fused top-1 command and score use the
//     alpha of its own fold;
//   - isotonic recalibration of the shipped and the hybrid confidence, fit on dev folds, controls
//     excluded from fit and evaluation (phase1_t1 "controls_excluded_fit_and_eval");
//   - the tuned shipped threshold (raw BM25) and the hybrid detector (fused top-1): per test fold, the
//     F1-maximizing threshold over observed dev values, lowest on ties, "reject if score < t";
//   - accuracy of hybrid vs BM25 and vs dense (exact McNemar), tie-aware AURC and AUGRC, correctness
//     AUROC -- all on non-control queries, as in the paper's Table 1.
// The shipped score, BM25 and dense answers do not depend on the partition; only the steps above do.
// Seed 42 must reproduce the committed numbers exactly (guards) before anything is written.
// Point estimates only (no per-seed bootstrap). Output: research/results/seed_repeat/seed_repeat_cv.json.
const fs = require('fs'), path = require('path');
const C = require('./phase1_common');
const isotonic = require('./isotonic');
const { fuseQuery } = require('./hybrid_fusion');

const SEEDS = [42, ...Array.from({ length: 19 }, (_, i) => i + 1)];
const K = 5, ALPHA_GRID = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const CFG = {
  'v0.1': { cache: 'research/results/hybrid/query_scores_cache.json', review: 'research/datasets/review/human_review_results.json' },
  'v0.2': { cache: 'research/results/v0.2/query_scores_cache.json', review: 'research/datasets/review/human_review_results_v0.2.json' }
};

function shuffle(a, rng) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function buildFolds(D, reviewMap, seed) {
  const byClass = {};
  D.queries.forEach(q => { const r = reviewMap.get(q.id); const cls = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT')); (byClass[cls] = byClass[cls] || []).push(q.id); });
  const rng = C.mulberry32(seed), a = {};
  Object.keys(byClass).sort().forEach(cls => shuffle(byClass[cls], rng).forEach((id, i) => { a[id] = i % K; }));
  return a;
}
// tie-aware selective metrics (phase1_t3 / phase1_t3b)
function expectedErrors(items) { const s = items.slice().sort((a, b) => b.conf - a.conf); const E = [0]; let i = 0, before = 0; while (i < s.length) { let j = i; while (j + 1 < s.length && s[j + 1].conf === s[i].conf) j++; const size = j - i + 1, errs = s.slice(i, j + 1).reduce((x, y) => x + y.err, 0); for (let t = 1; t <= size; t++) E.push(before + errs * t / size); before += errs; i = j + 1; } return E; }
const aurcOf = it => { const E = expectedErrors(it); let s = 0; for (let k = 1; k < E.length; k++) s += E[k] / k; return s / (E.length - 1); };
const augrcOf = it => { const E = expectedErrors(it), n = E.length - 1; let s = 0; for (let k = 1; k <= n; k++) s += (E[k - 1] + E[k]) / 2; return s / (n * n); };
function tuneLowerMeansPositive(dev, score, isPos) { // F1-maximizing threshold, "positive if score < t", lowest t on ties
  let best = { t: null, f1: -1 };
  for (const t of [...new Set(dev.map(score))].sort((a, b) => a - b)) {
    let tp = 0, fp = 0, fn = 0; dev.forEach(id => { const p = score(id) < t, y = isPos(id); if (p && y) tp++; else if (p) fp++; else if (y) fn++; });
    const pr = tp + fp ? tp / (tp + fp) : 0, rc = tp + fn ? tp / (tp + fn) : 0, f1 = pr + rc ? 2 * pr * rc / (pr + rc) : 0;
    if (f1 > best.f1) best = { t, f1 };
  }
  return best.t;
}
const median = a => { const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

const result = { seeds: SEEDS, versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const cache = new Map(C.rd(CFG[v].cache).queries.map(q => [q.id, q]));
  const reviewMap = new Map(C.rd(CFG[v].review).map(r => [r.id, r]));
  const isMatch = (e, cmd) => new Set([e.gold_command, ...(e.acceptable_commands || [])].filter(Boolean)).has(cmd);
  const ctrl = D.isCanonical, ood = D.isOOD, ids = D.ids, nonCtl = ids.filter(id => !ctrl(id));
  const repro = new Map(D.repro.map(r => [r.id, r]));
  const rawBM25 = id => repro.get(id).actual.score;
  const shippedConf = id => D.variants.baseline_confidence.rawOf.get(id), shippedHit = id => D.variants.baseline_confidence.hitOf.get(id);
  const denseHit = new Map(D.cands.filter(c => c.system === 'dense').map(c => [c.id, isMatch(cache.get(c.id), c.top1_command) ? 1 : 0]));
  // fused result per (query, alpha), computed once; the score is rounded to 4 decimals because the
  // committed pipeline stores features that way (build_reliability_features*.js) and thresholds and
  // calibrates on the stored values
  const fused = new Map(); ids.forEach(id => fused.set(id, new Map(ALPHA_GRID.map(a => { const r = fuseQuery(cache.get(id), a); return [a, { cmd: r.top1 && r.top1.command, score: +r.topScore.toFixed(4) }]; }))));
  const hybHitAt = (id, a) => (!ood(id) && isMatch(cache.get(id), fused.get(id).get(a).cmd)) ? 1 : 0;

  const perSeed = [];
  for (const seed of SEEDS) {
    const assign = buildFolds(D, reviewMap, seed);
    const foldOf = id => assign[id];
    // 1. alpha per fold
    const alphaOfFold = [];
    for (let k = 0; k < K; k++) {
      const dev = ids.filter(id => foldOf(id) !== k && !ood(id));
      let best = null, bestAcc = -1;
      for (const a of ALPHA_GRID) { const acc = dev.filter(id => hybHitAt(id, a)).length / dev.length; if (acc > bestAcc || (acc === bestAcc && Math.abs(a - 0.5) < Math.abs(best - 0.5))) { bestAcc = acc; best = a; } }
      alphaOfFold.push(best);
    }
    const hybScore = id => fused.get(id).get(alphaOfFold[foldOf(id)]).score, hybHit = id => hybHitAt(id, alphaOfFold[foldOf(id)]);
    // 2. isotonic recalibration, controls excluded from fit and evaluation
    const recal = (conf, hit) => { const before = [], after = []; for (let k = 0; k < K; k++) { const blocks = isotonic.fit(nonCtl.filter(id => foldOf(id) !== k).map(id => ({ x: conf(id), y: hit(id) }))); nonCtl.filter(id => foldOf(id) === k).forEach(id => { before.push({ conf: conf(id), hit: hit(id) }); after.push({ conf: isotonic.predict(blocks, conf(id)), hit: hit(id) }); }); } const b = C.eceOf(before), a = C.eceOf(after); return { ece_before: b, ece_after: a, reduction: 1 - a / b }; };
    const shipped = recal(shippedConf, shippedHit), hybrid = recal(hybScore, hybHit);
    // 3. out-of-scope rules
    const rej = { tuned: new Set(), detector: new Set() };
    for (let k = 0; k < K; k++) {
      const dev = ids.filter(id => foldOf(id) !== k), test = ids.filter(id => foldOf(id) === k);
      const tB = tuneLowerMeansPositive(dev, rawBM25, ood), tD = tuneLowerMeansPositive(dev, hybScore, ood);
      test.forEach(id => { if (rawBM25(id) < tB) rej.tuned.add(id); if (hybScore(id) < tD) rej.detector.add(id); });
    }
    const fixedRej = id => !(repro.get(id).actual.confidence > 0 && rawBM25(id) >= 2.0);
    const oodIds = ids.filter(ood), inScope = nonCtl.filter(id => !ood(id));
    const cnt = (f, set) => set.filter(f).length;
    const oods = { fixed: cnt(fixedRej, oodIds), tuned: cnt(id => rej.tuned.has(id), oodIds), detector: cnt(id => rej.detector.has(id), oodIds),
      fr_fixed: cnt(fixedRej, inScope), fr_tuned: cnt(id => rej.tuned.has(id), inScope), fr_detector: cnt(id => rej.detector.has(id), inScope),
      controls_rejected: cnt(id => rej.tuned.has(id) || rej.detector.has(id), ids.filter(ctrl)) };
    const mcn = (a, b, set) => C.exactMcNemar(set.filter(id => a(id) && !b(id)).length, set.filter(id => b(id) && !a(id)).length);
    oods.p_detector_vs_fixed = mcn(id => rej.detector.has(id), fixedRej, oodIds);
    oods.p_tuned_vs_detector = mcn(id => rej.tuned.has(id), id => rej.detector.has(id), oodIds);
    // 4. accuracy and ranking, non-control
    const hitsH = cnt(hybHit, inScope), hitsB = cnt(shippedHit, inScope), hitsD = cnt(id => denseHit.get(id), inScope);
    const acc = { n: inScope.length, hybrid: hitsH, bm25: hitsB, dense: hitsD,
      gain_vs_bm25_pp: 100 * (hitsH - hitsB) / inScope.length, p_vs_bm25: mcn(hybHit, shippedHit, inScope),
      gain_vs_dense_pp: 100 * (hitsH - hitsD) / inScope.length, p_vs_dense: mcn(hybHit, id => denseHit.get(id), inScope) };
    const items = (conf, hit) => nonCtl.map(id => ({ conf: conf(id), err: hit(id) ? 0 : 1 }));
    const iH = items(hybScore, hybHit), iB = items(shippedConf, shippedHit);
    const rank = { aurc_diff: aurcOf(iH) - aurcOf(iB), augrc_diff: augrcOf(iH) - augrcOf(iB),
      corr_auroc_diff: C.auroc(iH.map(x => ({ score: x.conf, pos: !x.err }))) - C.auroc(iB.map(x => ({ score: x.conf, pos: !x.err }))) };
    perSeed.push({ seed, alpha_per_fold: alphaOfFold, shipped_recal: shipped, hybrid_recal: hybrid, ood: oods, accuracy: acc, ranking: rank,
      _check: { assign, hitsAll: cnt(hybHit, ids.filter(id => !ood(id))), scores: ids.map(id => [id, hybScore(id)]) } });
  }

  // guards: seed 42 reproduces the committed pipeline
  const s42 = perSeed[0], g = (l, got, want, tol) => C.guard(`${v} seed 42 ${l}`, got, want, tol);
  g('fold assignment', JSON.stringify(Object.entries(s42._check.assign).sort()), JSON.stringify(Object.entries(D.folds.assignment).sort()));
  g('alpha per fold', JSON.stringify(s42.alpha_per_fold), JSON.stringify(C.rd({ 'v0.1': 'research/results/hybrid/hybrid-nested-cv-results.json', 'v0.2': 'research/results/v0.2/hybrid-nested-cv-results.json' }[v]).aggregate.selected_alpha_per_fold));
  g('hybrid non-OOD hits (all)', s42._check.hitsAll, C.rd('research/results/phase1/phase1_t1_controls_excluded.json').versions[v].accuracy.A3.all.hits, 0);
  g('fused top-1 scores = committed features (max abs diff)', Math.max(...s42._check.scores.map(([id, s]) => Math.abs(s - D.featById.get(id).top1_score))), 0, 1e-9);
  const b = C.rd('research/results/review_r1/review_r1_b_calibration.json').versions[v];
  g('shipped ECE after', C.r4(s42.shipped_recal.ece_after), b.baseline_confidence.controls_excluded.isotonic.ece_equal_width_10);
  g('hybrid ECE after', C.r4(s42.hybrid_recal.ece_after), b.hybrid_reliability.controls_excluded.isotonic.ece_equal_width_10);
  const e = C.rd('research/results/review_r1/review_r1_e_ood_operating_points.json').versions[v];
  g('OOD fixed', s42.ood.fixed, e.committed_operating_points.baseline_rule_bm25_lt_2.ood_rejected.k, 0);
  g('OOD tuned', s42.ood.tuned, e.nested_tuned_baseline_threshold.ood_rejected.k, 0);
  g('OOD detector', s42.ood.detector, e.committed_operating_points.tuned_detector_nested.ood_rejected.k, 0);
  g('FR tuned', s42.ood.fr_tuned, e.controls_excluded.false_rejected.tuned_shipped_threshold, 0);
  g('FR detector', s42.ood.fr_detector, e.controls_excluded.false_rejected.hybrid_detector, 0);
  const t1 = C.rd('research/results/phase1/phase1_t1_controls_excluded.json').versions[v];
  g('hybrid hits (non-control)', s42.accuracy.hybrid, t1.accuracy.A3.controls_excluded.hits, 0);
  g('BM25 hits (non-control)', s42.accuracy.bm25, t1.accuracy.A0.controls_excluded.hits, 0);
  g('dense hits (non-control)', s42.accuracy.dense, t1.accuracy.A2.controls_excluded.hits, 0);
  g('McNemar hybrid vs BM25', C.r4(s42.accuracy.p_vs_bm25), C.r4(t1.comparisons.BM25_to_hybrid.controls_excluded.exact_mcnemar_p), 1e-4);
  const t3 = C.rd('research/results/phase1/phase1_t3_selective_ties.json').versions[v].selective.controls_excluded;
  g('AURC diff', C.r4(s42.ranking.aurc_diff), t3.aurc_difference_hybrid_minus_baseline.point);
  g('AUGRC diff', C.r4(s42.ranking.augrc_diff), C.rd('research/results/phase1/phase1_t3b_augrc.json').versions[v].controls_excluded.augrc_difference_hybrid_minus_baseline.point);
  g('correctness AUROC diff', C.r4(s42.ranking.corr_auroc_diff), C.rd('research/results/review_r1/review_r1_c_ranking.json').versions[v].controls_excluded.difference);

  // summaries over the 20 seeds
  const col = f => perSeed.map(f), sm = (f, dp = 4) => { const a = col(f); return { median: C.r4(median(a)), min: C.r4(Math.min(...a)), max: C.r4(Math.max(...a)) }; };
  const share = f => `${col(f).filter(Boolean).length}/${perSeed.length}`;
  result.versions[v] = {
    summary: {
      shipped_ece_after: sm(s => s.shipped_recal.ece_after), shipped_reduction: sm(s => s.shipped_recal.reduction),
      hybrid_ece_after: sm(s => s.hybrid_recal.ece_after), hybrid_reduction: sm(s => s.hybrid_recal.reduction),
      // reference: the committed seed-42 noise-floor 95th percentiles (review_r1_b). The shipped
      // confidences do not change with the partition; the hybrid's change only where alpha changes.
      noise_floor_p95_reference: { shipped: b.baseline_confidence.controls_excluded.noise_floor_perfectly_calibrated.equal_width_10.p95, hybrid: b.hybrid_reliability.controls_excluded.noise_floor_perfectly_calibrated.equal_width_10.p95 },
      seeds_shipped_within_floor_p95: share(s => s.shipped_recal.ece_after <= b.baseline_confidence.controls_excluded.noise_floor_perfectly_calibrated.equal_width_10.p95),
      seeds_hybrid_within_floor_p95: share(s => s.hybrid_recal.ece_after <= b.hybrid_reliability.controls_excluded.noise_floor_perfectly_calibrated.equal_width_10.p95),
      ood_tuned: sm(s => s.ood.tuned), ood_detector: sm(s => s.ood.detector), fr_tuned: sm(s => s.ood.fr_tuned), fr_detector: sm(s => s.ood.fr_detector),
      seeds_tuned_rejects_more_ood_than_detector: share(s => s.ood.tuned > s.ood.detector),
      seeds_detector_vs_fixed_p_lt_05: share(s => s.ood.p_detector_vs_fixed < 0.05),
      seeds_tuned_vs_detector_p_lt_05: share(s => s.ood.p_tuned_vs_detector < 0.05),
      controls_ever_rejected: col(s => s.ood.controls_rejected).reduce((a, x) => a + x, 0),
      gain_vs_bm25_pp: sm(s => s.accuracy.gain_vs_bm25_pp), p_vs_bm25: sm(s => s.accuracy.p_vs_bm25), seeds_p_vs_bm25_lt_05: share(s => s.accuracy.p_vs_bm25 < 0.05),
      gain_vs_dense_pp: sm(s => s.accuracy.gain_vs_dense_pp), p_vs_dense: sm(s => s.accuracy.p_vs_dense), seeds_p_vs_dense_lt_05: share(s => s.accuracy.p_vs_dense < 0.05),
      aurc_diff: sm(s => s.ranking.aurc_diff), seeds_aurc_diff_negative: share(s => s.ranking.aurc_diff < 0),
      augrc_diff: sm(s => s.ranking.augrc_diff), seeds_augrc_diff_negative: share(s => s.ranking.augrc_diff < 0),
      corr_auroc_diff: sm(s => s.ranking.corr_auroc_diff), seeds_corr_auroc_diff_positive: share(s => s.ranking.corr_auroc_diff > 0),
      alpha_values_seen: [...new Set(col(s => s.alpha_per_fold).flat())].sort()
    },
    per_seed: perSeed.map(({ _check, ...rest }) => rest)
  };
}
const guards = C.assertGuards('seed_repeat_cv');
const OUT = path.join(C.root, 'research/results/seed_repeat');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'seed_repeat_cv.json'), JSON.stringify({ status: 'post hoc, exploratory (S11 / REV-23, approved 2026-09-29)', generated_by: 'research/experiments/seed_repeat_cv.js',
  note: 'Point estimates per fold seed; no per-seed bootstrap. Seed 42 reproduces the committed pipeline (guards). Non-control population as in the paper Table 1.', reproduction_checks: guards, ...result, generated_at: new Date().toISOString() }, null, 2));
for (const [v, R] of Object.entries(result.versions)) console.log(`\n=== ${v} ===\n` + JSON.stringify(R.summary, null, 1));
