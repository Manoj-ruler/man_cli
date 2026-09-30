# Progress log

## Status

| Phase | Tasks | Done | Blocked |
|---|---|---|---|
| 0 State verification | VERIFY-01 to 04 | 2 | 0 |
| 1 Contribution | PAPER-01 to 08, TRACE-01 | 1 | 0 |
| 2 E1 protocol | E1-01 to 09 | 0 | 0 |
| 3 E1 execution | E1-10 to 14 | 0 | 0 |
| 4 Integration | INTEG-01 to 07 | 0 | 0 |
| 5 Final checks | FINAL-01 to 06 | 0 | 0 |

## Planning entry (2026-09-30)

- **Created:** `research/publication_tasks/{README,TASKS,CURRENT_TASK,PROGRESS}.md`.
- **Nothing else changed.** The commit at planning time was `c3b9f40` on `research/improvement`, with
  a clean tree.
- **Verified during planning:**
  - all referenced paths exist;
  - E1 has not been started;
  - the contribution wording has not yet been tightened;
  - the v0.2 thresholds are five per-fold values (see README).
- **Unverified:** CLINC150 access and licence (E1-01), and whether external queries can be scored
  exactly like the frozen pipeline (E1-05 and E1-06).

## Baseline

Recorded by VERIFY-01 on 2026-09-30.

| Item | Value | Command |
|---|---|---|
| Branch / commit | `research/improvement` at `c3b9f40` (2026-09-30 10:41 +0530), the same as `origin/research/improvement` | `git branch --show-current`, `git rev-parse HEAD origin/research/improvement` |
| Tree at start | clean, apart from the untracked `research/publication_tasks/` | `git status --porcelain` |
| Node | v24.2.0 | `node --version` |
| Freeze inputs | **27/27 unchanged** | `node research/experiments/verify_freeze_inputs.js research/ANALYSIS_FREEZE_v1.0.md` |
| Claim trace | **176 snippets, 475 numbers, 0 problems** | `node research/experiments/trace_claims.js` |
| Tests | **24 tests: 24 pass, 0 fail, 0 skipped** | `node --test "research/tests/*.test.js"` |
| Build | exit 0. Body ends on **page 7 (limit 8)** in both `main` and `main_review`. Each PDF has 13 pages in total. 0 overfull boxes and 0 "undefined" warnings in both logs. | `cd research/paper/acl_latex && bash build.sh` |
| Abstract | **199 words** (limit 200) | scratchpad `abstract_words.js`, using the same rule as `words()` in `draft_label_study_update.js` |

**Side effects, all restored:**

- The build rewrote `main.pdf` and `main_review.pdf`. The PDFs embed a build timestamp, so every
  rebuild differs byte-wise. Both were restored with `git checkout --`.
- `trace_claims.js` regenerated `CLAIMS_TRACE.md` byte-identically, so no restore was needed.
- After restoring, `git status --porcelain` lists only `research/publication_tasks/`.

## Completed tasks

### VERIFY-01: Baseline snapshot (DONE 2026-09-30)

- **Acceptance criteria:** all 7 pass (see "Baseline").
- **Files changed:** only `research/publication_tasks/PROGRESS.md` and `CURRENT_TASK.md`.
- **Nothing else changed:** no paper, code, result, benchmark or freeze file.
- **Evidence:** the command outputs in the table above. The build log is in the session scratchpad
  (`verify01_build.log`, not committed).
- **Observations, not issues:**
  1. The abstract has 1 word of headroom. Any Phase 1 or Phase 4 edit to the abstract must keep it
     within 200 words.
  2. The body has about one page of headroom before E1 is added; relevant to INTEG-02.
- **Open question for the author:** the four task files are not committed yet. Commit them now, or
  at the PAPER-06 gate?

### VERIFY-02: Evidence table for the paper's quantitative claims (DONE 2026-09-30)

