# E1-08: protocol review for leakage, selection bias and ambiguity

**Reviewed:** 2026-09-30.

**What was reviewed:**

- `E1_PROTOCOL.md` (all sections);
- `research/experiments/e1_score_queries.js` and `research/experiments/e1_analyze.js`, which are
  both frozen at E1-09.

**Rules followed:**

- **No CLINC query text was read, and nothing was scored.** The one data check (scratchpad
  `e1_08_counts.js`) read labels only.
- **Only protocol text was changed** (§3 below). Items that affect validity are put to the author
  (§4).

## 1. Checklist

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | No threshold is tuned on E1 data | **Pass** | R2 and R3 are frozen v0.2 values (§4). `e1_analyze.js` re-reads them from the committed results and aborts if they differ (`frozenInputs`). `e1_score_queries.js` aborts unless α = 0.5 in all five folds. No code path reads CLINC labels to choose any value. |
| 2 | Exclusions are class-level and were decided without scores | **Pass** | §3 and `E1_EXCLUSIONS.md`: Rule A, with 0 exclusions. It was decided from intent names, train-split examples and the corpus; no test query and no system output was used. There are no per-query exclusions. |
| 3 | No outcome was viewed | **Pass** | `research/results/e1_clinc150_v1/` does not exist, and `git log` on it is empty. The scorer has only been run on the 209 v0.2 queries and on 6 synthetic strings. The analysis script has only been run on synthetic files. The scratchpad holds no CLINC score file. |
| 4 | The protocol states that CLINC150 is general-domain | **Pass**, after text fix T-2 | §2.3, §2.4 point 1, and the §6.5 caveats. §2.1 contained a sentence inconsistent with Rule A; fixed (T-2). |
| 5 | Multiple comparisons are handled, or secondary outcomes are labelled descriptive | **Pass**, with one code finding (C-1) | There is one primary comparison (D10 = a). P2's pairs are Holm-adjusted over 3. P1's other pairs have intervals and are labelled secondary. Everything else is descriptive. **C-1:** the recomputed primary comparisons on reduced sets and on the overlap subset print a "reading" string that sounds like a primary conclusion (see §4). |
| 6 | The denominators are right | **Pass** (verified) | From the labels in `data_full.json`, with no text read: `test` has 4,500 rows, 150 intents × 30; `oos_test` has 1,000 rows, all labelled `oos`. All 150 intents are in `domains.json`, with 450 rows per domain. All 13 subgroup-S names exist. S-clear = 180, S-borderline = 210, without S-clear = 4,320, without either tier = 4,110. These equal §6.1. |
| 7 | No rule is favoured by construction | **Finding: ISSUE-10, needs the author's decision** | E1 counts only rejections of out-of-scope requests. A rule set to reject more in general therefore scores higher, whatever its quality. R2 and R3 sit at different v0.2 operating points: 20 vs 11 false rejections of 134. A positive R2 − R3 on CLINC is partly expected from that alone. §2.4 point 2 warns about this, but the primary comparison's pre-stated reading ("R2's lead holds on external data") does not. See §4. |

**Other asymmetries checked and judged acceptable:**

- **Queries with no tokens.** R1, R1-CLI and R2 reject them, while R3 may accept them. This is
  each system's own behaviour. They are counted, and reported with a sensitivity line (§6.5
  point 5).
- **Lexical-null queries.** Every rule rejects them, so they are neutral between rules (§6.6,
  ED-3).
- **Rounding and ties.** Both scores use `+x.toFixed(4)` and strict `<`, and both use their median
  threshold. This is symmetric.

## 2. The scripts checked against the protocol

| Protocol | Code | Match |
|---|---|---|
| §5: s from `cli/search.js` `search()`, and the fused score from `fuseQuery(…, 0.5)` over the full lists | `e1_score_queries.js` `scoreOne` | yes. The guard showed 0/209 mismatches, and the lists were bit-identical (E1-06). |
| §5 pre-flight: platform, 3 hashes, model cache, α | `e1_score_queries.js` `preflight` | yes |
| §6.2: R1 `s < 2.0`; R1-CLI `confidence < 30 \|\| command null`; R2 `s4 < t`; R3 `fused4 < u`; medians 6.4952 and 0.9219 | `e1_analyze.js` `decide` | yes |
| §6.3: k/n; Wilson; P1 intent-cluster bootstrap (B = 10,000, seed 42, 2.5–97.5 percentile, pooled rate); five-threshold range | `analysePopulation`, `clusterBootstrap` | yes. An independent re-implementation matched (E1-07b T2). |
| §6.4: the primary R2 − R3 on P1 with a paired cluster bootstrap and the pre-stated reading; P2 McNemar with Holm over 3; P1 secondary pairs; 2×2 tables | `analysePopulation` | yes (the reading wording is affected by ISSUE-10) |
| §6.5 points 1–8 | `analysePopulation`, `p1Extras`, `v02Comparison` | yes (E1-07b T1 covers each) |
| §6.7 outputs and manifest | `main` | yes. The scoring-input hashes and model-cache result reach the manifest through the scorer's `preflight` block. |
| §6.8 logical checks 1–5, plus the D2 median identity | `logicalChecks`, `main` | yes (E1-07b T5–T8b) |

