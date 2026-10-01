# Current task

**Last completed:** FINAL-04 (2026-10-01).

- `REPRODUCE.md` gained step 9 (E1).
- A clean clone, with an offline `npm ci` and a copied verified model cache, re-ran the whole E1
  pipeline.
- **`compare_reproduction.js` reports 0 DIFFERENT** (8 volatile-only). A negative control confirms
  the comparison still catches real changes.

**Author actions:**

- **PAPER-07 (by Nov 6):** submit the current review PDF.
- **ISSUE-11 = a:** send the drafted annotator messages. Adjudication waits.
- Decide whether to commit `research/results/annotation/`.
- **Optional:** add a `\clearpage` before Appendix C, for Table 8's placement.

**Next (recommended): FINAL-05, a consistency review of the paper, code and artefacts.** Status:
NOT STARTED. It waits for "Start FINAL-05".

- Every artefact the paper mentions exists at the stated path.
- Names, versions and counts are consistent across the paper, the README files, `REPRODUCE.md`, the
  task documents and the result files. This includes the corpus sizes, the benchmark versions, the
  E1 tag and paths, and the tool's release statement.
- Discrepancies are listed, and fixed only with approval where they touch the paper.
