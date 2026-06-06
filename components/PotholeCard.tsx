"use client";

import { useState } from "react";
import { Pothole } from "@/lib/types";
import { STATUS_META, timeAgo } from "@/lib/format";

interface Props {
  pothole: Pothole;
  hasVoted: boolean;
  onVote: (id: string) => void;
  onComment: (id: string, text: string) => void;
}

export function PotholeCard({ pothole, hasVoted, onVote, onComment }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");
  const status = STATUS_META[pothole.status];
  const isFilled = pothole.status === "filled";

  function submitComment() {
    const text = draft.trim();
    if (!text) return;
    onComment(pothole.id, text);
    setDraft("");
  }

  return (
    <div className="font-body text-ink">
      <div className="relative">
        <img
          src={isFilled && pothole.fillPhotoUrl ? pothole.fillPhotoUrl : pothole.photoUrl}
          alt={pothole.address}
          className="h-32 w-full rounded-t-[13px] object-cover"
        />
        <span
          className={`absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${status.chip}`}
        >
          {status.label}
        </span>
      </div>

      <div className="p-3">
        <p className="text-[13px] font-bold leading-snug text-ink">
          {pothole.address}
        </p>
        {pothole.description && (
          <p className="mt-1 text-[12px] leading-snug text-muted">
            {pothole.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onVote(pothole.id)}
            disabled={isFilled}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-extrabold uppercase tracking-wide transition
              ${
                isFilled
                  ? "cursor-default bg-emerald-100 text-emerald-700"
                  : hasVoted
                    ? "bg-cone text-white"
                    : "bg-wash text-ink hover:bg-cone hover:text-white"
              }`}
          >
            <span className="text-base leading-none">
              {isFilled ? "✓" : "▲"}
            </span>
            <span>{pothole.votes}</span>
            <span className="font-semibold normal-case opacity-80">
              {isFilled ? "filled" : hasVoted ? "voted" : "fill this"}
            </span>
          </button>
        </div>

        <button
          onClick={() => setShowComments((s) => !s)}
          className="mt-2 text-[11px] font-semibold text-muted hover:text-cone"
        >
          💬 {pothole.comments.length}{" "}
          {pothole.comments.length === 1 ? "comment" : "comments"} ·{" "}
          {timeAgo(pothole.createdAt)}
        </button>

        {showComments && (
          <div className="mt-2 space-y-2 border-t border-line pt-2">
            <div className="max-h-28 space-y-1.5 overflow-y-auto pr-1">
              {pothole.comments.length === 0 && (
                <p className="text-[11px] italic text-muted/70">
                  No comments yet — be the first.
                </p>
              )}
              {pothole.comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-md bg-wash px-2 py-1 text-[11px] leading-snug text-ink"
                >
                  {c.text}
                  <span className="ml-1 text-muted">· {timeAgo(c.createdAt)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
                placeholder="Add a comment…"
                className="min-w-0 flex-1 rounded-md border border-line bg-white px-2 py-1 text-[11px] text-ink outline-none placeholder:text-muted/60 focus:border-cone"
              />
              <button
                onClick={submitComment}
                className="rounded-md bg-cone px-2 py-1 text-[11px] font-bold text-white hover:bg-cone-dark"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
