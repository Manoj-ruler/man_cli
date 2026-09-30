# Progress log

## Status

| Phase | Tasks | Done | Blocked |
|---|---|---|---|
| 0 State verification | VERIFY-01 to 04 | 2 | 0 |
| 1 Contribution | PAPER-01 to 08, TRACE-01 | 8 (PAPER-07 is the author's) | 0 |
| 2 E1 protocol | E1-01 to 09 | 2 | 0 |
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
- **Committed:** in `8c5dcd5`, with the task files, at the author's instruction.

### TRACE-01: Register the Conclusion, Limitations and Ethics numbers (DONE 2026-09-30)

- **What changed:** `research/experiments/trace_claims.js` and the regenerated
  `research/paper/CLAIMS_TRACE.md`. `content.tex`, the results, the freeze and the benchmarks are
  untouched.
  1. **9 new snippets with 23 numbers:**
     - Conclusion: 2 snippets, 9 numbers.
     - Limitations: 7 snippets, 14 numbers. Two further Limitations numbers (3 and 4) were already
       registered.
     - Every source is the same result field or computation the earlier duplicate entries use.
  2. **A permanent coverage check.** For §6 Discussion, §7 Conclusion, Limitations and Ethical
     Considerations, it extracts every numeral (identifiers such as v0.1, A4 or TA-B145 and number
     words are excluded). Each numeral must be registered at that location or be a listed design
     constant; the only one is the fold seed 42. Anything unregistered fails the trace.
  3. **The header's coverage line** now reads: Abstract, §1–§5, §6 Discussion (no numerals), §7
     Conclusion, Limitations, Ethical Considerations, the tables and the appendix text. It also
     prints the automatic check's counts.
- **Acceptance criteria:**
  1. Every numeral in the three sections is registered or a stated constant: Conclusion **9/9**,
     Limitations **17/17** (16 registered, plus the seed 42), Ethics 0 numerals: **pass**.
  2. Trace **0 problems**; counts went from 176 snippets and 475 numbers to **185 snippets and 498
     numbers** (+9 and +23): **pass**.
  3. No change to `content.tex`, any result, the freeze or the benchmarks. `git status` lists only
     `trace_claims.js` and `CLAIMS_TRACE.md`: **pass**.
  4. `CLAIMS_TRACE.md` shows the new rows, the updated coverage line and the automatic-check line:
     **pass**.
- **Negative test:** changing "one fusion rule" to "1 fusion rule" in Limitations made the trace fail
  ("1 problem(s)"). `content.tex` was then restored from a copy and the trace was back to 0 problems;
  git confirms `content.tex` is unmodified.
- **Values:** every new row recomputes to the value printed in the paper, for example κ 0.6316 → 0.63
  and the interval end 1 → 1.00.
- **Correction during the task:** I first wrote the coverage line as "§1–§6 (including the
  Conclusion)", assuming the Conclusion was §6. The section list shows **§6 Discussion** (lines
  347–361) and **§7 Conclusion**. I checked Discussion: it contains **no numerals**, so the paper's
  "every reported number" claim is not affected. I then added Discussion to the automatic check and
  corrected the line before completing the task.
- **Committed:** in `d1a90f6`.
- **Result for ISSUE-01:** resolved. Contribution 3's "a trace from every reported number to its
  result file" is now backed by the trace for every numeral in the body, Limitations and Ethics.
  Number words ("Two items") remain unchecked, as they always were; the header states this.

### PAPER-03: Novelty wording bounded by the literature search (DONE 2026-09-30)

