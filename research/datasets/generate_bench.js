#!/usr/bin/env node

/**
 * TermAssist-Bench v0.1 Generator (scratch script)
 * Generates the benchmark JSON from the corpus index and curated queries.
 * This is a one-time generation script, not production code.
 */

'use strict';
const fs = require('fs');
const path = require('path');

// Load corpus index
const corpus = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '_corpus_index.json'), 'utf-8'));

const benchmark = [];
let idCounter = 1;
function nextId() { return `TA-B${String(idCounter++).padStart(3, '0')}`; }

function addQuery(obj) {
  benchmark.push({
    id: nextId(),
    query: obj.query,
    gold_intent: obj.gold_intent || null,
    gold_command: obj.gold_command || null,
    acceptable_commands: obj.acceptable_commands || [],
    category: obj.category || null,
    difficulty: obj.difficulty,
    query_type: obj.query_type,
    risk_level: obj.risk_level || "low",
    known_task: obj.known_task !== undefined ? obj.known_task : true,
    ambiguity: obj.ambiguity || false,
    requires_rejection: obj.requires_rejection || false,
    source_intent_id: obj.source_intent_id !== undefined ? obj.source_intent_id : null,
    notes: obj.notes || null,
    annotation_status: "needs_review"
  });
}

// Helper to find corpus entry by idx
function c(idx) { return corpus[idx]; }

// =====================================================================
// CATEGORY A: CANONICAL / DIRECT QUERIES (25)
// Queries that closely match verbatim intents across many categories
// =====================================================================

// git
addQuery({ query: "undo last git commit but keep changes", gold_intent: c(0).intent, gold_command: c(0).command, category: "git", difficulty: "easy", query_type: "canonical", risk_level: "medium", source_intent_id: 0 });
addQuery({ query: "show git status of current repository", gold_intent: c(23).intent, gold_command: c(23).command, category: "git", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 23 });

// docker
addQuery({ query: "list all running docker containers", gold_intent: c(7).intent, gold_command: c(7).command, category: "docker", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 7 });

// npm
addQuery({ query: "install npm packages from package.json", gold_intent: c(10).intent, gold_command: c(10).command, category: "npm", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 10 });

// filesystem
addQuery({ query: "list all files including hidden", gold_intent: c(101).intent, gold_command: c(101).command, category: "filesystem", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 101 });
addQuery({ query: "create a new directory", gold_intent: c(102).intent, gold_command: c(102).command, category: "filesystem", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 102 });

// network
addQuery({ query: "ping a host to check connectivity", gold_intent: c(128).intent, gold_command: c(128).command, category: "network", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 128 });

// process
addQuery({ query: "show all running processes", gold_intent: c(139).intent, gold_command: c(139).command, category: "process", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 139 });
addQuery({ query: "kill a process by name", gold_intent: c(14).intent, gold_command: c(14).command, category: "process", difficulty: "easy", query_type: "canonical", risk_level: "medium", source_intent_id: 14 });

// shell
addQuery({ query: "set an environment variable", gold_intent: c(172).intent, gold_command: c(172).command, category: "shell", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 172 });
addQuery({ query: "show command history", gold_intent: c(177).intent, gold_command: c(177).command, category: "shell", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 177 });

// ssh
addQuery({ query: "connect to a remote server via ssh", gold_intent: c(3).intent, gold_command: c(3).command, category: "ssh", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 3 });

// pip
addQuery({ query: "install pip package", gold_intent: c(93).intent, gold_command: c(93).command, category: "pip", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 93 });

// curl
addQuery({ query: "download a file from a url", gold_intent: c(5).intent, gold_command: c(5).command, category: "curl", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 5 });

// find
addQuery({ query: "find large files bigger than 100mb", gold_intent: c(12).intent, gold_command: c(12).command, category: "find", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 12 });

// permissions
addQuery({ query: "check current user", gold_intent: c(123).intent, gold_command: c(123).command, category: "permissions", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 123 });

// kubernetes
addQuery({ query: "show all kubernetes pods in all namespaces", gold_intent: c(249).intent, gold_command: c(249).command, category: "kubernetes", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 249 });

// security
addQuery({ query: "generate a random password", gold_intent: c(222).intent, gold_command: c(222).command, category: "security", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 222 });

// disk
addQuery({ query: "show total disk space", gold_intent: c(153).intent, gold_command: c(153).command, category: "disk", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 153 });

// system
addQuery({ query: "show os and kernel version", gold_intent: c(211).intent, gold_command: c(211).command, category: "system", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 211 });

// encoding
addQuery({ query: "generate a sha256 checksum", gold_intent: c(171).intent, gold_command: c(171).command, category: "encoding", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 171 });

