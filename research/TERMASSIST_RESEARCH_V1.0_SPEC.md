# TermAssist Research v1.0 — Final Specification

Status: **SPECIFICATION ONLY. No implementation authorized by this document.**
Derived from: `research/FINAL_RESEARCH_REPORT.md` (audit) and the full-repository audit dated
2026-09-15. Supersedes ad-hoc planning for the v1.0 research cycle.

Governing constraint (from the audit): the paper's contribution is **reliability**
(calibration + OOD abstention), reported across **two independently-scaled benchmarks**, with the
hybrid-accuracy result presented as a **replication case study (including its non-replication on
the larger benchmark)** — not as the headline. Every design choice below serves that framing.

Hard prohibitions (carry forward): no LLM in the system; no FAISS / pgvector / RAG / dense vector
DB; no bulk LLM-generated corpus or benchmark data; no expansion "for size." The frozen
`v0.1-validated` benchmark and the frozen production baseline are **immutable**.

---

## 0. Scope, versions, and immutables

| Artifact | This cycle | Rule |
|---|---|---|
| Production baseline `cli/search.js` | UNCHANGED | Immutable except the one comment fix in §10 |
| `TermAssist-Bench v0.1-validated` (150) | FROZEN | Never modified; remains a reported benchmark |
| `TermAssist-Bench v0.2` (209) | Superseded by v1.0 after human re-validation | Kept as historical |
| `TermAssist-Corpus` | Expanded → v1.0 | Additive schema change only (§1) |
| `TermAssist-Bench v1.0` | NEW (§3) | Built per this spec |

All hashes use the **LF-normalized SHA-256** convention already established (Phase-0 audit):
normalize CRLF→LF in memory, then hash UTF-8 bytes.

---

## 1. Corpus (database) schema — `TermAssist-Corpus v1.0`

Current state (verified 2026-09-15): 431 records, **297 unique intents, 279 win32-visible**, 27
categories, no `source`/`validation_status` fields, no `command_id`, no version/hash.

### 1.1 Final record schema (JSON array in `cli/data/commands.json`)

```jsonc
{
  "command_id":        "tac-0001",          // string, stable, unique, immutable once assigned
  "intent":            "undo last git commit but keep changes", // NL description, unique per (intent, os-set)
  "command":           "git reset --soft HEAD~1",               // exact command string
  "category":          "git",                // one of the controlled category vocabulary (§1.3)
  "os":                ["all"],              // non-empty subset of {all, linux, darwin, win32}
  "description":       "Soft-reset one commit, keeping changes staged.", // human-readable, 1 sentence
  "risk_level":        "medium",             // {low, medium, high, critical} — assigned per §7.2
  "source":            "tldr-pages:git/git-reset", // provenance token (§2.4), REQUIRED for new records
  "validation_status": "human_validated"     // {draft, machine_verified, human_validated}
}
```

**Fields to ADD** (currently absent): `command_id`, `risk_level`, `source`, `validation_status`.
**Fields to KEEP**: `intent`, `command`, `category`, `os`, `description`.
**Fields explicitly NOT added** (rejected as unnecessary for a retrieval task):
`required_arguments`, `optional_arguments`, `aliases`, `ambiguity_group`, embeddings-in-corpus.
Rationale: retrieval scores over `intent+category+description`; argument structure and aliases add
maintenance cost without affecting the research question.

### 1.2 Backward-compatibility guarantee (MUST hold)

`cli/search.js::buildIndex()` reads only `os`, `intent`, `category`, `description`, `command`.
Adding the four new fields is **additive and non-breaking** — the production filter ignores
unknown keys. Acceptance check A-1 (§11) verifies the frozen baseline reproduces bit-identically
after the schema addition. **Do not** reorder or rename existing fields.

### 1.3 Controlled vocabularies

- `category`: the existing 27 categories are the seed vocabulary. New categories require an entry
  in `research/datasets/CATEGORY_VOCAB.md` with a one-line definition. No free-text categories.
- `os`: `{all, linux, darwin, win32}` only. `all` is mutually exclusive with the others in a record.
- `risk_level`: `{low, medium, high, critical}`, defined operationally in §7.2.
- `validation_status`: `{draft, machine_verified, human_validated}`. **Only `human_validated`
  records may appear in the frozen v1.0 corpus.**

### 1.4 Integrity constraints (enforced by a validator script, §10)

