// T15: claim-to-result trace for the paper body (research/paper/acl_latex/content.tex).
//
// Every entry names a location in the paper, a text snippet that must appear verbatim in content.tex
// (whitespace-normalized), and the numbers inside it, each with its source: a result-file field, a
// computation over committed per-query data (stated in the entry), a code constant, or a dataset count.
// The checker
//   1. confirms each snippet still appears in content.tex (so the table cannot silently go stale), and
//   2. recomputes each number from its source and confirms it rounds to the digits the paper shows.
// It writes research/paper/CLAIMS_TRACE.md and exits non-zero on any mismatch. Read-only: it never runs
// or edits the tool (cli/search.js is only read as text).
//
// Rounding rule: a displayed value with d decimals matches a source value v iff round(v, d) equals it
// (percentages: v is multiplied by 100 first when the source is a proportion). Ranges and intervals are
// checked end by end.
const fs = require('fs'), path = require('path');
const { C } = require('./review_r1_common');
const ROOT = path.resolve(__dirname, '..', '..');
const rel = p => path.join(ROOT, p);
const cache = {};
const R = f => (cache[f] = cache[f] || JSON.parse(fs.readFileSync(rel('research/results/' + f), 'utf8')));
const RD = f => (cache[f] = cache[f] || JSON.parse(fs.readFileSync(rel(f), 'utf8')));
function g(obj, p) {
  let o = obj;
  // version keys ("v0.1", "v0.2") contain a dot, so protect them before splitting on dots
  for (const raw of p.replace(/v0\.(\d)/g, 'v0~$1').match(/[^.[\]]+/g)) {
    const part = raw.replace('~', '.');
    if (o == null) throw new Error(`path ${p}: missing at ${part}`); o = o[part];
  }
  if (o === undefined) throw new Error(`path ${p}: undefined`);
  return o;
}
const F = (file, p) => ({ v: g(R(file), p), src: `results/${file} :: ${p}` });          // result field
const X = (v, src) => ({ v, src });                                                         // computed / other
const pct = s => ({ v: s.v * 100, src: s.src + ' (x100)' });
const neg = s => ({ v: -s.v, src: s.src + ' (sign flipped: A minus B shown as B minus A)' });

const tex = fs.readFileSync(rel('research/paper/acl_latex/content.tex'), 'utf8')
  .split(/\r?\n/).filter(l => !/^\s*%/.test(l)).join(' ').replace(/\s+/g, ' ');

// ---------- data used by computed entries ----------
const D1 = C.load('v0.1'), D2 = C.load('v0.2');
const repro1 = R('baseline/reproduction-results.json');
const WRONG = ['INCORRECT', 'AMBIGUOUS_INCORRECT', 'OOD_FALSE_ACCEPT'];
const wrong1 = repro1.filter(r => WRONG.includes(r.evaluation.status) && r.actual.confidence > 0);
const corpus = RD('cli/data/commands.json'); const recs = Array.isArray(corpus) ? corpus : corpus.commands;
const winVisible = recs.filter(r => r.os.includes('all') || r.os.includes('win32'));
const searchJs = fs.readFileSync(rel('cli/search.js'), 'utf8');
const labelCount = (D, lab) => D.ids.filter(id => D.cls.get(id) === lab).length;
const bare = D => D.ids.filter(id => D.cls.get(id) === 'AMBIGUOUS' && D.qById.get(id).query.trim().split(/\s+/).length === 1);
const kap = RD('research/datasets/independent_review/kappa_results.json');
const sub = RD('research/datasets/ood_subtypes_v0.2_ai_assigned.json'); const subOf = new Map((sub.labels || sub).map(l => [l.id, l.subtype || l.ood_subtype]));
const kOOD = kap.rows.filter(r => r.original_label === 'OOD');
const newEntries = RD('research/datasets/v0.2_new_entries.json');
const adjRaw = RD('research/datasets/v0.2_adjudication_raw.json');
const scores2 = repro1.map(r => r.actual.score);
// A5 decision for the six risky hybrid answers on v0.2, recomputed from the committed per-fold thresholds
const a5 = R('v0.2/ablation-results.json').conditions.A5.per_fold;
const a5Accepts = id => { const f = D2.featById.get(id), k = D2.folds.assignment[id], t = a5[k]; return !(f.margin < t.margin_threshold || f.top1_score < t.ood_threshold); };
const a5Guard = a5.map((t, k) => D2.ids.filter(id => D2.folds.assignment[id] === k && a5Accepts(id)).length).join(',') === a5.map(t => t.accepted).join(',');
const risky6 = R('review_r1/review_r1_d_risk.json').versions['v0.2'].hybrid.wrong_and_risky.items.map(x => x.id);
const nlc = fs.readFileSync(rel('research/paper/T6_LITERATURE_VERIFICATION.md'), 'utf8');

// ---------- the claims ----------
const E = []; const add = (where, snippet, items, note) => E.push({ where, snippet, items, note });
const b = 'review_r1/review_r1_b_calibration.json', e = 'review_r1/review_r1_e_ood_operating_points.json', t1 = 'phase1/phase1_t1_controls_excluded.json';
const bs = (v, s) => `versions.${v}.baseline_confidence.controls_excluded.${s}`, hs = (v, s) => `versions.${v}.hybrid_reliability.controls_excluded.${s}`;

// Abstract and Introduction
add('Abstract; §1 C1', 'wrong answers average 86\\% confidence', [['86', X(wrong1.reduce((a, r) => a + r.actual.confidence, 0) / wrong1.length, 'computed: mean confidence of the 49 answered wrong v0.1 queries, results/baseline/reproduction-results.json (also reproduction-summary.json mean_confidence_on_wrong_pct = "86.1")')]]);
add('Abstract', 'the second adds 59 out-of-scope and ambiguous queries', [['59', X(D2.ids.length - D1.ids.length, 'computed: 209 v0.2 ids minus 150 v0.1 ids (results/v0.2/folds.json, results/hybrid/folds.json)')]]);
add('Abstract', 'excluding 25 verbatim-copy controls', [['25', X(D1.ids.filter(D1.isCanonical).length, 'computed: query_type = canonical, v0.1 benchmark')]]);
add('Abstract', 'error by 79\\% and 78\\%', [['79', pct(F(b, bs('v0.1', 'relative_ece_reduction_equal_width.point')))], ['78', pct(F(b, bs('v0.2', 'relative_ece_reduction_equal_width.point')))]], 'round 1-3 drafts said "79% on both versions"; v0.2 is 78.47%, corrected by this trace (T15)');
add('Abstract', 'rejects 46 of 50 out-of-scope requests but also 20 of 134 in-scope ones', [['46', F(e, 'versions.v0.2.nested_tuned_baseline_threshold.ood_rejected.k')], ['50', F(e, 'versions.v0.2.n_ood')], ['20', F(e, 'versions.v0.2.controls_excluded.false_rejected.tuned_shipped_threshold')], ['134', F(e, 'versions.v0.2.controls_excluded.n_non_ood')]]);
add('Abstract', 'the fixed rule rejects 17 and none, a hybrid detector 34 and 11', [['17', F(e, 'versions.v0.2.committed_operating_points.baseline_rule_bm25_lt_2.ood_rejected.k')], ['0', F(e, 'versions.v0.2.controls_excluded.false_rejected.fixed_rule')], ['34', F(e, 'versions.v0.2.committed_operating_points.tuned_detector_nested.ood_rejected.k')], ['11', F(e, 'versions.v0.2.controls_excluded.false_rejected.hybrid_detector')]]);
add('Abstract', 'the 35 added were screened for low scores', [['35', F(e, 'versions.v0.2.rejections_by_source.added_v0_2_items.n')]]);
// INTEG-07 (2026-10-01): the abstract's "on the 15 original ones ... 4, 12 and 9" clause was replaced by the
// external-check sentence (author decision, abstract = beta); 4, 12, 9 and 15 stay traced in §5 and the Conclusion.
{ const s1 = 'e1_clinc150_v1/summary.json';
  add('Abstract', 'On 4,500 unscreened external requests (pre-specified check), the threshold still beats the detector (86\\% vs.\\ 78\\%) but, at equal cost, loses (65\\% vs.\\ 77\\%)', [['4500', F(s1, 'P1.n')], ['86', pct(F(s1, 'P1.rates.R2.rate'))], ['78', pct(F(s1, 'P1.rates.R3.rate'))], ['65', pct(F(s1, 'P1.matched_operating_point.rates.R2m.rate'))], ['77', pct(F(s1, 'P1.matched_operating_point.rates.R3m.rate'))]], 'external check (protocol e1-protocol-v1): primary rates at the v0.2 operating points, then matched operating points; 4,500 displayed with a thousands comma');
  add('Conclusion', "the threshold still rejects more at its operating point (86\\% vs.\\ 78\\%), but at equal v0.2 cost the hybrid's feature rejects more (77\\% vs.\\ 65\\%)", [['86', pct(F(s1, 'P1.rates.R2.rate'))], ['78', pct(F(s1, 'P1.rates.R3.rate'))], ['77', pct(F(s1, 'P1.matched_operating_point.rates.R3m.rate'))], ['65', pct(F(s1, 'P1.matched_operating_point.rates.R2m.rate'))]], 'external check, P1 (4,500 known-intent requests)');
}
add('§1', 'refuses below 30\\%', [['30', X(+(/match\.confidence < (\d+)/.exec(fs.readFileSync(rel('cli/index.js'), 'utf8')) || [])[1], 'cli/index.js:58 refusal threshold')]]);

// §2
add('§2 NLC2CMD', 'came within 12\\% of the best system', [['12', X(/within 12\s?%/.test(nlc) ? 12 : NaN, 'research/paper/T6_LITERATURE_VERIFICATION.md (verified against the NLC2CMD report, arXiv 2103.02523)')]], 'literature value, not a result of this study');

// §3 System
const num = re => { const m = re.exec(searchJs); return m ? +m[1] : NaN; };
add('§3 tool', '$k_1=1.2$, $b=0.75$', [['1.2', X(num(/const k1 = ([\d.]+);/), 'cli/search.js:79 const k1')], ['0.75', X(num(/const b = ([\d.]+);/), 'cli/search.js:80 const b')]]);
add('§3 tool', 'plus $+15$ when the query', [['15', X(num(/score \+= ([\d.]+);/), 'cli/search.js:110 substring bonus (score += 15.0)')]]);
add('§3 tool', '$\\min(\\mathrm{round}(s/8\\times100),100)$', [['8', X(num(/\/\s*(8(?:\.0)?)\s*\)\s*\*\s*100/), 'cli/search.js: confidence divisor')]]);
add('§3 tool', 'is 0 when $s<2.0$', [['2.0', X(num(/bestScore < ([\d.]+)\)/), 'cli/search.js:124 minimum score')]]);
add('§3 tool', '16-word stopword list', [['16', X(((/const ignoreWords = new Set\(\[([^\]]*)\]\)/.exec(searchJs) || [])[1] || '').split(',').filter(t => t.trim()).length, 'cli/search.js:9 ignoreWords set size')]], 'round 1-3 drafts said "10-word", copied from an unverified report; corrected by this trace (T15)');
add('§3 tool', 'no benchmark query scores between 2.0 and 2.4', [['0', X([...scores2, ...R('v0.2/reproduction-results.json').map(r => r.actual.score)].filter(s => s >= 2.0 && s < 2.4).length, 'computed: raw top scores in [2.0, 2.4), both reproduction-results files')]]);
add('§3 tool', '(0/150 mismatches)', [['0', X((() => { const d = R('baseline/reproduction-vs-archive-diff.json'); return d.mismatch_count ?? d.mismatches?.length ?? d.total_mismatches ?? d.summary?.mismatches; })(), 'results/baseline/reproduction-vs-archive-diff.json')], ['150', X(repro1.length, 'results/baseline/reproduction-results.json length')]]);
add('§3 tool', 'was 3.3\\,ms in one run on one machine', [['3.3', F('baseline/reproduction-summary.json', 'archived_reference.mean_latency_ms')]], 'archived baseline run; the reproduction run gives 3.21 ms (reproduction-summary.json mean_latency_ms)');
add('§3 corpus', '431 records, of which 279 are visible on Windows (145 cross-platform, 134 Windows-specific)', [['431', X(recs.length, 'cli/data/commands.json length')], ['279', X(winVisible.length, 'os includes all or win32')], ['145', X(recs.filter(r => r.os.includes('all')).length, 'os = all')], ['134', X(recs.filter(r => r.os.includes('win32')).length, 'os = win32')]]);

