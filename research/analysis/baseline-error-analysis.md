# TermAssist Baseline Error Analysis

**Document Type**: Research Technical Report  
**Benchmark**: TermAssist-Bench v0.1 (Validated)  
**Baseline Git Commit**: `4443ec016c87895ebbc1b9be831e5f80b9bd3b50` (`v1.0-research-baseline`)  
**Evaluation Platform**: `win32` (Windows 10/11 x64, Node.js v24.2.0)  
**Total Queries Evaluated**: 150  
**Overall Accuracy**: 67.3% (101 / 150)  
**Total Retrieval Failures**: 49 (32.7%)  

---

## 1. Executive Summary

This report presents a thorough, empirical error diagnosis of the untouched **TermAssist baseline retrieval engine** (`cli/search.js`), evaluated against the frozen **TermAssist-Bench v0.1 (Validated)** ground truth benchmark.

The goal of this analysis is not to modify the system or implement fixes, but to isolate the exact mathematical, architectural, and lexical mechanisms causing retrieval failures.

### Key Empirical Findings

1. **Catastrophic Overconfidence**: The mean confidence across all **49 failed queries is 87.7%**. 65.3% (32/49) of all failures returned confidence $\ge 80\%$, and **53.1% (26/49) produced 100% confidence**.
2. **OOD Rejection Breakdown**: 73.3% (11/15) of Out-Of-Domain (OOD) queries were falsely accepted with an average confidence of **71.2%**, because casual words like *"cappuccino"*, *"email"*, *"music"*, and *"server"* overlap with corpus intent tokens.
3. **Exact-Intent Bonus Distortion**: The hardcoded $+15.0$ substring bonus fires indiscriminately on single-keyword inputs (`git`, `docker`, `ssh`, `files`, `curl`), inflating confidence to 100% across multiple competing commands and resulting in a **0.0% success rate on single-keyword queries**.
4. **Vocabulary Mismatch in Paraphrasing**: Paraphrase queries with high lexical overlap achieved **88.0% accuracy** ($14.19$ avg BM25 score), whereas low-overlap paraphrases collapsed to **33.3% accuracy** ($8.26$ avg BM25 score) due to near-zero token overlap ($0.117$ vs $0.517$).
5. **Cross-Domain Polysemy**: Common operational verbs (*"remove"*, *"run"*, *"stop"*, *"install"*, *"check"*) frequently match Windows system services (`Stop-Service`), package managers (`winget`), or multimedia tools (`ffmpeg`) instead of targeted Git, Docker, or shell commands.

---

## 2. Failure Distribution

The 49 baseline failures span four primary dataset partitions:

| Partition | Total In Benchmark | Failures | Error Rate | Primary Failure Types Observed |
| :--- | :---: | :---: | :---: | :--- |
| **Supported In-Domain (Non-Ambiguous)** | 119 | 28 | 23.5% | Low semantic overlap, lexical polysemy, cross-domain drift |
| **Ambiguous Queries** | 14 | 10 | 71.4% | Exact-intent overmatch on single keywords, multi-candidate collision |
| **Out-Of-Domain (OOD)** | 15 | 11 | 73.3% | Spurious BM25 token overlap evading the $< 2.0$ score threshold |
| **Needs Adjudication / Correction** | 2 | 0 | 0.0% | Resolved during validation |
| **TOTAL** | **150** | **49** | **32.7%** | — |

