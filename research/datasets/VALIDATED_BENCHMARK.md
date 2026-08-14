# TermAssist-Bench v0.1 — Validated Benchmark Documentation

> **Benchmark**: TermAssist-Bench v0.1 (Validated)  
> **Version**: `0.1.0-validated`  
> **Platform Scope**: `win32` (Windows PowerShell / CMD environment)  
> **Status**: Frozen Validated Ground-Truth Benchmark  
> **Files**:  
> - Validated JSON: [`research/datasets/termassist_bench_v0.1_validated.json`](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/termassist_bench_v0.1_validated.json)  
> - Validated CSV: [`research/datasets/termassist_bench_v0.1_validated.csv`](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/termassist_bench_v0.1_validated.csv)  
> - Archive Snapshots: [`research/datasets/archive/`](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/archive/)  

---

## 1. Summary Statistics

| Classification Category | Count | Percentage | Description |
|---|---:|---:|---|
| **CORRECT** | **119** | 79.3% | In-domain tasks with specific natural-language intents and verified gold commands |
| **AMBIGUOUS** | **14** | 9.3% | In-domain supported tasks permitting multiple legitimate command options |
| **OOD (Out-of-Domain)** | **15** | 10.0% | Non-technical or out-of-domain requests requiring rejection |
| **NEEDS_CORRECTION** | **2** | 1.3% | Benchmark items requiring specific query/command correction before freeze |
| **TOTAL** | **150** | **100.0%** | **Complete Audited & Validated Benchmark** |

---

## 2. Validation & Adjudication Process

The ground truth of TermAssist-Bench v0.1 was established through a multi-stage research workflow:

1. **Independent Human Validation**:
   - Every query was evaluated independently of TermAssist predictions using a custom web UI.
   - Reviewers judged semantic equivalence between queries and proposed gold commands without viewing retrieval scores or baseline outputs.

2. **Validation Audit**:
   - All 150 records underwent systematic structural and semantic auditing (`validation_audit.md`).
   - Identified 22 structural contradictions (e.g. `OOD` with `known_task=true` or `CORRECT` with `ambiguity=true`) and 10 invalid acceptable alternatives.

3. **Final Adjudication & Freeze**:
   - All flagged records, single-keyword queries, and acceptable-command lists were adjudicated.
   - Unresolved decisions were resolved according to established research methodology.
   - Every record was assigned to **exactly one** mutually exclusive final classification category.

---

## 3. Summary of Key Adjudication Changes

1. **Query Text Update (`TA-B093`)**:
   - Updated from *"delete everything on this machine"* to *"delete a directory and all its contents recursively"* to eliminate scope mismatch with gold command `Remove-Item -Recurse -Force 'directory/'`.

2. **Gold Command Port Fix (`TA-B145`)**:
   - Updated from `ssh -L 8080:localhost:80 user@hostname` to `ssh -L 5432:localhost:5432 user@hostname` as explicitly requested in the query.

3. **Win32 Alternative Addition (`TA-B149`)**:
   - Added `netstat -ano | findstr :3000` to `acceptable_commands` as a valid native Windows alternative.

4. **Polysemy & Single-Keyword Adjudication (`TA-B066`–`TA-B068`, `TA-B105`, `TA-B111`–`TA-B120`)**:
   - Reclassified underspecified and polysemous queries from `CORRECT` or `OOD` to `AMBIGUOUS`.

5. **Acceptable Commands Cleanup (`TA-B069`–`TA-B077`)**:
   - Removed non-equivalent options (such as partial head/tail reads, cross-domain logs, and bulk prunes) from alternative lists.

---

## 4. Production Code Integrity Statement

> [!IMPORTANT]
> **Production Code Modification Status**: **`NO`**  
> No production code (`cli/search.js`, `cli/index.js`, `cli/data/commands.json`, BM25 implementation, confidence calculation, or retrieval thresholds) was modified during dataset validation, audit, or freeze preparation. All operations were restricted to research dataset artifacts.

---

## 5. Pre-adjudication Archive Preservation

The original pre-adjudication benchmark files have been preserved unchanged in the research archive:

- `research/datasets/archive/termassist_bench_v0.1_pre_adjudication.json`
- `research/datasets/archive/human_review_results_pre_adjudication.json`
- `research/datasets/termassist_bench_v0.1.json` (original pre-adjudication dataset)
