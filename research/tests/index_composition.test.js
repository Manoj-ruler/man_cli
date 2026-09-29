// TEST-03: what the shipped index contains on each platform. searchMany('') returns every indexed
// record in order (cli/search.js:139-143), so its length is the index size. os.platform is stubbed at
// call time (buildIndex reads it on every call) and restored after each case.
const test = require('node:test');
const assert = require('node:assert');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { searchMany } = require(path.join(ROOT, 'cli/search.js'));
const corpus = require(path.join(ROOT, 'cli/data/commands.json'));
const snippets = require(path.join(ROOT, 'cli/data/custom_snippets.json'));
const visible = (r, p) => !r.os || r.os.includes('all') || r.os.includes(p);

function indexOn(platform, t) {
  const real = os.platform;
  os.platform = () => platform;
  t.after(() => { os.platform = real; });
  return searchMany('', 1e6).map(x => x.value);
}

for (const p of ['win32', 'linux', 'darwin']) {
  test(`index on ${p} = visible corpus records + packaged snippets`, (t) => {
    const got = indexOn(p, t);
    const want = [...corpus.filter(r => visible(r, p)), ...snippets.filter(r => visible(r, p))].map(r => r.command);
    assert.deepStrictEqual(got, want);
    if (p === 'win32') {
      assert.strictEqual(got.length, 280);                         // paper §3: 279 corpus records + 1 snippet
      assert.ok(got.includes('killall -9 node'));                  // the packaged snippet (no os field)
    } else {
      const win32Only = new Set(corpus.filter(r => r.os && !r.os.includes('all') && !r.os.includes(p)).map(r => r.command));
      assert.ok(got.every(c => !win32Only.has(c) || corpus.some(r => r.command === c && visible(r, p))));
    }
  });
}
