# ACL Responsible NLP Research checklist: draft answers (FINAL-06)

**Drafted:** 2026-10-01, for the EACL 2027 SRW long paper. **Status: DRAFT for the author.**

**Author decisions, 2026-10-01:**

- The Appendix A paragraph is approved, with **MIT** for the code and **CC BY 4.0** for the
  benchmark.
- **B4: yes,** the suggested answer is confirmed.
- **Supplementary material: none at review.** This is consistent with the Ethics statement, which
  says code and data are withheld from the review version for anonymity.

**Still open:** D1–D5 (the author's facts).

**Done:** the AI-ledger update and the camera-ready clause (approved 2026-10-01; E1 below).

**Source of the questions:** https://aclrollingreview.org/responsibleNLPresearch/, read
2026-10-01. The page shows no version date. **Author action:** check the questions against the
actual EACL 2027 SRW submission form, which may number or word them differently.

**Conventions:**

- Section pointers refer to `research/paper/acl_latex/content.tex` at commit `d95babd`.
- **[GAP]** means the paper does not yet answer the question; a fix is proposed.
- **[AUTHOR]** means only the author knows the fact. Nothing here was guessed.

## A. Every submission

**A1. Limitations: Yes.** See the "Limitations" section, which covers:

- the small, dependent, partly AI-authored benchmark;
- exploratory statistics;
- out-of-scope evidence;
- the external check's general-domain scope;
- scope, safety and literature.

**A2. Risks: Yes.** "Ethical Considerations" covers destructive commands offered for benign requests,
sometimes at maximum confidence, with recommended safeguards. The Discussion suggests risk levels,
`-Confirm`/`-WhatIf` and a higher confidence bar for high-risk commands. The Limitations discuss the
risk of overgeneralising (one tool, one platform, AI-authored items).

## B. Scientific artefacts (Yes, used and created)

**B1. Cited the creators: Yes.**

- CLINC150 (Larson et al., 2019): §4 "External check", Appendix C;
- the MiniLM encoder (Wang et al., 2020; Reimers and Gurevych, 2019): §4;
- the related benchmarks (NL2Bash, NLC2CMD, NL2SH, …): §1–§2.

The audited tool is the authors' own; it is anonymised in the review version.

**B2. Licence or terms: Yes (Appendix A, "Artifacts, licenses and compute"; added 2026-10-01).**

- **Author decision, 2026-10-01:** our code will be released under the MIT license and our
  benchmark under CC BY 4.0. The released CLINC150 copy keeps CC BY 3.0, with attribution.
- No LICENSE file has been added to the repository yet. Adding one publishes the licence, so it is
  left for the author's explicit instruction.

*(Original gap note, kept for the record:)* The paper stated no licence. The verified facts are:

- CLINC150: CC BY 3.0 (`research/data_external/clinc150/PROVENANCE.md`);
- `sentence-transformers/all-MiniLM-L6-v2` and its ONNX conversion `Xenova/all-MiniLM-L6-v2`:
  Apache 2.0 (model cards, read 2026-10-01);
- the audited tool: MIT (`cli/package.json`).
- **[AUTHOR]** The repository has no LICENSE file. The licence for the released benchmark, code
  and results must be chosen. The released CLINC150 copy keeps CC BY 3.0, with attribution.
- *Proposed fix:* the Appendix A addition below.

**B3. Consistent with intended use: Yes.** CLINC150 was built to evaluate intent classification
with out-of-scope prediction (§2 cites it as the closest task framing), and we use it to evaluate
out-of-scope rejection (§4, Appendix C). MiniLM is used as a sentence encoder for retrieval, its
stated purpose.

**B4. Identifying information or offensive content: Partly; say so.**

- The benchmark queries are short command requests, written by the authors and an AI agent (§3).
  They are not collected from users.
- CLINC150 queries are crowd-written requests to an assistant.
- **No systematic check for personal information or offensive content was run, and the paper
  does not claim one.**
- **Answer, confirmed by the author on 2026-10-01:** "No; the data are short command or assistant
  requests written for benchmarks, not user data (§3, §4)."

**B5. Documentation: Yes.** §3 covers the benchmark versions, the construction, the AI-authored
part and the labels. Appendix A specifies the system. The reproduction guide and the claim trace
are released with the camera-ready version (Ethics).

**B6. Statistics and splits: Yes.**

- §3: 150 and 209 queries, the classes, the 25 controls.
- §4: five folds (seed 42, stratified) and Split B (Appendix B).
- §4 "External check": 4,500 + 1,000 queries and 150 intents.
- Tables 1 and 8.

## C. Computational experiments (Yes)

**C1. Parameters, budget, infrastructure: Yes** (Appendix A, "Artifacts, licenses and compute":
22.7M parameters; CPU on one Windows machine, no GPU; added 2026-10-01). No total compute budget in
hours is stated, since none was measured. The notes below are kept for the record.

- §4 states "384-dimensional MiniLM".
- The verified parameter count is **22.7M** (model card).
- Every experiment ran on **CPU, on a single Windows machine, with no GPU**. The paper says
  "single-machine" in the Limitations and "one machine" in §3.
- **[AUTHOR]** Give the machine details (CPU, RAM) if you want them stated.
- *Proposed fix:* the Appendix A addition below.

**C2. Experimental setup and hyperparameters: Yes.**

- §4 "Protocol": the α grid 0.0–1.0, chosen per fold; the selected α ∈ {0.3, 0.5}; F1-maximising
  thresholds chosen on development folds, with ties to the lowest; no inner split.
- Appendix A gives the specification.
- §4 "External check": the frozen v0.2 thresholds, the median of five.

**C3. Descriptive statistics, and single vs multiple runs: Yes.**

- 95% bootstrap and Wilson intervals; exact McNemar; Holm (§4).
- The headline uses one fold partition (seed 42), and Appendix B repeats every fold-dependent step
  on 20 partitions (Limitations).
- The external check uses intent-cluster bootstrap intervals (§4, Appendix C).

**C4. Packages, versions and settings: Yes** (Appendix A: `@xenova/transformers` 2.17.2,
`onnxruntime-node` 1.14.0, Node.js 24.2.0; the model and the BM25 settings in §3 and §4; added
2026-10-01). The notes below are kept for the record.

- The model `all-MiniLM-L6-v2` is named (§4). BM25 k1 = 1.2 and b = 0.75 are given (§3).
- **The library versions are not stated:** `@xenova/transformers` 2.17.2 and `onnxruntime-node`
  1.14.0 (from `research/package-lock.json`), and Node.js 24.2.0 (`research/.nvmrc`).
- *Proposed fix:* the Appendix A addition below.

## D. Human annotators (Yes: the label check in §3; the two-annotator study is not yet complete)

The paper reports one human label check: **one partially independent reviewer, κ = 0.63, on 14
items (§3)**. The two-annotator study is described only as "not yet complete" (Limitations). If its
results enter the paper later, D1–D5 must cover the two annotators and the adjudicator too.

- **D1. Full instructions:** the paper does not include them.
  - The codebook and the annotator guidelines exist (`research/datasets/annotation/`). The first
    reviewer's definitions are described in `ANNOTATION_PROTOCOL.md` §0.
  - **[AUTHOR]** Decide whether to release them as supplementary material or on the camera-ready
    version, and answer accordingly.
- **D2. Recruitment and pay: [AUTHOR].** It is not in the paper. The facts are needed: how the
  reviewer and the annotators were recruited, and whether and how much they were paid.
- **D3. Consent: [AUTHOR].** The annotators label requests and are not data subjects. State
  whether they agreed to their labels being used and reported.
- **D4. Ethics review: [AUTHOR].** Was any ethics or IRB review sought, or was the work exempt?
  For the initial submission, give no identifying institutional details.
- **D5. Annotator demographics: [AUTHOR].** It is not in the paper. The protocol requires "no
  prior involvement" and CLI familiarity (`ANNOTATION_PROTOCOL.md` §2), but the actual
  characteristics are the author's to report.

## E. AI assistants

**E1. Yes.**

- The camera-ready Acknowledgements (`\aiacknowledgements` in `main.tex`) disclose it. It is
  omitted from the review version for anonymity.
- The ledger is `research/paper/AI_DISCLOSURE_LEDGER.md`.
- *Suggested form answer:* the rendered statement from the ledger. See FINAL-06 note 3 on updating
  it to cover the work done since 2026-09-29.

## Proposed Appendix A addition (closes B2, C1 and C4; appendices do not count toward the page limit)

> **Artefacts, licences and compute.** CLINC150 is distributed under CC BY 3.0; we use its two test
> sets unmodified. The sentence encoder is \texttt{all-MiniLM-L6-v2} (22.7M parameters; Apache 2.0),
> run as its ONNX conversion through \texttt{@xenova/transformers} 2.17.2 with
> \texttt{onnxruntime-node} 1.14.0 on Node.js 24.2.0. All experiments ran on CPU on a single Windows
> machine; no GPU was used. [Released code and benchmark licence: AUTHOR TO CHOOSE.]

Every number in it would be registered in `trace_claims.js`: 22.7 from the model card, and the
versions from `package-lock.json` and `.nvmrc`.
