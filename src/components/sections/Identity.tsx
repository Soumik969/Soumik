"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { profile, programmes } from "@/content/profile";
import { researchProjects } from "@/content/research";
import { courseProjects } from "@/content/courseProjects";

type Plane = {
  id: "experiment" | "theory" | "computation";
  label: string;
  tone: string;
  topics: { name: string; refs: string[] }[];
};

/* Each topic points to the CV projects that involve it. */
const PLANES: Plane[] = [
  {
    id: "experiment",
    label: "Experiment",
    tone: "lime",
    topics: [
      { name: "Quantum-dot devices", refs: ["r-quantum-dots"] },
      { name: "Charge sensing", refs: ["r-quantum-dots"] },
      { name: "RF reflectometry", refs: ["r-quantum-dots"] },
      { name: "Pulsed control · T₁", refs: ["r-quantum-dots"] },
      { name: "Cryogenics · mK", refs: ["r-quantum-dots"] },
    ],
  },
  {
    id: "theory",
    label: "Theory",
    tone: "violet",
    topics: [
      { name: "Topology", refs: ["r-mti", "r-non-hermitian", "r-free-fermions", "c-kitaev"] },
      { name: "Superconductivity", refs: ["r-mti", "c-kitaev"] },
      { name: "Non-Hermitian physics", refs: ["r-non-hermitian"] },
      { name: "Quantum transport", refs: ["r-transport", "r-negf", "c-klein"] },
      { name: "Fermionization", refs: ["r-free-fermions", "c-kitaev"] },
    ],
  },
  {
    id: "computation",
    label: "Computation",
    tone: "cyan",
    topics: [
      { name: "Tight-binding diagonalization", refs: ["r-non-hermitian", "r-mti", "c-kitaev", "r-free-fermions"] },
      { name: "NEGF + self-consistency", refs: ["r-negf"] },
      { name: "Dynamics & ODEs", refs: ["r-non-hermitian", "c-duffing", "c-orbital"] },
      { name: "Machine learning", refs: ["c-pinn", "c-voice"] },
    ],
  },
];

const titles = new Map<string, { code: string; title: string }>([
  ...researchProjects.map((p) => [p.id, { code: p.code, title: p.shortTitle }] as const),
  ...courseProjects.map((p) => [p.id, { code: p.course, title: p.title }] as const),
]);

const toneText: Record<string, string> = { lime: "text-lime", violet: "text-violet", cyan: "text-cyan" };
const toneBorder: Record<string, string> = { lime: "border-lime/60", violet: "border-violet/60", cyan: "border-cyan/60" };
const toneBg: Record<string, string> = { lime: "bg-lime/10", violet: "bg-violet/10", cyan: "bg-cyan/10" };

