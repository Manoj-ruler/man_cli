// Phase 4 -- precompute, for every benchmark query, the FULL ranked candidate list from
// both lexical (BM25) and dense (semantic) retrieval. Fusion/alpha-sweep/CV logic then
// operates purely on this cached numeric data -- no repeated embedding-model calls, and no
// re-derivation of anything from cli/search.js beyond the already-validated replica.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { lexicalSearchAll } = require('./lexical_search');
const { denseSearch } = require('./dense_search');

const projectRoot = path.join(__dirname, '..', '..');
const valJsonPath = path.join(projectRoot, 'research/datasets/termassist_bench_v0.1_validated.json');
const reviewPath = path.join(projectRoot, 'research/datasets/review/human_review_results.json');
const outPath = path.join(projectRoot, 'research/results/hybrid/query_scores_cache.json');

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

    const lexical = lexicalSearchAll(q.query, platform); // full ranked list, includes bonus
    const lexicalNoBonus = lexicalSearchAll(q.query, platform, { includeBonus: false }); // for A1 ablation
    const denseResult = await denseSearch(q.query, { platform });
    const dense = denseResult._scored
      .map(s => ({ command: s.entry.command, intent: s.entry.intent, category: s.entry.category, score: s.sim }))
      .sort((a, b) => b.score - a.score);

    cache.push({
      id: q.id,
      query: q.query,
      category: q.category || 'general',
      query_type: q.query_type || 'standard',
      expected_classification: expectedClassification,
      gold_command: goldCommand,
      acceptable_commands: acceptableCommands,
      // Full candidate lists (not truncated) so fusion's per-query min-max normalization and
      // top-1 selection see the complete platform-filtered corpus, not an arbitrary top-20 cut.
      lexical: lexical,
      lexical_no_bonus: lexicalNoBonus,
      dense: dense
    });
    process.stdout.write(`\r  ${cache.length}/${queries.length}`);
  }
  console.log('');

  if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ generated_at: new Date().toISOString(), platform, count: cache.length, queries: cache }), 'utf-8');
  console.log(`Wrote query score cache for ${cache.length} queries to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
