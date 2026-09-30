# Current task

**Last completed:** E1-07b (2026-09-30). `research/experiments/e1_analyze.js` implements protocol §6.
Its synthetic tests gave 61 passed, 0 failed; no CLINC input was used.

**Author action still open:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256
prefix `7c129b946bcd928b`) to the mentorship programme by Nov 6.

**Next (recommended): E1-08, a protocol review for leakage, selection bias and ambiguity.**
Status: NOT STARTED. It waits for "Start E1-08".

- **Priority:** P0. **Type:** verify. **Depends on:** E1-07 and E1-07b (done).
- **The checklist** (from `TASKS.md`):
  1. no threshold is tuned on E1 data;
  2. exclusions are class-level and were decided without scores;
  3. no outcome was viewed;
  4. the protocol states that CLINC150 is general-domain;
  5. multiple comparisons are handled, or the secondary outcomes are labelled descriptive;
  6. the denominators are right;
  7. no rule is favoured by construction.
- **Also:** check that `e1_score_queries.js` and `e1_analyze.js` implement the protocol as written,
  since both are frozen at E1-09.
- **Rules:** record every finding, and fix only protocol text. Ask the author about anything that
  affects validity.
- **Deliverable:** `e1/E1_PROTOCOL_REVIEW.md`.
