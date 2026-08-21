import React, { useState, useEffect } from 'react';
import { GitFork, FileText, CheckCircle2, Layers, Database, Split, Copy, Check, Play } from 'lucide-react';
import { compareChunking, fetchDatasetDocuments } from '../utils/api';

const PRESET_DOCS = [
  {
    doc_id: "msmarco_xi_hi_001",
    title: "Chandrayaan-3 Moon Mission",
    language: "hi",
    domain: "Space Exploration",
    passage: "Chandrayaan-3 is the third lunar exploration mission developed by the Indian Space Research Organisation (ISRO). It was launched on 14 July 2023 from Satish Dhawan Space Centre in Sriharikota, Andhra Pradesh. The mission consisted of a lunar lander named Vikram and a lunar rover named Pragyan. On 23 August 2023, the Vikram lander successfully executed a soft landing near the lunar south pole region at 18:04 IST. This historic achievement made India the fourth country to successfully land on the Moon and the first to reach the lunar south pole."
  },
  {
    doc_id: "msmarco_xi_en_002",
    title: "Unified Payments Interface (UPI)",
    language: "en",
    domain: "FinTech & Banking",
    passage: "Unified Payments Interface (UPI) is an instant real-time payment system developed by the National Payments Corporation of India (NPCI). Launched in April 2016, UPI facilitates inter-bank peer-to-peer and person-to-merchant transactions across mobile applications. UPI operates on a single 2-factor authentication mobile workflow, processing over 10 billion transactions per month as India's primary digital payment rail."
  },
  {
    doc_id: "msmarco_xi_bn_003",
    title: "National Quantum Mission",
    language: "bn",
    domain: "Deep Tech & Quantum",
    passage: "The National Quantum Mission was approved by the Union Cabinet of India with a total budget of ₹6,003 crore to seed, nurture, and scale scientific and industrial R&D in Quantum Technology (QT) from 2023 to 2031. The mission focuses on developing intermediate scale quantum computers with 50-1000 physical qubits in 8 years across superconducting and photonic platforms."
  },
  {
    doc_id: "msmarco_xi_ta_004",
    title: "Aditya-L1 Solar Mission",
    language: "ta",
    domain: "Astrophysics",
    passage: "Aditya-L1 is India's first dedicated solar observatory mission developed by ISRO. Launched on 2 September 2023 aboard PSLV-C57, the spacecraft was successfully inserted into a halo orbit around the Sun-Earth Lagrange point L1, roughly 1.5 million kilometers from Earth, to study solar coronal mass ejections and space weather."
  }
];

const STRATEGY_METADATA = {
  semantic_splitting: {
    title: "Semantic Splitting",
    tag: "Inflection Distance",
    icon: Split,
    summary: "Calculates embedding cosine distance shifts between adjacent sentences to detect topical inflection points."
  },
  hierarchical_parent_child: {
    title: "Hierarchical (Parent-Child)",
    tag: "Dual Resolution",
    icon: Layers,
    summary: "Indexes small child chunks (30-50 tokens) for fine-grained retrieval while attaching large parent chunks (200 tokens) for generation."
  },
  propositional_atomic: {
    title: "Propositional Atomic",
    tag: "Clause Decomposition",
    icon: CheckCircle2,
    summary: "Deconstructs compound sentences into atomic factual propositions to eliminate retrieval noise and prevent hallucination."
  },
  metadata_aware_contextual: {
    title: "Metadata-Aware Contextual",
    tag: "Domain Enriched",
    icon: Database,
    summary: "Prepends structured domain metadata, title hierarchies, and temporal tags directly into chunk embeddings."
  },
  dynamic_sliding_window: {
    title: "Dynamic Sliding Window",
    tag: "Sentence Aligned",
    icon: GitFork,
    summary: "Sliding window with 20% overlap aligned strictly to sentence boundaries, avoiding mid-sentence semantic truncation."
  }
};

