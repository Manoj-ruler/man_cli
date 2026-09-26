# Limitations

> **Partly superseded (2026-09-26).** The current, corrected list is the Limitations section of
> `research/paper/acl_latex/content.tex`. This file predates three corrections: v0.2 *extends* v0.1 (not an
> independent benchmark; the 121 answerable queries are identical), the Holm family was fixed after the raw
> results were seen (not pre-registered), and the v0.2 accuracy "non-replication" is decided by one query
> (`research/results/stats/SENSITIVITY_NOTES.md`).

Stated explicitly and in full, not minimized. Every limitation below is grounded in something
observed during this research program, not a generic disclaimer.

## Benchmark size and composition — and a fragile headline result

`termassist_bench v0.1` has 150 queries; its OOD subset (15) was too small to statistically
confirm the otherwise large (+20pp) OOD rejection improvement (p=0.25, not significant). A
follow-up benchmark, `v0.2` (209 queries, OOD grown to 50), was built specifically to test this,
and did resolve it: the same OOD comparison is significant after correction (Holm-adjusted
p=0.00006). But growing the benchmark also surfaced a less comfortable finding this program
reports rather than hides: **the accuracy improvement that was the original headline result
(hybrid vs. BM25, significant at p=0.016 on v0.1) does not survive on v0.2** (raw p=0.070, i.e.
not significant even before correction), and even on v0.1 it only barely survives a
Holm–Bonferroni correction for multiple comparisons (Holm-adjusted p=0.047). **Confidence
calibration is the only comparison that survives correction on both benchmark versions**
(Holm-adjusted p=0.0004 and p=0.0003) — see `research/results/stats/STATS_HARDENING_NOTES.md`.
This means the paper's accuracy claim should be read as benchmark-composition-sensitive, not
robustly established, while the calibration claim is this program's most defensible result. An
intent-held-out (GroupKFold) generalization check, run on both benchmarks, further shows this
pattern is not an artifact of a single benchmark or of intent overlap between tuning and test:
accuracy and OOD detection generalize to unseen command intents essentially unchanged, while
calibration, though still substantial, is measurably attenuated on those same held-out intents
(76.4–69.0% vs. 80.4–77.2% relative ECE reduction) — see `research/tables/table8_split_b_generalization.md`.
A larger benchmark, and independent human re-validation of the AI-authored portions of v0.2 (see
below), remain the highest-value pieces of future work.

## Single-platform corpus

The corpus and benchmark are filtered to `win32` (Windows PowerShell/CMD). The retrieval methods
themselves are platform-agnostic, but no cross-platform (Linux/macOS) evaluation was performed.
Category-level accuracy (e.g., strong git/filesystem performance) may not generalize to
categories more platform-specific in phrasing.

## Canonical queries are a control, not evidence of capability

All 25 canonical-type queries in `termassist_bench v0.1` are verbatim-equal to a corpus `intent`
string (verified directly: 25/25). This is by design — canonical queries are meant as a positive
control, not a test of paraphrase or generalization ability — but it means the reported 100%
canonical accuracy is near-tautological (the system is asked to retrieve the exact text it was
indexed on) and must never be read as evidence of the system's language-understanding capability.
The paraphrase, low-overlap-paraphrase, polysemy, and ambiguous query types are where the actual
capability claims should be grounded; canonical accuracy is reported only as a sanity check that
retrieval itself is not broken.

## Hand-authored and AI-authored benchmark queries

All 150 v0.1 queries, including the 15 original "out-of-domain" and 14 "ambiguous" examples, were
authored by the benchmark's creators to probe specific failure modes, not sampled from real user
logs. This is a common and defensible benchmark-construction method (matching NL2Bash's own
StackOverflow-sourced-then-filtered methodology), but real-world query distributions may differ,
particularly in how often genuinely out-of-scope or ambiguous requests occur in practice. The 59
queries added in `v0.2` (35 new OOD, 24 new ambiguous) were authored and adjudicated by an AI
agent (Claude) under human direction, verified against actual system retrieval output rather than
judged from intuition, and disclosed explicitly as such
(`research/datasets/v0.2_ADJUDICATION_REPORT.md`). **Independent re-validation was subsequently
attempted** (`research/TERMASSIST_RESEARCH_V1.0_SPEC.md` §4.4): a stratified, blind, seed-42 sample
of 14/59 of these queries (8 OOD, 6 AMBIGUOUS) was independently judged by a reviewer with partial
independence — the project's human director, blind to which label each of these 14 specific
queries had originally received, but not a fully uninvolved third party. Result: **Cohen's
κ = 0.6316, below the pre-specified κ ≥ 0.7 target**
(`research/datasets/independent_review/KAPPA_RESULTS_NOTES.md`,
`research/datasets/independent_review/kappa_results.json`). This is reported as measured, not
adjusted. The disagreement is not uniform: agreement was **perfect on the OOD-labeled items (8/8)**
and concentrated entirely in the **AMBIGUOUS-labeled items (3/6)**, all three disagreements being
short, bare-keyword-style queries ("list running processes", "ffmpeg", "pip") that the original
labeling called AMBIGUOUS (following v0.1's own precedent for bare tool-name keywords like
`git`/`docker`) but the independent reviewer judged to have one sufficiently obvious default
command. Practically: the OOD-detection claim, the paper's strongest v0.2-specific result, is
independently corroborated by this check; the ambiguity-detection claim, already the weakest result
in this paper, now additionally carries a disclosed, quantified label-reliability concern specific
to bare-keyword queries, on top of a small (n=14, 6 AMBIGUOUS items) sample size. Full
fully-independent (non-project-affiliated) re-validation reaching κ≥0.7 remains open future work.
Any capability claim resting specifically on the v0.2-only AMBIGUOUS-category queries — as opposed
to claims replicated across both v0.1 and v0.2, or resting on the OOD category — carries this
additional caveat.

