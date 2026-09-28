// T18 / REV-42 (review round 1: R3 W2, DA m10): the case the paper motivates but never measured --
// a WRONG answer, given with HIGH confidence, whose command is RISKY.
//
// For every query each system answers (baseline: not rejected by its score >= 2.0 rule; hybrid A3:
// always answers), cross:
//   correctness (hit vs wrong; answering an OOD query is wrong)
//   x risk tier of the RETURNED command (the deterministic rule-based classifier, safety_classifier.js)
//   x confidence band of the system's own raw confidence
//     baseline: shipped confidence % in [<80], [80-99], [100]
//     hybrid:   fused top1_score in [<0.95], [0.95-<1.0], [1.0]
// and list every wrong answer whose returned command is HIGH or CRITICAL risk.
// Guards: the hybrid retrieved-command confusion matrix reproduces the committed safety evaluation, and
// hit counts reproduce the committed accuracies (A0 97/135 and 120/159; A3 104/135 and 126/159 non-OOD).
const { C, writeOut } = require('./review_r1_common');
const { classify } = require('./safety_classifier');
const TIERS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], risky = t => t === 'HIGH' || t === 'CRITICAL';

const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const repro = new Map(D.repro.map(r => [r.id, r]));
  const hyb = new Map(D.cands.filter(c => c.system === 'hybrid').map(c => [c.id, c]));
  const non = D.ids.filter(id => !D.isOOD(id));
  C.guard(`${v} baseline non-OOD hits`, non.filter(id => D.variants.baseline_confidence.hitOf.get(id) === 1).length, { 'v0.1': 97, 'v0.2': 120 }[v], 0);
  C.guard(`${v} hybrid non-OOD hits`, non.filter(id => D.variants.hybrid_reliability.hitOf.get(id) === 1).length, { 'v0.1': 104, 'v0.2': 126 }[v], 0);
  // hybrid retrieved-command confusion matrix, as the committed safety evaluation computes it
  const cm = {}; TIERS.forEach(t => { cm[t] = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }; });
  D.queries.forEach(q => { const c = hyb.get(q.id); if (c) cm[q.risk_level.toUpperCase()][classify(c.top1_command).tier]++; });
  C.guard(`${v} hybrid retrieved-command confusion matrix`, cm, D.safety.retrieved_command_evaluation.confusion_matrix, 0);

  const systems = {
    baseline: { answered: id => { const r = repro.get(id); return r.actual.confidence > 0 && r.actual.score >= 2.0; }, command: id => repro.get(id).actual.command,
      hit: id => D.variants.baseline_confidence.hitOf.get(id) === 1, conf: id => repro.get(id).actual.confidence,
      band: c => (c < 80 ? '<80%' : c < 100 ? '80-99%' : '100%'), bands: ['<80%', '80-99%', '100%'] },
    hybrid: { answered: () => true, command: id => hyb.get(id).top1_command, hit: id => D.variants.hybrid_reliability.hitOf.get(id) === 1,
      conf: id => hyb.get(id).top1_score, band: c => (c < 0.95 ? '<0.95' : c < 1 ? '0.95-<1.0' : '1.0'), bands: ['<0.95', '0.95-<1.0', '1.0'] }
  };
  const out = {};
  for (const [name, S] of Object.entries(systems)) {
    const answered = D.ids.filter(S.answered);
    const table = {}; ['correct', 'wrong'].forEach(k => { table[k] = {}; TIERS.forEach(t => { table[k][t] = {}; S.bands.forEach(b => { table[k][t][b] = 0; }); }); });
    const wrongRisky = [];
    answered.forEach(id => {
      const tier = classify(S.command(id)).tier, ok = S.hit(id) && !D.isOOD(id), b = S.band(S.conf(id));
      table[ok ? 'correct' : 'wrong'][tier][b]++;
      if (!ok && risky(tier)) { const q = D.qById.get(id); wrongRisky.push({ id, query: q.query, returned: S.command(id), tier, confidence: S.conf(id), band: b, gold: q.gold_command, benchmark_risk: q.risk_level, is_ood: D.isOOD(id) }); }
    });
    const topBand = S.bands[S.bands.length - 1];
    out[name] = {
      answered: answered.length, table,
      wrong_and_risky: { n: wrongRisky.length, of_answered: C.wilson(wrongRisky.length, answered.length), in_top_confidence_band: wrongRisky.filter(x => x.band === topBand).length, items: wrongRisky },
      risky_returned_commands: { n: answered.filter(id => risky(classify(S.command(id)).tier)).length, of_which_wrong: wrongRisky.length }
    };
  }
  result.versions[v] = out;
}
const guards = C.assertGuards('review_r1_d_risk');
writeOut('review_r1_d_risk', { task: 'T18 / REV-42: correctness x returned-command risk x confidence', caveat: 'Risk tiers come from the rule-based classifier applied to the RETURNED command; the classifier itself misses at least one destructive command (T5), so risky counts are lower bounds on what a user could be shown.', reproduction_checks: guards, ...result });
for (const [v, R] of Object.entries(result.versions)) for (const [s, x] of Object.entries(R)) {
  console.log(`\n${v} ${s}: answered ${x.answered}; risky returned ${x.risky_returned_commands.n}, of which wrong ${x.wrong_and_risky.n} (${x.wrong_and_risky.in_top_confidence_band} in the top confidence band)`);
  x.wrong_and_risky.items.forEach(i => console.log(`   ${i.id} [${i.tier}, ${i.band}${i.is_ood ? ', OOD' : ''}] "${i.query}" -> ${i.returned}`));
}
