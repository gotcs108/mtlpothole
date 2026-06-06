"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NewPotholeInput, Pothole } from "../types";
import { LocalPotholeStore } from "./localStore";
import { PotholeStore } from "./PotholeStore";

const VOTED_KEY = "fmh:voted:v1";

function readVoted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(VOTED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeVoted(ids: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VOTED_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export interface StoreApi {
  potholes: Pothole[];
  ready: boolean;
  hasVoted: (id: string) => boolean;
  addPothole: (input: NewPotholeInput) => Promise<Pothole>;
  toggleVote: (id: string) => Promise<void>;
  addComment: (id: string, text: string) => Promise<void>;
}

export function usePotholeStore(): StoreApi {
  const store: PotholeStore = useMemo(() => new LocalPotholeStore(), []);
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    store.list().then((list) => {
      if (!active) return;
      setPotholes(list);
      setVoted(readVoted());
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [store]);

  const hasVoted = useCallback((id: string) => voted.has(id), [voted]);

  const addPothole = useCallback(
    async (input: NewPotholeInput) => {
      const created = await store.add(input);
      setPotholes((prev) => [created, ...prev]);
      // The reporter auto-votes their own hole.
      setVoted((prev) => {
        const next = new Set(prev).add(created.id);
        writeVoted(next);
        return next;
      });
      return created;
    },
    [store]
  );

  const toggleVote = useCallback(
    async (id: string) => {
      const willVote = !voted.has(id);
      // Optimistic UI update.
      setPotholes((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, votes: Math.max(0, p.votes + (willVote ? 1 : -1)) }
            : p
        )
      );
      setVoted((prev) => {
        const next = new Set(prev);
        if (willVote) next.add(id);
        else next.delete(id);
        writeVoted(next);
        return next;
      });
      try {
        await store.vote(id, willVote);
      } catch {
        // Roll back on failure.
        setPotholes((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, votes: Math.max(0, p.votes + (willVote ? -1 : 1)) }
              : p
          )
        );
      }
    },
    [store, voted]
  );

  const addComment = useCallback(
    async (id: string, text: string) => {
      const comment = await store.addComment(id, text);
      setPotholes((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, comments: [...p.comments, comment] } : p
        )
      );
    },
    [store]
  );

  return { potholes, ready, hasVoted, addPothole, toggleVote, addComment };
}
