import React, { useEffect, useRef, useState } from 'react';
import { Activity } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { polivagalStates } from '../data/strings.js';

// Gentle non-metric regulator. No notifications, no streak counters.
// Lets the user mark current polyvagal state and offers a breathing co-pilot.

export default function PolivagalRegulator() {
  const { lang, polivagal, setPolivagal } = useApp();
  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const state = polivagalStates.find((s) => s.id === polivagal);

  // Breathing pattern from selected state
  useEffect(() => {
    if (!breathing) return;
    let timer;
    const cycle = () => {
      setPhase('inhale');
      timer = setTimeout(() => {
        setPhase('exhale');
        timer = setTimeout(cycle, parseInt(state.ex) * 1000);
      }, parseInt(state.inh) * 1000);
    };
    cycle();
    return () => clearTimeout(timer);
  }, [breathing, state.inh, state.ex]);

  return (
    <div style={{
      position: 'fixed', right: 18, bottom: 18, zIndex: 20,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: 10,
      borderRadius: 16,
      background: 'rgba(246,241,232,0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(91,84,112,0.18)',
      boxShadow: '0 8px 24px rgba(47,42,58,0.15)',
      maxWidth: 'calc(100vw - 36px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span className="state-dot" style={{ background: state.dot }}/>
        {polivagalStates.map((s) => (
          <button
            key={s.id}
            onClick={() => setPolivagal(s.id)}
            title={s.label[lang]}
            style={{
              width: state.id === polivagal ? 14 : 8,
              height: state.id === polivagal ? 14 : 8,
              borderRadius: 999,
              background: s.dot,
              border: 'none',
              cursor: 'pointer',
              opacity: state.id === polivagal ? 1 : 0.4,
              transition: 'all 200ms ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      <div className="font-hand" style={{ fontSize: 18, lineHeight: 1 }}>
        {state.label[lang]}
      </div>

      <button onClick={() => setBreathing((b) => !b)} style={{
        background: breathing ? `${state.dot}33` : 'transparent',
        border: `1px dashed ${state.dot}`,
        color: 'var(--ref-ink)',
        width: 36, height: 36, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Activity size={16} strokeWidth={1.6}/>
        {breathing && (
          <span className="breath-orb" style={{
            position: 'absolute', inset: 0, margin: 'auto',
            background: phase === 'inhale' ? state.dot : 'transparent',
            opacity: phase === 'inhale' ? 1 : 0,
          }} aria-hidden></span>
        )}
      </button>
    </div>
  );
}
