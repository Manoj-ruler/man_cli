// Spec §8.2 -- Holm-Bonferroni correction across the defined primary hypothesis family, applied
// per benchmark version. Family (4 members): A0-vs-A3 accuracy, A2-vs-A3 accuracy,
// baseline-vs-tuned OOD rejection (all exact McNemar), and calibration ECE reduction (paired
// bootstrap one-sided p). Reports raw and Holm-adjusted p-values; a result is called significant
// only if its Holm-adjusted p < 0.05. This addresses the audit's multiple-comparison finding.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const boot = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/stats/bootstrap-ci-results.json'), 'utf-8'));
const bootByVer = Object.fromEntries(boot.versions.map(v => [v.benchmark, v]));

function holm(pvals) {
  // pvals: [{name, p}]. Returns same with holm_p (step-down, monotone-enforced).
  const m = pvals.length;
  const sorted = pvals.map((x, i) => ({ ...x, _i: i })).sort((a, b) => a.p - b.p);
  let running = 0;
  sorted.forEach((x, rank) => {
    const adj = Math.min(1, (m - rank) * x.p);
    running = Math.max(running, adj); // enforce monotonic non-decreasing
    x.holm_p = +running.toFixed(6);
  });
  // restore original order
  return sorted.sort((a, b) => a._i - b._i).map(({ _i, ...rest }) => rest);
}

function familyFor(versionLabel, statsPath) {
  const s = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
  const acc = Object.fromEntries(s.accuracy_comparisons.map(c => [c.comparison, c.mcnemar_exact.p_value]));
  const oodP = (s.ood_rejection_comparison ? s.ood_rejection_comparison.mcnemar_exact.p_value : s.mcnemar_exact.p_value);
  const calP = bootByVer[versionLabel].ece_reduction_paired.one_sided_p;
  const family = [
    { name: 'A0-vs-A3 accuracy (McNemar)', p: acc['A0 vs A3'] },
    { name: 'A2-vs-A3 accuracy (McNemar)', p: acc['A2 vs A3'] },
    { name: 'baseline-vs-tuned OOD rejection (McNemar)', p: oodP },
    { name: 'calibration ECE reduction (paired bootstrap)', p: calP }
  ];
  return holm(family);
}

const v01 = familyFor('v0.1', path.join(projectRoot, 'research/results/final/statistical-analysis-results.json'));
const v02 = familyFor('v0.2', path.join(projectRoot, 'research/results/v0.2/statistical-analysis-results.json'));

const out = {
  experiment_id: 'holm-correction',
  method: 'Holm-Bonferroni step-down, family size m=4, per benchmark version; significant iff holm_p < 0.05',
  family_members: ['A0-vs-A3 accuracy', 'A2-vs-A3 accuracy', 'baseline-vs-tuned OOD', 'calibration ECE reduction'],
  versions: { 'v0.1': v01, 'v0.2': v02 },
  generated_at: new Date().toISOString()
};
const outDir = path.join(projectRoot, 'research/results/stats');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'holm-correction-results.json'), JSON.stringify(out, null, 2), 'utf-8');

[['v0.1', v01], ['v0.2', v02]].forEach(([label, fam]) => {
  console.log(`\n=== ${label} — Holm-adjusted primary family (m=4) ===`);
  fam.forEach(x => console.log(`  ${x.name}: raw p=${x.p}  Holm p=${x.holm_p}  ${x.holm_p < 0.05 ? 'SIGNIFICANT' : 'not significant'}`));
});
console.log(`\nWrote research/results/stats/holm-correction-results.json`);
