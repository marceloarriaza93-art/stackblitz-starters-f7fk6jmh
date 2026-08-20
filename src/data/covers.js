// Procedural SVG covers — part 1: palettes + gradient helpers.

const palettes = {
  auroras:  [['#0a3a3a', '#1d6f6f', '#a9d8c3', '#e8e3a7'], ['#03252d', '#0f4858', '#5fb2a7', '#fff5b8']],
  cueva:    [['#0c1d3a', '#1c4070', '#7faec9', '#e8f1f5'], ['#0c1d3a', '#2b5d8a', '#9ad0de', '#e8f1f5']],
  isla:     [['#1a0a05', '#5b2a17', '#c25e30', '#f4b07a'], ['#1c1004', '#3e2207', '#a65328', '#f7c08f']],
  tundra:   [['#1f2a40', '#3d4d6e', '#8ea4be', '#eef3f8'], ['#15203a', '#4d6488', '#b6cce0', '#eef3f8']],
  secuoyas: [['#101a0f', '#1f3320', '#46673e', '#9eb97c'], ['#101a0f', '#2a4030', '#5e8e62', '#bcd29a']],
  dunas:    [['#3a1f0c', '#8a522a', '#d29c5e', '#f4d29c'], ['#3a1f0c', '#a76a37', '#e2b078', '#fae0b1']],
  granja:   [['#1a2810', '#365028', '#729454', '#d6dba0'], ['#1a2810', '#4a6c3b', '#a3b774', '#e7e2a8']],
  lluvia:   [['#0c1a26', '#294458', '#5b7990', '#bcc9d4'], ['#0c1a26', '#3a5b73', '#7e95a9', '#cfd9e0']],
  rio:      [['#0c2820', '#26584a', '#5b9a85', '#b9d8c9'], ['#0c2820', '#3a7360', '#86b8a3', '#d3e7dd']],
  acantilado: [['#15162a', '#304c66', '#7e96ad', '#cdd6df'], ['#15162a', '#3a5e7d', '#9ab6cb', '#dde4ea']],
  cascada:  [['#0a201a', '#265848', '#7eb8a3', '#dbeae3'], ['#0a201a', '#3a7868', '#a3d2bf', '#e6f0ec']],
  'pueblo-mar': [['#1a2a3a', '#3e5b7d', '#88a5be', '#cddae5'], ['#1a2a3a', '#58738e', '#a8c2d5', '#dae5ed']],
  'pueblo-mont': [['#1f1810', '#4a3625', '#8e6c4a', '#cdb48e'], ['#1f1810', '#5b4630', '#a2805b', '#d4bca0']],
  montana:  [['#0a1a2a', '#26415c', '#688198', '#b3c5d2'], ['#0a1a2a', '#34546e', '#789baf', '#c0d2dc']],
  cabana:   [['#1c0e08', '#3d2415', '#7d4e30', '#c99679'], ['#1c0e08', '#4a2f1d', '#94623e', '#dab393']],
  bosque:   [['#0c1a0c', '#244926', '#527a55', '#9ab985'], ['#0c1a0c', '#345e36', '#6f9b73', '#bdd6ad']],
};

export function coverPalette(id) {
  return palettes[id] || palettes.auroras;
}

export function coverStyle(id, role = 'card') {
  const palette = coverPalette(id);
  const colors = palette[role === 'veil' ? 1 : 0];
  const angle = 135 + (hashCode(id) % 90);
  return {
    background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
  };
}

export function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
