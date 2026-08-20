import React, { useEffect, useState } from 'react';
import { Palette, Sparkles, ChevronRight } from 'lucide-react';
import Header from './Header.jsx';
import { useApp } from '../context/AppContext.jsx';
import { colorPresets, colorNotes } from '../data/colores.js';

function Slider({ value, onChange, min = 0, max = 100, step = 1, ariaLabel }) {
  return (
    <input
      type="range"
      className="ref-range"
      min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={ariaLabel}
    />
  );
}

// SVG-based color wheel. Hue (angle) and Saturation (radius) — like Premiere/Photoshop.
function ColorWheel({ hue, sat, onPick }) {
  const size = 260;
  const r = size / 2 - 14;
  const cx = size / 2, cy = size / 2;

  const handleMove = (e, rect) => {
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left - cx;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top - cy;
    const dist = Math.min(Math.sqrt(x * x + y * y), r);
    const sat = Math.round((dist / r) * 100);
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    onPick({
      hue: Math.round(angle * 0.5 - 180), // -180..180 mapped to -180..180
      sat,
    });
  };

  const onMouseMove = (e) => {
    if (e.buttons !== 1) return;
    handleMove(e, e.currentTarget.getBoundingClientRect());
  };

  const satRadial = sat / 100 * r;
  const markerAngle = ((hue + 180) * Math.PI) / 360; // hue -180..180 → 0..360deg
  const mx = cx + Math.cos(markerAngle) * satRadial;
  const my = cy + Math.sin(markerAngle) * satRadial;

  return (
    <svg
      width={size} height={size}
      style={{ touchAction: 'none', cursor: 'crosshair' }}
      onMouseMove={onMouseMove}
      onMouseDown={(e) => handleMove(e, e.currentTarget.getBoundingClientRect())}
      onTouchMove={(e) => handleMove(e, e.currentTarget.getBoundingClientRect())}
      onTouchStart={(e) => handleMove(e, e.currentTarget.getBoundingClientRect())}
    >
      <defs>
        <radialGradient id="wheelBright" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,1)"/>
          <stop offset="65%" stopColor="rgba(255,255,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      {/* Hue ring (conic) */}
      <g style={{ transformOrigin: '50% 50%' }}>
        {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => {
          const start = i * 30, end = (i + 1) * 30;
          return (
            <path
              key={i}
              d={describeArc(cx, cy, r, start, end)}
              stroke={i === 0 ? '#b9a7d9' :
                     i === 1 ? '#a9c9a4' :
                     i === 2 ? '#c79f6c' :
                     i === 3 ? '#c9968f' :
                     i === 4 ? '#9aa6c9' :
                     i === 5 ? '#7c8aae' :
                     i === 6 ? '#5e4773' :
                     i === 7 ? '#3a3052' :
                     i === 8 ? '#7a4a55' :
                     i === 9 ? '#a86a4a' :
                     i === 10 ? '#7c8054' :
                     '#9fbf9a'}
              strokeWidth="22"
              fill="none"
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={r - 12} fill="url(#wheelBright)" />
      <circle cx={cx} cy={cy} r={(r - 12) * (sat / 100)} fill="rgba(47,42,58,0.5)" style={{ pointerEvents: 'none' }} />
      <circle cx={mx} cy={my} r="9" fill="#fff" stroke="#2f2a3a" strokeWidth="1.5" style={{ pointerEvents: 'none' }} />
    </svg>
  );
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export default function ColorPsychology() {
  const { lang, t, hue, setHue, sat, setSat, bright, setBright, contrast, setContrast, intensity, setIntensity, applyPreset } = useApp();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header subtitle={lang === 'es' ? 'psicología del color' : 'color psychology'} />

      <main style={{ padding: '24px 28px 64px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Lead */}
        <div className="notebook-card" style={{ padding: 18, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Palette size={28} color="var(--ref-violet)" strokeWidth={1.5}/>
          <div>
            <div className="font-hand" style={{ fontSize: 28, color: 'var(--ref-ink)', lineHeight: 1 }}>
              {lang === 'es' ? 'Cada color, un estado' : 'Each color, a state'}
            </div>
            <div style={{ fontFamily: 'Kalam, sans-serif', fontSize: 14, color: 'var(--ref-ink-soft)', marginTop: 4 }}>
              {lang === 'es'
                ? 'Mueve el dial. Cuando algo resuene, detente.'
                : 'Move the dial. When something resonates, stop.'}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid', gap: 24,
          gridTemplateColumns: 'minmax(0, 320px) 1fr',
          alignItems: 'start',
        }}>
          {/* Wheel */}
          <div className="notebook-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div className="font-hand" style={{ fontSize: 22 }}>{lang === 'es' ? 'Rueda' : 'Wheel'}</div>
            <ColorWheel
              hue={hue} sat={sat}
              onPick={({ hue: h, sat: s }) => { setHue(h); setSat(s); }}
            />
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Kalam, sans-serif', fontSize: 13, color: 'var(--ref-ink-soft)' }}>
                <span>{lang === 'es' ? 'matiz' : 'hue'}</span>
                <span>{hue}°</span>
              </div>
              <Slider value={hue} onChange={setHue} min={-180} max={180} ariaLabel="hue"/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Kalam, sans-serif', fontSize: 13, color: 'var(--ref-ink-soft)', marginTop: 10 }}>
                <span>{lang === 'es' ? 'saturación' : 'saturation'}</span>
                <span>{sat}%</span>
              </div>
              <Slider value={sat} onChange={setSat} min={0} max={200} ariaLabel="saturation"/>
            </div>
          </div>

          {/* Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Master sliders */}
            <div className="notebook-card" style={{ padding: 18 }}>
              <div className="font-hand" style={{ fontSize: 22, marginBottom: 14 }}>
                {lang === 'es' ? 'Deslizadores maestros' : 'Master sliders'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Row label={lang === 'es' ? 'matiz' : 'hue'} v={hue} setV={setHue} min={-180} max={180} unit="°"/>
                <Row label={lang === 'es' ? 'saturación' : 'saturation'} v={sat} setV={setSat} min={0} max={200} unit="%"/>
                <Row label={lang === 'es' ? 'brillo' : 'brightness'} v={bright} setV={setBright} min={50} max={150} unit="%"/>
                <Row label={lang === 'es' ? 'contraste' : 'contrast'} v={contrast} setV={setContrast} min={50} max={150} unit="%"/>
                <div>
                  <div style={{
                    fontFamily: 'Kalam, sans-serif', fontSize: 14,
                    color: 'var(--ref-ink-soft)', marginBottom: 6,
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={14}/>{lang === 'es' ? 'intensidad' : 'intensity'}
                    </span>
                    <span>{intensity}%</span>
                  </div>
                  <Slider value={intensity} onChange={setIntensity} min={0} max={100} ariaLabel="intensity"/>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: 6, marginTop: 8, fontFamily: 'Kalam, sans-serif', fontSize: 12,
                    color: 'var(--ref-ink-soft)',
                  }}>
                    {[0, 25, 50, 100].map((p, i) => (
                      <button key={i} className="chip" onClick={() => setIntensity(p)}>{p}%</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="notebook-card" style={{ padding: 18 }}>
              <div className="font-hand" style={{ fontSize: 22, marginBottom: 8 }}>
                {lang === 'es' ? 'Recetas de color' : 'Color recipes'}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: 10,
              }}>
                {colorPresets.map((p) => (
                  <button
                    key={p.id}
                    className="chip"
                    onClick={() => applyPreset(p.id)}
                    title={p.note[lang]}
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: 12,
                      textAlign: 'left',
                      height: 'auto',
                    }}
                  >
                    <div className="font-hand" style={{ fontSize: 18, lineHeight: 1, marginBottom: 4 }}>
                      {p.name[lang]} <ChevronRight size={11} style={{ marginLeft: 2, opacity: 0.6 }}/>
                    </div>
                    <div style={{ fontFamily: 'Kalam, sans-serif', fontSize: 12.5, color: 'var(--ref-ink-soft)' }}>
                      {p.note[lang]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="notebook-card" style={{ padding: 18 }}>
              <div className="font-hand" style={{ fontSize: 22, marginBottom: 10 }}>
                {lang === 'es' ? 'Notas' : 'Notes'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {colorNotes[lang].map((n, i) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    background: 'rgba(246,241,232,0.5)',
                    borderRadius: 10,
                    border: '1px dashed rgba(91,84,112,0.25)',
                  }}>
                    <div style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: 'var(--ref-violet)' }}>
                      {n.kw}
                    </div>
                    <div style={{ fontFamily: 'Kalam, sans-serif', fontSize: 12.5, color: 'var(--ref-ink-soft)', marginTop: 2 }}>
                      {n.fx}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ label, v, setV, min, max, unit }) {
  return (
    <div>
      <div style={{
        fontFamily: 'Kalam, sans-serif', fontSize: 14,
        color: 'var(--ref-ink-soft)', marginBottom: 6,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        <span>{v}{unit}</span>
      </div>
      <Slider value={v} onChange={setV} min={min} max={max} />
    </div>
  );
}
