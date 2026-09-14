// Phase 11 (E10) -- evaluate the rule-based safety classifier against the benchmark's existing
// ground-truth risk_level labels (150 queries: 120 low, 10 medium, 15 high, 5 critical -- a
// real labeled dataset already present in termassist_bench_v0.1, not hand-constructed for this
// phase). No command is executed here; this is pure text classification.

const fs = require('fs');
const path = require('path');
const { classify } = require('./safety_classifier');

const projectRoot = path.join(__dirname, '..', '..');
const valJsonPath = path.join(projectRoot, 'research/datasets/termassist_bench_v0.1_validated.json');
const lfText = fs.readFileSync(valJsonPath, 'utf-8').replace(/\r\n/g, '\n');
const queries = JSON.parse(lfText).queries;

const candidates = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/reliability/candidates.json'), 'utf-8')).candidates;
const hybridById = new Map(candidates.filter(c => c.system === 'hybrid').map(c => [c.id, c]));

const TIERS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const TIER_RANK = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };

function evalOnCommandSet(items, commandKey, labelKey) {
  const confusion = {};
  TIERS.forEach(t => { confusion[t] = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }; });

  const rows = items.map(it => {
    const trueLabel = it[labelKey].toUpperCase();
    const predicted = classify(it[commandKey]).tier;
    confusion[trueLabel][predicted]++;
    return { id: it.id, command: it[commandKey], true_label: trueLabel, predicted_label: predicted, exact_match: trueLabel === predicted, rank_diff: TIER_RANK[predicted] - TIER_RANK[trueLabel] };
  });

  const exactAccuracy = rows.filter(r => r.exact_match).length / rows.length;

  // Binary framing: "risky" = HIGH or CRITICAL (the actionable distinction for a
  // confirm-before-execute UX -- MEDIUM/LOW would not require extra confirmation)
  const isRiskyTrue = r => r.true_label === 'HIGH' || r.true_label === 'CRITICAL';
  const isRiskyPred = r => r.predicted_label === 'HIGH' || r.predicted_label === 'CRITICAL';
  let tp = 0, fp = 0, fn = 0, tn = 0;
  rows.forEach(r => {
    if (isRiskyPred(r) && isRiskyTrue(r)) tp++;
    else if (isRiskyPred(r) && !isRiskyTrue(r)) fp++;
    else if (!isRiskyPred(r) && isRiskyTrue(r)) fn++;
    else tn++;
  });
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // "Under-tagged" = predicted less risky than truth (the dangerous direction of error --
  // a HIGH/CRITICAL command wrongly shown as LOW/MEDIUM, i.e. no confirmation prompt shown)
  const underTagged = rows.filter(r => r.rank_diff < 0);
  const overTagged = rows.filter(r => r.rank_diff > 0);

  return {
    n: rows.length, exact_accuracy: +exactAccuracy.toFixed(4),
    confusion_matrix: confusion,
    risky_binary: { tp, fp, fn, tn, precision: +precision.toFixed(4), recall: +recall.toFixed(4), f1: +f1.toFixed(4) },
    under_tagged_count: underTagged.length,
    under_tagged_examples: underTagged.slice(0, 10).map(r => ({ id: r.id, command: r.command, true_label: r.true_label, predicted_label: r.predicted_label })),
    over_tagged_count: overTagged.length,
    rows
  };
}

function main() {
  // Primary evaluation: gold commands (well-defined ground truth pairing with risk_level)
  const goldItems = queries.filter(q => q.gold_command).map(q => ({ id: q.id, gold_command: q.gold_command, risk_level: q.risk_level }));
  const goldEval = evalOnCommandSet(goldItems, 'gold_command', 'risk_level');

  // Secondary: retrieved (hybrid/A3) commands, using the QUERY's true risk_level as the label
  // (i.e. "how well does the safety tag reflect what the user actually sees returned, relative
  // to how risky their original intent was" -- a real-world-exposure framing, not a claim that
  // the retrieved command's OWN semantics were independently re-labeled)
  const retrievedItems = queries.filter(q => hybridById.has(q.id)).map(q => ({ id: q.id, retrieved_command: hybridById.get(q.id).top1_command, risk_level: q.risk_level }));
  const retrievedEval = evalOnCommandSet(retrievedItems, 'retrieved_command', 'risk_level');

  const output = {
    experiment_id: 'E10-safety-evaluation',
    classifier: 'rule-based regex/keyword tagger, research/experiments/safety_classifier.js (deterministic, no ML/LLM)',
    ground_truth: 'termassist_bench_v0.1_validated.json risk_level field (120 low, 10 medium, 15 high, 5 critical)',
    gold_command_evaluation: { exact_accuracy: goldEval.exact_accuracy, confusion_matrix: goldEval.confusion_matrix, risky_binary: goldEval.risky_binary, under_tagged_count: goldEval.under_tagged_count, under_tagged_examples: goldEval.under_tagged_examples },
    retrieved_command_evaluation: { exact_accuracy: retrievedEval.exact_accuracy, confusion_matrix: retrievedEval.confusion_matrix, risky_binary: retrievedEval.risky_binary, under_tagged_count: retrievedEval.under_tagged_count, under_tagged_examples: retrievedEval.under_tagged_examples },
    generated_at: new Date().toISOString()
  };

  const outDir = path.join(projectRoot, 'research/results/safety');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'safety-eval-results.json'), JSON.stringify({ ...output, gold_rows: goldEval.rows, retrieved_rows: retrievedEval.rows }, null, 2), 'utf-8');

  console.log('=== GOLD COMMAND SAFETY CLASSIFICATION (vs. benchmark risk_level ground truth) ===');
  console.log(`Exact 4-tier accuracy: ${(goldEval.exact_accuracy * 100).toFixed(1)}%`);
  console.log(`Risky (HIGH/CRITICAL) binary detection: precision=${goldEval.risky_binary.precision} recall=${goldEval.risky_binary.recall} f1=${goldEval.risky_binary.f1}`);
  console.log(`Confusion matrix (rows=true, cols=predicted):`);
  console.table(goldEval.confusion_matrix);
  console.log(`Under-tagged (dangerous direction -- true risk higher than predicted): ${goldEval.under_tagged_count}`);
  if (goldEval.under_tagged_count > 0) console.log(JSON.stringify(goldEval.under_tagged_examples, null, 2));

  console.log('\n=== RETRIEVED (hybrid/A3) COMMAND SAFETY CLASSIFICATION (real-world exposure) ===');
  console.log(`Exact 4-tier accuracy: ${(retrievedEval.exact_accuracy * 100).toFixed(1)}%`);
  console.log(`Risky (HIGH/CRITICAL) binary detection: precision=${retrievedEval.risky_binary.precision} recall=${retrievedEval.risky_binary.recall} f1=${retrievedEval.risky_binary.f1}`);
  console.log(`Under-tagged: ${retrievedEval.under_tagged_count}`);
  if (retrievedEval.under_tagged_count > 0) console.log(JSON.stringify(retrievedEval.under_tagged_examples, null, 2));

  console.log(`\nWrote ${path.join(outDir, 'safety-eval-results.json')}`);
}

main();
