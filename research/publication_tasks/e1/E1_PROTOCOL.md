# E1 protocol: external out-of-scope check on CLINC150

**Status:** DRAFT. §1–§2 were **approved by the author on 2026-09-30** ("approve, D4 = c, D7 = yes").

- §3 (exclusions, E1-03), §4 (thresholds, E1-04), §5 (scoring, E1-05/06) and §6 (analysis and
  outputs, E1-07) are not written yet.
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
| R1, the fixed rule (the shipped tool) | shipped score s < 2.0 (equivalently, the displayed confidence is below 30%) | none |
| R2, the tuned shipped threshold | s below an F1-maximising threshold chosen on the v0.2 development folds | frozen from v0.2: 6.4952 in four folds, 7.1978 in one. How the five apply to external data is decision D2 (E1-04). |
| R3, the hybrid detector | the hybrid's fused top-1 score (α = 0.5 in every fold) falls below a per-fold threshold | frozen from v0.2: 0.9179, 0.9219, 0.8841, 0.9247, 0.9219. D2 applies here too. |

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
