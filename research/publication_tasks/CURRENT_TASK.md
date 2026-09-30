# Current task

**Last completed:** PAPER-03 (2026-09-30), the §2 novelty sentence aligned with the contributions, and
the literature search dated in the Limitations.

**Next (recommended): PAPER-08: give the abstract's "86%" its version.** Status: NOT STARTED. It
waits for the author to say "Start PAPER-08".

- **Priority:** P1. **Type:** paper. **Depends on:** VERIFY-02 and PAPER-02 (both done).
- **Why next:**
  - the abstract is the most-read text;
  - "wrong answers average 86% confidence" is true only for v0.1 (v0.2: 79.5%);
  - Contribution 1 already says "(v0.1)", so the abstract is now inconsistent with it.
- **Files:** `research/paper/acl_latex/content.tex`, the Abstract only (lines 10–24).

## Steps

1. Draft an abstract edit that adds the version to the 86% ("86% on v0.1"), or gives both values
   ("86% and 80%" or similar).
2. The abstract is **199/200 words**, so the edit needs a compensating trim elsewhere in the abstract
   that drops no claim. Show every changed phrase.
3. Optionally, if the author decides to handle ISSUE-03 here, make the "everyday" claim say the kind
   labels are AI-assigned, within the same word budget.
4. If the v0.2 value is quoted, register it in `trace_claims.js`, and keep the existing snippet
   "wrong answers average 86\% confidence" matching, or update that entry.
5. **Show the draft to the author; edit only after approval.**
6. Apply, then run the trace (0 problems) and the build, and count the abstract words.

## Acceptance criteria

- [ ] The abstract states which version the 86% refers to.
- [ ] Abstract ≤ **200** words (count recorded, using the same rule as before).
- [ ] Trace **0 problems**, including the coverage check. The build passes with the body ≤ 8 pages
      and 0 overfull boxes.
- [ ] Only the abstract, the rebuilt PDFs and any needed trace entry changed.
- [ ] The author has approved the text.

## Pending decision

ISSUE-03: handle it here, or in PAPER-05, or not at all.