// awk
addQuery({ query: "extract column from csv with awk", gold_intent: c(161).intent, gold_command: c(161).command, category: "awk", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 161 });

// aws
addQuery({ query: "list all s3 buckets in the aws account", gold_intent: c(269).intent, gold_command: c(269).command, category: "aws", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 269 });

// jq
addQuery({ query: "extract a specific field from json output using jq", gold_intent: c(258).intent, gold_command: c(258).command, category: "jq", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 258 });

// terminal
addQuery({ query: "start a new tmux session", gold_intent: c(196).intent, gold_command: c(196).command, category: "terminal", difficulty: "easy", query_type: "canonical", risk_level: "low", source_intent_id: 196 });

// =====================================================================
// CATEGORY B: NATURAL PARAPHRASES (25)
// Same task, moderate vocabulary variation
// =====================================================================

addQuery({ query: "revert my last commit without losing work", gold_intent: c(0).intent, gold_command: c(0).command, category: "git", difficulty: "medium", query_type: "paraphrase", risk_level: "medium", source_intent_id: 0 });
addQuery({ query: "show me all docker containers that are currently active", gold_intent: c(7).intent, gold_command: c(7).command, category: "docker", difficulty: "medium", query_type: "paraphrase", source_intent_id: 7 });
addQuery({ query: "install all project dependencies with npm", gold_intent: c(10).intent, gold_command: c(10).command, category: "npm", difficulty: "medium", query_type: "paraphrase", source_intent_id: 10 });
addQuery({ query: "search for a text string in all files in the directory tree", gold_intent: c(52).intent, gold_command: c(52).command, category: "grep", difficulty: "medium", query_type: "paraphrase", source_intent_id: 52 });
addQuery({ query: "see which git branches exist", gold_intent: c(30).intent, gold_command: c(30).command, category: "git", difficulty: "medium", query_type: "paraphrase", risk_level: "low", source_intent_id: 30 });
addQuery({ query: "create a new folder", gold_intent: c(102).intent, gold_command: c(102).command, category: "filesystem", difficulty: "medium", query_type: "paraphrase", source_intent_id: 102 });
addQuery({ query: "check what ports my machine is listening on", gold_intent: c(15).intent, gold_command: c(15).command, category: "network", difficulty: "medium", query_type: "paraphrase", source_intent_id: 15 });
addQuery({ query: "display all environment variables", gold_intent: c(174).intent, gold_command: c(174).command, category: "shell", difficulty: "medium", query_type: "paraphrase", source_intent_id: 174 });
addQuery({ query: "find python scripts that were edited recently", gold_intent: c(1).intent, gold_command: c(1).command, category: "find", difficulty: "medium", query_type: "paraphrase", source_intent_id: 1 });
addQuery({ query: "save the current changes for later without committing", gold_intent: c(28).intent, gold_command: c(28).command, category: "git", difficulty: "medium", query_type: "paraphrase", risk_level: "low", source_intent_id: 28 });
addQuery({ query: "copy a whole directory to another location", gold_intent: c(104).intent, gold_command: c(104).command, category: "filesystem", difficulty: "medium", query_type: "paraphrase", source_intent_id: 104 });
addQuery({ query: "look up what python libraries I have", gold_intent: c(95).intent, gold_command: c(95).command, category: "pip", difficulty: "medium", query_type: "paraphrase", source_intent_id: 95 });
addQuery({ query: "merge feature branch into main", gold_intent: c(33).intent, gold_command: c(33).command, category: "git", difficulty: "medium", query_type: "paraphrase", risk_level: "medium", source_intent_id: 33 });
addQuery({ query: "get inside a running docker container shell", gold_intent: c(64).intent, gold_command: c(64).command, category: "docker", difficulty: "medium", query_type: "paraphrase", source_intent_id: 64 });
addQuery({ query: "launch docker services defined in the compose file", gold_intent: c(69).intent, gold_command: c(69).command, category: "docker", difficulty: "medium", query_type: "paraphrase", source_intent_id: 69 });
addQuery({ query: "generate an ssh key", gold_intent: c(21).intent, gold_command: c(21).command, category: "ssh", difficulty: "medium", query_type: "paraphrase", source_intent_id: 21 });
addQuery({ query: "send a POST request to an API endpoint", gold_intent: c(6).intent, gold_command: c(6).command, category: "curl", difficulty: "medium", query_type: "paraphrase", source_intent_id: 6 });
addQuery({ query: "compress a directory into a zip file", gold_intent: c(165).intent, gold_command: c(165).command, category: "archive", difficulty: "medium", query_type: "paraphrase", source_intent_id: 165 });
addQuery({ query: "terminate a process using its PID", gold_intent: c(141).intent, gold_command: c(141).command, category: "process", difficulty: "medium", query_type: "paraphrase", risk_level: "medium", source_intent_id: 141 });
addQuery({ query: "see the differences before staging my changes", gold_intent: c(35).intent, gold_command: c(35).command, category: "git", difficulty: "medium", query_type: "paraphrase", risk_level: "low", source_intent_id: 35 });
addQuery({ query: "convert mkv video to mp4", gold_intent: c(262).intent, gold_command: c(262).command, category: "ffmpeg", difficulty: "medium", query_type: "paraphrase", source_intent_id: 262 });
addQuery({ query: "check how much RAM is being used", gold_intent: c(143).intent, gold_command: c(143).command, category: "process", difficulty: "medium", query_type: "paraphrase", source_intent_id: 143 });
addQuery({ query: "create a shortcut command alias", gold_intent: c(176).intent, gold_command: c(176).command, category: "shell", difficulty: "medium", query_type: "paraphrase", source_intent_id: 176 });
addQuery({ query: "what npm packages have newer versions available", gold_intent: c(89).intent, gold_command: c(89).command, category: "npm", difficulty: "medium", query_type: "paraphrase", source_intent_id: 89 });
addQuery({ query: "check the SSL certificate for a website", gold_intent: c(225).intent, gold_command: c(225).command, category: "security", difficulty: "medium", query_type: "paraphrase", source_intent_id: 225 });

