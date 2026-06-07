"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SECTORS, normalizeName } from "../sectors";

const KEY = "fmh:hoodvotes:v1";

// Demo base "rally" votes per borough, derived from real 311 demand so the
// neighborhood leaderboard is alive on first load. User votes add on top.
const BASE = new Map(
  SECTORS.map((s) => [normalizeName(s.name), Math.round(s.complaints / 20)])
);

function readVoted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export interface HoodApi {
  ranked: { name: string; votes: number }[];
  votesFor: (name: string) => number;
  hasVoted: (name: string) => boolean;
  vote: (name: string) => void;
}

export function useHoods(): HoodApi {
  const [voted, setVoted] = useState<Set<string>>(new Set());
  useEffect(() => setVoted(readVoted()), []);

  const votesFor = useCallback(
    (name: string) => {
      const n = normalizeName(name);
      return (BASE.get(n) ?? 0) + (voted.has(n) ? 1 : 0);
    },
    [voted]
  );

  const hasVoted = useCallback(
    (name: string) => voted.has(normalizeName(name)),
    [voted]
  );

  const vote = useCallback((name: string) => {
    const n = normalizeName(name);
    setVoted((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      try {
        window.localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const ranked = useMemo(
    () =>
      SECTORS.map((s) => ({ name: s.name, votes: votesFor(s.name) })).sort(
        (a, b) => b.votes - a.votes
      ),
    [votesFor]
  );

  return { ranked, votesFor, hasVoted, vote };
}
