const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { performance } = require('perf_hooks');

// Import production search function (UNTOUCHED)
const { search } = require('../cli/search');

// Paths
const projectRoot = path.join(__dirname, '..');
const datasetsDir = path.join(projectRoot, 'research/datasets');
const valJsonPath = path.join(datasetsDir, 'termassist_bench_v0.1_validated.json');
const reviewPath = path.join(datasetsDir, 'review/human_review_results.json');
const resultsDir = path.join(projectRoot, 'research/results/baseline-v0.1');

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// 1. Verify Benchmark SHA-256
const EXPECTED_SHA256 = '2a554d3c3c425192e0fa295f2dc2eae833f92a2ae77feaf0f3ef70996e8c02a0';
const fileBuffer = fs.readFileSync(valJsonPath);
const actualSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

console.log('=== VERIFYING BENCHMARK SHA-256 ===');
console.log('Expected:', EXPECTED_SHA256);
console.log('Actual:  ', actualSha256);

if (actualSha256 !== EXPECTED_SHA256) {
  console.error('❌ FATAL: Benchmark SHA-256 mismatch! Execution aborted.');
  process.exit(1);
}
console.log('✅ SHA-256 Hash Verified successfully.\n');

// 2. Load Benchmark and Review Data
const benchData = JSON.parse(fs.readFileSync(valJsonPath, 'utf-8'));
const queries = benchData.queries;
const reviews = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
const reviewMap = new Map(reviews.map(r => [r.id, r]));
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));

// 3. Metadata
const metadata = {
  git_commit: '4443ec016c87895ebbc1b9be831e5f80b9bd3b50',
  git_branch: 'research/baseline',
  benchmark_name: 'TermAssist-Bench',
  benchmark_version: 'v0.1-validated',
  benchmark_sha256: actualSha256,
  node_version: process.version,
  platform: os.platform(),
  os_release: os.release(),
  arch: os.arch(),
  timestamp: new Date().toISOString(),
  termassist_version: packageJson.version || '0.1.0',
  total_queries: queries.length
};

