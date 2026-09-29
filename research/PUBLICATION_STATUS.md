# TermAssist paper: where we are on the way to publication

**As of:** 2026-09-29.
**Branch and commit:** `research/improvement`, commit `8c2c052`.
**Earlier status file:** this replaces `CURRENT_PUBLICATION_STATUS_AND_ROADMAP.md` (2026-09-28) as the current status.

Every number below comes from a committed result file, and `research/experiments/trace_claims.js` checks the
paper's numbers against those files. Where something is an opinion, it says so.

---

## 1. Bottom line

- **The mentorship draft is ready.**
  - The review version builds cleanly and is anonymized.
  - Every number in it is checked against its source: 459 numbers, 0 mismatches.
  - It has been through three rounds of simulated peer review. The last round's decision was Minor Revision, and its six residual items have since been fixed.
  - **The next step is yours: submit it to the EACL 2027 SRW pre-submission mentorship programme by Nov 6, 2026.**
- **The final submission (Dec 15, 2026) waits on one thing: the two-annotator label study.**
  - Its results feed a corrected benchmark (v0.2.1).
  - Everything is re-run on that benchmark, and the paper is updated.
  - Everything else needed for the final version is in place.
- **Opinion.** The paper is a sound, modest SRW contribution: an honest audit with careful statistics. Its main risks are:
  - a small benchmark, partly written by an AI agent;
  - reviews so far simulated by one model family, with no human reader yet;
  - a novelty claim that rests on the combination of analyses rather than a new method.

  None of these blocks a student-workshop submission. All of them are disclosed in the paper.

---

## 2. Target venue and dates

These were verified on the official call on 2026-09-28 (`PLAN_TASKS.md` D4).

| Milestone | Date | Status |
|---|---|---|
| EACL 2027 SRW pre-submission mentorship deadline | **Nov 6, 2026** | Draft ready; author submits |
| Mentorship feedback | Dec 5, 2026 | — |
| Annotation study finished (target) | ~Nov 25, 2026 | With annotators; no returns in the repo yet |
| **Final (direct) submission** | **Dec 15, 2026** | Waits on annotation → v0.2.1 → re-run |
| Notification | Jan 5, 2027 | — |
| Camera-ready | Jan 19, 2027 | Real tool name restored (`main.tex`) |
| Conference (Athens) | Mar 9–14, 2027 | — |

**Format.**
- Long paper: 8 pages of content (9 at camera-ready), unlimited references.
- Anonymous review.
- The first author must be a student.

**Fallback.** NAACL 2027 SRW: mentorship Nov 16, 2026; submission Jan 11, 2027.

---

## 3. The paper as it stands

**Title.** *Confidently Wrong: Auditing and Recalibrating the Confidence of a Shipped Natural-Language-to-Shell Command Retriever.*

**Files.**
- `research/paper/acl_latex/content.tex` is the shared body.
- `main_review.tex` builds the anonymized version and `main.tex` the camera-ready version.

**Shape.**
- Abstract: 197 words.
- Body: ends on page 7 of 8.
- Tables and figures:
  - 3 main-text tables and 1 main-text figure;
  - 4 appendix tables and 5 appendix figures.
- References: 30.

**Research question.** How reliable is the confidence shown by a published closed-set command retriever? What do each of the following contribute?
- post-hoc recalibration;
- a tuned rejection threshold;
- a hybrid lexical–dense retriever.

**The audited system.**
- A published npm CLI: BM25 over 279 Windows commands, with no LLM.
- It prints a confidence percentage and refuses below 30%.
- It runs the pre-filled command when the user presses Enter.
- It was written by the paper's author before the study. The study changed none of its executable code.

**Headline results.** Non-control queries; v0.1 / v0.2.

| Claim | Result | Status |
|---|---|---|
| The shipped confidence is miscalibrated | ECE .323 / .293. Wrong answers average 86% confidence, and 44.9% of them are shown at 100%. Brier skill −0.23 / −0.06; the intervals include 0, so it is no better than a constant. | robust |
| Recalibration fixes most of it | Isotonic recalibration: ECE .069 / .063 (−79% / −78%). Brier skill becomes 0.20 / 0.33. | robust in size. "Within the noise floor" holds on only 18/20 and 13/20 fold partitions |
| Out-of-scope requests need a threshold, not a new retriever (v0.2) | Fixed rule 17/50 rejected; hybrid detector 34 (11 false rejections of 134); tuned shipped threshold 46 (20 false rejections). The shipped score ranks out-of-scope requests better (AUROC .956 vs .889). | holds on 20/20 partitions |
| The hybrid ranks its own errors better | AURC −.115 / −.075; AUGRC −.048 / −.030; correctness AUROC +.099 / +.058 (the v0.2 interval includes 0) | robust (20/20 partitions) |
| The hybrid's accuracy gain | +6.4 pp (Holm p = .047) / +4.5 pp (p = .070; mid-p .039) | fragile, reported as such |
| Risky wrong answers | Both systems return a few high- or critical-risk commands for benign requests (2 / 2 for the shipped tool, 3 / 6 for the hybrid). Each system has one such answer at its maximum confidence on each version. The classifier misses at least one destructive command, so these counts are lower bounds. | descriptive only, no safety claim |

