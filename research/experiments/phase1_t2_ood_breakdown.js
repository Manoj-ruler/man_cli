// T2 (research/PLAN_TASKS.md): OOD rejection broken down by where the OOD queries came from and
// what kind of OOD they are, plus the cost of the detector on legitimate (non-OOD) queries.
//
// Detector decisions are reconstructed from the committed Split A per-fold thresholds (top1_score
// below the fold's threshold => rejected as OOD); baseline decisions from the frozen baseline's
// reproduction (not retrieved => rejected). Guards: both must reproduce the committed confusion
// counts and the v0.2 McNemar contingency.
//
// Subtype labels come from research/datasets/ood_subtypes_v0.2_ai_assigned.json: assigned by the AI
// assistant, NOT human-validated, descriptive only. The source grouping (v0.1 original vs. added in
// v0.2) is objective.

const C = require('./phase1_common');
const B = 10000;
const labels = C.rd('research/datasets/ood_subtypes_v0.2_ai_assigned.json');
const subtypeOf = new Map(labels.labels.map(l => [l.id, l.subtype]));
const TERMINAL = new Set(labels.terminal_task_subtypes);
const num = id => +id.slice(-3);

function analyse(v) {
  const D = C.load(v);
  const thr = new Map(D.selective.ood_detection.per_fold.map(p => [p.test_fold, p.selected_threshold]));
  const tunedRejects = id => D.featById.get(id).top1_score < thr.get(D.folds.assignment[id]);
  const baseById = new Map(D.repro.map(r => [r.id, r]));
  const baseRejects = id => !baseById.get(id).actual.retrieved;

  const ood = D.ids.filter(D.isOOD), non = D.ids.filter(id => !D.isOOD(id));
  // guards
  const tp = ood.filter(tunedRejects).length, fp = non.filter(tunedRejects).length;
  const pc = D.selective.ood_detection.pooled_confusion;
  C.guard(`${v} detector TP`, tp, pc.tp, 0); C.guard(`${v} detector FP`, fp, pc.fp, 0);
  C.guard(`${v} detector FN`, ood.length - tp, pc.fn, 0); C.guard(`${v} detector TN`, non.length - fp, pc.tn, 0);
  if (C.frozen(v)) C.guard(`${v} baseline OOD rejections`, ood.filter(baseRejects).length, v === 'v0.1' ? 4 : 17, 0); // hard-coded: frozen benchmark only
  // The AI-assigned subtype labels cover the frozen OOD sets only. On a relabelled benchmark (v0.2.1 at
  // the v0.2 path), items that became OOD have no label; they are reported as 'subtype: unlabelled'
  // (as review_r1_e does) and kept out of the terminal/other split, never given a label here.
  const unlabelled = ood.filter(id => !subtypeOf.has(id));
  if (C.frozen(v)) C.guard(`${v} subtype labels cover all OOD`, ood.length - unlabelled.length, ood.length, 0);
  else if (unlabelled.length) console.log(`note: ${v} is not the frozen benchmark; ${unlabelled.length} OOD item(s) without a subtype label: ${unlabelled.join(', ')}`);
  ood.filter(id => subtypeOf.has(id)).forEach(id => C.guard(`${v} ${id} label text`, labels.labels.find(l => l.id === id).query, D.qById.get(id).query, 0));
  if (v === 'v0.2') {
    const st = C.rd('research/results/v0.2/statistical-analysis-results.json').contingency;
    let both = 0, bOnly = 0, tOnly = 0, none = 0;
    ood.forEach(id => { const b = baseRejects(id), t = tunedRejects(id); if (b && t) both++; else if (b) bOnly++; else if (t) tOnly++; else none++; });
    C.guard('v0.2 McNemar contingency', { both, bOnly, tOnly, none }, { both: st.both_correctly_rejected, bOnly: st.baseline_only_correct, tOnly: st.tuned_only_correct, none: st.both_wrong }, 0);
  }

  const negScores = non.map(id => D.featById.get(id).top1_score);
  function group(name, ids) {
    const tr = ids.filter(tunedRejects).length, br = ids.filter(baseRejects).length;
    let b = 0, c = 0; ids.forEach(id => { const x = baseRejects(id), y = tunedRejects(id); if (x && !y) b++; if (!x && y) c++; });
    const pos = ids.map(id => D.featById.get(id).top1_score);
    const au = arr => C.auroc([...arr.p.map(s => ({ score: -s, pos: true })), ...arr.n.map(s => ({ score: -s, pos: false }))]);
    // stratified bootstrap: resample positives and negatives separately
    const rng = C.mulberry32(42), vals = [];
    for (let k = 0; k < B; k++) {
      const p = pos.map(() => pos[Math.floor(rng() * pos.length)]), n = negScores.map(() => negScores[Math.floor(rng() * negScores.length)]);
      vals.push(au({ p, n }));
    }
    vals.sort((x, y) => x - y);
    return { group: name, n: ids.length, tuned_rejects: C.wilson(tr, ids.length), baseline_rejects: C.wilson(br, ids.length),
      discordant_baseline_only: b, discordant_tuned_only: c, exact_mcnemar_p: C.p4(C.exactMcNemar(b, c)),
      auroc_vs_all_non_ood: C.r4(au({ p: pos, n: negScores })), auroc_ci95: [C.r4(C.percentile(vals, 0.025)), C.r4(C.percentile(vals, 0.975))],
      queries_with_top_confidence_1: ids.filter(id => D.featById.get(id).top1_score === 1).map(id => `${id} ${D.qById.get(id).query}`) };
  }
  const groups = [group('all OOD', ood)];
  if (v === 'v0.2') { groups.push(group('source: original v0.1 OOD (TA-B078-092)', ood.filter(id => num(id) <= 150))); groups.push(group('source: added in v0.2 (TA-B151-185)', ood.filter(id => num(id) > 150))); }
  groups.push(group('terminal-task OOD (near_ood + unsupported_tool_ood)', ood.filter(id => TERMINAL.has(subtypeOf.get(id)))));
  groups.push(group('other OOD (far_ood + non_terminal + nonsensical)', ood.filter(id => subtypeOf.has(id) && !TERMINAL.has(subtypeOf.get(id)))));
  for (const s of Object.keys(labels.vocabulary)) { const ids = ood.filter(id => subtypeOf.get(id) === s); if (ids.length) groups.push(group(`subtype: ${s}`, ids)); }
  if (unlabelled.length) groups.push(group('subtype: unlabelled', unlabelled));

  // cost on legitimate queries
  const hyb = new Map(D.ablation.conditions.A3.per_query.map(r => [r.id, r.hit]));
  const fr = non.filter(tunedRejects);
  const falseRejections = {
    detector: C.wilson(fr.length, non.length), baseline: C.wilson(non.filter(baseRejects).length, non.length),
    by_label: Object.fromEntries(['CORRECT', 'AMBIGUOUS', 'NEEDS_CORRECTION'].map(k => [k, fr.filter(id => D.cls.get(id) === k).length])),
    of_which_hybrid_was_correct: fr.filter(id => hyb.get(id)).length,
    of_which_canonical_controls: fr.filter(D.isCanonical).length,
    items: fr.map(id => ({ id, query: D.qById.get(id).query, label: D.cls.get(id), hybrid_correct: !!hyb.get(id), top1_score: C.r4(D.featById.get(id).top1_score) }))
  };
  // net trade-off of switching on the detector, counted on queries (not weighted)
  const tradeoff = {
    ood_newly_rejected: ood.filter(id => tunedRejects(id) && !baseRejects(id)).length,
    correct_answers_withheld: fr.filter(id => hyb.get(id)).length,
    non_ood_n: non.length, ood_n: ood.length
  };
  return { groups, false_rejections: falseRejections, tradeoff };
}

