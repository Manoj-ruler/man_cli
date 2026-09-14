// v0.2 pipeline -- identical rule-based safety classifier evaluation to run_safety_eval.js,
// pointed at v0.2's 209-query benchmark (now includes risk_level ground truth for the 24 new
// ambiguous queries too; the 35 new OOD queries are all labeled 'low' risk, per design).

const fs = require('fs');
const path = require('path');
const { classify } = require('./safety_classifier');

const projectRoot = path.join(__dirname, '..', '..');
const valJsonPath = path.join(projectRoot, 'research/datasets/termassist_bench_v0.2_validated.json');
const lfText = fs.readFileSync(valJsonPath, 'utf-8').replace(/\r\n/g, '\n');
const queries = JSON.parse(lfText).queries;

const candidates = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/v0.2/candidates.json'), 'utf-8')).candidates;
const hybridById = new Map(candidates.filter(c => c.system === 'hybrid').map(c => [c.id, c]));

const TIERS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function evalOnCommandSet(items, commandKey, labelKey) {
  const confusion = {};
  TIERS.forEach(t => { confusion[t] = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }; });
  const rows = items.map(it => {
    const trueLabel = it[labelKey].toUpperCase();
    const predicted = classify(it[commandKey]).tier;
    confusion[trueLabel][predicted]++;
    return { id: it.id, true_label: trueLabel, predicted_label: predicted, exact_match: trueLabel === predicted };
  });
  const exactAccuracy = rows.filter(r => r.exact_match).length / rows.length;
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
  return { n: rows.length, exact_accuracy: +exactAccuracy.toFixed(4), confusion_matrix: confusion, risky_binary: { tp, fp, fn, tn, precision: +precision.toFixed(4), recall: +recall.toFixed(4), f1: +f1.toFixed(4) } };
}

function main() {
  const goldItems = queries.filter(q => q.gold_command).map(q => ({ id: q.id, gold_command: q.gold_command, risk_level: q.risk_level }));
  const goldEval = evalOnCommandSet(goldItems, 'gold_command', 'risk_level');

  const retrievedItems = queries.filter(q => hybridById.has(q.id)).map(q => ({ id: q.id, retrieved_command: hybridById.get(q.id).top1_command, risk_level: q.risk_level }));
  const retrievedEval = evalOnCommandSet(retrievedItems, 'retrieved_command', 'risk_level');

  const output = { experiment_id: 'E10-v0.2-safety-evaluation', benchmark_version: 'v0.2', gold_command_evaluation: goldEval, retrieved_command_evaluation: retrievedEval, generated_at: new Date().toISOString() };
  fs.writeFileSync(path.join(projectRoot, 'research/results/v0.2/safety-eval-results.json'), JSON.stringify(output, null, 2), 'utf-8');

  console.log(`=== v0.2 GOLD COMMAND SAFETY (n=${goldEval.n}) ===`);
  console.log(`Exact accuracy: ${(goldEval.exact_accuracy*100).toFixed(1)}%  Risky-binary: P=${goldEval.risky_binary.precision} R=${goldEval.risky_binary.recall} F1=${goldEval.risky_binary.f1}`);
  console.log(`\n=== v0.2 RETRIEVED COMMAND SAFETY (n=${retrievedEval.n}) ===`);
  console.log(`Exact accuracy: ${(retrievedEval.exact_accuracy*100).toFixed(1)}%  Risky-binary: P=${retrievedEval.risky_binary.precision} R=${retrievedEval.risky_binary.recall} F1=${retrievedEval.risky_binary.f1}`);
  console.log(`\nWrote research/results/v0.2/safety-eval-results.json`);
}

main();
