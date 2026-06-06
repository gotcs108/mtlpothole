/**
 * The Montreal traffic cone — orange body, two reflective white bands, flared
 * base. Used as the brand mark, the landing image, and (in string form via
 * lib/coneMarker) the map markers. Gradient ids are fixed; duplicate identical
 * defs across instances resolve to the same paint, so this stays hook-free and
 * safe to render in Server Components.
 */
export function ConeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fmhConeBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff9a52" />
          <stop offset="0.45" stopColor="#ff6a1f" />
          <stop offset="1" stopColor="#df4d0e" />
        </linearGradient>
        <linearGradient id="fmhConeBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#d8480c" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="32" cy="57" rx="22" ry="3.2" fill="#000" opacity="0.18" />
      {/* flared base */}
      <path
        d="M15 51 Q15 49 17 49 L47 49 Q49 49 49 51 L51.5 55.5 Q52 57 50 57 L14 57 Q12 57 12.5 55.5 Z"
        fill="url(#fmhConeBase)"
        stroke="#c8450c"
        strokeWidth="0.5"
      />
      {/* cone body */}
      <path
        d="M32 7 L46 50 Q32 54 18 50 Z"
        fill="url(#fmhConeBody)"
        stroke="#c8450c"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* reflective bands */}
      <path d="M22.4 37 L41.6 37 L43.7 44 L20.3 44 Z" fill="#fff" />
      <path d="M27 24 L37 24 L37.8 29 L26.2 29 Z" fill="#fff" />
      {/* left highlight */}
      <path d="M31 9 L24 46 L27.5 46 Z" fill="#fff" opacity="0.16" />
    </svg>
  );
}
