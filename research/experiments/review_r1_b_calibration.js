// T18 / REV-15 (review round 1: R1 W2, DA M1): are the reported ECE reductions interpretable at this n?
//
// For the shipped baseline confidence and the hybrid confidence, on both versions, with all queries and
// with the 25 canonical controls excluded (from fitting and evaluation), under the committed nested
// Split A folds:
//   - ECE with 10 equal-width bins (the paper's estimator), 10 equal-mass bins, and ECE-sweep
//     (Roelofs et al., AISTATS 2022: equal-mass with the largest monotone bin count);
//   - a noise floor: the ECE a PERFECTLY calibrated forecaster would show with the same confidences and
//     n (outcomes simulated as Bernoulli(calibrated confidence), 2,000 draws; mean and 95th percentile);
//   - Brier score, and Brier skill against an out-of-fold no-skill forecaster (predicts the development
//     folds' base rate), with a bootstrap CI;
//   - the relative ECE reduction (1 - after/before) with a bootstrap CI.
// Guards: equal-width ECE and Brier before/after reproduce the committed calibration results (all
// queries) and the T1 controls-excluded results.
const { C, writeOut, eceEqualMass, eceSweep } = require('./review_r1_common');
const B = 10000, SIMS = 2000;

const noSkill = { fit: pairs => pairs.reduce((a, p) => a + p.y, 0) / pairs.length, predict: m => m };
const t1 = C.rd('research/results/phase1/phase1_t1_controls_excluded.json');
const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const out = {};
  for (const sig of ['baseline_confidence', 'hybrid_reliability']) {
    out[sig] = {};
    for (const [mode, opt] of [['all', {}], ['controls_excluded', { fitFilter: id => !D.isCanonical(id), evalFilter: id => !D.isCanonical(id) }]]) {
      const raw = C.nestedCalibrate(D, sig, 'none', opt).after, iso = C.nestedCalibrate(D, sig, 'isotonic', opt).after, ns = C.nestedCalibrate(D, sig, noSkill, opt).after;
      const n = raw.length;
      if (mode === 'all') {
        const cm = D.calibration.variants[sig];
        C.guard(`${v} ${sig} ECE before`, C.r4(C.eceOf(raw)), cm.before_calibration.ece);
        C.guard(`${v} ${sig} ECE after`, C.r4(C.eceOf(iso)), cm.after_calibration.ece);
        C.guard(`${v} ${sig} Brier after`, C.r4(C.brierOf(iso)), cm.after_calibration.brier);
      } else {
        const e = t1.versions[v].calibration[sig].controls_excluded_fit_and_eval;
        C.guard(`${v} ${sig} excl. ECE before`, C.r4(C.eceOf(raw)), e.ece_before);
        C.guard(`${v} ${sig} excl. ECE after`, C.r4(C.eceOf(iso)), e.ece_after);
      }
      const est = pairs => ({ ece_equal_width_10: C.r4(C.eceOf(pairs)), ece_equal_mass_10: C.r4(eceEqualMass(pairs, 10)), ece_sweep: C.r4(eceSweep(pairs).ece), sweep_bins: eceSweep(pairs).bins, brier: C.r4(C.brierOf(pairs)) });
      // noise floor for a perfectly calibrated forecaster with the calibrated confidences
      const rng = C.mulberry32(7), floors = { ew: [], em: [] };
      for (let s = 0; s < SIMS; s++) { const sim = iso.map(p => ({ conf: p.conf, hit: rng() < p.conf ? 1 : 0 })); floors.ew.push(C.eceOf(sim)); floors.em.push(eceEqualMass(sim, 10)); }
      Object.values(floors).forEach(a => a.sort((x, y) => x - y));
      const floor = a => ({ mean: C.r4(a.reduce((x, y) => x + y, 0) / a.length), p95: C.r4(C.percentile(a, 0.95)) });
      // bootstrap: relative ECE reduction and Brier skill vs out-of-fold no-skill
      const rel = C.bootstrap(n, idx => { const b = C.eceOf(idx.map(i => raw[i])); return b > 0 ? 1 - C.eceOf(idx.map(i => iso[i])) / b : null; }, { B });
      const bss = C.bootstrap(n, idx => { const d = C.brierOf(idx.map(i => ns[i])); return d > 0 ? 1 - C.brierOf(idx.map(i => iso[i])) / d : null; }, { B });
      const bssRaw = C.bootstrap(n, idx => { const d = C.brierOf(idx.map(i => ns[i])); return d > 0 ? 1 - C.brierOf(idx.map(i => raw[i])) / d : null; }, { B });
      out[sig][mode] = {
        n, accuracy: C.r4(raw.reduce((a, p) => a + p.hit, 0) / n),
        uncalibrated: est(raw), isotonic: est(iso), no_skill_out_of_fold: est(ns),
        noise_floor_perfectly_calibrated: { equal_width_10: floor(floors.ew), equal_mass_10: floor(floors.em) },
        relative_ece_reduction_equal_width: { point: C.r4(1 - C.eceOf(iso) / C.eceOf(raw)), ci95: [rel.lo, rel.hi] },
        brier_skill_vs_no_skill: { isotonic: { point: C.r4(1 - C.brierOf(iso) / C.brierOf(ns)), ci95: [bss.lo, bss.hi] }, uncalibrated: { point: C.r4(1 - C.brierOf(raw) / C.brierOf(ns)), ci95: [bssRaw.lo, bssRaw.hi] } }
      };
    }
  }
  result.versions[v] = out;
}
const guards = C.assertGuards('review_r1_b_calibration');
writeOut('review_r1_b_calibration', { task: 'T18 / REV-15: calibration estimators, noise floor, no-skill reference, intervals', bootstrap: { B, seed: 42 }, simulations: { n: SIMS, seed: 7 }, reproduction_checks: guards, ...result });
for (const [v, R] of Object.entries(result.versions)) for (const [s, M] of Object.entries(R)) for (const [m, x] of Object.entries(M))
  console.log(`${v} ${s.slice(0, 8)} ${m.padEnd(17)} n=${x.n} | ECE ew ${x.uncalibrated.ece_equal_width_10}->${x.isotonic.ece_equal_width_10} em ${x.uncalibrated.ece_equal_mass_10}->${x.isotonic.ece_equal_mass_10} sweep ${x.uncalibrated.ece_sweep}->${x.isotonic.ece_sweep} | floor ew ${x.noise_floor_perfectly_calibrated.equal_width_10.mean} (p95 ${x.noise_floor_perfectly_calibrated.equal_width_10.p95}) | rel.red ${x.relative_ece_reduction_equal_width.point} ${JSON.stringify(x.relative_ece_reduction_equal_width.ci95)} | Brier ${x.uncalibrated.brier}->${x.isotonic.brier} noskill ${x.no_skill_out_of_fold.brier} BSS iso ${x.brier_skill_vs_no_skill.isotonic.point} ${JSON.stringify(x.brier_skill_vs_no_skill.isotonic.ci95)} raw ${x.brier_skill_vs_no_skill.uncalibrated.point} ${JSON.stringify(x.brier_skill_vs_no_skill.uncalibrated.ci95)}`);
