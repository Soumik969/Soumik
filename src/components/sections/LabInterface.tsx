"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { StatusDot } from "@/components/ui/Chip";
import { Segmented } from "@/components/ui/Controls";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { type LabNodeId, labChain, labNodes } from "@/content/lab";

type PathMode = "control" | "readout" | "all";

const RACK: { id: LabNodeId; y: number; screen: "pulse" | "dc" | "sine" | "num" | "trace" }[] = [
  { id: "awg", y: 86, screen: "pulse" },
  { id: "dc", y: 156, screen: "dc" },
  { id: "vna", y: 226, screen: "sine" },
  { id: "lockin", y: 296, screen: "num" },
  { id: "scope", y: 366, screen: "trace" },
];

const PLATES = [
  { label: "RT", y: 84, w: 330 },
  { label: "50 K", y: 148, w: 300 },
  { label: "4 K", y: 212, w: 270 },
  { label: "STILL", y: 276, w: 240 },
  { label: "MXC · T ≈ mK", y: 340, w: 210 },
];
const FX = 560; // fridge centre

const LINES = {
  dc: { x: 488, color: "#bdf264", path: "control" },
  awg: { x: 520, color: "#bdf264", path: "control" },
  rfIn: { x: 600, color: "#74e4ff", path: "readout" },
  rfOut: { x: 632, color: "#74e4ff", path: "readout" },
} as const;

function Screen({ kind, x, y }: { kind: string; x: number; y: number }) {
  const w = 62;
  const h = 26;
  let d = "";
  if (kind === "pulse") d = `M${x + 4} ${y + 18} h10 v-12 h14 v8 h12 v-8 h18`;
  if (kind === "sine") d = Array.from({ length: 28 }, (_, i) => `${i ? "L" : "M"}${x + 4 + i * 2} ${y + 13 + Math.sin(i / 2) * 7}`).join(" ");
  if (kind === "trace") d = `M${x + 4} ${y + 16} h16 l3 -9 l3 9 h18 l3 -9 l3 9 h10`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#03050a" stroke="rgb(150 172 214 / 0.25)" />
      {kind === "dc" && (
        <text x={x + 6} y={y + 17} className="font-mono" fontSize={10} fill="#bdf264">
          V₁ … V_n
        </text>
      )}
      {kind === "num" && (
        <text x={x + 6} y={y + 17} className="font-mono" fontSize={10} fill="#74e4ff">
          X · Y · R θ
        </text>
      )}
      {d && <path d={d} stroke={kind === "pulse" ? "#bdf264" : "#74e4ff"} fill="none" strokeWidth={1.2} />}
    </g>
  );
}

