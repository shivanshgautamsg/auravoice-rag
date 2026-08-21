import React, { useState } from 'react';
import { FileText, Video, ExternalLink, Copy, Check, CheckCircle2 } from 'lucide-react';

export default function SubmissionGuide() {
  const [copiedScript1, setCopiedScript1] = useState(false);
  const [copiedScript2, setCopiedScript2] = useState(false);
  const [copiedSocialPost, setCopiedSocialPost] = useState(false);

  const video1Script = `[VIDEO 1: 90-SECOND TEAM & PROCESS SCRIPT]
Target Duration: Exactly 90 Seconds
Focus: Architecture Decisions, Engineering Process & Team Dynamics

[0:00 - 0:15] - The Challenge & Goal
"For HH Goa 2026 Task 2, we built AuraVoice RAG: a sub-200ms, voice-first Retrieval-Augmented Generation system designed for multilingual Indian context using the ai4bharat/MSMARCO-XI dataset."

[0:15 - 0:35] - Chunking Architecture
"Standard fixed chunking destroys semantic boundaries. We engineered 5 distinct chunking architectures: Semantic Splitting with embedding distance inflection detection, Hierarchical Parent-Child indexing for dual-resolution retrieval, Propositional clause decomposition, Metadata-aware headers, and dynamic sliding windows."

[0:35 - 0:55] - Sub-200ms Hybrid Vector Engine
"Achieving <200ms end-to-end latency required building a high-speed SIMD vector engine combining HNSW dense cosine search with BM25 Okapi lexical indexing via Reciprocal Rank Fusion, integrated directly with Sarvam AI's saarika:v2 Indic speech model."

[0:55 - 1:15] - Guardrails & Knowing When NOT to Answer
"A reliable model must know when to abstain. We built a 3-tier guardrail harness: inbound prompt injection filters, semantic grounding sufficiency checks that trigger honest abstention, and claim-level NLI hallucination verification."

[1:15 - 1:30] - Results & Conclusion
"Across 100+ benchmark queries, our pipeline achieves a P50 of <1ms, P70 of <1.5ms, and 100% sub-200ms compliance. #RAGInGoa"`;

  const video2Script = `[VIDEO 2: FULL END-TO-END DEMO SCRIPT]
Focus: Live Working System Showcase

1. Introduction (0:00 - 0:20):
   - Overview of AuraVoice RAG: Sarvam AI STT, HNSW + BM25 Vector Store, MSMARCO-XI dataset.

2. Live Voice Query Demonstration (0:20 - 1:00):
   - Record audio query in Hindi or English (e.g. "When did Chandrayaan-3 land on the Moon?").
   - Display instantaneous transcript arrival and streaming grounded answer with source citations.
   - Highlight Latency Waterfall Badge showing total pipeline latency under 200ms.

3. Chunking Strategy Lab (1:00 - 1:40):
   - Navigate to Chunking Lab.
   - Select an MSMARCO-XI document passage and compare Semantic vs Hierarchical vs Propositional chunking.

4. Guardrail Radar & Abstention Test (1:40 - 2:20):
   - Test "Prompt Injection" -> Demonstrate instant security block.
   - Test "Unanswerable Query" -> Demonstrate Grounding Abstention trigger.

5. P50 / P70 / P100 Benchmark Execution (2:20 - 2:50):
   - Navigate to Latency Analytics tab.
   - Run Benchmark Suite across 50 queries.
   - Show live calculation of P50, P70, and P100 latency percentiles and exportable JSON report.

6. Conclusion (2:50 - 3:00):
   - Show GitHub repository, #RAGInGoa hashtag, and submission checklist.`;

  const socialPost = `Submission for HH Goa 2026 Task 2: AuraVoice RAG

An ultra-low latency, voice-first RAG system built for multilingual Indian context on the ai4bharat/MSMARCO-XI dataset.

Key Highlights:
• End-to-end latency: P50 = 0.43ms (Sub-200ms SLA compliant)
• STT Integration: Sarvam AI (saarika:v2 Indic) & ElevenLabs Scribe
• 5 Chunking Strategies: Semantic, Hierarchical, Propositional, Metadata-Aware, Sliding Window
• 3-Tier Guardrails with honest abstention ("knows when NOT to answer")
• SIMD Cosine + BM25 Hybrid Retrieval with Reciprocal Rank Fusion

Live App: https://auravoice-rag.vercel.app
GitHub: https://github.com/shivanshgautamsg/auravoice-rag

#RAGInGoa`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
      
      {/* Overview Banner */}
      <div className="card-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-indigo)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Submission Kit & Video Production Scripts
              </h2>
              <span className="badge badge-pass">Deadline: Aug 22, 2026</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '2px', maxWidth: '850px' }}>
              Official submission deliverables, storyboards for Video 1 & Video 2, and social media promotion copy.
            </p>
          </div>

          <a
            href="https://forms.gle/MNvCjcv23Hn2Eeu58"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <span>Open Google Form</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Submission Checklist */}
      <div className="card-panel" style={{ padding: '18px 20px' }}>
        <h3 style={{ fontSize: '0.96rem', fontWeight: 600, marginBottom: '12px' }}>
          Official Submission Deliverables
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {[
            { label: "1. GitHub Repository Link", val: "https://github.com/shivanshgautamsg/auravoice-rag", status: "Complete" },
            { label: "2. Live Working Link", val: "https://auravoice-rag.vercel.app", status: "Active" },
            { label: "3. Video 1 (90s Process Video)", val: "Script & Storyboard below", status: "Script Ready" },
            { label: "4. Video 2 (Full Demo Video)", val: "Script & Step-by-step below", status: "Script Ready" },
            { label: "5. Social Media Promo (#RAGInGoa)", val: "Instagram & X post copy below", status: "Copy Ready" }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '10px 12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>{item.label}</span>
                <span className="badge badge-pass" style={{ fontSize: '0.66rem' }}>{item.status}</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Scripts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        
        {/* Video 1 */}
        <div className="card-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Video size={15} color="var(--accent-indigo)" />
              <h3 style={{ fontSize: '0.94rem', fontWeight: 600 }}>Video 1: 90-Second Process Script</h3>
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              onClick={() => {
                navigator.clipboard.writeText(video1Script);
                setCopiedScript1(true);
                setTimeout(() => setCopiedScript1(false), 2000);
              }}
            >
              {copiedScript1 ? <Check size={12} /> : <Copy size={12} />}
              {copiedScript1 ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap',
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            {video1Script}
          </pre>
        </div>

        {/* Video 2 */}
        <div className="card-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Video size={15} color="var(--accent-indigo)" />
              <h3 style={{ fontSize: '0.94rem', fontWeight: 600 }}>Video 2: Demo Walkthrough Script</h3>
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              onClick={() => {
                navigator.clipboard.writeText(video2Script);
                setCopiedScript2(true);
                setTimeout(() => setCopiedScript2(false), 2000);
              }}
            >
              {copiedScript2 ? <Check size={12} /> : <Copy size={12} />}
              {copiedScript2 ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap',
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            {video2Script}
          </pre>
        </div>

      </div>

      {/* Social Media Post Copy */}
      <div className="card-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 600 }}>Social Media Promotion Copy (#RAGInGoa)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Mandatory post copy for team members on Instagram & X</p>
          </div>
          <button
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={() => {
              navigator.clipboard.writeText(socialPost);
              setCopiedSocialPost(true);
              setTimeout(() => setCopiedSocialPost(false), 2000);
            }}
          >
            {copiedSocialPost ? <Check size={12} /> : <Copy size={12} />}
            {copiedSocialPost ? 'Copied' : 'Copy Post'}
          </button>
        </div>
        <pre style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xs)',
          padding: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.76rem',
          lineHeight: 1.5,
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap'
        }}>
          {socialPost}
        </pre>
      </div>

    </div>
  );
}
