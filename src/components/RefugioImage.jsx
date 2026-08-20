import React, { useState } from 'react';
import { coverStyle } from '../data/covers.js';
import CoverSVG from './CoverSVG.jsx';

/**
 * Image-with-SVG-fallback. SVG layer is always rendered underneath the photo.
 * If the photo URL fails to load, the SVG cover is the only visible layer.
 */
export default function RefugioImage({ refugioId, src, alt, style, imageStyle }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Always render the SVG cover */}
      <div style={{ position: 'absolute', inset: 0, ...coverStyle(refugioId) }} aria-hidden />

      {/* Layered blobs SVG (gives organic texture even with photo loaded) */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: errored ? 1 : 0.45,
        mixBlendMode: 'soft-light',
        transition: 'opacity 800ms ease',
      }} aria-hidden>
        <CoverSVG id={refugioId} />
      </div>

      {/* Photo layer, fades in when loaded */}
      {!errored && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 700ms ease',
            ...imageStyle,
          }}
        />
      )}

      {/* Loading breath orb */}
      {!loaded && !errored && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden>
          <div className="breath-orb" />
        </div>
      )}
    </div>
  );
}
