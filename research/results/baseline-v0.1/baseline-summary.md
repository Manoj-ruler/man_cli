# TermAssist-Bench v0.1 Baseline

## 1. Experiment Configuration

- **Benchmark**: TermAssist-Bench v0.1 (Validated)
- **Commit**: `4443ec016c87895ebbc1b9be831e5f80b9bd3b50`
- **Branch**: `research/baseline`
- **Platform / OS**: `win32` (10.0.26200, x64)
- **Node Version**: `v24.2.0`
- **Timestamp**: `2026-08-14T09:40:53.169Z`
- **Benchmark SHA-256**: `2a554d3c3c425192e0fa295f2dc2eae833f92a2ae77feaf0f3ef70996e8c02a0`

---

## 2. Dataset

| Classification | Count |
|---|---:|
| CORRECT | 119 |
| AMBIGUOUS | 14 |
| OOD | 15 |
| NEEDS_CORRECTION | 2 |
| **TOTAL** | **150** |

---

## 3. Overall Retrieval Results

- **Exact CORRECT Hits**: 93
- **AMBIGUOUS Hits**: 4
- **AMBIGUOUS Incorrect**: 10
- **In-Domain Incorrect**: 28
- **In-Domain Rejected**: 0
- **OOD Correct Rejections**: 4
- **OOD False Acceptances**: 11

### Performance Metrics:
- **Overall Benchmark Accuracy (All 150 Queries)**: 67.3% (101/150)
- **Supported-Task Accuracy (Excluding 15 OOD)**: 71.9% (97/135)
- **Supported Non-Ambiguous Accuracy (119 CORRECT queries)**: 78.2% (93/119)
- **OOD Rejection Rate (15 OOD queries)**: 26.7% (4/15)
- **Ambiguity Success Rate (14 AMBIGUOUS queries)**: 28.6% (4/14)

---

## 4. OOD Results

- **Total OOD Queries**: 15
- **Correctly Rejected**: 4
- **Falsely Accepted**: 11
- **Rejection Rate**: 26.7%
- **False Acceptance Rate**: 73.3%

---

## 5. Ambiguity Results

- **Total Ambiguous Queries**: 14
- **Acceptable Result Count**: 4
- **Unacceptable Result Count**: 10
- **Rejection Count**: 0
- **Confidence Distribution for Ambiguous**:
  - High (>= 80%): 13
  - Medium (50-79%): 1
  - Low (1-49%): 0
  - Zero (0%): 0

---

## 6. Confidence Analysis

- **Mean Confidence**: 91.6%
- **Median Confidence**: 100%
- **Min / Max Confidence**: 0% / 100%

### High-Confidence Wrong Results (Confidence >= 80%):
- **Total Count**: 32

---

## 7. Latency

- **Mean Latency**: 3.2949 ms
- **Median Latency**: 2.7579 ms
- **P95 Latency**: 6.4642 ms
- **Minimum Latency**: 1.9863 ms
- **Maximum Latency**: 21.6023 ms

---

## 8. Query-Type Breakdown

| Query Type | Total | Hits | Accuracy |
|---|---:|---:|---:|
| `ambiguous` | 12 | 7 | 58.3% |
| `canonical` | 25 | 25 | 100.0% |
| `complex_multi_intent` | 15 | 13 | 86.7% |
| `low_overlap_paraphrase` | 15 | 5 | 33.3% |
| `ood` | 15 | 4 | 26.7% |
| `paraphrase` | 25 | 22 | 88.0% |
| `polysemy` | 18 | 10 | 55.6% |
| `safety_sensitive` | 15 | 15 | 100.0% |
| `single_keyword` | 10 | 0 | 0.0% |

---

## 9. Corpus Category Breakdown

