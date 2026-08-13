# TermAssist Research — Baseline Audit Infrastructure

## Purpose

This directory contains the **baseline audit and probing infrastructure** for the TermAssist research paper. The goal is to answer a single question:

> **What does the current, untouched TermAssist search system actually do?**

This is a **measurement experiment**, not an improvement experiment. No algorithms, scores, confidence calculations, or retrieval mechanisms are modified. The frozen TermAssist baseline (tagged `v1.0-research-baseline`) is evaluated as-is.

## ⚠️ Important Research Principles

- **The probe script calls the existing `cli/search.js` `search()` function directly.** No search logic is duplicated or reimplemented.
- **Results must NOT be manually edited.** Re-run the probe to regenerate.
- **Production code is not modified.** No changes to `cli/search.js`, `cli/index.js`, `cli/data/commands.json`, BM25 parameters, confidence calculation, or any production behavior.
- **This experiment evaluates the frozen TermAssist baseline** tagged at `v1.0-research-baseline`.

## Running the Probe

```bash
# From the termassist/ root directory:
npm run research:probe

# Or directly:
node research/probe_baseline.js
```

## Directory Structure

```
research/
├── README.md                          # This file
├── probe_baseline.js                  # Baseline probing script
├── probes/
│   └── initial_queries.json           # Fixed set of research probe queries
└── results/
    ├── .gitkeep                       # Ensures directory is tracked in git
    ├── baseline-probe.json            # Machine-readable results (generated)
    └── baseline-probe.csv             # Tabular results (generated)
```

## Generated Files

### `results/baseline-probe.json`

Machine-readable JSON containing:
- Full environment/reproducibility metadata
- Summary statistics
- Per-query results array

### `results/baseline-probe.csv`

Comma-separated tabular format of per-query results for easy import into spreadsheets, pandas, R, etc.

## Recorded Metrics

| Metric | Description |
|--------|-------------|
| `id` | Unique probe identifier (e.g., P001) |
| `query` | The exact natural-language query submitted to `search()` |
| `probe_category` | Why this query was selected (e.g., `exact_intent_match`, `paraphrase`, `out_of_domain`) — for experimental design only, not ground truth |
| `predicted_command` | The command returned by `search()` as the best match |
| `predicted_category` | The category of the matched command (e.g., `git`, `docker`, `network`) |
| `raw_score` | The raw BM25 + substring-bonus score from the search engine (not normalized) |
| `confidence` | The synthetic confidence percentage computed by TermAssist: `min(round((score / 8) * 100), 100)`, zeroed if `score < 2.0` |
| `rejected_by_threshold` | Whether the production CLI (`index.js`) would reject this result. The production threshold is `confidence < 30`. |
| `latency_ms` | Wall-clock time in milliseconds for the `search()` call, measured with `process.hrtime.bigint()` |

## Reproducibility Metadata

Each result file includes:
- Timestamp (ISO 8601)
- Node.js version
- Platform, architecture, OS release
- Git commit hash (HEAD at time of run)
- Git branch name
- Git tags at HEAD
- Total number of commands in the corpus (before OS filtering)
- Probe file version
- Production confidence threshold used for rejection determination

## Probe Query Categories

The initial probe set (`probes/initial_queries.json`) contains ~18 queries designed to expose different behaviors:

| Category | Purpose |
|----------|---------|
| `exact_intent_match` | Verbatim copies of intents in `commands.json` — expected to score maximally |
| `paraphrase` | Same meaning, different wording — tests vocabulary generalization |
| `natural_language_verbose` | Longer conversational phrasing — tests robustness to noise tokens |
| `terse_query` | Very short (1–2 word) queries — tests minimal-information retrieval |
| `complex_specific` | Multi-concept queries — tests handling of compound intents |
| `out_of_domain` | Queries with no terminal relevance — should be rejected |
| `ambiguous_risky` | Vague or potentially dangerous requests — reveals safety-relevant behavior |
| `single_keyword` | Single token matching a category/command name — tests fallback behavior |
| `synonym_wording` | Different vocabulary for the same concept — tests cross-domain matching |

## What This Does NOT Do

- ❌ Does not modify any production code
- ❌ Does not add embeddings, LLMs, RAG, FAISS, or semantic matching
- ❌ Does not normalize scores or calibrate confidence
- ❌ Does not label results as correct/incorrect (that is a separate annotation step)
- ❌ Does not generate the full 150-query benchmark
- ❌ Does not compare algorithms or alternative implementations
