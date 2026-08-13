# TermAssist Baseline Annotation Summary

> **Experiment**: Baseline probe annotation for the frozen TermAssist search implementation  
> **Tag**: `v1.0-research-baseline` | **Branch**: `research/baseline`  
> **Date**: 2026-08-13  
> **Probe commit**: `a74aec3`  
> **Platform**: win32 (x64) | **Corpus**: 431 commands (279 after OS filtering)

---

## 1. Aggregate Results

| Metric | Count | Percentage |
|--------|------:|------------|
| **Total queries** | 18 | 100% |
| **CORRECT** | 11 | 61.1% |
| **INCORRECT** | 3 | 16.7% |
| **AMBIGUOUS** | 2 | 11.1% |
| **UNSUPPORTED/OOD** | 2 | 11.1% |

### Accuracy (non-ambiguous, supported queries only)

Excluding AMBIGUOUS (2) and UNSUPPORTED/OOD (2), there are **14 evaluable queries**.

| Metric | Value |
|--------|-------|
| **Correct** | 11 / 14 |
| **Accuracy** | **78.6%** |
| **Incorrect** | 3 / 14 (21.4%) |

---

## 2. Confidence Calibration Assessment

| Assessment | Count | Probe IDs |
|------------|------:|-----------|
| **WELL_CALIBRATED_FOR_THIS_CASE** | 11 | P001, P002, P003, P004, P005, P006, P008, P011, P016, P017, P018 |
| **OVERCONFIDENT** | 6 | P009, P010, P012, P013, P014, P015 |
| **UNDERCONFIDENT** | 1 | P007 |

**6 out of 18 queries (33.3%) received overconfident confidence scores.** This is a strong signal that the current confidence formula `min(round(score/8 * 100), 100)` does not reliably reflect correctness.

### Overconfident Errors (confidence >= 30% but INCORRECT or OOD)

| ID | Query | Confidence | Correctness | Problem |
|----|-------|--------:|-------------|---------|
| **P009** | deploy my kubernetes cluster to production... | **100%** | INCORRECT | Returned read-only diagnostic command instead of deployment |
| **P010** | make a cappuccino | **53%** | UNSUPPORTED/OOD | False acceptance - nonsense query not rejected |
| **P012** | delete everything | **56%** | INCORRECT | HTTP DELETE matched instead of filesystem deletion |
| **P013** | remove all files | **76%** | INCORRECT | Docker image prune matched instead of file removal |
| **P014** | ssh | **100%** | AMBIGUOUS | Single keyword, multiple valid interpretations |
| **P015** | git | **100%** | AMBIGUOUS | Single keyword, 43 possible commands, arbitrary pick |

---

## 3. Error Classification

| Failure Type | Count | Probe IDs |
|--------------|------:|-----------|
| **semantic_mismatch** | 1 | P009 |
| **lexical_mismatch** | 2 | P012, P013 |

All 3 INCORRECT results fall into just two failure categories. Both involve the fundamental limitation that BM25 treats words as interchangeable regardless of their semantic context.

---

## 4. Full Annotation Table

| ID | Query | Prediction | Conf | Correct? | Failure Type | Conf Assessment |
|----|-------|------------|-----:|----------|--------------|-----------------|
| P001 | undo last git commit but keep changes | `git reset --soft HEAD~1` | 100% | CORRECT | - | WELL_CALIBRATED |
| P002 | list all running docker containers | `docker ps` | 100% | CORRECT | - | WELL_CALIBRATED |
| P003 | revert my last commit without losing work | `git reset --soft HEAD~1` | 94% | CORRECT | - | WELL_CALIBRATED |
| P004 | show me all docker containers that are currently active | `docker ps` | 100% | CORRECT | - | WELL_CALIBRATED |
| P005 | I need to find all the python files... can you help? | `Get-ChildItem ... '*.py' ...` | 100% | CORRECT | - | WELL_CALIBRATED |
| P006 | how do I see which ports are open on my machine | `Get-NetTCPConnection -State Listen` | 90% | CORRECT | - | WELL_CALIBRATED |
| P007 | compress folder | `Compress-Archive ...` | 68% | CORRECT | - | UNDERCONFIDENT |
| P008 | disk space | `Get-PSDrive -PSProvider FileSystem` | 100% | CORRECT | - | WELL_CALIBRATED |
| P009 | deploy my kubernetes cluster to production... | `kubectl get events ...` | 100% | INCORRECT | semantic_mismatch | **OVERCONFIDENT** |
| P010 | make a cappuccino | `Set-ExecutionPolicy ...` | 53% | OOD | - | **OVERCONFIDENT** |
| P011 | what is the meaning of life | `git reset --soft HEAD~1` | 0% | OOD | - | WELL_CALIBRATED |
| P012 | delete everything | `curl -X DELETE ...` | 56% | INCORRECT | lexical_mismatch | **OVERCONFIDENT** |
| P013 | remove all files | `docker image prune -a` | 76% | INCORRECT | lexical_mismatch | **OVERCONFIDENT** |
| P014 | ssh | `ssh user@hostname` | 100% | AMBIGUOUS | - | **OVERCONFIDENT** |
| P015 | git | `git config --list` | 100% | AMBIGUOUS | - | **OVERCONFIDENT** |
| P016 | convert video to mp4 format | `ffmpeg -i ... output.mp4` | 100% | CORRECT | - | WELL_CALIBRATED |
| P017 | check network connectivity to google.com | `Test-Connection ... google.com` | 100% | CORRECT | - | WELL_CALIBRATED |
| P018 | install npm packages from package.json | `npm install` | 100% | CORRECT | - | WELL_CALIBRATED |

