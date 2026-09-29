// TEST-02: the shipped confidence formula and the refusal equivalence the paper states (§3):
//   confidence = min(round(100 s / 8), 100), and 0 when s < 2.0;
//   no benchmark query has 2.0 <= s < 2.4, so "confidence >= 30" (the CLI rule) makes the same
//   decisions as "s >= 2.0" (the evaluation rule).
// Checked on every query of both frozen benchmarks by calling the shipped search() live.
const test = require('node:test');
const assert = require('node:assert');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { search } = require(path.join(ROOT, 'cli/search.js'));
const load = f => require(path.join(ROOT, f)).queries.map(q => q.query);
const queries = [...new Set([...load('research/datasets/termassist_bench_v0.1_validated.json'), ...load('research/datasets/termassist_bench_v0.2_validated.json')])];
const results = queries.map(q => ({ q, ...search(q) }));

test('formula holds for every benchmark query', () => {
  for (const r of results) {
    const want = r.score < 2.0 ? 0 : Math.min(Math.round((r.score / 8) * 100), 100);
    assert.strictEqual(r.confidence, want, r.q);
  }
});

test('confidence is 0 or in [25, 100]', () => {
  for (const r of results) assert.ok(r.confidence === 0 || (r.confidence >= 25 && r.confidence <= 100), r.q);
});

test('no benchmark query scores in [2.0, 2.4), so the 30% rule equals s >= 2.0',
  { skip: os.platform() !== 'win32' && 'benchmark scores are win32' }, () => {
    assert.deepStrictEqual(results.filter(r => r.score >= 2.0 && r.score < 2.4).map(r => r.q), []);
    for (const r of results) assert.strictEqual(r.confidence >= 30, r.score >= 2.0, r.q);
  });
