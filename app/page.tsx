"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePotholeStore } from "@/lib/store/useStore";
import { GeoResult } from "@/lib/geocode";
import { ConeIcon } from "@/components/ConeIcon";
import { SearchBar } from "@/components/SearchBar";

function stashFocus(lat: number, lng: number) {
  try {
    sessionStorage.setItem("fmh:focus", JSON.stringify({ lat, lng }));
  } catch {
    /* ignore */
  }
}

export default function Landing() {
  const router = useRouter();
  const { potholes } = usePotholeStore();
  const total = potholes.length;

  function locate(result: GeoResult) {
    stashFocus(result.lat, result.lng);
    router.push("/map");
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* feather-light top bar */}
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2">
          <ConeIcon className="h-6 w-6" />
          <span className="display text-lg tracking-tight text-ink">
            mtl<span className="text-cone">pothole</span>
          </span>
        </span>
        <nav className="flex items-center gap-5 text-sm font-semibold text-muted">
          <Link href="/map" className="hover:text-ink">
            Map
          </Link>
          <Link href="/leaderboard" className="hover:text-ink">
            Leaderboard
          </Link>
        </nav>
      </header>

      {/* center stage */}
      <section className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">
            Montreal pothole map
          </p>
          <h1 className="display mt-5 text-6xl leading-[0.9] text-ink sm:text-7xl">
            where&apos;s the <span className="text-cone">hole?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted">
            Report a pothole. Vote up the worst ones. Watch them get filled.
          </p>

          <div className="mt-8 text-left">
            <SearchBar onLocate={locate} onReport={() => router.push("/map#report")} />
          </div>

          <Link
            href="/map"
            className="mt-5 inline-block text-sm font-semibold text-muted underline-offset-4 hover:text-cone hover:underline"
          >
            or just open the map →
          </Link>
        </div>
      </section>

      {/* minimal footer */}
      <footer className="mx-auto w-full max-w-3xl px-6 py-6 text-center text-xs text-muted sm:text-left">
        {total > 0 && <span>{total} holes on the map · </span>}
        made for Montreal · inspired by{" "}
        <a
          href="https://www.instagram.com/marquize.7/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-cone hover:underline"
        >
          @marquize.7
        </a>
      </footer>
    </main>
  );
}
