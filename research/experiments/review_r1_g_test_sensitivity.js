// S6 / REV-18 (review round 1, suggested; approved by the author 2026-09-29): how much do the
// paper's McNemar conclusions depend on the exact conditional test?
//
// For every McNemar comparison the paper reports, from its committed discordant counts (b, c):
//   exact     two-sided exact binomial test on the discordant pairs (as committed): 2 * P(X <= min(b,c)), capped at 1
//   mid-p     the exact test with half the probability of the observed count: 2 * [P(X < min) + 0.5 P(X = min)]
//   asymptotic McNemar chi-square without continuity correction, (b - c)^2 / (b + c), 1 df
// and the Holm family (4 comparisons per version) recomputed with mid-p for the three McNemar members;
// the calibration member is a bootstrap bound and is carried unchanged.
// Guards: every exact p reproduces its committed value; Holm with exact p reproduces stats/holm-correction-results.json.
const { C, writeOut } = require('./review_r1_common');

const binom = n => { const p = [1]; for (let i = 1; i <= n; i++) p.push(p[i - 1] * (n - i + 1) / i); return p.map(x => x / 2 ** n); };
function tests(b, c) {
  const n = b + c, k = Math.min(b, c);
  if (!n) return { b, c, exact: 1, mid_p: 1, asymptotic: 1 };
  const pm = binom(n); let below = 0; for (let i = 0; i < k; i++) below += pm[i];
  const exact = Math.min(1, 2 * (below + pm[k])), mid = Math.min(1, 2 * (below + 0.5 * pm[k]));
  const chi = (b - c) ** 2 / n;
  return { b, c, exact: C.p4(exact), mid_p: C.p4(mid), asymptotic_chi2: C.r4(chi), asymptotic: C.p4(erfc(Math.sqrt(chi / 2))) };
}
function erfc(x) { // Numerical Recipes erfcc, fractional error < 1.2e-7
  const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}
function holm(ps) { const o = ps.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p), m = ps.length, out = new Array(m); let run = 0; o.forEach((x, r) => { run = Math.max(run, Math.min(1, (m - r) * x.p)); out[x.i] = run; }); return out; }

const t1 = C.rd('research/results/phase1/phase1_t1_controls_excluded.json');
const e = C.rd('research/results/review_r1/review_r1_e_ood_operating_points.json');
const H = C.rd('research/results/stats/holm-correction-results.json');
const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const cmp = k => t1.versions[v].comparisons[k].controls_excluded;
  const eo = e.versions[v];
  const detOnly = eo.committed_operating_points.tuned_detector_nested.ood_rejected.k - eo.committed_operating_points.baseline_rule_bm25_lt_2.ood_rejected.k; // fixed-rule rejections are a subset (review_r1_a)
  const rows = {
    accuracy_hybrid_vs_bm25: { ...tests(cmp('BM25_to_hybrid').a_only_correct, cmp('BM25_to_hybrid').b_only_correct), committed: cmp('BM25_to_hybrid').exact_mcnemar_p },
    accuracy_hybrid_vs_dense: { ...tests(cmp('dense_to_hybrid').a_only_correct, cmp('dense_to_hybrid').b_only_correct), committed: cmp('dense_to_hybrid').exact_mcnemar_p },
    ood_detector_vs_fixed_rule: { ...tests(0, detOnly), committed: H.versions[v][2].p },
    ood_tuned_threshold_vs_detector: { ...tests(eo.nested_tuned_baseline_threshold.versus_tuned_detector.on_ood_detector_vs_tuned_baseline.a_only, eo.nested_tuned_baseline_threshold.versus_tuned_detector.on_ood_detector_vs_tuned_baseline.b_only), committed: eo.nested_tuned_baseline_threshold.versus_tuned_detector.on_ood_detector_vs_tuned_baseline.exact_mcnemar_p },
    false_rejections_tuned_vs_detector: { ...tests(eo.nested_tuned_baseline_threshold.versus_tuned_detector.on_non_ood_false_rejections_detector_vs_tuned_baseline.a_only, eo.nested_tuned_baseline_threshold.versus_tuned_detector.on_non_ood_false_rejections_detector_vs_tuned_baseline.b_only), committed: eo.nested_tuned_baseline_threshold.versus_tuned_detector.on_non_ood_false_rejections_detector_vs_tuned_baseline.exact_mcnemar_p }
  };
  for (const [k, r] of Object.entries(rows)) C.guard(`${v} ${k} exact p`, r.exact, r.committed, Math.max(1e-6, 1e-3 * r.committed));
  const fam = [rows.accuracy_hybrid_vs_bm25, rows.accuracy_hybrid_vs_dense, rows.ood_detector_vs_fixed_rule];
  const calib = H.versions[v][3].p;
  const hExact = holm([...fam.map(r => r.exact), calib]), hMid = holm([...fam.map(r => r.mid_p), calib]);
  // tolerance 2e-6 absolute: the committed Holm file multiplied p values already rounded to 6 decimals
  // (e.g. 2 * 0.5^17 = 1.526e-5 stored as 0.000015, so 4 x 0.000015 = 0.00006 vs 6.10e-5 here)
  hExact.forEach((x, i) => C.guard(`${v} Holm (exact) member ${i}`, C.p4(x), C.p4(H.versions[v][i].holm_p), Math.max(2e-6, 1e-3 * H.versions[v][i].holm_p)));
  const names = ['accuracy_hybrid_vs_bm25', 'accuracy_hybrid_vs_dense', 'ood_detector_vs_fixed_rule', 'calibration_ece_reduction_bootstrap_bound'];
  result.versions[v] = { tests: rows,
    holm_family: names.map((n, i) => ({ member: n, holm_exact: C.p4(hExact[i]), holm_mid_p: C.p4(hMid[i]), significant_exact: hExact[i] < 0.05, significant_mid_p: hMid[i] < 0.05 })) };
}
const guards = C.assertGuards('review_r1_g_test_sensitivity');
writeOut('review_r1_g_test_sensitivity', { task: 'S6 / REV-18: mid-p and asymptotic McNemar sensitivity; Holm family under mid-p', note: 'Counts are the committed discordant pairs (controls excluded; controls are never discordant). The calibration member of the Holm family is a one-sided bootstrap bound and is carried unchanged.', reproduction_checks: guards, ...result });
for (const [v, R] of Object.entries(result.versions)) {
  console.log(`\n=== ${v} ===`);
  for (const [k, r] of Object.entries(R.tests)) console.log(`  ${k.padEnd(36)} b=${r.b} c=${r.c}  exact ${r.exact}  mid-p ${r.mid_p}  asymptotic ${r.asymptotic}`);
  R.holm_family.forEach(h => console.log(`  Holm ${h.member.padEnd(42)} exact ${h.holm_exact} (${h.significant_exact ? 'sig' : 'ns'})  mid-p ${h.holm_mid_p} (${h.significant_mid_p ? 'sig' : 'ns'})`));
}
