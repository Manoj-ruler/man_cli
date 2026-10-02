# Runbook: from annotator returns to a submission-ready paper

**Status (2026-09-29).** Every scripted step below was rehearsed end to end on synthetic returns and
completed. Only the human steps remain: the main sheets from the two annotators, and the third
reader's adjudication.

**Rehearsal details.** The fixtures were written outside `research/`, stamped SYNTHETIC, and deleted
afterwards; no fixture is committed. The scripts' synthetic mode refuses to write into `research/`.

The rehearsal found and fixed one bug that would have aborted the real run:

- `seed_repeat_cv.js` compared BM25 accuracy under two definitions that differ once labels change;
- fixed in ace5347;
- frozen outputs are unchanged.

**2026-09-30:** the author reports that both annotators are working on the main sheets. If G0 was
answered, keep each annotator's confirmation in `coordinator/` (it is gitignored) so the paper can
state it.

**2026-10-01: both main sheets are back.**

- **Steps 1–2 are done.** Both validate with 0 errors and 0 warnings.
- A **pre-adjudication** run of step 5 (without `--adjudication`, as protocol §4 allows) wrote
  `research/results/annotation/`. It is not yet committed.
- **Step 3 is on hold (ISSUE-11).** Annotator 2's `record_ids` appear misplaced on about 12–15
  rows, and the adjudication sheet shows record ids.
  - A record_ids-only correction, with the labels locked, and an independence confirmation from
    both annotators were requested. The drafts are in `coordinator/MESSAGE_DRAFTS_2026-10-01.md`.
  - The return checks are listed there.

**2026-10-02 update:**

- The re-check came back with changed labels and comments, and is **not used** (ISSUE-12).
- The author reports that the annotators confirmed independence.
- **No third reader is available.** Protocol Amendment 7 applies, and steps 3–4 are **skipped**:
  - TA-B203 (CONTESTED) is excluded;
  - the 4 REVERSED items are reported and not relabelled.
- **The step-5 result is final** (without adjudication): κ = 0.980, and both criteria (G1) are met.
- The next human step is step 7 (v0.2.1), which is the author's decision.

**2026-10-02, later:** steps 7–9 are done and step 10 is drafted.

- **Step 7:** v0.2.1, 207 queries (`be706df`).
- **Step 8:** `research/results/v0.2.1/` (`5ab3913`).
- **Step 9:** `ANALYSIS_FREEZE_v2.0.md` (`9d64ae5`). Every [VERIFY] sentence is now computed or checked in the
  generator (`d14d9ec`), and 0 markers remain.
- **Step 10:** the generated draft does not fully match the paper and needs corrections. The corrected
  proposal is `paper/drafts/LABEL_STUDY_UPDATE_PROPOSAL.md`.
  - It includes decision D13: how v0.2.1 is reported. The re-run weakens the v0.2 calibration result.
  - The paper is edited only after the author approves.
- **Step 10 applied** (author: "D13 = A, full disclosure, ISSUE-13 = a").
  - Trace: 0 problems (252 snippets, 752 numbers). The body ends on page 8. The abstract is 197 words.
  - Next: step 11 (on "Start") and step 12 (the statement clause is drafted in
    `paper/drafts/AI_STATEMENT_STEP12_DRAFT.md`).

**The external check (E1) does not depend on this study.** E1 uses the frozen **v0.2** thresholds
(decision D7), so steps 7–9 do not re-run it, and the label-study update in step 10 must leave the E1
passages and their numbers unchanged:

- §4 "External check";
- §5;
- Appendix C;
- the E1 sentences in the Abstract, Discussion, Conclusion and Limitations.

`trace_claims.js` checks those numbers.

## Before the main sheets go out (you; now done)

- **G0:** each annotator confirms privately that they did the practice sheet alone and without AI
  tools. The practice comments were near-identical, and the protocol forbids replacing an annotator
  once labels exist.
- Send the feedback and the main sheets:
  - `research/datasets/annotation/sheets/annotator_{1,2}_sheet.csv`;
  - `HOW_TO_RETURN.md`;
  - the guidelines and codebook.
- Find a third reader who is neither annotator nor you. If there is none, CONTESTED items are
  excluded and REVERSED items are not relabelled (protocol §4).

## When the returns arrive

