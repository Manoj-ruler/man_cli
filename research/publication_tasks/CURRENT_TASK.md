# Current task

**E1-08: the protocol review.** Status: **IN PROGRESS.**

- The review, `e1/E1_PROTOCOL_REVIEW.md`, is written. Checklist items 1–6 pass.
- **Decisions D11 (2026-09-30):** ISSUE-10 = (b), ISSUE-09 = (a), C-1 approved, E1-07c added. The
  protocol text is updated for all of them.
- E1-08 closes after E1-07c, with a re-check of items 5 and 7 and of the changed code.

**Author action still open:** PAPER-07, the mentorship submission, by Nov 6.

**Next (recommended): E1-07c, the review fixes to the analysis code, before the freeze.**
Status: NOT STARTED. It waits for "Start E1-07c".

- **Priority:** P0. **Type:** code.
- **Steps:**
  1. Derive the matched thresholds t_m for `s4` and `fused4` (m = 11), from v0.2's 159 in-scope
     queries only, and record them in protocol §6.4 with their v0.2 counts.
  2. Add R2m and R3m to `e1_analyze.js`:
     - re-derive the thresholds, and abort if they differ;
     - add the per-query decisions;
     - report the rates, R2m − R3m on P1 (cluster bootstrap) and on P2 (exact McNemar,
       unadjusted), labelled secondary.
  3. Reword the output strings to the §6.4 readings.
  4. Relabel the recomputed comparisons "sensitivity (descriptive)" (C-1).
  5. Re-run all synthetic tests, and add tests for the new parts.
- **Acceptance criteria:**
  - The thresholds come from v0.2's in-scope scores only.
  - All tests pass.
  - No CLINC input.
  - No other existing file changed.
