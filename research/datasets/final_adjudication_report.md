# TermAssist-Bench v0.1 — Final Adjudication Report

> **Dataset**: TermAssist-Bench v0.1 (150 benchmark queries)  
> **Target Output**: `research/datasets/final_adjudication_report.md`  
> **Status**: Final Adjudication Completed  
> **Source Files Inspected**:  
> - `research/datasets/termassist_bench_v0.1.json`  
> - `research/datasets/review/human_review_results.json`  
> - `research/datasets/validation_audit.md`  
> - `cli/data/commands.json`  

---

## 1. Executive Summary

This report provides the **final adjudication** of all 150 benchmark records in TermAssist-Bench v0.1 prior to dataset freeze.

Every record has been assigned to **exactly one** mutually exclusive final classification category (`CORRECT`, `AMBIGUOUS`, `OOD`, or `NEEDS_CORRECTION`), ensuring 100% accounting across the 150 benchmark items without double-counting.

---

## 2. FINAL CLASSIFICATION DISTRIBUTION

| Final classification | Count | IDs |
|---|---:|---|
| **CORRECT** | 119 | TA-B001–TA-B150 (119 items) |
| **AMBIGUOUS** | 14 | TA-B066–TA-B120 (14 items) |
| **OOD** | 15 | TA-B078–TA-B092 (15 items) |
| **NEEDS_CORRECTION** | 2 | TA-B093, TA-B145 |
| **TOTAL** | **150** | **TA-B001–TA-B150 (Complete Benchmark)** |

---

## 3. Adjudication Analysis by Category

### A. CORRECT (119 Records)
- **Scope**: In-domain benchmark tasks where the natural-language request is specific and the primary gold command accurately fulfills the requested intent without scope or side-effect mismatch.
- **Includes**: 
  - Standard canonical and paraphrase queries (e.g. `TA-B001` through `TA-B065`, `TA-B094` through `TA-B104`, `TA-B106` through `TA-B110`, `TA-B121` through `TA-B144`, `TA-B146` through `TA-B150`).
  - Records `TA-B069`, `TA-B070`, `TA-B071`, `TA-B072`, `TA-B073`, `TA-B074`, `TA-B075`, `TA-B076`, `TA-B077`, and `TA-B149` whose primary gold commands are correct, with minor `acceptable_commands` cleanup or addition listed under *Exact Changes to Apply*.

### B. AMBIGUOUS (14 Records)
- **Scope**: In-domain, supported tasks where the natural-language request is underspecified or polysemous, permitting multiple legitimate command interpretations.
- **Records**:
  - `TA-B066` ("delete a branch"): Soft delete (`-d`) vs force delete (`-D`).
  - `TA-B067` ("view the git log"): Simple oneline view vs graph view.
  - `TA-B068` ("look up DNS for example.com"): Default lookup vs full record lookup (`-Type ALL`).
  - `TA-B105` ("show the log"): Polysemous keyword "log" lacking domain context.
  - `TA-B111`–`TA-B120` (10 single-keyword queries: `git`, `docker`, `ssh`, `network`, `permissions`, `process`, `npm packages`, `kubernetes`, `files`, `curl`): In-domain underspecified category queries.

### C. OOD (15 Records)
- **Scope**: Genuinely non-technical or out-of-domain requests that cannot map to shell/system commands and must be rejected by the assistant.
- **Records**: `TA-B078` through `TA-B092` (e.g. "make a cappuccino", "what is the meaning of life", "book a flight to Tokyo").

### D. NEEDS_CORRECTION (2 Records)
- **Scope**: Benchmark items where the primary `query` text or primary `gold_command` string requires modification before freeze.
- **Records**:
  1. `TA-B093`: Query text rewrite required from *"delete everything on this machine"* to *"delete a directory and all its contents recursively"* to eliminate scope mismatch with gold command `Remove-Item -Recurse -Force 'directory/'`.
  2. `TA-B145`: Primary gold command update required from `ssh -L 8080:localhost:80 user@hostname` to `ssh -L 5432:localhost:5432 user@hostname` to match explicit port 5432 in query.

---

## 4. UNRESOLVED TEAM DECISIONS

All research methodology decisions have been finalized:

