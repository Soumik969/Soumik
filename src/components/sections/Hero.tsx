"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatusDot } from "@/components/ui/Chip";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/site";
import { currentFocus, profile } from "@/content/profile";

const HeroField = dynamic(() => import("@/components/hero/HeroField"), { ssr: false });

const FIELDS = ["Experimental quantum devices", "Quantum transport", "Topological systems"];
const VERBS = ["build,", "model,", "and measure"];

const ease = [0.22, 1, 0.36, 1] as const;

function FieldTicker() {
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % FIELDS.length), 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] tracking-[0.16em] uppercase sm:text-[0.76rem]">
      {FIELDS.map((f, k) => (
        <span key={f} className="flex items-center gap-3">
          <span className={cn("transition-colors duration-700", k === i ? "text-cyan" : "text-mist")}>{f}</span>
          {k < FIELDS.length - 1 && <span className="text-violet">×</span>}
        </span>
      ))}
    </p>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fieldY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Layer 4 hero instrument: probability density on a lattice. */}
      <motion.div
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_70%,transparent)] md:[mask-image:linear-gradient(to_right,transparent_8%,black_48%,black_92%,transparent),linear-gradient(to_bottom,transparent_4%,black_22%,black_80%,transparent)] md:[mask-composite:intersect]"
        style={{ y: fieldY, opacity: fieldOpacity }}
      >
        <div className="h-full w-full opacity-60 md:opacity-100">
          <HeroField />
        </div>
      </motion.div>

      {/* Calibration sweep on load. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -z-10 w-px bg-gradient-to-b from-transparent via-cyan to-transparent"
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: "100%", opacity: [0, 0.8, 0] }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.2 }}
      />

      <motion.div style={{ y: textY }} className="shell flex min-h-[100svh] flex-col pt-28 pb-8 md:pt-32">
        <motion.div
          className="flex items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="label-sm min-w-0 truncate text-fog">
            <span className="text-cyan">{profile.handle}</span> {"// research system v0.969"}
          </span>
          <span className="label-sm hidden text-fog md:inline">Fig. 00 — |ψ(x, y, t)|² on a square lattice · cursor = third source</span>
        </motion.div>

        <div className="mt-auto grid grid-cols-1 gap-12 pt-16 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <motion.p
              className="label mb-6 flex items-center gap-3 text-mist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease }}
            >
              <span className="h-px w-8 bg-cyan" aria-hidden />
              Engineering Physics <span className="text-fog">—</span> IIT Bombay
            </motion.p>

            <h1 id="hero-title" className="display text-[clamp(3.6rem,11vw,9.5rem)] text-paper">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.35, ease }}
              >
                Soumik
              </motion.span>
              <motion.span
                className="block pl-[0.9em] italic"
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.5, ease }}
              >
                Sahoo<span className="text-cyan not-italic">.</span>
              </motion.span>
            </h1>

            <p className="mt-8 max-w-2xl text-[1.35rem] leading-snug font-light text-paper sm:text-[1.7rem]">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
                I{" "}
              </motion.span>
              {VERBS.map((v, i) => (
                <motion.span
                  key={v}
                  className="inline-block pr-[0.28em]"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.16, duration: 0.7, ease }}
                >
                  <span className={cn(i === 0 && "text-lime", i === 1 && "text-violet", i === 2 && "text-cyan")}>{v}</span>
                </motion.span>
              ))}
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.7, ease }}
              >
                quantum systems.
              </motion.span>
            </p>

            <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}>
              <FieldTicker />
            </motion.div>

            <motion.div
              className="mt-10 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8, ease }}
            >
              <MagneticButton href="#research" variant="solid">
                Enter the research atlas <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton href={asset(profile.cvPath)} download>
                Download CV <ArrowDownToLine size={14} aria-hidden />
              </MagneticButton>
            </motion.div>
          </div>

          {/* Instrument readout */}
          <motion.aside
            aria-label="Summary"
            className="plate brackets lg:col-span-4"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 1, ease }}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="label-sm text-cyan">Readout</span>
              <span className="label-sm flex items-center gap-2 text-lime">
                <StatusDot /> Live
              </span>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 px-4 py-4 font-mono text-[0.72rem] tracking-[0.08em] uppercase">
              <dt className="text-fog">Institute</dt>
              <dd className="text-right text-paper">{profile.instituteShort}</dd>
              <dt className="text-fog">Programme</dt>
              <dd className="text-right text-paper">Engineering Physics</dd>
              <dt className="text-fog">CPI</dt>
              <dd className="text-right text-paper">
                <span className="text-cyan">{profile.cpi}</span> / {profile.cpiScale}
              </dd>
              <dt className="text-fog">Track</dt>
              <dd className="text-right text-paper">Honors · Physics</dd>
            </dl>
            <div className="border-t border-line px-4 py-4">
              <p className="label-sm text-fog">Currently working on</p>
              <p className="mt-2 font-mono text-[0.78rem] tracking-[0.06em] text-paper uppercase">Quantum devices + topological systems</p>
              <ul className="mt-4 space-y-2">
                {currentFocus.map((c) => (
                  <li key={c.channel}>
                    <a href={`#${c.anchor}`} className="group flex items-center gap-3 text-[0.8rem] text-mist transition-colors hover:text-paper">
                      <StatusDot pulse={false} />
                      <span className="label-sm text-fog">{c.channel}</span>
                      <span className="min-w-0 truncate">{c.label}</span>
                      <span className="label-sm ml-auto shrink-0 text-fog group-hover:text-cyan">{c.where}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>

        <motion.a
          href="#about"
          className="group mt-12 flex w-fit items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          aria-label="Scroll to research identity"
        >
          <span className="relative block h-12 w-px overflow-hidden bg-line-strong">
            <span className="animate-scan absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-transparent to-cyan" />
          </span>
          <span className="label-sm text-fog transition-colors group-hover:text-cyan">Scroll · z-axis</span>
        </motion.a>
      </motion.div>
    </section>
  );
}
