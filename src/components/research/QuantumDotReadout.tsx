"use client";

import { useRef, useState } from "react";
import { FigureScroll } from "@/components/ui/FigureScroll";
import { Segmented, Slider } from "@/components/ui/Controls";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { pathFrom } from "@/lib/math";

/*
 * Signature interaction 2 — quantum-dot readout (schematic).
 * DC mode: sweeping the plunger gate loads electrons one by one (a Coulomb
 * staircase); the charge sensor shows the familiar sawtooth, which the RF
 * resonator turns into a reflected amplitude.
 * Pulse mode: an Empty → Load → Read cycle as used for T₁ measurements.
 * All curves are illustrative shapes, not measured data.
 */

type Focus = "gate" | "barrier" | "dot" | "sensor" | "resonator" | "readout" | null;

const CHAIN: { id: Exclude<Focus, null>; label: string }[] = [
  { id: "gate", label: "GATE" },
  { id: "barrier", label: "BARRIER" },
  { id: "dot", label: "DOT" },
  { id: "sensor", label: "CHARGE SENSOR" },
  { id: "resonator", label: "RESONATOR" },
  { id: "readout", label: "RF READOUT" },
];

const STARTS = [0, 22, 47, 72];
const ENDS = [22, 47, 72, 100];

function occupancy(v: number) {
  let n = 0;
  for (let i = 1; i < STARTS.length; i++) if (v >= STARTS[i]) n = i;
  return n;
}

function sensor(v: number) {
  const n = occupancy(v);
  const local = (v - STARTS[n]) / (ENDS[n] - STARTS[n]);
  return 0.3 + 0.45 * local;
}

const SPINS = [1, 0, 0, 1, 0, 1, 0, 0];
const CYCLE = 3.2;

/** Dot state during a 3-level pulse cycle, phase ∈ [0, 1). */
function pulseState(phase: number, up: boolean) {
  if (phase < 0.27) return { stage: "EMPTY", n: 0, spin: null as null | "up" | "down" };
  if (phase < 0.6) return { stage: "LOAD", n: 1, spin: up ? "up" : "down" } as const;
  if (up && phase < 0.73) return { stage: "READ", n: phase < 0.64 ? 1 : 0, spin: phase < 0.64 ? "up" : null } as const;
  return { stage: "READ", n: 1, spin: "down" } as const;
}

const plotX = (v: number) => 34 + (v / 100) * 466;
const plotY = (g: number) => 392 - ((g - 0.2) / 0.65) * 72;

const SAWTOOTH = (() => {
  const parts: string[] = [];
  for (let n = 0; n < 4; n++) {
    const pts: [number, number][] = [];
    for (let v = STARTS[n]; v <= ENDS[n]; v += 1) pts.push([plotX(v), plotY(sensor(Math.min(v, ENDS[n] - 0.001)))]);
    parts.push(pathFrom(pts));
  }
  return parts.join("");
})();

const CARRIER = (() => {
  const pts: [number, number][] = [];
  for (let x = 0; x <= 130; x += 1) pts.push([x, Math.sin((x / 12) * Math.PI * 2)]);
  return pathFrom(pts);
})();

