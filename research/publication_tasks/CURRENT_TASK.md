# Current task

**Last completed:** TRACE-01 (2026-09-30). The claim trace now covers the Conclusion, Limitations and
Ethics, and has an automatic numeral-coverage check: 185 snippets, 498 numbers, 0 problems.

**Next (recommended): PAPER-03: novelty wording bounded by the literature search.** Status: NOT
STARTED. It waits for the author to say "Start PAPER-03".

- **Priority:** P0: it removes an overclaim risk. **Type:** paper. **Depends on:** PAPER-02 (done).
- **Files:**
  - `research/paper/acl_latex/content.tex`: the Introduction, §2 and the Limitations "Literature"
    bullet (lines ~404–405);
  - `research/paper/T6_LITERATURE_VERIFICATION.md`;
  - `research/paper/PHASE14_LITERATURE_RECHECK.md`.

## Steps

1. Search `content.tex` for "first", "novel", "unique", "only", "no prior", "to our knowledge",
   "new". List every hit with its line and context.
2. Classify each hit:
   - a novelty claim;
   - an unrelated use (for example "only 10 queries");
   - already qualified.
3. For each novelty claim, draft a replacement that is limited by the search (it points to the
   documented search in §2 and the Limitations "Literature" bullet), or remove it. Never write
   "first".
4. **Show the drafts to the author; edit only after approval.**
5. Apply the edits, then run the trace (0 problems, including the coverage check) and the build
   (body ≤ 8 pages).

## Acceptance criteria

- [ ] The paper has no unqualified "first", "novel" or "no prior work". Every remaining hit is
      classified as an unrelated use or as qualified.
- [ ] Every gap claim points to the documented search.
- [ ] Trace: 0 problems. Build: body ≤ 8 pages, 0 overfull boxes.
- [ ] The abstract stays within 200 words, if it is touched.
- [ ] The author has approved the text.

## Must not change

Anything outside the approved passages, any result, the freeze or the benchmarks.

## Pending decisions

- ISSUE-03 handling.
- Whether to fold ISSUE-04 into PAPER-05.