## 3. Text-only fixes applied in this review

These do not change validity. §2 and §6 were approved earlier, so the author confirms them at the
E1-09 freeze approval.

- **T-1.** In §2.5, the heading and its first sentence had run together. Formatting only.
- **T-2.** §2.1 said every query is out of scope "apart from a few intent classes that could have a
  shell answer (E1-03 handles these)".
  - That contradicts the approved Rule A (§3) and §6.1, under which every P1 query is out of scope,
    with shell-answerable intents reported as subgroup S.
  - The sentence was reworded to match D3.
- **T-3.** §6.7 now fixes two value formats that the analysis code relies on:
  - `subgroup` is exactly `"S-clear"`, `"S-borderline"` or `null`;
  - `domain` is the `domains.json` key.
- **T-4.** §6.5 point 3 now notes that **9 of the 13 subgroup-S intents are in the `utility`
  domain**. The utility domain's rate is therefore largely a subgroup-S result. Verified from
  `domains.json`: utility 9, travel 2, home 1, auto_and_commute 1.
- **T-5.** §1 is more precise about the v0.2 screening. The 35 added queries were **checked** for low
  scores and **none was discarded** (`review_r1_a_ood_selection.json` `facts`). Any selection
  effect therefore comes from how they were drafted.
- **T-6.** §6.5 point 1: the authoritative count is R1-CLI's rejections minus R1's. The count of
  queries with 2.0 ≤ s < 2.36 is a cross-check, since they can differ only if s is exactly the
  double 2.36. The code already reports both, with an equality flag.

## 4. Findings for the author

### ISSUE-10: the operating-point confound (checklist item 7)

**The problem.**

- On out-of-scope-only data, the rule tuned to reject more wins. On v0.2, R2 bought 46/50 at 20
  false rejections, and R3 34/50 at 11 (of 134).
- The paper itself says the two tuned rules "sit at different operating points". At equal
  false-rejection counts on v0.2, in-sample, the two scores were close: 33 vs 33 out-of-scope
  rejections at 7 false rejections, and 37 (at 10) vs 36 (at 11) with at most 11 allowed
  (`review_r1_e_ood_operating_points.json`, `in_sample_matched_false_rejection`, of 159 in-scope).
- E1's primary comparison inherits the unmatched operating points. Its pre-stated reading ("R2's lead
  holds on external data") could be read as "R2 is the better rule", which E1 cannot show.

**A property that makes a fair comparison possible.**

- Choose a threshold so that a score rejects a fixed number m of v0.2's in-scope queries (the
  largest t with at most m in-scope queries below it). That threshold depends **only on the in-scope
  scores**, not on the screened out-of-scope set.
- Matched thresholds are therefore free of the screening that E1 exists to test. They use frozen v0.2
  data only; nothing is tuned on CLINC.
- They are not stored in the committed results: `review_r1_e…js:65` deletes them. They would be
  re-derived deterministically.

**Options:**

- **(a) Text only.**
  - Reword the primary reading to: "R2 rejects more external out-of-scope requests **at its v0.2
    operating point, which also has more false rejections (20 vs 11 of 134)**. This does not by
    itself show that R2 is the better rule."
  - Reword ED-2 the same way.
  - Change the matching output strings in `e1_analyze.js`. That is a small code change, so it
    needs a code task before the freeze.
