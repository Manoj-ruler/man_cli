# Final publication audit — TermAssist

**Date:** 2026-10-05. **Commit audited:** `5c7a641` on `research/improvement` (in sync with `origin`).
**Scope:** audit only. No paper, code, benchmark, frozen artifact or product file was changed. This audit
added only the files in `research/paper/final_audit/`.

**Who ran it.** One AI model (Claude Opus 5.5), in the same session that helped build much of the project. It is
not an independent human review. To limit self-confirmation, the headline numbers were rebuilt from the raw
per-query files with new code that uses none of the project's helpers (`scripts/audit_recompute.js`), and the
claim trace's coverage was tested from outside (`scripts/audit_coverage.js`).

## 1. Executive verdict

**READY WITH MINOR FIXES.**

- No publication-blocking problem was found.
- The research pipeline matches the paper's description.
- Every headline number reproduces from the raw data.
- The frozen artifacts are intact.
- The limitations that matter are already stated in the paper.
- One sentence is factually wrong (F1), and five small wording items should be tightened. None changes a number,
  a table or a conclusion. All are listed in §14.

## 2. Current repository state

| Item | State |
|---|---|
| `master` | `83576fa` (2026-08-20), untouched; equals `origin/master` |
| `research/improvement` | `5c7a641`, 177 commits ahead of master, pushed, clean working tree |
| `product/1.1` | `e504914`, local only; contained in no other branch; forked from the research branch at `b8fc20c` |
| Tags | `e1-protocol-v1` → `970c54f`; `v0.1-validated-benchmark`; `v0.2-validated-benchmark`; `v1.0-research-baseline`; `v1.0-research-final`; all present on the remote |
| npm | `@manoj-ruler/termassist` 1.0.1 is the latest published version (registry `time.modified` 2026-04-19); `cli/package.json` says 1.0.1 |
| `cli/` on the research branch vs master | `search.js` identical; `index.js` differs in one comment; `commands.json` gained metadata fields only (all 431 records identical in the five fields the tool reads) |
| Benchmarks | v0.1 (150), v0.2 (209), v0.2.1 (207); each matches its manifest SHA-256 |
| Frozen analysis inputs | 27/27 unchanged since `ANALYSIS_FREEZE_v1.0.md` (committed once, 2026-09-29, never edited) |
| External-check freeze | protocol and both scripts equal the tag today |

## 3. Paper overview

- **Title:** "Confidently Wrong: Auditing and Recalibrating the Confidence of a Shipped
  Natural-Language-to-Shell Command Retriever". EACL 2027 SRW, long track.
- **Size:** the body ends on page 8 of 8. The review PDF has 17 pages; its abstract has 197 words.
- **Structure:** Abstract, §1 Introduction, §2 Related Work, §3 System and Benchmark, §4 Methods, §5 Results,
  §6 Discussion, §7 Conclusion, Limitations, Ethical Considerations, Appendices A–D. 31 references are cited.
- **Question:** how reliable is a shipped closed-set retriever's confidence, and what do recalibration, a
  tuned rejection threshold and a hybrid retriever each contribute?

## 4. Research contribution assessment

The contribution is an empirical audit, and it is framed as one.

- **Defensible as a contribution:** yes, for a student workshop. The paper audits a tool that real users can
  install, with a per-number trace and a clean-clone reproduction.
- **"Three problems, three remedies":** supported on the benchmark.
  - Calibration responds to recalibration.
  - Out-of-scope rejection responds mostly to the threshold.
  - Error ranking responds to the hybrid, on 20 of 20 partitions.
  - The paper scopes the claim to "on our benchmark" and reports the external reversal at equal cost.
- **No algorithm is claimed.** §1 says "the measures are established ones"; §2 says the novelty is "that
  combination … not any single method".
- **The weakest leg** is the calibration remedy on the corrected benchmark (F2).

## 5. Numerical and claim audit

The full table is in `CLAIM_AUDIT.md`. Summary:

