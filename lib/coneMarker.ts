/**
 * Montreal's unofficial mascot: the orange traffic cone. Returns an inline SVG
 * string used as the Leaflet marker icon (kept flat + crisp for legibility at
 * ~34px). `filled` swaps to a green cone. Matches the ConeIcon brand mark.
 */
export function coneMarkerSvg(filled = false): string {
  const body = filled ? "#22b34f" : "#ff6a1f";
  const shade = filled ? "#199040" : "#df4d0e";
  const base = filled ? "#1f9e47" : "#e8580f";
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="40" viewBox="0 0 34 40">
  <ellipse cx="17" cy="37" rx="12.5" ry="2.6" fill="#000" opacity="0.22"/>
  <path d="M8 33.5 Q8 32 9.4 32 L24.6 32 Q26 32 26 33.5 L27.6 37 Q28 38.2 26.6 38.2 L7.4 38.2 Q6 38.2 6.4 37 Z" fill="${base}"/>
  <path d="M17 3.5 L26.8 33 Q17 36 7.2 33 Z" fill="${body}" stroke="${shade}" stroke-width="0.5" stroke-linejoin="round"/>
  <path d="M17 3.5 L26.8 33 Q21.9 34.5 17 33 Z" fill="${shade}" opacity="0.45"/>
  <path d="M9.6 25 L24.4 25 L25.9 30 L8.1 30 Z" fill="#fff"/>
  <path d="M12.9 14.5 L21.1 14.5 L22 18.5 L12 18.5 Z" fill="#fff"/>
</svg>`.trim();
}
