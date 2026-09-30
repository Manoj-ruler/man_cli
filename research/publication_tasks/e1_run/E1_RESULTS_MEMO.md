# E1 results memo: external out-of-scope check on CLINC150

**Status: APPROVED by the author on 2026-09-30 ("approve memo")** (E1-14). **No paper text has been
changed.** The follow-ups in §7 are not approved or started.

**Sources:**

- `research/results/e1_clinc150_v1/summary.json`, written by the frozen analysis on 2026-09-30.
  Cited below as `S:` followed by a JSON path.
- The protocol, frozen at git tag `e1-protocol-v1`.
- Deviations: none (`DEVIATIONS.md`).

**Labels:**

- **Protocol** means the statement is pre-specified in protocol §6 and read with its pre-stated
  reading.
- **Post hoc** means it is my interpretation after seeing the results.

## 1. Summary

1. **The shipped fixed rule R1 rejects about a quarter or less of external out-of-scope
   requests** (protocol).
   - P1: 25.3% [21.8, 29.0] (`S: P1.rates.R1`). P2: 19.1% [16.8, 21.7] (`S: P2.rates.R1`).
   - It rejects exactly the queries that share no word with the corpus: it rejects 0 of the 3,361
     P1 queries and 0 of the 809 P2 queries that share any word (`S: P*.lexical_null`).
   - The CLI's 30% rule (R1-CLI) adds only 10 and 7 queries (`S: P*.r1_vs_r1_cli`).
2. **Primary comparison (protocol): R2 − R3 on P1 = +0.0827 [0.0502, 0.1164]**
   (`S: P1.primary_comparison`).
   - The tuned shipped threshold rejects 86.0% and the hybrid detector 77.8%.
   - P2 replicates the sign: +0.053, Holm p = 0.0012 (`S: P2.secondary_p2[0]`).
   - **Pre-stated reading:** R2 rejects more at the v0.2 operating points. Those points carry more
     v0.2 false rejections (20 vs 11 of 134), so this does not by itself show that R2 is the
     better rule.
3. **Matched comparison at equal v0.2 cost (protocol, secondary): R2m − R3m = −0.1251 [−0.1618,
   −0.0887] on P1, and −0.173 on P2 (exact McNemar p = 5.8e-19)** (`S: P*.matched_operating_point`).
   - **Pre-stated reading:** at equal v0.2 cost, the **fused** score rejects more external
     out-of-scope requests than the shipped score.
   - The rates are 64.6% vs 77.1% (P1) and 59.7% vs 77.0% (P2).
4. **The expected directions** are covered in §3:
   - ED-1 (screening): the predicted pattern was observed;
   - **ED-2 (shipped score at least as good at equal cost): contradicted;**
   - ED-3: the floor holds;
   - **ED-4 (subgroup S rejected less): contradicted;**
   - ED-5: no direction was stated.

## 2. Answers to the protocol's questions (§2.3)

**Q1. How do the rejection rates compare with v0.2's?** (Protocol, descriptive; different
populations, no test; `S: P1.v0_2_comparison.rules`.)

| Rule | E1, P1 | E1, P2 | v0.2, all 50 | v0.2, 15 unscreened | v0.2 false rejections |
|---|---|---|---|---|---|
| R1 | 25.3% | 19.1% | 34% (17) | 26.7% (4) | 0/134 |
| R2 | 86.0% | 83.4% | 92% (46) | 80% (12) | 20/134 |
| R3 | 77.8% | 78.1% | 68% (34) | 60% (9) | 11/134 |

- R2's external rate is **below** its v0.2 rate on all 50 (−6.0 points).
- **R3's external rate is above both v0.2 figures:** +9.8 points against all 50, and +17.8 against
  the 15 unscreened.

**Q2. At their v0.2 operating points, does R2 still reject more than R3 on unscreened requests?**
**Yes, but by less.**

- The difference is +8.3 points [5.0, 11.6] on P1 and +5.3 on P2, against 24 points on v0.2's 50
  and 20 on its 15 unscreened queries.
- **At equal v0.2 cost, the ordering reverses** (point 3 above).

**Q3. What is the rank order?**

- **R2 > R3 > R1-CLI ≥ R1** on both populations, at the v0.2 operating points
  (`S: P*.rates`).
- Per domain, R2 − R3 ranges from +1.1 points (`meta`) to +22.5 (`work`) (`S:
  P1_extras.per_domain`, descriptive).

## 3. Expected directions (written before the run, §6.6) against the results

| ED | Stated before the run | Observed | Verdict |
|---|---|---|---|
| **ED-1** | If the screening inflated R2: R2 < 92% on P1 and P2, and R2 − R3 < 24 points | R2 86.0% [83.0, 88.8] and 83.4% [81.0, 85.6]; R2 − R3 +8.3 [5.0, 11.6] and +5.3 | **The predicted pattern was observed.** It is *consistent with* the screening having inflated v0.2's R2 figures, but it **does not prove it**: CLINC also differs from v0.2 in population (see §4). |
| **ED-2** | If the shipped score separates out-of-scope requests at least as well as the fused score: R2m − R3m not below 0 | −0.1251 [−0.1618, −0.0887] (P1); −0.173 (P2) | **Contradicted on both populations.** On external requests at equal v0.2 cost, the fused score rejects more. |
| **ED-3** | A floor: every rule's rate is at least the lexical-null share, and the rules differ only on the overlap subset | Lexical-null share 25.3% (P1) and 19.1% (P2); every rule is at or above it. On the overlap subset, R2 − R3 is +0.1107 [0.0678, 0.1546] (P1, sensitivity) | **It holds** (by construction). The share is modest, so the overall rates are informative. R1's entire rejection comes from the lexical-null queries. |
| **ED-4** | Subgroup S-clear is rejected **less** than the rest of P1, for every rule | S-clear (180 queries, 6 intents): R1 41.7%, R2 87.8%, R3 80.6%. Rest of P1 (without S-clear): R1 24.6%, R2 86.0%, R3 77.6% (`S: P1_extras`) | **Contradicted.** S-clear is rejected **more** by every rule. This is descriptive: 6 intents, with no interval. |
| ED-5 | P1 vs P2: no direction stated | The signs agree for every comparison: primary +, matched −. P2's matched gap is larger. | Nothing was stated in advance. |

