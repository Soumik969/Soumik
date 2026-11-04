/** Blog post file format, shared by the site build and the admin editor. A post is a Markdown file:
 *
 *   ---
 *   title: "Post title"
 *   date: 2026-11-04
 *   summary: "One line shown in the list."
 *   draft: false
 *   ---
 *
 *   Body in Markdown...
 */

export type PostMeta = { title: string; date: string; summary: string; draft: boolean };

export const POSTS_DIR = "content/posts";
export const IMAGES_DIR = "public/blog";

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parsePost(raw: string): { meta: PostMeta; body: string } {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const fields: Record<string, string> = {};
  if (match) {
    for (const line of match[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  const str = (key: string) => {
    const v = fields[key] ?? "";
    if (v.startsWith('"')) {
      try {
        return String(JSON.parse(v));
      } catch {
        /* fall through to the raw text */
      }
    }
    return v;
  };
  const body = match ? text.slice(match[0].length).replace(/^\n+/, "") : text;
  return {
    meta: { title: str("title"), date: str("date") || today(), summary: str("summary"), draft: fields.draft === "true" },
    body,
  };
}

export function serializePost(meta: PostMeta, body: string): string {
  const head = [
    "---",
    `title: ${JSON.stringify(meta.title.trim())}`,
    `date: ${meta.date}`,
    `summary: ${JSON.stringify(meta.summary.trim())}`,
    `draft: ${meta.draft}`,
    "---",
  ];
  return `${head.join("\n")}\n\n${body.trim()}\n`;
}

/** "My first post!" → "my-first-post" (ASCII only, so it is safe in URLs and file names). */
export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

export function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
