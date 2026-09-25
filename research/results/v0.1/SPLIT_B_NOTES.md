# Split B — Intent-Held-Out Generalization on v0.1 (symmetry with v0.2)

Run for symmetry with `research/results/v0.2/SPLIT_B_NOTES.md`, using the identical protocol
(`run_split_b_v0_1.js`, ported line-for-line from `run_split_b_v0_2.js` with only the input/output
paths changed) against the **frozen, untouched** v0.1 benchmark's cached query scores. No v0.1
result file was modified; all outputs are new, additive files under `research/results/v0.1/`.

**Protocol:** GroupKFold by derived `intent_group_id`. **125 groups over 150 queries**, 5 folds
of 30 each. **0 groups split across folds** — verified invariant.

## Results: Split A (class-stratified) vs Split B (intent-held-out), v0.1

| Metric | Split A | Split B | Δ (generalization gap) |
|---|---:|---:|---:|
| Hybrid non-OOD accuracy | 77.1% | **77.0%** | **−0.1pp** |
| OOD detection AUROC | 0.867 | 0.849 | −0.018 |
| OOD detection F1 | 0.500 | 0.483 | −0.017 |
| Ambiguity detection F1 | 0.310 | 0.300 | −0.010 |
| Calibration ECE (before→after) | 0.274→0.054 | 0.274→**0.065** | after +0.011 |

## Interpretation

**The pattern replicates v0.2's Split B finding exactly, at smaller scale**: accuracy is
essentially unchanged (−0.1pp) between class-stratified and intent-held-out evaluation, while OOD
AUROC, OOD F1, and ambiguity F1 all show small, consistent negative shifts, and calibration's ECE
reduction attenuates (80.4% → 76.4% relative reduction) rather than vanishing.

**One honest caveat, predicted before running and confirmed:** v0.1's OOD (15) and ambiguous (14)
classes are small enough that GroupKFold nested tuning leaves thin dev pools (~3 test / ~12 dev
per fold for OOD) — the v0.1 Split B OOD/ambiguity numbers should be read as noisier estimates
than v0.2's (which had 50 and 38 examples respectively), not as a materially different finding.
This is the same underpowering already documented for Split A's v0.1 OOD comparison (n=15,
p=0.25) surfacing again here, not a new problem.

## Cross-benchmark consistency (the actual point of running this)

Having Split B on both benchmark versions lets the generalization claim itself be checked for
replication, exactly as Split A's accuracy/OOD/calibration claims were checked in
`research/results/v0.2/V0.2_FULL_RESULTS_NOTES.md`. Here, unlike the BM25-vs-hybrid accuracy
finding, **the generalization pattern is consistent across both benchmarks**: accuracy/OOD hold up
under intent-held-out evaluation on both v0.1 and v0.2, and calibration attenuates (but remains
substantial) on both. This is itself a small piece of evidence that the generalization finding is
not an artifact specific to v0.2's particular query mix.
