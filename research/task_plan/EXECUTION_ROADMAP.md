# Execution roadmap

**Scope.** This roadmap sequences the tasks in `TASK_BACKLOG.md` (planning only, 2026-09-29).
- Publication work (Backlogs A and B) comes first, and is completed before any product work (Backlog C).
- Product work changes the evaluated system, so it is sequenced after the paper and versioned separately (1.1+).

**Must remain unchanged throughout Phases 0–4:**
- `cli/**` (the audited 1.0.1 code and data);
- the benchmark files;
- every existing file in `research/results/**`;
- `research/ANALYSIS_FREEZE_v1.0.md` (never run `freeze_analysis_report.js` in the working tree);
- `research/paper/review_round*/**`;
- the Supabase migration and the web app.

---

## Phase 0: confirm the repository and audit state (before starting any task)

- **Tasks:** none; this is a gate check.
- **Prerequisites:** none.
- **Procedure:**
  1. Run `git -C <repo> diff --stat 77f532e HEAD -- cli research/paper/acl_latex research/results research/datasets`.
     - Expected: no output. At planning time only `research/SYSTEM_AUDIT_2026-09-29.md` differed.
     - If any listed path changed, re-verify the affected findings (see `AUDIT_TRACEABILITY.md`) before the tasks that depend on them.
  2. Run `node research/experiments/trace_claims.js` and expect "0 problem(s)". This is the baseline for PAPER-10.
- **Completion gate:** both checks pass, or the differences are logged.
- **Deliverable:** a note in the first task's commit message.

## Phase 1: paper wording and claim traceability (Backlog A, P0/P1)

- **Tasks:** PAPER-03 (P0), PAPER-01, PAPER-02, PAPER-04, PAPER-05, PAPER-06, then PAPER-10.
- **Prerequisites:** Phase 0.
- **Order:**
  - PAPER-03 first, because it is the only P0.
  - PAPER-01, 02, 04, 05 and 06 are independent of each other. They all edit `content.tex`, so apply them one at a time, or as one reviewed batch.
  - PAPER-10 closes the phase.
- **Completion gate (PAPER-10 criteria):**
  - the trace reports 0 problems;
  - the body is ≤ 8 pages, with 0 overfull boxes, 0 undefined references and 0 BibTeX warnings;
  - the anonymity grep prints 0, and the abstract is ≤ 200 words.
- **Deliverables:** edited `content.tex`; updated `trace_claims.js`; regenerated `CLAIMS_TRACE.md`; rebuilt PDFs.
- **Must remain unchanged:** every result file; the analysis freeze.

## Phase 2: release identity (in parallel with Phase 1; needs approval)

- **Tasks:** RELEASE-01.
- **Prerequisites:** approval (`APPROVAL_REQUIRED.md`, item 1).
- **Completion gate:** `research/task_plan/RELEASE-01_result.md` records a per-file identical/different result with hashes.
- **Follow-up:**
  - If the files are identical, PAPER-03's optional restoration of the "published" wording may be applied, followed by PAPER-10 again.
  - If they differ, keep PAPER-03's narrow wording, and add a one-line disclosure if the corpus differs.
- **Must remain unchanged:** nothing is installed or executed from the tarball.

## Phase 3: the minimum meaningful test suite (in parallel with Phase 1)

- **Tasks:**
  - TEST-01, TEST-02 and TEST-03, which are independent and safe (pure functions, no execution);
  - then TEST-04, which needs approval (item 2);
  - then TEST-05.
- **Prerequisites:** none for TEST-01 to TEST-03.
- **Completion gate:**
  - `node --test research/tests/` passes on win32;
  - TEST-04's recorder shows 0 real `execSync` calls;
  - `research/tests/README.md` exists.
- **Deliverables:** `research/tests/*.test.js`, `research/tests/helpers/stub_exec.js` (only if TEST-04 is approved), `research/tests/README.md`, and a Tests subsection in `REPRODUCE.md`.
- **Must remain unchanged:** `cli/**`. No test writes to the real `~/.termassist/` or executes a shell.

## Phase 4: limitations, methods clarifications and reproducibility (before the Dec 15 submission)

- **Tasks:**
  - RESEARCH-01 (optional, feeding PAPER-09);
  - PAPER-07, PAPER-08, PAPER-09;
  - PAPER-10 (rerun);
  - DOCS-03 (camera-ready artifact only);
  - REPRO-01 (last).
