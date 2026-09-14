// Phase 15 -- generate publication-ready SVG figures directly from already-committed result
// JSON files (no hand-typed numbers, no external charting dependency -- plain SVG strings).
// Each figure function reads its own source file(s) so a figure can never silently drift from
// the experiment that produced it.

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));
const figDir = path.join(projectRoot, 'research/figures');
if (!fs.existsSync(figDir)) fs.mkdirSync(figDir, { recursive: true });

const COLORS = { bar1: '#4C72B0', bar2: '#DD8452', bar3: '#55A868', bar4: '#C44E52', grid: '#DDDDDD', text: '#222222', ref: '#999999' };

function svgHeader(w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">\n<rect width="${w}" height="${h}" fill="white"/>\n`;
}

function barChart(title, series, opts = {}) {
  // series: [{label, values: [{name, value, color}]}]
  const w = opts.width || 900, h = opts.height || 500;
  const marginL = 70, marginB = 100, marginT = 50, marginR = 30;
  const plotW = w - marginL - marginR, plotH = h - marginT - marginB;
  const maxVal = opts.maxVal || Math.max(...series.flatMap(s => s.values.map(v => v.value))) * 1.15;
  const groupW = plotW / series.length;
  const barsPerGroup = series[0].values.length;
  const barW = (groupW * 0.7) / barsPerGroup;

  let svg = svgHeader(w, h);
  svg += `<text x="${w/2}" y="25" text-anchor="middle" font-size="18" font-weight="bold" fill="${COLORS.text}">${title}</text>\n`;
  // gridlines + y-axis labels
  for (let i = 0; i <= 5; i++) {
    const y = marginT + plotH - (i / 5) * plotH;
    const val = (i / 5) * maxVal;
    svg += `<line x1="${marginL}" y1="${y}" x2="${w - marginR}" y2="${y}" stroke="${COLORS.grid}" stroke-width="1"/>\n`;
    svg += `<text x="${marginL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="${COLORS.text}">${val.toFixed(0)}${opts.suffix || ''}</text>\n`;
  }
  series.forEach((s, gi) => {
    const groupX = marginL + gi * groupW + groupW * 0.15;
    s.values.forEach((v, bi) => {
      const barH = (v.value / maxVal) * plotH;
      const x = groupX + bi * barW;
      const y = marginT + plotH - barH;
      svg += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(barW*0.85).toFixed(1)}" height="${barH.toFixed(1)}" fill="${v.color || COLORS.bar1}"/>\n`;
      svg += `<text x="${(x + barW*0.42).toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle" font-size="10" fill="${COLORS.text}">${v.value.toFixed(1)}</text>\n`;
    });
    svg += `<text x="${(marginL + gi*groupW + groupW/2).toFixed(1)}" y="${h - marginB + 20}" text-anchor="middle" font-size="11" fill="${COLORS.text}" transform="rotate(-20 ${(marginL + gi*groupW + groupW/2).toFixed(1)} ${h - marginB + 20})">${s.label}</text>\n`;
  });
  // legend
  if (opts.legend) {
    let lx = marginL;
    opts.legend.forEach(l => {
      svg += `<rect x="${lx}" y="${h - 30}" width="12" height="12" fill="${l.color}"/>`;
      svg += `<text x="${lx + 16}" y="${h - 20}" font-size="11" fill="${COLORS.text}">${l.name}</text>`;
      lx += l.name.length * 6 + 40;
    });
  }
  svg += `</svg>`;
  return svg;
}

// --- Figure 1: baseline vs dense vs hybrid overall accuracy ---
function fig1() {
  const ablation = read('research/results/ablation/ablation-results.json');
  const series = [
    { label: 'A0: BM25', values: [{ name: 'acc', value: ablation.table.find(r=>r.condition==='A0').mean_non_ood_accuracy_pct, color: COLORS.bar1 }] },
    { label: 'A2: Dense', values: [{ name: 'acc', value: ablation.table.find(r=>r.condition==='A2').mean_non_ood_accuracy_pct, color: COLORS.bar2 }] },
    { label: 'A3: Hybrid', values: [{ name: 'acc', value: ablation.table.find(r=>r.condition==='A3').mean_non_ood_accuracy_pct, color: COLORS.bar3 }] }
  ];
  fs.writeFileSync(path.join(figDir, 'fig1_baseline_vs_improved_accuracy.svg'), barChart('Supported-Task Accuracy: BM25 vs Dense vs Hybrid (nested 5-fold CV)', series, { suffix: '%', maxVal: 100 }));
}

