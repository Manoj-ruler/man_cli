# T14 revision roadmap: `acl_latex/content.tex`

**Workflow.** Follows `academic-paper` **revision mode**: roadmap, then author adjudication, then scoped patch, then citation compliance, then quality checks.

**Adaptation of the patch tooling.** ARS's scripts insert HTML-comment block markers and parse Markdown. Both would break a LaTeX source, so the patch discipline is enforced with git instead:
- only passages named below are edited;
- every other line stays byte-identical, which `git diff` verifies;
- the deterministic checks still run: `check_acronyms.py`, a cite-key/bib cross-check, and the build's page guard.

**Sources.** Every item comes from one of these:
- the evidence-based audit, `research/CURRENT_PUBLICATION_STATUS_AND_ROADMAP.md` (issues R1–R10);
- the Phase 1 results, `research/results/phase1/` (T1–T5, T3b);
- the literature check, `research/paper/T6_LITERATURE_VERIFICATION.md`.

Every new number is taken from a result file; the file is named per item.

## Author adjudication (recorded decisions)

| Decision | Author's choice | Date |
|---|---|---|
| D1 safety | Keep as a short descriptive secondary result, out of the abstract and contributions, with no "safe" claim | 2026-09-28 |
| D3 anonymity | Keep the TermAssist name, third person, with no URL, scope or repo link in the review version | 2026-09-28 |
| D4 venue | EACL 2027 SRW long paper: 8 pages of content, anonymous review, mentorship draft by 6 Nov 2026 | 2026-09-28 |
| D5 AUGRC | Report AUGRC next to AURC | 2026-09-28 |
| Scope | Two-annotator study results are **not** available. They go in as clearly marked pending text, with no invented numbers | standing rule |

## Items

| # | Change | Where | Source (result file) | Severity |
|---|---|---|---|---|
| 1 | Headline accuracy **excludes the 25 canonical controls**; controls become a sanity row. p-values are unchanged (controls are always concordant) | Abstract, Results, new Table 1, Discussion, Limitations | `phase1_t1_controls_excluded.json` accuracy, comparisons | Major (audit R4) |
| 2 | **Calibration.** Lead with the shipped baseline confidence; report ECE and Brier without controls; drop "all four signals" (the dense signal is not significant); add the Platt and histogram-binning comparators; state that calibration improves reported confidence, not decisions or ranking | Abstract, Results "Calibration", Discussion, Conclusion | `phase1_t1…` calibration; `phase1_t4_calibration_comparators.json` | Major (R5) |
| 3 | **Selective prediction.** Remove the tie-order-dependent "10.7% at 50% coverage". Report tie-aware expected risk, AURC and AUGRC with CIs, and correctness AUROC | Results, Discussion | `phase1_t3_selective_ties.json`, `phase1_t3b_augrc.json` | Major (R6, D5) |
| 4 | **OOD by type.** Terminal-task OOD is weak (4/10 rejected, AUROC 0.79). Report false rejections (11/159; 3 correct answers withheld), the selection effect in how the added OOD queries were checked, and that the subtypes are AI-assigned | Abstract, Results "OOD", Limitations | `phase1_t2_ood_breakdown.json`; `v0.2_ADJUDICATION_REPORT.md` | Blocker for OOD headline (R1, R2, R10) |
| 5 | **Safety (D1).** Remove from the abstract and contributions. Report misses under the spec definition, with Wilson CIs; name the genuine miss and the two label inconsistencies | Abstract, Contributions, Safety paragraph, Ethics | `phase1_t5_safety_recount.json` | Blocker for any safety sentence (R3) |
| 6 | **Split B** described as a "tuning-leakage check across intent groups", not generalization to unseen commands | Contributions, Methods, Results, Discussion, Conclusion, Limitations | audit R9 | Moderate |
| 7 | "in-use" becomes "published"; the hybrid is stated to be research-only | Introduction | audit | Minor |
| 8 | **Citations.** Add them at first use (T6 §6): BM25, Sentence-BERT/MiniLM, ECE, calibration methods, risk-coverage/AURC/AUGRC, McNemar/Holm/Wilson/Cohen, and related work on out-of-scope and selective prediction | Throughout | `T6_LITERATURE_VERIFICATION.md` | Major (R7) |
| 9 | Latency is presented as an indicative single-machine measurement | System, Architecture | `research/REPRODUCE.md` | Minor |
| 10 | **Annotation study.** State that the two-annotator study is under way, with no results claimed | Kappa section, Limitations, Future work | protocol | Minor |
| 11 | **Novelty wording.** "To our knowledge", scoped to the setting, with the nearest prior work named | Related work | T6 §4 | Minor |

**Not changed** (anti-pattern 7, no scope creep):
- figures (they still show with-controls accuracy; captions say so);
- the Holm table (its p-values are unchanged);
- the sensitivity table;
- the functional evaluation.

## Constraints

- Body ≤ 8 pages (`build.sh` guard).
- Keep the ACL rules: Limitations and Ethics come after the conclusion; no acknowledgments in the review version.
- ARS's "mandatory inclusions" rule (data availability, CRediT, COI, funding) conflicts with ACL review-version rules. **Resolution:** a data and code availability sentence goes in Ethical Considerations; CRediT, COI and funding go in the camera-ready acknowledgments. This is flagged to the author, not decided silently.

## Applied (2026-09-28): revision round 1

All 11 items were applied to `content.tex` in 36 diff hunks; the rest of the file is byte-identical. The
three items below were also needed:

- **Page budget.** The first build ran onto page 9. To fit, Figure 1 (now redundant with the new Table 1),
  the reliability diagram and the Split B table moved to the appendix. They were cut and pasted, not changed,
  and the body text points to the appendix.
- **Acronyms.** `scripts/check_acronyms.py` was run on the rendered text. It flagged LLM, RL, CV, AUROC, AURC,
  AUGRC, ECE, OOD and NL as used in the body before being defined; each is now defined at its first body use.
  The remaining flags are false positives: label names, benchmark IDs, venue names in the references, the
  title, and the abstract, which has its own scope.
- **Bibliography.** Two entries (`naeini2015ece`, `somov2025texttosql`) had both volume and number fields, which
  the ACL style rejects. The number field was removed; the metadata is otherwise unchanged.

**Checks after the revision:**

| Check | Result |
|---|---|
| Both PDFs build | Body ends on page 8 (limit 8) in both versions |
| LaTeX log | 0 undefined references or citations; 0 overfull boxes |
| BibTeX | 0 warnings |
| Citation compliance | 29 keys cited, all resolve to entries verified in T6. The one uncited entry (`stengel-eskin2023calibrated`) is left uncited on purpose, because its content has not been read |
| Numbers | Every new number was read from `research/results/phase1/*.json` or `v0.2_ADJUDICATION_REPORT.md` in this session; the full trace table is T15 |
| Safety examples | Checked against the v0.2 benchmark: TA-B194, TA-B203, TA-B009 and TA-B123 |

**Deliberately left for later:**

| Item | Why it waits |
|---|---|
| κ results and the v0.2.1 column | Waiting on the annotation study (T9–T12) |
| Regenerated figures without controls | The captions now say the figures include them |
| A claim-to-file trace table | Task T15 |
| External re-review with `academic-paper-reviewer` | Next step. It should run in a session where the skill is loaded |
