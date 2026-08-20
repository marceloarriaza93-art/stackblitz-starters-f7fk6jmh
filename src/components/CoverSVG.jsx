import React from 'react';
import { coverPalette, hashCode } from '../data/covers.js';

export default function CoverSVG({ id, className }) {
  const palette = coverPalette(id);
  const colors = palette[0];
  const seed = hashCode(id);
  const blobs = [];
  for (let i = 0; i < 5; i++) {
    const cx = (seed * (i + 7) * 13) % 100;
    const cy = (seed * (i + 11) * 7) % 100;
    const r = 30 + ((seed + i * 19) % 30);
    blobs.push({ cx, cy, r, c: colors[i % colors.length] });
  }
  return (
    <svg
      className={className}
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors[0]}/>
          <stop offset="1" stopColor={colors[colors.length - 1]}/>
        </linearGradient>
        <filter id={`b-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="100" height="60" fill={`url(#g-${id})`}/>
      {blobs.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r}
          fill={b.c} opacity="0.55" filter={`url(#b-${id})`} />
      ))}
      <rect width="100" height="60" fill="rgba(20,18,28,0.18)" />
    </svg>
  );
}
