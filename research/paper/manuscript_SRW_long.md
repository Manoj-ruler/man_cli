# Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study

**Target format:** ACL/EACL Student Research Workshop, long paper (8 pages + unlimited references).
*[Condensed from `manuscript.md`, the full research-report draft, which remains the canonical
source of record for every number in this document. This file is the submission-register
draft; see the note at the end of this document for what still needs to happen before it is an
actual camera-ready PDF.]*

---

## Abstract

Natural-language interfaces to the shell are typically framed as a generation problem: translate
an English request into a novel command (NL2Bash, NL2SH). We study a different, deliberately
constrained point in the design space — closed-vocabulary *retrieval* from a curated, pre-vetted
command library, using no large language model anywhere in the system. Starting from a real,
previously-shipped BM25 baseline (67.3% overall accuracy on a validated 150-query benchmark, but
with severe confidence miscalibration — 86.06% mean confidence on wrong answers), we test whether
a lightweight hybrid lexical+local-semantic retrieval architecture, combined with post-hoc
confidence calibration and margin-based rejection, can measurably improve both accuracy and
reliability. We evaluate on two versions of a benchmark we constructed — an original 150-query
version and an expanded 209-query version built specifically to probe statistical power on the
original's smaller subsets — under a fully leakage-free nested 5-fold cross-validation protocol.
Hybrid fusion improves supported-task accuracy over pure BM25 on both benchmarks (71.9%→77.1% and
75.5%→79.3%), but under a pre-registered Holm–Bonferroni correction across a four-comparison
primary family, this improvement **barely survives correction on the original benchmark
(Holm-adjusted p=0.047) and fails to survive on the expanded benchmark (raw p=0.070)** — a
non-replication we verified is not a computation error and report as a central finding.
Isotonic-regression calibration reduces confidence miscalibration substantially and consistently
(56.7–84.1% relative ECE reduction) and is the **only comparison that survives Holm correction on
both benchmarks** (Holm-adjusted p=0.0004, p=0.0003). Out-of-domain rejection, initially
underpowered on the original benchmark's 15-query OOD subset (raw p=0.25), is confirmed significant
after correction on the expanded benchmark's 50-query subset (Holm-adjusted p=0.00006). An
intent-held-out (GroupKFold) generalization check shows the surviving accuracy and OOD findings are
not artifacts of intent overlap between tuning and test, while calibration, though still
substantial, is measurably attenuated on unseen intents (69–77% vs. 76–80% relative ECE reduction).
A deterministic, rule-based safety classifier achieves 95%/95% precision/recall with zero
dangerous-direction misses. An independent re-validation check on a stratified sample of the
expanded benchmark's AI-authored queries yields Cohen's κ=0.63 (below our κ≥0.7 target),
with disagreement concentrated entirely in the ambiguous-query category and perfect agreement on
out-of-domain queries — a finding we report as measured, not adjusted. We position this as the
first reported study, to our knowledge, of a lexical/BM25 retrieval baseline for this task family
evaluated with nested-CV calibration, OOD detection, a multiple-comparison-corrected
benchmark-expansion replication check, and an intent-held-out generalization check — and we report
every weaker, null, and non-replicating result alongside the positive ones.

## 1. Introduction

Natural-language shell assistance can lower the barrier to command-line tools, but incorrect
commands — especially destructive ones — carry real cost. The dominant research trajectory since
NL2Bash (Lin et al., 2018) has been generative: seq2seq and Transformer models (the NLC2CMD
competition, 2020), then LLM-based systems (NL2SH; Westenfelder et al., 2025), most recently with
execution-grounded, RL-trained approaches (BashCoder-R1; Yu et al., 2026). This trajectory inherits
a persistent risk: open-vocabulary generation can hallucinate syntactically valid but semantically
wrong or unsafe commands.

We study a different, narrower approach implemented in a real, previously-shipped, in-use npm
package (TermAssist): retrieval from a fixed, pre-vetted corpus of 431 records spanning 279 unique
command intents on the evaluated platform, using classical lexical (BM25) scoring, with no LLM
anywhere in the system. This constrains coverage but structurally eliminates hallucination of
arbitrary commands. We independently audited and reproduced the system's baseline behavior
(Section 3) and found a specific, serious problem: the system is frequently *confidently* wrong,
not merely wrong. This paper asks whether that problem, and the system's accuracy more broadly, can
be improved without abandoning the no-LLM, fully-offline design constraint.

