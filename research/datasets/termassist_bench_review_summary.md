# TermAssist-Bench v0.1 — Human-Review Preparation Summary

> **Dataset**: TermAssist-Bench v0.1  
> **Date**: 2026-08-13  
> **Review Queue CSV**: [termassist_bench_review_queue.csv](file:///c:/Users/manoj/OneDrive/Desktop/MAN-CLI/termassist/research/datasets/termassist_bench_review_queue.csv)  
> **Annotation Status**: `needs_review` (Pre-experiment review preparation pass)

---

## 1. Executive Review Breakdown

Out of **150 total queries** in TermAssist-Bench v0.1, all items have been categorized into specific review queues to prepare for human validation:

| Classification Category | Count | Percentage | Primary Review Focus |
|-------------------------|------:|-----------:|----------------------|
| **`READY_FOR_HUMAN_CONFIRMATION`** | **50** | 33.3% | Straightforward canonical/paraphrase queries with unambiguous gold commands |
| **`NEEDS_GOLD_COMMAND_REVIEW`** | **44** | 29.3% | Linguistic variation, polysemous terms, or complex natural language constraints |
| **`NEEDS_AMBIGUITY_REVIEW`** | **22** | 14.7% | Underspecified or single-keyword queries with multiple acceptable commands |
| **`NEEDS_RISK_REVIEW`** | **17** | 11.3% | Destructive or privileged commands (rm, sudo, shutdown, git reset --hard) |
| **`NEEDS_OOD_REVIEW`** | **15** | 10.0% | Out-of-domain queries requiring confirmation of mandatory rejection |
| **`NEEDS_PLATFORM_REVIEW`** | **2** | 1.3% | Platform-specific tool syntax (icacls, Set-ExecutionPolicy) |
| **TOTAL** | **150** | **100.0%** | |

---

## 2. Integrity Verification Audit Results

- **Gold Commands Present in `commands.json`**: **150 / 150 (100%)** — Every supported query's gold command exists in the corpus. Zero missing gold commands.
- **Acceptable Commands Present in `commands.json`**: **100%** — All entries listed in `acceptable_commands` arrays map to valid commands in `commands.json`.
- **Exact Duplicate Queries**: **0** — No identical query strings exist.
- **Semantic Cross-Type Variants**: 3 intentional pairs exist to test sensitivity to wording (e.g., TA-B001 canonical vs. TA-B026 paraphrase for `git reset --soft HEAD~1`).

---

## 3. Suspicious Examples & Phrasing Discrepancies Flagged for Review

The preparation audit flagged 3 notable examples where the natural language query contains constraints or phrasing that do not perfectly align with the mapped corpus entry:

### 1. TA-B138 (Complex Multi-Intent)
- **Query**: `"deploy my kubernetes cluster to production with rolling updates"`
- **Gold Intent in Corpus**: `"apply a kubernetes manifest file"`
- **Gold Command**: `kubectl apply -f manifest.yaml`
- **Flag Reason**: The query explicitly requests a "rolling update deployment", whereas the corpus only contains a generic `kubectl apply` entry. The baseline retrieval engine matched `kubectl get events` during pilot testing. Human reviewers must decide whether `kubectl apply` should be retained as the gold command or if this query should be reclassified as OOD.

### 2. TA-B093 (Polysemy / Adversarial)
- **Query**: `"delete everything on this machine"`
- **Gold Intent in Corpus**: `"remove a directory and its contents"`
- **Gold Command**: `Remove-Item -Recurse -Force 'directory/'`
- **Flag Reason**: The query asks to delete "everything on this machine" (system-wide), whereas the corpus intent is deleting a single directory. The pilot probe showed this query matched `curl -X DELETE`. Flagged for risk review and semantic match verification.

### 3. TA-B102 (Polysemy)
- **Query**: `"stop everything running"`
- **Gold Intent in Corpus**: `"stop all running docker containers"`
- **Gold Command**: `docker stop $(docker ps -q)`
- **Flag Reason**: The query says "stop everything running" without mentioning Docker. It could plausibly refer to systemd services or OS processes. Flagged to confirm whether `acceptable_commands` should include process killing commands.

---

## 4. Summary of Specific Review Categories

1. **Gold-Command Review Queue (44 items)**: Covers polysemy, low-overlap paraphrases, and complex queries (e.g., TA-B051: "how much storage is left on my drives" → `Get-PSDrive`). Reviewers should verify if the mapped command is functionally equivalent.
2. **Ambiguity Review Queue (22 items)**: Includes 10 single-keyword queries (`git`, `docker`, `ssh`, `curl`, etc.) and 12 underspecified queries (`delete a branch`, `view the file`). Reviewers should verify that `acceptable_commands` covers all legitimate interpretations.
3. **Risk Review Queue (17 items)**: Includes 5 `critical` and 12 `high` risk commands. Reviewers must confirm safety labels and enforce non-execution flags.
4. **OOD Review Queue (15 items)**: Includes non-technical requests ("make a cappuccino") and unsupported terminal tasks ("compile a Rust project"). Reviewers must confirm no entry in `commands.json` fulfills the query.
5. **Platform Review Queue (2 items)**: Validates OS compatibility for Windows PowerShell specific commands (`icacls`, `Set-ExecutionPolicy`).

---

## 5. Concise Recommendation

### **Recommendation: A. Ready for human validation**

The benchmark preparation is complete. All 150 items are structured, verified against `commands.json`, and mapped to explicit review queues in `termassist_bench_review_queue.csv`. Human reviewers can now systematically process the queue and transition entries from `needs_review` to `verified` before running the baseline evaluation experiment.

---

### **STOP NOTICE**
- **Production Code**: `cli/search.js`, `cli/index.js`, and `cli/data/commands.json` remain 100% unmodified.
- **Benchmark Execution**: No queries were executed against TermAssist during this review preparation pass.
- **No Calibration / Models**: No retrieval algorithms, calibration layers, or LLM evaluation models were created.
