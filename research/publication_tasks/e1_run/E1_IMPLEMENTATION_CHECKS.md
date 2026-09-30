# E1-12: implementation checks

**Run:** 2026-09-30, on the E1-11 outputs committed at `63d71af`.

**Scope:** scoring and decision correctness only.

- **No rejection rate, count of rejections or comparison was computed or read.**
- Check 5 shows per-query scores for 20 randomly drawn rows. It shows no decisions.

**Script:** `research/experiments/e1_implementation_checks.js`. It is new, not frozen, and reads only
the committed outputs.

- The raw logs are in the session scratchpad: `e1_12_checks.json` and `e1_12_rerun_compare.json`.

This file lives in `publication_tasks/e1_run/` rather than `e1/`. Any new file in `e1/` would make
the frozen check `git diff --exit-code e1-protocol-v1 -- research/publication_tasks/e1 …` report a
difference, even though no frozen file changed.

## Results: 17 of 17 checks pass

| # | Check | P1 | P2 |
|---|---|---|---|
| 1 | Row counts: data, scores and decisions each have n rows, and the ids correspond one-to-one in the same order | 4,500 ✓ | 1,000 ✓ |
| 2 | No NaN, missing or ill-typed field among `s`, `s4`, `confidence`, `fused`, `fused4`, `n_tokens`, `lexical_top1_score`, `dense_top1`, `lexical_all_equal`, `bonus_fired` and `command_hybrid`; `command_shipped` is null exactly when the query has no tokens | 0 bad ✓ | 0 bad ✓ |
| 3a | **Fresh call of the frozen `cli/search.js` `search()` on every query:** s is bit-identical, and the confidence and the command are equal | 0 / 4,500 mismatches ✓ | 0 / 1,000 ✓ |
| 3b | `s4` and `fused4` equal `+x.toFixed(4)` of the stored unrounded `s` and `fused` | 0 mismatches ✓ | 0 ✓ |
| 3c | The stored decisions equal an **independent** re-application of protocol §6.2 (re-written in the check script, not imported): R1, R1-CLI, R2 and R3 (median and all five folds), R2m and R3m | 0 mismatches ✓ | 0 ✓ |
| 4 | **Deterministic re-run** into the scratchpad: the scorer on P1 and P2, then `e1_analyze.js --stage decisions` | see below | see below |
| 5 | **Spot check of 20 rows** (fixed seed 20260930, drawn over all 5,500 ids): s recomputed by an **independent BM25 implementation** written from the formula, and the fused score recomputed by **independent min-max fusion** over that list and the frozen dense module's cosines (tolerance 1e-9) | 20 of 20 within tolerance; largest difference 1.8e-15 on s and 1.1e-16 on the fused score | (included) |

**The check-4 details** (all pass):

- **Byte-identical:** `decisions_p1.json` and `decisions_p2.json`.
- **Identical apart from timestamps:** `scores_p1.json`, `scores_p2.json` and `logical_checks.json`.
- **`RUN_MANIFEST.json`:** identical apart from:
  - the timestamps;
  - the commit, which was HEAD at re-run time;
  - the hashes of the re-run's own score files, which differ only through their timestamps.

**The pre-flight** passed on every scorer call (platform, the three input hashes, the model cache,
α). The model cache was also checked separately before the spot check.

## Check 5: the spot-check rows

The differences are between the independent recomputation and the stored value. The largest,
1.8e-15, is floating-point summation order, far inside 1e-9.

| id | tokens | abs. diff, s | abs. diff, fused |
|---|---|---|---|
| test:3921 | 5 | 1.8e-15 | 0 |
| oos_test:466 | 6 | 8.9e-16 | 1.1e-16 |
| oos_test:430 | 8 | 8.9e-16 | 0 |
| oos_test:9 | 11 | 0 | 0 |
| test:1172 | 5 | 8.9e-16 | 0 |
| oos_test:833 | 9 | 8.9e-16 | 1.1e-16 |
| oos_test:414 | 4 | 0 | 0 |
| test:879 | 2 | 8.9e-16 | 0 |
| test:1687 | 8 | 8.9e-16 | 0 |
| test:4476 | 7 | 0 | 0 |
| test:3918 | 7 | 8.9e-16 | 0 |
| test:4279 | 6 | 0 | 0 |
| oos_test:645 | 5 | 0 | 0 |
| test:1415 | 7 | 0 | 0 |
| test:828 | 5 | 0 | 0 |
| test:3492 | 4 | 8.9e-16 | 1.1e-16 |
| test:4228 | 4 | 8.9e-16 | 0 |
| test:2889 | 2 | 0 | 0 |
| test:1355 | 7 | 0 | 0 |
| test:2408 | 6 | 0 | 0 |

**The sample covers the special cases.** 4 of the 20 rows (oos_test:414, test:4476, test:1415 and
test:2889) have s = 0 and fused = 0.5 exactly. These are lexical-null rows, and the independent
fusion reproduced the E1-05 zero-overlap property on them.

### Worked example, verified by hand: `test:3921`

- The index has N = 280 records (279 corpus + 1 snippet), with avgdl = 11.014286.
- The top record gets no substring bonus. Its matching query tokens are:
  - **put**: tf 2, df 1. IDF = ln(1 + (280 − 1 + 0.5)/(1 + 0.5)) = ln(187.333) = **5.232890**.
    Contribution **7.386533**.
  - **request**: tf 2, df 6. IDF = ln(1 + 274.5/6.5) = ln(43.231) = **3.766552**. Contribution
    **5.316711**.
- **The sum is 12.703244, which equals the stored s = 12.703244381820207.**

## Verdict

**All implementation checks pass.** There is no failure and no new issue; nothing was changed by
hand. The frozen set is still unchanged: `git diff --exit-code e1-protocol-v1 -- …` gives exit 0.

**E1-13 may compute the summary.**
