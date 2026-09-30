# Current task

**Last completed:** E1-06 (2026-09-30). `research/experiments/e1_score_queries.js`:

- **Guard passed:** 0 mismatches out of 209 for `s4`, `confidence` and `fused4`, and the live lists
  were bit-identical to the v0.2 cache.
- **Edge cases:** a stop-word-only query can fire the replica's substring bonus. "the" gives a fused
  score of 1 while s = 0. E1-07 must pre-specify how such queries are handled.

**Author action still open:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256
prefix `7c129b946bcd928b`) to the mentorship programme by Nov 6.

**Next (recommended): E1-07, the analysis protocol, metrics and output specification.**
Status: NOT STARTED. It waits for "Start E1-07".

- **Priority:** P0. **Type:** experiment design, with no scoring.
- **Depends on:** E1-02, E1-03, E1-04 and E1-06 (all done).
- **Complete `E1_PROTOCOL.md` §6:**
  1. **Primary outcome:** the rejection rate per rule, with:
     - Wilson intervals;
     - for P1, a cluster bootstrap over intents (§2.2).
  2. **The D2 application:** the median of five thresholds, with the min–max range.
  3. **Secondary outcomes:**
     - paired exact McNemar between rules;
     - per-domain rates (descriptive);
     - comparison with the v0.2 rates (50, and the 15 unscreened).
  4. **R1-CLI, and the [2.0, 2.36) count.**
  5. **Subgroup-S sensitivity:** without S-clear, then without S-clear and S-borderline.
  6. **Ties at exact threshold values;** the no-token count; the zero-overlap count, and the rules
     compared on the overlap subset.
  7. **Expected-direction statements,** written before running.
  8. **Outputs** in `research/results/e1_clinc150_v1/`, with a `RUN_MANIFEST.json`.
  9. **The deviation policy.**
- **Acceptance criteria:**
  - Every metric is defined, with its denominators.
  - The output paths are new and versioned.
  - **The author approves the protocol.**
