// v0.2 pipeline -- identical nested-CV OOD/ambiguity detection logic to run_selective_prediction.js,
// pointed at v0.2's folds/features (research/results/v0.2/). This is the experiment that
// directly answers whether growing OOD from 15->50 and ambiguous from 14->38 queries gives
// enough statistical power to confirm the OOD improvement Phase 13 could not confirm at n=15.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const folds = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/v0.2/folds.json'), 'utf-8'));
const featData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/v0.2/reliability_features.json'), 'utf-8'));
const features = featData.features;
const byId = new Map(features.map(f => [f.id, f]));
const K = folds.k;

function foldMembers(f) { return Object.entries(folds.assignment).filter(([, ff]) => ff === f).map(([id]) => byId.get(id)); }

function auroc(items, scoreKey, positiveKey, lowerScoreMeansPositive) {
  const pos = items.filter(i => i[positiveKey]);
  const neg = items.filter(i => !i[positiveKey]);
  if (pos.length === 0 || neg.length === 0) return null;
  const rankScore = i => lowerScoreMeansPositive ? -i[scoreKey] : i[scoreKey];
  const all = items.map(i => ({ score: rankScore(i), isPos: i[positiveKey] })).sort((a, b) => a.score - b.score);
  let ranks = new Array(all.length);
  let i = 0;
  while (i < all.length) {
    let j = i;
    while (j + 1 < all.length && all[j + 1].score === all[i].score) j++;
    const avgRank = (i + j) / 2 + 1;
    for (let x = i; x <= j; x++) ranks[x] = avgRank;
    i = j + 1;
  }
  let rankSumPos = 0;
  all.forEach((item, idx) => { if (item.isPos) rankSumPos += ranks[idx]; });
  const u = rankSumPos - (pos.length * (pos.length + 1)) / 2;
  return +(u / (pos.length * neg.length)).toFixed(4);
}

function tuneThreshold(devItems, scoreKey, positiveKey, lowerMeansPositive) {
  const candidateThresholds = [...new Set(devItems.map(i => i[scoreKey]))].sort((a, b) => a - b);
  let best = { threshold: candidateThresholds[0], f1: -1 };
  candidateThresholds.forEach(t => {
    let tp = 0, fp = 0, fn = 0;
    devItems.forEach(i => {
      const predPos = lowerMeansPositive ? i[scoreKey] < t : i[scoreKey] > t;
      if (predPos && i[positiveKey]) tp++;
      else if (predPos && !i[positiveKey]) fp++;
      else if (!predPos && i[positiveKey]) fn++;
    });
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    if (f1 > best.f1) best = { threshold: t, f1, precision, recall };
  });
  return best;
}

function evalAtThreshold(items, scoreKey, positiveKey, lowerMeansPositive, threshold) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  items.forEach(i => {
    const predPos = lowerMeansPositive ? i[scoreKey] < threshold : i[scoreKey] > threshold;
    if (predPos && i[positiveKey]) tp++;
    else if (predPos && !i[positiveKey]) fp++;
    else if (!predPos && i[positiveKey]) fn++;
    else tn++;
  });
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return { tp, fp, fn, tn, precision: +precision.toFixed(4), recall: +recall.toFixed(4), f1: +f1.toFixed(4) };
}

