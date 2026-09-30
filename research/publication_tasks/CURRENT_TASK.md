# Current task

**Last completed:** E1-02 (2026-09-30). E1 §1–§2 are approved:

- D4 = both CLINC test sets reported separately; P1 `test` is primary, P2 `oos_test` secondary.
- D7 = the thresholds are frozen from v0.2.

**Author action still open:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256
prefix `7c129b946bcd928b`) to the mentorship programme by Nov 6.

## Next: two P0 tasks are available; recommended order E1-04, then E1-03

### E1-04: verify the frozen v0.2 thresholds and how they were derived (recommended first)

- **Type:** verify. **Depends on:** none.
- **Files:**
  - `research/results/review_r1/review_r1_e_ood_operating_points.json`
    (`nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25`);
  - `research/results/v0.2/selective-prediction-results.json` (`ood_detection.per_fold`);
  - `research/results/v0.2/hybrid-nested-cv-results.json` (`selected_alpha_per_fold`);
  - `research/experiments/review_r1_e_ood_operating_points.js`.
- **Output:** `research/publication_tasks/e1/E1_THRESHOLDS.md`, and decision **D2** (how to apply
  five per-fold thresholds to external data).
  - **Recommended option:** apply all five, and report the median with the min–max.
- **Why first:** it is independent, and E1-07's analysis plan needs D2.

### E1-03: P1 class exclusions (intent names and example queries only; decision D3)

- **Type:** experiment (protocol). **Depends on:** E1-02 (done).
- **Output:** `E1_PROTOCOL.md` §3 and `e1/E1_EXCLUSIONS.md`.
- It includes cross-checking `domains.json` against the paper's supplementary list. **No scoring.**
