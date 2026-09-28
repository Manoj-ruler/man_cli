# Peer Review Report: Peer Reviewer 3 (Perspective), internal role R3

## Stage A: Paper-blind criteria pre-commitment

Written before the manuscript was opened. Inputs at this point: the agent file, the report template, and the header facts and Card #4 of `phase0_field_analysis.md` (title, field, about 7,200 words). No sprint-contract JSON was supplied, so the committed dimensions below are the reviewer's own, derived from Card #4's review focus and the template's rubric dimensions. They are recorded in the sprint-contract format so they can be checked later.

## Contract Paraphrase

P1 (User-outcome grounding of reliability). A reliability-aware assistant is only useful if the confidence or abstention it produces changes what a person at a terminal does, for the better. I will judge whether the paper connects its reliability metrics to a plausible user decision (run, edit, reject, ask again), and how carefully it scopes claims that it cannot support without users.

P2 (Risk and safety of suggested commands). A shell assistant can suggest commands that delete data, change permissions or reach the network. I will judge whether the paper treats destructive-command risk as a first-class outcome: how misses and false rejections are measured and reported, and what a deployment would need beyond the reported system.

P3 (Practical scope and transferability). I will judge whether the claims are stated at the scope the evidence covers (platform, shell, corpus source, user population), and whether the paper says what would and would not transfer.

P4 (Stakeholders, ethics and broader impact). I will judge whether affected parties (novice users, users of non-English or non-default environments, maintainers of the tool) and the ethical dimensions (harm from wrong commands, over-trust, data provenance) are considered at a level proportionate to a student workshop paper.

P5 (Significance and practical value). I will judge whether the contribution would matter to a practitioner building such a tool, and whether its "non-LLM" positioning is argued from real deployment constraints rather than asserted.

## Scoring Plan

### P1: User-outcome grounding of reliability
dimension_id: P1
what_to_look_for: an explicit link from calibration, abstention or risk metrics to a user decision, plus claim wording scoped to the absence of user evidence
what_triggers_block: the paper claims that its confidence or abstention improves user outcomes (safety, trust, efficiency) as a finding, with no user evidence and no scoping
what_triggers_warn: reliability is motivated by user benefit but the link to user decisions is left implicit or untested, and the limitation is not stated plainly

### P2: Risk and safety of suggested commands
dimension_id: P2
what_to_look_for: measured safety-classifier misses and false rejections, how destructive commands are defined, and deployment safeguards named
what_triggers_block: the paper presents the system as safe to deploy while destructive-command misses are unmeasured or hidden
what_triggers_warn: risk handling is present but its failure modes, costs to users, or deployment requirements are under-reported

### P3: Practical scope and transferability
dimension_id: P3
what_to_look_for: stated platform, shell, corpus and population limits, and claims worded at that scope
what_triggers_block: general claims about NL-to-shell assistance rest on a single narrow setting with no scope statement
what_triggers_warn: scope limits are stated somewhere but headline wording (title, abstract, conclusion) is broader than the evidence

### P4: Stakeholders, ethics and broader impact
dimension_id: P4
what_to_look_for: an ethics or broader-impact statement covering harm from wrong commands, over-trust, data provenance and licensing, and who is affected
what_triggers_block: a foreseeable serious harm is ignored and the paper's recommendations would make it worse
what_triggers_warn: ethics and stakeholder coverage is thin or generic relative to the harms the task can cause

### P5: Significance and practical value
dimension_id: P5
what_to_look_for: a concrete practitioner takeaway and a deployment-constraint argument for the chosen approach
what_triggers_block: the contribution has no identifiable practical or scientific use beyond the paper's own benchmark
what_triggers_warn: practical value is asserted but the practitioner takeaway or the constraint argument is vague

criteria_binding_unavailable

[CONTRACT-ACKNOWLEDGED]

---

# Stage B: Paper-visible review

