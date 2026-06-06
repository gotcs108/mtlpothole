"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { Pothole } from "@/lib/types";
import { STATUS_META } from "@/lib/format";
import { coneMarkerSvg } from "@/lib/coneMarker";
import { PotholeCard } from "./PotholeCard";

export interface MapFocus {
  lat: number;
  lng: number;
  id?: string;
  key: number; // bump to re-trigger a fly-to
}

interface Props {
  potholes: Pothole[];
  hasVoted: (id: string) => boolean;
  onVote: (id: string) => void;
  onComment: (id: string, text: string) => void;
  focus: MapFocus | null;
}

const MTL_CENTER: [number, number] = [45.5019, -73.5674];

function coneIcon(p: Pothole): L.DivIcon {
  const filled = p.status === "filled";
  return L.divIcon({
    className: `cone-marker${filled ? " is-filled" : ""}`,
    html: `<div class="cone-pin">${coneMarkerSvg(filled)}</div><div class="cone-votes">${p.votes}</div>`,
    iconSize: [40, 50],
    iconAnchor: [20, 44],
    popupAnchor: [0, -42],
    tooltipAnchor: [0, -40],
  });
}

/** Flies to a focus target and opens its popup when `focus.key` changes. */
function FocusController({
  focus,
  markers,
}: {
  focus: MapFocus | null;
  markers: React.RefObject<Record<string, L.Marker>>;
}) {
  const map = useMap();
  useEffect(() => {
    if (!focus) return;
    map.flyTo([focus.lat, focus.lng], 16, { duration: 1.1 });
    if (focus.id) {
      const m = markers.current[focus.id];
      if (m) {
        const t = setTimeout(() => m.openPopup(), 700);
        return () => clearTimeout(t);
      }
    }
  }, [focus, map, markers]);
  return null;
}

export default function PotholeMap({
  potholes,
  hasVoted,
  onVote,
  onComment,
  focus,
}: Props) {
  const markers = useRef<Record<string, L.Marker>>({});

  return (
    <MapContainer
      center={MTL_CENTER}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FocusController focus={focus} markers={markers} />

      {potholes.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={coneIcon(p)}
          ref={(m) => {
            if (m) markers.current[p.id] = m;
            else delete markers.current[p.id];
          }}
        >
          <Tooltip
            direction="top"
            opacity={1}
            className="cone-tooltip"
            offset={[0, -4]}
          >
            <div className="w-44 font-body">
              <img
                src={p.photoUrl}
                alt=""
                className="h-20 w-full rounded-t-[9px] object-cover"
              />
              <div className="px-2 py-1.5">
                <p className="text-[11px] font-bold leading-tight text-ink">
                  {p.address}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold" style={{ color: STATUS_META[p.status].color }}>
                  ▲ {p.votes} votes · {STATUS_META[p.status].label}
                </p>
                <p className="mt-0.5 text-[9px] italic text-muted">
                  click for details & to vote
                </p>
              </div>
            </div>
          </Tooltip>
          <Popup>
            <PotholeCard
              pothole={p}
              hasVoted={hasVoted(p.id)}
              onVote={onVote}
              onComment={onComment}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
