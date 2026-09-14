// v0.2 pipeline -- identical nested-CV fusion logic to run_hybrid.js, pointed at v0.2's cache
// and folds (research/results/v0.2/). Same protocol: alpha selected per fold using only the
// other 4 folds, never the held-out fold.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const cacheDir = path.join(projectRoot, 'research/results/v0.2');
const cache = JSON.parse(fs.readFileSync(path.join(cacheDir, 'query_scores_cache.json'), 'utf-8'));
const folds = JSON.parse(fs.readFileSync(path.join(cacheDir, 'folds.json'), 'utf-8'));
const { fuseQuery } = require('./hybrid_fusion');

const ALPHA_GRID = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const K = folds.k;

const byId = new Map(cache.queries.map(q => [q.id, q]));

function isMatch(entry, predictedCommand) {
  const valid = new Set([entry.gold_command, ...(entry.acceptable_commands || [])].filter(Boolean));
  return valid.has(predictedCommand);
}

function evaluateAlpha(queryIds, alpha) {
  let nonOodTotal = 0, nonOodHits = 0;
  let oodTotal = 0, oodFalseAccept = 0;
  const byType = {};
  const perQuery = [];

  queryIds.forEach(id => {
    const entry = byId.get(id);
    const { top1 } = fuseQuery(entry, alpha);
    const hit = top1 ? isMatch(entry, top1.command) : false;

    if (entry.expected_classification === 'OOD') {
      oodTotal++; oodFalseAccept++;
    } else {
      nonOodTotal++;
      if (hit) nonOodHits++;
      const qt = entry.query_type;
      if (!byType[qt]) byType[qt] = { total: 0, hits: 0 };
      byType[qt].total++;
      if (hit) byType[qt].hits++;
    }
    perQuery.push({ id, command: top1 ? top1.command : null, hit, classification: entry.expected_classification });
  });

  return { alpha, non_ood_accuracy: nonOodTotal > 0 ? nonOodHits / nonOodTotal : 0, non_ood_total: nonOodTotal, non_ood_hits: nonOodHits, ood_total: oodTotal, ood_false_accept: oodFalseAccept, by_query_type: byType, perQuery };
}

function main() {
  const perFoldResults = [];
  for (let testFold = 0; testFold < K; testFold++) {
    const testIds = Object.entries(folds.assignment).filter(([, f]) => f === testFold).map(([id]) => id);
    const devIds = Object.entries(folds.assignment).filter(([, f]) => f !== testFold).map(([id]) => id);

    let bestAlpha = null, bestDevAcc = -1;
    const devCurve = [];
    for (const alpha of ALPHA_GRID) {
      const res = evaluateAlpha(devIds, alpha);
      devCurve.push({ alpha, dev_non_ood_accuracy: res.non_ood_accuracy });
      if (res.non_ood_accuracy > bestDevAcc ||
          (res.non_ood_accuracy === bestDevAcc && Math.abs(alpha - 0.5) < Math.abs(bestAlpha - 0.5))) {
        bestDevAcc = res.non_ood_accuracy; bestAlpha = alpha;
      }
    }

    const testResult = evaluateAlpha(testIds, bestAlpha);
    perFoldResults.push({ test_fold: testFold, selected_alpha: bestAlpha, dev_accuracy_at_selected_alpha: bestDevAcc, dev_curve: devCurve, test_non_ood_accuracy: testResult.non_ood_accuracy, test_non_ood_total: testResult.non_ood_total, test_non_ood_hits: testResult.non_ood_hits, test_by_query_type: testResult.by_query_type });
  }

  const meanTestAcc = perFoldResults.reduce((a, f) => a + f.test_non_ood_accuracy, 0) / K;
  const stdTestAcc = Math.sqrt(perFoldResults.reduce((a, f) => a + (f.test_non_ood_accuracy - meanTestAcc) ** 2, 0) / K);
  const selectedAlphas = perFoldResults.map(f => f.selected_alpha);

  const output = {
    experiment_id: 'E4-v0.2-hybrid-fusion-nested-5fold-cv',
    benchmark_version: 'v0.2',
    protocol: 'nested 5-fold CV: alpha selected per test-fold using only the other 4 folds (dev); evaluated once on held-out test fold.',
    alpha_grid: ALPHA_GRID, fold_seed: folds.seed,
    per_fold_results: perFoldResults,
    aggregate: {
      mean_test_non_ood_accuracy: +meanTestAcc.toFixed(4),
      std_test_non_ood_accuracy: +stdTestAcc.toFixed(4),
      selected_alpha_per_fold: selectedAlphas
    },
    generated_at: new Date().toISOString()
  };

  fs.writeFileSync(path.join(cacheDir, 'hybrid-nested-cv-results.json'), JSON.stringify(output, null, 2), 'utf-8');
  console.log('v0.2 per-fold selected alpha:', selectedAlphas);
  console.log(`v0.2 nested-CV mean non-OOD accuracy: ${(meanTestAcc * 100).toFixed(1)}% (std ${(stdTestAcc * 100).toFixed(1)}pp)`);
}

main();
