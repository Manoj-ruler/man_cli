# RELEASE-01: is the evaluated system the published npm release?

**Date:** 2026-09-29. **Task:** `research/task_plan/TASK_BACKLOG.md` RELEASE-01, approved by the author 2026-09-29.

**Source.** `npm pack @manoj-ruler/termassist@1.0.1`, stored in `npm-1.0.1/`.
- SHA-1 `e2b694a6569578e0125a8c2dd0ac4298f82022f5`, which equals the registry's `dist.shasum`, so the tarball is authentic.
- SHA-256 `dc07484d43ecc94c2f261d8f32306b83d314330f4b3ade7b825e31113bd3929a`.

## File-by-file comparison with `git archive master cli`

| File | Result |
|---|---|
| `config.js`, `package.json`, `README.md` | byte-identical |
| `index.js`, `search.js`, `interactive.js`, `sync.js`, `test_filter.js`, `data/custom_snippets.json` | identical after line-ending normalization (CRLF in the repository checkout) |
| `data/commands.json` | **different:** the published corpus has 380 records (240 visible on win32); the repository has 431 (279 visible on win32) |

## Why the corpora differ (git history)

| Time | Event |
|---|---|
| 2026-04-19 17:53 IST | Commit `b27228a`, whose corpus is 380 records and equals the published corpus |
| 2026-04-19 17:57:36 IST | npm 1.0.1 published (registry time `2026-04-19T12:27:36Z`) |
| 2026-04-19 18:36 IST | Commit `68fef07` adds 51 records: git 9, kubernetes 9, jq 8, ffmpeg 6, docker 5, system 6, aws 4, network 4. 39 of them are visible on win32. **They were never published** (npm latest is still 1.0.1). |

**Why this matters.** The research benchmark and every result were built on the 431-record repository corpus.

## Consequence

Measured by `research/experiments/release01_published_corpus_check.js`, which writes `research/results/release_check/published_corpus_check.json`. It has 4 guards: the repository run reproduces every committed command and status, and the committed raw ECE.

| | v0.1 repository | v0.1 published | v0.2 repository | v0.2 published |
|---|---|---|---|---|
| Changed items (command or status) | — | 17 | — | 25 |
| Overall accuracy | 101/150 (67.3%) | 88/150 (58.7%) | 137/209 | 125/209 |
| Non-control in-scope hits | 72/110 | 62/110 | 95/134 | 82/134 |
| OOD rejected | 4/15 | 4/15 | 17/50 | 21/50 |
| Raw ECE of the shipped confidence (controls excluded) | 0.323 | 0.372 | 0.293 | 0.315 |
| Wrong answered queries, and their mean confidence | 49, 86.06% | 60, 84.37% | 72, 79.5% | 79, 79.84% |
| Items answerable only with the 51 unpublished records | — | 15 | — | 18 |

## What the paper now says (T21c)

- The paper evaluates the released **code** with the **repository corpus**.
- It discloses the difference in §1, §3 (Corpus), Limitations (Scope) and the Ethics statement.
- It reports that the released corpus makes the tool less accurate and less calibrated. The paper's findings are therefore conservative for what npm users installed.
- "Reproduced the published outputs" was replaced by "reproduced the archived baseline outputs".
