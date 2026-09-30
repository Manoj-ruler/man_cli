# E1-04: the frozen v0.2 thresholds, and how they were derived

**Checked:** 2026-09-30, read-only. **Nothing was written to the results; nothing was scored on
CLINC.**

**Decisions (author, 2026-09-30):**

- **D2 = (a):** apply all five thresholds; the primary result is the median rate, with the min–max
  as a sensitivity range.
- **ISSUE-06, option 1:** R1 stays s < 2.0 as primary; R1-CLI (s < 2.36) is added as a secondary
  line; the §1 wording is corrected.
- Both are now in `E1_PROTOCOL.md` §1 and §4.

**Method.** Each value was read from the committed result file, and the selection procedure was then
**re-run from the committed per-query data** with the same code logic (session scratchpad
`e1_04_thresholds.js`). Every value reproduced exactly.

## 1. Values

| Rule | Fold 0 | Fold 1 | Fold 2 | Fold 3 | Fold 4 | Source field |
|---|---|---|---|---|---|---|
| **R2**: tuned threshold on the shipped score s | 6.4952 | 6.4952 | 6.4952 | 7.1978 | 6.4952 | `results/review_r1/review_r1_e_ood_operating_points.json :: versions.v0.2.nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25` |
| **R3**: hybrid detector threshold on the fused top-1 score | 0.9179 | 0.9219 | 0.8841 | 0.9247 | 0.9219 | `results/v0.2/selective-prediction-results.json :: ood_detection.per_fold[k].selected_threshold` (`score_feature: top1_score`, `lower_means_positive: true`) |
| Hybrid α | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | `results/v0.2/hybrid-nested-cv-results.json :: aggregate.selected_alpha_per_fold` |
| **R1**: fixed rule | s < 2.0 (no tuning) | | | | | `cli/search.js` (see §3) |

- **Folds:** 5, seed 42, stratified by label (`results/v0.2/folds.json`).
- **Re-derivation (2026-09-30):**
  - R2 re-selects 6.4952, 6.4952, 6.4952, 7.1978, 6.4952 (dev F1 0.7912, 0.8043, 0.8132, 0.8261,
    0.8409). Applied fold by fold, the exact thresholds reject **46/50** out-of-scope queries, as
    frozen.
  - R3 re-selects exactly the five stored values.

## 2. How they were derived (code)

**R2** (`research/experiments/review_r1_e_ood_operating_points.js`, lines 76–88):

1. For each test fold, the candidate thresholds are the **distinct shipped scores observed in the 4
   development folds** (line 86).
2. A query is predicted out of scope if its score is below the threshold (`rawScore(id) < t`, line 81).
3. The threshold with the highest F1 (out-of-scope = positive) is kept. Because the comparison is a
   strict `>`, **ties go to the lowest threshold** (line 86).
4. It is applied once to the test fold.

The winning thresholds are the scores of two benchmark queries: **TA-B053 (6.4952)** for folds 0, 1,
2 and 4, and **TA-B051 (7.1978)** for fold 3. The next lower development scores are 6.3334 and
6.8449.

**R3** (`research/experiments/run_selective_prediction_v0_2.js`, `tuneThreshold`, lines 39–54): the
same rule, strict `<`, ties to the lowest, applied to the fused top-1 score.

## 3. Score scales and rounding

These must be matched exactly when scoring CLINC (E1-05 and E1-06).

1. **The shipped score s includes the +15 intent bonus.**
   - The R2 source field is named `…raw_bm25`, but the code uses `repro.actual.score` (line 80). That
     is `search(query).score` from the shipped `cli/search.js`, **including the substring bonus**
     (`reproduce_baseline_v0_2.js`, line 60).
   - **The name is misleading, and the paper does not use it.** The paper says "a threshold on the
     shipped score s" (§4 (ii)), which is correct.
2. **Rounding to 4 decimals.** The reproduction stores s rounded to 4 decimals
   (`reproduce_baseline_v0_2.js:60`, `+score.toFixed(4)`), and R2 was tuned and applied on those
   stored values. The candidate files store the fused top-1 score rounded to 4 decimals
   (`build_candidates_v0_2.js:54`), and R3 was tuned and applied on those.
   - **E1 must round s and the fused score to 4 decimals before comparing them with R2 and R3.**
3. **R1 is evaluated on the unrounded live values.**
   - `reproduce_baseline_v0_2.js:44`: a query is answered iff `confidence > 0 && score >= 2.0`, and
     rejected otherwise.
   - `review_r1_e…js:27` uses the same rule.
4. **The fused score** is the hybrid's min-max-normalised combination with α = 0.5, over each
   query's candidates (paper §4). Its range is [0, 1], and it equals 1 when BM25 and dense agree on
   the top command. E1-05 must confirm that it can be computed for a new query exactly as for the
   benchmark queries.

## 4. ISSUE-06: R1 vs the shipped CLI's 30% rule (found in this task)

- **The two rules:**
  - The paper's R1 (and E1 protocol §1) rejects when s < 2.0.
  - The shipped CLI refuses when the **displayed confidence** is below 30%, with confidence =
    min(round(100·s/8), 100) (`cli/search.js`; `cli/index.js`).
  - Since `Math.round(29.5) = 30`, the CLI refuses exactly when **s < 2.36**.
- **Why this matters for E1:**
  - The two rules agree on the benchmark only because **no benchmark query scores in [2.0, 2.36)**
    (paper §3: "no benchmark query scores between 2.0 and 2.4, so this makes the same decisions as
    the 30% rule"; TEST-02 checks this).
  - On CLINC they may differ. The approved protocol §1 says "s < 2.0 (equivalently, the displayed
    confidence is below 30%)", and **that "equivalently" is not guaranteed on external data.**
- **Options (for the author, recorded as ISSUE-06; this does not block E1-04):**
  1. Keep R1 = s < 2.0 as the primary rule, for continuity with the paper's v0.2 numbers. Add
     R1-CLI = s < 2.36 (the displayed-confidence rule) as a secondary line. Report how many CLINC
     queries fall in [2.0, 2.36).
  2. Make R1-CLI primary, because it is what users of the tool experience.
- **Recommendation:** option 1, with the correction to the §1 wording ("equivalently" becomes "on
  the benchmark, equivalently").

## 5. Decision D2: applying five per-fold thresholds to external data

**The problem.** Inside cross-validation, each benchmark query met the threshold of its own test fold.
A CLINC query belongs to no fold.

**A property that simplifies the choice.** For a fixed rule and score, the number of rejected queries
never decreases as the threshold rises. With five thresholds (an odd number), **the rejection rate at
the median threshold equals the median of the five rejection rates.** The median thresholds are
**6.4952** (R2) and **0.9219** (R3).

**Options:**

- **(a) Apply all five thresholds separately and report each rate. Recommended.**
  - The **primary point estimate** is the median, which by the property above equals the rate at
    the median threshold.
  - The **sensitivity range** is the min–max over the five. For R2 that is just two values: the
    rate at 6.4952 and at 7.1978.
  - It needs no new tuning, uses only frozen values, and shows how much the answer depends on the
    fold.
- **(b) Use the median threshold alone** (6.4952 / 0.9219). The point estimate equals (a)'s, but the
  sensitivity range is lost.
- **(c) Refit one threshold on all of v0.2.** Not recommended: it is a new tuning step, the quantity
  was never reported in the paper, and it needs explicit approval under the plan's rules.

**Intervals** (E1-07): a cluster bootstrap over intents (P1), or over queries (P2), of the rate at
the median threshold. The five-fold range is reported alongside as a sensitivity range, not as an
interval.
