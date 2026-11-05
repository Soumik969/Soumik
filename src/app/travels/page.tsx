import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { photoPlaces } from "@/content/photos";

export const metadata: Metadata = {
  title: "Travels",
  description: "Travel photos by Soumik Sahoo from a summer in Europe (Luxembourg, Belgium, France, Germany and Switzerland) and a day in Istanbul.",
  alternates: { canonical: "travels/" },
};

const places = photoPlaces.filter((p) => p.slug !== "food");
const groups = places.map((p) => ({ ...p, meta: `${p.country} · ${p.date} · ${p.photos.length} photos` }));

export default function Travels() {
  return (
    <>
      <PageHeader title="Travels" />
      <nav aria-label="Places" className="-mt-2 mb-2">
        <ul className="flex flex-wrap gap-2 text-sm">
          {places.map((p) => (
            <li key={p.slug}>
              <a
                href={`#${p.slug}`}
                className="inline-block rounded-full border border-divider px-3 py-1 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <PhotoGallery groups={groups} />

      <p className="mt-14 text-center text-muted">
        Want to see my cooking skills?{" "}
        <Link href="/food/" className="link inline-flex items-center gap-1.5">
          Let’s have a look <ArrowRightIcon size={14} />
        </Link>
      </p>

      <p className="mt-12">
        <Link href="/photos/" className="link inline-flex items-center gap-2">
          <ArrowLeftIcon size={16} /> Favourite photos
        </Link>
      </p>
    </>
  );
}
