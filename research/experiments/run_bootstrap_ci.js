// Spec §8.2 -- percentile bootstrap 95% CIs (10,000 resamples, seed 42) for the results that the
// audit flagged as reported without CIs: the A0->A3 accuracy delta and the calibration ECE
// (before/after, hybrid_reliability variant). Runs on BOTH benchmark versions. Reconstructs the
// pooled nested-CV calibration pairs the same way run_calibration.js does, so the bootstrapped
// ECE matches the point estimate already committed.
//
// Bootstrap semantics:
//  - Accuracy delta: PAIRED bootstrap over non-OOD query ids (resample ids with replacement;
//    each system scored on the same resample) -> CI on acc(sys2)-acc(sys1).
//  - ECE: bootstrap over the pooled held-out (confidence,hit) predictions (resample pairs with
//    replacement) -> CI on ECE before and after calibration. This is a CI on the pooled-prediction
//    ECE estimate, documented as such.

const fs = require('fs');
const path = require('path');
const isotonic = require('./isotonic');

const projectRoot = path.join(__dirname, '..', '..');
const N_BOOT = 10000;
const SEED = 42;

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function percentile(sortedArr, p) {
  const idx = (sortedArr.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi] - sortedArr[lo]) * (idx - lo);
}

function ece(pairs, nBins = 10) {
  const bins = Array.from({ length: nBins }, () => ({ sumConf: 0, sumHit: 0, count: 0 }));
  pairs.forEach(({ conf, hit }) => {
    let idx = Math.floor(conf * nBins); if (idx >= nBins) idx = nBins - 1; if (idx < 0) idx = 0;
    bins[idx].sumConf += conf; bins[idx].sumHit += hit; bins[idx].count += 1;
  });
  const total = pairs.length; let gap = 0;
  bins.forEach(b => { if (b.count > 0) gap += (b.count / total) * Math.abs((b.sumConf / b.count) - (b.sumHit / b.count)); });
  return gap;
}

// Reconstruct pooled held-out (conf,hit) pairs for hybrid_reliability (top1_score -> hit),
// nested-CV isotonic, identical protocol to run_calibration.js.
function reconstructCalibrationPairs(paths) {
  const folds = JSON.parse(fs.readFileSync(paths.folds, 'utf-8'));
  const feats = JSON.parse(fs.readFileSync(paths.reliability, 'utf-8')).features;
  const rawOf = new Map(feats.map(f => [f.id, f.top1_score]));
  const hitOf = new Map(feats.map(f => [f.id, f.hit ? 1 : 0]));
  const allIds = Object.keys(folds.assignment);
  const K = folds.k;
  const before = [], after = [];
  for (let testFold = 0; testFold < K; testFold++) {
    const testIds = allIds.filter(id => folds.assignment[id] === testFold);
    const devIds = allIds.filter(id => folds.assignment[id] !== testFold);
    const blocks = isotonic.fit(devIds.map(id => ({ x: rawOf.get(id), y: hitOf.get(id) })));
    testIds.forEach(id => {
      before.push({ conf: rawOf.get(id), hit: hitOf.get(id) });
      after.push({ conf: isotonic.predict(blocks, rawOf.get(id)), hit: hitOf.get(id) });
    });
  }
  return { before, after };
}

function bootstrapAccuracyDelta(perQueryA, perQueryB, rng) {
  // paired over non-OOD ids present in both
  const aMap = new Map(perQueryA.filter(r => r.classification !== 'OOD').map(r => [r.id, r.hit ? 1 : 0]));
  const bMap = new Map(perQueryB.filter(r => r.classification !== 'OOD').map(r => [r.id, r.hit ? 1 : 0]));
  const ids = [...aMap.keys()].filter(id => bMap.has(id));
  const n = ids.length;
  const deltas = [];
  for (let b = 0; b < N_BOOT; b++) {
    let sa = 0, sb = 0;
    for (let i = 0; i < n; i++) {
      const id = ids[Math.floor(rng() * n)];
      sa += aMap.get(id); sb += bMap.get(id);
    }
    deltas.push((sb - sa) / n);
  }
  deltas.sort((x, y) => x - y);
  const pointA = [...aMap.values()].reduce((a, b) => a + b, 0) / n;
  const pointB = [...bMap.values()].reduce((a, b) => a + b, 0) / n;
  return { n, point_delta: +(pointB - pointA).toFixed(4), ci_lower: +percentile(deltas, 0.025).toFixed(4), ci_upper: +percentile(deltas, 0.975).toFixed(4) };
}

function bootstrapEce(pairs, rng) {
  const n = pairs.length;
  const eces = [];
  for (let b = 0; b < N_BOOT; b++) {
    const resample = new Array(n);
    for (let i = 0; i < n; i++) resample[i] = pairs[Math.floor(rng() * n)];
    eces.push(ece(resample));
  }
  eces.sort((x, y) => x - y);
  return { point: +ece(pairs).toFixed(4), ci_lower: +percentile(eces, 0.025).toFixed(4), ci_upper: +percentile(eces, 0.975).toFixed(4) };
}

