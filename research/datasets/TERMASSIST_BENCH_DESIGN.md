# TermAssist-Bench v0.1 — Benchmark Design Document

> **Status**: Draft — pending human review  
> **Date**: 2026-08-13  
> **Branch**: `research/baseline`  
> **Baseline tag**: `v1.0-research-baseline`  
> **Corpus**: 431 total commands, 279 after win32 OS filtering, 26 categories

---

## 1. Research Purpose

TermAssist-Bench v0.1 is an internal research pilot benchmark designed to **systematically measure** the failure modes discovered in the 18-query exploratory probe of the frozen TermAssist baseline.

This is NOT a general-purpose benchmark, nor is it a claim of novelty. It is an evaluation set constructed to answer:

> "How does the existing TermAssist BM25+substring search behave across a structured range of query types, difficulty levels, and failure scenarios?"

Specifically, the benchmark is designed to produce enough data to:

1. Measure retrieval accuracy across distinct query types
2. Quantify the overconfidence rate per category
3. Measure OOD false acceptance rate
4. Identify the most common failure modes and their relative frequency
5. Provide the statistical basis for future calibration analysis (not performed in this phase)

---

## 2. Query Categories

The benchmark contains **9 query types**, each targeting a specific behavior of the search system:

| Code | Query Type | Target Behavior | Count |
|------|-----------|-----------------|------:|
| `canonical` | Direct / verbatim intent queries | Baseline accuracy on well-formed inputs | 25 |
| `paraphrase` | Natural paraphrases with moderate word overlap | Sensitivity to vocabulary variation | 25 |
| `low_overlap_paraphrase` | Paraphrases with substantially different vocabulary | Limits of BM25 lexical matching | 15 |
| `ambiguous` | Queries with multiple valid command interpretations | Ambiguity handling and confidence behavior | 12 |
| `ood` | Out-of-domain queries with no valid corpus match | OOD rejection capability | 15 |
| `polysemy` | Queries using words that appear in multiple unrelated corpus entries | Cross-domain lexical confusion | 18 |
| `single_keyword` | Single-word or two-word underspecified queries | Behavior under minimal information | 10 |
| `safety_sensitive` | Queries requesting destructive or privileged operations | Risk-appropriate confidence behavior | 15 |
| `complex_multi_intent` | Long queries with multiple constraints or sub-tasks | Handling of compositional requests | 15 |
| | **TOTAL** | | **150** |

### Justification for counts

- **canonical (25)**: 279 unique intents in the win32 corpus. 25 queries covers ~9% of intents, sampling across all 26 categories. This is the positive-control group.
- **paraphrase (25)**: Equal to canonical. Each paraphrase is derived from a real corpus intent. Tests the primary use case.
- **low_overlap_paraphrase (15)**: Fewer, because creating valid low-overlap paraphrases that unambiguously map to a single command is difficult. Quality over quantity.
- **ambiguous (12)**: Ambiguity is relatively rare in terminal commands. 12 is sufficient to identify patterns.
- **ood (15)**: Must be large enough to compute a meaningful false acceptance rate. 15 provides ±13% margin at 95% CI for a binary accept/reject outcome.
- **polysemy (18)**: The pilot identified this as the most interesting failure mode. 18 covers the key polysemous words (delete, remove, kill, run, open, change, list, make, start, stop, check, create, set, show).
- **single_keyword (10)**: Limited by the number of meaningful category keywords. 10 covers the major categories.
- **safety_sensitive (15)**: Important for evaluating whether the system handles dangerous commands appropriately.
- **complex_multi_intent (15)**: Tests the limits of the system on realistic, compound user requests.

---

## 3. Inclusion Criteria

A query is included in the benchmark if:

1. **For supported queries**: The gold command exists in `commands.json` (post-OS-filtering for win32).
2. **For OOD queries**: The task is verifiably NOT represented by any command in the corpus. Verified by searching all intents and descriptions for relevant keywords.
3. **For paraphrases**: The paraphrase expresses exactly the same underlying task as the source intent, without adding or removing constraints.
4. The query is syntactically well-formed English.
5. The query is self-contained (no implicit context from a previous conversation turn).

---

## 4. Exclusion Criteria

A query is excluded if:

1. It depends on session context, follow-up turns, or implicit state.
2. The gold command is ambiguous between multiple corpus entries and the query does not resolve the ambiguity.
3. It references a tool, service, or platform not present in the corpus (unless intentionally OOD).
4. The paraphrase introduces or removes a constraint from the source intent.
5. It duplicates or near-duplicates another benchmark query.

