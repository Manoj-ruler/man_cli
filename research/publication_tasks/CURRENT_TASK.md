# Current task

**Last completed:** E1-11 (2026-09-30).

- The guard passed in the same session: 0 mismatches out of 209.
- P1 and P2 are scored (4,500 and 1,000 rows).
- The decisions stage ran; its logical checks pass (0 failures), and the manifest is complete.
- The frozen code was unchanged before and after the run.
- **No rates have been read.**

**Author action still open:** PAPER-07, the mentorship submission, by Nov 6.

**Next (recommended): E1-12, the implementation checks.** Status: NOT STARTED. It waits for "Start
E1-12".

- **Priority:** P0. **Type:** verify.
- **Checks:**
  1. **Row counts:** scores, decisions and prepared data all have 4,500 / 1,000 rows, with ids in
     one-to-one correspondence.
  2. **No NaN or empty scores** in any field the rules use.
  3. **The shipped score agrees with a fresh, independent call** of the frozen `cli/search.js`
     `search()` on every query (s, confidence, command), and the decisions agree with a fresh
     application of §6.2.
  4. **A deterministic re-run** of the scoring and the decisions stage, into the scratchpad, is
     byte-identical apart from timestamps.
  5. **A spot-check of 20 random rows** (seed fixed in advance). For each, recompute s by hand from
     the BM25 formula and check the fused score's inputs. **This checks scoring correctness only**,
     never labels or outcomes.
- **Acceptance criteria:**
  - All checks pass, with the evidence logged.
  - Any failure sets the status to BLOCKED and opens a new issue; results are never corrected by
    hand.
- **Deliverable:** `e1/E1_IMPLEMENTATION_CHECKS.md`. This file is not in the frozen set.
- **Rates stay unread until E1-13.**
