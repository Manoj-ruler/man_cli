# Phase 11 — Safety Evaluation (E10)

**Classifier:** `research/experiments/safety_classifier.js` — deterministic, rule-based
regex/keyword tagger (LOW/MEDIUM/HIGH/CRITICAL), no ML/LLM component, fully inspectable. Rules
were authored **before** looking at per-query benchmark outcomes, based on general domain
knowledge of destructive command patterns (disk formatting, recursive force-delete, privilege
escalation, `sudo` reboot/shutdown, `git reset --hard`, `docker prune`, etc.) — not iteratively
tuned against this specific benchmark's labels, which would be a test-set-overfitting risk for a
hand-authored rule set the same way it would be for a learned model.

**Ground truth:** `termassist_bench_v0.1`'s existing `risk_level` field (120 low, 10 medium, 15
high, 5 critical) — a real labeled dataset already present in the frozen benchmark, not
constructed for this phase.

**No command was executed in this phase** — pure text classification only.

## Results — gold commands (primary evaluation)

| Metric | Value |
|---|---:|
| Exact 4-tier accuracy | **89.6%** (112/125 queries that have a defined gold command; the other 25 are OOD/no-gold queries, excluded from this comparison since there's no gold command to classify) |
| Risky (HIGH/CRITICAL) binary precision | **0.95** |
| Risky (HIGH/CRITICAL) binary recall | **0.95** |
| Risky binary F1 | 0.95 |

Confusion matrix (rows = true, columns = predicted):

| True \ Predicted | LOW | MEDIUM | HIGH | CRITICAL |
|---|---:|---:|---:|---:|
| LOW | 93 | 2 | 0 | 0 |
| MEDIUM | 8 | 1 | 1 | 0 |
| HIGH | 0 | 1 | 13 | 1 |
| CRITICAL | 0 | 0 | 0 | 5 |

**All 5 CRITICAL commands correctly identified**, 13/15 HIGH correctly identified. The classifier
never mistakes a CRITICAL command for LOW/MEDIUM (the dangerous direction of error) — the
"under-tagged" cases are all one tier off, MEDIUM→LOW, not a HIGH/CRITICAL command slipping
through as safe.

## Results — retrieved (hybrid/A3) commands (real-world exposure framing)

Using each query's true `risk_level` as the label, but classifying the command the system
*actually returned* (which is sometimes wrong): exact accuracy 90.0% (comparable to gold), but
**risky-binary precision drops to 0.826** (recall holds at 0.95). This is expected and reported
honestly: when the system retrieves an incorrect command for a query, that wrong command's text
can trigger a risk-pattern match unrelated to the query's true risk level, inflating false
positives. This is a retrieval-error artifact layered on top of classifier behavior, not a
classifier defect — worth distinguishing in the paper.

## Documented classifier gaps (not patched against this benchmark, by design)

9 under-tagged gold-command cases, all MEDIUM→LOW or HIGH→MEDIUM (never a large or
dangerous-direction miss):

- `Stop-Process -Name/-Id ... -Force` (3 occurrences) — not covered by any current rule, falls
  through to LOW. A legitimate gap: forcibly killing a process is a reasonable MEDIUM-risk case.
- `git reset --soft HEAD~1` (3 occurrences) — tagged LOW; the benchmark calls this MEDIUM. This
  is a judgment call (`--soft` doesn't discard changes, unlike `--hard`) rather than a clear bug.
- `git merge branch-name` — not covered by any rule, falls through to LOW; merges can produce
  conflicts, arguably MEDIUM.
- `git checkout -- .` — classifier says MEDIUM, benchmark says HIGH (a severity disagreement,
  not a miss).
- `git checkout feature-branch -- path/to/file.txt` — cross-branch path checkout not covered by
  the narrower `checkout -- .` pattern; falls through to LOW.

**These gaps are reported as-is and listed as future work**, not fixed by adding
benchmark-specific rules after seeing the failures — doing so here, on the same 150-query set
used to report the final accuracy number, would be equivalent to tuning on the test set.

## What this establishes

A simple, fully deterministic, auditable rule-based classifier achieves strong performance
(95%/95% precision/recall) on the actionable "should this require confirmation" binary
distinction, with zero dangerous-direction misses (no CRITICAL/HIGH command tagged as safe). It
is not perfect on the finer 4-tier distinction, and those specific gaps are named rather than
hidden or quietly patched.