- **Independent recomputation: 48 comparisons, all consistent with the paper.**
  - Counts, accuracies, raw ECE, top-bin statistics.
  - Per-fold thresholds, re-derived from the raw scores.
  - Out-of-scope and false-rejection counts, McNemar p-values, Holm adjustments, the Wilson interval.
  - All external-check rates and fold ranges; all κ values.
  - The one approximate item: the recalibrated ECE under an independent isotonic fit is 0.070 and 0.063, against
    the paper's 0.069 and 0.063. The difference comes from how values between isotonic steps are predicted.
- **Project trace:** 253 snippets, 755 numbers, 0 problems. A tamper test from 2026-10-02 showed that it catches
  a changed table cell.
- **Trace coverage, tested from outside:** of 706 numerals in the paper text, 580 are pinned at their location,
  107 have their value registered elsewhere, and 19 are design constants. One result statement has no entry
  (F4).
- **Version labels:** v0.1, v0.2 and v0.2.1 are labelled correctly wherever they appear. Table 9 gives v0.2
  against v0.2.1 for every Table 1 claim.

## 6. Methodology audit

| Paper statement | Code | Verdict |
|---|---|---|
| Five folds, seed 42, stratified by label | `folds.json`; fold sizes and per-fold OOD counts recomputed | matches |
| α, thresholds and calibrators chosen on the four development folds | `run_selective_prediction*.js:75–83`; `phase1_common.js:103–117` | matches |
| Thresholds maximize F1, ties to the lowest score | strict `f1 > best.f1` over ascending candidates; re-derived values identical | matches |
| Isotonic, Platt and histogram calibrators fit on development folds only; controls excluded | `review_r1_b_calibration.js:26` | matches |
| Paired percentile bootstrap, 10,000 resamples, seed 42 | `phase1_common.js:94–99` | matches |
| Exact McNemar; Holm over four comparisons per version | recomputed by hand | matches |
| Noise floor: a perfectly calibrated forecaster "with the same confidences and n" | simulated from the **recalibrated** confidences | matches for the recalibrated comparison; loose for the raw one (F7) |
| "No inner split; each query's hybrid score uses the α chosen for its own fold" | as described | disclosed; no effect on v0.2, where α = 0.5 in every fold |
| Detector features chosen on the full data | as described | disclosed as a leak |
| External check frozen before scoring; thresholds are v0.2's, unchanged | tag `970c54f`; `decisions_p1.json` thresholds equal the v0.2 per-fold values | matches |
| v0.2.1 re-run with unchanged code | run at `be706df`; later changes are tooling only | matches |

## 7. Research-integrity audit

| Concern | Finding | Class |
|---|---|---|
| Test/development contamination in calibration and thresholds | None found: everything tuned is fit on development folds | Not an issue |
| α and threshold interaction (no inner split) | Development scores depend, through α, on data that includes the test fold. v0.2 is unaffected (α constant). | Already disclosed / acceptable |
| Detector feature selection on the full data | Real leak, in the detector's favour | Already disclosed / acceptable |
| OOD screening by retrieval score, which favours the shipped score | Real construction bias; the 15 unscreened queries and the external check both address it | Already disclosed / acceptable |
| Post-hoc analysis choices (Holm family, controls exclusion, equal-cost comparison, sensitivity subsets) | All labelled exploratory | Already disclosed / acceptable |
| External-check pre-specification | The tag precedes the scoring commit by 7 minutes and is on the remote. CLINC150 was in the repository 51 minutes before the freeze, for the per-intent scope check that the paper mentions. No external registry was used. | Minor (R4) |
| Fold leakage across paraphrases of one intent | Split B (grouped by intent) is reported: accuracy unchanged, calibration somewhat weaker | Already disclosed / acceptable |
| Duplicate queries | None in v0.1 or v0.2 after text normalization | Not an issue |
| Frozen artifact modification | 27/27 inputs unchanged; v1.0 freeze never edited; E1 files equal the tag; benchmarks match manifests | Not an issue |
| Cherry-picking | Seed 42 is the headline, with 20 partitions reported; v0.2.1 is reported in full, including where it weakens the result | Not an issue |
| Unsupported significance claims | None in the text. Three summary phrases and two Table 1 status cells predate v0.2.1 (F2, F3). | Minor |
| Annotation independence | The annotators are team members and friends; an unused re-check matched the other annotator's sheet; all of it is disclosed with counts | Already disclosed / acceptable |
| Benchmark built by the tool's builders, partly by an AI agent | Stated in §3, Limitations and Ethics | Already disclosed / acceptable |
| The evaluated corpus is not the released one | 431 against 380 records; stated on page 1 and in §3, Limitations and Ethics; the released corpus was re-run for accuracy and raw ECE | Already disclosed / acceptable (R1) |
| A factual error in the system description | "non-English queries are refused" (F1) | Minor (must fix) |

