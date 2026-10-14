import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { photoPlaces } from "@/content/photos";

export const metadata: Metadata = {
  title: "Photos",
  description: "Photos by Soumik Sahoo from a summer in Europe: Luxembourg, Belgium, France, Germany and Switzerland.",
  alternates: { canonical: "photos/" },
};

export default function Photos() {
  return (
    <>
      <PageHeader
        title="Photos"
        description="Summer 2026 in Europe: places I saw during my research internship at the University of Luxembourg and on weekend trips."
      />
      <nav aria-label="Places" className="-mt-2 mb-2">
        <ul className="flex flex-wrap gap-2 text-sm">
          {photoPlaces.map((p) => (
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
      <PhotoGallery places={photoPlaces} />
    </>
  );
}
