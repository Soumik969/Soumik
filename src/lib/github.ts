/** Minimal GitHub contents-API client for the admin page. Runs in the browser with the owner's own access token;
 *  nothing here talks to any other server. */

import { IMAGES_DIR, parsePost, POSTS_DIR, serializePost, type PostMeta } from "./posts-format";

const API = "https://api.github.com";

/** "owner/name" of the repository that holds the site; the Pages workflow sets it, so it survives a rename. */
export const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "Soumik969/Soumik";

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function call<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = ((await res.json()) as { message?: string }).message ?? "";
    } catch {
      /* no body */
    }
    throw new GitHubError(explain(res.status, detail), res.status);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

function explain(status: number, detail: string): string {
  if (status === 401) return "GitHub did not accept this token. It may be wrong or expired.";
  if (status === 403) return `GitHub refused the request${detail ? ` (${detail})` : ""}. Check the token's permissions.`;
  if (status === 404) return "Not found. The token may not have access to this repository.";
  if (status === 409 || status === 422) return "This file changed or already exists. Reload the post and try again.";
  return detail || `GitHub error ${status}.`;
}

const toBase64 = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
const fromBase64 = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));

type FileInfo = { name: string; sha: string; content?: string };

/** Checks the token can write to the repository and returns its default branch. */
export async function connect(token: string): Promise<string> {
  const repo = await call<{ default_branch: string; permissions?: { push?: boolean } }>(token, `/repos/${REPO}`);
  if (!repo.permissions?.push) throw new GitHubError("This token can read the repository but not change it. Give it “Contents: Read and write”.", 403);
  return repo.default_branch;
}

export type PostEntry = { slug: string; sha: string; meta: PostMeta };

export async function listPosts(token: string, branch: string): Promise<PostEntry[]> {
  let files: FileInfo[];
  try {
    files = await call<FileInfo[]>(token, `/repos/${REPO}/contents/${POSTS_DIR}?ref=${encodeURIComponent(branch)}`);
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return [];
    throw e;
  }
  const md = files.filter((f) => f.name.endsWith(".md"));
  const entries = await Promise.all(md.map((f) => loadPost(token, branch, f.name.replace(/\.md$/, ""))));
  return entries.map((e) => ({ slug: e.slug, sha: e.sha, meta: e.meta })).sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export async function loadPost(token: string, branch: string, slug: string) {
  const file = await call<FileInfo>(token, `/repos/${REPO}/contents/${POSTS_DIR}/${slug}.md?ref=${encodeURIComponent(branch)}`);
  const { meta, body } = parsePost(fromBase64(file.content ?? ""));
  return { slug, sha: file.sha, meta, body };
}

/** Creates the post, or updates it when `sha` (the version being edited) is given. Returns the new sha. */
export async function savePost(token: string, branch: string, slug: string, meta: PostMeta, body: string, sha?: string): Promise<string> {
  const res = await call<{ content: { sha: string } }>(token, `/repos/${REPO}/contents/${POSTS_DIR}/${slug}.md`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Blog: ${sha ? "update" : "add"} “${meta.title.trim()}”`,
      content: toBase64(serializePost(meta, body)),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
  return res.content.sha;
}

export async function deletePost(token: string, branch: string, slug: string, sha: string, title: string): Promise<void> {
  await call(token, `/repos/${REPO}/contents/${POSTS_DIR}/${slug}.md`, {
    method: "DELETE",
    body: JSON.stringify({ message: `Blog: delete “${title.trim()}”`, sha, branch }),
  });
}

/** Shrinks a photo to at most 1600 px on the long edge and re-encodes it as JPEG, which also drops its metadata (GPS, camera). */
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot resize images.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return await new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not convert the image."))), "image/jpeg", 0.82));
}

/** Uploads a photo for a post and returns the site path to use in its Markdown. */
export async function uploadImage(token: string, branch: string, slug: string, file: File): Promise<string> {
  const blob = await shrink(file);
  const data = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
  const name = `${Date.now().toString(36)}.jpg`;
  await call(token, `/repos/${REPO}/contents/${IMAGES_DIR}/${slug}/${name}`, {
    method: "PUT",
    body: JSON.stringify({ message: `Blog: add image for ${slug}`, content: data, branch }),
  });
  return `/blog/${slug}/${name}`;
}
