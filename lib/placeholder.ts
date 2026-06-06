/**
 * Offline-safe themed "photo" placeholders for seeded potholes.
 * Returns an SVG data-URL drawing a stylized cracked-asphalt pothole so the
 * demo never depends on the network for images.
 */
export function potholePlaceholder(seed: string): string {
  // Deterministic pseudo-random from the seed string (no Math.random — stable SSR).
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const blobR = 70 + (h % 28);
  const cx = 150 + ((h >> 3) % 40) - 20;
  const cy = 115 + ((h >> 6) % 30) - 15;
  const rot = (h >> 9) % 360;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220" viewBox="0 0 300 220">
  <defs>
    <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#42424a"/>
      <stop offset="1" stop-color="#2c2c32"/>
    </linearGradient>
    <radialGradient id="hole" cx="50%" cy="42%" r="60%">
      <stop offset="0" stop-color="#0a0a0c"/>
      <stop offset="0.7" stop-color="#161618"/>
      <stop offset="1" stop-color="#262629"/>
    </radialGradient>
  </defs>
  <rect width="300" height="220" fill="url(#road)"/>
  <g opacity="0.18" stroke="#000" stroke-width="1.5" fill="none">
    <path d="M0 60 L300 75 M0 150 L300 140 M70 0 L60 220 M210 0 L225 220"/>
  </g>
  <g transform="rotate(${rot} ${cx} ${cy})">
    <ellipse cx="${cx}" cy="${cy}" rx="${blobR}" ry="${blobR * 0.74}" fill="url(#hole)" stroke="#0a0a0c" stroke-width="3"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${blobR * 0.62}" ry="${blobR * 0.46}" fill="#050506"/>
  </g>
  <g stroke="#1a1a1c" stroke-width="1.4" opacity="0.6" fill="none">
    <path d="M${cx - blobR} ${cy} L${cx - blobR - 28} ${cy - 22} M${cx + blobR} ${cy + 6} L${cx + blobR + 30} ${cy + 26} M${cx} ${cy + blobR * 0.74} L${cx - 18} ${cy + blobR + 18}"/>
  </g>
  <rect x="0" y="190" width="300" height="30" fill="#ff6a13"/>
  <text x="12" y="210" font-family="Arial Narrow, Arial, sans-serif" font-size="15" font-weight="bold" fill="#14141a" letter-spacing="0.5">⚠ POTHOLE — REPORTED</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