## Manuscript Information
- **Title**: Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study
- **Manuscript ID**: none (T14 round-1 build, author block redacted; text in `manuscript_review.txt`)
- **Review Date**: 2026-09-28
- **Review Round**: Round 1
- **Target**: EACL 2027 Student Research Workshop, long paper (author-confirmed). `criteria_binding_unavailable`: no formal criteria manifest exists, so this report makes no venue-alignment claim. Venue fit is mentioned only informally.
- **Scope of reading**: the manuscript text only. Figures are not visible in the extraction, so I judged them from their captions. No code, results or other panel reports were consulted.
- **Instruction-injection check**: the manuscript contains no text addressed to reviewers or to automated agents. Nothing to report.

## Reviewer Information

### Reviewer Role
Peer Reviewer 3 (Perspective), internal role R3

### Reviewer Identity
I am a human-computer interaction and developer-tools researcher. I study how programmers use command-line assistants, how uncertainty and risk are communicated to users, and how safe suggested shell commands are. This configuration comes from Reviewer Configuration Card #4.

I am outside the paper's primary discipline. I did not check the statistics (bootstrap design, McNemar, Holm), the literature coverage in IR or NLP, or whether the paper is internally consistent. Those belong to R1, R2 and the Devil's Advocate. Where my view conflicts with NLP evaluation conventions, I say so.

### Review Focus
My review covers three questions:
1. Do calibrated confidence and abstention help someone at a terminal, or does the reliability framing stay a metric exercise?
2. How does the paper treat destructive commands, misses by the safety classifier, and false rejections of legitimate requests?
3. Do the results transfer beyond one platform, one tool and one benchmark that the authors wrote themselves?

## Overall Assessment

### Recommendation
- [ ] Accept
- [ ] Minor Revision
- [x] **Major Revision**. This is borderline with Minor. The recommendation rests on two Major findings (W1, W2). Both can be fixed by reframing the text and adding analyses that use data the authors already have. Neither requires a user study.

### Confidence Score
3. The user-facing, safety and deployment questions are my core expertise. The retrieval, calibration and statistics are adjacent to it, and I took the paper's reported numbers as given.

Confidence is an uncertainty/scope disclosure only; it never changes consensus counts, severity, decision bearing, or arbitration.

### Calibration Status
`NOT_CALIBRATED`

### Summary Assessment
**What the paper does.** It audits a published, offline, BM25-based tool that maps natural language to shell commands. The tool returns commands from a fixed library of 279 Windows-visible commands. The paper finds that the tool is often confidently wrong, then evaluates a hybrid lexical plus dense retriever with post-hoc calibration, OOD rejection and selective prediction on a benchmark of 150 or 209 queries that the authors built. Its most robust results are:
- a large reduction in ECE, the calibration-error metric;
- better ranking of the system's own errors (lower AURC and AUGRC);
- OOD rejection that improves mostly on requests that are not about computing.

**What works from a practitioner's viewpoint.** The paper is unusually candid. It reports false-rejection costs, splits OOD results by kind of request, runs commands only in a sandbox, and explicitly declines to make a safety claim. Those choices help anyone who has to decide whether to deploy a tool like this.

**The main gap.** The reliability framing never reaches the user. The paper does not describe how confidence, abstention or risk are shown to users, or what a user does with them. Calibration "changes reported confidence, not decisions", yet the paper justifies leading with calibration because it is "the number users see".

**Risk is separated from correctness.** The paper's own motivation is destructive commands. Yet it treats command risk as "orthogonal" to retrieval correctness and never reports the case that matters most to users: a wrong answer, given with high confidence, that is also a high-risk command.

**Recommendation rationale.** The metric claims hold as stated. Their practical meaning is under-argued. Fixing that needs an operating-point analysis that includes the cost of harm, a joint analysis of risk and correctness, and a clearer statement of scope. I recommend Major Revision.

## Strengths

### S1: The paper declines to make a safety claim its evidence cannot support
The safety classifier is reported with its dangerous-direction miss rate and a Wilson interval. The paper identifies two inconsistent risk labels and draws no safety conclusion from any of this. In my field, over-claiming safety for developer tools is a recurring failure, and this paper avoids it. The Ethical Considerations section repeats the point instead of presenting the classifier as a safeguard.
**Evidence Anchor**: text: §7 Safety evaluation "We therefore make no safety claim; an independent, human-labeled safety set is future work."

