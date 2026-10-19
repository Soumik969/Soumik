import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { highlights, travelStats } from "@/content/highlights";

export const metadata: Metadata = {
  title: "Photos",
  description: "A few favourite photos by Soumik Sahoo from a summer in Europe and a day in Istanbul.",
  alternates: { canonical: "photos/" },
};

export default function Photos() {
  return (
    <>
      <PageHeader
        title="Photos"
        description="A few favourites from summer 2026: my research internship at the University of Luxembourg, weekend trips around Europe, and a day in Istanbul on the way home."
      />
      <PhotoGallery groups={[{ slug: "highlights", name: "Highlights", photos: highlights }]} headings={false} />

      <Link
        href="/travels/"
        className="group mt-10 flex items-center justify-between gap-6 rounded-lg border border-divider bg-card p-5 transition-[border-color,box-shadow] duration-200 hover:border-accent/50 hover:shadow-[0_10px_28px_-14px_rgb(0_0_0/0.25)] dark:hover:shadow-[0_12px_32px_-14px_rgb(63_181_220/0.28)]"
      >
        <span>
          <span className="block text-[1.1rem] leading-snug font-medium text-fg transition-colors group-hover:text-accent">More travel photos</span>
          <span className="mt-1 block text-sm text-muted">
            All {travelStats.photos} photos, place by place: {travelStats.places} places from Luxembourg to Istanbul, and the food along the way.
          </span>
        </span>
        <ArrowRightIcon size={22} className="shrink-0 text-muted transition-[color,translate] group-hover:text-accent motion-safe:group-hover:translate-x-1" />
      </Link>
    </>
  );
}
