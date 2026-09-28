# Phase 1 analysis corrections (T1–T5) — results and what they mean for the paper

Date 2026-09-28. Run with `node research/experiments/run_phase1.js`.

**Status:** post hoc and exploratory. All v0.1/v0.2 results were known before these analyses were written.

**How the numbers were checked**
- Every script first reproduces the committed numbers it builds on (156 checks in total) and aborts if any check fails.
- Two full runs gave identical outputs, excluding timestamps.
- Bootstrap: 10,000 resamples, seed 42, percentile 95% intervals.

## T1 — Canonical controls excluded (`phase1_t1_controls_excluded.json`)

All 25 canonical queries are verbatim corpus intents, and every system answers all of them correctly.

| | v0.1 all | v0.1 without controls | v0.2 all | v0.2 without controls |
|---|---|---|---|---|
| BM25 | 97/135 (71.9%) | 72/110 (65.5%) | 120/159 (75.5%) | 95/134 (70.9%) |
| Dense | 98/135 (72.6%) | 73/110 (66.4%) | 115/159 (72.3%) | 90/134 (67.2%) |
| Hybrid | 104/135 (77.0%) | 79/110 (71.8%) | 126/159 (79.2%) | 101/134 (75.4%) |
| BM25→hybrid | +5.2pp | +6.4pp [1.8, 10.9], p=0.0156 | +3.8pp | +4.5pp [0.7, 9.0], p=0.0703 |
| Dense→hybrid | | +5.5pp [0.0, 11.8], p=0.146 | | +8.2pp [2.2, 14.2], p=0.0127 |

- **Significance:** the discordant pairs don't change, since controls are always concordant, so the p-values are identical. Only the levels and effect sizes move.

Calibration (isotonic) with the controls excluded from both fitting and evaluation:

| Signal | v0.1 ECE, rel. reduction | v0.1 p | v0.2 ECE, rel. reduction | v0.2 p |
|---|---|---|---|---|
| Baseline (shipped) confidence | 0.323 → 0.069 (−78.6%) | ≤0.0001 | 0.293 → 0.063 (−78.5%) | ≤0.0001 |
| Hybrid confidence | 0.329 → 0.108 (−67.1%) | ≤0.0001 | 0.368 → 0.071 (−80.8%) | ≤0.0001 |
| Margin | 0.335 → 0.136 (−59.4%) | ≤0.0001 | 0.304 → 0.079 (−74.1%) | ≤0.0001 |
| Dense similarity | 0.104 → 0.095 (−8.3%) | 0.27 | 0.084 → 0.042 (−50.1%) | 0.10 |

- **Paper impact:** headline accuracy should exclude the controls. The claim that "calibration reduces ECE for all four signals" must go: the dense signal's reduction is not significant once the controls are excluded (it was already nearly calibrated).

## T2 — OOD by source and subtype (`phase1_t2_ood_breakdown.json`)

Subtype labels: `research/datasets/ood_subtypes_v0.2_ai_assigned.json`, assigned by the AI assistant and **not human-validated**. The source grouping is objective.

Numbers below use the v0.2 run (Split A thresholds).

| OOD group | n | Detector rejects | Baseline rejects | McNemar p | AUROC [95% CI] |
|---|---|---|---|---|---|
| All | 50 | 34 | 17 | 1.5e-5 | 0.900 [0.843, 0.949] |
| Original v0.1 OOD | 15 | 9 | 4 | 0.0625 | 0.858 [0.734, 0.957] |
| Added in v0.2 | 35 | 25 | 13 | 0.0005 | 0.918 [0.853, 0.968] |
| **Terminal-task OOD** (near + unsupported tool) | **10** | **4** | **0** | 0.125 | **0.787** [0.625, 0.925] |
| Other OOD (far + non-terminal + nonsensical) | 40 | 30 | 17 | 0.0002 | 0.928 [0.871, 0.972] |
| Non-terminal only | 34 | 25 | 14 | 0.001 | 0.936 |

In the v0.1 run, the detector rejects 2 of the 10 terminal-task OOD queries and the baseline rejects 0.

**False rejections** (legitimate queries the detector rejects; the baseline rejects none):

