"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { type DomainId, type Tool, domains, toolGroups, tools } from "@/content/skills";

const NODES: Record<DomainId, { x: number; y: number; abbr: string; color: string }> = {
  physics: { x: 180, y: 52, abbr: "PHY", color: "#ece6da" },
  experiment: { x: 62, y: 190, abbr: "EXP", color: "#bdf264" },
  theory: { x: 180, y: 190, abbr: "THY", color: "#ab8dff" },
  computation: { x: 298, y: 190, abbr: "CMP", color: "#74e4ff" },
  tools: { x: 180, y: 328, abbr: "SW", color: "#f3c46b" },
};

const EDGES: [DomainId, DomainId][] = [
  ["physics", "experiment"],
  ["physics", "theory"],
  ["physics", "computation"],
  ["experiment", "tools"],
  ["theory", "tools"],
  ["computation", "tools"],
];

const groupColor: Record<Tool["group"], string> = {
  language: "border-t-amber",
  library: "border-t-cyan",
  instrument: "border-t-lime",
};

export function SkillGraph() {
  const [domain, setDomain] = useState<DomainId>("physics");
  const [hoverTool, setHoverTool] = useState<Tool | null>(null);
  const reduced = usePrefersReducedMotion();
  const meta = domains.find((d) => d.id === domain)!;

  const toolInDomain = (t: Tool) => domain === "physics" || t.domains.includes(domain as Exclude<DomainId, "physics">);
  const nodeLit = (id: DomainId) => {
    if (hoverTool) return id === "physics" || hoverTool.domains.includes(id as Exclude<DomainId, "physics">);
    return domain === "physics" || id === domain || id === "physics";
  };
  const edgeLit = ([a, b]: [DomainId, DomainId]) => nodeLit(a) && nodeLit(b);

  return (
    <section id="toolkit" aria-labelledby="toolkit-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="toolkit-title"
          index="04"
          label="Computation"
          meta={`${tools.length} tools · 3 groups`}
          title={
            <>
              Computational <em className="text-cyan">toolkit</em>
            </>
          }
          lede="Not a list of percentages — a map of how the tools connect. Select a domain to light up what it uses; hover a tool to see where it sits."
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="plate brackets p-4 sm:p-6">
              <svg
                viewBox="0 0 360 380"
                className="mx-auto block w-full max-w-[420px]"
                role="group"
                aria-label="Skill graph: physics branches into experiment, theory and computation, which converge on tools and software"
              >
                {EDGES.map((e) => {
                  const a = NODES[e[0]];
                  const b = NODES[e[1]];
                  const lit = edgeLit(e);
                  return (
                    <g key={e.join("-")}>
                      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgb(150 172 214 / 0.2)" />
                      {lit && (
                        <line
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          stroke={NODES[e[1]].color}
                          strokeOpacity={0.8}
                          className={reduced ? undefined : "flow-dash"}
                        />
                      )}
                    </g>
                  );
                })}
                {domains.map((d) => {
                  const n = NODES[d.id];
                  const lit = nodeLit(d.id);
                  const selected = domain === d.id;
                  return (
                    <g
                      key={d.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected}
                      aria-label={`${d.label}: ${d.caption}`}
                      onClick={() => setDomain(d.id)}
                      onMouseEnter={() => setDomain(d.id)}
                      onFocus={() => setDomain(d.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setDomain(d.id);
                        }
                      }}
                      style={{ cursor: "pointer", outline: "none" }}
                      opacity={lit ? 1 : 0.35}
                    >
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={selected ? 40 : 34}
                        fill="none"
                        stroke={n.color}
                        strokeOpacity={selected ? 0.35 : 0}
                        style={{ transition: "all .4s" }}
                      />
                      <circle cx={n.x} cy={n.y} r={30} fill="#090e19" stroke={n.color} strokeOpacity={selected ? 1 : 0.6} />
                      <text x={n.x} y={n.y + 4} textAnchor="middle" className="font-mono" fontSize={11} letterSpacing={1.5} fill={n.color}>
                        {n.abbr}
                      </text>
                      <text
                        x={n.x}
                        y={n.y + (d.id === "physics" ? -40 : 48)}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={9}
                        letterSpacing={1.5}
                        fill="#8e9bb4"
                      >
                        {d.label.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="mt-4 min-h-[8.5rem] border-t border-line pt-4" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div key={domain} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <p className="label-sm" style={{ color: NODES[domain].color }}>
                      {meta.label}
                    </p>
                    <p className="mt-2 text-[0.9rem] text-mist">{meta.caption}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {meta.methods.map((m) => (
                        <li key={m}>
                          <Chip>{m}</Chip>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="label-sm text-fog">Table of tools · from the CV</p>
              <ul className="flex flex-wrap gap-4">
                {(Object.keys(toolGroups) as Tool["group"][]).map((g) => (
                  <li key={g} className="label-sm flex items-center gap-2 text-fog">
                    <span className={cn("h-0.5 w-4", g === "language" ? "bg-amber" : g === "library" ? "bg-cyan" : "bg-lime")} />
                    {toolGroups[g]}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 xl:grid-cols-7" onMouseLeave={() => setHoverTool(null)}>
              {tools.map((t, i) => {
                const on = hoverTool ? hoverTool === t : toolInDomain(t);
                return (
                  <li key={t.name}>
                    <button
                      type="button"
                      onMouseEnter={() => setHoverTool(t)}
                      onFocus={() => setHoverTool(t)}
                      onBlur={() => setHoverTool(null)}
                      aria-label={`${t.name} — ${toolGroups[t.group]}; used in ${t.domains.join(", ")}`}
                      className={cn(
                        "relative flex aspect-square w-full flex-col justify-between border border-t-2 bg-ink-850/80 p-2 text-left transition-all duration-300",
                        groupColor[t.group],
                        on ? "border-x-line-strong border-b-line-strong opacity-100" : "border-x-line border-b-line opacity-30",
                        hoverTool === t && "-translate-y-1 bg-ink-700",
                      )}
                    >
                      <span className="font-mono text-[0.55rem] text-fog">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display text-[1.7rem] leading-none text-paper">{t.symbol}</span>
                      <span className="truncate font-mono text-[0.55rem] tracking-wide text-mist">{t.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 min-h-[1.5em] font-mono text-[0.72rem] text-mist" aria-live="polite">
              {hoverTool ? (
                <>
                  <span className="text-paper">{hoverTool.name}</span> · {toolGroups[hoverTool.group]} · used in {hoverTool.domains.join(" / ")}
                </>
              ) : (
                <span className="text-fog">Hover a tile to trace it back through the graph.</span>
              )}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