Given a natural-language query and a fixed corpus of `(intent, command, category, description, os)`
tuples, the task is to return the single best-matching command, or explicitly decline to answer if
no corpus entry is a confident match — retrieval, not generation, over a closed and pre-vetted
output space, unlike NL2Bash-style tasks where the model may emit any syntactically valid command
string.

**Research question.** Can a lightweight hybrid lexical+local-semantic retrieval architecture,
combined with explicit uncertainty estimation and post-hoc calibration, measurably improve accuracy
and reliability over a pure-BM25 baseline, without the cost or hallucination risk of a generative
system? **Contributions:** (1) an independent, reproduced audit of a real shipped BM25 baseline's
accuracy and — more consequentially — its confidence miscalibration; (2) a five-component
reliability-aware retrieval architecture evaluated under leakage-free nested cross-validation; (3)
a replication check across two independently constructed benchmark versions, under a
pre-registered Holm–Bonferroni correction, that overturns which of our own results we can actually
claim are significant; (4) an intent-held-out (GroupKFold) generalization check; and (5) full,
undiminished disclosure of every null, weak, or non-replicating result we found, including a
below-target independent inter-annotator agreement check on our own benchmark's AI-authored
queries.

## 2. Related Work

NL2Bash (Lin et al., 2018) established the seq2seq/CopyNet/Tellina baseline and the
BLEU/template/exact-match evaluation this field has used since. The NLC2CMD competition (Agarwal
et al., 2021) introduced a utility+flag-overlap metric more tolerant of near-miss answers than exact
match. NL2SH (Westenfelder et al., 2025) is the modern generation-based successor, with even SOTA
LLM accuracy reported as "remains low." Recent work reinforces our framing that exact-match
accuracy alone is an incomplete signal: QuoteBench (Li et al., 2026) shows matched execution scores
can mask command-path failures, and BashCoder-R1 (Yu et al., 2026), despite RL training against
execution feedback, tops out at 73–90% full functional success even as a strong system. A 2026
scaling study (Wang et al., 2026) finds BM25 overtakes dense and agentic retrieval past roughly 10M
corpus tokens, supporting lexical retrieval's competitiveness at scale, though at a corpus scale far
larger than ours. Notaro et al. (2024) train a transformer-based command-risk classifier; we
deliberately compare against a simpler, fully deterministic rule-based alternative (Section 7). No
prior work, to our knowledge, reports a BM25 retrieval baseline for this task family evaluated
under nested-CV calibration, OOD detection, and an intent-held-out generalization check — the gap
this paper fills.

## 3. TermAssist: Baseline System and Benchmark

**Baseline architecture** (frozen for this study, tag `v1.0-research-baseline`): tokenize
(lowercase, strip punctuation, 10-word stopword list), BM25 scoring (k1=1.2, b=0.75, standard IDF
smoothing) over `intent+category+description`, plus a flat +15.0 bonus when the query is a
near-substring of the command's intent. Confidence = `min(round(score/8×100), 100)`, rejected below
score<2.0. 431 corpus records, 27 categories, platform-filtered (win32/darwin/linux/all). No
embeddings, no LLM, mean latency 3.29ms. We independently re-verified this baseline is
byte-for-byte reproducible (0/150 mismatches against the archived results). **Corpus size
clarification:** 134 of the 431 records are cross-platform duplicates of the same intent, so the
retrieval space actually exercised on the evaluated (win32) platform is **279 unique intents, not
431** — the number we use throughout when comparing corpus scale to other work. We additively
migrated the corpus schema (re-verified non-breaking) to add fields supporting a planned expansion
to 500–800 human-validated intents; that expansion requires human authoring and validation and is
not yet complete, so all results here are reported on the original 279-intent corpus.

