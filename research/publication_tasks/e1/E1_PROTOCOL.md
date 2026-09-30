# E1 protocol: external out-of-scope check on CLINC150

**Status:** DRAFT. §1–§2 were **approved by the author on 2026-09-30** ("approve, D4 = c, D7 = yes").

- §4 (thresholds) was written in E1-04 and approved on 2026-09-30 (D2 = a); the R1 wording was
  amended (ISSUE-06).
- §3 (exclusions) was approved on 2026-09-30 (D3 = Rule A with subgroup S).
- §5 (scoring): the design was written in E1-05, and the scorer was implemented and passed its guard
  in E1-06 (both 2026-09-30).
- §6 (analysis and outputs) was approved on 2026-09-30 (D10 = a). The analysis code is written
  before the freeze (E1-07b).
- **Nothing may be scored until the whole protocol is frozen** (E1-09, gate G-E1).

## 1. Question

**E1 asks:** when requests were written by third parties for a *different* assistant, and were never
screened by any retriever in this project, how often does each of the three out-of-scope rules reject
them? The rules' thresholds are **frozen from v0.2**, with no tuning on E1 data.

How do those rejection rates compare with the rates the paper reports on its own out-of-scope set?

**Why E1 exists.** In the paper's v0.2 results, 35 of the 50 out-of-scope queries were written for
the benchmark and **screened for low retrieval scores**. That screening favours a threshold on the
shipped score, which is the main threat to the paper's out-of-scope finding (freeze §6; paper §5,
Limitations). E1 uses requests that no project retriever has ever seen.

**The three rules**, as defined in paper §4, "What is compared" (ii):

| Rule | Rejects when | Tuning |
|---|---|---|
| R1, the fixed rule (the paper's definition) | shipped score s < 2.0, on the unrounded live values. **On the benchmark** this equals the CLI's 30% rule, because no benchmark query scores in [2.0, 2.36). | none |
| R1-CLI, the shipped CLI's refusal rule (secondary; ISSUE-06, option 1) | displayed confidence below 30%, where confidence = min(round(100·s/8), 100); that is, **s < 2.36** | none |
| R2, the tuned shipped threshold | s, rounded to 4 decimals, below an F1-maximising threshold chosen on the v0.2 development folds | frozen from v0.2: 6.4952 in four folds, 7.1978 in one. They are applied to external data by decision D2 = (a) (§4). |
| R3, the hybrid detector | the hybrid's fused top-1 score (α = 0.5 in every fold, rounded to 4 decimals) falls below a per-fold threshold | frozen from v0.2: 0.9179, 0.9219, 0.8841, 0.9247, 0.9219. D2 = (a) applies too. |

- **Amendment, 2026-09-30 (author, ISSUE-06, option 1).** The approved §1 said "(equivalently, the
  displayed confidence is below 30%)" for R1. That equivalence holds only on the benchmark, so the
  wording was corrected, and R1-CLI was added as a secondary line.
- **R1-CLI's reporting:** the number of CLINC queries whose score falls in [2.0, 2.36), where R1
  and R1-CLI differ, is reported.
- **The primary R1 is unchanged** (s < 2.0), for continuity with the paper's v0.2 numbers.

## 2. Scope

### 2.1 Population (decision D4: **(c), both sets reported separately**, author 2026-09-30)

CLINC150 (`research/data_external/clinc150/data_full.json`, pinned to upstream commit 828f809) has
two test sets. **Every query in both is out of scope for a Windows command retriever**, apart from a
few intent classes that could have a shell answer (E1-03 handles these):

| Set | Size | Structure | What it is |
|---|---|---|---|
| **P1: in-scope test** (`test`) | 4,500 | 150 intents × 30, in 10 domains | Requests to a task assistant (banking, travel, cooking, …) |
| **P2: out-of-scope test** (`oos_test`) | 1,000 | no classes | Requests outside CLINC's 150 intents. They were collected from crowd-worker mistakes and topic prompts (Quora, Wikipedia, …). |

**Options:**

- **(a) P1 only**, minus any class excluded in E1-03. This allows class-level exclusions. It has
  about 4,500 queries, but only **150 independent-ish units**, since queries cluster by intent.
