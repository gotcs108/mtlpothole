"use client";

import { useState } from "react";
import { geocodeAddress, GeoResult } from "@/lib/geocode";

interface Props {
  onLocate: (result: GeoResult) => void;
  onReport: () => void;
}

export function SearchBar({ onLocate, onReport }: Props) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [miss, setMiss] = useState(false);

  async function go() {
    if (!q.trim()) {
      onReport();
      return;
    }
    setBusy(true);
    setMiss(false);
    const hit = await geocodeAddress(q);
    setBusy(false);
    if (hit) onLocate(hit);
    else setMiss(true);
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-2 shadow-sm sm:flex-row">
        <div className="flex flex-1 items-center gap-2 px-2">
          <span className="text-lg text-muted">🔎</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Search an address or intersection…"
            className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-muted/60"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={go}
            disabled={busy}
            className="flex-1 whitespace-nowrap rounded-xl bg-wash px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-line disabled:opacity-60 sm:flex-none"
          >
            {busy ? "Searching…" : "Find on map"}
          </button>
          <button
            onClick={onReport}
            className="flex-1 whitespace-nowrap rounded-xl bg-cone px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-cone-dark sm:flex-none"
          >
            🚧 Report a hole
          </button>
        </div>
      </div>
      {miss && (
        <p className="mt-2 pl-2 text-xs text-stop">
          Couldn&apos;t find that — hit &quot;Report a hole&quot; and drop a pin
          yourself.
        </p>
      )}
    </div>
  );
}
