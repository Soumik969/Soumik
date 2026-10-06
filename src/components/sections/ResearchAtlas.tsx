"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { ResearchProject } from "@/components/research/ResearchProject";
import { StatusDot } from "@/components/ui/Chip";
import { LazyMount, MountPlaceholder } from "@/components/ui/LazyMount";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { researchProjects } from "@/content/research";

/* Each instrument is code-split and mounted only when it approaches the viewport. */
const loading = (h: number) =>
  function Loading() {
    return <MountPlaceholder height={h} />;
  };

const visuals: Record<string, { C: ComponentType; h: number; signature?: boolean }> = {
  "r-quantum-dots": { C: dynamic(() => import("@/components/research/QuantumDotReadout"), { ssr: false, loading: loading(560) }), h: 560, signature: true },
  "r-mti": { C: dynamic(() => import("@/components/research/MTIStack"), { ssr: false, loading: loading(600) }), h: 600, signature: true },
  "r-non-hermitian": { C: dynamic(() => import("@/components/research/SkinEffectLattice"), { ssr: false, loading: loading(560) }), h: 560, signature: true },
  "r-free-fermions": { C: dynamic(() => import("@/components/research/FreeFermionChain"), { ssr: false, loading: loading(420) }), h: 420 },
  "r-transport": { C: dynamic(() => import("@/components/research/FermiSurface"), { ssr: false, loading: loading(440) }), h: 440 },
  "r-negf": { C: dynamic(() => import("@/components/research/NEGFProfile"), { ssr: false, loading: loading(420) }), h: 420 },
};

const modeColor = { Experiment: "bg-lime", Theory: "bg-violet", Computation: "bg-cyan" } as const;

export function ResearchAtlas() {
  return (
    <section id="research" aria-labelledby="research-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="research-title"
          index="01"
          label="Research"
          meta={`${researchProjects.length} entries · 3 interactive`}
          title={
            <>
              Research <em className="text-cyan">atlas</em>
            </>
          }
          lede="Each line of work is drawn as the system it studies. Entries marked ◆ are live instruments — tune a gate, flip a boundary condition, step through a derivation. Every figure is conceptual; none of it is measured data."
        />

        {/* Atlas index */}
        <Reveal className="mb-20">
          <ol className="grid border-t border-line md:grid-cols-2 xl:grid-cols-3">
            {researchProjects.map((p) => (
              <li key={p.id} className="border-b border-line md:odd:border-r xl:border-r xl:[&:nth-child(3n)]:border-r-0">
                <a href={`#${p.id}`} className="group flex h-full items-start gap-4 px-1 py-4 transition-colors hover:bg-ink-800/50 md:px-4">
                  <span className="font-mono text-[0.75rem] text-cyan">{p.code}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] text-paper group-hover:text-cyan">{p.shortTitle}</span>
                    <span className="mt-1 flex items-center gap-2">
                      {p.modes.map((m) => (
                        <span key={m} aria-label={m} title={m} className={cn("h-1.5 w-4", modeColor[m])} />
                      ))}
                      <span className="label-sm text-fog">{p.dates}</span>
                    </span>
                  </span>
                  {visuals[p.id]?.signature && (
                    <span className="label-sm text-cyan" aria-label="interactive">
                      ◆
                    </span>
                  )}
                  {p.status === "active" && <StatusDot />}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2" aria-hidden>
            {Object.entries(modeColor).map(([m, c]) => (
              <span key={m} className="label-sm flex items-center gap-2 text-fog">
                <span className={cn("h-1.5 w-4", c)} /> {m}
              </span>
            ))}
            <span className="label-sm flex items-center gap-2 text-fog">
              <StatusDot pulse={false} /> Active
            </span>
          </div>
        </Reveal>

        <div className="space-y-16 md:space-y-24">
          {researchProjects.map((p, i) => {
            const v = visuals[p.id];
            return (
              <ResearchProject key={p.id} project={p} figureLabel={`Fig. ${p.code}`} signature={v?.signature} flip={i % 2 === 1}>
                {v && (
                  <LazyMount minHeight={v.h}>
                    <v.C />
                  </LazyMount>
                )}
              </ResearchProject>
            );
          })}
        </div>
      </div>
    </section>
  );
}
