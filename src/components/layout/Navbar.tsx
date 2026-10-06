"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowDownToLine, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StatusDot } from "@/components/ui/Chip";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/site";
import { profile } from "@/content/profile";
import { sections } from "@/content/sections";

const ids = sections.map((s) => s.id);

function Clock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">IST {time}</span>;
}

/**
 * Floating navigation: brand + status on the left, compact section links on the
 * right. Condenses into a pill once the page scrolls; on small screens it
 * collapses to a single INDEX control that opens a full section index.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  const activeMeta = sections.find((s) => s.id === active) ?? sections[0];
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 48));

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const button = menuButton.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  return (
    <>
      <a href="#main" className="label fixed top-3 left-3 z-[70] -translate-y-20 bg-cyan px-3 py-2 text-ink-950 transition-transform focus:translate-y-0">
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <motion.nav
          aria-label="Primary"
          className={cn(
            "pointer-events-auto mx-auto flex items-center justify-between gap-4 border transition-[max-width,background-color,border-color,padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled
              ? "max-w-[1100px] border-line-strong bg-ink-900/75 px-3 py-2 backdrop-blur-md md:px-4"
              : "max-w-[1400px] border-transparent bg-transparent px-1 py-2 md:px-4",
          )}
        >
          <div className="flex min-w-0 items-center gap-4">
            <a href="#top" className="group flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.18em] text-paper" aria-label="SOUMIK969 — back to top">
              <span className="text-fog transition-colors group-hover:text-cyan">[</span>
              <span>
                SOUMIK<span className="text-cyan">969</span>
              </span>
              <span className="text-fog transition-colors group-hover:text-cyan">]</span>
            </a>

            {/* System status — expanded at the top of the page, condensed to the active section later. */}
            <div className="hidden min-w-0 items-center gap-3 md:flex">
              <span className="h-3 w-px bg-line-strong" aria-hidden />
              <AnimatePresence mode="wait" initial={false}>
                {scrolled ? (
                  <motion.span
                    key={activeMeta.id}
                    className="label-sm truncate text-mist"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-cyan">§{activeMeta.index}</span> {activeMeta.label}
                  </motion.span>
                ) : (
                  <motion.div
                    key="status"
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="label-sm flex items-center gap-2 whitespace-nowrap text-lime">
                      <StatusDot /> Research mode
                    </span>
                    <span className="label-sm hidden whitespace-nowrap text-fog 2xl:inline">
                      {profile.location} · {profile.coordinates}
                    </span>
                    <span className="label-sm hidden whitespace-nowrap text-fog min-[1720px]:inline">
                      <Clock />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ul className="hidden items-center xl:flex">
              {sections
                .filter((s) => s.nav)
                .map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={active === s.id ? "location" : undefined}
                      className={cn(
                        "label-sm relative block px-2.5 py-2 whitespace-nowrap transition-colors duration-300",
                        active === s.id ? "text-paper" : "text-mist hover:text-paper",
                      )}
                    >
                      <span className={cn("mr-1 transition-colors", active === s.id ? "text-cyan" : "text-fog")}>{s.index}</span>
                      {s.label}
                      {active === s.id && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-2.5 -bottom-px h-px bg-cyan"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </a>
                  </li>
                ))}
            </ul>
            <a
              href={asset(profile.cvPath)}
              download
              className="label-sm ml-2 hidden items-center gap-2 border border-line-strong px-3 py-2 text-paper transition-colors hover:border-cyan hover:text-cyan sm:flex"
            >
              CV <ArrowDownToLine size={12} aria-hidden />
            </a>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-index"
              className="label-sm ml-1 flex items-center gap-2 border border-line-strong px-3 py-2 text-paper transition-colors hover:border-cyan hover:text-cyan"
            >
              <span aria-hidden className="grid grid-cols-2 gap-[2px]">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-[3px] w-[3px] bg-current" />
                ))}
              </span>
              Index
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-index"
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            className="fixed inset-0 z-[60] overflow-y-auto bg-ink-950/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="layer-grid pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative mx-auto flex min-h-full max-w-[1100px] flex-col px-5 py-6 md:px-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.78rem] tracking-[0.18em]">
                  [ SOUMIK<span className="text-cyan">969</span> ] <span className="text-fog">/ INDEX</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="label-sm flex items-center gap-2 border border-line-strong px-3 py-2 hover:border-cyan hover:text-cyan"
                >
                  Close <X size={12} aria-hidden />
                </button>
              </div>

              <ol className="mt-12 grid flex-1 content-start gap-px md:mt-16">
                {sections.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a
                      ref={i === 0 ? firstLink : undefined}
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-5 border-b border-line py-3 md:gap-8"
                    >
                      <span className="label w-8 text-cyan">{s.index}</span>
                      <span className="display text-3xl text-paper transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">{s.title}</span>
                      <span className="label-sm ml-auto hidden text-fog sm:inline">{s.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-10 grid gap-2 border-t border-line pt-6 sm:grid-cols-3">
                <span className="label-sm flex items-center gap-2 text-lime">
                  <StatusDot /> Research mode
                </span>
                <span className="label-sm text-fog">
                  {profile.location} · {profile.coordinates} · <Clock />
                </span>
                <span className="label-sm text-fog">Quantum devices // Theory // Computation</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
