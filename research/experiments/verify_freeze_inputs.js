// Verifies that every input recorded in a freeze report is unchanged, independently of line endings.
//   node research/experiments/verify_freeze_inputs.js [research/ANALYSIS_FREEZE_v1.0.md]
// The v1.0 report hashed the raw working-copy bytes. At freeze time some inputs had just been written
// by Node (LF) and others had been checked out by git with core.autocrlf=true (CRLF), so the recorded
// hashes mix the two forms. For each file this script hashes the committed blob at HEAD in both forms
// (LF and CRLF) and passes the file if the recorded hash equals either. It also reports whether the
// working copy differs from HEAD in content (ignoring line endings). Read-only.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const report = path.resolve(ROOT, process.argv[2] || 'research/ANALYSIS_FREEZE_v1.0.md');
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const rows = [...fs.readFileSync(report, 'utf8').matchAll(/^\| `([^`]+)` \| `([0-9a-f]{64})` \|/gm)].map(m => ({ file: m[1], want: m[2] }));
if (!rows.length) { console.error('ABORT: no SHA-256 table found in ' + report); process.exit(1); }
let bad = 0;
for (const { file, want } of rows) {
  const blob = execFileSync('git', ['show', `HEAD:${file}`], { cwd: ROOT, maxBuffer: 1 << 28 }).toString('utf8');
  const lf = blob.replace(/\r\n/g, '\n'), crlf = lf.replace(/\n/g, '\r\n');
  const form = sha(lf) === want ? 'LF' : sha(crlf) === want ? 'CRLF' : null;
  const work = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');
  const workSame = work === lf;
  if (!form || !workSame) bad++;
  console.log(`${form && workSame ? 'OK  ' : 'FAIL'} ${form || 'no match'}${workSame ? '' : ' (working copy differs from HEAD)'}  ${file}`);
}
console.log(`\n${rows.length - bad}/${rows.length} inputs unchanged since the freeze (${path.relative(ROOT, report)})`);
process.exit(bad ? 1 : 0);
