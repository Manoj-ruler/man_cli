# Split B — Intent-Held-Out Generalization (Spec §5.2)

Directly addresses the audit's reviewer-attack #13 ("no intent-held-out generalization test") and
the audit's Part 7 recommendation. Run on the frozen v0.2 benchmark; no new data.

**Protocol:** GroupKFold by derived `intent_group_id` (answerable → `gold_command`; ambiguous →
sorted acceptable-commands set; OOD → singleton). 171 groups over 209 queries, 5 folds
(42/42/42/42/41). **0 groups split across folds** — verified invariant (the script aborts
otherwise). α, OOD/ambiguity thresholds, and the isotonic calibrator are all selected on queries
targeting DIFFERENT command intents than those they are scored on. Registry:
`splits-b-registry.json`.

## Results: Split A (class-stratified) vs Split B (intent-held-out)

| Metric | Split A (within-dist) | Split B (intent-held-out) | Δ (generalization gap) |
|---|---:|---:|---:|
| Hybrid non-OOD accuracy | 79.3% | **79.2%** | **−0.0pp** |
| OOD detection AUROC | 0.901 | **0.898** | −0.003 |
| OOD detection F1 (pooled) | 0.716 | 0.707 | −0.009 |
| Ambiguity F1 (pooled) | 0.496 | 0.479 | −0.017 |
| Calibration ECE (before→after) | 0.324→0.074 | 0.324→**0.101** | after +0.027 |

## Interpretation (honest)

- **Retrieval accuracy and OOD detection generalize to held-out intents essentially unchanged.**
  This is a real, load-bearing result: the accuracy and OOD findings are **not** artifacts of the
  same command-intents appearing in both tuning and test folds. Mechanistically expected — the
  system retrieves over the fixed corpus regardless of the split, and the selected α is stable
  (≈0.5) across folds, so holding out intent groups from *threshold tuning* barely moves accuracy.
- **Calibration still works out-of-intent-group but is meaningfully attenuated**: ECE reduction
  falls from 77% (0.324→0.074, Split A) to **69% (0.324→0.101, Split B)**. Reported as-is: the
  isotonic map generalizes less well to unseen intents than within-distribution. It remains a large
  improvement, but the paper must state the calibrated confidence is somewhat less reliable on
  genuinely novel intents — an honest, useful caveat, not a failure.
- **Ambiguity detection remains weak under both splits** (F1 ≈ 0.48–0.50) — consistent with the
  standing limitation; intent-held-out does not rescue it.

## What this adds to the paper

A generalization column for every headline metric, showing the reliability findings (accuracy,
OOD) are robust to intent-held-out evaluation, with calibration's out-of-distribution attenuation
disclosed. This is exactly the evidence the audit said was missing and that a reviewer would
demand before believing the reliability claims are not overfit to the benchmark's intent
distribution.