---

## 5. Ground-Truth Definition

- **gold_intent**: The verbatim intent string from `commands.json` that the query is derived from (null for OOD).
- **gold_command**: The exact command string from the corpus entry (null for OOD).
- **acceptable_commands**: Additional commands from the corpus that would also satisfy the query. Only populated when verified. Empty by default.
- **source_intent_id**: Index of the source intent in the OS-filtered corpus (null for OOD).

Ground truth is defined by the **corpus content**, not by external command knowledge.

If a query asks "list files" and the corpus has `ls -la` for that, the gold command is `ls -la` even if `dir` would also work on some systems. We evaluate the system's ability to retrieve what it has, not what theoretically exists.

---

## 6. Correctness Definition

A retrieval is **CORRECT** if the returned command accomplishes the task expressed by the natural-language query.

Correctness is judged by **functional equivalence**, not string similarity:
- The returned command must perform the same operation.
- It must operate on the same type of object (files, processes, network, etc.).
- It must not have dangerous side effects beyond what the query requests.

A retrieval is **INCORRECT** if:
- The returned command performs a different operation.
- It operates on a different domain (e.g., HTTP DELETE vs filesystem delete).
- It has unintended destructive effects.

---

## 7. Ambiguity Definition

A query is **AMBIGUOUS** if:
- Two or more commands in the corpus could reasonably satisfy the request.
- The query does not provide enough information to disambiguate.
- A reasonable user could intend any of the interpretations.

For ambiguous queries:
- `ambiguity` is set to `true`.
- `acceptable_commands` lists all valid interpretations.
- `gold_command` is set to the most canonical interpretation (if one exists) or null.
- Correctness evaluation for ambiguous queries accepts any of the listed alternatives.

---

## 8. OOD / Unsupported Definition

A query is **OOD (Out-of-Distribution)** if:
- The task it describes has no corresponding command in `commands.json`.
- The system should ideally reject it (return no confident match).

For OOD queries:
- `requires_rejection` is set to `true`.
- `gold_command` is `null`.
- `gold_intent` is `null`.
- `known_task` is `false`.
- A retrieval is scored as a **false acceptance** if the system returns any result with confidence >= 30 (production threshold).

OOD categories include:
- Completely nonsensical requests (e.g., "make a cappuccino")
- Real computing tasks not in the corpus (e.g., "compile a Rust project")
- Non-terminal tasks (e.g., "design a logo")
- Valid terminal tasks outside the corpus coverage (e.g., "set up a PostgreSQL database")

---

## 9. Difficulty Definition

Difficulty is assigned based on **lexical overlap** between the query and the corpus intent, using explicit rules:

| Level | Definition | Criteria |
|-------|-----------|----------|
| `easy` | High lexical overlap with corpus intent | Query shares ≥80% of content tokens with the source intent, or is a verbatim copy |
| `medium` | Moderate paraphrasing | Query shares 40–79% of content tokens, uses common synonyms, or adds conversational framing |
| `hard` | Low lexical overlap or compositional | Query shares <40% of content tokens, uses substantially different vocabulary, or combines multiple concepts |
| `adversarial` | Deliberately misleading or edge-case | Query is designed to expose a known failure mode (polysemy, OOD false acceptance, etc.) |

For OOD queries, difficulty refers to how likely the system is to false-accept:
- `easy`: Obviously non-technical, should be trivially rejected
- `hard`: Plausible terminal-adjacent request, difficult to reject

---

## 10. Risk Definition

Risk levels are evaluation labels describing the **potential consequences** of executing the predicted command if the retrieval is wrong:

| Level | Definition | Examples |
|-------|-----------|----------|
| `low` | Information-only commands; no state change | `ls`, `pwd`, `git status`, `docker ps` |
| `medium` | Reversible state changes or limited scope | `git checkout`, `npm install`, `mkdir` |
| `high` | Difficult-to-reverse changes | `rm`, `git reset --hard`, `chmod 777`, `docker rm` |
| `critical` | Potentially catastrophic or system-wide | `rm -rf /`, `sudo`, `reboot`, `format`, `mkfs` |

Risk is assigned to the **gold command** (or the most likely matched command for OOD queries), NOT to the query text.

---

## 11. Known vs Unsupported Task Definition

- `known_task: true` — The task described by the query exists in the TermAssist corpus. The system should return a relevant command.
- `known_task: false` — The task does NOT exist in the corpus. The system should ideally reject the query.

This is a binary label that separates "the system has an answer" from "the system should not answer."

---

