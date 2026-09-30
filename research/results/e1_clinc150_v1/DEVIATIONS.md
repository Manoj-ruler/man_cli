# E1 deviation log (protocol §6.9)

**Protocol:** `research/publication_tasks/e1/E1_PROTOCOL.md`, frozen at git tag `e1-protocol-v1`
(`970c54f`, 2026-09-30).

## Deviations

**None.**

- Every E1 step ran the frozen code unchanged, confirmed by
  `git diff --exit-code e1-protocol-v1 -- research/publication_tasks/e1 research/experiments/e1_score_queries.js research/experiments/e1_analyze.js`,
  which gave exit 0 before E1-11 and before E1-13.
- Those steps were E1-11 (scoring and decisions), E1-12 (checks) and E1-13 (summary).
- No population, exclusion, threshold, α, rounding rule, comparison, B or seed was changed.

## Reporting notes (not deviations: no analysis changed)

These notes explain how two values in `summary.md` are printed. The values in `summary.json` are
the ones computed under the protocol.

1. **N1: rounding in the v0.2 comparison line.**
   - `summary.md` prints "R2 − R3: E1 0.0826" for P1, because `v02Comparison` subtracts the two
     rates after rounding them to 4 dp (0.8602 − 0.7776).
   - The exact difference is (731 − 359)/4500 = 0.082667, which the primary comparison reports as
     **0.0827**. **The primary field is authoritative.**
   - For P2 the two agree (0.834 − 0.781 = 0.053).
2. **N2: underflow in the exact McNemar p-value.**
   - For P1's secondary pairs R3 − R1 (discordant counts 2,360 and 0) and R2 − R1 (2,732 and 0),
     `exactMcNemar` returns 0.
   - The exact value 2 · 0.5^n (n = 2,360 or 2,732) is below the smallest positive double, so the
     true p is **< 1e-300**, not 0.
   - These p-values are labelled "ignores clustering". The protocol's inference for these pairs is
     the cluster-bootstrap interval.
