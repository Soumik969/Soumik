"use client";

import { AnimatePresence, motion } from "motion/react";
import { FigureScroll } from "@/components/ui/FigureScroll";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/Controls";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/*
 * Signature interaction 3 — superconductor / MTI thin film (conceptual).
 * Left: an s-wave superconductor tunnel-coupled to a 50-layer MTI slab; the
 * shading of each layer is an illustrative proximity profile controlled by the
 * coupling slider (not a computed result).
 * Right: the derivation pipeline described in the CV, one step at a time.
 */

const LAYERS = 50;
const X0 = 20;
const W = 170;
const DX = 34;
const DY = 14;
const layerY = (l: number) => 116 + l * 4.5;

type Step = { key: string; short: string; title: string; text: string };

const STEPS: Step[] = [
  {
    key: "expand",
    short: "Expand",
    title: "Tunneling expansion",
    text: "Normal and anomalous MTI propagators are expanded in the interface tunneling amplitude, through fourth order.",
  },
  {
    key: "parity",
    short: "Parity",
    title: "Fermion-parity selection",
    text: "Odd perturbative orders vanish by fermion-parity selection; only even orders contribute.",
  },
  {
    key: "wick",
    short: "Wick",
    title: "Fourth-order Wick contractions",
    text: "Connected fourth-order contractions reduce to two topologies: normal scattering and Andreev conversion.",
  },
  {
    key: "contour",
    short: "k_z contour",
    title: "Kernels by contour integration",
    text: "Superconducting kernels are evaluated analytically by k_z contour integration.",
  },
  {
    key: "dyson",
    short: "Dyson",
    title: "Resummation",
    text: "All even tunneling orders are resummed with the Dyson equation.",
  },
  {
    key: "bdg",
    short: "8×8 BdG",
    title: "Effective BdG Hamiltonian",
    text: "The result is a frequency-dependent 8 × 8 BdG effective Hamiltonian and its pole equation; the pairing is rank-one and orbital-selective in the symmetric–antisymmetric basis.",
  },
  {
    key: "pfaffian",
    short: "Pfaffian",
    title: "Topological diagnostic",
    text: "A four-momentum Pfaffian-sign diagnostic tracks Chern-parity changes in a 50-layer MTI slab.",
  },
];

const PAIRS = [
  { x: 52, dur: 3.6, delay: 0 },
  { x: 84, dur: 4.2, delay: 1.1 },
  { x: 118, dur: 3.2, delay: 2.0 },
  { x: 148, dur: 4.6, delay: 0.6 },
  { x: 176, dur: 3.9, delay: 2.6 },
];

