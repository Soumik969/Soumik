import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FigureProps = {
  label: string;
  caption: string;
  kind?: string;
  children: ReactNode;
  className?: string;
  controls?: ReactNode;
};

/** Scientific figure frame: registration marks, figure number and caption. */
export function Figure({ label, caption, kind = "Schematic", children, className, controls }: FigureProps) {
  return (
    <figure className={cn("brackets relative border border-line bg-ink-900/70", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <span className="label-sm text-cyan">{label}</span>
        <span className="label-sm text-fog">{kind}</span>
      </div>
      <div className="relative">{children}</div>
      {controls && <div className="border-t border-line px-3 py-3">{controls}</div>}
      <figcaption className="border-t border-line px-3 py-2.5 text-[0.78rem] leading-relaxed text-mist">{caption}</figcaption>
    </figure>
  );
}
