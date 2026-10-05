# Submission checklist — TermAssist

**Date:** 2026-10-05, from the final publication audit (`FINAL_PUBLICATION_AUDIT.md`), which examined the paper at
commit `5c7a641`. **Ticked items were applied the same day** (author: "apply all the fixes"); see §17 of the audit.

## Must fix before submission

- [x] **F1.** §3: replace "so non-English queries are refused" with "so queries in non-Latin scripts are
      refused". The tool answers "como instalar python" at 66% confidence and "hola!" at 100%.

After the fix:

- [x] `node research/experiments/trace_claims.js` reports 0 problems.
- [x] `bash build.sh` reports the body on page ≤ 8 for both PDFs, with 0 overfull boxes.
- [x] The anonymity scan of `main_review.pdf` gives 0 hits.

## Should fix before submission (wording only; no number changes)

- [x] **F2.** Qualify the calibration summaries for the corrected benchmark:
      Contribution 2 ("largely corrects the confidence level") and the Conclusion ("fixes most of that").
- [x] **F3.** Table 1 caption: one sentence pointing to Table 9, where the AUGRC interval reaches zero.
- [x] **F5.** Review version: make "friends of the author" consistent with "one of the authors".
- [x] **F4.** Register the "α = 0.1 on one partition per version" statement in the trace, or change "every
      reported number" to "the reported numbers".
- [x] **F6.** Cite the sweep ECE estimator after verifying the reference, or describe it in words.
- [x] **Records.** `CURRENT_TASK.md` says the review PDF has 16 pages; it has 17.

## Should verify before submission (the author; outside the repository)

- [ ] The EACL 2027 SRW call for papers: page limit for long papers, template version, anonymity rules, and
      whether a public repository is allowed during review.
- [ ] The mentorship deadline (recorded as Nov 6) and what the mentorship submission requires.
- [ ] The Responsible NLP checklist on the actual form: copy the answers from
      `research/paper/RESPONSIBLE_NLP_CHECKLIST_DRAFT.md` and check the question numbering.
- [ ] Ethics review: whether your institution requires review, or grants an exemption, for volunteer labeling.
      If so, the Ethics sentence and checklist item D4 must be updated.
- [ ] The public GitHub repository name contains your handle. The review PDF does not link to it; confirm this
      is acceptable under the venue's anonymity policy.
- [ ] Read the final `main_review.pdf` once from start to end, as a reviewer would.

## Optional

- [ ] **F7.** Say that the noise floor is simulated for the recalibrated confidences.
- [ ] Report the released-corpus wrong-answer confidence (84%) in §3.
- [ ] Say "research hybrid" once in the abstract (3 words of room).
- [ ] Remove the 3 uncited entries from `references.bib`.
- [ ] Machine details (CPU, RAM) in Appendix A.

## Post-submission

- [ ] Add LICENSE files (MIT for the code, CC BY 4.0 for the benchmark) before the camera-ready release.
- [ ] Revision round after the mentorship feedback.
- [ ] Camera-ready: `main.pdf`, with the acknowledgements and the AI-use statement.
- [ ] Future work, not needed for this submission:
  - a terminal-specific external check;
  - external annotators with a third reader;
  - separating the label effect from the partition effect in v0.2.1;
  - an independent safety set;
  - a user study.
- [ ] Publishing CLI 1.1 (`product/1.1`) is a separate product decision. Do not merge it into
      `research/improvement`.

## Do not do

- Do not change the released 1.0.1 package, the frozen benchmarks, the frozen analysis inputs, or the
  external-check protocol and scripts.
- Do not add experiments to answer this audit. None is needed.
