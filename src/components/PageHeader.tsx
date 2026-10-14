import type { ReactNode } from "react";

/** Page title + one-line description, as on al-folio pages. */
export function PageHeader({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="text-[2.25rem] leading-tight font-light sm:text-[2.6rem]">{title}</h1>
      {description && <p className="mt-2 text-muted">{description}</p>}
    </header>
  );
}
