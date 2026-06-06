/**
 * The brand mark: an orange reflective traffic drum (channelizer barrel) —
 * orange body, two white reflective bands, domed lid, dark rubber base.
 * Used as the logo, favicon (see app/icon.svg) and landing image; the map
 * markers mirror it via lib/coneMarker. Gradient ids are fixed; duplicate
 * identical defs resolve to the same paint, so this stays hook-free and safe
 * in Server Components.
 *
 * (Component/file name kept as ConeIcon to avoid churn across imports + CSS.)
 */
export function ConeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fmhDrumBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff9a52" />
          <stop offset="0.5" stopColor="#ff6a1f" />
          <stop offset="1" stopColor="#df4d0e" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="32" cy="57" rx="21" ry="3" fill="#000" opacity="0.18" />
      {/* dark rubber base */}
      <path
        d="M15 50 Q12 50 12 53 L12 55 Q12 58 15 58 L49 58 Q52 58 52 55 L52 53 Q52 50 49 50 Z"
        fill="#23232a"
      />
      {/* drum body */}
      <path
        d="M19 17 C19 14 21 13 24 13 L40 13 C43 13 45 14 45 17 L45 51 L19 51 Z"
        fill="url(#fmhDrumBody)"
        stroke="#c8450c"
        strokeWidth="0.6"
      />
      {/* domed lid + handle slot */}
      <ellipse cx="32" cy="13.5" rx="13" ry="3.2" fill="#ff8f47" stroke="#c8450c" strokeWidth="0.5" />
      <ellipse cx="32" cy="13" rx="4" ry="1.3" fill="#c2470d" opacity="0.5" />
      {/* reflective bands */}
      <rect x="19" y="20" width="26" height="6" fill="#fff" />
      <rect x="19" y="33" width="26" height="6" fill="#fff" />
      {/* left highlight */}
      <rect x="19.5" y="17" width="5" height="34" fill="#fff" opacity="0.12" />
    </svg>
  );
}
