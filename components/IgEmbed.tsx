"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds?: { process: () => void } };
  }
}

const SCRIPT_ID = "ig-embed-js";

/**
 * Renders a real Instagram post via Instagram's OFFICIAL embed (content stays
 * hosted by Instagram, attributed, creator-controlled). No image is downloaded
 * or rehosted. `url` is a public post/reel permalink.
 */
export function IgEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const process = () => window.instgrm?.Embeds?.process();
    if (document.getElementById(SCRIPT_ID)) {
      process();
      return;
    }
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = process;
    document.body.appendChild(s);
  }, [url]);

  return (
    <blockquote
      ref={ref}
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ margin: 0, width: "100%", minWidth: "unset", border: "none" }}
    />
  );
}
