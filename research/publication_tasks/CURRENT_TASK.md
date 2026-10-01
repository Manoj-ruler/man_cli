# Current task

**Last completed:** FINAL-01 (2026-10-01).

- The claim trace reports 208 snippets, 595 numbers, 0 problems.
- An independent spot check of 25 seeded rows: 25/25 agree (15 file-backed, 10 computed or code
  rows resolved by hand).

**Author actions:**

- **PAPER-07 (by Nov 6):** the current `main_review.pdf` is consistent and ready to submit.
- **ISSUE-11 = a:** send the drafted annotator messages. Adjudication waits.
- Decide whether to commit `research/results/annotation/`.

**Next (recommended): FINAL-02, the build, page limit, abstract length and anonymity.** Status: NOT
STARTED. It waits for "Start FINAL-02".

- Run `build.sh`:
  - the body must be ≤ 8 pages (it is currently page 8, left column, about 15%; about 96 column
    lines of headroom);
  - no overfull boxes;
  - the abstract ≤ 200 words (currently 200).
- The review PDF must be free of the tool's and author's names. Use the Node scan with a positive
  control, not grep.
- Note Table 8's float placement (page 14, three pages after Appendix C), and propose a fix if
  wanted.