// §3 Benchmark
add('§3 benchmark', 'v0.1 has 150 hand-adjudicated queries of 9 types', [['150', X(D1.ids.length, 'v0.1 ids')], ['9', X(new Set(D1.queries.map(q => q.query_type)).size, 'distinct query_type, v0.1 benchmark')]]);
add('§3 benchmark', 'labeled CORRECT (119), AMBIGUOUS (14), OOD (15;', [['119', X(labelCount(D1, 'CORRECT'), 'ablation A3 per_query classification, v0.1')], ['14', X(labelCount(D1, 'AMBIGUOUS'), 'same')], ['15', X(labelCount(D1, 'OOD'), 'same')]]);
add('§3 benchmark', 'NEEDS\\_CORRECTION (2)', [['2', X(labelCount(D1, 'NEEDS_CORRECTION'), 'same')]]);
add('§3 benchmark', 'v0.2 contains all of v0.1 plus 35 out-of-scope and 24 ambiguous queries', [['35', X(labelCount(D2, 'OOD') - labelCount(D1, 'OOD'), 'v0.2 minus v0.1 OOD labels')], ['24', X(labelCount(D2, 'AMBIGUOUS') - labelCount(D1, 'AMBIGUOUS'), 'v0.2 minus v0.1 AMBIGUOUS labels')]]);
add('§3 benchmark', 'share their 121 answerable queries', [['121', X(D1.ids.filter(id => ['CORRECT', 'NEEDS_CORRECTION'].includes(D1.cls.get(id))).length, 'v0.1 CORRECT + NEEDS_CORRECTION')]]);
add('§3 benchmark', '24 of 30 ambiguous drafts were kept (6 failed', [['24', X((newEntries.ambiguous || []).length, 'research/datasets/v0.2_new_entries.json ambiguous')], ['30', X(adjRaw.ambiguous.length, 'research/datasets/v0.2_adjudication_raw.json ambiguous')], ['6', X(adjRaw.ambiguous.length - (newEntries.ambiguous || []).length, '30 minus 24')]]);
add('§3 benchmark; §5', '(maximum 7.39 and 0.31)', [['7.39', F('review_r1/review_r1_a_ood_selection.json', 'profiles.added_ood_35.bm25_max')], ['0.31', F('review_r1/review_r1_a_ood_selection.json', 'profiles.added_ood_35.cos_max')]]);
add('§3 benchmark', 'Seventeen of the 24 new ambiguous queries are single tool or category names', [['17', X(bare(D2).length - bare(D1).length, 'computed: one-token AMBIGUOUS queries, v0.2 minus v0.1 (rule of stats/sensitivity-bare-keyword-results.json)')]]);
add('§3 benchmark', "nine of v0.1's 14 are too", [['9', X(bare(D1).length, 'one-token AMBIGUOUS queries, v0.1')]]);
add('§3 benchmark', "lower every system's non-OOD accuracy by one query on v0.1 and two on v0.2", [['1', X(['TA-B145', 'TA-B187'].filter(id => D1.qById.has(id)).length, 'items with gold outside the corpus present in v0.1')], ['2', X(['TA-B145', 'TA-B187'].filter(id => D2.qById.has(id)).length, 'present in v0.2')]], 'defects documented in research/paper/review_round1/author_verification.md');
add('§3 kappa', 're-labeled a stratified sample of 14 AI-authored queries', [['14', F('review_r1/review_r1_f_kappa_intervals.json', 'kappa.n')]]);
add('§3 kappa', "Cohen's $\\kappa=0.63$", [['0.63', F('review_r1/review_r1_f_kappa_intervals.json', 'kappa.point')]]);
add('§3 kappa', '95\\% interval [0.39, 1.00]), below our 0.7 target', [['0.39', F('review_r1/review_r1_f_kappa_intervals.json', 'kappa.bootstrap_ci95[0]')], ['1.00', F('review_r1/review_r1_f_kappa_intervals.json', 'kappa.bootstrap_ci95[1]')], ['0.7', X(0.7, 'research/datasets/independent_review/KAPPA_RESULTS_NOTES.md: pre-specified target')]]);
add('§3 kappa', 'agreed with all 8 out-of-scope labels', [['8', X(kOOD.filter(r => r.agree).length, 'kappa_results.json rows, OOD, agree')]]);
add('§3 kappa', 'interval for the agreement rate [63, 100]\\%', [['63', pct(F('review_r1/review_r1_f_kappa_intervals.json', 'ood_agreement.clopper_pearson_ci95[0]'))], ['100', pct(F('review_r1/review_r1_f_kappa_intervals.json', 'ood_agreement.clopper_pearson_ci95[1]'))]]);
add('§3 kappa', '7 everyday requests and one far-from-corpus computing task', [['7', X(kOOD.filter(r => subOf.get(r.original_id) === 'non_terminal').length, 'kappa rows x ood_subtypes_v0.2_ai_assigned.json')], ['1', X(kOOD.filter(r => subOf.get(r.original_id) === 'far_ood').length, 'same')]]);
add('§3 kappa', 'disagreed on 3 of 6 ambiguous ones', [['3', X(kap.rows.filter(r => r.original_label === 'AMBIGUOUS' && !r.agree).length, 'kappa rows')], ['6', X(kap.rows.filter(r => r.original_label === 'AMBIGUOUS').length, 'kappa rows')]]);

// §4
add('§4', '384-dimensional MiniLM', [['384', X(D1.feats.length && 384, 'all-MiniLM-L6-v2 model card (embedding size 384); research/results/dense/dense-summary.json documents the model')]], 'model property; see research/REPRODUCE.md for the pinned model hash');
add('§4', '($\\alpha\\in\\{0.3,0.5\\}$ throughout)', [['0.3', X(Math.min(...R('hybrid/hybrid-nested-cv-results.json').aggregate.selected_alpha_per_fold, ...R('v0.2/hybrid-nested-cv-results.json').aggregate.selected_alpha_per_fold), 'min selected_alpha, both hybrid-nested-cv-results.json')], ['0.5', X(Math.max(...R('hybrid/hybrid-nested-cv-results.json').aggregate.selected_alpha_per_fold, ...R('v0.2/hybrid-nested-cv-results.json').aggregate.selected_alpha_per_fold), 'max selected_alpha')]]);
add('§4', '(64\\% of the hybrid\'s and 73\\% of the shipped values on all 150 v0.1 queries)', [['64', pct(F('phase1/phase1_t3_selective_ties.json', 'versions.v0.1.selective.all.hybrid.largest_tie_block.share'))], ['73', pct(F('phase1/phase1_t3_selective_ties.json', 'versions.v0.1.selective.all.baseline.largest_tie_block.share'))]]);

// Table 1
add('Table 1 row 1', '.323$\\to$.069; $-$79\\% [44, 84]', [['.323', F(b, bs('v0.1', 'uncalibrated.ece_equal_width_10'))], ['.069', F(b, bs('v0.1', 'isotonic.ece_equal_width_10'))], ['79', pct(F(b, bs('v0.1', 'relative_ece_reduction_equal_width.point')))], ['44', pct(F(b, bs('v0.1', 'relative_ece_reduction_equal_width.ci95[0]')))], ['84', pct(F(b, bs('v0.1', 'relative_ece_reduction_equal_width.ci95[1]')))]]);
add('Table 1 row 1', '.293$\\to$.063; $-$78\\% [52, 87]', [['.293', F(b, bs('v0.2', 'uncalibrated.ece_equal_width_10'))], ['.063', F(b, bs('v0.2', 'isotonic.ece_equal_width_10'))], ['78', pct(F(b, bs('v0.2', 'relative_ece_reduction_equal_width.point')))], ['52', pct(F(b, bs('v0.2', 'relative_ece_reduction_equal_width.ci95[0]')))], ['87', pct(F(b, bs('v0.2', 'relative_ece_reduction_equal_width.ci95[1]')))]]);
for (const [v, snip] of [['v0.1', '$-$.23 [$-$.45, .01] / .20 [.04, .36]'], ['v0.2', '$-$.06 [$-$.26, .15] / .33 [.19, .46]']]) {
  const s = k => F(b, bs(v, 'brier_skill_vs_no_skill.' + k));
  const shown = snip.replace(/\$-\$/g, '-').match(/-?\.\d+/g);
  add('Table 1 row 2', snip, [[shown[0], s('uncalibrated.point')], [shown[1], s('uncalibrated.ci95[0]')], [shown[2], s('uncalibrated.ci95[1]')], [shown[3], s('isotonic.point')], [shown[4], s('isotonic.ci95[0]')], [shown[5], s('isotonic.ci95[1]')]]);
}
add('Table 1 row 3', '.329$\\to$.108; $-$67\\% [43, 83]', [['.329', F(b, hs('v0.1', 'uncalibrated.ece_equal_width_10'))], ['.108', F(b, hs('v0.1', 'isotonic.ece_equal_width_10'))], ['67', pct(F(b, hs('v0.1', 'relative_ece_reduction_equal_width.point')))], ['43', pct(F(b, hs('v0.1', 'relative_ece_reduction_equal_width.ci95[0]')))], ['83', pct(F(b, hs('v0.1', 'relative_ece_reduction_equal_width.ci95[1]')))]]);
add('Table 1 row 3', '.368$\\to$.071; $-$81\\% [62, 86]', [['.368', F(b, hs('v0.2', 'uncalibrated.ece_equal_width_10'))], ['.071', F(b, hs('v0.2', 'isotonic.ece_equal_width_10'))], ['81', pct(F(b, hs('v0.2', 'relative_ece_reduction_equal_width.point')))], ['62', pct(F(b, hs('v0.2', 'relative_ece_reduction_equal_width.ci95[0]')))], ['86', pct(F(b, hs('v0.2', 'relative_ece_reduction_equal_width.ci95[1]')))]]);
const rules = (v, o) => [['fixed', F(e, `versions.${v}.committed_operating_points.baseline_rule_bm25_lt_2.ood_rejected.k`)], ['tuned', F(e, `versions.${v}.nested_tuned_baseline_threshold.ood_rejected.k`)], ['det', F(e, `versions.${v}.committed_operating_points.tuned_detector_nested.ood_rejected.k`)]].map(([_, s], i) => [o[i], s]);
add('Table 1 row 4', '4 / 10 / 7 of 15', [...rules('v0.1', ['4', '10', '7']), ['15', F(e, 'versions.v0.1.n_ood')]]);
add('Table 1 row 4', '17 / 46 / 34 of 50', [...rules('v0.2', ['17', '46', '34']), ['50', F(e, 'versions.v0.2.n_ood')]]);
for (const [v, snip, sh] of [['v0.1', '0 / 9 / 6 of 110', ['0', '9', '6', '110']], ['v0.2', '0 / 20 / 11 of 134', ['0', '20', '11', '134']]])
  add('Table 1 row 5', snip, [[sh[0], F(e, `versions.${v}.controls_excluded.false_rejected.fixed_rule`)], [sh[1], F(e, `versions.${v}.controls_excluded.false_rejected.tuned_shipped_threshold`)], [sh[2], F(e, `versions.${v}.controls_excluded.false_rejected.hybrid_detector`)], [sh[3], F(e, `versions.${v}.controls_excluded.n_non_ood`)]]);
