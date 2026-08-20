const fs = require('fs');
const path = require('path');
const { index, diagnoseQuery, tokenize, baselineResults, benchMap } = require('./diagnostics');

const ANALYSIS_DIR = path.join(__dirname, 'analysis');
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

// 1. Classify all queries and identify failures
const allItems = baselineResults.map(item => {
  const bench = benchMap.get(item.id);
  const diag = diagnoseQuery(item.query);

  const isOOD = item.expected.classification === 'OOD';
  const isAmbiguous = item.expected.classification === 'AMBIGUOUS';
  const isCorrect = item.evaluation.status === 'CORRECT' || 
                    item.evaluation.status === 'AMBIGUOUS_CORRECT' || 
                    item.evaluation.status === 'OOD_CORRECT_REJECTION';

  const isFailure = !isCorrect;

  // Retrieve top-1 diagnostic
  const top1 = diag.top5[0] || null;
  const top2 = diag.top5[1] || null;
  const top1BM25 = top1 ? top1.bm25Score : 0;
  const top1Bonus = top1 ? top1.hasBonus : false;
  const top1FinalScore = top1 ? top1.finalScore : 0;
  const scoreGap = top2 ? (top1FinalScore - top2.finalScore) : top1FinalScore;
  const bm25Gap = top2 ? (top1BM25 - top2.bm25Score) : top1BM25;

  // Check whether top candidate without bonus is different
  const topNoBonus = diag.topNoBonus;
  const bonusChangedRank = topNoBonus && top1 && (topNoBonus.command !== top1.command);

  // Measure token overlap with gold intent/command if available
  let goldTokens = [];
  if (bench.gold_intent) {
    goldTokens = tokenize(bench.gold_intent);
  }
  const queryTokensSet = new Set(diag.tokens);
  const matchedGoldTokens = goldTokens.filter(t => queryTokensSet.has(t));
  const tokenOverlapRatio = goldTokens.length > 0 ? (matchedGoldTokens.length / goldTokens.length) : 0;

  // Sum IDF of matched tokens vs total query tokens IDF
  let queryTotalIDF = 0;
  let queryMatchedIDF = 0;
  diag.tokens.forEach(t => {
    const tidf = index.idf[t] || 0;
    queryTotalIDF += tidf;
    if (top1 && top1.matchedTokens.some(mt => mt.token === t)) {
      queryMatchedIDF += tidf;
    }
  });

  return {
    id: item.id,
    query: item.query,
    query_type: item.query_type,
    category: item.category,
    difficulty: item.difficulty,
    risk_level: item.risk_level,
    expected_classification: item.expected.classification,
    gold_command: item.expected.gold_command,
    acceptable_commands: item.expected.acceptable_commands,
    gold_intent: bench ? bench.gold_intent : null,
    actual_retrieved: item.actual.retrieved,
    actual_command: item.actual.command,
    actual_score: item.actual.score,
    actual_confidence: item.actual.confidence,
    status: item.evaluation.status,
    error_category: item.evaluation.error_category,
    isFailure,
    isOOD,
    isAmbiguous,
    isCorrect,
    tokens: diag.tokens,
    top5: diag.top5,
    top1BM25,
    top1Bonus,
    top1FinalScore,
    scoreGap,
    bm25Gap,
    bonusChangedRank,
    topNoBonusCommand: topNoBonus ? topNoBonus.command : null,
    tokenOverlapRatio,
    queryTotalIDF,
    queryMatchedIDF,
    idfOverlapRatio: queryTotalIDF > 0 ? (queryMatchedIDF / queryTotalIDF) : 0
  };
});

