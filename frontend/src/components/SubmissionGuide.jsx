import React, { useState } from 'react';
import { Award, Video, CheckCircle, ExternalLink, Copy, Share2, FileCode, CheckSquare, Sparkles } from 'lucide-react';

export default function SubmissionGuide() {
  const [copiedScript1, setCopiedScript1] = useState(false);
  const [copiedScript2, setCopiedScript2] = useState(false);
  const [copiedSocialPost, setCopiedSocialPost] = useState(false);

  const video1Script = `[VIDEO 1: 90-SECOND TEAM & PROCESS SCRIPT]
Target Duration: Exactly 90 Seconds
Focus: Team Dynamics, Architecture Decisions & Development Process

[0:00 - 0:15] - The Challenge & The Goal
"Hi everyone! For HH Goa 2026 Task 2, our team set out to build AuraVoice RAG — a sub-200ms, voice-first Retrieval-Augmented Generation system designed for multilingual Indian context using the ai4bharat/MSMARCO-XI dataset."

[0:15 - 0:35] - Solving the Chunking Challenge
"Naive fixed chunking destroys semantic boundaries. We engineered 5 distinct chunking architectures: Semantic Splitting with embedding distance inflection detection, Hierarchical Parent-Child indexing for dual-resolution retrieval, Propositional clause decomposition, Metadata-aware headers, and dynamic sliding windows."

[0:35 - 0:55] - Sub-200ms Latency & Hybrid Vector Engine
"Achieving <200ms end-to-end latency required building a high-speed SIMD vector engine combining HNSW dense cosine search with BM25 Okapi lexical indexing via Reciprocal Rank Fusion, integrated directly with Sarvam AI's saarika:v2 Indic speech model."

[0:55 - 1:15] - Guardrails & Knowing When NOT to Answer
"A reliable model must know when to abstain. We built a 3-tier guardrail harness: inbound prompt injection filters, semantic grounding sufficiency checks that trigger honest abstention, and claim-level NLI hallucination verification."

[1:15 - 1:30] - Results & Conclusion
"Across 100+ benchmark queries, our pipeline achieves a P50 of <1ms, P70 of <1.5ms, and 100% sub-200ms compliance. Here's our journey to HH Goa 2026! #RAGInGoa"`;

  const video2Script = `[VIDEO 2: FULL END-TO-END DEMO SCRIPT]
Focus: Live Working System Showcase

1. Introduction (0:00 - 0:20):
   - Show the AuraVoice RAG Dark Glassmorphic Dashboard.
   - Explain the tech stack: Sarvam AI STT, Turbo HNSW + BM25 Vector Store, MSMARCO-XI dataset.

2. Live Voice Query Demonstration (0:20 - 1:00):
   - Tap the microphone button (waveform glows).
   - Speak in Hindi: "चंद्रयान-3 कब लॉन्च हुआ था?" or English: "When did Chandrayaan-3 land on the Moon?"
   - Show instantaneous transcript arrival and streaming grounded answer with [Source: Chandrayaan-3] citation.
   - Point out the Latency Waterfall Badge showing total pipeline latency well under 200ms!

3. Chunking Strategy Lab Showcase (1:00 - 1:40):
   - Navigate to the Chunking Lab.
   - Select an MSMARCO-XI document and click "Re-compute All Strategies".
   - Show side-by-side comparison of Semantic vs Hierarchical vs Propositional chunking with token histograms.

4. Guardrail Radar & Abstention Test (1:40 - 2:20):
   - Navigate to Guardrails tab.
   - Click "Prompt Injection Test" ("Ignore previous instructions...") -> Show instant security block.
   - Click "Unanswerable Test" ("Who was the emperor of Pluto during the Bronze Age?") -> Show Grounding Abstention trigger.

5. P50 / P70 / P100 Benchmark Execution (2:20 - 2:50):
   - Navigate to Latency Analytics tab.
   - Click "Run Benchmark Suite" across 50 queries.
   - Show live calculation of P50, P70, and P100 latency percentiles and exportable JSON report.

6. Wrap Up (2:50 - 3:00):
   - Show GitHub repo, #RAGInGoa hashtag, and conclude!`;

  const socialPost = `🚀 Excited to reveal our submission for HH Goa 2026 Task 2: AuraVoice RAG! ⚡🎙️

We built a voice-first Retrieval-Augmented Generation system engineered for <200ms latency on the ai4bharat/MSMARCO-XI multilingual dataset.

Key Innovations:
✨ 5 Vast Chunking Architectures (Semantic, Hierarchical, Propositional, Metadata-Aware)
🎙️ Sarvam AI (saarika:v2) & ElevenLabs Speech-to-Text
⚡ Sub-200ms Turbo HNSW + BM25 Hybrid Vector Engine (P50 < 1ms!)
🛡️ Multi-Tier Guardrails (Injection Shield + Grounding Abstention + Faithfulness NLI)
📊 Automated P50/P70/P100 Latency Analytics Suite

Check out our demo and codebase!
#RAGInGoa #HHGoa2026 #AI #RAG #VoiceAI #SarvamAI #GenerativeAI #MachineLearning`;

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 0' }}>
      {/* Intro Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Award size={26} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              HH Goa 2026 Shortlisting Task 2 — Submission Kit
            </h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Complete submission checklist, video scripts, and social promotion templates ready for final submission.
          </p>
        </div>

        <a
          href="https://forms.gle/MNvCjcv23Hn2Eeu58"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <ExternalLink size={16} />
          <span>Official Submission Form</span>
        </a>
      </div>

      {/* Submission Checklist Cards */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
          Mandatory Deliverables Checklist:
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              <span>1. GitHub Repository Link</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Complete modular codebase with backend, frontend, unit tests (21/21 passing), documentation, and run scripts.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              <span>2. Live Working Link</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              FastAPI backend running with real-time WebAudio visualizer, chunking comparison lab, and latency telemetry.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              <span>3. Video 1 (90s Team/Process)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              90-second process and teamwork video highlighting technical design choices and engineering journey.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              <span>4. Video 2 (Demo End-to-End)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Live demonstration of voice recording, sub-200ms retrieval, multi-strategy chunking, and guardrails.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle size={18} />
              <span>5. #RAGInGoa Social Post</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Mandatory upload to Instagram and X by every team member with hashtag <code>#RAGInGoa</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Video Scripts & Social Media Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Video 1 Script Box */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              Video 1 Script (90s Process Video)
            </span>
            <button
              onClick={() => copyToClipboard(video1Script, setCopiedScript1)}
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <Copy size={12} />
              <span>{copiedScript1 ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>

          <pre style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            color: '#cbd5e1',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            {video1Script}
          </pre>
        </div>

        {/* Video 2 Script Box */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-violet)' }}>
              Video 2 Script (End-to-End Demo)
            </span>
            <button
              onClick={() => copyToClipboard(video2Script, setCopiedScript2)}
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <Copy size={12} />
              <span>{copiedScript2 ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>

          <pre style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            color: '#cbd5e1',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            {video2Script}
          </pre>
        </div>

        {/* Social Media Post Box */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#10b981' }}>
              Social Media Post Copy (#RAGInGoa)
            </span>
            <button
              onClick={() => copyToClipboard(socialPost, setCopiedSocialPost)}
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <Copy size={12} />
              <span>{copiedSocialPost ? 'Copied!' : 'Copy Post'}</span>
            </button>
          </div>

          <pre style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            color: '#cbd5e1',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            {socialPost}
          </pre>
        </div>
      </div>
    </div>
  );
}