function StepFigure({ step, reduced }: { step: string; reduced: boolean }) {
  const mono = { className: "font-mono", fill: "#8e9bb4" } as const;
  switch (step) {
    case "expand":
      return (
        <g>
          <rect x={10} y={40} width={228} height={44} fill="#74e4ff" fillOpacity={0.08} stroke="#74e4ff" strokeOpacity={0.4} />
          <text x={18} y={66} {...mono} fontSize={9}>
            s-wave SC · G_SC, F_SC
          </text>
          <rect x={10} y={176} width={228} height={44} fill="#ab8dff" fillOpacity={0.08} stroke="#ab8dff" strokeOpacity={0.4} />
          <text x={18} y={202} {...mono} fontSize={9}>
            MTI film · G⁰, F
          </text>
          {[40, 92, 144, 196].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 172 C ${x - 10} 150, ${x + 10} 110, ${x} 88`} stroke="#bdf264" strokeOpacity={0.8} fill="none" />
              <path d={`M${x - 4} 96 L${x} 88 L${x + 4} 96`} stroke="#bdf264" fill="none" />
              <text x={x + 8} y={134} {...mono} fontSize={9} fill="#bdf264">
                t
              </text>
              {i === 3 && (
                <text x={x - 40} y={250} {...mono} fontSize={8}>
                  orders t¹ … t⁴
                </text>
              )}
            </g>
          ))}
        </g>
      );
    case "parity":
      return (
        <g>
          {["t¹", "t²", "t³", "t⁴"].map((o, i) => {
            const odd = i % 2 === 0;
            const y = 50 + i * 48;
            return (
              <g key={o}>
                <rect
                  x={20}
                  y={y}
                  width={208}
                  height={34}
                  fill={odd ? "transparent" : "#bdf264"}
                  fillOpacity={0.06}
                  stroke={odd ? "rgb(150 172 214 / 0.2)" : "#bdf264"}
                  strokeOpacity={odd ? 1 : 0.5}
                  strokeDasharray={odd ? "3 4" : undefined}
                />
                <text x={34} y={y + 22} className="font-mono" fontSize={12} fill={odd ? "#5f6b86" : "#ece6da"}>
                  O({o})
                </text>
                <text x={98} y={y + 21} className="font-mono" fontSize={8.5} fill={odd ? "#5f6b86" : "#bdf264"}>
                  {odd ? "vanishes · parity" : "contributes"}
                </text>
                {odd && <line x1={28} y1={y + 17} x2={84} y2={y + 17} stroke="#e46fd6" strokeOpacity={0.7} />}
              </g>
            );
          })}
        </g>
      );
    case "wick":
      return (
        <g>
          {[0, 1].map((k) => {
            const ox = k * 124;
            return (
              <g key={k} transform={`translate(${ox} 0)`}>
                <line x1={8} y1={170} x2={116} y2={170} stroke="#ece6da" strokeOpacity={0.7} />
                <path
                  d="M30 170 C 30 90, 94 90, 94 170"
                  stroke={k === 0 ? "#74e4ff" : "#e46fd6"}
                  strokeWidth={1.4}
                  fill="none"
                  strokeDasharray={k === 1 ? "4 3" : undefined}
                />
                <circle cx={30} cy={170} r={3} fill="#bdf264" />
                <circle cx={94} cy={170} r={3} fill="#bdf264" />
                <path d="M14 166 L20 170 L14 174" stroke="#ece6da" fill="none" />
                <path d={k === 0 ? "M104 166 L110 170 L104 174" : "M110 166 L104 170 L110 174"} stroke="#ece6da" fill="none" />
                <text x={10} y={190} className="font-mono" fontSize={8.5} fill="#8e9bb4">
                  e
                </text>
                <text x={104} y={190} className="font-mono" fontSize={8.5} fill="#8e9bb4">
                  {k === 0 ? "e" : "h"}
                </text>
                <text x={56} y={102} textAnchor="middle" className="font-mono" fontSize={9} fill={k === 0 ? "#74e4ff" : "#e46fd6"}>
                  {k === 0 ? "G_SC" : "F_SC"}
                </text>
                <text x={62} y={222} textAnchor="middle" className="font-mono" fontSize={8.5} fill="#ece6da">
                  {k === 0 ? "normal scattering" : "Andreev conversion"}
                </text>
              </g>
            );
          })}
        </g>
      );
    case "contour":
      return (
        <g>
          <line x1={10} y1={150} x2={238} y2={150} stroke="rgb(150 172 214 / 0.35)" />
          <line x1={124} y1={30} x2={124} y2={250} stroke="rgb(150 172 214 / 0.35)" />
          <text x={204} y={164} {...mono} fontSize={8}>
            Re k_z
          </text>
          <text x={130} y={40} {...mono} fontSize={8}>
            Im k_z
          </text>
          {[
            [170, 104],
            [92, 76],
            [150, 196],
            [72, 182],
          ].map(([x, y], i) => (
            <g key={i} stroke={y < 150 ? "#bdf264" : "#5f6b86"} strokeWidth={1.4}>
              <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
              <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} />
            </g>
          ))}
          <path id="kz-contour" d="M24 150 H224 A100 100 0 0 0 24 150" stroke="#74e4ff" strokeWidth={1.3} fill="none" />
          <path d="M150 146 L158 150 L150 154" stroke="#74e4ff" fill="none" />
          {!reduced && (
            <circle r={3.5} fill="#74e4ff">
              <animateMotion dur="4s" repeatCount="indefinite" path="M24 150 H224 A100 100 0 0 0 24 150" />
            </circle>
          )}
          <text x={14} y={240} {...mono} fontSize={8}>
            close the contour; collect enclosed poles
          </text>
        </g>
      );
    case "dyson":
      return (
        <g>
          <text x={124} y={60} textAnchor="middle" className="font-mono" fontSize={12} fill="#ece6da">
            G = G₀ + G₀ Σ(ω) G
          </text>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${16 + i * 66} 110)`}>
              <line x1={0} y1={20} x2={22} y2={20} stroke="#ece6da" strokeOpacity={0.6} />
              <circle cx={34} cy={20} r={12} fill="#ab8dff" fillOpacity={0.12} stroke="#ab8dff" />
              <text x={34} y={24} textAnchor="middle" className="font-mono" fontSize={9} fill="#ab8dff">
                Σ
              </text>
              <line x1={46} y1={20} x2={66} y2={20} stroke="#ece6da" strokeOpacity={0.6} />
            </g>
          ))}
          <text x={222} y={134} className="font-mono" fontSize={12} fill="#5f6b86">
            …
          </text>
          <text x={124} y={190} textAnchor="middle" className="font-mono" fontSize={11} fill="#8e9bb4">
            =
          </text>
          <line x1={44} y1={214} x2={204} y2={214} stroke="#74e4ff" strokeWidth={1.4} />
          <line x1={44} y1={219} x2={204} y2={219} stroke="#74e4ff" strokeWidth={1.4} />
          <text x={124} y={244} textAnchor="middle" {...mono} fontSize={8}>
            all even orders, resummed
          </text>
        </g>
      );
    case "bdg": {
      const cell = 20;
      const ox = 44;
      const oy = 44;
      return (
        <g>
          <text x={124} y={30} textAnchor="middle" className="font-mono" fontSize={11} fill="#ece6da">
            H_BdG(k, ω) · 8 × 8
          </text>
          {Array.from({ length: 64 }, (_, idx) => {
            const r = Math.floor(idx / 8);
            const c = idx % 8;
            const block = (r < 4 ? 0 : 2) + (c < 4 ? 0 : 1);
            const color = block === 0 ? "#74e4ff" : block === 3 ? "#ab8dff" : "#bdf264";
            return (
              <rect
                key={idx}
                x={ox + c * cell + 1}
                y={oy + r * cell + 1}
                width={cell - 2}
                height={cell - 2}
                fill={color}
                fillOpacity={block === 1 || block === 2 ? 0.16 : 0.1}
                className={reduced ? undefined : "cell-shimmer"}
                style={{ animationDelay: `${((r * 3 + c * 5) % 11) * 0.27}s` }}
              />
            );
          })}
          <line x1={ox + 4 * cell} y1={oy - 4} x2={ox + 4 * cell} y2={oy + 8 * cell + 4} stroke="#ece6da" strokeOpacity={0.5} />
          <line x1={ox - 4} y1={oy + 4 * cell} x2={ox + 8 * cell + 4} y2={oy + 4 * cell} stroke="#ece6da" strokeOpacity={0.5} />
          <text x={ox + 2 * cell} y={oy + 2 * cell + 4} textAnchor="middle" className="font-mono" fontSize={9} fill="#ece6da">
            e
          </text>
          <text x={ox + 6 * cell} y={oy + 6 * cell + 4} textAnchor="middle" className="font-mono" fontSize={9} fill="#ece6da">
            h
          </text>
          <text x={ox + 6 * cell} y={oy + 2 * cell + 4} textAnchor="middle" className="font-mono" fontSize={9} fill="#bdf264">
            Δ_eff(ω)
          </text>
          <text x={ox + 2 * cell} y={oy + 6 * cell + 4} textAnchor="middle" className="font-mono" fontSize={9} fill="#bdf264">
            Δ_eff†
          </text>
          <text x={124} y={226} textAnchor="middle" className="font-mono" fontSize={9.5} fill="#8e9bb4">
            poles: det[ω − H_eff(k, ω)] = 0
          </text>
          <text x={124} y={244} textAnchor="middle" className="font-mono" fontSize={7.5} fill="#5f6b86">
            symbolic block structure — no computed values
          </text>
        </g>
      );
    }
    default: {
      const pts = [
        [54, 214],
        [194, 214],
        [54, 74],
        [194, 74],
      ];
      return (
        <g>
          <rect x={54} y={74} width={140} height={140} fill="#74e4ff" fillOpacity={0.03} stroke="rgb(150 172 214 / 0.35)" />
          <text x={124} y={60} textAnchor="middle" className="font-mono" fontSize={8} fill="#5f6b86">
            2D Brillouin zone (schematic)
          </text>
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={5} fill="#060912" stroke="#bdf264" />
              <circle
                cx={x}
                cy={y}
                r={11}
                fill="none"
                stroke="#bdf264"
                strokeOpacity={0.25}
                className={reduced ? undefined : "cell-shimmer"}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
              <text x={x + (x < 100 ? -12 : 12)} y={y + (y < 100 ? -10 : 18)} textAnchor="middle" className="font-mono" fontSize={9} fill="#ece6da">
                k{"₁₂₃₄"[i]}
              </text>
            </g>
          ))}
          <text x={124} y={246} textAnchor="middle" className="font-mono" fontSize={10} fill="#bdf264">
            Π sgn Pf(kᵢ) → Chern parity
          </text>
        </g>
      );
    }
  }
}

