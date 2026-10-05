// Final publication audit (2026-10-05): independent recomputation of headline numbers from raw per-query files.
// Read-only: writes nothing. Uses none of the project's analysis helpers.
//   node research/paper/final_audit/scripts/audit_recompute.js
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..').split(path.sep).join('/') + '/';
const J = p => JSON.parse(fs.readFileSync(ROOT + p, 'utf8'));
const out = [];
const say = (label, got, paper) => { out.push({ label, got, paper }); console.log(`${String(label).padEnd(58)} got ${String(got).padEnd(34)} paper ${paper}`); };
const r = (x, d = 3) => +(+x).toFixed(d);

const V = {
  'v0.1': { bench: 'research/datasets/termassist_bench_v0.1_validated.json', repro: 'research/results/baseline/reproduction-results.json', folds: 'research/results/hybrid/folds.json', feats: 'research/results/reliability/reliability_features.json' },
  'v0.2': { bench: 'research/datasets/termassist_bench_v0.2_validated.json', repro: 'research/results/v0.2/reproduction-results.json', folds: 'research/results/v0.2/folds.json', feats: 'research/results/v0.2/reliability_features.json' }
};
const ece = (pairs, nb = 10) => { const b = Array.from({ length: nb }, () => ({ c: 0, h: 0, n: 0 })); for (const { c, h } of pairs) { let i = Math.min(nb - 1, Math.max(0, Math.floor(c * nb))); b[i].c += c; b[i].h += h; b[i].n++; } return b.reduce((g, x) => g + (x.n ? (x.n / pairs.length) * Math.abs(x.c / x.n - x.h / x.n) : 0), 0); };
// my own pooled-adjacent-violators fit (ties aggregated), step-function prediction
function pava(pairs) {
  const m = new Map(); for (const { x, y } of pairs) { const g = m.get(x) || { s: 0, w: 0 }; g.s += y; g.w++; m.set(x, g); }
  const pts = [...m.entries()].sort((a, b) => a[0] - b[0]).map(([x, g]) => ({ lo: x, hi: x, s: g.s, w: g.w }));
  const st = []; for (const p of pts) { st.push(p); while (st.length > 1 && st[st.length - 2].s / st[st.length - 2].w > st[st.length - 1].s / st[st.length - 1].w) { const t = st.pop(), q = st.pop(); st.push({ lo: q.lo, hi: t.hi, s: q.s + t.s, w: q.w + t.w }); } }
  return st.map(b => ({ lo: b.lo, hi: b.hi, v: b.s / b.w }));
}
const pavaPredict = (blocks, x) => { for (const b of blocks) if (x >= b.lo && x <= b.hi) return b.v; if (x < blocks[0].lo) return blocks[0].v; if (x > blocks[blocks.length - 1].hi) return blocks[blocks.length - 1].v; for (let i = 0; i < blocks.length - 1; i++) if (x > blocks[i].hi && x < blocks[i + 1].lo) { const t = (x - blocks[i].hi) / (blocks[i + 1].lo - blocks[i].hi); return blocks[i].v + t * (blocks[i + 1].v - blocks[i].v); } };
function tuneThreshold(dev) { // dev: [{s, ood}], predict OOD if s < t; candidates: observed dev scores; F1 ties -> lowest
  const cands = [...new Set(dev.map(d => d.s))].sort((a, b) => a - b); let best = { t: cands[0], f1: -1 };
  for (const t of cands) { let tp = 0, fp = 0, fn = 0; for (const d of dev) { const pred = d.s < t; if (pred && d.ood) tp++; else if (pred && !d.ood) fp++; else if (!pred && d.ood) fn++; } const p = tp + fp ? tp / (tp + fp) : 0, rc = tp + fn ? tp / (tp + fn) : 0, f1 = p + rc ? 2 * p * rc / (p + rc) : 0; if (f1 > best.f1) best = { t, f1 }; }
  return best.t;
}
const binomTail = (n, k) => { let s = 0; for (let i = 0; i <= k; i++) { let c = 1; for (let j = 0; j < i; j++) c = c * (n - j) / (j + 1); s += c; } return Math.min(1, 2 * s / 2 ** n); };

