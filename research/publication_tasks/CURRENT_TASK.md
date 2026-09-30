# Current task

**Last completed:** PAPER-05 (2026-09-30), the Limitations checklist. Three additions were made:
the self-audit sentence, the reason for having no generative baseline, and the ISSUE-04 discordant
counts. ISSUE-05 is recorded.

**Next (recommended): PAPER-04: lead with the attribution result.** Status: NOT STARTED. It waits for
the author to say "Start PAPER-04".

- **Priority:** P1, the defence against the "trivial finding" objection.
- **Type:** paper. **Depends on:** PAPER-02 (done).
- **Files:** `research/paper/acl_latex/content.tex`: the last paragraph of the Introduction, before
  the Contributions (the research question, lines ~45–48), and the Conclusion's first sentences
  (lines ~364–366).

## Steps

1. Read both passages and check whether the attribution result is already stated.
   - The result: three failures need three different remedies, and a better retriever is not the
     remedy for out-of-scope requests.
   - The Discussion (§6) already says "Out-of-scope rejection needed a better threshold, not a new
     retriever".
2. Draft at most 2 sentences, using only facts backed by the freeze and already registered, or to be
   registered: shipped raw-score OOD AUROC 0.956 vs hybrid 0.889 on v0.2; the tuned threshold's
   20/134 false rejections.
3. Watch the page budget: the body ends on page 7 of 8.
4. **Show the drafts to the author; edit only after approval.**
5. Apply, register any new numbers in `trace_claims.js`, and run the trace (0 problems, including
   coverage) and the build.

## Acceptance criteria

- [ ] Every number is registered in the trace. Trace: 0 problems.
- [ ] The body ends on ≤ 8 pages; 0 overfull boxes.
- [ ] No new claim goes beyond `CLAIM_EVIDENCE_MAP.md`.
- [ ] The author has approved the text.

## Pending decision

Approve adding LIT-01 (P2, ISSUE-05: verify arXiv 2405.06807 and decide whether to cite it) to the
backlog.
