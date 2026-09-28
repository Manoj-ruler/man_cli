# Phase 1 Methodology Review (R1), pre-commitment stage

This file first records the paper-blind criteria commitment. It was written before the manuscript was opened. The full review is appended below it once the manuscript has been read.

## Pre-commitment (written before reading the manuscript)

No sprint contract JSON was supplied for this run, so there are no orchestrator-defined `acceptance_dimensions`. Following the spirit of the v3.6.2 Sprint Contract Protocol, I commit here, paper-blind, to my own methodology dimensions. They are derived only from Reviewer Configuration Card #2 and the Phase 0 header facts. D1 and D3 are treated as mandatory.

### Contract Paraphrase

D1 (Inferential validity). The paired tests, multiple-comparison control and interval estimates must justify the directional claims the paper makes. With very few discordant pairs, an exact test has almost no power, so any claim of "improvement" or "no difference" must be scoped to what the test can resolve. Correction families must be fixed before the results are seen, or any post-hoc choice must be disclosed. Intervals and tests must agree.

D2 (Calibration and selective-prediction measurement). Binned calibration error on small samples is biased and unstable, especially when many predictions tie at the maximum confidence. Relative reductions such as percentage ECE drops need uncertainty and sensitivity to binning. Selective-prediction curves (AURC/AUGRC) need a stated tie-handling rule. Calibrators must be compared on held-out data.

D3 (Benchmark and leakage validity). The benchmark design must not leak evaluation information into tuning. This covers nested CV correctness, how OOD items are selected, controls for canonical or template items, provenance of AI-authored labels, handling of known ground-truth defects, and independence between benchmark versions.

D4 (Reproducibility). Enough detail on data splits, seeds, hyperparameters, resampling counts and release artifacts for an independent re-run.

D5 (Claim-evidence alignment). The abstract, conclusions and headline numbers must not be stronger than the design supports, and effect sizes with intervals must accompany fragile p-values.

### Scoring Plan

### D1: Inferential validity
dimension_id: D1
what_to_look_for: exact paired test details (discordant counts b and c, exact p), CI for the paired difference, pre-specified correction family, and whether p and CI agree
what_triggers_block: a headline directional accuracy claim that rests on a non-significant or post-hoc-corrected test without being labelled exploratory
what_triggers_warn: correction families or thresholds chosen or reported after results are seen, or CI and test reported inconsistently, even when the text is hedged
what_triggers_fatal: reported test statistics or counts that are arithmetically inconsistent in a way that reverses a headline conclusion

### D2: Calibration and selective-prediction measurement
dimension_id: D2
what_to_look_for: ECE binning scheme, n per evaluation, tie handling, CIs on ECE and on its relative change, calibrator fitted on held-out folds, AURC/AUGRC tie rule
what_triggers_block: a headline calibration improvement stated without any uncertainty estimate or with the calibrator fit on evaluation data
what_triggers_warn: ECE on small n with no binning sensitivity analysis, or relative reductions quoted without intervals

### D3: Benchmark and leakage validity
dimension_id: D3
what_to_look_for: nested CV structure, separation of tuning and test, OOD construction rule, canonical-control items, label provenance and agreement, disclosed ground-truth defects, independence between benchmark versions
what_triggers_block: evaluation items or labels that inform model or threshold selection without nesting, or known label defects that could change headline results and are not quantified
what_triggers_warn: AI-authored labels without an adequate independent agreement check, or an OOD set whose selection could bias the result, disclosed but not quantified
what_triggers_fatal: demonstrated test-set leakage into tuning that invalidates the headline comparison

### D4: Reproducibility
dimension_id: D4
what_to_look_for: seeds, fold counts, bootstrap resamples, hyperparameter grids, code and data availability, environment
what_triggers_block: key procedure (splits, tuning, or metric definitions) not described well enough to re-run
what_triggers_warn: minor parameters (seeds, resample counts, library versions) missing

### D5: Claim-evidence alignment
dimension_id: D5
what_to_look_for: abstract and conclusion wording against the tests and intervals; effect sizes with intervals next to p-values
what_triggers_block: abstract or conclusion states a significant or general improvement the reported inference does not support
what_triggers_warn: wording mildly stronger than the evidence, or effect sizes reported without intervals

criteria_binding_unavailable

[CONTRACT-ACKNOWLEDGED]

---

# Peer Review Report (written after reading the manuscript)

## Manuscript Information
- **Title**: Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study
- **Manuscript ID**: not assigned (anonymised review build)
- **Review Date**: 2026-09-28
- **Review Round**: Round 1, Phase 1 (reviewer panel)
- **Source reviewed**: `manuscript_review.txt`, plain text extracted from the PDF. Tables are flattened and Figures 1 to 5 are not visible. Wherever a judgement depends on a figure, this report says so.
- **Target venue**: EACL 2027 Student Research Workshop, long paper (author-confirmed). `criteria_binding_unavailable`: no formal venue-criteria manifest exists, so this report makes no formal venue-alignment claim.

## Reviewer Information

### Reviewer Role
Peer Reviewer 1 (Methodology), internal role R1

### Reviewer Identity
Statistician who works on evaluating NLP and ML systems. Specialises in small-sample inference (exact and paired tests, multiple comparisons, bootstrap), calibration metrics and the bias in estimating them, and selective-prediction metrics.

### Review Focus
Three questions:
1. Is the inference valid, given exact McNemar tests on 7 to 8 discordant pairs, Holm families fixed after the results were seen, and interval estimates that may not agree with the tests?
2. Are the calibration and selective-prediction measurements sound, given 10-bin ECE on 110 to 209 items with heavy ties at maximum confidence?
3. Is the benchmark valid, considering leakage, how OOD items were selected, AI-authored labels, and the dependence between v0.1 and v0.2?

## Overall Assessment

