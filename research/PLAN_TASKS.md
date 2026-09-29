# TermAssist — Task Tracker (from CURRENT_PUBLICATION_STATUS_AND_ROADMAP.md)

Created 2026-09-28. Tick a box only when its **Done when** is met and committed.
Annotator recruitment is handled by the author outside this list.

Legend: 🟢 can start now · 🟡 waiting on annotators · 🔵 waiting on another task · ⚪ optional

---

## Phase 1 — Correct the analysis (no humans) — DONE 2026-09-28

Results: `research/results/phase1/` (summary in `PHASE1_NOTES.md`); run with `node research/experiments/run_phase1.js`.

Every new script must first reproduce the current reported values and refuse to run if it can't.

- [x] **T1 ✅ Headline metrics without canonical controls**
  - *Work:* compute non-OOD accuracy and ECE with the 25 canonical queries excluded, for v0.1 and v0.2 and for BM25, dense and hybrid. Canonical results become a separate sanity-check row.
  - *Inputs:* `research/results/{ablation,v0.2}/ablation-results.json`, both calibration result files, both benchmarks.
  - *Done when:* the results file exists, and the accuracies match the audit's recomputation (v0.1 72/110, 73/110, 79/110; v0.2 95/134, 90/134, 101/134).
- [x] **T2 ✅ OOD breakdown and cost**
  - *Work:*
    - OOD rejection and AUROC by source: near-OOD TA-B078–092 vs. the non-terminal requests added in v0.2 (TA-B151–185).
    - A subtype label for each of the 50 OOD queries, marked as author-assigned.
    - The false-rejection rate on non-OOD queries (audit: 11/159).
    - An exact McNemar test on the near-OOD subset.
  - *Done when:* the table reproduces the audit's 34/50 vs. 17/50 overall, 9/15 vs. 4/15 near-OOD, and 25/35 vs. 13/35 non-terminal.
- [x] **T3 ✅ Tie-aware selective prediction and confidence intervals**
  - *Work:* compute risk-coverage with expected risk inside tied blocks, instead of benchmark-ID order. Add AURC and AUROC with 95% bootstrap intervals (10,000 resamples, seed 42) for both versions.
  - *Done when:* no reported selective-prediction number depends on the order of queries in the file.
- [x] **T4 ✅ Calibration comparators**
  - *Work:*
    - Fit Platt scaling and histogram binning next to isotonic, on the same nested folds.
    - Lead with the shipped baseline's confidence signal. Report ECE and Brier score, each with a bootstrap interval.
    - Report how many predictions share the top confidence value (the tie saturation).
  - *Done when:* the isotonic numbers reproduce the committed calibration results.
- [x] **T5 ✅ Safety recount**
  - *Work:* count dangerous-direction misses by the spec's definition (high or critical predicted as low **or medium**), for gold and retrieved commands on both versions. Add Wilson intervals and raw counts.
  - *Done when:* counts match the audit (v0.1 gold 1 miss; v0.2 gold 3 misses, 2 of them HIGH→LOW).

- [x] **T3b ✅ AUGRC next to AURC** (from D5) — `phase1_t3b_augrc.json`. Hybrid is better on AUGRC too: v0.1 −0.041 [−0.062, −0.021], v0.2 −0.027 [−0.045, −0.010].
  - *Work:* compute AUGRC from the same tie-aware risk-coverage curves as T3, with 95% bootstrap CIs (10,000 resamples, seed 42), for both versions, with and without controls.
  - *Done when:* the T3 AURC numbers are reproduced first, and the AUGRC results file exists.

## Phase 2 — Literature and document hygiene (no humans; parallel with Phase 1) — T6, T7 DONE 2026-09-28

- [x] **T6 ✅ Targeted literature search** — record: `research/paper/T6_LITERATURE_VERIFICATION.md`
  - *Work:* find and verify, against the primary source, citations for:
    - calibration (Guo et al. 2017; isotonic regression, Zadrozny & Elkan 2002);
    - selective classification (Geifman & El-Yaniv 2017);
    - baseline OOD detection (Hendrycks & Gimpel 2017);
    - selective QA under domain shift (Kamath et al. 2020);
    - calibration or abstention in command and tool retrieval (fresh search).
  - *Done when:* every BibTeX entry is checked against its source and the related-work matrix is updated.
