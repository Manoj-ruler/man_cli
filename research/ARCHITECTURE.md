# Architecture of the TermAssist research code (DOCS-03)

This page is for someone opening the released code for the first time. It explains:

- what each part of the repository is;
- how data flows from the benchmarks to the paper's numbers;
- which files are frozen and which are regenerated;
- the safety rails that stop a result from silently changing.

To rerun everything, follow `REPRODUCE.md`. For what each test checks, see `tests/README.md`.

## 1. The three parts of the repository

| Part | Path | Role in the paper |
|------|------|-------------------|
| **The audited tool** | `cli/` | The object of study: TermAssist 1.0.1, a BM25 retriever over a fixed command list (`cli/search.js`, corpus `cli/data/commands.json`) with a prompt that runs the chosen command (`cli/index.js`). The research code reads it but **never modifies it**. Every baseline number comes from calling its `search()`. |
| **Research code and data** | `research/` | Everything in the paper: benchmarks, the offline analyses (calibration, thresholds, dense and hybrid retrieval, statistics), results, figures, the paper source, and the tests. |
| **Web dashboard** | `app/`, `components/`, `lib/`, `supabase/` | The tool's optional sync dashboard (Next.js + Supabase). **Not evaluated in the paper.** The study only notes that the tool's query sync is off by default. |

The research branch keeps `cli/` at 1.0.1. A later product version (1.1, on a separate branch)
changes `cli/` and must not be merged into the research branch, because 25 research scripts read
`cli/`.

## 2. Data flow

```text
 benchmarks (frozen)                         the audited tool (frozen)
 research/datasets/termassist_bench_*        cli/search.js + cli/data/commands.json
        │                                            │
        ▼                                            ▼
 reproduce_baseline*.js ───────────► results/baseline/, results/v0.2/reproduction-results.json
        │                               (every query run through the shipped search())
        ▼
 build_query_scores*.js ─ lexical_search.js + dense_search.js (MiniLM, pinned by SHA-256)
        │                   → results/hybrid|v0.2/query_scores_cache.json
        ▼
 build_folds*.js (seed 42, 5 folds, stratified) → nested CV everywhere below
        ▼
 run_hybrid*, run_ablation*, build_candidates*, build_reliability_features*,
 run_selective_prediction*, run_calibration*, run_safety_eval*, run_statistical_analysis* …
        │                   → results/{hybrid,ablation,reliability,safety,final,v0.2}/, research/calibration/
        ▼
 cross-version: run_split_b_*, run_bootstrap_ci, apply_holm_correction,
 run_sensitivity_bare_keyword  → results/{v0.1,v0.2,stats}/
        ▼
 corrections: run_phase1.js (T1–T5, T3b)       → results/phase1/
 review round: run_review_r1.js (a–h, seed-repeat) → results/review_r1/, results/seed_repeat/
        ▼
 generate_tables*, generate_figures → research/tables/, research/figures/ (SVG) → paper PNGs
        ▼
 paper/acl_latex/content.tex ◄── trace_claims.js checks every number against the result files
```

**Runners, in the order `REPRODUCE.md` uses them:**

| Runner | Steps | What it does |
|--------|-------|--------------|
| `run_all.js` | 18 | The v0.1 pipeline, from baseline reproduction to tables and figures |
| `run_all_v0_2.js` | 26 | The same for v0.2, plus the cross-version statistics, all tables and figures, and `run_phase1.js` |
| `run_review_r1.js` | 9 | The review-round analyses and the seed-repeat CV |

**Shared modules** (used by several scripts):

| Module | Role | Scripts using it |
|--------|------|------------------|
| `phase1_common.js` | Loading, metrics (ECE, Brier, AUROC, Wilson, exact McNemar, bootstrap), the guard framework and `frozen()` | 9 |
| `hybrid_fusion.js` | Min-max fusion of BM25 and dense scores | 9 |
| `isotonic.js` | Isotonic calibration | 8 |
| `lexical_search.js` | A replica of the shipped BM25 that exposes all candidates | 4 |
| `dense_search.js` | MiniLM retrieval | 4 |
| `safety_classifier.js` | The rule-based risk tiers | 5 |
| `annotation_common.js` | Shared code for the annotation materials | 5 |

