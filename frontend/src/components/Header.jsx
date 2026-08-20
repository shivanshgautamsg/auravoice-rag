import React from 'react';
import { Mic, Split, BarChart2, ShieldCheck, Cpu, Award, Zap, CheckCircle, RefreshCw } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, health, onRefreshHealth }) {
  const tabs = [
    { id: 'voice', label: 'Voice Studio', icon: Mic },
    { id: 'chunking', label: 'Chunking Lab', icon: Split },
    { id: 'latency', label: 'Latency Analytics', icon: BarChart2 },
    { id: 'guardrails', label: 'Guardrails & Safety', icon: ShieldCheck },
    { id: 'harness', label: 'Agent Harness', icon: Cpu },
    { id: 'submission', label: 'Submission Kit', icon: Award }
  ];

  return (
    <header className="header-bar" id="app-header">
      <div className="brand-logo">
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
        }}>
          <Zap size={22} color="#ffffff" />
        </div>
        <div>
          <h1 className="brand-title">AuraVoice RAG</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-badge">HH Goa 2026</span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              Sub-200ms Active
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs" id="navigation-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '6px 12px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Engine:</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Sarvam AI + Turbo Vector</span>
        </div>

        <button
          id="refresh-health-btn"
          onClick={onRefreshHealth}
          className="btn-secondary"
          style={{ padding: '8px', borderRadius: '50%' }}
          title="Refresh System Status"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  );
}
