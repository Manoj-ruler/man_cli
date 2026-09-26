// Generates the paper's SVG figures directly from committed result JSON files (no hand-typed
// numbers, no charting dependency). Each figure reads its own source file(s), so a figure cannot
// drift from the experiment that produced it.
//
// Sized for print: every canvas is ~480 px wide and is placed at half the page width (~3.3 in) in
// the ACL paper, so 13-15 px text renders at roughly 7 pt. Figures carry no title; the caption in
// the paper names them (in-image titles were redundant, and one was clipped).
//
// Accuracy definition: A0-A3 bars show POOLED accuracy over all non-OOD queries (hits / n), the
// same unit as the paper's text, McNemar tests and bootstrap intervals. A4-A6 (selective accuracy
// at reduced coverage) are only available as a mean over the five test folds and are labeled so.

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));
const figDir = path.join(projectRoot, 'research/figures');
if (!fs.existsSync(figDir)) fs.mkdirSync(figDir, { recursive: true });

const C = { bar1: '#4C72B0', bar2: '#DD8452', bar3: '#55A868', bar4: '#C44E52', grid: '#DDDDDD', text: '#222222', ref: '#888888' };
const F = { tick: 13, value: 13, label: 14, legend: 13, axis: 14 };
const svgHeader = (w, h) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, Helvetica, sans-serif">\n<rect width="${w}" height="${h}" fill="white"/>\n`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function pooledAcc(ablation, cond) {
  const q = ablation.conditions[cond].per_query.filter(r => r.classification !== 'OOD');
  return { pct: 100 * q.filter(r => r.hit).length / q.length, hits: q.filter(r => r.hit).length, n: q.length };
}

// series: [{label, values:[{value,color}]}]
function barChart(series, o = {}) {
  const w = o.width || 480, h = o.height || 300;
  const mL = 44, mR = 8, mT = o.legend ? 34 : 22, mB = o.marginB || 34;
  const plotW = w - mL - mR, plotH = h - mT - mB;
  const maxVal = o.maxVal || Math.max(...series.flatMap(s => s.values.map(v => v.value))) * 1.15;
  const groupW = plotW / series.length, per = series[0].values.length, barW = (groupW * 0.72) / per;
  let s = svgHeader(w, h);
  for (let i = 0; i <= 5; i++) {
    const y = mT + plotH - (i / 5) * plotH;
    s += `<line x1="${mL}" y1="${y}" x2="${w - mR}" y2="${y}" stroke="${C.grid}" stroke-width="1"/>\n`;
    s += `<text x="${mL - 5}" y="${y + 4.5}" text-anchor="end" font-size="${F.tick}" fill="${C.text}">${((i / 5) * maxVal).toFixed(0)}${o.suffix || ''}</text>\n`;
  }
  series.forEach((sr, gi) => {
    const gx = mL + gi * groupW + groupW * 0.14;
    sr.values.forEach((v, bi) => {
      const bh = (v.value / maxVal) * plotH, x = gx + bi * barW, y = mT + plotH - bh;
      s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(barW * 0.9).toFixed(1)}" height="${bh.toFixed(1)}" fill="${v.color}"/>\n`;
      if (o.values !== false) s += `<text x="${(x + barW * 0.45).toFixed(1)}" y="${(y - 3).toFixed(1)}" text-anchor="middle" font-size="${F.value}" fill="${C.text}">${v.value.toFixed(o.decimals ?? 1)}</text>\n`;
    });
    const cx = (mL + gi * groupW + groupW / 2).toFixed(1), cy = mT + plotH + 17;
    s += o.rotate
      ? `<text x="${cx}" y="${cy}" text-anchor="end" font-size="${F.label}" fill="${C.text}" transform="rotate(${o.rotate} ${cx} ${cy})">${esc(sr.label)}</text>\n`
      : `<text x="${cx}" y="${cy}" text-anchor="middle" font-size="${F.label}" fill="${C.text}">${esc(sr.label)}</text>\n`;
  });
  if (o.legend) {
    let lx = mL;
    o.legend.forEach(l => { s += `<rect x="${lx}" y="6" width="12" height="12" fill="${l.color}"/><text x="${lx + 16}" y="17" font-size="${F.legend}" fill="${C.text}">${esc(l.name)}</text>\n`; lx += 16 + l.name.length * 7.2 + 18; });
  }
  return s + '</svg>';
}

