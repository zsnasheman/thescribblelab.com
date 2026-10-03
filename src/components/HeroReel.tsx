"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HERO_SLIDES, HERO_VIDEO, kindLabel } from "@/content/media";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const DUR = 8000;

/**
 * Full-bleed opening. The camera flies into one picture while the next arrives from inside it
 * (a film, when HERO_VIDEO is supplied). Typography is staged around the image, not on a banner.
 */
export function HeroReel() {
  const reduced = usePrefersReducedMotion();
  const [{ idx, prev }, setPos] = useState<{ idx: number; prev: number | null }>({ idx: 0, prev: null });
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const root = useRef<HTMLElement>(null);
  const running = !paused && !reduced && onScreen;
  const go = (n: number) => setPos((p) => (n === p.idx ? p : { idx: n, prev: p.idx }));

  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => go((idx + 1) % HERO_SLIDES.length), DUR);
    return () => clearTimeout(t);
  }, [idx, running]);

  const cur = HERO_SLIDES[idx];
  return (
    <section ref={root} aria-labelledby="hero-h" data-hero className={`dark-scope relative isolate flex min-h-[680px] h-[100svh] flex-col justify-end overflow-hidden ${running ? "" : "hero-paused"}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink">
        {HERO_VIDEO ? (
          <video src={HERO_VIDEO.src} poster={HERO_VIDEO.poster} muted loop playsInline autoPlay preload="metadata" className="h-full w-full object-cover" />
        ) : (
          HERO_SLIDES.map((s, i) => (
            <div key={s.id} className={`hero-slide absolute inset-0 overflow-hidden ${i === idx ? "on" : i === prev ? "out" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} width={s.w} height={s.h} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" fetchPriority={i === 0 ? "high" : "auto"} className="h-full w-full object-cover" />
            </div>
          ))
        )}
        {/* Night grade: brand indigo, with a warm coral glow */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,7,33,.55)_0%,rgba(12,7,33,.15)_32%,rgba(12,7,33,.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_14%,rgba(255,140,90,.34),transparent_46%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,7,33,.5)_0%,rgba(12,7,33,0)_55%)]" />
      </div>

      <div className="container-x pb-8 md:pb-10">
        <h1 id="hero-h" className="text-white">
          <span className="block font-[family-name:var(--font-display)] text-[clamp(1.5rem,0.8rem+2.4vw,3rem)] italic leading-none">Small scribbles.</span>
          <span className="mt-1 flex flex-wrap items-end justify-between gap-x-8 md:mt-2">
            <span className="block font-[family-name:var(--font-display)] text-[clamp(2.7rem,0.5rem+10.6vw,13rem)] uppercase leading-[0.9] tracking-[-0.01em]">Extraordinary</span>
            <span className="block font-[family-name:var(--font-display)] text-[clamp(2rem,0.8rem+4.4vw,6rem)] italic leading-[0.95] md:mb-3">spaces.</span>
          </span>
        </h1>

        <div className="mt-6 grid items-end gap-x-10 gap-y-5 border-t border-white/25 pt-5 md:mt-8 md:grid-cols-[auto_1fr_1fr_auto]">
          <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/40 md:block" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.thumb} alt="" width={640} height={320} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="cap text-white/90">01 — Our craft</p>
            <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-snug text-white/90">We design and build interiors, exhibitions, events, brand activations and kinetic windows.</p>
          </div>
          <div className="hidden md:block">
            <p className="cap text-white/90">02 — Our approach</p>
            <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-snug text-white/90">One team, from the first line to the finished space.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link href="/work" className="pill pill-solid cap">Explore our work</Link>
            <Link href="/start-a-project" className="pill cap">Start a project <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <ol className="flex flex-1 items-center gap-2" aria-label="Choose an image">
            {HERO_SLIDES.map((s, i) => (
              <li key={s.id} className="flex-1">
                <button type="button" onClick={() => go(i)} aria-label={`Show image ${i + 1}: ${s.title}`} aria-current={i === idx ? "true" : undefined} className="block h-11 w-full">
                  <span className="mt-5 block h-[2px] w-full overflow-hidden rounded bg-white/30">
                    <span className={`hero-bar block h-full bg-white ${i === idx ? "on" : ""}`} style={{ ["--dur" as string]: `${DUR}ms`, transform: i < idx ? "scaleX(1)" : undefined }} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="cap hidden text-white/85 sm:block" aria-live="off">{kindLabel(cur)} · {cur.title} · Placeholder</p>
          {!reduced && !HERO_VIDEO && (
            <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused} className="cap min-h-11 px-2 text-white underline-offset-4 hover:underline">{paused ? "Play motion" : "Pause motion"}</button>
          )}
        </div>
      </div>
    </section>
  );
}
