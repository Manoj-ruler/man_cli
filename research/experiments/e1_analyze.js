// E1-07b (research/publication_tasks/e1/E1_PROTOCOL.md §6) -- the E1 analysis, written and tested on
// synthetic data BEFORE the protocol freeze (E1-09) and run unchanged at E1-11/E1-13.
//
// Input: the per-query score files written by e1_score_queries.js (--input mode) for P1 (`test`)
// and P2 (`oos_test`), plus the P1 metadata [{id, intent, domain, subgroup}] (subgroup: 'S-clear',
// 'S-borderline' or null). Every query is out of scope, so a rejection is always correct.
//
//   node e1_analyze.js --scores-p1 <f> --scores-p2 <f> --meta-p1 <f> --out-dir <dir>
//                      [--stage decisions|summary|all]  (default all)
//                      [--expect-p1 4500 --expect-p2 1000 --expect-intents 150 --expect-per-intent 30]
//                      [--synthetic]   (tests only: skips hashing the CLINC data files in the manifest)
//
// Stages: `decisions` applies the §6.2 rules, runs the §6.8 logical checks and writes
// decisions_p{1,2}.json, logical_checks.json and RUN_MANIFEST.json (E1-11); `summary` writes
// summary.json and summary.md with every §6.3-§6.5 quantity (E1-13). Any failed logical check
// stops the run with exit 1 before anything but logical_checks.json is written. Existing files are
// never overwritten.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { rd, r4, p4, percentile, wilson, exactMcNemar, mulberry32 } = require('./phase1_common');

const B = 10000;
const SEED = 42;

// Frozen v0.2 thresholds (§4; E1_THRESHOLDS.md), re-read from the committed results and asserted.
const R2_T = [6.4952, 6.4952, 6.4952, 7.1978, 6.4952];
const R3_U = [0.9179, 0.9219, 0.8841, 0.9247, 0.9219];
const median5 = a => a.slice().sort((x, y) => x - y)[2];
const R2_MED = median5(R2_T); // 6.4952
const R3_MED = median5(R3_U); // 0.9219
const RULES = ['R1', 'R1_CLI', 'R2', 'R3'];
const PAIRS = [['R2', 'R3'], ['R3', 'R1'], ['R2', 'R1']]; // difference = rate(first) - rate(second)

function frozenInputs() {
  const problems = [];
  const e = rd('research/results/review_r1/review_r1_e_ood_operating_points.json').versions['v0.2'];
  const sel = rd('research/results/v0.2/selective-prediction-results.json').ood_detection.per_fold.map(f => f.selected_threshold);
  const r2 = e.nested_tuned_baseline_threshold.per_fold_thresholds_raw_bm25;
  if (JSON.stringify(r2) !== JSON.stringify(R2_T)) problems.push(`R2 thresholds ${JSON.stringify(r2)} != ${JSON.stringify(R2_T)}`);
  if (JSON.stringify(sel) !== JSON.stringify(R3_U)) problems.push(`R3 thresholds ${JSON.stringify(sel)} != ${JSON.stringify(R3_U)}`);
  // v0.2 reference counts quoted in §6.5 point 8
  const v02 = {
    all_50: { n: 50, R1: e.committed_operating_points.baseline_rule_bm25_lt_2.ood_rejected.k, R2: e.nested_tuned_baseline_threshold.ood_rejected.k, R3: e.committed_operating_points.tuned_detector_nested.ood_rejected.k },
    unscreened_15: { n: e.rejections_by_source.original_v0_1_items.n, R1: e.rejections_by_source.original_v0_1_items.fixed_rule, R2: e.rejections_by_source.original_v0_1_items.tuned_shipped_threshold, R3: e.rejections_by_source.original_v0_1_items.hybrid_detector },
    added_35: { n: e.rejections_by_source.added_v0_2_items.n, R1: e.rejections_by_source.added_v0_2_items.fixed_rule, R2: e.rejections_by_source.added_v0_2_items.tuned_shipped_threshold, R3: e.rejections_by_source.added_v0_2_items.hybrid_detector },
    false_rejections_of_134: { n: e.controls_excluded.n_non_ood, R1: e.controls_excluded.false_rejected.fixed_rule, R2: e.controls_excluded.false_rejected.tuned_shipped_threshold, R3: e.controls_excluded.false_rejected.hybrid_detector }
  };
  const want = { all_50: [17, 46, 34], unscreened_15: [4, 12, 9], added_35: [13, 34, 25], false_rejections_of_134: [0, 20, 11] };
  for (const [k, w] of Object.entries(want)) if (JSON.stringify([v02[k].R1, v02[k].R2, v02[k].R3]) !== JSON.stringify(w)) problems.push(`v0.2 ${k} = ${[v02[k].R1, v02[k].R2, v02[k].R3]}, protocol says ${w}`);
  if (v02.false_rejections_of_134.n !== 134) problems.push(`v0.2 in-scope n = ${v02.false_rejections_of_134.n}, protocol says 134`);
  return { problems, v02 };
}

