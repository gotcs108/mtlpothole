"use client";

import { useState } from "react";
import { Pothole } from "@/lib/types";
import { timeAgo } from "@/lib/format";

interface Props {
  pothole: Pothole;
  hasVoted: boolean;
  onVote: (id: string) => void;
  onComment: (id: string, text: string) => void;
}

export function PotholeCard({ pothole, hasVoted, onVote, onComment }: Props) {
  const [draft, setDraft] = useState("");

  function submit() {
    const text = draft.trim();
    if (!text) return;
    onComment(pothole.id, text);
    setDraft("");
  }

  return (
    <div className="font-body text-ink">
      <img src={pothole.photoUrl} alt={pothole.address} className="h-40 w-full object-cover" />

      <div className="p-3.5">
        <p className="text-[15px] font-bold leading-snug text-ink">{pothole.address}</p>
        {pothole.description && (
          <p className="mt-1 text-[13px] leading-snug text-muted">{pothole.description}</p>
        )}

        {/* upvote */}
        <button
          onClick={() => onVote(pothole.id)}
          className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-extrabold uppercase tracking-wide transition ${
            hasVoted ? "bg-cone text-white" : "bg-wash text-ink hover:bg-cone hover:text-white"
          }`}
        >
          ▲ {pothole.votes}
          <span className="font-semibold normal-case opacity-80">{hasVoted ? "voté" : "vote"}</span>
        </button>

        <div className="mt-3 space-y-2 border-t border-line pt-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
            💬 {pothole.comments.length}{" "}
            {pothole.comments.length === 1 ? "commentaire" : "commentaires"}
          </p>
          <div className="max-h-32 space-y-1.5 overflow-y-auto pr-1">
              {pothole.comments.length === 0 && (
                <p className="text-[12px] italic text-muted/70">Aucun commentaire — sois le premier.</p>
              )}
              {pothole.comments.map((c) => (
                <div key={c.id} className="rounded-md bg-wash px-2 py-1 text-[12px] leading-snug text-ink">
                  {c.text}
                  <span className="ml-1 text-muted">· {timeAgo(c.createdAt)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Ajoute un commentaire…"
                className="min-w-0 flex-1 rounded-md border border-line bg-white px-2.5 py-1.5 text-[12px] text-ink outline-none placeholder:text-muted/60 focus:border-cone"
              />
              <button onClick={submit} className="rounded-md bg-cone px-3 py-1.5 text-[12px] font-bold text-white hover:bg-cone-dark">
                Go
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
