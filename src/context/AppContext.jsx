import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { colorPresets } from '../data/colores.js';
import { startAudio, setMasterVolume, stopAll } from '../audio/engine.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('es');
  const [dyslexia, setDyslexia] = useState(false);
  const [tab, setTab] = useState('explorar');
  const [openRefugioId, setOpenRefugioId] = useState(null);
  const [polivagal, setPolivagal] = useState('ventral');

  // Color filter
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(100);
  const [bright, setBright] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [intensity, setIntensity] = useState(40);
  const applyPreset = useCallback((id) => {
    const p = colorPresets.find((x) => x.id === id);
    if (!p) return;
    setHue(p.hue);
    setSat(p.sat);
    setBright(p.bright);
    setContrast(p.contrast);
  }, []);

  // Master audio
  const [masterVol, setMasterVol] = useState(0.6);
  useEffect(() => setMasterVolume(masterVol), [masterVol]);

  // Apply CSS variables globally
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--ref-hue', `${hue}deg`);
    root.setProperty('--ref-sat', `${sat}%`);
    root.setProperty('--ref-bright', `${bright}%`);
    root.setProperty('--ref-contrast', `${contrast}%`);
  }, [hue, sat, bright, contrast]);

  useEffect(() => {
    if (dyslexia) document.body.classList.add('dyslexia');
    else document.body.classList.remove('dyslexia');
  }, [dyslexia]);

  // Open refugio
  const openRefugio = useCallback((id) => setOpenRefugioId(id), []);
  const closeRefugio = useCallback(() => {
    setOpenRefugioId(null);
    stopAll();
  }, []);

  const value = useMemo(
    () => ({
      // language
      lang, setLang, t: (s) => s[lang],
      // dyslexia
      dyslexia, setDyslexia,
      // tab
      tab, setTab,
      // refugio
      openRefugioId, openRefugio, closeRefugio,
      // color
      hue, setHue, sat, setSat, bright, setBright, contrast, setContrast, intensity, setIntensity, applyPreset,
      // audio
      masterVol, setMasterVol,
      // polivagal
      polivagal, setPolivagal,
      // utils
      startAudio,
    }),
    [lang, dyslexia, tab, openRefugioId, hue, sat, bright, contrast, intensity, masterVol, polivagal, openRefugio, closeRefugio, applyPreset]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
