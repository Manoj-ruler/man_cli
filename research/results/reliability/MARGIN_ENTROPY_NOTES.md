# Phase 6 — Margin, Entropy, Top-k Candidate Capture

**Output:** `research/results/reliability/candidates.json` (450 records = 150 queries × 3
systems: lexical/A0, dense/A2, hybrid/A3), each with top-10 ranked candidates, margin,
relative margin, and a normalized-entropy concentration measure.

**Entropy definition (explicit, not a probability):** top-k scores are shifted so the window
minimum is 0, normalized to sum to 1, then Shannon entropy (bits) is computed and divided by
`log2(k)` to get a `normalized_entropy` in [0,1]. This measures score *concentration*, not
calibrated confidence — Phase 8 owns calibration.

## Consistency checks (all pass)

- Lexical: 97 correct + 38 incorrect = 135 non-OOD → 71.9%, exactly matches A0.
- Dense: 98 correct + 37 incorrect = 135 → 72.6%, matches A2/E3 (within rounding).
- Hybrid: 104 correct + 31 incorrect = 135 → 77.0%, matches A3's 77.1% (within rounding, hybrid
  here uses each query's own fold-selected α exactly as A3 did, so this is the same condition).

## Margin and entropy both separate correct from incorrect predictions, across all 3 systems

| System | Mean margin (correct) | Mean margin (incorrect) | Mean margin (OOD) | Ratio correct/incorrect |
|---|---:|---:|---:|---:|
| Lexical | 12.04 | 0.75 | 0.46 | 16.1x |
| Dense | 0.143 | 0.036 | 0.047 | 3.9x |
| Hybrid | 0.284 | 0.057 | 0.126 | 5.0x |

| System | Mean norm. entropy (correct) | Mean norm. entropy (incorrect) | Mean norm. entropy (OOD) |
|---|---:|---:|---:|
| Lexical | 0.607 | 0.786 | 0.724 |
| Dense | 0.761 | 0.838 | 0.774 |
| Hybrid | 0.697 | 0.822 | 0.769 |

Every system shows the expected direction on both signals: correct predictions have a **larger
margin** (more decisively ahead of the runner-up) and **lower entropy** (score mass concentrated
on fewer candidates) than incorrect predictions. OOD queries sit closer to the incorrect
distribution on margin for lexical/hybrid (0.46 and 0.126, both well below their systems'
correct-prediction means), which is the exact signal Phase 7's rejection rule needs — this is a
real, measured basis for OOD detection, not an assumption.

## What this does not yet establish

This is descriptive evidence that the signals separate the classes on average — it is not yet a
tuned decision rule, and no threshold has been chosen on any data (dev or test) at this phase.
Phase 7 must select thresholds on dev folds only, exactly as Phase 4 did for α, before reporting
any OOD precision/recall/F1 number.
