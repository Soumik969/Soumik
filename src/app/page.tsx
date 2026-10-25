import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Profile } from "@/components/Profile";
import { SocialLinks } from "@/components/SocialLinks";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export const metadata: Metadata = { alternates: { canonical: "./" } };

export default function About() {
  const current = projects.filter((p) => p.category === "Research" && p.ongoing);

  return (
    <article>
      <PageHeader
        title={
          <>
            <span className="font-bold">{profile.firstName}</span> {profile.lastName}
          </>
        }
        description={profile.tagline}
      />

      <Profile />

      <div className="prose-page">
        <p>
          I&apos;m an undergraduate in Engineering Physics at{" "}
          <a href={profile.instituteUrl} target="_blank" rel="noopener noreferrer">
            IIT Bombay
          </a>{" "}
          (2023 – 2027), pursuing an Honors in Physics.
        </p>
        <p>{profile.researchInterests}</p>
        <p>Currently, I am working on:</p>
        <ul className="mb-4 list-disc space-y-2.5 pl-6 marker:text-muted">
          {current.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
              <span className="block text-[0.9rem] leading-snug text-muted">
                with {p.people.join(" & ")} · {p.institution.split(", ").pop()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/projects/" className="btn btn-primary">
          View projects
        </Link>
        <Link href="/cv/" className="btn btn-outline">
          See my CV
        </Link>
      </div>

      <section className="clear-both mt-12 text-center" aria-label="Elsewhere">
        <SocialLinks size={26} className="justify-center gap-6" />
        <p className="mt-4 text-sm text-muted">
          The best way to reach me is by email at{" "}
          <a href={`mailto:${profile.emails.personal}`} className="link">
            {profile.emails.personal}
          </a>
          .
        </p>
      </section>
    </article>
  );
}
