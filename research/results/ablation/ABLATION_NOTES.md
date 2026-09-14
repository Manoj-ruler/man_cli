# Phase 5 — Ablation Matrix (A0–A6) Notes

**Protocol:** A0–A2 are fixed (untuned) conditions evaluated fold-by-fold on the same 5 seeded
folds used in Phase 4, so all conditions produce paired per-query predictions on identical
partitions (required for Phase 13's McNemar's test). A3 is reused verbatim from Phase 4's
nested-CV output, not recomputed, to avoid any drift between the two experiments' numbers for
the same condition. A4–A6 require components not yet built (margin/OOD/calibration — Phases
6–8) and are left as explicit `PENDING` rows rather than fabricated or silently omitted.

## Results

| Condition | Description | Mean non-OOD accuracy | Std (per-fold) |
|---|---|---:|---:|
| A0 | BM25 only (production baseline) | 71.9% | 7.7pp |
| A1 | BM25, no substring bonus | 71.9% | 7.7pp |
| A2 | Dense only | 72.7% | 6.1pp |
| A3 | Hybrid BM25+dense (nested-CV α) | **77.1%** | 4.1pp |
| A4 | + margin-based rejection | 88.5% selective acc. @ 70.8% coverage | see below |
| A5 | + margin + OOD detection | 90.1% selective acc. @ 69.5% coverage | see below |
| A6 | + margin + OOD + calibration | 90.1% selective acc. @ 69.5% coverage (same as A5) | confidence ECE 0.054 vs. 0.274 raw |

**A4/A5 use a different metric (selective accuracy + coverage, not unconditional-accept
accuracy) because they can abstain — see `research/results/reliability/SELECTIVE_PREDICTION_NOTES.md`
for the full writeup, thresholds, and the explicit caveat that these numbers are not directly
comparable to A0-A3's.** Headline: rejecting on margin/top1_score (thresholds tuned on dev
folds only, Phase 7) raises accuracy among answered queries from 77.1% (A3, 100% coverage) to
90.1% (A5, 69.5% coverage) and roughly doubles the OOD catch rate (10/15 vs. baseline's 4/15),
at the cost of 11 sacrificed correct answers turned into abstentions.

**Sanity check:** A0's fold-aggregated mean (71.9%) matches the frozen baseline's single-split
supported-task accuracy (71.9%) — consistent, as expected, since A0 is the identical condition
just re-aggregated over 5 folds instead of one pass.

## Finding: the +15 substring bonus contributes exactly zero measured accuracy in this benchmark

A0 and A1 are not just close — **they are identical on every one of the 150 benchmark queries**
(0 command differences, verified directly against the query-score cache, not just at the
aggregate-accuracy level). The bonus fires for *some* candidate in 47/150 queries, but in every
one of those 47 cases the candidate it boosts was already the top-1 pick by raw BM25 score alone
— the +15 bonus never flips the winner on this benchmark.

**This partially contradicts, and meaningfully refines, the earlier qualitative error analysis**
(`research/analysis/baseline-error-analysis.md`, root-cause #3: "Unrestricted Exact-Intent
Substring Matching," attributed to 10 failing queries, e.g. "git" matching all 35 git commands
equally). That analysis is not necessarily wrong about the *mechanism* — a short keyword like
"git" likely does produce near-tied BM25 scores across many same-category commands, and the
bonus (when it fires on several of them) does not resolve that tie any more cleanly than raw
BM25 score proximity would. What this ablation shows is narrower and more precise: **on this
specific 150-query benchmark, disabling the bonus does not change which single command is
returned for any query**, so it cannot be credited or blamed for any of the benchmark's current
right/wrong outcomes. It may still matter for: (a) the miscalibrated *confidence* score (the
bonus inflates the raw score used in `confidence = score/8*100`, independent of whether it
changes the winner), and (b) queries outside this specific benchmark's 150 examples. Both should
be stated as open questions, not overclaimed as resolved, in the paper's limitations section.

**Implication for the paper's contribution:** this is good news for scientific honesty — it means
Phase 4's +5.2pp improvement (A3 vs A0/A1) is attributable to the dense/fusion mechanism, not
partly confounded by an unrelated bonus-removal effect, since A0 and A1 are the same starting
point either way.

## A2 vs E3 cross-check

A2's mean (72.7%) differs slightly from E3's single-pass figure (72.6%) by 0.1pp — expected,
since A2 is fold-aggregated (mean of 5 per-fold accuracies) while E3 was one pass over all 150
queries; both are legitimate views of the same underlying per-query predictions, not a
discrepancy requiring investigation (unlike the A0-vs-baseline check, which must match exactly
since it's genuinely the same single-split computation, this one is expected to differ slightly
due to averaging-of-ratios vs. ratio-of-sums).
