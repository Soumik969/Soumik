"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";
import { useCanvas } from "@/hooks/useCanvas";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { mulberry32, pathFrom } from "@/lib/math";
import { type CourseProject, pinnBenchmark } from "@/content/courseProjects";

/* Small illustrative figures for the course projects. None are data. */

const VB = "0 0 300 150";
const mono = { className: "font-mono", fontSize: 8, fill: "#5f6b86" } as const;

function Kitaev() {
  const reduced = usePrefersReducedMotion();
  const [topo, setTopo] = useState(true);
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTopo((t) => !t), 3800);
    return () => window.clearInterval(id);
  }, [reduced]);
  const xs = Array.from({ length: 6 }, (_, i) => 36 + i * 46);
  return (
    <svg viewBox={VB} className="h-full w-full" role="img" aria-label={`Kitaev chain in the ${topo ? "topological" : "trivial"} limit`}>
      <text x={12} y={18} {...mono}>
        {topo ? "TOPOLOGICAL · t = Δ, μ = 0" : "TRIVIAL · t = Δ = 0, μ ≠ 0"}
      </text>
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 17} y={58} width={34} height={30} rx={15} fill="none" stroke="rgb(150 172 214 / 0.25)" />
          {!topo && <ellipse cx={x} cy={73} rx={14} ry={8} fill="none" stroke="#ab8dff" strokeOpacity={0.9} style={{ transition: "opacity .5s" }} />}
          {topo && i < xs.length - 1 && <ellipse cx={x + 23} cy={73} rx={15} ry={8} fill="none" stroke="#74e4ff" strokeOpacity={0.9} />}
          <circle cx={x - 7} cy={73} r={3.4} fill={topo && i === 0 ? "#bdf264" : "#74e4ff"} />
          <circle cx={x + 7} cy={73} r={3.4} fill={topo && i === xs.length - 1 ? "#bdf264" : "#ab8dff"} />
          {topo && (i === 0 || i === xs.length - 1) && <circle cx={i === 0 ? x - 7 : x + 7} cy={73} r={9} fill="#bdf264" opacity={0.18} />}
        </g>
      ))}
      {/* BdG spectrum sketch */}
      <line x1={20} y1={124} x2={120} y2={124} stroke="rgb(150 172 214 / 0.2)" />
      {[0, 1, 2].map((k) =>
        [-1, 1].map((s) => (
          <line key={`${k}${s}`} x1={20} x2={120} y1={124 + s * (10 + k * 6)} y2={124 + s * (10 + k * 6)} stroke="#8e9bb4" strokeOpacity={0.45} />
        )),
      )}
      <text x={20} y={100} {...mono}>
        ±E
      </text>
      {topo && <line x1={20} x2={120} y1={124} y2={124} stroke="#bdf264" strokeWidth={2} />}
      <text x={132} y={127} {...mono} fill={topo ? "#bdf264" : "#5f6b86"}>
        {topo ? "zero-energy end modes" : "gapped, no end modes"}
      </text>
    </svg>
  );
}