- **(b) P2 only**, kept whole. It is the set CLINC designed to be "out of scope". Having no classes,
  it cannot be filtered by class, so any shell-answerable request in it stays in and is reported as
  a limitation.
- **(c) Both, each reported separately with no pooling. Recommended.**
  - P1 is primary because its exclusions can be stated at class level. P2 is secondary and kept
    whole.
  - They reach the out-of-scope population in two different ways, and agreement between them is
    evidence in itself.
  - Pooling would mix a clustered set with an unclustered one.

**Splits:** only the **test** splits are used (P1 `test`, P2 `oos_test`).

- No training happens in E1, so all splits are equally unscreened. The test splits are simply the
  conventional, pre-declared choice.
- The train and val splits are **not used for anything**, including exploration.

### 2.2 The unit of analysis (fixed now so the analysis cannot choose it later)

- **P1:** queries are clustered by intent (30 each). Every interval on P1 must come from a
  **cluster bootstrap over intents**, not from treating 4,500 queries as independent. Per-query
  intervals would be misleadingly narrow. E1-07 specifies the details.
- **P2:** individual queries, with no cluster structure.

### 2.3 What E1 can show

1. Whether each rule's rejection rate on unscreened, third-party, general-domain requests is close
   to, below or above its rate on the paper's out-of-scope set: all 50 on v0.2, and the 15
   unscreened ones.
2. In particular, whether the tuned shipped threshold (R2) keeps its advantage over the hybrid
   detector (R3) on requests that were **not** screened for low scores. This bears directly on the
   screening-bias threat.
3. The rules' rank order on external data, and per-domain rejection rates (descriptive).

### 2.4 What E1 cannot show (to be carried into the paper; INTEG-05)

1. **Performance on terminal-task out-of-scope requests** (commands the corpus does not cover).
   CLINC requests are general-domain; only 10 of the paper's 50 are terminal tasks.
2. **The cost in refused legitimate queries.** CLINC contains no in-scope shell queries, so E1
   measures only the rejection of out-of-scope requests. A rule that rejects everything would score
   perfectly. **E1 must always be read together with the false-rejection counts from v0.2** (20/134
   for R2, 11/134 for R3, 0/134 for R1).
3. **Anything about benchmark v0.2.1** (decision D7).
4. **Real user traffic** to this tool, or languages other than English. CLINC queries are
   crowd-written, lowercased and without final punctuation.
5. **Calibration or accuracy.** E1 measures rejection only.

### 2.5 Thresholds are frozen from v0.2 (decision D7: **yes**, author 2026-09-30) E1 applies the v0.2 thresholds as they stand in the committed results, which
the git tag `v0.2-validated-benchmark` pins. It applies them even if the final paper later reports
benchmark v0.2.1 from the annotation study.

- **Why:** v0.2 is frozen and was produced before annotation. Re-deriving thresholds on v0.2.1 would
  make E1 depend on an unfinished study, and would change the protocol after it was frozen.
- **What the paper must then say:** E1's thresholds are v0.2's.

### 2.6 Integrity rules specific to E1 (from the plan)

- No threshold, α or feature is tuned on any CLINC data.
- Exclusions are decided at class level in E1-03, from intent names and example queries only, and
  **before any scoring**.
- No E1 outcome is looked at before the protocol freeze (E1-09).
- Any change after the freeze is a numbered deviation that needs the author's approval.

## 3. Exclusions (E1-03; D3 = Rule A with subgroup S, approved by the author on 2026-09-30)

Full reasoning, and exactly what was looked at, are in `e1/E1_EXCLUSIONS.md`.

- **Primary rule, Rule A.** Exclude a P1 intent iff a Windows-visible corpus record performs its
  typical request. This is the benchmark's own out-of-scope definition: codebook line 47, and W9,
  "the list cannot perform this, not a shell cannot".
  - **Result: 0 exclusions.** P1 = all 150 intents, 4,500 queries.
- **Subgroup S (descriptive, not excluded).** These are intents a stock Windows shell could answer
  but the corpus cannot. They are reported separately, and a planned sensitivity analysis drops them.
  - **S-clear:** date, calculator, measurement_conversion, flip_coin, roll_dice, timer.
  - **S-borderline:** time, timezone, alarm, reminder_update, weather, exchange_rate,
    current_location.
