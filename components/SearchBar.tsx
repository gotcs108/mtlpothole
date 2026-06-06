"use client";

import { useState } from "react";
import { geocodeAddress, GeoResult } from "@/lib/geocode";

interface Props {
  onLocate: (result: GeoResult) => void;
}

export function SearchBar({ onLocate }: Props) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [miss, setMiss] = useState(false);

  async function go() {
    if (!q.trim()) return;
    setBusy(true);
    setMiss(false);
    const hit = await geocodeAddress(q);
    setBusy(false);
    if (hit) onLocate(hit);
    else setMiss(true);
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/50 px-3 py-2">
        <span className="text-base text-muted">🔎</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="Cherche une adresse…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
        />
      </div>
      {busy && <p className="mt-1.5 pl-1 text-xs text-muted">Recherche…</p>}
      {miss && (
        <p className="mt-1.5 pl-1 text-xs text-stop">Adresse introuvable.</p>
      )}
    </div>
  );
}
