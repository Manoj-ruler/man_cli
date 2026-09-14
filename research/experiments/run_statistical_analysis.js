// Phase 13 (E12) -- paired significance testing (exact McNemar's test) for every meaningful
// system-vs-system comparison already measured in Phases 4-8, plus 95% Wilson-score confidence
// intervals for headline proportions. Exact (binomial-based) McNemar's is used rather than the
// chi-square approximation, per the plan's explicit instruction to avoid overclaiming
// significance on a small (n=135 non-OOD / n=15 OOD) dataset.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));

// --- Exact McNemar's test (two-sided), via the binomial distribution on discordant pairs ---
function logChoose(n, k) {
  if (k < 0 || k > n) return -Infinity;
  let r = 0;
  for (let i = 0; i < k; i++) r += Math.log(n - i) - Math.log(i + 1);
  return r;
}
function binomProb(n, k, p) {
  return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
}
function binomCdf(n, k, p) {
  let s = 0;
  for (let i = 0; i <= k; i++) s += binomProb(n, i, p);
  return s;
}
function exactMcNemar(b, c) {
  const n = b + c;
  if (n === 0) return { b, c, n_discordant: 0, p_value: 1.0, note: 'no discordant pairs -- systems agree on every query, test undefined/trivially non-significant' };
  const k = Math.min(b, c);
  // two-sided exact p-value: 2 * P(X <= k) under Binomial(n, 0.5), capped at 1
  const p = Math.min(1, 2 * binomCdf(n, k, 0.5));
  return { b, c, n_discordant: n, p_value: +p.toFixed(6) };
}

