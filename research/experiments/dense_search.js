// Phase 3 -- dense (semantic-only) retrieval module. Mirrors the input/output shape
// of cli/search.js's search() function so it is a drop-in comparator, but is entirely
// separate code -- cli/search.js is never imported or modified here except read-only
// via the OS-filtering logic being duplicated (not reused) to keep this module fully
// independent for a fair, isolated comparison.

const fs = require('fs');
const path = require('path');
const os = require('os');

const EMBEDDINGS_PATH = path.join(__dirname, '..', 'models', 'corpus_embeddings.json');

let _cache = null;
let _extractor = null;

function loadCache() {
  if (!_cache) {
    _cache = JSON.parse(fs.readFileSync(EMBEDDINGS_PATH, 'utf-8'));
  }
  return _cache;
}

async function getExtractor() {
  if (!_extractor) {
    const { pipeline } = await import('@xenova/transformers');
    _extractor = await pipeline('feature-extraction', loadCache().model_name);
  }
  return _extractor;
}

function cosineSim(a, b) {
  // Vectors are pre-normalized at embedding time, so dot product = cosine similarity.
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

function filterByPlatform(entries, platform) {
  return entries.filter(e => !e.os || e.os.includes('all') || e.os.includes(platform));
}

async function embedQuery(query) {
  const extractor = await getExtractor();
  const output = await extractor(query, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Returns same shape as cli/search.js's search(): { command, category, confidence, score }
// plus dense-specific fields (semantic_score) for downstream hybrid fusion analysis.
async function denseSearch(query, opts = {}) {
  const platform = opts.platform || os.platform();
  const cache = loadCache();
  const entries = filterByPlatform(cache.entries, platform);

  const queryEmbedding = await embedQuery(query);

  let best = null;
  let bestScore = -Infinity;
  const scored = [];
  for (const entry of entries) {
    const sim = cosineSim(queryEmbedding, entry.embedding);
    scored.push({ entry, sim });
    if (sim > bestScore) { bestScore = sim; best = entry; }
  }

  // Cosine similarity in [-1, 1]; empirically all-MiniLM-L6-v2 similarities for related
  // short text pairs cluster in [0.2, 0.9]. Map to a 0-100 confidence heuristically for
  // reporting only -- NOT claimed to be calibrated (calibration is Phase 8's job).
  const confidence = Math.max(0, Math.min(100, Math.round((bestScore) * 100)));

  return {
    command: best ? best.command : null,
    category: best ? (best.category || 'general') : null,
    confidence,
    score: +bestScore.toFixed(4),
    semantic_score: +bestScore.toFixed(4),
    _scored: scored // full ranked list, used by Phase 4/6 for fusion + top-k capture
  };
}

async function denseSearchMany(query, opts = {}) {
  const limit = opts.limit || 10;
  const result = await denseSearch(query, opts);
  const ranked = result._scored.slice().sort((a, b) => b.sim - a.sim).slice(0, limit);
  return ranked.map((r, idx) => ({
    rank: idx + 1,
    command: r.entry.command,
    intent: r.entry.intent,
    category: r.entry.category,
    semantic_score: +r.sim.toFixed(4)
  }));
}

module.exports = { denseSearch, denseSearchMany, cosineSim, loadCache };
