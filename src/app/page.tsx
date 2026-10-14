import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Profile } from "@/components/Profile";
import { SocialLinks } from "@/components/SocialLinks";
import { news, profile } from "@/content/profile";
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
          (2023 – 2027), pursuing an Honors degree in Physics.
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

      <section className="clear-both" aria-labelledby="news">
        <h2 id="news" className="section-title">
          News
        </h2>
        <ul className="space-y-4 sm:space-y-0">
          {news.map((n) => (
            <li key={n.date} className="grid gap-0.5 sm:grid-cols-[8rem_1fr] sm:items-baseline sm:gap-4 sm:py-2">
              <span className="text-sm whitespace-nowrap text-muted">{n.date}</span>
              <p>
                {n.href ? (
                  <Link
                    href={n.href}
                    className="underline decoration-fg/20 decoration-1 underline-offset-[3px] transition-colors hover:text-accent hover:decoration-current"
                  >
                    {n.text}
                  </Link>
                ) : (
                  n.text
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 text-center" aria-label="Elsewhere">
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
