import { profile } from "@/content/profile";
import { asset } from "@/lib/site";
import { cn } from "@/lib/cn";
import { FileIcon, GitHubIcon, MailIcon } from "./Icons";

/** Email · GitHub · CV icon row (navbar brand on the About page, and its footer). */
export function SocialLinks({ size = 20, className }: { size?: number; className?: string }) {
  const items = [
    { label: "Email", href: `mailto:${profile.emails.personal}`, icon: <MailIcon size={size} /> },
    { label: "GitHub", href: profile.github, icon: <GitHubIcon size={size} />, external: true },
    { label: "CV (PDF)", href: asset(profile.cvPath), icon: <FileIcon size={size} />, external: true },
  ];
  return (
    <ul className={cn("flex items-center gap-4", className)}>
      {items.map((i) => (
        <li key={i.label}>
          <a
            href={i.href}
            aria-label={i.label}
            title={i.label}
            {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-fg transition-colors hover:text-accent"
          >
            {i.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
