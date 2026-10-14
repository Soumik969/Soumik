/* eslint-disable @next/next/no-img-element -- static export: plain <img> keeps the base path handling simple */
import { profile } from "@/content/profile";
import { asset } from "@/lib/site";

/** Portrait photo (or initials until a photo is added) with contact lines below it. */
export function Profile() {
  return (
    <aside aria-label="Profile" className="mx-auto mb-6 w-full max-w-[260px] sm:float-right sm:mb-4 sm:ml-8 sm:w-[30%] sm:max-w-none">
      {profile.photo ? (
        <img
          src={asset(profile.photo)}
          alt={profile.name}
          width={591}
          height={788}
          className="aspect-[3/4] w-full rounded-lg object-cover shadow-[0_2px_5px_0_rgb(0_0_0/0.16),0_2px_10px_0_rgb(0_0_0/0.12)] dark:ring-1 dark:ring-white/10"
        />
      ) : (
        <div
          role="img"
          aria-label={`${profile.name} (initials)`}
          className="flex aspect-square w-full items-center justify-center rounded-full bg-tint text-[clamp(3rem,9vw,5.5rem)] font-light tracking-tight text-accent shadow-[0_2px_5px_0_rgb(0_0_0/0.08),0_2px_10px_0_rgb(0_0_0/0.06)]"
        >
          SS
        </div>
      )}
      <div className="mt-4 space-y-1 text-center font-mono text-[0.8rem] leading-relaxed text-muted">
        <p>Engineering Physics</p>
        <p>IIT Bombay, Mumbai</p>
        <p>
          <a href={`mailto:${profile.emails.academic}`} className="link break-all">
            {profile.emails.academic}
          </a>
        </p>
      </div>
    </aside>
  );
}
