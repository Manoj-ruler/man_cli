// T5 (research/PLAN_TASKS.md): safety recount under the spec's definition.
//
// Spec section 7.2: a dangerous-direction miss is a command labeled high or critical that the
// classifier tags low OR medium; the primary safety claim requires this miss rate to be 0. The paper
// used a narrower definition (tagged low only) and claimed zero misses. This script re-runs the
// deterministic classifier on the same inputs as run_safety_eval.js / run_safety_eval_v0_2.js,
// reproduces the committed confusion matrices, and lists every miss under both definitions with
// Wilson 95% CIs and raw counts.
//
// Caveat carried into every output: the labels are the benchmark's own risk_level field, not an
// independent safety set (spec gate D-5 is unmet), so these are descriptive numbers only.

const C = require('./phase1_common');
const { classify } = require('./safety_classifier');
const TIERS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const risky = t => t === 'HIGH' || t === 'CRITICAL';

function evaluate(items, cmdKey) {
  const cm = {}; TIERS.forEach(t => { cm[t] = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }; });
  const rows = items.map(it => { const truth = it.risk_level.toUpperCase(), pred = classify(it[cmdKey]).tier; cm[truth][pred]++; return { id: it.id, command: it[cmdKey], truth, pred }; });
  let tp = 0, fp = 0, fn = 0, tn = 0;
  rows.forEach(r => { const a = risky(r.pred), b = risky(r.truth); if (a && b) tp++; else if (a) fp++; else if (b) fn++; else tn++; });
  const positives = rows.filter(r => risky(r.truth));
  const specMiss = positives.filter(r => r.pred === 'LOW' || r.pred === 'MEDIUM');
  const narrowMiss = positives.filter(r => r.pred === 'LOW');
  return {
    n: rows.length, confusion_matrix: cm, exact_accuracy: C.wilson(rows.filter(r => r.truth === r.pred).length, rows.length),
    risky_binary: { tp, fp, fn, tn, precision: C.wilson(tp, tp + fp), recall: C.wilson(tp, tp + fn) },
    dangerous_direction_misses_spec: { definition: 'high/critical tagged low or medium (spec 7.2)', ...C.wilson(specMiss.length, positives.length), items: specMiss },
    dangerous_direction_misses_narrow: { definition: 'high/critical tagged low (definition the paper used)', ...C.wilson(narrowMiss.length, positives.length), items: narrowMiss },
    medium_tagged_low: rows.filter(r => r.truth === 'MEDIUM' && r.pred === 'LOW').length,
    over_tagged_low_as_risky: rows.filter(r => r.truth === 'LOW' && risky(r.pred)).length
  };
}

const result = { versions: {} };
for (const v of ['v0.1', 'v0.2']) {
  const D = C.load(v);
  const hybrid = new Map(D.cands.filter(c => c.system === 'hybrid').map(c => [c.id, c]));
  const gold = evaluate(D.queries.filter(q => q.gold_command).map(q => ({ id: q.id, gold_command: q.gold_command, risk_level: q.risk_level })), 'gold_command');
  const retrieved = evaluate(D.queries.filter(q => hybrid.has(q.id)).map(q => ({ id: q.id, retrieved_command: hybrid.get(q.id).top1_command, risk_level: q.risk_level })), 'retrieved_command');
  C.guard(`${v} gold confusion matrix`, gold.confusion_matrix, D.safety.gold_command_evaluation.confusion_matrix, 0);
  C.guard(`${v} retrieved confusion matrix`, retrieved.confusion_matrix, D.safety.retrieved_command_evaluation.confusion_matrix, 0);
  result.versions[v] = { gold_commands: gold, retrieved_commands: retrieved };
}

const guards = C.assertGuards('phase1_t5_safety_recount');
C.writeOut('phase1_t5_safety_recount', { task: 'T5: safety recount by the spec definition', caveat: 'labels are the benchmark\'s own risk_level field, not an independent safety set (spec gate D-5 unmet); descriptive only', reproduction_checks: guards.map(g => ({ label: g.label, ok: true })), ...result });

for (const [v, R] of Object.entries(result.versions)) for (const [set, x] of Object.entries(R)) {
  const s = x.dangerous_direction_misses_spec, nw = x.dangerous_direction_misses_narrow;
  console.log(`\n${v} ${set} (n=${x.n}): risky P ${x.risky_binary.precision.k}/${x.risky_binary.precision.n} R ${x.risky_binary.recall.k}/${x.risky_binary.recall.n} | misses spec ${s.k}/${s.n} [${s.lo}-${s.hi}] | narrow ${nw.k}/${nw.n} | medium->low ${x.medium_tagged_low}`);
  s.items.forEach(r => console.log(`   miss: ${r.id} ${r.truth}->${r.pred}  ${r.command}`));
}
