// Spec §1 -- ADDITIVE, backward-compatible corpus schema migration. Adds command_id, risk_level,
// source, validation_status to every existing record WITHOUT changing any existing field's value.
// Reproducible (not a hand-edit). buildIndex() ignores unknown fields, so production behavior is
// unchanged -- proven by reproduce_baseline.js afterward (gate A-1).
//
// HONESTY CONSTRAINTS (do not overstate provenance):
//  - source = "curated-v0:legacy" for all existing records (they predate the §2.4 provenance rule).
//  - validation_status = "machine_verified" for all -- NOT "human_validated". These records have
//    NOT passed the v1.0 §2 human-validation gate. Therefore this migration satisfies the SCHEMA
//    gate only; the corpus-freeze gate A-3 (human_validated + 500-800 intents) remains BLOCKED.
//  - risk_level: propagated from the benchmark's HUMAN-adjudicated final_risk_level where the
//    command appears as a benchmark gold (111 commands); otherwise machine-derived (rule
//    classifier) and flagged provisional in the manifest. Machine-derived corpus risk_level MUST
//    NOT be used as safety-evaluation ground truth (§7.2 independent safety set remains the source).

const fs = require('fs');
const path = require('path');
const { classify } = require('./safety_classifier');

const projectRoot = path.join(__dirname, '..', '..');
const cmdPath = path.join(projectRoot, 'cli/data/commands.json');
const reviewPath = path.join(projectRoot, 'research/datasets/review/human_review_results_v0.2.json');

const commands = JSON.parse(fs.readFileSync(cmdPath, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));

// human risk map: command string -> final_risk_level (lowercased)
const humanRisk = new Map();
reviews.forEach(r => { if (r.final_gold_command && r.final_risk_level) humanRisk.set(r.final_gold_command, String(r.final_risk_level).toLowerCase()); });

let humanCount = 0, machineCount = 0;
const migrated = commands.map((c, i) => {
  const id = 'tac-' + String(i + 1).padStart(4, '0');
  let risk;
  if (humanRisk.has(c.command)) { risk = humanRisk.get(c.command); humanCount++; }
  else { risk = classify(c.command).tier.toLowerCase(); machineCount++; }
  // spec §1.1 field order; existing values copied verbatim
  return {
    command_id: id,
    intent: c.intent,
    command: c.command,
    category: c.category,
    os: c.os,
    description: c.description,
    risk_level: risk,
    source: 'curated-v0:legacy',
    validation_status: 'machine_verified'
  };
});

// sanity: existing fields unchanged
for (let i = 0; i < commands.length; i++) {
  const a = commands[i], b = migrated[i];
  if (a.intent !== b.intent || a.command !== b.command || a.category !== b.category || a.description !== b.description || JSON.stringify(a.os) !== JSON.stringify(b.os)) {
    console.error('FATAL: existing field changed at index ' + i); process.exit(1);
  }
}

fs.writeFileSync(cmdPath, JSON.stringify(migrated, null, 2) + '\n', 'utf-8');
console.log(`Migrated ${migrated.length} records.`);
console.log(`risk_level: ${humanCount} from human benchmark adjudication, ${machineCount} machine-derived (provisional).`);
console.log('All existing field values preserved verbatim; command_id/risk_level/source/validation_status added.');
