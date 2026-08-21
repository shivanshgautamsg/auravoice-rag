import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VoiceStudio from './components/VoiceStudio';
import ChunkingLab from './components/ChunkingLab';
import LatencyDashboard from './components/LatencyDashboard';
import GuardrailsView from './components/GuardrailsView';
import HarnessTrace from './components/HarnessTrace';
import { fetchHealth } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('voice');
  const [health, setHealth] = useState(null);

  const loadHealth = () => {
    fetchHealth().then(setHealth).catch(console.error);
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        onRefreshHealth={loadHealth}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'voice' && <VoiceStudio />}
        {activeTab === 'chunking' && <ChunkingLab />}
        {activeTab === 'latency' && <LatencyDashboard />}
        {activeTab === 'guardrails' && <GuardrailsView />}
        {activeTab === 'harness' && <HarnessTrace />}
      </main>

      <footer style={{
        padding: '20px 0',
        marginTop: '28px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>AuraVoice — Real-Time Voice-Enabled RAG Engine</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>SLA Target: <strong style={{ color: '#34d399' }}>&lt; 200ms</strong></span>
          <span>Corpus: <strong>ai4bharat/MSMARCO-XI</strong></span>
          <span>STT: <strong>Sarvam AI & ElevenLabs</strong></span>
        </div>
      </footer>
    </div>
  );
}
