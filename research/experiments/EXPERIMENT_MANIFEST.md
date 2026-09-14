# Experiment Manifest

Every experiment below writes a metadata JSON (experiment ID, git commit, dataset hash, model
name/version, parameters, seed, OS, Node version, timestamp) alongside its results, per Phase 2
of `research/paper/FINAL_RESEARCH_PLAN.md`. "Actual" and "Conclusion" columns are filled in as
each phase completes — they are intentionally blank/pending until run.

## E0 — Exploratory baseline
- **Objective:** Establish the pre-existing, already-frozen BM25 baseline as ground truth.
- **Status:** Pre-existing (`research/results/baseline-v0.1/`), predates this plan.

## E1 — Frozen benchmark baseline reproduction
- **Objective:** Confirm the frozen baseline is independently reproducible from a clean checkout.
- **Hypothesis:** Re-running `search()` against the unmodified benchmark yields outcomes
  identical to the archived `baseline-v0.1` results.
- **Independent variable:** none (control condition).
- **Dependent variables:** per-query retrieved command, evaluation status, aggregate accuracy metrics.
- **Dataset:** `termassist_bench_v0.1_validated.json` (150 queries).
- **Procedure:** `research/experiments/reproduce_baseline.js`.
- **Expected result:** 0 mismatches vs. archive.
- **Actual result:** 0/150 mismatches; all headline metrics (67.3/71.9/78.2/26.7/73.3/28.6/32)
  reproduced exactly. An apparent discrepancy in an ad-hoc "mean confidence on wrong" sanity
  metric (86.1% vs. the pre-existing analysis's 87.7%) was noted and fully resolved in Phase 9:
  `research/analysis/analysis_intermediate.json` (the data underlying that pre-existing document)
  itself records 86.06%, confirming the 87.7% was a transcription error in that document's prose,
  not a data or definitional discrepancy. Corrected with an erratum in
  `research/analysis/baseline-error-analysis.md`; 86.06% (86.1%) is now the canonical value.
- **Conclusion:** COMPLETE. Baseline is reproducible; safe to proceed to build on top of it.

## E2 — Error analysis
- **Objective:** Characterize failure modes of the frozen baseline by query type/category.
- **Status:** Pre-existing (`research/analysis/baseline-error-analysis.md`), predates this plan.
  Will be re-cross-checked against E1's reproduced results in Phase 16 (error taxonomy).

## E3 — Local semantic (dense) retrieval
- **Objective:** Establish a semantic-only (no BM25) retrieval baseline using a local, offline
  embedding model.
- **Hypothesis:** Semantic similarity retrieval will reduce failures on low-overlap-paraphrase
  and single-keyword queries relative to BM25, at the cost of losing exact-identifier precision
  BM25 gets "for free" on canonical/paraphrase queries.
- **Independent variable:** retrieval method (BM25 vs. dense-only).
- **Dependent variables:** per-query-type accuracy, OOD false-acceptance rate, latency.
- **Dataset:** same 150-query benchmark, 5-fold CV (Phase 4 protocol).
- **Model:** `Xenova/all-MiniLM-L6-v2` (local ONNX, 384-dim, mean-pooled, cosine similarity),
  run fully offline after a one-time weight download; corpus embeddings cached in
  `research/models/corpus_embeddings.json` (structured Intent/Description/Category/Platform
  text representation, see `build_embeddings.js`).
- **Status:** COMPLETE (exploratory, unconditional top-1 accept -- no OOD gating tuned yet;
  see caveat in `run_dense.js` header). Results: `research/results/dense/dense-summary.json`.
- **Actual result (vs. frozen BM25 baseline):**

  | Query type | BM25 baseline | Dense-only (exploratory) | Delta |
  |---|---:|---:|---:|
  | canonical | 100.0% | 100.0% | 0 |
  | paraphrase | 88.0% | 88.0% | 0 |
  | low_overlap_paraphrase | 33.3% | **46.7%** | +13.4 |
  | polysemy | 55.6% | 50.0% | -5.6 |
  | ambiguous (success rate) | 28.6% | 21.4%\* | -7.2 |
  | safety_sensitive | 100.0% | 86.7% | -13.3 |
  | complex_multi_intent | 86.7% | 80.0% | -6.7 |
  | single_keyword | 0.0% | 0.0% | 0 |
  | OOD false-acceptance | 73.3% | 100.0%\*\* | n/a |

  \* Ambiguous-success denominator/definition differs slightly from BM25's (dense run counts
  any top-1 match in the valid-command set; not yet a controlled comparison -- to be redone
  under the identical fold protocol in Phase 4/5).
  \*\* Expected/uninformative: this exploratory run has no rejection mechanism at all
  (unconditional top-1 accept), so 100% OOD false-acceptance is a property of the experiment
  design, not a finding about semantic retrieval's OOD capability -- that requires Phase 7.