- **P2 (`oos_test`)** is kept whole (D4).
- **No per-query exclusions anywhere.**
- **What was decided before any scoring:** everything here. Only intent names, train-split examples
  and the corpus were read; no `test` or `oos_test` query, and no system output.

## 4. Thresholds and how they are applied (E1-04; D2 = (a), author 2026-09-30)

The values and their derivation are verified and re-derived in `e1/E1_THRESHOLDS.md`.

- **R2:** 6.4952 (folds 0, 1, 2, 4) and 7.1978 (fold 3).
- **R3:** 0.9179, 0.9219, 0.8841, 0.9247 and 0.9219, with α = 0.5.

**How they are applied (D2 = a):**

1. **Every threshold is applied separately.** For R2 and R3 separately, each CLINC query is compared
   with each of the five per-fold thresholds, giving five rejection rates per rule and population.
   - **Primary point estimate:** the **median of the five rates**. Rejection is monotone in the
     threshold and there are five thresholds, so it equals the rate at the median threshold (R2
     6.4952; R3 0.9219).
   - **Sensitivity:** the min–max over the five rates, reported next to the median. It is **not** an
     interval.
2. **Comparison rule:** reject iff score < threshold (strict), as in the tuning code.
3. **Rounding:** s and the fused score are rounded to 4 decimals before the comparison, exactly as
   the frozen pipeline stored them (`reproduce_baseline_v0_2.js:60`; `build_candidates_v0_2.js:54`).
   R1 and R1-CLI use the unrounded live values (`reproduce_baseline_v0_2.js:44`; `cli/search.js`,
   `cli/index.js`).
4. **No threshold is re-tuned.** No refit on v0.2 (option c was rejected), and none on CLINC.

## 5. Scoring (E1-05 design; E1-06 implementation, guard passed 2026-09-30)

The full data flow, risks and specification are in `e1/E1_SCORING_DESIGN.md`.

- **s** (for R1, R1-CLI and R2) is the output of the shipped `cli/search.js` `search(text)`, imported
  read-only as in the frozen reproduction.
  - R1 rejects iff unrounded s < 2.0.
  - R1-CLI rejects iff `confidence < 30` or there is no command (`cli/index.js:58`).
  - R2 rejects iff `+s.toFixed(4)` < t.
- **The fused top-1 score** (R3) is `fuseQuery({lexical, dense}, 0.5)` over the full lexical
  (`lexicalSearchAll`) and dense (`denseSearch`) candidate lists, rounded with `+x.toFixed(4)`.
- **The only per-query input is the CLINC text, exactly as stored.**
- **Before scoring, the run aborts unless:**
  - the platform is `win32`;
  - the SHA-256 of `commands.json`, `custom_snippets.json` and `corpus_embeddings.json` match the
    values in the design, §3;
  - the model cache check passes;
  - α = 0.5 in all five v0.2 folds.
- **The scorer must first reproduce all 209 v0.2 scores exactly (E1-06).**
  - **Done 2026-09-30.** `research/experiments/e1_score_queries.js --guard` gave 0 mismatches on
    209 queries for `s4`, for `confidence` and for `fused4`.
  - The live lexical and dense lists were bit-identical to the v0.2 cache.
  - The full log is in `PROGRESS.md`, E1-06.
- **Queries with no tokens** (only stop-words or punctuation) follow each system's own code. The
  E1-06 edge cases show what this means:
  - `search()` gives s = 0, so R1, R1-CLI and R2 reject such a query;
  - the replica's substring bonus can still fire. For example, "the" gives a fused score of 1, so
    R3 would accept it.
  - **§6 must pre-specify:** how many such queries there are, and how each rule decides on them.

## 6. Analysis and outputs (E1-07; approved by the author on 2026-09-30, D10 = a)

The analysis code, `research/experiments/e1_analyze.js`, is written and tested on synthetic data
only, **before the freeze** (E1-07b, ISSUE-08). It is frozen with this protocol, and E1-13 runs it
unchanged.

Everything below is fixed before any CLINC query is scored.

- **Anything computed that is not listed here is labelled "post hoc"** in every output.
- All code reuses the project's existing statistics helpers (`research/experiments/phase1_common.js`):
  - `wilson` (95%, z = 1.96);
  - `exactMcNemar` (two-sided exact binomial);
  - `mulberry32` and `percentile` (linear interpolation).