- **(b) Recommended: (a), plus a pre-specified secondary comparison at matched operating points.**
  - For each score (s4 and fused4), set its threshold from v0.2's 159 in-scope queries alone, so
    that it rejects at most m of them, with m = 11 (R3's observed v0.2 count). Use strict `<`, as
    in §6.2.
  - Report the paired R2m − R3m on P1 (cluster bootstrap) and on P2 (exact McNemar), labelled
    secondary.
  - This needs a small code task, **E1-07c**: derive the thresholds, add the comparison, and extend
    the synthetic tests. It is a plan change.
- **(c) Like (b), but make the matched comparison co-primary** with R2 − R3 (Holm over 2). This
  changes D10.

### ISSUE-09: P2 is assumed out of scope, but this was not checked query by query

**The problem.**

- Rule A was checked at class level for P1. P2 (`oos_test`) has no classes, and its queries were not
  read, by design.
- If a P2 query asked for something a corpus record performs, rejecting it would be wrong, but E1
  would count it as correct.
- The protocol currently asserts that every P2 query is out of scope (§2.1, §6.1).

**Options:**

- **(a) Recommended: text only.** State that P2's out-of-scope status for this corpus is **assumed,
  not verified**, and add it to §2.4. P1 is primary and was checked at class level.
- **(b)** Before scoring, the author reads `oos_test` against a pre-specified rule, and flags
  queries a corpus record performs. Flagged queries would be reported as a sensitivity line, never
  excluded.
  - This costs about 1,000 reads of the author's time.
  - It must be done by a person: AI output is not used as an annotator.

### C-1: output labels for the recomputed comparisons (checklist item 5)

- `e1_analyze.js` attaches the primary reading text to the recomputed R2 − R3 on the reduced S sets
  and on the overlap subset.
- **Proposed:** label these "sensitivity (descriptive)", and drop the "R2 lead holds" wording from
  them. This is a code string change, which fits in the same code task as ISSUE-10.

## 5. Author's decisions (2026-09-30)

"ISSUE-10 = b, ISSUE-09 = a, approve C-1, add E1-07c".

**ISSUE-10 = (b).** Applied to the protocol text:

- the primary reading is reworded (§6.4);
- a secondary matched-operating-point comparison, R2m − R3m, is specified: m = 11, with thresholds
  from v0.2's 159 in-scope queries only (§6.2, §6.4, §6.7);
- ED-2 is restated on the matched comparison (§6.6);
- §2.4 gains point 7.

**ISSUE-09 = (a).** P2's out-of-scope status is stated as assumed, not verified: §2.1, §2.4 point
6, and §6.1.

**C-1 is approved,** and **E1-07c is added** to `TASKS.md`. It covers:

- deriving and recording the two matched thresholds;
- adding R2m and R3m to `e1_analyze.js`;
- rewording the output strings to the new readings;
- relabelling the recomputed comparisons "sensitivity (descriptive)";
- extending the synthetic tests.

## 6. Status

Checklist items 1–6 **pass**. Item 7 is **open** (ISSUE-10). ISSUE-09 and C-1 also need the
author's decision.

**Every option includes a small pre-freeze code change** (the C-1 labels at least), so a code task
(E1-07c) is proposed under every option. After it, E1-08 re-checks items 5 and 7 and the changed
code before E1-09.

**Update after the decisions:**

- Items 5 and 7 now rest on text that has been applied, and on code still to be written in E1-07c.
- **E1-08 closes after E1-07c, with a re-check** (§7).

## 7. Re-check after E1-07c (2026-09-30), and close

**What was re-read:**

- the protocol sections changed by D11 and E1-07c: §2.1, §2.3, §2.4, §6.1, §6.2, §6.4, §6.5,
  §6.6 and §6.7;
- `e1_analyze.js` at commit `4829d57`: every `reading`, `label` and `secondary` site, and the
  matched section.

**Item 5 (multiplicity and labels): pass.**

- There is one primary comparison (D10 = a), with the reworded reading.
- The P2 Holm family is still exactly the three pairs. The matched pair is kept out of it and
  labelled "unadjusted; secondary" (E1-07c test T11).
- The recomputed R2 − R3 comparisons carry "sensitivity (descriptive); not a primary result" and an
  `interval_position` with no reading. No "lead holds" wording remains in any output (T12).
- **Protocol text aligned (T-8):** §6.5 points 2 and 6 now say these are labelled sensitivity.
- **Residual, cosmetic, not fixed:** in `summary.json` the sensitivity objects are still stored
  under the key `primary_comparison`, inside `sensitivity_without_S.*` and
  `lexical_null.overlap_subset`. Their `label` field is authoritative, and `summary.md` prints the
  label. Renaming the key would be a code change needing a re-test, for no gain in content. It is
  left as it is, and noted here.

**Item 7 (no rule favoured by construction): pass.**

- **The confound is now stated wherever a reading is made:**
  - the primary reading names the operating points and the 20 vs 11 false rejections (§6.4, and
    the code's `reading`);
  - §2.4 point 7 says E1 cannot rank the rules overall;
  - ED-2 is stated on the matched comparison.
- **A comparison at equal cost now exists,** with thresholds set from v0.2's in-scope queries only.
  So it does not depend on the screened set it is meant to test. The code re-derives the
  thresholds on every run.
- **Protocol text aligned (T-7):** §2.3 point 2 and the §6.4 lead sentence.
- **Residual asymmetries, disclosed and accepted:**
  1. **The matched costs differ by one query** (10 vs 11 in-scope rejections), because of a tie at
     5.4377. This makes R3m marginally more aggressive, which favours R3m slightly. It is recorded
     in §6.4.
  2. **Queries with no tokens:** R1, R1-CLI and R2 reject them, while R3 may accept them. This is
     each system's own behaviour, and it is reported separately (§6.5 point 5).

**Consistency of T-1 to T-8 and the D11 text:** no remaining sentence contradicts:

- Rule A;
- the P2 assumption;
- the reworded readings;
- the matched specification.

(Checked by searching for "apart from", "lead", "advantage", "recomputed" and "every query".)

**Final checklist:**

| # | Item | Verdict |
|---|---|---|
| 1 | No threshold tuned on E1 data | pass |
| 2 | Class-level exclusions decided without scores | pass |
| 3 | No outcome viewed | pass (re-confirmed: `research/results/e1_clinc150_v1/` still does not exist) |
| 4 | General-domain stated | pass |
| 5 | Multiplicity handled or labelled | pass |
| 6 | Denominators right | pass |
| 7 | No rule favoured by construction | pass (with the disclosed residuals) |

**E1-08 is closed.** The protocol is ready for the freeze, which needs the author's explicit
approval (E1-09, D6).