export default function MTIStack() {
  const [coupling, setCoupling] = useState(0.55);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!auto || reduced) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), 4200);
    return () => window.clearInterval(id);
  }, [auto, reduced]);

  // Illustrative proximity profile: decays into the film, length set by coupling.
  const xi = 2 + coupling * 16;
  const amp = (l: number) => coupling * Math.exp(-(l - 1) / xi);
  const depth = 30 + xi * 9;

  const current = STEPS[step];

  return (
    <div>
      <FigureScroll>
        <svg
          viewBox="0 0 520 400"
          className="block w-full select-none"
          role="img"
          aria-label="Conceptual stack: s-wave superconductor, tunneling interface and a 50-layer magnetic topological-insulator slab, next to the steps of the Green's-function derivation."
        >
          <defs>
            <linearGradient id="sc-front" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#74e4ff" stopOpacity={0.35} />
              <stop offset="1" stopColor="#74e4ff" stopOpacity={0.08} />
            </linearGradient>
          </defs>

          {/* Superconductor slab */}
          <polygon
            points={`${X0},58 ${X0 + W},58 ${X0 + W + DX},${58 - DY} ${X0 + DX},${58 - DY}`}
            fill="#74e4ff"
            fillOpacity={0.22}
            stroke="#74e4ff"
            strokeOpacity={0.7}
          />
          <rect x={X0} y={58} width={W} height={30} fill="url(#sc-front)" stroke="#74e4ff" strokeOpacity={0.6} />
          <polygon
            points={`${X0 + W},58 ${X0 + W + DX},${58 - DY} ${X0 + W + DX},${88 - DY} ${X0 + W},88`}
            fill="#74e4ff"
            fillOpacity={0.12}
            stroke="#74e4ff"
            strokeOpacity={0.5}
          />
          <text x={X0 + 8} y={78} className="font-mono" fontSize={9} fill="#ece6da" letterSpacing={1}>
            s-WAVE SUPERCONDUCTOR
          </text>

          {/* Interface */}
          <polygon
            points={`${X0},104 ${X0 + W},104 ${X0 + W + DX},${104 - DY} ${X0 + DX},${104 - DY}`}
            fill="#f3c46b"
            fillOpacity={0.05}
            stroke="#f3c46b"
            strokeOpacity={0.7}
            strokeDasharray="4 3"
          />
          <text x={X0 + DX + 6} y={101} className="font-mono" fontSize={7.5} fill="#f3c46b" letterSpacing={1}>
            INTERFACE · tunneling t
          </text>

          {/* MTI layers */}
          <polygon
            points={`${X0},${layerY(1)} ${X0 + W},${layerY(1)} ${X0 + W + DX},${layerY(1) - DY} ${X0 + DX},${layerY(1) - DY}`}
            fill="#ab8dff"
            fillOpacity={0.06 + amp(1) * 0.3}
            stroke="#ab8dff"
            strokeOpacity={0.6}
          />
          {Array.from({ length: LAYERS }, (_, i) => {
            const l = i + 1;
            const y = layerY(l);
            const a = amp(l);
            const on = hover === l;
            return (
              <g key={l} onMouseEnter={() => setHover(l)} onMouseLeave={() => setHover(null)}>
                <path
                  d={`M${X0} ${y} H${X0 + W} L${X0 + W + DX} ${y - DY}`}
                  fill="none"
                  stroke={on ? "#ece6da" : a > 0.04 ? "#bdf264" : "#ab8dff"}
                  strokeOpacity={on ? 1 : 0.18 + Math.min(0.8, a * 1.4)}
                  strokeWidth={on ? 1.6 : 1}
                  style={{ transition: "stroke-opacity 0.4s" }}
                />
                <rect x={X0} y={y - 4.5} width={W + DX} height={4.5} fill="transparent" />
                {(l === 1 || l % 10 === 0) && (
                  <text x={X0 + W + DX + 6} y={y - DY + 3} className="font-mono" fontSize={7.5} fill="#5f6b86">
                    L{String(l).padStart(2, "0")}
                  </text>
                )}
              </g>
            );
          })}
          <text x={10} y={232} transform="rotate(-90 10 232)" textAnchor="middle" className="font-mono" fontSize={7.5} fill="#8e9bb4" letterSpacing={1.5}>
            50-LAYER MTI SLAB
          </text>

          {/* Cooper pairs drifting across the interface */}
          {!reduced &&
            PAIRS.map((p, i) => (
              <g
                key={i}
                className="pair-fall"
                style={{ ["--depth" as string]: `${depth}px`, ["--dur" as string]: `${p.dur}s`, ["--delay" as string]: `${p.delay}s` }}
              >
                <circle cx={p.x} cy={86} r={2.2} fill="#74e4ff" />
                <circle cx={p.x + 7} cy={86} r={2.2} fill="#e46fd6" />
                <line x1={p.x} y1={86} x2={p.x + 7} y2={86} stroke="#ece6da" strokeOpacity={0.5} strokeDasharray="1 1.5" />
              </g>
            ))}

          <text x={X0} y={layerY(LAYERS) + 22} className="font-mono" fontSize={8} fill={hover ? "#ece6da" : "#5f6b86"}>
            {hover ? `MTI LAYER ${String(hover).padStart(2, "0")} / 50 · shade ${amp(hover).toFixed(2)} (illustrative)` : "hover a layer"}
          </text>

          {/* Derivation pipeline */}
          <g transform="translate(262 34)">
            <rect x={0} y={0} width={248} height={290} fill="#060912" fillOpacity={0.6} stroke="rgb(150 172 214 / 0.18)" />
            <text x={10} y={18} className="font-mono" fontSize={8} fill="#74e4ff" letterSpacing={1}>
              STEP {step + 1}/{STEPS.length} · {current.title.toUpperCase()}
            </text>
            <AnimatePresence mode="wait">
              <motion.g key={current.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <StepFigure step={current.key} reduced={reduced} />
              </motion.g>
            </AnimatePresence>
          </g>
        </svg>
      </FigureScroll>

      <div className="border-t border-line px-3 py-3">
        <div role="tablist" aria-label="Derivation steps" className="flex flex-wrap gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === step}
              onClick={() => {
                setAuto(false);
                setStep(i);
              }}
              className={cn(
                "border px-2 py-1.5 font-mono text-[0.66rem] tracking-[0.04em] transition-colors",
                i === step ? "border-cyan bg-cyan/10 text-cyan" : "border-line text-mist hover:text-paper",
              )}
            >
              <span className="text-fog">{i + 1}</span> {s.short}
            </button>
          ))}
        </div>
        <p className="mt-3 min-h-[3.2em] text-[0.85rem] leading-relaxed text-mist" aria-live="polite">
          {current.text}
        </p>
        <Slider
          className="mt-2"
          label="Interface coupling (illustrative)"
          min={0.1}
          max={1}
          step={0.01}
          value={coupling}
          onChange={setCoupling}
          format={(v) => v.toFixed(2)}
        />
      </div>
    </div>
  );
}