### 6.1 Units, identifiers and denominators

| Set | Unit | n | Clusters | Identifier |
|---|---|---|---|---|
| P1 (`test`) | query | 4,500 | 150 intents × 30 queries | `test:<i>`, the 0-based index into `data_full.json` `test` |
| P2 (`oos_test`) | query | 1,000 | none | `oos_test:<i>` |
| P1 domains (descriptive) | query | 450 per domain | 15 intents per domain, 10 domains (`domains.json`) | — |
| S-clear | query | 180 | 6 intents | — |
| S-borderline | query | 210 | 7 intents | — |
| P1 without S-clear | query | 4,320 | 144 intents | — |
| P1 without S-clear and S-borderline | query | 4,110 | 137 intents | — |

**Every query in P1 and P2 is out of scope for this tool** (§2, §3). A rejection is therefore
always a correct decision, and **the rejection rate is the only outcome**. There is no in-scope
query in E1 (§2.4, point 2).

### 6.2 Decision rules (exactly as in §1, §4 and §5)

Each rule is computed per query from the scorer's output:

| Rule | Reject iff | Thresholds |
|---|---|---|
| R1 | `s < 2.0` (unrounded) | — |
| R1-CLI | `confidence < 30 \|\| command_shipped === null` | — |
| R2(t) | `s4 < t` | t ∈ {6.4952, 7.1978}. The fold map is 6.4952 for folds 0, 1, 2 and 4, and 7.1978 for fold 3. |
| R3(u) | `fused4 < u` | u ∈ {0.9179, 0.9219, 0.8841, 0.9247, 0.9219} for folds 0–4 |

- **Primary thresholds (D2 = a): the medians, R2 at 6.4952 and R3 at 0.9219.** Unless a threshold
  is named, "R2" and "R3" below mean these.
- **Ties at a threshold:** a score exactly equal to a threshold is **not** rejected (strict `<`,
  as in the tuning code). The same applies to R1 at exactly 2.0.
- **Queries with no tokens** and **lexical-null queries** are kept and decided by each rule as
  above (§5). A query is lexical-null when all its lexical scores are equal (`lexical_all_equal`),
  so that norm_lex = 0 for every candidate.

### 6.3 Primary outcome: the rejection rate of each rule, per population

- **Point estimate:** k/n. It is reported as a count, as a rate to 4 dp, and as a percentage.
  - For R2 and R3 this is the rate at the median threshold. By D2's monotonicity it equals the
    median of the five per-fold rates.
- **Intervals:**
  - **P1: a cluster bootstrap over intents. This is the primary interval (§2.2).**
    - Resample the 150 intents with replacement: B = 10,000, `mulberry32` seed 42.
    - The statistic is the pooled rate over all queries of the resampled intents.
    - The interval is the 2.5th–97.5th percentile.
    - The Wilson interval is also shown, labelled "ignores clustering; too narrow".
  - **P2:** the Wilson 95% interval.
- **Five-threshold sensitivity (R2, R3):**
  - the rate at each of the five per-fold thresholds;
  - the minimum and maximum over the five, labelled "sensitivity range, not an interval".
  - For R2 there are only two distinct values: the rates at 6.4952 and at 7.1978.

### 6.4 The primary comparison, and multiplicity (decision D10 = a, author, 2026-09-30)

There is **one pre-specified primary comparison**:

- **the paired difference in rejection rate, R2 − R3, on P1**;
- with a paired cluster-bootstrap 95% interval. The same resampled intents are used for both
  rules, with the same B and seed as above.

It answers §2.3, point 2: does the tuned shipped threshold keep its lead over the hybrid detector
on requests nobody screened?

**Pre-stated reading:**

| Interval | Reading |
|---|---|
| Entirely above 0 | R2's lead holds on external data |
| Includes 0 | No evidence of a difference |
| Entirely below 0 | The lead reverses |

- The size of the difference is reported whatever the interval.
- **Degenerate case:** if every bootstrap value is identical (for example, both rules reject
  everything), the interval is reported as degenerate. No reading is made beyond the point estimate.

**Secondary comparisons.** These are labelled secondary, and no claim rests on them alone:

