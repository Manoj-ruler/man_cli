#!/usr/bin/env node

/**
 * TermAssist Baseline Probe — Research Infrastructure
 * ====================================================
 *
 * Runs a fixed set of research queries through the EXISTING, UNMODIFIED
 * TermAssist search() implementation and records the results.
 *
 * This script is a measurement tool. It does NOT modify search behavior,
 * confidence calculation, BM25 parameters, or any production code.
 *
 * Usage:
 *   node research/probe_baseline.js
 *   npm run research:probe
 *
 * Outputs:
 *   research/results/baseline-probe.json   (machine-readable results)
 *   research/results/baseline-probe.csv    (tabular results)
 *   Terminal summary                       (human-readable summary)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const CLI_DIR = path.join(__dirname, '..', 'cli');
const QUERIES_PATH = path.join(__dirname, 'probes', 'initial_queries.json');
const RESULTS_DIR = path.join(__dirname, 'results');
const JSON_OUTPUT = path.join(RESULTS_DIR, 'baseline-probe.json');
const CSV_OUTPUT = path.join(RESULTS_DIR, 'baseline-probe.csv');
const COMMANDS_PATH = path.join(CLI_DIR, 'data', 'commands.json');

// ---------------------------------------------------------------------------
// Import the EXISTING, UNMODIFIED search implementation
// ---------------------------------------------------------------------------
const { search } = require(path.join(CLI_DIR, 'search.js'));

// ---------------------------------------------------------------------------
// Constants from the production code (read-only reference)
// The production CLI (index.js line 56) rejects results with confidence < 30.
// ---------------------------------------------------------------------------
const PRODUCTION_CONFIDENCE_THRESHOLD = 30;

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Get the current git commit hash, or null if unavailable.
 */
