import React from 'react';
import { Languages, BookA, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Header({ subtitle }) {
  const { lang, setLang, dyslexia, setDyslexia } = useApp();

  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '16px 28px',
      position: 'sticky', top: 0, zIndex: 25,
      background: 'linear-gradient(180deg, rgba(246,241,232,0.55), rgba(246,241,232,0.18))',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(91,84,112,0.12)',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'radial-gradient(circle at 30% 30%, #e8e0f0, #a9c9a4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(185,167,217,0.3)',
        }}>
          <Leaf size={20} color="#2f2a3a" />
        </div>
        <div>
          <div className="font-hand" style={{ fontSize: 30, lineHeight: 0.95 }}>Refugio</div>
          <div style={{
            fontFamily: 'Kalam, sans-serif', fontSize: 13,
            color: 'var(--ref-ink-soft)',
            marginTop: -4,
          }}>{lang === 'es' ? 'Tu espacio para volver a ti' : 'Your space to come back to you'}</div>
        </div>
      </div>

      {subtitle && (
        <div style={{
          marginLeft: 16,
          paddingLeft: 16,
          borderLeft: '1.5px dashed rgba(91,84,112,0.3)',
          fontFamily: 'Caveat, cursive',
          fontSize: 22,
          color: 'var(--ref-ink-soft)',
        }}>
          {subtitle}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Dyslexia toggle */}
      <button
        onClick={() => setDyslexia(!dyslexia)}
        title={lang === 'es' ? 'Modo dislexia' : 'Dyslexia mode'}
        aria-pressed={dyslexia}
        style={{
          border: 'none', background: 'transparent',
          padding: 6, cursor: 'pointer',
          color: dyslexia ? 'var(--ref-violet)' : 'var(--ref-ink-soft)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <BookA size={20} strokeWidth={1.6} />
        <span style={{
          fontFamily: 'Kalam, sans-serif', fontSize: 13,
          letterSpacing: '0.06em',
        }}>{dyslexia ? (lang === 'es' ? 'Dislexia · ON' : 'Dyslexia · ON') : (lang === 'es' ? 'Dislexia' : 'Dyslexia')}</span>
      </button>

      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: '1.5px dashed rgba(91,84,112,0.35)',
          background: 'rgba(246,241,232,0.7)',
          color: 'var(--ref-ink)',
          padding: '6px 12px',
          borderRadius: 999,
          cursor: 'pointer',
          fontFamily: 'Kalam, sans-serif',
        }}
      >
        <Languages size={16} strokeWidth={1.7} />
        <span style={{
          fontFamily: 'Caveat, cursive',
          fontSize: 20,
          letterSpacing: '0.04em',
        }}>{lang === 'es' ? 'EN' : 'ES'}</span>
        <span style={{
          fontSize: 13, opacity: 0.65,
          fontFamily: 'Kalam, sans-serif',
        }}>{lang === 'es' ? 'English' : 'Español'}</span>
      </button>
    </header>
  );
}
