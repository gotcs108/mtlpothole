import { Comment, NewPotholeInput, Pothole } from "../types";

/**
 * Storage-agnostic contract for pothole data. The app talks only to this
 * interface, so swapping the localStorage demo for Supabase later means
 * writing one new implementation — no component changes.
 */
export interface PotholeStore {
  list(): Promise<Pothole[]>;
  add(input: NewPotholeInput): Promise<Pothole>;
  /** Toggle a vote. Returns the updated pothole. `voted` reflects new state. */
  vote(id: string, voted: boolean): Promise<Pothole>;
  /** Community "it's fixed" vote. `voted` reflects the new state. */
  voteFilled(id: string, voted: boolean): Promise<Pothole>;
  addComment(id: string, text: string): Promise<Comment>;
}
