// T16 (research/PLAN_TASKS.md): ordered runner for everything after the v0.1 pipeline.
//
// Full reproduction from a clean checkout (see research/REPRODUCE.md):
//   node research/experiments/check_model_cache.js   (verifies the embedding model files)
//   node research/experiments/run_all.js             (v0.1 pipeline, Phases 1-19)
//   node research/experiments/run_all_v0_2.js        (this file)
//
// Order: v0.2 mirrors the v0.1 dependency chain in run_all.js step for step. Then come the
// cross-version analyses, which read both versions: Split B, bootstrap CIs, Holm correction, and
// the bare-keyword sensitivity analysis. Then the tables and figures are regenerated from the
// final result files, and last the Phase 1 corrections, each of which re-checks the committed
// numbers it builds on before writing anything.
// Every step aborts the run on a non-zero exit.

const { execFileSync } = require('child_process');
const path = require('path');

const steps = [
  // --- v0.2 pipeline (same order as the v0.1 chain in run_all.js) ---
  'reproduce_baseline_v0_2.js',
  'build_query_scores_v0_2.js',          // needs the embedding model (check_model_cache.js)
  'build_folds_v0_2.js',
  'run_hybrid_v0_2.js',                  // query scores + folds
  'run_ablation_v0_2.js',                // query scores + folds + hybrid
  'build_candidates_v0_2.js',            // query scores + folds + hybrid
  'build_reliability_features_v0_2.js',  // candidates
  'run_selective_prediction_v0_2.js',    // reliability features + folds
  'run_ablation_A4_A5_v0_2.js',          // selective prediction + ablation
  'run_calibration_v0_2.js',             // folds + baseline + reliability features + candidates
  'patch_ablation_A6_v0_2.js',           // A4/A5 + calibration
  'run_safety_eval_v0_2.js',             // candidates
  'run_statistical_analysis_v0_2.js',    // reproduction + selective prediction + features
  'run_full_statistical_analysis_v0_2.js', // full ablation-results.json
  'build_error_taxonomy_v0_2.js',        // candidates
  // --- cross-version analyses ---
  'run_split_b_v0_1.js',
  'run_split_b_v0_2.js',
  'run_bootstrap_ci.js',                 // both versions' ablation, folds, features
  'apply_holm_correction.js',            // both statistical-analysis files + bootstrap CIs
  'run_sensitivity_bare_keyword.js',
  // --- tables and figures, from final result files ---
  'generate_tables.js',
  'generate_tables_v0_2.js',
  'generate_tables_stats_hardening.js',
  'generate_sensitivity_table.js',       // writes research/paper/acl_latex/table_sensitivity.tex
  'generate_figures.js',                 // SVGs; the paper's PNGs are converted separately (REPRODUCE.md)
  // --- Phase 1 analysis corrections (T1-T5, T3b) ---
  'run_phase1.js'
];

console.log(`Running ${steps.length} steps in dependency order...\n`);
const t0 = Date.now();
steps.forEach((s, i) => {
  console.log(`[${i + 1}/${steps.length}] ${s}`);
  execFileSync('node', [path.join(__dirname, s)], { stdio: 'inherit' });
});
console.log(`\nDone in ${((Date.now() - t0) / 1000).toFixed(0)} s. Compare with the committed files: see research/REPRODUCE.md.`);
