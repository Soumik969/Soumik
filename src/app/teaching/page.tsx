import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { teaching } from "@/content/teaching";

export const metadata: Metadata = {
  title: "Teaching",
  description: "Teaching and mentorship by Soumik Sahoo.",
  alternates: { canonical: "teaching/" },
};

export default function Teaching() {
  return (
    <>
      <PageHeader title="Teaching" description="Teaching assistantships and mentorship." />
      <ul className="divide-y divide-divider border-y border-divider">
        {teaching.map((t) => (
          <li key={t.course} className="py-5">
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <h2 className="text-[1.15rem] font-medium">
                {t.course}
                <span className="font-normal text-muted"> — {t.role}</span>
              </h2>
              <p className="shrink-0 text-sm text-muted">{t.dates}</p>
            </div>
            <p className="mt-2">{t.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
