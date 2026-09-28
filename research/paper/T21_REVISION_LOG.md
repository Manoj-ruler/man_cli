# T21: revision round 2 (response to review round 1)

**Date:** 2026-09-28.
**Skill:** ARS `academic-paper` v3.3.1, revision mode, invoked through the Skill tool.
**Input:** `review_round1/phase2_editorial_decision.md`, whose decision was Major Revision: 3 blocking
issues, 17 required and 37 suggested items.
**Evidence:** `review_round1/author_verification.md`, `T19_IMPLEMENTATION_FACTS.md` and
`research/results/review_r1/REVIEW_R1_NOTES.md`. Every number in the revised text was read from
`research/results/phase1/*.json` or `research/results/review_r1/*.json` in this session.

## Process and honest boundary

- **Patch tooling.** The skill's patch protocol (anchorize, patch, deterministic apply) works on Markdown
  drafts and inserts HTML-comment markers, which LaTeX cannot carry.
- **Why this round is a rewrite.** Round 2 addresses REV-01 (reframe) and REV-02 (restructure). Both change
  the argument's structure, and the skill states that "structural rewrites are not patch-protected".
  `content.tex` was therefore rewritten section by section.
- **What guards the rewrite instead.** Each change traces to a roadmap item below, and every number traces to
  a result file. The tables, figures and captions kept from round 1 were checked against their sources.
- **Checks run:**
  - Both PDFs build: 0 overfull boxes, 0 undefined references, 0 BibTeX warnings.
  - The body ends on page 5 of 8.
  - The abstract is 172 words (the limit is 200).
  - `check_acronyms.py`: every flagged acronym was fixed; the rest are proper names.
  - 30/30 cite keys resolve to verified entries.

## Author adjudication

| Decision | Choice |
|---|---|
| D6 | Reframe around auditing and recalibrating the shipped tool's confidence; the hybrid is one arm (author, 2026-09-28). |
| D3 / REV-11 | Keep the TermAssist name (standing author decision). REV-11 is **declined** and **contested**, pending the author's confirmation. |
| Page budget | Secondary tables moved to the appendix: Holm, sensitivity, Split B. |
| Triage | Claude triaged the items; contested ones are returned to the author. |

## Required items (17)

| Item | Status | Where / how |
|---|---|---|
| R1 REV-01: reframe title, RQ, contributions, §10 | ADDRESSED | New title ("Confidently Wrong: Auditing and Recalibrating…"), RQ, 3 contributions and conclusion. The hybrid is credited only with ranking. |
| R2 REV-02: one population, claims table, caveats once | ADDRESSED | Non-control population throughout, with Table 1 as the claims-status table. Holm, sensitivity and Split B move to Appendix B. Caveats sit in Limitations. |
| R3 REV-03: scope the OOD headline | ADDRESSED | The abstract now reports fixed rule 17, tuned threshold 46, hybrid detector 34. §5 gives the screening facts and the caveat. |
| R4 REV-04: abstract ≤ 200 words | ADDRESSED | 172 words. |
| R5 REV-06: interaction model | ADDRESSED | §3 "The published tool": prints confidence, refuses below 30%, runs a pre-filled command on Enter, shows no risk, sync off by default (T19). |
| R6 REV-07: retrieval literature | ADDRESSED | §1 and §2: NLC2CMD retrieval entry with its confidence adjuster, ShellFusion, DocPrompting, CLAI. Gap restated. |
| R7 REV-09: "answerable" terminology | ADDRESSED | "Answerable" now means only the 121 shared queries; "in-scope" and "non-OOD" are used elsewhere. |
| R8 REV-11: anonymize the package name | **DECLINED, CONTESTED** | Author decision D3. The review version names no URL, scope or repository. |
| R9 REV-12: BashCoder-R1 description | ADDRESSED | "trained with reinforcement learning on static-analysis rewards". |
| R10 REV-14: quantify the OOD selection effect | ADDRESSED | All 35 drafts kept; the maxima are observed values, not cut-offs; the added queries score lower; the detector's gain is equal (+33.3 vs +34.3); the effect favours the shipped score (T18 A). |
| R11 REV-15: calibration interpretability | ADDRESSED | Noise floor, equal-mass and sweep ECE, out-of-fold Brier skill, CIs on the reductions (T18 B). |
| R12 REV-16: specification | ADDRESSED | §4 plus the Appendix A table, including the full-data feature-choice leak and α reuse (T19). |
| R13 REV-26: correctness-AUROC interval | ADDRESSED | Paired CIs in Table 1; weak on v0.2 without controls (T18 C). |
| R14 REV-32: NLC2CMD metric | ADDRESSED | §2: the metric is confidence-weighted and penalizes confident wrong answers. |
| R15 REV-40: scope calibration's user claims | ADDRESSED | "Changes the number shown"; the benchmark mix is a limitation; the user study is future work. |
| R16 REV-42: correctness × risk × confidence | ADDRESSED | Table 3 and concrete cases (T18 D). |
| R17 REV-49: OOD at matched operating points | ADDRESSED | Tuned shipped threshold 46/50 vs detector 34/50 (p=0.004); raw BM25 is the better OOD ranker (T18 E). |

