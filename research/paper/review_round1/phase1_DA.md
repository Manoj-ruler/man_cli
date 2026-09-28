# Phase 1 — Devil's Advocate (DA) Report

## Pre-Commitment (written before opening the manuscript)

No sprint contract JSON was supplied to this seat, so the two-phase contract protocol (Contract Paraphrase / Scoring Plan with Dn dimensions) cannot be instantiated. In its place, the challenge criteria below were committed paper-blind, from the agent definition only, before the manuscript was read.

criteria_binding_unavailable

Committed challenge criteria (all from the DA agent definition):
1. Core Thesis Challenge — is there a more parsimonious explanation than the authors'?
2. Cherry-Picking — is supporting evidence selected; is contradicting evidence omitted?
3. Confirmation Bias — do framing or method choices favour the expected answer?
4. Logic Chain — does each inferential step hold; hidden assumptions; causal leaps?
5. Overgeneralization — does claim scope exceed the data (sample, domain, models)?
6. Alternative Paths — overlooked simpler or more mature alternatives?
7. Stakeholder Blind Spots — absent voices (named only, not elaborated).
8. "So What?" — is the increment sufficient for the stated venue?
9. Field-Norm Severity Calibration — any CRITICAL/MAJOR resting on a field norm must name an external boundary or be down-rated to MINOR with [FIELD-NORM UNVERIFIED].

Severity rule committed in advance: CRITICAL only for Foundation Collapse, Logic Chain Break, Data-Conclusion Mismatch, or Stronger Counter-Narrative that singly invalidates the core claim; otherwise MAJOR/MINOR by decision impact.

[CONTRACT-ACKNOWLEDGED]

---

## Devil's Advocate Review

Manuscript: "Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study" (plain-text extraction; figures not visible). Target: EACL 2027 Student Research Workshop, long paper. Venue binding: `criteria_binding_unavailable` — no venue-alignment claim is made in this report.

Scope note: no sprint contract was supplied, so this report uses the agent's standard output format (no Dn dimension scores). Figures 1–5 were not visible; no finding relies on them.

### Calibration Status
`NOT_CALIBRATED`

### Criterion-Bound Judgements
| Dimension / criterion | Criterion source | Judgement | Evidence anchors | Rationale | Uncertainty or scope limit | Decision bearing? |
|---|---|---|---|---|---|---|
| 1. Core Thesis Challenge | DA agent definition, Challenge Dimension 1 (pre-committed above) | PARTLY_MEETS | text: §10 "improves the reliability of a shipped BM25 command-retrieval baseline" | The narrow thesis survives, but each reliability leg has a more parsimonious explanation (see M1, M3, and Ignored Alternatives) | Figures not visible | yes — shapes how much the thesis actually shows |
| 2. Cherry-Picking | DA Dimension 2 | MEETS | text: §1 "Disclosure of the null, weak, and fragile results we found" | Null, fragile and contrary results are reported prominently, including the null substring bonus and safety misses | Literature coverage is R2's job and was not assessed | no |
| 3. Confirmation Bias | DA Dimension 3 | PARTLY_MEETS | text: §5 "calibration was named the primary hypothesis knowing it was the robust result" | Disclosed. One interpretation still leans toward an explanation held in advance (m2) | none identified | no |
| 4. Logic Chain | DA Dimension 4 | PARTLY_MEETS | text: §6 "AURC and AUGRC mix ranking with accuracy" | The ranking claim and the OOD claim each have an unclosed inferential step (M2, M3) | none identified | yes |
| 5. Overgeneralization | DA Dimension 5 | PARTLY_MEETS | text: §9 "It improves the confidence users see" | The calibration claim extends to users, but the benchmark is a constructed mix (M4). The functional evaluation over-reads 15 items (m8) | none identified | yes (M4) |
| 6. Alternative Paths | DA Dimension 6 | PARTLY_MEETS | absence: §5–§7 and Table 2 — expected a BM25 rejection-threshold sweep or an unclipped-BM25 confidence comparator; checked §3, §5, §6, §7, Tables 1–4 | A dense-only ablation exists, but the cheapest competing explanations for the reliability gains are not tested | none identified | yes |
| 7. Stakeholder Blind Spots | DA Dimension 7 | PARTLY_MEETS | text: Limitations "No human-preference study" | End users are discussed only through the confidence number. No real query logs | Elaboration is left to R3 | no |
| 8. "So What?" | DA Dimension 8 | PARTLY_MEETS | text: §2 "this combination, not any single component, is new" | The increment is a domain transfer of standard selective-prediction, calibration and OOS tools to a 279-intent closed set | Venue bar not bound | no |
| 9. Field-Norm Severity Calibration | DA Dimension 9 (self-gate on this report) | NOT_ASSESSED | — | This is a gate on my own findings, not a paper criterion. No CRITICAL or MAJOR here rests on a field norm. Two MINORs are labelled [FIELD-NORM UNVERIFIED] | none identified | no |