// ---- §6.2 decision rules ----
function decide(row) {
  const R2_fold = R2_T.map(t => row.s4 < t);
  const R3_fold = R3_U.map(u => row.fused4 < u);
  return {
    id: row.id,
    R1: row.s < 2.0,
    R1_CLI: row.confidence < 30 || row.command_shipped === null,
    R2: row.s4 < R2_MED, R3: row.fused4 < R3_MED,
    R2_fold, R3_fold
  };
}

// ---- §6.8 logical checks (plus two input-integrity checks) ----
function logicalChecks(pop, rows, decs, expectN, clusters) {
  const fails = [];
  const push = (check, id, msg) => fails.push({ population: pop, check, id, msg });
  const numeric = ['s', 's4', 'confidence', 'fused', 'fused4', 'n_tokens'];
  if (rows.length !== expectN) push('5 row count', null, `${rows.length} rows, expected ${expectN}`);
  const ids = new Set();
  rows.forEach((r, i) => {
    const d = decs[i];
    if (ids.has(r.id)) push('5 unique ids', r.id, 'duplicate id'); ids.add(r.id);
    numeric.forEach(k => { if (typeof r[k] !== 'number' || !Number.isFinite(r[k])) push('5 no NaN or missing score', r.id, `${k} = ${r[k]}`); });
    if (typeof r.lexical_all_equal !== 'boolean') push('5 no NaN or missing score', r.id, 'lexical_all_equal missing');
    if (d.R1 && !d.R1_CLI) push('1 R1 within R1-CLI', r.id, `s ${r.s}, confidence ${r.confidence}`);
    if (d.R1 && !(d.R2_fold.every(x => x))) push('2 R1 within R2 (both thresholds)', r.id, `s ${r.s}, s4 ${r.s4}`);
    const r2lo = r.s4 < 6.4952, r2hi = r.s4 < 7.1978;
    if (r2lo && !r2hi) push('3 R2(6.4952) within R2(7.1978)', r.id, `s4 ${r.s4}`);
    const order = R3_U.map((u, k) => [u, d.R3_fold[k]]).sort((a, b) => a[0] - b[0]);
    for (let k = 1; k < order.length; k++) if (order[k - 1][1] && !order[k][1]) push('3 R3 nested in threshold order', r.id, `fused4 ${r.fused4}`);
    if (r.lexical_all_equal) {
      if (r.s !== 0) push('4 lexical-null has s = 0', r.id, `s ${r.s}`);
      if (r.fused4 !== 0.5 && r.fused4 !== 0) push('4 lexical-null has fused4 = 0.5', r.id, `fused4 ${r.fused4}`);
    }
  });
  if (clusters) {
    const { byIntent, expectIntents, expectPerIntent } = clusters;
    if (byIntent.size !== expectIntents) push('5 cluster structure', null, `${byIntent.size} intents, expected ${expectIntents}`);
    for (const [intent, idx] of byIntent) if (idx.length !== expectPerIntent) push('5 cluster structure', intent, `${idx.length} queries, expected ${expectPerIntent}`);
  }
  // lexical-null rows with fused4 = 0 (dense scores all equal) are allowed by §6.8 item 4 but reported
  const denseDegenerate = rows.filter(r => r.lexical_all_equal && r.fused4 === 0).map(r => r.id);
  return { fails, lexical_null_dense_degenerate: denseDegenerate };
}