export default function QuantumDotReadout() {
  const [mode, setMode] = useState<"dc" | "pulse">("dc");
  const [vp, setVp] = useState(34);
  const [focus, setFocus] = useState<Focus>(null);
  const [t, setT] = useState(CYCLE * 0.66);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInViewport(ref);
  const reduced = usePrefersReducedMotion();

  useAnimationLoop((_, dt) => setT((v) => v + dt), mode === "pulse" && visible && !reduced);

  const cycle = Math.floor(t / CYCLE);
  const phase = (t % CYCLE) / CYCLE;
  const up = SPINS[cycle % SPINS.length] === 1;
  const ps = pulseState(phase, up);

  const n = mode === "dc" ? occupancy(vp) : ps.n;
  const g = mode === "dc" ? sensor(vp) : n === 0 ? 0.74 : 0.36;

  const dim = (id: Exclude<Focus, null>) => (focus && focus !== id ? 0.28 : 1);
  const hi = (id: Exclude<Focus, null>) => focus === id;
  const hover = (id: Exclude<Focus, null>) => ({
    onMouseEnter: () => setFocus(id),
    onMouseLeave: () => setFocus(null),
  });

  // Electron positions inside the dot.
  const electrons = [
    [157, 147],
    [173, 147],
    [165, 139],
  ].slice(0, n);

  // Pulse plot geometry (one cycle, playhead at `phase`).
  const px = (f: number) => 34 + f * 466;
  const level = (f: number) => (f < 0.27 ? 322 : f < 0.6 ? 356 : 339);
  const wave = pathFrom([
    [px(0), 322],
    [px(0.27), 322],
    [px(0.27), 356],
    [px(0.6), 356],
    [px(0.6), 339],
    [px(1), 339],
  ]);
  const trace: [number, number][] = [];
  for (let f = 0; f <= phase; f += 0.004) {
    const s = pulseState(f, up);
    const val = s.n === 0 ? 0.74 : 0.36;
    trace.push([px(f), 392 - val * 22 + (((f * 997) % 1) - 0.5) * 2.2]);
  }

  return (
    <div ref={ref}>
      <FigureScroll>
        <svg
          viewBox="0 0 520 400"
          className="block w-full select-none"
          role="img"
          aria-label="Schematic of a gate-defined quantum dot, a charge sensor, an RF resonator and the readout chain."
        >
          <defs>
            <radialGradient id="qd-dot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#74e4ff" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#74e4ff" stopOpacity={0.04} />
            </radialGradient>
            <pattern id="qd-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#ab8dff" strokeOpacity={0.35} strokeWidth={1} />
            </pattern>
          </defs>

          {/* Chain legend */}
          <g className="font-mono" fontSize={8.6} letterSpacing={1}>
            {CHAIN.map((c, i) => {
              const x = 10 + CHAIN.slice(0, i).reduce((s, d) => s + d.label.length * 6.2 + 24, 0);
              return (
                <g key={c.id} {...hover(c.id)} style={{ cursor: "default" }}>
                  <rect x={x - 4} y={6} width={c.label.length * 6.2 + 20} height={20} fill="transparent" />
                  <text x={x} y={20} fill={hi(c.id) ? "#74e4ff" : focus ? "#5f6b86" : "#8e9bb4"}>
                    {c.label}
                  </text>
                  {i < CHAIN.length - 1 && (
                    <text x={x + c.label.length * 6.2 + 4} y={20} fill="#5f6b86">
                      →
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Device: top view */}
          <rect x={10} y={46} width={318} height={244} fill="#74e4ff" fillOpacity={0.02} stroke="rgb(150 172 214 / 0.2)" />
          <text x={322} y={60} textAnchor="end" className="font-mono" fontSize={7.5} fill="#5f6b86" letterSpacing={1}>
            TOP VIEW · GaAs / Si
          </text>

          {/* Dot channel */}
          <g opacity={dim("dot")}>
            <rect x={80} y={134} width={170} height={12} fill="#74e4ff" fillOpacity={0.05} />
          </g>
          <g opacity={Math.max(dim("dot"), dim("barrier"))}>
            <rect x={24} y={118} width={56} height={44} rx={3} fill="#141c2e" stroke="#5f6b86" />
            <text x={52} y={144} textAnchor="middle" className="font-mono" fontSize={10} fill="#8e9bb4">
              S
            </text>
            <rect x={250} y={118} width={56} height={44} rx={3} fill="#141c2e" stroke="#5f6b86" />
            <text x={278} y={144} textAnchor="middle" className="font-mono" fontSize={10} fill="#8e9bb4">
              D
            </text>
          </g>

          {/* Barrier gates */}
          <g opacity={dim("barrier")} {...hover("barrier")}>
            {[104, 212].map((x, i) => (
              <g key={x}>
                <rect x={x} y={46} width={14} height={84} fill="url(#qd-hatch)" stroke="#ab8dff" strokeOpacity={hi("barrier") ? 1 : 0.6} />
                <text x={x + 7} y={40} textAnchor="middle" className="font-mono" fontSize={8} fill="#ab8dff">
                  {i === 0 ? "B_L" : "B_R"}
                </text>
              </g>
            ))}
          </g>

          {/* Plunger gate */}
          <g opacity={dim("gate")} {...hover("gate")}>
            <rect x={151} y={46} width={28} height={72} fill="#74e4ff" fillOpacity={0.12} stroke="#74e4ff" strokeOpacity={hi("gate") ? 1 : 0.6} />
            <text x={165} y={40} textAnchor="middle" className="font-mono" fontSize={8} fill="#74e4ff">
              {mode === "dc" ? "V_P" : "V_P + pulse"}
            </text>
          </g>

          {/* Quantum dot */}
          <g opacity={dim("dot")} {...hover("dot")}>
            <ellipse cx={165} cy={146} rx={27} ry={17} fill="url(#qd-dot)" stroke="#74e4ff" strokeOpacity={hi("dot") ? 1 : 0.55} />
            {electrons.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={3.4} fill="#bdf264" />
                <circle cx={x} cy={y} r={6} fill="#bdf264" opacity={0.18} />
              </g>
            ))}
            {mode === "pulse" && ps.spin && n > 0 && (
              <text x={182} y={136} className="font-mono" fontSize={11} fill={ps.spin === "up" ? "#e46fd6" : "#bdf264"}>
                {ps.spin === "up" ? "↑" : "↓"}
              </text>
            )}
            <text x={200} y={176} className="font-mono" fontSize={8} fill="#8e9bb4">
              N = {n}
            </text>
          </g>

          {/* Capacitive coupling */}
          <g opacity={Math.max(dim("dot"), dim("sensor"))}>
            <line x1={165} y1={164} x2={165} y2={219} stroke="#ece6da" strokeOpacity={0.35} strokeDasharray="2 4" />
            <text x={172} y={196} className="font-mono" fontSize={7.5} fill="#5f6b86">
              capacitive coupling
            </text>
          </g>

          {/* Charge sensor */}
          <g opacity={dim("sensor")} {...hover("sensor")}>
            <rect x={24} y={214} width={56} height={36} rx={3} fill="#141c2e" stroke="#5f6b86" />
            <rect x={250} y={214} width={56} height={36} rx={3} fill="#141c2e" stroke="#5f6b86" />
            <rect x={80} y={227} width={170} height={10} fill="#ece6da" fillOpacity={0.04} />
            {[118, 200].map((x) => (
              <rect key={x} x={x} y={244} width={12} height={46} fill="url(#qd-hatch)" stroke="#ab8dff" strokeOpacity={0.5} />
            ))}
            <ellipse cx={165} cy={232} rx={21} ry={12} fill="#ece6da" fillOpacity={0.06 + g * 0.35} stroke="#ece6da" strokeOpacity={hi("sensor") ? 1 : 0.5} />
            <text x={52} y={236} textAnchor="middle" className="font-mono" fontSize={7.5} fill="#8e9bb4">
              SENSOR
            </text>
            <text x={278} y={236} textAnchor="middle" className="font-mono" fontSize={7.5} fill="#8e9bb4">
              G_s
            </text>
          </g>

          {/* Resonator (tank circuit) */}
          <g opacity={dim("resonator")} {...hover("resonator")}>
            <path d="M306 232 H342" stroke="#ece6da" strokeOpacity={0.5} fill="none" />
            <path
              d="M342 232 q4 -10 8 0 q4 -10 8 0 q4 -10 8 0 q4 -10 8 0 q4 -10 8 0"
              stroke={hi("resonator") ? "#74e4ff" : "#ece6da"}
              strokeOpacity={0.8}
              fill="none"
            />
            <path
              d="M382 232 H396 V246 M384 246 H408 M384 252 H408 M396 252 V266 M388 266 H404 M391 270 H401 M394 274 H398"
              stroke="#ece6da"
              strokeOpacity={0.6}
              fill="none"
            />
            <text x={358} y={220} className="font-mono" fontSize={7.5} fill="#8e9bb4">
              L
            </text>
            <text x={412} y={252} className="font-mono" fontSize={7.5} fill="#8e9bb4">
              C
            </text>
            <text x={340} y={290} className="font-mono" fontSize={7.5} fill="#74e4ff" letterSpacing={1}>
              RF RESONATOR
            </text>
          </g>

          {/* RF line + readout electronics */}
          <g opacity={dim("readout")} {...hover("readout")}>
            <path d="M396 232 V150 H420" stroke="#74e4ff" strokeOpacity={0.35} fill="none" />
            <path d="M396 232 V150 H420" stroke="#74e4ff" strokeWidth={1.4} fill="none" className={reduced ? undefined : "flow-dash-rev"} />
            <rect x={420} y={124} width={90} height={52} fill="#0d1322" stroke="#74e4ff" strokeOpacity={hi("readout") ? 1 : 0.5} />
            <text x={465} y={146} textAnchor="middle" className="font-mono" fontSize={8.5} fill="#ece6da">
              VNA
            </text>
            <text x={465} y={160} textAnchor="middle" className="font-mono" fontSize={8.5} fill="#ece6da">
              LOCK-IN
            </text>
            <text x={404} y={118} className="font-mono" fontSize={7} fill="#5f6b86">
              RF in · reflected out
            </text>

            {/* Reflected carrier: amplitude follows the sensor signal */}
            <rect x={420} y={190} width={90} height={76} fill="#060912" stroke="rgb(150 172 214 / 0.2)" />
            <clipPath id="qd-clip">
              <rect x={421} y={191} width={88} height={74} />
            </clipPath>
            <g clipPath="url(#qd-clip)">
              <line x1={420} y1={228} x2={510} y2={228} stroke="rgb(150 172 214 / 0.15)" />
              <g transform={`translate(421 228) scale(1 ${(6 + g * 30).toFixed(2)})`} style={{ transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
                <g className={reduced ? undefined : "rf-scroll"}>
                  <path d={CARRIER} stroke="#74e4ff" strokeWidth={1.2} fill="none" vectorEffect="non-scaling-stroke" />
                </g>
              </g>
            </g>
            <text x={424} y={262} className="font-mono" fontSize={7} fill="#5f6b86">
              |Γ| ∝ G_s
            </text>
          </g>

          {/* Bottom plot */}
          <g>
            <line x1={34} y1={396} x2={500} y2={396} stroke="rgb(150 172 214 / 0.25)" />
            <line x1={34} y1={306} x2={34} y2={396} stroke="rgb(150 172 214 / 0.25)" />
            {mode === "dc" ? (
              <>
                <text x={38} y={312} className="font-mono" fontSize={7.5} fill="#8e9bb4" letterSpacing={1}>
                  SENSOR SIGNAL vs V_P
                </text>
                {STARTS.slice(1).map((s, i) => (
                  <g key={s}>
                    <line x1={plotX(s)} y1={318} x2={plotX(s)} y2={396} stroke="#ab8dff" strokeOpacity={0.35} strokeDasharray="2 3" />
                    <text x={plotX(s) + 3} y={326} className="font-mono" fontSize={7} fill="#ab8dff">
                      {i}→{i + 1}
                    </text>
                  </g>
                ))}
                <path d={SAWTOOTH} stroke="#ece6da" strokeOpacity={0.75} strokeWidth={1.2} fill="none" />
                <line x1={plotX(vp)} y1={318} x2={plotX(vp)} y2={396} stroke="#74e4ff" strokeOpacity={0.5} />
                <circle cx={plotX(vp)} cy={plotY(g)} r={4} fill="#74e4ff" />
                <circle cx={plotX(vp)} cy={plotY(g)} r={9} fill="#74e4ff" opacity={0.2} />
              </>
            ) : (
              <>
                <text x={38} y={312} className="font-mono" fontSize={7.5} fill="#8e9bb4" letterSpacing={1}>
                  3-LEVEL PULSE · SENSOR TRACE
                </text>
                {[
                  [0, 0.27, "EMPTY"],
                  [0.27, 0.6, "LOAD · wait τ"],
                  [0.6, 1, "READ"],
                ].map(([a, b, l]) => (
                  <g key={l as string}>
                    <rect
                      x={px(a as number)}
                      y={316}
                      width={px(b as number) - px(a as number)}
                      height={48}
                      fill={ps.stage === (l as string).split(" ")[0] ? "#74e4ff" : "transparent"}
                      fillOpacity={0.05}
                    />
                    <text x={px(a as number) + 4} y={372} className="font-mono" fontSize={7} fill="#5f6b86">
                      {l as string}
                    </text>
                  </g>
                ))}
                <path d={wave} stroke="#bdf264" strokeOpacity={0.85} strokeWidth={1.2} fill="none" />
                <path d={pathFrom(trace)} stroke="#ece6da" strokeOpacity={0.8} strokeWidth={1} fill="none" />
                <line x1={px(phase)} y1={316} x2={px(phase)} y2={396} stroke="#74e4ff" strokeOpacity={0.6} />
                <circle cx={px(phase)} cy={level(phase)} r={3.5} fill="#bdf264" />
              </>
            )}
          </g>
        </svg>
      </FigureScroll>

      <div className="grid gap-4 border-t border-line px-3 py-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <Segmented
          label="Measurement mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "dc", label: "DC sweep" },
            { value: "pulse", label: "3-level pulse" },
          ]}
        />
        {mode === "dc" ? (
          <Slider label="Plunger gate V_P (arb.)" min={0} max={99} value={vp} onChange={setVp} format={(v) => `${v.toFixed(0)} · N=${occupancy(v)}`} />
        ) : (
          <p className="font-mono text-[0.7rem] leading-relaxed text-mist" aria-live="polite">
            <span className="text-cyan">{ps.stage}</span> · cycle {cycle + 1} · loaded spin {up ? "↑" : "↓"}
            <span className="text-fog"> — {up ? "↑ tunnels out during READ, giving a sensor blip" : "↓ stays put: no blip"}</span>
          </p>
        )}
      </div>
      <p className={cn("border-t border-line px-3 py-2 font-mono text-[0.65rem] tracking-wide text-fog")}>
        Hover the chain labels or the device to trace the signal path. Shapes are illustrative, not measured data.
      </p>
    </div>
  );
}
