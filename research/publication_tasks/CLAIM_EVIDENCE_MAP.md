# Claim-to-evidence map (VERIFY-02)

**Built:** 2026-09-30, at commit `c3b9f40`, read-only. It covers every claim sentence in the
**Abstract** (`content.tex` lines 10–24), the **Contributions** paragraph (lines 50–57) and the
**Conclusion** (lines 360–370).

**Sources:**

- **Freeze:** `research/ANALYSIS_FREEZE_v1.0.md`. "§n" below refers to its sections, not the
  paper's.
- **Trace:** `research/paper/CLAIMS_TRACE.md` and `research/experiments/trace_claims.js`.

**Labels:**

- **Supported:** the evidence backs the wording as written.
- **Supported with caveat:** it backs it, but only with a qualification the sentence does not carry.
- **Fragile:** the direction holds, but its significance depends on the test used or the fold
  partition.
- **Unsupported:** the evidence does not back the wording.

**Two kinds of statement are marked separately:**

- **No numeric evidence:** a design fact, a disclosure or a literature statement.
- **New observation:** a value computed from committed files during VERIFY-02 that does not appear
  in the freeze report.

All intervals are 95%. "Non-control" means excluding the 25 verbatim-copy controls.

## Abstract

| # | Claim (abridged) | Evidence | Traced? | Label and justification |
|---|---|---|---|---|
| A1 | NL shell assistants are usually built by generation | Literature: NL2Bash, NLC2CMD, NL2SH, BashCoder-R1, all verified in `paper/STAGE4_5_INTEGRITY_REPORT.md` | no numbers | **Supported.** A literature statement with verified citations. |
| A2 | The audited tool is a BM25 retriever over a fixed Windows list that shows a confidence and runs the command on Enter | Freeze §1 (the reproduction is exact, 0/150 mismatches); `research/tests/` (TEST-02 to 04) | §3 tool entries | **Supported.** A design fact confirmed by the tests. |
| A3 | "Its confidence is no better than a constant forecaster" | Freeze §2: raw Brier skill **−0.227 [−0.453, 0.012]** (v0.1) and **−0.058 [−0.258, 0.145]** (v0.2) | §5 recalibration | **Supported.** Both intervals include 0, so "no better than" is exactly right. "Worse than" would be unsupported on v0.2. |
| A4 | "wrong answers average 86% confidence" | Trace: **86.06**, the mean over the 49 wrong answered **v0.1** queries (`results/baseline/reproduction-results.json`). **New observation:** on v0.2 the same statistic is **79.50** over 72 queries (`results/v0.2/reproduction-results.json`, statuses INCORRECT, AMBIGUOUS_INCORRECT and OOD_FALSE_ACCEPT). | yes (Abstract; §1 C1) | **Supported with caveat.** It holds for v0.1 only, but the sentence names no version. See ISSUE-02. |
| A5 | "the second adds 59 out-of-scope and ambiguous queries" | Freeze §1 (35 added OOD); paper §3 (24 ambiguous); trace: 209 − 150 | yes | **Supported.** |
| A6 | "excluding 25 verbatim-copy controls" | Freeze §1 | yes | **Supported.** |
| A7 | Isotonic recalibration "cuts … ECE by 79% and 78%" | Freeze §2: **79% [44, 84]** (0.323 → 0.069) and **78% [52, 87]** (0.293 → 0.063) | yes | **Supported with caveat.** Wide intervals. Platt scaling and histogram binning reach similar ECE, so the result is not isotonic-specific (freeze §2, calibrator comparison). Recalibration *lowers* shipped correctness AUROC from 0.742 to 0.686 (v0.1), which paper §5 states. |
| A8 | "to about a calibrated forecaster's noise floor" | Freeze §2: ECE after 0.069 vs a floor mean of 0.064 and p95 of 0.105 (v0.1); 0.063 vs 0.050 and 0.080 (v0.2). Freeze §9: within the floor's p95 in **18/20** (v0.1) and **13/20** (v0.2) partitions. | §5 recalibration; App. B folds | **Supported with caveat.** "About" is right for the seed-42 partition, but the result depends on the partition, especially on v0.2 (13/20). |
| A9 | "(outside our corrected test family)" | Freeze §5: the shipped-confidence recalibration is outside the Holm family | no numbers | **Supported.** A disclosure. |
| A10 | On v0.2: tuned threshold 46/50 and 20/134; fixed rule 17 and 0; detector 34 and 11 | Freeze §6. Re-checked against `review_r1_e_ood_operating_points.json` today. | yes | **Supported with caveat.** The numbers are exact. But 35 of the 50 OOD queries were screened for low scores, which favours the shipped score. There are five per-fold thresholds. The analysis is exploratory. |
| A11 | "Most out-of-scope requests are everyday, not computing, ones" | Freeze §6 by kind: non_terminal **34/50** | numbers in §5 kinds; the abstract gives none | **Supported with caveat.** The kind labels were **assigned by an AI assistant and are unchecked**. Body §5 says so; the abstract does not (ISSUE-03). |
| A12 | "the 35 added were screened for low scores" | Freeze §6 screening check: BM25 ≤ 7.39, cosine ≤ 0.31; all 35 accepted unchanged | yes (35) | **Supported.** A disclosure. |
| A13 | On the 15 original OOD queries, the three rules reject 4, 12 and 9 | Freeze §6 by source; `review_r1_e` `rejections_by_source.original_v0_1_items` | yes | **Supported with caveat.** n = 15 gives very wide intervals. |
| A14 | "The hybrid's confidence ranks its own errors better" | Freeze §3, hybrid minus shipped: AURC **−0.115 [−0.177, −0.054]** (v0.1) and **−0.075 [−0.126, −0.024]** (v0.2); AUGRC intervals exclude 0; correctness AUROC **+0.099 [0.008, 0.190]** (v0.1) and **+0.058 [−0.001, 0.118]** (v0.2). Freeze §9: the direction is the same in 20/20 partitions for all three measures. | §5 hybrid; App. B folds | **Supported with caveat.** The direction is consistent. AURC and AUGRC mix ranking with accuracy, and the pure-ranking measure's interval on v0.2 includes 0. |
| A15 | "its accuracy gain is fragile" | Freeze §4: +6.36 pp, exact McNemar p = 0.0156 (0–7 discordant, v0.1); +4.48 pp, p = 0.0703 (1–7, v0.2). Freeze §9: p < 0.05 in 19/20 (v0.1) vs **0/20** (v0.2) partitions. | Table 2; App. B | **Supported.** The claim is itself the hedge, and the evidence matches it. |
| A16 | "both systems sometimes return destructive commands for benign requests" | Freeze §8, wrong and high/critical: shipped 2 per version (`winget uninstall … --purge` for "open the config file"; `icacls … /setowner` for "change the file permissions", at confidence 100); hybrid 3 (v0.1) and 6 (v0.2), including `sudo shutdown -h now` for "system" | §5 risky | **Supported with caveat.** The counts are small. The tiers are rule-based lower bounds. "Destructive" fits the uninstall and shutdown cases; the ownership change is better called high-risk. "Benign" is a judgement about the request. |
| A17 | "All analyses are exploratory" | Freeze, conventions and §5 | no numbers | **Supported.** A disclosure. |
| A18 | "a two-annotator study is under way" | The runbook (the main sheets have been with the annotators since 2026-09-30) | no numbers | **Supported as a status.** It must change after the study (runbook step 10). |

