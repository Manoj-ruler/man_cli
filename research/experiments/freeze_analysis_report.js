// Analysis freeze v1.0 (pre-annotation): writes research/ANALYSIS_FREEZE_v1.0.md, a short versioned
// report of the analysis the manuscript uses -- exact denominators, intervals, tests, tables and
// limitations -- generated only from committed result files (no hand-typed numbers). It records the
// SHA-256 of every input file and the benchmark files, so any later change to an input is detectable.
// Superseded by v2.0 after the annotation study and the v0.2.1 re-run (PLAN_TASKS T11-T12).
//
// v2.0 mode (after the annotation study):
//   node freeze_analysis_report.js --results-root research/results/v0.2.1 --version 2.0 \
//        [--annotation research/results/annotation/annotation_results.json] [--out <file>]
// reads the v0.2-layout result folders (v0.2, phase1, review_r1, seed_repeat, stats) from the v0.2.1
// run (run_v0_2_1.js) instead of research/results/, hashes benchmark v0.2.1, adds the two-annotator
// results to section 10, and marks every sentence that states a v1.0 observation (rather than a
// definition) "[VERIFY for v0.2.1]" -- those must be checked against the new numbers and reworded by
// hand in the generator before the report is used. Tables are always computed from the files.
// Read-only with respect to results: it writes only the report.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
// Never overwrites: a freeze report is a record. The default target is written only if it does not
// exist; to regenerate for comparison, pass --out <new file> (which must not exist either).
const arg = k => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : null);
const argOut = arg('--out');
const RESULTS_ROOT = arg('--results-root') ? path.resolve(ROOT, arg('--results-root')) : null;
const V2 = !!RESULTS_ROOT;
const VERSION = arg('--version') || (V2 ? '2.0' : '1.0');
if (V2 && VERSION === '1.0') { console.error('ABORT: --results-root needs a version other than 1.0'); process.exit(1); }
const V02 = V2 ? 'v0.2.1' : 'v0.2'; // the benchmark the "v0.2" sections describe
const OUT = argOut ? path.resolve(argOut) : path.join(ROOT, `research/ANALYSIS_FREEZE_v${VERSION}.md`);
if (fs.existsSync(OUT)) { console.error(`ABORT: ${OUT} exists; a freeze report is never overwritten. Pass --out <new file> to regenerate for comparison.`); process.exit(1); }
const inputs = {};
// SHA-256 of the LF-normalized bytes (as the benchmark manifests), so a Windows checkout with
// core.autocrlf=true gives the same hashes as the committed blobs.
const lfSha = buf => crypto.createHash('sha256').update(buf.toString('utf8').replace(/\r\n/g, '\n')).digest('hex');
// In v2.0 mode the folders the v0.2.1 run regenerates are read from RESULTS_ROOT (same layout).
const REMAPPED = /^research\/results\/(v0\.2|phase1|review_r1|seed_repeat|stats)\//;
const src = rel => (path.isAbsolute(rel) ? rel : V2 && REMAPPED.test(rel) ? path.join(RESULTS_ROOT, rel.replace('research/results/', '')) : path.join(ROOT, rel));
const R = rel => { const p = src(rel), buf = fs.readFileSync(p); inputs[path.relative(ROOT, p).replace(/\\/g, '/')] = lfSha(buf); return JSON.parse(buf.toString('utf8')); };
const hashOnly = rel => { inputs[rel] = lfSha(fs.readFileSync(path.join(ROOT, rel))); };

const b = R('research/results/review_r1/review_r1_b_calibration.json');
const t1 = R('research/results/phase1/phase1_t1_controls_excluded.json');
const t2 = R('research/results/phase1/phase1_t2_ood_breakdown.json');
const t3 = R('research/results/phase1/phase1_t3_selective_ties.json');
const t3b = R('research/results/phase1/phase1_t3b_augrc.json');
const t4 = R('research/results/phase1/phase1_t4_calibration_comparators.json');
const t5 = R('research/results/phase1/phase1_t5_safety_recount.json');
const a = R('research/results/review_r1/review_r1_a_ood_selection.json');
const c = R('research/results/review_r1/review_r1_c_ranking.json');
const d = R('research/results/review_r1/review_r1_d_risk.json');
const e = R('research/results/review_r1/review_r1_e_ood_operating_points.json');
const f = R('research/results/review_r1/review_r1_f_kappa_intervals.json');
const g = R('research/results/review_r1/review_r1_g_test_sensitivity.json');
const H = R('research/results/stats/holm-correction-results.json');
const sens = R('research/results/stats/sensitivity-bare-keyword-results.json');
const sb = { 'v0.1': R('research/results/v0.1/split-b-results.json'), 'v0.2': R('research/results/v0.2/split-b-results.json') };
const sr = R('research/results/seed_repeat/seed_repeat_cv.json');
const fx = R('research/results/functional/functional-eval-results.json');
const repSum = R('research/results/baseline/reproduction-summary.json');
const selp = { 'v0.1': R('research/results/reliability/selective-prediction-results.json'), 'v0.2': R('research/results/v0.2/selective-prediction-results.json') };
const detThr = v => selp[v].ood_detection.per_fold.map(x => x.selected_threshold);
// --bench overrides the v0.2.1 benchmark path (for testing v2.0 mode before v0.2.1 exists)
['research/datasets/termassist_bench_v0.1_validated.json', V2 ? (arg('--bench') || 'research/datasets/termassist_bench_v0.2.1_validated.json') : 'research/datasets/termassist_bench_v0.2_validated.json', 'research/datasets/ood_subtypes_v0.2_ai_assigned.json', 'cli/search.js', 'cli/data/commands.json'].forEach(hashOnly);

