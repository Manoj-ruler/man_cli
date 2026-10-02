# AI-use disclosure ledger: EACL 2027 SRW long paper

**Protocol.** ARS `academic-paper`, `disclosure` mode, venue path, `--venue=ACL`.

**Policy source.** ACL Policy on Publication Ethics, section "Guidelines for Generative Assistance in
Authorship" (ACL Admin Wiki). The ARS copy of the policy was accessed 2026-06-07.
**Author action:** re-read the live page before submission, and check whether the EACL 2027 SRW call
adds its own instructions.

**Status.** Built 2026-09-29. The result is **REQUIRED**.

- **2026-09-30:** the author answered the three open facts (see "Author confirmations"). Execution
  status is **READY**, and the statement is **rendered**.
- **Where it goes:** the camera-ready Acknowledgements, as `\aiacknowledgements` in
  `acl_latex/main.tex`. The anonymous review build defines the macro empty.

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
| Claude Opus 5.5 | 92 (38 as of 2026-09-29) |

The history runs from 2026-04-14 to 2026-10-01. The counts are as of commit `511f411` (updated
2026-10-01, FINAL-06; the first version of this ledger ran to 2026-09-29). It shows which model
committed each change, not every chat.

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
| U10 | Research assistance: the external check (E1) | GENERATED, ANALYSED, OTHER_CONFIRMED (AI-designed analysis, adopted with the author's approval at each step) | RESEARCH_PROCESS, CODE, RESULTS, WHOLE_PAPER: the E1 protocol (question, scope, exclusions, threshold handling, the analysis plan, including the equal-cost comparison proposed in the protocol review), the scorer, analysis, preparation and check scripts, the run, the results memo, and the §4, §5, Appendix C, Discussion, Conclusion, Limitations and Abstract text that reports it (2026-09-30 to 2026-10-01) | Research and manuscript | `research/publication_tasks/` (`PROGRESS.md` records each decision with the author's approval: D2–D4, D7, D10–D12); tag `e1-protocol-v1`; `research/results/e1_clinc150_v1/` |
| U11 | Coordination support for the annotation study | ANALYSED, CHECKED | RESEARCH_PROCESS: validating the returned sheets, running the pre-declared pre-adjudication analysis, a data-quality review of the record ids, and drafting messages to annotators for the author to send (2026-10-01). **No label was assigned, changed or judged by the assistant**, and no AI output is used as an annotation. | Research | gitignored `research/datasets/annotation/coordinator/`; `PROGRESS.md` ISSUE-11 |
| U12 | Research assistance: annotation materials | GENERATED (adopted by the author) | RESEARCH_PROCESS: the annotation codebook (`ANNOTATION_CODEBOOK.md`) with worked examples W1–W13, the annotator handbook (`ANNOTATOR_GUIDELINES.md`) with teaching examples H1–H6, the practice set and the sheet generator; commits `e50f170`, `2d8fa7c`, `03527ee` (Claude Sonnet 5) and `9f06c2d` (Claude Opus 5.5). No label was assigned, changed or judged by the assistant. | Research | Protocol §1 point 2 and Amendment 4. **Disclosed in the paper body** (Limitations, Ethics, Appendix D) and in the statement (clause approved by the author 2026-10-02: "approve the AI statement clause"). |
| U9 | Other: product code outside the study | GENERATED | CODE: the tool's optional web dashboard (Next.js app, API routes, Supabase), built in April 2026 with **Google Antigravity** using Gemini and Claude models | Neither. The paper does not evaluate the dashboard; it mentions only that the query-sync feature is off by default. | The author, 2026-09-30. The dashboard commits (2026-04-14 onward) carry no AI trailer. |

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
| Tool name | KNOWN: Claude (Anthropic) through Claude Code, with models Opus 4.8, Sonnet 5 and Opus 5.5 (U1–U8, U10–U12); Google Antigravity, with Gemini and Claude models (U9) |
| Content produced, and where | KNOWN: U1–U6 and U9–U12 above |
| Conditional: author confirms that the generated text was checked for accuracy and carries citations for its sources and ideas | KNOWN(true): the author, 2026-09-30 |
| Completeness of the tool inventory (no other AI tool) | KNOWN: the author, 2026-09-30. For code and data, the git trailers record only Claude models. |

## Author confirmations (2026-09-30, verbatim)

1. **Other AI tools:** "I havent used any ai tool other than Claude or Claude Code for writing the
   paper".
   - For the code and the benchmark data, the commit trailers record only Claude models (Phase 2).
   - The first rendering said "No other AI tool was used".
   - **Correction the same day:** "at starting antigravity was used for code rather than that only
     claude or claude code was used".
   - Asked which parts, the author answered: **only the web app/dashboard**, with **both Gemini and
     Claude** models inside Antigravity.
   - The audited CLI, the research code, the benchmarks and the paper were not built with Antigravity.
   - The statement now scopes "No other AI tool" to the paper's text, code and data, and names
     Antigravity for the dashboard (U9).
2. **Final text checked:** "yes i have checked".
3. **Authorship:** "dont list any ai as author even yourself also".
   - `ai_listed_or_proposed_as_author` = KNOWN(false).
   - The statement says so explicitly, and `main.tex` lists only the human author.

## Rendered statement

This is the camera-ready Acknowledgements text; the source is `acl_latex/main.tex`, `\aiacknowledgements`.

> We used Claude (Anthropic), through the Claude Code tool (Claude Opus 4.8, Claude Sonnet 5 and
> Claude Opus 5.5), throughout this work. Under the author's direction it:
>
> - drafted and revised the text of every section;
> - wrote the analysis, test and figure-generation code and ran the analyses;
> - drafted and adjudicated part of the benchmark queries and assigned the out-of-scope subtype
>   labels, as disclosed in §3 and §5;
> - simulated rounds of peer review whose suggestions led to several reported analyses: the
>   tie-aware selective metrics, the calibration noise floor and no-skill reference, the comparison
>   of out-of-scope rules at equal false-rejection counts, and the seed-repeat cross-validation;
> - designed, with the author's approval at each step, the pre-specified external check, including
>   its equal-cost comparison (added 2026-10-01, approved by the author; U10);
> - drafted the annotation codebook, its worked examples and the annotator handbook, and supported
>   the two-annotator study's coordination (checking the returned sheets and running its pre-declared
>   analysis), without assigning, changing or judging any label (added 2026-10-02, approved by the
>   author; U11, U12);
> - checked the references and citations against their primary sources.
>
> No other AI tool was used for this paper's text, code or data. The tool's optional web dashboard,
> which this study does not evaluate, was built with Google Antigravity (Gemini and Claude models).
> The author checked the final text, its claims and its citations for accuracy and takes full
> responsibility for the content. No AI tool is an author of this paper.

The printed statement is a single paragraph; the list above only splits it for reading.

- **Review version:** the acknowledgements are omitted, as ACL anonymity rules require. The review
  build defines the macro empty, and the review PDF contains neither "Acknowledgements" nor "Claude".
- **Submission form / Responsible NLP checklist:** if it asks about AI-assistant use, answer "Yes",
  with the rendered statement above, minus the model list if space is short.
- **Recheck after the κ update:** if the paper changes after the annotation study, recheck that the
  statement still describes the uses (for example, whether Claude drafts the κ update, which it will).
  It already covers drafting and revision of every section.
