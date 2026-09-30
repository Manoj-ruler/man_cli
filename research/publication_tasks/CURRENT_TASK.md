# Current task

**Last completed:** PAPER-02 (2026-09-30): the Contributions paragraph was rewritten as Option A with
changes (b) and (c). Evidence is in `PROGRESS.md`.

**Next (recommended, pending approval): TRACE-01: register the Conclusion, Limitations and Ethics
numbers in the claim trace.**

- **Status:** PROPOSED. It is not yet in `TASKS.md`; the author must approve adding it.
- **Priority:** P0. PAPER-02's approved Contribution 3 states "a trace from every reported number to
  its result file", and ISSUE-01 shows that the Conclusion and most Limitations numbers are not
  registered.
- **Type:** code (`research/experiments/trace_claims.js` only).
- **Depends on:** VERIFY-02 (done). It should run before PAPER-06.

## Steps

1. Using the same `add(...)` pattern as the existing entries in `trace_claims.js`, register every
   number in the Conclusion (lines 360–370 of `content.tex`), the Limitations section and the Ethics
   section, against the same result files their duplicates already use.
2. Update the coverage line in the header of the generated `CLAIMS_TRACE.md` (it is set in
   `trace_claims.js`) to include the Conclusion, Limitations and Ethics.
3. Run `node research/experiments/trace_claims.js`.

## Acceptance criteria

- [ ] Every number in the Conclusion, Limitations and Ethics is registered. Check this with a
      script that lists every numeral in those sections against the registered snippets, and
      report the count.
- [ ] Trace: **0 problems**. The snippet and number counts rise by the number registered, and both
      counts are recorded.
- [ ] No change to `content.tex`, any result, the freeze or the benchmarks.
- [ ] The regenerated `CLAIMS_TRACE.md` shows the new locations and the updated coverage line.

## If not approved

The alternative next task is PAPER-03 (novelty wording, P0). Also unblocked: PAPER-01, PAPER-04,
PAPER-05, E1-01, E1-04.

## Pending decisions

- Add TRACE-01 (P0) and PAPER-08 (P1).
- ISSUE-03 handling.
- Commit now or at PAPER-06. The working tree holds the PAPER-02 edit, the rebuilt PDFs and the task
  files.
