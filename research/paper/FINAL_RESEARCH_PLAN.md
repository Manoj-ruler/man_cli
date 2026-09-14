# TermAssist — Final End-to-End Research Plan

Status: PLAN ONLY — no production or research code has been modified by this document.
Purpose: single authoritative execution plan such that, once every item below is checked off,
the project requires **no further implementation** before paper writing — only writing itself.

Frozen references (must never be altered):
- Baseline commit: `4443ec016c87895ebbc1b9be831e5f80b9bd3b50` (tag `v1.0-research-baseline`)
- Benchmark: `termassist_bench v0.1` (tag `v0.1-validated-benchmark`), 150 queries
  (119 CORRECT / 14 AMBIGUOUS / 15 OOD / 2 NEEDS_CORRECTION)
- Baseline results: overall 67.3% (101/150), supported-task 71.9%, non-ambiguous in-domain 78.2%,
  OOD rejection 26.7% (false-acceptance 73.3%), ambiguity success 28.6%, mean confidence on
  wrong answers 87.7%, 53.1% of failures at 100% confidence, latency mean 3.29ms / p95 6.46ms.

---

## 0. Governing rules (apply to every phase)

1. Never edit `cli/search.js` or any file the baseline depends on. All new work happens on
   `research/improvement` branch / in new modules that the baseline never imports.
2. Every number in the final paper must trace to a file in `research/results/` — no number is
   typed directly into prose without a script that produced it.
2a. No LLM is integrated as a product feature. A local LLM may appear ONLY as an optional,
    clearly-labeled comparator experiment (Phase 12), never wired into `cli/`.
3. Dev/calibration data and final test data are never the same queries for the same purpose —
   document the split before touching any threshold, α, or calibration parameter.
4. If a hypothesis fails, that is a valid, reportable result. Do not retro-fit the hypothesis.
5. Every phase ends with: run it, save the artifact, commit it, tick the checklist item below.

---

## Phase 0 — Repository Forensic Audit (no code changes)

**Output:** `research/implementation/repository-audit.md`
- Confirms current architecture (tokenize → BM25 idf/tf → +15 substring bonus → confidence
  `min(score/8*100,100)`, reject `<2.0`), corpus stats (431 commands, schema, OS field),
  dependency list (`@inquirer/prompts`, `chalk` only — no ML/embedding libs), test coverage
  (`test_filter.js` only), README-vs-code discrepancies (FAISS claim, 250-vs-431 command count).
- Verify baseline commit hash and benchmark file hash match what's recorded in
  `VALIDATED_BENCHMARK_MANIFEST.json`; record actual SHA-256 (note: recompute and correct the
  hash string in section 2 of the plan you supplied — it was 65 hex chars, not 64; regenerate
  and store the true hash in the manifest so it is not misquoted in the paper).

**Done when:** audit file exists, hashes verified and corrected, zero production files touched.

---

## Phase 1 — Reproduce the Frozen Baseline Independently

**Output:** `research/results/baseline/` (re-run of `run_baseline.js` against unmodified
`cli/search.js`), diffed byte-for-byte against the existing `baseline-v0.1/` results.
**Done when:** re-run numbers match the archived 67.3%/71.9%/78.2%/etc. exactly (or documented
non-determinism is explained, e.g. timing jitter only affecting latency, not accuracy).

---

## Phase 2 — Research Experiment Infrastructure

Create (adapt existing `research/` folders rather than duplicate):
```
research/experiments/   research/results/{baseline,dense,hybrid,reliability,ablation,final}/
research/analysis/      research/figures/   research/tables/   research/paper/
```
`research/experiments/EXPERIMENT_MANIFEST.md` lists E0–E12 with objective/hypothesis/IV/DV/
dataset/procedure/expected/actual/conclusion columns, filled in as each phase completes.
Every experiment script writes a metadata JSON: experiment ID, git commit, dataset hash, model
name/version, params, seed, OS, Node version, timestamp.

**Done when:** folder structure exists, manifest scaffolded with all rows (empty "actual" cells
until run), one experiment runs end-to-end and writes conformant metadata.

---

## Phase 3 — Semantic Retrieval (local, offline only)

- Model choice: a small CPU-friendly sentence-embedding model with a Node-usable path
  (e.g. via `@xenova/transformers` running a MiniLM/BGE-small/E5-small ONNX model locally —
  no network calls at inference). Document the exact model, size, dimension, license.
- Represent each corpus entry as `Intent / Description / Category / Platform` structured text;
  precompute and cache embeddings to disk (`research/models/embeddings.json` or a binary cache)
  — never recompute per query.
- Semantic-only retrieval score = cosine similarity to cached corpus embeddings.

**Done when:** `run_dense.js` produces top-k semantic-only results on the benchmark, cached
embeddings committed (or regeneration script committed if file too large), latency measured.

---

## Phase 4 — Hybrid Fusion