| | v0.1 | v0.2 |
|---|---|---|
| Rejected | 6/135 (4.4%, CI 2.1–9.4%) | 11/159 (6.9%, CI 3.9–12.0%) |
| Of which the hybrid had answered correctly | 0 | 3 |

- **Trade-off on v0.2:** 17 OOD queries newly rejected vs. 3 correct answers withheld.
- **Label question:** TA-B086 "edit my crontab using vim" is labeled OOD, but the corpus contains `crontab -e` (tac-0232).
- **Paper impact:** the OOD significance comes from easy non-computing requests. On terminal-task OOD, the detector is much weaker (AUROC 0.79, 4/10), and n=10 is far too small to test. Report this breakdown and the false-rejection cost.

## T3 — Selective prediction without tie-order dependence (`phase1_t3_selective_ties.json`)

The hybrid's confidence is exactly 1.0 for 64% (v0.1) and 53% (v0.2) of queries; the baseline's is at its maximum for 73% and 61%. Expected risk under a random order within ties:
- **v0.1 hybrid at 50% coverage: 8.3%.** Depending on tie order it ranges from 0% to 10.7%. The paper's 10.7% is the worst case.

| | v0.1 hybrid | v0.1 baseline | v0.2 hybrid | v0.2 baseline |
|---|---|---|---|---|
| AURC (tie-aware) | 0.125 [0.074, 0.185] | 0.221 [0.153, 0.297] | 0.163 [0.113, 0.221] | 0.229 [0.168, 0.297] |
| Hybrid − baseline AURC | −0.096 [−0.148, −0.045] | | −0.067 [−0.111, −0.023] | |
| Correctness AUROC | 0.858 [0.789, 0.921] | 0.755 [0.680, 0.825] | 0.889 [0.841, 0.932] | 0.830 [0.774, 0.881] |

- **Without the controls:** the AURC difference holds (−0.115 [−0.177, −0.054] on v0.1; −0.075 [−0.126, −0.024] on v0.2).
- **Detection AUROC, pooled:** OOD 0.855 [0.732, 0.953] (v0.1) and 0.900 [0.843, 0.949] (v0.2); ambiguity 0.790 [0.671, 0.887] and 0.725 [0.633, 0.809]. The committed values are means over folds (0.867/0.901 and 0.784/0.723).
- **Paper impact:** this is a decision-level reliability result, stronger than ECE: the hybrid's confidence ranks correct above wrong answers better than the shipped confidence, and the difference survives excluding the controls. Replace the 10.7% figure with tie-aware numbers or AURC.

## T3b — AUGRC next to AURC (`phase1_t3b_augrc.json`, added 2026-09-28, decision D5)

**Why.** Traub et al. (NeurIPS 2024) argue AURC over-weights errors made at low coverage. They propose
AUGRC: the area under the curve of (errors among answered queries) / n, i.e. the average rate of
undetected failures. Lower is better.

**How.** Computed on the same tie-aware curve as T3. The script first reproduces the T3 AURC values
and checks the exact identity AUGRC = acc·(1−acc)·(1−AUROC) + (1−acc)²/2 (16 checks, all passed).

| | v0.1 hybrid | v0.1 baseline | v0.2 hybrid | v0.2 baseline |
|---|---|---|---|---|
| AUGRC, all queries | 0.077 [0.049, 0.109] | 0.118 [0.085, 0.157] | 0.105 [0.078, 0.137] | 0.132 [0.101, 0.167] |
| Hybrid − baseline | −0.041 [−0.062, −0.021] | | −0.027 [−0.045, −0.010] | |
| AUGRC, controls excluded | 0.105 [0.069, 0.145] | 0.153 [0.110, 0.200] | 0.132 [0.098, 0.170] | 0.162 [0.125, 0.202] |
| Hybrid − baseline, controls excluded | −0.048 [−0.073, −0.024] | | −0.030 [−0.050, −0.011] | |

**Reference points.** AUGRC is (1−acc)²/2 when every error is ranked last and (1−acc)/2 for a random
ranking. Example: v0.1 hybrid, all queries — oracle 0.047, observed 0.077, random 0.153.