**Benchmark, v0.1.** 150 hand-adjudicated queries across 9 types (canonical, paraphrase,
low-overlap-paraphrase, ambiguous, OOD, polysemy, single-keyword, safety-sensitive,
complex-multi-intent), with ground-truth classification (119 CORRECT, 14 AMBIGUOUS, 15 OOD, 2
NEEDS_CORRECTION) and a risk-level field (120 LOW, 10 MEDIUM, 15 HIGH, 5 CRITICAL) reused in the
safety evaluation (Section 7). We independently verified benchmark integrity: an apparent SHA-256
mismatch on Windows checkouts was root-caused to a CRLF/LF line-ending artifact, not content
tampering.

**Benchmark, v0.2.** A second version (209 queries: the original 150 plus 35 new OOD and 24 new
ambiguous queries) was built specifically to test whether v0.1's small OOD (15) and ambiguous (14)
subsets were statistically underpowered. The new queries were authored and adjudicated by an AI
agent under human direction — disclosed explicitly — following the identical
design/verification methodology as v0.1 (each query checked against actual system retrieval
output, not judged from intuition; 6 of 30 drafted ambiguous candidates were rejected for failing
the ambiguity or novelty criteria). We report results on both versions throughout, since Sections 5
and 6 show they are not merely a larger sample of the same result.

**Baseline results (v0.1).** Overall accuracy 67.3% (101/150); supported-task (non-OOD) accuracy
71.9%; OOD rejection 26.7% (73.3% false-acceptance); ambiguity success 28.6%. By type:
canonical/safety-sensitive 100%, paraphrase 88.0%, complex-multi-intent 86.7%, polysemy 55.6%,
ambiguous 58.3%, low-overlap-paraphrase 33.3%, OOD 26.7%, single-keyword 0.0%. Mean confidence on
the 49 wrong (non-rejected) predictions: **86.06%**, with 44.9% of failures at exactly 100%
confidence — the central problem motivating this paper.

## 4. Reliability-Aware Retrieval Architecture

Five components, each targeting a specific measured failure: (1) local dense retrieval
(`Xenova/all-MiniLM-L6-v2`, 384-dim, offline after one-time download) for the lexical gap; (2)
hybrid score fusion with α tuned via nested 5-fold CV; (3) margin/entropy uncertainty signals over
top-10 ranked candidates; (4) OOD and ambiguity detectors (dev-tuned thresholds); (5) isotonic
confidence calibration. A sixth, independent component — a rule-based safety classifier — targets
command risk, orthogonal to retrieval correctness. No LLM is used anywhere in the system.

## 5. Experimental Methodology

All tuned parameters (fusion α, OOD/ambiguity thresholds) are selected via nested 5-fold
cross-validation (seed 42, stratified by classification) — **Split A**: for each test fold, the
parameter is chosen using only the other four folds, then applied once to the held-out fold, never
tuned on data it is later scored against. Statistical testing uses the exact (binomial) McNemar's
test, given small discordant-pair counts.

**Multiple-comparison correction.** We pre-register a primary family of four comparisons per
benchmark version — accuracy vs. BM25, accuracy vs. dense-alone, OOD rejection, and calibration ECE
reduction — and apply Holm–Bonferroni correction within each family; a result is called significant
only at Holm-adjusted p<0.05. The preregistration text and family definition predate the corrected
results.

**Bootstrap confidence intervals.** Percentile bootstrap (10,000 resamples, seed 42) provides 95%
CIs for the accuracy deltas (paired resampling over non-OOD query ids) and for the calibration ECE
reduction (resampling over pooled held-out predictions), complementing the discrete exact McNemar's
test with a continuous-estimate view of the same comparisons.