- **Conclusion:** Dense retrieval does **not** uniformly dominate BM25. It measurably helps
  the lexical-gap failure mode it was hypothesized to help (low-overlap-paraphrase, +13.4pp),
  but measurably *hurts* three other slices (polysemy, safety-sensitive, complex-multi-intent)
  and does not fix single-keyword queries at all. This is a genuine, non-cherry-picked
  empirical result and directly motivates fusion (Phase 4) rather than replacement -- it also
  means the paper cannot claim "semantic retrieval is strictly better," only that it is
  complementary on specific failure modes, consistent with the general BM25-vs-dense
  complementarity literature (CodeRAG-Bench, 2024) rather than being a novel finding on its own.

## E4 — Hybrid retrieval (BM25 + dense)
- **Objective:** Determine whether fusing lexical and semantic scores improves over either alone.
- **Hypothesis:** some α ∈ (0,1) beats both pure BM25 (α=1) and pure dense (α=0) on aggregate
  and/or specific failure-mode subsets.
- **Independent variable:** fusion weight α, swept 0.0–1.0.
- **Dependent variables:** per-fold, per-query-type accuracy; OOD/ambiguity metrics.
- **Status:** COMPLETE. Protocol: nested 5-fold CV (seed 42, stratified folds), α selected per
  test fold using only the other 4 folds (dev), never the test fold itself. See
  `research/results/hybrid/HYBRID_FUSION_NOTES.md` and `hybrid-nested-cv-results.json`.
- **Actual result:** mean held-out non-OOD accuracy **77.1% (std 4.1pp)** vs. frozen BM25
  baseline's 71.9% supported-task accuracy -- a **+5.2pp** improvement with no test-fold
  leakage. 4/5 folds independently selected α=0.3 on dev data; 1/5 selected α=0.5. Two
  independent correctness checks pass exactly: α=1.0 reproduces the frozen baseline's 71.9%
  exactly, and α=0.0 reproduces E3's dense-only 72.6% exactly, confirming the fusion/evaluation
  pipeline introduces no discrepancy relative to already-verified ground truth.
- **Conclusion:** Hybrid fusion measurably beats pure BM25 on supported-task accuracy under a
  leakage-free protocol. This is a real, defensible result -- but it only covers accuracy, not
  OOD/ambiguity/calibration/safety, so it is one input to the Phase 17 decision gate, not the
  full research contribution on its own.

## E5 — Ablation (A0–A6)
- **Objective:** Isolate which component (substring bonus, dense retrieval, margin, OOD gate,
  calibration) is responsible for any observed improvement.
- **Status:** A0–A3 COMPLETE; A4–A6 PENDING (require Phase 6/7/8 components, explicitly marked
  `PENDING` in `research/results/ablation/ablation-table.csv`, not fabricated). See
  `research/results/ablation/ABLATION_NOTES.md`.
- **Actual result:** A0 (BM25, bonus) = 71.9%, A1 (BM25, no bonus) = 71.9% (**identical on all
  150 queries, 0 command differences** -- verified directly, not just at aggregate level), A2
  (dense only) = 72.7%, A3 (hybrid, nested-CV) = **77.1%**. A0's fold-aggregated mean exactly
  matches the frozen baseline's single-split 71.9%, confirming ablation methodology consistency.
- **Conclusion:** The +15 substring bonus contributes zero measured accuracy on this specific
  benchmark -- it fires for 47/150 queries but never flips the top-1 winner in any of them. This
  refines (does not simply confirm) the earlier qualitative error analysis, which named the
  bonus as a failure driver based on a plausible but not directly tested mechanism (near-tied
  BM25 scores among same-category commands). Practically, this means Phase 4's +5.2pp gain
  (A3 vs. A0/A1) is cleanly attributable to the dense/fusion mechanism, not confounded by an
  unrelated bonus effect, since A0 and A1 are the same starting point either way.