### S2: OOD results are reported in terms a tool builder can act on
The paper reports what kinds of requests are rejected (everyday requests vs. terminal tasks the library does not cover) and what rejection costs (11 of 159 answerable queries, 3 of them previously correct). A builder can reason directly about the user experience from these numbers. Most OOD papers report only AUROC.
**Evidence Anchor**: text: Abstract "of 10 terminal tasks the corpus does not cover, the detector rejects 4"

### S3: A closed-vocabulary, offline design that is useful in practice
Returning commands only from a curated library, with no network or LLM dependency, bounds what the tool can suggest. It also keeps the tool deterministic and auditable, which matters in restricted or air-gapped environments. The Ethical Considerations section correctly says the bound is weaker than full human vetting.
**Evidence Anchor**: text: §1 "structurally eliminates hallucination of arbitrary commands"

### S4: Commands were executed safely
The functional evaluation ran commands only in disposable temporary directories, on a subset chosen to be safe for the host machine. The scope limit is stated. This is good practice for research on executable suggestions.
**Evidence Anchor**: text: §7 Functional evaluation "Sandboxed execution (disposable temp directories, never the host machine)"

### S5: The paper recognises that some remaining work needs people
The future-work list says that labelling, safety sets and corpus validation need human effort. It does not propose to scale them with automated generation. That is the correct stance for a benchmark whose labels are the paper's main weak point.
**Evidence Anchor**: text: §10 "cannot responsibly be replaced by bulk automated generation"

## Weaknesses

### W1: Reliability is never connected to what a user sees or does
**Problem**:
- The paper does not describe the interaction model of the published tool:
  - whether confidence is displayed, and in what form (a percentage? capped at 100?);
  - what the user sees when the tool rejects a query;
  - whether a command is printed for the user to copy, or run directly;
  - whether any confirmation step exists.
- Calibration is said to change "reported confidence, not decisions". So its value depends entirely on how people use the reported number, and the paper does not model or discuss that.
- The "decision-level" analysis (contribution 3) sets no operating point that reflects the cost of a wrong answer.
- The only planned human study is a "human-preference study", listed last. A preference study would not show whether confidence improves reliance.

**Evidence Anchor**: text: §9 "It improves the confidence users see, not the answers or their ranking."

**Why it matters**: Research in human factors and AI-assisted decision making shows that confidence scores can calibrate trust without improving the outcomes of joint human-AI decisions (Zhang, Liao and Bellamy, FAT* 2020). Token-level uncertainty signals in code tools can also fail to help programmers unless they are tied to the right notion of error (Vasconcelos et al., ACM TOCHI). "Lower ECE on the displayed number" therefore does not by itself mean "more useful to users". The users the paper names in its first sentence, people for whom natural-language shell help "can lower the barrier", are the ones least able to check a command and most likely to over-rely on a confident one.

**Suggestion**: A user study is not needed for a workshop paper. Three cheaper changes would help:
1. Add a short paragraph on the interaction model: what the published tool displays and what the user does next.
2. Report one or two operating points that use a cost of harm, for example the abstention threshold at which the expected number of wrong answers shown at or above X% confidence falls below a stated budget. Say what a user would experience at that point, in answers, rejections and residual errors.
3. Reword "the number users see" so that it describes the metric property rather than implying a user benefit.
In future work, replace the "human-preference study" with a task-based study that measures reliance: whether users accept wrong suggestions, reject correct ones, and how long they take. The Tellina user experiment (Lin et al., 2017) is an example of a study design close to this domain.

**Severity**: Major
**Confidence**: 4 (core expertise in HCI studies of uncertainty communication)

### W2: Command risk and correctness are treated as independent, so the most harmful case goes unmeasured
**Problem**: The paper's motivation is that "incorrect commands — especially destructive ones — carry real cost". Yet the safety classifier is set aside as a separate, "orthogonal" component, and it is evaluated only on gold commands against the benchmark's own risk labels. The paper never reports:
- how many of the wrong answers (from the baseline or the hybrid) are medium-, high- or critical-risk commands;
- what confidence those answers carried, when 44.9% of baseline failures were at exactly 100% confidence;
- whether the hybrid or calibration shifts high-risk wrong answers toward rejection.

