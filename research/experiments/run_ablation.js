// Phase 5 (E5) -- ablation matrix A0-A6, isolating which component of the hybrid system is
// actually responsible for Phase 4's measured +5.2pp improvement.
//
// A0 BM25 only (= frozen production baseline, alpha=1.0 with substring bonus)
// A1 BM25 without the +15 substring bonus (alpha=1.0, bonus disabled)
// A2 dense only (alpha=0.0)
// A3 BM25 + dense, nested-CV alpha (= Phase 4's result, reused here for the combined table)
// A4 BM25 + dense + margin-based rejection       -- PENDING, requires Phase 6/7
// A5 BM25 + dense + margin + OOD detection       -- PENDING, requires Phase 7
// A6 BM25 + dense + margin + OOD + calibration   -- PENDING, requires Phase 8
//
// A0-A2 have no tunable hyperparameter, so there is no dev/test leakage risk for them --
// but they are still evaluated fold-by-fold on the SAME 5 folds as A3, purely so that all
// conditions produce paired per-query predictions on identical partitions, which Phase 13's
// McNemar's test requires. A3 reuses Phase 4's already-computed nested-CV per-fold results
// rather than recomputing (avoids any drift between the two experiments' numbers).

const fs = require('fs');
const path = require('path');
const { fuseQuery } = require('./hybrid_fusion');

const projectRoot = path.join(__dirname, '..', '..');
const cacheDir = path.join(projectRoot, 'research/results/hybrid');
const outDir = path.join(projectRoot, 'research/results/ablation');

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

// Run a fixed-parameter condition (no tuning) over all folds, fold-by-fold, for parity with A3.
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

// A3 is NOT recomputed -- reuse Phase 4's exact nested-CV output to avoid any drift between
// the two experiments' numbers for the same condition.
function reuseHybridA3() {
  const perFold = hybridCv.per_fold_results.map(f => ({
    fold: f.test_fold,
    non_ood_accuracy: f.test_non_ood_accuracy,
    non_ood_total: f.test_non_ood_total,
    non_ood_hits: f.test_non_ood_hits,
    selected_alpha: f.selected_alpha,
    by_query_type: f.test_by_query_type
  }));
  const byTypeAgg = {};
  perFold.forEach(f => {
    Object.entries(f.by_query_type).forEach(([qt, v]) => {
      if (!byTypeAgg[qt]) byTypeAgg[qt] = { total: 0, hits: 0 };
      byTypeAgg[qt].total += v.total;
      byTypeAgg[qt].hits += v.hits;
    });
  });

  // Recover per-query predictions for A3 by re-running fuseQuery with each fold's selected
  // alpha (identical to what run_hybrid.js did internally) so A3 has paired per-query data too.
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

  return {
    name: 'A3',
    per_fold: perFold,
    mean_non_ood_accuracy: hybridCv.aggregate.mean_test_non_ood_accuracy,
    std_non_ood_accuracy: hybridCv.aggregate.std_test_non_ood_accuracy,
    by_query_type_aggregate: byTypeAgg,
    per_query: perQuery,
    note: 'reused verbatim from Phase 4 (research/results/hybrid/hybrid-nested-cv-results.json); alpha selected per fold via nested CV, never tuned on the fold it is scored on'
  };
}

function main() {
  const A0 = runFixedCondition('A0', 1.0, true);   // BM25 only, with bonus (= production baseline)
  const A1 = runFixedCondition('A1', 1.0, false);  // BM25 only, without bonus
  const A2 = runFixedCondition('A2', 0.0, true);   // dense only (bonus flag irrelevant at alpha=0)
  const A3 = reuseHybridA3();

  const conditions = { A0, A1, A2, A3 };

  // --- Sanity check: A0's mean should match the frozen baseline's 71.9% supported-task accuracy ---
  const a0Check = Math.abs(A0.mean_non_ood_accuracy - 0.719) < 0.02; // small tolerance for fold-boundary rounding vs the single-split 135-query denominator
  console.log(`A0 (BM25 only) mean non-OOD accuracy: ${(A0.mean_non_ood_accuracy * 100).toFixed(1)}% (expect ~71.9% from frozen baseline) -- ${a0Check ? 'CONSISTENT' : 'CHECK NEEDED'}`);

  const table = ['A0', 'A1', 'A2', 'A3'].map(k => {
    const c = conditions[k];
    return {
      condition: k,
      description: { A0: 'BM25 only (production baseline)', A1: 'BM25, no substring bonus', A2: 'Dense only', A3: 'Hybrid BM25+dense, nested-CV alpha' }[k],
      mean_non_ood_accuracy_pct: +(c.mean_non_ood_accuracy * 100).toFixed(1),
      std_pp: +(c.std_non_ood_accuracy * 100).toFixed(1)
    };
  });
  // Placeholder rows for components not yet built, so the table's shape matches the final plan
  // and nobody mistakes their absence for a zero/negative result.
  ['A4', 'A5', 'A6'].forEach(k => table.push({
    condition: k,
    description: { A4: 'Hybrid + margin-based rejection', A5: 'Hybrid + margin + OOD detection', A6: 'Hybrid + margin + OOD + calibration' }[k],
    mean_non_ood_accuracy_pct: null,
    std_pp: null,
    status: 'PENDING -- requires Phase 6/7/8 components, not yet implemented'
  }));

  console.log('\nAblation table (non-OOD accuracy):');
  table.forEach(r => console.log(`  ${r.condition}: ${r.description} -> ${r.mean_non_ood_accuracy_pct !== null ? r.mean_non_ood_accuracy_pct + '% (std ' + r.std_pp + 'pp)' : r.status}`));

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'ablation-results.json'), JSON.stringify({ generated_at: new Date().toISOString(), conditions, table }, null, 2), 'utf-8');

  const csvHeaders = ['condition', 'description', 'mean_non_ood_accuracy_pct', 'std_pp', 'status'];
  const csvRows = [csvHeaders.join(',')];
  table.forEach(r => csvRows.push([r.condition, `"${r.description}"`, r.mean_non_ood_accuracy_pct ?? '', r.std_pp ?? '', r.status ?? 'complete'].join(',')));
  fs.writeFileSync(path.join(outDir, 'ablation-table.csv'), csvRows.join('\n') + '\n', 'utf-8');

  console.log(`\nWrote ${path.join(outDir, 'ablation-results.json')} and ablation-table.csv`);
}

main();