**Paper impact.**
- The selective-prediction result does not depend on the choice of metric: the hybrid's confidence
  beats the shipped confidence on AURC and on AUGRC, on both versions, with and without controls.
- Caveat: AUGRC, like AURC, mixes ranking quality with accuracy. The hybrid is also more accurate, so
  report correctness AUROC (T3) as the pure ranking measure.

## T4 — Calibration comparators (`phase1_t4_calibration_comparators.json`)

ECE and Brier score, all queries, nested Split A:

| Signal | None | Isotonic | Platt | Histogram binning |
|---|---|---|---|---|
| Baseline, v0.1 | 0.269 / 0.254 | 0.117 / 0.173 | 0.068 / 0.179 | 0.026 / 0.179 |
| Baseline, v0.2 | 0.258 / 0.234 | 0.041 / 0.154 | 0.051 / 0.153 | 0.035 / 0.160 |
| Hybrid, v0.1 | 0.274 / 0.257 | 0.054 / 0.122 | 0.100 / 0.147 | 0.014 / 0.159 |
| Hybrid, v0.2 | 0.324 / 0.286 | 0.074 / 0.132 | 0.084 / 0.139 | 0.018 / 0.162 |

- **Isotonic is not special.** All three methods cut ECE by similar amounts, with overlapping bootstrap intervals, on every signal where calibration helps.
- **Histogram binning's low ECE is partly an artifact.** It is scored on the same 10 bins it fits, while its Brier score and ranking are the worst.
- **Brier is the fairer comparison.** On it, isotonic is best or tied for the hybrid signal.
- **Dense similarity:** no method's ECE reduction is significant (every interval includes 0).
- **Calibration does not improve ranking, and here slightly hurts it.** Pooled correctness AUROC drops (hybrid v0.1: 0.858 → 0.804 isotonic, 0.824 Platt, 0.639 binning), because each fold gets its own map and flattening creates ties.
- **Paper impact:** frame it as "the shipped confidence needs recalibration, and standard post-hoc methods fix its level", not "isotonic calibration is the contribution". Lead with the baseline (user-facing) signal and report Brier alongside ECE.

## T5 — Safety recount (`phase1_t5_safety_recount.json`)

A dangerous-direction miss, per spec §7.2, is a high/critical command tagged low *or* medium. The labels are the benchmark's own, not an independent set.

| | Misses, spec definition | Misses, tagged low only | Risky precision | Risky recall | Medium tagged low |
|---|---|---|---|---|---|
| v0.1 gold | 1/20 (CI 0.9–23.6%) | 0/20 | 19/20 | 19/20 | 8 |
| v0.2 gold | 3/22 (CI 4.8–33.3%) | 2/22 | 19/20 | 19/22 | 17 |
| v0.2 retrieved | 2/22 | 1/22 | 20/26 | 20/22 | 17 |

What the misses are:
- **TA-B123 `git checkout -- .` (HIGH→MEDIUM):** a **genuine classifier miss**; the command discards uncommitted work.
- **TA-B194 "system" (HIGH→LOW):** the gold command `Get-EventLog …` is read-only. The HIGH label describes the query's riskiest reading (`sudo reboot`), not the gold command.
- **TA-B203 "stop a process" (HIGH→LOW):** `Stop-Process -Force` is labeled HIGH here but MEDIUM elsewhere in v0.1 (e.g., TA-B009). This is a **label inconsistency**.

**Paper impact:** "no dangerous-direction misses" is false under the spec's definition and false on v0.2 even under the paper's narrower one. Report the counts, the one genuine miss, and the label inconsistencies, or remove safety from the headline.

## What this changes in the paper (feeds T14)

1. **Headline accuracy** excludes the canonical controls; the controls become a sanity-check row.
2. **Calibration:** lead with the shipped baseline confidence and Brier, add the comparators, and drop "all four signals".
3. **Selective prediction:** add AURC and correctness AUROC as the decision-level reliability result, and replace the 10.7% figure.
4. **OOD:** report by type with the false-rejection cost; the result is shown for non-terminal OOD, not for terminal-task OOD.
5. **Safety:** the zero-miss claim is removed.
