// E1-10 -- prepares the E1 query files from the committed CLINC150 copy, exactly under the frozen
// protocol (tag e1-protocol-v1): §3 (Rule A, 0 exclusions; subgroup S) and §6.1/§6.7 (identifiers and
// file format). No scoring; no download; query text is copied unchanged and never printed.
//
//   node e1_prepare_data.js --out-dir research/results/e1_clinc150_v1/data
//
// Aborts if the source files differ from research/data_external/clinc150/PROVENANCE.md, if any count
// differs from the protocol, or if an output file already exists.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..', '..');
const SRC = 'research/data_external/clinc150';
// PROVENANCE.md (raw bytes; the folder's .gitattributes keeps them byte-exact)
const SOURCE_SHA256 = {
  'data_full.json': '36923c3705a59e08fe9c3883d8bc2dd966ef93e22cb78ac41171782a698d56e0',
  'domains.json': 'b947b579d3b8e74b06f93b01083d8efaff2888b43a3e362533bd88a6e1211b3a'
};
// Protocol §3 (frozen)
const EXCLUDED_INTENTS = []; // Rule A: no Windows-visible corpus record performs any CLINC intent
const S_CLEAR = ['date', 'calculator', 'measurement_conversion', 'flip_coin', 'roll_dice', 'timer'];
const S_BORDERLINE = ['time', 'timezone', 'alarm', 'reminder_update', 'weather', 'exchange_rate', 'current_location'];
// Protocol §6.1 (frozen)
const EXPECT = { p1: 4500, p2: 1000, intents: 150, perIntent: 30, domains: 10, perDomain: 450, sClear: 180, sBorderline: 210, withoutSClear: 4320, withoutS: 4110 };

const sha = buf => crypto.createHash('sha256').update(buf).digest('hex');

