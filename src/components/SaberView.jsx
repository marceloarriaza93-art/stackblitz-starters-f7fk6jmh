import React from 'react';
import { BookOpen, Quote } from 'lucide-react';
import Header from './Header.jsx';
import { useApp } from '../context/AppContext.jsx';
import { saber } from '../data/saber.js';

export default function SaberView() {
  const { lang, t } = useApp();
  const data = saber[lang];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header subtitle={lang === 'es' ? 'una pequeña bitácora' : 'a small log'} />

      <main style={{ padding: '24px 28px 80px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Lead */}
        <div className="notebook-card" style={{
          padding: 28,
          marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 999,
            background: 'radial-gradient(circle at 30% 30%, #e8e0f0, #b9a7d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(185,167,217,0.4)',
          }}>
            <BookOpen size={26} color="#2f2a3a"/>
          </div>
          <div>
            <div className="font-hand" style={{ fontSize: 34, lineHeight: 1 }}>
              {lang === 'es' ? 'El refugio' : 'The Refuge'}
            </div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: 'var(--ref-violet)', marginTop: 2 }}>
              {lang === 'es' ? 'lectura · respiración · presencia' : 'reading · breathing · presence'}
            </div>
          </div>
        </div>

        {/* Intro paragraph */}
        <div className="notebook-card" style={{ padding: 24, marginBottom: 28 }}>
          <p style={{
            fontFamily: 'Kalam, sans-serif',
            fontSize: 18,
            color: 'var(--ref-ink)',
            margin: 0,
            lineHeight: 1.6,
          }}>{data.intro}</p>
        </div>

        {/* Prompt */}
        <div style={{
          fontFamily: 'Caveat, cursive',
          fontSize: 22,
          color: 'var(--ref-violet)',
          marginBottom: 16,
          paddingLeft: 6,
        }}>{data.prompts[0]}</div>

        <div style={{
          height: 1, marginBottom: 24,
          background: 'linear-gradient(90deg, rgba(91,84,112,0.4), rgba(91,84,112,0.05))',
        }}/>

        {/* Authors grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {data.authors.map((a, i) => (
            <article key={i} className="notebook-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div className="font-hand" style={{ fontSize: 24, lineHeight: 1 }}>{a.name}</div>
                  <div style={{
                    fontFamily: 'Kalam, sans-serif',
                    fontSize: 12,
                    color: 'var(--ref-ink-soft)',
                    letterSpacing: '0.05em',
                  }}>· {a.tag} ·</div>
                </div>
                <Quote size={20} color="var(--ref-violet)" strokeWidth={1.4}/>
              </div>
              <p style={{
                fontFamily: 'Kalam, sans-serif',
                fontSize: 14.5,
                color: 'var(--ref-ink)',
                lineHeight: 1.55,
                margin: 0,
              }}>{a.body}</p>
            </article>
          ))}
        </div>

        {/* Footnote */}
        <div style={{
          marginTop: 36,
          padding: '14px 20px',
          borderTop: '1.5px dashed rgba(91,84,112,0.4)',
          fontFamily: 'Caveat, cursive',
          fontSize: 18,
          color: 'var(--ref-ink-soft)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          {lang === 'es'
            ? 'Cada visita al refugio es una pequeña reinstalación de la presencia.'
            : 'Each visit to the refuge is a small reinstallation of presence.'}
        </div>
      </main>
    </div>
  );
}
