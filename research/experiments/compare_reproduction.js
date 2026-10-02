// T16 (research/PLAN_TASKS.md): after a full re-run (research/REPRODUCE.md), classifies every
// tracked file the run changed, relative to the committed version:
//   IDENTICAL      no change (after normalizing line endings)
//   VOLATILE-ONLY  only fields that legitimately change between runs differ: timestamps and
//                  measured wall-clock timings (see VOLATILE below)
//   VOLATILE (derived)  a JSON file whose only other differences are SHA-256 entries (a key under a
//                  "*sha256*" object) naming files that this same run classified VOLATILE-ONLY or
//                  VOLATILE (derived): the hash of a file that holds timings changes with it (ISSUE-14)
//   DIFFERENT      anything else; the first differing JSON paths are listed
// Usage, from the repository root of the checkout that was re-run:
//   node research/experiments/compare_reproduction.js
// Exit code 1 if any file is DIFFERENT.

const { execFileSync } = require('child_process');
const fs = require('fs');

// keys whose values are expected to differ between runs; matched against the last path segment
const VOLATILE = /^(generated_at|generatedAt|timestamp|run_at|date|created_at|updated_at|.*_ms|.*latency.*|.*Latency.*|elapsed.*|duration.*|wall_clock.*|mean_ms|median_ms|p95_ms|p50_ms|node_version|hostname|git_commit|started|finished|commit|tag_at_head|input_files_sha256|script_sha256|seconds)$/;
// ISSUE-14 (2026-10-02): "seconds" is a run's wall-clock duration (research/results/v0.2.1/RUN_MANIFEST.json).
// FINAL-04 (2026-10-01), for research/results/e1_clinc150_v1/RUN_MANIFEST.json: started/finished are timestamps;
// commit/tag_at_head depend on the checkout; input_files_sha256 hashes files that contain timestamps; and
// script_sha256 hashes raw bytes, which change on a CRLF checkout. The scripts themselves are checked with
// `git diff --exit-code e1-protocol-v1 -- ...` (REPRODUCE.md, E1 section), not through these hashes.
// Text files (e.g. summary.md, DATA_PROVENANCE.md) whose only difference is an ISO-8601 timestamp count as volatile.
const maskTimestamps = s => s.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g, '<timestamp>');
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

// every differing leaf, with its key chain (keys may contain dots, e.g. file names)
function diffJson(a, b, p = '$', out = [], keys = []) {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || (a === null) !== (b === null)) { out.push({ path: p, keys, a, b }); return out; }
  if (a && typeof a === 'object') {
    const ks = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of ks) {
      if (VOLATILE.test(k)) continue;
      if (!(k in a) || !(k in b)) { out.push({ path: `${p}.${k}`, keys: [...keys, k], a: a[k], b: b[k] }); continue; }
      diffJson(a[k], b[k], Array.isArray(a) ? `${p}[${k}]` : `${p}.${k}`, out, [...keys, k]);
    }
    return out;
  }
  if (a !== b) out.push({ path: p, keys, a, b });
  return out;
}
// a differing entry that is a SHA-256 of a named file: { object key matching /sha256/i } -> { file name }
const hashTarget = d => (d.keys.length >= 2 && /sha256/i.test(d.keys[d.keys.length - 2]) && /\.[a-z]+$/i.test(d.keys[d.keys.length - 1]) ? d.keys[d.keys.length - 1] : null);

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
    rows.push(d.length ? { file, status: 'DIFFERENT', diffs: d, detail: d.slice(0, 5).map(x => `${x.path}: ${JSON.stringify(x.a)?.slice(0, 60)} -> ${JSON.stringify(x.b)?.slice(0, 60)}`) } : { file, status: 'VOLATILE-ONLY' });
  } else if ((file.endsWith('.csv') || file.endsWith('.md')) && diffTable(before, now, file) !== null) {
    const d = diffTable(before, now, file);
    rows.push(d.length ? { file, status: 'DIFFERENT', detail: d.slice(0, 5) } : { file, status: 'VOLATILE-ONLY' });
  } else if (maskTimestamps(now) === maskTimestamps(before)) {
    rows.push({ file, status: 'VOLATILE-ONLY' });
  } else {
    const A = before.split('\n'), B = now.split('\n');
    const lines = []; for (let i = 0; i < Math.max(A.length, B.length) && lines.length < 3; i++) if (A[i] !== B[i]) lines.push(`line ${i + 1}: ${JSON.stringify((A[i] || '').slice(0, 70))} -> ${JSON.stringify((B[i] || '').slice(0, 70))}`);
    rows.push({ file, status: 'DIFFERENT', detail: lines });
  }
}

// ISSUE-14: promote a DIFFERENT JSON file to VOLATILE (derived) when every remaining difference is a
// SHA-256 entry naming a file this run classified as volatile. A hash of an IDENTICAL or unchanged file,
// or of a DIFFERENT file, stays a difference. Repeated until nothing changes (one manifest may hash another).
const norm = f => f.replace(/\\/g, '/');
const statusOf = new Map(rows.map(r => [norm(r.file), r]));
const resolveTarget = (file, name) => {
  name = norm(name);
  const dir = norm(file).split('/').slice(0, -1);
  const cands = [name];
  for (let i = dir.length; i >= 0; i--) cands.push([...dir.slice(0, i), name].join('/'));
  for (const c of cands) if (statusOf.has(c)) return statusOf.get(c);
  const suffix = [...statusOf.keys()].filter(k => k.endsWith('/' + name));
  return suffix.length === 1 ? statusOf.get(suffix[0]) : null;
};
const isVolatile = r => r && (r.status === 'VOLATILE-ONLY' || r.status === 'VOLATILE (derived)');
for (let changedSome = true; changedSome;) {
  changedSome = false;
  for (const r of rows) {
    if (r.status !== 'DIFFERENT' || !r.diffs) continue;
    const targets = r.diffs.map(x => { const t = hashTarget(x); return t ? resolveTarget(r.file, t) : null; });
    if (targets.every(isVolatile)) {
      r.status = 'VOLATILE (derived)';
      r.detail = [`only SHA-256 entries differ, each for a file classified volatile in this run: ${[...new Set(targets.map(t => norm(t.file)))].length} file(s)`];
      changedSome = true;
    }
  }
}

const by = s => rows.filter(r => r.status === s);
console.log(`files changed by the run: ${changed.length}`);
for (const s of ['VOLATILE-ONLY', 'VOLATILE (derived)', 'NEW (untracked)', 'NOT IN HEAD', 'DIFFERENT']) {
  const r = by(s); if (!r.length) continue;
  console.log(`\n${s} (${r.length})`);
  r.forEach(x => { console.log(`  ${x.file}`); (Array.isArray(x.detail) ? x.detail : x.detail ? [x.detail] : []).forEach(d => console.log(`      ${d}`)); });
}
const bad = by('DIFFERENT').length;
console.log(bad ? `\n${bad} file(s) DIFFERENT from the committed version` : '\nreproduction OK: every changed file differs only in volatile fields');
process.exit(bad ? 1 : 0);