| Category | Total | Hits | Accuracy |
|---|---:|---:|---:|
| `archive` | 2 | 2 | 100.0% |
| `awk` | 1 | 1 | 100.0% |
| `aws` | 1 | 1 | 100.0% |
| `curl` | 4 | 3 | 75.0% |
| `disk` | 2 | 1 | 50.0% |
| `docker` | 15 | 12 | 80.0% |
| `encoding` | 2 | 1 | 50.0% |
| `ffmpeg` | 2 | 2 | 100.0% |
| `filesystem` | 12 | 8 | 66.7% |
| `find` | 3 | 3 | 100.0% |
| `general` | 15 | 4 | 26.7% |
| `git` | 25 | 19 | 76.0% |
| `grep` | 3 | 2 | 66.7% |
| `jq` | 1 | 1 | 100.0% |
| `kubernetes` | 5 | 3 | 60.0% |
| `network` | 9 | 5 | 55.6% |
| `npm` | 9 | 4 | 44.4% |
| `package` | 1 | 1 | 100.0% |
| `permissions` | 7 | 4 | 57.1% |
| `pip` | 2 | 1 | 50.0% |
| `process` | 9 | 7 | 77.8% |
| `security` | 3 | 3 | 100.0% |
| `sed` | 1 | 0 | 0.0% |
| `shell` | 6 | 5 | 83.3% |
| `ssh` | 5 | 3 | 60.0% |
| `system` | 4 | 4 | 100.0% |
| `terminal` | 1 | 1 | 100.0% |

---

## 10. Failure Examples

The following list details notable retrieval failures categorized by error type:

| ID | Query | Expected Gold | Actual Retrieved | Score | Confidence | Error Category |
|---|---|---|---|---:|---:|---|
| `TA-B031` | "create a new folder" | `New-Item -ItemType Directory -Path 'path/to/directory' -Force` | `npm init -y` | 7.2974 | 91% | `overconfident_wrong` |
| `TA-B037` | "look up what python libraries I have" | `pip list` | `Resolve-DnsName example.com -Type ALL` | 10.8755 | 100% | `overconfident_wrong` |
| `TA-B045` | "see the differences before staging my changes" | `git diff` | `Compare-Object (Get-Content 'file1.txt') (Get-Content 'file2.txt')` | 5.4377 | 68% | `semantic_mismatch` |
| `TA-B051` | "I want to go back one version in my repo but not lose anything" | `git reset --soft HEAD~1` | `git remote add origin https://github.com/user/repo.git` | 7.1978 | 90% | `low_overlap_failure` |
| `TA-B052` | "how much storage is left on my drives" | `Get-PSDrive -PSProvider FileSystem` | `docker rmi image-name` | 4.9069 | 61% | `low_overlap_failure` |
| `TA-B053` | "what services are accepting connections right now" | `Get-NetTCPConnection -State Listen` | `Get-NetTCPConnection` | 6.4952 | 81% | `low_overlap_failure` |
| `TA-B054` | "grab the newest version of a github project" | `git clone https://github.com/user/repo.git` | `pip install package-name==1.2.3` | 5.5525 | 69% | `low_overlap_failure` |
| `TA-B056` | "who am I logged in as" | `$env:USERNAME` | `npm install --save-dev package-name` | 4.692 | 59% | `low_overlap_failure` |
| `TA-B057` | "is my server reachable from here" | `Test-Connection -ComputerName google.com -Count 4` | `ssh user@hostname` | 4.9841 | 62% | `low_overlap_failure` |
| `TA-B059` | "get a quick summary of processor specs" | `Get-CimInstance Win32_Processor` | `curl -s https://api.example.com/data` | 5.702 | 71% | `low_overlap_failure` |
| `TA-B060` | "where is python installed on this machine" | `Get-Command python3 | Select-Object -ExpandProperty Source` | `pip list` | 9.4665 | 100% | `low_overlap_failure` |
| `TA-B062` | "am I running the latest packages" | `npm outdated` | `winget upgrade --all` | 8.5326 | 100% | `low_overlap_failure` |
| `TA-B065` | "get the hash fingerprint of this file" | `Get-FileHash 'filename.txt' -Algorithm SHA256` | `Get-FileHash 'filename.txt' -Algorithm MD5` | 6.8938 | 86% | `low_overlap_failure` |
| `TA-B069` | "stop the docker service" | `docker compose down` | `Stop-Service -Name 'service-name'` | 12.1439 | 100% | `overconfident_wrong` |
| `TA-B071` | "find text in files" | `Get-ChildItem -Recurse -File | Select-String -Pattern 'search_string'` | `Get-ChildItem -Recurse -File | ForEach-Object { (Get-Content $_.FullName) -replace 'old_text','new_text' | Set-Content $_.FullName }` | 11.4575 | 100% | `overconfident_wrong` |

---

*Baseline experiment execution complete. Empirical observations documented.*
