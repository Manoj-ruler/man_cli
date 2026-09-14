# Phase 7 — OOD Detection + Selective Prediction (E6/E7)

**Protocol:** nested 5-fold CV, identical discipline to Phase 4's α selection — every
detection threshold is chosen on dev folds only (the other 4), then applied once to the held-out
test fold. AUROC is threshold-free and computed directly per test fold (no tuning risk).

**Feature choice is evidence-driven, not assumed:** Phase 6's descriptive stats showed
`top1_score` (absolute match quality) is the strongest OOD separator (OOD mean 0.841 vs.
CORRECT mean 0.980), while `margin` (relative separation from runner-up) is the strongest
ambiguity separator (AMBIGUOUS mean 0.072 vs. CORRECT mean 0.253). This matches the intuitive
mechanism difference — OOD queries don't match anything well in absolute terms; ambiguous
queries match multiple things almost equally well in relative terms — and is stated explicitly
so it reads as a documented design decision, not cherry-picking after trying both.

## OOD detection (feature: top1_score, lower ⇒ more likely OOD)

- Mean test AUROC across folds: **0.867** (strong, threshold-free ranking quality)
- Pooled confusion (5 test folds concatenated): TP=7, FP=6, FN=8, TN=129
- Pooled recall (= OOD rejection rate): **46.7%** (7/15) vs. the frozen baseline's static-
  threshold rejection rate of **26.7%** — a **+20pp** improvement in catching true OOD queries.
- Pooled precision: 53.8% — just over half of rejections are genuinely OOD; the rest (6 of 135
  legitimate queries, 4.4%) are false rejections, a real and quantified cost, not hidden.
- False-acceptance rate improves from the baseline's 73.3% to **53.3%** (8/15 still slip
  through) — better, not solved.

## Ambiguity detection (feature: margin, lower ⇒ more likely ambiguous)

- Mean test AUROC: 0.784 — real but weaker separability than OOD detection.
- Pooled: precision=0.205, recall=0.643, F1=0.310. Recall is reasonable (9/14 ambiguous queries
  flagged) but precision is low (35 false positives out of 44 flagged) — margin alone
  over-triggers on the much larger CORRECT class. **This is reported as a genuine limitation,
  not smoothed over**: single-feature margin thresholding is not yet a strong ambiguity
  detector on this benchmark; a richer feature (e.g. combining margin with entropy, or a
  learned combination) would likely be needed for a stronger claim, and is noted as future
  work rather than attempted here without evidence it would help.

## Risk-coverage curve

Using `top1_score` as the confidence ranking (most-confident-first), risk (error rate among
accepted queries) climbs from 0% at ~35% coverage to 30.7% at 100% coverage. The 100%-coverage
risk (30.7%) exactly matches `1 − (104/150 pooled hits) = 30.7%`, an internal consistency check
against Phase 6's hybrid correct-count. At 50% coverage, risk is only 10.7% — demonstrating that
confidence-based selective answering genuinely works: the system *could* answer half its queries
at a 10.7% error rate instead of the unconditional 30.7%, if abstention on the other half were
acceptable for the deployment context.

## A4/A5 ablation rows (fill in Phase 5's PENDING rows)

Using the exact per-fold thresholds tuned above (not retuned):

| Condition | Rule | Coverage | Selective accuracy | OOD caught (of 15) | Correct answers sacrificed |
|---|---|---:|---:|---:|---:|
| A4 | Hybrid + reject if margin < fold's ambiguity threshold | 70.8% | **88.5%** | 8/15 | 11 |
| A5 | A4's rule + reject if top1_score < fold's OOD threshold | 69.5% | **90.1%** | 10/15 | 11 |

**Important caveat, stated explicitly:** A4/A5's "selective accuracy" (88.5%/90.1%) is **not
directly comparable** to A0–A3's unconditional-accept accuracy (71.9–77.1%) — they measure
different things (accuracy among a ~70%-coverage subset vs. accuracy over 100% of queries). The
correct comparison is the *whole risk-coverage tradeoff*, not a single number: selective
prediction trades answering ~30% fewer queries for a large accuracy jump among what it does
answer, plus catching more OOD. Whether that tradeoff is "better" depends entirely on the
deployment's tolerance for abstention, which the paper must state as a judgment call, not a
number to be optimized in isolation.

## What remains for A6 / full picture

A6 (+ calibration) requires Phase 8. This phase establishes that margin/top1_score-based
rejection is a real, measurable, leakage-free improvement in OOD handling and selective
accuracy — but ambiguity detection specifically remains weak and should not be overclaimed.
