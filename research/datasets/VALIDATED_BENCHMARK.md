# TermAssist-Bench v0.1 — Validated Benchmark Documentation

> **Benchmark**: TermAssist-Bench v0.1 (Validated & Frozen)  
> **Version**: `v0.1-validated`  
> **Evaluation Scope**: `win32` (Windows PowerShell / CMD environment)  
> **Status**: Frozen Validated Ground-Truth Benchmark  
> **Manifest**: [`research/datasets/VALIDATED_BENCHMARK_MANIFEST.json`](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/VALIDATED_BENCHMARK_MANIFEST.json)  
> **Validated Dataset Files**:  
> - Validated JSON: [`research/datasets/termassist_bench_v0.1_validated.json`](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/termassist_bench_v0.1_validated.json)  
> - Validated CSV: [`research/datasets/termassist_bench_v0.1_validated.csv`](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/termassist_bench_v0.1_validated.csv)  
> - Archive Snapshots: [`research/datasets/archive/`](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/archive/)  

---

## 1. Overview & Freeze Statement

This document defines the **frozen ground-truth benchmark** for evaluating the frozen TermAssist BM25 baseline experiment.

### Key Dataset Characteristics:
- **Total Queries**: 150 benchmark queries (TA-B001 through TA-B150).
- **Classification Distribution**:
  - **CORRECT**: 119 queries (79.3%) — In-domain tasks with specific natural-language requests and verified gold commands.
  - **AMBIGUOUS**: 14 queries (9.3%) — In-domain supported tasks permitting multiple legitimate command options (intentionally retained to evaluate handling of underspecified requests).
  - **OOD (Out-of-Domain)**: 15 queries (10.0%) — Non-technical or out-of-domain requests (intentionally retained to evaluate safety rejection capability).
  - **NEEDS_CORRECTION**: 2 queries (1.3%) — Specific benchmark items updated during adjudication (TA-B093 query rewrite and TA-B145 gold command port fix).
- **Evaluation Platform Scope**: `win32` (Windows PowerShell / CMD execution environment).
- **Human Validation Sequence**: Independent human validation, validation auditing (`validation_audit.md`), and formal final adjudication (`final_adjudication_report.md`) were completed **prior** to executing the baseline experiment.
- **Pre-adjudication Archiving**: The original pre-adjudication benchmark files (`termassist_bench_v0.1.json` and `human_review_results.json`) are preserved unchanged in [`research/datasets/archive/`](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/archive/).
- **Production Code Integrity**: Production code (`cli/search.js`, `cli/index.js`, `cli/data/commands.json`, BM25 implementation, confidence formula, thresholds) was **NOT** modified during benchmark preparation.
- **Baseline Experiment Status**: The 150-query baseline retrieval experiment has **NOT** yet been executed.

---

## 2. Dataset Classification Accounting

| Classification Category | Count | Percentage | Description |
|---|---:|---:|---|
| **CORRECT** | **119** | 79.3% | In-domain queries with verified gold commands and matching intent |
| **AMBIGUOUS** | **14** | 9.3% | In-domain queries with multiple valid command options |
| **OOD** | **15** | 10.0% | Out-of-domain requests for rejection testing |
| **NEEDS_CORRECTION** | **2** | 1.3% | Adjudicated benchmark items (TA-B093 & TA-B145) |
| **TOTAL** | **150** | **100.0%** | **Complete Audited & Validated Benchmark** |

---

## 3. Summary of Key Adjudicated Items

- **TA-B093**: Query text updated to *"delete a directory and all its contents recursively"* to match the gold command `Remove-Item -Recurse -Force 'directory/'`.
- **TA-B145**: Gold command updated to `ssh -L 5432:localhost:5432 user@hostname` as explicitly specified in the query.
- **TA-B149**: `netstat -ano | findstr :3000` added to `acceptable_commands` as a valid native Windows alternative.
- **TA-B066–TA-B068, TA-B105, TA-B111–TA-B120**: Classified as `AMBIGUOUS` (polysemous and single-keyword category queries retained in-domain).
- **TA-B078–TA-B092**: Classified as `OOD` (retained for rejection evaluation).

---

## 4. Integrity Sign-off

- **Production Code Modified**: NO
- **Baseline Experiment Executed**: NO
- **Validation Status**: FROZEN