No Critical or Major integrity issue was found.

## 8. Reproducibility audit

Details are in `REPRODUCIBILITY_AUDIT.md`. In short:

- **Verified today:** tests 24/24; freeze inputs 27/27; trace 0 problems; E1 files equal the tag; model cache 4/4
  hashes; benchmark hashes; environment pins; the two audit scripts.
- **Relied on from 2026-10-02:** the full regeneration from a fresh local clone (runbook step 13), 0 real
  differences. No analysis code has changed since.
- **Not verifiable here:** a clone from GitHub; the npm tarball's contents; other operating systems; the PDF
  build inside the clone.

## 9. Production-versus-research audit

The paper keeps the two apart. Checked locations:

- **§1:** the hybrid is "a research prototype with one small MiniLM encoder, not part of the package".
- **§4:** "None of the calibrators, tuned thresholds, detectors, the risk classifier or the dense and hybrid
  retrievers is part of the published tool; all are offline analyses of its outputs."
- **Table 4 caption:** "the hybrid is a research prototype, not part of the published tool".
- **Discussion:** the safeguards are proposals; "We did not evaluate any of these."
- **Ethics:** "This study does not change the published package."

Places where a hurried reader could still be confused:

- **The abstract** says "a hybrid detector", "the hybrid's confidence" and "both systems" without saying that
  the hybrid is a research system. The Introduction says so half a page later. Optional fix.
- **"Shipped" for numbers computed on the repository corpus** (F10). Disclosed on page 1.

`product/1.1` does not contaminate the research: its commits are in no other branch, the research `cli/` is the
1.0.1 code, and the paper does not mention 1.1.

## 10. Safety and ethics audit

- **Destructive examples:** each one in §5 matches a row of `review_r1_d_risk.json`.
- **No safety claim:** stated in §5 and Ethics; the classifier's miss is reported; counts are called lower bounds.
- **Execution:** commands ran in `mkdtemp` directories under the system temp folder; the paper says "not an
  OS-level sandbox" twice.
- **Single-Enter execution:** matches `cli/index.js`.
- **Safeguards:** presented as recommendations, not as evaluated features.
- **Annotation ethics:** unpaid volunteers; consent; team members and friends; no demographics; **no ethics
  review**. These are the author's statements and cannot be checked from the repository.
- **AI use:** the camera-ready statement covers drafting, code, benchmark items, labels, the external check and
  the annotation materials. It is absent from the review PDF, as intended.

## 11. Novelty and related-work audit

- **Positioning:** NL2Bash, NLC2CMD, ShellFusion, NL2SH, QuoteBench, DocPrompting, CLAI and an execution-based
  PowerShell evaluation are all cited and distinguished; calibration, selective prediction and OOD detection are
  cited to their sources.
- **"To our knowledge"** is limited to "within our targeted search" and to the combination.
- **No LLM baseline:** the paper says "We run no generative system, so our comparison with generation is
  conceptual." That fits the research question.
- **Citations:** 31 cited keys, all in the bibliography, all in the reference audit of 2026-10-01 (31/31 found).
  The bibliography also holds 3 uncited entries, which do not print. One estimator lacks a citation (F6).

## 12. Reviewer-risk assessment

