# Phase 1 Seat Report: Peer Reviewer 2 (Domain), internal role R2

Sprint contract applied: `shared/contracts/reviewer/full.json` (`reviewer/reviewer_full/v2`). The pre-commitment below was written from paper metadata only (title, field and word count from the Phase 0 header), before the manuscript was opened.

Paper metadata used: title "Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study"; field: NLP (NL-to-command mapping, retrieval evaluation); about 7,200 words.

---

# Part A: Paper-blind pre-commitment (sprint contract Phase 1)

## Contract Paraphrase

D1 methodology_rigor. From a domain seat this is the question of whether the study design, the data handling and the statistics would pass review in the field. It belongs to the methodology reviewer, and I do not score it. My only interest in it is whether the design choices (corpus, metric, baselines) are ones the field accepts.

D2 domain_accuracy. The paper's claims have to match what the field currently knows. Prior work in NL-to-command, tool and API retrieval, hybrid lexical-dense retrieval and reliability or calibration must be described correctly, the closest work must be acknowledged, terms must be used the way the field uses them, and no result may be misstated. This is my dimension.

D3 argumentative_coherence. The core thesis must hold together and the evidence must support what is claimed. The devil's advocate and the methodology reviewer score it. I only report domain-driven logical leaps, as findings.

D4 cross_disciplinary_relevance. Readers from adjacent fields (IR, ML reliability, developer tools) should be able to follow the framing and definitions, and any interdisciplinary claim must be backed up. The perspective reviewer scores it.

D5 writing_and_structure. This covers organisation, clarity, tables and figures, and venue conventions. The journal-fit reviewer scores it.

D6 venue_fit_and_contribution. The paper should fit the configured venue and make an original, significant contribution. The journal-fit reviewer scores it. Where I have evidence on originality relative to prior work, it goes into D2 findings.

## Scoring Plan

### D2: domain_accuracy
dimension_id: D2
what_to_look_for: correct and adequately complete positioning against NL-to-command, tool/API retrieval, hybrid lexical-dense fusion and selective-prediction/calibration literature; accurate description of cited work; field-conventional terminology; baselines the field recognises; claims scoped to the evidence
what_triggers_block: a headline novelty or positioning claim is contradicted by closely related prior work that the paper omits or misrepresents, or a central domain concept is misdefined so that a headline claim is misstated, repairable by repositioning and rewriting
what_triggers_warn: notable gaps in literature coverage, imprecise or non-standard terminology, or overclaiming relative to prior work that does not overturn the core contribution
what_triggers_fatal: the central contribution is already fully published in prior work, or the core claims rest on a domain factual error that cannot be repaired without a different study

criteria_binding_unavailable

[CONTRACT-ACKNOWLEDGED]

---

# Part B: Paper-visible review (sprint contract Phase 2)

## Manuscript Information
- **Title**: Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study
- **Manuscript ID**: none (anonymised review build, `manuscript_review.txt`)
- **Review Date**: 2026-09-28
- **Review Round**: Round 1
- **Target venue (author-confirmed)**: EACL 2027 Student Research Workshop, long paper. `criteria_binding_unavailable`: I was given no formal criteria manifest, so this report makes no formal venue-alignment claim.

## Reviewer Information

### Reviewer Role
Peer Reviewer 2 (Domain), internal role R2.