// --- Figure 2: accuracy by query type, A0 vs A3 ---
function fig2() {
  const ablation = read('research/results/ablation/ablation-results.json');
  const a0 = ablation.conditions.A0.by_query_type_aggregate;
  const a3 = ablation.conditions.A3.by_query_type_aggregate;
  const types = Object.keys(a0).sort();
  const series = types.map(qt => ({
    label: qt,
    values: [
      { name: 'A0', value: (a0[qt].hits / a0[qt].total) * 100, color: COLORS.bar1 },
      { name: 'A3', value: (a3[qt] ? (a3[qt].hits / a3[qt].total) * 100 : 0), color: COLORS.bar3 }
    ]
  }));
  fs.writeFileSync(path.join(figDir, 'fig2_accuracy_by_query_type.svg'), barChart('Accuracy by Query Type: BM25 (A0) vs Hybrid (A3)', series, { suffix: '%', maxVal: 100, width: 1100, legend: [{ name: 'A0 BM25', color: COLORS.bar1 }, { name: 'A3 Hybrid', color: COLORS.bar3 }] }));
}

// --- Figure 3: reliability diagram (calibration before/after, hybrid_reliability variant) ---
function fig3() {
  const cal = read('research/calibration/calibration-results.json');
  const variant = cal.variants.hybrid_reliability;
  const w = 600, h = 600, margin = 60, plotSize = w - 2*margin;
  let svg = svgHeader(w, h);
  svg += `<text x="${w/2}" y="25" text-anchor="middle" font-size="16" font-weight="bold">Reliability Diagram: hybrid_reliability (before vs after calibration)</text>\n`;
  // axes
  svg += `<line x1="${margin}" y1="${margin}" x2="${margin}" y2="${margin+plotSize}" stroke="black"/>`;
  svg += `<line x1="${margin}" y1="${margin+plotSize}" x2="${margin+plotSize}" y2="${margin+plotSize}" stroke="black"/>`;
  svg += `<line x1="${margin}" y1="${margin+plotSize}" x2="${margin+plotSize}" y2="${margin}" stroke="${COLORS.ref}" stroke-dasharray="4,4"/>`; // perfect calibration diagonal
  svg += `<text x="${margin-15}" y="${margin+plotSize/2}" text-anchor="middle" font-size="12" transform="rotate(-90 ${margin-15} ${margin+plotSize/2})">Accuracy</text>`;
  svg += `<text x="${margin+plotSize/2}" y="${h-15}" text-anchor="middle" font-size="12">Confidence</text>`;
  function plotPoints(bins, color, label, dy) {
    bins.filter(b => b.count > 0).forEach(b => {
      const x = margin + b.avg_confidence * plotSize;
      const y = margin + plotSize - b.avg_accuracy * plotSize;
      svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${3 + Math.sqrt(b.count)}" fill="${color}" opacity="0.75"/>`;
    });
    svg += `<circle cx="${margin+20}" cy="${h - 40 + dy}" r="5" fill="${color}"/><text x="${margin+32}" y="${h-36+dy}" font-size="11">${label}</text>`;
  }
  plotPoints(variant.before_bins, COLORS.bar4, `Before calibration (ECE=${variant.before_calibration.ece})`, 0);
  plotPoints(variant.after_bins, COLORS.bar3, `After calibration (ECE=${variant.after_calibration.ece})`, 18);
  svg += `</svg>`;
  fs.writeFileSync(path.join(figDir, 'fig3_reliability_diagram.svg'), svg);
}