// =====================================================================
// CATEGORY C: LOW LEXICAL-OVERLAP PARAPHRASES (15)
// Substantially different vocabulary, same task
// =====================================================================

addQuery({ query: "I want to go back one version in my repo but not lose anything", gold_intent: c(0).intent, gold_command: c(0).command, category: "git", difficulty: "hard", query_type: "low_overlap_paraphrase", risk_level: "medium", source_intent_id: 0 });
addQuery({ query: "how much storage is left on my drives", gold_intent: c(153).intent, gold_command: c(153).command, category: "disk", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 153 });
addQuery({ query: "what services are accepting connections right now", gold_intent: c(15).intent, gold_command: c(15).command, category: "network", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 15 });
addQuery({ query: "grab the newest version of a github project", gold_intent: c(37).intent, gold_command: c(37).command, category: "git", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 37 });
addQuery({ query: "put my uncommitted work aside temporarily", gold_intent: c(28).intent, gold_command: c(28).command, category: "git", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 28 });
addQuery({ query: "who am I logged in as", gold_intent: c(123).intent, gold_command: c(123).command, category: "permissions", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 123 });
addQuery({ query: "is my server reachable from here", gold_intent: c(128).intent, gold_command: c(128).command, category: "network", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 128 });
addQuery({ query: "what commands did I type earlier", gold_intent: c(177).intent, gold_command: c(177).command, category: "shell", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 177 });
addQuery({ query: "get a quick summary of processor specs", gold_intent: c(144).intent, gold_command: c(144).command, category: "process", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 144 });
addQuery({ query: "where is python installed on this machine", gold_intent: c(190).intent, gold_command: c(190).command, category: "shell", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 190 });
addQuery({ query: "take the audio out of this movie file", gold_intent: c(263).intent, gold_command: c(263).command, category: "ffmpeg", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 263 });
addQuery({ query: "am I running the latest packages", gold_intent: c(89).intent, gold_command: c(89).command, category: "npm", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 89, notes: "Very low overlap with 'check for outdated npm packages'" });
addQuery({ query: "secure this file so only I can read and write it", gold_intent: c(121).intent, gold_command: c(121).command, category: "permissions", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 121 });
addQuery({ query: "how long has this machine been running without a reboot", gold_intent: c(148).intent, gold_command: c(148).command, category: "process", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 148 });
addQuery({ query: "get the hash fingerprint of this file", gold_intent: c(171).intent, gold_command: c(171).command, category: "encoding", difficulty: "hard", query_type: "low_overlap_paraphrase", source_intent_id: 171 });

// =====================================================================
// CATEGORY D: AMBIGUOUS QUERIES (12)
// Queries where multiple commands could satisfy the request
// =====================================================================

