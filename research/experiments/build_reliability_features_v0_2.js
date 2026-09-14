// v0.2 pipeline -- identical logic to build_reliability_features.js, pointed at v0.2's candidates.

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const candPath = path.join(projectRoot, 'research/results/v0.2/candidates.json');
const outPath = path.join(projectRoot, 'research/results/v0.2/reliability_features.json');

const data = JSON.parse(fs.readFileSync(candPath, 'utf-8'));
const hybrid = data.candidates.filter(c => c.system === 'hybrid');

function isMatch(c) {
  const valid = new Set([c.gold_command, ...(c.acceptable_commands || [])].filter(Boolean));
  return valid.has(c.top1_command);
}

const features = hybrid.map(c => ({
  id: c.id, query_type: c.query_type, expected_classification: c.expected_classification,
  margin: c.margin, relative_margin: c.relative_margin, normalized_entropy: c.normalized_entropy,
  top1_score: c.top1_score, hit: isMatch(c),
  is_ood: c.expected_classification === 'OOD', is_ambiguous: c.expected_classification === 'AMBIGUOUS'
}));

fs.writeFileSync(outPath, JSON.stringify({ benchmark_version: 'v0.2', generated_at: new Date().toISOString(), count: features.length, features }, null, 2), 'utf-8');
console.log(`Wrote ${features.length} v0.2 reliability feature rows to ${outPath}`);

function mean(arr, key) { return arr.length ? +(arr.reduce((a, r) => a + r[key], 0) / arr.length).toFixed(4) : null; }
['CORRECT', 'AMBIGUOUS', 'OOD', 'NEEDS_CORRECTION'].forEach(cls => {
  const sub = features.filter(f => f.expected_classification === cls);
  console.log(`${cls} (n=${sub.length}): margin=${mean(sub, 'margin')} rel_margin=${mean(sub, 'relative_margin')} entropy=${mean(sub, 'normalized_entropy')} top1_score=${mean(sub, 'top1_score')}`);
});