## E6 — OOD / rejection
- **Objective:** Evaluate whether margin/entropy/reliability-based rejection reduces the 73.3%
  OOD false-acceptance rate without destroying supported-task accuracy.
- **Status:** COMPLETE. Nested 5-fold CV, threshold tuned on dev folds only. Feature:
  `top1_score` (evidence-driven choice, see Phase 6 stats). See
  `research/results/reliability/SELECTIVE_PREDICTION_NOTES.md`.
- **Actual result:** mean test AUROC 0.867. Pooled recall (OOD rejection rate) improves from
  the frozen baseline's 26.7% to **46.7%** (+20pp); false-acceptance rate improves from 73.3%
  to 53.3%. Cost: 6/135 legitimate queries (4.4%) falsely rejected (pooled precision 53.8%).
- **Conclusion:** real, leakage-free improvement in OOD handling -- better, not solved. Honestly
  reported alongside its cost (false-rejection rate), not just its benefit.

## Phase 6 — Margin, entropy, top-k candidate capture
- **Objective:** Build the uncertainty signals (margin, relative margin, normalized entropy)
  that Phase 7's OOD/selective-prediction and A4's margin-based rejection depend on.
- **Status:** COMPLETE. See `research/results/reliability/MARGIN_ENTROPY_NOTES.md` and
  `candidates.json` (450 records: 150 queries x {lexical, dense, hybrid}).
- **Actual result:** both margin and normalized entropy separate correct from incorrect
  predictions in the expected direction for all three systems (e.g. hybrid mean margin: 0.284
  correct vs. 0.057 incorrect, a 5.0x ratio; lexical: 16.1x ratio). OOD queries' margins sit
  close to the incorrect-prediction distribution (e.g. hybrid OOD margin 0.126, well below the
  0.284 correct-prediction mean), consistent with margin being a usable OOD signal.
- **Conclusion:** descriptive evidence only -- no threshold has been tuned on any data yet.
  Confirms Phase 7 has a real signal to build a rejection rule on top of, not an assumption.

## E7 — Ambiguity handling
- **Objective:** Evaluate whether top-k/entropy signals correctly identify the 14 ambiguous
  benchmark queries as needing clarification rather than forced top-1 selection.
- **Status:** COMPLETE (weak result, reported honestly). Feature: `margin` (evidence-driven).
- **Actual result:** mean test AUROC 0.784 (real signal, weaker than OOD). Pooled: precision
  0.205, recall 0.643, F1 0.310 -- margin alone over-triggers on the much larger CORRECT class
  (35 false positives out of 44 flagged).
- **Conclusion:** ambiguity detection via margin alone is NOT a strong result and must not be
  oversold in the paper. A richer feature (margin+entropy combined, or learned) is noted as
  future work, not attempted without evidence it would help.

## Phase 7 continuation — Ablation A4/A5
- A4 (hybrid + margin-rejection): 88.5% selective accuracy @ 70.8% coverage, 8/15 OOD caught.
- A5 (+ OOD detection): 90.1% selective accuracy @ 69.5% coverage, 10/15 OOD caught, 11 correct
  answers sacrificed to abstention across both. Not directly comparable to A0-A3's unconditional
  accuracy -- see `research/results/ablation/ABLATION_NOTES.md`.

## Risk-coverage curve
- 100%-coverage risk (30.7%) exactly matches `1 - 104/150` from Phase 6's pooled hybrid hit
  count -- consistency check passed. At 50% coverage, risk drops to 10.7%, demonstrating real
  selective-prediction value using `top1_score` as the confidence ranking variable.

## E8 — Confidence calibration
- **Objective:** Reduce the measured 86–88% mean confidence on wrong answers via post-hoc
  calibration (isotonic regression), evaluated via ECE/Brier score, fold-wise.
- **Status:** COMPLETE. Nested 5-fold CV isotonic (PAV), 4 variants. See
  `research/calibration/CALIBRATION_NOTES.md`.
- **Bug found and fixed before reporting:** tied x-values (110/150 production confidences are
  exactly 100%) were not pre-aggregated before PAV, producing an invalid overlapping-block fit
  that made calibration look like it *hurt* two of the four variants. Root-caused via direct
  inspection (`predict(1.0)` returned 0.353 against a true ~80% dev accuracy), fixed by
  aggregating ties before fitting (standard practice), and a permanent overlapping-range
  assertion was added to `isotonic.js` to prevent recurrence.
