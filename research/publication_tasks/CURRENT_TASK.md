# Current task

**Runbook steps 7–13** (report the annotation study, then reproduce everything): **DONE (2026-10-02).**

- **Steps 10–12:** the paper reports the two-annotator study and v0.2.1.
  - Trace: 253 snippets, 755 numbers, 0 problems.
  - The body ends on page 8 of 8.
  - The abstract is 197 words.
  - The review PDF is anonymous.
  - The AI clause is in the camera-ready.
- **Step 13:** a fresh-clone reproduction of `0162be5`.
  - All steps exit 0.
  - v0.2.1 and its benchmark rebuild reproduce.
  - Freeze v2.0 reproduces up to volatile fields.
  - E1: 0 DIFFERENT.
  - Tests 24/24; trace 0 problems.
  - The annotation results are unchanged.
  - Three files were flagged by the comparison tool; they are volatile by derivation (ISSUE-14).

**Waiting on the author:**

1. **ISSUE-14:** extend `compare_reproduction.js` so that hashes of volatile-only files count as volatile
   ((a), recommended), or keep the manual note ((b)).
2. **D1–D5:** annotator recruitment and pay, consent, ethics review, demographics, codebook release. These are
   needed for an Ethics sentence and the Responsible NLP checklist (section D).
3. **Push** `research/improvement`: the commits since `be706df` are local only.
4. **PAPER-07 by Nov 6:** submit the current `main_review.pdf` (SHA-256 prefix `ce804bdfdfed7564`).
5. The optional Table 8 `\clearpage`, and LICENSE files (only on explicit instruction).
