"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { LayoutGroup, MotionConfig, motion } from "framer-motion";
import { Fragment, Plate } from "./art/Plates";
import { MATERIALS, Swatch } from "./art/materials";
import { Arrow } from "./ui";
import { projectsForService, services } from "@/content";
import type { Service, ServiceSlug } from "@/content/types";

const SPAN: Record<ServiceSlug, string> = {
  interiors: "col-span-2 lg:col-span-5",
  exhibitions: "col-span-1 lg:col-span-4",
  events: "col-span-1 lg:col-span-3",
  "brand-activations": "col-span-1 lg:col-span-4",
  "kinetic-windows": "col-span-1 lg:col-span-4",
};
const EASE = [0.22, 0.8, 0.3, 1] as const;
const spring = { duration: 0.7, ease: EASE };

function Composition({ s, suffix, big }: { s: Service; suffix: string; big?: boolean }) {
  return (
    <div className="relative">
      <motion.div layoutId={`plate-${s.slug}`} transition={spring} className="relative overflow-hidden rounded-lg bg-paper">
        <Plate kind={s.plate} uid={`${s.slug}-${suffix}`} label={`${s.name}: drawn composition`} className="aspect-[4/3] w-full" />
      </motion.div>
      <motion.div layoutId={`frag-${s.slug}`} transition={spring}
        className={`absolute overflow-hidden rounded-md border border-indigo/25 bg-paper shadow-[0_6px_20px_rgba(47,32,88,.18)] ${big ? "-bottom-5 -right-2 w-[34%] md:-right-5" : "-bottom-3 right-2 w-[38%]"}`}>
        <Fragment kind={s.fragment} uid={`${s.slug}-${suffix}-f`} className="w-full" />
      </motion.div>
      <div className={`absolute flex gap-1.5 ${big ? "-bottom-5 left-3" : "-bottom-3 left-2"}`}>
        {s.materials.slice(0, big ? 4 : 3).map((m, i) => (
          <motion.div key={m} layoutId={`sw-${s.slug}-${i}`} transition={spring}
            className={`overflow-hidden rounded-sm border border-indigo/30 shadow-[0_4px_12px_rgba(47,32,88,.2)] ${big ? "w-12 md:w-16" : "w-8 md:w-10"}`} style={{ rotate: `${[-4, 3, -2, 4][i]}deg` }}>
            <Swatch id={m} className="block w-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function MaterialBoard() {
  const [active, setActive] = useState<ServiceSlug | null>(null);
  const focusRef = useRef<HTMLHeadingElement>(null);
  const a = services.find((s) => s.slug === active) ?? null;

  const select = (slug: ServiceSlug | null) => {
    setActive(slug);
    // Move keyboard and screen-reader focus to the new view without scrolling the page away.
    requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true }));
  };

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <p className="sr-only" aria-live="polite">{a ? `${a.name} selected. ${a.summary}` : "Complete board: five disciplines."}</p>

        {/* The five names stay visible and selectable in every state */}
        <div role="group" aria-label="Choose a discipline" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
          {services.map((s) => (
            <button key={s.slug} type="button" aria-pressed={active === s.slug} onClick={() => select(active === s.slug ? null : s.slug)}
              className={`btn !min-h-11 shrink-0 !px-5 !py-2 ${active === s.slug ? "btn-indigo" : "btn-outline"}`}>
              {s.name}
            </button>
          ))}
          {a && <button type="button" onClick={() => select(null)} className="draw-link ml-2 shrink-0 self-center font-semibold">Show the complete board</button>}
        </div>

        {!a ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-12 lg:gap-x-8">
            {services.map((s, i) => (
              <li key={s.slug} className={SPAN[s.slug]}>
                <button type="button" onClick={() => select(s.slug)} className="group block w-full text-left" aria-label={`${s.name}. ${s.short} Select to focus.`}>
                  <Composition s={s} suffix="tile" big={i === 0} />
                  <span className="mt-8 flex items-baseline justify-between gap-3">
                    <span className="t-h3">{s.name}</span>
                    <span className="t-caption shrink-0 font-semibold"><span className="draw-link">Focus</span> <span aria-hidden="true">+</span></span>
                  </span>
                  <span className="t-caption mt-1 block text-indigo-80">{s.short}</span>
                </button>
              </li>
            ))}
            <li className="col-span-2 lg:col-span-4">
              <div className="flex h-full min-h-[14rem] flex-col justify-between rounded-lg border-2 border-dashed border-indigo/35 p-6">
                <div><p className="t-label text-lavender">Not sure yet?</p><p className="t-h3 mt-3">Tell us what you are planning and we will say which discipline fits.</p></div>
                <div className="mt-6 flex flex-wrap gap-3"><Link href="/start-a-project?type=not-sure" className="btn btn-coral !min-h-11 !py-2">Start a project</Link><Link href="/contact" className="btn btn-outline !min-h-11 !py-2">Ask a question</Link></div>
              </div>
            </li>
          </ul>
        ) : (
          <div className="mt-8 grid items-start gap-x-12 gap-y-14 lg:grid-cols-12">
            <div className="lg:col-span-7"><Composition s={a} suffix="focus" big /></div>
            <motion.div key={a.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }} className="pt-4 lg:col-span-5">
              <h3 ref={focusRef} tabIndex={-1} className="t-h1 outline-none">{a.name}</h3>
              <p className="t-lead mt-4">{a.summary}</p>
              <h4 className="t-label mt-8 text-lavender">Materials in this composition</h4>
              <ul className="mt-3 divide-y divide-indigo/15 border-y border-indigo/15">
                {a.materials.map((m) => (
                  <li key={m} className="flex items-center gap-4 py-3">
                    <Swatch id={m} className="h-11 w-11 shrink-0" />
                    <span><span className="block font-semibold">{MATERIALS[m].name}</span><span className="t-caption text-indigo-80">{MATERIALS[m].note}</span></span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href={`/services/${a.slug}`} className="btn btn-indigo">About {a.name.toLowerCase()} <Arrow /></Link>
                <Link href={`/work?service=${a.slug}`} className="btn btn-outline">
                  Related work ({projectsForService(a.slug).length})
                </Link>
              </div>
              <button type="button" onClick={() => select(null)} className="draw-link mt-6 font-semibold">← Back to the complete board</button>
            </motion.div>
          </div>
        )}
      </LayoutGroup>
    </MotionConfig>
  );
}
