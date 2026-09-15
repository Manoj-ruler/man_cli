// Spec §1.4 -- corpus integrity validator. Enforces the constraints and reports the headline
// win32-visible unique-intent count (the true corpus size, per the audit). Non-zero exit on any
// hard-constraint violation.

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
const commands = JSON.parse(fs.readFileSync(path.join(projectRoot, 'cli/data/commands.json'), 'utf-8'));

const OS_VALUES = new Set(['all', 'linux', 'darwin', 'win32']);
const RISK_VALUES = new Set(['low', 'medium', 'high', 'critical']);
const VS_VALUES = new Set(['draft', 'machine_verified', 'human_validated']);

const errors = [], warnings = [];
const idSeen = new Map(), intentOsSeen = new Map(), cmdSeen = new Map();

commands.forEach((c, i) => {
  const at = `#${i} (${c.command_id || 'NO_ID'})`;
  // §1.4.1 unique command_id
  if (!c.command_id) errors.push(`${at}: missing command_id`);
  else { idSeen.set(c.command_id, (idSeen.get(c.command_id) || 0) + 1); }
  // required fields
  if (!c.intent) errors.push(`${at}: missing intent`);
  if (!c.command) errors.push(`${at}: missing command`);
  if (!c.description || !String(c.description).trim()) errors.push(`${at}: empty description (§1.4.4)`);
  if (!c.category) errors.push(`${at}: missing category`);
  // §1.4.3 os non-empty; 'all' not co-occurring
  if (!Array.isArray(c.os) || c.os.length === 0) errors.push(`${at}: os empty (§1.4.3)`);
  else {
    c.os.forEach(o => { if (!OS_VALUES.has(o)) errors.push(`${at}: invalid os '${o}'`); });
    if (c.os.includes('all') && c.os.length > 1) errors.push(`${at}: 'all' co-occurs with specific platform (§1.4.3)`);
  }
  // enums
  if (c.risk_level && !RISK_VALUES.has(c.risk_level)) errors.push(`${at}: invalid risk_level '${c.risk_level}'`);
  if (c.validation_status && !VS_VALUES.has(c.validation_status)) errors.push(`${at}: invalid validation_status`);
  // §1.4.2 unique (intent, sorted(os))
  const ioKey = c.intent + '||' + (Array.isArray(c.os) ? c.os.slice().sort().join(',') : '');
  intentOsSeen.set(ioKey, (intentOsSeen.get(ioKey) || 0) + 1);
  // exact-dup command
  cmdSeen.set(c.command, (cmdSeen.get(c.command) || 0) + 1);
});

[...idSeen.entries()].filter(([, v]) => v > 1).forEach(([k, v]) => errors.push(`duplicate command_id '${k}' (${v}x)`));
[...intentOsSeen.entries()].filter(([, v]) => v > 1).forEach(([k, v]) => errors.push(`duplicate (intent, os) '${k}' (${v}x) (§1.4.2)`));
[...cmdSeen.entries()].filter(([, v]) => v > 1).forEach(([k, v]) => warnings.push(`command string appears ${v}x: '${k}'`));

// headline stats
const winVisible = commands.filter(c => !c.os || c.os.includes('all') || c.os.includes('win32'));
const winIntents = new Set(winVisible.map(c => c.intent)).size;
const uniqueIntents = new Set(commands.map(c => c.intent)).size;
const humanValidated = commands.filter(c => c.validation_status === 'human_validated').length;

console.log('=== CORPUS VALIDATION ===');
console.log(`records: ${commands.length}`);
console.log(`unique intents (all platforms): ${uniqueIntents}`);
console.log(`win32-visible records: ${winVisible.length} | win32-visible unique intents (HEADLINE SIZE): ${winIntents}`);
console.log(`human_validated records: ${humanValidated} / ${commands.length}`);
console.log(`errors: ${errors.length}, warnings: ${warnings.length}`);
errors.slice(0, 20).forEach(e => console.log('  ERROR: ' + e));
warnings.slice(0, 5).forEach(w => console.log('  warn: ' + w));

console.log('\n=== v1.0 CORPUS-FREEZE GATE (A-3) ===');
const gateA3 = winIntents >= 500 && humanValidated === commands.length;
console.log(`  win32-visible unique intents in [500,800]: ${winIntents >= 500 && winIntents <= 800 ? 'PASS' : 'FAIL (' + winIntents + ')'}`);
console.log(`  all records human_validated: ${humanValidated === commands.length ? 'PASS' : 'FAIL (' + humanValidated + '/' + commands.length + ')'}`);
console.log(`  GATE A-3 (corpus freeze): ${gateA3 ? 'PASS' : 'BLOCKED-ON-HUMAN (expansion + human validation required)'}`);

process.exit(errors.length > 0 ? 1 : 0);
