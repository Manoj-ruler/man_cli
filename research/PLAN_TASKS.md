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
- [ ] **T15 🔵 Claim-to-result trace table**
  - *Work:* map every number in the paper to a result file and field (appendix or `research/paper/CLAIMS_TRACE.md`).
- [x] **T16 ✅ Reproducibility (2026-09-28).** Guide: `research/REPRODUCE.md`. A fresh clone, fresh `npm ci` and fresh model download regenerate everything; 0 files DIFFERENT (38 identical, 40 timestamp/timing-only). Scripts: `run_all_v0_2.js`, `check_model_cache.js` (model SHA-256 pin), `compare_reproduction.js`. `.nvmrc` and engines pin Node 24. Exact reproduction needs Windows. Latency is single-machine and indicative only (the paper must say so; T14).
  - *Work:* write a `run_all_v0_2.js` runner (or a documented script order), add an `engines` pin, and write down how to cache the embedding model offline. Then reproduce once from a clean clone and diff the outputs.
- [ ] **T17 🔵 Final build and read-through**
  - *Work:* rebuild both PDFs with the page guard and re-read every rendered page.
  - **Decision G3 (submit):** every MUST item in §10 of the roadmap is closed.

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

## Suggested order

T1–T5 and T6–T7 in parallel, now. T9 as soon as annotators agree. Then T10 → T11 → T12. T14–T17 once Phase 1–2 is done, folding in T12 if it's ready in time.
