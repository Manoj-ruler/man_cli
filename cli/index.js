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
const { launchInteractiveMode } = require('./interactive');

// ANSI color codes
const PINK    = '\x1b[38;2;255;45;107m';
const GREEN   = '\x1b[38;2;0;245;160m';
const MUTED   = '\x1b[38;2;107;107;138m';
const WHITE   = '\x1b[37m';
const BOLD    = '\x1b[1m';
const RESET   = '\x1b[0m';

async function main() {
  const args = process.argv.slice(2);
  const query = args.join(' ');
  
  if (query === 'sync' || query === '--sync') {
    const conf = config.load();
    console.log(`\n${MUTED}Syncing custom snippets from dashboard...${RESET}`);
    try {
      const count = await sync.pullSnippets(conf);
      console.log(`${GREEN}Successfully synced ${count} snippets.${RESET}\n`);
    } catch (err) {
      console.error(`\n${PINK}Sync failed: ${err.message}${RESET}\n`);
      process.exit(1);
    }
    return;
  }

  let commandToExecute = '';
  let commandCategory = 'general';
  let commandConfidence = 100;
  let responseTimeMs = 0;

  try {
    if (args.length === 0) {
      commandToExecute = await launchInteractiveMode();
      responseTimeMs = 1; // Basic assumption for interactive selection
    } else {
      const searchEngine = require('./search');
      const startTime = Date.now();
      const match = searchEngine.search(query);
      responseTimeMs = Date.now() - startTime;

      if (match.confidence < 30 || !match.command) {
        console.log(`\n${MUTED}No confident match found. Try rephrasing.${RESET}\n`);
        process.exit(1);
      }

      commandToExecute = match.command;
      commandCategory = match.category;
      commandConfidence = match.confidence;

      console.log(`\n${BOLD}${PINK}${commandToExecute}${RESET}`);
      console.log(`${MUTED}category: ${commandCategory}  •  confidence: ${commandConfidence}%${RESET}\n`);
    }

    if (commandToExecute) {
      // Sync telemetry silently
      const conf = config.load();
      if (conf.sync_enabled && conf.api_token) {
        sync.logQuery({
          query_text: query || 'interactive search',
          matched_command: commandToExecute,
          category: commandCategory,
          response_time_ms: responseTimeMs,
          success: true,
        }, conf).catch(() => {});
      }

      // Allow user to edit the mapped command before executing
      const { input } = require('@inquirer/prompts');
      let finalCommand = '';
      
      try {
        finalCommand = await input({
          message: '🚀 Ready to execute (Edit if needed):',
          default: commandToExecute
        });
      } catch (promptErr) {
        if (promptErr.name === 'ExitPromptError') {
          process.exit(0);
        }
      }

      if (finalCommand) {
        try {
          execSync(finalCommand, { stdio: 'inherit' });
        } catch (err) {
          console.error(`\n${PINK}Command failed to execute or was aborted.${RESET}\n`);
        }
      }
    }

  } catch (err) {
    console.error(`\n${MUTED}Error: ${err.message || 'Unknown error'}${RESET}\n`);
    process.exit(1);
  }
}

main();
