"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutGroup, MotionConfig, motion } from "framer-motion";
import { Arrow } from "./ui";
import { FOCUS_NOTE, SAMPLES, VIGNETTES } from "@/content/art";
import { services } from "@/content";
import type { Service, ServiceSlug } from "@/content/types";

const EASE = [0.22, 0.8, 0.3, 1] as const;
const spring = { duration: 0.7, ease: EASE };

const TILE: Record<ServiceSlug, string> = {
  interiors: "lg:col-span-5",
  exhibitions: "lg:col-span-4 lg:mt-14",
  events: "lg:col-span-3",
  "brand-activations": "lg:col-span-4 lg:col-start-2 lg:mt-2",
  "kinetic-windows": "lg:col-span-4 lg:col-start-7 lg:-mt-6",
};
const TILT = [-4, 3, -2];

/** A discipline as a composition of three kinds of piece: a spatial concept, a drawing detail and material samples. */
function Composition({ s, big, teaser }: { s: Service; big?: boolean; teaser?: boolean }) {
  const v = VIGNETTES[s.slug];
  return (
    <div className="relative pb-3">
      <motion.div layoutId={`space-${s.slug}`} transition={spring} className="relative">
        <div className="art-stack">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.color} width={v.w} height={v.h} alt={v.alt} loading="lazy" decoding="async" className="w-full" />
        </div>
        {teaser && <LouverTeaser />}
      </motion.div>
      <motion.div layoutId={`draw-${s.slug}`} transition={spring} role="img" aria-label={`Line drawing detail for ${s.name.toLowerCase()}`}
        className={`absolute bottom-0 left-0 aspect-[4/3] overflow-hidden rounded-md border border-indigo/25 bg-white shadow-[0_6px_18px_rgba(47,32,88,.16)] ${big ? "w-[34%]" : "w-[38%]"}`}
        style={{ backgroundImage: `url(${v.ink})`, backgroundSize: `${v.detail.zoom * 100}%`, backgroundPosition: `${v.detail.x}% ${v.detail.y}%`, rotate: "-2deg" }} />
      <div className={`absolute flex gap-2 ${big ? "-top-2 right-0" : "-top-1 right-0"}`}>
        {v.samples.map((id, i) => {
          const m = SAMPLES[id];
          return (
            <motion.div key={id} layoutId={`sample-${s.slug}-${i}`} transition={spring} title={m.name}
              className={`overflow-hidden rounded-md border border-white shadow-[0_5px_14px_rgba(47,32,88,.22)] ${big ? "h-14 w-14 md:h-[4.5rem] md:w-[4.5rem]" : "h-10 w-10 md:h-14 md:w-14"}`}
              style={{ rotate: `${TILT[(i + s.slug.length) % 3]}deg` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt="" width={m.w} height={m.h} loading="lazy" className="h-full w-full object-cover" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** Kinetic teaser: timber louvres turn edge-on once, as the piece enters view, to reveal the scene. Static when motion is reduced. */
function LouverTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="louvers pointer-events-none absolute inset-x-[14%] inset-y-[10%] flex overflow-hidden" style={{ WebkitMaskImage: "radial-gradient(ellipse at center,#000 58%,transparent 72%)", maskImage: "radial-gradient(ellipse at center,#000 58%,transparent 72%)" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="louver h-full flex-1" style={{ transitionDelay: `${500 + i * 120}ms`, backgroundImage: "url(/art/t-timber.webp)", backgroundSize: "auto 100%", backgroundPosition: `${i * 13}% 0` }} />
      ))}
    </div>
  );
}

export function DisciplineBoard() {
  const [active, setActive] = useState<ServiceSlug | null>(null);
  const [open, setOpen] = useState<ServiceSlug | null>(null);
  const focusRef = useRef<HTMLHeadingElement>(null);
  const a = services.find((s) => s.slug === active) ?? null;

  const select = (slug: ServiceSlug) => {
    setActive(slug);
    requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true }));
  };
  const close = () => {
    const slug = active;
    setActive(null);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-tile="${slug}"]`)?.focus({ preventScroll: true }));
  };

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <p className="sr-only" aria-live="polite">{a ? `${a.name} selected. ${a.summary}` : "Five disciplines."}</p>

        {/* Tablet and desktop: the board */}
        <div className="hidden md:block" onKeyDown={(e) => { if (e.key === "Escape" && a) { e.stopPropagation(); close(); } }}>
          {!a ? (
            <ul className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-12 lg:gap-x-10">
              {services.map((s, i) => (
                <li key={s.slug} className={`${TILE[s.slug]} ${i === 4 ? "col-span-1" : ""} ${i === 0 ? "col-span-2" : ""}`}>
                  <button type="button" data-tile={s.slug} onClick={() => select(s.slug)} className="group block w-full text-left" aria-label={`${s.name}. ${FOCUS_NOTE[s.slug]} Select to focus.`}>
                    <Composition s={s} big={i === 0} teaser={s.slug === "kinetic-windows"} />
                    <span className="mt-5 block t-h3 !text-[1.35rem]">{s.name}</span>
                    <span className="mt-2 block h-[3px] w-10 rounded bg-indigo transition-[width] duration-500 group-hover:w-20 group-focus-visible:w-20" aria-hidden="true" />
                    <span className="mt-2 block max-w-[30ch] text-[0.95rem] leading-snug text-indigo-80">{FOCUS_NOTE[s.slug]}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid items-center gap-x-14 gap-y-12 lg:grid-cols-12">
              <div className="lg:col-span-7"><Composition s={a} big /></div>
              <motion.div key={a.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }} className="lg:col-span-5">
                <h3 ref={focusRef} tabIndex={-1} className="t-h1 outline-none">{a.name}</h3>
                <p className="t-lead mt-4">{a.summary}</p>
                <ul className="mt-5 space-y-1.5">
                  {a.scope.slice(0, 3).map((x) => (<li key={x} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-[3px] w-4 shrink-0 rounded bg-coral" />{x}</li>))}
                </ul>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href={`/services/${a.slug}`} className="btn btn-indigo">About {a.name.toLowerCase()} <Arrow /></Link>
                  <button type="button" onClick={close} className="btn btn-outline">Close</button>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Phones: a vertical accordion */}
        <ul className="divide-y divide-indigo/20 border-y border-indigo/20 md:hidden">
          {services.map((s) => {
            const isOpen = open === s.slug;
            const v = VIGNETTES[s.slug];
            return (
              <li key={s.slug}>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`acc-${s.slug}`} onClick={() => setOpen(isOpen ? null : s.slug)}
                    className="flex min-h-[4.5rem] w-full items-center gap-4 py-3 text-left">
                    <span className="art-stack w-24 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={v.color} width={v.w} height={v.h} alt="" loading="lazy" className="w-full" />
                    </span>
                    <span className="flex-1"><span className="t-h3 block">{s.name}</span><span className="t-caption block text-indigo-80">{FOCUS_NOTE[s.slug]}</span></span>
                    <span aria-hidden="true" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-indigo text-xl leading-none transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={`acc-${s.slug}`} className="pb-8 pt-2">
                    <Composition s={s} big />
                    <p className="mt-6">{s.summary}</p>
                    <Link href={`/services/${s.slug}`} className="btn btn-indigo mt-5">About {s.name.toLowerCase()} <Arrow /></Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </MotionConfig>
  );
}
