import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { highlights } from "@/content/highlights";

export const metadata: Metadata = {
  title: "Photos",
  description: "A few pictures captured by Soumik Sahoo.",
  alternates: { canonical: "photos/" },
};

export default function Photos() {
  return (
    <>
      <PageHeader title="Photos" description="A few pictures I have captured." />
      <PhotoGallery groups={[{ slug: "highlights", name: "Highlights", photos: highlights }]} headings={false} />

      <p className="mt-8 text-sm">
        <Link href="/travels/" className="link inline-flex items-center gap-1.5">
          More <ArrowRightIcon size={14} />
        </Link>
      </p>
    </>
  );
}
