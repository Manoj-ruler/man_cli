# Progress log

## Status

| Phase | Tasks | Done | Blocked |
|---|---|---|---|
| 0 State verification | VERIFY-01 to 04 | 2 | 0 |
| 1 Contribution | PAPER-01 to 08, TRACE-01 | 8 (PAPER-07 is the author's) | 0 |
| 2 E1 protocol | E1-01 to 09, plus E1-07b and E1-07c | 11 (**complete**; frozen at `e1-protocol-v1`) | 0 |
| 3 E1 execution | E1-10 to 14 | 4 | 0 |
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
- **Committed:** in `4e115db`.

### E1-04: Verify the frozen v0.2 thresholds and how they were derived (DONE 2026-09-30)

- **Deliverable:** `research/publication_tasks/e1/E1_THRESHOLDS.md`. The protocol gains §4 and an
  amended §1.
- **Values** (each read from its source field, then **re-derived** from the committed per-query data
  with the same selection logic; scratchpad `e1_04_thresholds.js`):
  - **R2:** 6.4952 (folds 0, 1, 2, 4; the score of TA-B053) and 7.1978 (fold 3; TA-B051). Dev F1
    0.7912 to 0.8409. The exact thresholds reject **46/50**, as frozen.
  - **R3:** 0.9179, 0.9219, 0.8841, 0.9247 and 0.9219. All re-select identically.
  - α = 0.5 in all folds; folds: k = 5, seed 42.
- **Derivation, confirmed in code:**
  - candidates are the distinct development-fold scores;
  - predict out-of-scope iff score < t;
  - maximise F1, with ties to the lowest t;
  - apply once per test fold.
  - Sources: `review_r1_e_ood_operating_points.js:76–88`; `run_selective_prediction_v0_2.js:39–54`.
- **Scales:**
  - R2's field `…raw_bm25` is really the **shipped score s including the +15 bonus** (`:80`). The
    name is misleading; the paper's wording is correct.
  - s and the fused score were stored, tuned and applied **rounded to 4 decimals**
    (`reproduce_baseline_v0_2.js:60`; `build_candidates_v0_2.js:54`).
  - R1 uses the unrounded live values (`:44`).
- **Acceptance criteria:**
  1. The values match the files exactly: **pass**, and they also re-derive exactly.
  2. The scales are confirmed from code with file and line numbers: **pass**.
  3. Decision D2 is recorded: **(a)**: **pass**.
  4. No result file changed (`git status` showed only task files): **pass**.
- **New issue, ISSUE-06, resolved by the author's decision (option 1).** The approved §1 said that R1
  (s < 2.0) is "equivalently" the CLI's 30% rule. In fact the CLI refuses iff **s < 2.36**; the two
  agree only because no benchmark query scores in [2.0, 2.36).
  - The §1 wording is amended, and the amendment recorded in the protocol.
  - R1-CLI is added as a secondary line, and the count of CLINC queries in [2.0, 2.36) will be
    reported.
- **Committed:** in `6ed2506`.

### E1-03: P1 exclusion rules, decided before any scoring (DONE 2026-09-30)

- **Deliverables:** `research/publication_tasks/e1/E1_EXCLUSIONS.md` and `E1_PROTOCOL.md` §3.
- **What was looked at:**
  - the 150 intent names by domain;
  - 4 **train-split** examples for each of 43 candidate intents;
  - the Windows-visible corpus (its intents, descriptions and commands);
  - the codebook's and design doc's OOD definition;
  - CLINC Table 1.
- **Not looked at:** any `test` or `oos_test` query; any system output. Nothing was run or scored.
- **Finding:** no Windows-visible corpus record performs any CLINC intent's typical request. The
  near-misses are documented, for example:
  - `Get-Date` appears only inside uptime and modified-files commands;
  - `Get-Volume` is about disk volumes;
  - `Start-Sleep` appears only in a repeat loop;
  - the only random record makes a password.
- **Author's decision (D3):** Rule A, with 0 exclusions (P1 = 4,500 queries, 150 intents), plus
  subgroup S (6 clear and 7 borderline intents), reported descriptively with a planned sensitivity
  check.
- **Acceptance criteria:**
  1. Every excluded class has a written reason. There are none; every candidate's non-performance
     is documented. There are no per-query exclusions: **pass**.
  2. A log states what was and was not consulted, including that no system output was: **pass**.
  3. The author approved the rules (D3): **pass**.
- **Domain map:** all 10 of Table 1's pairs match `domains.json`; the extracted table was
  re-aligned by one row. The full supplementary list was not checked, as it would need another
  download. The map only groups results for description.
- **Note on the plan's wording:** the plan asked to exclude requests "that may have a legitimate
  shell answer". The benchmark's own codebook instead defines OOD as "the list cannot perform this,
  not a shell cannot" (W9). The author chose to follow the codebook, so that E1 is comparable with
  v0.2. The shell-answerable requests are made visible through subgroup S rather than excluded.
- **Committed:** in `08b8d56`.

### E1-05: can external queries be scored exactly like the frozen pipeline? (DONE 2026-09-30)

- **Deliverable:** `research/publication_tasks/e1/E1_SCORING_DESIGN.md`. `E1_PROTOCOL.md` §5 now
  points to it.
- **Method:** code reading, plus one read-only fact check (scratchpad `e1_05_facts.js`) over
  committed files. `check_model_cache.js` was run in verify mode.
  - **No scorer was written, nothing was scored, no CLINC data was read, and no model was run.**
- **Answer: yes.**
  - s (for R1, R1-CLI and R2) comes from the shipped `cli/search.js` `search()`.
  - The fused top-1 score (R3) comes from `lexicalSearchAll`, `denseSearch` and `fuseQuery`, with
    α = 0.5.
  - Both depend only on the query text, the platform and four pinned inputs. No benchmark-only
    field affects a score, and α = 0.5 in all five folds.
- **Checked today:**
  - the cached lexical top-1, rounded to 4 dp, matches the reproduction's s on **209/209** queries;
  - the lexical index holds 280 records (279 corpus records + 1 packaged snippet, as the paper
    discloses), and the dense list 279;
  - no Windows-visible command string is duplicated;
  - the model cache is OK.
- **New observations** (recorded in the design, §4):
  - **Risk 3, the empty-token divergence.** For a query with no tokens left, `search()` returns
    s = 0, but `lexicalSearchAll` has no such guard. This never occurred on v0.2 (0 queries).
    Pre-specified handling is proposed for E1-07.
  - **The zero-overlap property** (code-derived, not an E1 outcome). A query sharing no token with
    any record, and firing no bonus, has s = 0, and its fused top-1 score is 0.5. Every rule
    therefore rejects it: 0.5 is below every R3 threshold, the lowest of which is 0.8841.
    **The rules can differ only on queries with some lexical overlap.** On v0.2, 17 of 209 queries
    had all-equal lexical scores.
    - **Recommendation for E1-07:** report the zero-overlap count, and compare the rules on the
      overlap subset as well.
  - **ISSUE-07** (see Issues).
- **Acceptance criteria:**
  1. A written data flow with file:line references (design §1–§2): **pass**.
  2. The risks are named: min-max normalisation, candidate-set size, α, 4-dp rounding, the model
     cache, the tokenizer, plus platform, side effects on import, size and the empty-token case
     (§4): **pass**.
  3. No code was written. The only script is the read-only fact check, kept in the scratchpad and
     not in the repository: **pass**.
- **Committed:** in `1d5a025`.

### E1-06: external-query scorer, proven on the benchmark only (DONE 2026-09-30)

- **Deliverable:** `research/experiments/e1_score_queries.js` (new), written to the specification in
  `E1_SCORING_DESIGN.md` §5.
  - **Modes:** `--guard`, `--edge`, and `--input <[{id,text}]>`; `--out` is required.
  - **It imports only** `cli/search.js` (read-only), `lexical_search.js`, `dense_search.js` and
    `hybrid_fusion.js`.
  - **It records scores only.** No rule decisions are made in this script.
- **Pre-flight checks** (the run aborts on any failure):
  - the platform is `win32`;
  - the SHA-256 of the three scoring inputs match (ISSUE-07);
  - `check_model_cache.js` passes (run as a child `node` process);
  - α = 0.5 in all five v0.2 folds;
  - remote model download is then disabled (`env.allowRemoteModels = false`).
- **Guard log** (`node research/experiments/e1_score_queries.js --guard --out <scratchpad>`, Node
  v24.2.0):
  - `preflight OK: win32, 3 input hashes, model cache, alpha 0.5/0.5/0.5/0.5/0.5`
  - **Required checks, all 0 mismatches out of 209** (tolerance 1e-9 after 4-dp rounding):
    - `s4` against `reproduction-results.json` `actual.score`;
    - `confidence` against `actual.confidence`;
    - `fused4` against `reliability_features.json` `top1_score`.
  - **Informative checks:**
    - the shipped top-1 command differs from the reproduction on 0 queries;
    - the hybrid top-1 command differs from `candidates.json` on 0 queries;
    - list lengths differ from the cache on 0 queries;
    - the maximum absolute difference against the v0.2 cache is **0** for the lexical scores, **0**
      for the dense cosines and **0** for the unrounded s. These are bit-identical.
    - 0 queries have no tokens; 17 have all-equal lexical scores. All 17 have `fused4` = 0.5,
      matching the zero-overlap property from E1-05.
  - **Result: `GUARD PASS`, exit 0.**
  - **The guard is not vacuous:** there are 82 distinct `fused4` values (range 0.5–1) and 176
    distinct `s4` values.
- **Synthetic edge cases** (`--edge`; never CLINC):

  | Input | Tokens | s (shipped) | Replica's lexical top-1 | All lexical scores equal | `fused4` |
  |---|---|---|---|---|---|
  | `""` | 0 | 0 (no command) | 15 | yes | 0.5 |
  | `"   "` | 0 | 0 (no command) | 15 | yes | 0.5 |
  | `"?!"` | 0 | 0 (no command) | 15 | yes | 0.5 |
  | `"how do i"` | 0 | 0 (no command) | 0 | yes | 0.5 |
  | `"the"` | 0 | 0 (no command) | 15 | **no** | **1** |
  | `"café"` | 1 (`caf`) | 0 | 0 | yes | 0.5 |

  - **New observation.** For a query made only of stop-words, the replica's substring bonus can fire
    on records whose intent contains the query string: "the" matches intents containing "the".
    R1, R1-CLI and R2 would then reject the query while R3 accepts it.
  - For the empty and punctuation-only strings, every record gets +15, so the lexical scores are
    all equal and R3 rejects, like the others.
  - **This is now noted in protocol §5. E1-07 must pre-specify** that such queries are counted and
    their decisions reported, before any scoring.
- **Acceptance criteria:**
  1. 0 mismatches on all 209 v0.2 queries for both scores (and for confidence): **pass**.
  2. The model cache check passes: **pass**.
  3. No CLINC input: the only inputs were the v0.2 benchmark and 6 synthetic strings: **pass**.
  4. No existing file changed. `git status` shows only the new script (before the task-file
     updates): **pass**.
- **Not exercised:** the pre-flight failure paths (a wrong platform, a changed input hash, a missing
  model). They are straightforward checks, but they have not been tested.
- **Committed:** in `189f830`.

### E1-07: analysis protocol, metrics and output specification (DONE 2026-09-30)

- **Deliverable:** `E1_PROTOCOL.md` §6, approved by the author ("D10 = a, approve §6, add
  E1-07b"). It covers:
  - 6.1, units and denominators;
  - 6.2, the decision rules;
  - 6.3, the primary outcome and its intervals;
  - 6.4, the primary comparison and multiplicity;
  - 6.5, the other pre-specified quantities;
  - 6.6, the expected directions;
  - 6.7, outputs;
  - 6.8, logical checks;
  - 6.9, the deviation policy.
- **Nothing was scored**, and no CLINC query or outcome was read.
- **The v0.2 reference values quoted in §6.5** come from
  `results/review_r1/review_r1_e_ood_operating_points.json` (`versions.v0.2`):
  - `committed_operating_points`: R1 17/50, R3 34/50;
  - `nested_tuned_baseline_threshold`: R2 46/50;
  - `rejections_by_source`: 4/12/9 of the 15 original, 13/34/25 of the 35 added;
  - `controls_excluded`: false rejections 0/20/11 of 134.

  The statistics helpers are in `phase1_common.js:63-99`, and the domain sizes (10 × 15 intents)
  come from `domains.json`.
- **A correction while drafting:** ED-3 was first written as an expectation. It was changed to a
  floor that holds by construction, since every rule rejects every lexical-null query.
- **Acceptance criteria:**
  1. Every metric is defined, with its denominators (§6.1–§6.5): **pass**.
  2. The output paths are new and versioned (`research/results/e1_clinc150_v1/`, §6.7): **pass**.
  3. The author approved the protocol (D10 = a): **pass**.
- **Committed:** in `7b8f4d6`.

### E1-07b: analysis code written and tested before the freeze (DONE 2026-09-30)

- **Deliverable:** `research/experiments/e1_analyze.js` (new).
  - It implements §6.2 (the rules), §6.3–§6.5 (every quantity) and §6.8 (the logical checks), using
    the `phase1_common.js` statistics: `wilson`, `exactMcNemar`, `mulberry32`, `percentile`.
  - It adds Holm step-down and an intent-cluster percentile bootstrap: B = 10,000, seed 42, with
    rates and paired differences taken from the same resamples.
  - It has stages `decisions` (E1-11) and `summary` (E1-13), and never overwrites a file.
- **Built-in checks on frozen inputs:**
  - It re-reads the R2 and R3 thresholds from the committed results, and the v0.2 reference counts
    (17/46/34 of 50; 4/12/9 of 15; 13/34/25 of 35; 0/20/11 of 134), and asserts they equal the
    protocol's values.
  - It aborts if they differ.
- **Tests:** scratchpad `e1_07b_test.js`, on **synthetic score files only**, with answers worked out
  by hand from the §6.2 rules. **61 passed, 0 failed.**
  - The first run found 3 failures, all in T7. The cause was a bug in the test harness: the
    script's argument parser takes the first `--expect-p1`, and the harness passed the default
    before the test's own value. The harness was fixed, and the script was not changed.

  | Test | What it covers | Result |
  |---|---|---|
  | T1 | Hand-computable data: P1 = 4 intents × 3 queries, P2 = 5 queries. Checks every §6 field: rates; the five-threshold counts (R2 7,7,7,9,7; R3 4,4,2,5,4); the median identity; the primary difference (3/12) and discordant counts; all 2×2 tables; R1 vs R1-CLI (2); ties (s = 2.0, s4 = 6.4952, fused4 = 0.9219, each 1); the no-token query (the "the" case: R1, R1-CLI and R2 reject, R3 accepts); the lexical-null query (all reject); the overlap subset; S-clear and S-borderline; both reduced sets; domains; P2 McNemar and Holm; Wilson; the v0.2 comparison; the manifest; all output files | pass |
  | T2 | The intent-cluster bootstrap re-implemented independently in the test (same RNG): R2 rate and primary-difference intervals identical | pass |
  | T3 | Holm on (0.01, 0.04, 0.03) gives (0.03, 0.06, 0.06) | pass |
  | T4 | A degenerate bootstrap (R2 and R3 reject every query) is flagged, and no reading is made | pass |
  | T5–T8b | Broken inputs are caught: R1 outside R1-CLI; lexical-null with fused4 ≠ 0.5; lexical-null with s ≠ 0; the wrong row count; a missing score; the wrong cluster structure. Each exits 1 and writes no summary. | pass |
  | T9 | A staged run (decisions, then summary) gives the same summary as a one-shot run; overwriting is refused (exit 2); tampered stored decisions are refused (exit 1) | pass |
  | T10 | Two runs are identical apart from timestamps | pass |

- **Protocol clarifications** (text only, before the freeze; §6.5 point 6 and §6.7):
  - the overlap-subset and reduced-set bootstraps resample only intents that have remaining
    queries;
  - how the stages and the `--synthetic` flag are used.
- **Acceptance criteria:**
  1. Every §6 quantity has an output field with its numerator and denominator (T1 exercises each):
     **pass**.
  2. The synthetic tests match their known answers: **pass**.
  3. The logical checks fail on the broken cases (T5–T8b): **pass**.
  4. No existing file changed. `git status` showed only the new script. No CLINC input and no E1
     output were used: **pass**.

### E1-07c: review fixes to the analysis code, before the freeze (DONE 2026-09-30)

- **Matched thresholds** (scratchpad `e1_07c_derive.js`, read-only), from v0.2's 159 in-scope
  queries only:
  - the three v0.2 OOD label sources agree (`reliability_features.is_ood`,
    `reproduction-results`, ablation A3);
  - **R2m: s4 < 5.4377.** It rejects 10 in-scope queries: two in-scope queries tie at the
    threshold, so it is 10, not 11. In-sample it rejects 37/50 OOD.
  - **R3m: fused4 < 0.9179.** It rejects 11 in-scope queries and 36/50 OOD, in-sample.
  - Both equal the committed in-sample sweep (`review_r1_e…json`,
    `in_sample_matched_false_rejection.detector_observed`: 37 at 10, 36 at 11).
  - They are recorded in protocol §6.2 and §6.4.
- **`e1_analyze.js` changes:**
  - `deriveMatched()` re-derives both thresholds from the committed files on every run. The run
    aborts if they differ from the recorded values, or if the counts differ from the committed
    sweep.
  - Per-query R2m and R3m decisions.
  - A `matched_operating_point` section per population:
    - rates, with Wilson intervals, and a cluster bootstrap on P1;
    - R2m − R3m on P1 with a paired cluster-bootstrap interval and the §6.4 reading;
    - R2m − R3m on P2 with exact McNemar, unadjusted;
    - labelled secondary, and **kept out of the P2 Holm family**.
  - The primary reading is reworded (ISSUE-10).
  - **C-1:** the recomputed R2 − R3 comparisons (reduced S sets, overlap subset) now carry
    "sensitivity (descriptive); not a primary result" and a neutral `interval_position`, with no
    reading.
  - The markdown output is updated. The bootstrap now takes the rule list as a parameter; the
    default behaviour is unchanged.
- **Tests** (scratchpad `e1_07b_test.js`, synthetic only): **80 passed, 0 failed.**
  - The 61 E1-07b checks re-ran unchanged, and all passed.
  - 19 new checks:
    - T11: matched rates and pairs on P1 and P2; the matched pair is not in the P2 Holm family;
      the derivation counts are recorded.
    - T12: the C-1 labels; no "lead holds" wording anywhere; the decisions carry the matched
      thresholds.
    - T13: ties exactly at both matched thresholds are not rejected, and rows separate the matched
      rules from the median rules.
    - T14: the derivation is clean from the committed files, and a wrong recorded threshold is
      caught.
- **Acceptance criteria:**
  1. The thresholds come from v0.2's in-scope scores only: **pass** (`deriveMatched` filters on
     `!is_ood` before sorting; the OOD counts are context).
  2. All tests pass (80/80): **pass**.
  3. No CLINC input: **pass**.
  4. No other existing file changed. `git status` showed only `e1_analyze.js`, before the task-file
     updates: **pass**.

- **Committed:** in `4829d57`.

### E1-08: protocol review for leakage, selection bias and ambiguity (DONE 2026-09-30)

- **Deliverable:** `e1/E1_PROTOCOL_REVIEW.md` (§1–§7).
- **First pass** (committed in `36bd901`):
  - checklist items 1–6 passed;
  - the denominators were verified from the labels only, with no CLINC text read;
  - item 7 found ISSUE-10, and the review raised ISSUE-09 and C-1;
  - text fixes T-1 to T-6 were applied.
- **Author's decisions (D11):** ISSUE-10 = (b), ISSUE-09 = (a), C-1 approved, and E1-07c added
  (now done).
- **Re-check (§7):**
  - **Item 5 passes.** There is one primary comparison. The P2 Holm family is exactly 3 pairs,
    with the matched pair outside it. The recomputed comparisons are labelled sensitivity, with no
    reading.
  - **Item 7 passes.** The operating points are named in every reading, and there is a matched
    comparison at equal cost with thresholds from in-scope queries only.
  - Two new text-only alignments were made:
    - T-7: §2.3 point 2 and the §6.4 lead sentence;
    - T-8: §6.5 points 2 and 6 now say the recomputed comparisons are labelled sensitivity.
  - **Residuals, disclosed rather than fixed:**
    - the matched costs are 10 vs 11, because of a tie, which slightly favours R3m;
    - the no-token asymmetry;
    - the sensitivity objects keep the JSON key `primary_comparison`, but their `label` field is
      authoritative. This is cosmetic.
- **Re-confirmed:** `research/results/e1_clinc150_v1/` does not exist. No CLINC text was read,
  and nothing was scored.
- **Acceptance criteria:** every checklist item is marked pass, or was fixed with the author's
  approval (D11): **pass**.
- **Committed:** in `db300d9`.

### E1-09: freeze the protocol, gate G-E1 (DONE 2026-09-30)

- **Author's approval (D6):** "Approve freeze, D9 = git tag only. Start E1-09". **D9 = the git tag
  only.**
- **Pre-freeze checks:**
  - the working tree was clean;
  - all 8 frozen files were tracked;
  - no `e1-*` tag existed;
  - `research/results/e1_clinc150_v1/` did not exist, and its git log was empty.
- **Freeze commit: `970c54f00536926fbfdf5712b028513454c600ca`.** The protocol status was set to
  FROZEN, naming the frozen set and the authoritative check.
- **Tag:** `e1-protocol-v1`, annotated (tag object `6e3bcd4f…`). It points to `970c54f`, and its
  message carries the hashes below.
- **Pushed:**
  - `git ls-remote --tags origin e1-protocol-v1` gives `6e3bcd4fd3ceaa43cb9c75fed9c371e5436a7786
    refs/tags/e1-protocol-v1`;
  - the remote branch is at `970c54f`.
- **Frozen files.** The SHA-256 values are LF-normalised and read from the commit's git objects
  (`core.autocrlf` is true, so the raw bytes of a checkout can differ):

  | SHA-256 | Git blob | File |
  |---|---|---|
  | `56a500a3a3145152ba14d3c9b50271a4db1951d57d73e8cdc8f74e66a7828942` | `2ef65eee` | `research/publication_tasks/e1/E1_PROTOCOL.md` |
  | `d8a1bab7cb9480359562c7726c45ac9c4e6c9c8f057e686b1c883de5be751059` | `574bebeb` | `…/e1/E1_EXCLUSIONS.md` |
  | `b0e9602a9fe2c51f862d459edaeca33b04f3263ca44b982fae9640d6d81397fd` | `807ea796` | `…/e1/E1_THRESHOLDS.md` |
  | `fb1861712bb67b04799154dab973db876ba45c1d48efdb2d9510733f489ded9c` | `d6cff74b` | `…/e1/E1_SCORING_DESIGN.md` |
  | `2951677568577c0679a7568290c1292575d05bfbadc91de067d365d7bd75edc3` | `40d6831b` | `…/e1/E1_PROTOCOL_REVIEW.md` |
  | `a347c923324196663be4f1ceeb09d1ae6fe2902a604d14a8a033935094041018` | `10099483` | `…/e1/E1_DATA_SOURCE.md` |
  | `5f2b39a566663a7cb8a71a772bf0c757e7317fa90a76dc333294eafd9f6536af` | `91cab6a0` | `research/experiments/e1_score_queries.js` |
  | `b56674d9b682bc3577ce9db816df7f22dfa16161d75900bbc838505de7f84f62` | `3dc236f6` | `research/experiments/e1_analyze.js` |

- **Verification:**
  - `git log --oneline e1-protocol-v1 -- research/results/e1_clinc150_v1` is **empty**;
  - `git diff --exit-code e1-protocol-v1 -- research/publication_tasks/e1
    research/experiments/e1_score_queries.js research/experiments/e1_analyze.js` gives **exit 0**.
- **A note for E1-11.** `RUN_MANIFEST.json` records the **raw-byte** SHA-256 of the two scripts. On
  a CRLF checkout it can differ from the LF-normalised values above even when nothing changed.
  E1-11 and E1-12 must use the `git diff` check against the tag as the authoritative test of
  "unchanged".
- **Acceptance criteria:**
  1. The tag exists on the remote: **pass**.
  2. The committed protocol's hash is recorded: **pass**.
  3. No E1 result exists before this commit: **pass**.
- **Committed:** the freeze in `970c54f`, the record in `e4b932c`.

### E1-10: prepare the data under the frozen rules (DONE 2026-09-30)

- **Script:** `research/experiments/e1_prepare_data.js`, new and **outside the frozen set**.
  - It hard-codes only frozen values: the source SHA-256 values from `PROVENANCE.md`, Rule A's
    empty exclusion list, the subgroup-S lists (§3), and the §6.1 counts.
  - It aborts on any mismatch, never overwrites a file, and **never prints query text**.
- **Nothing was downloaded.** It used the committed copy from D5 (`6bba840`).
  - Source SHA-256 values equal `PROVENANCE.md`: `data_full.json` `36923c37…56e0`, `domains.json`
    `b947b579…1b3a`.
- **Outputs** in `research/results/e1_clinc150_v1/data/`:
  - `p1_queries.json`: 4,500 rows of `{id: "test:<i>", text, intent, domain, subgroup}`; SHA-256
    `5d047d2681327fb02bf87147e2553070cfb2e85f861e0334a9aac6bfa67e47d2`;
  - `p2_queries.json`: 1,000 rows of `{id: "oos_test:<i>", text}`; SHA-256
    `d6f0c207c0079e6db23f63d65d2e5f5107a10a8eeed54998c04f234a12e7c344`;
  - `DATA_PROVENANCE.md`: source citation, licence and hashes; the rules applied; the reconciliation;
    the per-domain table; the output hashes.
- **Also added:** `research/results/e1_clinc150_v1/.gitattributes` (`* -text`), so every E1
  output stays byte-exact in checkouts and its recorded hashes hold. This is the same approach as
  the source data folder. It is not a frozen file and changes no rule.
- **Reconciliation: 18 of 18 checks pass.**
  - P1 = 4,500 = 4,500 source rows − 0 excluded; P2 = 1,000.
  - 150 intents × 30; 10 domains × 450.
  - All 13 S intents are present: S-clear 180, S-borderline 210, without S-clear 4,320, without
    either tier 4,110.
  - The 5,500 ids are unique, and the text was copied unchanged (checked row by row against the
    source).
  - The utility domain holds 6 S-clear and 3 S-borderline intents, consistent with T-4.
- **Determinism:** a second run into the scratchpad gave byte-identical `p1_queries.json` and
  `p2_queries.json`.
- **The frozen set is unchanged:** `git diff --exit-code e1-protocol-v1 -- …` gives exit 0.
- **Acceptance criteria:**
  1. The counts equal the source counts minus the declared exclusions: **pass** (reconciled table).
  2. The hashes are recorded: **pass**.
  3. Nothing is excluded outside the frozen rules: **pass** (0 excluded; no per-query exclusion).
  4. No scoring: **pass**.
- **Committed:** in `86114a2`.

### E1-11: run the scoring and the rejection rules (DONE 2026-09-30)

- **Frozen code only, used unchanged.** `git diff --exit-code e1-protocol-v1 -- …` gave exit 0
  both before and after the run.
- **Commands** (one session, Node v24.2.0):
  1. `e1_score_queries.js --guard --out …/guard_v0_2.json`: pre-flight OK; **0 mismatches out of
     209** for `s4`, `confidence` and `fused4`; the lexical and dense lists were bit-identical
     (maximum difference 0); **GUARD PASS**; about 5 seconds.
  2. `e1_score_queries.js --input data/p1_queries.json --out scores_p1.json`, and the same for P2.
     Pre-flight OK for both; **4,500 and 1,000 rows**; exit 0.
  3. `e1_analyze.js … --stage decisions`, without `--synthetic`. **The logical checks pass, with 0
     failures**, and no lexical-null query had all-equal dense scores. It wrote 4,500 and 1,000
     decision rows, with R1, R1-CLI, R2 and R3 (median and all five folds) and R2m and R3m.
- **The manifest is complete** (§6.7):
  - the commit is `86114a2`. `tag_at_head` is null because HEAD is after the tag, so the frozen
    set was confirmed with the `git diff` check against `e1-protocol-v1`;
  - Node v24.2.0;
  - the CLINC source SHA-256 values, which equal `PROVENANCE.md`;
  - the three scoring-input hashes and the model cache (OK, OK), from the scorer's pre-flight;
  - the script SHA-256 values, which **equal the frozen values exactly**
    (`e1_analyze.js` `b56674d9…`, `e1_score_queries.js` `5f2b39a5…`);
  - B = 10,000, seed 42.
- **Outputs** (SHA-256, raw bytes, kept byte-exact by `.gitattributes`):

  | File | Bytes | SHA-256 |
  |---|---|---|
  | `guard_v0_2.json` | 97,179 | `177f6aaf24a8a6a9e4ebec59b1695ca187a0f94a47a2d9beb30cebb229429a45` |
  | `scores_p1.json` | 2,065,820 | `c5810044a008cd12015f101ad77f44a3cc8471e4ea349f1c7f94f7ee7be30f34` |
  | `scores_p2.json` | 473,667 | `7710f59b3e1746b285700c85f72d93fc82e081e3c946c66640477410ee96fa6c` |
  | `decisions_p1.json` | 1,224,390 | `2231eb6a8d3dd76b927ae5c95d3899e0f0cbf6ece70a5d4f4449da4e26e4cf8e` |
  | `decisions_p2.json` | 275,742 | `85739e3bddf090245b03e0162fb391392a2cbaafa0a1c2f121f98d710de349d5` |
  | `logical_checks.json` | 568 | `7402c40b586561c34879aec0bed247205e3bf41f3bfaec5417d24dedc66b9d97` |
  | `RUN_MANIFEST.json` | 2,244 | `5b60d97fb9da44a1636a3a3c0d595b2b0afab61e0e2d71cc9b7eaf1fec5f1034` |

- **Reporting rule kept:** no rejection rate, count of rejections or comparison was read or
  reported. Only the pass/fail status of the checks and the row counts were. `--stage summary`
  was not run.
- **Acceptance criteria:**
  1. The guard passes in the same run: **pass**.
  2. Every prepared query has one output row (4,500 / 1,000): **pass**.
  3. The manifest is complete: **pass**.
  4. The logical checks pass: **pass**.
- **Committed:** in `63d71af`.

### E1-12: implementation checks (DONE 2026-09-30)

- **Deliverable:** `research/publication_tasks/e1_run/E1_IMPLEMENTATION_CHECKS.md`.
- **Script:** `research/experiments/e1_implementation_checks.js` (new, not frozen). It computes no
  rates or aggregates.
- **Result: 17 of 17 checks pass.**
  1. **Row counts** and one-to-one ids across data, scores and decisions: 4,500 and 1,000.
  2. **No NaN, missing or ill-typed score field;** `command_shipped` is null exactly when the query
     has no tokens.
  3. **Re-derivation:**
     - (a) a fresh call of the frozen `search()` gives a bit-identical s, and equal confidence and
       command, on **all 5,500** queries;
     - (b) the 4-dp rounding is exact;
     - (c) the decisions equal an independent re-application of §6.2 (0 mismatches).
  4. **Deterministic re-run** into the scratchpad: the decisions are byte-identical, and the scores,
     logical checks and manifest are identical apart from timestamps, the commit and the re-run
     copies' own hashes.
  5. **Spot check of 20 random rows** (seed 20260930). An independent BM25 and independent fusion
     match within 1.8e-15 on s and 1.1e-16 on fused.
     - The sample includes 4 lexical-null rows, each with s = 0 and fused = 0.5.
     - The worked example, `test:3921`, was verified by hand: 5.232890 + … gives 12.703244 = the
       stored s.
- **Plan adjustment (location only):** the E1-12 and E1-14 deliverables moved from `e1/` to
  `e1_run/`, because a new file in `e1/` would make the frozen check's directory diff report a
  difference. `TASKS.md` is updated. **No protocol text or rule changed.**
- **The frozen set is unchanged:** exit 0.
- **Acceptance criteria:** all checks pass, with the evidence logged; there was no failure, so
  BLOCKED was not needed: **pass**.
- **Committed:** in `4afb2f2`.

### E1-13: run the planned analysis (DONE 2026-09-30)

- **Frozen code, unchanged** (`git diff … e1-protocol-v1` gave exit 0).
- **Command:** `e1_analyze.js … --stage summary`. The stored decisions equal the recomputed ones,
  the logical checks pass, and the exit code was 0.
- **Outputs:** `summary.json` (SHA-256 `36788eee…6832`), `summary.md` (`09920d96…1c3a`) and
  `DEVIATIONS.md` (`24de024b…a2be`: **no deviations**, plus reporting notes N1 and N2), all in
  `research/results/e1_clinc150_v1/`.
- **Results, as computed.** Readings are the pre-stated ones; interpretation is E1-14.

  | | P1 (`test`, n = 4,500; interval = intent-cluster bootstrap) | P2 (`oos_test`, n = 1,000; Wilson) |
  |---|---|---|
  | R1 (s < 2.0) | 1,139 (25.31%) [21.84, 28.98] | 191 (19.10%) [16.78, 21.65] |
  | R1-CLI | 1,149 (25.53%) [22.07, 29.24] | 198 (19.80%) [17.45, 22.38] |
  | R2 (s4 < 6.4952) | 3,871 (86.02%) [83.02, 88.80] | 834 (83.40%) [80.97, 85.58] |
  | R3 (fused4 < 0.9219) | 3,499 (77.76%) [74.13, 81.27] | 781 (78.10%) [75.43, 80.55] |
  | R2, five-threshold range | 86.02–92.20% | 83.4–89.4% |
  | R3, five-threshold range | 69.27–78.16% | 69.3–78.6% |
  | **Primary: R2 − R3 (P1)** | **+0.0827 [0.0502, 0.1164]**; discordant 731 / 359. *Pre-stated reading:* R2 rejects more at the v0.2 operating points, which also carry more v0.2 false rejections (20 vs 11 of 134); this does not by itself show that R2 is the better rule. | R2 − R3 +0.053; discordant 157 / 104; exact McNemar p = 0.001245 (Holm 0.001245). This is the replication check. |
  | **Matched: R2m − R3m (secondary)** | R2m 2,905 (64.56%) [60.33, 68.56]; R3m 3,468 (77.07%) [73.38, 80.62]; **−0.1251 [−0.1618, −0.0887]**. *Pre-stated reading:* at equal v0.2 cost, the fused score rejects more. | R2m 597 (59.7%), R3m 770 (77.0%); **−0.173**; discordant 107 / 280; exact McNemar p = 5.761e-19 (unadjusted) |
  | R3 − R1, R2 − R1 (secondary) | +0.5244 [0.4904, 0.5576]; +0.6071 [0.5722, 0.6404] | +0.59, +0.643; Holm p = 9.871e-178 and 1.644e-193 |
  | Queries with 2.0 ≤ s < 2.36 (R1-CLI minus R1) | 10 | 7 |
  | Queries with no tokens | 0 | 0 |
  | Lexical-null queries (share) | 1,139 (25.31%). R1 rejects exactly these: 0 of 3,361 overlap queries. | 191 (19.1%); R1 rejects 0 of 809 overlap queries |
  | Overlap subset: R2 − R3 | +0.1107 [0.0678, 0.1546] (sensitivity) | +0.0655 (descriptive) |
  | Ties exactly at a threshold (not rejected) | s4 = 6.4952: 12; s4 = 7.1978: 34; fused4 = 0.8841: 1; fused4 = 0.9247: 1 | s4 = 6.4952: 6; s4 = 7.1978: 5 |

- **P1 subgroup S** (descriptive):
  - S-clear (180): R1 75, R1-CLI 75, R2 158, R3 145.
  - S-borderline (210): R1 53, R1-CLI 55, R2 194, R3 144.
  - Without S-clear (4,320): R2 − R3 +0.0831 [0.0488, 0.1174].
  - Without either tier (4,110): R2 − R3 +0.0752 [0.0423, 0.1090].
- **The per-domain table** is in `summary.md`.
- **Reporting notes** (`DEVIATIONS.md`; they change no analysis):
  - **N1:** the v0.2 comparison line prints R2 − R3 = 0.0826, because it subtracts rates after
    rounding. The exact value is 0.082667, reported as **0.0827** by the primary field, which is
    authoritative.
  - **N2:** the P1 secondary exact McNemar p-values print as 0 because of underflow. The true value
    is about 10^-710, i.e. < 1e-300. They are labelled "ignores clustering".
- **Nothing outside the protocol was computed.** There are no post-hoc analyses.
- **Acceptance criteria:**
  1. The summary JSON and MD contain every protocol metric, with its denominator and interval:
     **pass**. The matched-rule intervals and all §6.5 fields are in `summary.json`.
  2. The deviation log is present: **pass** (no deviations).

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
| D2 | **(a)**: apply all five per-fold thresholds. The primary result is the median rate, which equals the rate at the median threshold (R2 6.4952, R3 0.9219); the min–max is a sensitivity range. | 2026-09-30 | author |
| — | ISSUE-06 **option 1**: R1 stays s < 2.0 (primary); add R1-CLI (s < 2.36) as secondary; correct the approved §1 wording ("on the benchmark, equivalently") | 2026-09-30 | author |
| D6 | **Freeze the E1 protocol (gate G-E1):** approved. Tag `e1-protocol-v1` → `970c54f` | 2026-09-30 | author ("Approve freeze, D9 = git tag only. Start E1-09") |
| D9 | External preregistration: **none; the git tag only** | 2026-09-30 | author |
| D11 | E1-08 findings: **ISSUE-10 = (b).** The primary reading and ED-2 are reworded, and a secondary matched-operating-point comparison R2m − R3m is added (m = 11; thresholds from v0.2's 159 in-scope queries only). **ISSUE-09 = (a):** P2's out-of-scope status is stated as assumed. **C-1 is approved.** **E1-07c is added.** | 2026-09-30 | author ("ISSUE-10 = b, ISSUE-09 = a, approve C-1, add E1-07c") |
| D10 | **(a)**: one pre-specified primary comparison, R2 − R3 on P1, with a paired cluster-bootstrap 95% interval (B = 10,000, seed 42). P2's three pairs are secondary (exact McNemar, Holm over 3); all else is descriptive. §6 is approved as drafted. | 2026-09-30 | author |
| — | ISSUE-08: **add E1-07b** (P1). `e1_analyze.js` is written and tested on synthetic data before the freeze, frozen at E1-09, and run unchanged at E1-13. E1-08 now depends on E1-07b. | 2026-09-30 | author |
| D3 | **Rule A** (exclude an intent iff a Windows-visible corpus record performs its typical request; the benchmark's own OOD definition): **0 exclusions**, P1 = all 150 intents and 4,500 queries. **Subgroup S** is reported, not excluded: S-clear = date, calculator, measurement_conversion, flip_coin, roll_dice, timer; S-borderline = time, timezone, alarm, reminder_update, weather, exchange_rate, current_location. A sensitivity check drops S-clear, then S-clear and S-borderline. | 2026-09-30 | author |

## Issues

| ID | Found in | Issue | Evidence | Blocks? | Proposed task |
|---|---|---|---|---|---|
| ISSUE-10 (DECIDED (b) 2026-09-30; the text is applied; the code goes in E1-07c) | E1-08 | **Operating-point confound (checklist item 7).** E1 counts only rejections of out-of-scope requests, so the rule set to reject more scores higher. R2 and R3 sit at different v0.2 operating points (20 vs 11 false rejections of 134). The primary comparison's reading, "R2's lead holds", could therefore be misread as "R2 is the better rule". A threshold matched to m in-scope rejections depends only on v0.2's in-scope scores, so it is free of the screening under test. | `E1_PROTOCOL_REVIEW.md` §4; `review_r1_e_ood_operating_points.json` `in_sample_matched_false_rejection` | **Yes: it blocks E1-08, and so E1-09** | Options: (a) text only, plus output strings; **(b) recommended:** (a) plus a pre-specified secondary R2m − R3m comparison at matched operating points (m = 11, thresholds from v0.2's in-scope queries only); (c) like (b), but co-primary. Every option needs a code task, **E1-07c**. |
| ISSUE-09 (RESOLVED (a) 2026-09-30; the text is in protocol §2.1, §2.4 point 6 and §6.1) | E1-08 | P2 (`oos_test`) is assumed out of scope for this corpus, but this was not checked query by query; P1 was checked at class level (Rule A). | `E1_PROTOCOL_REVIEW.md` §4 | Yes, until decided | **(a) recommended:** state it as an assumption and a limitation (§2.4, §6.1). (b) The author reviews the 1,000 queries against a pre-specified rule, and flagged queries become a sensitivity line (no AI annotation). |
| C-1 (APPROVED 2026-09-30; the fix goes in E1-07c) | E1-08 | `e1_analyze.js` gives the recomputed R2 − R3 comparisons (reduced S sets, overlap subset) the primary-reading text | `E1_PROTOCOL_REVIEW.md` §4 | Yes: a code change before the freeze | Relabel them "sensitivity (descriptive)" in E1-07c |
| ISSUE-08 (RESOLVED by adding E1-07b, author, 2026-09-30) | E1-07 | The plan writes the E1 analysis code after the freeze (E1-11/E1-13). The protocol text fixes every metric, but code written after the freeze still leaves room for undeclared implementation choices, such as bootstrap indexing or how ties are handled in code. | `TASKS.md` E1-11 and E1-13; protocol §6 | No | **Proposed E1-07b (P1, code):** write `research/experiments/e1_analyze.js` **before** the freeze. Test it only on synthetic score files, including the 6.8 logical checks, never on CLINC. Freeze it with the protocol, so that E1-13 only runs frozen code. **This changes the plan, so it needs the author's approval.** |
| ISSUE-07 | E1-05 | Two scoring inputs are not covered by the analysis freeze's input hashes: `cli/data/custom_snippets.json` (the packaged snippet in the lexical index) and `research/models/corpus_embeddings.json`. The freeze hashes only `commands.json` (`ANALYSIS_FREEZE_v1.0.md:372`). Both files are tracked in git, but `termassist sync` overwrites the snippet file (`cli/index.js:30-40`), and any change to it alters every score. | `E1_SCORING_DESIGN.md` §3, §4 (risk 2), §6; SHA-256 values recorded there | No | **No plan change.** The E1-06 scorer asserts the three SHA-256 values before scoring, and E1-09 lists them among E1's frozen inputs. `ANALYSIS_FREEZE_v1.0.md` is not touched. |
| ISSUE-05 | PAPER-05 | Possible related-work gap. A web search during Stage 4.5 (2026-09-29, the D1 originality check) returned an arXiv paper titled "Execution-Based Evaluation of Natural Language to Bash and PowerShell for Incident Remediation" (arXiv 2405.06807). It is **unverified**: I have not read or checked it, and the paper does not cite it. If it is real and relevant, it is a public NL-to-**PowerShell** benchmark, which a reviewer may expect in §2 given the tool's Windows corpus. It does **not** contradict §3's or the Limitations' "natural-language-to-**Bash** benchmarks target Linux". | the Stage 4.5 web-search result list, 2026-09-29 (in the session record) | No: the current wording is accurate. It is a completeness risk. | **LIT-01 (P2):** verify arXiv 2405.06807 against its primary record (authors, venue, content). If it holds, decide with the author whether to cite it in §2, and whether its PowerShell data could serve any purpose. That would be a new dataset, which needs approval under the plan's rules. Run it before FINAL-03. |
| ISSUE-04 (RESOLVED by PAPER-05, 2026-09-30) | TRACE-01 | Limitations says "Accuracy tests rest on 7--8 discordant queries". That is true for **hybrid vs BM25** (0+7 on v0.1, 1+7 on v0.2) but **not** for hybrid vs dense, which rests on 3+9 = 12 (v0.1) and 3+14 = 17 (v0.2), per freeze §4. The sentence generalises. | `phase1_t1_controls_excluded.json` comparisons; freeze §4 table | No: it concerns the wording only, and the registered values are correct for hybrid vs BM25 | Fold into **PAPER-05** (the Limitations checklist), for example "Accuracy tests against BM25 rest on 7–8 discordant queries (against dense, 12–17)". Once reworded, the trace entry must be updated. |
| ISSUE-01 (RESOLVED by TRACE-01, 2026-09-30; had been escalated to P0 by PAPER-02) | VERIFY-02 | The claim trace does not cover the **Conclusion**. Its stated coverage is "Abstract, §1–§5, Tables 1–3, Appendix A, Appendix B". The Conclusion's 9 numbers (46, 34, 50, 12, 9, 15, 20, 11, 134) are unregistered, and so are most Limitations numbers (only the POSIX counts 3 and 4 are). All 9 Conclusion numbers were checked by hand against `review_r1_e_ood_operating_points.json` today and are **correct**. | `paper/CLAIMS_TRACE.md` header; no "Conclusion" location in the trace; grep of `trace_claims.js` | No. It is a process gap: a future edit could drift unnoticed. It matters for FINAL-01. | **TRACE-01 (P1, code):** register the Conclusion, Limitations and Ethics numbers in `trace_claims.js` and extend its coverage line. Do it before PAPER-06, so that the Phase 1 edits are checked. Needs approval to be added to the backlog. |
| ISSUE-02 | VERIFY-02 | "Wrong answers average 86% confidence" (Abstract; Contribution 1) is **v0.1 only**; the sentence gives no version. On v0.2 the value is 79.50. | Trace entry "Abstract; §1 C1 = 86" (v0.1 source); a new computation from `results/v0.2/reproduction-results.json` | No, but it is an accuracy-of-wording risk a reviewer could catch | **PAPER-08 (P1, paper):** add the version to the 86% in the Abstract and in Contribution 1, or give both values. The abstract has **1 word** of headroom (VERIFY-01), so the fix must trim elsewhere. If 79.50 is quoted, it must be registered in the trace. Could be folded into PAPER-02 (Contribution 1) plus an abstract edit. Needs approval. |
| ISSUE-03 | VERIFY-02 | The abstract's "Most out-of-scope requests are everyday" rests on **AI-assigned, unchecked** kind labels (34/50). Body §5 says so; the abstract does not. | Freeze §6 ("Kind labels were assigned by an AI assistant and are unchecked"); abstract line 20 | No | **P2.** Add it to the PAPER-05 limitations checklist, or rely on the body disclosure given the abstract's word budget. It is the author's call. |

## Deviations (E1)

*(none.)* The protocol was frozen at `e1-protocol-v1` (`970c54f`) on 2026-09-30. Any change after
that is logged here as DEV-E1-01, … (protocol §6.9).

- E1-11 to E1-13 ran with **no deviation**.
- There are two reporting notes, N1 and N2, about how values are printed. They are in
  `research/results/e1_clinc150_v1/DEVIATIONS.md`, and they are not deviations.

## Next

- **Author action:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256 prefix
  `7c129b946bcd928b`) to the EACL 2027 SRW mentorship programme by **Nov 6**, and tell Claude when it
  is done, so it can be recorded.
- **In progress: E1-08.** `e1/E1_PROTOCOL_REVIEW.md` is written.
  - Checklist items 1–6 pass; the denominators were verified from the labels, and no text was read.
  - Text fixes T-1 to T-6 are applied to the protocol.
  - **The author decided (D11):** ISSUE-10 = (b), ISSUE-09 = (a), C-1 approved, and E1-07c added.
    The protocol text is updated accordingly.
  - E1-08 stays open until E1-07c is done and items 5 and 7 are re-checked.
- **Phase 2 is complete.** The E1 protocol was frozen at `e1-protocol-v1` (`970c54f`) on
  2026-09-30.
- **E1-10 to E1-13 are done.** The results are computed; see the E1-13 entry.
- **Recommended Claude task:** E1-14 (P1), the results memo.
  - It covers what the results do and do not support, measured against §2.3, §2.4 and the expected
    directions ED-1 to ED-5.
  - Every statement cites `summary.json`, and the general-domain limitation is explicit.
  - **The author reviews it. There are no paper edits.**
- **Phase 1 is complete** apart from the author's submission.
- **LIT-01** (P2) is in the backlog.

Waiting for the author's instruction.
