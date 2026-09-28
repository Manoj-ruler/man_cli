# Verification Review Report

Stage 3' re-review, Round 2, Phase 2B (claim matching, letter revealed) and decision derivation. `re_review_mode_protocol.md` § Phase 2B, § Decision Derivation, § Judge Provenance, § Commitment Ledger Verification, § Re-Review Output Format.

`[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`

## Judge Record (#539)

- **Verification judge**: `claude-opus-5-5` (Anthropic). This is the session's own model, running the dedicated Phase 2B integration call (Journal-Fit Reviewer / `EIC` wire label, synthesizer function). No same-named Round-1 agent file was dispatched.
- **Contract status**: `[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`. The four hard-required machine artifacts do not exist: input manifest 1.1, `revision-roadmap/1.0` JSON core, `author-adjudication/1.0` sidecar and `revision-evidence-bundle/1.0`. The dispatching layer chose to run the three gates by hand. `scripts/check_re_review_synthesis.py` was **not run**, and this report claims **no checker result**. The decision below is **NOT checker-verified**. As a substitute for hash binding, the SHA-256 of every input was recomputed in this call and matches the values recorded at Phase 1 and Phase 2A.
- **Round-1 panel provenance**:
  - **Strict carrier status: `carrier_absent`.** The Round-1 package never built the Schema 6 `review_panel_provenance` carrier (`phase2_editorial_decision.md`, Protocol and Contract Status item 3c: "No Schema 6 machine package or provenance carrier was built in this run"). This call did not replay-validate. Under the closed invalid form, every Round-1 axis is therefore `unknown` for machine purposes.
  - **Artifact-level record**, copied as the dispatching layer instructed and labelled as not carrier-replayed:
    - Artifact: `research/paper/review_round1/panel_provenance.json` (`review-panel-provenance/1.0`, panel `termassist-t14-review-round-1`, contract `reviewer/reviewer_full/v2`).
    - `artifact_sha256`: `c3905fe668a1d62e9d454585e95f1d5cc6775d06feda066a19e25b607dd3f7b6`. Recomputed in this call; matches the Round-1 record.
    - `normalized_manifest_sha256`: `60aad6d84f0a712d62969fd88e9a971d5bb8e976ac07644698fc6f909381d1b0`.
    - `execution_topology_sha256`: `c259b3f71e07a5edf63a2840650cfafb0d9380f68f5533b18fdd78f82f6e2603`.
    - Round 1 recorded `review-panel provenance: PASS` from the validator. That check was not re-run here.
  - **Six axes** (artifact-level): `role_separated: true`; `fresh_context: true` (scope `within_panel_attempt_only`); `blind_to_peer_outputs: true`; `model_family_distinct: false`; `provider_distinct: false`; `human_distinct: false`. `independence_claim: not_computed_from_personas`. All five seats are `claude-opus-5-5` / `anthropic`.
  - **Round-1 correlated-error disclosure** (artifact text, verbatim; `required: true`, reason `same_model_family`): "All model-executed review seats used one model family; role separation does not remove correlated-error risk."
