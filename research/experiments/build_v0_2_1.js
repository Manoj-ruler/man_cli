// T12 (research/PLAN_TASKS.md): builds TermAssist-Bench v0.2.1 from the frozen v0.2 plus
//   (a) the adjudicated relabels in research/results/annotation/relabel_proposal.json
//       (written by analyze_annotation.js), and
//   (b) the declared defect fixes in research/datasets/v0.2.1_fixes.json.
// v0.2 is never modified: its files are hashed before and after, and against the v0.2 manifest.
//
//   node build_v0_2_1.js --proposal <relabel_proposal.json> [--fixes <fixes.json>] --out <dir> [--date YYYY-MM-DD]
//       writes to <dir> (for tests; must be outside research/)
//   node build_v0_2_1.js --confirm [--date YYYY-MM-DD]
//       the real build: reads the real proposal and fixes, writes into research/datasets/
//       (refused while the fixes file is PROPOSED or the proposal is SYNTHETIC)
//   add --manual <resolutions.json> to resolve items the rules below cannot (see "manual")
//
// How a relabel is turned into benchmark fields (all v0.2 targets are TA-B151..TA-B209):
//   OOD        -> no gold, no acceptable commands; query_type 'ood'; requires_rejection
//   AMBIGUOUS  -> needs >= 2 corpus records; query_type 'ambiguous'; ambiguity true
//   CLEAR      -> needs >= 1 corpus record; query_type 'relabeled_clear'
//   Records come from the adjudicator's record ids if the item was adjudicated and the adjudicator
//   cited some; otherwise from the ids cited by BOTH annotators (intersection). Gold = the first id
//   in sorted order, acceptable = the rest. If that yields too few records, the item is listed as
//   needing a manual decision and the build aborts unless --manual resolves it (ids, or "drop").
//   risk_level is NOT re-assessed automatically: relabeled items keep their v0.2 risk_level and are
//   flagged in the changelog for a human check.
// Items in excluded_pending (contested without adjudication, or unresolved) are dropped, per
// ANNOTATION_PROTOCOL.md section 4.
// Invariants checked before writing: every gold and acceptable command is a win32 corpus record;
// OOD items carry no commands; ids are unique; review decisions agree with benchmark fields.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { byId, view } = require('./annotation_common');

const root = path.join(__dirname, '..', '..');
const ds = path.join(root, 'research', 'datasets');
const args = process.argv.slice(2);
const flag = f => args.includes(f), val = f => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
const die = m => { console.error('ABORT: ' + m); process.exit(1); };

const CONFIRM = flag('--confirm');
const proposalPath = val('--proposal') || (CONFIRM ? path.join(root, 'research/results/annotation/relabel_proposal.json') : null);
const fixesPath = val('--fixes') || path.join(ds, 'v0.2.1_fixes.json');
const manualPath = val('--manual');
const outDir = CONFIRM ? ds : val('--out');
const date = val('--date') || new Date().toISOString().slice(0, 10);
if (!proposalPath) die('--proposal <file> is required (or --confirm for the real build)');
if (!outDir) die('--out <dir> is required for a test build (or --confirm for the real build)');
if (!CONFIRM) { const rel = path.relative(path.join(root, 'research'), path.resolve(outDir)); if (!rel.startsWith('..') && !path.isAbsolute(rel)) die('a test build must write outside research/ (use --confirm for the real build)'); }