`HybridScore = α·normalized_BM25 + (1-α)·normalized_semantic`. Grid-search α ∈ {0.0, 0.1, …, 1.0}
on a **development split only** (see Phase 2 split rule below), report the full curve, pick one
α for the final system, then evaluate it once, untouched, on the held-out test partition.

**Split rule:** since the benchmark is only 150 queries, use 5-fold cross-validation instead of
a single static split — every query serves as test exactly once, α/thresholds tuned only on the
other 4 folds each time. Report mean ± std across folds, not a single lucky number.

**Done when:** α-sweep table + fold-wise results exist in `research/results/hybrid/`.

---

## Phase 5 — Ablation Matrix (mandatory, run together with Phase 4 infra)

A0 BM25 only · A1 BM25 no substring bonus · A2 dense only · A3 BM25+dense · A4 +margin ·
A5 +margin+OOD · A6 +margin+OOD+calibration. Same 5-fold protocol, same metrics, one script
(`run_ablation.js`) producing `research/results/ablation/ablation-table.csv`.

**Done when:** all 7 conditions have full metric rows (accuracy overall + per query-type + OOD
false-acceptance + latency) in one table.

---

## Phase 6 — Margin, Entropy, Top-k

Retrieve top-5/top-10 candidates per query; store rank/lexical score/semantic score/fused
score/normalized score for each. Compute margin (`score1-score2`), relative margin, and an
entropy/concentration measure over normalized top-k scores.

**Done when:** `research/results/*/candidates.json` has full ranked-candidate dumps for every
benchmark query under every system condition (needed for Phase 7–8 and the ambiguity figures).

---

## Phase 7 — OOD Detection + Selective Prediction (RETURN / CLARIFY / ABSTAIN)

Combine lexical score, semantic score, margin, entropy into one reliability score; sweep its
threshold on dev folds only; evaluate resulting 3-way decision (return/clarify/abstain) on the
15 OOD + 14 ambiguous + 119 in-domain queries. Report OOD precision/recall/F1/AUROC, and a
risk-coverage curve (selective accuracy vs. coverage).

**Done when:** `research/results/reliability/` has threshold-sweep data + final risk-coverage
curve data, evaluated fold-wise (no threshold chosen by peeking at final test fold).

---

## Phase 8 — Calibration

Compare: baseline confidence (`score/8*100`) vs. margin-based vs. semantic-similarity-based vs.
the combined reliability score, each post-hoc calibrated (isotonic regression — most defensible
given 150 points and non-parametric monotonic score-to-correctness relationship; avoid Platt/
temperature scaling unless justified). Report ECE, Brier score, reliability diagrams — fold-wise,
never fit and evaluated on the same fold.

**Done when:** `research/analysis/reliability-analysis.md` + ECE/Brier numbers for all four
confidence variants, before/after calibration.

---

## Phase 9 — Hyperparameter Search Log

Every threshold/α/margin cutoff chosen anywhere must appear as a row in
`research/results/configurations.json` (parameter, experiment ID, split, metric, result) — this
is what lets a reviewer verify nothing was cherry-picked on the test set.

**Done when:** file exists and every tunable value used downstream cites a row here.

---

## Phase 10 — Functional Evaluation (sandboxed, never on host)

For a feasible subset of benchmark commands (filesystem/git/npm categories are safest to
sandbox), execute retrieved commands inside a temp directory / disposable git repo / container,
and check actual task success vs. mere textual retrieval correctness. Explicitly report the
retrieval-correct-but-functionally-wrong rate if any exists. Skip categories that can't be
sandboxed safely (network/system/permissions) and say so explicitly — do not force it.

**Done when:** `research/results/functional/` has pass/fail per sandboxed query, and a written
note on which categories were excluded and why.

---

## Phase 11 — Safety Evaluation

Rule-based risk tagger (LOW/MEDIUM/HIGH/CRITICAL) over retrieved commands, evaluated for
precision/recall against a hand-labeled dangerous-command subset (the existing 15
`safety_sensitive` queries plus any corpus entries independently flagged as destructive).
No autonomous execution of anything tagged HIGH/CRITICAL, ever, in any experiment.

**Done when:** `research/analysis/safety-analysis.md` with precision/recall/F1 for the tagger.

---

## Phase 12 — Optional Local LLM Comparator (stretch, not required for publication)

If time/hardware allow: one local model (e.g. a small local instruct model run fully offline),
same benchmark, same metrics, explicitly labeled as a comparator only — never integrated into
`cli/`. If skipped, state in the paper that this was out of scope, not that it was omitted to
avoid an unfavorable comparison.

**Done when:** either results exist in `research/results/final/`, or the manuscript's
Limitations section explicitly states it was not run and why.

---

## Phase 13 — Statistical Analysis

Paired McNemar's test for each system-vs-baseline comparison on per-query correct/incorrect
outcomes; confidence intervals on accuracy (binomial CI given n=150 is small); explicitly avoid
overclaiming significance — report exact p-values and effect sizes, and state plainly where n
is too small to support a significance claim.

