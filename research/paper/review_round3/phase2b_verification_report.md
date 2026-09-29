# Verification Review Report

Stage 3' re-review, Round 3 (scoped), Phase 2B (claim matching, letter revealed) and decision derivation. Protocol: `re_review_mode_protocol.md` § Phase 2B, § Decision Derivation, § New-Issue Attribution, § Judge Provenance, § Commitment Ledger Verification, § Re-Review Output Format.

`[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`

## Judge Record (#539)

- **Verification judge**: `claude-opus-5-5` (Anthropic), the session's own model. This call is the dedicated Phase 2B integration call (Journal-Fit Reviewer / `EIC` wire label, synthesizer function). No same-named Round-1 agent file was dispatched.
- **Contract status**: `[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`.
  - Four hard-required machine artifacts are absent: input manifest 1.1, `revision-roadmap/1.0` JSON core, `author-adjudication/1.0` sidecar and `revision-evidence-bundle/1.0`.
  - `scripts/check_re_review_synthesis.py` was **not run**, and this report claims **no checker result**. The decision below was derived by hand and is **NOT checker-verified**.
  - SHA-256 binding of every input stands in for manifest hash binding. It was recomputed in this call (table below).
- **Round-1 panel provenance**: unchanged from Round 2 (`review_round2/phase2b_verification_report.md`, Judge Record).
  - The strict carrier status is `carrier_absent`, so every Round-1 axis is `unknown` for machine purposes.
  - Artifact-level record: `research/paper/review_round1/panel_provenance.json`, `artifact_sha256` `c3905fe668a1d62e9d454585e95f1d5cc6775d06feda066a19e25b607dd3f7b6`. This call did not recompute that hash or replay it.
  - Six axes: `role_separated: true`, `fresh_context: true`, `blind_to_peer_outputs: true`, `model_family_distinct: false`, `provider_distinct: false`, `human_distinct: false`.
- **Blind cross-model pass**: `not_configured`. The run-level same-family disclosure applies, and every must_fix row carries `not_configured`.
- **Pre-committed criteria**: `precommitment_hash` `5e5facd7a3e264e2823e9c8d49ec0f660b83c2ba5d9af1884eb91117a5100423` (`review_round3/phase1_criteria_commitment.md`). It inherits by reference `review_round2/phase1_criteria_commitment.md` (`ea0119bc…1d9f41`).
- **Committed Phase 2A output**: `review_round3/phase2a_evidence_verdicts.md`, SHA-256 `fe2226ae43b445a255036c55185af7f65f3c0ac8c1cc8ec6142a9cfa0f3ed297`.
  - It is treated as immutable. Its verdicts and NewIssueRecords NEW-8 to NEW-12 are carried over below with nothing added, removed or edited.
