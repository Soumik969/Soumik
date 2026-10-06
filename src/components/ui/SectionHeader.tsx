"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  meta?: string;
  id?: string;
};

/** "02 / EXPERIMENT ───── meta" header with an editorial title. */
export function SectionHeader({ index, label, title, lede, meta, id }: SectionHeaderProps) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="flex items-center gap-4">
        <span className="label text-cyan">
          {index} <span className="text-fog">/</span> {label}
        </span>
        <motion.span
          aria-hidden
          className="hairline flex-1 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {meta && <span className="label-sm hidden text-fog sm:inline">{meta}</span>}
      </div>
      <motion.h2
        id={id}
        className="display mt-6 max-w-4xl text-[2.6rem] text-balance text-paper sm:text-6xl md:text-7xl"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>
      {lede && (
        <motion.div
          className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-mist md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {lede}
        </motion.div>
      )}
    </header>
  );
}
