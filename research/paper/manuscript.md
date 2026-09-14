# Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study

*Manuscript draft. All numbers in this document are pulled from `research/results/`,
`research/figures/`, and `research/tables/` — generated artifacts of Phases 0–17 of this
research program, not hand-typed. No number here may exceed what is stated in
`research/FINAL_RESEARCH_REPORT.md`'s Phase 17 decision gate.*

---

## 1. Abstract

Natural-language interfaces to the shell are typically framed as a generation problem: translate
an English request into a novel command (NL2Bash, NL2SH). We study a different, deliberately
constrained point in the design space — closed-vocabulary *retrieval* from a curated, pre-vetted
command library, using no large language model anywhere in the system. Starting from a real,
previously-shipped BM25 baseline (67.3% overall accuracy on a validated 150-query benchmark, but
with severe confidence miscalibration — 86.06% mean confidence on wrong answers), we test whether
a lightweight hybrid lexical+local-semantic retrieval architecture, combined with post-hoc
confidence calibration and margin-based rejection, can measurably improve both accuracy and
reliability. Under a fully leakage-free nested 5-fold cross-validation protocol, hybrid fusion
significantly improves supported-task accuracy over pure BM25 (71.9%→77.1%, exact McNemar's
p=0.016), and isotonic-regression calibration reduces confidence miscalibration by up to 80.4%
(Expected Calibration Error). Out-of-domain rejection improves substantially in magnitude
(26.7%→46.7%) though this specific result is not statistically confirmed at our sample size
(n=15, p=0.25). A fully deterministic, rule-based safety classifier achieves 95%/95%
precision/recall on distinguishing risky from safe commands with zero dangerous-direction misses.
We report every weaker and null result alongside the positive ones — including a substring-
matching heuristic in the original system shown to have zero measurable effect on accuracy — and
position this as the first reported study, to our knowledge, of a lexical/BM25 retrieval baseline
for this task family evaluated with nested-CV calibration, OOD detection, and selective
prediction.

## 2. Introduction

Natural-language shell assistance can lower the barrier to command-line tools, but incorrect
commands — especially destructive ones — carry real cost. The dominant research trajectory since
Lin et al.'s NL2Bash (2018) has been generative: seq2seq and Transformer models (NLC2CMD
competition, 2020), then LLM-based systems (NL2SH, NAACL 2025), most recently with
execution-grounded and RL-trained approaches (BashCoder-R1, 2026). This trajectory inherits a
persistent risk: open-vocabulary generation can hallucinate syntactically valid but semantically
wrong or unsafe commands.

TermAssist takes a different, narrower approach: retrieval from a fixed, pre-vetted 431-command
corpus, using classical lexical (BM25) scoring, with no LLM anywhere in the system. This
constrains coverage but structurally eliminates hallucination of arbitrary commands. The system
is real — a published, in-use npm package — and its baseline behavior was independently
audited and reproduced (Section 5). That audit surfaced a specific, serious problem: the system
is frequently *confidently* wrong, not merely wrong. This paper asks whether that problem, and
the system's accuracy more broadly, can be improved without abandoning the no-LLM,
fully-offline design constraint.

**Research question:** can a lightweight hybrid lexical+local-semantic retrieval architecture,
combined with explicit uncertainty estimation and post-hoc calibration, measurably improve
accuracy and reliability over a pure-BM25 baseline, without the cost or hallucination risk of a
generative system?

## 3. Problem Definition

Given a natural-language query and a fixed corpus of `(intent, command, category, description,
os)` tuples, return the single best-matching command, or explicitly decline to answer if no
corpus entry is a confident match. Correctness is defined against a benchmark's gold command (or
a small acceptable-alternatives set). This is retrieval, not generation: the output space is
closed and pre-vetted, unlike NL2Bash-style tasks where the model may emit any syntactically
valid command string.

## 4. Related Work