**Split B — intent-held-out generalization.** To test whether Split A's findings depend on the same
command intents appearing in both tuning and test folds, we additionally construct a GroupKFold
split keyed by a derived intent-group id (the gold command for answerable queries; the sorted
acceptable-command set for ambiguous queries; a singleton per query for OOD queries, which target
no intent). We run this on both benchmark versions (171 groups over v0.2's 209 queries; 125 groups
over v0.1's 150 queries), both verified programmatically to place zero groups across more than one
fold, so α, the detector thresholds, and the isotonic calibrator are always selected on queries
targeting *different* command intents than those they are scored on.

## 6. Results

**Retrieval accuracy.** On v0.1: BM25 71.9%, dense-only 72.6–72.7%, hybrid 77.1% (bootstrap 95% CI
on the delta [2.2, 8.9]pp; exact McNemar's p=0.0156, **survives Holm correction, but only just**:
Holm-adjusted p=0.047, family size 4). On v0.2: BM25 75.5%, dense-only 72.3–72.4%, hybrid 79.3%
(+3.8pp, bootstrap CI [0.6, 7.5]pp) — **this comparison does not clear p<0.05 even before
correction** (raw p=0.070). At the per-query level, 7 of 8 discordant non-OOD pairs on v0.2 still
favor hybrid, but one (`TA-B194`, "sudo reboot" vs. "sudo shutdown -h now") now favors BM25, and the
larger, harder query set is enough to push the p-value above the conventional threshold — not a
computation error. The bootstrap CI on v0.2's delta technically excludes zero while the discrete
exact test does not reach significance; we treat this as **method-divergent, borderline evidence**,
not a resolved significant result. Conversely, hybrid vs. dense-alone flips from not significant on
v0.1 (Holm-adjusted p=0.292) to significant on v0.2 even after correction (Holm-adjusted p=0.025) —
we attribute this, as an interpretation rather than a proven cause, to v0.2's 17 new
short-technical-keyword ambiguous queries (`grep`, `sed`, `awk`, `tar`, etc.), where BM25's
exact-token-match strength is plausibly more competitive; we did not further test this and flag it
as future work.

**OOD and ambiguity detection.** On v0.1: AUROC 0.867 (OOD, feature = absolute top-1 score) and
0.784 (ambiguity, feature = margin) — an evidence-driven feature choice (Section 4), not selected
post-hoc. On v0.2 (OOD subset expanded 15→50 queries): OOD AUROC improves to 0.901, and the
baseline-vs-tuned rejection-rate improvement (34.0%→68.0%) **survives Holm correction**
(Holm-adjusted p=0.00006) — resolving the power limitation of the v0.1-scale result, which was not
significant even before correction (raw p=0.25). Ambiguity detection F1 improves on v0.2
(0.310→0.496) though AUROC slightly decreases (0.784→0.723), reported as measured.

**Calibration.** ECE is reduced 56.7–84.1% across four confidence variants tested, largest for the
hybrid system's own fused-score signal. A paired bootstrap test of the reduction gives one-sided
p≈0.0001 on both benchmarks, and this is the **only comparison in the primary family that survives
Holm correction on both benchmark versions** (Table 1). Selective answering at 50% coverage
achieves 10.7% error vs. 30.7% unconditional.

**Table 1: Holm-corrected significance and bootstrap CIs.**

| Benchmark | Comparison | Raw p | Holm-adj. p | Sig. (α=0.05) | Bootstrap 95% CI |
|---|---|---|---|---|---|
| v0.1 | Accuracy, hybrid vs. BM25 | 0.0156 | 0.0469 | **Yes** | [2.2, 8.9]pp |
| v0.1 | Accuracy, hybrid vs. dense | 0.1460 | 0.2920 | No | [-0.7, 9.6]pp |
| v0.1 | OOD rejection, tuned vs. baseline | 0.25 | 0.2920 | No | — |
| v0.1 | Calibration ECE reduction | 0.0001 | 0.0004 | **Yes** | [0.128, 0.283] |
| v0.2 | Accuracy, hybrid vs. BM25 | 0.0703 | 0.0703 | No | [0.6, 7.5]pp |
| v0.2 | Accuracy, hybrid vs. dense | 0.0127 | 0.0255 | **Yes** | [1.9, 11.9]pp |
| v0.2 | OOD rejection, tuned vs. baseline | 0.000015 | 0.00006 | **Yes** | — |
| v0.2 | Calibration ECE reduction | 0.0001 | 0.0003 | **Yes** | [0.172, 0.295] |

**Intent-held-out generalization (Split B).** GroupKFold over 171 derived intent groups (v0.2; 0
groups split across folds, verified programmatically) shows the two Holm-surviving v0.2 findings
above are not artifacts of intent overlap between tuning and test: non-OOD accuracy is 79.24% under
Split B vs. 79.25% under Split A, and OOD AUROC is 0.898 vs. 0.901 — both effectively unchanged.
Calibration, while still a large improvement, is measurably **attenuated on held-out intents**: a
69.0% vs. 77.2% relative ECE reduction. The identical protocol run on v0.1 (125 groups) replicates
the same qualitative pattern at smaller, noisier scale (Table 2) — consistent with the same
v0.1-scale OOD underpowering already noted above, not a new artifact.

**Table 2: Split A vs. Split B (intent-held-out generalization).**

| Benchmark | Metric | Split A | Split B | Δ |
|---|---|---|---|---|
| v0.1 | Non-OOD accuracy | 77.06% | 77.04% | −0.02pp |
| v0.1 | OOD AUROC | 0.867 | 0.849 | −0.018 |
| v0.1 | Ambiguity F1 | 0.310 | 0.300 | −0.010 |
| v0.1 | Calibration ECE | 0.274→0.054 | 0.274→0.065 | +0.011 |
| v0.2 | Non-OOD accuracy | 79.25% | 79.24% | −0.01pp |
| v0.2 | OOD AUROC | 0.901 | 0.898 | −0.003 |
| v0.2 | Ambiguity F1 | 0.496 | 0.479 | −0.017 |
| v0.2 | Calibration ECE | 0.324→0.074 | 0.324→0.101 | +0.027 |

## 7. Ablation, Functional, and Safety Evaluation

**Ablation (v0.1 → v0.2).** A0 (BM25) = 71.9%/75.4%; A1 (BM25, no substring bonus) is **identical**
to A0 on both benchmarks (0 command differences on 150 or 209 queries) — the bonus fires on 47/150
v0.1 queries but never changes the top-1 winner, a null result we report plainly rather than let
the bonus's presence imply an untested effect. A2 (dense) = 72.6–72.7%/72.4%; A3 (hybrid,
nested-CV) = 77.0–77.1%/79.3%. A4 (+margin rejection) reaches 88.5% selective accuracy @ 70.8%
coverage on v0.1; A5 (+OOD detection) reaches 90.1% @ 69.5% coverage (10/15 OOD caught). On v0.2,
A5 is *lower* at *lower* coverage (82.2% @ 58.9%, 38/50 OOD caught) — the harder v0.2 query mix
making the accept/reject decision more difficult, not a regression in the method. A6
(+calibration) makes the same decisions as A5 but with ECE 0.054 vs. 0.274 raw.

