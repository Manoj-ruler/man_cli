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

if (query === 'sync' || query === '--sync') {
  const conf = config.load();
  console.log(`\n${MUTED}Syncing custom snippets from dashboard...${RESET}`);
  sync.pullSnippets(conf).then((count) => {
    console.log(`${GREEN}Successfully synced ${count} snippets.${RESET}\n`);
    process.exit(0);
  }).catch((err) => {
    console.error(`\n${PINK}Sync failed: ${err.message}${RESET}\n`);
    process.exit(1);
  });
} else {
  try {
    // Import the new native JS search engine
    const searchEngine = require('./search');

    // Execute BM25 search algorithms instantly (under 10ms usually)
    const startTime = Date.now();
    const match = searchEngine.search(query);
    const responseTimeMs = Date.now() - startTime;

    if (match.confidence < 30 || !match.command) {
      console.log(`\n${MUTED}No confident match found. Try rephrasing.${RESET}\n`);
      process.exit(1);
    }

    // Formatting output variables
    const { command, category, confidence } = match;
    console.log(`\n${BOLD}${PINK}${command}${RESET}`);
    console.log(`${MUTED}category: ${category}  •  confidence: ${confidence}%${RESET}\n`);

    // Sync to web dashboard if token is configured
    const conf = config.load();
    if (conf.sync_enabled && conf.api_token) {
      sync.logQuery({
        query_text: query,
        matched_command: command,
        category,
        response_time_ms: responseTimeMs, // Record exactly how fast it was!
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
}
