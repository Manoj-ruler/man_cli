/**
 * Diagnostic Research Instrumentation Script
 * 
 * NOTE: This script is research-only instrumentation.
 * It does NOT modify any production code, baseline results, or benchmark files.
 * It imports the production commands and replicates the exact BM25 scoring
 * formula to inspect top-5 candidates, bonus effects, and feature metrics.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const COMMANDS_PATH = path.join(__dirname, '../cli/data/commands.json');
const BENCHMARK_PATH = path.join(__dirname, 'datasets/termassist_bench_v0.1_validated.json');
const RESULTS_PATH = path.join(__dirname, 'results/baseline-v0.1/baseline-results.json');

// Stop words identical to cli/search.js
const ignoreWords = new Set(['how', 'to', 'do', 'i', 'a', 'an', 'the', 'is', 'in', 'and', 'for', 'of', 'with', 'on', 'can', 'you']);

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(w => w.length > 0 && !ignoreWords.has(w));
}

// Build index matching win32 platform (frozen experiment environment)
function buildDiagnosticIndex(platform = 'win32') {
  let commands = JSON.parse(fs.readFileSync(COMMANDS_PATH, 'utf-8'))
    .filter(cmd => !cmd.os || cmd.os.includes('all') || cmd.os.includes(platform));

  const docs = commands.map(cmd => {
    const text = `${cmd.intent} ${cmd.category || ''} ${cmd.description || ''}`;
    return tokenize(text);
  });

  const N = docs.length;
  const df = {};
  docs.forEach(docTokens => {
    const uniqueTokens = new Set(docTokens);
    uniqueTokens.forEach(token => {
      df[token] = (df[token] || 0) + 1;
    });
  });

  const idf = {};
  for (const token in df) {
    idf[token] = Math.log(1 + (N - df[token] + 0.5) / (df[token] + 0.5));
  }

  const tfVectors = docs.map(docTokens => {
    const tf = {};
    docTokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });
    return tf;
  });

  return { commands, docs, tfVectors, idf, N, df };
}

const index = buildDiagnosticIndex('win32');

function diagnoseQuery(query) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return { query, tokens: [], candidates: [] };
  }

  const k1 = 1.2;
  const b = 0.75;
  const avgdl = index.tfVectors.reduce((sum, tf) => sum + Object.values(tf).reduce((s, c) => s + c, 0), 0) / index.tfVectors.length;
  const queryTokensSet = new Set(queryTokens);

  const scored = index.commands.map((cmd, idx) => {
    let bm25Score = 0;
    const docTf = index.tfVectors[idx];
    const docLength = Object.values(docTf).reduce((s, c) => s + c, 0);

    const matchedTokens = [];
    queryTokensSet.forEach(token => {
      if (docTf[token]) {
        const tf = docTf[token];
        const tokenIdf = index.idf[token] || 0;
        const num = tf * (k1 + 1);
        const den = tf + k1 * (1 - b + b * (docLength / avgdl));
        const tokenScore = tokenIdf * (num / den);
        bm25Score += tokenScore;
        matchedTokens.push({ token, tf, idf: tokenIdf, tokenScore });
      }
    });

    const exactIntent = cmd.intent.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hasBonus = exactIntent.includes(cleanQuery) || cleanQuery.includes(exactIntent);
    const finalScore = bm25Score + (hasBonus ? 15.0 : 0.0);

    let confidence = Math.min(Math.round((finalScore / 8) * 100), 100);
    if (finalScore < 2.0) confidence = 0;

    return {
      index: idx,
      command: cmd.command,
      intent: cmd.intent,
      category: cmd.category || 'general',
      description: cmd.description || '',
      bm25Score,
      hasBonus,
      finalScore,
      confidence,
      matchedTokens
    };
  });

  // Sort descending by final score
  scored.sort((a, b) => b.finalScore - a.finalScore);

  // Also sort by pure BM25 without bonus
  const scoredNoBonus = [...scored].sort((a, b) => b.bm25Score - a.bm25Score);

  return {
    query,
    tokens: queryTokens,
    top5: scored.slice(0, 5),
    topNoBonus: scoredNoBonus[0],
    scoreGapTop1Top2: scored.length > 1 ? (scored[0].finalScore - scored[1].finalScore) : 0,
    bm25GapTop1Top2: scored.length > 1 ? (scored[0].bm25Score - scored[1].bm25Score) : 0
  };
}

// Load baseline results
const baselineResults = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
const benchData = JSON.parse(fs.readFileSync(BENCHMARK_PATH, 'utf-8'));
const benchMap = new Map(benchData.queries.map(q => [q.id, q]));

console.log(`Loaded ${baselineResults.length} baseline results and ${benchData.queries.length} benchmark queries.`);

module.exports = {
  index,
  diagnoseQuery,
  tokenize,
  baselineResults,
  benchData,
  benchMap
};
