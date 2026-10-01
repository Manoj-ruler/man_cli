# Current task

**Last completed:** FINAL-03 (2026-10-01): the scoped integrity rerun **passes after one
correction**.

- 31/31 references are verified, with 0 regressions.
- 100% of the changed passages are checked.
- The "exactly those that share no word" wording in §5 and Appendix C was corrected for three
  greetings accepted through an accidental substring match.
- Trace: 208 / 595 / 0. The body ends on page 8 of 8. Anonymity passes.

**Author actions:**

- **PAPER-07 (by Nov 6):** submit the current review PDF, which includes the FINAL-03 correction.
- **ISSUE-11 = a:** send the drafted annotator messages. Adjudication waits.
- Decide whether to commit `research/results/annotation/`.
- **Optional:** add a `\clearpage` before Appendix C, for Table 8's placement.

**Next (recommended): FINAL-04, the reproduction docs and a clean-clone rerun that includes E1.**
Status: NOT STARTED. It waits for "Start FINAL-04".

- Add an E1 section to `research/REPRODUCE.md`: the order of commands, the frozen tag, the
  `git diff` check, the expected hashes, and the model cache.
- Clone the repository fresh into the scratchpad, copy the verified model cache offline (no
  download), and re-run the E1 pipeline. The outputs must match the committed
  `research/results/e1_clinc150_v1/`, apart from timestamps.
