// v0.2 pipeline -- identical ablation logic to run_ablation.js (A0-A3), pointed at v0.2's
// cache/folds/hybrid results (research/results/v0.2/).

const fs = require('fs');
const path = require('path');
const { fuseQuery } = require('./hybrid_fusion');

const projectRoot = path.join(__dirname, '..', '..');
const cacheDir = path.join(projectRoot, 'research/results/v0.2');
const outDir = path.join(projectRoot, 'research/results/v0.2');

const cache = JSON.parse(fs.readFileSync(path.join(cacheDir, 'query_scores_cache.json'), 'utf-8'));
const folds = JSON.parse(fs.readFileSync(path.join(cacheDir, 'folds.json'), 'utf-8'));
const hybridCv = JSON.parse(fs.readFileSync(path.join(cacheDir, 'hybrid-nested-cv-results.json'), 'utf-8'));

const byId = new Map(cache.queries.map(q => [q.id, q]));
const K = folds.k;

function isMatch(entry, predictedCommand) {
  const valid = new Set([entry.gold_command, ...(entry.acceptable_commands || [])].filter(Boolean));
  return valid.has(predictedCommand);
}

function predictFixed(entry, alpha, useBonus) {
  const { top1 } = fuseQuery(entry, alpha, { useBonus });
  return top1 ? top1.command : null;
}

function runFixedCondition(name, alpha, useBonus) {
  const perFold = [];
  const perQuery = [];
  const byTypeAgg = {};

  for (let f = 0; f < K; f++) {
    const foldIds = Object.entries(folds.assignment).filter(([, ff]) => ff === f).map(([id]) => id);
    let nonOodTotal = 0, nonOodHits = 0;
    const byType = {};

    foldIds.forEach(id => {
      const entry = byId.get(id);
      const predicted = predictFixed(entry, alpha, useBonus);
      const hit = predicted ? isMatch(entry, predicted) : false;

      if (entry.expected_classification !== 'OOD') {
        nonOodTotal++;
        if (hit) nonOodHits++;
        const qt = entry.query_type;
        if (!byType[qt]) byType[qt] = { total: 0, hits: 0 };
        byType[qt].total++;
        if (hit) byType[qt].hits++;
        if (!byTypeAgg[qt]) byTypeAgg[qt] = { total: 0, hits: 0 };
        byTypeAgg[qt].total++;
        if (hit) byTypeAgg[qt].hits++;
      }
      perQuery.push({ id, condition: name, command: predicted, hit, classification: entry.expected_classification });
    });

    perFold.push({ fold: f, non_ood_accuracy: nonOodTotal > 0 ? nonOodHits / nonOodTotal : 0, non_ood_total: nonOodTotal, non_ood_hits: nonOodHits, by_query_type: byType });
  }

  const mean = perFold.reduce((a, f) => a + f.non_ood_accuracy, 0) / K;
  const std = Math.sqrt(perFold.reduce((a, f) => a + (f.non_ood_accuracy - mean) ** 2, 0) / K);

  return { name, per_fold: perFold, mean_non_ood_accuracy: +mean.toFixed(4), std_non_ood_accuracy: +std.toFixed(4), by_query_type_aggregate: byTypeAgg, per_query: perQuery };
}

function reuseHybridA3() {
  const perFold = hybridCv.per_fold_results.map(f => ({ fold: f.test_fold, non_ood_accuracy: f.test_non_ood_accuracy, non_ood_total: f.test_non_ood_total, non_ood_hits: f.test_non_ood_hits, selected_alpha: f.selected_alpha, by_query_type: f.test_by_query_type }));
  const byTypeAgg = {};
  perFold.forEach(f => {
    Object.entries(f.by_query_type).forEach(([qt, v]) => {
      if (!byTypeAgg[qt]) byTypeAgg[qt] = { total: 0, hits: 0 };
      byTypeAgg[qt].total += v.total;
      byTypeAgg[qt].hits += v.hits;
    });
  });
  const perQuery = [];
  perFold.forEach(f => {
    const foldIds = Object.entries(folds.assignment).filter(([, ff]) => ff === f.fold).map(([id]) => id);
    foldIds.forEach(id => {
      const entry = byId.get(id);
      const predicted = predictFixed(entry, f.selected_alpha, true);
      const hit = predicted ? isMatch(entry, predicted) : false;
      perQuery.push({ id, condition: 'A3', command: predicted, hit, classification: entry.expected_classification });
    });
  });
  return { name: 'A3', per_fold: perFold, mean_non_ood_accuracy: hybridCv.aggregate.mean_test_non_ood_accuracy, std_non_ood_accuracy: hybridCv.aggregate.std_test_non_ood_accuracy, by_query_type_aggregate: byTypeAgg, per_query: perQuery };
}

function main() {
  const A0 = runFixedCondition('A0', 1.0, true);
  const A1 = runFixedCondition('A1', 1.0, false);
  const A2 = runFixedCondition('A2', 0.0, true);
  const A3 = reuseHybridA3();

  const conditions = { A0, A1, A2, A3 };
  console.log(`v0.2 A0 (BM25) mean non-OOD accuracy: ${(A0.mean_non_ood_accuracy * 100).toFixed(1)}%`);

  const table = ['A0', 'A1', 'A2', 'A3'].map(k => ({
    condition: k,
    description: { A0: 'BM25 only (production baseline)', A1: 'BM25, no substring bonus', A2: 'Dense only', A3: 'Hybrid BM25+dense, nested-CV alpha' }[k],
    mean_non_ood_accuracy_pct: +(conditions[k].mean_non_ood_accuracy * 100).toFixed(1),
    std_pp: +(conditions[k].std_non_ood_accuracy * 100).toFixed(1)
  }));
  ['A4', 'A5', 'A6'].forEach(k => table.push({ condition: k, description: { A4: 'Hybrid + margin-based rejection', A5: 'Hybrid + margin + OOD detection', A6: 'Hybrid + margin + OOD + calibration' }[k], mean_non_ood_accuracy_pct: null, std_pp: null, status: 'PENDING -- run_ablation_A4_A5_v0_2.js / calibration' }));

  console.log('\nv0.2 Ablation table (non-OOD accuracy):');
  table.forEach(r => console.log(`  ${r.condition}: ${r.description} -> ${r.mean_non_ood_accuracy_pct !== null ? r.mean_non_ood_accuracy_pct + '% (std ' + r.std_pp + 'pp)' : r.status}`));

  const outDir2 = path.join(projectRoot, 'research/results/v0.2');
  fs.writeFileSync(path.join(outDir2, 'ablation-results.json'), JSON.stringify({ benchmark_version: 'v0.2', generated_at: new Date().toISOString(), conditions, table }, null, 2), 'utf-8');

  const csvHeaders = ['condition', 'description', 'mean_non_ood_accuracy_pct', 'std_pp', 'status'];
  const csvRows = [csvHeaders.join(',')];
  table.forEach(r => csvRows.push([r.condition, `"${r.description}"`, r.mean_non_ood_accuracy_pct ?? '', r.std_pp ?? '', r.status ?? 'complete'].join(',')));
  fs.writeFileSync(path.join(outDir2, 'ablation-table.csv'), csvRows.join('\n') + '\n', 'utf-8');
  console.log(`\nWrote ${path.join(outDir2, 'ablation-results.json')}`);
}

main();