### Genuine strengths (brief)
The manuscript is unusually candid. It says outright that its significance analyses were specified after the results were known, that the accuracy gain is fragile, that the benchmarks nest, that the added OOD queries were screened with the detector's own features, and that the re-annotation fell below target. I re-derived its reported exact-test arithmetic: 7–0 discordant gives p = 0.0156, 7–1 gives 0.0703, and 17–0 gives about 1.5e-5. The Holm multipliers reproduce Table 2, and Table 4's relative ECE reductions reproduce the text. I found no internal numerical contradiction in Tables 1, 2 and 4.

### Strongest Counter-Argument
The paper's three "reliability" results come from standard post-processing measured against a deliberately crude comparator. They show that the shipped display formula was naive. They do not show that the architecture makes the system more reliable.

First, calibration, which the paper calls its "most consistent result". The shipped confidence is `min(round(score/8 × 100), 100)`, and 73% of its values sit at 100. Any fitted monotone map will remove most of the ECE of such a score. So would a constant set to the development accuracy, which has near-zero ECE and no information at all. The paper itself says calibration changes neither decisions nor ranking (correctness AUROC falls from 0.858 to 0.804). The post-calibration Brier scores (0.198 and 0.169) fall inside the range a no-skill base-rate forecaster would get at the reported accuracies (about 0.17–0.23).

Second, the OOD "doubling". The baseline already rejects on an absolute-score threshold ("rejected below score < 2.0"), and the new detector thresholds "absolute top-1 score". An exact test on OOD-only rejection counts favours any stricter threshold. The reported p ≈ 1.5e-5 is the signature of 17–0 discordance, which is what raising a threshold produces. The paper reports no matched-false-rejection comparison, no baseline AUROC and no sweep of the baseline threshold. The 35 added OOD items were also screened with the same scores.

Third, ranking. The metrics that carry intervals (AURC, AUGRC) are confounded with an accuracy gain the paper calls fragile. The metric that isolates ranking (AUROC) has no interval. The hybrid's own confidence ties at its maximum for 64% of queries.

What survives is useful. It is a transparent audit of a small closed-intent retriever, a task that is structurally 279-way intent classification with out-of-scope detection. The paper also models honest disclosure well. Its thesis, however, should be reframed as a careful negative-leaning case study, not as evidence that the architecture improves reliability.

### Issue List

No finding meets the CRITICAL evidence burden. The calibration, ranking and OOD claims are each scoped narrowly enough in the text that none is invalidated by a single defect. The findings below weaken what the claims mean; they do not refute them. Under the singleton-Critical test, none reaches rejection-level impact on its own.

#### CRITICAL
| # | Dimension | Issue Description | Evidence Anchor | Confidence | Field-Norm Boundary | Evidence-Crossing Rationale |
|---|-----------|-------------------|-----------------|------------|---------------------|-----------------------------|