const V0 = { ablation: 'research/results/ablation/ablation-results.json', calibration: 'research/calibration/calibration-results.json', selective: 'research/results/reliability/selective-prediction-results.json', errorTaxonomy: 'research/analysis/final-error-analysis.json', n: 150, suffix: '' };
const V2 = { ablation: 'research/results/v0.2/ablation-results.json', calibration: 'research/results/v0.2/calibration-results.json', selective: 'research/results/v0.2/selective-prediction-results.json', errorTaxonomy: 'research/results/v0.2/final-error-analysis.json', n: 209, suffix: '_v0.2' };
const out = (name, cfg, svg) => fs.writeFileSync(path.join(figDir, `${name}${cfg.suffix}.svg`), svg);

// Figure 1: pooled non-OOD accuracy, BM25 vs dense vs hybrid
function fig1(cfg) {
  const a = read(cfg.ablation);
  const series = [['BM25 (A0)', 'A0', C.bar1], ['Dense (A2)', 'A2', C.bar2], ['Hybrid (A3)', 'A3', C.bar3]]
    .map(([label, k, color]) => ({ label, values: [{ value: pooledAcc(a, k).pct, color }] }));
  out('fig1_baseline_vs_improved_accuracy', cfg, barChart(series, { suffix: '%', maxVal: 100 }));
}

// Figure 2: accuracy by query type (pooled hits/total per type), BM25 vs hybrid
const SHORT = { ambiguous: 'ambiguous', canonical: 'canonical', complex_multi_intent: 'complex', low_overlap_paraphrase: 'low-overlap', paraphrase: 'paraphrase', polysemy: 'polysemy', safety_sensitive: 'safety', single_keyword: 'single-kw' };
function fig2(cfg) {
  const a = read(cfg.ablation), a0 = a.conditions.A0.by_query_type_aggregate, a3 = a.conditions.A3.by_query_type_aggregate;
  const series = Object.keys(a0).sort().map(qt => ({ label: SHORT[qt] || qt, values: [
    { value: 100 * a0[qt].hits / a0[qt].total, color: C.bar1 }, { value: a3[qt] ? 100 * a3[qt].hits / a3[qt].total : 0, color: C.bar3 }] }));
  out('fig2_accuracy_by_query_type', cfg, barChart(series, { suffix: '%', maxVal: 100, values: false, rotate: -35, marginB: 78, height: 320, legend: [{ name: 'BM25 (A0)', color: C.bar1 }, { name: 'Hybrid (A3)', color: C.bar3 }] }));
}

// Figure 3: reliability diagram, hybrid fused-score confidence, before vs after isotonic calibration
function fig3(cfg) {
  const v = read(cfg.calibration).variants.hybrid_reliability;
  const w = 400, h = 400, mL = 56, mB = 50, mT = 12, mR = 14, P = w - mL - mR, Q = h - mT - mB;
  const X = c => mL + c * P, Y = a => mT + Q - a * Q;
  let s = svgHeader(w, h);
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    s += `<line x1="${X(t)}" y1="${mT}" x2="${X(t)}" y2="${mT + Q}" stroke="${C.grid}"/><line x1="${mL}" y1="${Y(t)}" x2="${mL + P}" y2="${Y(t)}" stroke="${C.grid}"/>`;
    s += `<text x="${X(t)}" y="${mT + Q + 17}" text-anchor="middle" font-size="${F.tick}">${t}</text><text x="${mL - 6}" y="${Y(t) + 4.5}" text-anchor="end" font-size="${F.tick}">${t}</text>`;
  });
  s += `<line x1="${mL}" y1="${mT}" x2="${mL}" y2="${mT + Q}" stroke="black"/><line x1="${mL}" y1="${mT + Q}" x2="${mL + P}" y2="${mT + Q}" stroke="black"/>`;
  s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" stroke="${C.ref}" stroke-dasharray="5,4"/>`;
  s += `<text x="${mL + P / 2}" y="${h - 10}" text-anchor="middle" font-size="${F.axis}">Mean confidence in bin</text>`;
  s += `<text x="16" y="${mT + Q / 2}" text-anchor="middle" font-size="${F.axis}" transform="rotate(-90 16 ${mT + Q / 2})">Accuracy in bin</text>`;
  const dots = (bins, color) => bins.filter(b => b.count > 0).forEach(b => { s += `<circle cx="${X(b.avg_confidence).toFixed(1)}" cy="${Y(b.avg_accuracy).toFixed(1)}" r="${(2.5 + 0.8 * Math.sqrt(b.count)).toFixed(1)}" fill="${color}" opacity="0.8"/>`; });
  dots(v.before_bins, C.bar4); dots(v.after_bins, C.bar3);
  s += `<circle cx="${mL + 14}" cy="${mT + 14}" r="6" fill="${C.bar4}"/><text x="${mL + 26}" y="${mT + 19}" font-size="${F.legend}">before (ECE ${v.before_calibration.ece.toFixed(3)})</text>`;
  s += `<circle cx="${mL + 14}" cy="${mT + 34}" r="6" fill="${C.bar3}"/><text x="${mL + 26}" y="${mT + 39}" font-size="${F.legend}">after (ECE ${v.after_calibration.ece.toFixed(3)})</text>`;
  out('fig3_reliability_diagram', cfg, s + '</svg>');
}

