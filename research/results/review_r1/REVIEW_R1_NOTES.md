# T18: analyses answering review round 1

**Date:** 2026-09-28. Run with `node research/experiments/run_review_r1.js`. Status: post hoc, exploratory.

**How it was checked.**
- Every script first reproduces the committed numbers it builds on (53 checks) and aborts on any mismatch.
- Two full runs gave identical output (timestamps excepted).
- Bootstrap: 10,000 resamples, seed 42. Simulations: 2,000 draws, seed 7.

The source review items are in `research/paper/review_round1/phase2_editorial_decision.md`.

## A. OOD selection effect (REV-14): `review_r1_a_ood_selection.json`

**What the screening actually was.**
- All 35 drafted OOD candidates were accepted **unchanged**: 0 discarded, 0 edited.
- The 7.39 / 0.31 values are the maxima observed afterwards, not cut-offs set in advance. The screen filtered nothing out.

**The added queries do look easier on raw scores:**

| Group | Median top-1 BM25 | Median cosine | Inside the screen region |
|---|---|---|---|
| Added OOD (35) | 4.4 | 0.17 | 34/35 |
| Original OOD (15) | 5.1 | 0.27 | 10/15 |
| Non-OOD (159) | — | — | 2/159 |

**But the detector's gain is the same on both.** Detector minus baseline: +34.3 points on the added queries
and +33.3 on the original ones. The difference, +1.0 points, has a 95% CI of [−28.6, +29.5], so it is
uninformative with n = 15 but shows no sign of inflation.

**How raw scores relate to the detector's feature.** The detector thresholds the fused, per-query-normalized
top-1 score (T19), not raw BM25 or cosine. They are related: Spearman 0.70–0.72 over all queries, 0.47–0.49
within non-OOD queries. A fused score of exactly 1.0 (the two retrievers agree) occurs for 67% of non-OOD
queries but only 6–13% of OOD queries.

## E. OOD at matched operating points (REV-49): `review_r1_e_ood_operating_points.json`

**Headline: the OOD "doubling" is a threshold choice, not a benefit of the hybrid.**

The baseline's own raw BM25 score ranks OOD queries **better** than the hybrid detector's fused feature:

| | Baseline raw BM25 | Hybrid detector feature | Difference |
|---|---|---|---|
| AUROC, v0.1 | 0.950 [0.910, 0.981] | 0.855 [0.733, 0.954] | −0.095 [−0.208, −0.005] |
| AUROC, v0.2 | 0.963 [0.939, 0.981] | 0.900 [0.842, 0.949] | −0.063 [−0.119, −0.015] |

**Tuning the baseline's threshold the same way as the detector** (nested, F1-maximizing on development folds):

| | Tuned baseline threshold | Hybrid detector | Exact McNemar |
|---|---|---|---|
| v0.1, OOD rejected | 10/15 | 7/15 | p = 0.25 |
| v0.1, false rejections | 9/135 | 6/135 | p = 0.55 |
| v0.2, OOD rejected | 46/50 | 34/50 | **p = 0.004** |
| v0.2, false rejections | 20/159 | 11/159 | p = 0.093 |

**Caveat.** On v0.2 the tuned baseline thresholds (6.5–7.2) sit just under the 7.39 raw-BM25 maximum of the
screened queries, so the selection effect favours the **baseline** on that score. v0.1 (keyword-verified
OOD) points the same way but is small.

**In-sample ROC sweep** (thresholds chosen on the same data, equal footing for both scores). At a matched
false-rejection rate the baseline score rejects as many OOD queries as the detector, or more:
- v0.2, at ≤11/159 false rejections: 37/50 vs 36/50;
- v0.1, at ≤6/135: 10/15 vs 7/15.

**Paper consequence.** Report the OOD result as "a tuned rejection threshold rejects far more OOD requests
than the shipped fixed rule". Do **not** credit the hybrid for OOD detection: the hybrid's feature is a worse
OOD ranker than raw BM25. This directly answers DA M3 and REV-49, and changes blocking issue 2.

