# End-to-end research plan: from today to publication

**Date:** 2026-09-29. Branch `research/improvement`, HEAD `0e53681`.
**Target:** EACL 2027 Student Research Workshop, long paper.
- Mentorship draft: **Nov 6, 2026**.
- Final submission: **Dec 15, 2026**.
- Fallback: NAACL 2027 SRW, Jan 11, 2027.

**Built from:**
- the practice returns (both annotators, stored privately);
- the task plan (`research/task_plan/`);
- the annotation protocol (`research/datasets/annotation/ANNOTATION_PROTOCOL.md`);
- the analysis freeze v1.0, the system audit and the plan file (`research/PLAN_TASKS.md`);
- the ARS `academic-pipeline` stage model: integrity gates, re-review contract, external-review protocol and disclosure.

**This is a plan only.** Nothing in it has been executed unless marked ✅.

---

## 1. Where we are

| Workstream | State |
|---|---|
| **Paper** | Revised through three rounds. The last scoped re-review decided **Minor Revision**, and its residual items are fixed. The claim trace passes (459 numbers, 0 problems). The body ends on page 7 of 8. |
| **Analysis** | Frozen as `ANALYSIS_FREEZE_v1.0.md` (pre-annotation). The robustness checks (20 partitions, test choice) are done. |
| **System audit** | Done. Six small paper wording fixes (Backlog A in `task_plan/`) are still open, one of them P0. |
| **Annotation** | Practice round ✅: both annotators scored 8/8 core and 11/11 overall. **Open:** the independence question, because the practice comments are near-identical. The main sheets have not been sent. |
| **Corrected benchmark v0.2.1** | The build script exists (`build_v0_2_1.js`). The defect fixes are PROPOSED and need your approval. **Gap:** there is no runner yet to re-run the analysis family on v0.2.1 (`phase1_common.js` refers to a `run_v0_2_1.js` that does not exist). |
| **ARS integrity gates** | **Not yet run.** Stage 2.5 and Stage 4.5, the `integrity_verification_agent` with its 7-mode failure checklist, have never been run on this paper. Reference checks (T6/T20, 30/30 cite keys) and the claim trace cover part of their scope. |
| **Submission** | The mentorship package is prepared (`paper/T23_MENTORSHIP_SUBMISSION.md`). Nothing has been submitted. |

---

## 2. Mapping onto the ARS pipeline

The paper enters the pipeline mid-stream, after Stage 3 and 3′. There are two passes: one for the mentorship draft, and one for the final submission, which must absorb the annotation results and the mentor feedback.

| ARS stage | Pass 1: mentorship draft (by Nov 6) | Pass 2: final submission (by Dec 15) |
|---|---|---|
| 3 / 3′ Review / Re-review | ✅ Done (three rounds; last: Minor) | **Scoped re-review** of the data-driven changes (κ, v0.2.1 numbers). This needs your approval as another exception to the revision cap (§7, D5). |
| 4 / 4′ Revise | Task plan Backlog A: PAPER-03, 01, 02, 04, 05, 06, then PAPER-10 | Fold in κ, the v0.2.1 results and the mentor feedback, using `academic-paper` revision mode |
| External review protocol | — | **Mentor feedback (Dec 5)** goes through the ARS external-review workflow: intake, coaching, revision, self-verification |
| **4.5 Final integrity** | **Run** `integrity_verification_agent` (final-check): references, citation context, data, originality, claims, and the 7-mode failure checklist. It is MANDATORY and blocking; it gets at most 3 fix rounds, then needs your recorded decision. | **Run again**, fresh and from scratch, on the final draft |
| Disclosure | AI-use statement via `academic-paper` disclosure mode (ACL), if the mentorship form asks for it | **Required** for the Responsible NLP checklist at submission |
| 5 Finalize | Build with `build.sh` (LaTeX is already the format) and run the anonymity and page checks | Same, plus a final read-through (T17) |
| 6 Process summary | — | Optional, after submission |

**Mid-entry note.** The pipeline normally requires Stage 2.5 before Stage 3. That was not done. Stage 4.5 is a fresh, from-scratch check with the same five phases, so running it before each submission satisfies the intent. Record this deviation in the Pass 1 log.

---

## 3. Workstreams

### W1. Annotation study (protocol: `ANNOTATION_PROTOCOL.md`)

