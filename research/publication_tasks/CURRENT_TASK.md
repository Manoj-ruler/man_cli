# Current task

**Last completed:** E1-08 (2026-09-30). The protocol review passed all 7 checklist items, after
decisions D11 and E1-07c. Text fixes T-1 to T-8 are applied. See `e1/E1_PROTOCOL_REVIEW.md` §7.

**Author action still open:** PAPER-07, the mentorship submission, by Nov 6.

**Next: E1-09, freeze the protocol (gate G-E1).** Status: NOT STARTED. **It needs the author's
explicit approval (D6)**, for example "Approve freeze, D9 = git tag only. Start E1-09".

- **Steps:**
  1. Confirm the working tree is clean, and that the commit to be tagged contains:
     - `E1_PROTOCOL.md`, `E1_EXCLUSIONS.md`, `E1_THRESHOLDS.md`, `E1_SCORING_DESIGN.md` and
       `E1_PROTOCOL_REVIEW.md`;
     - `research/experiments/e1_score_queries.js` and `research/experiments/e1_analyze.js`.
  2. Record the SHA-256 of the protocol and of both scripts. Mark the protocol status **FROZEN**.
  3. Create the annotated git tag `e1-protocol-v1`, and push the branch and the tag.
  4. Record the commit hash and the date in `PROGRESS.md`.
- **Acceptance criteria:**
  - The tag exists on the remote (`git ls-remote --tags origin e1-protocol-v1`).
  - The hashes are recorded.
  - No E1 result exists before this commit (`git log -- research/results/e1_clinc150_v1` is
    empty).
- **D9:** external preregistration (for example, OSF) is optional. The recommendation is the git
  tag only, which is sufficient for the SRW.