**Subgroup-S sensitivity (protocol, descriptive).** R2 − R3 hardly moves when S is removed:

- without S-clear: +0.0831 [0.0488, 0.1174];
- without S-clear and S-borderline: +0.0752 [0.0423, 0.1090] (`S: P1_extras.sensitivity_without_S`).

## 4. What E1 does **not** show (§2.4, restated with the results)

1. **Anything about terminal-task out-of-scope requests.** CLINC requests are general-domain
   (banking, travel, small talk, …). Only 10 of the paper's 50 are terminal tasks.
2. **The cost in refused legitimate queries.** E1 has no in-scope queries, so every rate here is
   the "good" side only. **R2's higher rejection comes with 20 v0.2 false rejections of 134, and
   R3's with 11.** The matched comparison is the only E1 result that holds cost fixed, and it holds
   it only at the v0.2 in-sample level.
3. **Whether screening, rather than population, explains ED-1.** CLINC differs from v0.2's
   out-of-scope set in who wrote the requests, for which assistant, and on which topics. E1 cannot
   separate the two explanations.
4. **P2's correctness as ground truth.** P2 is assumed out of scope for this corpus; it was not
   checked query by query (§2.4 point 6). P1 was checked at class level.
5. **Exact cost matching.** The matched thresholds reject 10 (shipped) vs 11 (fused) of v0.2's 159
   in-scope queries, because of a tie at 5.4377. That leaves R3m marginally more aggressive.
   - The protocol does not quantify how much of the 12.5-point gap that difference could explain.
   - It is a single in-scope query out of 159, and the thresholds are in-sample on v0.2.
6. **Anything about benchmark v0.2.1,** real user traffic, or languages other than English.
7. **Calibration or accuracy.** E1 measures rejection only.

## 5. Implications for the paper (for INTEG-05; no edits made; the author decides)

**What E1 supports:**

- the paper's central point that **the shipped tool accepts most out-of-scope requests**. On
  external general-domain requests it rejects only 19–25%, compared with 34% on v0.2;
- the finding that **a tuned threshold on the shipped score rejects many more** than the fixed rule
  (86% and 83%) **at its v0.2 operating point.**

**What E1 does not support, and which needs attention.** Two current claims in §5
(`research/paper/acl_latex/content.tex`):

- line 258: "The shipped score itself separates out-of-scope requests better than the hybrid's
  fused score (pooled AUROC 0.956 vs. 0.889 on v0.2, …)";
- line 265: "The shipped score is never worse at the points we checked".

Both rest on v0.2, including the 35 queries checked for low scores. **At equal v0.2 cost on
unscreened external requests, E1 finds the opposite ordering on both populations.**

- The paper's own limitation, that screening favours the shipped score (Limitations; §5), is the
  threat E1 was designed to test. The matched result is **consistent with that threat being
  real**.
- A faithful update would:
  1. keep the v0.2 statements, but label them as benchmark-internal;
  2. report E1's primary and matched results, with the general-domain and P2 caveats;
  3. stop describing the shipped score as the better out-of-scope separator in general.

  The wording is for the author (INTEG-05), and it needs the claim trace updated.

**Where E1 fits the paper's framing** ("the three reliability problems had three different
remedies; a better retriever was not the remedy for out-of-scope requests"):

- The E1 **primary** result supports "a tuned threshold is the remedy", at its operating point.
- The **matched** result complicates "the shipped score separates better". It does not show that
  the hybrid is the better *system*; E1 measures rejection only. It does show that the fused score
  was a better out-of-scope *feature* at equal cost on external data.

## 6. Post hoc observations (not in the protocol; hypotheses only, untested)

- **Why might the fused score do better on CLINC?** A possible reason: many CLINC requests share
  some everyday word with a command description. That gives them a moderate BM25 score while
  staying semantically far from every command, and the dense component could register the
  distance.
  - The fact that R1 rejects nothing in the overlap subset fits this picture.
  - Which words drive the overlap was not examined. E1 does not test this.
- **Why might S-clear be rejected more?** Across P1, R1 rejects exactly the lexical-null queries:
  none of the overlap queries, and all of the lexical-null ones.
  - So **S-clear's lexical-null share equals its R1 rate, 41.7%**, against 24.6% for the rest of
    P1.
  - A possible reason is that these requests (dates, arithmetic, unit conversion, coins, dice,
    timers) share fewer words with the command descriptions than expected. This is untested, and
    their wording was not examined.
- **Where the gaps are:** the per-domain gap is largest in `work` (+22.5 points). This is
  descriptive only.

## 7. Possible follow-ups (each would need approval; none is started)

1. **A post hoc sensitivity check of the matched comparison at other cost levels** (m = 7 and 15,
   as in the paper's in-sample sweep). It would show whether the reversal depends on m = 11. It
   must be labelled post hoc.
2. **Terminal-task out-of-scope data** (the gap in §4 point 1). It would need a new, approved
   source.
3. **Carrying E1 into the paper:** INTEG-05, with the author's wording, and claim-trace entries for
   every E1 number.