const mp = (v, k, w) => F(e, `versions.${v}.in_sample_matched_false_rejection.${k}.${w}`);
add('Table 1 row 6', '10 / 7 at 6', [['10', mp('v0.1', 'detector_observed', 'baseline_score.ood_rejected')], ['7', mp('v0.1', 'detector_observed', 'detector_feature.ood_rejected')], ['6', mp('v0.1', 'detector_observed', 'detector_feature.false_rejected')], ['6', mp('v0.1', 'detector_observed', 'baseline_score.false_rejected')]]);
add('Table 1 row 6', '33 / 33 at 7; 43 / 37 at 15', [['33', mp('v0.2', 'five_pct', 'baseline_score.ood_rejected')], ['33', mp('v0.2', 'five_pct', 'detector_feature.ood_rejected')], ['7', mp('v0.2', 'five_pct', 'baseline_score.false_rejected')], ['7', mp('v0.2', 'five_pct', 'detector_feature.false_rejected')], ['43', mp('v0.2', 'ten_pct', 'baseline_score.ood_rejected')], ['37', mp('v0.2', 'ten_pct', 'detector_feature.ood_rejected')], ['15', mp('v0.2', 'ten_pct', 'baseline_score.false_rejected')], ['15', mp('v0.2', 'ten_pct', 'detector_feature.false_rejected')]]);
add('Table 1 row 7', '+.102 [.006, .222]', [['.102', neg(F(e, 'versions.v0.1.controls_excluded.auroc.difference_detector_minus_baseline'))], ['.006', neg(F(e, 'versions.v0.1.controls_excluded.auroc.difference_ci95[1]'))], ['.222', neg(F(e, 'versions.v0.1.controls_excluded.auroc.difference_ci95[0]'))]]);
add('Table 1 row 7', '+.067 [.015, .127]', [['.067', neg(F(e, 'versions.v0.2.controls_excluded.auroc.difference_detector_minus_baseline'))], ['.015', neg(F(e, 'versions.v0.2.controls_excluded.auroc.difference_ci95[1]'))], ['.127', neg(F(e, 'versions.v0.2.controls_excluded.auroc.difference_ci95[0]'))]]);
const t3 = 'phase1/phase1_t3_selective_ties.json', t3b = 'phase1/phase1_t3b_augrc.json';
add('Table 1 row 8', '$-$.115 [$-$.177, $-$.054]', [['-.115', F(t3, 'versions.v0.1.selective.controls_excluded.aurc_difference_hybrid_minus_baseline.point')], ['-.177', F(t3, 'versions.v0.1.selective.controls_excluded.aurc_difference_hybrid_minus_baseline.ci95[0]')], ['-.054', F(t3, 'versions.v0.1.selective.controls_excluded.aurc_difference_hybrid_minus_baseline.ci95[1]')]]);
add('Table 1 row 8', '$-$.075 [$-$.126, $-$.024]', [['-.075', F(t3, 'versions.v0.2.selective.controls_excluded.aurc_difference_hybrid_minus_baseline.point')], ['-.126', F(t3, 'versions.v0.2.selective.controls_excluded.aurc_difference_hybrid_minus_baseline.ci95[0]')], ['-.024', F(t3, 'versions.v0.2.selective.controls_excluded.aurc_difference_hybrid_minus_baseline.ci95[1]')]]);
add('Table 1 row 9', '$-$.048 [$-$.073, $-$.024]', [['-.048', F(t3b, 'versions.v0.1.controls_excluded.augrc_difference_hybrid_minus_baseline.point')], ['-.073', F(t3b, 'versions.v0.1.controls_excluded.augrc_difference_hybrid_minus_baseline.ci95[0]')], ['-.024', F(t3b, 'versions.v0.1.controls_excluded.augrc_difference_hybrid_minus_baseline.ci95[1]')]]);
add('Table 1 row 9', '$-$.030 [$-$.050, $-$.011]', [['-.030', F(t3b, 'versions.v0.2.controls_excluded.augrc_difference_hybrid_minus_baseline.point')], ['-.050', F(t3b, 'versions.v0.2.controls_excluded.augrc_difference_hybrid_minus_baseline.ci95[0]')], ['-.011', F(t3b, 'versions.v0.2.controls_excluded.augrc_difference_hybrid_minus_baseline.ci95[1]')]]);
const c = 'review_r1/review_r1_c_ranking.json';
add('Table 1 row 10', '+.099 [.008, .190]', [['.099', F(c, 'versions.v0.1.controls_excluded.difference')], ['.008', F(c, 'versions.v0.1.controls_excluded.difference_ci95[0]')], ['.190', F(c, 'versions.v0.1.controls_excluded.difference_ci95[1]')]]);
add('Table 1 row 10', '+.058 [$-$.001, .118]', [['.058', F(c, 'versions.v0.2.controls_excluded.difference')], ['-.001', F(c, 'versions.v0.2.controls_excluded.difference_ci95[0]')], ['.118', F(c, 'versions.v0.2.controls_excluded.difference_ci95[1]')]]);
const cmp = (v, k, s) => F(t1, `versions.${v}.comparisons.${k}.controls_excluded.${s}`);
const holm = (v, i) => F('stats/holm-correction-results.json', `versions.${v}[${i}].holm_p`);
add('Table 1 row 11', '+6.4 [1.8, 10.9] (.047)', [['6.4', cmp('v0.1', 'BM25_to_hybrid', 'delta_pp')], ['1.8', cmp('v0.1', 'BM25_to_hybrid', 'ci95_pp[0]')], ['10.9', cmp('v0.1', 'BM25_to_hybrid', 'ci95_pp[1]')], ['.047', holm('v0.1', 0)]]);
add('Table 1 row 11', '+4.5 [0.7, 9.0] (.070)', [['4.5', cmp('v0.2', 'BM25_to_hybrid', 'delta_pp')], ['0.7', X(g(R(t1), 'versions.v0.2.comparisons.BM25_to_hybrid.controls_excluded.ci95_pp[0]') === 0.75 ? 100 / 134 : NaN, `results/${t1} :: versions.v0.2.comparisons.BM25_to_hybrid.controls_excluded.ci95_pp[0] = 0.75 (stored at 2 dp); bootstrap differences are multiples of 100/134 pp, so the bound is 1/134 = 0.746`)], ['9.0', cmp('v0.2', 'BM25_to_hybrid', 'ci95_pp[1]')], ['.070', holm('v0.2', 0)]]);
add('Table 1 row 12', '+5.5 [0.0, 11.8] (.292)', [['5.5', cmp('v0.1', 'dense_to_hybrid', 'delta_pp')], ['0.0', cmp('v0.1', 'dense_to_hybrid', 'ci95_pp[0]')], ['11.8', cmp('v0.1', 'dense_to_hybrid', 'ci95_pp[1]')], ['.292', holm('v0.1', 1)]]);
add('Table 1 row 12', '+8.2 [2.2, 14.2] (.025)', [['8.2', cmp('v0.2', 'dense_to_hybrid', 'delta_pp')], ['2.2', cmp('v0.2', 'dense_to_hybrid', 'ci95_pp[0]')], ['14.2', cmp('v0.2', 'dense_to_hybrid', 'ci95_pp[1]')], ['.025', holm('v0.2', 1)]]);
add('Table 1 caption', '110 and 134 in-scope queries plus the 15 and 50 out-of-scope ones. No rule ever rejects a control', [['110', F(e, 'versions.v0.1.controls_excluded.n_non_ood')], ['134', F(e, 'versions.v0.2.controls_excluded.n_non_ood')], ['0', X(['v0.1', 'v0.2'].reduce((a, v) => a + Object.values(g(R(e), `versions.${v}.controls_excluded.controls_rejected`)).reduce((x, y) => x + y, 0), 0), 'sum of controls_rejected over rules and versions')]]);

// §5 shipped confidence
add('§5 shipped', 'answers 67.3\\% of all 150 v0.1 queries correctly', [['67.3', F('baseline/reproduction-summary.json', 'overall_accuracy_pct')]]);
add('§5 shipped', '(65.5\\% of the non-control in-scope ones', [['65.5', F(t1, 'versions.v0.1.accuracy.A0.controls_excluded.pct')]]);
add('§5 shipped', 'its 49 wrong answers, none of them controls, carry a mean confidence of 86\\%, and 44.9\\% of them are shown at 100\\%', [['49', X(wrong1.length, 'computed: answered wrong v0.1 queries (INCORRECT, AMBIGUOUS_INCORRECT, OOD_FALSE_ACCEPT; confidence > 0)')], ['0', X(wrong1.filter(r => D1.isCanonical(r.id)).length, 'controls among them')], ['86', X(wrong1.reduce((a, r) => a + r.actual.confidence, 0) / wrong1.length, 'mean confidence')], ['44.9', X(100 * wrong1.filter(r => r.actual.confidence === 100).length / wrong1.length, 'share at 100')]]);
add('§5 shipped', 'Its ECE (0.323 on v0.1, 0.293 on v0.2, controls excluded) is five to six times the noise floor', [['0.323', F(b, bs('v0.1', 'uncalibrated.ece_equal_width_10'))], ['0.293', F(b, bs('v0.2', 'uncalibrated.ece_equal_width_10'))], ['5', X(g(R(b), bs('v0.1', 'uncalibrated.ece_equal_width_10')) / g(R(b), bs('v0.1', 'noise_floor_perfectly_calibrated.equal_width_10.mean')), 'ratio ECE / noise-floor mean, v0.1 (shown as "five")')], ['6', X(g(R(b), bs('v0.2', 'uncalibrated.ece_equal_width_10')) / g(R(b), bs('v0.2', 'noise_floor_perfectly_calibrated.equal_width_10.mean')), 'ratio, v0.2 (shown as "six")')]]);
add('§5 shipped', '(0.064 and 0.050)', [['0.064', F(b, bs('v0.1', 'noise_floor_perfectly_calibrated.equal_width_10.mean'))], ['0.050', F(b, bs('v0.2', 'noise_floor_perfectly_calibrated.equal_width_10.mean'))]]);
add('§5 shipped', '(skill $-0.23$ and $-0.06$, intervals including zero)', [['-0.23', F(b, bs('v0.1', 'brier_skill_vs_no_skill.uncalibrated.point'))], ['-0.06', F(b, bs('v0.2', 'brier_skill_vs_no_skill.uncalibrated.point'))]]);
// §5 recalibration
add('§5 recalibration', 'confidence\'s ECE to 0.069 on v0.1 and 0.063 on v0.2, reductions of 79\\% and 78\\%', [['0.069', F(b, bs('v0.1', 'isotonic.ece_equal_width_10'))], ['0.063', F(b, bs('v0.2', 'isotonic.ece_equal_width_10'))]]);
add('§5 recalibration', "within the noise floor's 95th percentile (0.105 and 0.080)", [['0.105', F(b, bs('v0.1', 'noise_floor_perfectly_calibrated.equal_width_10.p95'))], ['0.080', F(b, bs('v0.2', 'noise_floor_perfectly_calibrated.equal_width_10.p95'))]]);
add('§5 recalibration', 'Equal-mass bins give 0.110 and 0.070 (noise-floor 95th percentiles 0.122 and 0.092) and the bin-count sweep 0.060 and 0.047; before recalibration all three estimators give the same 0.323 and 0.293', [['0.110', F(b, bs('v0.1', 'isotonic.ece_equal_mass_10'))], ['0.070', F(b, bs('v0.2', 'isotonic.ece_equal_mass_10'))], ['0.122', F(b, bs('v0.1', 'noise_floor_perfectly_calibrated.equal_mass_10.p95'))], ['0.092', F(b, bs('v0.2', 'noise_floor_perfectly_calibrated.equal_mass_10.p95'))], ['0.060', F(b, bs('v0.1', 'isotonic.ece_sweep'))], ['0.047', F(b, bs('v0.2', 'isotonic.ece_sweep'))], ['0.323', F(b, bs('v0.1', 'uncalibrated.ece_equal_mass_10'))], ['0.323', F(b, bs('v0.1', 'uncalibrated.ece_sweep'))], ['0.293', F(b, bs('v0.2', 'uncalibrated.ece_equal_mass_10'))], ['0.293', F(b, bs('v0.2', 'uncalibrated.ece_sweep'))]]);
add('§5 recalibration', 'Brier skill becomes positive (0.20 and 0.33', [['0.20', F(b, bs('v0.1', 'brier_skill_vs_no_skill.isotonic.point'))], ['0.33', F(b, bs('v0.2', 'brier_skill_vs_no_skill.isotonic.point'))]]);
const t4 = 'phase1/phase1_t4_calibration_comparators.json', m4 = (v, m, s) => F(t4, `versions.${v}.baseline_confidence.controls_excluded.methods.${m}.${s}`);
add('§5 recalibration', '(v0.1: 0.087 and 0.101; v0.2: 0.045 and 0.039)', [['0.087', m4('v0.1', 'platt', 'ece')], ['0.101', m4('v0.1', 'histogram_binning', 'ece')], ['0.045', m4('v0.2', 'platt', 'ece')], ['0.039', m4('v0.2', 'histogram_binning', 'ece')]]);
add('§5 recalibration', 'it has the worst Brier score of the three in every case', [['1', X(['v0.1', 'v0.2'].every(v => ['baseline_confidence', 'hybrid_reliability'].every(s => { const m = g(R(t4), `versions.${v}.${s}.controls_excluded.methods`); return m.histogram_binning.brier >= Math.max(m.isotonic.brier, m.platt.brier); })) ? 1 : 0, 'check: histogram_binning Brier is the largest of the three calibrators, both confidences, both versions (1 = true)')]]);
add('§5 recalibration', 'Brier skill is $-0.32$ and $-0.30$, both intervals excluding zero', [['-0.32', F(b, hs('v0.1', 'brier_skill_vs_no_skill.uncalibrated.point'))], ['-0.30', F(b, hs('v0.2', 'brier_skill_vs_no_skill.uncalibrated.point'))], ['-0.11', F(b, hs('v0.1', 'brier_skill_vs_no_skill.uncalibrated.ci95[1]'))], ['-0.10', F(b, hs('v0.2', 'brier_skill_vs_no_skill.uncalibrated.ci95[1]'))]], 'upper interval ends shown here only as "excluding zero"');
add('§5 recalibration', "(0.089) and within it on v0.2 (0.079)", [['0.089', F(b, hs('v0.1', 'noise_floor_perfectly_calibrated.equal_width_10.p95'))], ['0.079', F(b, hs('v0.2', 'noise_floor_perfectly_calibrated.equal_width_10.p95'))]]);
add('§5 recalibration', 'equal-mass bins give 0.108 and 0.058 and the sweep 0.055 and 0.071', [['0.108', F(b, hs('v0.1', 'isotonic.ece_equal_mass_10'))], ['0.058', F(b, hs('v0.2', 'isotonic.ece_equal_mass_10'))], ['0.055', F(b, hs('v0.1', 'isotonic.ece_sweep'))], ['0.071', F(b, hs('v0.2', 'isotonic.ece_sweep'))]]);
add('§5 recalibration', '(shipped, v0.1: 0.742 to 0.686)', [['0.742', m4('v0.1', 'none', 'correctness_auroc')], ['0.686', m4('v0.1', 'isotonic', 'correctness_auroc')]]);