**Functional evaluation.** Sandboxed execution (disposable temp directories, never the host
machine) on a deliberately narrow, explicitly-scoped 15/150-query subset (git + filesystem,
placeholder-free, non-interactive, host-safe gold commands only). Gold commands: 100% functional
success (validates benchmark quality). Retrieved (hybrid) commands: 93.3% functional success, zero
cases of textually-correct-but-functionally-broken — a positive result that covers only 10% of the
benchmark by design.

**Safety evaluation.** A fully deterministic, rule-based classifier (LOW/MEDIUM/HIGH/CRITICAL),
authored from general domain knowledge before inspecting per-query outcomes, evaluated against the
benchmark's pre-existing risk-level ground truth: 89.6% exact 4-tier accuracy (112/125 gold
commands), 95%/95% precision/recall on the actionable risky-vs-not-risky binary, zero
dangerous-direction misses (no CRITICAL/HIGH command ever tagged safe). On retrieved commands,
accuracy holds (90.0%) but risky-binary precision drops to 0.826 — a retrieval-error artifact, not
a classifier defect. On v0.2, exact accuracy and recall shift modestly downward (83.9%/0.864)
because the classifier — deliberately not re-tuned against new examples — was authored before
v0.2's new gold commands existed, surfacing the same documented gaps, not new ones.

## 8. Independent Re-Validation of AI-Authored Benchmark Queries

