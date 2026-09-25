# Independent Review Results — Cohen's κ (spec §4.4)

**Date:** 2026-09-25
**Result: κ = 0.6316 — BELOW the pre-specified target of κ ≥ 0.7.**

This is reported as computed, without adjustment. Per this project's standing rule (established
across every prior below-target or non-replicating result — the v0.2 accuracy non-replication, the
Split B calibration attenuation, the OOD underpowering on v0.1): report it plainly, investigate why,
do not hide it, do not re-sample to try to fix the number.

## What was measured

A stratified, seed-42, blind sample of 14/59 v0.2 AI-authored benchmark queries (8 of the 35 OOD
candidates, 6 of the 24 AMBIGUOUS candidates — `research/experiments/build_independent_review_sample.js`)
was reviewed by an independent judge, blind to the original labels, choosing fresh among three
categories (A = single clear command, B = genuinely ambiguous, C = not a shell-command request at
all / OOD) for each bare query text. `research/experiments/compute_kappa.js` compared these 14
judgments against the original labels.

- Observed agreement: 78.6% (11/14)
- Expected agreement by chance: 41.8%
- **Cohen's κ = 0.6316**

Raw data: `review_sheet.json` (filled answers), `ANSWER_KEY_do_not_share_with_reviewer.json`
(original labels), `kappa_results.json` (full computation).

## Disclosure: reviewer independence is partial, not full

The independent reviewer was the project's own human director — someone who set the overall
direction for the original v0.2 authoring process but had not seen these specific 14 queries'
labels before this review, and was shown only bare query text with categories A/B/C, no hints.
This is a real, meaningful independence check (the reviewer was not told which label a query
originally received and could not infer it from the shuffled, unlabeled sheet), but it is **not
full-stranger independence** — a fully naive third-party annotator with no prior involvement in the
project would be a stronger check still. This caveat is stated wherever this κ result is cited.

## The result is not uniform — it is sharply localized

The critical finding is in the per-category breakdown, not the blended κ:

| Original category | Items | Agreement |
|---|---|---|
| OOD | 8 | **8/8 (100%)** |
| AMBIGUOUS | 6 | **3/6 (50%)** |

All three disagreements are OOD→AMBIGUOUS-adjacent in the same direction: the original v0.2
labeling called each AMBIGUOUS, the independent reviewer called each A (single clear command).

| Query | Benchmark ID | Original label | Reviewer judgment |
|---|---|---|---|
| "list running processes" | TA-B206 | AMBIGUOUS | A (single clear command) |
| "ffmpeg" | TA-B191 | AMBIGUOUS | A (single clear command) |
| "pip" | TA-B201 | AMBIGUOUS | A (single clear command) |

All three are short, bare-keyword-style queries. The original v0.2 methodology labeled bare tool
names and short category phrases as AMBIGUOUS by extension of v0.1's own precedent (v0.1 already
treats bare keywords like `git`/`docker` as ambiguous, since they admit many valid subcommands).
The independent reviewer instead judged each of these three as having one sufficiently obvious
*default* interpretation (e.g., `pip install <package>`, `ffmpeg -i input output`, `Get-Process` /
`ps aux`) despite the same multiple-valid-subcommand fact pattern. This is a genuine, defensible
difference in annotation philosophy — not an error by either side — but it means the original
AMBIGUOUS criterion for bare-keyword queries is measurably looser than an independent reviewer's,
and this is exactly the category the project's own results already flagged as weak (F1 0.31–0.50,
`research/results/v0.2/SPLIT_B_NOTES.md` and the ablation notes).

## What this does and does not affect

- **Does not affect the OOD-detection claim.** The paper's strongest surviving-Holm-correction
  result on v0.2 (OOD rejection improvement, Holm-adjusted p = 0.00006) rests on the OOD label set.
  The independent check found **perfect agreement (8/8)** on the OOD-labeled sample — this is
  corroborating evidence, not just an absence of disconfirming evidence, for the reliability of the
  v0.2 OOD labels specifically.
- **Sharpens, not newly discovers, the ambiguity-detection weakness.** The paper already reports
  ambiguity detection as the weakest, least reliable component (low F1, attenuated under Split B).
  This κ result adds a second, independent line of evidence for the same conclusion, now localized
  to a specific, nameable cause: bare short/keyword-style queries are where AMBIGUOUS-vs-CORRECT
  label judgment is least stable, both in the system's own detection performance and in human
  annotation agreement about what the "true" label should even be.
- **Small-N caveat.** n=14 (6 AMBIGUOUS items) is a small base for both the blended κ and the
  category breakdown; a single flipped item would materially move both numbers. The category
  decomposition (8/8 vs 3/6) is reported instead of over-interpreting the single blended κ, but
  it should itself be read as indicative, not conclusive, at this sample size.

## Bottom line for the paper

State plainly: independent re-validation of a stratified 24%-sample of v0.2's AI-authored queries
yields κ = 0.6316, below the pre-specified κ ≥ 0.7 target, with the disagreement entirely
concentrated in the AMBIGUOUS category (3/6, all bare-keyword-style queries) and zero disagreement
in the OOD category (8/8). The OOD-detection claim — the paper's strongest v0.2-specific result —
is independently corroborated. The ambiguity-detection claim, already the weakest result in the
paper, now additionally carries a disclosed, quantified label-reliability concern specific to
bare-keyword queries, and should not be strengthened beyond its existing cautious framing.
