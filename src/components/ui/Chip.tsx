import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ChipProps = { children: ReactNode; tone?: "default" | "cyan" | "violet" | "lime"; className?: string };

const tones = {
  default: "border-line text-mist",
  cyan: "border-cyan/30 text-cyan",
  violet: "border-violet/30 text-violet",
  lime: "border-lime/30 text-lime",
};

export function Chip({ children, tone = "default", className }: ChipProps) {
  return (
    <span className={cn("inline-flex items-center border px-2 py-1 font-mono text-[0.65rem] tracking-[0.06em] whitespace-nowrap", tones[tone], className)}>
      {children}
    </span>
  );
}

export function StatusDot({ tone = "lime", pulse = true, className }: { tone?: "lime" | "cyan" | "violet" | "fog"; pulse?: boolean; className?: string }) {
  const color = { lime: "bg-lime", cyan: "bg-cyan", violet: "bg-violet", fog: "bg-fog" }[tone];
  return (
    <span aria-hidden className={cn("relative inline-flex h-1.5 w-1.5", className)}>
      {pulse && <span className={cn("absolute inset-0 rounded-full opacity-60 blur-[3px]", color)} />}
      <span className={cn("relative inline-block h-1.5 w-1.5 rounded-full", color, pulse && "animate-pulse-dot")} />
    </span>
  );
}
