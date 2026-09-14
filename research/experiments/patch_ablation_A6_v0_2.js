// v0.2 pipeline -- identical to patch_ablation_A6.js, pointed at v0.2's ablation/calibration results.
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const outDir = path.join(projectRoot, 'research/results/v0.2');

const ablationResults = JSON.parse(fs.readFileSync(path.join(outDir, 'ablation-results.json'), 'utf-8'));
const A5 = ablationResults.conditions.A5;
const calResults = JSON.parse(fs.readFileSync(path.join(outDir, 'calibration-results.json'), 'utf-8'));
const hybridRel = calResults.variants.hybrid_reliability;

ablationResults.conditions.A6 = {
  name: 'A6', note: 'Same accept/reject decision as A5; adds calibrated confidence (isotonic, hybrid_reliability variant).',
  mean_coverage: A5.mean_coverage, mean_selective_accuracy: A5.mean_selective_accuracy,
  ood_caught_total: A5.ood_caught_total, correct_answers_sacrificed: A5.correct_answers_sacrificed,
  confidence_ece_before_calibration: hybridRel.before_calibration.ece, confidence_ece_after_calibration: hybridRel.after_calibration.ece
};
ablationResults.table = ablationResults.table.map(row => row.condition === 'A6' ? { condition: 'A6', description: 'Hybrid + margin + OOD + calibrated confidence', mean_coverage_pct: A5.mean_coverage * 100, mean_selective_accuracy_pct: A5.mean_selective_accuracy * 100, ood_caught: A5.ood_caught_total, confidence_ece_after: hybridRel.after_calibration.ece } : row);
fs.writeFileSync(path.join(outDir, 'ablation-results.json'), JSON.stringify(ablationResults, null, 2), 'utf-8');
console.log('v0.2 A6 patched:', JSON.stringify(ablationResults.conditions.A6));
