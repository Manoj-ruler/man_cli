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

## One discrepancy noted here, fully resolved in Phase 9

`mean_confidence_on_wrong_pct` came out 86.1% in this script vs. 87.7% previously reported in
`research/analysis/baseline-error-analysis.md`. Since every individual query's retrieved command,
score, confidence, and evaluation status matches the archive exactly (0 mismatches), this was
**not** evidence of non-determinism. **Resolved in Phase 9:** `research/analysis/analysis_intermediate.json`
(the underlying data file that `baseline-error-analysis.md`'s prose was generated from) itself
records `meanConfIncorrect: "86.06"` -- matching this script's 86.1% figure exactly. The 87.7%
in the prose was a transcription error made when writing that document, not a data or
definitional discrepancy; it has been corrected in `baseline-error-analysis.md` with an erratum.
**86.06% (86.1%) is the canonical, three-times-independently-verified value** going forward. The
canonical definition of "wrong" used consistently by every downstream script in this research
program is `INCORRECT` + `AMBIGUOUS_INCORRECT` + `OOD_FALSE_ACCEPT` (excluding `REJECTED`, which
already carries confidence=0 and is a separate outcome category, not a confident-but-wrong one).

## Conclusion

The frozen baseline (`cli/search.js` at commit `4443ec016c87895ebbc1b9be831e5f80b9bd3b50`) is
independently reproducible on a clean run, confirming Phase 1's requirement. No production code
was modified to achieve this reproduction — the only new artifact is the CRLF-tolerant hash check
in `reproduce_baseline.js`, justified in Phase 0's audit.