| ID | Risk | Likelihood | Why it is survivable |
|---|---|---|---|
| R1 | "The title says shipped, but the corpus evaluated was never shipped." | Medium | Stated on page 1; the released corpus is re-run and is worse; the 86% headline is 84% on it |
| R2 | "A small benchmark built by the authors and an AI agent, checked by the authors' friends." | High | All stated; the external check uses independent data; claims are scoped to the benchmark |
| R3 | "Everything is exploratory, and the corrected benchmark weakens the first result." | Medium | The paper says so itself and shows the comparison in full (after F2 and F3) |
| R4 | "Pre-specified by a git tag set the same evening." | Low to medium | The tag is on the remote and precedes scoring; the paper claims "frozen in a tagged commit", not preregistration |
| R5 | "Heavy AI involvement; no ethics review." | Medium | Fully disclosed; the author takes responsibility; a reviewer may still weigh it |

## 13. Publication blockers

**None.**

## 14. Minor corrections

Smallest wording changes, in priority order. None changes a number.

1. **F1 (must fix):** §3, "so non-English queries are refused" → "so queries in non-Latin scripts are refused".
2. **F2 (should fix):** qualify the calibration summaries for v0.2.1 in Contribution 2 and the Conclusion (the
   Discussion already says "on our benchmark").
3. **F3 (should fix):** one caption sentence in Table 1 pointing to Table 9.
4. **F5 (should fix):** make "friends of the author" consistent with "one of the authors" in the review version.
5. **F4 (minor):** register the α = 0.1 statement in the trace, or soften "every reported number".
6. **F6 (minor):** cite the sweep estimator after verifying the reference, or describe it in words.
7. **F7 (optional):** say which confidences the noise floor is simulated for.
8. **Records only:** `CURRENT_TASK.md` says the review PDF has 16 pages; it has 17.

After any text change: run `trace_claims.js` (0 problems), `build.sh` (body ≤ 8 pages) and the anonymity scan.

## 15. Optional improvements

- Report the released-corpus wrong-answer confidence (84%) in §3.
- Say "research hybrid" once in the abstract (3 words of room).
- Remove the 3 uncited bibliography entries.
- Post-submission: separate the label effect from the partition effect in v0.2.1; a sensitivity run with the 4
  reversed labels; a terminal-specific external check; external annotators; an ethics-board opinion.

## 16. Final submission recommendation

Stop research work. Make the wording fixes in §14 (F1 at least), rebuild, and submit. Nothing found in this
audit calls for a new experiment, new annotation or a change to the released tool.

## 17. Outcome (author, 2026-10-05: "apply all the fixes, commit the audit and push")

The audit above describes the paper at `5c7a641`. The must-fix and should-fix items were then applied:

| Finding | Outcome |
|---|---|
| F1 | **Fixed.** §3 now says "so queries in non-Latin scripts are refused". |
| F2 | **Fixed.** Contribution 2: "substantially reduces the confidence's calibration error". Conclusion: "fixes most of that on v0.1 and v0.2, and less on the corrected v0.2.1". The Discussion was left: it already says "on our benchmark". |
| F3 | **Fixed.** Table 1 caption: "Table 9 gives the corrected v0.2.1, where the AUGRC interval reaches zero." |
| F4 | **Fixed.** The α = 0.1 statement is registered in `trace_claims.js` (254 snippets, 756 numbers). |
| F5 | **Fixed.** The three places use the `\authorrel` macro: "friends of the author" in the camera-ready, "friends of one of the authors" in the review version. |
| F6 | **Fixed.** The sweep estimator is cited (`roelofs2022mitigating`), verified against arXiv 2012.08668 and the PMLR v151 page; `verify_refs.js` gives 32 of 32 found, with no regression. |
| Records | **Fixed.** `CURRENT_TASK.md` gives 17 pages. |
| F7, F10, F11 and the optional items | Not applied. They were optional or need no action. |

**Checks after the fixes:**

- trace: 254 snippets, 756 numbers, 0 problems;
- build: the body ends on page 8 (limit 8); 0 overfull boxes, 0 undefined references and 0 BibTeX warnings in
  both PDFs; 17 pages each;
- abstract: 197 words;
- anonymity: the review PDF has 0 hits for all 15 strings, and "friends of the author" no longer appears in it;
- tests 24/24; freeze inputs 27/27; the external-check files equal the tag.

**Review PDF:** `main_review.pdf`, SHA-256 prefix `b5eaebd7e55d828a`.