See `research/paper/related-work-matrix.csv` (15 entries) for the full comparison table. Briefly:
NL2Bash (Lin et al., 2018) established the seq2seq/CopyNet/Tellina baseline and the standard
BLEU/template/exact-match evaluation this field has used since. The NLC2CMD competition (2020)
introduced a utility+flag-overlap metric more tolerant of near-miss answers than exact match.
NL2SH (Westenfelder et al., NAACL 2025) is the modern generation-based successor, with even SOTA
LLM accuracy reported as "remains low." Recent 2026 work — QuoteBench (evaluation-methodology
critique of matched-score evaluation) and BashCoder-R1/BashBench (RL-trained generation,
73–90% full functional success even for a strong system) — both reinforce this paper's framing:
exact-match accuracy alone is an incomplete signal, and even state-of-the-art generation does not
achieve perfect functional reliability. A 2026 scaling study ("BM25 Wins at Scale") supports
lexical retrieval's competitiveness at scale, though at a corpus scale far larger than ours.
Notaro et al. (2024) train a transformer-based command risk classifier; we deliberately compare
against a simpler, fully deterministic rule-based alternative (Section 14). No prior work, to our
knowledge, reports a BM25 retrieval baseline for this task family evaluated under nested-CV
calibration, OOD detection, and selective prediction — the gap this paper fills.

## 5. TermAssist Baseline Architecture

`cli/search.js` (frozen, commit `4443ec016c87895ebbc1b9be831e5f80b9bd3b50`, tag
`v1.0-research-baseline`): tokenize (lowercase, strip punctuation, 10-word stopword list), BM25
scoring (`k1=1.2, b=0.75`, standard IDF smoothing) over `intent+category+description`, plus a
flat `+15.0` bonus when the query is a near-substring of the command's intent. Confidence =
`min(round(score/8×100), 100)`, rejected below `score<2.0`. 431 commands, 27 categories,
platform-filtered (`win32`/`darwin`/`linux`/`all`). No embeddings, no LLM, mean latency 3.29ms.
Independently re-verified byte-for-byte reproducible (Phase 1: 0/150 mismatches against the
archived results).

## 6. TermAssist-Bench

150 hand-adjudicated queries across 9 types (canonical, paraphrase, low-overlap-paraphrase,
ambiguous, OOD, polysemy, single-keyword, safety-sensitive, complex-multi-intent), with
ground-truth classification (119 CORRECT, 14 AMBIGUOUS, 15 OOD, 2 NEEDS_CORRECTION) and a
`risk_level` field (120 LOW, 10 MEDIUM, 15 HIGH, 5 CRITICAL) reused in Section 14's safety
evaluation. Benchmark integrity independently verified (Phase 0): an apparent SHA-256 mismatch on
Windows was root-caused to a CRLF/LF line-ending checkout artifact, not content tampering.

## 7. Baseline Experimental Results

Overall accuracy 67.3% (101/150); supported-task (non-OOD) accuracy 71.9%; OOD rejection 26.7%
(73.3% false-acceptance); ambiguity success 28.6%. Per-type: canonical/safety-sensitive 100%,
paraphrase 88.0%, complex-multi-intent 86.7%, polysemy 55.6%, ambiguous 58.3%,
low-overlap-paraphrase 33.3%, OOD 26.7%, single-keyword **0.0%**.

## 8. Failure Analysis

