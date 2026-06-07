"use client";

import { Pothole } from "@/lib/types";
import { PotholeCard } from "./PotholeCard";

interface Props {
  pothole: Pothole | null;
  hasVoted: (id: string) => boolean;
  onVote: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onClose: () => void;
}

/**
 * Selected-hole detail. Desktop: floating glass card pinned right.
 * Mobile: full-screen glass panel. Both close with the × button.
 */
export function DetailPanel({ pothole, hasVoted, onVote, onComment, onClose }: Props) {
  if (!pothole) return null;
  return (
    <div className="fixed inset-0 z-[700] flex flex-col overflow-hidden border border-white/60 bg-gradient-to-b from-white/75 to-white/45 shadow-2xl ring-1 ring-white/40 backdrop-blur-2xl backdrop-saturate-200 sm:inset-auto sm:bottom-8 sm:right-10 sm:top-8 sm:w-[380px] sm:rounded-3xl">
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-xl leading-none text-white backdrop-blur transition hover:bg-black/65"
      >
        ×
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PotholeCard
          pothole={pothole}
          hasVoted={hasVoted(pothole.id)}
          onVote={onVote}
          onComment={onComment}
        />
      </div>
    </div>
  );
}
