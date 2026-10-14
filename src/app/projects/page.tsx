import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { projectCategories, projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Research and course projects by Soumik Sahoo.",
  alternates: { canonical: "projects/" },
};

export default function Projects() {
  return (
    <>
      <PageHeader title="Projects" description="Research projects and course projects. Select a card for details." />
      {projectCategories.map((cat) => (
        <section key={cat} aria-labelledby={`cat-${cat}`} className="mb-12">
          <h2 id={`cat-${cat}`} className="mb-5 border-b border-divider pb-2 text-right text-[1.6rem] font-light text-muted">
            {cat}
          </h2>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects
              .filter((p) => p.category === cat)
              .map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}
