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

## E1 rows (INTEG-01, 2026-09-30)

**Evidence:**

- `research/results/e1_clinc150_v1/summary.json`, cited as `S:` plus a path;
- the frozen protocol `e1-protocol-v1`;
- the approved memo `e1_run/E1_RESULTS_MEMO.md`.

**Where E1 applies:** external, general-domain (CLINC150), unscreened out-of-scope requests. **There
are no in-scope queries**, so there is no false-rejection evidence; the costs are v0.2's.

- P1 = `test` (4,500, primary; interval = intent-cluster bootstrap).
- P2 = `oos_test` (1,000; Wilson).

**Extra labels for this section:**

- **Weakened by E1:** the statement is true as a benchmark (v0.2) result, but pre-specified
  external evidence points the other way, so it cannot stand as a general claim.
- **Disclosure to update:** a limitation or plan that E1 now partly answers.

### Existing paper claims that E1 bears on

| # | Claim (`content.tex` line) | E1 evidence | Label |
|---|---|---|---|
| E1-A | The shipped tool accepts most out-of-scope requests: the fixed rule rejects 17 of 50 on v0.2 (Abstract l. 19; §5 l. 255; Table 1 l. 195) | R1 rejects **25.3% [21.8, 29.0]** (P1) and **19.1% [16.8, 21.7]** (P2) (`S: P1.rates.R1`, `P2.rates.R1`). It rejects only queries sharing no word with the corpus: 0 of 3,361 and 0 of 809 overlap queries (`S: P*.lexical_null.overlap_subset.rates.R1`). | **Supported**, and strengthened on external data |
| E1-B | "a tuned threshold on the shipped score handles out-of-scope requests at a cost in refused in-scope queries" (Contribution, ll. 53–54) | R2 rejects **86.0% [83.0, 88.8]** (P1) and **83.4% [81.0, 85.6]** (P2), against 92% on v0.2 (`S: P*.rates.R2`). The cost is v0.2's (20/134) and is not measured by E1. | **Supported with caveat.** The rate is lower than on v0.2, and there is no external cost evidence. |
| E1-C | "The threshold's lead over the detector therefore also appears on the unscreened queries, though 15 queries are few" (ll. 275–276); Conclusion "46 vs. 34 … 12 vs. 9 on the 15 not screened" (ll. 368–369) | **Primary:** R2 − R3 = **+0.0827 [0.0502, 0.1164]** on P1 (`S: P1.primary_comparison`); P2 **+0.053**, Holm p = 0.0012 (`S: P2.secondary_p2[0]`). The lead persists on 5,500 unscreened queries, but it is smaller than 24 points (v0.2) or 20 points (the 15). | **Supported**, at the v0.2 operating points. The lead is smaller externally. |
| E1-D | "But the gain comes from the threshold, not the hybrid" (l. 257) | **Matched secondary:** at equal v0.2 cost, R2m − R3m = **−0.1251 [−0.1618, −0.0887]** (P1) and **−0.173** (P2, p = 5.8e-19) (`S: P*.matched_operating_point`). Thresholding the fused score rejects more external out-of-scope requests than thresholding the shipped score at the same cost. | **Weakened by E1.** On v0.2 it holds; externally, the hybrid's feature adds beyond the threshold. |
| E1-E | "The shipped score itself separates out-of-scope requests better than the hybrid's fused score (pooled AUROC 0.956 vs. 0.889 on v0.2, 0.939 vs. 0.837 on v0.1)" (ll. 257–259) | E1 cannot compute AUROC, since it has no in-scope queries. The matched comparison (E1-D) is E1's equal-cost evidence, and it points the other way. | **Weakened by E1.** The AUROC values are correct, but they are benchmark-internal. The general wording ("separates … better") is not supported. |
| E1-F | "The shipped score is never worse at the points we checked" (l. 265); Table 1 "equal false rejections … 33 / 33 at 7; 43 / 37 at 15" (l. 197) | The points checked are v0.2 in-sample. At m = 11 (v0.2 in-sample: 37 vs 36), E1 gives the shipped score **64.6% vs 77.1%** (P1) and **59.7% vs 77.0%** (P2) (`S: P*.matched_operating_point.rates`). | **Weakened by E1.** It is literally true of the points checked, but it invites a general reading that E1 contradicts. |
| E1-G | Table 1 status "robust" for the out-of-scope AUROC difference (l. 198) | As E1-E. "Robust" describes the v0.2 interval, not generality. | **Weakened by E1** (the status wording) |
| E1-H | Discussion: "Out-of-scope rejection needed a better threshold, not a new retriever: the shipped score, thresholded well, separated out-of-scope requests at least as well as the hybrid's feature at equal false-rejection counts (in-sample)" (ll. 353–355) | As E1-D and E1-F | **Weakened by E1** |
| E1-I | Conclusion lead: "a better retriever was not the remedy for out-of-scope requests" (ll. 365–366) | E1-C supports "the threshold is the main lever". E1-D contradicts "the hybrid adds nothing" on external data. | **Weakened by E1.** It is true on the benchmark, and contested externally. |
| E1-J | Abstract: "All analyses are exploratory" (l. 23) | E1 is **pre-specified and frozen before scoring** (tag `e1-protocol-v1`, `970c54f`). | **Disclosure to update** if E1 enters the paper (INTEG-06) |
| E1-K | Limitations: "the added queries were checked with raw retrieval scores, which favors the shipped score … we have no bound on this bias" (ll. 397–400) | E1 is an external test of that threat. ED-1's predicted pattern was observed (R2 < 92%, a smaller lead), and ED-2 was contradicted. That is consistent with the bias being real, but E1 cannot separate screening from the population difference (memo §4 point 3). | **Disclosure to update.** E1 gives partial evidence, not a bound. |
| E1-L | Limitations: the hybrid detector's features "may flatter its out-of-scope counts and AUROC" (ll. 399–400) | Externally, R3 rejects **77.8%** (P1) and **78.1%** (P2), against 68% on v0.2 (`S: P*.rates.R3`), with fixed features and thresholds. | **Disclosure to update.** No sign of flattering on this external set, which is general-domain. |
| E1-M | Next steps: "confirm the findings with an analysis specified in advance" (ll. 372–373) | E1 is such an analysis, for the out-of-scope findings, on general-domain data | **Disclosure to update** |