addQuery({ query: "delete a branch", gold_intent: c(31).intent, gold_command: c(31).command, category: "git", difficulty: "medium", query_type: "ambiguous", risk_level: "medium", source_intent_id: 31, ambiguity: true, acceptable_commands: [c(31).command, c(32).command], notes: "Could be soft delete (git branch -d) or force delete (git branch -D)" });
addQuery({ query: "view the git log", gold_intent: c(17).intent, gold_command: c(17).command, category: "git", difficulty: "easy", query_type: "ambiguous", source_intent_id: 17, ambiguity: true, acceptable_commands: [c(17).command, c(238).command], notes: "Could be simple oneline log or graph log" });
addQuery({ query: "look up DNS for example.com", gold_intent: c(130).intent, gold_command: c(130).command, category: "network", difficulty: "medium", query_type: "ambiguous", source_intent_id: 130, ambiguity: true, acceptable_commands: [c(130).command, c(131).command], notes: "Could be simple resolution or full record lookup (Type ALL)" });
addQuery({ query: "stop the docker service", gold_intent: c(70).intent, gold_command: c(70).command, category: "docker", difficulty: "medium", query_type: "ambiguous", source_intent_id: 70, ambiguity: true, acceptable_commands: [c(70).command, c(8).command], notes: "Could mean docker compose down or stop all containers" });
addQuery({ query: "rename a file", gold_intent: c(105).intent, gold_command: c(105).command, category: "filesystem", difficulty: "medium", query_type: "ambiguous", source_intent_id: 105, ambiguity: true, notes: "move or rename — same command but ambiguous intent for user" });
addQuery({ query: "find text in files", gold_intent: c(52).intent, gold_command: c(52).command, category: "grep", difficulty: "medium", query_type: "ambiguous", source_intent_id: 52, ambiguity: true, acceptable_commands: [c(52).command, c(2).command], notes: "Could be general grep or TODO-specific search; ambiguous scope" });
addQuery({ query: "remove a docker container", gold_intent: c(65).intent, gold_command: c(65).command, category: "docker", difficulty: "medium", query_type: "ambiguous", risk_level: "medium", source_intent_id: 65, ambiguity: true, acceptable_commands: [c(65).command, c(74).command], notes: "Could be single container or prune all stopped containers" });
addQuery({ query: "replace some text in a file", gold_intent: c(158).intent, gold_command: c(158).command, category: "sed", difficulty: "medium", query_type: "ambiguous", source_intent_id: 158, ambiguity: true, acceptable_commands: [c(158).command, c(18).command], notes: "Could be single file or recursive replacement" });
addQuery({ query: "set up git for this project", gold_intent: c(232).intent, gold_command: c(232).command, category: "git", difficulty: "medium", query_type: "ambiguous", source_intent_id: 232, ambiguity: true, acceptable_commands: [c(232).command, c(234).command, c(235).command], notes: "Could mean add remote, set username, or set email" });
addQuery({ query: "view the file", gold_intent: c(107).intent, gold_command: c(107).command, category: "filesystem", difficulty: "medium", query_type: "ambiguous", source_intent_id: 107, ambiguity: true, acceptable_commands: [c(107).command, c(108).command, c(109).command, c(110).command], notes: "Could be full contents, paginated, head, or tail" });
addQuery({ query: "clean up docker", gold_intent: c(9).intent, gold_command: c(9).command, category: "docker", difficulty: "medium", query_type: "ambiguous", risk_level: "high", source_intent_id: 9, ambiguity: true, acceptable_commands: [c(9).command, c(74).command, c(273).command], notes: "Could prune images, containers, or volumes" });
addQuery({ query: "check git configuration", gold_intent: c(233).intent, gold_command: c(233).command, category: "git", difficulty: "medium", query_type: "ambiguous", source_intent_id: 233, ambiguity: true, acceptable_commands: [c(233).command, c(43).command], notes: "Could be config list or remote URLs" });

// =====================================================================
// CATEGORY E: OOD / UNSUPPORTED QUERIES (15)
// No valid corpus match — system should reject
// =====================================================================

