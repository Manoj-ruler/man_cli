// Shared context + verification for the annotation materials (worked examples and practice set).
// A list of illustrative items is only accepted if:
//   1. every cited corpus id exists in the win32-visible corpus view,
//   2. label and cited readings are consistent (OOD => no supporting record; AMBIGUOUS => >=2
//      supported readings; CLEAR => >=1),
//   3. every OOD item's absent_terms occur in NO corpus record,
//   4. no item is identical or near-identical (token Jaccard >= jaccardMax) to any v0.1/v0.2
//      benchmark query, or to any query in extraQueries (e.g. the worked examples),
//   5. no two items share the same query text.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');
const dir = path.join(root, 'research/datasets/annotation');
const rd = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf-8'));

const corpus = rd('cli/data/commands.json');
const view = corpus.filter(r => r.os.includes('all') || r.os.includes('win32'));
const byId = new Map(view.map(r => [r.command_id, r]));
const corpusText = view.map(r => (r.intent + ' ' + r.command + ' ' + (r.description || '') + ' ' + r.category).toLowerCase());
const bench = [...rd('research/datasets/termassist_bench_v0.1_validated.json').queries, ...rd('research/datasets/termassist_bench_v0.2_validated.json').queries];

const tokens = s => new Set(String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean));
const jaccard = (a, b) => { const i = [...a].filter(x => b.has(x)).length; return i / (a.size + b.size - i); };

function nearest(query, k = 3) {
  const qt = tokens(query);
  return bench.map(b => ({ id: b.id, query: b.query, j: jaccard(qt, tokens(b.query)) })).sort((x, y) => y.j - x.j).slice(0, k);
}

function verifyItems(items, { extraQueries = [], jaccardMax = 0.5 } = {}) {
  const errors = [];
  const seen = new Map();
  items.forEach(e => {
    e.readings.forEach(r => r.ids.forEach(id => { if (!byId.has(id)) errors.push(`${e.id}: cited ${id} is not in the win32-visible corpus`); }));
    const supported = e.readings.filter(r => r.ids.length > 0);
    if (e.label === 'OOD' && supported.length !== 0) errors.push(`${e.id}: OOD item cites supporting records`);
    if (e.label === 'AMBIGUOUS' && supported.length < 2) errors.push(`${e.id}: AMBIGUOUS item needs >=2 supported readings`);
    if (e.label === 'CLEAR' && supported.length < 1) errors.push(`${e.id}: CLEAR item needs a supporting record`);
    (e.absent_terms || []).forEach(t => {
      const hits = corpusText.filter(x => x.includes(t.toLowerCase())).length;
      if (hits) errors.push(`${e.id}: absent term "${t}" appears in ${hits} corpus record(s)`);
    });
    const et = tokens(e.query);
    bench.forEach(q => { const j = jaccard(et, tokens(q.query)); if (j >= jaccardMax) errors.push(`${e.id} "${e.query}" too close to benchmark ${q.id} "${q.query}" (Jaccard ${j.toFixed(2)})`); });
    extraQueries.forEach(q => { const j = jaccard(et, tokens(q)); if (j >= jaccardMax) errors.push(`${e.id} "${e.query}" too close to worked example "${q}" (Jaccard ${j.toFixed(2)})`); });
    const k = e.query.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(k)) errors.push(`${e.id}: duplicate query text with ${seen.get(k)}`); seen.set(k, e.id);
  });
  return [...new Set(errors)];
}

// ---- CSV, agreement statistics (used by the adjudication and analysis scripts) ----
function parseCsv(text) {
  text = text.replace(/^﻿/, ''); const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell.length || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
  return rows.filter(r => r.some(x => x !== ''));
}
const csvCell = s => '"' + String(s).replace(/"/g, '""') + '"';

function mulberry32(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffled(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// Unweighted Cohen's kappa. If chance agreement pe == 1 (both raters constant and identical) kappa is
// undefined; we return 1 when observed agreement is 1 and 0 otherwise, and flag it.
function cohenKappa(a, b, cats) {
  const n = a.length; if (!n) return { n: 0, po: NaN, pe: NaN, kappa: NaN, degenerate: true };
  let agree = 0; for (let i = 0; i < n; i++) if (a[i] === b[i]) agree++;
  const po = agree / n; let pe = 0;
  cats.forEach(c => { pe += (a.filter(x => x === c).length / n) * (b.filter(x => x === c).length / n); });
  if (pe >= 1 - 1e-12) return { n, po, pe, kappa: po === 1 ? 1 : 0, degenerate: true };
  return { n, po, pe, kappa: (po - pe) / (1 - pe), degenerate: false };
}
function bootstrapKappa(a, b, cats, { n = 10000, seed = 42 } = {}) {
  const rng = mulberry32(seed), m = a.length, ks = [];
  for (let k = 0; k < n; k++) { const ra = new Array(m), rb = new Array(m); for (let i = 0; i < m; i++) { const j = Math.floor(rng() * m); ra[i] = a[j]; rb[i] = b[j]; } ks.push(cohenKappa(ra, rb, cats).kappa); }
  ks.sort((x, y) => x - y);
  const pct = p => { const idx = (ks.length - 1) * p, lo = Math.floor(idx), hi = Math.ceil(idx); return lo === hi ? ks[lo] : ks[lo] + (ks[hi] - ks[lo]) * (idx - lo); };
  return { lo: pct(0.025), hi: pct(0.975), n_boot: n, seed };
}
function confusion(a, b, cats) { const m = {}; cats.forEach(r => { m[r] = {}; cats.forEach(c => { m[r][c] = 0; }); }); a.forEach((x, i) => { m[x][b[i]]++; }); return m; }

module.exports = { root, dir, rd, view, byId, bench, tokens, jaccard, nearest, verifyItems, parseCsv, csvCell, mulberry32, shuffled, cohenKappa, bootstrapKappa, confusion };
