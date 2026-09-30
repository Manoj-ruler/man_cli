# Reproducing every TermAssist research result

This guide regenerates every result file, table and figure under `research/` from a clean checkout,
then checks them against the committed versions.

**Last verified:** 2026-09-30 (REPRO-01), on commit `16a4120` plus the test fix in the next commit.
Method: a fresh `git clone` from GitHub on Windows with Git's default `core.autocrlf=true`, a fresh
`npm ci`, and the model downloaded from the Hugging Face Hub (no copied cache).

| Check | Result |
|-------|--------|
| Freeze inputs, on the untouched clone (step 0) | 27/27 unchanged |
| Steps 1–3 and 3b (`run_review_r1.js` and the release and gold-platform checks) | All exited 0 |
| Step 4 comparison | 0 DIFFERENT; all changes are volatile fields only (40 files after steps 1–3, 51 after step 3b) |
| Tests (step 7, after `cd cli && npm ci`) | 24/24 pass |
| `trace_claims.js` | 475 numbers, 0 problems |
| Paper build | Clean; body ends on page 7 of 8 |

The run found three problems, all fixed:

- Two checks recorded raw-byte input hashes that differ in a CRLF checkout. They now use
  LF-normalized hashes.
- This guide said the CLI has no dependencies. It has two, which the tests need.
- This guide did not list `run_review_r1.js`.

## Requirements

- **Windows.** This is required for an exact match.
  - The baseline (`cli/search.js`) and the research scripts filter the command list by
    `os.platform()`.
  - The committed results use the Windows view (279 commands).
  - On macOS or Linux the scripts search a different subset, so the numbers will differ. That is
    expected and is not a reproduction failure.
- **Node.js 24.** Only Node 24.2.0 has been tested. It is pinned in `research/.nvmrc`, and
  `research/package.json` has `engines: node >= 24`. Older versions are untested.
- **Network, once.** You need it for `npm ci`, and for the embedding model unless you copy a verified
  cache (see Step 2).
- **Git**, so the comparison step can read the committed versions.

The shipped retriever (`cli/search.js`) needs no dependencies and no model. The CLI around it needs
two UI packages (`chalk`, `@inquirer/prompts`), which only the tests in step 7 use. Everything else
below is research-only.

## Steps

Run these from the repository root.

### 0. Check the freeze inputs first, on the untouched clone

```bash
node research/experiments/verify_freeze_inputs.js research/ANALYSIS_FREEZE_v1.0.md
```

The check needs every working-copy file to equal its committed version. Run it **before** step 3,
which rewrites the result files with new timestamps; after step 3 it reports those files as
changed. Expected: 27/27 unchanged.

### 1. Install the research dependencies

```bash
cd research && npm ci && cd ..
```

This installs `@xenova/transformers` 2.17.2, exactly as pinned in `research/package-lock.json`.

### 2. Get and verify the embedding model

The dense and hybrid experiments use `Xenova/all-MiniLM-L6-v2`. The library caches it inside
`research/node_modules/@xenova/transformers/.cache/`, so every fresh `npm ci` removes it.

To download it once and verify it:

```bash
node research/experiments/check_model_cache.js --fetch
```

**Offline alternative.** Copy a previously verified folder into
`research/node_modules/@xenova/transformers/.cache/Xenova/all-MiniLM-L6-v2`, then run the check
without `--fetch`. It verifies without touching the network.

The check compares four files against SHA-256 hashes recorded from the cache that produced the
committed results. It exits with an error if any file is missing or different.

- **Verified 2026-09-28:** a fresh Hub download matched all four hashes.
- The regenerated corpus embeddings (`research/models/corpus_embeddings.json`) matched the committed
  file. Only their timestamp differed.

### 3. Run everything

```bash
node research/experiments/build_embeddings.js
node research/experiments/run_all.js
node research/experiments/run_all_v0_2.js
```

1. `build_embeddings.js` re-embeds the corpus. It is optional, because the corpus embeddings are
   committed, but it checks them.
2. `run_all.js` is the v0.1 pipeline: 18 steps, in dependency order.
3. `run_all_v0_2.js` has 26 steps:
   - the v0.2 pipeline, in the same order as v0.1;
   - the cross-version analyses: Split B, bootstrap CIs, Holm correction, and the bare-keyword
     sensitivity analysis;
   - all tables and figures;
   - the Phase 1 corrections (T1–T5, T3b). Each of these re-checks the committed numbers it builds
     on and aborts if they do not match.

**Timing.** The second runner took about 1 minute on the verification machine, and the whole
sequence takes a few minutes.

**Warning.** These scripts overwrite the files in `research/results/`, `research/calibration/`,
`research/analysis/`, `research/figures/`, `research/tables/` and
`research/paper/acl_latex/table_sensitivity.tex`. Run them in a separate clone if you want to keep your
working tree untouched.

### 3b. Review-round analyses and release checks

