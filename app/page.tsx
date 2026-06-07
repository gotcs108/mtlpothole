"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePotholeStore } from "@/lib/store/useStore";
import { useHoods } from "@/lib/store/useHoods";
import { GeoResult } from "@/lib/geocode";
import { Pothole } from "@/lib/types";
import { countFor, MAX_COMPLAINTS } from "@/lib/sectors";
import { MARQUIZE } from "@/lib/marquize";
import { MARQUIZE_JOURNAL } from "@/lib/journal";
import { FEATURES } from "@/lib/flags";
import type { MapFocus } from "@/components/PotholeMap";
import { ConeIcon } from "@/components/ConeIcon";
import { SearchBar } from "@/components/SearchBar";
import { HoleList } from "@/components/HoleList";
import { HoodList } from "@/components/HoodList";
import { JournalList } from "@/components/JournalList";
import { ReportModal } from "@/components/ReportModal";
import { FloatingPanel } from "@/components/FloatingPanel";
import { DetailPanel } from "@/components/DetailPanel";

const PotholeMap = dynamic(() => import("@/components/PotholeMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-wash text-muted">
      <span className="animate-pulse">Chargement de la carte…</span>
    </div>
  ),
});

type ReportView = "trou" | "bouche" | "quartier";

export default function App() {
  const { potholes, ready, hasVoted, addPothole, toggleVote, addComment } = usePotholeStore();
  const hoods = useHoods();

  const [view, setView] = useState<ReportView>("trou");
  const [show311, setShow311] = useState(false);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reportLoc, setReportLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);

  const selected = useMemo(
    () => potholes.find((p) => p.id === selectedId) ?? null,
    [potholes, selectedId]
  );
  const hoodMax = hoods.ranked[0]?.votes || 1;

  function selectPothole(p: Pothole) {
    setSelectedId(p.id);
    setFocus({ lat: p.lat, lng: p.lng, id: p.id, key: Date.now() });
  }
  // Search → zoom in + drop a pending pin you click to add.
  function locate(r: GeoResult) {
    setFocus({ lat: r.lat, lng: r.lng, key: Date.now() });
    setPendingPin({ lat: r.lat, lng: r.lng });
  }
  function openReportAt(loc: { lat: number; lng: number }) {
    setReportLoc(loc);
    setModalOpen(true);
  }
  function changeView(v: ReportView) {
    setView(v);
    setPendingPin(null);
  }
  function onSelectJournal(id: string) {
    const j = MARQUIZE_JOURNAL.find((x) => x.id === id);
    if (j) window.open(j.url, "_blank", "noopener");
  }

  const seg = (active: boolean) =>
    `flex-1 rounded-lg py-1.5 text-center transition ${active ? "bg-cone text-white" : "text-muted hover:text-ink"}`;
  const pill = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-bold transition ${active ? "bg-ink text-white" : "bg-white/50 text-muted hover:text-ink"}`;

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0">
        {ready ? (
          <PotholeMap
            mode={view}
            potholes={potholes}
            sectorValueFor={show311 ? (nom) => countFor(nom, "311") : hoods.votesFor}
            sectorMax={show311 ? MAX_COMPLAINTS : hoodMax}
            sectorLabel={show311 ? "plaintes 311" : "votes quartier"}
            onSelectPothole={selectPothole}
            onSelectJournal={onSelectJournal}
            onMapClick={(lat, lng) => openReportAt({ lat, lng })}
            onBoroughClick={show311 ? () => {} : (nom) => hoods.vote(nom)}
            pendingPin={view === "trou" ? pendingPin : null}
            onPendingClick={() => {
              if (pendingPin) openReportAt(pendingPin);
            }}
            focus={focus}
          />
        ) : (
          <div className="grid h-full place-items-center bg-wash text-muted">Chargement…</div>
        )}
      </div>

      <FloatingPanel
        peek={
          <>
            {/* brand + tip/follow */}
            <div className="border-b border-white/40 px-3.5 py-3">
              <span className="flex items-center gap-2">
                <ConeIcon className="h-7 w-7" />
                <span className="leading-tight">
                  <span className="block text-[15px] font-bold tracking-tight text-ink">On répare MTL</span>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">
                    inspiré par @marquize.7
                  </span>
                </span>
              </span>
              <div className="mt-2.5 flex gap-1.5">
                <a
                  href={MARQUIZE.links.donate}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Financer les réparations"
                  className="rounded-full border border-cone/45 bg-transparent px-3 py-1 text-xs font-bold text-cone transition hover:bg-cone/10"
                >
                  🧡 Financer
                </a>
                <a
                  href={MARQUIZE.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line bg-transparent px-3 py-1 text-xs font-bold text-muted transition hover:bg-white/60 hover:text-ink"
                >
                  ↗ Suivre
                </a>
              </div>
            </div>

            <div className="space-y-2.5 px-3.5 py-3">
              {/* category */}
              <div className="flex rounded-xl border border-white/60 bg-white/40 p-0.5 text-[13px] font-bold">
                <button onClick={() => changeView("trou")} className={seg(view === "trou")}>
                  🚧 Trou
                </button>
                <button onClick={() => changeView("bouche")} className={seg(view === "bouche")}>
                  ✅ Bouché
                </button>
                {FEATURES.neighborhood && (
                  <button onClick={() => changeView("quartier")} className={seg(view === "quartier")}>
                    🏘️ Quartier
                  </button>
                )}
              </div>

              {/* quartier view source (311 = view only) */}
              {view === "quartier" && (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setShow311((v) => !v)} className={pill(show311)}>
                    📊 311
                  </button>
                  <span className="text-[10px] text-muted">
                    {show311 ? "vue officielle 311" : "vue Nous · vote ton quartier"}
                  </span>
                </div>
              )}

              {/* trou input */}
              {view === "trou" && (
                <>
                  <SearchBar value={searchText} onChange={setSearchText} onLocate={locate} />
                  <p className="px-1 text-[11px] text-muted">
                    Cherche &amp; pèse Enter → un pin apparaît, clique-le pour ajouter. Ou clique
                    direct sur la carte.
                  </p>
                </>
              )}
            </div>
          </>
        }
      >
        {/* selected category list — fills the body */}
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-white/40">
          {!ready ? (
            <p className="px-4 py-8 text-center text-sm text-muted">Chargement…</p>
          ) : view === "trou" ? (
            <HoleList potholes={potholes} hasVoted={hasVoted} onVote={toggleVote} onSelect={selectPothole} />
          ) : view === "bouche" ? (
            <JournalList />
          ) : (
            <HoodList hoods={hoods} />
          )}
        </div>

        <div className="shrink-0 border-t border-white/40 px-4 py-2 text-center text-[10px] font-medium text-muted">
          {view === "quartier"
            ? "Vote pour ton quartier · clique un secteur"
            : view === "bouche"
              ? "Les réparations de Marquize · clique → le post"
              : "Fait avec 🧡 à Montréal · inspiré par @marquize.7"}
        </div>
      </FloatingPanel>

      {/* top-center hovering hint */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-[600] -translate-x-1/2 sm:left-[calc(50%+185px)]">
        <div className="whitespace-nowrap rounded-full border border-white/60 bg-white/80 px-4 py-1.5 text-xs font-bold text-ink shadow-lg ring-1 ring-black/5 backdrop-blur-xl">
          {view === "trou"
            ? "🚧 Clique la carte pour ajouter un trou"
            : view === "quartier"
              ? "🏘️ Clique un quartier pour voter"
              : "✅ Clique un pin pour voir la réparation"}
        </div>
      </div>

      <DetailPanel
        pothole={selected}
        hasVoted={hasVoted}
        onVote={toggleVote}
        onComment={addComment}
        onClose={() => setSelectedId(null)}
      />

      <ReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addPothole}
        initialLocation={reportLoc}
      />
    </main>
  );
}