- **Search.** I searched `content.tex` for first, novel, unique, only, no prior, "to our knowledge",
  new, gap, unexplored, has not been, never been, and similar words.
  - There were **26 hits outside comments.** Only **2** were novelty claims, and both were already
    qualified: §2, lines 87–89, and the Limitations "Literature" bullet. The other 24 are ordinary
    uses ("only 10 queries", "the new queries", "novelty criteria" for the query drafts, "misses the
    first two", …).
  - The paper contained no "first" claim, no "no prior work" and no unqualified "novel" **before**
    the edit.
  - The one inconsistency: the §2 sentence counted "tie-aware selective prediction" as new, while
    PAPER-02 now calls these measures established.
- **Author's decision:** "A with b".
  - **A:** the §2 sentence now places the novelty in the audit of the confidence a released tool
    shows and in the attribution of three remedies (recalibration, a tuned threshold, a hybrid). It
    keeps "within our targeted search", "to our knowledge" and "not any single method", and the
    narrow scope ("retrieval work"). It grew from 42 to 55 words.
  - **(b):** the Limitations "Literature" bullet now says "…out-of-scope detection), last updated in
    September 2026;".
- **What changed:**
  - `content.tex`: diff hunks at §2 (lines 87–90) and the Limitations bullet (lines 406–407).
  - The rebuilt PDFs.
  - `trace_claims.js`: one new registration, "last updated in September 2026". The year is
    recomputed from the latest documented search date: `references.bib` "verified 2026-09-28"
    (fresh-search section) and `PHASE14_LITERATURE_RECHECK.md` (2026-09-14). The entry fails
    unless the latest date is in September 2026.
  - The regenerated `CLAIMS_TRACE.md`.
- **Acceptance criteria:**
  1. No unqualified "first", "novel" or "no prior work". The remaining hits (lines 124, 130, 383,
     406) are ordinary uses or the qualified Limitations sentence: **pass**.
  2. Every gap claim points to the documented search: §2 says "Within our targeted search
     (Limitations)", and the Limitations bullet names the search scope and now its date: **pass**.
  3. Trace **186 snippets, 499 numbers, 0 problems**. The coverage check counts Limitations at 18
     numerals, 0 unregistered. Build exit 0; the body ends on **page 7** in both PDFs; 0 overfull
     boxes; 0 undefined references: **pass**.
  4. Abstract not touched, still 199 words: **pass**.
  5. The author approved the text: **pass**.
- **Rendering.**
  - In the camera-ready PDF, the §2 sentence and the dated Limitations bullet appear as written.
  - In the review PDF, the date is present but hyphenated ("de- tection") and interleaved with the
    reference column in the text extraction. It is a layout artefact, not a content difference.
- **Committed:** in `da00504`.

### PAPER-08: The abstract's 86% gets its version; ISSUE-03 handled here (DONE 2026-09-30)

- **Author's decisions:** handle ISSUE-03 in this task; the draft is approved as shown, with "(AI-assigned
  labels)".
- **What changed:** `content.tex`, Abstract only (diff hunks at lines 12, 14, 17–18 and 20), plus the
  rebuilt PDFs. The four edits:

  | ID | Before | After | Words |
  |---|---|---|---|
  | c | "wrong answers average 86% confidence." | "…86% confidence (v0.1)." | +1 |
  | d (ISSUE-03) | "…everyday, not computing, ones;" | "…ones (AI-assigned labels);" | +2 |
  | t1 | "shows its user a confidence" | "shows users a confidence" | −1 |
  | t2 | "a rejection threshold on the shipped score, tuned by cross-validation, rejects" | "a cross-validated rejection threshold on the shipped score rejects" | −2 |

  No claim or number was dropped.
- **Acceptance criteria:**
  1. The abstract states which version the 86% refers to: "(v0.1)", matching Contribution 1:
     **pass**.
  2. Abstract ≤ 200 words: it has **199** (unchanged count, same rule as before): **pass**.
  3. Trace **186 snippets, 499 numbers, 0 problems**, with all 8 registered abstract snippets still
     matching, so no trace edit was needed. Build exit 0; the body ends on **page 7** in both PDFs;
     0 overfull boxes; 0 undefined references: **pass**.
  4. Only the abstract, the PDFs and the task files changed; no trace entry was needed: **pass**.
  5. The author approved the text: **pass**.
- **Verification details:**
  - The applied abstract equals the approved draft byte for byte (scratchpad `paper08_check.js`).
  - The camera-ready PDF contains all four changes, and the old "tuned by cross-validation" is gone.
  - The review PDF also contains all four. Its text layer interleaves carriage returns and the
    review-mode margin line numbers, for example "(AI-assigned^M 022^M labels)" and "a cross-^M
    016^M validated rejection threshold". That is a layout artefact, confirmed by printing the raw
    context around each change.
- **Result:** ISSUE-02 (the abstract part) and ISSUE-03 are resolved.
- **Note for later:** the abstract has 1 word of headroom again. The label-study drafter's abstract
  sentence (`draft_label_study_update.js`) was measured on the old abstract, so re-run it after the
  study; it reports the word count.
