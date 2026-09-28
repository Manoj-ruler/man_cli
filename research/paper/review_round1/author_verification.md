# Author-side verification of review round 1 (2026-09-28)

The Phase 2 package marks some claims "author to verify", because the panel saw only the manuscript. These
checks were done by the dispatching session against the repository data and the primary sources. They inform
the author's triage in the next revision round; they do not change the panel's decision or roadmap, which
stay immutable.

| Claim (source) | Checked against | Finding |
|---|---|---|
| NLC2CMD metric is confidence-weighted (R2 W2, REV-32) | NLC2CMD report, arXiv 2103.02523, full PDF text | **Confirmed.** Each prediction carries a confidence δ that "is factored into the competition evaluation"; the example rows show the score scaled by ±δ. |
| NLC2CMD had a TF-IDF retrieval entry with a learned confidence adjuster (R2 W1, REV-07) | same report, §6 (team AINixCLAISimple) | **Confirmed.** It used TF-IDF retrieval over training pairs, plus "A logistic regression model was fit to predict the probability the prediction would result in a positive score", which gave +0.043. Its best score was 0.472, within 12% of the best model, at ≤10 ms. The report also notes retrieval's "exemplar-based explanations" help users judge reliability. |
| GPT-2 entry overconfident (R2 W2) | same report | **Confirmed.** "the confidences given by the GPT-2 models were not calibrated and usually overconfident". |
| Our related-work matrix row for NLC2CMD | `research/paper/related-work-matrix.csv` | **Error in our own file.** It says "no team submitted a pure lexical-IR baseline", which is false (see above). Fix in the next revision. |
| BashCoder-R1 trained against execution feedback (EIC W10, R2 W6, REV-12) | arXiv 2606.27733 abstract | **The paper is wrong.** The reward is "syntax correctness, robustness (verified by shellcheck), and format adherence", i.e. static analysis. Fix §1 and §2. |
| ShellFusion exists (R2 W1) | ACM DL 10.1145/3510003.3510131; IEEE Xplore 9794105 | **Confirmed**: ICSE 2022, a retrieval-based shell-command answer generator using Q&A posts, man pages and TLDR. Before citing, build a verified BibTeX entry as in T6. |
| Abstract limit 200 words (EIC W4, REV-04) | ACL formatting guidelines (acl-org.github.io/ACLPUB/formatting.html) | **Confirmed**: "The abstract should be no longer than 200 words." The current abstract is about 320 words. |
| The 15 original OOD queries were not screened with retrieval scores (R1 W1) | `research/datasets/TERMASSIST_BENCH_DESIGN.md` §8 and line 65 | **Supported.** v0.1 OOD queries were "Verified by searching all intents and descriptions for relevant keywords". The 7.39 / 0.31 retrieval-score screen applies to the 35 added in v0.2 (`v0.2_ADJUDICATION_REPORT.md`). |
| "smaller gain" on the original OOD subset (DA m2, our own sentence) | `phase1_t2_ood_breakdown.json` | **Our sentence is wrong in rates.** 9/15 − 4/15 = +33.3 points vs 25/35 − 13/35 = +34.3 points; only the counts and the p-value differ. Remove the "smaller gain … selection effect" wording. |
| 6 of 50 OOD queries missing from the by-kind breakdown (DA) | `phase1_t2_ood_breakdown.json` | **Confirmed.** The text reports terminal-task (10) and non-computing (34); far_ood (5: detector 4, baseline 3) and nonsensical (1: 1 vs 0) are omitted. |
| Two p-values for the same 15 OOD queries (DA) | phase1 T2 | **Explained, not an error.** p=0.25 is the v0.1 run (detector 7/15 vs baseline 4/15, v0.1-tuned thresholds); p=0.0625 is the same 15 queries inside the v0.2 run (9/15 vs 4/15, thresholds tuned on v0.2 folds). The paper should say this. |
| Post-calibration Brier "in the range of a constant forecaster" (DA M1) | nested isotonic outputs (phase1_common), no-skill = in-sample base rate × (1 − base rate) | **Half right.** The **raw shipped confidence is worse than no-skill** on v0.1 (0.254 vs 0.229; 0.305 vs 0.244 without controls), which strengthens the audit finding. **After calibration** both signals beat no-skill: Brier skill score 0.19–0.45 across versions, signals and populations (e.g. hybrid, v0.1, controls excluded: 0.145 vs 0.233). The in-sample base rate slightly flatters the no-skill reference. |
| Correctness-AUROC intervals exist (DA M2, REV-26) | `phase1_t3_selective_ties.json` | **Available, not in the paper.** Hybrid 0.858 [0.789, 0.921] vs baseline 0.755 [0.680, 0.825] (v0.1); 0.889 [0.841, 0.932] vs 0.830 [0.774, 0.881] (v0.2). There is no paired interval on the difference yet, which is new analysis. |

## Process notes

- **Skill.** Reviewer skill v1.11.1, full mode. It was loaded by reading `SKILL.md`, because the session's skill list predates the install. Phase 0 ran inline and you confirmed the panel. The five Phase 1 seats and the Phase 2 synthesizer ran as separate subagents with fresh contexts; none could see another seat's output.
- **Provenance.** `panel_provenance.json` passes the skill's replay validator. All seats are one model family, so its correlated-error disclosure applies.
- **Install fix.** The skills were first checked out with CRLF line endings, which broke the provenance script's pinned contract hash. They were re-checked out with LF (`core.autocrlf false`) and reinstalled while Phase 1 was running. No report mentions a missing or unreadable instruction file.
- **Acronym check.** Appended to the decision letter by the dispatching session, as the skill specifies.
