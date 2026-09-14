# Phase 1 — Independent Baseline Reproduction

**Script:** `research/experiments/reproduce_baseline.js` (new script, does not modify or replace
`research/run_baseline.js`, which is left untouched as the original historical artifact).

**Result: EXACT REPRODUCTION.** 150/150 query outcomes (retrieved command + evaluation status)
are byte-for-byte identical to the archived `research/results/baseline-v0.1/baseline-results.json`.
See `reproduction-vs-archive-diff.json` (`mismatches_count: 0`).

## Headline metrics — reproduced vs. archived

| Metric | Archived | Reproduced | Match |
|---|---:|---:|---|
| Overall accuracy | 67.3% | 67.3% | exact |
| Supported-task accuracy | 71.9% | 71.9% | exact |
| Non-ambiguous in-domain accuracy | 78.2% | 78.2% | exact |
| OOD rejection rate | 26.7% | 26.7% | exact |
| OOD false-acceptance rate | 73.3% | 73.3% | exact |
| Ambiguity success rate | 28.6% | 28.6% | exact |
| High-confidence-wrong count (conf ≥ 80%) | 32 | 32 | exact |
| Mean latency | 3.29 ms | 3.54 ms | expected variance (timing, not determinism) |
| P95 latency | 6.46 ms | 5.90 ms | expected variance |

## One discrepancy noted, root-caused, not a reproduction failure

`mean_confidence_on_wrong_pct` came out 86.1% in this script vs. 87.7% previously reported in
`research/analysis/baseline-error-analysis.md`. Since every individual query's retrieved command,
score, confidence, and evaluation status matches the archive exactly (0 mismatches), this is
**not** evidence of non-determinism — it is a definitional difference between which result
statuses count as "wrong" across two independently written analysis scripts (this script's
ad-hoc sanity metric vs. whatever exact filter `compute_analysis_data.js` used originally). This
is flagged here explicitly rather than silently reconciled, and should be resolved in Phase 9
(hyperparameter/metric-definition log) by fixing one canonical definition of "wrong" used by every
downstream script (`INCORRECT` + `AMBIGUOUS_INCORRECT` + `OOD_FALSE_ACCEPT`, excluding `REJECTED`)
before any calibration numbers are computed against it.

## Conclusion

The frozen baseline (`cli/search.js` at commit `4443ec016c87895ebbc1b9be831e5f80b9bd3b50`) is
independently reproducible on a clean run, confirming Phase 1's requirement. No production code
was modified to achieve this reproduction — the only new artifact is the CRLF-tolerant hash check
in `reproduce_baseline.js`, justified in Phase 0's audit.
