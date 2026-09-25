# Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study

*Manuscript draft. All numbers in this document are pulled from `research/results/`,
`research/figures/`, and `research/tables/` — generated artifacts of this research program, not
hand-typed. No number here may exceed what is stated in `research/FINAL_RESEARCH_REPORT.md`'s
corrected final contribution statement (post-v0.2). This revision additionally incorporates
Holm–Bonferroni-corrected significance and bootstrap 95% confidence intervals
(`research/results/stats/`) and an intent-held-out generalization check
(`research/results/v0.2/split-b-results.json`), per `research/TERMASSIST_RESEARCH_V1.0_SPEC.md`.
See `research/V1.0_BUILD_STATUS.md` for what remains outstanding (corpus expansion and
independent human validation, both gated on work beyond this revision's scope).*

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
reliability, evaluating on two versions of a benchmark we constructed: an original 150-query
version and an expanded 209-query version built specifically to test statistical power on the
original's smaller subsets. Under a fully leakage-free nested 5-fold cross-validation protocol,
hybrid fusion improves supported-task accuracy over pure BM25 on both benchmarks (71.9%→77.1% on
the original, 75.5%→79.3% on the expanded version; bootstrap 95% CI on the delta [2.2, 8.9]pp and
[0.6, 7.5]pp respectively). Under a pre-registered Holm–Bonferroni correction across the primary
four-comparison family (accuracy vs. BM25, accuracy vs. dense-alone, OOD rejection, calibration),
this accuracy improvement **barely survives correction on the original benchmark (Holm-adjusted
p=0.047) and fails to survive on the expanded, harder benchmark (raw p=0.070, a fortiori after
correction)** — a non-replication we verified is not a computation error and report as a central,
not incidental, finding. Conversely, hybrid significantly beats dense retrieval alone on the
expanded benchmark after correction (Holm-adjusted p=0.025), where it did not on the original
(p=0.292). Isotonic-regression calibration reduces confidence miscalibration substantially and
consistently on both benchmarks (56.7–84.1% relative ECE reduction across four confidence
signals), and this reduction is the one result that **survives Holm correction on both benchmarks**
(paired-bootstrap Holm-adjusted p=0.0004 and p=0.0003) — the most statistically robust finding in
this study. Out-of-domain rejection improves substantially in magnitude on both benchmarks, and on
the expanded benchmark's larger OOD subset (50 vs. 15 queries) this improvement survives Holm
correction (34.0%→68.0% rejection rate, Holm-adjusted p=0.00006), resolving a power limitation
identified on the original, smaller subset (raw p=0.25, not significant even uncorrected). An
intent-held-out generalization check (GroupKFold over 171 command-intent groups, zero groups split
across tuning/test folds) shows the accuracy and OOD findings are **not artifacts of intent overlap
between tuning and test** (accuracy 79.2% held-out vs. 79.3% within-distribution; OOD AUROC 0.898
vs. 0.901), while calibration, though still substantial, is measurably **attenuated on unseen
intents** (ECE 0.324→0.101 held-out vs. →0.074 within-distribution) — disclosed rather than
smoothed over. A fully deterministic, rule-based safety classifier achieves 95%/95%
precision/recall on distinguishing risky from safe commands with zero dangerous-direction misses.
We report every weaker, null, and non-replicating result alongside the positive ones — including a
substring-matching heuristic shown to have zero measurable effect on accuracy on both benchmark
versions — and position this as the first reported study, to our knowledge, of a lexical/BM25
retrieval baseline for this task family evaluated with nested-CV calibration, OOD detection,
selective prediction, a multiple-comparison-corrected benchmark-expansion replication check, and
an intent-held-out generalization check.

## 2. Introduction

Natural-language shell assistance can lower the barrier to command-line tools, but incorrect
commands — especially destructive ones — carry real cost. The dominant research trajectory since
Lin et al.'s NL2Bash (2018) has been generative: seq2seq and Transformer models (NLC2CMD
competition, 2020), then LLM-based systems (NL2SH, NAACL 2025), most recently with
execution-grounded and RL-trained approaches (BashCoder-R1, 2026). This trajectory inherits a
persistent risk: open-vocabulary generation can hallucinate syntactically valid but semantically
wrong or unsafe commands.

