# T21b: revision round 3 (response to the T22 re-review)

| Field | Value |
|---|---|
| Paper | Confidently Wrong: Auditing and Recalibrating the Confidence of a Shipped Natural-Language-to-Shell Command Retriever |
| Round | 3 (an **author-approved exception** to the ARS 2-round cap, 2026-09-29: "anonymize the name and start round 3") |
| Previous decision | Major Revision, rule B3 (`review_round2/phase2b_verification_report.md`) |
| Target | EACL 2027 Student Research Workshop, long paper |
| Skill | ARS `academic-paper` v3.3.1, revision mode (tracking template statuses), invoked through the Skill tool |
| Abstract | 196 words by `wc -w` on the LaTeX source (limit 200) |

## Process and honest boundary

- **Patch protocol not used.** The #390 anchorize, patch and deterministic-apply tooling works on Markdown
  and cannot carry LaTeX, the same as in round 2. Edits were made directly in `content.tex` under git.
  Each row below gives its location.
- **No Schema 11 ledger.** No commitment ledger or Material Passport entry is produced. This log is a
  response table, not a verified pipeline artifact.
- **Numbers.** Every new number traces to a result file:
  - `research/results/review_r1/review_r1_b_calibration.json`
  - `review_r1_c_ranking.json`
  - `review_r1_e_ood_operating_points.json` (extended this round)
  - `review_r1_f_kappa_intervals.json` (new this round)
  - `research/results/phase1/phase1_t3b_augrc.json`
  - `phase1_t4_calibration_comparators.json`

  The two scripts changed this round carry reproduction guards: 20 checks in `e` and 4 in `f`. A full
  `run_review_r1.js` rerun reproduces all six JSONs byte for byte, apart from `generated_at`.
- **Checks run:**
  - Both PDFs build with 0 overfull boxes, 0 undefined references and 0 BibTeX warnings.
  - The body ends on page 6 of 8.
  - `check_acronyms.py`: the flagged items are the same proper names and method names as in round 2, plus
    "TOOL1", which is the anonymized name with its footnote marker.
  - 30/30 cite keys resolve.
  - The review PDF's text contains no "TermAssist", "manoj", "npm" or "TA-B", and its PDF metadata has an
    empty title and author.
- **Not done.** No re-review of this round has been run yet. The should_fix rate below is a projection, not
  a verdict.

## Author adjudication

| Decision | Choice |
|---|---|
| D7 reversal (REV-11) | Anonymize the tool in the review version; the camera-ready keeps the real name (author, 2026-09-29). `PLAN_TASKS.md` is updated. |
| Round-3 exception | Approved by the author; logged here and in `PLAN_TASKS.md` (T21b). |
| New analyses | Only extensions that the residuals themselves require: the source and kind splits, the controls-excluded block, and the κ intervals. No new method was added. The 13 items contested in round 2 remain contested. |

## must_fix residuals

| Item | Status | Resolution | Location |
|---|---|---|---|
| REV-03 (MADE_WORSE) | RESOLVED | The Abstract and §7 now state the false-rejection cost (20 vs 11 of 134, and 0 for the fixed rule), the kind qualifier ("most are everyday, not computing, requests"), the screening clause (35 added queries screened for low scores) and the unscreened result (12 vs 9 on the 15 original queries). | Abstract; §7 |
| REV-14 | RESOLVED | The tuned shipped threshold's v0.2 split by source is 12/15 original and 34/35 added (fixed rule 4 and 13; detector 9 and 25). "Keyword-verified" is replaced by a definition: the v0.1 queries were checked by keyword search over intents and descriptions, not scores (`TERMASSIST_BENCH_DESIGN.md`, line 65). §5 now states that the hybrid thresholds (0.884–0.925) are on a different scale from the 7.39 and 0.31 bounds. | §3 Benchmark; §5 Out-of-scope |
| REV-49 | RESOLVED | Added equal-false-rejection numbers, labeled in-sample and descriptive: v0.2 37 vs 36 at 10–11 FR and 23 vs 21 at 0 FR; v0.1 10 vs 7 at 6 FR and 5 vs 1 at 0 FR. They appear in §5 and as a Table 1 row. Contribution (3) and Limitations now say "same tuning protocol and equal false-rejection counts". | §1 C3; §5; Table 1; Limitations |
| REV-11 | RESOLVED (reversal of D7) | Wrapper macros set the name, host, footnote, author relation and item-ID prefix: review "TOOL", "a publicly released package", "Q145"; final "TermAssist", "an npm package", "TA-B145". A relationship sentence is added (details below). | §1 ¶2; `main.tex`; `main_review.tex` |

