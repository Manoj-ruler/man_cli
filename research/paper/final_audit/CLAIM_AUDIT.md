# Claim audit — TermAssist paper

**Audited:** `research/paper/acl_latex/content.tex` at commit `5c7a641` (2026-10-05). Audit only: nothing was changed.

**How each claim was checked.**

- **Recomputed:** rebuilt from the raw per-query files by `scripts/audit_recompute.js`, which uses none of the
  project's analysis helpers.
- **Trace:** matched by the project's own `trace_claims.js` (253 snippets, 755 numbers, 0 problems).
- **Code:** read in the source.
- **Probe:** `cli/search.js` `search()` called directly; no command was executed.

**Status key.** GREEN: the evidence supports the claim directly. YELLOW: defensible, but it should be
qualified. RED: unsupported or misleading as written.

**Result:** 1 RED (a one-phrase factual error), 6 YELLOW, the rest GREEN. No RED or YELLOW item touches a
reported number.

## Claims that need attention

| ID | Claim | Location | Evidence | Status | Problem | Required action |
|---|---|---|---|---|---|---|
| F1 | "so non-English queries are refused" | §3, The published tool | Probe: "como instalar python" returns a command at 66% confidence; "git status anzeigen" at 100%; "hola!" at 100% (`git blame filename.txt`). Only queries with no ASCII letters or digits (e.g. Chinese, Japanese) score 0. The paper's own Appendix C says three greetings, including a Spanish one, were accepted. | **RED** | Factually wrong as written. The tokenizer removes non-ASCII characters; it does not detect language. | Replace with "so queries in non-Latin scripts are refused". No number changes. |
| F2 | "standard recalibration largely corrects the confidence level"; "repairs most of it"; "fixes most of that" | §1 Contribution 2; Discussion; Conclusion | v0.1 and v0.2: −79% and −78%, within the noise floor on the seed-42 partition. v0.2.1: −58%, recalibrated ECE 0.119 above the floor's 95th percentile 0.085, and within it on 4 of 20 partitions. | **YELLOW** | The three summary phrases were written before v0.2.1. The body (§5, Appendix D) states the weakening; the summaries do not. | Qualify one phrase, for example in the Conclusion: "fixes most of that on v0.1 and v0.2, and less on the corrected v0.2.1". Soften Contribution 2 to "substantially reduces its miscalibration". |
| F3 | Table 1 status "robust" for the shipped ECE reduction and for AUGRC | Table 1 and caption | The caption defines "robust" as "the interval excludes zero on both versions" (v0.1, v0.2). That is true. On v0.2.1 the AUGRC interval is [−.042, .001] and the shipped ECE reduction is 58% [35, 76]. | **YELLOW** | A reader of Table 1 alone does not learn that one "robust" row reaches zero on the corrected benchmark. | Add to the caption: "Table 9 gives the corrected v0.2.1, where the AUGRC interval reaches zero." |
| F4 | "a trace from every reported number to its result file" | §1 Contribution 3 | `scripts/audit_coverage.js`: 706 numerals in the paper text; 580 are pinned by a trace entry at their location; 107 more have their value registered elsewhere in the trace (restatements, table structure); 19 are design constants. One result statement has no entry: "the one partition per version where a fold selects α = 0.1" (verified by hand: seed 12 on v0.1, seed 18 on v0.2). The trace header lists what it does not cover (Table 6, the Split B cells, figures, design parameters). | **YELLOW** | "Every" is slightly stronger than what the tool enforces. | Either register the α = 0.1 statement, or write "a trace from the reported numbers to their result files". |
| F5 | "friends of the author" (three places) beside "one of the authors" and "the authors" | Limitations, Ethics, Appendix D; §1; §3 | Review PDF text: "one of the authors" comes from the `\authorrel` macro; "friends of the author" is hard-coded in `content.tex`. | Minor | The anonymous version mixes singular and plural, and the singular hints at a single author. | Use one form in the review version, for example "friends of an author", or a macro like `\authorrel`. |
| F6 | "equal-mass and sweep estimates" | §4 Metrics; §5 | `review_r1_common.js` implements the sweep estimator and attributes it to Roelofs et al. (AISTATS 2022). `references.bib` has no such entry. | Minor | A named estimator is used without a citation. | Verify the reference against its primary record and cite it, or describe the estimator in words. Do not add it unverified. |
| F7 | Raw ECE "is five to six times the noise floor of a perfectly calibrated forecaster at this size (0.064 and 0.050)" | §5 The shipped confidence | `review_r1_b_calibration.js:42`: the floor is simulated from the **recalibrated** confidences. Ratios 0.323/0.064 = 5.0 and 0.293/0.050 = 5.9. | **YELLOW** | The floor belongs to the recalibrated confidence distribution, not the raw one. The raw distribution, mostly at 100%, would have a smaller floor, so the statement is conservative, but "at this size" hides the mismatch. | Add "(the floor simulated for the recalibrated confidences)", or leave as is. Low priority. |
| F10 | "a published closed-set alternative"; title "Shipped … Retriever" | Abstract; title | The released npm 1.0.1 has 380 corpus records (240 on Windows); the paper evaluates the repository's 431 (279) with identical code (`published_corpus_check.json`; npm registry: version 1.0.1, modified 2026-04-19). §1, §3, Limitations and Ethics all state this. With the released corpus: accuracy 58.7% against 67.3%, raw ECE 0.372 against 0.323, and wrong answers average 84.4% confidence against 86.1%. | **YELLOW** (disclosed) | The abstract and title do not mention the corpus difference. The first page does. | None required. Optional: report the 84% figure for the released corpus in §3, which shows the headline does not depend on the later records. |
| F11 | "Two annotators' labels agree (κ = 0.98)" | Abstract | Recomputed: κ = 0.980 on 78 items; 0.967 on the 58 AI-authored queries. | **YELLOW** (disclosed) | The abstract cannot say that the annotators are project-team members and friends, that agreement is partly by construction, or that 20 of the 78 items are controls. §3, Limitations and Appendix D do. | None required. |

