# TermAssist Current Research Status and Publication Roadmap

Audit date: 2026-09-28. Branch `research/improvement`, HEAD `e909fb3`, working tree clean. Analysis only:
no code, data, results, manuscript, or configuration was changed; this file is the only file written.

**Evidence labels used below.** RECOMPUTED = recomputed in this audit from source artifacts. READ =
read from a committed result file and not recomputed. UNVERIFIED = not checked. INFERENCE = my
judgment, not a measurement.

---

## 1. Executive Summary

The project is a careful, honest **v0.1/v0.2 case study**, not the v1.0 study its specification
describes. None of the v1.0 data gates is met: the corpus is still 279 intents with 0 human-validated
records, there is no v1.0 benchmark, the two-annotator study has not been run, and there is no
independent safety set. Everything reportable comes from v0.1 (150 queries) and v0.2 (209 queries,
which contains v0.1).

The core numbers reproduce. The frozen baseline re-runs with 0/150 mismatches, benchmark hashes match
their manifests, Split B has no group leakage, and the OOD counts (34/50 vs 17/50) re-derive exactly.
But this audit found **five substantive problems that the current paper does not handle**. Three are
new and two are known but under-reported:

1. **The OOD headline rests mostly on easy OOD.** 35 of v0.2's 50 OOD queries are everyday non-computing
   requests (recipes, jokes, horoscopes). On the 15 near-OOD terminal tasks (v0.1's set), the tuned
   detector rejects 9/15 vs the baseline's 4/15, which is not a powered result. The v0.2 OOD
   adjudication also accepted queries partly *because* their retrieval scores were low, while the
   detector uses that same score (a selection effect). The detector also wrongly rejects **11/159**
   legitimate queries, a cost the paper never reports.
2. **The hybrid "confidence" is saturated.** 96/150 (v0.1) and 110/209 (v0.2) queries have exactly
   1.0. Isotonic calibration cannot separate tied scores, and the risk-coverage point the paper
   quotes (10.7% error at 50% coverage) lies inside that tie block, so it depends on benchmark-ID order.
3. **The safety claim is contradicted on v0.2.** The paper says no high-risk command was ever tagged
   safe. On v0.2 gold commands, 2 HIGH→LOW errors exist. Under the spec's own definition (high/critical
   → low *or* medium), v0.1 has 1 miss and v0.2 has 3.
4. **Headline accuracy still includes the 25 canonical controls,** which are 25/25 for every system.
   Excluding them: v0.1 BM25 65.5% → hybrid 71.8%; v0.2 70.9% → 75.4%. The p-values are unchanged.
5. **No calibration, selective-prediction, or OOD literature is cited.** All 11 citation keys are
   NL-to-shell, retrieval, command-risk, or statistics papers.

**Main bottleneck.** Human work remains (annotators, near-OOD queries), but most of the defensibility
gap above is fixable **without humans**, in about 4–6 working days of analysis and writing.

**Recommendation:** hold submission; fix items 1–5 now; run the prepared two-annotator study in
parallel; do not start v1.0 execution before the SRW deadline.

---

## 2. Current Repository Snapshot

