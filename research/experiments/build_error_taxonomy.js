// Phase 16 -- automated error taxonomy for the hybrid (A3) system, the primary result-bearing
// condition. Categories per FINAL_RESEARCH_PLAN.md: CORRECT, SEMANTIC_MISMATCH,
// LEXICAL_POLYSEMY, OOD_FALSE_ACCEPTANCE, AMBIGUITY_FAILURE, OVERMATCH, WRONG_ACTION,
// WRONG_SCOPE, WRONG_PLATFORM, LOW_OVERLAP_FAILURE, HIGH_CONFIDENCE_WRONG.
//
// Tagging is rule-based on already-computed fields (expected_classification, query_type, hit,
// top1_score) -- deterministic and auditable, not a second ML classifier. HIGH_CONFIDENCE_WRONG
// is a secondary, co-occurring tag (queries can carry 2 tags), not mutually exclusive with the
// primary failure-mode tag, matching the plan's "one or more categories" instruction.
//
// WRONG_PLATFORM is evaluated but, as documented below, structurally cannot occur in this
// benchmark by construction (the corpus is pre-filtered to the win32 platform before search
// ever runs) -- this is stated explicitly rather than silently omitted or faked with a nonzero
// count.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const candidates = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/reliability/candidates.json'), 'utf-8')).candidates;
const hybrid = candidates.filter(c => c.system === 'hybrid');

const commandsCorpus = JSON.parse(fs.readFileSync(path.join(projectRoot, 'cli/data/commands.json'), 'utf-8'));
const commandOsMap = new Map(commandsCorpus.map(c => [c.command, c.os]));

function isMatch(c) {
  const valid = new Set([c.gold_command, ...(c.acceptable_commands || [])].filter(Boolean));
  return valid.has(c.top1_command);
}

function tagQuery(c) {
  const tags = [];
  const hit = isMatch(c);

  if (hit) {
    tags.push('CORRECT');
    return tags; // no failure tags for correct predictions
  }

  // Primary failure-mode tag, in priority order
  if (c.expected_classification === 'OOD') {
    tags.push('OOD_FALSE_ACCEPTANCE');
  } else if (c.expected_classification === 'AMBIGUOUS') {
    tags.push('AMBIGUITY_FAILURE');
  } else if (c.query_type === 'polysemy') {
    tags.push('LEXICAL_POLYSEMY');
  } else if (c.query_type === 'low_overlap_paraphrase') {
    tags.push('LOW_OVERLAP_FAILURE');
  } else if (c.query_type === 'single_keyword') {
    tags.push('OVERMATCH'); // short/underspecified queries tend to overmatch broadly relevant commands
  } else if (c.query_type === 'complex_multi_intent') {
    tags.push('WRONG_SCOPE'); // partial/incomplete coverage of a multi-part request
  } else if (c.query_type === 'safety_sensitive') {
    tags.push('WRONG_ACTION');
  } else {
    tags.push('SEMANTIC_MISMATCH'); // generic fallback: wrong command, no more specific pattern applies
  }

  // Secondary, co-occurring tag: was this a confident wrong answer?
  // top1_score is the hybrid fused score (0-1 by construction); >=0.8 chosen as "high" using the
  // same threshold convention as the original baseline-error-analysis.md's confidence>=80% cut,
  // for direct comparability across documents.
  if (c.top1_score >= 0.8) tags.push('HIGH_CONFIDENCE_WRONG');

  // WRONG_PLATFORM check: does the retrieved command's own os field exclude the benchmark's
  // platform (win32)? Included for completeness even though it should structurally be
  // impossible, since cli/search.js's buildIndex() filters the corpus BEFORE scoring.
  const retrievedOs = commandOsMap.get(c.top1_command);
  if (retrievedOs && !retrievedOs.includes('all') && !retrievedOs.includes('win32')) {
    tags.push('WRONG_PLATFORM');
  }

  return tags;
}

function main() {
  const rows = hybrid.map(c => ({
    id: c.id, query_type: c.query_type, expected_classification: c.expected_classification,
    gold_command: c.gold_command, retrieved_command: c.top1_command,
    top1_score: c.top1_score, tags: tagQuery(c)
  }));

  const tagCounts = {};
  rows.forEach(r => r.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));

  const wrongPlatformCount = rows.filter(r => r.tags.includes('WRONG_PLATFORM')).length;

  const outDir = path.join(projectRoot, 'research/analysis');
  const jsonOut = { generated_at: new Date().toISOString(), n: rows.length, tag_counts: tagCounts, wrong_platform_structural_note: wrongPlatformCount === 0 ? 'WRONG_PLATFORM count is 0 by construction: cli/search.js filters the corpus to the benchmark platform (win32) before any scoring happens, so a cross-platform-mismatched command can never be returned. This is stated explicitly as a structural guarantee, not a detection gap.' : `WRONG_PLATFORM count is ${wrongPlatformCount} -- unexpected given the platform pre-filter, investigate before reporting.`, rows };
  fs.writeFileSync(path.join(outDir, 'final-error-analysis.json'), JSON.stringify(jsonOut, null, 2), 'utf-8');

  const csvHeaders = ['id', 'query_type', 'expected_classification', 'gold_command', 'retrieved_command', 'top1_score', 'tags'];
  const csvRows = [csvHeaders.join(',')];
  rows.forEach(r => csvRows.push([r.id, r.query_type, r.expected_classification, `"${(r.gold_command || '').replace(/"/g, '""')}"`, `"${r.retrieved_command.replace(/"/g, '""')}"`, r.top1_score, `"${r.tags.join('|')}"`].join(',')));
  fs.writeFileSync(path.join(outDir, 'final-error-analysis.csv'), csvRows.join('\n') + '\n', 'utf-8');

  console.log('Tag counts:', JSON.stringify(tagCounts, null, 2));
  console.log(`WRONG_PLATFORM count: ${wrongPlatformCount} (expected 0 -- structural guarantee, see note in JSON output)`);
  console.log(`\nWrote ${path.join(outDir, 'final-error-analysis.json')} and .csv (${rows.length} rows)`);
}

main();