## No large-scale human evaluation

This program does not include a human-preference study (e.g., asking users to rate returned
commands, or A/B test the baseline vs. hybrid system in live use). All evaluation is against a
single gold reference (or small `acceptable_commands` set) per query — the same one-to-many
mapping limitation Lin et al. (2018) themselves identified for NL2Bash, inherited here.

## Local embedding model dependency

The dense/hybrid retrieval methods depend on `Xenova/all-MiniLM-L6-v2` (a specific, fixed,
off-the-shelf sentence embedding model). No comparison against alternative embedding models was
performed — the model was a stated design choice (CPU-local, offline-capable), not the output of
a model-selection sweep. Results may vary with a different embedding model.

## Functional evaluation covers only 10% of the benchmark

Phase 10's sandboxed execution testing covers 15/150 queries (git + filesystem categories,
placeholder-free, non-interactive, host-safe gold commands only). Docker, npm, network, ssh,
kubernetes, aws, process, permissions, security, disk, and system categories — 90% of the
benchmark by category count — were excluded, each for a stated reason (network dependency,
host-mutation risk, or destructive-by-nature). The reported 93.3% functional success rate for
retrieved commands should not be assumed to generalize to these excluded categories.

## Ambiguity detection is a known, unresolved weakness

Phase 7's margin-based ambiguity detector reaches F1=0.310 on v0.1 (precision 0.205, recall
0.643) — a real signal (AUROC 0.784) but not a strong detector. On v0.2's larger ambiguous subset
(38 vs. 14), F1 improves to 0.496 but AUROC slightly *decreases* to 0.723, and under
intent-held-out (Split B) evaluation F1 is similarly weak on both benchmarks (0.30 on v0.1, 0.479
on v0.2). This is reported as an open problem under every evaluation protocol tried, not patched
by adding rules tuned to specific benchmark examples (which would be equivalent to tuning on the
test set).

## Isotonic calibration's sensitivity to small samples and to intent generalization

Phase 8 uncovered and fixed a real implementation bug (tied x-values not pre-aggregated before
PAV) that was specifically triggered by this benchmark's small size and heavy value-ties (110/150
production confidences pinned at exactly 100%). While the fix is now verified correct and
permanently guarded by an assertion, this episode is itself evidence that isotonic calibration on
a dataset this small requires care. A second, independently measured sensitivity: under
intent-held-out (GroupKFold) evaluation, calibration's ECE reduction attenuates from
80.4%/77.2% (within-distribution) to 76.4%/69.0% (held-out intents) on v0.1/v0.2 respectively —
still a large improvement, but a real, disclosed degradation, not a hypothetical one. The reported
calibration numbers should be read as "calibration measurably and robustly helps here, with a
measured generalization cost," not "this exact calibration mapping is production-ready without
validation on more data or more diverse intents."

## Rule-based safety classifier gaps

Phase 11's classifier is not perfect on the finer 4-tier distinction (89.6% exact accuracy);
specific documented gaps (`Stop-Process -Force`, `git merge` not covered by any current rule)
were deliberately left unpatched to avoid tuning against this benchmark's specific examples. The
classifier's strong result on the actionable risky/not-risky binary (95%/95%) should not be read
as claiming perfect coverage of all possible destructive command patterns.

## Corpus scale

The corpus is 431 raw records but only 279 unique command intents on the evaluated (win32)
platform — 134 records are cross-platform duplicates of the same intent. 279 is the number that
should be compared against other corpora's scale (e.g. NL2Bash's ~9,000+ pairs); it is small, and
results should not be assumed to hold on a larger or differently-distributed command library. The
corpus schema has been migrated (additively, backward-compatible — re-verified 0/150 mismatch
against the frozen baseline) to support a planned expansion to 500–800 human-validated intents,
but that expansion itself requires human authoring and validation and has not yet been performed
(`research/V1.0_BUILD_STATUS.md`); all results in this program are reported on the original
279-intent corpus.

## Scope: retrieval, not generation

TermAssist retrieves from this fixed, pre-vetted corpus; it cannot answer requests
outside that corpus's coverage (by design — this is also its safety argument). It is not
comparable, in a head-to-head accuracy sense, to open-vocabulary generation systems (NL2Bash,
NL2SH, LLM-based approaches), which solve a different, harder problem at the cost of the
hallucination/safety risks this design avoids. Any comparison in the manuscript is qualitative
and contextual, never a claimed numeric win over generation-based systems.
