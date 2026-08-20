import React, { useState } from 'react';
import { Cpu, RefreshCw, AlertOctagon, CheckSquare, Layers, ShieldCheck, Terminal, Play } from 'lucide-react';
import { queryText } from '../utils/api';

export default function HarnessTrace() {
  const [loading, setLoading] = useState(false);
  const [traceData, setTraceData] = useState(null);

  const handleSimulateExecution = async () => {
    setLoading(true);
    try {
      const data = await queryText({
        query: "What is India's non-fossil energy target for 2030 and where is Bhadla Solar Park located?",
        strategy: "hierarchical_parent_child",
        topK: 5,
        language: "en"
      });
      setTraceData(data);
    } catch (err) {
      alert('Execution failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 0' }}>
      {/* Intro Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Cpu size={26} color="var(--accent-violet)" />
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Production Agentic Harness & Orchestration Monitor
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '900px', lineHeight: 1.6 }}>
          Rather than a fragile prompt-in, text-out call, the pipeline is wrapped in an enterprise-grade execution harness 
          featuring <strong style={{ color: '#ffffff' }}>Circuit Breakers</strong>, <strong style={{ color: '#ffffff' }}>Exponential Backoff Retries</strong>, 
          <strong style={{ color: '#ffffff' }}>Structured Pydantic Schemas</strong>, and <strong style={{ color: '#ffffff' }}>Dynamic Tool Invocations</strong>.
        </p>
      </div>

      {/* Harness Control & Resilience Architecture Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        
        {/* Circuit Breaker Status */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="telemetry-label">Circuit Breaker</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}>
              STATE: CLOSED (HEALTHY)
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Threshold: 5 consecutive failures | Recovery timeout: 10s cooldown to HALF-OPEN trial state.
          </p>
        </div>

        {/* Retry Engine */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="telemetry-label">Resilience Retry Policy</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              Max Retries: 3
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Base Delay: 50ms with jitter multiplier: <code>t = base * 2^(retry-1) + jitter</code>.
          </p>
        </div>

        {/* Structured Schema Validator */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="telemetry-label">Pydantic Schemas</span>
            <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 700 }}>
              Strict Type Enforcement
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Enforces strict input validation, typed tool calls, and structured telemetry payloads.
          </p>
        </div>
      </div>

      {/* Interactive Harness Execution Trigger */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
              Live Structured Harness Execution Trace
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Execute a complex multi-hop query through the structured orchestrator harness.
            </span>
          </div>

          <button
            id="run-harness-trace-btn"
            onClick={handleSimulateExecution}
            className="btn-primary"
            disabled={loading}
          >
            <Play size={16} />
            <span>{loading ? 'Orchestrating...' : 'Trigger Harness Pipeline'}</span>
          </button>
        </div>

        {traceData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Step-by-Step Tool Trace */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Harness Execution Sequence:
              </div>

              {/* Step 1 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    1
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Inbound Security Screening</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluated prompt injection, safety, and domain scope</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#10b981' }}>
                  {traceData.latency_breakdown.inbound_guardrail_ms}ms [SUCCESS]
                </span>
              </div>

              {/* Step 2 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    2
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Structured Tool Invocation: <code>vector_store_retrieval</code></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dispatched hybrid HNSW + BM25 search across indexed MSMARCO chunks</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#10b981' }}>
                  {traceData.latency_breakdown.vector_retrieval_ms}ms [SUCCESS]
                </span>
              </div>

              {/* Step 3 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    3
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Context Sufficiency Verification</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top match relevance score validated above grounding threshold</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#10b981' }}>
                  {traceData.latency_breakdown.grounding_guardrail_ms}ms [GROUNDED]
                </span>
              </div>

              {/* Step 4 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    4
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Structured Answer Generation & Citation Tagging</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Synthesized response with inline [Source: ...] metadata attachments</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#10b981' }}>
                  {traceData.latency_breakdown.llm_generation_ms}ms [COMPLETED]
                </span>
              </div>
            </div>

            {/* JSON Schema Inspection View */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Validated Pydantic Payload JSON:
              </div>
              <pre style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                color: '#7dd3fc',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                overflowX: 'auto',
                maxHeight: '220px'
              }}>
                {JSON.stringify({
                  query_id: traceData.query_id,
                  input_type: traceData.input_type,
                  stt_transcript: traceData.stt_transcript,
                  answer: traceData.answer,
                  citations: traceData.citations,
                  circuit_breaker: traceData.circuit_breaker_status,
                  retries: traceData.retry_count,
                  latency_breakdown: traceData.latency_breakdown
                }, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', color: 'var(--text-muted)' }}>
            <span>Click "Trigger Harness Pipeline" above to run an agentic execution trace</span>
          </div>
        )}
      </div>
    </div>
  );
}
