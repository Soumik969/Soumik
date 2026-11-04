"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect, deletePost, listPosts, loadPost, REPO, savePost, uploadImage, type PostEntry } from "@/lib/github";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate, slugify, today, type PostMeta } from "@/lib/posts-format";
import { asset } from "@/lib/site";

const TOKEN_KEY = "blog-admin-token";

const field = "w-full rounded-md border border-divider bg-card px-3 py-2 text-fg placeholder:text-muted/70 focus:border-accent focus:outline-none";

type Session = { token: string; branch: string };

type Draft = {
  /** Set once the post exists on GitHub; null for a post that has not been saved yet. */
  sha: string | null;
  slug: string;
  slugEdited: boolean;
  meta: PostMeta;
  body: string;
};

const blankDraft = (): Draft => ({ sha: null, slug: "", slugEdited: false, meta: { title: "", date: today(), summary: "", draft: true }, body: "" });

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
function storeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode: the token just is not remembered */
  }
}

const message = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");

  const signIn = useCallback(async (token: string) => {
    const branch = await connect(token);
    storeToken(token);
    setSession({ token, branch });
  }, []);

  useEffect(() => {
    // Read the saved token after mount (it lives in the browser), then sign in with it if there is one.
    Promise.resolve(readToken())
      .then((saved) => (saved ? signIn(saved) : undefined))
      .catch((e) => {
        setError(message(e));
        storeToken(null);
      })
      .finally(() => setBooting(false));
  }, [signIn]);

  if (booting) return <p className="text-muted">Loading…</p>;
  if (!session) return <ConnectForm onConnect={signIn} initialError={error} />;
  return (
    <Dashboard
      session={session}
      onDisconnect={() => {
        storeToken(null);
        setSession(null);
        setError("");
      }}
    />
  );
}

