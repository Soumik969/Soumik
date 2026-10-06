import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { asset } from "@/lib/site";

export function Footer() {
  const links = [
    { label: "github", href: profile.github, external: true },
    { label: "email", href: `mailto:${profile.emails.personal}` },
    { label: "cv", href: asset(profile.cvPath), download: true },
  ];

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="shell grid gap-8 py-10 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div>
          <p className="font-mono text-[0.8rem] tracking-[0.18em] text-paper">SOUMIK SAHOO</p>
          <p className="label-sm mt-2 text-mist">Engineering Physics · IIT Bombay</p>
        </div>

        <ul className="flex flex-wrap items-center gap-2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(l.download ? { download: true } : {})}
                className="label-sm group inline-flex items-center gap-1 border border-line px-3 py-2 text-mist transition-colors hover:border-cyan hover:text-cyan"
              >
                <span className="text-fog group-hover:text-cyan">[</span> {l.label} <span className="text-fog group-hover:text-cyan">]</span>
                {l.external && <ArrowUpRight size={11} aria-hidden />}
              </a>
            </li>
          ))}
        </ul>

        <div className="md:text-right">
          <p className="label-sm text-fog">
            System version <span className="text-cyan">{"// 969"}</span>
          </p>
          <p className="label-sm mt-2 text-fog">© 2026 Soumik Sahoo</p>
        </div>
      </div>
    </footer>
  );
}