const result = { versions: { 'v0.1': analyse('v0.1'), 'v0.2': analyse('v0.2') } };
const guards = C.assertGuards('phase1_t2_ood_breakdown');
C.writeOut('phase1_t2_ood_breakdown', { task: 'T2: OOD by source and subtype; false-rejection cost', subtype_label_provenance: labels._provenance, bootstrap: { B, seed: 42, method: 'stratified (OOD and non-OOD resampled separately)' }, reproduction_checks: guards, ...result });

for (const [v, R] of Object.entries(result.versions)) {
  console.log(`\n=== ${v} (thresholds from the ${v} run) ===`);
  R.groups.forEach(g => console.log(`  ${g.group.padEnd(52)} n=${String(g.n).padStart(2)}  detector ${g.tuned_rejects.k}/${g.n}  baseline ${g.baseline_rejects.k}/${g.n}  discordant ${g.discordant_baseline_only}/${g.discordant_tuned_only} p=${g.exact_mcnemar_p}  AUROC ${g.auroc_vs_all_non_ood} ${JSON.stringify(g.auroc_ci95)}`));
  const f = R.false_rejections;
  console.log(`  false rejections of non-OOD: detector ${f.detector.k}/${f.detector.n} (${(100 * f.detector.rate).toFixed(1)}%, CI ${f.detector.lo}-${f.detector.hi}); baseline ${f.baseline.k}/${f.baseline.n}; by label ${JSON.stringify(f.by_label)}; hybrid had been correct on ${f.of_which_hybrid_was_correct}; canonical ${f.of_which_canonical_controls}`);
  console.log(`  trade-off: ${R.tradeoff.ood_newly_rejected} OOD newly rejected vs ${R.tradeoff.correct_answers_withheld} correct answers withheld`);
}
