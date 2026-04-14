#!/usr/bin/env node

/**
 * TermAssist CLI — The Terminal That Understands English
 * Usage: ?? <natural language query>
 * 
 * Maps natural language to bash commands via local FAISS vector search.
 */

const { execSync }  = require('child_process');
const path          = require('path');
const config        = require('./config');
const sync          = require('./sync');

// ANSI color codes
const PINK    = '\x1b[38;2;255;45;107m';
const GREEN   = '\x1b[38;2;0;245;160m';
const MUTED   = '\x1b[38;2;107;107;138m';
const WHITE   = '\x1b[37m';
const BOLD    = '\x1b[1m';
const RESET   = '\x1b[0m';

// Get query from args
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`\n${MUTED}Usage: ${WHITE}?? ${GREEN}<natural language query>${RESET}`);
  console.log(`${MUTED}Example: ${WHITE}?? find all python files modified today${RESET}\n`);
  process.exit(0);
}

const query = args.join(' ');
const embedScript = path.join(__dirname, 'embed.py');

try {
  // Call Python embedding + search
  const result = execSync(`python "${embedScript}" "${query}"`, {
    encoding: 'utf-8',
    timeout: 120000,
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();

  const parsed = JSON.parse(result);
  const { command, score, category } = parsed;

  if (score < 0.6) {
    console.log(`\n${MUTED}No confident match found. Try rephrasing.${RESET}\n`);
    process.exit(1);
  }

  // Print result cleanly
  console.log(`\n${BOLD}${PINK}${command}${RESET}`);
  console.log(`${MUTED}category: ${category}  •  confidence: ${(score * 100).toFixed(0)}%${RESET}\n`);

  // Sync to dashboard (fire-and-forget)
  const conf = config.load();
  if (conf.sync_enabled && conf.api_token) {
    sync.logQuery({
      query_text: query,
      matched_command: command,
      category,
      response_time_ms: 0, // TODO: measure actual time
      success: true,
    }, conf).catch(() => {}); // silent fail
  }

} catch (err) {
  // Check if Python/FAISS not installed
  if (err.message && err.message.includes('python')) {
    console.log(`\n${MUTED}Error: Python 3 is required. Install it and try again.${RESET}`);
    console.log(`${MUTED}Also install: pip install sentence-transformers faiss-cpu${RESET}\n`);
  } else {
    console.error(`\n${MUTED}Error: ${err.message || 'Unknown error'}${RESET}\n`);
  }
  process.exit(1);
}