- **Deliverable:** `research/publication_tasks/CLAIM_EVIDENCE_MAP.md`. It has 30 claim rows: 18
  in the Abstract, 6 in the Contributions paragraph and 6 in the Conclusion.
  - Supported: 12.
  - Supported with caveat: 16.
  - Overstated as a contribution: 1 (C3).
  - Plans: 1 (K6).
  - Unsupported: 0.
  - The counts were re-checked mechanically.
- **Acceptance criteria:**
  1. Every claim sentence in the three locations has a row with a freeze reference, or is marked
     "no numeric evidence": **pass**.
  2. Every label has a justification: **pass**.
  3. Three randomly chosen claims (A10, A14, A7) re-checked against the result files all match the
     freeze and the paper: **pass**.
     - A10: 46/50 and 20/134.
     - A14: correctness AUROC difference 0.058 on v0.2.
     - A7: 0.7856 [0.4417, 0.8435] and 0.7847 [0.5238, 0.8720].
  4. No paper, result or freeze file changed; `git status` lists only `research/publication_tasks/`:
     **pass**.
- **What changed:** new `CLAIM_EVIDENCE_MAP.md`; updated `PROGRESS.md` and `CURRENT_TASK.md`.
- **New observation**, computed from committed files, not in the freeze report: the mean confidence
  of wrong answered queries is **79.50** on v0.2 (72 queries), against 86.06 on v0.1 (49 queries,
  which matches the trace).
- **Correction during the task:** my first summary miscounted the rows (29, with 5 Contributions
  rows). I recounted and fixed it before completion.

### PAPER-02: Separate the empirical contribution from standard methods (DONE 2026-09-30)

- **Author's decision:** "A with b and c". Option A was drafted in the session scratchpad as
  `paper02_A.tex`.
  - (a) Contribution 3 becomes the release of the benchmarks, the code and the number-to-file trace.
    The methods are described as established and point to §4 and §5.
  - (b) "fixes the confidence level" becomes "largely corrects the confidence level" (VERIFY-02,
    C2b).
  - (c) "86% confidence" becomes "86% confidence (v0.1)" (ISSUE-02, Contributions part only; the
    abstract is unchanged).
- **What changed:**
  - `research/paper/acl_latex/content.tex`, Contributions paragraph only: diff hunks at lines 51,
    53 and 55–59. The applied text is byte-identical to the approved draft.
  - The rebuilt `main.pdf` and `main_review.pdf`, an intended change.
  - `CLAIMS_TRACE.md` regenerated byte-identically.