// §5 out-of-scope
add('§5 OOD', 'Holm-adjusted $p=0.00006$), at a cost of 11 false rejections among 134 in-scope queries, three of', [['0.00006', holm('v0.2', 2)], ['11', F(e, 'versions.v0.2.controls_excluded.false_rejected.hybrid_detector')], ['134', F(e, 'versions.v0.2.controls_excluded.n_non_ood')], ['3', F('phase1/phase1_t2_ood_breakdown.json', 'versions.v0.2.false_rejections.of_which_hybrid_was_correct')]]);
add('§5 OOD', '(pooled AUROC 0.956 vs.\\ 0.889 on v0.2, 0.939 vs.\\ 0.837 on v0.1)', [['0.956', F(e, 'versions.v0.2.controls_excluded.auroc.baseline_raw_bm25')], ['0.889', F(e, 'versions.v0.2.controls_excluded.auroc.detector_fused_top1')], ['0.939', F(e, 'versions.v0.1.controls_excluded.auroc.baseline_raw_bm25')], ['0.837', F(e, 'versions.v0.1.controls_excluded.auroc.detector_fused_top1')]]);
add('§5 OOD', '(McNemar $p=0.004$ against the detector) at 20 false rejections ($p=0.093$)', [['0.004', F(e, 'versions.v0.2.nested_tuned_baseline_threshold.versus_tuned_detector.on_ood_detector_vs_tuned_baseline.exact_mcnemar_p')], ['20', F(e, 'versions.v0.2.nested_tuned_baseline_threshold.false_rejected.k')], ['0.093', F(e, 'versions.v0.2.nested_tuned_baseline_threshold.versus_tuned_detector.on_non_ood_false_rejections_detector_vs_tuned_baseline.exact_mcnemar_p')]]);
add('§5 OOD', 'detector 7 ($p=0.25$), at 9 and 6 false rejections', [['0.25', F(e, 'versions.v0.1.nested_tuned_baseline_threshold.versus_tuned_detector.on_ood_detector_vs_tuned_baseline.exact_mcnemar_p')], ['9', F(e, 'versions.v0.1.nested_tuned_baseline_threshold.false_rejected.k')], ['6', F(e, 'versions.v0.1.committed_operating_points.tuned_detector_nested.false_rejected.k')]]);
add('§5 OOD', 'reject 23 and 21 of 50 with no false rejections, 33 and 33 at 7, and 43 and 37 at 15 (v0.1: 5 and 1 at none, 10 and 7 at 6); no control is among these', [['23', mp('v0.2', 'zero', 'baseline_score.ood_rejected')], ['21', mp('v0.2', 'zero', 'detector_feature.ood_rejected')], ['5', mp('v0.1', 'zero', 'baseline_score.ood_rejected')], ['1', mp('v0.1', 'zero', 'detector_feature.ood_rejected')], ['0', X(['v0.1', 'v0.2'].reduce((a, v) => a + Object.values(g(R(e), `versions.${v}.in_sample_matched_false_rejection`)).reduce((x, m) => x + m.baseline_score.controls_among_false_rejected + m.detector_feature.controls_among_false_rejected, 0), 0), 'sum of controls_among_false_rejected')]]);
const kind = (k, r) => F(e, `versions.v0.2.rejections_by_kind.${k}.${r}`);
const three = k => [['fixed_rule', 0], ['tuned_shipped_threshold', 1], ['hybrid_detector', 2]].map(([r]) => kind(k, r));
{ const n = three('non_terminal'); add('§5 kinds', 'reject 14, 34 and 25 of 34 everyday non-computing requests', [['14', n[0]], ['34', n[1]], ['25', n[2]], ['34', kind('non_terminal', 'n')]]); }
{ const n = three('far_ood'); add('§5 kinds', '3, 4 and 4 of 5 far-from-corpus computing tasks', [['3', n[0]], ['4', n[1]], ['4', n[2]], ['5', kind('far_ood', 'n')]]); }
{ const n = three('nonsensical'); add('§5 kinds', '0, 1 and 1 of the one nonsensical request', [['0', n[0]], ['1', n[1]], ['1', n[2]]]); }
{ const s = r => X(g(R(e), `versions.v0.2.rejections_by_kind.unsupported_tool_ood.${r}`) + g(R(e), `versions.v0.2.rejections_by_kind.near_ood.${r}`), `rejections_by_kind unsupported_tool_ood + near_ood .${r}`);
  add('§5 kinds', '0, 7 and 4 of the 10 terminal tasks', [['0', s('fixed_rule')], ['7', s('tuned_shipped_threshold')], ['4', s('hybrid_detector')], ['10', s('n')]]); }
const thr = f => R(f).ood_detection.per_fold.map(x => x.selected_threshold);
add('§5 OOD; App. A', 'tuned shipped thresholds (6.50--7.20)', [['6.50', X(Math.min(...g(R(e), 'versions.v0.2.nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25')), 'min per_fold_thresholds_raw_bm25, v0.2')], ['7.20', X(Math.max(...g(R(e), 'versions.v0.2.nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25')), 'max, v0.2')]]);
add('§5 OOD; App. A', "hybrid's thresholds (0.884--0.925)", [['0.884', X(Math.min(...thr('v0.2/selective-prediction-results.json')), 'min ood_detection.per_fold selected_threshold, v0.2')], ['0.925', X(Math.max(...thr('v0.2/selective-prediction-results.json')), 'max')]]);
add('§5 OOD', 'the three rules reject 4, 12 and 9 in this v0.2 run (4, 10 and 7 in the v0.1 run', [['4', F(e, 'versions.v0.2.rejections_by_source.original_v0_1_items.fixed_rule')], ['12', F(e, 'versions.v0.2.rejections_by_source.original_v0_1_items.tuned_shipped_threshold')], ['9', F(e, 'versions.v0.2.rejections_by_source.original_v0_1_items.hybrid_detector')], ['4', F(e, 'versions.v0.1.rejections_by_source.original_v0_1_items.fixed_rule')], ['10', F(e, 'versions.v0.1.rejections_by_source.original_v0_1_items.tuned_shipped_threshold')], ['7', F(e, 'versions.v0.1.rejections_by_source.original_v0_1_items.hybrid_detector')]]);
add('§5 OOD', 'on the 35 added ones, 13, 34 and 25', [['13', F(e, 'versions.v0.2.rejections_by_source.added_v0_2_items.fixed_rule')], ['34', F(e, 'versions.v0.2.rejections_by_source.added_v0_2_items.tuned_shipped_threshold')], ['25', F(e, 'versions.v0.2.rejections_by_source.added_v0_2_items.hybrid_detector')]]);
add('§5 OOD', '$p=0.25$ in the v0.1 run and $p=0.0625$ in the v0.2 run', [['0.25', F('stats/holm-correction-results.json', 'versions.v0.1[2].p')], ['0.0625', X(C.exactMcNemar(0, g(R(e), 'versions.v0.2.rejections_by_source.original_v0_1_items.hybrid_detector') - g(R(e), 'versions.v0.2.rejections_by_source.original_v0_1_items.fixed_rule')), 'exact McNemar on the 15 in the v0.2 run: detector-only rejections 9 - 4 = 5, fixed-only 0 (the fixed rule\'s rejections are a subset; see review_r1_a)')]]);

// §5 hybrid
add('§5 hybrid', 'expected error on all 150 v0.1 queries is 8.3\\% (0--10.7\\%', [['8.3', pct(F(t3, 'versions.v0.1.selective.all.hybrid.expected_risk.cov50'))], ['0', pct(F(t3, 'versions.v0.1.selective.all.hybrid.cov50_best_worst_over_tie_orders.best'))], ['10.7', pct(F(t3, 'versions.v0.1.selective.all.hybrid.cov50_best_worst_over_tie_orders.worst'))]]);
add('§5 hybrid', 'gains 6.4 points on v0.1 (exact $p=0.0156$, Holm-adjusted 0.047) and 4.5 on v0.2 ($p=0.070$), resting on 7 and 8', [['6.4', cmp('v0.1', 'BM25_to_hybrid', 'delta_pp')], ['0.0156', cmp('v0.1', 'BM25_to_hybrid', 'exact_mcnemar_p')], ['0.047', holm('v0.1', 0)], ['4.5', cmp('v0.2', 'BM25_to_hybrid', 'delta_pp')], ['0.070', cmp('v0.2', 'BM25_to_hybrid', 'exact_mcnemar_p')], ['7', X(g(R(t1), 'versions.v0.1.comparisons.BM25_to_hybrid.controls_excluded.a_only_correct') + g(R(t1), 'versions.v0.1.comparisons.BM25_to_hybrid.controls_excluded.b_only_correct'), 'discordant pairs v0.1')], ['8', X(g(R(t1), 'versions.v0.2.comparisons.BM25_to_hybrid.controls_excluded.a_only_correct') + g(R(t1), 'versions.v0.2.comparisons.BM25_to_hybrid.controls_excluded.b_only_correct'), 'discordant pairs v0.2')]]);
// Table 2
for (const [sys, A] of [['BM25 (shipped)', 'A0'], ['Dense', 'A2'], ['Hybrid', 'A3']]) {
  const a = v => g(R(t1), `versions.${v}.accuracy.${A}.controls_excluded`);
  const s = `${a('v0.1').hits}/${a('v0.1').n} (${a('v0.1').pct.toFixed(1)}) & ${a('v0.2').hits}/${a('v0.2').n} (${a('v0.2').pct.toFixed(1)})`;
  const shown = (tex.match(new RegExp(sys.replace(/[()]/g, '\\$&') + '\\s*& ([^\\\\]+)')) || [])[1] || '';
  const nums = shown.match(/\d+(\.\d+)?/g) || [];
  add('Table 2 ' + sys, shown.trim(), nums.map((n, i) => [n, X([a('v0.1').hits, a('v0.1').n, a('v0.1').pct, a('v0.2').hits, a('v0.2').n, a('v0.2').pct][i], `results/${t1} :: versions.v0.x.accuracy.${A}.controls_excluded (expected "${s}")`)]));
}
// §5 risky + Table 3
const d = 'review_r1/review_r1_d_risk.json';
add('§5 risky', 'blocks 3 of its 6 such answers on v0.2', [['3', X(a5Guard ? risky6.filter(id => !a5Accepts(id)).length : NaN, 'computed: A5 per-fold margin/OOD thresholds (results/v0.2/ablation-results.json, per-fold accepted counts reproduced) applied to the 6 wrong-and-risky hybrid answers of review_r1_d')], ['6', F(d, 'versions.v0.2.hybrid.wrong_and_risky.n')]]);
const t5 = 'phase1/phase1_t5_safety_recount.json';
add('§5 risky', '125 in v0.1): it flags 19 of 20 high- or critical-risk commands', [['125', F(t5, 'versions.v0.1.gold_commands.n')], ['19', X(20 - g(R(t5), 'versions.v0.1.gold_commands.dangerous_direction_misses_spec.k'), '20 minus misses')], ['20', F(t5, 'versions.v0.1.gold_commands.dangerous_direction_misses_spec.n')]]);
add('§5 risky', '(1/20, Wilson 95\\% CI [0.9, 23.6]\\%); v0.2 adds two misses that trace to inconsistent labels (3/22)', [['1', F(t5, 'versions.v0.1.gold_commands.dangerous_direction_misses_spec.k')], ['0.9', pct(F(t5, 'versions.v0.1.gold_commands.dangerous_direction_misses_spec.lo'))], ['23.6', pct(F(t5, 'versions.v0.1.gold_commands.dangerous_direction_misses_spec.hi'))], ['3', F(t5, 'versions.v0.2.gold_commands.dangerous_direction_misses_spec.k')], ['22', F(t5, 'versions.v0.2.gold_commands.dangerous_direction_misses_spec.n')]]);
add('§5 risky', 'all gold commands and 14 of 15 hybrid answers exited successfully', [['15', F('functional/functional-eval-results.json', 'summary.n_evaluated')], ['14', X(Math.round(g(R('functional/functional-eval-results.json'), 'summary.retrieved_functional_success_rate') * 15), 'retrieved_functional_success_rate x 15')], ['1', F('functional/functional-eval-results.json', 'summary.gold_functional_success_rate')]], 'gold success rate 1 = "all gold commands"');
for (const [v, col] of [['v0.1', 0], ['v0.2', 2]]) for (const [s, k] of [['baseline', 0], ['hybrid', 1]]) {
  const x = g(R(d), `versions.${v}.${s}`);
  add(`Table 3 ${v} ${s}`, 'Answered & 121 & 125 & 167 & 184', [[['121', '125', '167', '184'][col + k], X(x.controls_excluded.answered, `results/${d} :: versions.${v}.${s}.controls_excluded.answered`)]]);
  add(`Table 3 ${v} ${s}`, 'High/critical returned & 20 & 23 & 21 & 26', [[['20', '23', '21', '26'][col + k], X(x.controls_excluded.risky_returned_commands, `...controls_excluded.risky_returned_commands`)]]);
  add(`Table 3 ${v} ${s}`, 'of which wrong & 2 & 3 & 2 & 6', [[['2', '3', '2', '6'][col + k], X(x.controls_excluded.of_which_wrong, `...controls_excluded.of_which_wrong`)]]);
  add(`Table 3 ${v} ${s}`, 'at max.\\ conf. & 1 & 1 & 1 & 1', [['1', X(x.wrong_and_risky.in_top_confidence_band, `...wrong_and_risky.in_top_confidence_band`)]]);
}
add('Table 3 caption', 'non-control queries (125 and 184, out-of-scope requests included', [['125', F(d, 'versions.v0.1.hybrid.controls_excluded.answered')], ['184', F(d, 'versions.v0.2.hybrid.controls_excluded.answered')]]);

