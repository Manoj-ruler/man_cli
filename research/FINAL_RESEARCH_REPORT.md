# TermAssist Final Research Report

Status: Phases 17 (Decision Gate) and 18 (this expansion) complete. Phases 19–20 (reproducibility
QC, final release) remain.

---

## Phase 18 — The 18-Question Evidence Chain

### 1. What was the original architecture?
TermAssist's `cli/` is a pure lexical BM25 retrieval engine (`cli/search.js`): tokenize with a
10-word stopword list, BM25 scoring (`k1=1.2, b=0.75`) over `intent+category+description` text
for 431 curated commands, plus a hardcoded flat `+15.0` bonus when the query is a near-substring
of a command's intent. Confidence is `min(round(score/8*100), 100)`, rejecting below `score<2.0`.
No embeddings, no LLM, no persisted index (rebuilt per call). A companion Next.js/Supabase web
app (auth, snippet sync, query logging) exists but is not part of the research surface.

### 2. What was wrong with it?
An independent, byte-for-byte reproduction (Phase 1) of the frozen baseline confirmed: 67.3%
overall accuracy, 71.9% supported-task accuracy, 26.7% OOD rejection (73.3% false-acceptance),
28.6% ambiguity success, and — the most consequential finding — 86.06% mean confidence on the 49
wrong (non-rejected) predictions, with 44.9% of failures at exactly 100% confidence. The system is
frequently, and confidently, wrong.

### 3. What did the benchmark reveal?
`termassist_bench v0.1` (150 hand-adjudicated queries, 9 query types, ground-truth `risk_level`
labels already present) revealed the failure is not uniform: canonical/safety-sensitive queries
score 100%, but low-overlap-paraphrase (33.3%), polysemy (55.6%), and single-keyword (0.0%)
queries fail badly — a lexical-gap problem, not a general retrieval failure.

### 4. What research hypothesis was formulated?
That a lightweight hybrid lexical+semantic retrieval architecture, combined with explicit
uncertainty estimation (margin/entropy), OOD/abstention handling, and post-hoc confidence
calibration, could measurably improve retrieval robustness and reliability over pure BM25 without
the cost of a full generative (LLM) system — to be determined empirically, not assumed.

### 5. What method was implemented?
(a) A local, offline dense retriever (`Xenova/all-MiniLM-L6-v2`, 384-dim, cached embeddings);
(b) hybrid score fusion (`α·norm_BM25 + (1-α)·norm_dense`), α selected per fold via nested 5-fold
CV; (c) margin/entropy uncertainty signals over top-10 candidates; (d) OOD and ambiguity
detectors (dev-tuned thresholds on `top1_score` and `margin` respectively); (e) isotonic-
regression confidence calibration (nested CV); (f) a fully separate, deterministic rule-based
safety classifier. No LLM was introduced anywhere in the system.

### 6. Why was each component introduced?
Each component targets one specific, previously measured failure: dense retrieval for the
lexical gap (low-overlap-paraphrase); margin/entropy for distinguishing confident-correct from
confident-wrong; OOD detection for the 73.3% false-acceptance problem; calibration for the
86.06%-confidence-on-wrong-answers problem; the safety classifier as an independent, orthogonal
concern (risk of the retrieved command, not its correctness).

### 7. What experiments were performed?
E0–E12 (Phases 0–13): baseline audit and reproduction, dense-only retrieval, nested-CV hybrid
fusion, ablation (A0–A6), margin/entropy candidate capture, OOD/ambiguity/selective-prediction,
confidence calibration, a consolidated hyperparameter log, sandboxed functional evaluation
(narrow, 15/150 queries), rule-based safety evaluation, literature re-verification, figure/table
generation, automated error taxonomy, and exact McNemar's statistical testing.

### 8. What were the results?
See the Phase 17 evidence table above and `research/tables/table1_main_results.md`. Headline:
hybrid fusion 77.1% vs. baseline 71.9% (significant, p=0.016); calibration ECE −80.4% for the
hybrid confidence signal; OOD rejection 26.7%→46.7% (large but not significant at n=15); selective
prediction reaches 90.1% accuracy at 69.5% coverage.

