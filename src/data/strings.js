// Polivagal state presets for the regulator.

export const polivagalStates = [
  {
    id: 'sympathetic',
    label: { es: 'Activado', en: 'Activated' },
    glyph: { es: 'Alerta, irritable', en: 'Alert, irritable' },
    dot: '#c9968f',
    inh: '4 s',
    ex: '7 s', // longer exhale — vagal brake
    visualMode: 'low-contrast',
    note: {
      es: 'Exhala lento. Bajemos la guardia con amabilidad.',
      en: 'Breathe out slow. Lower the guard softly.',
    },
  },
  {
    id: 'dorsal',
    label: { es: 'Apagado', en: 'Shut down' },
    glyph: { es: 'Vacío, lejos', en: 'Empty, distant' },
    dot: '#c79f6c',
    inh: '4 s',
    ex: '4 s',
    visualMode: 'warm-soft',
    note: {
      es: 'Tibieza, calor. Cero exigencia.',
      en: 'Warmth and warmth. Zero demands.',
    },
  },
  {
    id: 'ventral',
    label: { es: 'Seguro', en: 'Safe' },
    glyph: { es: 'Presente, tranquilo', en: 'Present, quiet' },
    dot: '#a9c9a4',
    inh: '4 s',
    ex: '6 s',
    visualMode: 'open-flow',
    note: {
      es: 'Estás aquí. Glimmer visible.',
      en: 'You are here. Glimmer visible.',
    },
  },
];

export const navItems = [
  { id: 'explorar', icon: 'Compass',     label: { es: 'Explorar', en: 'Explore' } },
  { id: 'colores',  icon: 'Palette',     label: { es: 'Colores',  en: 'Color' } },
  { id: 'sonidos',  icon: 'AudioWaveform', label: { es: 'Sonidos',  en: 'Sounds' } },
  { id: 'saber',    icon: 'BookOpen',    label: { es: 'Saber',    en: 'Know' } },
];
