import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

/**
 * Static export so the site can be hosted on GitHub Pages (or any static host).
 * NEXT_PUBLIC_BASE_PATH is injected by the Pages workflow: "" for a root site
 * (soumik969.github.io) or "/Soumik" for a project site.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Fingerprint of the CV PDF, so browsers and CDNs fetch the new file when it changes (same file name). */
const cvVersion = createHash("sha1").update(readFileSync("public/cv/Soumik_Sahoo_CV.pdf")).digest("hex").slice(0, 8);

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_CV_VERSION: cvVersion },
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
