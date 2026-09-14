# TermAssist Final Research Report

Status: Phase 17 (Decision Gate) complete. Phases 18–20 (manuscript, reproducibility QC, final
release) remain. This document will be expanded to answer the full 18-question evidence chain
in Phase 18; Phase 17's decision-gate section below is complete and final as written.

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
