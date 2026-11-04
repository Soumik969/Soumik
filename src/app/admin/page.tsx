import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Blog admin",
  robots: { index: false, follow: false },
};

export default function Admin() {
  return (
    <>
      <PageHeader title="Blog admin" description="Write and edit posts. Only you can use this: it needs your GitHub access token." />
      <AdminApp />
    </>
  );
}