// ---- statistics ----
const rate = (k, n) => ({ k, n, rate: n ? r4(k / n) : null, pct: n ? +(100 * k / n).toFixed(2) : null });
function holm(ps) { // Holm step-down adjusted p-values, returned in input order
  const m = ps.length, order = ps.map((p, i) => [p, i]).sort((a, b) => a[0] - b[0]), adj = new Array(m);
  let run = 0;
  order.forEach(([p, i], j) => { run = Math.max(run, Math.min(1, (m - j) * p)); adj[i] = run; });
  return adj;
}
// Cluster bootstrap over the given clusters (arrays of row indices), resampling clusters with
// replacement (B, mulberry32 seed 42). Returns percentile intervals for every rule's pooled rate
// and every pair's paired difference, all from the same resamples.
function clusterBootstrap(clusters, decs) {
  const C = clusters.length;
  const stats = clusters.map(idx => { const k = {}; RULES.forEach(R => { k[R] = idx.filter(i => decs[i][R]).length; }); return { n: idx.length, k }; });
  const rng = mulberry32(SEED), vals = {};
  const keys = [...RULES, ...PAIRS.map(([a, b]) => `${a}-${b}`)];
  keys.forEach(k => { vals[k] = []; });
  for (let b = 0; b < B; b++) {
    let n = 0; const k = { R1: 0, R1_CLI: 0, R2: 0, R3: 0 };
    for (let c = 0; c < C; c++) { const s = stats[Math.floor(rng() * C)]; n += s.n; RULES.forEach(R => { k[R] += s.k[R]; }); }
    RULES.forEach(R => vals[R].push(k[R] / n));
    PAIRS.forEach(([a, bb]) => vals[`${a}-${bb}`].push((k[a] - k[bb]) / n));
  }
  const out = {};
  keys.forEach(key => {
    const v = vals[key].sort((x, y) => x - y);
    out[key] = { lo: r4(percentile(v, 0.025)), hi: r4(percentile(v, 0.975)), degenerate: v[0] === v[v.length - 1] };
  });
  return { B, seed: SEED, clusters: C, method: 'intent-cluster percentile bootstrap', ci: out };
}
function reading(ci) {
  if (ci.degenerate) return 'degenerate: every bootstrap value identical; no reading beyond the point estimate';
  if (ci.lo > 0) return 'interval entirely above 0: R2 lead holds on external data';
  if (ci.hi < 0) return 'interval entirely below 0: the lead reverses';
  return 'interval includes 0: no evidence of a difference';
}
function ratesOf(idx, decs) { const o = {}; RULES.forEach(R => { o[R] = rate(idx.filter(i => decs[i][R]).length, idx.length); }); return o; }
function pairTable(idx, decs, a, b) {
  let both = 0, aOnly = 0, bOnly = 0, neither = 0;
  idx.forEach(i => { const x = decs[i][a], y = decs[i][b]; if (x && y) both++; else if (x) aOnly++; else if (y) bOnly++; else neither++; });
  return { a, b, both, a_only: aOnly, b_only: bOnly, neither, n: idx.length, difference: idx.length ? r4((aOnly - bOnly) / idx.length) : null };
}
function quantiles(xs) {
  const v = xs.slice().sort((a, b) => a - b);
  return { p5: r4(percentile(v, 0.05)), q1: r4(percentile(v, 0.25)), median: r4(percentile(v, 0.5)), q3: r4(percentile(v, 0.75)), p95: r4(percentile(v, 0.95)) };
}