Mean confidence on the 49 wrong (non-rejected) predictions: **86.06%** (a figure this research
program corrected — see Section 17 — from an 87.7% transcription error in the original
pre-existing analysis; both the archived results and an independent reproduction agree exactly on
86.06%). 44.9% of failures sit at exactly 100% confidence. Root causes (qualitative, pre-existing
analysis, partially refined by this program's Section 12 ablation): lexical vocabulary gap,
confidence-formula saturation, and a hypothesized substring-bonus overmatching effect — the last
of which this program's controlled ablation found to have **zero** measured effect on which
command is returned (Section 12).

## 9. Proposed Reliability-Aware Retrieval Architecture

Five components, each targeting a specific measured failure: (1) local dense retrieval
(`Xenova/all-MiniLM-L6-v2`, 384-dim, offline after one-time download) for the lexical gap; (2)
hybrid score fusion with α tuned via nested 5-fold CV; (3) margin/entropy uncertainty signals over
top-10 ranked candidates; (4) OOD and ambiguity detectors (dev-tuned thresholds); (5) isotonic
confidence calibration. A sixth, independent component — a rule-based safety classifier — targets
command risk, orthogonal to retrieval correctness. No LLM is used anywhere.

## 10. Experimental Methodology

All tuned parameters (fusion α, OOD/ambiguity thresholds) are selected via nested 5-fold
cross-validation (seed 42, stratified by classification): for each test fold, the parameter is
chosen using only the other 4 folds, then applied once to the held-out fold — never tuned on data
it is later scored against. Full parameter log: `research/results/configurations.json` (30 rows,
14 fixed / 15 tuned / 1 methodological definition). Statistical testing uses the exact
(binomial) McNemar's test, not the chi-square approximation, given small sample sizes (n=135
non-OOD, n=15 OOD).

## 11. Results

**Retrieval accuracy** (Figure 1, Table 1): BM25 71.9%, dense-only 72.6–72.7%, hybrid 77.1%
(±4.1pp across folds). **Accuracy by query type** (Figure 2): hybrid retains BM25's 100% on
canonical/safety-sensitive while improving low-overlap-paraphrase. **OOD/ambiguity detection**:
AUROC 0.867 (OOD, feature=absolute top-1 score) and 0.784 (ambiguity, feature=margin) — an
evidence-driven feature choice (Section 9), not selected post-hoc. **Calibration** (Figure 3,
Table 3): ECE reduced 56.7–80.4% across four confidence variants tested, largest for the hybrid
system's own fused-score signal. **Risk-coverage** (Figure 4): selective answering at 50%
coverage achieves 10.7% error vs. 30.7% unconditional.

## 12. Ablation Study

(Table in `research/results/ablation/ablation-table.csv`, notes in `ABLATION_NOTES.md`.) A0
(BM25)=71.9%, A1 (BM25, no bonus)=71.9% — **identical on all 150 queries, 0 command
differences**: the substring bonus fires for 47/150 queries but never changes the top-1 winner.
A2 (dense)=72.6–72.7%. A3 (hybrid, nested-CV)=77.0–77.1%. A4 (+margin rejection)=88.5% selective
accuracy @ 70.8% coverage. A5 (+OOD detection)=90.1% @ 69.5% coverage, 10/15 OOD caught. A6
(+calibration)=same decision as A5, confidence ECE 0.054 vs. 0.274 raw. Figure 5 visualizes A0–A6
(noting A4–A6 use a different, selective-accuracy metric, not directly comparable to A0–A3's
unconditional accuracy).

## 13. Functional Evaluation

Sandboxed execution (disposable temp directories, never the host machine) on a deliberately
narrow, explicitly-scoped 15/150-query subset (git + filesystem, placeholder-free,
non-interactive, host-safe gold commands only — see `FUNCTIONAL_EVAL_NOTES.md` for full exclusion
rationale). Gold commands: 100% functional success (validates benchmark quality). Retrieved
(hybrid) commands: 93.3% functional success, zero cases of textually-correct-but-functionally-
broken. This result is positive but covers only 10% of the benchmark by design.

## 14. Safety Evaluation

A fully deterministic, rule-based classifier (LOW/MEDIUM/HIGH/CRITICAL), authored from general
domain knowledge before inspecting per-query outcomes (not tuned against benchmark labels),
evaluated against the benchmark's pre-existing `risk_level` ground truth: 89.6% exact 4-tier
accuracy (112/125 gold commands), 95%/95% precision/recall on the actionable risky-vs-not-risky
binary, zero dangerous-direction misses (no CRITICAL/HIGH command ever tagged safe). On retrieved
commands, accuracy holds (90.0%) but risky-binary precision drops to 0.826 — a retrieval-error
artifact (wrong commands can trigger unrelated risk patterns), not a classifier defect.

## 15. Discussion

