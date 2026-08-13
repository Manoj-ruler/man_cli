# TermAssist-Bench v0.1 — Quality Control & Validation Report

> **Dataset**: TermAssist-Bench v0.1  
> **Date**: 2026-08-13  
> **Target Corpus**: win32-filtered TermAssist command database (279 unique intents, 26 categories)  
> **JSON File**: [termassist_bench_v0.1.json](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/termassist_bench_v0.1.json)  
> **CSV File**: [termassist_bench_v0.1.csv](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/termassist_bench_v0.1.csv)  
> **Annotation Status**: `needs_review` (Draft status pending human review)

---

## 1. Summary Statistics

| Metric | Count | Percentage |
|--------|------:|------------|
| **Total Benchmark Queries** | **150** | 100.0% |
| **Supported Tasks (`known_task: true`)** | 135 | 90.0% |
| **Unsupported / OOD Queries (`requires_rejection: true`)** | 15 | 10.0% |
| **Ambiguous Queries (`ambiguity: true`)** | 22 | 14.7% |
| **Paraphrase Queries (Standard + Low Overlap)** | 40 | 26.7% |
| **Unique Corpus Source Intents Represented** | 97 | 34.8% of win32 corpus |

---

## 2. Queries per Query Type

| Code | Query Type | Count | Percentage | Description |
|------|-----------|------:|-----------:|-------------|
| `canonical` | Direct / Verbatim | 25 | 16.7% | Verbatim or near-verbatim intent matches across all 26 categories |
| `paraphrase` | Standard Paraphrase | 25 | 16.7% | Natural rephrasing with moderate word overlap |
| `low_overlap_paraphrase` | Low Overlap Paraphrase | 15 | 10.0% | Same task expressed with substantially different vocabulary |
| `polysemy` | Lexical / Polysemy Confusion | 18 | 12.0% | Uses words like delete, remove, kill, run, make across domains |
| `safety_sensitive` | Safety Sensitive | 15 | 10.0% | Destructive or privileged operations (rm, sudo, reset, shutdown) |
| `complex_multi_intent` | Complex Multi-Intent | 15 | 10.0% | Longer requests with multiple constraints |
| `ood` | Out-of-Domain | 15 | 10.0% | Requests with no corresponding command in the corpus |
| `ambiguous` | Ambiguous Intent | 12 | 8.0% | Requests where multiple valid command interpretations exist |
| `single_keyword` | Single Keyword | 10 | 6.7% | Single-word or underspecified queries (git, docker, ssh) |
| | **TOTAL** | **150** | **100.0%** | |

---

## 3. Queries per Difficulty Level

| Difficulty | Count | Percentage | Criteria |
|------------|------:|-----------:|----------|
| `easy` | 42 | 28.0% | High lexical overlap (≥80% content tokens shared with corpus intent) |
| `medium` | 55 | 36.7% | Moderate paraphrasing (40–79% content tokens shared) |
| `hard` | 40 | 26.7% | Low lexical overlap (<40% tokens shared) or compositional constraints |
| `adversarial` | 13 | 8.7% | Explicitly constructed to trigger known failure modes (polysemy, single-keyword) |

---

## 4. Queries per Risk Level

| Risk Level | Count | Percentage | Description | Examples |
|------------|------:|-----------:|-------------|----------|
| `low` | 120 | 80.0% | Read-only or information query; no state mutation | `git status`, `ls`, `docker ps` |
| `medium` | 10 | 6.7% | Reversible state change or standard operation | `git reset --soft`, `npm install`, `mkdir` |
| `high` | 15 | 10.0% | Difficult-to-reverse changes | `git branch -D`, `docker image prune`, `rm -rf` |
| `critical` | 5 | 3.3% | Potentially catastrophic or privileged state changes | `delete everything`, `reboot`, `shutdown`, `Start-Process RunAs` |

---

## 5. Queries per Corpus Category (All 26 Categories Represented)

| Category | Count | Category | Count |
|----------|------:|----------|------:|
| `git` | 25 | `grep` | 3 |
| `docker` | 15 | `find` | 3 |
| `filesystem` | 12 | `security` | 3 |
| `npm` | 9 | `pip` | 2 |
| `network` | 9 | `disk` | 2 |
| `process` | 9 | `encoding` | 2 |
| `permissions` | 7 | `archive` | 2 |
| `shell` | 6 | `ffmpeg` | 2 |
| `kubernetes` | 5 | `sed` | 1 |
| `ssh` | 5 | `package` | 1 |
| `system` | 4 | `awk` | 1 |
| `curl` | 4 | `aws` | 1 |
| *OOD (no category)* | 15 | `jq` | 1 |
| | | `terminal` | 1 |
| | | **TOTAL** | **150** |

---

## 6. Corpus Source-Intent Distribution & Balance Checks

- **Total unique source intents used**: 97 out of 279 win32 corpus intents (34.8% coverage).
- **Maximum occurrences per source intent**: **3** (No single intent is used more than 3 times across different query types).
- **Dominance Check**: The most frequently sampled intent (`undo last git commit but keep changes`) represents only 2.0% (3/150) of the benchmark dataset. No single intent dominates the benchmark.

---

## 7. Quality Control Checks & Integrity Audit

| Check | Result | Details |
|-------|--------|---------|
| **Exact Duplicate Check** | ✅ PASSED | 0 exact duplicate queries found. |
| **Near-Duplicate Check** | ✅ PASSED | Checked using normalized token sequences; all queries are distinct. |
| **Gold Command Verification** | ✅ PASSED | All 135 supported queries map to verified commands in `commands.json`. |
| **OOD Verification** | ✅ PASSED | All 15 OOD queries verifiably have no match in the 279 win32 intents. |
| **Risk Level Mapping** | ✅ PASSED | Risk levels strictly assigned based on gold command behavior. |
| **Ambiguity Mapping** | ✅ PASSED | All 22 ambiguous queries have documented acceptable commands or rationale. |

---

## 8. Annotation Review Status

> [!WARNING]
> **All 150 queries in TermAssist-Bench v0.1 are currently tagged with `annotation_status: "needs_review"`.**  
> While all ground-truth entries were algorithmically mapped to verified corpus intents, formal human peer review is required before publishing evaluation results.

---

## 9. Readiness Statement

TermAssist-Bench v0.1 successfully passes all structural, quality-control, and balance checks. It provides a balanced, multi-dimensional test suite specifically designed to evaluate the frozen TermAssist baseline retrieval engine.
