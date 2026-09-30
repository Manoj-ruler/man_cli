# E1-01: CLINC150 source, access and licence

**Checked:** 2026-09-30, by Claude, from primary records; the evidence for each item is given.

**Update, 2026-09-30.** With the author's approval (D5), both requested files were downloaded from
the pinned commit and committed to `research/data_external/clinc150/`.

- Their sizes and git blob SHAs equal the upstream values in §3.
- Their SHA-256 values, structure and attribution are in `research/data_external/clinc150/PROVENANCE.md`.
- The structure matches the paper: train/val/test = 15,000 / 3,000 / 4,500 over 150 intents, and
  oos_train/val/test = 100 / 100 / 1,000.
- `domains.json` covers exactly the 150 intents.
- **No scoring has been done** (gate G-E1).

## 1. The paper (already cited as `larson-etal-2019-evaluation`)

| Field | Value | Evidence |
|---|---|---|
| Title | An Evaluation Dataset for Intent Classification and Out-of-Scope Prediction | ACL Anthology page https://aclanthology.org/D19-1131/ |
| Authors | Larson, Mahendran, Peper, Clarke, Lee, Hill, Kummerfeld, Leach, Laurenzano, Tang, Mars (11) | same page. It matches `references.bib`, and was verified in Stage 4.5 on 2026-09-29. |
| Venue / pages / DOI | EMNLP-IJCNLP 2019, pp. 1311–1316, 10.18653/v1/D19-1131 | same page |
| Data location stated by the paper | "All data introduced in this paper can be found at https://github.com/clinc/oos-eval" | paper PDF, §1 (text extracted from https://aclanthology.org/D19-1131.pdf) |

## 2. The dataset, as the paper defines it

The following are quoted or closely paraphrased from the paper's §2 and §3.

- **Totals:** 23,700 queries: 22,500 in-scope, covering 150 intents in 10 general domains, plus 1,200
  out-of-scope.
- **In-scope, per intent (Full):** 100 train, 20 validation and 30 test queries. That makes 150 × 150
  = 22,500 in total, including **4,500 in-scope test queries**.
- **Out-of-scope (Full):** of the 1,200 collected, 100 are for training, 100 for validation and
  **1,000 for testing**.
- **Variants:**
  - **Full.**
  - **Small:** 50 training queries per intent instead of 100.
  - **Imbalanced:** intents have 25, 50, 75 or 100 training queries.
  - **OOS+:** 250 out-of-scope training examples instead of 100.
  - Per the paper, the variants differ only in their **training** data. Their validation and test
    sets are not described as different; this is not verified yet.
- **How the out-of-scope queries were collected:**
  - **Worker mistakes:** queries written for one of the 150 intents that did not match any intent.
  - **Scoping and scenario crowdsourcing tasks** with prompts "based on topic areas found on Quora,
    Wikipedia, and elsewhere", with at most four queries per prompt.
  - The paper notes that only about 69% of the queries collected with out-of-scope prompts turned
    out to be out-of-scope.
- **Preprocessing:** "all tokens were downcased, and all end-of-sentence punctuation was removed";
  duplicates were removed and replaced. Queries from one crowd worker were kept within one split.

## 3. The official release

| Field | Value | Evidence |
|---|---|---|
| Repository | `clinc/oos-eval` (not archived), default branch `master` | GitHub API `repos/clinc/oos-eval` |
| Latest commit (pin) | `828f8093932c8fe6ca7936c3d2e52903b1c523de`, 2021-06-01, "Merge pull request #6 from epeters3/domain-mapping" | GitHub API `commits/master` |
| Licence | **Creative Commons Attribution 3.0 Unported (CC BY 3.0).** The GitHub API reports "Other / NOASSERTION"; the LICENSE file's own text is CC BY 3.0 Unported. | https://raw.githubusercontent.com/clinc/oos-eval/master/LICENSE |
| Licence conditions relevant to E1 | Research and commercial use permitted; **attribution required** (cite the paper); adaptations allowed if changes are identified (so the E1 exclusions must be documented); no share-alike | the LICENSE text |

**Files in `data/`** (GitHub API `contents/data`):

| File | Size (bytes) | Git blob SHA | Role |
|---|---|---|---|
| `data_full.json` | 2,495,390 | 7a7b26c5f2dfbbf213f3e67d2dd0727e1af545aa | **Full variant** (paper Table 1). Candidate for E1. |
| `data_small.json` | 1,702,451 | 147a72a1c60468ec9197b7d3153aee720490a0e3 | Small variant (less training data) |
| `data_imbalanced.json` | 2,016,773 | cf8a304cf323a8ae858e33b5ac1cdcba2736678c | Imbalanced variant |
| `data_oos_plus.json` | 2,509,789 | 35f422a52317d413b366d7a4dd8fbf6e56aca826 | OOS+ variant (more out-of-scope training data) |
| `domains.json` | 3,818 | 60a74358e52060e60b6128ae4efe679e9d6ba69c | Intent-to-domain map. **Added in 2021 by a contributor pull request (#6), not by the paper's authors.** Cross-check it against the paper's supplementary list before using it. |
| `binary_undersample.json` | 926,712 | 20d997440f6ce33e292d0a27da153c009b727125 | the paper's oos-binary experiments; not needed |
| `binary_wiki_aug.json` | 3,788,866 | 369ceaf7ec765e58204e7dc038c53904a094cbf6 | the paper's Wikipedia augmentation; not needed |
| `all_wiki_sents.txt` | 750,542 | ca34aa619f4cb055928a176cc9ab615b5fd399a9 | the paper's Wikipedia sentences; not needed |

- **The JSON keys** (verified after the download): `train`, `val`, `test`, `oos_train`, `oos_val` and
  `oos_test`. Each is a list of `[text, label]` pairs.
- **A mirror exists** (Hugging Face `clinc_oos`), but the **official source is the GitHub repository**
  above. E1 should use the pinned commit.

## 4. Observations for E1-02 and E1-03 (not decisions)

1. **"Out-of-scope" in CLINC150 is relative to CLINC's 150 intents, not to a shell tool.**
   - For a Windows command retriever, **most CLINC in-scope queries are also out of scope** (banking,
     travel, cooking, …).
   - A few intent classes may have legitimate shell answers: plausibly some in the "utility" domain,
     such as the time or date. That must be decided at class level in E1-03, from intent names and
     example queries only.
2. **The `oos` split has no class structure.** A class-level exclusion rule cannot remove individual
   `oos` queries that happen to have a shell answer. E1-02 and E1-03 must decide how to treat the
   `oos` split: keep it whole with a stated limitation, or not use it.
3. **Neither split was screened by any retriever in this project.** That is the property E1 exists
   to provide. CLINC's out-of-scope queries were written by crowd workers against CLINC's intents,
   and never against this corpus.
4. **Everything is lowercased and has no final punctuation.** The shipped tokenizer lowercases and
   strips punctuation anyway (`cli/search.js`), so this should not matter. E1-05 will confirm.

## 5. Download request (decision D5, for the author)

Nothing has been downloaded. The request:

| File | Source (pinned to commit 828f809) | Size | Why |
|---|---|---|---|
| `data_full.json` | https://raw.githubusercontent.com/clinc/oos-eval/828f8093932c8fe6ca7936c3d2e52903b1c523de/data/data_full.json | 2,495,390 bytes (about 2.4 MB) | The E1 data (Full variant: 4,500 in-scope and 1,000 out-of-scope test queries, plus the train and validation splits) |
| `domains.json` | https://raw.githubusercontent.com/clinc/oos-eval/828f8093932c8fe6ca7936c3d2e52903b1c523de/data/domains.json | 3,818 bytes | The intent-to-domain map for class-level exclusions in E1-03 (a contributor file; to be cross-checked) |

- **Where they would go:** a new directory, `research/data_external/clinc150/`, with a provenance
  note, the SHA-256 of each file, and a copy of the CC BY 3.0 notice.
- **Before any E1-03 work:** the author decides whether the data files are committed to the
  repository or kept out of it and fetched by script. CC BY 3.0 allows redistribution with
  attribution.
- **Not running E1:** downloading reads the data only. No scoring or E1 outcome is produced before
  the protocol freeze (gate G-E1). Looking at intent names and example queries for E1-03 is allowed
  by the plan; looking at system outputs is not.
