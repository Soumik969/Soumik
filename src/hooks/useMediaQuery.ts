"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a media query. The server snapshot is `fallback`, so the first
 * client render matches the prerendered HTML and there is no hydration mismatch.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
