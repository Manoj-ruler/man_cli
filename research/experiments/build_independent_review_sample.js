// Spec §4.4 -- selects a stratified sample of the 59 v0.2 AI-authored queries for independent
// re-validation, and produces a BLIND review sheet: query text only, with NO indication of which
// category (OOD/AMBIGUOUS) the original labeling process assigned. The reviewer sees only the
// bare query and makes a fresh 3-way judgment. Their answers are compared against the ORIGINAL
// labels afterward, by a separate script (compute_kappa.js), never before or during their review.
//
// Sample size: spec requires >=20% of the 59 (i.e. >=12). We draw 14 (~24%), stratified
// proportionally across OOD (35) and AMBIGUOUS (24), seeded for reproducibility.

const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const entries = JSON.parse(fs.readFileSync(path.join(projectRoot, 'research/datasets/v0.2_new_entries.json'), 'utf-8'));
const rng = mulberry32(42);

const oodSample = seededShuffle(entries.ood, rng).slice(0, 8);   // 8/35 = 22.9%
const ambigSample = seededShuffle(entries.ambiguous, rng).slice(0, 6); // 6/24 = 25.0%
const sample = seededShuffle([...oodSample, ...ambigSample], rng); // interleave so order gives no hint

const reviewItems = sample.map((q, i) => ({
  review_id: `RV-${String(i + 1).padStart(2, '0')}`,
  query: q.query,
  // original label kept SEPARATE from the sheet the reviewer sees -- written to a different
  // file, never included in review_sheet.md/json below.
  _original_id: q.id,
  _original_label: q.query_type === 'ood' ? 'OOD' : 'AMBIGUOUS'
}));

// --- BLIND review sheet (no labels, no hints) ---
const outDir = path.join(projectRoot, 'research/datasets/independent_review');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let md = `# Independent Review Sheet — TermAssist Benchmark v0.2 Sample\n\n`;
md += `**Instructions:** For each query below, judge it fresh, as if a user typed it into a terminal-assistant tool. Do not look up or guess which "category" it was originally assigned — there is no original label shown here on purpose. For each query, choose exactly ONE:\n\n`;
md += `- **A** — There is a single command (or a couple of near-identical variants) that clearly and obviously satisfies this request.\n`;
md += `- **B** — There are two or more *genuinely different* valid commands/approaches that could satisfy this request, and the request doesn't specify enough to know which one is meant.\n`;
md += `- **C** — This isn't really a request a terminal/shell command can satisfy at all (e.g. it's not a computing task, or it names a tool/capability a typical curated shell-command list wouldn't include).\n\n`;
md += `Write your answer (A, B, or C) next to each item. Takes about 10-15 minutes for all ${reviewItems.length} items.\n\n---\n\n`;
reviewItems.forEach(r => { md += `**${r.review_id}.** "${r.query}"\n\nYour answer (A/B/C): ___\n\n`; });
fs.writeFileSync(path.join(outDir, 'review_sheet.md'), md, 'utf-8');

// Answer-key-free JSON for programmatic filling (same content, structured)
fs.writeFileSync(path.join(outDir, 'review_sheet.json'), JSON.stringify(reviewItems.map(r => ({ review_id: r.review_id, query: r.query, answer: null })), null, 2), 'utf-8');

// Answer key kept SEPARATE (not shown to reviewer) for later comparison
fs.writeFileSync(path.join(outDir, 'ANSWER_KEY_do_not_share_with_reviewer.json'), JSON.stringify(reviewItems.map(r => ({ review_id: r.review_id, original_id: r._original_id, original_label: r._original_label })), null, 2), 'utf-8');

console.log(`Sampled ${reviewItems.length} queries (${oodSample.length} OOD-labeled, ${ambigSample.length} AMBIGUOUS-labeled, order shuffled to give no hint).`);
console.log(`Wrote BLIND review sheet: ${path.join(outDir, 'review_sheet.md')} (and .json for programmatic use)`);
console.log(`Wrote answer key (kept separate): ${path.join(outDir, 'ANSWER_KEY_do_not_share_with_reviewer.json')}`);
console.log(`\nNEXT STEP: an independent reviewer (NOT the process that authored the original benchmark)`);
console.log(`fills in review_sheet.json's "answer" field with A/B/C for each item, WITHOUT seeing`);
console.log(`the answer key. Then run compute_kappa.js.`);
