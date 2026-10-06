"use client";

import { AnimatePresence, motion } from "motion/react";
import { FigureScroll } from "@/components/ui/FigureScroll";
import { useEffect, useState } from "react";
import { Segmented } from "@/components/ui/Controls";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { pathFrom } from "@/lib/math";

/*
 * Schematic k-space for Boltzmann transport: a field displaces the Fermi
 * surface by δk = −eEτ/ħ and scattering relaxes it. Umklapp processes fold
 * k + q back into the zone by a reciprocal-lattice vector G.
 * Right: the textbook shape of ρ(T) (Matthiessen's rule), not data.
 */

type Mode = "impurity" | "phonon" | "umklapp";

const C = 140;
const HALF = 108;
const KF = 70;

const at = (deg: number, r = KF, ox = 0): [number, number] => [C + ox + r * Math.cos((deg * Math.PI) / 180), C - r * Math.sin((deg * Math.PI) / 180)];

const EVENTS: Record<Mode, { from: number; to: number }[]> = {
  impurity: [
    { from: 30, to: 140 },
    { from: 200, to: 290 },
    { from: 100, to: 330 },
  ],
  phonon: [
    { from: 60, to: 95 },
    { from: 250, to: 210 },
    { from: 330, to: 10 },
  ],
  umklapp: [{ from: 18, to: 0 }],
};

// ρ(T) schematic: residual + low-T power law crossing over to linear.
const RHO = (() => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const T = i / 100;
    const ph = T < 0.35 ? 0.35 * Math.pow(T / 0.35, 5) * 0.32 : 0.112 + (T - 0.35) * 1.05;
    const rho = 0.12 + ph + 0.08 * T * T;
    pts.push([310 + T * 190, 250 - rho * 180]);
  }
  return pathFrom(pts);
})();

