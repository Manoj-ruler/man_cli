# E1 data provenance (CLINC150), written by `research/experiments/e1_prepare_data.js`

Generated 2026-09-30T14:36:42.532Z, under the frozen protocol `e1-protocol-v1` (§3, §6.1, §6.7). No scoring was done. The query text is copied unchanged, and no query was read or printed during preparation.

## Source (committed copy; nothing was downloaded in E1-10)

Larson et al. (2019), *An Evaluation Dataset for Intent Classification and Out-of-Scope Prediction*, EMNLP-IJCNLP, https://doi.org/10.18653/v1/D19-1131. Licence: CC BY 3.0. Upstream: `clinc/oos-eval` at commit `828f809`. See `research/data_external/clinc150/PROVENANCE.md`.

| File | SHA-256 (raw bytes) | Matches PROVENANCE.md |
|---|---|---|
| `research/data_external/clinc150/data_full.json` | `36923c3705a59e08fe9c3883d8bc2dd966ef93e22cb78ac41171782a698d56e0` | yes |
| `research/data_external/clinc150/domains.json` | `b947b579d3b8e74b06f93b01083d8efaff2888b43a3e362533bd88a6e1211b3a` | yes |

## Rules applied (frozen)

- **P1 = `test`**, with id `test:<i>` (the 0-based index into `data_full.json` `test`), plus `intent`, `domain` (the `domains.json` key) and `subgroup`.
- **Rule A excludes no intent**, so no row was excluded.
- **Subgroup S** (descriptive, not excluded): S-clear = date, calculator, measurement_conversion, flip_coin, roll_dice, timer; S-borderline = time, timezone, alarm, reminder_update, weather, exchange_rate, current_location. Every other intent has `subgroup: null`.
- **P2 = `oos_test`**, kept whole, with id `oos_test:<i>`. Every row is labelled `oos` in the source.
- **The domain map** comes from `domains.json`. Its 10 pairs in the CLINC paper's Table 1 were checked in E1-03; the full supplementary list was not.

## Reconciliation

| Check | Value | Expected |
|---|---|---|
| P1 rows = source test rows - excluded | 4500 | 4500 |
| P1 rows | 4500 | 4500 |
| P2 rows = source oos_test rows | 1000 | 1000 |
| P2 rows | 1000 | 1000 |
| excluded rows (Rule A) | 0 | 0 |
| P1 intents | 150 | 150 |
| every intent has 30 queries | true | true |
| every intent has a domain | true | true |
| domains | 10 | 10 |
| every domain has 450 queries | true | true |
| all 13 S intents present | true | true |
| S-clear rows | 180 | 180 |
| S-borderline rows | 210 | 210 |
| P1 without S-clear | 4320 | 4320 |
| P1 without S-clear and S-borderline | 4110 | 4110 |
| unique ids | 5500 | 5500 |
| text copied unchanged (P1) | true | true |
| text copied unchanged (P2) | true | true |

| Domain | P1 queries | Intents | S-clear intents | S-borderline intents |
|---|---|---|---|---|
| auto_and_commute | 450 | 15 | 0 | 1 |
| banking | 450 | 15 | 0 | 0 |
| credit_cards | 450 | 15 | 0 | 0 |
| home | 450 | 15 | 0 | 1 |
| kitchen_and_dining | 450 | 15 | 0 | 0 |
| meta | 450 | 15 | 0 | 0 |
| small_talk | 450 | 15 | 0 | 0 |
| travel | 450 | 15 | 0 | 2 |
| utility | 450 | 15 | 6 | 3 |
| work | 450 | 15 | 0 | 0 |

Per intent: all 150 intents have exactly 30 queries.

## Output files

| File | Rows | SHA-256 (as written, LF) |
|---|---|---|
| `p1_queries.json` | 4500 | `5d047d2681327fb02bf87147e2553070cfb2e85f861e0334a9aac6bfa67e47d2` |
| `p2_queries.json` | 1000 | `d6f0c207c0079e6db23f63d65d2e5f5107a10a8eeed54998c04f234a12e7c344` |
