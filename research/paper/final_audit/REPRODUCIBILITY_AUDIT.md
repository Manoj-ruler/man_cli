# Reproducibility audit — TermAssist

**Date:** 2026-10-05. **Commit:** `5c7a641` (`research/improvement`). Audit only; nothing was changed.

## 1. Environment

| Item | Value | Source |
|---|---|---|
| OS | Windows 11 (win32), `core.autocrlf=true` | this machine |
| Node.js | 24.2.0 | `node -v`; `research/.nvmrc` says 24.2.0 |
| Dependencies | `research/package-lock.json` (lockfile v3, 81 packages): `@xenova/transformers` 2.17.2, `onnxruntime-node` 1.14.0 | lockfile |
| Encoder | `Xenova/all-MiniLM-L6-v2`; 4 cached files match the recorded SHA-256 | `check_model_cache.js` |
| Hardware | CPU only, one machine, no GPU | Appendix A; nothing in the code uses a GPU |
| Seeds | fold seed 42; bootstrap seed 42 (10,000 resamples); noise-floor seed 7 (2,000 simulations); partition seeds 42 and 1–19 | code |
| External data | CLINC150, `clinc/oos-eval` at commit `828f809`; file sizes, git blob SHA-1 and SHA-256 recorded | `research/data_external/clinc150/PROVENANCE.md` |

## 2. What was verified today (2026-10-05)

| Check | Command | Result |
|---|---|---|
| Tool tests | `node --test "research/tests/*.test.js"` | 24 pass, 0 fail |
| Frozen analysis inputs | `node research/experiments/verify_freeze_inputs.js` | 27/27 unchanged since `ANALYSIS_FREEZE_v1.0.md` |
| Claim trace | `node research/experiments/trace_claims.js` | 253 snippets, 755 numbers, 0 problems |
| External-check freeze | `git diff --exit-code e1-protocol-v1 -- research/publication_tasks/e1 research/experiments/e1_score_queries.js research/experiments/e1_analyze.js` | no difference |
| Freeze ordering | `git merge-base --is-ancestor e1-protocol-v1 63d71af` | the tag is an ancestor of the scoring commit |
| Tag on the remote | `git ls-remote --tags origin` | `e1-protocol-v1` → `970c54f` and the benchmark tags are present |
| Model cache | `node research/experiments/check_model_cache.js` | 4 files match |
| Benchmark hashes | SHA-256 (LF-normalized) of the three benchmark JSON files against their manifests | all three match |
| v0.2.1 run input | `RUN_MANIFEST.json` `input_sha256.json` against the benchmark file | matches; run commit `be706df` |
| Tool code identity | `git diff master research/improvement -- cli` | `search.js` identical; `index.js` one comment; corpus records identical in the five fields read |
| npm release | `npm view @manoj-ruler/termassist version dist.fileCount time.modified` | 1.0.1, 10 files, modified 2026-04-19 |
| Headline numbers from raw data | `node research/paper/final_audit/scripts/audit_recompute.js` | 48 comparisons, all consistent with the paper |
| Trace coverage | `node research/paper/final_audit/scripts/audit_coverage.js` | 580 of 706 numerals pinned; 107 registered elsewhere; 19 design constants |
| Paper build state | `main_review.aux`, `main_review.log`, `pdfinfo` | body ends on page 8; 0 overfull boxes; 0 undefined references; 17 pages; metadata empty |
| Anonymity | text scan of both PDFs for 15 identifying strings | review PDF 0 hits; camera-ready finds them (positive control) |
| Citations | cited keys against `references.bib` and `integrity/refs_audit.json` | 31 cited, all present, all in the audit of 2026-10-01 |

## 3. What rests on the clean-clone run of 2026-10-02

The full regeneration was run three days ago and not repeated today. It is recorded in `research/REPRODUCE.md`
("Re-verified 2026-10-02").

- **Setup:** a fresh local `git clone` of `0162be5`; `npm ci --offline`; the model cache copied and verified.
- **Result:** every step exited 0.
  - 78 regenerated files differed only in timestamps or timings.
  - 3 more differed only in hashes of such files.
  - The v0.2.1 benchmark rebuild was byte-identical in queries, CSV and review file.
  - The external check gave 0 differences.

**Why it still stands:** since `0162be5`, the only change under `research/experiments`, `research/results`,
`research/datasets` and `cli` is `compare_reproduction.js` (the comparison tool). No analysis script, result or
dataset changed. The paper text changed, and today's trace covers it.

## 4. Exact reproduction commands

From a fresh clone, on Windows, with Node 24.2.0 (the full guide is `research/REPRODUCE.md`):

```bash
node research/experiments/verify_freeze_inputs.js research/ANALYSIS_FREEZE_v1.0.md
cd research && npm ci && cd ..
node research/experiments/check_model_cache.js --fetch
node research/experiments/run_all.js
node research/experiments/run_all_v0_2.js
node research/experiments/run_review_r1.js
node research/experiments/release01_published_corpus_check.js
node research/experiments/system_audit_gold_platform_check.js
node research/experiments/compare_reproduction.js
cd cli && npm ci && cd ..
node --test "research/tests/*.test.js"
node research/experiments/trace_claims.js
```

- **v0.2.1:** remove `research/results/v0.2.1/`, then `node research/experiments/run_v0_2_1.js`.
- **External check:** `REPRODUCE.md` step 9.
- **Paper:** `bash build.sh` in `research/paper/acl_latex` (Git bash on Windows).

## 5. What could not be verified

| Item | Why | Risk |
|---|---|---|
| A clone from GitHub | The 2026-10-02 run cloned the local repository, because the commits were not yet pushed. They are pushed now, but the run was not repeated from GitHub. | Low: same commits |
| The npm tarball's contents (380 records) | Downloading it needs the author's permission. The audit relies on `published_corpus_check.json` (tarball SHA-256 `dc07484d…`) and on registry metadata. | Low |
| A fresh model download | The cache was copied and hash-checked, not downloaded | Low: hashes are pinned |
| Other operating systems | The tool filters its corpus by platform; all results are Windows results | Stated in the paper |
| The PDF build inside the clone | Built in the working copy only | Low |
| The annotation analysis from a clone | The annotator returns are gitignored on purpose. Re-running on the coordinator's copy on 2026-10-02 left the committed results unchanged. | Inherent: a third party cannot recompute κ from the raw sheets unless they are released |
| The author's statements about annotators | Recruitment, pay, consent and independence are reported facts | Inherent |
| Reference metadata, today | The audit of 2026-10-01 was not re-queried | Low |

## 6. Remaining reproducibility risks

1. **Timing-dependent fields.** Latencies and timestamps differ on every run. The comparison tool classifies
   them, and since 2026-10-02 also the hashes derived from them.
2. **Windows only.** A reproduction on Linux or macOS loads a different corpus subset and will not match.
3. **κ is not third-party reproducible** without the raw annotation sheets. The per-item labels are committed
   (`research/results/annotation/per_item.csv`), so κ can be recomputed from those; this audit did so.
4. **The claim "released with the camera-ready version"** depends on the author publishing the repository state
   and adding licence files. The repository is already public; the review PDF does not link to it.
