# T19: implementation facts the paper needs (read from the code, 2026-09-28)

This file answers two review items:
- **REV-06:** what the published tool shows its user;
- **REV-16:** the full specification of the research system.

Every fact cites the file and line it was read from. Paths are relative to the repository root.

## A. The published CLI (`cli/`): what a user sees (REV-06)

| Fact | Source |
|---|---|
| The query goes to `search.js`. The tool prints the chosen command, then a line `category: <category>  •  confidence: <N>%`. | `cli/index.js:53-68` |
| **Rejection rule.** If confidence < 30, or there is no command, it prints "No confident match found. Try rephrasing." and exits. | `cli/index.js:58-61` |
| Confidence = min(round(score/8 × 100), 100), and it is set to 0 when score < 2.0. | `cli/search.js:119-126` |
| **Execution model.** After printing, the tool opens an editable prompt pre-filled with the command ("Ready to execute (Edit if needed)"). Enter runs the text, as edited, through `execSync` (PowerShell on Windows); Ctrl+C aborts. No risk warning or risk level is shown. | `cli/index.js:84-106` |
| **Network.** Retrieval is local. An optional sync logs the query, the matched command, its category and the response time to a dashboard. It is **off by default** (`sync_enabled: false`, empty `api_token`) and runs only when the user enables it. | `cli/index.js:72-82`; `cli/config.js:14-18` |
| **Research baseline vs. the CLI.** The research baseline treats a query as answered when score ≥ 2.0 (`reproduce_baseline.js:105`), whereas the CLI also rejects confidence < 30, i.e. score < 2.4. **No query in v0.1 or v0.2 has 2.0 ≤ score < 2.4**, so the two rules make identical decisions on both benchmarks (checked 2026-09-28 against `results/{baseline,v0.2}/reproduction-results.json`). The paper should state the CLI's 30% rule and note that the two agree here. | as cited |

**What calibration could change for this user.** The printed percentage and the 30% gate are the only
places confidence reaches the user. A calibrated percentage would change the number shown and, if the gate
were recalibrated, which queries are refused. The paper tests neither with users.

## B. The research system specification (REV-16)

| Component | Definition | Source |
|---|---|---|
| Candidate set | The Windows-visible corpus (279 records), per query. | `build_query_scores*.js` |
| Dense encoder | `Xenova/all-MiniLM-L6-v2`. Each corpus record is embedded as the text "Intent: … Description: … Category: … Platform: …". | `build_embeddings.js:11-20` |
| **Fusion** | For each query, BM25 scores (with the +15 bonus) and cosine similarities are **min-max normalized over that query's full candidate set**. The fused score is α·BM25_norm + (1−α)·dense_norm; the top-1 is the argmax. | `hybrid_fusion.js:1-5, 7-17, 26-44` |
| α selection | Grid {0.0, 0.1, …, 1.0}. The objective is **non-OOD accuracy on the 4 development folds**; ties go to the value closest to 0.5. Selected per test fold: v0.1 0.3, 0.3, 0.3, 0.3, 0.5; v0.2 0.5 in every fold. | `run_hybrid.js:3-11, 23, 78-89`; `results/{hybrid,v0.2}/hybrid-nested-cv-results.json` |
| **Hybrid confidence** (`top1_score`, the "hybrid_reliability" signal) | The fused score of the top-1 candidate. **It is not an absolute match score.** Each list's best candidate normalizes to 1, so the fused top score is exactly 1.0 when BM25 and dense retrieval agree on the top command, and below 1 only when they disagree. This explains why 64% (v0.1) and 53% (v0.2) of values tie at 1.0. | `build_candidates.js:66-72`, with `hybrid_fusion.js` |
| Margin | Top-1 minus top-2 fused score among the top 10. The relative margin is margin / top-1. | `build_candidates.js:27, 52-57` |
| Entropy | For the top-10 fused scores: shift so the minimum is 0, normalize to sum to 1, take the Shannon entropy in bits, and divide by log2(10). It is a concentration measure, not a probability. | `build_candidates.js:9-13, 38-49` |
| **OOD detector** | Reject if `top1_score` (the fused score above) < threshold. The threshold is chosen per fold to **maximize F1 on the development folds**, sweeping the observed development values. Selected thresholds: v0.1 0.833, 0.833, 0.833, 0.895, 0.895; v0.2 0.918, 0.922, 0.884, 0.925, 0.922. | `run_selective_prediction.js:52-70, 142`; `results/*/selective-prediction-results.json` |
| Ambiguity detector | Flag if margin < threshold (F1-maximizing on the development folds). v0.1 thresholds 0.041–0.095; v0.2 0.061–0.062. | `run_selective_prediction.js:143` |
| A4 / A5 | A4 abstains when margin < that fold's ambiguity threshold, reusing the threshold rather than tuning a new one. A5 is A4's rule OR the OOD detector. | `run_ablation_A4_A5.js:1-10` |
| Calibration signals | baseline = shipped confidence / 100; hybrid_reliability = `top1_score`; margin_confidence and semantic_confidence = the margin and dense top-1 cosine, each **min-max normalized over all queries** (a monotone rescaling). Isotonic regression (PAV with tie aggregation) is fit on development folds only. | `run_calibration.js:7-17, 39-66`; `phase1_common.js:52-55` |
| **Feature choice for the detectors** | top1_score for OOD and margin for ambiguity were chosen by comparing **class means on the full dataset** (e.g. OOD mean 0.841 vs. CORRECT 0.980). This was a one-time descriptive choice made outside cross-validation, a mild form of leakage the paper must disclose. | `build_reliability_features.js` (summary block); `run_selective_prediction.js:6-11` |

## C. What this changes in the paper (feeds T21)

1. **Correct errors in the paper.**
   - §6 says the OOD feature is the "absolute top-1 score". It is the fused, per-query-normalized top-1 score, which in effect measures whether BM25 and the dense encoder agree.
   - §3 (my round-1 sentence) says the added OOD queries were screened with "the scores the OOD detector thresholds". They were screened with **raw** BM25 ≤ 7.39 and cosine ≤ 0.31, which is a different quantity from the fused normalized score. The **baseline's** rejection (raw BM25 < 2.0) is directly related to that screen.
   - T18 (REV-14) should measure how strongly the raw-score screen predicts the fused feature before any wording is fixed.
2. **Describe the interaction model.** The tool prints the command and a confidence percentage, refuses below 30%, and on Enter runs a pre-filled, editable command, with no risk display.
3. **State the retrieval as offline**, with an opt-in sync that is off by default.
4. **Add the specification**, preferably as a compact appendix table, and disclose that the detector features were chosen using full-data class means.
