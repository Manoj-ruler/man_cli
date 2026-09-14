// Phase 4 -- hybrid fusion scoring, operating purely on the cached per-query candidate lists
// from build_query_scores.js. HybridScore = alpha*normalized_BM25 + (1-alpha)*normalized_semantic.
// Per-query min-max normalization over the FULL platform-filtered candidate set for that query
// (not a fixed global scale), since BM25 raw scores and cosine similarities are on incomparable
// scales that also shift per query length/vocabulary.

function minMaxNormalize(scored, scoreKey) {
  const scores = scored.map(s => s[scoreKey]);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;
  const map = new Map();
  scored.forEach(s => {
    map.set(s.command, range > 1e-9 ? (s[scoreKey] - min) / range : 0);
  });
  return map;
}

// entry: one cached query object { lexical: [...], dense: [...], lexical_no_bonus: [...] }
// alpha: fusion weight for lexical (1 = pure BM25, 0 = pure dense)
// useBonus: whether to use the lexical list WITH the +15 substring bonus (true) or without (A1 ablation)
function fuseQuery(entry, alpha, opts = {}) {
  const lexicalList = opts.useBonus === false ? entry.lexical_no_bonus : entry.lexical;
  const denseList = entry.dense;

  const normLex = minMaxNormalize(lexicalList, 'score');
  const normDense = minMaxNormalize(denseList, 'score');

  // Union of candidates from both lists (should be identical sets -- same platform-filtered
  // corpus -- but computed defensively in case list lengths ever diverge).
  const allCommands = new Map();
  lexicalList.forEach(s => { if (!allCommands.has(s.command)) allCommands.set(s.command, s); });
  denseList.forEach(s => { if (!allCommands.has(s.command)) allCommands.set(s.command, s); });

  let best = null;
  let bestFused = -Infinity;
  const fusedScored = [];
  for (const [command, meta] of allCommands) {
    const nl = normLex.has(command) ? normLex.get(command) : 0;
    const nd = normDense.has(command) ? normDense.get(command) : 0;
    const fused = alpha * nl + (1 - alpha) * nd;
    fusedScored.push({ command, intent: meta.intent, category: meta.category, fused, normLex: nl, normDense: nd });
    if (fused > bestFused) { bestFused = fused; best = { command, intent: meta.intent, category: meta.category }; }
  }
  fusedScored.sort((a, b) => b.fused - a.fused);

  return { top1: best, topScore: bestFused, ranked: fusedScored };
}

module.exports = { fuseQuery, minMaxNormalize };