## Claims verified as stated (GREEN)

| Claim | Location | Evidence | Status | Problem | Required action |
|---|---|---|---|---|---|
| The tool prints a confidence percentage, refuses below 30%, and runs the pre-filled command on one Enter through PowerShell; no risk level is shown; query sync is off by default | Abstract, §1, §3, Discussion, Ethics | Code: `cli/index.js:58–104` | GREEN | — | — |
| BM25 with k1 = 1.2, b = 0.75; +15 substring bonus; confidence = min(round(s/8 × 100), 100), 0 when s < 2.0; 16 stopwords | §3 | Trace (reads `cli/search.js`); code read | GREEN | — | — |
| The study changed none of the tool's executable code and none of the corpus fields it reads | §1 | `git diff master research/improvement -- cli`: `search.js` identical; `index.js` differs in one comment; all 431 records identical in intent, command, category, description and os | GREEN | — | — |
| Released corpus 380 records (240 on Windows); 51 later records never published | §3 | `published_corpus_check.json`; npm registry confirms 1.0.1 is the latest version. The tarball itself was not downloaded in this audit. | GREEN | — | — |
| 150 and 209 queries; 25 controls; 110 and 134 in-scope and 15 and 50 out-of-scope non-control queries | §3, Table 1 | Recomputed | GREEN | — | — |
| 67.3% of v0.1 queries answered correctly; 49 wrong answers at mean 86% confidence, 44.9% of them at 100%, none a control | Abstract, §1, §5 | Recomputed: 101/150; 49; 86.06; 44.9%; 0 | GREEN | — | — |
| Raw ECE 0.323 and 0.293; top bin holds 77% and 63% of queries at mean 99% confidence with 70% and 73% correct | §5, Table 1 | Recomputed | GREEN | — | — |
| "Its confidence is no better than a constant forecaster" | Abstract, §1, Conclusion | Brier skill −0.23 [−0.45, 0.01] and −0.06 [−0.26, 0.15] (trace); both intervals include zero | GREEN | — | — |
| Isotonic recalibration: ECE to 0.069 and 0.063, −79% and −78% | Abstract, §5, Table 1 | Recomputed with an independent isotonic fit: 0.070 and 0.063, −78% and −79%. The 1-point differences come from how values between isotonic steps are predicted. Trace matches exactly. | GREEN | — | — |
| Isotonic fit on development folds only; controls excluded from fitting and evaluation | §4, Table 4 | Code: `phase1_common.js:103–117`, `review_r1_b_calibration.js:26` | GREEN | — | — |
| Five stratified folds, seed 42 | §4 | Recomputed fold sizes (31,31,30,30,28 and 43,43,42,41,40); OOD per fold 3 and 10 in every fold | GREEN | — | — |
| Tuned thresholds chosen on development folds, maximizing F1, ties to the lowest score | §4 | **Re-derived from the raw scores:** v0.2 6.4952, 6.4952, 6.4952, 7.1978, 6.4952; v0.1 6.1905, 5.4242 ×4. Identical to the stored values. | GREEN | — | — |
| v0.2: fixed rule 17 of 50 and 0 refused; tuned threshold 46 of 50 and 20 of 134; detector 34 of 50 and 11 of 134 | Abstract, §5, Table 1, Conclusion | Recomputed from the re-derived thresholds | GREEN | — | — |
| v0.1: 4, 10 and 7 of 15; 0, 9 and 6 false rejections | §5, Table 1 | Recomputed | GREEN | — | — |
| No rule rejects a control | Table 1 caption | Recomputed: 0 controls refused by any rule on both versions | GREEN | — | — |
| McNemar: detector vs fixed p = 0.000015 (17–0); tuned vs detector p = 0.004 (14–2); false rejections p = 0.093 (16–7) | §5, Table 5 | Recomputed | GREEN | — | — |
| Holm-adjusted values 0.0469, 0.2920, 0.0703, 0.0255, 0.00006 | Table 1, Table 5 | Recomputed from the raw p-values | GREEN | — | — |
| Accuracy 72/110, 79/110, 95/134, 101/134; hybrid vs BM25 0–7 (p = 0.0156) and 1–7 (p = 0.070) | Table 2, §5 | Recomputed | GREEN | — | — |
| The hybrid's accuracy gain is "fragile" and "not established" | Abstract, §5 | 7 and 8 discordant queries; v0.2 p = 0.070; 0 of 20 partitions below 0.05 on v0.2 and on v0.2.1 | GREEN | — | — |
| The hybrid's confidence ranks its errors better: AURC and AUGRC lower on both versions, on all 20 partitions | §5, Table 1, App. B | Trace; `seed_repeat_cv.json` (20/20, both versions) | GREEN on v0.1 and v0.2; see F3 for v0.2.1 | — | — |
| External check: frozen in a tagged commit before any query was scored; no deviations | §4, App. C | `e1-protocol-v1` → `970c54f` (2026-09-30 20:03 +0530), an ancestor of the scoring commit (20:10); the tag is on the GitHub remote; frozen files equal the tag today; `DEVIATIONS.md` lists none | GREEN | See R4 in the main report: the tag is the only timestamp | — |
| External check: 25.3%, 86.0% and 77.8% on the 4,500; 19.1%, 83.4% and 78.1% on the 1,000; at equal cost 64.6% vs 77.1% and 59.7% vs 77.0%; fold ranges | Abstract, §5, App. C, Conclusion | Recomputed from `decisions_p1.json` and `decisions_p2.json` | GREEN | — | — |
| The external check is general-domain, measures rejection only, and its second set is assumed out of scope | §4, Limitations | Protocol §2; stated three times in the paper | GREEN | — | — |
| "to our knowledge, that combination is what is new here, not any single method" | §2 | Novelty is limited to the combination, and "within our targeted search" | GREEN | — | — |
| None of the calibrators, thresholds, detectors, the risk classifier or the dense and hybrid retrievers is part of the published tool | §4, §1, Table 4 caption | `cli/` contains none of them; `research/` holds them | GREEN | — | — |
| Destructive examples: "open the config file" → `winget uninstall package-name --purge`; "change the file permissions" → an ownership change at maximum confidence; "system" → `sudo shutdown -h now`; "teach me how to play guitar" → an elevated PowerShell | §5 | `review_r1_d_risk.json` items (TA-B097, TA-B098, TA-B194, TA-B159) | GREEN | — | — |
| "We therefore make no safety claim" | §5, Ethics | The classifier misses 1 of 20; counts are called lower bounds | GREEN | — | — |
| Functional check: 15 queries in disposable temporary directories, "not an OS-level sandbox" | §5, Ethics | Code: `mkdtempSync(os.tmpdir())` | GREEN | — | — |
| κ = 0.63 for the first reviewer; κ = 0.98 [0.94, 1.00] on 78 items; 0.97 on 58; 35 of 35 out-of-scope labels kept; 18 confirmed, 4 judged clear by both, 1 split, of 23 | §3, App. D | Recomputed from `per_item.csv` | GREEN | — | — |
| v0.2.1: 207 queries; 58% reduction, 0.119, 0.085; 4 of 20 partitions; Table 9 | §5, App. D | Trace against `results/v0.2.1/`; the benchmark matches its manifest hash; the run manifest's input hash matches the file | GREEN | — | — |
| "Every analysis was re-run with unchanged code" (v0.2.1) | App. D | The run is at `be706df`. Since then, only tooling changed in `research/experiments/` (builder metadata, comparison, freeze report, re-check counts, trace). The 2026-10-02 clean-clone run regenerated v0.2 and v0.2.1 from the same code. | GREEN | — | — |
| All significance statements outside the external check are exploratory | §4, Limitations, Table 5 | Stated in four places; the Holm family is labelled post hoc | GREEN | — | — |
| The detector's features were chosen on the full data, "a leak that may flatter the detector's figures" | §4, Limitations | Disclosed in the same sentence that describes the protocol | GREEN | — | — |
| Annotator facts: unpaid volunteers; consented; friends of the author and team members; no ethics review; no demographics | Limitations, Ethics, App. D | The author's statements of 2026-10-05 (`PROGRESS.md`). They cannot be verified from the repository. | GREEN as reported | — | — |
