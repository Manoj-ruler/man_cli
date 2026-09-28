// T4 (research/PLAN_TASKS.md): is isotonic calibration's ECE gain a property of isotonic regression,
// or would any simple recalibration do the same? And does calibration change decisions?
//
// Methods, all fit on dev folds only and applied once to the test fold (Split A, same folds as the
// committed results): none | isotonic (PAV, committed method) | Platt scaling (logistic fit with
// Platt's smoothed targets) | histogram binning (10 equal-width bins; an empty bin takes the value
// of the nearest non-empty bin).
// Signals: the four committed confidence variants, led by baseline_confidence (the value the
// shipped CLI shows users) and hybrid_reliability. Evaluated on all queries and with the 25
// canonical controls excluded from fitting and evaluation.
// Reported: ECE (10 equal-width bins), Brier, paired-bootstrap 95% CIs for each against 'none',
// and correctness AUROC after calibration (a monotone map cannot improve ranking; flattening ties
// can make it worse).
// Guards: 'none' and 'isotonic' must reproduce the committed ECE/Brier before/after for all
// variants on both versions.

const C = require('./phase1_common');
const B = 10000;

const platt = {
  fit(pairs) {
    const pos = pairs.filter(p => p.y === 1).length, neg = pairs.length - pos;
    const tPos = (pos + 1) / (pos + 2), tNeg = 1 / (neg + 2);
    const t = pairs.map(p => (p.y === 1 ? tPos : tNeg)), x = pairs.map(p => p.x);
    let a = 0, b = Math.log((pos + 1) / (neg + 1));
    for (let it = 0; it < 100; it++) {
      let g1 = 0, g2 = 0, h11 = 1e-8, h12 = 0, h22 = 1e-8;
      for (let i = 0; i < x.length; i++) { const p = 1 / (1 + Math.exp(-(a * x[i] + b))), d = p - t[i], w = p * (1 - p); g1 += d * x[i]; g2 += d; h11 += w * x[i] * x[i]; h12 += w * x[i]; h22 += w; }
      const det = h11 * h22 - h12 * h12; if (Math.abs(det) < 1e-12) break;
      const da = (h22 * g1 - h12 * g2) / det, db = (h11 * g2 - h12 * g1) / det;
      a -= da; b -= db; if (Math.abs(da) + Math.abs(db) < 1e-10) break;
    }
    return { a, b };
  },
  predict(m, x) { return 1 / (1 + Math.exp(-(m.a * x + m.b))); }
};
const binning = {
  fit(pairs, nBins = 10) {
    const s = new Array(nBins).fill(0), n = new Array(nBins).fill(0);
    pairs.forEach(p => { let i = Math.floor(p.x * nBins); if (i >= nBins) i = nBins - 1; if (i < 0) i = 0; s[i] += p.y; n[i]++; });
    const val = new Array(nBins).fill(null);
    for (let i = 0; i < nBins; i++) if (n[i]) val[i] = s[i] / n[i];
    for (let i = 0; i < nBins; i++) if (val[i] === null) { for (let d = 1; d < nBins; d++) { if (i - d >= 0 && n[i - d]) { val[i] = s[i - d] / n[i - d]; break; } if (i + d < nBins && n[i + d]) { val[i] = s[i + d] / n[i + d]; break; } } }
    return { val, nBins };
  },
  predict(m, x) { let i = Math.floor(x * m.nBins); if (i >= m.nBins) i = m.nBins - 1; if (i < 0) i = 0; return m.val[i]; }
};
const METHODS = { none: 'none', isotonic: 'isotonic', platt, histogram_binning: binning };