addQuery({ query: "make a cappuccino", gold_intent: null, gold_command: null, category: null, difficulty: "easy", query_type: "ood", known_task: false, requires_rejection: true, notes: "Completely non-technical" });
addQuery({ query: "what is the meaning of life", gold_intent: null, gold_command: null, category: null, difficulty: "easy", query_type: "ood", known_task: false, requires_rejection: true, notes: "Philosophical, no terminal relevance" });
addQuery({ query: "book a flight to Tokyo", gold_intent: null, gold_command: null, category: null, difficulty: "easy", query_type: "ood", known_task: false, requires_rejection: true });
addQuery({ query: "translate this sentence to French", gold_intent: null, gold_command: null, category: null, difficulty: "easy", query_type: "ood", known_task: false, requires_rejection: true });
addQuery({ query: "design a logo for my company", gold_intent: null, gold_command: null, category: null, difficulty: "easy", query_type: "ood", known_task: false, requires_rejection: true });
addQuery({ query: "compile a Rust project with cargo", gold_intent: null, gold_command: null, category: null, difficulty: "hard", query_type: "ood", known_task: false, requires_rejection: true, notes: "Real computing task, but cargo/Rust not in corpus" });
addQuery({ query: "connect to a PostgreSQL database", gold_intent: null, gold_command: null, category: null, difficulty: "hard", query_type: "ood", known_task: false, requires_rejection: true, notes: "Real terminal task, but psql not in corpus" });
addQuery({ query: "create a new React app", gold_intent: null, gold_command: null, category: null, difficulty: "hard", query_type: "ood", known_task: false, requires_rejection: true, notes: "Terminal-adjacent but npx create-react-app not in corpus" });
addQuery({ query: "edit my crontab using vim", gold_intent: null, gold_command: null, category: null, difficulty: "hard", query_type: "ood", known_task: false, requires_rejection: true, notes: "Corpus has crontab but not vim-specific editing" });
addQuery({ query: "set up a Python Flask web server", gold_intent: null, gold_command: null, category: null, difficulty: "hard", query_type: "ood", known_task: false, requires_rejection: true, notes: "Flask not in corpus" });
addQuery({ query: "write a unit test in jest", gold_intent: null, gold_command: null, category: null, difficulty: "hard", query_type: "ood", known_task: false, requires_rejection: true });
addQuery({ query: "play music from the command line", gold_intent: null, gold_command: null, category: null, difficulty: "medium", query_type: "ood", known_task: false, requires_rejection: true, notes: "Plausible terminal task but no media player in corpus" });
addQuery({ query: "scan my network for other devices", gold_intent: null, gold_command: null, category: null, difficulty: "hard", query_type: "ood", known_task: false, requires_rejection: true, notes: "nmap/arp-scan not in corpus; may false-match on 'network'" });
addQuery({ query: "configure nginx reverse proxy", gold_intent: null, gold_command: null, category: null, difficulty: "hard", query_type: "ood", known_task: false, requires_rejection: true, notes: "nginx not in corpus" });
addQuery({ query: "send an email from the terminal", gold_intent: null, gold_command: null, category: null, difficulty: "medium", query_type: "ood", known_task: false, requires_rejection: true });

// =====================================================================
// CATEGORY F: POLYSEMY / LEXICAL CONFUSION (18)
// Words with multiple meanings across corpus domains
// =====================================================================

