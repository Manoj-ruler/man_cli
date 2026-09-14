# Phase 13 — Statistical Analysis (E12)

**Method:** exact (binomial-based) two-sided McNemar's test on discordant pairs — not the
chi-square approximation, since sample sizes here (n=135 non-OOD, n=15 OOD) are too small for
the chi-square approximation to be trustworthy, per the plan's explicit instruction. 95% Wilson
score confidence intervals for headline proportions (more accurate than the normal approximation
at these sample sizes, especially near 0/1).

## A real bug caught before any p-value was reported

The first run showed A0's accuracy as 64.7%, contradicting every prior phase's established value
of 71.9%. Investigated immediately (a Wilson-CI sanity check computed independently in the same
script correctly showed 71.9%, flagging the inconsistency). Root cause: `A0.per_query` in
`ablation-results.json` includes all 150 queries (OOD included, where `hit` is always false
since there's no gold command to match), not just the 135 non-OOD queries the accuracy figure is
defined over — so `ids135` was silently 150 long, diluting the ratio. Fixed by filtering on the
`classification !== 'OOD'` field present in each record. Re-verified against all four known
accuracy values (71.9/71.9/72.6/77.0%) before trusting any p-value.

## Accuracy comparisons (exact McNemar's, n=135 non-OOD)

| Comparison | Accuracy A | Accuracy B | Diff | Discordant pairs | p-value | Significant (α=0.05) |
|---|---:|---:|---:|---:|---:|---|
| A0 vs A1 | 71.9% | 71.9% | 0.0pp | 0 | 1.000 | No (trivial — 0 discordant pairs, confirms Phase 5's finding that the substring bonus never changes any prediction) |
| A0 vs A2 | 71.9% | 72.6% | 0.7pp | 19 | 1.000 | No |
| **A0 vs A3** | **71.9%** | **77.0%** | **5.2pp** | **7** | **0.0156** | **Yes** |
| A2 vs A3 | 72.6% | 77.0% | 4.4pp | 12 | 0.146 | No |

**The headline hybrid-fusion result (A0 vs A3) is statistically significant** at α=0.05, despite
only 7 discordant query pairs — because all 7 favor A3 with none favoring A0 (a maximally
lopsided discordant split, which is what makes a small McNemar sample significant). **A2 vs A3 is
NOT significant** despite a numerically larger-looking 4.4pp gap, because there are more
discordant pairs (12) split less one-sidedly between the two systems. This is reported exactly as
found — a real, non-overclaimed distinction the paper must respect: claim "hybrid fusion beats
BM25 alone" with statistical backing; do NOT claim "hybrid beats dense alone" with the same
confidence, since that comparison does not clear significance here.

## OOD rejection: baseline vs Phase-7-tuned detector (n=15)

Baseline rejection rate 26.7% (4/15) vs. tuned 46.7% (7/15), 3 discordant pairs, **p=0.25, not
significant**. This is an honest limitation, not hidden: n=15 gives this test very low
statistical power — a non-significant result here does not prove there is no real difference, it
means this sample is too small to establish one with confidence at the conventional 0.05
threshold. The paper should present the OOD improvement as a **directionally consistent,
practically meaningful, but not statistically confirmed** finding given the sample size, and
should recommend a larger OOD-query sample (Phase 15/future work) as the fix, not paper over it.

## 95% Wilson confidence intervals

| Quantity | Point estimate | 95% CI |
|---|---:|---|
| A0 (BM25 baseline) accuracy | 71.9% | [63.7%, 78.8%] |
| A2 (dense) accuracy | 72.6% | [64.5%, 79.4%] |
| A3 (hybrid) accuracy | 77.0% | [69.3%, 83.3%] |
| OOD rejection, baseline | 26.7% | [10.9%, 51.9%] |
| OOD rejection, tuned | 46.7% | [24.8%, 69.9%] |

Note the wide, overlapping CIs on the OOD rejection rates — visually consistent with the
non-significant McNemar's result above, and another honest signal that this specific comparison
needs more data before being reported as confirmed rather than suggestive.

## What the paper can and cannot claim, based on this phase

**Can claim (statistically backed):** hybrid BM25+dense fusion significantly improves supported-
task accuracy over pure BM25 (p=0.016, n=135).
**Cannot claim with the same confidence:** hybrid beats dense alone (p=0.146); the OOD rejection
improvement is statistically confirmed (p=0.25, n=15, underpowered). Both should be reported as
real, measured, directionally consistent findings with explicitly stated significance caveats —
not silently upgraded to "significant" in the manuscript.
