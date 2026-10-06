"use client";

import { useEffect, useRef } from "react";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";
import { useCanvas } from "@/hooks/useCanvas";
import { useInViewport } from "@/hooks/useInViewport";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/*
 * |ψ(x, y, t)|² sampled on a square lattice. ψ is a superposition of circular
 * waves from two fixed sources plus a third source that follows the cursor,
 * so moving the pointer reshapes the interference pattern. Purely illustrative.
 */

const CYAN = [116, 228, 255];
const VIOLET = [171, 141, 255];
const LEVELS = 14;

function palette(rgb: number[]) {
  return Array.from({ length: LEVELS }, (_, i) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(0.08 + (0.85 * (i + 1)) / LEVELS).toFixed(3)})`);
}
const PAL_C = palette(CYAN);
const PAL_V = palette(VIOLET);

export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const visible = useInViewport(canvasRef, "0px");
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, amp: 0, tamp: 0, inside: false });
  const buckets = useRef<Float32Array[]>([]);
  const counts = useRef<Int32Array>(new Int32Array(LEVELS * 2));

  const size = useCanvas(canvasRef, (ctx, s) => {
    ctxRef.current = ctx;
    pointer.current.x = pointer.current.tx = s.w * 0.72;
    pointer.current.y = pointer.current.ty = s.h * 0.5;
    draw(1.2);
  });

  // Pointer tracking (window-level so the overlaid text does not block it).
  useEffect(() => {
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      const c = canvasRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      const p = pointer.current;
      p.inside = inside;
      if (inside) {
        p.tx = x;
        p.ty = y;
        p.tamp = 0.95;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine]);

  function draw(t: number) {
    const ctx = ctxRef.current;
    const { w, h } = size.current;
    if (!ctx || w < 2) return;
    const p = pointer.current;
    const narrow = w < 768;
    const s = narrow ? 24 : 19;
    const cols = Math.ceil(w / s) + 1;
    const rows = Math.ceil(h / s) + 1;
    const k = (Math.PI * 2) / (narrow ? 58 : 50);
    const omega = 1.25;

    const sources = [
      { x: w * (narrow ? 0.3 : 0.58), y: h * (narrow ? 0.2 : 0.3), a: 1 },
      { x: w * (narrow ? 0.85 : 0.84), y: h * (narrow ? 0.34 : 0.22), a: 1 },
      { x: p.x, y: p.y, a: p.amp },
    ];
    const norm = 1 / (sources[0].a + sources[1].a + sources[2].a);

    const capacity = cols * rows * 2;
    if (buckets.current.length !== LEVELS * 2 || buckets.current[0].length < capacity) {
      buckets.current = Array.from({ length: LEVELS * 2 }, () => new Float32Array(capacity));
    }
    const cnt = counts.current;
    cnt.fill(0);

    ctx.clearRect(0, 0, w, h);

    // Faint base lattice.
    ctx.fillStyle = "rgba(150,172,214,0.13)";
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) ctx.fillRect(i * s - 0.5, j * s - 0.5, 1, 1);

    for (let j = 0; j < rows; j++) {
      const y = j * s;
      for (let i = 0; i < cols; i++) {
        const x = i * s;
        let re = 0;
        let im = 0;
        for (let q = 0; q < 3; q++) {
          const src = sources[q];
          if (src.a < 0.01) continue;
          const dx = x - src.x;
          const dy = y - src.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const amp = src.a / Math.sqrt(1 + d / 90);
          const ph = k * d - omega * t;
          re += amp * Math.cos(ph);
          im += amp * Math.sin(ph);
        }
        re *= norm;
        im *= norm;
        const rho = (re * re + im * im) * 3.4;
        if (rho < 0.06) continue;
        const level = Math.min(LEVELS - 1, Math.floor(rho * LEVELS));
        const b = (re >= 0 ? 0 : LEVELS) + level;
        const arr = buckets.current[b];
        const n = cnt[b];
        arr[n * 2] = x;
        arr[n * 2 + 1] = y;
        cnt[b] = n + 1;
      }
    }

    for (let b = 0; b < LEVELS * 2; b++) {
      const n = cnt[b];
      if (!n) continue;
      const level = b % LEVELS;
      ctx.fillStyle = b < LEVELS ? PAL_C[level] : PAL_V[level];
      const sz = 1 + (level / LEVELS) * 3;
      const half = sz / 2;
      const arr = buckets.current[b];
      for (let m = 0; m < n; m++) ctx.fillRect(arr[m * 2] - half, arr[m * 2 + 1] - half, sz, sz);
    }

    // Wavefront rings and source markers.
    ctx.lineWidth = 1;
    const lambda = (Math.PI * 2) / k;
    for (let q = 0; q < 2; q++) {
      const src = sources[q];
      for (let r = 0; r < 3; r++) {
        const rad = ((t * omega) / k + r * lambda) % (lambda * 3);
        ctx.strokeStyle = `rgba(116,228,255,${(0.16 * (1 - rad / (lambda * 3))).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(src.x, src.y, rad + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(236,230,218,0.55)";
      ctx.beginPath();
      ctx.moveTo(src.x - 6, src.y);
      ctx.lineTo(src.x + 6, src.y);
      ctx.moveTo(src.x, src.y - 6);
      ctx.lineTo(src.x, src.y + 6);
      ctx.stroke();
      ctx.fillStyle = "rgba(142,155,180,0.9)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`S${q + 1}`, src.x + 9, src.y - 8);
    }

    if (p.amp > 0.05) {
      ctx.strokeStyle = `rgba(189,242,100,${(0.6 * p.amp).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(189,242,100,${(0.8 * p.amp).toFixed(3)})`;
      ctx.fillText("PROBE", p.x + 14, p.y + 3);
    }
  }

  useAnimationLoop((t, dt) => {
    const p = pointer.current;
    const ease = 1 - Math.pow(0.001, dt);
    p.x += (p.tx - p.x) * ease * 0.6;
    p.y += (p.ty - p.y) * ease * 0.6;
    if (!p.inside) p.tamp = 0;
    p.amp += (p.tamp - p.amp) * ease * 0.35;
    draw(t);
  }, visible && !reduced);

  return <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />;
}