addQuery({ query: "delete everything on this machine", gold_intent: c(103).intent, gold_command: c(103).command, category: "filesystem", difficulty: "adversarial", query_type: "polysemy", risk_level: "critical", source_intent_id: 103, notes: "Pilot showed this matched curl DELETE. 'delete' is polysemous across HTTP and filesystem" });
addQuery({ query: "remove all files from the current directory", gold_intent: c(103).intent, gold_command: c(103).command, category: "filesystem", difficulty: "adversarial", query_type: "polysemy", risk_level: "critical", source_intent_id: 103, notes: "Pilot showed this matched docker prune. 'remove' exists in docker, filesystem, npm, pip" });
addQuery({ query: "kill the application", gold_intent: c(14).intent, gold_command: c(14).command, category: "process", difficulty: "medium", query_type: "polysemy", risk_level: "medium", source_intent_id: 14, notes: "'kill' appears in process and terminal (tmux) contexts" });
addQuery({ query: "run the test suite", gold_intent: c(84).intent, gold_command: c(84).command, category: "npm", difficulty: "medium", query_type: "polysemy", source_intent_id: 84, notes: "'run' appears in npm, docker, process, shell, ssh, permissions contexts" });
addQuery({ query: "open the config file", gold_intent: c(107).intent, gold_command: c(107).command, category: "filesystem", difficulty: "hard", query_type: "polysemy", source_intent_id: 107, notes: "'open' appears in network (port), shell (manual page), filesystem contexts" });
addQuery({ query: "change the file permissions", gold_intent: c(120).intent, gold_command: c(120).command, category: "permissions", difficulty: "medium", query_type: "polysemy", source_intent_id: 120, notes: "'change' appears in git (changes), permissions, filesystem contexts" });
addQuery({ query: "list the images", gold_intent: c(67).intent, gold_command: c(67).command, category: "docker", difficulty: "medium", query_type: "polysemy", source_intent_id: 67, notes: "'list' + 'images' — images is docker-specific but 'list' spans many categories" });
addQuery({ query: "make a new project", gold_intent: c(92).intent, gold_command: c(92).command, category: "npm", difficulty: "hard", query_type: "polysemy", source_intent_id: 92, notes: "'make' appears in curl (HTTP verbs) and permissions contexts. Pilot showed 'make' matched permissions." });
addQuery({ query: "start the services", gold_intent: c(69).intent, gold_command: c(69).command, category: "docker", difficulty: "medium", query_type: "polysemy", source_intent_id: 69, notes: "'start' appears in docker, terminal, system contexts" });
addQuery({ query: "stop everything running", gold_intent: c(8).intent, gold_command: c(8).command, category: "docker", difficulty: "adversarial", query_type: "polysemy", risk_level: "high", source_intent_id: 8, notes: "'stop' + 'running' — could match docker stop, system service stop, or process kill" });
addQuery({ query: "check the status", gold_intent: c(23).intent, gold_command: c(23).command, category: "git", difficulty: "hard", query_type: "polysemy", source_intent_id: 23, notes: "'status' could be git status, systemd service status, or network status" });
addQuery({ query: "create a new volume", gold_intent: c(271).intent, gold_command: c(271).command, category: "docker", difficulty: "hard", query_type: "polysemy", source_intent_id: 271, notes: "'create' + 'volume' — volume is docker-specific but could confuse with disk" });
addQuery({ query: "show the log", gold_intent: c(17).intent, gold_command: c(17).command, category: "git", difficulty: "hard", query_type: "polysemy", source_intent_id: 17, notes: "'log' appears in git, docker, kubernetes, system contexts", acceptable_commands: [c(17).command, c(63).command, c(203).command] });
addQuery({ query: "set the name", gold_intent: c(234).intent, gold_command: c(234).command, category: "git", difficulty: "hard", query_type: "polysemy", source_intent_id: 234, notes: "'set' + 'name' — could be git username, hostname, or process name" });
addQuery({ query: "install the package", gold_intent: c(85).intent, gold_command: c(85).command, category: "npm", difficulty: "medium", query_type: "polysemy", source_intent_id: 85, notes: "'install' + 'package' — npm, pip, and apt all have install commands" });
addQuery({ query: "show network information", gold_intent: c(133).intent, gold_command: c(133).command, category: "network", difficulty: "medium", query_type: "polysemy", source_intent_id: 133, notes: "'network' could match network stats, docker network, or interface info" });
addQuery({ query: "create a link to the file", gold_intent: c(117).intent, gold_command: c(117).command, category: "filesystem", difficulty: "hard", query_type: "polysemy", source_intent_id: 117, notes: "'link' is filesystem-specific but 'create' spans many domains" });
addQuery({ query: "remove the package", gold_intent: c(87).intent, gold_command: c(87).command, category: "npm", difficulty: "hard", query_type: "polysemy", source_intent_id: 87, notes: "'remove' + 'package' — npm, pip, and apt all have uninstall. Docker also uses 'remove'" });

// =====================================================================
// CATEGORY G: SINGLE-KEYWORD / UNDERSPECIFIED (10)
// =====================================================================

addQuery({ query: "git", gold_intent: null, gold_command: null, category: "git", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "43 possible git commands. Any git command could be valid." });
addQuery({ query: "docker", gold_intent: null, gold_command: null, category: "docker", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "24 possible docker commands." });
addQuery({ query: "ssh", gold_intent: null, gold_command: null, category: "ssh", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "7 possible ssh commands." });
addQuery({ query: "network", gold_intent: null, gold_command: null, category: "network", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "14 possible network commands." });
addQuery({ query: "permissions", gold_intent: null, gold_command: null, category: "permissions", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "9 possible permissions commands." });
addQuery({ query: "process", gold_intent: null, gold_command: null, category: "process", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "16 possible process commands." });
addQuery({ query: "npm packages", gold_intent: null, gold_command: null, category: "npm", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "Two-word underspecified. 11 possible npm commands." });
addQuery({ query: "kubernetes", gold_intent: null, gold_command: null, category: "kubernetes", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "9 possible kubernetes commands." });
addQuery({ query: "files", gold_intent: null, gold_command: null, category: "filesystem", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "Matches across filesystem, find, grep categories." });
addQuery({ query: "curl", gold_intent: null, gold_command: null, category: "curl", difficulty: "adversarial", query_type: "single_keyword", ambiguity: true, notes: "10 possible curl commands." });

// =====================================================================
// CATEGORY H: SAFETY-SENSITIVE (15)
// Commands with destructive or privileged operations
// =====================================================================