// Paired bootstrap one-sided p-value for "calibration reduces ECE" (H0: reduction <= 0).
// before[i] and after[i] are the SAME held-out prediction id, so resample a shared index set.
function bootstrapEceReductionP(before, after, rng) {
  const n = before.length;
  let nNonPositive = 0;
  const reductions = [];
  for (let b = 0; b < N_BOOT; b++) {
    const idx = new Array(n);
    for (let i = 0; i < n; i++) idx[i] = Math.floor(rng() * n);
    const rb = idx.map(i => before[i]);
    const ra = idx.map(i => after[i]);
    const red = ece(rb) - ece(ra);
    reductions.push(red);
    if (red <= 0) nNonPositive++;
  }
  reductions.sort((x, y) => x - y);
  return {
    point_reduction: +(ece(before) - ece(after)).toFixed(4),
    ci_lower: +percentile(reductions, 0.025).toFixed(4),
    ci_upper: +percentile(reductions, 0.975).toFixed(4),
    one_sided_p: +Math.max(1 / N_BOOT, nNonPositive / N_BOOT).toFixed(6)
  };
}

function runVersion(label, paths) {
  const rng = mulberry32(SEED);
  const ablation = JSON.parse(fs.readFileSync(paths.ablation, 'utf-8'));
  const A0 = ablation.conditions.A0.per_query, A2 = ablation.conditions.A2.per_query, A3 = ablation.conditions.A3.per_query;

  const accDelta_A0_A3 = bootstrapAccuracyDelta(A0, A3, rng);
  const accDelta_A2_A3 = bootstrapAccuracyDelta(A2, A3, rng);

  const calPairs = reconstructCalibrationPairs(paths);
  const eceBefore = bootstrapEce(calPairs.before, rng);
  const eceAfter = bootstrapEce(calPairs.after, rng);
  const eceReduction = bootstrapEceReductionP(calPairs.before, calPairs.after, rng);

  return {
    benchmark: label, n_bootstrap: N_BOOT, seed: SEED,
    accuracy_delta_A0_to_A3: accDelta_A0_A3,
    accuracy_delta_A2_to_A3: accDelta_A2_A3,
    ece_hybrid_reliability_before: eceBefore,
    ece_hybrid_reliability_after: eceAfter,
    ece_reduction_paired: eceReduction
  };
}

const v01 = runVersion('v0.1', {
  ablation: path.join(projectRoot, 'research/results/ablation/ablation-results.json'),
  folds: path.join(projectRoot, 'research/results/hybrid/folds.json'),
  reliability: path.join(projectRoot, 'research/results/reliability/reliability_features.json')
});
const v02 = runVersion('v0.2', {
  ablation: path.join(projectRoot, 'research/results/v0.2/ablation-results.json'),
  folds: path.join(projectRoot, 'research/results/v0.2/folds.json'),
  reliability: path.join(projectRoot, 'research/results/v0.2/reliability_features.json')
});

const out = { experiment_id: 'bootstrap-ci', method: 'percentile bootstrap, 10k resamples, seed 42; paired over non-OOD ids for accuracy deltas; over pooled held-out predictions for ECE', versions: [v01, v02], generated_at: new Date().toISOString() };
const outDir = path.join(projectRoot, 'research/results/stats');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'bootstrap-ci-results.json'), JSON.stringify(out, null, 2), 'utf-8');

[v01, v02].forEach(v => {
  console.log(`\n=== ${v.benchmark} ===`);
  console.log(`  acc delta A0->A3: ${(v.accuracy_delta_A0_to_A3.point_delta*100).toFixed(1)}pp  95% CI [${(v.accuracy_delta_A0_to_A3.ci_lower*100).toFixed(1)}, ${(v.accuracy_delta_A0_to_A3.ci_upper*100).toFixed(1)}]`);
  console.log(`  acc delta A2->A3: ${(v.accuracy_delta_A2_to_A3.point_delta*100).toFixed(1)}pp  95% CI [${(v.accuracy_delta_A2_to_A3.ci_lower*100).toFixed(1)}, ${(v.accuracy_delta_A2_to_A3.ci_upper*100).toFixed(1)}]`);
  console.log(`  ECE before: ${v.ece_hybrid_reliability_before.point}  95% CI [${v.ece_hybrid_reliability_before.ci_lower}, ${v.ece_hybrid_reliability_before.ci_upper}]`);
  console.log(`  ECE after:  ${v.ece_hybrid_reliability_after.point}  95% CI [${v.ece_hybrid_reliability_after.ci_lower}, ${v.ece_hybrid_reliability_after.ci_upper}]`);
  console.log(`  ECE reduction (paired): ${v.ece_reduction_paired.point_reduction}  95% CI [${v.ece_reduction_paired.ci_lower}, ${v.ece_reduction_paired.ci_upper}]  one-sided p=${v.ece_reduction_paired.one_sided_p}`);
});
console.log(`\nWrote research/results/stats/bootstrap-ci-results.json`);
