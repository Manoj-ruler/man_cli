# Proposal: reporting the two-annotator study and benchmark v0.2.1 (runbook step 10)

**Status: DRAFT for author approval. Nothing in the paper has been changed.**
Sources: `research/results/annotation/annotation_results.json` and `per_item.csv`;
`research/ANALYSIS_FREEZE_v1.0.md` (v0.2) and `research/ANALYSIS_FREEZE_v2.0.md` (v0.2.1, commit 9d64ae5);
`research/datasets/annotation/ANNOTATION_PROTOCOL.md` (disclosures, Amendment 7).
The generated `LABEL_STUDY_UPDATE_DRAFT.md` is the starting point. This file corrects it:

- 2 of its 5 passages no longer match the paper;
- it says the annotators were "shown only the query text", but they used the codebook and the corpus;
- it says "disputed items were excluded", but the 4 REVERSED items were kept, not excluded;
- it omits the disclosures the protocol requires.

## Decision D13: how v0.2.1 is reported

On the re-run, v0.2.1 changes several v0.2 headline numbers. The stratified folds were redrawn: only 37 of
the 207 shared queries keep their fold. The differences therefore mix the label corrections with a new
partition. The 20-partition medians show that the calibration shift is not only partition noise.

| Quantity (non-control) | v0.2 (paper) | v0.2.1 |
|---|---|---|
| Shipped ECE, raw → isotonic | 0.293 → 0.063 | 0.286 → 0.119 |
| Reduction (seed 42) | 78% [52, 87] | 58% [35, 76] |
| 20 partitions: median reduction; within noise-floor p95 | 78%; 13/20 | 67%; 4/20 |
| Hybrid ECE, raw → isotonic (Holm family) | 0.368 → 0.071 (81%) | 0.384 → 0.064 (83%) |
| AURC diff (hybrid − shipped) | −0.075 [−0.126, −0.024] | −0.057 [−0.109, −0.005] |
| Correctness AUROC diff | 0.058 [−0.001, 0.118] | 0.051 [−0.008, 0.111] |
| Accuracy BM25 / dense / hybrid | 95 / 90 / 101 of 134 | 95 / 89 / 98 of 132 |
| Hybrid − BM25 (exact p) | +4.5 pp (.070) | +2.3 pp (.549) |
| Hybrid − dense (Holm-adjusted p) | +8.2 pp (.025) | +6.8 pp (.070) |
| Tuned threshold: OOD rejected / in-scope refused | 46/50, 20/134 | 44/50, 21/132 |
| Hybrid detector | 34/50, 11/134 | 34/50, 9/132 |
| Fixed rule | 17/50, 0 | 17/50, 0 |

**What still holds:**

- the ranking result (20/20 partitions);
- the threshold beating the detector on OOD (20/20);
- the fixed rule refusing nothing;
- the fragile hybrid-vs-BM25 gain (0/20 partitions at p < .05 on both versions).

**What weakens:**

- On v0.2.1, the recalibrated shipped ECE lies within the noise floor on only 4 of 20 partitions (13 on
  v0.2). The abstract's "to about a calibrated forecaster's noise floor" no longer holds for it.
- Hybrid over dense no longer survives Holm (.070).

**Options:**

- **A (recommended).** Keep v0.2 as the analysed version, since it is frozen v1.0 and E1 takes its
  thresholds from it (D7). Report the study, and add Appendix D with the table above. In the body, state the
  calibration weakening where the claim is made: the abstract and the Recalibration paragraph.
  - Body: about +6 lines (headroom about 96).
  - E1 passages: unchanged.
- **B.** Switch every headline number to v0.2.1. This rewrites Tables 1–3, the abstract, the results and
  about 60 traced numbers. E1 would then rest on thresholds from a different benchmark than the one reported.
  It also carries a high page risk.
- **C.** Report the study only, and mention v0.2.1 without numbers. Not recommended: the abstract would
  keep a calibration claim that the corrected benchmark contradicts.

## Proposed text (option A)

### 1. Abstract (body, lines 16–17 and 24)