**Contributions** (as framed after decision D6):
1. an audit of a shipped tool's confidence;
2. an attribution of what fixes what;
3. evaluation practice for small closed-set benchmarks: tie-aware selective metrics, a noise floor and no-skill reference for calibration, and out-of-scope rules compared at equal false-rejection counts.

---

## 4. How the paper got here

| Stage | What happened | Outcome |
|---|---|---|
| Research (Phases 1–6) | Baseline reproduced exactly (0/150 mismatches). Hybrid, calibration, selective prediction, ablation, safety and statistics analyses. Benchmark v0.1 (150 queries) and v0.2 (209 queries). | Frozen results in `research/results/` |
| T1–T7 | Controls excluded, OOD breakdown, tie-aware metrics, calibration comparators, safety recount, literature search, amendments | done |
| T14 / round 1 | ARS `academic-paper` revision, then an ARS five-seat review panel | **Major Revision**: 3 blocking issues, 17 required items, 37 suggested |
| T18–T20 | New analyses of existing data (53 checks); implementation facts; literature additions | The key finding reframed the paper: the out-of-scope gain comes from the threshold, not the hybrid |
| T21 / round 2 | Paper reframed around auditing the shipped confidence (D6) | Re-review (T22): **Major Revision**; should-fix rate 76% |
| T21b / round 3 | An approved exception to the 2-round cap. Tool anonymized (D7 reversed). All residual items addressed. | Scoped re-review (T22b): **Minor Revision**; should-fix rate 84% |
| Minor fixes | The six decision-affecting residual items fixed | No further review round is required |
| T15 | Claim-trace checker covering every number in the paper | **Found 3 real errors, all fixed:** 78% not 79% on v0.2; a 16-word stopword list, not 10; the bonus ablation changes one v0.2 answer, not zero |
| T17 | Read-through of all rendered pages | 7 wording and consistency fixes |
| T24 | Approved extra analyses: 20 fold partitions (S11), mid-p and asymptotic tests (S6), main-text figure (REV-10) | Main results hold across partitions. Two claims are now qualified: the noise floor and the test choice. |
| T23 | Mentorship package prepared (`research/paper/T23_MENTORSHIP_SUBMISSION.md`) | Waits on the author |

**How the reviews were run.**
- All review rounds used the ARS skills.
- The contract's machine artifacts do not exist for a LaTeX paper. The three review gates were therefore run by hand, and the decisions are **not checker-verified**.
- Round 3's gates ran in separate fresh-context agents.
- **Every simulated reviewer, and the author of the revisions, was the same model family.** A human reader, such as mentors or faculty, is still missing.

---

## 5. Quality and integrity controls in place

- **Traceability.**
  - `research/experiments/trace_claims.js` checks 459 numbers in 171 passages of the paper against result fields, per-query computations, code constants and dataset counts.
  - Run it after any edit; it must report 0 problems. Its output is `research/paper/CLAIMS_TRACE.md`.
- **Reproducibility.**
  - `research/REPRODUCE.md` (T16): a fresh clone regenerates everything, with 0 files different.
  - Every post-hoc analysis script first reproduces the committed numbers it builds on (guards), and aborts on any mismatch.
  - `run_review_r1.js` runs all nine review-round analyses; a rerun gives byte-identical output apart from timestamps.
- **Frozen artifacts.**
  - Benchmarks v0.1 and v0.2 are unchanged.
  - The shipped tool's code is unchanged.
  - The v0.2 artifacts are kept.
- **Anonymity.**
  - The review PDF contains no tool name, package scope, author name or original item-ID prefix, and its metadata is empty. Checked after every build.
  - The LaTeX sources and logs are **not** anonymous. Never upload them.
- **Disclosure.**
  - The paper states that 59 benchmark queries were written by an AI agent.
  - It states that the label check fell below target (κ = 0.63, interval [0.39, 1.00], n = 14).
  - It states that all analyses are exploratory, the full-data feature-selection leak, and every null or fragile result.

---

## 6. What is still open

### 6.1 The author's actions (Claude cannot do these)

| # | Action | When | Notes |
|---|---|---|---|
| A1 | **Submit the mentorship draft**: rebuild with `build.sh`, run the checklist, upload `main_review.pdf` only | before Nov 6 | `research/paper/T23_MENTORSHIP_SUBMISSION.md` |
| A2 | Check the official call for the submission system, the mentorship format, and whether the Responsible NLP checklist and AI-assistance question are required at this stage | before A1 | not verified in this session |
| A3 | Confirm the §1 authorship sentence ("written and released by one of the authors before this study …") | before A1 | evidence in `T21b_REVISION_LOG.md` |
| A4 | Decide whether to accept the registry-lookup risk: the §3 details could identify the package | before A1 | the SRW allows non-anonymous preprints |
| A5 | Spot-check the NL2SH author list against the published PDF (ADJ-1) | before Dec 15 | one-minute check |
| A6 | Run the annotation study (T9 practice → T10 sheets → returns) | target ~Nov 25 | no returned sheets in the repo yet |
| A7 | Approve the pending items: the benchmark fixes in `datasets/v0.2.1_fixes.json`, and the T8 tag of the frozen v0.2 benchmark | before T12 | D10 |
| A8 | Confirm that the handbook's coordinator block (C1–C10) was removed before the annotators received it | now | D10 |
| A9 | Decide D2 (the near-out-of-scope set, T13). Recommendation: **no** before Dec 15; keep it as a stated limitation. | any time | needs human-judged queries |
| A10 | Decide REV-33 (tool-retrieval literature) and REV-39 (cost-of-harm operating points) | after mentor feedback | the only contested items left |
| A11 | Get one human read (mentor, faculty or peer) | Nov–Dec | the most valuable missing input |

