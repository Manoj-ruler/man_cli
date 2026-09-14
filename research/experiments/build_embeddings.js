// Phase 3 -- precompute corpus embeddings for dense/hybrid retrieval experiments.
// Reads cli/data/commands.json directly (read-only) and writes a cache to
// research/models/corpus_embeddings.json. Never modifies cli/. Run once; the
// dense/hybrid search modules load this cache instead of recomputing per query
// (see repository-audit.md section 7, item 2 -- avoid mimicking the baseline's
// unfair-for-comparison per-call rebuild for the new methods' index).

const fs = require('fs');
const path = require('path');

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const EMBEDDING_DIM = 384;

const projectRoot = path.join(__dirname, '..', '..');
const commandsPath = path.join(projectRoot, 'cli', 'data', 'commands.json');
const outPath = path.join(projectRoot, 'research', 'models', 'corpus_embeddings.json');

function representCommand(cmd) {
  return `Intent: ${cmd.intent}\nDescription: ${cmd.description || ''}\nCategory: ${cmd.category || ''}\nPlatform: ${Array.isArray(cmd.os) ? cmd.os.join(',') : (cmd.os || 'all')}`;
}

async function main() {
  const { pipeline } = await import('@xenova/transformers');
  console.log(`Loading embedding model: ${MODEL_NAME} (first run downloads and caches weights locally; all subsequent runs are fully offline)`);
  const extractor = await pipeline('feature-extraction', MODEL_NAME);

  const commands = JSON.parse(fs.readFileSync(commandsPath, 'utf-8'));
  console.log(`Embedding ${commands.length} corpus entries...`);

  const embeddings = [];
  const batchSize = 16;
  for (let i = 0; i < commands.length; i += batchSize) {
    const batch = commands.slice(i, i + batchSize);
    const texts = batch.map(representCommand);
    for (let j = 0; j < texts.length; j++) {
      const output = await extractor(texts[j], { pooling: 'mean', normalize: true });
      embeddings.push(Array.from(output.data));
    }
    process.stdout.write(`\r  ${Math.min(i + batchSize, commands.length)}/${commands.length}`);
  }
  console.log('\nDone embedding corpus.');

  const cache = {
    model_name: MODEL_NAME,
    embedding_dim: EMBEDDING_DIM,
    representation: 'Intent/Description/Category/Platform structured text (see representCommand())',
    similarity_metric: 'cosine (vectors pre-normalized, so dot product = cosine)',
    generated_at: new Date().toISOString(),
    count: commands.length,
    entries: commands.map((cmd, idx) => ({
      intent: cmd.intent,
      command: cmd.command,
      category: cmd.category,
      description: cmd.description,
      os: cmd.os,
      embedding: embeddings[idx]
    }))
  };

  if (!fs.existsSync(path.dirname(outPath))) fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(cache), 'utf-8');
  console.log(`Wrote ${commands.length} embeddings (dim=${EMBEDDING_DIM}) to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
