// Counts behind the paper's disclosure of the unused record-id re-check (protocol Amendment 7; PROGRESS.md
// ISSUE-12). Reads the gitignored returns in research/datasets/annotation/returned/ and writes only
// counts -- no identities, queries, labels, record ids or comment text -- to
// research/results/annotation/recheck_counts.json, so that trace_claims.js can check the paper's numbers
// in a clone that does not have the returns. Assigns or judges no label; the re-check enters no statistic.
//
//   node research/experiments/recheck_counts.js
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'research/datasets/annotation/returned');
const OUT = path.join(ROOT, 'research/results/annotation/recheck_counts.json');
const FILES = { a1: 'annotator_1.csv', a2: 'annotator_2.csv', recheck: 'annotator_2_ids_recheck.csv' };
for (const f of Object.values(FILES)) if (!fs.existsSync(path.join(DIR, f))) { console.error(`ABORT: ${f} not found in ${DIR} (the returns are gitignored and stay with the coordinator)`); process.exit(1); }

function parseCsv(text) {
  text = text.replace(/^﻿/, ''); const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) { const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; } else cell += c; }
  if (cell.length || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
  return rows.filter(r => r.some(x => x !== ''));
}
const load = f => parseCsv(fs.readFileSync(path.join(DIR, f), 'utf8')).slice(1).map(r => ({ q: r[1], label: r[2], comment: (r[5] || '').trim() }));
const a1 = load(FILES.a1), a2 = load(FILES.a2), re = load(FILES.recheck);
const A1 = new Map(a1.map(r => [r.q, r]));
if (a2.length !== a1.length || re.length !== a1.length || a2.some(r => !A1.has(r.q)) || re.some(r => !A1.has(r.q))) { console.error('ABORT: the three sheets do not have the same queries'); process.exit(1); }
const identical = rows => rows.filter(r => r.comment && r.comment === A1.get(r.q).comment).length;
// the comment equals the other annotator's, or is its beginning (a trailing '.' or ';' ignored)
const prefix = rows => rows.filter(r => r.comment && A1.get(r.q).comment.startsWith(r.comment.replace(/[.;]$/, ''))).length;
const A2 = new Map(a2.map(r => [r.q, r]));
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(path.join(DIR, f))).digest('hex').slice(0, 12);
const out = {
  generated_by: 'research/experiments/recheck_counts.js',
  note: 'Counts only. The re-check file is not used in any statistic (protocol Amendment 7); these counts support its disclosure.',
  rows: a1.length,
  comments_identical_to_other_annotator: { original_return: identical(a2), recheck: identical(re) },
  comments_equal_to_or_start_of_other_annotators: { original_return: prefix(a2), recheck: prefix(re) },
  recheck_vs_original: { labels_changed: re.filter(r => r.label !== A2.get(r.q).label).length, comments_changed: re.filter(r => r.comment !== A2.get(r.q).comment).length },
  input_sha256_prefix: { annotator_1: sha(FILES.a1), annotator_2: sha(FILES.a2), recheck: sha(FILES.recheck) }
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${path.relative(ROOT, OUT)}: ${JSON.stringify(out.comments_identical_to_other_annotator)}, ${JSON.stringify(out.recheck_vs_original)}`);
