# Statistical Hardening (Spec §8.2) — Bootstrap CIs + Holm Correction

Applied to the **existing** v0.1 and v0.2 results (no experiments re-run; this adds the CIs and
multiple-comparison correction the audit flagged as missing). Scripts:
`run_bootstrap_ci.js`, `apply_holm_correction.js`. Seed 42, 10,000 resamples.

## Bootstrap 95% CIs

| Quantity | v0.1 | v0.2 |
|---|---|---|
| Acc delta A0→A3 | +5.2pp, CI [2.2, 8.9] | +3.8pp, CI [0.6, 7.5] |
| Acc delta A2→A3 | +4.4pp, CI [−0.7, 9.6] | +6.9pp, CI [1.9, 11.9] |
| ECE before (hybrid) | 0.274, CI [0.208, 0.344] | 0.324, CI [0.265, 0.380] |
| ECE after (hybrid) | 0.054, CI [0.026, 0.113] | 0.074, CI [0.052, 0.130] |
| ECE reduction (paired) | 0.221, CI [0.128, 0.283], p≈1e-4 | 0.250, CI [0.172, 0.295], p≈1e-4 |

**Before/after ECE CIs do not overlap on either benchmark** → calibration improvement is robust.
**A0→A3 accuracy delta CI excludes 0 on both**, but on v0.2 only marginally ([0.6, 7.5]) and
**method-divergent** from the exact McNemar test (p=0.070, not significant) — the two methods
disagree at the 0.05 boundary because McNemar's exact test on only 8 discordant pairs (7 vs 1) is
discrete and conservative. Reported as: the accuracy improvement is **borderline and
method-dependent on v0.2**, reinforcing "fragile, not robust." A2→A3 delta CI includes 0 on v0.1,
excludes 0 on v0.2 — the flip already documented.

## Holm–Bonferroni (primary family, m=4, per version)

Significant iff Holm-adjusted p < 0.05.

| Comparison | v0.1 raw → Holm | v0.2 raw → Holm |
|---|---|---|
| A0-vs-A3 accuracy | 0.0156 → **0.0469 ✓** | 0.0703 → 0.0703 ✗ |
| A2-vs-A3 accuracy | 0.146 → 0.292 ✗ | 0.0127 → **0.0255 ✓** |
| baseline-vs-tuned OOD | 0.25 → 0.292 ✗ | 0.000015 → **0.00006 ✓** |
| calibration ECE reduction | 0.0001 → **0.0004 ✓** | 0.0001 → **0.0003 ✓** |

## What survives multiple-comparison correction (the defensible claims)

1. **Calibration reduces ECE — significant on BOTH benchmarks after Holm** (0.0004, 0.0003). Rock-solid.
2. **OOD detection improvement — significant on the powered v0.2 benchmark after Holm** (0.00006).
3. **BM25→hybrid accuracy — barely survives on v0.1 (Holm 0.047), fails on v0.2 (0.070).** Not robust.
4. **A2→A3 (dense vs hybrid) — survives only on v0.2 (Holm 0.025), not v0.1.** Benchmark-dependent.

**Net:** after proper correction, the reliability results (calibration, OOD) are the claims that
hold; the accuracy-superiority claims are benchmark-fragile. This is exactly the audit's verdict,
now established with multiple-comparison rigor rather than uncorrected single p-values.
