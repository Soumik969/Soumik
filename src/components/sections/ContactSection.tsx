"use client";

import { motion } from "motion/react";
import { ArrowDownToLine, ArrowUpRight, Check, Copy } from "lucide-react";
import { useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatusDot } from "@/components/ui/Chip";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";
import { useInViewport } from "@/hooks/useInViewport";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { asset } from "@/lib/site";
import { profile } from "@/content/profile";

const TOPICS = ["Research.", "Projects.", "Collaboration.", "Quantum devices."];

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable: the mailto link still works */
        }
      }}
      className="label-sm flex items-center gap-1.5 border border-line-strong px-2.5 py-1.5 text-mist transition-colors hover:border-cyan hover:text-cyan"
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check size={11} aria-hidden /> : <Copy size={11} aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** A carrier wave whose envelope follows the cursor — the page's last signal. */
function SignalTrace() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const target = useRef(0.5);
  const centre = useRef(0.5);
  const visible = useInViewport(svgRef);
  const reduced = usePrefersReducedMotion();

  const build = (t: number, c: number) => {
    let d = "";
    for (let i = 0; i <= 240; i++) {
      const x = i / 240;
      const env = 6 + 34 * Math.exp(-(((x - c) / 0.12) ** 2));
      const y = 50 + env * Math.sin(x * 70 - t * 3.2) * Math.sin(x * Math.PI);
      d += `${i ? "L" : "M"}${(x * 1200).toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  };

  useAnimationLoop((t, dt) => {
    centre.current += (target.current - centre.current) * Math.min(1, dt * 3);
    pathRef.current?.setAttribute("d", build(t, centre.current));
  }, visible && !reduced);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
      className="h-24 w-full"
      aria-hidden
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        target.current = (e.clientX - r.left) / r.width;
      }}
    >
      <line x1={0} y1={50} x2={1200} y2={50} stroke="rgb(150 172 214 / 0.15)" vectorEffect="non-scaling-stroke" />
      <path ref={pathRef} d={build(0, 0.5)} fill="none" stroke="#74e4ff" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ContactSection() {
  const channels = [
    { ch: "CH-A", label: "Personal email", value: profile.emails.personal, href: `mailto:${profile.emails.personal}`, copy: true },
    { ch: "CH-B", label: "Academic email", value: profile.emails.academic, href: `mailto:${profile.emails.academic}`, copy: true },
    { ch: "CH-C", label: "GitHub", value: profile.githubLabel, href: profile.github, external: true },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pt-28 md:pt-40">
      <div className="shell">
        <div className="flex items-center gap-4">
          <span className="label text-cyan">
            08 <span className="text-fog">/</span> Contact
          </span>
          <span className="hairline flex-1" aria-hidden />
          <span className="label-sm flex items-center gap-2 text-lime">
            <StatusDot /> Channels open
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="contact-title" className="display text-[clamp(4rem,13vw,11rem)] text-paper">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Let’s talk
              </motion.span>
              <motion.span
                className="block pl-[0.6em] text-cyan italic"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                physics.
              </motion.span>
            </h2>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {TOPICS.map((t, i) => (
                <motion.li
                  key={t}
                  className="font-mono text-[0.8rem] tracking-[0.12em] text-mist uppercase"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                >
                  <span className="mr-2 text-lime">›</span>
                  {t}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <ul className="divide-y divide-line border-y border-line">
              {channels.map((c) => (
                <li key={c.ch} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 py-4">
                  <span className="label-sm text-fog">{c.ch}</span>
                  <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group min-w-0">
                    <span className="label-sm block text-fog">{c.label}</span>
                    <span className="mt-1 flex items-center gap-1.5 truncate text-[0.98rem] text-paper transition-colors group-hover:text-cyan">
                      <span className="truncate">{c.value}</span>
                      <ArrowUpRight size={13} aria-hidden className="shrink-0 opacity-50 group-hover:opacity-100" />
                    </span>
                  </a>
                  {c.copy ? <CopyButton value={c.value} label={c.label} /> : <span />}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <MagneticButton href={`mailto:${profile.emails.personal}`} variant="solid">
                Write an email <ArrowUpRight size={14} aria-hidden />
              </MagneticButton>
              <MagneticButton href={asset(profile.cvPath)} download>
                Download CV <ArrowDownToLine size={14} aria-hidden />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 md:mt-28">
        <SignalTrace />
      </div>
    </section>
  );
}