- **Committed:** in `acfe3a9`.

### PAPER-05: Limitations and threats-to-validity checklist (DONE 2026-09-30)

**Checklist.** Line numbers refer to `content.tex` before the edit.

| # | Threat | Status before | Where stated | Action |
|---|---|---|---|---|
| 1 | OOD screening bias | present | Limitations l. 395; abstract l. 20 | none |
| 2 | Detector features chosen on the full data | present | Limitations ll. 396–397 | none |
| 3 | Repository corpus vs released corpus | present | Limitations ll. 398–399; §1 ll. 42–44; §3; Ethics | none |
| 4 | The author audits their own tool | partial: the fact is in §1 l. 41, but not named as a threat | — | **added** a sentence to the benchmark bullet |
| 5 | Exploratory status | present | Limitations ll. 390–393; abstract | none |
| 6 | POSIX-only gold answers | present | Limitations ll. 387–389 | none |
| 7 | Exact-match scoring | present | Limitations l. 400; functional-check limits l. 403 | none |
| 8 | No LLM baseline, and why | partial: the absence is stated (l. 401; §2 ll. 76–77), not the reason | — | **added** the reason to the Scope bullet |
| 9 | ISSUE-04: "7--8 discordant queries" | inaccurate: it holds only against BM25 | l. 392 | **reworded**, with the trace updated |

- **Author's decisions:** "approve all". Item 8 was then held, because the approved "natural-language-to-**shell**" was broader than §3's "natural-language-to-**Bash**" and possibly false (see ISSUE-05). The author chose option **(a)**: match §3.
- **What changed:**
  - `content.tex`, Limitations only (diff hunks at 389–391, 394 and 403–404).
  - `trace_claims.js`: the ISSUE-04 entry now registers 7, 8, **12 and 17**. The last two are
    computed as `a_only_correct + b_only_correct` from `phase1_t1…json :: comparisons.dense_to_hybrid`.
  - The regenerated `CLAIMS_TRACE.md`.
  - The rebuilt PDFs.
- **The applied text:**
  - Item 4: "The tool, its corpus and the benchmark were built by the same people, so queries may
    follow the corpus's phrasing more closely than users' would; we exclude verbatim copies of corpus
    intents, but milder overlap may remain."
  - Item 8: "No generative system or user study is evaluated, since our question is the shipped
    retriever's confidence, and public natural-language-to-Bash benchmarks target Linux rather than
    this Windows corpus."
  - Item 9: "Accuracy tests rest on 7--8 discordant queries against BM25 and 12--17 against dense."
- **Acceptance criteria:**
  1. The checklist above lists every threat with its line, or marks it partial or inaccurate:
     **pass**.
  2. Only the partial and inaccurate items got edits, and ISSUE-04 is resolved: **pass**.
  3. Trace **186 snippets, 501 numbers, 0 problems**; the coverage check counts Limitations at 20
     numerals, 0 unregistered. Build exit 0; the body ends on **page 7** in both PDFs; 0 overfull
     boxes; 0 undefined references: **pass**.
  4. The author approved the text: **pass**.
  - The abstract is unchanged: 199 words.
- **Rendering:** the camera-ready PDF text contains all three sentences.
- **Result:** ISSUE-04 resolved; ISSUE-05 recorded.
- **Committed:** in `8ee7a21`.

### PAPER-04: Lead with the attribution result (DONE 2026-09-30)

