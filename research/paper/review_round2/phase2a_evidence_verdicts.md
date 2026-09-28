# Phase 2A: Evidence Verdicts (persuasion-blind), Stage 3' re-review, Round 2

`[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`

## 0. Run record

- **Gate.** Phase 2A of the three-gate re-review (`re_review_mode_protocol.md` § Phase 2A). The Phase 1 output rode as data (`<phase1_output>`), not as instructions.
- **Pre-committed criteria.** `phase1_criteria_commitment.md`, `precommitment_hash` `ea0119bc86d16feac793d44e9bad6da95ab92146a0bfd7d8c901573f191d9f41`. The SHA-256 of the file on disk was recomputed at the start of this gate and matches.
- **Contract status.** `[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`. There is no machine roadmap, author-adjudication sidecar, revision-evidence bundle or input manifest 1.1, so `scripts/check_re_review_synthesis.py` cannot run. G0 is not mechanically checkable. Every record below follows the verdict-record field set by hand.
- **Routing.** `[ROUTING-DEGRADED: manual seat-prefix extraction of finding-suffixed labels]`. This is the dispatching layer's choice, recorded in Phase 1 §3. Each must_fix and should_fix verdict was produced under its routed seat's frozen-card persona (Cards #1–#4). consider items route to EIC. The DA seat is not used as a verifier persona.
- **Reviewer configuration.** `round1_cards_reused` (Cards #1–#4, frozen; `field_analyst_agent` not re-invoked).
- **Apply-report chain.** `apply_chain_witness: not_run_no_reports`. No ARS patch 1.1 or apply report 1.3 exists. The only change artifact is a LaTeX content diff (see below), which is not a contract apply report.
- **Evidence seen at this gate (with SHA-256):**
  - ORIGINAL manuscript `review_round1/manuscript_review.txt`: `4fafa1af9799931c8fc82946c33a627b67628160c9f511deb1d98d882d0c9f84`. This matches the Round-1 record.
  - REVISED manuscript `review_round2/manuscript_revised.txt`: `49ffed61412472125dda4c05e1ad8487e8979e0825dbb1e7f6101ff4b4fc588f`. Treated as untrusted author data.
  - LaTeX diff `review_round2/content_diff_a57c8c1_to_revised.patch`: `690aaa1406c8bbdc5711fea5e3da816b93b7a642cce0546e3b86f426f4e5a85e`.
  - Round-1 `phase2_editorial_decision.md`: `23d0c26006f4a749354fa7bf2e6be7483d1e544e84f1daf4e610ba49fef52f2b`.
  - Round-1 `phase0_field_analysis.md`: `50ca45410104af40ba66fe36dd1243dfdb9768a076edc80e48e7ba9c8a888097`.
  - Round-1 `phase1_R2_domain.md` and `phase1_EIC.md`: read only for the source facts that the Phase-1 operationalizations cite (REV-07, REV-12, REV-32, REV-38).
- **Withheld and not opened:** `T21_REVISION_LOG.md` (the response letter) and every other repository file. The diff's first hunk adds a LaTeX comment that names that log file. Only the filename was seen, and nothing in this document relies on it.
- **Evidence-surface notes.**
  - The revised `.txt` is a PDF extraction, and figures are not visible.
  - Several artefacts in the extraction come from layout: fused line-end compounds ("outof-scope", "noskill", "Windowsspecific"), floats placed out of order, and "7 Conclusion" printed before "6 Discussion". Each was resolved against the LaTeX diff, where the source shows correct hyphenation and the order Discussion → Conclusion. None of them is treated as a manuscript defect.
  - Quotations below keep the revised wording. Line-end hyphenation is normalised to the source.
- **Single-family disclosure (carried to the Re-Review Output).** "This verification round ran on the same model family that drove the revisions; over-optimization to this judge's latent biases is possible (Ren et al. 2026, arXiv:2607.13104 §8.1.2)." All Round-1 seats, the revision driver and this verifier are `claude-opus-5-5`.
- **Dissent records.** None. Every must_fix and should_fix verdict was assigned against its Phase-1 operationalization as written.
- **Escalation exceptions.** None emitted (see §5, NS-1).

## 1. Verdict summary

| Class | FULLY | PARTIALLY | NOT | MADE_WORSE | CANNOT_VERIFY | Total |
|---|---|---|---|---|---|---|
| must_fix | 5 | 10 | 1 | 1 | 0 | 17 |
| should_fix | 9 | 10 | 5 | 1 | 0 | 25 |
| consider (not_precommitted, decision-inert) | 2 | 3 | 7 | 0 | 0 | 12 |

- **must_fix breakdown:**
  - FULLY: REV-04, 07, 09, 26, 42.
  - PARTIALLY: REV-01, 02, 06, 12, 14, 15, 16, 32, 40, 49.
  - NOT_ADDRESSED: REV-11.
  - MADE_WORSE: REV-03.
- **must_fix PARTIALLY items with a `must_fix` residual:** REV-14 and REV-49.
- **should_fix addressed rate, informational only.** Computed on the 2A verdicts, (FULLY + PARTIALLY) / 25 = 19/25 = **76%**. The binding rate is computed on the final post-2B verdicts.
- **New issues: 7.**
  - regression: 6, all minor.
  - previously_missed: 1, major.
  - indeterminate: 0.
- **NS-1:** not substantiated. It lapses to advisory.

This gate does not derive a decision. Decision derivation runs after Phase 2B.

---

## 2. must_fix verdict records (17)

### REV-01 / R1 · verified_by EIC (Card #1)

```yaml
item_id: REV-01
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-01)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: Title "Confidently Wrong: Auditing and Recalibrating the Confidence of a Shipped Natural-Language-to-Shell Command Retriever"'
  - 'text: §1 "We therefore ask: how reliable is the confidence of a shipped closed-set command retriever, and what do post-hoc recalibration, a tuned rejection threshold, and a hybrid lexical–dense retriever each contribute?"'
  - 'text: §1 Contributions "(3) Evaluation practice for small closed-set benchmarks: tie-aware selective-prediction metrics, a noise floor and no-skill reference for calibration, detection compared at matched operating points, and disclosure of every null and fragile result."'
  - 'text: §7 "Post-hoc recalibration fixes most of that on both benchmark versions, a tuned threshold on the shipped score handles out-of-scope requests better than a hybrid detector, and the hybrid mainly improves how confidence ranks its own errors; its accuracy gain and its advantage over dense retrieval are fragile."'
change_summary: >-
  The title, RQ and conclusion opening are rebuilt around the audit of the shipped confidence, with
  recalibration, threshold and hybrid as separate arms. The five contributions become three, and no
  sentence now credits the hybrid with the shipped-baseline recalibration. Contribution (3), however,
  still lists "disclosure of every null and fragile result" as part of a co-equal contribution.
criterion_check:
  a_title: met
  b_RQ: met
  c_contribution_list: >-
    Mostly met. It leads with the audit (1), and the hybrid-specific findings are named separately
    inside (2). Not met on one clause: (3) still presents a reporting practice ("disclosure") as a
    co-equal contribution. "Holm-corrected significance" is gone.
  d_conclusion_opening: met (the §10 opening is now §7)
  e_no_hybrid_credit_for_baseline_recalibration: met
residual_gap: >-
  Remove "disclosure of every null and fragile result" from the contribution list, or recast (3) so
  that it contains only the evaluation-method contributions.
residual_obligation_class: consider
letter_requirement_extras_non_gating: >-
  Contributions reduced to three: met. Retitle: met. §10 split into "calibration alone" and "hybrid
  adds": met.
```

### REV-02 / R2 · verified_by EIC (Card #1)

```yaml
item_id: REV-02
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-02)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'table: Table 1 — caption "Claims with 95% bootstrap intervals, non-control queries unless stated (“controls incl.”) ... Out-of-scope rows use all queries of each version."'
  - 'table: Table 1 — row "Hybrid confidence: ECE reduction (Holm-adjusted p, controls incl.)", cells "−67% [43, 83] (p=.0004)" and "−81% [62, 86] (p=.0003)"'
  - 'table: Table 6 — row "all queries", ECE red. "80%" (v0.1) and "77%" (v0.2)'
  - 'table: Table 3 — row "Answered 146 150 192 209"; the caption states no population'
  - 'text: §1 "its accuracy gain is fragile"; §5 "Its accuracy gain is consistent in size but not established"; §6 "its accuracy gain is too small for this benchmark to establish"; §7 "its accuracy gain and its advantage over dense retrieval are fragile"'
change_summary: >-
  A single claims-status table (Table 1) is added. The Holm, sensitivity and Split B tables move to
  Appendix B, and the parallel CI set in the old Table 2 caption is gone. However, the main-text
  tables still use more than one population, and the accuracy-fragility caveat is still restated in
  four main-text sections.
criterion_check:
  a_single_stated_population: >-
    Not met. Table 1 mixes three populations across rows: non-control queries; "controls incl." for
    the Holm row; and all queries for the out-of-scope rows. Within one row it pairs a controls-excluded
    effect (−67%/−81%) with the Holm-adjusted p of the controls-included reduction. That controls-included
    reduction is 80%/77%, and it appears only in appendix Table 6, so the printed p does not test the
    printed effect. Table 2 is controls-excluded. Table 3 counts all queries (146/150 and 192/209
    answered, controls included) and states no population.
  b_one_claims_status_table: met (Table 1)
  c_secondary_views_out_of_main_text: met (Tables 5–7 are in Appendix B; §5 summarises each in prose)
  d_each_caveat_once: >-
    Not met for the accuracy-fragility caveat, which is stated in §1, §5, §6 and §7. The exploratory
    caveat appears once in the body (§4), plus the Abstract sentence, which is exempt.
residual_gap: >-
  (i) Put every main-text table on one stated population, or state each table's population and move
  mixed-population rows out. In particular, do not pair a controls-excluded effect with a
  controls-included p-value in one Table 1 cell. (ii) State Table 3's population. (iii) State the
  accuracy-fragility caveat once in the body, outside Table 1 and Limitations.
residual_obligation_class: should_fix
letter_requirement_extras_non_gating: >-
  Controls-excluded as the population: partly (Table 2 yes; Tables 1 and 3 no). Claims-table columns
  (claim, effect with CI, test, robust/fragile, location of the robustness check): the test column
  and the location column are absent; the status column is present.
```

### REV-03 / R3 · verified_by EIC (Card #1)

```yaml
item_id: REV-03
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-03)
verdict: MADE_WORSE
evidence_anchor:
  - 'text: Abstract "A tuned rejection threshold on the shipped score rejects 46 of 50 out-of-scope requests, where the fixed rule rejects 17 and a hybrid lexical–dense detector 34."'
  - 'text: §7 "a tuned threshold on the shipped score handles out-of-scope requests better than a hybrid detector"'
  - 'text: §5 "One caveat favors the shipped score: the added out-of-scope queries were checked to have low raw BM25 scores, and the tuned thresholds (6.5–7.2) sit just below their 7.39 maximum."'
original_anchor_for_comparison:
  - 'text: original Abstract "OOD rejection doubles on v0.2 (17/50→34/50; Holm-adjusted p = 0.00006), but mostly on requests that are not computing tasks: of 10 terminal tasks the corpus does not cover, the detector rejects 4, and it wrongly rejects 11 of 159 answerable queries."'
  - 'text: original §10 "OOD rejection improves significantly on the larger OOD subset, mainly for requests that are not computing tasks."'
change_summary: >-
  The Holm p is removed from the Abstract, but the Abstract and §7 still state an out-of-scope gain
  with no screening clause and no unscreened-subset result. Both loci also drop the qualifiers the
  original carried: the breakdown by kind of request and the false-rejection cost.
criterion_check:
  fully_addressed_pattern: >-
    Not met at either locus. Neither statement says the added items were checked against the system's
    own scores, and neither reports the unscreened (original-15) result.
  partially_addressed_pattern: >-
    Also matched (the "drop the Holm p" alternative only). It is superseded because the committed
    made_worse_discriminator is met.
  made_worse_discriminator: >-
    Met: "drops the existing qualifiers (the breakdown by kind of request, the false-rejection cost)".
    The Abstract loses "mostly on requests that are not computing tasks", "the detector rejects 4 [of
    10 terminal tasks]" and "wrongly rejects 11 of 159". §7 loses "mainly for requests that are not
    computing tasks". Aggravating: the new Abstract headline arm (a tuned threshold on the raw BM25
    score, 46/50) thresholds the very score on which the added items were checked. §5 itself calls
    this "One caveat [that] favors the shipped score". That arm's 20 false rejections (Table 1) are
    not in the Abstract.
residual_gap: n/a (MADE_WORSE)
driving_severity: major   # not critical; B1 cannot fire on this item
```

### REV-04 / R4 · verified_by EIC (Card #1)

```yaml
item_id: REV-04
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-04)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: Abstract, 172 whitespace-delimited tokens in the extraction (171 in the LaTeX source, where "lexical--dense" is one token), counted by the Round-1 F1 method'
  - 'text: Abstract "All analyses are exploratory; a two-annotator label study is under way."'
change_summary: >-
  The abstract is cut from 320 to 172 tokens, under the ≤200 default, and keeps a one-sentence
  exploratory statement.
letter_requirement_extras_non_gating: >-
  κ moved to the body: met (§3). The answerable-query count is removed from the Abstract: met. The
  pending-study sentence is kept in the Abstract, in shortened form.
```

### REV-06 / R5 · verified_by R3 (Card #4)

```yaml
item_id: REV-06
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-06)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: §3 "The command-line tool prints the top command with “confidence: N %”, refuses when N < 30, and otherwise opens an editable prompt pre-filled with the command, which runs (in PowerShell on Windows) when the user presses Enter; no risk level is shown."'
  - 'text: §7 "study whether calibrated confidence and risk prompts change what users run"'
  - 'text: Limitations "No generative system, user study, or public benchmark is evaluated."'
  - 'text: §6 "the number a user sees can become informative without changing the system"'
change_summary: >-
  A precise interaction-model paragraph is added (§3, with a pointer from §1). It covers the display
  (a percentage capped at 100), refusal below 30%, the pre-filled editable prompt that runs on Enter,
  and the absence of any risk display. On the user-benefit side, the manuscript only implies that the
  benefit is untested, through a future-work item and the no-user-study limitation.
criterion_check:
  a_display: met
  b_rejection: met ("refuses when N < 30")
  c_print_vs_run: met
  d_confirmation_step: met (the editable pre-filled prompt plus Enter is the only confirmation; no risk level is shown)
  benefit_or_untested_sentence: >-
    Only implied, which matches the partially_addressed pattern. No sentence states that the user
    benefit of calibrated confidence is untested. The §6 sentence describes a property of the number
    (informativeness), not a claimed user benefit.
residual_gap: >-
  Add one explicit sentence stating that any user benefit of the calibrated confidence (trust,
  reliance, fewer harmful runs) is untested here, or name the benefit claimed.
residual_obligation_class: consider
```

### REV-07 / R6 · verified_by R2 (Card #3)

```yaml
item_id: REV-07
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-07)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §1 "Retrieval over a fixed command list is an older alternative that NLC2CMD also tested (Agarwal et al., 2021) and ShellFusion developed (Zhang et al., 2022)."'
  - 'text: §2 "one entry used TF-IDF retrieval with a logistic-regression model that lowered confidence on likely-wrong predictions, and came within 12% of the best system. ShellFusion (Zhang et al., 2022) retrieves commands from question-answer posts and re-ranks them against manual pages; DocPrompting (Zhou et al., 2023) retrieves documentation, including tldr pages, before generating code; Project CLAI (Agarwal et al., 2020) treats the command line as an environment for AI agents."'
  - 'text: §2 "Within our targeted search (Limitations), natural-language-to-shell retrieval work has not evaluated the calibration of a deployed tool’s confidence, tie-aware selective prediction, or out-of-scope rejection with its false-rejection cost"'
  - 'text: References "Neng Zhang ... 2022. ShellFusion ..."; "Shuyan Zhou ... 2023. DocPrompting ..."; "Mayank Agarwal, Jorge J. Barroso ... 2020. Project CLAI ..."'
change_summary: >-
  §2 gains a natural-language-to-shell paragraph that cites and describes all four works. §1's
  "dominant trajectory … generative" becomes "mostly generated" and names retrieval as tested in
  NLC2CMD. The gap is restated against retrieval work.
source_fact_check: >-
  The descriptions do not contradict R2's reported source facts: the TF-IDF entry's logistic-regression
  confidence adjuster; "within 12% of the best system", which matches R2's reading of arXiv
  2103.02523v2; ShellFusion's retrieval from Q&A posts with man-page filtering; DocPrompting's tldr
  retrieval. One omission, not a contradiction: ShellFusion's lexical-plus-semantic (hybrid) nature,
  the point R2 flagged, is not stated. CLAI is described but not related to this paper.
note: The gap sentence is narrower than the original ("no prior evaluation ..."). It is not broadened, so the made_worse_discriminator is not met.
```

### REV-09 / R7 · verified_by EIC (Card #1)

```yaml
item_id: REV-09
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-09)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §3 "so the versions share their 121 answerable queries"'
  - 'text: §5 "at a cost of 11 false rejections among 159 in-scope queries"'
  - 'text: §5 "The published baseline answers 67.3% of v0.1’s 150 queries correctly"'
  - 'table: Table 2 — caption "Non-OOD accuracy (hits/queries, %), canonical controls excluded."'
change_summary: >-
  "Answerable" now denotes only the 121-query set (§3, Appendix B, Table 6). The 159 and 135 sets are
  "in-scope" or "non-OOD". The 67.3% is labelled with its population (all 150 v0.1 queries), and the
  Abstract's 79% is tied to the stated controls exclusion.
note: >-
  One use in §7 ("add answerable and terminal-task out-of-scope queries") is the query-type sense and
  does not denote 159 or 135. The Abstract's "86%" is scoped to "wrong answers" but does not name
  v0.1. This is accepted as naming the population of the statistic.
```

### REV-11 / R8 · verified_by EIC (Card #1)

```yaml
item_id: REV-11
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-11)
verdict: NOT_ADDRESSED
evidence_anchor:
  - 'text: §1 "We audit one such system as it is published: TermAssist, an npm package that maps a query to one of 279 Windows commands with BM25"'
  - 'absence: whole manuscript — a neutral statement of whether the authors developed the audited baseline; checked Title, Abstract, §1, §3, §4, §5, §6, §7, Limitations, Ethical Considerations, Appendix A–B'
change_summary: >-
  The §3 heading no longer names the package ("System and Benchmark"), and the ownership cues "our
  own baseline audit" and "the project's human director" are removed. But the package name now
  appears in the §1 body next to its registry ("TermAssist, an npm package"), and no statement of the
  authors' relationship to the baseline is added.
criterion_check:
  a_no_name_or_pointer: >-
    Not met. The name appears together with its registry, which is a searchable pointer. The de-named
    heading is a cosmetic edit at the expected location while the name moved into the body.
  b_neutral_relationship_sentence: not met (absent)
made_worse_discriminator_considered: >-
  Not applied. No URL, repository link or handle is added. The new behavioural details (the
  confidence string, the 30% refusal, the optional query-sync) are required by REV-06. The removal of
  ownership cues without any relationship statement makes the audit read as third-party. Whether that
  is more misleading cannot be established from the manuscript text alone, so the discriminator is not
  met on evidence.
residual_gap: n/a (NOT_ADDRESSED)
```

### REV-12 / R9 · verified_by EIC (Card #1)

```yaml
item_id: REV-12
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-12)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: §1 "most recently trained with reinforcement learning on static-analysis rewards (BashCoder-R1; Yu et al., 2026)"'
  - 'absence: §2 — any BashCoder-R1 description or 90%/73% figure; checked §2 in full'
  - 'text: References "BashCoder-R1: Towards robust and explainable Bash code generation with robustness-aware group relative policy optimization. In Proceedings of the ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA 2026)."'
change_summary: >-
  §1 now describes the reward as static-analysis based. §2's execution-feedback sentence, the 90%/73%
  figures and the "exact-match accuracy alone" framing are removed, so the FullRate gloss is moot. The
  reference title is unchanged ("Bash code generation"). Round-1 EIC W10 reported the ISSTA
  version-of-record title as "... Bash Script Generation".
criterion_check:
  s1_reward: met
  s2_reward_and_FullRate: met by removal (equivalence allowed)
  reference_title: >-
    Not met. The title is unchanged from the version that Round 1 flagged, and the manuscript carries
    no evidence-backed statement that the version of record differs. Such a statement is admissible
    only at Phase 2B.
residual_gap: Align the reference title with the ISSTA 2026 version of record, or show that the arXiv title is the version of record.
residual_obligation_class: consider
```

### REV-14 / R10 · verified_by R1 (Card #2)

```yaml
item_id: REV-14
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-14)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: §3 "all 35 out-of-scope drafts were kept unchanged, and their top-1 BM25 score and dense similarity were then checked to be low (maximum 7.39 and 0.31)"'
  - 'text: §5 "the tuned thresholds (6.5–7.2) sit just below their 7.39 maximum"'
  - 'text: §5 "The detector’s gain is nevertheless the same on the 15 keyword-verified v0.1 queries as on the 35 added ones (+33.3 vs. +34.3 points)."'
  - 'table: Table 4 — row "Out-of-scope detector" "(v0.1 0.833–0.895; v0.2 0.884–0.925)"'
  - 'absence: §5, Table 1, Appendix B — the tuned shipped threshold''s rejection on the 15 original vs. the 35 added out-of-scope items in the v0.2 run; checked §3, §5, §6, Tables 1, 4, 5, Appendix B'
change_summary: >-
  Screening counts are now given (35 drafted, none discarded or edited). The tuned shipped-score
  thresholds are set against the 7.39 bound, and the "smaller gain" sentence is restated in rates
  (+33.3 vs +34.3). However, the original-versus-added split is reported only for the hybrid detector,
  not for the tuned shipped threshold that became the Abstract headline arm.
criterion_check:
  a_screening_counts: met (35 drafted, 0 discarded, 0 edited)
  b_thresholds_vs_bounds: >-
    Met for the tuned shipped threshold (raw s: 6.50–7.20 vs 7.39). Not met for the hybrid detector:
    its thresholds (fused min-max score, 0.884–0.925) appear only in Appendix Table 4, with no stated
    relation to the 7.39/0.31 bounds. The dense bound 0.31 is related to no threshold.
  c_unscreened_detection_separate: >-
    Met for the hybrid detector (+33.3 vs +34.3 points; 9/15 vs 4/15 is recoverable). Not met for the
    tuned shipped threshold in the v0.2 run. Only a v0.1-run figure (10/15, thresholds 5.42–6.19) exists.
    The new label "keyword-verified" for the 15 v0.1 items is undefined. It could be read as saying that
    the comparison subset was itself verified against retrieval (keyword/BM25) output, which would
    undercut its role as the unscreened control.
  d_rates: met, and the sentence matches the reported numbers
residual_gap: >-
  For the tuned shipped-score threshold (the Abstract headline arm, which thresholds the screened
  feature): report its v0.2-run rejection on the 15 original vs. the 35 added items. Define
  "keyword-verified", or confirm that the 15 v0.1 items were not screened on retrieval scores. State
  how the hybrid detector's fused-score thresholds relate to the raw screening bounds.
residual_obligation_class: must_fix   # the Round-1 blocking issue R10, re-arising on the new headline arm
made_worse_discriminator_considered: >-
  Not met. The screening disclosure is kept in §3, §5 and Limitations. The "same gain" sentence is
  backed by numbers.
```

### REV-15 / R11 · verified_by R1 (Card #2)

```yaml
item_id: REV-15
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-15)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: §4 "we also report equal-mass and sweep estimates, a noise floor (the ECE of a perfectly calibrated forecaster with the same confidences and n, simulated), and Brier skill (Brier, 1950) against an out-of-fold no-skill forecaster that predicts the development base rate"'
  - 'text: §5 "is five to six times the noise floor of a perfectly calibrated forecaster at this size (0.064 and 0.050)"; "within the noise floor’s 95th percentile (0.105 and 0.080); equal-mass and sweep estimates agree"'
  - 'table: Table 1 — rows "Shipped confidence: ECE before → after isotonic" (".323→.069; −79% [44, 84]", ".293→.063; −79% [52, 87]") and "Shipped confidence: Brier skill vs. no-skill, raw / recalibrated" ("−.23 [−.45, .01] / .20 [.04, .36]", "−.06 [−.26, .15] / .33 [.19, .46]")'
  - 'text: §5 "The hybrid’s own confidence behaves the same way: raw, it is significantly worse than the no-skill forecaster; after recalibration its ECE falls 67% and 81%, with residual miscalibration above the noise floor on v0.1."'
  - 'absence: whole manuscript — equal-mass or sweep ECE values; hybrid no-skill and noise-floor values; checked §4, §5, Tables 1–7, figure captions'
change_summary: >-
  For the shipped confidence, the revision adds a simulated noise floor with its 95th percentile,
  Brier skill against an out-of-fold base-rate forecaster with intervals, bootstrap intervals on the
  relative reductions, and the population (non-control queries). The headline is reworded to "to about
  the noise floor". The equal-mass and sweep estimates are asserted ("agree") but never reported, and
  the hybrid's reference values are given only qualitatively.
criterion_check:
  a_equal_mass: not met (the §4 "we also report" is not honoured by any value)
  b_debiased_or_sweep: not met (same)
  c_noise_floor: met (shipped); only qualitative for the hybrid
  d_no_skill: met (shipped, Brier skill with CI); only qualitative for the hybrid ("significantly worse", with no value or interval)
  e_intervals_on_relative_reductions: met (all four)
  f_brier_with_paired_interval_in_headline: met (the Brier-skill row sits alongside ECE in Table 1; the Abstract's "no better than a constant forecaster")
  g_population: met ("non-control queries unless stated")
  h_placement: met for the shipped headline (Abstract, §5, Table 1); partial for the hybrid headline (Table 1 "robust" row), which has no reference values or pointer to them
  i_wording_matches: met ("to about the noise floor"; "residual miscalibration above the noise floor on v0.1")
residual_gap: >-
  Report the equal-mass and sweep ECE values (an appendix table suffices), and the hybrid's no-skill
  Brier skill and noise-floor values next to its 67%/81% headline.
residual_obligation_class: should_fix
```

### REV-16 / R12 · verified_by R1 (Card #2)

```yaml
item_id: REV-16
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-16)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'table: Table 4 — rows "Fusion" ("min-max normalized over all 279 candidates; score = α BM25norm + (1 − α) densenorm"), "α" ("Grid {0.0, 0.1, . . . , 1.0}; maximizes non-OOD accuracy on the four development folds; ties go to 0.5"), "Hybrid confidence" ("Fused top-1 score"), "Margin, entropy", "Out-of-scope detector" ("Reject if the fused top-1 score is below a per-fold threshold maximizing F1 on development folds"), "Tuned shipped threshold" ("Same protocol on the shipped top score s"), "Ambiguity detector, A4, A5" ("Flag if margin is below an F1-maximizing threshold")'
  - 'text: §4 "The features for the two detectors were chosen by inspecting class means on the full data, a disclosed leak."'
  - 'absence: §4, Table 4 — the candidate set or grid over which the F1-maximizing detector thresholds are searched, and their tie rule; checked §4, Appendix A Table 4, Appendix B'
change_summary: >-
  A specification table (Appendix A, Table 4) and §4 text now define normalisation, fusion, the α grid
  and its objective, the hybrid confidence, margin, entropy, both detectors with their objective, the
  score each detector thresholds, and the calibrators. Feature selection is disclosed as made on the
  full data, outside CV. The search grid for the detector thresholds is not given.
criterion_check:
  1_normalisation: met
  2_fusion: met
  3_alpha_grid: met (grid + objective + tie rule)
  4_hybrid_confidence: met
  5_margin_entropy: met
  6_threshold_objective_and_grid: objective met (F1); grid/candidate set not stated
  7_feature_choice_and_CV: met (disclosed: full data, outside CV)
  8_which_top1_score: met (the fused top-1 for the detector; s for the tuned shipped threshold)
made_worse_discriminator_considered: >-
  Not met. Seed 42, five folds and 10,000 resamples are kept. §4 and Table 4 agree on the detector
  score, and the per-fold α in Table 4 matches "α ∈ {0.3, 0.5}".
residual_gap: State the candidate set or grid, and the tie rule, for the F1-maximizing thresholds (both detectors and the tuned shipped threshold).
residual_obligation_class: should_fix
ns1_link: >-
  The disclosure shows the detector features were chosen outside CV. Per Phase 1, REV-16 is judged
  only on disclosure. The leakage itself is NEW-1 (§6), and NS-1 is resolved in §5.
```

### REV-26 / R13 · verified_by R1 (Card #2)

```yaml
item_id: REV-26
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-26)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'table: Table 1 — row "Hybrid minus shipped correctness AUROC" "+.099 [.008, .190]" (v0.1), "+.058 [−.001, .118]" (v0.2), status "weak on v0.2"'
  - 'table: Table 1 — row "Hybrid minus shipped AURC (tie-aware)" "−.115 [−.177, −.054]", "−.075 [−.126, −.024]"'
  - 'text: §6 "The hybrid’s value lies in ranking its own errors, which matters for abstention"'
change_summary: >-
  A paired interval for the hybrid-minus-shipped correctness-AUROC difference is added, and the v0.2
  interval is honestly flagged as including zero. The Discussion's ranking claim no longer names any
  metric without an interval.
criterion_check: >-
  Route B is met: the §6 Discussion (formerly §9) names no ranking metric without an interval. The
  core of Route A (the paired difference interval) is also present. Route A's pooled per-system
  AUROCs with CIs are not reported, but Route B suffices.
note: The §5 statement that AUGRC intervals exclude zero points to Table 1, which has no AUGRC row. This is recorded as NEW-3 because it is outside §9's claim.
```

### REV-32 / R14 · verified_by R2 (Card #3)

```yaml
item_id: REV-32
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-32)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: §2 "The NLC2CMD competition (Agarwal et al., 2021) scored each prediction by utility and flag overlap, weighted by the confidence the system submitted, so confident wrong answers were penalized"'
  - 'absence: §2 — a sentence contrasting ECE, AURC and AUGRC with a confidence-weighted task score; checked §2 both paragraphs, §4 Metrics'
change_summary: >-
  The NLC2CMD metric is now correctly described as confidence-weighted, consistent with R2's reading,
  and CLAI is cited. No sentence contrasts the paper's reliability metrics with that confidence-weighted
  task score.
criterion_check:
  description_confidence_weighted: met
  contrast_sentence: >-
    Not met. The §2 gap sentence names calibration, selective prediction and out-of-scope rejection,
    but it does not say how ECE, AURC or AUGRC differ from a confidence-weighted score.
  CLAI: met
residual_gap: Add one sentence contrasting ECE/AURC/AUGRC (the calibration level and the error ranking of confidence) with NLC2CMD's confidence-weighted task score.
residual_obligation_class: should_fix
```

### REV-40 / R15 · verified_by R3 (Card #4)

```yaml
item_id: REV-40
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-40)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: Limitations "Queries were written by the authors and an AI agent, not collected from users, so calibration and out-of-scope rates depend on this mix."'
  - 'text: §6 "The displayed confidence was the weakest part, and standard recalibration on held-out labels repairs most of it; the number a user sees can become informative without changing the system."'
  - 'text: §7 "A published natural-language command retriever shows its users a confidence that is no better than a constant forecaster."'
  - 'absence: whole manuscript — what data a deployed calibrator would be fitted on; checked §4, §5, §6, §7, Limitations, Ethical Considerations'
change_summary: >-
  "The number users see" and "It improves the confidence users see" are removed from Results and
  Discussion, and a Limitations bullet now states that the queries were not collected from users.
  §6 still generalises recalibration to "the number a user sees", and §7 states the audit finding as
  what the tool "shows its users". No sentence says what data a deployed calibrator would be fitted on.
criterion_check:
  a_reworded_no_user_benefit: >-
    Largely met. §6 keeps the user-facing phrase but describes a property of the number
    (informativeness), and no user-benefit finding is asserted.
  b_benchmark_distribution_named: >-
    Partly met. The Abstract ("on both versions") and §7 ("on both benchmark versions") name the
    benchmark. §6's recalibration sentence and §7's first sentence are unscoped.
  c_limitations_non_user_queries: met
  d_deployed_calibrator_data: not met
made_worse_discriminator_considered: >-
  Not met. The Split B attenuation is kept, in softer form: §5 "weakens calibration somewhat";
  Appendix B "the ECE reduction attenuates (Table 7)"; Table 7 ECE .324→.074 vs .324→.101. No
  "helps users" claim is added.
residual_gap: >-
  State what labelled data a deployed calibrator would be fitted on. Scope §6's recalibration sentence
  and §7's opening to this benchmark's query mix.
residual_obligation_class: should_fix
```

### REV-42 / R16 · verified_by R3 (Card #4)

```yaml
item_id: REV-42
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-42)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'table: Table 3 — rows "Answered 146 150 192 209", "High/critical returned 20 23 21 26", "of which wrong 2 3 2 6", "at max. conf. 1 1 1 1"; caption "Returned commands the rule-based classifier rates high or critical risk, how many are wrong answers, and how many of those are shown at the system’s maximum confidence band (shipped: 100%; hybrid: fused score 1.0)."'
  - 'text: §5 "Classifying each returned command with a deterministic rule-based risk classifier, both systems return a few wrong answers whose command is high or critical risk"'
change_summary: >-
  Route A. A new main-text table crosses correctness × returned-command risk × confidence band, for
  both systems and both versions. It states the risk source (the classifier on returned commands) and
  the band edges. §5 names the concrete risky wrong answers, and "We therefore make no safety claim"
  is kept.
note: >-
  The cross-tabulation is collapsed: risk is high/critical vs. the rest, and the band is the maximum
  vs. the rest; medium risk is not shown. This is accepted as a cross-tabulation under the criterion.
  Arithmetic checks: shipped Answered 146 = 150 − 4 and 192 = 209 − 17, consistent with Table 1's
  fixed-rule counts and zero false rejections. The hybrid's 6 v0.2 risky wrong answers are consistent
  with the §5 enumeration (3 blocked, 3 not).
```

### REV-49 / R17 · verified_by EIC (Card #1; DA-only item; competence caveat per Phase 1 §3)

```yaml
item_id: REV-49
obligation_class: must_fix
applied_criterion: precommitted (phase1 REV-49)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: §5 "the shipped score itself separates out-of-scope requests better than the hybrid’s fused score (AUROC 0.963 vs. 0.900 on v0.2, 0.950 vs. 0.855 on v0.1)"'
  - 'table: Table 1 — row "False rejections of non-OOD: fixed / tuned / hybrid" "0 / 9 / 6 of 135", "0 / 20 / 11 of 159"'
  - 'text: §1 Contributions "(3) ... detection compared at matched operating points"; Limitations "including the Holm family, the controls exclusion, the matched operating points and the sensitivity subsets"'
  - 'absence: whole manuscript — out-of-scope rejection of the two scores at a matched false-rejection rate, or a threshold sweep; checked §5, §6, Table 1, Tables 4–7, figure captions'
  - 'text: Abstract "A tuned rejection threshold on the shipped score rejects 46 of 50 out-of-scope requests, where the fixed rule rejects 17 and a hybrid lexical–dense detector 34."'
change_summary: >-
  The shipped score's out-of-scope AUROC and all three rules' false-rejection counts (including the
  baseline's zero) are now reported, and §5 and §6 frame the result as a threshold and cost trade-off.
  No matched-false-rejection comparison or sweep is reported, although Contribution (3) and
  Limitations say one was made. The Abstract and §7 state the comparison without its false-rejection
  cost.
criterion_check:
  route_A: >-
    (a) The baseline-score AUROC is met. (b) The baseline's false rejections are met. (c) The
    matched-FRR comparison or sweep is not met: the three reported operating points have different
    false-rejection counts (0/20/11 on v0.2), and the AUROC difference is threshold-free, not a
    matched-rate rejection.
  route_B: >-
    Applied in §5 ("at a cost of 11 false rejections", "at 20 false rejections") and in §6 ("at the
    cost of more refused in-scope queries, a trade-off"). Not applied in the Abstract or §7.
made_worse_discriminator_considered: >-
  Not applied. The Abstract drops the false-rejection cost it carried in the original. But the item's
  subject (the OOD comparison across all loci plus the route-A analyses) gains substantially: the
  body reports the cost for all three rules, adds the baseline's zero, and adds the AUROC comparison.
  So the reporting of the false-rejection cost is not weakened overall. The Abstract/§7 regression is
  recorded as the MADE_WORSE basis of REV-03, whose subject is exactly those two loci.
residual_gap: >-
  Report out-of-scope rejection for the shipped score and the hybrid feature at a matched
  false-rejection rate, or give a threshold sweep. Without it, remove "detection compared at matched
  operating points" from Contribution (3) and Limitations. Give the false-rejection cost wherever the
  Abstract and §7 state the out-of-scope comparison.
residual_obligation_class: must_fix   # a claimed contribution whose analysis is absent from the manuscript
competence_note: >-
  The EIC persona checked presence and consistency. The McNemar values (p = 0.004 for 46 vs 34;
  p = 0.093 for 20 vs 11 false rejections) are plausible for discordant splits such as 14–2 and
  16–7, but their statistical adequacy is noted for an R1-competence check.
```

---

## 3. should_fix verdict records (25)

PARTIALLY and MADE_WORSE are derived from the committed `fully_addressed` pattern and the generic should_fix discriminator (Phase 1 §2).

| item | verified_by | verdict | evidence_anchor (revised) | change_summary (vs original) | residual_gap / class |
|---|---|---|---|---|---|
| REV-05 | EIC | FULLY_ADDRESSED | `text: §5 "A heuristic score such as s/8 capped at 100% is not expected to be calibrated; what the audit adds is how far off it is, and that the tool shows it to users as a percentage."` | States plainly that the heuristic score should not be expected to be calibrated. Argues that the non-obvious part is the magnitude (five to six times the noise floor, no skill) and the fact that it is displayed. | — |
| REV-08 | EIC | FULLY_ADDRESSED | `text: §2 "We run no generative system, so our comparison with generation is conceptual."`; `text: §1 RQ` (no comparative clause) | Adds the conceptual-comparison statement; the RQ's "without the cost or hallucination risk" clause is removed. | — |
| REV-10 | EIC | PARTIALLY_ADDRESSED | `text: §5 "Grouping folds by intent leaves accuracy unchanged and weakens calibration somewhat (Appendix B)."`; `text: Appendix B "Figures 1–5 show accuracy, the reliability diagrams ..."` | Split B becomes appendix Table 7 with a one-sentence main-text summary. No reliability diagram or risk-coverage figure is moved into the main text; all five figures stay in the appendix. | One reliability-diagram or risk-coverage figure in the main text / should_fix |
| REV-18 | R1 | NOT_ADDRESSED | `text: §4 "effects paired percentile bootstraps (10,000 resamples, seed 42), which are not dual to the exact test"` | Discloses that the bootstrap intervals are not dual to the exact test, but adds no dual interval and no mid-p or unconditional check, and does not say whether the v0.2 verdict depends on the method. | — |
| REV-19 | R1 | NOT_ADDRESSED | `text: Abstract "Isotonic recalibration cuts the shipped confidence’s expected calibration error by 79% on both versions"`; `text: §5 "The pre-named comparison in the Holm family is this hybrid reduction"` | §5 now says which reduction is in the Holm family. The Abstract and the §6 Discussion still headline the shipped 79% without labelling it as outside the corrected family. The figure now carries its own bootstrap interval. | — |
| REV-20 | R1 | PARTIALLY_ADDRESSED | `table: Table 5 — "Calib. ECE reduction ≤0.0001 ≤0.0004"`, caption "Accuracy p are two-sided exact McNemar; the calibration p is one-sided."; `table: Table 1 — "(p=.0004)", "(p=.0003)"` | The Holm table writes the raw and Holm values as bounds and states sidedness for the accuracy and calibration rows. The sidedness of the OOD-rejection row is not stated, and Table 1 prints the same Holm values as equalities. | State the OOD row's sidedness; carry "≤" into Table 1 / consider |
| REV-21 | R1 | PARTIALLY_ADDRESSED | `text: §3 "The reviewer agreed with all 8 out-of-scope labels (7 everyday requests and one far-from-corpus computing task, none a terminal task)"` | "Confirmed" becomes "agreed", and the terminal-task count (0 of 8) is given. No exact interval for 8/8 is reported. | Clopper–Pearson interval for 8/8 / consider |
| REV-22 | R1 | PARTIALLY_ADDRESSED | `text: §5 "the detector rejects 25 of 34 everyday non-computing requests, 4 of 5 far-from-corpus computing tasks, the one nonsensical request, and 4 of the 10 terminal tasks"` | The partition now covers all 50 items (34+5+1+10), and the detector's rejections sum to 34. The baseline's per-category rejection counts are dropped. The original gave 14 (everyday) and 0 (terminal); none are given for any category now. | Baseline rejection counts per category / consider |
| REV-23 | R1 | NOT_ADDRESSED | `text: Limitations "Results come from one fold partition (seed 42)."` | No repeated partitions. The single-seed design is now stated as a limitation. | — |
| REV-24 | R1 | PARTIALLY_ADDRESSED | `text: §4 "There is no inner split; each query’s hybrid score uses the α chosen for its own fold"`; `text: Abstract "With nested cross-validation on two benchmark versions"`; `text: §1 Contributions "under nested cross-validation"` | §4 now describes the procedure exactly (single-level, pooled four folds) and implies out-of-fold scores for the calibrators. The Abstract and Contribution (2) still call it "nested cross-validation", which §4 contradicts, so the manuscript as a whole does not describe the procedure exactly. | Drop "nested" from the Abstract and §1, or reconcile them with §4 / should_fix |
| REV-27 | R1 | FULLY_ADDRESSED | `text: §5 "On the 15 benchmark queries whose gold commands can run safely in a sandbox, all gold commands and 14 of 15 hybrid answers executed successfully."` | "Validates benchmark quality" is removed. The wording is limited to executability. 14/15 matches the original 93.3%. | — |
| REV-28 | R1 | FULLY_ADDRESSED | `text: §5 "(gold commands of all non-OOD queries with a gold command: 125 in v0.1): it flags 19 of 20 high- or critical-risk commands in v0.1"` | States the inclusion rule for the 125. The 20 high/critical gold commands are evaluated within that set. | — |
| REV-29 | R1 | MADE_WORSE | `text: §5 "Platt scaling and histogram binning reduce ECE by similar amounts with overlapping intervals, so the gain does not depend on the method."`; `text: Abstract "Platt scaling and histogram binning do about as well."` | No paired calibrator differences. The independence claim now explicitly rests on overlapping marginal intervals ("so"). The original caveat that histogram binning's lowest ECE is flattered by in-sample bin scoring and that it has the worst Brier score is deleted, so the item's subject degrades relative to the original. | n/a |
| REV-33 | R2 | NOT_ADDRESSED | `absence: §2, §4 — tool/API retrieval; DPR, RRF, Bruch et al.; ranker calibration; checked §2, §4, Table 4, References` | No new citations of these kinds. Dong et al. (2018) was already cited. | — |
| REV-34 | R2 | PARTIALLY_ADDRESSED | `text: Limitations "one small sentence encoder and one fusion rule"`; `text: §4 "(all-MiniLM-L6-v2; ...)"` | There is no sensitivity row. A global Limitations scoping is added, but the individual hybrid-over-BM25 and hybrid-over-dense claims (Abstract, §5, §7) are not scoped to the encoder. | Scope each hybrid claim, or add an encoder row / should_fix |
| REV-35 | R2 | FULLY_ADDRESSED | `text: §3 "OOD (15; here, out-of-scope requests that no record serves)"`; `text: §5 "everyday non-computing requests, ... far-from-corpus computing tasks, ... terminal tasks the corpus does not cover"`; `text: Abstract "a published closed-set alternative"` | The prose uses "out-of-scope", and the OOD label is defined as out-of-scope for this paper. In-domain and general requests are separated, and "closed-vocabulary" becomes "closed-set". §2 still expands OOD as "out-of-distribution" for the cited literature before §3 redefines the label. This is noted, not gating. | — |
| REV-37 | R2 | PARTIALLY_ADDRESSED | `text: §3 "Public natural-language-to-Bash benchmarks target Linux commands and do not map onto this Windows corpus, so we did not use them."`; `text: §3 "their top-1 BM25 score and dense similarity were then checked to be low"` | Adds the justification for not using public benchmarks and specifies the check for the out-of-scope drafts. For the ambiguous queries, the vague "checked against actual system retrieval output" is deleted rather than specified, along with the disclosure that 6 of 30 ambiguous drafts were rejected. | State how the ambiguous drafts were checked against system output, and restore the 6/30 rejection count / should_fix |
| REV-38 | R2 | PARTIALLY_ADDRESSED | `text: References "Finnian Westenfelder, Erik Hemberg, Miguel Tulla, Stephen Moskal, ..."`; `text: References "QuoteBench ... Preprint, arXiv:2608.13547"` | The 2026 preprint is marked as a preprint, and the Wang et al. (2026) preprint is removed. The NL2SH author list still includes Miguel Tulla, contrary to R2's ACL Anthology reading. Hyphenation: the LaTeX source is clean, and the fused compounds in the extraction are line-end artefacts. The rendered PDF was not seen, so that sub-part is CANNOT_VERIFY and non-decisive. | Correct the NL2SH author list / consider |
| REV-39 | R3 | NOT_ADDRESSED | `text: §6 "a trade-off that should be set by the relative cost of a wrong command and a refusal"`; `text: Appendix B "but A5 is lower on v0.2 (82.2% at 58.9%), which we did not analyze further"` | Names the cost trade-off but defines no cost-of-harm operating point. A5's v0.2 decline is still unanalysed. No baseline at matched coverage. | — |
| REV-43 | R3 | PARTIALLY_ADDRESSED | `text: §6 "showing the risk level and asking for confirmation, or using PowerShell’s -WhatIf, before destructive commands"`; `text: Ethical Considerations "recommend that such tools show a risk level and require explicit confirmation for high-risk commands"` | Names confirmation for high-risk commands, a risk display and `-WhatIf`. It does not name `-Confirm` or no-auto-run, and it neither discusses nor declines a risk-dependent threshold. | Discuss, then adopt or decline, a risk-dependent threshold / should_fix |
| REV-45 | R3 | FULLY_ADDRESSED | `text: Abstract "a BM25 retriever over 279 Windows commands"` | The platform and corpus size are now in the Abstract. | — |
| REV-46 | R3 | FULLY_ADDRESSED | `text: Ethical Considerations "This study does not change the published package, so its findings apply to current users."` | States what is (not) being done for current users, and recommends a risk display and confirmation. Does not name the package. | — |
| REV-47 | R3 | FULLY_ADDRESSED | `text: §1 "It cannot invent a command, and a small lexical retriever runs offline and deterministically, so no query leaves the user’s machine and every answer can be traced to a vetted record; the price is coverage."` | Gives positive deployment reasons (offline, deterministic, private, traceable) and names the loss (coverage). The accuracy of "vetted" and "no query leaves" is recorded as NEW-6. | — |
| REV-48 | R3 | FULLY_ADDRESSED | `text: §5 "misses git checkout -- ., which discards uncommitted work"`; `text: Abstract` (a single block in the extraction) | The safety example is typeset correctly (source `-{}-`). The "No LLM" repetitions and the "Non-LLM" subtitle are gone. The abstract is not split in the extraction. | — |
| REV-50 | EIC | PARTIALLY_ADDRESSED | `text: §5 "(The same 15 queries give p = 0.25 in the v0.1 run and p = 0.0625 in the v0.2 run because each run tunes its own thresholds.)"` | Explains why the two p-values differ. Does not say what that implies for the v0.2 result on those items, where the thresholds are tuned with the 35 added, score-checked items. | State the implication / consider |

---

## 4. consider verdicts (12; `applied_criterion: not_precommitted`, decision-inert, verified_by EIC)

| item | verdict | anchor / note |
|---|---|---|
| REV-13 | PARTIALLY_ADDRESSED | "Real in size" is gone, Wang et al. (2026) is removed, the Holm-table caption now has one CI set, and the Limitations bullets are merged (13 → 6). The Zadrozny and Elkan order is unchanged (`text: §2 "(Zadrozny and Elkan, 2002; Platt, 2000; Zadrozny and Elkan, 2001)"`), and the sensitivity table (now Table 6) is not transposed. |
| REV-17 | NOT_ADDRESSED | `text: Ethical Considerations "they are withheld from the review version for anonymity"`. There is no anonymized artifact link. |
| REV-25 | NOT_ADDRESSED | No MDE or sample-size calculation. |
| REV-30 | NOT_ADDRESSED | The ECE-reduction bootstrap procedure is no longer described, and calibrator re-fitting inside the bootstrap is not stated. |
| REV-31 | PARTIALLY_ADDRESSED | κ is given to two decimals (0.63), and the bound is written in Table 5. The bound is not carried into Table 1. The Table 6 "v0.1/v0.2 answerable only" row is not clarified, and Figure 4's expected curve and band are unchanged. |
| REV-36 | NOT_ADDRESSED | No query-performance-prediction framing. |
| REV-41 | FULLY_ADDRESSED | `text: §7 "study whether calibrated confidence and risk prompts change what users run"`. A reliance or behaviour study replaces the preference study. |
| REV-44 | NOT_ADDRESSED | No recall@k. |
| REV-51 | FULLY_ADDRESSED | `text: §5 "At 50% coverage, which lies inside the maximum-confidence tie block"`. |
| REV-52 | NOT_ADDRESSED | No answerable-only AURC. The item's anchor disclosure (original Limitations: "v0.1's own ambiguous labels have not been re-annotated at all") is deleted from the revised Limitations. Recorded as a next-round seed. |
| REV-53 | NOT_ADDRESSED | `text: §5 "its 49 wrong answers carry a mean confidence of 86%"`. Not split by label. |
| REV-54 | PARTIALLY_ADDRESSED | The tuned threshold on the raw shipped score partly covers DA alternative 3 (unclipped BM25) for rejection. Alternatives 4–6 are not discussed. |

---

## 5. NS-1 (REV-16): escalation request — NOT substantiated; lapses to advisory

**Disclosure found.** `text: §4 "The features for the two detectors were chosen by inspecting class means on the full data, a disclosed leak."` The same point is repeated in `text: Limitations "and detector features were chosen on the full data."`

**Test applied, from the revised manuscript alone.** Would full-data feature choice invalidate a headline comparison? Each headline was checked in turn:

1. **Shipped-confidence recalibration.** 79% ECE reduction, noise floor, Brier skill. No detector is involved. **Unaffected.**
2. **Tuned shipped threshold vs. fixed rule.** 46/50 vs 17/50; 10/15 vs 4/15. The feature is the tool's own top score *s*. It was given, not chosen, so no feature selection occurred. **Unaffected by this leak.** (Its exposure to the out-of-scope screening is a separate matter, carried by REV-03 and REV-14.)
3. **Tuned shipped threshold vs. hybrid detector, and shipped-score minus hybrid-feature AUROC.** 46 vs 34, McNemar p = 0.004; AUROC +.095 [.005, .208] and +.063 [.015, .119].
   - The leak can only inflate the *hybrid* feature's apparent separation, because that feature was picked for its class means.
   - It therefore biases these comparisons *against* the paper's conclusion that the shipped score is better.
   - The conclusion is conservative with respect to the leak. **Not invalidated.**
4. **Hybrid detector vs. fixed rule.** 34/50 vs 17/50, Holm-adjusted p = 0.00006, a Holm-family row.
   - The magnitude is optimistically biased by an unknown amount.
   - The direction does not depend on the leaked choice. An unselected score (*s*), tuned by the same protocol, rejects even more (46/50) at the same fixed-rule comparison point.
   - Table 5's 17–0 discordance (2·0.5¹⁷ ≈ 1.5e-5) leaves wide margin.
   - The revised paper no longer attributes the out-of-scope gain to the hybrid ("the gain comes from the threshold, not the hybrid").
   - **Biased magnitude on a now-secondary comparison, not invalidation.**
5. **Hybrid ranking (AURC, correctness AUROC).** These use the hybrid confidence, not a detector decision. The leak statement covers detector features only. **Unaffected.**
6. **Ambiguity detection.** It is reported as weak (F1 0.31/0.50). A leak could only flatter it, so the "weak" conclusion is conservative. **Unaffected.**

**Outcome.** No headline comparison is invalidated, so no EscalationExceptionRecord is emitted and NS-1 lapses to advisory. The leak itself is recorded as NEW-1 (previously_missed, decision-inert). This follows the Phase-1 handling rule.

---

## 6. NewIssueRecords (frozen at `[EVIDENCE-COMMITTED]`)

```yaml
- new_issue_id: NEW-1
  description: >-
    The out-of-scope and ambiguity detector features were chosen by inspecting class means on the full
    benchmark, labels included, outside the CV folds. This is tuning leakage (it matches R1's frozen
    D3 trigger). It optimistically biases the hybrid detector's reported figures: out-of-scope 34/50;
    AUROC 0.900/0.855 (pooled) and 0.901/0.867 (fold means); the Holm-significant "OOD rej." rows of
    Table 5; ambiguity F1/AUROC; and A4/A5. No sensitivity analysis (for example, selecting the
    feature inside CV) bounds the bias.
  location_anchor: 'text: §4 "The features for the two detectors were chosen by inspecting class means on the full data, a disclosed leak."'
  severity: major
  found_by: R1
  confidence: 4
  competence_basis: Card #2 focus 3 (benchmark and leakage threats); R1 frozen D3 trigger
  attribution: previously_missed
  attribution_evidence:
    revised_anchor: 'text: §4 "The features for the two detectors were chosen by inspecting class means on the full data, a disclosed leak."'
    original_anchor: 'text: original §6 "On v0.1, AUROC is 0.867 for OOD detection (feature: absolute top-1 score) and 0.784 for ambiguity detection (feature: margin)" and original §5 "never tuned on data it is later scored against"'
    reasoning: >-
      The same detector pipeline produced the results in both versions. The Split A/B values in
      original Table 4 and revised Table 7 are identical (OOD AUROC 0.867/0.849 and 0.901/0.898;
      ambiguity F1 0.310/0.300 and 0.496/0.479). The revision disclosed the leak; it did not introduce
      it. Round 1 flagged the procedure as unknowable (R1 W3), and no item required it to be resolved.
  nearest_roadmap_item: REV-16
  non_match_rationale: >-
    REV-16's operationalization item (7) requires only disclosure of whether the feature choice was
    inside CV, and that is satisfied. No roadmap item requires the leaked choice to be re-estimated or
    bounded. Phase 1 (NS-1 phase2a_handling) routed this to a NewIssueRecord.
  ns1_link: NS-1 not substantiated (§5); no escalation

- new_issue_id: NEW-2
  description: >-
    Table 1 labels the row "Shipped confidence: Brier skill vs. no-skill, raw / recalibrated" as
    "robust". The caption defines "robust" as "the interval excludes zero on both versions", but the
    raw intervals include zero on both versions: [−.45, .01] (v0.1) and [−.26, .15] (v0.2). §5 itself
    says "intervals including zero". The status contradicts the table's own definition for half of the
    row.
  location_anchor: 'table: Table 1 — row "Shipped confidence: Brier skill vs. no-skill, raw / recalibrated", Status "robust"; caption "Status “robust” means the interval excludes zero on both versions"'
  severity: minor
  found_by: R1
  confidence: 5
  competence_basis: Card #2 focus 1 (whether intervals and stated conclusions agree)
  attribution: regression
  attribution_evidence: 'Table 1 and its status definition are new in the revision (diff: content.tex hunk adding \label{tab:claims}); the original has no status table.'
  nearest_roadmap_item: REV-02
  non_match_rationale: >-
    REV-02 requires that a claims-status table exist, giving each claim a status. It does not govern
    whether an assigned status agrees with the table's own definition. This is an internal
    contradiction introduced with the new table.

- new_issue_id: NEW-3
  description: >-
    §5 states that "tie-aware AURC and AUGRC are lower on both versions with intervals excluding zero
    (Table 1)". Table 1 has no AUGRC row, and no AUGRC value or interval appears anywhere in the revised
    manuscript. The original reported AUGRC −0.041 [−0.062, −0.021] and −0.027 [−0.045, −0.010]. The
    claim now points to data the paper does not contain.
  location_anchor: 'text: §5 "tie-aware AURC and AUGRC are lower on both versions with intervals excluding zero (Table 1)"'
  severity: minor
  found_by: R1
  confidence: 5
  competence_basis: Card #2 focus 2 (selective-prediction measurement)
  attribution: regression
  attribution_evidence: 'The diff removes the original AUGRC values (original §6 Selective prediction) and adds the §5 sentence with the Table 1 pointer; Table 1 (new) carries only the AURC and correctness-AUROC rows.'
  nearest_roadmap_item: REV-26
  non_match_rationale: >-
    REV-26 governs whether the ranking metrics named in the §9 Discussion carry intervals, and it is
    satisfied. This is a broken table pointer and a claim without numbers in §5 Results, caused by
    deleting data.

- new_issue_id: NEW-4
  description: >-
    The ground-truth-defect statement is misstated. "Three items have gold commands outside the
    Windows corpus (TA-B145, TA-B149, TA-B187); they lower every system's non-OOD accuracy by at most
    2 of 159 queries". The original states that TA-B149's gold command is in the corpus and only one
    acceptable command is outside it, and that every system answers TA-B149 correctly. As revised,
    "three ... gold commands outside" is inconsistent with "at most 2 of 159". The Limitations bullet
    repeats "Three items have gold commands outside the corpus."
  location_anchor: 'text: §3 "Three items have gold commands outside the Windows corpus (TA-B145, TA-B149, TA-B187); they lower every system’s non-OOD accuracy by at most 2 of 159 queries and change no comparison."'
  severity: minor
  found_by: R1
  confidence: 4
  competence_basis: Card #2 focus 3 (ground-truth defects)
  attribution: regression
  attribution_evidence: 'original §3 "TA-B149, one of whose acceptable commands is not in the corpus. Every system misses TA-B145 and TA-B187 and answers TA-B149 correctly"; the diff replaces the Ground-truth defects paragraph with the compressed sentence.'
  nearest_roadmap_item: REV-02
  non_match_rationale: >-
    No roadmap item addresses the ground-truth defects. REV-02 (reporting consolidation) is the closest
    by locus, but it does not govern the factual accuracy of the defect description. The misstatement
    was introduced by compression.

- new_issue_id: NEW-5
  description: >-
    The hybrid out-of-scope AUROC appears with two values per version and no label in the text.
    §5 gives 0.855 (v0.1) and 0.900 (v0.2). Table 7 gives 0.867 and 0.901 for the same hybrid
    detector, captioned "AUROC values are means over folds". The §5 values are presumably pooled, but
    they are not labelled as pooled. The original explicitly labelled "(pooled: 0.900 ...)". A reader
    meets 0.855 vs 0.867 for one quantity. The 0.855 also feeds Table 1's "+.095" difference.
  location_anchor: 'text: §5 "(AUROC 0.963 vs. 0.900 on v0.2, 0.950 vs. 0.855 on v0.1)"; table: Table 7 — "v0.1 OOD AUROC 0.867", "v0.2 OOD AUROC 0.901"'
  severity: minor
  found_by: R1
  confidence: 4
  competence_basis: Card #2 focus 2 (metric estimation and aggregation)
  attribution: regression
  attribution_evidence: 'The diff adds the §5 sentence with 0.855 and removes the original "(pooled: 0.900, 95% CI [0.84, 0.95])" label; 0.855 does not occur in the original.'
  nearest_roadmap_item: REV-49
  non_match_rationale: >-
    REV-49 requires the baseline score's AUROC and a matched-rate comparison. It does not govern
    whether the hybrid's AUROC is reported consistently across the text and the tables.

- new_issue_id: NEW-6
  description: >-
    §1's new no-LLM rationale overstates two properties that the paper's own facts qualify.
    (i) "every answer can be traced to a vetted record": §3 says the records "were checked by script
    rather than one by one, and a few Windows-visible records are Linux commands (e.g., sudo reboot)",
    and §5 reports the hybrid returning "sudo shutdown -h now" on the Windows corpus. (ii) "so no query
    leaves the user's machine": §3 says the tool has "an optional query-sync feature", which is off by
    default.
  location_anchor: 'text: §1 "so no query leaves the user’s machine and every answer can be traced to a vetted record"'
  severity: minor
  found_by: R3
  confidence: 4
  competence_basis: Card #4 focus 2 and 3 (deployment safety; practical scope)
  attribution: regression
  attribution_evidence: 'The diff adds this §1 sentence (content.tex Introduction hunk); the original §1 had no such sentence, and the original Ethics text said the library "was checked by script rather than reviewed command by command ... so this bound is weaker than full human vetting".'
  nearest_roadmap_item: REV-47
  non_match_rationale: >-
    REV-47 asks for the positive case for the no-LLM constraint, and it is satisfied. It does not govern
    whether the stated properties agree with the paper's own corpus-vetting and query-sync facts. The
    original manuscript itself disclaimed full human vetting.

- new_issue_id: NEW-7
  description: >-
    The uncertainty of the label-agreement statistic has been removed. The revised paper reports
    "Cohen's κ = 0.63" (n = 14) with no interval. The original reported "a post hoc bootstrap 95%
    interval for κ is [0.39, 1.00], and one flipped item would move it materially." With n = 14, the
    point estimate alone overstates precision for a statistic the paper cites twice (§3, Limitations).
  location_anchor: 'text: §3 "re-labeled a stratified sample of 14 AI-authored queries: Cohen’s κ = 0.63 (Cohen, 1960), below our 0.7 target"'
  severity: minor
  found_by: R1
  confidence: 4
  competence_basis: Card #2 focus 1 and 3 (small-sample inference; AI-authored labels)
  attribution: regression
  attribution_evidence: 'The diff removes the original §8 paragraph containing "[0.39, 1.00]"; the replacement §3 sentence has no interval.'
  nearest_roadmap_item: REV-21
  non_match_rationale: >-
    REV-21 asks for an exact interval on the 8/8 out-of-scope agreement. It does not cover κ or its
    interval. REV-31 (consider) asks only for κ to two decimals. Removing the κ interval is a new
    reporting loss.
```

**New-issue tally:**
- regression: 6, all minor (NEW-2 to NEW-7).
- previously_missed: 1, major (NEW-1).
- indeterminate: 0.
- No regression is major or critical.

**Mismatches folded into roadmap items, not new issues** (traceable, so the goalpost guard applies):
- Table 1 prints Holm "p=.0004" and "p=.0003" as equalities, while Table 5 prints "≤0.0004" and "≤0.0003". → REV-20.
- Table 1 pairs a controls-excluded −67%/−81% with the Holm p of the controls-included 80%/77% (Table 6). → REV-02.
- "we also report equal-mass and sweep estimates" with no values. → REV-15.
- "detection compared at matched operating points" with no such analysis. → REV-49.
- "nested cross-validation" vs "There is no inner split". → REV-24.
- The undefined "keyword-verified" subset label. → REV-14.
- The deleted "6 of 30 drafted ambiguous candidates were rejected". → REV-37.
- The deleted "v0.1's own ambiguous labels have not been re-annotated". → REV-52.

**Numbers checked and consistent:**
- Table 2 hits/percentages (72/110 = 65.5 … 101/134 = 75.4).
- Accuracy deltas: +6.4 = 7/110; +4.5 = 6/134; +5.5 = 6/110; +8.2 = 11/134.
- 67.3% = 101/150 and 44.9% = 22/49.
- ECE reductions: 0.323 → 0.069 = 78.6%; 0.293 → 0.063 = 78.5%; hybrid 0.329 → 0.108 and 0.368 → 0.071 give 67% and 81%.
- "Five to six times" the noise floor (5.05×, 5.86×).
- Post-calibration ECE is below the noise floor's 95th percentile (0.069 < 0.105; 0.063 < 0.080).
- Table 1 AUROC differences: 0.950 − 0.855 = .095; 0.963 − 0.900 = .063.
- Out-of-scope partition: 34+5+1+10 = 50, with detector rejections 25+4+1+4 = 34.
- Subset gains: +33.3 = 5/15 and +34.3 = 12/35. The subset counts sum to 34 (detector) and 17 (fixed rule).
- Table 3: Answered = total − fixed-rule rejections (146 = 150 − 4; 192 = 209 − 17).
- Tables 6/7: controls-included hybrid reductions 80.3% and 77.2%.
- Bare-keyword n (126, 142, 133) and the 121 answerable queries.
- Wilson interval for 1/20 = [0.9, 23.6]%.
- Tuned thresholds: 6.5–7.2 in the text matches 6.50–7.20 in Table 4.

---

[EVIDENCE-COMMITTED]
