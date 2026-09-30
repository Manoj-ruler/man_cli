# E1-05: can external queries be scored exactly like the frozen pipeline?

**Checked:** 2026-09-30, by reading code. **No scorer written, nothing scored, no CLINC data read,
no model run.**

- One read-only fact check was run: scratchpad `e1_05_facts.js`. It read only committed files:
  the corpus, the snippet file, the embeddings, the v0.2 cache and the results.
- `check_model_cache.js` was run in verify mode. It does not fetch anything.

**Answer: yes.**

- The three scores E1 needs depend only on:
  - the query text;
  - the platform;
  - four pinned inputs: the corpus, the packaged snippet, the corpus embeddings and the model files.
- **None of them depends on a benchmark-only field.** The one fold-dependent input is α, and it is
  0.5 in every fold.
- Section 5 lists the conditions a new script must meet to reproduce the scores exactly. E1-06 must
  then prove it on the 209 v0.2 queries.

## 1. Data flow, per query

### 1a. The shipped score s (R1, R1-CLI and R2)

All three rules read the output of the shipped `cli/search.js` `search(query)`. The frozen
reproduction imports this file read-only (`reproduce_baseline_v0_2.js:11`, `:40`).

| Step | Code |
|---|---|
| Corpus: `commands.json` filtered by `os.platform()`, plus `custom_snippets.json` | `cli/search.js:16-33` |
| Documents: tokenize(`intent category description`) | `cli/search.js:36-39` |
| Tokenizer: lower-case; delete characters other than `[a-z0-9\s-]`; split on whitespace; drop 16 stop-words | `cli/search.js:9-13` |
| IDF: ln(1 + (N − df + 0.5)/(df + 0.5)); N = the number of records in the platform's index | `cli/search.js:41-55` |
| **Empty-token guard:** if the query has no tokens left, it returns score 0, command null | `cli/search.js:74-76` |
| BM25 (k1 = 1.2, b = 0.75) over the set of distinct query tokens | `cli/search.js:79-104` |
| +15 bonus if the stripped query contains the stripped intent, or the reverse | `cli/search.js:107-111` |
| Top-1 by strict `>` (the first record wins ties; the score is unaffected) | `cli/search.js:113-116` |
| confidence = min(round(100·s/8), 100), set to 0 if s < 2.0 | `cli/search.js:121-126` |
| **s is returned unrounded** | `cli/search.js:132` |

**How each rule uses s:**

| Rule | Decision in the frozen code | For E1 |
|---|---|---|
| **R1** | answered iff `confidence > 0 && score >= 2.0` on the unrounded values (`reproduce_baseline_v0_2.js:44`) | Reject iff unrounded s < 2.0. `review_r1_e…js:27` applies `score >= 2.0` to the 4-dp stored score, but its `confidence > 0` term (computed unrounded) makes the decision identical. |
| **R1-CLI** | the CLI refuses iff `confidence < 30 \|\| !command` (`cli/index.js:58`) | Use `search().confidence` directly. No arithmetic is re-implemented. |
| **R2** | `rawScore(id) < t`, where `rawScore` is the stored `+score.toFixed(4)` (`review_r1_e…js:80-81`; `reproduce_baseline_v0_2.js:60`) | Reject iff `+s.toFixed(4) < t`, for each of the five thresholds (D2 = a). |

### 1b. The fused top-1 score (R3)

The fused score comes from the research replica, not from `cli/search.js`. The replica exposes
every candidate's score, which fusion needs.

