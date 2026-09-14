# Phase 4 — Hybrid Fusion (E4) Results

**Protocol:** nested 5-fold cross-validation. For each test fold, α ∈ {0.0, 0.1, ..., 1.0} is
selected by maximizing non-OOD accuracy on the *other four folds only*; the selected α is then
evaluated once on the held-out test fold. No α is ever chosen using the fold it is scored on.
Folds are seeded (`mulberry32(42)`), stratified by expected classification — see `folds.json`.

OOD queries are excluded from the tuning objective in this phase because no rejection mechanism
exists yet (Phase 7 adds that); every prediction here is an unconditional top-1 accept, so OOD
false-acceptance is 100% by construction, same caveat as E3's exploratory dense run.

## Two correctness checks (both pass exactly)

1. **α=1.0 (pure BM25 via the fusion pipeline) reproduces the frozen baseline's supported-task
   accuracy exactly: 71.9%.** This confirms the fusion/normalization/evaluation code introduces
   no discrepancy relative to ground truth when it degenerates to the original system.
2. **α=0.0 (pure dense via the fusion pipeline) reproduces E3's exploratory dense-only accuracy
   exactly: 72.6%.** Confirms `hybrid_fusion.js` and `run_dense.js` agree independently.

## Nested-CV result

| Fold | Selected α (dev-only) | Test-fold non-OOD accuracy |
|---|---:|---:|
| 0 | 0.3 | see `hybrid-nested-cv-results.json` |
| 1 | 0.3 | " |
| 2 | 0.3 | " |
| 3 | 0.3 | " |
| 4 | 0.5 | " |

**Mean test-fold non-OOD accuracy: 77.1% (std 4.1pp)** vs. the frozen BM25 baseline's 71.9%
supported-task accuracy — a **+5.2pp improvement**, achieved without any test-fold leakage.

4 of 5 folds independently selected α=0.3 (moderate lexical weight, dense-leaning) as best on
dev data, one fold selected α=0.5 — a fairly stable preference for a hybrid closer to dense-
weighted than pure-BM25, consistent with E3's finding that dense retrieval fixes the low-overlap-
paraphrase failure mode BM25 struggles with.

## Descriptive-only full-dataset α curve

Included for the Phase 15 α-vs-accuracy figure — **not used for any reported result**, since it
is computed with no train/test separation and would overclaim if treated as a final number:

| α | Full-dataset non-OOD accuracy |
|---:|---:|
| 0.0 | 72.6% |
| 0.1 | 75.6% |
| 0.2 | 76.3% |
| 0.3 | 77.8% (curve peak) |
| 0.4 | 77.0% |
| 0.5 | 77.0% |
| 0.6 | 76.3% |
| 0.7 | 74.8% |
| 0.8 | 74.1% |
| 0.9 | 74.1% |
| 1.0 | 71.9% |

The curve's peak (α=0.3, 77.8%) closely matches the nested-CV selection (α=0.3 in 4/5 folds) and
its held-out mean (77.1%) — reassuring that the nested-CV result isn't an artifact of fold luck,
but this descriptive number itself must never be quoted as "the" result in the paper.

## What this does and does not establish

This result establishes that hybrid fusion beats pure BM25 on *supported-task accuracy under
proper cross-validation* — a real, non-cherry-picked improvement. It does **not** yet establish
anything about OOD handling, ambiguity, calibration, or safety — those require Phases 5–8. Per
the plan's decision-gate discipline (Phase 17), this single number alone is not sufficient to
claim the full research contribution; it is one input to that later decision.
