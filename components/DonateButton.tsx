"use client";

import { useState } from "react";

/**
 * Phase-2 stub: collecting tips to help fund asphalt/cold-patch. Wired to a
 * "coming soon" toast for now — swap in Stripe / a real link later.
 */
export function DonateButton({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 font-extrabold uppercase tracking-wide transition ${
          compact
            ? "rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-ink hover:bg-wash"
            : "rounded-xl bg-cone px-5 py-3 text-white hover:bg-cone-dark"
        } ${className}`}
      >
        {compact ? "💰 Donate" : "💰 Fuel the fill"}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[1100] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-pop-in max-w-sm rounded-2xl border border-line bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl">🧡</div>
            <h3 className="display mt-2 text-2xl text-cone">Coming soon</h3>
            <p className="mt-2 text-sm text-muted">
              Donations to help buy cold-patch and keep the cones rolling are on
              the way. For now, smash that report button and vote up the worst
              holes — that&apos;s what moves the needle.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-5 w-full rounded-xl bg-cone py-2.5 font-bold text-white hover:bg-cone-dark"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
