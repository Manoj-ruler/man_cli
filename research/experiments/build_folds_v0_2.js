// v0.2 pipeline -- identical logic to build_folds.js, pointed at the v0.2 benchmark (209
// queries: 119 CORRECT, 38 AMBIGUOUS, 50 OOD, 2 NEEDS_CORRECTION) and a separate output tree
// (research/results/v0.2/) so v0.1's frozen fold assignment is never touched. This exists to
// answer whether growing the OOD/ambiguous subsets (Phase 17 decision gate; see
// research/datasets/v0.2_ADJUDICATION_REPORT.md) gives the OOD significance test enough power.

const fs = require('fs');
const path = require('path');

const SEED = 42;
const K = 5;

const projectRoot = path.join(__dirname, '..', '..');
const valJsonPath = path.join(projectRoot, 'research/datasets/termassist_bench_v0.2_validated.json');
const reviewPath = path.join(projectRoot, 'research/datasets/review/human_review_results_v0.2.json');
const outPath = path.join(projectRoot, 'research/results/v0.2/folds.json');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(array, rng) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const lfText = fs.readFileSync(valJsonPath, 'utf-8').replace(/\r\n/g, '\n');
const queries = JSON.parse(lfText).queries;
const reviews = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
const reviewMap = new Map(reviews.map(r => [r.id, r]));

const byClass = {};
queries.forEach(q => {
  const r = reviewMap.get(q.id);
  const cls = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT'));
  if (!byClass[cls]) byClass[cls] = [];
  byClass[cls].push(q.id);
});

const rng = mulberry32(SEED);
const foldAssignment = {};
const foldMembers = Array.from({ length: K }, () => []);

Object.keys(byClass).sort().forEach(cls => {
  const shuffled = seededShuffle(byClass[cls], rng);
  shuffled.forEach((id, i) => {
    const fold = i % K;
    foldAssignment[id] = fold;
    foldMembers[fold].push(id);
  });
});

const summary = {
  benchmark_version: 'v0.2', seed: SEED, k: K,
  method: 'stratified by expected_classification, mulberry32(seed=42) seeded shuffle, round-robin fold assignment within each class',
  class_counts: Object.fromEntries(Object.entries(byClass).map(([k, v]) => [k, v.length])),
  fold_sizes: foldMembers.map(f => f.length),
  fold_class_breakdown: foldMembers.map(members => {
    const counts = {};
    members.forEach(id => {
      const r = reviewMap.get(id);
      const q = queries.find(qq => qq.id === id);
      const cls = r ? r.decision : (q.query_type === 'ood' ? 'OOD' : (q.ambiguity ? 'AMBIGUOUS' : 'CORRECT'));
      counts[cls] = (counts[cls] || 0) + 1;
    });
    return counts;
  }),
  assignment: foldAssignment
};

if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf-8');
console.log(JSON.stringify({ fold_sizes: summary.fold_sizes, fold_class_breakdown: summary.fold_class_breakdown }, null, 2));
console.log(`Wrote v0.2 fold assignment to ${outPath}`);