function nestedDetectionExperiment(name, scoreKey, positiveKey, lowerMeansPositive) {
  const perFold = [];
  for (let testFold = 0; testFold < K; testFold++) {
    const testItems = foldMembers(testFold);
    const devItems = [];
    for (let f = 0; f < K; f++) if (f !== testFold) devItems.push(...foldMembers(f));

    const tuned = tuneThreshold(devItems, scoreKey, positiveKey, lowerMeansPositive);
    const testEval = evalAtThreshold(testItems, scoreKey, positiveKey, lowerMeansPositive, tuned.threshold);
    const testAuroc = auroc(testItems, scoreKey, positiveKey, lowerMeansPositive);
    perFold.push({ test_fold: testFold, selected_threshold: tuned.threshold, dev_f1_at_selected_threshold: +tuned.f1.toFixed(4), test: testEval, test_auroc: testAuroc });
  }
  const meanF1 = perFold.reduce((a, f) => a + f.test.f1, 0) / K;
  const validAuroc = perFold.filter(f => f.test_auroc !== null);
  const meanAuroc = validAuroc.length ? validAuroc.reduce((a, f) => a + f.test_auroc, 0) / validAuroc.length : null;
  const totalTp = perFold.reduce((a, f) => a + f.test.tp, 0);
  const totalFp = perFold.reduce((a, f) => a + f.test.fp, 0);
  const totalFn = perFold.reduce((a, f) => a + f.test.fn, 0);
  const totalTn = perFold.reduce((a, f) => a + f.test.tn, 0);
  const pooledPrecision = totalTp + totalFp > 0 ? totalTp / (totalTp + totalFp) : 0;
  const pooledRecall = totalTp + totalFn > 0 ? totalTp / (totalTp + totalFn) : 0;
  const pooledF1 = pooledPrecision + pooledRecall > 0 ? (2 * pooledPrecision * pooledRecall) / (pooledPrecision + pooledRecall) : 0;

  return { name, score_feature: scoreKey, lower_means_positive: lowerMeansPositive, per_fold: perFold, mean_test_f1_across_folds: +meanF1.toFixed(4), mean_test_auroc: meanAuroc !== null ? +meanAuroc.toFixed(4) : null, pooled_confusion: { tp: totalTp, fp: totalFp, fn: totalFn, tn: totalTn }, pooled_precision: +pooledPrecision.toFixed(4), pooled_recall: +pooledRecall.toFixed(4), pooled_f1: +pooledF1.toFixed(4) };
}

function riskCoverageCurve() {
  const sorted = features.slice().sort((a, b) => b.top1_score - a.top1_score);
  const points = [];
  let wrongSoFar = 0;
  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    if (!item.hit) wrongSoFar++;
    points.push({ coverage: +((i + 1) / sorted.length).toFixed(4), risk: +(wrongSoFar / (i + 1)).toFixed(4), threshold_score: item.top1_score });
  }
  return points;
}

function main() {
  const ood = nestedDetectionExperiment('OOD-detection', 'top1_score', 'is_ood', true);
  const ambiguity = nestedDetectionExperiment('Ambiguity-detection', 'margin', 'is_ambiguous', true);
  const riskCoverage = riskCoverageCurve();

  const output = { experiment_id: 'E6-E7-v0.2-selective-prediction', benchmark_version: 'v0.2', protocol: 'nested 5-fold CV, identical to v0.1 protocol', ood_detection: ood, ambiguity_detection: ambiguity, risk_coverage_curve: riskCoverage, generated_at: new Date().toISOString() };

  const outDir = path.join(projectRoot, 'research/results/v0.2');
  fs.writeFileSync(path.join(outDir, 'selective-prediction-results.json'), JSON.stringify(output, null, 2), 'utf-8');

  console.log('=== v0.2 OOD DETECTION (n=50, feature: top1_score) ===');
  console.log(`Mean test F1: ${ood.mean_test_f1_across_folds}, Mean test AUROC: ${ood.mean_test_auroc}`);
  console.log(`Pooled: precision=${ood.pooled_precision} recall=${ood.pooled_recall} f1=${ood.pooled_f1}`);
  console.log(`Pooled confusion: TP=${ood.pooled_confusion.tp} FP=${ood.pooled_confusion.fp} FN=${ood.pooled_confusion.fn} TN=${ood.pooled_confusion.tn}`);

  console.log('\n=== v0.2 AMBIGUITY DETECTION (n=38, feature: margin) ===');
  console.log(`Mean test F1: ${ambiguity.mean_test_f1_across_folds}, Mean test AUROC: ${ambiguity.mean_test_auroc}`);
  console.log(`Pooled: precision=${ambiguity.pooled_precision} recall=${ambiguity.pooled_recall} f1=${ambiguity.pooled_f1}`);

  console.log(`\nWrote ${path.join(outDir, 'selective-prediction-results.json')}`);
}

main();
