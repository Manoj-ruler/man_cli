# Current task

**Last completed:** E1-09 (2026-09-30). **The E1 protocol is FROZEN** at the annotated tag
`e1-protocol-v1`, which points to `970c54f` and is pushed.

- 8 files are frozen; their SHA-256 values are in `PROGRESS.md` and in the tag message.
- **Any change to them is now a numbered deviation** needing the author's approval (§6.9).
- **The authoritative "unchanged" check:** `git diff --exit-code e1-protocol-v1 --
  research/publication_tasks/e1 research/experiments/e1_score_queries.js
  research/experiments/e1_analyze.js`.

**Author action still open:** PAPER-07, the mentorship submission, by Nov 6.

**Next (recommended): E1-10, prepare the data under the frozen rules (Phase 3).**
Status: NOT STARTED. It waits for "Start E1-10".

- **Priority:** P0. **Type:** experiment (data preparation, with no scoring).
- **Depends on:** E1-09 (done) and D5. The CLINC150 files were already downloaded and committed at
  `6bba840`, so **nothing new is downloaded**.
- **Steps:**
  1. Verify `data_full.json` and `domains.json` against the SHA-256 values in
     `research/data_external/clinc150/PROVENANCE.md`.
  2. Build `research/results/e1_clinc150_v1/data/` in the frozen §6.7 format:
     - `p1_queries.json`: `{id: "test:<i>", text, intent, domain, subgroup}`;
     - `p2_queries.json`: `{id: "oos_test:<i>", text}`.

     The text is taken unchanged.
  3. Apply Rule A (0 exclusions) and the subgroup labels, exactly as frozen.
  4. Write `DATA_PROVENANCE.md`: source hashes, and counts per intent, domain, subgroup and in total,
     reconciled against the source counts.
- **Acceptance criteria:**
  - The counts equal the source counts minus the declared exclusions (4,500 and 1,000).
  - The hashes are recorded.
  - Nothing is excluded outside the frozen rules.
  - **No scoring.**
