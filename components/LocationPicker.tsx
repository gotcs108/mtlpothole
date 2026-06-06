"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { coneMarkerSvg } from "@/lib/coneMarker";

interface Props {
  value: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
}

const MTL_CENTER: [number, number] = [45.5019, -73.5674];

const pinIcon = L.divIcon({
  className: "cone-marker",
  html: `<div class="cone-pin">${coneMarkerSvg()}</div>`,
  iconSize: [34, 40],
  iconAnchor: [17, 37],
});

function ClickToPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Pans the map to follow an externally-set value (e.g. from address search). */
function PanTo({ value }: { value: { lat: number; lng: number } | null }) {
  const map = useMap();
  const last = useRef<string>("");
  useEffect(() => {
    if (!value) return;
    const key = `${value.lat},${value.lng}`;
    if (key === last.current) return;
    last.current = key;
    map.setView([value.lat, value.lng], Math.max(map.getZoom(), 15));
  }, [value, map]);
  return null;
}

export default function LocationPicker({ value, onPick }: Props) {
  return (
    <MapContainer
      center={value ? [value.lat, value.lng] : MTL_CENTER}
      zoom={value ? 15 : 12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <ClickToPick onPick={onPick} />
      <PanTo value={value} />
      {value && (
        <Marker
          position={[value.lat, value.lng]}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend(e) {
              const p = e.target.getLatLng();
              onPick(p.lat, p.lng);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
