"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { LazyMount, MountPlaceholder } from "@/components/ui/LazyMount";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { asset, isExternal } from "@/lib/site";
import { courseProjects } from "@/content/courseProjects";

const TheoryVisual = dynamic(() => import("@/components/theory/TheoryVisual"), {
  ssr: false,
  loading: () => <MountPlaceholder height="100%" label="Loading figure" />,
});

export function TheoreticalLab() {
  return (
    <section id="theory" aria-labelledby="theory-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="theory-title"
          index="03"
          label="Theory"
          meta={`${courseProjects.length} course projects`}
          title={
            <>
              Theoretical <em className="text-violet">lab</em>
            </>
          }
          lede="Course projects that became small research problems — from Majorana end modes to chaos, chiral tunnelling and physics-informed networks. Each figure is a simplified illustration of the system studied."
        />

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courseProjects.map((p, i) => {
            const wide = i === 0;
            return (
              <motion.li
                key={p.id}
                id={p.id}
                className={cn("scroll-mt-24", wide && "md:col-span-2")}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <article className={cn("plate group flex h-full flex-col transition-colors duration-500 hover:border-line-strong", wide && "md:flex-row")}>
                  <div className={cn("relative border-b border-line bg-ink-950/50", wide ? "md:flex md:w-1/2 md:items-center md:border-r md:border-b-0" : "")}>
                    <LazyMount minHeight={170} className={cn("h-[170px] w-full", wide && "md:h-[260px]")} label="Loading figure">
                      <TheoryVisual kind={p.visual} />
                    </LazyMount>
                    <span className="label-sm absolute top-2 right-2 text-fog">{p.course}</span>
                  </div>
                  <div className={cn("flex flex-1 flex-col p-5", wide && "md:p-7")}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[0.72rem] text-cyan">{p.course}</span>
                      <span className="label-sm text-fog">{p.dates}</span>
                    </div>
                    <h3 className={cn("display mt-4 text-paper", wide ? "text-[2.1rem]" : "text-[1.65rem] leading-[1.05]")}>{p.title}</h3>
                    <p className="mt-2 text-[0.82rem] text-mist">
                      {p.professor} <span className="text-fog">· {p.department}</span>
                    </p>
                    <p className="mt-4 text-[0.9rem] leading-relaxed text-pretty text-mist">{p.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
                      {p.tags.map((t) => (
                        <li key={t}>
                          <Chip>{t}</Chip>
                        </li>
                      ))}
                    </ul>
                    {p.link && (
                      <a
                        href={isExternal(p.link.href) ? p.link.href : asset(p.link.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-sm mt-auto inline-flex w-fit items-center gap-1.5 pt-5 text-mist transition-colors hover:text-cyan"
                      >
                        {p.link.label} <ArrowUpRight size={11} aria-hidden />
                      </a>
                    )}
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
