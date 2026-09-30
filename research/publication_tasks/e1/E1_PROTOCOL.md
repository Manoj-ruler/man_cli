# E1 protocol: external out-of-scope check on CLINC150

**Status:** DRAFT. §1–§2 were **approved by the author on 2026-09-30** ("approve, D4 = c, D7 = yes").

- §4 (thresholds) was written in E1-04 and approved on 2026-09-30 (D2 = a); the R1 wording was
  amended (ISSUE-06).
- §3 (exclusions) was approved on 2026-09-30 (D3 = Rule A with subgroup S).
- §5 (scoring): the design was written in E1-05 (2026-09-30). The guard result is added in E1-06.
- §6 (analysis and outputs, E1-07) is not written yet.
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

## 5. Scoring (E1-05 design; E1-06 implementation and guard pending)

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
