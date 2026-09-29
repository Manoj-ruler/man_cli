# Phase 1: Criteria Commitment (revision-blind), Stage 3' re-review, Round 3 (scoped)

`[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`

## 0. Contract status (stated first, not hidden)

- **Missing machine artifacts.** As at Round 2, none of the four hard-required machine artifacts exists for this LaTeX project:
  - `revision-roadmap/1.0` JSON core;
  - `author-adjudication/1.0` sidecar;
  - `revision-evidence-bundle/1.0`;
  - input manifest 1.1.
- **Consequences.**
  - `input_manifest_hash`: ABSENT. `round_id` (informal, not issued by a dispatching layer): `termassist-t14-rereview-round-3`.
  - `scripts/check_re_review_synthesis.py` cannot run. G0 cannot be checked mechanically. No checker result will be claimed at any gate of this round.
  - The three gates are run by hand: Phase 1 (this file), then Phase 2A, then Phase 2B. SHA-256 binding of every input substitutes for manifest hash binding.
- **Scope.** This is a SCOPED re-review. Records are committed only for the items that were not FULLY_ADDRESSED at Round 2, for the seven frozen Round-2 new-issue records (NEW-1 to NEW-7), and for a regression guard over the items that were FULLY_ADDRESSED at Round 2. The obligation classes, the item set (17 must_fix, 25 should_fix, 12 consider) and the decision rules are unchanged from Round 2.
- **Yardstick continuity.** The Round-1 Reviewer Configuration Cards #1–#4 stay frozen. `field_analyst_agent` is not re-run. No card is regenerated. The Round-2 Phase 1 operationalizations are reused verbatim, by exact reference to `review_round2/phase1_criteria_commitment.md` (SHA-256 `ea0119bc86d16feac793d44e9bad6da95ab92146a0bfd7d8c901573f191d9f41`, which equals the Round-2 `precommitment_hash`). Reviewer-configuration line: `round1_cards_reused`.
- **Criterion layers.** Level 1 (roadmap Revision Item cell, the surrogate for the absent Schema 7 `verification_criteria` field, `[SCHEMA7-VERIFICATION-CRITERIA-FIELD-ABSENT: Markdown roadmap core]`), level 2 (Round-1 letter Acceptance criteria, R1–R17 contiguous), level 3 (Round-1 findings) and level 4 (frozen cards; target venue EACL 2027 SRW long paper) are inherited exactly as recorded at Round 2. The Round-2 verdicts and residuals (`review_round2/phase2b_verification_report.md`) are used as the statement of what remains open. They do not add acceptance requirements: every pass condition below is a concrete, checkable restatement of a clause of the frozen Round-2 operationalization. Where a Round-2 residual phrase goes beyond the frozen clause, it is marked `non-gating`.
- **Single-family disclosure.** All Round-1 seats, the revision driver for Rounds 2 and 3, the Round-2 verifier and this Round-3 verifier are `claude-opus-5-5` (Anthropic). No cross-model pass is configured. The Re-Review Output of this round must carry the protocol's disclosure line verbatim: "This verification round ran on the same model family that drove the revisions; over-optimization to this judge's latent biases is possible (Ren et al. 2026, arXiv:2607.13104 §8.1.2)."

## 1. Inputs read, inputs withheld (revision-blindness attestation)

**Read in full** (SHA-256 computed with `sha256sum` in this call):

| File | SHA-256 |
|---|---|
| `research/paper/review_round2/phase1_criteria_commitment.md` | `ea0119bc86d16feac793d44e9bad6da95ab92146a0bfd7d8c901573f191d9f41` |
| `research/paper/review_round2/phase2b_verification_report.md` | `c20923d8a7d08dfa8f8922d39bde68929a74f41ade94636fe86816982f7ef907` |
| `C:\Users\manoj\.claude\skills\academic-paper-reviewer\references\re_review_mode_protocol.md` | `5e0440c636704015cd84ce3ba8805d871de6427c9122cd8aa8c5e22bc71f1e66` |

**Permitted but not opened:** `review_round1/phase2_editorial_decision.md` and `review_round1/phase0_field_analysis.md`. They were not needed: the Round-2 Phase 1 file carries the verbatim roadmap text, letter Acceptance text, level-3 anchors, routing and card assignment for every item.

**Not opened, not listed:** any file in `review_round3/` (this output file was written directly to its given path without listing the directory); `T21b_REVISION_LOG.md`; any file in `acl_latex/`; `research/results/`; the Round-1 and Round-2 manuscript text files; any other repository file. No `git log`, `git show` or `git diff` was run. The only shell commands run were `wc -l` and `sha256sum` on the five permitted files above, and `sha256sum` on this output after writing.

**Attestation exceptions (disclosed; none changes an operationalization):**

1. **Session context exposure.** The session was started with an automatic git-status snapshot that I did not request. It shows the untracked path `research/paper/review_round3/` and the commit subject `ff36316 paper: T21b revision round 3 - anonymized review version, T22 residuals`. This reveals that the Round-3 revision describes itself as an anonymized review version that addresses the Round-2 residuals. It reveals no manuscript text, section list or number. No pass condition below refers to it. The REV-11 criterion is the Round-1 requirement, which the dispatching layer instructed me to use regardless of the author's earlier decline or current intention.
2. **Dispatch message.** The dispatching layer stated that the author "now intends to anonymize". That is an intention, not evidence. It changes nothing in the REV-11 criterion.
3. **System-injected context.** `CLAUDE.md`, `AGENTS.md` and the memory index (`MEMORY.md`, two one-line entries on paper-integrity rules) were placed in context by the harness. I did not open them, and they contain no revision content.
4. **Prior-round manuscript text.** The Round-2 Phase 2B report quotes the Round-2 revised manuscript (called M1 below). This is prior-round text, not Round-3 revision content. It is used only to state the Round-2 residuals, as the dispatch instructed.

## 2. Conventions

- **Manuscript versions.**
  - **M0** = the Round-1 manuscript (`review_round1/manuscript_review.txt`, SHA-256 `4fafa1af9799931c8fc82946c33a627b67628160c9f511deb1d98d882d0c9f84` as recorded at Round 2). This is the "ORIGINAL" named in every frozen `made_worse_discriminator` and in the generic should_fix MADE_WORSE rule.
  - **M1** = the Round-2 revised manuscript (`review_round2/manuscript_revised.txt`, SHA-256 `49ffed61412472125dda4c05e1ad8487e8979e0825dbb1e7f6101ff4b4fc588f` as recorded at Round 2). This is the pre-revision text for this round.
  - **M2** = the Round-3 revised manuscript (the review version). It is not seen in this phase.
