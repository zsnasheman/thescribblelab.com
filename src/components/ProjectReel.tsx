"use client";

import { useRef } from "react";
import { Arrow } from "./ui";
import { PLACEHOLDER_IMAGES } from "@/content/placeholders";
import { kindLabel } from "@/content/media";

/** A horizontal reel of large images. Native scrolling and snapping; buttons and keyboard arrows move it too. */
export function ProjectReel() {
  const ref = useRef<HTMLUListElement>(null);
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * Math.min(900, (ref.current?.clientWidth ?? 600) * 0.8), behavior: "smooth" });
  return (
    <div>
      <ul ref={ref} tabIndex={0} aria-label="Selected interiors, scroll sideways" onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } }}
        className="reel -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:-mx-14 md:gap-6 md:px-14">
        {PLACEHOLDER_IMAGES.map((img) => (
          <li key={img.id} className="w-[84vw] shrink-0 md:w-[58vw] lg:w-[46vw]">
            <figure>
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} width={img.w} height={img.h} alt={img.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] hover:scale-[1.04] md:aspect-[16/10]" />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <span className="font-[family-name:var(--font-display)] text-2xl font-light">{img.title}</span>
                <span className="t-label text-lavender">{kindLabel(img)}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="grid h-12 w-12 place-items-center rounded-full border-2 border-indigo"><Arrow className="rotate-180" /></button>
        <button type="button" onClick={() => go(1)} aria-label="Next image" className="grid h-12 w-12 place-items-center rounded-full border-2 border-indigo"><Arrow /></button>
      </div>
    </div>
  );
}
