import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { photoPlaces } from "@/content/photos";

export const metadata: Metadata = {
  title: "Food",
  description: "Home-cooked meals by Soumik Sahoo, mostly cooked in Luxembourg.",
  alternates: { canonical: "food/" },
};

const food = photoPlaces.filter((p) => p.slug === "food");

export default function Food() {
  return (
    <>
      <PageHeader title="Food" description="My cooking, mostly: a few months of dal, rotis, omelettes and experiments." />
      <PhotoGallery groups={food} headings={false} />

      <p className="mt-12">
        <Link href="/travels/" className="link inline-flex items-center gap-2">
          <ArrowLeftIcon size={16} /> Travels
        </Link>
      </p>
    </>
  );
}
