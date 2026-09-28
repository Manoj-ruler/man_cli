// T1 (research/PLAN_TASKS.md): headline metrics with the 25 canonical control queries excluded.
// The canonical queries are verbatim corpus intents (checked below), every system answers all 25
// correctly, and the spec (section 4.2) says controls must not be in headline capability metrics.
//
// Reported, for v0.1 and v0.2:
//   - non-OOD accuracy for A0 (BM25), A1, A2 (dense), A3 (hybrid): all queries vs. controls excluded;
//   - A0->A3 and A2->A3: exact McNemar and paired-bootstrap 95% CI on the delta, controls excluded;
//   - ECE and Brier for the four confidence signals, before/after nested-CV isotonic calibration,
//     with controls excluded in two ways: (a) excluded from evaluation only (calibrator fit on all
//     dev queries), (b) excluded from both fitting and evaluation. Paired-bootstrap CI and one-sided
//     p for the reduction.
// Guards: the all-query numbers must reproduce the committed ablation and calibration results.

const C = require('./phase1_common');
const B = 10000;

const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const corpusIntents = new Set(C.rd('cli/data/commands.json').map(r => r.intent.toLowerCase().trim()));
  const canon = D.queries.filter(q => q.query_type === 'canonical');
  if (C.frozen(v)) C.guard(`${v} canonical count`, canon.length, 25, 0); // hard-coded published count: frozen benchmark only
  C.guard(`${v} canonical queries verbatim corpus intents`, canon.filter(q => corpusIntents.has(q.query.toLowerCase().trim())).length, 25, 0);

  // ---- accuracy ----
  const hitMap = c => new Map(D.ablation.conditions[c].per_query.filter(r => r.classification !== 'OOD').map(r => [r.id, r.hit ? 1 : 0]));
  const H = { A0: hitMap('A0'), A1: hitMap('A1'), A2: hitMap('A2'), A3: hitMap('A3') };
  const allIds = [...H.A0.keys()], exIds = allIds.filter(id => !D.isCanonical(id));
  const acc = (m, ids) => ({ hits: ids.reduce((s, id) => s + m.get(id), 0), n: ids.length });
  const want = { 'v0.1': { A0: 97, A2: 98, A3: 104, n: 135 }, 'v0.2': { A0: 120, A2: 115, A3: 126, n: 159 } }[v];
  if (C.frozen(v)) { ['A0', 'A2', 'A3'].forEach(k => C.guard(`${v} ${k} hits (all non-OOD)`, acc(H[k], allIds).hits, want[k], 0)); C.guard(`${v} non-OOD n`, allIds.length, want.n, 0); }
  else console.log(`${v}: benchmark is not the frozen file; hard-coded count guards skipped`);

  const accuracy = {};
  for (const k of ['A0', 'A1', 'A2', 'A3']) {
    const a = acc(H[k], allIds), e = acc(H[k], exIds);
    accuracy[k] = { all: { ...a, pct: C.r4(100 * a.hits / a.n) }, controls_excluded: { ...e, pct: C.r4(100 * e.hits / e.n) }, controls_hits: acc(H[k], allIds.filter(D.isCanonical)) };
  }
  function compare(kA, kB, ids) {
    let b = 0, c = 0; ids.forEach(id => { const x = H[kA].get(id), y = H[kB].get(id); if (x && !y) b++; if (!x && y) c++; });
    const delta = (acc(H[kB], ids).hits - acc(H[kA], ids).hits) / ids.length;
    const bs = C.bootstrap(ids.length, idx => idx.reduce((s, i) => s + H[kB].get(ids[i]) - H[kA].get(ids[i]), 0) / ids.length, { B });
    return { n: ids.length, a_only_correct: b, b_only_correct: c, exact_mcnemar_p: C.p4(C.exactMcNemar(b, c)), delta_pp: C.r4(100 * delta), ci95_pp: [C.r4(100 * bs.lo), C.r4(100 * bs.hi)] };
  }
  const comparisons = {
    BM25_to_hybrid: { all: compare('A0', 'A3', allIds), controls_excluded: compare('A0', 'A3', exIds) },
    dense_to_hybrid: { all: compare('A2', 'A3', allIds), controls_excluded: compare('A2', 'A3', exIds) }
  };

  // ---- calibration ----
  const calibration = {};
  for (const name of Object.keys(D.variants)) {
    const committed = D.calibration.variants[name];
    const all = C.nestedCalibrate(D, name, 'isotonic');
    C.guard(`${v} ${name} ECE before`, C.r4(C.eceOf(all.before)), committed.before_calibration.ece);
    C.guard(`${v} ${name} ECE after`, C.r4(C.eceOf(all.after)), committed.after_calibration.ece);
    C.guard(`${v} ${name} Brier after`, C.r4(C.brierOf(all.after)), committed.after_calibration.brier);
    const summarize = (run) => {
      const n = run.before.length;
      const bs = C.bootstrap(n, idx => C.eceOf(idx.map(i => run.before[i])) - C.eceOf(idx.map(i => run.after[i])), { B });
      const eb = C.eceOf(run.before), ea = C.eceOf(run.after);
      return { n, ece_before: C.r4(eb), ece_after: C.r4(ea), relative_reduction_pct: C.r4(100 * (eb - ea) / eb),
        brier_before: C.r4(C.brierOf(run.before)), brier_after: C.r4(C.brierOf(run.after)),
        reduction_ci95: [bs.lo, bs.hi], one_sided_p: C.r4(Math.max(1 / B, bs.vals.filter(x => x <= 0).length / B)) };
    };
    calibration[name] = {
      all: summarize(all),
      controls_excluded_eval_only: summarize(C.nestedCalibrate(D, name, 'isotonic', { evalFilter: id => !D.isCanonical(id) })),
      controls_excluded_fit_and_eval: summarize(C.nestedCalibrate(D, name, 'isotonic', { fitFilter: id => !D.isCanonical(id), evalFilter: id => !D.isCanonical(id) }))
    };
  }
  result.versions[v] = { accuracy, comparisons, calibration };
}

