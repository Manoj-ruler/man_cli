# Backlog: TermAssist paper to submission

All paths are relative to the repository root and were checked on 2026-09-30.

**Types:**

- **paper:** edits `research/paper/`.
- **experiment:** new data, scripts or results.
- **code:** new or changed scripts.
- **verify:** read-only checks.
- **human:** only the author can do it.

**Default for every task:**

- **Must not change:** the analysis freeze, its inputs, the frozen benchmarks and manifests, `cli/`,
  or any existing file under `research/results/`.
- **After running a command from the README table:** restore the files it rewrites, unless the task
  intends the change.

---

## Phase 0: State verification

### VERIFY-01: Record the baseline snapshot
- **Priority:** P1, so that any later drift is detectable.
- **Type:** verify. **Depends on:** none.
- **Why it matters:** every later task compares against this. It proves the paper, freeze and
  reproduction are green before any edit.
- **Files:** `research/experiments/verify_freeze_inputs.js`, `research/experiments/trace_claims.js`,
  `research/tests/`, `research/paper/acl_latex/build.sh`.
- **Steps:**
  1. Record the branch, commit and `git status`.
  2. On the clean tree, run `node research/experiments/verify_freeze_inputs.js research/ANALYSIS_FREEZE_v1.0.md`.
  3. Run `node research/experiments/trace_claims.js`.
  4. Run `node --test "research/tests/*.test.js"`.
  5. Run `cd research/paper/acl_latex && bash build.sh`, and record the page line and the overfull
     count.
  6. Count the abstract words.
  7. Restore any rewritten tracked files.
- **Acceptance:**
  - Branch `research/improvement` and a clean tree are recorded.
  - Freeze 27/27; trace "0 problem(s)" with snippet and number counts recorded.
  - Tests all pass (count recorded); build succeeds with the body at most 8 pages.
  - Abstract at most 200 words.
  - `git status` is clean afterwards, apart from `publication_tasks/`.
- **Verify:** re-run `git status --porcelain`, which must list only `research/publication_tasks/` files.
- **Deliverable:** a "Baseline" section in `PROGRESS.md`.

### VERIFY-02: Evidence table for the paper's quantitative claims
- **Priority:** P1, the basis for Phase 1.
- **Type:** verify. **Depends on:** VERIFY-01.
- **Why it matters:** the wording tasks need each claim's exact interval and caveat at hand.
- **Files:** `research/paper/acl_latex/content.tex` (abstract, Contributions, §5–§7, Limitations),
  `research/ANALYSIS_FREEZE_v1.0.md`, `research/paper/CLAIMS_TRACE.md`.
- **Steps:**
  1. List every claim in the abstract, the Contributions paragraph and the conclusion.
  2. For each, record its evidence: the freeze section and row, the interval, the caveat, and whether
     `trace_claims` registers it.
  3. Label each claim: supported, supported with caveat, fragile, or unsupported.
- **Acceptance:**
  - Every claim sentence appears in the table with a freeze reference, or is marked "no numeric
    evidence".
  - Every label is justified.
  - No paper file changed.
- **Verify:** re-checking any 3 claims against the freeze gives the same values.
- **Deliverable:** `research/publication_tasks/CLAIM_EVIDENCE_MAP.md`.

### VERIFY-03: Map overlaps with the existing plans
- **Priority:** P2, avoids duplicate or conflicting work.
- **Type:** verify. **Depends on:** none.
- **Files:** `research/task_plan/TASK_BACKLOG.md`, `research/PLAN_TASKS.md`,
  `research/ANNOTATION_TO_SUBMISSION_RUNBOOK.md`, `research/PUBLICATION_STATUS.md`.
- **Steps:**
  1. List the tasks in those files that overlap this backlog: the paper wording, the final checks,
     and the reproduction docs.
  2. For each, record which document governs it.
- **Acceptance:**
  - Each overlap is listed with the governing document.
  - Any conflict is raised as an issue.
  - No existing plan file changed.
- **Verify:** the author's review.
- **Deliverable:** an "Overlaps" section in `README.md`.

### VERIFY-04: Save the readiness report as a dated reference (optional)
- **Priority:** P3. **Type:** verify. **Depends on:** none.
- **Why it matters:** it gives the Phase 1 and Phase 2 tasks a citable source inside the repository.
- **Steps:**
  1. Copy the report from the conversation into
     `research/publication_tasks/READINESS_REPORT_2026-09-30.md`, unchanged.
  2. Add a header stating its date and source.
