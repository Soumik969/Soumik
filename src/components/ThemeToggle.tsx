"use client";

import { useEffect } from "react";
import { MoonIcon, SunIcon } from "./Icons";

const KEY = "theme";

function apply(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
}

/** Light/dark switch. Follows the system setting until the visitor picks one. */
export function ThemeToggle() {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(KEY);
      } catch {
        /* storage unavailable */
      }
      if (!saved) apply(mql.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable: the choice lasts for this page view */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded text-fg transition-colors hover:text-accent"
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  );
}

/** Inline script for <head>: sets data-theme before first paint to avoid a flash. */
export const themeScript = `(function(){var t=null;try{t=localStorage.getItem("${KEY}")}catch(e){}var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light"})();`;