- [x] **T7 ✅ Dated amendments** — `V1.0_BUILD_STATUS.md` Amendment A (11 gate rows corrected); spec Amendment 1 (line 8, §0, §4.3, §7.1, B-3)
  - *Work:*
    - `V1.0_BUILD_STATUS.md`: correct the C-2, D-3, D-4 and E-3 gates that are wrongly marked PASS, and replace F-1 "N/A".
    - Spec line 8: replace "independently-scaled benchmarks".
    - Spec §4.3: the retrieval-score gate for OOD queries is a selection effect, so demote it to a reported covariate.
  - *Done when:* no status line contradicts the audit, and no original text is deleted.
- [ ] **T8 🟢 Tag the frozen v0.2 benchmark**
  - *Work:* create a `v0.2-validated-benchmark` tag at commit `0110768`.
  - *Needs:* your approval before pushing the tag.

## Phase 3 — Two-annotator study (🟡 waiting on annotators)

- [ ] **T9 🟡 Practice round**
  - *Work:*
    1. Run `node research/experiments/build_practice_set.js`.
    2. Send each annotator the codebook, `corpus_view_win32.tsv`, `HOW_TO_RETURN.md` and the practice sheet.
    3. Score each return with `--score`.
    4. Answer rule questions through `CLARIFICATIONS.md`.
    5. Send `PRACTICE_FEEDBACK.md` to both annotators.
- [ ] **T10 🟡 Real sheets**
  - *Work:* send `annotator_N_sheet.csv`, save the returns as `returned/annotator_{1,2}.csv`, and run `validate_returned_sheet.js` on each.
- [ ] **T11 🟡 Adjudication and analysis**
  - *Work:* run `build_adjudication_sheet.js`, get the third reader's return and check it with `--validate`, then run `analyze_annotation.js --adjudication …`.
  - **Go/no-go G1:** κ ≥ 0.70 and ≥ 90% of OOD labels confirmed means the ambiguous labels can be used. Otherwise report the result as measured and drop ambiguity detection from the headline.

## Phase 4 — Corrected benchmark (🔵 after T11)

- [ ] **T12 🔵 Build v0.2.1**
  - *Work:*
    - Apply the adjudicated relabels.
    - Fix or drop TA-B187, TA-B145 and TA-B149.
    - Give v0.2.1 a new hash, a manifest and a changelog. v0.2 stays frozen.
    - Re-run the four-comparison family and T1–T5 on v0.2.1, reported next to v0.2.

## Phase 5 — Optional near-OOD set

- [ ] **T13 ⚪ 20–30 hand-written near-OOD terminal tasks**
  - *Rules:* no bulk AI generation, OOD judged by humans, and no score gate.
  - **Decision G2:** do this only if Phase 3 finishes by early November.

## Phase 6 — Paper and reproducibility (🔵 after T1–T6; include T12 if done)

- [ ] **T14 🟡 Revise `content.tex`**. **Round 1 applied 2026-09-28** with the ARS `academic-paper` revision workflow (roadmap and checks: `research/paper/T14_REVISION_ROADMAP.md`). Body ends on page 8. Still open: an external re-review (`academic-paper-reviewer`), then the κ and v0.2.1 results once T11/T12 are done.
  - *Work:*
    - Headline numbers without controls; OOD by type with the false-rejection cost.
    - Corrected safety wording; tie-aware selective-prediction figures; calibration comparators.
    - Reword Split B as a "tuning-leakage check across intent groups".
    - Replace "in-use" with "published", and state that the hybrid is research-only. Add the new citations.
    - Citation placement: §6 of `research/paper/T6_LITERATURE_VERIFICATION.md`.
