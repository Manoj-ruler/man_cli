// E1-12 -- implementation checks on the E1 outputs (TASKS.md E1-12), BEFORE any summary is computed.
// Checks scoring and decision correctness only: it computes no rejection rate, count or comparison.
//
//   node e1_implementation_checks.js --checks [--spot 20]      -> checks 1, 2, 3 and 5
//   node e1_implementation_checks.js --compare-rerun <dir>     -> check 4 (re-run in <dir> vs committed)
//
// Check 5 recomputes s from an independent BM25 implementation written from the formula (not by
// importing cli/search.js or lexical_search.js), and the fused score from independent min-max fusion
// over that BM25 list and the frozen dense module's cosines.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..', '..');
const D = path.join(root, 'research/results/e1_clinc150_v1');
const rj = p => JSON.parse(fs.readFileSync(p, 'utf-8'));
const out = { checks: [] };
const record = (id, name, pass, detail) => { out.checks.push({ id, name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${id} ${name}${detail ? '  ' + JSON.stringify(detail) : ''}`); };

function load() {
  const L = {};
  for (const p of ['p1', 'p2']) {
    L[p] = { data: rj(path.join(D, `data/${p}_queries.json`)), scores: rj(path.join(D, `scores_${p}.json`)).rows, dec: rj(path.join(D, `decisions_${p}.json`)).rows };
  }
  return L;
}

// §6.2, re-written independently of e1_analyze.js decide()
const R2_T = [6.4952, 6.4952, 6.4952, 7.1978, 6.4952], R3_U = [0.9179, 0.9219, 0.8841, 0.9247, 0.9219];
function expectDecision(r) {
  return {
    id: r.id, R1: r.s < 2.0, R1_CLI: r.confidence < 30 || r.command_shipped === null,
    R2: r.s4 < 6.4952, R3: r.fused4 < 0.9219,
    R2_fold: R2_T.map(t => r.s4 < t), R3_fold: R3_U.map(u => r.fused4 < u),
    R2m: r.s4 < 5.4377, R3m: r.fused4 < 0.9179
  };
}

// independent BM25 (cli/search.js semantics, written from the formula)
function makeBM25() {
  const stop = new Set(['how', 'to', 'do', 'i', 'a', 'an', 'the', 'is', 'in', 'and', 'for', 'of', 'with', 'on', 'can', 'you']);
  const tok = t => t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(w => w && !stop.has(w));
  const vis = c => !c.os || c.os.includes('all') || c.os.includes('win32');
  const recs = rj(path.join(root, 'cli/data/commands.json')).filter(vis).concat(rj(path.join(root, 'cli/data/custom_snippets.json')).filter(vis));
  const docs = recs.map(c => tok(`${c.intent} ${c.category || ''} ${c.description || ''}`));
  const N = docs.length, df = new Map();
  docs.forEach(d => new Set(d).forEach(t => df.set(t, (df.get(t) || 0) + 1)));
  const lens = docs.map(d => d.length), avgdl = lens.reduce((a, b) => a + b, 0) / N;
  const tf = docs.map(d => d.reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map()));
  return function score(q, explain) {
    const qt = [...new Set(tok(q))], cq = q.toLowerCase().replace(/[^a-z0-9]/g, '');
    const list = recs.map((c, i) => {
      let s = 0; const parts = [];
      for (const t of qt) {
        const f = tf[i].get(t); if (!f) continue;
        const idf = Math.log(1 + (N - df.get(t) + 0.5) / (df.get(t) + 0.5));
        const c1 = idf * (f * 2.2) / (f + 1.2 * (1 - 0.75 + 0.75 * lens[i] / avgdl));
        s += c1; parts.push({ token: t, tf: f, df: df.get(t), idf: +idf.toFixed(6), contribution: +c1.toFixed(6) });
      }
      const ci = c.intent.toLowerCase().replace(/[^a-z0-9]/g, '');
      const bonus = ci.includes(cq) || cq.includes(ci);
      if (bonus) s += 15;
      return { command: c.command, score: s, bonus, parts };
    });
    const top = qt.length === 0 ? 0 : Math.max(...list.map(x => x.score)); // shipped: empty-token guard returns 0
    return { tokens: qt.length, top, list, N, avgdl };
  };
}

async function checks(spotN) {
  const L = load();
  // 1. row counts and id correspondence
  for (const [p, n] of [['p1', 4500], ['p2', 1000]]) {
    const { data, scores, dec } = L[p];
    const same = data.length === n && scores.length === n && dec.length === n && data.every((r, i) => r.id === scores[i].id && r.id === dec[i].id);
    record('1', `${p}: ${n} rows in data, scores and decisions, ids one-to-one in the same order`, same, { data: data.length, scores: scores.length, decisions: dec.length });
  }
  // 2. no NaN / missing scores
  for (const p of ['p1', 'p2']) {
    const bad = L[p].scores.filter(r => !['s', 's4', 'confidence', 'fused', 'fused4', 'n_tokens', 'lexical_top1_score', 'dense_top1'].every(k => typeof r[k] === 'number' && Number.isFinite(r[k]))
      || typeof r.lexical_all_equal !== 'boolean' || typeof r.bonus_fired !== 'boolean'
      || (r.command_shipped === null) !== (r.n_tokens === 0) || typeof r.command_hybrid !== 'string');
    record('2', `${p}: no NaN, missing or ill-typed score field; command_shipped null iff no tokens`, bad.length === 0, { bad: bad.length });
  }
  // 3a. fresh call of the frozen shipped search() on every query
  const { search } = require('../../cli/search');
  for (const p of ['p1', 'p2']) {
    let mism = 0; const ex = [];
    L[p].data.forEach((q, i) => {
      const r = search(q.text), st = L[p].scores[i];
      if (r.score !== st.s || r.confidence !== st.confidence || r.command !== st.command_shipped) { mism++; if (ex.length < 3) ex.push(q.id); }
    });
    record('3a', `${p}: fresh cli/search.js search() equals stored s (bit-exact), confidence and command on every query`, mism === 0, { mismatches: mism, examples: ex });
  }
  // 3b. rounding and decisions re-derived
  for (const p of ['p1', 'p2']) {
    const S = L[p].scores;
    const round = S.filter(r => r.s4 !== +r.s.toFixed(4) || r.fused4 !== +r.fused.toFixed(4)).length;
    record('3b', `${p}: s4 and fused4 equal +x.toFixed(4) of the stored unrounded values`, round === 0, { mismatches: round });
    const dm = L[p].dec.filter((d, i) => JSON.stringify(d) !== JSON.stringify(expectDecision(S[i]))).length;
    record('3c', `${p}: stored decisions equal an independent re-application of protocol §6.2`, dm === 0, { mismatches: dm });
  }
  // 5. spot check: 20 rows drawn with a fixed seed over the 5,500 ids
  const all = [...L.p1.data.map((q, i) => ['p1', i]), ...L.p2.data.map((q, i) => ['p2', i])];
  let seed = 20260930; const rng = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const picks = []; const seen = new Set();
  while (picks.length < spotN) { const k = Math.floor(rng() * all.length); if (!seen.has(k)) { seen.add(k); picks.push(all[k]); } }
  execFileSync(process.execPath, [path.join(__dirname, 'check_model_cache.js')], { stdio: 'pipe' });
  const { env } = await import('@xenova/transformers'); env.allowRemoteModels = false;
  const { denseSearch } = require('./dense_search');
  const bm25 = makeBM25();
  const mm = xs => { const lo = Math.min(...xs), hi = Math.max(...xs), r = hi - lo; return x => (r > 1e-9 ? (x - lo) / r : 0); };
  const spot = [];
  for (const [p, i] of picks) {
    const q = L[p].data[i], st = L[p].scores[i];
    const b = bm25(q.text, spot.length < 2);
    const dres = await denseSearch(q.text, { platform: 'win32' });
    const dense = new Map(dres._scored.map(x => [x.entry.command, x.sim]));
    const nl = mm(b.list.map(x => x.score)), nd = mm([...dense.values()]);
    const fusedAll = b.list.map(x => 0.5 * nl(x.score) + 0.5 * (dense.has(x.command) ? nd(dense.get(x.command)) : 0));
    const fused = Math.max(...fusedAll);
    const row = { id: q.id, tokens: b.tokens, s_independent: b.top, s_stored: st.s, s_diff: Math.abs(b.top - st.s), fused_independent: fused, fused_stored: st.fused, fused_diff: Math.abs(fused - st.fused) };
    if (spot.length < 2) { const topRec = b.list.reduce((a, x) => (x.score > a.score ? x : a)); row.worked_example = { N: b.N, avgdl: +b.avgdl.toFixed(6), top_record_bonus: topRec.bonus, top_record_terms: topRec.parts }; }
    spot.push(row);
  }
  const tol = 1e-9;
  const spotBad = spot.filter(r => r.s_diff > tol || r.fused_diff > tol);
  record('5', `spot check of ${spotN} rows (seed 20260930): independent BM25 s and independent fusion equal the stored values (tolerance 1e-9)`, spotBad.length === 0,
    { rows: spot.length, max_s_diff: Math.max(...spot.map(r => r.s_diff)), max_fused_diff: Math.max(...spot.map(r => r.fused_diff)), failing: spotBad.map(r => r.id) });
  out.spot = spot;
  return out;
}

function compareRerun(dir) {
  const strip = o => JSON.stringify(o, (k, v) => (['generated_at', 'started', 'finished'].includes(k) ? undefined : v));
  for (const f of ['scores_p1.json', 'scores_p2.json', 'logical_checks.json']) {
    const a = rj(path.join(D, f)), b = rj(path.join(dir, f));
    record('4', `re-run ${f} identical apart from timestamps`, strip(a) === strip(b));
  }
  for (const f of ['decisions_p1.json', 'decisions_p2.json']) {
    record('4', `re-run ${f} byte-identical`, fs.readFileSync(path.join(D, f)).equals(fs.readFileSync(path.join(dir, f))));
  }
  const a = rj(path.join(D, 'RUN_MANIFEST.json')), b = rj(path.join(dir, 'RUN_MANIFEST.json'));
  const keep = m => strip({ ...m, commit: undefined, input_files_sha256: undefined });
  record('4', 'RUN_MANIFEST.json identical apart from timestamps, commit and input-file paths/hashes of the re-run copies', keep(a) === keep(b));
  return out;
}

(async () => {
  const args = process.argv.slice(2);
  const res = args.includes('--compare-rerun') ? compareRerun(args[args.indexOf('--compare-rerun') + 1]) : await checks(+(args.includes('--spot') ? args[args.indexOf('--spot') + 1] : 20));
  const outFile = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
  if (outFile) fs.writeFileSync(outFile, JSON.stringify(res, null, 2), 'utf-8');
  const failed = res.checks.filter(c => !c.pass).length;
  console.log(failed ? `\n${failed} CHECK(S) FAILED` : `\nall ${res.checks.length} checks pass`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