| Step | Code |
|---|---|
| **Lexical:** `lexicalSearchAll(query, platform)`. It uses the same corpus, snippet, tokenizer, BM25 and bonus as 1a, and **returns all candidates** sorted descending. | `lexical_search.js:24-53`, `:57-90` (sort `:88`) |
| **Dense:** `denseSearch(query, {platform})`. It embeds the query with `Xenova/all-MiniLM-L6-v2` (mean pooling, normalized) and takes the dot product with each platform-visible corpus embedding. | `dense_search.js:23-29`, `:42-46`, `:50-64`; the full list is `_scored` (`:77`) |
| **Dense list shape:** map to `{command, intent, category, score: sim}` and sort descending | `build_query_scores_v0_2.js:32-35` |
| **Min-max normalise each list over the query's full candidate set.** When the range is ≤ 1e-9, every normalised value is 0. | `hybrid_fusion.js:7-17` (guard `:14`) |
| Union of candidates, keyed by **command string** | `hybrid_fusion.js:31-33` |
| fused = α·norm_lex + (1 − α)·norm_dense; a candidate missing from one list gets 0 for it | `hybrid_fusion.js:39-41` |
| Top-1 by strict `>`, then sort | `hybrid_fusion.js:43-47` |
| Called with the per-fold α, which is looked up by fold | `build_candidates_v0_2.js:19-24`, `:68-69` |
| Top-10 slice **after** fusion; `top1_score = +fused.toFixed(4)` | `build_candidates_v0_2.js:46`, `:54` |
| Copied unchanged into the reliability features | `build_reliability_features_v0_2.js:21` |
| R3 tuned and applied on `top1_score` (reject iff score < threshold, strict) | `run_selective_prediction_v0_2.js:11`, `:39-54`, `:112`; `review_r1_e…js:26` |

## 2. Dependence on benchmark-only fields