function getGitCommitHash() {
  try {
    return execSync('git rev-parse HEAD', {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Get the current git branch name, or null if unavailable.
 */
function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Get git tags pointing to HEAD, or empty array.
 */
function getGitTags() {
  try {
    const output = execSync('git tag --points-at HEAD', {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return output ? output.split('\n').map(t => t.trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/**
 * Count total commands in the corpus (before OS filtering).
 */
function getCorpusSize() {
  try {
    const commands = JSON.parse(fs.readFileSync(COMMANDS_PATH, 'utf-8'));
    return commands.length;
  } catch {
    return -1;
  }
}

/**
 * Compute median of a sorted numeric array.
 */
function median(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Escape a value for CSV (handles commas, quotes, newlines).
 */
function csvEscape(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// ---------------------------------------------------------------------------
// ANSI colors for terminal output
// ---------------------------------------------------------------------------
const PINK = '\x1b[38;2;255;45;107m';
const GREEN = '\x1b[38;2;0;245;160m';
const CYAN = '\x1b[36m';
const MUTED = '\x1b[38;2;107;107;138m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const YELLOW = '\x1b[33m';

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log(`\n${BOLD}${PINK}═══════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${PINK}  TermAssist Baseline Probe — Research Measurement${RESET}`);
  console.log(`${BOLD}${PINK}═══════════════════════════════════════════════════════════════${RESET}\n`);

  // ── Load probe queries ──────────────────────────────────────────────
  if (!fs.existsSync(QUERIES_PATH)) {
    console.error(`${PINK}ERROR: Probe queries not found at ${QUERIES_PATH}${RESET}`);
    process.exit(1);
  }

  const probeFile = JSON.parse(fs.readFileSync(QUERIES_PATH, 'utf-8'));
  const queries = probeFile.queries;

  if (!Array.isArray(queries) || queries.length === 0) {
    console.error(`${PINK}ERROR: No queries found in probe file.${RESET}`);
    process.exit(1);
  }

  console.log(`${MUTED}Loaded ${queries.length} probe queries from initial_queries.json${RESET}`);

  // ── Collect environment metadata ────────────────────────────────────
  const timestamp = new Date().toISOString();
  const commitHash = getGitCommitHash();
  const gitBranch = getGitBranch();
  const gitTags = getGitTags();
  const corpusSize = getCorpusSize();

  const environment = {
    timestamp,
    node_version: process.version,
    platform: os.platform(),
    arch: os.arch(),
    os_release: os.release(),
    hostname: os.hostname(),
    git_commit: commitHash,
    git_branch: gitBranch,
    git_tags: gitTags,
    corpus_total_commands: corpusSize,
    probe_file: 'research/probes/initial_queries.json',
    probe_version: probeFile._meta ? probeFile._meta.version : 'unknown',
    production_confidence_threshold: PRODUCTION_CONFIDENCE_THRESHOLD,
  };

  console.log(`${MUTED}Platform: ${os.platform()} (${os.arch()})${RESET}`);
  console.log(`${MUTED}Node.js:  ${process.version}${RESET}`);
  console.log(`${MUTED}Commit:   ${commitHash || 'unavailable'}${RESET}`);
  console.log(`${MUTED}Branch:   ${gitBranch || 'unavailable'}${RESET}`);
  console.log(`${MUTED}Tags:     ${gitTags.length > 0 ? gitTags.join(', ') : 'none at HEAD'}${RESET}`);
  console.log(`${MUTED}Corpus:   ${corpusSize} total commands${RESET}`);
  console.log();

  // ── Run probes ──────────────────────────────────────────────────────
  console.log(`${BOLD}${CYAN}Running probes...${RESET}\n`);

  const results = [];

  for (const probe of queries) {
    const startTime = process.hrtime.bigint();
    const match = search(probe.query);
    const endTime = process.hrtime.bigint();

    const latencyMs = Number(endTime - startTime) / 1_000_000;

    // Determine if the production CLI would reject this result.
    // The production threshold is confidence < 30 (index.js line 56).
    const wouldBeRejected =
      match.confidence < PRODUCTION_CONFIDENCE_THRESHOLD || !match.command;

    const result = {
      id: probe.id,
      query: probe.query,
      probe_category: probe.probe_category,
      predicted_command: match.command || null,
      predicted_category: match.category || null,
      raw_score: Math.round(match.score * 10000) / 10000, // 4 decimal places
      confidence: match.confidence,
      rejected_by_threshold: wouldBeRejected,
      latency_ms: Math.round(latencyMs * 1000) / 1000, // 3 decimal places
    };

    results.push(result);

    // Print per-query result
    const statusIcon = wouldBeRejected ? `${PINK}✗` : `${GREEN}✓`;
    const confStr = String(match.confidence).padStart(3);
    console.log(
      `  ${statusIcon} ${RESET}${MUTED}[${probe.id}]${RESET} ` +
        `conf=${confStr}%  score=${match.score.toFixed(2).padStart(6)}  ` +
        `${latencyMs.toFixed(1).padStart(5)}ms  ` +
        `${MUTED}${probe.query.substring(0, 50)}${probe.query.length > 50 ? '...' : ''}${RESET}`
    );
  }

  console.log();

  // ── Compute summary statistics ──────────────────────────────────────
  const latencies = results.map(r => r.latency_ms);
  const confidences = results.map(r => r.confidence);
  const successfulResults = results.filter(r => !r.rejected_by_threshold);
  const rejectedResults = results.filter(r => r.rejected_by_threshold);

  const highestConf = results.reduce(
    (best, r) => (r.confidence > best.confidence ? r : best),
    results[0]
  );
  const lowestConf = results.reduce(
    (worst, r) => (r.confidence < worst.confidence ? r : worst),
    results[0]
  );

  const summary = {
    total_queries: results.length,
    successful_retrievals: successfulResults.length,
    rejected_low_confidence: rejectedResults.length,
    latency: {
      average_ms: Math.round((latencies.reduce((s, l) => s + l, 0) / latencies.length) * 1000) / 1000,
      median_ms: Math.round(median(latencies) * 1000) / 1000,
      min_ms: Math.round(Math.min(...latencies) * 1000) / 1000,
      max_ms: Math.round(Math.max(...latencies) * 1000) / 1000,
    },
    confidence: {
      average: Math.round((confidences.reduce((s, c) => s + c, 0) / confidences.length) * 100) / 100,
      highest: {
        value: highestConf.confidence,
        query: highestConf.query,
        id: highestConf.id,
      },
      lowest: {
        value: lowestConf.confidence,
        query: lowestConf.query,
        id: lowestConf.id,
      },
    },
  };

  // ── Print terminal summary ──────────────────────────────────────────
  console.log(`${BOLD}${PINK}═══════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${PINK}  Summary${RESET}`);
  console.log(`${BOLD}${PINK}═══════════════════════════════════════════════════════════════${RESET}\n`);

  console.log(`  ${BOLD}Total queries:          ${RESET}${summary.total_queries}`);
  console.log(`  ${BOLD}Successful retrievals:  ${RESET}${GREEN}${summary.successful_retrievals}${RESET}`);
  console.log(`  ${BOLD}Rejected (low conf):    ${RESET}${PINK}${summary.rejected_low_confidence}${RESET}`);
  console.log();
  console.log(`  ${BOLD}${CYAN}Latency${RESET}`);
  console.log(`    Average:  ${summary.latency.average_ms.toFixed(3)} ms`);
  console.log(`    Median:   ${summary.latency.median_ms.toFixed(3)} ms`);
  console.log(`    Min:      ${summary.latency.min_ms.toFixed(3)} ms`);
  console.log(`    Max:      ${summary.latency.max_ms.toFixed(3)} ms`);
  console.log();
  console.log(`  ${BOLD}${CYAN}Confidence${RESET}`);
  console.log(`    Average:  ${summary.confidence.average}%`);
  console.log(`    Highest:  ${summary.confidence.highest.value}% — ${MUTED}[${summary.confidence.highest.id}] ${summary.confidence.highest.query}${RESET}`);
  console.log(`    Lowest:   ${summary.confidence.lowest.value}% — ${MUTED}[${summary.confidence.lowest.id}] ${summary.confidence.lowest.query}${RESET}`);
  console.log();

  // ── Save JSON results ───────────────────────────────────────────────
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const outputPayload = {
    _meta: {
      description:
        'Baseline probe results for the frozen TermAssist search implementation. These results must not be manually edited.',
      generated_at: timestamp,
      script: 'research/probe_baseline.js',
      warning: 'DO NOT manually edit this file. Re-run the probe to regenerate.',
    },
    environment,
    summary,
    results,
  };

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(outputPayload, null, 2), 'utf-8');
  console.log(`${GREEN}✓${RESET} JSON results saved to: ${MUTED}${path.relative(path.join(__dirname, '..'), JSON_OUTPUT)}${RESET}`);

  // ── Save CSV results ────────────────────────────────────────────────
  const csvHeaders = [
    'id',
    'query',
    'probe_category',
    'predicted_command',
    'predicted_category',
    'raw_score',
    'confidence',
    'rejected_by_threshold',
    'latency_ms',
  ];

  const csvRows = [csvHeaders.join(',')];
  for (const r of results) {
    csvRows.push(
      [
        csvEscape(r.id),
        csvEscape(r.query),
        csvEscape(r.probe_category),
        csvEscape(r.predicted_command),
        csvEscape(r.predicted_category),
        csvEscape(r.raw_score),
        csvEscape(r.confidence),
        csvEscape(r.rejected_by_threshold),
        csvEscape(r.latency_ms),
      ].join(',')
    );
  }

  fs.writeFileSync(CSV_OUTPUT, csvRows.join('\n') + '\n', 'utf-8');
  console.log(`${GREEN}✓${RESET} CSV results saved to: ${MUTED}${path.relative(path.join(__dirname, '..'), CSV_OUTPUT)}${RESET}`);

  console.log(`\n${BOLD}${PINK}═══════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${MUTED}  Baseline measurement complete. No production code was modified.${RESET}`);
  console.log(`${BOLD}${PINK}═══════════════════════════════════════════════════════════════${RESET}\n`);
}

main();