function ConnectForm({ onConnect, initialError }: { onConnect: (token: string) => Promise<void>; initialError: string }) {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onConnect(token.trim());
    } catch (err) {
      setError(message(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <p>
        To write posts here, connect this page to your GitHub repository <strong>{REPO}</strong> with an access token. The token stays in this browser and is
        only ever sent to GitHub.
      </p>
      <ol className="list-decimal space-y-1.5 pl-6 text-[0.95rem] text-fg/85">
        <li>
          Open{" "}
          <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer" className="link">
            GitHub → Fine-grained tokens → Generate new token
          </a>
          .
        </li>
        <li>Name it “Website blog”, set an expiry (the longest allowed is fine), and under Repository access choose “Only select repositories” → {REPO}.</li>
        <li>Under Permissions → Repository permissions, set “Contents” to “Read and write”.</li>
        <li>Generate the token, copy it, and paste it below.</li>
      </ol>
      <label className="block">
        <span className="mb-1 block text-sm text-muted">Access token</span>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={field}
          autoComplete="off"
          spellCheck={false}
          placeholder="github_pat_…"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={busy || token.trim().length < 20}>
        {busy ? "Connecting…" : "Connect"}
      </button>
    </form>
  );
}

function Dashboard({ session, onDisconnect }: { session: Session; onDisconnect: () => void }) {
  const { token, branch } = session;
  const [posts, setPosts] = useState<PostEntry[] | null>(null);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);

  const refresh = useCallback(async () => {
    setError("");
    try {
      setPosts(await listPosts(token, branch));
    } catch (e) {
      setError(message(e));
      setPosts([]);
    }
  }, [token, branch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads the post list from GitHub on mount
    void refresh();
  }, [refresh]);

  async function edit(slug: string) {
    setError("");
    try {
      const p = await loadPost(token, branch, slug);
      setDraft({ sha: p.sha, slug, slugEdited: true, meta: p.meta, body: p.body });
    } catch (e) {
      setError(message(e));
    }
  }

  if (draft) {
    return (
      <Editor
        session={session}
        initial={draft}
        onClose={() => {
          setDraft(null);
          void refresh();
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => setDraft(blankDraft())}>
          New post
        </button>
        <a href={asset("/blog/")} target="_blank" rel="noopener noreferrer" className="link text-sm">
          View the blog
        </a>
        <button type="button" className="ml-auto text-sm text-muted hover:text-accent" onClick={onDisconnect}>
          Disconnect
        </button>
      </div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {posts === null ? (
        <p className="text-muted">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="text-muted">No posts yet. Select “New post” to write your first one.</p>
      ) : (
        <ul className="divide-y divide-divider border-y border-divider">
          {posts.map((p) => (
            <li key={p.slug} className="flex items-baseline justify-between gap-4 py-3">
              <button type="button" onClick={() => edit(p.slug)} className="min-w-0 text-left transition-colors hover:text-accent">
                <span className="font-medium">{p.meta.title || p.slug}</span>
                {p.meta.draft && <span className="ml-2 rounded-full border border-divider px-2 py-0.5 text-xs text-muted">Draft</span>}
              </button>
              <span className="shrink-0 text-sm text-muted">{formatDate(p.meta.date)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Editor({ session, initial, onClose }: { session: Session; initial: Draft; onClose: () => void }) {
  const { token, branch } = session;
  const [d, setD] = useState<Draft>(initial);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [status, setStatus] = useState<{ kind: "ok" | "error" | "info"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  const isNew = d.sha === null;
  const slug = d.slugEdited ? d.slug : slugify(d.meta.title);
  const html = useMemo(() => (tab === "preview" ? renderMarkdown(d.body) : ""), [tab, d.body]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function change(patch: Partial<Draft>, meta?: Partial<PostMeta>) {
    setD((cur) => ({ ...cur, ...patch, meta: { ...cur.meta, ...meta } }));
    setDirty(true);
    setStatus(null);
  }

  function validate(): string | null {
    if (!d.meta.title.trim()) return "Give the post a title.";
    if (!slug) return "The address needs at least one letter or number.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.meta.date)) return "Pick a date.";
    return null;
  }

  async function save() {
    const problem = validate();
    if (problem) return setStatus({ kind: "error", text: problem });
    setBusy(true);
    setStatus({ kind: "info", text: "Saving…" });
    try {
      const sha = await savePost(token, branch, slug, d.meta, d.body, d.sha ?? undefined);
      setD((cur) => ({ ...cur, sha, slug, slugEdited: true }));
      setDirty(false);
      setStatus({
        kind: "ok",
        text: d.meta.draft ? "Saved as a draft. Visitors cannot see it." : "Saved. The site updates in about 2 minutes, then the post is live.",
      });
    } catch (e) {
      setStatus({ kind: "error", text: message(e) });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!d.sha || !window.confirm(`Delete “${d.meta.title}”? This cannot be undone from here.`)) return;
    setBusy(true);
    try {
      await deletePost(token, branch, slug, d.sha, d.meta.title);
      setDirty(false);
      onClose();
    } catch (e) {
      setStatus({ kind: "error", text: message(e) });
      setBusy(false);
    }
  }

  async function addImage(file: File | undefined) {
    if (!file) return;
    if (!slug) return setStatus({ kind: "error", text: "Write the title first, so the photo has a folder to go in." });
    setBusy(true);
    setStatus({ kind: "info", text: "Uploading the photo…" });
    try {
      const path = await uploadImage(token, branch, slug, file);
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const el = area.current;
      const at = el ? el.selectionStart : d.body.length;
      const snippet = `${at > 0 && d.body[at - 1] !== "\n" ? "\n\n" : ""}![${alt}](${path})\n\n`;
      change({ body: d.body.slice(0, at) + snippet + d.body.slice(at) });
      setStatus({ kind: "ok", text: "Photo added. Edit the text in [brackets] to describe it, then save the post." });
    } catch (e) {
      setStatus({ kind: "error", text: message(e) });
    } finally {
      setBusy(false);
      if (picker.current) picker.current.value = "";
    }
  }

  function close() {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    onClose();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={close} className="text-sm text-muted hover:text-accent">
          ← All posts
        </button>
        {!isNew && !d.meta.draft && (
          <a href={asset(`/blog/${slug}/`)} target="_blank" rel="noopener noreferrer" className="link ml-auto text-sm">
            View the post
          </a>
        )}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm text-muted">Title</span>
        <input value={d.meta.title} onChange={(e) => change({}, { title: e.target.value })} className={`${field} text-lg`} placeholder="Post title" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Date</span>
          <input type="date" value={d.meta.date} onChange={(e) => change({}, { date: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Address {isNew ? "" : "(fixed once saved)"}</span>
          <input
            value={slug}
            readOnly={!isNew}
            onChange={(e) => change({ slug: slugify(e.target.value), slugEdited: true })}
            className={`${field} font-mono text-sm ${isNew ? "" : "opacity-70"}`}
            placeholder="post-address"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm text-muted">Summary (one line, shown in the list)</span>
        <input value={d.meta.summary} onChange={(e) => change({}, { summary: e.target.value })} className={field} />
      </label>

      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
          <div role="tablist" aria-label="Editor mode" className="flex gap-1">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 capitalize transition-colors ${tab === t ? "bg-tint text-accent" : "text-muted hover:text-accent"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => picker.current?.click()} disabled={busy} className="ml-auto text-muted hover:text-accent disabled:opacity-50">
            Add photo
          </button>
          <input ref={picker} type="file" accept="image/*" hidden onChange={(e) => addImage(e.target.files?.[0])} />
        </div>
        {tab === "write" ? (
          <textarea
            ref={area}
            value={d.body}
            onChange={(e) => change({ body: e.target.value })}
            rows={18}
            className={`${field} min-h-[20rem] resize-y font-mono text-[0.9rem] leading-relaxed`}
            placeholder="Write in Markdown: ## Heading, **bold**, [link](https://…), - list"
          />
        ) : (
          <div className="min-h-[20rem] rounded-md border border-divider p-4">
            {d.body.trim() ? <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} /> : <p className="text-muted">Nothing to preview yet.</p>}
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-[0.95rem]">
        <input type="checkbox" checked={d.meta.draft} onChange={(e) => change({}, { draft: e.target.checked })} className="size-4 accent-[var(--accent)]" />
        Draft (hidden from visitors)
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">
          {d.meta.draft ? "Save draft" : isNew ? "Publish" : "Save changes"}
        </button>
        {!isNew && (
          <button type="button" onClick={remove} disabled={busy} className="ml-auto text-sm text-muted hover:text-red-600 dark:hover:text-red-400">
            Delete post
          </button>
        )}
      </div>
      {status && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`text-sm ${status.kind === "error" ? "text-red-600 dark:text-red-400" : status.kind === "ok" ? "text-accent" : "text-muted"}`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
