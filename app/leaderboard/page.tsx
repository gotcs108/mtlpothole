"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePotholeStore } from "@/lib/store/useStore";
import { Pothole } from "@/lib/types";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { RankedList } from "@/components/RankedList";
import { DonateButton } from "@/components/DonateButton";

export default function LeaderboardPage() {
  const router = useRouter();
  const { potholes, ready, hasVoted, toggleVote } = usePotholeStore();

  function focusOnMap(p: Pothole) {
    try {
      sessionStorage.setItem("fmh:focus", JSON.stringify({ lat: p.lat, lng: p.lng }));
    } catch {
      /* ignore */
    }
    router.push("/map");
  }

  return (
    <main className="flex min-h-screen flex-col">
      <SiteNav />

      <section className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h1 className="display text-4xl text-ink sm:text-5xl">
              Most requested holes
            </h1>
          </div>
          <p className="mb-5 text-sm text-muted">
            The people have spoken. These are the craters Montreal wants gone
            first — tap one to find it on the{" "}
            <Link href="/map" className="font-semibold text-cone hover:underline">
              map
            </Link>
            .
          </p>
          {ready ? (
            <RankedList
              potholes={potholes}
              hasVoted={hasVoted}
              onVote={toggleVote}
              onFocus={focusOnMap}
            />
          ) : (
            <p className="text-muted">Loading the leaderboard…</p>
          )}
        </div>

        {/* Phase 2 teaser + donate */}
        <div className="border-t border-line bg-wash">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="display text-4xl text-ink">
                Watch them get <span className="text-emerald-600">filled</span>
              </h2>
              <p className="mt-3 text-muted">
                When a hole gets filled, the cone flips to green and you&apos;ll
                be able to hover for the before/after and the legend&apos;s
                progress journal. Coming next.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>🟩 Before/after photos on every filled hole</li>
                <li>🗒️ Marquize&apos;s fill journal, right on the map</li>
                <li>🔔 Get pinged when a hole you voted for gets filled</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
              <div className="text-4xl">🧡</div>
              <h3 className="display mt-2 text-2xl text-ink">
                Keep the cones rolling
              </h3>
              <p className="mt-2 text-sm text-muted">
                Help fund the cold-patch. Every bit goes to filling more holes,
                faster.
              </p>
              <DonateButton className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
