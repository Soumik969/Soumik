import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" description="Sorry, the page you were looking for doesn’t exist." />
      <p>
        <Link href="/" className="link">
          Go back to the home page
        </Link>
        .
      </p>
    </>
  );
}