- **Actual result (after fix, pooled across 5 test folds):** ECE improves for all 4 variants --
  baseline_confidence 0.269->0.117 (-56.7%), margin_confidence 0.342->0.112 (-67.2%),
  semantic_confidence 0.115->0.061 (-47.0%), hybrid_reliability 0.274->0.054 (**-80.4%**, the
  largest improvement, directly addressing the original 86.06%-mean-confidence-on-wrong-answers
  problem [corrected value, see Phase 9 erratum above] that motivated this entire research
  program).
- **Conclusion:** calibration measurably helps on this benchmark. Caveat stated explicitly: this
  is a small-sample (150-query) result with heavy value-ties, which is exactly what caused the
  bug above -- read as "calibration helps here," not "production-ready without more data."
- **A6 ablation row filled in:** same accept/reject decision as A5 (69.5% coverage, 90.1%
  selective accuracy, 10/15 OOD caught); adds calibrated confidence (ECE 0.054 vs. 0.274 raw)
  as the displayed number. Ablation matrix A0-A6 is now complete.

## E9 — Functional evaluation
- **Objective:** Distinguish retrieval-correctness from actual task-success for sandboxable
  command categories (filesystem/git/npm).
- **Status:** COMPLETE, narrow and explicitly scoped. 15/150 queries (git + filesystem,
  placeholder-free, non-interactive, host-safe). npm/docker/network/etc. explicitly excluded
  (network-dependent or host/destructive by nature) -- see
  `research/results/functional/FUNCTIONAL_EVAL_NOTES.md`.
- **Fixture bug caught before reporting:** an unrelated pre-added git remote in the sandbox
  fixture caused one retrieved command to fail for a reason unconnected to its real validity;
  removed before any number was reported.
- **Actual result:** gold functional success 100% (15/15, validates benchmark quality); retrieved
  (hybrid/A3) functional success 93.3% (14/15); **zero** cases of textually-correct-but-
  functionally-broken. The one real failure (TA-B103) is a textually wrong, cross-category
  retrieval that also fails functionally -- consistent, not surprising. Two "textually wrong but
  functionally succeeded" cases (git diff vs. --cached; remote add) illustrate the field's known
  one-to-many command mapping problem (also noted by Lin et al. 2018), not a system defect.
- **Conclusion:** positive but narrow signal -- only 10% of the benchmark could be safely
  sandboxed without building a placeholder-substitution system, stated as a limitation.

## E10 — Safety evaluation
- **Objective:** Precision/recall of a rule-based destructive-command tagger.
- **Status:** COMPLETE. Deterministic regex/keyword classifier (LOW/MEDIUM/HIGH/CRITICAL),
  authored before looking at per-query benchmark outcomes (not tuned against this benchmark's
  labels). Ground truth: the benchmark's existing `risk_level` field (120/10/15/5). See
  `research/results/safety/SAFETY_EVAL_NOTES.md`. No command executed in this phase.
- **Actual result:** exact 4-tier accuracy 89.6% (112/125 gold-command queries); risky
  (HIGH/CRITICAL) binary precision=0.95, recall=0.95, F1=0.95; zero dangerous-direction misses
  (no CRITICAL/HIGH command ever tagged LOW/MEDIUM). On retrieved (hybrid/A3) commands, accuracy
  holds (90.0%) but risky-binary precision drops to 0.826 -- a retrieval-error artifact (wrong
  commands sometimes trigger unrelated risk patterns), not a classifier defect.