- [x] **T15 ✅ Claim-to-result trace table (2026-09-29).** The checker is `research/experiments/trace_claims.js`; its generated output is `research/paper/CLAIMS_TRACE.md`.
  - Coverage: 405 numbers across 156 snippets of `content.tex`.
  - It checks that each snippet is still present and that each value rounds to what the paper shows.
  - **It found three errors in the paper, all corrected:**
    - the v0.2 shipped ECE reduction is 78.47%, so "78%", not "79% on both versions";
    - the shipped stopword list has 16 words, not 10. The "10" came from `FINAL_RESEARCH_REPORT.md`, which was never checked against `cli/search.js:9`;
    - removing the substring bonus changes one v0.2 answer (TA-B187, wrong either way), not zero.
  - *Work:* map every number in the paper to a result file and field (appendix or `research/paper/CLAIMS_TRACE.md`).
- [x] **T16 ✅ Reproducibility (2026-09-28).** Guide: `research/REPRODUCE.md`. A fresh clone, fresh `npm ci` and fresh model download regenerate everything; 0 files DIFFERENT (38 identical, 40 timestamp/timing-only). Scripts: `run_all_v0_2.js`, `check_model_cache.js` (model SHA-256 pin), `compare_reproduction.js`. `.nvmrc` and engines pin Node 24. Exact reproduction needs Windows. Latency is single-machine and indicative only (the paper must say so; T14).
  - *Work:* write a `run_all_v0_2.js` runner (or a documented script order), add an `engines` pin, and write down how to cache the embedding model offline. Then reproduce once from a clean clone and diff the outputs.
- [x] **T17 ✅ Read-through (2026-09-29)** of all 12 rendered pages of the review PDF, for the mentorship draft. Edits:
  - the abstract's out-of-scope antecedent;
  - "answers them correctly" for the controls;
  - McNemar comparator named;
  - "drops slightly" changed to "drops";
  - an intro sentence for Appendix A;
  - the bare-keyword range now says it includes the all-ambiguous subsets;
  - the abstract trimmed to under 200 words.

  A final read-through is still due before the Dec 15 submission, after T12.
  - *Work:* rebuild both PDFs with the page guard and re-read every rendered page.
  - **Decision G3 (submit):** every MUST item in §10 of the roadmap is closed.

## Phase 7 — Respond to review round 1 (added 2026-09-28)

**Source:** `research/paper/review_round1/phase2_editorial_decision.md`. Decision: Major Revision; 3 blocking issues, 17 required items, 37 suggested. Facts were checked in `review_round1/author_verification.md`. No item needs new data.

- [x] **T18 ✅ New analyses of existing data (2026-09-28)** — `research/results/review_r1/` (notes: `REVIEW_R1_NOTES.md`; runner `run_review_r1.js`; 53 reproduction checks; deterministic). **Key finding:** the OOD gain is a threshold choice. A nested tuned threshold on the baseline's raw BM25 rejects 46/50 vs the detector's 34/50 on v0.2 (p=0.004), and raw BM25 is the better OOD ranker (AUROC 0.96 vs 0.90). (Phase 1 style: scripts that first reproduce the committed numbers)
  - *Work:*
    - **REV-14.** Quantify the OOD selection effect:
      - candidates drafted, discarded and edited during screening (`v0.2_candidates.json`, adjudication records);
      - per-fold detector thresholds vs. the 7.39 / 0.31 screening bounds;
      - detection reported separately for the 15 keyword-verified and 35 score-screened queries, in rates.
    - **REV-15.** Make the calibration numbers interpretable:
      - equal-mass ECE plus a debiased or sweep ECE;
      - a noise floor for a perfectly calibrated forecaster at this n;
      - Brier skill against a no-skill reference, computed out of fold;
      - intervals on the relative reductions.
    - **REV-26.** A paired bootstrap interval for the correctness-AUROC difference.
    - **REV-42.** A table of correctness × the risk level of the returned command × confidence band, for both systems.
    - **REV-49.** OOD at matched operating points: baseline-score OOD AUROC, the baseline's false rejections, and a threshold sweep or matched-false-rejection comparison.
  - *Done when:* results are in `research/results/review_r1/` with notes, and two runs are deterministic.