| Item | State (RECOMPUTED unless noted) |
|---|---|
| Git | branch `research/improvement` = `origin/research/improvement` @ `e909fb3`; clean tree; no commits since this assistant's last session |
| Tags | `v0.1-validated-benchmark`, `v0.2-hybrid-research`, `v1.0-research-baseline`, `v1.0-research-final`. **No tag covers the v0.2 benchmark**: `termassist_bench_v0.2_validated.json` was added after `v0.2-hybrid-research` (sole commit `0110768`, 2026-09-14) |
| Production | `cli/search.js` byte-identical to `v1.0-research-baseline` (0 diff lines); `cli/index.js` differs only in the FAISS-comment fix; `cli/data/commands.json` 431 records, 0 original-field changes, 4 added fields |
| Corpus | 431 records, 27 categories, 297 distinct intents; win32-visible 279 records = 279 distinct intents (145 `all` + 134 `win32`); 0 duplicate commands among win32-visible; `validation_status` = `machine_verified` ×431; `source` = `curated-v0:legacy` ×431 |
| Benchmarks | v0.1: 150 (119 CORRECT/14 AMBIG/15 OOD/2 NEEDS_CORRECTION), LF-SHA-256 json `2a554d3c…`, csv `749053eb…` = manifest. v0.2: 209 (+35 OOD, +24 AMBIG), json `9a19406e…`, csv `ef1069b6…` = manifest. No v1.0 benchmark |
| Research code | `research/experiments/` (~75 scripts): v0.1 pipeline + `run_all.js` (v0.1 only); v0.2 script set (no unified runner); stats (`run_bootstrap_ci.js`, `apply_holm_correction.js`), Split B, sensitivity, annotation tooling |
| Results | `research/results/{baseline,ablation,hybrid,reliability,safety,functional,stats,v0.1,v0.2}`, `research/calibration/`; `research/results/v1.0/` contains only `PREREGISTRATION.md` |
| Annotation | codebook, protocol, practice set, blind sheets (gitignored), adjudication + analysis scripts. **No `returned/` folder: no real annotations exist** |
| Paper | `research/paper/acl_latex/{content.tex,main.tex,main_review.tex}` builds cleanly (per last session; not rebuilt in this audit). Markdown drafts are marked SUPERSEDED |
| Dependencies | `@xenova/transformers` `^2.17.2`, lockfile 2.17.2; no `engines` field (audit ran on Node v24.2.0); `research/models/corpus_embeddings.json` committed; MiniLM weights not committed (downloaded on first run) |

---

## 3. What Is Verified Complete

Only items with underlying evidence checked in this audit:

- **Frozen baseline integrity.** `cli/search.js` unchanged; a live in-memory re-run of all 150 v0.1 queries
  matches the archived results on command, rejection (score < 2.0) and confidence: **0/150 mismatches**
  (RECOMPUTED, Windows).
- **Baseline metrics.** From the archived statuses: 101/150 overall (67.3%), 97/135 non-OOD (71.9%),
  4/15 OOD rejected, 4/14 ambiguous handled, 49 wrong-but-accepted (RECOMPUTED).
- **Additive schema migration.** 0 original-field changes across 431 records (RECOMPUTED).
- **Corpus validator.** `validate_corpus.js`: 0 errors, 0 warnings. A-3 gate reports BLOCKED (RECOMPUTED).
- **Benchmark immutability.** v0.1 unchanged since its tag; v0.1 and v0.2 hashes equal their manifests (RECOMPUTED).
- **Split B leakage.** Re-deriving `intent_group_id` from the benchmark gives 125 (v0.1) and 171 (v0.2) groups,
  0 groups spanning folds, 0 disagreements with the registry (RECOMPUTED). Caveat: 9 v0.2 queries (1 in v0.1) have an
  acceptable command that is another fold's gold command (weak partial overlap).
- **Accuracy and McNemar.** Pooled non-OOD accuracy and discordant pairs for A0/A2/A3 on both versions (RECOMPUTED,
  §5); Holm arithmetic checked (RECOMPUTED last session, values READ this session).
- **OOD counts.** Tuned 34/50, baseline 17/50 on v0.2, reproduced from per-fold thresholds + features (RECOMPUTED).
- **Bare-keyword sensitivity.** The script refuses to run unless it reproduces the reported values (7/7 passed last session; READ).

---

## 4. Specification Compliance (`research/TERMASSIST_RESEARCH_V1.0_SPEC.md` §11)

