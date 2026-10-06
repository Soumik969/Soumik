"use client";

import { motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Segmented, Slider } from "@/components/ui/Controls";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";
import { useCanvas } from "@/hooks/useCanvas";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { type Boundary, Chains, spectrum } from "@/lib/hatanoNelson";
import { pathFrom } from "@/lib/math";

/*
 * Signature interaction 1 — the non-Hermitian skin effect.
 * Nine independent Hatano–Nelson chains evolve in real time. With open
 * boundaries every wave packet drifts to the right edge and stays there; with
 * periodic boundaries the weight keeps circulating. The complex-energy plane
 * shows the matching spectra (exact formulas).
 */

const N = 28;
const ROWS = 9;
const T = 1;
const DT = 0.05;

// Complex plane mapping (E in [-2.4, 2.4] × [-1.9, 1.9]).
const SW = 260;
const SH = 200;
const ex = (re: number) => SW / 2 + (re / 2.4) * (SW / 2 - 14);
const ey = (im: number) => SH / 2 - (im / 1.9) * (SH / 2 - 14);

export default function SkinEffectLattice() {
  const [boundary, setBoundary] = useState<Boundary>("obc");
  const [gamma, setGamma] = useState(0.45);
  const [running, setRunning] = useState(true);
  const [history, setHistory] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sim = useRef<Chains | null>(null);
  const frame = useRef(0);
  const visible = useInViewport(canvasRef);
  const reduced = usePrefersReducedMotion();
  const params = useRef({ boundary, gamma });

  useEffect(() => {
    params.current = { boundary, gamma };
  }, [boundary, gamma]);

  const size = useCanvas(canvasRef, (ctx) => {
    ctxRef.current = ctx;
    draw();
  });

  function getSim() {
    if (!sim.current) sim.current = new Chains(ROWS, N);
    return sim.current;
  }

  function draw() {
    const ctx = ctxRef.current;
    const { w, h } = size.current;
    if (!ctx || w < 2) return;
    const s = getSim();
    const { boundary: b, gamma: g } = params.current;
    const padX = 26;
    const padY = 18;
    const dx = (w - padX * 2) / (N - 1);
    const dy = (h - padY * 2) / (ROWS - 1);
    const maxR = Math.min(dx, dy) * 0.95;

    ctx.clearRect(0, 0, w, h);

    // Boundaries: walls (OBC) or wrap-around arcs (PBC).
    ctx.lineWidth = 1;
    if (b === "obc") {
      ctx.strokeStyle = "rgba(236,230,218,0.5)";
      ctx.beginPath();
      ctx.moveTo(padX - 12, padY - 8);
      ctx.lineTo(padX - 12, h - padY + 8);
      ctx.moveTo(w - padX + 12, padY - 8);
      ctx.lineTo(w - padX + 12, h - padY + 8);
      ctx.stroke();
    }

    for (let r = 0; r < ROWS; r++) {
      const y = padY + r * dy;
      // Bonds; brightness encodes the stronger (rightward) hopping.
      ctx.strokeStyle = `rgba(116,228,255,${(0.1 + g * 0.25).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(w - padX, y);
      ctx.stroke();
      if (b === "pbc") {
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = "rgba(116,228,255,0.35)";
        ctx.beginPath();
        ctx.moveTo(w - padX, y);
        ctx.quadraticCurveTo(w - padX + 16, y - dy * 0.45, w - padX + 8, y - dy * 0.5);
        ctx.moveTo(padX, y);
        ctx.quadraticCurveTo(padX - 16, y - dy * 0.45, padX - 8, y - dy * 0.5);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      // Direction ticks on a few bonds.
      ctx.fillStyle = "rgba(116,228,255,0.45)";
      for (let j = 2; j < N - 1; j += 6) {
        const x = padX + (j + 0.5) * dx;
        ctx.beginPath();
        ctx.moveTo(x + 3, y);
        ctx.lineTo(x - 2, y - 2.5);
        ctx.lineTo(x - 2, y + 2.5);
        ctx.fill();
      }
      for (let j = 0; j < N; j++) {
        const x = padX + j * dx;
        const rho = s.density(r, j);
        ctx.fillStyle = "rgba(150,172,214,0.35)";
        ctx.fillRect(x - 1, y - 1, 2, 2);
        if (rho > 0.002) {
          const rad = Math.min(maxR, Math.sqrt(rho) * maxR * 1.25);
          const grd = ctx.createRadialGradient(x, y, 0, x, y, rad);
          const hot = rho > 0.25;
          grd.addColorStop(0, hot ? "rgba(189,242,100,0.95)" : "rgba(116,228,255,0.9)");
          grd.addColorStop(1, "rgba(116,228,255,0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Site index ticks.
    ctx.fillStyle = "rgba(95,107,134,0.9)";
    ctx.font = "9px ui-monospace, monospace";
    ctx.fillText("j = 1", padX - 10, h - 3);
    ctx.fillText(`j = ${N}`, w - padX - 22, h - 3);
  }

  useAnimationLoop(
    () => {
      const s = getSim();
      const { boundary: b, gamma: g } = params.current;
      s.step(DT, T, g, b);
      s.step(DT, T, g, b);
      draw();
      frame.current++;
      if (frame.current % 6 === 0) {
        const e = s.edgeWeight();
        setHistory((h) => [...h.slice(-59), e]);
      }
    },
    visible && running && !reduced,
  );

  // Reduced motion: jump straight to the long-time state for the current settings.
  useEffect(() => {
    if (!reduced) return;
    const s = getSim();
    s.inject();
    for (let i = 0; i < 500; i++) s.step(DT, T, gamma, boundary);
    draw();
    const id = window.setTimeout(() => setHistory([s.edgeWeight()]), 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, boundary, gamma]);

  const reinject = () => {
    getSim().inject();
    setHistory([]);
    draw();
  };

  const pbcCurve = pathFrom(
    Array.from({ length: 121 }, (_, i) => {
      const k = (i / 120) * Math.PI * 2;
      return [ex(2 * T * Math.cos(k)), ey(-2 * gamma * Math.sin(k))] as [number, number];
    }),
  );
  const points = spectrum(N, T, gamma, boundary);
  const edge = history.length ? history[history.length - 1] : 0;
  const spark = pathFrom(history.map((v, i) => [i * (120 / 59), 26 - v * 24] as [number, number]));

  return (
    <div>
      <div className="relative aspect-[28/10] w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`Nine Hatano–Nelson chains with ${boundary === "obc" ? "open" : "periodic"} boundaries; probability density shown at each site.`}
        />
        <span className="pointer-events-none absolute top-0.5 left-3 font-mono text-[0.62rem] text-fog">t_R = t + γ → · ← t_L = t − γ</span>
        <span className="pointer-events-none absolute top-0.5 right-3 font-mono text-[0.62rem] text-fog">
          {boundary === "obc" ? "open boundaries" : "periodic boundaries"}
        </span>
      </div>

      <div className="grid gap-4 border-t border-line px-3 py-3 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              label="Boundary conditions"
              value={boundary}
              onChange={(v) => {
                setBoundary(v);
                reinject();
              }}
              options={[
                { value: "pbc", label: "PBC" },
                { value: "obc", label: "OBC" },
              ]}
            />
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="label-sm flex items-center gap-1.5 border border-line-strong px-3 py-2 text-mist hover:text-paper"
              aria-pressed={!running}
            >
              {running ? <Pause size={11} aria-hidden /> : <Play size={11} aria-hidden />} {running ? "Pause" : "Run"}
            </button>
            <button
              type="button"
              onClick={reinject}
              className="label-sm flex items-center gap-1.5 border border-line-strong px-3 py-2 text-mist hover:text-paper"
            >
              <RotateCcw size={11} aria-hidden /> Re-inject
            </button>
          </div>
          <Slider label="Non-reciprocity γ / t" min={0} max={0.9} step={0.01} value={gamma} onChange={setGamma} format={(v) => v.toFixed(2)} />
          <div className="flex items-end gap-4">
            <div>
              <p className="label-sm text-fog">Weight on last 3 sites</p>
              <p className="mt-1 font-mono text-2xl text-paper tabular-nums">
                {(edge * 100).toFixed(0)}
                <span className="text-sm text-fog">%</span>
              </p>
              <p className="label-sm text-fog">uniform ≈ {((3 / N) * 100).toFixed(0)}%</p>
            </div>
            <svg viewBox="0 0 120 28" className="h-8 w-32" aria-hidden>
              <line x1={0} y1={26 - (3 / N) * 24} x2={120} y2={26 - (3 / N) * 24} stroke="#5f6b86" strokeDasharray="2 3" />
              <path d={spark} stroke="#bdf264" fill="none" strokeWidth={1.2} />
            </svg>
          </div>
          <p className="text-[0.82rem] leading-relaxed text-mist">
            {boundary === "obc"
              ? "Open boundaries: the spectrum collapses onto the real axis and every eigenstate is exponentially localized at the right edge — the skin effect."
              : "Periodic boundaries: the spectrum encloses a loop in the complex plane (non-zero point-gap winding) and the weight keeps circulating instead of accumulating."}
          </p>
        </div>

        <figure className="border border-line bg-ink-950/60">
          <svg viewBox={`0 0 ${SW} ${SH}`} className="block w-full md:w-[260px]" role="img" aria-label="Complex energy spectrum">
            <line x1={10} y1={SH / 2} x2={SW - 10} y2={SH / 2} stroke="rgb(150 172 214 / 0.3)" />
            <line x1={SW / 2} y1={10} x2={SW / 2} y2={SH - 10} stroke="rgb(150 172 214 / 0.3)" />
            <text x={SW - 40} y={SH / 2 - 6} className="font-mono" fontSize={8} fill="#5f6b86">
              Re E
            </text>
            <text x={SW / 2 + 5} y={18} className="font-mono" fontSize={8} fill="#5f6b86">
              Im E
            </text>
            <path
              d={pbcCurve}
              fill="none"
              stroke="#ab8dff"
              strokeOpacity={boundary === "pbc" ? 0.6 : 0.18}
              strokeDasharray={boundary === "pbc" ? undefined : "3 4"}
            />
            {boundary === "pbc" && gamma > 0.05 && (
              <path
                d={`M${ex(1.414 * T) - 5} ${ey(-1.414 * gamma) - 6} L${ex(1.414 * T)} ${ey(-1.414 * gamma)} L${ex(1.414 * T) - 7} ${ey(-1.414 * gamma) + 1}`}
                stroke="#ab8dff"
                fill="none"
              />
            )}
            {points.map(([re, im], i) => (
              <motion.circle
                key={i}
                r={2.6}
                fill={boundary === "pbc" ? "#ab8dff" : "#bdf264"}
                initial={false}
                animate={{ cx: ex(re), cy: ey(im) }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: i * 0.008 }}
              />
            ))}
          </svg>
          <figcaption className="border-t border-line px-2 py-1.5 font-mono text-[0.6rem] leading-relaxed text-fog">
            PBC: E = 2t cos k − 2iγ sin k
            <br />
            OBC: E = 2√(t² − γ²) cos(nπ/(N+1))
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
