/**
 * Real pothole photos — Wikimedia Commons (CC / public-domain), hotlinked via
 * Special:FilePath (redirects to a sized thumbnail). Free to use with
 * attribution; for launch, add credits. Swap for Marquize's own once partnered.
 */
const FILES = [
  "Otro_bache.jpg",
  "Bache_en_la_escuela.jpg",
  "Muchos_baches_inundados.jpg",
  "Medio_rota.jpg",
  "Levantamiento_de_piso.jpg",
  "Hsha-2.jpg",
  "Lcb-1.jpg",
  "Lfds-1.jpg",
];

export const POTHOLE_PHOTOS = FILES.map(
  (f) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=600`
);

/** Pick a photo deterministically by index. */
export function potholePhoto(i: number): string {
  return POTHOLE_PHOTOS[((i % POTHOLE_PHOTOS.length) + POTHOLE_PHOTOS.length) % POTHOLE_PHOTOS.length];
}
