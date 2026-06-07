"use client";

import { MARQUIZE_JOURNAL } from "@/lib/journal";

/** Compact top-3 wins strip — links out to his posts (no heavy embeds). */
export function JournalList() {
  return (
    <ul>
      {MARQUIZE_JOURNAL.map((j) => (
        <li key={j.id}>
          <a
            href={j.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 transition hover:bg-white/60"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500 text-sm text-white">
              ✓
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-semibold leading-snug text-ink">
                {j.summaryFr}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                {j.area}
              </span>
            </span>
            <span className="shrink-0 text-xs font-bold text-cone">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
