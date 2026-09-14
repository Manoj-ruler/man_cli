# TermAssist — Truthful Publication Roadmap

This supersedes the corpus-expansion direction proposed earlier (431→1,000–1,500 commands) with
a smaller, literature-grounded, actually-achievable plan. Every claim below is either sourced to
a paper found via web search (2026-09-14) or to this project's own already-verified results —
nothing is asserted without a basis.

## 1. What the literature says about benchmark size (the actual constraint)

**Card, Henderson, Khandelwal, Jia, Mahowald, Jurafsky, "With Little Power Comes Great
Responsibility" (EMNLP 2020, arXiv:2010.06595)** — the standard reference on statistical power in
NLP evaluation — finds that most NLP benchmarks are underpowered to detect the effect sizes
researchers actually claim, and that detecting a small effect (~1%) reliably typically needs
low thousands of examples, while large effects need far fewer. This directly explains, and
justifies, this project's own two outcomes:

- **The headline hybrid-vs-BM25 result (71.9%→77.1%, a 5.2pp effect) reached significance at
  n=135** because the effect size is large enough for a benchmark this size to detect it
  (p=0.0156, Phase 13). This is not luck — it's consistent with power-analysis theory.
- **The OOD result (26.7%→46.7%, a 20pp effect, but only n=15) did not reach significance**
  (p=0.25) specifically because of sample size, not because the effect is unreal. A rough
  two-proportion power calculation for these observed rates
  (`p1=0.267, p2=0.467, α=0.05, power=0.80`) gives **≈88 examples per arm as a conservative
  upper-bound estimate** (independent-samples formula; our actual paired/McNemar design is more
  sample-efficient, so the true requirement is likely somewhat lower). This gives a literature-
  grounded, non-arbitrary target: **growing the OOD benchmark subset from 15 to roughly 40–60
  examples is a defensible, achievable step toward statistical power**, not a guess.

**Conclusion: the paper's single most valuable, literature-justified improvement is a targeted
benchmark expansion (more OOD and ambiguous test queries), not a corpus expansion.** Growing the
431-command retrieval corpus to 1,000+ does not add a single test case and does not address the
power problem this project's own experiments already diagnosed.

## 2. Realistic venue targets (found via web search, current as of 2026-09-14)

- **ACL/EACL Student Research Workshop (SRW)** — the standard, appropriate venue for exactly this
  kind of project: a student-led empirical study with a real system, a constructed benchmark, and
  rigorous (if modestly-scaled) evaluation. Accepts short papers (4 pages + unlimited references)
  or long papers (8 pages + references). EACL 2026 SRW: pre-submission mentorship deadline
  Nov 6, 2026; direct submission Dec 15, 2026. ACL 2026 SRW: general submissions via OpenReview,
  March 18, 2026 (likely passed by the time this is read — check the current cycle's actual date).
  SRW reviewers explicitly expect a smaller-scope, single-author-or-small-team contribution with
  honest limitations — this project's actual scope and honesty about null/weak results fits this
  venue's expectations well.
- **Workshop tracks adjacent to NL-for-code/programming** (e.g., a future NLP4Prog-style
  workshop, if one is scheduled for the relevant cycle — the 2021 edition was co-located with
  ACL-IJCNLP; check for a current recurrence before committing to this as a target) are a good
  fit topically but may not recur every year — treat as opportunistic, not a primary plan.
- **Do not target a main ACL/EMNLP/NeurIPS research track** for this project as currently scoped.
  Those venues expect either much larger-scale empirical validation (per the power-analysis
  finding above) or a more novel modeling contribution than a hybrid-retrieval-plus-calibration
  system. Aiming there would require the corpus/benchmark-scale investment this roadmap
  recommends against for good reason (time/scope), or a substantially different, larger
  contribution than what currently exists.

**Recommendation: target an SRW (or equivalent student/workshop venue) for the first submission
cycle.** This is realistic given the actual scope of work completed, and is exactly the kind of
venue built for a project like this one.

## 3. What is actually needed before submission (truthful, prioritized)

### Must do

1. **Fix the corrected-figure propagation.** Ensure every document, including any new writing,
   uses 86.06% (not 87.7%) and 22/44.9% (not 26/53.1%) for the confidence-miscalibration figures
   — already corrected in the repository (Phase 9 erratum), but must not regress if this roadmap
   or future drafts are built from older notes.
2. **Targeted benchmark expansion (OOD + ambiguous subsets only).** Grow OOD from 15 to
   ~40–60 examples and ambiguous from 14 to a comparable scale, using the *exact same*
   adjudication methodology as `termassist_bench v0.1` (documented in
   `research/datasets/TERMASSIST_BENCH_DESIGN.md` and `VALIDATED_BENCHMARK.md`). Freeze as
   `termassist_bench v0.2`, with its own SHA-256, version number, and adjudication report —
   exactly the provenance discipline the earlier roadmap correctly insisted on, just applied to
   the right target (benchmark queries, not corpus commands).
3. **Re-run the Phase 7/13 OOD and statistical-significance experiments against v0.2**, using
   the same nested-CV, same exact-McNemar's methodology already built (`research/experiments/`
   scripts are reusable — they read the benchmark path, not hardcoded query counts). Report
   whether the OOD result now reaches significance; report honestly if it still doesn't.