for (const v of ['v0.1', 'v0.2']) {
  const q = J(V[v].bench).queries, repro = J(V[v].repro), folds = J(V[v].folds).assignment, feats = J(V[v].feats).features;
  const Q = new Map(q.map(x => [x.id, x])), F = new Map(feats.map(f => [f.id, f]));
  const isCtrl = id => Q.get(id).query_type === 'canonical';
  const label = id => repro.find(x => x.id === id).expected.classification;
  console.log(`\n--- ${v}: ${q.length} queries, ${q.filter(x => x.query_type === 'canonical').length} controls`);
  const hit = x => ['CORRECT', 'AMBIGUOUS_CORRECT'].includes(x.evaluation.status) ? 1 : 0;
  if (v === 'v0.1') {
    const okAll = repro.filter(x => ['CORRECT', 'AMBIGUOUS_CORRECT', 'OOD_CORRECT_REJECTION'].includes(x.evaluation.status)).length;
    say('v0.1 overall correct (incl. correct rejections) / 150', `${okAll}/${repro.length} = ${r(100 * okAll / repro.length, 1)}%`, '67.3%');
    const wrong = repro.filter(x => ['INCORRECT', 'AMBIGUOUS_INCORRECT', 'OOD_FALSE_ACCEPT'].includes(x.evaluation.status) && x.actual.confidence > 0);
    say('v0.1 wrong answered: n, mean conf, share at 100%', `${wrong.length}, ${r(wrong.reduce((a, x) => a + x.actual.confidence, 0) / wrong.length, 2)}, ${r(100 * wrong.filter(x => x.actual.confidence === 100).length / wrong.length, 1)}%`, '49, 86, 44.9%');
    say('v0.1 wrong answered that are controls', wrong.filter(x => isCtrl(x.id)).length, '0');
  }
  const nc = repro.filter(x => !isCtrl(x.id));
  const inScope = nc.filter(x => x.expected.classification !== 'OOD'), ood = nc.filter(x => x.expected.classification === 'OOD');
  say(`${v} non-control n; in-scope; OOD`, `${nc.length}; ${inScope.length}; ${ood.length}`, v === 'v0.1' ? '125; 110; 15' : '184; 134; 50');
  say(`${v} BM25 in-scope hits`, `${inScope.filter(hit).length}/${inScope.length}`, v === 'v0.1' ? '72/110' : '95/134');
  const rawPairs = nc.map(x => ({ c: x.actual.confidence / 100, h: hit(x) }));
  say(`${v} raw ECE (10 equal-width, non-control)`, r(ece(rawPairs)), v === 'v0.1' ? '0.323' : '0.293');
  const top = rawPairs.filter(p => p.c >= 0.9);
  say(`${v} top bin: share, mean conf, accuracy`, `${r(100 * top.length / rawPairs.length, 0)}%, ${r(100 * top.reduce((a, p) => a + p.c, 0) / top.length, 0)}%, ${r(100 * top.reduce((a, p) => a + p.h, 0) / top.length, 0)}%`, v === 'v0.1' ? '77%, 99%, 70%' : '63%, 99%, 73%');
  // isotonic, fit on dev folds, controls excluded from fit and evaluation
  const after = []; for (let k = 0; k < 5; k++) { const dev = nc.filter(x => folds[x.id] !== k).map(x => ({ x: x.actual.confidence / 100, y: hit(x) })); const bl = pava(dev); nc.filter(x => folds[x.id] === k).forEach(x => after.push({ c: pavaPredict(bl, x.actual.confidence / 100), h: hit(x) })); }
  const e0 = ece(rawPairs), e1 = ece(after);
  say(`${v} isotonic ECE; reduction`, `${r(e1)}; ${r(100 * (1 - e1 / e0), 0)}%`, v === 'v0.1' ? '0.069; 79%' : '0.063; 78%');
  // fold checks
  const sizes = [0, 1, 2, 3, 4].map(k => Object.values(folds).filter(f => f === k).length);
  const oodPer = [0, 1, 2, 3, 4].map(k => repro.filter(x => folds[x.id] === k && x.expected.classification === 'OOD').length);
  say(`${v} fold sizes; OOD per fold`, `${sizes.join(',')}; ${oodPer.join(',')}`, 'stratified');
  // fixed rule
  const fixedRej = x => !(x.actual.confidence > 0 && x.actual.score >= 2.0);
  say(`${v} fixed rule: OOD rejected; in-scope refused; controls refused`, `${ood.filter(fixedRej).length}/${ood.length}; ${inScope.filter(fixedRej).length}; ${repro.filter(x => isCtrl(x.id) && fixedRej(x)).length}`, v === 'v0.1' ? '4/15; 0; 0' : '17/50; 0; 0');
  // tuned shipped threshold, re-derived per fold from the development folds (all queries, as the code does)
  const thr = [], rejT = new Set();
  for (let k = 0; k < 5; k++) { const dev = repro.filter(x => folds[x.id] !== k).map(x => ({ s: x.actual.score, ood: x.expected.classification === 'OOD' })); const t = tuneThreshold(dev); thr.push(t); repro.filter(x => folds[x.id] === k && x.actual.score < t).forEach(x => rejT.add(x.id)); }
  say(`${v} tuned shipped thresholds per fold (re-derived)`, thr.map(t => r(t, 4)).join(', '), v === 'v0.1' ? '6.1905, 5.4242 x4' : '6.4952 x3, 7.1978, 6.4952');
  say(`${v} tuned: OOD rejected; in-scope refused; controls refused`, `${ood.filter(x => rejT.has(x.id)).length}/${ood.length}; ${inScope.filter(x => rejT.has(x.id)).length}; ${repro.filter(x => isCtrl(x.id) && rejT.has(x.id)).length}`, v === 'v0.1' ? '10/15; 9; 0' : '46/50; 20; 0');
  // hybrid detector, re-derived from the fused top-1 feature
  const thrD = [], rejD = new Set();
  for (let k = 0; k < 5; k++) { const dev = repro.filter(x => folds[x.id] !== k).map(x => ({ s: F.get(x.id).top1_score, ood: x.expected.classification === 'OOD' })); const t = tuneThreshold(dev); thrD.push(t); repro.filter(x => folds[x.id] === k && F.get(x.id).top1_score < t).forEach(x => rejD.add(x.id)); }
  say(`${v} detector thresholds per fold (re-derived)`, thrD.map(t => r(t, 4)).join(', '), v === 'v0.1' ? '0.833-0.895' : '0.9179, 0.9219, 0.8841, 0.9247, 0.9219');
  say(`${v} detector: OOD rejected; in-scope refused`, `${ood.filter(x => rejD.has(x.id)).length}/${ood.length}; ${inScope.filter(x => rejD.has(x.id)).length}`, v === 'v0.1' ? '7/15; 6' : '34/50; 11');
  // McNemar: detector vs fixed (OOD), tuned vs detector (OOD), tuned vs detector (false rejections)
  const disc = (set, A, B) => [set.filter(x => A(x) && !B(x)).length, set.filter(x => !A(x) && B(x)).length];
  const [a1, b1] = disc(ood, x => rejD.has(x.id), fixedRej), [a2, b2] = disc(ood, x => rejT.has(x.id), x => rejD.has(x.id)), [a3, b3] = disc(inScope, x => rejT.has(x.id), x => rejD.has(x.id));
  say(`${v} McNemar detector vs fixed (OOD)`, `${a1}-${b1}, p=${binomTail(a1 + b1, Math.min(a1, b1)).toPrecision(3)}`, v === 'v0.1' ? '3-0, 0.25' : '17-0, 1.5e-5');
  say(`${v} McNemar tuned vs detector (OOD); (false rej.)`, `${a2}-${b2}, p=${binomTail(a2 + b2, Math.min(a2, b2)).toPrecision(3)}; ${a3}-${b3}, p=${binomTail(a3 + b3, Math.min(a3, b3)).toPrecision(3)}`, v === 'v0.1' ? '0.25' : '14-2, 0.004; 16-7, 0.093');
  // hybrid accuracy and McNemar vs BM25
  const hHit = id => (F.get(id).hit ? 1 : 0);
  say(`${v} hybrid in-scope hits`, `${inScope.filter(x => hHit(x.id)).length}/${inScope.length}`, v === 'v0.1' ? '79/110' : '101/134');
  const bo = inScope.filter(x => hit(x) && !hHit(x.id)).length, ho = inScope.filter(x => !hit(x) && hHit(x.id)).length;
  say(`${v} BM25-only vs hybrid-only correct; exact p`, `${bo}-${ho}; ${binomTail(bo + ho, Math.min(bo, ho)).toPrecision(3)}`, v === 'v0.1' ? '0-7; 0.0156' : '1-7; 0.0703');
  // duplicates
  const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim(); const seen = new Map(); const dups = [];
  q.forEach(x => { const k = norm(x.query); if (seen.has(k)) dups.push(`${seen.get(k)}=${x.id}`); else seen.set(k, x.id); });
  say(`${v} duplicate queries (normalized text)`, dups.length ? dups.join(' ') : 'none', 'none claimed');
}

