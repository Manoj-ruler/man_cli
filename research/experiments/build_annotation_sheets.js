// Builds the blind annotation sheets for the two-annotator re-annotation (Phase C), per
// research/datasets/annotation/ANNOTATION_PROTOCOL.md sections 1-2.
//
//   node build_annotation_sheets.js               -> Tier 1 only (59 targets + 20 controls = 79 items)
//   node build_annotation_sheets.js --with-tier2  -> Tier 1 + 29 v0.1 ambiguous/OOD items (108 items)
//
// Items: 59 AI-authored v0.2 targets (TA-B151..TA-B209) + 20 v0.1 controls (4 canonical + 16 across
// the other answerable types, classification CORRECT, gold+acceptable all in the win32 corpus view).
// Each annotator gets an independent seeded shuffle, anonymous item numbers, and QUERY TEXT ONLY.
//
// Outputs (sheets/ and coordinator/ are gitignored; deterministic, so anyone can regenerate them):
//   sheets/annotator_{1,2}_sheet.csv            -- given to annotators (no ids, labels, or types)
//   coordinator/KEY_DO_NOT_SHARE_WITH_ANNOTATORS.json -- item_no <-> benchmark id, original labels
//   SHEETS_MANIFEST.json (committed)            -- seeds, selection, and sha256 of each sheet

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.join(__dirname, '..', '..');
const dir = path.join(root, 'research/datasets/annotation');
const rd = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf-8'));
const WITH_TIER2 = process.argv.includes('--with-tier2');
const SAMPLE_SEED = 42, ORDER_SEEDS = { 1: 1001, 2: 1002 };

