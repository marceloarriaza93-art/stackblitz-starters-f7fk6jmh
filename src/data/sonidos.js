// Procedural sound library — Web Audio API synthesis with media into the mixer.
// Each definition describes either a procedural tone/noise generator or a sample.
// The mixer in App composes these via audioNodes connected to a master gain.

export const soundCategories = [
  { id: 'percussion', label: { es: 'Percusión', en: 'Percussion' } },
  { id: 'melodic', label: { es: 'Melódicos', en: 'Melodic' } },
  { id: 'freq', label: { es: 'Frecuencias', en: 'Frequencies' } },
  { id: 'drone', label: { es: 'Drones', en: 'Drones' } },
  { id: 'nature', label: { es: 'Naturaleza', en: 'Nature' } },
];

export const soundsLibrary = [
  // Percussion — synthesized, gentle
  {
    id: 'kalimba',
    category: 'percussion',
    label: { es: 'Kalimba', en: 'Kalimba' },
    color: '#c79f6c',
    type: 'pluck',
    notes: [220, 277, 330, 392, 440, 523, 587],
    rate: 0.7, // seconds between strikes
  },
  {
    id: 'pandero',
    category: 'percussion',
    label: { es: 'Pandero', en: 'Frame Drum' },
    color: '#c9968f',
    type: 'noise-pluck',
    colorStart: 600, // Hz center
    rate: 1.3,
  },
  {
    id: 'calabazas',
    category: 'percussion',
    label: { es: 'Calabazas', en: 'Maracas' },
    color: '#a9c9a4',
    type: 'noise-pluck',
    colorStart: 2500,
    rate: 0.45,
  },
  {
    id: 'castanets',
    category: 'percussion',
    label: { es: 'Castañuelas', en: 'Castanets' },
    color: '#b9a7d9',
    type: 'click',
    rate: 0.6,
  },

  // Melodic — Tibetan bells, kalimba-like FM tones
  {
    id: 'tibetan',
    category: 'melodic',
    label: { es: 'Campanas Tibetanas', en: 'Tibetan Bells' },
    color: '#b9a7d9',
    type: 'bell-fm',
    notes: [174, 261, 396, 528], // solfeggio-friendly fundamentals
    rate: 4,
  },
  {
    id: 'glockenspiel',
    category: 'melodic',
    label: { es: 'Carrillón', en: 'Glockenspiel' },
    color: '#a9c9a4',
    type: 'bell-tone',
    notes: [523, 659, 784, 988, 1175],
    rate: 7,
  },

  // Frequencies — binaural-ish, deep
  {
    id: 'theta',
    category: 'freq',
    label: { es: 'Theta 6 Hz', en: 'Theta 6 Hz' },
    color: '#5b5470',
    type: 'binaural',
    carrier: 220,
    beat: 6,
  },
  {
    id: 'alpha',
    category: 'freq',
    label: { es: 'Alpha 10 Hz', en: 'Alpha 10 Hz' },
    color: '#5b5470',
    type: 'binaural',
    carrier: 220,
    beat: 10,
  },
  {
    id: 'solfeggio-528',
    category: 'freq',
    label: { es: '528 Hz', en: '528 Hz' },
    color: '#c79f6c',
    type: 'pure-tone',
    freq: 528,
  },
  {
    id: 'solfeggio-432',
    category: 'freq',
    label: { es: '432 Hz', en: '432 Hz' },
    color: '#c79f6c',
    type: 'pure-tone',
    freq: 432,
  },

  // Drones — long sustained FM
  {
    id: 'drone-cathedral',
    category: 'drone',
    label: { es: 'Drone Catedral', en: 'Cathedral Drone' },
    color: '#5b5470',
    type: 'drone',
    freq: 96,
    detune: 7,
  },
  {
    id: 'drone-amber',
    category: 'drone',
    label: { es: 'Drone Ámbar', en: 'Amber Drone' },
    color: '#c79f6c',
    type: 'drone',
    freq: 110,
    detune: 12,
  },

  // Nature — synthesized
  {
    id: 'rain',
    category: 'nature',
    label: { es: 'Lluvia', en: 'Rainfall' },
    color: '#a9c9a4',
    type: 'noise',
    colorNoise: 'pink',
    filter: 2200,
  },
  {
    id: 'ocean',
    category: 'nature',
    label: { es: 'Mar', en: 'Ocean' },
    color: '#b9a7d9',
    type: 'noise',
    colorNoise: 'brown',
    filter: 800,
    lfo: 0.18,
  },
  {
    id: 'wind',
    category: 'nature',
    label: { es: 'Viento', en: 'Wind' },
    color: '#c9968f',
    type: 'noise',
    colorNoise: 'pink',
    filter: 400,
    lfo: 0.3,
  },
  {
    id: 'river',
    category: 'nature',
    label: { es: 'Río', en: 'River' },
    color: '#a9c9a4',
    type: 'noise',
    colorNoise: 'pink',
    filter: 1600,
  },
  {
    id: 'fire',
    category: 'nature',
    label: { es: 'Fogata', en: 'Fireplace' },
    color: '#c79f6c',
    type: 'noise',
    colorNoise: 'pink',
    filter: 1100,
    lfo: 0.4,
  },
];
