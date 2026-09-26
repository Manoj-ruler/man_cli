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
| Controls | 20 | seeded (seed 42) sample of v0.1 queries whose ground-truth classification is CORRECT and whose gold and acceptable commands are all in the win32 corpus view (pool of **118**; TA-B145 is NEEDS_CORRECTION and TA-B149 has an acceptable command outside the corpus): 4 canonical (attention checks) + 16 across the five other types (3 each, plus 1 extra to a seeded-random type; in the current build, complex_multi_intent) | CLEAR |

Controls exist so annotators cannot infer "everything here is OOD or ambiguous", and so the
prevalence in the reliability estimate is not degenerate. Exclude from control sampling any query
whose gold or acceptable command is absent from the win32 corpus view (**TA-B145, TA-B149**; see §6).

**Tier 2 (not run):** the 14 v0.1 ambiguous + 15 v0.1 OOD queries. **Decision (2026-09-26): Tier 1
only, 79 items.** The paper's v0.1 ambiguity results depend on the Tier-2 items (9 of the 14 are bare
names), so that gap stays open and is stated as a limitation. If Tier 2 is added later, note that the
practice items overlap its topics (`kubectl` ~ v0.1 "kubernetes"; `translate…German` ~ v0.1 "translate this
sentence to French"), and the two annotators must again get the identical item set.

**Blinding and order.** Each annotator gets an independently shuffled order (seeds 1001 and 1002),
anonymous item numbers, and query text only: no ids, no original labels, no query-type field.
`build_annotation_sheets.js` enforces this (it aborts if any id appears in a sheet, if the two orders
match, or if the annotators do not share the same item set) and is deterministic, so a regenerated
sheet can be checked against the hashes in `SHEETS_MANIFEST.json`. TA-B187 is on the sheets like any
other target; it is only excluded at analysis time (§6).

**Residual blinding risks (cannot be removed, so disclose them).**
- **The repository is public.** The original labels are in the benchmark files and adjudication
  reports, so anyone who looks can find them. Deliver the sheets privately, tell annotators not to look
  up the source (the codebook says so), and state in the paper that blinding rests on their compliance.
- **Style cues.** Controls come from v0.1 (hand-written) and targets from v0.2 (AI-authored); an
  attentive annotator might notice a difference in style. Not fixable without rewriting queries.
- The generated `sheets/`, `coordinator/` and `returned/` folders are gitignored; do not commit them
  before annotation is finished.

## 2. Annotators

Two people with **no prior involvement** in the benchmark or paper (not the author, not the project
director who did the first review), comfortable with a command line, ideally one with PowerShell
experience. They are **not told** the source of the queries (AI-authored), the class proportions, or
any original label. Choose them **before** seeing any results; an annotator is never dropped or
replaced afterwards.

## 3. Procedure

1. Annotators read the codebook and study worked examples W1–W13.
2. **Practice set (11 items: 8 core + 3 borderline; 4 CLEAR / 3 AMBIGUOUS / 4 OOD).** Each annotator
   labels `sheets/practice/PRACTICE_SHEET.csv` alone and returns it. The coordinator runs
   `build_practice_set.js --score <file>`; it flags an annotator who misses **2 or more of the 8 core
   items**, in which case the *rules* (never the items) are discussed through the clarification log
   before the real sheet is sent. Then `coordinator/PRACTICE_FEEDBACK.md` (answers and reasoning) goes to
   **both** annotators at once. Nobody is excluded on the basis of practice. Practice labels never enter
   the κ; report practice agreement descriptively only. The codebook is frozen once feedback is sent; if
   practice exposes a flaw in the codebook, that is a dated amendment sent to both **before** the real
   sheet. The practice items were verified with the same checks as the worked examples and were chosen
   to be semantically far from the 59 real targets (avoiding the process, disk, package, network and
   security families, where real items are disputed), so no practice answer settles a real item by proxy.
   Borderline items (`rsync`, `forward a port`, `delete files older than 30 days`) are deliberately
   contestable and are never scored.
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

**Built and tested**

| File | Purpose |
|---|---|
| `ANNOTATION_CODEBOOK.md`, `codebook_examples.json`, `corpus_view_win32.tsv` | annotator materials |
| `research/experiments/annotation_common.js` | shared context and verification (cited ids exist, label/reading consistency, OOD absent-terms, no benchmark or worked-example collision, no duplicates) |
| `research/experiments/build_annotation_materials.js` | generates the list; verifies the worked examples; injects them into the codebook |
| `practice_items.json`, `research/experiments/build_practice_set.js` | the 11 practice items; verifies them (including that each bare-name item obeys the codebook's own bare-name rule); writes the practice sheet, a private key, and the feedback file; `--score <file>` grades a returned practice sheet |
| `research/experiments/build_annotation_sheets.js` | blind sheets for both annotators + private key + `SHEETS_MANIFEST.json` (Tier 1 = 79 items; `--with-tier2` exists but is not used) |
| `research/experiments/validate_returned_sheet.js` | checks a returned sheet: labels, confidence, record ids exist, query text unaltered, no missing rows; flags AMBIGUOUS with <2 ids, OOD with ids, CLEAR with none |

Workflow, in order:
1. `node build_practice_set.js` and `node build_annotation_sheets.js`.
2. Send each annotator, privately: the codebook, `corpus_view_win32.tsv`, `sheets/HOW_TO_RETURN.md`,
   and `sheets/practice/PRACTICE_SHEET.csv`. **Do not send the real sheet yet.**
3. Get the practice sheets back; run `node build_practice_set.js --score <file>` for each; resolve any
   flags through the clarification log; send `coordinator/PRACTICE_FEEDBACK.md` to both.
4. Send `sheets/annotator_N_sheet.csv`. Put returned files in `returned/` as `annotator_1.csv` and
   `annotator_2.csv` and run `node validate_returned_sheet.js returned/<file>.csv N`.
5. `node build_adjudication_sheet.js` → send `sheets/adjudication/adjudication_sheet.csv` and
   `ADJUDICATION_INSTRUCTIONS.md` (plus the codebook and list) to the third reader; put the return in
   `returned/adjudication.csv`; check it with `node build_adjudication_sheet.js --validate returned/adjudication.csv`.
6. `node analyze_annotation.js --adjudication returned/adjudication.csv` (omit the flag to analyze
   before adjudication). Outputs go to `research/results/annotation/`.

**Built and tested (analysis stage).**

| File | Purpose |
|---|---|
| `build_adjudication_sheet.js` | builds the adjudication sheet (REVERSED + CONTESTED targets + decoys), anonymous A/B, seeded; `--validate` checks the return |
| `analyze_annotation.js` | implements §4 exactly: primary κ + bootstrap CI, targets-only κ, confusion matrix, pre-declared criteria, CONFIRMED/REVERSED/CONTESTED, secondary descriptives, controls, comparison with the first review, adjudication integration, and a relabel *proposal* |
| `annotation_common.js` | shared: verification, CSV, κ, bootstrap CI |

Testing: both scripts were run on **synthetic** fixtures (two simulated annotators with noise plus a
shared systematic disagreement, and TA-B187 mimicking the platform defect). κ was recomputed
independently from the written per-item CSV with separate code and matched (0.781 on the fixture); the
helper was also checked against a hand-computed value (0.75) and reproduces the first review's committed
κ = 0.6316. **Safety:** a real run accepts only inputs inside `returned/` and writes only to
`research/results/annotation/`; a synthetic run must write outside `research/` and stamps every output
SYNTHETIC, so test data cannot reach the results folder. `compute_kappa.js` (the first review's script)
is left untouched.

## 8. Amendments (dated, made before any annotator label exists)

**Amendment 1 (2026-09-26): decoys in the adjudication sheet.** §4 says REVERSED and CONTESTED items go to
the adjudicator. Sent alone, unanimity would reveal which items are REVERSED (both annotators agree with
each other) and which are CONTESTED (they split), inviting the adjudicator to defer to the annotators.
The sheet therefore also includes an equal number of **decoy** items (CONFIRMED targets, chosen with a
seeded shuffle), so unanimity carries no information. Decoy adjudications are descriptive only and never
change a label; the count of decoys where the adjudicator disagreed with unanimous annotators is reported.

**Amendment 2 (2026-09-26): control disputes.** §4 defines outcomes for targets only. Control items
where the annotators disagree, or where both say not-CLEAR, are **reported** (ids listed in the results)
but **not adjudicated**, since they concern v0.1 labels outside the 59 AI-authored items; look at them
by hand.

**Amendment 3 (2026-09-26): final status rules.** REVERSED + adjudicator confirms the annotators →
RELABELED; adjudicator sides with the original → ORIGINAL_UPHELD; adjudicator picks a third label →
UNRESOLVED (excluded). CONTESTED → the adjudicator's label (UPHELD if equal to the original, else
CHANGED); with no adjudicator → EXCLUDED_CONTESTED. Nothing is relabeled without adjudication.

Timeline: EACL SRW mentorship deadline Nov 6, 2026; direct submission Dec 15, 2026 (from
PUBLICATION_ROADMAP.md).
