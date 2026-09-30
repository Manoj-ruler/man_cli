# Current task

**Last completed:** E1-10 (2026-09-30). `research/results/e1_clinc150_v1/data/` holds P1 (4,500
rows, 0 excluded) and P2 (1,000 rows), prepared under the frozen rules.

- All 18 reconciliation checks pass, and the preparation is deterministic.
- Nothing was scored or downloaded.
- The frozen set is unchanged since `e1-protocol-v1`.

**Author action still open:** PAPER-07, the mentorship submission, by Nov 6.

**Next (recommended): E1-11, run the scoring and the rejection rules.** Status: NOT STARTED. It
waits for "Start E1-11".

- **This is the first step that produces E1 outcomes.** Everything it runs is frozen code, used
  unchanged. Before running, it checks with `git diff --exit-code e1-protocol-v1 -- …`.
- **Steps, all in one session:**
  1. `node research/experiments/e1_score_queries.js --guard --out
     research/results/e1_clinc150_v1/guard_v0_2.json`. It must pass (0 mismatches out of 209);
     otherwise stop (BLOCKED).
  2. `--input data/p1_queries.json --out scores_p1.json`, and the same for P2. The pre-flight runs
     each time.
  3. `node research/experiments/e1_analyze.js --scores-p1 … --scores-p2 … --meta-p1
     data/p1_queries.json --out-dir research/results/e1_clinc150_v1 --stage decisions`. This
     writes `decisions_p1.json`, `decisions_p2.json`, `logical_checks.json` and
     `RUN_MANIFEST.json`. **No `--synthetic` flag.**
  4. **Stop there.** Do not run `--stage summary`; that is E1-13, after the E1-12 implementation
     checks.
- **Acceptance criteria:**
  - The guard passes in the same run.
  - Every prepared query has one output row (4,500 and 1,000).
  - The logical checks pass.
  - The manifest is complete.
- **Reporting rule:** in E1-11, only the pass/fail status of the checks and the row counts are
  reported. Rates and comparisons are not read or reported until E1-13, so that the E1-12 checks
  are done first.
