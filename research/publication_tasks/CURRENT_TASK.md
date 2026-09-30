# Current task

**Last completed:** E1-05 (2026-09-30), the scoring design in `e1/E1_SCORING_DESIGN.md`.

- **Finding:** external queries can be scored exactly like the frozen pipeline. The scores depend
  only on the query text, the platform and four pinned inputs.
- **ISSUE-07 was recorded.** The snippet file and the corpus embeddings are not hashed by the
  analysis freeze. It is handled inside E1-06 and E1-09, with no plan change.

**Author action still open:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256
prefix `7c129b946bcd928b`) to the mentorship programme by Nov 6.

**Next (recommended): E1-06, the external-query scorer, proven on the benchmark only.**
Status: NOT STARTED. It waits for "Start E1-06".

- **Priority:** P0. **Type:** code. **Depends on:** E1-05 (done).
- **File:** a new script, `research/experiments/e1_score_queries.js`, built to the specification in
  `E1_SCORING_DESIGN.md` §5:
  - pre-flight checks: the platform, three SHA-256 values, the model cache, and α = 0.5;
  - per-query values;
  - a guard mode;
  - synthetic edge cases.
- **Acceptance criteria:**
  - **0 mismatches on all 209 v0.2 queries**, within 1e-9 after 4-dp rounding, for:
    - `s4` against `reproduction-results.json`;
    - `confidence`;
    - `fused4` against `reliability_features.json`.
  - The model cache check passes.
  - **No CLINC input.**
  - **No existing file changed** (checked with `git status`).
  - Outputs go to the scratchpad only.
- **Deliverable:** the committed script, plus the guard log in `PROGRESS.md`.
