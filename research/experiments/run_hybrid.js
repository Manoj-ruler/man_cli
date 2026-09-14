// Phase 4 (E4) -- nested 5-fold cross-validation alpha sweep for hybrid BM25+dense fusion.
//
// Protocol (per Phase 4/9 of FINAL_RESEARCH_PLAN.md): for each test fold, alpha is selected
// by maximizing accuracy on the OTHER four folds only (dev), then evaluated once on the held-out
// test fold. The chosen alpha therefore never sees the fold it is scored on -- this is what
// prevents "reporting the best experiment" / tuning-on-test.
//
// Selection objective: supported-task accuracy (CORRECT + AMBIGUOUS_CORRECT over all non-OOD
// queries). OOD queries are excluded from the tuning objective because this experiment has no
// rejection mechanism yet (that is Phase 7) -- so every query is unconditionally "accepted",
// making the OOD outcome a property of Phase 7, not of alpha. This matches run_dense.js's
// design decision, documented for consistency.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const cacheDir = path.join(projectRoot, 'research/results/hybrid');
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

// Evaluate a fixed alpha over a set of query IDs. Returns per-query-type + aggregate accuracy.
function evaluateAlpha(queryIds, alpha) {
  let nonOodTotal = 0, nonOodHits = 0;
  let oodTotal = 0, oodFalseAccept = 0; // descriptive only (no rejection exists at this phase)
  const byType = {};
  const perQuery = [];

  queryIds.forEach(id => {
    const entry = byId.get(id);
    const { top1 } = fuseQuery(entry, alpha);
    const hit = top1 ? isMatch(entry, top1.command) : false;

    if (entry.expected_classification === 'OOD') {
      oodTotal++;
      oodFalseAccept++; // unconditional accept => always "false accept" in this phase, as with E3
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

  return {
    alpha,
    non_ood_accuracy: nonOodTotal > 0 ? nonOodHits / nonOodTotal : 0,
    non_ood_total: nonOodTotal,
    non_ood_hits: nonOodHits,
    ood_total: oodTotal,
    ood_false_accept: oodFalseAccept,
    by_query_type: byType,
    perQuery
  };
}

function main() {
  // --- Nested CV: select alpha per fold using the OTHER folds only ---
  const perFoldResults = [];
  for (let testFold = 0; testFold < K; testFold++) {
    const testIds = Object.entries(folds.assignment).filter(([, f]) => f === testFold).map(([id]) => id);
    const devIds = Object.entries(folds.assignment).filter(([, f]) => f !== testFold).map(([id]) => id);

    // Select alpha maximizing dev accuracy. Tie-break: prefer the value closest to 0.5
    // (an explicit, documented, non-arbitrary rule -- avoids silently favoring an extreme
    // that happens to tie by chance on a small dev split).
    let bestAlpha = null, bestDevAcc = -1;
    const devCurve = [];
    for (const alpha of ALPHA_GRID) {
      const res = evaluateAlpha(devIds, alpha);
      devCurve.push({ alpha, dev_non_ood_accuracy: res.non_ood_accuracy });
      if (res.non_ood_accuracy > bestDevAcc ||
          (res.non_ood_accuracy === bestDevAcc && Math.abs(alpha - 0.5) < Math.abs(bestAlpha - 0.5))) {
        bestDevAcc = res.non_ood_accuracy;
        bestAlpha = alpha;
      }
    }

    const testResult = evaluateAlpha(testIds, bestAlpha);
    perFoldResults.push({
      test_fold: testFold,
      selected_alpha: bestAlpha,
      dev_accuracy_at_selected_alpha: bestDevAcc,
      dev_curve: devCurve,
      test_non_ood_accuracy: testResult.non_ood_accuracy,
      test_non_ood_total: testResult.non_ood_total,
      test_non_ood_hits: testResult.non_ood_hits,
      test_by_query_type: testResult.by_query_type
    });
  }

  const meanTestAcc = perFoldResults.reduce((a, f) => a + f.test_non_ood_accuracy, 0) / K;
  const stdTestAcc = Math.sqrt(perFoldResults.reduce((a, f) => a + (f.test_non_ood_accuracy - meanTestAcc) ** 2, 0) / K);
  const selectedAlphas = perFoldResults.map(f => f.selected_alpha);

  // --- Descriptive-only: full-dataset alpha curve (NOT used for any reported final number,
  // included only for the alpha-vs-accuracy figure in Phase 15, clearly labeled as such) ---
  const allIds = cache.queries.map(q => q.id);
  const descriptiveCurve = ALPHA_GRID.map(alpha => {
    const res = evaluateAlpha(allIds, alpha);
    return { alpha, full_dataset_non_ood_accuracy: res.non_ood_accuracy, by_query_type: res.by_query_type };
  });

  const output = {
    experiment_id: 'E4-hybrid-fusion-nested-5fold-cv',
    protocol: 'nested 5-fold CV: alpha selected per test-fold using only the other 4 folds (dev); evaluated once on held-out test fold. No alpha is ever selected using the fold it is scored on.',
    alpha_grid: ALPHA_GRID,
    fold_seed: folds.seed,
    per_fold_results: perFoldResults,
    aggregate: {
      mean_test_non_ood_accuracy: +meanTestAcc.toFixed(4),
      std_test_non_ood_accuracy: +stdTestAcc.toFixed(4),
      selected_alpha_per_fold: selectedAlphas,
      selected_alpha_mode: selectedAlphas.slice().sort((a, b) =>
        selectedAlphas.filter(v => v === a).length - selectedAlphas.filter(v => v === b).length
      ).pop()
    },
    descriptive_full_dataset_alpha_curve_NOT_used_for_reported_results: descriptiveCurve,
    generated_at: new Date().toISOString()
  };

  fs.writeFileSync(path.join(cacheDir, 'hybrid-nested-cv-results.json'), JSON.stringify(output, null, 2), 'utf-8');
  console.log('Per-fold selected alpha:', selectedAlphas);
  console.log(`Nested-CV mean non-OOD accuracy: ${(meanTestAcc * 100).toFixed(1)}% (std ${(stdTestAcc * 100).toFixed(1)}pp)`);
  console.log('\nDescriptive full-dataset alpha curve (non-OOD accuracy):');
  descriptiveCurve.forEach(c => console.log(`  alpha=${c.alpha.toFixed(1)}: ${(c.full_dataset_non_ood_accuracy * 100).toFixed(1)}%`));
}

main();