// ---- inputs ----
const sha256LF = p => crypto.createHash('sha256').update(Buffer.from(fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n'), 'utf8')).digest('hex');
const V02 = { json: path.join(ds, 'termassist_bench_v0.2_validated.json'), csv: path.join(ds, 'termassist_bench_v0.2_validated.csv'), review: path.join(ds, 'review/human_review_results_v0.2.json') };
const manifest02 = JSON.parse(fs.readFileSync(path.join(ds, 'VALIDATED_BENCHMARK_MANIFEST_v0.2.json'), 'utf8'));
const before = Object.fromEntries(Object.entries(V02).map(([k, p]) => [k, sha256LF(p)]));
if (before.json !== manifest02.validated_json_sha256_lf_normalized || before.csv !== manifest02.validated_csv_sha256_lf_normalized) die('v0.2 files do not match their frozen manifest');

const bench = JSON.parse(fs.readFileSync(V02.json, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(V02.review, 'utf8'));
const proposal = JSON.parse(fs.readFileSync(proposalPath, 'utf8'));
const fixes = JSON.parse(fs.readFileSync(fixesPath, 'utf8'));
const manual = manualPath ? JSON.parse(fs.readFileSync(manualPath, 'utf8')) : { items: {} };
if (CONFIRM && /^PROPOSED/.test(fixes.status || '')) die(`the fixes file is still "${fixes.status.slice(0, 40)}...": approve it (change status) before the real build`);
if (CONFIRM && proposal.stamp) die(`the proposal is stamped "${proposal.stamp}"; the real build needs a real proposal`);

const Q = bench.queries.map(q => JSON.parse(JSON.stringify(q)));
const R = new Map(reviews.map(r => [r.id, JSON.parse(JSON.stringify(r))]));
const qById = new Map(Q.map(q => [q.id, q]));
const corpusCommands = new Set(view.map(r => r.command));
const changes = [], dropped = [], riskReview = [], needManual = [];

// ---- defect fixes ----
for (const fx of fixes.fixes) {
  const q = qById.get(fx.id), r = R.get(fx.id);
  if (!q || !r) die(`fix for unknown id ${fx.id}`);
  if (fx.action === 'drop') { dropped.push({ id: fx.id, query: q.query, basis: 'defect fix', reason: fx.reason }); continue; }
  if (fx.action === 'set_gold') {
    const rec = byId.get(fx.record_id); if (!rec) die(`${fx.id}: ${fx.record_id} is not a win32 corpus record`);
    changes.push({ id: fx.id, query: q.query, what: `gold command: "${q.gold_command}" -> "${rec.command}" (${fx.record_id})${fx.decision ? `; review decision ${r.decision} -> ${fx.decision}` : ''}`, basis: 'defect fix', reason: fx.reason });
    q.gold_command = rec.command; q.gold_intent = rec.intent; r.final_gold_command = rec.command;
    if (fx.decision) r.decision = fx.decision;
  } else if (fx.action === 'remove_acceptable') {
    const drop = new Set(fx.commands);
    const missing = fx.commands.filter(c => !(q.acceptable_commands || []).includes(c)); if (missing.length) die(`${fx.id}: acceptable commands to remove not present: ${missing.join(' | ')}`);
    q.acceptable_commands = q.acceptable_commands.filter(c => !drop.has(c)); r.final_acceptable_commands = (r.final_acceptable_commands || []).filter(c => !drop.has(c));
    changes.push({ id: fx.id, query: q.query, what: `removed acceptable: ${fx.commands.join(' | ')}`, basis: 'defect fix', reason: fx.reason });
  } else die(`${fx.id}: unknown fix action ${fx.action}`);
  q.notes = [q.notes, `v0.2.1: ${fx.action} (${fx.reason.split('.')[0]}).`].filter(Boolean).join(' ');
  q.annotation_status = 'corrected_v0.2.1'; r.review_notes = [r.review_notes, `v0.2.1 defect fix: ${fx.action}.`].filter(Boolean).join(' '); r.review_timestamp = `${date}T00:00:00.000Z`;
}

// ---- adjudicated relabels ----
const isTarget = id => { const n = +id.slice(4); return id.startsWith('TA-B') && n >= 151 && n <= 209; };
for (const t of proposal.relabel || []) {
  const q = qById.get(t.id), r = R.get(t.id);
  if (!q || !r) die(`relabel for unknown id ${t.id}`);
  if (!isTarget(t.id)) die(`${t.id} is not a v0.2 target (TA-B151..TA-B209); controls are never relabeled (protocol Amendment 2)`);
  if (q.query !== t.query) die(`${t.id}: proposal query text does not match the benchmark`);
  if (dropped.some(d => d.id === t.id)) continue;
  const m = manual.items[t.id];
  if (m === 'drop') { dropped.push({ id: t.id, query: q.query, basis: 'manual decision', reason: 'resolved as drop in ' + path.basename(manualPath) }); continue; }
  const ri = t.record_ids || {};
  let ids = Array.isArray(m) ? m : (ri.adjudicator && ri.adjudicator.length ? ri.adjudicator : (ri.annotator_1 || []).filter(x => (ri.annotator_2 || []).includes(x)));
  ids = [...new Set(ids.map(x => x.toLowerCase()))].sort();
  const bad = ids.filter(x => !byId.has(x)); if (bad.length) die(`${t.id}: record ids not in the win32 corpus: ${bad.join(', ')}`);
  const need = { OOD: 0, CLEAR: 1, AMBIGUOUS: 2 }[t.to];
  if (need === undefined) die(`${t.id}: unknown target label ${t.to}`);
  if (t.to !== 'OOD' && ids.length < need) { needManual.push({ id: t.id, query: q.query, from: t.from, to: t.to, ids_found: ids, record_ids: ri }); continue; }
  const cmds = ids.map(x => byId.get(x).command), g = t.to === 'OOD' ? null : byId.get(ids[0]);
  Object.assign(q, t.to === 'OOD'
    ? { gold_intent: null, gold_command: null, acceptable_commands: [], category: null, query_type: 'ood', known_task: false, ambiguity: false, requires_rejection: true, source_intent_id: null }
    : { gold_intent: g.intent, gold_command: cmds[0], acceptable_commands: cmds.slice(1), category: g.category, query_type: t.to === 'AMBIGUOUS' ? 'ambiguous' : 'relabeled_clear', known_task: true, ambiguity: t.to === 'AMBIGUOUS', requires_rejection: false, source_intent_id: null });
  q.notes = [q.notes, `v0.2.1: relabeled ${t.from} -> ${t.to} (${t.basis}).`].filter(Boolean).join(' ');
  q.annotation_status = 'adjudicated_v0.2.1';
  Object.assign(r, { reviewer: 'two-annotator study + adjudication (v0.2.1)', decision: t.to === 'CLEAR' ? 'CORRECT' : t.to, final_gold_command: q.gold_command, final_acceptable_commands: q.acceptable_commands, final_ambiguity: q.ambiguity, final_known_task: q.known_task, final_risk_level: q.risk_level, review_notes: [r.review_notes, `v0.2.1: relabeled ${t.from} -> ${t.to} (${t.basis}).`].filter(Boolean).join(' '), review_timestamp: `${date}T00:00:00.000Z` });
  changes.push({ id: t.id, query: q.query, what: `${t.from} -> ${t.to}${ids.length ? ` (records ${ids.join(', ')})` : ''}`, basis: t.basis });
  if (t.to !== 'OOD') riskReview.push({ id: t.id, query: q.query, kept_risk_level: q.risk_level, commands: cmds });
}
for (const e of proposal.excluded_pending || []) if (!dropped.some(d => d.id === e.id)) dropped.push({ id: e.id, query: e.query, basis: e.basis, reason: 'excluded pending resolution (protocol section 4: contested items without adjudication are excluded)' });

if (needManual.length) {
  console.error(`ABORT: ${needManual.length} relabel(s) need a manual decision (too few agreed corpus records):`);
  needManual.forEach(n => console.error(`  ${n.id} "${n.query}" ${n.from}->${n.to}; agreed ids: [${n.ids_found.join(', ')}]; cited: ${JSON.stringify(n.record_ids)}`));
  console.error('Resolve them in a --manual file: { "items": { "<id>": ["tac-...", ...] | "drop" } }');
  process.exit(1);
}

// ---- assemble and check invariants ----
const dropIds = new Set(dropped.map(d => d.id));
const outQ = Q.filter(q => !dropIds.has(q.id)), outR = reviews.map(r => r.id).filter(id => !dropIds.has(id)).map(id => R.get(id));
const problems = [];
if (new Set(outQ.map(q => q.id)).size !== outQ.length) problems.push('duplicate ids');
for (const q of outQ) {
  const r = R.get(q.id);
  if (!r) { problems.push(`${q.id}: no review record`); continue; }
  const cmds = [q.gold_command, ...(q.acceptable_commands || [])].filter(Boolean);
  cmds.forEach(c => { if (!corpusCommands.has(c)) problems.push(`${q.id}: command not a win32 corpus record: ${c}`); });
  const rc = [r.final_gold_command, ...(r.final_acceptable_commands || [])].filter(Boolean);
  rc.forEach(c => { if (!corpusCommands.has(c)) problems.push(`${q.id}: review command not a win32 corpus record: ${c}`); });
  if (r.decision === 'OOD' && (cmds.length || !q.requires_rejection)) problems.push(`${q.id}: OOD decision but benchmark fields disagree`);
  if (q.query_type === 'ood' && r.decision !== 'OOD') problems.push(`${q.id}: query_type ood but review decision ${r.decision}`);
}
if (problems.length) { problems.forEach(p => console.error('INVARIANT  ' + p)); die(`${problems.length} invariant violation(s); nothing written`); }

// ---- write ----
const csvHeaders = ['id', 'query', 'gold_intent', 'gold_command', 'acceptable_commands', 'category', 'difficulty', 'query_type', 'risk_level', 'known_task', 'ambiguity', 'requires_rejection', 'source_intent_id', 'notes', 'annotation_status'];
const csvEsc = v => { if (v === null || v === undefined) return ''; const s = Array.isArray(v) ? v.join('; ') : String(v); return s.includes(',') || s.includes('"') || s.includes('\n') ? '"' + s.replace(/"/g, '""') + '"' : s; };
const meta = { ...bench._meta, name: 'TermAssist-Bench v0.2.1 (Validated)', version: '0.2.1-validated', created_at: `${date}T00:00:00.000Z`,
  description: 'v0.2 with the adjudicated relabels from the two-annotator study and the declared defect fixes. v0.2 stays frozen; see CHANGELOG_v0.2.1.md.',
  parent: { version: '0.2.0-validated', json_sha256_lf: before.json, csv_sha256_lf: before.csv },
  build_inputs: { relabel_proposal_sha256_lf: sha256LF(proposalPath), fixes_sha256_lf: sha256LF(fixesPath), manual_sha256_lf: manualPath ? sha256LF(manualPath) : null } };
fs.mkdirSync(path.join(outDir, 'review'), { recursive: true });
const P = { json: path.join(outDir, 'termassist_bench_v0.2.1_validated.json'), csv: path.join(outDir, 'termassist_bench_v0.2.1_validated.csv'), review: path.join(outDir, 'review/human_review_results_v0.2.1.json') };
fs.writeFileSync(P.json, JSON.stringify({ _meta: meta, queries: outQ }, null, 2), 'utf8');
fs.writeFileSync(P.csv, [csvHeaders.join(','), ...outQ.map(q => csvHeaders.map(h => csvEsc(q[h])).join(','))].join('\n') + '\n', 'utf8');
fs.writeFileSync(P.review, JSON.stringify(outR, null, 2), 'utf8');
const counts = { CORRECT: 0, AMBIGUOUS: 0, OOD: 0, NEEDS_CORRECTION: 0 }; outR.forEach(r => { counts[r.decision] = (counts[r.decision] || 0) + 1; });
const manifest = { benchmark_name: 'TermAssist-Bench', version: 'v0.2.1-validated', total_queries: outQ.length, correct: counts.CORRECT, ood: counts.OOD, ambiguous: counts.AMBIGUOUS, needs_correction: counts.NEEDS_CORRECTION, platform: 'win32', production_code_modified: false,
  parent_benchmark: 'v0.2-validated (unmodified; frozen at commit 0110768)', validation_status: 'frozen',
  validated_json_sha256_lf_normalized: sha256LF(P.json), validated_csv_sha256_lf_normalized: sha256LF(P.csv), review_json_sha256_lf_normalized: sha256LF(P.review),
  created_at: `${date}T00:00:00.000Z`, changelog_path: 'research/datasets/CHANGELOG_v0.2.1.md', synthetic: !!proposal.stamp };
fs.writeFileSync(path.join(outDir, 'VALIDATED_BENCHMARK_MANIFEST_v0.2.1.json'), JSON.stringify(manifest, null, 2), 'utf8');
const cell = x => String(x).replace(/\|/g, '\\|');
const md = [`# TermAssist-Bench v0.2.1 changelog`, '', proposal.stamp ? `**${proposal.stamp}**\n` : '', `Built ${date} by \`research/experiments/build_v0_2_1.js\` from frozen v0.2 (JSON sha256-LF \`${before.json}\`), which is unchanged.`, '',
  `**${outQ.length} queries** (v0.2: ${Q.length}). Review decisions: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}.`, '',
  `## Changed (${changes.length})`, '', '| id | query | change | basis |', '|---|---|---|---|', ...changes.map(c => `| ${c.id} | ${cell(c.query)} | ${cell(c.what)} | ${cell(c.basis)} |`), '',
  `## Dropped (${dropped.length})`, '', '| id | query | basis | reason |', '|---|---|---|---|', ...dropped.map(d => `| ${d.id} | ${cell(d.query)} | ${cell(d.basis)} | ${cell(d.reason)} |`), '',
  `## Needs a human check: risk_level of relabeled items (${riskReview.length})`, '', 'These items now have gold commands but kept their v0.2 risk_level, which was set for their old label. Check each before any safety analysis on v0.2.1.', '',
  ...riskReview.map(x => `- ${x.id} "${x.query}": risk_level ${x.kept_risk_level}; commands: ${x.commands.map(c => '`' + c + '`').join(', ')}`), ''];
fs.writeFileSync(path.join(outDir, 'CHANGELOG_v0.2.1.md'), md.join('\n'), 'utf8');

// ---- v0.2 untouched ----
const after = Object.fromEntries(Object.entries(V02).map(([k, p]) => [k, sha256LF(p)]));
if (JSON.stringify(after) !== JSON.stringify(before)) die('v0.2 files changed during the build -- this must never happen');
console.log(`v0.2.1 written to ${outDir}${proposal.stamp ? ' [' + proposal.stamp + ']' : ''}`);
console.log(`  ${outQ.length} queries; ${changes.length} changed, ${dropped.length} dropped, ${riskReview.length} risk_level checks; decisions ${JSON.stringify(counts)}`);
console.log(`  v0.2 unchanged (JSON ${before.json.slice(0, 12)}..., CSV ${before.csv.slice(0, 12)}..., review ${before.review.slice(0, 12)}...)`);
