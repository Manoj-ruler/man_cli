// Preload for cli_flow.test.js (TEST-04; approved by the author 2026-09-29). Loaded with
// `node --require stub_exec.js cli/index.js ...`, BEFORE index.js. It replaces:
//   child_process.execSync / exec / spawn / spawnSync / execFile / execFileSync -> recorders (no execution)
//   @inquirer/prompts                                                          -> scripted prompt
//   http.request / https.request                                                -> recorders that throw
// and FAILS CLOSED: if any replacement is not in place it exits 99 before index.js runs.
// Behaviour is set by env: TA_STUB_LOG (JSONL log file, required), TA_STUB_PROMPT (accept|exit|clear),
// TA_STUB_EXEC (ok|throw).
const fs = require('fs');
const Module = require('module');
const LOG = process.env.TA_STUB_LOG;
if (!LOG) { process.stderr.write('stub_exec: TA_STUB_LOG not set\n'); process.exit(99); }
const log = (o) => fs.appendFileSync(LOG, JSON.stringify(o) + '\n');

const cp = require('child_process');
const recorder = (name) => function (...a) {
  log({ kind: 'exec', fn: name, command: typeof a[0] === 'string' ? a[0] : String(a[0]), options: a.find(x => x && typeof x === 'object' && !Array.isArray(x)) || null });
  if (process.env.TA_STUB_EXEC === 'throw') throw new Error('stubbed failure');
  return Buffer.from('');
};
for (const fn of ['execSync', 'exec', 'spawn', 'spawnSync', 'execFile', 'execFileSync']) cp[fn] = recorder(fn);

for (const name of ['http', 'https']) {
  const m = require(name);
  m.request = (...a) => { log({ kind: 'network', module: name }); throw new Error('network blocked by stub'); };
  m.get = m.request;
}

const promptStub = {
  input: async ({ default: def }) => {
    const mode = process.env.TA_STUB_PROMPT || 'accept';
    log({ kind: 'prompt', default: def, mode });
    if (mode === 'exit') { const e = new Error('User force closed the prompt'); e.name = 'ExitPromptError'; throw e; }
    return mode === 'clear' ? '' : def;
  },
  search: async () => { const e = new Error('interactive mode not exercised'); e.name = 'ExitPromptError'; throw e; }
};
const realLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === '@inquirer/prompts') return promptStub;
  return realLoad.apply(this, arguments);
};

// fail-closed self-check
const cp2 = require('child_process');
const ok = ['execSync', 'exec', 'spawn', 'spawnSync', 'execFile', 'execFileSync'].every(fn => cp2[fn].toString().includes('kind: \'exec\''))
  && require('@inquirer/prompts') === promptStub
  && require('https').request.toString().includes('network blocked');
if (!ok) { process.stderr.write('stub_exec: self-check failed\n'); process.exit(99); }
log({ kind: 'stub_ready' });
