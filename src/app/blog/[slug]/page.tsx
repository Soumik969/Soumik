import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { renderMarkdown } from "@/lib/markdown";
import { getPost, getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/posts-format";

type Params = { slug: string };

/** A static export needs at least one path, so a blog with no posts still builds (the placeholder is a 404). */
const EMPTY = "_";

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  const posts = getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: EMPTY }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary || undefined,
    alternates: { canonical: `blog/${post.slug}/` },
    openGraph: { type: "article", title: post.title, description: post.summary || undefined, publishedTime: post.date },
  };
}

export default async function Post({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <article>
      <PageHeader title={post.title} description={formatDate(post.date)} compact />
      <div className="post-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
      <p className="mt-12">
        <Link href="/blog/" className="link inline-flex items-center gap-2">
          <ArrowLeftIcon size={16} /> All posts
        </Link>
      </p>
    </article>
  );
}
