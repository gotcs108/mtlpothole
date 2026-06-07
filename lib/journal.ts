import { potholePlaceholder } from "./placeholder";

/**
 * "Le journal de Marquize" — a timeline of his real fixes, summarized from his
 * public posts (paraphrased + attributed, NOT copied) and linked to the source
 * post. Images are themed placeholders: to show his real photos legitimately,
 * swap `photoUrl` for an official Instagram embed of `url`, or his own assets.
 */
export interface JournalPost {
  id: string;
  area: string; // neighborhood / area (approx, from his hashtags)
  summaryFr: string; // our short paraphrase, not his verbatim caption
  url: string; // the real Instagram post
  lat: number; // approximate (his fixes aren't geotagged)
  lng: number;
}

export const MARQUIZE_JOURNAL: JournalPost[] = [
  {
    id: "j-mandre",
    area: "Hochelaga-Maisonneuve",
    summaryFr:
      "Débloque le chariot de la conjointe de M. André, coincée par un nid-de-poule. « Problème réglé. »",
    url: "https://www.instagram.com/marquize.7/reel/DXsu0MwjpXV/",
    lat: 45.5503,
    lng: -73.5495,
  },
  {
    id: "j-next",
    area: "Rosemont",
    summaryFr: "Demande à la communauté : quel prochain nid-de-poule réparer ? 🐔",
    url: "https://www.instagram.com/marquize.7/reel/DXk55t1Dhn7/",
    lat: 45.5402,
    lng: -73.587,
  },
  {
    id: "j-name",
    area: "Villeray",
    summaryFr: "Invite tout le monde à donner un nom à un nid-de-poule. 👇",
    url: "https://www.instagram.com/marquize.7/reel/DX5Vqf2pPQB/",
    lat: 45.5388,
    lng: -73.6155,
  },
  {
    id: "j-streets",
    area: "Le Plateau-Mont-Royal",
    summaryFr: "« Améliorer nos rues, un nid-de-poule à la fois. » 🤝",
    url: "https://www.instagram.com/marquize.7/reel/DZOH0S2BYUT/",
    lat: 45.5232,
    lng: -73.5829,
  },
  {
    id: "j-help",
    area: "Le Sud-Ouest",
    summaryFr: "Réparation avec un coup de main de la communauté (@imtinysmallz). 🦺",
    url: "https://www.instagram.com/marquize.7/reel/DZL7B7Gufyq/",
    lat: 45.4795,
    lng: -73.585,
  },
  {
    id: "j-irony",
    area: "Ville-Marie",
    summaryFr:
      "Après une journée à réparer des nids-de-poule… il en frappe un lui-même. 🤷‍♂️😂",
    url: "https://www.instagram.com/marquize.7/reel/DZFhNY7u7QV/",
    lat: 45.5088,
    lng: -73.5617,
  },
];

export const journalPlaceholder = (id: string) => potholePlaceholder(id + "-filled");

/** More of his real posts (permalinks, read live) — embedded as-is. */
export const MARQUIZE_MORE_POSTS: string[] = [
  "https://www.instagram.com/marquize.7/reel/DYdhxUAOhxx/",
  "https://www.instagram.com/marquize.7/reel/DYddsd0uZ17/",
  "https://www.instagram.com/marquize.7/reel/DYYVxP4uUGD/",
  "https://www.instagram.com/marquize.7/reel/DYTFdkSBdVD/",
  "https://www.instagram.com/marquize.7/p/DYONNdgDlzK/",
  "https://www.instagram.com/marquize.7/reel/DYLabd7tjDC/",
  "https://www.instagram.com/marquize.7/reel/DYD0kcaOwmu/",
  "https://www.instagram.com/marquize.7/reel/DX-a9MnvJ_q/",
  "https://www.instagram.com/marquize.7/reel/DX2nRODJA3Q/",
  "https://www.instagram.com/marquize.7/reel/DXxlNNDBfe7/",
  "https://www.instagram.com/marquize.7/reel/DWzvVkgj--x/",
  "https://www.instagram.com/marquize.7/reel/DR7HwDSDivy/",
];