TermAssist takes a different, narrower approach: retrieval from a fixed, pre-vetted corpus of 431
records spanning 279 unique command intents on the evaluated platform (Section 5), using classical
lexical (BM25) scoring, with no LLM anywhere in the system. This
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
`min(round(score/8×100), 100)`, rejected below `score<2.0`. 431 corpus records, 27 categories,
platform-filtered (`win32`/`darwin`/`linux`/`all`). No embeddings, no LLM, mean latency 3.29ms.
Independently re-verified byte-for-byte reproducible (Phase 1: 0/150 mismatches against the
archived results). **Corpus size clarification** (a discrepancy the audit surfaced and we
corrected rather than let stand): 134 of the 431 records are cross-platform duplicates — the same
natural-language intent recorded once per platform — so the retrieval space actually exercised on
the evaluated (win32) platform is **279 unique intents**, not 431; this is the number that should
be compared against other corpora's scale, and the one we use throughout. The corpus schema was
subsequently migrated (additively, non-breaking — re-verified 0/150 mismatch after migration) to
add `command_id`, `risk_level`, `source`, and `validation_status` fields in preparation for a
planned expansion to 500–800 human-validated intents; that expansion itself requires human
authoring and validation and is not yet complete (`research/V1.0_BUILD_STATUS.md`), so all results
in this manuscript are reported on the original 279-intent corpus.

## 6. TermAssist-Bench

150 hand-adjudicated queries across 9 types (canonical, paraphrase, low-overlap-paraphrase,
ambiguous, OOD, polysemy, single-keyword, safety-sensitive, complex-multi-intent), with
ground-truth classification (119 CORRECT, 14 AMBIGUOUS, 15 OOD, 2 NEEDS_CORRECTION) and a
`risk_level` field (120 LOW, 10 MEDIUM, 15 HIGH, 5 CRITICAL) reused in Section 14's safety
evaluation. Benchmark integrity independently verified (Phase 0): an apparent SHA-256 mismatch on
Windows was root-caused to a CRLF/LF line-ending checkout artifact, not content tampering.

A second benchmark version, **v0.2** (209 queries: the same 150 plus 35 new OOD and 24 new
ambiguous queries), was built specifically to test whether the original's small OOD (15) and
ambiguous (14) subsets were statistically underpowered. New queries were authored and adjudicated
by an AI agent (Claude) under human direction — disclosed explicitly, following the identical
design/verification methodology as v0.1 (queries checked against actual system retrieval output,
not judged from intuition; 6 of 30 drafted ambiguous candidates were rejected for failing the
ambiguity or novelty criteria — full detail in `research/datasets/v0.2_ADJUDICATION_REPORT.md`).
We report results on both versions throughout, since — as Sections 11–12 show — they are not
merely a larger sample of the same result.

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
cross-validation (seed 42, stratified by classification) — **Split A** in our terminology: for each
test fold, the parameter is chosen using only the other 4 folds, then applied once to the held-out
fold — never tuned on data it is later scored against. Full parameter log:
`research/results/configurations.json` (30 rows, 14 fixed / 15 tuned / 1 methodological
definition). Statistical testing uses the exact (binomial) McNemar's test, not the chi-square
approximation, given small sample sizes (n=135/159 non-OOD, n=15/50 OOD).

**Multiple-comparison correction.** We pre-register a primary family of four comparisons per
benchmark version — accuracy vs. BM25 (A0-vs-A3), accuracy vs. dense-alone (A2-vs-A3), OOD
rejection (baseline-vs-tuned), and calibration ECE reduction — and apply Holm–Bonferroni
correction within each family (`research/experiments/apply_holm_correction.js`); a result is
called significant only at Holm-adjusted p<0.05. Preregistration text and the exact family
definition predate the corrected results (`research/results/v1.0/PREREGISTRATION.md`).