- **Loci by role, not by number.** Section numbers changed between M0 and M1: the Round-2 report maps M0 §9 → M1 §6 (Discussion) and M0 §10 → M1 §7 (Conclusion), and M1 §5 is Results. Numbers may change again. Pass conditions therefore name loci by role: Title, Abstract, §1 RQ, Contribution list, Related Work, Benchmark section, System specification, Results, Discussion, Conclusion, Limitations, Ethical Considerations, Appendix, and the table that plays a stated role (for example "the claims-status table", M1 Table 1). M1 numbers are navigation hints only.
- **`expected_change_surface`** is a navigation hypothesis from Round-2 residual loci. It is not a gate (SD-10). A fix elsewhere that meets the pass condition counts. A cosmetic edit at the expected locus does not count by position alone.
- **`equivalence_policy: allowed`** on every record. An equivalent fix counts. An evidence-backed disagreement goes through the Phase 2A dissent channel or the Phase 2B `valid_rebuttal` channel.
- **Verdict precedence for must_fix items.** If M2 meets the item's frozen `made_worse_discriminator` relative to M0, the verdict is MADE_WORSE, whatever partial progress exists elsewhere. This is how REV-03 was judged at Round 2. Otherwise FULLY_ADDRESSED needs every listed pass condition, and PARTIALLY_ADDRESSED follows the frozen `partially_addressed` text.
- **should_fix lighter form.** Each record states `fully_addressed` (the pass condition). PARTIALLY_ADDRESSED = M2 meets part but not all of it. MADE_WORSE = the generic rule: the revision degrades the item's subject relative to M0.
- **Residual re-grade default.** For a PARTIALLY_ADDRESSED verdict, `residual_obligation_class` is required. If what remains is the same Round-2 residual, unchanged, the default class is the Round-2 class recorded below. A different remaining gap is re-graded at Phase 2A with a one-sentence rationale.
- **"Still must hold."** Each scoped record lists the parts that Round 2 credited. If M2 breaks one of them, the item is re-judged against the full frozen operationalization, not only against the residual.
- **New-issue attribution this round.** A new issue in M2 that is not traceable to a roadmap item is `regression` if it is absent from M1 and present in M2, `previously_missed` if it is already present in M1 and was not recorded at Round 2, and `indeterminate` if provenance cannot be established. A problem that is traceable to a roadmap item (including a regression-guard item) is that item's verdict, not a new issue (goalpost guard).
- **External-source facts.** As at Round 2 (Round-2 Phase 1 §2), items whose criteria depend on what a cited source says (REV-12, REV-32, REV-33, and REV-07 in the guard) are judged against the source facts that the Round-1 seats reported reading. A departure that only the source can settle gets CANNOT_VERIFY with a stated reason, not a guess.
- **Severity.** Driving-finding severities are copied from Round-2 Phase 1. No must_fix item carries `critical`, so no must_fix MADE_WORSE can trigger B1 on severity.

## 3. Routing (reused from Round 2)

- **Strict §10 grammar.** Unchanged from Round 2: every roadmap `reviewer` string carries finding suffixes (for example `EIC W1`), so every string is a PARSE FAILURE and `source_reviewer_labels: []`. The Judge Record Routing line is the Round-2 `[ROUTING-DEGRADED: unmapped labels — …]` line, copied verbatim from `review_round2/phase2b_verification_report.md` (Judge Record, Routing).
- **Personas.** The Round-2 dispatching layer adopted seat-prefix extraction under the Round-1 letter's citation convention (EIC → Card #1, R1 → Card #2, R2 → Card #3, R3 → Card #4; DA-only items → EIC). This round keeps that assignment unchanged.

