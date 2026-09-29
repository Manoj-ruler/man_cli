# AI-use disclosure ledger: EACL 2027 SRW long paper

**Protocol.** ARS `academic-paper`, `disclosure` mode, venue path, `--venue=ACL`.

**Policy source.** ACL Policy on Publication Ethics, section "Guidelines for Generative Assistance in
Authorship" (ACL Admin Wiki). The ARS copy of the policy was accessed 2026-06-07.
**Author action:** re-read the live page before submission, and check whether the EACL 2027 SRW call
adds its own instructions.

**Status.** Built 2026-09-29. The result is **REQUIRED**, and execution is **HALTED (UNRESOLVED_INPUT)**.
Three facts only the author can confirm are open; see "Open facts".

**Source of the facts.** Every fact below comes from the repository's own record:

- the commit `Co-Authored-By` trailers;
- the files under `research/paper/review_round*`;
- the Stage 4.5 report;
- the benchmark manifests.

None comes from memory.

## Phase 1: venue

The venue is ACL, whose policy EACL follows. Under that policy, disclosure goes in the
**Acknowledgements**. Language-only polishing, predictive keyboards and literature-search tools need
no disclosure. Generated low-novelty text and AI-suggested new ideas do.

## Phase 2: use records (tool × task)

**Tool:** Claude (Anthropic), used through Claude Code, Anthropic's coding and agent tool. The model
versions recorded in commit trailers are:

| Model | Commits |
|-------|---------|
| Claude Opus 4.8 | 6 |
| Claude Sonnet 5 | 17 |
| Claude Opus 5.5 | 38 |

The history runs from 2026-04-14 to 2026-09-29. It shows which model committed each change, not every
chat.

| # | Category | Operation | Affected targets | Research or manuscript | Evidence |
|---|----------|-----------|------------------|------------------------|----------|
| U1 | Drafting assistance | SUBSTANTIVELY_DRAFTED | WHOLE_PAPER: every section of `content.tex`, including the abstract, drafted and revised by the assistant under the author's direction | Manuscript | git history of `research/paper/acl_latex/content.tex`; `T21_REVISION_LOG.md`, `T21b_REVISION_LOG.md` |
| U2 | Revision assistance / peer-review simulation | SUBSTANTIVELY_DRAFTED | CORE_ARGUMENT, RESULT_INTERPRETATION: three simulated review rounds (ARS `academic-paper-reviewer`) and the revisions made in response | Manuscript | `research/paper/review_round1..3/` |
| U3 | Analysis assistance | GENERATED, ANALYSED | CODE, RESULTS: every analysis script and every result file under `research/experiments/` and `research/results/` | Research | commit trailers; `research/REPRODUCE.md` |
| U4 | Research assistance: benchmark items | GENERATED | ORIGINAL_RESEARCH_DATA: v0.2 queries TA-B151 to TA-B209, drafted and adjudicated by the assistant | Research | `VALIDATED_BENCHMARK_MANIFEST_v0.2.json` `provenance_disclosure`. **Already disclosed in the paper body** (§3, Limitations, Ethics). |
| U5 | Research assistance: labels | GENERATED | ORIGINAL_RESEARCH_DATA: OOD subtype labels (`ood_subtypes_v0.2_ai_assigned.json`) | Research | **Already disclosed in the body** (§5: "labels assigned by an AI assistant, unchecked") |
| U6 | Research assistance: ideas | OTHER_CONFIRMED (AI-suggested analyses) | RESEARCH_PROCESS: analyses proposed in the simulated reviews and then adopted. Examples: tie-aware selective metrics (T3), the calibration noise floor and no-skill reference, comparing out-of-scope rules at equal false-rejection counts (REV-14/22), seed-repeat CV (S11) | Research | `review_round*/`, `PLAN_TASKS.md` |
| U7 | Citation checking | CHECKED_CITATIONS | REFERENCE_OR_CITATION: citations verified against primary records (T6, Stage 4.5) | Manuscript | `T6_LITERATURE_VERIFICATION.md`, `STAGE4_5_INTEGRITY_REPORT.md` |
| U8 | Research assistance: literature search | SEARCHED | REFERENCE_OR_CITATION | Manuscript | `PHASE14_LITERATURE_RECHECK.md`. ACL requires no special disclosure for this use; it is recorded for completeness. |

**Not used:** AI image generation. Every figure is an SVG drawn directly from the committed result
JSON by `research/experiments/generate_figures.js`, a script the assistant wrote (U3), and then
converted to PNG (`REPRODUCE.md` §5). No image model was involved. No AI tool is listed as an author.

The shipped tool contains no AI. The retriever in `cli/` was written by the author before the study,
and this study changed none of its executable code.

## Phase 2a: applicability

The result is **REQUIRED**. U1, U2 and U6 are outside ACL's exemptions: they are generated text and
AI-suggested ideas.

`ai_listed_or_proposed_as_author` is **KNOWN(false)** from the manuscript: `main.tex` lists one human
author. The author confirms this in question 3 below.

## Phase 2b: ACL fact ledger

| Field | State |
|-------|-------|
| Tool name | KNOWN: Claude (Anthropic) through Claude Code; models Opus 4.8, Sonnet 5 and Opus 5.5 |
| Content produced, and where | KNOWN: U1–U6 above |
| Conditional: author confirms that the generated text was checked for accuracy and carries citations for its sources and ideas | **UNKNOWN**, question 2 |
| Completeness of the tool inventory (no other AI tool) | **UNKNOWN**, question 1 |

## Open facts (author only)

1. Did you use any AI tool other than Claude/Claude Code for this paper, its code or its data? For
   example ChatGPT, Copilot, Gemini, Grammarly's generative features, or an AI translator.
2. Have you personally read the final text and checked that its claims and citations are accurate?
   The Stage 4.5 machine check does not replace this, and ACL requires the authors' own confirmation
   because authors are fully responsible for the content.
3. Do you confirm that no AI tool is listed or proposed as an author?

When all three are answered, render the statement (Phase 4) into the camera-ready Acknowledgements.

- **Review version:** leave the anonymous review PDF's acknowledgements out, as ACL anonymity rules
  require.
- **Responsible NLP checklist:** if the SRW submission form includes it, answer its "use of AI
  assistants" item with the same facts.