**Evidence Anchor**: text: §4 "A sixth, independent component, a rule-based safety classifier, targets command risk, which is orthogonal to retrieval correctness."

**Why it matters**: Risk and correctness are independent as properties of the system's parts. From the user's side they combine: expected harm depends on both the probability of being wrong and how severe the command is. A reliability paper about shell commands that cannot say how often the tool is confidently wrong with a destructive command has left its own motivating case unmeasured. That weakens contribution (1), which describes the confidence miscalibration as "more consequentially" the problem than accuracy, and the claim that the paper addresses "a specific, serious problem".

**Suggestion**: The data needed is already in the paper: a risk-level field for every query, and a deterministic classifier that can tag the retrieved commands as well as the gold ones.
- Report a small table that crosses correctness, the classifier's risk level of the returned command, and the confidence band, for both systems.
- Consider a threshold that depends on risk: require higher confidence before returning a high- or critical-risk command. This is a standard idea from cost-sensitive selective prediction.
- In the Discussion, name the deployment safeguards a real tool would need beyond retrieval. Examples:
  - show the command but never run it automatically;
  - require explicit confirmation for high-risk commands;
  - on the evaluated Windows/PowerShell platform, suggest the `-WhatIf` / `-Confirm` common parameters where a cmdlet supports them.

**Severity**: Major
**Confidence**: 4 (core expertise in the safety of suggested commands; the analysis is feasible from data the paper describes)

### W3: Calibration and OOD rates depend on a query mix the authors built
**Problem**: The benchmark queries were written by the authors, and for v0.2 by an AI agent. They were not sampled from people using the published tool. The v0.2 mix of OOD and ambiguous queries was chosen for statistical power, not to match real usage. Calibration fitted and scored on this mix is calibration for this mix. Under the query distribution of real users (terser, with typos, a different share of OOD requests), the displayed confidence could be miscalibrated again. The Split B attenuation, and the different pre-calibration ECE of v0.1 and v0.2, show that calibration is sensitive to what it is fitted on. The paper does not discuss ecological validity, or how a calibrator for deployment would be fitted.

**Evidence Anchor**: text: §3 Benchmark v0.2 "subsets were too small for adequately powered tests"

**Why it matters**: The core claim is stated per benchmark version and survives. But the reason given for leading with calibration is its effect on the displayed number, and that practical reading depends on distributions the paper does not examine.

**Suggestion**:
- Add a Limitations bullet on the benchmark not coming from real users.
- Optionally, re-weight the held-out predictions to two or three plausible OOD prevalences and report ECE at each.
- Say whether a deployed calibrator would be fitted on the whole benchmark. If the published package logs anything, even locally and with consent, mention how real queries could be collected for future work.

**Severity**: Minor
**Confidence**: 3 (deployment-transfer reasoning; the prevalence dependence of calibration is standard, but I defer to R1 on its size here)

### W4: The task allows only one answer or a refusal, which may be why ambiguity detection looks weak
**Problem**: The task requires a single command or an explicit refusal. For short or ambiguous queries such as "git", "pip" or "system", developer tools normally show a ranked shortlist or ask a clarifying question; Tellina, for example, showed a ranked list of suggestions. Under a shortlist design, the weak ambiguity F1 (0.31–0.50) and the unsettled ambiguous labels would matter much less, because the user resolves the ambiguity.

**Evidence Anchor**: text: §1 "the task is to return the single best-matching command, or explicitly decline to answer"

**Why it matters**: Part of the paper's negative result on ambiguity may come from its framing rather than from the retriever.

**Suggestion**:
- Report recall@3 or recall@5 on the ambiguous and bare-keyword queries.
- In the Discussion, frame ambiguity handling as a question of what to present to the user, not only a detection problem.

**Severity**: Minor
**Confidence**: 3 (interaction-design perspective; this may not match NLP task conventions)