## Suggested items (37)

| Status | Items |
|---|---|
| **Addressed** (wording only) | S1 (recalibration expected; what the audit adds), S2 (no generative baseline; comparison conceptual), S4 partly (Wang et al. 2026 dropped; "consistent in size"), S7 (baseline figure labelled outside the pre-named family), S8 (bootstrap p as a bound, sidedness), S9 (κ: "agreed on all 8", 7 of them everyday requests, none a terminal task), S10 (full OOD partition, 25+4+1+4 = 34), S12 (no inner split; α reuse disclosed), S14 ("validates benchmark quality" removed), S15 (the 125-item inclusion rule), S18 partly, S21 (OOD defined as out-of-scope; "closed-set"), S23 (why no public benchmark), S26 (future study: behaviour, not preference), S27 (safeguards: risk display, confirmation, `-WhatIf`), S29 (Windows in the abstract), S30 (current users: study does not change the package), S31 (positive case for no LLM), S32, S33 (two p-values for the same 15 queries), S34 (50% coverage lies inside the tie block), S37 partly |
| **Reviewer disagreement** | S24: the NL2SH author list follows the published PDF (6 authors). The Anthology metadata omits one author; recorded in T6. |
| **Contested: new analysis or action, author approval needed** | S5 (anonymized artifact link), S6 (mid-p / unconditional test sensitivity), S11 (repeat CV over 10–20 partition seeds), S13 (minimum-detectable-effect calculation), S16 (paired differences between calibrators), S17 (re-fit calibrators inside the bootstrap), S19 (tool/API retrieval and fusion literature: needs new verified references), S20 (stronger encoder or RRF sensitivity row), S22 (query-performance-prediction framing: needs new references), S25 (cost-of-harm operating points, A5 degradation), S28 (recall@3/5), S35 (AURC on answerable only), S36 (split the 49 confident errors by label) |
| **Declined** | S3 (move a figure into the body): the figures show the hybrid with controls included, while the reframed paper leads with the shipped confidence and excludes controls. There is now space if the author wants a regenerated figure. |

## Own errors corrected (found during review verification)

| Error | Correction |
|---|---|
| Round-1 "smaller gain" contrast between the original and added OOD sets | False in rates; now reported as +33.3 vs +34.3. |
| "Absolute top-1 score" as the OOD feature | It is the fused, per-query-normalized score. |
| "Screened with the scores the detector thresholds" | Replaced with accurate screening facts. |
| Six OOD queries missing from the breakdown | Added. |

## Numbers checked for this revision beyond the result files

- **κ sample composition** (`datasets/independent_review/ANSWER_KEY…`, `ood_subtypes_v0.2_ai_assigned.json`):
  7 non-terminal, 1 far_ood, 0 terminal-task OOD.
- **Noise-floor ratios:** 0.323/0.064 = 5.0 and 0.293/0.050 = 5.9, written as "five to six times".

## Next

T22: ARS re-review of this draft against the round-1 roadmap. Then T15 (claim trace table), T17 and T23.
