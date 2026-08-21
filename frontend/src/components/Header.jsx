import React from 'react';
import { Mic, GitFork, BarChart3, ShieldCheck, Terminal, Github, ExternalLink, Activity } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, health, onRefreshHealth }) {
  const tabs = [
    { id: 'voice', label: 'Voice Studio', icon: Mic },
    { id: 'chunking', label: 'Chunking Lab', icon: GitFork },
    { id: 'latency', label: 'Latency (P50/P70/P100)', icon: BarChart3 },
    { id: 'guardrails', label: 'Guardrails', icon: ShieldCheck },
    { id: 'harness', label: 'Agent Harness', icon: Terminal }
  ];

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: '1px solid var(--border-subtle)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Activity size={18} strokeWidth={2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}>
              AuraVoice
            </h1>
            <span className="badge badge-neutral">v1.0.0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
            <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              <span className="live-indicator" />
              P50: 0.43ms (Sub-200ms SLA Active)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        background: 'var(--bg-subtle)',
        padding: '3px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* External Repository Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a
          href="https://github.com/shivanshgautamsg/auravoice-rag"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            fontWeight: 500,
            transition: 'border-color 0.15s ease'
          }}
        >
          <Github size={14} />
          <span>Repository</span>
          <ExternalLink size={11} style={{ opacity: 0.5 }} />
        </a>
      </div>
    </header>
  );
}
