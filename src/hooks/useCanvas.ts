"use client";

import { type RefObject, useEffect, useRef } from "react";

export type CanvasSize = { w: number; h: number; dpr: number };

/**
 * Keeps a canvas' backing store in sync with its CSS size and device pixel
 * ratio. Returns a ref with the current CSS size; `onResize` fires after each change.
 */
export function useCanvas(ref: RefObject<HTMLCanvasElement | null>, onResize?: (ctx: CanvasRenderingContext2D, size: CanvasSize) => void, maxDpr = 2) {
  const size = useRef<CanvasSize>({ w: 0, h: 0, dpr: 1 });
  const resizeCb = useRef(onResize);
  useEffect(() => {
    resizeCb.current = onResize;
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const apply = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size.current = { w, h, dpr };
      resizeCb.current?.(ctx, size.current);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [ref, maxDpr]);

  return size;
}
