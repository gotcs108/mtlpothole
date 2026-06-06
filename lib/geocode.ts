/**
 * Free OpenStreetMap (Nominatim) geocoding — no API key. Biased to the
 * Montreal area via a viewbox. Rate-limited (~1 req/s); fine for a demo.
 * Failures degrade gracefully so the manual pin-drop flow still works.
 */

export interface GeoResult {
  lat: number;
  lng: number;
  label: string;
}

// Rough bounding box around the island of Montreal.
const MTL_VIEWBOX = "-73.98,45.70,-73.47,45.40";

export async function geocodeAddress(query: string): Promise<GeoResult | null> {
  const q = query.trim();
  if (!q) return null;
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1` +
    `&viewbox=${MTL_VIEWBOX}&bounded=1&q=${encodeURIComponent(
      q + ", Montreal, QC"
    )}`;
  try {
    const res = await fetch(url, {
      headers: { "Accept-Language": "en,fr" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;
    if (!data.length) return null;
    const hit = data[0];
    return {
      lat: parseFloat(hit.lat),
      lng: parseFloat(hit.lon),
      label: hit.display_name,
    };
  } catch {
    return null;
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
    `&lat=${lat}&lon=${lng}&zoom=18`;
  try {
    const res = await fetch(url, { headers: { "Accept-Language": "en,fr" } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: Record<string, string>;
      display_name?: string;
    };
    const a = data.address ?? {};
    const road = a.road ?? a.pedestrian ?? a.footway ?? "";
    const hood = a.neighbourhood ?? a.suburb ?? a.quarter ?? a.city_district ?? "";
    const composed = [road, hood].filter(Boolean).join(", ");
    return composed || data.display_name || null;
  } catch {
    return null;
  }
}