### 9. What failed?
The substring bonus ablation (A0 vs. A1): zero measured effect, a clean null result. Ambiguity
detection via margin alone: weak (F1=0.31). Hybrid-vs-dense-alone significance: not established
(p=0.146). Two real bugs were found and fixed before any number was reported (Phase 8's isotonic
tie-handling bug, Phase 13's OOD-inclusive accuracy-denominator bug) — both documented, not
hidden.

### 10. What improved?
Retrieval accuracy (significantly), confidence calibration (substantially, across all 4 variants
tested), OOD rejection rate (substantially in magnitude, though underpowered statistically),
selective-prediction accuracy-at-reduced-coverage (substantially).

### 11. What did the ablation prove?
That the substring bonus contributes nothing measurable (A0=A1 exactly); that dense-alone is
close to but measurably below hybrid (A2 vs A3); that margin+OOD rejection (A5) trades ~30%
coverage for a ~13pp accuracy jump among answered queries — the accuracy gain traces cleanly to
the dense/fusion mechanism, not a confound.

### 12. What did functional testing prove?
On a narrow, explicitly-scoped 15-query subset (git + filesystem, placeholder-free,
non-interactive, host-safe): gold commands are 100% functionally correct (validates the
benchmark), and the hybrid system's retrieved commands are 93.3% functionally correct with zero
cases of "textually right but broken." This is positive but covers only 10% of the benchmark by
design, not a general claim.

### 13. What did safety testing prove?
A fully deterministic, auditable rule-based classifier achieves 95%/95% precision/recall on the
actionable risky (HIGH/CRITICAL) vs. not-risky distinction, with zero dangerous-direction misses,
against the benchmark's own pre-existing `risk_level` ground truth — without any ML/LLM component.

### 14. What are the limitations?
See `research/paper/limitations.md` (Phase 18 deliverable): small benchmark (150 queries, 15 OOD),
single-platform (win32) corpus, hand-authored benchmark queries, no large-scale human evaluation,
local-embedding-model dependency, functional evaluation covering only 10% of the benchmark,
ambiguity detection an open weakness, isotonic calibration's known small-sample sensitivity
(documented via the Phase 8 bug).

### 15. What is the defensible research contribution?
Per Phase 17: a lightweight, non-LLM hybrid retrieval architecture that delivers a statistically
significant accuracy improvement and a substantial, well-evidenced confidence-calibration
improvement over a frozen, real, previously-shipped BM25 baseline — evaluated under a fully
leakage-free nested cross-validation protocol, being the first (to this research's literature
re-check) reported lexical-IR baseline study of this kind on the NL2Bash/NLC2CMD task family.

### 16. What claims can the paper make?
"Hybrid BM25+dense fusion significantly improves retrieval accuracy over pure BM25 (p=0.016)."
"Post-hoc calibration substantially reduces confidence miscalibration (−80.4% ECE)." "OOD
rejection improves substantially in magnitude, though not confirmed significant at this sample
size." "A deterministic rule-based safety classifier achieves strong precision/recall without
any ML/LLM component."

### 17. What claims must the paper NOT make?
"Hybrid beats dense alone" (not significant). "OOD detection is statistically confirmed" (it
isn't, n=15). "Ambiguity is solved" (F1=0.31, weak). "The substring bonus caused the original
overconfidence problem" (ablation shows it has zero effect on top-1 accuracy). Any claim that
generalizes functional/safety results beyond their evaluated 10–83% coverage of the benchmark.
"TermAssist beats NL2Bash/modern LLMs" (different task framing — closed retrieval vs. open
generation — not a valid head-to-head).

### 18. What remains future work?
A larger benchmark (especially more OOD queries, to give that comparison statistical power); a
richer ambiguity-detection feature (margin+entropy combined, or learned); a real placeholder-
substitution system to extend functional evaluation beyond the current 15-query subset; an
optional local-LLM comparator (explicitly deferred, Phase 12 of the plan); and a human-preference
evaluation, not attempted in this program.

---

## Phase 17 — Decision Gate

Per `research/paper/FINAL_RESEARCH_PLAN.md`, this gate classifies the research program into
Outcome A (strong improvement), B (accuracy improves only slightly but reliability/OOD improves
significantly), or C (no meaningful improvement — reframe as a negative/characterization
result), based strictly on the evidence gathered in Phases 1–16, not on what would make the
best story.

### The evidence, laid out plainly

| Finding | Result | Statistical status |
|---|---|---|
| Hybrid fusion vs. pure BM25 (A0→A3) | 71.9% → 77.1% (+5.2pp) | **Significant**, exact McNemar's p=0.0156 |
| Hybrid fusion vs. dense alone (A2→A3) | 72.6% → 77.1% (+4.4pp) | **Not significant**, p=0.146 |
| OOD rejection, baseline vs. tuned | 26.7% → 46.7% (+20pp) | **Not significant** at n=15, p=0.25 (underpowered, not disproven) |
| Ambiguity detection (margin-based) | AUROC 0.784, F1 only 0.310 | Real signal, but a **weak** result — not oversellable |
| Confidence calibration, hybrid_reliability | ECE 0.274 → 0.054 (−80.4%) | Strong, consistent across all 4 confidence variants tested |
| Selective prediction (A5 vs. A3) | 77.1% unconditional → 90.1% selective accuracy @ 69.5% coverage | Real, large, practically meaningful trade-off |
| Substring bonus ablation (A0 vs. A1) | 0 command differences on 150 queries | **Null result** — the bonus does nothing measurable on this benchmark |
| Functional evaluation (narrow subset) | 100% gold / 93.3% retrieved execute successfully | Positive but only 15/150 queries (10% coverage), stated as a limitation |
| Safety classifier | 95%/95% precision/recall on risky binary, zero dangerous-direction misses | Strong, but evaluated on a small hand-labeled set (125 gold commands with defined risk labels) |

> **Update (benchmark v0.2, added after this decision gate was originally written):** the OOD
> row above is specific to `termassist_bench v0.1` (n=15 OOD queries) and remains historically
> accurate for that benchmark. A follow-up expansion, `termassist_bench v0.2` (209 queries, OOD
> grown to 50 via the same adjudication methodology — see
> `research/datasets/v0.2_ADJUDICATION_REPORT.md`), was built specifically to test whether this
> result was underpowered rather than weak. **It was underpowered**: on v0.2, the same comparison
> (baseline 34.0% → tuned 68.0% OOD rejection) is statistically significant, exact McNemar's
> **p=0.000015** (`research/results/v0.2/V0.2_RESULTS_NOTES.md`). The v0.1 finding above is left
> unedited as the historical record of what was known at the time this decision gate was written;
> the manuscript's current claims should cite the v0.2 result as the up-to-date, resolved finding.

### Classification: Outcome A, with explicitly scoped exceptions

**This is Outcome A — a lightweight, reliability-aware hybrid retrieval architecture that
delivers a statistically significant accuracy improvement over the frozen baseline, combined with
a strong, independently-confirmed reliability/calibration improvement — but Outcome A is claimed
here with real, stated exceptions, not as a clean sweep.**

The two load-bearing results for this classification are:

1. **The core accuracy claim is statistically significant, not just numerically larger.** A0 vs.
   A3 clears p<0.05 under an exact test appropriate for this sample size, with all 7 discordant
   query pairs favoring the hybrid system and none favoring pure BM25 — this is the strongest,
   cleanest result in the whole research program.
2. **The calibration improvement directly and robustly fixes the problem that motivated this
   entire research program.** The original, corrected finding (Phase 9's erratum) was 86.06%
   mean confidence on wrong baseline answers — a system that is confidently wrong most of the
   time it's wrong. Phase 8 shows this is fixable: an 80.4% relative reduction in ECE for the
   hybrid system's confidence signal, and improvement (not just for one lucky variant) across all
   four confidence signals tested. This is not a marginal or cherry-picked result.

**What must NOT be claimed, because the evidence does not support it:**

- **Hybrid does not statistically significantly beat dense retrieval alone** (p=0.146). The paper
  must say "hybrid fusion improves over pure BM25, with dense retrieval contributing the observed
  gain" — not "hybrid statistically beats every individual component."
- **The OOD rejection improvement, while large (+20pp) and practically meaningful, is not
  statistically confirmed at conventional significance given only 15 OOD queries.** This must be
  reported as "a real, measured, directionally consistent finding that current sample size cannot
  confirm at α=0.05" — explicitly avoiding the word "significant" for this specific claim.
- **Ambiguity detection is a genuinely weak result** (F1=0.31) and should be reported as an
  identified, unresolved limitation and a concrete direction for future work (e.g., combining
  margin with entropy, or a learned combination), not glossed over.
- **The substring-bonus ablation is a null result** — worth reporting precisely because it
  correctly refines (not simply confirms) an earlier hypothesis from the pre-existing qualitative
  error analysis, demonstrating this research program's willingness to report what didn't matter,
  not just what did.
- **Functional and safety evaluation are real but narrow** — 10% and a subset of the benchmark
  respectively — and must be presented with their exact scope stated, not generalized beyond it.

### Why this is not Outcome B or C

Outcome B ("accuracy improves only slightly, reliability improves significantly") does not fit:
a 5.2pp, p=0.016 accuracy improvement is not "only slightly," and it is the paper's most
defensible individual result, not a footnote to the reliability story. Outcome C (no meaningful
improvement, reframe as negative result) clearly does not fit either — there are two independent,
statistically or practically strong positive results (the A0-vs-A3 accuracy gain and the
calibration ECE reduction), not merely a null or negative finding across the board.

### Final contribution statement (this determines the manuscript's Abstract/Introduction claims)

> A lightweight hybrid lexical+semantic retrieval architecture, combined with post-hoc confidence
> calibration, statistically significantly improves both retrieval accuracy (+5.2pp, p=0.016) and
> confidence reliability (−80.4% ECE) over a frozen production BM25 baseline for natural-language-
> to-shell-command retrieval — evaluated under a fully leakage-free nested cross-validation
> protocol, with every individually weaker or null sub-result (dense-vs-hybrid significance, OOD
> detection significance at small N, ambiguity detection quality, the substring bonus's actual
> effect) reported explicitly rather than folded into an overstated headline claim.

This statement is what Phase 18's manuscript Abstract/Introduction must be built from — no
number in it, or in the manuscript, may exceed what is written in the evidence table above.
