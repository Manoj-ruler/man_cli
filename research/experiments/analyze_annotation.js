// Implements the analysis plan fixed in research/datasets/annotation/ANNOTATION_PROTOCOL.md section 4,
// BEFORE any real label exists. Nothing here may be changed after real returns arrive without a dated
// amendment to the protocol.
//
//   node analyze_annotation.js [--adjudication returned/adjudication.csv]
//   add --allow-synthetic --workdir <dir> --a1 <f> --a2 <f> [--adjudication <f>]   for test fixtures
//
// SAFETY: a real run only accepts inputs inside research/datasets/annotation/returned/ and writes to
// research/results/annotation/. A synthetic run must write OUTSIDE research/, and every output is
// stamped SYNTHETIC. Test fixtures can therefore never land in the results folder.
//
// Primary reliability estimate: unweighted Cohen's kappa (3 classes) between the two annotators over
// all Tier-1 items except TA-B187 (78 items = 58 targets + 20 controls), 95% percentile bootstrap CI
// over items (10,000 resamples, seed 42). Also: kappa on the 58 targets alone, agreement, confusion
// matrix, per-item outcomes (CONFIRMED / REVERSED / CONTESTED), pre-declared success criteria,
// secondary descriptives, and (if an adjudication sheet is supplied) final label status.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const C = require('./annotation_common');
const { dir, root, parseCsv, csvCell, cohenKappa, bootstrapKappa, confusion } = C;

const args = process.argv.slice(2);
const flag = f => args.includes(f), val = f => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
const SYN = flag('--allow-synthetic'), workdir = val('--workdir');
const CATS = ['CLEAR', 'AMBIGUOUS', 'OOD'];
const EXCLUDED = new Set(['TA-B187']);
const KAPPA_TARGET = 0.70, OOD_CONFIRM_TARGET = 0.90;

const within = (base, p) => { const rel = path.relative(base, path.resolve(p)); return !rel.startsWith('..') && !path.isAbsolute(rel); };
if (SYN) {
  if (!workdir) { console.error('--allow-synthetic requires --workdir <dir>'); process.exit(2); }
  if (within(path.join(root, 'research'), workdir)) { console.error('ABORT: synthetic runs must write outside the repo research/ folder.'); process.exit(2); }
}
const f1 = val('--a1') || path.join(dir, 'returned/annotator_1.csv'), f2 = val('--a2') || path.join(dir, 'returned/annotator_2.csv');
const fAdj = val('--adjudication');
if (!SYN) for (const f of [f1, f2, fAdj].filter(Boolean)) if (!within(path.join(dir, 'returned'), f)) { console.error(`ABORT: ${f} is not inside returned/. Use --allow-synthetic --workdir for test fixtures.`); process.exit(2); }
const outDir = SYN ? path.join(workdir, 'results') : path.join(root, 'research/results/annotation');
const coordDir = SYN ? path.join(workdir, 'coordinator') : path.join(dir, 'coordinator');
const STAMP = SYN ? 'SYNTHETIC TEST DATA -- NOT REAL ANNOTATIONS' : null;

// ---- validate returned sheets first ----
[[f1, '1'], [f2, '2']].forEach(([f, n]) => { try { execFileSync('node', [path.join(__dirname, 'validate_returned_sheet.js'), f, n], { stdio: 'pipe' }); } catch (e) { console.error(`ABORT: annotator ${n}'s sheet failed validation:\n` + (e.stdout || '') + (e.stderr || '')); process.exit(1); } });
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