// Appendix A
const al = f => R(f).aggregate.selected_alpha_per_fold.join(', ');
add('App. A alpha', 'Selected: v0.1 0.3, 0.3, 0.3, 0.3, 0.5; v0.2 0.5 in every fold', [['0.3, 0.3, 0.3, 0.3, 0.5', X(al('hybrid/hybrid-nested-cv-results.json'), 'results/hybrid/hybrid-nested-cv-results.json per_fold selected_alpha')], ['0.5, 0.5, 0.5, 0.5, 0.5', X(al('v0.2/hybrid-nested-cv-results.json'), 'results/v0.2/hybrid-nested-cv-results.json per_fold selected_alpha ("0.5 in every fold")')]]);
add('App. A detector', '(v0.1 0.833--0.895; v0.2 0.884--0.925)', [['0.833', X(Math.min(...thr('reliability/selective-prediction-results.json')), 'min v0.1 selected_threshold')], ['0.895', X(Math.max(...thr('reliability/selective-prediction-results.json')), 'max v0.1')]]);
add('App. A tuned', '(v0.1 5.42--6.19; v0.2 6.50--7.20)', [['5.42', X(Math.min(...g(R(e), 'versions.v0.1.nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25')), 'min v0.1')], ['6.19', X(Math.max(...g(R(e), 'versions.v0.1.nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25')), 'max v0.1')]]);
// Appendix B Holm table
const H = (v, i, k) => F('stats/holm-correction-results.json', `versions.${v}[${i}].${k}`);
add('Table 5', 'v0.1 & Acc., hybrid vs. BM25 & 0.0156 & 0.0469', [['0.0156', H('v0.1', 0, 'p')], ['0.0469', H('v0.1', 0, 'holm_p')]]);
add('Table 5', 'v0.1 & Acc., hybrid vs. dense & 0.1460 & 0.2920', [['0.1460', H('v0.1', 1, 'p')], ['0.2920', H('v0.1', 1, 'holm_p')]]);
add('Table 5', 'fixed & 0.25 & 0.2920', [['0.25', H('v0.1', 2, 'p')], ['0.2920', H('v0.1', 2, 'holm_p')]]);
add('Table 5', 'v0.2 & Acc., hybrid vs. BM25 & 0.0703 & 0.0703', [['0.0703', H('v0.2', 0, 'p')], ['0.0703', H('v0.2', 0, 'holm_p')]]);
add('Table 5', 'v0.2 & Acc., hybrid vs. dense & 0.0127 & 0.0255', [['0.0127', H('v0.2', 1, 'p')], ['0.0255', H('v0.2', 1, 'holm_p')]]);
add('Table 5', 'fixed & 0.000015 & 0.00006', [['0.000015', H('v0.2', 2, 'p')], ['0.00006', H('v0.2', 2, 'holm_p')]]);
add('Table 5', '$\\leq$0.0001 & $\\leq$0.0004', [['0.0001', H('v0.1', 3, 'p')], ['0.0004', H('v0.1', 3, 'holm_p')]]);
add('Table 5', '$\\leq$0.0001 & $\\leq$0.0003', [['0.0001', H('v0.2', 3, 'p')], ['0.0003', H('v0.2', 3, 'holm_p')]]);
// Appendix B sensitivity text
const sens = R('stats/sensitivity-bare-keyword-results.json').versions;
const S = (vi, sub, k) => g(sens[vi], `subsets.${sub}.${k}`);
const bmGain = []; sens.forEach(v => Object.entries(v.subsets).forEach(([k, s]) => { if (k !== 'ALL' && s.A0_vs_A3) bmGain.push(s.A0_vs_A3.delta_pp); }));
add('App. B sensitivity', 'leaves the BM25-to-hybrid gain at $+4.9$ to $+5.8$ points, each subset 7--0 in discordant queries', [['4.9', X(Math.min(...bmGain), 'min A0_vs_A3.delta_pp over the bare-keyword-drop subsets, stats/sensitivity-bare-keyword-results.json')], ['5.8', X(Math.max(...bmGain), 'max')]]);
add('App. B sensitivity', 'falls to raw $p=0.057$ without the new bare-keyword queries and $p=0.227$ on answerable queries only', [['0.057', X(S(1, 'DROP_NEW_BK', 'A2_vs_A3').exact_mcnemar_p, 'v0.2 DROP_NEW_BK A2_vs_A3.exact_mcnemar_p')], ['0.227', X(S(1, 'ANSWERABLE', 'A2_vs_A3').exact_mcnemar_p, 'v0.2 ANSWERABLE A2_vs_A3.exact_mcnemar_p')]]);
// Split B
const sb1 = R('v0.1/split-b-results.json'), sb2 = R('v0.2/split-b-results.json');
add('App. B Split B', '(171 groups on v0.2, 125 on v0.1; none split across folds)', [['171', X(sb2.group_count, 'results/v0.2/split-b-results.json group_count')], ['125', X(sb1.group_count, 'results/v0.1/split-b-results.json group_count')], ['0', X(sb1.groups_split_across_folds + sb2.groups_split_across_folds, 'groups_split_across_folds, both')]]);
add('Table 7', 'v0.1 & OOD AUROC & 0.867 & 0.849', [['0.849', X(sb1.splitB.ood_detection.mean_auroc, 'v0.1 splitB.ood_detection.mean_auroc')], ['0.867', X(sb1.splitA ? sb1.splitA.ood_detection.mean_auroc : R('reliability/selective-prediction-results.json').ood_detection.mean_test_auroc, 'v0.1 Split A mean OOD AUROC over folds')]]);
add('Table 7', 'v0.1 & Ambig. F1 & 0.310 & 0.300', [['0.300', X(sb1.splitB.ambiguity_detection.f1, 'v0.1 splitB ambiguity f1')], ['0.310', X(R('reliability/selective-prediction-results.json').ambiguity_detection.pooled_f1, 'v0.1 Split A pooled ambiguity f1')]]);
add('Table 7', 'v0.2 & OOD AUROC & 0.901 & 0.898', [['0.898', X(sb2.splitB.ood_detection.mean_auroc, 'v0.2 splitB mean OOD AUROC')], ['0.901', X(R('v0.2/selective-prediction-results.json').ood_detection.mean_test_auroc, 'v0.2 Split A mean OOD AUROC over folds')]]);
add('Table 7', 'v0.2 & Ambig. F1 & 0.496 & 0.479', [['0.479', X(sb2.splitB.ambiguity_detection.f1, 'v0.2 splitB ambiguity f1')], ['0.496', X(R('v0.2/selective-prediction-results.json').ambiguity_detection.pooled_f1, 'v0.2 Split A pooled ambiguity f1')]]);
add('Table 7', 'v0.1 & Non-OOD acc. & 104/135 & 104/135', [['104', X(Math.round(sb1.splitB.hybrid_non_ood_accuracy * 135), 'v0.1 splitB hybrid_non_ood_accuracy x 135')], ['104', F(t1, 'versions.v0.1.accuracy.A3.all.hits')]]);
add('Table 7', 'v0.2 & Non-OOD acc. & 126/159 & 126/159', [['126', X(Math.round(sb2.splitB.hybrid_non_ood_accuracy * 159), 'v0.2 splitB hybrid_non_ood_accuracy x 159')], ['126', F(t1, 'versions.v0.2.accuracy.A3.all.hits')]]);
// ambiguity and ablation
add('App. B ambiguity', 'F1 0.31 (v0.1) and 0.50 (v0.2), AUROC 0.78 and 0.72', [['0.31', X(R('reliability/selective-prediction-results.json').ambiguity_detection.pooled_f1, 'v0.1 pooled f1')], ['0.50', X(R('v0.2/selective-prediction-results.json').ambiguity_detection.pooled_f1, 'v0.2 pooled f1')], ['0.78', X(S(0, 'ALL', 'ambiguity_auroc_mean_over_folds'), 'v0.1 ambiguity AUROC mean over folds')], ['0.72', X(S(1, 'ALL', 'ambiguity_auroc_mean_over_folds'), 'v0.2')]]);
add('App. B ablation', 'raises selective accuracy to 90.1\\% at 69.5\\% coverage on v0.1, but A5 is lower on v0.2 (82.2\\% at 58.9\\%)', [['90.1', pct(F('ablation/ablation-results.json', 'conditions.A5.mean_selective_accuracy'))], ['69.5', pct(F('ablation/ablation-results.json', 'conditions.A5.mean_coverage'))], ['82.2', pct(F('v0.2/ablation-results.json', 'conditions.A5.mean_selective_accuracy'))], ['58.9', pct(F('v0.2/ablation-results.json', 'conditions.A5.mean_coverage'))]]);

