"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePotholeStore } from "@/lib/store/useStore";
import type { MapFocus } from "@/components/PotholeMap";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ReportModal } from "@/components/ReportModal";

const PotholeMap = dynamic(() => import("@/components/PotholeMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-wash text-muted">
      <span className="animate-pulse">Loading the map…</span>
    </div>
  ),
});

export default function MapPage() {
  const { potholes, ready, hasVoted, addPothole, toggleVote, addComment } =
    usePotholeStore();
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Honor a handoff from the landing search + a #report deep link.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("fmh:focus");
      if (raw) {
        const { lat, lng } = JSON.parse(raw);
        setFocus({ lat, lng, key: Date.now() });
        sessionStorage.removeItem("fmh:focus");
      }
    } catch {
      /* ignore */
    }
    if (window.location.hash === "#report") setModalOpen(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <SiteNav onReport={() => setModalOpen(true)} />

      <section className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="display text-4xl text-ink sm:text-5xl">
                The hole map
              </h1>
              <p className="text-sm text-muted">
                Hover a cone for the lowdown · click to vote &amp; comment
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-muted">
              <span className="hidden items-center gap-1.5 sm:flex">
                🟧 active hole
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                🟩 filled
              </span>
              <Link
                href="/leaderboard"
                className="rounded-lg border border-line px-3 py-1.5 font-bold text-ink hover:border-cone/50 hover:text-cone"
              >
                🏆 Leaderboard
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-lg bg-cone px-3 py-1.5 font-bold uppercase text-white hover:bg-cone-dark"
              >
                + Add a hole
              </button>
            </div>
          </div>

          <div className="h-[68vh] min-h-[460px] overflow-hidden rounded-2xl border border-line shadow-sm">
            {ready ? (
              <PotholeMap
                potholes={potholes}
                hasVoted={hasVoted}
                onVote={toggleVote}
                onComment={addComment}
                focus={focus}
              />
            ) : (
              <div className="grid h-full place-items-center text-muted">
                Loading holes…
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />

      <ReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addPothole}
      />
    </main>
  );
}