export default function FermiSurface() {
  const [mode, setMode] = useState<Mode>("umklapp");
  const [field, setField] = useState(true);
  const [ev, setEv] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setEv((e) => e + 1), 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  const shift = field ? 14 : 0;
  const list = EVENTS[mode];
  const e = list[ev % list.length];
  const [x1, y1] = at(e.from, KF, shift);
  const [x2, y2] = at(e.to, mode === "phonon" ? KF + 6 : KF, shift);

  // Umklapp geometry: k + q leaves the zone, −G folds it back.
  const kq: [number, number] = [C + HALF + 52, y1 - 6];
  const folded: [number, number] = [kq[0] - 2 * HALF, kq[1]];

  return (
    <div>
      <FigureScroll>
        <svg
          viewBox="0 0 520 290"
          className="block w-full select-none"
          role="img"
          aria-label={`Schematic Fermi surface in the first Brillouin zone showing ${mode} scattering.`}
        >
          <defs>
            <marker id="fs-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 Z" fill="#bdf264" />
            </marker>
            <marker id="fs-arrow-v" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 Z" fill="#e46fd6" />
            </marker>
          </defs>

          {/* Brillouin zone + neighbours */}
          <rect x={C - HALF} y={C - HALF} width={2 * HALF} height={2 * HALF} fill="#74e4ff" fillOpacity={0.03} stroke="rgb(150 172 214 / 0.45)" />
          <rect x={C + HALF} y={C - HALF} width={60} height={2 * HALF} fill="none" stroke="rgb(150 172 214 / 0.15)" strokeDasharray="3 4" />
          <text x={C - HALF + 6} y={C - HALF + 14} className="font-mono" fontSize={8} fill="#5f6b86">
            1st BZ
          </text>
          <text x={C + 4} y={C + 12} className="font-mono" fontSize={8} fill="#5f6b86">
            Γ
          </text>
          <line x1={C - HALF} y1={C} x2={C + HALF} y2={C} stroke="rgb(150 172 214 / 0.12)" />
          <line x1={C} y1={C - HALF} x2={C} y2={C + HALF} stroke="rgb(150 172 214 / 0.12)" />

          {/* Fermi surfaces */}
          <circle cx={C} cy={C} r={KF} fill="none" stroke="#ece6da" strokeOpacity={field ? 0.25 : 0.7} strokeDasharray={field ? "3 4" : undefined} />
          <motion.circle cy={C} r={KF} initial={false} animate={{ cx: C + shift }} fill="#74e4ff" fillOpacity={0.07} stroke="#74e4ff" strokeOpacity={0.8} />
          {field && (
            <g>
              <line x1={C} y1={C + KF + 14} x2={C + shift} y2={C + KF + 14} stroke="#74e4ff" markerEnd="url(#fs-arrow)" />
              <text x={C - 30} y={C + KF + 28} className="font-mono" fontSize={8} fill="#74e4ff">
                δk = −eEτ/ħ
              </text>
            </g>
          )}

          <AnimatePresence mode="wait">
            <motion.g key={`${mode}-${ev}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <circle cx={x1} cy={y1} r={4} fill="#ece6da" />
              <text x={x1 + 6} y={y1 - 6} className="font-mono" fontSize={9} fill="#ece6da">
                k
              </text>
              {mode === "umklapp" ? (
                <>
                  <motion.line
                    x1={x1}
                    y1={y1}
                    initial={{ x2: x1, y2: y1 }}
                    animate={{ x2: kq[0], y2: kq[1] }}
                    transition={{ duration: 0.7 }}
                    stroke="#bdf264"
                    strokeDasharray="4 3"
                    markerEnd="url(#fs-arrow)"
                  />
                  <text x={(x1 + kq[0]) / 2 - 4} y={y1 - 14} className="font-mono" fontSize={9} fill="#bdf264">
                    q
                  </text>
                  <circle cx={kq[0]} cy={kq[1]} r={3.5} fill="none" stroke="#bdf264" />
                  <text x={kq[0] - 14} y={kq[1] + 18} className="font-mono" fontSize={8} fill="#bdf264">
                    k + q
                  </text>
                  <motion.line
                    x1={kq[0]}
                    y1={kq[1] + 30}
                    initial={{ x2: kq[0], opacity: 0 }}
                    animate={{ x2: folded[0] + 6, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.9 }}
                    y2={kq[1] + 30}
                    stroke="#e46fd6"
                    markerEnd="url(#fs-arrow-v)"
                  />
                  <motion.text
                    x={C - 8}
                    y={kq[1] + 44}
                    className="font-mono"
                    fontSize={9}
                    fill="#e46fd6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    −G
                  </motion.text>
                  <motion.circle cx={folded[0]} cy={folded[1]} r={4} fill="#e46fd6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} />
                  <motion.text
                    x={folded[0] + 7}
                    y={folded[1] - 6}
                    className="font-mono"
                    fontSize={9}
                    fill="#e46fd6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    k′
                  </motion.text>
                </>
              ) : (
                <>
                  <motion.line
                    x1={x1}
                    y1={y1}
                    initial={{ x2: x1, y2: y1 }}
                    animate={{ x2, y2 }}
                    transition={{ duration: 0.8 }}
                    stroke="#bdf264"
                    strokeDasharray={mode === "phonon" ? "2 3" : undefined}
                    markerEnd="url(#fs-arrow)"
                  />
                  <motion.circle cx={x2} cy={y2} r={4} fill="#bdf264" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                  <text x={x2 + 6} y={y2 - 6} className="font-mono" fontSize={9} fill="#bdf264">
                    k′
                  </text>
                </>
              )}
            </motion.g>
          </AnimatePresence>

          {/* ρ(T) schematic */}
          <g>
            <line x1={310} y1={250} x2={505} y2={250} stroke="rgb(150 172 214 / 0.35)" />
            <line x1={310} y1={60} x2={310} y2={250} stroke="rgb(150 172 214 / 0.35)" />
            <text x={314} y={56} className="font-mono" fontSize={8} fill="#5f6b86">
              ρ(T) · schematic
            </text>
            <text x={488} y={264} className="font-mono" fontSize={8} fill="#5f6b86">
              T
            </text>
            <path d={RHO} stroke="#ece6da" strokeOpacity={0.8} strokeWidth={1.3} fill="none" />
            <line x1={310} y1={228} x2={505} y2={228} stroke="#74e4ff" strokeOpacity={mode === "impurity" ? 0.8 : 0.2} strokeDasharray="3 3" />
            <text x={440} y={242} className="font-mono" fontSize={8} fill={mode === "impurity" ? "#74e4ff" : "#5f6b86"}>
              ρ₀ · impurities
            </text>
            <text x={344} y={208} className="font-mono" fontSize={8} fill={mode === "phonon" ? "#bdf264" : "#5f6b86"}>
              ∝ T⁵
            </text>
            <text x={472} y={124} className="font-mono" fontSize={8} fill={mode === "phonon" ? "#bdf264" : "#5f6b86"}>
              ∝ T
            </text>
            <text x={330} y={100} className="font-mono" fontSize={8} fill={mode === "umklapp" ? "#e46fd6" : "#5f6b86"}>
              + e–e (Umklapp): ∝ T²
            </text>
          </g>
        </svg>
      </FigureScroll>

      <div className="flex flex-wrap items-center gap-3 border-t border-line px-3 py-3">
        <Segmented
          label="Scattering channel"
          value={mode}
          onChange={setMode}
          options={[
            { value: "impurity", label: "Impurity" },
            { value: "phonon", label: "e–phonon" },
            { value: "umklapp", label: "Umklapp" },
          ]}
        />
        <button
          type="button"
          aria-pressed={field}
          onClick={() => setField((f) => !f)}
          className={cn("label-sm border px-3 py-2 transition-colors", field ? "border-cyan text-cyan" : "border-line-strong text-mist")}
        >
          Field {field ? "on" : "off"}
        </button>
        <p className="w-full text-[0.82rem] leading-relaxed text-mist">
          {mode === "impurity" && "Elastic scattering between points of the Fermi surface — sets the residual resistivity ρ₀."}
          {mode === "phonon" && "Electron–phonon scattering exchanges a phonon of momentum q: ρ ∝ T⁵ at low T and ∝ T at high T."}
          {mode === "umklapp" && "When k + q leaves the zone it is folded back by a reciprocal-lattice vector G; such processes relax total crystal momentum."}
        </p>
      </div>
    </div>
  );
}
