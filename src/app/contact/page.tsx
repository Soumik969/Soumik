import type { Metadata } from "next";
import { FileIcon, GitHubIcon, MailIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { profile } from "@/content/profile";
import { asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to get in touch with Soumik Sahoo.",
  alternates: { canonical: "contact/" },
};

export default function Contact() {
  const rows = [
    { icon: <MailIcon />, label: "Personal email", text: profile.emails.personal, href: `mailto:${profile.emails.personal}` },
    { icon: <MailIcon />, label: "Academic email", text: profile.emails.academic, href: `mailto:${profile.emails.academic}` },
    { icon: <GitHubIcon />, label: "GitHub", text: `github.com/${profile.githubHandle}`, href: profile.github, external: true },
    { icon: <FileIcon />, label: "CV", text: "Download (PDF)", href: asset(profile.cvPath), external: true },
  ];

  return (
    <>
      <PageHeader title="Contact" description="Get in touch!" />
      <p className="mb-6 max-w-2xl">
        I’m always happy to talk about physics — research, projects or collaborations, especially around quantum devices and topological systems. Email is the
        quickest way to reach me.
      </p>
      <ul className="space-y-4">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-4">
            <span className="mt-0.5 text-accent">{r.icon}</span>
            <span>
              <span className="block text-sm text-muted">{r.label}</span>
              <a href={r.href} {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="link text-[1.05rem] break-all">
                {r.text}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