| Step | Action | Who | Gate / output |
|---|---|---|---|
| W1.1 ✅ | Practice round: both annotators 8/8 core, no flags | Annotators; scored by Claude | `returned/practice/` (gitignored) |
| **W1.2** | **Independence check:** ask each annotator privately whether they did the practice sheet alone and without AI tools (the message is already drafted) | You | **Gate G0: resolve before the main sheets go out.** The protocol forbids replacing or dropping an annotator *after* labels exist, so any change must happen now. |
| W1.3 | Send `PRACTICE_FEEDBACK.md` to both at once, then each person's own main sheet, with the independence rules and the one-line confirmation request | You | The codebook is frozen from this point |
| W1.4 | Clarification log: answer rule questions to both annotators, dated in `CLARIFICATIONS.md` | You (drafting help from Claude) | A rule change counts as a codebook amendment |
| W1.5 | Returns saved as `returned/annotator_1.csv` and `returned/annotator_2.csv`; run `validate_returned_sheet.js <file> N` | Claude | 0 errors; warnings reviewed |
| W1.6 | `build_adjudication_sheet.js`, sent to a **third reader** who is neither annotator nor you | You find the person; Claude builds the sheet | If there is no third reader: CONTESTED items are excluded, and REVERSED items are not relabelled (protocol §4) |
| W1.7 | Validate the third reader's return (`--validate`), then run `analyze_annotation.js --adjudication …` | Claude | κ with 95% interval, confusion matrix, target-only κ, relabel proposal |
| **W1.8** | **Gate G1:** κ ≥ 0.70 **and** ≥ 90% of OOD labels confirmed | Pre-declared | If it passes, the ambiguous labels are usable. If it fails, report κ as measured and drop ambiguity detection from the headline. At most one codebook revision, evaluated only on new items. |

**Not allowed once labels exist** (protocol): replacing or dropping an annotator, changing the κ variant, or merging classes as the primary analysis.

### W2. Paper accuracy (task plan Backlog A)

- **Order:** PAPER-03 (P0), PAPER-01, 02, 04, 05, 06, then PAPER-10 (re-trace, rebuild, anonymity). Then PAPER-07, 08 and 09 if you want them.
- **Effort:** all XS–S wording edits. No product change.

### W3. Verification (task plan Backlog B)

| Task | What | Approval |
|---|---|---|
| TEST-01 to TEST-03 | Golden `search()` tests, confidence-formula tests, index composition | None |
| TEST-04 | CLI control flow with execution stubbed | Needed |
| RELEASE-01 | npm tarball identity check | Needed |
| TEST-05 | Test entry point | None |
| REPRO-01 | Clean-clone reproduction before Dec 15 | None |

### W4. Corrected benchmark and re-analysis (T8, T12; after G1)

| Step | Action | Notes |
|---|---|---|
| W4.1 | Approve `v0.2.1_fixes.json` (TA-B145, TA-B149, TA-B187) and the T8 tag of frozen v0.2 | Your decision (D2) |
| **W4.2** | **Build the missing v0.2.1 re-run harness**: a script that runs the four-comparison family, T1–T5, the review-round analyses and the claim trace on a given benchmark version. It writes to **new** result directories (`research/results/v0.2.1/…`) and never overwrites v0.2 results. | **Can be built and dry-run now**, before labels arrive, using `build_v0_2_1.js --proposal <synthetic> --out <scratch>`. It is the main engineering risk on the critical path. |
| W4.3 | `build_v0_2_1.js --confirm` using the real relabel proposal and the approved fixes | Refuses while the fixes are PROPOSED or the proposal is synthetic |
| W4.4 | Re-run on v0.2.1 and report next to v0.2 (exploratory again, as the protocol states) | New result directories only |
| W4.5 | **Analysis freeze v2.0**, written to a *new* file `ANALYSIS_FREEZE_v2.0.md` | The freeze script's output name must change first; never overwrite v1.0 |

### W5. Integrity, review and disclosure (ARS)

| Step | Pass | Action |
|---|---|---|
| W5.1 | 1 | Stage 4.5 final integrity on the mentorship draft, after W2 |
| W5.2 | 1 | AI-use disclosure (`academic-paper` disclosure mode, ACL), if the mentorship form requires it |
| W5.3 | 2 | Revise with κ and v0.2.1 (Stage 4 style), then a scoped re-review of those changes (three gates, as in T22b) |
| W5.4 | 2 | Mentor feedback through the external-review protocol |
| W5.5 | 2 | Stage 4.5 again (fresh), the AI-use disclosure for the Responsible NLP checklist, and the final build and read-through |

### W6. Submission and after

| Step | Action | Notes |
|---|---|---|
| W6.1 | **Mentorship upload**: `main_review.pdf` only, following the T23 checklist | You |
| W6.2 | **Final upload by Dec 15** | You |
| W6.3 | Camera-ready (if accepted, Jan 19, 2027) | Restore the real names (`main.tex`), DOCS-03 architecture note, artifact release |
| W6.4 | Product 1.1 (task plan Backlog C) | After the paper, separately versioned and separately evaluated |

---

## 4. Calendar

Dates are targets; the critical path is marked ★.