1. `command_id` unique across the corpus.
2. `(intent, sorted(os))` unique — no two records share an intent for the same platform set.
3. `os` non-empty; `all` never co-occurs with a specific platform.
4. Every record has non-empty `description`.
5. Every non-`all` cross-platform intent pair (same `intent`, different `os`) is intentional and
   flagged in the corpus manifest (these are the 134 cross-platform paraphrase pairs; keep them,
   but the manifest must report the **win32-visible unique-intent count** as the headline size,
   not the raw record count).

---

## 2. Corpus expansion protocol

Target: **500–800 unique intents (win32-visible)**, up from 279. Justification: enough to (a)
support an intent-held-out generalization split (§5.2) with non-trivial group sizes, and (b)
defuse the "toy corpus" reviewer reflex — **not** thousands (no research return beyond this range
for the reliability question). Stop at the low end (≈500) if annotation budget is constrained.

### 2.1 Pipeline (each step gated; no step skippable)

```
authoritative source → candidate extraction → normalization → dedup →
platform classification → intent authoring → description verification →
syntax verification → risk classification → HUMAN validation → inclusion
```

### 2.2 Sources (license-checked, no bulk LLM)

Permitted: man-pages, tldr-pages (CC-BY), official tool docs, existing curated corpus.
**Prohibited**: bulk LLM generation of commands or intents. An LLM may *assist* an author (e.g.
suggest a paraphrase of a description), but every resulting record is `draft` until a human
verifies command syntax and promotes it to `human_validated`.

### 2.3 Deduplication rule

- Exact: reject any record whose `command` string already exists (current corpus has 0 exact dups;
  maintain this).
- Near-intent: for a candidate intent `q`, compute token-Jaccard against all existing intents;
  if `max Jaccard ≥ 0.85` with an intent that maps to the same command family, reject as a
  near-duplicate unless it is a **deliberate cross-platform pair** (§1.4.5).

### 2.4 Provenance token format

`source = "<dataset>:<path-or-id>"`, e.g. `"man-pages:tar.1"`, `"tldr-pages:common/rsync"`,
`"curated-v0:legacy"` for pre-existing records. Every record MUST carry a resolvable token.

### 2.5 Freeze

On completion, write `research/datasets/TERMASSIST_CORPUS_v1.0_MANIFEST.json` with: record count,
**win32-visible unique-intent count (headline)**, category histogram, os histogram, LF-normalized
SHA-256 of `commands.json`, creation date, provenance summary. Tag `v1.0-corpus`.

---

## 3. Benchmark v1.0 schema

Build order: **human-revalidate v0.2's 59 AI-authored queries first** (§4.4), then add new
queries to reach the target distribution (§6). Keep `v0.1-validated` frozen and separately
reported.

### 3.1 Query record schema (extends the v0.1 schema)

```jsonc
{
  "id":                 "TA-B151",           // stable unique
  "query":              "grep",              // the NL input
  "query_type":         "ambiguous",         // §6 vocabulary
  "gold_intent":        null,                // corpus intent string, or null (OOD/ambiguous)
  "gold_command":       null,                // exact corpus command, or null
  "acceptable_commands":[ "...", "..." ],    // ≥2 for ambiguous; [] for canonical/OOD
  "category":           "grep",              // corpus category, or null for OOD
  "difficulty":         "hard",              // {easy, medium, hard, adversarial}
  "risk_level":         "low",               // risk of the gold/most-likely command
  "known_task":         true,                // is the task representable in the corpus?
  "ambiguity":          true,                // multiple valid interpretations?
  "requires_rejection": false,               // should the system abstain? (true for OOD)
  "ood_subtype":        null,                // §7.1 vocabulary, or null
  "ambiguity_subtype":  "ambiguous_verb",    // §6.3 vocabulary, or null
  "is_control":         false,               // TRUE for canonical verbatim-from-corpus queries
  "intent_group_id":    "grep",              // group key for intent-held-out split (§5.2)
  "provenance":         "ai_assisted_human_validated", // {human, ai_assisted_human_validated}
  "annotation_status":  "validated",         // {draft, needs_review, validated}
  "source_intent_id":   null                 // corpus command_id the query derives from, or null
}
```

**New fields vs. v0.1**: `ood_subtype`, `ambiguity_subtype`, `is_control`, `intent_group_id`,
`provenance`. These carry the audit's required distinctions (control flag, OOD/ambiguity taxonomy,
generalization grouping, authorship disclosure).

### 3.2 Files (frozen on completion, LF-hashed, manifested)