#### MAJOR
| # | Dimension | Issue Description | Evidence Anchor | Confidence | Field-Norm Boundary | Evidence-Crossing Rationale |
|---|-----------|-------------------|-----------------|------------|---------------------|-----------------------------|
| M1 | 1 Core Thesis / 8 So What | The headline calibration result has no no-skill reference. ECE is minimised by an uninformative forecaster: a constant equal to the base rate has ECE equal to its gap to test accuracy. So "79% ECE reduction" on a score that is 73% tied at 100 mostly measures replacing an arbitrary display scale. The paper does not report a base-rate or constant-forecaster ECE and Brier, or a Brier decomposition into reliability and resolution. The reported post-calibration Brier values (0.198, 0.169) lie inside p(1−p) for the accuracy range in Table 1 (p ≈ 0.65–0.79 gives about 0.23–0.17). On the manuscript's evidence, the calibrated shipped confidence may therefore carry about as little information as a constant. This fits §6's own note that pooled AUROC falls after calibration. The minimum remedy is to report a constant/base-rate forecaster's ECE and Brier (or a Brier decomposition) next to each calibrator, and to reword "removes most of the overconfidence" accordingly. | text: §6 "isotonic calibration lowers its ECE from 0.323 to 0.069 on v0.1 and from 0.293 to 0.063 on v0.2 (79% each; Brier 0.305→0.198 and 0.266→0.169)" | 4 — arithmetic from reported values. The exact ECE population (whether OOD and rejected items are included) is not stated, so the base-rate range is approximate | n/a — rests on a property of the ECE/Brier metrics, not a field norm | n/a |
| M2 | 4 Logic Chain | The claim "the hybrid's confidence ranks its own errors better" rests on AURC and AUGRC, which the paper says mix ranking with accuracy, and on an accuracy difference the paper calls fragile. The one metric the paper says isolates ranking, correctness AUROC, is reported as point estimates only, with no interval or paired test. It also swings (v0.1 gap 0.103, v0.2 gap 0.059). The decision-level claim that §9 calls the second-clearest result therefore has no uncertainty-quantified support for its ranking interpretation. The minimum remedy is a paired bootstrap interval (or DeLong-style test) on the correctness-AUROC difference, or else rewording the claim as "lower AURC". | text: §6 "correctness AUROC, which isolates ranking, is 0.858 vs. 0.755 on v0.1 and 0.889 vs. 0.830 on v0.2" | 4 — direct reading of §6 and §9 | n/a — internal consistency: the paper supplies intervals for the confounded metrics but not for the isolating one | n/a |
| M3 | 4 Logic Chain / 6 Alternative Paths | The OOD result compares two operating points on OOD-only counts. Both the baseline ("rejected below score < 2.0") and the tuned detector ("feature: absolute top-1 score") threshold an absolute retrieval score. McNemar on OOD rejections alone favours any stricter threshold. The reported p of about 1.5e-5 equals 2×0.5^17, which is consistent with 17–0 discordance, the pattern a stricter threshold produces. Missing: the baseline's false-rejection count on non-OOD queries, the baseline score's OOD AUROC, a sweep of the baseline threshold, and a comparison at matched false-rejection rate. Without these, "OOD rejection improves significantly" (§10) cannot be told apart from "a higher threshold was chosen". The selection of added OOD items by the same scores (disclosed in §3) compounds this. The minimum remedy is to report baseline-score OOD AUROC and rejection at matched false-rejection, or to reword the result as an operating-point change. | text: §6 "the tuned OOD detector raises the rejection rate on OOD queries from the baseline’s 34.0% to 68.0%" | 4 — exact-test arithmetic reproduced. It is not stated whether the detector's "top-1 score" is the BM25 or the fused score | n/a — logic of the test design, not a field norm | n/a |
| M4 | 5 Overgeneralization | Calibration is relative to a distribution, yet the claims extend to users ("the confidence users see"; Conclusion: "improves the reliability of a shipped ... baseline"). The isotonic maps are fit and scored on a constructed benchmark with fixed query-type quotas, not on a sample of real usage, and the paper's own grouped split already shows the gain shrinking under a modest shift (77.2% → 69.0% on v0.2). No evidence ties the benchmark's mix of types (for example, 25 verbatim canonicals, single-keyword and adversarial low-overlap paraphrases) to deployment traffic. A calibrator that is calibrated on this mix is not shown to be calibrated for users. The minimum remedy is to scope the calibration claims to the benchmark distribution, or to evaluate on a usage-derived query sample. | text: §9 "It improves the confidence users see, not the answers or their ranking." | 3 — inference about transfer. The paper's grouped-split attenuation is direct evidence of sensitivity, but its magnitude under a real shift is unknown | n/a — distribution-relativity of calibration is a property of the metric | n/a |