| Week | Annotation (W1) | Paper and verification (W2, W3, W5) | Benchmark (W4) |
|---|---|---|---|
| **Sep 29 – Oct 3** | ★ W1.2 independence check; ★ W1.3 send the feedback and main sheets once G0 is clear | W2: PAPER-03, 01, 02, 04, 05, 06, 10; TEST-01 to 03; decide approvals 1 and 2 | W4.1 decisions |
| **Oct 6 – 10** | Annotators work (about 1–1.5 h each); answer rule questions | ★ W5.1 Stage 4.5 integrity on the mentorship draft (up to 3 fix rounds); RELEASE-01 and TEST-04 if approved | ★ W4.2 build and dry-run the v0.2.1 harness |
| **Oct 13 – 17** | ★ W1.5 returns in and validated | ★ W5.2 disclosure if required; **W6.1 submit the mentorship draft early** (deadline Nov 6) | — |
| **Oct 20 – 31** | ★ W1.6 third reader adjudicates (about 10 min per contested item); ★ W1.7 analysis; ★ W1.8 gate G1 | — | — |
| **Nov 2 – 14** | — | ★ W5.3 revise with κ and v0.2.1; scoped re-review | ★ W4.3 build v0.2.1; ★ W4.4 re-run; ★ W4.5 freeze v2.0 |
| **Nov 16 – Dec 4** | — | PAPER-07 to 09; REPRO-01 (clean clone) | — |
| **Dec 5 – 12** | — | ★ W5.4 mentor feedback via the external-review protocol; ★ W5.5 Stage 4.5, disclosure, final build and read-through | — |
| **By Dec 15** | — | ★ **W6.2 submit** | — |

**Slack:** the annotation chain has about three weeks of buffer against the protocol's Nov 25 target. Submitting the mentorship draft early (mid-October) keeps it off the critical path.

---

## 5. Gates

| Gate | Condition | If it fails |
|---|---|---|
| **G0: independence** | Both annotators confirm they worked alone and without AI tools, or you decide on a replacement **before** the main sheets are sent | Replace or re-brief the annotator now. Once labels exist, the protocol forbids replacement. |
| **G-M: mentorship ready** | Backlog A P0/P1 done; claim trace 0 problems; Stage 4.5 PASS (or a recorded decision after 3 rounds); build clean; anonymity 0; abstract ≤ 200 words; body ≤ 8 pages | Fix, or submit with the recorded exceptions (deadline Nov 6) |
| **G1: label reliability** | κ ≥ 0.70 and ≥ 90% of OOD labels confirmed (pre-declared) | Report as measured; drop ambiguity detection from the headline |
| **G2: near-OOD set (T13)** | Only if you choose it; it needs human-judged queries | Recommended: skip and keep it as a limitation |
| **G-F: final submission** | The G-M checks again, on the v0.2.1-updated draft, plus the scoped re-review, Stage 4.5 PASS, the disclosure, REPRO-01 and the annotation results reported | If the annotation is late (after about Dec 5): submit with the study "under way", or move to NAACL SRW (Jan 11) |

---

## 6. Risks

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| The annotators did not work independently (practice comments near-identical) | Medium / **high**: κ becomes meaningless | G0 now; the independence line with the main sheets; note it in the paper if confirmed |
| No third reader for adjudication | Medium / medium | Find one now (anyone except the annotators and you). Without one, the protocol's rule applies (CONTESTED items excluded). |
| κ < 0.70 | Plausible (the pilot κ was 0.63) / medium | Pre-declared: report as measured and drop the ambiguity headline. The paper's central calibration and out-of-scope results do not depend on the ambiguous labels. |
| The v0.2.1 harness is not ready when the labels arrive | Medium / high (critical path) | Build and dry-run it in W4.2, the week of Oct 6 |
| v0.2.1 changes the headline numbers | Likely small / medium | The claim trace flags every changed number; report v0.2.1 next to v0.2 |
| Integrity checker finds problems late | Low–medium / medium | Run Stage 4.5 in Pass 1, so Pass 2 is incremental |
| De-anonymization through public releases during review | Low / high | No package, README or dashboard changes until after notification (task plan approval 7) |
| Revision-cap exceptions pile up in the ARS record | Certain / low | Log each exception with your approval (D5) |

---

## 7. Decisions needed from you

| ID | Decision | By |
|---|---|---|
| **D1 (G0)** | The outcome of the independence check, and what to do if an annotator did not work alone | Before sending the main sheets |
| **D2** | Approve `v0.2.1_fixes.json` and the T8 tag of v0.2 | Before W4.3 (mid-November) |
| **D3** | Name the third reader for adjudication | By about Oct 17 |
| **D4** | Task plan approvals 1 (npm download) and 2 (stubbed CLI tests) | Any time; optional |
| **D5** | Allow a **scoped fourth review round** for the κ/v0.2.1 changes, as an exception to the ARS revision cap | Before W5.3 |
| **D6** | Near-OOD set (T13): recommended **no** | Any time |
| **D7** | Whether to submit the mentorship draft early (recommended mid-October) | Oct |

---

## 8. This week, in order

1. **You:** send the independence-check message to each annotator (Message 1 in the earlier reply).
2. **Claude, once approved:** PAPER-03, then PAPER-01, then TEST-01 (task plan "first three"), then the rest of Backlog A and PAPER-10.
3. **You, after G0 is clear:** send the practice feedback and each person's main sheet (Message 2).
4. **You:** find a third reader (D3).
5. **Claude:** start W4.2, the v0.2.1 re-run harness, with a synthetic dry run.