- **P2, all three pairs** (R2 − R3, R3 − R1, R2 − R1):
  - the paired difference;
  - the exact McNemar p-value, **Holm-adjusted across these three tests**;
  - the discordant counts (a_only, b_only).
  - The P2 R2 − R3 result is described as a **replication check** on the second population, not as
    a second primary result.
- **P1, the other two pairs** (R3 − R1, R2 − R1):
  - the paired cluster-bootstrap interval only.
  - Exact McNemar is also shown, labelled "ignores clustering".
- **The full 2×2 agreement table** for every pair, in each population.

**Alternatives considered and not chosen:**

- **(b) Fully descriptive.** Every estimate has an interval, and there is no primary test.
- **(c) Two primary comparisons.** R2 − R3 on P1 and on P2, Holm-adjusted over 2.

### 6.5 Other pre-specified quantities (descriptive)

1. **R1 vs R1-CLI.** Count the queries with 2.0 ≤ s < 2.36, per population. Because the rules are
   nested (6.8), this equals R1-CLI's rejections minus R1's.
2. **Subgroup S** (§3):
   - rates for S-clear and for S-borderline;
   - the P1 rates recomputed **without S-clear** and **without S-clear and S-borderline**, with
     cluster-bootstrap intervals (144 and 137 intents);
   - the primary comparison (R2 − R3) recomputed on both reduced sets.
3. **Per domain (P1):** k/450 and the rate for each rule and domain. There are no tests and no
   intervals.
4. **Ties:** the number of queries with `s4` exactly equal to 6.4952 or to 7.1978, or with `fused4`
   exactly equal to any R3 threshold, per population and threshold. None of them is rejected.
5. **Queries with no tokens:**
   - their count, per population;
   - each rule's decision on them;
   - if there are any, each rule's rate with them removed (a sensitivity line).
6. **Lexical-null queries:**
   - their count and share, per population;
   - each rule's rate on the **overlap subset** (all other queries);
   - the primary comparison recomputed on that subset.

   The rules can differ only on the overlap subset (E1-05).

   - **Clarified in E1-07b:** the subset's cluster bootstrap resamples the intents that have at
     least one overlap query.
   - The same rule applies to the reduced sets in point 2: intents with no remaining query are
     dropped before resampling.
7. **Score distributions:** the median, the quartiles and the 5th/95th percentiles of `s`, `s4` and
   `fused4`, per population.
8. **Comparison with v0.2 (descriptive; different populations, no test).**
   - Each E1 rate is placed beside the committed v0.2 rates, with its interval:

     | Rule | v0.2, all 50 | v0.2, 15 unscreened | v0.2, 35 added |
     |---|---|---|---|
     | R1 | 17 | 4 | 13 |
     | R2 | 46 | 12 | 34 |
     | R3 | 34 | 9 | 25 |

     Sources: `results/review_r1/review_r1_e_ood_operating_points.json`
     (`versions.v0.2.committed_operating_points`, `nested_tuned_baseline_threshold`,
     `rejections_by_source`).
   - The E1 difference R2 − R3 is placed beside v0.2's: 24 points on 50, and 20 points on the 15
     unscreened.
   - **Stated caveats:**
     - v0.2's rates are out-of-fold: each query met its own fold's threshold. E1 applies all five
       thresholds to queries that were in no fold. Both are out-of-sample, but they are not the
       same procedure.
     - CLINC is general-domain (§2.4).
   - **Every E1 rate is reported next to the v0.2 false-rejection counts: 0, 20 and 11 of 134 for
     R1, R2 and R3.** E1 cannot measure false rejections (§2.4).

### 6.6 Expected directions (written before running; interpretation aids, not pass/fail criteria)

- **ED-1 (screening).** If v0.2's score screening inflated the tuned shipped threshold:
  - R2's rejection rate on P1 and P2 will be **below 92%** (46/50);
  - and R2 − R3 will be **smaller than v0.2's 24 points**, or reversed.
- **ED-2 (a property of the scores).** If R2's lead reflects how well the two scores separate
  out-of-scope requests, rather than the screening, R2 − R3 will be **above 0** on P1 (the primary
  interval) and on P2.
  - ED-1 and ED-2 can both hold: a smaller lead that is still positive.