---

## 5. Key Research Observations

### Observation 1: Confidence saturation makes the score unreliable

The formula `min(round(score/8 * 100), 100)` saturates at 100% for any raw score >= 8.0. Of the 18 queries, **12 received exactly 100% confidence** but only 10 of those were CORRECT. The confidence score effectively only has two meaningful values: 0% (rejected) and ~100% (accepted), with a narrow band in between. It provides almost no discrimination between high-quality and low-quality matches.

### Observation 2: The substring bonus dominates scoring

The +15.0 substring bonus (search.js line 110) accounts for a large fraction of total scores. Exact matches score 33-43 (with bonus) vs paraphrases at 7-8 (without). This creates a bimodal score distribution: queries that trigger the bonus cluster above 15, those that don't cluster below 8. P008 ("disk space") scored 27.6 despite being 2 tokens because the substring bonus triggered, while P007 ("compress folder") scored only 5.4 because it didn't.

### Observation 3: OOD rejection is vocabulary-dependent, not principled

P011 ("what is the meaning of life") was correctly rejected because its content tokens have zero corpus IDF. P010 ("make a cappuccino") was NOT rejected because "make" appears in "make a file executable". OOD rejection is accidental -- it depends on whether the query happens to share any tokens with the corpus. There is no explicit OOD detection mechanism.

### Observation 4: Lexical polysemy causes cross-domain confusion

P012 ("delete everything") matched an HTTP DELETE curl command instead of a filesystem deletion. P013 ("remove all files") matched Docker image cleanup instead of file removal. In both cases, the word used in the query ("delete", "remove") has different meanings in different command domains, but BM25 cannot distinguish them. The corpus inconsistently uses "delete" for HTTP/git operations and "remove" for filesystem operations, amplifying this problem.

### Observation 5: Single-keyword queries receive unjustified maximum confidence

Both P014 ("ssh") and P015 ("git") received 100% confidence despite being inherently ambiguous queries. The substring bonus triggers because the keyword appears as a substring of many intents, producing high scores. A well-calibrated system should express uncertainty when a query maps to an entire category rather than a specific operation.

### Observation 6: BM25 works surprisingly well for well-phrased queries

When the user's vocabulary aligns with the corpus (P001-P008, P016-P018), the system performs reliably. Exact matches are perfect. Paraphrases are largely successful. Verbose natural language is handled gracefully by stopword filtering. The system's failures are concentrated in edge cases (OOD, ambiguous, cross-domain polysemy), not in mainstream usage.

### Observation 7: The production threshold (confidence >= 30) is too permissive

Only 1 out of 18 queries was rejected (P011, at 0%). The OOD query P010 ("make a cappuccino") at 53% confidence sailed past the threshold. All 3 INCORRECT results (P009, P012, P013) were presented to the user with confidence >= 56%. The threshold exists but provides almost no safety net.

### Observation 8: Paraphrasing causes an ~82% raw score drop but still works

P003 (paraphrase) scored 7.53 vs P001 (exact match) at 42.67 -- an 82% score reduction. Yet the result was still correct. This large gap matters if future work introduces ranking among multiple candidates, but for single-result retrieval it is invisible because the confidence formula saturates both to high values.

---

## 6. Implications for Benchmark Design

The 18-query pilot reveals **systematic failure patterns** that justify building the larger benchmark. Specifically:

1. **The overconfidence problem is real and quantifiable.** 6/18 (33%) of queries received overconfident scores. A larger benchmark will determine whether this rate holds.

2. **Error types are concentrated.** All errors fall into semantic mismatch or lexical mismatch. The 150-query benchmark should systematically include more cases from each failure mode.

3. **OOD detection is a clear gap.** The benchmark should include a substantial OOD section to measure false acceptance rate.

4. **Ambiguity handling is a distinct failure mode.** The benchmark should distinguish between single-keyword, multi-interpretation, and underspecified queries.

5. **The annotation methodology is validated.** The CORRECT/INCORRECT/AMBIGUOUS/OOD framework captures the relevant distinctions cleanly. No additional labels were needed for the pilot.

---

## 7. Research Integrity Statement

- The production TermAssist search implementation was NOT modified for this experiment.
- All annotations reflect human judgment of functional correctness, not string similarity.
- The probe results file (`baseline-probe.json`) was generated by `probe_baseline.js` and was not manually edited.
- This summary is based on 18 queries only -- insufficient for statistical calibration conclusions (e.g., ECE, Brier score). The observations are qualitative.
- All source files are committed at `a74aec3` on branch `research/baseline`.
