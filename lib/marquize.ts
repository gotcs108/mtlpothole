/**
 * Public facts about Marquize for the movement hub. Sourced from spring-2026
 * press coverage (La Presse, CBC, CTV, CityNews, MTL Blog, Monde de Stars).
 * Numbers move fast — treat as "last known public" and update before launch.
 * His real photos are NOT bundled (copyright/auth); /marquize.svg is a
 * placeholder — drop his real shots into /public and point the refs at them.
 */
export const MARQUIZE = {
  name: "Marquize",
  realName: "Saâd Tekiout",
  sloganFr: "On répare Montréal, un nid-de-poule à la fois",
  movementFr: "Rejoins le mouvement",

  links: {
    instagram: "https://www.instagram.com/marquize.7/",
    tiktok: "https://www.tiktok.com/@marquize.7",
    company: "https://marquizepaysagement.com/",
    // TODO: swap for the exact GoFundMe URL; bio link lives on his IG for now.
    donate: "https://www.instagram.com/marquize.7/",
  },

  company: {
    name: "Marquize Paysagement",
    blurbFr: "Pavage, asphalte, excavation — Rive-Sud (Brossard, Longueuil…)",
    phone: "514-701-2739",
  },

  // Last-known public figures (spring 2026). Editable placeholders.
  stats: {
    holesFilled: 100, // his public claim ~"the whole city"; shown as 100+
    raisedCad: 36300,
    donors: 850,
    followers: 46000, // Instagram
    views: 1_000_000, // original video, IG+TikTok
  },

  citiesNextFr: ["Longueuil", "Trois-Rivières"],

  // Trophy-case milestones (most recent first-ish).
  milestonesFr: [
    { tag: "🏛️ Ville", text: "Invité à soumissionner sur le budget de 1 M$ de la Ville" },
    { tag: "💸 GoFundMe", text: "36 000 $+ amassés, 850+ donateurs (5 000 $ de J.W. Awad)" },
    { tag: "⌚ Cadeau", text: "Rolex offerte par le joaillier Medusa" },
    { tag: "🛞 Sponsor", text: "Canadian Tire offre 3 000 $ d’équipement" },
    { tag: "🗣️ Mairesse", text: "La mairesse répond en commentaire — citoyen vs ville" },
    { tag: "🔥 Viral", text: "1 M+ de vues sur la première vidéo" },
  ],

  press: ["La Presse", "CBC", "CTV", "CityNews", "MTL Blog", "Narcity", "CJAD 800"],
} as const;
