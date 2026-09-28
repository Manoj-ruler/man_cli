# T6 — Literature verification (2026-09-28)

Task T6 in `research/PLAN_TASKS.md`. Outputs:
- `acl_latex/references.bib`: Part 1 is cited; Part 2 has 22 new verified entries for T14.
- `related-work-matrix.csv`: 9 rows added, 6 malformed rows repaired.

**How each entry was checked.** Metadata was fetched from the primary record where one exists:
- ACL Anthology BibTeX, PMLR and NeurIPS proceedings pages;
- the arXiv API (title, authors, comment, journal-ref);
- Crossref, by DOI;
- or the authors' own PDF.

Nothing was typed from memory. Where no primary record was reachable, the entry says so in a comment in `references.bib`.

**Limits of this check.** It confirms the *bibliographic* facts. For the matrix rows, content summaries come from the **abstracts only**. Before T14 cites any paper for a specific claim, read the relevant section of the paper itself.

## 1. Existing entries (Part 1, cited in the paper)

All 8 re-checked. There were no errors in titles or authors. Additions and one discrepancy:

| Key | Source | Change |
|---|---|---|
| `lin-etal-2018-nl2bash` | ACL Anthology L18-1491 | Added address, publisher and URL. The Anthology gives no pages or DOI. |
| `agarwal2021nlc2cmd` | PMLR v133 | Added pages 302–324. |
| `westenfelder2025nl2sh` | ACL Anthology 2025.naacl-long.555, published PDF | Resolved the TODO: **NAACL 2025 main conference, Long Papers**, pp. 11135–11147, with DOI. **Discrepancy:** the Anthology metadata lists 5 authors and omits Miguel Tulla. The published PDF and arXiv list 6, and we follow the paper. |
| `card2020littlepower` | ACL Anthology 2020.emnlp-main.745 | Added pages and DOI. |
| `li2026quotebench`, `wang2026bm25wins`, `notaro2024commandrisk` | arXiv | Still preprints as of 2026-09-28. |
| `yu2026bashcoderr1` | arXiv comment "Accepted to ISSTA 2026" | No proceedings pages yet. Re-check before camera-ready. |

Rebuilt both PDFs: BibTeX gives 0 warnings, and the body still ends on page 7.

## 2. Targeted citations requested by the plan

| Plan item | Key | Verified against |
|---|---|---|
| Calibration: Guo et al. 2017 | `guo2017calibration` | PMLR v70, pp. 1321–1330 |
| Isotonic calibration: Zadrozny & Elkan 2002 | `zadrozny2002isotonic` | Crossref 10.1145/775047.775151 |
| Selective classification: Geifman & El-Yaniv 2017 | `geifman2017selective` | NeurIPS proceedings vol. 30 |
| Baseline OOD detection: Hendrycks & Gimpel 2017 | `hendrycks2017baseline` | arXiv journal-ref "ICLR 2017" |
| Selective QA under domain shift: Kamath et al. 2020 | `kamath-etal-2020-selective` | ACL Anthology 2020.acl-main.503 |

## 3. Methods the paper uses but never cited

These are gaps a reviewer would notice.

| Used for | Key | Verified against |
|---|---|---|
| BM25 | `robertson2009bm25` | ACM DL. **Discrepancy:** Crossref's current record for the same DOI says vol. 4(1–2), pp. 1–174 (an Emerald re-deposit). We use the original vol. 3(4), pp. 333–389. |
| Dense model (all-MiniLM-L6-v2) | `reimers-gurevych-2019-sentence`, `wang2020minilm` | ACL Anthology D19-1410; NeurIPS vol. 33 |
| ECE (equal-width bins) | `naeini2015ece` | Crossref (the record has no page range) |
| Brier score | `brier1950verification` | Crossref |
| Platt scaling (T4) | `platt2000probabilistic` | Editors, publisher and year from the reference list of Lin et al. 2007. **Pages 61–74 are secondary-sourced.** The book appeared in 2000, though it is often cited as 1999. |
| Histogram binning (T4) | `zadrozny2001binning` | Title and authors from the authors' PDF. **Pages 609–616 are secondary-sourced** (the ACM page returned 403). |
| AURC / E-AURC (T3) | `geifman2019aurc` | arXiv "Accepted to ICLR 2019"; OpenReview SJfb5jCqKm |
| McNemar, Holm, Wilson, Cohen's κ | `mcnemar1947note`, `holm1979simple`, `wilson1927probable`, `cohen1960coefficient` | Crossref; Holm via JSTOR 4615733, which has no DOI |

