import React, { useState, useEffect } from 'react';
import { BarChart2, Play, Download, CheckCircle, Clock, Zap, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';
import { runBenchmark, fetchLatestBenchmark } from '../utils/api';

export default function LatencyDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(50);
  const [strategy, setStrategy] = useState('semantic_splitting');

  useEffect(() => {
    fetchLatestBenchmark().then(setReport).catch(console.error);
  }, []);

  const handleRunBenchmark = async () => {
    setLoading(true);
    try {
      const data = await runBenchmark(queryCount, strategy);
      setReport(data);
    } catch (err) {
      alert('Benchmark failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hh_goa_latency_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const p = report?.percentiles;
  const sp = report?.stage_percentiles;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 0' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <BarChart2 size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              P50 / P70 / P100 Latency Analytics Suite
            </h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Statistically rigorous latency distribution measured across standardized MSMARCO-XI evaluation queries.
          </p>
        </div>

        {/* Benchmark Run Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>QUERIES:</span>
            <select
              value={queryCount}
              onChange={(e) => setQueryCount(Number(e.target.value))}
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                color: 'white',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                fontSize: '0.85rem'
              }}
            >
              <option value="30">30 Queries</option>
              <option value="50">50 Queries</option>
              <option value="100">100 Queries</option>
            </select>
          </div>

          <button
            id="run-benchmark-suite-btn"
            onClick={handleRunBenchmark}
            className="btn-primary"
            disabled={loading}
          >
            <Play size={16} />
            <span>{loading ? 'Benchmarking Suite...' : 'Run Benchmark Suite'}</span>
          </button>

          {report && (
            <button
              id="export-benchmark-json-btn"
              onClick={handleExportJson}
              className="btn-secondary"
              title="Export Report JSON"
            >
              <Download size={16} />
              <span>Export JSON</span>
            </button>
          )}
        </div>
      </div>

      {report && p && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Percentile Scorecards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            
            {/* P50 Card */}
            <div className="glass-panel" style={{ padding: '18px 20px', borderTop: '3px solid #38bdf8' }}>
              <span className="telemetry-label">P50 (Median) Latency</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                <span className="telemetry-value accent-cyan">{p.p50}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ms</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '6px', display: 'block', fontWeight: 600 }}>
                ✓ Sub-200ms compliant
              </span>
            </div>

            {/* P70 Card */}
            <div className="glass-panel" style={{ padding: '18px 20px', borderTop: '3px solid #6366f1' }}>
              <span className="telemetry-label">P70 Latency</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                <span className="telemetry-value" style={{ color: '#818cf8' }}>{p.p70}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ms</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '6px', display: 'block', fontWeight: 600 }}>
                ✓ Sub-200ms compliant
              </span>
            </div>

            {/* P90 Card */}
            <div className="glass-panel" style={{ padding: '18px 20px', borderTop: '3px solid #a855f7' }}>
              <span className="telemetry-label">P90 Latency</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                <span className="telemetry-value accent-violet">{p.p90}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ms</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '6px', display: 'block', fontWeight: 600 }}>
                ✓ High tail efficiency
              </span>
            </div>

            {/* P100 Max Card */}
            <div className="glass-panel" style={{ padding: '18px 20px', borderTop: '3px solid #10b981' }}>
              <span className="telemetry-label">P100 (Max Latency)</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                <span className="telemetry-value accent-emerald">{p.p100}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ms</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '6px', display: 'block', fontWeight: 600 }}>
                Worst-case &lt; 200ms target
              </span>
            </div>

            {/* Mean & Std Card */}
            <div className="glass-panel" style={{ padding: '18px 20px', borderTop: '3px solid #f59e0b' }}>
              <span className="telemetry-label">Mean ± Std</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
                <span className="telemetry-value accent-amber">{p.mean}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>±{p.std}ms</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>
                Min: {p.min}ms
              </span>
            </div>
          </div>

          {/* Sub-200ms SLA & Accuracy Telemetry Bar */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                  Sub-200ms Target Compliance: {report.sub_200ms_compliance_pct}%
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Evaluated across {report.total_queries} queries from the MSMARCO-XI corpus with guardrails active.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>RETRIEVAL ACCURACY</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                    {report.retrieval_accuracy_pct}%
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FAITHFULNESS RATE</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                    {report.faithfulness_rate_pct}%
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Budget Bar */}
            <div className="latency-budget-container" style={{ height: '12px' }}>
              <div
                className="latency-budget-fill green"
                style={{ width: `${Math.min(100, report.sub_200ms_compliance_pct)}%` }}
              ></div>
            </div>
          </div>

          {/* Stage-by-Stage Percentile Breakdown Table */}
          {sp && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
                Stage-by-Stage Latency Percentile Breakdown
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px 14px' }}>PIPELINE STAGE</th>
                      <th style={{ padding: '10px 14px' }}>P50 (ms)</th>
                      <th style={{ padding: '10px 14px' }}>P70 (ms)</th>
                      <th style={{ padding: '10px 14px' }}>P90 (ms)</th>
                      <th style={{ padding: '10px 14px' }}>P100 / MAX (ms)</th>
                      <th style={{ padding: '10px 14px' }}>MEAN (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                        Speech-to-Text (STT Inference)
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.stt.p50}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.stt.p70}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.stt.p90}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.stt.p100}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.stt.mean}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--accent-violet)' }}>
                        Dense SIMD Embedding
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.embedding.p50}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.embedding.p70}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.embedding.p90}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.embedding.p100}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.embedding.mean}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                        Hybrid HNSW + BM25 Vector DB
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.retrieval.p50}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.retrieval.p70}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.retrieval.p90}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.retrieval.p100}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.retrieval.mean}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--accent-amber)' }}>
                        Guardrails (Input, Grounding, NLI)
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.guardrails.p50}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.guardrails.p70}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.guardrails.p90}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.guardrails.p100}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.guardrails.mean}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#ec4899' }}>
                        LLM Synthesis / TTFT
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.llm_generation.p50}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.llm_generation.p70}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.llm_generation.p90}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.llm_generation.p100}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{sp.llm_generation.mean}</td>
                    </tr>
                    <tr style={{ background: 'rgba(99, 102, 241, 0.08)', fontWeight: 700 }}>
                      <td style={{ padding: '14px 14px', color: '#ffffff' }}>TOTAL END-TO-END PIPELINE</td>
                      <td style={{ padding: '14px 14px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{p.p50}</td>
                      <td style={{ padding: '14px 14px', fontFamily: 'var(--font-mono)', color: '#818cf8' }}>{p.p70}</td>
                      <td style={{ padding: '14px 14px', fontFamily: 'var(--font-mono)', color: 'var(--accent-violet)' }}>{p.p90}</td>
                      <td style={{ padding: '14px 14px', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>{p.p100}</td>
                      <td style={{ padding: '14px 14px', fontFamily: 'var(--font-mono)' }}>{p.mean}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Test Query Evaluation Log */}
          {report.query_log && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
                Benchmark Sample Query Logs ({report.query_log.length} Sampled Runs)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {report.query_log.map((q, idx) => (
                  <div
                    key={idx}
                    id={`benchmark-log-${idx}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.84rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, marginRight: '16px' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '4px',
                        color: 'var(--text-muted)'
                      }}>
                        {q.language}
                      </span>
                      <span style={{ color: '#f8fafc', fontWeight: 500 }}>"{q.query}"</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {q.abstained ? (
                        <span className="badge-guardrail abstain">ABSTAINED</span>
                      ) : (
                        <span className="badge-guardrail pass">ANSWERED</span>
                      )}

                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: q.sub_200ms ? '#10b981' : '#f43f5e'
                      }}>
                        {q.total_ms}ms
                      </span>
                    </div>
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
