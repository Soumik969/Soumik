"use client";

import { motion } from "motion/react";
import { FigureScroll } from "@/components/ui/FigureScroll";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/*
 * Schematic: spin chain → Majorana representation → free-fermion modes.
 * In Fendley's construction the fermions are non-local, drawn here as long
 * dashed links. Click a spin (in the first stage) to flip it.
 */

const SITES = 8;
const xs = Array.from({ length: SITES }, (_, i) => 50 + i * 60);
const Y = 120;
const STAGES = ["Spin chain", "Majorana representation", "Free fermions"] as const;

export default function FreeFermionChain() {
  const [stage, setStage] = useState(0);
  const [auto, setAuto] = useState(true);
  const [spins, setSpins] = useState([1, 0, 1, 1, 0, 1, 0, 0]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!auto || reduced) return;
    const id = window.setInterval(() => setStage((s) => (s + 1) % 3), 3600);
    return () => window.clearInterval(id);
  }, [auto, reduced]);

  const spring = { type: "spring", stiffness: 120, damping: 18 } as const;

  return (
    <div>
      <FigureScroll>
        <svg viewBox="0 0 520 290" className="block w-full select-none" role="img" aria-label={`Schematic of a spin chain shown as: ${STAGES[stage]}.`}>
          {/* stage rail */}
          <g className="font-mono" fontSize={8.5} letterSpacing={1}>
            {STAGES.map((s, i) => (
              <text key={s} x={20 + i * 170} y={24} fill={i === stage ? "#74e4ff" : "#5f6b86"}>
                {i > 0 ? "→ " : ""}
                {s.toUpperCase()}
              </text>
            ))}
          </g>

          {/* interaction bonds (stage 0) */}
          <motion.path
            d={xs
              .slice(0, -1)
              .map((x) => `M${x + 18} ${Y} l6 -6 l6 12 l6 -12 l6 12 l6 -12 l6 6`)
              .join(" ")}
            stroke="#ab8dff"
            strokeOpacity={0.6}
            fill="none"
            animate={{ opacity: stage === 0 ? 1 : 0 }}
          />
          {stage === 0 && (
            <text x={260} y={78} textAnchor="middle" className="font-mono" fontSize={8} fill="#5f6b86">
              interacting spin chain · click a spin
            </text>
          )}

          {/* free-fermion pairings (stage 2): neighbouring Majoranas + non-local links */}
          <motion.g animate={{ opacity: stage === 2 ? 1 : 0 }} transition={{ duration: 0.6 }}>
            {xs.slice(0, -1).map((x, i) => (
              <ellipse
                key={i}
                cx={x + 30}
                cy={Y}
                rx={26}
                ry={14}
                fill="#bdf264"
                fillOpacity={0.06}
                stroke="#bdf264"
                strokeOpacity={0.7}
                strokeDasharray="3 3"
              />
            ))}
            {[
              [0, 5],
              [1, 7],
              [2, 6],
            ].map(([a, b], i) => (
              <path
                key={i}
                d={`M${xs[a] + 11} ${Y - 12} C ${xs[a] + 11} ${Y - 70 - i * 14}, ${xs[b] - 11} ${Y - 70 - i * 14}, ${xs[b] - 11} ${Y - 12}`}
                stroke="#bdf264"
                strokeOpacity={0.35}
                fill="none"
                strokeDasharray="2 4"
              />
            ))}
            <text x={260} y={56} textAnchor="middle" className="font-mono" fontSize={8} fill="#bdf264">
              re-paired, non-local fermionic modes
            </text>
          </motion.g>

          {/* sites */}
          {xs.map((x, i) => {
            const up = spins[i] === 1;
            return (
              <g key={i}>
                {/* left Majorana */}
                <motion.circle
                  cy={Y}
                  initial={false}
                  animate={{ cx: stage === 0 ? x : x - 11, r: stage === 0 ? 17 : 7 }}
                  transition={spring}
                  fill={stage === 0 ? "#0d1322" : "#74e4ff"}
                  fillOpacity={stage === 0 ? 1 : 0.25}
                  stroke={stage === 0 ? "#ece6da" : "#74e4ff"}
                  strokeOpacity={stage === 0 ? 0.5 : 0.9}
                />
                {/* right Majorana */}
                <motion.circle
                  cy={Y}
                  initial={false}
                  animate={{ cx: stage === 0 ? x : x + 11, r: stage === 0 ? 0 : 7, opacity: stage === 0 ? 0 : 1 }}
                  transition={spring}
                  fill="#ab8dff"
                  fillOpacity={0.25}
                  stroke="#ab8dff"
                />
                {stage === 0 && (
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Spin ${i + 1}: ${up ? "up" : "down"}. Activate to flip.`}
                    onClick={() => {
                      setAuto(false);
                      setSpins((s) => s.map((v, k) => (k === i ? 1 - v : v)));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setAuto(false);
                        setSpins((s) => s.map((v, k) => (k === i ? 1 - v : v)));
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <circle cx={x} cy={Y} r={18} fill="transparent" />
                    <motion.path
                      d={`M${x} ${Y + 10} V${Y - 10} M${x - 5} ${Y - 4} L${x} ${Y - 10} L${x + 5} ${Y - 4}`}
                      stroke={up ? "#74e4ff" : "#e46fd6"}
                      strokeWidth={1.6}
                      fill="none"
                      initial={false}
                      animate={{ rotate: up ? 0 : 180 }}
                      transition={spring}
                    />
                  </g>
                )}
                <text x={x} y={Y + 38} textAnchor="middle" className="font-mono" fontSize={8} fill="#5f6b86">
                  {stage === 0 ? `σ${"₁₂₃₄₅₆₇₈"[i]}` : `γ${2 * i + 1},${2 * i + 2}`}
                </text>
              </g>
            );
          })}

          {/* Algebra + spectrum panel */}
          <line x1={20} y1={190} x2={500} y2={190} stroke="rgb(150 172 214 / 0.15)" />
          {stage === 0 && (
            <text x={20} y={222} className="font-mono" fontSize={10} fill="#8e9bb4">
              H = Σ (local spin interactions) — looks interacting
            </text>
          )}
          {stage === 1 && (
            <g className="font-mono" fontSize={10}>
              <text x={20} y={222} fill="#ece6da">
                {"{γ_a, γ_b} = 2δ_ab"}
              </text>
              <text x={20} y={244} fill="#8e9bb4">
                Clifford algebra · each site → two Majorana operators
              </text>
            </g>
          )}
          {stage === 2 && (
            <g>
              <text x={20} y={214} className="font-mono" fontSize={8} fill="#5f6b86">
                SINGLE-PARTICLE LEVELS ε_k (schematic)
              </text>
              <line x1={20} y1={256} x2={500} y2={256} stroke="rgb(150 172 214 / 0.3)" />
              {[0.06, 0.15, 0.27, 0.38, 0.52, 0.66, 0.81, 0.93].map((f, i) => (
                <motion.line
                  key={i}
                  x1={20 + f * 480}
                  x2={20 + f * 480}
                  y1={256}
                  initial={{ y2: 256 }}
                  animate={{ y2: 228 }}
                  transition={{ delay: i * 0.06, ...spring }}
                  stroke="#bdf264"
                  strokeWidth={1.4}
                />
              ))}
              <text x={20} y={276} className="font-mono" fontSize={8} fill="#8e9bb4">
                H = Σ_k ε_k (2n_k − 1) — free-fermion form
              </text>
            </g>
          )}
        </svg>
      </FigureScroll>
      <div className="flex flex-wrap gap-1 border-t border-line px-3 py-3" role="tablist" aria-label="Representation">
        {STAGES.map((s, i) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={i === stage}
            onClick={() => {
              setAuto(false);
              setStage(i);
            }}
            className={cn(
              "label-sm border px-2.5 py-1.5 transition-colors",
              i === stage ? "border-cyan bg-cyan/10 text-cyan" : "border-line text-mist hover:text-paper",
            )}
          >
            {i + 1} · {s}
          </button>
        ))}
      </div>
    </div>
  );
}
