// Phase 8 (E8) -- confidence calibration for 4 raw confidence variants, using nested 5-fold CV
// isotonic regression (dev-only fitting, test-fold-only evaluation, same discipline as every
// prior phase). Reports ECE and Brier score before (raw score treated/normalized as a naive
// probability) and after calibration, pooled across all 5 test folds.
//
// Variants:
//   baseline_confidence  -- the PRODUCTION formula (score/8*100, capped, thresholded at 2.0),
//                            already in [0,100]; this is the exact confidence value a real user
//                            of the shipped CLI sees today.
//   margin_confidence    -- hybrid (A3) top1-vs-top2 margin, globally min-max normalized to
//                            [0,1] for a fair "before calibration" comparison (normalization is
//                            unsupervised -- uses only the score values, never the correctness
//                            labels -- so computing it over all 150 queries is not a leakage
//                            risk in the way label-supervised threshold/alpha tuning would be;
//                            only the isotonic fit itself, which DOES use labels, is nested-CV'd)
//   semantic_confidence  -- dense (A2) top1 cosine similarity, globally min-max normalized
//   hybrid_reliability   -- hybrid (A3) fused top1 score, already in [0,1] by construction

const fs = require('fs');
const path = require('path');
const isotonic = require('./isotonic');

const projectRoot = path.join(__dirname, '..', '..');
const folds = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/hybrid/folds.json'), 'utf-8'));
const K = folds.k;

function isMatch(gold, acceptable, predicted) {
  const valid = new Set([gold, ...(acceptable || [])].filter(Boolean));
  return valid.has(predicted);
}

// --- Load per-query raw signals + hit labels for each variant ---
const baselineRepro = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/baseline/reproduction-results.json'), 'utf-8'));
const reliabilityFeat = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/reliability/reliability_features.json'), 'utf-8')).features;
const candidates = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/results/reliability/candidates.json'), 'utf-8')).candidates;
const denseCands = candidates.filter(c => c.system === 'dense');

const baselineHitOf = new Map(baselineRepro.map(r => [r.id, ['CORRECT', 'AMBIGUOUS_CORRECT'].includes(r.evaluation.status) ? 1 : 0]));
const baselineConfOf = new Map(baselineRepro.map(r => [r.id, r.actual.confidence / 100]));

const hybridHitOf = new Map(reliabilityFeat.map(f => [f.id, f.hit ? 1 : 0]));
const marginOf = new Map(reliabilityFeat.map(f => [f.id, f.margin]));
const hybridReliabilityOf = new Map(reliabilityFeat.map(f => [f.id, f.top1_score]));

const denseHitOf = new Map(denseCands.map(c => [c.id, isMatch(c.gold_command, c.acceptable_commands, c.top1_command) ? 1 : 0]));
const denseScoreOf = new Map(denseCands.map(c => [c.id, c.top1_score]));

function minMaxNormalizeMap(map) {
  const vals = [...map.values()];
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min;
  const out = new Map();
  for (const [k, v] of map) out.set(k, range > 1e-9 ? (v - min) / range : 0.5);
  return out;
}

const marginNormalized = minMaxNormalizeMap(marginOf);
const denseNormalized = minMaxNormalizeMap(denseScoreOf);

const allIds = Object.keys(folds.assignment);

const variants = {
  baseline_confidence: { rawOf: baselineConfOf, hitOf: baselineHitOf },
  margin_confidence: { rawOf: marginNormalized, hitOf: hybridHitOf },
  semantic_confidence: { rawOf: denseNormalized, hitOf: denseHitOf },
  hybrid_reliability: { rawOf: hybridReliabilityOf, hitOf: hybridHitOf }
};

// --- ECE (10 equal-width bins) and Brier score ---
function ece(pairs, nBins = 10) {
  const bins = Array.from({ length: nBins }, () => ({ sumConf: 0, sumHit: 0, count: 0 }));
  pairs.forEach(({ conf, hit }) => {
    let idx = Math.floor(conf * nBins);
    if (idx >= nBins) idx = nBins - 1;
    if (idx < 0) idx = 0;
    bins[idx].sumConf += conf;
    bins[idx].sumHit += hit;
    bins[idx].count += 1;
  });
  let total = pairs.length, weightedGap = 0;
  const binDetail = bins.map((b, i) => {
    if (b.count === 0) return { bin: i, count: 0 };
    const avgConf = b.sumConf / b.count;
    const avgAcc = b.sumHit / b.count;
    weightedGap += (b.count / total) * Math.abs(avgConf - avgAcc);
    return { bin: i, count: b.count, avg_confidence: +avgConf.toFixed(4), avg_accuracy: +avgAcc.toFixed(4), gap: +Math.abs(avgConf - avgAcc).toFixed(4) };
  });
  return { ece: +weightedGap.toFixed(4), bins: binDetail };
}

function brier(pairs) {
  const sum = pairs.reduce((a, { conf, hit }) => a + (conf - hit) ** 2, 0);
  return +(sum / pairs.length).toFixed(4);
}

function runVariant(name, rawOf, hitOf) {
  const pooledBefore = [];
  const pooledAfter = [];
  const perFold = [];

  for (let testFold = 0; testFold < K; testFold++) {
    const testIds = allIds.filter(id => folds.assignment[id] === testFold);
    const devIds = allIds.filter(id => folds.assignment[id] !== testFold);

    const devPairs = devIds.map(id => ({ x: rawOf.get(id), y: hitOf.get(id) }));
    const blocks = isotonic.fit(devPairs);

    testIds.forEach(id => {
      const raw = rawOf.get(id);
      const hit = hitOf.get(id);
      pooledBefore.push({ conf: raw, hit });
      pooledAfter.push({ conf: isotonic.predict(blocks, raw), hit });
    });

    perFold.push({ test_fold: testFold, n_blocks_fitted: blocks.length });
  }

  const before = { ece: ece(pooledBefore), brier: brier(pooledBefore) };
  const after = { ece: ece(pooledAfter), brier: brier(pooledAfter) };

  return { name, per_fold: perFold, before_calibration: { ece: before.ece.ece, brier: before.brier }, after_calibration: { ece: after.ece.ece, brier: after.brier }, before_bins: before.ece.bins, after_bins: after.ece.bins };
}

function main() {
  const results = {};
  for (const [name, { rawOf, hitOf }] of Object.entries(variants)) {
    results[name] = runVariant(name, rawOf, hitOf);
  }

  const output = {
    experiment_id: 'E8-confidence-calibration',
    protocol: 'nested 5-fold CV isotonic regression (PAV): calibrator fit on dev folds only, applied once to held-out test fold, pooled across all 5 test folds for ECE/Brier.',
    variants: results,
    generated_at: new Date().toISOString()
  };

  const outDir = path.join(projectRoot, 'research/calibration');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'calibration-results.json'), JSON.stringify(output, null, 2), 'utf-8');

  console.log('=== CONFIDENCE CALIBRATION RESULTS (pooled across 5 test folds) ===\n');
  Object.values(results).forEach(r => {
    console.log(`${r.name}:`);
    console.log(`  Before -- ECE: ${r.before_calibration.ece}  Brier: ${r.before_calibration.brier}`);
    console.log(`  After  -- ECE: ${r.after_calibration.ece}  Brier: ${r.after_calibration.brier}`);
    console.log(`  Delta  -- ECE: ${(r.after_calibration.ece - r.before_calibration.ece).toFixed(4)}  Brier: ${(r.after_calibration.brier - r.before_calibration.brier).toFixed(4)}\n`);
  });

  console.log(`Wrote ${path.join(outDir, 'calibration-results.json')}`);
}

main();
