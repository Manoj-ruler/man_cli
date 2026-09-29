// T21b / round 3 (NEW-7, REV-21): uncertainty of the 14-item independent-review agreement check.
//
// The round-1 manuscript quoted "a post hoc bootstrap 95% interval for kappa is [0.39, 1.00]" with no
// result file behind it. This script recomputes it from research/datasets/independent_review/
// kappa_results.json so the number is traceable, and adds the exact (Clopper-Pearson) interval for
// the 8/8 agreement on out-of-scope labels.
//   1. Cohen's kappa over the 14 rows, percentile bootstrap over rows (10,000 resamples, seed 42);
//      resamples where kappa is undefined (expected agreement = 1) are dropped and counted.
//   2. Clopper-Pearson 95% interval for 8 agreements out of 8 OOD-labelled rows: [0.025^(1/8), 1].
// Guards: n = 14, kappa = 0.6316, 8 OOD rows all agreeing (kappa_results.json).
const { C, writeOut } = require('./review_r1_common');

const K = C.rd('research/datasets/independent_review/kappa_results.json');
const rows = K.rows;
function kappa(rs) {
  const n = rs.length, labs = [...new Set(rs.flatMap(r => [r.original_label, r.reviewer_label]))];
  const po = rs.filter(r => r.original_label === r.reviewer_label).length / n;
  const pe = labs.reduce((s, l) => s + (rs.filter(r => r.original_label === l).length / n) * (rs.filter(r => r.reviewer_label === l).length / n), 0);
  return pe === 1 ? null : (po - pe) / (1 - pe);
}
C.guard('n rows', rows.length, 14, 0);
C.guard('kappa (kappa_results.json)', C.r4(kappa(rows)), K.cohens_kappa);
const oodRows = rows.filter(r => r.original_label === 'OOD');
C.guard('OOD rows', oodRows.length, 8, 0);
C.guard('OOD agreements', oodRows.filter(r => r.agree).length, 8, 0);

const bs = C.bootstrap(rows.length, idx => kappa(idx.map(i => rows[i])));
const cpLower = Math.pow(0.025, 1 / oodRows.length);

const guards = C.assertGuards('review_r1_f_kappa_intervals');
writeOut('review_r1_f_kappa_intervals', {
  task: 'T21b / NEW-7, REV-21: interval for the 14-item kappa and exact interval for the 8/8 OOD agreement',
  kappa: { n: rows.length, point: K.cohens_kappa, bootstrap_ci95: [bs.lo, bs.hi], bootstrap: { B: bs.B, seed: bs.seed, method: 'percentile, rows resampled', valid_resamples: bs.valid, dropped_undefined: bs.B - bs.valid } },
  ood_agreement: { k: oodRows.length, n: oodRows.length, clopper_pearson_ci95: [C.r4(cpLower), 1] },
  reproduction_checks: guards
});
console.log(`kappa ${K.cohens_kappa} bootstrap 95% [${bs.lo}, ${bs.hi}] (${bs.valid}/${bs.B} valid); OOD 8/8 Clopper-Pearson [${C.r4(cpLower)}, 1]`);