- **Finding.** The attribution result was already stated in the Introduction (Contribution 2,
  directly after the research question) and in §6 Discussion ("the three problems separate cleanly…
  needed a better threshold, not a new retriever"). Only the §7 **Conclusion** lacked the synthesis:
  it listed the findings one by one.
- **Author's decision:** "A". This is one lead sentence in the Conclusion; the Introduction is
  unchanged (option B, not recommended as redundant, was not chosen).
- **What changed:** `content.tex`, one diff hunk (Conclusion, line 365); the rebuilt PDFs; the
  regenerated `CLAIMS_TRACE.md`, with no entry change.
- **The applied text:** "On our benchmark, the three reliability problems of a shipped closed-set
  retriever had three different remedies, and a better retriever was not the remedy for out-of-scope
  requests."
- **Acceptance criteria:**
  1. The sentence has no numbers. Its evidence is already registered: the §5 AUROC 0.956 vs 0.889,
     and the Conclusion's 46 vs 34 of 50. Trace **186 snippets, 501 numbers, 0 problems**; the
     coverage check counts the Conclusion at 9 numerals, 0 unregistered: **pass**.
  2. Build exit 0; the body ends on **page 7** in both PDFs; 0 overfull boxes; 0 undefined
     references: **pass**.
  3. No new claim beyond `CLAIM_EVIDENCE_MAP.md`. It restates C2c and K3; the scope is bounded by
     "on our benchmark" and the past tense; the screening caveat is carried by the next sentences
     (12 vs 9 of the 15 unscreened queries; 20 vs 11 refused): **pass**.
  4. The author approved the text: **pass**.
  - The abstract is unchanged: 199 words. The camera-ready PDF shows the sentence as written.
- **Committed:** in `29ee6c3`.

### PAPER-01: Review the research question (DONE 2026-09-30, decision: keep, no edit)

- **The question** (`content.tex` lines 46–48): "how reliable is the confidence of a shipped
  closed-set command retriever, and what do post-hoc recalibration, a tuned rejection threshold, and
  a hybrid lexical–dense retriever each contribute?"
- **Mapping to the paper:**

  | The question asks | §4 "What is compared" | Answered in §5 | And in §6/§7 |
  |---|---|---|---|
  | how reliable is the shipped confidence | the shipped confidence | "The shipped confidence"; "Risky wrong answers" | Conclusion: "no better than a constant forecaster" |
  | recalibration | (i) before and after post-hoc recalibration | "Recalibration" | "recalibration fixes most of that"; Contribution 2 "largely corrects" |
  | tuned rejection threshold | (ii) three out-of-scope rules | "Out-of-scope requests" | 46 vs 34 of 50; 20 vs 11 of 134 |
  | hybrid lexical–dense retriever | (iii) three retrievers; the hybrid's detector | "What the hybrid adds" | "mainly improves how confidence ranks its own errors" |

- **Acceptance criteria:**
  1. The question names exactly the three levers the paper evaluates: **pass**.
  2. Nothing it asks is left unanswered by §5–§7: **pass**.
  3. There was no edit, so the trace, build and approval conditions do not apply.
  4. The decision is recorded here: **pass**.
- **Consistency with the edits since VERIFY-02** (PAPER-02 "largely corrects"; PAPER-04's attribution
  lead): the question is neutral ("each contribute") and does not conflict with either. The secondary
  analyses (ambiguity detection, A4/A5, Split B, the functional check) sit outside the question, in
  the Appendix and Limitations, which is appropriate.
- **Author:** the recommendation is "keep". The author may override it; no paper file changed.
- **Committed:** in `74f674b`.

### PAPER-06: Phase 1 gate and mentorship snapshot (DONE 2026-09-30)

- **Start state:** `research/improvement` at `74f674b`, the same as origin; clean tree.
- **Checks against the VERIFY-01 baseline:**

  | Check | VERIFY-01 (`c3b9f40`) | PAPER-06 (`74f674b`) | Explanation |
  |---|---|---|---|
  | Freeze inputs | 27/27 | **27/27** | unchanged |
  | Claim trace | 176 snippets, 475 numbers, 0 problems | **186 snippets, 501 numbers, 0 problems** | TRACE-01 (+9 snippets, +23 numbers), PAPER-03 (+1, "2026"), PAPER-05 (+2, "12", "17") |
  | Tests | 24/24 | **24/24** | unchanged |
  | Body end (both PDFs) | page 7 | **page 7** | unchanged; about one page of headroom remains for E1 |
  | Total pages | 13 / 13 | **14 (camera-ready) / 13 (review)** | The PAPER-05 Limitations additions push the camera-ready end matter (Limitations, Ethics, Acknowledgements, references, appendix) past a page break. These sections do not count toward the 8-page limit. |
  | Overfull boxes / undefined references | 0 / 0 | **0 / 0** | unchanged |
  | BibTeX warnings | not checked | **0** | `.blg` line "warning$ -- 0" is the function's usage count, meaning none were issued |
  | Abstract | 199 words | **199 words** | PAPER-08 was word-neutral |

- **Anonymity scan** (`main_review.pdf`, the committed file):
  - It checks 15 case-insensitive strings: termassist, man-cli, man_cli, manoj, manoj-ruler, @manoj,
    gaddam, gmail, srkr, claude, antigravity, github.com, vercel, npmjs, acknowledg.
  - Both pdftotext modes are searched, raw and layout, after removing CR/NUL, the review margin
    line numbers and line-break hyphens.
  - **Review PDF: 0 hits for all 15. Its metadata** (Title, Author, Subject, Keywords) **is empty.**
  - "npm": 0 in the review PDF, which uses "a publicly released package"; 1 in the camera-ready.
  - **Positive control:** the same scan on the camera-ready `main.pdf` finds termassist 3, gaddam 8,
    claude 24, acknowledg 4, and more, so the method can detect the strings. **PASS.**
  - **Correction during the task:** my first scan used grep on text joined into a single line. It
    returned 0 everywhere, **including the control**. Cause: an invalidly encoded character (an en
    dash) on that one line made grep in a UTF-8 locale match nothing. That result was discarded and
    replaced by a Node scan (scratchpad `anon_scan.js`), which passes the control.
- **Snapshot for the mentorship submission (PAPER-07):**
  - Branch `research/improvement`. The paper content was last changed in **`29ee6c3`**; the task-log
    commits since then touch no paper file.
  - **`research/paper/acl_latex/main_review.pdf`**, SHA-256 prefix **`7c129b946bcd928b`**. This is
    the file to submit.
- **Acceptance criteria:**
  1. Freeze 27/27, trace 0, tests 24/24, build OK (page 7, 0 overfull), abstract 199: **pass**.
  2. The review PDF has none of the identifying strings, with a valid positive control; the scan
     output is recorded above: **pass**.
  3. Every difference from VERIFY-01 is explained (table above): **pass**.
  4. The snapshot is pushed and recorded (this commit): **pass**.
- **Nothing in the paper, code, results or freeze changed.** The build's timestamp-only PDF changes
  were restored with `git checkout --`, and the tree was clean afterwards.
- **Proposed for later (not done):** add the anonymity scan with its positive control to the
  repository as a reusable check for FINAL-02. For now it lives only in the session scratchpad.
- **Committed:** in `2d19b33`.

### E1-01: CLINC150 source, access and licence (DONE 2026-09-30)

- **Source record:** `research/publication_tasks/e1/E1_DATA_SOURCE.md`.
  - **Paper:** checked on the ACL Anthology (D19-1131): 11 authors, EMNLP-IJCNLP 2019,
    pp. 1311–1316. It matches `references.bib`.
  - **Official release:** `github.com/clinc/oos-eval`, pinned to commit `828f809…` (2021-06-01).
  - **Licence:** **CC BY 3.0 Unported**, from the LICENSE text. The GitHub API only says "Other".
  - **Variants and sizes:** taken from the paper's §2–§3 and from the repository metadata.
- **Download (D5, the author's approval):** `data_full.json` and `domains.json` are now in
  `research/data_external/clinc150/`, and **committed** as the author chose.
  - Sizes 2,495,390 and 3,818 bytes. The **git blob SHA-1 values equal GitHub's**
    (`7a7b26c5…`, `60a74358…`), so the files are byte-identical to upstream.
  - SHA-256 `36923c37…` and `b947b579…`, recorded in `PROVENANCE.md` with the CC BY 3.0
    attribution.
  - `.gitattributes` (`* -text`) keeps the LF files byte-exact under `core.autocrlf`.
- **Structure check:** train/val/test = 15,000 / 3,000 / 4,500 over 150 intents; oos
  train/val/test = 100 / 100 / 1,000; entries are `[text, label]`. This matches the paper.
  `domains.json` covers exactly the 150 intents (10 domains, no missing, extra or repeated intent).
- **Acceptance criteria:**
  1. The source URL, licence, variants, split sizes and download size are recorded with evidence
     links: **pass**.
  2. The author's download decision is recorded (D5): **pass**.
  3. No E1 result exists: nothing was scored, and gate G-E1 still holds: **pass**.
- **Findings passed on to E1-02 and E1-03:**
  - CLINC's "out-of-scope" is relative to its own 150 intents, so most of its in-scope requests are
    also out of scope for a shell tool.
  - The `oos` split has no classes, so a class-level exclusion rule cannot filter it.
  - `domains.json` is a contributor file: its coverage is verified, but not each assignment.
- **Session note (not a project issue):** the Bash tool lost its PATH during this task (even `ls`
  and `git` were "not found"), after several "no verdict" safety-check failures. The download and
  the checks were done in PowerShell instead.
- **Committed:** in `6bba840`.

### E1-02: E1 question and scope (DONE 2026-09-30)

- **Deliverable:** `research/publication_tasks/e1/E1_PROTOCOL.md` §1–§2, **approved by the author**.
  - §1: the question, and the three rules R1–R3 with their frozen v0.2 thresholds.
  - §2.1: the population (D4 = c).
  - §2.2: the unit of analysis. P1 intervals must come from a **cluster bootstrap over intents**,
    because the 30 queries in each intent are correlated.
  - §2.3: what E1 can show.
  - §2.4: what E1 **cannot** show:
    1. terminal-task OOD;
    2. the cost in refused legitimate queries (CLINC has no in-scope shell queries, so E1 must be
       read with v0.2's false rejections: 20/134, 11/134, 0/134);
    3. v0.2.1;
    4. real users, or languages other than English;
    5. calibration or accuracy.
  - §2.5: the thresholds are frozen from v0.2 (D7 = yes).
  - §2.6: the E1 integrity rules.
- **Acceptance criteria:**
  1. The scope lists at least the three required "cannot show" items; it lists five: **pass**.
  2. The author approved the scope: **pass**.
  - Nothing has been scored, and gate G-E1 holds.
- **Values used:**
  - the thresholds (6.4952 ×4 and 7.1978; 0.9179, 0.9219, 0.8841, 0.9247 and 0.9219; α = 0.5),
    read during planning from the committed result files and to be formally verified in E1-04;
  - the false-rejection counts, from freeze §6.

## Decisions

| ID | Decision | Date | By |
|---|---|---|---|
| D1 | The plan is approved and executed task by task, starting with VERIFY-01 | 2026-09-30 | author |
| D8 (PAPER-02) | Contributions text: Option A with (b) and (c) | 2026-09-30 | author |
| — | TRACE-01 (P0) and PAPER-08 (P1) are added to `TASKS.md` | 2026-09-30 | author |
| — | Commit now: the task files, the PAPER-02 edit and the rebuilt PDFs | 2026-09-30 | author |
| — | ISSUE-03 is handled in PAPER-08 (the abstract) | 2026-09-30 | author |
| — | ISSUE-04 is folded into PAPER-05 (added as checklist item 9 in `TASKS.md`) | 2026-09-30 | author |
| — | PAPER-05 item 8: option (a), "natural-language-to-Bash" to match §3 | 2026-09-30 | author |
| — | LIT-01 (P2, ISSUE-05) is added to `TASKS.md` (Phase 5, before FINAL-03) | 2026-09-30 | author |
| D5 | Download CLINC150 `data_full.json` and `domains.json`, pinned to commit 828f809, now, for use in E1-03's class review; **commit them to the repository** | 2026-09-30 | author ("approve download, commit it") |
| D4 | E1 population: **both CLINC test sets, reported separately, never pooled**. P1 = `test` (4,500, 150 intents; primary; class-level exclusions); P2 = `oos_test` (1,000; secondary; kept whole). The train and val splits are not used. | 2026-09-30 | author |
| D7 | E1 uses the **frozen v0.2 thresholds**, even if the final paper reports v0.2.1 | 2026-09-30 | author |

## Issues

| ID | Found in | Issue | Evidence | Blocks? | Proposed task |
|---|---|---|---|---|---|
| ISSUE-05 | PAPER-05 | Possible related-work gap. A web search during Stage 4.5 (2026-09-29, the D1 originality check) returned an arXiv paper titled "Execution-Based Evaluation of Natural Language to Bash and PowerShell for Incident Remediation" (arXiv 2405.06807). It is **unverified**: I have not read or checked it, and the paper does not cite it. If it is real and relevant, it is a public NL-to-**PowerShell** benchmark, which a reviewer may expect in §2 given the tool's Windows corpus. It does **not** contradict §3's or the Limitations' "natural-language-to-**Bash** benchmarks target Linux". | the Stage 4.5 web-search result list, 2026-09-29 (in the session record) | No: the current wording is accurate. It is a completeness risk. | **LIT-01 (P2):** verify arXiv 2405.06807 against its primary record (authors, venue, content). If it holds, decide with the author whether to cite it in §2, and whether its PowerShell data could serve any purpose. That would be a new dataset, which needs approval under the plan's rules. Run it before FINAL-03. |
| ISSUE-04 (RESOLVED by PAPER-05, 2026-09-30) | TRACE-01 | Limitations says "Accuracy tests rest on 7--8 discordant queries". That is true for **hybrid vs BM25** (0+7 on v0.1, 1+7 on v0.2) but **not** for hybrid vs dense, which rests on 3+9 = 12 (v0.1) and 3+14 = 17 (v0.2), per freeze §4. The sentence generalises. | `phase1_t1_controls_excluded.json` comparisons; freeze §4 table | No: it concerns the wording only, and the registered values are correct for hybrid vs BM25 | Fold into **PAPER-05** (the Limitations checklist), for example "Accuracy tests against BM25 rest on 7–8 discordant queries (against dense, 12–17)". Once reworded, the trace entry must be updated. |
| ISSUE-01 (RESOLVED by TRACE-01, 2026-09-30; had been escalated to P0 by PAPER-02) | VERIFY-02 | The claim trace does not cover the **Conclusion**. Its stated coverage is "Abstract, §1–§5, Tables 1–3, Appendix A, Appendix B". The Conclusion's 9 numbers (46, 34, 50, 12, 9, 15, 20, 11, 134) are unregistered, and so are most Limitations numbers (only the POSIX counts 3 and 4 are). All 9 Conclusion numbers were checked by hand against `review_r1_e_ood_operating_points.json` today and are **correct**. | `paper/CLAIMS_TRACE.md` header; no "Conclusion" location in the trace; grep of `trace_claims.js` | No. It is a process gap: a future edit could drift unnoticed. It matters for FINAL-01. | **TRACE-01 (P1, code):** register the Conclusion, Limitations and Ethics numbers in `trace_claims.js` and extend its coverage line. Do it before PAPER-06, so that the Phase 1 edits are checked. Needs approval to be added to the backlog. |
| ISSUE-02 | VERIFY-02 | "Wrong answers average 86% confidence" (Abstract; Contribution 1) is **v0.1 only**; the sentence gives no version. On v0.2 the value is 79.50. | Trace entry "Abstract; §1 C1 = 86" (v0.1 source); a new computation from `results/v0.2/reproduction-results.json` | No, but it is an accuracy-of-wording risk a reviewer could catch | **PAPER-08 (P1, paper):** add the version to the 86% in the Abstract and in Contribution 1, or give both values. The abstract has **1 word** of headroom (VERIFY-01), so the fix must trim elsewhere. If 79.50 is quoted, it must be registered in the trace. Could be folded into PAPER-02 (Contribution 1) plus an abstract edit. Needs approval. |
| ISSUE-03 | VERIFY-02 | The abstract's "Most out-of-scope requests are everyday" rests on **AI-assigned, unchecked** kind labels (34/50). Body §5 says so; the abstract does not. | Freeze §6 ("Kind labels were assigned by an AI assistant and are unchecked"); abstract line 20 | No | **P2.** Add it to the PAPER-05 limitations checklist, or rely on the body disclosure given the abstract's word budget. It is the author's call. |

## Deviations (E1)

*(none; E1 protocol not yet frozen)*

## Next

- **Author action:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256 prefix
  `7c129b946bcd928b`) to the EACL 2027 SRW mentorship programme by **Nov 6**, and tell Claude when it
  is done, so it can be recorded.
- **Recommended Claude task:** E1-04 (verify the frozen v0.2 thresholds and how they were derived;
  decision D2). It is independent, and E1-07 needs D2.
- **Or:** E1-03 (P1 class exclusions from intent names and examples only; decision D3). It depends
  on E1-02, which is done.
- Both are P0.
- **Phase 1 is complete** apart from the author's submission.
- **E1-01 and E1-04** are unblocked in parallel.
- **LIT-01** (P2) is in the backlog.

Waiting for the author's instruction.
