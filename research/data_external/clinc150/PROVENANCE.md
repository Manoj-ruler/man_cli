# CLINC150 (third-party data): provenance and licence

These files are **unmodified copies** of data released with:

> Stefan Larson, Anish Mahendran, Joseph J. Peper, Christopher Clarke, Andrew Lee, Parker Hill,
> Jonathan K. Kummerfeld, Kevin Leach, Michael A. Laurenzano, Lingjia Tang and Jason Mars. 2019.
> *An Evaluation Dataset for Intent Classification and Out-of-Scope Prediction.* In Proceedings of
> EMNLP-IJCNLP 2019, pages 1311–1316. https://doi.org/10.18653/v1/D19-1131

- **Source:** https://github.com/clinc/oos-eval, pinned to commit
  `828f8093932c8fe6ca7936c3d2e52903b1c523de` (2021-06-01).
- **Retrieved:** 2026-09-30, from the pinned raw URLs below.
- **Licence:** Creative Commons Attribution 3.0 Unported (CC BY 3.0),
  https://creativecommons.org/licenses/by/3.0/. This is the licence text of the upstream `LICENSE`
  file. The GitHub API labels it "Other".
- **Attribution:** the paper is cited above and in the TermAssist paper's bibliography
  (`larson-etal-2019-evaluation`).
- **Changes made to these files:** none. Any subset or filtering used by an experiment is produced
  by a script, and documented with that experiment. For E1, see
  `research/publication_tasks/e1/`.

## Files

| File | Pinned source URL | Bytes | Git blob SHA-1 (= upstream) | SHA-256 |
|---|---|---|---|---|
| `data_full.json` | https://raw.githubusercontent.com/clinc/oos-eval/828f8093932c8fe6ca7936c3d2e52903b1c523de/data/data_full.json | 2,495,390 | `7a7b26c5f2dfbbf213f3e67d2dd0727e1af545aa` | `36923c3705a59e08fe9c3883d8bc2dd966ef93e22cb78ac41171782a698d56e0` |
| `domains.json` | https://raw.githubusercontent.com/clinc/oos-eval/828f8093932c8fe6ca7936c3d2e52903b1c523de/data/domains.json | 3,818 | `60a74358e52060e60b6128ae4efe679e9d6ba69c` | `b947b579d3b8e74b06f93b01083d8efaff2888b43a3e362533bd88a6e1211b3a` |

- **Integrity check (2026-09-30):**
  - Each file's size and git blob SHA-1 equal the values the GitHub API reports for commit 828f809
    (`repos/clinc/oos-eval/contents/data`). The downloaded bytes are therefore exactly the upstream
    files.
  - Both files use LF line endings. The `.gitattributes` in this folder (`* -text`) keeps them
    byte-exact in every checkout, so the SHA-256 values above hold.

## Structure (checked 2026-09-30)

`data_full.json` is an object of six splits. Each split is a list of `[text, label]` pairs.

| Split | Queries | Labels |
|---|---|---|
| `train` | 15,000 | 150 intents (100 each) |
| `val` | 3,000 | 150 intents (20 each) |
| `test` | 4,500 | 150 intents (30 each) |
| `oos_train` | 100 | "oos" |
| `oos_val` | 100 | "oos" |
| `oos_test` | 1,000 | "oos" |

These counts match the paper, §2.

**`domains.json`** maps the 150 intents to 10 domains:

- `banking`, `credit_cards`, `kitchen_and_dining`, `home`, `auto_and_commute`;
- `travel`, `utility`, `work`, `small_talk`, `meta`.

It covers exactly the 150 intents found in the data: none missing, none extra, none repeated.

**Caveat.** `domains.json` was added upstream in 2021 by a contributor pull request (#6), not by the
paper's authors. Its coverage is verified; whether each intent sits in the right domain should be
checked against the paper's supplementary material before any experiment relies on it.
