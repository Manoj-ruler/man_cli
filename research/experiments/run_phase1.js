// Runs the Phase 1 analysis corrections (research/PLAN_TASKS.md T1-T5) in order. Each script
// reproduces the committed numbers it builds on and aborts on any mismatch, so a clean run of this
// file is itself the reproduction check. Outputs: research/results/phase1/*.json.
const { execFileSync } = require('child_process');
const path = require('path');
for (const s of ['phase1_t1_controls_excluded.js', 'phase1_t2_ood_breakdown.js', 'phase1_t3_selective_ties.js', 'phase1_t4_calibration_comparators.js', 'phase1_t5_safety_recount.js']) {
  console.log(`\n>>> ${s}`);
  execFileSync('node', [path.join(__dirname, s)], { stdio: ['ignore', 'ignore', 'inherit'] });
  console.log(`    ok`);
}
console.log('\nPhase 1 complete: research/results/phase1/');
