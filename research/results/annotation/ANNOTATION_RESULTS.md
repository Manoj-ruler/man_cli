# Annotation study results (protocol section 4, as pre-declared)

Inputs: annotator_1.csv (ab6b5360e617…), annotator_2.csv (564f5c8088eb…), no adjudication yet.

## Primary reliability estimate

Unweighted Cohen's kappa, 3 classes, 78 items (58 targets + 20 controls; TA-B187 excluded): **κ = 0.980**, 95% bootstrap CI [0.937, 1.000]; percent agreement 98.7%.

Targets only (58): κ = 0.967, 95% CI [0.897, 1.000], agreement 98.3%.

| annotator 1 \ 2 | CLEAR | AMBIGUOUS | OOD |
|---|---:|---:|---:|
| CLEAR | 21 | 0 | 0 |
| AMBIGUOUS | 1 | 20 | 0 |
| OOD | 0 | 0 | 36 |

## Pre-declared criteria

- κ ≥ 0.7: **MET** (κ = 0.980)
- OOD confirmed (both annotators agree with the original on ≥ 90% of OOD targets): **MET** (35/35 = 1.000)

Both criteria met.

## Per-item outcomes vs the original label (58 targets)

| original | CONFIRMED | REVERSED | CONTESTED |
|---|---:|---:|---:|
| OOD | 35 | 0 | 0 |
| AMBIGUOUS | 18 | 4 | 1 |

Benchmark-defect item(s) reported separately: TA-B187 (original AMBIGUOUS; annotators OOD/AMBIGUOUS).

## Secondary (descriptive)

- κ OOD vs not-OOD: 1 [1,1]; AMBIGUOUS vs not: 0.9669 [0.885,1]
- κ of each annotator vs the original labels: 0.8607 / 0.841
- Agreement when both confidence ≥ 2: 77/78; when either said 1: 0/0
- Contested targets, record ids cited: 1 × disjoint records (disagree about the LIST)
- Controls: 0 with annotator disagreement, 3 where both said not-CLEAR (flagged ids: TA-B103, TA-B094, TA-B106); canonical attention checks missed: annotator 1 = 0/4, annotator 2 = 0/4. Control disputes are NOT adjudicated under the protocol; look at them by hand.

## Comparison with the first blind review (14 overlapping items)

Agreement with the first reviewer: annotator 1 11/14, annotator 2 11/14; the two annotators with each other 14/14; original label vs first reviewer 11/14.

## Adjudication

Not yet supplied. REVERSED items are not relabeled and CONTESTED items are excluded until a third reader adjudicates.

## Reminders from the protocol

- Any label change produces a NEW benchmark version (v0.2.1). Re-run the fixed analysis family on it and report next to v0.2; it is exploratory again.
- Not allowed after labels exist: choosing/replacing/dropping annotators, changing the kappa variant, or merging classes as the primary analysis.
- Precision: this is a reliability estimate for one pair of annotators.
