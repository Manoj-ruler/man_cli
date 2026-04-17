const fs = require('fs');
const path = require('path');

const COMMANDS_PATH = path.join(__dirname, 'data', 'commands.json');

// Words to ignore to prevent false matches on generic phrasing
const ignoreWords = new Set(['how', 'to', 'do', 'i', 'a', 'an', 'the', 'is', 'in', 'and', 'for', 'of', 'with', 'on', 'can', 'you']);

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(w => w.length > 0 && !ignoreWords.has(w));
}

function buildIndex() {
  const commands = JSON.parse(fs.readFileSync(COMMANDS_PATH, 'utf-8'));
  
  // Tokenize documents by combining intent + description for denser matches
  const docs = commands.map(cmd => {
    const text = `${cmd.intent} ${cmd.category || ''} ${cmd.description || ''}`;
    return tokenize(text);
  });

  const N = docs.length;
  const df = {}; // document frequency
  
  docs.forEach(docTokens => {
    const uniqueTokens = new Set(docTokens);
    uniqueTokens.forEach(token => {
      df[token] = (df[token] || 0) + 1;
    });
  });

  // Compute Inverse Document Frequency (BM25 variant smoothing)
  const idf = {};
  for (const token in df) {
    idf[token] = Math.log(1 + (N - df[token] + 0.5) / (df[token] + 0.5)); 
  }

  // Pre-compute Term Frequency per document length
  const tfVectors = docs.map(docTokens => {
    const tf = {};
    docTokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });
    return tf;
  });

  return { commands, tfVectors, idf, N };
}

function search(query) {
  // We can afford to compute the index dynamically in under 5ms, meaning no boot delay!
  const { commands, tfVectors, idf } = buildIndex(); 
  
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return { command: null, category: null, confidence: 0, score: 0 };
  }
  
  // BM25 Tuning Parameters
  const k1 = 1.2;
  const b = 0.75;
  
  // Average document length
  const avgdl = tfVectors.reduce((sum, tf) => sum + Object.values(tf).reduce((s, c) => s + c, 0), 0) / tfVectors.length;

  let bestScore = -1;
  let bestMatch = commands[0];

  const queryTokensSet = new Set(queryTokens);

  tfVectors.forEach((docTf, index) => {
    let score = 0;
    const docLength = Object.values(docTf).reduce((s, c) => s + c, 0);

    queryTokensSet.forEach(token => {
      if (docTf[token]) {
        const tf = docTf[token];
        const tokenIdf = idf[token] || 0;
        
        // Exact BM25 Scoring Formula
        const num = tf * (k1 + 1);
        const den = tf + k1 * (1 - b + b * (docLength / avgdl));
        score += tokenIdf * (num / den);
      }
    });

    // Substring bonus modifier: If the stripped string matches roughly, grant a heavy heuristic bonus
    const exactIntent = commands[index].intent.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (exactIntent.includes(cleanQuery) || cleanQuery.includes(exactIntent)) {
        score += 15.0;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = commands[index];
    }
  });

  // Calculate synthetic confidence percentage
  // A perfect exact hit will score ~15+. A decent semantic partial hit scores ~3.0 - 5.0. 
  let confidencePercentage = Math.min(Math.round((bestScore / 8) * 100), 100);
  
  // Threshold to reject noise
  if (bestScore < 2.0) {
    confidencePercentage = 0;
  }

  return {
    command: bestMatch.command,
    category: bestMatch.category || 'general',
    confidence: confidencePercentage, 
    score: bestScore
  };
}

module.exports = { search };
