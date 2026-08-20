import React, { useMemo, useState } from 'react';
import { AudioWaveform, Pause, Play, RotateCcw, Settings2 } from 'lucide-react';
import Header from './Header.jsx';
import { useApp } from '../context/AppContext.jsx';
import { soundsLibrary, soundCategories } from '../data/sonidos.js';
import { startSound, stopSound, setSoundVolume, stopAll, setMasterVolume, activeSounds } from '../audio/engine.js';
import { colorPresets } from '../data/colores.js';

function Slider({ value, onChange, min = 0, max = 100, step = 1, ariaLabel }) {
  return (
    <input
      type="range" className="ref-range"
      min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={ariaLabel}
    />
  );
}

function SoundCard({ def, vol, on }) {
  const { lang, t } = useApp();
  return (
    <div className="notebook-card" style={{
      padding: 14,
      borderLeft: `4px solid ${def.color}`,
      display: 'flex', flexDirection: 'column', gap: 8,
      minHeight: 102,
      transition: 'transform 200ms ease, box-shadow 200ms ease',
      transform: on ? 'translateY(-2px)' : 'none',
      boxShadow: on ? `0 12px 30px ${def.color}33` : undefined,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="state-dot" style={{ background: def.color, width: 10, height: 10 }} />
        <div className="font-hand" style={{ fontSize: 20, lineHeight: 1 }}>
          {t(def.label)}
        </div>
      </div>
      <div style={{ fontFamily: 'Kalam, sans-serif', fontSize: 12, color: 'var(--ref-ink-soft)' }}>
        {def.type}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
        <Slider
          value={vol}
          onChange={(v) => {
            on && setSoundVolume(def.id, v / 100);
          }}
          ariaLabel={t(def.label)}
        />
        <span style={{
          fontFamily: 'Kalam, sans-serif', fontSize: 12, color: 'var(--ref-ink-soft)',
          width: 26, textAlign: 'right',
        }}>{vol}</span>
      </div>
    </div>
  );
}

export default function SoundsView() {
  const { lang, hue, setHue, sat, setSat, bright, setBright, contrast, setContrast, intensity, setIntensity, applyPreset, masterVol, setMasterVol, startAudio } = useApp();
  const [tab, setTab] = useState('mix');
  const [running, setRunning] = useState(false);
  const [volumes, setVolumes] = useState({}); // id -> 0..100 DEFAULT 50
  const [hoverCat, setHoverCat] = useState(null);

  const defaultVolFor = (id) => volumes[id] ?? 50;
  const setVolFor = (id, v) => setVolumes({ ...volumes, [id]: v });

  const start = async () => {
    await startAudio();
    soundsLibrary.forEach((def) => {
      const v = defaultVolFor(def.id);
      startSound(def, v / 100);
    });
    setRunning(true);
  };

  const stop = () => { stopAll(); setRunning(false); };

  const toggle = (def) => {
    const isOn = activeSounds().includes(def.id);
    if (isOn) stopSound(def.id);
    else {
      startSound(def, defaultVolFor(def.id) / 100);
    }
  };

  const soundsByCat = useMemo(() => {
    const map = {};
    soundCategories.forEach((c) => map[c.id] = []);
    soundsLibrary.forEach((s) => { if (map[s.category]) map[s.category].push(s); });
    return map;
  }, []);

  const onCategory = (cat) => {
    soundsByCat[cat.id].forEach((def) => {
      const isOn = activeSounds().includes(def.id);
      if (!isOn) {
        startSound(def, defaultVolFor(def.id) / 100);
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header subtitle={lang === 'es' ? 'mesa de mezcla' : 'sound table'} />

      <main style={{ padding: '24px 28px 64px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Player bar */}
        <div className="notebook-card" style={{
          padding: 18,
          marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 999,
            background: 'radial-gradient(circle at 30% 30%, #e8e0f0, #a9c9a4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: running ? '0 0 22px rgba(169,201,164,0.55)' : '0 4px 14px rgba(47,42,58,0.1)',
            transition: 'box-shadow 400ms ease',
          }}>
            <AudioWaveform size={26} color="#2f2a3a" />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="font-hand" style={{ fontSize: 26, lineHeight: 1 }}>
              {lang === 'es' ? 'Reproductor' : 'Player'}
            </div>
            <div style={{ fontFamily: 'Kalam, sans-serif', fontSize: 14, color: 'var(--ref-ink-soft)' }}>
              {lang === 'es' ? 'Reproducir todo, mezclar a gusto.' : 'Play all, mix as you feel.'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={running ? stop : start} className="chip" style={{
              background: running ? 'rgba(201,150,143,0.85)' : 'rgba(185,167,217,0.85)',
              borderColor: 'transparent',
              padding: '8px 14px',
              fontFamily: 'Caveat, cursive',
              fontSize: 22,
              color: '#2f2a3a',
            }}>
              {running ? <Pause size={16}/> : <Play size={16}/>}
              <span style={{ marginLeft: 4 }}>{lang === 'es' ? (running ? 'parar' : 'reproducir todo') : (running ? 'stop' : 'play all')}</span>
            </button>
            <button onClick={() => { stopAll(); setVolumes({}); setRunning(false); }} className="chip"
              title={lang === 'es' ? 'silenciar todo' : 'mute all'}
            >
              <RotateCcw size={14}/>
              <span>{lang === 'es' ? 'silenciar' : 'reset'}</span>
            </button>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(246,241,232,0.7)',
            padding: '6px 12px', borderRadius: 999,
            border: '1px dashed rgba(91,84,112,0.25)',
            minWidth: 260,
          }}>
            <span style={{ fontFamily: 'Kalam, sans-serif', fontSize: 13, color: 'var(--ref-ink-soft)' }}>
              {lang === 'es' ? 'volumen' : 'volume'}
            </span>
            <Slider
              value={Math.round(masterVol * 100)}
              onChange={(v) => setMasterVol(v / 100)}
              ariaLabel="master volume"
            />
            <span style={{
              fontFamily: 'Kalam, sans-serif', fontSize: 12, color: 'var(--ref-ink-soft)',
              minWidth: 26, textAlign: 'right',
            }}>{Math.round(masterVol * 100)}</span>
          </div>
        </div>

        {/* Notebook tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
          {[
            { id: 'mix', label: { es: 'mezcla', en: 'mixer' } },
            { id: 'color', label: { es: 'color', en: 'color' } },
            { id: 'config', label: { es: 'engranaje', en: 'gear' } },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`chip ${tab === t.id ? 'on' : ''}`}
              style={{
                padding: '8px 14px', fontSize: 16,
                fontFamily: 'Caveat, cursive',
              }}
            >
              {t.label[lang]}
            </button>
          ))}
          <div style={{ flex: 1 }}/>
          {/* Quick category presets */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {soundCategories.map((cat) => (
              <button key={cat.id} className="chip"
                onClick={() => onCategory(cat)}
                onMouseEnter={() => setHoverCat(cat.id)}
                onMouseLeave={() => setHoverCat(null)}
                title={cat.label[lang]}
              >{cat.label[lang]}</button>
            ))}
          </div>
        </div>

        {tab === 'mix' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}>
            {soundsLibrary.map((def) => {
              const on = activeSounds().includes(def.id);
              const v = defaultVolFor(def.id);
              return (
                <div key={def.id} onClick={() => toggle(def)} style={{ cursor: 'pointer' }}>
                  <SoundCard def={def} vol={v} on={on}/>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'color' && (
          <div className="notebook-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="font-hand" style={{ fontSize: 22 }}>
              {lang === 'es' ? 'Filtro de color para el reproductor' : 'Color filter for the player'}
            </div>
            <div style={{
              fontFamily: 'Kalam, sans-serif', fontSize: 13, color: 'var(--ref-ink-soft)',
            }}>{lang === 'es'
              ? 'Aplica psicología del color al refugio. Las teclas guardan recetas.'
              : 'Apply color psychology to the refuge. Snapshots store recipes.'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
              {colorPresets.map((p) => (
                <button key={p.id} className="chip" onClick={() => applyPreset(p.id)} style={{
                  flexDirection: 'column', alignItems: 'flex-start', height: 'auto', padding: 12,
                }}>
                  <span className="font-hand" style={{ fontSize: 18 }}>{p.name[lang]}</span>
                  <span style={{ fontFamily: 'Kalam, sans-serif', fontSize: 12, color: 'var(--ref-ink-soft)' }}>
                    {p.note[lang]}
                  </span>
                </button>
              ))}
            </div>

            <Slider2 label={lang === 'es' ? 'matiz' : 'hue'} v={hue} setV={setHue} min={-180} max={180}/>
            <Slider2 label={lang === 'es' ? 'saturación' : 'saturation'} v={sat} setV={setSat} min={0} max={200}/>
            <Slider2 label={lang === 'es' ? 'brillo' : 'brightness'} v={bright} setV={setBright} min={50} max={150}/>
            <Slider2 label={lang === 'es' ? 'contraste' : 'contrast'} v={contrast} setV={setContrast} min={50} max={150}/>
            <Slider2 label={lang === 'es' ? 'intensidad' : 'intensity'} v={intensity} setV={setIntensity} min={0} max={100}/>
          </div>
        )}

        {tab === 'config' && (
          <div className="notebook-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="font-hand" style={{ fontSize: 22 }}>{lang === 'es' ? 'Engranajes' : 'Gears'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 14 }}>
              <SettingRow label={lang === 'es' ? 'vibración' : 'vibration'}
                value={running}
                onClick={() => running ? stop() : start()}
                icon={<Settings2 size={16}/>}
                lang={lang} />
              <SettingRow label={lang === 'es' ? 'compas' : 'compass'}
                value={hoverCat === 'percussion' ? 'percutiendo' : '—'}
                onClick={() => onCategory({ id: 'percussion' })}
                icon={<AudioWaveform size={16}/>}
                lang={lang} />
            </div>
          </div>
        )}

        {/* Channel strip groups */}
        <div style={{ marginTop: 28 }}>
          {soundCategories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 18 }}>
              <div className="font-hand" style={{ fontSize: 22, marginBottom: 10, color: 'var(--ref-ink-soft)' }}>
                {cat.label[lang]}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 8,
              }}>
                {soundsByCat[cat.id]?.map((def) => {
                  const on = activeSounds().includes(def.id);
                  const v = defaultVolFor(def.id);
                  return (
                    <button key={def.id}
                      onClick={() => {
                        setVolFor(def.id, v);
                        if (!on) {
                          startSound(def, v / 100);
                        }
                      }}
                      className="chip"
                      style={{
                        width: '100%',
                        background: on ? `${def.color}55` : undefined,
                        borderColor: on ? def.color : undefined,
                        justifyContent: 'flex-start',
                        padding: '8px 10px',
                      }}
                    >
                      <span className="state-dot" style={{ background: def.color }}/>
                      <span style={{ fontFamily: 'Kalam, sans-serif', fontSize: 13 }}>
                        {t(def.label)}
                      </span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'Kalam, sans-serif', fontSize: 11, color: 'var(--ref-ink-soft)' }}>
                        {on ? `·${v}` : '·0'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Slider2({ label, v, setV, min = 0, max = 200 }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Kalam, sans-serif', fontSize: 13, color: 'var(--ref-ink-soft)' }}>
        <span>{label}</span><span>{v}</span>
      </div>
      <Slider value={v} onChange={setV} min={min} max={max} />
    </div>
  );
}

function SettingRow({ label, value, onClick, icon, lang }) {
  return (
    <button onClick={onClick} className="notebook-card" style={{
      padding: 12, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 999,
        background: 'rgba(185,167,217,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div className="font-hand" style={{ fontSize: 18, lineHeight: 1 }}>{label}</div>
        <div style={{ fontFamily: 'Kalam, sans-serif', fontSize: 12, color: 'var(--ref-ink-soft)' }}>
          {typeof value === 'boolean' ? (value ? 'on' : 'off') : String(value)}
        </div>
      </div>
    </button>
  );
}