// coverage additions (numbers found untraced by a coverage scan of content.tex)
for (const [v, sb, row] of [['v0.1', sb1, '.274$\\to$.054 & .274$\\to$.065 & $+$0.011'], ['v0.2', sb2, '.324$\\to$.074 & .324$\\to$.101 & $+$0.027']]) {
  const f = `results/${v}/split-b-results.json`;
  const sh = row.replace(/\$[^$]*\$/g, ' ').match(/[\d.]+/g);
  add('Table 7 ' + v + ' ECE', row, [[sh[0], X(sb.splitA_reference.calibration_ece_before, f + ' :: splitA_reference.calibration_ece_before')], [sh[1], X(sb.splitA_reference.calibration_ece_after, '...splitA_reference.calibration_ece_after')], [sh[2], X(sb.splitB.calibration_ece_before, '...splitB.calibration_ece_before')], [sh[3], X(sb.splitB.calibration_ece_after, '...splitB.calibration_ece_after')], [sh[4], X(+(+sb.splitB.calibration_ece_after.toFixed(3) - +sb.splitA_reference.calibration_ece_after.toFixed(3)).toFixed(3), `difference of the two displayed after-ECE cells (generalization_delta.calibration_ece_after = ${sb.generalization_delta.calibration_ece_after}, a rounding tie on v0.2)`)]]);
}
add('Table 7 deltas', 'v0.1 & OOD AUROC & 0.867 & 0.849 & $-$0.018', [['-0.018', X(sb1.generalization_delta.ood_auroc, 'results/v0.1/split-b-results.json :: generalization_delta.ood_auroc')]]);
add('Table 7 deltas', 'v0.1 & Ambig. F1 & 0.310 & 0.300 & $-$0.010', [['-0.010', X(sb1.splitB.ambiguity_detection.f1 - sb1.splitA_reference.ambiguity_f1, 'splitB.ambiguity_detection.f1 - splitA_reference.ambiguity_f1')]]);
add('Table 7 deltas', 'v0.2 & OOD AUROC & 0.901 & 0.898 & $-$0.003', [['-0.003', X(sb2.generalization_delta.ood_auroc, 'results/v0.2/split-b-results.json :: generalization_delta.ood_auroc')]]);
add('Table 7 deltas', 'v0.2 & Ambig. F1 & 0.496 & 0.479 & $-$0.017', [['-0.017', X(sb2.splitB.ambiguity_detection.f1 - sb2.splitA_reference.ambiguity_f1, 'splitB.ambiguity_detection.f1 - splitA_reference.ambiguity_f1')]]);
add('App. B Split B text', 'its values (0.867, 0.901) differ', [['0.867', X(sb1.splitA_reference.ood_auroc, 'results/v0.1/split-b-results.json :: splitA_reference.ood_auroc')], ['0.901', X(sb2.splitA_reference.ood_auroc, 'results/v0.2/split-b-results.json :: splitA_reference.ood_auroc')]]);
add('§5 hybrid', 'depends on three bare-keyword queries', [['3', X(S(1, 'ALL', 'A2_vs_A3').b_only_correct - S(1, 'DROP_NEW_BK', 'A2_vs_A3').b_only_correct, 'v0.2 hybrid-only-correct vs dense: ALL 14 minus DROP_NEW_BK 11 (stats/sensitivity-bare-keyword-results.json)')]]);
add('§5 recalibration', 'after recalibration its ECE falls from 0.329 to 0.108 and from 0.368 to 0.071', [['0.329', F(b, hs('v0.1', 'uncalibrated.ece_equal_width_10'))], ['0.108', F(b, hs('v0.1', 'isotonic.ece_equal_width_10'))], ['0.368', F(b, hs('v0.2', 'uncalibrated.ece_equal_width_10'))], ['0.071', F(b, hs('v0.2', 'isotonic.ece_equal_width_10'))]]);
add('Fig. accuracy caption', '$n=135$ and $159$, including the 25 canonical controls', [['135', F(t1, 'versions.v0.1.accuracy.A3.all.n')], ['159', F(t1, 'versions.v0.2.accuracy.A3.all.n')], ['25', F(t1, 'versions.v0.1.accuracy.A3.controls_hits.n')]]);
{ const sk = D => D.ids.filter(id => D.qById.get(id).query_type === 'single_keyword');
  const hits = D => sk(D).filter(id => D.variants.baseline_confidence.hitOf.get(id) === 1 || D.variants.hybrid_reliability.hitOf.get(id) === 1).length;
  add('Fig. by-type caption', 'Single-keyword queries are 0\\% for both systems', [['0', X(100 * (hits(D1) + hits(D2)) / (sk(D1).length + sk(D2).length), 'computed: hits by baseline or hybrid among query_type single_keyword, both versions')]]); }
{ const pq = f => R(f).conditions; const diffs = f => { const a0 = new Map(pq(f).A0.per_query.map(r => [r.id, r.command])); return pq(f).A1.per_query.filter(r => a0.get(r.id) !== r.command).length; };
  add('App. B ablation', 'Removing the substring bonus changes no top-1 answer on v0.1 and one on v0.2', [['0', X(diffs('ablation/ablation-results.json'), 'computed: A1 vs A0 per_query command differences, results/ablation/ablation-results.json')], ['1', X(diffs('v0.2/ablation-results.json'), 'same, results/v0.2/ablation-results.json (TA-B187, wrong under both)')]], 'round 1-3 drafts said "no top-1 answer on either version"; corrected by this trace (T15)');
  const acc = f => ['A0', 'A1'].map(k => pq(f)[k].per_query.filter(r => r.hit).length);
  add('App. B ablation', 'so accuracy is unchanged', [['0', X(['ablation/ablation-results.json', 'v0.2/ablation-results.json'].reduce((s, f) => { const [a, b1] = acc(f); return s + Math.abs(a - b1); }, 0), 'A0 minus A1 hit counts, both versions')]]); }

// S11 seed-repeat, S6 test choice, REV-10 figure (approved 2026-09-29)
{ const sr = R('seed_repeat/seed_repeat_cv.json').versions, S1 = sr['v0.1'].summary, S2 = sr['v0.2'].summary, src = k => 'results/seed_repeat/seed_repeat_cv.json :: versions.v0.x.summary.' + k;
  const k_ = s => +s.split('/')[0];
  add('§5 recalibration', 'across 20 partitions the reduction is at least 45\\% and 63\\%, but the recalibrated ECE is within that percentile on only 18 and 13 of them', [['20', X(sr['v0.1'].per_seed.length, 'number of seeds')], ['45', X(100 * S1.shipped_reduction.min, src('shipped_reduction.min') + ' v0.1')], ['63', X(100 * S2.shipped_reduction.min, src('shipped_reduction.min') + ' v0.2')], ['18', X(k_(S1.seeds_shipped_within_floor_p95), src('seeds_shipped_within_floor_p95') + ' v0.1')], ['13', X(k_(S2.seeds_shipped_within_floor_p95), src('seeds_shipped_within_floor_p95') + ' v0.2')]]);
  add('App. B folds', 'rejects more out-of-scope requests than the detector on 19 (v0.1) and 20 (v0.2) of 20 partitions (v0.2: 41--46 vs.\\ 33--35 of 50, at 17--23 vs.\\ 11--14 false rejections; McNemar $p<0.05$ on 16)', [['19', X(k_(S1.seeds_tuned_rejects_more_ood_than_detector), src('seeds_tuned_rejects_more_ood_than_detector') + ' v0.1')], ['20', X(k_(S2.seeds_tuned_rejects_more_ood_than_detector), 'same, v0.2')], ['41', X(S2.ood_tuned.min, src('ood_tuned.min'))], ['46', X(S2.ood_tuned.max, src('ood_tuned.max'))], ['33', X(S2.ood_detector.min, src('ood_detector.min'))], ['35', X(S2.ood_detector.max, src('ood_detector.max'))], ['17', X(S2.fr_tuned.min, src('fr_tuned.min'))], ['23', X(S2.fr_tuned.max, src('fr_tuned.max'))], ['11', X(S2.fr_detector.min, src('fr_detector.min'))], ['14', X(S2.fr_detector.max, src('fr_detector.max'))], ['16', X(k_(S2.seeds_tuned_vs_detector_p_lt_05), src('seeds_tuned_vs_detector_p_lt_05'))]]);
  add('App. B folds', 'with $p<0.05$ on all 20 v0.2 partitions and on none of v0.1', [['20', X(k_(S2.seeds_detector_vs_fixed_p_lt_05), src('seeds_detector_vs_fixed_p_lt_05') + ' v0.2')], ['0', X(k_(S1.seeds_detector_vs_fixed_p_lt_05), 'same, v0.1')]]);
  add('App. B folds', 'The ranking result holds on all 20 partitions of both versions', [['20', X(Math.min(...[S1, S2].flatMap(S => [S.seeds_aurc_diff_negative, S.seeds_augrc_diff_negative, S.seeds_corr_auroc_diff_positive].map(k_))), 'min over versions of seeds_aurc_diff_negative, seeds_augrc_diff_negative, seeds_corr_auroc_diff_positive')]]);
  add('App. B folds', '(v0.1: 45--91\\%, median 82\\%; v0.2: 63--88\\%, median 78\\%)', [['45', X(100 * S1.shipped_reduction.min, 'v0.1 min')], ['91', X(100 * S1.shipped_reduction.max, 'v0.1 max')], ['82', X(100 * S1.shipped_reduction.median, 'v0.1 median')], ['63', X(100 * S2.shipped_reduction.min, 'v0.2 min')], ['88', X(100 * S2.shipped_reduction.max, 'v0.2 max')], ['78', X(100 * S2.shipped_reduction.median, 'v0.2 median')]]);
  add('App. B folds', 'on only 18 (v0.1) and 13 (v0.2) of 20 partitions, and the hybrid\'s on 9 and 11', [['18', X(k_(S1.seeds_shipped_within_floor_p95), 'v0.1')], ['13', X(k_(S2.seeds_shipped_within_floor_p95), 'v0.2')], ['9', X(k_(S1.seeds_hybrid_within_floor_p95), 'hybrid v0.1')], ['11', X(k_(S2.seeds_hybrid_within_floor_p95), 'hybrid v0.2')]]);
  const a01 = v => sr[v].per_seed.filter(s => s.alpha_per_fold.includes(0.1)).length;
  add('App. B folds', 'on the one partition per version where a fold selects $\\alpha=0.1$', [['1', X(a01('v0.1'), 'v0.1 partitions with alpha 0.1 in some fold')], ['1', X(a01('v0.2'), 'v0.2 partitions with alpha 0.1')]]);
  add('App. B folds', 'hybrid over BM25 has $p=0.016$ on 19 of 20 v0.1 partitions and $p\\geq0.07$ on all v0.2 partitions; hybrid over dense has $p=0.013$ on 19 of 20 v0.2 partitions', [['0.016', X(S1.p_vs_bm25.min, src('p_vs_bm25.min') + ' v0.1')], ['19', X(k_(S1.seeds_p_vs_bm25_lt_05), 'v0.1')], ['0.07', X(S2.p_vs_bm25.min, src('p_vs_bm25.min') + ' v0.2')], ['0.013', X(S2.p_vs_dense.min, src('p_vs_dense.min') + ' v0.2')], ['19', X(k_(S2.seeds_p_vs_dense_lt_05), 'v0.2')]]); }
{ const g7 = R('review_r1/review_r1_g_test_sensitivity.json').versions, s = 'results/review_r1/review_r1_g_test_sensitivity.json :: versions.';
  add('App. B test choice', 'exact $p=0.070$, mid-p 0.039, asymptotic 0.034, and it would survive Holm correction under mid-p (0.039)', [['0.070', X(g7['v0.2'].tests.accuracy_hybrid_vs_bm25.exact, s + 'v0.2.tests.accuracy_hybrid_vs_bm25.exact')], ['0.039', X(g7['v0.2'].tests.accuracy_hybrid_vs_bm25.mid_p, '...mid_p')], ['0.034', X(g7['v0.2'].tests.accuracy_hybrid_vs_bm25.asymptotic, '...asymptotic')], ['0.039', X(g7['v0.2'].holm_family[0].holm_mid_p, s + 'v0.2.holm_family[0].holm_mid_p')]]);
  add('App. B test choice', '(1 vs.\\ 7 discordant queries)', [['1', X(g7['v0.2'].tests.accuracy_hybrid_vs_bm25.b, 'b')], ['7', X(g7['v0.2'].tests.accuracy_hybrid_vs_bm25.c, 'c')]]);
  add('App. B test choice', 'the v0.1 gain over dense (mid-p 0.092) and the v0.2 tuned threshold against the detector (mid-p 0.0024)', [['0.092', X(g7['v0.1'].tests.accuracy_hybrid_vs_dense.mid_p, s + 'v0.1.tests.accuracy_hybrid_vs_dense.mid_p')], ['0.0024', X(g7['v0.2'].tests.ood_tuned_threshold_vs_detector.mid_p, s + 'v0.2.tests.ood_tuned_threshold_vs_detector.mid_p')]]);
  const flips = ['v0.1', 'v0.2'].reduce((n, v) => n + Object.values(g7[v].tests).filter(t => (t.exact < 0.05) !== (t.mid_p < 0.05) || (t.exact < 0.05) !== (t.asymptotic < 0.05)).length, 0);
  add('App. B test choice', 'the only conclusion that changes is the v0.2 accuracy gain over BM25', [['1', X(flips, 'count of comparisons whose side of 0.05 differs between exact and mid-p or asymptotic, both versions')]]);
  add('§5 hybrid', 'depends on the test used (mid-p 0.039', [['0.039', X(g7['v0.2'].tests.accuracy_hybrid_vs_bm25.mid_p, s + 'v0.2.tests.accuracy_hybrid_vs_bm25.mid_p')]]); }
{ const h = R('review_r1/review_r1_h_shipped_reliability_bins.json').versions, top = v => h[v].bins_before[9], src = 'results/review_r1/review_r1_h_shipped_reliability_bins.json :: versions.v0.x.bins_before[9]';
  add('§5 shipped / Fig. shipped', '77\\% and 63\\% of non-control queries fall in the top bin, shown at a mean 99\\% confidence, and 70\\% and 73\\% of them are answered correctly', [['77', X(100 * top('v0.1').count / h['v0.1'].n, src + ' count / n, v0.1')], ['63', X(100 * top('v0.2').count / h['v0.2'].n, 'same, v0.2')], ['99', X(100 * Math.min(top('v0.1').avg_confidence, top('v0.2').avg_confidence), src + ' avg_confidence (both 0.994)')], ['70', X(100 * top('v0.1').avg_accuracy, src + ' avg_accuracy v0.1')], ['73', X(100 * top('v0.2').avg_accuracy, 'v0.2')]]);
  add('Fig. shipped caption', 'non-control queries (125 and 184), 10 equal-width bins', [['125', X(h['v0.1'].n, 'n v0.1')], ['184', X(h['v0.2'].n, 'n v0.2')], ['10', X(h['v0.1'].bins_before.length, 'bins')]]); }