function main() {
  const args = process.argv.slice(2);
  const outDir = args[args.indexOf('--out-dir') + 1];
  if (args.indexOf('--out-dir') < 0 || !outDir) { console.error('usage: --out-dir <dir>'); process.exit(2); }
  const problems = [];
  const fail = m => problems.push(m);

  // 1. source integrity
  const raw = {}, srcSha = {};
  for (const [f, want] of Object.entries(SOURCE_SHA256)) {
    raw[f] = fs.readFileSync(path.join(root, SRC, f));
    srcSha[f] = sha(raw[f]);
    if (srcSha[f] !== want) fail(`${f}: sha256 ${srcSha[f]} != PROVENANCE ${want}`);
  }
  if (problems.length) { problems.forEach(p => console.error('FAIL  ' + p)); process.exit(1); }
  const data = JSON.parse(raw['data_full.json'].toString('utf-8'));
  const domains = JSON.parse(raw['domains.json'].toString('utf-8'));
  const domainOf = new Map();
  Object.entries(domains).forEach(([d, intents]) => intents.forEach(i => domainOf.set(i, d)));

  // 2. P1 (`test`) under Rule A, with domain and subgroup; P2 (`oos_test`) kept whole
  const subgroupOf = i => (S_CLEAR.includes(i) ? 'S-clear' : S_BORDERLINE.includes(i) ? 'S-borderline' : null);
  const p1 = [], excluded = [];
  data.test.forEach(([text, intent], i) => {
    const row = { id: `test:${i}`, text, intent, domain: domainOf.get(intent), subgroup: subgroupOf(intent) };
    if (EXCLUDED_INTENTS.includes(intent)) excluded.push(row.id); else p1.push(row);
  });
  const p2 = data.oos_test.map(([text, label], i) => {
    if (label !== 'oos') fail(`oos_test:${i} has label ${label}`);
    return { id: `oos_test:${i}`, text };
  });

  // 3. reconciliation against the source and the protocol
  const count = (arr, key) => arr.reduce((m, r) => m.set(r[key], (m.get(r[key]) || 0) + 1), new Map());
  const perIntent = count(p1, 'intent'), perDomain = count(p1, 'domain'), perSub = count(p1, 'subgroup');
  const checks = [
    ['P1 rows = source test rows - excluded', p1.length, data.test.length - excluded.length],
    ['P1 rows', p1.length, EXPECT.p1], ['P2 rows = source oos_test rows', p2.length, data.oos_test.length], ['P2 rows', p2.length, EXPECT.p2],
    ['excluded rows (Rule A)', excluded.length, 0], ['P1 intents', perIntent.size, EXPECT.intents],
    ['every intent has 30 queries', [...perIntent.values()].every(n => n === EXPECT.perIntent), true],
    ['every intent has a domain', p1.every(r => typeof r.domain === 'string'), true], ['domains', perDomain.size, EXPECT.domains],
    ['every domain has 450 queries', [...perDomain.values()].every(n => n === EXPECT.perDomain), true],
    ['all 13 S intents present', [...S_CLEAR, ...S_BORDERLINE].every(i => perIntent.has(i)), true],
    ['S-clear rows', perSub.get('S-clear') || 0, EXPECT.sClear], ['S-borderline rows', perSub.get('S-borderline') || 0, EXPECT.sBorderline],
    ['P1 without S-clear', p1.length - (perSub.get('S-clear') || 0), EXPECT.withoutSClear],
    ['P1 without S-clear and S-borderline', perSub.get(null) || 0, EXPECT.withoutS],
    ['unique ids', new Set([...p1, ...p2].map(r => r.id)).size, p1.length + p2.length],
    ['text copied unchanged (P1)', p1.every(r => r.text === data.test[+r.id.split(':')[1]][0]), true],
    ['text copied unchanged (P2)', p2.every(r => r.text === data.oos_test[+r.id.split(':')[1]][0]), true]
  ];
  checks.forEach(([label, got, want]) => { if (got !== want) fail(`${label}: ${got}, expected ${want}`); });
  if (problems.length) { problems.forEach(p => console.error('FAIL  ' + p)); process.exit(1); }

  // 4. write (never overwrite), then re-read and confirm the round trip
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outputs = { 'p1_queries.json': p1, 'p2_queries.json': p2 };
  for (const f of [...Object.keys(outputs), 'DATA_PROVENANCE.md']) if (fs.existsSync(path.join(outDir, f))) { console.error(`refusing to overwrite ${f}`); process.exit(2); }
  const outSha = {};
  for (const [f, rows] of Object.entries(outputs)) {
    const text = JSON.stringify(rows, null, 1) + '\n';
    fs.writeFileSync(path.join(outDir, f), text, 'utf-8');
    const back = JSON.parse(fs.readFileSync(path.join(outDir, f), 'utf-8'));
    if (JSON.stringify(back) !== JSON.stringify(rows)) { console.error(`round trip failed for ${f}`); process.exit(1); }
    outSha[f] = sha(Buffer.from(text, 'utf-8'));
  }

  const L = [];
  L.push('# E1 data provenance (CLINC150), written by `research/experiments/e1_prepare_data.js`', '');
  L.push(`Generated ${new Date().toISOString()}, under the frozen protocol \`e1-protocol-v1\` (§3, §6.1, §6.7). No scoring was done. The query text is copied unchanged, and no query was read or printed during preparation.`, '');
  L.push('## Source (committed copy; nothing was downloaded in E1-10)', '');
  L.push('Larson et al. (2019), *An Evaluation Dataset for Intent Classification and Out-of-Scope Prediction*, EMNLP-IJCNLP, https://doi.org/10.18653/v1/D19-1131. Licence: CC BY 3.0. Upstream: `clinc/oos-eval` at commit `828f809`. See `research/data_external/clinc150/PROVENANCE.md`.', '');
  L.push('| File | SHA-256 (raw bytes) | Matches PROVENANCE.md |', '|---|---|---|');
  Object.keys(SOURCE_SHA256).forEach(f => L.push(`| \`${SRC}/${f}\` | \`${srcSha[f]}\` | yes |`));
  L.push('', '## Rules applied (frozen)', '');
  L.push('- **P1 = `test`**, with id `test:<i>` (the 0-based index into `data_full.json` `test`), plus `intent`, `domain` (the `domains.json` key) and `subgroup`.');
  L.push('- **Rule A excludes no intent**, so no row was excluded.');
  L.push(`- **Subgroup S** (descriptive, not excluded): S-clear = ${S_CLEAR.join(', ')}; S-borderline = ${S_BORDERLINE.join(', ')}. Every other intent has \`subgroup: null\`.`);
  L.push('- **P2 = `oos_test`**, kept whole, with id `oos_test:<i>`. Every row is labelled `oos` in the source.');
  L.push('- **The domain map** comes from `domains.json`. Its 10 pairs in the CLINC paper\'s Table 1 were checked in E1-03; the full supplementary list was not.', '');
  L.push('## Reconciliation', '', '| Check | Value | Expected |', '|---|---|---|');
  checks.forEach(([label, got, want]) => L.push(`| ${label} | ${got} | ${want} |`));
  L.push('', '| Domain | P1 queries | Intents | S-clear intents | S-borderline intents |', '|---|---|---|---|---|');
  [...perDomain.keys()].sort().forEach(d => {
    const intents = [...perIntent.keys()].filter(i => domainOf.get(i) === d);
    L.push(`| ${d} | ${perDomain.get(d)} | ${intents.length} | ${intents.filter(i => S_CLEAR.includes(i)).length} | ${intents.filter(i => S_BORDERLINE.includes(i)).length} |`);
  });
  L.push('', `Per intent: all ${perIntent.size} intents have exactly ${EXPECT.perIntent} queries.`, '');
  L.push('## Output files', '', '| File | Rows | SHA-256 (as written, LF) |', '|---|---|---|');
  Object.entries(outputs).forEach(([f, rows]) => L.push(`| \`${f}\` | ${rows.length} | \`${outSha[f]}\` |`));
  L.push('');
  fs.writeFileSync(path.join(outDir, 'DATA_PROVENANCE.md'), L.join('\n'), 'utf-8');
  console.log(`e1_prepare_data: ${checks.length} checks pass; P1 ${p1.length} (excluded ${excluded.length}), P2 ${p2.length}; wrote ${outDir}`);
  Object.entries(outSha).forEach(([f, s]) => console.log(`  ${s}  ${f}`));
}

main();