// ---- one population ----
function analysePopulation(pop, rows, decs, clusterOf) {
  const all = rows.map((_, i) => i);
  const primaryRates = ratesOf(all, decs);
  const out = { population: pop, n: rows.length };

  // §6.3 primary outcome
  out.rates = {};
  RULES.forEach(R => { const k = primaryRates[R].k, n = rows.length; out.rates[R] = { ...primaryRates[R], wilson95: (({ lo, hi }) => ({ lo, hi }))(wilson(k, n)) }; });
  if (clusterOf) RULES.forEach(R => { out.rates[R].wilson95.label = 'ignores clustering; too narrow'; });
  const perFold = (key, thr) => thr.map((t, f) => ({ fold: f, threshold: t, ...rate(rows.filter((_, i) => decs[i][key][f]).length, rows.length) }));
  out.five_threshold_sensitivity = {};
  [['R2', 'R2_fold', R2_T, R2_MED], ['R3', 'R3_fold', R3_U, R3_MED]].forEach(([R, key, thr, med]) => {
    const pf = perFold(key, thr), ks = pf.map(p => p.k);
    out.five_threshold_sensitivity[R] = {
      median_threshold: med, per_fold: pf, median_of_five_k: median5(ks), min_k: Math.min(...ks), max_k: Math.max(...ks),
      min_rate: r4(Math.min(...ks) / rows.length), max_rate: r4(Math.max(...ks) / rows.length),
      median_equals_rate_at_median_threshold: median5(ks) === primaryRates[R].k,
      label: 'sensitivity range, not an interval'
    };
  });

  // §6.4 comparisons
  out.pairs = PAIRS.map(([a, b]) => pairTable(all, decs, a, b));
  if (clusterOf) {
    const clusters = [...clusterOf.values()];
    const cb = clusterBootstrap(clusters, decs);
    RULES.forEach(R => { out.rates[R].cluster_bootstrap95 = { lo: cb.ci[R].lo, hi: cb.ci[R].hi, degenerate: cb.ci[R].degenerate, label: 'primary interval (P1)' }; });
    out.bootstrap = { B: cb.B, seed: cb.seed, clusters: cb.clusters, method: cb.method };
    const pr = out.pairs[0];
    out.primary_comparison = {
      label: 'PRIMARY (D10 = a): R2 - R3 on P1, paired intent-cluster bootstrap',
      difference: pr.difference, a_only: pr.a_only, b_only: pr.b_only,
      ci95: { lo: cb.ci['R2-R3'].lo, hi: cb.ci['R2-R3'].hi }, degenerate: cb.ci['R2-R3'].degenerate, reading: reading(cb.ci['R2-R3'])
    };
    out.secondary_p1 = out.pairs.slice(1).map(p => ({
      label: 'secondary', pair: `${p.a} - ${p.b}`, difference: p.difference,
      ci95_cluster_bootstrap: { lo: cb.ci[`${p.a}-${p.b}`].lo, hi: cb.ci[`${p.a}-${p.b}`].hi, degenerate: cb.ci[`${p.a}-${p.b}`].degenerate },
      exact_mcnemar_p: p4(exactMcNemar(p.a_only, p.b_only)), exact_mcnemar_label: 'ignores clustering'
    }));
    out.p1_mcnemar_primary_pair = { exact_mcnemar_p: p4(exactMcNemar(pr.a_only, pr.b_only)), label: 'ignores clustering; not the primary inference' };
  } else {
    const ps = out.pairs.map(p => exactMcNemar(p.a_only, p.b_only)), adj = holm(ps);
    out.secondary_p2 = out.pairs.map((p, j) => ({
      label: j === 0 ? 'secondary: replication check of the primary comparison' : 'secondary',
      pair: `${p.a} - ${p.b}`, difference: p.difference, a_only: p.a_only, b_only: p.b_only,
      exact_mcnemar_p: p4(ps[j]), holm_adjusted_p: p4(adj[j]), holm_family: 'the three P2 pairs'
    }));
  }

  // §6.5 point 1: R1 vs R1-CLI
  const between = rows.filter(r => r.s >= 2.0 && r.s < 2.36).length;
  const cliMinusR1 = decs.filter(d => d.R1_CLI && !d.R1).length;
  out.r1_vs_r1_cli = { count_s_in_2_0_to_2_36: between, r1_cli_rejects_minus_r1_rejects: cliMinusR1, equal: between === cliMinusR1 };

  // §6.5 point 4: ties
  const distinctR3 = [...new Set(R3_U)].sort((a, b) => a - b);
  out.ties = {
    s_exactly_2_0: rows.filter(r => r.s === 2.0).length,
    s4_exactly: Object.fromEntries([...new Set(R2_T)].map(t => [t, rows.filter(r => r.s4 === t).length])),
    fused4_exactly: Object.fromEntries(distinctR3.map(u => [u, rows.filter(r => r.fused4 === u).length])),
    note: 'a score exactly at a threshold is not rejected (strict <)'
  };

  // §6.5 point 5: no-token queries
  const noTok = all.filter(i => rows[i].n_tokens === 0), withTok = all.filter(i => rows[i].n_tokens !== 0);
  out.no_token = {
    count: noTok.length, ids: noTok.map(i => rows[i].id),
    rejected_by: Object.fromEntries(RULES.map(R => [R, noTok.filter(i => decs[i][R]).length])),
    rates_excluding_them: noTok.length ? ratesOf(withTok, decs) : null
  };

  // §6.5 point 6: lexical-null queries and the overlap subset
  const lexNull = all.filter(i => rows[i].lexical_all_equal), overlap = all.filter(i => !rows[i].lexical_all_equal);
  out.lexical_null = {
    count: lexNull.length, share: rate(lexNull.length, rows.length),
    rejected_by: Object.fromEntries(RULES.map(R => [R, lexNull.filter(i => decs[i][R]).length])),
    overlap_subset: { n: overlap.length, rates: ratesOf(overlap, decs), pairs: PAIRS.map(([a, b]) => pairTable(overlap, decs, a, b)) }
  };
  if (clusterOf) {
    const oc = [...clusterOf.values()].map(idx => idx.filter(i => !rows[i].lexical_all_equal)).filter(c => c.length);
    if (oc.length) {
      const cb = clusterBootstrap(oc, decs);
      out.lexical_null.overlap_subset.primary_comparison = { difference: out.lexical_null.overlap_subset.pairs[0].difference, ci95: { lo: cb.ci['R2-R3'].lo, hi: cb.ci['R2-R3'].hi }, degenerate: cb.ci['R2-R3'].degenerate, clusters: oc.length, reading: reading(cb.ci['R2-R3']) };
    }
  }

  // §6.5 point 7: score distributions
  out.distributions = { s: quantiles(rows.map(r => r.s)), s4: quantiles(rows.map(r => r.s4)), fused4: quantiles(rows.map(r => r.fused4)) };
  return out;
}

