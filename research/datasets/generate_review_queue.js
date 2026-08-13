#!/usr/bin/env node

/**
 * Generate termassist_bench_review_queue.csv
 * Classifies all 150 benchmark items into human-review queue categories.
 */

const fs = require('fs');
const path = require('path');

const benchPath = path.join(__dirname, 'termassist_bench_v0.1.json');
const bench = JSON.parse(fs.readFileSync(benchPath, 'utf-8')).queries;

function classifyQuery(q) {
  // 1. OOD / Rejection Review
  if (q.requires_rejection || !q.known_task || q.query_type === 'ood') {
    return {
      review_required: 'NEEDS_OOD_REVIEW',
      review_reason: 'Out-of-domain query requiring verification that no corpus intent exists',
      suggested_reviewer_action: 'Confirm no command in commands.json satisfies this query and rejection is mandatory'
    };
  }

  // 2. Ambiguity Review
  if (q.ambiguity || q.query_type === 'ambiguous' || q.query_type === 'single_keyword') {
    return {
      review_required: 'NEEDS_AMBIGUITY_REVIEW',
      review_reason: q.query_type === 'single_keyword' 
        ? 'Single keyword entry matching an entire domain/category' 
        : 'Multiple commands in corpus could satisfy query',
      suggested_reviewer_action: 'Verify list of acceptable commands and confirm if primary gold command choice is appropriate'
    };
  }

  // 3. Risk Review
  if (q.risk_level === 'critical' || (q.query_type === 'safety_sensitive' && (q.risk_level === 'high' || q.risk_level === 'critical'))) {
    return {
      review_required: 'NEEDS_RISK_REVIEW',
      review_reason: 'Destructive or privileged command with high/critical risk level',
      suggested_reviewer_action: 'Verify risk level rating and enforce strict non-execution safety flag in evaluation'
    };
  }

  // 4. Platform Review
  if (q.gold_command && (
    q.gold_command.includes('sudo') || 
    q.gold_command.includes('crontab') || 
    q.gold_command.includes('systemd') || 
    q.gold_command.includes('clamscan') || 
    q.gold_command.includes('icacls') || 
    q.gold_command.includes('Set-ExecutionPolicy')
  )) {
    return {
      review_required: 'NEEDS_PLATFORM_REVIEW',
      review_reason: 'Command contains platform-specific syntax or tool assumptions',
      suggested_reviewer_action: 'Check OS filter tags in commands.json and platform compatibility'
    };
  }

  // 5. Gold Command Review
  if (
    q.query_type === 'polysemy' || 
    q.query_type === 'low_overlap_paraphrase' || 
    q.query_type === 'complex_multi_intent' || 
    q.difficulty === 'hard' || 
    q.difficulty === 'adversarial'
  ) {
    return {
      review_required: 'NEEDS_GOLD_COMMAND_REVIEW',
      review_reason: 'Linguistic variation, polysemous keywords, or multi-constraint query requiring semantic validation',
      suggested_reviewer_action: 'Review whether gold command fully satisfies query without missing constraints or introducing unwanted side effects'
    };
  }

  // 6. Ready for Human Confirmation
  return {
    review_required: 'READY_FOR_HUMAN_CONFIRMATION',
    review_reason: 'Straightforward canonical or standard paraphrase query with clear gold command',
    suggested_reviewer_action: 'Confirm wording and approve entry'
  };
}

function csvEscape(val) {
  if (val === null || val === undefined) return '';
  if (Array.isArray(val)) {
    if (val.length === 0) return '';
    const str = val.join('; ');
    return '"' + str.replace(/"/g, '""') + '"';
  }
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

const headers = [
  'id',
  'query',
  'query_type',
  'gold_intent',
  'gold_command',
  'acceptable_commands',
  'difficulty',
  'risk_level',
  'known_task',
  'ambiguity',
  'review_required',
  'review_reason',
  'suggested_reviewer_action'
];

const rows = [headers.join(',')];

bench.forEach(q => {
  const cls = classifyQuery(q);
  const row = [
    csvEscape(q.id),
    csvEscape(q.query),
    csvEscape(q.query_type),
    csvEscape(q.gold_intent),
    csvEscape(q.gold_command),
    csvEscape(q.acceptable_commands),
    csvEscape(q.difficulty),
    csvEscape(q.risk_level),
    csvEscape(q.known_task),
    csvEscape(q.ambiguity),
    csvEscape(cls.review_required),
    csvEscape(cls.review_reason),
    csvEscape(cls.suggested_reviewer_action)
  ];
  rows.push(row.join(','));
});

const csvPath = path.join(__dirname, 'termassist_bench_review_queue.csv');
fs.writeFileSync(csvPath, rows.join('\n') + '\n', 'utf-8');

console.log('Wrote review queue CSV to:', csvPath);
