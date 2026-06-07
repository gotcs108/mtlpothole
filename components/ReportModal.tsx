"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { NewPotholeInput } from "@/lib/types";
import { geocodeAddress, reverseGeocode } from "@/lib/geocode";
import { fileToDownscaledDataUrl } from "@/lib/image";

// Leaflet needs the browser — load the picker client-side only.
const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-wash text-sm text-muted">
      Chargement de la carte…
    </div>
  ),
});

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewPotholeInput) => Promise<unknown>;
  /** Pre-pinned location, e.g. from clicking the map. */
  initialLocation?: { lat: number; lng: number } | null;
  /** Carried over from the search bar — prefilled + geocoded on open. */
  initialSearch?: string;
}

export function ReportModal({ open, onClose, onSubmit, initialLocation, initialSearch }: Props) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prefill the pin when opened from a map click.
  useEffect(() => {
    if (!open || !initialLocation) return;
    setCoords(initialLocation);
    setAddress("");
    reverseGeocode(initialLocation.lat, initialLocation.lng).then((l) => {
      if (l) setAddress(l);
    });
  }, [open, initialLocation]);

  // Carry over the search-bar text: prefill + geocode it to a pin.
  useEffect(() => {
    if (!open || initialLocation || !initialSearch?.trim()) return;
    setSearch(initialSearch);
    geocodeAddress(initialSearch).then((hit) => {
      if (hit) {
        setCoords({ lat: hit.lat, lng: hit.lng });
        setAddress(hit.label);
      }
    });
  }, [open, initialSearch, initialLocation]);

  if (!open) return null;

  function reset() {
    setCoords(null);
    setAddress("");
    setSearch("");
    setDescription("");
    setPhotoUrl(undefined);
    setError("");
  }

  async function handleSearch() {
    if (!search.trim()) return;
    setSearching(true);
    setError("");
    const hit = await geocodeAddress(search);
    setSearching(false);
    if (!hit) {
      setError("Adresse introuvable. Place un pin sur la carte à la place.");
      return;
    }
    setCoords({ lat: hit.lat, lng: hit.lng });
    setAddress(hit.label);
  }

  async function handlePick(lat: number, lng: number) {
    setCoords({ lat, lng });
    const label = await reverseGeocode(lat, lng);
    if (label) setAddress(label);
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhotoUrl(await fileToDownscaledDataUrl(file));
    } catch {
      setError("Impossible de lire cette image.");
    }
  }

  async function handleSubmit() {
    if (!coords) {
      setError("Place le trou sur la carte (ou cherche une adresse) en premier.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        lat: coords.lat,
        lng: coords.lng,
        address,
        description,
        photoUrl,
      });
      reset();
      onClose();
    } catch {
      setError("Erreur en enregistrant le signalement.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="animate-pop-in my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="display text-2xl text-ink">Signaler un trou</h2>
          <button
            onClick={onClose}
            className="rounded-full px-2 text-2xl leading-none text-muted hover:text-ink"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {/* Address search */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
              Chercher une adresse
            </label>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Rue Saint-Denis & Mont-Royal"
                className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-cone"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="rounded-lg bg-cone px-4 py-2 text-sm font-bold text-white hover:bg-cone-dark disabled:opacity-60"
              >
                {searching ? "…" : "Chercher"}
              </button>
            </div>
          </div>

          {/* Pin map */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
              …ou place un pin sur la carte
            </label>
            <div className="h-52 overflow-hidden rounded-xl border border-line">
              <LocationPicker value={coords} onPick={handlePick} />
            </div>
            {address && (
              <p className="mt-1.5 truncate text-xs text-muted">📍 {address}</p>
            )}
          </div>

          {/* Photo + description */}
          <div className="grid grid-cols-[88px_1fr] gap-3">
            <label className="flex h-[88px] cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-line bg-wash text-center text-[10px] text-muted hover:border-cone">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <>
                  <span className="text-xl">📷</span>
                  <span>Photo</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décris le trou. C'est-tu pire ? Qu'est-ce qu'il a fait à ton char ?"
              rows={3}
              className="resize-none rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-cone"
            />
          </div>

          {error && <p className="text-xs font-semibold text-stop">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-xl bg-cone py-3 text-base font-extrabold uppercase tracking-wide text-white transition hover:bg-cone-dark disabled:opacity-60"
          >
            {submitting ? "On place le cône…" : "🚧 Envoyer le trou"}
          </button>
        </div>
      </div>
    </div>
  );
}
