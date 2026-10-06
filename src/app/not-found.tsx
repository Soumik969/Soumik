import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundLayers } from "@/components/layout/BackgroundLayers";

export const metadata: Metadata = {
  title: "404 — State not found · SOUMIK969",
};

export default function NotFound() {
  return (
    <>
      <BackgroundLayers />
      <main className="relative z-10 flex min-h-[100svh] items-center">
        <div className="shell">
          <p className="label text-cyan">
            404 <span className="text-fog">/</span> Measurement returned nothing
          </p>
          <h1 className="display mt-6 text-[clamp(3.5rem,10vw,8rem)] text-paper">
            State not <em className="text-cyan">found.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-mist">
            This page has no support in the basis of this site. The wavefunction you are looking for lives elsewhere.
          </p>
          <Link
            href="/"
            className="label mt-10 inline-flex items-center gap-2 border border-line-strong px-5 py-3 text-paper transition-colors hover:border-cyan hover:text-cyan"
          >
            ← Return to |ψ₀⟩
          </Link>
        </div>
      </main>
    </>
  );
}