fs.writeFileSync(path.join(resultsDir, 'baseline-metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');

// 4. Run Baseline Retrieval Experiment
console.log(`=== RUNNING BASELINE RETRIEVAL ON ${queries.length} QUERIES ===`);

const results = [];
const latencies = [];

queries.forEach((q, idx) => {
  const r = reviewMap.get(q.id);
  const expectedClassification = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT'));
  const goldCommand = q.gold_command || (r ? r.final_gold_command : null);
  const acceptableCommands = Array.isArray(q.acceptable_commands) ? q.acceptable_commands : [];
  
  // All valid matching commands
  const allValidCommands = new Set();
  if (goldCommand) allValidCommands.add(goldCommand);
  acceptableCommands.forEach(c => allValidCommands.add(c));

  // High-resolution timing for search call
  const start = performance.now();
  const searchResult = search(q.query);
  const end = performance.now();
  
  const latencyMs = parseFloat((end - start).toFixed(4));
  latencies.push(latencyMs);

  const retrieved = searchResult.confidence > 0 && searchResult.score >= 2.0;
  const returnedCommand = searchResult.command;
  const score = parseFloat(searchResult.score.toFixed(4));
  const confidence = searchResult.confidence;

  // Evaluation Status Determination
  let status = 'INCORRECT';
  let errorCategory = null;
  let goldStatus = (q.id === 'TA-B093' || q.id === 'TA-B145') ? 'NEEDS_CORRECTION' : 'VALIDATED';

  if (expectedClassification === 'OOD') {
    if (!retrieved) {
      status = 'OOD_CORRECT_REJECTION';
    } else {
      status = 'OOD_FALSE_ACCEPT';
      errorCategory = 'ood_false_acceptance';
    }
  } else if (expectedClassification === 'AMBIGUOUS') {
    if (!retrieved) {
      status = 'REJECTED';
      errorCategory = 'ambiguity_failure';
    } else if (allValidCommands.has(returnedCommand)) {
      status = 'AMBIGUOUS_CORRECT';
    } else {
      status = 'AMBIGUOUS_INCORRECT';
      errorCategory = 'ambiguity_failure';
    }
  } else if (expectedClassification === 'CORRECT' || expectedClassification === 'NEEDS_CORRECTION') {
    if (!retrieved) {
      status = 'REJECTED';
      errorCategory = 'underconfident_correct';
    } else if (allValidCommands.has(returnedCommand)) {
      status = 'CORRECT';
    } else {
      status = 'INCORRECT';
      // Determine error category
      if (q.query_type === 'polysemy') {
        errorCategory = 'lexical_polysemy';
      } else if (q.query_type === 'low_overlap_paraphrase') {
        errorCategory = 'low_overlap_failure';
      } else if (q.query_type === 'complex_multi_intent') {
        errorCategory = 'complex_intent_failure';
      } else if (q.query_type === 'safety_sensitive') {
        errorCategory = 'safety_scope_mismatch';
      } else if (confidence >= 80) {
        errorCategory = 'overconfident_wrong';
      } else {
        errorCategory = 'semantic_mismatch';
      }
    }
  }

  results.push({
    id: q.id,
    query: q.query,
    category: q.category || 'general',
    query_type: q.query_type || 'standard',
    difficulty: q.difficulty || 'medium',
    risk_level: q.risk_level || 'low',
    expected: {
      classification: expectedClassification,
      gold_command: goldCommand,
      acceptable_commands: acceptableCommands
    },
    actual: {
      retrieved,
      command: returnedCommand,
      score,
      confidence,
      latency_ms: latencyMs
    },
    evaluation: {
      status,
      error_category: errorCategory,
      gold_status: goldStatus
    }
  });
});

console.log(`Completed ${results.length} query evaluations.`);

// Write JSON Results
fs.writeFileSync(path.join(resultsDir, 'baseline-results.json'), JSON.stringify(results, null, 2), 'utf-8');

// Write CSV Results
function csvEsc(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const csvHeaders = [
  'id', 'query', 'category', 'query_type', 'difficulty', 'risk_level',
  'expected_classification', 'gold_command', 'actual_retrieved', 'actual_command',
  'actual_score', 'actual_confidence', 'latency_ms', 'evaluation_status', 'error_category', 'gold_status'
];

const csvRows = [csvHeaders.join(',')];
results.forEach(r => {
  const row = [
    csvEsc(r.id),
    csvEsc(r.query),
    csvEsc(r.category),
    csvEsc(r.query_type),
    csvEsc(r.difficulty),
    csvEsc(r.risk_level),
    csvEsc(r.expected.classification),
    csvEsc(r.expected.gold_command),
    r.actual.retrieved ? 'true' : 'false',
    csvEsc(r.actual.command),
    r.actual.score,
    r.actual.confidence,
    r.actual.latency_ms,
    csvEsc(r.evaluation.status),
    csvEsc(r.evaluation.error_category),
    csvEsc(r.evaluation.gold_status)
  ];
  csvRows.push(row.join(','));
});

fs.writeFileSync(path.join(resultsDir, 'baseline-results.csv'), csvRows.join('\n') + '\n', 'utf-8');

// Calculate Summary Statistics
const sortedLatencies = [...latencies].sort((a, b) => a - b);
const meanLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(4);
const medianLatency = sortedLatencies[Math.floor(sortedLatencies.length / 2)].toFixed(4);
const p95Latency = sortedLatencies[Math.floor(sortedLatencies.length * 0.95)].toFixed(4);
const minLatency = sortedLatencies[0].toFixed(4);
const maxLatency = sortedLatencies[sortedLatencies.length - 1].toFixed(4);

// Outcome counts
let totalCorrect = 0;
let totalAmbiguousCorrect = 0;
let totalAmbiguousIncorrect = 0;
let totalIncorrect = 0;
let totalRejected = 0;
let totalOodCorrectRejection = 0;
let totalOodFalseAccept = 0;

results.forEach(r => {
  const st = r.evaluation.status;
  if (st === 'CORRECT') totalCorrect++;
  else if (st === 'AMBIGUOUS_CORRECT') totalAmbiguousCorrect++;
  else if (st === 'AMBIGUOUS_INCORRECT') totalAmbiguousIncorrect++;
  else if (st === 'INCORRECT') totalIncorrect++;
  else if (st === 'REJECTED') totalRejected++;
  else if (st === 'OOD_CORRECT_REJECTION') totalOodCorrectRejection++;
  else if (st === 'OOD_FALSE_ACCEPT') totalOodFalseAccept++;
});

// Category breakdowns
const queryTypeStats = {};
const categoryStats = {};

results.forEach(r => {
  const qt = r.query_type;
  const cat = r.category;
  const isHit = r.evaluation.status === 'CORRECT' || r.evaluation.status === 'AMBIGUOUS_CORRECT' || r.evaluation.status === 'OOD_CORRECT_REJECTION';

  if (!queryTypeStats[qt]) queryTypeStats[qt] = { total: 0, hits: 0 };
  queryTypeStats[qt].total++;
  if (isHit) queryTypeStats[qt].hits++;

  if (!categoryStats[cat]) categoryStats[cat] = { total: 0, hits: 0 };
  categoryStats[cat].total++;
  if (isHit) categoryStats[cat].hits++;
});

// High confidence wrong
const highConfWrong = results.filter(r => r.actual.confidence >= 80 && (r.evaluation.status === 'INCORRECT' || r.evaluation.status === 'AMBIGUOUS_INCORRECT' || r.evaluation.status === 'OOD_FALSE_ACCEPT'));

// Generate baseline-summary.md
let md = `# TermAssist-Bench v0.1 Baseline

## 1. Experiment Configuration

- **Benchmark**: TermAssist-Bench v0.1 (Validated)
- **Commit**: \`${metadata.git_commit}\`
- **Branch**: \`${metadata.git_branch}\`
- **Platform / OS**: \`${metadata.platform}\` (${metadata.os_release}, ${metadata.arch})
- **Node Version**: \`${metadata.node_version}\`
- **Timestamp**: \`${metadata.timestamp}\`
- **Benchmark SHA-256**: \`${metadata.benchmark_sha256}\`

---

## 2. Dataset

| Classification | Count |
|---|---:|
| CORRECT | 119 |
| AMBIGUOUS | 14 |
| OOD | 15 |
| NEEDS_CORRECTION | 2 |
| **TOTAL** | **150** |

---

## 3. Overall Retrieval Results

- **Exact CORRECT Hits**: ${totalCorrect}
- **AMBIGUOUS Hits**: ${totalAmbiguousCorrect}
- **AMBIGUOUS Incorrect**: ${totalAmbiguousIncorrect}
- **In-Domain Incorrect**: ${totalIncorrect}
- **In-Domain Rejected**: ${totalRejected}
- **OOD Correct Rejections**: ${totalOodCorrectRejection}
- **OOD False Acceptances**: ${totalOodFalseAccept}

### Performance Metrics:
- **Overall Benchmark Accuracy (All 150 Queries)**: ${((totalCorrect + totalAmbiguousCorrect + totalOodCorrectRejection) / 150 * 100).toFixed(1)}% (${totalCorrect + totalAmbiguousCorrect + totalOodCorrectRejection}/150)
- **Supported-Task Accuracy (Excluding 15 OOD)**: ${((totalCorrect + totalAmbiguousCorrect) / 135 * 100).toFixed(1)}% (${totalCorrect + totalAmbiguousCorrect}/135)
- **Supported Non-Ambiguous Accuracy (119 CORRECT queries)**: ${((totalCorrect) / 119 * 100).toFixed(1)}% (${totalCorrect}/119)
- **OOD Rejection Rate (15 OOD queries)**: ${((totalOodCorrectRejection) / 15 * 100).toFixed(1)}% (${totalOodCorrectRejection}/15)
- **Ambiguity Success Rate (14 AMBIGUOUS queries)**: ${((totalAmbiguousCorrect) / 14 * 100).toFixed(1)}% (${totalAmbiguousCorrect}/14)

---

## 4. OOD Results

- **Total OOD Queries**: 15
- **Correctly Rejected**: ${totalOodCorrectRejection}
- **Falsely Accepted**: ${totalOodFalseAccept}
- **Rejection Rate**: ${((totalOodCorrectRejection) / 15 * 100).toFixed(1)}%
- **False Acceptance Rate**: ${((totalOodFalseAccept) / 15 * 100).toFixed(1)}%

---

## 5. Ambiguity Results

- **Total Ambiguous Queries**: 14
- **Acceptable Result Count**: ${totalAmbiguousCorrect}
- **Unacceptable Result Count**: ${totalAmbiguousIncorrect}
- **Rejection Count**: ${results.filter(r => r.expected.classification === 'AMBIGUOUS' && !r.actual.retrieved).length}
- **Confidence Distribution for Ambiguous**:
  - High (>= 80%): ${results.filter(r => r.expected.classification === 'AMBIGUOUS' && r.actual.confidence >= 80).length}
  - Medium (50-79%): ${results.filter(r => r.expected.classification === 'AMBIGUOUS' && r.actual.confidence >= 50 && r.actual.confidence < 80).length}
  - Low (1-49%): ${results.filter(r => r.expected.classification === 'AMBIGUOUS' && r.actual.confidence > 0 && r.actual.confidence < 50).length}
  - Zero (0%): ${results.filter(r => r.expected.classification === 'AMBIGUOUS' && r.actual.confidence === 0).length}

---

## 6. Confidence Analysis

- **Mean Confidence**: ${(results.reduce((a, r) => a + r.actual.confidence, 0) / 150).toFixed(1)}%
- **Median Confidence**: ${[...results].map(r => r.actual.confidence).sort((a,b)=>a-b)[75]}%
- **Min / Max Confidence**: ${Math.min(...results.map(r => r.actual.confidence))}% / ${Math.max(...results.map(r => r.actual.confidence))}%

### High-Confidence Wrong Results (Confidence >= 80%):
- **Total Count**: ${highConfWrong.length}

---

## 7. Latency

- **Mean Latency**: ${meanLatency} ms
- **Median Latency**: ${medianLatency} ms
- **P95 Latency**: ${p95Latency} ms
- **Minimum Latency**: ${minLatency} ms
- **Maximum Latency**: ${maxLatency} ms

---

## 8. Query-Type Breakdown

| Query Type | Total | Hits | Accuracy |
|---|---:|---:|---:|
`;

Object.keys(queryTypeStats).sort().forEach(qt => {
  const st = queryTypeStats[qt];
  md += `| \`${qt}\` | ${st.total} | ${st.hits} | ${((st.hits / st.total) * 100).toFixed(1)}% |\n`;
});

md += `
---

## 9. Corpus Category Breakdown

| Category | Total | Hits | Accuracy |
|---|---:|---:|---:|
`;

Object.keys(categoryStats).sort().forEach(cat => {
  const st = categoryStats[cat];
  md += `| \`${cat}\` | ${st.total} | ${st.hits} | ${((st.hits / st.total) * 100).toFixed(1)}% |\n`;
});

md += `
---

## 10. Failure Examples

The following list details notable retrieval failures categorized by error type:

| ID | Query | Expected Gold | Actual Retrieved | Score | Confidence | Error Category |
|---|---|---|---|---:|---:|---|
`;

results.filter(r => r.evaluation.status === 'INCORRECT' || r.evaluation.status === 'AMBIGUOUS_INCORRECT' || r.evaluation.status === 'OOD_FALSE_ACCEPT').slice(0, 15).forEach(r => {
  md += `| \`${r.id}\` | "${r.query}" | \`${r.expected.gold_command || 'null'}\` | \`${r.actual.command || 'null'}\` | ${r.actual.score} | ${r.actual.confidence}% | \`${r.evaluation.error_category || 'other'}\` |\n`;
});

md += `
---

*Baseline experiment execution complete. Empirical observations documented.*
`;

fs.writeFileSync(path.join(resultsDir, 'baseline-summary.md'), md, 'utf-8');
console.log('✅ Generated baseline-summary.md');
console.log('\n=== BASELINE EXPERIMENT EXECUTION COMPLETE ===');
