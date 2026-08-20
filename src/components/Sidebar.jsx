import React from 'react';
import { Compass, Palette, AudioWaveform, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const items = [
  { id: 'explorar', icon: Compass,        labelKey: { es: 'Explorar', en: 'Explore' } },
  { id: 'colores',  icon: Palette,        labelKey: { es: 'Colores',  en: 'Color' } },
  { id: 'sonidos',  icon: AudioWaveform,  labelKey: { es: 'Sonidos',  en: 'Sounds' } },
  { id: 'saber',    icon: BookOpen,       labelKey: { es: 'Saber',    en: 'Know' } },
];

export default function Sidebar() {
  const { tab, setTab, openRefugioId, closeRefugio, lang } = useApp();

  const onNav = (id) => {
    if (openRefugioId) closeRefugio();
    setTab(id);
  };

  return (
    <aside
      className="sidebar-container"
      style={{
        width: 88,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        paddingTop: 16,
        paddingBottom: 16,
        background:
          'linear-gradient(180deg, rgba(47,42,58,0.92), rgba(36,32,48,0.92))',
        backdropFilter: 'blur(8px)',
        zIndex: 30,
        color: '#e8e3ee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRight: '1px solid rgba(185,167,217,0.18)',
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 56, height: 56, borderRadius: 999,
          background: 'radial-gradient(circle at 30% 30%, #fff9, #b9a7d9)',
          boxShadow: '0 0 18px rgba(185,167,217,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}
      >
        <span style={{ fontFamily: 'Caveat, cursive', fontSize: 26, color: '#2f2a3a' }}>r</span>
      </div>

      <div className="brush-divider" style={{ width: '70%', marginBottom: 14 }} />

      {items.map(({ id, icon: Icon, labelKey }) => (
        <button
          key={id}
          onClick={() => onNav(id)}
          className={`nav-item ${tab === id ? 'active' : ''}`}
          style={{
            border: 'none',
            background: tab === id ? 'linear-gradient(180deg, rgba(185,167,217,0.45), rgba(169,201,164,0.4))'
                                   : 'transparent',
            color: tab === id ? '#fff' : '#cfc7da',
            transitionDelay: `${id === 'explorar' ? 0 : 0}ms`,
            width: 70,
            marginBottom: 6,
          }}
          aria-label={labelKey[lang]}
        >
          <Icon size={22} strokeWidth={1.6} />
          <div style={{
            fontFamily: 'Kalam, sans-serif',
            fontSize: 12,
            marginTop: 6,
            opacity: 0.92,
          }}>{labelKey[lang]}</div>
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Breathing orb */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12 }}>
        <div className="breath-orb" aria-hidden></div>
        <div style={{
          fontFamily: 'Caveat, cursive',
          fontSize: 12,
          color: '#cfc7da',
          marginTop: 8,
          opacity: 0.7,
        }}>{lang === 'es' ? 'respira' : 'breathe'}</div>
      </div>
    </aside>
  );
}
