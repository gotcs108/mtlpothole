/**
 * Feature flags. Flip these to turn capabilities on/off.
 * `filledVote` = the community "C'est bouché?" button — hidden for now;
 * the product leads with "where to patch next" + boasting his wins.
 */
export const FEATURES = {
  filledVote: false,
  /** Quartier / neighborhood-battle mode — hidden for now (flip to re-enable). */
  neighborhood: false,
} as const;