// --- Figure 4: risk-coverage curve ---
function fig4() {
  const sel = read('research/results/reliability/selective-prediction-results.json');
  const pts = sel.risk_coverage_curve;
  const w = 700, h = 500, margin = 60, plotW = w-2*margin, plotH = h-2*margin-40;
  let svg = svgHeader(w, h);
  svg += `<text x="${w/2}" y="25" text-anchor="middle" font-size="16" font-weight="bold">Risk-Coverage Curve (hybrid, confidence-ranked)</text>\n`;
  svg += `<line x1="${margin}" y1="${margin}" x2="${margin}" y2="${margin+plotH}" stroke="black"/>`;
  svg += `<line x1="${margin}" y1="${margin+plotH}" x2="${margin+plotW}" y2="${margin+plotH}" stroke="black"/>`;
  svg += `<text x="${margin-35}" y="${margin+plotH/2}" text-anchor="middle" font-size="12" transform="rotate(-90 ${margin-35} ${margin+plotH/2})">Risk (error rate)</text>`;
  svg += `<text x="${margin+plotW/2}" y="${h-20}" text-anchor="middle" font-size="12">Coverage</text>`;
  const maxRisk = Math.max(...pts.map(p=>p.risk)) * 1.1 || 0.5;
  let path = pts.map((p,i) => `${i===0?'M':'L'}${(margin + p.coverage*plotW).toFixed(1)},${(margin + plotH - (p.risk/maxRisk)*plotH).toFixed(1)}`).join(' ');
  svg += `<path d="${path}" fill="none" stroke="${COLORS.bar1}" stroke-width="2"/>`;
  [0,0.25,0.5,0.75,1.0].forEach(c => svg += `<text x="${(margin+c*plotW).toFixed(1)}" y="${margin+plotH+15}" text-anchor="middle" font-size="10">${(c*100).toFixed(0)}%</text>`);
  [0, maxRisk/2, maxRisk].forEach(r => svg += `<text x="${margin-8}" y="${(margin+plotH-(r/maxRisk)*plotH+4).toFixed(1)}" text-anchor="end" font-size="10">${(r*100).toFixed(0)}%</text>`);
  svg += `</svg>`;
  fs.writeFileSync(path_join_fig('fig4_risk_coverage_curve.svg'), svg);
}
function path_join_fig(name) { return path.join(figDir, name); }

// --- Figure 5: ablation A0-A6 summary ---
function fig5() {
  const ablation = read('research/results/ablation/ablation-results.json');
  const series = ablation.table.map(r => ({
    label: r.condition,
    values: [{ name: 'val', value: r.mean_non_ood_accuracy_pct ?? r.mean_selective_accuracy_pct ?? 0, color: (r.condition <= 'A3') ? COLORS.bar1 : COLORS.bar3 }]
  }));
  fs.writeFileSync(path.join(figDir, 'fig5_ablation_A0_A6.svg'), barChart('Ablation A0-A6 (A0-A3: unconditional accuracy; A4-A6: selective accuracy at reduced coverage -- NOT directly comparable, see ABLATION_NOTES.md)', series, { suffix: '%', maxVal: 100, width: 1000 }));
}

// --- Figure 6: error taxonomy distribution ---
function fig6() {
  const tax = read('research/analysis/final-error-analysis.json');
  const entries = Object.entries(tax.tag_counts).sort((a,b) => b[1]-a[1]);
  const series = entries.map(([tag, count]) => ({ label: tag, values: [{ name: 'count', value: count, color: tag === 'CORRECT' ? COLORS.bar3 : COLORS.bar4 }] }));
  fs.writeFileSync(path.join(figDir, 'fig6_error_taxonomy_distribution.svg'), barChart('Error Taxonomy Distribution (hybrid/A3, 150 queries, multi-label)', series, { maxVal: 110, width: 1000 }));
}

fig1(); fig2(); fig3(); fig4(); fig5(); fig6();
console.log('Generated 6 SVG figures in', figDir);
fs.readdirSync(figDir).forEach(f => console.log(' ', f));
