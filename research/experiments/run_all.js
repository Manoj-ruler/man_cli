// Phase 19 -- canonical, ordered pipeline runner. Running this single script from a clean
// checkout (after `node research/experiments/build_embeddings.js` once, since that requires a
// one-time model download) reproduces every research/results/*, research/calibration/*,
// research/analysis/final-error-analysis.*, research/figures/*, and research/tables/* artifact
// in this repository, in dependency order. This file exists BECAUSE Phase 19's reproducibility
// pass caught that the correct order had previously only existed as an implicit sequence of
// manual commands across several conversation turns -- notably A6's patch step (Phase 8), which
// had never been saved as a script at all until this phase. Running scripts out of order, or
// skipping one, will silently produce stale/incomplete downstream artifacts (as this phase's QC
// pass directly observed).

const { execFileSync } = require('child_process');
const path = require('path');

const steps = [
  'reproduce_baseline.js',
  'build_query_scores.js',      // depends on: build_embeddings.js having been run once already
  'build_folds.js',
  'run_hybrid.js',               // depends on: build_query_scores.js, build_folds.js
  'run_ablation.js',             // depends on: build_query_scores.js, build_folds.js, run_hybrid.js (A3 reuse)
  'build_candidates.js',         // depends on: build_query_scores.js, build_folds.js, run_hybrid.js
  'build_reliability_features.js', // depends on: build_candidates.js
  'run_selective_prediction.js', // depends on: build_reliability_features.js, build_folds.js
  'run_ablation_A4_A5.js',       // depends on: run_selective_prediction.js, run_ablation.js
  'run_calibration.js',          // depends on: build_folds.js, reproduce_baseline.js, build_reliability_features.js, build_candidates.js
  'patch_ablation_A6.js',        // depends on: run_ablation_A4_A5.js, run_calibration.js -- see file header
  'build_configurations_log.js', // depends on: run_hybrid.js, run_selective_prediction.js, build_folds.js
  'run_functional_eval.js',      // depends on: build_candidates.js (independent otherwise)
  'run_safety_eval.js',          // depends on: build_candidates.js
  'run_statistical_analysis.js', // depends on: run_ablation.js, run_ablation_A4_A5.js (i.e. full ablation-results.json), build_folds.js, run_selective_prediction.js
  'build_error_taxonomy.js',     // depends on: build_candidates.js
  'generate_figures.js',         // depends on: everything above
  'generate_tables.js'           // depends on: everything above
];

console.log(`Running ${steps.length} pipeline steps in dependency order...\n`);
steps.forEach((s, i) => {
  console.log(`[${i + 1}/${steps.length}] ${s}`);
  execFileSync('node', [path.join(__dirname, s)], { stdio: 'inherit' });
});
console.log('\nPipeline complete. All research/results, research/calibration, research/analysis,'
  + ' research/figures, and research/tables artifacts regenerated.');
