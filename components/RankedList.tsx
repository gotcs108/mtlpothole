"use client";

import { useMemo } from "react";
import { Pothole } from "@/lib/types";
import { STATUS_META } from "@/lib/format";

interface Props {
  potholes: Pothole[];
  hasVoted: (id: string) => boolean;
  onVote: (id: string) => void;
  onFocus: (p: Pothole) => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function RankedList({ potholes, hasVoted, onVote, onFocus }: Props) {
  const ranked = useMemo(
    () => [...potholes].sort((a, b) => b.votes - a.votes).slice(0, 10),
    [potholes]
  );

  return (
    <ol className="space-y-2">
      {ranked.map((p, i) => {
        const status = STATUS_META[p.status];
        const voted = hasVoted(p.id);
        const isFilled = p.status === "filled";
        return (
          <li
            key={p.id}
            className="group flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 transition hover:border-cone/50 hover:shadow-sm"
          >
            <button
              onClick={() => onFocus(p)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="w-7 shrink-0 text-center font-display text-xl text-muted/50">
                {MEDALS[i] ?? i + 1}
              </span>
              <img
                src={isFilled && p.fillPhotoUrl ? p.fillPhotoUrl : p.photoUrl}
                alt=""
                className="h-11 w-11 shrink-0 rounded-lg object-cover"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink group-hover:text-cone">
                  {p.address}
                </span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: status.color }}
                >
                  {status.label}
                </span>
              </span>
            </button>

            <button
              onClick={() => onVote(p.id)}
              disabled={isFilled}
              className={`flex shrink-0 flex-col items-center rounded-lg px-3 py-1.5 text-sm font-extrabold leading-none transition
                ${
                  isFilled
                    ? "cursor-default bg-emerald-100 text-emerald-700"
                    : voted
                      ? "bg-cone text-white"
                      : "bg-wash text-ink hover:bg-cone hover:text-white"
                }`}
            >
              <span className="text-base">{isFilled ? "✓" : "▲"}</span>
              <span>{p.votes}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
