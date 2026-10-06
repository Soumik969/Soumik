"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Layer 4: a measurement probe. A finer cyan grid is revealed under the cursor
 * and the probe position is printed in the corner as normalized coordinates.
 */
export function CursorField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!fine) return;
    let raf = 0;
    let mx = -999;
    let my = -999;
    const paint = () => {
      raf = 0;
      fieldRef.current?.style.setProperty("--mx", `${mx}px`);
      fieldRef.current?.style.setProperty("--my", `${my}px`);
      if (readoutRef.current) {
        const x = (mx / window.innerWidth).toFixed(3);
        const y = (1 - my / window.innerHeight).toFixed(3);
        readoutRef.current.textContent = `x ${x}\ny ${y}`;
      }
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <>
      {!reduced && <div ref={fieldRef} aria-hidden className="cursor-reveal pointer-events-none fixed inset-0 z-[1]" />}
      <div aria-hidden className="pointer-events-none fixed right-5 bottom-6 z-40 hidden flex-col items-end gap-1 xl:flex">
        <span className="label-sm text-fog">Probe</span>
        <span ref={readoutRef} className="font-mono text-[0.62rem] whitespace-pre text-mist tabular-nums">
          x 0.000{"\n"}y 0.000
        </span>
      </div>
    </>
  );
}
