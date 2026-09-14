# Phase 8 — Confidence Calibration (E8)

**Protocol:** nested 5-fold CV isotonic regression (PAV). Calibrator fit on dev folds only
(the other 4), applied once to the held-out test fold, pooled across all 5 test folds for
ECE (10 equal-width bins) and Brier score. Isotonic implementation: `research/experiments/isotonic.js`.

## A real bug found and fixed before any number was reported

The first run produced a nonsensical result: `baseline_confidence` and `hybrid_reliability`
appeared to get *worse* after calibration. Rather than report that as a finding, it was
investigated directly: `predict(1.0)` (the value for the 87/119-dev-point pileup at maximum
confidence) returned 0.353, even though true dev-fold accuracy at that exact tied value was
~80%. Root cause: the PAV implementation pushed one point per raw `(x,y)` pair instead of
pre-aggregating tied `x` values first, which let points sharing the identical x=1.0 value split
across two separate blocks with an invalid overlapping x-range (`[0.94,1]→0.353` and
`[1,1]→0.868`) — an artifact of stack-processing order among ties, not a valid isotonic fit.
Since 110/150 (73%) of the production confidence values are exactly 100 (the known saturation
problem this whole project is about), this tie-heavy data was exactly where the bug bit hardest.
Fixed by aggregating tied x-values into a single weighted point before running PAV (standard
practice, matching how scikit-learn's `IsotonicRegression` handles ties internally), and a
permanent overlapping-range assertion was added to `isotonic.js` so this class of bug cannot
silently recur. After the fix, `predict(1.0) = 0.793`, matching the true dev accuracy.

## Results (pooled across 5 test folds, after the fix)

| Variant | ECE before | ECE after | Brier before | Brier after | ECE relative reduction |
|---|---:|---:|---:|---:|---:|
| baseline_confidence (production formula) | 0.269 | **0.117** | 0.254 | 0.173 | 56.7% |
| margin_confidence | 0.342 | **0.112** | 0.255 | 0.132 | 67.2% |
| semantic_confidence | 0.115 | **0.061** | 0.149 | 0.140 | 47.0% |
| hybrid_reliability | 0.274 | **0.054** | 0.257 | 0.122 | **80.4%** |

**All four variants improve after calibration.** `hybrid_reliability` (the hybrid system's
fused top1 score) both starts closest to the classic miscalibration problem (0.274 ECE, similar
to production's 0.269) and ends up the best-calibrated after correction (0.054 ECE, an 80%
relative reduction) — a meaningful, directly-motivated result: this is the exact failure mode
(86.06% mean confidence on wrong answers, 44.9% of failures at 100% confidence -- corrected
figures per the Phase 9 erratum in `research/analysis/baseline-error-analysis.md`) that started
this entire research program.

## Caveat, stated explicitly

This is a small-sample result (150 queries, ~120 per dev fold, with 73% of production
confidence values tied at exactly 100%). Isotonic regression is known to be sensitive to small
samples and heavy ties — which is exactly what caused the bug above, and is also why this
experiment reports **pooled** metrics across all 5 test folds rather than a single held-out
split: pooling is the practical mitigation for small-N variance the plan called for, not a full
solution to it. A larger benchmark (Phase 15/future work: expanding beyond 150 queries) would
allow a real held-out calibration-quality check with tighter confidence intervals; this result
should be read as "calibration measurably helps on this benchmark," not "the calibrated
confidence is production-ready without further validation on more data."

## A6 ablation row (fills in the last PENDING row from Phase 5)

A6 = A5 (hybrid + margin + OOD detection) + calibrated confidence in place of the raw fused
score for any downstream confidence display. Since A5 already defines the accept/reject
decision (via margin/top1_score thresholds, not confidence), calibration's role in A6 is
strictly about the *displayed* confidence number's trustworthiness, not retrieval accuracy or
coverage — so A6's coverage/selective-accuracy numbers are identical to A5's (69.5% / 90.1%),
with the addition that the confidence values now accompanying each answer have an ECE of 0.054
instead of 0.274. This is recorded in `research/results/ablation/ablation-table.csv`.
