/** Deployment-dependent values, injected at build time by the Pages workflow. */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://soumik969.github.io").replace(/\/$/, "");

/** Prefix a public/ asset path with the base path; external URLs pass through. */
export function asset(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
