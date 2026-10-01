# INTEG-02: page budget and placement plan for E1 (option B, D12)

**Status: APPROVED by the author on 2026-10-01** ("approve plan, INTEG-07 = P1"). INTEG-07 is now P1
and includes the Discussion rephrase (P5); `TASKS.md` is updated. **No paper text has been changed.**

## 1. Measured budget (2026-09-30, read-only)

**Method:**

- `research/paper/acl_latex/` was copied to the scratchpad.
- In the **copy only**, a position marker (`\pdfsavepos`) was added at `\label{endofbody}`.
- `main_review.tex` was then built exactly as `build.sh` does (pdflatex, bibtex, pdflatex, pdflatex).
- The committed PDFs were not touched.

| Quantity | Value |
|---|---|
| Output | 13 pages, same size as the committed `main_review.pdf` (1,197,731 bytes) |
| Body ends (`endofbody`) | **page 7, right column** (x = 307.3 pt), at y = 667.6 pt from the page bottom |
| Text block on the page (from the bottom) | 69.3 pt to 773.9 pt (`\textheight` = 704.6 pt; A4) |
| Right column of page 7 used by the body | about 106 pt (15%). The Conclusion starts at the bottom of the left column. |
| **Free counted space before the 8-page limit** | about 598 pt (page 7, right column) + 2 × 704.6 pt (page 8) ≈ **2,007 pt ≈ 147 column lines** at a 13.6 pt baseline |

- **Does not count toward the limit** (ACL guidelines; `build.sh`): the Limitations, Ethics,
  references and appendices.
- **Caveat:** added text can move floats (Tables 1–3, the figure), so the real end position can
  shift by more than the added lines. The build check (`endofbody` ≤ 8) is re-run after every edit.

## 2. Placement plan (option B)

The line counts are estimates in body-column lines, at about 12 words per line.

| # | Where | Change | Task | Est. lines |
|---|---|---|---|---|
| P1 | §4, a new short paragraph "External check (E1)" after the out-of-scope rules (around l. 142–157) | What E1 is:<br>- CLINC150 test sets P1 (4,500) and P2 (1,000), requests written for another assistant, cited (the key `larson-etal-2019-evaluation` is already in the bib);<br>- the protocol frozen before scoring (git tag);<br>- v0.2 thresholds applied unchanged, five per fold, median as the primary;<br>- the primary comparison R2 − R3, and the matched secondary (m = 11 from v0.2 in-scope only);<br>- the intent-cluster bootstrap;<br>- no in-scope queries, so no false-rejection evidence | INTEG-03 | +8 |
| P2 | §5, out-of-scope paragraphs (ll. 255–278) | **Rephrase l. 257** ("But the gain comes from the threshold, not the hybrid") to scope it to the benchmark.<br>**Scope l. 265** ("never worse at the points we checked" → "at the in-sample points we checked on v0.2").<br>**Add 3 sentences** of E1 results: R1 25% / 19%; R2 86% vs R3 78% at the v0.2 operating points (+8.3 [5.0, 11.6]); at equal v0.2 cost, the fused score rejects more (77% vs 65%; −12.5 [−16.2, −8.9]); plus a pointer to the appendix. | INTEG-04 | +8 |
| P3 | Table 1 (`tab:claims`), rows l. 197–198 | Only the **Status** cells change, for example "descriptive; reversed externally (E1)" and "robust on v0.2; see E1". **No new row:** E1 does not fit the v0.1 / v0.2 columns. | INTEG-04 | +0–1 |
| P4 | New appendix section "External check on CLINC150 (E1)", with one table | P1 and P2 rates for R1, R1-CLI, R2 and R3 with intervals; the five-threshold ranges; the primary comparison; the P2 replication; the matched comparison; the subgroup-S and overlap sensitivity results; the protocol tag and a deviations statement. **Not counted.** | INTEG-04 | appendix |
| P5 | Discussion, ll. 353–355 | Rephrase: "Out-of-scope rejection depended mostly on the threshold. Which score to threshold is not settled: …" | INTEG-07 | +2 |
| P6 | Conclusion, ll. 365–370 | Rephrase the lead, and add an E1 clause to the out-of-scope sentence | INTEG-07 | +3 |
| P7 | Conclusion next steps (ll. 372–373) | "confirm the findings with an analysis specified in advance" → for example "extend the pre-specified external check to terminal-task requests and to in-scope costs" | INTEG-06 | 0 |
| P8 | Contributions (ll. 50–57) | Optional: add "and a pre-specified external check" to contribution 2 or 3 | INTEG-07 | +1 |
| P9 | Limitations (not counted) | Update "Out-of-scope evidence" (E1-K, E1-L) and "Exploratory statistics" ("every analysis **except E1** …").<br>Add E1's own limits: general-domain, no false rejections, P2 assumed out of scope, the 10 vs 11 cost tie. | INTEG-05 and 06 | +6 (uncounted) |
| P10 | Abstract, l. 23 | **Required if E1 enters the paper:** "All analyses are exploratory" would become false. The abstract is at 199/200 words, so this needs a trim elsewhere. An E1 result sentence in the abstract is a separate, optional decision. | INTEG-06 / 07 | 0 (abstract) |

- **Counted total: about 22–23 lines, against about 147 free. It fits without trimming.**
- **If float movement pushed the body past page 8,** these could be trimmed, in order:
  1. the equal-false-rejection sentence at ll. 262–265, which E1's appendix table now covers;
  2. the parenthetical on the 15 queries at ll. 276–278;
  3. P8.

## 3. Consequences for the remaining tasks (please confirm)

1. **INTEG-07 becomes required.** It is currently P2, "only if E1 changes the headline". D12 = B
   rephrases the Conclusion lead, and P10 (the abstract's "exploratory") is needed once E1 is in.
   **Proposal:** raise INTEG-07 to **P1**, and move the Discussion rephrase (P5) into it.
2. **The order stays as planned:**
   - INTEG-03: methods (P1);
   - INTEG-04: results, Table 1 status cells, the appendix, and the trace entries for every E1
     number (P2–P4);
   - INTEG-05: limitations (P9);
   - INTEG-06: the planned-vs-exploratory wording (P7, P9, P10);
   - INTEG-07: the abstract, Discussion and Conclusion (P5, P6, P8, P10).
3. **Every paper edit is shown to the author as a draft first**, and applied only after approval.
   After each one, `build.sh` checks the page limit and `trace_claims.js` must show 0 problems.