- **Acceptance criteria:**
  1. No known method is presented as the paper's invention; the search for novel, new metric or
     "we propose" finds nothing: **pass**.
  2. Three items; 127 words before, **160 after**: **pass**.
  3. Every number is registered. The only numbers are the item markers, 86 (traced as "Abstract;
     §1 C1") and the version label "v0.1". Trace: 176 snippets, 475 numbers, **0 problems**: **pass**.
  4. Build exit 0. The body ends on **page 7** in both PDFs, with 0 overfull boxes and 0 undefined
     references. The references render as "(§4, §5)", with no "??": **pass**.
  5. Only `content.tex` and the rebuilt PDFs changed in the paper: **pass**.
  6. The author approved the text: **pass**.
  - The abstract is unchanged: 199 words.
- **Correction:** in the draft message I wrote the pointer as "(§4, §6)". The rendered paper reads
  "(§4, §5)", because the OOD analysis (`sec:ood`) is in the paper's §5; freeze §6 is a different
  numbering. The LaTeX is correct, so no change was needed.
- **Consequence for the plan (ISSUE-01 escalated):** Contribution 3 now states "a trace from every
  reported number to its result file".
  - The Conclusion and most Limitations numbers are not yet registered in `trace_claims.js`
    (ISSUE-01).
  - Their values are correct, having been checked by hand in VERIFY-02, but the claim is literally
    true only once they are registered.
  - TRACE-01 therefore blocks the truth of a stated contribution, and is **P0** under the plan's
    definition. It should run before PAPER-06.
- **Not committed:** the paper edit and the rebuilt PDFs are in the working tree, pending the
  author's commit decision.

## Decisions

| ID | Decision | Date | By |
|---|---|---|---|
| D1 | The plan is approved and executed task by task, starting with VERIFY-01 | 2026-09-30 | author |
| D8 (PAPER-02) | Contributions text: Option A with (b) and (c) | 2026-09-30 | author |
| — | TRACE-01 (P0) and PAPER-08 (P1) are added to `TASKS.md` | 2026-09-30 | author |
| — | Commit now: the task files, the PAPER-02 edit and the rebuilt PDFs | 2026-09-30 | author |
| — | ISSUE-03 handling: not yet decided | — | — |

## Issues

| ID | Found in | Issue | Evidence | Blocks? | Proposed task |
|---|---|---|---|---|---|
| ISSUE-01 (escalated to P0 by PAPER-02: Contribution 3 now claims a trace for every reported number) | VERIFY-02 | The claim trace does not cover the **Conclusion**. Its stated coverage is "Abstract, §1–§5, Tables 1–3, Appendix A, Appendix B". The Conclusion's 9 numbers (46, 34, 50, 12, 9, 15, 20, 11, 134) are unregistered, and so are most Limitations numbers (only the POSIX counts 3 and 4 are). All 9 Conclusion numbers were checked by hand against `review_r1_e_ood_operating_points.json` today and are **correct**. | `paper/CLAIMS_TRACE.md` header; no "Conclusion" location in the trace; grep of `trace_claims.js` | No. It is a process gap: a future edit could drift unnoticed. It matters for FINAL-01. | **TRACE-01 (P1, code):** register the Conclusion, Limitations and Ethics numbers in `trace_claims.js` and extend its coverage line. Do it before PAPER-06, so that the Phase 1 edits are checked. Needs approval to be added to the backlog. |
| ISSUE-02 | VERIFY-02 | "Wrong answers average 86% confidence" (Abstract; Contribution 1) is **v0.1 only**; the sentence gives no version. On v0.2 the value is 79.50. | Trace entry "Abstract; §1 C1 = 86" (v0.1 source); a new computation from `results/v0.2/reproduction-results.json` | No, but it is an accuracy-of-wording risk a reviewer could catch | **PAPER-08 (P1, paper):** add the version to the 86% in the Abstract and in Contribution 1, or give both values. The abstract has **1 word** of headroom (VERIFY-01), so the fix must trim elsewhere. If 79.50 is quoted, it must be registered in the trace. Could be folded into PAPER-02 (Contribution 1) plus an abstract edit. Needs approval. |
| ISSUE-03 | VERIFY-02 | The abstract's "Most out-of-scope requests are everyday" rests on **AI-assigned, unchecked** kind labels (34/50). Body §5 says so; the abstract does not. | Freeze §6 ("Kind labels were assigned by an AI assistant and are unchecked"); abstract line 20 | No | **P2.** Add it to the PAPER-05 limitations checklist, or rely on the body disclosure given the abstract's word budget. It is the author's call. |

## Deviations (E1)

*(none; E1 protocol not yet frozen)*

## Next

- **Recommended:** TRACE-01 (P0), if the author approves adding it: register the Conclusion,
  Limitations and Ethics numbers in `trace_claims.js`, so that Contribution 3's "trace from every
  reported number" is true.
- **Otherwise:** PAPER-03 (novelty wording; P0), now unblocked by PAPER-02.
- **Also unblocked:** PAPER-01, PAPER-04, PAPER-05, E1-01, E1-04.
- **Pending decisions:**
  - approve adding TRACE-01 (now P0) and PAPER-08, and how to handle ISSUE-03;
  - commit now (task files, the PAPER-02 edit and the PDFs), or at PAPER-06?

Waiting for the author's instruction.