| Field | Where it is used | Does it affect a score? |
|---|---|---|
| review map, `expected_classification`, `gold_command`, `acceptable_commands` | `build_query_scores_v0_2.js:25-28`; `reproduce_baseline_v0_2.js:31-37` | **No.** Used only for labels and accuracy. |
| `folds.assignment` | `build_candidates_v0_2.js:19-24` (α); `review_r1_e…js:26`, `:83-87` (which fold's threshold) | **α: no in practice.** The selected α is 0.5 in all five folds (`hybrid-nested-cv-results.json`, checked today), so the fused score does not depend on the fold. **Thresholds:** E1 applies all five to every query (D2 = a). |
| `query`, the query text | `lexicalSearchAll(q.query, …)`, `denseSearch(q.query, …)`, `search(q.query)` | **Yes. It is the only per-query input.** |

## 3. Facts checked today (read-only, committed files)

| Fact | Value |
|---|---|
| Windows-visible corpus records | 279 of 431 |
| Records in the lexical index | 280 = the 279 corpus records + 1 packaged snippet (`custom_snippets.json`: "force quit out of all node instances"; no `os` field, so it is visible on every platform). The paper discloses this (`content.tex:108-110`, `:450`). |
| Records in the dense list | 279. The snippet has no embedding, so it enters fusion with norm_dense = 0. |
| Duplicate command strings among the Windows-visible records | 0, so fusion's command-keyed maps lose nothing |
| Embedding entries in corpus order, matching the Windows-visible corpus one to one | yes (279/279) |
| Platform recorded in the v0.2 cache | `win32` |
| α per fold (v0.2) | 0.5, 0.5, 0.5, 0.5, 0.5 |
| Cached lexical top-1, rounded to 4 dp, vs the reproduction's stored s | **0 mismatches / 209**. The replica and `cli/search.js` agree on v0.2. |
| v0.2 queries with no tokens left after the stop-word filter | 0. The divergence in risk 3 was never exercised. |
| v0.2 queries whose lexical scores were all equal (norm_lex = 0 everywhere) | 17 of 209 |
| Model cache (`check_model_cache.js`) | OK: 4 files match the recorded SHA-256 |
| Library versions (from `research/package-lock.json`) | `@xenova/transformers` 2.17.2; `onnxruntime-node` 1.14.0. Node today is v24.2.0. |
| `commands.json` SHA-256 | `cc5217af…72e06ea`, equal to `ANALYSIS_FREEZE_v1.0.md:372` |
| `custom_snippets.json` SHA-256 (147 bytes) | `1f7d5e32407b665c28de7d5515c09062498fb52c498f3003c91ee147436a217a` |
| `research/models/corpus_embeddings.json` SHA-256 | `7b8f198ff20b6cf0e6f5f2180404f6f2ac261745551e55ac3a14dfc1afdcb7d1` |

The three hashes are the same with or without CRLF→LF normalisation.

## 4. Risks, and how the design handles each

1. **Min-max normalisation over the candidate set.**
   - The fused score depends on each list's minimum and maximum over the **whole** candidate set:
     280 lexical and 279 dense.
   - Truncating to the top-k before fusion would change the score. In the frozen code, truncation
     happens only after fusion (`build_candidates_v0_2.js:46`).
   - **Handling:** pass the full lists to the unmodified `fuseQuery`.
2. **Candidate-set size and composition.**
   - N, df, the IDF values and avgdl all depend on the index. The index includes the packaged
     snippet.
   - `termassist sync` overwrites `custom_snippets.json` (`cli/index.js:30-40`). Any edit to it, or
     to `commands.json`, changes every score.
   - **Handling:** before scoring, assert the three SHA-256 values in §3 (see ISSUE-07 below).
3. **The empty-token divergence (new).**
   - For a query with no tokens left after the stop-word filter, `search()` returns s = 0 with no
     command (`cli/search.js:74-76`). `lexicalSearchAll` has no such guard:
     - BM25 is 0 for every record;
     - the bonus still runs its substring test. With an empty stripped query, every record gets +15
       (`''` is a substring of everything). All scores are then equal, so norm_lex = 0.
   - **The effect:** R1, R1-CLI and R2 reject such a query, because s = 0. R3 uses the replica's
     behaviour.
   - **This never occurred on v0.2.**
   - **Proposed pre-specified handling (for E1-07):**
     - keep such queries;
     - score each system exactly as its code does;
     - report their count.
   - E1-06 documents the behaviour on synthetic strings only (for example "how do i", "?!").
4. **α.**
   - The frozen code looks α up by fold. E1 uses the constant 0.5, which is valid only because every
     fold selected 0.5.
   - **Handling:** the scorer asserts this from `hybrid-nested-cv-results.json`, and does not
     re-select α.
5. **4-decimal rounding.**
   - R2 and R3 were tuned on `+x.toFixed(4)` values (`reproduce_baseline_v0_2.js:60`;
     `build_candidates_v0_2.js:54`).
   - **Handling:**
     - use exactly `+x.toFixed(4)`, not `Math.round(x*1e4)/1e4`, which can differ at halfway
       cases;
     - compare with strict `<`.
   - A value exactly equal to a threshold is **not** rejected. E1-07 should require their count to
     be reported.
6. **The model cache and the numerical environment.**
   - Dense scores come from an ONNX model. The four model files are pinned by SHA-256 (verified
     today), and the library versions by the lockfile.
   - These files do not record which Node version produced the committed results.
   - **Handling:**
     - run `check_model_cache.js` before scoring;
     - the E1-06 guard, 0 mismatches on the 209 v0.2 queries, is the evidence that this environment
       reproduces the committed numbers;
     - also report, for information, the largest absolute difference in raw cosine against the v0.2
       cache.
7. **Tokenizers.**
   - There are two:
     - the BM25 regex tokenizer. It deletes apostrophes and non-ASCII letters, so "what's" becomes
       "whats" and "café" becomes "caf";
     - the model's WordPiece tokenizer, pinned as `tokenizer.json`.
   - Both are applied to the raw string by the same code paths as on v0.2.
   - **Handling:** CLINC text is passed **exactly as stored**. No lower-casing, trimming or
     punctuation changes are added.
   - **Low risk:** an input longer than the model's maximum length would be truncated by the library.
     CLINC items are single short requests, but this was not checked, because the test queries were
     not read.
8. **Platform.**
   - `search()` reads `os.platform()` itself (`cli/search.js:16`); the replica and the dense module
     take a parameter.
   - **Handling:** assert `os.platform() === 'win32'`, and pass `'win32'` explicitly to both.
9. **Side effects on import.**
   - The `build_*`, `run_*` and `reproduce_*` scripts run their `main` when required, and write to
     `research/results/`.
   - **Handling:** the scorer imports **only**:
     - `cli/search.js`;
     - `lexical_search.js`;
     - `dense_search.js`;
     - `hybrid_fusion.js`.

     These four only export functions.
10. **Size.**
    - The v0.2 cache stores all three full lists per query: 26.1 MB for 209 queries. The same format
      for 5,500 queries would be roughly 690 MB.
    - **Handling:** hold the full lists in memory for one query at a time, and write only the
      per-query values listed in §5.
11. **Exact reproduction without a cache.**
    - v0.2's fusion read the lists back from JSON. JavaScript's `JSON.stringify` writes the shortest
      string that parses back to the same double, so fusing in memory gives bit-identical results.
    - **Handling:** E1 needs no intermediate cache.

## 5. What the new script (E1-06) needs: specification, not code

**Scorer** (`research/experiments/e1_score_queries.js`): input is a list of `{id, text}`. It has no
labels and reads no file of its own.

1. **Pre-flight checks.** Each must pass, or the script aborts:
   - `os.platform() === 'win32'`;
   - the SHA-256 of `commands.json`, `custom_snippets.json` and `corpus_embeddings.json` equal the
     values in §3;
   - `check_model_cache.js` passes;
   - α = 0.5 in all five folds.
2. **For each query:**
   - `r = search(text)` (read-only `require('../../cli/search')`);
   - `lex = lexicalSearchAll(text, 'win32')`;
   - `dense`, from `denseSearch(text, {platform: 'win32'})._scored`, mapped and sorted exactly as in
     `build_query_scores_v0_2.js:33-35`;
   - `f = fuseQuery({lexical: lex, dense}, 0.5)`.
3. **Per-query output:**
   - `s` (unrounded), `s4 = +s.toFixed(4)`, `confidence`, `command_shipped`;
   - `fused` (unrounded), `fused4 = +f.topScore.toFixed(4)`, `command_hybrid`;
   - `n_tokens`;
   - `lexical_top1_score` and `bonus_fired`;
   - `lexical_all_equal` (whether norm_lex = 0 everywhere);
   - `dense_top1`.

   **It records no decisions.** Decisions are applied in E1-10 from the frozen thresholds.
4. **Guard mode.** Run on the 209 v0.2 query texts and require **0 mismatches**, within 1e-9 after
   the 4-dp rounding, for:
   - `s4` against `reproduction-results.json` `actual.score`;
   - `confidence` against `actual.confidence`;
   - `fused4` against `reliability_features.json` `top1_score`.

   Also report the largest absolute difference in raw cosine against the cache.
5. **Synthetic edge cases, never CLINC:** the empty string, stop-words only, and punctuation only.
   Report `search()` against the replica (risk 3).
6. **Writes:** the scratchpad only during E1-06. **No CLINC input, and no existing file changed.**

## 6. New issue

**ISSUE-07 (proposed ID): two scoring inputs are not covered by the analysis freeze's input
hashes.**

- `ANALYSIS_FREEZE_v1.0.md` hashes `commands.json` (`:372`), but neither `custom_snippets.json` nor
  `corpus_embeddings.json`.
- Both are tracked in git, so a git tag pins them. However, `termassist sync` overwrites the snippet
  file in the working copy.
- **Proposed handling, within E1's existing tasks; no frozen artifact changes:**
  - the E1-06 scorer asserts the three hashes (risk 2);
  - E1-09 lists them among E1's frozen inputs.
- `ANALYSIS_FREEZE_v1.0.md` is not touched.
