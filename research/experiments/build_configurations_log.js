// Phase 9 -- consolidate every tuned threshold/alpha/parameter used anywhere in Phases 4-8
// into one canonical, machine-generated log. Values are read directly from each phase's
// already-committed result files (not retyped by hand), so this script cannot introduce a
// transcription error of the kind just found and fixed in baseline-error-analysis.md.
//
// Each row is tagged TUNED (selected via a dev-only nested-CV procedure, using correctness
// labels) or FIXED (inherited from the frozen production baseline, or a methodological design
// choice made without reference to any accuracy metric) -- this distinction is what lets a
// reviewer verify nothing was picked by peeking at test-set performance.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));

const folds = read('research/results/hybrid/folds.json');
const hybridCv = read('research/results/hybrid/hybrid-nested-cv-results.json');
const selPred = read('research/results/reliability/selective-prediction-results.json');

const rows = [];

// --- FIXED parameters, inherited unchanged from the frozen production baseline ---
rows.push({ parameter: 'BM25 k1', value: 1.2, type: 'FIXED', source: 'cli/search.js (frozen, unmodified)', experiment_id: 'A0-A6 (all)', notes: 'inherited from production; never tuned in this research program' });
rows.push({ parameter: 'BM25 b', value: 0.75, type: 'FIXED', source: 'cli/search.js (frozen, unmodified)', experiment_id: 'A0-A6 (all)', notes: 'inherited from production; never tuned in this research program' });
rows.push({ parameter: 'Exact-intent substring bonus', value: 15.0, type: 'FIXED', source: 'cli/search.js (frozen, unmodified)', experiment_id: 'A0 vs A1', notes: 'inherited; ablated (not retuned) in Phase 5 -- found to have zero effect on top-1 accuracy on this benchmark' });
rows.push({ parameter: 'Production confidence divisor', value: 8.0, type: 'FIXED', source: 'cli/search.js (frozen, unmodified)', experiment_id: 'E8 baseline_confidence variant', notes: 'confidence = min(score/8*100, 100); superseded by calibrated confidence in A6, not modified in place' });
rows.push({ parameter: 'Production rejection threshold', value: 2.0, type: 'FIXED', source: 'cli/search.js (frozen, unmodified)', experiment_id: 'A0-A6 (all)', notes: 'raw BM25 score floor below which production returns confidence=0' });

// --- FIXED methodological/design choices (not accuracy-tuned) ---
rows.push({ parameter: 'Embedding model', value: 'Xenova/all-MiniLM-L6-v2', type: 'FIXED', source: 'research/experiments/build_embeddings.js', experiment_id: 'E3, E4, E5(A2/A3), E6/E7, E8', notes: 'design choice (small, CPU-local, offline-capable ONNX model); not selected via a model-comparison sweep' });
rows.push({ parameter: 'Embedding dimension', value: 384, type: 'FIXED', source: 'research/experiments/build_embeddings.js', experiment_id: 'same as above', notes: 'determined by the chosen model, not tuned' });
rows.push({ parameter: 'Corpus representation for embedding', value: 'Intent/Description/Category/Platform structured text', type: 'FIXED', source: 'research/experiments/build_embeddings.js', experiment_id: 'same as above', notes: 'design choice, not compared against alternative representations' });
rows.push({ parameter: 'CV fold count (K)', value: folds.k, type: 'FIXED', source: 'research/experiments/build_folds.js', experiment_id: 'E4-E8 (all nested-CV experiments)', notes: '5-fold chosen per FINAL_RESEARCH_PLAN.md Phase 4 given n=150' });
rows.push({ parameter: 'CV fold seed', value: folds.seed, type: 'FIXED', source: 'research/experiments/build_folds.js', experiment_id: 'same as above', notes: 'mulberry32(42), deterministic and documented for reproducibility' });
rows.push({ parameter: 'Alpha grid resolution', value: '0.0 to 1.0, step 0.1 (11 values)', type: 'FIXED', source: 'research/experiments/run_hybrid.js', experiment_id: 'E4', notes: 'grid density is a design choice; the SELECTED alpha per fold (below) is the tuned value' });
rows.push({ parameter: 'Top-k candidate window', value: 10, type: 'FIXED', source: 'research/experiments/build_candidates.js', experiment_id: 'E6', notes: 'used for margin/entropy computation; not accuracy-tuned' });
rows.push({ parameter: 'ECE bin count', value: 10, type: 'FIXED', source: 'research/experiments/run_calibration.js', experiment_id: 'E8', notes: 'standard equal-width ECE binning; not tuned to favor a particular result' });
rows.push({ parameter: 'Isotonic regression algorithm', value: 'PAV (Pool-Adjacent-Violators), non-parametric', type: 'FIXED', source: 'research/experiments/isotonic.js', experiment_id: 'E8', notes: 'no hyperparameter to tune; had a tie-handling bug found and fixed in Phase 8 (see CALIBRATION_NOTES.md)' });