// --- Wilson score 95% CI for a proportion ---
function wilsonCI(successes, n, z = 1.96) {
  if (n === 0) return { lower: 0, upper: 0 };
  const p = successes / n;
  const denom = 1 + (z * z) / n;
  const center = (p + (z * z) / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return { point: +p.toFixed(4), lower: +Math.max(0, center - margin).toFixed(4), upper: +Math.min(1, center + margin).toFixed(4) };
}

function main() {
  // --- Load per-query hit maps for A0-A3 from the ablation results (non-OOD, n=135) ---
  const ablation = read('research/results/ablation/ablation-results.json');
  // IMPORTANT: A0/A1/A2's per_query arrays include ALL 150 queries (OOD included, where hit is
  // always false since there's no gold command to match) -- must filter to non-OOD explicitly,
  // caught via a direct cross-check against the known-correct 71.9%/72.7% accuracy figures
  // before trusting any p-value computed from this data.
  function hitMap(condition) {
    const rows = ablation.conditions[condition].per_query;
    const m = new Map();
    rows.forEach(r => { if (r.classification !== 'OOD') m.set(r.id, r.hit); });
    return m;
  }
  const A0 = hitMap('A0'), A1 = hitMap('A1'), A2 = hitMap('A2'), A3 = hitMap('A3');
  const ids135 = [...A0.keys()];

  function pairedMcNemar(nameA, mapA, nameB, mapB) {
    let bothCorrect = 0, aOnlyCorrect = 0, bOnlyCorrect = 0, bothWrong = 0;
    ids135.forEach(id => {
      const a = mapA.get(id), b = mapB.get(id);
      if (a && b) bothCorrect++;
      else if (a && !b) aOnlyCorrect++;
      else if (!a && b) bOnlyCorrect++;
      else bothWrong++;
    });
    const test = exactMcNemar(aOnlyCorrect, bOnlyCorrect);
    const accA = (bothCorrect + aOnlyCorrect) / ids135.length;
    const accB = (bothCorrect + bOnlyCorrect) / ids135.length;
    return {
      comparison: `${nameA} vs ${nameB}`, n: ids135.length,
      accuracy_A: +accA.toFixed(4), accuracy_B: +accB.toFixed(4), absolute_diff: +(accB - accA).toFixed(4),
      contingency: { both_correct: bothCorrect, [`${nameA}_only_correct`]: aOnlyCorrect, [`${nameB}_only_correct`]: bOnlyCorrect, both_wrong: bothWrong },
      mcnemar_exact: test,
      significant_at_0_05: test.p_value < 0.05
    };
  }

  const comparisons = [
    pairedMcNemar('A0', A0, 'A1', A1),
    pairedMcNemar('A0', A0, 'A2', A2),
    pairedMcNemar('A0', A0, 'A3', A3),
    pairedMcNemar('A2', A2, 'A3', A3)
  ];

  // --- OOD rejection: baseline vs Phase-7-tuned detector, paired on the same 15 OOD queries ---
  const baselineRepro = read('research/results/baseline/reproduction-results.json');
  const folds = read('research/results/hybrid/folds.json');
  const selPred = read('research/results/reliability/selective-prediction-results.json');
  const relFeat = read('research/results/reliability/reliability_features.json').features;

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

  let bBase = 0, bTuned = 0, bothCorrectOod = 0, bothWrongOod = 0;
  oodIds.forEach(id => {
    const base = baselineOodReject.get(id), tuned = tunedOodReject.get(id);
    if (base && tuned) bothCorrectOod++;
    else if (base && !tuned) bBase++;
    else if (!base && tuned) bTuned++;
    else bothWrongOod++;
  });
  const oodTest = exactMcNemar(bBase, bTuned);
  const oodComparison = {
    comparison: 'baseline OOD rejection vs Phase-7-tuned OOD detection', n: oodIds.length,
    baseline_rejection_rate: +(baselineRepro.filter(r => r.expected.classification === 'OOD' && r.evaluation.status === 'OOD_CORRECT_REJECTION').length / 15).toFixed(4),
    tuned_rejection_rate: +([...tunedOodReject.values()].filter(Boolean).length / 15).toFixed(4),
    contingency: { both_correctly_rejected: bothCorrectOod, baseline_only_correct: bBase, tuned_only_correct: bTuned, both_wrong: bothWrongOod },
    mcnemar_exact: oodTest,
    significant_at_0_05: oodTest.p_value < 0.05,
    caveat: 'n=15 is very small; exact test is appropriate but power is low -- a non-significant result here would not prove no difference, only that this sample cannot detect one confidently'
  };

  // --- 95% Wilson CIs for headline proportions ---
  const confidenceIntervals = {
    A0_bm25_baseline_accuracy: wilsonCI([...A0.values()].filter(Boolean).length, 135),
    A2_dense_accuracy: wilsonCI([...A2.values()].filter(Boolean).length, 135),
    A3_hybrid_accuracy: wilsonCI([...A3.values()].filter(Boolean).length, 135),
    ood_baseline_rejection_rate: wilsonCI(4, 15),
    ood_tuned_rejection_rate: wilsonCI([...tunedOodReject.values()].filter(Boolean).length, 15)
  };

  const output = {
    experiment_id: 'E12-statistical-analysis',
    method: 'Exact (binomial) two-sided McNemar\'s test on discordant pairs; Wilson score 95% CIs for proportions. No chi-square approximation used given small sample sizes.',
    accuracy_comparisons: comparisons,
    ood_rejection_comparison: oodComparison,
    confidence_intervals_95pct: confidenceIntervals,
    generated_at: new Date().toISOString()
  };

  const outDir = path.join(projectRoot, 'research/results/final');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'statistical-analysis-results.json'), JSON.stringify(output, null, 2), 'utf-8');

  console.log('=== ACCURACY COMPARISONS (exact McNemar\'s, n=135 non-OOD) ===');
  comparisons.forEach(c => console.log(`${c.comparison}: ${(c.accuracy_A*100).toFixed(1)}% vs ${(c.accuracy_B*100).toFixed(1)}% (diff=${(c.absolute_diff*100).toFixed(1)}pp), discordant=${c.mcnemar_exact.n_discordant}, p=${c.mcnemar_exact.p_value}, significant=${c.significant_at_0_05}`));

  console.log('\n=== OOD REJECTION COMPARISON (n=15) ===');
  console.log(`baseline=${(oodComparison.baseline_rejection_rate*100).toFixed(1)}% tuned=${(oodComparison.tuned_rejection_rate*100).toFixed(1)}%, discordant=${oodTest.n_discordant}, p=${oodTest.p_value}, significant=${oodComparison.significant_at_0_05}`);

  console.log('\n=== 95% WILSON CONFIDENCE INTERVALS ===');
  Object.entries(confidenceIntervals).forEach(([k, v]) => console.log(`${k}: ${(v.point*100).toFixed(1)}% [${(v.lower*100).toFixed(1)}%, ${(v.upper*100).toFixed(1)}%]`));

  console.log(`\nWrote ${path.join(outDir, 'statistical-analysis-results.json')}`);
}

main();