// Figure 4: risk-coverage curve (hybrid, confidence-ranked)
function fig4(cfg) {
  const pts = read(cfg.selective).risk_coverage_curve;
  const w = 480, h = 300, mL = 56, mB = 46, mT = 12, mR = 26, P = w - mL - mR, Q = h - mT - mB;
  const maxRisk = Math.ceil(Math.max(...pts.map(p => p.risk)) * 1.05 * 10) / 10 || 0.5;   // round up to a multiple of 10%
  const X = c => mL + c * P, Y = r => mT + Q - (r / maxRisk) * Q;
  let s = svgHeader(w, h);
  [0, 0.25, 0.5, 0.75, 1].forEach(c => { s += `<line x1="${X(c)}" y1="${mT}" x2="${X(c)}" y2="${mT + Q}" stroke="${C.grid}"/><text x="${X(c)}" y="${mT + Q + 17}" text-anchor="middle" font-size="${F.tick}">${(c * 100).toFixed(0)}%</text>`; });
  for (let r = 0; r <= maxRisk + 1e-9; r += 0.1) { s += `<line x1="${mL}" y1="${Y(r)}" x2="${mL + P}" y2="${Y(r)}" stroke="${C.grid}"/><text x="${mL - 6}" y="${Y(r) + 4.5}" text-anchor="end" font-size="${F.tick}">${Math.round(r * 100)}%</text>`; }
  s += `<line x1="${mL}" y1="${mT}" x2="${mL}" y2="${mT + Q}" stroke="black"/><line x1="${mL}" y1="${mT + Q}" x2="${mL + P}" y2="${mT + Q}" stroke="black"/>`;
  s += `<path d="${pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.coverage).toFixed(1)},${Y(p.risk).toFixed(1)}`).join(' ')}" fill="none" stroke="${C.bar1}" stroke-width="2.2"/>`;
  s += `<text x="${mL + P / 2}" y="${h - 8}" text-anchor="middle" font-size="${F.axis}">Coverage (share of queries answered)</text>`;
  s += `<text x="16" y="${mT + Q / 2}" text-anchor="middle" font-size="${F.axis}" transform="rotate(-90 16 ${mT + Q / 2})">Error rate</text>`;
  out('fig4_risk_coverage_curve', cfg, s + '</svg>');
}

// Figure 5: ablation A0-A6 (A0-A3 pooled unconditional accuracy; A4-A6 mean selective accuracy over folds)
function fig5(cfg) {
  const a = read(cfg.ablation);
  const series = a.table.map(r => {
    const unconditional = ['A0', 'A1', 'A2', 'A3'].includes(r.condition);
    return { label: r.condition, values: [{ value: unconditional ? pooledAcc(a, r.condition).pct : r.mean_selective_accuracy_pct, color: unconditional ? C.bar1 : C.bar3 }] };
  });
  out('fig5_ablation_A0_A6', cfg, barChart(series, { suffix: '%', maxVal: 100, legend: [{ name: 'accuracy, all non-OOD', color: C.bar1 }, { name: 'selective accuracy', color: C.bar3 }] }));
}

// Figure 6 (not in the paper): error taxonomy distribution
function fig6(cfg) {
  const tax = read(cfg.errorTaxonomy);
  const series = Object.entries(tax.tag_counts).sort((a, b) => b[1] - a[1]).map(([tag, n]) => ({ label: tag.toLowerCase().replace(/_/g, ' '), values: [{ value: n, color: tag === 'CORRECT' ? C.bar3 : C.bar4 }] }));
  out('fig6_error_taxonomy_distribution', cfg, barChart(series, { maxVal: cfg.n === 209 ? 140 : 110, decimals: 0, rotate: -35, marginB: 120, height: 360 }));
}

[V0, V2].forEach(cfg => { fig1(cfg); fig2(cfg); fig3(cfg); fig4(cfg); fig5(cfg); fig6(cfg); });
for (const [v, cfg] of [['v0.1', V0], ['v0.2', V2]]) { const a = read(cfg.ablation); console.log(v, 'pooled non-OOD accuracy:', ['A0', 'A2', 'A3'].map(k => `${k} ${pooledAcc(a, k).hits}/${pooledAcc(a, k).n} = ${pooledAcc(a, k).pct.toFixed(1)}%`).join('  ')); }
console.log('Generated 12 SVG figures (v0.1 + v0.2) in', figDir);
