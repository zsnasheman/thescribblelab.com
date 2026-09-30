"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { MediaItem } from "@/content/types";

/**
 * A reveal/compare slider. It is only ever rendered for a genuinely matched pair,
 * such as an approved render and a photograph of the same built view from the same position.
 */
export function CompareSlider({ before, after, caption }: { before: MediaItem; after: MediaItem; caption: string }) {
  const id = useId();
  const [pos, setPos] = useState(50);
  return (
    <figure>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-indigo-10">
        <Image src={after.src} alt={after.alt} fill sizes="(min-width:1024px) 70vw, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes="(min-width:1024px) 70vw, 100vw" className="object-cover" />
        </div>
        <div aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-indigo shadow-lg">⟷</span>
        </div>
        <span className="t-label absolute left-3 top-3 rounded-full bg-indigo px-3 py-2 text-[0.625rem] text-white">Render</span>
        <span className="t-label absolute right-3 top-3 rounded-full bg-indigo px-3 py-2 text-[0.625rem] text-white">Built</span>
      </div>
      <div className="mt-3">
        <label htmlFor={id} className="t-label text-lavender">Drag to compare render and built space</label>
        <input id={id} type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-valuetext={`${pos} percent render`} className="mt-2 h-11 w-full accent-[#2F2058]" />
      </div>
      <figcaption className="t-caption mt-1 text-indigo-80">{caption}</figcaption>
    </figure>
  );
}
