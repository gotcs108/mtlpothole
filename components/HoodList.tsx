"use client";

import { HoodApi } from "@/lib/store/useHoods";

/** Neighborhood-vote leaderboard (the "demand" vote). */
export function HoodList({ hoods }: { hoods: HoodApi }) {
  const max = hoods.ranked[0]?.votes || 1;
  return (
    <ul className="divide-y divide-white/40">
      {hoods.ranked.map((h, i) => {
        const voted = hoods.hasVoted(h.name);
        return (
          <li key={h.name} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-5 shrink-0 text-center text-sm font-bold text-muted/60">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">{h.name}</span>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-black/5">
                <span
                  className="block h-full rounded-full bg-cone"
                  style={{ width: `${Math.round((h.votes / max) * 100)}%` }}
                />
              </span>
            </span>
            <button
              onClick={() => hoods.vote(h.name)}
              className={`flex shrink-0 flex-col items-center rounded-lg px-2.5 py-1 text-sm font-extrabold leading-none transition ${
                voted ? "bg-cone text-white" : "bg-white/60 text-ink hover:bg-cone hover:text-white"
              }`}
            >
              <span className="text-[13px]">▲</span>
              <span className="text-xs">{h.votes}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
