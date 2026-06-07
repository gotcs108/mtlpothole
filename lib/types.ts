export type PotholeStatus = "reported" | "in_progress";

export interface Comment {
  id: string;
  text: string;
  createdAt: string; // ISO
}

export interface JournalEntry {
  id: string;
  note: string;
  photoUrl?: string;
  createdAt: string; // ISO
}

export interface Pothole {
  id: string;
  lat: number;
  lng: number;
  address: string;
  description: string;
  /** Data-URL (uploaded/downscaled) or themed SVG placeholder. */
  photoUrl: string;
  votes: number;
  status: PotholeStatus;
  /** Community "it's fixed" votes — a hole reads as done past a threshold. */
  filledVotes: number;
  createdAt: string; // ISO
  comments: Comment[];

  // ---- Phase 2 (scaffolded, not fully wired in v1) ----
  /** "After" photo of the filled hole (with the hero). */
  fillPhotoUrl?: string;
  /** Marquize's progress journal shown on hover once filled. */
  journal?: JournalEntry[];
}

/** Payload for creating a new report (everything else is derived). */
export interface NewPotholeInput {
  lat: number;
  lng: number;
  address: string;
  description: string;
  photoUrl?: string;
}
