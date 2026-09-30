# Publication task system — TermAssist paper (EACL 2027 SRW)

**Created:** 2026-09-30, on `research/improvement` at commit `c3b9f40` (working tree clean).
**Owner of decisions:** the author. **Executor:** Claude, one task at a time, only on "Start TASK-ID".

## Goal

Make the paper submission-ready as an **empirical, diagnostic audit** (not a new algorithm):

1. Tighten the contribution and novelty wording so that every claim matches the frozen evidence.
2. Add one **pre-planned** experiment, E1: an external out-of-scope (OOD) check on CLINC150 with the
   frozen v0.2 thresholds and pre-declared exclusion rules. It addresses the screening-bias concern
   in the current OOD result.
3. Integrate E1 without overstating it, then run the final publication checks.

**Out of scope here:**

- the two-annotator study and the v0.2.1 re-run, which have their own runbook
  (`research/ANNOTATION_TO_SUBMISSION_RUNBOOK.md`);
- new retrievers, LLM baselines, changes to production retrieval or execution, and the CLI 1.1 work
  (branch `product/1.1`).

## Sources

1. **The publication-readiness report** (Claude, 2026-09-30). It exists **only in the conversation
   transcript**; it was never saved to the repository.
   - Its key findings are listed below, each marked verified or unverified against the repository.
   - Saving a copy is optional task VERIFY-04.
2. **The repository**: the paper, the analysis freeze, the runbook, the claim-trace and verification
   tools, and the result files. The paths are verified in `TASKS.md`.

## Readiness-report findings vs the repository (checked 2026-09-30)

| Finding | Status | Evidence |
|---|---|---|
| The contribution is empirical and diagnostic, not a new algorithm | VERIFIED | `paper/acl_latex/content.tex`, Contributions paragraph |
| Target venue EACL 2027 SRW; mentorship deadline Nov 6 and submission Dec 15, 2026 | VERIFIED (as recorded in the repo) | `PUBLICATION_STATUS.md` |
| The benchmark is small (150 / 209), dependent and partly AI-written (59) | VERIFIED | `ANALYSIS_FREEZE_v1.0.md` §1; `content.tex` §3 |
| All analyses are exploratory; the Holm family was fixed post hoc | VERIFIED | freeze §5; abstract |
| OOD screening bias: the 35 added OOD queries were screened for low scores | VERIFIED | abstract; freeze §6 ("screening check") |
| Tuned threshold on v0.2: 46/50 OOD rejected, 20/134 false rejections; shipped raw-score AUROC 0.956 vs hybrid 0.889 | VERIFIED | freeze §6 |
| **E1 has not been started** | VERIFIED | no CLINC150 code, data or results in `research/` (CLINC appears only in literature notes) |
| **Contribution and novelty tightening not yet done** | VERIFIED | the Contributions paragraph is unchanged: item (3) is still "evaluation practice" |
| The v0.2 thresholds are "frozen" | VERIFIED WITH A CAVEAT | There are **five per-fold thresholds, not one**. The tuned shipped threshold on the raw shipped score is 6.4952 in four folds and 7.1978 in one (`results/review_r1/review_r1_e_ood_operating_points.json`). The detector thresholds on the fused top-1 score are 0.9179, 0.9219, 0.8841, 0.9247 and 0.9219 (`results/v0.2/selective-prediction-results.json`), with α = 0.5 in every fold. How to apply them to external data is **decision D2**. |
| CLINC150 access, licence and exact files | UNVERIFIED | Task E1-01 |
| New external queries can be scored exactly like the frozen pipeline | UNVERIFIED | Tasks E1-05 and E1-06 |

## Workflow (strict)

1. Claude works **only** on the task named in "Start TASK-ID". It never starts a dependent task on its
   own.
2. For each task, Claude:
   1. re-reads the task and its prerequisites;
   2. inspects the current state and explains the plan briefly;
   3. does only that task and runs its verification;
   4. reports what changed, with the evidence;
   5. updates `PROGRESS.md` and `CURRENT_TASK.md`;
   6. recommends the next task, and stops.
3. A task is marked **DONE** only if every acceptance criterion passes. Otherwise it is **BLOCKED**,
   with the exact reason and the smallest unblocking action.
4. **New issues:**
   - Claude records each one in `PROGRESS.md` under "Issues", with its evidence, and proposes a new
     task ID.
   - It never silently expands a task's scope.
   - Anything that touches research validity or a frozen artefact needs the author's decision
     first.
5. **E1 approval gates:**
   - **Gate G-E1:** nothing in Phase 3 runs until the E1 protocol and exclusion rules are approved
     and committed (task E1-09).
   - E1 outcomes are not looked at before that commit.
   - Any change to the plan after it is recorded as a numbered deviation, with the author's approval.

## Priorities

- **P0:** blocks a central paper claim, the validity of E1, or an essential submission requirement.
- **P1:** high-value work needed for a credible, reproducible submission.
- **P2:** useful, and can be deferred without undermining the central paper.
- **P3:** optional polish or future work.

## Integrity rules for every task

- The analysis freeze (`ANALYSIS_FREEZE_v1.0.md` and its 27 inputs), the frozen benchmarks and
  manifests, `cli/`, and every committed result file stay unchanged.
  - `verify_freeze_inputs.js` must report 27/27 on a clean tree.
  - New results go only into new, versioned directories.
- No thresholds are tuned on E1 data, and no benchmark label is edited to improve a result.
- Exploratory findings are never described as confirmatory.
- A general-domain OOD test is never presented as terminal-specific OOD performance.
- Source-derived facts, new observations and recommendations are always kept apart.
- Commits end with the co-author line. Pushes go only to `research/improvement`.

## Commands that change tracked files, and must be restored after verification

These commands rewrite tracked files. After a pure verification run, restore those files with
`git checkout -- <file>` unless the task intends a change.

| Command | Files it rewrites |
|---|---|
| `bash build.sh` | `paper/acl_latex/main.pdf`, `main_review.pdf` |
| `node research/experiments/trace_claims.js` | `paper/CLAIMS_TRACE.md` |
| the analysis runners | files under `research/results/` |

## How to resume

1. Open `CURRENT_TASK.md` for the next task, and `PROGRESS.md` for the history, decisions and
   blockers.
2. Tell Claude: "Start TASK-ID".