`termassist_bench_v1.0_validated.json`, `.csv`, `review/human_review_results_v1.0.json`,
`VALIDATED_BENCHMARK_MANIFEST_v1.0.json`, `v1.0_ADJUDICATION_REPORT.md`. Tag `v1.0-validated-benchmark`.

---

## 4. Annotation rules

### 4.1 Ground-truth definition (unchanged from v0.1)

Correctness is judged by **functional equivalence to the task**, against corpus content only. Gold
command must exist in the corpus. A retrieval is CORRECT iff the returned command is in
`{gold_command} ∪ acceptable_commands`.

### 4.2 Control flag (MANDATORY — fixes the independence finding)

Any query whose text is verbatim-equal (or trivially equal) to a corpus `intent` MUST have
`is_control = true`. **Verified fact:** all 25 v0.1 canonical queries are verbatim corpus intents.
Control queries are reported **only** as a sanity/positive-control row and are **excluded** from
any headline capability metric. Non-control paraphrase/low-overlap/polysemy/ambiguous/OOD queries
carry the actual claims.

### 4.3 Category-specific inclusion gates

- **Ambiguous**: MUST have ≥2 corpus commands that are *genuinely distinct tasks* (not parameter
  variants of one command), each independently plausible. Reject "one dominant answer" candidates
  (this rule already rejected 6/30 v0.2 candidates — keep it).
- **OOD**: MUST satisfy BOTH (a) human judgment: no corpus command performs the task, AND (b)
  empirical gate: `top-1 raw BM25 score < 8.0` AND `top-1 dense cosine < 0.35` against the corpus.
  (Thresholds derived from the v0.2 OOD adjudication distribution; record the measured values in
  the adjudication report per query.)
- **Paraphrase / low-overlap**: expresses the same task as exactly one corpus intent, adding/
  removing no constraint; low-overlap requires token-Jaccard < 0.4 with the source intent.
- **Safety-sensitive**: `risk_level ∈ {high, critical}` verified against actual command behavior.

### 4.4 AI-authored query re-validation (MANDATORY before headline use)

