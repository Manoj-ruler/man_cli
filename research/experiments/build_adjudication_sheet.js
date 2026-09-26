// Builds the adjudication sheet for the third reader (ANNOTATION_PROTOCOL.md section 4).
//   node build_adjudication_sheet.js                              build from returned/annotator_{1,2}.csv
//   node build_adjudication_sheet.js --validate <returned_adj.csv> check the adjudicator's returned sheet
//   add  --allow-synthetic --workdir <dir>  to run on test fixtures (outputs go ONLY to <dir>, stamped SYNTHETIC)
//
// Which items: every target (59 v0.2 additions, TA-B187 excluded: known defect) whose outcome is
//   REVERSED  = both annotators agree with each other but differ from the original label
//   CONTESTED = the annotators disagree with each other
// plus DECOYS: an equal number of CONFIRMED targets (both annotators = original), chosen with a
// seeded shuffle. Without decoys the adjudicator could infer "both annotators agree" => "differs from
// the original"; with them, unanimity is not informative. Decoy adjudications are descriptive only
// and never change a label.
//
// The adjudicator sees: query, both annotators' label / confidence / record ids / comment (as
// anonymous "A" and "B", randomly assigned per item). NOT shown: ids, the original label, the source.
// Controls are not adjudicated (protocol); their disputes are reported by analyze_annotation.js.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { dir, root, byId, parseCsv, csvCell, mulberry32, shuffled } = require('./annotation_common');

const args = process.argv.slice(2);
const flag = f => args.includes(f), val = f => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
const SYN = flag('--allow-synthetic');
const workdir = val('--workdir');
const LABELS = new Set(['CLEAR', 'AMBIGUOUS', 'OOD']);
const PRIMARY_EXCLUDED = new Set(['TA-B187']);

if (SYN) {
  if (!workdir) { console.error('--allow-synthetic requires --workdir <dir>'); process.exit(2); }
  const rel = path.relative(path.join(root, 'research'), path.resolve(workdir));
  if (!rel.startsWith('..') && !path.isAbsolute(rel)) { console.error('ABORT: synthetic runs must write outside the repo\'s research/ folder.'); process.exit(2); }
}
const outSheetDir = SYN ? path.join(workdir, 'sheets_adjudication') : path.join(dir, 'sheets/adjudication');
const outKeyDir = SYN ? path.join(workdir, 'coordinator') : path.join(dir, 'coordinator');
const keyPath = path.join(dir, 'coordinator/KEY_DO_NOT_SHARE_WITH_ANNOTATORS.json');

