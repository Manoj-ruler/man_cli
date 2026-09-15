// Spec §5.2 -- Split B: intent-held-out generalization evaluation on v0.2 (GroupKFold by derived
// intent_group_id). No intent group appears in both a tuning fold and its test fold, so alpha,
// OOD/ambiguity thresholds, and the calibrator are all selected on queries targeting DIFFERENT
// command intents than those they are scored on. This tests whether the reliability layer
// generalizes to unseen intents, or merely overfits thresholds to frequently-targeted commands.
//
// Fully self-contained: reuses hybrid_fusion.fuseQuery and isotonic; recomputes candidate
// features under Split-B-selected alphas (Split A's cached features used Split-A alphas, so they
// cannot be reused here). Operates on the already-frozen v0.2 query_scores_cache -- no new data.
//
// intent_group_id derivation (documented, deterministic):
//   answerable (gold_command present) -> group = gold_command
//   ambiguous (no gold, acceptable_commands present) -> group = sorted(acceptable).join('|')
//   OOD (no gold, no acceptable) -> group = 'OOD::' + id (singleton; OOD targets no intent)

const fs = require('fs');
const path = require('path');
const { fuseQuery } = require('./hybrid_fusion');
const isotonic = require('./isotonic');

const projectRoot = path.join(__dirname, '..', '..');
const v2Dir = path.join(projectRoot, 'research/results/v0.2');
const cache = JSON.parse(fs.readFileSync(path.join(v2Dir, 'query_scores_cache.json'), 'utf-8'));
const byId = new Map(cache.queries.map(q => [q.id, q]));
const ALPHA_GRID = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const K = 5;

function groupKey(q) {
  if (q.gold_command) return q.gold_command;
  if (Array.isArray(q.acceptable_commands) && q.acceptable_commands.length) return q.acceptable_commands.slice().sort().join('|');
  return 'OOD::' + q.id;
}
function isMatch(entry, cmd) {
  const valid = new Set([entry.gold_command, ...(entry.acceptable_commands || [])].filter(Boolean));
  return valid.has(cmd);
}

// --- GroupKFold: greedy largest-group-to-smallest-fold; guarantees no group split across folds ---
function buildGroupKFold() {
  const groups = new Map();
  cache.queries.forEach(q => {
    const g = groupKey(q);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(q.id);
  });
  const groupList = [...groups.entries()].sort((a, b) => b[1].length - a[1].length || (a[0] < b[0] ? -1 : 1));
  const folds = Array.from({ length: K }, () => []);
  const foldSizes = new Array(K).fill(0);
  const assignment = {};
  const groupToFold = {};
  groupList.forEach(([g, ids]) => {
    let f = 0;
    for (let k = 1; k < K; k++) if (foldSizes[k] < foldSizes[f]) f = k;
    ids.forEach(id => { assignment[id] = f; folds[f].push(id); });
    foldSizes[f] += ids.length;
    groupToFold[g] = f;
  });
  return { groups, groupList, assignment, foldSizes, groupToFold };
}

function evaluateAlphaAcc(queryIds, alpha) {
  let tot = 0, hits = 0;
  queryIds.forEach(id => {
    const e = byId.get(id);
    if (e.expected_classification === 'OOD') return;
    tot++;
    const { top1 } = fuseQuery(e, alpha);
    if (top1 && isMatch(e, top1.command)) hits++;
  });
  return tot ? hits / tot : 0;
}

function auroc(items, scoreKey, posKey, lowerMeansPos) {
  const pos = items.filter(i => i[posKey]), neg = items.filter(i => !i[posKey]);
  if (!pos.length || !neg.length) return null;
  const rs = i => lowerMeansPos ? -i[scoreKey] : i[scoreKey];
  const all = items.map(i => ({ s: rs(i), p: i[posKey] })).sort((a, b) => a.s - b.s);
  const ranks = new Array(all.length); let i = 0;
  while (i < all.length) { let j = i; while (j + 1 < all.length && all[j + 1].s === all[i].s) j++; const r = (i + j) / 2 + 1; for (let x = i; x <= j; x++) ranks[x] = r; i = j + 1; }
  let rsum = 0; all.forEach((it, idx) => { if (it.p) rsum += ranks[idx]; });
  const u = rsum - pos.length * (pos.length + 1) / 2;
  return u / (pos.length * neg.length);
}
function tuneThreshold(dev, key, posKey, lowerMeansPos) {
  const cands = [...new Set(dev.map(i => i[key]))].sort((a, b) => a - b);
  let best = { t: cands[0], f1: -1 };
  cands.forEach(t => {
    let tp = 0, fp = 0, fn = 0;
    dev.forEach(i => { const pp = lowerMeansPos ? i[key] < t : i[key] > t; if (pp && i[posKey]) tp++; else if (pp && !i[posKey]) fp++; else if (!pp && i[posKey]) fn++; });
    const pr = tp + fp ? tp / (tp + fp) : 0, rc = tp + fn ? tp / (tp + fn) : 0, f1 = pr + rc ? 2 * pr * rc / (pr + rc) : 0;
    if (f1 > best.f1) best = { t, f1 };
  });
  return best.t;
}
function ece(pairs, nb = 10) {
  const b = Array.from({ length: nb }, () => ({ c: 0, h: 0, n: 0 }));
  pairs.forEach(({ conf, hit }) => { let i = Math.floor(conf * nb); if (i >= nb) i = nb - 1; if (i < 0) i = 0; b[i].c += conf; b[i].h += hit; b[i].n++; });
  let g = 0; pairs.length && b.forEach(x => { if (x.n) g += (x.n / pairs.length) * Math.abs(x.c / x.n - x.h / x.n); }); return g;
}

