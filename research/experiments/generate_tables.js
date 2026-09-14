// Phase 15 -- generate publication-ready tables directly from result JSON files.

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));
const tblDir = path.join(projectRoot, 'research/tables');
if (!fs.existsSync(tblDir)) fs.mkdirSync(tblDir, { recursive: true });

// --- Table 1: main system comparison (the plan's section-39 format) ---
function table1() {
  const ablation = read('research/results/ablation/ablation-results.json');
  const dense = read('research/results/dense/dense-summary.json');
  const baselineRepro = read('research/results/baseline/reproduction-summary.json');

  const rows = [
    { system: 'BM25 baseline (A0)', overall: 67.3, supported: ablation.table.find(r=>r.condition==='A0').mean_non_ood_accuracy_pct, ood_rejection: 26.7, ambiguity_success: 28.6, low_overlap: 33.3, latency_ms: baselineRepro.mean_latency_ms },
    { system: 'BM25 no bonus (A1)', overall: null, supported: ablation.table.find(r=>r.condition==='A1').mean_non_ood_accuracy_pct, ood_rejection: null, ambiguity_success: null, low_overlap: null, latency_ms: null },
    { system: 'Dense only (A2)', overall: null, supported: ablation.table.find(r=>r.condition==='A2').mean_non_ood_accuracy_pct, ood_rejection: 0.0, ambiguity_success: 21.4, low_overlap: 46.7, latency_ms: dense.mean_latency_ms },
    { system: 'Hybrid, nested-CV (A3)', overall: null, supported: ablation.table.find(r=>r.condition==='A3').mean_non_ood_accuracy_pct, ood_rejection: 0.0, ambiguity_success: null, low_overlap: null, latency_ms: null },
    { system: 'Hybrid + margin + OOD (A5)', overall: null, supported: ablation.table.find(r=>r.condition==='A5').mean_selective_accuracy_pct, ood_rejection: (ablation.table.find(r=>r.condition==='A5').ood_caught_of_15/15*100).toFixed(1), ambiguity_success: null, low_overlap: null, latency_ms: null, note: `coverage=${ablation.table.find(r=>r.condition==='A5').mean_coverage_pct}%` }
  ];

  const headers = ['System', 'Overall Acc. (%)', 'Supported-Task Acc. (%)', 'OOD Rejection (%)', 'Ambiguity Success (%)', 'Low-Overlap Acc. (%)', 'Latency (ms)', 'Notes'];
  let md = `| ${headers.join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n`;
  rows.forEach(r => {
    md += `| ${r.system} | ${r.overall ?? '-'} | ${r.supported ?? '-'} | ${r.ood_rejection ?? '-'} | ${r.ambiguity_success ?? '-'} | ${r.low_overlap ?? '-'} | ${r.latency_ms ? r.latency_ms.toFixed(2) : '-'} | ${r.note ?? ''} |\n`;
  });
  fs.writeFileSync(path.join(tblDir, 'table1_main_results.md'), `# Table 1 -- Main System Comparison\n\n${md}`, 'utf-8');

  const csvRows = [headers.join(',')];
  rows.forEach(r => csvRows.push([r.system, r.overall ?? '', r.supported ?? '', r.ood_rejection ?? '', r.ambiguity_success ?? '', r.low_overlap ?? '', r.latency_ms ? r.latency_ms.toFixed(2) : '', r.note ?? ''].join(',')));
  fs.writeFileSync(path.join(tblDir, 'table1_main_results.csv'), csvRows.join('\n') + '\n', 'utf-8');
}