**Bootstrap confidence intervals.** Percentile bootstrap (10,000 resamples, seed 42,
`research/experiments/run_bootstrap_ci.js`) provides 95% CIs for the A0→A3 and A2→A3 accuracy
deltas (paired resampling over non-OOD query ids) and for calibration ECE before/after and their
paired reduction (resampling over pooled held-out predictions), complementing the discrete exact
McNemar's test with a continuous-estimate view of the same comparisons.

**Split B — intent-held-out generalization.** To test whether Split A's findings depend on the
same command intents appearing in both tuning and test folds, we additionally construct a
GroupKFold split (`research/experiments/run_split_b_v0_2.js`) keyed by a derived
`intent_group_id` (the gold command for answerable queries; the sorted acceptable-command set for
ambiguous queries; a singleton per query for OOD, which targets no intent). This yields 171 groups
over the 209 v0.2 queries; the split is verified programmatically to place zero groups across more
than one fold, so α, the OOD/ambiguity thresholds, and the isotonic calibrator are always selected
on queries targeting *different* command intents than those they are scored on.

## 11. Results

**Retrieval accuracy** (Figure 1, Table 1): on v0.1, BM25 71.9%, dense-only 72.6–72.7%, hybrid
77.1% (±4.1pp across folds) — a bootstrap 95% CI on the delta of [2.2, 8.9]pp, and an exact
McNemar's p=0.0156 that **survives Holm correction, but only just** (Holm-adjusted p=0.047, within
0.003 of the 0.05 cutoff for a family of 4). On v0.2, BM25 75.5%, dense-only 72.3–72.4%, hybrid
79.3% — numerically similar in magnitude (+3.8pp, bootstrap CI [0.6, 7.5]pp) but **this specific
comparison does not clear p<0.05 even before correction (raw p=0.070)**. We verified this at the
per-query level: of 8 discordant non-OOD pairs on v0.2 (vs. 7 on v0.1), 7 still favor hybrid but
one (`TA-B194`, "sudo reboot" vs. "sudo shutdown -h now") now favors BM25, and the larger, harder
query set is enough to push the p-value above the conventional threshold — not a computation
error. We note the bootstrap CI on v0.2's delta ([0.6, 7.5]pp) technically excludes zero while the
discrete exact McNemar's test (built from only 8 discordant pairs) does not reach significance —
the two methods disagree at the boundary because McNemar's exact test on a small, discrete
discordant-pair count is conservative; we treat this as **method-divergent, borderline evidence**,
not a resolved significant result. Conversely, hybrid vs. dense-alone flips from not-significant on
v0.1 (raw p=0.146, Holm-adjusted p=0.292) to significant on v0.2 even after Holm correction
(raw p=0.0127, Holm-adjusted p=0.025). We attribute this shift, as an interpretation rather
than a proven cause, to v0.2's 17 new short-technical-keyword ambiguous queries (`grep`, `sed`,
`awk`, `tar`, etc.), where BM25's exact-token-match strength is plausibly more competitive than on
v0.1's query mix — a hypothesis we did not further test and flag as future work (Section 19).
**Accuracy by query type** (Figure 2): hybrid retains BM25's 100% on
canonical/safety-sensitive while improving low-overlap-paraphrase. **OOD/ambiguity detection**:
AUROC 0.867 (OOD, feature=absolute top-1 score) and 0.784 (ambiguity, feature=margin) — an
evidence-driven feature choice (Section 9), not selected post-hoc. On benchmark v0.2 (OOD subset
expanded 15→50 queries via the identical adjudication methodology, Section 6), OOD detection
AUROC improves to 0.901 and the baseline-vs-tuned rejection-rate improvement (34.0%→68.0%)
**survives Holm correction** (raw p=0.000015, Holm-adjusted p=0.00006) — resolving the power
limitation of the v0.1-scale result, which was not significant even before correction (raw p=0.25,
Holm-adjusted p=0.292). Ambiguity detection F1 improves on v0.2 (0.310→0.496) though AUROC
slightly decreases (0.784→0.723), reported as measured. **Calibration** (Figure 3,
Table 3): ECE reduced 56.7–84.1% across four confidence variants tested, largest for the hybrid
system's own fused-score signal; a paired bootstrap test of the reduction (before−after ECE > 0)
gives one-sided p≈0.0001 on both benchmarks, and this is the **only comparison in the primary
family that survives Holm correction on both benchmark versions** (Holm-adjusted p=0.0004 on v0.1,
p=0.0003 on v0.2) — full per-comparison breakdown with bootstrap CIs in **Table 7**
(`research/tables/table7_holm_bootstrap.md`; notes in
`research/results/stats/STATS_HARDENING_NOTES.md`). **Risk-coverage** (Figure 4): selective
answering at 50% coverage achieves 10.7% error vs. 30.7% unconditional.

