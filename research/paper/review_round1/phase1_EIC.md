# Journal-Fit Review Report (EIC seat, Phase 1)

## Pre-commitment (written before the manuscript was opened)

Mode note: no sprint-contract JSON was supplied to this seat, so the sprint-contract Phase 1 grammar (`## Contract Paraphrase` / `## Scoring Plan`) does not apply. In its place, this seat recorded its review criteria to this file before opening the manuscript, using only the header facts and Configuration Card #1.

criteria_binding_unavailable

Committed criteria (informal, from Card #1 and the eic_agent protocol):
- C1 Contribution clarity: one clear, student-sized contribution, stated in the abstract and introduction and matched by the conclusion. Warn if the contribution is split across several co-equal claims; block if no single contribution can be stated.
- C2 Honest positioning: the contribution is stated relative to the NL2Bash/NL2SH generation line and to retrieval-based command assistance without overclaiming novelty. Warn if novelty is asserted without a comparison; block if a directly overlapping prior line is omitted.
- C3 Headline-evidence match: the headline (reliability improves; accuracy gain fragile) is what the reported evidence supports, with no over-promising. Warn on wording stronger than the evidence; block if the headline contradicts the reported results.
- C4 Scope disclosure: narrow scope (single tool, 279 Windows commands, partly AI-authored benchmark) is stated plainly and early. Warn if disclosed only late or in Limitations; block if undisclosed.
- C5 Readability in 8 pages: the main point survives the hedges, subsets and sensitivity analyses. Warn if a reader cannot extract the main result from abstract + intro + one table; block if the paper cannot be followed.
- C6 Venue fit (informal): an ACL-family SRW audience would find it useful; format/length plausibly compliant as far as plain text allows. No formal venue-alignment claim.
- C7 Structural coherence: title, abstract, introduction, conclusion consistent.

---

# Peer Review Report

## Manuscript Information
- **Title**: Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study
- **Manuscript ID**: not assigned (anonymized review build)
- **Review Date**: 2026-09-28
- **Review Round**: Round 1

## Reviewer Information

### Reviewer Role
Journal-Fit Reviewer (internal role: EIC)

### Reviewer Identity
Senior NLP researcher who has repeatedly served as a faculty mentor and reviewer for ACL-family student research workshops, working on evaluation methodology and language resources.

### Review Focus
Whether the paper makes one clear, student-sized contribution that an ACL audience would find useful and states it honestly against the NL2Bash/NL2SH generation line; whether its narrow scope is acceptable and plainly stated; and whether the main point is readable in 8 pages under the weight of hedges and sensitivity analyses. Statistical detail and IR baselines are left to other seats.

### Venue and input disclosures
- Target: EACL 2027 Student Research Workshop, long paper (author-confirmed). `criteria_binding_unavailable`: no criteria manifest was supplied, so this report makes no formal venue-alignment claim. Venue fit is judged informally.
- Input was plain text extracted from the PDF. Tables are flattened (Table 3 especially), and Figures 1 to 5 are not visible. I could not check page count or layout, and I made no judgement on figure quality.
- The manuscript contains no instruction-like text addressed to reviewers. No integrity finding arises on that front.

## Overall Assessment

### Recommendation
- [x] **Major Revision**: substantial revisions are needed, and the paper should be reviewed again after revision.

### Confidence Score
4. SRW fit, framing and presentation are within my core competence. I did not assess the statistical and IR details.

Confidence is an uncertainty/scope disclosure only; it never changes consensus counts, severity, decision bearing, or arbitration.

### Calibration Status
`NOT_CALIBRATED`

### Summary Assessment
The paper audits a published, offline BM25 command-retrieval tool (279 Windows commands). The tool is often confidently wrong: 86% mean confidence on wrong answers. The paper then tests whether a small hybrid lexical+MiniLM retriever with post-hoc calibration, OOD rejection and selective prediction improves reliability without an LLM. The evaluation is careful for a student paper. It uses nested CV, removes positive controls from headline figures, reports exact tests with intervals, and discloses null, weak and fragile results unusually openly. The honest headline, that reliability improves while the accuracy gain is fragile, is supported and stated plainly in the Discussion. This is useful, student-sized work that fits an ACL SRW audience.

The obstacles are framing and readability, not the substance. The title and research question centre the hybrid architecture. The most robust result, recalibration of the shipped confidence, does not need the hybrid, and the hybrid-specific accuracy gain is the fragile one. The abstract is about 320 words against ACL's 200-word limit. The OOD headline there omits the selection effect that the body documents. Several parallel views of every number (controls in or out, Split A or B, subsets, two sets of CIs) bury the main point. All of this can be fixed by rewriting, with no new experiments, hence Major Revision.

---

## Strengths

### S1: Scope is disclosed early and plainly
The introduction states the single tool, the 279-command Windows corpus and the fact that the hybrid is a prototype outside the shipped package. The abstract discloses the AI-authored queries and that v0.1 and v0.2 are not independent. A reader is not misled about scale.
**Evidence Anchor**: text: §1 "The hybrid retriever we evaluate is a research prototype and is not part of the published package."

### S2: Honest ranking of which claims hold
The Discussion ranks its results by strength and labels the accuracy gain suggestive rather than established. It also says calibration changes reported confidence, not decisions. This matches the evidence reported and is the right model of claim discipline for a student venue.
**Evidence Anchor**: text: §9 "The clearest results concern reliability, not accuracy."

### S3: A concrete, motivating audit finding
The "confidently wrong" diagnosis is specific, measured and practically meaningful for a user-facing tool. It gives the paper a clear problem statement that goes beyond "improve accuracy".
**Evidence Anchor**: text: §3 "Mean confidence on the 49 wrong (non-rejected) predictions: 86.06%, with 44.9% of failures at exactly 100% confidence"

### S4: Good evaluation practice that an SRW audience can learn from
The 25 verbatim-copy canonical queries are treated as a positive control and kept out of headline figures. A grouped split checks tuning leakage. The paper also draws a methodological lesson about power at small benchmark sizes. These are transferable practices.
**Evidence Anchor**: text: §3 "we treat them as a positive control and exclude them from headline figures"

### S5: The OOD result is broken down by the kind of request
The paper does not stop at an aggregate rejection rate. It shows that the gain comes mainly from non-computing requests and reports the false-rejection cost. This is the reading a practitioner needs.
**Evidence Anchor**: text: §6 "The gain comes mostly from requests that are not computing tasks."

---

## Weaknesses

### W1: The title and research question centre the hybrid architecture, while the strongest evidence does not depend on it
**Problem**: The title ("Reliability-Aware Hybrid Retrieval"), the research question (does the hybrid architecture "measurably improve accuracy and reliability") and the first sentence of the Conclusion credit the hybrid-plus-calibration system. The most consistent result, a 79% ECE reduction, is obtained by recalibrating the shipped BM25 baseline's own confidence and involves no hybrid. The results specific to the hybrid are the fragile accuracy gain (significance depends on one query), better error ranking (AURC/AUGRC/correctness AUROC) and OOD rejection. The paper has five co-equal contributions, two of which (4 and 5) describe how it reports rather than what it found. A reader cannot tell what the one contribution is.
**Evidence Anchor**: text: §10 "A lightweight, fully offline, non-LLM hybrid retriever with post-hoc calibration improves the reliability of a shipped BM25 command-retrieval baseline."
**Why it matters**: A reviewer at the target venue will read the title and abstract, expect an architecture paper, and find that the architecture's own gain is the weakest claim. The paper then looks as if it over-promises, even though its body is candid.
**Suggestion**: Frame the paper around one contribution. For example: "a shipped no-LLM command retriever is confidently wrong; standard recalibration and a local hybrid signal repair reliability, but not clearly accuracy." Make the hybrid one arm of that study. Reduce the contributions to two or three that are findings, and move "disclosure" and "Holm-corrected significance" into the method description. Change the title to match, and split the Conclusion's first sentence into what calibration alone does and what the hybrid adds.
**Severity**: Major
**Confidence**: 4 (core expertise: reviewing and mentoring ACL student papers on framing)

### W2: Too many parallel versions of each number bury the main point
**Problem**: Each comparison appears in several versions: with and without canonical controls, Split A and Split B, v0.1 and v0.2, five sensitivity subsets, and bootstrap CIs in the text (controls excluded) next to different CIs in the Table 2 caption (controls included). The Limitations admit that headline figures and most tables use different populations. Caveats are woven into every results paragraph, for example "significant, but by 0.003". In plain-text form, §6 is very hard to follow.
**Evidence Anchor**: text: Limitations "Headline figures exclude them, but the Holm table, sensitivity table, Split B table, and figures include them."
**Why it matters**: In 8 pages, a student-workshop reader has to be able to take the main result from the abstract, the introduction and one table. At present, that requires reconciling several inconsistent views. Card #1 asks exactly this question, and the paper does not yet pass it.
**Suggestion**: Pick one reporting population (controls excluded) and use it in every main-text table. Add one "claims and their status" table: claim, effect with CI, test, robust or fragile, and where the robustness check lives. Move Split B, the bare-keyword sensitivity analysis and the per-subset p-values to the appendix and summarise them in one sentence each. Keep each caveat once, in Limitations, rather than repeating it in the abstract, results, discussion and conclusion.
**Severity**: Major
**Confidence**: 4 (core expertise: SRW reviewing, presentation of evaluation results)

### W3: The abstract's OOD headline leaves out the selection effect that the body documents
**Problem**: The abstract headlines a doubling in OOD rejection with Holm-adjusted p = 0.00006. The body shows two things the abstract omits. First, the 35 added OOD queries were confirmed as OOD partly with the same retrieval scores the detector thresholds. Second, on the 15 original OOD queries the gain is not significant (9/15 vs. 4/15, p = 0.0625). The abstract does mention the non-computing breakdown, but not that the only significant OOD result comes from queries screened with the detector's own features.
**Evidence Anchor**: text: Abstract "OOD rejection doubles on v0.2 (17/50→34/50; Holm-adjusted p = 0.00006)"
**Why it matters**: The OOD result is the paper's third main claim. As written, the abstract states it more strongly than the paper's own §3, §6 and Limitations support. The paper is candid about selection effects everywhere else, so this is the one place a reader could be misled.
**Suggestion**: Add one clause to the abstract, for example: "on queries partly screened with the detector's own scores; not significant on the 15 original OOD queries." Alternatively, report the original-subset and added-subset rates side by side. If space is short, remove the Holm p from the abstract.
**Severity**: Major
**Confidence**: 4 (the mismatch is visible in the text; how large the selection effect is belongs to the methodology seat)

### W4: The abstract is too long for the venue format
**Problem**: The abstract is about 320 words and contains roughly two dozen numeric results, a κ, and a statement about pending work. ACL's formatting guidelines (ACLPUB, acl-org.github.io/ACLPUB/formatting.html) say an abstract should be no longer than 200 words.
**Evidence Anchor**: text: Abstract, about 320 words, beginning "Natural-language interfaces to the shell are usually framed as generation (NL2Bash, NL2SH)."
**Why it matters**: It is a format issue, and in its current form the abstract is also the main place where W2 and W3 show.
**Suggestion**: Cut to 200 words or fewer: the problem (confidently wrong), the approach, three results with one number each, and one sentence on fragility and exploratory status. Move κ, the answerable-query false-rejection count and the pending study to the body.
**Severity**: Minor
**Confidence**: 5 (venue format rule, verified)

### W5: The paper does not explain why the calibration headline is significant
**Problem**: The baseline's "confidence" is a clipped heuristic transform of the BM25 score, not a probability. A large ECE reduction from any fitted monotone recalibration is therefore expected. The paper leads with this as its "most consistent result" but does not argue why it is non-trivial or what it buys the user, given that the paper itself shows calibration does not change decisions.
**Evidence Anchor**: text: §3 "Confidence = min(round(score/8 × 100), 100), rejected below score < 2.0"
**Why it matters**: A critical reader may call the headline obvious. The more distinctive findings are the audit diagnosis and the error-ranking result. Those should carry the significance argument.
**Suggestion**: State plainly that recalibrating an uncalibrated heuristic score is expected to help. Then argue what is non-obvious: the magnitude on so few samples, the fact that three calibrators agree, and that it survives grouping by intent. Add one sentence on what a displayed calibrated confidence enables for a user, or say honestly that this is untested.
**Severity**: Minor
**Confidence**: 4 (general evaluation expertise; the formal calibration questions belong to the methodology seat)

### W6: Positioning skips retrieval-based command and code assistance
**Problem**: Related Work places the paper against the generation line (NL2Bash, NLC2CMD, NL2SH, BashCoder-R1) and against calibration and out-of-scope literature, which is honest and well done. It does not discuss prior work that retrieves over command documentation or instruments the shell for assistants. Two verified examples: DocPrompting (Zhou et al., "DocPrompting: Generating Code by Retrieving the Docs", ICLR 2023), which introduced a Bash tldr dataset and retrieves command documentation; and Project CLAI (Agarwal et al., "Project CLAI: Instrumenting the Command Line as a New Environment for AI Agents", arXiv:2002.00762, 2020). Separately, the introduction sets retrieval up as an alternative to generation, but no generative system is compared. The hallucination advantage is structural, not measured.
**Evidence Anchor**: absence: §2 Related Work — expected discussion of retrieval-based NL-to-command or documentation-retrieval assistants; checked §1, §2, Limitations, References
**Why it matters**: The novelty claim is appropriately limited to "this combination", so this is not a novelty-killing omission. A domain reader will still expect the retrieval side of the field to be located.
**Suggestion**: Add two or three sentences on retrieval-based command and documentation assistance. Say explicitly that no generative baseline is run and that the comparison with generation is conceptual. The domain seat may name further works.
**Severity**: Minor
**Confidence**: 3 (adjacent: the literature depth belongs to the domain seat)

### W7: "Answerable" means two different query sets
**Problem**: §3 and Table 3 use "answerable" for the 121 queries shared by both versions. The abstract, §6 and §9 use "answerable" for all 159 non-OOD v0.2 queries, which include 38 ambiguous ones. Similarly, the abstract's 67.3% baseline figure includes the canonical controls and OOD queries, and the next sentences say headline figures exclude the controls.
**Evidence Anchor**: text: Abstract "it wrongly rejects 11 of 159 answerable queries" versus §3 "the 121 answerable queries are identical in both versions"
**Why it matters**: The inconsistency is in the abstract and in the false-rejection cost, one of the paper's central honest caveats.
**Suggestion**: Use "non-OOD" for the 159 or 135 queries and keep "answerable" for the 121. Label the 67.3% as overall accuracy including controls, or replace it with the controls-excluded figure.
**Severity**: Minor
**Confidence**: 5 (internal consistency, verified in text)

### W8: Headline evidence sits in the appendix, and the main text has no figure
**Problem**: The reliability diagram for the headline calibration result (Figure 2), the risk-coverage curves (Figure 4), the ablation figure and the Split B table (Table 4) are all in Appendix A, and the main text relies on them. ACL practice is that reviewers need not read appendices and that the paper must stand without them.
**Evidence Anchor**: text: §6 "(Table 4, Appendix A; controls included)"
**Why it matters**: The paper's core claim is about reliability. Its most persuasive visual is one reviewers may never see.
**Suggestion**: Move one compact figure into the main text, such as the before and after reliability diagram or the risk-coverage curves, using space freed by W2. Replace Table 4 with a one-sentence summary. (I could not see the figures and make no judgement on their quality.)
**Severity**: Minor
**Confidence**: 4 (venue practice; figure content not visible)

### W9: Anonymity risk, and it is unclear who owns the audited baseline
**Problem**: The system is named (TermAssist) and described as a previously published npm package, which a reviewer could look up. The paper also uses "our own baseline audit" and "the project's human director", which suggests the authors built the baseline. It never says so. Calling it a "real shipped baseline" reads as a third-party audit.
**Evidence Anchor**: text: §1 "implemented in a real, previously published npm package"
**Why it matters**: Under double-blind review, a named, publicly searchable package can de-anonymize authors. Separately, readers judge an audit of one's own tool differently from an independent one. Both framings are fine for an SRW if stated.
**Suggestion**: For the review version, anonymize the package name and avoid pointing to where it is published. Say in neutral third-person wording whether the baseline was developed by the authors. I did not search for the package, to preserve blind review.
**Severity**: Minor
**Confidence**: 3 (depends on what the public package page reveals, which I did not check)

### W10: BashCoder-R1 is described as execution-trained, which its public description does not support
**Problem**: BashCoder-R1 is described as trained by reinforcement learning against execution feedback. Its public abstract (arXiv:2606.27733; ISSTA 2026) describes a reward that combines syntax correctness, robustness as checked by the static analyzer shellcheck, and format adherence. The cited title also follows the arXiv wording ("Bash Code Generation"), while the ISSTA program lists "Bash Script Generation".
**Evidence Anchor**: text: §2 "despite reinforcement-learning training against execution feedback"
**Why it matters**: This is a small accuracy issue in the positioning paragraph that frames the paper against the generation line.
**Suggestion**: Check the description against the paper and change it to "static-analysis-based robustness reward" if that is correct. Align the title with the version of record.
**Severity**: Minor
**Confidence**: 3 (based on the public abstract only)

---

## Detailed Comments

### Journal Fit (informal; no binding manifest)
- Topic: NL-to-command assistance with a reliability evaluation sits within the ACL family's scope. It is closest to evaluation methodology and to intent classification with out-of-scope detection, which the paper itself identifies (Larson et al., 2019) as the closest task framing. An SRW audience will find the audit story, the positive-control handling and the power lesson useful.
- Scale: one tool, 279 Windows intents and a partly AI-authored 209-query benchmark are acceptable for a student research workshop, which accepts small, carefully bounded studies and in-progress work. The paper states this scope plainly (S1). At a main-conference venue the same scope would be a serious obstacle. At the SRW it is not.
- Pending work: the two-annotator study and the corrected benchmark are declared as in progress. SRWs accept this, but the abstract should not spend space on it (W4).
- Length: the main text is about 4,900 words including flattened tables, which plausibly fits 8 pages. I cannot verify page count from the text.
- References: 29, relevant to both communities involved (NL-to-code and ML reliability). The three 2026 preprints and papers cited (QuoteBench, arXiv:2608.13547; "BM25 Wins at Scale", arXiv:2607.26497; BashCoder-R1, ISSTA 2026) exist. The scaling-study citation is only weakly relevant at a corpus of 279 records, as the paper itself concedes.

### Originality
- The paper claims novelty only for the combination (calibration, OOD rejection and selective prediction for closed-vocabulary NL-to-shell retrieval), qualified by a targeted search. That is modest and appropriately worded. Individually the components are standard. The originality lies in applying a reliability evaluation to a real no-LLM command assistant and in the audit finding.

### Significance
- The impact is local to a sub-field but practically relevant: offline, deterministic command assistants that must know when they do not know. The distinctive findings are the audit (S3), better error ranking by the hybrid confidence, and the OOD breakdown with its false-rejection cost (S5). The calibration headline needs a clearer significance argument (W5). Without a user study, the practical value of the displayed confidence is asserted, not shown. Limitations acknowledge this.

### Structural Coherence
- The research question has two parts, accuracy and reliability, and the paper answers both honestly: reliability yes, accuracy suggestive. There is little over-promising in the body. The coherence problem is title → contributions → conclusion, which credit the hybrid architecture for results that are mostly architecture-independent (W1). The Discussion is the best-written section and should shape the introduction.

### Title & Abstract
- Title: the subtitle "A Non-LLM Study" is distinctive and useful at a 2027 venue. A reader may still be surprised that an AI agent authored part of the benchmark. One clause in §1 saying "no LLM in the system; an AI agent assisted benchmark authoring" would prevent that. The main title should follow the reframing in W1.
- Abstract: too long (W4), too many numbers (W2), OOD overstated (W3) and inconsistent terminology (W7). Its honesty about exploratory statistics and non-independence is a strength and should survive the cut, in one sentence.

### Conclusion
- The conclusion matches the Discussion in substance but opens with the architecture-centred sentence (W1). The prioritised future-work list is concrete and sensible. The statement that human-effort items should not be replaced by bulk automated generation is a welcome note.

---

## Questions for Authors
1. Was the audited BM25 tool developed by the authors? If so, how will the camera-ready describe the audit so that readers can weigh its independence, and how is the package name handled for blind review?
2. If you had to state the paper's single contribution in one sentence, which is it: the audit and recalibration of a shipped confidence, or the hybrid architecture? Would you retitle accordingly?
3. What is the OOD rejection gain on the 15 original OOD queries plus the 10 terminal-task OOD queries only, that is, excluding everyday requests screened with retrieval scores? Would you put that figure in the abstract instead of the Holm p on all 50?
4. Can you name one user-facing decision that a calibrated confidence enables in TermAssist, given that calibration does not change which commands are returned or rejected?

---

## Minor Issues

### Language / Grammar
- Text extraction has fused several hyphenated compounds ("closedvocabulary", "outof-scope", "Holm–Bonferronicorrected", "pvalues"). Check the PDF for hyphenation artefacts.
- §9 "real in size but not established in significance": "real" overstates a point estimate whose v0.2 CI reaches 0.7. Consider "consistent in size".

### Citation Format
- The Zadrozny and Elkan 2002 and 2001 citations are listed out of chronological order in §2.
- Wang et al. (2026) is weakly relevant at this corpus scale. Consider cutting it to save space.

### Figures and Tables
- Table 3 would be easier to read transposed, with one row per subset and three columns. The extracted text suggests it is dense.
- The Table 2 caption carries a second set of CIs that differ from the text's CIs for the same comparisons (W2). Keep one.

### Layout
- A Limitations section with 13 bullets is thorough but long. Merging related bullets (the three statistics bullets, the two label bullets) would free space for W8.

---

## Criterion-Bound Judgements

Calibration status: `NOT_CALIBRATED`

| Dimension / criterion | Criterion source | Judgement | Evidence anchors | Rationale | Uncertainty or scope limit | Decision bearing? |
|---|---|---|---|---|---|---|
| C1 Contribution clarity | Card #1 focus 1; pre-commitment C1 | PARTLY_MEETS | text: §10 "A lightweight, fully offline, non-LLM hybrid retriever with post-hoc calibration improves the reliability" | Five co-equal contributions; the title credits the architecture for architecture-independent results (W1) | none identified | yes: needs reframing before acceptance |
| C2 Honest positioning | Card #1 focus 1; pre-commitment C2 | MEETS | text: §2 "this combination, not any single component, is new" | Positioned honestly against the generation line; the retrieval-side literature is thin (W6) | literature depth belongs to the domain seat | no |
| C3 Headline-evidence match | Card #1 "particularly care about"; pre-commitment C3 | PARTLY_MEETS | text: Abstract "OOD rejection doubles on v0.2" | The Discussion's hierarchy matches the evidence (S2); the abstract overstates OOD (W3) | size of the selection effect not assessed | yes: abstract correction required |
| C4 Scope disclosure | Card #1 focus 2; pre-commitment C4 | MEETS | text: §1 "research prototype and is not part of the published package" | Single tool, corpus size and AI authorship stated in the abstract and §1 (S1) | none identified | no |
| C5 Readability in 8 pages | Card #1 focus 3; pre-commitment C5 | PARTLY_MEETS | text: Limitations "Headline figures exclude them, but the Holm table, sensitivity table, Split B table, and figures include them." | Parallel versions of numbers and repeated caveats bury the main point (W2) | figures not visible | yes: substantial rewrite |
| C6 Venue fit (informal) | Card #1; pre-commitment C6; ACLPUB formatting guide | PARTLY_MEETS | text: Abstract (about 320 words) | Topic and scale suit an SRW; abstract exceeds 200 words (W4); anonymity risk (W9) | no formal criteria binding; page count unverifiable | partly: format fixes are mechanical |
| C7 Structural coherence | eic_agent Step 4; pre-commitment C7 | PARTLY_MEETS | text: §1 "Can a lightweight hybrid lexical+local-semantic retrieval architecture" | The research question is answered honestly; title, contributions and conclusion are misaligned (W1) | none identified | yes, via C1 |
| Originality | template rubric | MEETS | text: §2 "to our knowledge this combination, not any single component, is new" | Modest novelty from combining components, appropriately claimed | depends on domain-seat literature check | no |
| Methodological Rigor | template rubric | NOT_ASSESSED | — | Outside this seat's remit | methodology seat | — |
| Evidence Sufficiency | template rubric | NOT_ASSESSED | — | Outside this seat's remit | methodology seat | — |
| Argument Coherence | template rubric | PARTLY_MEETS | text: §9 "The clearest results concern reliability, not accuracy." | The Discussion is coherent; the framing sections are not (W1) | none identified | yes, via C1 |
| Writing Quality | template rubric | PARTLY_MEETS | text: §6 "significant, but by 0.003" | Precise but over-hedged and dense (W2, W7) | plain-text extraction | yes, via C5 |
| Literature Integration | template rubric | PARTLY_MEETS | absence: §2 — expected retrieval-based command assistance; checked §1, §2, References | Calibration and generation literature well integrated; retrieval side thin (W6) | domain seat | no |
| Significance & Impact | template rubric | MEETS | text: §3 "44.9% of failures at exactly 100% confidence" | Sub-field-local but practically relevant; the calibration significance argument needs strengthening (W5) | no user study | no |

Recommendation rationale: the unresolved decision-bearing criteria are C1/C7 (framing), C3 (the abstract's OOD claim) and C5 (readability). All can be fixed by rewriting, without new experiments or re-analysis. No criterion is failed outright, and the scientific core (a reliability improvement that is honestly bounded) survives. Hence Major Revision rather than Reject, and not Minor, because the abstract, introduction, title and results presentation all need substantial rework and a second look.
