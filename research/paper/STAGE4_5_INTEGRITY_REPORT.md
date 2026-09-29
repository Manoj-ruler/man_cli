# Academic Integrity Verification Report — Stage 4.5 (Final Verification)

**Manuscript:** `research/paper/acl_latex/content.tex`. It was checked as of commit 17d74b7; the
fixes below are in commit bf194f0.

**Date:** 2026-09-29.

**Protocol:** ARS `integrity_verification_agent`, Mode 2 (final check), run fresh without reusing
earlier conclusions. T6 (2026-09-26/28) serves only as a supplementary comparison.

**Verifier:** the AI assistant (Claude). This is a machine check, and the author has not yet
reviewed it.

## Verdict

**PASS WITH NOTES, after one correction round.**

- Round 1 found 1 MEDIUM and 3 MINOR citation-context issues. All four were fixed in bf194f0, and
  the corrected sentences were re-checked against the primary texts.
- Nothing is SERIOUS, MAJOR_DISTORTION or UNVERIFIABLE.
- The notes are the tool limitations and the ARS contract artifacts that were not produced (last
  section).

## Verification summary

| Category | Total | Passed | Issues |
|----------|-------|--------|--------|
| Reference existence (A1) | 30 rendered | 30 VERIFIED | 0 NOT_FOUND, 0 MISMATCH |
| Bibliographic accuracy (A2) | 30 | 30 | 0 SERIOUS or MEDIUM. Known variants are explained below. |
| Ghost citations (A3) | — | — | 0 dangling. 3 bib entries are uncited and not rendered (`notaro2024commandrisk`, `stengel-eskin2023calibrated`, `wang2026bm25wins`); they do not appear in the PDF. |
| Citation context (B1) | 22 citing sentences (100%) | 18 at first check, 22 after the fixes | 1 MEDIUM and 3 MINOR, all fixed |
| Statistical data (C1/C2) | 475 numbers in 176 snippets | 475 | 0. `trace_claims.js`: "0 problem(s)" |
| Caption fidelity (C3) | Captions in `content.tex` | Covered by `trace_claims.js`. `table_sensitivity.tex` is generated from result files. | 0 |
| Originality (D1) | 16 of 28 prose paragraphs (57%), including the paragraphs revised in round 3 | 16 ORIGINAL | 0 CLOSE_MATCH, 0 VERBATIM |
| Self-plagiarism (D2) | Not applicable | — | The author has no prior publication on this work. The npm README describes the tool and is not reused as prose. |
| Claim verification (E) | Registered claims: every number, plus every citation-bearing sentence | All | See B1 and C. Tool-behaviour claims are also checked by `research/tests/` (23/23 pass). |

## Phase A — references

Each reference was checked on 2026-09-29 against at least one primary record:

- Crossref, by DOI;
- the arXiv API, by id;
- Semantic Scholar, by exact title;
- the official proceedings BibTeX (PMLR, NeurIPS).

Web search was used where no primary record exists. The script and its full output are
`research/paper/integrity/verify_refs.js` and `research/paper/integrity/refs_audit.json`; their per-reference content is summarised below.
DBLP was not used because it served a bot-check page to scripted requests, and we did not try to get
around that.

**Field differences found, all explained. None needs a change.**

- **`westenfelder2025nl2sh`:** Crossref lists 5 authors and omits Tulla. The published PDF, arXiv and
  S2 list 6, and the bib follows the paper, as recorded in the bib comment.
- **`yu2026bashcoderr1`:** the current arXiv title (v3) says "Bash Code Generation". The ISSTA 2026
  version of record says "Script", and the bib follows the version of record (bib comment, REV-12).
  S2 returns the authors in a scrambled order; arXiv matches the bib's order exactly.
- **`naeini2015ece`:** S2 splits the compound surname "Pakdaman Naeini", while Crossref matches the
  bib.
- **`traub2024overcoming`:** arXiv spells the name "Jaeger". The NeurIPS proceedings spell it "Jäger",
  as the bib does. Pages 2323–2347, vol. 37, are confirmed by the official NeurIPS BibTeX.
- **`platt2000probabilistic`:** S2 gives 1999. The book appeared in 2000, as recorded in the bib
  comment. Pages 61–74 are confirmed by web search (secondary source).
- **`zhang2022shellfusion`:** Crossref's title field holds only "ShellFusion". The full title is
  confirmed by S2 and IEEE Xplore 9794105.