Current: `isotonic recalibration cuts the shipped confidence's calibration error by 79\% and 78\%, to about a
calibrated forecaster's noise floor (outside our test family).`

Proposed: `isotonic recalibration cuts the shipped confidence's calibration error by 79\% and 78\% (58\% on a
label-corrected v0.2), outside our test family.`

Current: `Other analyses are exploratory; a two-annotator study is under way.`

Proposed: `Two annotators' labels agree ($\kappa=0.98$); other analyses are exploratory.`

Word count: about −4 (200 → about 196). It will be checked with the build's counter.

### 2. §3 Benchmark (line 138: replaces the last sentence)

Current: `A two-annotator study with a written codebook is under way.`

Proposed:

```latex
We then wrote a codebook and, before any label existed, fixed a two-annotator protocol with two criteria
($\kappa\geq0.7$; both annotators keep $\geq$90\% of out-of-scope labels). Two annotators, [G0] not shown the
original labels, labeled 58 AI-authored queries (one more, \qid{187}, has the defect above) and 20 controls using the
codebook and the corpus: $\kappa=0.98$ (95\% interval [0.94, 1.00], 78 items), and both kept all 35 out-of-scope
labels, so both criteria were met. Both judged 4 of the 23 ambiguous queries clear and they split on one; with no
third reader, the protocol keeps the 4 labels and drops the split item. Benchmark v0.2.1 applies this and corrects
\qid{145} and \qid{149} (Appendix~\ref{app:labels}).
```

**[G0]:** "working independently, by their own account,". The author reported (2026-10-02) that both
annotators confirmed independence. Please confirm what they confirmed: working alone, without AI tools, on
the main sheet. The wording will match exactly.

### 3. §5 Recalibration paragraph (after "…(Appendix~\ref{app:secondary}).", line 252)

```latex
On the label-corrected v0.2.1, whose stratified folds differ, the reduction is 58\% (to 0.119, above the 95th
percentile 0.085) and the recalibrated ECE is within that percentile on 4 of 20 partitions (Appendix~\ref{app:labels}).
```

### 4. §7 Conclusion (line 401)

Current: `finish the two-annotator label study and release a corrected benchmark;`

Proposed: `release the corrected benchmark (v0.2.1);`

### 5. Limitations

**Benchmark bullet.** Current: `59 queries drafted by an AI agent, whose labels were checked only by one
partially independent reviewer ($\kappa=0.63$, interval [0.39, 1.00], $n=14$); the two-annotator study is not yet
complete. Two items have gold commands outside the corpus and one an acceptable command.`

Proposed:

```latex
59 queries drafted by an AI agent. Two annotators agree on their labels ($\kappa=0.98$), but the codebook uses the
benchmark's own definitions, so agreement is partly by construction; its worked examples were written by an AI
assistant, and it was written after the first check ($\kappa=0.63$, $n=14$); blinding and independence rest on the
annotators' own compliance, as the repository is public; and with no third reader, 4 labels both annotators
questioned were kept. Two items have gold commands outside the corpus and one an acceptable command; v0.2.1
corrects them, and its re-run weakens the v0.2 calibration result (Appendix~\ref{app:labels}).
```

**Exploratory-statistics bullet (line 422).** Current: `Every analysis except the external check
(Appendix~\ref{app:external}) was specified after results were seen`.

Proposed: `Every analysis except the external check (Appendix~\ref{app:external}) and the two-annotator analysis
(Appendix~\ref{app:labels}) was specified after results were seen`.

### 6. Ethical considerations (line 460)

Current: `We disclose that part of the benchmark was written by an AI agent and that our own label check fell below target.`

Proposed: `We disclose that part of the benchmark was written by an AI agent, that our first label check fell below
target, and that the annotation codebook's worked examples were written by an AI assistant.`

**[D1–D5, still open]:** annotator recruitment and pay, consent, and ethics review. These need your facts.
A sentence is added once you supply them.

### 7. New Appendix D: "Two-Annotator Study and Benchmark v0.2.1" (`\label{app:labels}`, after Appendix C)

