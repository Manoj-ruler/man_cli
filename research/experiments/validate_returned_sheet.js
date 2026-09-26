// Validates a sheet returned by an annotator against the sheet that was issued to them.
//   node validate_returned_sheet.js <returned.csv> <annotator 1|2>
// ERRORS (must be fixed before analysis): tampered/missing rows or query text, invalid label or
// confidence, unknown record ids. WARNINGS (kept, but flagged for the coordinator to look at):
// an id-less CLEAR/AMBIGUOUS, an OOD with ids, or AMBIGUOUS with fewer than two ids -- these are
// signs the annotator did not follow the procedure, not data errors.
// Exit code 1 if any ERROR.

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');
const dir = path.join(root, 'research/datasets/annotation');
const [file, ann] = process.argv.slice(2);
if (!file || !['1', '2'].includes(ann)) { console.error('usage: node validate_returned_sheet.js <returned.csv> <1|2>'); process.exit(2); }

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

const issued = parseCsv(fs.readFileSync(path.join(dir, `sheets/annotator_${ann}_sheet.csv`), 'utf-8'));
const returned = parseCsv(fs.readFileSync(file, 'utf-8'));
const corpusIds = new Set(fs.readFileSync(path.join(dir, 'corpus_view_win32.tsv'), 'utf-8').trim().split('\n').slice(1).map(l => l.split('\t')[0]));
const errors = [], warnings = [];
const HEADER = 'item_no,query,label,confidence,record_ids,comment';
if (returned[0].join(',') !== HEADER) errors.push(`header is "${returned[0].join(',')}", expected "${HEADER}"`);
const iss = new Map(issued.slice(1).map(r => [r[0], r]));
const ret = new Map(returned.slice(1).map(r => [r[0], r]));
if (issued.length !== returned.length) errors.push(`row count ${returned.length - 1} != issued ${issued.length - 1}`);
const LABELS = new Set(['CLEAR', 'AMBIGUOUS', 'OOD']);
const out = [];
for (const [no, irow] of iss) {
  const r = ret.get(no);
  if (!r) { errors.push(`item ${no}: row missing`); continue; }
  if (r[1] !== irow[1]) errors.push(`item ${no}: query text was changed ("${irow[1]}" -> "${r[1]}")`);
  const label = (r[2] || '').trim().toUpperCase(), conf = (r[3] || '').trim();
  if ((r[2] || '').trim() !== label && LABELS.has(label)) warnings.push(`item ${no}: label "${r[2]}" normalized to ${label}`);
  if (!LABELS.has(label)) { errors.push(`item ${no}: label "${r[2] || ''}" is not CLEAR / AMBIGUOUS / OOD`); continue; }
  if (!['1', '2', '3'].includes(conf)) errors.push(`item ${no}: confidence "${conf}" is not 1, 2, or 3`);
  const raw = (r[4] || '').trim(); const ids = raw.toLowerCase() === 'none' || raw === '' ? [] : raw.split(/[;,\s]+/).filter(Boolean).map(s => s.toLowerCase());
  ids.forEach(id => { if (!corpusIds.has(id)) errors.push(`item ${no}: record id "${id}" is not in the list`); });
  if (label === 'OOD' && ids.length) warnings.push(`item ${no}: OOD but record ids given (${ids.join(';')})`);
  if (label === 'CLEAR' && ids.length < 1) warnings.push(`item ${no}: CLEAR with no record id`);
  if (label === 'AMBIGUOUS' && ids.length < 2) warnings.push(`item ${no}: AMBIGUOUS with fewer than two record ids`);
  out.push({ no, label, conf: +conf, ids });
}
const dist = {}; out.forEach(o => dist[o.label] = (dist[o.label] || 0) + 1);
const lowConf = out.filter(o => o.conf === 1).length;
console.log(`annotator ${ann}: ${out.length}/${iss.size} items parsed | labels ${JSON.stringify(dist)} | confidence-1 items: ${lowConf}`);
const show = (arr, tag, log) => { arr.slice(0, 20).forEach(x => log(`${tag} ${x}`)); if (arr.length > 20) log(`${tag} ... and ${arr.length - 20} more`); };
show(warnings, 'WARN  ', console.log);
show(errors, 'ERROR ', console.error);
console.log(errors.length ? `\nINVALID: ${errors.length} error(s), ${warnings.length} warning(s)` : `\nVALID: 0 errors, ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
