// Builds and verifies the practice set for the annotation study.
//   node build_practice_set.js                          -> verify, then write the practice sheet + private key/feedback
//   node build_practice_set.js --score <returned.csv>   -> compare a returned practice sheet with the key (coordinator use)
//
// Verification (aborts on failure, before writing anything): the shared checks in
// annotation_common.js (ids exist, label/reading consistency, OOD absent-terms, no benchmark
// collision, no duplicates) PLUS no collision with the codebook's worked examples, PLUS a check that
// every single-token (bare-name) item obeys the codebook's own bare-name rule (Section 6.1):
//   0 records mention the name -> OOD;  1 -> CLEAR;  2 -> apply the plausibility test (borderline);  >=3 -> AMBIGUOUS.
//
// Outputs (gitignored; the source practice_items.json is committed):
//   sheets/practice/PRACTICE_SHEET.csv          -- same columns as the real sheet, one fixed shuffled order (seed 7)
//   coordinator/PRACTICE_KEY.json                -- item_no -> id, label, difficulty
//   coordinator/PRACTICE_FEEDBACK.md             -- answers + reasoning, sent to BOTH annotators only AFTER they return the practice sheet

const fs = require('fs');
const path = require('path');
const { dir, rd, view, byId, nearest, verifyItems } = require('./annotation_common');

function mulberry32(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffled(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const items = rd('research/datasets/annotation/practice_items.json').items;
const workedQueries = rd('research/datasets/annotation/codebook_examples.json').examples.map(e => e.query);
const keyPath = path.join(dir, 'coordinator/PRACTICE_KEY.json');

// ---------- scoring mode ----------
if (process.argv.includes('--score')) {
  const file = process.argv[process.argv.indexOf('--score') + 1];
  const key = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
  const text = fs.readFileSync(file, 'utf-8').replace(/^﻿/, '');
  const rows = []; { let row = [], cell = '', q = false; for (let i = 0; i < text.length; i++) { const c = text[i]; if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; } else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; } else cell += c; } if (cell || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); } }
  const got = new Map(rows.slice(1).filter(r => r[0]).map(r => [r[0], (r[2] || '').trim().toUpperCase()]));
  let core = 0, coreOk = 0; const miss = [];
  key.items.forEach(k => {
    const g = got.get(String(k.item_no)); const ok = g === k.label;
    if (k.difficulty === 'core') { core++; if (ok) coreOk++; }
    console.log(`${ok ? 'match   ' : 'MISMATCH'} ${k.id} [${k.difficulty}] "${k.query}": key ${k.label}, annotator "${g || '(blank)'}"`);
    if (!ok && k.difficulty === 'core') miss.push(k.id);
  });
  console.log(`\ncore items matched: ${coreOk}/${core}` + (miss.length ? `   missed: ${miss.join(', ')}` : ''));
  console.log(coreOk < core - 1 ? 'FLAG: 2 or more core items missed -> discuss the RULES (not the items) via the clarification log before the real sheet.' : 'OK: no more than one core item missed.');
  console.log('Borderline items are descriptive only. Practice labels never enter the kappa.');
  process.exit(0);
}

// ---------- verification ----------
const errors = verifyItems(items, { extraQueries: workedQueries });
items.forEach(e => {
  const toks = e.query.trim().split(/\s+/);
  if (toks.length !== 1) return;
  const name = toks[0].toLowerCase();
  const n = view.filter(r => (r.intent + ' ' + r.command + ' ' + r.category).toLowerCase().includes(name)).length;
  const expected = n === 0 ? 'OOD' : n === 1 ? 'CLEAR' : n === 2 ? '(plausibility test; borderline)' : 'AMBIGUOUS';
  const ok = n === 2 ? e.difficulty === 'borderline' : expected === e.label;
  console.log(`bare-name check ${e.id} "${e.query}": ${n} record(s) mention it -> rule says ${expected}; key says ${e.label} ${ok ? 'OK' : 'MISMATCH'}`);
  if (!ok) errors.push(`${e.id}: key ${e.label} contradicts the codebook's bare-name rule (${n} records -> ${expected})`);
});
const core = items.filter(i => i.difficulty === 'core').length;
if (items.length < 8) errors.push('practice set must have at least 8 items');
if (core < 8) errors.push(`need at least 8 core items, have ${core}`);
if (errors.length) { errors.forEach(e => console.error('FAIL  ' + e)); console.error(`\nABORT: ${errors.length} verification failure(s); nothing written.`); process.exit(1); }
console.log(`\npractice items verified: ${items.length} (${core} core, ${items.length - core} borderline)`);
const dist = {}; items.forEach(i => dist[i.label] = (dist[i.label] || 0) + 1); console.log('label mix:', JSON.stringify(dist));

// nearest benchmark neighbours, for a human check that practice items are far from the real ones
console.log('\nnearest benchmark queries (token Jaccard) -- eyeball these for semantic closeness:');
items.forEach(i => console.log('  ' + i.id + ' "' + i.query + '"  ~  ' + nearest(i.query, 2).map(n => `${n.id} "${n.query}" (${n.j.toFixed(2)})`).join('  |  ')));

// ---------- outputs ----------
const order = shuffled(items.slice().sort((a, b) => a.id.localeCompare(b.id)), mulberry32(7));
const cell = s => '"' + String(s).replace(/"/g, '""') + '"';
fs.mkdirSync(path.join(dir, 'sheets/practice'), { recursive: true }); fs.mkdirSync(path.join(dir, 'coordinator'), { recursive: true });
const lines = ['item_no,query,label,confidence,record_ids,comment'].concat(order.map((it, k) => [k + 1, cell(it.query), '', '', '', ''].join(',')));
const sheet = lines.join('\r\n') + '\r\n';
if (/(^|[^A-Za-z])P\d+\b/.test(sheet) || /tac-\d+|TA-B\d+/i.test(sheet)) { console.error('ABORT: practice sheet leaks an id'); process.exit(1); }
fs.writeFileSync(path.join(dir, 'sheets/practice/PRACTICE_SHEET.csv'), '﻿' + sheet, 'utf-8');
fs.writeFileSync(keyPath, JSON.stringify({ items: order.map((it, k) => ({ item_no: k + 1, id: it.id, query: it.query, label: it.label, difficulty: it.difficulty })) }, null, 2), 'utf-8');

const cmd = id => '`' + byId.get(id).command.slice(0, 70) + (byId.get(id).command.length > 70 ? '…' : '') + '`';
const fb = ['# Practice-set feedback', '',
  'Send this to **both** annotators at the same time, **after** each has returned the practice sheet. It shows the codebook authors\' answers and reasoning.', '',
  '- **core** items have one defensible answer under the codebook. If yours differs, re-read the cited step.',
  '- **borderline** items are ones where reasonable annotators may differ. They are here to practice the *reasoning*, not to match a key, and they are not scored.',
  '- Practice labels never enter the agreement statistics.', ''];
order.forEach((it, k) => {
  fb.push(`## ${k + 1}. "${it.query}" → **${it.label}** (${it.difficulty})`, '');
  it.readings.forEach(r => fb.push(`- *${r.reading}*: ${r.ids.length ? r.ids.map(i => `${i} (${cmd(i)})`).join('; ') : '**no record**'}`));
  fb.push(`- ${it.why}`, '');
});
fs.writeFileSync(path.join(dir, 'coordinator/PRACTICE_FEEDBACK.md'), fb.join('\n'), 'utf-8');
console.log('\nwrote sheets/practice/PRACTICE_SHEET.csv, coordinator/PRACTICE_KEY.json, coordinator/PRACTICE_FEEDBACK.md');