### Reviewer Identity
Researcher in semantic parsing and NL-to-code/command systems, with a background in information retrieval. Familiar with NL2Bash, NLC2CMD, Tellina, CLAI, tool and API retrieval, dense retrievers, and hybrid lexical-dense fusion (Configuration Card #3).

### Review Focus
Three questions. (1) Does the paper cite and position itself against the closest retrieval-based command assistants, tool/API retrieval work and hybrid-fusion methods? (2) Is BM25 plus one small MiniLM encoder with linear fusion a fair comparison set? (3) Does the contribution matter to the field, given a closed 279-command corpus and exact-match scoring, and does the novelty claim ("this combination is new") survive a literature check?

## Overall Assessment

### Recommendation
- [ ] Accept
- [ ] Minor Revision
- [x] **Major Revision**
- [ ] Reject

Most of the changes I ask for are textual: repositioning and corrected descriptions of prior work. One requested change is a cheap sensitivity run. I recommend Major rather than Minor because the research-gap argument has to be rewritten against prior work the paper omits or misdescribes, and that rewrite should be re-checked.

### Confidence Score
4. The work is mostly within my expertise (NL-to-command, retrieval, calibration in NLP). I am less expert in the statistics (Reviewer 1's remit) and did not assess them.

Confidence is an uncertainty/scope disclosure only; it never changes consensus counts, severity, decision bearing, or arbitration.

### Calibration Status
`NOT_CALIBRATED`

### Summary Assessment
The paper evaluates a fully offline, non-LLM retriever for natural-language-to-shell assistance. It audits a shipped BM25 command-retrieval baseline, adds a MiniLM dense channel with tuned linear fusion, margin and top-score detectors for out-of-scope and ambiguous queries, and post-hoc calibration. It evaluates the result on a 279-intent Windows corpus with two nested benchmark versions. From a domain standpoint the reliability analysis is well grounded. The calibration, selective-prediction and OOD-scoring literature is cited to the correct original sources and is recent (AUGRC, Traub et al. 2024). The parallel the paper draws to text-to-SQL error detection is accurate, and the claims are carefully scoped.

The main weakness is positioning within NL-to-command work. The paper presents closed-set retrieval as an alternative to a generative mainstream. It does not acknowledge two things. First, the NLC2CMD competition it cites already scored confidence as part of its metric and included a TF-IDF retrieval entry with a learned confidence adjuster. Second, lexical-plus-semantic retrieval of shell commands has been published before (ShellFusion, ICSE 2022). Tool/API retrieval, fusion-function analysis and ranker-calibration work are also absent, and the detectors are not linked to query performance prediction in IR.

I searched independently and found no prior work that evaluates calibration, out-of-scope rejection and selective prediction together for closed-set shell-command retrieval. The narrow novelty claim therefore survives. The gap argument around it needs rewriting. I recommend Major Revision because the repositioning is substantive, but no new data collection is required.

contract_role: domain

## Dimension Scores

### D1: methodology_rigor
score: not_assessed

### D2: domain_accuracy
score: warn
trigger: "notable gaps in literature coverage"

### D3: argumentative_coherence
score: not_assessed

### D4: cross_disciplinary_relevance
score: not_assessed

### D5: writing_and_structure
score: not_assessed

### D6: venue_fit_and_contribution
score: not_assessed

## Review Body

**Why D2 is warn and not block.** My Phase 1 block trigger requires a headline novelty or positioning claim to be *contradicted* by omitted or misrepresented prior work. The paper's novelty claim is explicitly limited to the combination of calibration, out-of-scope rejection and selective prediction for closed-set NL-to-shell retrieval. My targeted search (sources listed under Missing Key References) found no prior work that contradicts it. The closest precedents, the NLC2CMD TF-IDF entry and ShellFusion, weaken the gap argument (W1, W2) but do not pre-empt the combination. The fatal trigger does not apply either: no prior publication contains the contribution, and I found no domain factual error the core claims rest on.

**Instruction-injection check.** The manuscript contains no text addressed to reviewers or to automated systems.

### S1: Reliability toolkit cited to correct original sources, including recent work
The calibration and selective-prediction methods are attributed to their original sources. ECE is attributed to Pakdaman Naeini et al. (2015) and Guo et al. (2017). Histogram binning and isotonic regression are attributed to Zadrozny and Elkan (2001, 2002), and Platt scaling to Platt. AURC is attributed to Geifman et al. (2019), where it originates, and AUGRC to Traub et al. (2024), a recent NeurIPS paper. Using a tie-aware risk-coverage computation because the shipped confidence saturates is a careful application of that literature, not a superficial one.
**Evidence Anchor**: text: §5 "the area under it (AURC; Geifman et al., 2019) and the area under the generalized riskcoverage curve (AUGRC; Traub et al., 2024)"

### S2: The OOD breakdown is accurately connected to adjacent findings
The paper finds that its detector mostly rejects non-computing requests and rarely rejects uncovered terminal tasks. It links this to the text-to-SQL finding that selective classifiers mostly catch irrelevant questions. I checked Somov and Tutubalina (AAAI 2025; arXiv 2501.09527): they report that the higher-probability errors their classifiers detect concern irrelevant questions rather than incorrect query generations, so the paper's summary is accurate. Integrating an adjacent finding like this is the kind of critical synthesis a domain reviewer looks for.
**Evidence Anchor**: text: §2 "In text-to-SQL, selective classifiers mostly catch irrelevant questions rather than wrong queries (Somov and Tutubalina, 2025), which parallels our OOD breakdown (§6)."

### S3: The novelty claim is explicitly bounded and not overstated
The paper claims novelty only for the combination, not for any component, and states in Limitations how narrow its literature search was. That limits the damage done by the positioning gaps below.
**Evidence Anchor**: text: §2 "to our knowledge this combination, not any single component, is new."

### S4: Most cited recent work is described accurately
I checked the recent citations against their sources:
- NL2SH's "up to 32%" gain (Westenfelder et al., NAACL 2025; arXiv 2502.06858) is accurate.
- Notaro et al. (arXiv 2412.01655) is accurately described as a transformer-based command-risk classifier.
- QuoteBench (arXiv 2608.13547) is accurately described.
- The 10M-token crossover in Wang et al. (arXiv 2607.26497) is accurate.
The one exception is BashCoder-R1 (W6).
**Evidence Anchor**: text: §2 "reporting that parsing, in-context learning, in-weight learning, and constrained decoding improve LLM translation accuracy by up to 32%"

### S5: The practical problem is real and correctly framed as reliability, not only accuracy
A shipped system that reports an ad hoc, saturating confidence (min(score/8 × 100, 100)) and is often wrong at 100% confidence is a concrete, deployable failure mode. Treating it as a calibration and selective-prediction problem, instead of chasing top-1 accuracy, fits current NLP reliability work (Kamath et al. 2020; Dong et al. 2018, both cited).
**Evidence Anchor**: text: §3 "Mean confidence on the 49 wrong (non-rejected) predictions: 86.06%, with 44.9% of failures at exactly 100% confidence"

### W1: The closest retrieval-based NL-to-shell work is omitted, which weakens the research gap
**Problem**: The paper presents closed-set retrieval as "a constrained alternative" to a generative mainstream (Abstract, §1). Related Work cites only generation-oriented NL-to-shell work plus the NLC2CMD metric. Two closely related retrieval precedents are missing:
- **The NLC2CMD competition report the paper cites** (Agarwal et al., 2021, team AINixCLAISimple) describes a TF-IDF retrieval approach over indexed NL-command pairs. Even its plainest variant scored about 2.6 times the Tellina baseline. The team reports that its best variant (0.472) came within 12% of the best system, at 10 ms or less latency. The leaderboard lists 0.429 for this entry because, according to the report, the confidence-adjusted variant failed to upload. The team also fitted a logistic-regression model on features including the TF-IDF score to lower its output confidence on hard queries, and noted that pairing the retriever with "poorly calibrated score estimates" limited another strategy. That is a published precedent for estimating confidence on a retrieval-based NL-to-bash system. The same report argues that non-parametric retrieval-based models have advantages for adding new commands. (I verified all of this in the text of arXiv 2103.02523v2: the AINixCLAISimple description, Table 1 and Table 2.)
- **ShellFusion** (Zhang et al., ICSE 2022) recommends shell commands for a task query. It uses Lucene lexical retrieval followed by IDF-weighted word2vec semantic similarity over Stack Exchange questions, filtered against man pages and TLDR. In other words, it is a lexical-plus-semantic hybrid retriever for shell commands. It was evaluated with MRR/MAP against Magnum, the NLC2CMD winner.

Neither undercuts the specific combination the paper claims. But the claim that "no prior evaluation" exists is stated without these reference points, and the intro's generative-mainstream framing is incomplete given the cited competition's own retrieval entry.

**Evidence Anchor**: text: §2 "A targeted search (Limitations) found no prior evaluation of calibration, OOD rejection, and selective prediction for closedvocabulary natural-language-to-shell retrieval"

**Why it matters**: A reader in this subfield will know the NLC2CMD retrieval entry and may know ShellFusion. Leaving them out makes the gap look larger than it is, and misses the most useful comparison: prior shell retrieval systems reported ranking quality but did not evaluate calibration, out-of-scope rejection or risk-coverage. That comparison is exactly what makes this paper's contribution clear.

**Suggestion**: Add a short paragraph on retrieval-based command assistance covering the NLC2CMD TF-IDF entry and its confidence adjuster, and ShellFusion. Optionally add AInix (Gros, 2019, as cited in Agarwal et al. 2021; I could not verify it independently) and DocPrompting's tldr retrieval setting. Restate the gap as "retrieval for shell commands exists and has reported ranking quality; its reliability has not been evaluated". In §1, qualify the "dominant trajectory has been generative" sentence to note that retrieval was a competitive baseline in NLC2CMD.

Field norm: ARR reviewer guidelines, H12, say that missing references to highly relevant prior work are a problem when that work was published three or more months before the deadline (https://aclrollingreview.org/reviewerguidelines). Both works date from 2021 and 2022.

**Severity**: Major
**Confidence**: 4 (core expertise: NL-to-command literature; both sources read directly)

### W2: NLC2CMD's metric is misdescribed: it was confidence-weighted, which bears directly on the paper's reliability framing
**Problem**: The paper describes the NLC2CMD metric only as a utility-and-flag-overlap score that is more tolerant than exact match. According to the competition report, each prediction carries a confidence in [0, 1] that is "factored into the competition evaluation", and the score is weighted by that confidence. The report motivates this as a way to filter out uncertain predictions for the CLAI terminal assistant. It also records that one GPT-2 team set every confidence to 1 because its model's confidences "were not calibrated and usually overconfident", and it names self-calibration as a future evaluation direction.

**Evidence Anchor**: text: §2 "The NLC2CMD competition (Agarwal et al., 2021) introduced a utility+flag-overlap metric more tolerant of near-miss answers than exact match."

**Why it matters**: The paper says it studies NL-to-shell "focus[ing] on reliability rather than accuracy alone" (Abstract). The field's main shared task already built confidence into its scoring and already observed overconfidence. Leaving this out misrepresents a cited work on exactly the dimension the paper claims as its angle. With the omission corrected, the reliability framing becomes stronger: prior evaluation rewarded confidence only through a task-specific weighted score, and this paper supplies standard calibration and risk-coverage analysis.

**Suggestion**: Correct the description of the metric. Say explicitly how ECE, AURC and AUGRC differ from NLC2CMD's confidence-weighted score, and why the difference matters for a deployed assistant. Consider citing CLAI (Agarwal et al., 2020), whose orchestration layer is the reason the metric uses confidence.

**Severity**: Major
**Confidence**: 5 (verified directly in the cited source, arXiv 2103.02523v2: the task and metric definition, the team descriptions, and the future-directions discussion)

### W3: Tool/API retrieval, fusion-function and ranker-calibration literature is not engaged
**Problem**: Retrieving one command from a curated catalogue of (intent, command, description) records is structurally tool or API retrieval: select one callable from a documented inventory given a natural-language need. That literature is not cited. It includes BIKER for API method recommendation (Huang et al., ASE 2018), the ToolLLM API retriever (Qin et al., ICLR 2024) and the ToolRet benchmark (Shi et al., Findings of ACL 2025). ToolRet reports that retrievers strong on conventional IR benchmarks do poorly on tool retrieval, which bears on the paper's weak low-overlap-paraphrase and single-keyword results. The hybrid component is also not placed in the fusion literature:
- linear BM25+dense fusion in DPR (Karpukhin et al., EMNLP 2020);
- Reciprocal Rank Fusion (Cormack et al., SIGIR 2009);
- Bruch et al.'s analysis of convex-combination versus RRF fusion (ACM TOIS 2023). It supports the paper's choice of a tuned convex combination and shows that tuning its single parameter is sample-efficient, which matters for a 135–159-query benchmark.

On reliability, calibration of neural rankers and prediction of unanswerable contexts (Penha and Hauff, EACL 2021) and calibration in semantic parsing (Stengel-Eskin and Van Durme, TACL 2023) are the closest NLP-venue precedents after the cited Dong et al. (2018).

**Evidence Anchor**: absence: §2 Related Work and §4 architecture — expected positioning against tool/API retrieval, hybrid fusion-function analysis, and ranker/semantic-parser calibration; checked §2, §4, §9, Limitations, reference list

**Why it matters**: Without these links the architecture reads as ad hoc when it actually follows established choices. It also leaves the paper's results disconnected from the communities most likely to reuse them.

**Suggestion**: Add two or three sentences with these citations. A full survey is not needed within the SRW page limit.

**Severity**: Minor
**Confidence**: 4 (core expertise: IR and tool retrieval)

### W4: The comparison set is thin: one dated small encoder and one fusion function
**Problem**: The dense channel is a single encoder, all-MiniLM-L6-v2, and fusion is a single tuned linear combination. The paper's claims about the hybrid (the BM25→hybrid gain; hybrid-over-dense on v0.2) are therefore claims about this one encoder. MTEB (Muennighoff et al., EACL 2023) finds that no single embedding method dominates across tasks, so "dense" and "hybrid" results may depend on the encoder.

Excluding a local LLM is justified by the paper's stated no-LLM premise, and I do not ask for one. ARR guidelines H5 and H14 also say SOTA comparisons are unnecessary when SOTA is not claimed. But the paper does name a design alternative ("stronger encoder") in its Limitations ("a fixed embedding model") without testing it.

**Evidence Anchor**: text: §4 "local dense retrieval (Xenova/all-MiniLM-L6-v2, a 384dimensional MiniLM sentence encoder"

**Why it matters**: The headline reliability results (calibration of the shipped confidence) do not depend on the encoder. The secondary accuracy and hybrid-over-dense findings do, and they are already fragile.

**Suggestion**: Add one sensitivity row with a stronger small open retrieval encoder that still runs offline, chosen from the MTEB retrieval tasks, and optionally RRF as an alternative fusion. Alternatively, scope the hybrid claims explicitly to this encoder. Either is acceptable for an SRW paper.

**Severity**: Minor
**Confidence**: 4 (core expertise: dense and hybrid retrieval)

### W5: "OOD" and "closed-vocabulary" are used where the field has more precise terms
**Problem**: The paper calls requests the corpus cannot serve "out-of-domain (OOD)". It also names out-of-scope intent classification (Larson et al., 2019) as its closest task framing. In that literature these are *out-of-scope* (OOS) queries. Zhang et al. (NLP4ConvAI 2022) further separate *in-domain* out-of-scope requests from general out-of-scope ones, and show that pretrained models do especially badly on the in-domain kind. That maps directly onto the paper's split between "everyday non-computing requests" (general OOS, 25/34 rejected) and "terminal tasks the corpus does not cover" (in-domain OOS, 4/10 rejected). Separately, "closed-vocabulary" in NLP usually describes a model's token vocabulary. What the paper means is a closed, fixed set of outputs.

**Evidence Anchor**: text: Abstract "post-hoc calibration and out-of-domain (OOD) rejection"

**Why it matters**: The two terms mean different things in the field. Using the established term would connect the paper's most interesting OOD result to a known phenomenon and would strengthen, not weaken, its reading of the result.

**Suggestion**: Use "out-of-scope" (or define OOD once as out-of-scope), cite Zhang et al. (2022) for the in-domain/general distinction, and replace "closed-vocabulary" with "closed-set" or "fixed-inventory".

**Severity**: Minor
**Confidence**: 4 (core expertise: intent classification and out-of-scope detection)

### W6: BashCoder-R1 is misdescribed as trained against execution feedback
**Problem**: The paper says BashCoder-R1 is "execution-grounded" and was trained with reinforcement learning "against execution feedback". According to the BashCoder-R1 paper (arXiv 2606.27733, ISSTA 2026), the R-GRPO reward is a weighted sum of three static binary checks: a `bash -n` syntax check, shellcheck robustness, and format compliance. Commands are not executed during training. Also, "FullRate" is the share of scripts that satisfy syntax, robustness *and* functional correctness together, not functional success alone. Finally, the sentence uses the result to support "exact-match accuracy alone is an incomplete signal", which it does not directly show.

**Evidence Anchor**: text: §2 "BashCoder-R1 (Yu et al., 2026), despite reinforcement-learning training against execution feedback, reaches 90% (single-line) and 73%"

**Why it matters**: It is a factual error about prior work (D2) in the paragraph that frames the task. It does not affect the paper's findings.

**Suggestion**: Describe it as RL with static-analysis rewards, reporting 90%/73% FullRate (syntax + robustness + functional). Also fix the matching phrase in §1.

**Severity**: Minor
**Confidence**: 4 (verified in the arXiv HTML of the cited paper)

### W7: The uncertainty and OOD detectors are not linked to query performance prediction in IR
**Problem**: The detectors threshold the absolute top-1 retrieval score and the top-1/top-2 margin. In IR these are post-retrieval query performance prediction (QPP) signals, a well-established literature with score-distribution predictors such as NQC (Shtok et al., ACM TOIS 2012). The paper frames them only through classifier OOD detection (Hendrycks and Gimpel, 2017).

**Evidence Anchor**: text: §6 "AUROC is 0.867 for OOD detection (feature: absolute top-1 score) and 0.784 for ambiguity detection (feature: margin)"

**Why it matters**: QPP offers stronger, standard score-based predictors for lexical retrievers, beyond the raw top-1 score, that could plausibly help with the weak ambiguity detection. It is also the natural baseline family for a "confidence of a BM25 system" study.

**Suggestion**: Cite the QPP framing in §4. Optionally add one score-distribution predictor as a feature.

**Severity**: Minor
**Confidence**: 3 (adjacent expertise: IR evaluation)

### W8: The contribution list credits the architecture, but the robust gains come from standard components
**Problem**: Contribution (2) presents a "five-component reliability-aware retrieval architecture". The paper's own results tell a different story:
- The most consistent gain, calibration, is standard post-hoc recalibration, and it works on the shipped BM25 confidence without the hybrid (79% ECE reduction on both versions).
- The OOD gain mostly repeats a known pattern: general out-of-scope requests are easier to reject than in-domain ones.
- The hybrid's accuracy gain is fragile by the paper's own account.

From a domain standpoint, the real contribution is an empirical reliability case study of a deployed closed-set command retriever. It shows that known calibration and selective-prediction findings carry over to this setting, which is a legitimate SRW contribution, and the architecture framing overstates it. The closed 279-intent Windows corpus and exact-match scoring against gold and acceptable commands are appropriate for a closed-set task. They also limit generalisation, which the paper acknowledges.

**Evidence Anchor**: text: §1 "(2) A five-component reliability-aware retrieval architecture evaluated under nested cross-validation"

**Why it matters**: Framing the contribution as a transfer or replication study of reliability findings would be more accurate. It would also be more defensible against a reviewer who knows the components are standard.

**Suggestion**: Reorder the contributions to lead with the reliability audit and calibration findings. Describe the architecture as the vehicle for the study, and say explicitly that the calibration result does not need the hybrid.

**Severity**: Minor
**Confidence**: 4 (core expertise: positioning of NLP system papers)

### W9: No recognised benchmark is used and the choice is not explained
**Problem**: All results are on a purpose-built benchmark of 150 or 209 queries, part of it AI-authored. Public NL-to-shell resources exist: NL2Bash, the NLC2CMD test data, the tldr data in DocPrompting, and NL2SH's 600-pair verified test set. The paper does not explain why none of them, or a subset mapped onto its cross-platform records, can serve as an external check.

**Evidence Anchor**: absence: §3 Benchmark and Limitations — expected a justification for not evaluating on, or mapping to, an existing public NL-to-shell benchmark; checked §2, §3, §10, Limitations

**Why it matters**: The findings cannot be compared with other studies, and there is no answer to the concern that the benchmark was written with the system's retrieval behaviour in view (§3 says each query was checked against the system's output).

**Suggestion**: Add one or two sentences explaining why the existing benchmarks do not fit (Bash vs. Windows, open vs. closed output). Where the corpus has cross-platform records, consider a small mapped subset as an external sanity check, or list this as future work.

**Severity**: Minor
**Confidence**: 3 (core expertise on benchmarks; the feasibility of mapping onto a Windows corpus is uncertain)

### Detailed Comments (domain)

**Literature review.**
- *Coverage*: Strong on calibration, selective prediction and out-of-scope intent detection. Weak on retrieval-based command assistance (W1, W2), tool/API retrieval and hybrid fusion (W3), and QPP (W7).
- *Integration*: Where it cites, it synthesises rather than lists (S2).
- *Gap argument*: Directionally correct and bounded (S3). It needs rewriting against the NLC2CMD retrieval entry, the confidence-weighted metric and ShellFusion.

**Theoretical framework.**
- *Framing*: The reliability framing (calibration, selective prediction, out-of-scope rejection) suits the research question and is applied in depth, not in name only (S1).
- *Alternatives*: QPP from IR (W7) and the in-domain vs. general out-of-scope distinction (W5) are better-fitting lenses for two of the results, and they would sharpen the discussion.

**Argument accuracy.**
- *Factual errors about prior work*: The NLC2CMD metric (W2) and BashCoder-R1 (W6). The other cited facts I checked are accurate (S4).
- *Terminology*: "OOD" and "closed-vocabulary" (W5).
- *Wang et al. (2026)*: The citation is summarised accurately. Note that the same study finds agentic search leads at its *smallest* corpus tiers, so it says little about lexical retrieval at 279 records. The paper already signals the scale gap, and one clause more would be enough.

**Contribution to the field.**
- *What it adds*: A careful, disclosure-heavy reliability audit of a deployed closed-set command retriever, and evidence that standard post-hoc calibration and score-based selective prediction transfer to this setting. It also finds that out-of-scope rejection mostly catches non-computing requests, replicating an adjacent-field pattern.
- *Scale*: Incremental and empirical, which suits an SRW long paper.
- *Overclaiming*: Low, apart from the architecture framing (W8).

### Missing Key References
All entries below were verified in this session, except the one marked [UNVERIFIED].

1. Neng Zhang, Chao Liu, Xin Xia, Christoph Treude, Ying Zou, David Lo, Zibin Zheng. 2022. *ShellFusion: Answer Generation for Shell Programming Tasks via Knowledge Fusion.* Proceedings of the 44th International Conference on Software Engineering (ICSE 2022), pp. 1970–1981. https://doi.org/10.1145/3510003.3510131 (metadata via Crossref; text read at https://seal-queensu.github.io/publications/pdf/ICSE-Neng-2022.pdf). Why: the closest lexical-plus-semantic retrieval system for shell commands (W1).
2. Agarwal et al. 2021 (already cited). Cite §4, team AINixCLAISimple (TF-IDF retrieval entry with a logistic-regression confidence adjustment), and describe the metric's confidence weighting correctly. https://arxiv.org/abs/2103.02523 (W1, W2).
3. Mayank Agarwal, Jorge J. Barroso, Tathagata Chakraborti, Eli M. Dow, Kshitij Fadnis, Borja Godoy, Madhavan Pallan, Kartik Talamadupula. 2020. *Project CLAI: Instrumenting the Command Line as a New Environment for AI Agents.* arXiv:2002.00762. https://arxiv.org/abs/2002.00762. Why: the terminal-assistant setting that motivated NLC2CMD's confidence-weighted metric (W2).
4. Shuyan Zhou, Uri Alon, Frank F. Xu, Zhiruo Wang, Zhengbao Jiang, Graham Neubig. 2023. *DocPrompting: Generating Code by Retrieving the Docs.* ICLR 2023. https://arxiv.org/abs/2207.05987. Why: retrieval over command documentation for Bash (tldr), the retrieval-augmented middle ground between the paper's two framings (W1, W9).
5. Zhengliang Shi, Yuhan Wang, Lingyong Yan, Pengjie Ren, Shuaiqiang Wang, Dawei Yin, Zhaochun Ren. 2025. *Retrieval Models Aren't Tool-Savvy: Benchmarking Tool Retrieval for Large Language Models.* Findings of ACL 2025, pp. 24497–24524. https://aclanthology.org/2025.findings-acl.1258/ (W3).
6. Qiao Huang, Xin Xia, Zhenchang Xing, David Lo, Xinyu Wang. 2018. *API Method Recommendation without Worrying about the Task-API Knowledge Gap.* ASE 2018, pp. 293–304. https://doi.org/10.1145/3238147.3238191 (W3).
7. Yujia Qin, Shihao Liang, Yining Ye, et al. 2024. *ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs.* ICLR 2024. https://iclr.cc/virtual/2024/poster/18267. Why: includes a dense API retriever (W3). Optional.
8. Sebastian Bruch, Siyu Gai, Amir Ingber. 2023. *An Analysis of Fusion Functions for Hybrid Retrieval.* ACM Transactions on Information Systems 42(1). https://doi.org/10.1145/3596512 (W3, W4).
9. Gordon V. Cormack, Charles L. A. Clarke, Stefan Büttcher. 2009. *Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods.* SIGIR 2009, pp. 758–759. https://doi.org/10.1145/1571941.1572114 (W3, W4).
10. Vladimir Karpukhin, Barlas Oguz, Sewon Min, Patrick Lewis, Ledell Wu, Sergey Edunov, Danqi Chen, Wen-tau Yih. 2020. *Dense Passage Retrieval for Open-Domain Question Answering.* EMNLP 2020, pp. 6769–6781. https://doi.org/10.18653/v1/2020.emnlp-main.550. Why: the standard reference for linear BM25+dense hybrids (W3).
11. Niklas Muennighoff, Nouamane Tazi, Loic Magne, Nils Reimers. 2023. *MTEB: Massive Text Embedding Benchmark.* EACL 2023, pp. 2014–2037. https://aclanthology.org/2023.eacl-main.148/ (W4).
12. Gustavo Penha, Claudia Hauff. 2021. *On the Calibration and Uncertainty of Neural Learning to Rank Models for Conversational Search.* EACL 2021, pp. 160–170. https://aclanthology.org/2021.eacl-main.12/. Why: calibration of rankers and prediction of unanswerable inputs, at the target venue's parent conference (W3).
13. Elias Stengel-Eskin, Benjamin Van Durme. 2023. *Calibrated Interpretation: Confidence Estimation in Semantic Parsing.* TACL 11:1213–1231. https://aclanthology.org/2023.tacl-1.69/ (W3).
14. Jianguo Zhang, Kazuma Hashimoto, Yao Wan, Zhiwei Liu, Ye Liu, Caiming Xiong, Philip Yu. 2022. *Are Pre-trained Transformers Robust in Intent Classification? A Missing Ingredient in Evaluation of Out-of-Scope Intent Detection.* Proceedings of the 4th Workshop on NLP for Conversational AI, pp. 12–20. https://aclanthology.org/2022.nlp4convai-1.2/ (W5).
15. Anna Shtok, Oren Kurland, David Carmel, Fiana Raiber, Gad Markovits. 2012. *Predicting Query Performance by Query-Drift Estimation.* ACM Transactions on Information Systems 30(2). https://doi.org/10.1145/2180868.2180873 (W7).
16. Iñigo Casanueva, Tadas Temčinas, Daniela Gerz, Matthew Henderson, Ivan Vulić. 2020. *Efficient Intent Detection with Dual Sentence Encoders.* Proceedings of the 2nd Workshop on NLP for Conversational AI, pp. 38–45. https://aclanthology.org/2020.nlp4convai-1.5/. Why: cheap sentence-encoder intent detection, an alternative framing for a closed-set command catalogue. Optional.
17. Ngoc Phuoc An Vo, Brent Paulovicks, Vadim Sheinin. 2024. *Execution-Based Evaluation of Natural Language to Bash and PowerShell for Incident Remediation.* arXiv:2405.06807. https://arxiv.org/abs/2405.06807. Why: prior NL-to-PowerShell evaluation, relevant because the evaluated platform is Windows (W9). Optional.
18. [UNVERIFIED] David Gros. 2019. *AInix: An Open Platform for Natural Language Interfaces to Shell Commands.* I saw this only as a reference inside Agarwal et al. (2021) and could not verify its venue. Treat it as a search lead, not a citation.

### Questions for Authors
1. Were you aware of the NLC2CMD TF-IDF retrieval entry and its learned confidence adjustment? How does your calibration analysis differ from, and improve on, that precedent?
2. Does the hybrid-over-BM25 and hybrid-over-dense pattern hold with one stronger offline encoder, or is it specific to all-MiniLM-L6-v2?
3. For the 10 "terminal tasks the corpus does not cover": are they in-domain out-of-scope in the sense of Zhang et al. (2022)? Would a score-distribution QPP predictor separate them better than the absolute top-1 score?
4. Why can none of NL2Bash, the NLC2CMD test set, tldr or the NL2SH test set, even a subset mapped onto your 145 cross-platform records, serve as an external check?

### Minor Issues
- **Citation format**: The NL2SH author list in the reference matches arXiv 2502.06858, which lists Miguel Tulla. The ACL Anthology record for the NAACL 2025 paper (https://aclanthology.org/2025.naacl-long.555/) lists five authors without him. Since the reference cites the NAACL proceedings, use the Anthology author list.
- **Citation format**: Wang et al. (2026) and QuoteBench (Li et al., 2026) are 2026 preprints. Consider stating that they are not peer-reviewed, because they carry some of the framing.
- **Language**: The text extraction shows merged compounds ("closedvocabulary", "executiongrounded", "outof-scope", "riskcoverage"). Check that hyphens survive in the PDF.

## Criterion-Bound Judgements

Calibration status: `NOT_CALIBRATED`

Criterion source for all rows: `references/quality_rubrics.md` dimensions, applied through Reviewer Configuration Card #3. No venue criteria were bound (`criteria_binding_unavailable`).

| Dimension | Criterion source | Judgement | Evidence anchor(s) | Rationale | Uncertainty / scope limit | Decision bearing? |
|---|---|---|---|---|---|---|
| Originality | quality_rubrics D1; Card #3 focus 3 | PARTLY_MEETS | text: §2 "to our knowledge this combination, not any single component, is new." | The narrow combination claim survived my search. The gap argument omits the closest retrieval precedents (W1, W2), and the contribution is a transfer of known reliability findings, legitimate for an SRW (W8). | My search was targeted, not systematic. | yes: the gap argument must be rewritten |
| Methodological Rigor | quality_rubrics D2 | NOT_ASSESSED | — | Reviewer 1's remit. | Outside the domain seat. | no |
| Evidence Sufficiency | quality_rubrics D3; Card #3 focus 2 | PARTLY_MEETS | text: §4 "local dense retrieval (Xenova/all-MiniLM-L6-v2" | The reliability claims are supported. The hybrid claims rest on one encoder and one fusion function (W4), and there is no external benchmark (W9). | Statistical adequacy not assessed. | no: secondary claims only; scoping is enough |
| Argument Coherence | quality_rubrics D4 | NOT_ASSESSED | — | DA and Reviewer 1 remit. Domain-driven leaps are reported as W6 and W8. | Outside the domain seat. | no |
| Writing Quality | quality_rubrics D5 | NOT_ASSESSED | — | Journal-fit reviewer's remit. Terminology is covered under W5. | Outside the domain seat. | no |
| Literature Integration | quality_rubrics D6; Card #3 focus 1 | PARTLY_MEETS | absence: §2 Related Work — expected tool/API retrieval, fusion and QPP positioning; checked §2, §4, §9, Limitations, references | Calibration and selective-prediction coverage is strong (S1, S2). Retrieval-based command assistance, tool retrieval, fusion and QPP are missing, and two cited works are misdescribed (W1–W3, W6, W7). | Recent 2026 preprints were checked only at abstract level. | yes: main driver of the D2 warn |
| Significance & Impact | quality_rubrics D7 | MEETS | text: §3 "44.9% of failures at exactly 100% confidence" | The deployed-system reliability problem is real, and the calibration and selective-prediction results are practically meaningful for offline assistants (S5). The generalisation limits are acknowledged. | Single corpus, single platform. | no |

Unresolved decision-bearing criteria: Originality (gap argument) and Literature Integration. Both can be repaired by revising the text, citing the verified references above and correcting the descriptions of NLC2CMD and BashCoder-R1. Neither needs new data. The optional encoder sensitivity row (W4) would settle the one open evidence question within my remit.
