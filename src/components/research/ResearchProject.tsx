"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { Chip, StatusDot } from "@/components/ui/Chip";
import { Figure } from "@/components/ui/Figure";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import type { ResearchMode, ResearchProject as Project } from "@/content/research";

const modeTone: Record<ResearchMode, "lime" | "violet" | "cyan"> = {
  Experiment: "lime",
  Theory: "violet",
  Computation: "cyan",
};

type Props = {
  project: Project;
  figureLabel: string;
  signature?: boolean;
  flip?: boolean;
  children: ReactNode;
};

/**
 * One layered atlas plate: a back sheet, a text plate and a floating figure.
 * On fine pointers the layers drift by different amounts with the cursor.
 */
export function ResearchProject({ project: p, figureLabel, signature, flip, children }: Props) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const backX = useTransform(sx, (v) => v * -10);
  const backY = useTransform(sy, (v) => v * -10);
  const figX = useTransform(sx, (v) => v * 6);
  const figY = useTransform(sy, (v) => v * 6);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!fine || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      id={p.id}
      aria-labelledby={`${p.id}-title`}
      className="relative scroll-mt-24"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* back sheet */}
      <motion.div aria-hidden className="absolute inset-0 hidden translate-x-3 translate-y-3 border border-line/70 lg:block" style={{ x: backX, y: backY }} />

      <div className="plate relative grid grid-cols-1 lg:grid-cols-12">
        {/* text plate */}
        <div className={cn("flex flex-col border-line p-5 sm:p-7 lg:col-span-5", flip ? "lg:order-2 lg:border-l" : "lg:border-r")}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.78rem] tracking-[0.14em] text-cyan">{p.code}</span>
            {p.modes.map((m) => (
              <Chip key={m} tone={modeTone[m]}>
                {m.toUpperCase()}
              </Chip>
            ))}
            {signature && <Chip tone="cyan">◆ INTERACTIVE</Chip>}
            <span className={cn("label-sm ml-auto flex items-center gap-2", p.status === "active" ? "text-lime" : "text-fog")}>
              <StatusDot tone={p.status === "active" ? "lime" : "fog"} pulse={p.status === "active"} />
              {p.status === "active" ? "Active" : "Completed"}
            </span>
          </div>

          <h3 id={`${p.id}-title`} className="display mt-6 text-[2rem] leading-[1.02] text-balance text-paper sm:text-[2.4rem]">
            {p.title}
          </h3>

          <dl className="mt-6 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2 border-y border-line py-4 text-[0.86rem]">
            <dt className="label-sm pt-0.5 text-fog">Dates</dt>
            <dd className="font-mono text-[0.78rem] text-paper">{p.dates}</dd>
            {p.supervisors.length > 0 && (
              <>
                <dt className="label-sm pt-0.5 text-fog">{p.supervisors.length > 1 ? "Supervisors" : "Supervisor"}</dt>
                <dd className="text-paper">{p.supervisors.join(" · ")}</dd>
              </>
            )}
            {p.role && (
              <>
                <dt className="label-sm pt-0.5 text-fog">Type</dt>
                <dd className="text-paper">{p.role}</dd>
              </>
            )}
            <dt className="label-sm pt-0.5 text-fog">Institution</dt>
            <dd className="text-mist">{p.institution}</dd>
            {p.note && (
              <>
                <dt className="label-sm pt-0.5 text-fog">Status</dt>
                <dd className="font-mono text-[0.75rem] tracking-wide text-amber uppercase">{p.note}</dd>
              </>
            )}
          </dl>

          <p className="mt-5 leading-relaxed text-pretty text-mist">{p.summary}</p>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Keywords">
            {p.keywords.map((k) => (
              <li key={k}>
                <Chip>{k}</Chip>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => setOpen((o) => !o)}
              className="label-sm group flex w-full items-center justify-between border-t border-line pt-4 text-paper transition-colors hover:text-cyan"
            >
              <span>
                {open ? "Collapse" : "Expand"} protocol · {p.details.length} entries
              </span>
              <span className="flex h-6 w-6 items-center justify-center border border-line-strong group-hover:border-cyan">
                {open ? <Minus size={12} aria-hidden /> : <Plus size={12} aria-hidden />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={detailsId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ol className="mt-4 space-y-3">
                    {p.details.map((d, i) => (
                      <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 text-[0.9rem] leading-relaxed text-mist">
                        <span className="font-mono text-[0.7rem] text-cyan">{String(i + 1).padStart(2, "0")}</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
            {p.links && p.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-sm inline-flex items-center gap-1.5 border border-line-strong px-3 py-2 text-mist transition-colors hover:border-cyan hover:text-cyan"
                  >
                    {l.label} <ArrowUpRight size={11} aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* figure layer */}
        <div className={cn("p-3 sm:p-5 lg:col-span-7", flip && "lg:order-1")}>
          <motion.div style={{ x: figX, y: figY }} className="h-full">
            <Figure label={figureLabel} caption={p.figure} kind={signature ? "Interactive · conceptual" : "Schematic"} className="h-full">
              {children}
            </Figure>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
