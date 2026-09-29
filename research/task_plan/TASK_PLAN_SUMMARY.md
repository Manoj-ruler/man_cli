# Task plan summary

**Date:** 2026-09-29.
**Source:** `research/SYSTEM_AUDIT_2026-09-29.md`, audit base `77f532e`.
**Repository state:** HEAD `3227a4d`. Only the audit file has changed since the audit base, so all findings stand on unchanged code.
**Planning only.** Nothing has been implemented.

## In one paragraph

The paper does not need changes to the shipped CLI. It needs:
- **six small wording corrections**, one of them P0, so that its system description matches the code exactly;
- **one re-trace and rebuild**;
- ideally, **a small safe test suite** that pins the behaviour the paper describes.

Every dangerous product behaviour the audit found is either already disclosed in the paper or covered by the wording fixes. The code fixes belong to a separate 1.1 release, evaluated on its own, after the paper. Only two publication tasks need your approval: the npm tarball download, and loading the CLI entry point under stubs.

## Counts

| Backlog | P0 | P1 | P2 | P3 | Total |
|---|---|---|---|---|---|
| A: paper-readiness | 1 | 6 | 4 | 0 | 11 |
| B: verification and reproducibility | 0 | 5 | 3 | 0 | 8 |
| C: product and future (deferred) | 2 (release-only) | 4 | 8 | 3 | 17 |
| **Total** | 3 | 15 | 15 | 3 | **36** |

**By category:** PAPER 10 · TEST 6 · PRODUCT 7 · SAFETY 4 · RELEASE 4 · DOCS 3 · RESEARCH 1 · REPRO 1.

## Minimum paper-ready set (in order)

1. **PAPER-03 (P0):** qualify "reproduced the published outputs" and "reproduction of the published baseline". This blocks submission with the current wording.
2. **PAPER-01:** state the indexed count (279 corpus records + 1 packaged snippet = 280) and the fusion candidate set.
3. **PAPER-02:** state the exact substring-bonus rule.
4. **PAPER-04:** say what the latency measures (`search()` only).
5. **PAPER-05:** single Enter on a pre-filled prompt; `/bin/sh` on non-Windows platforms.
6. **PAPER-06:** "temporary working directories on the host", not "sandbox" (including the Ethics statement).
7. **PAPER-10:** update the trace entries, re-run the trace, rebuild, and check anonymity, page count and abstract length.

**Strongly recommended with it:**
- TEST-01, TEST-02 and TEST-03 (safe, no approval);
- RELEASE-01, if you approve the download.

## Optional

**Before submission:**
- PAPER-07 (ASCII-only tokenizer);
- PAPER-08 (one production-vs-research sentence);
- PAPER-09 (a limitation on platform-inconsistent gold commands, optionally with RESEARCH-01's count);
- TEST-04 (stubbed CLI control flow; approval);
- TEST-05;
- REPRO-01.

**Camera-ready:** DOCS-03.

**After the paper:** all of Backlog C, which consists of:
- the safety gate and the removal of the shipped snippet (P0 for any future **release**);
- placeholder and `--version` handling;
- token-boundary bonus;
- confidence display;
- out-of-scope threshold in the CLI;
- corpus `os` fixes;
- exit codes;
- web token hardening;
- README corrections;
- engines field;
- CI;
- release.

## Blockers and assumptions

- **Blocker for the "published" wording only:** tarball identity is unverified (RELEASE-01 needs approval). The narrow wording in PAPER-03 removes the blocker without it.
- **TEST-04 needs approval**, because it loads the executing entry point. It fails closed by design.
- **Assumptions:**
  - Paper line numbers refer to `content.tex` at `3227a4d`.
  - The golden tests assume win32, as the frozen reproduction does.
  - The heuristic counts (POSIX-only records, placeholders) are lower-bound heuristics, not reviewed lists.
- **Guardrails:**
  - No task edits frozen results, benchmarks, review records or `ANALYSIS_FREEZE_v1.0.md`.
  - Never run `freeze_analysis_report.js` in the working tree; it overwrites v1.0.
- **Out of scope by instruction:** the annotator workflow. Benchmark-gold validity (TA-B194 accepting `sudo reboot`) is recorded as a limitation, not a relabelling task.

## Recommended next action

Start with **PAPER-03**, then **PAPER-01**, then **TEST-01**. None needs approval, and each is XS–S. After that, batch PAPER-02, 04, 05 and 06, close with PAPER-10, and meanwhile decide approvals 1 and 2.

## Files

- `research/task_plan/TASK_BACKLOG.md`: all 36 tasks with every field.
- `research/task_plan/EXECUTION_ROADMAP.md`: phases, gates, dependencies, parallel work, first three tasks.
- `research/task_plan/APPROVAL_REQUIRED.md`: eight decisions, with their options and consequences.
- `research/task_plan/AUDIT_TRACEABILITY.md`: every audit finding mapped to a task, a limitation, "already verified", or "deferred".
- `research/task_plan/TASK_PLAN_SUMMARY.md`: this file.
