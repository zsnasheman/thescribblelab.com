"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { HERO_SLIDES, HERO_VIDEO, kindLabel } from "@/content/media";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const DUR = 7000;

/** Full-bleed opening: slow camera moves over real project imagery (or a film, when supplied), with a pause control. */
export function HeroReel() {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const root = useRef<HTMLElement>(null);
  const running = !paused && !reduced && onScreen;

  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), DUR);
    return () => clearTimeout(t);
  }, [idx, running]);

  const cur = HERO_SLIDES[idx];
  return (
    <section ref={root} aria-labelledby="hero-h" data-hero className={`relative isolate flex min-h-[640px] h-[100svh] flex-col justify-end overflow-hidden bg-indigo text-white on-dark ${running ? "" : "hero-paused"}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {HERO_VIDEO ? (
          <video src={HERO_VIDEO.src} poster={HERO_VIDEO.poster} muted loop playsInline autoPlay preload="metadata" className="h-full w-full object-cover" />
        ) : (
          HERO_SLIDES.map((s, i) => (
            <div key={s.id} className={`hero-slide absolute inset-0 overflow-hidden ${i === idx ? "on" : ""}`} style={{ ["--ox" as string]: i % 2 ? "70%" : "30%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} width={s.w} height={s.h} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" fetchPriority={i === 0 ? "high" : "auto"} className="h-full w-full object-cover" />
            </div>
          ))
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,50,.38)_0%,rgba(20,10,50,.05)_35%,rgba(20,10,50,.66)_100%)]" />
        <div className="absolute inset-0 bg-indigo/20 md:bg-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,10,50,.45)_0%,rgba(20,10,50,0)_60%)]" />
      </div>

      <div className="container-x pb-14 md:pb-20">
        <p className="t-label hidden text-white/90 sm:block">The Scribble Lab · Dubai</p>
        <h1 id="hero-h" className="t-lux mt-4 !text-[clamp(2.25rem,0.8rem+7vw,7.25rem)]">
          <span className="block">Small scribbles.</span>
          <span className="block"><b>Extraordinary</b> spaces.</span>
        </h1>
        <p className="mt-4 max-w-[34rem] text-base text-white/95 sm:mt-6 md:text-xl">We design and build interiors, exhibitions, events, brand activations and kinetic windows.</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mt-8">
          <Link href="/work" className="btn btn-coral md:btn-lg">Explore our work <Arrow /></Link>
          <Link href="/start-a-project" className="btn btn-outline text-white md:btn-lg">Start a project</Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/25 pt-2 sm:mt-10 sm:pt-5">
          <ol className="flex flex-1 items-center gap-2" aria-label="Choose an image">
            {HERO_SLIDES.map((s, i) => (
              <li key={s.id} className="flex-1">
                <button type="button" onClick={() => setIdx(i)} aria-label={`Show image ${i + 1}: ${s.title}`} aria-current={i === idx ? "true" : undefined} className="block h-11 w-full">
                  <span className="mt-5 block h-[3px] w-full overflow-hidden rounded bg-white/30">
                    <span className={`hero-bar block h-full bg-white ${i === idx ? "on" : ""}`} style={{ ["--dur" as string]: `${DUR}ms`, transform: i < idx ? "scaleX(1)" : undefined }} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="t-caption hidden text-white/90 sm:block" aria-live="off">{kindLabel(cur)} · {cur.title} · Placeholder image</p>
          {!reduced && !HERO_VIDEO && (
            <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused} className="btn btn-outline !min-h-11 !px-4 !py-1.5 text-[0.9rem] text-white">{paused ? "Play motion" : "Pause motion"}</button>
          )}
        </div>
      </div>
    </section>
  );
}