addQuery({ query: "remove a directory and its contents", gold_intent: c(103).intent, gold_command: c(103).command, category: "filesystem", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 103 });
addQuery({ query: "wipe all my uncommitted changes and reset to the last commit", gold_intent: c(239).intent, gold_command: c(239).command, category: "git", difficulty: "medium", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 239 });
addQuery({ query: "reset working directory to last commit", gold_intent: c(42).intent, gold_command: c(42).command, category: "git", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 42 });
addQuery({ query: "force delete a local git branch", gold_intent: c(32).intent, gold_command: c(32).command, category: "git", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 32 });
addQuery({ query: "stop all running docker containers", gold_intent: c(8).intent, gold_command: c(8).command, category: "docker", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 8 });
addQuery({ query: "remove all unused docker images", gold_intent: c(9).intent, gold_command: c(9).command, category: "docker", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 9 });
addQuery({ query: "elevate to administrator privileges", gold_intent: c(125).intent, gold_command: c(125).command, category: "permissions", difficulty: "medium", query_type: "safety_sensitive", risk_level: "critical", source_intent_id: 125 });
addQuery({ query: "change file owner", gold_intent: c(119).intent, gold_command: c(119).command, category: "permissions", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 119 });
addQuery({ query: "reboot the system", gold_intent: c(213).intent, gold_command: c(213).command, category: "system", difficulty: "easy", query_type: "safety_sensitive", risk_level: "critical", source_intent_id: 213 });
addQuery({ query: "shut down the system", gold_intent: c(214).intent, gold_command: c(214).command, category: "system", difficulty: "easy", query_type: "safety_sensitive", risk_level: "critical", source_intent_id: 214 });
addQuery({ query: "block an ip address with firewall", gold_intent: c(138).intent, gold_command: c(138).command, category: "network", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 138 });
addQuery({ query: "delete all completed or failed pods in a namespace", gold_intent: c(256).intent, gold_command: c(256).command, category: "kubernetes", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 256 });
addQuery({ query: "purge a package completely including config files", gold_intent: c(219).intent, gold_command: c(219).command, category: "package", difficulty: "medium", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 219 });
addQuery({ query: "set the hostname of this machine", gold_intent: c(201).intent, gold_command: c(201).command, category: "system", difficulty: "medium", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 201 });
addQuery({ query: "remove all unused docker volumes", gold_intent: c(273).intent, gold_command: c(273).command, category: "docker", difficulty: "easy", query_type: "safety_sensitive", risk_level: "high", source_intent_id: 273 });

// =====================================================================
// CATEGORY I: COMPLEX / MULTI-INTENT (15)
// Longer queries with multiple constraints or sub-tasks
// =====================================================================

addQuery({ query: "I need to find all the python files in my project that were changed today, can you help?", gold_intent: c(1).intent, gold_command: c(1).command, category: "find", difficulty: "medium", query_type: "complex_multi_intent", source_intent_id: 1, notes: "Verbose NL wrapping around a single intent" });
addQuery({ query: "search for all lines containing ERROR in the log files and show me the surrounding context", gold_intent: c(55).intent, gold_command: c(55).command, category: "grep", difficulty: "hard", query_type: "complex_multi_intent", source_intent_id: 55, notes: "Combines pattern search with context display" });
addQuery({ query: "deploy my kubernetes cluster to production with rolling updates", gold_intent: c(257).intent, gold_command: c(257).command, category: "kubernetes", difficulty: "hard", query_type: "complex_multi_intent", source_intent_id: 257, notes: "Pilot showed this fails. No rolling update command; closest is kubectl apply" });
addQuery({ query: "show me who changed each line in the README and when they did it", gold_intent: c(39).intent, gold_command: c(39).command, category: "git", difficulty: "medium", query_type: "complex_multi_intent", source_intent_id: 39, notes: "Verbose description of git blame" });
addQuery({ query: "copy my ssh key to the server so I don't have to enter a password", gold_intent: c(228).intent, gold_command: c(228).command, category: "ssh", difficulty: "medium", query_type: "complex_multi_intent", source_intent_id: 228, notes: "Explains the 'why' along with the 'what'" });
addQuery({ query: "find the commit that broke my tests using binary search", gold_intent: c(240).intent, gold_command: c(240).command, category: "git", difficulty: "hard", query_type: "complex_multi_intent", source_intent_id: 240, notes: "'binary search' is a paraphrase for 'bisect'" });
addQuery({ query: "squash my last 5 commits into one before pushing", gold_intent: c(246).intent, gold_command: c(246).command, category: "git", difficulty: "hard", query_type: "complex_multi_intent", risk_level: "high", source_intent_id: 246, notes: "Multi-step intent but maps to single rebase command" });
addQuery({ query: "create a zip archive of this folder and name it backup.zip", gold_intent: c(165).intent, gold_command: c(165).command, category: "archive", difficulty: "medium", query_type: "complex_multi_intent", source_intent_id: 165, notes: "Adds naming constraint to the base intent" });
addQuery({ query: "forward port 8080 on my machine to port 80 on the kubernetes pod", gold_intent: c(251).intent, gold_command: c(251).command, category: "kubernetes", difficulty: "hard", query_type: "complex_multi_intent", source_intent_id: 251 });
addQuery({ query: "set up an SSH tunnel to access a remote database on port 5432", gold_intent: c(229).intent, gold_command: c(229).command, category: "ssh", difficulty: "hard", query_type: "complex_multi_intent", source_intent_id: 229 });
addQuery({ query: "monitor which processes are using the most CPU and sort them", gold_intent: c(20).intent, gold_command: c(20).command, category: "process", difficulty: "medium", query_type: "complex_multi_intent", source_intent_id: 20 });
addQuery({ query: "encrypt this sensitive document so nobody else can read it", gold_intent: c(223).intent, gold_command: c(223).command, category: "security", difficulty: "medium", query_type: "complex_multi_intent", source_intent_id: 223 });
addQuery({ query: "download a large file and resume if the connection drops", gold_intent: c(83).intent, gold_command: c(83).command, category: "curl", difficulty: "hard", query_type: "complex_multi_intent", source_intent_id: 83 });
addQuery({ query: "find which process is hogging port 3000 on my machine", gold_intent: c(277).intent, gold_command: c(277).command, category: "network", difficulty: "hard", query_type: "complex_multi_intent", source_intent_id: 277 });
addQuery({ query: "take a specific file from the feature branch without merging everything", gold_intent: c(247).intent, gold_command: c(247).command, category: "git", difficulty: "hard", query_type: "complex_multi_intent", risk_level: "medium", source_intent_id: 247 });