### W5: False rejections are counted, but the user's experience of a rejection is not described
**Problem**: The paper counts the 11 false rejections, 3 of which lost correct answers. It does not say what the user receives on a rejection (a message, the top candidates, a fallback), or how a rejection compares with a low-confidence answer from the user's point of view.

**Evidence Anchor**: text: §9 "it costs 11 false rejections on 159 answerable queries"

**Why it matters**: A 6.9% rate of refusing legitimate requests can be negligible or frustrating, depending on what a rejection looks like. The number cannot be interpreted without that.

**Suggestion**: Add one sentence on what the tool does when it rejects a query. If feasible, report how many false rejections still had the gold command in the top k.

**Severity**: Minor
**Confidence**: 4 (core HCI concern; easy to fix)

### W6: Scope is stated in the Limitations, but the headline wording says "shell"
**Problem**:
- The title and abstract refer to shell-command assistance in general.
- The evaluated view covers only Windows. It includes some Linux commands that will not run there, such as `sudo reboot`.
- Exact reproduction depends on the Windows platform.
- The Limitations section states that the evaluation is single-platform, but the abstract never says Windows, PowerShell or cmd.
- Returning a command that does not exist on the user's platform is, from the user's side, close to the "hallucination" that the closed-vocabulary design is meant to rule out. It is not measured.

**Evidence Anchor**: text: §3 Corpus "a few Windows-visible records are Linux commands (e.g., sudo reboot)"

**Why it matters**: Readers from the NL2Bash line of work will assume Bash and Linux. Transfer to other platforms is not established.

**Suggestion**:
- Name the platform in the abstract, and ideally in the title or subtitle.
- Count how many answers in the benchmark return a command that is invalid on the platform.
- Add a sentence on what would change for a Linux/macOS view: the corpus there has 152 platform-specific records that were never evaluated.

**Severity**: Minor
**Confidence**: 4 (platform and tooling practice)

### W7: Users of the published package are not considered as stakeholders
**Problem**: The audit finds that the published, currently shipped tool is often confidently wrong. The improved system is a research prototype that is not part of the package. The Ethical Considerations section does not say whether current users are affected, whether the displayed confidence will be recalibrated or relabelled, or whether a fix will ship.

**Evidence Anchor**: text: §1 "The hybrid retriever we evaluate is a research prototype and is not part of the published package."

**Why it matters**: The finding concerns a real deployed artifact. Responsible reporting would say what is being done for the people who use it.

**Suggestion**: Add one or two sentences to the Ethical Considerations. For example: whether the package's confidence display will be changed or removed, whether calibration will be shipped, or whether a known-issue note has been published.

**Severity**: Minor
**Confidence**: 3 (research-ethics perspective; practices vary by venue)

### W8: The reasons for avoiding an LLM are asserted rather than argued
**Problem**: The no-LLM, offline constraint is treated as a given. The paper's strongest practical case for it is barely made. That case would cover privacy (queries never leave the machine), determinism and auditability, working in restricted or air-gapped environments, no per-query cost, and latency on low-end machines. The paper also does not say what is given up relative to an LLM assistant on the same queries.

**Evidence Anchor**: text: §1 "without abandoning the no-LLM, fully-offline design constraint"

**Why it matters**: For an EACL audience in 2027, the "non-LLM" subtitle needs a positive reason, not just a constraint.

**Suggestion**: Add a short paragraph in the Introduction or Discussion naming the deployment settings where the constraint is binding. An LLM comparison is not needed. Saying qualitatively what coverage is lost would be enough.

**Severity**: Minor
**Confidence**: 3 (developer-tool deployment practice)

## Detailed Comments

### Assumption Audit
- **Explicit assumptions**:
  - *Closed-vocabulary retrieval "structurally eliminates hallucination".* This holds for commands outside the library. It does not rule out commands that are wrong for the platform or for the user's intent (see W6), which the Ethics section partly admits.
  - *Command risk is orthogonal to retrieval correctness.* This holds as a property of the system's parts. It fails as a statement about harm to users (see W2).
