/**
 * API Client for AuraVoice RAG Backend.
 */

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health');
  return res.json();
}

export async function queryVoice({ audioBlob, engine = 'sarvam', languageCode = 'hi-IN', strategy = 'semantic_splitting', topK = 5 }) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');
  formData.append('engine', engine);
  formData.append('language_code', languageCode);
  formData.append('strategy', strategy);
  formData.append('top_k', topK);

  const res = await fetch(`${API_BASE}/voice/query`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Voice query failed' }));
    throw new Error(err.detail || 'Voice query failed');
  }
  return res.json();
}

export async function queryText({ query, strategy = 'semantic_splitting', topK = 5, language = 'en' }) {
  const res = await fetch(`${API_BASE}/text/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, strategy, top_k: topK, language })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Text query failed' }));
    throw new Error(err.detail || 'Text query failed');
  }
  return res.json();
}

export async function compareChunking({ text, title, language, domain }) {
  const res = await fetch(`${API_BASE}/chunking/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, title, language, domain })
  });
  if (!res.ok) throw new Error('Chunking comparison failed');
  return res.json();
}

export async function runBenchmark(count = 50, strategy = 'semantic_splitting') {
  const res = await fetch(`${API_BASE}/benchmark/run?count=${count}&strategy=${strategy}`);
  if (!res.ok) throw new Error('Benchmark execution failed');
  return res.json();
}

export async function fetchLatestBenchmark() {
  const res = await fetch(`${API_BASE}/benchmark/latest`);
  if (!res.ok) throw new Error('Failed to fetch benchmark');
  return res.json();
}

export async function fetchDatasetDocuments() {
  const res = await fetch(`${API_BASE}/dataset/documents`);
  if (!res.ok) throw new Error('Failed to fetch dataset');
  return res.json();
}

export async function updateConfig(config) {
  const res = await fetch(`${API_BASE}/config/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error('Failed to update config');
  return res.json();
}
