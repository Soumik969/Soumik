import type { Metadata } from "next";
import { DownloadIcon, ExternalIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { profile } from "@/content/profile";
import { asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae of Soumik Sahoo.",
  alternates: { canonical: "cv/" },
};

export default function CV() {
  const pdf = asset(profile.cvPath);

  return (
    <>
      <PageHeader title="CV" description="My curriculum vitae." />

      <div className="mb-6 flex flex-wrap gap-3">
        <a href={pdf} download className="btn btn-primary">
          <DownloadIcon size={16} /> Download PDF
        </a>
        <a href={profile.cvDriveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          View on Google Drive <ExternalIcon size={14} />
        </a>
      </div>

      {/* Inline viewer on larger screens; phones use the buttons above. */}
      <object
        data={pdf}
        type="application/pdf"
        aria-label="CV (PDF)"
        className="hidden h-[85vh] max-h-[1100px] min-h-[600px] w-full rounded-lg border border-divider md:block"
      >
        <p className="p-4">
          Your browser can’t show the PDF here.{" "}
          <a href={pdf} className="link">
            Download it instead
          </a>
          .
        </p>
      </object>
    </>
  );
}
