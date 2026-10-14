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
          <li key={t.course} className="grid gap-1 py-6 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6">
            <p className="text-sm whitespace-nowrap text-muted">{t.dates}</p>
            <div>
              <h2 className="text-[1.15rem] leading-snug font-medium">{t.course}</h2>
              <p className="text-sm text-muted">{t.role}</p>
              <p className="mt-2">{t.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
