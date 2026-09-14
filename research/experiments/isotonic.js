// Phase 8 -- minimal Pool-Adjacent-Violators (PAV) isotonic regression, used to post-hoc
// calibrate raw retrieval scores into probability-of-correctness estimates. No external
// stats library dependency; PAV is a well-established, simple-to-verify algorithm (monotonic
// least-squares fit), and correctness here is checked by an explicit monotonicity assertion
// in fit(), not just assumed.

// pairs: [{x, y}] with y in {0,1}.
//
// BUG FIX (found via a Phase 8 sanity check on real data, not synthetic): tied x-values MUST
// be pre-aggregated into a single weighted point before running PAV. Pushing one point per raw
// pair and relying on the stack-merge step to reconcile ties is WRONG when many points share
// the same x -- the stack only merges when a LATER point's average is lower than the block
// immediately above it; several tied points with different y values processed in raw order can
// end up split across two separate blocks that both claim to cover the same x (verified: on the
// baseline_confidence variant, x=1.0 producing distinct blocks [0.94,1]=0.353 and [1,1]=0.868
// simultaneously, an invalid, overlapping-range step function). Aggregating ties first (weight
// = count of that x, sum = sum of y at that x) guarantees one point per unique x and eliminates
// the ambiguity entirely -- this matches how standard isotonic regression implementations
// (e.g. scikit-learn's IsotonicRegression) handle repeated x-values internally.
function fit(pairs) {
  const grouped = new Map(); // x -> { sum, weight }
  pairs.forEach(p => {
    const g = grouped.get(p.x) || { sum: 0, weight: 0 };
    g.sum += p.y; g.weight += 1;
    grouped.set(p.x, g);
  });
  const sorted = [...grouped.entries()].sort((a, b) => a[0] - b[0]).map(([x, g]) => ({ x, sum: g.sum, weight: g.weight }));

  const stack = [];
  for (const p of sorted) {
    stack.push({ sum: p.sum, weight: p.weight, xMin: p.x, xMax: p.x });
    while (stack.length > 1 && (stack[stack.length - 2].sum / stack[stack.length - 2].weight) > (stack[stack.length - 1].sum / stack[stack.length - 1].weight)) {
      const top = stack.pop();
      const prev = stack.pop();
      stack.push({ sum: prev.sum + top.sum, weight: prev.weight + top.weight, xMin: prev.xMin, xMax: top.xMax });
    }
  }
  const blocks = stack.map(b => ({ xMin: b.xMin, xMax: b.xMax, value: b.sum / b.weight }));
  // Correctness check 1: block x-ranges must never overlap (this is what the tie-aggregation
  // fix above prevents -- caught a real bug during Phase 8 where two blocks both claimed x=1.0
  // with different values, a symptom of pushing raw un-aggregated points through PAV).
  for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].xMin <= blocks[i - 1].xMax) {
      throw new Error(`Isotonic fit produced overlapping block x-ranges at block ${i} (prev xMax=${blocks[i - 1].xMax}, this xMin=${blocks[i].xMin}) -- implementation bug, aborting rather than returning an invalid calibrator.`);
    }
  }
  // Correctness check 2: block values must be non-decreasing by construction of PAV.
  for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].value < blocks[i - 1].value - 1e-9) {
      throw new Error(`Isotonic fit produced a non-monotonic result at block ${i} -- implementation bug, aborting rather than returning an invalid calibrator.`);
    }
  }
  return blocks;
}

// Step-function prediction: value of the block containing x, or the nearest boundary block's
// value if x falls outside the training range (standard isotonic-regression extrapolation).
function predict(blocks, x) {
  if (blocks.length === 0) return 0.5;
  if (x <= blocks[0].xMax && x < blocks[0].xMin) return blocks[0].value;
  for (const b of blocks) {
    if (x >= b.xMin && x <= b.xMax) return b.value;
  }
  if (x < blocks[0].xMin) return blocks[0].value;
  if (x > blocks[blocks.length - 1].xMax) return blocks[blocks.length - 1].value;
  // x falls in a gap between blocks (no training point exactly there): use the preceding block.
  let val = blocks[0].value;
  for (const b of blocks) { if (b.xMin <= x) val = b.value; }
  return val;
}

module.exports = { fit, predict };
