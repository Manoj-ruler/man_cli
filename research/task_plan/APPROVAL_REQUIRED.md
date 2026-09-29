# Decisions that need your approval

**What is listed here:** only decisions that affect research validity, change the evaluated system, use the network, execute code with side effects, or publish something.

**What proceeds without approval:** the paper wording tasks (PAPER-01 to PAPER-10), the safe tests (TEST-01 to TEST-03, TEST-05) and the read-only count (RESEARCH-01). You review them at commit time as usual.

Each item below states the decision, the options and their consequences. The decision is yours; none is pre-selected.

---

### 1. Download the published npm tarball to check its identity (RELEASE-01)
- **Decision:** whether to run `npm pack @manoj-ruler/termassist@1.0.1`. This is a network download of your own package into the scratchpad; nothing is installed or executed.
- **Options:**
  - **(a) Approve.** One ~23 kB download.
  - **(b) Decline.** The paper keeps PAPER-03's narrow wording permanently ("source code at its release commit").
- **Consequences:**
  - (a) either restores the "published" wording or reveals a difference that must be disclosed.
  - (b) costs nothing and is still accurate, but the paper cannot say the evaluated bytes are the ones users installed.

### 2. Load the CLI entry point under stubs for control-flow tests (TEST-04)
- **Decision:** whether tests may `require('cli/index.js')` in a child process with `execSync`, the prompt and the network replaced by recorders, and `HOME`/`USERPROFILE` pointed at a temporary directory.
- **Options:**
  - **(a) Approve the stubbed test,** with the safeguards in TEST-04: a preload self-check that exits 99 if not stubbed, only read-only target commands, and a first dry run where `execSync` throws.
  - **(b) Decline.** Rely on the pure-function tests and a code-reading description of `index.js`.
- **Consequences:**
  - (a) is the only way to test the refusal exit code, the shell selection, Ctrl+C and sync-off automatically. The residual risk is a stub failure. The safeguards make it fail closed, but it is not zero.
  - (b) leaves the paper's §3/§6 execution description verified by reading only.

### 3. Change the shipped CLI, its data or its package metadata (SAFETY-01 to 04, PRODUCT-04, PRODUCT-05, DOCS-01, DOCS-02, RELEASE-02)
- **Decision:** whether, and when, to modify `cli/**`, which is the audited 1.0.1 system.
- **Options:**
  - **(a) After the paper is submitted,** as version 1.1. Recommended by the plan's ordering, not decided.
  - **(b) Before submission,** on a separate branch or version, keeping 1.0.1 frozen for the paper.
  - **(c) Not at all.**
- **Consequences:**
  - Any change means the paper must name the evaluated version (1.0.1) explicitly.
  - Changes to the corpus or snippets (SAFETY-02, PRODUCT-04) change N and the IDF, and therefore retrieval results. Those need a new evaluation before any claim.
  - SAFETY-01 and SAFETY-02 are P0 for any further **release** of the tool, whatever the paper's timeline.

### 4. Change retrieval scoring, thresholds or the confidence display (PRODUCT-01, 02, 03, 06)
- **Decision:** whether to alter the retrieval behaviour that the paper evaluates.
- **Options:**
  - **(a) Defer to a follow-up study.**
  - **(b) Implement in 1.1,** with a full re-evaluation against the frozen 1.0.1 results under a new results directory.
- **Consequences:**
  - (b) produces a new experiment identity. It must never be reported as the frozen result.
  - It may improve or degrade accuracy and calibration; nothing is known until it is evaluated.

### 5. Run the CLI for real in a disposable environment (RELEASE-03)
- **Decision:** whether to observe non-TTY behaviour and global-install sync by running the real CLI.
- **Options:**
  - **(a) A throwaway VM or container** with no valuable data.
  - **(b) Skip.** These questions (Q2, Q4) don't affect the paper.
- **Consequences:** (a) involves real shell execution of retrieved commands if a prompt defaults through; this should never be done on your working machine.

### 6. Any new analysis freeze, or regeneration of the freeze report
- **Decision:** `freeze_analysis_report.js` overwrites `research/ANALYSIS_FREEZE_v1.0.md` in place.
- **Options:**
  - **(a) Never rerun it in the working tree.** When v2.0 is due (after annotation and v0.2.1), change its output filename to `ANALYSIS_FREEZE_v2.0.md` first.
  - **(b) Allow an intermediate v1.1** if the paper wording tasks should be reflected. This is not required, since they change no numbers.
- **Consequences:** Regenerating v1.0 in place would silently replace the frozen record's date, commit and possibly its content.

### 7. Publish a package version, deploy the dashboard, add CI or change repository settings (RELEASE-04, PRODUCT-07, TEST-06)
- **Decision:** any outward-facing release or deployment.
- **Options:** timing and scope are yours.
- **Consequences:**
  - A public release during anonymous review can de-anonymize the paper. The npm package, the README and the dashboard all carry your name.
  - Consider timing it after notification (Jan 5, 2027) or after the camera-ready.

### 8. Paper framing choices (not blocking; they affect wording only)
- **PAPER-03:** whether "published" wording should be restored if RELEASE-01 confirms identity, or the narrow wording kept regardless.
- **PAPER-09:** whether the benchmark-gold limitation should cite a count from RESEARCH-01, or stay qualitative.
- **DOCS-03:** whether an architecture note is part of the camera-ready artifact.
