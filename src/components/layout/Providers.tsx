"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Respect the OS "reduce motion" setting for every Motion animation. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
