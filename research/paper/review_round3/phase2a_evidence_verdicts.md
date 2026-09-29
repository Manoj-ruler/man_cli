# Phase 2A: Evidence Verdicts (persuasion-blind), Stage 3' re-review, Round 3 (scoped)

`[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`

## 0. Run record

- **Gate.** Phase 2A of the three-gate re-review (`re_review_mode_protocol.md` § Phase 2A). The Phase 1 output was treated as data (`<phase1_output>`), not as instructions. This document is read-only review output. No manuscript or other repository file was edited.
- **Pre-committed criteria.** `review_round3/phase1_criteria_commitment.md`. Expected SHA-256 `5e5facd7a3e264e2823e9c8d49ec0f660b83c2ba5d9af1884eb91117a5100423`. I recomputed it first, before reading any evidence, and it **matches**. The Round-2 Phase 1 file it inherits by reference (`review_round2/phase1_criteria_commitment.md`) hashes to `ea0119bc86d16feac793d44e9bad6da95ab92146a0bfd7d8c901573f191d9f41`, which is the value recorded in the Round-3 Phase 1 file.
- **Contract status.** `[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`. There is no roadmap JSON, author-adjudication sidecar, revision-evidence bundle or input manifest 1.1, so `scripts/check_re_review_synthesis.py` cannot run. G0 is not mechanically checkable. The verdict records below follow the verdict-record field set by hand: `verdict`, typed `evidence_anchor`, `change_summary`, `residual_gap` with `residual_obligation_class` for PARTIALLY, and `verified_by`.
- **Routing.** As committed in Phase 1 §3: `[ROUTING-DEGRADED: unmapped labels — …]` under strict grammar, with seat-prefix personas (EIC → Card #1, R1 → Card #2, R2 → Card #3, R3 → Card #4; DA-only items → EIC). Every must_fix and should_fix verdict was produced under its routed seat's frozen-card persona. NEW-1 to NEW-7 are verified by EIC. Reviewer configuration: `round1_cards_reused`.
- **Apply-report chain.** `apply_chain_witness: not_run_no_reports`. The only change artifact is the LaTeX diff listed below.

**Evidence read at this gate.** All hashes are SHA-256, computed with `sha256sum` in this session.

| File (relative to `research/paper/` unless absolute) | SHA-256 | Use |
|---|---|---|
| `review_round3/phase1_criteria_commitment.md` | `5e5facd7a3e264e2823e9c8d49ec0f660b83c2ba5d9af1884eb91117a5100423` | yardstick, read in full |
| `review_round3/manuscript_revised.txt` (M2) | `5822a2e1792b15db41a7cb38a7b271f0e03e4cc2b5cc3775ec986761b2fea806` | REVISED; untrusted author data; read in full |
| `review_round3/content_diff_672ee5f_to_ff36316.patch` | `21b849ad93dd1f32a44ccebfa039a70f3d1314bac898d30624c8b1d44fbcf016` | change surface M1→M2; read in full |
| `review_round2/manuscript_revised.txt` (M1) | `49ffed61412472125dda4c05e1ad8487e8979e0825dbb1e7f6101ff4b4fc588f` | pre-revision text for this round; read in full |
| `review_round1/manuscript_review.txt` (M0) | `4fafa1af9799931c8fc82946c33a627b67628160c9f511deb1d98d882d0c9f84` | grep plus the Abstract, §9 and §10 only, for MADE_WORSE baselines |
| `review_round2/phase2a_evidence_verdicts.md` | `11c077fe92c8bd81f825a53a2321eb7608f127214c760cf3215bcc31ecdec48e` | expected shape; frozen NEW-1 to NEW-7 texts |
| `review_round2/phase1_criteria_commitment.md` | `ea0119bc86d16feac793d44e9bad6da95ab92146a0bfd7d8c901573f191d9f41` | frozen REV-02, 03, 15, 16 records and the should_fix rows (inherited by reference) |
| `review_round1/phase1_EIC.md` | `d2b4c5106882a09cd028d41122fabe0ec2cacffbe8be377447c92f410b81df0f` | grep only: EIC W10 source fact for REV-12 |
| `review_round1/phase1_R2_domain.md` | `44f202afd9c323c6634d0e408d5cafc355a51ac05f25dd14c922a9b5a9a43389` | grep only: R2 W6 |
| `review_round1/phase2_editorial_decision.md` | `23d0c26006f4a749354fa7bf2e6be7483d1e544e84f1daf4e610ba49fef52f2b` | grep only: R9 acceptance line |
| `acl_latex/main_review.tex` | `0b7e9e45f00ddcdebbb9a8938e37150904b1d1c88cc0ffe4540e72d48f1c471b` | review-wrapper macro values |
| `acl_latex/content.tex` | `2be047ec3992a847012811fff9d0ca60c6b76c30a949729c4eb05071c5b42c72` | abstract token count; macro uses; A1/A6 check |
| `acl_latex/main_review.pdf` | `b740ade5d736b741fee8f9225a1e79227fc2682129ddccd0ca4e206bdd4b0a1a` | `pdfinfo`; `pdftotext`; scan of the info dictionary, streams and link annotations |
| `acl_latex/main_review.aux` / `.out` / `.log` | `ac65ebad…8870` / `c74002c9…f260464` / `447a78ea…300991` | page of `\label{endofbody}`; bookmarks; warnings |
| `acl_latex/figures/fig1…fig5_*.png` (the 10 files included by the review PDF) | fig1 `0511eb3e…`, fig1_v0.2 `d7207369…`, fig2 `dc396cec…`, fig2_v0.2 `7cdd7c25…`, fig3 `8f09c8ef…`, fig3_v0.2 `380ad008…`, fig4 `ef21b35f…`, fig4_v0.2 `f48eac40…`, fig5 `352bf26e…`, fig5_v0.2 `f5ee3601…` | viewed as images; checked for identifying text |
| `C:\Users\manoj\.claude\skills\academic-paper-reviewer\references\re_review_mode_protocol.md` | `5e0440c636704015cd84ce3ba8805d871de6427c9122cd8aa8c5e22bc71f1e66` | Phase 2A, Dissent and New-Issue sections |

**Withheld and not opened.**
- `T21b_REVISION_LOG.md` and `T21_REVISION_LOG.md` (the response letters).
- `research/PLAN_TASKS.md`.
- Everything under `research/results/`, including `REVIEW_R1_NOTES.md`.
- `acl_latex/main.tex`. The patch hunk showing its macro values was seen, which is expected.
- No `git log`, `git show` or `git diff` was run.

**Extraction and evidence-surface notes.**
- **M2 is a faithful extraction.** `review_round3/manuscript_revised.txt` is byte-identical to a fresh `pdftotext -enc UTF-8 -layout acl_latex/main_review.pdf` (the `diff -q` comparison reported them identical).
- **Layout artefacts, not defects.** The extraction interleaves the two columns, carries margin line numbers (001–745), hyphenates at line ends and places floats out of order. These are extraction noise. In the quotations below, hyphenation is normalised against `content.tex`.
- **"TOOL1".** This is the review macro `\toolname` (`\textsc{Tool}`) followed by footnote marker 1.
- **Locations.** Section numbers are M2's: §1 Introduction, §2 Related Work, §3 System and Benchmark, §4 Methods, §5 Results, §6 Discussion, §7 Conclusion, then Limitations, Ethical Considerations, References and Appendices A and B. Line numbers are the PDF margin numbers.
- **Figures.** All 10 figure PNGs were viewed. They contain only axis labels, legends, system labels (BM25/Dense/Hybrid, A0–A6) and numbers. There is no tool name, package name, path or author text in them.

**Consistency checks are internal only.** Every numeric check in this document tests consistency within M2 (abstract, body, tables, conclusion, limitations, appendix) and against M1/M0 where a criterion refers to them. No number was checked against result files, which are withheld.

**Single-family disclosure (carried to the Re-Review Output):** "This verification round ran on the same model family that drove the revisions; over-optimization to this judge's latent biases is possible (Ren et al. 2026, arXiv:2607.13104 §8.1.2)." All Round-1 seats, the revision driver for Rounds 2 and 3, the Round-2 verifier and this Round-3 Phase 2A verifier are `claude-opus-5-5`.

**Protocol DissentRecords: none.** Every verdict below applies its pre-committed pass condition as written. Three dissent *notes* are recorded (informational, as the dispatch asked). None swaps a criterion, so none triggers a dissent bound or G2:
- **DN-1, REV-49 `both_routes`.** The clause is worded around the word "matched". M2 does not use that word, but it uses "equal" for one table cell whose counts differ (10 vs 11). The clause is applied as written, and the cell is recorded as NEW-10. The verifier thinks the clause should cover synonyms.
- **DN-2, REV-02 P3.** The at-most-once caveat rule can collide with loci that other items require: the REV-19 label in the Discussion and the REV-03 screening clause in the Conclusion. It is applied as written. The failing instance, the §5 sentence "These reductions were not in the corrected family.", is not required by any other item, so the collision does not decide the verdict.
- **DN-3, REV-12 P1.** "Ends '… Bash Script Generation'" is read as EIC W10's only reported discrepancy ("Bash Code Generation" in the citation vs "Bash Script Generation" in the ISSTA program). EIC reported no claim about the subtitle. If the version of record lacks the "with Robustness-Aware…" clause, only the source can settle that.

**Escalation exceptions:** none.

**Attestation exceptions** (disclosed; none affects a verdict):
1. **Git-status snapshot.** The session began with an automatic git-status snapshot I did not request. It shows the commit subjects `ff36316 paper: T21b revision round 3 - anonymized review version, T22 residuals`, `672ee5f … Major Revision (B3) …`, `bfb00a7 … reframed as an audit …`, `145fbb3 … 53 reproduction checks …` and `295f707 … T20 literature additions …`. These are author-side summaries. No verdict relies on them.
2. **Author annotations in the permitted patch.**
   - The `content.tex` header comment names the Round-3 log file. Only the filename was seen; the file was not opened.
   - `main_review.tex` comments say "author decision 2026-09-29, reversing D3/D7" and give a pre-submission grep instruction.
   - A `references.bib` comment asserts that the ISSTA table of contents and DOI were checked.
   These are author claims. REV-12 was judged on the rendered reference against EIC W10's reported source fact, not on the bib comment.
3. **Stray grep line.** A grep over `review_round1/*.md` for "BashCoder" printed one line from `review_round1/author_verification.md` (SHA-256 `9e2cb836c36628b3ff2ec090ca9ab838e3fe7239909eb8abc0e2c171f404055e`). The file is not on the withheld list and was not otherwise opened. The line says BashCoder-R1's reward is static analysis, which matches the Round-1 seats. It has no bearing on any verdict.
4. **Harness-injected context.** `CLAUDE.md`, `AGENTS.md` and the memory index were placed in context by the harness. They contain no revision content.
5. **Scratch files.** Temporary `pdftotext` outputs were written only to the session scratchpad, not to the repository.

---

## 1. Verdict summary

| Class | FULLY | PARTIALLY | NOT | MADE_WORSE | CANNOT_VERIFY | Total |
|---|---|---|---|---|---|---|
| must_fix, scoped (§2) | 9 | 3 | 0 | 0 | 0 | 12 |
| must_fix, guard (§5; HOLDS → FULLY) | 5 | 0 | 0 | 0 | 0 | 5 |
| **must_fix, all 17** | **14** | **3** | **0** | **0** | **0** | **17** |
| should_fix, scoped (§3) | 8 | 3 | 4 | 0 | 0 | 15 |
| should_fix, guard (§5; HOLDS → FULLY) | 10 | 0 | 0 | 0 | 0 | 10 |
| **should_fix, all 25** | **18** | **3** | **4** | **0** | **0** | **25** |

**must_fix detail**

| Verdict | Items |
|---|---|
| FULLY (scoped) | REV-01, 06, 11, 12, 14, 16, 32, 40, 49 |
| FULLY (guard, all HOLD) | REV-04, 07, 09, 26, 42 |
| PARTIALLY | REV-02 (residual should_fix), REV-03 (residual consider), REV-15 (residual should_fix) |

No must_fix item is PARTIALLY with a `must_fix` residual.

**should_fix detail**

| Verdict | Items |
|---|---|
| FULLY (scoped) | REV-19, 20, 21, 22, 24, 29, 37, 50 |
| FULLY (guard, all HOLD) | REV-05, 08, 27, 28, 35, 38, 45, 46, 47, 48 |
| PARTIALLY | REV-10 (residual should_fix), REV-34 (residual should_fix), REV-43 (residual consider) |
| NOT_ADDRESSED | REV-18, 23, 33, 39 |
| MADE_WORSE | none; REV-29 is no longer MADE_WORSE |

**Informational should_fix addressed rate.** This is computed on the 2A verdicts; the binding rate is computed on final post-2B verdicts. (FULLY + PARTIALLY) / 25 = (18 + 3) / 25 = **21/25 = 84%**. Round 2 was 19/25 = 76%.

**Round-2 NEW records**

| Status | Records |
|---|---|
| RESOLVED | NEW-2, 3, 4, 5, 6, 7 (all six Round-2 regressions) |
| NOT_RESOLVED | NEW-1 (previously_missed, decision-inert) |
| WORSENED | none |

**Regression guard.** 15/15 HOLD (5 must_fix, 10 should_fix). None REGRESSED.

**New Round-3 issues** (§6; frozen at `[EVIDENCE-COMMITTED]`)

| Attribution | Count | Records |
|---|---|---|
| regression | 3, all minor | NEW-8, NEW-9, NEW-10 |
| previously_missed | 2, both minor | NEW-11, NEW-12 |
| indeterminate | 0 | — |

**Anonymization.** No anonymization leak was found on the review PDF's text, metadata, link or figure surfaces. Advisory lookup-risk and source-file observations go to the human checkpoint (REV-11 record).

**Length.**
- Abstract: 196 whitespace tokens (≤ 200).
- Body through the Conclusion ends on page 6 (`\label{endofbody}` on page 6, within the 8-page limit).
- The PDF has 12 pages, including Limitations, Ethics, References and the Appendix.

This gate does not derive a decision. Decision derivation is Phase 2B.

---

## 2. must_fix verdict records (12 scoped)

### REV-01 / R1 · verified_by EIC (Card #1)

```yaml
item_id: REV-01
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-01; inherits round2 phase1 §4 REV-01)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §1 Contributions (l. 066–083) "(3) Evaluation practice for small closed-set benchmarks: tie-aware selective-prediction metrics, a noise floor and no-skill reference for calibration, and out-of-scope rules compared under the same tuning protocol and at equal false-rejection counts."'
  - 'text: Title "Confidently Wrong: Auditing and Recalibrating the Confidence of a Shipped Natural-Language-to-Shell Command Retriever"'
  - 'text: §1 RQ (l. 061–065) "how reliable is the confidence of a shipped closed-set command retriever, and what do post-hoc recalibration, a tuned rejection threshold, and a hybrid lexical–dense retriever each contribute?"'
  - 'text: §7 (l. 457–467) "A published natural-language command retriever shows its users a confidence that, on our benchmark, is no better than a constant forecaster. On the same benchmark, post-hoc recalibration fixes most of that. … The hybrid mainly improves how confidence ranks its own errors."'
  - 'absence: whole manuscript — "disclosure", "disclose" as a contribution, "Holm-corrected significance", "every null and fragile result"; the only "disclose" is Ethical Considerations "We disclose that part of the benchmark was written by an AI agent", which is not a contribution'
change_summary: >-
  Contribution (3) drops "disclosure of every null and fragile result" and "detection compared at
  matched operating points". Its only remaining clauses are methodological. Contribution (2) no
  longer carries the accuracy-fragility clause. Title, RQ and Conclusion keep the audit-first framing.
pass_condition_check:
  P1_no_reporting_practice_as_contribution: met
  still_must_hold:
    a_title: holds (anonymization did not touch the title)
    b_RQ: holds
    c_contribution_list: holds (it leads with the audit (1); the hybrid is separated in (2) as "a research prototype, not part of the package")
    d_conclusion_opening: holds (calibration alone in sentences 1–2; the hybrid in a separate sentence)
    e_no_misattribution: holds (no sentence credits the hybrid with the shipped 79%)
made_worse_check: >-
  Not met. The fragile hybrid accuracy gain is not promoted anywhere: it is absent from the
  Contribution list, the Discussion and the Conclusion.
verified_by: EIC
```

### REV-02 / R2 · verified_by EIC (Card #1)

```yaml
item_id: REV-02
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-02; inherits round2 phase1 §4 REV-02 (a)–(d))
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'table: Table 1 caption "Claims with 95% bootstrap intervals, all on non-control queries: 110 and 134 in-scope queries plus the 15 and 50 out-of-scope ones. No rule ever rejects a control, and controls are never discordant, so the accuracy p-values equal the Holm table’s (Appendix B) …"'
  - 'table: Table 2 caption "Non-OOD accuracy (hits/queries, %), canonical controls excluded."'
  - 'table: Table 3 caption "Unlike Table 1, the population is every query of each version (150 and 209, controls and out-of-scope requests included), because a risky command can be returned for any of them."'
  - 'text: §4 (l. 273–275) "The shipped confidence’s recalibration and the tuned shipped threshold are outside this family."'
  - 'text: §5 Recalibration (l. 303–304) "These reductions were not in the corrected family."'
  - 'text: §6 (l. 434–435) "repairs most of it on our benchmark (a result outside the corrected family)"'
change_summary: >-
  Table 1 now uses one stated population (non-control), and the "controls incl." Holm p and the
  "all queries" out-of-scope rows are gone. Table 3 now states its population, but it is explicitly a
  different one (all 150/209 queries, controls and out-of-scope included). The accuracy-fragility
  caveat now appears once in the body (§5). The multiplicity label for the shipped recalibration
  ("outside the corrected family") appears in §4, §5 and §6.
pass_condition_check:
  P1_single_stated_population: >-
    Partly met.
    - Every main-text table states its population. Table 2's 110/134 is a named subset, which is
      admissible.
    - No Table-1 row prints a p-value computed on a different population. The hybrid ECE row carries
      only the label "(pre-named test)"; §5 says openly that the test was run "with controls included".
    - Not met: "all main-text tables use the same population". Table 3 uses a superset (controls and
      out-of-scope requests included).
    - Observation (non-gating): the caption's equality argument covers the raw McNemar p. The printed
      Holm-adjusted accuracy p is equal on both populations only if the family's p-value ordering is
      the same without controls. That is plausible, since the non-control hybrid ECE intervals exclude
      zero widely, but it is not stated.
  P2_table3_population_same_as_P1: >-
    Not met. The population is stated, but it differs from Table 1's by design.
  P3_each_caveat_once_in_body: >-
    Partly met.
    - The accuracy-fragility caveat is stated once, in §5 ("consistent in size but not established").
    - The hybrid-over-dense caveat is stated once (§5).
    - The in-sample caveat on the equal-false-rejection comparison is stated once (§5).
    - The AI-assigned kind labels are stated once (§5).
    - The encoder scope is stated once (§5).
    - Not met: the "outside the corrected family" caveat for the shipped recalibration is stated in
      §5 ("These reductions were not in the corrected family.") and in §6 ("(a result outside the
      corrected family)"). §4 also has it, as a methods statement of family membership. REV-19
      requires the §6 instance, so the §5 sentence is the removable repeat (DN-2).
  still_must_hold: >-
    Holds. There is exactly one claims-status table (Table 1). Split B (Table 7), the bare-keyword
    sensitivity analysis (Table 6), per-subset p-values and the Holm table (Table 5) are all in
    Appendix B.
residual_gap: >-
  (1) Bring Table 3 into the Table-1 population, or add a non-control version of its counts. The
  alternative is an evidence-backed rebuttal (Phase 2B) that a risk table must cover all returned
  commands. (2) Drop the repeated multiplicity caveat in §5 (keep §4's family definition and the §6
  label that REV-19 requires).
residual_obligation_class: should_fix   # Round-2 class kept: clause (a) "one reporting population" still fails, though it is now transparent
made_worse_check: >-
  Not met relative to M0. M0's main-text tables mixed controls-in and controls-out without
  consistent labels. M2 has fewer populations, and each is stated.
verified_by: EIC
```

### REV-03 / R3 · verified_by EIC (Card #1)

```yaml
item_id: REV-03
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-03 P1–P3; loci Abstract and Conclusion)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: Abstract (l. 016–024) "A rejection threshold on the shipped score, tuned on held-out folds, rejects 46 of 50 out-of-scope requests but also 20 of 134 in-scope ones; the fixed rule rejects 17 and none, a hybrid lexical–dense detector 34 and 11. Most are everyday, not computing, requests; the 35 added ones were screened for low scores, and on the 15 original ones the threshold rejects 12 and the detector 9."'
  - 'text: §7 (l. 460–466) "A threshold on the shipped score, tuned on held-out folds, rejects more out-of-scope requests than a hybrid detector (46 vs. 34 of 50; 12 vs. 9 on the 15 not screened by retrieval score) but refuses more in-scope queries (20 vs. 11 of 134), and most of these requests are everyday rather than terminal tasks."'
  - 'text: §5 (l. 368–371) "On the 15 original queries, which were not checked against scores, the three rules reject 4, 12 and 9; on the 35 added ones, 13, 34 and 25."'
change_summary: >-
  Both loci now carry the screening clause, the unscreened-subset counts for the two tuned rules, the
  false-rejection cost and the kind-of-request qualifier. There is no significance value and no
  general OOD-detection wording. Round 2's MADE_WORSE state (qualifiers dropped relative to M0) is
  cleared. At the Abstract, the unscreened-subset result omits the shipped fixed rule's count (4/15),
  although the gain sentence states that rule's 17/50.
pass_condition_check:
  P1_screening_clause:
    Abstract: met ("the 35 added ones were screened for low scores", the sentence after the gain sentence)
    Conclusion: >-
      Met by equivalence. "12 vs. 9 on the 15 not screened by retrieval score" (same sentence)
      identifies that the complement (the added items) was screened by retrieval score.
  P2_unscreened_result:
    Abstract: >-
      Partly met. The arm (threshold, 12) and the detector (9) are given for the 15. The baseline, the
      shipped fixed rule, is not given for the 15 (4/15 is in §5 only), although the Abstract states
      both the threshold's and the detector's rejection alongside the fixed rule's 17/50. So neither
      arm's gain over the shipped baseline can be read on the unscreened items at this locus.
    Conclusion: >-
      Met. The only comparison stated is threshold vs. detector, and both counts are given for the
      15. The fixed rule is not mentioned.
  P3_qualifiers_restored:
    Abstract: >-
      Met: false-rejection cost "20 of 134 in-scope", "none", "11"; kind qualifier "Most are everyday,
      not computing, requests"; no significance value; no general OOD claim.
    Conclusion: >-
      Met: "(20 vs. 11 of 134)"; "most of these requests are everyday rather than terminal tasks"; no
      significance value.
  non_gating_parenthetical: >-
    Neither locus says that the tuned threshold thresholds the same raw BM25 score used to screen the
    35 items. §5 says it: "the 35 added queries were checked to have low raw BM25 scores (at most
    7.39), and the tuned shipped thresholds (6.50–7.20) sit just below that maximum".
  observations_non_gating: >-
    - "Most are everyday" follows "34 and 11" (which ends on in-scope counts), so its referent (the 50
      out-of-scope requests) is momentarily ambiguous.
    - The 12/9 counts come from the v0.2 run. Table 1 gives 10/7 for the same 15 items (v0.1 run). This
      is recorded as NEW-9, because REV-03 P2 governs the presence of the numbers, not which run they
      come from.
residual_gap: >-
  At the Abstract, add the fixed rule's count on the 15 original items (4 of 15) to the unscreened
  clause, so the gain over the shipped baseline can be read on the unscreened subset.
residual_obligation_class: consider   # re-graded: the screening clause, cost and kind qualifiers are present at both loci; the missing count is in §5 and does not change the direction of any stated result
made_worse_check: >-
  Not met; the precedence rule does not fire. The M0 qualifiers (breakdown by kind of request;
  false-rejection cost) are present at both loci. Nothing is broadened to general OOD ability. No
  unscoped significance statement remains.
verified_by: EIC
```

### REV-06 / R5 · verified_by R3 (Card #4)

```yaml
item_id: REV-06
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-06)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §6 (l. 437–439) "Whether a better-calibrated number changes what users run is untested."'
  - 'text: §5 Recalibration (l. 324–328) "whether its map transfers to real user queries is untested."'
  - 'text: §3 The published tool (l. 142–149) "The command-line tool prints the top command with “confidence: N %”, refuses when N < 30, and otherwise opens an editable prompt pre-filled with the command, which runs (in PowerShell on Windows) when the user presses Enter; no risk level is shown. Retrieval is local; an optional query-sync feature is off by default."'
change_summary: >-
  Adds an explicit sentence saying that the user benefit of calibrated confidence is untested. The
  published-tool paragraph keeps all behaviour facts after anonymization.
pass_condition_check:
  P1_explicit_untested_sentence: met (§6)
  still_must_hold: >-
    Holds. (a) Display: "confidence: N %". (b) Rejection: refuses when N < 30. (c) Printed vs. run:
    runs when the user presses Enter. (d) Confirmation: the editable pre-filled prompt plus Enter; "no
    risk level is shown".
made_worse_check: >-
  Not met. No user-benefit claim is added. "The number a user sees can become informative" (§6) is a
  statement about Brier skill, scoped to "queries like these".
verified_by: R3
```

### REV-11 / R8 · verified_by EIC (Card #1)

```yaml
item_id: REV-11
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-11 P1–P3; judged on M2 text alone)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §1 (l. 048–050) "We audit one such system as it is published: TOOL1, a publicly released package that maps a query to one of 279 Windows commands with BM25"'
  - 'text: footnote 1 "The tool’s name and package are withheld for anonymous review."'
  - 'text: §1 (l. 054–057) "It was written and released by one of the authors before this study, which changed none of its executable code and none of the corpus fields it reads."'
  - 'text: §3 (l. 191–194) "Two items have gold commands outside the Windows corpus (Q145, and Q187 in v0.2 only), and one (Q149) has an acceptable command outside it"'
  - 'absence: M2 extraction, all pages (title, headings, body, captions, table text, footnote, Limitations, Ethical Considerations, References, Appendices A–B) — "TermAssist" in any case, "TA-B", "npm", "@", "http", "github"; 0 hits'
  - 'absence: main_review.pdf info dictionary — Title, Author, Subject, Keywords all empty; Creator "LaTeX with hyperref"; Producer "MiKTeX pdfTeX-1.40.28"'
  - 'absence: main_review.pdf link annotations — 20 URIs, all DOIs, arXiv or ACL Anthology or OpenReview pages of cited works; none resolves to the package, a repository or a registry'
  - 'absence: main_review.pdf bookmarks (section titles only) and decompressed streams — no "TermAssist", "termassist", "TA-B", "npm", user or path strings'
  - 'absence: figures 1–5 (10 PNGs, viewed) — no identifying text'
change_summary: >-
  The body names the tool through review-wrapper macros: "TOOL" plus a withheld-name footnote,
  "a publicly released package", "one of the authors", and "Q" item IDs. The name, the registry
  ("npm") and the "TA-B" prefix are gone from every rendered surface. A neutral relationship sentence
  is added.
pass_condition_check:
  P1_no_name: met
  P2_no_pointer: met (no URL, repository, registry, handle, version identifier or maintainer; "npm" absent)
  P3_relationship: met ("written and released by one of the authors before this study": explicit, third person)
advisory_non_gating_for_human_checkpoint:
  - >-
    Lookup risk. The §1 relationship sentence, combined with §3's distinctive functional detail, could
    let a reviewer find the package and its maintainer in a public registry. That detail is: 431
    records, 279 Windows-visible (145 cross-platform, 134 Windows-specific); BM25 k1 = 1.2, b = 0.75;
    a flat +15 near-match bonus; confidence min(round(s/8 × 100), 100); refusal below 30%; an optional
    query-sync feature; runs in PowerShell on Enter. The frozen text does not define lookup
    sufficiency beyond P2, so this is not gating.
  - >-
    Off-surface source files. If LaTeX sources were ever submitted with the review version, they
    would de-anonymize. `content.tex` comments name the revision log and review paths.
    `main_review.tex` comments name the "TA-B" prefix. `main.tex` defines the real tool name and "an
    npm package" (seen in the patch). The rendered PDF is clean.
made_worse_check: >-
  Not met. No identifying information was added. The ownership framing is consistent: the audit is
  not presented as independent, and authorship is disclosed.
cross_item_note: "REV-46 (guard) still holds after anonymization (§5 of this file)."
verified_by: EIC
```

### REV-12 / R9 · verified_by EIC (Card #1)

```yaml
item_id: REV-12
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-12; source-facts note §2; DN-3)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: References (l. 676–683) "Lei Yu, … and Fengjun Zhang. 2026. BashCoder-R1: Towards robust and explainable Bash script generation with robustness-aware group relative policy optimization. In Proceedings of the ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA 2026)."'
  - 'text: §1 (l. 038–040) "most recently trained with reinforcement learning on static-analysis rewards (BashCoder-R1; Yu et al., 2026)"'
  - 'absence: §2 Related Work — no BashCoder-R1 description; no 90%/73% or FullRate figures anywhere'
change_summary: >-
  The reference title changes from "Bash code generation" to "Bash script generation". That matches
  the only discrepancy EIC W10 reported against the ISSTA 2026 program ("follows the arXiv wording
  ('Bash Code Generation'), while the ISSTA program lists 'Bash Script Generation'"). The
  description stays static-reward.
pass_condition_check:
  P1_title_matches_record_as_reported: >-
    Met as far as the Round-1 source fact reaches. EIC W10 reported no discrepancy in the
    "with robustness-aware group relative policy optimization" clause. If the version of record lacks
    that clause, only the source can settle it (DN-3). The bib comment's claim of an ISSTA table-of-
    contents check is author data and was not used.
  still_must_hold: >-
    Holds. §1 is not execution-grounded ("static-analysis rewards"). Related Work does not describe
    BashCoder-R1, so the clause is vacuous there. The 90%/73% figures are not cited.
made_worse_check: "Not met."
verified_by: EIC
```

### REV-14 / R10 · verified_by R1 (Card #2)

```yaml
item_id: REV-14
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-14 P1–P3)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §5 (l. 368–371) "On the 15 original queries, which were not checked against scores, the three rules reject 4, 12 and 9; on the 35 added ones, 13, 34 and 25."'
  - 'text: §3 (l. 182–185) "The 15 v0.1 out-of-scope queries were instead checked by searching all corpus intents and descriptions for relevant keywords, not against retrieval scores."'
  - 'text: §5 (l. 362–368) "the 35 added queries were checked to have low raw BM25 scores (at most 7.39), and the tuned shipped thresholds (6.50–7.20) sit just below that maximum. The hybrid’s thresholds (0.884–0.925) are on the fused, per-query-normalized scale and cannot be compared with the 7.39 and 0.31 bounds."'
  - 'text: §3 (l. 176–182) "every draft was run through both BM25 and dense retrieval: 24 of 30 ambiguous drafts were kept …, and all 35 out-of-scope drafts were kept unchanged, their top-1 BM25 score and dense similarity having been checked to be low (maximum 7.39 and 0.31)"'
  - 'table: Table 4 rows "Out-of-scope detector … (v0.1 0.833–0.895; v0.2 0.884–0.925)" and "Tuned shipped threshold … (v0.1 5.42–6.19; v0.2 6.50–7.20)"'
change_summary: >-
  Adds the v0.2 original/added split for all three rules, including the headline tuned threshold.
  Replaces the undefined "keyword-verified" with an explicit keyword-search procedure and states that
  the 15 were not checked against retrieval scores. States how the hybrid's fused-scale thresholds
  relate to the raw bounds: they are not comparable.
pass_condition_check:
  P1_split_for_every_headline_rule: >-
    Met for the fixed rule (4/15, 13/35), the tuned threshold (12/15, 34/35) and the detector (9/15,
    25/35). Sums check: 4+13 = 17, 12+34 = 46, 9+25 = 34, matching Table 1's v0.2 cells.
  P2_unscreened_status_defined: met (keyword search of intents and descriptions; "not against retrieval scores")
  P3_thresholds_vs_bounds: >-
    Met.
    - Raw-score thresholds 6.50–7.20 are stated against 7.39, in the same units (the per-fold range;
      its maximum is below the bound).
    - The fused thresholds are stated in words to be on a per-query-normalized scale that cannot be
      compared with the bounds. That is an explicit relation, and it agrees with §4 and Table 4 (min-max
      normalized over each query's candidates).
    - The v0.1 thresholds (5.42–6.19; 0.833–0.895) involve no screened items and are in Table 4.
  still_must_hold: >-
    Holds. (a) "all 35 out-of-scope drafts were kept unchanged". (d) The comparison is given as counts
    with explicit denominators (x/15 vs y/35), which is rate-equivalent. No "smaller gain" wording
    remains. The only size sentence, "The threshold’s lead over the detector therefore also appears on
    the unscreened queries, though 15 queries are few", matches the numbers (lead 3/15 = 20 pts vs
    9/35 = 25.7 pts).
  observation_non_gating: >-
    The split reveals a visible selection effect for the tuned threshold (12/15 = 80% on unscreened vs
    34/35 = 97% on screened). No sentence denies it, and Limitations says the screening "favors the
    shipped score".
made_worse_check: "Not met. The screening disclosure is strengthened. No claim that the selection effect is absent."
verified_by: R1
```

### REV-15 / R11 · verified_by R1 (Card #2)

```yaml
item_id: REV-15
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-15 P1–P4)
verdict: PARTIALLY_ADDRESSED
evidence_anchor:
  - 'text: §5 Recalibration (l. 294–302) "lowers the shipped confidence’s ECE to 0.069 on v0.1 and 0.063 on v0.2, a 79% reduction on both versions and within the noise floor’s 95th percentile (0.105 and 0.080). Equal-mass bins give 0.110 and 0.070 (noise-floor 95th percentiles 0.122 and 0.092) and the bin-count sweep 0.060 and 0.047."'
  - 'text: §5 (l. 311–317) "The hybrid’s own confidence behaves similarly: raw, its Brier skill is −0.32 and −0.30, both intervals excluding zero; after recalibration its ECE falls from 0.329 to 0.108 and from 0.368 to 0.071, above the noise floor’s 95th percentile on v0.1 (0.089) and within it on v0.2 (0.079)."'
  - 'text: §4 (l. 247–248) "we also report equal-mass and sweep estimates"'
  - 'table: Table 1 rows "Shipped confidence: ECE before → after isotonic", "Shipped confidence: Brier skill vs. no-skill, raw / recalibrated", "Hybrid confidence: ECE before → after isotonic (pre-named test)"'
  - 'absence: §5, Table 1, Appendix B, Table 7 — equal-mass or sweep ECE for the hybrid (before or after); the recalibrated hybrid Brier skill; the raw shipped ECE under equal-mass or sweep'
change_summary: >-
  Equal-mass and sweep ECE values now appear for the recalibrated shipped confidence on both versions,
  with equal-mass noise floors. The hybrid's noise floor and raw Brier skill are now numeric. "Estimates
  agree" is removed. The hybrid ECE reduction, which is the pre-named Holm comparison, still has no
  equal-mass or sweep value.
pass_condition_check:
  P1_values_present: >-
    Partly met.
    - Shipped confidence: equal-mass (0.110, 0.070) and sweep (0.060, 0.047) are reported for the
      recalibrated state. The raw state under these estimators is not reported, so the reduction under
      them cannot be computed.
    - Hybrid (67%/81%, stated as a result in §5 and Table 1): no equal-mass or sweep value on either
      version. Not met.
  P2_hybrid_references_numeric: >-
    Met as written. Noise floor 0.089/0.079 and no-skill reference (raw Brier skill −0.32/−0.30) are
    numbers in the same paragraph. Observation: the recalibrated hybrid's Brier skill is not given, and
    the intervals behind "both intervals excluding zero" are not printed.
  P3_no_unbacked_claim: >-
    Met. §4's "we also report equal-mass and sweep estimates" is backed by §5's values. "Estimates
    agree" is gone.
  P4_wording_agrees: >-
    Met as far as checkable. The headline "to about the noise floor" (Abstract) agrees with the
    equal-mass values (0.110 < 0.122; 0.070 < 0.092). The hybrid reduction is not stated at the
    Abstract, Discussion or Conclusion.
  still_must_hold: >-
    Holds. (e) Intervals on relative reductions ([44, 84], [52, 87], [43, 83], [62, 86]). (f) Brier
    skill with intervals is alongside ECE in Table 1 and §5. (g) Population: non-control.
residual_gap: >-
  Report equal-mass and at least one sweep or debiased ECE for the hybrid before and after
  recalibration on both versions. Also report the shipped confidence's raw ECE under the same
  estimators, so that the reductions can be compared.
residual_obligation_class: should_fix   # Round-2 class kept; the gap has narrowed to the hybrid (the pre-named comparison)
made_worse_check: "Not met. The headline magnitudes are unchanged, and the Brier values are kept."
verified_by: R1
```

### REV-16 / R12 · verified_by R1 (Card #2)

```yaml
item_id: REV-16
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-16)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §4 Protocol (l. 229–233) "Each threshold is chosen from the scores observed on the development folds, with out-of-scope predicted below it; ties in F1 go to the lowest such score."'
  - 'table: Table 4 rows "α … Grid {0.0, 0.1, …, 1.0}; … ties go to 0.5", "Out-of-scope detector … maximizing F1 on development folds", "Tuned shipped threshold  Same protocol on the shipped top score s", "Ambiguity detector, A4, A5  Flag if margin is below an F1-maximizing threshold"'
change_summary: >-
  Adds the candidate set (every score observed on the development folds) and a tie rule (lowest
  score) for the F1-maximizing thresholds. The tuned shipped threshold uses the same protocol.
pass_condition_check:
  P1_grid_and_tie_rule: >-
    Met for the OOD detector, the tuned shipped threshold and (by "Each threshold") the ambiguity
    detector. Wording note: "with out-of-scope predicted below it" is phrased for the OOD rules. For the
    ambiguity detector, the direction is given in Table 4 ("Flag if margin is below").
  still_must_hold: >-
    Holds. (1)–(5) are in §4 and Table 4. (6) is F1 plus the candidate set and tie rule. (7) "chosen by
    inspecting class means on the full data, a leak …", outside CV. (8) is the fused top-1 score.
made_worse_check: "Not met. No contradiction with other facts. Seed, fold and resample counts are kept."
verified_by: R1
```

### REV-32 / R14 · verified_by R2 (Card #3)

```yaml
item_id: REV-32
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-32)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §2 (l. 087–097) "The NLC2CMD competition (Agarwal et al., 2021) scored each prediction by utility and flag overlap, weighted by the confidence the system submitted, so confident wrong answers were penalized; … That metric folds confidence into one accuracy-like score; it does not separate calibration, the ranking of errors and out-of-scope rejection, which we measure separately."'
  - 'text: §2 (l. 102–104) "Project CLAI (Agarwal et al., 2020) treats the command line as an environment for AI agents."'
change_summary: >-
  Adds a sentence contrasting NLC2CMD's single confidence-weighted score with this paper's separate
  measurement of calibration (ECE), error ranking (AURC/AUGRC, correctness AUROC) and out-of-scope
  rejection.
pass_condition_check:
  P1_contrast: >-
    Met. It says what each measures differently (one folded score vs separate calibration, ranking and
    rejection), close to the pre-committed example.
  still_must_hold: holds (confidence-weighted description; CLAI cited and in References)
made_worse_check: "Not met."
verified_by: R2
```

### REV-40 / R15 · verified_by R3 (Card #4)

```yaml
item_id: REV-40
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-40 P1–P2)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §5 Recalibration (l. 323–328) "The maps are fit on benchmark queries written by the authors and an AI agent, so they hold for queries like these; a deployed calibrator would be fit on all labeled queries, and whether its map transfers to real user queries is untested."'
  - 'text: §6 (l. 433–437) "standard recalibration on held-out labels repairs most of it on our benchmark (a result outside the corrected family); on queries like these, the number a user sees can become informative without changing the retriever."'
  - 'text: §7 (l. 457–460) "shows its users a confidence that, on our benchmark, is no better than a constant forecaster. On the same benchmark, post-hoc recalibration fixes most of that."'
  - 'text: Limitations (l. 485–488) "Queries were written by the authors and an AI agent, not collected from users, so calibration and out-of-scope rates depend on this mix."'
change_summary: >-
  Adds the deployed-calibrator data statement: all labelled queries, with transfer to real user
  queries untested. Scopes the Discussion's recalibration sentence and the Conclusion's opening to
  "our benchmark" and "queries like these".
pass_condition_check:
  P1_deployed_calibrator_data: >-
    Met. It names the data ("all labeled queries") and states the open problem (transfer untested). The
    phrase "all labeled queries" is slightly ambiguous between the benchmark's labelled queries and
    labelled user queries, but either reading names a labelled fitting set.
  P2_scope_at_every_claim_locus: >-
    Met.
    - Results "The shipped confidence" paragraph: named benchmark versions ("all 150 v0.1 queries",
      "on v0.1 … v0.2").
    - Recalibration paragraph: "queries like these".
    - "What the hybrid adds" paragraph: calibration clause with "on both versions".
    - Discussion: "on our benchmark".
    - Conclusion: "on our benchmark", "On the same benchmark".
  still_must_hold: >-
    Holds. (a) No user-benefit attribution: §6 says "Whether a better-calibrated number changes what
    users run is untested". (c) The Limitations sentence is present.
made_worse_check: >-
  Not met. No deployment-generalisation claim. The Split B attenuation stays disclosed (§5 "weakens
  calibration somewhat (Appendix B)"; Table 7).
verified_by: R3
```

### REV-49 / R17 · verified_by EIC (Card #1; DA-only; competence caveat)

```yaml
item_id: REV-49
obligation_class: must_fix
applied_criterion: precommitted (phase1 round3 REV-49, route A; both_routes applied as written, see DN-1)
verdict: FULLY_ADDRESSED
evidence_anchor:
  - 'text: §5 (l. 336–339) "The shipped score itself separates out-of-scope requests better than the hybrid’s fused score (pooled AUROC 0.956 vs. 0.889 on v0.2, 0.939 vs. 0.837 on v0.1)"'
  - 'text: §5 (l. 344–351) "The two tuned rules thus sit at different operating points. Compared at equal false-rejection counts, with each score’s threshold picked on the same data (an in-sample, descriptive comparison), the shipped score rejects 37 of 50 at 10 false rejections and the hybrid’s feature 36 at 11; with no false rejections, 23 and 21 (v0.1: 10 and 7 at 6; 5 and 1 at none)."'
  - 'table: Table 1 rows "False rejections of in-scope: fixed / tuned / hybrid  0 / 9 / 6 of 110  0 / 20 / 11 of 134" and "Out-of-scope AUROC (pooled): shipped score minus hybrid feature  +.102 [.006, .222]  +.067 [.015, .127]"'
  - 'text: Limitations (l. 491–493) "the equal-false-rejection comparison (whose thresholds are chosen in-sample)"'
  - 'absence: whole manuscript — "matched" as a description of a comparison (the only hits are QuoteBench''s "matched execution scores" in §2 and the reference title)'
change_summary: >-
  States that the two tuned rules sit at different operating points. Adds an in-sample comparison at
  equal false-rejection counts on both versions (0 FR on both; 6 FR on v0.1) plus a near-equal point
  (10 vs 11 FR on v0.2). Removes "matched operating points" from the Contribution list and the
  Limitations. Gives the false-rejection cost at the Abstract, Contribution (2), Results, Discussion
  and Conclusion.
pass_condition_check:
  route_A:
    a_baseline_AUROC: met (pooled 0.939/0.956; difference with CI in Table 1)
    b_baseline_false_rejections: met (fixed 0/0; tuned 9/110 and 20/134)
    c_equal_FR_comparison: >-
      Met on the same (non-control) population on both versions: v0.2 at 0 FR (23 vs 21); v0.1 at 6 FR
      (10 vs 7) and 0 FR (5 vs 1). The v0.2 10-vs-11 point is also reported, but it is not at equal
      counts.
  route_B_informational: >-
    Largely met as well. The cost is given at the Abstract ("20 of 134"), Contribution (2) ("at a cost
    in refused in-scope queries"), §5, §6 and §7.
  both_routes: >-
    Holds as written: "matched" is not used. Observation (DN-1; recorded as NEW-10): Table 1 labels a
    row "at equal false rejections", but its v0.2 cell shows "37 / 36 at 10–11", which is not an equal
    count.
competence_note: >-
  Statistical adequacy is flagged for R1-competence review. The equal-FR comparison picks each score's
  threshold in-sample on the evaluation data and carries no interval or test. It is labelled
  "descriptive" and "in-sample" (Table 1, §5, Limitations). EIC checked presence and internal
  consistency only.
made_worse_check: >-
  Not met. There is no "at no cost" wording; the false-rejection cost is added, not removed. The
  Discussion's "did at least as well as the hybrid detector at equal false-rejection counts" is
  supported by the equal-count points.
verified_by: EIC
```

---

## 3. should_fix verdict records (15 scoped; lighter form)

| item | verified_by | verdict | evidence_anchor (M2) | change_summary (vs M1; M0 for MADE_WORSE) | residual_gap / class |
|---|---|---|---|---|---|
| REV-10 | EIC | PARTIALLY_ADDRESSED | `text: Appendix B "Figures 1–5 show accuracy, the reliability diagrams, accuracy by query type, the risk-coverage curves and the ablation; they include the canonical controls."`; `absence: pp. 1–6 (main text) — no figure; all figures on pp. 10–12`; `text: §5 "Grouping folds by intent leaves accuracy unchanged and weakens calibration somewhat (Appendix B)."` | Unchanged from M1. Split B is in the appendix (Table 7) with a one-sentence main-text summary (met). No reliability diagram or risk-coverage figure is in the main text, although the body ends on p. 6 of 8. Non-gating: the figures include controls, while Table 1 does not (population differs from REV-02's). | Move one reliability diagram or risk-coverage figure into the main text / should_fix (unchanged Round-2 residual) |
| REV-18 | R1 | NOT_ADDRESSED | `text: §4 "effects paired percentile bootstraps (10,000 resamples, seed 42), which are not dual to the exact test"` | No dual interval, no mid-p or unconditional sensitivity test, and no sentence on whether the v0.2 accuracy verdict depends on the method. Unchanged. | — |
| REV-19 | R1 | FULLY_ADDRESSED | `text: Abstract "isotonic recalibration cuts the shipped confidence’s expected calibration error by 79% on both versions, to about the noise floor of a calibrated forecaster (outside our corrected test family)"`; `text: §6 "repairs most of it on our benchmark (a result outside the corrected family)"` | The shipped-baseline headline is now labelled "outside the corrected family" in the same sentence at both loci. | — |
| REV-20 | R1 | FULLY_ADDRESSED | `table: Table 5 "v0.1 Calib. ECE reduction ≤0.0001 ≤0.0004"`, `"v0.2 Calib. ECE reduction ≤0.0001 ≤0.0003"`; caption "Accuracy and out-of-scope p are two-sided exact McNemar; the calibration p is a one-sided bootstrap bound."; `text: §5 "(two-sided exact McNemar, Holm-adjusted p = 0.00006)"`; `table: Table 1` (no bootstrap p printed) | Table 1 no longer prints the bootstrap p as an equality. Every bootstrap p and its Holm value in Table 5 is a ≤ bound. The sidedness of all four family members, including the OOD row, is stated. Holm arithmetic re-derived and consistent (§7). | — |
| REV-21 | R1 | FULLY_ADDRESSED | `text: §3 "The reviewer agreed with all 8 out-of-scope labels (exact 95% interval for the agreement rate [63, 100]%; 7 everyday requests and one far-from-corpus computing task, none a terminal task)"` | Adds the Clopper–Pearson 95% interval for 8/8 (matches the check value [0.631, 1.000]). "Agreed", not "confirmed", in §3 and Limitations. Terminal-task count 0/8. | — |
| REV-22 | R1 | FULLY_ADDRESSED | `text: §5 "the fixed rule, tuned threshold and detector reject 14, 34 and 25 of 34 everyday non-computing requests; 3, 4 and 4 of 5 far-from-corpus computing tasks; 0, 1 and 1 of the one nonsensical request; and 0, 7 and 4 of the 10 terminal tasks the corpus does not cover"` | Baseline (fixed-rule) per-category counts are restored and the tuned threshold is added. All 50 are assigned (34+5+1+10). Columns sum to 17, 46 and 34, matching Table 1. No exclusions. | — |
| REV-23 | R1 | NOT_ADDRESSED | `text: Limitations "Results come from one fold partition (seed 42)."` | Still a single partition seed, stated only as a limitation. | — |
| REV-24 | R1 | FULLY_ADDRESSED | `absence: whole manuscript — "nested" (0 hits)`; `text: Abstract "Under cross-validation on two benchmark versions"`; `text: §1 Contributions "under cross-validation on two benchmark versions"`; `text: §4 "There is no inner split; each query’s hybrid score uses the α chosen for its own fold"` | "Nested" is removed from the Abstract and Contribution (2). The out-of-fold status of the calibrators' training scores follows from the §4 statement (unchanged; credited at Round 2). A different misdescription of the protocol ("tuned on held-out folds", Abstract and Conclusion) is not governed by this pass condition and is recorded as NEW-8. | — |
| REV-29 | R1 | FULLY_ADDRESSED | `text: §5 "Platt scaling and histogram binning, fit on the same folds, give ECEs with overlapping bootstrap intervals (v0.1: 0.087 and 0.101; v0.2: 0.045 and 0.039), but we did not test the differences between calibrators; histogram binning’s ECE is partly measured on the bins it fits, and it has the worst Brier score of the three in every case."`; `absence: Abstract — "Platt scaling and histogram binning do about as well"` | The "so the gain does not depend on the method" inference is removed. The M0 histogram-binning caveat (in-sample bin scoring; worst Brier) is restored, which clears Round 2's MADE_WORSE. Observation (non-gating): the "overlapping" intervals themselves are not printed. | — |
| REV-33 | R2 | NOT_ADDRESSED | `absence: §2, §4, Table 4, References — tool/API retrieval work; DPR; RRF; Bruch et al.; checked every reference entry` | No new references. Dong et al. (2018) and Kamath et al. (2020) were already cited in M1 (Round 2 committed NOT_ADDRESSED with them present); kept for yardstick continuity. | — |
| REV-34 | R2 | PARTIALLY_ADDRESSED | `text: §5 "All hybrid results are for one small encoder (MiniLM) and one fusion rule."` (same paragraph as the ranking and accuracy claims); `absence: Abstract, §1 Contribution (2), §6, §7 — encoder named near the hybrid claims ("ranks its own errors better", "mainly improves how confidence ranks …", "The hybrid’s value lies in ranking its own errors")` | Adds encoder scoping in the Results paragraph that carries the hybrid-over-BM25 and hybrid-over-dense claims. The Abstract, Contribution list, Discussion and Conclusion claims remain unscoped (Limitations scoping is global). No stronger-encoder row. | Scope the hybrid claims at the Abstract, Contribution (2), §6 and §7 to all-MiniLM-L6-v2, or add an encoder sensitivity row / should_fix (Round-2 class; narrowed) |
| REV-37 | R2 | FULLY_ADDRESSED | `text: §3 "every draft was run through both BM25 and dense retrieval: 24 of 30 ambiguous drafts were kept (6 failed the ambiguity or novelty criteria), and all 35 out-of-scope drafts were kept unchanged, their top-1 BM25 score and dense similarity having been checked to be low"`; `text: §3 "Public natural-language-to-Bash benchmarks target Linux commands and do not map onto this Windows corpus, so we did not use them."` | Names the systems used at both check steps (BM25 and dense). Restores the 6/30 ambiguous-draft rejection. The rationale for not using public benchmarks is kept. | — |
| REV-39 | R3 | NOT_ADDRESSED | `text: §6 "a trade-off that should be set by the relative cost of a wrong command and a refusal"`; `text: Appendix B "but A5 is lower on v0.2 (82.2% at 58.9%), which we did not analyze further"` | No operating point with an explicit cost of harm. A5's v0.2 decline is still unanalysed. No baseline at matched coverage (the equal-FR comparison concerns OOD rejection, not selective-prediction coverage). | — |
| REV-43 | R3 | PARTIALLY_ADDRESSED | `text: §6 "the risky wrong answers suggest safeguards independent of calibration: showing the risk level and asking for confirmation (PowerShell’s -Confirm) or offering a dry run (-WhatIf) before destructive commands, or requiring higher confidence before returning a high-risk command. We did not evaluate any of these."`; `text: Ethical Considerations "recommend that such tools show a risk level and require explicit confirmation for high-risk commands"` | Adds `-Confirm`. Raises a risk-dependent threshold ("requiring higher confidence before returning a high-risk command"), presented as a suggested safeguard, which counts as adoption as a recommendation. Still does not name "no automatic execution" as a safeguard. | Name no-automatic-execution among the safeguards / consider (re-graded: the only remaining gap is naming a property the tool already has, per §3) |
| REV-50 | EIC | FULLY_ADDRESSED | `text: §5 "(The detector’s gain over the fixed rule on the same 15 queries has p = 0.25 in the v0.1 run and p = 0.0625 in the v0.2 run, because each run tunes its own thresholds; neither is significant, and the second is not a replication.)"` | Gives the reason (each run tunes its own thresholds) and an explicit implication for the v0.2 result on those items (not significant; not a replication of the v0.1 result). Consistency: 3–0 and 5–0 discordance give exactly 0.25 and 0.0625 (7 vs 4; 9 vs 4). The unlabelled use of v0.2-run subset counts at the Abstract and Conclusion, against Table 1's v0.1 counts, is not governed by this pass condition and is recorded as NEW-9. | — |

---

## 4. NEW-1 to NEW-7 (frozen Round-2 records) · verified_by EIC

| # | Frozen attribution / severity | Status | Evidence (M2) | Note |
|---|---|---|---|---|
| NEW-1 (→ REV-PM-1) | previously_missed / major; decision-inert | **NOT_RESOLVED** | `text: §4 "The features for the hybrid’s out-of-scope and ambiguity detectors were chosen by inspecting class means on the full data, a leak that may flatter the detector’s figures; the tuned shipped threshold uses the tool’s own score and needed no such choice."`; `text: Limitations "the hybrid detector’s features were chosen on the full data, which may flatter it."` | Improved. Route (B)(1) is met (class means, full data, hence outside CV) and (B)(2) is met ("may flatter"). (B)(3) is not met: no list of affected results (OOD rejection and AUROC, the Holm OOD rows, ambiguity F1/AUROC, A4/A5) and no statement that no bound is given. "The detector's figures" is generic. No sensitivity analysis (route A). R1 competence note: the leak inflates only the hybrid feature, so the shipped-minus-hybrid AUROC and threshold-vs-detector conclusions stay conservative. |
| NEW-2 | regression / minor | **RESOLVED** | `table: Table 1 "Shipped confidence: Brier skill vs. no-skill, raw / recalibrated … raw: no skill; recal.: robust"` | The raw half, whose intervals include zero ([−.45, .01], [−.26, .15]), is relabelled; the recalibrated half ([.04, .36], [.19, .46]) is "robust" under the caption's definition. Every other "robust" row was re-checked; all intervals exclude zero on both versions. "Weak on v0.2" correctly marks [−.001, .118]. |
| NEW-3 | regression / minor | **RESOLVED** | `table: Table 1 "Hybrid minus shipped AUGRC (tie-aware)  −.048 [−.073, −.024]  −.030 [−.050, −.011]  robust"`; `text: §5 "tie-aware AURC and AUGRC are lower on both versions with intervals excluding zero (Table 1)"` | AUGRC values with intervals are now in the table the text cites. Every table pointer in §3–§7 and Appendix B was checked; none cites a quantity absent from the target. REV-26 still holds (§5). |
| NEW-4 | regression / minor | **RESOLVED** | `text: §3 "Two items have gold commands outside the Windows corpus (Q145, and Q187 in v0.2 only), and one (Q149) has an acceptable command outside it; every system misses the first two and answers Q149 correctly, so they lower every system’s non-OOD accuracy by one query on v0.1 and two on v0.2"`; `text: Limitations "Two items have gold commands outside the corpus and one an acceptable command."` | Consistent with M0's facts. The count agrees with the effect (Q187 is v0.2-only → 1 on v0.1, 2 on v0.2). No locus says three. |
| NEW-5 | regression / minor | **RESOLVED** | `text: §5 "(pooled AUROC 0.956 vs. 0.889 on v0.2, 0.939 vs. 0.837 on v0.1)"`; `table: Table 1 "Out-of-scope AUROC (pooled)"`; `table: Table 7 caption "AUROC values are means over folds."`; `text: Appendix B "This table includes the controls and reports OOD AUROC as a mean over folds, so its values (0.867, 0.901) differ from the pooled, non-control values in §5."` | Every hybrid OOD AUROC value is labelled (pooled vs fold-mean, and population). The Table 1 differences are consistent with the §5 pooled values: 0.939 − 0.837 = .102; 0.956 − 0.889 = .067. The values changed from M1 (0.855/0.900) because the population changed to non-control, and that is labelled. |
| NEW-6 | regression / minor | **RESOLVED** | `text: §1 "a small lexical retriever runs offline and deterministically, so queries need not leave the user’s machine and every answer is a record from a fixed list that can be inspected; the price is coverage."` | "Vetted" is removed ("can be inspected" is consistent with "checked by script"). "No query leaves" becomes "need not leave", consistent with the off-by-default query-sync. REV-47's positive case remains. |
| NEW-7 | regression / minor | **RESOLVED** | `text: §3 "Cohen’s κ = 0.63 (Cohen, 1960) (post hoc bootstrap 95% interval [0.39, 1.00]), below our 0.7 target"`; `text: Limitations "(κ = 0.63, interval [0.39, 1.00], n = 14)"` | The interval is in the same sentence at the benchmark locus, and it is carried with n into Limitations. |

---

## 5. Regression guard (15 items FULLY at Round 2)

| Item | Seat | Status | Evidence (M2) | Check |
|---|---|---|---|---|
| REV-04 (must_fix) | EIC | **HOLDS** | `text: Abstract` (l. 002–029): 196 whitespace tokens, counted on `content.tex` `\begin{abstract}…\end{abstract}` (Round-1 F1 method; M1 had 172); `text: Abstract "All analyses are exploratory; a two-annotator label study is under way."` | ≤ 200, with 4 tokens to spare. There is exactly one exploratory-status sentence. "(outside our corrected test family)" is a multiplicity label, not a second exploratory sentence. |
| REV-07 (must_fix) | R2 | **HOLDS** | `text: §2 "one entry used TF-IDF retrieval with a logistic-regression model …"`; `"ShellFusion (Zhang et al., 2022) retrieves commands …"`; `"DocPrompting (Zhou et al., 2023) retrieves documentation …"`; `"Project CLAI (Agarwal et al., 2020) …"`; `text: §2 "natural-language-to-shell retrieval work has not evaluated the calibration of a deployed tool’s confidence …"`; `text: §1 "Retrieval over a fixed command list is an older alternative that NLC2CMD also tested (Agarwal et al., 2021) and ShellFusion developed (Zhang et al., 2022)."` | All four are cited, all in References, the gap is restated, and §1 acknowledges retrieval. The descriptions are unchanged apart from REV-32's added contrast. |
| REV-09 (must_fix) | EIC | **HOLDS** | `text: §3 "the versions share their 121 answerable queries"`; `table: Table 6 "answerable only 121"`; `text: Appendix B "p = 0.227 on answerable queries only"`; `text: §7 "add answerable and terminal-task out-of-scope queries"`; `table: Table 1 caption "110 and 134 in-scope queries"`; `text: §5 "67.3% of all 150 v0.1 queries correctly (65.5% of the non-control in-scope ones, Table 2)"` | "Answerable" is used only for the 121-set or the query class. The 135/159 sets are "non-OOD" (with a controls qualifier), and 110/134 are "in-scope"/"non-control". Headline percentages name their population. 67.3% = 101/150 = (72 + 25 + 4)/150, so the 49 wrong answers are consistent. |
| REV-26 (must_fix) | R1 | **HOLDS** | `table: Table 1 rows AURC, AUGRC, correctness AUROC, each with 95% intervals`; `text: §6 "The hybrid’s value lies in ranking its own errors"`; `text: §7 "The hybrid mainly improves how confidence ranks its own errors."` | The Discussion and Conclusion name no metric without an interval, and the claim rests on the interval-bearing Table 1 rows. |
| REV-42 (must_fix) | R3 | **HOLDS** | `table: Table 3` (Shipped/Hybrid × v0.1/v0.2; caption "Returned commands the rule-based classifier rates high or critical risk … maximum confidence band (shipped: 100%; hybrid: fused score 1.0)")` | Both systems are present, with the risk source (rule-based classifier) and band edges (high/critical; the max-confidence band). Answered counts are consistent (146 = 150 − 4; 192 = 209 − 17). |
| REV-05 | EIC | **HOLDS** | `text: §5 "A heuristic score such as s/8 capped at 100% is not expected to be calibrated; what the audit adds is how far off it is, and that the tool shows it to users as a percentage."` | Unchanged. |
| REV-08 | EIC | **HOLDS** | `text: §2 "We run no generative system, so our comparison with generation is conceptual."`; `text: §1 RQ` (no comparative clause) | Unchanged. |
| REV-27 | R1 | **HOLDS** | `text: §5 "On the 15 benchmark queries whose gold commands can run safely in a sandbox, all gold commands and 14 of 15 hybrid answers executed successfully."` | "Validates benchmark quality" is absent. |
| REV-28 | R1 | **HOLDS** | `text: §5 "(gold commands of all non-OOD queries with a gold command: 125 in v0.1): it flags 19 of 20 high- or critical-risk commands in v0.1"` | Unchanged. The Wilson interval for 1/20 of [0.9, 23.6]% is consistent. |
| REV-35 | R2 | **HOLDS** | `text: §3 "OOD (15; here, out-of-scope requests that no record serves)"`; `text: §5 kind-of-request breakdown`; `text: Abstract "closed-set alternative"` | Unchanged. |
| REV-38 | R2 | **HOLDS** | `text: References "Finnian Westenfelder, Erik Hemberg, Miguel Tulla, Stephen Moskal, Una-May O’Reilly, and Silviu Chiricescu. 2025."`; `text: References "QuoteBench … Preprint, arXiv:2608.13547"`; `"Project CLAI … Preprint, arXiv:2002.00762"` | The six-author list is kept under ADJ-1. The human spot-check of the PDF author line is still pending, so this is carried to the checkpoint. The 2026 preprint is marked. BashCoder-R1 is now cited as ISSTA 2026 proceedings. |
| REV-45 | R3 | **HOLDS** | `text: Abstract "a BM25 retriever over 279 Windows commands"` | Unchanged. |
| REV-46 | R3 | **HOLDS** | `text: Ethical Considerations "This study does not change the published package, so its findings apply to current users."` | Survives anonymization; no name or pointer. |
| REV-47 | R3 | **HOLDS** | `text: §1 "It cannot invent a command, and a small lexical retriever runs offline and deterministically, so queries need not leave the user’s machine and every answer is a record from a fixed list that can be inspected; the price is coverage."` | A positive case remains after the NEW-6 qualification, and the coverage loss is stated. |
| REV-48 | R3 | **HOLDS** | `text: §5 (l. 423) "git checkout -- ., which discards uncommitted work"`; `text: Abstract` (one contiguous left-column block, l. 002–029, p. 1) | The safety example is correct. The Abstract is not split by a page. Column interleaving in the extraction is an artefact (CANNOT_VERIFY does not arise, since the PDF page is single). "LLM" appears only in §1 ("large language model (LLM) systems") and §2 ("LLM translation"); there is no repeated "no LLM". |

---

## 6. Newly discovered issues (Round 3; NewIssueRecords frozen at `[EVIDENCE-COMMITTED]`)

**Attribution rule** (Phase 1 §2):
- `regression`: absent from M1, present in M2.
- `previously_missed`: present in M1 and not recorded at Round 2.

A defect that an item's pre-committed pass condition tests is that item's verdict, not a new issue. A defect that no pass condition tests gets a record with `nearest_roadmap_item` and a typed `non_match_rationale`, as Round 2 did for NEW-2 to NEW-7. Numbering continues from Round 2 to avoid collisions.

```yaml
- new_issue_id: NEW-8
  description: >-
    The Abstract and the Conclusion say that the shipped-score rejection threshold was "tuned on
    held-out folds". §4 says that the thresholds are "chosen on the other four folds and applied once"
    to the held-out fold. The headline phrase therefore describes tuning on the evaluation data, which
    would be leakage, or at best is an ambiguous stand-in for "cross-validated". A reader of the Abstract
    alone cannot tell that the 46/50 figure is out-of-fold.
  location_anchor: 'text: Abstract (l. 016–017) "A rejection threshold on the shipped score, tuned on held-out folds, rejects 46 of 50"; text: §7 (l. 460–462) "A threshold on the shipped score, tuned on held-out folds, rejects more out-of-scope requests"'
  severity: minor
  found_by: R1
  confidence: 4
  competence_basis: Card #2 focus 3 (tuning leakage; description of the CV protocol)
  attribution: regression
  attribution_evidence: >-
    The patch adds "tuned on held-out folds" to the Abstract hunk and the Conclusion hunk. M1's Abstract
    reads "A tuned rejection threshold on the shipped score rejects 46 of 50", and M1's Conclusion
    reads "a tuned threshold on the shipped score handles out-of-scope requests"; neither says
    "held-out".
  nearest_roadmap_item: REV-24
  non_match_rationale: >-
    REV-24's pre-committed pass condition tests the word "nested" and the calibrator-score statement,
    and both are met. It does not test where threshold tuning is said to occur. (The Discussion's
    "recalibration on held-out labels" is M1 wording, is ambiguous in the same way, and is noted here
    without a separate record.)
  pass_condition_next_round: >-
    At every locus that describes how the thresholds or calibrators were tuned, the wording agrees with
    §4: tuned on the development folds and evaluated on the held-out fold (for example "tuned by
    cross-validation" or "tuned on training folds").

- new_issue_id: NEW-9
  description: >-
    The same 15 original out-of-scope items are given two unlabelled sets of rejection counts.
    Table 1's v0.1 column reads "4 / 10 / 7 of 15" (fixed / tuned / detector). The Abstract ("on the 15
    original ones the threshold rejects 12 and the detector 9") and the Conclusion ("12 vs. 9 on the 15
    not screened by retrieval score") give the v0.2-run counts. Neither says which run they come from.
    The v0.2 run's thresholds were fitted on folds that contain the 35 score-screened items, and its
    tuned thresholds (6.50–7.20) sit just below the screening maximum. So the headline "unscreened"
    figures are not free of the screening's influence on tuning. The v0.1-run counts (10 vs 7) would
    be. Both runs show the same ordering, so no conclusion flips, but the two sets of counts conflict on
    their face.
  location_anchor: 'text: Abstract (l. 023–024) "on the 15 original ones the threshold rejects 12 and the detector 9"; text: §7 (l. 463–464) "12 vs. 9 on the 15 not screened by retrieval score"; table: Table 1 row "Out-of-scope rejected: fixed rule / tuned threshold / hybrid detector" v0.1 "4 / 10 / 7 of 15"'
  severity: minor
  found_by: EIC
  confidence: 4
  competence_basis: Card #1 focus 3 (can the main result be read from the abstract and one table without reconciling parallel views)
  attribution: regression
  attribution_evidence: >-
    The 12/9 counts are new in M2 (patch: Abstract, §5 and Conclusion hunks). M1 reported no
    tuned-threshold count on the 15 in the v0.2 run and put no subset counts in the Abstract or
    Conclusion.
  nearest_roadmap_item: REV-50 (also REV-03)
  non_match_rationale: >-
    REV-50 tests the §5 explanation of why the two runs' p-values differ, and it is met. REV-03 P2 tests
    whether unscreened-subset numbers are present at the loci, not which run they come from or whether
    they agree with Table 1.
  pass_condition_next_round: >-
    Wherever counts on the 15 original items are stated, the run is named (the v0.1 run, or the v0.2
    run with thresholds tuned on folds that include the added items), or the headline uses the v0.1-run
    counts. No two unlabelled counts are given for the same items and rule.

- new_issue_id: NEW-10
  description: >-
    Table 1's row "Out-of-scope rejected at equal false rejections, shipped score / hybrid feature
    (in-sample)" shows "37 / 36 at 10–11" for v0.2. According to §5, that is 37 at 10 false rejections
    against 36 at 11, which is not equal. The v0.2 point that is actually equal (0 false rejections:
    23 vs 21) appears only in the text. The Discussion then generalises the in-sample feature
    comparison to "the hybrid detector" ("did at least as well as the hybrid detector at equal
    false-rejection counts"). But that comparison was made with the hybrid's feature under in-sample
    thresholds, not with the cross-validated detector.
  location_anchor: 'table: Table 1 row "Out-of-scope rejected at equal false rejections …" v0.2 "37 / 36 at 10–11"; text: §5 (l. 348–349) "the shipped score rejects 37 of 50 at 10 false rejections and the hybrid’s feature 36 at 11"; text: §6 (l. 440–443)'
  severity: minor
  found_by: R1
  confidence: 5
  competence_basis: Card #2 focus 1 (whether the stated comparison matches the reported numbers)
  attribution: regression
  attribution_evidence: "The Table 1 row and the §5 equal-false-rejection sentences are new in M2 (patch: the tab:claims and sec:ood hunks); M1 had no such row."
  nearest_roadmap_item: REV-49
  non_match_rationale: >-
    REV-49's both_routes clause as pre-committed tests the word "matched" (DN-1), and route A (c) is met
    by the exactly-equal points in §5. The mislabelled cell and the detector/feature conflation are not
    tested by the written condition.
  pass_condition_next_round: >-
    Every table cell or sentence labelled "equal false rejections" reports a point at equal counts
    (for v0.2, the 0-FR point or another exactly-equal point), or the label says "near-equal" and gives
    both counts. The Discussion names the compared object as the hybrid's feature (in-sample), not the
    detector.

- new_issue_id: NEW-11
  description: >-
    The Holm table labels the out-of-scope family member "OOD rej., tuned vs. base", and its caption
    explains that this means "the hybrid detector against the shipped fixed rule". Everywhere else in
    the paper, "tuned threshold" and "tuned shipped threshold" mean the threshold on the shipped score s.
    The same caption says that threshold is "not in this family". A reader following the paper's
    vocabulary will read the row as the tuned shipped threshold.
  location_anchor: 'table: Table 5 rows "v0.1 OOD rej., tuned vs. base 0.25 0.2920 No", "v0.2 OOD rej., tuned vs. base 0.000015 0.00006 Yes"; caption "“OOD rej., tuned vs. base” is the hybrid detector against the shipped fixed rule. … The shipped-confidence recalibration and the tuned shipped threshold are not in this family."'
  severity: minor
  found_by: EIC
  confidence: 5
  competence_basis: Card #1 focus 3 (terminology consistency across tables)
  attribution: previously_missed
  attribution_evidence: >-
    M1 Table 5 has the identical row label and caption sentence ("“OOD rej., tuned vs. base” is the
    hybrid detector against the shipped fixed rule"), and M1 already used "tuned threshold on the
    shipped score" in its Abstract and §5. Round 2 did not record it.
  nearest_roadmap_item: REV-20
  non_match_rationale: "REV-20 tests p-value bounds and sidedness in the Holm table, not row labels."
  pass_condition_next_round: 'The Holm-table row is labelled with the compared objects, for example "OOD rej., hybrid detector vs. fixed rule".'

- new_issue_id: NEW-12
  description: >-
    The ablation configurations A1 and A6 are never defined. Figure 5 is captioned "Ablation A0–A6".
    The figures' labels define A0 (BM25), A2 (dense) and A3 (hybrid), and Table 4 and Appendix B define
    A4 and A5. A1 and A6 are plotted (A6 = 90.1% and 82.2%, equal to A5) without a definition.
  location_anchor: 'text: Figure 5 caption "Ablation A0–A6. A0–A3: accuracy on all non-OOD queries (pooled). A4–A6: selective accuracy …"; absence: §4, Table 4, Appendix B — definition of A1 and A6'
  severity: minor
  found_by: EIC
  confidence: 5
  competence_basis: Card #1 (undefined terms in reported results)
  attribution: previously_missed
  attribution_evidence: "M1 has the same Figure 5 caption and the same A4/A5-only definitions; content.tex contains no definition of A1 or A6."
  nearest_roadmap_item: none (closest by locus REV-10, figure placement)
  non_match_rationale: "No roadmap item governs the definition of the ablation configurations."
  pass_condition_next_round: "A1 and A6 are defined (for example in Table 4 or the Appendix B ablation paragraph), or removed from Figure 5."
```

**New-issue tally.**
- regression: 3, all minor (NEW-8, 9, 10).
- previously_missed: 2, both minor (NEW-11, 12).
- indeterminate: 0.
- Nothing is critical or major.

**Checked and found clean** (these are not new issues):
- **Anonymization of the review PDF** (text, metadata, links, bookmarks, figures). Advisory observations are carried in the REV-11 record.
- **Page limit.** The body ends on p. 6 of 8.
- **Abstract length.** 196 ≤ 200.
- **Overclaiming wording.**
  - The Contribution list, Discussion and Conclusion claims are each supported by §5 numbers.
  - "The shipped score is never worse at the points we checked" matches the four equal-FR points given.
  - "Most are everyday" (Abstract) matches 34 of 50 everyday.
- **Contradictions between sections.** None beyond NEW-8 to NEW-10.

**Mismatches folded into roadmap items** (traceable; the goalpost guard applies):
- Table 3's population differs from Table 1's → REV-02.
- The repeated "outside the corrected family" caveat (§4/§5/§6) → REV-02 P3.
- No equal-mass or sweep ECE for the hybrid → REV-15.
- The fixed-rule count on the 15 is missing at the Abstract → REV-03.
- No main-text figure → REV-10.
- Unscoped hybrid claims at the Abstract, Contribution list, §6 and §7 → REV-34.
- "No automatic execution" not named → REV-43.

**Numbers checked and internally consistent** (internal only; result files withheld):

- **Population arithmetic**
  - v0.1 labels 119+14+15+2 = 150; answerable 121 = 119+2.
  - Non-OOD 135 = 150−15; in-scope non-control 110 = 135−25.
  - v0.2 209 = 150+35+24; non-OOD 159; in-scope 134.
- **Table 2 and Figure 1**
  - Table 2: 72/110 = 65.5; 73/110 = 66.4; 79/110 = 71.8; 95/134 = 70.9; 90/134 = 67.2; 101/134 = 75.4.
  - Figure 1 (controls included): 97/135 = 71.9; 98/135 = 72.6; 104/135 = 77.0; 120/159 = 75.5; 115/159 = 72.3; 126/159 = 79.2. Table 7: 104/135 and 126/159.
- **Accuracy deltas**
  - +6.4 = 7/110; +4.5 = 6/134; +5.5 = 6/110; +8.2 = 11/134.
- **Overall accuracy and wrong answers**
  - 67.3% = 101/150 = (72 non-control hits + 25 controls + 4 fixed-rule OOD rejections)/150; 49 wrong.
  - 44.9% = 22/49.
- **Calibration**
  - ECE reductions: .323 → .069 = 78.6%; .293 → .063 = 78.5%; .329 → .108 = 67.2%; .368 → .071 = 80.7%.
  - "Five to six times" the noise floor: 5.05×, 5.86×.
  - Post-calibration values below the 95th percentiles: .069 < .105; .063 < .080; equal-mass .110 < .122; .070 < .092; hybrid .108 > .089 (stated "above"), .071 < .079 (stated "within").
  - "About the noise floor" (Abstract) is consistent with these.
- **Out-of-scope counts**
  - Table 1 AUROC differences: .939 − .837 = .102; .956 − .889 = .067.
  - Subset sums: 4+13 = 17; 12+34 = 46; 9+25 = 34.
  - Kind-of-request partition: 34+5+1+10 = 50; column sums 17/46/34.
  - False rejections: Abstract "20 of 134", "none", "11" = Table 1 = §5 = Conclusion.
- **Test statistics**
  - McNemar exact values: 2·2⁻⁷ = .0156 (7–0); 7–1 of 8 → .0703; 3–0 → .25; 5–0 → .0625; 17–0 → 1.5e-5.
  - Holm re-derived: v0.2 OOD rank 1 → 4 × .000015 = .00006; calibration rank 2 → ≤ .0003; dense 2 × .0127 = .0254; BM25 .0703. v0.1: calibration ≤ .0004; BM25 3 × .0156 = .0469; dense 2 × .146 = .292; OOD max(.25, .292) = .292.
- **Table 3**
  - Answered = total − fixed-rule rejections (146, 192).
  - Six hybrid wrong high-risk answers on v0.2, of which 3 are blocked, including 2 out-of-scope.
- **Other checks**
  - Bare-keyword n: 126 = 135 − 9; 142 = 159 − 17; 133 = 159 − 26.
  - Ambiguous drafts: 24 + 6 = 30.
  - Clopper–Pearson 8/8: [63, 100]%. Wilson 1/20: [0.9, 23.6]%.
  - Tuned thresholds: 6.50–7.20 in §5 = Table 4.
  - Split B note: 0.867/0.901 (fold-mean, controls included) vs pooled non-control §5 values, labelled.

---

## 7. Summary

- **Gate and yardstick.**
  - `[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`.
  - The criteria hash matches (`5e5facd7…0423`). Every verdict applies its pre-committed pass condition as written.
  - No protocol DissentRecord and no escalation exception. Three informational dissent notes: DN-1 (REV-49 "matched"), DN-2 (REV-02 P3 locus collisions) and DN-3 (REV-12 title scope).
- **must_fix (17).**
  - FULLY 14: REV-01, 06, 11, 12, 14, 16, 32, 40, 49, plus guard items REV-04, 07, 09, 26, 42 (all HOLD).
  - PARTIALLY 3:
    - REV-02: residual should_fix (Table 3 population; repeated multiplicity caveat).
    - REV-03: residual consider (fixed-rule 4/15 missing at the Abstract).
    - REV-15: residual should_fix (no equal-mass or sweep ECE for the hybrid).
  - NOT 0, MADE_WORSE 0, CANNOT_VERIFY 0.
  - No must_fix residual is graded must_fix. REV-03 is no longer MADE_WORSE, and REV-11 is now FULLY.
- **should_fix (25).**
  - FULLY 18: REV-19, 20, 21, 22, 24, 29, 37, 50, plus 10 guard items, all HOLD.
  - PARTIALLY 3: REV-10 (should_fix), REV-34 (should_fix), REV-43 (consider).
  - NOT_ADDRESSED 4: REV-18, 23, 33, 39.
  - MADE_WORSE 0; REV-29 is cleared.
  - **Informational addressed rate: 21/25 = 84%** (Round 2: 76%).
- **Round-2 NEW records.**
  - NEW-2 to NEW-7 are all RESOLVED.
  - NEW-1 is NOT_RESOLVED: route B parts (1) and (2) are met, part (3) (the list of affected results and the no-bound statement) is missing. It is decision-inert and becomes REV-PM-1 if the decision is Major.
  - None WORSENED.
- **Regression guard.** 15/15 HOLD.
- **New Round-3 issues.**
  - NEW-8: "tuned on held-out folds" at the Abstract and Conclusion. regression, minor.
  - NEW-9: unlabelled v0.2-run 15-subset counts (12/9) vs Table 1's v0.1 counts (10/7). regression, minor.
  - NEW-10: the "equal false rejections" row shows 10 vs 11 on v0.2, and the Discussion says "detector" for an in-sample feature comparison. regression, minor.
  - NEW-11: Holm-table label "tuned vs. base" names the detector. previously_missed, minor.
  - NEW-12: A1 and A6 undefined. previously_missed, minor.
- **Human-checkpoint carries (non-gating).**
  - REV-11: registry lookup risk from the §1 authorship sentence plus the §3 specifications. Source files (`main.tex`, `content.tex` and `main_review.tex` comments) would de-anonymize if uploaded. The rendered PDF is clean.
  - REV-38: the NL2SH author-line spot-check is still pending.
  - REV-12 / DN-3: whether the version-of-record title includes the "with Robustness-Aware…" clause.
- **consider items** (`applied_criterion: not_precommitted`, decision-inert, EIC). Assessed briefly for completeness:

  | Verdict | Items |
  |---|---|
  | FULLY | REV-41, REV-51 |
  | PARTIALLY | REV-13 (Zadrozny order and Table 6 layout unchanged); REV-25 (adds a qualitative power sentence citing Card et al., but no MDE); REV-31 (the Table 1 bound is moot now the p is removed; the Table 6 answerable row and Figure 4 are unchanged); REV-54 |
  | NOT_ADDRESSED | REV-17 (artifacts withheld, no anonymized link); REV-30; REV-36; REV-44; REV-52 (the anchor disclosure on v0.1's un-re-annotated ambiguous labels is still absent); REV-53 |

- **Attestation exceptions** (§0). The git-status snapshot exposed commit subjects. The patch carries author comments (log filename, "author decision … reversing D3/D7", the bib's ISSTA-check claim). One grep line came from `review_round1/author_verification.md`. Harness-injected CLAUDE.md, AGENTS.md and memory. None affects a verdict.
- **Single-family disclosure.** All seats, the revision driver and this verifier are `claude-opus-5-5`. No cross-model pass is configured, so every must_fix cross-model cell is `not_configured`.
- **No decision is derived at this gate.**

[EVIDENCE-COMMITTED]