| Gate | Requirement | Current evidence | Status | Remaining |
|---|---|---|---|---|
| A-1 | Baseline bit-identical after schema change | 0/150 live re-run (§3) | **PASS** | — |
| A-2 | Validator passes §1.4; 0 dup commands | `validate_corpus.js`: 0 errors | **PASS** | — |
| A-3 | 500–800 win32 intents, all `human_validated` + source | 279; 0/431 human_validated | **FAIL / BLOCKED (human)** | Authoring + validation (defer, §10) |
| A-4 | Corpus v1.0 manifest + `v1.0-corpus` tag | only `TERMASSIST_CORPUS_SCHEMA_MIGRATION_MANIFEST.json`; no tag | **FAIL** | Depends on A-3 |
| B-1 | AI queries human-revalidated; κ ≥ 0.7 on ≥20% | κ=0.6316, n=14 (24%), one partially independent reviewer without the command list; 2-annotator protocol built, **not run** | **FAIL (partial attempt)** | Run protocol (human) |
| B-2 | `is_control` on canonical; excluded from headline | field absent (v0.1/v0.2 predate it); **paper headline accuracy includes the 25 canonical queries** | **FAIL** | Exclude from headline metrics now (no humans) |
| B-3 | OOD empirical gate + `ood_subtype`; ambiguous ≥2 distinct + `ambiguity_subtype` | no subtype fields; v0.2 OOD all have BM25 ≤ 7.39, cosine ≤ 0.31 (READ, adjudication report) | **FAIL** — and see §6 R2: the gate itself is a design flaw | Subtype labels; revise gate |
| B-4 | v1.0 frozen + tag; v0.1 untouched | no v1.0; v0.1 untouched | **FAIL** (v0.1 part PASS) | — |
| C-1 | `splits.json`; Split B no shared group; Split C untouched | `splits-b-registry.json` ×2, 0 leakage (RECOMPUTED); no `research/results/v1.0/splits.json`; Split C not used and not documented as omitted | **PARTIAL** | State Split C omitted (n<300) |
| C-2 | Every tuned parameter dev-fold-only, provenance logged | `configurations.json` 30 rows with source (READ); nested CV in code (READ, not re-executed) | **PARTIAL / largely supported** | Add split provenance per row |
| D-1 | Every §9 row on v0.1+v1.0, Split A+B | v0.1+v0.2 only; E-OOD-SUB, E-SEL AURC+CI not done | **PARTIAL** | — |
| D-2 | Holm reported; no "significant" at adj p ≥ 0.05 | `holm-correction-results.json`; paper complies | **PASS** | — |
| D-3 | Bootstrap CIs: acc deltas, ECE, **AURC, AUROC** | acc deltas + ECE only (bootstrap file keys) | **PARTIAL** | AUROC + AURC CIs |
| D-4 | Preregistration predates finals | raw v0.2 results 2026-09-14 predate prereg 2026-09-15; Amendment 1 says so | **FAIL for v0.1/v0.2** (prospective only for v1.0) | Keep "exploratory" framing |
| D-5 | Independent safety set; miss rate = 0 to claim safety; Wilson CIs | no safety set; labels = benchmark's own; misses exist (§5, R3) | **FAIL** | Drop safety claim or build set |
| D-6 | Functional eval ≥ 40 sandboxed | 15 | **FAIL** | Defer; keep scoped |
| E-1 | Unified runner regenerates all from clean checkout | `run_all.js` covers v0.1 only; v0.2/stats/Split B/sensitivity standalone; clean-checkout run **not performed** | **PARTIAL / UNVERIFIED** | v0.2 runner + one clean run |
| E-2 | FAISS comment removed | diff confirmed | **PASS** | — |
| E-3 | No fabricated numbers; all trace to files | previous read-through fixed errors; **new mismatch found: safety zero-miss claim false on v0.2** | **PARTIAL** | Fix; add claim→file trace table |
| F-1 | No "accurate/general/robust/safe/first" without scoping | "first" removed; "most robust result" (relative, acceptable); "safe" direction claim problematic | **PARTIAL** | Fix safety wording |
| F-2 | Accuracy as two-version replication finding | paper frames it as fragile/composition-sensitive | **PASS** | — |

**The status document is stale.** `research/V1.0_BUILD_STATUS.md` still marks C-2 "preregistered", D-3 PASS,
D-4 PASS, E-3 PASS and F-1 N/A. Each is contradicted by evidence above. The spec's own header (line 8) still
says "two independently-scaled benchmarks", which conflicts with the corrected finding that v0.2 extends v0.1.