function mulberry32(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffled(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
let errors = 0; const fail = m => { errors++; console.error('FAIL  ' + m); };

// ---- data ----
const corpus = rd('cli/data/commands.json').filter(r => r.os.includes('all') || r.os.includes('win32'));
const visCmds = new Set(corpus.map(r => r.command));
const b1 = rd('research/datasets/termassist_bench_v0.1_validated.json').queries;
const b2 = rd('research/datasets/termassist_bench_v0.2_validated.json').queries;
const cls1 = new Map(rd('research/results/ablation/ablation-results.json').conditions.A3.per_query.map(r => [r.id, r.classification]));
const cls2 = new Map(rd('research/results/v0.2/ablation-results.json').conditions.A3.per_query.map(r => [r.id, r.classification]));
const num = id => +id.slice(-3);

// ---- targets: the 59 AI-authored v0.2 additions ----
const targets = b2.filter(q => num(q.id) >= 151 && num(q.id) <= 209)
  .map(q => ({ id: q.id, query: q.query, group: 'target', original_label: cls2.get(q.id), query_type: q.query_type, source: 'v0.2' }));
if (targets.length !== 59) fail(`expected 59 targets, got ${targets.length}`);
const tc = {}; targets.forEach(t => tc[t.original_label] = (tc[t.original_label] || 0) + 1);
if (tc.OOD !== 35 || tc.AMBIGUOUS !== 24) fail(`target class counts unexpected: ${JSON.stringify(tc)}`);

// ---- controls: v0.1 CORRECT, gold + acceptable all present in the win32 view ----
const clean = q => q.gold_command && visCmds.has(q.gold_command) && (q.acceptable_commands || []).every(a => visCmds.has(a));
const pool = b1.filter(q => cls1.get(q.id) === 'CORRECT' && clean(q));
const poolByType = {}; pool.forEach(q => (poolByType[q.query_type] = poolByType[q.query_type] || []).push(q));
const OTHER = ['low_overlap_paraphrase', 'paraphrase', 'polysemy', 'safety_sensitive', 'complex_multi_intent'].sort();
const rngS = mulberry32(SAMPLE_SEED);
const extraType = shuffled(OTHER, rngS)[0];              // 16 = 3 per type x 5 + 1 extra
const alloc = { canonical: 4 }; OTHER.forEach(t => alloc[t] = 3 + (t === extraType ? 1 : 0));
const controls = [];
for (const [type, n] of Object.entries(alloc)) {
  const p = poolByType[type] || [];
  if (p.length < n) { fail(`control pool for ${type} has ${p.length} < ${n}`); continue; }
  shuffled(p.slice().sort((a, b) => a.id.localeCompare(b.id)), rngS).slice(0, n)
    .forEach(q => controls.push({ id: q.id, query: q.query, group: 'control', original_label: 'CLEAR', query_type: q.query_type, source: 'v0.1' }));
}
if (controls.length !== 20) fail(`expected 20 controls, got ${controls.length}`);

// ---- tier 2 (optional): v0.1 ambiguous + OOD ----
let tier2 = [];
if (WITH_TIER2) {
  tier2 = b1.filter(q => ['AMBIGUOUS', 'OOD'].includes(cls1.get(q.id)))
    .map(q => ({ id: q.id, query: q.query, group: 'tier2', original_label: cls1.get(q.id), query_type: q.query_type, source: 'v0.1' }));
  if (tier2.length !== 29) fail(`expected 29 tier-2 items, got ${tier2.length}`);
}

const items = [...targets, ...controls, ...tier2];
// ---- integrity guards ----
if (new Set(items.map(i => i.id)).size !== items.length) fail('duplicate benchmark ids among items');
const normQ = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
const seenQ = new Map();
items.forEach(i => { const k = normQ(i.query); if (!k) fail(`${i.id}: empty query`); if (seenQ.has(k)) fail(`duplicate query text: ${i.id} and ${seenQ.get(k)} ("${i.query}")`); seenQ.set(k, i.id); });
if (errors) { console.error(`\nABORT: ${errors} problem(s); nothing written.`); process.exit(1); }

// ---- per-annotator blind sheets ----
const csvCell = s => '"' + String(s).replace(/"/g, '""') + '"';
const sheetDir = path.join(dir, 'sheets'), coordDir = path.join(dir, 'coordinator');
fs.mkdirSync(sheetDir, { recursive: true }); fs.mkdirSync(coordDir, { recursive: true });
const orders = {}, hashes = {};
for (const a of [1, 2]) {
  const order = shuffled(items.slice().sort((x, y) => x.id.localeCompare(y.id)), mulberry32(ORDER_SEEDS[a]));
  orders[a] = order.map(i => i.id);
  const lines = ['item_no,query,label,confidence,record_ids,comment'];
  order.forEach((it, k) => lines.push([k + 1, csvCell(it.query), '', '', '', ''].join(',')));
  const text = lines.join('\r\n') + '\r\n';
  if (/TA-B\d+/i.test(text) || /tac-\d+/i.test(text)) fail(`annotator ${a} sheet leaks an id`);
  fs.writeFileSync(path.join(sheetDir, `annotator_${a}_sheet.csv`), '﻿' + text, 'utf-8');
  hashes[a] = sha(text);
}
if (JSON.stringify(orders[1]) === JSON.stringify(orders[2])) fail('both annotators got the same order');
if (new Set(orders[1]).size !== items.length || orders[1].slice().sort().join() !== orders[2].slice().sort().join()) fail('annotators do not share the same item set');
if (errors) { console.error(`\nABORT: ${errors} problem(s).`); process.exit(1); }

fs.writeFileSync(path.join(sheetDir, 'HOW_TO_RETURN.md'),
`# How to fill in and return your sheet

Open \`annotator_N_sheet.csv\` (N is your number) in Excel or any editor. Fill in the last four columns for **every** row:

- \`label\`: CLEAR, AMBIGUOUS, or OOD (exactly these words)
- \`confidence\`: 1, 2, or 3
- \`record_ids\`: the id(s) from the list that perform each reading you kept, separated by semicolons (e.g. \`tac-0116;tac-0127\`), or \`none\` for OOD
- \`comment\`: optional, one line

Do not change the \`item_no\` or \`query\` columns. Do not reorder rows. Work alone, and do not look up where these requests come from.
Save as CSV and send the file back to the coordinator.
`, 'utf-8');

const keyItems = items.map(i => ({ ...i, item_no_annotator_1: orders[1].indexOf(i.id) + 1, item_no_annotator_2: orders[2].indexOf(i.id) + 1 }));
fs.writeFileSync(path.join(coordDir, 'KEY_DO_NOT_SHARE_WITH_ANNOTATORS.json'), JSON.stringify({ tier2_included: WITH_TIER2, items: keyItems }, null, 2), 'utf-8');

const manifest = {
  generated_by: 'research/experiments/build_annotation_sheets.js', tier2_included: WITH_TIER2, n_items: items.length,
  counts: { targets: targets.length, controls: controls.length, tier2: tier2.length },
  seeds: { sampling: SAMPLE_SEED, annotator_order: ORDER_SEEDS },
  control_pool: { size: pool.length, by_type: Object.fromEntries(Object.entries(poolByType).map(([k, v]) => [k, v.length])), allocation: alloc, extra_type: extraType },
  control_ids: controls.map(c => c.id).sort(),
  excluded_from_control_pool: ['TA-B145 (NEEDS_CORRECTION, gold not in corpus)', 'TA-B149 (acceptable command not in corpus)'],
  sheet_sha256: { annotator_1: hashes[1], annotator_2: hashes[2] },
  note: 'Sheets and key are gitignored and regenerated deterministically from this script; this manifest lets a reader verify a regenerated copy matches.'
};
fs.writeFileSync(path.join(dir, 'SHEETS_MANIFEST.json'), JSON.stringify(manifest, null, 2), 'utf-8');

console.log(`items: ${items.length} (targets ${targets.length}: ${JSON.stringify(tc)}; controls ${controls.length}; tier2 ${tier2.length})`);
console.log(`control pool: ${pool.length} eligible; allocation ${JSON.stringify(alloc)}`);
console.log(`sheet sha256: A1 ${hashes[1].slice(0, 12)}…  A2 ${hashes[2].slice(0, 12)}…`);
console.log('wrote sheets/annotator_{1,2}_sheet.csv, sheets/HOW_TO_RETURN.md, coordinator/KEY_*.json, SHEETS_MANIFEST.json');