function p1Extras(rows, decs, meta, clusterOf, v02) {
  const out = {};
  const idxWhere = f => rows.map((r, i) => i).filter(i => f(meta.get(rows[i].id)));
  // §6.5 point 2: subgroup S
  out.subgroup_S = {};
  [['S_clear', m => m.subgroup === 'S-clear'], ['S_borderline', m => m.subgroup === 'S-borderline']].forEach(([k, f]) => {
    const idx = idxWhere(f); out.subgroup_S[k] = { n: idx.length, intents: new Set(idx.map(i => meta.get(rows[i].id).intent)).size, rates: ratesOf(idx, decs) };
  });
  out.sensitivity_without_S = {};
  [['without_S_clear', m => m.subgroup !== 'S-clear'], ['without_S_clear_and_S_borderline', m => m.subgroup === null]].forEach(([k, f]) => {
    const idx = idxWhere(f), keep = new Set(idx);
    const cl = [...clusterOf.values()].map(c => c.filter(i => keep.has(i))).filter(c => c.length);
    const cb = clusterBootstrap(cl, decs), rt = ratesOf(idx, decs), pr = pairTable(idx, decs, 'R2', 'R3');
    out.sensitivity_without_S[k] = {
      n: idx.length, intents: cl.length,
      rates: Object.fromEntries(RULES.map(R => [R, { ...rt[R], cluster_bootstrap95: { lo: cb.ci[R].lo, hi: cb.ci[R].hi } }])),
      primary_comparison: { difference: pr.difference, ci95: { lo: cb.ci['R2-R3'].lo, hi: cb.ci['R2-R3'].hi }, degenerate: cb.ci['R2-R3'].degenerate, reading: reading(cb.ci['R2-R3']) }
    };
  });
  // §6.5 point 3: per domain (descriptive; no tests, no intervals)
  const domains = [...new Set(rows.map(r => meta.get(r.id).domain))].sort();
  out.per_domain = Object.fromEntries(domains.map(d => [d, ratesOf(idxWhere(m => m.domain === d), decs)]));
  return out;
}

function v02Comparison(summaryPop, v02) {
  const rows = {};
  ['R1', 'R2', 'R3'].forEach(R => {
    const e = summaryPop.rates[R].rate;
    rows[R] = {
      e1_rate: e,
      v0_2_all_50: rate(v02.all_50[R], 50), v0_2_unscreened_15: rate(v02.unscreened_15[R], 15), v0_2_added_35: rate(v02.added_35[R], 35),
      e1_minus_v0_2_all_50: r4(e - v02.all_50[R] / 50), e1_minus_v0_2_unscreened_15: r4(e - v02.unscreened_15[R] / 15),
      v0_2_false_rejections: `${v02.false_rejections_of_134[R]}/134`
    };
  });
  return {
    label: 'descriptive; different populations; no test',
    rules: rows,
    r2_minus_r3: { e1: r4(summaryPop.rates.R2.rate - summaryPop.rates.R3.rate), v0_2_all_50: r4((v02.all_50.R2 - v02.all_50.R3) / 50), v0_2_unscreened_15: r4((v02.unscreened_15.R2 - v02.unscreened_15.R3) / 15) },
    caveats: [
      "v0.2 rates are out-of-fold (each query met its own fold's threshold); E1 applies all five thresholds to queries in no fold",
      'CLINC150 is general-domain; E1 says nothing about terminal-task out-of-scope requests (protocol §2.4)',
      'E1 cannot measure false rejections; read every E1 rate beside the v0.2 false rejections (0, 20 and 11 of 134 for R1, R2 and R3)'
    ]
  };
}

