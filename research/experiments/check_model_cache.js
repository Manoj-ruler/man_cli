// T16 (research/PLAN_TASKS.md): verifies that the embedding model files are the exact ones the
// committed results were produced with, before any dense or hybrid experiment runs.
//
// @xenova/transformers 2.17.2 caches downloaded models inside
// research/node_modules/@xenova/transformers/.cache/, so a fresh `npm ci` deletes them and the
// next run downloads them again from the Hugging Face Hub. The Hub copy could change, so this
// script pins the four files by SHA-256 (recorded 2026-09-28 from the cache that produced the
// committed results).
//   node check_model_cache.js            -> verify; exit 1 if any file is missing or different
//   node check_model_cache.js --fetch    -> if files are missing, download them once (network)
//                                           through the library, then verify
// To run fully offline, copy a verified .cache/Xenova/all-MiniLM-L6-v2 directory into place
// (research/REPRODUCE.md).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MODEL = 'Xenova/all-MiniLM-L6-v2';
const cacheRoot = path.join(__dirname, '..', 'node_modules', '@xenova', 'transformers', '.cache');
const EXPECTED = {
  'config.json': { bytes: 650, sha256: '7135149f7cffa1a573466c6e4d8423ed73b62fd2332c575bf738a0d033f70df7' },
  'onnx/model_quantized.onnx': { bytes: 22972370, sha256: 'afdb6f1a0e45b715d0bb9b11772f032c399babd23bfc31fed1c170afc848bdb1' },
  'tokenizer.json': { bytes: 711661, sha256: 'da0e79933b9ed51798a3ae27893d3c5fa4a201126cef75586296df9b4d2c62a0' },
  'tokenizer_config.json': { bytes: 366, sha256: '9261e7d79b44c8195c1cada2b453e55b00aeb81e907a6664974b4d7776172ab3' }
};

function check() {
  const problems = [];
  for (const [rel, want] of Object.entries(EXPECTED)) {
    const p = path.join(cacheRoot, MODEL, rel);
    if (!fs.existsSync(p)) { problems.push(`missing: ${rel}`); continue; }
    const buf = fs.readFileSync(p);
    const sha = crypto.createHash('sha256').update(buf).digest('hex');
    if (buf.length !== want.bytes || sha !== want.sha256) problems.push(`different: ${rel} (${buf.length} bytes, sha256 ${sha.slice(0, 12)}...)`);
  }
  return problems;
}

(async () => {
  let problems = check();
  if (problems.length && process.argv.includes('--fetch') && problems.every(p => p.startsWith('missing'))) {
    console.log(`Downloading ${MODEL} once through @xenova/transformers...`);
    const { pipeline } = await import('@xenova/transformers');
    await pipeline('feature-extraction', MODEL);
    problems = check();
  }
  if (problems.length) {
    problems.forEach(p => console.error('FAIL  ' + p));
    console.error(`\nThe embedding model cache does not match the files the committed results were produced with.`);
    console.error(`Dense/hybrid numbers may differ. See research/REPRODUCE.md.`);
    process.exit(1);
  }
  console.log(`model cache OK: ${MODEL}, ${Object.keys(EXPECTED).length} files match the recorded SHA-256`);
})();