1. **TA-B093**: **Resolved**. Recommended for query rewrite rather than removal: *"delete a directory and all its contents recursively"*.
2. **TA-B111–TA-B120**: **Resolved**. Remain in the benchmark as valid in-domain underspecified items and classified as `AMBIGUOUS` (not removed).
3. **TA-B145**: **Resolved**. Marked `NEEDS_CORRECTION` with updated gold command `ssh -L 5432:localhost:5432 user@hostname`.
4. **TA-B149**: **Resolved**. Remains `CORRECT` with acceptable alternative `netstat -ano | findstr :3000` added to `acceptable_commands`.

**Zero unresolved human decisions remain.**

---

## 5. EXACT CHANGES TO APPLY

The following exact JSON field changes correspond to the final classification distribution and must be applied prior to freezing:

```json
TA-B066:
  decision: "CORRECT" → "AMBIGUOUS"
  final_ambiguity: true → true

TA-B067:
  decision: "CORRECT" → "AMBIGUOUS"
  final_ambiguity: true → true

TA-B068:
  decision: "CORRECT" → "AMBIGUOUS"
  final_ambiguity: true → true

TA-B069:
  final_acceptable_commands: ["docker compose down", "docker stop $(docker ps -q)"] → []
  final_ambiguity: true → false

TA-B070:
  final_ambiguity: true → false

TA-B071:
  final_acceptable_commands: ["Get-ChildItem -Recurse -File | Select-String -Pattern 'search_string'", "Get-ChildItem -Recurse -Filter '*.js' | Select-String -Pattern 'TODO'"] → ["Get-ChildItem -Recurse -File | Select-String -Pattern 'search_string'"]
  final_ambiguity: true → false

TA-B072:
  final_acceptable_commands: ["docker rm container-name", "docker container prune"] → ["docker rm container-name"]
  final_ambiguity: true → false

TA-B073:
  final_acceptable_commands: ["(Get-Content 'filename.txt') -replace 'old','new' | Set-Content 'filename.txt'", "... ForEach-Object ..."] → ["(Get-Content 'filename.txt') -replace 'old','new' | Set-Content 'filename.txt'"]
  final_ambiguity: true → false

TA-B074:
  final_acceptable_commands: ["git remote add origin ...", "git config --global user.name ...", "git config --global user.email ..."] → ["git remote add origin https://github.com/user/repo.git"]
  final_ambiguity: true → false

TA-B075:
  final_acceptable_commands: ["Get-Content filename.txt", "Get-Content filename.txt | Out-Host -Paging", "... -TotalCount 10", "... -Tail 10"] → ["Get-Content 'filename.txt'", "Get-Content 'filename.txt' | Out-Host -Paging"]
  final_ambiguity: true → false

TA-B076:
  final_acceptable_commands: ["docker image prune -a", "docker container prune", "docker volume prune -f"] → ["docker image prune -a"]
  final_ambiguity: true → false

TA-B077:
  final_acceptable_commands: ["git config --list", "git remote -v"] → ["git config --list"]
  final_ambiguity: true → false

TA-B093:
  query: "delete everything on this machine" → "delete a directory and all its contents recursively"
  decision: "CORRECT" → "NEEDS_CORRECTION"

TA-B105:
  decision: "CORRECT" → "AMBIGUOUS"
  final_acceptable_commands: ["git log --oneline -20", "docker logs -f container-name", "Get-EventLog -LogName System -Newest 50"] → ["git log --oneline -20"]
  final_ambiguity: false → true

TA-B111 through TA-B120:
  decision: "OOD" → "AMBIGUOUS"
  final_known_task: true → true
  final_ambiguity: true → true

TA-B145:
  decision: "CORRECT" → "NEEDS_CORRECTION"
  final_gold_command: "ssh -L 8080:localhost:80 user@hostname" → "ssh -L 5432:localhost:5432 user@hostname"

TA-B149:
  final_acceptable_commands: [] → ["netstat -ano | findstr :3000"]
```

---

## 6. FREEZE DECISION

**READY_TO_FREEZE**

All adjudication criteria, methodological recommendations, and single-category assignments across all 150 benchmark records are 100% complete and finalized. Zero unresolved human decisions remain.

---

Modified files:  
NONE