- **Prerequisites:** Phases 1 and 3; Phase 2 if approved.
- **Completion gate:**
  - PAPER-10 passes again;
  - `REPRO-01_log.md` shows 0 files different apart from timestamps, 0 trace problems and passing tests.
- **Deliverables:** the final paper edits; `research/results/system_audit/gold_platform_check.json` (if RESEARCH-01 is run); `research/ARCHITECTURE.md` (camera-ready only); the REPRO-01 log.
- **Must remain unchanged:** all existing results. RESEARCH-01 writes only to its new directory.

## Phase 5: product hardening and future work (after the paper, separately versioned)

- **Tasks:** Backlog C.
- **Order:**
  - SAFETY-02 and SAFETY-01 first, since they are the P0s for any release.
  - Then SAFETY-04, SAFETY-03, PRODUCT-05 and DOCS-01.
  - The retrieval-changing items (PRODUCT-01, 04, 06, 02, 03) only with a planned re-evaluation against the frozen 1.0.1 results under a new results directory.
  - PRODUCT-07 (web) is independent.
  - RELEASE-02 and RELEASE-03, TEST-06, and finally RELEASE-04.
- **Prerequisites:** approvals (items 3, 4, 5, 7) and, by default, submission of the current paper.
- **Completion gate:** per task.
- **Must remain unchanged:** the audited 1.0.1 artefacts and every frozen result. The product work gets a new version and new result directories.

---

## Dependencies (acyclic)

```text
Phase0 ─┬─> PAPER-03 ─┐
        ├─> PAPER-01 ─┤
        ├─> PAPER-02 ─┤
        ├─> PAPER-04 ─┼─> PAPER-10 ──┬─> DOCS-03
        ├─> PAPER-05 ─┤              └─> REPRO-01
        ├─> PAPER-06 ─┤
        ├─> PAPER-07 ─┤
        ├─> PAPER-08 ─┤
        └─> PAPER-09 ─┘   (optional input: RESEARCH-01 -> PAPER-09)
approval#1 -> RELEASE-01 -> (optional) PAPER-03 restore -> PAPER-10
TEST-01, TEST-02, TEST-03 ─┐
approval#2 -> TEST-04 ─────┼─> TEST-05 ─> REPRO-01 ; TEST-05 -> TEST-06 (Phase 5)
SAFETY-01, SAFETY-02 (approval#3) -> RELEASE-04 (approval#7)
PRODUCT-01/02/03/04/06 (approval#4) -> each needs its own re-evaluation before any claim
```

**Can run in parallel:**
- PAPER-01 to PAPER-09 with each other (serialize the file edits);
- all of Phase 1 with TEST-01, TEST-02, TEST-03 and RESEARCH-01;
- RELEASE-01 with everything.

**Must be sequential:**
- PAPER-10 after the wording tasks;
- REPRO-01 last;
- all of Backlog C after the paper, by default.

---

## First three tasks (no approval needed; low ambiguity)

1. **PAPER-03: qualify the "published outputs" claims** (lines 43, 95; line 38 check).
   - It is the only P0 in the paper backlog.
   - The narrow wording ("the tool's source code at its release commit" or "the archived baseline outputs") is true whatever RELEASE-01 finds, so it does not need to wait.
   - XS.
2. **PAPER-01: correct the indexed-record count and the fusion candidate set** (§3 line 98, App. A line 418), with one new trace entry.
   - It fixes a factual inaccuracy the audit measured (280 indexed on win32; union 280 in fusion).
   - XS.
3. **TEST-01: golden retrieval tests for `search()`.**
   - It is safe (a pure function, no execution) and needs no approval.
   - It pins the exact behaviour that PAPER-01 and PAPER-02 describe before any further edits.
   - S.

(PAPER-02, 04, 05 and 06 can follow at once as one batch, since each is a one-sentence fix.)

---

## Publication work vs product work

| | Publication work (Backlogs A and B) | Product work (Backlog C) |
|---|---|---|
| Changes the evaluated system? | No | Yes: a new version |
| Needs a new evaluation? | No (RESEARCH-01 is a read-only count in a new directory) | Yes, for anything that affects retrieval, corpus or confidence |
| When | Before Nov 6 (Phases 1–3) and before Dec 15 (Phase 4) | After the paper (default) |
| Approval | Only RELEASE-01 and TEST-04 | Every item |