### Recommendation
- [x] **Major Revision**. Substantial revisions are needed and the paper should be re-reviewed afterwards.

### Confidence Score
4. The inferential and calibration questions are in my core expertise. Retrieval-architecture details are adjacent to it, and the figures were not visible to me.

Confidence is an uncertainty/scope disclosure only; it never changes consensus counts, severity, decision bearing, or arbitration.

### Calibration Status
`NOT_CALIBRATED`

Seat reports always emit `NOT_CALIBRATED`, because the final panel topology is not known until every seat has finished.

### Summary Assessment
**What the paper does.** It evaluates a no-LLM hybrid (BM25 plus MiniLM) command retriever against a shipped BM25 baseline on a 150-query benchmark and a 209-query superset. The evaluation uses cross-validated tuning, post-hoc calibration, OOD rejection, and tie-aware selective-prediction metrics. The paper reports three things:
- large ECE reductions from recalibration,
- better error ranking by the hybrid's confidence (AURC and AUGRC intervals exclude zero),
- a significant OOD-rejection gain on v0.2, alongside an accuracy gain the authors correctly call fragile.

**Overall quality.** Statistical reporting is unusually candid for a student paper. I recomputed every count, percentage, exact McNemar p-value, Holm adjustment, Wilson interval, the κ value, and the relative ECE reductions I could derive from the text. I found no arithmetic mismatch (see the Arithmetic Check Log and the Arithmetic Receipts). The exploratory status is declared prominently and repeatedly.

**What remains weak.** Three methodological problems are substantive:
1. **OOD selection.** The v0.2 OOD items were screened with the same retrieval scores the OOD detector thresholds, and the size of this selection effect is not quantified. Yet the paper's only Holm-significant detection result rests on those items.
2. **Calibration measurement.** The headline 67 to 81% ECE reductions come from 10 equal-width bins on 110 to 134 items with 64 to 73% of confidences tied at the maximum. The paper gives no debiased estimator, no binning sensitivity analysis, and no noise-floor reference, so the relative magnitudes are not yet interpretable.
3. **Missing specification.** The fusion formula, the hybrid confidence definition and the threshold-selection objective are not specified, and the code is withheld. The core system therefore cannot be re-implemented from the paper.

Smaller issues: the bootstrap intervals and exact tests disagree for v0.2 without comment, and several statements are worded slightly more strongly than the evidence.

**Recommendation rationale.** None of these problems is fatal. The calibration and ranking claims will probably survive. But items 1 and 2 bear directly on two of the three headline reliability claims, so I recommend Major Revision.

## Criterion-Bound Judgements

