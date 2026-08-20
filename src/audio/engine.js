// Procedural audio engine — Web Audio API.
// Builds generators from soundLibrary definitions, mixes them through master gain.

let ctx = null;
let masterGain = null;
let started = false;
// id → { def, gain, stop(), cleanup }
const sources = new Map();

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMasterVolume(v) {
  ensureCtx();
  masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), ctx.currentTime, 0.05);
}

export async function startAudio() {
  ensureCtx();
  if (started) return;
  started = true;
}

export function isAudioStarted() { return started; }

// ----- Noise buffers -----
const noiseCache = {};
function noiseBuffer(kind) {
  if (noiseCache[kind]) return noiseCache[kind];
  const length = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, length, ctx.sampleRate);
  const d = buf.getChannelData(0);
  if (kind === 'white') {
    for (let i = 0; i < length; i++) d[i] = (Math.random() * 2 - 1) * 0.6;
  } else if (kind === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.96900 * b2 + w * 0.1538520;
      b3 = 0.86650 * b3 + w * 0.3104856;
      b4 = 0.55000 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.0168980;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  } else if (kind === 'brown') {
    let last = 0;
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
  }
  noiseCache[kind] = buf;
  return buf;
}

// ----- Source builders -----
function buildPluck(def) {
  // Repeated pluck on a random note from def.notes
  const out = ctx.createGain();
  out.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 4000;
  filter.connect(out);

  let stopped = false;
  const interval = setInterval(() => {
    if (stopped) return;
    const t = ctx.currentTime;
    const f = def.notes[Math.floor(Math.random() * def.notes.length)];
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    osc.connect(g); g.connect(filter);
    osc.start(t); osc.stop(t + 1.5);
  }, def.rate * 1000);

  return { out, cleanup: () => { stopped = true; clearInterval(interval); } };
}

function buildNoisePluck(def) {
  // Short burst of filtered noise — sand shaker / pandero
  const out = ctx.createGain();
  out.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = def.colorStart || 2000;
  filter.Q.value = 1.2;
  filter.connect(out);

  let stopped = false;
  const interval = setInterval(() => {
    if (stopped) return;
    const t = ctx.currentTime;
    const buf = noiseBuffer('pink');
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = false;
    // Play a slice — short noise burst
    src.connect(filter);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.35, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    g.connect(filter);
    src.start(t);
    src.stop(t + 0.3);
  }, def.rate * 1000);

  return { out, cleanup: () => { stopped = true; clearInterval(interval); } };
}

function buildClick(def) {
  const out = ctx.createGain();
  out.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1500;
  filter.connect(out);

  let stopped = false;
  const interval = setInterval(() => {
    if (stopped) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 4000 + Math.random() * 800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(g); g.connect(filter);
    osc.start(t); osc.stop(t + 0.06);
  }, def.rate * 1000);

  return { out, cleanup: () => { stopped = true; clearInterval(interval); } };
}

function buildBellFm(def) {
  // Tibetan bell — FM-synthed with random fundamental + harmonics, slow rate.
  const out = ctx.createGain();
  out.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 3000;
  filter.connect(out);

  let stopped = false;
  const interval = setInterval(() => {
    if (stopped) return;
    const t = ctx.currentTime;
    const f = def.notes[Math.floor(Math.random() * def.notes.length)];
    const carrier = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    carrier.type = 'sine';
    mod.type = 'sine';
    carrier.frequency.value = f;
    mod.frequency.value = f * 2.7;
    modGain.gain.value = f * 1.4;
    mod.connect(modGain); modGain.connect(carrier.frequency);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 4);

    carrier.connect(g); g.connect(filter);
    mod.start(t); carrier.start(t);
    mod.stop(t + 4); carrier.stop(t + 4);
  }, def.rate * 1000);

  return { out, cleanup: () => { stopped = true; clearInterval(interval); } };
}

function buildBellTone(def) {
  // Clean bell-like bell: triangle + gentle harmonics.
  const out = ctx.createGain();
  out.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 4000;
  filter.connect(out);

  let stopped = false;
  const interval = setInterval(() => {
    if (stopped) return;
    const t = ctx.currentTime;
    const f = def.notes[Math.floor(Math.random() * def.notes.length)];
    [1, 2.76, 5.4].forEach((mul, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f * mul;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25 / (i + 1), t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2);
      osc.connect(g); g.connect(filter);
      osc.start(t); osc.stop(t + 2.1);
    });
  }, def.rate * 1000);

  return { out, cleanup: () => { stopped = true; clearInterval(interval); } };
}