- **Acceptance:** the text is identical to what was delivered in the conversation; no other file
  changed.
- **Deliverable:** the file.

---

## Phase 1: Tighten the contribution (target: before the Nov 6 mentorship submission)

These tasks each touch **one** part of `research/paper/acl_latex/content.tex`, and each needs the
author's approval of the proposed text before the edit.

### PAPER-01: Review the research question
- **Priority:** P1: the question already matches the evidence, so this is a check, not a rewrite.
- **Type:** paper. **Depends on:** VERIFY-02.
- **Files:** `content.tex`, Introduction.
- **Steps:**
  1. Quote the current research question.
  2. Check each part of it against VERIFY-02.
  3. Propose "keep", or a minimal edit with a reason.
  4. Edit only after approval.
- **Acceptance:**
  - The question names exactly the three levers the paper evaluates (recalibration, a tuned
    threshold, the hybrid retriever).
  - Nothing it asks is left unanswered by §5–§6.
  - After any edit: trace 0 problems, and the build passes.
- **Verify:** `node research/experiments/trace_claims.js`, then `bash build.sh`.
- **Deliverable:** the decision recorded in `PROGRESS.md`, plus the edit if one was approved.

### PAPER-02: Separate the empirical contribution from standard methods
- **Priority:** P0: a reviewer's first "novelty" objection lands here.
- **Type:** paper. **Depends on:** VERIFY-02.
- **Files:** `content.tex`, the Contributions paragraph only.
- **Steps:**
  1. Rewrite contribution (3), "evaluation practice", as a statement of method, not a contribution.
     Name the methods as known: tie-aware selective metrics (Traub et al.), the noise floor and the
     no-skill reference.
  2. Keep (1) the audit and (2) the attribution.
  3. Every number stays one that `trace_claims` already registers, or is removed.
- **Acceptance:**
  - Nothing in the paragraph presents a known method as the paper's invention.
  - It still has at most 3 items; the word count is recorded.
  - Trace 0 problems; the build passes; the body is at most 8 pages.
- **Verify:** trace, build, and a search of the paragraph for "novel|new metric|we propose".
- **Deliverable:** the approved edit.

### PAPER-03: Novelty wording bounded by the literature search
- **Priority:** P0: it removes an overclaim risk.
- **Type:** paper. **Depends on:** PAPER-02.
- **Files:** `content.tex` (Introduction, §2), `research/paper/T6_LITERATURE_VERIFICATION.md`,
  `research/paper/PHASE14_LITERATURE_RECHECK.md`.
- **Steps:**
  1. Search the paper for the words "first", "novel", "unique", "only" and "no prior".
  2. Make each hit either search-bounded ("to our knowledge, based on the search in §2") or removed.
  3. If the paper claims a literature gap, state it once, with the search's scope.
- **Acceptance:**
  - The paper contains no unqualified "first" or "no prior work".
  - Every gap claim points to the documented search.
  - Trace 0 problems; the build passes.
- **Verify:** the search reports only qualified uses; trace; build.
- **Deliverable:** the approved edits.

### PAPER-04: Make the attribution result the lead
- **Priority:** P1: it is the defence against the "trivial finding" objection.
- **Type:** paper. **Depends on:** PAPER-02.
- **Files:** `content.tex`: the last paragraph of the Introduction and the first paragraph of the
  Conclusion.
- **Steps:**
  1. Draft at most 2 sentences stating the result: three failures need three different remedies,
     and a better retriever is not the remedy for out-of-scope requests.
  2. Use only freeze-backed facts: shipped raw-score OOD AUROC 0.956 vs hybrid 0.889 on v0.2; the
     tuned threshold's 20/134 false rejections.
- **Acceptance:**
  - Each number is registered in `trace_claims` (add a registration if needed; that addition is in
    scope).
  - The body stays at most 8 pages.
  - No new claim goes beyond VERIFY-02.
- **Verify:** trace, build.
- **Deliverable:** the approved edit.