- [x] **T19 ✅ Facts the paper needs from the code (2026-09-28)** — `research/paper/T19_IMPLEMENTATION_FACTS.md`
  - *Work:*
    - **REV-06.** What the published CLI shows the user: confidence, rejection message, whether commands are printed or run. Read from `cli/`.
    - **REV-16.** The exact fusion formula, score normalization, hybrid confidence, margin/entropy, α grid, threshold objective, and how detector features were chosen. Read from `research/experiments/`.
  - *Done when:* a short spec note cites the file and line for each fact.
- [x] **T20 ✅ Literature additions (2026-09-28)** — entries verified, matrix corrected; the novelty sentence itself is rewritten in T21 (T6 rules: verified against the primary source)
  - *Work:*
    - NLC2CMD: the TF-IDF retrieval entry with its learned confidence adjuster, and the confidence-weighted metric.
    - ShellFusion (ICSE 2022), DocPrompting (ICLR 2023), Project CLAI.
    - Correct the BashCoder-R1 description.
    - Fix our own `related-work-matrix.csv` NLC2CMD row, which wrongly says no team submitted a lexical-IR baseline.
  - *Done when:* entries are verified, the matrix is corrected, and the novelty sentence is rescoped.
- [x] **T21 ✅ T14 round 2 (2026-09-28)**. Log: `research/paper/T21_REVISION_LOG.md`. 16/17 required addressed (REV-11 declined per D3, contested); 23 suggested addressed, 13 contested (need approval), 1 declined. Body ends on page 5; abstract 172 words; all checks clean. (ARS `academic-paper` revision mode; after T18–T20 and decisions D6–D9)
  - *Work:*
    - All 17 required items: reframing, a single reporting population, a claims-status table, OOD scoping, abstract ≤ 200 words, the interaction model, related work, terminology, the specification, and scoped calibration claims.
    - Fix our own errors: the "smaller gain" sentence; the 6 OOD queries missing from the breakdown; explain the two p-values for the 15 original OOD queries.
    - Triage the 37 suggested items.
  - *Done when:* body ≤ 8 pages, all checks are clean, and a response-to-reviewers table is written.
- [x] **T22 ✅ Re-review (2026-09-28): Major Revision (rule B3), not checker-verified.** Report: `research/paper/review_round2/phase2b_verification_report.md`.
  - must_fix: 5 fully, 10 partly, REV-11 not addressed (author decline), REV-03 made worse.
  - should_fix addressed rate: 76% (below the 80% bar).
  - 7 new issues: 6 minor regressions, 1 previously-missed major.
  - The three-gate run was manual, because the contract's machine artifacts do not exist for a LaTeX source. (ARS `academic-paper-reviewer` re-review mode, against the round-1 roadmap)
- [x] **T21b ✅ Revision round 3 (2026-09-29)**, an **author-approved exception to the ARS 2-round cap**. Log: `research/paper/T21b_REVISION_LOG.md`.
  - Scope: the T22 residuals (REV-03, REV-14, REV-49 must_fix; REV-11 after the D7 reversal; should_fix residuals; NEW-2 to NEW-7).
  - New traced numbers: `review_r1_e` split by source and kind plus a controls-excluded block; `review_r1_f` κ intervals. Both are deterministic and guarded.
  - Next: a scoped re-review of the round-3 items (not yet run).
- [ ] **T23 🟡 Mentorship draft, due Nov 6, 2026. The package is prepared; submission is the author's.**
  - Guide: `research/paper/T23_MENTORSHIP_SUBMISSION.md` (what to upload, the pre-upload checklist, author checks).
  - Before submitting, the author verifies on the official call: the submission system, the mentorship format, and whether the checklist is required.
  - *Work:* T15 trace table, T17 read-through, then submit to the EACL 2027 SRW mentorship program. Annotation results appear as clearly marked pending text.

---

## Decisions only you can make

