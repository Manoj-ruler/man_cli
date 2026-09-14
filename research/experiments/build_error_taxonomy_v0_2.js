// v0.2 pipeline -- identical error-taxonomy logic to build_error_taxonomy.js, pointed at v0.2's
// candidates (209 queries, hybrid/A3 system).

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const candidates = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/v0.2/candidates.json'), 'utf-8')).candidates;
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
  if (hit) { tags.push('CORRECT'); return tags; }

  if (c.expected_classification === 'OOD') tags.push('OOD_FALSE_ACCEPTANCE');
  else if (c.expected_classification === 'AMBIGUOUS') tags.push('AMBIGUITY_FAILURE');
  else if (c.query_type === 'polysemy') tags.push('LEXICAL_POLYSEMY');
  else if (c.query_type === 'low_overlap_paraphrase') tags.push('LOW_OVERLAP_FAILURE');
  else if (c.query_type === 'single_keyword') tags.push('OVERMATCH');
  else if (c.query_type === 'complex_multi_intent') tags.push('WRONG_SCOPE');
  else if (c.query_type === 'safety_sensitive') tags.push('WRONG_ACTION');
  else tags.push('SEMANTIC_MISMATCH');

  if (c.top1_score >= 0.8) tags.push('HIGH_CONFIDENCE_WRONG');

  const retrievedOs = commandOsMap.get(c.top1_command);
  if (retrievedOs && !retrievedOs.includes('all') && !retrievedOs.includes('win32')) tags.push('WRONG_PLATFORM');

  return tags;
}

function main() {
  const rows = hybrid.map(c => ({ id: c.id, query_type: c.query_type, expected_classification: c.expected_classification, gold_command: c.gold_command, retrieved_command: c.top1_command, top1_score: c.top1_score, tags: tagQuery(c) }));
  const tagCounts = {};
  rows.forEach(r => r.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));

  const outDir = path.join(projectRoot, 'research/results/v0.2');
  fs.writeFileSync(path.join(outDir, 'final-error-analysis.json'), JSON.stringify({ benchmark_version: 'v0.2', generated_at: new Date().toISOString(), n: rows.length, tag_counts: tagCounts, rows }, null, 2), 'utf-8');

  const csvHeaders = ['id', 'query_type', 'expected_classification', 'gold_command', 'retrieved_command', 'top1_score', 'tags'];
  const csvRows = [csvHeaders.join(',')];
  rows.forEach(r => csvRows.push([r.id, r.query_type, r.expected_classification, `"${(r.gold_command || '').replace(/"/g, '""')}"`, `"${r.retrieved_command.replace(/"/g, '""')}"`, r.top1_score, `"${r.tags.join('|')}"`].join(',')));
  fs.writeFileSync(path.join(outDir, 'final-error-analysis.csv'), csvRows.join('\n') + '\n', 'utf-8');

  console.log('v0.2 Tag counts:', JSON.stringify(tagCounts, null, 2));
  console.log(`\nWrote ${path.join(outDir, 'final-error-analysis.json')}`);
}

main();
