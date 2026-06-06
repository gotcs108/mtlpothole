import { MARQUIZE } from "@/lib/marquize";

/** Links straight to Marquize's fund (community support, both variants). */
export function SupportButton({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <a
      href={MARQUIZE.links.donate}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 font-extrabold uppercase tracking-wide transition ${
        compact
          ? "rounded-lg border border-white/60 bg-white/50 px-3 py-1.5 text-sm text-ink hover:bg-white/70"
          : "rounded-xl bg-cone px-5 py-3 text-white hover:bg-cone-dark"
      } ${className}`}
    >
      🧡
      {compact ? (
        <span className="hidden sm:inline">Soutiens</span>
      ) : (
        <span>Soutiens le mouvement</span>
      )}
    </a>
  );
}
