import { Comment, NewPotholeInput, Pothole } from "../types";
import { SEED_POTHOLES } from "../seed";
import { potholePlaceholder } from "../placeholder";
import { PotholeStore } from "./PotholeStore";

const KEY = "fmh:potholes:v1";

function uid(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}

function read(): Pothole[] {
  if (typeof window === "undefined") return SEED_POTHOLES;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(SEED_POTHOLES));
      return SEED_POTHOLES;
    }
    return JSON.parse(raw) as Pothole[];
  } catch {
    return SEED_POTHOLES;
  }
}

function write(potholes: Pothole[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(potholes));
  } catch {
    // Quota exceeded (too many big photos) — fail soft, keep in-memory state.
  }
}

/**
 * Browser-only implementation backed by localStorage, seeded on first run.
 * Swap this class for a SupabaseStore implementing the same interface later.
 */
export class LocalPotholeStore implements PotholeStore {
  async list(): Promise<Pothole[]> {
    return read();
  }

  async add(input: NewPotholeInput): Promise<Pothole> {
    const potholes = read();
    const id = uid("ph");
    const pothole: Pothole = {
      id,
      lat: input.lat,
      lng: input.lng,
      address: input.address.trim() || "Unknown location, Montreal",
      description: input.description.trim(),
      photoUrl: input.photoUrl || potholePlaceholder(id),
      votes: 1, // reporter implicitly votes for their own hole
      status: "reported",
      createdAt: new Date().toISOString(),
      comments: [],
    };
    write([pothole, ...potholes]);
    return pothole;
  }

  async vote(id: string, voted: boolean): Promise<Pothole> {
    const potholes = read();
    let updated: Pothole | undefined;
    const next = potholes.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, votes: Math.max(0, p.votes + (voted ? 1 : -1)) };
      return updated;
    });
    if (!updated) throw new Error(`Pothole ${id} not found`);
    write(next);
    return updated;
  }

  async toggleFilled(id: string): Promise<Pothole> {
    const potholes = read();
    let updated: Pothole | undefined;
    const next = potholes.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, status: p.status === "filled" ? "reported" : "filled" };
      return updated;
    });
    if (!updated) throw new Error(`Pothole ${id} not found`);
    write(next);
    return updated;
  }

  async addComment(id: string, text: string): Promise<Comment> {
    const potholes = read();
    const comment: Comment = {
      id: uid("c"),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = potholes.map((p) =>
      p.id === id ? { ...p, comments: [...p.comments, comment] } : p
    );
    write(next);
    return comment;
  }
}
