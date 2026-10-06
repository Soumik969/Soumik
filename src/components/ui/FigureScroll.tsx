import type { ReactNode } from "react";

/**
 * Dense diagrams keep a readable minimum width on phones and pan horizontally
 * inside their frame instead of shrinking their labels to illegibility.
 */
export function FigureScroll({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="overflow-x-auto overscroll-x-contain">
        <div className="min-w-[540px] sm:min-w-0">{children}</div>
      </div>
      <p className="border-t border-line px-3 py-1 font-mono text-[0.6rem] tracking-wide text-fog sm:hidden" aria-hidden>
        ← swipe to pan the figure →
      </p>
    </div>
  );
}
