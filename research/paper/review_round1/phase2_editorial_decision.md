# Editorial Decision Package

Phase 2 (Editorial Synthesis) of the ARS `academic-paper-reviewer` full-mode panel, round 1. Written by the editorial synthesizer. This package synthesizes and arbitrates the five Phase 1 reports. It adds no review comments of its own. Every roadmap item cites the report and finding it comes from.

**Citation convention.** A seat reference always carries a finding suffix: `EIC W3` (Journal-Fit Reviewer, weakness 3), `R1 W2` (Reviewer 1 seat, weakness 2), `R2 Q1` (question 1), `DA M3` (Devil's Advocate MAJOR 3), `DA m2` (DA MINOR 2). A bare `R1`...`R17` in a Transport ref column or in a heading such as **R1:** is a required-item transport reference, not a reviewer seat. Suggested items are `S1`...`S37`. Roadmap items are `REV-01`...`REV-54`.

## Calibration Resolution

`calibration_status: NOT_CALIBRATED`

Current runtime boundary: this package is not upgraded from a candidate or prose-named profile. `PROFILE_MEASURED` remains unavailable until a closed profile artifact and replay validator bind the exact target fields to the completed panel's `execution_topology_sha256`. All five seat reports also declare `NOT_CALIBRATED`.

## Protocol and Contract Status (read before the decision)

1. **Sprint contract.** The only contract available is the skill's own `shared/contracts/reviewer/full.json` (`reviewer/reviewer_full/v2`). Its raw-byte SHA-256 is `e9712090d2469fea15a37b8e22d4e137afbcb2bf38d5789939c5df56738ef7af`, which matches `contract_sha256` in `panel_provenance.json`. Only R2 declared the contract applied (`phase1_R2_domain.md`, line 3). It scored contract D2 `warn` and marked D1 and D3–D6 `not_assessed`. The other four seats each recorded that no sprint-contract JSON was supplied and committed their own criteria instead:
   - EIC: narrative C1–C7, with no block/warn/pass scores;
   - R1: its own D1–D5, whose names and definitions differ from the contract's D1–D5;
   - R3: its own P1–P5;
   - DA: the standard DA format, with no dimension scores.

   **Consequence.** The v3.6.2 arithmetic protocol cannot run. Step 1 would emit `[DIMENSION-UNASSESSED: D1]`, because no eligible `methodology` seat scored contract D1, and it would do the same for D3, D4, D5 and D6. This package does not translate R1's or R3's own dimensions into contract dimensions, because doing so would be reconstruction, which the protocol forbids. No binding `dimension_verdicts` or `fired_conditions` lines are therefore emitted. As instructed by the dispatching session, the decision uses the no-contract path (`references/editorial_decision_standards.md` §0, row 3): the Synthesis Protocol plus the recommendation matrix. For the record, the DA line is: `da_critical_adjudications: []`.
2. **Criteria binding.** No #683 `ReviewTargetContext` or `ReviewCriteriaBindingManifest` exists, so this is an explicitly unbound run. All five cards disclose `criteria_binding_unavailable` (EIC line 7; R1 line 55; R2 line 34; R3 line 51; DA line 7), and none makes a formal venue-alignment claim; EIC C6 is explicitly informal. The unbound-run condition is therefore met. This package makes no venue-alignment claim either. Mentions of the EACL 2027 SRW format (8 pages, abstract length) come from the reviewers' informal judgement.
3. **Artifacts that do not exist and were not fabricated.**
   - (a) No block manifest exists. The machine-readable `revision-roadmap/1.0` core therefore cannot be emitted validly: `block_manifest_sha256` and every `proposed_targets[].block_id` would have to be invented. The roadmap below is the Markdown core only, with section-level `target_section` locators.
   - (b) No bound base-draft digest exists. For reference only, the reviewed text `manuscript_review.txt` has SHA-256 `4fafa1af9799931c8fc82946c33a627b67628160c9f511deb1d98d882d0c9f84`. It is a plain-text extraction, not the PDF.
   - (c) No Schema 6 machine package or provenance carrier was built in this run. The prose in the letter is not the machine carrier (see Review Panel Provenance).
4. **Cross-model blind decision check (Step 4b).** Not run. `ARS_CROSS_MODEL` is unset in this environment, and no consent gate was passed, so this step causes no change in behavior.
5. **Inputs read.** `phase0_field_analysis.md`, the five Phase 1 reports, `manuscript_review.txt`, `panel_provenance.json` and `panel_provenance_input.json`. Figures 1–5 are not visible in the extraction, and no finding here depends on them.

---

# Part 1: Editorial Decision Letter

## Manuscript Information
- **Title**: Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study
- **Manuscript ID**: none (anonymized T14 round-1 build, commit a57c8c1 per Phase 0; author block redacted)
- **Target venue (author-confirmed)**: EACL 2027 Student Research Workshop, long paper (8 pages). Criteria not bound (`criteria_binding_unavailable`).
- **Submission Date**: not provided
- **Decision Date**: 2026-09-28
- **Review Round**: Round 1

## Review Panel Provenance (#540/#740)

- **Typed artifact**: `research/paper/review_round1/panel_provenance.json` (built from `panel_provenance_input.json`)
- **Artifact SHA-256** (exact raw bytes): `c3905fe668a1d62e9d454585e95f1d5cc6775d06feda066a19e25b607dd3f7b6`
- **Panel ID**: `termassist-t14-review-round-1`
- **Contract binding**: `reviewer/reviewer_full/v2`, `contract_sha256` `e9712090d2469fea15a37b8e22d4e137afbcb2bf38d5789939c5df56738ef7af` (matches the raw bytes of `shared/contracts/reviewer/full.json`)
- **Normalized manifest SHA-256**: `60aad6d84f0a712d62969fd88e9a971d5bb8e976ac07644698fc6f909381d1b0`
- **Execution topology SHA-256**: `c259b3f71e07a5edf63a2840650cfafb0d9380f68f5533b18fdd78f82f6e2603`
- **Fresh-context scope**: `within_panel_attempt_only`. This scope does not compare retries or prior rounds.
- **Replay validation**: `python scripts/review_panel_provenance.py validate panel_provenance.json` returned `review-panel provenance: PASS` (read-only check, run during this synthesis). The Schema 6 carrier (`build-carrier` / `validate-carrier`) was not built in this run and must be produced by the dispatching layer if a machine package is required.

| Seat | Role ID | Actor type | Context ID | Peer outputs visible | Model family | Provider | Human reviewer ID |
|---|---|---|---|---|---|---|---|
| EIC | eic | model | subagent-eic-2026-09-28 | false | claude-opus-5-5 | anthropic | null |
| R1 | methodology | model | subagent-r1-2026-09-28 | false | claude-opus-5-5 | anthropic | null |
| R2 | domain | model | subagent-r2-2026-09-28 | false | claude-opus-5-5 | anthropic | null |
| R3 | perspective | model | subagent-r3-2026-09-28 | false | claude-opus-5-5 | anthropic | null |
| DA | da | model | subagent-da-2026-09-28 | false | claude-opus-5-5 | anthropic | null |

| Provenance axis | Status |
|---|---|
| Role-separated | true |
| Within-panel invocation-context separation | true |
| Blind to peer outputs | true |
| Model-family distinct | false |
| Provider distinct | false |
| Human-reviewer distinct | false |

- **Binary independence claim**: not computed (`independence_claim: not_computed_from_personas`). Role or persona diversity proves only `role_separated`. The panel is not described as independent anywhere in this package.
- **Correlated-error disclosure** (required, reason `same_model_family`; artifact text verbatim): "All model-executed review seats used one model family; role separation does not remove correlated-error risk."
- **Reading note for this decision**: Agreement across seats in this round, including the unanimous Major Revision recommendation, may partly reflect this shared-model correlation. It should not be read as five separate confirmations.

---

## Decision

### Major Revision

The revised manuscript should be reviewed again. This is not a Reject: no seat found a fatal or unfixable flaw, the DA reported no CRITICAL finding, and the narrow novelty claim survived the literature check (EIC, R2, R3).

---

## Blocking Issues (0–3, immutable source order)

These are the three issues that currently block acceptance. They are the ones where the validity or reproducibility of a headline claim is at stake. Every other Required item (R1–R17 below) must also be resolved, but those items are about positioning, scope wording or reporting, and none of them puts a headline claim's validity in question.

| Transport ref | Blocking issue | Source reviewer(s) | Evidence anchor | Resolving roadmap item |
|---|---|---|---|---|
| R1 | The title, research question, contribution list and conclusion credit the hybrid architecture for results that are mostly independent of it. The abstract also states the OOD result more strongly than the body supports. | EIC (W1, W3); R2 (W8); R1 (W1, scope suggestion); DA (Strongest Counter-Argument) | `text: §10 "A lightweight, fully offline, non-LLM hybrid retriever with post-hoc calibration improves the reliability of a shipped BM25 command-retrieval baseline."`; `text: Abstract "OOD rejection doubles on v0.2 (17/50→34/50; Holm-adjusted p = 0.00006)"` | REV-01, REV-03 |
| R10 | The two headline reliability measurements cannot yet be interpreted. The OOD selection effect is unquantified (the added OOD items were screened with the detector's own features). The ECE magnitudes come from a small-sample binned estimator, with no noise floor, no no-skill reference and no interval on the relative reductions. | R1 (W1, W2); EIC (W3, Q3); DA (M1) | `text: §3 "The new OOD queries were confirmed as OOD partly with the system's own retrieval scores"`; `text: §5 "ECE uses 10 equal-width bins (Pakdaman Naeini et al., 2015; Guo et al., 2017), reported with the Brier score"` | REV-14, REV-15 |
| R12 | The core system cannot be re-implemented from the paper. The fusion rule, score normalisation, hybrid confidence, threshold-selection objective and detector-feature selection are all unspecified, and the artifacts are withheld. | R1 (W3; D4 scored block by its own pre-committed trigger); DA (M3, feature ambiguity) | `absence: §4 and §5 — expected fusion formula, score normalisation, hybrid confidence definition, threshold-selection objective, search grids and feature-selection procedure; checked Abstract, §3, §4, §5, §6, §7, Limitations, Ethical Considerations, Appendix A captions` | REV-16 |

---

## Reviewer Summary

| Reviewer | Role | Recommendation | Confidence (self-reported scope disclosure) |
|---|---|---|---|
| Journal-Fit Reviewer (EIC seat) | Senior NLP researcher; ACL-family SRW mentor and reviewer | Major Revision | 4 |
| Reviewer 1 | Methodology: statistician for NLP/ML evaluation | Major Revision | 4 |
| Reviewer 2 | Domain: semantic parsing, NL-to-command, IR | Major Revision | 4 |
| Reviewer 3 | Perspective: HCI and developer tools | Major Revision ("borderline with Minor") | 3 |
| Devil's Advocate | Fixed adversarial seat | N/A (findings only) | N/A (per-finding only) |

Confidence is recorded as scope and uncertainty metadata only. It was not used to weight, count or resolve anything.

### Step 1a: Reviewer Summary Matrix

| Dimension | Journal-Fit Reviewer (EIC) | R1 (Methodology) | R2 (Domain) | R3 (Perspective) | DA |
|---|---|---|---|---|---|
| Overall recommendation | Major | Major | Major | Major (borderline Minor) | findings only |
| Confidence / scope | 4. Did not assess statistics or IR | 4. Figures not visible; retrieval architecture adjacent to expertise | 4. Statistics not assessed | 3. Took the reported numbers as given | per finding (2–5) |
| Key strengths | S1 early scope disclosure; S2 honest ranking of claims; S3 concrete audit finding; S4 positive controls and leakage check; S5 OOD breakdown by kind | S1 candid exploratory framing; S2 all numbers recompute; S3 discordant-pair transparency; S4 tie-aware AURC/AUGRC; S5 Split B; S6 controls, defects and false-rejection cost quantified | S1 reliability literature correctly sourced; S2 accurate text-to-SQL parallel; S3 bounded novelty claim; S4 recent citations mostly accurate; S5 problem framed as reliability | S1 no safety claim made; S2 OOD results actionable for tool builders; S3 closed, offline design; S4 sandboxed execution; S5 human effort not replaced by automation | "Unusually candid"; exact-test and Holm arithmetic re-derived without contradiction |
| Key weaknesses | → Step 1b (3 major, 7 minor) | → Step 1b (3 major, 13 minor) | → Step 1b (2 major, 7 minor) | → Step 1b (2 major, 6 minor) | 0 CRITICAL, 4 MAJOR, 13 MINOR (DA track) |
| Questions | 4 | 4 | 4 | 4 | — |
| Minor issues | 7 (language 2, citation 2, figures/tables 2, layout 1) | 5 | 3 | 3 | — |
| Decision-bearing criteria (narrative scale, copied) | C1, C3, C5, C7 PARTLY_MEETS | D1–D3 PARTLY_MEETS; D4 DOES_NOT_MEET (own block) | Originality, Literature Integration PARTLY_MEETS (contract D2 warn) | P1, P2 PARTLY_MEETS (own warn) | Core thesis, Logic chain, Overgeneralization, Alternative paths PARTLY_MEETS |

### Step 1b: Weakness Sub-Claim Inventory

Each row records one reviewer position on one sub-claim. A reviewer who is not listed for a sub-claim is `not-mentioned`, which is silence, not opposition. Severity and confidence are transported from each card's per-finding tags; all sub-claims from one parent weakness share that weakness's severity. DA positions are listed separately (DA track) and do not count toward consensus.

| sub_claim_id | parent_weakness | reviewer_id | position | evidence_pointer | severity | confidence |
|---|---|---|---|---|---|---|
| SC-1 | EIC W1: architecture-centred framing | EIC | raised | text: §10 "A lightweight, fully offline, non-LLM hybrid retriever with post-hoc calibration improves the reliability…" | major | 4 |
| SC-1 | (same) | R2 | disputed (severity) | R2 W8, text: §1 "(2) A five-component reliability-aware retrieval architecture evaluated under nested cross-validation" | minor | 4 |
| SC-2 | EIC W1: five co-equal contributions, two about reporting | EIC | raised | as SC-1 | major | 4 |
| SC-2 | (same) | R2 | disputed (severity) | R2 W8 "Reorder the contributions to lead with the reliability audit" | minor | 4 |
| SC-3 | EIC W2: several reporting populations in the main text | EIC | raised | text: Limitations "Headline figures exclude them, but the Holm table, sensitivity table, Split B table, and figures include them." | major | 4 |
| SC-4 | EIC W2: caveats repeated; no single claims-status view | EIC | raised | text: §6 "significant, but by 0.003" | major | 4 |
| SC-5 | EIC W3: abstract/§10 OOD claim omits selection effect | EIC | raised | text: Abstract "OOD rejection doubles on v0.2 (17/50→34/50; Holm-adjusted p = 0.00006)" | major | 4 |
| SC-5 | (same) | R1 | corroborated | R1 W1 "Scope the significance statement to the screened set" | major | 4 |
| SC-6 | EIC W4: abstract length | EIC | raised | text: Abstract, about 320 words | minor | 5 |
| SC-7 | EIC W5: significance of the calibration headline not argued | EIC | raised | text: §3 "Confidence = min(round(score/8 × 100), 100), rejected below score < 2.0" | minor | 4 |
| SC-8 | R3 W1 / EIC W5: user-facing meaning of the confidence; interaction model | R3 | raised | text: §9 "It improves the confidence users see, not the answers or their ranking." | major | 4 |
| SC-8 | (same) | EIC | disputed (severity) | EIC W5 "Add one sentence on what a displayed calibrated confidence enables for a user, or say honestly that this is untested"; EIC Q4 | minor | 4 |
| SC-9 | R2 W1 / EIC W6: retrieval-based command assistance omitted | R2 | raised | text: §2 "A targeted search (Limitations) found no prior evaluation of calibration, OOD rejection, and selective prediction for closedvocabulary natural-language-to-shell retrieval" | major | 4 |
| SC-9 | (same) | EIC | disputed (severity) | EIC W6, absence: §2 Related Work — retrieval-based NL-to-command assistants; checked §1, §2, Limitations, References | minor | 3 |
| SC-10 | EIC W6: no generative comparison; the contrast is conceptual | EIC | raised | as EIC W6 | minor | 3 |
| SC-11 | EIC W7: "answerable" used for two sets; 67.3% includes controls | EIC | raised | text: Abstract "it wrongly rejects 11 of 159 answerable queries" vs §3 "the 121 answerable queries are identical in both versions" | minor | 5 |
| SC-12 | EIC W8: headline evidence only in the appendix | EIC | raised | text: §6 "(Table 4, Appendix A; controls included)" | minor | 4 |
| SC-13 | EIC W9: anonymity risk (named, published package) | EIC | raised | text: §1 "implemented in a real, previously published npm package" | minor | 3 |
| SC-14 | EIC W9: ownership of the audited baseline unclear | EIC | raised | as SC-13 | minor | 3 |
| SC-15 | EIC W10 / R2 W6: BashCoder-R1 misdescribed | EIC | raised | text: §2 "despite reinforcement-learning training against execution feedback" | minor | 3 |
| SC-15 | (same) | R2 | corroborated | R2 W6 (same anchor) | minor | 4 |
| SC-16 | R1 W1: OOD selection effect not quantified | R1 | raised | text: §3 "The new OOD queries were confirmed as OOD partly with the system's own retrieval scores" | major | 4 |
| SC-16 | (same) | EIC | corroborated | EIC W3 ("belongs to the methodology seat") and EIC Q3 (gain on the unscreened subsets) | major | 4 |
| SC-17 | R1 W2: ECE estimator bias; no debiased or equal-mass estimate; no noise floor | R1 | raised | text: §5 "ECE uses 10 equal-width bins…" | major | 5 |
| SC-18 | R1 W2: no interval on relative ECE reductions; Brier not led with | R1 | raised | as SC-17 | major | 5 |
| SC-19 | R1 W3: core system unspecified | R1 | raised | absence: §4 and §5 (checked Abstract, §3–§7, Limitations, Ethics, Appendix A captions) | major | 4 |
| SC-20 | R1 W3: artifacts withheld | R1 | raised | as SC-19 | major | 4 |
| SC-21 | R1 W4: CI and exact test disagree for v0.2 | R1 | raised | table: Table 2 — v0.2 raw p 0.0703 alongside caption CI [0.6, 7.5]pp | minor | 5 |
| SC-22 | R1 W5: headline calibration comparison is outside the Holm family | R1 | raised | text: §6 "this is the family's pre-named calibration comparison…" | minor | 4 |
| SC-23 | R1 W6: bound-valued p inside Holm; mixed sidedness | R1 | raised | table: Table 2 — "Calib. ECE reduction" rows | minor | 5 |
| SC-24 | R1 W7: 8/8 OOD label check overstated | R1 | raised | text: §8 "All sampled OOD labels, on which the OOD-rejection result rests, were confirmed" | minor | 4 |
| SC-25 | R1 W8: OOD breakdown covers 44 of 50 queries | R1 | raised | text: §6 "the detector rejects 25 of 34 everyday non-computing requests…" | minor | 5 |
| SC-26 | R1 W9: single CV partition and seed | R1 | raised | text: §5 "nested 5-fold crossvalidation (seed 42, stratified by classification)" | minor | 4 |
| SC-27 | R1 W10: "nested" CV is described as single-level | R1 | raised | text: §5 "the parameter is chosen using only the other four folds…" | minor | 4 |
| SC-28 | R1 W11: no power or minimum-detectable-effect analysis | R1 | raised | text: §3 "…too small for adequately powered tests" | minor | 4 |
| SC-29 | R1 W12: AUROCs lack intervals; correctness-AUROC difference unpaired | R1 | raised | text: §6 "…as means over folds" | minor | 4 |
| SC-30 | R1 W13: "validates benchmark quality" | R1 | raised | text: §7 "Gold commands: 100% functional success (validates benchmark quality)." | minor | 5 |
| SC-31 | R1 W14: safety-evaluation denominator of 125 | R1 | raised | text: §7 "89.6% exact four-level accuracy (112/125)" | minor | 3 |
| SC-32 | R1 W15: calibrators compared by overlapping intervals | R1 | raised | text: §6 "…with overlapping bootstrap intervals" | minor | 5 |
| SC-33 | R1 W16: ECE bootstrap does not re-fit calibrators | R1 | raised | text: §5 "resampling over pooled held-out predictions" | minor | 4 |
| SC-34 | R2 W1: §1 "dominant trajectory … generative" needs qualifying | R2 | raised | as SC-9 | major | 4 |
| SC-35 | R2 W2: NLC2CMD metric misdescribed (confidence-weighted) | R2 | raised | text: §2 "The NLC2CMD competition (Agarwal et al., 2021) introduced a utility+flag-overlap metric…" | major | 5 |
| SC-36 | R2 W3: tool/API retrieval, fusion and ranker-calibration literature missing | R2 | raised | absence: §2 and §4 (checked §2, §4, §9, Limitations, references) | minor | 4 |
| SC-37 | R2 W4: one encoder, one fusion function | R2 | raised | text: §4 "local dense retrieval (Xenova/all-MiniLM-L6-v2…" | minor | 4 |
| SC-38 | R2 W5: "OOD" vs out-of-scope; "closed-vocabulary" | R2 | raised | text: Abstract "post-hoc calibration and out-of-domain (OOD) rejection" | minor | 4 |
| SC-39 | R2 W7: no link to query performance prediction | R2 | raised | text: §6 "(feature: absolute top-1 score) … (feature: margin)" | minor | 3 |
| SC-40 | R2 W9: no public benchmark; choice not explained | R2 | raised | absence: §3 and Limitations (checked §2, §3, §10, Limitations) | minor | 3 |
| SC-41 | R3 W1: no cost-of-harm operating point | R3 | raised | as SC-8 | major | 4 |
| SC-42 | R3 W1: "the number users see" implies user benefit | R3 | raised | as SC-8 | major | 4 |
| SC-43 | R3 W1: a preference study is the wrong future study | R3 | raised | as SC-8 | major | 4 |
| SC-44 | R3 W2: risk × correctness × confidence unmeasured | R3 | raised | text: §4 "A sixth, independent component, a rule-based safety classifier, targets command risk, which is orthogonal to retrieval correctness." | major | 4 |
| SC-45 | R3 W2: deployment safeguards and risk-dependent threshold | R3 | raised | as SC-44 | major | 4 |
| SC-46 | R3 W3: calibration fitted and scored on a constructed query mix | R3 | raised | text: §3 "subsets were too small for adequately powered tests" | minor | 3 |
| SC-47 | R3 W4: single answer vs shortlist; recall@k | R3 | raised | text: §1 "the task is to return the single best-matching command, or explicitly decline to answer" | minor | 3 |
| SC-48 | R3 W5: what the user experiences on a rejection | R3 | raised | text: §9 "it costs 11 false rejections on 159 answerable queries" | minor | 4 |
| SC-49 | R3 W6: platform missing from headline wording | R3 | raised | text: §3 "a few Windows-visible records are Linux commands (e.g., sudo reboot)" | minor | 4 |
| SC-49 | (same) | EIC | disputed (existence) | EIC S1 and C4 MEETS: text: §1 "The hybrid retriever we evaluate is a research prototype and is not part of the published package." | n/a (strength) | 4 [CONFIDENCE-SOURCE: report-level] |
| SC-50 | R3 W7: users of the shipped package not considered | R3 | raised | text: §1 "…not part of the published package." | minor | 3 |
| SC-51 | R3 W8: no-LLM rationale asserted, not argued | R3 | raised | text: §1 "without abandoning the no-LLM, fully-offline design constraint" | minor | 3 |

**DA track** (does not count toward consensus). Each DA finding is mapped to the sub-claims it corroborates or bears on:

| DA finding | Band | Confidence | Bears on | Relation |
|---|---|---|---|---|
| M1 no no-skill reference for the calibration headline | major | 4 | SC-7, SC-17 | corroborates; also asks for a constant/base-rate forecaster reference |
| M2 ranking claim lacks an interval on the isolating metric | major | 4 | SC-29 | corroborates at higher severity |
| M3 OOD result is an operating-point comparison | major | 4 | none (DA only) | new DA-only sub-claim; adjacent to SC-16 |
| M4 calibration claims extend to users and to deployment distributions | major | 3 | SC-42, SC-46 | corroborates at higher severity than R3 W3 |
| m1 "answerable" terminology | minor | 5 | SC-11 | corroborates |
| m2 original vs added OOD gains are nearly equal in rate | minor | 4 | SC-16 | counter-evidence to the paper's selection-effect reading (see Disagreement 6) |
| m3 two p-values for the same 15 OOD queries | minor | 3 | none | DA-only |
| m4 44 of 50 OOD partition | minor | 4 | SC-25 | corroborates |
| m5 ranking below 64% coverage lies in one tie block | minor | 4 | none | DA-only; compatible with R1 S4 |
| m6 AURC/AUGRC not checked on answerable-only queries; v0.1 labels never re-annotated | minor | 3 | none | DA-only (agreement-study part tagged [FIELD-NORM UNVERIFIED] by the DA) |
| m7 A5 decision outcome worsens on v0.2 | minor | 4 | SC-41 | adjacent |
| m8 "validates benchmark quality" | minor | 4 | SC-30 | corroborates |
| m9 queries "checked against actual system retrieval output" | minor | 2 | SC-40 | corroborates |
| m10 errors not weighted by risk | minor | 3 | SC-44 | corroborates |
| m11 the RQ's comparative clause is never measured | minor | 3 | SC-10 | corroborates |
| m12 single CV seed | minor | 2 | SC-26 | corroborates ([FIELD-NORM UNVERIFIED] per DA) |
| m13 the motivating statistic pools ambiguous items | minor | 3 | none | DA-only |

### Step 1c: Surface-Form Parity Check

Each sub-claim was judged on its substance against the manuscript text, not on how it was worded. The informal or low-confidence items were read on substance: DA m9 (confidence 2, "the wording is ambiguous"), R1 W14 (confidence 3) and R3 W4 (confidence 3, "may not match NLP task conventions"). None was down-rated for its phrasing, and none is unevaluable. Technical precision was not treated as corroboration. For example, the DA M1 Brier argument is checked against the manuscript in the Factual Checks section, not accepted on its specificity. No sub-claim was marked unevaluable.

---

## Consensus Analysis

### Points of Agreement (Consensus)

No weakness sub-claim reached CONSENSUS-4 or CONSENSUS-3. The largest agreement on a weakness is 2 of 4 (SC-5, SC-15, SC-16). The panel's agreement is at the level of the recommendation and the paper's strengths:

**[CONSENSUS-4]** (all four non-DA seats)
1. **Recommendation: Major Revision.** EIC, R1, R2 and R3 all tick Major Revision. R3 notes it is "borderline with Minor".
2. **No fatal flaw; every issue is repairable.** EIC's recommendation rationale says "No criterion is failed outright"; R1's rationale says "None of these problems is fatal"; R2 says "The fatal trigger does not apply either"; R3 says "Neither requires a user study".
3. **Disclosure is candid and the claims are carefully hedged (a strength).** See EIC S2 ("Honest ranking of which claims hold"), R1 S1 ("Candid exploratory framing of all inference"), R2 S3 and its summary ("the claims are carefully scoped"), and R3's summary ("The paper is unusually candid"). The DA agrees ("unusually candid").

**[CONSENSUS-3]** (three seats agree; the fourth is silent)
1. **The narrow novelty claim ("this combination") survives.** EIC rates Originality MEETS; R2 found no prior work contradicting it (R2 S3; R2 W1 "Neither undercuts the specific combination"); R3 rates Originality MEETS. R1 is silent (Originality NOT_ASSESSED).
2. **Repair needs no new data collection.** EIC says it can be fixed "without new experiments or re-analysis" for its own criteria; R2 says "no new data collection is required"; R3 says "Neither needs new data collection". R1 is silent on this point. Its requests (R1 W1, W2, W9, W12, W15, W16) are all re-analyses of existing outputs, and none asks for new data.

**Corroborated findings (2 of 4, no conflict)**
- SC-5: the abstract and §10 OOD claim should be scoped to the score-screened set (EIC W3, R1 W1).
- SC-15: BashCoder-R1 is misdescribed (EIC W10, R2 W6).
- SC-16: the OOD selection effect must be quantified (R1 W1; EIC W3 and Q3).

All other sub-claims are single-reviewer findings. They were assessed against their named criterion and anchored evidence (see the roadmap).

### Points of Disagreement

**Disagreement 1: How severe is the architecture-centred framing? (SC-1, SC-2)**
- **EIC view**: Major. The title, the RQ, the five co-equal contributions and the opening sentence of §10 credit the hybrid, although "the most consistent result, a 79% ECE reduction, is obtained by recalibrating the shipped BM25 baseline's own confidence and involves no hybrid" (EIC W1).
- **R2 view**: Minor. The contribution list "credits the architecture", and the real contribution is "an empirical reliability case study" (R2 W8).
- **Disagreement type**: severity disagreement. Both seats agree on the substance and the remedy: lead with the audit and calibration findings, and treat the hybrid as the vehicle for the study.
- **Editor's Resolution**: the problem is confirmed and made Required (REV-01). The transported severity is major, from EIC W1, which is the driving finding. R2's minor rating is recorded.
- **Resolution Rationale**: On expertise, contribution framing and venue fit belong to the Journal-Fit seat (Card #1, focus 1; contract D6 owner `eic`). R2 rated the issue by its impact on domain accuracy, which is a different criterion. On evidence, the manuscript confirms each element: the title; the §1 RQ ("Can a lightweight hybrid … architecture … measurably improve accuracy and reliability"); contribution (2); §10 sentence 1; and §6 ("isotonic calibration lowers its ECE from 0.323 to 0.069 … (79% each …)", applied to the shipped baseline's confidence). The DA's Strongest Counter-Argument reaches the same reading. It was written blind to peer outputs, but by the same model family (see the correlated-error disclosure).

**Disagreement 2: How severe is the missing retrieval-based command-assistance literature? (SC-9)**
- **R2 view**: Major. The NLC2CMD TF-IDF retrieval entry, with its learned confidence adjuster, and ShellFusion (ICSE 2022) are omitted, so "the gap look[s] larger than it is" (R2 W1).
- **EIC view**: Minor. DocPrompting and CLAI should be located, but "this is not a novelty-killing omission". EIC also says "The domain seat may name further works" (EIC W6, confidence 3, "adjacent").
- **Disagreement type**: severity disagreement. Both agree the omission does not overturn the combination claim.
- **Editor's Resolution**: Required (REV-07), with the transported severity major from R2 W1.
- **Resolution Rationale**: On expertise, literature coverage is the domain seat's remit (contract D2 owner `domain`), and EIC explicitly deferred to it. On evidence, the manuscript's §2 cites only generation-oriented NL-to-shell work plus the NLC2CMD metric. R2 reports reading the primary sources directly. The synthesizer did not re-verify those external sources, so the author must check each citation. Because both seats agree the novelty claim stands, this item needs rewriting only and adds no pressure toward rejection.

**Disagreement 3: How much must the paper say about what the user sees and does with the confidence? (SC-8)**
- **R3 view**: Major. The paper gives no interaction model: how confidence is displayed, what a rejection shows, whether commands are printed or run. The claim about "the number users see" therefore goes beyond what the paper measures (R3 W1, R3 W5).
- **EIC view**: Minor. "Add one sentence on what a displayed calibrated confidence enables for a user, or say honestly that this is untested" (EIC W5; EIC Q4).
- **Disagreement type**: severity disagreement, with compatible remedies.
- **Editor's Resolution**: Required (REV-06; transported severity major from R3 W1). The minimum requirement is an interaction-model paragraph plus an honest statement of what is untested. No user study is required: R3 W1 says "A user study is not needed for a workshop paper", and EIC agrees. R3's operating-point analysis is Suggested (REV-39).
- **Resolution Rationale**: On expertise, the user-facing meaning of the confidence is the perspective seat's remit (Card #4, focus 1). On evidence, §6 justifies leading with the shipped baseline's confidence as "the number users see", while §6 and §9 say calibration "changes reported confidence, not decisions". The manuscript contains no description of the display. Both seats' remedies are satisfied by the same paragraph.

**Disagreement 4: Is the platform scope adequately disclosed? (SC-49)**
- **R3 view**: No. "The abstract never says Windows, PowerShell or cmd", and the title says "shell" (R3 W6, minor).
- **EIC view**: Yes. "The introduction states the single tool, the 279-command Windows corpus … A reader is not misled about scale" (EIC S1). EIC also rates C4 Scope disclosure MEETS.
- **Disagreement type**: existence disagreement.
- **Editor's Resolution**: Suggested (REV-45): name the platform in the abstract; changing the title is optional.
- **Resolution Rationale**: On evidence, the manuscript supports both factual statements. The abstract names neither Windows nor the 279-command corpus size; §1 names both ("279 commands on the evaluated Windows platform"). EIC's C4 rationale says corpus size is "stated in the abstract", but the abstract gives only the benchmark size (150 queries). R3 is therefore right about the headline wording, and EIC is right that §1 discloses the scope early. The fix is one phrase and can go into the abstract rewrite (REV-04). R3 itself marks P3 as not decision-bearing.

**Disagreement 5: Added analyses vs. readability in 8 pages** (flagged as a tension in Phase 0; no sub-claim is disputed)
- **R1 view**: add estimators and intervals: debiased and equal-mass ECE, a noise floor, a dual interval with a mid-p sensitivity check, repeated partitions, paired AUROC and calibrator differences (R1 W2, W4, W9, W12, W15, W16). R1 also praises the extensive hedging (R1 S1).
- **EIC view**: there are already too many parallel numbers and repeated caveats. Report one population and state each caveat once (EIC W2, C5).
- **Disagreement type**: perspective and direction. Neither seat disputes the other's sub-claims.
- **Editor's Resolution**: both requirements hold. The main text reports one population (controls excluded) and one primary estimate per claim, plus a claims-status table (REV-02). R1's sensitivity analyses go into one appendix table, with a one-sentence main-text summary each. Where an analysis changes a verdict (for example, R1 W4's method dependence), the main text must say so.
- **Resolution Rationale**: author autonomy on placement. Neither seat's substance is lost, and EIC W8 still requires the main text to stand without the appendix.

**Disagreement 6 (DA vs. manuscript; outside the consensus count): How large is the OOD selection effect?**
- **R1 view**: the only Holm-significant detection result "is driven by these items" (25/35 vs 13/35), which were screened on the detector's features. The size of the selection effect is unmeasured (R1 W1).
- **DA view**: in rate terms the gains are almost identical: +33.3 points on the original 15 (4/15→9/15) and +34.3 points on the added 35 (13/35→25/35). "If anything they argue against a large selection effect" (DA m2).
- **Manuscript**: §6 calls the original-subset gain "smaller … consistent with the selection effect noted in §3, though too small to test it".
- **Disagreement type**: evidence interpretation.
- **Editor's Resolution**: unresolved on the current evidence. Both arithmetic statements are correct (see the Factual Checks section). Equal rate gains do not rule out truncation on the detection feature, because the baseline rates of the two subsets also differ (26.7% vs 37.1%). Conversely, R1's point that the significance comes from the larger subset says nothing about how big the effect is. The author must run REV-14 and must restate §6's "smaller gain" in rate terms. The panel did not resolve this dispute.

**Disagreement 7 (DA vs. EIC/R3 readings; outside the consensus count): Does the recalibrated shipped confidence carry information?**
- **DA view**: a constant base-rate forecaster would also score low ECE. The post-calibration Brier values "lie inside" the no-skill range, so the calibrated confidence "may therefore carry about as little information as a constant" (DA M1).
- **EIC view**: a large ECE reduction from recalibrating a heuristic score is expected, and the paper should argue why it is not trivial (EIC W5).
- **R3 view**: "A heuristic confidence … should not be shown as a percentage without calibration" is "the most practically significant finding" (R3, Practical Impact).
- **Editor's Resolution**: the request for a no-skill reference and a Brier decomposition is accepted and folded into REV-15 (Required). The hypothesis that the calibrated confidence is about as uninformative as a constant is not established by the manuscript and is recorded as unresolved, for the author to verify.
- **Resolution Rationale**: See the Factual Checks section. The manuscript reports a correctness AUROC of 0.755 and 0.830 for the shipped confidence before calibration, which is informative ranking. It does not report the baseline's pooled AUROC after calibration. The Brier comparison depends on a population that §5 and §6 do not state.

### Devil's Advocate Adjudication

**CRITICAL findings: none.** `phase1_DA.md` states "No finding meets the CRITICAL evidence burden" (line 64), and its CRITICAL table (lines 66–68) has a header and no rows. `da_critical_adjudications: []`. This package therefore has no DA-CRITICAL item and no DA-CRITICAL blocking consideration.

**MAJOR findings** (adjudicated for visibility; they are not vetoes):

| DA finding | Corroborated by | Check against manuscript | Adjudication | Roadmap |
|---|---|---|---|---|
| M1 no no-skill reference for calibration | R1 W2 (noise floor, a different reference); EIC W5 (significance) | Confirmed: no base-rate or constant-forecaster ECE/Brier and no Brier decomposition is reported. The "carries as little information as a constant" reading is not established (see Factual Checks, F4) | Validated in part; the information-content hypothesis is unresolved | REV-15 (must_fix) |
| M2 ranking claim relies on metrics confounded with accuracy | R1 W12 (minor) | Confirmed: §9 lists "correctness AUROC" among the evidence for better error ordering, and §6 gives only point estimates (0.858 vs 0.755; 0.889 vs 0.830) | Validated | REV-26 (must_fix, either-or) |
| M3 OOD result is an operating-point change | none among the four; R1 W3 on the undefined detector feature | Confirmed absent: baseline OOD AUROC, the baseline's non-OOD false rejections, and a matched-false-rejection comparison. p = 0.000015 is consistent with 17–0 discordance. Unverified: whether the detector thresholds the same BM25 score as the baseline (§6 says only "absolute top-1 score") | Validated in part; the shared-score premise is for the author to verify | REV-49 (must_fix, either-or) |
| M4 calibration claims generalize to users | R3 W3 (minor); R3 W1 | Confirmed wording: §6 "the number users see"; §9 "It improves the confidence users see". Split B attenuation (77.2%→69.0% on v0.2) is reported in §6 | Validated | REV-40 (must_fix) |

The DA MINOR findings are mapped in the Step 1b DA-track table. DA-only minors appear as Suggested items REV-50 to REV-53. DA's Ignored Alternatives 3–6 appear as REV-54. Alternatives 1 and 2 are covered by M1 and M3.

### Factual Checks Against the Manuscript

These are reviewer claims that conflict with each other or with the manuscript, or that the decision relies on. The manuscript text was checked; result files were not visible.

| # | Claim(s) | What `manuscript_review.txt` says | Status |
|---|---|---|---|
| F1 | EIC W4: the abstract is "about 320 words"; Phase 0: "about 300 words" | The abstract (lines 6 and 8) is 320 whitespace-delimited tokens | EIC's count is confirmed. The 200-word limit comes from EIC's ACLPUB citation; venue criteria are unbound, so the author should confirm the EACL 2027 SRW limit |
| F2 | EIC S1/C4: corpus size is stated in the abstract, and scope is not misleading. R3 W6: the abstract never names the platform | The abstract names neither Windows nor 279 commands; it gives "a 150-query benchmark". §1 gives "279 commands on the evaluated Windows platform" | R3 is correct about the abstract. EIC is correct about §1. EIC's "corpus size in the abstract" is inaccurate if it refers to the 279-command corpus |
| F3 | DA m2 (rate gains nearly equal) vs §6 ("smaller gain … consistent with the selection effect") and R1 W1 (the result is driven by the added items) | §6: 9/15 vs 4/15 and 25/35 vs 13/35. Rates are +33.3 and +34.3 points; counts are +5 and +12 | DA's arithmetic is correct, and "smaller" holds only in counts. R1 is correct that significance comes from the added items. The size of the selection effect is for the author to verify (REV-14) |
| F4 | DA M1: post-calibration Brier (0.198, 0.169) lies within the no-skill p(1−p) range | §6 reports these Brier values but does not state the population for ECE/Brier. If the population is controls-excluded non-OOD queries, the base-rate Brier would be 72/110 → 0.226 and 95/134 → 0.206, above the reported values. The DA's 0.17–0.23 range assumes accuracies of 0.65–0.79. §6 reports correctness AUROC of 0.755 and 0.830 for the shipped confidence before calibration; the post-calibration baseline AUROC is not reported | Not established by the manuscript. The author must state the population and report the no-skill reference (REV-15) |
| F5 | EIC W2: Table 2's caption CIs differ from the text's CIs for the same comparisons | Text: [1.8, 10.9] and [0.7, 9.0] (controls excluded). Table 2 caption: [2.2, 8.9] and [0.6, 7.5]; the caption says "All rows include the canonical controls" | Confirmed. The two sets use different populations for the same comparison, which is a readability issue rather than an arithmetic error |
| F6 | R1 W4: the v0.2 CI excludes zero while p = 0.070 | §6: CI [0.7, 9.0], raw p = 0.070; Table 2: 0.0703 and [0.6, 7.5] | Confirmed |
| F7 | EIC W7 / DA m1: "answerable" means both 121 and 159 queries | "121 answerable" in §3 and Limitations; "159 answerable" in the Abstract, §6 and §9. 67.3% = 101/150 includes the controls and OOD queries | Confirmed |
| F8 | R1 W8 / DA m4: the OOD breakdown covers 44 of 50 queries | §6: 34 everyday plus 10 terminal tasks; rejections 25 + 4 = 29 of 34 | Confirmed |
| F9 | R1 W14: safety denominator of 125 vs 135 non-OOD queries | §7: "On v0.1 gold commands … (112/125)"; no inclusion rule is stated | Confirmed that no rule is given. The actual rule is for the author to verify |
| F10 | DA M3: p ≈ 1.5e-5 = 2×0.5^17 (17–0 discordance) | Table 2: 0.000015. §6: "17 OOD queries newly rejected". 2×0.5^17 = 1.53e-5 | Consistent. Whether the detector's feature is the BM25 or the fused top-1 score is for the author to verify |
| F11 | R2 W2, R2 W6, EIC W10: NLC2CMD scoring was confidence-weighted; BashCoder-R1 used static-analysis rewards | The manuscript's descriptions are confirmed as quoted (§1 "executiongrounded"; §2 "against execution feedback"; §2 "utility+flag-overlap metric") | Claims about the external sources were not re-verified by the synthesizer. The author must verify against arXiv 2103.02523 and 2606.27733 |
| F12 | R3 minor: the text shows `git checkout - .` | Line 146 shows "git checkout - ." | Confirmed in the extraction. Whether this is an extraction artifact is for the author to verify in the PDF |
| F13 | EIC W9: the package is named, and ownership is implied | §3 heading "TermAssist: …"; §1 "real, previously published npm package"; Ethics "our own baseline audit"; §8 "the project's human director" | Confirmed |
| F14 | R2 minor: the NL2SH reference includes Miguel Tulla | The reference list includes "Miguel Tulla" | Confirmed in the manuscript. The ACL Anthology author list is for the author to verify |

---

## Decision Rationale

All four scoring seats recommend Major Revision. Under the no-contract decision matrix (Major/Major/Major/Major), that gives **Major Revision**. The decision rests on the anchored findings and was checked against them, not only against the recommendation count.

**Why not Minor.** Several validated major issues require re-analysis and a second review, not just clarification:
- The OOD headline rests on items screened with the detector's own features, and the selection effect has not been quantified (R1 W1, corroborated by EIC W3 and Q3).
- The ECE magnitudes behind the lead claim have no interval, no noise floor and no no-skill reference (R1 W2; DA M1).
- The core system cannot be re-implemented from the paper (R1 W3, which R1 scored as a block under its own pre-committed trigger).
- The destructive-command case the paper uses as motivation is never measured jointly with correctness (R3 W2).

In addition, the title, research question, contributions and abstract have to be reframed around the results that are actually robust (EIC W1 and W3; R2 W8), and the research-gap argument has to be rewritten against prior work that is omitted or misdescribed (R2 W1 and W2). The three severity splits (Disagreements 1–3) were resolved on expertise and manuscript evidence, not on a strictness prior.

**Why not Reject.** No seat found a fatal flaw, and the DA reported no CRITICAL finding. Three seats confirm that the narrow novelty claim survives (EIC, R2, R3). Three seats state that no new data collection is needed (EIC, R2, R3), and R1's requests are all re-analyses of existing outputs. All seats credit the candour of the disclosure and the internally consistent arithmetic (R1 recomputed every count and p-value with no mismatch).

**Scope of the revision.** Of the 17 Required items, 11 need rewriting only and 3 need new analysis of existing outputs. The page budget comes from consolidating reporting views and shortening the abstract (EIC W2, W4). A breakdown by kind of work is in Part 2.

---

## Required Revisions (Must Fix)

Ordered by immutable roadmap source order: seat order EIC, R1, R2, R3, DA, then finding ordinal, then sub-claim ordinal. Items are filtered to `must_fix`. `R<n>` is a transport reference, not a work rank.

**Cost key.** `sentence` and `section` mean rewriting only. `re_analysis` means new analysis of existing outputs (NEW ANALYSIS). No item requires `new_data`.

| Transport ref | Revision Item | Sub-Claim(s) | Severity | Evidence Anchor | Confidence | Source Reviewer | Obligation class | Cost scope | Bounded consequence |
|---|---|---|---|---|---|---|---|---|---|
| R1 | REV-01: Reframe title, RQ, contributions and §10 opening around the robust findings; the hybrid becomes one arm of the study | SC-1, SC-2 | major (EIC W1; R2 W8 minor) | `text: §10 "A lightweight, fully offline, non-LLM hybrid retriever with post-hoc calibration improves the reliability of a shipped BM25 command-retrieval baseline."` | 4 (EIC: core expertise, framing) | EIC W1, EIC Q2; R2 W8 | must_fix | section: Title, §1 RQ and Contributions, §10 para 1 (rewriting) | claim_scope_unsupported → claim: Title / §1 contribution (2) / §10 sentence 1 |
| R2 | REV-02: One reporting population in main-text tables; a claims-status table; secondary views moved to the appendix; each caveat stated once | SC-3, SC-4 | major | `text: Limitations "Headline figures exclude them, but the Holm table, sensitivity table, Split B table, and figures include them."` | 4 (EIC: SRW reviewing) | EIC W2; DA Observation 3 | must_fix | section: §6, Tables 1–4, Limitations (rewriting; recompute controls-excluded table entries from existing outputs if needed) | reader_traceability_reduced → section: §6 |
| R3 | REV-03: Scope the OOD claim in the Abstract and §10 to the score-screened set; give the original-subset result or drop the Holm p | SC-5 | major | `text: Abstract "OOD rejection doubles on v0.2 (17/50→34/50; Holm-adjusted p = 0.00006)"` | 4 (EIC) | EIC W3; R1 W1 | must_fix | sentence: Abstract, §10 (rewriting) | claim_scope_unsupported → claim: Abstract OOD sentence; §10 "OOD rejection improves significantly" |
| R4 | REV-04: Cut the abstract to the venue limit (≤200 words per EIC's ACLPUB citation) | SC-6 | minor | `text: Abstract, about 320 words, beginning "Natural-language interfaces to the shell are usually framed as generation (NL2Bash, NL2SH)."` | 5 (EIC: format rule verified) | EIC W4 | must_fix | section: Abstract (rewriting) | editorial_conformance_unmet → section: Abstract |
| R5 | REV-06: Describe the interaction model: how confidence is displayed, what a rejection shows, print vs run, any confirmation step; state what calibrated confidence enables or that this is untested | SC-8, SC-48 | major (R3 W1; EIC W5 minor) | `text: §9 "It improves the confidence users see, not the answers or their ranking."` | 4 (R3: HCI of uncertainty communication) | R3 W1, R3 W5, R3 Q1; EIC W5, EIC Q4 | must_fix | section: new short paragraph in §1 or §3 (rewriting) | interpretive_ambiguity_remains → claim: §6 "the number users see" |
| R6 | REV-07: Add a related-work paragraph on retrieval-based command and documentation assistance (NLC2CMD TF-IDF entry, ShellFusion, DocPrompting, CLAI); restate the gap; qualify §1's "dominant trajectory … generative" | SC-9, SC-34 | major (R2 W1; EIC W6 minor) | `text: §2 "A targeted search (Limitations) found no prior evaluation of calibration, OOD rejection, and selective prediction for closedvocabulary natural-language-to-shell retrieval"` | 4 (R2: NL-to-command literature; sources read) | R2 W1, R2 Q1; EIC W6 | must_fix | section: §1 para 1, §2 (rewriting; author to verify citations) | claim_scope_unsupported → claim: §2 research-gap statement |
| R7 | REV-09: Use "answerable" only for the 121; "non-OOD" for 159/135; label 67.3% as overall including controls and OOD, or replace it | SC-11 | minor | `text: Abstract "it wrongly rejects 11 of 159 answerable queries"` vs `text: §3 "the 121 answerable queries are identical in both versions"` | 5 (EIC: verified in text) | EIC W7; DA m1 | must_fix | sentence: Abstract, §6, §9 (rewriting) | reader_traceability_reduced → claim: false-rejection cost statement |
| R8 | REV-11: Anonymize the package name and publication pointer in the review version; state neutrally whether the authors developed the audited baseline | SC-13, SC-14 | minor | `text: §1 "implemented in a real, previously published npm package"` | 3 (EIC: public package page not checked) | EIC W9, EIC Q1 | must_fix | sentence: §1, §3 heading, §8, Ethical Considerations (rewriting) | editorial_conformance_unmet → manuscript: review build |
| R9 | REV-12: Correct the BashCoder-R1 description (static-analysis reward; FullRate definition) in §1 and §2; align the reference title with the version of record | SC-15 | minor | `text: §2 "despite reinforcement-learning training against execution feedback"` | 4 (R2: read the cited paper); 3 (EIC: abstract only) | EIC W10; R2 W6 | must_fix | sentence: §1, §2, References (rewriting; author to verify against source) | claim_scope_unsupported → claim: §2 "exact-match accuracy alone is an incomplete signal" support |
| R10 | REV-14: Quantify the OOD selection effect: drafted, discarded and edited candidates at screening; per-fold thresholds vs the 7.39/0.31 bounds; detection reported separately on unscreened items; restate "smaller gain" in rates | SC-16 | major | `text: §3 "The new OOD queries were confirmed as OOD partly with the system's own retrieval scores"` | 4 (R1: selection effects) | R1 W1, R1 Q1; EIC W3, EIC Q3; DA m2 | must_fix | re_analysis: §3, §6 (NEW ANALYSIS of existing records) | evidence_gap_remains → claim: OOD rejection result (§6, §9, §10) |
| R11 | REV-15: Make the calibration magnitudes interpretable: equal-mass plus debiased or sweep ECE; noise floor; no-skill (base-rate) ECE/Brier or Brier decomposition; intervals on relative reductions; lead with Brier and its paired interval; state the population | SC-17, SC-18 | major | `text: §5 "ECE uses 10 equal-width bins (Pakdaman Naeini et al., 2015; Guo et al., 2017), reported with the Brier score"` | 5 (R1: calibration-error estimation) | R1 W2; DA M1 | must_fix | re_analysis: §5, §6, appendix table (NEW ANALYSIS) | evidence_gap_remains → claim: 79% / 67% / 81% ECE reductions |
| R12 | REV-16: Specify the fusion equation, score normalisation, hybrid confidence, margin/entropy, α grid, threshold objective, and how detector features were chosen (inside CV or not); state which top-1 score the detector uses | SC-19 | major | `absence: §4 and §5 — expected fusion formula, score normalisation, hybrid confidence definition, threshold-selection objective, search grids and feature-selection procedure; checked Abstract, §3, §4, §5, §6, §7, Limitations, Ethical Considerations, Appendix A captions` | 4 (R1: reproducibility standards) | R1 W3, R1 Q2; DA M3 | must_fix | section: §4 plus appendix (specification writing) | method_reproducibility_unresolved → section: §4 |
| R13 | REV-26: Give a paired interval for the correctness-AUROC difference and pooled AUROCs with CIs, or reword §9 so that the ranking claim rests on AURC/AUGRC only | SC-29 | minor (R1 W12; DA M2 major) | `text: §6 "correctness AUROC, which isolates ranking, is 0.858 vs. 0.755 on v0.1 and 0.889 vs. 0.830 on v0.2"` | 4 (R1: ROC inference) | R1 W12; DA M2 | must_fix | re_analysis: §6, §9 (NEW ANALYSIS; or sentence-level if the rewording route is taken) | claim_scope_unsupported → claim: §9 "orders its own errors better … correctness AUROC" |
| R14 | REV-32: Correct the NLC2CMD metric description (confidence-weighted); explain how ECE/AURC/AUGRC differ from it; cite CLAI | SC-35 | major | `text: §2 "The NLC2CMD competition (Agarwal et al., 2021) introduced a utility+flag-overlap metric more tolerant of near-miss answers than exact match."` | 5 (R2: verified in cited source) | R2 W2 | must_fix | sentence: §2 (rewriting; author to verify against source) | claim_scope_unsupported → claim: §2 NLC2CMD sentence and the reliability framing |
| R15 | REV-40: Scope the user- and distribution-facing calibration claims: reword "the number users see" and "the confidence users see"; limit calibration claims to the benchmark distribution; add a Limitations bullet on non-user queries; say what data a deployed calibrator would be fitted on | SC-42, SC-46 | major (R3 W1; R3 W3 minor; DA M4 major) | `text: §9 "It improves the confidence users see, not the answers or their ranking."` | 4 (R3) | R3 W1, R3 W3, R3 Q3; DA M4 | must_fix | sentence: §6 Calibration sentence 2, §9, §10, Limitations (rewriting) | claim_scope_unsupported → claim: calibration "improves the confidence users see" |
| R16 | REV-42: Report a joint table of correctness × the classifier's risk level of the returned command × confidence band, for both systems | SC-44 | major | `text: §4 "A sixth, independent component, a rule-based safety classifier, targets command risk, which is orthogonal to retrieval correctness."` | 4 (R3: safety of suggested commands) | R3 W2, R3 Q2; DA m10 | must_fix | re_analysis: §7 (NEW ANALYSIS of existing risk fields and classifier; author to verify feasibility) | evidence_gap_remains → claim: §1 contribution (1) and the destructive-command motivation |
| R17 | REV-49: Treat the OOD result as an operating-point comparison: report baseline-score OOD AUROC, the baseline's non-OOD false rejections, and rejection at a matched false-rejection rate (or a threshold sweep); or reword it as an operating-point change | — (DA-only, SINGLE-VERIFIER) | major | `text: §6 "the tuned OOD detector raises the rejection rate on OOD queries from the baseline's 34.0% to 68.0%"` | 4 (DA: exact-test arithmetic reproduced) | DA M3 | must_fix | re_analysis: §6 (NEW ANALYSIS; or sentence-level on the rewording route) | claim_scope_unsupported → claim: §10 "OOD rejection improves significantly" |

### Required Item Details

**R1: Reframe around the robust findings (REV-01)**
- **Problem**: The title, the research question, the five co-equal contributions and the opening sentence of §10 present the hybrid architecture as the source of improved reliability. The most consistent result, a 79% ECE reduction, comes from recalibrating the shipped baseline's own confidence. The hybrid-specific accuracy gain is the paper's most fragile result.
- **Source**: EIC W1 ("A reader cannot tell what the one contribution is"); EIC Q2; R2 W8 ("the architecture framing overstates it"); DA Strongest Counter-Argument (context).
- **Requirement**: State one contribution. Reduce the contributions to two or three findings, and move "disclosure" and "Holm-corrected significance" into the method description. Retitle to match. Split §10's first sentence into what calibration alone does and what the hybrid adds.
- **Acceptance criteria**: The title, RQ, contribution list and §10 opening name the audit and recalibration finding and the hybrid-specific findings separately, and no sentence credits the hybrid with the baseline-recalibration result.

**R2: One reporting population and a claims-status view (REV-02)**
- **Problem**: Each comparison appears in several versions: controls in or out, Split A or B, v0.1 or v0.2, five subsets, and two CI sets. Caveats are repeated in every section.
- **Source**: EIC W2 (C5 readability, decision-bearing); DA Observation 3.
- **Requirement**: Use the controls-excluded population in every main-text table. Add a claims-status table with columns: claim, effect with CI, test, robust or fragile, and where the robustness check is. Move Split B, the bare-keyword sensitivity analysis and per-subset p-values to the appendix, each summarized in one main-text sentence. State each caveat once, in Limitations.
- **Acceptance criteria**: Every main-text table uses a single stated population, one claims-status table exists, and each exploratory or fragility caveat appears once in the main text outside the claims table and Limitations.

**R3: Scope the OOD headline (REV-03)**
- **Problem**: The abstract headlines "OOD rejection doubles … Holm-adjusted p = 0.00006". It omits two things: the added OOD items were screened with the detector's own scores, and the gain on the 15 original items is not significant (9/15 vs 4/15, p = 0.0625). §10 says "OOD rejection improves significantly".
- **Source**: EIC W3; R1 W1 ("Scope the significance statement to the screened set").
- **Requirement**: Add the selection-effect clause and the original-subset result to the abstract, or remove the Holm p from it. Scope §10's significance statement to the screened set.
- **Acceptance criteria**: Wherever the abstract and §10 state the OOD gain, the same sentence or the next one says the added items were score-screened and reports the unscreened-subset result.

**R4: Abstract length (REV-04)**
- **Problem**: The abstract is 320 words. EIC cites ACLPUB's 200-word guidance. The abstract also carries about two dozen numbers.
- **Source**: EIC W4.
- **Requirement**: Cut the abstract to the venue limit. Keep the problem, the approach, three results with one number each, and one sentence on fragility and exploratory status. Move κ, the answerable-query count and the pending-study sentence to the body. Confirm the limit in the EACL 2027 SRW call (venue criteria are not bound).
- **Acceptance criteria**: The abstract is at or under the confirmed venue limit and still states the exploratory status in one sentence.

**R5: Interaction model and user-facing meaning (REV-06)**
- **Problem**: §6 justifies leading with the shipped confidence as "the number users see", and §6 and §9 say calibration changes "reported confidence, not decisions". The paper never says whether or how the published tool displays confidence, what a rejection shows, or whether a command is printed or run.
- **Source**: R3 W1, R3 W5, R3 Q1; EIC W5, EIC Q4 (Disagreement 3).
- **Requirement**: Add a short paragraph describing what the published tool shows and what the user does next, including what happens on a rejection. State in one sentence what a calibrated confidence enables for the user, or say plainly that this is untested. No user study is required.
- **Acceptance criteria**: The manuscript contains a paragraph describing the tool's display, rejection behavior and execution mode, and an explicit statement of what user benefit is claimed or that it is untested.

**R6: Retrieval-based command-assistance literature (REV-07)**
- **Problem**: Related Work presents closed-set retrieval as an alternative to a generative mainstream. It omits the NLC2CMD TF-IDF retrieval entry and its learned confidence adjuster, ShellFusion's lexical-plus-semantic shell retrieval, DocPrompting's tldr retrieval, and CLAI.
- **Source**: R2 W1, R2 Q1; EIC W6 (Disagreement 2).
- **Requirement**: Add a short paragraph that locates these works. Restate the gap as "retrieval for shell commands exists and has reported ranking quality; its reliability has not been evaluated". Qualify §1's "dominant research trajectory … has been generative". Verify each citation.
- **Acceptance criteria**: §2 cites and positions the four named works, the gap statement is restated relative to them, and §1 acknowledges retrieval as a baseline in NLC2CMD.

**R7: Consistent "answerable" terminology (REV-09)**
- **Problem**: "Answerable" means the 121 queries in §3 and Limitations, but the 159 non-OOD queries in the Abstract, §6 and §9. The abstract's 67.3% includes the controls and OOD queries, while the next sentences say headline figures exclude controls.
- **Source**: EIC W7; DA m1.
- **Requirement**: Reserve "answerable" for the 121. Use "non-OOD" for 159 and 135. Label 67.3% as overall accuracy including controls and OOD, or replace it with the controls-excluded figure.
- **Acceptance criteria**: Every use of "answerable" refers to the 121-query set, and every headline percentage names its population.

**R8: Anonymity and baseline ownership (REV-11)**
- **Problem**: The system is named (§3 heading "TermAssist") and described as "a real, previously published npm package". "Our own baseline audit" and "the project's human director" imply that the authors built the baseline, but the paper never says so.
- **Source**: EIC W9, EIC Q1.
- **Requirement**: In the review version, anonymize the package name and remove pointers to where it is published. State in neutral third-person wording whether the baseline was developed by the authors.
- **Acceptance criteria**: The review build contains no searchable package name or publication pointer, and it states the authors' relationship to the audited baseline.

**R9: BashCoder-R1 description (REV-12)**
- **Problem**: §1 ("executiongrounded … trained by reinforcement learning") and §2 ("against execution feedback") describe BashCoder-R1's training signal. EIC W10 and R2 W6 both report, from the cited source, that its reward is static (syntax, shellcheck, format). They also report that its "FullRate" combines syntax, robustness and functional correctness.
- **Source**: EIC W10; R2 W6.
- **Requirement**: Check the cited paper and correct the description and the FullRate gloss. Align the reference title with the version of record. Re-check whether the sentence still supports "exact-match accuracy alone is an incomplete signal".
- **Acceptance criteria**: §1 and §2 describe BashCoder-R1's reward and metric as the version of record states them, and the reference title matches that version.

**R10: Quantify the OOD selection effect (REV-14)**
- **Problem**: The 35 added OOD queries were confirmed as OOD partly with top-1 BM25 ≤ 7.39 and dense similarity ≤ 0.31, which are the detector's features. The only Holm-significant detection result depends on them, and the size of the selection effect is unmeasured. §6 calls the original-subset gain "smaller", although in rate terms it is not (+33.3 vs +34.3 points; Disagreement 6).
- **Source**: R1 W1, R1 Q1; EIC W3, EIC Q3; DA m2.
- **Requirement**: Report how many OOD candidates were drafted, and how many were discarded or edited at the score-screening step, with their scores. If no such record exists, say so. Report per-fold tuned OOD thresholds next to the screening bounds. Report detection separately on the 15 unscreened items, on added items that would have passed without screening, and on the EIC Q3 subset (15 original plus 10 terminal-task). Restate §6's comparison in rates.
- **Acceptance criteria**: §3 or §6 reports the screening counts (or states they are unavailable), the per-fold thresholds, and separate detection results for the unscreened items, and the "smaller gain" sentence is stated in rates.

**R11: Interpretable calibration magnitudes (REV-15)**
- **Problem**: The headline 67–81% ECE reductions come from 10 equal-width bins on roughly 110–134 items, with 64–73% of confidences tied at the maximum. There is no debiased or equal-mass estimate, no noise floor, no no-skill reference, and no interval on the relative reductions. The population used for ECE and Brier is not stated.
- **Source**: R1 W2; DA M1 (Disagreement 7; Factual Check F4).
- **Requirement**: Report ECE under equal-mass binning and at least one debiased or sweep estimator. Report the expected ECE of a perfectly calibrated predictor at the same n (noise floor), and the ECE and Brier of a constant base-rate forecaster or a Brier reliability/resolution decomposition. Give bootstrap intervals for the relative reductions. Lead with the Brier score and its paired interval. State the evaluation population. An appendix table plus one main-text sentence is sufficient.
- **Acceptance criteria**: The manuscript reports these reference values and intervals next to each headline ECE reduction, and the headline wording matches whatever magnitude survives them.

**R12: System specification (REV-16)**
- **Problem**: §4 names five components but defines none of the following: BM25 and cosine normalisation and fusion with α, the α grid, the hybrid's fused-score confidence (the quantity being calibrated and used for AURC), margin and entropy over the top 10, the threshold-selection objective, and how detector features were chosen. Artifacts are withheld.
- **Source**: R1 W3, R1 Q2; DA M3 (the "absolute top-1 score" is ambiguous between BM25 and fused).
- **Requirement**: Add a compact specification in §4 or an appendix covering the fusion equation, normalisation, confidence mapping, tuning grids, selection objective, and whether feature choice was made inside CV. State which score the OOD detector thresholds.
- **Acceptance criteria**: A reader can re-implement fusion, confidence, both detectors and their tuning from the text alone, and the manuscript states whether feature selection was inside CV.

**R13: Ranking claim uncertainty (REV-26)**
- **Problem**: §9 cites "correctness AUROC" as evidence that the hybrid orders its own errors better. The correctness-AUROC comparison, which the paper itself says "isolates ranking", has only point estimates. v0.1 AUROCs are fold means over about 3 positives per fold.
- **Source**: R1 W12; DA M2.
- **Requirement**: Either report a paired bootstrap or DeLong interval for the correctness-AUROC difference, together with pooled AUROCs and CIs, or reword §9 so that the ranking claim rests only on the metrics that carry intervals (AURC, AUGRC).
- **Acceptance criteria**: Every ranking metric named in §9 either carries an interval or is removed from the claim.

**R14: NLC2CMD metric description (REV-32)**
- **Problem**: §2 describes the NLC2CMD metric only as "utility+flag-overlap … more tolerant … than exact match". R2 reports, from the cited competition report, that each prediction's confidence was factored into the score.
- **Source**: R2 W2.
- **Requirement**: Verify the description against the cited source and correct it. Say explicitly how ECE, AURC and AUGRC differ from a confidence-weighted task score. Consider citing CLAI.
- **Acceptance criteria**: §2's description of the NLC2CMD metric matches the source and includes a sentence contrasting it with the paper's reliability metrics.

**R15: Scope calibration claims to what was measured (REV-40)**
- **Problem**: "The number users see" (§6) and "It improves the confidence users see" (§9) extend a benchmark-fitted calibration to users. The calibrators are fitted and scored on a constructed query mix, and the gain already attenuates under the grouped split (77.2%→69.0% on v0.2).
- **Source**: R3 W1, R3 W3, R3 Q3; DA M4.
- **Requirement**: Reword these phrases to describe the metric property. Scope the calibration claims to the benchmark distribution. Add a Limitations bullet saying the queries are not drawn from real users. State what data a deployed calibrator would be fitted on.
- **Acceptance criteria**: No sentence in §6, §9 or §10 attributes a user benefit to calibration, the claims name the benchmark distribution, and Limitations covers the non-user query source.

**R16: Joint risk and correctness analysis (REV-42)**
- **Problem**: The paper is motivated by destructive commands and describes contribution (1) as "more consequentially" about miscalibration. Yet it never reports how many wrong answers are medium-, high- or critical-risk commands, or at what confidence they are given.
- **Source**: R3 W2, R3 Q2; DA m10.
- **Requirement**: Using the benchmark's risk field and the deterministic classifier applied to the returned commands, report a small table crossing correctness, the risk level of the returned command, and the confidence band, for the baseline and the hybrid. If the classifier cannot tag returned commands, say so and scope the motivation accordingly.
- **Acceptance criteria**: The manuscript reports the correctness × risk × confidence cross-tabulation for both systems, or explicitly states why it cannot be computed and narrows the destructive-command motivation.

**R17: OOD result as an operating point (REV-49)**
- **Problem**: Both the baseline ("rejected below score < 2.0") and the tuned detector ("absolute top-1 score") threshold a retrieval score. An exact test on OOD-only counts favours any stricter threshold, and p = 0.000015 is consistent with 17–0 discordance. The paper reports no baseline OOD AUROC, no baseline non-OOD false-rejection count, and no comparison at a matched false-rejection rate.
- **Source**: DA M3. This is DA-only; the missing values were verified as absent (Factual Check F10).
- **Requirement**: Either report the baseline score's OOD AUROC, the baseline's non-OOD false rejections, and rejection at a matched false-rejection rate (or a threshold sweep), or reword the OOD result in §6, §9 and §10 as an operating-point change.
- **Acceptance criteria**: The OOD result is compared at a matched false-rejection rate with the baseline's AUROC reported, or it is explicitly described as an operating-point change everywhere it is stated.

---

## Suggested Revisions (Should Fix / Consider)

Same immutable source order, filtered to `should_fix` and `consider`. `S<n>` is a transport reference, not a rank. Minor-issue bundles are editorial-channel items, so they carry no severity, anchor or confidence (`—`).

| Transport ref | Revision Item | Sub-Claim(s) | Severity | Evidence Anchor | Confidence | Source Reviewer | Obligation class | Cost scope | Bounded consequence |
|---|---|---|---|---|---|---|---|---|---|
| S1 | REV-05: Say plainly that recalibrating a heuristic score is expected to help; argue what is not obvious | SC-7 | minor | `text: §3 "Confidence = min(round(score/8 × 100), 100), rejected below score < 2.0"` | 4 | EIC W5 | should_fix | sentence: §6, §9 | interpretive_ambiguity_remains → claim: calibration headline |
| S2 | REV-08: State that no generative baseline is run and the comparison with generation is conceptual (including the RQ's "without the cost or hallucination risk" clause) | SC-10 | minor | `absence: §2 Related Work — generative comparator; checked §1, §2, Limitations, References` | 3 | EIC W6; DA m11 | should_fix | sentence: §1 RQ | claim_scope_unsupported → claim: §1 RQ comparative clause |
| S3 | REV-10: Move one compact figure (reliability diagram or risk-coverage) into the main text; replace Table 4 with one sentence | SC-12 | minor | `text: §6 "(Table 4, Appendix A; controls included)"` | 4 | EIC W8 | should_fix | section: §6 | reader_traceability_reduced → figure: Fig. 2 or 4 |
| S4 | REV-13: EIC minor issues: hyphenation artefacts; "real in size" → "consistent in size" (§9); Zadrozny and Elkan order; cut or qualify Wang et al. (2026) (also DA Observation 4); transpose Table 3; one CI set in the Table 2 caption; merge Limitations bullets | — | — (editorial) | — | — | EIC Minor Issues | consider | sentence: various | editorial_conformance_unmet → manuscript |
| S5 | REV-17: Provide an anonymized artifact link for review | SC-20 | major | `absence: §4 and §5 (as R12)` | 4 | R1 W3 | consider | section: Ethical Considerations | method_reproducibility_unresolved → dataset: code/benchmark |
| S6 | REV-18: Use one interval method dual to the test; add a mid-p or unconditional sensitivity check; state that the v0.2 verdict depends on the method | SC-21 | minor | `table: Table 2 — v0.2 Acc., hybrid vs. BM25 raw p 0.0703 alongside caption bootstrap 95% CI [0.6, 7.5]pp` | 5 | R1 W4 | should_fix | re_analysis: §6, Table 2 | interpretive_ambiguity_remains → table: Table 2 |
| S7 | REV-19: Headline the pre-named calibration comparison, or label the baseline figure as secondary and uncorrected | SC-22 | minor | `text: §6 "this is the family's pre-named calibration comparison and the only one that survives Holm correction on both benchmark versions"` | 4 | R1 W5 | should_fix | sentence: Abstract, §9 | claim_scope_unsupported → claim: 79% headline |
| S8 | REV-20: Report the bootstrap p as a bound, carry "≤" into Holm, and state each test's sidedness | SC-23 | minor | `table: Table 2 — rows "Calib. ECE reduction" raw 0.0001, Holm 0.0004 and 0.0003` | 5 | R1 W6 | should_fix | sentence: Table 2 | reporting_requirement_unmet → table: Table 2 |
| S9 | REV-21: Soften "confirmed" to "agreed on all 8"; give the exact interval; say how many of the 8 were terminal-task OOD | SC-24 | minor | `text: §8 "All sampled OOD labels, on which the OOD-rejection result rests, were confirmed"` | 4 | R1 W7, R1 Q4 | should_fix | sentence: §8, Limitations | claim_scope_unsupported → claim: OOD label support |
| S10 | REV-22: Complete the OOD partition (the 6 unreported queries) | SC-25 | minor | `text: §6 "the detector rejects 25 of 34 everyday non-computing requests (baseline 14; AUROC 0.94) but only 4 of the 10 terminal tasks"` | 5 | R1 W8; DA m4 | should_fix | sentence: §6 | reporting_requirement_unmet → claim: "mostly from requests that are not computing tasks" |
| S11 | REV-23: Repeat CV over 10–20 partition seeds; report the spread of the accuracy delta, discordant counts, ECE and AURC | SC-26 | minor | `text: §5 "nested 5-fold crossvalidation (seed 42, stratified by classification)"` | 4 | R1 W9, R1 Q3; DA m12 | should_fix | re_analysis: §6, appendix (NEW ANALYSIS) | evidence_gap_remains → claim: "79% on both versions" |
| S12 | REV-24: Describe the inner CV procedure exactly, or drop "nested"; say how the isotonic training scores are produced | SC-27 | minor | `text: §5 "the parameter is chosen using only the other four folds, then applied once to the held-out fold"` | 4 | R1 W10 | should_fix | sentence: §5 | method_reproducibility_unresolved → section: §5 |
| S13 | REV-25: Minimum-detectable-effect calculation and a prospective sample-size target | SC-28 | minor | `text: §3 "added because v0.1's OOD (15) and ambiguous (14) subsets were too small for adequately powered tests"` | 4 | R1 W11 | consider | re_analysis: §9 or §10 | evidence_gap_remains → section: Future Work |
| S14 | REV-27: Rephrase "validates benchmark quality" | SC-30 | minor | `text: §7 "Gold commands: 100% functional success (validates benchmark quality)."` | 5 | R1 W13; DA m8 | should_fix | sentence: §7 | claim_scope_unsupported → claim: §7 functional evaluation |
| S15 | REV-28: State the inclusion rule for the 125 safety-scored gold commands | SC-31 | minor | `text: §7 "89.6% exact four-level accuracy (112/125)"` | 3 | R1 W14, R1 Q4 | should_fix | sentence: §7 | reader_traceability_reduced → claim: safety accuracy |
| S16 | REV-29: Report paired differences between calibrators (Brier or debiased ECE), or soften "does not depend on isotonic regression" | SC-32 | minor | `text: §6 "reduce ECE by similar amounts, with overlapping bootstrap intervals"` | 5 | R1 W15 | should_fix | re_analysis: §6, §9 (NEW ANALYSIS) | claim_scope_unsupported → claim: §9 calibrator-independence |
| S17 | REV-30: Re-fit calibrators inside the bootstrap, or combine with S11 | SC-33 | minor | `text: §5 "resampling over pooled held-out predictions"` | 4 | R1 W16 | consider | re_analysis: §5 (NEW ANALYSIS) | evidence_gap_remains → claim: ECE-reduction CI |
| S18 | REV-31: R1 minor issues: write the bootstrap p as a bound consistently; clarify Table 3's "v0.1/v0.2 answerable" row; Table 3 layout; κ to two decimals; plot Figure 4's expected curve with a band | — | — (editorial) | — | — | R1 Minor Issues | consider | sentence: Abstract, Tables 2–3, Fig. 4 | editorial_conformance_unmet → manuscript |
| S19 | REV-33: Add 2–3 sentences on tool/API retrieval, fusion functions (DPR, RRF, Bruch et al.) and ranker/semantic-parser calibration | SC-36 | minor | `absence: §2 and §4 — expected positioning against tool/API retrieval, hybrid fusion-function analysis, ranker/semantic-parser calibration; checked §2, §4, §9, Limitations, reference list` | 4 | R2 W3 | should_fix | section: §2, §4 | evidence_gap_remains → section: §2 |
| S20 | REV-34: Add one stronger offline encoder (and optionally RRF) as a sensitivity row, or scope the hybrid claims to all-MiniLM-L6-v2 | SC-37 | minor | `text: §4 "local dense retrieval (Xenova/all-MiniLM-L6-v2, a 384dimensional MiniLM sentence encoder"` | 4 | R2 W4, R2 Q2 | should_fix | re_analysis: §6 (NEW ANALYSIS; or sentence on the scoping route) | claim_scope_unsupported → claim: hybrid-over-BM25 and hybrid-over-dense |
| S21 | REV-35: Use "out-of-scope" (or define OOD as such); separate in-domain from general OOS; replace "closed-vocabulary" with "closed-set" | SC-38 | minor | `text: Abstract "post-hoc calibration and out-of-domain (OOD) rejection"` | 4 | R2 W5, R2 Q3 | should_fix | sentence: throughout | interpretive_ambiguity_remains → manuscript |
| S22 | REV-36: Frame the detectors as query performance prediction; optionally add one score-distribution predictor | SC-39 | minor | `text: §6 "AUROC is 0.867 for OOD detection (feature: absolute top-1 score) and 0.784 for ambiguity detection (feature: margin)"` | 3 | R2 W7, R2 Q3 | consider | sentence: §4 | evidence_gap_remains → section: §4 |
| S23 | REV-37: Explain why no public NL-to-shell benchmark or mapped subset is used; say which system's output the queries were "checked against" | SC-40 | minor | `absence: §3 Benchmark and Limitations — justification for not using a public benchmark; checked §2, §3, §10, Limitations` | 3 | R2 W9, R2 Q4; DA m9 | should_fix | sentence: §3, Limitations | interpretive_ambiguity_remains → section: §3 |
| S24 | REV-38: R2 minor issues: NL2SH author list per the ACL Anthology record; mark the 2026 preprints as not peer-reviewed; hyphenation artefacts | — | — (editorial) | — | — | R2 Minor Issues | should_fix | sentence: References | editorial_conformance_unmet → manuscript: References |
| S25 | REV-39: Report one or two operating points that include a cost of harm, and analyze A5's degradation on v0.2, with the baseline at matched coverage | SC-41 | major | `text: §9 "It improves the confidence users see, not the answers or their ranking."` | 4 | R3 W1; DA m7 | should_fix | re_analysis: §7, §9 (NEW ANALYSIS) | evidence_gap_remains → claim: contribution (3) decision-level analysis |
| S26 | REV-41: Replace the future "human-preference study" with a reliance- or task-outcome study | SC-43 | major | as S25 | 4 | R3 W1, R3 Q4 | consider | sentence: §10 Future Work (6) | interpretive_ambiguity_remains → section: §10 |
| S27 | REV-43: Name deployment safeguards (no auto-run, confirmation for high-risk commands, `-WhatIf`/`-Confirm`); consider a risk-dependent threshold | SC-45 | major | `text: §4 "A sixth, independent component, a rule-based safety classifier, targets command risk, which is orthogonal to retrieval correctness."` | 4 | R3 W2 | should_fix | sentence: §9 | interpretive_ambiguity_remains → section: §9 |
| S28 | REV-44: Report recall@3/5 on ambiguous and bare-keyword queries; frame ambiguity as a question of what to present | SC-47 | minor | `text: §1 "the task is to return the single best-matching command, or explicitly decline to answer"` | 3 | R3 W4 | consider | re_analysis: §6 (NEW ANALYSIS) | interpretive_ambiguity_remains → claim: "ambiguity detection is weak" |
| S29 | REV-45: Name the platform (Windows) in the abstract (title optional); optionally count platform-invalid returned commands | SC-49 | minor | `text: §3 Corpus "a few Windows-visible records are Linux commands (e.g., sudo reboot)"` | 4 | R3 W6 (EIC S1 disputes; Disagreement 4) | should_fix | sentence: Abstract | claim_scope_unsupported → claim: Title/Abstract "shell" |
| S30 | REV-46: Ethical Considerations: say what is being done for current users of the shipped package | SC-50 | minor | `text: §1 "The hybrid retriever we evaluate is a research prototype and is not part of the published package."` | 3 | R3 W7 | should_fix | sentence: Ethical Considerations | interpretive_ambiguity_remains → section: Ethical Considerations |
| S31 | REV-47: Give the positive case for the no-LLM constraint (privacy, determinism, air-gapped use, cost, latency) and what coverage is lost | SC-51 | minor | `text: §1 "without abandoning the no-LLM, fully-offline design constraint"` | 3 | R3 W8 | should_fix | sentence: §1 or §9 | interpretive_ambiguity_remains → claim: "Non-LLM" subtitle |
| S32 | REV-48: R3 minor issues: abstract column break; `git checkout -- .` typesetting in the safety example (F12); "No LLM" stated once | — | — (editorial) | — | — | R3 Minor Issues | should_fix | sentence: Abstract, §4, §7 | editorial_conformance_unmet → manuscript |
| S33 | REV-50: Explain why the same 15 original OOD queries give raw p = 0.25 (v0.1) and p = 0.0625 (v0.2 breakdown) | — (DA-only) | minor | `text: §6 "On v0.1 the same comparison was not significant even before correction (raw p = 0.25)."` | 3 | DA m3 | should_fix | sentence: §6 | interpretive_ambiguity_remains → claim: OOD result on the original 15 |
| S34 | REV-51: State that coverage below about 64% lies inside the maximum-confidence tie block | — (DA-only) | minor | `text: §5 "Confidence often ties at its maximum (64% of the hybrid's and 73% of the baseline's values on v0.1)"` | 4 | DA m5 | consider | sentence: §6 | interpretive_ambiguity_remains → claim: "8.3% at 50% coverage" |
| S35 | REV-52: Check AURC/AUGRC on the answerable-only subset | — (DA-only) | minor | `text: Limitations "v0.1's own ambiguous labels have not been re-annotated at all."` | 3 | DA m6 | consider | re_analysis: §6 (NEW ANALYSIS) | evidence_gap_remains → claim: ranking result |
| S36 | REV-53: Split the 49 confidently wrong predictions by label (OOD / ambiguous / answerable) | — (DA-only) | minor | `text: §3 "Mean confidence on the 49 wrong (non-rejected) predictions: 86.06%"` | 3 | DA m13 | consider | sentence: §3 | interpretive_ambiguity_remains → claim: motivating statistic |
| S37 | REV-54: Discuss the simpler alternatives in one or two sentences: unclipped BM25 or margin confidence; corpus-side paraphrase fields; closed-list reranking; intent classification with OOS framing | — (DA-only) | — (editorial) | — | — | DA Ignored Alternatives 3–6 | consider | sentence: §9 or Limitations | interpretive_ambiguity_remains → section: §9 |

---

# Part 2: Revision Roadmap

Machine-artifact note: the closed `revision-roadmap/1.0` core is **not emitted**, because no block manifest exists (see Protocol and Contract Status, item 3). The items below keep the schema's concepts (source refs, obligation class, typed cost, closed consequence, consensus level). `proposed_targets` are not given; `target_section` is the section locator in the Cost scope column.

**Totals**: 54 items. `must_fix` 17 (R1–R17); `should_fix` 25; `consider` 12 (S1–S37). Consensus levels among the Required items:
- SPLIT (arbitrated): REV-01, REV-06, REV-07.
- 2 of 4 corroborated: REV-03, REV-12, REV-14.
- SINGLE-VERIFIER: REV-49 (DA-only).
- Single-reviewer findings: the remaining 10 (REV-02, 04, 09, 11, 15, 16, 26, 32, 40, 42).

No item carries CONSENSUS-4, CONSENSUS-3 or DA-CRITICAL.

**Required items by kind of work** (for the 8-page budget):
- **Rewriting only** (11): R1 REV-01, R2 REV-02, R3 REV-03, R4 REV-04, R5 REV-06, R6 REV-07, R7 REV-09, R8 REV-11, R9 REV-12, R14 REV-32, R15 REV-40.
- **Specification writing, no new analysis** (1): R12 REV-16.
- **New analysis of existing outputs** (3): R10 REV-14, R11 REV-15, R16 REV-42.
- **Either new analysis or rewording, at the author's choice** (2): R13 REV-26, R17 REV-49.
- **Space sources named by reviewers**: REV-02 (consolidating parallel views), REV-04 (abstract cut), EIC's Limitations-merge minor issue (S4), and the Table 4-to-sentence change (S3).

**Unresolved disputes the author must respond to**: Disagreement 6 (size of the OOD selection effect) and Disagreement 7 (information content of the recalibrated shipped confidence). The panel did not resolve either.

### Source-Traceability Checklist

This list follows immutable source order. It is not a suggested work order. The author records `will_address`, `wont_address` or `not_on_point` later, in the separate author-adjudication sidecar.

- [ ] REV-01 / R1 — obligation `must_fix`: Reframe title, RQ, contributions and §10 opening (EIC W1; R2 W8)
- [ ] REV-02 / R2 — obligation `must_fix`: One reporting population; claims-status table; caveats once (EIC W2)
- [ ] REV-03 / R3 — obligation `must_fix`: Scope the OOD claim in Abstract and §10 (EIC W3; R1 W1)
- [ ] REV-04 / R4 — obligation `must_fix`: Abstract within venue limit (EIC W4)
- [ ] REV-05 / S1 — obligation `should_fix`: Argue the non-obvious part of the calibration result (EIC W5)
- [ ] REV-06 / R5 — obligation `must_fix`: Interaction-model paragraph (R3 W1, W5; EIC W5, Q4)
- [ ] REV-07 / R6 — obligation `must_fix`: Retrieval-based command-assistance paragraph; restate the gap (R2 W1; EIC W6)
- [ ] REV-08 / S2 — obligation `should_fix`: State that no generative baseline is run (EIC W6; DA m11)
- [ ] REV-09 / R7 — obligation `must_fix`: "Answerable" terminology; label 67.3% (EIC W7; DA m1)
- [ ] REV-10 / S3 — obligation `should_fix`: One main-text figure; Table 4 to one sentence (EIC W8)
- [ ] REV-11 / R8 — obligation `must_fix`: Anonymize the package; state baseline ownership (EIC W9, Q1)
- [ ] REV-12 / R9 — obligation `must_fix`: Correct the BashCoder-R1 description (EIC W10; R2 W6)
- [ ] REV-13 / S4 — obligation `consider`: EIC minor issues
- [ ] REV-14 / R10 — obligation `must_fix`: Quantify the OOD selection effect (R1 W1; EIC Q3; DA m2)
- [ ] REV-15 / R11 — obligation `must_fix`: Interpretable ECE magnitudes (R1 W2; DA M1)
- [ ] REV-16 / R12 — obligation `must_fix`: System specification (R1 W3; DA M3)
- [ ] REV-17 / S5 — obligation `consider`: Anonymized artifact link (R1 W3)
- [ ] REV-18 / S6 — obligation `should_fix`: Reconcile the interval and the test (R1 W4)
- [ ] REV-19 / S7 — obligation `should_fix`: Headline the pre-named calibration comparison (R1 W5)
- [ ] REV-20 / S8 — obligation `should_fix`: Holm bounds and sidedness (R1 W6)
- [ ] REV-21 / S9 — obligation `should_fix`: Soften the 8/8 OOD-label claim (R1 W7)
- [ ] REV-22 / S10 — obligation `should_fix`: Complete the OOD partition (R1 W8; DA m4)
- [ ] REV-23 / S11 — obligation `should_fix`: Repeated CV partitions (R1 W9; DA m12)
- [ ] REV-24 / S12 — obligation `should_fix`: Describe the "nested" CV exactly (R1 W10)
- [ ] REV-25 / S13 — obligation `consider`: MDE and sample-size target (R1 W11)
- [ ] REV-26 / R13 — obligation `must_fix`: Correctness-AUROC interval, or reword (R1 W12; DA M2)
- [ ] REV-27 / S14 — obligation `should_fix`: "validates benchmark quality" (R1 W13; DA m8)
- [ ] REV-28 / S15 — obligation `should_fix`: Safety denominator rule (R1 W14)
- [ ] REV-29 / S16 — obligation `should_fix`: Paired calibrator differences (R1 W15)
- [ ] REV-30 / S17 — obligation `consider`: Re-fit calibrators in the bootstrap (R1 W16)
- [ ] REV-31 / S18 — obligation `consider`: R1 minor issues
- [ ] REV-32 / R14 — obligation `must_fix`: Correct the NLC2CMD metric description (R2 W2)
- [ ] REV-33 / S19 — obligation `should_fix`: Tool/API retrieval, fusion and ranker-calibration citations (R2 W3)
- [ ] REV-34 / S20 — obligation `should_fix`: Encoder sensitivity row, or scope the claims (R2 W4)
- [ ] REV-35 / S21 — obligation `should_fix`: OOS and closed-set terminology (R2 W5)
- [ ] REV-36 / S22 — obligation `consider`: QPP framing (R2 W7)
- [ ] REV-37 / S23 — obligation `should_fix`: Justify the benchmark choice; say which system checked the queries (R2 W9; DA m9)
- [ ] REV-38 / S24 — obligation `should_fix`: R2 minor issues
- [ ] REV-39 / S25 — obligation `should_fix`: Cost-of-harm operating points; A5 on v0.2 (R3 W1; DA m7)
- [ ] REV-40 / R15 — obligation `must_fix`: Scope the user- and distribution-facing calibration claims (R3 W1, W3; DA M4)
- [ ] REV-41 / S26 — obligation `consider`: Reliance study in future work (R3 W1)
- [ ] REV-42 / R16 — obligation `must_fix`: Joint risk × correctness × confidence table (R3 W2; DA m10)
- [ ] REV-43 / S27 — obligation `should_fix`: Deployment safeguards; risk-dependent threshold (R3 W2)
- [ ] REV-44 / S28 — obligation `consider`: Recall@k for ambiguous queries (R3 W4)
- [ ] REV-45 / S29 — obligation `should_fix`: Platform in the abstract (R3 W6)
- [ ] REV-46 / S30 — obligation `should_fix`: Users of the shipped package (R3 W7)
- [ ] REV-47 / S31 — obligation `should_fix`: No-LLM rationale (R3 W8)
- [ ] REV-48 / S32 — obligation `should_fix`: R3 minor issues
- [ ] REV-49 / R17 — obligation `must_fix`: OOD result as an operating point (DA M3)
- [ ] REV-50 / S33 — obligation `should_fix`: Two p-values for the same 15 OOD queries (DA m3)
- [ ] REV-51 / S34 — obligation `consider`: Tie-block note (DA m5)
- [ ] REV-52 / S35 — obligation `consider`: AURC on the answerable-only subset (DA m6)
- [ ] REV-53 / S36 — obligation `consider`: Break down the motivating statistic by label (DA m13)
- [ ] REV-54 / S37 — obligation `consider`: Discuss the simpler alternatives (DA Ignored Alternatives 3–6)

### Journal-Supplied Deadline (Optional Transport)

- **Exact deadline from source letter**: `NOT PROVIDED`
- No deadline, duration or work estimate is inferred.

### Response Letter Instructions

Please respond in the format of `templates/revision_response_template.md`, item by item.

**Must include**:
1. A response and revision description for each Required item, R1–R17, citing its REV id.
2. A response to each Suggested item, S1–S37: adopted, or the reason for not adopting it.
3. Answers to all 16 reviewer questions (EIC Q1–Q4, R1 Q1–Q4, R2 Q1–Q4, R3 Q1–Q4). Each question is mapped to a roadmap item above.
4. A response to the two unresolved disputes (Disagreements 6 and 7), and author verification of the external-source claims flagged in Factual Check F11.
5. Change markup (color or track changes) in the revised manuscript, and a table cross-referencing the new page, section and paragraph locations.

### Closing

We encourage you to consider the reviewers' comments carefully and to submit a substantially revised manuscript. The revised manuscript will undergo another round of review. The panel was unanimous that the work is careful, candid and suited in scale to a student research workshop. Most of the revision is reframing and scoping. The new analyses requested (REV-14, REV-15, REV-42, and optionally REV-26 and REV-49) use outputs you already have.

---

# Part 3: Reviewer Report Summary (Appendix)

The full reports are in this folder: `phase1_EIC.md`, `phase1_R1_methodology.md`, `phase1_R2_domain.md`, `phase1_R3_perspective.md`, `phase1_DA.md`. The panel configuration is in `phase0_field_analysis.md`.

### Journal-Fit Review Report Summary (EIC seat)
- Recommendation: Major Revision | Confidence: 4
- Key point: This is useful, student-sized work whose obstacles are framing and readability. The title and RQ centre an architecture whose own gain is the weakest claim, the abstract overstates the OOD result and is too long, and parallel views of every number bury the main point. All of this can be fixed by rewriting.

### Reviewer 1 (Methodology) Summary
- Recommendation: Major Revision | Confidence: 4
- Key point: The arithmetic is fully consistent and the exploratory framing is candid. However, the OOD headline rests on items screened with the detector's own features, the ECE magnitudes lack bias analysis and intervals, and the core system is unspecified (own D4: block, repairable).

### Reviewer 2 (Domain) Summary
- Recommendation: Major Revision | Confidence: 4
- Key point: The narrow novelty claim survives, but the gap argument omits the closest retrieval-based shell work (the NLC2CMD TF-IDF entry, ShellFusion) and misdescribes NLC2CMD's confidence-weighted metric and BashCoder-R1. Contract D2 was scored `warn`.

### Reviewer 3 (Perspective) Summary
- Recommendation: Major Revision (borderline Minor) | Confidence: 3
- Key point: The reliability framing never reaches the user. There is no interaction model or cost-of-harm operating point, and the destructive-command case the paper uses as motivation is never measured jointly with correctness. Both can be fixed with text and existing data.

### Devil's Advocate Summary
- Recommendation: N/A (findings only)
- Key challenge: "The paper's three 'reliability' results come from standard post-processing measured against a deliberately crude comparator" (DA Strongest Counter-Argument). No unresolved CRITICAL challenge: none was raised, and four MAJOR findings were adjudicated as REV-15, REV-26, REV-40 and REV-49.

## Attachment: Acronym Check (advisory, #849)

### Acronym check (advisory; no reply needed)
Coverage: body (partial)
Not in this input: English abstract, Chinese abstract.
Not checked:
- Body, line 6: NL2SH (the initials before its parentheses do not spell it)
- Body, line 6: OOD (the initials before its parentheses do not spell it)
- Body, line 11: BM25 (the initials before its parentheses do not spell it)
- Body, line 33: CV (the initials before its parentheses do not spell it)
- Body, line 41: AURC (the initials before its parentheses do not spell it)

| Scope | Line | Rule | Acronym | Uses |
|---|---|---|---|---|
| Body | 2 | Defined after first use | LLM | 9 |
| Body | 6 | Not defined | AI | 10 |
| Body | 6 | Defined after first use | AUGRC | 5 |
| Body | 18 | Not defined | BLEU | 1 |
| Body | 21 | Not defined | SQL | 2 |
| Body | 23 | Not defined | IDF | 1 |
| Body | 27 | Not defined | HIGH | 1 |
| Body | 27 | Not defined | LOW | 1 |
| Body | 27 | Not defined | MEDIUM | 1 |
| Body | 27 | Not defined | NEEDS | 2 |
| Body | 30 | Not defined | TA | 7 |
| Body | 33 | Not defined | MiniLM | 3 |
| Body | 36 | Not defined | nonOOD | 1 |
| Body | 37 | Defined again | ECE | 18 |
| Body | 189 | Defined again | ICLR | 2 |
| Body | 192 | Not defined | IJCNLP | 2 |
| Body | 198 | Not defined | AAAI | 2 |
| Body | 199 | Not defined | MIT | 1 |
| Body | 254 | Not defined | ACM | 3 |
| Body | 256 | Not defined | SIGKDD | 1 |
