/**
 * Pothole demand by borough — REAL official data.
 * Source: Données ouvertes Montréal, "Requêtes 311" dataset, filtered to
 * activity = "Nid-de-poule" (62,512 citizen complaints), grouped by borough.
 * https://donnees.montreal.ca/dataset/requete-311  (CKAN API, daily-updated)
 * Snapshot baked for the demo; can be made live via the datastore API.
 */
export interface Sector {
  name: string;
  complaints: number;
}

export const SECTOR_SOURCE =
  "Données ouvertes Montréal · requêtes 311 · « Nid-de-poule »";

export const POTHOLE_COMPLAINTS_TOTAL = 62512;

/** Normalize borough names for joining (strip accents/punctuation/case). */
export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "");
}

/** Complaints for a borough name (from the GeoJSON `NOM`), 0 if unknown. */
export function complaintsFor(nom: string): number {
  return BY_NORM.get(normalizeName(nom)) ?? 0;
}

/** Fill color for a borough by complaint volume (cone-orange ramp). */
export function sectorColor(count: number): string {
  if (!count) return "#cfcabf"; // off-island / not in 311
  const t = Math.min(count / MAX_COMPLAINTS, 1);
  return `rgba(255,90,31,${(0.12 + t * 0.72).toFixed(2)})`;
}

export const SECTORS: Sector[] = [
  { name: "Ville-Marie", complaints: 7607 },
  { name: "Mercier–Hochelaga-Maisonneuve", complaints: 6496 },
  { name: "Ahuntsic-Cartierville", complaints: 5458 },
  { name: "Rosemont–La Petite-Patrie", complaints: 4998 },
  { name: "Villeray–Saint-Michel–Parc-Extension", complaints: 4644 },
  { name: "Côte-des-Neiges–Notre-Dame-de-Grâce", complaints: 3642 },
  { name: "Le Sud-Ouest", complaints: 3465 },
  { name: "Le Plateau-Mont-Royal", complaints: 3344 },
  { name: "Rivière-des-Prairies–Pointe-aux-Trembles", complaints: 3019 },
  { name: "Saint-Laurent", complaints: 2128 },
  { name: "Lachine", complaints: 1777 },
  { name: "Montréal-Nord", complaints: 1570 },
  { name: "Saint-Léonard", complaints: 1278 },
  { name: "LaSalle", complaints: 1232 },
  { name: "Verdun", complaints: 1026 },
  { name: "Anjou", complaints: 924 },
  { name: "Pierrefonds-Roxboro", complaints: 699 },
  { name: "Outremont", complaints: 627 },
  { name: "L'Île-Bizard–Sainte-Geneviève", complaints: 614 },
];

export const MAX_COMPLAINTS = SECTORS[0].complaints;

/** Top 3 boroughs (the "most important pieces" to highlight). */
export const TOP_SECTORS = new Set(SECTORS.slice(0, 3).map((s) => normalizeName(s.name)));

const BY_NORM = new Map(SECTORS.map((s) => [normalizeName(s.name), s.complaints]));

/* ---- Unified neighborhood view: every source → counts by borough ---- */
export type SectorSource = "311" | "nous";

export const SOURCE_LABEL: Record<SectorSource, string> = {
  "311": "311",
  nous: "Nous",
};

// nous bucketed by borough (point-in-polygon vs the borough GeoJSON).
const RAW_NOUS: Record<string, number> = {
  "Le Plateau-Mont-Royal": 2,
  "Côte-des-Neiges-Notre-Dame-de-Grâce": 1,
  Verdun: 1,
  "Mercier-Hochelaga-Maisonneuve": 1,
  "Rosemont-La Petite-Patrie": 1,
  Outremont: 1,
  "Le Sud-Ouest": 1,
  "Villeray-Saint-Michel-Parc-Extension": 1,
};

function normMap(raw: Record<string, number>): Map<string, number> {
  return new Map(Object.entries(raw).map(([k, v]) => [normalizeName(k), v]));
}
const RAW_311 = Object.fromEntries(SECTORS.map((s) => [s.name, s.complaints]));

const SOURCE_COUNTS: Record<SectorSource, Map<string, number>> = {
  "311": normMap(RAW_311),
  nous: normMap(RAW_NOUS),
};
const SOURCE_MAX: Record<SectorSource, number> = {
  "311": Math.max(...Object.values(RAW_311)),
  nous: Math.max(...Object.values(RAW_NOUS)),
};

/** Count for a borough (GeoJSON NOM) under a given source. */
export function countFor(nom: string, source: SectorSource): number {
  return SOURCE_COUNTS[source].get(normalizeName(nom)) ?? 0;
}
/** Fill color for a borough by count, scaled to that source's max. */
export function sectorColorFor(count: number, source: SectorSource): string {
  if (!count) return "#cfcabf";
  const t = Math.min(count / SOURCE_MAX[source], 1);
  return `rgba(255,90,31,${(0.12 + t * 0.72).toFixed(2)})`;
}
/** Is this borough a top-tier (highlight) one for the source? */
export function isHotFor(nom: string, source: SectorSource): boolean {
  return countFor(nom, source) >= 0.6 * SOURCE_MAX[source];
}