// ---------- validate mode ----------
if (flag('--validate')) {
  const file = val('--validate');
  const akey = JSON.parse(fs.readFileSync(path.join(outKeyDir, 'ADJUDICATION_KEY.json'), 'utf-8'));
  const issued = parseCsv(fs.readFileSync(path.join(outSheetDir, 'adjudication_sheet.csv'), 'utf-8'));
  const returned = parseCsv(fs.readFileSync(file, 'utf-8'));
  const errors = [], warnings = [];
  if (returned[0].join(',') !== issued[0].join(',')) errors.push('header changed');
  if (returned.length !== issued.length) errors.push(`row count ${returned.length - 1} != issued ${issued.length - 1}`);
  const ret = new Map(returned.slice(1).map(r => [r[0], r]));
  const H = issued[0]; const col = n => H.indexOf(n);
  issued.slice(1).forEach(ir => {
    const r = ret.get(ir[0]); if (!r) { errors.push(`item ${ir[0]}: row missing`); return; }
    for (let c = 0; c < col('adj_label'); c++) if (r[c] !== ir[c]) { errors.push(`item ${ir[0]}: read-only column "${H[c]}" was changed`); break; }
    const label = (r[col('adj_label')] || '').trim().toUpperCase(), conf = (r[col('adj_confidence')] || '').trim();
    if (!LABELS.has(label)) errors.push(`item ${ir[0]}: adj_label "${r[col('adj_label')] || ''}" is not CLEAR / AMBIGUOUS / OOD`);
    if (!['1', '2', '3'].includes(conf)) errors.push(`item ${ir[0]}: adj_confidence "${conf}" is not 1, 2, or 3`);
    const raw = (r[col('adj_record_ids')] || '').trim(); const ids = raw.toLowerCase() === 'none' || !raw ? [] : raw.split(/[;,\s]+/).filter(Boolean).map(s => s.toLowerCase());
    ids.forEach(id => { if (!byId.has(id)) errors.push(`item ${ir[0]}: record id "${id}" is not in the list`); });
    if (label === 'OOD' && ids.length) warnings.push(`item ${ir[0]}: OOD but record ids given`);
    if (label === 'CLEAR' && !ids.length) warnings.push(`item ${ir[0]}: CLEAR with no record id`);
    if (label === 'AMBIGUOUS' && ids.length < 2) warnings.push(`item ${ir[0]}: AMBIGUOUS with fewer than two record ids`);
  });
  warnings.slice(0, 20).forEach(w => console.log('WARN   ' + w)); errors.slice(0, 20).forEach(e => console.error('ERROR  ' + e));
  console.log(errors.length ? `\nINVALID: ${errors.length} error(s), ${warnings.length} warning(s)` : `\nVALID: ${akey.items.length} items, 0 errors, ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}

// ---------- build mode ----------
const f1 = val('--a1') || path.join(dir, 'returned/annotator_1.csv'), f2 = val('--a2') || path.join(dir, 'returned/annotator_2.csv');
if (!SYN) for (const f of [f1, f2]) { const rel = path.relative(path.join(dir, 'returned'), path.resolve(f)); if (rel.startsWith('..') || path.isAbsolute(rel)) { console.error(`ABORT: ${f} is not inside returned/. Use --allow-synthetic --workdir for test fixtures.`); process.exit(2); } }
[[f1, '1'], [f2, '2']].forEach(([f, n]) => { try { execFileSync('node', [path.join(__dirname, 'validate_returned_sheet.js'), f, n], { stdio: 'pipe' }); } catch (e) { console.error(`ABORT: annotator ${n}'s sheet failed validation:\n` + (e.stdout || '') + (e.stderr || '')); process.exit(1); } });

const key = JSON.parse(fs.readFileSync(keyPath, 'utf-8')).items;
function loadSheet(f, n) {
  const rows = parseCsv(fs.readFileSync(f, 'utf-8')).slice(1); const m = new Map();
  rows.forEach(r => m.set(r[0], { label: r[2].trim().toUpperCase(), conf: r[3].trim(), ids: r[4].trim(), comment: (r[5] || '').trim() }));
  return m;
}
const s1 = loadSheet(f1, 1), s2 = loadSheet(f2, 2);
const targets = key.filter(k => k.group === 'target' && !PRIMARY_EXCLUDED.has(k.id)).map(k => ({ ...k, a1: s1.get(String(k.item_no_annotator_1)), a2: s2.get(String(k.item_no_annotator_2)) }));
targets.forEach(t => { t.outcome = t.a1.label === t.a2.label ? (t.a1.label === t.original_label ? 'CONFIRMED' : 'REVERSED') : 'CONTESTED'; });
const count = o => targets.filter(t => t.outcome === o).length;
console.log(`targets (excl. TA-B187): ${targets.length} | CONFIRMED ${count('CONFIRMED')} | REVERSED ${count('REVERSED')} | CONTESTED ${count('CONTESTED')}`);

const rev = targets.filter(t => t.outcome === 'REVERSED'), con = targets.filter(t => t.outcome === 'CONTESTED');
const confirmed = shuffled(targets.filter(t => t.outcome === 'CONFIRMED').sort((a, b) => a.id.localeCompare(b.id)), mulberry32(2001));
const decoys = confirmed.slice(0, Math.min(rev.length, confirmed.length));
const role = new Map(); rev.forEach(t => role.set(t.id, 'REVERSED')); con.forEach(t => role.set(t.id, 'CONTESTED')); decoys.forEach(t => role.set(t.id, 'DECOY'));
if (!rev.length && !con.length) { console.log('Nothing to adjudicate (no REVERSED or CONTESTED targets). No sheet written.'); process.exit(0); }

const order = shuffled([...rev, ...con, ...decoys].sort((a, b) => a.id.localeCompare(b.id)), mulberry32(2002));
const swap = mulberry32(2003);
fs.mkdirSync(outSheetDir, { recursive: true }); fs.mkdirSync(outKeyDir, { recursive: true });
const header = ['adj_no', 'query', 'A_label', 'A_confidence', 'A_record_ids', 'A_comment', 'B_label', 'B_confidence', 'B_record_ids', 'B_comment', 'adj_label', 'adj_confidence', 'adj_record_ids', 'adj_comment'];
const lines = [header.join(',')]; const akeyItems = [];
order.forEach((t, k) => {
  const aIsOne = swap() < 0.5; const A = aIsOne ? t.a1 : t.a2, B = aIsOne ? t.a2 : t.a1;
  const q = key.find(x => x.id === t.id);
  const queryText = q.query;
  lines.push([k + 1, csvCell(queryText), A.label, A.conf, csvCell(A.ids), csvCell(A.comment), B.label, B.conf, csvCell(B.ids), csvCell(B.comment), '', '', '', ''].join(','));
  akeyItems.push({ adj_no: k + 1, id: t.id, role: role.get(t.id), original_label: t.original_label, annotator_1_label: t.a1.label, annotator_2_label: t.a2.label, A_is_annotator: aIsOne ? 1 : 2 });
});
const text = lines.join('\r\n') + '\r\n';
if (/TA-B\d+/i.test(text)) { console.error('ABORT: sheet leaks a benchmark id'); process.exit(1); }
fs.writeFileSync(path.join(outSheetDir, 'adjudication_sheet.csv'), '﻿' + text, 'utf-8');
fs.writeFileSync(path.join(outKeyDir, 'ADJUDICATION_KEY.json'), JSON.stringify({ synthetic: SYN, seeds: { decoys: 2001, order: 2002, AB_assignment: 2003 }, n_reversed: rev.length, n_contested: con.length, n_decoys: decoys.length, items: akeyItems }, null, 2), 'utf-8');
fs.writeFileSync(path.join(outSheetDir, 'ADJUDICATION_INSTRUCTIONS.md'),
`# Adjudication instructions

You are the third reader. Two annotators labeled each request below using the codebook and the list
(\`corpus_view_win32.tsv\`). Their labels, confidence, record ids and comments are shown as **A** and **B**.

1. Read \`ANNOTATION_CODEBOOK.md\` first.
2. For **each** row, apply the codebook's four steps yourself, using the list. **Do not count votes.** If A and B
   agree, that is not evidence they are right; if they disagree, you may side with either or choose the third label.
3. Fill in the last four columns: \`adj_label\` (CLEAR, AMBIGUOUS, or OOD), \`adj_confidence\` (1-3), \`adj_record_ids\`
   (the ids that perform each reading you kept, or \`none\`), and an optional one-line \`adj_comment\`.
4. Do not change any other column. Work alone. Do not look up where these requests came from or open any project
   repository, paper, or benchmark file.

Some rows are ones where A and B agree, and some where they differ. You are not told which are which and it does
not matter: judge every row on its own.
${SYN ? '\n**SYNTHETIC TEST FIXTURE. NOT REAL DATA.**\n' : ''}`, 'utf-8');
console.log(`adjudication items: ${order.length} (REVERSED ${rev.length}, CONTESTED ${con.length}, DECOYS ${decoys.length})`);
console.log(`wrote ${path.relative(root, path.join(outSheetDir, 'adjudication_sheet.csv'))}, ADJUDICATION_INSTRUCTIONS.md, ${path.relative(root, path.join(outKeyDir, 'ADJUDICATION_KEY.json'))}`);
