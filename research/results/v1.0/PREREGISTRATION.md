# TermAssist v1.0 — Preregistration (Spec §8.1)

Written **before** any v1.0 final experiments are run, to lock hypotheses, tests, and the
multiple-comparison family in advance (gate D-4). Git commit timestamp is the registration time.
This document is append-only after registration; any deviation must be recorded as a dated
amendment, never a silent edit.

## Context

The v1.0 benchmark and expanded corpus are **not yet built** (both are human-gated — see
`research/V1.0_BUILD_STATUS.md`). This preregistration governs the v1.0 confirmatory experiments
that will run once those human-gated inputs exist. It also formally registers the analysis already
applied to v0.1/v0.2 (bootstrap CIs + Holm), so those corrected results are covered.

## Primary hypothesis (H1)

**Post-hoc isotonic calibration reduces Expected Calibration Error of the hybrid retrieval
system's confidence signal on held-out folds**, relative to the raw fused-score confidence.
- Test: paired bootstrap (10k resamples, seed 42) one-sided p for ECE(before) − ECE(after) > 0,
  on pooled nested-CV held-out predictions.
- Decision: supported iff Holm-adjusted p < 0.05 within the primary family (below).
- Registered expectation: SUPPORTED (this is the robust result on v0.1+v0.2; registered as
  primary because it is the paper's intended headline).

## Secondary hypotheses

- **H2 (OOD):** the tuned reliability threshold rejects true OOD queries at a higher rate than the
  frozen baseline's fixed threshold. Test: exact McNemar on paired per-query rejection. Expectation:
  SUPPORTED on a benchmark with ≥40 OOD queries; UNDERPOWERED below that (v0.1 n=15 was).
- **H3 (accuracy, exploratory — NOT expected robust):** hybrid > BM25 supported-task accuracy.
  Test: exact McNemar + paired bootstrap CI. Registered expectation: **benchmark-composition-
  sensitive; may not replicate.** (v0.1 significant, v0.2 not — registered as fragile in advance.)
- **H4 (generalization):** H1/H2/H3 effects under intent-held-out (GroupKFold) evaluation are not
  materially smaller than under class-stratified CV. Test: A→B delta with bootstrap CI.
  Expectation: accuracy/OOD robust; calibration attenuated (observed on v0.2 Split B).

## Multiple-comparison family (Holm, m=4, per benchmark version)

Fixed in advance: {A0-vs-A3 accuracy (McNemar), A2-vs-A3 accuracy (McNemar), baseline-vs-tuned OOD
rejection (McNemar), calibration ECE reduction (paired bootstrap)}. A result is "significant" only
at Holm-adjusted p < 0.05. Any additional comparisons are exploratory and labeled as such.

## Leakage commitments (registered, non-negotiable)

- All of {α, OOD threshold, ambiguity threshold, isotonic calibrator} are selected on development
  folds only, never on the fold they are scored on. Verified via the split registry + config log.
- Split B (intent-held-out) enforces no `intent_group_id` shared between a fold's tuning and test
  partitions (asserted programmatically; run aborts otherwise).
- No threshold or hypothesis is altered after observing any final-test (Split C) result.
- Control queries (`is_control=true`, verbatim-from-corpus canonical) are excluded from every
  headline capability metric.

## Metrics registered in advance

Accuracy (supported-task, non-OOD), ECE (10-bin) + Brier, OOD AUROC + rejection rate + F1,
ambiguity F1/AUROC, risk–coverage AUC, safety precision/recall + dangerous-direction miss rate.
All reported on v0.1 (frozen) + v1.0, Split A + Split B, with bootstrap 95% CIs where §8.2 requires.

## What would falsify the paper's intended framing

If H1 (calibration) fails to reach Holm-adjusted significance on the v1.0 benchmark, the paper's
primary contribution collapses and the framing must change — this is registered so that outcome
cannot be quietly reinterpreted after the fact.