export default function ChunkingLab() {
  const [documents, setDocuments] = useState(PRESET_DOCS);
  const [selectedDocId, setSelectedDocId] = useState(PRESET_DOCS[0].doc_id);
  const [customText, setCustomText] = useState(PRESET_DOCS[0].passage);
  const [title, setTitle] = useState(PRESET_DOCS[0].title);
  const [domain, setDomain] = useState(PRESET_DOCS[0].domain);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState('semantic_splitting');
  const [copiedChunkId, setCopiedChunkId] = useState(null);

  useEffect(() => {
    fetchDatasetDocuments().then(data => {
      if (data.documents && data.documents.length > 0) {
        const normalized = data.documents.map(d => ({
          doc_id: d.doc_id || d.id || "doc_" + Math.random(),
          title: d.title || "Document",
          domain: d.domain || "General",
          language: d.language || "en",
          passage: d.passage || d.content || ""
        }));
        setDocuments(normalized);
      }
    }).catch(() => {
      setDocuments(PRESET_DOCS);
    });
  }, []);

  const handleSelectPreset = (doc) => {
    setSelectedDocId(doc.doc_id);
    setCustomText(doc.passage);
    setTitle(doc.title);
    setDomain(doc.domain);
  };

  const handleRunComparison = async () => {
    if (!customText.trim()) return;
    setLoading(true);
    try {
      const data = await compareChunking({
        text: customText,
        title,
        domain,
        language: 'en'
      });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunComparison();
  }, [customText]);

  const copyChunk = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedChunkId(id);
    setTimeout(() => setCopiedChunkId(null), 2000);
  };

  const activeResult = results ? results[activeStrategy] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
      
      {/* Header Banner */}
      <div className="card-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitFork size={18} color="var(--accent-indigo)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Multi-Strategy Chunking Evaluation
              </h2>
              <span className="badge badge-neutral">5 Algorithms</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>
              Side-by-side benchmarking of 5 distinct chunking architectures on MSMARCO-XI data.
            </p>
          </div>
          <button 
            className="btn-primary" 
            onClick={handleRunComparison}
            disabled={loading}
          >
            <Play size={13} fill="currentColor" />
            {loading ? 'Evaluating...' : 'Re-Run Comparison'}
          </button>
        </div>

        {/* Preset Document Selectors */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            MSMARCO-XI CORPUS PASSAGES:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {documents.map((d) => (
              <button
                key={d.doc_id}
                onClick={() => handleSelectPreset(d)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: selectedDocId === d.doc_id ? '1px solid var(--border-default)' : '1px solid var(--border-subtle)',
                  background: selectedDocId === d.doc_id ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                  color: selectedDocId === d.doc_id ? '#ffffff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <FileText size={12} />
                <span>{d.title}</span>
                <span style={{ fontSize: '0.68rem', opacity: 0.6, fontFamily: 'var(--font-mono)' }}>[{d.language}]</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Passage */}
      <div className="card-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} color="var(--accent-indigo)" />
            Document Text
          </label>
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {customText.split(/\s+/).filter(Boolean).length} words • {customText.length} characters
          </span>
        </div>
        <textarea
          className="custom-input"
          style={{ minHeight: '80px', lineHeight: 1.5, resize: 'vertical', fontSize: '0.85rem' }}
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Enter document text to chunk..."
        />
      </div>

      {/* Strategy Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {Object.entries(STRATEGY_METADATA).map(([key, details]) => {
          const res = results ? results[key] : null;
          const isSelected = activeStrategy === key;
          const IconComp = details.icon;

          return (
            <div
              key={key}
              onClick={() => setActiveStrategy(key)}
              className="card-panel"
              style={{
                padding: '14px 16px',
                cursor: 'pointer',
                border: isSelected ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconComp size={15} color={isSelected ? '#ffffff' : 'var(--text-secondary)'} />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                    {details.title}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, minHeight: '32px', marginBottom: '10px' }}>
                {details.summary}
              </p>

              <div style={{
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CHUNKS</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {res ? res.total_chunks : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AVG TOKENS</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {res ? `${res.avg_tokens_per_chunk}` : '—'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chunk Decomposition Output */}
      {activeResult && (
        <div className="card-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>
                {STRATEGY_METADATA[activeStrategy].title} ({activeResult.chunks.length} Chunks)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
                Execution time: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>{activeResult.latency_ms} ms</span> • Token range: {activeResult.min_tokens} – {activeResult.max_tokens} tokens
              </p>
            </div>
            <span className="badge badge-pass">Sub-Millisecond Execution</span>
          </div>

          {/* Chunk Blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeResult.chunks.map((chunk, idx) => (
              <div
                key={chunk.chunk_id || idx}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-xs)'
                    }}>
                      Chunk #{idx + 1}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {chunk.tokens} tokens • {chunk.text.length} chars
                    </span>
                  </div>
                  <button
                    onClick={() => copyChunk(chunk.chunk_id || idx, chunk.text)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedChunkId === (chunk.chunk_id || idx) ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {copiedChunkId === (chunk.chunk_id || idx) ? <Check size={12} /> : <Copy size={12} />}
                    {copiedChunkId === (chunk.chunk_id || idx) ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.84rem', lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
                  {chunk.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
