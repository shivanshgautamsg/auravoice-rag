import React, { useState, useEffect } from 'react';
import { Split, FileText, BarChart, CheckCircle, Info, Sparkles, Database, ArrowRight } from 'lucide-react';
import { compareChunking, fetchDatasetDocuments } from '../utils/api';

const STRATEGY_DETAILS = {
  semantic_splitting: {
    title: "Semantic Splitting",
    badge: "Embedding Distance & Boundary Inflection",
    color: "#38bdf8",
    description: "Evaluates embedding distances and semantic cohesion across sentences. Splits at natural topic shifts rather than arbitrary token boundaries."
  },
  hierarchical_parent_child: {
    title: "Hierarchical (Parent-Child)",
    badge: "Dual-Resolution Indexing",
    color: "#a855f7",
    description: "Indexes granular child chunks (40-60 tokens) for ultra-fast, pinpoint vector search while attaching rich parent contexts (250 tokens) for generation."
  },
  propositional_atomic: {
    title: "Propositional (Atomic Facts)",
    badge: "Clause Decomposition",
    color: "#10b981",
    description: "Deconstructs compound sentences into independent, self-contained factual assertions. Eliminates context noise for high-precision factual QA."
  },
  metadata_aware_contextual: {
    title: "Metadata-Aware & Contextual",
    badge: "Context Enrichment",
    color: "#f59e0b",
    description: "Injects structured document titles, domain ontologies, language tags, and section breadcrumbs directly into chunk text and vector representations."
  },
  dynamic_sliding_window: {
    title: "Dynamic Sliding Window",
    badge: "Sentence Boundary Preserving",
    color: "#ec4899",
    description: "Sliding window with configurable token overlap and sentence-boundary alignment, preventing mid-word or mid-sentence semantic truncation."
  }
};

export default function ChunkingLab() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [customText, setCustomText] = useState('');
  const [title, setTitle] = useState('Chandrayaan-3 Lunar Mission');
  const [domain, setDomain] = useState('Space Science & Technology');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState('semantic_splitting');

  useEffect(() => {
    fetchDatasetDocuments().then(data => {
      if (data.documents && data.documents.length > 0) {
        setDocuments(data.documents);
        setSelectedDocId(data.documents[0].id);
        setCustomText(data.documents[0].passage);
        setTitle(data.documents[0].title);
        setDomain(data.documents[0].domain);
      }
    }).catch(console.error);
  }, []);

  const handleDocChange = (docId) => {
    setSelectedDocId(docId);
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setCustomText(doc.passage);
      setTitle(doc.title);
      setDomain(doc.domain);
    }
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
      alert('Chunking comparison failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customText) {
      handleRunComparison();
    }
  }, [selectedDocId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 0' }}>
      {/* Intro Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Split size={24} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Multi-Strategy Chunking & Decomposition Lab
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '900px', lineHeight: 1.6 }}>
          Explore and benchmark all 5 advanced chunking architectures on the <code style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>MSMARCO-XI</code> dataset. 
          Compare semantic cohesion, token distribution, parent-child links, and microsecond indexing latencies side-by-side.
        </p>
      </div>

      {/* Control Station: Document Picker & Text Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Select MSMARCO-XI Document:
          </span>

          <select
            id="doc-selector"
            value={selectedDocId}
            onChange={(e) => handleDocChange(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.07)',
              color: 'white',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '0.88rem'
            }}
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.domain})
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Document Title:</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: 'white',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Knowledge Domain:</span>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: 'white',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <button
            id="run-chunking-compare-btn"
            onClick={handleRunComparison}
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Evaluating...' : 'Re-compute All Strategies'}</span>
          </button>
        </div>

        {/* Text Area */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Passage Text Payload:
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {customText.length} characters | ~{Math.round(customText.split(/\s+/).length)} tokens
            </span>
          </div>

          <textarea
            id="chunking-text-input"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={7}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Strategy Comparison Cards */}
      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {Object.keys(STRATEGY_DETAILS).map((stratKey) => {
              const info = STRATEGY_DETAILS[stratKey];
              const res = results[stratKey];
              const isSelected = activeStrategy === stratKey;

              return (
                <div
                  key={stratKey}
                  id={`strategy-card-${stratKey}`}
                  onClick={() => setActiveStrategy(stratKey)}
                  style={{
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(13, 17, 26, 0.6)',
                    border: `1px solid ${isSelected ? info.color : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected ? `0 0 20px -5px ${info.color}40` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                      {info.title}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {res?.latency_ms}ms
                    </span>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: info.color, fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                    {info.badge}
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CHUNKS</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {res?.total_chunks}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AVG TOKENS</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        {res?.avg_tokens_per_chunk}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Strategy Detailed Chunk Inspector */}
          {results[activeStrategy] && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: STRATEGY_DETAILS[activeStrategy].color
                  }}></div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {STRATEGY_DETAILS[activeStrategy].title} Output Inspector ({results[activeStrategy].total_chunks} Chunks)
                  </h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Min: {results[activeStrategy].min_tokens} tok | Max: {results[activeStrategy].max_tokens} tok
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
                {STRATEGY_DETAILS[activeStrategy].description}
              </p>

              {/* Chunks Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {results[activeStrategy].chunks.map((chunk, idx) => (
                  <div
                    key={chunk.id || idx}
                    id={`chunk-detail-${idx}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <span style={{ color: STRATEGY_DETAILS[activeStrategy].color, fontWeight: 700 }}>
                        Chunk #{idx + 1}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {chunk.tokens} tokens
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: '#f1f5f9', lineHeight: 1.5, flex: 1 }}>
                      {chunk.text}
                    </div>

                    {chunk.metadata && Object.keys(chunk.metadata).length > 0 && (
                      <div style={{
                        marginTop: '6px',
                        padding: '6px 8px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {chunk.metadata.parent_id && <span>Parent: {chunk.metadata.parent_id} | </span>}
                        {chunk.metadata.boundary_type && <span>Boundary: {chunk.metadata.boundary_type}</span>}
                        {chunk.metadata.atomic_type && <span>Type: {chunk.metadata.atomic_type}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
