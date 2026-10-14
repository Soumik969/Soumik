import Link from "next/link";
import type { Project } from "@/content/projects";

/** al-folio-style project card: title, meta line, one-line summary. */
export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}/`}
      className="group flex h-full flex-col rounded-lg border border-divider bg-card p-5 transition-[border-color,box-shadow,translate] duration-200 hover:border-accent/50 hover:shadow-[0_10px_28px_-14px_rgb(0_0_0/0.25)] motion-safe:hover:-translate-y-0.5 dark:hover:shadow-[0_10px_28px_-14px_rgb(0_0_0/0.8)]"
    >
      <h3 className="text-[1.1rem] leading-snug font-medium text-fg transition-colors duration-200 group-hover:text-accent">{p.title}</h3>
      <p className="mt-1 text-sm text-muted">
        {p.kind ? `${p.kind} · ` : ""}
        {p.dates}
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-fg/85">{p.summary}</p>
      {p.people.length > 0 && <p className="mt-auto pt-4 text-sm text-muted">{p.people.join(", ")}</p>}
    </Link>
  );
}