```text
                                Failure Distribution by Query Type
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Single Keyword (10 / 10 failed)      ████████████████████████████████████████ 100.0%           │
  │ Out-Of-Domain (11 / 15 failed)       █████████████████████████████            73.3%            │
  │ Low-Overlap Paraphrase (10 / 15)     ████████████████████                     66.7%            │
  │ Polysemy (8 / 18 failed)             ███████████████                          44.4%            │
  │ Ambiguous Multi-Intent (5 / 12)      ██████████                               41.7%            │
  │ Complex Multi-Intent (2 / 15)        █████                                    13.3%            │
  │ Standard Paraphrase (3 / 25)         ████                                     12.0%            │
  │ Safety-Sensitive (0 / 15 failed)     |                                         0.0%            │
  │ Canonical Intent (0 / 25 failed)     |                                         0.0%            │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Failure Mechanisms

Each of the 49 failures was classified into one primary mechanism under the failure taxonomy:

| Code | Primary Failure Mechanism | Count | % of Failures | Dominant Symptoms |
| :---: | :--- | :---: | :---: | :--- |
| **A** | `EXACT_INTENT_OVERMATCH` | 10 | 20.4% | Single keywords trigger $+15.0$ bonus across dozens of intents; top candidate chosen arbitrarily |
| **B** | `LEXICAL_OVERLAP` | 6 | 12.2% | Superficial token sharing (*"create"*, *"new"*, *"text"*) overrides semantically correct command |
| **C** | `POLYSEMOUS_TERM` | 4 | 8.2% | Verbs like *"remove"*, *"run"*, *"stop"* retrieve Windows Service / winget / ffmpeg utilities |
| **D** | `LOW_SEMANTIC_OVERLAP` | 14 | 28.6% | Natural phrasing shares $< 15\%$ vocabulary with corpus; fallback token noise wins |
| **E** | `QUERY_UNDERSPECIFICATION` | 0 | 0.0% | *(Subsumed by Mechanism A for single keywords where bonus dominates)* |
| **F** | `OOD_VOCABULARY_COLLISION` | 11 | 22.4% | Out-of-domain requests match generic stopword-adjacent tokens, scoring $\ge 2.0$ |
| **G** | `SCORE_SATURATION` | 0 | 0.0% | *(Secondary effect in 32 cases, but not root primary retrieval cause)* |
| **H** | `WRONG_SCOPE` | 1 | 2.0% | Sub-flag/port variation (e.g. port `8080` vs `5432` in SSH tunnel) |
| **I** | `WRONG_ACTION` | 3 | 6.1% | Destructive replace chosen over search (`-replace` instead of `Select-String`) |
| **J** | `OTHER` | 0 | 0.0% | None required |
| — | **TOTAL FAILURES** | **49** | **100.0%** | — |

---

## 4. Confidence Reliability

TermAssist computes synthetic confidence using the formula:
$$\text{Confidence} = \begin{cases} 0\% & \text{if } \text{Score} < 2.0 \\ \min\left(\left\lfloor \frac{\text{Score}}{8.0} \times 100 \right\rceil, 100\%\right) & \text{if } \text{Score} \ge 2.0 \end{cases}$$

### Reliability Table

| Confidence Bucket | Total Predictions | Correct Hits | Empirical Accuracy | Mean Confidence in Bucket |
| :---: | :---: | :---: | :---: | :---: |
| **0–20%** | 4 | 4 | **100.0%** | 0.0% *(Rejection Hits)* |
| **20–40%** | 0 | 0 | **N/A** | N/A |
| **40–60%** | 4 | 1 | **25.0%** | 57.0% |
| **60–80%** | 18 | 4 | **22.2%** | 67.5% |
| **80–90%** | 5 | 1 | **20.0%** | 86.6% |
| **90–100%** | 119 | 91 | **76.5%** | 99.7% |
| **TOTAL** | **150** | **101** | **67.3%** | **91.6%** |

### Confidence Distribution Statistics

- **Incorrect predictions with Confidence $\ge 80\%$**: **32** (65.3% of all errors)
- **Incorrect predictions with Confidence $\ge 90\%$**: **27** (55.1% of all errors)
- **Incorrect predictions with Confidence $= 100\%$**: **26** (53.1% of all errors)
- **Mean Confidence for Correct Predictions**: **93.5%**
- **Mean Confidence for Incorrect Predictions**: **87.7%**
- **Mean Confidence for OOD False Acceptances**: **71.2%**
- **Mean Confidence for Ambiguous Failures**: **100.0%**

```text
                                Confidence Calibration Curve
    100% ┼───────────────────────────────────────────────────────────── [90–100%: 76.5%]
         │                                                                   ▲
     80% ┼                                                                   │
         │                                                                   │
     60% ┼                                                                   │
         │                                                                   │
     40% ┼                                                                   │
         │                         [40–60%: 25.0%]   [60–80%: 22.2%]  [80–90%: 20.0%]
     20% ┼                                ▲                 ▲                ▲
         │                                │                 │                │
      0% ┼── [0–20%: 100%] (Rejections) ──┴─────────────────┴────────────────┴───────────
         └───────┬────────────────────────┬─────────────────┬────────────────┬──────────
               0–20%                    40–60%            60–80%           80–90%      90–100%
