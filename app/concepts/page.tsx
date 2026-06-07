import Link from "next/link";
import { ConeIcon } from "@/components/ConeIcon";
import { compactNumber } from "@/lib/format";
import { SECTORS, POTHOLE_COMPLAINTS_TOTAL } from "@/lib/sectors";
import { SEED_POTHOLES } from "@/lib/seed";
import { MARQUIZE } from "@/lib/marquize";

export const metadata = {
  title: "Concepts — Que devrait faire le produit?",
  robots: { index: false },
};

const topVoted = [...SEED_POTHOLES].sort((a, b) => b.votes - a.votes).slice(0, 3);
const topSectors = SECTORS.slice(0, 5);
const maxSector = topSectors[0].complaints;

function Card({
  n,
  title,
  question,
  why,
  children,
}: {
  n: string;
  title: string;
  question: string;
  why: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{n}</span>
        <h3 className="text-lg font-bold text-ink">{title}</h3>
      </div>
      <p className="mt-1 text-sm font-semibold text-cone">{question}</p>
      <div className="my-4 flex-1 rounded-2xl bg-wash p-3">{children}</div>
      <p className="text-[13px] text-muted">
        <span className="font-bold text-ink">Pourquoi ça gagne : </span>
        {why}
      </p>
    </div>
  );
}

export default function Concepts() {
  return (
    <main className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2">
          <ConeIcon className="h-7 w-7" />
          <span className="text-lg font-bold text-ink">
            On répare MTL — <span className="text-muted">concepts</span>
          </span>
        </span>
        <Link href="/" className="text-sm font-semibold text-cone hover:underline">
          Voir la démo →
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">
          Que devrait faire le produit
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink sm:text-5xl">
          Sa vraie question : <span className="text-cone">« où je répare ensuite ? »</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Marquize le demande dans presque chaque post. Le produit existe pour y
          répondre — vite, et avec le plus gros impact. Voici 5 façons. Choisis.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {/* 1 — community vote */}
          <Card
            n="🗳️"
            title="Vote communautaire"
            question="« Quel trou la gang veut en premier ? »"
            why="C'est SA mécanique actuelle (il le demande déjà), mais permanente, mesurée et toujours active. Engagement + viralité."
          >
            <ul className="space-y-1.5">
              {topVoted.map((p, i) => (
                <li key={p.id} className="flex items-center gap-2 text-[13px]">
                  <span className="font-bold text-muted">{i + 1}.</span>
                  <span className="min-w-0 flex-1 truncate text-ink">{p.address}</span>
                  <span className="rounded-md bg-cone px-2 py-0.5 text-xs font-extrabold text-white">
                    ▲ {p.votes}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* 2 — 311 sectors */}
          <Card
            n="📊"
            title="Secteurs — données 311"
            question="« Quel secteur est prioritaire ? »"
            why={`${compactNumber(POTHOLE_COMPLAINTS_TOTAL)} plaintes officielles. Tue les devinettes pour ses 3 camions + crédibilité médias que personne d'autre n'a.`}
          >
            <ul className="space-y-1.5">
              {topSectors.map((s, i) => (
                <li key={s.name}>
                  <div className="flex justify-between text-[12px]">
                    <span className="truncate text-ink">{i + 1}. {s.name}</span>
                    <span className="font-bold text-cone">{compactNumber(s.complaints)}</span>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-black/5">
                    <div className="h-full rounded-full bg-cone" style={{ width: `${(s.complaints / maxSector) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* 3 — impact score */}
          <Card
            n="🎯"
            title="Score d'impact"
            question="« Où le plus gros impact, pas juste le plus voté ? »"
            why="Reprend son angle « pour nos enfants / nos aînés ». Un trou près d'une école ou d'un CHSLD passe devant. Histoire + cœur."
          >
            <div className="space-y-2 text-[13px] text-ink">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white px-2 py-1 font-mono text-[11px]">votes</span>
                <span className="text-muted">+</span>
                <span className="rounded-md bg-white px-2 py-1 font-mono text-[11px]">gravité</span>
                <span className="text-muted">+</span>
                <span className="rounded-md bg-white px-2 py-1 font-mono text-[11px]">école / aîné</span>
              </div>
              <div className="rounded-lg bg-cone/10 p-2 text-[12px]">
                🏫 Trou près d&apos;une école · <span className="font-bold text-cone">impact 9.4</span> → priorité
              </div>
            </div>
          </Card>

          {/* 4 — bounty / sponsor */}
          <Card
            n="💰"
            title="Mise sur un trou (bounty)"
            question="« Comment financer ET prioriser ? »"
            why="Le monde et les commerces mettent de l'argent sur un trou. Le plus financé passe en premier → revenus + son GoFundMe alimenté."
          >
            <div className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between rounded-lg bg-white p-2">
                <span className="truncate text-ink">Rue Ontario E</span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-700">
                  240 $ misés
                </span>
              </div>
              <div className="rounded-lg border border-dashed border-line p-2 text-center text-[11px] text-muted">
                « Bouché grâce à [ton commerce] » — slot commandite
              </div>
            </div>
          </Card>

          {/* 5 — route */}
          <Card
            n="🚚"
            title="Itinéraire 3 camions"
            question="« Comment couvrir un secteur efficacement ? »"
            why="Il a 3 camions et travaille secteur par secteur. On groupe les trous votés en une journée optimale. Outil d'opérations, pas juste une carte."
          >
            <div className="space-y-1.5 text-[13px] text-ink">
              <div className="rounded-lg bg-white p-2">
                🚚 Camion 1 — Ville-Marie · <span className="font-bold">7 trous</span> · ~3 h
              </div>
              <div className="rounded-lg bg-white p-2">
                🚚 Camion 2 — Mercier–HoMa · <span className="font-bold">6 trous</span>
              </div>
            </div>
          </Card>

          {/* recommendation */}
          <div className="flex flex-col justify-center rounded-3xl border-2 border-cone bg-cone/5 p-5">
            <h3 className="text-lg font-bold text-ink">Ma reco</h3>
            <p className="mt-2 text-[13px] text-muted">
              Lance avec <span className="font-bold text-ink">①&nbsp;Vote</span> +{" "}
              <span className="font-bold text-ink">②&nbsp;Secteurs 311</span> côte à côte
              (viral + crédible, déjà bâtis). <span className="font-bold text-ink">③&nbsp;Impact</span> et{" "}
              <span className="font-bold text-ink">④&nbsp;Bounty</span> juste après (cœur + argent).{" "}
              <span className="font-bold text-ink">⑤&nbsp;Itinéraire</span> = l&apos;outil pro qui le rend accro.
            </p>
            <a
              href={MARQUIZE.links.donate}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 rounded-xl bg-cone px-4 py-2.5 text-center text-sm font-extrabold uppercase text-white hover:bg-cone-dark"
            >
              🧡 Tout pointe vers son GoFundMe
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