---

## 5. Results That Can Currently Be Reported

All results are **exploratory** (analysis family fixed after raw results; PREREGISTRATION.md Amendment 1).
Split A = class-stratified nested 5-fold CV, seed 42. Accuracy is pooled over non-OOD queries.

| Result | v0.1 | v0.2 | Source |
|---|---|---|---|
| Non-OOD accuracy BM25 / dense / hybrid (incl. canonical) | 97/135 (71.9%) / 98/135 (72.6%) / 104/135 (77.0%) | 120/159 (75.5%) / 115/159 (72.3%) / 126/159 (79.2%) | RECOMPUTED |
| Same **excluding 25 canonical controls** | 72/110 (65.5%) / 73/110 (66.4%) / 79/110 (71.8%) | 95/134 (70.9%) / 90/134 (67.2%) / 101/134 (75.4%) | RECOMPUTED |
| BM25→hybrid discordant (b/c), exact McNemar | 0/7, p=0.0156, Holm 0.047 | 1/7, p=0.0703, Holm 0.0703 | RECOMPUTED / Holm READ |
| Bootstrap 95% CI, BM25→hybrid delta | [2.2, 8.9] pp | [0.6, 7.5] pp | READ |
| Hybrid vs dense, raw / Holm p | 0.146 / 0.292 | 0.0127 / 0.0255 (0.057 without 3 bare-keyword queries) | READ |
| ECE, hybrid signal before→after (rel.) | 0.274→0.054 (80.4%) | 0.324→0.074 (77.2%) | READ |
| ECE, **user-facing baseline confidence** | 0.269→0.117 (56.7%) | 0.258→0.041 (84.1%) | READ |
| Brier, hybrid signal | 0.257→0.122 | 0.286→0.132 | READ |
| ECE reduction CI; one-sided p | [0.128, 0.283]; ≤0.0001 (resolution limit) | [0.172, 0.295]; ≤0.0001 | READ |
| OOD rejection tuned vs baseline | 7/15 vs 4/15 (46.7% vs 26.7%), p=0.25, Holm 0.29 | **34/50 vs 17/50**, p=1.5e-5, Holm 6e-5 | v0.1 READ; v0.2 RECOMPUTED |
| OOD by source (v0.2 run) | near-OOD TA-B078–092: 9/15 vs 4/15, AUROC 0.858 | non-terminal TA-B151–185: 25/35 vs 13/35, AUROC 0.918 | RECOMPUTED |
| False rejection of non-OOD by OOD detector | — | **11/159 (6.9%)** | RECOMPUTED |
| OOD AUROC (mean over folds) | 0.867 | 0.901 | READ |
| Ambiguity F1 (pooled) / AUROC | 0.310 / 0.784 | 0.496 / 0.723 | READ |
| Split B hybrid accuracy | 104/135 (identical to A) | 126/159 (identical to A) | RECOMPUTED |
| Split B ECE reduction | 76.4% (vs 80.4%) | 69.0% (vs 77.2%) | READ |
| Risk at 50% coverage | 10.7% (8/75) — **inside a 96-query tie at confidence 1.0; ID-order dependent** | not quoted | RECOMPUTED |
| Safety, gold, risky binary TP/FP/FN/TN | 19/1/1/104 (P=R=0.95); HIGH→MEDIUM ×1 | 19/1/3/126 (P 0.95, R 0.864); **HIGH→LOW ×2**, HIGH→MEDIUM ×1 | READ |
| Functional (sandboxed, n=15) | gold 15/15; retrieved 14/15 (93.3%) | not re-run | READ |
| Latency (mean) | BM25 3.29 ms; dense-only 5.87 ms; full hybrid **not measured** | — | READ |
| Blind re-annotation | — | κ=0.6316 (n=14), bootstrap CI [0.39, 1.00]; OOD 8/8, ambiguous 3/6 | READ |