#### MINOR
| # | Dimension | Issue Description | Evidence Anchor | Confidence |
|---|-----------|-------------------|-----------------|------------|
| m1 | 4 Logic Chain | The terminology is inconsistent. "Answerable" means the 121 queries in §3 and Limitations, but 159 non-OOD queries (121 answerable + 38 ambiguous) in the abstract and §6. The false-rejection denominator is therefore misdescribed. | text: Abstract "and it wrongly rejects 11 of 159 answerable queries" | 5 — arithmetic: 209 − 50 = 159 = 121 + 14 + 24 |
| m2 | 3 Confirmation Bias | The paper says the original 15 OOD queries show a "smaller gain … consistent with the selection effect". In rate terms the gains are almost identical: +33.3 points (4/15→9/15) and +34.3 points (13/35→25/35). Only the counts differ, because the subsets differ in size. The numbers do not support the selection-effect reading. If anything they argue against a large selection effect, which cuts in the paper's favour and should be stated. | text: §6 "The 15 original v0.1 OOD queries show a smaller gain (9/15 vs. 4/15, p = 0.0625) than the 35 added ones (25/35 vs. 13/35)" | 4 — arithmetic on reported counts |
| m3 | 4 Logic Chain | The same 15 original OOD queries get two different results: raw p = 0.25 in the v0.1 analysis and p = 0.0625 in the v0.2 breakdown. The likely cause, detectors tuned on different OOD sets, is not stated. If that is the cause, the v0.2 detector's gain on the unscreened 15 depends on thresholds tuned on the 35 score-screened items. | text: §6 "On v0.1 the same comparison was not significant even before correction (raw p = 0.25)." | 3 — the cause is inferred |
| m4 | 2 Cherry-Picking | The OOD breakdown by kind covers 34 + 10 = 44 of the 50 OOD queries (25 + 4 = 29 of 34 rejections). Six queries, five of them rejected, fall in an unreported category. | text: §6 "the detector rejects 25 of 34 everyday non-computing requests (baseline 14; AUROC 0.94) but only 4 of the 10 terminal tasks" | 4 — arithmetic |
| m5 | 4 Logic Chain | With 64% of the hybrid's confidences tied at the maximum, every coverage level below about 64% (including the reported 50% point) sits inside one tie block. The risk-coverage "ranking" is therefore largely a two-level split, max versus not-max, and the "8.3% at 50% coverage" is simply the error rate of the tied block. | text: §5 "Confidence often ties at its maximum (64% of the hybrid’s and 73% of the baseline’s values on v0.1)" | 4 — follows from the reported tie shares |
| m6 | 4 Logic Chain | The AURC and AUGRC differences are checked without the controls but not on the answerable-only subset, even though the ambiguous labels are called unsettled and enter the correctness target. v0.1's 150 labels have no reported agreement study at all. [FIELD-NORM UNVERIFIED] for the agreement-study part. | text: Limitations "v0.1’s own ambiguous labels have not been re-annotated at all." | 3 |
| m7 | 4 Logic Chain | The full pipeline's decision-level outcome worsens on v0.2: A5 goes from 90.1% at 69.5% coverage to 82.2% at 58.9%. This is left unanalysed, and no baseline at matched coverage is given. It is the outcome a user would experience. | text: §7 "we did not analyze why beyond noting that v0.2 adds only OOD and ambiguous queries" | 4 |
| m8 | 5 Overgeneralization | 15 hand-scoped, host-safe gold commands succeeding cannot "validate benchmark quality". Success is also defined by exit code 0 (Limitations), which cannot establish "zero cases of textually-correct-but-functionally-broken". | text: §7 "Gold commands: 100% functional success (validates benchmark quality)." | 4 |
| m9 | 3 Confirmation Bias | The benchmark was built with each query "checked against actual system retrieval output". Which system's output was used, and how it shaped inclusion, is unspecified. If it was BM25, the type quotas (low-overlap paraphrase, single-keyword) may over-represent BM25 failures. That would inflate the motivating 67.3% and 86.06% figures and favour the hybrid. | text: §3 "each query checked against actual system retrieval output" | 2 — the wording is ambiguous |
| m10 | 1 Core Thesis | The introduction motivates the work with destructive commands, but the reliability analysis never weights errors by the benchmark's own risk field, for example the risk levels of confidently-wrong answers under each system. | text: §1 "incorrect commands — especially destructive ones — carry real cost" | 3 |
| m11 | 6 Alternative Paths | The research question's comparative clause ("without the cost or hallucination risk of a generative system") is never measured. No generative or closed-vocabulary reranking comparator is run, and the hybrid is not timed end to end. A closed-list reranker is equally free of hallucination, so hallucination alone does not justify excluding it. | text: §1 "without the cost or hallucination risk of a generative system?" | 3 |
| m12 | 4 Logic Chain | All tuning uses a single CV seed, and the accuracy tests rest on 7–8 discordant queries. How much the discordant set varies across fold assignments is unreported. [FIELD-NORM UNVERIFIED] | text: §5 "selected via nested 5-fold crossvalidation (seed 42, stratified by classification)" | 2 |
| m13 | 1 Core Thesis | The motivating "confidently wrong" statistic pools OOD false acceptances with ambiguous-labelled items. For short ambiguous items, §8 shows the labels themselves are contested, so part of the headline overconfidence may be a labelling artefact. | text: §3 "Mean confidence on the 49 wrong (non-rejected) predictions: 86.06%" | 3 |

