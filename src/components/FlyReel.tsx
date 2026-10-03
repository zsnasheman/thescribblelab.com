"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HERO_SLIDES, HERO_VIDEO } from "@/content/showcase";
import { categoryName } from "@/content/portfolio";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const DUR = 8000;

/**
 * Full-bleed opening. The camera flies into one picture while the next arrives from inside it
 * (a film, when HERO_VIDEO is supplied). Typography is staged around the image, not on a banner.
 */
export function FlyReel() {
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
    <section ref={root} aria-labelledby="reel-h" data-flyreel className={`dark-scope relative isolate flex min-h-[640px] h-[92svh] flex-col justify-end overflow-hidden ${running ? "" : "hero-paused"}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink">
        {HERO_VIDEO ? (
          <video src={HERO_VIDEO.src} poster={HERO_VIDEO.poster} muted loop playsInline autoPlay preload="metadata" className="h-full w-full object-cover" />
        ) : (
          HERO_SLIDES.map((s, i) => (
            <div key={s.project.slug} className={`hero-slide absolute inset-0 overflow-hidden ${i === idx ? "on" : i === prev ? "out" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image.src} width={s.image.w} height={s.image.h} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" fetchPriority={i === 0 ? "high" : "auto"} className="h-full w-full object-cover" />
            </div>
          ))
        )}
        {/* Night grade: brand indigo, with a warm coral glow */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,7,33,.55)_0%,rgba(12,7,33,.15)_32%,rgba(12,7,33,.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_14%,rgba(255,140,90,.28),transparent_46%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,7,33,.5)_0%,rgba(12,7,33,0)_55%)]" />
      </div>

      <div className="container-x pb-8 md:pb-10">
        <p className="cap text-white/90">Selected work</p>
        <h2 id="reel-h" className="mt-2 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(2.4rem,1rem+6vw,7rem)] leading-[0.95] text-white">{cur.project.title}</h2>
        <p className="mt-3 max-w-[48ch] text-white/90">{cur.project.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={`/work/${cur.project.slug}`} className="pill pill-solid cap">View the project</Link>
          <Link href="/work" className="pill cap">All work <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <ol className="flex flex-1 items-center gap-2" aria-label="Choose an image">
            {HERO_SLIDES.map((s, i) => (
              <li key={s.project.slug} className="flex-1">
                <button type="button" onClick={() => go(i)} aria-label={`Show image ${i + 1}: ${s.project.title}`} aria-current={i === idx ? "true" : undefined} className="block h-11 w-full">
                  <span className="mt-5 block h-[2px] w-full overflow-hidden rounded bg-white/30">
                    <span className={`hero-bar block h-full bg-white ${i === idx ? "on" : ""}`} style={{ ["--dur" as string]: `${DUR}ms`, transform: i < idx ? "scaleX(1)" : undefined }} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="cap hidden text-white/85 sm:block" aria-live="off">{cur.project.title} · {categoryName(cur.project.category)}{cur.project.label ? ` · ${cur.project.label}` : ""}</p>
          {!reduced && !HERO_VIDEO && (
            <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused} className="cap min-h-11 px-2 text-white underline-offset-4 hover:underline">{paused ? "Play motion" : "Pause motion"}</button>
          )}
        </div>
      </div>
    </section>
  );
}