function Highlighted({ text }: { text: string }) {
  // The CV paragraph verbatim, with its key phrases emphasised.
  const phrases = [
    "experimental quantum devices",
    "quantum transport",
    "semiconductor spin qubits",
    "charge sensing",
    "cryogenic RF reflectometry",
    "coherent control",
    "non-Hermitian and topological quantum systems",
    "low-temperature measurements",
    "analytical and numerical modeling",
  ];
  const re = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return (
    <>
      {text.split(re).map((part, i) =>
        phrases.includes(part) ? (
          <span key={i} className="text-paper">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function Identity() {
  const [active, setActive] = useState<string | null>(null);
  const activeTopic = PLANES.flatMap((p) => p.topics.map((t) => ({ ...t, plane: p }))).find((t) => t.name === active);
  const linked = new Set(activeTopic?.refs ?? []);

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="about-title"
          index="00"
          label="Identity"
          meta="Experiment · theory · computation"
          title={
            <>
              A physicist working where <em className="text-cyan">measurement</em> meets <em className="text-violet">model</em>.
            </>
          }
        />

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label-sm mb-4 text-fog">Research interests — from the CV</p>
              <p className="text-lg leading-relaxed text-pretty text-mist md:text-[1.2rem]">
                <Highlighted text={profile.researchInterests} />
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 grid gap-px border border-line bg-line">
              {[
                ["Degree", "B.Tech, Engineering Physics · 2023–2027"],
                ["Institute", profile.institute],
                ...programmes.map((p) => [p.label, p.detail] as [string, string]),
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 bg-ink-900/90 px-4 py-3">
                  <span className="label-sm pt-0.5 text-fog">{k}</span>
                  <span className="text-[0.92rem] text-paper">{v}</span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Interactive research map */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <div className="plate brackets p-4 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="label-sm text-cyan">Map · research identity</span>
                  <span className="label-sm hidden text-fog sm:inline">Hover or focus a node</span>
                </div>

                <div className="relative">
                  {PLANES.map((plane, pi) => (
                    <div key={plane.id}>
                      <div
                        className={cn(
                          "relative border bg-ink-850/80 p-4 transition-all duration-500",
                          activeTopic?.plane.id === plane.id ? toneBorder[plane.tone] : "border-line",
                        )}
                        style={{ marginLeft: `${pi * 4}%`, marginRight: `${(2 - pi) * 4}%` }}
                      >
                        {/* offset backing sheet for depth */}
                        <span aria-hidden className="absolute inset-0 -z-10 translate-x-2 translate-y-2 border border-line/60" />
                        <div className="mb-3 flex items-center gap-3">
                          <span className={cn("label", toneText[plane.tone])}>{plane.label}</span>
                          <span className="hairline flex-1" aria-hidden />
                          <span className="label-sm text-fog">L{pi + 1}</span>
                        </div>
                        <ul className="flex flex-wrap gap-2">
                          {plane.topics.map((t) => {
                            const isActive = active === t.name;
                            const isLinked = !isActive && activeTopic && t.refs.some((r) => linked.has(r));
                            return (
                              <li key={t.name}>
                                <button
                                  type="button"
                                  onMouseEnter={() => setActive(t.name)}
                                  onMouseLeave={() => setActive(null)}
                                  onFocus={() => setActive(t.name)}
                                  onBlur={() => setActive(null)}
                                  onClick={() => setActive(isActive ? null : t.name)}
                                  aria-pressed={isActive}
                                  className={cn(
                                    "border px-3 py-1.5 text-[0.84rem] transition-all duration-300",
                                    isActive && cn(toneBorder[plane.tone], toneBg[plane.tone], "text-paper"),
                                    isLinked && "border-paper/40 text-paper",
                                    !isActive && !isLinked && (activeTopic ? "border-line text-fog" : "border-line text-mist hover:text-paper"),
                                  )}
                                >
                                  {t.name}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      {pi < PLANES.length - 1 && (
                        <div className="relative flex h-10 items-center justify-center" aria-hidden>
                          <span className="absolute inset-y-0 left-1/2 w-px bg-line-strong" />
                          <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 animate-[scan_2.6s_ease-in-out_infinite] bg-cyan" />
                          <span className="label-sm relative bg-ink-900 px-2 text-fog">{pi === 0 ? "↓ informs" : "↓ is tested by"}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 min-h-[5.5rem] border-t border-line pt-4" aria-live="polite">
                  <AnimatePresence mode="wait">
                    {activeTopic ? (
                      <motion.div
                        key={activeTopic.name}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="label-sm text-fog">
                          <span className={toneText[activeTopic.plane.tone]}>{activeTopic.name}</span> appears in
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                          {activeTopic.refs.map((r) => (
                            <li key={r}>
                              <a href={`#${r}`} className="group inline-flex items-center gap-1.5 text-[0.85rem] text-paper hover:text-cyan">
                                <span className="font-mono text-[0.7rem] text-cyan">{titles.get(r)?.code}</span>
                                {titles.get(r)?.title}
                                <ArrowDownRight size={12} aria-hidden className="opacity-50 group-hover:opacity-100" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : (
                      <motion.p key="idle" className="text-[0.88rem] text-fog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Each node links to the projects behind it. Experiment informs theory; theory is tested by computation — and the loop closes back in the
                        lab.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
