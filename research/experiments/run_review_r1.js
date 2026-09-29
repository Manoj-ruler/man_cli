// Runs the T18 analyses answering review round 1 (research/PLAN_TASKS.md T18). Each script reproduces the
// committed numbers it builds on and aborts on any mismatch. Outputs: research/results/review_r1/*.json.
const { execFileSync } = require('child_process');
const path = require('path');
for (const s of ['review_r1_a_ood_selection.js', 'review_r1_b_calibration.js', 'review_r1_c_ranking.js', 'review_r1_d_risk.js', 'review_r1_e_ood_operating_points.js', 'review_r1_f_kappa_intervals.js']) {
  console.log(`\n>>> ${s}`);
  execFileSync('node', [path.join(__dirname, s)], { stdio: ['ignore', 'ignore', 'inherit'] });
  console.log('    ok');
}
console.log('\nReview round 1 analyses complete: research/results/review_r1/');
