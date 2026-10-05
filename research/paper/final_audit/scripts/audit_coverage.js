// Final publication audit (2026-10-05): which numerals in content.tex are covered by a trace_claims.js entry?
// Read-only: writes nothing (trace_claims.js is loaded with its file write disabled).
//   node research/paper/final_audit/scripts/audit_coverage.js
// Loads trace_claims.js unmodified (file writes and process.exit disabled) and reads its entry list.
const fs = require('fs'), path = require('path'), Module = require('module');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..').split(path.sep).join('/') + '/';
const file = path.resolve(ROOT, 'research/experiments/trace_claims.js');
const src = fs.readFileSync(file, 'utf8') + '\n;module.exports = { E, tex };';
const realWrite = fs.writeFileSync, realExit = process.exit, realLog = console.log;
fs.writeFileSync = () => {}; process.exit = () => {}; console.log = () => {};
const m = new Module(file, null); m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file));
m._compile(src, file);
fs.writeFileSync = realWrite; process.exit = realExit; console.log = realLog;
const { E, tex } = m.exports;

// mark covered character positions: every occurrence of a registered snippet, and inside it every
// occurrence of each registered shown value
const covered = new Uint8Array(tex.length);
const normShown = s => String(s).replace(/^\+/, '');
let snippetsMissing = 0;
for (const e of E) {
  const sn = e.snippet.replace(/\s+/g, ' ');
  let from = 0, found = false;
  for (;;) {
    const i = tex.indexOf(sn, from); if (i < 0) break; found = true; from = i + 1;
    const pool = e.items.map(([s]) => normShown(s));
    // numerals inside this snippet occurrence
    const re = /\d+(?:[.,]\d+)*/g; let mm;
    while ((mm = re.exec(sn))) {
      const raw = mm[0], val = raw.replace(/,(?=\d{3})/g, '');
      const cands = [val, '.' + val.split('.')[1], '-' + val, '-.' + val.split('.')[1], '0.' + val, '-0.' + val];
      // also a leading "." form: ".293" in the tex is matched by the regex as "293"
      const before = sn[mm.index - 1] === '.' ? ['.' + raw, '-.' + raw, '0.' + raw, '-0.' + raw] : [];
      const k = pool.findIndex(p => [...cands, ...before].includes(p) || p.replace(/^-/, '') === val || (before.length && p.replace(/^-/, '') === '.' + raw));
      if (k >= 0) { pool.splice(k, 1); for (let j = 0; j < raw.length; j++) covered[i + mm.index + j] = 1; }
    }
  }
  if (!found) snippetsMissing++;
}

// all numerals in the paper text, minus things that are not reported numbers
let t = tex;
const blank = re => { t = t.replace(re, s => ' '.repeat(s.length)); };
blank(/\\(?:ref|label|citep?|citealp|includegraphics(?:\[[^\]]*\])?|input|qid|texttt|begin|end|setlength|hspace)\{[^}]*\}(?:\{[^}]*\})?/g);
blank(/\[width=[^\]]*\]/g); blank(/p\{[^}]*\\linewidth\}/g); blank(/\\tabcolsep\}\{[^}]*\}/g);
const sections = [...tex.matchAll(/\\(?:section\*?|begin\{abstract\})\{?([^}]*)\}?/g)].map(x => ({ at: x.index, name: x[0].includes('abstract') ? 'Abstract' : x[1] }));
const secOf = i => { let s = 'front'; for (const x of sections) if (x.at <= i) s = x.name; return s; };
const re = /(?<![A-Za-z0-9.:\-_])\d+(?:[.,]\d+)*(?![A-Za-z0-9_])/g; let mm; const all = [], unc = [];
while ((mm = re.exec(t))) {
  const raw = mm[0], i = mm.index;
  const ctx = tex.slice(Math.max(0, i - 45), i + raw.length + 30).replace(/\s+/g, ' ');
  // identifiers and structure: version names, model names, A0-A6, Table/Figure/Section numbers written literally
  if (/v0\.$|v$/.test(tex.slice(Math.max(0, i - 3), i))) continue;
  const cov = [...raw].every((_, j) => covered[i + j]);
  const rec = { sec: secOf(i), raw, ctx };
  all.push(rec); if (!cov) unc.push(rec);
}
const by = {}; for (const u of unc) (by[u.sec] = by[u.sec] || []).push(u);
console.log(`entries: ${E.length}; snippets not found: ${snippetsMissing}`);
console.log(`numerals in the paper text (after removing refs, labels, cites, file names, ids): ${all.length}; covered by a trace entry: ${all.length - unc.length}; not covered: ${unc.length}`);
for (const [s, a] of Object.entries(by)) { console.log(`\n## ${s}: ${a.length} not covered`); a.forEach(u => console.log(`  ${u.raw.padEnd(8)} … ${u.ctx}`)); }

// second pass: is the uncovered value registered anywhere in the trace?
const reg = new Set(E.flatMap(e => e.items.map(([s]) => String(s).replace(/^\+/, '').replace(/^-/, '').replace(/^0\./, '.'))));
const key = s => s.replace(/,(?=\d{3})/g, '').replace(/^0\./, '.');
const never = unc.filter(u => !reg.has(key(u.raw)) && !reg.has(key(u.raw).replace(/^\./, '0.')) && !reg.has(u.raw));
console.log(`\n=== of the ${unc.length} not covered at their location: ${unc.length - never.length} have the same value registered elsewhere in the trace; ${never.length} have no registration of that value anywhere`);
never.forEach(u => console.log(`  [${u.sec}] ${u.raw.padEnd(8)} … ${u.ctx}`));
