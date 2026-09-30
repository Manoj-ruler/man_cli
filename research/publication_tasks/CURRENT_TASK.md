# Current task

**Last completed:** E1-01 (2026-09-30). CLINC150 is verified, downloaded (with the author's approval)
and committed to `research/data_external/clinc150/`; it is byte-identical to upstream, and its
provenance and CC BY 3.0 attribution are recorded.

**Author action still open:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256
prefix `7c129b946bcd928b`) to the mentorship programme by Nov 6.

**Next (recommended): E1-02: E1 question and scope.** Status: NOT STARTED. It waits for "Start E1-02".

- **Priority:** P0. **Type:** experiment (writing the protocol). **Depends on:** E1-01 (done).
- **Deliverable:** `research/publication_tasks/e1/E1_PROTOCOL.md` §1–§2, a draft.
- **Decisions needed:**
  - **D4:** which CLINC150 splits make up E1's population. Options include the `oos_test` split
    (1,000 queries, no classes), the in-scope `test` split (4,500 queries, 150 classes), or both.
    E1-01 found that CLINC's in-scope requests are mostly out of scope for a shell tool too.
  - **D7:** E1 uses the frozen **v0.2** thresholds, even if the final paper reports v0.2.1.
- **Must state what E1 cannot show:**
  - performance on terminal-task out-of-scope requests;
  - false rejections of in-scope shell queries (CLINC has none);
  - anything about v0.2.1.
- **Nothing is scored** (gate G-E1).

**Also unblocked:** E1-04 (verify the frozen v0.2 thresholds and how they were derived; decision D2).
