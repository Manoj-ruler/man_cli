// v0.2 pipeline -- identical logic to build_query_scores.js, pointed at the v0.2 benchmark and
// a separate output tree (research/results/v0.2/). Corpus embeddings are unchanged (same 431-
// command corpus); only the query set grew.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { lexicalSearchAll } = require('./lexical_search');
const { denseSearch } = require('./dense_search');

const projectRoot = path.join(__dirname, '..', '..');
const valJsonPath = path.join(projectRoot, 'research/datasets/termassist_bench_v0.2_validated.json');
const reviewPath = path.join(projectRoot, 'research/datasets/review/human_review_results_v0.2.json');
const outPath = path.join(projectRoot, 'research/results/v0.2/query_scores_cache.json');

async function main() {
  const lfText = fs.readFileSync(valJsonPath, 'utf-8').replace(/\r\n/g, '\n');
  const queries = JSON.parse(lfText).queries;
  const reviews = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
  const reviewMap = new Map(reviews.map(r => [r.id, r]));
  const platform = os.platform();

  const cache = [];
  for (const q of queries) {
    const r = reviewMap.get(q.id);
    const expectedClassification = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT'));
    const goldCommand = q.gold_command || (r ? r.final_gold_command : null);
    const acceptableCommands = Array.isArray(q.acceptable_commands) ? q.acceptable_commands : [];

    const lexical = lexicalSearchAll(q.query, platform);
    const lexicalNoBonus = lexicalSearchAll(q.query, platform, { includeBonus: false });
    const denseResult = await denseSearch(q.query, { platform });
    const dense = denseResult._scored
      .map(s => ({ command: s.entry.command, intent: s.entry.intent, category: s.entry.category, score: s.sim }))
      .sort((a, b) => b.score - a.score);

    cache.push({
      id: q.id, query: q.query, category: q.category || 'general', query_type: q.query_type || 'standard',
      expected_classification: expectedClassification, gold_command: goldCommand, acceptable_commands: acceptableCommands,
      lexical: lexical, lexical_no_bonus: lexicalNoBonus, dense: dense
    });
    process.stdout.write(`\r  ${cache.length}/${queries.length}`);
  }
  console.log('');

  if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ benchmark_version: 'v0.2', generated_at: new Date().toISOString(), platform, count: cache.length, queries: cache }), 'utf-8');
  console.log(`Wrote v0.2 query score cache for ${cache.length} queries to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
