// E1-06 (research/publication_tasks/e1/E1_SCORING_DESIGN.md §5) -- scores plain-text queries
// exactly as the frozen v0.2 pipeline scored the benchmark, for the external OOD check (E1).
//
//   s      : shipped cli/search.js search(text).score (R1, R1-CLI, R2), imported read-only as in
//            reproduce_baseline_v0_2.js:11
//   fused  : fuseQuery({lexical, dense}, 0.5) top-1 over the FULL candidate lists (R3), built as in
//            build_query_scores_v0_2.js:30-35 and build_candidates_v0_2.js:69
//   s4, fused4 : +x.toFixed(4), the rounding the thresholds were tuned on
//
// Records scores only -- no rule decisions (those are applied from the frozen thresholds in E1-10).
// Writes nothing except the --out file. Imports only function-exporting modules (no build/run
// scripts, which write results on require).
//
//   node e1_score_queries.js --guard --out <file>              -> 209 v0.2 queries; 0 mismatches or exit 1
//   node e1_score_queries.js --edge --out <file>               -> synthetic edge cases (design §4 risk 3)
//   node e1_score_queries.js --input <[{id,text}] json> --out <file>
//
// Pre-flight (abort on failure): platform win32; SHA-256 of the three scoring inputs; model cache;
// alpha = 0.5 in all five v0.2 folds.

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const { search } = require('../../cli/search');
const { lexicalSearchAll, tokenize } = require('./lexical_search');
const { denseSearch } = require('./dense_search');
const { fuseQuery } = require('./hybrid_fusion');

const projectRoot = path.join(__dirname, '..', '..');
const PLATFORM = 'win32';
const ALPHA = 0.5;
const TOL = 1e-9;

// Recorded 2026-09-30 in E1_SCORING_DESIGN.md §3 (LF-normalized; identical to the raw bytes).
const INPUT_SHA256 = {
  'cli/data/commands.json': 'cc5217af4f76dd03d7c2f8075951142017508b795f5e01b88c8a4fa7f72e06ea',
  'cli/data/custom_snippets.json': '1f7d5e32407b665c28de7d5515c09062498fb52c498f3003c91ee147436a217a',
  'research/models/corpus_embeddings.json': '7b8f198ff20b6cf0e6f5f2180404f6f2ac261745551e55ac3a14dfc1afdcb7d1'
};

const readJson = rel => JSON.parse(fs.readFileSync(path.join(projectRoot, rel), 'utf-8').replace(/\r\n/g, '\n'));
const r4 = x => +x.toFixed(4);

async function preflight() {
  const problems = [];
  if (os.platform() !== PLATFORM) problems.push(`platform is ${os.platform()}, expected ${PLATFORM}`);
  for (const [rel, want] of Object.entries(INPUT_SHA256)) {
    const text = fs.readFileSync(path.join(projectRoot, rel), 'utf-8').replace(/\r\n/g, '\n');
    const got = crypto.createHash('sha256').update(text).digest('hex');
    if (got !== want) problems.push(`${rel}: sha256 ${got.slice(0, 16)}..., expected ${want.slice(0, 16)}...`);
  }
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'check_model_cache.js')], { stdio: 'pipe' });
  } catch (e) { problems.push(`model cache check failed: ${String(e.stderr || e.message).trim().split('\n')[0]}`); }
  const hy = readJson('research/results/v0.2/hybrid-nested-cv-results.json');
  const alphas = hy.per_fold_results.map(f => f.selected_alpha);
  if (alphas.length !== 5 || alphas.some(a => a !== ALPHA)) problems.push(`v0.2 per-fold alpha is [${alphas}], expected all ${ALPHA}`);
  if (problems.length) {
    problems.forEach(p => console.error('PREFLIGHT FAIL  ' + p));
    process.exit(1);
  }
  // Never fetch model files from the network: the verified local cache must be used.
  const { env } = await import('@xenova/transformers');
  env.allowRemoteModels = false;
  return { platform: PLATFORM, input_sha256: INPUT_SHA256, model_cache: 'OK', alpha_per_fold: alphas };
}

async function scoreOne(text) {
  const r = search(text);
  const lexical = lexicalSearchAll(text, PLATFORM);
  const d = await denseSearch(text, { platform: PLATFORM });
  const dense = d._scored
    .map(s => ({ command: s.entry.command, intent: s.entry.intent, category: s.entry.category, score: s.sim }))
    .sort((a, b) => b.score - a.score);
  const f = fuseQuery({ lexical, dense }, ALPHA);
  const lexScores = lexical.map(c => c.score);
  return {
    s: r.score, s4: r4(r.score), confidence: r.confidence, command_shipped: r.command,
    fused: f.ranked[0].fused, fused4: r4(f.ranked[0].fused), command_hybrid: f.ranked[0].command,
    n_tokens: tokenize(text).length,
    lexical_top1_score: lexical[0].score, bonus_fired: lexical[0].bonusFired,
    lexical_all_equal: Math.max(...lexScores) - Math.min(...lexScores) <= TOL,
    dense_top1: dense[0].score,
    _lexical: lexical, _dense: dense // dropped before writing; guard mode compares them with the v0.2 cache
  };
}

async function scoreQueries(items, onProgress) {
  const out = [];
  for (const it of items) {
    const sc = await scoreOne(it.text);
    out.push({ id: it.id, ...sc });
    if (onProgress) onProgress(out.length, items.length);
  }
  return out;
}

const strip = rows => rows.map(({ _lexical, _dense, ...rest }) => rest);
const progress = (i, n) => process.stdout.write(`\r  ${i}/${n}`);