- **Implicit assumptions**:
  1. *A displayed confidence number is used, and used well, by the person at the terminal.* This is not stated and not examined, and the human-AI decision-making literature does not support it unconditionally (see W1).
  2. *Benchmark queries resemble real queries.* This is not discussed (see W3). The large number of bare-keyword queries in v0.2 suggests the authors expect terse real-world input, which supports the point that the distribution matters.
  3. *Refusing to answer is always safer than answering.* For a novice under time pressure, a refusal can push them toward copying a less vetted command from a web search. The paper treats a refusal as a neutral outcome with a counted cost, not as a behavioural event.
- **Paradigmatic assumptions**: The paper stays within the NLP evaluation paradigm: benchmark accuracy, ECE and AURC. It is a rigorous and honest example of that paradigm. From an HCI standpoint, reliability is a property of the whole human plus tool system, and the paper measures only the tool. That is acceptable for a workshop paper if the claims are worded that way. Currently the phrase "the number users see" goes slightly beyond this.

### Cross-Disciplinary Connections
- **Parallel research**:
  - Human factors research on trust calibration and reliance on automation (Lee and See, 2004).
  - Empirical work on confidence displays in AI-assisted decisions (Zhang, Liao and Bellamy, 2020).
  - Uncertainty highlighting in AI code completion (Vasconcelos et al.).
  - Usability studies of code-generation tools (Vaithilingam, Zhang and Glassman, 2022).
  - The Tellina user experiment for natural language to Bash (Lin et al., 2017).
  All of these study the step from model to user that this paper leaves out.
- **Borrowing opportunities**:
  - "Appropriate reliance" as the goal, instead of "calibrated confidence".
  - Operating points that include the cost of harm (W2).
  - The standard safeguards of command-line tools: dry-run, confirmation for destructive operations, never running a command automatically.
- **Methodological borrowing**: If human work becomes possible, a small within-subjects reliance study is the natural next step. Participants would complete terminal tasks with the tool in three conditions: no confidence shown, raw confidence, calibrated confidence. The study would measure rates of accepting wrong suggestions and of rejecting correct ones, plus time on task. This is more informative than a preference study and within reach of a student project.

### Practical Impact
- **Real-world application**: Three practitioner takeaways are useful as they stand:
  1. A heuristic confidence such as min(score/8×100, 100) should not be shown as a percentage without calibration.
  2. OOD detectors mostly catch requests that are not about computing, not terminal tasks the library lacks.
  3. Gains in accuracy at this benchmark size are fragile.
  The first takeaway is the most practically significant finding. The paper should state it that directly.
- **Implementation feasibility**:
  - The offline MiniLM encoder needs a one-time download, and the full hybrid pipeline was not timed end to end. Both matter for a CLI tool that starts on every call.
  - The calibrator has to be fitted on some data before it can ship. The paper does not say which data (see W3).
  - A possible unintended consequence: calibrated confidence that looks trustworthy on common queries could increase over-reliance on the rare, confidently wrong, destructive answer.
- **Stakeholders**:
  - Novice users, the stated beneficiaries, are not discussed as a group with particular vulnerabilities.
  - Current users of the published package are not considered (see W7).
  - Users on other platforms are outside scope, which is acceptable if said plainly (see W6).
  - Speakers of languages other than English are implicitly excluded; the paper should say so in one clause.

### Broader Implications
- **Ethical dimensions**: The Ethical Considerations section is specific rather than boilerplate, and it admits the tool's limits. Two points are missing: the risk of over-reliance created by displaying confidence (W1), and what happens for users of the shipped package (W7). The paper discloses that part of the benchmark was written by an AI and reports a re-annotation result below target. That is good practice.
- **Social impact**: The impact is modest and mostly positive. An offline, auditable assistant is a reasonable alternative to cloud LLMs for people concerned about privacy or cost. The main risk is harm to individual users from destructive commands, which W2 addresses.
- **Future directions**, in the order I would value them from my perspective:
  1. A joint analysis of risk and correctness, with thresholds that depend on risk (possible now).
  2. Collecting queries from real users, with consent, to test transfer of calibration and OOD detection.
  3. A reliance-focused user study in place of the preference study.
  4. A ranked shortlist or clarification interface for ambiguous queries (W4).

