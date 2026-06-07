"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { GeoJSON, MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents, ZoomControl } from "react-leaflet";
import type { Feature, GeoJsonObject } from "geojson";
import { Pothole } from "@/lib/types";
import { statusMeta } from "@/lib/format";
import { coneMarkerSvg, markerWidthForVotes } from "@/lib/coneMarker";
import { MARQUIZE_JOURNAL } from "@/lib/journal";

export interface MapFocus {
  lat: number;
  lng: number;
  id?: string;
  key: number;
}

export type MapMode = "trou" | "bouche" | "quartier";

interface Props {
  mode: MapMode;
  potholes: Pothole[];
  sectorValueFor: (nom: string) => number;
  sectorMax: number;
  sectorLabel: string;
  onSelectPothole: (p: Pothole) => void;
  onSelectJournal: (id: string) => void;
  onMapClick: (lat: number, lng: number) => void;
  onBoroughClick: (nom: string) => void;
  pendingPin: { lat: number; lng: number } | null;
  onPendingClick: () => void;
  focus: MapFocus | null;
}

const MTL_CENTER: [number, number] = [45.5019, -73.5674];

function coneIcon(p: Pothole): L.DivIcon {
  const w = markerWidthForVotes(p.votes);
  const h = Math.round((w * 40) / 34);
  return L.divIcon({
    className: "cone-marker",
    html: `<div class="cone-pin">${coneMarkerSvg(false, w)}</div><div class="cone-votes">${p.votes}</div>`,
    iconSize: [w, h + 14],
    iconAnchor: [w / 2, h],
    tooltipAnchor: [0, -h + 6],
  });
}

const pendingIcon = L.divIcon({
  className: "cone-marker",
  html: `<div class="pending-wrap"><span class="pending-ring"></span><div class="cone-pin">${coneMarkerSvg(false, 44)}</div></div>`,
  iconSize: [44, 58],
  iconAnchor: [22, 52],
  tooltipAnchor: [0, -48],
});

const journalIcon = L.divIcon({
  className: "cone-marker is-filled",
  html: `<div class="cone-pin">${coneMarkerSvg(true, 38)}</div><div class="cone-votes">✓</div>`,
  iconSize: [38, 52],
  iconAnchor: [19, 45],
  tooltipAnchor: [0, -42],
});

function FocusController({ focus }: { focus: MapFocus | null }) {
  const map = useMap();
  useEffect(() => {
    if (!focus) return;
    map.flyTo([focus.lat, focus.lng], 15, { duration: 1.0 });
  }, [focus, map]);
  return null;
}

function ClickToReport({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function rampColor(value: number, max: number): string {
  if (!value) return "#cfcabf";
  const t = Math.min(value / (max || 1), 1);
  return `rgba(255,90,31,${(0.12 + t * 0.72).toFixed(2)})`;
}

/** Boroughs colored by a passed value (Nous votes or 311). Click → vote. */
function SectorsLayer({
  valueFor,
  max,
  label,
  onBoroughClick,
}: {
  valueFor: (nom: string) => number;
  max: number;
  label: string;
  onBoroughClick: (nom: string) => void;
}) {
  const [data, setData] = useState<GeoJsonObject | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/boroughs.geojson")
      .then((r) => r.json())
      .then((d) => active && setData(d))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  if (!data) return null;
  return (
    <GeoJSON
      key={label}
      data={data}
      style={(f?: Feature) => {
        const nom = (f?.properties as { NOM?: string })?.NOM ?? "";
        const v = valueFor(nom);
        const hot = v >= 0.6 * max;
        return {
          fillColor: rampColor(v, max),
          fillOpacity: 1,
          color: hot ? "#d8480c" : "#ffffff",
          weight: hot ? 2.5 : 0.7,
          opacity: 0.9,
        };
      }}
      onEachFeature={(f, layer) => {
        const nom = (f.properties as { NOM?: string })?.NOM ?? "";
        const v = valueFor(nom);
        layer.bindTooltip(`${nom} — ${v.toLocaleString("fr-CA")} ${label}`, { sticky: true });
        layer.on("click", () => onBoroughClick(nom));
      }}
    />
  );
}

function JournalLayer({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <>
      {MARQUIZE_JOURNAL.map((j) => (
        <Marker key={j.id} position={[j.lat, j.lng]} icon={journalIcon} eventHandlers={{ click: () => onSelect(j.id) }}>
          <Tooltip direction="top" opacity={1} className="cone-tooltip" offset={[0, -4]}>
            <div className="w-44 px-2 py-1.5 font-body">
              <p className="text-[11px] font-bold text-emerald-700">✅ Bouché · {j.area}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink">{j.summaryFr}</p>
              <p className="mt-0.5 text-[9px] italic text-muted">clique → voir le post</p>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}

export default function PotholeMap({
  mode,
  potholes,
  sectorValueFor,
  sectorMax,
  sectorLabel,
  onSelectPothole,
  onSelectJournal,
  onMapClick,
  onBoroughClick,
  pendingPin,
  onPendingClick,
  focus,
}: Props) {
  const markers = useRef<Record<string, L.Marker>>({});

  return (
    <MapContainer center={MTL_CENTER} zoom={12} scrollWheelZoom zoomControl={false} className="h-full w-full">
      <ZoomControl position="topright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FocusController focus={focus} />

      {mode === "quartier" && (
        <SectorsLayer valueFor={sectorValueFor} max={sectorMax} label={sectorLabel} onBoroughClick={onBoroughClick} />
      )}

      {mode === "trou" && <ClickToReport onMapClick={onMapClick} />}
      {potholes.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={coneIcon(p)}
            eventHandlers={{ click: () => onSelectPothole(p) }}
            ref={(m) => {
              if (m) markers.current[p.id] = m;
              else delete markers.current[p.id];
            }}
          >
            <Tooltip direction="top" opacity={1} className="cone-tooltip" offset={[0, -4]}>
              <div className="w-44 font-body">
                <img src={p.photoUrl} alt="" className="h-20 w-full rounded-t-[9px] object-cover" />
                <div className="px-2 py-1.5">
                  <p className="text-[11px] font-bold leading-tight text-ink">{p.address}</p>
                  <p className="mt-0.5 text-[10px] font-semibold" style={{ color: statusMeta(p).color }}>
                    ▲ {p.votes} · 💬 {p.comments.length}
                  </p>
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}

      <JournalLayer onSelect={onSelectJournal} />

      {pendingPin && (
        <Marker
          position={[pendingPin.lat, pendingPin.lng]}
          icon={pendingIcon}
          zIndexOffset={1000}
          eventHandlers={{ click: onPendingClick }}
        >
          <Tooltip permanent direction="top" opacity={1} className="cone-tooltip" offset={[0, -4]}>
            <span className="px-2 py-1 text-[11px] font-bold text-cone">➕ Clique pour ajouter ce trou</span>
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
}
