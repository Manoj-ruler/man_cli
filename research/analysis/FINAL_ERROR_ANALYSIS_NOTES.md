# Phase 16 — Final Error Taxonomy (hybrid/A3 system)

**Method:** deterministic, rule-based tagging (not a second ML classifier) over the hybrid
system's 150 predictions, using already-computed fields (`expected_classification`, `query_type`,
`hit`, `top1_score`). Full data: `research/analysis/final-error-analysis.{json,csv}`.

## Tag distribution (150 queries, multi-label — HIGH_CONFIDENCE_WRONG co-occurs with a primary tag)

| Tag | Count |
|---|---:|
| CORRECT | 104 |
| HIGH_CONFIDENCE_WRONG (co-occurring) | 39 |
| OOD_FALSE_ACCEPTANCE | 15 |
| AMBIGUITY_FAILURE | 10 |
| LOW_OVERLAP_FAILURE | 8 |
| LEXICAL_POLYSEMY | 6 |
| SEMANTIC_MISMATCH | 5 |
| WRONG_SCOPE | 2 |
| OVERMATCH | 0 |
| WRONG_ACTION | 0 |
| WRONG_PLATFORM | 0 |

## Two categories are legitimately zero — explained, not silently omitted

- **OVERMATCH = 0:** all 10 `single_keyword` benchmark queries are *also* labeled `AMBIGUOUS` by
  the benchmark's own design (a bare word like "git" or "docker" is inherently ambiguous across
  many corpus commands), so the higher-priority `AMBIGUITY_FAILURE` tag applies instead in every
  case. Verified directly: all 10 single-keyword queries carry `AMBIGUITY_FAILURE`, none reach
  the OVERMATCH branch.
- **WRONG_ACTION = 0:** all 15 `safety_sensitive` benchmark queries are answered correctly by the
  hybrid system (0/15 wrong) — consistent with Phase 4-8's finding that safety-sensitive queries
  are the easiest slice for this system (they tend to be canonically phrased).
- **WRONG_PLATFORM = 0:** structural guarantee, not a detection gap — `cli/search.js`'s
  `buildIndex()` filters the corpus to the benchmark's platform (win32) *before* any scoring
  happens, so a cross-platform-mismatched command can never be returned regardless of retrieval
  quality. Stated explicitly rather than presented as an unverified zero.

## The most important finding in this taxonomy: all single-keyword failures are confidently wrong

**All 10 single-keyword queries that fail also carry `HIGH_CONFIDENCE_WRONG`** (fused score
≥0.8) — the system isn't just wrong on underspecified queries, it's *confidently* wrong on every
single one. This is the sharpest concrete illustration of the calibration problem this entire
research program was built to address (Phase 8): a user typing a bare keyword like "git" gets a
specific, wrong, high-confidence answer instead of a request for clarification. This is precisely
the failure mode Phase 7's ambiguity-detection (AUROC 0.784, though imperfect F1) and Phase 8's
calibration (80.4% ECE reduction on the hybrid_reliability variant) directly target.

## Overall HIGH_CONFIDENCE_WRONG rate

39/46 wrong predictions (84.8%) are high-confidence — even after moving from the raw production
system (A0) to the improved hybrid system (A3), most errors remain confidently wrong. This
number should be read alongside Phase 8: it is exactly why calibration is reported as a
necessary complement to accuracy improvement, not a redundant addition — accuracy gains (A0→A3)
did not, by themselves, fix the confidence problem; a separate calibration step was still needed
and did measurably help (Phase 8).
