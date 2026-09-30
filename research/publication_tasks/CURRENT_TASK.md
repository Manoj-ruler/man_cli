# Current task

**Last completed:** E1-04 (2026-09-30). The v0.2 thresholds are verified and re-derived; D2 = (a); the
ISSUE-06 amendment (R1-CLI secondary) is in protocol §1 and §4.

**Author action still open:** PAPER-07. Submit `research/paper/acl_latex/main_review.pdf` (SHA-256
prefix `7c129b946bcd928b`) to the mentorship programme by Nov 6.

**Next (recommended): E1-03: P1 class exclusions, decided before any scoring.** Status: NOT STARTED.
It waits for "Start E1-03".

- **Priority:** P0: the core of E1's validity. **Type:** experiment (protocol).
- **Depends on:** E1-02 (done).
- **Inputs** (reading only):
  - the intent names in `research/data_external/clinc150/data_full.json`;
  - example queries from the **train** split only, to understand each intent, **never the test
    queries that E1 will score**;
  - `domains.json`;
  - the paper's supplementary material, to cross-check the domain map.
- **Steps:**
  1. List the 150 intents by domain.
  2. Identify every intent whose requests might have a legitimate answer from a Windows
     shell (for example `time`, `date`, `timer`, `calculator`), and give a written reason for each.
  3. List the borderline intents separately.
  4. Record exactly what was looked at.
  5. P2 (`oos_test`) is kept whole, as decided in D4.
- **Acceptance criteria:**
  - Every excluded class has a reason, and there are no per-query exclusions.
  - A log states that no system output was consulted.
  - The author approves the rules (decision **D3**).
- **Deliverables:** `E1_PROTOCOL.md` §3 and `e1/E1_EXCLUSIONS.md`.