// ---- load + join ----
const key = JSON.parse(fs.readFileSync(path.join(dir, 'coordinator/KEY_DO_NOT_SHARE_WITH_ANNOTATORS.json'), 'utf-8')).items;
function loadSheet(f) {
  const m = new Map();
  parseCsv(fs.readFileSync(f, 'utf-8')).slice(1).forEach(r => {
    const raw = (r[4] || '').trim();
    m.set(r[0], { label: r[2].trim().toUpperCase(), conf: +r[3].trim(), ids: raw.toLowerCase() === 'none' || !raw ? [] : raw.split(/[;,\s]+/).filter(Boolean).map(s => s.toLowerCase()), comment: (r[5] || '').trim() });
  });
  return m;
}
const s1 = loadSheet(f1), s2 = loadSheet(f2);
const items = key.map(k => ({ id: k.id, query: k.query, group: k.group, query_type: k.query_type, original: k.original_label, a1: s1.get(String(k.item_no_annotator_1)), a2: s2.get(String(k.item_no_annotator_2)) }));
if (items.length !== 79 || items.some(i => !i.a1 || !i.a2)) { console.error('ABORT: item join failed (expected 79 items, all answered)'); process.exit(1); }
items.forEach(i => { i.outcome = i.a1.label === i.a2.label ? (i.a1.label === i.original ? 'CONFIRMED' : 'REVERSED') : 'CONTESTED'; });

const P = items.filter(i => !EXCLUDED.has(i.id));                      // 78 primary items
const T = P.filter(i => i.group === 'target');                          // 58 targets
const Ctl = items.filter(i => i.group === 'control');                   // 20 controls
const defects = items.filter(i => EXCLUDED.has(i.id));
const L = (arr, k) => arr.map(i => i[k].label);
const pct = (x, n) => n ? +(100 * x / n).toFixed(1) : null;

// ---- primary + secondary agreement ----
const kP = cohenKappa(L(P, 'a1'), L(P, 'a2'), CATS), ciP = bootstrapKappa(L(P, 'a1'), L(P, 'a2'), CATS);
const kT = cohenKappa(L(T, 'a1'), L(T, 'a2'), CATS), ciT = bootstrapKappa(L(T, 'a1'), L(T, 'a2'), CATS);
const bin = (arr, k, pos) => arr.map(i => (i[k].label === pos ? pos : 'OTHER'));
const collapse = pos => { const a = bin(P, 'a1', pos), b = bin(P, 'a2', pos); return { kappa: cohenKappa(a, b, [pos, 'OTHER']).kappa, ci: bootstrapKappa(a, b, [pos, 'OTHER']) }; };
const kVsOrig = k => ({ kappa: cohenKappa(L(P, k), P.map(i => i.original), CATS).kappa });
const bothSure = P.filter(i => i.a1.conf >= 2 && i.a2.conf >= 2), anyUnsure = P.filter(i => i.a1.conf === 1 || i.a2.conf === 1);
const agreeRate = arr => ({ n: arr.length, agree: arr.filter(i => i.a1.label === i.a2.label).length, pct: pct(arr.filter(i => i.a1.label === i.a2.label).length, arr.length) });

// ---- per-item outcomes ----
const out58 = { OOD: {}, AMBIGUOUS: {} };
['OOD', 'AMBIGUOUS'].forEach(c => ['CONFIRMED', 'REVERSED', 'CONTESTED'].forEach(o => { out58[c][o] = T.filter(i => i.original === c && i.outcome === o).length; }));
const oodT = T.filter(i => i.original === 'OOD');
const oodConfirmed = { n: oodT.length, both_agree_with_original: oodT.filter(i => i.outcome === 'CONFIRMED').length, annotator_1: oodT.filter(i => i.a1.label === 'OOD').length, annotator_2: oodT.filter(i => i.a2.label === 'OOD').length };
oodConfirmed.rate = oodT.length ? oodConfirmed.both_agree_with_original / oodT.length : NaN;

// ---- controls ----
const canon = Ctl.filter(i => i.query_type === 'canonical');
const controls = { n: Ctl.length, annotators_disagree: Ctl.filter(i => i.outcome === 'CONTESTED').length, both_not_clear: Ctl.filter(i => i.outcome === 'REVERSED').length,
  attention_checks_canonical: { n: canon.length, annotator_1_not_clear: canon.filter(i => i.a1.label !== 'CLEAR').length, annotator_2_not_clear: canon.filter(i => i.a2.label !== 'CLEAR').length },
  flagged_ids: Ctl.filter(i => i.outcome !== 'CONFIRMED').map(i => i.id) };

