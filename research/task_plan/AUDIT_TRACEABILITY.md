# Audit traceability

Each material finding in `research/SYSTEM_AUDIT_2026-09-29.md` is mapped to one of:
- **task ID(s)**;
- **paper limitation only**;
- **already verified / resolved**;
- **deferred**, with the reason.

**Verification status** (2026-09-29, HEAD `3227a4d`):
- Every finding is **confirmed on unchanged code**: `git diff --stat 77f532e HEAD` shows only the audit file added.
- "Measured in the audit" means the audit ran the check. "Code-read" means the finding comes from reading the source.

## Issue register (audit §7)

| Audit item | Finding | Basis | Mapping |
|---|---|---|---|
| I-1 | A single Enter executes via a shell, with no risk gate | Code-read `cli/index.js:85–106` | PAPER-05 (describe accurately). **SAFETY-01** (deferred: product change). Test coverage: TEST-04 (approval). |
| I-2 | Packaged `killall -9 node` snippet; 280 records indexed on win32 | Measured (research cache 280 vs 279 dense) and code-read `search.js:23–33` | **PAPER-01**, TEST-03; **SAFETY-02** (deferred) |
| I-3 | The substring bonus fires on accidental substrings | Measured ("tar", `--version`) and code-read `search.js:106–111` | **PAPER-02**; PRODUCT-01 (deferred) |
| I-4 | "Published outputs" vs an unverified tarball (size mismatch) | npm metadata vs `npm pack --dry-run` | **PAPER-03** (P0), RELEASE-01 (approval) |
| I-5 | The heuristic "confidence" is labelled a percentage and "calibration" in the README | Code-read `search.js:121–126`; README | **Already verified** for the paper (it calls it heuristic and uncalibrated); TEST-02 pins the formula; PRODUCT-02 and DOCS-01 (deferred) |
| I-6 | Only the fixed out-of-scope rule in the product | Code-read; measured ("recipe" → `git bisect good`) | **Paper finding already reported** (§5 and the freeze §6); PRODUCT-03 (deferred) |
| I-7 | No tests or CI | `cli/package.json:13`; one ad-hoc script | TEST-01 to TEST-05; TEST-06 (deferred) |
| I-8 | README and npm overclaims | Read | DOCS-01 (deferred: part of the published package; timing is tied to anonymity) |
| I-9 | Paper wording: "sandboxed", "explicit keypress", latency scope, "279 candidates" | `content.tex` lines 304, 395, 342, 96, 418 | **PAPER-06, PAPER-05, PAPER-04, PAPER-01** |
| I-10 | Command failures are swallowed with exit 0; telemetry `success` is always true | Code-read `index.js:80`, `:103–105` | TEST-04 (documents it); PRODUCT-05 (deferred) |
| I-11 | POSIX-only `os: all` records; about 81 placeholder commands | Heuristic scan (measured) | PRODUCT-04, SAFETY-03 (deferred). The paper already notes "a few Windows-visible records are Linux commands"; **paper limitation only** for placeholders (optional clause, within PAPER-07's scope if wanted). |
| I-12 | Non-ASCII tokens deleted; weak stopword list | Measured (Spanish query refused; "how do i do it" at 68) | **PAPER-07**; PRODUCT-06 (deferred) |
| I-13 | Sync writes into the package directory | Code-read `sync.js:102` | SAFETY-02 (deferred); Q4 → RELEASE-03 (deferred) |
| I-14 | Web API: service-role key, plaintext tokens, weak rate limit, no input limits | Code-read | PRODUCT-07 (deferred: the web app is outside the paper) |
| I-15 | Fusion union: the snippet has no dense score | Measured (cache lengths) | **PAPER-01** (App. A clause) |
| I-16 | Stale `next.config.ts` entries; wrong repository URL | Read | DOCS-02 (deferred) |
| I-17 | Index rebuilt on every query | Code-read; 2.56 ms per call | **No action.** The audit recommends none; PAPER-04 scopes the latency wording. |
| Q1 | Tarball identity | Unverified | RELEASE-01 (approval) |
| Q2 | Prompt behaviour without a TTY | Unverified | RELEASE-03 (deferred, approval) |
| Q3 | Node < 20.12 compatibility | Unverified (lockfile engines) | RELEASE-02 (deferred) |
| Q4 | Sync on a read-only global install | Unverified | RELEASE-03 (deferred) |

## Paper claim table (audit §5)

| Audit §5 row | Class | Mapping |
|---|---|---|
| "279 Windows commands" / "one of 279" | 3 | PAPER-01 |
| Tokenization description | 1 | Already verified; PAPER-07 adds the ASCII clause |
| BM25 constants and fields | 1 | Already verified; TEST-01 pins them |
| "+15 bonus … nearly matches" | 3 | PAPER-02 |
| Confidence formula; 0 when s < 2.0 | 1 | Already verified; TEST-02 |
| Prints confidence; refuses below 30 | 1 | Already verified; TEST-04 (approval) |
| Editable prompt; PowerShell; no risk shown | 1 | PAPER-05 adds `/bin/sh`; TEST-04 |
| Retrieval local; sync off by default | 1 | Already verified; TEST-04 checks sync-off (approval) |
| "Reproduced the published outputs" | 3 | PAPER-03, RELEASE-01 |
| Latency 3.3 ms | 3 | PAPER-04 |
| "a few Windows-visible records are Linux commands" | 1 | Already verified (≥ 8 by heuristic) |
| Hybrid is a research prototype | 1 | Already verified; PAPER-08 consolidates |
| "Fusion … all 279 candidates" | 3 | PAPER-01 |
| Recalibration "changes the number shown" | 2 | Already correctly conditional; PAPER-08 |
| Tuned threshold "handles out-of-scope requests" | 2 | Already framed as evaluated; PAPER-08 |
| Risk classifier results | 2 | Already correct (no safety claim); PAPER-08 |
| "explicit keypress" | 3 | PAPER-05 |
| "disposable sandboxed directories" | 3 | PAPER-06 (and line 304) |
| Benchmark counts "system" → `sudo reboot` as correct | 5 | **Paper limitation only** (PAPER-09); RESEARCH-01 (optional count). Relabelling is out of scope, since it would need new labels. |
| Freeze §6 and §8 numbers | 1 / 2 | Already verified (replica identical, 0/150); no task |

## Other audit sections

| Audit section | Finding | Mapping |
|---|---|---|
| §A | None of the evaluated reliability mechanisms is deployed | PAPER-08; DOCS-03 |
| §B | Component inventory | DOCS-03 (camera-ready) |
| §C walkthrough 2 | "system" → `sudo reboot` at 100%; "how do i do it" → `git checkout -b branch-name` | PAPER-09 (limitation), SAFETY-01 (deferred); PRODUCT-06 (stopwords, deferred) |
| §C walkthrough 3 | "tar" → `docker compose up -d`; "recipe" → `git bisect good`; non-ASCII refused | PAPER-02, PAPER-07; PRODUCT-01, PRODUCT-03 (deferred) |
| §C walkthrough 3 | The metacharacters of an injection-style query are not executed | Already verified (code-read); no task |
| §D | Diagrams | DOCS-03 |
| §4A | Long or multi-intent queries return one record | **Paper limitation only** (the one-record design is already described); no task |
| §4B | Provenance, licence and update process undocumented; 0/431 records human-validated | **Paper limitation only** (the paper already says "checked by script rather than one by one"); corpus expansion and validation are out of scope (a v1.0 gate, blocked on humans) |
| §4C | Confidence not comparable across OS or corpus versions; saturation (73% at 100 on v0.1) | Already reported in the paper (the tie-block discussion); DOCS-03 may note the OS comparability |
| §4F | `--version` → `pip install package-name==1.2.3` at 100 | SAFETY-04 (deferred); an optional example for PAPER-02 |
| §4F | `engines >= 14` vs dependencies `>= 20.12` | RELEASE-02 (deferred) |
| §4F | No web deployment configuration committed | **Deferred.** It does not affect the paper; relevant only to RELEASE-04 and PRODUCT-07. |
| §6 | The defensible contribution is the empirical audit, not a system | **Already verified.** It matches the paper's framing (decision D6); no task. |
| §8 | Minimal test suite, items 1–5 | TEST-01 (1), TEST-02 (2), TEST-03 (3–4), TEST-04 (5) |
| §8 | Reproduction not re-run in the audit | REPRO-01 |
| §9 A1–A5 | Phase A wording | PAPER-01, 02, 03, 04, 05, 06 |
| §9 B1–B3 | Phase B verification | TEST-01 to 05; RELEASE-01 |
| §9 C1–C3 | Documentation | PAPER-08, DOCS-03; DOCS-01 (deferred) |
| §9 D | Product 1.1 | Backlog C |

## Findings that could not be mapped confidently

- **I-11 placeholders (about 81 records).**
  - This is a heuristic count, not a reviewed list.
  - It is mapped to SAFETY-03 (product) and optionally to a limitation clause.
  - Whether the paper should mention it is a judgement call. The paper already describes the corpus as checked by script only.
- **The published-size discrepancy (Q1).**
  - The cause is unknown, so the downstream impact on PAPER-03's optional restoration cannot be planned beyond "identical" vs "different".
