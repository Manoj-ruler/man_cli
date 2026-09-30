# Current task

**Last completed:** PAPER-08 (2026-09-30): the abstract's 86% now says "(v0.1)", the "everyday" claim
says "(AI-assigned labels)", and the abstract is still 199 words.

**Next (recommended): PAPER-05: check Limitations and threats to validity.** Status: NOT STARTED. It
waits for the author to say "Start PAPER-05".

- **Priority:** P1. **Type:** paper. **Depends on:** VERIFY-02 (done).
- **Files:** `research/paper/acl_latex/content.tex`, the Limitations section (lines ~380–408). Also
  `research/experiments/trace_claims.js`, but only if a registered Limitations snippet is reworded.

## Steps

1. For each threat below, find the line where the paper states it, and record it as present,
   partial or missing:
   1. the OOD screening bias;
   2. detector features chosen on the full data;
   3. the repository corpus vs the released corpus;
   4. the author audits their own tool;
   5. the exploratory status;
   6. POSIX-only gold answers;
   7. exact-match scoring;
   8. no LLM baseline, and why;
   9. ISSUE-04: "Accuracy tests rest on 7--8 discordant queries" holds only for hybrid vs BM25
      (hybrid vs dense: 12 and 17).
2. Draft additions **only** for threats marked missing or partial, plus the ISSUE-04 rewording.
3. **Show the checklist and drafts to the author; edit only after approval.**
4. Apply, then update any `trace_claims.js` entry whose snippet changed. Run the trace (0 problems,
   including the coverage check) and the build.

## Acceptance criteria

- [ ] A checklist in `PROGRESS.md` gives, for every threat, the line that states it, or marks it
      missing.
- [ ] Only missing or partial threats get additions; ISSUE-04 is resolved.
- [ ] Trace: 0 problems, including coverage. Build: body ≤ 8 pages (Limitations does not count
      toward the limit), 0 overfull boxes.
- [ ] The author has approved the text.

## Must not change

Anything outside Limitations, apart from the matching trace entry. No result, freeze or benchmark
file.
