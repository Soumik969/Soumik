import type { Metadata } from "next";
import Link from "next/link";
import { DownloadIcon, ExternalIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { achievements, coursework, education, extracurricular, profile, programmes } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { teaching } from "@/content/teaching";
import { asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae of Soumik Sahoo.",
  alternates: { canonical: "cv/" },
};

/** One dated CV row: text on the left, a small muted date on the right (stacked below on phones). */
const row = "flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4";
const date = "shrink-0 text-sm whitespace-nowrap text-muted";

export default function CV() {
  const pdf = asset(profile.cvPath);
  const research = projects.filter((p) => p.category === "Research");

  return (
    <>
      <PageHeader title="CV" description="My curriculum vitae: research, projects and other experience." />

      <div className="mb-6 flex flex-wrap gap-3">
        <a href={pdf} download className="btn btn-primary">
          <DownloadIcon size={16} /> Download PDF
        </a>
        <a href={pdf} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          Open in a new tab <ExternalIcon size={14} />
        </a>
      </div>

      {/* Inline viewer on larger screens, collapsed so the CV content leads; phones get the buttons above.
          Add the `open` attribute to <details> to show it expanded by default. */}
      <details className="hidden rounded-lg border border-divider md:block">
        <summary className="cursor-pointer rounded-lg px-4 py-3 text-sm text-muted transition-colors select-none hover:text-accent">
          Preview the PDF on this page
        </summary>
        <object
          data={pdf}
          type="application/pdf"
          aria-label="CV (PDF)"
          className="block h-[85vh] max-h-[1100px] min-h-[600px] w-full rounded-b-lg border-t border-divider"
        >
          <p className="p-4">
            Your browser can’t show the PDF here.{" "}
            <a href={pdf} className="link">
              Download it instead
            </a>
            .
          </p>
        </object>
      </details>

      <section aria-labelledby="education">
        <h2 id="education" className="section-title">
          Education
        </h2>
        <table className="w-full text-left text-[0.95rem]">
          <thead>
            <tr className="border-b border-divider text-sm text-muted">
              <th scope="col" className="py-2 pr-4 font-normal">
                Degree / examination
              </th>
              <th scope="col" className="hidden py-2 pr-4 font-normal sm:table-cell">
                Institute
              </th>
              <th scope="col" className="py-2 pr-4 font-normal">
                Year
              </th>
              <th scope="col" className="py-2 text-right font-normal">
                CPI / %
              </th>
            </tr>
          </thead>
          <tbody>
            {education.map((e) => (
              <tr key={e.degree} className="border-b border-divider align-top">
                <td className="py-3 pr-4">
                  {e.degree}
                  {/* Phones: the institute moves under the degree, so Year and CPI stay on screen. */}
                  <span className="block text-sm text-muted sm:hidden">{e.board === e.institute ? e.institute : `${e.institute} · ${e.board}`}</span>
                  {e.board !== e.institute && <span className="hidden text-sm text-muted sm:block">{e.board}</span>}
                </td>
                <td className="hidden py-3 pr-4 sm:table-cell">{e.institute}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{e.year}</td>
                <td className="py-3 text-right whitespace-nowrap tabular-nums">{e.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="mt-4 list-disc space-y-1 pl-6">
          {programmes.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="achievements">
        <h2 id="achievements" className="section-title">
          Scholastic achievements
        </h2>
        <ul className="space-y-3 sm:space-y-2">
          {achievements.map((a) => (
            <li key={a.text} className={row}>
              <span>{a.text}</span>
              <span className={date}>{a.year}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="research">
        <h2 id="research" className="section-title">
          Research & projects
        </h2>
        <ul className="space-y-3 sm:space-y-2">
          {research.map((p) => (
            <li key={p.slug} className={row}>
              <Link href={`/projects/${p.slug}/`} className="link">
                {p.title}
              </Link>
              <span className={date}>{p.dates}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Course projects and full descriptions are on the{" "}
          <Link href="/projects/" className="link">
            Projects
          </Link>{" "}
          page.
        </p>
      </section>

      <section aria-labelledby="skills">
        <h2 id="skills" className="section-title">
          Technical skills
        </h2>
        <dl className="space-y-3">
          {skills.map((s) => (
            <div key={s.group} className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:gap-4">
              <dt className="font-medium">{s.group}</dt>
              <dd className="text-fg/85">{s.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="coursework">
        <h2 id="coursework" className="section-title">
          Key courses
        </h2>
        <dl className="space-y-3">
          {coursework.map((c) => (
            <div key={c.area} className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:gap-4">
              <dt className="font-medium">{c.area}</dt>
              <dd className="text-fg/85">{c.courses.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="teaching">
        <h2 id="teaching" className="section-title">
          Mentorship & teaching
        </h2>
        <ul className="space-y-3 sm:space-y-2">
          {teaching.map((t) => (
            <li key={t.course} className={row}>
              <span>
                {t.role}, {t.course}
              </span>
              <span className={date}>{t.dates}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Details are on the{" "}
          <Link href="/teaching/" className="link">
            Teaching
          </Link>{" "}
          page.
        </p>
      </section>

      <section aria-labelledby="extracurricular">
        <h2 id="extracurricular" className="section-title">
          Extracurricular activities
        </h2>
        <ul className="space-y-3 sm:space-y-2">
          {extracurricular.map((x) => (
            <li key={x.text} className={row}>
              <span>{x.text}</span>
              <span className={date}>{x.year}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
