// v0.2 pipeline -- re-run the Phase 13 OOD significance test (baseline vs. Phase-7-tuned OOD
// detector) on v0.2's 50-query OOD subset (vs. v0.1's 15), using the identical exact (binomial)
// McNemar's test. This is the specific question this whole v0.2 expansion was built to answer:
// does more data give this comparison enough statistical power?

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));

function logChoose(n, k) {
  if (k < 0 || k > n) return -Infinity;
  let r = 0;
  for (let i = 0; i < k; i++) r += Math.log(n - i) - Math.log(i + 1);
  return r;
}
function binomProb(n, k, p) { return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)); }
function binomCdf(n, k, p) { let s = 0; for (let i = 0; i <= k; i++) s += binomProb(n, i, p); return s; }
function exactMcNemar(b, c) {
  const n = b + c;
  if (n === 0) return { b, c, n_discordant: 0, p_value: 1.0 };
  const k = Math.min(b, c);
  const p = Math.min(1, 2 * binomCdf(n, k, 0.5));
  return { b, c, n_discordant: n, p_value: +p.toFixed(6) };
}

function wilsonCI(successes, n, z = 1.96) {
  if (n === 0) return { point: 0, lower: 0, upper: 0 };
  const p = successes / n;
  const denom = 1 + (z * z) / n;
  const center = (p + (z * z) / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return { point: +p.toFixed(4), lower: +Math.max(0, center - margin).toFixed(4), upper: +Math.min(1, center + margin).toFixed(4) };
}

function main() {
  const baselineRepro = read('research/results/v0.2/reproduction-results.json');
  const folds = read('research/results/v0.2/folds.json');
  const selPred = read('research/results/v0.2/selective-prediction-results.json');
  const relFeat = read('research/results/v0.2/reliability_features.json').features;

  const thresholdByFold = new Map(selPred.ood_detection.per_fold.map(f => [f.test_fold, f.selected_threshold]));
  const relFeatById = new Map(relFeat.map(f => [f.id, f]));

  const oodIds = baselineRepro.filter(r => r.expected.classification === 'OOD').map(r => r.id);
  const baselineOodReject = new Map(baselineRepro.filter(r => r.expected.classification === 'OOD').map(r => [r.id, r.evaluation.status === 'OOD_CORRECT_REJECTION']));
  const tunedOodReject = new Map();
  oodIds.forEach(id => {
    const fold = folds.assignment[id];
    const threshold = thresholdByFold.get(fold);
    const score = relFeatById.get(id).top1_score;
    tunedOodReject.set(id, score < threshold);
  });

  let bBase = 0, bTuned = 0, bothCorrect = 0, bothWrong = 0;
  oodIds.forEach(id => {
    const base = baselineOodReject.get(id), tuned = tunedOodReject.get(id);
    if (base && tuned) bothCorrect++;
    else if (base && !tuned) bBase++;
    else if (!base && tuned) bTuned++;
    else bothWrong++;
  });
  const test = exactMcNemar(bBase, bTuned);

  const baselineRate = [...baselineOodReject.values()].filter(Boolean).length / oodIds.length;
  const tunedRate = [...tunedOodReject.values()].filter(Boolean).length / oodIds.length;

  const output = {
    experiment_id: 'E12-v0.2-statistical-analysis-OOD',
    benchmark_version: 'v0.2', n_ood: oodIds.length,
    baseline_rejection_rate: +baselineRate.toFixed(4),
    tuned_rejection_rate: +tunedRate.toFixed(4),
    contingency: { both_correctly_rejected: bothCorrect, baseline_only_correct: bBase, tuned_only_correct: bTuned, both_wrong: bothWrong },
    mcnemar_exact: test,
    significant_at_0_05: test.p_value < 0.05,
    confidence_intervals_95pct: {
      v0_1_baseline_rejection_rate_for_reference: wilsonCI(4, 15),
      v0_2_baseline_rejection_rate: wilsonCI([...baselineOodReject.values()].filter(Boolean).length, oodIds.length),
      v0_2_tuned_rejection_rate: wilsonCI([...tunedOodReject.values()].filter(Boolean).length, oodIds.length)
    },
    comparison_to_v0_1: { v0_1_n: 15, v0_1_p_value: 0.25, v0_1_significant: false, v0_2_n: oodIds.length, v0_2_p_value: test.p_value, v0_2_significant: test.p_value < 0.05 },
    generated_at: new Date().toISOString()
  };

  const outDir = path.join(projectRoot, 'research/results/v0.2');
  fs.writeFileSync(path.join(outDir, 'statistical-analysis-results.json'), JSON.stringify(output, null, 2), 'utf-8');

  console.log('=== v0.2 OOD SIGNIFICANCE TEST (n=' + oodIds.length + ') ===');
  console.log(`Baseline rejection: ${(baselineRate * 100).toFixed(1)}%  Tuned rejection: ${(tunedRate * 100).toFixed(1)}%`);
  console.log(`Contingency: both_correct=${bothCorrect} baseline_only=${bBase} tuned_only=${bTuned} both_wrong=${bothWrong}`);
  console.log(`Discordant pairs: ${test.n_discordant}, exact McNemar p=${test.p_value}`);
  console.log(`SIGNIFICANT at alpha=0.05: ${test.p_value < 0.05}`);
  console.log(`\nComparison: v0.1 (n=15) p=0.25 not significant  ->  v0.2 (n=${oodIds.length}) p=${test.p_value} ${test.p_value < 0.05 ? 'SIGNIFICANT' : 'not significant'}`);
  console.log(`\nWrote ${path.join(outDir, 'statistical-analysis-results.json')}`);
}

main();
