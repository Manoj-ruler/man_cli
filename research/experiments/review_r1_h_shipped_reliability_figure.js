// REV-10 (review round 1, suggested; approved by the author 2026-09-29): one main-text figure. The
// paper leads with the shipped confidence, so the figure is its reliability diagram before vs after
// isotonic recalibration, on the paper's Table 1 population (canonical controls excluded from fit and
// evaluation; calibrator fit on the 4 development folds, applied to the test fold; seed-42 partition).
// Styling follows generate_figures.js fig3. Guards: the binned ECEs equal the committed values
// (review_r1_b: 0.323 -> 0.069 on v0.1, 0.293 -> 0.063 on v0.2).
// Writes research/results/review_r1/review_r1_h_shipped_reliability_bins.json and
// research/figures/fig7_shipped_reliability{,_v0.2}.svg (PNG conversion: see research/REPRODUCE.md).
const fs = require('fs'), path = require('path');
const { C, writeOut } = require('./review_r1_common');
const NB = 10;
const COL = { before: '#C44E52', after: '#55A868', grid: '#DDDDDD', ref: '#888888' }, FT = { tick: 13, legend: 13, axis: 14 };

function bins(pairs) {
  const b = Array.from({ length: NB }, (_, i) => ({ bin: i, lo: i / NB, hi: (i + 1) / NB, count: 0, sum_conf: 0, sum_hit: 0 }));
  pairs.forEach(({ conf, hit }) => { let i = Math.floor(conf * NB); if (i >= NB) i = NB - 1; if (i < 0) i = 0; b[i].count++; b[i].sum_conf += conf; b[i].sum_hit += hit; });
  return b.map(x => ({ bin: x.bin, count: x.count, avg_confidence: x.count ? C.r4(x.sum_conf / x.count) : null, avg_accuracy: x.count ? C.r4(x.sum_hit / x.count) : null }));
}
function svg(before, after, eceB, eceA) {
  const w = 400, h = 400, mL = 56, mB = 50, mT = 12, mR = 14, P = w - mL - mR, Q = h - mT - mB, X = c => mL + c * P, Y = a => mT + Q - a * Q;
  let s = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, Helvetica, sans-serif">\n<rect width="${w}" height="${h}" fill="white"/>\n`;
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    s += `<line x1="${X(t)}" y1="${mT}" x2="${X(t)}" y2="${mT + Q}" stroke="${COL.grid}"/><line x1="${mL}" y1="${Y(t)}" x2="${mL + P}" y2="${Y(t)}" stroke="${COL.grid}"/>`;
    s += `<text x="${X(t)}" y="${mT + Q + 17}" text-anchor="middle" font-size="${FT.tick}">${t}</text><text x="${mL - 6}" y="${Y(t) + 4.5}" text-anchor="end" font-size="${FT.tick}">${t}</text>`;
  });
  s += `<line x1="${mL}" y1="${mT}" x2="${mL}" y2="${mT + Q}" stroke="black"/><line x1="${mL}" y1="${mT + Q}" x2="${mL + P}" y2="${mT + Q}" stroke="black"/>`;
  s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" stroke="${COL.ref}" stroke-dasharray="5,4"/>`;
  s += `<text x="${mL + P / 2}" y="${h - 10}" text-anchor="middle" font-size="${FT.axis}">Mean confidence in bin</text>`;
  s += `<text x="16" y="${mT + Q / 2}" text-anchor="middle" font-size="${FT.axis}" transform="rotate(-90 16 ${mT + Q / 2})">Accuracy in bin</text>`;
  const dots = (bs, color) => bs.filter(b => b.count > 0).forEach(b => { s += `<circle cx="${X(b.avg_confidence).toFixed(1)}" cy="${Y(b.avg_accuracy).toFixed(1)}" r="${(2.5 + 0.8 * Math.sqrt(b.count)).toFixed(1)}" fill="${color}" opacity="0.8"/>`; });
  dots(before, COL.before); dots(after, COL.after);
  s += `<circle cx="${mL + 14}" cy="${mT + 14}" r="6" fill="${COL.before}"/><text x="${mL + 26}" y="${mT + 19}" font-size="${FT.legend}">shipped (ECE ${eceB.toFixed(3)})</text>`;
  s += `<circle cx="${mL + 14}" cy="${mT + 34}" r="6" fill="${COL.after}"/><text x="${mL + 26}" y="${mT + 39}" font-size="${FT.legend}">recalibrated (ECE ${eceA.toFixed(3)})</text>`;
  return s + '</svg>';
}

const result = { versions: {} };
const b = C.rd('research/results/review_r1/review_r1_b_calibration.json');
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v), keep = id => !D.isCanonical(id);
  const { before, after } = C.nestedCalibrate(D, 'baseline_confidence', 'isotonic', { fitFilter: keep, evalFilter: keep });
  const eceB = C.eceOf(before), eceA = C.eceOf(after);
  C.guard(`${v} shipped ECE before`, C.r4(eceB), b.versions[v].baseline_confidence.controls_excluded.uncalibrated.ece_equal_width_10);
  C.guard(`${v} shipped ECE after`, C.r4(eceA), b.versions[v].baseline_confidence.controls_excluded.isotonic.ece_equal_width_10);
  const bb = bins(before), ba = bins(after);
  result.versions[v] = { n: before.length, ece_before: C.r4(eceB), ece_after: C.r4(eceA), bins_before: bb, bins_after: ba };
  const out = path.join(C.root, 'research/figures', `fig7_shipped_reliability${v === 'v0.1' ? '' : '_v0.2'}.svg`);
  fs.writeFileSync(out, svg(bb, ba, eceB, eceA));
}
const guards = C.assertGuards('review_r1_h_shipped_reliability_figure');
writeOut('review_r1_h_shipped_reliability_bins', { task: 'REV-10: main-text reliability diagram of the shipped confidence (controls excluded)', reproduction_checks: guards, ...result });
console.log('wrote research/figures/fig7_shipped_reliability.svg and _v0.2.svg');