// Holm (v0.2 family), from the raw p-values recomputed above
{ const ps = [0.0703125, 0.012726, 1.526e-5, 1e-4].map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p); let run = 0; const adj = []; ps.forEach((x, k) => { run = Math.max(run, Math.min(1, x.p * (ps.length - k))); adj[x.i] = run; });
  say('Holm v0.2: hybrid-BM25, hybrid-dense, detector-fixed, calib', adj.map(x => x.toPrecision(3)).join(', '), '0.0703, 0.0255, 0.00006, <=0.0003'); }
// Wilson 1/20
{ const k = 1, n = 20, z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; say('Wilson 1/20', `[${r(100 * (c - m), 1)}, ${r(100 * (c + m), 1)}]%`, '[0.9, 23.6]%'); }

// External check: rates from the per-request decisions
console.log('\n--- E1');
for (const [P, n] of [['p1', 4500], ['p2', 1000]]) {
  const d = J(`research/results/e1_clinc150_v1/decisions_${P}.json`).rows;
  const rate = f => 100 * d.filter(f).length / d.length;
  const med = key => { const a = [0, 1, 2, 3, 4].map(k => rate(x => x[key][k])).sort((x, y) => x - y); return `${r(a[2], 1)} (${r(a[0], 1)}-${r(a[4], 1)})`; };
  say(`E1 ${P} n; fixed; CLI rule`, `${d.length}; ${r(rate(x => x.R1), 1)}; ${r(rate(x => x.R1_CLI), 1)}`, P === 'p1' ? '4500; 25.3; 25.5' : '1000; 19.1; 19.8');
  say(`E1 ${P} tuned median (range); detector median (range)`, `${med('R2_fold')}; ${med('R3_fold')}`, P === 'p1' ? '86.0 (86.0-92.2); 77.8 (69.3-78.2)' : '83.4 (83.4-89.4); 78.1 (69.3-78.6)');
  say(`E1 ${P} R2 flag; R3 flag; equal cost shipped / hybrid`, `${r(rate(x => x.R2), 1)}; ${r(rate(x => x.R3), 1)}; ${r(rate(x => x.R2m), 1)} / ${r(rate(x => x.R3m), 1)}`, P === 'p1' ? '86.0; 77.8; 64.6 / 77.1' : '83.4; 78.1; 59.7 / 77.0');
  if (P === 'p2') { const b = d.filter(x => x.R2 && !x.R3).length, c = d.filter(x => !x.R2 && x.R3).length; say('E1 p2 tuned-only vs detector-only; exact p (x3 Holm)', `${b}-${c}; raw ${binomTail(b + c, Math.min(b, c)).toPrecision(3)}`, 'Holm p = .001'); }
}