const guards = C.assertGuards('phase1_t1_controls_excluded');
C.writeOut('phase1_t1_controls_excluded', { task: 'T1: headline metrics without the 25 canonical controls', bootstrap: { B, seed: 42 }, reproduction_checks: guards, ...result });

for (const [v, R] of Object.entries(result.versions)) {
  console.log(`\n=== ${v} ===`);
  for (const k of ['A0', 'A2', 'A3']) console.log(`  ${k}: all ${R.accuracy[k].all.hits}/${R.accuracy[k].all.n} (${R.accuracy[k].all.pct.toFixed(1)}%)  | controls excluded ${R.accuracy[k].controls_excluded.hits}/${R.accuracy[k].controls_excluded.n} (${R.accuracy[k].controls_excluded.pct.toFixed(1)}%)`);
  for (const [name, c] of Object.entries(R.comparisons)) { const x = c.controls_excluded; console.log(`  ${name} (excl.): ${x.delta_pp.toFixed(1)}pp CI ${JSON.stringify(x.ci95_pp)} discordant ${x.a_only_correct}/${x.b_only_correct} p=${x.exact_mcnemar_p}`); }
  for (const [name, c] of Object.entries(R.calibration)) { const a = c.all, e = c.controls_excluded_fit_and_eval; console.log(`  ${name}: ECE all ${a.ece_before}->${a.ece_after} (${a.relative_reduction_pct.toFixed(1)}%) | excl. ${e.ece_before}->${e.ece_after} (${e.relative_reduction_pct.toFixed(1)}%) CI ${JSON.stringify(e.reduction_ci95)} p=${e.one_sided_p} | Brier excl. ${e.brier_before}->${e.brier_after}`); }
}
