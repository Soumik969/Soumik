"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function MountPlaceholder({ label = "Initializing instrument", height }: { label?: string; height?: number | string }) {
  return (
    <div className={cn("grid-fine flex items-center justify-center", height === undefined && "absolute inset-0")} style={{ height }}>
      <span className="label-sm text-fog">
        {label}
        <span className="animate-caret">_</span>
      </span>
    </div>
  );
}

/**
 * Mounts its children only once the placeholder comes near the viewport, so
 * heavy interactive figures (and their code-split chunks) load on demand.
 */
export function LazyMount({
  children,
  minHeight,
  className,
  label = "Initializing instrument",
}: {
  children: ReactNode;
  minHeight: number | string;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)} style={{ minHeight: seen ? undefined : minHeight }}>
      {seen ? children : <MountPlaceholder label={label} />}
    </div>
  );
}
