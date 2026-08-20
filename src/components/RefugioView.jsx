import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, ZoomIn, ZoomOut, ArrowLeft, Settings2, X, Play, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { refugios, refugioById, refugioRandom, refugioAt } from '../data/refugios.js';
import { soundsLibrary } from '../data/sonidos.js';
import { colorPresets } from '../data/colores.js';
import { startSound, stopSound, setSoundVolume, stopAll } from '../audio/engine.js';
import { coverStyle } from '../data/covers.js';
import CoverSVG from './CoverSVG.jsx';

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

function TinyMixer({ onClose }) {
  const { lang } = useApp();
  const [active, setActive] = useState({}); // id -> volume
  const [open, setOpen] = useState(true);

  const toggle = (def) => {
    if (active[def.id] != null) {
      stopSound(def.id);
      const { [def.id]: _, ...rest } = active;
      setActive(rest);
    } else {
      startSound(def, 0.5);
      setActive({ ...active, [def.id]: 50 });
    }
  };

  const setVol = (def, v) => {
    setActive({ ...active, [def.id]: v });
    setSoundVolume(def.id, v / 100);
  };

  return (
    <div className="notebook-card" style={{
      width: 320, maxWidth: '92vw', padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
      animation: 'fadeIn 350ms ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="font-hand" style={{ fontSize: 22 }}>
          {lang === 'es' ? 'mezcla' : 'mixer'}
        </div>
        <button onClick={onClose} aria-label="close"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ref-ink-soft)' }}>
          <X size={18}/>
        </button>
      </div>
      <div style={{
        fontFamily: 'Kalam, sans-serif', fontSize: 12,
        color: 'var(--ref-ink-soft)', opacity: 0.8,
      }}>{lang === 'es' ? 'Toca para sumar capas. Arrastra para asentar.' : 'Tap to layer. Drag to settle.'}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {soundsLibrary.map((def) => {
          const on = active[def.id] != null;
          return (
            <div key={def.id} style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'center', gap: 10,
              padding: '4px 6px',
              borderRadius: 10,
              background: on ? `${def.color}22` : 'transparent',
            }}>
              <button
                className={`chip ${on ? 'on' : ''}`}
                onClick={() => toggle(def)}
                style={{ color: def.color, borderColor: on ? def.color : 'rgba(91,84,112,0.18)' }}
              >
                <span className="state-dot" style={{ background: def.color }} />
                {def.label[lang]}
              </button>
              <Slider
                value={active[def.id] ?? 0}
                onChange={(v) => setVol(def, v)}
                ariaLabel={def.label[lang]}
              />
              <span style={{
                fontFamily: 'Kalam, sans-serif', fontSize: 12,
                color: 'var(--ref-ink-soft)', minWidth: 28, textAlign: 'right',
              }}>{active[def.id] ?? 0}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ColorStrip({ onClose }) {
  const { lang, hue, setHue, sat, setSat, bright, setBright, contrast, setContrast, intensity, setIntensity, applyPreset } = useApp();

  return (
    <div className="notebook-card" style={{
      width: 320, maxWidth: '92vw', padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
      animation: 'fadeIn 350ms ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="font-hand" style={{ fontSize: 22 }}>
          {lang === 'es' ? 'filtro' : 'filter'}
        </div>
        <button onClick={onClose} aria-label="close"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ref-ink-soft)' }}>
          <X size={18}/>
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {colorPresets.map((p) => (
          <button key={p.id} className="chip"
            onClick={() => applyPreset(p.id)}
            title={p.note[lang]}
          >{p.name[lang]}</button>
        ))}
      </div>

      <SliderRow label={lang === 'es' ? 'matiz' : 'hue'} value={hue} onChange={setHue} min={-180} max={180} />
      <SliderRow label={lang === 'es' ? 'saturación' : 'saturation'} value={sat} onChange={setSat} />
      <SliderRow label={lang === 'es' ? 'brillo' : 'brightness'} value={bright} onChange={setBright} />
      <SliderRow label={lang === 'es' ? 'contraste' : 'contrast'} value={contrast} onChange={setContrast} />
      <SliderRow label={lang === 'es' ? 'intensidad' : 'intensity'} value={intensity} onChange={setIntensity} min={0} max={100} />
    </div>
  );
}

function BackdropImg({ refugio, imgIdx, zoomScale, t }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  useEffect(() => { setLoaded(false); setErrored(false); }, [refugio.id, imgIdx]);
  if (errored) return null;
  return (
    <img
      src={refugio.images[imgIdx]}
      alt={t(refugio.title)}
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        transform: `scale(${zoomScale})`,
        transition: 'transform 700ms ease, opacity 800ms ease',
        opacity: loaded ? 1 : 0,
        filter: 'brightness(0.55) saturate(0.85)',
      }}
    />
  );
}

function ThumbButton({ src, index, active, onClick, refugioId }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        flex: '0 0 auto',
        width: 96, height: 60,
        borderRadius: 8,
        border: active ? '2px solid #b9a7d9' : '1px solid rgba(185,167,217,0.25)',
        padding: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        background: coverStyle(refugioId).background,
        scrollSnapAlign: 'start',
      }}
      aria-label={`image ${index + 1}`}
      aria-current={active}
    >
      {!errored && (
        <img
          src={src} alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: loaded ? (active ? 1 : 0.7) : 0,
            transition: 'opacity 500ms ease',
          }}
        />
      )}
    </button>
  );
}

