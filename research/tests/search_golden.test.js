// TEST-01 (research/task_plan/TASK_BACKLOG.md): golden retrieval tests for the shipped cli/search.js.
// Expected values are read at run time from the frozen reproduction file, never hand-typed.
// Win32 only: the frozen values were produced on win32 (the corpus view is platform-filtered).
const test = require('node:test');
const assert = require('node:assert');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { search } = require(path.join(ROOT, 'cli/search.js'));
const frozen = new Map(require(path.join(ROOT, 'research/results/v0.2/reproduction-results.json')).map(r => [r.id, r]));
const WIN = os.platform() === 'win32';

// TA-B001 exact intent (bonus), TA-B105 ambiguous "show the log", TA-B187 "tar" (bonus-only score),
// TA-B194 "system" (sudo reboot at 100), TA-B159 out-of-scope request refused
for (const id of ['TA-B001', 'TA-B105', 'TA-B187', 'TA-B194', 'TA-B159']) {
  test(`golden ${id}`, { skip: !WIN && 'frozen values are win32' }, () => {
    const f = frozen.get(id);
    const r = search(f.query);
    assert.strictEqual(r.command, f.actual.command);
    assert.strictEqual(+r.score.toFixed(4), f.actual.score);
    assert.strictEqual(r.confidence, f.actual.confidence);
  });
}

for (const q of ['', '!!!', '¿cómo listar los archivos?']) {
  test(`no usable tokens -> confidence 0: ${JSON.stringify(q)}`, () => {
    const r = search(q);
    assert.strictEqual(r.confidence, 0);
    assert.ok(r.score < 2.0);
  });
}

test('deterministic: two calls give identical results', () => {
  const qs = [...frozen.values()].slice(0, 40).map(r => r.query);
  assert.deepStrictEqual(qs.map(search), qs.map(search));
});