// Primary failure taxonomy classifier
function assignPrimaryMechanism(item) {
  if (item.isCorrect) return 'NONE';

  const { id, query, query_type, actual_command, gold_command, top1Bonus, top1BM25, top1FinalScore, scoreGap, isOOD, isAmbiguous, tokens, top5 } = item;

  // 1. OOD failures
  if (isOOD) {
    return 'OOD_VOCABULARY_COLLISION';
  }

  // 2. Exact intent overmatch: bonus applied to wrong command or heavily skewed
  if (top1Bonus) {
    // Check if the gold command was different and bonus made the wrong command win
    if (actual_command !== gold_command) {
      return 'EXACT_INTENT_OVERMATCH';
    }
  }

  // 3. Polysemy queries
  if (query_type === 'polysemy') {
    // Specific polysemous keywords causing cross-domain drift
    const polyKeywords = ['delete', 'remove', 'log', 'run', 'stop', 'start', 'make', 'lookup', 'list', 'show', 'kill', 'service', 'branch', 'switch'];
    if (tokens.some(t => polyKeywords.includes(t))) {
      return 'POLYSEMOUS_TERM';
    }
  }

  // 4. Single keyword or underspecified queries
  if (query_type === 'single_keyword' || tokens.length <= 1) {
    return 'QUERY_UNDERSPECIFICATION';
  }

  if (isAmbiguous) {
    // Ambiguous queries where multiple interpretations exist
    return 'QUERY_UNDERSPECIFICATION';
  }

  // 5. Low semantic overlap
  if (query_type === 'low_overlap_paraphrase' || item.tokenOverlapRatio < 0.25 || item.idfOverlapRatio < 0.3) {
    return 'LOW_SEMANTIC_OVERLAP';
  }

  // 6. Wrong scope vs Wrong action
  if (actual_command && gold_command) {
    // Check if same base tool (e.g. git vs git, docker vs docker, Get-FileHash vs Get-FileHash)
    const actualTool = actual_command.split(' ')[0].toLowerCase();
    const goldTool = gold_command.split(' ')[0].toLowerCase();
    if (actualTool === goldTool) {
      // If same tool/domain but wrong flags, branch, or sub-scope
      if (item.tokens.some(t => ['all', 'remote', 'local', 'soft', 'hard', 'staged', 'unstaged'].includes(t))) {
        return 'WRONG_SCOPE';
      }
      return 'WRONG_ACTION';
    }
  }

  // 7. Lexical overlap fallback
  if (top1BM25 > 3.0) {
    return 'LEXICAL_OVERLAP';
  }

  return 'LOW_SEMANTIC_OVERLAP';
}

// Assign mechanisms and write baseline error analysis CSV
const failureItems = allItems.filter(it => it.isFailure).map(it => {
  const primaryMechanism = assignPrimaryMechanism(it);
  return {
    ...it,
    primary_mechanism: primaryMechanism
  };
});

console.log(`Total failures analyzed: ${failureItems.length}`);
const mechanismCounts = {};
failureItems.forEach(f => {
  mechanismCounts[f.primary_mechanism] = (mechanismCounts[f.primary_mechanism] || 0) + 1;
});
console.log('Mechanism distribution:', mechanismCounts);

// Generate baseline-error-analysis.csv
const errorCsvHeader = [
  'id',
  'query',
  'query_type',
  'category',
  'expected_classification',
  'gold_command',
  'actual_command',
  'status',
  'primary_mechanism',
  'confidence',
  'score',
  'bm25_score_before_bonus',
  'bonus_applied',
  'score_gap_top1_top2',
  'tokens',
  'top_candidate_1',
  'top_candidate_2',
  'top_candidate_3',
  'top_candidate_4',
  'top_candidate_5',
  'notes'
].join(',');

const errorCsvRows = failureItems.map(f => {
  const cands = (f.top5 || []).map(c => `"${c.command.replace(/"/g, '""')} (score:${c.finalScore.toFixed(2)},bonus:${c.hasBonus})"`);
  while (cands.length < 5) cands.push('""');
  
  return [
    f.id,
    `"${f.query.replace(/"/g, '""')}"`,
    f.query_type,
    f.category,
    f.expected_classification,
    `"${(f.gold_command || '').replace(/"/g, '""')}"`,
    `"${(f.actual_command || '').replace(/"/g, '""')}"`,
    f.status,
    f.primary_mechanism,
    f.actual_confidence,
    f.actual_score,
    f.top1BM25.toFixed(4),
    f.top1Bonus ? 'TRUE' : 'FALSE',
    f.scoreGap.toFixed(4),
    `"${f.tokens.join(' ')}"`,
    cands[0],
    cands[1],
    cands[2],
    cands[3],
    cands[4],
    `"${(f.error_category || '').replace(/"/g, '""')}"`
  ].join(',');
});

fs.writeFileSync(path.join(ANALYSIS_DIR, 'baseline-error-analysis.csv'), [errorCsvHeader, ...errorCsvRows].join('\n'), 'utf-8');
console.log('Wrote baseline-error-analysis.csv');