### 6.2 Claude's work once its inputs arrive

| # | Work | Needs | Output |
|---|---|---|---|
| C1 | T11: adjudicate the annotations and compute κ and label changes (`analyze_annotation.js`) | returned sheets (A6) | κ with interval; relabel list |
| C2 | T12: build v0.2.1 with the approved fixes and the adjudicated labels, then re-run the whole pipeline | C1, A7 | v0.2.1 results |
| C3 | Update the paper with κ and v0.2.1. Rerun the claim trace; it flags every number that moves. | C2 | revised `content.tex` |
| C4 | Fold in the mentor feedback (A10 decisions) | mentor feedback, Dec 5 | revised `content.tex` |
| C5 | A final scoped re-review (ARS), then a final read-through (T17) | C3, C4 | review record |
| C6 | AI-use disclosure statement (ARS `disclosure` mode, ACL) | before Dec 15 | statement for the checklist |
| C7 | Errata notes in six older working documents that still carry the three corrected facts | one click on the queued task | dated errata |

### 6.3 Critical path to Dec 15

```text
annotators return (~Nov 25) → C1 (1–2 days) → C2 (1–2 days) → C3 + C4 (2–3 days) → C5 (2 days) → submit by Dec 15
```

The chain after the returns takes about 7–9 working days, which leaves about ten days of slack if the returns arrive
around Nov 25. **If the annotation slips past about Dec 5**, there are two options:
- **(a) Submit on Dec 15 without annotation results.** The paper already reports the study as under way.
- **(b) Move to the NAACL 2027 SRW** (Jan 11, 2027).

---

## 7. Known weaknesses a reviewer will raise

This is opinion, based on the three simulated review rounds. All of it is disclosed in the paper.

1. **Small benchmark, partly AI-authored.**
   - 150 and 209 queries; the second version contains the first.
   - 59 queries were drafted by an AI agent.
   - The label check was below target. The annotation study is the fix.
2. **Few terminal-task out-of-scope queries.** Only 10, so the out-of-scope result mostly concerns everyday non-computing requests. The fix would be the near-OOD set (T13), which is out of scope for Dec 15.
3. **Exploratory statistics.** The test family was named after results were seen. Only one accuracy test survives, and it is fragile.
4. **One tool, one platform, one small encoder and one fusion rule.** No generative baseline and no user study.
5. **The novelty is a combination of analyses, not a new method.** The related-work search was targeted, not systematic.
6. **Calibration depends on the partition.** Recalibration always helps a lot, but "within the noise floor" holds on only 13 of 20 v0.2 partitions. The paper now says so.

---

## 8. Housekeeping notes

**Stale entries in `research/PLAN_TASKS.md`**, corrected alongside this file:
- D3 ("keep the name") was superseded by the D7 reversal on 2026-09-29.
- D8 (page budget) was decided in round 2: the secondary tables moved to the appendix.
- D9 (triage mode) was settled: Claude triaged, and the contested items went back to the author.
- The T14 entry is superseded by T21, T21b and T24.

**Older documents with outdated numbers:** `FINAL_RESEARCH_REPORT.md`, `paper/manuscript.md` and `manuscript_SRW_long.md` are earlier drafts. Use them for history only.

---

## 9. Key files

| Purpose | Path |
|---|---|
| Paper body, and the two wrappers | `research/paper/acl_latex/content.tex`, `main_review.tex`, `main.tex` |
| Build, with the 8-page guard | `research/paper/acl_latex/build.sh` |
| Mentorship package and checklist | `research/paper/T23_MENTORSHIP_SUBMISSION.md` |
| Claim trace (checker and output) | `research/experiments/trace_claims.js`, `research/paper/CLAIMS_TRACE.md` |
| Revision logs | `research/paper/T21_REVISION_LOG.md`, `research/paper/T21b_REVISION_LOG.md` |
| Review records | `research/paper/review_round1/`, `review_round2/`, `review_round3/` |
| Post-review analyses | `research/results/review_r1/` (notes: `REVIEW_R1_NOTES.md`), `research/results/seed_repeat/` |
| Task plan and decisions | `research/PLAN_TASKS.md` |
| Reproduction guide | `research/REPRODUCE.md` |
| Annotation materials | `research/datasets/annotation/` |