Notes and discrepancies (not silently reconciled):
- The "OOD by source" near-OOD figure (9/15) comes from the v0.2 run (thresholds tuned on v0.2 folds) applied to the
  same 15 queries that v0.1 contains. The v0.1 run itself rejects 7/15. These are different runs, not a contradiction.
- The paper's safety sentence ("no critical- or high-risk command was ever tagged safe") holds for v0.1 only.
- Canonical queries (25/25 for every system) are inside every headline accuracy and ECE in the paper.
- The discordant counts for near-OOD alone were not computed in this audit (UNVERIFIED). At most 5 discordant queries are
  implied if the baseline's rejections are a subset of the detector's, in which case exact p ≥ 0.0625.

---

## 6. Research Gaps and Reviewer Risks (by severity)

**R1 — OOD result is not shown on hard OOD (BLOCKER for the OOD headline).**
- *Why it matters.* The paper's second main claim is "OOD rejection significant on v0.2". A reviewer will ask what
  kind of OOD.
- *Evidence.* 35/50 v0.2 OOD are non-terminal everyday requests; near-OOD is 15 queries with 9 vs 4 rejections.
- *Minimum fix (no humans).* Report OOD by source/subtype with counts, and state that significance comes mainly from
  non-terminal OOD. *Stronger (human).* ~20–30 hand-written near-OOD terminal tasks.
- *Verify.* Per-subset table regenerated from per-fold thresholds.

**R2 — OOD selection effect.**
- *Evidence.* v0.2 OOD queries were accepted with BM25 ≤ 7.39 and cosine ≤ 0.31. The detector uses the top-1 score.
  Spec §4.3 would make this mandatory ("empirical gate").
- *Minimum fix.* Disclose it; in future sets, qualify OOD by human judgment only and treat retrieval scores as a
  measured covariate, not an inclusion criterion. **Amend spec §4.3.**

**R3 — Safety claim contradicted (BLOCKER for any safety sentence).**
- *Evidence.* v0.2 gold: 2 HIGH→LOW, 1 HIGH→MEDIUM. v0.1: 1 HIGH→MEDIUM. The labels are the benchmark's own, not an
  independent set.
- *Minimum fix.* Remove "no dangerous-direction misses"; report counts with Wilson CIs as a descriptive, secondary
  result, or drop safety from the abstract.

**R4 — Canonical controls in headline metrics (MAJOR).** Spec §4.2 and the paper's own Limitations call them controls,
yet they sit in every headline number. *Fix.* Headline without controls (§5 row 2); controls as a sanity row. ECE
without controls is not yet computed.

**R5 — Calibration contribution may look trivial (MAJOR).**
- *Why.* The hybrid "before" confidence is a min-max-fused score that was never a probability, so any monotone
  recalibration lowers ECE. Calibration does not change decisions (A6 = A5), and the signal is 1.0 for 110/209 queries.
- *Fix (no humans).*
  - Lead with the **user-facing baseline confidence**, which is a real shipped miscalibration.
  - Add simple comparators (e.g., Platt or histogram binning) and report Brier alongside ECE.
  - State plainly that calibration improves reported confidence, not decisions.
  - Report the tie saturation.

**R6 — Tie-dependent selective-prediction numbers (MAJOR).**
- *Evidence.* 96/150 queries tied at 1.0; `run_selective_prediction.js` sorts with ties in input order.
- *Fix.* Tie-averaged risk-coverage (expected risk within tie blocks), AURC with bootstrap CI (spec D-3), or remove the
  50%-coverage figure.

**R7 — Missing literature on calibration, selective prediction and OOD (MAJOR).**
- *Evidence.* Zero such citations in the paper; zero in `related-work-matrix.csv`.
- *Fix.* Targeted search and citations (§7).

**R8 — Label reliability (MAJOR, human-gated).**
- *Evidence.* κ=0.63 with a partially independent single reviewer who lacked the command list; the protocol is ready but
  has not been run.
- *Fix.* Run Tier 1 (79 items).