function Duffing() {
  const ref = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const visible = useInViewport(ref);
  const reduced = usePrefersReducedMotion();
  // x'' + δx' − x + x³ = γ cos ωt  (standard chaotic parameters)
  const st = useRef({ x: 1, v: 0, t: 0, px: 0, py: 0, started: false });
  const size = useCanvas(ref, (ctx) => {
    ctxRef.current = ctx;
    ctx.clearRect(0, 0, size.current.w, size.current.h);
    st.current.started = false;
    if (reduced) {
      for (let i = 0; i < 4000; i++) step(0.02, true);
    }
  });
  const d = 0.3;
  const g = 0.5;
  const w = 1.2;
  const map = (x: number, v: number) => {
    const { w: W, h: H } = size.current;
    return [W / 2 + (x / 1.9) * (W / 2 - 8), H / 2 - (v / 1.6) * (H / 2 - 8)] as const;
  };
  function step(dt: number, drawIt: boolean) {
    const s = st.current;
    const f = (x: number, v: number, t: number) => g * Math.cos(w * t) - d * v + x - x * x * x;
    const k1x = s.v;
    const k1v = f(s.x, s.v, s.t);
    const k2x = s.v + 0.5 * dt * k1v;
    const k2v = f(s.x + 0.5 * dt * k1x, s.v + 0.5 * dt * k1v, s.t + 0.5 * dt);
    const k3x = s.v + 0.5 * dt * k2v;
    const k3v = f(s.x + 0.5 * dt * k2x, s.v + 0.5 * dt * k2v, s.t + 0.5 * dt);
    const k4x = s.v + dt * k3v;
    const k4v = f(s.x + dt * k3x, s.v + dt * k3v, s.t + dt);
    const prevPhase = (s.t * w) % (2 * Math.PI);
    s.x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    s.v += (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    s.t += dt;
    const ctx = ctxRef.current;
    if (!ctx || !drawIt) return;
    const [x, y] = map(s.x, s.v);
    if (s.started) {
      ctx.strokeStyle = "rgba(116,228,255,0.7)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(s.px, s.py);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    if ((s.t * w) % (2 * Math.PI) < prevPhase) {
      ctx.fillStyle = "rgba(189,242,100,1)";
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    }
    s.px = x;
    s.py = y;
    s.started = true;
  }
  useAnimationLoop(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { w: W, h: H } = size.current;
    // Fade previous strokes toward transparency so the trail decays.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.012)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    for (let i = 0; i < 6; i++) step(0.02, true);
  }, visible && !reduced);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={ref}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Phase portrait of a driven Duffing oscillator in its chaotic regime, with Poincaré-section points"
      />
      <span className="absolute top-1 left-2 font-mono text-[0.58rem] text-fog">x″ + δx′ − x + x³ = γ cos ωt · (x, ẋ)</span>
      <span className="absolute right-2 bottom-1 font-mono text-[0.58rem] text-lime">· Poincaré section</span>
    </div>
  );
}

function Klein() {
  const cone = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={28} rx={30} ry={7} fill="none" stroke="#74e4ff" strokeOpacity={0.8} />
      <ellipse cx={cx} cy={122} rx={30} ry={7} fill="none" stroke="#ab8dff" strokeOpacity={0.8} />
      <path d={`M${cx - 30} 28 L${cx + 30} 122 M${cx + 30} 28 L${cx - 30} 122`} stroke="#ece6da" strokeOpacity={0.45} />
      {[0.33, 0.66].map((f) => (
        <g key={f}>
          <ellipse cx={cx} cy={75 - 47 * f} rx={30 * f} ry={7 * f} fill="none" stroke="#74e4ff" strokeOpacity={0.35} />
          <ellipse cx={cx} cy={75 + 47 * f} rx={30 * f} ry={7 * f} fill="none" stroke="#ab8dff" strokeOpacity={0.35} />
        </g>
      ))}
      <circle cx={cx} cy={75} r={2.5} fill="#bdf264" />
    </g>
  );
  return (
    <svg
      viewBox={VB}
      className="h-full w-full"
      role="img"
      aria-label="Dirac cones of graphene and a potential barrier with perfect transmission at normal incidence"
    >
      {cone(52)}
      {cone(128)}
      <text x={24} y={146} {...mono}>
        K
      </text>
      <text x={124} y={146} {...mono}>
        K′
      </text>
      {/* barrier */}
      <rect x={210} y={34} width={30} height={82} fill="#ab8dff" fillOpacity={0.12} stroke="#ab8dff" strokeOpacity={0.5} />
      <text x={214} y={28} {...mono}>
        V₀
      </text>
      <line x1={172} y1={75} x2={286} y2={75} stroke="#bdf264" strokeWidth={1.4} className="flow-dash" />
      <path d="M280 71 L287 75 L280 79" stroke="#bdf264" fill="none" />
      <text x={172} y={134} {...mono} fill="#bdf264">
        normal incidence: T = 1
      </text>
    </svg>
  );
}

