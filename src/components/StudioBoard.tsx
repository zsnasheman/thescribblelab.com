"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Art } from "./Art";
import { Arrow } from "./shapes";
import { services } from "@/content/services";
import type { Service } from "@/content/types";

// Composition of the board on large screens: varied scale and limited rotation.
const LAYOUT: Record<string, { cls: string; aspect: string; rot: number }> = {
  interiors: { cls: "lg:col-span-5 lg:row-span-2", aspect: "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[26rem]", rot: -1 },
  exhibitions: { cls: "lg:col-span-4", aspect: "aspect-[4/3]", rot: 0.8 },
  events: { cls: "lg:col-span-3", aspect: "aspect-[4/3] lg:aspect-square", rot: -0.6 },
  "brand-activations": { cls: "lg:col-span-3", aspect: "aspect-[4/3] lg:aspect-square", rot: 0.9 },
  "kinetic-windows": { cls: "lg:col-span-4", aspect: "aspect-[4/3]", rot: -1.1 },
};

function Panel({ s, className }: { s: Service; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={s.slug}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 0.8, 0.3, 1] }}
      className={`grid gap-8 rounded-md border border-indigo/10 bg-white p-5 shadow-[8px_8px_0_var(--color-indigo-10)] md:grid-cols-2 md:p-8 ${className ?? ""}`}
    >
      <Art
        variant={s.art}
        tone={s.tone}
        label={`Illustration for ${s.name}`}
        className="hidden aspect-[4/3] w-full rounded-sm md:block"
      />
      <div className="flex flex-col justify-center">
        <p className="t-label text-lavender">Illustration, not a completed project</p>
        <h3 className="t-h2 mt-3">{s.name}</h3>
        <p className="t-body mt-4 measure">{s.summary}</p>
        <ul className="mt-5 space-y-1.5">
          {s.covers.slice(0, 3).map((c) => (
            <li key={c} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/services/${s.slug}`} className="btn btn-indigo">
            About {s.name.toLowerCase()} <Arrow />
          </Link>
          <Link href={`/work?service=${s.slug}`} className="btn btn-outline">
            See related work
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function StudioBoard() {
  const [active, setActive] = useState<string>(services[0].slug);
  const current = services.find((s) => s.slug === active)!;

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {current.name} selected. {current.summary}
      </p>
      <ul className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        {services.map((s, i) => {
          const L = LAYOUT[s.slug];
          const on = s.slug === active;
          return (
            <li key={s.slug} className={L.cls}>
              <button
                type="button"
                aria-pressed={on}
                aria-controls="world-panel"
                onClick={() => setActive(s.slug)}
                style={{ rotate: `${on ? 0 : L.rot}deg` }}
                className={`group flex w-full flex-col rounded-md lg:h-full border bg-white p-3 text-left shadow-[6px_6px_0_var(--color-indigo-10)] transition-[transform,box-shadow,border-color,rotate] duration-500 hover:-translate-y-1 hover:!rotate-0 ${
                  on ? "border-coral ring-2 ring-coral" : "border-indigo/10"
                }`}
              >
                <Art
                  variant={s.art}
                  tone={s.tone}
                  label=""
                  className={`w-full rounded-sm ${L.aspect}`}
                />
                <span className="mt-3 flex items-baseline justify-between gap-3 px-1 pb-1">
                  <span>
                    <span className="t-label block text-lavender">0{i + 1}</span>
                    <span className="t-h3 block">{s.name}</span>
                  </span>
                  <span className="t-caption shrink-0 font-semibold">
                    {on ? "Open" : "Look closer"}
                    <span aria-hidden="true"> {on ? "●" : "+"}</span>
                  </span>
                </span>
                <span className="t-caption px-1 pb-1 text-indigo-80">{s.short}</span>
              </button>
              {/* Mobile: the expanded view sits directly under the chosen tile */}
              {on && (
                <div className="mt-5 lg:hidden">
                  <Panel s={current} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Desktop: expanded view below the board */}
      <div id="world-panel" className="mt-8 hidden lg:block">
        <AnimatePresence mode="wait">
          <Panel key={current.slug} s={current} />
        </AnimatePresence>
      </div>
    </div>
  );
}