**R9 — "Intent-held-out" oversells what Split B tests (MODERATE).** The corpus always contains the gold intent; Split B
only withholds intents from *tuning* 3–4 parameters. Unchanged accuracy is therefore expected. *Fix.* Describe it as
"tuning-leakage check across intent groups", not generalization to unseen commands.

**R10 — False-rejection cost unreported (MODERATE).** 11/159 legitimate queries rejected. *Fix.* Report it next to the
OOD gain.

**R11 — Reproducibility (MODERATE).**
- *Evidence.* No v0.2 runner; Node version unpinned; model weights fetched at first run; clean-checkout run never
  performed (UNVERIFIED).
- *Fix.* `run_all_v0_2.js` (or document the ordered script list), `engines`, an offline model-cache note, and one
  clean-clone run with output diff.

**R12 — Status and spec documents contradict the evidence (MODERATE).** `V1.0_BUILD_STATUS.md` gates and spec line 8
(§4). *Fix.* Dated amendments.

**R13 — Small, single-platform, script-checked corpus (DISCLOSED LIMITATION; not a blocker for a workshop paper).**

**R14 — "In-use npm package" and deployment (MINOR).** Usage is not evidenced in the repo, and the hybrid is not in the
shipped package. *Fix.* Say "published npm package"; state that the hybrid is research-only.

Not gaps (checked, fine): baseline integrity, benchmark immutability, Split B leakage, Holm arithmetic, the
bare-keyword sensitivity analysis.

---

## 7. Defensible Research Contribution

- **Title (proposed).** *How Reliable Is a Lightweight Closed-Vocabulary Shell-Command Retriever? A Calibration and
  Abstention Case Study*
- **Research question.** Can post-hoc calibration and score-based abstention make a shipped BM25 command retriever's
  confidence trustworthy and its out-of-scope behavior safer, without an LLM?
- **Primary hypothesis.** Isotonic calibration reduces ECE of the retriever's confidence on held-out folds (exploratory
  on v0.1/v0.2; confirmatory only on a later benchmark).
- **Secondary questions.**
  1. Does abstention reject OOD requests, by OOD type (non-terminal vs near-OOD), and at what false-rejection cost?
  2. Does hybrid lexical+dense fusion change accuracy (a replication-sensitivity case study)?
  3. How reliable are ambiguity labels and detection for short queries?
- **Contributions actually supported.**
  1. A reproduced audit of a shipped BM25 retriever's overconfidence (86.06% mean confidence on 49 wrong answers).
  2. Evidence that post-hoc calibration fixes the user-facing miscalibration (ECE 0.269→0.117 / 0.258→0.041), with the
     caveat that it does not change decisions.
  3. OOD abstention that works on non-terminal requests, is unproven on near-OOD, and costs 6.9% false rejections.
  4. A worked example of how a "significant" accuracy gain dissolves under benchmark expansion and single-query
     sensitivity.
  5. A transparent annotation protocol for short-query ambiguity (and its result, once run).
- **Setting.** One platform (Windows view), 279 intents, v0.1/v0.2 (v0.2 ⊃ v0.1), nested 5-fold CV.
- **Prior work.**
  - *Established, and it is not ours:* isotonic calibration, ECE, selective prediction / risk-coverage, score-based OOD
    detection.
  - *Novel only as an application and evaluation study* in closed-vocabulary shell-command retrieval.
- **Literature to verify and cite (not verified in this audit).** Standard references on:
  - neural-network calibration (e.g., Guo et al., 2017);
  - isotonic calibration (e.g., Zadrozny & Elkan, 2002);
  - selective classification (e.g., Geifman & El-Yaniv, 2017);
  - baseline OOD detection (e.g., Hendrycks & Gimpel, 2017);
  - selective QA under domain shift (e.g., Kamath et al., 2020).
- **Open literature questions (need a fresh search).** Calibration or abstention in NL-to-command or tool retrieval
  specifically; calibration of BM25/hybrid retrieval scores.
- **Claims to remove or soften.** Zero dangerous-direction misses; the 50%-coverage risk figure; "intent-held-out
  generalization"; OOD significance without the OOD-type breakdown; "in-use".

---