function OrbitalHall() {
  const rand = mulberry32(7);
  const flows = Array.from({ length: 7 }, (_, i) => ({ y: 62 + i * 4.5, dur: 2.6 + rand() * 1.6, delay: rand() * 2.5 }));
  const up = Array.from({ length: 5 }, (_, i) => ({ x: 50 + i * 50, delay: i * 0.55 }));
  return (
    <svg viewBox={VB} className="h-full w-full" role="img" aria-label="Charge current along a slab producing transverse orbital angular momentum accumulation">
      <rect x={20} y={40} width={260} height={70} fill="#74e4ff" fillOpacity={0.03} stroke="rgb(150 172 214 / 0.35)" />
      {flows.map((f, i) => (
        <circle
          key={i}
          cx={24}
          cy={f.y}
          r={1.8}
          fill="#ece6da"
          className="drift-right"
          style={{ ["--dist" as string]: "250px", ["--dur" as string]: `${f.dur}s`, ["--delay" as string]: `${f.delay}s` }}
        />
      ))}
      {up.map((u, i) => (
        <g key={i}>
          <g className="drift-v" style={{ ["--dy" as string]: "-24px", ["--delay" as string]: `${u.delay}s` }}>
            <path d={`M${u.x - 5} 46 a5 5 0 1 1 5 5`} stroke="#bdf264" fill="none" />
            <path d={`M${u.x - 2} 51 l2 0 l-1 -2.5`} stroke="#bdf264" fill="none" />
          </g>
          <g className="drift-v" style={{ ["--dy" as string]: "24px", ["--delay" as string]: `${u.delay + 0.3}s` }}>
            <path d={`M${u.x + 5} 104 a5 5 0 1 0 -5 5`} stroke="#e46fd6" fill="none" />
          </g>
        </g>
      ))}
      <text x={20} y={20} {...mono}>
        J_c → · orbital currents ⊥
      </text>
      <text x={284} y={36} textAnchor="end" {...mono} fill="#bdf264">
        +L
      </text>
      <text x={284} y={126} textAnchor="end" {...mono} fill="#e46fd6">
        −L
      </text>
      <text x={20} y={142} {...mono}>
        no net spin polarization required
      </text>
    </svg>
  );
}

function Binary() {
  const [dissimilar, setDissimilar] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setDissimilar((d) => !d), 6000);
    return () => window.clearInterval(id);
  }, [reduced]);
  const a = 70;
  const m1 = 1;
  const m2 = dissimilar ? 0.2 : 1;
  const r1 = (a * m2) / (m1 + m2);
  const r2 = (a * m1) / (m1 + m2);
  const cx = 150;
  const cy = 76;
  return (
    <svg
      viewBox={VB}
      className="h-full w-full"
      role="img"
      aria-label={`Two-body orbit, ${dissimilar ? "dissimilar" : "similar"} masses, on a TFT-style display`}
    >
      <rect x={60} y={8} width={180} height={134} rx={4} fill="#03050a" stroke="rgb(150 172 214 / 0.35)" />
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1={62} x2={238} y1={12 + i * 6} y2={12 + i * 6} stroke="#74e4ff" strokeOpacity={0.04} />
      ))}
      <circle cx={cx} cy={cy} r={r1} fill="none" stroke="#74e4ff" strokeOpacity={0.3} strokeDasharray="2 3" style={{ transition: "r .8s" }} />
      <circle cx={cx} cy={cy} r={r2} fill="none" stroke="#ab8dff" strokeOpacity={0.3} strokeDasharray="2 3" style={{ transition: "r .8s" }} />
      <g className={reduced ? undefined : "orbit-spin"} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx - r1} cy={cy} r={dissimilar ? 7 : 5} fill="#74e4ff" style={{ transition: "all .8s" }} />
        <circle cx={cx + r2} cy={cy} r={dissimilar ? 3 : 5} fill="#ab8dff" style={{ transition: "all .8s" }} />
      </g>
      <path d={`M${cx - 3} ${cy} h6 M${cx} ${cy - 3} v6`} stroke="#ece6da" strokeOpacity={0.6} />
      <text x={68} y={22} {...mono} fill="#74e4ff">
        ARDUINO TFT
      </text>
      <text x={232} y={136} textAnchor="end" {...mono}>
        {dissimilar ? "m₂/m₁ = 0.2" : "m₂/m₁ = 1"}
      </text>
    </svg>
  );
}