All commands run from the repository root. Put the files under
`research/datasets/annotation/returned/`, which is gitignored.

| # | Step | Command | Expected / what to check |
|---|------|---------|--------------------------|
| 1 | Save the returns as `returned/annotator_1.csv` and `annotator_2.csv` | — | Real names stay only in `coordinator/` and `returned/` (both gitignored) |
| 2 | Validate each return | `node research/experiments/validate_returned_sheet.js research/datasets/annotation/returned/annotator_1.csv 1`, then the same with `annotator_2.csv 2` | "VALID: 0 errors". Warnings mean the procedure was not followed; ask the annotator, but never edit their labels yourself. |
| 3 | Build the adjudication sheet | `node research/experiments/build_adjudication_sheet.js` | It writes `sheets_adjudication/`. Send the sheet and `ADJUDICATION_INSTRUCTIONS.md` to the third reader. In the rehearsal: 10 items (REVERSED + CONTESTED + an equal number of decoys). |
| 4 | Save and validate the adjudication | `node research/experiments/build_adjudication_sheet.js --validate research/datasets/annotation/returned/adjudication.csv` | 0 errors |
| 5 | Analysis (the plan was fixed before any label existed) | `node research/experiments/analyze_annotation.js --adjudication research/datasets/annotation/returned/adjudication.csv` | `research/results/annotation/`: κ with 95% CI, criteria, and `relabel_proposal.json` |
| 6 | **Gate G1:** κ ≥ 0.70 and ≥ 90% of OOD labels confirmed | Read `ANNOTATION_RESULTS.md` | If it fails, report κ as measured and drop ambiguity detection from the headline (pre-declared) |
| 7 | Build v0.2.1 | `node research/experiments/build_v0_2_1.js --confirm` | If it aborts with "need a manual decision", write a `--manual` file (`{"items": {"TA-B…": ["tac-…"] \| "drop"}}`) and rerun with `--manual <file>`. **This decision is yours.** The rehearsal exercised this path. |
| 8 | Re-run every analysis on v0.2.1 | `node research/experiments/run_v0_2_1.js` | About 3 min. It writes `research/results/v0.2.1/` with `RUN_MANIFEST.json`. It needs a clean `research/experiments` and `cli/`, and it refuses if the output exists. |
| 9 | Analysis freeze v2.0 | `node research/experiments/freeze_analysis_report.js --results-root research/results/v0.2.1 --version 2.0` | Writes `ANALYSIS_FREEZE_v2.0.md`; v1.0 is never overwritten. Tables are computed from the v0.2.1 run and the κ results. Every sentence marked **[VERIFY for v0.2.1]** restates a v1.0 observation: check it, and reword it in the generator before the report is used. |
| 10 | Draft the paper update | `node research/experiments/draft_label_study_update.js` | Writes `paper/drafts/LABEL_STUDY_UPDATE_DRAFT.md`, with current and proposed text for the 5 label-study passages. Wording follows the pre-declared outcome, and it lists the `trace_claims` registrations. Settle its G0 note, then ask Claude to apply it together with the v0.2.1 numbers. Then run `trace_claims.js` (0 problems) and `bash build.sh` (≤ 8 pages). |
| 11 | Scoped re-review, then Stage 4.5 again | Ask Claude (ARS reviewer re-review, integrity final-check) | Rerun `STAGE4_5_INTEGRITY_REPORT.md` with 100% of the changed paragraphs |
| 12 | AI-use disclosure | **Done 2026-09-30.** The author answered; the statement is in the camera-ready Acknowledgements (`\aiacknowledgements` in `main.tex`). | Recheck that it still describes the uses after step 10 |
| 13 | Clean-clone reproduction (REPRO-01) | Follow `research/REPRODUCE.md` in a fresh clone | Tests: `node --test "research/tests/*.test.js"` gives 24/24 (this row said 23/23 until 2026-10-01; the suite now has 24 tests, as `REPRODUCE.md` also states). Freeze inputs: `verify_freeze_inputs.js` gives 27/27. E1: `REPRODUCE.md` step 9, where `compare_reproduction.js` gives 0 DIFFERENT (verified 2026-10-01). |

Everything after step 13 is yours: submitting the paper, and publishing CLI 1.1 (`PRODUCT_1_1.md` on
the local `product/1.1` branch).
