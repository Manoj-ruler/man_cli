# Phase C protocol — two-annotator re-annotation (COORDINATOR ONLY)

**Do not give this file to annotators.** They receive only `ANNOTATION_CODEBOOK.md`,
`corpus_view_win32.tsv`, and their blank sheet. This protocol is written and committed **before any
label from the new annotators exists**, so the analysis below cannot be tuned to the results.

## 0. What this can and cannot show

It measures **reliability under this codebook**: whether two independent people applying the same
written rules assign the same label. It does not prove the labels are "true". Two caveats to state in
any paper that uses it:

1. **The codebook adopts the benchmark's own definitions** (spec §4.1 and §4.3: ambiguity and OOD are
   judged *relative to the corpus*), and its bare-name rule (§6.1) is close to how the original
   ambiguous queries were built. Agreement on those items is therefore partly by construction. The
   items that test the *plausibility test* (short task phrases, §6.2) are the informative ones.
2. **The codebook was written after the first blind review (κ=0.6316) exposed disagreements**, and the
   worked examples were written by an AI assistant. Both are disclosed; neither can be undone.

**Why the first blind review is not just being "re-run".** That reviewer had no access to the corpus
and was given loose A/B/C definitions, whereas the benchmark defines ambiguity and OOD relative to the
corpus. Part of the disagreement may therefore be a *definition mismatch*, not label error. Both
results stay in the record: the first κ is not replaced, it is superseded as the reliability estimate
only if this protocol is run as written.

## 1. Items

**Tier 1 (required), 79 items:**

| Group | n | Source | Original label |
|---|---:|---|---|
| Targets | 59 | the 59 AI-authored v0.2 queries (TA-B151–TA-B209): 35 OOD + 24 ambiguous | OOD / AMBIGUOUS |
| Controls | 20 | seeded (seed 42) sample of v0.1 queries whose ground-truth classification is CORRECT (pool of 119 after removing TA-B145 and TA-B149): 4 canonical (attention checks) + 16 stratified across paraphrase / low-overlap / polysemy / complex / safety | CLEAR |

Controls exist so annotators cannot infer "everything here is OOD or ambiguous", and so the
prevalence in the reliability estimate is not degenerate. Exclude from control sampling any query
whose gold or acceptable command is absent from the win32 corpus view (**TA-B145, TA-B149**; see §6).

**Tier 2 (optional, same sitting if annotators can):** the 14 v0.1 ambiguous + 15 v0.1 OOD queries.
The paper's v0.1 ambiguity results depend on these, and 9 of the 14 are bare names.

**Blinding and order.** Each annotator gets an independently shuffled order (seeds 1001 and 1002),
anonymous item numbers, and query text only: no ids, no original labels, no query-type field.

## 2. Annotators

Two people with **no prior involvement** in the benchmark or paper (not the author, not the project
director who did the first review), comfortable with a command line, ideally one with PowerShell
experience. They are **not told** the source of the queries (AI-authored), the class proportions, or
any original label. Choose them **before** seeing any results; an annotator is never dropped or
replaced afterwards.

## 3. Procedure

1. Annotators read the codebook and study worked examples W1–W13.
2. **Recommended, not yet built:** a practice set of ≥8 fresh requests, verified with the same script
   (`build_annotation_materials.js`) for corpus ids and benchmark collisions, labeled before the real
   sheet. The codebook is frozen after practice.
3. Each annotator labels independently and returns a sheet with `label`, `confidence`, `record_ids`,
   `comment`.
4. **Clarification log.** Rule questions only, never about a specific request. Answers go to both
   annotators simultaneously and are appended, dated, to a `CLARIFICATIONS.md`. A clarification that
   changes how labels are assigned is a codebook amendment and is reported as one.

## 4. Analysis plan (fixed now)

