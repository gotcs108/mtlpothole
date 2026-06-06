/**
 * The map marker: an orange reflective traffic drum (channelizer barrel),
 * kept flat (no gradients) so it stays crisp at ~34px and avoids the
 * Leaflet add/remove duplicate-gradient-id pitfall. `filled` swaps to green.
 * Mirrors the ConeIcon brand mark.
 */
export function coneMarkerSvg(filled = false): string {
  const body = filled ? "#22b34f" : "#ff6a1f";
  const shade = filled ? "#199040" : "#df4d0e";
  const lid = filled ? "#3fce6a" : "#ff8f47";
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="40" viewBox="0 0 34 40">
  <ellipse cx="17" cy="37.5" rx="11" ry="2.2" fill="#000" opacity="0.22"/>
  <path d="M7 32 Q5 32 5 34 L5 35.5 Q5 38 7 38 L27 38 Q29 38 29 35.5 L29 34 Q29 32 27 32 Z" fill="#23232a"/>
  <path d="M10 11 C10 9 11.2 8.2 13 8.2 L21 8.2 C22.8 8.2 24 9 24 11 L24 33 L10 33 Z" fill="${body}" stroke="${shade}" stroke-width="0.5"/>
  <rect x="18" y="11" width="6" height="22" fill="${shade}" opacity="0.4"/>
  <ellipse cx="17" cy="8.7" rx="7" ry="1.8" fill="${lid}" stroke="${shade}" stroke-width="0.4"/>
  <rect x="10" y="13" width="14" height="3.4" fill="#fff"/>
  <rect x="10" y="22" width="14" height="3.4" fill="#fff"/>
</svg>`.trim();
}