```latex
\paragraph{Protocol.} The protocol was committed before any label existed. Two annotators labeled each query
CLEAR, AMBIGUOUS or OUT-OF-SCOPE relative to the corpus, from a written codebook and the corpus, without the
original labels. They labeled the 59 AI-authored queries and 20 controls (4 verbatim attention checks).
\qid{187}, a Linux-only gold command, is excluded from the primary statistic as a known defect. The primary
statistic is unweighted Cohen's $\kappa$ over the 78 remaining items, with a bootstrap interval. A third reader
was to resolve items where the annotators disagree (contested) or agree against the original label (reversed);
with none available, the pre-declared fallback drops contested items and keeps reversed items' labels.

\paragraph{Results.} $\kappa=0.980$ [0.937, 1.000] (98.7\% agreement); targets only, $\kappa=0.967$ [0.897, 1.000]
($n=58$). Both annotators kept all 35 out-of-scope labels. Of the 23 ambiguous targets, 18 were confirmed. Four
were judged clear by both annotators: ``search for a file'', ``list running processes'', ``check network
connection'' and ``copy a file''. These are reported, not relabeled. One, ``stop a process'', was contested and
dropped. On the 14 queries the first reviewer also labeled, the annotators agree with each other on all 14.

\paragraph{Disclosures.} The codebook was written after the first check exposed disagreements, and its worked
examples were written by an AI assistant. It adopts the benchmark's own definitions, so some agreement is by
construction. The repository is public, so blinding to the original labels rests on the annotators' compliance,
and independence rests on their confirmation to the author. One annotator was asked to re-check a column listing
the corpus records consulted, which enters no statistic. The returned file also changed labels and comments and
closely matched the other annotator's sheet (48 of 79 comments identical), so it was not used. The original returns,
which share no comment text, are the basis of every statistic, and both annotators confirmed they worked
independently.
```

**[DISCLOSURE CHOICE, for the author]:** the sentences above state the facts recorded in ISSUE-12 (identical
comments: 48 in the re-check, 0 in the original returns). The minimal alternative leaves out the match:
"The returned re-check also changed labels and comments, so it was not used." I recommend the full version. If the
returns are ever released or audited, a reader who finds the match would otherwise read the omission as hiding it.
The facts also show that the analysed returns are independent in their text.

```latex

\paragraph{Benchmark v0.2.1.} v0.2.1 has 207 queries. It corrects \qid{145}'s gold command to a corpus record and
removes \qid{149}'s non-corpus acceptable command; it drops \qid{187} and the contested query. No label changes.
Every analysis was re-run with unchanged code. Removing two queries redraws the stratified folds (37 of 207 queries
keep theirs), so the differences mix the corrections with a new partition (Table~\ref{tab:v021}).
[table as in D13 above, about 12 rows]
The ranking and out-of-scope conclusions hold on all 20 partitions. The calibration result weakens: on v0.2.1 the
recalibrated shipped ECE is within the noise floor on 4 of 20 partitions (v0.2: 13), with median reduction 67\%
(v0.2: 78\%). The hybrid's gain over dense no longer survives Holm correction ($p=0.070$).
```

### 8. Trace registrations (`trace_claims.js`)

New blocks:

- **Annotation** (`annotation_results.json`): κ 0.98 / 0.980, [0.94, 1.00] / [0.937, 1.000], 78, 98.7, targets κ
  0.967 [0.897, 1.000], 58, 35/35, 23 = 18 + 4 + 1, 20 controls, 4 attention checks, 14/14 (`comparison_with_first_blind_review`).
- **v0.2.1** (`research/results/v0.2.1/…`, the same readers as the v0.2 blocks): every v0.2.1 number in the
  table and in sections 1, 3 and 7, plus the 37/207 fold count (`v0.2/folds.json` in both runs).
- **Benchmark** (`termassist_bench_v0.2.1_validated.json`): 207.

Then `trace_claims.js` must report 0 problems, and `build.sh` must give at most 8 body pages.