// ---- diagnostic: contested items -- did the annotators cite the same records? ----
function idRelation(a, b) {
  if (!a.length || !b.length) return 'at least one cited no records';
  const A = new Set(a), B = new Set(b), inter = [...A].filter(x => B.has(x)).length;
  return inter === A.size && inter === B.size ? 'same records (disagree about the RULES)' : inter > 0 ? 'overlapping records' : 'disjoint records (disagree about the LIST)';
}
const contestedTargets = T.filter(i => i.outcome === 'CONTESTED');
const relations = {}; contestedTargets.forEach(i => { const r = idRelation(i.a1.ids, i.a2.ids); relations[r] = (relations[r] || 0) + 1; });

// ---- comparison with the first blind review (14 overlapping items) ----
let firstReview = null;
try {
  const ans = C.rd('research/datasets/independent_review/review_sheet.json'), akey = C.rd('research/datasets/independent_review/ANSWER_KEY_do_not_share_with_reviewer.json');
  const map = { A: 'CLEAR', B: 'AMBIGUOUS', C: 'OOD' }; const byRv = new Map(akey.map(k => [k.review_id, k.original_id]));
  const rows = ans.map(a => { const id = byRv.get(a.review_id); const it = items.find(i => i.id === id); return it && { id, original: it.original, first_review: map[a.answer], a1: it.a1.label, a2: it.a2.label }; }).filter(Boolean);
  firstReview = { n: rows.length, first_vs_a1: rows.filter(r => r.first_review === r.a1).length, first_vs_a2: rows.filter(r => r.first_review === r.a2).length, a1_vs_a2: rows.filter(r => r.a1 === r.a2).length, first_vs_original: rows.filter(r => r.first_review === r.original).length, a1_vs_original: rows.filter(r => r.a1 === r.original).length, a2_vs_original: rows.filter(r => r.a2 === r.original).length, rows };
} catch (e) { firstReview = { error: 'first-review files not available: ' + e.message }; }

// ---- adjudication integration ----
let adjudication = null;
items.forEach(i => { i.final_status = null; i.final_label = null; i.adjudicated_label = null; });
if (fAdj) {
  const akeyPath = path.join(coordDir, 'ADJUDICATION_KEY.json');
  const akey = JSON.parse(fs.readFileSync(akeyPath, 'utf-8'));
  const rows = parseCsv(fs.readFileSync(fAdj, 'utf-8')); const H = rows[0]; const col = n => H.indexOf(n);
  const adjByNo = new Map(rows.slice(1).map(r => [r[0], r[col('adj_label')].trim().toUpperCase()]));
  let decoyDisagree = 0, decoyN = 0;
  akey.items.forEach(k => {
    const it = items.find(i => i.id === k.id); const lab = adjByNo.get(String(k.adj_no));
    if (!lab || !CATS.includes(lab)) { console.error(`ABORT: adjudication item ${k.adj_no} has no valid label`); process.exit(1); }
    it.adjudicated_label = lab; it.adj_role = k.role;
    if (k.role === 'DECOY') { decoyN++; if (lab !== it.original) decoyDisagree++; }
  });
  adjudication = { n_items: akey.items.length, n_reversed: akey.n_reversed, n_contested: akey.n_contested, n_decoys: akey.n_decoys, decoys_where_adjudicator_disagreed_with_unanimous_annotators: `${decoyDisagree}/${decoyN}` };
}
T.forEach(t => {
  if (t.outcome === 'CONFIRMED') { t.final_status = 'CONFIRMED'; t.final_label = t.original; return; }
  const a = t.adjudicated_label;
  if (t.outcome === 'REVERSED') {
    if (!fAdj) { t.final_status = 'REVERSED_NOT_RELABELED (no adjudication)'; t.final_label = t.original; }
    else if (a === t.a1.label) { t.final_status = 'RELABELED (adjudicator confirms annotators)'; t.final_label = a; }
    else if (a === t.original) { t.final_status = 'ORIGINAL_UPHELD (adjudicator sides with original)'; t.final_label = t.original; }
    else { t.final_status = 'UNRESOLVED (adjudicator chose a third label)'; t.final_label = null; }
  } else {
    if (!fAdj) { t.final_status = 'EXCLUDED_CONTESTED (no adjudication)'; t.final_label = null; }
    else { t.final_status = a === t.original ? 'ADJUDICATED_ORIGINAL_UPHELD' : 'ADJUDICATED_CHANGED'; t.final_label = a; }
  }
});
const statusCounts = {}; T.forEach(t => { statusCounts[t.final_status] = (statusCounts[t.final_status] || 0) + 1; });
const changed = T.filter(t => t.final_label && t.final_label !== t.original);
const excluded = T.filter(t => t.final_label === null);