v0.2's 59 new queries were authored and adjudicated by an AI agent under human direction. To check
this did not silently introduce systematic labeling error, we drew a stratified, blind, seed-42
sample of 14 of these 59 queries (8 OOD, 6 ambiguous) and had an independent reviewer — blind to
the original label of each specific query — judge them fresh into one of three categories. Result:
**Cohen's κ = 0.6316**, below our pre-specified κ≥0.7 target, reported as measured. The
disagreement is not uniform: agreement was **perfect on the 8 OOD-labeled items (8/8)** and
entirely concentrated in the **6 ambiguous-labeled items (3/6)**. All three disagreements were
short, bare-keyword-style queries ("list running processes", "ffmpeg", "pip") that our labeling
called ambiguous — following v0.1's own precedent of treating bare tool-name keywords like
`git`/`docker` as ambiguous — while the independent reviewer judged each to have one sufficiently
obvious default command. We read this as corroborating, not weakening, the OOD-significance claim
(Section 6, Table 1) — which rests on the OOD label set, independently validated here — while
sharpening the already-disclosed ambiguity-detection weakness with a specific, localized cause. We
also disclose that reviewer independence here is *partial*: the reviewer directed the original
authoring process at a summary level, though was blind to which label each of these 14 specific
queries had received. A fully independent, non-project-affiliated annotator reaching κ≥0.7 remains
open future work.

## 9. Discussion

The central finding is nuanced, not a clean win, and we report it that way. Hybrid retrieval
measurably improves both *what* the system gets right and *how honestly* it communicates
uncertainty about what it gets wrong — two related but distinct problems, requiring two different
interventions, neither of which alone was sufficient (84.8% of the hybrid system's remaining errors
on v0.1 are still high-confidence, improving only modestly to 67.5% on v0.2). But the accuracy
improvement's statistical significance is benchmark-composition-sensitive: it barely holds on the
original 150-query benchmark and does not replicate on the expanded, harder 209-query version, while
a different comparison (hybrid vs. dense-alone) becomes significant, and survives correction, only
on the expanded version. Applying Holm–Bonferroni correction sharpens this picture rather than
changing it qualitatively: of the four pre-registered comparisons, only calibration ECE reduction
survives correction on both benchmarks, OOD detection survives correction only on the powered v0.2
benchmark, and the BM25-vs-hybrid accuracy comparison survives correction only marginally on v0.1
and not at all on v0.2. We interpret this as evidence that a single benchmark, however carefully
constructed, can support a significance claim that is real but fragile to the specific mix of query
difficulty sampled — precisely the concern Card et al. (2020) raise about NLP benchmark power, and
precisely why we report both benchmark versions' results, under correction, rather than only the
more favorable one. The intent-held-out check adds an independent line of evidence for the same
conclusion: the two findings that survive correction also generalize essentially unchanged to
withheld command intents, while calibration — still a robust improvement — is measurably weaker on
those same held-out intents. The independent κ check (Section 8) adds a third, orthogonal line of
evidence pointing the same direction: the OOD claim is corroborated from yet another angle, while
the weakest claim (ambiguity) accumulates yet another disclosed weakness. Together, this argues that
reliability, not raw accuracy, is this study's most defensible individual contribution — not an
artifact of any single benchmark's composition, of intent overlap between tuning and test, or of
label-authoring method.

## 10. Limitations

- **Benchmark composition sensitivity.** The full evaluation suite was re-run on two independently
  constructed benchmark versions and all primary comparisons were re-evaluated under Holm
  correction. The OOD-significance gap on v0.1's 15-query subset was resolved on v0.2's 50-query
  expansion, but the core BM25-vs-hybrid accuracy significance did **not** survive correction
  robustly on either benchmark (marginal on v0.1, absent on v0.2) — neither benchmark version alone
  should be treated as definitive.
- **Canonical-query independence.** All 25 canonical queries are verbatim-equal to a corpus intent,
  so 100% canonical accuracy is a positive-control sanity check, not evidence of
  language-understanding capability; the paraphrase, low-overlap, polysemy, and ambiguous types
  carry the actual capability claims.
- **Corpus scale.** 279 win32-visible unique intents (431 raw records), small relative to
  generation-oriented corpora; an additive schema migration is complete, but the planned 500–800
  intent expansion is not, pending human authoring and validation. Results are single-platform
  (win32).
