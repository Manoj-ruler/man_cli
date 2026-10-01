# FINAL-03: scoped rerun of the Stage 4.5 integrity check (2026-10-01)

**Baseline:** `STAGE4_5_INTEGRITY_REPORT.md`, at commit `607525a` (2026-09-29).

**Scope:** every passage of `content.tex` changed since that commit (33 diff hunks), and every
cited reference.

- The changes come from PAPER-01 to 08, INTEG-03 to 07, INTEG-06 and LIT-01.
- `references.bib` gained one entry, `vo2024execution`.

## 1. References (`research/paper/integrity/verify_refs.js`, fresh run)

- **31 cited keys checked** against primary records: Crossref by DOI, the arXiv API by id, and
  Semantic Scholar by exact title. Written to `refs_audit.json`; `checked_at` 2026-10-01.
- **31/31 found. 0 regressions** against the baseline audit (30 keys).
  - The differences are additional sources that answered this time, plus the new key.
- **`vo2024execution` (new):** arXiv title, authors and year all match; S2 title, authors and year
  all match.
- **The remaining partial flags are the ones already adjudicated in the baseline report**
  (§ lines 54–67):
  - `westenfelder2025nl2sh`: Crossref omits one author;
  - `yu2026bashcoderr1`: the arXiv v3 title differs from the venue title;
  - `naeini2015ece`: S2 splits the compound surname;
  - `traub2024overcoming`: Jaeger vs Jäger;
  - `platt2000probabilistic`: S2 gives 1999 for the 2000 book;
  - `zhang2022shellfusion`: Crossref's title field is truncated;
  - the ICLR entries `geifman2019aurc`, `hendrycks2017baseline` and `zhou2023docprompting`: the
    arXiv year vs the conference year.

## 2. Changed passages (100% checked)

| Passage (changed by) | Claim type | Check | Result |
|---|---|---|---|
| Abstract (PAPER-08, INTEG-07) | Numbers; the external-check sentence; "AI-assigned labels"; "Other analyses are exploratory" | Trace entries (Abstract); `summary.json` P1; freeze §6 (34/50 AI-assigned kinds) | pass |
| §1 Contributions (PAPER-02, 05) | "largely corrects"; 86% (v0.1); the release statement; "established measures" | Trace; freeze §2; design statement | pass |
| §2 related work (PAPER-02, LIT-01) | The novelty scope; the `vo2024execution` clause | LIT-01 record (25 PowerShell cases; generation, not retrieval confidence) | pass |
| §4 l. 176 and "External check" (INTEG-03) | "frozen in a tagged commit before any of its queries was scored"; populations; per-intent check; P2 assumed; thresholds; median; matched at most 11 of 159; intent resampling | **git ancestry:** tag `e1-protocol-v1` → `970c54f` (20:03) is an ancestor of the first E1 output (`86114a2`, 20:07) and the first scores (`63d71af`, 20:10); the frozen protocol; the E1-03 log | pass |
| Table 1 Status † and caption (INTEG-04, 06) | The scope of the "robust", "descriptive" and "threshold, not hybrid" cells; "Holm-family" | Results; l. 176 (the family was fixed after the results) | pass |
| §5 scoping sentences, and "Holm-family" (INTEG-04, 06) | "On this benchmark"; "On the benchmark" | The v0.2 results versus the E1 matched comparison | pass |
| **§5 external-check paragraph (INTEG-04)** | "**exactly** those that share no word … with the corpus" | **Independent recount:** on P1, 1,142 queries share no word, and R1 rejects 1,139. Three ("ya", "bye", "hola!") are accepted through the substring bonus (s = 15). R1 rejects no query that shares a word. P2 is exact (191/191). | **Corrected** (author: "approve fix"): "…except three short greetings (e.g., ``bye'') accepted through an accidental substring match (§3)." |
| Discussion and Conclusion (INTEG-07) | "Which score to threshold is not settled"; the lead; the external sentence | `summary.json` (primary and matched); trace (Conclusion coverage) | pass |
| Limitations (PAPER-03 to 05, INTEG-05) | Self-audit; 7–8 / 12–17; scope; "October 2026"; the external-check bullet | Trace (Limitations coverage); LIT-01 date; protocol §2.4 | pass |
| Ethics and acknowledgements macro (PAPER-06) | Anonymity | The review PDF scan (positive control) | pass |
| **Appendix C (INTEG-04)** | Table 8 numbers; "rejects **exactly** the requests that share no word" | Trace (App. C); the same recount | Numbers pass. The sentence was **corrected**: "…all of them except three short greetings accepted through an accidental substring match; every rule rejects the rest of that group, so its share is a floor for every rule." This was verified: all four rules reject all 1,139 (P1) and 191 (P2). |

## 3. State after the corrections

- **Trace:** 208 snippets, 595 numbers, 0 problems.
- **Build:** the body ends on page 8 (limit 8) in both PDFs; 0 overfull boxes and 0 undefined
  references.
- **Anonymity:** the positive control PASS, and the review PDF is clean (15 strings).

**Verdict: PASS, after one correction** (the "exactly" wording in §5 and Appendix C).