const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const out = {};
  for (const variant of Object.keys(D.variants)) {
    const committed = D.calibration.variants[variant];
    out[variant] = {};
    for (const [mode, opt] of [['all', {}], ['controls_excluded', { fitFilter: id => !D.isCanonical(id), evalFilter: id => !D.isCanonical(id) }]]) {
      const runs = {};
      for (const [name, method] of Object.entries(METHODS)) runs[name] = C.nestedCalibrate(D, variant, method, opt);
      if (mode === 'all') {
        C.guard(`${v} ${variant} ECE before`, C.r4(C.eceOf(runs.none.after)), committed.before_calibration.ece);
        C.guard(`${v} ${variant} Brier before`, C.r4(C.brierOf(runs.none.after)), committed.before_calibration.brier);
        C.guard(`${v} ${variant} isotonic ECE after`, C.r4(C.eceOf(runs.isotonic.after)), committed.after_calibration.ece);
        C.guard(`${v} ${variant} isotonic Brier after`, C.r4(C.brierOf(runs.isotonic.after)), committed.after_calibration.brier);
      }
      const base = runs.none.after, n = base.length;
      const rawValues = new Set(base.map(p => p.conf));
      const maxRaw = Math.max(...rawValues);
      const m = { n, raw_distinct_values: rawValues.size, raw_share_at_max: C.r4(base.filter(p => p.conf === maxRaw).length / n), methods: {} };
      for (const [name, run] of Object.entries(runs)) {
        const cal = run.after;
        const eceCI = C.bootstrap(n, idx => C.eceOf(idx.map(i => cal[i])), { B });
        const redCI = C.bootstrap(n, idx => C.eceOf(idx.map(i => base[i])) - C.eceOf(idx.map(i => cal[i])), { B });
        const brierRedCI = C.bootstrap(n, idx => C.brierOf(idx.map(i => base[i])) - C.brierOf(idx.map(i => cal[i])), { B });
        m.methods[name] = {
          ece: C.r4(C.eceOf(cal)), ece_ci95: [eceCI.lo, eceCI.hi], brier: C.r4(C.brierOf(cal)),
          ece_reduction_vs_none: C.r4(C.eceOf(base) - C.eceOf(cal)), ece_reduction_ci95: name === 'none' ? null : [redCI.lo, redCI.hi],
          brier_reduction_vs_none: C.r4(C.brierOf(base) - C.brierOf(cal)), brier_reduction_ci95: name === 'none' ? null : [brierRedCI.lo, brierRedCI.hi],
          distinct_output_values: new Set(cal.map(p => C.r4(p.conf))).size,
          correctness_auroc: C.r4(C.auroc(cal.map(p => ({ score: p.conf, pos: p.hit === 1 }))))
        };
      }
      out[variant][mode] = m;
    }
  }
  result.versions[v] = out;
}

const guards = C.assertGuards('phase1_t4_calibration_comparators');
C.writeOut('phase1_t4_calibration_comparators', { task: 'T4: calibration comparators (isotonic vs Platt vs histogram binning)', methods: { platt: 'logistic fit by Newton-Raphson with Platt (1999) smoothed targets', histogram_binning: '10 equal-width bins; empty bin takes nearest non-empty bin value', isotonic: 'PAV with tie aggregation (research/experiments/isotonic.js)' }, bootstrap: { B, seed: 42 }, reproduction_checks: guards, ...result });

for (const [v, R] of Object.entries(result.versions)) {
  console.log(`\n=== ${v} ===`);
  for (const variant of ['baseline_confidence', 'hybrid_reliability', 'margin_confidence', 'semantic_confidence']) for (const mode of ['all', 'controls_excluded']) {
    const m = R[variant][mode];
    const line = Object.entries(m.methods).map(([k, x]) => `${k} ECE ${x.ece}${x.ece_reduction_ci95 ? ` (red. CI ${x.ece_reduction_ci95[0]}..${x.ece_reduction_ci95[1]})` : ''} Brier ${x.brier} AUROC ${x.correctness_auroc}`).join(' | ');
    console.log(`  ${variant} [${mode}] n=${m.n} raw distinct ${m.raw_distinct_values}, ${(100 * m.raw_share_at_max).toFixed(0)}% at max\n     ${line}`);
  }
}