The central, statistically defensible finding is that hybrid retrieval measurably improves both
*what* the system gets right and *how honestly* it communicates uncertainty about what it gets
wrong — two related but distinct problems, requiring two different interventions (fusion for
accuracy, calibration for confidence), neither of which alone was sufficient (Section 8's error
taxonomy shows 84.8% of the hybrid system's remaining errors are still high-confidence). This
argues for treating calibration as a first-class research target in retrieval-based assistants,
not an afterthought to accuracy.

## 16. Limitations

See `research/paper/limitations.md` for the full, unabridged list: benchmark size (particularly
the n=15 OOD subset), single-platform corpus, hand-authored queries, no human-preference study,
fixed embedding-model choice, narrow (10%) functional-evaluation coverage, an unresolved
ambiguity-detection weakness, and isotonic calibration's demonstrated small-sample sensitivity.

## 17. Threats to Validity

**Internal validity:** two real implementation bugs were found and fixed during this program
(isotonic tie-handling, an OOD-inclusive accuracy-denominator error) before any affected number
was reported — both documented in full rather than silently corrected, as a transparency measure.
A pre-existing document (`baseline-error-analysis.md`) was found to contain a transcription error
(87.7% vs. the correct 86.06%), corrected with a dated erratum. **External validity:** results
are specific to this 431-command, win32-only corpus and may not generalize to larger or
differently-distributed command libraries. **Construct validity:** "functional success" (Section
13) is defined as exit-code-0, not full semantic side-effect verification — a stated
simplification.

## 18. Conclusion

A lightweight, fully offline, non-LLM hybrid retrieval architecture significantly improves
accuracy (p=0.016) and substantially improves confidence calibration (up to −80.4% ECE) over a
real, previously-shipped BM25 baseline, evaluated under a leakage-free nested cross-validation
protocol throughout. Weaker and null results (dense-vs-hybrid significance, OOD significance at
this sample size, ambiguity detection quality, the substring bonus's true effect) are reported
alongside the positive findings, not folded into an overstated headline claim.

## 19. Future Work

A larger benchmark (particularly more OOD examples); a richer ambiguity-detection feature; a
placeholder-substitution system to extend functional evaluation; an optional local-LLM comparator
(explicitly deferred in this program); a human-preference study.

## 20. References

1. Lin, X.V., Wang, C., Zettlemoyer, L., Ernst, M.D. (2018). NL2Bash: A Corpus and Semantic
   Parser for Natural Language Interface to the Linux Operating System. LREC. arXiv:1802.08979.
2. Agarwal, R. et al. (2021). NLC2CMD Competition Report. NeurIPS Competition Track.
   arXiv:2103.02523.
3. Agarwal, R. et al. (2020). Project CLAI: Instrumenting the Command Line as a New Environment
   for AI Agents. arXiv:2002.00762.
4. Yang, J. et al. (2023). InterCode: Standardizing and Benchmarking Interactive Coding with
   Execution Feedback. NeurIPS Datasets & Benchmarks. arXiv:2306.14898.
5. Westenfelder, A. et al. (2025). LLM-Supported Natural Language to Bash Translation. NAACL.
   arXiv:2502.06858.
6. Li, S., Zhang, Y., Tresp, V., Yang, Y. (2026). QuoteBench: How Matched Scores Can Hide
   Command-Path Failures. arXiv:2608.13547.
7. (2026). BashCoder-R1: Towards Robust and Explainable Bash Script Generation with
   Robustness-Aware Group Relative Policy Optimization. ISSTA 2026. arXiv:2606.27733.
8. (2026). BM25 Wins at Scale: A Scaling Study of Retrieval-Augmented Generation Paradigms.
   arXiv:2607.26497.
9. Husain, H. et al. (2019). CodeSearchNet. arXiv:1909.09436.
10. Notaro, P., Haeri, S., Cardoso, J., Gerndt, M. (2024). Command-line Risk Classification using
    Transformer-based Neural Architectures. arXiv:2412.01655.
11. Full related-work matrix (15 entries): `research/paper/related-work-matrix.csv`.