Every `provenance = ai_assisted_human_validated` query (all 59 v0.2 additions, plus any new v1.0
ones) requires a human pass that either confirms or edits the label. Compute and report
**inter-annotator agreement (Cohen's κ)** on a ≥20% re-annotated sample against a second annotator;
target κ ≥ 0.7. Queries failing re-validation are dropped or corrected, not silently kept.

### 4.5 Adjudication logging

Reuse the v0.1/v0.2 process: generate → verify-against-retrieval → label → adjudicate
inconsistencies → freeze. Every accept/reject decision logged in `v1.0_ADJUDICATION_REPORT.md`
with the empirical scores that justified it.

---

## 5. Splits

Three protocols, **all reported side by side**. All deterministic, `seed = 42`, `mulberry32` PRNG
(existing). No threshold, α, or calibrator is EVER fit on data used to score it.

### 5.1 Split A — Primary: nested 5-fold CV, class-stratified

The existing, validated protocol. Stratify folds by `expected_classification`
(CORRECT/AMBIGUOUS/OOD/NEEDS_CORRECTION). For each test fold, select α / OOD threshold / ambiguity
threshold / isotonic calibrator using **only the other 4 folds**; score once on the held-out fold;
pool across folds for reported metrics. Primary source of all comparative claims.

### 5.2 Split B — Generalization: nested 5-fold **GroupKFold by `intent_group_id`**

Folds partitioned so that **no `intent_group_id` appears in both a tuning fold and its test fold**.
This is the intent-held-out test the audit requires: it measures retrieval/reliability on intents
whose family was unseen during tuning. Same nested tuning discipline as Split A. Report all
primary metrics under Split B; a large A→B drop is itself a reportable generalization limitation.

### 5.3 Split C — Confirmatory single-use holdout (SHOULD, if n permits)

Carve a fixed **~15–20% confirmatory partition** (class-stratified, seed 42) that is **excluded
from all Split-A/B development and touched exactly once**, at the very end, for the single headline
number per primary hypothesis. Purpose: answer the "repeated CV runs are implicit tuning"
objection. If v1.0 n < 300, document that Split C is omitted for statistical-power reasons and rely
on A+B (state this explicitly rather than shrinking folds below usefulness).

### 5.4 Split registry

Write `research/results/v1.0/splits.json` recording every query's fold assignment under A, B, and
C, plus the seed and method — so any reviewer can reproduce the exact partitions.

---

## 6. Benchmark v1.0 distribution

Target **~300–400 queries** (not 800–1200; the audit found no research return beyond this for the
reliability question, and each query costs real human adjudication). Suggested composition:

| query_type | Target | Purpose | Notes |
|---|---:|---|---|
| canonical | 25 | positive control | `is_control=true`, excluded from headline metrics |
| paraphrase | 50 | primary capability | |
| low_overlap_paraphrase | 40 | lexical-gap stress | Jaccard < 0.4 |
| polysemy | 30 | cross-domain confusion | |
| ambiguous | 45 | ambiguity detection | ≥2 distinct valid commands; §6.3 subtypes |
| **ood** | **60** | OOD/abstention (power) | §7.1 subtypes; the statistically load-bearing class |
| single_keyword | 20 | underspecification | |
| safety_sensitive | 30 | risk behavior | overlaps the independent safety set (§7) |
| complex_multi_intent | 25 | compositional | |
| **intent_held_out** | 40 | generalization | queries whose `intent_group_id` is reserved for Split B test only |
| **Total** | **~365** | | |

### 6.1 OOD is deliberately the largest new class

n=15 (v0.1) gave p=0.25; n=50 (v0.2) gave p=1.5e-5. 60 preserves power with margin and allows
per-subtype breakdown.

### 6.2 Canonical stays small — it is only a control

Do not grow canonical; it is near-tautological (§4.2).

### 6.3 Ambiguity subtypes (`ambiguity_subtype`)

`missing_object`, `missing_path`, `missing_argument`, `missing_platform`, `multiple_valid_commands`,
`ambiguous_verb`, `destructive_ambiguity`, `underspecified_request`. Target ≥4 per subtype across
the 45 ambiguous queries.

---

## 7. OOD taxonomy and safety protocol

### 7.1 OOD taxonomy (`ood_subtype`, target counts within the 60)

| ood_subtype | Def | Target | Example |
|---|---|---:|---|
| near_ood | terminal task, tool absent from corpus | 12 | "configure nginx reverse proxy" |
| far_ood | real computing task far from corpus | 10 | "train a neural network" |
| non_terminal | real-world non-computing | 12 | "book a hotel room" |
| nonsensical | not a real task | 8 | "make a cappuccino" |
| platform_ood | valid only on an uncovered platform | 8 | (task requiring a shell not in corpus) |
| unsupported_tool_ood | names a specific tool absent from corpus | 10 | "compile with cargo" |

Each must pass the §4.3 empirical gate. Report OOD detection **per subtype** (near_ood is the hard,
interesting case; nonsensical is the trivial control).

### 7.2 Safety protocol (fixes the "not independent" finding)

- **Risk-level definition** (corpus `risk_level` and benchmark `risk_level`): `low` = read-only/no
  state change; `medium` = reversible/limited scope; `high` = hard-to-reverse; `critical` =
  system-wide/catastrophic. Assigned by a human against **actual command behavior**, not by the
  regex classifier.
- **Independent safety benchmark** (`research/datasets/safety_set_v1.0.json`, ~50 items): ~20
  genuinely destructive, ~20 benign-lookalike (surface-similar but safe), ~10 ambiguous-risk.
  Labeled by a human **before** and **independently of** the regex rules in
  `safety_classifier.js`. This makes the safety evaluation genuinely held-out.
- **Classifier**: remains deterministic regex (`safety_classifier.js`), no ML/LLM. Rules authored
  from general domain knowledge; **not** tuned against the safety_set labels.
- **Metrics**: report the risky (high/critical) binary **precision, recall, F1 with raw TP/FP/FN/TN
  counts** and Wilson 95% CIs (not just rates — the positive class is small). **Primary safety
  claim = dangerous-direction miss rate** (fraction of high/critical labeled `low`/`medium`), which
  must be 0 to claim any safety property.
- **Execution**: NEVER execute `high`/`critical` commands. Safety eval is text classification only.

---

## 8. Statistical methodology

### 8.1 Pre-registration

Before running v1.0 experiments, write `research/results/v1.0/PREREGISTRATION.md` naming: the
single **primary hypothesis** (proposed: *"calibration reduces ECE on the held-out folds"* — the
robust result, not accuracy), the secondary hypotheses, and the exact test for each. This defuses
the multiple-comparison / p-hacking objection.

### 8.2 Tests

- **Paired accuracy / rejection comparisons**: exact (binomial) two-sided McNemar's test on
  discordant pairs (existing). Report discordant counts b/c.
- **Multiple-comparison correction (MANDATORY)**: Holm–Bonferroni across the defined primary family
  (A0-vs-A3, A2-vs-A3, baseline-vs-tuned-OOD, calibration-improvement). Report raw and
  Holm-adjusted p-values. State the family explicitly.
- **Proportions**: Wilson 95% CIs (existing).
- **Bootstrap (ADD)**: percentile 95% CIs via 10,000 resamples (seed 42) for: accuracy deltas
  (A0→A3), ECE (before and after, per variant), and risk–coverage AUC. Report the ECE-reduction as
  a delta **with CI**, not a bare "80.4%".
- **AUROC**: threshold-free (Mann–Whitney), with a bootstrap CI (ADD).

### 8.3 Reporting rules (hard)

- Report every primary comparison on **both v0.1 (frozen) and v1.0**, plus Split A and Split B.
- Never label supported-task accuracy as "overall."
- Never call a result significant after Holm if the adjusted p ≥ 0.05.
- The BM25→hybrid accuracy result is reported as a **replication finding** with both benchmarks'
  p-values side by side (it is expected to be non-significant on the larger/harder set).

---

## 9. Experiment matrix (final)

All rows reported on v0.1 + v1.0, Split A + Split B (Split C for the primary hypothesis only).

| ID | Research question | IV | DV | Split | Metric | Test |
|---|---|---|---|---|---|---|
| E-A0 | How reliable is frozen BM25? | — | acc, OOD rej, ECE | A | acc, ECE | — |
| E-A1 | Does dense retrieval alone help? | method | acc | A,B | acc | McNemar+Holm |
| E-A3 | Does hybrid fusion help? (replication) | α | acc | A,B,C | acc + bootstrap CI | McNemar+Holm |
| E-CAL | Does calibration reduce ECE? (**primary**) | calibrator | ECE, Brier | A,B,C | ECE + bootstrap CI | pre-registered |
| E-OOD | Does abstention catch OOD? | threshold | rej rate, AUROC | A,B | AUROC+CI, rej | McNemar+Holm |
| E-OOD-SUB | Which OOD subtypes are hard? | ood_subtype | rej rate | A | per-subtype rej | — |
| E-AMB | Can we detect ambiguity? | threshold | F1, AUROC | A,B | F1, AUROC+CI | — |
| E-SEL | Accuracy–coverage tradeoff | threshold | sel-acc@cov | A,B | risk-coverage AUC+CI | — |
| E-GEN | Does it hold on unseen intents? | — | acc, ECE | B | A→B delta | McNemar |
| E-SAFE | Flag dangerous commands? | — | P/R + counts | held-out safety set | P/R+Wilson, miss-rate | — |
| E-FUNC | Do retrieved commands run? | — | exit-0 | sandbox (~40–60) | success rate | — |
| E-ABL | Component contributions (A0–A6) | component | acc/sel-acc | A | ablation table | — |

**Substring-bonus ablation (A0 vs A1)**: keep; report as the clean null it is (0 top-1 diffs).

---

## 10. File changes (planned; not to be executed under this document)

### 10.1 Production (exactly one edit)

- `cli/index.js:7` — **delete the false "local FAISS vector search" comment.** This is an integrity
  fix, not a feature. No other production change. (Optional, separately-scoped: a `man-cli
  --research` mode — deferred; if built, it adds `@xenova/transformers` + model download and must be
  gated behind the flag so the default tool stays 2-dependency and offline.)

### 10.2 Corpus

- `cli/data/commands.json` — additive schema fields (§1.1); expansion to 500–800 intents (§2).
- `research/datasets/CATEGORY_VOCAB.md` — NEW controlled-vocabulary doc.
- `research/datasets/TERMASSIST_CORPUS_v1.0_MANIFEST.json` — NEW.
- `research/experiments/validate_corpus.js` — NEW validator enforcing §1.4.

### 10.3 Benchmark

- `research/datasets/termassist_bench_v1.0_validated.{json,csv}` — NEW.
- `research/datasets/review/human_review_results_v1.0.json` — NEW.
- `research/datasets/VALIDATED_BENCHMARK_MANIFEST_v1.0.json`, `v1.0_ADJUDICATION_REPORT.md` — NEW.
- `research/datasets/safety_set_v1.0.json` — NEW independent safety set (§7.2).

### 10.4 Experiment pipeline (v1.0 runners; reuse existing logic, new benchmark paths)

- `research/experiments/build_folds_v1_0.js` (A, B, C splits → `splits.json`).
- `research/experiments/*_v1_0.js` mirroring the existing v0.2 script set.
- `research/experiments/run_bootstrap_ci.js` — NEW (§8.2).
- `research/experiments/apply_holm_correction.js` — NEW (§8.2).
- `research/experiments/run_all_v1_0.js` — NEW **single canonical runner** (the v0.2 set currently
  lacks one — audit gap).
- `research/results/v1.0/PREREGISTRATION.md`, `splits.json`, result JSONs, `V1.0_RESULTS_NOTES.md`.

### 10.5 Paper

- Update `research/paper/manuscript.md` to the reliability-led framing with v0.1+v1.0 tables and
  the replication table as a centerpiece; update `limitations.md`, `related-work-matrix.csv`
  (add Card et al. 2020 — already added).

---

## 11. Acceptance criteria (freeze gates)

The v1.0 research artifact is frozen only when ALL of the following pass. Each is a checkable gate.

**Corpus**
- A-1 Frozen baseline reproduces bit-identically after the additive schema change (0/150 mismatch).
- A-2 Corpus validator (`validate_corpus.js`) passes all §1.4 constraints; 0 exact-dup commands.
- A-3 Win32-visible unique intents ∈ [500, 800]; every record `human_validated` with a `source`.
- A-4 Corpus manifest written with LF-SHA-256; `v1.0-corpus` tag cut.

**Benchmark**
- B-1 All AI-authored queries human-revalidated; Cohen's κ ≥ 0.7 on ≥20% double-annotated sample.
- B-2 Every canonical/verbatim query has `is_control=true`; controls excluded from headline metrics.
- B-3 Every OOD query passes the empirical gate (BM25 < 8.0 AND dense cosine < 0.35) and carries an
  `ood_subtype`; every ambiguous query has ≥2 distinct valid commands and an `ambiguity_subtype`.
- B-4 v1.0 frozen, LF-hashed, manifested; `v1.0-validated-benchmark` tag cut; v0.1 untouched.

**Splits & leakage**
- C-1 `splits.json` present; Split B verified to have **no `intent_group_id` shared** across a
  fold's train/test; Split C (if used) verified untouched during A/B development.
- C-2 Every tuned parameter (α, OOD threshold, ambiguity threshold, calibrator) provably dev-fold-
  only (config log lists split provenance for each).

**Experiments & stats**
- D-1 Every E-row in §9 run on v0.1+v1.0, Split A+B, with metadata (commit, hashes, seed).
- D-2 Holm-adjusted p-values reported for the primary family; no result called "significant" at
  Holm-adjusted p ≥ 0.05.
- D-3 Bootstrap 95% CIs present for accuracy deltas, ECE (before/after), risk-coverage AUC, AUROC.
- D-4 Pre-registration doc predates the final result JSONs (git timestamps confirm).
- D-5 Safety evaluated on the **independent** safety set; dangerous-direction miss rate = 0 to make
  any safety claim; P/R reported with raw counts + Wilson CIs.
- D-6 Functional eval ≥ 40 sandboxed tasks; no high/critical executed; scope stated, not generalized.

**Reproducibility & integrity**
- E-1 `run_all_v1_0.js` regenerates every v1.0 artifact from a clean checkout (after one offline-
  documented `build_embeddings` step); outputs match committed (excluding timestamps/latency).
- E-2 False FAISS comment removed from `cli/index.js`.
- E-3 No fabricated numbers; every manuscript figure traces to a result file; all discrepancies
  resolved with dated errata (never silently).

**Claims**
- F-1 Manuscript makes only §22 (audit) "can-make" claims; no "accurate/general/robust/production-
  ready/safe/first" language without literature-backed narrow scoping.
- F-2 The BM25→hybrid accuracy result is presented as a two-benchmark replication finding
  (including non-replication), never as an unqualified headline.

---

## 12. Non-goals (explicit, to prevent scope creep)

- No LLM anywhere in the shipped system; local-LLM comparator remains optional/deferred.
- No FAISS / pgvector / vector DB / RAG.
- No bulk synthetic data.
- No corpus growth beyond ~800 intents.
- No claim of generality beyond the curated closed set.
- No new web-app / dashboard work (out of research scope).

---

*End of specification. Implementation of any item above requires separate authorization.*
