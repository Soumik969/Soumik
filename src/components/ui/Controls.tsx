"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type Option<T extends string> = { value: T; label: string };

/** Instrument-style segmented switch (radiogroup semantics). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex border border-line-strong", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn("label-sm px-3 py-2 transition-colors duration-300", active ? "bg-cyan text-ink-950" : "text-mist hover:text-paper")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Labelled range input with a monospaced readout. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-mono text-[0.66rem] tracking-[0.06em] text-mist">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-[0.7rem] text-cyan tabular-nums">
          {format ? format(value) : value}
        </output>
      </div>
      <input id={id} type="range" className="range mt-1" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
