"use client";

import { type RefObject, useEffect, useState } from "react";

/** True while the element intersects the viewport (plus margin). */
export function useInViewport<T extends Element>(ref: RefObject<T | null>, rootMargin = "120px"): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return visible;
}
