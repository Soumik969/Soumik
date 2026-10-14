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
          (2023 – 2027), pursuing an Honors degree in Physics and a Minor in Machine Intelligence and Data Science.
        </p>
        <p>{profile.researchInterests}</p>
        <p>Currently, I am working on:</p>
        <ul className="mb-4 list-disc space-y-1.5 pl-6">
          {current.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
              <span className="text-muted">
                {" "}
                — with {p.people.join(" & ")}, {p.institution.split(", ").pop()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <section className="clear-both" aria-labelledby="news">
        <h2 id="news" className="section-title">
          News
        </h2>
        <table className="w-full text-left">
          <tbody>
            {news.map((n) => (
              <tr key={n.date} className="align-top">
                <th scope="row" className="w-28 py-2 pr-4 text-sm font-normal whitespace-nowrap text-muted sm:w-32">
                  {n.date}
                </th>
                <td className="py-2">
                  {n.href ? (
                    <Link href={n.href} className="text-fg hover:text-accent">
                      {n.text}
                    </Link>
                  ) : (
                    n.text
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