## Cross-Disciplinary Reading Recommendations
All of these were verified by web search during this review.
- John D. Lee and Katrina A. See. 2004. "Trust in Automation: Designing for Appropriate Reliance." *Human Factors* 46(1):50–80. https://journals.sagepub.com/doi/10.1518/hfes.46.1.50_30392. It is the foundational framing of *appropriate reliance*, the outcome that calibrated confidence is ultimately meant to serve.
- Yunfeng Zhang, Q. Vera Liao, and Rachel K. E. Bellamy. 2020. "Effect of Confidence and Explanation on Accuracy and Trust Calibration in AI-Assisted Decision Making." FAT* 2020. https://dl.acm.org/doi/10.1145/3351095.3372852. It shows empirically that showing confidence can calibrate trust without improving decision accuracy, which bears directly on W1.
- Helena Vasconcelos, Gagan Bansal, Adam Fourney, Q. Vera Liao, and Jennifer Wortman Vaughan. "Generation Probabilities Are Not Enough: Uncertainty Highlighting in AI Code Completions." ACM Transactions on Computer-Human Interaction (arXiv:2302.07248). https://dl.acm.org/doi/10.1145/3702320. It finds that raw model probabilities shown to programmers did not help, while a better-targeted uncertainty signal did. This is a close analogue for developer tools.
- Priyan Vaithilingam, Tianyi Zhang, and Elena L. Glassman. 2022. "Expectation vs. Experience: Evaluating the Usability of Code Generation Tools Powered by Large Language Models." CHI 2022 Extended Abstracts. https://dl.acm.org/doi/10.1145/3491101.3519665. It is a compact model of a within-subjects usability study of a developer assistant.
- Xi Victoria Lin, Chenglong Wang, Deric Pang, Kevin Vu, Luke Zettlemoyer, and Michael D. Ernst. 2017. "Program Synthesis from Natural Language Using Recurrent Neural Networks." Technical Report UW-CSE-17-03-01, University of Washington. https://homes.cs.washington.edu/~mernst/pubs/nl-command-tr170301-abstract.html. It covers Tellina, a ranked-list natural-language-to-Bash tool, and its controlled user experiment (task success and time with vs. without the tool). It is the closest precedent in this domain for W1 and W4.

## Questions for Authors
1. Does the published tool display its confidence to users? If so, in what form, and what happens on a rejection? Does the tool ever run a command, or does it only print it?
2. Among the wrong answers of the baseline and the hybrid, how many return a command that the classifier or the gold risk labels mark as medium, high or critical risk? At what confidence?
3. If calibration were shipped, what data would the deployed calibrator be fitted on? Would it be expected to stay calibrated if the share of OOD requests in real use differed markedly from v0.2's 24%?
4. What would the planned "human-preference study" measure? Would a reliance or task-outcome measure be feasible instead?

## Minor Issues
- The abstract's final sentence is split by a page artefact ("a two-annotator study / is under way") in the extracted text. Please check that the PDF abstract does not break across a column.
- In §7 the missed command appears as `git checkout - .`. If the intended command is `git checkout -- .`, check the typesetting of the double hyphen, since the exact command matters for a safety example.
- §4 says "No LLM is used anywhere in the system", and §1 and the abstract say the same. Once is enough.

contract_role: perspective

## Dimension Scores

Scored against my paper-blind criteria from Stage A. No external sprint contract was supplied, so these are the reviewer's own committed dimensions.

### P1: User-outcome grounding of reliability
score: warn
trigger: "reliability is motivated by user benefit but the link to user decisions is left implicit or untested"

### P2: Risk and safety of suggested commands
score: warn
trigger: "risk handling is present but its failure modes, costs to users, or deployment requirements are under-reported"

### P3: Practical scope and transferability
score: warn
trigger: "scope limits are stated somewhere but headline wording (title, abstract, conclusion) is broader than the evidence"

### P4: Stakeholders, ethics and broader impact
score: pass

### P5: Significance and practical value
score: pass

