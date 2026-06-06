import Link from "next/link";
import { ConeIcon } from "@/components/ConeIcon";
import { compactNumber } from "@/lib/format";
import { MARQUIZE } from "@/lib/marquize";

export const metadata = {
  title: "mtlpothole × Marquize — le pitch",
  robots: { index: false },
};

const s = MARQUIZE.stats;

const WINS = [
  {
    icon: "🧡",
    t: "Les dons",
    d: "Un bouton « Soutiens le mouvement » sur chaque page → ton fonds. T’as déjà ramassé 36 000 $ sans outil. Imagine avec.",
  },
  {
    icon: "🛞",
    t: "Des jobs pour Marquize Paysagement",
    d: "Ta gloire est de la pub gratuite pour ta business de pavage — mais là elle se perd. On la convertit en vrais contrats payants.",
  },
  {
    icon: "🤝",
    t: "Des commandites",
    d: "« Ce trou bouché grâce à [garage / pneus / assureur] ». Les mauvaises routes, c’est LEURS clients. Ils paient, toi tu filmes.",
  },
  {
    icon: "🏆",
    t: "Un tableau de gloire permanent",
    d: "Compteur de trous, avant/après, médias, dons, villes. Ça garde ta légende vivante — pis ça t’aide à gagner les contrats de la Ville.",
  },
];

export default function PitchPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* minimal top */}
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2">
          <ConeIcon className="h-6 w-6" />
          <span className="display text-lg text-ink">
            mtl<span className="text-cone">pothole</span>
          </span>
        </span>
        <Link href="/" className="text-sm font-semibold text-cone hover:underline">
          Voir la démo →
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">
          Pour {MARQUIZE.name} · {MARQUIZE.realName}
        </p>
        <h1 className="display mt-4 text-5xl leading-[0.95] text-ink sm:text-6xl">
          On t’a bâti le <span className="text-cone">QG de ton mouvement.</span>
        </h1>
        <p className="mt-5 text-lg text-muted">
          Tu continues juste de filmer. L’app transforme ton monde en{" "}
          <span className="font-bold text-ink">
            dons, contrats de pavage, commandites et gloire
          </span>{" "}
          — sans travail de plus. Pis on te donne les clés.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-cone px-6 py-3 text-base font-extrabold uppercase tracking-wide text-white hover:bg-cone-dark"
          >
            🚧 Voir la démo
          </Link>
          <a
            href={MARQUIZE.links.instagram}
            className="rounded-xl border border-line px-6 py-3 text-base font-bold text-ink hover:bg-wash"
          >
            On se parle
          </a>
        </div>

        {/* what he already built */}
        <div className="mt-14 rounded-2xl border border-line bg-wash p-6">
          <h2 className="display text-2xl text-ink">Ce que t’as déjà bâti 🔥</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Fact v={`${compactNumber(s.followers)}`} l="abonnés" />
            <Fact v={`${compactNumber(s.views)}+`} l="vues" />
            <Fact v={`$${compactNumber(s.raisedCad)}`} l="amassés" />
            <Fact v={`${compactNumber(s.donors)}+`} l="donateurs" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {MARQUIZE.press.map((p) => (
              <span
                key={p}
                className="rounded-full border border-line bg-white px-2.5 py-0.5 text-xs font-semibold text-ink"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            Une Rolex, Canadian Tire, la mairesse qui te répond, une invitation à
            soumissionner sur 1 M$… T’as la flamme. Il manque juste la machine.
          </p>
        </div>

        {/* the 4 wins */}
        <h2 className="display mt-14 text-3xl text-ink">Ça te rapporte 4 façons</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {WINS.map((w) => (
            <div key={w.t} className="rounded-2xl border border-line bg-white p-5">
              <div className="text-2xl">{w.icon}</div>
              <h3 className="display mt-2 text-xl text-ink">{w.t}</h3>
              <p className="mt-1 text-sm text-muted">{w.d}</p>
            </div>
          ))}
        </div>

        {/* the offer */}
        <div className="mt-14 rounded-2xl border-2 border-cone bg-cone/5 p-6">
          <h2 className="display text-3xl text-ink">L’offre</h2>
          <ul className="mt-4 space-y-2 text-[15px] text-ink">
            <li>✅ On bâtit et on opère l’app. Toi, tu fais ce que tu fais déjà.</li>
            <li>✅ Ton nom, ta face, ton fonds, ta business — partout dessus.</li>
            <li>✅ On gère les commandites pis la tech. Tu gardes le contrôle.</li>
            <li>✅ Partenariat / part des revenus — on en jase, c’est ton mouvement.</li>
          </ul>
          <p className="mt-5 text-sm text-muted">
            Le timing est maintenant : t’es viral, la Ville t’écoute, pis personne
            d’autre a bâti ça. Soyons les premiers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl bg-cone px-6 py-3 text-base font-extrabold uppercase tracking-wide text-white hover:bg-cone-dark"
            >
              Voir la démo en live
            </Link>
            <a
              href={MARQUIZE.links.instagram}
              className="rounded-xl border border-line px-6 py-3 text-base font-bold text-ink hover:bg-wash"
            >
              DM moi
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted">
          Démo · données d’exemple · photos à remplacer par les tiennes
        </p>
      </section>
    </main>
  );
}

function Fact({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <div className="display text-2xl text-cone">{v}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">
        {l}
      </div>
    </div>
  );
}
