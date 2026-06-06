export function ConeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {/* base */}
      <ellipse cx="24" cy="42" rx="18" ry="4" fill="#14141a" opacity="0.35" />
      <rect x="6" y="38" width="36" height="5" rx="2.5" fill="#ff6a13" />
      {/* cone body */}
      <path
        d="M24 5 L34 38 H14 Z"
        fill="#ff6a13"
        stroke="#d8530a"
        strokeWidth="1"
      />
      {/* reflective bands */}
      <path d="M20.7 21 H27.3 L28.4 25 H19.6 Z" fill="#fff" />
      <path d="M18.7 29 H29.3 L30.4 33 H17.6 Z" fill="#fff" />
      <path d="M22.5 9 L25.5 9 L26.2 13 L21.8 13 Z" fill="#fff" opacity="0.9" />
    </svg>
  );
}