// 2. Confidence Analysis
const buckets = [
  { label: '0–20', min: 0, max: 20 },
  { label: '20–40', min: 20.001, max: 40 },
  { label: '40–60', min: 40.001, max: 60 },
  { label: '60–80', min: 60.001, max: 80 },
  { label: '80–90', min: 80.001, max: 90 },
  { label: '90–100', min: 90.001, max: 100 }
];

const confAnalysisRows = buckets.map(b => {
  const inBucket = allItems.filter(it => it.actual_confidence >= b.min && it.actual_confidence <= b.max);
  const total = inBucket.length;
  const correct = inBucket.filter(it => it.isCorrect).length;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0';
  const meanConf = total > 0 ? (inBucket.reduce((sum, it) => sum + it.actual_confidence, 0) / total).toFixed(1) : '0.0';
  return {
    bucket: b.label,
    predictions: total,
    correct,
    accuracy: `${accuracy}%`,
    accuracy_num: total > 0 ? (correct / total) : 0,
    mean_confidence: `${meanConf}%`
  };
});

// Specific stats
const incorrectItems = allItems.filter(it => !it.isCorrect);
const confGte80Incorrect = incorrectItems.filter(it => it.actual_confidence >= 80).length;
const confGte90Incorrect = incorrectItems.filter(it => it.actual_confidence >= 90).length;
const confEq100Incorrect = incorrectItems.filter(it => it.actual_confidence === 100).length;

const correctItems = allItems.filter(it => it.isCorrect);
const meanConfCorrect = (correctItems.reduce((s, it) => s + it.actual_confidence, 0) / correctItems.length).toFixed(2);
const meanConfIncorrect = (incorrectItems.reduce((s, it) => s + it.actual_confidence, 0) / incorrectItems.length).toFixed(2);

const oodFalseAccept = allItems.filter(it => it.status === 'OOD_FALSE_ACCEPT');
const meanConfOODFalseAccept = (oodFalseAccept.reduce((s, it) => s + it.actual_confidence, 0) / oodFalseAccept.length).toFixed(2);

const ambiguousFailures = allItems.filter(it => it.isAmbiguous && !it.isCorrect);
const meanConfAmbiguousFailures = (ambiguousFailures.reduce((s, it) => s + it.actual_confidence, 0) / ambiguousFailures.length).toFixed(2);

const confCsvHeader = 'confidence_bucket,predictions,correct,accuracy,mean_confidence';
const confCsvRows = confAnalysisRows.map(r => `${r.bucket},${r.predictions},${r.correct},${r.accuracy},${r.mean_confidence}`);
fs.writeFileSync(path.join(ANALYSIS_DIR, 'confidence-analysis.csv'), [confCsvHeader, ...confCsvRows].join('\n'), 'utf-8');
console.log('Wrote confidence-analysis.csv');

// 3. Score / Bonus Analysis
const correctWithBonus = correctItems.filter(it => it.top1Bonus).length;
const correctWithoutBonus = correctItems.filter(it => !it.top1Bonus).length;
const failureWithBonus = incorrectItems.filter(it => it.top1Bonus).length;
const failureWithoutBonus = incorrectItems.filter(it => !it.top1Bonus).length;

const totalWithBonus = correctWithBonus + failureWithBonus;
const totalWithoutBonus = correctWithoutBonus + failureWithoutBonus;

const accuracyWithBonus = totalWithBonus > 0 ? ((correctWithBonus / totalWithBonus) * 100).toFixed(1) : '0.0';
const accuracyWithoutBonus = totalWithoutBonus > 0 ? ((correctWithoutBonus / totalWithoutBonus) * 100).toFixed(1) : '0.0';

// Number of failures where removing bonus would change top result
const failuresWhereRemovingBonusChangesTop = incorrectItems.filter(it => it.top1Bonus && it.bonusChangedRank).length;
const allQueriesWhereRemovingBonusChangesTop = allItems.filter(it => it.top1Bonus && it.bonusChangedRank).length;