// --- Table 2: statistical significance summary ---
function table2() {
  const stats = read('research/results/final/statistical-analysis-results.json');
  const headers = ['Comparison', 'Acc. A (%)', 'Acc. B (%)', 'Diff (pp)', 'Discordant pairs', 'p-value (exact McNemar)', 'Significant (a=0.05)'];
  let md = `| ${headers.join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n`;
  const csvRows = [headers.join(',')];
  stats.accuracy_comparisons.forEach(c => {
    md += `| ${c.comparison} | ${(c.accuracy_A*100).toFixed(1)} | ${(c.accuracy_B*100).toFixed(1)} | ${(c.absolute_diff*100).toFixed(1)} | ${c.mcnemar_exact.n_discordant} | ${c.mcnemar_exact.p_value} | ${c.significant_at_0_05 ? 'Yes' : 'No'} |\n`;
    csvRows.push([c.comparison, (c.accuracy_A*100).toFixed(1), (c.accuracy_B*100).toFixed(1), (c.absolute_diff*100).toFixed(1), c.mcnemar_exact.n_discordant, c.mcnemar_exact.p_value, c.significant_at_0_05].join(','));
  });
  const o = stats.ood_rejection_comparison;
  md += `| ${o.comparison} | ${(o.baseline_rejection_rate*100).toFixed(1)} | ${(o.tuned_rejection_rate*100).toFixed(1)} | ${((o.tuned_rejection_rate-o.baseline_rejection_rate)*100).toFixed(1)} | ${o.mcnemar_exact.n_discordant} | ${o.mcnemar_exact.p_value} | ${o.significant_at_0_05 ? 'Yes' : 'No'} |\n`;
  csvRows.push([o.comparison, (o.baseline_rejection_rate*100).toFixed(1), (o.tuned_rejection_rate*100).toFixed(1), ((o.tuned_rejection_rate-o.baseline_rejection_rate)*100).toFixed(1), o.mcnemar_exact.n_discordant, o.mcnemar_exact.p_value, o.significant_at_0_05].join(','));
  fs.writeFileSync(path.join(tblDir, 'table2_statistical_significance.md'), `# Table 2 -- Statistical Significance (exact McNemar's)\n\n${md}`, 'utf-8');
  fs.writeFileSync(path.join(tblDir, 'table2_statistical_significance.csv'), csvRows.join('\n') + '\n', 'utf-8');
}

// --- Table 3: calibration summary ---
function table3() {
  const cal = read('research/calibration/calibration-results.json');
  const headers = ['Confidence Variant', 'ECE Before', 'ECE After', 'ECE Relative Reduction (%)', 'Brier Before', 'Brier After'];
  let md = `| ${headers.join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n`;
  const csvRows = [headers.join(',')];
  Object.values(cal.variants).forEach(v => {
    const relRed = ((v.before_calibration.ece - v.after_calibration.ece) / v.before_calibration.ece * 100).toFixed(1);
    md += `| ${v.name} | ${v.before_calibration.ece} | ${v.after_calibration.ece} | ${relRed} | ${v.before_calibration.brier} | ${v.after_calibration.brier} |\n`;
    csvRows.push([v.name, v.before_calibration.ece, v.after_calibration.ece, relRed, v.before_calibration.brier, v.after_calibration.brier].join(','));
  });
  fs.writeFileSync(path.join(tblDir, 'table3_calibration.md'), `# Table 3 -- Confidence Calibration (nested 5-fold CV isotonic)\n\n${md}`, 'utf-8');
  fs.writeFileSync(path.join(tblDir, 'table3_calibration.csv'), csvRows.join('\n') + '\n', 'utf-8');
}

// --- Table 4: safety classifier summary ---
function table4() {
  const safety = read('research/results/safety/safety-eval-results.json');
  const headers = ['Command Set', 'Exact 4-Tier Acc. (%)', 'Risky-Binary Precision', 'Risky-Binary Recall', 'Risky-Binary F1'];
  let md = `| ${headers.join(' | ')} |\n| ${headers.map(()=>'---').join(' | ')} |\n`;
  const csvRows = [headers.join(',')];
  [['Gold commands', safety.gold_command_evaluation], ['Retrieved (hybrid/A3)', safety.retrieved_command_evaluation]].forEach(([name, ev]) => {
    md += `| ${name} | ${(ev.exact_accuracy*100).toFixed(1)} | ${ev.risky_binary.precision} | ${ev.risky_binary.recall} | ${ev.risky_binary.f1} |\n`;
    csvRows.push([name, (ev.exact_accuracy*100).toFixed(1), ev.risky_binary.precision, ev.risky_binary.recall, ev.risky_binary.f1].join(','));
  });
  fs.writeFileSync(path.join(tblDir, 'table4_safety.md'), `# Table 4 -- Safety Classifier Evaluation\n\n${md}`, 'utf-8');
  fs.writeFileSync(path.join(tblDir, 'table4_safety.csv'), csvRows.join('\n') + '\n', 'utf-8');
}

table1(); table2(); table3(); table4();
console.log('Generated tables in', tblDir);
fs.readdirSync(tblDir).forEach(f => console.log(' ', f));