- **ED-3 (vocabulary): a floor that holds by construction, not an expectation.** Every rule
  rejects every lexical-null query (6.8, item 4; for R3, provided its dense scores are not all
  equal). So:
  - every rule's rate is **at least the lexical-null share** (6.5, point 6);
  - the rules can differ **only** on the overlap subset.

  If that share is high, the overall rates say little about the rules, and the overlap-subset
  results carry the comparison. **No direction is stated for absolute rates** compared with v0.2.
- **ED-4 (subgroup S).** S intents ask for things a shell could do, and their wording is closer to
  command descriptions. Rejection on S-clear is expected to be **lower** than on the rest of P1, for
  every rule.
- **ED-5 (P1 vs P2).** No direction is stated.

### 6.7 Outputs (new, versioned; none exists before the freeze)

All outputs go in `research/results/e1_clinc150_v1/`:

| File | Task | Content |
|---|---|---|
| `data/p1_queries.json`, `data/p2_queries.json`, `data/DATA_PROVENANCE.md` | E1-10 | `{id, text, intent, domain, subgroup}` (P1) and `{id, text}` (P2), taken unchanged from the committed `data_full.json`. The provenance file gives source hashes and counts. |
| `guard_v0_2.json` | E1-11 | The scorer's `--guard` run, in the same session as the scoring. It must pass. |
| `scores_p1.json`, `scores_p2.json` | E1-11 | The scorer's per-query output (E1-06). |
| `decisions_p1.json`, `decisions_p2.json` | E1-11 | Per query: R1, R1-CLI, R2 at both distinct thresholds, and R3 at all five. |
| `RUN_MANIFEST.json` | E1-11 | See the list below. |
| `summary.json`, `summary.md` | E1-13 | Every quantity in 6.3–6.5, with numerator, denominator and interval. |
| `DEVIATIONS.md` | E1-13 | Present even if empty. |

**The run manifest records:**

- the commit hash, and the protocol tag `e1-protocol-v1`;
- the Node version;
- the SHA-256 of `data_full.json`, `domains.json` and the three scoring inputs;
- the model-cache result;
- the SHA-256 of `e1_score_queries.js` and of the analysis script;
- B, the seed, and the start and end times.

**How the analysis script is run (E1-07b):**

- **E1-11:** `e1_analyze.js --stage decisions` writes the decisions, `logical_checks.json` and
  `RUN_MANIFEST.json`.
- **E1-13:** `--stage summary` writes `summary.json` and `summary.md`. It first confirms that the
  stored decisions equal the ones it recomputes from the scores.
- **The `--synthetic` flag is for tests only, and must not be used on E1 data.** It skips the
  manifest's hashes of the CLINC files.
- The script never overwrites a file. If any logical check fails, it writes
  `logical_checks_FAILED_<stage>.json` and stops with exit code 1.

### 6.8 Logical checks (E1-12)

These are implied by the code. **If any fails, the run is BLOCKED as an implementation error**, and
results are never corrected by hand.

1. Every query rejected by R1 is rejected by R1-CLI.
2. Every query rejected by R1 is rejected by R2 at both thresholds, since s < 2.0 implies
   s4 ≤ 2.0 < 6.4952.
3. R2(6.4952) ⊆ R2(7.1978), and R3 is nested in the order of its thresholds.
4. Every lexical-null query has s = 0. Every lexical-null query whose dense scores are not all equal
   has `fused4` = 0.5, so R3 rejects it at every threshold.
5. The row counts are 4,500 and 1,000. No score is NaN or missing.

### 6.9 Deviation policy

- **Any change after the freeze is a numbered deviation** (DEV-E1-01, …). It records:
  - what changed;
  - why;
  - whether any E1 outcome had been seen;
  - the author's approval.

  It is logged in `PROGRESS.md` (Deviations, E1) and in `DEVIATIONS.md`.
- **Populations, exclusions, thresholds, α, rounding, the primary comparison and B/seed are never
  changed after outcomes are seen.** If a change is unavoidable (for example, a scoring bug), the
  analysis is re-run from the frozen code plus the fix, and **both** the original and the corrected
  results are reported.
- **Failures:**
  - a failed pre-flight or guard stops the run (BLOCKED plus a new issue);
  - nothing is scored until the failure is fixed and recorded.
