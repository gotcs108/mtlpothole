"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ConeIcon } from "./ConeIcon";
import { DonateButton } from "./DonateButton";

interface Props {
  /** If provided (on the map page), the Report button opens the modal directly
   *  instead of navigating. */
  onReport?: () => void;
}

export function SiteNav({ onReport }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  function report() {
    if (onReport) onReport();
    else router.push("/map#report");
  }

  const link = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`hidden rounded-lg px-3 py-1.5 text-sm font-semibold transition sm:block ${
          active ? "text-cone" : "text-muted hover:text-ink"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-[900] border-b border-line bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <ConeIcon className="h-7 w-7" />
          <span className="display text-xl tracking-tight text-ink">
            mtl<span className="text-cone">pothole</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {link("/map", "Map")}
          {link("/leaderboard", "Leaderboard")}
          <DonateButton compact className="hidden sm:inline-flex" />
          <button
            onClick={report}
            className="rounded-lg bg-cone px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-cone-dark"
          >
            Report
          </button>
        </nav>
      </div>
    </header>
  );
}
