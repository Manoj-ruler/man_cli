# Repository Forensic Audit — Phase 0

Date: 2026-09-14
Auditor: research assistant (Claude Code), read-only pass — **no production or research
data files were modified in this phase.**
Branch at time of audit: `research/baseline` (commit `HEAD` matches tag `v1.0-research-baseline`
lineage; see Git verification below).

---

## 1. Verified architecture (`cli/`)

**Entry points:** `cli/index.js` (CLI dispatch), `cli/interactive.js` (interactive prompt via
`@inquirer/prompts`), `cli/search.js` (the entire retrieval engine), `cli/sync.js` (optional
telemetry/snippet sync), `cli/config.js` (reads/writes `~/.termassist/config.json`).

**Retrieval algorithm — verified line-by-line in `cli/search.js`:**
1. `tokenize()` (line 11–13): lowercase, strip non `[a-z0-9\s-]`, split on whitespace, drop a
   10-word stopword set (`how,to,do,i,a,an,the,is,in,and,for,of,with,on,can,you`).
2. `buildIndex()` (line 15–67): loads `cli/data/commands.json`, filters by
   `os.platform()` against each entry's `os` field (`all` | `linux` | `darwin` | `win32`),
   optionally appends `cli/data/custom_snippets.json` under the same filter, tokenizes
   `intent + category + description` per entry, computes document frequency `df`, then IDF as
   `ln(1 + (N - df + 0.5) / (df + 0.5))` — a standard BM25 IDF smoothing variant. Rebuilt fully
   on every call to `search()`/`searchMany()` (no persisted index).
3. `search()` (line 69–134): BM25 scoring with fixed `k1=1.2, b=0.75` against `intent+category+
   description` term frequencies; **on top of** the BM25 score, a flat **+15.0 bonus** is added
   whenever the punctuation-stripped query is a substring of the punctuation-stripped intent, or
   vice versa (line 106–111). Confidence = `min(round(bestScore/8*100), 100)`, forced to 0 if
   `bestScore < 2.0` (line 119–126).
4. `searchMany()` (line 136–190): same scoring, returns top-`limit` (default 7) candidates,
   used only by `interactive.js`, not by the single-shot CLI path.

**No embeddings, no FAISS, no ONNX, no network calls anywhere in the retrieval path.** The word
"FAISS" appears nowhere in `cli/search.js`, `cli/index.js`, or `cli/interactive.js` — it exists
only in the npm README/marketing copy and package.json keywords, not in code. This is a
**confirmed README/code discrepancy**: the product description claims vector search; the
implementation is pure lexical BM25.

