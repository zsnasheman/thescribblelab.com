"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FounderArt, type FounderStage } from "./art/FounderArt";
import { useFinePointer } from "@/lib/hooks";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { background, founderChapters } from "@/content/founder";

function ArtFrame({ stage, className, px, py, uid, label }: { stage: FounderStage; className: string; px: number; py: number; uid: string; label: string }) {
  return (
    <svg viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} className={className}>
      <FounderArt stage={stage} px={px} py={py} uid={uid} />
    </svg>
  );
}

/**
 * Chapters in readable sections beside an illustration that changes with the chapter in view.
 * The story is ordinary content: nothing is pinned or locked. Reduced motion shows one static composition.
 */
export function FounderStory() {
  const uid = useId().replace(/:/g, "");
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const [active, setActive] = useState(0);
  const [p, setP] = useState({ x: 0, y: 0 });
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
  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setP({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
  };

  return (
    <div className="grid gap-x-16 lg:grid-cols-12">
      <nav aria-label="Chapters of the story" className="min-w-0 lg:col-span-12">
        <ol className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
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
          <article key={c.id} id={c.id} ref={(el) => { refs.current[i] = el; }} aria-labelledby={`${c.id}-h`} className="scroll-mt-28 border-t border-indigo/15 py-12 first:border-t-0 md:py-16">
            <p className="t-label text-lavender">Chapter {c.kicker}</p>
            <h2 id={`${c.id}-h`} className="t-h1 mt-3">{c.title}</h2>
            {/* On small screens each chapter carries its own drawing */}
            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-lg border border-indigo/15 lg:hidden">
              <ArtFrame stage={reduced ? -1 : (i as FounderStage)} px={0} py={0} uid={`${uid}m${i}`} className="absolute inset-0 h-full w-full" label={c.caption} />
            </div>
            <p className="t-caption mt-2 text-indigo-80 lg:hidden">{c.caption}</p>
            <div className="mt-6 space-y-4">
              {c.paragraphs.map((t, k) => (<p key={k} className="t-lead measure">{t}</p>))}
            </div>
            {c.facts && (
              <dl className="mt-8 grid max-w-xl gap-x-8 gap-y-4 sm:grid-cols-2">
                {c.facts.map((f) => (
                  <div key={f.label} className="border-t border-indigo/20 pt-3"><dt className="t-label text-lavender">{f.label}</dt><dd className="mt-1 font-semibold">{f.value}</dd></div>
                ))}
              </dl>
            )}
            {c.id === "practice" && (
              <div className="mt-8 max-w-xl">
                <h3 className="t-label text-lavender">Her professional background includes</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {background.map((b) => (<li key={b} className="rounded-full border border-indigo/30 px-4 py-2 font-semibold">{b}</li>))}
                </ul>
                <p className="t-caption mt-3 text-indigo-80">Personal professional background. Not clients of The Scribble Lab, and not endorsements.</p>
              </div>
            )}
            {c.draftNote && (
              <p className="t-caption mt-8 max-w-xl border-l-2 border-coral pl-3 text-indigo-80">
                <span className="font-semibold text-indigo">To come. </span>{c.draftNote}
              </p>
            )}
          </article>
        ))}
      </div>

      {/* Desktop: a drawing that follows the story */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-24">
          <div onPointerMove={onMove} onPointerLeave={() => setP({ x: 0, y: 0 })} className="relative aspect-[8/9] overflow-hidden rounded-xl border border-indigo/15 bg-paper">
            <ArtFrame stage={stage} px={p.x} py={p.y} uid={`${uid}d`} className="absolute inset-0 h-full w-full" label={founderChapters[Math.max(active, 0)].caption} />
          </div>
          <p className="t-caption mt-3 text-indigo-80" aria-live="polite">
            {reduced ? "An interpretation of Kashmir-inspired forms flowing toward Dubai's architecture. It is an artistic idea, not a biography." : founderChapters[active].caption}
          </p>
        </div>
      </div>
    </div>
  );
}