export function LabInterface() {
  const [mode, setMode] = useState<PathMode>("all");
  const [selected, setSelected] = useState<LabNodeId>("fridge");
  const [hovered, setHovered] = useState<LabNodeId | null>(null);
  const reduced = usePrefersReducedMotion();
  const focus = hovered ?? selected;
  const node = labNodes[focus];

  const showControl = mode !== "readout";
  const showReadout = mode !== "control";

  const pick = (id: LabNodeId) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-label": `${labNodes[id].label} — ${labNodes[id].tag}`,
    "aria-pressed": selected === id,
    onClick: () => setSelected(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelected(id);
      }
    },
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(id),
    onBlur: () => setHovered(null),
    style: { cursor: "pointer", outline: "none" },
  });

  const ring = (id: LabNodeId) => (focus === id ? "#ece6da" : "rgb(150 172 214 / 0.35)");

  return (
    <section id="lab" aria-labelledby="lab-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="lab-title"
          index="02"
          label="Experiment"
          meta="Measurement architecture"
          title={
            <>
              Inside the <em className="text-lime">lab</em>
            </>
          }
          lede="The chain behind the quantum-dot work: room-temperature electronics, a dilution refrigerator, a gate-defined device with its charge sensor and RF resonator, and the data that comes back. Select any element to see what it does — and what Soumik has done with it."
        />

        <Reveal>
          <div className="plate brackets overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <span className="label-sm flex items-center gap-2 text-lime">
                <StatusDot /> Measurement chain · schematic
              </span>
              <Segmented
                label="Signal path"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "control", label: "Control" },
                  { value: "readout", label: "Readout" },
                  { value: "all", label: "All" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
              {/* Desktop architecture */}
              <div className="hidden border-line md:block lg:border-r">
                <svg viewBox="0 0 1100 560" className="block w-full select-none" role="group" aria-label="Measurement architecture diagram">
                  <defs>
                    <linearGradient id="lab-fridge" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#74e4ff" stopOpacity={0.02} />
                      <stop offset="1" stopColor="#74e4ff" stopOpacity={0.12} />
                    </linearGradient>
                  </defs>

                  {/* column labels */}
                  <g className="font-mono" fontSize={11} letterSpacing={2} fill="#5f6b86">
                    <text x={30} y={40}>
                      ROOM-TEMPERATURE RACK
                    </text>
                    <text x={FX} y={40} textAnchor="middle">
                      DILUTION REFRIGERATOR
                    </text>
                    <text x={1070} y={40} textAnchor="end">
                      DATA
                    </text>
                  </g>

                  {/* rack */}
                  {RACK.map((r) => {
                    const n = labNodes[r.id];
                    const active = (n.path === "control" && showControl) || (n.path === "readout" && showReadout) || n.path === "both";
                    return (
                      <g key={r.id} {...pick(r.id)} opacity={active ? 1 : 0.35}>
                        <rect x={30} y={r.y - 22} width={270} height={56} fill="#0d1322" stroke={ring(r.id)} />
                        <text x={44} y={r.y - 2} className="font-mono" fontSize={12} fill="#ece6da">
                          {r.id === "dc" ? "DC · BREAKOUT" : r.id === "lockin" ? "LOCK-IN" : r.id === "scope" ? "OSCILLOSCOPE" : r.id.toUpperCase()}
                        </text>
                        <text
                          x={44}
                          y={r.y + 16}
                          className="font-mono"
                          fontSize={9.5}
                          letterSpacing={1}
                          fill={n.path === "control" ? "#bdf264" : n.path === "readout" ? "#74e4ff" : "#8e9bb4"}
                        >
                          {n.tag}
                        </text>
                        <Screen kind={r.screen} x={224} y={r.y - 15} />
                        {[0, 1, 2].map((k) => (
                          <circle
                            key={k}
                            cx={206 - k * 12}
                            cy={r.y + 22}
                            r={2.2}
                            fill={k === 0 && active ? (n.path === "readout" ? "#74e4ff" : "#bdf264") : "#1c263b"}
                          />
                        ))}
                      </g>
                    );
                  })}

                  {/* rack → fridge cabling */}
                  {showControl && (
                    <g fill="none" strokeWidth={1.4}>
                      <path d={`M300 ${RACK[0].y} H${LINES.awg.x} V60`} stroke="#bdf264" strokeOpacity={0.25} />
                      <path d={`M300 ${RACK[1].y} H${LINES.dc.x} V60`} stroke="#bdf264" strokeOpacity={0.25} />
                      <path d={`M300 ${RACK[0].y} H${LINES.awg.x} V60`} stroke="#bdf264" className={reduced ? undefined : "flow-dash"} />
                      <path d={`M300 ${RACK[1].y} H${LINES.dc.x} V60`} stroke="#bdf264" className={reduced ? undefined : "flow-dash"} />
                    </g>
                  )}
                  {showReadout && (
                    <g fill="none" strokeWidth={1.4}>
                      <path d={`M300 ${RACK[2].y - 8} H340 V56 H${LINES.rfIn.x} V64`} stroke="#74e4ff" strokeOpacity={0.25} />
                      <path d={`M300 ${RACK[2].y - 8} H340 V56 H${LINES.rfIn.x} V64`} stroke="#74e4ff" className={reduced ? undefined : "flow-dash"} />
                      <path d={`M${LINES.rfOut.x} 64 V50 H352 V${RACK[3].y} H300`} stroke="#74e4ff" strokeOpacity={0.25} />
                      <path d={`M${LINES.rfOut.x} 64 V50 H352 V${RACK[3].y} H300`} stroke="#74e4ff" className={reduced ? undefined : "flow-dash"} />
                      {/* lock-in → data, over the top of the cryostat */}
                      <path d={`M300 ${RACK[3].y + 10} H364 V24 H930 V96`} stroke="#74e4ff" strokeOpacity={0.25} />
                      <path d={`M300 ${RACK[3].y + 10} H364 V24 H930 V96`} stroke="#74e4ff" className={reduced ? undefined : "flow-dash"} />
                    </g>
                  )}

                  {/* fridge */}
                  <g {...pick("fridge")}>
                    <path
                      d={`M${FX - 175} 64 H${FX + 175} V380 Q${FX + 175} 530 ${FX} 530 Q${FX - 175} 530 ${FX - 175} 380 Z`}
                      fill="url(#lab-fridge)"
                      stroke={ring("fridge")}
                      strokeDasharray="4 4"
                    />
                    {PLATES.map((p, i) => (
                      <g key={p.label}>
                        <rect x={FX - p.w / 2} y={p.y} width={p.w} height={9} fill="#141c2e" stroke="rgb(150 172 214 / 0.4)" />
                        <text
                          x={FX - p.w / 2 + 6}
                          y={p.y - 6}
                          className="font-mono"
                          fontSize={10}
                          letterSpacing={1}
                          fill={i === PLATES.length - 1 ? "#74e4ff" : "#8e9bb4"}
                        >
                          {p.label}
                        </text>
                        {i < PLATES.length - 1 && (
                          <>
                            <line
                              x1={FX - p.w / 2 + 20}
                              y1={p.y + 9}
                              x2={FX - PLATES[i + 1].w / 2 + 20}
                              y2={PLATES[i + 1].y}
                              stroke="rgb(150 172 214 / 0.25)"
                            />
                            <line
                              x1={FX + p.w / 2 - 20}
                              y1={p.y + 9}
                              x2={FX + PLATES[i + 1].w / 2 - 20}
                              y2={PLATES[i + 1].y}
                              stroke="rgb(150 172 214 / 0.25)"
                            />
                          </>
                        )}
                      </g>
                    ))}
                  </g>

                  {/* lines through the cryostat */}
                  {(Object.keys(LINES) as (keyof typeof LINES)[]).map((k) => {
                    const l = LINES[k];
                    const on = l.path === "control" ? showControl : showReadout;
                    const end = k === "rfIn" || k === "rfOut" ? 452 : 420;
                    return (
                      <g key={k} opacity={on ? 1 : 0.2}>
                        <line x1={l.x} y1={64} x2={l.x} y2={end} stroke={l.color} strokeOpacity={0.25} strokeWidth={1.4} />
                        {on && (
                          <line
                            x1={l.x}
                            y1={k === "rfOut" ? end : 64}
                            x2={l.x}
                            y2={k === "rfOut" ? 64 : end}
                            stroke={l.color}
                            strokeWidth={1.4}
                            className={reduced ? undefined : "flow-dash"}
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* sample stage */}
                  <rect x={FX - 140} y={392} width={280} height={104} fill="#060912" stroke="rgb(150 172 214 / 0.35)" />
                  <text x={FX - 132} y={488} className="font-mono" fontSize={9} letterSpacing={1} fill="#5f6b86">
                    SAMPLE STAGE
                  </text>
                  <g {...pick("device")}>
                    <rect x={FX - 126} y={408} width={92} height={62} fill="#0d1322" stroke={ring("device")} />
                    <ellipse cx={FX - 80} cy={436} rx={14} ry={9} fill="#74e4ff" fillOpacity={0.25} stroke="#74e4ff" />
                    {[-98, -80, -62].map((dx) => (
                      <rect key={dx} x={FX + dx - 3} y={410} width={6} height={16} fill="#ab8dff" fillOpacity={0.5} />
                    ))}
                    <text x={FX - 80} y={464} textAnchor="middle" className="font-mono" fontSize={8.5} fill="#ece6da">
                      QUANTUM DOT
                    </text>
                  </g>
                  <g {...pick("sensor")}>
                    <rect x={FX - 28} y={408} width={74} height={62} fill="#0d1322" stroke={ring("sensor")} />
                    <ellipse cx={FX + 9} cy={436} rx={11} ry={7} fill="#ece6da" fillOpacity={0.2} stroke="#ece6da" strokeOpacity={0.7} />
                    <line x1={FX - 26} y1={436} x2={FX - 2} y2={436} stroke="#ece6da" strokeOpacity={0.4} />
                    <line x1={FX + 20} y1={436} x2={FX + 44} y2={436} stroke="#ece6da" strokeOpacity={0.4} />
                    <text x={FX + 9} y={464} textAnchor="middle" className="font-mono" fontSize={8.5} fill="#ece6da">
                      SENSOR
                    </text>
                  </g>
                  <g {...pick("resonator")}>
                    <rect x={FX + 52} y={408} width={76} height={62} fill="#0d1322" stroke={ring("resonator")} />
                    <path
                      d={`M${FX + 60} 432 q4 -8 8 0 q4 -8 8 0 q4 -8 8 0 q4 -8 8 0 M${FX + 96} 432 h8 v8 M${FX + 96} 440 h16 M${FX + 96} 445 h16`}
                      stroke="#74e4ff"
                      fill="none"
                    />
                    <text x={FX + 90} y={464} textAnchor="middle" className="font-mono" fontSize={8.5} fill="#ece6da">
                      RF RESONATOR
                    </text>
                  </g>
                  {/* on-chip links */}
                  <line x1={FX - 34} y1={436} x2={FX - 28} y2={436} stroke="#ece6da" strokeOpacity={0.5} strokeDasharray="1 2" />
                  <line x1={FX + 46} y1={436} x2={FX + 52} y2={436} stroke="#ece6da" strokeOpacity={0.5} />

                  {/* labels on lines */}
                  <g className="font-mono" fontSize={9} letterSpacing={1}>
                    <text x={LINES.dc.x - 6} y={378} textAnchor="end" fill="#bdf264" opacity={showControl ? 1 : 0.3}>
                      GATE CONTROL
                    </text>
                    <text x={LINES.rfOut.x + 8} y={378} fill="#74e4ff" opacity={showReadout ? 1 : 0.3}>
                      RF REFLECTOMETRY
                    </text>
                    <text x={LINES.rfOut.x + 8} y={392} fill="#74e4ff" opacity={showReadout ? 0.7 : 0.2}>
                      in ↓ · out ↑
                    </text>
                  </g>

                  {/* data */}
                  <g {...pick("data")}>
                    <rect x={790} y={96} width={280} height={400} fill="#060912" stroke={ring("data")} />
                    <text x={804} y={118} className="font-mono" fontSize={9} letterSpacing={1} fill="#8e9bb4">
                      CHARGE-STABILITY MAP · schematic
                    </text>
                    <rect x={804} y={128} width={252} height={180} fill="#0d1322" />
                    {Array.from({ length: 6 }, (_, i) => (
                      <line
                        key={i}
                        x1={804 + i * 46}
                        y1={308}
                        x2={804 + i * 46 + 70}
                        y2={128}
                        stroke="#74e4ff"
                        strokeOpacity={0.25 + i * 0.1}
                        strokeWidth={2}
                      />
                    ))}
                    <text x={810} y={300} className="font-mono" fontSize={8} fill="#5f6b86">
                      V_G1 →
                    </text>
                    <text x={1050} y={142} textAnchor="end" className="font-mono" fontSize={8} fill="#5f6b86">
                      ↑ V_G2
                    </text>
                    <text x={804} y={336} className="font-mono" fontSize={9} letterSpacing={1} fill="#8e9bb4">
                      SINGLE-SHOT TRACE · schematic
                    </text>
                    <rect x={804} y={346} width={252} height={70} fill="#0d1322" />
                    <path d="M810 396 H880 V372 H906 V396 H990 V372 H1004 V396 H1050" stroke="#bdf264" fill="none" strokeWidth={1.3} />
                    <text x={804} y={444} className="font-mono" fontSize={9} letterSpacing={1} fill="#8e9bb4">
                      ANALYSIS
                    </text>
                    <text x={804} y={464} className="font-mono" fontSize={10} fill="#ece6da">
                      transitions · occupation · T₁
                    </text>
                  </g>
                </svg>
              </div>

              {/* Mobile: vertical measurement chain */}
              <ol className="md:hidden">
                {labChain.map((id, i) => {
                  const n = labNodes[id];
                  const on = focus === id;
                  return (
                    <li key={id} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelected(id)}
                        aria-pressed={selected === id}
                        className={cn("flex w-full items-center gap-4 border-b border-line px-4 py-4 text-left transition-colors", on && "bg-ink-800/60")}
                      >
                        <span className="font-mono text-[0.7rem] text-cyan">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1">
                          <span className="block text-paper">{n.label}</span>
                          <span className={cn("font-mono text-[0.625rem] tracking-[0.14em]", n.path === "control" ? "text-lime" : "text-cyan")}>{n.tag}</span>
                        </span>
                        {i < labChain.length - 1 && <span className="label-sm text-fog">↓</span>}
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* detail panel */}
              <div className="flex flex-col p-5" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={focus}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p
                      className={cn(
                        "font-mono text-[0.625rem] tracking-[0.14em]",
                        node.path === "control" ? "text-lime" : node.path === "readout" ? "text-cyan" : "text-violet",
                      )}
                    >
                      {node.tag}
                    </p>
                    <h3 className="display mt-3 text-3xl text-paper">{node.label}</h3>
                    <p className="mt-4 text-[0.92rem] leading-relaxed text-mist">{node.role}</p>
                    {node.practice && (
                      <div className="mt-5 border-l border-lime/50 pl-4">
                        <p className="label-sm text-fog">In practice</p>
                        <p className="mt-2 text-[0.9rem] leading-relaxed text-paper">{node.practice}</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-auto pt-8">
                  <p className="label-sm mb-3 text-fog">Signal flow</p>
                  <ol className="space-y-1.5">
                    {labChain.map((id, i) => (
                      <li key={id} className="flex items-center gap-3">
                        <span className={cn("h-px w-4", focus === id ? "bg-cyan" : "bg-line-strong")} />
                        <button
                          type="button"
                          onClick={() => setSelected(id)}
                          className={cn("label-sm transition-colors", focus === id ? "text-paper" : "text-fog hover:text-mist")}
                        >
                          {labNodes[id].label}
                        </button>
                        {i < labChain.length - 1 && <span className="label-sm text-fog">↓</span>}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
