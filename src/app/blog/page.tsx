import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/posts-format";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes and writing by Soumik Sahoo.",
  alternates: { canonical: "blog/" },
};

export default function Blog() {
  const posts = getPosts();

  return (
    <>
      <PageHeader title="Blog" description="Notes and writing." />
      {posts.length === 0 ? (
        <p className="text-muted">Nothing here yet. Check back soon.</p>
      ) : (
        <ul className="divide-y divide-divider border-y border-divider">
          {posts.map((p) => (
            <li key={p.slug} className="grid gap-1 py-6 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6">
              <p className="text-sm whitespace-nowrap text-muted">{formatDate(p.date)}</p>
              <div>
                <h2 className="text-[1.15rem] leading-snug font-medium">
                  <Link href={`/blog/${p.slug}/`} className="transition-colors hover:text-accent">
                    {p.title}
                  </Link>
                </h2>
                {p.summary && <p className="mt-1 text-muted">{p.summary}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