function buildBinaural(def) {
  // Stereo binaural: L = carrier, R = carrier + beat.
  const out = ctx.createGain();
  out.gain.value = 0;
  out.channelCount = 2;

  const merger = ctx.createChannelMerger(2);
  const l = ctx.createOscillator();
  const r = ctx.createOscillator();
  l.type = 'sine';
  r.type = 'sine';
  l.frequency.value = def.carrier;
  r.frequency.value = def.carrier + def.beat;
  const lGain = ctx.createGain(); lGain.gain.value = 0.12;
  const rGain = ctx.createGain(); rGain.gain.value = 0.12;
  l.connect(lGain); r.connect(rGain);
  lGain.connect(merger, 0, 0);
  rGain.connect(merger, 0, 1);
  merger.connect(out);

  l.start(); r.start();
  return { out, cleanup: () => { try { l.stop(); r.stop(); } catch(e){} } };
}

function buildPureTone(def) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = def.freq;
  const g = ctx.createGain();
  g.gain.value = 0;
  osc.connect(g);
  return { out: g, cleanup: () => { try { osc.stop(); } catch(e){} } };
}

function buildDrone(def) {
  const out = ctx.createGain();
  out.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  filter.connect(out);

  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  oscA.type = 'sawtooth';
  oscB.type = 'sine';
  oscA.frequency.value = def.freq;
  oscB.frequency.value = def.freq * 1.5;
  oscB.detune.value = -def.detune;

  const gA = ctx.createGain(); gA.gain.value = 0.06;
  const gB = ctx.createGain(); gB.gain.value = 0.18;

  oscA.connect(gA); oscB.connect(gB);
  gA.connect(filter); gB.connect(filter);
  oscA.start(); oscB.start();

  return { out, cleanup: () => { try { oscA.stop(); oscB.stop(); } catch(e){} } };
}

function buildNoise(def) {
  const out = ctx.createGain();
  out.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = def.filter || 1500;
  filter.connect(out);

  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(def.colorNoise || 'pink');
  src.loop = true;

  const ampLfo = ctx.createOscillator();
  const ampLfoGain = ctx.createGain();
  ampLfo.frequency.value = def.lfo || 0.2;
  ampLfoGain.gain.value = 0.18;
  ampLfo.connect(ampLfoGain);

  const ampBase = ctx.createGain();
  ampBase.gain.value = 0.8;
  ampLfoGain.connect(ampBase.gain);

  src.connect(filter);
  filter.connect(ampBase);
  ampBase.connect(out);

  src.start();
  ampLfo.start();

  return { out, cleanup: () => { try { src.stop(); ampLfo.stop(); } catch(e){} } };
}

const builders = {
  pluck: buildPluck,
  'noise-pluck': buildNoisePluck,
  click: buildClick,
  'bell-fm': buildBellFm,
  'bell-tone': buildBellTone,
  binaural: buildBinaural,
  'pure-tone': buildPureTone,
  drone: buildDrone,
  noise: buildNoise,
};

// Public API
export function startSound(def, volume = 0.5) {
  ensureCtx();
  if (sources.has(def.id)) return sources.get(def.id);
  const builder = builders[def.type];
  if (!builder) return null;
  const built = builder(def);
  built.out.connect(masterGain);
  built.out.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
  const entry = { def, gain: built.out, cleanup: built.cleanup, volume };
  sources.set(def.id, entry);
  return entry;
}

export function stopSound(defId) {
  const entry = sources.get(defId);
  if (!entry) return;
  try { entry.gain.disconnect(); } catch (e) {}
  try { entry.cleanup(); } catch (e) {}
  sources.delete(defId);
}

export function setSoundVolume(defId, volume) {
  const entry = sources.get(defId);
  if (!entry) return;
  entry.gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
  entry.volume = volume;
}

export function activeSounds() {
  return Array.from(sources.values()).map((s) => s.def.id);
}

export function stopAll() {
  for (const defId of activeSounds()) stopSound(defId);
}
