import { Pothole } from "./types";
import { potholePhoto } from "./photos";
import { FILLED_THRESHOLD } from "./format";

/**
 * Seed potholes across Montreal. Used on first load. Dates are fixed (no
 * Date.now) for stable hydration. `filledVotes >= FILLED_THRESHOLD` reads as
 * Bouché (community-decided "done").
 */
const RAW: Omit<Pothole, "photoUrl">[] = [
  {
    id: "ph-stdenis-montroyal",
    lat: 45.5247,
    lng: -73.5793,
    address: "Rue Saint-Denis & Av. du Mont-Royal, Le Plateau",
    description: "Un cratère gros comme une piscine. M'a arraché un rim la semaine passée.",
    votes: 247,
    status: "reported",
    filledVotes: 0,
    createdAt: "2026-04-12T14:20:00.000Z",
    comments: [
      { id: "c1", text: "Frappé ça en vélo, j'ai failli passer par-dessus le guidon.", createdAt: "2026-04-14T09:00:00.000Z" },
      { id: "c2", text: "Ça GROSSIT. C'était la moitié en mars.", createdAt: "2026-05-02T18:30:00.000Z" },
    ],
  },
  {
    id: "ph-stviateur-mileend",
    lat: 45.523,
    lng: -73.601,
    address: "Rue Saint-Viateur O, Mile End",
    description: "Juste devant la file de bagels. Tout le monde met le pied dedans.",
    votes: 189,
    status: "reported",
    filledVotes: 1,
    createdAt: "2026-04-20T11:00:00.000Z",
    comments: [
      { id: "c3", text: "J'ai renversé un café complet en l'évitant 😤", createdAt: "2026-05-10T08:15:00.000Z" },
    ],
  },
  {
    id: "ph-sherbrooke-ndg",
    lat: 45.472,
    lng: -73.619,
    address: "Rue Sherbrooke O près de Décarie, NDG",
    description: "Deux trous collés. Le combo parfait pour démolir ta suspension.",
    votes: 156,
    status: "in_progress",
    filledVotes: 0,
    createdAt: "2026-03-28T16:45:00.000Z",
    comments: [],
  },
  {
    id: "ph-wellington-verdun",
    lat: 45.4585,
    lng: -73.571,
    address: "Rue Wellington, Verdun",
    description: "Le sournois qui se cache sous une flaque quand il pleut.",
    votes: 132,
    status: "reported",
    filledVotes: 3,
    createdAt: "2026-05-01T13:10:00.000Z",
    comments: [
      { id: "c4", text: "Confirmé le camouflage en flaque. Diabolique.", createdAt: "2026-05-15T20:00:00.000Z" },
    ],
  },
  {
    id: "ph-ontario-hochelaga",
    lat: 45.545,
    lng: -73.545,
    address: "Rue Ontario E, Hochelaga-Maisonneuve",
    description: "Le bus plonge dedans aux 10 minutes. On entend le clunk.",
    votes: 98,
    status: "reported",
    filledVotes: 0,
    createdAt: "2026-05-08T07:30:00.000Z",
    comments: [],
  },
  {
    id: "ph-beaubien-rosemont",
    lat: 45.54,
    lng: -73.587,
    address: "Rue Beaubien E, Rosemont",
    description: "Le bord est assez coupant pour trancher un pneu. Cyclistes, attention.",
    votes: 76,
    status: "reported",
    filledVotes: 0,
    createdAt: "2026-05-18T15:00:00.000Z",
    comments: [],
  },
  {
    id: "ph-bernard-outremont",
    lat: 45.519,
    lng: -73.608,
    address: "Av. Bernard, Outremont",
    description: "Petit mais juste dans la pire place à l'intersection.",
    votes: 54,
    status: "reported",
    filledVotes: 0,
    createdAt: "2026-05-22T12:00:00.000Z",
    comments: [],
  },
  {
    id: "ph-notredame-sthenri",
    lat: 45.479,
    lng: -73.587,
    address: "Rue Notre-Dame O, Saint-Henri",
    description: "BOUCHÉ par la légende lui-même. Lisse comme du beurre. 🙌",
    votes: 203,
    status: "reported",
    filledVotes: 14,
    createdAt: "2026-02-15T10:00:00.000Z",
    comments: [
      { id: "c5", text: "Passé dessus aujourd'hui — parfait. Merci!!", createdAt: "2026-03-20T17:00:00.000Z" },
    ],
    journal: [
      { id: "j1", note: "Inspecté le trou. Méchant — 8cm de creux.", createdAt: "2026-03-10T09:00:00.000Z" },
      { id: "j2", note: "Cold patch posé + compacté. Fini en 25 min.", createdAt: "2026-03-12T14:00:00.000Z" },
    ],
  },
  {
    id: "ph-jarry-villeray",
    lat: 45.539,
    lng: -73.619,
    address: "Rue Jarry E, Villeray",
    description: "Toute la rue est rough mais celui-là c'est le boss final.",
    votes: 41,
    status: "reported",
    filledVotes: 0,
    createdAt: "2026-05-30T19:20:00.000Z",
    comments: [],
  },
];

export const SEED_POTHOLES: Pothole[] = RAW.map((p, i) => ({
  ...p,
  photoUrl: potholePhoto(i),
  fillPhotoUrl: p.filledVotes >= FILLED_THRESHOLD ? potholePhoto(i) : undefined,
}));