```

> **Takeaway**: Because the denominator is fixed at $8.0$, any query scoring $\ge 8.0$ hits **100% confidence**. A single exact token match with high IDF (e.g. `service` $\text{IDF} \approx 3.2$ or `dns` $\text{IDF} \approx 4.1$) easily yields a score of $8.5–12.0$, forcing 100% confidence on completely incorrect commands.

---

## 5. Exact-Intent Bonus Analysis

In `cli/search.js`, an exact-intent heuristic awards a massive $+15.0$ flat bonus:
```javascript
const exactIntent = commands[index].intent.toLowerCase().replace(/[^a-z0-9]/g, '');
const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
if (exactIntent.includes(cleanQuery) || cleanQuery.includes(exactIntent)) {
    score += 15.0;
}
```

### Empirical Bonus Impact

| Metric | With Bonus (+15.0) | Without Bonus | Delta |
| :--- | :---: | :---: | :---: |
| **Total Query Volume** | 47 | 103 | — |
| **Correct Hits** | 37 | 64 | — |
| **Failed Retrievals** | 10 | 39 | — |
| **Empirical Accuracy** | **78.7%** | **62.1%** | +16.6% |
| **Failure Cases Induced by Bonus** | **10** (All single-keyword) | 0 | — |

### Key Observations:
1. **The Double-Edged Sword**: On verbatim canonical queries (e.g. *"undo last git commit but keep changes"*), the bonus provides an unshakeable ranking signal, yielding 100% precision across all 25 canonical benchmarks.
2. **Catastrophic Failure on Short Strings**: Because the rule uses `exactIntent.includes(cleanQuery)`, any short input like `"git"` or `"docker"` evaluates to `true` for **every single Git and Docker command** in the corpus.
3. **Arbitrary Top-1 Selection**: When 30+ commands all receive $+15.0$, the tie-breaker falls back to minor BM25 length normalization differences, picking obscure commands like `git config --list` for `"git"` and `docker pull ubuntu:22.04` for `"docker"`.

---

## 6. OOD False Acceptance Analysis

15 Out-Of-Domain queries were tested to measure whether TermAssist knows what it does *not* know.

- **Correctly Rejected ($Score < 2.0 \rightarrow 0\%$ Conf)**: **4** (26.7%)
- **Falsely Accepted ($Score \ge 2.0 \rightarrow 53–99\%$ Conf)**: **11** (73.3%)
- **Most Common False Acceptance Mechanism**: `OOD_VOCABULARY_COLLISION`

### OOD Audit Table

| ID | OOD Query | Returned Command | Raw Score | Confidence | Matched Corpus Tokens | Why Rejection Failed |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| `TA-B077` | *"book a flight to San Francisco"* | *(None)* | 0.00 | 0% | None | ✅ Correctly rejected (0 tokens matched) |
| `TA-B078` | *"make a cappuccino"* | `Set-ExecutionPolicy ...` | 4.24 | 53% | `make` $\rightarrow$ `bypass` intent | Spurious token `make` scored $4.24 > 2.0$ |
| `TA-B079` | *"order a pepperoni pizza"* | *(None)* | 0.00 | 0% | None | ✅ Correctly rejected (0 tokens matched) |
| `TA-B080` | *"what is the capital of France"* | *(None)* | 0.00 | 0% | None | ✅ Correctly rejected (0 tokens matched) |
| `TA-B081` | *"translate hello to Spanish"* | *(None)* | 0.00 | 0% | None | ✅ Correctly rejected (0 tokens matched) |
| `TA-B082` | *"write a haiku about computers"* | `Set-ExecutionPolicy ...` | 4.24 | 53% | `about` $\rightarrow$ general desc | Low-IDF token collision |
| `TA-B083` | *"compile a Rust project with cargo"* | `npm init -y` | 5.10 | 64% | `project` in description | `project` token in npm init intent |
| `TA-B084` | *"connect to a PostgreSQL database"* | `tmux attach ...` | 4.94 | 62% | `connect` $\rightarrow$ network/attach | `connect` matched tmux description |
| `TA-B085` | *"create a new React app"* | `npm init -y` | 7.30 | 91% | `create`, `new`, `app` | Denser overlap with npm/react words |
| `TA-B086` | *"edit my crontab using vim"* | `crontab -e` | 5.32 | 66% | `crontab`, `edit` | Unix crontab command present in OS index |
| `TA-B087` | *"set up a Python Flask web server"* | `Resolve-DnsName ...` | 5.44 | 68% | `set`, `up`, `server` | Multi-token overlap with network tools |
| `TA-B088` | *"write a unit test in jest"* | `command 2>'error.txt'` | 4.94 | 62% | `test`, `write` | `test` matched PowerShell syntax |
| `TA-B089` | *"play music from the command line"* | `!keyword` | 5.83 | 73% | `command`, `line` | Shell history keyword description match |
| `TA-B090` | *"scan my network for other devices"*| `clamscan -r ...` | 6.84 | 86% | `scan`, `network` | Antivirus scanner intent match |
| `TA-B091` | *"configure nginx reverse proxy"* | `Set-Service ...` | 5.24 | 65% | `configure`, `proxy` | Service configuration match |
| `TA-B092` | *"send an email from the terminal"* | `Clear-Host` | 7.88 | 99% | `terminal`, `send` | Terminal clear intent description match |

---

## 7. Ambiguity Analysis

The 14 benchmark queries marked `AMBIGUOUS` (including 10 single-keyword and 4 underspecified queries) were evaluated to determine whether the search engine displays any internal evidence of ambiguity:

- **Acceptable Result Returned**: **4 / 14** (28.6%)
- **Unacceptable / Arbitrary Result**: **10 / 14** (71.4%)
- **System Rejection**: **0 / 14** (0.0%)
- **Average Confidence**: **100.0%** (13 of 14 queries scored 100%)

### Empirical Evidence of Ambiguity

In all 10 single-keyword failures, the score gap between Candidate #1 and Candidate #2 is near zero ($\Delta \le 0.3$):

```text
Query: "docker"
  ├── Rank 1: docker pull ubuntu:22.04       (Score: 19.22, Bonus: True)
  ├── Rank 2: docker rmi image-name          (Score: 18.91, Bonus: True)  [Δ = 0.31]
  ├── Rank 3: docker stop $(docker ps -q)    (Score: 18.83, Bonus: True)  [Δ = 0.08]
  ├── Rank 4: docker image prune -a          (Score: 18.83, Bonus: True)  [Δ = 0.00]
  └── Rank 5: docker images                  (Score: 18.83, Bonus: True)  [Δ = 0.00]