## 4. Fresh search: calibration or abstention in command and tool retrieval

**Queries:**
- confidence estimation and abstention for NL-to-bash;
- BM25 command retrieval with OOD rejection or abstention;
- selective prediction and risk-coverage for command assistants;
- abstention in text-to-SQL;
- out-of-scope rejection in intent classification.

**Nothing found that pre-empts the paper's scoped claim.** No paper found evaluates confidence calibration, OOD rejection and selective prediction for a closed-vocabulary NL-to-shell retrieval system. This agrees with the 2026-09-14 recheck (`PHASE14_LITERATURE_RECHECK.md`).

It is still a search result, not proof of absence. Phrase any novelty claim as "to our knowledge", and scope it to this setting.

**Relevant work found** (added to the matrix; the first five are also in `references.bib`):
- **Larson et al. 2019 (CLINC150), EMNLP-IJCNLP.** Closed-set intent classification with out-of-scope queries. Classifiers do well in scope but struggle to flag out-of-scope queries.
  - This is the closest *task framing* to TermAssist: a fixed set of answers, plus rejection. Cite it to justify treating OOD rejection as a first-class metric.
- **Kamath et al. 2020, ACL.** A trained calibrator decides when to abstain under domain shift.
  - This is the closest *method* precedent for the hybrid reliability score.
- **Dong, Quirk & Lapata 2018, ACL.** Confidence modeling for mapping language to programs, beating the posterior-probability baseline.
- **Stengel-Eskin & Van Durme 2023, TACL.** Calibration in semantic parsing.
  - **Only the metadata was checked; the paper was not read.** Don't cite it for specific findings until it has been read.
- **Somov & Tutubalina 2025, AAAI.** Selective classifiers for text-to-SQL. Per the abstract, they mostly catch irrelevant questions rather than incorrect SQL.
  - This is **a direct parallel to T2**: the detector's gains come from off-topic requests, not near-miss terminal tasks. Worth one sentence in the OOD discussion.
- **Richardson 2026, arXiv, single author.** Correctness prediction for text-to-SQL, with black-box AUROC of about 0.61–0.68.
  - A different task and difficulty, so it must **not** be compared with our 0.86/0.89. It is in the matrix only, not the bib.
- **Traub et al. 2024, NeurIPS.** "Overcoming Common Flaws in the Evaluation of Selective Classification Systems." They argue that AURC fails several requirements and propose AUGRC.
  - **This is a reviewer risk for T3**, whose headline selective-prediction result uses AURC. Options for T14:
    - (a) cite it and also report AUGRC; this is cheap, computed from the same tie-aware curve;
    - (b) cite it and justify AURC.
  - Not done here, because it is a new analysis and needs your go-ahead.

## 5. Matrix repairs

**Broken rows.** Six rows written before T6 had unquoted commas, giving 17–18 columns instead of 16, so any CSV reader misaligned them. They are now re-quoted, and all 25 lines have 16 columns.

**Content corrections** (source: arXiv abstracts):
- **NL2SH row:** the cell quoting LLM accuracy that "remains low" could not be verified (it had already been removed from the paper). It now reports the abstract's actual claims.
- **Incident-remediation row:** added the authors (Vo, Paulovicks, Sheinin), the arXiv id 2405.06807 and the 125-test-case size.
- **Notaro row:** the dataset sizes are not in the abstract, so they are now marked as not re-checked. The design contrast is restated more accurately: the paper argues *against* rule-based systems, which TermAssist uses.

## 6. What T14 should do with this

1. Cite at first use:
   - BM25 → `robertson2009bm25`
   - dense model → `reimers-gurevych-2019-sentence`, `wang2020minilm`
   - ECE → `naeini2015ece`, `guo2017calibration`
   - isotonic, Platt and binning → `zadrozny2002isotonic`, `platt2000probabilistic`, `zadrozny2001binning`
   - risk-coverage and AURC → `geifman2017selective`, `geifman2019aurc`
   - McNemar, Holm and Wilson → `mcnemar1947note`, `holm1979simple`, `wilson1927probable`
   - κ → `cohen1960coefficient`
2. Related work: add one sentence placing the task next to out-of-scope intent detection (`larson-etal-2019-evaluation`) and selective prediction under shift (`kamath-etal-2020-selective`, `dong-etal-2018-confidence`).
3. OOD discussion: note the parallel with `somov2025texttosql`.
4. Decide on AUGRC (`traub2024overcoming`).
5. **Watch the page budget:** about 20 new references will lengthen the reference list, which is outside the page limit. The in-text citations add a few lines to the body, which currently ends on page 7 of 8.
