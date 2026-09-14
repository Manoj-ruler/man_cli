// Gate check: lexical_search.js must reproduce cli/search.js's search() exactly (command,
// score, confidence-equivalent ordering) before any fusion/hybrid work is allowed to use it.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { search } = require('../../cli/search');
const { lexicalSearchAll } = require('./lexical_search');

const valJsonPath = path.join(__dirname, '..', 'datasets', 'termassist_bench_v0.1_validated.json');
const lfText = fs.readFileSync(valJsonPath, 'utf-8').replace(/\r\n/g, '\n');
const queries = JSON.parse(lfText).queries;
const platform = os.platform();

let mismatches = [];
queries.forEach(q => {
  const prod = search(q.query);
  const replica = lexicalSearchAll(q.query, platform);
  const top1 = replica[0];

  const prodScore = prod.score;
  const replicaScore = top1 ? top1.score : -1;
  const scoreDiff = Math.abs(prodScore - replicaScore);

  if (prod.command !== (top1 ? top1.command : null) || scoreDiff > 1e-9) {
    mismatches.push({ id: q.id, query: q.query, prod: { command: prod.command, score: prodScore }, replica: { command: top1 ? top1.command : null, score: replicaScore } });
  }
});

console.log(`Checked ${queries.length} queries. Mismatches: ${mismatches.length}`);
if (mismatches.length > 0) {
  console.log(JSON.stringify(mismatches.slice(0, 10), null, 2));
  process.exit(1);
} else {
  console.log('PASS: lexical_search.js top-1 output is byte-identical (command + score) to cli/search.js on all benchmark queries.');
}
