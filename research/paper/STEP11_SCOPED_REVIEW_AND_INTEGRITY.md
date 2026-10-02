# Runbook step 11: scoped review and Stage 4.5 integrity check of the label-study update (2026-10-02)

**Scope:** every passage changed in runbook steps 10 and 12, at commits `854c3fd` and `5ca157c` against
`4ca9974`:

- the abstract, §3 annotation paragraph, §5 Recalibration sentence and Conclusion next steps;
- the Limitations bullets (benchmark, exploratory statistics) and Ethics;
- the new Appendix D with Table `tab:v021`;
- the camera-ready AI clause in `main.tex`.

That is 2 files, +98 / −12 lines.

**How it was run.**

- The ARS `academic-paper-reviewer` skill was loaded. Its `re-review` mode requires a round-1 Revision
  Roadmap, an author sidecar and a revision-evidence bundle. None exists for this change: it reports new
  results and does not respond to review comments. The review was therefore run as a **scoped panel
  review** of the changed passages.
- **Provenance:** all five lenses (journal fit, methodology, domain, perspective, devil's advocate) were
  applied by one model (Claude Opus 5.5) in one context. The seats are not independent, and errors may be
  correlated.
- No sprint-contract checker or cross-model track was run.
- Reviewers do not edit the manuscript. Every fix below is a **proposal for the author**.

## 1. Integrity check (Stage 4.5, 100% of changed passages)

| Passage | Claims | Check | Result |
|---|---|---|---|
| Abstract | 58%; κ = 0.98 | Trace (`v0.2.1/review_r1_b`, `annotation_results.json`) | pass |
| §3 annotation | criteria 0.7 / 90%; 58 + 20; κ, interval, 78; 35/35; 4 of 23; fallback; "not shown the original labels"; "confirmed working independently" | Trace; protocol §4 and Amendment 7; sheet header (no label column filled); author report 2026-10-02 | pass |
| §5 Recalibration | 58%, 0.119, 0.085, 4 of 20; "folds differ" | Trace; fold comparison (37/207 keep their fold) | pass |
| Conclusion | release of v0.2.1 | — | pass |
| Limitations | κ 0.98 / 0.63 / n = 14; "partly by construction"; AI-written examples; written after the first check; blinding and independence; 4 kept; "corrects or drops" | Trace (coverage: 22 numerals, 0 unregistered); protocol §1 points 1–2 and Amendment 4; changelog | pass (the "corrects" wording was corrected in step 10) |
| Ethics | AI-written worked examples | Protocol Amendment 4; commits `e50f170`, `9f06c2d` | pass |
| App. D Protocol and Results | 59 + 20 (4 attention checks); TA-B187 excluded; κ values; 18/4/1; the four query texts; 14/14 | Trace; `per_item.csv`; v0.2 benchmark query texts | pass |
| App. D Disclosures | 37 + 11 of 79; 0 in the originals | Trace from `recheck_counts.json` (counts only, from the gitignored returns) | pass (ISSUE-12's "48 identical" was corrected in step 10) |
| App. D v0.2.1 paragraph and Table `tab:v021` | 207; the changes; the TA-B145 status; 37/207; 20/20 ranking and OOD; 4 vs 13; 67 vs 78; AUGRC reaching zero; Holm .070; every table cell | Trace (App. D, App. D table); changelog; `seed_repeat_cv.json` in both runs | pass (rounding tie −0.0205 → −.020, noted in the trace) |
| AI clause (`main.tex`) | codebook, examples, handbook; coordination; no label judged | Ledger U11 and U12; commit trailers | pass |

- **References:** `references.bib` is unchanged since FINAL-03 (`0a45e34`), and no citation was added.
  The FINAL-03 reference audit (31/31) stands.
- **Trace:** 252 snippets, 752 numbers, 0 problems. A tamper test on one table cell was caught.
- **Build:** the body ends on page 8 of 8; 0 overfull boxes; 0 undefined references.
- **Abstract:** 197 words.
- **Anonymity:** the review PDF has 0 hits for all 15 strings; the positive control passes; the AI clause
  appears in the camera-ready only.

**Integrity verdict: PASS.**

## 2. Scoped review findings

| ID | Lens | Severity | Finding | Where | Proposed fix |
|---|---|---|---|---|---|
| R1 | Devil's advocate, journal fit | **Major** | The paper never says **why v0.2 stays the analysed version** when a corrected v0.2.1 exists. A reviewer will ask why the headline numbers rest on a benchmark with known defects. | App. D "Benchmark v0.2.1"; §3 last sentence | Add one sentence to App. D: "We keep v0.2 as the analysed version because the main analysis was frozen on it before the annotation study and the external check's thresholds come from it." (about 1.5 appendix lines; 0 body lines) |
| R2 | Methodology (accuracy) | Minor | **"label-corrected"** (abstract, §5, Table `tab:v021` caption) misdescribes v0.2.1. The annotation study changed no label. v0.2.1 fixes gold-command defects, one review status (TA-B145) and drops two queries. | l. 16, l. 260, l. 770 | Replace with "corrected" in all three places (abstract −0 words: "on a corrected v0.2"). |
| R3 | Methodology (proportionality) | Minor | §3 gives only κ = 0.98, which includes 20 controls. The κ on the 58 AI-authored queries alone (0.97 [0.90, 1.00]) is only in App. D. | §3 | Add "(0.97 on the 58 queries alone)" after "78 items". The abstract keeps the pre-declared primary. |
| R4 | Devil's advocate (selective reporting) | Minor | App. D reports that the annotators agree with each other on the 14 first-review queries (14/14), but not that each agrees with the first reviewer on 11 of 14. | App. D Results | Append ", and each agrees with the first reviewer on 11". Source: `comparison_with_first_blind_review.first_vs_a1` = `first_vs_a2` = 11. |
| R5 | Journal fit (wording) | Minor | App. D Disclosures states the independence confirmation twice. | App. D Disclosures | Drop "and independence on their confirmation to the author" from the third sentence, and keep the final clause. |
| R6 | Perspective (ethics) | **Major, already open** | Annotator recruitment, pay, consent and ethics review are not stated. The ACL Responsible NLP checklist (section D) requires them for human annotators. | Ethics; checklist | Needs D1–D5 from the author. It blocks the checklist, not this text. |
| R7 | Domain | Optional | Two exploratory checks would sharpen App. D: (a) results with the 4 reversed items relabelled clear (sensitivity, not a relabel); (b) v0.2.1 re-run on v0.2's fold assignment, to separate the label effect from the partition effect. | App. D | New exploratory analyses. They need the author's approval and must be labelled exploratory. Not required. |

**Strongest counter-argument (devil's advocate), adjudicated.**

The claim: "The re-check closely matched the other annotator's sheet. If one annotator could see the other's
sheet then, independence of the original returns is doubtful, so κ = 0.98 is not an independent reliability
estimate."

Evidence against:

- in the original returns, no comment is identical to or the beginning of the other's (0 and 0);
- the original record-id columns match the other annotator's on only 51 of 79 rows; the re-check matched
  on 78;
- the paper states the episode and the counts in full, and states that independence rests on the annotators'
  confirmation.

**Adjudication:** the disclosure is complete, and the evidence that is available supports the independence of
the analysed returns. This is **not CRITICAL**, and it does not block. The residual risk is stated in
Limitations ("blinding and independence rest on the annotators' own compliance").

**Review outcome:** **minor revision** of the step-10 text. R1–R5 are text fixes for the author to approve;
R1 is the only one with substantive weight. R6 is open (D1–D5), and R7 is optional.
