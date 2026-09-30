# Current task

**Last completed:** PAPER-01 (2026-09-30). The research question is kept unchanged: it maps
one-to-one onto §4 (i)–(iii), §5 and §7.

**Next (recommended): PAPER-06: Phase 1 gate, the mentorship-ready snapshot.** Status: NOT STARTED.
It waits for the author to say "Start PAPER-06".

- **Priority:** P0: it guards the Nov 6 mentorship submission.
- **Type:** verify. **Depends on:** PAPER-01 to 05, TRACE-01 and PAPER-08, all done.

## Steps

1. On a clean tree, run the full VERIFY-01 check set:
   - `node research/experiments/verify_freeze_inputs.js research/ANALYSIS_FREEZE_v1.0.md`;
   - `node research/experiments/trace_claims.js`;
   - `node --test "research/tests/*.test.js"`;
   - `cd research/paper/acl_latex && bash build.sh` (page lines, overfull and undefined counts);
   - the abstract word count.
2. **Anonymity scan of `main_review.pdf`.** Its extracted text must contain none of:
   - the tool's name ("TermAssist", "MAN-CLI");
   - the package scope ("manoj-ruler", "@manoj");
   - the author's name or email;
   - "Claude" or "Antigravity" (the acknowledgements must be absent);
   - the repository URL.
3. Compare the numbers with the VERIFY-01 baseline, and explain every difference by a Phase 1 edit.
4. Restore any tracked file that changed only because of timestamps. Commit and push if anything
   changed.
5. Record the snapshot commit hash. This is the version the author submits to the mentorship
   programme (PAPER-07).

## Acceptance criteria

- [ ] Freeze 27/27; trace 0 problems (counts recorded); tests all pass; build succeeds with the body
      ≤ 8 pages and 0 overfull boxes; abstract ≤ 200 words.
- [ ] `main_review.pdf` contains none of the identifying strings above; the scan output is recorded.
- [ ] Every difference from the VERIFY-01 baseline is explained.
- [ ] The snapshot commit is pushed to `research/improvement`, and its hash is recorded in
      `PROGRESS.md`.

## Must not change

Any paper, code, result or freeze file. This task only verifies and records.