Query: "ssh"
  ├── Rank 1: ssh user@hostname              (Score: 20.50, Bonus: True)
  ├── Rank 2: ssh-keygen -t ed25519 ...      (Score: 20.50, Bonus: True)  [Δ = 0.00]
  ├── Rank 3: ssh -R 9090:localhost:3000 ... (Score: 20.39, Bonus: True)  [Δ = 0.11]
  ├── Rank 4: ssh-copy-id user@hostname      (Score: 20.19, Bonus: True)  [Δ = 0.20]
  └── Rank 5: ssh -L 8080:localhost:80 ...   (Score: 20.10, Bonus: True)  [Δ = 0.09]
```

> **Diagnostic Finding**: The underlying BM25 engine **possesses clear structural evidence of ambiguity** (a flat score distribution across top-5 candidates), but because `search()` only returns `bestMatch` and ignores candidate score entropy, the system outputs the top candidate with **100% confidence**.

---

## 8. Low-Overlap Paraphrase Analysis

To determine why TermAssist handles standard paraphrases well but fails on low-overlap phrasing, we compared the 25 `paraphrase` queries against the 15 `low_overlap_paraphrase` queries:

| Feature / Metric | Standard Paraphrase ($N=25$) | Low-Overlap Paraphrase ($N=15$) | Mathematical Divergence |
| :--- | :---: | :---: | :--- |
| **Retrieval Accuracy** | **88.0%** (22/25) | **33.3%** (5/15) | **-54.7% drop** |
| **Mean Query Length (Tokens)** | 5.40 | 5.93 | $+9.8\%$ |
| **Gold Token Overlap Ratio** | **0.517** (51.7%) | **0.117** (11.7%) | **4.4x lower overlap** |
| **Query IDF Overlap Ratio** | **0.720** (72.0%) | **0.576** (57.6%) | **-14.4% key term capture** |
| **Mean BM25 Score** | **14.19** | **8.26** | **-41.8% signal power** |
| **Top-1 to Top-2 Score Margin** | **5.24** | **1.76** | **3.0x narrower margin** |
| **Exact Bonus Trigger Rate** | 0.0% | 0.0% | Identical (0%) |

### Root Failure Mechanism

In low-overlap queries, users express technical concepts using colloquial terminology absent from standard man-page descriptions:
- *"storage is left on my drives"* vs `Get-PSDrive -PSProvider FileSystem` (Matched: `docker rmi` via token *"storage"*)
- *"grab newest version of a github project"* vs `git clone` (Matched: `pip install` via token *"version"*)
- *"who am I logged in as"* vs `$env:USERNAME` (Matched: `npm install` via token *"who"*)
- *"where is python installed on this machine"* vs `Get-Command python3` (Matched: `pip list` via token *"python"*)

Because BM25 relies strictly on exact lexical token matching, when the vocabulary overlap drops below $\sim 25\%$, spurious tokens dominate the summation, producing incorrect top rankings.

---

## 9. Representative Failure Deep Dives

### Case 1: Polysemy & Stopword Noise (`TA-B031`)
- **Query**: `"create a new folder"`
- **Expected**: `New-Item -ItemType Directory -Path 'path/to/directory' -Force`
- **Actual Retrieved**: `npm init -y` (Confidence: 91%, Score: 7.30)
- **Top-5 Candidates**:
  1. `npm init -y` (Score: 7.30)
  2. `tmux new -s session-name` (Score: 7.06)
  3. `python -m venv venv` (Score: 6.99)
  4. `New-Item -ItemType Directory ...` (Score: 6.99)
  5. `git checkout -b branch-name` (Score: 6.78)
- **Primary Mechanism**: `LEXICAL_OVERLAP`
- **Explanation**: The intent contains `"create"` and `"new"`. `npm init` matched both tokens with short document length, outscoring the gold directory creation command by $0.31$ points.

---

### Case 2: Out-Of-Domain Hallucination (`TA-B078`)
- **Query**: `"make a cappuccino"`
- **Expected**: `(Rejection / Empty)`
- **Actual Retrieved**: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` (Confidence: 53%, Score: 4.24)
- **Top-5 Candidates**:
  1. `Set-ExecutionPolicy ...` (Score: 4.24)
  2. `curl -s https://api.example.com/data` (Score: 4.07)
  3. `curl -X PUT ...` (Score: 3.91)
  4. `curl -X DELETE ...` (Score: 3.91)
  5. `icacls 'filename.txt' ...` (Score: 3.77)
