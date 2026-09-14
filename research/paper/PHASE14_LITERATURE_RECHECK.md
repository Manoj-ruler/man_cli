# Phase 14 — Literature / Novelty Re-verification

**Method:** targeted WebSearch re-check (2026-09-14) for anything published since the original
literature review (earlier in this research program) that would affect novelty claims,
specifically for: NL-to-shell retrieval/generation, BM25 vs. dense/hybrid retrieval, and
evaluation-methodology critiques for command generation. Full matrix:
`research/paper/related-work-matrix.csv` (15 entries).

## New findings since the original review

1. **QuoteBench (Li, Zhang, Tresp, Yang, arXiv:2608.13547, Aug 2026)** — directly relevant: shows
   matched/exact execution scores can hide real failure classes in LLM-issued shell commands
   (success drops 55–73pp when the same output is replayed through an added parser). This is an
   independent, very recent confirmation of exactly the theme TermAssist's own Phase 10/13 work
   makes (exact-match retrieval accuracy alone hides real functional/calibration issues) — good
   supporting citation, not a competing claim, since it targets LLM-agent transport failures, a
   different failure mode than TermAssist's closed-vocabulary retrieval setting.
2. **BashCoder-R1 / BashBench (arXiv:2606.27733, ISSTA 2026)** — modern (2026) RL-trained LLM
   generation SOTA, evaluated on a 952-task benchmark with shellcheck-based robustness scoring.
   Reports FullRate (syntax+robust+functional) of 73–90% depending on task type — notably **still
   well under 100%**, even for a strong, purpose-built, RL-trained 2026 system. This is useful
   context: it means TermAssist's Phase 10 finding (100% gold-command executability, by
   construction of retrieving from a pre-vetted set) is a genuinely different reliability
   trade-off, not simply "worse because it's not an LLM."
3. **"BM25 Wins at Scale" (arXiv:2607.26497, Jul 2026)** — a 2026 scaling study finding BM25
   overtakes dense/hybrid retrieval at larger corpus scale (margin approaching 20 points at full
   scale). Directly supportive of positioning lexical retrieval as a legitimate, non-naive
   choice — though the corpus scale studied (~10M+ tokens) is far larger than TermAssist's 431
   commands, so this is cited as directional support for BM25's competitiveness in general, not
   a scale-matched comparison.
4. **whatisit-nl2sh (GitHub, 2026)** — a real, existing local/offline fine-tuned small LLM
   (quantized Qwen2.5-Coder-1.5B, ~1s CPU inference) for this exact task. Not peer-reviewed, no
   published benchmark numbers, but relevant as "a path not taken" — worth citing explicitly in
   the paper's Limitations/Future Work to preempt the obvious reviewer question "why not just use
   a small local LLM instead of BM25/hybrid retrieval?"

## Novelty claim: still defensible, now more precisely scoped

No paper found, in either the original review or this re-check, reports **a lexical/BM25
retrieval baseline evaluated under nested cross-validation with calibration, OOD detection, and
selective prediction on the NL2Bash/NLC2CMD task family**. The closest adjacent work
(NLC2CMD itself, "BM25 Wins at Scale," the retrieval-augmented-code-generation empirical study)
either doesn't apply BM25 to this specific task, or applies it at a very different scale/purpose
(RAG context retrieval, not final-answer retrieval). This remains TermAssist's core, still-open
empirical gap.

**What changed since the original review:** the addition of QuoteBench and BashCoder-R1
strengthens (rather than threatens) the paper's positioning — both are 2026 confirmations that
(a) evaluation-methodology critique of exact-match scoring is an active, current research theme
(supports Phase 10/13's framing), and (b) even SOTA 2026 LLM generation systems do not achieve
perfect functional reliability, which is the honest context TermAssist's own 100%-gold-
executability-by-construction result (Phase 10) needs to be read against — not as "TermAssist
beats LLMs" but as "a different point in the reliability/flexibility trade-off space."

## Conclusion

Re-verification complete. No newly discovered paper invalidates or preempts TermAssist's
research contribution as scoped. Related-work matrix updated with 4 new 2026 entries.