## 8. Publication Readiness

- **Supported today:** a project report. After the no-human fixes in Phase 1–2 (§9), a **preliminary workshop /
  student-research submission**, clearly exploratory, with κ disclosed as below target. It is a small, honest,
  single-setting reliability study.
- **Not supported:**
  - a full empirical paper: no v1.0 benchmark, no validated labels, no independent safety set, no powered near-OOD
    evaluation, no confirmatory test;
  - any safety claim;
  - generalization claims beyond this corpus.
- **Why.** The headline claims are correct in direction but the current text overstates three of them (R1, R3, R6) and
  under-cites the methods it applies (R7).
- **Deadlines.** Per `research/paper/PUBLICATION_ROADMAP.md` (web-sourced 2026-09-14, **re-verify**): EACL 2026 SRW
  pre-submission mentorship Nov 6, 2026; direct submission Dec 15, 2026.

---

## 9. Summary Implementation and Research Plan

**Phase 1 — Correct the analysis (no humans; 2–3 person-days; parallel with Phase 3).**
- *Tasks.*
  - Headline metrics without canonical controls, including ECE.
  - OOD by source, and by a manually assigned subtype on the existing 50 (label disclosed as author-assigned).
  - False-rejection rate; tie-averaged risk-coverage and AURC with bootstrap CI; AUROC bootstrap CIs.
  - Calibration comparators (Platt, histogram binning), leading with the baseline confidence.
  - Safety recomputed with the spec definition plus Wilson CIs.
  - Near-OOD McNemar counts.
- *Deliverables.* New result JSONs plus notes, with every script refusing to run unless it reproduces current values.
- *Accept.* Every new number re-derivable; old numbers reproduce.
- *Done when* all R1–R6/R10 metrics exist.

**Phase 2 — Literature and document hygiene (no humans; 1–2 days; parallel).**
- *Tasks.*
  - Targeted literature search and verified BibTeX (§7).
  - Dated amendments to `V1.0_BUILD_STATUS.md` and spec §0/§4.3/line 8.
  - Tag the frozen v0.2 benchmark.
- *Accept.* Every citation verified against its source; no stale PASS gates.

**Phase 3 — Two-annotator study (human-gated; ~2–3 h per annotator + ~2 h adjudicator; 1–3 weeks calendar).**
- *Tasks.* Recruit 2 uninvolved annotators and 1 adjudicator; practice → real sheet → validate → adjudicate →
  `analyze_annotation.js` (all prepared).
- *Blocker.* People.
- **Go/no-go G1.** If κ ≥ 0.70 and OOD ≥ 90% confirmed, ambiguous labels are usable. If not, report as measured and drop
  ambiguity detection from the headline.

**Phase 4 — v0.2.1 (1–2 days; depends on Phase 3).**
- *Tasks.* Apply adjudicated relabels; fix or drop TA-B187/B145/B149; new hash and manifest; re-run the family and
  Phase-1 metrics; report beside v0.2.

**Phase 5 — Optional near-OOD set (human-authored, ~20–30 queries; ~1 day authoring + review).**
- *Tasks.* Written by a human, not bulk-generated; OOD judged by humans without the score gate.
- **G2.** Do this only if Phase 3 finishes by early November. Otherwise report near-OOD as a stated limitation.

**Phase 6 — Paper finalization and reproducibility (2–3 days; after Phases 1, 2, 4).**
- *Tasks.*
  - Rewrite affected claims.
  - Build a claim→result-file trace table (appendix or repo).
  - Add a `run_all_v0_2.js` or documented order, `engines`, and a model-cache note.
  - Do one clean-clone reproduction with an output diff.
  - Rebuild both PDFs with the page guard.
- **G3 (submit).** All MUST items below closed.

Effort uncertainty: Phases 1–2 ±50% (tie-averaging and comparators may surface more issues). Phase 3 calendar time is
unknown (depends on recruitment).

---

## 10. MUST / SHOULD / OPTIONAL / DO NOT