- **Primary Mechanism**: `OOD_VOCABULARY_COLLISION`
- **Explanation**: The verb `"make"` matched description tokens in the ExecutionPolicy command. With score $4.24 > 2.0$, confidence reached 53%, evading rejection.

---

### Case 3: Polysemy Across Windows Services (`TA-B069`)
- **Query**: `"stop the docker service"`
- **Expected**: `docker compose down` (or `docker stop`)
- **Actual Retrieved**: `Stop-Service -Name 'service-name'` (Confidence: 100%, Score: 12.14)
- **Top-5 Candidates**:
  1. `Stop-Service -Name 'service-name'` (Score: 12.14)
  2. `docker stop $(docker ps -q)` (Score: 9.86)
  3. `docker compose down` (Score: 9.63)
  4. `Start-Service ...` (Score: 5.77)
  5. `Restart-Service ...` (Score: 5.77)
- **Primary Mechanism**: `POLYSEMOUS_TERM`
- **Explanation**: The high-IDF token `"service"` weighted the generic Windows service management command above Docker container teardown.

---

### Case 4: Destructive Action Mismatch (`TA-B071`)
- **Query**: `"find text in files"`
- **Expected**: `Get-ChildItem -Recurse -File | Select-String -Pattern 'search_string'`
- **Actual Retrieved**: `Get-ChildItem -Recurse -File | ForEach-Object { (Get-Content ...) -replace ... }` (Confidence: 100%, Score: 11.46)
- **Top-5 Candidates**:
  1. `Get-ChildItem ... -replace 'old_text','new_text'` (Score: 11.46)
  2. `Get-ChildItem ... -Filter '*.log'` (Score: 8.02)
  3. `Get-ChildItem ... -gt 100MB` (Score: 7.85)
  4. `Get-ChildItem ... -AddDays(-7)` (Score: 7.68)
  5. `Get-ChildItem ... -Filter '*.py'` (Score: 7.52)