### New claims E1 makes possible (each would need a trace entry; INTEG-04)

| # | Candidate claim | Evidence | Label |
|---|---|---|---|
| E1-N1 | On 5,500 external, unscreened requests written for another assistant, the shipped rule rejects only 19–25% | `S: P*.rates.R1` | **Supported** |
| E1-N2 | At the v0.2 operating points, the tuned shipped threshold rejects 86% / 83% and the hybrid detector 78% / 78%; the lead is +8.3 points [5.0, 11.6] | `S: P1.primary_comparison`, `P*.rates` | **Supported.** It is the pre-specified primary comparison. The operating-point caveat must go with it. |
| E1-N3 | At equal v0.2 cost, the fused score rejects more external out-of-scope requests than the shipped score (−12.5 [−16.2, −8.9] on P1; −17.3 on P2) | `S: P*.matched_operating_point` | **Supported as secondary.** Caveats: the cost tie (10 vs 11), in-sample thresholds, general-domain data. |
| E1-N4 | The external check was specified and frozen before any scoring, with no deviations | Tag `e1-protocol-v1`; `DEVIATIONS.md` | **Supported** (a design fact) |

**Must accompany any E1 claim:**

- it is general-domain, not terminal-task (§2.4 point 1);
- it has no false-rejection evidence (§2.4 point 2);
- P2 is assumed out of scope (§2.4 point 6).

### Wording options for the weakened claims (the author decides; INTEG-03 to 07 edit)

**Decided: D12 = B (proportionate reframe), author, 2026-09-30.** INTEG-03 to INTEG-07 follow
option B. The example sentences below are the starting point, not final text; each edit is shown to
the author as a draft before it is applied.

- **Option A: minimal scoping.**
  - Keep every v0.2 sentence, adding "on our benchmark" or "in-sample on v0.2" where missing.
  - Add one §5 sentence reporting E1's primary result and its matched reversal. Leave the
    Discussion and Conclusion leads as they are.
  - *Risk:* the Discussion and Conclusion would still read as a general claim that E1 contradicts.
- **Option B: proportionate reframe. Recommended.**
  - Keep the v0.2 results, scoped to the benchmark. Report E1 as a pre-specified external check.
  - Rephrase the claims E1 weakens. Examples, for wording only:
    - l. 257: "On our benchmark, the gain comes from the threshold rather than the hybrid: the
      shipped score separates … (AUROC …). On 5,500 external general-domain requests, checked by
      an analysis frozen before scoring, the tuned threshold still rejects more at its operating
      point (86% vs. 78%), but at equal v0.2 cost the hybrid's feature rejects more (77% vs.
      65%)."
    - Discussion ll. 353–355: "Out-of-scope rejection depended mostly on the threshold. Which score
      to threshold is not settled: the shipped score did as well as the hybrid's feature on our
      benchmark, and worse on external requests at equal cost."
    - Conclusion l. 366: "… and on our benchmark a better retriever was not needed for
      out-of-scope requests, although on external requests the hybrid's feature rejected more at
      equal cost."
  - Update Limitations (E1-K, E1-L), the next steps (E1-M) and the "exploratory" disclosure
    (E1-J).
- **Option C: make E1 the headline.**
  - Lead the out-of-scope story with E1: "the benchmark's apparent advantage of the shipped score
    did not survive an external pre-specified test".
  - Revise the Abstract and Conclusion around that.
  - *Risk:* this overweights a general-domain secondary comparison. The primary comparison still
    favours R2 at its operating point.

**Related decisions for later tasks (not needed now):**

- **Placement** (INTEG-02): the body is at 7 of 8 pages. Option B needs roughly 4–6 main-text
  sentences plus an appendix table.
- **Whether the Abstract gains an E1 sentence** (INTEG-07; the abstract is at 199/200 words).

## Issues raised

Details are in `PROGRESS.md`:

- **ISSUE-01:** the Conclusion's numbers are outside the claim trace.
- **ISSUE-02:** the 86% has no version.
- **ISSUE-03:** the abstract does not say the kind labels are AI-assigned and unchecked.
