# Limitations

Stated explicitly and in full, not minimized. Every limitation below is grounded in something
observed during this research program, not a generic disclaimer.

## Benchmark size and composition

`termassist_bench v0.1` has 150 queries — adequate for the accuracy comparisons (A0 vs. A3
reaches significance), but the OOD subset (15 queries) is too small to statistically confirm the
otherwise large (+20pp) OOD rejection improvement (Phase 13: p=0.25, not significant). The
ambiguous subset (14 queries) and ordinal risk categories (5 CRITICAL, 10 MEDIUM) are similarly
thin. A larger benchmark, especially with more OOD and ambiguous examples, is the single highest-
value piece of future work identified by this program.

## Single-platform corpus

The corpus and benchmark are filtered to `win32` (Windows PowerShell/CMD). The retrieval methods
themselves are platform-agnostic, but no cross-platform (Linux/macOS) evaluation was performed.
Category-level accuracy (e.g., strong git/filesystem performance) may not generalize to
categories more platform-specific in phrasing.

## Hand-authored benchmark queries

All 150 queries, including the 15 "out-of-domain" and 14 "ambiguous" examples, were authored by
the benchmark's creators to probe specific failure modes, not sampled from real user logs. This
is a common and defensible benchmark-construction method (matching NL2Bash's own StackOverflow-
sourced-then-filtered methodology), but real-world query distributions may differ, particularly
in how often genuinely out-of-scope or ambiguous requests occur in practice.

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

Phase 7's margin-based ambiguity detector reaches only F1=0.310 (precision 0.205, recall 0.643) —
a real signal (AUROC 0.784) but not a strong detector. This is reported as an open problem, not
patched by adding rules tuned to this specific benchmark's 14 ambiguous examples (which would be
equivalent to tuning on the test set).

## Isotonic calibration's small-sample sensitivity

Phase 8 uncovered and fixed a real implementation bug (tied x-values not pre-aggregated before
PAV) that was specifically triggered by this benchmark's small size and heavy value-ties (110/150
production confidences pinned at exactly 100%). While the fix is now verified correct and
permanently guarded by an assertion, this episode is itself evidence that isotonic calibration on
a dataset this small requires care, and the reported calibration numbers (pooled across 5 test
folds) should be read as "calibration measurably helps here," not "this exact calibration mapping
is production-ready without validation on more data."

## Rule-based safety classifier gaps

Phase 11's classifier is not perfect on the finer 4-tier distinction (89.6% exact accuracy);
specific documented gaps (`Stop-Process -Force`, `git merge` not covered by any current rule)
were deliberately left unpatched to avoid tuning against this benchmark's specific examples. The
classifier's strong result on the actionable risky/not-risky binary (95%/95%) should not be read
as claiming perfect coverage of all possible destructive command patterns.

## Scope: retrieval, not generation

TermAssist retrieves from a fixed, pre-vetted 431-command corpus; it cannot answer requests
outside that corpus's coverage (by design — this is also its safety argument). It is not
comparable, in a head-to-head accuracy sense, to open-vocabulary generation systems (NL2Bash,
NL2SH, LLM-based approaches), which solve a different, harder problem at the cost of the
hallucination/safety risks this design avoids. Any comparison in the manuscript is qualitative
and contextual, never a claimed numeric win over generation-based systems.