## 3. Frozen inputs vs regenerated outputs

**Frozen**, never regenerated:

- The benchmarks `datasets/termassist_bench_v0.1_validated.*` and `…_v0.2_validated.*`, their
  review files, and the manifests `VALIDATED_BENCHMARK_MANIFEST*.json`. The manifests record
  LF-normalized SHA-256. `phase1_common.frozen(v)` compares against them, and the git tag
  `v0.2-validated-benchmark` marks the frozen v0.2.
- `cli/` (1.0.1).
- The embedding model, whose four files are pinned by SHA-256 in `check_model_cache.js`.
- `ANALYSIS_FREEZE_v1.0.md`. `freeze_analysis_report.js` refuses to overwrite it, and
  `verify_freeze_inputs.js` checks that its 27 inputs are unchanged.

**Regenerated** by the runners: everything under `research/results/`, `analysis/`, `calibration/`,
`tables/` and `figures/`, plus `paper/acl_latex/table_sensitivity.tex`.

- `compare_reproduction.js` sorts every regenerated file into three groups:
  - **IDENTICAL**;
  - **VOLATILE-ONLY**: only timestamps, wall-clock timings or the recorded commit differ;
  - **DIFFERENT**.
- A reproduction passes when nothing is DIFFERENT.

**Historical:** `results/v1.0/`, and project documents such as `FINAL_RESEARCH_REPORT.md` and
`V1.0_BUILD_STATUS.md`, predate the paper. No current runner reads them.

## 4. Safety rails

1. **Reproduction guards.** Almost every analysis script first recomputes the committed numbers it
   builds on (`C.guard(...)`) and aborts before writing anything if one differs
   (`assertGuards`, which reports failures on stderr). Guards against hard-coded published values
   apply only when `frozen(v)` is true, so the same code can run on a corrected benchmark.
2. **Claim trace.** `trace_claims.js` registers each number-bearing sentence of the paper with its
   source file and field (176 snippets, 475 numbers), and must report 0 problems.
3. **Line-ending-independent hashes.** Recorded input hashes are of LF-normalized text, so a Windows
   checkout with `core.autocrlf=true` verifies the same way. The v1.0 freeze predates this;
   `verify_freeze_inputs.js` accepts either form for it.
4. **Tests of the tool** (`tests/`). They check golden outputs, the confidence formula, the index
   size and the CLI flow. Execution, the prompt and the network are replaced by recorders that fail
   closed, so no shell command is ever run.

## 5. Benchmark v0.2.1 and the annotation study

- **Annotation materials and scripts:**
  - The materials are in `datasets/annotation/` (protocol, codebook, sheets).
  - The pipeline is `validate_returned_sheet.js` → `build_adjudication_sheet.js` →
    `analyze_annotation.js` → `build_v0_2_1.js`.
  - The analysis plan was fixed before any label existed.
- **Privacy.** Annotator identities and returned sheets live only in `datasets/annotation/coordinator/`
  and `returned/`, which are gitignored. Result files name annotators only as A and B.
- **Synthetic mode.** Every script has one that refuses to write inside `research/` and stamps its
  outputs SYNTHETIC. The whole chain was rehearsed this way on 2026-09-29.
- **Re-analysis.** `run_v0_2_1.js` re-runs the v0.2 chain on v0.2.1 in a disposable git worktree,
  with v0.2.1 placed at the v0.2 paths inside that worktree only. It copies the results to
  `results/v0.2.1/` with a `RUN_MANIFEST.json`, and no frozen file is touched.
- **Step-by-step order:** `ANNOTATION_TO_SUBMISSION_RUNBOOK.md`.

## 6. The paper

- **Source.** `paper/acl_latex/content.tex` holds the body. `main.tex` (camera-ready) and
  `main_review.tex` (anonymous) are thin wrappers that define the identity macros, including the
  AI-use acknowledgement, which is empty in the review build.
- **Build.** `bash build.sh` builds both PDFs and fails if the body passes 8 pages.
- **Integrity records.** `STAGE4_5_INTEGRITY_REPORT.md`, with the reference audit in
  `paper/integrity/`, and `AI_DISCLOSURE_LEDGER.md`.
