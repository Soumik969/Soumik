"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { teaching } from "@/content/teaching";

/** Render `_x` and `_{xy}` as subscripts. */
function Equation({ text }: { text: string }) {
  return (
    <>
      {text.split(/(_\{[^}]*\}|_[A-Za-z0-9])/).map((part, i) =>
        part.startsWith("_") ? (
          <sub key={i} className="text-[0.55em]">
            {part.replace(/^_\{?|\}$/g, "")}
          </sub>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Chalkboard panel: standard textbook relations are "written" as it scrolls in. */
export function TeachingSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="teaching" aria-labelledby="teaching-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="teaching-title"
          index="05"
          label="Teaching"
          meta="Mentorship · positions of responsibility"
          title={
            <>
              Teaching <span className="text-fog">/</span> <em className="text-amber">mentorship</em>
            </>
          }
          lede="Explaining physics is part of doing it. Tutorials, lab sessions and a summer of quantum computing."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Chalkboard */}
          <Reveal className="lg:col-span-7">
            <div
              className="relative overflow-hidden border border-[#2a3a33] p-6 shadow-[inset_0_0_120px_rgb(0_0_0/0.6)] sm:p-10"
              style={{ background: "radial-gradient(120% 100% at 30% 20%, #13201b 0%, #0b1310 60%, #080e0c 100%)" }}
            >
              <div className="layer-noise pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden />
              <div className="relative flex items-center justify-between">
                <span className="label-sm text-[#9fb5a8]">Board 05</span>
                <span className="label-sm text-[#6f857a]">standard textbook relations</span>
              </div>

              <div className="relative mt-8 space-y-8">
                {teaching.map((t, gi) => (
                  <motion.div
                    key={t.id}
                    initial="hidden"
                    whileInView="shown"
                    viewport={{ once: true, amount: 0.5 }}
                    className={cn("transition-opacity duration-500", active && active !== t.id ? "opacity-25" : "opacity-100")}
                  >
                    <p className="font-mono text-[0.66rem] tracking-[0.14em] text-[#7f978a] uppercase">{t.course}</p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-10 gap-y-3">
                      {t.board.map((b, i) => (
                        <motion.div
                          key={b.eq}
                          variants={{ hidden: { clipPath: "inset(-20% 100% -20% 0%)" }, shown: { clipPath: "inset(-20% -12% -20% 0%)" } }}
                          transition={{ duration: 1.4, delay: gi * 0.35 + i * 0.6, ease: [0.65, 0, 0.35, 1] }}
                        >
                          <p
                            className="display text-[1.7rem] text-[#eef2ea] italic sm:text-[2.2rem]"
                            style={{ textShadow: "0 0 1px rgb(238 242 234 / 0.6), 0 0 18px rgb(238 242 234 / 0.08)" }}
                          >
                            <Equation text={b.eq} />
                          </p>
                          <p className="mt-1 font-mono text-[0.6rem] tracking-[0.12em] text-[#6f857a] uppercase">— {b.note}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* chalk tray */}
              <div className="relative mt-10 flex items-end gap-3 border-t border-[#2a3a33] pt-3" aria-hidden>
                <span className="h-1.5 w-10 rounded-sm bg-[#e9ece4]/80" />
                <span className="h-1.5 w-6 rounded-sm bg-[#e9ece4]/50" />
                <span className="h-1.5 w-8 rounded-sm bg-[#bdf264]/50" />
              </div>
            </div>
          </Reveal>

          {/* Roles */}
          <ol className="flex flex-col gap-4 lg:col-span-5">
            {teaching.map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setActive(t.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(t.id)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                className={cn("plate group grid grid-cols-[1fr_auto] gap-4 p-5 transition-colors duration-300", active === t.id && "border-amber/50")}
              >
                <div>
                  <p className="label-sm text-amber">{t.role}</p>
                  <h3 className="mt-2 text-lg leading-snug text-paper">{t.course}</h3>
                  <p className="mt-1 font-mono text-[0.72rem] text-fog">{t.dates}</p>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-mist">{t.text}</p>
                </div>
                <div className="text-right">
                  <p className="display text-5xl text-paper tabular-nums">{t.count}</p>
                  <p className="label-sm mt-1 text-fog">{t.audience}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
