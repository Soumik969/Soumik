import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parsePost, POSTS_DIR, type PostMeta } from "./posts-format";

export type Post = PostMeta & { slug: string; body: string };

/** All posts, newest first. Drafts are left out unless asked for. Read at build time. */
export function getPosts({ drafts = false }: { drafts?: boolean } = {}): Post[] {
  let files: string[];
  try {
    files = readdirSync(join(process.cwd(), POSTS_DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  return files
    .map((f) => {
      const { meta, body } = parsePost(readFileSync(join(process.cwd(), POSTS_DIR, f), "utf8"));
      return { ...meta, slug: f.replace(/\.md$/, ""), body };
    })
    .filter((p) => drafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
