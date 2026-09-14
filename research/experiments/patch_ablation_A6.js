// Phase 8 (extracted during Phase 19 QC) -- fills in ablation row A6 (hybrid + margin + OOD +
// calibrated confidence). Originally applied as a one-off inline command during Phase 8 and not
// saved as a script, which Phase 19's reproducibility pass caught: re-running the full pipeline
// from a clean state silently dropped A6 back to PENDING, because run_ablation.js always writes
// placeholder PENDING rows for A4-A6 and this patch step existed nowhere as a committed file.
// Extracted here so `node research/experiments/run_all.js` (or manual sequential execution)
// reproduces the full A0-A6 table end to end. Must run AFTER run_ablation_A4_A5.js and
// run_calibration.js (depends on both of their outputs).

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const outDir = path.join(projectRoot, 'research/results/ablation');

const ablationResults = JSON.parse(fs.readFileSync(path.join(outDir, 'ablation-results.json'), 'utf-8'));
const A5 = ablationResults.conditions.A5;

// Calibration ECE values are read from the calibration results file rather than hardcoded, so
// this patch cannot silently drift from Phase 8's actual computed numbers.
const calResults = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/calibration/calibration-results.json'), 'utf-8'));
const hybridRel = calResults.variants.hybrid_reliability;

ablationResults.conditions.A6 = {
  name: 'A6',
  note: 'Same accept/reject decision as A5 (margin+OOD thresholds); adds calibrated confidence (isotonic, hybrid_reliability variant) in place of raw fused score for the displayed confidence number.',
  mean_coverage: A5.mean_coverage,
  mean_selective_accuracy: A5.mean_selective_accuracy,
  ood_caught_of_15: A5.ood_caught_of_15,
  correct_answers_sacrificed: A5.correct_answers_sacrificed,
  confidence_ece_before_calibration: hybridRel.before_calibration.ece,
  confidence_ece_after_calibration: hybridRel.after_calibration.ece
};

ablationResults.table = ablationResults.table.map(row => {
  if (row.condition === 'A6') {
    return {
      condition: 'A6', description: 'Hybrid + margin + OOD + calibrated confidence',
      mean_coverage_pct: +(A5.mean_coverage * 100).toFixed(2),
      mean_selective_accuracy_pct: +(A5.mean_selective_accuracy * 100).toFixed(2),
      ood_caught_of_15: A5.ood_caught_of_15,
      confidence_ece_after: hybridRel.after_calibration.ece
    };
  }
  return row;
});

fs.writeFileSync(path.join(outDir, 'ablation-results.json'), JSON.stringify(ablationResults, null, 2), 'utf-8');

const csvHeaders = ['condition', 'description', 'accuracy_or_selective_accuracy_pct', 'coverage_or_std', 'notes'];
const csvRows = [csvHeaders.join(',')];
ablationResults.table.forEach(r => {
  if (['A0', 'A1', 'A2', 'A3'].includes(r.condition)) {
    csvRows.push([r.condition, `"${r.description}"`, r.mean_non_ood_accuracy_pct ?? '', r.std_pp ?? '', ''].join(','));
  } else if (r.condition === 'A4' || r.condition === 'A5') {
    csvRows.push([r.condition, `"${r.description}"`, r.mean_selective_accuracy_pct, r.mean_coverage_pct, `ood_caught=${r.ood_caught_of_15}/15`].join(','));
  } else if (r.condition === 'A6') {
    csvRows.push([r.condition, `"${r.description}"`, r.mean_selective_accuracy_pct, r.mean_coverage_pct, `ood_caught=${r.ood_caught_of_15}/15; confidence_ece_after=${r.confidence_ece_after}`].join(','));
  }
});
fs.writeFileSync(path.join(outDir, 'ablation-table.csv'), csvRows.join('\n') + '\n', 'utf-8');

console.log('A6 patched into ablation-results.json and ablation-table.csv (reading ECE from calibration-results.json, not hardcoded).');