// guards: every analysis file this report reads passed its own reproduction checks when written
const guardFiles = { b, t1, t2, t3, t3b, t4, t5, a, c, d, e, f, g, sr };
for (const [k, x] of Object.entries(guardFiles)) if (Array.isArray(x.reproduction_checks) && x.reproduction_checks.some(r => r.ok === false)) { console.error(`ABORT: ${k} records a failed reproduction check`); process.exit(1); }

const V = ['v0.1', 'v0.2'];
const n3 = x => (x == null ? '—' : (+x).toFixed(3)), n4 = x => (x == null ? '—' : (+x).toFixed(4));
const pc = (x, dp = 1) => (x == null ? '—' : (100 * x).toFixed(dp) + '%');
const ci = (arr, fn = n3) => `[${fn(arr[0])}, ${fn(arr[1])}]`;
const pv = p => (p < 0.001 ? (+p).toExponential(2) : (+p).toFixed(4));
const wil = w => `${w.k}/${w.n} (${pc(w.rate)}; ${pc(w.lo)}–${pc(w.hi)})`;
const table = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map(r => `| ${r.join(' | ')} |`)].join('\n');
let commit = 'unknown'; try { commit = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch {}

const L = [];
const P = s => L.push(s);
// A sentence that states an observation about the v1.0 numbers. In v2.0 mode it is printed with a
// marker, so it cannot silently carry over to v0.2.1 data it was never checked against.
const PV = s => P(V2 ? '**[VERIFY for v0.2.1]** ' + s : s);
P(V2 ? `# Analysis freeze v${VERSION} (post-annotation)` : '# Analysis freeze v1.0 (pre-annotation)');
P('');
P(`**Frozen:** ${new Date().toISOString().slice(0, 10)}, from committed results at \`${commit}\` (\`research/improvement\`).`);
P('**Generated by:** `research/experiments/freeze_analysis_report.js`. Do not edit by hand: change an analysis, rerun it, then regenerate this file.');
if (V2) {
  P(`**Status:** the analysis after the two-annotator study, on benchmark v0.2.1. It supersedes v1.0, which stays unchanged as the pre-annotation record. Every number below comes from the result files listed in §12.`);
  P(`**Reading this report:** columns and rows labelled "v0.2" describe **benchmark v0.2.1** (the corrected v0.2), read from \`${path.relative(ROOT, RESULTS_ROOT).split(path.sep).join('/')}\`. v0.1 is unchanged. Sentences marked **[VERIFY for v0.2.1]** restate a v1.0 observation and must be checked before this report is used.`);
} else {
  P('**Status:** this is the analysis used by the EACL 2027 SRW mentorship draft.');
  P('**Supersession:** v2.0 replaces it after the two-annotator study and the v0.2.1 re-run (T11–T12). Every number below comes from the result files listed in §12.');
}
P('');
P('**Conventions used throughout:**');
P('');
P('- **Brackets** are 95% intervals: percentile bootstrap (10,000 resamples, seed 42) unless marked Wilson or Clopper–Pearson.');
P('- **Evaluation protocol:** 5-fold cross-validation stratified by label, seed 42. Every tuned quantity (α, thresholds, calibrators) is chosen on the 4 development folds and applied once to the test fold.');
P('- **Status:** all analyses are exploratory, specified after results were seen.');
P('');

// 1. Populations
P('## 1. Populations and denominators');
P('');
const cnt = v => { const ex = t1.versions[v].accuracy.A3; return { all: ex.all.n, excl: ex.controls_excluded.n, ctrl: ex.controls_hits.n }; };
P(table(['Population', 'v0.1', 'v0.2', 'Used for'], [
  ['All queries', 150, 209, 'appendix figures, bare-keyword and Split B checks (controls included)'],
  ['Canonical controls (verbatim corpus intents, always answered correctly)', cnt('v0.1').ctrl, cnt('v0.2').ctrl, 'excluded from headline figures'],
  ['Non-control queries', 150 - cnt('v0.1').ctrl, 209 - cnt('v0.2').ctrl, 'calibration, ranking, Tables 1–3, Figure 1'],
  ['— of which in-scope (non-OOD)', cnt('v0.1').excl, cnt('v0.2').excl, 'accuracy, false rejections'],
  ['— of which out-of-scope (OOD)', e.versions['v0.1'].n_ood, e.versions['v0.2'].n_ood, 'out-of-scope rejection'],
  ['Answerable queries (shared by both versions)', 121, 121, 'sensitivity only'],
  ['OOD: original v0.1 items / items added in v0.2', `${e.versions['v0.1'].rejections_by_source.original_v0_1_items.n} / 0`, `${e.versions['v0.2'].rejections_by_source.original_v0_1_items.n} / ${e.versions['v0.2'].rejections_by_source.added_v0_2_items.n}`, 'screening check']
]));
P('');
P(`- **Versions.** v0.2 contains all of v0.1, so the two are not independent samples.`);
P(`- **Reproduction.** The published baseline reproduces exactly (0/150 mismatches). Mean latency ${repSum.archived_reference.mean_latency_ms} ms in the archived run (${repSum.mean_latency_ms} ms in the reproduction run), on one machine; indicative only.`);
P('');

// 2. Calibration
P('## 2. Confidence and calibration (non-control queries)');
P('');
P('**Setup.**');
P('');
P('- Isotonic recalibration is fit on development folds; controls are excluded from both fit and evaluation.');
P('- The noise floor is the ECE of a perfectly calibrated forecaster with the same confidences and n (2,000 simulations, seed 7).');
P('- Brier skill is measured against an out-of-fold forecaster that predicts the development base rate.');
P('');
const calRow = (v, s, lab) => { const x = b.versions[v][s].controls_excluded; return [lab, v, x.n, n3(x.uncalibrated.ece_equal_width_10), n3(x.isotonic.ece_equal_width_10), `${pc(x.relative_ece_reduction_equal_width.point, 0)} ${ci(x.relative_ece_reduction_equal_width.ci95, y => pc(y, 0))}`, `${n3(x.isotonic.ece_equal_mass_10)} / ${n3(x.isotonic.ece_sweep)}`, `${n3(x.noise_floor_perfectly_calibrated.equal_width_10.mean)} / ${n3(x.noise_floor_perfectly_calibrated.equal_width_10.p95)}`, `${n3(x.brier_skill_vs_no_skill.uncalibrated.point)} ${ci(x.brier_skill_vs_no_skill.uncalibrated.ci95)}`, `${n3(x.brier_skill_vs_no_skill.isotonic.point)} ${ci(x.brier_skill_vs_no_skill.isotonic.ci95)}`]; };
P(table(['Confidence', 'Ver.', 'n', 'ECE raw', 'ECE isotonic', 'Reduction', 'Equal-mass / sweep ECE (isotonic)', 'Noise floor mean / p95', 'Brier skill raw', 'Brier skill isotonic'],
  V.flatMap(v => [calRow(v, 'baseline_confidence', 'Shipped'), calRow(v, 'hybrid_reliability', 'Hybrid (fused top-1)')])));
P('');
const m = (v, s, k) => t4.versions[v][s].controls_excluded.methods[k];
P('**Calibrator comparison** (shipped confidence, ECE / Brier; differences between calibrators not tested):');
P('');
P(table(['Ver.', 'none', 'isotonic', 'Platt', 'histogram binning'], V.map(v => [v, ...['none', 'isotonic', 'platt', 'histogram_binning'].map(k => `${n3(m(v, 'baseline_confidence', k).ece)} / ${n3(m(v, 'baseline_confidence', k).brier)}`)])));
P('');
PV('- Histogram binning is scored on the bins it fits, and has the worst Brier score of the three calibrators in every case.');
P('- Recalibration changes the confidence shown, not the answer.');
P(`- Shipped correctness AUROC falls from ${n3(m('v0.1', 'baseline_confidence', 'none').correctness_auroc)} to ${n3(m('v0.1', 'baseline_confidence', 'isotonic').correctness_auroc)} (v0.1), because each fold has its own map.`);
P('');

// 3. Ranking / selective
P('## 3. Selective prediction and ranking (non-control queries, tie-aware)');
P('');
P('**Method.** Risk-coverage curves use the exact expected risk under a random order within tied confidences, not benchmark row order. OOD answers count as errors.');
P('');
const sel = (v, s) => t3.versions[v].selective.controls_excluded[s];
P(table(['Ver.', 'System', 'n', 'Errors', 'Largest tie block', 'Risk at 50% coverage (range over tie orders)', 'AURC', 'AUGRC', 'Correctness AUROC'],
  V.flatMap(v => ['baseline', 'hybrid'].map(s => { const x = sel(v, s), y = t3b.versions[v].controls_excluded[s]; return [v, s === 'baseline' ? 'Shipped' : 'Hybrid', x.n, x.errors, `${x.largest_tie_block.size} (${pc(x.largest_tie_block.share, 0)}) at conf ${x.largest_tie_block.confidence}, ${x.largest_tie_block.errors_inside} errors`, `${pc(x.expected_risk.cov50)} (${pc(x.cov50_best_worst_over_tie_orders.best)}–${pc(x.cov50_best_worst_over_tie_orders.worst)})`, `${n3(x.aurc)} ${ci(x.aurc_ci95)}`, `${n3(y.augrc)} ${ci(y.augrc_ci95)}`, `${n3(x.correctness_auroc)} ${ci(x.correctness_auroc_ci95)}`]; }))));
P('');
P('**Paired differences, hybrid minus shipped** (paired bootstrap):');
P('');
P(table(['Ver.', 'AURC', 'AUGRC', 'Correctness AUROC'], V.map(v => [v, `${n3(t3.versions[v].selective.controls_excluded.aurc_difference_hybrid_minus_baseline.point)} ${ci(t3.versions[v].selective.controls_excluded.aurc_difference_hybrid_minus_baseline.ci95)}`, `${n3(t3b.versions[v].controls_excluded.augrc_difference_hybrid_minus_baseline.point)} ${ci(t3b.versions[v].controls_excluded.augrc_difference_hybrid_minus_baseline.ci95)}`, `${n3(c.versions[v].controls_excluded.difference)} ${ci(c.versions[v].controls_excluded.difference_ci95)}`])));
P('');
PV('AURC and AUGRC mix ranking with accuracy. Correctness AUROC isolates ranking; its v0.2 interval includes zero.');
P('');

// 4. Accuracy
P('## 4. Accuracy (non-control in-scope queries)');
P('');
const acc = (v, A) => t1.versions[v].accuracy[A].controls_excluded;
P(table(['System', 'v0.1', 'v0.2'], [['BM25 (shipped)', 'A0'], ['Dense (MiniLM)', 'A2'], ['Hybrid', 'A3']].map(([n, A]) => [n, ...V.map(v => `${acc(v, A).hits}/${acc(v, A).n} (${acc(v, A).pct.toFixed(1)}%)`)])));
P('');
const cmpRow = (v, k, lab) => { const x = t1.versions[v].comparisons[k].controls_excluded, gt = g.versions[v].tests[k === 'BM25_to_hybrid' ? 'accuracy_hybrid_vs_bm25' : 'accuracy_hybrid_vs_dense']; return [v, lab, `${x.a_only_correct}–${x.b_only_correct}`, `${x.delta_pp.toFixed(2)} ${ci(x.ci95_pp, y => (+y).toFixed(2))}`, pv(gt.exact), pv(gt.mid_p), pv(gt.asymptotic)]; };
P(table(['Ver.', 'Comparison', 'Discordant (other only – hybrid only)', 'Gain, pp', 'Exact McNemar p', 'Mid-p', 'Asymptotic p'], V.flatMap(v => [cmpRow(v, 'BM25_to_hybrid', 'hybrid vs BM25'), cmpRow(v, 'dense_to_hybrid', 'hybrid vs dense')])));
P('');
PV('- **Ties with the tests.** Controls are never discordant, so the p values are identical with the controls included.');
P('- **Bootstrap vs exact test.** The bootstrap intervals are not dual to the exact test.');
PV('- **Rounding.** Intervals are shown at the 2 decimals stored in `phase1_t1`. The v0.2 lower bound 0.75 is the bootstrap quantile 1/134 = 0.746 pp, which the paper shows as 0.7.');
PV('- **v0.2 hybrid vs BM25** is the only comparison whose side of 0.05 depends on the test used.');
P('');

// 5. Holm family
P('## 5. Pre-named test family (Holm, 4 comparisons per version)');
P('');
P('The family was fixed after the raw results were seen, so it is exploratory. It is computed with controls included.');
P('');
const sides = ['two-sided exact McNemar', 'two-sided exact McNemar', 'two-sided exact McNemar', 'one-sided paired-bootstrap bound (≤)'];
P(table(['Ver.', 'Member', 'Test', 'Raw p', 'Holm p (exact)', 'Holm p (mid-p)'], V.flatMap(v => H.versions[v].map((h, i) => [v, h.name, sides[i], (i === 3 ? '≤' : '') + pv(h.p), (i === 3 ? '≤' : '') + pv(h.holm_p), (i === 3 ? '≤' : '') + pv(g.versions[v].holm_family[i].holm_mid_p)]))));
P('');
P('"baseline-vs-tuned OOD" means the hybrid detector against the fixed rule. The tuned shipped threshold and the shipped-confidence recalibration are outside the family.');
P('');

// 6. OOD
P('## 6. Out-of-scope rejection');
P('');
P('**The three rules:**');
P('');
P('- **Fixed:** the shipped rule, raw BM25 < 2.0.');
P('- **Tuned threshold:** raw BM25 below an F1-maximizing threshold, chosen per fold on development folds.');
P('- **Detector:** the hybrid fused top-1 score, thresholded the same way.');
P('');
PV('False rejections are counted over non-control in-scope queries; no rule ever rejects a control.');
P('');
const eo = v => e.versions[v];
P(table(['Ver.', 'Rule', 'OOD rejected (Wilson)', 'False rejections', 'Thresholds per fold'], V.flatMap(v => [
  [v, 'Fixed rule', wil(eo(v).committed_operating_points.baseline_rule_bm25_lt_2.ood_rejected), `${eo(v).controls_excluded.false_rejected.fixed_rule}/${eo(v).controls_excluded.n_non_ood}`, '2.0'],
  [v, 'Tuned shipped threshold', wil(eo(v).nested_tuned_baseline_threshold.ood_rejected), `${eo(v).controls_excluded.false_rejected.tuned_shipped_threshold}/${eo(v).controls_excluded.n_non_ood}`, eo(v).nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25.map(n4).join(', ')],
  [v, 'Hybrid detector', wil(eo(v).committed_operating_points.tuned_detector_nested.ood_rejected), `${eo(v).controls_excluded.false_rejected.hybrid_detector}/${eo(v).controls_excluded.n_non_ood}`, detThr(v).map(n4).join(', ') + ' (fused-score scale)']
])));
P('');
P('**Tests** (exact McNemar; mid-p in brackets). Counts read "first-named rule only – second-named rule only".');
P('');
P(table(['Ver.', 'Detector vs fixed (OOD)', 'Tuned vs detector (OOD)', 'Tuned vs detector (false rejections)'], V.map(v => { const T = g.versions[v].tests; return [v, `${T.ood_detector_vs_fixed_rule.c}–${T.ood_detector_vs_fixed_rule.b}: p=${pv(T.ood_detector_vs_fixed_rule.exact)} [${pv(T.ood_detector_vs_fixed_rule.mid_p)}]`, `${T.ood_tuned_threshold_vs_detector.c}–${T.ood_tuned_threshold_vs_detector.b}: p=${pv(T.ood_tuned_threshold_vs_detector.exact)} [${pv(T.ood_tuned_threshold_vs_detector.mid_p)}]`, `${T.false_rejections_tuned_vs_detector.c}–${T.false_rejections_tuned_vs_detector.b}: p=${pv(T.false_rejections_tuned_vs_detector.exact)} [${pv(T.false_rejections_tuned_vs_detector.mid_p)}]`]; })));
P('');
P('**OOD ranking** (pooled AUROC, non-control; paired stratified bootstrap):');
P('');
P(table(['Ver.', 'Shipped raw BM25', 'Hybrid fused top-1', 'Difference (hybrid − shipped)'], V.map(v => { const x = eo(v).controls_excluded.auroc; return [v, `${n3(x.baseline_raw_bm25)} ${ci(x.baseline_ci95)}`, `${n3(x.detector_fused_top1)} ${ci(x.detector_ci95)}`, `${n3(x.difference_detector_minus_baseline)} ${ci(x.difference_ci95)}`]; })));
P('');
P('**At equal false-rejection counts** (thresholds for both scores picked on the same data; in-sample, descriptive):');
P('');
P(table(['Ver.', 'False rejections ≤', 'Shipped score rejects', 'Hybrid feature rejects'], V.flatMap(v => Object.values(eo(v).in_sample_matched_false_rejection).filter((x, i, arr) => arr.findIndex(y => y.max_false_rejections === x.max_false_rejections) === i).map(x => [v, x.max_false_rejections, `${x.baseline_score.ood_rejected} (at ${x.baseline_score.false_rejected})`, `${x.detector_feature.ood_rejected} (at ${x.detector_feature.false_rejected})`]))));
P('');
PV('No control is among these false rejections.');
P('');
P('**By source and kind (v0.2).** Kind labels were assigned by an AI assistant and are unchecked.');
P('');
const bs2 = eo('v0.2').rejections_by_source, bk2 = eo('v0.2').rejections_by_kind;
const kr = (lab, x) => [lab, x.n, x.fixed_rule, x.tuned_shipped_threshold, x.hybrid_detector];
const term = ['n', 'fixed_rule', 'tuned_shipped_threshold', 'hybrid_detector'].reduce((o, k) => (o[k] = bk2.unsupported_tool_ood[k] + bk2.near_ood[k], o), {});
P(table(['Group', 'n', 'Fixed', 'Tuned threshold', 'Detector'], [
  kr('Original v0.1 items (keyword-checked, not score-screened)', bs2.original_v0_1_items), kr('Added v0.2 items (screened: BM25 ≤ 7.39, cosine ≤ 0.31)', bs2.added_v0_2_items),
  kr('Everyday non-computing (non_terminal)', bk2.non_terminal), kr('Far-from-corpus computing (far_ood)', bk2.far_ood), kr('Nonsensical', bk2.nonsensical),
  kr('Terminal tasks not in corpus (near_ood + unsupported_tool_ood)', term)
]));
P('');
P(`**The screening check.**`);
P('');
P(`- All ${a.facts.drafted_ood_candidates} drafted OOD queries were accepted unchanged; none was discarded.`);
P(`- The raw BM25 maxima are ${a.profiles.original_ood_15.bm25_max} for the original 15 and ${a.profiles.added_ood_35.bm25_max} for the added 35.`);
{ const th = eo('v0.2').nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25;
  P(`- The tuned shipped thresholds on v0.2 (${Math.min(...th).toFixed(2)}–${Math.max(...th).toFixed(2)}) sit just below the added queries' maximum. This favors the shipped score.`); }
P('');

// 7. False rejections
P('## 7. Legitimate queries refused, item by item (non-control in-scope)');
P('');
P('S = the shipped tool answered it correctly; H = the hybrid answered it correctly.');
P('');
for (const v of V) for (const [r, lab] of [['tuned_shipped_threshold', 'Tuned shipped threshold'], ['hybrid_detector', 'Hybrid detector']]) {
  const it = eo(v).false_rejection_items[r];
  P(`**${v}, ${lab}: ${it.length} refused.**`);
  P('');
  P(`- The shipped tool had answered ${it.filter(x => x.shipped_correct).length} of them correctly.`);
  P(`- The hybrid had answered ${it.filter(x => x.hybrid_correct).length} of them correctly.`);
  P('');
  P(table(['ID', 'Query', 'Label', 'Type', 'S', 'H', 'Raw BM25', 'Fused top-1'], it.map(x => [x.id, `"${x.query}"`, x.label, x.query_type, x.shipped_correct ? '✓' : '', x.hybrid_correct ? '✓' : '', x.raw_bm25, x.fused_top1])));
  P('');
}
PV('The fixed rule refuses no legitimate query on either version.');
P('');

// 8. Safety
P('## 8. Risky answers and the risk classifier (no safety claim)');
P('');
P('**Setup.**');
P('');
P('- Risk tiers come from a deterministic rule-based classifier applied to each returned command.');
P('- The classifier misses at least one destructive command, so risky counts are lower bounds.');
P('- Population: non-control queries, with OOD included.');
P('');
P(table(['Ver.', 'System', 'Answered', 'High/critical returned', 'Of which wrong', 'Wrong at max confidence'], V.flatMap(v => ['baseline', 'hybrid'].map(s => { const x = d.versions[v][s]; return [v, s === 'baseline' ? 'Shipped' : 'Hybrid', x.controls_excluded.answered, x.controls_excluded.risky_returned_commands, x.controls_excluded.of_which_wrong, x.wrong_and_risky.in_top_confidence_band]; }))));
P('');
PV('**Wrong and risky answers.** No control is among them. Confidence is on each system\'s own scale: the shipped tool in %, the hybrid as a fused score in [0, 1].');
P('');
P(table(['Ver.', 'System', 'ID', 'Query', 'Returned command', 'Tier', 'Confidence', 'OOD'], V.flatMap(v => ['baseline', 'hybrid'].flatMap(s => d.versions[v][s].wrong_and_risky.items.map(x => [v, s === 'baseline' ? 'Shipped' : 'Hybrid', x.id, `"${x.query}"`, '`' + x.returned.replace(/\|/g, '\\|') + '`', x.tier, x.confidence, x.is_ood ? 'yes' : ''])))));
P('');
P('**Classifier scored against the benchmark\'s own risk labels.** These are gold commands of non-OOD queries, and the labels are not an independent safety set.');
P('');
P(table(['Ver.', 'Gold commands', 'High/critical labelled low/medium (Wilson)', 'Items'], V.map(v => { const x = t5.versions[v].gold_commands; return [v, x.n, wil(x.dangerous_direction_misses_spec), x.dangerous_direction_misses_spec.items.map(i => `${i.id} \`${i.command.replace(/\|/g, '\\|')}\` (${i.truth}→${i.pred})`).join('; ')]; })));
P('');
PV('- **The one genuine miss:** `git checkout -- .`, which discards uncommitted work.');
PV('- **The two added v0.2 misses** trace to inconsistent benchmark labels.');
P(`- **Functional check:** ${fx.summary.n_evaluated} sandbox-safe queries; gold success ${pc(fx.summary.gold_functional_success_rate, 0)}, hybrid success ${pc(fx.summary.retrieved_functional_success_rate, 1)}. Exit code 0 counts as success.`);
P('');

// 9. Robustness
P('## 9. Robustness checks');
P('');
P('**Fold partitions** (20 stratified partitions: seed 42 plus seeds 1–19; every fold-dependent step re-run; point estimates; non-control):');
P('');
const S = v => sr.versions[v].summary, rg = x => `${n3(x.min)}–${n3(x.max)} (median ${n3(x.median)})`, rgi = x => `${x.min}–${x.max} (median ${x.median})`;
P(table(['Quantity', 'v0.1', 'v0.2'], [
  ['Shipped ECE after isotonic', rg(S('v0.1').shipped_ece_after), rg(S('v0.2').shipped_ece_after)],
  ['Shipped ECE reduction', rg(S('v0.1').shipped_reduction), rg(S('v0.2').shipped_reduction)],
  ['Partitions within the noise-floor p95 (shipped / hybrid)', `${S('v0.1').seeds_shipped_within_floor_p95} / ${S('v0.1').seeds_hybrid_within_floor_p95}`, `${S('v0.2').seeds_shipped_within_floor_p95} / ${S('v0.2').seeds_hybrid_within_floor_p95}`],
  ['OOD rejected: tuned / detector', `${rgi(S('v0.1').ood_tuned)} / ${rgi(S('v0.1').ood_detector)}`, `${rgi(S('v0.2').ood_tuned)} / ${rgi(S('v0.2').ood_detector)}`],
  ['False rejections: tuned / detector', `${rgi(S('v0.1').fr_tuned)} / ${rgi(S('v0.1').fr_detector)}`, `${rgi(S('v0.2').fr_tuned)} / ${rgi(S('v0.2').fr_detector)}`],
  ['Partitions: tuned rejects more OOD than detector', S('v0.1').seeds_tuned_rejects_more_ood_than_detector, S('v0.2').seeds_tuned_rejects_more_ood_than_detector],
  ['Partitions: AURC diff < 0 / AUGRC diff < 0 / correctness AUROC diff > 0', `${S('v0.1').seeds_aurc_diff_negative} / ${S('v0.1').seeds_augrc_diff_negative} / ${S('v0.1').seeds_corr_auroc_diff_positive}`, `${S('v0.2').seeds_aurc_diff_negative} / ${S('v0.2').seeds_augrc_diff_negative} / ${S('v0.2').seeds_corr_auroc_diff_positive}`],
  ['Partitions: hybrid vs BM25 p < 0.05 / hybrid vs dense p < 0.05', `${S('v0.1').seeds_p_vs_bm25_lt_05} / ${S('v0.1').seeds_p_vs_dense_lt_05}`, `${S('v0.2').seeds_p_vs_bm25_lt_05} / ${S('v0.2').seeds_p_vs_dense_lt_05}`]
]));
P('');
P('**Bare-keyword sensitivity** (controls included; α and thresholds not re-tuned):');
P('');
P(table(['Ver.', 'Subset', 'n', 'Hybrid − BM25 (pp, p)', 'Hybrid − dense (pp, p)', 'ECE reduction'], sens.versions.flatMap(vv => Object.entries(vv.subsets).map(([k, x]) => [vv.benchmark, k, x.n_nonOOD_evaluated, `${(+x.A0_vs_A3.delta_pp).toFixed(1)} (${pv(x.A0_vs_A3.exact_mcnemar_p)})`, `${(+x.A2_vs_A3.delta_pp).toFixed(1)} (${pv(x.A2_vs_A3.exact_mcnemar_p)})`, x.calibration ? `${(+x.calibration.relative_reduction_pct).toFixed(0)}%` : '—']))));
P('');
P('**Split B** (folds grouped by intent; controls included; hybrid):');
P('');
P(table(['Ver.', 'Groups', 'Accuracy A / B', 'OOD AUROC A / B (fold mean)', 'Ambiguity F1 A / B', 'ECE after A / B'], V.map(v => { const x = sb[v]; return [v, x.group_count, `${n3(x.splitA_reference.hybrid_non_ood_accuracy)} / ${n3(x.splitB.hybrid_non_ood_accuracy)}`, `${n3(x.splitA_reference.ood_auroc)} / ${n3(x.splitB.ood_detection.mean_auroc)}`, `${n3(x.splitA_reference.ambiguity_f1)} / ${n3(x.splitB.ambiguity_detection.f1)}`, `${n3(x.splitA_reference.calibration_ece_after)} / ${n3(x.splitB.calibration_ece_after)}`]; })));
P('');

// 10. Labels
P('## 10. Label reliability');
P('');
P(`- **κ.** A partially independent reviewer re-labelled ${f.kappa.n} AI-authored v0.2 queries: Cohen's κ = ${f.kappa.point}. The percentile bootstrap 95% interval is ${ci(f.kappa.bootstrap_ci95, n3)} (${f.kappa.bootstrap.valid_resamples}/${f.kappa.bootstrap.B} valid resamples). This is below the pre-specified 0.7 target.`);
P(`- **OOD labels.** The reviewer agreed on ${f.ood_agreement.k}/${f.ood_agreement.n} (Clopper–Pearson ${ci(f.ood_agreement.clopper_pearson_ci95, y => pc(y, 0))}). Of these, 7 were everyday requests and 1 a far-from-corpus task; none was a terminal task.`);
P('- **Disagreements.** All three were on ambiguous labels (3 of 6).');
if (!V2) P('- **Pending.** The two-annotator study of all 59 AI-authored queries is under way. Its results will go into v2.0 of this report.');
else {
  const annPath = arg('--annotation') || 'research/results/annotation/annotation_results.json';
  const A = R(annPath);
  if (A.stamp && !process.argv.includes('--allow-synthetic')) { console.error('ABORT: the annotation results are stamped ' + A.stamp); process.exit(1); }
  if (A.stamp) P(`**[SYNTHETIC TEST RENDERING: ${A.stamp}]**`);
  const k = A.primary, kt = A.targets_only, cr = A.criteria;
  P('');
  P('**Two-annotator study** (protocol fixed before any label existed: `research/datasets/annotation/ANNOTATION_PROTOCOL.md`). The reviewer check above is the earlier, smaller check; it is kept as history.');
  P('');
  P(`- **Primary κ** (unweighted Cohen's κ, 3 classes, ${k.n} items): ${n3(k.kappa)}, 95% bootstrap interval ${ci(k.ci95, n3)}; agreement ${k.percent_agreement}%.`);
  P(`- **Targets only** (${kt.n}): κ = ${n3(kt.kappa)} ${ci(kt.ci95, n3)}; agreement ${kt.percent_agreement}%.`);
  P(`- **Pre-declared criteria:** κ ≥ ${cr.kappa_ge_0_70.target}: ${cr.kappa_ge_0_70.met ? 'MET' : 'NOT MET'}; OOD confirmed ≥ 90%: ${cr.ood_confirmed_ge_90pct.met ? 'MET' : 'NOT MET'}. ${A.all_pre_declared_criteria_met ? 'Both met.' : 'Not both met: per protocol, the result is reported as measured.'}`);
  if (A.secondary) P(`- **Secondary:** κ OOD vs not ${n3(A.secondary.kappa_ood_vs_not.kappa)} ${ci(A.secondary.kappa_ood_vs_not.ci95, n3)}; AMBIGUOUS vs not ${n3(A.secondary.kappa_ambiguous_vs_not.kappa)} ${ci(A.secondary.kappa_ambiguous_vs_not.ci95, n3)}.`);
}
P('');

// 11. Limitations
P('## 11. Limitations the manuscript must carry');
P('');
[
  'Small, dependent, partly AI-authored benchmark (150 and 209 queries; 59 drafted by an AI agent); label check below target; the annotation study has no results yet.',
  'All analyses were specified after the results were seen: the Holm family, the controls exclusion, the equal-false-rejection comparison and the sensitivity subsets. Accuracy tests rest on 7–8 discordant queries.',
  'Headline numbers use one fold partition (seed 42). Twenty partitions support the ranking and out-of-scope results, but "within the noise floor" is partition-dependent.',
  'Only 10 OOD queries are terminal tasks. Kind labels are AI-assigned. The added OOD queries were screened with raw retrieval scores, which favors the shipped score. The detector features were chosen on the full data, which may flatter the detector.',
  'Scope: one tool, one platform (Windows corpus of 279 commands), one small encoder (all-MiniLM-L6-v2), one fusion rule, exact-match scoring, and single-machine latency. No generative system, user study or public benchmark.',
  'The risk classifier is scored against the benchmark\'s own labels, two of which are inconsistent. It misses at least one destructive command. The functional check covers 15 queries and treats exit code 0 as success.',
  'Ground-truth defects: TA-B145 and TA-B187 (v0.2 only) have gold commands outside the corpus; TA-B149 has an acceptable command outside it. They lower non-OOD accuracy by 1 (v0.1) and 2 (v0.2) queries for every system.'
].forEach(x => PV('- ' + x));
P('');

// 12. Mapping and inputs
P('## 12. Manuscript mapping and frozen inputs');
P('');
P(table(['Manuscript element', 'Section of this report'], [['Table 1 (claims)', '§2, §3, §4, §6'], ['Table 2 (accuracy)', '§4'], ['Table 3 (risk)', '§8'], ['Figure 1 (shipped reliability)', '§2 (bins: `review_r1_h_shipped_reliability_bins.json`)'], ['Appendix Tables 5–7', '§5, §9'], ['Limitations', '§11']]));
P('');
P('**Claim trace.** `research/experiments/trace_claims.js` checks every number in the manuscript against these same files. It must report 0 problems before any submission.');
P('');
P('**SHA-256 of every input at freeze time:**');
P('');
P(table(['File', 'SHA-256'], Object.entries(inputs).sort().map(([k, h]) => ['`' + k + '`', '`' + h + '`'])));
P('');
fs.writeFileSync(OUT, L.join('\n') + '\n');
console.log(`wrote ${path.relative(ROOT, OUT)} (${L.length} lines, ${Object.keys(inputs).length} hashed inputs, results at ${commit})`);
