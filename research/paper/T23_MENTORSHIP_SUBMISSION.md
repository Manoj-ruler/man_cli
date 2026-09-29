# T23: EACL 2027 SRW pre-submission mentorship: submission package

**Status (2026-09-29):** the package is prepared. **The author submits it; Claude does not submit forms or create accounts.**

## Venue facts

These were verified on the official call on 2026-09-28 and are recorded in `research/PLAN_TASKS.md` D4.

| Item | Value |
|---|---|
| Venue | EACL 2027 Student Research Workshop (Athens, March 9–14, 2027) |
| Pre-submission mentorship deadline | **Nov 6, 2026** (feedback by Dec 5, 2026) |
| Direct submission deadline | Dec 15, 2026 (notification Jan 5, 2027; camera-ready Jan 19, 2027) |
| Paper type | Long paper: 8 pages of content (9 on acceptance), unlimited references |
| Review | Anonymous. Non-anonymous preprints are allowed. |
| Eligibility | The first author must be a student |
| Fallback | NAACL 2027 SRW (mentorship Nov 16, 2026; submission Jan 11, 2027; double-blind) |

**Still to verify on the official call before submitting** (not checked in this session):
- the submission system and link for the mentorship track;
- whether the mentorship track asks for a full paper or an abstract plus draft;
- whether the Responsible NLP checklist and the AI-writing-assistance question are required at the mentorship stage or only at the Dec 15 submission.

## What to upload

- **File:** `research/paper/acl_latex/main_review.pdf`, built by `build.sh` from `main_review.tex`.
  - It is anonymized: the tool appears as "TOOL", item IDs as "Q…", and a footnote says the name is withheld.
  - The review PDF's text and metadata carry no name, package scope, author handle or "TA-B" prefix. This was checked after each build.
- **Do not upload:**
  - `main.tex`, `content.tex`, or any `.bib` or source file (`main.tex` defines the real tool name);
  - `T21b_REVISION_LOG.md` or the other logs;
  - the repository itself.
- **Supplementary material:** none for the mentorship round. The paper says code and data will be released with the camera-ready version.

## Pre-upload checklist

Run in `research/paper/acl_latex/`:

1. `bash build.sh` must report "body text ends on page N (limit 8)" with N ≤ 8, currently 7 (the main-text figure added in T24).
2. `main_review.log` must show 0 overfull boxes and no undefined references; `main_review.blg` must show 0 warnings.
3. The review PDF text must contain none of the identifying strings:

   ```bash
   pdftotext main_review.pdf - | grep -ci "termassist\|manoj\|npm\|TA-B"
   ```

   The expected output is 0.
4. The abstract must be 200 words or fewer:

   ```bash
   sed -n '/begin{abstract}/,/end{abstract}/p' content.tex | sed '1d;$d' | wc -w
   ```

5. Every number in the paper must match its source (T15):

   ```bash
   node research/experiments/trace_claims.js
   ```

   It must print "0 problem(s)" and regenerates `research/paper/CLAIMS_TRACE.md`.
6. The author reads the rendered PDF once (T17 was done by Claude; see below).

## Pending results, shown as pending in the paper

- **Annotation (T9–T11).**
  - The paper states that "a two-annotator study … is under way".
  - The Limitations section says it "has no results yet".
  - No annotation number appears anywhere.
  - When the study finishes (target: end of November), κ and the corrected benchmark (v0.2.1, T12) go into the Dec 15 version, after a final re-review.
- **The contested items** (REV-18, 23, 33, 39) and REV-10 (main-text figure) are open. Mentorship feedback may help decide them.

## Author decisions and checks before submitting

- **Confirm the authorship sentence.** §1 says the tool "was written and released by one of the authors before this study, which changed none of its executable code and none of the corpus fields it reads". Evidence:
  - git history: the `cli/` commits are all by the author;
  - npm release 2026-04-19, while the study began 2026-08-13;
  - the two study-period `cli/` commits are a comment fix and an additive schema change, and 0 existing corpus fields changed.
- **Registry-lookup risk.** The §3 details (279 Windows commands, BM25 constants, the 30% refusal) could let a determined reviewer find the package. The SRW allows non-anonymous preprints, but the review copy itself must stay anonymous. This is the author's call.
- **Spot-check the NL2SH author line** (ADJ-1): six authors in the published PDF against the Anthology metadata.
- **AI-assistance disclosure.**
  - ACL venues ask authors to report AI writing assistance, in the Responsible NLP checklist at submission time.
  - The paper already discloses that part of the benchmark was written by an AI agent.
  - Recommended before Dec 15: run the ARS `academic-paper` `disclosure` mode for ACL to draft the statement. Check first whether it is needed at the mentorship stage.
- **Student status.** The first author must be a student.