4. **Format the manuscript to the target venue's actual template and page limit** (SRW: 4 or 8
   pages) — the current `research/paper/manuscript.md` draft is a full 20-section research-report
   structure and will need substantial condensing, not just reformatting, to fit an SRW short or
   long paper.
5. **Independent safety-evaluation subset (small, not a new corpus).** Address the earlier
   roadmap's valid point that safety labels are drawn from the same benchmark used elsewhere — a
   small (30–50 command), independently-labeled safety set is a tractable fix; a full new corpus
   is not needed for this.

### Should do (strengthens but not blocking)

6. A short related-work condensation matching the target venue's typical citation density (the
   current 15-entry matrix is good raw material, most SRW papers cite 15–30 works total).
7. Re-verify literature novelty once more, close to the actual submission date (papers move fast
   in 2026; re-check the same search terms from Phase 14 within a week of submitting).

### Explicitly do NOT do for this submission cycle

8. **Do not expand the 431-command corpus to 1,000+.** Per Section 1 above, this doesn't address
   the identified statistical weakness and represents a full independent dataset-construction
   effort with real human-validation labor costs, disproportionate to the paper's actual claims.
9. **Do not integrate the hybrid system into the production CLI.** State this as a deliberate
   scope boundary (the paper evaluates an architecture; productization is future work), not a gap.
10. **Do not pursue synthetic bulk data generation** for either the corpus or the benchmark — the
    earlier roadmap's own reasoning against this (duplicated semantics, leakage risk, weak
    provenance) is correct and should be kept as a stated principle in the paper's methodology
    section, not just an internal planning note.

## 4. Honest risk if the benchmark-v0.2 expansion is skipped

The paper is still submittable without it — the headline result (hybrid beats BM25, p=0.016) is
real, significant, and sufficient to carry a paper on its own, with the calibration result
(−80.4% ECE) as a strong secondary contribution. The OOD result would simply need to be reported
exactly as it is now: "a large, practically meaningful improvement that this benchmark's OOD
subset size cannot confirm as statistically significant" — which is an honest, defensible
sentence, not a fatal flaw. The v0.2 expansion converts a hedge into a stronger claim; it is not
a precondition for submission.

## 5. Phased timeline (realistic for one person)

- **Week 1–2:** Construct and adjudicate `termassist_bench v0.2` (OOD + ambiguous expansion only).
- **Week 2:** Re-run Phase 7/13 experiments against v0.2; update results honestly either way.
- **Week 3:** Build the small independent safety-evaluation subset.
- **Week 3–4:** Condense `manuscript.md` into the target venue's actual page-limited format.
- **Week 4:** Final novelty re-check, proofread, format-check against the venue's style file.
- **Submit.**

This is achievable in about a month of part-time work, versus the multi-month (or longer)
undertaking a 1,000–1,500-command corpus expansion with proper provenance and human validation
would represent.

## Sources

- Card, D., Henderson, P., Khandelwal, U., Jia, R., Mahowald, K., Jurafsky, D. (2020). With
  Little Power Comes Great Responsibility. EMNLP. [arXiv:2010.06595](https://arxiv.org/abs/2010.06595) / [ACL Anthology](https://aclanthology.org/2020.emnlp-main.745/)
- [EACL 2026 Student Research Workshop CFP](https://2026.eacl.org/calls/srw/) / [2027 CFP](https://2027.eacl.org/calls/srw/)
- [ACL Student Research Workshop 2026 (ACL Member Portal)](https://www.aclweb.org/portal/content/acl-student-research-workshop-2026)
- [NLP4Prog 2021 Workshop (ACL Anthology)](https://aclanthology.org/2021.nlp4prog-1.0.pdf) — cited as a topical-fit precedent; verify current recurrence before targeting.
