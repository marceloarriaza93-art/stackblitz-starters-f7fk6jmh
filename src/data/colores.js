// Color psychology presets — mapped to hue rotation around 0° (default).
// The "intensity" slider scales saturation; temp adjusts brightness; etc.

export const colorPresets = [
  {
    id: 'calma',
    name: { es: 'Calma Violeta', en: 'Violet Calm' },
    hue: 270, sat: 88, bright: 96, contrast: 98,
    note: {
      es: 'Violeta reduce la reactividad simpática y acompaña el descenso vagal.',
      en: 'Violet softens sympathetic reactivity and supports the vagal descent.',
    },
  },
  {
    id: 'verde',
    name: { es: 'Verde Alivia', en: 'Verde Relief' },
    hue: 95, sat: 86, bright: 102, contrast: 100,
    note: {
      es: 'Verde amortigua la carga perceptual y abre espacio para glimmers.',
      en: 'Verde dampens perceptual load and opens space for glimmers.',
    },
  },
  {
    id: 'ambar',
    name: { es: 'Ámbar Abriga', en: 'Amber Hold' },
    hue: 30, sat: 90, bright: 96, contrast: 102,
    note: {
      es: 'Ámbar caldea el agarre interoceptivo — sostén del holding.',
      en: 'Amber warms interoceptive hold — a fascial warmth.',
    },
  },
  {
    id: 'rosa',
    name: { es: 'Rosa Acoge', en: 'Rose Welcome' },
    hue: 340, sat: 88, bright: 100, contrast: 100,
    note: {
      es: 'Rosa prepara el sistema para la co-regulación y el puerto seguro.',
      en: 'Rose prepares the system for co-regulation and safe harbour.',
    },
  },
  {
    id: 'azul',
    name: { es: 'Azul Profundo', en: 'Deep Blue' },
    hue: 215, sat: 92, bright: 96, contrast: 100,
    note: {
      es: 'Azul favorece el silenciamiento cortical y la rumia suave.',
      en: 'Deep blue favours cortical quieting and slow rumination.',
    },
  },
  {
    id: 'neutro',
    name: { es: 'Neutro', en: 'Neutral' },
    hue: 0, sat: 100, bright: 100, contrast: 100,
    note: {
      es: 'Sin filtro. La quietud del cuaderno en blanco.',
      en: 'No filter. The quiet of a blank page.',
    },
  },
];

export const colorNotes = {
  es: [
    { kw: 'Violeta', fx: 'desciende la reactividad, abre el Temenos.' },
    { kw: 'Verde', fx: 'amortigua la hipervigilancia, sostiene el glimming.' },
    { kw: 'Azul', fx: 'enfría el arousal simpático, induce pausa.' },
    { kw: 'Ámbar', fx: 'caldea, abraza, favorece el holding.' },
    { kw: 'Rosa', fx: 'prepara la co-regulación y el puerto seguro.' },
    { kw: 'Gris cálido', fx: 'acompaña el shutdown dorsal con cero demanda.' },
  ],
  en: [
    { kw: 'Violet', fx: 'descends reactivity, opens the Temenos.' },
    { kw: 'Green', fx: 'dampens hypervigilance, fosters glimming.' },
    { kw: 'Blue', fx: 'cools sympathetic arousal, invites pause.' },
    { kw: 'Amber', fx: 'warms, holds, favours holding.' },
    { kw: 'Rose', fx: 'prepares co-regulation and safe harbour.' },
    { kw: 'Warm grey', fx: 'accompanies dorsal shutdown with zero demand.' },
  ],
};
