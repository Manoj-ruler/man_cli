// Phase 1 -- independent reproduction of the frozen TermAssist-Bench v0.1 baseline.
//
// This is a NEW script, not an edit of research/run_baseline.js. That file is left
// byte-identical as the original historical artifact. This script exists because
// run_baseline.js hardcodes a SHA-256 check against LF-encoded bytes, which fails
// on any Windows checkout where core.autocrlf rewrites the file to CRLF (see
// research/implementation/repository-audit.md section 4 for the full root-cause
// analysis). The evaluation logic below is otherwise identical to run_baseline.js,
// and calls the same untouched cli/search.js production function.

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { performance } = require('perf_hooks');

const { search } = require('../../cli/search');

const projectRoot = path.join(__dirname, '..', '..');
const datasetsDir = path.join(projectRoot, 'research/datasets');
const valJsonPath = path.join(datasetsDir, 'termassist_bench_v0.1_validated.json');
const reviewPath = path.join(datasetsDir, 'review/human_review_results.json');
const resultsDir = path.join(projectRoot, 'research/results/baseline');

if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

// --- Hash verification, CRLF-tolerant ---
// Canonical hash is defined over LF-normalized content (see manifest + audit doc).
// We report both the raw-bytes-as-checked-out hash and the LF-normalized hash so
// the provenance is fully transparent, and only compare against the canonical one.
const CANONICAL_SHA256 = '2a554d3c3c425192e0fa295f2dc2eae833f92a2ae77feaf0f3ef70996e8c02a0';

const rawBuffer = fs.readFileSync(valJsonPath);
const rawSha256 = crypto.createHash('sha256').update(rawBuffer).digest('hex');

const lfText = fs.readFileSync(valJsonPath, 'utf-8').replace(/\r\n/g, '\n');
const lfSha256 = crypto.createHash('sha256').update(Buffer.from(lfText, 'utf-8')).digest('hex');

console.log('=== VERIFYING BENCHMARK SHA-256 (CRLF-tolerant) ===');
console.log('Canonical (LF) expected:', CANONICAL_SHA256);
console.log('As-checked-out (raw):   ', rawSha256);
console.log('Recomputed LF-normalized:', lfSha256);

if (lfSha256 !== CANONICAL_SHA256) {
  console.error('FATAL: benchmark content does not match the canonical hash even after LF normalization. Aborting.');
  process.exit(1);
}
console.log(rawSha256 === CANONICAL_SHA256
  ? 'Raw bytes already match canonical hash directly.\n'
  : 'Raw bytes differ only by line-ending normalization; content verified identical.\n');

// --- Load benchmark (parse from the LF-normalized text so behavior is independent of checkout line endings) ---
const benchData = JSON.parse(lfText);
const queries = benchData.queries;
const reviews = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
const reviewMap = new Map(reviews.map(r => [r.id, r]));
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));

let gitCommit = 'unknown';
try {
  gitCommit = require('child_process').execSync('git rev-parse HEAD', { cwd: projectRoot }).toString().trim();
} catch (e) {}

