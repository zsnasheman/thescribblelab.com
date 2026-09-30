"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { SAMPLES, VIGNETTES } from "@/content/art";
import { processStages } from "@/content";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const v = VIGNETTES.exhibitions;
const EASE = "cubic-bezier(.22,.8,.3,1)";

/**
 * One spatial idea, five stages. The drawing on the left is the same canopy in every stage:
 * measured, sketched, detailed, built and handed over.
 */
export function SketchToSite() {
  const reduced = usePrefersReducedMotion();
  const [picked, setPicked] = useState<number | null>(null);
  const [seen, setSeen] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const stage = reduced ? 4 : picked ?? seen;

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setSeen(refs.current.findIndex((r) => r === e.target)); }),
      { rootMargin: "-40% 0px -50% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const maskPos = stage >= 4 ? "0% 0" : stage === 3 ? "52% 0" : "100% 0";
  const mask = "linear-gradient(100deg,#000 0%,#000 34%,transparent 62%,transparent 100%)";

  return (
    <div className="grid gap-x-14 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <div className="lg:sticky lg:top-24">
          <div className="relative aspect-[650/432] w-full" role="img" aria-label={`One concept, a canopy over an exhibition hall, at the ${processStages[stage].name.toLowerCase()} stage.`}>
            <div aria-hidden="true" className="blob blob-1 absolute inset-[-6%_-4%] opacity-40" style={{ backgroundImage: "url(/art/t-wash.webp)" }} />
            {/* listen: a measured site */}
            <svg aria-hidden="true" viewBox="0 0 650 432" className="absolute inset-0 h-full w-full" fill="none" stroke="#2f2058" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: stage <= 1 ? 0.75 : 0.22, transition: `opacity .8s ${EASE}` }}>
              <path d="M60 350H590M60 350V100M590 350V100" strokeDasharray="8 8" />
              <path d="M60 380H590M60 372v16M590 372v16M600 350V100M592 350h16M592 100h16" />
              <path d="M130 350 200 318 440 318 520 350" strokeDasharray="2 7" />
            </svg>
            {/* sketch */}
            <div aria-hidden="true" className="art-stack absolute inset-0" style={{ opacity: stage >= 1 ? 1 : 0.22, transition: `opacity .9s ${EASE}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.ink} width={v.w} height={v.h} alt="" loading="lazy" />
            </div>
            {/* build: material mask fills the line drawing */}
            <div aria-hidden="true" className="art-stack absolute inset-0" style={{ WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: "300% 100%", maskSize: "300% 100%", WebkitMaskPosition: maskPos, maskPosition: maskPos, transition: `mask-position 1.6s ${EASE}, -webkit-mask-position 1.6s ${EASE}`, opacity: stage >= 3 ? 1 : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.color} width={v.w} height={v.h} alt="" loading="lazy" />
            </div>
            {/* develop: material samples join the drawing */}
            <div aria-hidden="true" className="absolute right-0 top-0 flex gap-2" style={{ opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? "none" : "translateY(10px)", transition: `all .8s ${EASE}` }}>
              {(["wash", "timber"] as const).map((id, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={id} src={SAMPLES[id].src} alt="" width={SAMPLES[id].w} height={SAMPLES[id].h} loading="lazy" className="h-14 w-14 rounded-md border border-white object-cover shadow-[0_5px_14px_rgba(47,32,88,.22)] md:h-[4.5rem] md:w-[4.5rem]" style={{ rotate: `${i ? 4 : -4}deg` }} />
              ))}
            </div>
          </div>
          <p className="t-caption mt-6 text-indigo-80">One concept, five stages. Concept illustration.</p>
        </div>
      </div>

      <ol className="space-y-2 lg:col-span-6 lg:pt-6">
        {processStages.map((s, i) => (
          <li key={s.id} ref={(el) => { refs.current[i] = el; }} className="lg:min-h-[9.5rem]">
            <button type="button" onClick={() => setPicked(i)} aria-current={stage === i ? "step" : undefined}
              className={`block w-full rounded-xl border-l-4 py-4 pl-5 pr-3 text-left transition-colors ${stage === i ? "border-coral bg-white" : "border-indigo/20 hover:border-indigo/60"}`}>
              <span className="t-label tabular-nums text-lavender">0{i + 1}</span>
              <span className="t-h2 mt-1 block">{s.name}</span>
              <span className="mt-1.5 block max-w-[44ch]">{s.line}</span>
              <span className="t-caption mt-2 block text-indigo-80"><span className="font-semibold text-indigo">You receive:</span> {s.clientSees[0]}</span>
            </button>
          </li>
        ))}
        <li className="pt-4"><Link href="/approach" className="btn btn-outline">The full approach <Arrow /></Link></li>
      </ol>
    </div>
  );
}