- [x] **D1 (decided 2026-09-28):** keep safety as a **short, descriptive, secondary** result.
  - Remove it from the abstract and the contributions list.
  - In the body, report the dangerous-direction misses under the spec definition (v0.1 1/20, v0.2 3/22) with Wilson CIs.
  - Name the one genuine miss (`git checkout -- .`) and the two label inconsistencies.
  - State that the labels are the benchmark's own, not an independent set.
  - No "safe" claim anywhere.
- [ ] **D2:** build the near-OOD set (T13)?
- [x] **D3 (decided 2026-09-28):** keep the name TermAssist in the review version. It is referred to in the third person, with no npm URL, package scope, repository link or author-identifying detail; those go in the camera-ready only. (Checked: `content.tex` currently has none.)
- [x] **D4 (decided 2026-09-28): EACL 2027 Student Research Workshop** (Athens, March 9–14, 2027). It was verified on the official call as the earliest open SRW. The previous label "EACL 2026" was wrong; these dates belong to EACL 2027.
  - Pre-submission mentorship deadline: **Nov 6, 2026**. Mentorship feedback: Dec 5, 2026.
  - Direct submission deadline: **Dec 15, 2026**.
  - Notification: Jan 5, 2027. Camera-ready: Jan 19, 2027.
  - Long paper: 8 pages of content (9 on acceptance) plus unlimited references. Anonymous review; non-anonymous preprints are allowed. Archival and non-archival options exist. The first author must be a student.
  - Fallback: NAACL 2027 SRW (mentorship Nov 16, 2026; submission Jan 11, 2027; double-blind).
  - Plan: send a mentorship draft by Nov 6 (T14 with annotation placeholders), then the final version by Dec 15 with T11/T12 results. That needs the annotation study finished by about the end of November.
- [x] **D5 (decided 2026-09-28):** report **AUGRC** (Traub et al., NeurIPS 2024) next to AURC, computed from the same tie-aware curves with bootstrap CIs, and cite both. This is added as T3b, before T14.

- [x] **D6 (decided 2026-09-28): contribution framing = audit and recalibration of the shipped confidence; the hybrid is one arm.** Lead with "auditing and recalibrating a shipped command retriever's confidence", with the hybrid as one arm of the study (REV-01)? The skill leaves the contribution claim to the author.
- [x] ~~**D7 (decided 2026-09-28): keep the TermAssist name** (D3 stands; REV-11 declined).~~ **Reversed 2026-09-29 by the author: anonymize the tool in the review version** ("anonymize the name and start round 3"). This supersedes D3 for the review version; the camera-ready keeps the real name. Implemented in T21b via wrapper macros (`\toolname`, `\toolhost`, `\toolnote`, `\authorrel`, `\qid`), plus a neutral authorship sentence (REV-11).
- [ ] **D8: page budget.** Move Split B, the sensitivity table and per-subset results to the appendix, as REV-02 proposes?
- [ ] **D9: triage mode.** Work through the 54 items with the ARS guided Socratic triage, or let Claude triage and bring back only the contested items?
- [ ] **D10: pending approvals.**
  - the v0.2.1 defect fixes (`research/datasets/v0.2.1_fixes.json`);
  - the T8 tag;
  - the handbook's coordinator questions C1–C10, before annotators receive it.

## Suggested order

Updated 2026-09-28.

| When | Work |
|---|---|
| Week of Sep 28 | Decisions D6–D10. T18, T19, T20 in parallel (no humans). |
| Oct 5–16 | T21 (T14 round 2), then T22 (re-review) and a possible short round 3. |
| Oct 19–Nov 4 | T15 trace table, T17 read-through, then T23 mentorship submission, due Nov 6. |
| In parallel, from now | Annotation T9 → T10 → T11; aim to finish by about Nov 25. |
| After T11 | T12 (v0.2.1 build and re-run), fold in κ and v0.2.1, a final re-review, T17, then submit by Dec 15. |
| Optional | T13 (near-OOD set) only if D2 = yes and Phase 3 ends by early November; otherwise skip and say so in Limitations. |
