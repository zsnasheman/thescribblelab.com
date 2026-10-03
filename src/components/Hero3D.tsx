"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const Scene = dynamic(() => import("./ScribbleScene").then((m) => m.ScribbleScene), { ssr: false });

/** Opening: a lit, sculptural scribble under a low sun, with the typography staged around it. */
export function Hero3D() {
  const reduced = usePrefersReducedMotion();
  const progress = useRef(0);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const upd = () => { raf = 0; progress.current = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight * 0.9))); };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-h" data-hero className="dark-scope relative isolate flex min-h-[680px] h-[100svh] flex-col justify-end overflow-hidden bg-[linear-gradient(180deg,#05020f_0%,#0f0838_46%,#2f2058_78%,#4b3a99_100%)]">
      {/* The sun still shows if WebGL is unavailable */}
      <div aria-hidden="true" className="absolute right-[16%] top-[9%] -z-10 [section:has([data-scene_canvas])_&]:hidden h-[22vmin] w-[22vmin] rounded-full bg-[radial-gradient(circle_at_50%_30%,#fff1cf,#ff9b5e_70%,#ff6a2e)] shadow-[0_0_120px_30px_rgba(255,130,70,.45)] max-md:right-[10%] max-md:top-[16%]" />
      <div className="absolute inset-0 -z-10"><Scene reduced={reduced} progress={progress} /></div>

      <div className="container-x pb-8 md:pb-10">
        <h1 id="hero-h" className="text-white">
          <span className="block font-[family-name:var(--font-display)] text-[clamp(1.5rem,0.8rem+2.4vw,3rem)] italic leading-none">Small scribbles.</span>
          <span className="mt-1 flex flex-wrap items-end justify-between gap-x-8 md:mt-2">
            <span className="block font-[family-name:var(--font-display)] text-[clamp(2.7rem,0.5rem+10.6vw,13rem)] uppercase leading-[0.9] tracking-[-0.01em]">Extraordinary</span>
            <span className="block font-[family-name:var(--font-display)] text-[clamp(2rem,0.8rem+4.4vw,6rem)] italic leading-[0.95] md:mb-3">spaces.</span>
          </span>
        </h1>
        <div className="mt-6 grid items-end gap-x-10 gap-y-5 border-t border-white/25 pt-5 md:mt-8 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <p className="cap text-white/90">01 — Our craft</p>
            <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-snug text-white/90">We design and build interiors, exhibitions, events, brand activations and kinetic windows.</p>
          </div>
          <div className="hidden md:block">
            <p className="cap text-white/90">02 — Our approach</p>
            <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-snug text-white/90">We concept. We build. We leave a mark.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link href="/work" className="pill pill-solid cap">Explore our work</Link>
            <Link href="/start-a-project" className="pill cap">Start a project <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <p className="cap mt-6 hidden text-white/70 md:block" aria-hidden="true">Scroll ↓</p>
      </div>
    </section>
  );
}