// =====================================================================
// OUTPUT
// =====================================================================

const output = {
  _meta: {
    name: "TermAssist-Bench v0.1",
    version: "0.1.0",
    description: "Research pilot benchmark for systematic evaluation of the frozen TermAssist BM25 baseline. 150 queries across 9 categories.",
    created_at: new Date().toISOString(),
    baseline_tag: "v1.0-research-baseline",
    platform: "win32",
    corpus_total: 431,
    corpus_filtered: 279,
    total_queries: benchmark.length,
    annotation_status: "needs_review",
    warning: "This benchmark is a draft. All queries have annotation_status='needs_review' and require human verification before use in published results."
  },
  queries: benchmark
};

const outDir = path.join(__dirname, '..', 'datasets');
fs.writeFileSync(path.join(outDir, 'termassist_bench_v0.1.json'), JSON.stringify(output, null, 2));

// CSV
const headers = ['id','query','gold_intent','gold_command','category','difficulty','query_type','risk_level','known_task','ambiguity','requires_rejection','source_intent_id','annotation_status'];
function esc(v) { if (v===null||v===undefined) return ''; const s=String(v); return (s.includes(',')||s.includes('"')||s.includes('\n')) ? '"'+s.replace(/"/g,'""')+'"' : s; }
const csvRows = [headers.join(',')];
for (const q of benchmark) {
  csvRows.push(headers.map(h => esc(q[h])).join(','));
}
fs.writeFileSync(path.join(outDir, 'termassist_bench_v0.1.csv'), csvRows.join('\n') + '\n');

console.log('Generated ' + benchmark.length + ' benchmark queries');
console.log('JSON: research/datasets/termassist_bench_v0.1.json');
console.log('CSV:  research/datasets/termassist_bench_v0.1.csv');

// Print distribution
const typeCounts = {};
const diffCounts = {};
const riskCounts = {};
const catCounts = {};
benchmark.forEach(q => {
  typeCounts[q.query_type] = (typeCounts[q.query_type]||0)+1;
  diffCounts[q.difficulty] = (diffCounts[q.difficulty]||0)+1;
  riskCounts[q.risk_level] = (riskCounts[q.risk_level]||0)+1;
  if (q.category) catCounts[q.category] = (catCounts[q.category]||0)+1;
});
console.log('\nBy query_type:', JSON.stringify(typeCounts));
console.log('By difficulty:', JSON.stringify(diffCounts));
console.log('By risk_level:', JSON.stringify(riskCounts));
console.log('By category:', JSON.stringify(catCounts));
console.log('Known tasks:', benchmark.filter(q=>q.known_task).length);
console.log('Requires rejection:', benchmark.filter(q=>q.requires_rejection).length);
console.log('Ambiguous:', benchmark.filter(q=>q.ambiguity).length);
