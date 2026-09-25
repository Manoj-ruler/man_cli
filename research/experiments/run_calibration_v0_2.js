// v0.2 pipeline -- identical isotonic-calibration logic to run_calibration.js, pointed at v0.2's
// folds/baseline-reproduction/reliability-features/candidates (research/results/v0.2/).

const fs = require('fs');
const path = require('path');
const isotonic = require('./isotonic');

const projectRoot = path.join(__dirname, '..', '..');
const v2Dir = path.join(projectRoot, 'research/results/v0.2');
const folds = JSON.parse(fs.readFileSync(path.join(v2Dir, 'folds.json'), 'utf-8'));
const K = folds.k;

function isMatch(gold, acceptable, predicted) {
  const valid = new Set([gold, ...(acceptable || [])].filter(Boolean));
  return valid.has(predicted);
}

const baselineRepro = JSON.parse(fs.readFileSync(path.join(v2Dir, 'reproduction-results.json'), 'utf-8'));
const reliabilityFeat = JSON.parse(fs.readFileSync(path.join(v2Dir, 'reliability_features.json'), 'utf-8')).features;
const candidates = JSON.parse(fs.readFileSync(path.join(v2Dir, 'candidates.json'), 'utf-8')).candidates;
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

function ece(pairs, nBins = 10) {
  const bins = Array.from({ length: nBins }, () => ({ sumConf: 0, sumHit: 0, count: 0 }));
  pairs.forEach(({ conf, hit }) => {
    let idx = Math.floor(conf * nBins);
    if (idx >= nBins) idx = nBins - 1;
    if (idx < 0) idx = 0;
    bins[idx].sumConf += conf; bins[idx].sumHit += hit; bins[idx].count += 1;
  });
  let total = pairs.length, weightedGap = 0;
  bins.forEach(b => { if (b.count > 0) weightedGap += (b.count / total) * Math.abs((b.sumConf / b.count) - (b.sumHit / b.count)); });
  const binDetail = bins.map((b, i) => {
    if (b.count === 0) return { bin: i, count: 0 };
    const avgConf = b.sumConf / b.count, avgAcc = b.sumHit / b.count;
    return { bin: i, count: b.count, avg_confidence: +avgConf.toFixed(4), avg_accuracy: +avgAcc.toFixed(4), gap: +Math.abs(avgConf - avgAcc).toFixed(4) };
  });
  return { ece: +weightedGap.toFixed(4), bins: binDetail };
}
function brier(pairs) { return +(pairs.reduce((a, { conf, hit }) => a + (conf - hit) ** 2, 0) / pairs.length).toFixed(4); }

function runVariant(name, rawOf, hitOf) {
  const pooledBefore = [], pooledAfter = [];
  for (let testFold = 0; testFold < K; testFold++) {
    const testIds = allIds.filter(id => folds.assignment[id] === testFold);
    const devIds = allIds.filter(id => folds.assignment[id] !== testFold);
    const devPairs = devIds.map(id => ({ x: rawOf.get(id), y: hitOf.get(id) }));
    const blocks = isotonic.fit(devPairs);
    testIds.forEach(id => {
      const raw = rawOf.get(id), hit = hitOf.get(id);
      pooledBefore.push({ conf: raw, hit });
      pooledAfter.push({ conf: isotonic.predict(blocks, raw), hit });
    });
  }
  const before = ece(pooledBefore), after = ece(pooledAfter);
  return { name, before_calibration: { ece: before.ece, brier: brier(pooledBefore) }, after_calibration: { ece: after.ece, brier: brier(pooledAfter) }, before_bins: before.bins, after_bins: after.bins };
}

function main() {
  const results = {};
  for (const [name, { rawOf, hitOf }] of Object.entries(variants)) results[name] = runVariant(name, rawOf, hitOf);

  const output = { experiment_id: 'E8-v0.2-confidence-calibration', benchmark_version: 'v0.2', protocol: 'nested 5-fold CV isotonic regression (PAV)', variants: results, generated_at: new Date().toISOString() };
  fs.writeFileSync(path.join(v2Dir, 'calibration-results.json'), JSON.stringify(output, null, 2), 'utf-8');

  console.log('=== v0.2 CONFIDENCE CALIBRATION RESULTS ===\n');
  Object.values(results).forEach(r => {
    console.log(`${r.name}: Before ECE=${r.before_calibration.ece} Brier=${r.before_calibration.brier}  After ECE=${r.after_calibration.ece} Brier=${r.after_calibration.brier}  (relative ECE reduction: ${((r.before_calibration.ece - r.after_calibration.ece) / r.before_calibration.ece * 100).toFixed(1)}%)`);
  });
  console.log(`\nWrote ${path.join(v2Dir, 'calibration-results.json')}`);
}

main();