- **Primary Mechanism**: `WRONG_ACTION`
- **Explanation**: A search request matched a file text replacement command due to dense term sharing (`find`, `text`, `files`), creating an active safety risk.

---

### Case 5: Single-Keyword Bonus Explosion (`TA-B111`)
- **Query**: `"git"`
- **Expected**: `(Ambiguous / Interactive Disambiguation)`
- **Actual Retrieved**: `git config --list` (Confidence: 100%, Score: 17.99, Bonus: TRUE)
- **Top-5 Candidates**:
  1. `git config --list` (Score: 17.99, Bonus: True)
  2. `git config --global user.name ...` (Score: 17.93, Bonus: True)
  3. `git config --global user.email ...` (Score: 17.93, Bonus: True)
  4. `git clone https://...` (Score: 17.77, Bonus: True)
  5. `git tag -a v1.0.0 ...` (Score: 17.70, Bonus: True)
- **Primary Mechanism**: `EXACT_INTENT_OVERMATCH`
- **Explanation**: The short string `"git"` satisfied `includes()` on every single Git intent, applying $+15.0$ across 35 commands and giving `git config --list` an unearned win.

---

### Case 6: Single-Keyword Collision (`TA-B112`)
- **Query**: `"docker"`
- **Expected**: `(Ambiguous / Interactive Disambiguation)`
- **Actual Retrieved**: `docker pull ubuntu:22.04` (Confidence: 100%, Score: 19.22, Bonus: TRUE)
- **Top-5 Candidates**:
  1. `docker pull ubuntu:22.04` (Score: 19.22, Bonus: True)
  2. `docker rmi image-name` (Score: 18.91, Bonus: True)
  3. `docker stop $(docker ps -q)` (Score: 18.83, Bonus: True)
  4. `docker image prune -a` (Score: 18.83, Bonus: True)
  5. `docker images` (Score: 18.83, Bonus: True)
- **Primary Mechanism**: `EXACT_INTENT_OVERMATCH`
- **Explanation**: Identical $+15.0$ saturation across all Docker commands.

---

### Case 7: Colloquial Semantic Paraphrase (`TA-B051`)
- **Query**: `"I want to go back one version in my repo but not lose anything"`
- **Expected**: `git reset --soft HEAD~1`
- **Actual Retrieved**: `git remote add origin https://github.com/user/repo.git` (Confidence: 90%, Score: 7.20)
- **Top-5 Candidates**:
  1. `git remote add origin ...` (Score: 7.20)
  2. `Get-Content 'file.txt' | Where-Object ...` (Score: 5.88)
  3. `pip install package-name==1.2.3` (Score: 5.55)
  4. `Receive-Job -Id 1 -Wait` (Score: 5.44)
  5. `[System.Environment]::OSVersion` (Score: 5.41)
