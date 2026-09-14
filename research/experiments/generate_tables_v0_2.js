// v0.2 pipeline -- generate the main comparison tables for v0.2, plus a v0.1-vs-v0.2 replication
// table (the most important new table this pass produces).

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));
const tblDir = path.join(projectRoot, 'research/tables');

function tableReplication() {
  const v1stats = read('research/results/final/statistical-analysis-results.json');
  const v2stats = read('research/results/v0.2/statistical-analysis-results.json');

  const v1ood = { comparison: 'OOD rejection (baseline vs tuned)', n: 15, p: v1stats.ood_rejection_comparison.mcnemar_exact.p_value, sig: v1stats.ood_rejection_comparison.significant_at_0_05 };
  const v2ood = { comparison: 'OOD rejection (baseline vs tuned)', n: 50, p: v2stats.mcnemar_exact.p_value, sig: v2stats.significant_at_0_05 };

  const v1acc = v1stats.accuracy_comparisons;
  const v2acc = v2stats.accuracy_comparisons;

  const headers = ['Comparison', 'v0.1 n', 'v0.1 p-value', 'v0.1 Significant', 'v0.2 n', 'v0.2 p-value', 'v0.2 Significant', 'Replicated?'];
  const rows = [];
  ['A0 vs A1', 'A0 vs A2', 'A0 vs A3', 'A2 vs A3'].forEach(name => {
    const c1 = v1acc.find(c => c.comparison === name);
    const c2 = v2acc.find(c => c.comparison === name);
    rows.push([name, c1.n, c1.mcnemar_exact.p_value, c1.significant_at_0_05, c2.n, c2.mcnemar_exact.p_value, c2.significant_at_0_05, c1.significant_at_0_05 === c2.significant_at_0_05 ? 'Yes' : '**NO**']);
  });
  rows.push([v1ood.comparison, v1ood.n, v1ood.p, v1ood.sig, v2ood.n, v2ood.p, v2ood.sig, v1ood.sig === v2ood.sig ? 'Yes' : '**NO (resolved)**']);

  let md = `# Table 5 -- v0.1 vs v0.2 Replication Check\n\n| ${headers.join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n`;
  rows.forEach(r => { md += `| ${r.join(' | ')} |\n`; });
  fs.writeFileSync(path.join(tblDir, 'table5_v0.1_vs_v0.2_replication.md'), md, 'utf-8');

  const csvRows = [headers.join(',')];
  rows.forEach(r => csvRows.push(r.join(',')));
  fs.writeFileSync(path.join(tblDir, 'table5_v0.1_vs_v0.2_replication.csv'), csvRows.join('\n') + '\n', 'utf-8');
  console.log('Wrote table5 (replication check)');
}

function tableV02Main() {
  const ablation = read('research/results/v0.2/ablation-results.json');
  const headers = ['System', 'Non-OOD Accuracy (%)', 'Std (pp)'];
  let md = `# Table 6 -- v0.2 Main Results\n\n| ${headers.join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n`;
  const csvRows = [headers.join(',')];
  ['A0', 'A1', 'A2', 'A3'].forEach(k => {
    const c = ablation.conditions[k];
    md += `| ${k} | ${(c.mean_non_ood_accuracy*100).toFixed(1)} | ${(c.std_non_ood_accuracy*100).toFixed(1)} |\n`;
    csvRows.push([k, (c.mean_non_ood_accuracy*100).toFixed(1), (c.std_non_ood_accuracy*100).toFixed(1)].join(','));
  });
  fs.writeFileSync(path.join(tblDir, 'table6_v0.2_main_results.md'), md, 'utf-8');
  fs.writeFileSync(path.join(tblDir, 'table6_v0.2_main_results.csv'), csvRows.join('\n') + '\n', 'utf-8');
  console.log('Wrote table6 (v0.2 main results)');
}

tableReplication();
tableV02Main();