**Done when:** `research/analysis/statistical-analysis.md` with all pairwise tests tabulated.

---

## Phase 14 — Literature / Novelty Re-verification

Re-run the literature search (already partially done — NL2Bash, NLC2CMD, NL2SH, InterCode,
CodeSearchNet/CodeRAG-Bench, Notaro et al. risk classifier) specifically checking nothing newer
has already published "BM25 baseline + calibration/OOD for shell command retrieval" between now
and paper submission. Populate `research/paper/related-work-matrix.csv` with the columns
specified in your plan (paper/year/task/dataset/retrieval-or-generation/model/benchmark_size/
OOD/ambiguity/confidence/functional_eval/safety/latency/main_result/limitation/relevance).

**Done when:** matrix populated, novelty claim confirmed still defensible.

---

## Phase 15 — Figures & Tables (generated, not hand-drawn)

Scripts producing: baseline-vs-improved accuracy, accuracy-by-query-type, confidence
distribution, reliability diagram, risk-coverage curve, OOD score distribution, latency
comparison, ablation bar chart, error-taxonomy distribution. All under `research/figures/`,
all reproducible from `research/results/` inputs, all committed with their generating script.

---

## Phase 16 — Error Taxonomy

Automated per-query tagging (CORRECT / SEMANTIC_MISMATCH / LEXICAL_POLYSEMY /
OOD_FALSE_ACCEPTANCE / AMBIGUITY_FAILURE / OVERMATCH / WRONG_ACTION / WRONG_SCOPE /
WRONG_PLATFORM / LOW_OVERLAP_FAILURE / HIGH_CONFIDENCE_WRONG) for every system condition, in
`research/analysis/final-error-analysis.{md,csv}`.

---

## Phase 17 — Decision Gate (mandatory before writing Results/Abstract)

Look at Phase 4/5/7 numbers and classify honestly into Outcome A (strong accuracy + reliability
improvement), B (reliability/OOD improves, accuracy roughly flat), or C (no meaningful hybrid
gain — reliability-only or negative result). Write one paragraph in
`research/FINAL_RESEARCH_REPORT.md` naming which outcome occurred and why — this determines the
paper's actual contribution claim, not the other way around.

---

## Phase 18 — Manuscript, Research Report, Faculty Summary

- `research/paper/manuscript.md` — full 20-section draft (Abstract → References), every number
  pulled from `research/results/` and `research/figures/`, written only after Phase 17.
- `research/FINAL_RESEARCH_REPORT.md` — the 18-question evidence-chain document.
- `research/FACULTY_SUMMARY.md` — 2–4 page plain-academic-language walkthrough.
- `research/paper/limitations.md` — small benchmark (150 queries, 5-fold not a large held-out
  set), Windows/curated-corpus bias, hand-authored OOD queries, no large-scale human study,
  local-embedding-model dependency, functional eval limited to sandboxable categories.

---

## Phase 19 — Reproducibility & QC Pass

Run `npm test`, re-run baseline reproduction, re-run improved-system reproduction, re-validate
benchmark hash, re-run every experiment script from a clean checkout, check for: hard-coded
local paths, committed API keys/credentials, non-deterministic outputs without documented seeds,
orphaned files, broken links between report and result files.

---

## Phase 20 — Final Research Release

Tag `v0.2-hybrid-research` (after Phase 5) and `v1.0-research-final` (after Phase 19 passes).
Repository state at this tag = the thing the paper describes, byte-for-byte.

---

## Publication-readiness checklist (all must be TRUE before writing stops being "in progress")

- [ ] Baseline reproducible bit-for-bit from a clean checkout
- [ ] Benchmark hash verified and corrected in manifest
- [ ] Hybrid/dense retrieval implemented, local-only, no network calls
- [ ] Dev/test separation documented (5-fold protocol) — no threshold tuned on final numbers
- [ ] Full ablation (A0–A6) complete with per-query-type and OOD breakdowns
- [ ] Margin + entropy + OOD/abstention implemented and evaluated (precision/recall/AUROC/risk-coverage)
- [ ] Calibration implemented and evaluated (ECE, Brier, reliability diagram) for 4 confidence variants
- [ ] Hyperparameter search log complete, no undocumented tuned values
- [ ] Functional evaluation done for sandboxable categories, gaps stated explicitly
- [ ] Safety tagger precision/recall reported
- [ ] Statistical tests (McNemar's + CIs) complete for every system-vs-baseline pair
- [ ] Literature/novelty re-check done, related-work matrix populated
- [ ] All figures and tables generated by committed scripts
- [ ] Error taxonomy complete for every system condition
- [ ] Decision gate outcome (A/B/C) explicitly stated and drives the contribution claim
- [ ] Manuscript, research report, faculty summary, limitations all written from real numbers only
- [ ] No fabricated results, no fabricated citations, no baseline corruption
- [ ] Reproducibility QC pass clean, final tag cut

Once every box above is checked, **no further implementation should occur** — remaining work is
writing/formatting/submission only.
