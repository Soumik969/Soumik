"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { type Lane, lanes, timeline } from "@/content/timeline";

const laneColor: Record<Lane, string> = {
  experiment: "#bdf264",
  theory: "#ab8dff",
  computation: "#74e4ff",
  teaching: "#f3c46b",
};

const LANE_GAP = 16;
const laneX = (i: number) => 10 + i * LANE_GAP;

/**
 * Research trajectory drawn as a worldline diagram: four parallel theme lanes
 * that fill as you scroll, with each CV entry as a node on the lanes it touches.
 */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 65%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="timeline-title"
          index="06"
          label="Trajectory"
          meta="2023 → 2027"
          title={
            <>
              Research <em className="text-cyan">trajectory</em>
            </>
          }
          lede="Four lanes — experiment, theory, computation, teaching — run in parallel. Each node is an entry from the CV, placed on the lanes it touches."
        />

        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
          {lanes.map((l) => (
            <span key={l.id} className="label-sm flex items-center gap-2 text-mist">
              <span className="h-3 w-px" style={{ background: laneColor[l.id] }} />
              {l.label}
            </span>
          ))}
          <span className="label-sm flex items-center gap-2 text-mist">
            <span className="h-2 w-2 rotate-45 border border-paper" /> Milestone
          </span>
        </div>

        <div ref={ref} className="relative">
          {/* lanes */}
          <div aria-hidden className="pointer-events-none absolute top-0 bottom-0 left-0 w-[76px]">
            {lanes.map((l, i) => (
              <div key={l.id} className="absolute top-0 bottom-0" style={{ left: laneX(i) }}>
                <span className="absolute inset-y-0 w-px bg-line" />
                <motion.span className="absolute inset-x-0 top-0 h-full w-px origin-top" style={{ scaleY: fill, background: laneColor[l.id], opacity: 0.75 }} />
              </div>
            ))}
          </div>

          <ol className="relative">
            {timeline.map((y) => (
              <li key={y.year} className="pb-6">
                <div className="flex items-baseline gap-5 pt-6 pb-4 pl-[88px]">
                  <motion.h3
                    className="display text-5xl text-paper md:text-6xl"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                  >
                    {y.year}
                  </motion.h3>
                  <span className="label-sm min-w-0 text-fog">{y.theme}</span>
                </div>
                <ol className="space-y-3">
                  {y.entries.map((e) => {
                    const Tag = e.href ? "a" : "div";
                    return (
                      <motion.li
                        key={e.title}
                        className="relative pl-[88px]"
                        initial="off"
                        whileInView="on"
                        viewport={{ once: true, amount: 0.35, margin: "0px 0px -10% 0px" }}
                      >
                        {/* nodes */}
                        <div aria-hidden className="absolute top-5 left-0 h-3 w-[76px]">
                          {e.milestone || e.lanes.length === 0 ? (
                            <motion.span
                              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border border-paper bg-ink-950"
                              style={{ left: laneX(0) - 6 + (LANE_GAP * 3) / 2 }}
                              variants={{ off: { scale: 0.3, opacity: 0.3 }, on: { scale: 1, opacity: 1, backgroundColor: "#ece6da" } }}
                              transition={{ duration: 0.6 }}
                            />
                          ) : (
                            <>
                              {e.lanes.length > 1 && (
                                <span
                                  className="absolute top-1/2 h-px bg-paper/30"
                                  style={{
                                    left: laneX(lanes.findIndex((l) => l.id === e.lanes[0])),
                                    width:
                                      (lanes.findIndex((l) => l.id === e.lanes[e.lanes.length - 1]) - lanes.findIndex((l) => l.id === e.lanes[0])) * LANE_GAP,
                                  }}
                                />
                              )}
                              {e.lanes.map((ln) => {
                                const idx = lanes.findIndex((l) => l.id === ln);
                                return (
                                  <motion.span
                                    key={ln}
                                    className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                                    style={{ left: laneX(idx), borderColor: laneColor[ln] }}
                                    variants={{
                                      off: { scale: 0.4, backgroundColor: "rgba(3,5,10,1)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
                                      on: { scale: 1, backgroundColor: laneColor[ln], boxShadow: `0 0 12px ${laneColor[ln]}` },
                                    }}
                                    transition={{ duration: 0.6 }}
                                  />
                                );
                              })}
                            </>
                          )}
                        </div>

                        <motion.div
                          variants={{ off: { opacity: 0, x: 24 }, on: { opacity: 1, x: 0 } }}
                          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Tag
                            {...(e.href ? { href: e.href } : {})}
                            className={cn(
                              "group grid gap-1 border border-line bg-ink-900/70 px-4 py-3 transition-colors sm:grid-cols-[9.5rem_1fr_auto] sm:gap-5",
                              e.href && "hover:border-line-strong hover:bg-ink-800/80",
                              e.milestone && "border-paper/25",
                            )}
                          >
                            <span className="font-mono text-[0.72rem] text-cyan sm:pt-0.5">{e.when}</span>
                            <span>
                              <span className="block text-[0.98rem] text-paper">{e.title}</span>
                              <span className="mt-1 block text-[0.86rem] leading-relaxed text-mist">{e.detail}</span>
                            </span>
                            {e.href && <ArrowUpRight size={14} aria-hidden className="hidden text-fog transition-colors group-hover:text-cyan sm:block" />}
                          </Tag>
                        </motion.div>
                      </motion.li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
