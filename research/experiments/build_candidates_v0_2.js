// v0.2 pipeline -- identical logic to build_candidates.js, pointed at v0.2's cache/folds/hybrid
// results (research/results/v0.2/).

const fs = require('fs');
const path = require('path');
const { fuseQuery } = require('./hybrid_fusion');

const projectRoot = path.join(__dirname, '..', '..');
const cacheDir = path.join(projectRoot, 'research/results/v0.2');
const outDir = path.join(projectRoot, 'research/results/v0.2');

const cache = JSON.parse(fs.readFileSync(path.join(cacheDir, 'query_scores_cache.json'), 'utf-8'));
const folds = JSON.parse(fs.readFileSync(path.join(cacheDir, 'folds.json'), 'utf-8'));
const hybridCv = JSON.parse(fs.readFileSync(path.join(cacheDir, 'hybrid-nested-cv-results.json'), 'utf-8'));

const TOP_K = 10;
const EPS = 1e-9;

const alphaByQueryId = new Map();
hybridCv.per_fold_results.forEach(f => {
  Object.entries(folds.assignment).forEach(([id, foldIdx]) => {
    if (foldIdx === f.test_fold) alphaByQueryId.set(id, f.selected_alpha);
  });
});

function shannonEntropyBits(probs) { return -probs.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0); }

function concentrationFromScores(topKScores) {
  const min = Math.min(...topKScores);
  const shifted = topKScores.map(s => s - min);
  const total = shifted.reduce((a, b) => a + b, 0);
  const probs = total > EPS ? shifted.map(s => s / total) : shifted.map(() => 1 / shifted.length);
  const entropy = shannonEntropyBits(probs);
  const maxEntropy = Math.log2(topKScores.length);
  return { entropy_bits: +entropy.toFixed(4), normalized_entropy: maxEntropy > 0 ? +(entropy / maxEntropy).toFixed(4) : 0 };
}

function marginStats(sortedScores) {
  const s1 = sortedScores[0] ?? 0, s2 = sortedScores[1] ?? 0;
  const margin = s1 - s2;
  const relativeMargin = Math.abs(s1) > EPS ? margin / Math.abs(s1) : 0;
  return { margin: +margin.toFixed(4), relative_margin: +relativeMargin.toFixed(4) };
}

function buildForSystem(entry, ranked, systemName, extra = {}) {
  const topK = ranked.slice(0, TOP_K);
  const scores = topK.map(c => c._scoreValue);
  const { margin, relative_margin } = marginStats(scores);
  const { entropy_bits, normalized_entropy } = concentrationFromScores(scores.length >= 2 ? scores : [scores[0] ?? 0, 0]);
  return {
    id: entry.id, system: systemName, ...extra,
    top_k: topK.map((c, i) => ({ rank: i + 1, command: c.command, intent: c.intent, category: c.category, score: +c._scoreValue.toFixed(4) })),
    top1_command: topK[0] ? topK[0].command : null,
    top1_score: topK[0] ? +topK[0]._scoreValue.toFixed(4) : null,
    margin, relative_margin, entropy_bits, normalized_entropy,
    expected_classification: entry.expected_classification, query_type: entry.query_type,
    gold_command: entry.gold_command, acceptable_commands: entry.acceptable_commands
  };
}

function main() {
  const allCandidates = [];
  cache.queries.forEach(entry => {
    const lexicalRanked = entry.lexical.map(c => ({ ...c, _scoreValue: c.score }));
    allCandidates.push(buildForSystem(entry, lexicalRanked, 'lexical'));
    const denseRanked = entry.dense.map(c => ({ ...c, _scoreValue: c.score }));
    allCandidates.push(buildForSystem(entry, denseRanked, 'dense'));
    const alpha = alphaByQueryId.get(entry.id);
    const { ranked } = fuseQuery(entry, alpha);
    const hybridRanked = ranked.map(c => ({ ...c, _scoreValue: c.fused }));
    allCandidates.push(buildForSystem(entry, hybridRanked, 'hybrid', { alpha_used: alpha }));
  });

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'candidates.json'), JSON.stringify({ benchmark_version: 'v0.2', generated_at: new Date().toISOString(), top_k: TOP_K, count: allCandidates.length, candidates: allCandidates }), 'utf-8');

  function isMatch(entryCand) {
    const valid = new Set([entryCand.gold_command, ...(entryCand.acceptable_commands || [])].filter(Boolean));
    return valid.has(entryCand.top1_command);
  }

  const summary = {};
  ['lexical', 'dense', 'hybrid'].forEach(sys => {
    const sysCands = allCandidates.filter(c => c.system === sys && c.expected_classification !== 'OOD');
    const correct = sysCands.filter(isMatch);
    const incorrect = sysCands.filter(c => !isMatch(c));
    const oodCands = allCandidates.filter(c => c.system === sys && c.expected_classification === 'OOD');
    const mean = (arr, key) => arr.length ? +(arr.reduce((a, c) => a + c[key], 0) / arr.length).toFixed(4) : null;
    summary[sys] = {
      correct_count: correct.length, incorrect_count: incorrect.length,
      mean_margin_correct: mean(correct, 'margin'), mean_margin_incorrect: mean(incorrect, 'margin'), mean_margin_ood: mean(oodCands, 'margin'),
      mean_normalized_entropy_correct: mean(correct, 'normalized_entropy'), mean_normalized_entropy_incorrect: mean(incorrect, 'normalized_entropy'), mean_normalized_entropy_ood: mean(oodCands, 'normalized_entropy')
    };
  });

  fs.writeFileSync(path.join(outDir, 'margin-entropy-summary.json'), JSON.stringify(summary, null, 2), 'utf-8');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nWrote ${allCandidates.length} v0.2 candidate records to ${path.join(outDir, 'candidates.json')}`);
}

main();
