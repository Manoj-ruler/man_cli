// Phase 7 continuation -- fills in ablation rows A4 (hybrid + margin-based rejection) and
// A5 (hybrid + margin + OOD detection), which Phase 5 left explicitly PENDING because the
// margin/OOD components did not exist yet. Reuses the exact per-fold thresholds already
// selected in run_selective_prediction.js's nested CV -- does not retune anything here.
//
// A4 definition (stated explicitly, since "+margin" is otherwise ambiguous): reject (abstain)
// any query whose hybrid margin falls below that fold's ambiguity-detection threshold. This is
// a deliberate reuse of the ambiguity threshold as a general "low separation -> don't answer"
// rule, not a new margin threshold tuned for a different purpose.
// A5 definition: A4's rule OR reject if top1_score falls below that fold's OOD-detection
// threshold (i.e. reject on low absolute match quality too).
//
// Metric: SELECTIVE accuracy (accuracy among accepted queries only) and coverage (fraction of
// queries accepted), since abstention changes what "accuracy" even means -- reporting only a
// coverage-blind accuracy number would hide the abstention cost/benefit tradeoff.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const outDir = path.join(projectRoot, 'research/results/ablation');

const selResults = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/reliability/selective-prediction-results.json'), 'utf-8'));
const featData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/reliability/reliability_features.json'), 'utf-8'));
const folds = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/hybrid/folds.json'), 'utf-8'));

const byId = new Map(featData.features.map(f => [f.id, f]));

// per-fold thresholds already selected on dev-only data in Phase 7 -- reused verbatim
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
        if (item.hit) rejectedWasCorrect++; // cost: a query that would have been answered correctly, now abstained
      } else {
        accepted++;
        if (item.hit) acceptedHits++;
      }
    });

    perFold.push({
      fold: f, margin_threshold: marginT, ood_threshold: useOodRule ? oodT : null,
      coverage: +(accepted / ids.length).toFixed(4),
      selective_accuracy: accepted > 0 ? +(acceptedHits / accepted).toFixed(4) : null,
      accepted, accepted_hits: acceptedHits, rejected, rejected_was_ood: rejectedWasOod, rejected_was_correct: rejectedWasCorrect
    });
  }

  const meanCoverage = perFold.reduce((a, f) => a + f.coverage, 0) / folds.k;
  const validSel = perFold.filter(f => f.selective_accuracy !== null);
  const meanSelAcc = validSel.length ? validSel.reduce((a, f) => a + f.selective_accuracy, 0) / validSel.length : null;
  const totalRejectedWasOod = perFold.reduce((a, f) => a + f.rejected_was_ood, 0);
  const totalRejectedWasCorrect = perFold.reduce((a, f) => a + f.rejected_was_correct, 0);
  const totalOod = 15;

  return {
    name, per_fold: perFold,
    mean_coverage: +meanCoverage.toFixed(4),
    mean_selective_accuracy: meanSelAcc !== null ? +meanSelAcc.toFixed(4) : null,
    ood_caught_of_15: totalRejectedWasOod,
    correct_answers_sacrificed: totalRejectedWasCorrect
  };
}

const A4 = runCondition('A4', true, false);
const A5 = runCondition('A5', true, true);

console.log('A4 (hybrid + margin-based rejection):');
console.log(`  coverage=${(A4.mean_coverage * 100).toFixed(1)}%  selective_accuracy=${(A4.mean_selective_accuracy * 100).toFixed(1)}%  OOD caught=${A4.ood_caught_of_15}/15  correct answers sacrificed=${A4.correct_answers_sacrificed}`);
console.log('A5 (hybrid + margin + OOD detection):');
console.log(`  coverage=${(A5.mean_coverage * 100).toFixed(1)}%  selective_accuracy=${(A5.mean_selective_accuracy * 100).toFixed(1)}%  OOD caught=${A5.ood_caught_of_15}/15  correct answers sacrificed=${A5.correct_answers_sacrificed}`);

// --- Update the ablation table/CSV in place, replacing the PENDING A4/A5 rows ---
const ablationResults = JSON.parse(fs.readFileSync(path.join(outDir, 'ablation-results.json'), 'utf-8'));
ablationResults.conditions.A4 = A4;
ablationResults.conditions.A5 = A5;
ablationResults.table = ablationResults.table.map(row => {
  if (row.condition === 'A4') return { condition: 'A4', description: 'Hybrid + margin-based rejection', mean_coverage_pct: +(A4.mean_coverage * 100).toFixed(1), mean_selective_accuracy_pct: +(A4.mean_selective_accuracy * 100).toFixed(1), ood_caught_of_15: A4.ood_caught_of_15 };
  if (row.condition === 'A5') return { condition: 'A5', description: 'Hybrid + margin + OOD detection', mean_coverage_pct: +(A5.mean_coverage * 100).toFixed(1), mean_selective_accuracy_pct: +(A5.mean_selective_accuracy * 100).toFixed(1), ood_caught_of_15: A5.ood_caught_of_15 };
  return row;
});
fs.writeFileSync(path.join(outDir, 'ablation-results.json'), JSON.stringify(ablationResults, null, 2), 'utf-8');

const csvHeaders = ['condition', 'description', 'mean_non_ood_accuracy_pct_OR_selective_accuracy_pct', 'coverage_pct_or_std_pp', 'status_or_ood_caught'];
const csvRows = [csvHeaders.join(',')];
ablationResults.table.forEach(r => {
  if (r.condition === 'A4' || r.condition === 'A5') {
    csvRows.push([r.condition, `"${r.description}"`, r.mean_selective_accuracy_pct, r.mean_coverage_pct, `ood_caught=${r.ood_caught_of_15}/15`].join(','));
  } else {
    csvRows.push([r.condition, `"${r.description}"`, r.mean_non_ood_accuracy_pct ?? '', r.std_pp ?? '', r.status ?? 'complete'].join(','));
  }
});
fs.writeFileSync(path.join(outDir, 'ablation-table.csv'), csvRows.join('\n') + '\n', 'utf-8');
console.log('\nUpdated ablation-results.json and ablation-table.csv with A4/A5 (note: A4/A5 report SELECTIVE accuracy + coverage, not directly comparable to A0-A3\'s unconditional-accept accuracy -- documented in ABLATION_NOTES.md).');
