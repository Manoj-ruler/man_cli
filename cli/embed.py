"""
TermAssist — Local Embedding + FAISS Search

Usage:
  python embed.py "find all python files modified today"
  python embed.py --build-index

Requires:
  pip install sentence-transformers faiss-cpu
"""

import sys
import os
import json
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, 'data')
INDEX_PATH = os.path.join(DATA_DIR, 'index.faiss')
COMMANDS_PATH = os.path.join(DATA_DIR, 'commands.json')
MODEL_NAME = 'all-MiniLM-L6-v2'


def load_model():
    """Load the sentence transformer model."""
    from sentence_transformers import SentenceTransformer
    return SentenceTransformer(MODEL_NAME)


def build_index():
    """Build FAISS index from commands.json."""
    import faiss

    print(f"Loading model: {MODEL_NAME}...")
    model = load_model()

    print(f"Loading commands from {COMMANDS_PATH}...")
    with open(COMMANDS_PATH, 'r') as f:
        commands = json.load(f)

    # Create embeddings from intent text
    intents = [cmd['intent'] for cmd in commands]
    print(f"Encoding {len(intents)} commands...")
    embeddings = model.encode(intents, normalize_embeddings=True, show_progress_bar=True)

    # Build FAISS index (Inner Product on normalized vectors = cosine similarity)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings.astype(np.float32))

    # Save index
    faiss.write_index(index, INDEX_PATH)
    print(f"Index saved to {INDEX_PATH} ({index.ntotal} vectors, {dim} dimensions)")
    print("Done!")


def search(query):
    """Search for the best matching command."""
    import faiss

    model = load_model()

    # Load index and commands
    index = faiss.read_index(INDEX_PATH)
    with open(COMMANDS_PATH, 'r') as f:
        commands = json.load(f)

    # Encode query
    vec = model.encode([query], normalize_embeddings=True)

    # Search
    D, I = index.search(vec.astype(np.float32), k=1)
    score = float(D[0][0])
    match = commands[I[0][0]]

    result = {
        'command': match['command'],
        'score': score,
        'category': match.get('category', 'general'),
        'description': match.get('description', ''),
    }

    print(json.dumps(result))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python embed.py <query>")
        print("       python embed.py --build-index")
        sys.exit(1)

    if sys.argv[1] == '--build-index':
        build_index()
    else:
        query = sys.argv[1]
        search(query)
