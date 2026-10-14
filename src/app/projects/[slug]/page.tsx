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

  const role = p.category === "Research" ? "Supervisor" : "Instructor";
  const meta: [string, string][] = [
    ["Dates", p.dates],
    ...(p.people.length ? [[p.people.length > 1 ? `${role}s` : role, p.people.join(", ")] as [string, string]] : []),
    ...(p.kind ? [[p.category === "Course Projects" ? "Course" : "Type", p.kind] as [string, string]] : []),
    ["Institution", p.institution],
    ...(p.note ? [["Status", p.note] as [string, string]] : []),
  ];

  return (
    <article className="max-w-3xl">
      <PageHeader compact title={p.title} description={p.summary} />

      <dl className="mb-8 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-1.5 rounded-lg bg-surface px-5 py-4 text-[0.95rem] sm:grid-cols-[8rem_1fr] sm:gap-x-6">
        {meta.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd>{v}</dd>
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
            <a key={l.href} href={isExternal(l.href) ? l.href : asset(l.href)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
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