```bash
node research/experiments/run_review_r1.js
node research/experiments/release01_published_corpus_check.js
node research/experiments/system_audit_gold_platform_check.js
```

- `run_review_r1.js` runs the eight review-round analyses (`review_r1_a` to `review_r1_h`) and the
  seed-repeat cross-validation. Several of the paper's numbers come from these.
- The other two produce the released-corpus comparison and the POSIX-credit counts.
- Every script checks the committed numbers it builds on, and aborts if they do not match.

### 4. Compare with the committed versions

```bash
node research/experiments/compare_reproduction.js
```

The script sorts every file the run changed into one of three groups:

| Group | Meaning |
|---|---|
| **IDENTICAL** | No change after normalizing line endings |
| **VOLATILE-ONLY** | Only these differ: timestamps, measured wall-clock timings (latency fields and table columns), and the recorded git commit |
| **DIFFERENT** | Anything else. The script prints the first differing JSON paths or table cells and exits with code 1 |

**Result on 2026-09-28:** 81 files were touched.
- 38 were identical, including all 12 figure SVGs and the paper's sensitivity table.
- 40 differed only in volatile fields.
- 3 were the new untracked T16 scripts.
- **0 were DIFFERENT.**

### 5. Paper figures (PNG)

The PNGs in `research/paper/acl_latex/figures/` are converted from the SVGs in `research/figures/`,
1400 px wide:

```bash
for f in research/figures/*.svg; do base=$(basename "$f" .svg); npx --yes sharp-cli -i "$f" -o "research/paper/acl_latex/figures/$base.png" resize 1400; done
```

The PNG bytes depend on the sharp version that npx fetches. The SVGs are the reproducible source.

### 6. Paper PDFs

```bash
cd research/paper/acl_latex && bash build.sh
```

This needs a LaTeX installation with `pdflatex` and `bibtex` (tested with MiKTeX). The script builds
both `main.pdf` (camera-ready) and `main_review.pdf` (anonymous). It fails if the body runs past
8 pages.

**How the freeze check in step 0 works.** It compares every SHA-256 in the report with the committed
file, in both LF and CRLF form, because v1.0 hashed raw working-copy bytes and line endings vary from
file to file.

`freeze_analysis_report.js` never overwrites an existing report. Pass `--out <new file>` to
regenerate one for comparison; new reports hash LF-normalized bytes.

### 7. Tests of the shipped tool

```bash
cd cli && npm ci && cd ..
node --test "research/tests/*.test.js"
```

These 24 tests check the behaviour of `cli/` that the paper describes. If `npm ci` in `cli/` was
skipped, one test fails with "run: cd cli && npm ci", and the 7 CLI-flow tests are skipped. The
tests cover:

- golden retrieval outputs;
- the confidence formula and the refusal rule;
- the size of the win32 index (280);
- the CLI's flow from prompt to execution.

The CLI tests replace command execution, the prompt and the network with recorders, so no shell
command is ever run. See `research/tests/README.md`.

### 8. Re-running the analyses on benchmark v0.2.1

After the annotation study, `build_v0_2_1.js --confirm` writes benchmark v0.2.1. Then run:

```bash
node research/experiments/run_v0_2_1.js
```

The script works in a disposable git worktree, where it places v0.2.1 at the v0.2 paths. It runs the
v0.2 chain and the review scripts there, without the `generate_*` renderers, and writes the results
to `research/results/v0.2.1/` together with `RUN_MANIFEST.json`, which records input and output
SHA-256. No frozen file is touched.

The published-value guards run only on the frozen benchmarks; the guards that compare regenerated
files with each other still run.

To test it first on a synthetic build, pass `--dry-run --bench-dir <dir>`. Its outputs go outside
`research/` and are stamped SYNTHETIC. A dry run on 2026-09-29 completed in 152 s.

## What does not reproduce exactly, by design

- **Latency.** Every latency or millisecond value is a single wall-clock measurement on one machine.
  - In the 2026-09-28 run, BM25 mean latency in Table 1 was 6.78 ms, against 3.21 ms committed, on a
    busy machine.
  - Treat reported latencies as indicative only; do not compare them exactly.
- **Timestamps and the recorded commit.** Any `generated_at`-style field, and the `git_commit` in
  `baseline/reproduction-metadata.json`.
- **Other operating systems.** See Requirements.

## Not covered by these runners

- **Benchmark construction and freezing** (`build_v0.2_additions.js`, `freeze_v0.2_benchmark.js`,
  and similar). The frozen benchmarks are inputs, verified by their LF-normalized SHA-256 manifests.
  They are never regenerated.
- **Annotation materials and the annotation study**
  (`research/datasets/annotation/ANNOTATION_PROTOCOL.md`). These depend on human input.
- **The corpus schema migration and validation** (`migrate_corpus_schema.js`, `validate_corpus.js`).
  These are one-time steps, recorded in the corpus manifest.
