# Field Analysis Report (Phase 0, `academic-paper-reviewer` full mode)

**Run facts:**
- Date: 2026-09-28.
- Manuscript: `manuscript_review.txt`, the text of the T14 round-1 build (commit a57c8c1) with the author block redacted.
- Skill: ARS `academic-paper-reviewer` v1.11.1, loaded by reading `SKILL.md` directly. The skill is installed, but this session's skill list predates the install.
- The field analyst role was run inline by the orchestrating session.
- Target: author-confirmed as the EACL 2027 Student Research Workshop, long paper (decision D4). No #683 `ReviewTargetContext` / `ReviewCriteriaBindingManifest` exists, so each seat reports `criteria_binding_unavailable` and makes no formal venue-alignment claim; venue fit is judged informally.

## Paper Basic Information
- **Title**: Reliability-Aware Hybrid Retrieval for Natural-Language-to-Shell-Command Assistance: A Non-LLM Study
- **Abstract length**: about 300 words
- **Full text length**: about 7,200 words, including appendix captions and references
- **Number of references**: 29

## Field Analysis

| Dimension | Analysis Result |
|---|---|
| Primary Discipline | Natural language processing: NL-to-command mapping, evaluation of retrieval systems |
| Secondary Disciplines | Information retrieval (lexical, dense and hybrid retrieval); machine-learning reliability (calibration, selective prediction, OOD detection); software engineering / developer tools |
| Research Paradigm | Quantitative |
| Methodology Type | Empirical system evaluation on a curated benchmark: nested cross-validation, exact tests, bootstrap intervals, ablation. Includes a small annotation-agreement study |
| Target Journal Tier | Author-confirmed: EACL 2027 SRW long paper (8 pages). Venue criteria were not formally bound (`criteria_binding_unavailable`) |
| Paper Maturity | Revised draft, close to pre-submission. Structure, citations and statistics are complete. Two pending elements are declared: the two-annotator study and a corrected benchmark version |

## Recommended Target Journals
Not produced. The author has confirmed a venue, and the protocol forbids substituting one.

## Reviewer Configuration Cards

### Reviewer Configuration Card #1
**Role**: EIC
**Display role**: Journal-Fit Reviewer
**Identity Description**: Senior NLP researcher who has repeatedly served as a faculty mentor and reviewer for ACL-family student research workshops, working on evaluation methodology and language resources.
**Review Focus**:
  1. Does the paper make one clear, student-sized contribution that an ACL audience would find useful, and is that contribution stated honestly relative to the NL2Bash/NL2SH generation line?
  2. Is the scope (a single published tool, 279 Windows commands, a benchmark partly written by an AI agent) acceptable for the venue, and does the paper say so plainly?
  3. Is the paper readable in 8 pages? Or do the many hedges, subsets and sensitivity analyses bury the main point?
**Will particularly care about**: Whether the headline claim (reliability improves, accuracy gain is fragile) is what the evidence supports, and whether the writing makes that easy to see.
**Possible blind spots**: Statistical detail and IR-specific baselines; others cover these.

### Reviewer Configuration Card #2
**Role**: Peer Reviewer 1
**Display role**: Peer Reviewer 1 (Methodology)
**Identity Description**: Statistician working on evaluation of NLP and ML systems. Specializes in small-sample inference (exact and paired tests, multiple comparisons, bootstrap), calibration metrics and their estimation bias, and selective-prediction metrics.
**Review Focus**:
  1. Validity of the inference: exact McNemar on 7–8 discordant pairs; Holm families fixed after results were seen; exploratory framing; whether confidence intervals and tests agree.
  2. Calibration and selective-prediction measurement: 10-bin ECE on n=110–209 with heavy ties at maximum confidence; comparing calibrators; tie-aware AURC/AUGRC; whether "79%" ECE reductions are stable.
  3. Benchmark and leakage threats: nested CV design; the OOD selection effect; canonical controls; AI-authored labels; ground-truth defects; dependence between v0.1 and v0.2.
**Will particularly care about**: Whether any stated conclusion is stronger than the design can support, and whether effect sizes with intervals are reported where p-values are fragile.
**Possible blind spots**: Retrieval-model choices and related work.

### Reviewer Configuration Card #3
**Role**: Peer Reviewer 2
**Display role**: Peer Reviewer 2 (Domain)
**Identity Description**: Researcher in semantic parsing and NL-to-code/command systems with a background in information retrieval. Familiar with NL2Bash, NLC2CMD, Tellina, CLAI, tool and API retrieval, dense retrievers, and hybrid lexical-dense fusion.
**Review Focus**:
  1. Literature coverage: are the closest retrieval-based command assistants, tool/API retrieval work, and hybrid-fusion methods cited and positioned?
  2. Baseline adequacy: is BM25 plus one small MiniLM encoder with linear fusion a fair comparison set? Is a small local LLM or a stronger encoder needed, or reasonably excluded?
  3. Is the contribution real for the field, given a closed 279-command corpus and exact-match scoring against a gold command?
**Will particularly care about**: Whether the novelty claim ("this combination is new") survives against retrieval-based command and tool-assistance work.
**Possible blind spots**: Statistical subtleties and user-facing impact.

### Reviewer Configuration Card #4
**Role**: Peer Reviewer 3
**Display role**: Peer Reviewer 3 (Perspective)
**Identity Description**: Human-computer interaction and developer-tools researcher studying how programmers use command-line assistants, how uncertainty and risk are communicated to users, and the safety of suggested shell commands.
**Review Focus**:
  1. Do calibrated confidence and abstention actually help a user? There is no user study; the paper assumes that a confidence number users see is useful.
  2. Risk: destructive commands, the safety classifier's misses, false rejections of legitimate requests, and what a deployment would need.
  3. Practical scope: Windows-only corpus, a platform-dependent command view, a single published tool, and how results would transfer.
**Will particularly care about**: Whether the reliability framing connects to real user outcomes, or stays a metric exercise.
**Possible blind spots**: Statistical rigor and IR literature.

**Fifth seat (fixed, not configured):** Devil's Advocate.

## Review Strategy Recommendations
- **Tension to watch:** R1 may accept the heavy hedging as correct, while the Journal-Fit Reviewer may find it hurts readability. The synthesizer should weigh both.
- **Declared pending work:** the paper states that the two-annotator study and v0.2.1 are pending. Reviewers should judge the paper as it stands and not assume those results.
- **Self-audit history:** the manuscript was revised after an internal audit. The panel reviews the current text only.