const metadata = {
  experiment_id: 'E1-baseline-reproduction',
  git_commit: gitCommit,
  reference_frozen_baseline_commit: '4443ec016c87895ebbc1b9be831e5f80b9bd3b50',
  benchmark_name: 'TermAssist-Bench',
  benchmark_version: 'v0.1-validated',
  benchmark_sha256_canonical_lf: CANONICAL_SHA256,
  benchmark_sha256_raw_as_checked_out: rawSha256,
  node_version: process.version,
  platform: os.platform(),
  os_release: os.release(),
  arch: os.arch(),
  timestamp: new Date().toISOString(),
  termassist_version: packageJson.version || '0.1.0',
  total_queries: queries.length
};
fs.writeFileSync(path.join(resultsDir, 'reproduction-metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');

// --- Run retrieval (identical evaluation logic to research/run_baseline.js) ---
console.log(`=== RUNNING BASELINE RETRIEVAL ON ${queries.length} QUERIES ===`);

const results = [];
const latencies = [];

queries.forEach((q) => {
  const r = reviewMap.get(q.id);
  const expectedClassification = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT'));
  const goldCommand = q.gold_command || (r ? r.final_gold_command : null);
  const acceptableCommands = Array.isArray(q.acceptable_commands) ? q.acceptable_commands : [];

  const allValidCommands = new Set();
  if (goldCommand) allValidCommands.add(goldCommand);
  acceptableCommands.forEach(c => allValidCommands.add(c));

  const start = performance.now();
  const searchResult = search(q.query);
  const end = performance.now();

  const latencyMs = parseFloat((end - start).toFixed(4));
  latencies.push(latencyMs);

  const retrieved = searchResult.confidence > 0 && searchResult.score >= 2.0;
  const returnedCommand = searchResult.command;
  const score = parseFloat(searchResult.score.toFixed(4));
  const confidence = searchResult.confidence;

  let status = 'INCORRECT';
  let errorCategory = null;
  const goldStatus = (q.id === 'TA-B093' || q.id === 'TA-B145') ? 'NEEDS_CORRECTION' : 'VALIDATED';

  if (expectedClassification === 'OOD') {
    status = retrieved ? 'OOD_FALSE_ACCEPT' : 'OOD_CORRECT_REJECTION';
    if (retrieved) errorCategory = 'ood_false_acceptance';
  } else if (expectedClassification === 'AMBIGUOUS') {
    if (!retrieved) { status = 'REJECTED'; errorCategory = 'ambiguity_failure'; }
    else if (allValidCommands.has(returnedCommand)) { status = 'AMBIGUOUS_CORRECT'; }
    else { status = 'AMBIGUOUS_INCORRECT'; errorCategory = 'ambiguity_failure'; }
  } else if (expectedClassification === 'CORRECT' || expectedClassification === 'NEEDS_CORRECTION') {
    if (!retrieved) { status = 'REJECTED'; errorCategory = 'underconfident_correct'; }
    else if (allValidCommands.has(returnedCommand)) { status = 'CORRECT'; }
    else {
      status = 'INCORRECT';
      if (q.query_type === 'polysemy') errorCategory = 'lexical_polysemy';
      else if (q.query_type === 'low_overlap_paraphrase') errorCategory = 'low_overlap_failure';
      else if (q.query_type === 'complex_multi_intent') errorCategory = 'complex_intent_failure';
      else if (q.query_type === 'safety_sensitive') errorCategory = 'safety_scope_mismatch';
      else if (confidence >= 80) errorCategory = 'overconfident_wrong';
      else errorCategory = 'semantic_mismatch';
    }
  }

  results.push({
    id: q.id, query: q.query, category: q.category || 'general',
    query_type: q.query_type || 'standard', difficulty: q.difficulty || 'medium',
    risk_level: q.risk_level || 'low',
    expected: { classification: expectedClassification, gold_command: goldCommand, acceptable_commands: acceptableCommands },
    actual: { retrieved, command: returnedCommand, score, confidence, latency_ms: latencyMs },
    evaluation: { status, error_category: errorCategory, gold_status: goldStatus }
  });
});

fs.writeFileSync(path.join(resultsDir, 'reproduction-results.json'), JSON.stringify(results, null, 2), 'utf-8');

// --- Compare against the archived baseline-v0.1 results ---
const archivedPath = path.join(projectRoot, 'research/results/baseline-v0.1/baseline-results.json');
const archived = JSON.parse(fs.readFileSync(archivedPath, 'utf-8'));
const archivedMap = new Map(archived.map(r => [r.id, r]));

let mismatches = [];
results.forEach(r => {
  const a = archivedMap.get(r.id);
  if (!a) { mismatches.push({ id: r.id, reason: 'missing_in_archive' }); return; }
  if (a.actual.command !== r.actual.command || a.evaluation.status !== r.evaluation.status) {
    mismatches.push({
      id: r.id,
      archived: { command: a.actual.command, status: a.evaluation.status },
      reproduced: { command: r.actual.command, status: r.evaluation.status }
    });
  }
});

const summary = {
  total_queries: results.length,
  archived_total: archived.length,
  mismatches_count: mismatches.length,
  outcome_identical: mismatches.length === 0,
  mismatches
};
fs.writeFileSync(path.join(resultsDir, 'reproduction-vs-archive-diff.json'), JSON.stringify(summary, null, 2), 'utf-8');

console.log(`\n=== REPRODUCTION COMPLETE: ${results.length} queries ===`);
console.log(`Mismatches vs archived baseline-v0.1: ${mismatches.length}`);
if (mismatches.length === 0) {
  console.log('EXACT MATCH: reproduction is byte-for-byte outcome-identical to the archived frozen baseline.');
} else {
  console.log('DIFFERENCES FOUND -- see reproduction-vs-archive-diff.json for details.');
}

// --- Recompute the headline metrics independently (sanity check against archived summary numbers) ---
const totalCorrect = results.filter(r => r.evaluation.status === 'CORRECT').length;
const totalAmbigCorrect = results.filter(r => r.evaluation.status === 'AMBIGUOUS_CORRECT').length;
const totalOodCorrectRejection = results.filter(r => r.evaluation.status === 'OOD_CORRECT_REJECTION').length;
const totalOodFalseAccept = results.filter(r => r.evaluation.status === 'OOD_FALSE_ACCEPT').length;
const totalAmbigIncorrect = results.filter(r => r.evaluation.status === 'AMBIGUOUS_INCORRECT').length;
const highConfWrong = results.filter(r => r.actual.confidence >= 80 &&
  ['INCORRECT', 'AMBIGUOUS_INCORRECT', 'OOD_FALSE_ACCEPT'].includes(r.evaluation.status));
const wrongResults = results.filter(r => ['INCORRECT', 'AMBIGUOUS_INCORRECT', 'OOD_FALSE_ACCEPT'].includes(r.evaluation.status));
const meanConfWrong = wrongResults.length
  ? (wrongResults.reduce((a, r) => a + r.actual.confidence, 0) / wrongResults.length).toFixed(1)
  : 'n/a';
const sortedLatencies = [...latencies].sort((a, b) => a - b);
const meanLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(4);
const p95Latency = sortedLatencies[Math.floor(sortedLatencies.length * 0.95)].toFixed(4);

const recomputed = {
  overall_accuracy_pct: +(((totalCorrect + totalAmbigCorrect + totalOodCorrectRejection) / 150) * 100).toFixed(1),
  supported_task_accuracy_pct: +(((totalCorrect + totalAmbigCorrect) / 135) * 100).toFixed(1),
  non_ambiguous_in_domain_accuracy_pct: +((totalCorrect / 119) * 100).toFixed(1),
  ood_rejection_rate_pct: +((totalOodCorrectRejection / 15) * 100).toFixed(1),
  ood_false_acceptance_rate_pct: +((totalOodFalseAccept / 15) * 100).toFixed(1),
  ambiguity_success_rate_pct: +((totalAmbigCorrect / 14) * 100).toFixed(1),
  high_confidence_wrong_count: highConfWrong.length,
  mean_confidence_on_wrong_pct: meanConfWrong,
  mean_latency_ms: +meanLatency,
  p95_latency_ms: +p95Latency,
  archived_reference: {
    overall_accuracy_pct: 67.3, supported_task_accuracy_pct: 71.9,
    non_ambiguous_in_domain_accuracy_pct: 78.2, ood_rejection_rate_pct: 26.7,
    ood_false_acceptance_rate_pct: 73.3, ambiguity_success_rate_pct: 28.6,
    high_confidence_wrong_count: 32, mean_confidence_on_wrong_pct: 87.7,
    mean_latency_ms: 3.29, p95_latency_ms: 6.46
  }
};
fs.writeFileSync(path.join(resultsDir, 'reproduction-summary.json'), JSON.stringify(recomputed, null, 2), 'utf-8');
console.log('\nRecomputed headline metrics (vs archived reference):');
console.log(JSON.stringify(recomputed, null, 2));
