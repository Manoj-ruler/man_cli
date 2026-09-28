# Phase 1: Criteria Commitment (revision-blind), Stage 3' re-review, Round 2

`[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`

## 0. Contract status (stated first, not hidden)

- **Missing machine artifacts.** The current contract hard-requires four machine artifacts, and none of them exists for this project:
  - `revision-roadmap/1.0` JSON core;
  - `author-adjudication/1.0` sidecar;
  - `revision-evidence-bundle/1.0`;
  - input manifest 1.1.

  The manuscript is LaTeX source, and the ARS patch toolchain handles Markdown only. The Round-1 package already recorded that the roadmap core could not be emitted (`phase2_editorial_decision.md`, Protocol and Contract Status item 3a: no block manifest).
- **Consequences:**
  - `input_manifest_hash`: ABSENT.
  - `round_id`: not issued by a dispatching layer. This file uses the informal `termassist-t14-rereview-round-2`.
  - `scripts/check_re_review_synthesis.py` cannot run. G0 (manifest completeness and hash) cannot be checked mechanically.
  - This run follows the three-gate discipline by hand: Phase 1 here, then Phase 2A, then Phase 2B.
- **The Schema 7 `verification_criteria` field is absent.** `[SCHEMA7-VERIFICATION-CRITERIA-FIELD-ABSENT: Markdown roadmap core]`. The Round-1 roadmap is a Markdown table with no separate verification-criteria column. For every item, `roadmap_text` below is a verbatim copy of that item's **Revision Item** cell, which is the only per-item criterion text at roadmap level. It serves as the level-1 surrogate. `letter_text` is the verbatim **Acceptance criteria** line of the derived `R<n>` block, for must_fix items only.
- **Criterion layers:**
  - Level 2 (Decision Letter): present. The `R<n>` blocks R1–R17 run contiguously and match must_fix roadmap order (REV-01, 02, 03, 04, 06, 07, 09, 11, 12, 14, 15, 16, 26, 32, 40, 42, 49). No `[CRITERIA-LAYER-ABSENT]` marker applies.
  - Level 3 (Round-1 findings): present, all five seat reports.
  - Level 4 (frozen Configuration Cards #1–#4 plus target venue, EACL 2027 SRW long paper): present.
- **Letter Requirement text rule.** Each Required item's "Requirement" paragraph in the letter is author-visible, level-2 text. Where it asks for more than both the Revision Item and the Acceptance criteria, the extra is recorded as `letter_requirement_extras (non-gating)`. It is reported in Phase 2A's `change_summary` and does not decide the verdict. One rule is applied to every item.
- **Single-family disclosure (carried forward to the Re-Review Output):** all Round-1 seats, the revision driver, and this verifier are `claude-opus-5-5`.

## 1. Inputs read, inputs withheld (revision-blindness attestation)

- **Read.** All in `research/paper/review_round1/`:
  - `phase2_editorial_decision.md` (the letter and the roadmap);
  - `phase1_EIC.md`, `phase1_R1_methodology.md`, `phase1_R2_domain.md`, `phase1_R3_perspective.md`, `phase1_DA.md`;
  - `phase0_field_analysis.md` (the frozen cards).

  Also read: the protocol file and `shared/contracts/re_review/precommitment.schema.json`, for field names only.
- **Not opened:**
  - `review_round1/manuscript_review.txt`;
  - any file in `review_round2/`;
  - `T21_REVISION_LOG.md`;
  - the LaTeX sources;
  - any other repository file.
- **Disclosure.** One directory listing of `review_round2/` was run to confirm the output path. It showed two filenames, a `.patch` file and a revised-manuscript `.txt`. Neither was opened. The listing gives no content and no section list. No operationalization below refers to revision content.
- **Yardstick continuity.** The Round-1 Reviewer Configuration Cards #1–#4 are reused as frozen. `field_analyst_agent` was not re-invoked. The Reviewer-configuration line reads "Round-1 cards, frozen", with no `[YARDSTICK-REGENERATED]` marker.

## 2. Record conventions

- `equivalence_policy: allowed` on every record. An equivalent fix at another location counts. So does an evidence-backed disagreement, which is handled through the Phase 2A dissent channel or the Phase 2B `valid_rebuttal` channel.
- `expected_change_surface` is a hypothesis taken from the Round-1 "Cost scope" column and the anchors. It is not a gate.
- **Severity.** Each record carries its driving-finding severity (level 3), because B1 needs it. No must_fix item carries `critical`, so a must_fix MADE_WORSE cannot trigger B1 on severity.
- **should_fix lighter form.** Only `fully_addressed` is given. PARTIALLY_ADDRESSED and MADE_WORSE come from the protocol-level rules. The generic should_fix MADE_WORSE rule is: *the revision degrades the item's subject relative to the ORIGINAL manuscript*.
- **Verifiability note for external-source items (REV-07, REV-12, REV-32, REV-33).** Their criteria refer to what a cited source says. Phase 2A applies the source facts that the Round-1 seats reported reading (level 3). The synthesizer did not re-verify those facts (Factual Check F11). If the revised text departs from those reported facts in a way that only the source can settle, the verdict is CANNOT_VERIFY with a stated reason. It is not a guess.

## 3. Routing (§ Verifier Routing)

**Strict §10 grammar result.** Every roadmap `reviewer` string (the "Source Reviewer" cell) uses the Round-1 letter's declared citation convention: "A seat reference always carries a finding suffix". So after splitting, each token has the form `<SEAT> <finding>`, for example `EIC W1` or `DA m3`. None of these tokens is a whole-token exact match for `{EIC, R1, R2, R3, DA}`. Every string is therefore all-dropped, which the protocol treats as a **PARSE FAILURE**. It is not a legitimately empty list. Under strict application, every must_fix and should_fix record has `source_reviewer_labels: []`, and every item falls back to `EIC`.

**Seat assignment used for the personas.** Manual and non-schema, stated openly. Each split token was reduced to its leading seat label under the letter's own declared citation convention. This is a deterministic extraction, not a guess. The routed seat is then the first non-DA label, or EIC when none exists. Every extracted first non-DA label maps to a frozen card:

- EIC → Card #1
- R1 → Card #2
- R2 → Card #3
- R3 → Card #4

The two DA-only items, REV-49 and REV-50, route to EIC.

**Choice left to the dispatching layer.** It may keep this assignment or apply the strict fallback, which routes all items to EIC. The Phase 2A persona must follow whichever choice is recorded.

Routing line (Judge Record):

```
Routing: [ROUTING-DEGRADED: unmapped labels — unparsed REV-01 "EIC W1, EIC Q2; R2 W8"; unparsed REV-02 "EIC W2; DA Observation 3"; unparsed REV-03 "EIC W3; R1 W1"; unparsed REV-04 "EIC W4"; unparsed REV-05 "EIC W5"; unparsed REV-06 "R3 W1, R3 W5, R3 Q1; EIC W5, EIC Q4"; unparsed REV-07 "R2 W1, R2 Q1; EIC W6"; unparsed REV-08 "EIC W6; DA m11"; unparsed REV-09 "EIC W7; DA m1"; unparsed REV-10 "EIC W8"; unparsed REV-11 "EIC W9, EIC Q1"; unparsed REV-12 "EIC W10; R2 W6"; unparsed REV-14 "R1 W1, R1 Q1; EIC W3, EIC Q3; DA m2"; unparsed REV-15 "R1 W2; DA M1"; unparsed REV-16 "R1 W3, R1 Q2; DA M3"; unparsed REV-18 "R1 W4"; unparsed REV-19 "R1 W5"; unparsed REV-20 "R1 W6"; unparsed REV-21 "R1 W7, R1 Q4"; unparsed REV-22 "R1 W8; DA m4"; unparsed REV-23 "R1 W9, R1 Q3; DA m12"; unparsed REV-24 "R1 W10"; unparsed REV-26 "R1 W12; DA M2"; unparsed REV-27 "R1 W13; DA m8"; unparsed REV-28 "R1 W14, R1 Q4"; unparsed REV-29 "R1 W15"; unparsed REV-32 "R2 W2"; unparsed REV-33 "R2 W3"; unparsed REV-34 "R2 W4, R2 Q2"; unparsed REV-35 "R2 W5, R2 Q3"; unparsed REV-37 "R2 W9, R2 Q4; DA m9"; unparsed REV-38 "R2 Minor Issues"; unparsed REV-39 "R3 W1; DA m7"; unparsed REV-40 "R3 W1, R3 W3, R3 Q3; DA M4"; unparsed REV-42 "R3 W2, R3 Q2; DA m10"; unparsed REV-43 "R3 W2"; unparsed REV-45 "R3 W6 (EIC S1 disputes; Disagreement 4)"; unparsed REV-46 "R3 W7"; unparsed REV-47 "R3 W8"; unparsed REV-48 "R3 Minor Issues"; unparsed REV-49 "DA M3"; unparsed REV-50 "DA m3"]
```

Under the seat-prefix extraction, the routing would be `card_mapped`: no first non-DA label was left unmapped. Persona assignment summary under that extraction:

| Routed seat | must_fix | should_fix |
|---|---|---|
| EIC (Card #1) | REV-01, 02, 03, 04, 09, 11, 12, 49 (DA-only) | REV-05, 08, 10, 50 (DA-only) |
| R1 (Card #2) | REV-14, 15, 16, 26 | REV-18, 19, 20, 21, 22, 23, 24, 27, 28, 29 |
| R2 (Card #3) | REV-07, 32 | REV-33, 34, 35, 37, 38 |
| R3 (Card #4) | REV-06, 40, 42 | REV-39, 43, 45, 46, 47, 48 |

**Competence caveat (disclosure only; the routing is not changed).** REV-49 and REV-50 are DA-only statistical items routed to EIC. Card #1 lists "Statistical detail" as a blind spot. On REV-49's analysis route, EIC checks whether the required quantities are present and consistent, and records in `change_summary` whether their statistical adequacy needs an R1-competence check.

---

## 4. must_fix pre-commitment records (17)

### REV-01 / R1 · routed seat EIC (Card #1, Journal-Fit Reviewer)

```yaml
item_id: REV-01
obligation_class: must_fix
driving_severity: major   # EIC W1 major; R2 W8 minor (Disagreement 1, resolved major)
inherited_criterion:
  roadmap_text: |-
    REV-01: Reframe title, RQ, contributions and §10 opening around the robust findings; the hybrid becomes one arm of the study
  letter_item_ref: R1
  letter_text: |-
    The title, RQ, contribution list and §10 opening name the audit and recalibration finding and the hybrid-specific findings separately, and no sentence credits the hybrid with the baseline-recalibration result.
  level3_anchor: 'text: §10 "A lightweight, fully offline, non-LLM hybrid retriever with post-hoc calibration improves the reliability of a shipped BM25 command-retrieval baseline."'
persona_lens: >-
  As the SRW mentor-reviewer (Card #1 focus 1), I ask whether a reader of the title, RQ and
  contributions can state the one contribution, and whether that contribution is the robust finding.
operationalization:
  fully_addressed: >-
    All of the following hold in the manuscript text. (a) Title: it does not present the hybrid
    architecture as the source of improved reliability. Its framing is the reliability study or audit
    of the shipped retriever, and the hybrid is at most one arm. (b) RQ (§1): it separates, or frames
    as distinct arms, the effect of recalibrating the shipped baseline's confidence and what the hybrid
    adds. (c) Contribution list: it leads with the audit and recalibration finding, lists the
    hybrid-specific findings (error ranking, OOD rejection, fragile accuracy gain) as separate items,
    and no longer presents reporting practices ("disclosure", "Holm-corrected significance") as
    co-equal findings. (d) §10 opening: it separates what calibration alone does to the shipped
    baseline from what the hybrid adds. (e) Manuscript-wide: no sentence attributes the
    shipped-baseline recalibration ECE reduction to the hybrid.
  partially_addressed: >-
    At least one of the four loci (title, RQ, contribution list, §10 opening) is reframed as in (a)-(d),
    but at least one other still credits the hybrid with the reliability result or still lists
    reporting practices as co-equal contributions. Or all four loci are reframed, but a sentence
    elsewhere still credits the hybrid with the baseline-recalibration result.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: a revised or new sentence attributes the recalibration-of-baseline result
    to the hybrid more directly than before. Or the audit/recalibration finding is removed or demoted in
    all four loci while the hybrid framing is kept. Or the fragile hybrid accuracy gain is promoted to
    the headline.
  letter_requirement_extras_non_gating: "contributions reduced to exactly two or three; 'Retitle to match' wording specifics"
expected_change_surface: "Title; §1 RQ and contribution list; §10 paragraph 1 (likely also Abstract framing)"
equivalence_policy: allowed
source_reviewer: "EIC W1, EIC Q2; R2 W8"
source_reviewer_labels: []            # strict §10 grammar: PARSE_FAILURE
seat_prefix_labels_manual: [EIC, R2]  # non-schema; letter citation convention
verified_by: EIC
```

### REV-02 / R2 · routed seat EIC (Card #1)

```yaml
item_id: REV-02
obligation_class: must_fix
driving_severity: major   # EIC W2
inherited_criterion:
  roadmap_text: |-
    REV-02: One reporting population in main-text tables; a claims-status table; secondary views moved to the appendix; each caveat stated once
  letter_item_ref: R2
  letter_text: |-
    Every main-text table uses a single stated population, one claims-status table exists, and each exploratory or fragility caveat appears once in the main text outside the claims table and Limitations.
  level3_anchor: 'text: Limitations "Headline figures exclude them, but the Holm table, sensitivity table, Split B table, and figures include them."'
persona_lens: >-
  Card #1 focus 3: can a workshop reader take the main result from the abstract, the introduction and
  one table without reconciling parallel views?
operationalization:
  fully_addressed: >-
    (a) Every main-text table states its population in its caption or header, and all main-text tables
    use the same population. In particular, no main-text table or caption gives a second CI set for the
    same comparison under a different population (Round-1 Factual Check F5). (b) Exactly one
    claims-status table exists, giving each headline claim with its status (robust or fragile). (c) The
    secondary views named in Round 1 (Split B, the bare-keyword sensitivity analysis, per-subset
    p-values) are not main-text tables; each is in the appendix or summarised in main-text prose.
    (d) Each distinct exploratory or fragility caveat is stated at most once in the main-text body
    outside the claims-status table and Limitations. The single exploratory-status sentence that REV-04
    requires in the Abstract does not count against this.
  partially_addressed: >-
    One or two of (a)-(d) are met. For example: one population, but no claims-status table. Or a
    claims-status table, but main-text tables still mix controls-in and controls-out. Or both of those
    are met, but the same caveat is still repeated across two or more of §6, §9 and §10.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: main-text tables use more populations than before, or the populations are
    now unstated. Or additional parallel views are moved into the main text. Or caveats are repeated in
    more places than before.
  letter_requirement_extras_non_gating: "controls-excluded as the specific population; exact claims-table columns (claim, effect with CI, test, robust/fragile, location of robustness check)"
expected_change_surface: "§6; Tables 1–4 and captions; Limitations; Appendix"
equivalence_policy: allowed
source_reviewer: "EIC W2; DA Observation 3"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [EIC, DA]
verified_by: EIC
```

### REV-03 / R3 · routed seat EIC (Card #1)

```yaml
item_id: REV-03
obligation_class: must_fix
driving_severity: major   # EIC W3; corroborated R1 W1
inherited_criterion:
  roadmap_text: |-
    REV-03: Scope the OOD claim in the Abstract and §10 to the score-screened set; give the original-subset result or drop the Holm p
  letter_item_ref: R3
  letter_text: |-
    Wherever the abstract and §10 state the OOD gain, the same sentence or the next one says the added items were score-screened and reports the unscreened-subset result.
  level3_anchor: 'text: Abstract "OOD rejection doubles on v0.2 (17/50→34/50; Holm-adjusted p = 0.00006)"'
persona_lens: >-
  Card #1 "particularly care about": the headline must not be stronger than the body supports.
operationalization:
  fully_addressed: >-
    Every statement of an OOD-rejection gain in the Abstract and in §10 has, in the same or the next
    sentence, both (i) a clause saying that the added OOD items were screened with the system's own
    retrieval scores and (ii) the result on the unscreened original subset, with numbers or an explicit
    not-significant statement. The numbers may come from REV-14's re-analysis. If the Abstract or §10
    no longer states an OOD gain at all, that locus is satisfied vacuously.
  partially_addressed: >-
    Only one of the two loci is scoped. Or (i) is present without (ii), or the reverse. Or only the
    roadmap's alternative ("drop the Holm p") is applied, so the p-value is removed but the gain is
    still stated without the screening clause and the unscreened-subset result. The Acceptance
    criterion is the operative test here: the roadmap text and the letter Requirement offer the
    alternative, but the Acceptance line does not.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: the Abstract or §10 states the OOD gain more broadly than before (for
    example, as general OOD detection ability), or drops the existing qualifiers (the breakdown by kind
    of request, the false-rejection cost), or adds unscoped significance statements.
  letter_requirement_extras_non_gating: none
expected_change_surface: "Abstract OOD sentence; §10 OOD statement"
equivalence_policy: allowed
source_reviewer: "EIC W3; R1 W1"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [EIC, R1]
verified_by: EIC
```

### REV-04 / R4 · routed seat EIC (Card #1)

```yaml
item_id: REV-04
obligation_class: must_fix
driving_severity: minor   # EIC W4
inherited_criterion:
  roadmap_text: |-
    REV-04: Cut the abstract to the venue limit (≤200 words per EIC's ACLPUB citation)
  letter_item_ref: R4
  letter_text: |-
    The abstract is at or under the confirmed venue limit and still states the exploratory status in one sentence.
  level3_anchor: 'text: Abstract, about 320 words (Factual Check F1: 320 whitespace-delimited tokens)'
persona_lens: "Card #1 focus 3 and informal venue fit (C6); venue criteria not bound."
operationalization:
  fully_addressed: >-
    The abstract's length, counted as whitespace-delimited tokens (the Round-1 F1 method), is at or
    under the venue limit. When no different confirmed limit is established, the roadmap's ≤200 words
    applies. The abstract also contains one sentence stating the exploratory status of the statistics.
    A different confirmed limit found only in the Response Letter is a Phase 2B matter.
  partially_addressed: >-
    The abstract is shortened substantially from 320 tokens but still exceeds the applicable limit. Or
    it is within the limit but the exploratory-status sentence has been dropped.
  made_worse_discriminator: >-
    The abstract is longer than the ORIGINAL 320 tokens. Or it stays over the limit and has also lost
    the exploratory-status statement.
  letter_requirement_extras_non_gating: "three results with one number each; κ, answerable-query count and pending-study sentence moved to body"
expected_change_surface: "Abstract"
equivalence_policy: allowed
source_reviewer: "EIC W4"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [EIC]
verified_by: EIC
```

### REV-06 / R5 · routed seat R3 (Card #4, Perspective: HCI and developer tools)

```yaml
item_id: REV-06
obligation_class: must_fix
driving_severity: major   # R3 W1; EIC W5 minor (Disagreement 3, resolved major)
inherited_criterion:
  roadmap_text: |-
    REV-06: Describe the interaction model: how confidence is displayed, what a rejection shows, print vs run, any confirmation step; state what calibrated confidence enables or that this is untested
  letter_item_ref: R5
  letter_text: |-
    The manuscript contains a paragraph describing the tool's display, rejection behavior and execution mode, and an explicit statement of what user benefit is claimed or that it is untested.
  level3_anchor: 'text: §9 "It improves the confidence users see, not the answers or their ranking."'
persona_lens: >-
  Card #4 focus 1: does the paper say what the person at the terminal sees and does? No user study
  is required (R3 W1; Disagreement 3).
operationalization:
  fully_addressed: >-
    One paragraph (located anywhere) states all of the following about the published tool: (a) whether
    and how confidence is displayed, for example as a percentage and whether it is capped, or that it
    is not displayed; (b) what the user receives when a query is rejected; (c) whether a command is
    printed for the user or run; (d) whether any confirmation step exists, including "none" if there is
    none. The manuscript also contains an explicit sentence that either names the user benefit claimed
    for calibrated confidence or states that such benefit is untested.
  partially_addressed: >-
    Some of (a)-(d) are described but not all, for example the display without the rejection behaviour
    or the execution mode. Or (a)-(d) are all present, but the benefit-or-untested sentence is missing
    or only implied.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: new text asserts a user benefit of calibration as a finding without
    evidence (for example "users can now trust"). Or existing hedges are removed, such as "changes
    reported confidence, not decisions" or the absence of a human study.
  letter_requirement_extras_non_gating: none
expected_change_surface: "new short paragraph in §1 or §3; possibly §9"
equivalence_policy: allowed
source_reviewer: "R3 W1, R3 W5, R3 Q1; EIC W5, EIC Q4"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R3, EIC]
verified_by: R3
```

### REV-07 / R6 · routed seat R2 (Card #3, Domain: semantic parsing, NL-to-command, IR)

```yaml
item_id: REV-07
obligation_class: must_fix
driving_severity: major   # R2 W1; EIC W6 minor (Disagreement 2, resolved major)
inherited_criterion:
  roadmap_text: |-
    REV-07: Add a related-work paragraph on retrieval-based command and documentation assistance (NLC2CMD TF-IDF entry, ShellFusion, DocPrompting, CLAI); restate the gap; qualify §1's "dominant trajectory … generative"
  letter_item_ref: R6
  letter_text: |-
    §2 cites and positions the four named works, the gap statement is restated relative to them, and §1 acknowledges retrieval as a baseline in NLC2CMD.
  level3_anchor: 'text: §2 "A targeted search (Limitations) found no prior evaluation of calibration, OOD rejection, and selective prediction for closedvocabulary natural-language-to-shell retrieval"'
persona_lens: >-
  Card #3 focus 1: are the closest retrieval-based command assistants cited and positioned, and does
  the narrow novelty claim still stand against them?
operationalization:
  fully_addressed: >-
    (a) §2 cites all four works, each with a positioning statement relating it to this paper: the
    NLC2CMD TF-IDF retrieval entry (team AINixCLAISimple in Agarwal et al. 2021; per R2 W1 it had a
    learned confidence adjuster), ShellFusion (Zhang et al., ICSE 2022), DocPrompting (Zhou et al., ICLR
    2023) and Project CLAI (Agarwal et al., 2020). All four appear in the reference list. (b) The gap
    statement is restated relative to these works: retrieval for shell commands exists and has reported
    ranking quality, and its reliability has not been evaluated, or an equivalent. (c) §1's
    "dominant trajectory … generative" sentence is qualified to acknowledge that retrieval was a
    competitive entry or baseline in NLC2CMD. Descriptions must not contradict the source facts R2
    reported. An evidence-backed author correction of those facts is admissible.
  partially_addressed: >-
    Only some of the four works are cited and positioned. Or all four are cited without a restated gap.
    Or (a) and (b) are met but §1 is unqualified.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: the gap or novelty claim is broadened (for example, "no prior retrieval
    work for shell"), or newly added descriptions of the named works contradict the Round-1
    reviewer-verified content.
  letter_requirement_extras_non_gating: "verify each citation (process; evidenced only through accuracy of the descriptions)"
expected_change_surface: "§1 paragraph 1; §2 Related Work; References"
equivalence_policy: allowed
source_reviewer: "R2 W1, R2 Q1; EIC W6"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R2, EIC]
verified_by: R2
```

### REV-09 / R7 · routed seat EIC (Card #1)

```yaml
item_id: REV-09
obligation_class: must_fix
driving_severity: minor   # EIC W7; DA m1
inherited_criterion:
  roadmap_text: |-
    REV-09: Use "answerable" only for the 121; "non-OOD" for 159/135; label 67.3% as overall including controls and OOD, or replace it
  letter_item_ref: R7
  letter_text: |-
    Every use of "answerable" refers to the 121-query set, and every headline percentage names its population.
  level3_anchor: 'text: Abstract "it wrongly rejects 11 of 159 answerable queries" vs text: §3 "the 121 answerable queries are identical in both versions"'
persona_lens: "Card #1 focus 3: consistent terms in the abstract and the false-rejection caveat."
operationalization:
  fully_addressed: >-
    Every occurrence of "answerable" refers to the 121-query set. The 159-query and 135-query sets carry
    a distinct term such as "non-OOD" ("non-OOS" is equivalent if REV-35's renaming is adopted). The
    67.3% figure, if kept, is labelled as overall accuracy including controls and OOD queries, or it is
    replaced by a figure whose population is named. Every headline percentage (Abstract, contribution
    list, §9, §10) names its population.
  partially_addressed: >-
    Terminology is fixed in some loci (for example the Abstract) but "answerable" still denotes 159 or
    135 elsewhere. Or terminology is fixed but some headline percentages still lack a population.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: "answerable" is used for a further set, or headline percentages that
    previously named their population no longer do.
  letter_requirement_extras_non_gating: none
expected_change_surface: "Abstract; §6; §9 (plus §3, Limitations for consistency)"
equivalence_policy: allowed
source_reviewer: "EIC W7; DA m1"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [EIC, DA]
verified_by: EIC
```

### REV-11 / R8 · routed seat EIC (Card #1)

```yaml
item_id: REV-11
obligation_class: must_fix
driving_severity: minor   # EIC W9
inherited_criterion:
  roadmap_text: |-
    REV-11: Anonymize the package name and publication pointer in the review version; state neutrally whether the authors developed the audited baseline
  letter_item_ref: R8
  letter_text: |-
    The review build contains no searchable package name or publication pointer, and it states the authors' relationship to the audited baseline.
  level3_anchor: 'text: §1 "implemented in a real, previously published npm package" (F13: §3 heading names the package)'
persona_lens: >-
  Card #1: double-blind conformance and honest framing of the audit. As in Round 1, the verifier does
  not search for the package; the check is on the text only.
operationalization:
  fully_addressed: >-
    (a) The manuscript under review contains no occurrence of the package's name, in headings, body,
    captions, references or acknowledgements, and no pointer that resolves to the published package: a
    URL, a repository or registry link, a registry name combined with enough identifying detail for a
    lookup, or version identifiers. A generic statement that a published tool is audited is permitted.
    (b) One neutral, third-person sentence states whether the authors developed the audited baseline.
  partially_addressed: >-
    (a) is met but (b) is missing, or the reverse. Or the name is removed from the body but remains in a
    heading, caption, reference or artifact link.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: new identifying information is added (a URL, repository link or named
    handle). Or the ownership framing becomes more misleading, for example by presenting the audit as
    independent while retaining "our own baseline audit".
  letter_requirement_extras_non_gating: none
expected_change_surface: "§1; §3 heading; §8; Ethical Considerations; any artifact/URL mention"
equivalence_policy: allowed
source_reviewer: "EIC W9, EIC Q1"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [EIC]
verified_by: EIC
```

### REV-12 / R9 · routed seat EIC (Card #1; the first label is EIC, and R2 W6 corroborates)

```yaml
item_id: REV-12
obligation_class: must_fix
driving_severity: minor   # EIC W10; R2 W6
inherited_criterion:
  roadmap_text: |-
    REV-12: Correct the BashCoder-R1 description (static-analysis reward; FullRate definition) in §1 and §2; align the reference title with the version of record
  letter_item_ref: R9
  letter_text: |-
    §1 and §2 describe BashCoder-R1's reward and metric as the version of record states them, and the reference title matches that version.
  level3_anchor: 'text: §2 "despite reinforcement-learning training against execution feedback"'
persona_lens: "Card #1 focus 1: honest positioning against the generation line."
operationalization:
  fully_addressed: >-
    In both §1 and §2: BashCoder-R1 is no longer described as execution-grounded or trained against
    execution feedback. Its RL reward is described as static checks, meaning syntax (`bash -n`),
    shellcheck robustness and format compliance, as R2 W6 and EIC W10 reported from the source. Its
    90%/73% figures are glossed as FullRate, the combined syntax, robustness and functional-correctness
    rate, not as functional success alone. The reference-list title matches the version of record,
    which EIC W10 reports as the ISSTA 2026 program title "... Bash Script Generation". An
    evidence-backed author statement that the version of record says otherwise is admissible.
  partially_addressed: >-
    Only one of §1 and §2 is corrected. Or the reward is corrected but the FullRate gloss or the
    reference title is not.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: the execution-feedback mischaracterisation appears in more places, or
    BashCoder-R1 is used more strongly as support for "exact-match accuracy alone is an incomplete
    signal".
  letter_requirement_extras_non_gating: "re-check whether the sentence still supports 'exact-match accuracy alone is an incomplete signal'"
expected_change_surface: "§1; §2; References"
equivalence_policy: allowed
source_reviewer: "EIC W10; R2 W6"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [EIC, R2]
verified_by: EIC
```

### REV-14 / R10 · routed seat R1 (Card #2, Methodology: small-sample inference, calibration, selection effects)

```yaml
item_id: REV-14
obligation_class: must_fix
driving_severity: major   # R1 W1; corroborated EIC W3/Q3; DA m2 counter-evidence (Disagreement 6, unresolved)
inherited_criterion:
  roadmap_text: |-
    REV-14: Quantify the OOD selection effect: drafted, discarded and edited candidates at screening; per-fold thresholds vs the 7.39/0.31 bounds; detection reported separately on unscreened items; restate "smaller gain" in rates
  letter_item_ref: R10
  letter_text: |-
    §3 or §6 reports the screening counts (or states they are unavailable), the per-fold thresholds, and separate detection results for the unscreened items, and the "smaller gain" sentence is stated in rates.
  level3_anchor: 'text: §3 "The new OOD queries were confirmed as OOD partly with the system''s own retrieval scores"'
persona_lens: >-
  Card #2 focus 3: benchmark and leakage threats, specifically the OOD selection effect. No conclusion
  may be stronger than the design supports.
operationalization:
  fully_addressed: >-
    (a) The number of OOD candidates drafted, and the numbers discarded and edited at the score-screening
    step, are reported, or the manuscript states explicitly that no such record exists. (b) The per-fold
    tuned OOD thresholds are reported next to the screening bounds (top-1 BM25 ≤ 7.39, dense ≤ 0.31), in
    comparable units or with the relation stated. (c) Detection on the 15 unscreened original OOD items
    is reported separately from detection on the added items. (d) The original-versus-added comparison
    is stated in rates (for example +33.3 vs +34.3 points), or the "smaller gain" wording is removed in
    favour of a rate statement. Any sentence about the size of the selection effect must match the
    reported numbers. Disagreement 6 does not have to be resolved. Location: §3 or §6, or an appendix
    that §3 or §6 points to.
  partially_addressed: >-
    Some of (a)-(d) are present. For example, thresholds and a subset breakdown are reported, but the
    screening counts are neither reported nor declared unavailable. Or the rates are restated but no
    per-fold thresholds are given.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: the disclosure that the added items were score-screened is weakened or
    removed. Or a new claim that the selection effect is absent or negligible appears without supporting
    numbers.
  letter_requirement_extras_non_gating: "candidate scores; detection on added items that would have passed without screening; EIC Q3 subset (15 original + 10 terminal-task)"
expected_change_surface: "§3 (Benchmark v0.2 construction); §6 OOD paragraph; appendix"
equivalence_policy: allowed
source_reviewer: "R1 W1, R1 Q1; EIC W3, EIC Q3; DA m2"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R1, EIC, DA]
verified_by: R1
```

### REV-15 / R11 · routed seat R1 (Card #2)

```yaml
item_id: REV-15
obligation_class: must_fix
driving_severity: major   # R1 W2; DA M1 major (Disagreement 7 unresolved; F4)
inherited_criterion:
  roadmap_text: |-
    REV-15: Make the calibration magnitudes interpretable: equal-mass plus debiased or sweep ECE; noise floor; no-skill (base-rate) ECE/Brier or Brier decomposition; intervals on relative reductions; lead with Brier and its paired interval; state the population
  letter_item_ref: R11
  letter_text: |-
    The manuscript reports these reference values and intervals next to each headline ECE reduction, and the headline wording matches whatever magnitude survives them.
  level3_anchor: 'text: §5 "ECE uses 10 equal-width bins (Pakdaman Naeini et al., 2015; Guo et al., 2017), reported with the Brier score"'
persona_lens: >-
  Card #2 focus 2: calibration-metric estimation bias at n≈110–134 with heavy ties at maximum
  confidence. Is the "79%" stable?
operationalization:
  fully_addressed: >-
    The manuscript reports all of the following:
    (a) ECE under equal-mass binning.
    (b) At least one debiased or sweep ECE estimator.
    (c) A noise floor: the expected ECE of a perfectly calibrated predictor at the same n.
    (d) A no-skill reference: the ECE and Brier score of a constant base-rate forecaster, or a Brier
        reliability/resolution decomposition.
    (e) Bootstrap intervals for the relative ECE reductions.
    (f) The Brier score with a paired interval, presented first or alongside ECE in the calibration
        headline.
    (g) The evaluation population for ECE and Brier.
    (h) Placement: every headline ECE-reduction statement (Abstract, §6, §9, §10) either carries the
        reference values or has, in the same paragraph, a pointer to them and a sentence saying whether
        the magnitude survives them. The letter's "appendix table plus one main-text sentence" is
        treated as satisfying "next to".
    (i) The headline magnitude wording agrees with the new estimators. If the debiased or equal-mass
        reductions are materially smaller, or the calibrated forecaster is not clearly better than no
        skill, the headline percentage or wording is qualified accordingly.
  partially_addressed: >-
    Some of (a)-(g) are reported. Or all are reported in an appendix, but the headline magnitude wording
    is unchanged although the new values materially contradict it. Or the population is still unstated.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: the headline calibration magnitudes are stated more strongly (a larger
    percentage, or "eliminates overconfidence") without the references. Or the existing Brier values or
    intervals are removed. Or the population is made less clear.
  letter_requirement_extras_non_gating: none
expected_change_surface: "§5 metric definitions; §6 calibration paragraph; appendix table; headline sentences in Abstract/§9/§10"
equivalence_policy: allowed
source_reviewer: "R1 W2; DA M1"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R1, DA]
verified_by: R1
```

### REV-16 / R12 · routed seat R1 (Card #2)

```yaml
item_id: REV-16
obligation_class: must_fix
driving_severity: major   # R1 W3 (R1's own D4 = block under its pre-committed trigger)
inherited_criterion:
  roadmap_text: |-
    REV-16: Specify the fusion equation, score normalisation, hybrid confidence, margin/entropy, α grid, threshold objective, and how detector features were chosen (inside CV or not); state which top-1 score the detector uses
  letter_item_ref: R12
  letter_text: |-
    A reader can re-implement fusion, confidence, both detectors and their tuning from the text alone, and the manuscript states whether feature selection was inside CV.
  level3_anchor: 'absence: §4 and §5 — expected fusion formula, score normalisation, hybrid confidence definition, threshold-selection objective, search grids and feature-selection procedure'
persona_lens: >-
  Card #2 reproducibility (R1 pre-committed D4): could an independent statistician re-run the tuned
  system from the text?
operationalization:
  fully_addressed: >-
    The main text or appendix gives a formula or an unambiguous procedure for each of the following:
    (1) normalisation of BM25 scores and cosine similarities; (2) the fusion equation with α; (3) the α
    search grid; (4) the hybrid's fused-score confidence, meaning the quantity that is calibrated and
    used for AURC; (5) margin and entropy over the top 10; (6) the threshold-selection objective for the
    OOD and ambiguity detectors, together with their search grids; (7) how the detector features were
    chosen and whether that choice was made inside CV; (8) which top-1 score (BM25 or fused) the OOD
    detector thresholds. "α is tuned" without a grid and an objective does not satisfy (3) and (6).
  partially_addressed: >-
    Some of (1)-(8) are specified. For example, the fusion equation and confidence are given, but the
    selection objective or the inside-CV statement is missing.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: the new specification contradicts other reported facts, creating an
    internal inconsistency (for example, the detector's score is stated one way in §4 and another in
    §6). Or previously given details (seed, fold count, resample count) are removed.
  letter_requirement_extras_non_gating: none
  note: "If the specification reveals feature selection outside CV, REV-16 is judged only on whether it is disclosed; the leakage itself is a NewIssueRecord (see NS-1)."
expected_change_surface: "§4 (plus a specification appendix); §5"
equivalence_policy: allowed
source_reviewer: "R1 W3, R1 Q2; DA M3"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R1, DA]
verified_by: R1
```

### REV-26 / R13 · routed seat R1 (Card #2)

```yaml
item_id: REV-26
obligation_class: must_fix
driving_severity: minor   # R1 W12 minor; DA M2 major
inherited_criterion:
  roadmap_text: |-
    REV-26: Give a paired interval for the correctness-AUROC difference and pooled AUROCs with CIs, or reword §9 so that the ranking claim rests on AURC/AUGRC only
  letter_item_ref: R13
  letter_text: |-
    Every ranking metric named in §9 either carries an interval or is removed from the claim.
  level3_anchor: 'text: §6 "correctness AUROC, which isolates ranking, is 0.858 vs. 0.755 on v0.1 and 0.889 vs. 0.830 on v0.2"'
persona_lens: "Card #2 'particularly care about': effect sizes with intervals where the claim rests on them."
operationalization:
  fully_addressed: >-
    Either route is acceptable. Route A: the manuscript reports a paired bootstrap or DeLong interval
    for the hybrid-minus-baseline correctness-AUROC difference, together with pooled AUROCs with CIs, and
    every other ranking metric §9 cites also has an interval. Route B: §9's ranking claim no longer names
    correctness AUROC, or any other ranking metric without an interval, as evidence, and rests on
    AURC/AUGRC, which carry paired intervals.
  partially_addressed: >-
    Intervals are given for the individual AUROCs but not for the paired difference. Or §9 is reworded
    but still names correctness AUROC, or another un-intervalled ranking metric, as supporting evidence.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: §9 cites more ranking metrics without intervals as evidence, or states the
    ranking claim more strongly without added uncertainty quantification.
  letter_requirement_extras_non_gating: none
expected_change_surface: "§6 ranking paragraph; §9"
equivalence_policy: allowed
source_reviewer: "R1 W12; DA M2"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R1, DA]
verified_by: R1
```

### REV-32 / R14 · routed seat R2 (Card #3)

```yaml
item_id: REV-32
obligation_class: must_fix
driving_severity: major   # R2 W2
inherited_criterion:
  roadmap_text: |-
    REV-32: Correct the NLC2CMD metric description (confidence-weighted); explain how ECE/AURC/AUGRC differ from it; cite CLAI
  letter_item_ref: R14
  letter_text: |-
    §2's description of the NLC2CMD metric matches the source and includes a sentence contrasting it with the paper's reliability metrics.
  level3_anchor: 'text: §2 "The NLC2CMD competition (Agarwal et al., 2021) introduced a utility+flag-overlap metric more tolerant of near-miss answers than exact match."'
persona_lens: "Card #3: accurate description of cited work on the paper's own angle (reliability)."
operationalization:
  fully_addressed: >-
    §2 describes the NLC2CMD metric as incorporating each prediction's confidence (confidence-weighted),
    consistent with R2's reading of arXiv 2103.02523v2. It includes at least one sentence contrasting
    ECE, AURC and AUGRC with a confidence-weighted task score. The CLAI citation required by the roadmap
    text is satisfied if CLAI is cited anywhere in §2, and REV-07 already requires this. The letter
    softens it to "Consider citing CLAI".
  partially_addressed: >-
    The metric description is corrected but there is no contrast sentence. Or a contrast sentence is
    present but the description still omits the confidence weighting.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: a new misdescription of NLC2CMD is added, or the text asserts that
    NLC2CMD had no confidence component.
  letter_requirement_extras_non_gating: "why the difference matters for a deployed assistant"
expected_change_surface: "§2 NLC2CMD sentence"
equivalence_policy: allowed
source_reviewer: "R2 W2"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R2]
verified_by: R2
```

### REV-40 / R15 · routed seat R3 (Card #4)

```yaml
item_id: REV-40
obligation_class: must_fix
driving_severity: major   # R3 W1; R3 W3 minor; DA M4 major
inherited_criterion:
  roadmap_text: |-
    REV-40: Scope the user- and distribution-facing calibration claims: reword "the number users see" and "the confidence users see"; limit calibration claims to the benchmark distribution; add a Limitations bullet on non-user queries; say what data a deployed calibrator would be fitted on
  letter_item_ref: R15
  letter_text: |-
    No sentence in §6, §9 or §10 attributes a user benefit to calibration, the claims name the benchmark distribution, and Limitations covers the non-user query source.
  level3_anchor: 'text: §9 "It improves the confidence users see, not the answers or their ranking."'
persona_lens: >-
  Card #4 focus 1 and focus 3: does the reliability claim stay at the scope measured (a constructed
  benchmark mix, no users)?
operationalization:
  fully_addressed: >-
    (a) "The number users see" and "the confidence users see" are reworded to describe the metric
    property, or removed, and no sentence in §6, §9 or §10 attributes a user benefit to calibration. A
    factual description of what the tool displays, added under REV-06, is not a benefit attribution.
    (b) Calibration claims name the benchmark distribution, for example "on this benchmark's query mix".
    (c) Limitations contains a bullet stating that the queries were not drawn from real users. (d) The
    manuscript states what data a deployed calibrator would be fitted on. Item (d) comes from the
    level-1 roadmap text.
  partially_addressed: >-
    The phrases are reworded in some sections but a user-benefit attribution remains in §6, §9 or §10.
    Or (a) and (b) are met but the Limitations bullet or the deployed-calibrator statement is missing.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: new user-benefit or deployment-generalisation claims are added (for
    example "calibrated confidence helps users decide"). Or the Split B attenuation disclosure
    (77.2%→69.0% on v0.2) is removed.
  letter_requirement_extras_non_gating: none
expected_change_surface: "§6 calibration sentence 2; §9; §10; Limitations"
equivalence_policy: allowed
source_reviewer: "R3 W1, R3 W3, R3 Q3; DA M4"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R3, DA]
verified_by: R3
```

### REV-42 / R16 · routed seat R3 (Card #4)

```yaml
item_id: REV-42
obligation_class: must_fix
driving_severity: major   # R3 W2
inherited_criterion:
  roadmap_text: |-
    REV-42: Report a joint table of correctness × the classifier's risk level of the returned command × confidence band, for both systems
  letter_item_ref: R16
  letter_text: |-
    The manuscript reports the correctness × risk × confidence cross-tabulation for both systems, or explicitly states why it cannot be computed and narrows the destructive-command motivation.
  level3_anchor: 'text: §4 "A sixth, independent component, a rule-based safety classifier, targets command risk, which is orthogonal to retrieval correctness."'
persona_lens: >-
  Card #4 focus 2: a shell-command reliability paper must be able to say how often the tool is
  confidently wrong with a destructive command.
operationalization:
  fully_addressed: >-
    Either route is acceptable. Route A: a table, in the main text or an appendix, crosses correctness
    (correct, incorrect, and rejected where applicable) with the risk level of the returned command and
    a confidence band, for both the BM25 baseline and the hybrid. It states the risk source (classifier
    applied to returned commands, or gold labels) and the band edges. Route B: an explicit statement of
    why the cross-tabulation cannot be computed, together with a narrowing of the destructive-command
    motivation, so that §1 and contribution (1) no longer claim to address destructive-command cost
    beyond what is measured.
  partially_addressed: >-
    The table covers one system only. Or it omits one dimension (for example correctness × risk without
    confidence). Or the route-B statement is given without narrowing the motivation.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: a safety claim is introduced or the destructive-command motivation is
    strengthened without the cross-tabulation. Or the existing "we therefore make no safety claim"
    stance is removed.
  letter_requirement_extras_non_gating: none
expected_change_surface: "§7 (or a new appendix table); §1 motivation and contribution (1)"
equivalence_policy: allowed
source_reviewer: "R3 W2, R3 Q2; DA m10"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [R3, DA]
verified_by: R3
```

### REV-49 / R17 · routed seat EIC (DA-only item; Card #1; see the competence caveat in §3)

```yaml
item_id: REV-49
obligation_class: must_fix
driving_severity: major   # DA M3 (SINGLE-VERIFIER)
inherited_criterion:
  roadmap_text: |-
    REV-49: Treat the OOD result as an operating-point comparison: report baseline-score OOD AUROC, the baseline's non-OOD false rejections, and rejection at a matched false-rejection rate (or a threshold sweep); or reword it as an operating-point change
  letter_item_ref: R17
  letter_text: |-
    The OOD result is compared at a matched false-rejection rate with the baseline's AUROC reported, or it is explicitly described as an operating-point change everywhere it is stated.
  level3_anchor: 'text: §6 "the tuned OOD detector raises the rejection rate on OOD queries from the baseline''s 34.0% to 68.0%"'
persona_lens: >-
  Card #1 "particularly care about": the headline must be what the evidence supports. The EIC checks
  presence and consistency; statistical adequacy is noted for R1-competence review.
operationalization:
  fully_addressed: >-
    Either route is acceptable. Route A: the manuscript reports (a) the baseline score's OOD AUROC,
    (b) the baseline's false rejections on non-OOD queries, and (c) OOD rejection of both systems at a
    matched false-rejection rate, or a sweep of the baseline threshold that lets the reader make that
    comparison. Route B: every statement of the OOD result (Abstract, §6, §9, §10) describes it as a
    change of operating point, meaning a different rejection threshold or detector with its
    false-rejection cost, and not as an unqualified improvement in OOD-detection ability.
  partially_addressed: >-
    Some route-A quantities are reported (for example the AUROC without a matched-false-rejection
    comparison). Or route-B wording is applied in some loci but at least one statement of the OOD result
    remains unqualified.
  made_worse_discriminator: >-
    Relative to the ORIGINAL: the OOD result is stated more strongly (for example "doubles OOD rejection
    at no cost"), or the reporting of the false-rejection cost is weakened or removed.
  letter_requirement_extras_non_gating: none
expected_change_surface: "§6 OOD paragraph; §9; §10; Abstract"
equivalence_policy: allowed
source_reviewer: "DA M3"
source_reviewer_labels: []            # PARSE_FAILURE
seat_prefix_labels_manual: [DA]       # no non-DA label → EIC
verified_by: EIC
```

---

## 5. should_fix pre-commitment records (25, lighter form)

Each record below has `obligation_class: should_fix`, `equivalence_policy: allowed`, `source_reviewer_labels: []` (strict parse failure, as in §3), and no `letter_text` or `letter_item_ref`: the letter's Acceptance-criteria blocks cover Required items only. `roadmap_text` is the verbatim Revision Item cell. PARTIALLY_ADDRESSED and MADE_WORSE derive from the committed pattern and the generic discriminator in §2.

| item_id (S ref) | roadmap_text (verbatim) | operationalization.fully_addressed | expected_change_surface | source_reviewer (verbatim) | seat-prefix labels | verified_by |
|---|---|---|---|---|---|---|
| REV-05 (S1) | REV-05: Say plainly that recalibrating a heuristic score is expected to help; argue what is not obvious | §6 or §9 states explicitly that recalibrating the clipped heuristic confidence is expected to reduce ECE. It also gives at least one sentence on what is non-obvious in the result, for example the magnitude at this n, the agreement across calibrators, or survival under grouping. | §6, §9 | EIC W5 | [EIC] | EIC |
| REV-08 (S2) | REV-08: State that no generative baseline is run and the comparison with generation is conceptual (including the RQ's "without the cost or hallucination risk" clause) | The manuscript states that no generative baseline is run and that the comparison with generation is conceptual. The RQ's comparative clause is removed or explicitly marked as not measured. | §1 RQ | EIC W6; DA m11 | [EIC, DA] | EIC |
| REV-10 (S3) | REV-10: Move one compact figure (reliability diagram or risk-coverage) into the main text; replace Table 4 with one sentence | At least one reliability-diagram or risk-coverage figure is in the main text. Table 4 (Split B) is no longer a main-text table and is summarised in one main-text sentence; it may stay in the appendix. | §6 | EIC W8 | [EIC] | EIC |
| REV-18 (S6) | REV-18: Use one interval method dual to the test; add a mid-p or unconditional sensitivity check; state that the v0.2 verdict depends on the method | The accuracy comparisons use one interval method dual to the stated test, for example an exact conditional interval for the discordant share, or a score interval with its matching test. A mid-p or unconditional test is reported as a sensitivity check. The text states explicitly whether the v0.2 verdict depends on the method. | §6, Table 2 | R1 W4 | [R1] | R1 |
| REV-19 (S7) | REV-19: Headline the pre-named calibration comparison, or label the baseline figure as secondary and uncorrected | The Abstract and §9 either headline the Holm family's pre-named calibration comparison, or label the shipped-baseline figure (79%) as a secondary view outside the corrected family. | Abstract, §9 | R1 W5 | [R1] | R1 |
| REV-20 (S8) | REV-20: Report the bootstrap p as a bound, carry "≤" into Holm, and state each test's sidedness | Table 2 writes the bootstrap p as a bound (≤, or (k+1)/(B+1)). The Holm-adjusted values for those rows are written as ≤ bounds. The sidedness of each family member is stated. | Table 2 | R1 W6 | [R1] | R1 |
| REV-21 (S9) | REV-21: Soften "confirmed" to "agreed on all 8"; give the exact interval; say how many of the 8 were terminal-task OOD | §8 and Limitations use agreement wording rather than "confirmed", report the exact (Clopper–Pearson) interval for 8/8, and state how many of the 8 sampled items were terminal-task OOD. | §8, Limitations | R1 W7, R1 Q4 | [R1] | R1 |
| REV-22 (S10) | REV-22: Complete the OOD partition (the 6 unreported queries) | The §6 OOD breakdown accounts for all 50 OOD queries, including a third category with detector and baseline rejection counts, or it states why 6 are excluded. | §6 | R1 W8; DA m4 | [R1, DA] | R1 |
| REV-23 (S11) | REV-23: Repeat CV over 10–20 partition seeds; report the spread of the accuracy delta, discordant counts, ECE and AURC | Results over at least 10 CV partition seeds are reported, with the spread for the accuracy delta, the discordant counts, ECE (before and after calibration) and AURC. | §6, appendix | R1 W9, R1 Q3; DA m12 | [R1, DA] | R1 |
| REV-24 (S12) | REV-24: Describe the inner CV procedure exactly, or drop "nested"; say how the isotonic training scores are produced | The inner selection procedure is described exactly (pooled four folds versus an inner CV), or the word "nested" is dropped. The manuscript states whether the calibrator's training scores are in-sample on the dev folds or out-of-fold. | §5 | R1 W10 | [R1] | R1 |
| REV-27 (S14) | REV-27: Rephrase "validates benchmark quality" | "Validates benchmark quality" is removed or replaced by wording limited to the executability of the sampled gold commands. | §7 | R1 W13; DA m8 | [R1, DA] | R1 |
| REV-28 (S15) | REV-28: State the inclusion rule for the 125 safety-scored gold commands | §7 states which 125 gold commands were safety-scored, and whether all 20 high- and critical-risk items are among them. | §7 | R1 W14, R1 Q4 | [R1] | R1 |
| REV-29 (S16) | REV-29: Report paired differences between calibrators (Brier or debiased ECE), or soften "does not depend on isotonic regression" | Paired bootstrap differences between calibrators on Brier or debiased ECE are reported. Otherwise, the calibrator-independence claim is softened so that it no longer rests on overlapping marginal intervals. | §6, §9 | R1 W15 | [R1] | R1 |
| REV-33 (S19) | REV-33: Add 2–3 sentences on tool/API retrieval, fusion functions (DPR, RRF, Bruch et al.) and ranker/semantic-parser calibration | §2 or §4 adds sentences that cite and position: (i) tool/API retrieval work; (ii) the fusion functions DPR, RRF and Bruch et al.; (iii) ranker or semantic-parser calibration work. Each is related to the paper's architecture or reliability results. | §2, §4 | R2 W3 | [R2] | R2 |
| REV-34 (S20) | REV-34: Add one stronger offline encoder (and optionally RRF) as a sensitivity row, or scope the hybrid claims to all-MiniLM-L6-v2 | A sensitivity row with at least one stronger offline encoder is reported. Otherwise, every hybrid-over-BM25 and hybrid-over-dense claim is explicitly scoped to all-MiniLM-L6-v2. | §6 | R2 W4, R2 Q2 | [R2] | R2 |
| REV-35 (S21) | REV-35: Use "out-of-scope" (or define OOD as such); separate in-domain from general OOS; replace "closed-vocabulary" with "closed-set" | "OOD" is replaced by "out-of-scope" or defined as out-of-scope. The distinction between in-domain and general out-of-scope requests is drawn, matching the split between terminal tasks and everyday requests. "Closed-vocabulary" is replaced by "closed-set" or "fixed-inventory". | throughout | R2 W5, R2 Q3 | [R2] | R2 |
| REV-37 (S23) | REV-37: Explain why no public NL-to-shell benchmark or mapped subset is used; say which system's output the queries were "checked against" | §3 or Limitations explains why public NL-to-shell benchmarks (NL2Bash, NLC2CMD, tldr, NL2SH) are not used or mapped, and states which system's retrieval output the queries were checked against. | §3, Limitations | R2 W9, R2 Q4; DA m9 | [R2, DA] | R2 |
| REV-38 (S24) | REV-38: R2 minor issues: NL2SH author list per the ACL Anthology record; mark the 2026 preprints as not peer-reviewed; hyphenation artefacts | The NL2SH reference author list matches the ACL Anthology record (without Miguel Tulla, per R2). The 2026 preprints are identified as preprints or not peer-reviewed. The fused-compound artefacts that Round 1 flagged are absent from the revised text. If the verifier's text is a PDF extraction, an artefact that may come from the extraction gets CANNOT_VERIFY for that sub-part. | References | R2 Minor Issues | [R2] | R2 |
| REV-39 (S25) | REV-39: Report one or two operating points that include a cost of harm, and analyze A5's degradation on v0.2, with the baseline at matched coverage | At least one operating point is defined with an explicit cost of harm, for example a budget on wrong answers shown at or above X% confidence, and the text says what a user would experience at it. A5's decline on v0.2 is analysed. The baseline is reported at matched coverage. | §7, §9 | R3 W1; DA m7 | [R3, DA] | R3 |
| REV-43 (S27) | REV-43: Name deployment safeguards (no auto-run, confirmation for high-risk commands, `-WhatIf`/`-Confirm`); consider a risk-dependent threshold | §9 names deployment safeguards beyond retrieval: no automatic execution, confirmation for high-risk commands, and `-WhatIf`/`-Confirm` where supported. It also discusses, and either adopts or explicitly declines, a risk-dependent threshold. | §9 | R3 W2 | [R3] | R3 |
| REV-45 (S29) | REV-45: Name the platform (Windows) in the abstract (title optional); optionally count platform-invalid returned commands | The Abstract names the evaluated platform (Windows). Changing the title and counting platform-invalid commands are optional and not required. | Abstract | R3 W6 (EIC S1 disputes; Disagreement 4) | [R3] (parenthetical stripped) | R3 |
| REV-46 (S30) | REV-46: Ethical Considerations: say what is being done for current users of the shipped package | Ethical Considerations states what is or is not being done for current users of the shipped package, for example a change to the display, a known-issue note, or whether a fix will ship. The wording must stay compatible with REV-11's anonymisation. | Ethical Considerations | R3 W7 | [R3] | R3 |
| REV-47 (S31) | REV-47: Give the positive case for the no-LLM constraint (privacy, determinism, air-gapped use, cost, latency) and what coverage is lost | §1 or §9 gives positive, deployment-setting reasons for the no-LLM constraint and states qualitatively what coverage is lost compared with an LLM assistant. | §1 or §9 | R3 W8 | [R3] | R3 |
| REV-48 (S32) | REV-48: R3 minor issues: abstract column break; `git checkout -- .` typesetting in the safety example (F12); "No LLM" stated once | The abstract is not split by a page or column artefact. The safety example reads `git checkout -- .`, or its intended form is confirmed. "No LLM" is stated once, not repeated across the Abstract, §1 and §4. Extraction-induced artefacts get CANNOT_VERIFY for that sub-part. | Abstract, §4, §7 | R3 Minor Issues | [R3] | R3 |
| REV-50 (S33) | REV-50: Explain why the same 15 original OOD queries give raw p = 0.25 (v0.1) and p = 0.0625 (v0.2 breakdown) | §6 states why the same 15 original OOD queries give different p-values in the v0.1 analysis and the v0.2 breakdown (for example, detectors tuned on different OOD sets), and what that implies for the v0.2 result on those items. | §6 | DA m3 | [DA] → EIC | EIC |

---

## 6. consider items (no pre-commitment record)

The following 12 items are decision-inert and route to EIC by definition. At Phase 2A they are assessed with `applied_criterion: not_precommitted`.

REV-13, REV-17, REV-25, REV-30, REV-31, REV-36, REV-41, REV-44, REV-51, REV-52, REV-53, REV-54.

---

## 7. NewStandardRecords

```yaml
new_standards:
  - new_standard_id: NS-1
    item_id: REV-16
    classification: escalation_requested   # a REQUEST only; lapses to advisory unless substantiated at Phase 2A
    requested_escalation_class: fatal_validity
    standard_text: >-
      If the specification that REV-16 requires shows that the OOD or ambiguity detector features,
      the α grid or the threshold objective were chosen using the full benchmark rather than inside the
      CV training folds, then the reported detector and hybrid results carry tuning leakage. REV-16's
      inherited criterion only requires the manuscript to STATE whether feature selection was inside CV.
      It does not require the headline OOD, ambiguity or ranking results to be re-estimated with the
      selection nested, or their sensitivity to it to be reported.
    why_not_in_round1: >-
      Round 1 could not see the procedure. R1 W3 flagged it as unknowable from the text ("A reviewer
      cannot check them for leakage, for example whether feature choice was made on the full data"), so
      the roadmap asked only for disclosure. R1's frozen D3 block trigger ("evaluation items or labels
      that inform model or threshold selection without nesting") would apply only once the disclosure
      exists.
    phase2a_handling: >-
      REV-16's verdict is judged only against its own operationalization, which is disclosure. If the
      disclosure shows out-of-CV selection, Phase 2A records a NewIssueRecord. Its attribution is
      previously_missed, because the design predates the revision and needs anchors in both versions,
      so it cannot move the decision under the goalpost guard. Only if Phase 2A substantiates that the
      leakage invalidates a headline comparison, with an original-manuscript anchor, may an
      EscalationExceptionRecord (class fatal_validity, new_standard_ref NS-1, approval_state pending)
      be emitted. That requires a human checkpoint. Otherwise NS-1 lapses to advisory.
```

**Considered and not recorded.** In each case the inherited criterion is not materially incomplete.

- **REV-15 / Disagreement 7.** The question is whether the recalibrated shipped confidence carries information. REV-15's required no-skill Brier reference, or the Brier decomposition's resolution term, already tests this. The "headline wording matches whatever magnitude survives" clause governs the wording.
- **REV-14 / Disagreement 6.** The size of the selection effect. The criterion requires reporting and rate restatement, not resolution. The scoping of the headline is carried by REV-03 and REV-49.
- **REV-11.** Possible de-anonymising pointers outside the evaluated text, such as PDF metadata or supplementary links. This is outside the manuscript evidence surface and is noted only for the human checkpoint.
- **REV-04.** The "confirmed venue limit" depends on author confirmation. The roadmap's ≤200 default is operative at Phase 2A, and any other confirmed limit is a Phase 2B rebuttal matter.

---

## 8. Summary

- **must_fix records: 17**, in derived R1–R17 order: REV-01, 02, 03, 04, 06, 07, 09, 11, 12, 14, 15, 16, 26, 32, 40, 42, 49. By routed seat:
  - EIC: 8 (including the DA-only REV-49);
  - R1: 4;
  - R2: 2;
  - R3: 3.
- **should_fix records: 25**, in lighter form. By routed seat:
  - EIC: 4 (including the DA-only REV-50);
  - R1: 10;
  - R2: 5;
  - R3: 6.
- **consider (no record): 12**: REV-13, 17, 25, 30, 31, 36, 41, 44, 51, 52, 53, 54.
- **Routing:**
  - Strict §10 grammar gives `[ROUTING-DEGRADED: unmapped labels — …]`, with all 42 records unparsed. This happens because the Round-1 letter's reviewer strings carry finding suffixes.
  - Personas were assigned by seat-prefix extraction under the letter's declared citation convention. Under that extraction the routing would be `card_mapped`.
  - The dispatching layer should record which of the two it adopts.
- **NewStandardRecords: 1**. NS-1 on REV-16 is a conditional `escalation_requested` of class `fatal_validity`. It covers possible out-of-CV feature selection and lapses to advisory unless substantiated at Phase 2A.
- **Phase 1 retry:** not used. No lint could run, because the checker is unavailable.

[CONTRACT-ACKNOWLEDGED]