// T21c / 3-day plan (2026-09-29): released-vs-evaluated corpus (RELEASE-01), index size (PAPER-01),
// platform-inconsistent credit (RESEARCH-01 / PAPER-09)
{ const rc = R('release_check/published_corpus_check.json'), rv = v => rc.versions[v], src = 'results/release_check/published_corpus_check.json :: ';
  const pc = (o) => 100 * o.k / o.n;
  add('§3 corpus', 'the tool also indexes one packaged user snippet, so its Windows index holds 280 records', [['280', X(require(rel('research/experiments/lexical_search.js')).lexicalSearchAll('probe', 'win32').length, 'research lexical replica (identical to cli/search.js on 150/150): candidate count on win32')]]);
  add('§3 corpus', 'an earlier corpus of 380 records (240 visible on Windows); the 51 later records', [['380', X(rc.published_package.corpus_records, src + 'published_package.corpus_records')], ['240', X(rc.published_package.corpus_win32_visible, src + 'published_package.corpus_win32_visible')], ['51', X(rc.evaluated_repository.unpublished_records, src + 'evaluated_repository.unpublished_records')]]);
  add('§3 corpus', '17 of the 150 v0.1 answers change, accuracy falls from 67.3\\% to 58.7\\%, and the raw ECE of its confidence rises from 0.323 to 0.372 (v0.2: 0.293 to 0.315); 15 v0.1 items', [['17', X(rv('v0.1').changed_items.length, src + 'versions.v0.1.changed_items.length')], ['150', X(rv('v0.1').n, src + 'versions.v0.1.n')], ['67.3', X(pc(rv('v0.1').evaluated_repository_corpus.overall_accuracy), src + 'v0.1 evaluated overall_accuracy k/n')], ['58.7', X(pc(rv('v0.1').published_npm_corpus.overall_accuracy), src + 'v0.1 published overall_accuracy k/n')], ['0.323', X(rv('v0.1').evaluated_repository_corpus.raw_ece_controls_excluded, src + 'v0.1 evaluated raw_ece_controls_excluded')], ['0.372', X(rv('v0.1').published_npm_corpus.raw_ece_controls_excluded, src + 'v0.1 published raw_ece_controls_excluded')], ['0.293', X(rv('v0.2').evaluated_repository_corpus.raw_ece_controls_excluded, 'v0.2 evaluated')], ['0.315', X(rv('v0.2').published_npm_corpus.raw_ece_controls_excluded, 'v0.2 published')], ['15', X(rv('v0.1').items_whose_every_valid_command_is_unpublished.length, src + 'v0.1 items_whose_every_valid_command_is_unpublished')]]);
  add('§1', 'which adds 51 records committed shortly after the release', [['51', X(rc.evaluated_repository.unpublished_records, src + 'evaluated_repository.unpublished_records')]]);
  add('§3 tool', 'this can fire on an accidental substring (the bare query ``tar\'\' matches ``start\'\')', [['15', X(g(R('v0.2/reproduction-results.json').find(r => r.id === 'TA-B187'), 'actual.score'), 'results/v0.2/reproduction-results.json TA-B187 ("tar") score = bonus only')]], 'no number is printed in the paper; this checks that the example is a bonus-only score of 15');
  const gp = R('system_audit/gold_platform_check.json').versions;
  add('Limitations', 'the shipped tool is credited with 3 such answers on v0.1 and 4 on v0.2', [['3', X(gp['v0.1'].shipped_answers_credited_correct_but_posix_only.length, 'results/system_audit/gold_platform_check.json :: versions.v0.1.shipped_answers_credited_correct_but_posix_only')], ['4', X(gp['v0.2'].shipped_answers_credited_correct_but_posix_only.length, '... versions.v0.2')]]);
}

// TRACE-01 (research/publication_tasks, 2026-09-30): the Conclusion, Limitations and Ethics, so that
// Contribution 3's "a trace from every reported number to its result file" holds. Sources are the same
// fields the earlier entries for these numbers use. The coverage check below enforces completeness.
{ const kf = 'review_r1/review_r1_f_kappa_intervals.json', bk = R(e).versions['v0.2'].rejections_by_kind;
  const disc = v => { const c = R(t1).versions[v].comparisons.BM25_to_hybrid.controls_excluded; return c.a_only_correct + c.b_only_correct; };
  add('Conclusion', '46 vs.\\ 34 of 50, and 12 vs.\\ 9 on the 15 not screened by retrieval score', [['46', F(e, 'versions.v0.2.nested_tuned_baseline_threshold.ood_rejected.k')], ['34', F(e, 'versions.v0.2.committed_operating_points.tuned_detector_nested.ood_rejected.k')], ['50', F(e, 'versions.v0.2.n_ood')], ['12', F(e, 'versions.v0.2.rejections_by_source.original_v0_1_items.tuned_shipped_threshold')], ['9', F(e, 'versions.v0.2.rejections_by_source.original_v0_1_items.hybrid_detector')], ['15', F(e, 'versions.v0.2.rejections_by_source.original_v0_1_items.n')]]);
  add('Conclusion', 'refuses more in-scope queries (20 vs.\\ 11 of 134)', [['20', F(e, 'versions.v0.2.controls_excluded.false_rejected.tuned_shipped_threshold')], ['11', F(e, 'versions.v0.2.controls_excluded.false_rejected.hybrid_detector')], ['134', F(e, 'versions.v0.2.controls_excluded.n_non_ood')]]);
  add('Limitations', '150 and 209 queries, the second containing the first; 59 queries drafted by an AI agent', [['150', X(D1.ids.length, 'computed: v0.1 ids (results/hybrid/folds.json)')], ['209', X(D2.ids.length, 'computed: v0.2 ids (results/v0.2/folds.json)')], ['59', X(D2.ids.length - D1.ids.length, 'computed: 209 minus 150')]]);
  add('Limitations', '($\\kappa=0.63$, interval [0.39, 1.00], $n=14$)', [['0.63', F(kf, 'kappa.point')], ['0.39', F(kf, 'kappa.bootstrap_ci95[0]')], ['1.00', F(kf, 'kappa.bootstrap_ci95[1]')], ['14', F(kf, 'kappa.n')]]);
  const discD = v => { const c = R(t1).versions[v].comparisons.dense_to_hybrid.controls_excluded; return c.a_only_correct + c.b_only_correct; };
  add('Limitations', 'Accuracy tests rest on 7--8 discordant queries against BM25 and 12--17 against dense', [['7', X(disc('v0.1'), `computed: a_only_correct + b_only_correct, results/${t1} :: versions.v0.1.comparisons.BM25_to_hybrid.controls_excluded`)], ['8', X(disc('v0.2'), '... versions.v0.2')], ['12', X(discD('v0.1'), `computed: a_only_correct + b_only_correct, results/${t1} :: versions.v0.1.comparisons.dense_to_hybrid.controls_excluded`)], ['17', X(discD('v0.2'), '... versions.v0.2')]], 'reworded in PAPER-05 (ISSUE-04)');
  add('Limitations', 'repeats every fold-dependent step on 20 partitions', [['20', X(R('seed_repeat/seed_repeat_cv.json').seeds.length, 'results/seed_repeat/seed_repeat_cv.json :: seeds (length)')]]);
  add('Limitations', "Only 10 of the benchmark's out-of-scope queries are terminal tasks outside the corpus", [['10', X(bk.near_ood.n + bk.unsupported_tool_ood.n, `computed: near_ood.n + unsupported_tool_ood.n, results/${e} :: versions.v0.2.rejections_by_kind (AI-assigned kinds)`)]]);
  add('Limitations', 'results depend on the platform-filtered corpus), 279 commands', [['279', X(winVisible.length, 'cli/data/commands.json, records visible on win32')]]);
  { const bib = fs.readFileSync(rel('research/paper/acl_latex/references.bib'), 'utf8'), rc = fs.readFileSync(rel('research/paper/PHASE14_LITERATURE_RECHECK.md'), 'utf8');
    const last = [...bib.matchAll(/verified (\d{4})-(\d{2})-\d{2}/g), ...rc.matchAll(/re-check \((\d{4})-(\d{2})-\d{2}\)/g)].map(m => m[1] + '-' + m[2]).sort().pop();
    add('Limitations', 'last updated in September 2026', [['2026', X(last === '2026-09' ? 2026 : NaN, `latest literature-search date ${last}: references.bib "verified 2026-09-28" (fresh search section) and PHASE14_LITERATURE_RECHECK.md (2026-09-14); month must be September`)]], 'PAPER-03 (b)'); }
  add('Limitations', 'functional evaluation covers 15 queries and treats exit code 0 as success', [['15', F('functional/functional-eval-results.json', 'summary.n_evaluated')], ['0', X(/gold_functional_success: goldResult\.exitCode === (\d+)/.test(fs.readFileSync(rel('research/experiments/run_functional_eval.js'), 'utf8')) ? +RegExp.$1 : NaN, 'research/experiments/run_functional_eval.js: success = exitCode === 0')]]);
}

// INTEG-03 (2026-10-01): the §4 "External check" paragraph (E1, protocol frozen at tag e1-protocol-v1).
// Source: research/results/e1_clinc150_v1/summary.json, written by the frozen e1_analyze.js.
{ const s1 = 'e1_clinc150_v1/summary.json', comma = 'displayed with a thousands comma';
  add('§4 external check', 'requests written for a general-purpose task assistant: 4,500 from 150 intents and 1,000 outside them', [['4500', F(s1, 'P1.n')], ['150', F(s1, 'P1.bootstrap.clusters')], ['1000', F(s1, 'P2.n')]], comma + '; 150 = intent clusters in P1');
  add('§4 external check', 'all five per-fold values are applied and the median rate is reported', [['5', F(s1, 'thresholds.R2.length')]], 'number word "five" in the paper');
  add('§4 external check', "each thresholded to refuse at most 11 of v0.2's 159 in-scope queries", [['11', F(s1, 'matched_thresholds_derivation.m')], ['159', F(s1, 'matched_thresholds_derivation.n_in_scope')]]);
  add('§4 external check', 'Intervals on the 4,500 resample intents', [['4500', F(s1, 'P1.n')]], comma);
}

