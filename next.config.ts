import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully client-side app (localStorage + 3rd-party APIs) → export to static
  // HTML/JS for any static host (Cloudflare Pages, etc.). No server/backend.
  output: "export",
};

export default nextConfig;