- **Query authorship.** v0.2's 59 new queries were authored and adjudicated by an AI agent under
  human direction, disclosed explicitly. Independent re-validation (Section 8) on a stratified
  sample yielded κ=0.63, below our κ≥0.7 target, with disagreement concentrated in the ambiguous
  category and perfect agreement on OOD queries; reviewer independence was partial, not a fully
  uninvolved third party.
- **No large-scale human evaluation or preference study**, fixed embedding-model choice, and narrow
  (10%) functional-evaluation coverage (confirmed unchanged between benchmark versions without
  re-executing identical sandboxed commands).
- **Ambiguity detection remains an unresolved weakness** (F1 0.48–0.50 under both class-stratified
  and intent-held-out evaluation), now further explained by Section 8's finding that bare-keyword
  queries are specifically where independent annotators disagree with our own ambiguous labels.
- **Isotonic calibration's sensitivity to small samples and intent generalization** is measured
  directly, not merely hypothesized: the ECE reduction attenuates from 77% within-distribution to
  69% on intent-held-out evaluation.
- **Construct validity.** "Functional success" is defined as exit-code-0, not full semantic
  side-effect verification.
- **External validity.** Results are specific to this 279-intent, win32-only corpus and may not
  generalize to larger or differently distributed command libraries; the intent-held-out check
  addresses generalization *within* this corpus's intent distribution, not beyond it.

## 11. Ethics Statement

TermAssist retrieves from a fixed, human-curated command library rather than generating arbitrary
shell commands, which structurally bounds the space of possible harmful outputs to commands a human
already vetted — but a retrieved command can still be inappropriate for a given user's intent, and
our own baseline audit found the deployed system is frequently *confidently* wrong. We evaluate
command risk with a separate, deterministic safety classifier (Section 7) specifically because
retrieval correctness and command risk are orthogonal concerns; a correctly-retrieved command can
still be destructive if misapplied, and no component in this study executes a retrieved command
against a user's real system. All functional-evaluation command execution in this study ran in
disposable, sandboxed temporary directories, never against a host machine. We disclose the
AI-assisted authorship of part of our benchmark (Section 3) and the below-target result of our own
attempt to independently validate it (Section 8) rather than omit or minimize either.

## 12. Conclusion and Future Work

A lightweight, fully offline, non-LLM hybrid retrieval architecture improves accuracy and
substantially improves confidence calibration over a real, previously-shipped BM25 baseline,
evaluated under a leakage-free nested cross-validation protocol, re-run in full on two
independently constructed benchmark versions, and further validated under a pre-registered
Holm–Bonferroni correction, an intent-held-out generalization check, and an independent
inter-annotator agreement check. The most defensible, replication-tested, multiple-comparison-
corrected, and generalization-checked claims from this program are the calibration improvement and
the OOD detection improvement — not the raw accuracy gain in isolation, which does not replicate
robustly across benchmark versions. Open future work includes: a direct investigation of why v0.2's
short-technical-keyword ambiguous queries shift the accuracy-significance pattern (Section 6; we
offer an interpretation, not a tested cause); a richer ambiguity-detection feature, since a larger
ambiguous subset improved F1 but not AUROC under either split; expanding the corpus from 279 to
500–800 human-validated intents; reaching κ≥0.7 on the independent query-validation check with a
fully independent annotator; an independent, human-labeled safety-evaluation set not derived from
the rule-based classifier's own logic; expanding functional evaluation from 15 to roughly 40–60
sandboxed tasks; and a human-preference study. None of these can be responsibly completed by bulk
automated generation or by the same process that produced the system under test, which is precisely
why they remain future work rather than attempted here.

## References

Lin, X.V., Wang, C., Zettlemoyer, L., Ernst, M.D. (2018). NL2Bash: A Corpus and Semantic Parser for
Natural Language Interface to the Linux Operating System. *LREC*. arXiv:1802.08979.

Agarwal, R. et al. (2021). NLC2CMD Competition Report. *NeurIPS Competition Track*.
arXiv:2103.02523.