// INTEG-04 (2026-10-01): E1 results in §5, the Table 1 dagger note, and Appendix C (Table tab:external).
// Every value is read from research/results/e1_clinc150_v1/summary.json (frozen analysis; no deviations).
{ const s1 = 'e1_clinc150_v1/summary.json', comma = 'displayed with a thousands comma';
  const rt = (p, k, f = 'rate') => pct(F(s1, `${p}.rates.${k}.${f}`));
  const cb = (p, k, end) => pct(F(s1, `${p}.rates.${k}.cluster_bootstrap95.${end}`));
  const wl = (p, k, end) => pct(F(s1, `${p}.rates.${k}.wilson95.${end}`));
  const ft = (p, k, end) => pct(F(s1, `${p}.five_threshold_sensitivity.${k}.${end}`));
  const mo = (p, path) => pct(F(s1, `${p}.matched_operating_point.${path}`));
  const prim = path => pct(F(s1, `P1.primary_comparison.${path}`));
  const p2m = F(s1, 'P2.matched_operating_point.comparison.exact_mcnemar_p').v;
  const cliThr = +(/match\.confidence < (\d+)/.exec(fs.readFileSync(rel('cli/index.js'), 'utf8')) || [])[1];
  // §5 paragraph
  add('§5 external check', 'the fixed rule rejects only 25\\% of the 4,500 CLINC150 requests from known intents and 19\\% of the 1,000 others', [['25', rt('P1', 'R1')], ['4500', F(s1, 'P1.n')], ['19', rt('P2', 'R1')], ['1000', F(s1, 'P2.n')]], comma);
  add('§5 external check', 'the tuned threshold rejects 86\\% and the detector 78\\%', [['86', rt('P1', 'R2')], ['78', rt('P1', 'R3')]]);
  add('§5 external check', '(difference $+8.3$ points, interval [5.0, 11.6]; 83\\% and 78\\% on the 1,000)', [['+8.3', prim('difference')], ['5.0', prim('ci95.lo')], ['11.6', prim('ci95.hi')], ['83', rt('P2', 'R2')], ['78', rt('P2', 'R3')], ['1000', F(s1, 'P2.n')]], 'primary comparison (protocol §6.4); ' + comma);
  add('§5 external check', "the hybrid's feature rejects more than the shipped score (77\\% vs.\\ 65\\%, $-12.5$ points [$-16.2$, $-8.9$]; 77\\% vs.\\ 60\\% on the 1,000)", [['77', mo('P1', 'rates.R3m.rate')], ['65', mo('P1', 'rates.R2m.rate')], ['-12.5', mo('P1', 'comparison.difference')], ['-16.2', mo('P1', 'comparison.ci95_cluster_bootstrap.lo')], ['-8.9', mo('P1', 'comparison.ci95_cluster_bootstrap.hi')], ['77', mo('P2', 'rates.R3m.rate')], ['60', mo('P2', 'rates.R2m.rate')], ['1000', F(s1, 'P2.n')]], 'matched operating points, secondary (protocol §6.4); ' + comma);
  // Appendix C table and caption
  add('App. C', '\\textbf{Known intents} ($n=4{,}500$) & \\textbf{Outside them} ($n=1{,}000$)', [['4500', F(s1, 'P1.n')], ['1000', F(s1, 'P2.n')]], comma);
  add('App. C', 'Fixed rule ($s<2.0$) & 25.3 [21.8, 29.0] & 19.1 [16.8, 21.7]', [['2.0', X(num(/bestScore < ([\d.]+)\)/), 'cli/search.js:124 minimum score')], ['25.3', rt('P1', 'R1')], ['21.8', cb('P1', 'R1', 'lo')], ['29.0', cb('P1', 'R1', 'hi')], ['19.1', rt('P2', 'R1')], ['16.8', wl('P2', 'R1', 'lo')], ['21.7', wl('P2', 'R1', 'hi')]]);
  add('App. C', 'CLI 30\\% rule & 25.5 [22.1, 29.2] & 19.8 [17.5, 22.4]', [['30', X(cliThr, 'cli/index.js:58 refusal threshold')], ['25.5', rt('P1', 'R1_CLI')], ['22.1', cb('P1', 'R1_CLI', 'lo')], ['29.2', cb('P1', 'R1_CLI', 'hi')], ['19.8', rt('P2', 'R1_CLI')], ['17.5', wl('P2', 'R1_CLI', 'lo')], ['22.4', wl('P2', 'R1_CLI', 'hi')]]);
  add('App. C', 'Tuned threshold (range over the five folds) & 86.0 [83.0, 88.8] (86.0--92.2) & 83.4 [81.0, 85.6] (83.4--89.4)', [['86.0', rt('P1', 'R2')], ['83.0', cb('P1', 'R2', 'lo')], ['88.8', cb('P1', 'R2', 'hi')], ['86.0', ft('P1', 'R2', 'min_rate')], ['92.2', ft('P1', 'R2', 'max_rate')], ['83.4', rt('P2', 'R2')], ['81.0', wl('P2', 'R2', 'lo')], ['85.6', wl('P2', 'R2', 'hi')], ['83.4', ft('P2', 'R2', 'min_rate')], ['89.4', ft('P2', 'R2', 'max_rate')]]);
  add('App. C', 'Hybrid detector (range over the five folds) & 77.8 [74.1, 81.3] (69.3--78.2) & 78.1 [75.4, 80.6] (69.3--78.6)', [['77.8', rt('P1', 'R3')], ['74.1', cb('P1', 'R3', 'lo')], ['81.3', cb('P1', 'R3', 'hi')], ['69.3', ft('P1', 'R3', 'min_rate')], ['78.2', ft('P1', 'R3', 'max_rate')], ['78.1', rt('P2', 'R3')], ['75.4', wl('P2', 'R3', 'lo')], ['80.6', wl('P2', 'R3', 'hi')], ['69.3', ft('P2', 'R3', 'min_rate')], ['78.6', ft('P2', 'R3', 'max_rate')]]);
  add('App. C', 'Tuned minus detector, points (primary) & $+$8.3 [5.0, 11.6] & $+$5.3 (Holm $p=.001$)', [['+8.3', prim('difference')], ['5.0', prim('ci95.lo')], ['11.6', prim('ci95.hi')], ['+5.3', pct(F(s1, 'P2.secondary_p2[0].difference'))], ['.001', F(s1, 'P2.secondary_p2[0].holm_adjusted_p')]]);
  add('App. C', 'Equal v0.2 cost: shipped score / hybrid feature & 64.6 / 77.1 & 59.7 / 77.0', [['64.6', mo('P1', 'rates.R2m.rate')], ['77.1', mo('P1', 'rates.R3m.rate')], ['59.7', mo('P2', 'rates.R2m.rate')], ['77.0', mo('P2', 'rates.R3m.rate')]]);
  add('App. C', '\\quad difference, points & $-$12.5 [$-$16.2, $-$8.9] & $-$17.3 ($p=6\\times10^{-19}$)', [['-12.5', mo('P1', 'comparison.difference')], ['-16.2', mo('P1', 'comparison.ci95_cluster_bootstrap.lo')], ['-8.9', mo('P1', 'comparison.ci95_cluster_bootstrap.hi')], ['-17.3', mo('P2', 'comparison.difference')], ['6', X(p2m / 1e-19, `results/${s1} :: P2.matched_operating_point.comparison.exact_mcnemar_p = ${p2m} (mantissa)`)], ['-19', X(Math.floor(Math.log10(p2m)), 'exponent of the same p')]]);
  add('App. C', 'bootstrap over the 150 intents', [['150', F(s1, 'P1.bootstrap.clusters')]]);
  add('App. C', 'the median of the five per-fold rates', [['5', F(s1, 'thresholds.R2.length')]], 'number word "five"');
  add('App. C', "each score's threshold refuses at most 11 of v0.2's 159 in-scope queries (10 for the shipped score, because of a tie)", [['11', F(s1, 'matched_thresholds_derivation.m')], ['159', F(s1, 'matched_thresholds_derivation.n_in_scope')], ['10', F(s1, 'matched_thresholds_derivation.s4.in_scope_rejected_of_159')]]);
  add('Limitations', 'equal-cost thresholds are set in-sample on v0.2 and refuse 10 and 11 in-scope queries rather than exactly the same number', [['10', F(s1, 'matched_thresholds_derivation.s4.in_scope_rejected_of_159')], ['11', F(s1, 'matched_thresholds_derivation.fused4.in_scope_rejected_of_159')]], 'INTEG-05: matched operating points (protocol §6.4)');
  add('App. C', 'Removing the 13 intents a stock shell could answer leaves the primary difference at $+$7.5 [4.2, 10.9]', [['13', X(F(s1, 'P1_extras.subgroup_S.S_clear.intents').v + F(s1, 'P1_extras.subgroup_S.S_borderline.intents').v, `computed: S_clear.intents + S_borderline.intents, results/${s1} :: P1_extras.subgroup_S`)], ['+7.5', pct(F(s1, 'P1_extras.sensitivity_without_S.without_S_clear_and_S_borderline.primary_comparison.difference'))], ['4.2', pct(F(s1, 'P1_extras.sensitivity_without_S.without_S_clear_and_S_borderline.primary_comparison.ci95.lo'))], ['10.9', pct(F(s1, 'P1_extras.sensitivity_without_S.without_S_clear_and_S_borderline.primary_comparison.ci95.hi'))]], 'sensitivity (descriptive), protocol §6.5 point 2');
}

// Coverage check (TRACE-01): every numeral in the Conclusion, Limitations and Ethics must be registered
// above at that location, or be a listed design constant. Identifiers (v0.1, A4, TA-B145, model names)
// are not numerals; number words ("Two items") are not checked, as elsewhere in this trace.
const SECTIONS = [
  ['Discussion', '\\section{Discussion}', '\\section{Conclusion}'],   // §6: no numerals today; checked so none slip in
  ['Conclusion', '\\section{Conclusion}', '\\label{endofbody}'],       // §7
  ['Limitations', '\\section*{Limitations}', '\\section*{Ethical Considerations}'],
  ['Ethics', '\\section*{Ethical Considerations}', '\\aiacknowledgements']
];
const DESIGN_CONSTANTS = { Limitations: { '42': 'fold seed, a design parameter (listed in the header exclusions)' } };
const coverage = [];
for (const [name, from, to] of SECTIONS) {
  const i = tex.indexOf(from), j = tex.indexOf(to, i + 1);
  if (i < 0 || j < 0) { coverage.push({ name, error: `section markers not found (${from} … ${to})` }); continue; }
  const body = tex.slice(i + from.length, j).replace(/--/g, ' -- ').replace(/\\(ref|label|citep?|citealp)\{[^}]*\}/g, ' ');
  const found = (body.match(/(?<![A-Za-z0-9.:\-])\d+(?:\.\d+)?(?![A-Za-z0-9])/g) || []);
  const pool = E.filter(x => x.where.split(';').map(s => s.trim()).includes(name)).flatMap(x => x.items.map(([shown]) => shown));
  const missing = [];
  for (const n of found) {
    const k = pool.indexOf(n);
    if (k >= 0) pool.splice(k, 1);
    else if (!(DESIGN_CONSTANTS[name] || {})[n]) missing.push(n);
  }
  coverage.push({ name, numerals: found.length, missing });
}

// ---------- check ----------
function matches(shown, v) {
  if (typeof v === 'string') return v === shown;
  if (typeof v !== 'number' || Number.isNaN(v)) return false;
  const t = shown.replace(/^\+/, ''); const dec = (t.split('.')[1] || '').length;
  return Math.abs(+(Math.round(v * 10 ** dec) / 10 ** dec).toFixed(dec) - +t) < 1e-9 || (t === '5' && v >= 4.5 && v < 5.5) || (t === '6' && v >= 5.5 && v < 6.5);
}
const rows = []; let bad = 0, nNum = 0;
for (const x of E) {
  const inTex = tex.includes(x.snippet.replace(/\s+/g, ' '));
  if (!inTex) { bad++; rows.push(`| ${x.where} | \`${x.snippet}\` | — | **SNIPPET NOT FOUND in content.tex** |`); }
  for (const [shown, s] of x.items) {
    nNum++;
    const ok = matches(shown, s.v);
    if (!ok) bad++;
    rows.push(`| ${x.where} | ${shown} | ${typeof s.v === 'number' ? +s.v.toFixed(6) : s.v} | ${ok ? '' : '**MISMATCH** '}${s.src}${x.note ? ' — ' + x.note : ''} |`);
  }
}
if (!a5Guard) { bad++; console.error('A5 per-fold accepted counts did not reproduce'); }
for (const c of coverage) {
  if (c.error) { bad++; rows.push(`| ${c.name} | — | — | **COVERAGE CHECK FAILED: ${c.error}** |`); }
  else if (c.missing.length) { bad++; rows.push(`| ${c.name} | ${c.missing.join(', ')} | — | **UNREGISTERED numeral(s) in this section** |`); }
}
const coverageLine = coverage.map(c => c.error ? `${c.name}: error` : `${c.name} ${c.numerals} numeral(s), ${c.missing.length} unregistered`).join('; ');
const md = [
  '# CLAIMS_TRACE: every number in the paper body, traced to its source (T15)',
  '',
  'Generated by `research/experiments/trace_claims.js`; do not edit by hand. Rerun after any change to',
  '`research/paper/acl_latex/content.tex` or to a result file. The script checks that each quoted snippet still',
  'appears in `content.tex` and that each source value rounds to the digits shown (rule in the script header).',
  '',
  `**Status: ${bad ? bad + ' PROBLEM(S)' : 'all ' + nNum + ' numbers in ' + E.length + ' snippets match'}.**`,
  '',
  'Coverage: every number in the Abstract, §1–§5, §6 Discussion (no numerals), §7 Conclusion, Limitations, Ethical Considerations,',
  'Tables 1–3, Appendix A, the Appendix B text and Tables 5 and 7, and Appendix C (the external check) with its table.',
  `Automatic coverage check (numerals only; identifiers and number words excluded): ${coverageLine}.`,
  'Not traced here, with the reason:',
  '- Table 6 (`table_sensitivity.tex`) is generated from `stats/sensitivity-bare-keyword-results.json` by its own',
  '  script; the §B sentence that quotes it is traced.',
  '- Split B ECE cells (Table 7) are traced by the split-B result files themselves (controls included); not repeated.',
  '- Figures are generated by `research/experiments/generate_figures.js` from the same result files.',
  '- Design parameters stated as choices (5 folds, seed 42, 10 bins, 10,000 resamples, grid 0.0-1.0) are in',
  '  `research/experiments/run_*.js` and `phase1_common.js`.',
  '',
  '| Location | Shown | Source value | Source |',
  '|---|---|---|---|',
  ...rows
].join('\n') + '\n';
fs.writeFileSync(rel('research/paper/CLAIMS_TRACE.md'), md);
console.log(`${E.length} snippets, ${nNum} numbers, ${bad} problem(s). Wrote research/paper/CLAIMS_TRACE.md`);
if (bad) { rows.filter(r => /MISMATCH|NOT FOUND/.test(r)).forEach(r => console.log(r)); process.exit(1); }
