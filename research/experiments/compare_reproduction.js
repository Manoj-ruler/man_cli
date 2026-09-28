// T16 (research/PLAN_TASKS.md): after a full re-run (research/REPRODUCE.md), classifies every
// tracked file the run changed, relative to the committed version:
//   IDENTICAL      no change (after normalizing line endings)
//   VOLATILE-ONLY  only fields that legitimately change between runs differ: timestamps and
//                  measured wall-clock timings (see VOLATILE below)
//   DIFFERENT      anything else; the first differing JSON paths are listed
// Usage, from the repository root of the checkout that was re-run:
//   node research/experiments/compare_reproduction.js
// Exit code 1 if any file is DIFFERENT.

const { execFileSync } = require('child_process');
const fs = require('fs');

// keys whose values are expected to differ between runs; matched against the last path segment
const VOLATILE = /^(generated_at|generatedAt|timestamp|run_at|date|created_at|updated_at|.*_ms|.*latency.*|.*Latency.*|elapsed.*|duration.*|wall_clock.*|mean_ms|median_ms|p95_ms|p50_ms|node_version|hostname|git_commit)$/;
// table columns (CSV header cell or Markdown header cell) holding measured timings
const VOLATILE_COLUMN = /latency|\(ms\)/i;

// compares two CSV or Markdown tables cell by cell, skipping VOLATILE_COLUMN columns; null if not a table
function diffTable(before, now, file) {
  const md = file.endsWith('.md');
  const rows = t => t.split('\n').filter(l => (md ? l.trim().startsWith('|') : l.trim() !== ''))
    .map(l => (md ? l.trim().replace(/^\||\|$/g, '').split('|') : l.split(',')).map(c => c.trim()));
  const A = rows(before), B = rows(now);
  if (!A.length || A.length !== B.length) return null;
  const header = A[0], skip = new Set(header.map((h, i) => (VOLATILE_COLUMN.test(h) ? i : -1)).filter(i => i >= 0));
  if (!skip.size) return null;
  const out = [];
  A.forEach((r, i) => { if (r.length !== B[i].length) { out.push(`row ${i + 1}: column count differs`); return; } r.forEach((c, j) => { if (!skip.has(j) && c !== B[i][j]) out.push(`row ${i + 1}, ${header[j]}: ${c} -> ${B[i][j]}`); }); });
  // the non-table lines of a Markdown file must be identical too
  if (md) { const rest = t => t.split('\n').filter(l => !l.trim().startsWith('|')).join('\n'); if (rest(before) !== rest(now)) out.push('text outside the table differs'); }
  return out;
}

const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 28 });
const changed = git(['status', '--porcelain']).split('\n').filter(Boolean)
  .map(l => ({ code: l.slice(0, 2).trim(), file: l.slice(3).trim() }));

function diffJson(a, b, p = '$', out = []) {
  if (out.length > 8) return out;
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || (a === null) !== (b === null)) { out.push({ path: p, a, b }); return out; }
  if (a && typeof a === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (VOLATILE.test(k)) continue;
      if (!(k in a) || !(k in b)) { out.push({ path: `${p}.${k}`, a: a[k], b: b[k] }); continue; }
      diffJson(a[k], b[k], Array.isArray(a) ? `${p}[${k}]` : `${p}.${k}`, out);
    }
    return out;
  }
  if (a !== b) out.push({ path: p, a, b });
  return out;
}

const rows = [];
for (const { code, file } of changed) {
  if (code === '??') { rows.push({ file, status: 'NEW (untracked)' }); continue; }
  const now = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  let before;
  try { before = git(['show', `HEAD:${file.replace(/\\/g, '/')}`]).replace(/\r\n/g, '\n'); } catch { rows.push({ file, status: 'NOT IN HEAD' }); continue; }
  if (now === before) { rows.push({ file, status: 'IDENTICAL' }); continue; }
  if (file.endsWith('.json')) {
    let a, b;
    try { a = JSON.parse(before); b = JSON.parse(now); } catch { rows.push({ file, status: 'DIFFERENT', detail: 'not parseable JSON' }); continue; }
    const d = diffJson(a, b);
    rows.push(d.length ? { file, status: 'DIFFERENT', detail: d.slice(0, 5).map(x => `${x.path}: ${JSON.stringify(x.a)?.slice(0, 60)} -> ${JSON.stringify(x.b)?.slice(0, 60)}`) } : { file, status: 'VOLATILE-ONLY' });
  } else if ((file.endsWith('.csv') || file.endsWith('.md')) && diffTable(before, now, file) !== null) {
    const d = diffTable(before, now, file);
    rows.push(d.length ? { file, status: 'DIFFERENT', detail: d.slice(0, 5) } : { file, status: 'VOLATILE-ONLY' });
  } else {
    const A = before.split('\n'), B = now.split('\n');
    const lines = []; for (let i = 0; i < Math.max(A.length, B.length) && lines.length < 3; i++) if (A[i] !== B[i]) lines.push(`line ${i + 1}: ${JSON.stringify((A[i] || '').slice(0, 70))} -> ${JSON.stringify((B[i] || '').slice(0, 70))}`);
    rows.push({ file, status: 'DIFFERENT', detail: lines });
  }
}

const by = s => rows.filter(r => r.status === s);
console.log(`files changed by the run: ${changed.length}`);
for (const s of ['VOLATILE-ONLY', 'NEW (untracked)', 'NOT IN HEAD', 'DIFFERENT']) {
  const r = by(s); if (!r.length) continue;
  console.log(`\n${s} (${r.length})`);
  r.forEach(x => { console.log(`  ${x.file}`); (Array.isArray(x.detail) ? x.detail : x.detail ? [x.detail] : []).forEach(d => console.log(`      ${d}`)); });
}
const bad = by('DIFFERENT').length;
console.log(bad ? `\n${bad} file(s) DIFFERENT from the committed version` : '\nreproduction OK: every changed file differs only in volatile fields');
process.exit(bad ? 1 : 0);