// ---- criteria ----
const criteria = {
  kappa_ge_0_70: { value: kP.kappa, target: KAPPA_TARGET, met: kP.kappa >= KAPPA_TARGET },
  ood_confirmed_ge_90pct: { value: oodConfirmed.rate, target: OOD_CONFIRM_TARGET, met: oodConfirmed.rate >= OOD_CONFIRM_TARGET }
};
const allMet = criteria.kappa_ge_0_70.met && criteria.ood_confirmed_ge_90pct.met;

const results = {
  stamp: STAMP, generated_by: 'research/experiments/analyze_annotation.js (protocol section 4)', primary_definition: '78 items = 58 targets + 20 controls; TA-B187 excluded (known platform-mismatch defect)',
  inputs: { annotator_1: { file: path.basename(f1), sha256: sha(f1) }, annotator_2: { file: path.basename(f2), sha256: sha(f2) }, adjudication: fAdj ? { file: path.basename(fAdj), sha256: sha(fAdj) } : null },
  primary: { n: kP.n, percent_agreement: +(100 * kP.po).toFixed(1), kappa: +kP.kappa.toFixed(4), ci95: [+ciP.lo.toFixed(4), +ciP.hi.toFixed(4)], degenerate: kP.degenerate, confusion_rows_annotator1_cols_annotator2: confusion(L(P, 'a1'), L(P, 'a2'), CATS) },
  targets_only: { n: kT.n, percent_agreement: +(100 * kT.po).toFixed(1), kappa: +kT.kappa.toFixed(4), ci95: [+ciT.lo.toFixed(4), +ciT.hi.toFixed(4)] },
  criteria, all_pre_declared_criteria_met: allMet,
  outcomes_targets: { by_original_class: out58, ood_confirmation: oodConfirmed },
  secondary: {
    kappa_ood_vs_not: (() => { const c = collapse('OOD'); return { kappa: +c.kappa.toFixed(4), ci95: [+c.ci.lo.toFixed(4), +c.ci.hi.toFixed(4)] }; })(),
    kappa_ambiguous_vs_not: (() => { const c = collapse('AMBIGUOUS'); return { kappa: +c.kappa.toFixed(4), ci95: [+c.ci.lo.toFixed(4), +c.ci.hi.toFixed(4)] }; })(),
    kappa_annotator1_vs_original: +kVsOrig('a1').kappa.toFixed(4), kappa_annotator2_vs_original: +kVsOrig('a2').kappa.toFixed(4),
    agreement_when_both_confidence_ge_2: agreeRate(bothSure), agreement_when_any_confidence_1: agreeRate(anyUnsure),
    contested_targets_record_id_relation: relations
  },
  controls, benchmark_defect_items: defects.map(d => ({ id: d.id, original: d.original, annotator_1: d.a1.label, annotator_2: d.a2.label, note: 'excluded from primary kappa; reported here only' })),
  comparison_with_first_blind_review: firstReview,
  adjudication, final_status_counts: statusCounts
};
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'annotation_results.json'), JSON.stringify(results, null, 2), 'utf-8');

// per-item table
const csv = ['id,group,original_label,annotator_1,conf_1,annotator_2,conf_2,outcome,adjudicated_label,final_status,final_label'];
items.forEach(i => csv.push([i.id, i.group, i.original, i.a1.label, i.a1.conf, i.a2.label, i.a2.conf, EXCLUDED.has(i.id) ? 'EXCLUDED_DEFECT(' + i.outcome + ')' : i.outcome, i.adjudicated_label || '', csvCell(i.final_status || ''), i.final_label || ''].join(',')));
fs.writeFileSync(path.join(outDir, 'per_item.csv'), csv.join('\n') + '\n', 'utf-8');