**Evidence for the REV-11 relationship sentence** ("written and released by one of the authors before this
study, which changed none of its executable code and none of the corpus fields it reads"):

- Every `cli/` commit is by Manoj-ruler.
- npm shows the package created 2026-04-19 (versions 1.0.0 and 1.0.1). The first `research/` commit is
  2026-08-13.
- Two study-period commits touch `cli/`:
  - 663d02d: a code-comment correction in `index.js`.
  - f9e7ca7: an additive schema migration of `commands.json`. Checked this round: 0 of the pre-existing
    fields in the 431 records changed against `master`.
- Master, the released code, is unchanged.

## Other must_fix items with PARTIAL residuals

| Item | Status | Resolution | Location |
|---|---|---|---|
| REV-01 (consider) | RESOLVED | Contribution (3) recast without "disclosure of every null and fragile result". | §1 |
| REV-02 | RESOLVED | Table 1 now uses non-control queries throughout: FR denominators 110/134; OOD AUROC recomputed without controls, pooled and labeled. Details below the table. | Table 1; Table 3 caption; §5 |
| REV-06 (consider) | RESOLVED | "Whether a better-calibrated number changes what users run is untested." | §6 |
| REV-12 (consider) | RESOLVED | Title changed to the version of record ("Bash **Script** Generation") and DOI 10.1145/3832094 added. Checked on 2026-09-29 against the ISSTA 2026 program page and the proceedings table of contents; the author list matches. | `references.bib` |
| REV-15 | RESOLVED | Values now reported: equal-mass 0.110 and 0.070 (floor p95 0.122 and 0.092); sweep 0.060 and 0.047; hybrid raw Brier skill −0.32 and −0.30; hybrid after-ECE 0.108 and 0.071 against floor p95 0.089 and 0.079. | §5 Recalibration |
| REV-16 | RESOLVED | Threshold candidates are the observed development-fold scores, with F1 ties going to the lowest; this matches `run_selective_prediction.js:55–68` and `review_r1_e` §4. | §4 Protocol |
| REV-32 | RESOLVED | Contrast sentence: the NLC2CMD metric folds confidence into one score and does not separate calibration, error ranking and out-of-scope rejection. | §2 |
| REV-40 | RESOLVED | A data statement for a deployed calibrator (fit on all labeled queries; transfer to real user queries untested). The §6 sentence and the §7 opening are scoped "on our benchmark". | §5; §6; §7 |

**REV-02 details:**

- No rule rejects a control. This was checked in `review_r1_e.controls_excluded`.
- The Holm p paired with a controls-excluded effect is removed; the hybrid ECE row now shows before → after
  plus the interval.
- The Table 3 caption states its all-queries population.
- The accuracy line and the tie shares in the text are labeled "all 150".
- The fragility caveat now appears in the Abstract, §5 and the Table 1 status column only. It was removed
  from C2, §6 and §7.

## should_fix residuals

| Item | Status | Resolution / reason | Location |
|---|---|---|---|
| REV-19 (NOT_ADDRESSED) | RESOLVED | The 79% is labeled "outside our corrected test family" in the Abstract, §4, §5 and §6, and in the Holm caption. | as listed |
| REV-29 (MADE_WORSE) | RESOLVED | "So the gain does not depend on the method" is removed. The text now says the differences were not tested and gives the ECEs (0.087/0.101 and 0.045/0.039). It restores the caveat that histogram binning is scored on its own bins and has the worst Brier score in all four cases (checked in `phase1_t4`). | §5 |
| REV-20 | RESOLVED | The Holm caption states two-sided exact McNemar for accuracy and OOD and a one-sided bootstrap bound for calibration. Table 1 no longer prints bootstrap p values as equalities. | App. B; Table 1 |
| REV-21 | RESOLVED | Exact interval for 8/8: [63, 100]% (Clopper–Pearson, `review_r1_f`). | §3 |
| REV-22 | RESOLVED | Per-kind counts for all three rules: non-terminal 14/34/25, far 3/4/4, nonsensical 0/1/1, terminal 0/7/4. | §5 |
| REV-24 | RESOLVED | "Nested" removed from the Abstract and C2. §4 already says there is no inner split. | Abstract; §1 |
| REV-34 | RESOLVED (scoping) | "All hybrid results are for one small encoder (MiniLM) and one fusion rule." No encoder sensitivity row was added; that remains contested. | §5 |
| REV-37 | RESOLVED | Every draft was run through BM25 and dense retrieval; 24 of 30 ambiguous drafts were kept and 6 rejected (`datasets/v0.2_ADJUDICATION_REPORT.md`). | §3 |
| REV-43 | RESOLVED | Names `-Confirm` and adds a stricter confidence requirement for high-risk commands as an unevaluated option. | §6 |
| REV-50 | RESOLVED | The two p values for the same 15 queries: neither is significant, and the second is not a replication. | §5 |
| REV-10 | NOT ADDRESSED | No main-text figure. The existing figures include controls, and regenerating one is new work; there is space (the body ends on page 6) if the author wants it. | — |
| REV-18, REV-23, REV-33, REV-39 | NOT ADDRESSED (contested) | New analyses or new references that need author approval (mid-p/unconditional test, seed-repeat CV, tool-retrieval literature, cost-of-harm operating points). | — |

**Projected should_fix rate** (not a verdict): at most 4 of 25 items remain unaddressed, which gives
≥ 21/25 = 84%. The next re-review decides the actual rate.

## New issues from T22

| Item | Status | Resolution | Location |
|---|---|---|---|
| NEW-1 (previously missed, major) | DELIBERATE_LIMITATION | Stated in §4 and Limitations. The leak "may flatter the detector's figures", and the tuned shipped threshold needs no feature choice. No sensitivity analysis was run: feature selection inside CV would be new work. | §4; Limitations |
| NEW-2 | RESOLVED | The Brier row's status is now "raw: no skill; recal.: robust". | Table 1 |
| NEW-3 | RESOLVED | AUGRC row added: −.048 [−.073, −.024] and −.030 [−.050, −.011] (`phase1_t3b`, controls excluded). | Table 1 |
| NEW-4 | RESOLVED | Now reads: two gold commands outside the corpus (145; 187 in v0.2 only), and one acceptable command (149); the accuracy effect is one query on v0.1 and two on v0.2. Limitations updated to match. | §3; Limitations |
| NEW-5 | RESOLVED | §5 says "pooled"; App. B explains that 0.867 and 0.901 are fold means with controls. | §5; App. B |
| NEW-6 | RESOLVED | "Queries need not leave the user's machine" and "a record from a fixed list that can be inspected" replace "no query leaves" and "vetted". | §1 |
| NEW-7 | RESOLVED | κ interval [0.39, 1.00] restored in §3 and Limitations. It is now traced to `review_r1_f`, a reproducible bootstrap; in round 1 it had no result file. | §3; Limitations |

## Own errors caught during this round (before commit)

| Error | Correction |
|---|---|
| The first draft of the REV-11 sentence said the tool "was not changed for" the study. Git shows two study-period commits to `cli/`. | Reworded to what was verified: no executable code changed and no field the tool reads changed. |
| Added "57.6% of the 125 non-control" as the shipped tool's accuracy. That figure (`review_r1_b`) counts rejected OOD queries as wrong, unlike the 67.3%. | Replaced with the non-control in-scope 65.5% (Table 2). |
| The recalibration AUROC example (0.858 → 0.804) included controls. | Replaced with the shipped confidence without controls: 0.742 → 0.686 (`phase1_t4`). |
| The first abstract draft was 204 words. | Trimmed to 196. |
| The out-of-scope AUROCs in Table 1 and §5 included controls as negatives. | Recomputed without controls: 0.939/0.837 and 0.956/0.889. |

## Next

A scoped re-review of the round-3 items, using ARS `academic-paper-reviewer` re-review mode against the T22
residual list. Then T15 (claim trace table), T17 (read-through) and T23 (mentorship draft, due Nov 6, 2026).

## Minor-revision fixes after the T22b re-review (2026-09-29)

**Context.** The T22b decision was Minor Revision, from rule B5, derived by hand:
`review_round3/phase2b_verification_report.md`. Under the protocol a Minor Revision goes straight to final
integrity with no further re-review round. The fixes below close that report's §A list of decision-affecting
residuals. They have not been re-verified by a reviewer.

| Item | Fix | Location |
|---|---|---|
| REV-02 | Table 3 now uses Table 1's non-control population (answered 121, 125, 167, 184). No control returns a high- or critical-risk command, so the other rows are unchanged. The counts come from `review_r1_d.controls_excluded`, which has a new guard confirming the wrong-and-risky counts are unchanged. The repeated §5 sentence "These reductions were not in the corrected family" is deleted. | Table 3; §5 |
| REV-03 | The Abstract gives all three rules' counts on the 15 original items: 4, 12 and 9. | Abstract (199 words) |
| REV-15 | Added the hybrid's equal-mass and sweep ECE after recalibration (0.108 and 0.058; 0.055 and 0.071). Added that before recalibration all three estimators agree, for both confidences (`review_r1_b`). | §5 Recalibration |
| NEW-8 | "Tuned on held-out folds" is now "tuned by cross-validation". | Abstract; §7 |
| NEW-9 | The 12/9 counts are labelled as coming from the v0.2 run, with the v0.1-run counts 4, 10 and 7 given alongside. | §5; §7 ("on v0.2") |
| NEW-10 | Only exactly equal false-rejection points are used now: v0.2 23/21 at 0, 33/33 at 7, 43/37 at 15; v0.1 5/1 at 0, 10/7 at 6. §6 now says "the hybrid's feature … (in-sample)". `review_r1_e` records that no control is among any of these false rejections. | Table 1; §5; §6 |
| NEW-11 | Holm-table rows relabelled "detector vs. fixed". | App. B |
| NEW-12 | A0–A6 defined. | App. B |
| NEW-1 (consider) | The Limitations bullet now lists the results that may be flattered and says there is no bound on the bias. | Limitations |
| REV-34 | MiniLM scoping added to C2, §6 and §7. The Abstract now says "BM25–MiniLM". | as listed |
| REV-43 | Names the existing safeguard: execution needs an explicit keypress and never happens on its own. | §6 |

**Not changed:**
- REV-10: still no main-text figure.
- REV-18, REV-23, REV-33 and REV-39 remain contested.

**Human-checkpoint items (for the author):**
- Submit only the review PDF. `main.tex` and this log name the tool.
- The registry-lookup risk from the §1 and §3 details remains.
- Spot-check the NL2SH author line (ADJ-1).
- Resolve BashCoder-R1's DOI to confirm the full title.

**Checks:**
- 0 overfull boxes, 0 undefined references and 0 BibTeX warnings; the body ends on page 6.
- The review PDF contains no identifying strings.
- `review_r1_d` passes 10 guards and `review_r1_e` 20.

**Correction to the round-3 REV-12 row.** DOI 10.1145/3832094, which I added in round 3, did not resolve when checked on 2026-09-29: doi.org returns 404 and Crossref has no record. It has been removed from `references.bib` until it is registered. The title, including "with Robustness-Aware …", matches both ISSTA pages.
