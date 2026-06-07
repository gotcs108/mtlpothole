"use client";

import { Pothole } from "@/lib/types";

interface Props {
  potholes: Pothole[];
  hasVoted: (id: string) => boolean;
  onVote: (id: string) => void;
  onSelect: (p: Pothole) => void;
}

export function HoleList({ potholes, hasVoted, onVote, onSelect }: Props) {
  const ranked = [...potholes].sort((a, b) => b.votes - a.votes);

  if (ranked.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-muted">Aucun trou. 🎉</p>;
  }

  return (
    <ul className="divide-y divide-white/40">
      {ranked.map((p) => {
        const voted = hasVoted(p.id);
        return (
          <li key={p.id} className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/50">
            <button onClick={() => onSelect(p)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <img src={p.photoUrl} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
              <span className="block min-w-0 truncate text-sm font-semibold leading-snug text-ink">
                {p.address}
              </span>
            </button>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => onVote(p.id)}
                className={`flex flex-col items-center rounded-lg px-2.5 py-1 text-sm font-extrabold leading-none transition ${
                  voted ? "bg-cone text-white" : "bg-white/60 text-ink hover:bg-cone hover:text-white"
                }`}
              >
                <span className="text-[13px]">▲</span>
                <span className="text-xs">{p.votes}</span>
              </button>
              <button
                onClick={() => onSelect(p)}
                className="flex flex-col items-center rounded-lg bg-white/60 px-2.5 py-1 text-ink transition hover:bg-wash"
              >
                <span className="text-[13px] leading-none">💬</span>
                <span className="text-xs font-bold leading-none">{p.comments.length}</span>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
