import { useState } from 'react';
import MoodPage from './MoodPage';
import JournalPage from './JournalPage';

type Tab = 'mood' | 'journal';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'mood',    label: 'Mood Check-in', icon: '🧠' },
  { key: 'journal', label: 'Journal',       icon: '📓' },
];

export default function Dashboard() {
  const [active, setActive] = useState<Tab>('mood');

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '0.5rem', padding: '0.8rem 1.5rem',
        background: 'rgba(8,11,18,0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {TABS.map(tab => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1.2rem',
                borderRadius: 100,
                border: `1px solid ${isActive ? 'rgba(126,184,212,0.3)' : 'transparent'}`,
                background: isActive ? 'rgba(126,184,212,0.1)' : 'transparent',
                color: isActive ? 'var(--glow)' : 'var(--muted)',
                fontFamily: "'Syne', sans-serif",
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--mist)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {active === 'mood' && <MoodPage />}
        {active === 'journal' && <JournalPage />}
      </div>
    </div>
  );
}