// ---- markdown ----
function md(summary) {
  const L = [];
  const f = x => (x === null || x === undefined) ? '—' : x;
  L.push('# E1 summary (CLINC150), generated by e1_analyze.js', '', `Generated ${summary.generated_at}. Protocol: ${summary.protocol}. Every quantity below is pre-specified in protocol §6; anything else would be labelled post hoc.`, '');
  for (const P of ['P1', 'P2']) {
    const s = summary[P];
    L.push(`## ${P} (n = ${s.n})`, '', '| Rule | Rejected | Rate | Primary interval | Wilson 95% |', '|---|---|---|---|---|');
    RULES.forEach(R => {
      const r = s.rates[R], prim = r.cluster_bootstrap95 ? `${r.cluster_bootstrap95.lo}–${r.cluster_bootstrap95.hi} (cluster bootstrap)` : `${r.wilson95.lo}–${r.wilson95.hi} (Wilson)`;
      L.push(`| ${R} | ${r.k}/${r.n} | ${r.rate} | ${prim} | ${r.wilson95.lo}–${r.wilson95.hi}${r.wilson95.label ? ' (ignores clustering)' : ''} |`);
    });
    L.push('', 'Five-threshold sensitivity range (not an interval):');
    ['R2', 'R3'].forEach(R => { const t = s.five_threshold_sensitivity[R]; L.push(`- ${R}: rates ${t.per_fold.map(p => p.rate).join(', ')} (folds 0–4); min ${t.min_rate}, max ${t.max_rate}; median of five = rate at ${t.median_threshold}: ${t.median_equals_rate_at_median_threshold}`); });
    if (s.primary_comparison) { const p = s.primary_comparison; L.push('', `**Primary comparison (R2 − R3, P1):** ${p.difference} [${p.ci95.lo}, ${p.ci95.hi}]; ${p.reading}. Discordant: R2 only ${p.a_only}, R3 only ${p.b_only}.`); }
    if (s.secondary_p2) { L.push('', '| Pair (secondary) | Difference | R-first only | R-second only | Exact McNemar p | Holm p |', '|---|---|---|---|---|---|'); s.secondary_p2.forEach(x => L.push(`| ${x.pair} | ${x.difference} | ${x.a_only} | ${x.b_only} | ${x.exact_mcnemar_p} | ${x.holm_adjusted_p} |`)); }
    if (s.secondary_p1) { L.push('', '| Pair (secondary) | Difference | Cluster-bootstrap 95% | Exact McNemar p (ignores clustering) |', '|---|---|---|---|'); s.secondary_p1.forEach(x => L.push(`| ${x.pair} | ${x.difference} | ${x.ci95_cluster_bootstrap.lo}–${x.ci95_cluster_bootstrap.hi} | ${x.exact_mcnemar_p} |`)); }
    L.push('', `- R1 vs R1-CLI: ${s.r1_vs_r1_cli.count_s_in_2_0_to_2_36} queries with 2.0 ≤ s < 2.36.`);
    L.push(`- Ties: s = 2.0: ${s.ties.s_exactly_2_0}; s4 at ${JSON.stringify(s.ties.s4_exactly)}; fused4 at ${JSON.stringify(s.ties.fused4_exactly)}.`);
    L.push(`- No-token queries: ${s.no_token.count}; rejected by ${JSON.stringify(s.no_token.rejected_by)}.`);
    L.push(`- Lexical-null queries: ${s.lexical_null.count} (${s.lexical_null.share.rate}); overlap subset n = ${s.lexical_null.overlap_subset.n}, rates ${RULES.map(R => `${R} ${s.lexical_null.overlap_subset.rates[R].k}/${s.lexical_null.overlap_subset.rates[R].n}`).join(', ')}.`);
    if (s.lexical_null.overlap_subset.primary_comparison) { const p = s.lexical_null.overlap_subset.primary_comparison; L.push(`- Primary comparison on the overlap subset: ${p.difference} [${p.ci95.lo}, ${p.ci95.hi}]; ${p.reading}.`); }
    L.push(`- Distributions: s median ${s.distributions.s.median}; fused4 median ${s.distributions.fused4.median}.`, '');
    const v = s.v0_2_comparison;
    L.push('Comparison with v0.2 (descriptive; different populations; no test):', '', '| Rule | E1 rate | v0.2, 50 | v0.2, 15 unscreened | v0.2 false rejections |', '|---|---|---|---|---|');
    ['R1', 'R2', 'R3'].forEach(R => { const x = v.rules[R]; L.push(`| ${R} | ${x.e1_rate} | ${x.v0_2_all_50.k}/50 | ${x.v0_2_unscreened_15.k}/15 | ${x.v0_2_false_rejections} |`); });
    L.push('', `R2 − R3: E1 ${v.r2_minus_r3.e1}; v0.2 ${v.r2_minus_r3.v0_2_all_50} (50), ${v.r2_minus_r3.v0_2_unscreened_15} (15 unscreened).`, '');
  }
  const x = summary.P1_extras;
  L.push('## P1 subgroup S and domains (descriptive)', '');
  Object.entries(x.subgroup_S).forEach(([k, v]) => L.push(`- ${k} (n = ${v.n}): ${RULES.map(R => `${R} ${v.rates[R].k}/${v.rates[R].n}`).join(', ')}`));
  Object.entries(x.sensitivity_without_S).forEach(([k, v]) => L.push(`- ${k} (n = ${v.n}, ${v.intents} intents): ${RULES.map(R => `${R} ${v.rates[R].rate} [${v.rates[R].cluster_bootstrap95.lo}, ${v.rates[R].cluster_bootstrap95.hi}]`).join('; ')}; R2 − R3 ${v.primary_comparison.difference} [${v.primary_comparison.ci95.lo}, ${v.primary_comparison.ci95.hi}]`));
  L.push('', '| Domain | ' + RULES.join(' | ') + ' |', '|---|' + RULES.map(() => '---').join('|') + '|');
  Object.entries(x.per_domain).forEach(([d, r]) => L.push(`| ${d} | ${RULES.map(R => `${r[R].k}/${r[R].n}`).join(' | ')} |`));
  L.push('', 'Caveats: ' + summary.P1.v0_2_comparison.caveats.join('; ') + '.');
  return L.map(f).join('\n') + '\n';
}