**MUST, before submission**
- Exclude controls from headline metrics.
- Report OOD by type with the false-rejection cost.
- Fix or remove the safety claim.
- Make selective prediction tie-aware, or remove the figure.
- Add calibration comparators and lead with the baseline confidence.
- Cite and verify the calibration, selective-prediction and OOD literature.
- Reword Split B.
- Amend stale status and spec text.
- Do one clean reproduction.

**SHOULD**
- Run the two-annotator study and build v0.2.1.
- Build a human-written near-OOD set.
- Add AUROC/AURC CIs.
- Pin Node and the model cache.
- Tag v0.2.

**OPTIONAL / defer**
- Corpus expansion to 500–800 intents.
- The v1.0 benchmark (~365 queries) and Split C.
- An independent 50-item safety set (needed only to make safety claims).
- Functional evaluation beyond 15.
- A human preference study.
- Production integration (not needed for this venue category).

**DO NOT**
- Add an LLM, RAG, or vector DB.
- Bulk-generate queries or labels, or use AI output as a second annotator.
- Use retrieval scores as an OOD inclusion gate.
- Re-sample to improve κ.
- Modify v0.1, v0.2, or the frozen baseline.
- Call results confirmatory or "first".
- Start v1.0 before this submission.

---

## 11. Immediate Next Actions

1. **Recruit annotators.** Send two uninvolved people and one adjudicator the practice materials:
   `research/datasets/annotation/ANNOTATION_CODEBOOK.md`, `corpus_view_win32.tsv`, `sheets/practice/PRACTICE_SHEET.csv`
   (built with `node research/experiments/build_practice_set.js`). This is the longest calendar dependency.
2. **Headline metrics without controls.** New script computing accuracy and ECE with canonical queries excluded, reading
   `research/results/{ablation,v0.2}/ablation-results.json` and the calibration files; it must reproduce current values
   first.
3. **OOD breakdown.** OOD-by-source, false-rejection, and near-OOD McNemar analysis, from `v0.2/selective-prediction-results.json`,
   `v0.2/folds.json`, `v0.2/reliability_features.json`, `v0.2/reproduction-results.json`.
4. **Tie-aware selective prediction and CIs.** Replace or augment the ID-ordered curve from `run_selective_prediction*.js`;
   add AUROC/AURC bootstrap CIs.
5. **Calibration comparators.** Platt / histogram binning next to isotonic, leading with `baseline_confidence`.
6. **Safety correction.** Recompute dangerous-direction misses by the spec definition from `research/results/{safety,v0.2}/safety-eval-results.json`;
   correct `content.tex` §7 and the abstract.
7. **Literature and documents.** Targeted literature search; dated amendments to `V1.0_BUILD_STATUS.md` and the spec.

---

## 12. Open Questions and Human Decisions

1. Who are the two uninvolved annotators and the adjudicator, and can they finish before early November?
2. Keep a safety result in the paper (descriptive, with misses) or remove it entirely?
3. Is a human-written near-OOD set (Phase 5) worth the time before Dec 15?
4. Anonymity: the review version names TermAssist, a public npm package under an identifiable scope (unresolved from
   earlier).
5. Target venue and date: confirm the EACL 2026 SRW deadlines (roadmap data is from 2026-09-14).

---

## 13. Final Go/No-Go

- **Begin final v1.0 execution:** NO. Data gates A-3/B-1/B-4/D-5 are unmet and not reachable before a December deadline.
- **Continue data/annotation preparation:** YES. Start the two-annotator study now; it is fully prepared.
- **Draft the paper now:** it is already drafted. **Revise, don't redraft:** apply Phase 1–2 corrections to `content.tex`.
- **Submission:** **HOLD** pending the MUST list (§10). The earliest defensible state is Phase 1 + 2 + 6 complete
  (≈ 1–1.5 weeks of work), with the annotation result included if available and disclosed as pending otherwise.

*Items not inspected in this audit:* the Next.js app, `supabase/`, and `components/` (outside the research scope); the
internals of every v0.2 script (only the ones listed were read); full clean-checkout reproduction; the PDF (not rebuilt).