- **Primary Mechanism**: `LOW_SEMANTIC_OVERLAP`
- **Explanation**: The user words *"version"*, *"repo"*, *"lose"*, *"back"* share 0 tokens with `"undo last git commit but keep changes"`.

---

### Case 8: Package Manager Confusion (`TA-B037`)
- **Query**: `"look up what python libraries I have"`
- **Expected**: `pip list`
- **Actual Retrieved**: `Resolve-DnsName example.com -Type ALL` (Confidence: 100%, Score: 10.88)
- **Top-5 Candidates**:
  1. `Resolve-DnsName example.com -Type ALL` (Score: 10.88)
  2. `python -m venv venv` (Score: 5.31)
  3. `npm outdated` (Score: 5.05)
  4. `Get-ChildItem ... -Filter '*.py'` (Score: 4.81)
  5. `pip install package-name` (Score: 4.24)
- **Primary Mechanism**: `LOW_SEMANTIC_OVERLAP`
- **Explanation**: `"look up"` matched DNS lookup description tokens with extreme IDF, overtaking Python package listing.

---

### Case 9: Verb Polysemy Across Tools (`TA-B094`)
- **Query**: `"remove all files from the current directory"`
- **Expected**: `Remove-Item -Recurse -Force 'directory/'`
- **Actual Retrieved**: `Get-ChildItem -Filter '*.wav' | ForEach-Object { ffmpeg ... }` (Confidence: 100%, Score: 8.80)
- **Top-5 Candidates**:
  1. `ffmpeg ...` (Score: 8.80)
  2. `docker build ...` (Score: 8.46)
  3. `Get-Location` (Score: 7.75)
  4. `Get-ChildItem -Recurse -Filter 'filename.txt'` (Score: 7.73)
  5. `Remove-Item -Recurse -Force ...` (Score: 7.14)
- **Primary Mechanism**: `POLYSEMOUS_TERM`
- **Explanation**: Tokens `"all"`, `"files"`, `"current"`, `"directory"` matched audio batch conversion intents and descriptions, drowning out `Remove-Item`.

---

### Case 10: OOD Command-Line Prompt Hallucination (`TA-B092`)
- **Query**: `"send an email from the terminal"`
- **Expected**: `(Rejection / Empty)`
- **Actual Retrieved**: `Clear-Host` (Confidence: 99%, Score: 7.88)
- **Top-5 Candidates**:
  1. `Clear-Host` (Score: 7.88)
  2. `git config --global user.email 'email@example.com'` (Score: 7.20)
  3. `curl -s https://api.example.com/data` (Score: 3.91)
  4. `screen -r session-name` (Score: 3.81)
  5. `tmux attach -t session-name` (Score: 3.81)
- **Primary Mechanism**: `OOD_VOCABULARY_COLLISION`
- **Explanation**: High-IDF token `"terminal"` in the description of `Clear-Host` scored $7.88$, generating 99% confidence on an irrelevant command.

---

## 10. Root Causes

Ranked by total affected queries, severity, confidence impact, and research significance:

| Rank | Root Cause | Affected Queries | Severity | Confidence Distortion | Research Significance |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | **Lexical Gap & Zero-Semantic Embedding** | 20 queries | High | Moderate (Scores 5.0–9.0) | Fundamental limit of pure TF-IDF/BM25 without dense vector embeddings. |
| **2** | **Score-to-Confidence Linear Saturation** | 32 queries | High | Extreme (Scores $\ge 8.0 \rightarrow 100\%$) | Uncalibrated heuristic mapping destroys downstream confidence reliability. |
| **3** | **Unrestricted Exact-Intent Substring Matching** | 10 queries | High | Extreme (Instant $+15.0$ & 100% Conf) | Flawed substring logic causes total failure on short/single-keyword inputs. |
| **4** | **Static Low Score Rejection Threshold ($< 2.0$)** | 11 queries | Medium | High ($53–99\%$ on OOD) | Static score threshold fails to account for query length and corpus IDF variation. |
| **5** | **Entropy-Blind Top-1 Candidate Selection** | 14 queries | Medium | High (100% on Ambiguous) | System ignores candidate score clustering and flat distribution tails. |