const scoreBonusCsv = [
  'metric,value',
  `total_queries,${allItems.length}`,
  `correct_queries,${correctItems.length}`,
  `failure_queries,${incorrectItems.length}`,
  `correct_with_bonus,${correctWithBonus}`,
  `correct_without_bonus,${correctWithoutBonus}`,
  `failures_with_bonus,${failureWithBonus}`,
  `failures_without_bonus,${failureWithoutBonus}`,
  `total_with_bonus,${totalWithBonus}`,
  `total_without_bonus,${totalWithoutBonus}`,
  `accuracy_with_bonus,${accuracyWithBonus}%`,
  `accuracy_without_bonus,${accuracyWithoutBonus}%`,
  `failures_where_bonus_removal_changes_top,${failuresWhereRemovingBonusChangesTop}`,
  `total_queries_where_bonus_removal_changes_top,${allQueriesWhereRemovingBonusChangesTop}`
].join('\n');

fs.writeFileSync(path.join(ANALYSIS_DIR, 'score-bonus-analysis.csv'), scoreBonusCsv, 'utf-8');
console.log('Wrote score-bonus-analysis.csv');

// 4. Low-Overlap vs Paraphrase Comparison Statistics
const lowOverlapQueries = allItems.filter(it => it.query_type === 'low_overlap_paraphrase');
const ordinaryParaphraseQueries = allItems.filter(it => it.query_type === 'paraphrase');

function getGroupStats(group) {
  const n = group.length;
  const hits = group.filter(it => it.isCorrect).length;
  const acc = ((hits / n) * 100).toFixed(1);
  const avgQueryLen = (group.reduce((s, it) => s + it.tokens.length, 0) / n).toFixed(2);
  const avgTokenOverlap = (group.reduce((s, it) => s + it.tokenOverlapRatio, 0) / n).toFixed(3);
  const avgIDFOverlap = (group.reduce((s, it) => s + it.idfOverlapRatio, 0) / n).toFixed(3);
  const bonusRate = ((group.filter(it => it.top1Bonus).length / n) * 100).toFixed(1);
  const avgBM25 = (group.reduce((s, it) => s + it.top1BM25, 0) / n).toFixed(2);
  const avgScoreMargin = (group.reduce((s, it) => s + it.scoreGap, 0) / n).toFixed(2);
  const avgConfidence = (group.reduce((s, it) => s + it.actual_confidence, 0) / n).toFixed(1);
  
  return { n, hits, acc, avgQueryLen, avgTokenOverlap, avgIDFOverlap, bonusRate, avgBM25, avgScoreMargin, avgConfidence };
}

const lowOverlapStats = getGroupStats(lowOverlapQueries);
const paraphraseStats = getGroupStats(ordinaryParaphraseQueries);

console.log('Low Overlap Stats:', lowOverlapStats);
console.log('Paraphrase Stats:', paraphraseStats);

// 5. Output Summary Data for Report Generation
const reportData = {
  summary: {
    totalQueries: allItems.length,
    correctQueries: correctItems.length,
    failureQueries: incorrectItems.length,
    overallAccuracy: ((correctItems.length / allItems.length) * 100).toFixed(1),
    inDomainIncorrect: allItems.filter(it => it.expected_classification === 'CORRECT' && !it.isCorrect).length,
    ambiguousIncorrect: ambiguousFailures.length,
    oodFalseAcceptances: oodFalseAccept.length,
    oodCorrectRejections: allItems.filter(it => it.status === 'OOD_CORRECT_REJECTION').length
  },
  mechanismCounts,
  confidenceStats: {
    confGte80Incorrect,
    confGte90Incorrect,
    confEq100Incorrect,
    meanConfCorrect,
    meanConfIncorrect,
    meanConfOODFalseAccept,
    meanConfAmbiguousFailures,
    buckets: confAnalysisRows
  },
  scoreBonusStats: {
    correctWithBonus,
    correctWithoutBonus,
    failureWithBonus,
    failureWithoutBonus,
    accuracyWithBonus,
    accuracyWithoutBonus,
    failuresWhereRemovingBonusChangesTop,
    allQueriesWhereRemovingBonusChangesTop
  },
  lowOverlapComparison: {
    lowOverlap: lowOverlapStats,
    paraphrase: paraphraseStats
  },
  oodQueries: allItems.filter(it => it.isOOD),
  ambiguousQueries: allItems.filter(it => it.isAmbiguous),
  failureItems
};

fs.writeFileSync(path.join(ANALYSIS_DIR, 'analysis_intermediate.json'), JSON.stringify(reportData, null, 2), 'utf-8');
console.log('Saved intermediate analysis JSON.');