**Primary reliability estimate.** Unweighted Cohen's κ between Annotator 1 and Annotator 2, three
classes, over **all Tier-1 items except TA-B187** (78 items: 58 targets + 20 controls). 95% CI by
percentile bootstrap over items (10,000 resamples, seed 42). Also report: percent agreement, the 3×3
confusion matrix, and κ **on the 58 targets alone** (the conservative figure, since controls are easy).

**Success criteria (pre-declared):**
- κ ≥ 0.70 on the primary estimate (spec §4.4), **and**
- OOD confirmed: for the OOD-labeled targets, both annotators agree with the original label on ≥ 90%
  of items.

**Per-item outcome vs. the original label, for each target:**
- **CONFIRMED**: both annotators = original.
- **REVERSED**: the annotators agree with each other but differ from the original.
- **CONTESTED**: the annotators disagree with each other.

**Secondary (descriptive):** κ after collapsing to OOD vs. not-OOD; κ after collapsing to AMBIGUOUS vs.
not; agreement split by annotator confidence; comparison with the earlier blind review on the 14
overlapping items.

**Adjudication.** REVERSED and CONTESTED items go to a **third person** who is neither annotator nor
the author/director, sees the codebook, the list, and both annotators' labels and comments, and does
**not** see the original label. If no third person is available, CONTESTED items are excluded from the
revised benchmark and reported; REVERSED items are *not* relabeled without adjudication.

**Consequences.**
- Any label change produces a **new** benchmark version (v0.2.1: new file, new hash, changelog).
  v0.2 stays frozen.
- The fixed analysis family (four comparisons per version, plus the bare-keyword sensitivity
  analysis) is re-run on v0.2.1 and reported next to v0.2. It is **exploratory** again: labels were
  revised after the results were seen.
- If κ < 0.70: report it as measured. **At most one** codebook revision is allowed, and it may be
  evaluated only on **new, unseen** items, never on these items again. If no fresh items exist, report
  the round-1 result and state that ambiguous labels are unreliable; the ambiguity-detection claim is
  then dropped from the headline.

**Not allowed after labels exist:** choosing or replacing annotators, dropping an annotator, changing
the κ variant, or merging classes as the primary analysis.

**Precision.** With 78 items the κ 95% interval is roughly ±0.10 to ±0.15; say so. This is a reliability
estimate for one pair of annotators, not a population estimate.

## 5. Effort

About 1–1.5 h per annotator for Tier 1 (≈2 h with Tier 2). Adjudication: about 10 min per contested item.

## 6. Known benchmark defects, declared before annotation

While checking the win32-visible corpus against the benchmark (2026-09-26):

- **TA-B187 "tar"** (v0.2 ambiguous): the gold command and all three acceptable commands
  (`tar -xzf`, `-czf`, `-tzf`, `-cf`) exist only in the Linux/macOS part of the corpus. On the win32
  corpus the system searches, no system can ever answer it correctly, and an annotator will find zero
  matching records (→ OOD) where the original label is AMBIGUOUS. This is a benchmark error, not an
  annotator error. It is **excluded from the primary κ** and reported separately.
- **TA-B145** (v0.1): gold `ssh -L 5432:localhost:5432 user@hostname` is not a corpus record.
- **TA-B149** (v0.1): acceptable command `netstat -ano | findstr :3000` is not a corpus record.

Spec §4.1 requires the gold command to exist in the corpus; these three items violate it. They should
be corrected or dropped in v0.2.1 and disclosed in the paper.

## 7. Files and next steps

Built: `ANNOTATION_CODEBOOK.md`, `codebook_examples.json`, `corpus_view_win32.tsv`,
`research/experiments/build_annotation_materials.js` (generates the list, verifies the examples,
injects them into the codebook).

To build before starting: the blank-sheet generator (seeded, blinded, with the controls);
the practice set; the adjudication template; extend `compute_kappa.js` to the plan in §4
(bootstrap CI, per-item outcomes). Timeline: EACL SRW mentorship deadline Nov 6, 2026; direct
submission Dec 15, 2026 (from PUBLICATION_ROADMAP.md).
