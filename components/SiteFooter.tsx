import { ConeIcon } from "./ConeIcon";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-muted sm:flex-row">
        <span className="flex items-center gap-2">
          <ConeIcon className="h-5 w-5" /> mtl
          <span className="text-cone">pothole</span> · made for Montreal
        </span>
        <span>
          Inspired by{" "}
          <a
            href="https://www.instagram.com/marquize.7/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-cone hover:underline"
          >
            @marquize.7
          </a>
        </span>
      </div>
    </footer>
  );
}