// relabel proposal (a PROPOSAL only: building v0.2.1 is a separate, deliberate step)
fs.writeFileSync(path.join(outDir, 'relabel_proposal.json'), JSON.stringify({ stamp: STAMP, status: 'PROPOSAL ONLY -- v0.2 stays frozen; any accepted change becomes benchmark v0.2.1 with a new hash and changelog', adjudication_supplied: !!fAdj,
  relabel: changed.map(t => ({ id: t.id, query: t.query, from: t.original, to: t.final_label, basis: t.final_status })),
  excluded_pending: excluded.map(t => ({ id: t.id, query: t.query, original: t.original, basis: t.final_status })),
  benchmark_defects_to_correct_or_drop: ['TA-B187 (gold and all acceptable commands are Linux/macOS-only records)', 'TA-B145 (gold not a corpus record)', 'TA-B149 (one acceptable command not a corpus record)'] }, null, 2), 'utf-8');

// ---- human-readable report ----
const f = x => (typeof x === 'number' ? x.toFixed(3) : x);
const cm = results.primary.confusion_rows_annotator1_cols_annotator2;
const md = [];
if (STAMP) md.push(`> **${STAMP}**`, '');
md.push('# Annotation study results (protocol section 4, as pre-declared)', '',
  `Inputs: ${results.inputs.annotator_1.file} (${results.inputs.annotator_1.sha256.slice(0, 12)}…), ${results.inputs.annotator_2.file} (${results.inputs.annotator_2.sha256.slice(0, 12)}…)${fAdj ? `, ${results.inputs.adjudication.file}` : ', no adjudication yet'}.`, '',
  '## Primary reliability estimate', '',
  `Unweighted Cohen's kappa, 3 classes, ${kP.n} items (58 targets + 20 controls; TA-B187 excluded): **κ = ${f(kP.kappa)}**, 95% bootstrap CI [${f(ciP.lo)}, ${f(ciP.hi)}]; percent agreement ${results.primary.percent_agreement}%.`, '',
  `Targets only (${kT.n}): κ = ${f(kT.kappa)}, 95% CI [${f(ciT.lo)}, ${f(ciT.hi)}], agreement ${results.targets_only.percent_agreement}%.`, '',
  '| annotator 1 \\ 2 | CLEAR | AMBIGUOUS | OOD |', '|---|---:|---:|---:|', ...CATS.map(r => `| ${r} | ${cm[r].CLEAR} | ${cm[r].AMBIGUOUS} | ${cm[r].OOD} |`), '',
  '## Pre-declared criteria', '',
  `- κ ≥ ${KAPPA_TARGET}: **${criteria.kappa_ge_0_70.met ? 'MET' : 'NOT MET'}** (κ = ${f(kP.kappa)})`,
  `- OOD confirmed (both annotators agree with the original on ≥ ${OOD_CONFIRM_TARGET * 100}% of OOD targets): **${criteria.ood_confirmed_ge_90pct.met ? 'MET' : 'NOT MET'}** (${oodConfirmed.both_agree_with_original}/${oodConfirmed.n} = ${f(oodConfirmed.rate)})`, '',
  allMet ? 'Both criteria met.' : '**Not all criteria met.** Per protocol: report as measured. At most ONE codebook revision, evaluated only on NEW unseen items; if none exist, report this result and state that ambiguous labels are unreliable (the ambiguity-detection claim leaves the headline).', '',
  '## Per-item outcomes vs the original label (58 targets)', '', '| original | CONFIRMED | REVERSED | CONTESTED |', '|---|---:|---:|---:|',
  ...['OOD', 'AMBIGUOUS'].map(c => `| ${c} | ${out58[c].CONFIRMED} | ${out58[c].REVERSED} | ${out58[c].CONTESTED} |`), '',
  `Benchmark-defect item(s) reported separately: ${defects.map(d => `${d.id} (original ${d.original}; annotators ${d.a1.label}/${d.a2.label})`).join('; ')}.`, '',
  '## Secondary (descriptive)', '',
  `- κ OOD vs not-OOD: ${results.secondary.kappa_ood_vs_not.kappa} [${results.secondary.kappa_ood_vs_not.ci95}]; AMBIGUOUS vs not: ${results.secondary.kappa_ambiguous_vs_not.kappa} [${results.secondary.kappa_ambiguous_vs_not.ci95}]`,
  `- κ of each annotator vs the original labels: ${results.secondary.kappa_annotator1_vs_original} / ${results.secondary.kappa_annotator2_vs_original}`,
  `- Agreement when both confidence ≥ 2: ${results.secondary.agreement_when_both_confidence_ge_2.agree}/${results.secondary.agreement_when_both_confidence_ge_2.n}; when either said 1: ${results.secondary.agreement_when_any_confidence_1.agree}/${results.secondary.agreement_when_any_confidence_1.n}`,
  `- Contested targets, record ids cited: ${Object.entries(relations).map(([k, v]) => `${v} × ${k}`).join('; ') || 'none contested'}`,
  `- Controls: ${controls.annotators_disagree} with annotator disagreement, ${controls.both_not_clear} where both said not-CLEAR (flagged ids: ${controls.flagged_ids.join(', ') || 'none'}); canonical attention checks missed: annotator 1 = ${controls.attention_checks_canonical.annotator_1_not_clear}/${controls.attention_checks_canonical.n}, annotator 2 = ${controls.attention_checks_canonical.annotator_2_not_clear}/${controls.attention_checks_canonical.n}. Control disputes are NOT adjudicated under the protocol; look at them by hand.`, '');
