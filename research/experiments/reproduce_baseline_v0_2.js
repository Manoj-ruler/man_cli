// v0.2 pipeline -- run the frozen, untouched cli/search.js against the v0.2 benchmark (209
// queries), to get the production baseline's OOD rejection behavior on the new 50-query OOD
// subset. This is what Phase 13's McNemar's comparison (baseline vs tuned OOD detector) needs
// to be re-run on v0.2's larger, better-powered OOD set.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { performance } = require('perf_hooks');

const { search } = require('../../cli/search');

const projectRoot = path.join(__dirname, '..', '..');
const datasetsDir = path.join(projectRoot, 'research/datasets');
const valJsonPath = path.join(datasetsDir, 'termassist_bench_v0.2_validated.json');
const reviewPath = path.join(datasetsDir, 'review/human_review_results_v0.2.json');
const resultsDir = path.join(projectRoot, 'research/results/v0.2');

if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

const lfText = fs.readFileSync(valJsonPath, 'utf-8').replace(/\r\n/g, '\n');
const benchData = JSON.parse(lfText);
const queries = benchData.queries;
const reviews = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
const reviewMap = new Map(reviews.map(r => [r.id, r]));

const results = [];
const latencies = [];

queries.forEach((q) => {
  const r = reviewMap.get(q.id);
  const expectedClassification = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT'));
  const goldCommand = q.gold_command || (r ? r.final_gold_command : null);
  const acceptableCommands = Array.isArray(q.acceptable_commands) ? q.acceptable_commands : [];
  const allValidCommands = new Set();
  if (goldCommand) allValidCommands.add(goldCommand);
  acceptableCommands.forEach(c => allValidCommands.add(c));

  const start = performance.now();
  const searchResult = search(q.query);
  const end = performance.now();
  latencies.push(+(end - start).toFixed(4));

  const retrieved = searchResult.confidence > 0 && searchResult.score >= 2.0;
  const returnedCommand = searchResult.command;

  let status = 'INCORRECT';
  if (expectedClassification === 'OOD') {
    status = retrieved ? 'OOD_FALSE_ACCEPT' : 'OOD_CORRECT_REJECTION';
  } else if (expectedClassification === 'AMBIGUOUS') {
    if (!retrieved) status = 'REJECTED';
    else if (allValidCommands.has(returnedCommand)) status = 'AMBIGUOUS_CORRECT';
    else status = 'AMBIGUOUS_INCORRECT';
  } else if (expectedClassification === 'CORRECT' || expectedClassification === 'NEEDS_CORRECTION') {
    if (!retrieved) status = 'REJECTED';
    else if (allValidCommands.has(returnedCommand)) status = 'CORRECT';
    else status = 'INCORRECT';
  }

  results.push({ id: q.id, query: q.query, expected: { classification: expectedClassification }, actual: { retrieved, command: returnedCommand, score: +searchResult.score.toFixed(4), confidence: searchResult.confidence, latency_ms: latencies[latencies.length - 1] }, evaluation: { status } });
});

fs.writeFileSync(path.join(resultsDir, 'reproduction-results.json'), JSON.stringify(results, null, 2), 'utf-8');

const oodResults = results.filter(r => r.expected.classification === 'OOD');
const oodCorrectRejection = oodResults.filter(r => r.evaluation.status === 'OOD_CORRECT_REJECTION').length;
const oodFalseAccept = oodResults.filter(r => r.evaluation.status === 'OOD_FALSE_ACCEPT').length;

const nonOod = results.filter(r => r.expected.classification !== 'OOD');
const nonOodCorrect = nonOod.filter(r => ['CORRECT', 'AMBIGUOUS_CORRECT'].includes(r.evaluation.status)).length;

console.log(`=== v0.2 BASELINE REPRODUCTION (${results.length} queries) ===`);
console.log(`Non-OOD accuracy: ${nonOodCorrect}/${nonOod.length} = ${(nonOodCorrect / nonOod.length * 100).toFixed(1)}%`);
console.log(`OOD rejection rate: ${oodCorrectRejection}/${oodResults.length} = ${(oodCorrectRejection / oodResults.length * 100).toFixed(1)}%`);
console.log(`OOD false-acceptance rate: ${oodFalseAccept}/${oodResults.length} = ${(oodFalseAccept / oodResults.length * 100).toFixed(1)}%`);
console.log(`Mean latency: ${(latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(4)} ms`);
console.log(`\nWrote ${path.join(resultsDir, 'reproduction-results.json')}`);