Calibration status: `NOT_CALIBRATED`. The criterion sources are my pre-committed dimensions D1 to D5 (derived from Reviewer Configuration Card #2) and the template rubric rows within my remit. These judgements are not totalled, weighted or mapped to the recommendation.

| Dimension / criterion | Criterion source | Judgement | Evidence anchors | Rationale | Uncertainty or scope limit | Decision bearing? |
|---|---|---|---|---|---|---|
| D1 Inferential validity | Pre-commitment D1; Card #2 focus 1 | PARTLY_MEETS | table: Table 2; text: §5 "This family was written down after the raw v0.1 and v0.2 test results had been computed" | All p-values and Holm adjustments recompute exactly, and the post-hoc family is disclosed. However, the CI and test disagree for v0.2 BM25→hybrid, and a bound-valued bootstrap p is used inside Holm | none identified | yes. It qualifies every "significant" statement, though the paper already hedges |
| D2 Calibration and selective-prediction measurement | Pre-commitment D2; Card #2 focus 2 | PARTLY_MEETS | text: §5 "ECE uses 10 equal-width bins"; text: §6 AURC CIs | Tie-aware AURC/AUGRC with paired CIs is good practice. ECE lacks a bias analysis, binning sensitivity and intervals on the relative reductions | Reliability diagrams (Figure 2) not visible to me | yes. Calibration is the lead claim |
| D3 Benchmark and leakage validity | Pre-commitment D3; Card #2 focus 3 | PARTLY_MEETS | text: §3 OOD screening; text: §5 Split B; text: §8 κ = 0.6316 | Tuning is kept apart from test data and Split B is a sound leakage check. The OOD selection effect is unquantified, and the label agreement check is small and only partly independent | Cannot see the benchmark or the candidate pool | yes, for the OOD claim |
| D4 Reproducibility | Pre-commitment D4 | DOES_NOT_MEET | absence: §4 fusion and confidence definitions | Splits, seeds and resample counts are given. The fusion rule, hybrid confidence, detector features and selection objective are not; artifacts are withheld | Code release is promised for camera-ready | yes. It blocks independent verification, but is repairable |
| D5 Claim-evidence alignment | Pre-commitment D5 | MEETS (with minor over-statements) | text: Abstract "consistent in size but statistically fragile" | The headline hedging is well aligned. A few local statements go beyond the evidence (see W7, W13) | none identified | no, the fixes are local |
| Methodological Rigor | Template rubric | PARTLY_MEETS | see D1 to D4 | As above | as above | yes |
| Evidence Sufficiency | Template rubric | PARTLY_MEETS | table: Table 1; text: §6 discordant pairs | The accuracy evidence is thin, which the authors admit. The OOD evidence depends on screened items. Calibration evidence depends on a biased estimator | as above | yes |
| Argument Coherence | Template rubric | MEETS | text: §9 Discussion | The Discussion follows the evidence and ranks the results by robustness | none identified | no |
| Originality, Writing Quality, Literature Integration, Significance & Impact | Template rubric | NOT_ASSESSED | — | Outside the methodology remit (other seats) | — | no |

### Statistical reporting completeness (Step 4a; standards §6)

| Item | State | Note |
|---|---|---|
| Descriptive statistics | COMPLETE | Counts are given with every percentage, and the denominators are explicit (Tables 1 and 3) |
| Effect sizes | PARTLY_COMPLETE | Accuracy deltas in points and AURC differences are reported. Correctness-AUROC differences have no interval. The relative ECE reductions have no interval (only absolute-reduction CIs, in Table 2) |
| Confidence intervals / uncertainty | PARTLY_COMPLETE | Present for accuracy deltas, AURC/AUGRC, OOD AUROC (v0.2), Wilson proportions and κ. Absent for the relative ECE reductions, the ECE values themselves, the correctness AUROC, and v0.1 OOD AUROC |
| Assumption checks | PARTLY_COMPLETE | Exact tests avoid large-sample assumptions. The percentile bootstrap on 7 to 8 discordant pairs is a small-sample regime the paper does not examine (W4) |
| Power / precision | MISSING | v0.2 was built "for adequately powered tests", but there is no power or minimum-detectable-effect analysis (W11) |
| Missing data | NOT_APPLICABLE | Deterministic system outputs. Ground-truth defects are accounted for in §3 |
| Format / tables | COMPLETE for a workshop paper | The Table 3 layout flattens badly in the text extraction; this may be an extraction artifact |
| Red-flag follow-up | Resolved or disclosed | Post-hoc family: disclosed. Many p near 0.05 (0.047, 0.057, 0.070): disclosed as fragile. Sensitivity subset rule: disclosed as post hoc. No unexplained attrition |

contract_role: methodology

## Dimension Scores

### D1: Inferential validity
score: warn
trigger: "correction families or thresholds chosen or reported after results are seen"

### D2: Calibration and selective-prediction measurement
score: warn
trigger: "ECE on small n with no binning sensitivity analysis"

### D3: Benchmark and leakage validity
score: warn
trigger: "an OOD set whose selection could bias the result, disclosed but not quantified"

### D4: Reproducibility
score: block
trigger: "key procedure (splits, tuning, or metric definitions) not described well enough to re-run"

### D5: Claim-evidence alignment
score: warn
trigger: "wording mildly stronger than the evidence"

On D4: the block is repairable with about one paragraph plus an appendix table (see W3). It is scored as block only because my pre-committed trigger names exactly this situation.

## Review Body

**Strengths**

### S1: Candid exploratory framing of all inference
The paper states when the Holm family was fixed (after the raw results), that calibration was chosen as the primary hypothesis knowing it was robust, and that the sensitivity rule is post hoc. It draws the correct conclusion: nothing here is confirmatory. This is exactly the disclosure that lets a reader discount the p-values appropriately.
**Evidence Anchor**: text: §5 "All significance statements here are therefore exploratory with respect to these data"

### S2: Internally consistent numbers throughout
Every count and percentage I checked is consistent (Table 1, Table 3, §3, §6, §7), as are the exact McNemar p-values implied by the reported discordant splits, both Holm-adjusted families, and all four Wilson intervals. The reported κ is also reproduced exactly (72/114) from the marginals implied in §8. See the Arithmetic Check Log below.
**Evidence Anchor**: table: Table 2 — raw and Holm-adjusted p for both families

### S3: Discordant-pair transparency and a single-query sensitivity check
The authors report the discordant counts (7–0 and 7–1), identify the one query that decides significance, and show the effect size is stable (+4.9 to +5.8 points) across reduced subsets. This is the right way to present a fragile paired comparison.
**Evidence Anchor**: text: §6 "The exact test rests on very few discordant queries: 7 on v0.1 (all favoring hybrid) and 8 on v0.2 (7 favoring hybrid)"

### S4: Tie-aware selective-prediction metrics with paired intervals
The paper recognises that 64 to 73% of confidences tie at the maximum. It uses the expected risk under random within-tie order, reports AURC and AUGRC with paired CIs, and separates ranking from accuracy using correctness AUROC. The reported 50%-coverage range (0 to 10.7%) is consistent with a 96-query tie block containing 8 errors, so the tie handling is internally coherent.
**Evidence Anchor**: text: §5 "We therefore use the expected risk under a random order within ties"

### S5: Leakage control and a grouped-split robustness check
Tuning uses only training folds. Every calibrator is fit on development folds. Split B (GroupKFold by intent, verified to place zero groups across folds) tests intent leakage and honestly reports that calibration attenuates under it (80→76% and 77→69%).
**Evidence Anchor**: text: §5 "both verified programmatically to place zero groups across more than one fold"

### S6: Positive controls, ground-truth defects and false-rejection cost quantified
The 25 verbatim canonical queries are treated as a positive control and excluded from headline figures. The unanswerable items are quantified (at most 0.7 and 1.3 points). The OOD gain is reported together with its false-rejection cost (11/159, Wilson [3.9, 12.0]).
**Evidence Anchor**: text: §3 "the two unanswerable items understate every system’s non-OOD accuracy by up to 0.7 points on v0.1 (1/135) and 1.3 points on v0.2 (2/159)"

**Weaknesses**

### W1: OOD items were screened with the detector's own features, and the selection effect is not quantified
**Problem**: The 35 new OOD queries were "confirmed as OOD partly with" top-1 BM25 score ≤ 7.39 and dense similarity ≤ 0.31. These are the features the OOD detector thresholds (§6 names absolute top-1 score as the OOD feature). The only Holm-significant detection result (17/50→34/50, adjusted p = 0.00006) is driven by these items: 25/35 vs 13/35 on the added items against 9/15 vs 4/15 on the original ones. The paper acknowledges the selection effect but never measures it.
**Evidence Anchor**: text: §3 "The new OOD queries were confirmed as OOD partly with the system’s own retrieval scores"
**Why it matters**: If any drafted OOD candidate was dropped or rewritten because its score was too high, the added set is truncated on exactly the detection feature. Detection rate and AUROC on it are then biased upward by construction. The conclusion's "OOD rejection improves significantly" rests on this set. The unscreened 15 original items give only p = 0.0625 (5–0 discordant, which I verified).
**Suggestion**:
- State how many OOD candidates were drafted, and how many were discarded or edited at the score-screening step, with their scores.
- Report the per-fold tuned OOD thresholds next to the 7.39 and 0.31 screening bounds.
- Report detection on (a) the 15 unscreened items and (b) any added items that would have passed without screening, separately.
- Scope the significance statement to the screened set. The fix proposed in Future Work (human-judged terminal-task OOD without score screening) is the right confirmatory design.
**Severity**: Major
**Confidence**: 4 — core expertise: selection effects in evaluation-set construction

### W2: ECE magnitudes and relative reductions are not interpretable without bias and binning analysis
**Problem**: ECE uses 10 equal-width bins on 110 to 134 items (controls excluded). Most mass is in one bin, since 64% and 73% of confidences tie at the maximum. Post-calibration ECEs are 0.054 to 0.108.
- The plug-in binned ECE is biased upward at small n. Equal-width binning is known to be more biased than equal-mass binning (Roelofs et al., 2022, AISTATS).
- Binned estimates can misstate the calibration error of calibrators that output few distinct values, such as isotonic and histogram binning (Kumar et al., 2019, NeurIPS).
- The paper itself notes that histogram binning is scored on the bins it fits.

Because of this, the "79%" and "67% and 81%" reductions mix real improvement with the estimator's bias floor. A reduction measured against a noisy post-calibration ECE is not stable to binning choices. No interval is given for the relative reductions, only for absolute ECE reductions with controls included (Table 2).
**Evidence Anchor**: text: §5 "ECE uses 10 equal-width bins (Pakdaman Naeini et al., 2015; Guo et al., 2017), reported with the Brier score"
**Why it matters**: Calibration is the lead result in the abstract and Discussion. The direction (large overconfidence removed) is not in doubt, since the Brier score falls too. But the headline magnitudes, and the claim that three calibrators "do about as well", depend on an estimator whose bias at this n is comparable to the post-calibration values.
**Suggestion**:
- Report ECE under equal-mass binning and at least one debiased or sweep estimator, for example the debiased estimator or ECE_SWEEP of Roelofs et al. (2022).
- Report the expected ECE of a perfectly calibrated predictor at the same n and confidence distribution (simulate labels from the calibrated confidences) as a noise floor.
- Give bootstrap intervals for the relative reductions.
- Lead with the Brier score and its paired interval, which does not depend on binning.
**Severity**: Major
**Confidence**: 5 — core expertise: calibration-error estimation

### W3: The core system cannot be re-implemented from the paper
**Problem**: §4 names five components but defines none of the following:
- how BM25 scores (unbounded) and cosine similarities are normalised and fused with α;
- what the α search grid is;
- how the hybrid's "fused-score confidence" is computed; this is the quantity being calibrated and used for AURC;
- how margin and entropy are computed over the top 10;
- what objective the OOD and ambiguity thresholds maximise (accuracy, F1, a coverage constraint?);
- how the detector features ("absolute top-1 score", "margin") were chosen, and whether that choice was made inside CV.

The code, data and results are withheld from the review version.
**Evidence Anchor**: absence: §4 and §5 — expected fusion formula, score normalisation, hybrid confidence definition, threshold-selection objective, search grids and feature-selection procedure; checked Abstract, §3, §4, §5, §6, §7, Limitations, Ethical Considerations, Appendix A captions
**Why it matters**: The reliability claims (calibration of the hybrid, AURC differences, OOD thresholds) are properties of these unstated definitions. A reviewer cannot check them for leakage, for example whether feature choice was made on the full data, and a reader cannot reproduce them.
**Suggestion**: Add a compact specification in §4 or an appendix: the fusion equation, normalisation, confidence mapping, tuning grids, selection objective, and how detector features were chosen. Consider providing an anonymised artifact link for review, since ACL-family venues allow anonymous repositories.
**Severity**: Major
**Confidence**: 4 — adjacent field: retrieval-system specification, core for reproducibility standards

### W4: Interval estimates and tests disagree for v0.2 and the paper does not reconcile them
**Problem**: For v0.2 hybrid vs BM25, the percentile bootstrap CI excludes zero while the exact McNemar test gives p = 0.070:
- excluding controls, [0.7, 9.0], §6;
- including controls, [0.6, 7.5], Table 2.

The Discussion then recommends that "effect sizes with intervals are more informative than p-values here" without noting that the two views give opposite verdicts on this comparison. My checks:
- Under the paired multinomial bootstrap with 7–1 discordant pairs, the probability of a resampled delta ≤ 0 is about 0.017, below 0.025. So the percentile interval excludes zero even though the conditional test does not reject.
- The exact conditional McNemar test is known to be conservative. The mid-p version gives p ≈ 0.039 (Fagerland, Lydersen and Laake, 2013, BMC Med. Res. Methodol. 13:91).
- Newcombe's paired score interval (method 10; Newcombe, 1998, Stat. Med. 17:2635–2650) gives about [0.3, 8.8] points by my computation.
- The Clopper–Pearson interval for the discordant share, 7/8 → [0.47, 1.00], includes 0.5 and matches the exact test.

A related detail: the percentile lower bounds sit on a Monte Carlo knife-edge. P(fewer than 3 discordant draws) ≈ 0.026 at both n = 110 and n = 135, which is why v0.1 shows 1.8 (2/110) in one view and 2.2 (3/135) in the other.
**Evidence Anchor**: table: Table 2 — v0.2 Acc., hybrid vs. BM25 raw p 0.0703 alongside caption bootstrap 95% CI [0.6, 7.5]pp
**Why it matters**: This does not overturn the paper's hedged verdict. It strengthens it: the fragility depends on the choice of method as well as on one query. But as written, the inferential framework contradicts itself on its most-discussed comparison.
**Suggestion**: Use one interval method that is dual to the chosen test (for example the exact conditional interval for the discordant share, or a Newcombe or Tango score interval with a matching test). Report the mid-p or unconditional test as a sensitivity check, and state explicitly that the verdict depends on the method.
**Severity**: Minor
**Confidence**: 5 — core expertise: paired binary inference

### W5: The headline calibration comparison is not the pre-named family comparison
**Problem**: The Holm family's calibration comparison is the hybrid's ECE reduction with controls included (80% and 77%). The abstract and Discussion lead instead with the shipped baseline's reduction with controls excluded (79% on both versions). That comparison, and the controls-excluded hybrid figures, are outside the corrected family. With p ≤ 0.0001 any correction would hold, so significance is not at risk. But the choice of which view to headline was made after seeing all views: baseline vs hybrid, controls in or out, three calibrators, Split A or B.
**Evidence Anchor**: text: §6 "this is the family’s pre-named calibration comparison and the only one that survives Holm correction on both benchmark versions"
**Why it matters**: Garden-of-forking-paths risk on the magnitude, not on significance.
**Suggestion**: Either headline the pre-named comparison, or state in the abstract that the baseline-confidence figure is a secondary, uncorrected view.
**Severity**: Minor
**Confidence**: 4 — core expertise: multiplicity

### W6: Holm uses a bound-valued bootstrap p and mixes one-sided and two-sided tests
**Problem**: The ECE p is "≤ 0.0001, the resolution of 10,000 resamples", but Holm treats it as exactly 0.0001, which gives adjusted values of 0.0004 and 0.0003. The ECE tests are one-sided bootstrap tests, while the McNemar p-values are two-sided (7–0 gives 2 × 0.5^7 = 0.0156). The family therefore combines different error conventions without saying so.
**Evidence Anchor**: table: Table 2 — rows "Calib. ECE reduction" raw 0.0001, Holm 0.0004 and 0.0003, with caption stating 0.0001 is the resolution limit
**Why it matters**: No decision changes. But the adjusted values should be reported as bounds (≤ 0.0004), and the sidedness should be declared.
**Suggestion**: Report the bootstrap p as (k+1)/(B+1) with ≤, carry the ≤ into Holm, and state the sidedness of each family member.
**Severity**: Minor
**Confidence**: 5 — core expertise: multiple testing

### W7: "All sampled OOD labels ... were confirmed" overstates an 8-item check by a reviewer who could not see the corpus
**Problem**: 8/8 agreement gives a two-sided 95% Clopper–Pearson lower bound of 0.63 for the OOD-label agreement rate, which leaves room for an error rate of up to about 37% among the 35 added OOD labels. Also, the reviewer saw "only the query text, not the command list". An OOD label for a terminal task depends on whether the corpus covers it, so the check can validate everyday non-computing OOD items but not terminal-task OOD items. The text does not say which kind the 8 sampled items were. The κ interval [0.39, 1.00] comes from a percentile bootstrap on n = 14, which is itself unreliable at that size.
**Evidence Anchor**: text: §8 "All sampled OOD labels, on which the OOD-rejection result rests, were confirmed"
**Why it matters**: It presents label support for the OOD claim as firmer than an n = 8, partly independent, corpus-blind check allows.
**Suggestion**: Report the exact interval for 8/8. Say how many of the 8 were terminal-task OOD. Soften "confirmed" to "agreed on all 8 sampled items". Defer firmer claims to the two-annotator study.
**Severity**: Minor
**Confidence**: 4 — core expertise: annotation agreement statistics

### W8: The OOD breakdown by kind omits 6 of the 50 OOD queries
**Problem**: The kinds reported are 34 everyday requests plus 10 terminal tasks, which is 44 of 50. The rejections by kind (25 + 4 = 29 of 34; baseline 14 + 0 = 14 of 17) imply that the other 6 queries account for 5 detector rejections and 3 baseline rejections. These are never described.
**Evidence Anchor**: text: §6 "the detector rejects 25 of 34 everyday non-computing requests (baseline 14; AUROC 0.94) but only 4 of the 10 terminal tasks"
**Why it matters**: The scope claim ("mostly from requests that are not computing tasks") needs the complete partition.
**Suggestion**: Add the third category and its counts, or explain the exclusion.
**Severity**: Minor
**Confidence**: 5 — direct arithmetic from reported counts

### W9: Results come from a single CV partition and bootstrap seed
**Problem**: All tuned results use one 5-fold partition (seed 42), and the bootstrap uses the same seed. With 7–0 or 7–1 discordant margins, and α and thresholds chosen per fold, a different partition could change the discordant sets, the calibrator maps, and the ECE values.
**Evidence Anchor**: text: §5 "nested 5-fold crossvalidation (seed 42, stratified by classification)"
**Why it matters**: The variance due to partitioning is not reflected in any interval, and the "79% on both versions" stability claim is partly a stability claim about one partition.
**Suggestion**: Repeat the CV over about 10 to 20 partition seeds and report the spread of the accuracy delta, the discordant counts, ECE before and after, and AURC.
**Severity**: Minor
**Confidence**: 4 — core expertise: resampling-based evaluation

### W10: "Nested" CV is described as single-level CV with tuning on the training folds
**Problem**: The description is that, for each test fold, parameters are chosen on the other four folds and applied once. This is a sound design, but it is not nested CV unless an inner CV loop is used within those four folds. The text does not say whether the four folds are pooled for selection or cross-validated internally.
**Evidence Anchor**: text: §5 "the parameter is chosen using only the other four folds, then applied once to the held-out fold"
**Why it matters**: Terminology and reproducibility. It also bears on how the isotonic calibrator's training scores are produced: are they in-sample on the dev folds, or out-of-fold?
**Suggestion**: Describe the inner procedure exactly, or drop "nested".
**Severity**: Minor
**Confidence**: 4 — core expertise: CV design

### W11: v0.2 was built for power, but no power or minimum-detectable-effect analysis is reported
**Problem**: v0.2 adds 59 queries because v0.1's subsets "were too small for adequately powered tests", but no power target, assumed effect or sample-size calculation is given. The additions bring no answerable queries, so the accuracy comparison stays at 7 to 8 discordant pairs, which is the power concern the Discussion raises afterwards.
**Evidence Anchor**: text: §3 "added because v0.1’s OOD (15) and ambiguous (14) subsets were too small for adequately powered tests"
**Why it matters**: The planned confirmatory benchmark (Future Work 2 and 3) needs a sample-size justification to avoid the same outcome.
**Suggestion**: Give a minimum-detectable-effect calculation for the existing design, and a prospective sample-size target (answerable queries, expected discordant rate) for the confirmatory version.
**Severity**: Minor
**Confidence**: 4 — core expertise: power for paired proportions

### W12: Several AUROCs have no interval or are fold means over very few positives
**Problem**: v0.1 OOD AUROC (0.867) and ambiguity AUROC are "means over folds". With 15 OOD queries in 5 folds, each fold has about 3 positives, so per-fold AUROCs are very coarse. The correctness-AUROC comparison, which the paper says "isolates ranking" (0.858 vs 0.755; 0.889 vs 0.830), has no paired interval. Split B changes in AUROC (−0.018, −0.003) are reported without any uncertainty.
**Evidence Anchor**: text: §6 "AUROC is 0.867 for OOD detection (feature: absolute top-1 score) and 0.784 for ambiguity detection (feature: margin), as means over folds"
**Why it matters**: The ranking claim relies partly on the correctness AUROC. Fold-mean AUROC on 3 positives per fold is not comparable with pooled v0.2 values.
**Suggestion**: Report pooled AUROCs with CIs throughout, and a paired bootstrap or DeLong interval for the correctness-AUROC difference.
**Severity**: Minor
**Confidence**: 4 — core expertise: ROC inference

### W13: Functional evaluation is said to "validate benchmark quality"
**Problem**: 15 hand-picked, host-safe gold commands exiting with code 0 cannot validate the benchmark, which has 150 to 209 queries whose main uncertainties are OOD and ambiguous labels. Limitations admits that success is exit code 0, not verified side effects.
**Evidence Anchor**: text: §7 "Gold commands: 100% functional success (validates benchmark quality)."
**Why it matters**: A local overclaim.
**Suggestion**: Rephrase, for example "is consistent with the executability of the 15 sampled gold commands".
**Severity**: Minor
**Confidence**: 5 — direct reading

### W14: The safety evaluation denominator is unexplained
**Problem**: v0.1 has 135 non-OOD queries (121 answerable), yet the safety accuracy uses 125 gold commands, and "19 of the 20 high- or critical-risk commands" uses the benchmark-wide count of 20 (15 HIGH + 5 CRITICAL). It is unclear which 125 commands were scored, and whether all 20 high- or critical-risk items are among them.
**Evidence Anchor**: text: §7 "89.6% exact four-level accuracy (112/125)"
**Why it matters**: The paper already makes no safety claim, so the impact is limited to clarity.
**Suggestion**: State the inclusion rule for the 125.
**Severity**: Minor
**Confidence**: 3 — cannot rule out an obvious rule stated in a figure I cannot see

### W15: Calibrators are compared by "overlapping bootstrap intervals"
**Problem**: Overlapping marginal intervals are not a test of no difference. The claim that the calibration gain "does not depend on isotonic regression" needs paired differences between calibrators. It is further confounded because histogram binning is scored on its own bins (see W2).
**Evidence Anchor**: text: §6 "reduce ECE by similar amounts, with overlapping bootstrap intervals"
**Why it matters**: A secondary claim in the Discussion.
**Suggestion**: Report paired bootstrap differences (isotonic minus Platt, isotonic minus histogram) using Brier or a debiased ECE.
**Severity**: Minor
**Confidence**: 5 — core expertise

### W16: The ECE bootstrap ignores calibrator-fitting variability
**Problem**: The ECE-reduction CI and p come from "resampling over pooled held-out predictions". The per-fold calibrators are not re-fit within resamples, so the uncertainty from fitting isotonic maps on about 88 to 107 dev items per fold is omitted. Split B shows this source of variation is not negligible (post-calibration ECE +0.011 and +0.027).
**Evidence Anchor**: text: §5 "resampling over pooled held-out predictions"
**Why it matters**: The intervals are too narrow for the claim "recalibration reduces ECE by X", as opposed to "these fitted maps reduce ECE by X".
**Suggestion**: Re-fit calibrators inside the bootstrap, or combine with the repeated-partition analysis in W9.
**Severity**: Minor
**Confidence**: 4 — core expertise

### Detailed Comments

**Research questions and hypotheses.** The RQ ("measurably improve accuracy and reliability") is answerable. The paper correctly splits it into accuracy (weak) and reliability (stronger). Calling calibration the "primary hypothesis" after the fact is disclosed.

**Research design.** The closed-vocabulary retrieval design with cross-validated tuning fits the question. Splits A and B are well conceived. Because the gold intent is always present, generalisation to unseen commands is untestable, and the paper says so.

**Sampling.** The benchmark is small and partly AI-authored. v0.2 adds no answerable queries, and the paper states this clearly. OOD items were screened by score (W1). The subtype labels used in the OOD breakdown were assigned by an AI assistant and not checked.

**Data collection and labels.** κ = 0.63 on 14 items with one partly independent, corpus-blind reviewer (W7). The ambiguity label is unsettled for short queries. Table 3 responds sensibly by dropping all ambiguous queries.

**Analysis.** Exact McNemar and Wilson are appropriate. The percentile bootstrap on sparse discordance is fragile (W4). ECE estimation needs attention (W2, W15, W16). Tie-aware AURC/AUGRC is good.

**Results presentation.** Complete, including null and negative results: the A1 null, the v0.1 OOD null, and hybrid vs dense on v0.1. The per-type figure (Figure 3) and the reliability diagrams (Figure 2) are not visible to me, so I cannot check the "most improvement on low-overlap-paraphrase" claim.

**Reproducibility.** Seeds, fold counts and resample counts are given. Core definitions are missing (W3). Artifacts are deferred to camera-ready.

**Methodological fallacies checked.**
- *P-hacking and forking paths:* a post-hoc family and a post-hoc sensitivity analysis, both disclosed (W5).
- *Selection bias:* OOD screening (W1).
- *Overfitting:* controlled by CV tuning, and Split B checks intent leakage.
- *Survivorship:* the rejected ambiguous candidates (6/30) are disclosed.
- *Confirmation bias:* mitigated by extensive reporting of nulls.
- *Ecological fallacy, Simpson's paradox, reverse causation, multicollinearity, endogeneity:* not applicable to this design.

**Whether conclusions go beyond the data.** Mostly no. The conclusion's hedging matches the evidence. The exceptions are the scope of the OOD significance claim (W1), the calibration magnitudes (W2), and the local over-statements (W7, W13).

### Arithmetic Check Log (checks outside the four bounded procedures)
Every item below is consistent with the reported values:
- **Table 1.** All 12 cells, and control-inclusive = exclusive + 25/25.
- **Table 3.** All 12 accuracy-delta cells: 7/135, 7/126, 6/159, 7/142, 7/133, 7/121 over BM25; 6/135, 6/126, 11/159, 8/142, 8/133, 5/121 over dense.
- **Exact McNemar p-values.** 7–0 → 0.015625; 7–1 → 0.0703; 14–3 → 0.0127; 11–3 → 0.0574; 17–0 → 1.5e−5; 5–0 → 0.0625; 4–0 → 0.125.
  - The reported p = 0.146 (v0.1 hybrid vs dense) implies a 9–3 split. The reported p = 0.227 (answerable hybrid vs dense) implies 8–3. The reported p = 0.25 (v0.1 OOD) implies 3–0, so the tuned detector alone rejects 7/15 on v0.1, a count the paper does not state.
- **Holm adjustments.** Both families reproduce: 0.0469, 0.292, 0.292, 0.0004 and 0.0703, 0.0255, 0.00006, 0.0003.
- **Wilson intervals.** 11/159 → [3.9, 12.0]; 1/20 → [0.9, 23.6]; 3/22 → [4.75, 33.3], reported as 4.8.
- **κ.** Implied marginals 8/6/0 vs 8/3/3 give p_o = 11/14 and p_e = 82/196, so κ = 72/114 = 0.6316.
- **Relative ECE reductions.** 78.6, 78.5, 67.2, 80.7, 80.3, 77.2%. The Split B figure of 69.0% vs 68.8% from rounded values is reachable within rounding.
- **Selective error.** 30.7% = 46/150 (31 non-OOD errors + 15 OOD).

## Questions for Authors
1. How many OOD candidates were drafted for v0.2, and how many were discarded or edited at the score-screening step (top-1 BM25 ≤ 7.39, dense ≤ 0.31)? What were the per-fold tuned OOD thresholds?
2. Exactly how are BM25 and dense scores normalised and fused, how is the hybrid's confidence defined, and what objective selects α and the detector thresholds? Were the detector features ("absolute top-1 score", "margin") chosen inside CV?
3. How stable are the accuracy delta, the discordant counts and the ECE reductions across different CV partition seeds?
4. Were the 8 sampled OOD items in §8 everyday requests or terminal tasks, and which 125 gold commands does the safety evaluation score?

## Minor Issues
- The abstract's "(bootstrap p ≤ 0.0001 each)" and Table 2's equality-valued 0.0001 should be written consistently as bounds.
- Say which v0.1 answerable results are "v0.1/v0.2" in Table 3. Are the α values and predictions identical across the two runs, given that the CV folds differ?
- The Table 3 layout does not survive text extraction. Check that the PDF table reads row-wise.
- "κ = 0.6316": two decimals are enough given the interval [0.39, 1.00].
- Figure 4 plots benchmark-order tie breaking while the text uses tie-aware values. Consider plotting the expected curve with a band.

## Arithmetic Receipts

### AR1
procedure_id: grim
evidence_anchor: text: §3 "Mean confidence on the 49 wrong (non-rejected) predictions: 86.06%"
reported_inputs: mean confidence 86.06; n 49; confidence defined as min(round(score/8 × 100), 100), integer 0 to 100
assumptions: integer scale 0 to 100 licensed by the stated round() definition; rounding rule unstated but no candidate sum lies on a rounding boundary
derivation: 49 × 86.055 = 4216.695 and 49 × 86.065 = 4217.185, so the only integer sum is 4217, and 4217/49 = 86.0612
derived_value_or_range: attainable mean 86.0612 rounds to 86.06
comparison_rule: reported value must lie in the rounding interval of an attainable integer-sum mean at 2 decimals
rounding_interval: [86.055, 86.065)
nearest_achievable: 4216/49 = 86.0408, 4217/49 = 86.0612, 4218/49 = 86.0816
status: consistent

### AR2
procedure_id: grim
evidence_anchor: text: §3 "with 44.9% of failures at exactly 100% confidence"
reported_inputs: proportion 44.9%; n 49 wrong predictions; binary indicator scale 0 to 1
assumptions: binary per-item indicator; precision one decimal of a percentage; rounding rule unstated, no boundary case
derivation: 49 × 0.4485 = 21.9765 and 49 × 0.4495 = 22.0255, so the integer count is 22, and 22/49 = 0.44898
derived_value_or_range: 44.898% rounds to 44.9%
comparison_rule: rounding-interval reachability at one decimal of a percentage
rounding_interval: [44.85, 44.95)
nearest_achievable: 21/49 = 42.857%, 22/49 = 44.898%, 23/49 = 46.939%
status: consistent

### AR3
procedure_id: grim
evidence_anchor: text: §3 "supported-task (non-OOD) accuracy 71.9%"
reported_inputs: accuracy 71.9%; n 135 non-OOD queries (150 minus 15 OOD); binary scale
assumptions: binary per-query correctness; n from §3 counts; rounding rule unstated, no boundary case
derivation: 135 × 0.7185 = 96.9975 and 135 × 0.7195 = 97.1325, so the count is 97, and 97/135 = 0.71852
derived_value_or_range: 71.852% rounds to 71.9%
comparison_rule: rounding-interval reachability at one decimal of a percentage
rounding_interval: [71.85, 71.95)
nearest_achievable: 96/135 = 71.111%, 97/135 = 71.852%, 98/135 = 72.593%
status: consistent

### AR4
procedure_id: grim
evidence_anchor: text: §3 "success on the 14 AMBIGUOUSlabeled queries 28.6%"
reported_inputs: success 28.6%; n 14; binary scale
assumptions: binary per-query success; rounding rule unstated, no boundary case
derivation: 14 × 0.2855 = 3.997 and 14 × 0.2865 = 4.011, so the count is 4, and 4/14 = 0.28571
derived_value_or_range: 28.571% rounds to 28.6%
comparison_rule: rounding-interval reachability at one decimal of a percentage
rounding_interval: [28.55, 28.65)
nearest_achievable: 3/14 = 21.429%, 4/14 = 28.571%, 5/14 = 35.714%
status: consistent

### AR5
procedure_id: grim
evidence_anchor: text: §7 "89.6% exact four-level accuracy (112/125)"
reported_inputs: accuracy 89.6%; count 112; n 125; binary scale
assumptions: binary per-command agreement; rounding rule unstated, no boundary case
derivation: 125 × 0.8955 = 111.9375 and 125 × 0.8965 = 112.0625, so the count is 112, matching the stated 112/125 = 0.896
derived_value_or_range: 89.6% exactly
comparison_rule: rounding-interval reachability at one decimal of a percentage
rounding_interval: [89.55, 89.65)
nearest_achievable: 111/125 = 88.8%, 112/125 = 89.6%, 113/125 = 90.4%
status: consistent

### AR6
procedure_id: grim
evidence_anchor: text: §7 "Retrieved (hybrid) commands: 93.3% functional success"
reported_inputs: success 93.3%; n 15; binary scale
assumptions: binary exit-code success per command; rounding rule unstated, no boundary case
derivation: 15 × 0.9325 = 13.9875 and 15 × 0.9335 = 14.0025, so the count is 14, and 14/15 = 0.93333
derived_value_or_range: 93.333% rounds to 93.3%
comparison_rule: rounding-interval reachability at one decimal of a percentage
rounding_interval: [93.25, 93.35)
nearest_achievable: 13/15 = 86.667%, 14/15 = 93.333%, 15/15 = 100%
status: consistent

### AR7
procedure_id: grim
evidence_anchor: text: §6 "the detector rejects 11 of 159 answerable v0.2 queries (6.9%"
reported_inputs: rate 6.9%; count 11; n 159; binary scale
assumptions: binary per-query rejection; rounding rule unstated, no boundary case
derivation: 159 × 0.0685 = 10.8915 and 159 × 0.0695 = 11.0505, so the count is 11, and 11/159 = 0.069182
derived_value_or_range: 6.918% rounds to 6.9%
comparison_rule: rounding-interval reachability at one decimal of a percentage
rounding_interval: [6.85, 6.95)
nearest_achievable: 10/159 = 6.289%, 11/159 = 6.918%, 12/159 = 7.547%
status: consistent

### AR8
procedure_id: grim
evidence_anchor: text: Abstract "A previously published BM25 baseline reaches 67.3% accuracy on a 150-query benchmark"
reported_inputs: accuracy 67.3%; n 150; count 101 stated in §3; binary scale
assumptions: binary per-query correctness; rounding rule unstated, no boundary case
derivation: 150 × 0.6725 = 100.875 and 150 × 0.6735 = 101.025, so the count is 101, and 101/150 = 0.67333
derived_value_or_range: 67.333% rounds to 67.3%
comparison_rule: rounding-interval reachability at one decimal of a percentage
rounding_interval: [67.25, 67.35)
nearest_achievable: 100/150 = 66.667%, 101/150 = 67.333%, 102/150 = 68.0%
status: consistent

### AR9
procedure_id: grim
evidence_anchor: text: §5 "Confidence often ties at its maximum (64% of the hybrid’s and 73% of the baseline’s values on v0.1)"
reported_inputs: 64% and 73%; analytic n not stated (150 all queries, 135 non-OOD, or 110 without controls)
assumptions: binary tie indicator; the paper does not state the denominator
derivation: not completed because the analytic n is ambiguous
derived_value_or_range: not derived
comparison_rule: rounding-interval reachability at integer percent
status: not_computable
not_computable_reason: analytic_n_ambiguous

### AR10
procedure_id: p_from_test_statistic
evidence_anchor: table: Table 2 — v0.1 Acc., hybrid vs. BM25 raw p 0.0156
reported_inputs: exact binomial McNemar test; discordant split 7 to 0 (§6); reported p 0.0156
assumptions: the test is an exact conditional binomial test, not a t, z, F or chi-square statistic
derivation: outside the bounded procedure because no test statistic of the covered families is reported; the exact-binomial check is recorded in the Review Body Arithmetic Check Log
derived_value_or_range: not derived under this procedure
comparison_rule: not applied
tail_convention: unstated
status: not_computable
not_computable_reason: nonstandard_p_procedure
