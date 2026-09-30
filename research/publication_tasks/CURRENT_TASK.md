# Current task

**Last completed:** E1-03 (2026-09-30), D3 = Rule A with subgroup S. It makes 0 exclusions, so P1
covers all 150 intents and 4,500 queries; S is reported descriptively, with a sensitivity check.

**Author action still open:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256
prefix `7c129b946bcd928b`) to the mentorship programme by Nov 6.

**Next (recommended): E1-05: can external queries be scored exactly like the frozen pipeline?**
This is done by reading code only. Status: NOT STARTED. It waits for "Start E1-05".

- **Priority:** P0. **Type:** verify (reading code). **Depends on:** E1-04 (done).
- **Files:**
  - `research/experiments/lexical_search.js` (`lexicalSearchAll`);
  - `research/experiments/dense_search.js`;
  - `research/experiments/hybrid_fusion.js` (`fuseQuery`);
  - `research/experiments/build_query_scores_v0_2.js`;
  - `research/experiments/build_candidates_v0_2.js`;
  - `research/experiments/check_model_cache.js`;
  - `cli/search.js`, read only.
- **Steps:** trace how the frozen pipeline computes, for one query:
  1. the shipped score s (live, for R1 and R1-CLI; 4-decimal, for R2);
  2. the fused top-1 score (4-decimal, α = 0.5, for R3).

  Then list what a new script needs, and any dependence on benchmark-only fields (the review map,
  folds, expected_classification).
- **Acceptance criteria:**
  - A written data flow, with file:line references.
  - The risks are named: min-max normalisation over candidates, candidate-set size, α,
    4-decimal rounding, the model cache, the tokenizer.
  - No code is written; nothing is scored.
- **Deliverable:** `research/publication_tasks/e1/E1_SCORING_DESIGN.md`.