| Routed seat | must_fix in scope | should_fix in scope | NEW records | Regression guard |
|---|---|---|---|---|
| EIC (Card #1) | REV-01, 02, 03, 11, 12, 49 (DA-only) | REV-10, 50 (DA-only) | NEW-1 to NEW-7 (see §6) | REV-04, 09, 05, 08 |
| R1 (Card #2) | REV-14, 15, 16 | REV-18, 19, 20, 21, 22, 23, 24, 29 | — | REV-26, 27, 28 |
| R2 (Card #3) | REV-32 | REV-33, 34, 37 | — | REV-07, 35, 38 |
| R3 (Card #4) | REV-06, 40 | REV-39, 43 | — | REV-42, 45, 46, 47, 48 |

- **Competence caveat (carried over).** REV-49 and REV-50 are DA-only statistical items routed to EIC, whose card lists "Statistical detail" as a blind spot. EIC checks the presence and consistency of the required quantities and notes in `change_summary` whether statistical adequacy needs an R1-competence check.
- **NEW records.** NEW-1 enters the next roadmap as REV-PM-1 with `obligation_class: consider`, and consider items route to EIC by definition. Its `found_by` seat is R1, so an R1 competence note applies. The `found_by` seats of NEW-2 to NEW-7 are recorded in the Round-2 Phase 2A file, which was not among the inputs of this call. Those records are not roadmap items, so they take the default EIC route. Each of their pass conditions is a text-consistency check within EIC competence.

---

## 4. must_fix records (12 items not FULLY_ADDRESSED at Round 2)

Every record inherits `inherited_criterion` (roadmap_text, letter_item_ref, letter_text, level3_anchor) and `operationalization` (fully_addressed, partially_addressed, made_worse_discriminator, letter_requirement_extras_non_gating) **verbatim, by exact reference to the same item's record in Round-2 Phase 1 §4**. Nothing is regenerated. The fields below restate what remains open as a checkable pass condition.

### REV-01 / R1 · EIC

```yaml
item_id: REV-01
obligation_class: must_fix
driving_severity: major
routed_seat: EIC (Card #1)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-01"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: consider
round2_residual: >-
  Contribution (3) still lists "disclosure of every null and fragile result" as a co-equal contribution.
  (Title, RQ and conclusion were credited.)
round3_pass_condition:   # FULLY_ADDRESSED needs P1 and every still_must_hold clause
  P1: >-
    No entry of the Contribution list presents a reporting practice as a contribution or as a co-equal
    clause of one. The test strings are "disclosure", "disclose", "Holm-corrected significance", "every
    null and fragile result", or an equivalent. A reporting practice may appear only as a qualifier of how
    a named finding is reported (for example "…, with its fragility reported in Table N"). It may not be a
    listed contribution or be joined to one by "and". (Operationalizes frozen clause (c).)
still_must_hold: >-
  (a) The Title frames the reliability study or audit of the shipped retriever, with the hybrid at most one
  arm. (b) The §1 RQ separates recalibrating the shipped baseline from what the hybrid adds. (c) The
  Contribution list leads with the audit and recalibration finding and lists the hybrid findings
  separately. (d) The Conclusion's opening separates calibration alone from the hybrid. (e) No sentence
  anywhere attributes the shipped-baseline recalibration ECE reduction to the hybrid.
made_worse_check: >-
  Frozen discriminator versus M0, including promotion of the fragile hybrid accuracy gain to the headline.
  Note: anonymizing the title (REV-11) is not a reframing and does not by itself affect (a).
expected_change_surface: "Contribution list in §1"
```

### REV-02 / R2 · EIC

```yaml
item_id: REV-02
obligation_class: must_fix
driving_severity: major
routed_seat: EIC (Card #1)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-02"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: should_fix
round2_residual: >-
  Table 1 mixes populations: its caption says out-of-scope rows use all queries, and it pairs a
  controls-excluded effect with a controls-included Holm p ("controls incl."). Table 3 (correctness ×
  risk × confidence) states no population. The accuracy-fragility caveat appears in four places in the
  body (M1 §1, §5, §6, §7).
round3_pass_condition:
  P1: >-
    Every main-text table states its population in its caption or header, and all main-text tables use
    the same population. In particular, no row of the claims-status table (M1 Table 1) pairs an effect or
    CI computed on one population with a test p-value or Holm-adjusted p-value computed on another, for
    example a controls-excluded effect with a "controls incl." p. A metric defined on a subset of that
    population (for example out-of-scope rejection counted on the out-of-scope items of the same
    population) is admissible if the caption names the subset. (Frozen clause (a); Round-1 Factual Check F5.)
  P2: >-
    The correctness × risk × confidence table (M1 Table 3) states its population, and it is the same as P1's.
  P3: >-
    The accuracy-fragility caveat (the hybrid accuracy gain is fragile or not robust) is stated at most once
    in the main-text body, counting §1 through the Conclusion and excluding the claims-status table,
    Limitations, and the one exploratory-status sentence of the Abstract. Count by distinct sentences that
    state it. Any other exploratory or fragility caveat obeys the same at-most-once rule. (Frozen clause (d).)
still_must_hold: >-
  Exactly one claims-status table exists, giving each headline claim with its status. Split B, the
  bare-keyword sensitivity analysis and per-subset p-values are not main-text tables.
made_worse_check: "Frozen discriminator versus M0 (more populations, unstated populations, more parallel views, more caveat repetitions than M0)."
expected_change_surface: "claims-status table and caption; correctness × risk × confidence table caption; §1, Results, Discussion, Conclusion caveat sentences"
```

### REV-03 / R3 · EIC

```yaml
item_id: REV-03
obligation_class: must_fix
driving_severity: major
routed_seat: EIC (Card #1)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-03"
round2_final_verdict: MADE_WORSE
round2_residual: >-
  The Abstract and the Conclusion (M1 §7) carry neither the screening clause nor the unscreened-subset
  result. Both have dropped the M0 qualifiers (breakdown by kind of request; false-rejection cost). The new
  headline arm (a tuned threshold on the raw BM25 score, 46/50 at M1) thresholds the same score that was
  used to screen the added out-of-scope items. The author's pointer to §5 lies outside the item's loci.
loci: [Abstract, Conclusion]   # frozen; the Results section does not satisfy the item
round3_pass_condition:   # applies to every sentence at the loci that states an out-of-scope rejection gain or count, for any arm
  P1_screening_clause: >-
    The same sentence or the next one says that the added out-of-scope items (35 at M1) were screened
    or checked with the system's own retrieval scores. (Frozen (i).)
  P2_unscreened_result: >-
    The same sentence or the next one gives the result on the original, unscreened out-of-scope items
    (15 at M1) for the arm whose gain is stated: numbers for the arm and the baseline (x/15 vs y/15), or
    an explicit not-significant statement. (Frozen (ii).)
  P3_qualifiers_restored: >-
    The loci do not meet the frozen made_worse_discriminator versus M0. Concretely: wherever an
    out-of-scope gain is stated, (1) the false-rejection cost of the stated rule is given as a number or
    rate of non-OOD queries wrongly rejected (at M1 the tuned threshold rejected 20 of 159), and (2) the M0
    qualifier on the breakdown by kind of request is present (for example terminal-task vs everyday
    out-of-scope requests). There is also no statement of the gain as general OOD-detection ability, and
    no significance value without the P1 clause.
  vacuity: >-
    A locus that states no out-of-scope gain or count at all satisfies P1–P3 at that locus.
  non_gating: >-
    Round-2 residual parenthetical: if the stated arm thresholds the same raw score used for screening,
    saying so. Report it in change_summary; it does not decide the verdict.
verdict_mapping: >-
  MADE_WORSE if P3 fails (precedence rule, §2). FULLY_ADDRESSED if P1, P2 and P3 hold at both loci.
  Otherwise PARTIALLY_ADDRESSED under the frozen partial text. That includes the case where only the
  Holm p is dropped: the frozen Acceptance line does not admit the roadmap's "drop the Holm p"
  alternative as sufficient.
expected_change_surface: "Abstract out-of-scope sentence(s); Conclusion out-of-scope sentence(s)"
```

### REV-06 / R5 · R3

```yaml
item_id: REV-06
obligation_class: must_fix
driving_severity: major
routed_seat: R3 (Card #4)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-06"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: consider
round2_residual: >-
  The "published tool" paragraph (display, refusal below 30%, runs on Enter, no risk shown, sync off) was
  confirmed. No explicit sentence says whether the user benefit of calibrated confidence is claimed or
  untested.
round3_pass_condition:
  P1: >-
    The manuscript contains an explicit sentence that either names the user benefit claimed for calibrated
    confidence (and, if named, states what evidence supports it) or states that such benefit is untested,
    for example "whether calibrated confidence helps users decide is untested; no user study was run". An
    implication (for example "user study is future work" alone) does not count. The sentence must say
    that the benefit is untested or unmeasured. (Frozen fully_addressed, final sentence.)
still_must_hold: >-
  One paragraph states (a) whether and how confidence is displayed, (b) what a rejection shows, (c)
  printed vs run, and (d) any confirmation step, including "none". Anonymization (REV-11) may remove the
  tool's name from this paragraph but not the behaviour facts.
made_worse_check: "Frozen discriminator versus M0 (unsupported user-benefit claim; removal of existing hedges)."
expected_change_surface: "the published-tool paragraph in §3; Discussion; Limitations"
```

### REV-11 / R8 · EIC

```yaml
item_id: REV-11
obligation_class: must_fix
driving_severity: minor
routed_seat: EIC (Card #1)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-11"
criterion_basis: >-
  The Round-1 requirement, unchanged: anonymize the package name and publication pointer in the review
  version, and state neutrally whether the authors developed the audited baseline. The earlier author
  decline (D3), its later reversal and any letter-side statement of intent carry no weight. The item is
  judged on M2's text alone.
round2_final_verdict: NOT_ADDRESSED
round2_residual: >-
  §1 reads "TermAssist, an npm package that maps a query to one of 279 Windows commands". Criterion (a)
  excludes the name itself and a registry name combined with identifying detail. Criterion (b), a neutral
  statement of the authors' relationship to the audited baseline, was absent and is independent of naming.
round3_pass_condition:
  P1_no_name: >-
    The string "TermAssist" does not occur anywhere in M2, in any letter case, including inside compound
    tokens, identifiers, file names or cite keys that appear in the text. The check covers the title,
    headings, body, captions, table and figure text visible in the extraction, footnotes, references,
    acknowledgements, appendices, Ethical Considerations and any artifact statement. An anonymization
    placeholder (for example "[anonymized]" or "the audited tool") is permitted.
  P2_no_pointer: >-
    M2 contains no pointer that resolves to the published package: no URL, repository or registry link,
    handle, package version identifier or maintainer name. A registry name ("npm") does not occur in the
    same sentence as any of those items. Benchmark version labels (v0.1, v0.2) are not package pointers
    unless the text ties them to package releases. A generic statement that a published tool is audited
    is permitted.
  P3_relationship: >-
    One neutral sentence explicitly states whether the authors developed the audited baseline (the
    shipped tool). The frozen text asks for a third-person sentence ("The authors of this paper developed
    the audited tool"). An equivalent explicit statement that does not de-anonymize, such as "We developed
    the audited tool", is admissible under equivalence_policy. Possessives such as "our tool" or "our
    package" do not count unless an explicit statement is present.
  advisory_non_gating: >-
    If "npm" remains next to a functional description only (for example "an npm package that maps queries
    to 279 Windows commands"), Phase 2A records it as a lookup-risk observation for the human checkpoint.
    The frozen text does not define lookup sufficiency beyond P2. Pointers outside the text surface (PDF
    metadata fields, embedded hyperlinks not rendered as text, supplementary material, source-file names)
    are outside the evidence surface. They are also passed to the human checkpoint, as at Round 2.
verdict_mapping: >-
  FULLY_ADDRESSED: P1, P2 and P3. PARTIALLY_ADDRESSED: (P1 and P2) without P3, or P3 without (P1 and P2),
  or the name removed from the body but still present in a heading, caption, reference or artifact
  statement. NOT_ADDRESSED: none of P1–P3 holds. MADE_WORSE (versus M0): new identifying information (a
  URL, repository link or handle) is added, or the ownership framing becomes misleading (for example the
  audit is presented as independent while "our own baseline" is kept).
expected_change_surface: "Title; §1; published-tool section heading and paragraph; Ethical Considerations; References; any artifact statement"
cross_item_note: "REV-46 (guard) must remain true after anonymization; REV-17 (consider, anonymized artifact link) stays decision-inert."
```

### REV-12 / R9 · EIC

```yaml
item_id: REV-12
obligation_class: must_fix
driving_severity: minor
routed_seat: EIC (Card #1)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-12"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: consider
round2_residual: >-
  The reward description was corrected ("trained with reinforcement learning on static-analysis rewards").
  The reference-list title was not shown to match the version of record. EIC W10 reported the ISSTA 2026
  program title as "... Bash Script Generation". The letter's "30/30 cite keys resolve" does not rebut this.
round3_pass_condition:
  P1: >-
    The BashCoder-R1 reference-list title matches the version of record as EIC W10 reported it, that is,
    it ends "... Bash Script Generation". A manuscript-side change to another title needs an evidence-backed
    statement that the version of record reads otherwise. That is a Phase 2B valid_rebuttal matter, and
    the source-facts note (§2) applies: CANNOT_VERIFY if only the source can settle it.
still_must_hold: >-
  In both §1 and Related Work, BashCoder-R1 is not described as execution-grounded or trained on execution
  feedback, and its reward is described as static checks. Its 90%/73% figures, if cited, are glossed as
  FullRate (syntax, robustness and functional correctness combined), not as functional success alone.
  Phase 2A re-checks these against the frozen text, because Round 2 named only the title as open.
made_worse_check: "Frozen discriminator versus M0."
expected_change_surface: "References entry for BashCoder-R1"
```

### REV-14 / R10 · R1

```yaml
item_id: REV-14
obligation_class: must_fix
driving_severity: major
routed_seat: R1 (Card #2)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-14"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: must_fix
round2_residual: >-
  Credited: all 35 drafts kept; maxima 7.39/0.31 given as observed values; +33.3 vs +34.3 points in rates.
  Open: the tuned shipped threshold, which is the headline arm and thresholds the screened feature, has no
  split between the original and added items in the v0.2 run. "Keyword-verified" is undefined. The
  relation between the hybrid's fused-score thresholds (0.833–0.925 at M1) and the raw 7.39/0.31 bounds is
  unstated.
round3_pass_condition:
  P1_split_for_every_headline_rule: >-
    For every out-of-scope rejection rule whose result is stated in the Abstract, the Contribution list or
    the Conclusion, including the tuned shipped-score threshold if it is still reported, the v0.2 rejection
    count is given separately for the 15 original items and the 35 added items, for example "x/15 original,
    y/35 added". (Frozen (c), applied to the arm that now carries the headline.)
  P2_unscreened_status_defined: >-
    The term used for how the 15 original items were confirmed ("keyword-verified" at M1, or its
    replacement) is defined. Alternatively, the manuscript states explicitly that the 15 original items
    were not checked against retrieval scores. (Frozen (c): the "unscreened" status must be established,
    not assumed.)
  P3_thresholds_vs_bounds: >-
    Every tuned out-of-scope threshold is reported next to the screening bounds (top-1 BM25 ≤ 7.39,
    dense ≤ 0.31) in comparable units, or with the relation stated in words or a formula. This includes
    the hybrid's fused-score thresholds (0.833–0.925 at M1) and, if per-fold, the per-fold values of the
    raw-score threshold. (Frozen (b).)
still_must_hold: >-
  (a) Drafted, discarded and edited counts at screening (or "no record exists"); the M1 statement that all
  35 drafts were kept is sufficient. (d) The original-versus-added comparison is stated in rates, with no
  "smaller gain" wording that contradicts the rates. Every sentence about the size of the selection effect
  matches the reported numbers.
made_worse_check: "Frozen discriminator versus M0 (weakened screening disclosure; unsupported claim that the selection effect is absent or negligible)."
expected_change_surface: "Benchmark v0.2 construction paragraph; Results out-of-scope paragraph; out-of-scope table; appendix"
```

### REV-15 / R11 · R1

```yaml
item_id: REV-15
obligation_class: must_fix
driving_severity: major
routed_seat: R1 (Card #2)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-15"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: should_fix
round2_residual: >-
  No equal-mass or sweep ECE value is reported anywhere. The text says only that "equal-mass and sweep
  estimates agree", and §4 says "we also report" them. The hybrid's no-skill and noise-floor comparisons
  are qualitative. (Credited: noise floor, no-skill Brier skill and intervals on relative reductions for
  the headline comparison; Brier reported.)
round3_pass_condition:
  P1_values_present: >-
    For each calibration comparison whose ECE reduction is stated as a result (the shipped baseline, raw vs
    recalibrated, and the hybrid), on each benchmark version on which it is stated, M2 reports as numbers:
    (a) ECE under equal-mass binning and (b) at least one debiased or sweep ECE estimate. An appendix table
    with a main-text pointer is enough. (Frozen (a), (b), (h).)
  P2_hybrid_references_numeric: >-
    Wherever the hybrid's ECE reduction is stated (67%/81% at M1), the hybrid's noise floor (c) and its
    no-skill reference (d) (Brier skill vs a base-rate forecaster, or a Brier decomposition) are reported
    as numbers in the same paragraph or in a table the paragraph points to. (Frozen (c), (d), (h).)
  P3_no_unbacked_claim: >-
    No sentence says an estimator is reported ("we also report", "estimates agree") unless its values
    appear in M2. (Frozen (i), headline wording agrees with the estimators; Round-2 PLO-2.)
  P4_wording_agrees: >-
    If the equal-mass or sweep reductions are materially smaller than the equal-width headline, or the
    calibrated forecaster is not clearly better than no skill, the headline percentage or wording is
    qualified at the headline loci (Abstract, Discussion, Conclusion). (Frozen (i).)
still_must_hold: "(e) intervals on relative reductions; (f) Brier with paired interval first or alongside ECE; (g) population stated."
made_worse_check: "Frozen discriminator versus M0."
expected_change_surface: "metric definitions in §4; Results calibration paragraph; claims-status table; appendix calibration table"
```

### REV-16 / R12 · R1

```yaml
item_id: REV-16
obligation_class: must_fix
driving_severity: major
routed_seat: R1 (Card #2)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-16 (including its note: the feature-selection leak itself is NEW-1, not this item)"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: should_fix
round2_residual: >-
  Specification confirmed (§4 plus the Appendix A table; the leak and α reuse disclosed). The candidate
  grid and tie rule for the F1-maximizing thresholds are missing.
round3_pass_condition:
  P1: >-
    For every threshold chosen by maximizing F1 or any other objective (at least the out-of-scope and
    ambiguity detector thresholds, per fold where tuned per fold), M2 gives (i) the candidate set searched
    (an explicit grid, or "all observed score values in the training folds") and (ii) the rule used when
    several candidates tie on the objective. (Frozen (6): objective "together with their search grids";
    "unambiguous procedure".)
still_must_hold: >-
  (1) score normalisation; (2) fusion equation with α; (3) α grid; (4) the hybrid's fused-score confidence;
  (5) margin and entropy over the top 10; (6) the threshold objective; (7) how the detector features were
  chosen and whether that was inside CV; (8) which top-1 score the out-of-scope detector thresholds. Every
  tuned rule reported as a result, including any tuned shipped-score threshold, is covered by (6).
made_worse_check: "Frozen discriminator versus M0 (new specification contradicting other facts; removed seed, fold or resample counts)."
expected_change_surface: "§4; Appendix A specification table"
```

### REV-32 / R14 · R2

```yaml
item_id: REV-32
obligation_class: must_fix
driving_severity: major
routed_seat: R2 (Card #3)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-32"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: should_fix
round2_residual: "The metric is described as confidence-weighted and penalizing confident wrong answers (confirmed). No sentence contrasts it with the paper's reliability metrics."
round3_pass_condition:
  P1: >-
    Related Work, or the place where the NLC2CMD metric is described, contains at least one sentence that
    contrasts NLC2CMD's confidence-weighted task score with the reliability metrics this paper reports
    (ECE, AURC and AUGRC, or whichever of them M2 still reports). An adequate contrast says what each
    measures differently, for example a single task score that rewards confident correct answers versus a
    separate measurement of calibration and selective risk. Placing the terms in the same sentence without
    a contrast does not count.
still_must_hold: >-
  The NLC2CMD metric is described as confidence-weighted, consistent with R2's reading of arXiv
  2103.02523v2. CLAI is cited in Related Work.
made_worse_check: "Frozen discriminator versus M0."
expected_change_surface: "Related Work NLC2CMD sentence"
```

### REV-40 / R15 · R3

```yaml
item_id: REV-40
obligation_class: must_fix
driving_severity: major
routed_seat: R3 (Card #4)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-40"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: should_fix
round2_residual: >-
  "Changes the number shown", the query mix as a limitation and the user study as future work were
  located. The deployed-calibrator data statement is absent. The Discussion's recalibration sentence and the
  Conclusion's opening are not scoped to the benchmark distribution.
round3_pass_condition:
  P1_deployed_calibrator_data: >-
    M2 states what labelled data a deployed calibrator would be fitted on, for example logged user
    queries with correctness labels, or a held-out labelled set from the target distribution, or that
    this is an open problem with the reason. (Frozen (d).)
  P2_scope_at_every_claim_locus: >-
    Every calibration claim in Results, Discussion and Conclusion names the benchmark distribution ("on
    this benchmark's query mix" or an equivalent), in the claim sentence or the same paragraph. This
    specifically includes the Discussion's recalibration sentence and the Conclusion's opening, as flagged
    at M1. (Frozen (b).)
still_must_hold: >-
  (a) No sentence in Results, Discussion or Conclusion attributes a user benefit to calibration; a factual
  description of the display is not a benefit claim. (c) Limitations states that the queries were not
  drawn from real users.
made_worse_check: "Frozen discriminator versus M0 (new user-benefit or deployment-generalisation claims; removal of the Split B attenuation disclosure)."
expected_change_surface: "Discussion calibration paragraph; Conclusion opening; Limitations"
```

### REV-49 / R17 · EIC (DA-only; competence caveat applies)

```yaml
item_id: REV-49
obligation_class: must_fix
driving_severity: major
routed_seat: EIC (Card #1)
inherited_criterion_and_operationalization: "by exact reference: Round-2 Phase 1 §4, REV-49"
round2_final_verdict: PARTIALLY_ADDRESSED
round2_residual_obligation_class: must_fix
round2_residual: >-
  At M1 the compared rules sit at different false-rejection counts: 20 vs 11 of 159 on v0.2, and 9 vs 6 of
  135 on v0.1. There is no sweep. "Matched operating points" is still claimed in Contribution (3) and in
  Limitations. The Abstract and Conclusion omit the false-rejection cost. (Credited: 46/50 vs 34/50,
  McNemar p = 0.004; the shipped-score AUROC is reported and is higher.)
round3_pass_condition:   # either route; M2 must satisfy one route completely
  route_A: >-
    (a) The baseline score's out-of-scope AUROC and (b) the baseline's non-OOD false rejections are
    reported. (c) Out-of-scope rejection is reported for the compared scores (the shipped/raw score and
    the hybrid or detector feature) at an equal non-OOD false-rejection count or rate on the same
    population, on each benchmark version where the comparison is claimed. Alternatively (c) is met by a
    threshold sweep (a table or figure of out-of-scope rejection against non-OOD false rejection for each
    score) from which that comparison can be read.
  route_B: >-
    Every statement of the out-of-scope result describes it as a change of operating point (a different
    threshold or detector) and gives its false-rejection cost as a number or rate. This covers the
    Abstract, Contribution list, Results, Discussion, Conclusion and Limitations. No statement presents it
    as an unqualified improvement in out-of-scope detection ability.
  both_routes: >-
    The word "matched" (for example "matched operating points") is not used for rules whose non-OOD
    false-rejection counts differ. It may describe only a comparison actually made at equal false
    rejection, or read from a sweep. (Operationalizes both routes; Round-2 PLO-3.)
verdict_mapping: >-
  FULLY_ADDRESSED: route A or route B complete, and both_routes holds. PARTIALLY_ADDRESSED: some route-A
  quantities (for example AUROC without a matched comparison), or route-B wording at some loci but not
  all, or a misuse of "matched" remaining. MADE_WORSE (versus M0): the out-of-scope result is stated more
  strongly (for example "at no cost"), or reporting of the false-rejection cost is weakened or removed
  relative to M0.
competence_note: "EIC checks presence and consistency; statistical adequacy of any new matched-FRR analysis is flagged in change_summary for R1-competence review."
expected_change_surface: "Contribution list; Results out-of-scope paragraph and table; Discussion; Conclusion; Abstract; Limitations"
```

---

## 5. should_fix records (15 items not FULLY_ADDRESSED at Round 2; lighter form)

Each record inherits `roadmap_text`, the frozen `fully_addressed`, `source_reviewer` and seat **by exact reference to Round-2 Phase 1 §5**. The pass condition column restates the frozen `fully_addressed` as a check on M2, with the Round-2 residual shown. PARTIALLY_ADDRESSED = part of the pass condition met. MADE_WORSE = generic rule versus M0. PARTIALLY_ADDRESSED counts toward `should_fix_addressed_rate`.

| Item (S ref) | Seat | Round-2 verdict | Round-2 residual (from Phase 2B report) | Round-3 pass condition (FULLY_ADDRESSED) |
|---|---|---|---|---|
| REV-10 (S3) | EIC | PARTIALLY | Split B moved out of the main text; no main-text figure. The decline ("figures include controls") is not a rebuttal. | At least one reliability-diagram or risk-coverage figure is in the main text (not only the appendix). Split B is not a main-text table and is summarized in at most one main-text sentence. *Non-gating:* the figure states its population; Phase 2A notes any mismatch with REV-02's population in change_summary. |
| REV-18 (S6) | R1 | NOT_ADDRESSED | Non-duality of interval and test only disclosed; contested as "new analysis". | All three: (i) the accuracy comparisons use one interval method dual to the stated test (for example an exact conditional interval for the discordant share with the exact McNemar test); (ii) a mid-p or unconditional test is reported as a sensitivity check; (iii) an explicit sentence says whether the v0.2 accuracy verdict depends on the method. |
| REV-19 (S7) | R1 | NOT_ADDRESSED | The only label is in Results ("the pre-named comparison in the Holm family is this hybrid reduction"). Nothing at the Abstract or Discussion. | At both the Abstract and the Discussion, either the headline calibration figure is the Holm family's pre-named comparison, or the shipped-baseline figure (79% at M0/M1) is labelled in the same or the next sentence as secondary / outside the corrected family / not multiplicity-corrected. A label only in Results does not count. |
| REV-20 (S8) | R1 | PARTIALLY | The out-of-scope row's sidedness is unstated. Table 1 prints bootstrap p-values as equalities. | In every table or sentence where a bootstrap p appears (including the claims-status table and the Holm table), it is written as a bound (≤, or (k+1)/(B+1)). The Holm-adjusted values of those rows are written as ≤ bounds. The sidedness of every Holm-family member, including the out-of-scope row, is stated. |
| REV-21 (S9) | R1 | PARTIALLY | No exact interval for 8/8. | M2 reports the exact (Clopper–Pearson) interval for 8/8 with its level. Check value: two-sided 95% [0.631, 1.000]; a one-sided 95% lower bound would be 0.688. *Still must hold:* agreement wording ("agreed on all 8"), not "confirmed", in the gold-command check section and Limitations; the number of the 8 that were terminal-task out-of-scope is stated. |
| REV-22 (S10) | R1 | PARTIALLY | Hybrid partition complete (25+4+1+4 = 34); baseline per-category counts dropped. | The out-of-scope breakdown assigns all 50 v0.2 out-of-scope queries to categories. For every category it gives both the detector's (headline rule's) and the baseline's rejection counts, and each column sums to its reported total. Excluded queries are explained. |
| REV-23 (S11) | R1 | NOT_ADDRESSED | Single partition seed stated as a limitation; contested. | Results over at least 10 CV partition seeds are reported, with the spread (range or SD) of the accuracy delta, discordant counts, ECE before and after calibration, and AURC. A limitation statement alone does not change the verdict. |
| REV-24 (S12) | R1 | PARTIALLY | "Nested cross-validation" remains in the Abstract and Contribution (2), contradicting §4 (no inner split; α reuse). | The word "nested" does not describe the CV procedure anywhere in M2 unless an exact inner procedure matching it is described. In particular it is absent from the Abstract and the Contribution list if §4 still says there is no inner split. *Still must hold:* whether the calibrator's training scores are in-sample on the dev folds or out-of-fold is stated. |
| REV-29 (S16) | R1 | MADE_WORSE | The independence claim now rests explicitly on overlapping intervals ("so"). The M0 histogram-binning caveat is deleted. | Either (i) paired bootstrap differences between calibrators on Brier or debiased ECE are reported, or (ii) no sentence infers calibrator independence ("does not depend on the method" or an equivalent) from overlapping marginal intervals. **And**, to clear MADE_WORSE versus M0: if histogram-binning results are still reported, the M0 caveat is present (its ECE is flattered by in-sample bin scoring, and it has the worst Brier score) or an equivalent statement is. |
| REV-33 (S19) | R2 | NOT_ADDRESSED | Contested: needs new verified references. | Related Work or §4 cites and positions all three: (i) tool/API retrieval work; (ii) fusion functions, namely DPR, RRF and Bruch et al.; (iii) ranker or semantic-parser calibration work. Each is tied to the paper's architecture or reliability results, and each appears in the reference list. Descriptions must not contradict the sources as far as Round-1 seats reported them (§2 source-facts note). |
| REV-34 (S20) | R2 | PARTIALLY | Global Limitations scoping only. | Either a sensitivity row with at least one stronger offline encoder (optionally RRF), or every hybrid-over-BM25 and hybrid-over-dense claim in the Abstract, Contribution list, Results, Discussion and Conclusion names all-MiniLM-L6-v2 in the claim sentence or the same paragraph. A single global Limitations clause does not count. |
| REV-37 (S23) | R2 | PARTIALLY | Why no public benchmark: met. The ambiguous-draft check was deleted rather than specified; the M0 6/30 rejection count was lost. | For every step at which benchmark queries were checked against a system's output (out-of-scope screening; the ambiguous-draft check, if the benchmark construction still relies on it), M2 names the system whose retrieval output was used. If the ambiguous-draft check is described, its outcome count (6 of 30 rejected in M0) is given. *Still must hold:* why public NL-to-shell benchmarks (NL2Bash, NLC2CMD, tldr, NL2SH) are not used or mapped. |
| REV-39 (S25) | R3 | NOT_ADDRESSED | Contested. | All three: (i) at least one operating point is defined with an explicit cost of harm (for example a budget on wrong answers shown at or above X% confidence), and the text says what a user experiences at it; (ii) A5's decline on v0.2 is analysed; (iii) the baseline is reported at matched coverage. |
| REV-43 (S27) | R3 | PARTIALLY | Risk display, confirmation and `-WhatIf` named. A risk-dependent threshold is neither discussed nor declined; `-Confirm` is not named. | The Discussion (or an equivalent section) names deployment safeguards beyond retrieval: no automatic execution, confirmation for high-risk commands, and both `-WhatIf` and `-Confirm` where supported. It also discusses a risk-dependent threshold and either adopts it or explicitly declines it, with a reason. |
| REV-50 (S33) | EIC | PARTIALLY | The reason for the two p-values is given; the implication for the v0.2 result is not. | An explicit statement of why the same 15 original out-of-scope queries give different p-values in the v0.1 analysis and the v0.2 breakdown, **and** of what that implies for the v0.2 result on those 15 items (for example that the v0.2 subset result depends on a detector tuned with the added items). |

---

## 6. NEW-issue records (NEW-1 to NEW-7, frozen at Round-2 Phase 2A)

The descriptions, attributions and severities are frozen; they are quoted by reference to `phase2b_verification_report.md`, New Issues table. For each record, Phase 2A of this round assigns one status: **RESOLVED** (pass condition met), **NOT_RESOLVED** (unchanged or only partly met), or **WORSENED** (the problem is larger in M2 than in M1). A WORSENED state caused by the Round-3 revision is recorded additionally as a new Round-3 regression NewIssueRecord with its own severity.

| # | Frozen attribution / severity | Route | Pass condition (RESOLVED) |
|---|---|---|---|
| NEW-1 (→ REV-PM-1) | previously_missed / major; next-roadmap class `consider`; suggested action "assess; address or record as a limitation" | EIC (consider; R1 competence note) | **Either** (A) a sensitivity analysis bounds the leak: detector features selected inside the CV training folds (or an equivalent bound), with the affected figures reported under it; **or** (B) an explicit limitation, in Limitations or next to the results, that states all three of: (1) the out-of-scope and ambiguity detector features were chosen by inspecting class means on the full benchmark, labels included, outside the CV folds; (2) this may bias the hybrid detector's reported figures optimistically; (3) which results are affected (at least out-of-scope rejection and AUROC, the Holm out-of-scope rows, ambiguity F1/AUROC, and A4/A5 where reported), and that no bound is given. A bare "a disclosed leak" does not satisfy (B). Decision-inert whatever the status (§9). |
| NEW-2 | regression / minor | EIC | No row of the claims-status table carries a status that contradicts the caption's definition of that status. For the row "Shipped confidence: Brier skill vs. no-skill, raw / recalibrated": if its raw intervals include zero on either version, it is not labelled "robust" under a definition requiring exclusion on both versions. Splitting the row, relabelling the raw half, or changing the definition consistently across all rows each satisfies this. |
| NEW-3 | regression / minor | EIC | Either AUGRC values with intervals are reported where the text says they are (the claims-status table or the table it cites), or every claim about AUGRC is removed. More generally, no sentence cites a table for a quantity that table does not contain. *Cross-check:* REV-26 (guard) must still hold if AUGRC is cited as ranking evidence. |
| NEW-4 | regression / minor | EIC | The benchmark section and Limitations describe the ground-truth defects of TA-B145, TA-B149 and TA-B187 consistently with M0: TA-B149's gold command is in the corpus, with only one acceptable command outside it, and every system answers TA-B149 correctly. The number of items said to have gold commands outside the corpus is consistent with the stated effect ("at most 2 of 159"). Neither locus says that three items have gold commands outside the corpus. An evidence-backed correction of M0's facts is a Phase 2B matter. |
| NEW-5 | regression / minor | EIC | Every reported hybrid out-of-scope AUROC value is labelled as pooled or as a mean over folds, in the text and in each table. No quantity appears with two unlabelled values (M1: 0.855 vs 0.867 on v0.1; 0.900 vs 0.901 on v0.2). The claims-status table's AUROC difference (+.095 at M1) states which estimate it uses. |
| NEW-6 | regression / minor | EIC | The §1 no-LLM rationale does not overstate either property. (i) "Every answer can be traced to a vetted record" is removed or qualified, consistent with the benchmark section's facts: records checked by script, and some Linux commands (for example `sudo reboot`) in the Windows-visible corpus. (ii) "No query leaves the user's machine" is removed or qualified by the optional query-sync feature (off by default). *Still must hold:* REV-47 (guard), a positive case for the no-LLM constraint. |
| NEW-7 | regression / minor | EIC | Where Cohen's κ (0.63, n = 14) is reported in the benchmark section, its uncertainty is given in the same sentence or the next: an interval (M0: post hoc bootstrap 95% [0.39, 1.00]) or an equivalent statement that one flipped item would move it materially. Where κ is cited again (Limitations), it is not presented as a precise value; the interval or n = 14 accompanies it, or the sentence points to the interval. |

---

## 7. Regression guard (items FULLY_ADDRESSED at Round 2)

These items carry their Round-2 FULLY_ADDRESSED verdict forward only if the "must still hold" condition is true in M2. If it fails, Phase 2A re-verdicts the item against its full frozen Round-2 operationalization (Round-2 Phase 1 §4 or §5), and the new verdict enters the decision derivation like any other. A degradation that is traceable to one of these items is that item's verdict, not a new issue.

**must_fix (5)**

| Item (R ref) | Seat | Must still hold in M2 |
|---|---|---|
| REV-04 (R4) | EIC | The Abstract is ≤ 200 whitespace-delimited tokens (Round-1 F1 method; M1 had 172) and contains one sentence stating the exploratory status of the statistics. Restoring the REV-03 qualifiers must not push it over 200. |
| REV-07 (R6) | R2 | Related Work cites and positions the NLC2CMD TF-IDF retrieval entry, ShellFusion, DocPrompting and CLAI. All four are in the references. The gap is restated relative to them, and §1 acknowledges retrieval as a baseline or entry in NLC2CMD. No description contradicts R2's reported source facts. |
| REV-09 (R7) | EIC | "Answerable" refers only to the 121-query set. The 159- and 135-query sets carry a distinct term. Every headline percentage names its population. |
| REV-26 (R13) | R1 | Every ranking metric named as evidence in the Discussion or Conclusion ranking claim carries an interval. The paired correctness-AUROC difference and pooled AUROCs with CIs remain (claims-status table), or the claim rests only on interval-bearing metrics. |
| REV-42 (R16) | R3 | The correctness × risk × confidence table remains for both systems, stating the risk source and the band edges. |

**should_fix (10)**

| Item (S ref) | Seat | Must still hold in M2 |
|---|---|---|
| REV-05 (S1) | EIC | The Discussion or Results says that recalibrating the clipped heuristic confidence is expected to reduce ECE, and gives at least one sentence on what is not obvious in the result. |
| REV-08 (S2) | EIC | No generative baseline is run, and the comparison with generation is stated as conceptual. The RQ's comparative clause is absent or marked as not measured. |
| REV-27 (S14) | R1 | "Validates benchmark quality" is absent. Any replacement wording is limited to the executability of the sampled gold commands. |
| REV-28 (S15) | R1 | The inclusion rule for the 125 safety-scored gold commands is stated, with whether all 20 high- and critical-risk items are among them. |
| REV-35 (S21) | R2 | "Out-of-scope" is used, or OOD is defined as out-of-scope. The in-domain (terminal-task) vs general split is drawn. "Closed-vocabulary" is replaced by "closed-set" or "fixed-inventory". |
| REV-38 (S24) | R2 | The NL2SH author list is either the six-author list kept at Round 2 under ADJ-1 (`valid_rebuttal`; a human spot-check of the PDF author line is still pending) or the Anthology-record list. The 2026 preprints are marked as preprints or not peer-reviewed. |
| REV-45 (S29) | R3 | The Abstract names Windows as the evaluated platform. |
| REV-46 (S30) | R3 | Ethical Considerations still states what is or is not being done for current users of the shipped package, in wording compatible with REV-11's anonymization (it survives the removal of the name and pointer). |
| REV-47 (S31) | R3 | §1 or the Discussion gives positive deployment-setting reasons for the no-LLM constraint and states qualitatively what coverage is lost. Qualifying the properties under NEW-6 does not break this if a positive case remains. |
| REV-48 (S32) | R3 | The Abstract is not split by a page or column artefact. The safety example reads `git checkout -- .`. "No LLM" is stated once, not repeated across the Abstract, §1 and §4. Extraction artefacts get CANNOT_VERIFY for that sub-part. |

---

## 8. consider items (no pre-commitment; decision-inert)

REV-13, REV-17, REV-25, REV-30, REV-31, REV-36, REV-41, REV-44, REV-51, REV-52, REV-53, REV-54 (12 items).

- They route to EIC by definition. Phase 2A assesses them with `applied_criterion: not_precommitted`. They affect no step of the decision derivation.
- Seeds carried from Round 2, for information only: REV-52's deleted anchor disclosure on v0.1's un-re-annotated ambiguous labels; REV-17 (anonymized artifact link) in relation to REV-11.
- NEW-1 / REV-PM-1 is also consider-class and decision-inert. It has a pass condition in §6 because the dispatch asked for one.

---

## 9. Decision rules handed forward

These are copied from `re_review_mode_protocol.md` § Decision Derivation and applied as at Round 2 (`phase2b_verification_report.md`, Decision Rationale).

**Output domain.** `decision_state ∈ {Accept, Minor Revision, Major Revision, user_review_required}` or a fail-closed abort. Reject is not a Stage 3' decision; severe cases set `reject_recommended`. Order: Accept < Minor Revision < Major Revision.

**`should_fix_addressed_rate`.** Numerator = |should_fix items with final verdict ∈ {FULLY_ADDRESSED, PARTIALLY_ADDRESSED}|. Denominator = |should_fix items|. It is computed over FINAL (post-2B) verdicts. An author explanation on a NOT_ADDRESSED item does not count. **This round:** the denominator is all 25 should_fix items: the 15 scoped items in §5 plus the 10 guard items in §7, which count at their carried or re-verdicted status. 80% of 25 = 20. Round 2 was 19/25 = 76%.

**Step 1 — gates (first match wins).**
- **G0.** Manifest incomplete or hash-mismatched → `[RE-REVIEW-ABORT: manifest_incomplete | manifest_hash_mismatch]`. *This round:* G0 would fire under the current contract. As at Round 2, the dispatching layer proceeds as a manual three-gate run. The decision is derived by hand, is NOT checker-verified, and is reported as such.
- **G1.** Any row whose final verdict differs from its Phase 2A verdict without an `adjustment_id` → `[RE-REVIEW-ABORT: criteria_drift]`.
- **G2.** Any pending user-input state → `decision_state: user_review_required`. The states are: (a) a tripped dissent bound with an unadjudicated dissent; (b) a must_fix `diverges` row without a covering resolution; (c) a pending escalation exception; (d) an `original_upheld` reapplication concluding CANNOT_VERIFY with no user resolution. Without cross-model, every dissent covered by a tripped bound (any must_fix dissent, or dissents on more than ⌈N/3⌉ items) defers to the user.

**Step 2 — base decision (first match wins).**

| # | Condition | Base |
|---|---|---|
| B1 | Any must_fix MADE_WORSE with driving severity `critical`, OR any regression-attributed new issue of severity `critical` | Major Revision + `reject_recommended: true` |
| B2 | ≥ 50% of must_fix items in {NOT_ADDRESSED, MADE_WORSE}; with 17 must_fix items this means ≥ 9 | Major Revision + `reject_recommended: true` |
| B3 | Any must_fix in {NOT_ADDRESSED, MADE_WORSE, CANNOT_VERIFY}, OR any regression-attributed new issue of severity `major` | Major Revision |
| B4 | Any must_fix OR should_fix PARTIALLY_ADDRESSED with `residual_obligation_class: must_fix` | Major Revision |
| B5 | Any must_fix PARTIALLY_ADDRESSED with residual class should_fix or consider, OR `should_fix_addressed_rate` < 80%, OR any should_fix MADE_WORSE, OR any regression-attributed new issue of severity `minor` | Minor Revision |
| B6 | Residual: all 17 must_fix FULLY_ADDRESSED (including `addressed_by_rebuttal`); rate ≥ 80%; no should_fix MADE_WORSE; no should_fix PARTIALLY_ADDRESSED with a must_fix residual; no regression-attributed new issues | Accept |

**Step 3 — floors.** `decision_state = max(base, every APPROVED escalation exception's mechanical_decision_impact)`. Pending or rejected exceptions contribute nothing.

**Notes carried from the protocol.**
- CANNOT_VERIFY on a must_fix item caps the decision at Major (B3). On a should_fix item it counts against the rate.
- MADE_WORSE: must_fix → B1/B3; should_fix → B5, and it counts against the rate; consider → recorded, no effect.
- `previously_missed` and `indeterminate` new issues never enter Step 2 (goalpost guard). Only `regression` attribution moves the decision.
- consider items never affect any step.
- A `valid_rebuttal` upgrade on a `critical` item is a pending proposal that needs the critical-rebuttal check. No must_fix item in this round is `critical`.

**Round-3 application rules (stated before the revision is seen).**
1. **Carried Round-2 regression records.** A regression-attributed Round-2 record (NEW-2 to NEW-7, all minor) that is NOT_RESOLVED in M2 still counts as a regression-attributed new issue of its frozen severity in Step 2. That fires B5 (minor), consistent with the Round-2 Residual Issues list, which put fixing the six minor regressions under "Clears B5". A RESOLVED record drops out. A WORSENED record counts at its frozen severity, plus any new Round-3 regression record raised for the worsening.
2. **NEW-1 is decision-inert** (`previously_missed`) whatever its status. It is reported, and on a Major Revision it travels to the next roadmap as REV-PM-1.
3. **New Round-3 issues** are attributed against M1 (§2). Only `regression` ones enter B1/B3/B5 at their severity.
4. **Regression-guard failures** enter Step 2 through the re-verdicted item's class (§7).
5. **Round-2 reference outcome** (information only): B3 fired (REV-11 NOT_ADDRESSED; REV-03 MADE_WORSE). B4 would also have fired (REV-14, REV-49 must_fix residuals). B5 conditions also held (rate 76%; REV-29 MADE_WORSE; six minor regressions). **Accept at Round 3 therefore requires all of the following:** all 12 scoped must_fix items FULLY_ADDRESSED and all 5 guard must_fix items still FULLY_ADDRESSED; at least 20/25 should_fix items addressed or partly addressed; REV-29 no longer MADE_WORSE; NEW-2 to NEW-7 all RESOLVED; and no new Round-3 regression.

---

## 10. Summary

- **Contract status:** `[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`. No manifest, roadmap JSON, author sidecar or evidence bundle; no checker; the decision will be hand-derived and not checker-verified.
- **must_fix records: 12** (scoped): REV-01, 02, 03, 06, 11, 12, 14, 15, 16, 32, 40, 49.
  - By Round-2 verdict: 1 MADE_WORSE (REV-03); 1 NOT_ADDRESSED (REV-11); 10 PARTIALLY_ADDRESSED. Of the partial ones, REV-14 and REV-49 have must_fix residuals, REV-02, 15, 16, 32 and 40 have should_fix residuals, and REV-01, 06 and 12 have consider residuals.
  - By seat: EIC 6, R1 3, R2 1, R3 2.
- **should_fix records: 15** (scoped, lighter form): REV-10, 18, 19, 20, 21, 22, 23, 24, 29, 33, 34, 37, 39, 43, 50.
  - By Round-2 verdict: 1 MADE_WORSE (REV-29); 5 NOT_ADDRESSED (REV-18, 19, 23, 33, 39); 9 PARTIALLY_ADDRESSED.
  - By seat: EIC 2, R1 8, R2 3, R3 2.
- **NEW-issue records: 7**, with pass conditions: NEW-1 (previously_missed, major, decision-inert) and NEW-2 to NEW-7 (regression, minor; B5-relevant while unresolved).
- **Regression guard: 15 items**, 5 must_fix (REV-04, 07, 09, 26, 42) and 10 should_fix (REV-05, 08, 27, 28, 35, 38, 45, 46, 47, 48).
- **consider: 12 items**, decision-inert with no pre-commitment: REV-13, 17, 25, 30, 31, 36, 41, 44, 51, 52, 53, 54.
- **Routing:** reused from Round 2. Strict grammar gives `[ROUTING-DEGRADED: unmapped labels — …]` (verbatim Round-2 line). Personas come from seat-prefix extraction, which would be `card_mapped`. Cards are frozen (`round1_cards_reused`).
- **NewStandardRecords:** none added. NS-1 lapsed to advisory at Round 2, and its substance is carried by NEW-1. Pass conditions marked `non_gating` or `advisory_non_gating` do not decide verdicts: REV-03's arm/score parenthetical, REV-10's figure population, and REV-11's "npm" lookup-risk and off-surface pointers.
- **Attestation exceptions:** the session's automatic git-status snapshot exposed the Round-3 commit subject ("anonymized review version, T22 residuals") and the existence of `review_round3/`, with no manuscript content. The dispatch stated the author's intention to anonymize. Neither affects any criterion (§1).
- **Single-family disclosure:** all seats, the revision driver and this verifier are `claude-opus-5-5`.
- **Phase 1 retry:** not used. No lint could run.

[CONTRACT-ACKNOWLEDGED]
