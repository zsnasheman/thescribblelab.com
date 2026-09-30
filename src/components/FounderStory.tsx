"use client";

import { useEffect, useRef, useState } from "react";
import { FounderScene, type FounderStage } from "./FounderScene";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { background, founderChapters } from "@/content/founder";

/**
 * Four chapters in ordinary, scrollable sections. The illustration gains detail as each chapter is read.
 * Nothing is pinned or locked. Reduced motion shows the complete composition.
 */
export function FounderStory() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(refs.current.findIndex((r) => r === e.target)); }),
      { rootMargin: "-38% 0px -52% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const stage: FounderStage = reduced ? -1 : (active as FounderStage);

  return (
    <div className="grid gap-x-16 lg:grid-cols-12">
      <nav aria-label="Chapters of the story" className="min-w-0 lg:col-span-12">
        <ol className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {founderChapters.map((c, i) => (
            <li key={c.id} className="shrink-0">
              <a href={`#${c.id}`} aria-current={active === i ? "true" : undefined} className={`btn !min-h-11 !px-4 !py-2 text-[0.9rem] ${active === i ? "btn-indigo" : "btn-outline"}`}>
                <span className="tabular-nums opacity-70">{c.kicker}</span> {c.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0 lg:col-span-7">
        {founderChapters.map((c, i) => (
          <article key={c.id} id={c.id} ref={(el) => { refs.current[i] = el; }} aria-labelledby={`${c.id}-h`} className="scroll-mt-24 border-t border-indigo/15 py-12 first:border-t-0 first:pt-2 md:py-16 lg:min-h-[26rem]">
            <p className="t-label text-lavender">Chapter {c.kicker}</p>
            <h2 id={`${c.id}-h`} className="t-h1 mt-3">{c.title}</h2>
            {/* Phones: each chapter carries its own stage of the drawing */}
            <div className="mt-6 max-w-sm lg:hidden"><FounderScene stage={reduced ? -1 : (i as FounderStage)} /></div>
            <p className="t-caption mt-2 text-indigo-80 lg:hidden">{c.caption}</p>
            <div className="mt-6 space-y-4">
              {c.paragraphs.map((t, k) => (<p key={k} className="t-lead measure">{t}</p>))}
            </div>
            {c.id === "practice" && (
              <div className="mt-8 max-w-xl">
                <h3 className="t-label text-lavender">Her professional background includes</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {background.map((b) => (<li key={b} className="rounded-full border border-indigo/30 px-4 py-2 font-semibold">{b}</li>))}
                </ul>
                <p className="t-caption mt-3 text-indigo-80">Personal professional background. Not clients of The Scribble Lab, and not endorsements.</p>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Desktop: a drawing that follows the story */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-20">
          <FounderScene stage={stage} />
          <p className="t-caption mt-3 text-indigo-80" aria-live="polite">{reduced ? "The complete drawing: roots, practice, the studio and the future direction. An interpretation, not a biography." : founderChapters[active].caption}</p>
        </div>
      </div>
    </div>
  );
}