async function guard() {
  const bench = readJson('research/datasets/termassist_bench_v0.2_validated.json').queries;
  const repro = new Map(readJson('research/results/v0.2/reproduction-results.json').map(r => [r.id, r]));
  const feat = new Map(readJson('research/results/v0.2/reliability_features.json').features.map(f => [f.id, f]));
  const hyb = new Map(readJson('research/results/v0.2/candidates.json').candidates.filter(c => c.system === 'hybrid').map(c => [c.id, c]));
  const cache = new Map(readJson('research/results/v0.2/query_scores_cache.json').queries.map(q => [q.id, q]));

  const rows = await scoreQueries(bench.map(q => ({ id: q.id, text: q.query })), progress);
  console.log('');

  const mism = { s4: [], confidence: [], fused4: [] };
  const info = { command_shipped: [], command_hybrid: [] };
  let maxLex = 0, maxDense = 0, maxS = 0, listShape = 0;
  for (const row of rows) {
    const rp = repro.get(row.id), ft = feat.get(row.id), hc = hyb.get(row.id), cq = cache.get(row.id);
    if (Math.abs(row.s4 - rp.actual.score) > TOL) mism.s4.push(`${row.id}: ${row.s4} vs ${rp.actual.score}`);
    if (row.confidence !== rp.actual.confidence) mism.confidence.push(`${row.id}: ${row.confidence} vs ${rp.actual.confidence}`);
    if (Math.abs(row.fused4 - ft.top1_score) > TOL) mism.fused4.push(`${row.id}: ${row.fused4} vs ${ft.top1_score}`);
    if (row.command_shipped !== rp.actual.command) info.command_shipped.push(row.id);
    if (row.command_hybrid !== hc.top1_command) info.command_hybrid.push(row.id);
    // informative, full precision: live lists vs the committed v0.2 cache
    if (row._lexical.length !== cq.lexical.length || row._dense.length !== cq.dense.length) listShape++;
    const lexBy = new Map(cq.lexical.map(c => [c.command, c.score])), denBy = new Map(cq.dense.map(c => [c.command, c.score]));
    row._lexical.forEach(c => { maxLex = Math.max(maxLex, Math.abs(c.score - lexBy.get(c.command))); });
    row._dense.forEach(c => { maxDense = Math.max(maxDense, Math.abs(c.score - denBy.get(c.command))); });
    maxS = Math.max(maxS, Math.abs(row.s - cq.lexical[0].score));
  }
  const total = mism.s4.length + mism.confidence.length + mism.fused4.length;
  return {
    mode: 'guard', queries: rows.length, tolerance: TOL,
    required: {
      s4_vs_reproduction_score: `${mism.s4.length} mismatches / ${rows.length}`,
      confidence_vs_reproduction: `${mism.confidence.length} mismatches / ${rows.length}`,
      fused4_vs_reliability_top1_score: `${mism.fused4.length} mismatches / ${rows.length}`,
      mismatches: mism
    },
    informative: {
      command_shipped_differs_from_reproduction: info.command_shipped,
      command_hybrid_differs_from_candidates: info.command_hybrid,
      list_length_differs_from_cache: listShape,
      max_abs_diff_lexical_scores_vs_cache: maxLex,
      max_abs_diff_dense_cosine_vs_cache: maxDense,
      max_abs_diff_unrounded_s_vs_cache_lexical_top1: maxS,
      queries_with_no_tokens: rows.filter(r => r.n_tokens === 0).length,
      queries_lexical_all_equal: rows.filter(r => r.lexical_all_equal).length
    },
    pass: total === 0,
    rows: strip(rows)
  };
}

async function edge() {
  const items = [
    { id: 'EDGE-empty', text: '' },
    { id: 'EDGE-spaces', text: '   ' },
    { id: 'EDGE-punct', text: '?!' },
    { id: 'EDGE-stopwords', text: 'how do i' },
    { id: 'EDGE-stopword-one', text: 'the' },
    { id: 'EDGE-nonascii', text: 'café' }
  ];
  const rows = strip(await scoreQueries(items));
  return {
    mode: 'edge',
    note: 'synthetic strings only; shows search() (s, shipped) against the lexical replica (lexical_top1_score) where the empty-token guard differs',
    rows: rows.map(r => ({ ...r, shipped_vs_replica_top1_equal: r.s4 === r4(r.lexical_top1_score) }))
  };
}

async function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf('--out');
  const outPath = outIdx >= 0 ? args[outIdx + 1] : null;
  if (!outPath) { console.error('usage: --guard | --edge | --input <file>, with --out <file>'); process.exit(2); }

  const pre = await preflight();
  console.log(`preflight OK: ${pre.platform}, 3 input hashes, model cache, alpha ${pre.alpha_per_fold.join('/')}`);

  let result;
  if (args.includes('--guard')) result = await guard();
  else if (args.includes('--edge')) result = await edge();
  else if (args.includes('--input')) {
    const items = JSON.parse(fs.readFileSync(args[args.indexOf('--input') + 1], 'utf-8'));
    result = { mode: 'input', count: items.length, rows: strip(await scoreQueries(items, progress)) };
    console.log('');
  } else { console.error('no mode given'); process.exit(2); }

  fs.writeFileSync(outPath, JSON.stringify({ script: 'e1_score_queries.js', generated_at: new Date().toISOString(), node: process.version, preflight: pre, ...result }, null, 2), 'utf-8');
  if (result.mode === 'guard') {
    console.log(JSON.stringify({ required: { ...result.required, mismatches: undefined }, informative: result.informative }, null, 2));
    console.log(result.pass ? 'GUARD PASS' : 'GUARD FAIL');
    if (!result.pass) process.exit(1);
  }
  console.log(`wrote ${outPath}`);
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1); });

module.exports = { preflight, scoreOne, scoreQueries };
