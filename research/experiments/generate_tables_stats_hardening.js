// Generates Table 7 (combined Holm-corrected significance + bootstrap CIs, v0.1+v0.2) and
// Table 8 (Split B intent-held-out generalization) directly from the committed result JSON --
// no hand-typed numbers, consistent with every other table in research/tables/.

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));
const tblDir = path.join(projectRoot, 'research/tables');

function table7() {
  const holm = read('research/results/stats/holm-correction-results.json');
  const boot = read('research/results/stats/bootstrap-ci-results.json');
  const bootByVer = Object.fromEntries(boot.versions.map(v => [v.benchmark, v]));

  const rows = [];
  ['v0.1', 'v0.2'].forEach(ver => {
    holm.versions[ver].forEach(h => {
      let ci = '';
      if (h.name.startsWith('A0-vs-A3')) { const d = bootByVer[ver].accuracy_delta_A0_to_A3; ci = `[${(d.ci_lower*100).toFixed(1)}, ${(d.ci_upper*100).toFixed(1)}]pp`; }
      else if (h.name.startsWith('A2-vs-A3')) { const d = bootByVer[ver].accuracy_delta_A2_to_A3; ci = `[${(d.ci_lower*100).toFixed(1)}, ${(d.ci_upper*100).toFixed(1)}]pp`; }
      else if (h.name.startsWith('calibration')) { const d = bootByVer[ver].ece_reduction_paired; ci = `[${d.ci_lower}, ${d.ci_upper}]`; }
      rows.push({ benchmark: ver, comparison: h.name, raw_p: h.p, holm_p: h.holm_p, significant: h.holm_p < 0.05, bootstrap_ci: ci });
    });
  });

  const headers = ['Benchmark', 'Comparison', 'Raw p', 'Holm-adjusted p', 'Significant (Holm<0.05)', 'Bootstrap 95% CI'];
  let md = `# Table 7 -- Holm-Corrected Significance + Bootstrap CIs (v0.1 and v0.2)\n\nFamily size m=4 per benchmark version. Bootstrap: 10,000 resamples, seed 42.\n\n| ${headers.join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n`;
  const csvRows = [headers.join(',')];
  rows.forEach(r => {
    md += `| ${r.benchmark} | ${r.comparison} | ${r.raw_p} | ${r.holm_p} | ${r.significant ? 'Yes' : 'No'} | ${r.bootstrap_ci} |\n`;
    csvRows.push([r.benchmark, `"${r.comparison}"`, r.raw_p, r.holm_p, r.significant, `"${r.bootstrap_ci}"`].join(','));
  });
  fs.writeFileSync(path.join(tblDir, 'table7_holm_bootstrap.md'), md, 'utf-8');
  fs.writeFileSync(path.join(tblDir, 'table7_holm_bootstrap.csv'), csvRows.join('\n') + '\n', 'utf-8');
  console.log('Wrote table7 (Holm + bootstrap)');
}

function table8() {
  const headers = ['Benchmark', 'Metric', 'Split A (class-stratified)', 'Split B (intent-held-out)', 'Delta'];
  let md = `# Table 8 -- Split A vs Split B (Intent-Held-Out Generalization), v0.1 and v0.2\n\n`;
  const csvRows = [headers.join(',')];
  let mdRows = '';

  ['v0.1', 'v0.2'].forEach(ver => {
    const sb = read(`research/results/${ver}/split-b-results.json`);
    md += `**${ver}**: ${sb.group_count} intent groups, 5 folds, ${sb.groups_split_across_folds} groups split across folds (must be 0).${sb.caveat ? ' ' + sb.caveat : ''}\n\n`;
    const rows = [
      ['Hybrid non-OOD accuracy', (sb.splitA_reference.hybrid_non_ood_accuracy*100).toFixed(2)+'%', (sb.splitB.hybrid_non_ood_accuracy*100).toFixed(2)+'%', (sb.generalization_delta.hybrid_accuracy*100).toFixed(2)+'pp'],
      ['OOD detection AUROC', sb.splitA_reference.ood_auroc, sb.splitB.ood_detection.mean_auroc, sb.generalization_delta.ood_auroc],
      ['OOD detection F1', sb.splitA_reference.ood_f1, sb.splitB.ood_detection.f1, +(sb.splitB.ood_detection.f1 - sb.splitA_reference.ood_f1).toFixed(4)],
      ['Ambiguity detection F1', sb.splitA_reference.ambiguity_f1, sb.splitB.ambiguity_detection.f1, +(sb.splitB.ambiguity_detection.f1 - sb.splitA_reference.ambiguity_f1).toFixed(4)],
      ['Calibration ECE (before→after)', `${sb.splitA_reference.calibration_ece_before}→${sb.splitA_reference.calibration_ece_after}`, `${sb.splitB.calibration_ece_before}→${sb.splitB.calibration_ece_after}`, sb.generalization_delta.calibration_ece_after]
    ];
    rows.forEach(r => { mdRows += `| ${ver} | ${r.join(' | ')} |\n`; csvRows.push([ver, ...r].join(',')); });
  });

  md += `| ${headers.join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n${mdRows}`;
  fs.writeFileSync(path.join(tblDir, 'table8_split_b_generalization.md'), md, 'utf-8');
  fs.writeFileSync(path.join(tblDir, 'table8_split_b_generalization.csv'), csvRows.join('\n') + '\n', 'utf-8');
  console.log('Wrote table8 (Split B generalization, v0.1 + v0.2)');
}

table7();
table8();
