"use client";

import { Pothole } from "@/lib/types";
import { STATUS_META } from "@/lib/format";

interface Props {
  potholes: Pothole[];
  hasVoted: (id: string) => boolean;
  onVote: (id: string) => void;
  onSelect: (p: Pothole) => void;
}

export function HoleList({ potholes, hasVoted, onVote, onSelect }: Props) {
  const ranked = [...potholes].sort((a, b) => b.votes - a.votes);

  if (ranked.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted">
        Aucun trou ici. 🎉
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {ranked.map((p) => {
        const status = STATUS_META[p.status];
        const voted = hasVoted(p.id);
        const isFilled = p.status === "filled";
        return (
          <li key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-wash">
            <button
              onClick={() => onSelect(p)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <img
                src={isFilled && p.fillPhotoUrl ? p.fillPhotoUrl : p.photoUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">
                  {p.address}
                </span>
                <span
                  className="flex items-center gap-1 text-[11px] font-semibold"
                  style={{ color: status.color }}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
                  {status.label}
                </span>
              </span>
            </button>
            <button
              onClick={() => onVote(p.id)}
              disabled={isFilled}
              className={`flex shrink-0 flex-col items-center rounded-lg px-2.5 py-1 text-sm font-extrabold leading-none transition
                ${
                  isFilled
                    ? "cursor-default bg-emerald-100 text-emerald-700"
                    : voted
                      ? "bg-cone text-white"
                      : "bg-wash text-ink hover:bg-cone hover:text-white"
                }`}
            >
              <span className="text-[13px]">{isFilled ? "✓" : "▲"}</span>
              <span className="text-xs">{p.votes}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
