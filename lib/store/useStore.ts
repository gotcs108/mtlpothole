"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NewPotholeInput, Pothole } from "../types";
import { LocalPotholeStore } from "./localStore";
import { PotholeStore } from "./PotholeStore";

const VOTED_KEY = "fmh:voted:v1";
const FILLED_KEY = "fmh:filledvoted:v1";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, ids: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export interface StoreApi {
  potholes: Pothole[];
  ready: boolean;
  hasVoted: (id: string) => boolean;
  hasMarkedFilled: (id: string) => boolean;
  addPothole: (input: NewPotholeInput) => Promise<Pothole>;
  toggleVote: (id: string) => Promise<void>;
  voteFilled: (id: string) => Promise<void>;
  addComment: (id: string, text: string) => Promise<void>;
}

export function usePotholeStore(): StoreApi {
  const store: PotholeStore = useMemo(() => new LocalPotholeStore(), []);
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [filledVoted, setFilledVoted] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    store.list().then((list) => {
      if (!active) return;
      setPotholes(list);
      setVoted(readSet(VOTED_KEY));
      setFilledVoted(readSet(FILLED_KEY));
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [store]);

  const hasVoted = useCallback((id: string) => voted.has(id), [voted]);
  const hasMarkedFilled = useCallback(
    (id: string) => filledVoted.has(id),
    [filledVoted]
  );

  const addPothole = useCallback(
    async (input: NewPotholeInput) => {
      const created = await store.add(input);
      setPotholes((prev) => [created, ...prev]);
      // The reporter auto-votes their own hole.
      setVoted((prev) => {
        const next = new Set(prev).add(created.id);
        writeSet(VOTED_KEY, next);
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
        writeSet(VOTED_KEY, next);
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

  const voteFilled = useCallback(
    async (id: string) => {
      const willVote = !filledVoted.has(id);
      setPotholes((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                filledVotes: Math.max(0, p.filledVotes + (willVote ? 1 : -1)),
              }
            : p
        )
      );
      setFilledVoted((prev) => {
        const next = new Set(prev);
        if (willVote) next.add(id);
        else next.delete(id);
        writeSet(FILLED_KEY, next);
        return next;
      });
      try {
        await store.voteFilled(id, willVote);
      } catch {
        setPotholes((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  filledVotes: Math.max(0, p.filledVotes + (willVote ? -1 : 1)),
                }
              : p
          )
        );
      }
    },
    [store, filledVoted]
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

  return {
    potholes,
    ready,
    hasVoted,
    hasMarkedFilled,
    addPothole,
    toggleVote,
    voteFilled,
    addComment,
  };
}
