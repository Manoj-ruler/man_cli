// T3b (research/PLAN_TASKS.md, decision D5): AUGRC next to AURC.
//
// Traub et al. (NeurIPS 2024, "Overcoming Common Flaws in the Evaluation of Selective
// Classification Systems") argue that AURC, which T3 reports, weights errors made at low coverage
// too heavily, and propose AUGRC: the area under the GENERALIZED risk-coverage curve, where the
// generalized risk at coverage k/n is (errors among the k answered queries) / n. It reads as the
// average rate of undetected failures. Lower is better.
//
// Method: the same tie-aware curve as T3 (expected number of errors among the top-k under a
// uniformly random order within tie blocks, exact). AUGRC integrates the piecewise-linear expected
// generalized-risk curve over coverage 0..1 (trapezoid rule, which is exact for that curve).
//
// Guards:
//   1. The T3 AURC point estimates in results/phase1/phase1_t3_selective_ties.json are reproduced
//      (same curve).
//   2. Closed-form identity: AUGRC = acc*(1-acc)*(1-AUROC_c) + (1-acc)^2/2, where AUROC_c is the
//      correctness AUROC with ties counted 1/2. This holds exactly for the tie-aware curve, so any
//      bookkeeping error in the curve fails it.
// Reported: AUGRC with 95% bootstrap CIs (10,000 resamples, seed 42) for the hybrid and the shipped
// baseline confidence, the paired hybrid-minus-baseline difference, on all queries and with the
// 25 canonical controls excluded, for v0.1 and v0.2.

const fs = require('fs');
const path = require('path');
const C = require('./phase1_common');
const B = 10000;

// expected number of errors among the top-k, k = 0..n, ties broken uniformly at random (exact)
function expectedErrors(items) { // items: [{conf, err}]
  const s = items.slice().sort((a, b) => b.conf - a.conf);
  const E = [0]; let i = 0, before = 0;
  while (i < s.length) {
    let j = i; while (j + 1 < s.length && s[j + 1].conf === s[i].conf) j++;
    const size = j - i + 1, errs = s.slice(i, j + 1).reduce((a, x) => a + x.err, 0);
    for (let t = 1; t <= size; t++) E.push(before + errs * t / size);
    before += errs; i = j + 1;
  }
  return E;
}
const aurcOf = items => { const E = expectedErrors(items); let s = 0; for (let k = 1; k < E.length; k++) s += E[k] / k; return s / (E.length - 1); };
const augrcOf = items => { const E = expectedErrors(items), n = E.length - 1; let s = 0; for (let k = 1; k <= n; k++) s += (E[k - 1] + E[k]) / 2; return s / (n * n); };
const closedForm = items => {
  const n = items.length, acc = items.filter(x => !x.err).length / n;
  const a = C.auroc(items.map(x => ({ score: x.conf, pos: !x.err })));
  return acc * (1 - acc) * (1 - a) + (1 - acc) ** 2 / 2;
};

const t3 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'results', 'phase1', 'phase1_t3_selective_ties.json'), 'utf8'));
const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const itemsFor = (signal, filter) => {
    const conf = D.variants[signal === 'hybrid' ? 'hybrid_reliability' : 'baseline_confidence'].rawOf;
    const hit = D.variants[signal === 'hybrid' ? 'hybrid_reliability' : 'baseline_confidence'].hitOf;
    return D.ids.filter(filter).map(id => ({ conf: conf.get(id), err: hit.get(id) ? 0 : 1 }));
  };
  const out = {};
  for (const [label, filter] of [['all', () => true], ['controls_excluded', id => !D.isCanonical(id)]]) {
    const rows = {};
    const items = { hybrid: itemsFor('hybrid', filter), baseline: itemsFor('baseline', filter) };
    for (const sig of ['hybrid', 'baseline']) {
      const it = items[sig], n = it.length;
      C.guard(`${v} ${label} ${sig} AURC reproduces T3`, C.r4(aurcOf(it)), t3.versions[v].selective[label][sig].aurc);
      const g = augrcOf(it);
      C.guard(`${v} ${label} ${sig} AUGRC closed-form identity`, g, closedForm(it), 1e-12);
      const bs = C.bootstrap(n, idx => augrcOf(idx.map(i => it[i])), { B });
      const acc = it.filter(x => !x.err).length / n;
      rows[sig] = { n, accuracy: C.r4(acc), augrc: C.r4(g), augrc_ci95: [bs.lo, bs.hi], aurc_from_t3: t3.versions[v].selective[label][sig].aurc,
        augrc_random_ranking: C.r4((1 - acc) / 2), augrc_oracle: C.r4((1 - acc) ** 2 / 2) };
    }
    const n = items.hybrid.length;
    const diff = C.bootstrap(n, idx => augrcOf(idx.map(i => items.hybrid[i])) - augrcOf(idx.map(i => items.baseline[i])), { B });
    rows.augrc_difference_hybrid_minus_baseline = { point: C.r4(rows.hybrid.augrc - rows.baseline.augrc), ci95: [diff.lo, diff.hi] };
    rows.note = 'hybrid and baseline are scored on their own answers (different top-1 commands), so accuracy differs; AUGRC mixes ranking quality and accuracy by design';
    out[label] = rows;
  }
  result.versions[v] = out;
}

const guards = C.assertGuards('phase1_t3b_augrc');
C.writeOut('phase1_t3b_augrc', {
  task: 'T3b: AUGRC (Traub et al., NeurIPS 2024) next to AURC',
  definition: 'AUGRC = integral over coverage 0..1 of (expected errors among answered queries)/n; tie-aware as in T3; trapezoid rule on the piecewise-linear expected curve',
  identity_checked: 'AUGRC = acc*(1-acc)*(1-AUROC_correctness) + (1-acc)^2/2, to 1e-12',
  reference_points: 'augrc_oracle = (1-acc)^2/2 (every error ranked last); augrc_random_ranking = (1-acc)/2 (AUROC 0.5)',
  bootstrap: { B, seed: 42 }, reproduction_checks: guards.map(g => ({ label: g.label, ok: true })), ...result
});

for (const [v, R] of Object.entries(result.versions)) {
  console.log(`\n=== ${v} ===`);
  for (const [label, S] of Object.entries(R)) {
    for (const sig of ['hybrid', 'baseline']) { const x = S[sig]; console.log(`  [${label}] ${sig.padEnd(8)} n=${x.n} acc ${x.accuracy} | AUGRC ${x.augrc} ${JSON.stringify(x.augrc_ci95)} (oracle ${x.augrc_oracle}, random ${x.augrc_random_ranking}) | AURC ${x.aurc_from_t3}`); }
    console.log(`  [${label}] AUGRC hybrid-baseline ${S.augrc_difference_hybrid_minus_baseline.point} ${JSON.stringify(S.augrc_difference_hybrid_minus_baseline.ci95)}`);
  }
}
