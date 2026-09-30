# Current task

**Last completed:** E1-07 (2026-09-30). Protocol §6 is approved, D10 = (a), and E1-07b was added
(ISSUE-08).

**Author action still open:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256
prefix `7c129b946bcd928b`) to the mentorship programme by Nov 6.

**Next (recommended): E1-07b, the analysis code, written and tested before the freeze.**
Status: NOT STARTED. It waits for "Start E1-07b".

- **Priority:** P1. **Type:** code. **Depends on:** E1-06 and E1-07 (done).
- **File:** a new script, `research/experiments/e1_analyze.js`. It implements protocol §6.2–§6.5
  and the logical checks in §6.8, reusing the `phase1_common.js` statistics.
- **Tests:** synthetic score files only, generated in the scratchpad with known answers. They cover:
  - hand-computable rates;
  - a threshold tie;
  - a query with no tokens;
  - a lexical-null query;
  - a degenerate bootstrap;
  - a broken nesting, which the logical checks must catch.
- **Acceptance criteria:**
  - Every §6 quantity has an output field with its numerator and denominator.
  - The synthetic tests match their known answers.
  - The logical checks fail on the broken case.
  - No existing file changed; **no CLINC input and no E1 output**.
- **Then:** E1-08 (the protocol review, which now also covers the analysis code) and E1-09 (the
  freeze and tag).
