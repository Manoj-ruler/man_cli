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

- [ ] **T14 🔵 Revise `content.tex`**
  - *Work:*
    - Headline numbers without controls; OOD by type with the false-rejection cost.
    - Corrected safety wording; tie-aware selective-prediction figures; calibration comparators.
    - Reword Split B as a "tuning-leakage check across intent groups".
    - Replace "in-use" with "published", and state that the hybrid is research-only. Add the new citations.
    - Citation placement: §6 of `research/paper/T6_LITERATURE_VERIFICATION.md`.
- [ ] **T15 🔵 Claim-to-result trace table**
  - *Work:* map every number in the paper to a result file and field (appendix or `research/paper/CLAIMS_TRACE.md`).
- [ ] **T16 🔵 Reproducibility**
  - *Work:* write a `run_all_v0_2.js` runner (or a documented script order), add an `engines` pin, and write down how to cache the embedding model offline. Then reproduce once from a clean clone and diff the outputs.
- [ ] **T17 🔵 Final build and read-through**
  - *Work:* rebuild both PDFs with the page guard and re-read every rendered page.
  - **Decision G3 (submit):** every MUST item in §10 of the roadmap is closed.

---

## Decisions only you can make

- [ ] **D1:** keep a descriptive safety result (with its misses reported), or remove safety from the paper?
- [ ] **D2:** build the near-OOD set (T13)?
- [ ] **D3:** anonymity — the review version names TermAssist, a public npm package under an identifiable scope.
- [ ] **D4:** confirm the target venue and deadlines (EACL 2026 SRW: Nov 6 mentorship, Dec 15 submission — re-verify).
- [ ] **D5:** found in T6: Traub et al. (NeurIPS 2024) argue AURC is flawed and propose AUGRC. Should I also report AUGRC next to AURC (computed from the same tie-aware curve), or cite them and justify AURC?

## Suggested order

T1–T5 and T6–T7 in parallel, now. T9 as soon as annotators agree. Then T10 → T11 → T12. T14–T17 once Phase 1–2 is done, folding in T12 if it's ready in time.
