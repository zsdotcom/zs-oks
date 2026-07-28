let embedder: any = null;

async function initEmbedder() {
  if (embedder) return embedder;
  try {
    // @ts-expect-error - CDN dynamic import, not an npm package
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0/dist/transformers.min.js');
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { device: 'wasm' });
    return embedder;
  } catch (e) {
    console.warn('Transformers.js init failed, falling back to zero vector:', e);
    return null;
  }
}

self.onmessage = async (e: MessageEvent<{ type: 'embed'; texts: string[]; id: number }>) => {
  if (e.origin !== '' && e.origin !== self.origin) return;
  const { texts, id } = e.data;
  const pipe = await initEmbedder();
  if (!pipe) {
    self.postMessage({ id, embeddings: texts.map(() => []) });
    return;
  }
  const embeddings: number[][] = [];
  for (const text of texts) {
    const output = await pipe(text, { pooling: 'mean', normalize: true });
    embeddings.push(Array.from(output.data));
  }
  self.postMessage({ id, embeddings });
};
