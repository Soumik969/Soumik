"use client";

import { useEffect, useRef } from "react";

/**
 * requestAnimationFrame loop that only runs while `active` is true and the tab
 * is visible. The callback receives elapsed seconds and the frame delta (capped).
 */
export function useAnimationLoop(callback: (t: number, dt: number) => void, active: boolean) {
  const cb = useRef(callback);
  useEffect(() => {
    cb.current = callback;
  });

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      cb.current(elapsed, dt);
      raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);
}