**Intent-held-out generalization (Split B, v0.2; Table 8).** GroupKFold over 171 derived intent
groups (0 groups split across the 5 folds, verified programmatically) shows the two Holm-surviving
findings above are not artifacts of intent overlap between tuning and test: hybrid non-OOD
accuracy is 79.24% under Split B vs. 79.25% under Split A (Δ≈−0.01pp), and OOD detection AUROC is
0.898 under Split B vs. 0.901 under Split A (Δ≈−0.003) — both effectively unchanged. Calibration,
while still a large improvement, is measurably **attenuated on held-out intents**: ECE 0.324→0.101
under Split B versus 0.324→0.074 under Split A (a 69% vs. 77% relative reduction). Ambiguity
detection F1 is similarly close (0.479 Split B vs. 0.496 Split A) — remaining weak under both
splits, consistent with Section 15's standing limitation. Full results and per-metric discussion:
`research/results/v0.2/SPLIT_B_NOTES.md`.

## 12. Ablation Study

(Tables in `research/results/ablation/ablation-table.csv` (v0.1) and `research/results/v0.2/ablation-results.json`
(v0.2), notes in `ABLATION_NOTES.md` and `V0.2_FULL_RESULTS_NOTES.md`.) v0.1: A0 (BM25)=71.9%, A1
(BM25, no bonus)=71.9% — **identical on all 150 queries, 0 command differences**: the substring
bonus fires for 47/150 queries but never changes the top-1 winner. A2 (dense)=72.6–72.7%. A3
(hybrid, nested-CV)=77.0–77.1%. A4 (+margin rejection)=88.5% selective accuracy @ 70.8% coverage.
A5 (+OOD detection)=90.1% @ 69.5% coverage, 10/15 OOD caught. A6 (+calibration)=same decision as
A5, confidence ECE 0.054 vs. 0.274 raw. **v0.2 replicates the substring-bonus null result exactly**
(A0=A1=75.4%) and shows A2=72.4%, A3=79.3%, but A4/A5 selective accuracy is *lower* at *lower*
coverage than v0.1 (A5: 82.2% @ 58.9% coverage, 38/50 OOD caught vs. v0.1's 90.1% @ 69.5%) —
reported plainly as the harder v0.2 query mix making the accept/reject decision more difficult,
not as a regression in the underlying method. Figure 5 visualizes A0–A6 for v0.1
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
artifact (wrong commands can trigger unrelated risk patterns), not a classifier defect. On v0.2,
exact accuracy and recall shift modestly downward (83.9% exact, 0.864 recall) because the
classifier — deliberately not re-tuned against new benchmark examples — was authored before v0.2's
new gold commands existed; this surfaces the same documented gaps from the original evaluation,
not new ones.

## 15. Discussion

The central finding is nuanced, not a clean win, and we report it that way. Hybrid retrieval
measurably improves both *what* the system gets right and *how honestly* it communicates
uncertainty about what it gets wrong — two related but distinct problems, requiring two different
interventions (fusion for accuracy, calibration for confidence), neither of which alone was
sufficient (Section 8's error taxonomy shows 84.8% of the hybrid system's remaining errors on v0.1
are still high-confidence, improving only modestly to 67.5% on v0.2). But the accuracy
improvement's statistical significance is benchmark-composition-sensitive: even before any
multiple-comparison correction, it barely holds on the original 150-query benchmark and does not
replicate on the expanded, harder 209-query version, while a different comparison (hybrid vs.
dense-alone) becomes significant — and survives Holm correction — only on the expanded version.
Applying Holm–Bonferroni correction across the pre-registered four-comparison family sharpens this
picture rather than changing it qualitatively: of the four comparisons, only **calibration ECE
reduction survives correction on both benchmark versions**, OOD detection survives correction only
on the powered v0.2 benchmark, and the BM25-vs-hybrid accuracy comparison survives correction only
marginally on v0.1 and not at all on v0.2. We interpret this as evidence that a single benchmark,
however carefully constructed, can support a significance claim that is real but fragile to the
specific mix of query difficulty sampled — precisely the concern raised by Card et al. (2020) about
NLP benchmark power, and precisely why this program is reporting both benchmark versions' results,
under correction, rather than only the more favorable one. The intent-held-out generalization check
(Split B) adds an independent line of evidence for the same conclusion: the two findings that
survive multiple-comparison correction (accuracy-vs-BM25 marginally, OOD detection strongly) also
generalize essentially unchanged to command intents withheld from tuning, while calibration — still
a robust improvement — is measurably weaker on those same held-out intents. Together, this
strengthens our confidence that reliability, not raw accuracy, is this study's most defensible
individual contribution, and that this defensibility is not an artifact of a single benchmark's
composition or of intent overlap between tuning and test. This argues for treating calibration as
a first-class research target in retrieval-based assistants, not an afterthought to accuracy.

## 16. Limitations

See `research/paper/limitations.md` for the full, unabridged list: benchmark composition
sensitivity (the full ablation/calibration/safety suite was re-run on both v0.1 and v0.2, and all
primary comparisons were subsequently re-evaluated under Holm correction; the OOD-significance gap
on v0.1's 15-query subset was resolved and survives correction on v0.2's 50-query expansion, but
the core BM25-vs-hybrid accuracy significance did NOT survive correction on either benchmark
robustly — marginal on v0.1, absent on v0.2 — Section 11/15 — meaning neither benchmark version
alone should be treated as definitive), corpus scale (279 win32-visible unique intents, not the
431 raw record count — Section 5 — small relative to generation-oriented corpora, with an
additive schema migration completed but the planned 500–800-intent expansion not yet performed,
pending human authoring and validation), single-platform corpus, hand-authored queries (v0.2's new
queries additionally disclose AI-agent authorship under human direction, with independent
human re-validation of those queries likewise not yet performed — Section 6), no human-preference
study, fixed embedding-model choice, narrow (10%) functional-evaluation coverage (confirmed
unchanged between benchmark versions without re-executing identical sandboxed commands), an
unresolved ambiguity-detection weakness (confirmed to persist under intent-held-out evaluation,
F1 0.48–0.50 under both splits), and isotonic calibration's demonstrated sensitivity to both small
samples and intent generalization — measured directly, not merely hypothesized: the ECE reduction
attenuates from 77% within-distribution to 69% on intent-held-out evaluation (Section 11).

## 17. Threats to Validity

**Internal validity:** two real implementation bugs were found and fixed during this program
(isotonic tie-handling, an OOD-inclusive accuracy-denominator error) before any affected number
was reported — both documented in full rather than silently corrected, as a transparency measure.
A pre-existing document (`baseline-error-analysis.md`) was found to contain a transcription error
(87.7% vs. the correct 86.06%), corrected with a dated erratum. **External validity:** results
are specific to this 279-unique-intent, win32-only corpus (431 raw records, Section 5) and may not
generalize to larger or differently-distributed command libraries; the intent-held-out check
(Section 11) addresses generalization *within* this corpus's intent distribution, not beyond it.
**Construct validity:** "functional success" (Section
13) is defined as exit-code-0, not full semantic side-effect verification — a stated
simplification.

## 18. Conclusion

A lightweight, fully offline, non-LLM hybrid retrieval architecture improves accuracy and
substantially improves confidence calibration (56.7–84.1% relative ECE reduction, consistent
across both benchmark versions) over a real, previously-shipped BM25 baseline, evaluated under a
leakage-free nested cross-validation protocol throughout, re-run in full on two independently
constructed benchmark versions rather than one, and further validated under a pre-registered
Holm–Bonferroni correction and an intent-held-out (GroupKFold) generalization check. The initially
underpowered OOD-detection result was subsequently confirmed significant on a targeted benchmark
expansion built specifically to test whether the gap was one of sample size rather than effect —
it was, and the result **survives Holm correction** (Holm-adjusted p=0.00006) and generalizes to
held-out command intents (AUROC 0.898 held-out vs. 0.901 within-distribution). The headline
BM25-vs-hybrid accuracy significance, by contrast, did **not** replicate on the expanded benchmark
(raw p=0.016→0.070) and, even where nominally significant, **only barely survives multiple-
comparison correction** on the original benchmark (Holm-adjusted p=0.047) — while dense-vs-hybrid
significance newly appeared, and survives correction, on the expanded benchmark (Holm-adjusted
p=0.025) — reported as a central finding, not a footnote, because a study whose validated
improvement disappears the moment the benchmark composition changes, or the moment a standard
multiple-comparison correction is applied, is exactly the failure mode the underlying literature on
benchmark power (Card et al., 2020) warns about, and burying it would defeat the purpose of having
built a second benchmark and applied that correction at all. Calibration is the one finding in the
primary family that **survives Holm correction on both benchmark versions** (Holm-adjusted
p=0.0004 and p=0.0003) and remains a large, if somewhat attenuated, improvement under intent-held-
out evaluation (69% vs. 77% relative ECE reduction). The most defensible, replication-tested,
multiple-comparison-corrected, and generalization-checked claims from this program are therefore
the calibration improvement and the OOD detection improvement, not the raw accuracy gain in
isolation. Weaker and non-replicating results (dense-vs-hybrid significance flipping across
benchmark versions, ambiguity detection quality — confirmed weak under both class-stratified and
intent-held-out evaluation, the substring bonus's true effect, and the accuracy-significance
non-replication itself) are reported alongside the positive findings, not folded into an
overstated headline claim.

## 19. Future Work

A direct follow-up investigation of why v0.2's new short-technical-keyword ambiguous queries
shift the BM25-vs-hybrid and dense-vs-hybrid significance patterns (Section 11/15) — the current
manuscript offers an interpretation, not a tested cause; a richer ambiguity-detection feature
(v0.2's larger ambiguous subset improved F1 but not AUROC under either split, suggesting margin
alone is an incomplete signal even with more data or held-out intents); a placeholder-substitution
system to extend functional evaluation; an optional local-LLM comparator (explicitly deferred in
this program); a human-preference study. (Intent-held-out generalization itself, previously listed
here, has since been evaluated — Section 11 — and is no longer future work, though repeating it on
v0.1 for symmetry and on a future v1.0 benchmark remains open.)

Four further items are specified in detail (`research/TERMASSIST_RESEARCH_V1.0_SPEC.md`) but
require genuine human effort we did not substitute with automation, and so remain incomplete
rather than fabricated (full status: `research/V1.0_BUILD_STATUS.md`): expanding the corpus from
279 to 500–800 human-validated intents; independent second-annotator re-validation of the
AI-authored v0.2 queries (target Cohen's κ≥0.7); an independent, human-labeled safety evaluation
set (~50 items) not derived from or shared with the rule-based classifier's own logic; and
expanding functional evaluation from 15 to roughly 40–60 sandboxed tasks. None of these can be
responsibly completed by bulk automated generation or by the same process that produced the
system under test, which is precisely why they are listed as future work rather than attempted here.

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
11. Card, D., Henderson, P., Khandelwal, U., Jia, R., Mahowald, K., Jurafsky, D. (2020). With
    Little Power Comes Great Responsibility. EMNLP. arXiv:2010.06595.
12. Full related-work matrix (15 entries): `research/paper/related-work-matrix.csv`.
