// Benchmark v0.2 -- programmatic adjudication pass, mirroring v0.1's documented procedure
// (TERMASSIST_BENCH_DESIGN.md section 12-13: verify OOD candidates against the full corpus to
// confirm no matching intent exists; verify ambiguous candidates have 2+ genuinely valid
// interpretations). Runs each candidate through the SAME lexical (BM25) and dense (semantic)
// retrieval used throughout this research program, so adjudication is grounded in what the
// actual systems see, not just human/agent intuition about what "should" be OOD or ambiguous.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { lexicalSearchAll } = require('./lexical_search');
const { denseSearch } = require('./dense_search');

const projectRoot = path.join(__dirname, '..', '..');
const candidates = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/datasets/v0.2_candidates.json'), 'utf-8'));
const platform = os.platform();

async function adjudicateOne(query) {
  const lex = lexicalSearchAll(query, platform).slice(0, 5);
  const denseResult = await denseSearch(query, { platform });
  const denseTop5 = denseResult._scored.slice().sort((a, b) => b.sim - a.sim).slice(0, 5)
    .map(s => ({ command: s.entry.command, intent: s.entry.intent, sim: +s.sim.toFixed(4) }));
  return {
    query,
    lexical_top5: lex.map(l => ({ command: l.command, intent: l.intent, score: +l.score.toFixed(2) })),
    dense_top5: denseTop5
  };
}

async function main() {
  const oodResults = [];
  for (const q of candidates.ood_candidates) oodResults.push(await adjudicateOne(q));

  const ambigResults = [];
  for (const q of candidates.ambiguous_candidates) ambigResults.push(await adjudicateOne(q));

  fs.writeFileSync(path.join(projectRoot, 'research/datasets/v0.2_adjudication_raw.json'), JSON.stringify({ ood: oodResults, ambiguous: ambigResults }, null, 2), 'utf-8');

  console.log('=== OOD CANDIDATES (looking for LOW lexical score AND LOW dense similarity -- no plausible match) ===\n');
  oodResults.forEach(r => {
    const topLex = r.lexical_top5[0];
    const topDense = r.dense_top5[0];
    console.log(`"${r.query}"`);
    console.log(`  lexical top: "${topLex.command}" (score=${topLex.score})`);
    console.log(`  dense top:   "${topDense.command}" (sim=${topDense.sim})`);
  });

  console.log('\n\n=== AMBIGUOUS CANDIDATES (looking for 2+ closely-scored, semantically DISTINCT valid commands) ===\n');
  ambigResults.forEach(r => {
    console.log(`"${r.query}"`);
    r.lexical_top5.slice(0, 3).forEach(l => console.log(`  lexical: "${l.command}" (score=${l.score})`));
  });

  console.log(`\nWrote raw adjudication data to research/datasets/v0.2_adjudication_raw.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