## 12. Annotation Procedure

1. **Generate**: Queries are drafted based on corpus intents and the failure modes from the pilot.
2. **Review**: Each query is verified against the corpus to confirm the gold_command exists and is correct.
3. **Label**: Difficulty, risk, ambiguity, and query_type are assigned using the criteria above.
4. **Mark status**: Queries that have not been fully human-reviewed are marked `annotation_status: "needs_review"`. Queries that have been verified are marked `annotation_status: "verified"`.
5. **Iterate**: After the first experiment run, annotations may be updated based on observed results.

---

## 13. Quality-Control Procedure

1. **Duplicate check**: No two queries should have identical or near-identical text.
2. **Source-intent distribution**: No single corpus intent should appear as the source for more than 3 benchmark queries (to avoid over-testing one command).
3. **Category coverage**: Every corpus category with ≥4 commands should have at least 1 canonical query in the benchmark.
4. **OOD verification**: Every OOD query must be checked against the full corpus to confirm no matching intent exists.
5. **Paraphrase verification**: Every paraphrase must be checked to confirm it expresses the same task as the source intent.
6. **Risk verification**: Every safety-sensitive query must have its risk level verified against the actual command behavior.
7. **Validation report**: A separate validation document records all quality checks and their results.

---

## 14. How This Differs from the 18-Query Exploratory Probe

| Aspect | 18-Query Probe | 150-Query Benchmark |
|--------|---------------|---------------------|
| **Purpose** | Discover failure modes | Systematically measure failure modes |
| **Size** | 18 queries | 150 queries |
| **Design** | Ad-hoc, exploratory | Structured, category-balanced |
| **Ground truth** | Post-hoc annotation | Pre-defined gold commands |
| **Difficulty** | Not controlled | Explicitly defined and labeled |
| **Coverage** | Sparse | All 26 corpus categories |
| **OOD testing** | 2 queries | 15 queries (enough for rate estimation) |
| **Polysemy testing** | 2 queries | 18 queries (systematic coverage) |
| **Statistical power** | Qualitative only | Sufficient for per-category analysis |
| **Annotation status** | Fully annotated | Marked as needs_review until verified |

---

## 15. How This Supports Future Calibration Analysis

The benchmark is designed so that future analysis can:

1. **Compute accuracy per query type**: The 9 query types enable stratified accuracy reporting.
2. **Measure overconfidence rate**: For each query with a known gold label, we can check whether high-confidence results are correct.
3. **Compute false acceptance rate**: The 15 OOD queries provide a denominator for FAR calculation.
4. **Compute Expected Calibration Error (ECE)**: If confidence bins are defined, the 150 results provide enough data points to estimate ECE (though with limited bin resolution).
5. **Build reliability diagrams**: Confidence vs. accuracy can be plotted with ~15 points per bin if 10 bins are used.
6. **Enable paired comparisons**: If alternative retrieval methods are tested, the same 150 queries serve as a paired test set.

Calibration analysis is NOT performed in this phase. The benchmark provides the data; the analysis comes later.

---

## 16. Benchmark Schema

```json
{
  "id": "TA-B001",
  "query": "natural language query text",
  "gold_intent": "verbatim intent from commands.json or null",
  "gold_command": "exact command from corpus or null",
  "acceptable_commands": ["alternative valid commands from corpus"],
  "category": "corpus category of the gold command",
  "difficulty": "easy|medium|hard|adversarial",
  "query_type": "canonical|paraphrase|low_overlap_paraphrase|ambiguous|ood|polysemy|single_keyword|safety_sensitive|complex_multi_intent",
  "risk_level": "low|medium|high|critical",
  "known_task": true,
  "ambiguity": false,
  "requires_rejection": false,
  "source_intent_id": "index in OS-filtered corpus or null",
  "notes": "optional design rationale",
  "annotation_status": "needs_review|verified"
}
```

---

## 17. Limitations

1. **Platform-specific**: The benchmark evaluates the win32-filtered corpus only. Results may differ on Linux/macOS.
2. **Corpus-dependent**: Ground truth is defined by `commands.json`. If the corpus changes, the benchmark must be re-validated.
3. **Single-annotator draft**: Initial queries are machine-generated and require human review before the benchmark can be considered validated.
4. **Sample size**: 150 queries is sufficient for aggregate metrics but limited for per-category confidence intervals. Per-category analysis (e.g., "accuracy on kubernetes queries") will have wide error bars.
5. **Static evaluation**: The benchmark tests retrieval only, not the full CLI interaction loop (editing, execution, user satisfaction).
