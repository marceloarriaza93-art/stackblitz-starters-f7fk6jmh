import React from 'react';
import { Sparkles, Droplet, Flame, Snowflake, TreePine, Wind, Leaf, CloudRain, Waves, Mountain, Droplets, Anchor, Tent, Trees, Home } from 'lucide-react';
import Header from './Header.jsx';
import { useApp } from '../context/AppContext.jsx';
import { refugios } from '../data/refugios.js';
import RefugioImage from './RefugioImage.jsx';

const iconMap = {
  sparkles: Sparkles, droplet: Droplet, flame: Flame, snowflake: Snowflake,
  'tree-pine': TreePine, wind: Wind, leaf: Leaf, 'cloud-rain': CloudRain,
  waves: Waves, mountain: Mountain, droplets: Droplets, anchor: Anchor,
  tent: Tent, trees: Trees, home: Home,
};

function RefugioCard({ r, onOpen }) {
  const { lang, t } = useApp();
  const Icon = iconMap[r.icon] || Leaf;
  return (
    <button
      onClick={() => onOpen(r.id)}
      className="notebook-card"
      style={{
        width: '100%',
        border: 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'block',
        padding: 0,
        textAlign: 'left',
      }}
      aria-label={t(r.title)}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        borderTopLeftRadius: 14, borderTopRightRadius: 14,
      }}>
        <RefugioImage
          refugioId={r.id}
          src={r.images[0]}
          alt={t(r.title)}
          imageStyle={{
            transition: 'transform 600ms ease',
            filter: 'saturate(0.96)',
          }}
        />
        {/* Duration stamp */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '3px 10px',
          borderRadius: 999,
          background: 'rgba(47,42,58,0.7)',
          color: '#fff',
          fontFamily: 'Kalam, sans-serif',
          fontSize: 13,
          letterSpacing: '0.04em',
          backdropFilter: 'blur(4px)',
        }}>{r.duration}</div>

        {/* Icon */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          width: 38, height: 38,
          borderRadius: 999,
          background: 'rgba(47,42,58,0.72)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(185,167,217,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color="#b9a7d9" strokeWidth={1.6} />
        </div>
      </div>

      <div style={{ padding: '12px 16px 14px' }}>
        <div className="font-hand" style={{
          fontSize: 24, lineHeight: 1,
          color: 'var(--ref-ink)',
          marginBottom: 4,
        }}>{t(r.title)}</div>
        <div style={{
          fontFamily: 'Kalam, sans-serif',
          fontSize: 13.5,
          color: 'var(--ref-ink-soft)',
          opacity: 0.85,
        }}>{t(r.desc)}</div>
      </div>
    </button>
  );
}

export default function HomeGrid() {
  const { t, lang, openRefugio } = useApp();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header subtitle={lang === 'es' ? 'explora · siente · vuelve' : 'explore · feel · return'} />

      <main style={{ padding: '24px 28px 64px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Lead notebook entry */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18,
          padding: '20px 24px',
          marginBottom: 24,
          background: 'rgba(246,241,232,0.45)',
          border: '1px dashed rgba(91,84,112,0.22)',
          borderRadius: 18,
          boxShadow: '0 6px 18px rgba(47,42,58,0.06)',
        }}>
          <div className="font-hand" style={{ fontSize: 28, color: 'var(--ref-violet)' }}>
            {lang === 'es' ? 'Hoy' : 'Today'}
          </div>
          <div style={{ flex: 1, fontFamily: 'Kalam, sans-serif', fontSize: 15, color: 'var(--ref-ink-soft)' }}>
            {lang === 'es'
              ? 'Entra a un refugio. Mira lento. Respira. Cuando quieras, aléjate.'
              : 'Step into a refuge. Look slowly. Breathe. When ready, wander.'}
          </div>
          <div className="stamp" style={{ color: 'var(--ref-ink-soft)' }}>
            {lang === 'es' ? 'cuaderno abierto' : 'open notebook'}
          </div>
        </div>

        {/* The grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {refugios.map((r) => (
            <RefugioCard key={r.id} r={r} onOpen={openRefugio} />
          ))}
        </div>
      </main>
    </div>
  );
}
