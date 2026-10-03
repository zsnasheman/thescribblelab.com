"use client";

import Link from "next/link";
import { useRef } from "react";
import { Arrow } from "./ui";
import { categoryName, projectBySlug } from "@/content/portfolio";
import { FEATURED } from "@/content/showcase";

/** A horizontal reel of large project images. Native scrolling and snapping; buttons and keyboard arrows move it too. */
export function ProjectReel() {
  const ref = useRef<HTMLUListElement>(null);
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * Math.min(900, (ref.current?.clientWidth ?? 600) * 0.8), behavior: "smooth" });
  return (
    <div>
      <ul ref={ref} tabIndex={0} aria-label="Selected projects, scroll sideways" onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } }}
        className="reel -mx-[clamp(1rem,4vw,3.5rem)] flex gap-4 overflow-x-auto px-[clamp(1rem,4vw,3.5rem)] pb-4 md:gap-6">
        {FEATURED.map((slug) => {
          const p = projectBySlug(slug)!;
          const img = p.images[0];
          return (
            <li key={slug} className="w-[84vw] shrink-0 md:w-[58vw] lg:w-[44vw]">
              <Link href={`/work/${slug}`} className="group block no-underline">
                <span className="block overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} width={img.w} height={img.h} alt={`${p.title}${p.where ? `, ${p.where}` : ""}`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] md:aspect-[16/10]" />
                </span>
                <span className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">{p.title}</span>
                  <span className="cap shrink-0 text-lavender">{categoryName(p.category)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous project" className="grid h-12 w-12 place-items-center rounded-full border-2 border-indigo"><Arrow className="rotate-180" /></button>
        <button type="button" onClick={() => go(1)} aria-label="Next project" className="grid h-12 w-12 place-items-center rounded-full border-2 border-indigo"><Arrow /></button>
      </div>
    </div>
  );
}
