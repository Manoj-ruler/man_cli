// v0.2 pipeline -- identical logic to run_ablation_A4_A5.js, using v0.2's already-tuned
// selective-prediction thresholds (research/results/v0.2/selective-prediction-results.json).

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const outDir = path.join(projectRoot, 'research/results/v0.2');

const selResults = JSON.parse(fs.readFileSync(path.join(outDir, 'selective-prediction-results.json'), 'utf-8'));
const featData = JSON.parse(fs.readFileSync(path.join(outDir, 'reliability_features.json'), 'utf-8'));
const folds = JSON.parse(fs.readFileSync(path.join(outDir, 'folds.json'), 'utf-8'));

const byId = new Map(featData.features.map(f => [f.id, f]));
const marginThresholdByFold = new Map(selResults.ambiguity_detection.per_fold.map(f => [f.test_fold, f.selected_threshold]));
const oodThresholdByFold = new Map(selResults.ood_detection.per_fold.map(f => [f.test_fold, f.selected_threshold]));

function runCondition(name, useMarginRule, useOodRule) {
  const perFold = [];
  for (let f = 0; f < folds.k; f++) {
    const ids = Object.entries(folds.assignment).filter(([, ff]) => ff === f).map(([id]) => id);
    const marginT = marginThresholdByFold.get(f);
    const oodT = oodThresholdByFold.get(f);

    let accepted = 0, acceptedHits = 0, rejected = 0, rejectedWasOod = 0, rejectedWasCorrect = 0;
    ids.forEach(id => {
      const item = byId.get(id);
      const rejectByMargin = useMarginRule && item.margin < marginT;
      const rejectByOod = useOodRule && item.top1_score < oodT;
      const reject = rejectByMargin || rejectByOod;
      if (reject) {
        rejected++;
        if (item.is_ood) rejectedWasOod++;
        if (item.hit) rejectedWasCorrect++;
      } else {
        accepted++;
        if (item.hit) acceptedHits++;
      }
    });

    perFold.push({ fold: f, margin_threshold: marginT, ood_threshold: useOodRule ? oodT : null, coverage: +(accepted / ids.length).toFixed(4), selective_accuracy: accepted > 0 ? +(acceptedHits / accepted).toFixed(4) : null, accepted, accepted_hits: acceptedHits, rejected, rejected_was_ood: rejectedWasOod, rejected_was_correct: rejectedWasCorrect });
  }

  const meanCoverage = perFold.reduce((a, f) => a + f.coverage, 0) / folds.k;
  const validSel = perFold.filter(f => f.selective_accuracy !== null);
  const meanSelAcc = validSel.length ? validSel.reduce((a, f) => a + f.selective_accuracy, 0) / validSel.length : null;
  const totalRejectedWasOod = perFold.reduce((a, f) => a + f.rejected_was_ood, 0);
  const totalRejectedWasCorrect = perFold.reduce((a, f) => a + f.rejected_was_correct, 0);

  return { name, per_fold: perFold, mean_coverage: +meanCoverage.toFixed(4), mean_selective_accuracy: meanSelAcc !== null ? +meanSelAcc.toFixed(4) : null, ood_caught_total: totalRejectedWasOod, correct_answers_sacrificed: totalRejectedWasCorrect };
}

const A4 = runCondition('A4', true, false);
const A5 = runCondition('A5', true, true);

const nOod = 50;
console.log(`v0.2 A4: coverage=${(A4.mean_coverage*100).toFixed(1)}% selective_accuracy=${(A4.mean_selective_accuracy*100).toFixed(1)}% OOD caught=${A4.ood_caught_total}/${nOod}`);
console.log(`v0.2 A5: coverage=${(A5.mean_coverage*100).toFixed(1)}% selective_accuracy=${(A5.mean_selective_accuracy*100).toFixed(1)}% OOD caught=${A5.ood_caught_total}/${nOod}`);

const ablationResults = JSON.parse(fs.readFileSync(path.join(outDir, 'ablation-results.json'), 'utf-8'));
ablationResults.conditions.A4 = A4;
ablationResults.conditions.A5 = A5;
ablationResults.table = ablationResults.table.map(row => {
  if (row.condition === 'A4') return { condition: 'A4', description: 'Hybrid + margin-based rejection', mean_coverage_pct: +(A4.mean_coverage*100).toFixed(1), mean_selective_accuracy_pct: +(A4.mean_selective_accuracy*100).toFixed(1), ood_caught: `${A4.ood_caught_total}/${nOod}` };
  if (row.condition === 'A5') return { condition: 'A5', description: 'Hybrid + margin + OOD detection', mean_coverage_pct: +(A5.mean_coverage*100).toFixed(1), mean_selective_accuracy_pct: +(A5.mean_selective_accuracy*100).toFixed(1), ood_caught: `${A5.ood_caught_total}/${nOod}` };
  return row;
});
fs.writeFileSync(path.join(outDir, 'ablation-results.json'), JSON.stringify(ablationResults, null, 2), 'utf-8');
console.log('\nUpdated v0.2 ablation-results.json with A4/A5.');
