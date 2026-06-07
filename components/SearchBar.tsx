"use client";

import { useEffect, useRef, useState } from "react";
import { geocodeAddress, geocodeSuggest, GeoResult } from "@/lib/geocode";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onLocate: (result: GeoResult) => void;
}

export function SearchBar({ value, onChange, onLocate }: Props) {
  const [results, setResults] = useState<GeoResult[]>([]);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (value.trim().length < 3) {
      setResults([]);
      setBusy(false);
      return;
    }
    setBusy(true);
    timer.current = setTimeout(async () => {
      const hits = await geocodeSuggest(value, 5);
      setResults(hits);
      setBusy(false);
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]);

  function pick(r: GeoResult) {
    onLocate(r);
    onChange("");
    setResults([]);
  }

  async function onEnter() {
    if (results[0]) return pick(results[0]);
    const v = value.trim();
    if (v.length < 3) return;
    const hit = await geocodeAddress(v);
    if (hit) pick(hit);
  }

  const short = (label: string) => label.split(",").slice(0, 3).join(",");

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/40 px-3 py-2">
        <span className="text-base text-muted">{busy ? "⏳" : "🔎"}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          placeholder="Cherche une adresse…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
        />
      </div>

      {results.length > 0 && (
        <ul className="mt-1.5 max-h-44 overflow-y-auto rounded-xl border border-white/60 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
          {results.map((r, i) => (
            <li key={`${r.lat},${r.lng},${i}`}>
              <button
                onClick={() => pick(r)}
                className="flex w-full items-start gap-2 px-3 py-2 text-left text-[13px] leading-snug text-ink transition hover:bg-cone/10"
              >
                <span className="mt-0.5 shrink-0 text-muted">📍</span>
                <span className="min-w-0">{short(r.label)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
