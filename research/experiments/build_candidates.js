// Phase 6 -- top-k candidate capture with margin and entropy/concentration signals, for
// three systems: lexical (BM25+bonus, A0), dense (A2), and hybrid (A3, using each query's
// fold-appropriate nested-CV alpha from Phase 4/5 -- never a globally "best" alpha, to stay
// consistent with the leakage-free protocol already established).
//
// Output feeds Phase 7 (OOD/selective prediction) and Phase 5's A4 ablation (margin-based
// rejection), so it is written once here and reused, not recomputed downstream.
//
// Entropy note (per FINAL_RESEARCH_PLAN.md Phase 6): scores are NOT a calibrated probability.
// To compute a concentration measure, we shift the top-k scores so the minimum in that window
// is 0 (translation-invariant shape), then normalize to sum to 1, then compute Shannon entropy
// in bits. This is reported as a "concentration measure," never called a probability, and is
// NOT the calibrated confidence Phase 8 will produce.

const fs = require('fs');
const path = require('path');
const { fuseQuery } = require('./hybrid_fusion');

const projectRoot = path.join(__dirname, '..', '..');
const cacheDir = path.join(projectRoot, 'research/results/hybrid');
const outDir = path.join(projectRoot, 'research/results/reliability');

const cache = JSON.parse(fs.readFileSync(path.join(cacheDir, 'query_scores_cache.json'), 'utf-8'));
const folds = JSON.parse(fs.readFileSync(path.join(cacheDir, 'folds.json'), 'utf-8'));
const hybridCv = JSON.parse(fs.readFileSync(path.join(cacheDir, 'hybrid-nested-cv-results.json'), 'utf-8'));

const TOP_K = 10;
const EPS = 1e-9;

// Map query id -> the alpha selected for its test fold in Phase 4's nested CV.
const alphaByQueryId = new Map();
hybridCv.per_fold_results.forEach(f => {
  Object.entries(folds.assignment).forEach(([id, foldIdx]) => {
    if (foldIdx === f.test_fold) alphaByQueryId.set(id, f.selected_alpha);
  });
});

function shannonEntropyBits(probs) {
  return -probs.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
}

function concentrationFromScores(topKScores) {
  const min = Math.min(...topKScores);
  const shifted = topKScores.map(s => s - min); // translation-invariant, all >= 0
  const total = shifted.reduce((a, b) => a + b, 0);
  const probs = total > EPS ? shifted.map(s => s / total) : shifted.map(() => 1 / shifted.length);
  const entropy = shannonEntropyBits(probs);
  const maxEntropy = Math.log2(topKScores.length); // uniform-distribution upper bound for this k
  return { entropy_bits: +entropy.toFixed(4), normalized_entropy: maxEntropy > 0 ? +(entropy / maxEntropy).toFixed(4) : 0 };
}

function marginStats(sortedScores) {
  const s1 = sortedScores[0] ?? 0;
  const s2 = sortedScores[1] ?? 0;
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
    id: entry.id,
    system: systemName,
    ...extra,
    top_k: topK.map((c, i) => ({ rank: i + 1, command: c.command, intent: c.intent, category: c.category, score: +c._scoreValue.toFixed(4) })),
    top1_command: topK[0] ? topK[0].command : null,
    top1_score: topK[0] ? +topK[0]._scoreValue.toFixed(4) : null,
    margin,
    relative_margin,
    entropy_bits,
    normalized_entropy,
    expected_classification: entry.expected_classification,
    query_type: entry.query_type,
    gold_command: entry.gold_command,
    acceptable_commands: entry.acceptable_commands
  };
}

function main() {
  const allCandidates = [];

  cache.queries.forEach(entry => {
    // Lexical (A0: BM25 with bonus)
    const lexicalRanked = entry.lexical.map(c => ({ ...c, _scoreValue: c.score }));
    allCandidates.push(buildForSystem(entry, lexicalRanked, 'lexical'));

    // Dense (A2)
    const denseRanked = entry.dense.map(c => ({ ...c, _scoreValue: c.score }));
    allCandidates.push(buildForSystem(entry, denseRanked, 'dense'));

    // Hybrid (A3), using the alpha selected for this query's own test fold
    const alpha = alphaByQueryId.get(entry.id);
    const { ranked } = fuseQuery(entry, alpha);
    const hybridRanked = ranked.map(c => ({ ...c, _scoreValue: c.fused }));
    allCandidates.push(buildForSystem(entry, hybridRanked, 'hybrid', { alpha_used: alpha }));
  });

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'candidates.json'), JSON.stringify({ generated_at: new Date().toISOString(), top_k: TOP_K, count: allCandidates.length, candidates: allCandidates }), 'utf-8');

  // Quick descriptive summary: mean margin/entropy for correct vs incorrect top-1 predictions,
  // per system -- this is the evidence Phase 7 needs to decide whether margin/entropy actually
  // separate reliable from unreliable predictions before building a rejection rule on top.
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
      correct_count: correct.length,
      incorrect_count: incorrect.length,
      mean_margin_correct: mean(correct, 'margin'),
      mean_margin_incorrect: mean(incorrect, 'margin'),
      mean_margin_ood: mean(oodCands, 'margin'),
      mean_relative_margin_correct: mean(correct, 'relative_margin'),
      mean_relative_margin_incorrect: mean(incorrect, 'relative_margin'),
      mean_relative_margin_ood: mean(oodCands, 'relative_margin'),
      mean_normalized_entropy_correct: mean(correct, 'normalized_entropy'),
      mean_normalized_entropy_incorrect: mean(incorrect, 'normalized_entropy'),
      mean_normalized_entropy_ood: mean(oodCands, 'normalized_entropy')
    };
  });

  fs.writeFileSync(path.join(outDir, 'margin-entropy-summary.json'), JSON.stringify(summary, null, 2), 'utf-8');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nWrote ${allCandidates.length} candidate records to ${path.join(outDir, 'candidates.json')}`);
}

main();