---

## 11. Candidate Research Directions

Comparative analysis of candidate architectural solutions for future research iterations:

| Direction | Expected Accuracy Benefit | Latency Cost | Privacy Impact | Implementation Complexity | Research Novelty | Primary Risks |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **A. Calibrated Confidence & Entropy Gating** | Moderate (+8–12%) | **0.0 ms** | **100% Local** | Low | Moderate | Does not fix lexical gap; only flags uncertainty. |
| **B. Substring Heuristic Length-Normalizing** | Moderate (+6–8%) | **0.0 ms** | **100% Local** | Low | Low | Rule patch; does not generalize to novel query forms. |
| **C. Hybrid Lexical + Local Dense Embeddings** | **High (+15–25%)** | **+2–8 ms** | **100% Local (ONNX/WASM)** | Medium | **High** | Requires embedding model packaging and memory budget (~25–50MB). |
| **D. Query Expansion via Corpus Thesaurus** | Moderate (+5–10%) | **+0.1 ms** | **100% Local** | Medium | Moderate | Manual synonym maintenance or static dictionary drift. |
| **E. LLM Reranking (Cloud API)** | High (+20–30%) | **+500–2,000 ms** | ⚠️ Violates Offline/Privacy | High | Low | Destroys the core premise of TermAssist (< 5ms, 100% offline). |

---

## 12. Research Hypotheses

Based strictly on this empirical diagnosis, we formulate four testable research hypotheses for subsequent investigation:

1. **Hypothesis 1 (Hybrid Semantic-Lexical Superiority)**:
   *Combining BM25 lexical retrieval with a lightweight, local dense vector embedding (e.g. 384-dimensional quantized MiniLM via ONNX) with reciprocal rank fusion (RRF) will increase low-overlap paraphrase accuracy from 33.3% to $\ge 80.0\%$ while maintaining total search latency under 15 milliseconds.*

2. **Hypothesis 2 (Entropy-Based Ambiguity & OOD Detection)**:
   *Measuring the Shannon entropy of normalized candidate scores ($H = -\sum p_i \log p_i$) across top-5 BM25 results will differentiate single-keyword / ambiguous queries ($H > \tau_{\text{ambig}}$) from confident exact matches with an ROC-AUC of $\ge 0.90$, enabling automatic fallback to interactive search.*

3. **Hypothesis 3 (Score Density Normalization for OOD Rejection)**:
   *Replacing the static score threshold ($2.0$) with a query-length-adjusted score density metric ($S_{\text{norm}} = \frac{\text{Score}}{\sum_{t \in Q} \text{IDF}(t)}$) will increase OOD rejection accuracy from 26.7% to $\ge 80.0\%$ without rejecting valid in-domain queries.*

4. **Hypothesis 4 (Intent Match Bounding)**:
   *Restricting the $+15.0$ exact-intent bonus to require complete token set equality ($\text{Tokens}(Q) \equiv \text{Tokens}(\text{Intent})$) rather than substring inclusion will eliminate 100% of single-keyword overmatch failures without degrading canonical query accuracy.*

---

## 13. Audit Verification

- **Production code modified**: **NO**
- **Baseline code modified**: **NO**
- **New model introduced**: **NO**
- **New experiment executed**: **NO**

```text
Audit Artifacts Created:
- research/analysis/baseline-error-analysis.md (This Report)
- research/analysis/baseline-error-analysis.csv (Per-query failure diagnostics)
- research/analysis/confidence-analysis.csv (Reliability table and bucket statistics)
- research/analysis/score-bonus-analysis.csv (Empirical bonus impact measurements)
```