Agarwal, R. et al. (2020). Project CLAI: Instrumenting the Command Line as a New Environment for AI
Agents. arXiv:2002.00762.

Yang, J. et al. (2023). InterCode: Standardizing and Benchmarking Interactive Coding with Execution
Feedback. *NeurIPS Datasets & Benchmarks*. arXiv:2306.14898.

Westenfelder, A. et al. (2025). LLM-Supported Natural Language to Bash Translation. *NAACL*.
arXiv:2502.06858.

Li, S., Zhang, Y., Tresp, V., Yang, Y. (2026). QuoteBench: How Matched Scores Can Hide Command-Path
Failures. arXiv:2608.13547.

Yu, L., Wang, P., Xu, J., Zhang, J., Wang, X., Ma, J., Yang, L., Deng, C., Wang, Z., Zhang, F.
(2026). BashCoder-R1: Towards Robust and Explainable Bash Code Generation with Robustness-Aware
Group Relative Policy Optimization. *ISSTA 2026*. arXiv:2606.27733.

Wang, P., Xu, B., Wang, S., Du, M., Zeng, X., Wu, H., Zhang, L., Zhang, L. (2026). BM25 Wins at
Scale: A Scaling Study of Retrieval-Augmented Generation Paradigms. arXiv:2607.26497.

Husain, H. et al. (2019). CodeSearchNet. arXiv:1909.09436.

Notaro, P., Haeri, S., Cardoso, J., Gerndt, M. (2024). Command-line Risk Classification using
Transformer-based Neural Architectures. arXiv:2412.01655.

Card, D., Henderson, P., Khandelwal, U., Jia, R., Mahowald, K., Jurafsky, D. (2020). With Little
Power Comes Great Responsibility. *EMNLP*. arXiv:2010.06595.

---

## Note on remaining pre-submission work (not part of the paper text above)

This condensing pass did three things: (1) cut internal file-path citations (`research/...`)
throughout and replaced them with either inline content (Tables 1–2 now contain the actual numbers,
not a pointer to a generated file) or omission; (2) restructured the Limitations section from one
run-on paragraph pointing to an external file into standalone bullet points, since ACL/EACL venues
require Limitations to be a complete, self-contained section of the submitted paper itself; (3)
added a short Ethics Statement, standard/expected at these venues and previously absent; (4)
removed the non-citation "related-work matrix" entry from the reference list and filled in two
references that were missing author names.

What this pass did **not** do, and what still remains:

1. **Actual page-count verification.** This is markdown, not the ACL LaTeX template. Body text
   (Abstract through References, excluding this note) is ~4,300 words plus two inline tables and
   up to five figures not yet placed. ACL two-column pages run roughly 800–950 words/page of dense
   prose, so text alone points to a bit over 4.5 pages — but the two tables and the figures below
   will add real space once placed, and only building it in the actual template will confirm
   whether this fits comfortably in 8 pages or needs a further trim.
2. **Figures.** `research/figures/` has five SVGs (accuracy comparison, accuracy-by-type,
   reliability diagram, risk-coverage curve, ablation) already generated from committed results;
   none are placed in this draft yet. A sixth (error-taxonomy) exists but isn't currently cited by
   any section — decide whether to include it or leave it out.
3. **Anonymization for double-blind review.** No author names appear in this draft, but the system
   under study, TermAssist, is a real, named, public npm package. If its repository or package
   metadata identifies its author, referencing it by name may itself be de-anonymizing regardless
   of anything else in the text. This is a judgment call for you, not something I can silently
   resolve: options include (a) accepting the risk since studying one's own public artifact is
   common and often explicitly permitted by venue policy, (b) checking the specific target venue's
   anonymity policy on referencing an author's own public prior work, or (c) anonymizing the system
   name for the review version and de-anonymizing at camera-ready.
4. **Reproducibility/artifact statement.** I did not add one, since its correct content (a public
   repository link, or "supplementary material") depends on the anonymization decision above.
5. **A fresh literature-novelty check close to the actual submission date**, per the roadmap's own
   "should do" item — I verified the three 2026 citations are real papers with accurate claims as
   of today, but did not run a new novelty search.