function main() {
  const gk = buildGroupKFold();

  // Split registry + leakage assertion
  const foldOfGroup = {};
  let leak = 0;
  gk.groupList.forEach(([g, ids]) => {
    const folds = new Set(ids.map(id => gk.assignment[id]));
    if (folds.size > 1) leak++;
    foldOfGroup[g] = [...folds][0];
  });
  if (leak > 0) { console.error(`FATAL: ${leak} groups split across folds -- GroupKFold invariant violated`); process.exit(1); }

  // Per-fold: select alpha on dev (other groups' queries), build features for test queries at that alpha
  const features = []; // out-of-fold reliability features under Split B
  const perFoldAcc = [];
  for (let tf = 0; tf < K; tf++) {
    const testIds = Object.entries(gk.assignment).filter(([, f]) => f === tf).map(([id]) => id);
    const devIds = Object.entries(gk.assignment).filter(([, f]) => f !== tf).map(([id]) => id);
    let bestAlpha = null, bestAcc = -1;
    for (const a of ALPHA_GRID) {
      const acc = evaluateAlphaAcc(devIds, a);
      if (acc > bestAcc || (acc === bestAcc && Math.abs(a - 0.5) < Math.abs(bestAlpha - 0.5))) { bestAcc = acc; bestAlpha = a; }
    }
    let tot = 0, hits = 0;
    testIds.forEach(id => {
      const e = byId.get(id);
      const { ranked } = fuseQuery(e, bestAlpha);
      const top1 = ranked[0], top2 = ranked[1] || { fused: 0 };
      const hit = top1 ? isMatch(e, top1.command) : false;
      features.push({ id, alpha: bestAlpha, top1_command: top1 ? top1.command : null, top1_score: top1 ? top1.fused : 0, margin: top1 ? (top1.fused - top2.fused) : 0, hit, expected_classification: e.expected_classification, is_ood: e.expected_classification === 'OOD', is_ambiguous: e.expected_classification === 'AMBIGUOUS' });
      if (e.expected_classification !== 'OOD') { tot++; if (hit) hits++; }
    });
    perFoldAcc.push({ test_fold: tf, selected_alpha: bestAlpha, non_ood_accuracy: tot ? +(hits / tot).toFixed(4) : 0, non_ood_total: tot });
  }
  const featById = new Map(features.map(f => [f.id, f]));
  const meanAcc = perFoldAcc.reduce((a, f) => a + f.non_ood_accuracy, 0) / K;

  // Nested OOD + ambiguity detection under Split B folds
  function nestedDetect(scoreKey, posKey, lowerMeansPos) {
    let tp = 0, fp = 0, fn = 0, tn = 0; const aurocs = [];
    for (let tf = 0; tf < K; tf++) {
      const test = Object.entries(gk.assignment).filter(([, f]) => f === tf).map(([id]) => featById.get(id));
      const dev = Object.entries(gk.assignment).filter(([, f]) => f !== tf).map(([id]) => featById.get(id));
      const t = tuneThreshold(dev, scoreKey, posKey, lowerMeansPos);
      test.forEach(i => { const pp = lowerMeansPos ? i[scoreKey] < t : i[scoreKey] > t; if (pp && i[posKey]) tp++; else if (pp && !i[posKey]) fp++; else if (!pp && i[posKey]) fn++; else tn++; });
      const a = auroc(test, scoreKey, posKey, lowerMeansPos); if (a !== null) aurocs.push(a);
    }
    const pr = tp + fp ? tp / (tp + fp) : 0, rc = tp + fn ? tp / (tp + fn) : 0;
    return { precision: +pr.toFixed(4), recall: +rc.toFixed(4), f1: +(pr + rc ? 2 * pr * rc / (pr + rc) : 0).toFixed(4), mean_auroc: aurocs.length ? +(aurocs.reduce((a, b) => a + b, 0) / aurocs.length).toFixed(4) : null, confusion: { tp, fp, fn, tn } };
  }
  const ood = nestedDetect('top1_score', 'is_ood', true);
  const amb = nestedDetect('margin', 'is_ambiguous', true);

  // Calibration under Split B (isotonic top1_score->hit, nested)
  const before = [], after = [];
  for (let tf = 0; tf < K; tf++) {
    const test = Object.entries(gk.assignment).filter(([, f]) => f === tf).map(([id]) => featById.get(id));
    const dev = Object.entries(gk.assignment).filter(([, f]) => f !== tf).map(([id]) => featById.get(id));
    const blocks = isotonic.fit(dev.map(d => ({ x: d.top1_score, y: d.hit ? 1 : 0 })));
    test.forEach(d => { before.push({ conf: d.top1_score, hit: d.hit ? 1 : 0 }); after.push({ conf: isotonic.predict(blocks, d.top1_score), hit: d.hit ? 1 : 0 }); });
  }
  const eceBefore = +ece(before).toFixed(4), eceAfter = +ece(after).toFixed(4);

  // Split A references (from committed v0.2 files) for the A->B generalization delta
  const splitA_hybrid = JSON.parse(fs.readFileSync(path.join(v2Dir, 'hybrid-nested-cv-results.json'), 'utf-8')).aggregate.mean_test_non_ood_accuracy;
  const splitA_sel = JSON.parse(fs.readFileSync(path.join(v2Dir, 'selective-prediction-results.json'), 'utf-8'));
  const splitA_cal = JSON.parse(fs.readFileSync(path.join(v2Dir, 'calibration-results.json'), 'utf-8')).variants.hybrid_reliability;

  const out = {
    experiment_id: 'E-GEN-splitB-v0.2', split: 'GroupKFold by intent_group_id (intent-held-out)', k: K,
    group_count: gk.groups.size, fold_sizes: gk.foldSizes, groups_split_across_folds: leak,
    per_fold_alpha_and_acc: perFoldAcc,
    splitB: {
      hybrid_non_ood_accuracy: +meanAcc.toFixed(4),
      ood_detection: ood, ambiguity_detection: amb,
      calibration_ece_before: eceBefore, calibration_ece_after: eceAfter
    },
    splitA_reference: {
      hybrid_non_ood_accuracy: splitA_hybrid,
      ood_auroc: splitA_sel.ood_detection.mean_test_auroc, ood_f1: splitA_sel.ood_detection.pooled_f1,
      ambiguity_f1: splitA_sel.ambiguity_detection.pooled_f1,
      calibration_ece_before: splitA_cal.before_calibration.ece, calibration_ece_after: splitA_cal.after_calibration.ece
    },
    generalization_delta: {
      hybrid_accuracy: +(meanAcc - splitA_hybrid).toFixed(4),
      ood_auroc: ood.mean_auroc !== null ? +(ood.mean_auroc - splitA_sel.ood_detection.mean_test_auroc).toFixed(4) : null,
      calibration_ece_after: +(eceAfter - splitA_cal.after_calibration.ece).toFixed(4)
    },
    generated_at: new Date().toISOString()
  };

  fs.writeFileSync(path.join(v2Dir, 'split-b-results.json'), JSON.stringify(out, null, 2), 'utf-8');
  fs.writeFileSync(path.join(v2Dir, 'splits-b-registry.json'), JSON.stringify({ split: 'GroupKFold-intent', k: K, group_count: gk.groups.size, fold_sizes: gk.foldSizes, groups_split_across_folds: leak, assignment: gk.assignment, group_to_fold: foldOfGroup }, null, 2), 'utf-8');

  console.log('=== Split B (intent-held-out GroupKFold) on v0.2 ===');
  console.log(`groups: ${gk.groups.size}, fold sizes: [${gk.foldSizes}], groups split across folds: ${leak} (must be 0)`);
  console.log(`Hybrid non-OOD acc:  Split B ${(meanAcc*100).toFixed(1)}%  vs  Split A ${(splitA_hybrid*100).toFixed(1)}%  (delta ${((meanAcc-splitA_hybrid)*100).toFixed(1)}pp)`);
  console.log(`OOD detection:       Split B AUROC ${ood.mean_auroc} F1 ${ood.f1}  vs  Split A AUROC ${splitA_sel.ood_detection.mean_test_auroc} F1 ${splitA_sel.ood_detection.pooled_f1}`);
  console.log(`Ambiguity F1:        Split B ${amb.f1}  vs  Split A ${splitA_sel.ambiguity_detection.pooled_f1}`);
  console.log(`Calibration ECE:     Split B ${eceBefore}->${eceAfter}  vs  Split A ${splitA_cal.before_calibration.ece}->${splitA_cal.after_calibration.ece}`);
  console.log(`\nWrote split-b-results.json + splits-b-registry.json`);
}

main();
