// Spec §5.2 -- Split B on v0.1, for symmetry with the v0.2 Split B analysis
// (run_split_b_v0_2.js). Identical protocol and identical intent_group_id derivation, applied to
// the FROZEN v0.1 benchmark's cached query scores. v0.1's own result files
// (research/results/hybrid/, research/results/reliability/, research/calibration/) are read
// but never modified; outputs go to a new, additive research/results/v0.1/ directory so the
// frozen v0.1 artifact tree is untouched.
//
// Expected honest caveat before running: v0.1 has only 15 OOD queries (vs. v0.2's 50) and 14
// ambiguous queries (vs. v0.2's 38) -- distributing these as GroupKFold singletons/groups across
// 5 folds leaves very few OOD/ambiguous examples per dev pool for nested threshold tuning, so
// Split B's OOD/ambiguity detection numbers on v0.1 are expected to be noisier than on v0.2. This
// is the same underpowering already documented for Split A's v0.1 OOD comparison (n=15, p=0.25)
// showing up again here, not a new problem introduced by this script.
//
// intent_group_id derivation (identical to run_split_b_v0_2.js):
//   answerable (gold_command present) -> group = gold_command
//   ambiguous (no gold, acceptable_commands present) -> group = sorted(acceptable).join('|')
//   OOD (no gold, no acceptable) -> group = 'OOD::' + id (singleton; OOD targets no intent)

const fs = require('fs');
const path = require('path');
const { fuseQuery } = require('./hybrid_fusion');
const isotonic = require('./isotonic');

const projectRoot = path.join(__dirname, '..', '..');
const cache = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/hybrid/query_scores_cache.json'), 'utf-8'));
const byId = new Map(cache.queries.map(q => [q.id, q]));
const ALPHA_GRID = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const K = 5;

const outDir = path.join(projectRoot, 'research/results/v0.1');

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

  const features = [];
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

  const before = [], after = [];
  for (let tf = 0; tf < K; tf++) {
    const test = Object.entries(gk.assignment).filter(([, f]) => f === tf).map(([id]) => featById.get(id));
    const dev = Object.entries(gk.assignment).filter(([, f]) => f !== tf).map(([id]) => featById.get(id));
    const blocks = isotonic.fit(dev.map(d => ({ x: d.top1_score, y: d.hit ? 1 : 0 })));
    test.forEach(d => { before.push({ conf: d.top1_score, hit: d.hit ? 1 : 0 }); after.push({ conf: isotonic.predict(blocks, d.top1_score), hit: d.hit ? 1 : 0 }); });
  }
  const eceBefore = +ece(before).toFixed(4), eceAfter = +ece(after).toFixed(4);

  // Split A references, read from v0.1's EXISTING (untouched) result files, scattered across
  // their original locations rather than a single v0.1/ directory (that layout predates v0.2's).
  const splitA_hybrid = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/hybrid/hybrid-nested-cv-results.json'), 'utf-8')).aggregate.mean_test_non_ood_accuracy;
  const splitA_sel = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/reliability/selective-prediction-results.json'), 'utf-8'));
  const splitA_cal = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/calibration/calibration-results.json'), 'utf-8')).variants.hybrid_reliability;

  const out = {
    experiment_id: 'E-GEN-splitB-v0.1', split: 'GroupKFold by intent_group_id (intent-held-out)', k: K,
    group_count: gk.groups.size, fold_sizes: gk.foldSizes, groups_split_across_folds: leak,
    caveat: 'v0.1 has only 15 OOD and 14 ambiguous queries; GroupKFold nested-CV dev pools for these classes are thin (~3/fold test, ~12/fold dev for OOD). OOD/ambiguity detection numbers here are expected to be noisier than the v0.2 Split B analysis for this reason -- the same underpowering already documented for Split A (n=15, p=0.25), not a new artifact.',
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

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'split-b-results.json'), JSON.stringify(out, null, 2), 'utf-8');
  fs.writeFileSync(path.join(outDir, 'splits-b-registry.json'), JSON.stringify({ split: 'GroupKFold-intent', k: K, group_count: gk.groups.size, fold_sizes: gk.foldSizes, groups_split_across_folds: leak, assignment: gk.assignment, group_to_fold: foldOfGroup }, null, 2), 'utf-8');

  console.log('=== Split B (intent-held-out GroupKFold) on v0.1 ===');
  console.log(`groups: ${gk.groups.size}, fold sizes: [${gk.foldSizes}], groups split across folds: ${leak} (must be 0)`);
  console.log(`Hybrid non-OOD acc:  Split B ${(meanAcc*100).toFixed(1)}%  vs  Split A ${(splitA_hybrid*100).toFixed(1)}%  (delta ${((meanAcc-splitA_hybrid)*100).toFixed(1)}pp)`);
  console.log(`OOD detection:       Split B AUROC ${ood.mean_auroc} F1 ${ood.f1}  vs  Split A AUROC ${splitA_sel.ood_detection.mean_test_auroc} F1 ${splitA_sel.ood_detection.pooled_f1}`);
  console.log(`Ambiguity F1:        Split B ${amb.f1}  vs  Split A ${splitA_sel.ambiguity_detection.pooled_f1}`);
  console.log(`Calibration ECE:     Split B ${eceBefore}->${eceAfter}  vs  Split A ${splitA_cal.before_calibration.ece}->${splitA_cal.after_calibration.ece}`);
  console.log(`\nWrote ${path.join(outDir, 'split-b-results.json')} + splits-b-registry.json`);
}

main();