## B. Calibration interpretability (REV-15, DA M1): `review_r1_b_calibration.json`

- **The miscalibration is real.** Uncalibrated ECE is 0.26–0.37, far above the noise floor a perfectly
  calibrated forecaster shows at this n (mean 0.04–0.06, 95th percentile ≤ 0.105, equal-width bins).
- **Calibration brings ECE to about the noise floor in most cells.** Examples (equal-width ECE after
  calibration vs the floor's 95th percentile):

  | Signal, version, population | ECE after | Floor 95th pct | Reading |
  |---|---|---|---|
  | Shipped, v0.1, controls excluded | 0.069 | 0.105 | Within the floor |
  | Shipped, v0.2, controls excluded | 0.063 | 0.080 | Within the floor |
  | Hybrid, v0.1, controls excluded | 0.108 | 0.089 | Residual miscalibration |
  | Shipped, v0.1, all | 0.117 | 0.094 | Residual miscalibration |

  So the claim should be "much closer to calibrated", not "calibrated".
- **The choice of estimator doesn't change the picture.** Equal-mass bins and ECE-sweep give post-calibration
  values of 0.02–0.11, the same picture as equal-width bins.
- **Relative reductions with CIs** (shipped confidence, controls excluded): 78.6% [44.2, 84.4] on v0.1 and
  78.5% [52.4, 87.2] on v0.2.
- **Skill against an out-of-fold no-skill forecaster** (DA M1):
  - Raw confidences mostly have **negative** Brier skill, i.e. worse than always predicting the base rate.
    Significantly so for the hybrid (v0.1 controls excluded: −0.32 [−0.50, −0.11]). For the shipped
    confidence it is borderline (v0.1 controls excluded: −0.23 [−0.45, +0.01]).
  - Calibrated confidences have **positive** skill of 0.20–0.45, and every CI excludes zero (e.g. shipped
    confidence, v0.2 controls excluded: 0.33 [0.19, 0.46]).
  - So calibration turns an uninformative-to-harmful confidence into an informative one.

## C. Ranking: paired correctness-AUROC difference (REV-26, DA M2): `review_r1_c_ranking.json`

Hybrid minus shipped confidence:

| Version | Population | Difference | 95% CI |
|---|---|---|---|
| v0.1 | all | +0.103 | [0.021, 0.187] |
| v0.1 | controls excluded | +0.099 | [0.008, 0.190] |
| v0.2 | all | +0.060 | [0.003, 0.117] |
| v0.2 | controls excluded | +0.058 | [−0.001, 0.118] |

The ranking advantage holds, except that **on v0.2 without controls the interval just includes zero**. The
paper must say so.

## D. Wrong × risky × confident (REV-42, R3 W2): `review_r1_d_risk.json`

Risk tiers come from the rule-based classifier applied to the **returned** command. It misses at least one
destructive command, so these counts are lower bounds.

| | Answered | Risky returned | Wrong and risky |
|---|---|---|---|
| Baseline, v0.1 | 146 | 20 | 2 |
| Baseline, v0.2 | 192 | 21 | 2 |
| Hybrid A3, v0.1 | 150 | 23 | 3 |
| Hybrid A3, v0.2 | 209 | 26 | 6 |

**Wrong-and-risky answers by query** (✓ = returned by that system):

| Query | Returned command | Risk | Baseline v0.1 / v0.2 | Hybrid v0.1 / v0.2 |
|---|---|---|---|---|
| "change the file permissions" | `icacls … /setowner` | HIGH | ✓ / ✓ (at 100% confidence) | ✓ / ✓ (at 1.0) |
| "open the config file" | `winget uninstall package-name --purge` | HIGH | ✓ / ✓ | ✓ / ✓ |
| "stop the docker service" | `docker stop $(docker ps -q)` | HIGH | — | ✓ / ✓ |
| "system" | `sudo shutdown -h now` | CRITICAL | — | — / ✓ |
| "teach me how to play guitar" (OOD) | `Start-Process powershell -Verb RunAs` | CRITICAL | — | — / ✓ |
| "help me meditate for stress relief" (OOD) | `kubectl delete pods …` | HIGH | — | — / ✓ |

The full pipeline (A5: margin rejection plus OOD detection) rejects 3 of the hybrid's 6 on v0.2: the two OOD
cases and the docker one. It does **not** catch "system" → shutdown, the config → uninstall `--purge`, or the
permissions → `setowner` answer.

**Context.** In the published CLI a returned command is pre-filled and runs when the user presses Enter, and
no risk is shown (T19). These cases are the paper's motivating failure mode, and they belong in the safety
paragraph and the Ethics section.

## What changes in the paper (feeds T21)

1. **OOD.** The improvement is a threshold choice. A tuned threshold on the baseline's own score matches or
   beats the hybrid detector. Rewrite the OOD claims throughout: abstract, results, discussion, conclusion.
2. **Calibration.** Report the noise floor, the no-skill Brier skill (negative raw, positive calibrated) and
   the CIs on the reductions. Say "near the noise floor in most cells", not "calibrated".
3. **Ranking.** Give the paired CIs, and qualify the v0.2 controls-excluded view.
4. **Safety.** Add the wrong × risky × confident table and the concrete cases, plus what the CLI does with
   a returned command.
5. **Selection effect.** Screening filtered nothing out. The added queries lie lower on raw scores, yet the
   detector's gain matches the original set. The effect does favour the raw-BM25 baseline on v0.2.

## Round 3 additions (T21b, 2026-09-29)

Both additions are deterministic: a full rerun of `run_review_r1.js` reproduces every JSON byte for byte,
apart from `generated_at`. The pre-existing fields of `review_r1_e` are unchanged.

**E, extended (`review_r1_e_ood_operating_points.json`).**

- **`rejections_by_source`** (REV-14). v0.2 OOD rejections, fixed rule / tuned shipped threshold / hybrid detector:

  | Items | Fixed rule | Tuned threshold | Detector |
  |---|---|---|---|
  | 15 original (keyword-checked, not score-screened) | 4 | 12 | 9 |
  | 35 added (score-screened) | 13 | 34 | 25 |

  The tuned threshold's lead over the detector therefore also appears on the unscreened items.
- **`rejections_by_kind`** (REV-22). Subtypes are AI-assigned and unchecked. Fixed / tuned / detector:

  | Kind | n | Fixed rule | Tuned threshold | Detector |
  |---|---|---|---|---|
  | non_terminal | 34 | 14 | 34 | 25 |
  | far_ood | 5 | 3 | 4 | 4 |
  | nonsensical | 1 | 0 | 1 | 1 |
  | unsupported_tool_ood | 5 | 0 | 4 | 2 |
  | near_ood | 5 | 0 | 3 | 2 |

  The last two rows together are the 10 terminal tasks: 0 / 7 / 4. Guard: the fixed-rule and detector counts
  reproduce T2 (10 checks).
- **`controls_excluded`** (REV-02).
  - No rule rejects any of the 25 controls, so the false rejections are unchanged: 0 / 9 / 6 of 110 and
    0 / 20 / 11 of 134.
  - Pooled OOD AUROC, shipped vs hybrid feature: v0.1 0.939 vs 0.837, difference −0.102 [−0.222, −0.006];
    v0.2 0.956 vs 0.889, difference −0.067 [−0.127, −0.015].

**F, new (`review_r1_f_kappa_intervals.json`)** (NEW-7, REV-21).

- κ = 0.6316 on 14 rows, percentile bootstrap 95% [0.391, 1.000]; 9,993 of 10,000 resamples valid. This
  reproduces the round-1 manuscript's untraced "[0.39, 1.00]".
- The 8/8 OOD agreement has a Clopper–Pearson 95% interval of [0.631, 1].
