import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { RichText } from "@/components/RichText";
import { getProject, projects } from "@/content/projects";
import { asset, isExternal } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.summary, alternates: { canonical: `projects/${p.slug}/` } };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  const meta: [string, string][] = [
    ["Dates", p.dates],
    ...(p.people.length
      ? [[p.people.length > 1 ? "Supervisors" : p.category === "Research" ? "Supervisor" : "Instructor", p.people.join(", ")] as [string, string]]
      : []),
    ...(p.kind ? [[p.category === "Course Projects" ? "Course" : "Type", p.kind] as [string, string]] : []),
    ["Institution", p.institution],
    ...(p.note ? [["Status", p.note] as [string, string]] : []),
  ];

  return (
    <article>
      <PageHeader title={p.title} description={p.summary} />

      <dl className="mb-8 grid grid-cols-1 gap-x-6 gap-y-1 rounded border border-divider bg-card p-4 text-[0.95rem] sm:grid-cols-[8rem_1fr]">
        {meta.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="mb-2 sm:mb-0">{v}</dd>
          </div>
        ))}
      </dl>

      <ul className="list-disc space-y-3 pl-6 leading-relaxed">
        {p.details.map((d) => (
          <li key={d}>
            <RichText text={d} />
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-muted">
        <span className="font-medium">Keywords:</span> {p.keywords.join(" · ")}
      </p>

      {p.links && p.links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {p.links.map((l) => (
            <a
              key={l.href}
              href={isExternal(l.href) ? l.href : asset(l.href)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-accent px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-white dark:hover:text-bg"
            >
              {l.label} <ExternalIcon size={14} />
            </a>
          ))}
        </div>
      )}

      <p className="mt-12">
        <Link href="/projects/" className="link inline-flex items-center gap-2">
          <ArrowLeftIcon size={16} /> All projects
        </Link>
      </p>
    </article>
  );
}