function PINN() {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInViewport(ref);
  const reduced = usePrefersReducedMotion();
  const [p, setP] = useState(reduced ? 1 : 0);
  useAnimationLoop((_, dt) => setP((v) => (v >= 1.35 ? 0 : v + dt * 0.28)), visible && !reduced);
  const prog = Math.min(1, reduced ? 1 : p);
  const X = (x: number) => 14 + ((x + 4) / 8) * 172;
  const Y = (y: number) => 112 - y * 70;
  const target: [number, number][] = [];
  const pred: [number, number][] = [];
  for (let i = 0; i <= 80; i++) {
    const x = -4 + (i / 80) * 8;
    const psi = Math.exp(-(x * x) / 2);
    const noise = (1 - prog) ** 1.6 * (0.35 * Math.sin(3.1 * x + 1) + 0.22 * Math.cos(5.3 * x) + 0.18 * Math.sin(1.3 * x - 0.4));
    target.push([X(x), Y(psi)]);
    pred.push([X(x), Y(psi + noise)]);
  }
  const maxLog = Math.log10(0.05);
  const minLog = Math.log10(0.0005);
  return (
    <svg
      ref={ref}
      viewBox={VB}
      className="h-full w-full"
      role="img"
      aria-label="A network prediction converging to the harmonic-oscillator ground state, and the MSE values reported in the CV"
    >
      <line x1={14} y1={112} x2={186} y2={112} stroke="rgb(150 172 214 / 0.25)" />
      <path d={pathFrom(target)} stroke="#ece6da" strokeOpacity={0.5} strokeDasharray="3 3" fill="none" />
      <path d={pathFrom(pred)} stroke="#74e4ff" strokeWidth={1.4} fill="none" />
      <text x={14} y={20} {...mono}>
        ψ₀(x) target · network output
      </text>
      <text x={14} y={136} {...mono}>
        epoch {Math.round(prog * 1000)}
      </text>
      {/* MSE comparison (values from the CV) */}
      <text x={198} y={20} {...mono}>
        MSE · log
      </text>
      <text x={198} y={142} {...mono}>
        lower is better
      </text>
      {pinnBenchmark.map((b, i) => {
        const w = ((Math.log10(b.mse) - minLog) / (maxLog - minLog)) * 86;
        return (
          <g key={b.model}>
            <rect x={198} y={34 + i * 34} width={Math.max(4, w)} height={8} fill={i === 0 ? "#bdf264" : "#5f6b86"} />
            <text x={198} y={30 + i * 34} {...mono} fill={i === 0 ? "#bdf264" : "#8e9bb4"}>
              {b.model}
            </text>
            <text x={198} y={54 + i * 34} {...mono}>
              {b.mse}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MFCC() {
  const rand = mulberry32(203);
  const cols = 30;
  const rows = 13;
  const cells = Array.from({ length: rows * cols }, (_, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const v = 0.5 + 0.5 * Math.sin(c * 0.55 + r * 0.9) * Math.cos(c * 0.21 - r * 0.4) + (rand() - 0.5) * 0.3;
    return { r, c, v: Math.max(0, Math.min(1, v)) };
  });
  return (
    <svg viewBox={VB} className="h-full w-full" role="img" aria-label="Scrolling MFCC feature map">
      <clipPath id="mfcc-clip">
        <rect x={34} y={18} width={252} height={104} />
      </clipPath>
      <g clipPath="url(#mfcc-clip)">
        <g className="scroll-left">
          {[0, 1].map((rep) =>
            cells.map((cell) => (
              <rect
                key={`${rep}-${cell.r}-${cell.c}`}
                x={34 + (rep * cols + cell.c) * 8}
                y={18 + cell.r * 8}
                width={7}
                height={7}
                fill={cell.v > 0.66 ? "#bdf264" : cell.v > 0.33 ? "#74e4ff" : "#ab8dff"}
                fillOpacity={0.06 + cell.v * 0.42}
              />
            )),
          )}
        </g>
      </g>
      <text x={8} y={26} {...mono}>
        c1
      </text>
      <text x={8} y={122} {...mono}>
        c13
      </text>
      <text x={34} y={140} {...mono}>
        t →
      </text>
      <text x={286} y={140} textAnchor="end" {...mono}>
        SVM · KNN · RF
      </text>
    </svg>
  );
}

export default function TheoryVisual({ kind }: { kind: CourseProject["visual"] }) {
  switch (kind) {
    case "kitaev":
      return <Kitaev />;
    case "duffing":
      return <Duffing />;
    case "klein":
      return <Klein />;
    case "orbitalHall":
      return <OrbitalHall />;
    case "binary":
      return <Binary />;
    case "pinn":
      return <PINN />;
    default:
      return <MFCC />;
  }
}
