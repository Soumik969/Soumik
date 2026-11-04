import { Marked } from "marked";
import { asset } from "./site";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Links must be http(s), mailto, an in-page anchor or a site path; anything else (javascript: ...) becomes plain text. */
const safeHref = (href: string) => /^(https?:\/\/|mailto:|#|\/)/i.test(href);

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    // Raw HTML in a post is shown as text, never run.
    html: ({ text }) => escape(text),
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      if (!safeHref(href)) return label;
      const external = /^https?:\/\//i.test(href);
      const url = href.startsWith("/") ? asset(href) : href;
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escape(url)}"${title ? ` title="${escape(title)}"` : ""}${attrs}>${label}</a>`;
    },
    image({ href, title, text }) {
      if (!safeHref(href)) return escape(text);
      const url = href.startsWith("/") ? asset(href) : href;
      return `<img src="${escape(url)}" alt="${escape(text)}"${title ? ` title="${escape(title)}"` : ""} loading="lazy" decoding="async">`;
    },
  },
});

/** Markdown → HTML for a blog post. Used at build time and in the admin preview. */
export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false });
}