## Review Body
The findings are in the Strengths (S1–S5) and Weaknesses (W1–W8) sections above. Each weakness has one Severity, one typed Evidence Anchor and one Confidence. No Coverage Receipt is needed because neither list is empty.

Notes on the scores:
- **P1 and P2 are warn, not block.** The paper does not claim a user benefit as a finding. It explicitly says calibration "changes reported confidence, not decisions", lists "No human-preference study" as a limitation, and makes "no safety claim". The block triggers are therefore not met.
- **P3 is warn.** The platform and corpus limits are disclosed in the Limitations section but not in the headline wording.
- **P4 is pass.** The ethics statement is specific and honest, and its gaps (W7, the over-reliance part of W1) are Minor.
- **P5 is pass.** There is a concrete practitioner takeaway: do not display a heuristic confidence without calibration, and do not expect OOD detectors to catch terminal tasks the library does not cover. The non-LLM rationale needs strengthening (W8), but that is Minor.

## Criterion-Bound Judgements

Calibration status: `NOT_CALIBRATED`

| Dimension / criterion | Criterion source | Judgement | Evidence anchors | Rationale | Uncertainty or scope limit | Decision bearing? |
|---|---|---|---|---|---|---|
| P1 User-outcome grounding | R3 pre-commitment (Stage A), Card #4 focus 1 | PARTLY_MEETS | text: §9 "It improves the confidence users see, not the answers or their ranking." | Metric claims are well scoped, but there is no interaction model and no operating point that includes the cost of harm | No user evidence exists, and none is expected at SRW level | yes: drives W1 (Major) |
| P2 Risk and safety | R3 pre-commitment, Card #4 focus 2 | PARTLY_MEETS | text: §4 "command risk, which is orthogonal to retrieval correctness" | Honest about the classifier's miss, but there is no joint analysis of risk and correctness and no deployment safeguards are named | Feasibility of the joint analysis is inferred from the paper's description of its data | yes: drives W2 (Major) |
| P3 Scope and transferability | R3 pre-commitment, Card #4 focus 3 | PARTLY_MEETS | text: §3 "a few Windows-visible records are Linux commands (e.g., sudo reboot)" | Limits are stated in the Limitations section, but the headline wording is generic and the benchmark does not come from real users | none identified | no: Minor findings W3, W6 |
| P4 Stakeholders and ethics | R3 pre-commitment | MEETS | text: Ethical Considerations "we report that it misses at least one destructive command" | Specific and candid. Novice users and users of the shipped package are not discussed | Venue norms for ethics statements not formally bound | no |
| P5 Significance and practical value | R3 pre-commitment; template "Significance & Impact" | MEETS | text: §9 "the detector rejects only 4 of 10 terminal tasks the corpus lacks" | Clear, actionable lessons for tool builders; the non-LLM rationale is under-argued | Informal venue-fit judgement only (`criteria_binding_unavailable`) | no |
| Originality | template rubric | MEETS | text: §2 "this combination, not any single component, is new" | Reliability analysis of closed-vocabulary shell retrieval is a reasonable workshop-level contribution | Literature completeness is R2's remit | no |
| Methodological Rigor | template rubric | NOT_ASSESSED | — | R1's remit | — | no |
| Evidence Sufficiency | template rubric | NOT_ASSESSED | — | R1's remit | — | no |
| Argument Coherence | template rubric | NOT_ASSESSED | — | Devil's Advocate remit | — | no |
| Writing Quality | template rubric | NOT_ASSESSED | — | Outside my focus; only minor extraction issues noted | — | no |
| Literature Integration | template rubric (cross-disciplinary part only) | PARTLY_MEETS | absence: §2 Related Work — expected HCI or human-factors work on confidence display, reliance, or user studies of shell/code assistants; checked §1, §2, §9, Limitations, References | The ML reliability literature is well cited; human-side work is absent | Systematic coverage is R2's remit | no: supports W1 |

These judgements are not totalled or weighted. The recommendation rests on the two unresolved, decision-bearing criteria, P1 (W1) and P2 (W2). Both can be repaired through reframing and analysis of data the authors already have. Neither needs new data collection.