### PAPER-05: Check Limitations and threats to validity
- **Priority:** P1.
- **Type:** paper. **Depends on:** VERIFY-02.
- **Files:** `content.tex`, the Limitations section.
- **Steps:** check that each of these is present and consistent with the freeze, and propose
  additions only where one is missing:
  1. the OOD screening bias;
  2. the detector features chosen on the full data;
  3. the repository corpus vs the released corpus;
  4. that the author audits their own tool;
  5. the exploratory status;
  6. POSIX-only gold answers;
  7. exact-match scoring;
  8. that there is no LLM baseline, and why;
  9. *(added 2026-09-30, ISSUE-04)* the sentence "Accuracy tests rest on 7--8 discordant queries",
     which holds only for hybrid vs BM25. Hybrid vs dense rests on 12 (v0.1) and 17 (v0.2). If it is
     reworded, update its `trace_claims.js` entry ("Limitations", "Accuracy tests rest on 7--8
     discordant queries") so the coverage check still passes.
- **Acceptance:**
  - A checklist in `PROGRESS.md` shows, for each threat, the line where the paper states it.
  - Only missing threats are added.
  - Trace 0 problems; the build passes.
- **Verify:** the checklist review; trace; build.
- **Deliverable:** the checklist, and edits if approved.

### TRACE-01: Register the Conclusion, Limitations and Ethics numbers in the claim trace
*(Added 2026-09-30 with the author's approval, from ISSUE-01.)*
- **Priority:** P0. PAPER-02's approved Contribution 3 states "a trace from every reported number to
  its result file". Until these sections are registered, that claim is not literally true.
- **Type:** code. **Depends on:** VERIFY-02.
- **Files:** `research/experiments/trace_claims.js` (which also generates
  `research/paper/CLAIMS_TRACE.md`); `research/paper/acl_latex/content.tex` is read only.
- **Steps:**
  1. List every numeral in the Conclusion, Limitations and Ethics sections.
  2. Register each with the existing `add(...)` pattern, against the same result files its
     duplicates already use. Design constants go in the header's stated exclusions, with a reason.
  3. Update the header's coverage line.
  4. Run the trace.
- **Acceptance:**
  - A script that lists every numeral in those three sections finds each one registered (in a
    snippet at that location) or covered by a stated exclusion; counts are reported.
  - Trace 0 problems; the new snippet and number counts are recorded.
  - No change to `content.tex`, any result, the freeze or the benchmarks.
- **Verify:** `node research/experiments/trace_claims.js`, plus the coverage script.
- **Deliverable:** the updated `trace_claims.js` and a regenerated `CLAIMS_TRACE.md`.

### PAPER-08: Give the abstract's "86%" its version
*(Added 2026-09-30 with the author's approval, from ISSUE-02.)*
- **Priority:** P1: a wording-accuracy risk that a reviewer could catch.
- **Type:** paper. **Depends on:** VERIFY-02 and PAPER-02 (Contribution 1 already says "(v0.1)").
- **Files:** `research/paper/acl_latex/content.tex`, the Abstract only.
- **Steps:**
  1. Draft an abstract edit that adds the version to the 86%, or gives both values (86% on v0.1 and
     79.5% on v0.2).
  2. Keep the abstract within 200 words: it has 1 word of headroom (VERIFY-01), so trim elsewhere
     without dropping a claim.
  3. If 79.5 is quoted, register it in `trace_claims.js`.
  4. Show the draft to the author, and edit only after approval.
- **Acceptance:**
  - The abstract is at most 200 words (count recorded) and the 86% is qualified by its version.
  - Trace 0 problems; the build passes with the body on at most 8 pages.
  - The author approved the text.
- **Verify:** the abstract word count, trace and build.
- **Deliverable:** the approved abstract edit.

### PAPER-06: Phase 1 gate, with a mentorship-ready snapshot
- **Priority:** P0: it guards the Nov 6 submission.
- **Type:** verify. **Depends on:** PAPER-01 to PAPER-05, TRACE-01 and PAPER-08, or each explicitly
  skipped by the author.
- **Steps:**
  1. Run the full VERIFY-01 check set.
  2. Search the review PDF for anonymity leaks: the tool name, the author name, the package name.
  3. Recheck the abstract word count.
  4. Commit and push.
- **Acceptance:**
  - Everything VERIFY-01 checks passes.
  - The review PDF contains neither the tool's name nor the author's name.
  - The abstract is at most 200 words.
  - The commit is pushed to `research/improvement`.
- **Verify:** the commands above.
- **Deliverable:** the commit hash recorded in `PROGRESS.md`.

### PAPER-07: Submit the mentorship draft [human]
- **Priority:** P1. **Depends on:** PAPER-06. **Owner:** the author.
- **Deliverable:** the submission confirmation recorded in `PROGRESS.md`.

---

## Phase 2: E1 protocol (nothing is run on CLINC150 in this phase)

**E1 in one line:** do the three OOD rejection rules keep their v0.2 behaviour on external,
general-domain out-of-scope requests that none of the project's retrievers has screened, with the
v0.2 thresholds frozen?

### E1-01: CLINC150 source, access and licence
- **Priority:** P0: the data must be legitimately usable and exactly identifiable.
- **Type:** experiment. **Depends on:** none.
- **Why it matters:** the provenance must be exact before any file is fetched.
- **Files:** `research/paper/acl_latex/references.bib` (`larson-etal-2019-evaluation`, already cited).
- **Steps:**
  1. Verify the paper (ACL Anthology D19-1131).
  2. Locate the official data release.
  3. Record the licence, the file variants (full, small, imbalanced, OOS-plus), the size of each
     split, and the file sizes.
  4. **Ask the author's permission before downloading anything**, stating the file, source and size.
  5. Do not open system outputs; none exist yet.
- **Acceptance:** the source URL, licence, variant list, split sizes and download size are recorded
  with evidence links. The author's download decision is recorded.
- **Verify:** re-read the sources.
- **Deliverable:** `research/publication_tasks/e1/E1_DATA_SOURCE.md`.

### E1-02: Question and scope
- **Priority:** P0. **Type:** experiment. **Depends on:** E1-01.
- **Steps:**
  1. Write the question.
  2. State the population: which variant and which split(s). The split choice is decision **D4**.
  3. State what E1 can show: the rejection rate of the three rules on unscreened, general-domain,
     out-of-scope text.
  4. State what it cannot show:
     - performance on terminal-task OOD requests;
     - false rejections of in-scope queries (CLINC150 has no shell queries);
     - anything about v0.2.1.
- **Acceptance:** the scope lists at least these three "cannot show" items, and the author approves
  the scope.
- **Deliverable:** `research/publication_tasks/e1/E1_PROTOCOL.md` §1–§2 (a draft).

### E1-03: Inclusion and exclusion rules, fixed before any scoring
- **Priority:** P0: the core of E1's validity.
- **Type:** experiment. **Depends on:** E1-02 and decision D4.
- **Steps:**
  1. From CLINC150's intent names and example queries **only**, with no scores or retrieval results,
     identify intents whose requests may have a legitimate shell answer on Windows. Candidates might
     be time, date, timers or calculator-like requests, but E1-03 decides from the data.
  2. Write the rule at the level of intent classes, with a reason for each excluded class. The
     `oos` class is kept whole.
  3. List borderline classes separately, with the proposed handling.
  4. Record exactly what was looked at.
- **Acceptance:**
  - Every excluded class has a written reason.
  - No per-query exclusions.
  - A log states that no system output was consulted.
  - The author approves the rules (decision **D3**).
- **Verify:** `git log` shows that no E1 result file exists yet.
- **Deliverable:** `E1_PROTOCOL.md` §3 and `e1/E1_EXCLUSIONS.md`.

### E1-04: Verify the frozen v0.2 thresholds and how they were derived
- **Priority:** P0. **Type:** verify. **Depends on:** none.
- **Files:**
  - `research/results/review_r1/review_r1_e_ood_operating_points.json`
    (`nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25`);
  - `research/results/v0.2/selective-prediction-results.json` (`ood_detection.per_fold`);
  - `research/results/v0.2/hybrid-nested-cv-results.json` (`selected_alpha_per_fold`);
  - `research/experiments/review_r1_e_ood_operating_points.js`.
- **Steps:**
  1. Record each threshold with its source field.
  2. Confirm the score scale of each rule: whether the shipped score includes the +15 bonus, and the
     fused-score range.
  3. Confirm how each threshold was tuned (F1-maximising on the development folds).
  4. Write the options for applying five per-fold thresholds to external data (decision **D2**):
     - (a) apply all five and report the median with the min–max;
     - (b) the modal threshold as primary;
     - (c) refit on all of v0.2, which is a new tuning and needs explicit approval.
  5. Recommend one.
- **Acceptance:**
  - The values match the files exactly.
  - The scales are confirmed from the code, with file and line numbers.
  - Decision D2 is recorded.
  - No result file changed.
- **Deliverable:** `e1/E1_THRESHOLDS.md`.

### E1-05: Can external queries be scored exactly like the frozen pipeline? (code reading)
- **Priority:** P0. **Type:** verify. **Depends on:** E1-04.
- **Files:** `research/experiments/lexical_search.js` (`lexicalSearchAll`), `dense_search.js`,
  `hybrid_fusion.js` (`fuseQuery`), `build_query_scores_v0_2.js`, `check_model_cache.js`, and
  `cli/search.js` (read only).
- **Steps:** trace how the frozen pipeline computes, for one query:
  1. the shipped score (fixed rule);
  2. the raw score used by the tuned threshold;
  3. the fused top-1 score (detector).

  Then list what a new script needs, and any dependence on benchmark-only fields such as the review
  map or the folds.
- **Acceptance:**
  - A written data-flow with file:line references.
  - The risks are named, such as min-max normalisation over candidates, or α per fold.
  - No code written.
- **Deliverable:** `e1/E1_SCORING_DESIGN.md`.

### E1-06: External-query scorer, proven on the benchmark only
- **Priority:** P0. **Type:** code. **Depends on:** E1-05.
- **Files:** a new script, `research/experiments/e1_score_queries.js`.
- **Steps:**
  1. Implement scoring for a list of plain-text queries, reusing the existing modules.
  2. Guard: run it on the v0.2 benchmark queries. It must reproduce the committed shipped scores
     (`results/v0.2/reproduction-results.json`) and fused top-1 scores
     (`results/v0.2/reliability_features.json`) exactly.
  3. Output only to the scratchpad; **no CLINC150 input.**
- **Acceptance:**
  - 0 mismatches on all 209 v0.2 queries, for both scores (tolerance 1e-9 after the pipeline's
    4-decimal rounding).
  - The model cache check passes.
  - No existing file changed.
- **Verify:** the guard output, and `git status`.
- **Deliverable:** the committed script, plus the guard log in `PROGRESS.md`.

### E1-07: Analysis protocol, metrics and output specification
- **Priority:** P0. **Type:** experiment. **Depends on:** E1-02, E1-03, E1-04 (D2) and E1-06.
- **Steps:** complete `E1_PROTOCOL.md`:
  1. **Primary outcome:** OOD rejection rate per rule, with Wilson intervals.
  2. **Secondary outcomes:**
     - paired exact McNemar between rules on the same queries;
     - rejection by CLINC domain (descriptive);
     - comparison with the v0.2 rates, all 50 and the 15 unscreened.
  3. The handling of ties and exact-threshold values.
  4. **Expected-direction statements** written before running, for example "if screening inflated
     v0.2, the tuned threshold's external rejection rate will be below 92%". They are
     interpretation aids, not pass/fail targets.
  5. **Outputs:** `research/results/e1_clinc150_v1/`, containing per-query scores, a summary, and a
     `RUN_MANIFEST.json` with the input SHA-256, the commit, the Node version and the model hashes.
  6. **Deviation policy:** any change after the freeze is numbered and approved.
- **Acceptance:**
  - Every metric is defined unambiguously, with denominators.
  - The output paths are new and versioned.
  - The author approves the protocol.
- **Deliverable:** `E1_PROTOCOL.md` (complete).

### E1-07b: Analysis code written and tested before the freeze (added 2026-09-30, ISSUE-08)
- **Priority:** P1. **Type:** code. **Depends on:** E1-06 and E1-07.
- **Files:** a new script, `research/experiments/e1_analyze.js`.
- **Steps:**
  1. Implement exactly the quantities in protocol §6.2–§6.5, plus the logical checks in §6.8. Reuse
     the `phase1_common.js` statistics.
  2. The input is the scorer's per-query files plus the P1 metadata (intent, domain, subgroup).
  3. Test it on **synthetic score files only**. They are generated in the scratchpad with known
     answers, and cover at least these cases:
     - hand-computable rates;
     - a threshold tie;
     - a query with no tokens;
     - a lexical-null query;
     - a degenerate bootstrap;
     - a deliberately broken nesting, which the logical checks must catch.
  4. **Never run it on CLINC**, or on any E1 output.
- **Acceptance:**
  - Every §6 quantity has an output field with its numerator and denominator.
  - The synthetic tests match their known answers.
  - The logical checks fail on the broken case.
  - No existing file changed; no CLINC input.
- **Deliverable:** the committed script and the synthetic test log in `PROGRESS.md`. The script is
  frozen with the protocol at E1-09, and E1-13 runs it unchanged.

### E1-07c: Review fixes to the analysis code, before the freeze (added 2026-09-30; ISSUE-10 = b, C-1)
- **Priority:** P0. **Type:** code. **Depends on:** E1-07b, plus the E1-08 decisions.
- **Files:** `research/experiments/e1_analyze.js`, and `E1_PROTOCOL.md` §6.4 (the recorded values).
- **Steps:**
  1. **Derive the matched thresholds** t_m for `s4` and `fused4` (m = 11), using v0.2's 159
     in-scope queries only, as defined in protocol §6.4.
     - Record the values, and each rule's v0.2 in-scope and out-of-scope counts (in-sample,
       descriptive), in the protocol.
  2. **Add R2m and R3m to `e1_analyze.js`:**
     - it re-derives the thresholds from the committed files and aborts if they differ from the
       recorded values;
     - it adds the per-query decisions;
     - it reports the rates, R2m − R3m on P1 (paired cluster bootstrap) and on P2 (exact
       McNemar, unadjusted), all labelled secondary.
  3. **Reword the output strings** to protocol §6.4's readings.
  4. **Relabel the recomputed comparisons** (reduced S sets and the overlap subset) "sensitivity
     (descriptive)" (C-1).
  5. **Extend the synthetic tests.** Re-run all existing tests, and add known-answer tests for the
     matched rules and the new labels. Synthetic data only; no CLINC data.
- **Acceptance:**
  - The thresholds are derived from v0.2's in-scope scores only.
  - All tests pass.
  - No CLINC input.
  - No other existing file changed.
- **Deliverable:** the committed script, the recorded thresholds, and the test log in
  `PROGRESS.md`.

### E1-08: Protocol review for leakage, selection bias and ambiguity
- **Priority:** P0. **Type:** verify. **Depends on:** E1-07 and E1-07b. It closes after E1-07c,
  with a re-check of items 5 and 7 and of the changed code.
- **Steps:** check the protocol against a written checklist:
  1. no threshold is tuned on E1 data;
  2. exclusions are class-level and were decided without scores;
  3. no outcome was viewed;
  4. the protocol states that CLINC150 is general-domain;
  5. multiple comparisons are handled, or the secondary outcomes are labelled descriptive;
  6. the denominators are right;
  7. no rule is favoured by construction.

  Record every finding and fix only protocol text. Ask the author about anything that affects
  validity.
- **Acceptance:** every checklist item is marked pass, or fixed with the author's approval.
- **Deliverable:** `e1/E1_PROTOCOL_REVIEW.md`.

### E1-09: Freeze the protocol (gate G-E1)
- **Priority:** P0. **Type:** verify. **Depends on:** E1-08, plus the author's explicit approval.
- **Steps:**
  1. Commit `e1/` (the protocol, exclusions, thresholds and scoring design), together with
     `e1_score_queries.js` and `e1_analyze.js` (E1-07b). Record the SHA-256 of both scripts.
  2. Create the git tag `e1-protocol-v1` and push the branch and tag.
  3. Record the commit hash and the date.
  4. External preregistration (e.g. OSF) is optional decision **D9**.
- **Acceptance:**
  - The tag exists on the remote.
  - The committed protocol hash is recorded.
  - No E1 result exists before this commit.
- **Verify:** `git ls-remote --tags origin e1-protocol-v1`, and `git log -- research/results/e1_clinc150_v1`
  (which must be empty).
- **Deliverable:** the tag and the `PROGRESS.md` entry.

---

## Phase 3: Execute and analyse E1 (only after G-E1)

### E1-10: Prepare the data under the approved rules
- **Priority:** P0. **Type:** experiment. **Depends on:** E1-09, plus the download approval (D5).
- **Steps:**
  1. Download the approved file.
  2. Record its URL, SHA-256 and retrieval date.
  3. Apply the exclusions **exactly as frozen**.
  4. Write the prepared query list and the counts, per class and in total.
  5. Do no scoring.
- **Acceptance:**
  - The counts equal the source counts minus the declared exclusions (reconciled in a table).
  - The hashes are recorded.
  - Nothing is excluded outside the frozen rules.
- **Deliverable:** `research/results/e1_clinc150_v1/data/` and `DATA_PROVENANCE.md`.

### E1-11: Run the scoring and the three rejection rules
- **Priority:** P0. **Type:** experiment. **Depends on:** E1-10.
- **Steps:**
  1. Run `e1_score_queries.js` on the prepared data, first re-running its benchmark guard.
  2. Apply the fixed rule, the frozen tuned thresholds and the frozen detector thresholds, per D2.
  3. Write the per-query outputs and the run manifest.
- **Acceptance:**
  - The guard passes in the same run.
  - Every prepared query has one output row.
  - The manifest is complete.
- **Deliverable:** the raw outputs in `research/results/e1_clinc150_v1/`.

### E1-12: Implementation checks
- **Priority:** P0. **Type:** verify. **Depends on:** E1-11.
- **Steps:**
  1. Check the row counts.
  2. Check there are no NaN or empty scores.
  3. The fixed rule must agree with `cli/search.js`'s own `search()` on every query.
  4. A deterministic re-run must be byte-identical, apart from timestamps.
  5. Spot-check 20 random rows by hand, **for scoring correctness only**, never for labels.
- **Acceptance:** all checks pass, with the evidence logged. Any failure becomes BLOCKED plus a new
  issue; results are never "fixed" by hand.
- **Deliverable:** `e1_run/E1_IMPLEMENTATION_CHECKS.md`.
  - *Moved from `e1/` in E1-12 (2026-09-30). A new file in `e1/` would make the frozen check
    `git diff --exit-code e1-protocol-v1 -- research/publication_tasks/e1 …` report a difference.
    This is a location change only; no rule changes.*

### E1-13: Run the planned analysis
- **Priority:** P0. **Type:** experiment. **Depends on:** E1-12.
- **Steps:**
  1. Compute exactly the protocol's metrics, by running the frozen `e1_analyze.js` (E1-07b)
     unchanged.
  2. Label anything not in the protocol "post hoc".
  3. Record deviations, if any, with approval.
- **Acceptance:**
  - The summary JSON and MD contain every protocol metric, with its denominator and interval.
  - The deviation log is present, even if empty.
- **Deliverable:** `research/results/e1_clinc150_v1/summary.{json,md}`.

### E1-14: Results memo, with uncertainty and limitations (no paper edits)
- **Priority:** P1. **Type:** experiment. **Depends on:** E1-13.
- **Steps:** write what the results do and do not support, against the protocol's scope and
  expected-direction statements.
- **Acceptance:**
  - Every statement cites the summary.
  - The general-domain limitation is explicit.
  - The author reviews it.
- **Deliverable:** `e1_run/E1_RESULTS_MEMO.md` (moved from `e1/`, for the same reason as E1-12).

---

## Phase 4: Integrate E1 into the paper

### INTEG-01: Decide which claims E1 supports
- **Priority:** P0. **Type:** paper (decision). **Depends on:** E1-14.
- **Deliverable:** `CLAIM_EVIDENCE_MAP.md` updated with the E1 rows, and the author's decision on
  wording.

### INTEG-02: Page budget and placement
- **Priority:** P0: the body is at 7 of 8 pages (VERIFY-01).
- **Type:** paper. **Depends on:** INTEG-01.
- **Deliverable:** a placement plan (main-text sentences plus an appendix table), approved.

### INTEG-03: The E1 methods paragraph
- **Priority:** P0. **Type:** paper. **Depends on:** INTEG-02.
- **Acceptance:** it states that E1 was planned in advance, the frozen thresholds, the class-level
  exclusions and the general-domain scope. Trace and build pass.

### INTEG-04: E1 results, with numbers registered in `trace_claims.js`
- **Priority:** P0. **Type:** paper and code. **Depends on:** INTEG-03.
- **Acceptance:** every E1 number is registered against `results/e1_clinc150_v1/summary.json`.
  Trace 0 problems; the build is at most 8 pages.

### INTEG-05: Limitations: general-domain vs terminal-specific OOD
- **Priority:** P1. **Type:** paper. **Depends on:** INTEG-04.
- **Acceptance:** it states explicitly that E1 does not establish performance on terminal-task OOD
  requests.

### INTEG-06: Keep "pre-planned" and "exploratory" apart throughout
- **Priority:** P1. **Type:** paper. **Depends on:** INTEG-04.
- **Acceptance:** a search for "confirm", "pre-registered", "planned" and "exploratory" finds only
  correct uses. Only E1 is called pre-planned.

### INTEG-07: Update the abstract and conclusion (only if E1 changes the headline)
- **Priority:** P2. **Type:** paper. **Depends on:** INTEG-01.
- **Acceptance:** the abstract is at most 200 words and every number is traced.

---

## Phase 5: Final publication checks (existing commands)

### FINAL-01: Claim trace and number-to-artefact check
- **Priority:** P0.
- **Verify:** `node research/experiments/trace_claims.js` reports 0 problems, and the snippet and
  number counts are recorded.

### FINAL-02: Build, page limit, abstract length, anonymity
- **Priority:** P0.
- **Verify:** `bash build.sh`; body at most 8 pages; no overfull boxes; abstract at most 200 words;
  review PDF free of the tool's and author's names.

### LIT-01: Verify a possible NL-to-PowerShell benchmark paper (ISSUE-05)
*(Added 2026-09-30 with the author's approval.)*
- **Priority:** P2: a related-work completeness risk; the current wording is accurate.
- **Type:** paper (literature). **Depends on:** none. Run it before FINAL-03.
- **Steps:**
  1. Verify arXiv 2405.06807 ("Execution-Based Evaluation of Natural Language to Bash and
     PowerShell for Incident Remediation") against its primary record: arXiv API or abstract page,
     authors, version, venue.
  2. Read enough of it to say what it evaluates, whether its data is public, and whether it bears on
     §2 or §3.
  3. Recommend cite or not-cite, with a reason. Any **use of its data** would be a new dataset and
     needs a separate, explicit approval.
  4. If citing is approved, draft the §2 sentence and the bib entry, and show both before editing.
- **Acceptance:**
  - The record is verified, with an audit trail (the query, URL and fields confirmed), or the paper
    is marked NOT_FOUND.
  - The recommendation is recorded and the author has decided.
  - If cited: trace 0 problems, build ≤ 8 pages, BibTeX 0 warnings, and the reference added to the
    Stage 4.5 audit list.
- **Deliverable:** a `PROGRESS.md` entry, plus the §2 and bib edits if approved.

### FINAL-03: Scoped rerun of Stage 4.5 integrity (references, citations, changed paragraphs)
- **Priority:** P0.
- **Files:** `research/paper/STAGE4_5_INTEGRITY_REPORT.md`, `research/paper/integrity/verify_refs.js`.
- **Acceptance:** 100% of the changed paragraphs are checked, and every reference is still verified.
  The result is a new dated report; the old one is kept.

### FINAL-04: Reproduction docs and a clean-clone rerun that includes E1
- **Priority:** P1.
- **Files:** `research/REPRODUCE.md`.
- **Acceptance:** an E1 section is added; a fresh clone reproduces `e1_clinc150_v1` (with the data
  from the recorded hash); `compare_reproduction.js` reports 0 DIFFERENT.

### FINAL-05: Consistency review of paper, code and artefacts
- **Priority:** P1.
- **Acceptance:**
  - Every artefact the paper mentions exists at the stated path.
  - `ARCHITECTURE.md` and the runbook mention E1.
  - The freeze check reports 27/27.

### FINAL-06: Submission checklist
- **Priority:** P0.
- **Acceptance:**
  - The ACL Responsible NLP checklist answers are drafted, including AI use, taken from
    `research/paper/AI_DISCLOSURE_LEDGER.md`.
  - The anonymous PDF is final.
  - The supplementary-material decision is recorded.
  - Submission itself is the author's action.

---

## Decisions needing the author's approval

| ID | Decision | Needed by | Recommendation (Claude) |
|---|---|---|---|
| D1 | Approve this plan and the first task | now | Approve; start with VERIFY-01 |
| D2 | How the five per-fold v0.2 thresholds apply to external data | E1-04 → E1-07 | (a): apply all five and report the median with the min–max. It needs no new tuning and shows fold sensitivity. |
| D3 | Exclusion rules for CLINC classes with plausible shell answers | E1-03 | Decide after E1-03's written list |
| D4 | Which CLINC150 variant and split(s) | E1-02 | Decide after E1-01's facts |
| D5 | Permission to download the CLINC150 file | E1-01 / E1-10 | Decide once the file, source and size are stated |
| D6 | Protocol freeze approval (gate G-E1) | E1-09 | **Approved 2026-09-30.** Tag `e1-protocol-v1` → `970c54f` |
| D7 | E1 uses the frozen **v0.2** thresholds even if the final paper reports v0.2.1 | E1-02 | Yes: v0.2 is frozen and pre-annotation; state this in the protocol |
| D8 | Each paper edit's text (Phase 1 and Phase 4) | per task | — |
| D9 | External preregistration (e.g. OSF), beyond the git tag | E1-09 | **Decided 2026-09-30: git tag only** |
| D11 | E1-08 review findings | E1-08 | **Decided 2026-09-30:** ISSUE-10 = (b), a secondary matched-operating-point comparison (m = 11) plus reworded readings; ISSUE-09 = (a), P2 assumed out of scope, stated as a limitation; C-1 approved; E1-07c added |
| D10 | E1's primary comparison and multiplicity | E1-07 | **Decided (a), 2026-09-30:** one primary comparison, R2 − R3 on P1, with a paired cluster-bootstrap interval. P2's pairs are secondary (exact McNemar, Holm over 3); everything else is descriptive. |
