import type { Metadata } from "next";
import Link from "next/link";
import { DownloadIcon, ExternalIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { achievements, coursework, education, extracurricular, profile, programmes } from "@/content/profile";
import { skills } from "@/content/skills";
import { asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae of Soumik Sahoo.",
  alternates: { canonical: "cv/" },
};

export default function CV() {
  const pdf = asset(profile.cvPath);

  return (
    <>
      <PageHeader title="CV" description="My curriculum vitae: research, projects and other experience." />

      <div className="mb-6 flex flex-wrap gap-3">
        <a
          href={pdf}
          download
          className="inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-sm text-white transition-opacity hover:opacity-90 dark:text-bg"
        >
          <DownloadIcon size={16} /> Download PDF
        </a>
        <a
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded border border-accent px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-white dark:hover:text-bg"
        >
          Open in a new tab <ExternalIcon size={14} />
        </a>
      </div>

      {/* Inline viewer on larger screens; phones get the buttons above. */}
      <object data={pdf} type="application/pdf" aria-label="CV (PDF)" className="hidden h-[1100px] w-full rounded border border-divider md:block">
        <p className="p-4">
          Your browser can’t show the PDF here.{" "}
          <a href={pdf} className="link">
            Download it instead
          </a>
          .
        </p>
      </object>

      <section aria-labelledby="education">
        <h2 id="education" className="section-title">
          Education
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-[0.95rem]">
            <thead>
              <tr className="border-b border-divider text-sm text-muted">
                <th scope="col" className="py-2 pr-4 font-normal">
                  Degree / examination
                </th>
                <th scope="col" className="py-2 pr-4 font-normal">
                  Institute
                </th>
                <th scope="col" className="py-2 pr-4 font-normal">
                  Year
                </th>
                <th scope="col" className="py-2 font-normal">
                  CPI / %
                </th>
              </tr>
            </thead>
            <tbody>
              {education.map((e) => (
                <tr key={e.degree} className="border-b border-divider align-top">
                  <td className="py-2 pr-4">
                    {e.degree}
                    <span className="block text-sm text-muted">{e.board}</span>
                  </td>
                  <td className="py-2 pr-4">{e.institute}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">{e.year}</td>
                  <td className="py-2 whitespace-nowrap">{e.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <ul className="space-y-2">
          {achievements.map((a) => (
            <li key={a.text} className="flex justify-between gap-4">
              <span>{a.text}</span>
              <span className="shrink-0 text-muted">{a.year}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="research">
        <h2 id="research" className="section-title">
          Research & projects
        </h2>
        <p>
          Detailed descriptions of each project are on the{" "}
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
        <p>
          See the{" "}
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
        <ul className="space-y-2">
          {extracurricular.map((x) => (
            <li key={x.text} className="flex justify-between gap-4">
              <span>{x.text}</span>
              <span className="shrink-0 text-muted">{x.year}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