## Contributions paragraph

| # | Claim (abridged) | Evidence | Traced? | Label and justification |
|---|---|---|---|---|
| C1 | "An audit of a published tool's confidence: no better than a constant forecaster, wrong answers average 86% confidence, and some wrong answers are destructive commands" | As A3, A4 and A16 | 86 yes (§1 C1) | **Supported with caveat.** It has the same version gap as A4 (the 86% is v0.1 only) and the same "destructive" nuance as A16. |
| C2a | "an attribution of what fixes what, under cross-validation on two benchmark versions with verbatim-copy controls excluded" | Freeze conventions and §1 | no numbers | **Supported.** A design description. |
| C2b | "standard recalibration fixes the confidence level" | Freeze §2: isotonic, Platt and histogram binning all cut ECE (v0.1: 0.323 → 0.069, 0.087, 0.101; v0.2: 0.293 → 0.063, 0.045, 0.039); isotonic Brier skill becomes positive (0.205 [0.040, 0.359] and 0.327 [0.185, 0.460]) | §5 recalibration | **Supported with caveat.** "Fixes" is strong: the noise-floor result depends on the partition (A8), and ranking worsens (A7). "Largely corrects" would match the evidence exactly. |
| C2c | "a tuned threshold on the shipped score handles out-of-scope requests at a cost in refused in-scope queries" | Freeze §6: v0.2 tuned threshold 46/50 at 20/134 false rejections; v0.1 10/15 at 9/110. Tuned vs detector on OOD: 14–2, p = 0.0042 (v0.2) and 3–0, p = 0.25 (v0.1). False rejections: 16–7, p = 0.0931 (v0.2). OOD AUROC shipped vs hybrid: 0.939 vs 0.837 (v0.1) and **0.956 vs 0.889** (v0.2), difference intervals exclude 0. | §5 OOD | **Supported with caveat.** The screening bias favours the shipped score (A10). The v0.1 comparison is not significant (n = 15). "Handles" describes 92% (v0.2) or 67% (v0.1) rejection. |
| C2d | "a hybrid retriever … mainly improves how confidence ranks the system's own errors" | As A14 and A15 | §5 hybrid | **Supported with caveat**, as A14. "Mainly" is apt given that the accuracy gain is fragile (A15). |
| C3 | "Evaluation practice for small closed-set benchmarks: tie-aware selective-prediction metrics, a noise floor and no-skill reference, OOD rules compared under the same tuning protocol and at equal false-rejection counts" | Freeze §2, §3 and §6. The methods are used as described. Tie-aware risk follows Traub et al.; the equal-false-rejection comparison is in-sample and descriptive (freeze §6). | no numbers | **Supported as a description; overstated as a contribution.** These are established methods applied carefully, not new methods. This is the target of PAPER-02. |

