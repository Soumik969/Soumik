"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";
import { sections } from "@/content/sections";

const ids = sections.map((s) => s.id);

/** Right-edge depth gauge: one tick per section, a marker, and a z readout. */
export function DepthRail() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const active = useActiveSection(ids);
  const zRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (zRef.current) zRef.current.textContent = v.toFixed(2);
  });

  return (
    <nav aria-label="Section depth" className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative flex h-[56vh] flex-col items-end justify-between">
        <span aria-hidden className="absolute top-0 right-[3px] bottom-0 w-px bg-line-strong" />
        <motion.span aria-hidden className="absolute top-0 right-[3px] w-px origin-top bg-cyan" style={{ height: "100%", scaleY: progress }} />
        {sections.map((s) => {
          const on = s.id === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group relative flex items-center gap-3"
              aria-label={`${s.index} ${s.title}`}
              aria-current={on ? "location" : undefined}
            >
              <span
                className={cn(
                  "label-sm pointer-events-none translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  on ? "text-cyan" : "text-mist",
                )}
              >
                {s.label}
              </span>
              <span
                className={cn(
                  "relative block h-[7px] w-[7px] rotate-45 border transition-all duration-500",
                  on ? "border-cyan bg-cyan shadow-[0_0_10px_rgb(116_228_255/0.7)]" : "border-fog bg-ink-950 group-hover:border-paper",
                )}
              />
            </a>
          );
        })}
      </div>
      <div className="label-sm mt-4 text-right text-fog" aria-hidden>
        z{" "}
        <span ref={zRef} className="text-mist tabular-nums">
          0.00
        </span>
      </div>
    </nav>
  );
}