// Annotation: kappa from the per-item file
console.log('\n--- annotation');
{ const rows = fs.readFileSync(ROOT + 'research/results/annotation/per_item.csv', 'utf8').replace(/\r\n/g, '\n').trim().split('\n').slice(1).map(l => l.split(','));
  const use = rows.filter(x => x[0] !== 'TA-B187'); const L = ['CLEAR', 'AMBIGUOUS', 'OOD'];
  const n = use.length, agree = use.filter(x => x[3] === x[5]).length, po = agree / n;
  const pe = L.reduce((a, l) => a + (use.filter(x => x[3] === l).length / n) * (use.filter(x => x[5] === l).length / n), 0);
  say('kappa (78 items); agreement', `${r((po - pe) / (1 - pe), 3)}; ${r(100 * po, 1)}% (n=${n})`, '0.980; 98.7%');
  const tg = use.filter(x => x[1] === 'target'), nt = tg.length, pot = tg.filter(x => x[3] === x[5]).length / nt, pet = L.reduce((a, l) => a + (tg.filter(x => x[3] === l).length / nt) * (tg.filter(x => x[5] === l).length / nt), 0);
  say('kappa targets only', `${r((pot - pet) / (1 - pet), 3)} (n=${nt})`, '0.967 (58)');
  const oodT = tg.filter(x => x[2] === 'OOD'); say('OOD targets kept by both', `${oodT.filter(x => x[3] === 'OOD' && x[5] === 'OOD').length}/${oodT.length}`, '35/35');
  const amb = tg.filter(x => x[2] === 'AMBIGUOUS'); say('ambiguous targets: confirmed / both clear / split', `${amb.filter(x => x[3] === 'AMBIGUOUS' && x[5] === 'AMBIGUOUS').length} / ${amb.filter(x => x[3] === 'CLEAR' && x[5] === 'CLEAR').length} / ${amb.filter(x => x[3] !== x[5]).length} of ${amb.length}`, '18 / 4 / 1 of 23'); }