// ---- main ----
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function writeNew(p, text) {
  if (fs.existsSync(p)) { console.error(`refusing to overwrite ${p}`); process.exit(2); }
  fs.writeFileSync(p, text, 'utf-8');
}
function arg(args, name, dflt) { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; }

function main() {
  const started = new Date().toISOString();
  const args = process.argv.slice(2);
  const files = { p1: arg(args, '--scores-p1'), p2: arg(args, '--scores-p2'), meta: arg(args, '--meta-p1') };
  const outDir = arg(args, '--out-dir'), stage = arg(args, '--stage', 'all');
  if (!files.p1 || !files.p2 || !files.meta || !outDir || !['decisions', 'summary', 'all'].includes(stage)) {
    console.error('usage: --scores-p1 <f> --scores-p2 <f> --meta-p1 <f> --out-dir <dir> [--stage decisions|summary|all]'); process.exit(2);
  }
  const expect = { p1: +arg(args, '--expect-p1', 4500), p2: +arg(args, '--expect-p2', 1000), intents: +arg(args, '--expect-intents', 150), perIntent: +arg(args, '--expect-per-intent', 30) };
  const synthetic = args.includes('--synthetic');

  const { problems, v02 } = frozenInputs();
  if (problems.length) { problems.forEach(p => console.error('FROZEN INPUT FAIL  ' + p)); process.exit(1); }

  const load = f => JSON.parse(fs.readFileSync(f, 'utf-8'));
  const S1 = load(files.p1), S2 = load(files.p2), metaRows = load(files.meta);
  const rows1 = S1.rows, rows2 = S2.rows;
  const meta = new Map(metaRows.map(m => [m.id, m]));
  const dec1 = rows1.map(decide), dec2 = rows2.map(decide);

  // P1 clusters (intents); every P1 row must have metadata, and vice versa
  const metaProblems = [];
  rows1.forEach(r => { if (!meta.has(r.id)) metaProblems.push({ population: 'P1', check: '5 metadata join', id: r.id, msg: 'no metadata' }); });
  if (metaRows.length !== rows1.length) metaProblems.push({ population: 'P1', check: '5 metadata join', id: null, msg: `${metaRows.length} metadata rows for ${rows1.length} score rows` });
  const clusterOf = new Map();
  rows1.forEach((r, i) => { const m = meta.get(r.id); if (!m) return; if (!clusterOf.has(m.intent)) clusterOf.set(m.intent, []); clusterOf.get(m.intent).push(i); });

  const c1 = logicalChecks('P1', rows1, dec1, expect.p1, { byIntent: clusterOf, expectIntents: expect.intents, expectPerIntent: expect.perIntent });
  const c2 = logicalChecks('P2', rows2, dec2, expect.p2, null);
  const fails = [...metaProblems, ...c1.fails, ...c2.fails];
  // D2 identity (monotonicity): the median of the five per-fold counts equals the count at the median threshold
  [['P1', rows1, dec1], ['P2', rows2, dec2]].forEach(([P, rows, decs]) => {
    [['R2', 'R2_fold'], ['R3', 'R3_fold']].forEach(([R, key]) => {
      const ks = [0, 1, 2, 3, 4].map(f => decs.filter(d => d[key][f]).length), atMed = decs.filter(d => d[R]).length;
      if (median5(ks) !== atMed) fails.push({ population: P, check: 'D2 median identity', id: null, msg: `${R}: median of five ${median5(ks)} != ${atMed} at the median threshold` });
    });
  });
  const checks = {
    protocol: 'E1_PROTOCOL.md §6.8', generated_at: new Date().toISOString(), pass: fails.length === 0,
    checks: ['1 R1 within R1-CLI', '2 R1 within R2 (both thresholds)', '3 R2(6.4952) within R2(7.1978)', '3 R3 nested in threshold order', '4 lexical-null has s = 0', '4 lexical-null has fused4 = 0.5', '5 row count', '5 unique ids', '5 no NaN or missing score', '5 cluster structure', '5 metadata join', 'D2 median identity'],
    failures: fails, lexical_null_dense_degenerate: { P1: c1.lexical_null_dense_degenerate, P2: c2.lexical_null_dense_degenerate }
  };
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!checks.pass) {
    const failPath = path.join(outDir, `logical_checks_FAILED_${stage}.json`);
    if (!fs.existsSync(failPath)) fs.writeFileSync(failPath, JSON.stringify(checks, null, 2), 'utf-8');
    console.error(`LOGICAL CHECKS FAIL (${fails.length}); run BLOCKED. First: ${JSON.stringify(fails[0])}`);
    process.exit(1);
  }

  const scriptSha = { 'e1_analyze.js': sha(__filename), 'e1_score_queries.js': sha(path.join(__dirname, 'e1_score_queries.js')) };
  if (stage === 'decisions' || stage === 'all') {
    writeNew(path.join(outDir, 'logical_checks.json'), JSON.stringify(checks, null, 2));
    writeNew(path.join(outDir, 'decisions_p1.json'), JSON.stringify({ thresholds: { R2: R2_T, R3: R3_U, R2_median: R2_MED, R3_median: R3_MED }, rows: dec1 }, null, 1));
    writeNew(path.join(outDir, 'decisions_p2.json'), JSON.stringify({ thresholds: { R2: R2_T, R3: R3_U, R2_median: R2_MED, R3_median: R3_MED }, rows: dec2 }, null, 1));
    const git = a => { try { return execFileSync('git', a, { cwd: path.join(__dirname, '..', '..') }).toString().trim(); } catch (e) { return null; } };
    const root = path.join(__dirname, '..', '..');
    const manifest = {
      protocol_tag: 'e1-protocol-v1', tag_at_head: git(['tag', '--points-at', 'HEAD']) || null, commit: git(['rev-parse', 'HEAD']),
      node: process.version, synthetic_test_run: synthetic,
      data_sha256: synthetic ? 'skipped (synthetic test run)' : { 'research/data_external/clinc150/data_full.json': sha(path.join(root, 'research/data_external/clinc150/data_full.json')), 'research/data_external/clinc150/domains.json': sha(path.join(root, 'research/data_external/clinc150/domains.json')) },
      input_files_sha256: { scores_p1: sha(files.p1), scores_p2: sha(files.p2), meta_p1: sha(files.meta) },
      scorer_preflight: { P1: S1.preflight || null, P2: S2.preflight || null }, scorer_node: { P1: S1.node || null, P2: S2.node || null },
      script_sha256: scriptSha, bootstrap: { B, seed: SEED, rng: 'mulberry32' }, started, finished: new Date().toISOString()
    };
    writeNew(path.join(outDir, 'RUN_MANIFEST.json'), JSON.stringify(manifest, null, 2));
  }
  if (stage === 'summary') { // the stored decisions (E1-11) must equal the ones recomputed now
    [['decisions_p1.json', dec1], ['decisions_p2.json', dec2]].forEach(([f, decs]) => {
      const p = path.join(outDir, f);
      if (!fs.existsSync(p)) { console.error(`summary stage needs ${f} from the decisions stage`); process.exit(1); }
      if (JSON.stringify(JSON.parse(fs.readFileSync(p, 'utf-8')).rows) !== JSON.stringify(decs)) { console.error(`${f} differs from the decisions recomputed from the scores; run BLOCKED`); process.exit(1); }
    });
  }
  if (stage === 'summary' || stage === 'all') {
    const P1 = analysePopulation('P1', rows1, dec1, clusterOf), P2 = analysePopulation('P2', rows2, dec2, null);
    P1.v0_2_comparison = v02Comparison(P1, v02); P2.v0_2_comparison = v02Comparison(P2, v02);
    const summary = {
      protocol: 'research/publication_tasks/e1/E1_PROTOCOL.md §6 (tag e1-protocol-v1)', generated_at: new Date().toISOString(),
      synthetic_test_run: synthetic, script_sha256: scriptSha, thresholds: { R2: R2_T, R3: R3_U, R2_median: R2_MED, R3_median: R3_MED },
      logical_checks_pass: true, P1, P2, P1_extras: p1Extras(rows1, dec1, meta, clusterOf, v02)
    };
    writeNew(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
    writeNew(path.join(outDir, 'summary.md'), md(summary));
  }
  console.log(`e1_analyze: logical checks pass; stage ${stage}; wrote to ${outDir}`);
}

if (require.main === module) main();

module.exports = { decide, logicalChecks, holm, clusterBootstrap, analysePopulation, R2_T, R3_U, R2_MED, R3_MED };