## Conclusion

| # | Claim (abridged) | Evidence | Traced? | Label and justification |
|---|---|---|---|---|
| K1 | The confidence "on our benchmark, is no better than a constant forecaster" | As A3 | not traced here | **Supported.** "On our benchmark" is a good qualifier. |
| K2 | "post-hoc recalibration fixes most of that" | As A7 and C2b; Brier skill becomes positive | not traced here | **Supported with caveat**, as C2b. "Most" is fair; the ranking cost is not mentioned. |
| K3 | Tuned threshold vs detector on v0.2: "46 vs. 34 of 50, and 12 vs. 9 on the 15 not screened … refuses more in-scope queries (20 vs. 11 of 134)" | Freeze §6, and re-checked against `review_r1_e_ood_operating_points.json` today: all 9 numbers match | **no:** the Conclusion is outside the trace's coverage (ISSUE-01) | **Supported with caveat.** The numbers are correct. The false-rejection difference is not significant (16–7, p = 0.0931), and there is the screening caveat. Being untraced is a process risk, not an error. |
| K4 | "most of these requests are everyday rather than terminal tasks" | As A11 (34/50; AI-assigned, unchecked kinds) | not traced here | **Supported with caveat**, as A11. |
| K5 | "The hybrid … mainly improves how confidence ranks its own errors" | As A14 | not traced here | **Supported with caveat**, as A14. |
| K6 | The next steps (the annotation study, a confirmatory analysis, terminal-task OOD, a safety set, user study) | — | — | **No numeric evidence.** These are plans, not claims. A pre-planned analysis (E1) would partly answer "confirm the findings with an analysis specified in advance". |

## Summary

- **Totals:** 30 rows: 18 in the Abstract, 6 in the Contributions paragraph and 6 in the Conclusion.
  - **Supported:** 12 (A1–A3, A5, A6, A9, A12, A15, A17, A18, C2a, K1).
  - **Supported with caveat:** 16 (A4, A7, A8, A10, A11, A13, A14, A16, C1, C2b, C2c, C2d, K2–K5).
  - **Fragile:** 0 as worded, because the only fragile result (the accuracy gain) is already stated
    as fragile (A15).
  - **Unsupported:** 0.
  - **Plans:** 1 (K6).
  - **Overstated as a contribution:** 1 (C3).
- **No numeric claim was found to be wrong.** Every value checked matches the freeze report or the
  committed result files. The three random re-checks (A10, A14 and A7) all matched.
- **The recurring caveats**, in order of how much they matter for a reviewer:
  1. OOD screening bias (A10, C2c, K3);
  2. partition-dependence of the noise-floor result (A8, C2b);
  3. version gaps (A4, C1);
  4. AI-assigned, unchecked kind labels (A11, K4);
  5. the ranking cost of recalibration (A7, C2b, K2).

## Issues raised

Details are in `PROGRESS.md`:

- **ISSUE-01:** the Conclusion's numbers are outside the claim trace.
- **ISSUE-02:** the 86% has no version.
- **ISSUE-03:** the abstract does not say the kind labels are AI-assigned and unchecked.
