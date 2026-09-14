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
  reproduced exactly. Minor definitional discrepancy in an ad-hoc "mean confidence on wrong"
  sanity metric noted (86.1% vs. 87.7%), root-caused to differing wrong-set definitions across
  scripts, not non-determinism — flagged for resolution in E-metric-standardization (Phase 9).
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
- **Status:** PENDING (Phase 4).

## E5 — Ablation (A0–A6)
- **Objective:** Isolate which component (substring bonus, dense retrieval, margin, OOD gate,
  calibration) is responsible for any observed improvement.
- **Status:** PENDING (Phase 5).

## E6 — OOD / rejection
- **Objective:** Evaluate whether margin/entropy/reliability-based rejection reduces the 73.3%
  OOD false-acceptance rate without destroying supported-task accuracy.
- **Status:** PENDING (Phase 7).

## E7 — Ambiguity handling
- **Objective:** Evaluate whether top-k/entropy signals correctly identify the 14 ambiguous
  benchmark queries as needing clarification rather than forced top-1 selection.
- **Status:** PENDING (Phase 6/7, evaluated jointly with E6).

## E8 — Confidence calibration
- **Objective:** Reduce the measured 86–88% mean confidence on wrong answers via post-hoc
  calibration (isotonic regression), evaluated via ECE/Brier score, fold-wise.
- **Status:** PENDING (Phase 8).

## E9 — Functional evaluation
- **Objective:** Distinguish retrieval-correctness from actual task-success for sandboxable
  command categories (filesystem/git/npm).
- **Status:** PENDING (Phase 10).

## E10 — Safety evaluation
- **Objective:** Precision/recall of a rule-based destructive-command tagger.
- **Status:** PENDING (Phase 11).

## E11 — Optional local LLM comparison
- **Objective:** Contextualize retrieval-system results against a local (offline, non-shipped)
  LLM comparator, if hardware/time permit.
- **Status:** PENDING / OPTIONAL (Phase 12).

## E12 — Final statistical analysis
- **Objective:** Paired significance testing (McNemar's) for every system-vs-baseline comparison,
  with confidence intervals given the small (n=150) benchmark.
- **Status:** PENDING (Phase 13).
