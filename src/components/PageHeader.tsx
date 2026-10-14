import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Page title + one-line description, as on al-folio pages. `compact` is for long titles (project pages). */
export function PageHeader({ title, description, compact = false }: { title: ReactNode; description?: ReactNode; compact?: boolean }) {
  return (
    <header className="mb-8">
      <h1
        className={cn(
          "leading-[1.15] font-light tracking-[-0.015em] text-balance",
          compact ? "text-[1.875rem] sm:text-[2.25rem]" : "text-[2.25rem] sm:text-[2.75rem]",
        )}
      >
        {title}
      </h1>
      {description && <p className="mt-3 max-w-3xl text-muted">{description}</p>}
    </header>
  );
}