if (firstReview && !firstReview.error) md.push('## Comparison with the first blind review (14 overlapping items)', '', `Agreement with the first reviewer: annotator 1 ${firstReview.first_vs_a1}/${firstReview.n}, annotator 2 ${firstReview.first_vs_a2}/${firstReview.n}; the two annotators with each other ${firstReview.a1_vs_a2}/${firstReview.n}; original label vs first reviewer ${firstReview.first_vs_original}/${firstReview.n}.`, '');
if (adjudication) md.push('## Adjudication', '', `${adjudication.n_items} items adjudicated (${adjudication.n_reversed} reversed, ${adjudication.n_contested} contested, ${adjudication.n_decoys} decoys). Decoys where the adjudicator disagreed with the unanimous annotators: ${adjudication.decoys_where_adjudicator_disagreed_with_unanimous_annotators}.`, '', ...Object.entries(statusCounts).map(([k, v]) => `- ${k}: ${v}`), '', `Proposed label changes: ${changed.length}; excluded pending resolution: ${excluded.length}. See relabel_proposal.json (a proposal only; v0.2 stays frozen).`, '');
else md.push('## Adjudication', '', 'Not yet supplied. REVERSED items are not relabeled and CONTESTED items are excluded until a third reader adjudicates.', '');
md.push('## Reminders from the protocol', '', '- Any label change produces a NEW benchmark version (v0.2.1). Re-run the fixed analysis family on it and report next to v0.2; it is exploratory again.', '- Not allowed after labels exist: choosing/replacing/dropping annotators, changing the kappa variant, or merging classes as the primary analysis.', '- Precision: this is a reliability estimate for one pair of annotators.');
fs.writeFileSync(path.join(outDir, 'ANNOTATION_RESULTS.md'), md.join('\n') + '\n', 'utf-8');

console.log(`${STAMP ? '[' + STAMP + ']\n' : ''}primary κ = ${f(kP.kappa)} [${f(ciP.lo)}, ${f(ciP.hi)}] over ${kP.n} items; agreement ${results.primary.percent_agreement}%`);
console.log(`targets only κ = ${f(kT.kappa)} [${f(ciT.lo)}, ${f(ciT.hi)}] over ${kT.n}`);
console.log(`criteria: κ≥0.70 ${criteria.kappa_ge_0_70.met ? 'MET' : 'NOT MET'}; OOD confirmed ≥90% ${criteria.ood_confirmed_ge_90pct.met ? 'MET' : 'NOT MET'} (${oodConfirmed.both_agree_with_original}/${oodConfirmed.n})`);
console.log(`outcomes (targets): ${JSON.stringify(out58)}`);
console.log(`wrote ${path.relative(root, path.join(outDir, 'annotation_results.json'))}, ANNOTATION_RESULTS.md, per_item.csv, relabel_proposal.json`);