- **ICLR entries (`geifman2019aurc`, `hendrycks2017baseline`, `zhou2023docprompting`):** the arXiv
  year is earlier than the conference year. The venues are confirmed by the arXiv comments ("Accepted
  to ICLR 2019", "Published as a conference paper at ICLR 2017", "ICLR 2023").
- **`wang2020minilm`:** pages 5776–5788, vol. 33, are confirmed by the official NeurIPS BibTeX.
- **`guo2017calibration`:** pages 1321–1330 are confirmed by the PMLR v70 page.
- **`agarwal2021nlc2cmd`:** pages 302–324 are confirmed by the PMLR v133 page.
- **`geifman2017selective`:** confirmed on the NeurIPS 30 proceedings page.
- **`holm1979simple`:** vol. 6, no. 2, pp. 65–70 and JSTOR 4615733 are confirmed by web search.
- **`zadrozny2001binning`:** ICML 2001, pp. 609–616, is confirmed by the ACM DL record
  10.5555/645530.655658 and by web search.

## Phase B — citation contexts (every citing sentence)

Specific claims about a source were re-read in the primary text:

- the full NLC2CMD report (arXiv 2103.02523);
- the DocPrompting paper (arXiv 2207.05987, §4.1);
- the ShellFusion abstract (ICSE 2022);
- the NL2SH abstract (ACL Anthology 2025.naacl-long.555);
- the abstracts of BashCoder-R1 (v3), QuoteBench and Somov & Tutubalina.

### Issues found and fixed (bf194f0)

| ID | Severity | Location | Issue | Fix | Source |
|----|----------|----------|-------|-----|--------|
| IL-MEDIUM-1 | MEDIUM | §2 Related Work | The paper said DocPrompting "retrieves documentation, including tldr pages". In its Bash setting the retrieved pool is "400k paragraphs from the 1,879 Bash manuals". tldr supplies the NL–Bash benchmark pairs, not the retrieved documentation (§4.1). | "retrieves documentation (for Bash, manual-page paragraphs) before generating code" | arXiv 2207.05987 §4.1 |
| IL-MINOR-1 | MINOR | §2 | The paper said ShellFusion "re-ranks [commands] against manual pages". ShellFusion *filters* candidates using manual-page and TLDR descriptions, then ranks them by similarity to the query and the retrieved posts. | "filters them with manual-page and TLDR descriptions, and ranks them against the query" | ShellFusion abstract (IEEE 9794105) |
| IL-MINOR-2 | MINOR | §2 | NL2SH was described as using "parsing and constrained decoding"; the abstract names four techniques. | Parsing, in-context and in-weight learning, and constrained decoding | ACL Anthology 2025.naacl-long.555 |
| IL-MINOR-3 | MINOR | §1 | "Retrieval over a fixed command list … ShellFusion developed". ShellFusion retrieves from Q&A posts, not from a fixed list. | "Retrieving commands instead of generating them is an older alternative, tested in NLC2CMD and developed in ShellFusion. Retrieval over a fixed command list cannot invent a command…" | As IL-MINOR-1 |

### Verified without change

- **NLC2CMD metric:** precision and recall of utility and flags, "weighted by the algorithm's
  reported confidence"; wrong answers score negative.
- **NLC2CMD TF-IDF entry:** AINixCLAISimple used TF-IDF with a logistic-regression confidence
  adjuster and scored 0.472, which "comes within 12% of the best performing model" (Magnum, 0.532).
- **BashCoder-R1:** the reward is syntax correctness, shellcheck robustness and format adherence, so
  "static-analysis rewards" holds.
- **QuoteBench:** "Matched execution scores alone cannot distinguish command-generation errors from
  failures introduced after generation".
- **Somov & Tutubalina:** the selective classifier "detects errors associated with irrelevant
  questions rather than incorrect query generations".
- **NL2Bash, CLAI, and the method and statistics citations** (calibration, recalibration, selective
  classification, OOD, McNemar, Wilson, Holm, Cohen, Brier, card2020): each is cited for the method
  or finding it introduced.

## Tool limitation disclaimer

Phase D compared sentences by exact-phrase web search. That is a heuristic, not
Turnitin/iThenticate, and covers only publicly indexed text. Run a professional similarity check
before submission if the venue provides one.

## Contract artifacts not produced

This project does not use the ARS Material Passport or its sidecar files. The following were
therefore not produced:

- the `claim-registry/1.0` coverage sidecar (E1.1);
- the persisted `evidence_rows[]` (#656);
- the passport-level C4 `experiment_intake_declaration`.

Per the ARS rules this is recorded as **E1-COVERAGE-UNRESOLVED (contract form)** and not presented as
zero. The substance they cover is handled here as follows:

- **Claim registry:** `trace_claims.js`, which registers every number with its source file and field
  (`research/paper/CLAIMS_TRACE.md`).
- **Experiment provenance:** the analysis freeze (`research/ANALYSIS_FREEZE_v1.0.md`; inputs
  verified 27/27 unchanged by `verify_freeze_inputs.js`) and `research/REPRODUCE.md`.

Whether a claim written in words is registered cannot be detected mechanically; it rests on the
round-3 review and on this report's full pass over the citing sentences.

## When to rerun

Rerun this check (Mode 2) after the annotation study updates the paper with κ and v0.2.1. Every
changed paragraph then gets 100% of Phase B, D and E.
