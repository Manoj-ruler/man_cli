// Phase 4 -- independent replica of cli/search.js's BM25 scoring, exposing FULL ranked
// candidate scores (cli/search.js's exported search()/searchMany() only return top-1 or a
// display-formatted top-k, not raw scores for every candidate, which fusion needs).
//
// This is a byte-for-byte reimplementation of the same formula (tokenize, stopwords, IDF
// smoothing, k1=1.2/b=0.75, +15.0 substring bonus) -- cli/search.js itself is NEVER imported,
// modified, or depended on here, to keep the frozen baseline and this experimental module
// fully independent. Correctness is verified by validate_lexical_replica.js, which asserts
// this module's top-1 output matches cli/search.js's search() exactly on all 150 benchmark
// queries before any downstream fusion work is allowed to depend on it.

const fs = require('fs');
const path = require('path');

const COMMANDS_PATH = path.join(__dirname, '..', '..', 'cli', 'data', 'commands.json');
const CUSTOM_SNIPPETS_PATH = path.join(__dirname, '..', '..', 'cli', 'data', 'custom_snippets.json');

const ignoreWords = new Set(['how', 'to', 'do', 'i', 'a', 'an', 'the', 'is', 'in', 'and', 'for', 'of', 'with', 'on', 'can', 'you']);

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(w => w.length > 0 && !ignoreWords.has(w));
}

function buildIndex(platform) {
  let commands = JSON.parse(fs.readFileSync(COMMANDS_PATH, 'utf-8'))
    .filter(cmd => !cmd.os || cmd.os.includes('all') || cmd.os.includes(platform));

  if (fs.existsSync(CUSTOM_SNIPPETS_PATH)) {
    try {
      const custom = JSON.parse(fs.readFileSync(CUSTOM_SNIPPETS_PATH, 'utf-8'));
      if (Array.isArray(custom)) {
        commands = commands.concat(custom.filter(cmd => !cmd.os || cmd.os.includes('all') || cmd.os.includes(platform)));
      }
    } catch (e) {}
  }

  const docs = commands.map(cmd => tokenize(`${cmd.intent} ${cmd.category || ''} ${cmd.description || ''}`));
  const N = docs.length;
  const df = {};
  docs.forEach(docTokens => {
    new Set(docTokens).forEach(token => { df[token] = (df[token] || 0) + 1; });
  });
  const idf = {};
  for (const token in df) idf[token] = Math.log(1 + (N - df[token] + 0.5) / (df[token] + 0.5));

  const tfVectors = docs.map(docTokens => {
    const tf = {};
    docTokens.forEach(token => { tf[token] = (tf[token] || 0) + 1; });
    return tf;
  });

  return { commands, tfVectors, idf };
}

// Returns ALL candidates ranked by BM25+bonus score (not just top-1), plus a flag for
// whether the substring bonus fired, needed for the A0/A1 ablation (Phase 5).
function lexicalSearchAll(query, platform, opts = {}) {
  const includeBonus = opts.includeBonus !== false; // default true = matches production behavior
  const { commands, tfVectors, idf } = buildIndex(platform);

  const queryTokens = tokenize(query);
  const k1 = 1.2, b = 0.75;
  const avgdl = tfVectors.reduce((sum, tf) => sum + Object.values(tf).reduce((s, c) => s + c, 0), 0) / tfVectors.length;
  const queryTokensSet = new Set(queryTokens);

  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');

  const scored = commands.map((cmd, index) => {
    const docTf = tfVectors[index];
    const docLength = Object.values(docTf).reduce((s, c) => s + c, 0);
    let score = 0;
    queryTokensSet.forEach(token => {
      if (docTf[token]) {
        const tf = docTf[token];
        const tokenIdf = idf[token] || 0;
        const num = tf * (k1 + 1);
        const den = tf + k1 * (1 - b + b * (docLength / avgdl));
        score += tokenIdf * (num / den);
      }
    });
    const exactIntent = cmd.intent.toLowerCase().replace(/[^a-z0-9]/g, '');
    const bonusFired = exactIntent.includes(cleanQuery) || cleanQuery.includes(exactIntent);
    if (includeBonus && bonusFired) score += 15.0;

    return { command: cmd.command, intent: cmd.intent, category: cmd.category || 'general', score, bonusFired };
  });

  scored.sort((a, b2) => b2.score - a.score);
  return scored;
}

module.exports = { lexicalSearchAll, tokenize };