**Dependencies (`cli/package.json`):** `@inquirer/prompts ^8.4.1`, `chalk ^4.1.2` only. No ML,
embedding, or HTTP client library is a declared dependency of the CLI package itself (an
HTTP call exists in `sync.js` via Node's built-in `https`/`fetch`, gated behind opt-in config).

**Cross-platform filtering:** confirmed via `test_filter.js` — asserts Unix `find` variants are
excluded when `os.platform() === 'win32'`. Filtering happens once per `buildIndex()` call, not
cached across calls.

## 2. Corpus statistics (verified by direct inspection, not README)

- `cli/data/commands.json`: **431 entries**, schema `{intent, command, category, description,
  os}`, `os` values observed: `"all"` (145), `"linux,darwin"` combination (152), `"win32"` (134).
- Category distribution (27 categories): git 43, shell 38, filesystem 36, system 32, network 30,
  process 29, docker 24, find 20, grep 18, permissions 18, package 16, disk 11, npm 11, curl 10,
  pip 10, terminal 9, kubernetes 9, sed 9, awk 8, encoding 8, jq 8, ssh 7, archive 6, ffmpeg 6,
  security 6, tar 5, aws 4.
- `cli/data/custom_snippets.json`: 1 entry, same schema, user-added via dashboard sync.
- README claims "~250 curated commands" — **understated**; actual is 431. This is the second
  confirmed README/code discrepancy.

## 3. Research infrastructure already present (`research/`)

- `termassist_bench v0.1` benchmark: 150 queries across 9 query types (canonical 25, paraphrase
  25, low_overlap_paraphrase 15, ambiguous 12, ood 15, polysemy 18, single_keyword 10,
  safety_sensitive 15, complex_multi_intent 15), adjudicated (2 items corrected pre-experiment,
  documented in `final_adjudication_report.md`), frozen per `VALIDATED_BENCHMARK.md`.
- Frozen baseline results already executed and archived in
  `research/results/baseline-v0.1/` (metadata records commit `4443ec016c87895ebbc1b9be831e5f80b9bd3b50`,
  timestamp `2026-08-14T09:40:53.169Z`, `production_code_modified: false`).
- Existing scripts: `research/run_baseline.js`, `research/probe_baseline.js`,
  `research/diagnostics.js`, `research/compute_analysis_data.js` — reusable for Phase 1
  reproduction rather than rewritten from scratch.

## 4. Benchmark hash verification (this phase's key finding)

`VALIDATED_BENCHMARK_MANIFEST.json` records:
- `validated_json_sha256 = 2a554d3c3c425192e0fa295f2dc2eae833f92a2ae77feaf0f3ef70996e8c02a0`
- `validated_csv_sha256  = 749053eebb8809f8549e333f63a6639238c86931e39ee72c20fb2f2e0366407d`

Both are well-formed 64-hex-character SHA-256 digests (my earlier claim in the plan document
that one was 65 characters was a miscount on my part — retracted here).

However, hashing the **checked-out working-tree files directly** on this Windows machine gives
different values:
- `termassist_bench_v0.1_validated.json` (as checked out): `3fd73347196bddd34fa34127c4dbf9cc5b75af1a097a06890949d923dff1d5e7`
- `termassist_bench_v0.1_validated.csv` (as checked out): `26305ff11ab051b92b710ee276098aac2485a9d01f02fa0699ab3d46ba95928b`

**Root cause (confirmed, not assumed):** `git config core.autocrlf` is `true` in this
environment, so Git checks these text files out with CRLF line endings on Windows. Normalizing
the checked-out file content from CRLF→LF in memory and re-hashing reproduces the manifest's
recorded values **exactly**:
- LF-normalized JSON hash → `2a554d3c3c425192e0fa295f2dc2eae833f92a2ae77feaf0f3ef70996e8c02a0` ✅ matches manifest
- LF-normalized CSV hash → `749053eebb8809f8549e333f63a6639238c86931e39ee72c20fb2f2e0366407d` ✅ matches manifest

**Conclusion:** the benchmark content is unmodified and the manifest hashes are correct as
originally computed (almost certainly on a system/tool that wrote or hashed the file with LF
endings, e.g. Node.js `fs.writeFileSync` output hashed before a Windows checkout normalized it).
This is **not** a benchmark integrity violation — it is a line-ending checkout artifact common
to any Windows clone of a repo without a `.gitattributes` policy (none exists in this repo).

**Reproducibility risk this creates:** anyone verifying the benchmark hash on Windows without
knowing this will see a "mismatch" and wrongly suspect tampering. Fix applied: this audit
document now records both the LF-canonical hash (paper/manifest source of truth) and the
platform-dependent CRLF hash, and states the exact normalization procedure needed to reproduce
the canonical value. No repository files were changed to "fix" this — modifying line endings on
the frozen benchmark files was deliberately avoided so the frozen artifact's bytes remain exactly
as originally committed. The reproducibility instructions (Phase 19) must include this
normalization step explicitly.

## 5. Web app / database (unchanged from prior audit, re-confirmed present)

Supabase Postgres, 3 tables (`command_queries`, `custom_snippets`, `api_tokens`), RLS-protected,
no pgvector usage, no vector search. Not part of the research contribution surface — confirmed
out of scope for the experimental pipeline.

## 6. Known inconsistencies summary

| Claim (README/keywords) | Code reality | Status |
|---|---|---|
| "FAISS vector search" | Pure BM25, no embeddings anywhere in `cli/` | Confirmed false |
| "~250 curated commands" | 431 commands | Confirmed understated |
| Benchmark hash "tamper check" (implicit) | Matches only after CRLF→LF normalization | Explained, not a defect — documented for Phase 19 |

## 7. Reproducibility concerns carried into later phases

1. No `.gitattributes` — future contributors on different OSes will keep hitting the hash
   mismatch above unless the normalization procedure is documented (done here) or a
   `.gitattributes` is added later with full awareness that doing so will rewrite the frozen
   files' bytes (decision deferred to Phase 19, not this phase, to avoid touching frozen data now).
2. `buildIndex()` rebuilds the entire TF/IDF index on every single call — fine for the 431-entry
   corpus's <5ms latency budget, but Phase 3–5 dense/hybrid retrieval must cache embeddings to
   disk rather than mimic this per-call rebuild, or latency comparisons across systems would be
   unfair to the new methods.
3. No persisted random seed anywhere yet — required before Phase 4 (5-fold CV) begins.

**Production code touched in this phase: none.** `cli/search.js`, `cli/index.js`,
`cli/interactive.js`, `cli/data/commands.json`, and all files under `research/datasets/` remain
byte-identical to their state at the start of this audit.
