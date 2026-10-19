import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "projects/", "cv/", "teaching/", "photos/", "travels/", "contact/", ...projects.map((p) => `projects/${p.slug}/`)];
  return pages.map((p) => ({ url: `${SITE_URL}/${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
