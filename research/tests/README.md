# Tests for the shipped tool

These tests check that the shipped tool (`cli/`) behaves the way the paper describes. They read
`cli/` and never change it. They do not exercise the research analyses; the analysis scripts have
their own guards, which abort when a result does not reproduce.

```bash
cd cli && npm ci && cd ..
node --test "research/tests/*.test.js"
```

**Requirements:** Node 24 or later, and the CLI's two UI dependencies. `cd cli && npm ci` installs
them. The tests themselves use only `node:test` and `node:assert`. If the dependencies are missing,
the check "CLI dependencies are installed" fails with that instruction, and the 7 CLI-flow tests are
skipped rather than failing for an unrelated reason.

**Running:**

- Run the command from the repository root.
- Keep the quotes: Node expands the pattern itself, so the command works the same in bash and
  PowerShell.
- Do not pass the directory instead (`node --test research/tests/`); Node 24 then fails with one
  error and runs no tests.

**Checked** 2026-09-30 on Node 24.2.0 (win32), in a fresh clone (REPRO-01): 24 tests, 24 pass.

| File | What it checks |
|------|----------------|
| `search_golden.test.js` (TEST-01) | Five benchmark queries return exactly the command and confidence recorded in the frozen reproduction file (`research/results/v0.2/reproduction-results.json`). The five cover an exact intent, an ambiguous query, a bonus-only score (TA-B187 "tar"), a POSIX answer at 100 (TA-B194 "system") and a refusal. Also: inputs with no usable tokens (empty, punctuation, non-English) score 0, and two calls give identical results. The golden values are read from the frozen file, never typed in; win32 only. |
| `confidence_formula.test.js` (TEST-02) | The confidence formula stated in §3, min(round(100 s / 8), 100) with 0 below s = 2.0, holds for every query of both frozen benchmarks. No query scores in [2.0, 2.4), so the CLI's 30 % refusal rule makes the same decisions as the evaluation's s ≥ 2.0 rule. |
| `index_composition.test.js` (TEST-03) | The index on win32, linux and darwin is the platform-visible corpus plus the packaged snippets, in order. On win32 that is 280 records (§3: 279 corpus records plus the packaged `killall -9 node` snippet). |
| `cli_flow.test.js` (TEST-04) | The CLI's control flow, run as a child process. A refusal exits 1. A match pre-fills the prompt with the command, and Enter runs exactly one `execSync` through `powershell.exe` (win32). Ctrl+C or clearing the prompt runs nothing. Sync is off by default and nothing goes over the network. A failed command exits 0 (audit I-10). The real `~/.termassist/config.json` is not touched. |

## Nothing is executed

`cli_flow.test.js` starts the CLI with `node --require helpers/stub_exec.js`. That preload replaces
three things before `cli/index.js` loads:

- every `child_process` function, with recorders;
- `@inquirer/prompts`, with a scripted prompt;
- `http.request` and `https.request`, with recorders that throw.

It then checks that each replacement is in place, and exits with code 99 if any is missing. It also
exits 99 when `TA_STUB_LOG` is unset. In both cases the CLI never runs.

`HOME` and `USERPROFILE` point at a fresh temporary directory for each case. You can check that the
preload fails closed:

```bash
node --require ./research/tests/helpers/stub_exec.js cli/index.js list running processes
```

Run this without `TA_STUB_LOG` set. It prints `stub_exec: TA_STUB_LOG not set` and exits 99.

## Known limits

- TEST-01 runs on win32 only. The frozen values come from the win32 corpus view, and on other
  platforms the test is skipped.
- TEST-04 does not cover the interactive mode (no arguments) or `termassist sync`.
- These tests check the repository's `cli/`. The npm release 1.0.1 has a smaller corpus
  (`research/release_check/RELEASE-01_result.md`), and these tests do not cover it.
