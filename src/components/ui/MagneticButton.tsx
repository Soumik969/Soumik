"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { type ReactNode, useRef } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  download?: boolean | string;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

/** Link-styled button that is gently attracted toward the cursor. */
export function MagneticButton({ href, children, variant = "ghost", download, external, className, ariaLabel }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.36);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn(
        "group relative inline-flex items-center gap-3 overflow-hidden px-5 py-3 font-mono text-[0.72rem] tracking-[0.16em] uppercase transition-colors duration-300",
        variant === "solid" ? "bg-cyan text-ink-950 hover:bg-paper" : "border border-line-strong text-paper hover:border-cyan hover:text-cyan",
        className,
      )}
    >
      {children}
    </motion.a>
  );
}
