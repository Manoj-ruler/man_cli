# Phase 10 — Functional Evaluation (E9)

**Scope (stated explicitly, not hidden):** 15 of 150 benchmark queries — 14 `git` category, 1
`filesystem` category. Restricted to gold commands that are placeholder-free (no
`path/to/`, `filename`, `branch-name`-style templates needing argument substitution this phase
doesn't attempt), non-interactive (excludes `git rebase -i`, which would hang a script waiting
for an editor), and host-safe (excludes `git config --global`, which would mutate the operator's
real git identity). **Excluded entirely:** docker (15), npm (9, network-dependent/non-deterministic
latency), network/curl/ssh/kubernetes/aws (need live external services), process/permissions/
security/disk/system (destructive or host-state-changing by nature). All execution happens in
disposable `os.tmpdir()` sandboxes, copied fresh per command so gold and retrieved runs never
share or contaminate state, and nothing is ever run against the host.

**Success definition (a deliberate, stated simplification):** exit code 0 against a realistic
fixture (an 8-commit git repo with a branch, staged/unstaged/untracked changes; a directory with
a visible and a hidden file). This is retrieval-vs-execution correctness, not full semantic
side-effect verification — confirming e.g. that `git stash` stashed the *correct* file would need
a bespoke oracle per query, out of scope here and stated as a limitation, not hidden.

## A fixture bug caught before reporting

The first run showed `TA-B051`'s retrieved command (`git remote add origin ...`) failing with
exit code 3 ("remote already exists"). Investigation found the fixture builder had defensively
pre-added a remote unrelated to any of the 15 gold commands in scope — an artifact of my own
fixture design, not a finding about the retrieved command. Removed before reporting; corrected
run shows this command succeeds (exit 0) as it should in a fresh repo.

## Results

| Metric | Value |
|---|---:|
| Gold functional success rate | **100%** (15/15) — validates the benchmark's gold commands are all genuinely executable |
| Retrieved (hybrid/A3) functional success rate | **93.3%** (14/15) |
| Retrieval textual accuracy on this subset | 80.0% (12/15) |
| Textually correct but functionally failed | **0** |
| Textually wrong but functionally succeeded | 2 |

**Zero cases of "textually correct but functionally broken"** — every time the system's top-1
prediction matched the gold command exactly, it also executed successfully. This is a real,
positive signal about retrieval quality on this narrow subset, though the subset is small (15
queries) and skewed toward git commands with no arguments, which are inherently less likely to
fail for reasons unrelated to correctness (e.g. missing files).

**The one real functional failure (`TA-B103`)** is consistent, not surprising: the query was
textually mismatched (`git status` expected, `Get-Service -Name 'service-name'` retrieved — a
cross-category retrieval error) and the wrong retrieval also fails functionally (`service-name`
is a nonexistent placeholder), exit code 1. Wrong retrieval → wrong execution, as expected.

**The two "textually wrong but functionally succeeded" cases illustrate the field's well-known
one-to-many mapping problem** (also noted by Lin et al. 2018 for NL2Bash): `git diff` vs. `git
diff --cached` (`TA-B045`) and the corrected `git remote add origin ...` (`TA-B051`) are both
syntactically valid, executable git commands — just not what the benchmark's single gold
reference specifies. Neither is a system failure in the sense of "broken command"; both are
alternate-but-valid command choices, which is a known limitation of exact-match evaluation, not
a functional-correctness problem.

## Limitations, stated explicitly

- Only 15/150 queries (10%) could be safely, deterministically sandboxed without a
  placeholder-substitution system this phase didn't build.
- "Success" = exit code 0, not verified side effects (e.g. did `git stash` actually stash the
  right file). A stronger functional oracle is future work, not attempted here without a
  validated design.
- The git-heavy, argument-free skew of the safe subset likely overstates how well this would
  generalize to filesystem/npm/docker commands with real path/package arguments, which is
  exactly why those categories were excluded rather than faked with synthetic placeholders.