function SliderRow({ label, value, onChange, min = 0, max = 200 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 36px', alignItems: 'center', gap: 8 }}>
      <div style={{ fontFamily: 'Kalam, sans-serif', fontSize: 13, color: 'var(--ref-ink-soft)' }}>{label}</div>
      <Slider value={value} onChange={onChange} min={min} max={max} />
      <div style={{ fontFamily: 'Kalam, sans-serif', fontSize: 12, color: 'var(--ref-ink-soft)', textAlign: 'right' }}>{value}</div>
    </div>
  );
}

export default function RefugioView() {
  const { openRefugioId, openRefugio, closeRefugio, lang, t, masterVol, setMasterVol, startAudio } = useApp();
  const refugio = refugioById(openRefugioId);
  const idx = refugios.findIndex((r) => r.id === refugio.id);
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(50); // 0–100
  const [showMixer, setShowMixer] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showZoom, setShowZoom] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Hide zoom slider on inactivity
  const hideTimer = useRef(null);
  useEffect(() => {
    const reset = () => {
      setShowZoom(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowZoom(false), 2400);
    };
    reset();
    window.addEventListener('mousemove', reset);
    window.addEventListener('wheel', reset, { passive: true });
    return () => {
      clearTimeout(hideTimer.current);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('wheel', reset);
    };
  }, [imgIdx]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextRefugio();
      if (e.key === 'ArrowLeft') prevRefugio();
      if (e.key === 'Escape') closeRefugio();
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => () => { stopAll(); }, [openRefugioId]);

  const prevRefugio = () => {
    const next = refugioAt(idx - 1);
    openRefugio(next.id);
    setImgIdx(0);
  };
  const nextRefugio = () => {
    const next = refugioAt(idx + 1);
    openRefugio(next.id);
    setImgIdx(0);
  };
  const goRandom = () => {
    const r = refugioRandom(refugio.id);
    openRefugio(r.id);
    setImgIdx(0);
  };

  const togglePlay = async () => {
    await startAudio();
    setPlaying(true);
  };

  // Wheel-based navigation between images (within strip)
  const stripRef = useRef(null);
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onWheel = (e) => {
      // If hovering the thumb strip, scroll horizontally.
      // If at edge, switch refugio.
      const atLeft = el.scrollLeft <= 0 && e.deltaY < 0 && e.deltaX < 0;
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((atLeft || atRight) && Math.abs(e.deltaY) > 8) {
        if (atLeft) prevRefugio();
        else nextRefugio();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [idx]);

  // Touch swipe between refuges
  const touchRef = useRef({ x: 0, y: 0, active: false });
  useEffect(() => {
    const onStart = (e) => {
      const t = e.touches ? e.touches[0] : e;
      touchRef.current = { x: t.clientX, y: t.clientY, active: true };
    };
    const onEnd = (e) => {
      if (!touchRef.current.active) return;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      const dx = t.clientX - touchRef.current.x;
      const dy = t.clientY - touchRef.current.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) prevRefugio();
        else nextRefugio();
      }
      touchRef.current.active = false;
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('mousedown', onStart);
    window.addEventListener('touchend', onEnd);
    window.addEventListener('mouseup', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('mousedown', onStart);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('mouseup', onEnd);
    };
  }, [idx]);

  const zoomScale = useMemo(() => 1 + (zoom / 100) * 0.6, [zoom]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#1b1822',
        color: '#efeaf3',
        display: 'flex', flexDirection: 'column',
      }}
      onTouchStart={(e) => { /* delegated via window */ }}
    >
      {/* Backdrop image */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
      }} aria-hidden>
        {/* Always have a procedural fallback */}
        <div style={{ position: 'absolute', inset: 0, ...coverStyle(refugio.id), transform: `scale(${zoomScale})`, transformOrigin: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.7 }}>
          <CoverSVG id={refugio.id}/>
        </div>
        {/* Photo attempts to load on top */}
        <BackdropImg refugio={refugio} imgIdx={imgIdx} zoomScale={zoomScale} t={t}/>
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(60% 60% at 50% 40%, transparent 40%, rgba(20,18,28,0.5) 100%)',
        }}/>
      </div>

      {/* Top bar */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 22px',
        zIndex: 5,
      }}>
        <button onClick={closeRefugio} style={{
          background: 'rgba(47,42,58,0.7)', border: '1px solid rgba(185,167,217,0.4)',
          color: '#fff', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'Kalam, sans-serif', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <ArrowLeft size={16}/>
          <span>{lang === 'es' ? 'volver' : 'back'}</span>
        </button>

        <button onClick={goRandom} style={{
          background: 'rgba(185,167,217,0.85)', border: '1px solid rgba(255,255,255,0.4)',
          color: '#2f2a3a', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'Caveat, cursive', fontSize: 20, display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 0 18px rgba(185,167,217,0.4)',
        }}>
          <Shuffle size={16}/>
          <span>aleatorio</span>
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => setShowMixer((v) => !v)}
          style={iconBtnStyle}
          title={lang === 'es' ? 'Sonidos' : 'Sounds'}
        >
          <Settings2 size={18}/>
        </button>
        <button
          onClick={() => setShowColor((v) => !v)}
          style={iconBtnStyle}
          title={lang === 'es' ? 'Color' : 'Color'}
        >
          <span className="state-dot" style={{ background: 'conic-gradient(from 0deg, #e8e0f0, #a9c9a4, #c79f6c, #c9968f, #b9a7d9, #e8e0f0)', borderRadius: '50%' , width: 16, height: 16 }} />
        </button>
      </div>

      {/* Center title */}
      <div style={{
        position: 'relative',
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 4,
      }}>
        <div style={{
          textAlign: 'center', padding: '20px 24px',
          background: 'rgba(20,18,28,0.32)',
          backdropFilter: 'blur(8px)',
          borderRadius: 22,
          border: '1px solid rgba(185,167,217,0.25)',
          maxWidth: '70%',
        }}>
          <div className="font-hand" style={{ fontSize: 60, lineHeight: 1, color: '#fff' }}>
            {t(refugio.title)}
          </div>
          <div style={{
            fontFamily: 'Kalam, sans-serif', fontSize: 17, color: '#e8e3ee',
            marginTop: 8, opacity: 0.85,
          }}>{t(refugio.desc)}</div>
          <div className="stamp" style={{ display: 'inline-block', marginTop: 14, color: '#e8e3ee' }}>
            {refugio.duration}
          </div>
        </div>
      </div>

      {/* Side arrows */}
      <button
        onClick={prevRefugio}
        aria-label={lang === 'es' ? 'anterior' : 'previous'}
        style={{
          ...arrowBtnStyle, left: 16, top: '50%', transform: 'translateY(-50%)',
        }}
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextRefugio}
        aria-label={lang === 'es' ? 'siguiente' : 'next'}
        style={{
          ...arrowBtnStyle, right: 16, top: '50%', transform: 'translateY(-50%)',
        }}
      >
        <ChevronRight size={28} />
      </button>

      {/* Zoom slider (auto-hides) */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        bottom: 116, zIndex: 6,
        opacity: showZoom ? 1 : 0,
        pointerEvents: showZoom ? 'auto' : 'none',
        transition: 'opacity 600ms ease',
        background: 'rgba(20,18,28,0.5)',
        border: '1px solid rgba(185,167,217,0.25)',
        backdropFilter: 'blur(8px)',
        padding: '8px 16px',
        borderRadius: 999,
        display: 'flex', alignItems: 'center', gap: 12,
        width: 'min(60%, 460px)',
      }}>
        <ZoomOut size={16}/>
        <Slider value={zoom} onChange={setZoom} ariaLabel="zoom"/>
        <ZoomIn size={16}/>
      </div>

      {/* Mixer popover */}
      {showMixer && (
        <div style={{
          position: 'absolute', right: 16, top: 70, zIndex: 7,
        }}>
          <TinyMixer onClose={() => setShowMixer(false)} />
        </div>
      )}
      {showColor && (
        <div style={{
          position: 'absolute', right: 16, top: 70, zIndex: 7,
        }}>
          <ColorStrip onClose={() => setShowColor(false)} />
        </div>
      )}

      {/* Bottom strip of thumbs */}
      <div style={{
        position: 'relative',
        padding: '14px 16px 18px',
        background: 'linear-gradient(0deg, rgba(20,18,28,0.85) 30%, transparent)',
        zIndex: 5,
      }}>
        <div
          ref={stripRef}
          className="thumb-strip scroll-auto-hide"
          style={{
            display: 'flex', gap: 10, overflowX: 'auto',
            scrollSnapType: 'x mandatory',
          }}
        >
          {refugio.images.map((src, i) => (
            <ThumbButton
              key={i}
              src={src}
              index={i}
              active={i === imgIdx}
              onClick={() => setImgIdx(i)}
              refugioId={refugio.id}
            />
          ))}
        </div>

        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
        }}>
          <button
            onClick={togglePlay}
            style={{
              background: 'rgba(185,167,217,0.85)', color: '#2f2a3a',
              border: '1px solid rgba(255,255,255,0.4)', padding: '8px 16px',
              borderRadius: 999, cursor: 'pointer',
              fontFamily: 'Kalam, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {playing ? <Pause size={16}/> : <Play size={16}/>}
            {lang === 'es' ? (playing ? 'pausar' : 'reproducir') : (playing ? 'pause' : 'play')}
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(20,18,28,0.5)',
            padding: '6px 12px', borderRadius: 999,
            border: '1px solid rgba(185,167,217,0.25)',
          }}>
            <span style={{ fontFamily: 'Kalam, sans-serif', fontSize: 13, color: '#cfc7da' }}>
              {lang === 'es' ? 'volumen' : 'volume'}
            </span>
            <div style={{ width: 120 }}>
              <Slider
                value={Math.round(masterVol * 100)}
                onChange={(v) => setMasterVol(v / 100)}
                ariaLabel="master volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const iconBtnStyle = {
  background: 'rgba(20,18,28,0.6)',
  border: '1px solid rgba(185,167,217,0.35)',
  color: '#fff',
  width: 40, height: 40, borderRadius: 999,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  backdropFilter: 'blur(6px)',
};

const arrowBtnStyle = {
  position: 'absolute',
  background: 'rgba(20,18,28,0.5)',
  border: '1px solid rgba(185,167,217,0.3)',
  color: '#fff',
  width: 48, height: 48, borderRadius: 999,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', backdropFilter: 'blur(6px)',
  zIndex: 6,
};