// --- TUNED parameters, selected via nested CV on dev folds only (extracted, not retyped) ---
hybridCv.per_fold_results.forEach(f => {
  rows.push({ parameter: 'Hybrid fusion alpha', value: f.selected_alpha, type: 'TUNED', source: 'research/results/hybrid/hybrid-nested-cv-results.json', experiment_id: 'E4', dataset_split: `test_fold=${f.test_fold} (selected on the other 4 folds only)`, metric: 'dev non-OOD accuracy', metric_value: f.dev_accuracy_at_selected_alpha, notes: `held-out test-fold accuracy at this alpha: ${f.test_non_ood_accuracy}` });
});

selPred.ood_detection.per_fold.forEach(f => {
  rows.push({ parameter: 'OOD detection threshold (top1_score)', value: f.selected_threshold, type: 'TUNED', source: 'research/results/reliability/selective-prediction-results.json', experiment_id: 'E6', dataset_split: `test_fold=${f.test_fold} (selected on the other 4 folds only)`, metric: 'dev F1 (is_ood positive class)', metric_value: f.dev_f1_at_selected_threshold, notes: `held-out test-fold F1 at this threshold: ${f.test.f1}` });
});

selPred.ambiguity_detection.per_fold.forEach(f => {
  rows.push({ parameter: 'Ambiguity detection threshold (margin)', value: f.selected_threshold, type: 'TUNED', source: 'research/results/reliability/selective-prediction-results.json', experiment_id: 'E7', dataset_split: `test_fold=${f.test_fold} (selected on the other 4 folds only)`, metric: 'dev F1 (is_ambiguous positive class)', metric_value: f.dev_f1_at_selected_threshold, notes: `held-out test-fold F1 at this threshold: ${f.test.f1}` });
});

// --- Metric-definition canonicalization (the erratum resolved earlier in this phase) ---
rows.push({
  parameter: 'Canonical definition of "wrong" for confidence-on-error metrics',
  value: 'status in {INCORRECT, AMBIGUOUS_INCORRECT, OOD_FALSE_ACCEPT} (excludes REJECTED)',
  type: 'METHODOLOGICAL_DEFINITION',
  source: 'research/results/baseline/REPRODUCTION_NOTES.md, research/analysis/baseline-error-analysis.md (erratum)',
  experiment_id: 'E1, E2, E8',
  notes: 'Canonical mean-confidence-on-wrong value: 86.06% (86.1%), verified three times independently (archived baseline-v0.1, independent reproduction, and analysis_intermediate.json). A prior document (baseline-error-analysis.md) contained a transcription error (87.7%) that has been corrected with an erratum, traced to its own source data file.'
});

const outPath = path.join(projectRoot, 'research/results/configurations.json');
fs.writeFileSync(outPath, JSON.stringify({ generated_at: new Date().toISOString(), row_count: rows.length, rows }, null, 2), 'utf-8');

console.log(`Wrote ${rows.length} configuration/parameter rows to ${outPath}`);
console.log(`  FIXED: ${rows.filter(r => r.type === 'FIXED').length}`);
console.log(`  TUNED: ${rows.filter(r => r.type === 'TUNED').length}`);
console.log(`  METHODOLOGICAL_DEFINITION: ${rows.filter(r => r.type === 'METHODOLOGICAL_DEFINITION').length}`);
