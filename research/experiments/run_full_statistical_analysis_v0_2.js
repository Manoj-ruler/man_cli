// v0.2 pipeline -- extends run_statistical_analysis_v0_2.js (which covered only the OOD
// comparison) with the full A0/A1/A2/A3 accuracy McNemar's comparisons, mirroring
// run_statistical_analysis.js's v0.1 scope, plus Wilson CIs.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const read = p => JSON.parse(fs.readFileSync(path.join(projectRoot, p), 'utf-8'));

function logChoose(n, k) { if (k < 0 || k > n) return -Infinity; let r = 0; for (let i = 0; i < k; i++) r += Math.log(n - i) - Math.log(i + 1); return r; }
function binomProb(n, k, p) { return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)); }
function binomCdf(n, k, p) { let s = 0; for (let i = 0; i <= k; i++) s += binomProb(n, i, p); return s; }
function exactMcNemar(b, c) {
  const n = b + c;
  if (n === 0) return { b, c, n_discordant: 0, p_value: 1.0 };
  const k = Math.min(b, c);
  return { b, c, n_discordant: n, p_value: +Math.min(1, 2 * binomCdf(n, k, 0.5)).toFixed(6) };
}
function wilsonCI(successes, n, z = 1.96) {
  if (n === 0) return { point: 0, lower: 0, upper: 0 };
  const p = successes / n;
  const denom = 1 + (z * z) / n;
  const center = (p + (z * z) / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return { point: +p.toFixed(4), lower: +Math.max(0, center - margin).toFixed(4), upper: +Math.min(1, center + margin).toFixed(4) };
}

function main() {
  const ablation = read('research/results/v0.2/ablation-results.json');
  function hitMap(condition) {
    const rows = ablation.conditions[condition].per_query;
    const m = new Map();
    rows.forEach(r => { if (r.classification !== 'OOD') m.set(r.id, r.hit); });
    return m;
  }
  const A0 = hitMap('A0'), A1 = hitMap('A1'), A2 = hitMap('A2'), A3 = hitMap('A3');
  const ids = [...A0.keys()];

  function pairedMcNemar(nameA, mapA, nameB, mapB) {
    let bothCorrect = 0, aOnly = 0, bOnly = 0, bothWrong = 0;
    ids.forEach(id => {
      const a = mapA.get(id), b = mapB.get(id);
      if (a && b) bothCorrect++; else if (a && !b) aOnly++; else if (!a && b) bOnly++; else bothWrong++;
    });
    const test = exactMcNemar(aOnly, bOnly);
    const accA = (bothCorrect + aOnly) / ids.length, accB = (bothCorrect + bOnly) / ids.length;
    return { comparison: `${nameA} vs ${nameB}`, n: ids.length, accuracy_A: +accA.toFixed(4), accuracy_B: +accB.toFixed(4), absolute_diff: +(accB - accA).toFixed(4), mcnemar_exact: test, significant_at_0_05: test.p_value < 0.05 };
  }

  const comparisons = [
    pairedMcNemar('A0', A0, 'A1', A1),
    pairedMcNemar('A0', A0, 'A2', A2),
    pairedMcNemar('A0', A0, 'A3', A3),
    pairedMcNemar('A2', A2, 'A3', A3)
  ];

  const confidenceIntervals = {
    A0_bm25_accuracy: wilsonCI([...A0.values()].filter(Boolean).length, ids.length),
    A2_dense_accuracy: wilsonCI([...A2.values()].filter(Boolean).length, ids.length),
    A3_hybrid_accuracy: wilsonCI([...A3.values()].filter(Boolean).length, ids.length)
  };

  const existing = read('research/results/v0.2/statistical-analysis-results.json');
  const output = { ...existing, accuracy_comparisons: comparisons, confidence_intervals_95pct_accuracy: confidenceIntervals };
  fs.writeFileSync(path.join(projectRoot, 'research/results/v0.2/statistical-analysis-results.json'), JSON.stringify(output, null, 2), 'utf-8');

  console.log('=== v0.2 FULL ACCURACY COMPARISONS (exact McNemar\'s, n=' + ids.length + ') ===');
  comparisons.forEach(c => console.log(`${c.comparison}: ${(c.accuracy_A*100).toFixed(1)}% vs ${(c.accuracy_B*100).toFixed(1)}% (diff=${(c.absolute_diff*100).toFixed(1)}pp), discordant=${c.mcnemar_exact.n_discordant}, p=${c.mcnemar_exact.p_value}, significant=${c.significant_at_0_05}`));
  console.log('\n95% Wilson CIs:');
  Object.entries(confidenceIntervals).forEach(([k, v]) => console.log(`  ${k}: ${(v.point*100).toFixed(1)}% [${(v.lower*100).toFixed(1)}%, ${(v.upper*100).toFixed(1)}%]`));
  console.log(`\nUpdated research/results/v0.2/statistical-analysis-results.json`);
}

main();
