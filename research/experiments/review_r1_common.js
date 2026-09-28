// Shared helpers for the T18 analyses that answer review round 1
// (research/paper/review_round1/phase2_editorial_decision.md). Builds on phase1_common.js; every T18
// script first reproduces committed numbers through C.guard and aborts before writing if any fail.
const fs = require('fs');
const path = require('path');
const C = require('./phase1_common');

const OUT_DIR = path.join(C.root, 'research/results/review_r1');

function writeOut(name, obj) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = { generated_at: new Date().toISOString(), status: 'post hoc, exploratory (answers review round 1)', ...obj };
  fs.writeFileSync(path.join(OUT_DIR, name + '.json'), JSON.stringify(out, null, 2) + '\n', 'utf-8');
  console.log(`wrote research/results/review_r1/${name}.json`);
}

// Raw retrieval scores behind the v0.2 OOD screen: top-1 BM25 (with the +15 bonus, as in the
// adjudication report) and top-1 dense cosine, per query id.
function rawTopScores(version) {
  const p = version === 'v0.1' ? 'research/results/hybrid/query_scores_cache.json' : 'research/results/v0.2/query_scores_cache.json';
  const cache = C.rd(p).queries;
  return new Map(cache.map(q => [q.id, { bm25: Math.max(...q.lexical.map(c => c.score)), cos: Math.max(...q.dense.map(c => c.score)) }]));
}

// Equal-mass (quantile) binning ECE: bins hold ~n/nBins predictions each; ties are kept together.
function eceEqualMass(pairs, nBins = 10) {
  const s = pairs.slice().sort((a, b) => a.conf - b.conf), n = s.length;
  const bins = []; let start = 0;
  for (let b = 0; b < nBins && start < n; b++) {
    let end = b === nBins - 1 ? n : Math.round(((b + 1) * n) / nBins);
    if (end <= start) continue;
    while (end < n && s[end].conf === s[end - 1].conf) end++; // do not split a tie block
    bins.push(s.slice(start, end)); start = end;
  }
  if (start < n) bins.push(s.slice(start));
  return bins.reduce((g, bin) => { const c = bin.reduce((a, x) => a + x.conf, 0) / bin.length, h = bin.reduce((a, x) => a + x.hit, 0) / bin.length; return g + (bin.length / n) * Math.abs(c - h); }, 0);
}

// ECE-sweep (Roelofs et al., AISTATS 2022): equal-mass binning with the largest number of bins for
// which the bin accuracies are monotone non-decreasing in confidence.
function eceSweep(pairs) {
  const s = pairs.slice().sort((a, b) => a.conf - b.conf), n = s.length;
  let best = eceEqualMass(pairs, 1), bestB = 1;
  for (let B = 2; B <= n; B++) {
    const accs = []; let start = 0, ok = true;
    for (let b = 0; b < B && start < n; b++) {
      let end = b === B - 1 ? n : Math.round(((b + 1) * n) / B);
      if (end <= start) continue;
      while (end < n && s[end].conf === s[end - 1].conf) end++;
      const bin = s.slice(start, end); accs.push(bin.reduce((a, x) => a + x.hit, 0) / bin.length); start = end;
    }
    for (let i = 1; i < accs.length; i++) if (accs[i] < accs[i - 1]) { ok = false; break; }
    if (!ok) break;
    best = eceEqualMass(pairs, B); bestB = B;
  }
  return { ece: best, bins: bestB };
}

module.exports = { C, OUT_DIR, writeOut, rawTopScores, eceEqualMass, eceSweep };
