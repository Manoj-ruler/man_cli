// Phase 3 (E3) -- exploratory dense-only retrieval run on the frozen 150-query benchmark.
// This is a CHARACTERIZATION run, not the final tuned system: no OOD/rejection threshold
// is tuned here (that is Phase 7's job, on dev folds only). Every query's top-1 dense match
// is reported as "retrieved" unconditionally, so this run answers "how good is semantic
// similarity ranking alone", not "how good is a deployable dense-only assistant".

const fs = require('fs');
const path = require('path');
const os = require('os');
const { performance } = require('perf_hooks');
const { denseSearch } = require('./dense_search');

const projectRoot = path.join(__dirname, '..', '..');
const datasetsDir = path.join(projectRoot, 'research/datasets');
const valJsonPath = path.join(datasetsDir, 'termassist_bench_v0.1_validated.json');
const reviewPath = path.join(datasetsDir, 'review/human_review_results.json');
const resultsDir = path.join(projectRoot, 'research/results/dense');

async function main() {
  const lfText = fs.readFileSync(valJsonPath, 'utf-8').replace(/\r\n/g, '\n');
  const benchData = JSON.parse(lfText);
  const queries = benchData.queries;
  const reviews = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
  const reviewMap = new Map(reviews.map(r => [r.id, r]));

  const results = [];
  const latencies = [];

  for (const q of queries) {
    const r = reviewMap.get(q.id);
    const expectedClassification = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT'));
    const goldCommand = q.gold_command || (r ? r.final_gold_command : null);
    const acceptableCommands = Array.isArray(q.acceptable_commands) ? q.acceptable_commands : [];
    const allValidCommands = new Set();
    if (goldCommand) allValidCommands.add(goldCommand);
    acceptableCommands.forEach(c => allValidCommands.add(c));

    const start = performance.now();
    const searchResult = await denseSearch(q.query, { platform: os.platform() });
    const end = performance.now();
    latencies.push(+(end - start).toFixed(4));

    const returnedCommand = searchResult.command;
    const isMatch = allValidCommands.has(returnedCommand);

    let status;
    if (expectedClassification === 'OOD') {
      status = 'OOD_FALSE_ACCEPT'; // unconditional accept in this exploratory run -> always "false accept" for OOD since no rejection exists yet
    } else if (expectedClassification === 'AMBIGUOUS') {
      status = isMatch ? 'AMBIGUOUS_CORRECT' : 'AMBIGUOUS_INCORRECT';
    } else {
      status = isMatch ? 'CORRECT' : 'INCORRECT';
    }

    results.push({
      id: q.id, query: q.query, category: q.category || 'general', query_type: q.query_type || 'standard',
      expected: { classification: expectedClassification, gold_command: goldCommand, acceptable_commands: acceptableCommands },
      actual: { command: returnedCommand, semantic_score: searchResult.semantic_score, confidence: searchResult.confidence, latency_ms: latencies[latencies.length - 1] },
      evaluation: { status }
    });
    process.stdout.write(`\r  ${results.length}/${queries.length}`);
  }
  console.log('');

  const totalCorrect = results.filter(r => r.evaluation.status === 'CORRECT').length;
  const totalAmbigCorrect = results.filter(r => r.evaluation.status === 'AMBIGUOUS_CORRECT').length;
  const nonOod = results.filter(r => r.expected.classification !== 'OOD');

  const queryTypeStats = {};
  results.forEach(r => {
    const qt = r.query_type;
    if (!queryTypeStats[qt]) queryTypeStats[qt] = { total: 0, hits: 0 };
    queryTypeStats[qt].total++;
    if (r.evaluation.status === 'CORRECT' || r.evaluation.status === 'AMBIGUOUS_CORRECT') queryTypeStats[qt].hits++;
  });

  const summary = {
    experiment_id: 'E3-dense-only-exploratory',
    note: 'UNCONDITIONAL top-1 accept, no OOD/rejection threshold tuned (see file header). Not the final system.',
    model_name: require('./dense_search').loadCache().model_name,
    total_queries: results.length,
    non_ood_accuracy_pct: +((totalCorrect + totalAmbigCorrect) / nonOod.length * 100).toFixed(1),
    correct_in_domain_accuracy_pct: +((totalCorrect) / results.filter(r => r.expected.classification === 'CORRECT').length * 100).toFixed(1),
    ambiguity_success_rate_pct: +((totalAmbigCorrect) / results.filter(r => r.expected.classification === 'AMBIGUOUS').length * 100).toFixed(1),
    ood_false_acceptance_rate_pct: 100.0,
    mean_latency_ms: +(latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(4),
    query_type_breakdown: queryTypeStats,
    generated_at: new Date().toISOString()
  };

  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
  fs.writeFileSync(path.join(resultsDir, 'dense-results.json'), JSON.stringify(results, null, 2), 'utf-8');
  fs.writeFileSync(path.join(resultsDir, 'dense-summary.json'), JSON.stringify(summary, null, 2), 'utf-8');
  console.log(JSON.stringify(summary, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