- **Prompt/rubric surfaces**: `C:\Users\manoj\.claude\skills\academic-paper-reviewer\references\re_review_mode_protocol.md` (SHA-256 `5e0440c636704015cd84ce3ba8805d871de6427c9122cd8aa8c5e22bc71f1e66`, the same value as at Phase 1 and 2A). The sections used are: § Phase 2B (the relaxation boundary, the closed basis set and the critical-rebuttal check); § Decision Derivation (Steps 1–3, B1–B6 and `should_fix_addressed_rate`); § New-Issue Attribution; § Commitment Ledger Verification; and § Re-Review Output Format. Contract family `shared/contracts/re_review/` 1.1 is named but not instantiated.
- **Reviewer configuration**: `round1_cards_reused` (Cards #1–#4 frozen).
- **Routing**: this is the verbatim Round-2 line, as committed at Phase 1 §3: `[ROUTING-DEGRADED: unmapped labels — unparsed REV-01 "EIC W1, EIC Q2; R2 W8"; unparsed REV-02 "EIC W2; DA Observation 3"; unparsed REV-03 "EIC W3; R1 W1"; unparsed REV-04 "EIC W4"; unparsed REV-05 "EIC W5"; unparsed REV-06 "R3 W1, R3 W5, R3 Q1; EIC W5, EIC Q4"; unparsed REV-07 "R2 W1, R2 Q1; EIC W6"; unparsed REV-08 "EIC W6; DA m11"; unparsed REV-09 "EIC W7; DA m1"; unparsed REV-10 "EIC W8"; unparsed REV-11 "EIC W9, EIC Q1"; unparsed REV-12 "EIC W10; R2 W6"; unparsed REV-14 "R1 W1, R1 Q1; EIC W3, EIC Q3; DA m2"; unparsed REV-15 "R1 W2; DA M1"; unparsed REV-16 "R1 W3, R1 Q2; DA M3"; unparsed REV-18 "R1 W4"; unparsed REV-19 "R1 W5"; unparsed REV-20 "R1 W6"; unparsed REV-21 "R1 W7, R1 Q4"; unparsed REV-22 "R1 W8; DA m4"; unparsed REV-23 "R1 W9, R1 Q3; DA m12"; unparsed REV-24 "R1 W10"; unparsed REV-26 "R1 W12; DA M2"; unparsed REV-27 "R1 W13; DA m8"; unparsed REV-28 "R1 W14, R1 Q4"; unparsed REV-29 "R1 W15"; unparsed REV-32 "R2 W2"; unparsed REV-33 "R2 W3"; unparsed REV-34 "R2 W4, R2 Q2"; unparsed REV-35 "R2 W5, R2 Q3"; unparsed REV-37 "R2 W9, R2 Q4; DA m9"; unparsed REV-38 "R2 Minor Issues"; unparsed REV-39 "R3 W1; DA m7"; unparsed REV-40 "R3 W1, R3 W3, R3 Q3; DA M4"; unparsed REV-42 "R3 W2, R3 Q2; DA m10"; unparsed REV-43 "R3 W2"; unparsed REV-45 "R3 W6 (EIC S1 disputes; Disagreement 4)"; unparsed REV-46 "R3 W7"; unparsed REV-47 "R3 W8"; unparsed REV-48 "R3 Minor Issues"; unparsed REV-49 "DA M3"; unparsed REV-50 "DA m3"]`.
  - Personas were assigned by seat-prefix extraction (EIC→#1, R1→#2, R2→#3, R3→#4). DA-only items REV-49 and REV-50 route to EIC with the competence caveat.
- **Apply-report chain**: `apply_chain_witness: not_run_no_reports`. The only change artifact is the LaTeX content diff.
- **Evidence seen by the judge** (SHA-256 recomputed in this call):

| File (relative to `research/paper/` unless noted) | SHA-256 | Use in 2B |
|---|---|---|
| `review_round3/phase1_criteria_commitment.md` | `5e5facd7a3e264e2823e9c8d49ec0f660b83c2ba5d9af1884eb91117a5100423` | frozen yardstick and §9 decision rules; **matches** |
| `review_round3/phase2a_evidence_verdicts.md` | `fe2226ae43b445a255036c55185af7f65f3c0ac8c1cc8ec6142a9cfa0f3ed297` | frozen verdicts and NEW-8 to NEW-12; **matches** |
| `T21b_REVISION_LOG.md` (Response to Reviewers) | `25ab9953b4de667a2a10c55ccb3aeeeb7f060c34897890b977f1ed2278674569` | UNTRUSTED author persuasion; read in full |
| `review_round3/manuscript_revised.txt` (M2) | `5822a2e1792b15db41a7cb38a7b271f0e03e4cc2b5cc3775ec986761b2fea806` | claim re-checks (grep; Abstract, §6, §7, Limitations); same hash as at 2A |
| `review_round3/content_diff_672ee5f_to_ff36316.patch` | `21b849ad93dd1f32a44ccebfa039a70f3d1314bac898d30624c8b1d44fbcf016` | available; hash matches 2A; not needed |
| `acl_latex/content.tex` | `2be047ec3992a847012811fff9d0ca60c6b76c30a949729c4eb05071c5b42c72` | available; hash matches 2A |
| `acl_latex/main_review.tex` | `0b7e9e45f00ddcdebbb9a8938e37150904b1d1c88cc0ffe4540e72d48f1c471b` | available; hash matches 2A |
| `acl_latex/main_review.pdf` | `b740ade5d736b741fee8f9225a1e79227fc2682129ddccd0ca4e206bdd4b0a1a` | raw-byte search for the REV-12 DOI claim |
| `acl_latex/references.bib` | not hashed | grep only: BashCoder-R1 entry (REV-12 DOI claim) |
| `review_round2/phase2b_verification_report.md` | `c20923d8a7d08dfa8f8922d39bde68929a74f41ade94636fe86816982f7ef907` | expected shape; Round-2 ADJ-1 |
| `research/results/review_r1/review_r1_b_calibration.json` | `4fc64511860da869c7a45552c85dc23c16c01b96394e48f6ce7a515d9335fabc` | letter-cited; opened to check REV-15 claims (existence only) |
| `research/results/review_r1/review_r1_e_ood_operating_points.json` | `bf83cf08f0aaec06cb0a59b79f1ca06fbd323a73d10c8fb35177b82286c83ce0` | letter-cited; opened to check REV-14, REV-49 and NEW-9/10 claims (existence only) |
| `research/results/review_r1/review_r1_f_kappa_intervals.json` | `fef396c109df15e228da9ae27a70cca8a90d7b22ca9a3a75be7d00a3076c8ba1` | letter-cited; opened to check the REV-21/NEW-7 intervals (existence only) |

- **Deviations and scope of the file checks.**
  - The letter also cites `phase1_t3b_augrc.json`, `phase1_t4_calibration_comparators.json`, `review_r1_c_ranking.json`, `TERMASSIST_BENCH_DESIGN.md`, `run_selective_prediction.js`, `datasets/v0.2_ADJUDICATION_REPORT.md` and `PLAN_TASKS.md`. **None was opened.** Every item they relate to was already decided at 2A on manuscript evidence, and no adjustment depends on them.
  - A result file was used only to confirm that a number exists. It never upgraded a verdict.
  - No `git log` or `git show` was run.
- **Judging budget**: one Phase 2B integration call, about 150k input tokens read and about 15k output tokens. The Phase 1 and 2A budgets were not passed to this call.

This verification round ran on the same model family that drove the revisions; over-optimization to this judge's latent biases is possible (Ren et al. 2026, arXiv:2607.13104 §8.1.2).

**Single-family disclosure.** One model family, `claude-opus-5-5`, filled every role in this chain:
- all Round-1 seats;
- the revision driver for Rounds 2 and 3;
- the Round-2 verifier;
- the Round-3 Phase 1 and Phase 2A verifiers;
- this Phase 2B verifier.

Where the letter and this report agree, that is not independent confirmation.

## Decision

**Minor Revision**

- **Base rule B5.** It fires because:
  - three must_fix items are PARTIALLY_ADDRESSED with non-must_fix residuals: REV-02 (should_fix), REV-03 (consider) and REV-15 (should_fix);
  - there are three regression-attributed new issues of severity `minor` (NEW-8, NEW-9, NEW-10).
- `reject_recommended: false`. No Step-3 floor applies.
- `should_fix_addressed_rate` = 21/25 = **84%** (≥ 80%).
- **Adjustments this round: none** (zero ADJ records).
- The decision was derived by hand and is **NOT checker-verified** (see the Decision Rationale, G0).
- **Round status.** Round 3 is an **author-approved exception to the ARS 2-round cap**. The letter records the approval: "author-approved exception … 2026-09-29". Under the pipeline state machine, a Stage 3' Minor Revision exits to Stage 4.5 (final integrity). The decision itself does not require another re-review round.

## Phase 2B adjustment records (relaxation boundary)

**None.** Every final verdict equals its Phase 2A committed verdict. No `author_pointer_located_evidence`, `valid_rebuttal`, `scope_correction`, `user_accepted_fail_closed` or `cross_model_adjudication` record was booked. No critical-rebuttal proposal exists: no must_fix item is `critical`, and no rebuttal was offered.

Carried from Round 2 (not a Round-3 adjustment): **ADJ-1** (REV-38, `valid_rebuttal`, NL2SH author list). It remains in force through the REV-38 regression guard, which HOLDS at 2A. Its human spot-check is still pending.

**Letter claims examined and not admitted.** None of these changes a verdict. In each case the letter's pointer leads to evidence that 2A had already seen and weighed, or the claim has no locatable manuscript evidence. Re-weighing evidence that 2A already saw is not an admissible basis.

- **REV-02 (claimed RESOLVED; 2A PARTIALLY).**
  - The letter states that "The Table 3 caption states its all-queries population". That concedes the P2 failure: Table 3 uses a different population from Table 1.
  - It offers no argument that the frozen "one reporting population" clause is wrong for a risk table. The caption's own reason ("because a risky command can be returned for any of them") was in 2A's evidence and was weighed there. **Not a valid_rebuttal.**
  - The letter is silent on the second residual, the repeated "outside the corrected family" caveat (P3). Its REV-19 row claims that label "in the Abstract, §4, §5 and §6, and in the Holm caption". That is the very repetition 2A counted against REV-02 P3 (DN-2).
  - Even if the Table 3 part were rebutted, P3 would keep the item PARTIALLY. **No adjustment.**
- **REV-03 (claimed RESOLVED; 2A PARTIALLY, residual consider).**
  - The letter describes the Abstract and §7 together as stating "the false-rejection cost (20 vs 11 of 134, and 0 for the fixed rule)". §7 does not mention the fixed rule. It gives only "(20 vs. 11 of 134)". The pointer is partly inaccurate.
  - The letter does not claim, and the Abstract does not give, the fixed rule's count on the 15 original items (4 of 15). That is the 2A residual. **No adjustment.**
- **REV-15 (claimed RESOLVED; 2A PARTIALLY).**
  - The letter lists shipped-confidence equal-mass and sweep values, the hybrid's raw Brier skill and the hybrid's after-ECE against the floor. It lists no equal-mass or sweep value for the hybrid, and none for the raw shipped confidence.
  - `review_r1_b_calibration.json` does contain those quantities, under the keys `versions.<v>.hybrid_reliability.controls_excluded.{uncalibrated,isotonic}.{ece_equal_mass_10,ece_sweep}` and `…baseline_confidence.controls_excluded.uncalibrated.*`. That confirms only that the numbers exist. They are not in M2, so **no adjustment**.
- **REV-34 (claimed "RESOLVED (scoping)"; 2A PARTIALLY).** The pointer resolves to the §5 sentence "All hybrid results are for one small encoder (MiniLM) and one fusion rule." 2A credited it. The Abstract, Contribution (2), §6 and §7 hybrid claims remain unscoped: grep finds "MiniLM" only in §3/§4, §5, Table 4 and References. **No adjustment.**
- **REV-43 (claimed RESOLVED; 2A PARTIALLY, residual consider).** The pointer resolves to the §6 safeguards sentence, which 2A credited. "No automatic execution" is not named as a safeguard: grep finds "automatic" 0 times. **No adjustment.**
- **REV-10 (letter NOT ADDRESSED; 2A PARTIALLY).**
  - The letter under-claims. 2A's partial credit is for Split B, which is summarized in one main-text sentence with its table in the appendix. That credit is manuscript-side and stands.
  - A self-downgrade in the letter is not an admissible basis (no `scope_correction`: the letter does not show that 2A misidentified the target). The verdict stays PARTIALLY.
  - The decline reason ("figures include controls … there is space") is a feasibility reason, not a rebuttal.
- **REV-49 (claimed RESOLVED; 2A FULLY).**
  - The verdict is unchanged. Two letter statements do not match the manuscript:
    - The letter says "Contribution (3) and Limitations now say 'same tuning protocol and equal false-rejection counts'". Limitations actually reads "the equal-false-rejection comparison (whose thresholds are chosen in-sample)". The quoted phrase appears only in Contribution (3).
    - The letter calls "v0.2 37 vs 36 at 10–11 FR" an "equal-false-rejection" number. That repeats the mislabel that 2A froze as NEW-10.
- **REV-12 (claimed RESOLVED; 2A FULLY).**
  - The claim "DOI 10.1145/3832094 added" is present off the visible text surface. The string does not occur in the extraction, but it occurs 5 times in the raw bytes of `main_review.pdf`, which is consistent with a link annotation. `references.bib` carries `doi = {10.1145/3832094}`.
  - The claim of a table-of-contents check is letter-side and was not verified. The DN-3 subtitle question stays at the human checkpoint.
- **REV-11 (claimed RESOLVED; 2A FULLY).**
  - The verdict is unchanged. The letter's locations include `main.tex` and `main_review.tex`, which are source files. 2A judged the rendered PDF only.
  - The letter's provenance evidence for the relationship sentence (commit authorship, registry dates, two study-period `cli/` commits) is outside the manuscript and was not verified. The manuscript sentence is what satisfies P3.
- **REV-14 and REV-16 (claimed RESOLVED; 2A FULLY).** Consistent. Their off-surface pointers (`TERMASSIST_BENCH_DESIGN.md` line 65; `run_selective_prediction.js:55–68`) were not opened, and no verdict depends on them.
  - `review_r1_e` confirms that the by-source counts exist: v0.2 run 4/12/9 original and 13/34/25 added; v0.1 run 4/10/7.
- **REV-18, REV-23, REV-33, REV-39 (NOT ADDRESSED, contested).** These are deferrals, not rebuttals. The author explanations are recorded and do not count toward the rate.
- **NEW-1 (letter DELIBERATE_LIMITATION; 2A NOT_RESOLVED).** The letter describes the §4 and Limitations statements that 2A credited for route (B)(1)–(2). It does not supply (B)(3), the list of affected results and a no-bound statement. The record is decision-inert.

## Claim matching (every scoped item)

"Letter" is the author's claimed status. "Consistent?" compares the claim to the 2A committed verdict and to the manuscript. **Mismatches are flagged in bold.**

### must_fix — Required Revisions (12 scoped + 5 guard)

| Transport ref | Item | Author triage (letter) | Author's claim (letter) | Letter location | 2A verdict | Adj. | Response Status (final) | Verified? | Cross-model (#539) | Consistent? / Quality Assessment |
|---|---|---|---|---|---|---|---|---|---|---|
| R1 | REV-01 | RESOLVED | C3 recast without "disclosure of every null and fragile result" | §1 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent. |
| R2 | REV-02 | RESOLVED | Table 1 non-control throughout; Table 3 caption states all-queries population; fragility caveat only in Abstract, §5, Table 1 | Table 1; Table 3 caption; §5 | PARTIALLY_ADDRESSED (residual should_fix) | — | PARTIALLY_ADDRESSED | PARTIAL | not_configured | **Mismatch.** The letter concedes that Table 3 uses a different population and is silent on the repeated multiplicity caveat (§5 plus §6, with §4). Its REV-19 row claims that repetition as a feature. Table 1 and fragility-caveat claims are consistent. |
| R3 | REV-03 | RESOLVED (was MADE_WORSE) | Cost, kind qualifier, screening clause and unscreened 12 vs 9 at Abstract and §7 | Abstract; §7 | PARTIALLY_ADDRESSED (residual consider) | — | PARTIALLY_ADDRESSED | PARTIAL | not_configured | **Mismatch.** The fixed rule's 4/15 is absent at the Abstract. "0 for the fixed rule" is not in §7. The 12/9 counts are v0.2-run counts, unlabelled (NEW-9). MADE_WORSE is cleared. |
| R5 | REV-06 | RESOLVED | "Whether a better-calibrated number changes what users run is untested." | §6 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent. |
| R8 | REV-11 | RESOLVED (reversal of D7) | Review macros ("TOOL", "a publicly released package", "Q" IDs); relationship sentence | §1 ¶2; `main.tex`; `main_review.tex` | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent on the rendered PDF. The source-file locations are off-surface and would de-anonymize if uploaded (human checkpoint). |
| R9 | REV-12 | RESOLVED | Title "Bash Script Generation"; DOI added; TOC check | `references.bib` | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent. The DOI is present as a link target, not as visible text. The TOC check was not verified (DN-3). |
| R10 | REV-14 | RESOLVED | Split 12/15 vs 34/35 (fixed 4/13; detector 9/25); keyword-search definition; hybrid thresholds on a different scale | §3; §5 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent. The counts also exist in `review_r1_e`. |
| R11 | REV-15 | RESOLVED | Shipped equal-mass/sweep values and floors; hybrid raw Brier skill; hybrid after-ECE vs floor | §5 | PARTIALLY_ADDRESSED (residual should_fix) | — | PARTIALLY_ADDRESSED | PARTIAL | not_configured | **Mismatch.** No hybrid equal-mass or sweep value and no raw shipped value under those estimators appear in M2. They exist in `review_r1_b` but are not reported. |
| R12 | REV-16 | RESOLVED | Candidates are the observed dev-fold scores; ties go to the lowest | §4 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent. |
| R14 | REV-32 | RESOLVED | NLC2CMD contrast sentence | §2 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent. |
| R15 | REV-40 | RESOLVED | Deployed-calibrator data statement; §6 and §7 scoped | §5; §6; §7 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent. |
| R17 | REV-49 | RESOLVED | Equal-FR numbers (in-sample, descriptive); C3 and Limitations wording | §1 C3; §5; Table 1; Limitations | FULLY_ADDRESSED | — | FULLY_ADDRESSED | ✅ Yes | not_configured | **Partial mismatch; verdict unaffected.** Limitations does not carry the quoted wording. The letter calls 10 vs 11 "equal" (NEW-10). R1-competence note: the in-sample comparison has no interval. |
| R4 | REV-04 (guard) | — (196 words, `wc -w`) | — | Abstract | FULLY_ADDRESSED (HOLDS) | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Consistent (196 ≤ 200; 4 tokens of headroom). |
| R6 | REV-07 (guard) | — | — | — | FULLY_ADDRESSED (HOLDS) | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Letter silent. |
| R7 | REV-09 (guard) | — | — | — | FULLY_ADDRESSED (HOLDS) | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Letter silent. |
| R13 | REV-26 (guard) | — | — | — | FULLY_ADDRESSED (HOLDS) | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Letter silent. |
| R16 | REV-42 (guard) | — | — | — | FULLY_ADDRESSED (HOLDS) | — | FULLY_ADDRESSED | ✅ Yes | not_configured | Letter silent. |

**must_fix final tally (17)**: FULLY 14; PARTIALLY 3 (REV-02 → should_fix, REV-03 → consider, REV-15 → should_fix; none with a must_fix residual); NOT_ADDRESSED 0; MADE_WORSE 0; CANNOT_VERIFY 0. This is identical to Phase 2A.

### should_fix — Suggested Revisions (15 scoped + 10 guard)

| # | Item | Letter status | Letter location | 2A verdict | Adj. | Response Status (final) | Consistent? / Notes |
|---|---|---|---|---|---|---|---|
| S3 | REV-10 | NOT ADDRESSED | — | PARTIALLY_ADDRESSED (residual should_fix) | — | PARTIALLY_ADDRESSED | **Mismatch (letter under-claims).** The Split B part is met on the manuscript. The self-downgrade is not an adjustment basis. The decline reason is recorded. |
| S6 | REV-18 | NOT ADDRESSED (contested) | — | NOT_ADDRESSED | — | NOT_ADDRESSED | Consistent. The explanation does not count toward the rate. |
| S7 | REV-19 | RESOLVED | Abstract, §4, §5, §6, Holm caption | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Consistent. The multi-locus labelling feeds REV-02 P3 (DN-2). |
| S8 | REV-20 | RESOLVED | App. B; Table 1 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Consistent. |
| S9 | REV-21 | RESOLVED | §3 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Consistent. `review_r1_f` has Clopper–Pearson [0.6306, 1]. |
| S10 | REV-22 | RESOLVED | §5 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Consistent. The letter's label "non-terminal" is the manuscript's "everyday non-computing" (wording only). |
| S11 | REV-23 | NOT ADDRESSED (contested) | — | NOT_ADDRESSED | — | NOT_ADDRESSED | Consistent. The explanation does not count toward the rate. |
| S12 | REV-24 | RESOLVED | Abstract; §1 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Consistent. The new "tuned on held-out folds" wording is NEW-8, and the letter is silent on it. |
| S16 | REV-29 | RESOLVED (was MADE_WORSE) | §5 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Consistent. The `phase1_t4` claim ("worst Brier in all four cases") was not opened. |
| S19 | REV-33 | NOT ADDRESSED (contested) | — | NOT_ADDRESSED | — | NOT_ADDRESSED | Consistent. |
| S20 | REV-34 | RESOLVED (scoping) | §5 | PARTIALLY_ADDRESSED (residual should_fix) | — | PARTIALLY_ADDRESSED | **Mismatch.** Scoping is at §5 only. |
| S23 | REV-37 | RESOLVED | §3 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Consistent. |
| S25 | REV-39 | NOT ADDRESSED (contested) | — | NOT_ADDRESSED | — | NOT_ADDRESSED | Consistent. |
| S27 | REV-43 | RESOLVED | §6 | PARTIALLY_ADDRESSED (residual consider) | — | PARTIALLY_ADDRESSED | **Mismatch.** "No automatic execution" is not named. |
| S33 | REV-50 | RESOLVED | §5 | FULLY_ADDRESSED | — | FULLY_ADDRESSED | Consistent. |
| S1, S2, S14, S15, S21, S24, S29, S30, S31, S32 | REV-05, 08, 27, 28, 35, 38, 45, 46, 47, 48 (guard) | — (letter silent) | — | FULLY_ADDRESSED (all HOLD) | — | FULLY_ADDRESSED | REV-38 carries Round-2 ADJ-1 (spot-check pending). |

**should_fix final tally (25)**: FULLY 18; PARTIALLY 3 (REV-10 → should_fix, REV-34 → should_fix, REV-43 → consider); NOT_ADDRESSED 4 (REV-18, 23, 33, 39); MADE_WORSE 0; CANNOT_VERIFY 0.

**`should_fix_addressed_rate` (final verdicts)** = (18 + 3) / 25 = **21/25 = 84%**. This meets the 80% threshold, with a margin of one item. Round 2 was 76%.

**Letter's projected rate is internally inconsistent.** The letter projects "at most 4 of 25 items remain unaddressed … ≥ 21/25 = 84%". But its own table lists five NOT ADDRESSED items: REV-10, 18, 23, 33 and 39. By the letter's own statuses that is 20/25 = 80%. The binding 84% comes from 2A crediting REV-10 as PARTIALLY on manuscript evidence, not from the letter's arithmetic.

### consider — Nice to Fix (decision-inert; 2A = final)

| Verdict | Items |
|---|---|
| FULLY_ADDRESSED | REV-41, REV-51 |
| PARTIALLY_ADDRESSED | REV-13, REV-25, REV-31, REV-54 |
| NOT_ADDRESSED | REV-17, REV-30, REV-36, REV-44, REV-52, REV-53 |

`applied_criterion: not_precommitted`. The letter keeps the Round-2 contests ("The 13 items contested in round 2 remain contested"). No consider item enters any derivation step.

## New Issues

### Round-2 records NEW-1 to NEW-7 (status at Round 3; frozen at 2A)

| # | Frozen attribution / severity | Letter status | 2A status (final) | Consistent? |
|---|---|---|---|---|
| NEW-1 (→ REV-PM-1) | previously_missed / major | DELIBERATE_LIMITATION | NOT_RESOLVED | Consistent in substance: route (B)(1)–(2) met, (B)(3) missing. Decision-inert. |
| NEW-2 | regression / minor | RESOLVED | RESOLVED | Consistent. |
| NEW-3 | regression / minor | RESOLVED | RESOLVED | Consistent (`phase1_t3b` not opened). |
| NEW-4 | regression / minor | RESOLVED | RESOLVED | Consistent. |
| NEW-5 | regression / minor | RESOLVED | RESOLVED | Consistent. `review_r1_e` has controls-excluded pooled AUROC 0.9388/0.837 and 0.956/0.8887. |
| NEW-6 | regression / minor | RESOLVED | RESOLVED | Consistent. |
| NEW-7 | regression / minor | RESOLVED | RESOLVED | Consistent. `review_r1_f` has κ 0.6316, bootstrap [0.3913, 1]. |

Per Phase 1 §9 application rule 1, the six RESOLVED regression records drop out of Step 2. NEW-1 is decision-inert whatever its status.

### Round-3 records NEW-8 to NEW-12 (frozen at `[EVIDENCE-COMMITTED]`; carried without edit)

| # | Attribution | Severity | found_by | Location | Description (frozen, abridged; full text in 2A §6) |
|---|---|---|---|---|---|
| NEW-8 | regression | minor | R1 | Abstract (l. 016–017); §7 (l. 460–462) | The Abstract and Conclusion say that the shipped-score threshold was "tuned on held-out folds". §4 says the thresholds are chosen on the other four folds and applied once to the held-out fold. The headline phrase describes tuning on the evaluation data. |
| NEW-9 | regression | minor | EIC | Abstract (l. 023–024); §7 (l. 463–464); Table 1 v0.1 "4 / 10 / 7 of 15" | The same 15 original out-of-scope items get two unlabelled sets of counts: v0.2-run 12/9 at the Abstract and Conclusion vs v0.1-run 10/7 in Table 1. The v0.2-run thresholds were tuned on folds that contain the screened items. |
| NEW-10 | regression | minor | R1 | Table 1 row "at equal false rejections" v0.2 "37 / 36 at 10–11"; §5 (l. 348–349); §6 (l. 440–443) | The "equal false rejections" cell shows 10 vs 11, which is not equal. The Discussion generalises an in-sample feature comparison to "the hybrid detector". |
| NEW-11 | previously_missed | minor | EIC | Table 5 rows "OOD rej., tuned vs. base"; caption | The Holm-table label "tuned vs. base" names the hybrid detector, while "tuned threshold" elsewhere means the shipped-score threshold. |
| NEW-12 | previously_missed | minor | EIC | Figure 5 caption; absence in §4, Table 4, App. B | Ablation configurations A1 and A6 are plotted but never defined. |

**Tally.**
- regression: 3, all minor (B5-relevant; none major or critical).
- previously_missed: 2, minor (decision-inert under the goalpost guard).
- indeterminate: 0.
- Escalation exceptions: none.

The letter predates these records and is silent on all five. The letter's REV-49 row restates the NEW-10 mislabel.

## Commitment Ledger Verification (Kong A1)

**Not applicable (vacuous).**
- No Schema 11 row carries `commitment_extracted`.
- The letter states that "No commitment ledger or Material Passport entry is produced".
- No `COMMITMENT_GAP` or `EVIDENCE_TYPE_UNSPECIFIED` advisory is raised, and no commitment-axis field produced an adjustment.

## Decision Rationale

**Derivation status.** Manual derivation from the Phase 1 §9 rules. It is **NOT checker-verified**, and no checker result is claimed.

**Step 1 — gates (first match wins).**
- **G0 (manifest).** Under the current contract, G0 would fire `[RE-REVIEW-ABORT: manifest_incomplete]`: the manifest 1.1, roadmap JSON core, author-adjudication sidecar and evidence bundle are absent. As at Rounds 1–2, the dispatching layer proceeds as a manual three-gate run. The frozen Phase 1 and Phase 2A hashes and the M2 hash were recomputed and match the committed values.
- **G1 (silent drift).** 0 of 17 must_fix, 0 of 25 should_fix, 0 of 12 consider and 0 NEW-status rows differ from 2A. There are no adjustment records and no un-carried changes. **Pass.**
- **G2 (pending user input).** None of its conditions holds:
  - (a) no DissentRecords (DN-1 to DN-3 are informational notes that swap no criterion), so no dissent bound is tripped;
  - (b) no cross-model pass, so there are no `diverges` rows;
  - (c) no escalation exception;
  - (d) no `original_upheld` reapplication.

  **Pass.** No deferral.

**Step 2 — base decision (first match wins).**
- **B1.** Does not fire. There is no must_fix MADE_WORSE and no critical regression.
- **B2.** Does not fire. 0 of 17 must_fix items are in {NOT_ADDRESSED, MADE_WORSE}, which is 0% (the rule needs at least 9).
- **B3.** Does not fire. No must_fix item is in {NOT_ADDRESSED, MADE_WORSE, CANNOT_VERIFY}, and no regression new issue is `major`. The Round-2 B3 triggers are cleared: REV-11 is now FULLY and REV-03 is now PARTIALLY.
- **B4.** Does not fire. No must_fix or should_fix PARTIALLY item carries `residual_obligation_class: must_fix`. The partial items and their residuals are:
  - must_fix: REV-02 (should_fix), REV-03 (consider), REV-15 (should_fix);
  - should_fix: REV-10 (should_fix), REV-34 (should_fix), REV-43 (consider).

  The Round-2 B4 triggers (REV-14, REV-49) are now FULLY.
- **B5. Fires.** Two of its conditions hold:
  - (i) must_fix PARTIALLY with a should_fix or consider residual: REV-02, REV-03, REV-15;
  - (ii) regression-attributed new issues of severity minor: NEW-8, NEW-9, NEW-10.

  Its other conditions do not hold: the rate is 84% ≥ 80%, and there is no should_fix MADE_WORSE.

  **Base: Minor Revision**, `reject_recommended: false`.
- **B6 (Accept), informational.** It is blocked because not every must_fix item is FULLY (REV-02, 03, 15), and because three regression new issues are open.

**Step 3 — floors.** No escalation exception was approved, so no floor applies. **decision_state = Minor Revision.**

**Substance.** The round-2 blockers are closed on manuscript evidence:
- REV-11 is anonymized, and the relationship sentence has been added.
- REV-03's qualifiers are restored at both loci.
- REV-14 has its by-source split and screening definition.
- REV-49 now carries the operating-point framing, the equal-false-rejection points and the removal of "matched".

What remains is textual:
- one table population (REV-02, Table 3) and one repeated caveat;
- one missing count at the Abstract (REV-03);
- hybrid calibration estimators whose values already exist in a result file (REV-15);
- three wording or labelling regressions that this round introduced (NEW-8 to NEW-10).

**Pipeline consequence.**
- Stage 3' Minor → Stage 4.5 (final integrity check).
- The previously_missed records NEW-1, NEW-11 and NEW-12 travel to Stage 4.5 as sidecar cargo on the Minor route. They are not a REV-PM roadmap: that mapping applies on a Major Revision only.
- Residual Coaching (Major only) does not apply.
- Round 3 itself was an author-approved exception to the 2-round cap. Whether the residuals below are fixed before Stage 4.5, and whether any further re-review is run, is the author's decision. The derivation does not require another re-review.

## Residual Issues

### A. Decision-affecting (each must be closed for B6 Accept; checkable fixes)

Accept at a further re-review would need all six items below. It would also need the rate to stay ≥ 20/25, no should_fix item to regress, the 15 guard items to keep holding (including Abstract ≤ 200 tokens) and no new regression.

1. **REV-02 (must_fix, PARTIALLY → should_fix residual).**
   - (a) Make Table 3 use Table 1's non-control population, as counts over the 110/134 in-scope plus 15/50 out-of-scope queries. Alternatively, add a non-control column beside the all-queries counts and name the population in the caption.
   - (b) Delete the §5 sentence "These reductions were not in the corrected family." Keep §4's family definition and the §6 label that REV-19 requires.
   - Check: every main-text table caption names the same population, and the "corrected family" caveat appears once in the body outside §4's methods statement and the Abstract.
2. **REV-03 (must_fix, PARTIALLY → consider residual).**
   - Add the fixed rule's count on the 15 original items (4 of 15) to the Abstract's unscreened clause, for example "on the 15 original ones the fixed rule, threshold and detector reject 4, 12 and 9".
   - Check: the Abstract states all three rules' counts on the 15, and the Abstract stays ≤ 200 whitespace tokens (it is 196 now, so trim elsewhere if needed; REV-04 guard).
   - Coordinate with NEW-9 (which run the counts come from).
3. **REV-15 (must_fix, PARTIALLY → should_fix residual).**
   - Report the hybrid's ECE under equal-mass binning and the sweep estimator, before and after isotonic recalibration, on v0.1 and v0.2. Also report the raw shipped confidence under the same two estimators. An appendix table with a main-text pointer is enough.
   - The values exist in `research/results/review_r1/review_r1_b_calibration.json` under `versions.<v>.{hybrid_reliability,baseline_confidence}.controls_excluded.{uncalibrated,isotonic}.{ece_equal_mass_10,ece_sweep}`, with equal-mass noise floors under `noise_floor_perfectly_calibrated.equal_mass_10`. The author must trace and state them.
   - If any recalibrated hybrid equal-mass value exceeds its equal-mass noise-floor p95, the §5 "within/above the noise floor" wording must say which estimator it refers to (P4).
   - Check: every ECE reduction stated as a result has equal-mass and sweep numbers in M3.
4. **NEW-8 (regression, minor).**
   - Replace "tuned on held-out folds" at the Abstract (l. 017) and §7 (l. 461–462) with wording consistent with §4, for example "tuned by cross-validation" or "tuned on training folds and applied to the held-out fold".
   - Advisable: apply the same fix to §6's "recalibration on held-out labels".
   - Check: no locus says that tuning happened on held-out data.
5. **NEW-9 (regression, minor).**
   - Wherever counts on the 15 original items appear, name the run. Either say "in the v0.2 run, whose thresholds were tuned on folds including the 35 screened items", or use the v0.1-run counts (fixed 4, threshold 10, detector 7) at the Abstract and §7 consistently with Table 1.
   - Check: no rule has two unlabelled counts for the same 15 items anywhere in the paper.
6. **NEW-10 (regression, minor).**
   - (a) In Table 1's "at equal false rejections" row, report a v0.2 point at exactly equal counts, or relabel the cell "near-equal (10 vs. 11)". `review_r1_e_ood_operating_points.json` also contains exactly-equal v0.2 points at 0 FR (23 vs 21), 7 FR (33 vs 33) and 15 FR (43 vs 37).
   - (b) In §6, say "the hybrid's feature (in-sample thresholds)" instead of "the hybrid detector".
   - (c) Confirm the population. The result file counts these in-sample false rejections over 159 non-OOD queries, controls included. Table 1's caption says non-control (134). State that no control is rejected at these in-sample thresholds, or recompute on 134.
   - Check: every "equal false rejections" label sits on equal counts and names the in-sample feature.

### B. Non-decision-affecting residuals (should_fix / consider; the rate is already ≥ 80%)

- **REV-10.** Move one reliability diagram or risk-coverage figure into the main text. The body ends on p. 6 of 8. The regenerated figure should use the non-control population.
- **REV-34.** Name all-MiniLM-L6-v2 in, or in the paragraph of, the hybrid claims in the Abstract, Contribution (2), §6 and §7. Alternatively, add a stronger-encoder row.
- **REV-43.** Name "no automatic execution" (or "the command is only run after the user presses Enter") among the §6 safeguards.
- **REV-18, REV-23, REV-33, REV-39 (contested).** Either do the analyses or references, or keep them as acknowledged limitations. A limitation statement does not change their verdicts.
- **NEW-1 → REV-PM-1 material (consider).** Add route (B)(3): list the affected results (OOD rejection and AUROC for the hybrid feature, the Holm OOD rows, ambiguity F1/AUROC, A4/A5) and state that no bound is given.
- **NEW-11 (previously_missed).** Relabel the Holm row "OOD rej., hybrid detector vs. fixed rule".
- **NEW-12 (previously_missed).** Define A1 and A6, or drop them from Figure 5.
- **consider items** as listed above, including the REV-52 anchor disclosure.

### C. Human-checkpoint items (non-gating; no verdict depends on them)

1. **Anonymization of source files and the response letter.** The rendered review PDF is clean (2A). But:
   - `main.tex` defines the real tool name and "an npm package";
   - `main_review.tex` comments name the "TA-B" prefix and "author decision … reversing D3/D7";
   - `content.tex` comments name the revision log.

   Do not upload the LaTeX sources with the review submission. **The response letter `T21b_REVISION_LOG.md` itself de-anonymizes.** It names the tool, the registry, the author's handle and the package's creation date. It must not be shared with anonymous reviewers in its current form.
2. **Registry lookup risk (REV-11 advisory).** The §1 sentence "written and released by one of the authors", combined with §3's specifications (431 records, 279 Windows-visible, BM25 k1/b, the +15 bonus, the s/8 confidence map, refusal below 30%), could let a reviewer find the package. The venue's anonymity policy decides whether this is acceptable.
3. **REV-11 relationship sentence provenance.** The letter's evidence (commit authorship; two study-period `cli/` commits, one comment-only and one additive schema migration with 0 pre-existing fields changed) was not verified here. The author should confirm that "changed none of its executable code and none of the corpus fields it reads" is exact.
4. **NL2SH author line (Round-2 ADJ-1, still pending).** Spot-check the six-author list, which includes Miguel Tulla, against the published PDF. If the PDF does not list him, ADJ-1 should be reversed and REV-38 re-verdicted.
5. **BashCoder-R1 title clause (DN-3).** Resolve DOI 10.1145/3832094 and confirm that the version-of-record title includes "with Robustness-Aware Group Relative Policy Optimization". The letter's table-of-contents check is an unverified letter-side claim.
6. **REV-49 statistical adequacy (R1-competence note).** The equal-false-rejection comparison picks thresholds in-sample and carries no interval. It is labelled descriptive. A human or R1-competence reader should confirm that the Discussion's "did at least as well" claim is not leaned on beyond that label.
7. **Author decisions still open.** The 13 contested items (REV-18, 23, 33, 39 and consider items) and the REV-10 figure ("if the author wants it").

## post_letter_observations (decision-inert)

- **PLO-1 (status inflation).** The letter marks REV-02, REV-03, REV-15, REV-34 and REV-43 as RESOLVED where 2A found manuscript residuals. It marks REV-10 as NOT ADDRESSED where 2A credited part of it. A future letter should map each status to the pass condition, not to the edit made.
- **PLO-2 (projected rate).** The letter's "at most 4 of 25 unaddressed" contradicts its own table, which has 5 NOT ADDRESSED items. The binding rate (84%) rests on 2A's manuscript-side credit for REV-10.
- **PLO-3 (REV-03 pointer).** The combined "Abstract; §7" description attributes "0 for the fixed rule" to §7, which does not mention the fixed rule.
- **PLO-4 (REV-49 pointer).** The letter attributes "same tuning protocol and equal false-rejection counts" to Limitations. Limitations says "equal-false-rejection comparison (whose thresholds are chosen in-sample)". The phrase is in Contribution (3) only. The letter's "37 vs 36 at 10–11 FR" as an "equal-false-rejection number" is the NEW-10 defect.
- **PLO-5 (REV-02 vs REV-19 tension; DN-2).** The letter treats the multi-locus "corrected family" label as a REV-19 fix. REV-02 P3 counts the §5 instance as a repeat. The two are reconciled by keeping the Abstract and §6 labels (REV-19's loci) and §4's definition, and dropping §5's sentence.
- **PLO-6 (result-file population, NEW-10).** The equal-false-rejection block in `review_r1_e` (`in_sample_matched_false_rejection`) counts false rejections over 159 (v0.2) and 135 (v0.1) non-OOD queries, controls included. Table 1's caption declares a non-control population. The result file records `controls_rejected: 0` only for the three committed rules, not for the in-sample sweep thresholds. The file's own key and task text still use "matched" for these in-sample points. This is file-side wording only; the manuscript does not use it.
- **PLO-7 (REV-15 values exist but are unreported).** `review_r1_b` holds the hybrid equal-mass and sweep ECE values and the recalibrated hybrid Brier skill with intervals. The residual is a reporting gap, not a missing analysis.
- **PLO-8 (letter checks confirmed as far as opened).**
  - `review_r1_f` matches the manuscript's κ interval [0.39, 1.00] and the 8/8 interval [63, 100]%.
  - `review_r1_e` matches the by-source (4/12/9; 13/34/25), by-kind and false-rejection counts and the controls-excluded pooled AUROCs.
  - These confirm existence only. The verdicts rest on the manuscript.
- **PLO-9 (letter's "Own errors caught").** The letter records that five errors were caught before commit, including an out-of-scope AUROC that had included controls and a 204-word first abstract. The manuscript reflects the corrected values: pooled non-control AUROC 0.939/0.837 and 0.956/0.889, and a 196-token abstract.

## Sprint contract status

- `reviewer_re_review` is governed by `shared/contracts/re_review/{precommitment,verdict_record,traceability,input_manifest}.schema.json` together with `scripts/check_re_review_synthesis.py`.
- In this run the contract family could not be instantiated (`[CONTRACT-ARTIFACTS-ABSENT: manual three-gate run]`):
  - no machine traceability sidecar was emitted;
  - no schema lint ran;
  - the checker was not invoked.
- The three-gate discipline was followed by hand: criteria committed revision-blind (Phase 1, `5e5facd7…0423`), then evidence committed persuasion-blind (Phase 2A, `fe2226ae…f297`), then this letter-revealed pass, with every change typed and evidence-bound (none this round).
- The decision is **NOT checker-verified**.

[MATRIX-COMMITTED]
