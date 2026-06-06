/**
 * Montreal's unofficial mascot: the orange traffic cone. Returns an inline SVG
 * string used as the Leaflet marker icon. `filled` swaps to a green cone.
 */
export function coneMarkerSvg(filled = false): string {
  const body = filled ? "#54d17a" : "#ff6a13";
  const edge = filled ? "#2fa757" : "#d8530a";
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="40" viewBox="0 0 34 40">
  <ellipse cx="17" cy="37" rx="13" ry="3" fill="#000" opacity="0.35"/>
  <rect x="3" y="32.5" width="28" height="5" rx="2.5" fill="${body}"/>
  <path d="M17 3 L27.5 33 H6.5 Z" fill="${body}" stroke="${edge}" stroke-width="0.8"/>
  <path d="M14.2 17 H19.8 L20.9 21 H13.1 Z" fill="#fff"/>
  <path d="M12.2 25 H21.8 L23 29 H11 Z" fill="#fff"/>
  <path d="M15.6 9 H18.4 L19 12.5 H15 Z" fill="#fff" opacity="0.9"/>
</svg>`.trim();
}
