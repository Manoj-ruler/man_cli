# Current task

**Last completed:** E1-12 (2026-09-30). All implementation checks pass (17 of 17):

- row counts and ids;
- no NaN;
- fresh `search()` values bit-identical on all 5,500 queries;
- the decisions re-derived independently;
- a deterministic re-run;
- a 20-row spot check with an independent BM25 and fusion.

See `e1_run/E1_IMPLEMENTATION_CHECKS.md`. **No rates have been read yet.**

**Author action still open:** PAPER-07, the mentorship submission, by Nov 6.

**Next (recommended): E1-13, run the planned analysis.** Status: NOT STARTED. It waits for "Start
E1-13".

- **Priority:** P0. **Type:** experiment.
- **Steps:**
  1. Confirm the frozen set is unchanged (`git diff --exit-code e1-protocol-v1 -- …`).
  2. Run `node research/experiments/e1_analyze.js --scores-p1 … --scores-p2 … --meta-p1
     data/p1_queries.json --out-dir research/results/e1_clinc150_v1 --stage summary`. It first
     confirms that the stored decisions equal the recomputed ones.
  3. Write `DEVIATIONS.md`, which is currently empty: no deviation has occurred.
  4. **Report every protocol quantity with its denominator and interval.** This covers:
     - the primary comparison and its pre-stated reading;
     - the matched comparison;
     - the secondary and sensitivity results;
     - the v0.2 comparison.

     Anything not in the protocol is labelled "post hoc".
- **Acceptance criteria:**
  - `summary.json` and `summary.md` contain every protocol metric, with its denominator and
    interval.
  - The deviation log is present, even if empty.
- **Rule:** results are reported as computed. No re-analysis, re-thresholding or selective emphasis.
  The interpretation against the expected directions is E1-14.