### Ignored Alternative Explanations/Paths
1. **Constant or base-rate forecaster (explains the calibration gain).** Replacing the clipped display formula with the development-set accuracy would remove most of the ECE while carrying no information. Until this is reported, the calibration result cannot be separated from "the original scale was arbitrary".
2. **Raising the BM25 rejection threshold (explains the OOD gain).** Moving the shipped 2.0 cutoff upward may reproduce the 17→34 OOD rejections at a comparable false-rejection cost, without the dense model or the detector.
3. **Unclipped BM25 score, or BM25 top-1 minus top-2 margin, as confidence (explains part of the ranking gain).** The shipped confidence discards everything above score 8. A BM25-only confidence built from the raw score or the margin would show whether the AURC gain needs dense fusion.
4. **Corpus-side curation for the accuracy gain.** The gains concentrate on low-overlap paraphrase. For a 279-intent curated library, adding paraphrase or synonym fields to intents, or expanding BM25 queries, is a cheaper, fully lexical alternative to dense fusion.
5. **Closed-vocabulary reranking.** A cross-encoder or small local model that selects among the top-k corpus candidates keeps outputs closed and hallucination-free. The paper excludes it by design but never shows it would lose on cost or offline constraints.
6. **The task as intent classification with out-of-scope detection** (the framing of Larson et al., cited in §2). Few-shot adaptation of the encoder to the 279 intents is a mature path that goes unexamined.

### Missing Stakeholder Perspectives
- End users of the shell assistant (especially novices on Windows), as the people who read or ignore the confidence number
- Real usage-query distributions (for example, logs from the published package's users)
- System administrators and security reviewers, on how destructive-command errors should be weighted
- Independent annotators outside the project (both v0.1 and v0.2 labels come from inside the project)
- Non-English-speaking users (the benchmark and corpus are English-only)

### Unexamined Premise
The paper assumes that a calibrated percentage shown next to a retrieved command is a meaningful reliability aid for users. Calibration changes no decisions, and users' use of the number is never measured (no human-preference study). The operative reliability mechanism is the answer/abstain decision, and on that axis the evidence is the weakest part of the paper (the OOD operating point, and A5 degrading on v0.2).

### Observations (Non-Defects)
- No instruction-like or reviewer-directed text was found in the manuscript. There is no injection concern.
- The false-rejection cost is partly beneficial and could be framed that way. Of the 11 non-OOD queries rejected on v0.2, only 3 were ones the hybrid answered correctly, so 8 rejections removed wrong answers.
- The headline population (controls excluded) differs from the significance population (controls included in Tables 2–4). This is disclosed in Limitations; a single consistent population would read more cleanly.
- The Wang et al. (2026) BM25-at-scale citation is tangential by the paper's own admission ("at a corpus scale far larger than ours") and could be cut without loss.
- The novelty claim is scoped to "this combination" and qualified by a limited literature search. This is appropriate hedging for an SRW paper; whether the increment is enough is the Journal-Fit seat's call.
- The v0.1 original-OOD arithmetic (m2) is evidence that the selection concern is smaller than the paper fears. Reporting it that way would strengthen the OOD section.
