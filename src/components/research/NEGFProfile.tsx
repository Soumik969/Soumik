"use client";

import { useEffect, useState } from "react";
import { FigureScroll } from "@/components/ui/FigureScroll";
import { Slider } from "@/components/ui/Controls";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { pathFrom } from "@/lib/math";

/*
 * Schematic Landauer / NEGF picture. Left: contacts at μ₁ and μ₂ = μ₁ − qV with
 * self-energies Σ₁, Σ₂ and a biased potential profile U(x). Right: a step-like
 * transmission T(E) on the same energy axis; the shaded window is what carries
 * current, I ∝ ∫ T(E) [f₁ − f₂] dE. Shapes are illustrative.
 */

const MU1 = 130;
const EDGES = [222, 178, 120]; // subband edges (y, lower = higher energy)
const SCF = ["U", "G", "n", "U"];

const uAt = (x: number, v: number) => 214 - 46 * Math.exp(-(((x - 160) / 34) ** 2)) + v * 70 * ((x - 70) / 180);

function modes(y: number) {
  return EDGES.filter((e) => y < e).length;
}

export default function NEGFProfile() {
  const [v, setV] = useState(0.45);
  const [scf, setScf] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setScf((s) => (s + 1) % 3), 1100);
    return () => window.clearInterval(id);
  }, [reduced]);

  const mu2 = MU1 + v * 70;
  const profile: [number, number][] = [];
  for (let x = 70; x <= 250; x += 2) profile.push([x, uAt(x, v)]);

  const tPath: [number, number][] = [];
  let prev = -1;
  for (let y = 40; y <= 262; y += 1) {
    const m = modes(y);
    const x = 340 + m * 46;
    if (prev !== -1 && m !== prev) tPath.push([340 + prev * 46, y]);
    tPath.push([x, y]);
    prev = m;
  }

  // Area of T(E) inside the bias window (for the shaded region).
  const windowRects: { y: number; h: number; m: number }[] = [];
  for (let y = MU1; y < mu2; y += 1) windowRects.push({ y, h: 1, m: modes(y) });
  const current = windowRects.reduce((s, r) => s + r.m, 0) / 70;

  const electrons = Math.round(v * 6);

  return (
    <div>
      <FigureScroll>
        <svg
          viewBox="0 0 520 290"
          className="block w-full select-none"
          role="img"
          aria-label="Schematic NEGF device: two contacts, a biased potential profile, and a step-like transmission function."
        >
          {/* energy axis label */}
          <text x={8} y={36} className="font-mono" fontSize={8} fill="#5f6b86">
            E ↑
          </text>

          {/* bias window band across both panels */}
          <rect x={20} y={MU1} width={490} height={mu2 - MU1} fill="#74e4ff" fillOpacity={0.06} />

          {/* contact 1 */}
          <rect x={20} y={MU1} width={50} height={140} fill="#74e4ff" fillOpacity={0.18} />
          <rect x={20} y={40} width={50} height={230} fill="none" stroke="rgb(150 172 214 / 0.35)" />
          <line x1={20} y1={MU1} x2={70} y2={MU1} stroke="#74e4ff" strokeWidth={1.4} />
          <text x={24} y={MU1 - 6} className="font-mono" fontSize={9} fill="#74e4ff">
            μ₁
          </text>
          <text x={30} y={286} className="font-mono" fontSize={8} fill="#8e9bb4">
            Σ₁
          </text>

          {/* contact 2 */}
          <rect x={250} y={mu2} width={50} height={Math.max(0, 270 - mu2)} fill="#74e4ff" fillOpacity={0.18} style={{ transition: "all 0.3s" }} />
          <rect x={250} y={40} width={50} height={230} fill="none" stroke="rgb(150 172 214 / 0.35)" />
          <line x1={250} y1={mu2} x2={300} y2={mu2} stroke="#74e4ff" strokeWidth={1.4} />
          <text x={254} y={mu2 - 6} className="font-mono" fontSize={9} fill="#74e4ff">
            μ₂
          </text>
          <text x={262} y={286} className="font-mono" fontSize={8} fill="#8e9bb4">
            Σ₂
          </text>

          {/* channel + potential profile */}
          <rect x={70} y={40} width={180} height={230} fill="#060912" fillOpacity={0.5} />
          <path d={pathFrom(profile)} stroke="#ab8dff" strokeWidth={1.5} fill="none" />
          <text x={150} y={uAt(160, v) - 8} textAnchor="middle" className="font-mono" fontSize={8} fill="#ab8dff">
            U(x)
          </text>
          <text x={160} y={284} textAnchor="middle" className="font-mono" fontSize={8} fill="#5f6b86">
            channel · G(E) = [E − H − U − Σ₁ − Σ₂]⁻¹
          </text>

          {/* electrons in the window */}
          {!reduced &&
            Array.from({ length: electrons }, (_, i) => {
              const y = MU1 + ((i + 0.5) / Math.max(1, electrons)) * (mu2 - MU1);
              return <circle key={i} cx={74} cy={y} r={2.6} fill="#bdf264" className="flow-electron" style={{ animationDelay: `${i * 0.37}s` }} />;
            })}

          {/* SCF loop badge */}
          <g transform="translate(90 50)">
            {SCF.slice(0, 3).map((s, i) => (
              <g key={s}>
                <circle cx={i * 26} cy={0} r={8} fill={i === scf ? "#bdf264" : "transparent"} fillOpacity={0.15} stroke={i === scf ? "#bdf264" : "#5f6b86"} />
                <text x={i * 26} y={3} textAnchor="middle" className="font-mono" fontSize={8} fill={i === scf ? "#bdf264" : "#8e9bb4"}>
                  {s}
                </text>
                {i < 2 && (
                  <text x={i * 26 + 13} y={3} textAnchor="middle" className="font-mono" fontSize={8} fill="#5f6b86">
                    →
                  </text>
                )}
              </g>
            ))}
            <path d="M52 8 C 52 22, 0 22, 0 8" stroke="#5f6b86" fill="none" strokeDasharray="2 2" />
            <text x={74} y={3} className="font-mono" fontSize={7.5} fill="#5f6b86">
              self-consistent
            </text>
          </g>

          {/* transmission panel */}
          <line x1={340} y1={40} x2={340} y2={270} stroke="rgb(150 172 214 / 0.35)" />
          <line x1={340} y1={270} x2={505} y2={270} stroke="rgb(150 172 214 / 0.35)" />
          {[1, 2, 3].map((m) => (
            <g key={m}>
              <line x1={340 + m * 46} y1={266} x2={340 + m * 46} y2={274} stroke="rgb(150 172 214 / 0.35)" />
              <text x={340 + m * 46} y={284} textAnchor="middle" className="font-mono" fontSize={8} fill="#5f6b86">
                {m}
              </text>
            </g>
          ))}
          <text x={470} y={262} className="font-mono" fontSize={8} fill="#5f6b86">
            T(E)
          </text>
          {windowRects.map((r) => (
            <rect key={r.y} x={340} y={r.y} width={r.m * 46} height={1.05} fill="#bdf264" fillOpacity={0.35} />
          ))}
          <path d={pathFrom(tPath)} stroke="#ece6da" strokeWidth={1.4} fill="none" />
          {EDGES.map((e) => (
            <line key={e} x1={300} y1={e} x2={340} y2={e} stroke="#5f6b86" strokeDasharray="1 3" />
          ))}
          <text x={350} y={52} className="font-mono" fontSize={8} fill="#8e9bb4">
            subband steps
          </text>
        </svg>
      </FigureScroll>

      <div className="grid gap-3 border-t border-line px-3 py-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <Slider label="Drain bias qV (illustrative)" min={0} max={1} step={0.01} value={v} onChange={setV} format={(x) => x.toFixed(2)} />
        <p className="font-mono text-[0.7rem] text-mist">
          I ∝ ∫ T(E)[f₁ − f₂] dE ≈ <span className={cn("tabular-nums", current > 0 ? "text-lime" : "text-fog")}>{current.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
