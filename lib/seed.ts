import { Pothole } from "./types";
import { potholePlaceholder } from "./placeholder";

/**
 * Seed potholes scattered across Montreal neighborhoods. Used on first load
 * (and as the demo dataset). Dates are fixed (no Date.now) for stable hydration.
 */
const RAW: Omit<Pothole, "photoUrl">[] = [
  {
    id: "ph-stdenis-montroyal",
    lat: 45.5247,
    lng: -73.5793,
    address: "Rue Saint-Denis & Av. du Mont-Royal, Le Plateau",
    description:
      "Crater the size of a kiddie pool. Took out my front-left rim last week.",
    votes: 247,
    status: "reported",
    createdAt: "2026-04-12T14:20:00.000Z",
    comments: [
      { id: "c1", text: "Hit this on my bike, nearly went over the bars.", createdAt: "2026-04-14T09:00:00.000Z" },
      { id: "c2", text: "It's GROWING. Was half this size in March.", createdAt: "2026-05-02T18:30:00.000Z" },
    ],
  },
  {
    id: "ph-stviateur-mileend",
    lat: 45.523,
    lng: -73.601,
    address: "Rue Saint-Viateur O, Mile End",
    description: "Right outside the bagel line-up. Everyone steps in it.",
    votes: 189,
    status: "reported",
    createdAt: "2026-04-20T11:00:00.000Z",
    comments: [
      { id: "c3", text: "Spilled a full coffee dodging it 😤", createdAt: "2026-05-10T08:15:00.000Z" },
    ],
  },
  {
    id: "ph-sherbrooke-ndg",
    lat: 45.472,
    lng: -73.619,
    address: "Rue Sherbrooke O près de Décarie, NDG",
    description: "Two potholes back-to-back. A combo meal of suspension damage.",
    votes: 156,
    status: "in_progress",
    createdAt: "2026-03-28T16:45:00.000Z",
    comments: [],
  },
  {
    id: "ph-wellington-verdun",
    lat: 45.4585,
    lng: -73.571,
    address: "Rue Wellington, Verdun",
    description: "Sneaky one that hides under a puddle when it rains.",
    votes: 132,
    status: "reported",
    createdAt: "2026-05-01T13:10:00.000Z",
    comments: [
      { id: "c4", text: "Confirmed the puddle camouflage. Diabolical.", createdAt: "2026-05-15T20:00:00.000Z" },
    ],
  },
  {
    id: "ph-ontario-hochelaga",
    lat: 45.545,
    lng: -73.545,
    address: "Rue Ontario E, Hochelaga-Maisonneuve",
    description: "Bus dips into it every 10 minutes. You can hear the clunk.",
    votes: 98,
    status: "reported",
    createdAt: "2026-05-08T07:30:00.000Z",
    comments: [],
  },
  {
    id: "ph-beaubien-rosemont",
    lat: 45.54,
    lng: -73.587,
    address: "Rue Beaubien E, Rosemont",
    description: "Edge is sharp enough to slice a tire. Cyclists beware.",
    votes: 76,
    status: "reported",
    createdAt: "2026-05-18T15:00:00.000Z",
    comments: [],
  },
  {
    id: "ph-bernard-outremont",
    lat: 45.519,
    lng: -73.608,
    address: "Av. Bernard, Outremont",
    description: "Small but right in the worst spot at the intersection.",
    votes: 54,
    status: "reported",
    createdAt: "2026-05-22T12:00:00.000Z",
    comments: [],
  },
  {
    id: "ph-notredame-sthenri",
    lat: 45.479,
    lng: -73.587,
    address: "Rue Notre-Dame O, Saint-Henri",
    description: "FILLED by the legend himself. Smooth as butter now. 🙌",
    votes: 203,
    status: "filled",
    createdAt: "2026-02-15T10:00:00.000Z",
    comments: [
      { id: "c5", text: "Drove over it today — perfect. Thank you!!", createdAt: "2026-03-20T17:00:00.000Z" },
    ],
    journal: [
      { id: "j1", note: "Scoped the hole. Bad one — 8cm deep.", createdAt: "2026-03-10T09:00:00.000Z" },
      { id: "j2", note: "Cold patch laid + compacted. Done in 25 min.", createdAt: "2026-03-12T14:00:00.000Z" },
    ],
  },
  {
    id: "ph-jarry-villeray",
    lat: 45.539,
    lng: -73.619,
    address: "Rue Jarry E, Villeray",
    description: "Whole stretch is rough but this one is the boss level.",
    votes: 41,
    status: "reported",
    createdAt: "2026-05-30T19:20:00.000Z",
    comments: [],
  },
];

export const SEED_POTHOLES: Pothole[] = RAW.map((p) => ({
  ...p,
  photoUrl: potholePlaceholder(p.id),
  fillPhotoUrl:
    p.status === "filled" ? potholePlaceholder(p.id + "-filled") : undefined,
}));