- **Documented gaps, not patched against the benchmark:** `Stop-Process -Force` and `git merge`
  fall through to LOW (no covering rule); a few tier disagreements (e.g. `git reset --soft` LOW
  vs. benchmark's MEDIUM) are judgment calls, not misses. Explicitly left as future work rather
  than adding benchmark-specific rules after seeing the failures, which would be test-set tuning.
- **Conclusion:** strong, auditable performance on the actionable risky/not-risky distinction;
  imperfect but honestly reported on the finer 4-tier distinction.

## E11 — Optional local LLM comparison
- **Objective:** Contextualize retrieval-system results against a local (offline, non-shipped)
  LLM comparator, if hardware/time permit.
- **Status:** PENDING / OPTIONAL (Phase 12).

## E12 — Final statistical analysis
- **Objective:** Paired significance testing (McNemar's) for every system-vs-baseline comparison,
  with confidence intervals given the small (n=150) benchmark.
- **Status:** COMPLETE. Exact (binomial) McNemar's test + Wilson 95% CIs. See
  `research/results/final/STATISTICAL_ANALYSIS_NOTES.md`.
- **Bug found and fixed before reporting:** `A0.per_query` etc. include all 150 queries (OOD
  included, hit always false), silently diluting the accuracy denominator to 150 instead of 135
  and producing a wrong 64.7% figure contradicting every prior phase. Caught via an internal
  cross-check (a same-script Wilson-CI computation correctly showed 71.9%), fixed by filtering
  on the `classification` field, re-verified against all four known accuracy values before
  trusting any p-value.
- **Actual result:** A0 vs A3 (the headline hybrid-fusion result) IS statistically significant
  (71.9% vs 77.0%, 7 discordant pairs all favoring A3, p=0.0156). A2 vs A3 is NOT significant
  (72.6% vs 77.0%, p=0.146) despite a numerically similar-looking gap -- more discordant pairs
  split less one-sidedly. OOD rejection improvement (26.7%->46.7%) is directionally consistent
  but NOT statistically significant at n=15 (p=0.25) -- explicitly reported as underpowered, not
  as a confirmed null result.
- **Conclusion:** the paper can claim, with statistical backing, that hybrid fusion beats pure
  BM25. It cannot claim, with the same confidence, that hybrid beats dense alone, or that the
  OOD improvement is statistically confirmed -- both reported as real, measured, directionally
  consistent findings with explicit significance caveats, not silently upgraded.

## Phase 9 — Hyperparameter search log
- **Objective:** Consolidate every tuned threshold/alpha (Phases 4-8) into one machine-generated,
  auditable log, and resolve any outstanding metric-definition discrepancies before Phase 10+.
- **Status:** COMPLETE. See `research/results/PHASE9_HYPERPARAMETER_LOG.md` and
  `research/results/configurations.json` (30 rows: 14 FIXED, 15 TUNED, 1 METHODOLOGICAL_DEFINITION).
- **Actual result:** all values extracted programmatically from already-committed result files
  (never hand-retyped). Fully resolved the Phase 1 "86.1% vs 87.7%" discrepancy: traced to a
  transcription error in `baseline-error-analysis.md`'s prose (its own underlying data file,
  `analysis_intermediate.json`, records 86.06%, matching the independent reproduction exactly).
  Two related figures in the same document (confidence>=90% and confidence=100% counts) had the
  same class of error and were corrected alongside it, with a dated erratum, not a silent edit.
- **Conclusion:** canonical value for the paper is **86.06% (86.1%) mean confidence on wrong
  answers**, verified three independent ways. Every document in this research program now cites
  the corrected figure consistently.

## Phase 14 — Literature / novelty re-verification
- **Objective:** re-check literature for anything published since the original review that would
  affect novelty claims; populate `research/paper/related-work-matrix.csv`.
- **Status:** COMPLETE. See `research/paper/PHASE14_LITERATURE_RECHECK.md` (15-entry matrix).
- **Actual result:** 4 new 2026 papers found (QuoteBench, BashCoder-R1/BashBench, "BM25 Wins at
  Scale," whatisit-nl2sh) -- none invalidate the core novelty claim; QuoteBench and BashCoder-R1
  strengthen the paper's evaluation-methodology framing and reliability-tradeoff context.
- **Conclusion:** no paper found reports a BM25 retrieval baseline evaluated under nested-CV
  calibration/OOD/selective-prediction on the NL2Bash/NLC2CMD task family -- novelty claim holds.

## Phase 16 — Final error taxonomy (hybrid/A3)
- **Objective:** automated, deterministic multi-label error tagging (CORRECT/SEMANTIC_MISMATCH/
  LEXICAL_POLYSEMY/OOD_FALSE_ACCEPTANCE/AMBIGUITY_FAILURE/OVERMATCH/WRONG_ACTION/WRONG_SCOPE/
  WRONG_PLATFORM/LOW_OVERLAP_FAILURE/HIGH_CONFIDENCE_WRONG) for all 150 hybrid predictions.
- **Status:** COMPLETE. See `research/analysis/FINAL_ERROR_ANALYSIS_NOTES.md` and
  `final-error-analysis.{json,csv}`.
- **Actual result:** CORRECT=104, OOD_FALSE_ACCEPTANCE=15, AMBIGUITY_FAILURE=10,
  LOW_OVERLAP_FAILURE=8, LEXICAL_POLYSEMY=6, SEMANTIC_MISMATCH=5, WRONG_SCOPE=2,
  HIGH_CONFIDENCE_WRONG=39 (co-occurring tag). OVERMATCH/WRONG_ACTION/WRONG_PLATFORM are all
  legitimately zero, each explained (single-keyword queries are also labeled AMBIGUOUS by
  benchmark design; all 15 safety-sensitive queries are answered correctly; platform mismatch is
  structurally impossible given the pre-filter in cli/search.js), not silently omitted.
- **Key finding:** all 10 single-keyword failures are HIGH_CONFIDENCE_WRONG, and 39/46 (84.8%)
  of all wrong predictions overall are high-confidence -- concrete evidence that accuracy
  improvement (A0->A3) alone did not fix the calibration problem Phase 8 separately addressed.

## Phase 15 — Figures and tables
- **Objective:** generate publication-ready figures/tables programmatically from result files
  (no hand-typed numbers, no external charting dependency).
- **Status:** COMPLETE. 6 SVG figures (`research/figures/`) + 4 tables in md/csv
  (`research/tables/`), all read their source JSON directly so they cannot drift from the
  experiments that produced them. Verified: no NaN/undefined in any SVG; fig1's rendered values
  (71.9/72.7/77.1) and every table's numbers cross-checked against Phases 4-13 exactly.

## Phase 19 — Reproducibility & QC pass
- **Objective:** re-run everything from a clean state, check for hardcoded paths/credentials/
  non-determinism/orphaned files/broken links.
- **Status:** COMPLETE. See `research/REPRODUCIBILITY_QC.md`.
- **Reproducibility gap found and fixed:** Phase 8's ablation row A6 was patched in via a one-off
  inline command never saved as a script -- silently lost on a clean re-run. Extracted to
  `research/experiments/patch_ablation_A6.js` (reads ECE from calibration-results.json, not
  hardcoded) and added to the new canonical pipeline runner `research/experiments/run_all.js`.
- **Actual result:** every regenerated artifact verified programmatically identical to the
  committed version, excluding only expected-to-vary fields (timestamps, latency, git_commit
  provenance). Fold assignment (seed=42) is byte-identical. Zero hardcoded paths, zero
  credentials, zero broken references in any deliverable document. Benchmark hash and baseline
  reproduction re-verified exact.
- **Conclusion:** this is the third implementation-adjacent issue found and fixed by this
  program's own verification discipline (after Phase 8's isotonic bug and Phase 13's accuracy-
  denominator bug) -- reported, not hidden. The pipeline is now genuinely one-command
  reproducible from a clean checkout.

## v0.2 Benchmark Expansion — OOD Significance Resolved
- **Objective:** answer whether growing the OOD subset (15->50) and ambiguous subset (14->38)
  gives the Phase 13 OOD comparison enough statistical power (per PUBLICATION_ROADMAP.md's
  Card-et-al.-grounded power analysis).
- **Status:** COMPLETE. Full pipeline (baseline reproduction, hybrid fusion, candidates,
  reliability features, selective prediction, statistical analysis) re-run against
  `termassist_bench_v0.2` (209 queries), isolated in `research/results/v0.2/` -- v0.1's frozen
  results untouched. See `research/results/v0.2/V0.2_RESULTS_NOTES.md` and
  `research/datasets/v0.2_ADJUDICATION_REPORT.md`.
- **Actual result:** OOD detection improvement is now statistically significant:
  34.0%->68.0% rejection rate, p=0.000015 (vs. v0.1's p=0.25, n=15). All 17 discordant pairs
  favor the tuned detector. AUROC improved 0.867->0.901; ambiguity F1 improved 0.310->0.496
  (AUROC slightly decreased 0.784->0.723, reported honestly).
- **Conclusion:** the single statistical caveat in the Phase 17 decision gate ("OOD improvement
  not statistically confirmed at n=15") is now resolved on the expanded benchmark. Provenance of
  the new 59 queries (AI-agent-authored under human direction, verified against actual retrieval
  output) is disclosed explicitly, not hidden.
