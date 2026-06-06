"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePotholeStore } from "@/lib/store/useStore";
import { GeoResult } from "@/lib/geocode";
import { Pothole } from "@/lib/types";
import { compactNumber } from "@/lib/format";
import type { MapFocus } from "@/components/PotholeMap";
import { ConeIcon } from "@/components/ConeIcon";
import { SearchBar } from "@/components/SearchBar";
import { HoleList } from "@/components/HoleList";
import { ReportModal } from "@/components/ReportModal";
import { SupportButton } from "@/components/SupportButton";
import { FloatingPanel } from "@/components/FloatingPanel";

const PotholeMap = dynamic(() => import("@/components/PotholeMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-wash text-muted">
      <span className="animate-pulse">Chargement de la carte…</span>
    </div>
  ),
});

type Filter = "all" | "todo" | "done";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "todo", label: "À réparer" },
  { key: "done", label: "Bouchés" },
];

export default function App() {
  const {
    potholes,
    ready,
    hasVoted,
    addPothole,
    toggleVote,
    toggleFilled,
    addComment,
  } = usePotholeStore();
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "todo") return potholes.filter((p) => p.status !== "filled");
    if (filter === "done") return potholes.filter((p) => p.status === "filled");
    return potholes;
  }, [potholes, filter]);

  const filledCount = useMemo(
    () => potholes.filter((p) => p.status === "filled").length,
    [potholes]
  );

  function select(p: Pothole) {
    setFocus({ lat: p.lat, lng: p.lng, id: p.id, key: Date.now() });
  }
  function locate(r: GeoResult) {
    setFocus({ lat: r.lat, lng: r.lng, key: Date.now() });
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* full-bleed map */}
      <div className="absolute inset-0">
        {ready ? (
          <PotholeMap
            potholes={filtered}
            hasVoted={hasVoted}
            onVote={toggleVote}
            onToggleFilled={toggleFilled}
            onComment={addComment}
            focus={focus}
          />
        ) : (
          <div className="grid h-full place-items-center bg-wash text-muted">
            Chargement de la carte…
          </div>
        )}
      </div>

      {/* floating glass panel — desktop card / mobile draggable sheet */}
      <FloatingPanel
        peek={
          <>
            {/* brand */}
            <div className="flex items-center justify-between gap-2 border-b border-white/40 px-3.5 py-3">
              <span className="flex items-center gap-2">
                <ConeIcon className="h-7 w-7" />
                <span className="leading-tight">
                  <span className="display block text-lg text-ink">
                    On répare MTL
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                    le mouvement de Marquize
                  </span>
                </span>
              </span>
              <SupportButton compact />
            </div>
            {/* search + (mobile) signal */}
            <div className="space-y-2.5 px-3.5 py-3">
              <SearchBar onLocate={locate} />
              <button
                onClick={() => setModalOpen(true)}
                className="w-full rounded-xl bg-cone px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-cone-dark sm:hidden"
              >
                🚧 Signaler un trou
              </button>
            </div>
          </>
        }
      >
        {/* filters */}
        <div className="flex shrink-0 items-center gap-1.5 px-3.5 pb-2.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                filter === f.key
                  ? "bg-ink text-white"
                  : "bg-white/50 text-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs font-semibold text-muted">
            {compactNumber(potholes.length)} · {compactNumber(filledCount)} bouchés
          </span>
        </div>

        {/* list */}
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-white/40">
          {ready ? (
            <HoleList
              potholes={filtered}
              hasVoted={hasVoted}
              onVote={toggleVote}
              onSelect={select}
            />
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted">Chargement…</p>
          )}
        </div>
      </FloatingPanel>

      {/* floating signal button — desktop only (mobile has it in the sheet) */}
      <button
        onClick={() => setModalOpen(true)}
        className="absolute bottom-8 left-8 z-[600] hidden items-center gap-2 rounded-full bg-cone px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-xl transition hover:bg-cone-dark sm:flex"
      >
        🚧 Signaler un trou
      </button>

      <ReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addPothole}
      />
    </main>
  );
}