- **Blind cross-model pass**: `not_configured`. The run-level same-family disclosure below applies, and every must_fix row carries `not_configured`.
- **Pre-committed criteria**: `precommitment_hash` `ea0119bc86d16feac793d44e9bad6da95ab92146a0bfd7d8c901573f191d9f41` (`phase1_criteria_commitment.md`, recomputed here and matching). The committed Phase 2A output used is `phase2a_evidence_verdicts.md`, SHA-256 `11c077fe92c8bd81f825a53a2321eb7608f127214c760cf3215bcc31ecdec48e` (recomputed here and matching). It was treated as immutable data. Its new-issue set is carried over below without any change.
- **Prompt/rubric surfaces**: `academic-paper-reviewer/references/re_review_mode_protocol.md`: § Three-Gate Orchestration / Phase 2B (relaxation boundary, closed basis set, critical-rebuttal check); § Decision Derivation (Steps 1–3, B1–B6, `should_fix_addressed_rate`); § New-Issue Attribution; § Judge Provenance; § Commitment Ledger Verification; § Re-Review Output Format. Contract family `shared/contracts/re_review/` version 1.1 is named, but it is not instantiated (no machine artifacts).
- **Reviewer configuration**: `round1_cards_reused` (Cards #1–#4, frozen; `field_analyst_agent` not re-invoked).
- **Routing**: `[ROUTING-DEGRADED: unmapped labels — unparsed REV-01 "EIC W1, EIC Q2; R2 W8"; unparsed REV-02 "EIC W2; DA Observation 3"; unparsed REV-03 "EIC W3; R1 W1"; unparsed REV-04 "EIC W4"; unparsed REV-05 "EIC W5"; unparsed REV-06 "R3 W1, R3 W5, R3 Q1; EIC W5, EIC Q4"; unparsed REV-07 "R2 W1, R2 Q1; EIC W6"; unparsed REV-08 "EIC W6; DA m11"; unparsed REV-09 "EIC W7; DA m1"; unparsed REV-10 "EIC W8"; unparsed REV-11 "EIC W9, EIC Q1"; unparsed REV-12 "EIC W10; R2 W6"; unparsed REV-14 "R1 W1, R1 Q1; EIC W3, EIC Q3; DA m2"; unparsed REV-15 "R1 W2; DA M1"; unparsed REV-16 "R1 W3, R1 Q2; DA M3"; unparsed REV-18 "R1 W4"; unparsed REV-19 "R1 W5"; unparsed REV-20 "R1 W6"; unparsed REV-21 "R1 W7, R1 Q4"; unparsed REV-22 "R1 W8; DA m4"; unparsed REV-23 "R1 W9, R1 Q3; DA m12"; unparsed REV-24 "R1 W10"; unparsed REV-26 "R1 W12; DA M2"; unparsed REV-27 "R1 W13; DA m8"; unparsed REV-28 "R1 W14, R1 Q4"; unparsed REV-29 "R1 W15"; unparsed REV-32 "R2 W2"; unparsed REV-33 "R2 W3"; unparsed REV-34 "R2 W4, R2 Q2"; unparsed REV-35 "R2 W5, R2 Q3"; unparsed REV-37 "R2 W9, R2 Q4; DA m9"; unparsed REV-38 "R2 Minor Issues"; unparsed REV-39 "R3 W1; DA m7"; unparsed REV-40 "R3 W1, R3 W3, R3 Q3; DA M4"; unparsed REV-42 "R3 W2, R3 Q2; DA m10"; unparsed REV-43 "R3 W2"; unparsed REV-45 "R3 W6 (EIC S1 disputes; Disagreement 4)"; unparsed REV-46 "R3 W7"; unparsed REV-47 "R3 W8"; unparsed REV-48 "R3 Minor Issues"; unparsed REV-49 "DA M3"; unparsed REV-50 "DA m3"]`.
  - Under strict §10 grammar every reviewer string fails to parse (finding-suffixed labels).
  - The dispatching layer chose manual seat-prefix extraction for the personas (Phase 1 §3; Phase 2A §0). Under that extraction every first non-DA label maps to a card: EIC→#1, R1→#2, R2→#3, R3→#4.
  - DA-only REV-49 and REV-50 route to EIC, with the competence caveat carried over.
- **Apply-report chain**: `apply_chain_witness: not_run_no_reports`. No patch 1.1 or apply report 1.3 exists. The only change artifact is a LaTeX content diff. The original manuscript is present and hash-matched.
- **Evidence seen by the judge**, with SHA-256 recomputed in this call:
  - revised manuscript `review_round2/manuscript_revised.txt`, `49ffed61412472125dda4c05e1ad8487e8979e0825dbb1e7f6101ff4b4fc588f` (untrusted author data);
  - original manuscript `review_round1/manuscript_review.txt`, `4fafa1af9799931c8fc82946c33a627b67628160c9f511deb1d98d882d0c9f84`;
  - LaTeX diff `review_round2/content_diff_a57c8c1_to_revised.patch`, `690aaa1406c8bbdc5711fea5e3da816b93b7a642cce0546e3b86f426f4e5a85e` (available to this call; not needed to decide any adjustment);
  - Response to Reviewers `T21_REVISION_LOG.md`, `3852b4587616d1d91bc460504312ba3cfeef6da101e0f32dc2b4916cae489aba`, fenced as UNTRUSTED author persuasion (Phase 2B only);
  - Round-1 decision letter and roadmap `review_round1/phase2_editorial_decision.md`, `23d0c26006f4a749354fa7bf2e6be7483d1e544e84f1daf4e610ba49fef52f2b`;
  - `review_round1/panel_provenance.json` (see above);
  - Phase 1 and Phase 2A outputs (see above).
  - **Deviations.** No apply reports. The Round-1 seat reports and cards were not re-read in this call: they reach it through the Phase 1 and 2A records. The letter's evidence files (`T18_*`, `T19_IMPLEMENTATION_FACTS.md`, `T6`, `research/results/**`) are outside the evidence surface and were not opened. The rendered PDF and figures were not seen.
- **Judging budget**: one Phase 2B integration call, about 190k input tokens read and about 20k output tokens. The Phase 1 and 2A budgets were not passed to this call.

This verification round ran on the same model family that drove the revisions; over-optimization to this judge's latent biases is possible (Ren et al. 2026, arXiv:2607.13104 §8.1.2).

**Additional correlation note.** The Response to Reviewers states "Claude triaged the items". The revision driver, the Round-1 panel, all three re-review gates and this judge are one model family. Agreement between the letter and this report should not be read as independent confirmation.

## Decision

**Major Revision**

- Base rule **B3**: two must_fix items fail, REV-11 (NOT_ADDRESSED) and REV-03 (MADE_WORSE).
- `reject_recommended: false`. No Step-3 floor applies.
- The decision is derived by hand and is **not checker-verified** (G0 note in the Decision Rationale).

## Phase 2B adjustment records (relaxation boundary)

Exactly one final verdict differs from its Phase 2A verdict. It is carried by the typed record below. No other row changed.

```yaml
- adjustment_id: ADJ-1
  item_id: REV-38            # S24, should_fix, R2 Minor Issues
  obligation_class: should_fix
  phase2a_verdict: PARTIALLY_ADDRESSED
  final_verdict: FULLY_ADDRESSED
  basis: valid_rebuttal
  direction: upgrade
  addressed_by_rebuttal: true
  # source_ref: forbidden for this basis (omitted)
  evidence_anchor:
    counter_evidence_letter_side: 'letter: Suggested items, row "Reviewer disagreement" — "S24: the NL2SH author list follows the published PDF (6 authors). The Anthology metadata omits one author; recorded in T6."'
    manuscript_side: 'text: References "Finnian Westenfelder, Erik Hemberg, Miguel Tulla, Stephen Moskal, Una-May O’Reilly, and Silviu Chiricescu. 2025. LLM-supported natural language to Bash translation. In Proceedings of the 2025 Conference of the Nations of the Americas Chapter of the Association for Computational Linguistics ..."'
  finding_rebutted: >-
    The only residual left at Phase 2A was the NL2SH author list, which R2 said should follow the ACL
    Anthology record (without Miguel Tulla). The Round-1 synthesizer did not verify this; it left the
    point "for the author to verify" (Factual Check F14).
  why_this_is_a_rebuttal_on_the_merits: >-
    The finding asserts a fact about the source: the reference lists an author the paper does not have.
    The letter does not decline or defer. It answers with specific, falsifiable counter-evidence about
    the same source: the published paper PDF lists six authors including Tulla, and the Anthology
    metadata record omits one. The two readings agree that the Anthology metadata lacks Tulla. They
    differ on which document is authoritative, and the paper's own author line is the version of record
    that a citation reproduces. If the counter-evidence is true, the reference is correct as it stands
    and the Round-1 correction would introduce an error. Phase 1's equivalence_policy (allowed) admits
    evidence-backed disagreement through this channel.
  verification_limit_disclosed: >-
    This judge did NOT verify the PDF author line. The counter-evidence is letter-side only, and T6 is
    outside the evidence surface. The manuscript side shows only that the six-author list is kept,
    which is consistent with the letter. It is booked because the claim rebuts the finding on the merits
    rather than asserting compliance. A human spot-check of the NL2SH PDF's author line is recommended;
    if the PDF does not list Tulla, ADJ-1 should be reversed.
  other_subparts: >-
    The 2026 preprint is marked as a preprint (met at 2A). The hyphenation artefacts come from the
    extraction and the LaTeX source is clean; that sub-part is CANNOT_VERIFY and non-decisive, as at 2A.
  critical_rebuttal_check: not_required   # Round-1 severity "— (editorial)", not critical; booked in-call
  decision_effect: >-
    None. PARTIALLY_ADDRESSED and FULLY_ADDRESSED both count in should_fix_addressed_rate, so the rate
    is unchanged at 19/25.
```

**Letter claims examined and not admitted.** Each of these changes nothing. For each, the author's claim was checked against the manuscript. Either the pointer leads to evidence Phase 2A had already seen and weighed, or the claim has no locatable manuscript evidence, or a decline was offered without evidence against the finding. Re-weighing evidence that 2A had already seen is not an admissible basis.

- **REV-11 (R8), declined and contested.** The letter gives two things: the author's decision D3 (a preference, not evidence), and the fact that "the review version names no URL, scope or repository".
  - That fact is true of the manuscript, but it does not rebut EIC W9. Criterion (a) also excludes the package name itself, and a registry name combined with identifying detail. §1 reads "TermAssist, an npm package that maps a query to one of 279 Windows commands".
  - Criterion (b), a neutral statement of the authors' relationship to the baseline, is not contested at all, and nothing supplies it.
  - The letter also records the decline as "pending the author's confirmation", so the decline is not yet a settled author choice. **Not a valid_rebuttal.**
- **REV-12 (R9), reference title.** The letter is silent on the title. Its general check, "30/30 cite keys resolve to verified entries", does not say that the BashCoder-R1 title matches the ISSTA 2026 version of record. EIC W10 reported that title as "... Bash Script Generation". The general check does not rebut that finding on the merits. **Not a valid_rebuttal.**
- **REV-49 (R17), "OOD at matched operating points".** The pointed evidence (46/50 vs 34/50, McNemar p = 0.004; shipped-score AUROC higher) is present, and 2A had already credited it.
  - The two rules are not at a matched false-rejection rate: 20 vs 11 of 159 on v0.2, and 9 vs 6 of 135 on v0.1.
  - The letter uses "matched" to mean the same tuning protocol. The criterion means a matched false-rejection rate or a sweep.
  - **No located evidence and no scope_correction.** The letter does not show that 2A misidentified the target.
- **REV-14 (R10).** Every pointed fact is present (all 35 drafts kept; maxima 7.39/0.31; +33.3 vs +34.3), and 2A had already credited each one.
  - The claim that the maxima are "observed values, not cut-offs" confirms that the screen discarded nothing. It does not supply the tuned shipped threshold's original-15 vs added-35 split in the v0.2 run, a definition of "keyword-verified", or the relation between the hybrid's thresholds and the bounds.
  - The letter itself concedes that "the effect favours the shipped score", which is the new headline arm.
  - **No scope_correction.** The item's target is "the OOD rejection result", and the tuned threshold now is that result.
- **REV-03 (R3).** The letter points to §5 for the screening facts and caveat. §5 is outside the item's loci (Abstract and §10, now §7), and 2A had already seen it. The Abstract and §7 still carry no screening clause and no unscreened result, and they have lost the original qualifiers. **No adjustment.**
- **REV-15 (R11).** The letter claims "equal-mass and sweep ECE" are reported. No value exists anywhere in the manuscript, only "equal-mass and sweep estimates agree". This is an assertion without locatable evidence. **No adjustment.**
- **REV-02 (R2).** The letter claims a "non-control population throughout" and that "caveats sit in Limitations". The manuscript contradicts both:
  - Table 1's own caption says out-of-scope rows use all queries, and its Holm row is "controls incl.".
  - Table 3 states no population.
  - The accuracy-fragility caveat appears in §1, §5, §6 and §7.

  **No adjustment.**
- **REV-10 (S3), declined.** The reason given is a feasibility and consistency obstacle: the existing figures include controls. It does not dispute EIC W8's point that the main text should stand without the appendix, and the letter concedes "There is now space". **Not a valid_rebuttal.**
- **REV-19 (S7).** The claimed label "baseline figure labelled outside the pre-named family" resolves to §5's "The pre-named comparison in the Holm family is this hybrid reduction", which 2A cited. There is no label at the committed loci, the Abstract and §6 (formerly §9). **No adjustment.**
- **REV-06, REV-20, REV-22, REV-24, REV-32, REV-37, REV-40, REV-43, REV-50.** In each case the letter's pointers resolve to text 2A had already credited. For each item's residual part, the letter either says nothing or asserts compliance without a locatable change. **No adjustment.**
- **Contested items** (REV-18, 23, 29, 33, 34, 39 and consider items 17, 25, 30, 36, 44, 52, 53): the letter reads "new analysis or action, author approval needed". This is a deferral, not a rebuttal. **No adjustment.**

## Revision Response Checklist

"Author triage" shows the letter status. No `author-adjudication/1.0` sidecar exists, so nothing is copied from one, and the letter says that Claude, not the author, triaged the items. "Cross-model" is `not_configured` on every must_fix row.

### must_fix — Required Revisions

| Transport ref | Original Review Comment | Author triage (letter) | Author's Claim | 2A verdict | Adj. | Response Status (final) | Revision Location | Verified? | Cross-model (#539) | Quality Assessment |
|---|---|---|---|---|---|---|---|---|---|---|
| R1 | REV-01: reframe title, RQ, contributions and §10 opening; hybrid as one arm | ADDRESSED | New title, RQ, 3 contributions, conclusion; hybrid credited only with ranking | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | Title; §1; §7 | PARTIAL | not_configured | Claim consistent for title, RQ and conclusion. Contribution (3) still lists "disclosure of every null and fragile result" as a co-equal contribution. Residual: consider. |
| R2 | REV-02: one population in main-text tables; claims-status table; caveats once | ADDRESSED | Non-control population throughout; Table 1; appendix moves; caveats in Limitations | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | Table 1; Table 3; App. B | PARTIAL | not_configured | Claim contradicted by the manuscript: Table 1 mixes populations and pairs a controls-excluded effect with a controls-included Holm p; Table 3 is unstated; the fragility caveat appears 4 times. Residual: should_fix. |
| R3 | REV-03: scope the OOD claim in Abstract and §10 (screening clause and unscreened result) | ADDRESSED | Abstract reports 17/46/34; §5 gives screening facts and caveat | MADE_WORSE | — | MADE_WORSE | Abstract; §7 | NO | not_configured | The pointer is outside the item's loci. The Abstract and §7 lack the screening clause and the unscreened result, and have dropped the kind-of-request and false-rejection qualifiers. The new headline arm thresholds the screened score. |
| R4 | REV-04: abstract ≤ 200 words, with exploratory sentence | ADDRESSED | 172 words | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Abstract | ✅ Yes | not_configured | Consistent (172 tokens by the F1 method; exploratory sentence kept). |
| R5 | REV-06: interaction model; benefit claimed or untested | ADDRESSED | §3 "The published tool": display, refusal below 30%, runs on Enter, no risk shown, sync off | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | §3 | PARTIAL | not_configured | Paragraph confirmed. No explicit sentence says the user benefit of calibrated confidence is untested, and the letter points to none. Residual: consider. |
| R6 | REV-07: retrieval-based command-assistance literature; restate gap; qualify §1 | ADDRESSED | NLC2CMD retrieval entry, ShellFusion, DocPrompting, CLAI; gap restated | FULLY_ADDRESSED | — | FULLY_ADDRESSED | §1; §2; References | ✅ Yes | not_configured | Consistent. ShellFusion's hybrid (lexical plus semantic) character is still unstated (non-gating). |
| R7 | REV-09: "answerable" only for 121; populations named | ADDRESSED | "Answerable" = 121; "in-scope"/"non-OOD" elsewhere | FULLY_ADDRESSED | — | FULLY_ADDRESSED | §3; §5; Table 2 | ✅ Yes | not_configured | Consistent. |
| R8 | REV-11: anonymize the package name and pointer; state authors' relationship to the baseline | wont_address — "Author decision D3 … DECLINED, CONTESTED … pending the author's confirmation" | "The review version names no URL, scope or repository." | NOT_ADDRESSED | — | NOT_ADDRESSED | §1 | ❌ No | not_configured | The decline is recorded but grants no manuscript authority. It is not a merits rebuttal: the name plus "npm package" remains, and the relationship statement (independent of naming) is absent. |
| R9 | REV-12: BashCoder-R1 reward and metric; reference title per version of record | ADDRESSED | "trained with reinforcement learning on static-analysis rewards" | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | §1; References | PARTIAL | not_configured | Reward corrected. The letter is silent on the title, and "30/30 cite keys resolve" does not rebut EIC W10. Residual: consider. |
| R10 | REV-14: quantify the OOD selection effect | ADDRESSED | All 35 kept; maxima observed not cut-offs; equal gain +33.3 vs +34.3; favours shipped score | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | §3; §5; Table 4 | PARTIAL | not_configured | Pointed facts located and already credited. The tuned shipped threshold (the headline arm, thresholding the screened feature) has no original-vs-added split in the v0.2 run; "keyword-verified" is undefined; the hybrid threshold–bound relation is unstated. Residual: **must_fix**. |
| R11 | REV-15: interpretable calibration magnitudes | ADDRESSED | Noise floor, equal-mass and sweep ECE, Brier skill, CIs | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | §4; §5; Table 1 | PARTIAL | not_configured | Claim-vs-manuscript inconsistency: no equal-mass or sweep value is reported. Hybrid no-skill and noise-floor values are qualitative. Residual: should_fix. |
| R12 | REV-16: system specification; feature choice inside CV or not | ADDRESSED | §4 plus Appendix A table; leak and α reuse disclosed | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | §4; Table 4 | PARTIAL | not_configured | Confirmed. The candidate grid and tie rule for the F1-maximizing thresholds are missing. Residual: should_fix. |
| R13 | REV-26: correctness-AUROC paired interval, or reword §9 | ADDRESSED | Paired CIs in Table 1; weak on v0.2 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Table 1; §6 | ✅ Yes | not_configured | Consistent. |
| R14 | REV-32: NLC2CMD metric confidence-weighted; contrast with ECE/AURC/AUGRC | ADDRESSED | Metric is confidence-weighted, penalizes confident wrong answers | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | §2 | PARTIAL | not_configured | Description confirmed. No contrast sentence, and the letter claims none. Residual: should_fix. |
| R15 | REV-40: scope user- and distribution-facing calibration claims | ADDRESSED | "Changes the number shown"; mix is a limitation; user study is future work | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | §5; Limitations; §6; §7 | PARTIAL | not_configured | Phrases located. The deployed-calibrator data statement is absent, and the §6 sentence and §7 opening are unscoped. Residual: should_fix. |
| R16 | REV-42: correctness × risk × confidence table for both systems | ADDRESSED | Table 3 and concrete cases | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Table 3; §5 | ✅ Yes | not_configured | Consistent. |
| R17 | REV-49: OOD as operating-point comparison (matched FRR or sweep), or reword | ADDRESSED | Tuned threshold 46/50 vs detector 34/50 (p = 0.004); raw BM25 better ranker | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | §5; Table 1 | PARTIAL | not_configured | Rules are at 20 vs 11 false rejections, not matched, and there is no sweep. "Matched operating points" is still claimed in Contribution (3) and Limitations. The Abstract and §7 omit the FR cost. Residual: **must_fix**. |

**must_fix final tally**: FULLY 5 (REV-04, 07, 09, 26, 42); PARTIALLY 10 (REV-01, 02, 06, 12, 14, 15, 16, 32, 40, 49), of which 2 have a must_fix residual (REV-14, REV-49); NOT_ADDRESSED 1 (REV-11); MADE_WORSE 1 (REV-03); CANNOT_VERIFY 0. This is identical to Phase 2A.

### should_fix — Suggested Revisions

| # | Original Review Comment | Author's Claim (letter) | 2A verdict | Adj. | Response Status (final) | Notes |
|---|---|---|---|---|---|---|
| S1 | REV-05: say recalibration of a heuristic is expected; argue what is not obvious | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | -- |
| S2 | REV-08: no generative baseline; comparison conceptual | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | -- |
| S3 | REV-10: one main-text figure; Split B to one sentence | Declined (figures include controls; "There is now space") | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | Split B moved; no main-text figure. The decline reason is recorded but is not a rebuttal. |
| S6 | REV-18: dual interval; mid-p/unconditional check; method dependence | Contested (new analysis, author approval needed) | NOT_ADDRESSED | — | NOT_ADDRESSED | Author explanation recorded; it does not count toward the rate. Non-duality is only disclosed. |
| S7 | REV-19: headline the pre-named comparison, or label the 79% as outside the family | Addressed ("baseline figure labelled outside the pre-named family") | NOT_ADDRESSED | — | NOT_ADDRESSED | The claim resolves to §5 only (seen at 2A). There is no label at the Abstract or §6. Does not count. |
| S8 | REV-20: bootstrap p as a bound, ≤ in Holm, sidedness | Addressed | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | The OOD row's sidedness is unstated; Table 1 prints equalities. |
| S9 | REV-21: "agreed on all 8"; exact interval; terminal-task count | Addressed | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | No exact interval for 8/8. |
| S10 | REV-22: complete the OOD partition | Addressed (25+4+1+4 = 34) | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | Baseline per-category counts dropped. |
| S11 | REV-23: repeat CV over 10–20 seeds | Contested | NOT_ADDRESSED | — | NOT_ADDRESSED | Single seed stated as a limitation. Author explanation recorded; it does not count. |
| S12 | REV-24: describe inner CV exactly or drop "nested" | Addressed (no inner split; α reuse) | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | "Nested cross-validation" remains in the Abstract and Contribution (2), contradicting §4. The letter is silent. |
| S14 | REV-27: "validates benchmark quality" | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | -- |
| S15 | REV-28: 125-item inclusion rule | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | -- |
| S16 | REV-29: paired calibrator differences, or soften | Contested | MADE_WORSE | — | MADE_WORSE | The independence claim now rests explicitly on overlapping intervals ("so"), and the original histogram-binning caveat is deleted. The contest does not address the regression. |
| S19 | REV-33: tool/API retrieval, fusion, ranker calibration citations | Contested (needs new verified references) | NOT_ADDRESSED | — | NOT_ADDRESSED | Author explanation recorded; it does not count. |
| S20 | REV-34: encoder sensitivity row, or scope hybrid claims | Contested | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | Global Limitations scoping only. |
| S21 | REV-35: out-of-scope; in-domain vs general; closed-set | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | -- |
| S23 | REV-37: why no public benchmark; which system's output checked | Addressed (why no public benchmark) | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | The ambiguous-draft check was deleted, not specified; the 6/30 rejection count was lost. |
| S24 | REV-38: NL2SH author list per Anthology; preprints marked; hyphenation | Reviewer disagreement (published PDF lists 6 authors; Anthology metadata omits one) | PARTIALLY_ADDRESSED | **ADJ-1** | FULLY_ADDRESSED (`addressed_by_rebuttal: true`) | valid_rebuttal, letter-side counter-evidence, not verified by the judge; human spot-check recommended. |
| S25 | REV-39: cost-of-harm operating point; A5 on v0.2; baseline at matched coverage | Contested | NOT_ADDRESSED | — | NOT_ADDRESSED | Author explanation recorded; it does not count. |
| S27 | REV-43: deployment safeguards; risk-dependent threshold | Addressed (risk display, confirmation, -WhatIf) | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | A risk-dependent threshold is neither discussed nor declined; `-Confirm` is not named. |
| S29 | REV-45: Windows in the abstract | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | -- |
| S30 | REV-46: current users of the shipped package | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | -- |
| S31 | REV-47: positive case for no LLM; coverage lost | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | The accuracy of the stated properties is NEW-6. |
| S32 | REV-48: R3 minor issues | Addressed | FULLY_ADDRESSED | — | FULLY_ADDRESSED | -- |
| S33 | REV-50: why the same 15 queries give two p-values | Addressed | PARTIALLY_ADDRESSED | — | PARTIALLY_ADDRESSED | The implication for the v0.2 result is not stated. |

**should_fix final tally**: FULLY 10, PARTIALLY 9, NOT_ADDRESSED 5, MADE_WORSE 1, CANNOT_VERIFY 0.
**`should_fix_addressed_rate` (final verdicts)** = (10 + 9) / 25 = **19/25 = 76%**. This is below 80%, and ADJ-1 does not change it.

### consider — Nice to Fix

| # | Original Review Comment | Author's Claim (letter) | Response Status (2A = final) |
|---|---|---|---|
| S4 | REV-13: EIC minor issues | Addressed partly | PARTIALLY_ADDRESSED |
| S5 | REV-17: anonymized artifact link | Contested | NOT_ADDRESSED |
| S13 | REV-25: MDE / sample-size target | Contested | NOT_ADDRESSED |
| S17 | REV-30: re-fit calibrators inside the bootstrap | Contested | NOT_ADDRESSED |
| S18 | REV-31: R1 minor issues | Addressed partly | PARTIALLY_ADDRESSED |
| S22 | REV-36: query-performance-prediction framing | Contested | NOT_ADDRESSED |
| S26 | REV-41: reliance study instead of preference study | Addressed | FULLY_ADDRESSED |
| S28 | REV-44: recall@3/5 | Contested | NOT_ADDRESSED |
| S34 | REV-51: tie-block note | Addressed | FULLY_ADDRESSED |
| S35 | REV-52: AURC on answerable only | Contested | NOT_ADDRESSED (the anchor disclosure on v0.1's un-re-annotated ambiguous labels is deleted; next-round seed) |
| S36 | REV-53: split the 49 confident errors by label | Contested | NOT_ADDRESSED |
| S37 | REV-54: simpler alternatives | Addressed partly | PARTIALLY_ADDRESSED |

consider items are decision-inert (`applied_criterion: not_precommitted`).

## Commitment Ledger Verification (Kong A1)

- **Not applicable (vacuous).** No Schema 11 row carries a `commitment_extracted` list: no `revision_coach_agent` Step 3.5 output exists, and the Response to Reviewers is a Markdown log, not Schema 8/11.
- As a result, no `fulfillment_status` is verified, no `COMMITMENT_GAP` and no `EVIDENCE_TYPE_UNSPECIFIED` is raised, and no commitment-axis field was created. The commitment axis produced no adjustment record, which is correct: the verdict axis and the commitment axis are orthogonal.
- **For the human checkpoint** (not commitment records; no inference made):
  - The letter leaves these author decisions open:
    - REV-11 ("pending the author's confirmation");
    - 13 suggested items marked "Contested: new analysis or action, author approval needed";
    - REV-10's decline ("There is now space if the author wants a regenerated figure").
  - The letter's "Triage: Claude triaged the items" means no author-authored triage exists for most items.

## New Issues (Discovered During Revision)

Frozen at Phase 2A `[EVIDENCE-COMMITTED]` (`phase2a_evidence_verdicts.md` §6). They are carried over without addition, removal or edit. Descriptions are the frozen text.

| # | Attribution | Severity | Location | Description |
|---|---|---|---|---|
| NEW-1 | previously_missed | major | §4 "The features for the two detectors were chosen by inspecting class means on the full data, a disclosed leak." | The out-of-scope and ambiguity detector features were chosen by inspecting class means on the full benchmark, labels included, outside the CV folds. This is tuning leakage (it matches R1's frozen D3 trigger). It optimistically biases the hybrid detector's reported figures: out-of-scope 34/50; AUROC 0.900/0.855 (pooled) and 0.901/0.867 (fold means); the Holm-significant "OOD rej." rows of Table 5; ambiguity F1/AUROC; and A4/A5. No sensitivity analysis (for example, selecting the feature inside CV) bounds the bias. |
| NEW-2 | regression | minor | Table 1, row "Shipped confidence: Brier skill vs. no-skill, raw / recalibrated", Status "robust"; caption definition | Table 1 labels the row "Shipped confidence: Brier skill vs. no-skill, raw / recalibrated" as "robust". The caption defines "robust" as "the interval excludes zero on both versions", but the raw intervals include zero on both versions: [−.45, .01] (v0.1) and [−.26, .15] (v0.2). §5 itself says "intervals including zero". The status contradicts the table's own definition for half of the row. |
| NEW-3 | regression | minor | §5 "tie-aware AURC and AUGRC are lower on both versions with intervals excluding zero (Table 1)" | §5 states that "tie-aware AURC and AUGRC are lower on both versions with intervals excluding zero (Table 1)". Table 1 has no AUGRC row, and no AUGRC value or interval appears anywhere in the revised manuscript. The original reported AUGRC −0.041 [−0.062, −0.021] and −0.027 [−0.045, −0.010]. The claim now points to data the paper does not contain. |
| NEW-4 | regression | minor | §3 "Three items have gold commands outside the Windows corpus (TA-B145, TA-B149, TA-B187); …" | The ground-truth-defect statement is misstated. "Three items have gold commands outside the Windows corpus (TA-B145, TA-B149, TA-B187); they lower every system's non-OOD accuracy by at most 2 of 159 queries". The original states that TA-B149's gold command is in the corpus and only one acceptable command is outside it, and that every system answers TA-B149 correctly. As revised, "three ... gold commands outside" is inconsistent with "at most 2 of 159". The Limitations bullet repeats "Three items have gold commands outside the corpus." |
| NEW-5 | regression | minor | §5 "(AUROC 0.963 vs. 0.900 on v0.2, 0.950 vs. 0.855 on v0.1)"; Table 7 "0.867", "0.901" | The hybrid out-of-scope AUROC appears with two values per version and no label in the text. §5 gives 0.855 (v0.1) and 0.900 (v0.2). Table 7 gives 0.867 and 0.901 for the same hybrid detector, captioned "AUROC values are means over folds". The §5 values are presumably pooled, but they are not labelled as pooled. The original explicitly labelled "(pooled: 0.900 ...)". A reader meets 0.855 vs 0.867 for one quantity. The 0.855 also feeds Table 1's "+.095" difference. |
| NEW-6 | regression | minor | §1 "so no query leaves the user's machine and every answer can be traced to a vetted record" | §1's new no-LLM rationale overstates two properties that the paper's own facts qualify. (i) "every answer can be traced to a vetted record": §3 says the records "were checked by script rather than one by one, and a few Windows-visible records are Linux commands (e.g., sudo reboot)", and §5 reports the hybrid returning "sudo shutdown -h now" on the Windows corpus. (ii) "so no query leaves the user's machine": §3 says the tool has "an optional query-sync feature", which is off by default. |
| NEW-7 | regression | minor | §3 "Cohen's κ = 0.63 (Cohen, 1960), below our 0.7 target" | The uncertainty of the label-agreement statistic has been removed. The revised paper reports "Cohen's κ = 0.63" (n = 14) with no interval. The original reported "a post hoc bootstrap 95% interval for κ is [0.39, 1.00], and one flipped item would move it materially." With n = 14, the point estimate alone overstates precision for a statistic the paper cites twice (§3, Limitations). |

**Tally.**
- regression: 6, all minor (B5-relevant; none major or critical).
- previously_missed: 1, major. It is decision-inert under the goalpost guard.
- indeterminate: 0.
- Escalation exceptions: none. NS-1 was not substantiated at 2A and lapsed to advisory.

**NEW-1 → next roadmap (Major Revision path; closed mapping).**
- `id: REV-PM-1`; `source_refs: [{seat: R1, channel: finding, ordinal: 1, subclaim_ordinal: 0}]`.
- Description: `[PREVIOUSLY-MISSED: NEW-1] ` followed by the frozen description.
- `reviewer: R1`; `obligation_class: consider`; `cost_scope: {kind: section, locator: §4}`; `consequence_if_unaddressed: {code: reader_traceability_reduced, target: {kind: section, locator: 'text: §4 "The features for the two detectors were chosen by inspecting class means on the full data, a disclosed leak."'}}`.
- Suggested action: "assess; address or record as a limitation". Consensus: `SINGLE-VERIFIER`. Verification criteria: resolution or explicit limitation.
- Severity major, confidence 4, and competence basis copied from the frozen record.
- `proposed_targets`: **cannot be resolved**, because no block manifest exists, so there is no unique exact current block. The next machine roadmap cannot be emitted as-is and must request reconciliation.

### post_letter_observations (decision-inert; seed for the next round)

- **PLO-1 (REV-02).** The letter's "non-control population throughout" and "caveats sit in Limitations" contradict the manuscript (Table 1 caption; Table 3; §1/§5/§6/§7).
- **PLO-2 (REV-15).** The letter lists "equal-mass and sweep ECE" as delivered, and §4 says "we also report" them. Neither location reports a value. The next draft should report the values or drop the sentence.
- **PLO-3 (REV-49, Contribution 3).** The letter's heading for R17, "OOD at matched operating points", and the paper's own Contribution (3) and Limitations use "matched" for rules tuned by the same protocol but sitting at different false-rejection counts (20 vs 11; 9 vs 6). The term is used inconsistently with the Round-1 criterion. Fix the wording or supply the analysis.
- **PLO-4 (REV-19, REV-20).** The letter claims labelling and sidedness that the Abstract, §6 and Table 5 do not show (see the checklist).
- **PLO-5 (REV-12).** The letter's only verification statement on references ("30/30 cite keys resolve to verified entries") does not address the BashCoder-R1 title that EIC W10 flagged. It also does not report the Factual Check F11 source verification (BashCoder-R1 and NLC2CMD against arXiv 2606.27733 / 2103.02523) that the Round-1 letter required.
- **PLO-6 (Response Letter Instructions).** The Round-1 letter required answers to all 16 reviewer questions, explicit responses to Disagreements 6 and 7, change markup and a location cross-reference table. The letter provides none of these as such. Some of their substance is in the manuscript: the +33.3 vs +34.3 restatement bears on Disagreement 6, and Brier skill bears on Disagreement 7.
- **PLO-7 (REV-11 status).** The letter records the decline both as "standing author decision" (D3) and as "pending the author's confirmation". The author needs to confirm it at the checkpoint.
- **PLO-8 (ADJ-1).** This adjustment depends on an unverified letter-side fact (the NL2SH PDF author line). A human spot-check is recommended.
- **PLO-9 (evidence surface).** Several letter claims cite T18/T19/T6 and result JSON files. None was opened. Any claim supported only there was treated as an assertion.

## Decision Rationale

**Derivation status.** Manual derivation. It is **NOT checker-verified**, and no checker result is claimed.

**Step 1 — gates.**
- **G0 (manifest).** Under the current contract, G0 would fire `[RE-REVIEW-ABORT: manifest_incomplete]`. The input manifest 1.1, the roadmap JSON core, the author-adjudication sidecar and the revision-evidence bundle are all absent. The dispatching layer chose to proceed as a manual three-gate run. Everything below is derived by hand on that basis. The hard-required original and revised manuscripts are present, and their SHA-256 values match across all three gates.
- **G1 (silent drift).** One row differs from its 2A verdict (REV-38), and ADJ-1 carries it. There is no silent verdict change. **Pass.**
- **G2 (pending user input).** Every pending condition is absent:
  - no dissent records, so no dissent bound is tripped;
  - no cross-model pass, so there are no `diverges` rows;
  - no pending escalation exception (NS-1 lapsed at 2A);
  - no `original_upheld` reapplication.

  **Pass.** No deferral.

**Step 2 — base decision (first match).**
- **B1.** Does not fire. The only must_fix MADE_WORSE is REV-03, and its driving severity is `major`, not `critical`. No regression new issue is critical.
- **B2.** Does not fire. 2 of 17 must_fix items (REV-11, REV-03) are in {NOT_ADDRESSED, MADE_WORSE}, which is 11.8% and below 50%.
- **B3. Fires.** REV-11 is NOT_ADDRESSED and REV-03 is MADE_WORSE. **Base: Major Revision**, with `reject_recommended: false`.
- **Informational only** (first match already won):
  - B4 would also fire, on REV-14 and REV-49, whose residuals are must_fix.
  - B5 conditions also hold: `should_fix_addressed_rate` 76% < 80%, the should_fix MADE_WORSE on REV-29, and six minor regression new issues.
  - So the decision would stay Major even if REV-11 and REV-03 were fixed, unless REV-14 and REV-49 were fixed too. Fixing all four without closing the should_fix gap and the regressions would still land at Minor under B5.

**Step 3 — floors.** No escalation exception was approved, so no floor applies. **decision_state = Major Revision.**

**Substance.**
- The revision is a genuine structural improvement on the Round-1 blocking issues.
- **Blocking issue R12** (reproducibility, REV-16) is now reduced to a missing threshold grid.
- **Blocking issue R10** (interpretability):
  - REV-15 now has a noise floor, no-skill Brier skill and intervals on the relative reductions. It lacks the equal-mass and sweep values that its own text claims.
  - REV-14's screening facts are disclosed.
- **The reframing moved the out-of-scope headline** onto a tuned threshold on the raw BM25 score: the same score on which the added out-of-scope items were checked.
  - As a result, blocking issue R1's OOD half (REV-03) has regressed. The Abstract and conclusion now state a larger out-of-scope gain (46/50) with no screening clause, no unscreened-subset result and no false-rejection cost (20 of 159), and they have dropped the qualifiers the original carried.
  - REV-14 and REV-49 now fall on this new arm: its v0.2 split on the unscreened items and a matched-false-rejection comparison are both missing.
- **REV-11** is declined without a merits rebuttal. Its second half, stating the authors' relationship to the audited baseline, does not depend on the naming decision and remains unaddressed.
- The one adjustment (ADJ-1) is decision-inert.

**Residual coaching.** Because the decision is Major Revision, the Residual Coaching sub-stage (at most 5 rounds, skippable with "just fix it") is available at the Stage 3' checkpoint. It was not run in this call.

## Residual Issues (If Any)

Actionable list for the next revision round, ordered by decision impact.

**Clears B3/B4 (required for anything better than Major):**
1. **REV-03 (MADE_WORSE).** Wherever the Abstract and §7 state the out-of-scope result:
   - say in the same or the next sentence that the added 35 items were checked on the system's own raw retrieval scores (the tuned threshold thresholds that score);
   - give the result on the 15 original, unscreened items;
   - restore the false-rejection cost (the tuned threshold's 20 of 159) and the kind-of-request qualifier.
2. **REV-49 (must_fix residual).** Either report out-of-scope rejection for the shipped score and the hybrid feature at a matched false-rejection rate, or give a threshold sweep. Otherwise, delete "detection compared at matched operating points" from Contribution (3) and Limitations, and describe the result as an operating-point change with its false-rejection cost at every locus (Abstract, §5, §6, §7).
3. **REV-14 (must_fix residual).**
   - Report the tuned shipped threshold's v0.2-run rejection on the 15 original vs the 35 added items.
   - Define "keyword-verified", or state that the 15 v0.1 items were not checked against retrieval scores.
   - State how the hybrid's fused-score thresholds (0.833–0.925) relate to the raw 7.39/0.31 bounds.
4. **REV-11 (NOT_ADDRESSED).**
   - Add one neutral, third-person sentence on the authors' relationship to the audited baseline. This is independent of the naming decision.
   - Then either anonymize "TermAssist, an npm package" in the review build, or have the author confirm the decline explicitly. A confirmed decline keeps this item NOT_ADDRESSED and holds the decision at Major under B3, whatever else is fixed.

**Clears B5 (the Minor-to-Accept boundary):**

5. **Raise `should_fix_addressed_rate` from 76% to at least 80%.** At least one more should_fix item must reach PARTIALLY_ADDRESSED or better. The cheapest are:
   - REV-19: label the 79% as outside the corrected family in the Abstract and §6.
   - REV-29, currently MADE_WORSE: restore the caveat that histogram binning's ECE is flattered by in-sample bin scoring and has the worst Brier score, and drop "so the gain does not depend on the method" or report paired differences.
6. **Fix the six minor regressions:**
   - NEW-2: Table 1 "robust" status on the raw Brier row.
   - NEW-3: add AUGRC values or drop the claim.
   - NEW-4: restate the TA-B145/149/187 defects correctly.
   - NEW-5: label pooled vs fold-mean AUROC.
   - NEW-6: qualify "vetted record" and "no query leaves the user's machine".
   - NEW-7: restore the κ interval.

**should_fix residuals (also needed for Accept):**

7. **REV-02.** Give every main-text table one stated population. Do not pair a controls-excluded effect with a controls-included Holm p in Table 1. State Table 3's population. State the accuracy-fragility caveat once in the body.
8. **REV-15.** Report the equal-mass and sweep ECE values (an appendix table is enough), and the hybrid's Brier skill and noise-floor values next to its 67%/81%.
9. **Other should_fix residuals:**
   - REV-16: give the candidate grid and tie rule for every F1-maximizing threshold.
   - REV-32: add one sentence contrasting ECE/AURC/AUGRC with NLC2CMD's confidence-weighted score.
   - REV-40: say what labelled data a deployed calibrator would be fitted on, and scope §6's recalibration sentence and §7's opening to this benchmark's query mix.
   - REV-24: remove "nested" from the Abstract and Contribution (2).
   - REV-37: specify the ambiguous-draft check and restore the 6/30 rejection count.
   - REV-43: discuss, then adopt or decline, a risk-dependent threshold.
   - REV-20: state the OOD row's sidedness and carry "≤" into Table 1.
   - REV-21: give the exact interval for 8/8.
   - REV-22: add baseline per-category rejection counts.
   - REV-34: scope each hybrid claim to all-MiniLM-L6-v2.
   - REV-50: state the implication for the v0.2 result.
   - REV-10: add a regenerated main-text figure on the controls-excluded population. The letter says there is space.

**consider-level and author-verification items:**

10. **consider-level:**
    - REV-01: recast Contribution (3) without "disclosure".
    - REV-06: add one explicit "user benefit is untested" sentence.
    - REV-12: align the BashCoder-R1 reference title with the ISSTA 2026 version of record, or document that it matches.
    - REV-PM-1 / NEW-1: bound the full-data feature-choice leak, for example with an inside-CV selection sensitivity check, or keep it as an explicit limitation. It is already a Limitations clause.
11. **Suggested for Acknowledged Limitations** if the author declines the new analyses:
    - REV-23 (single partition seed; already in Limitations);
    - REV-18 (state explicitly whether the v0.2 accuracy verdict depends on the interval method);
    - REV-33 and REV-39 (as scoped omissions).

    Under the contract, a limitation statement does not by itself change these items' verdicts.
12. **Human checkpoint.**
    - Spot-check the NL2SH PDF author line (ADJ-1).
    - Confirm or withdraw the REV-11 decline.
    - Decide the 13 contested items.

## Sprint contract status

- `reviewer_re_review` is not a Schema 13 mode. This re-review is governed by the dedicated contract family `shared/contracts/re_review/{precommitment,verdict_record,traceability,input_manifest}.schema.json` together with `scripts/check_re_review_synthesis.py`.
- In this run that contract family could not be instantiated (`[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`):
  - no machine traceability sidecar was emitted;
  - no schema lint ran at any gate;
  - the checker was not invoked.
- The three-gate discipline (criteria committed revision-blind, evidence committed persuasion-blind, every later change typed and evidence-bound) was followed by hand, with SHA-256 binding recorded at each gate.
- `reviewer_calibration` and `reviewer_guided` remain reserved Schema 13 modes and were not used.

[MATRIX-COMMITTED]
