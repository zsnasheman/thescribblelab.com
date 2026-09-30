"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Photo } from "./Photo";
import { Arrow } from "./ui";
import type { Project } from "@/content/types";
import { serviceBySlug } from "@/content/services";

/** Drag with a mouse, swipe on touch, or use the buttons / keyboard. */
export function WorkCarousel({ projects }: { projects: Project[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [cursor, setCursor] = useState<{ x: number; y: number; on: boolean; down: boolean }>({ x: 0, y: 0, on: false, down: false });

  const by = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.6), behavior: "smooth" });
  };

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = scroller.current!;
    drag.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: false };
    el.style.scrollSnapType = "none";
    setCursor((c) => ({ ...c, down: true }));
  };
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setCursor({ x: e.clientX, y: e.clientY, on: true, down: drag.current.down });
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    scroller.current!.scrollLeft = drag.current.left - dx;
  };
  const end = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    if (scroller.current) scroller.current.style.scrollSnapType = "";
    setCursor((c) => ({ ...c, down: false }));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <button type="button" onClick={() => by(-1)} aria-label="Scroll work left" className="btn btn-outline !min-h-12 !w-12 !p-0">
          <Arrow className="rotate-180" />
        </button>
        <button type="button" onClick={() => by(1)} aria-label="Scroll work right" className="btn btn-outline !min-h-12 !w-12 !p-0">
          <Arrow />
        </button>
      </div>

      <div
        ref={scroller}
        role="region"
        aria-label="Selected work, scrollable"
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={end}
        onPointerLeave={() => { end(); setCursor((c) => ({ ...c, on: false })); }}
        onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } }}
        className="no-scrollbar -mx-4 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 active:cursor-grabbing sm:-mx-0 sm:px-0 md:gap-7"
      >
        {projects.map((p) => (
          <article key={p.slug} className="group w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[31vw] xl:w-[27vw]">
            <Link href={`/work/${p.slug}`} draggable={false} className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-indigo-10">
                <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
                  <Photo photo={p.photo} sizes="(min-width:1024px) 31vw, 78vw" />
                </div>
              </div>
              <p className="t-label mt-5 text-lavender">{serviceBySlug(p.service)?.name}</p>
              <h3 className="t-h2 mt-2"><span className="draw-link">{p.title}</span></h3>
              <p className="t-body mt-1 text-indigo-80">{p.summary}</p>
            </Link>
          </article>
        ))}
      </div>

      {/* Drag cursor (fine pointers only) */}
      <div aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-24 w-24 items-center justify-center rounded-full bg-coral text-[0.8rem] font-semibold text-indigo transition-[opacity,scale] duration-200 md:flex"
        style={{ transform: `translate(${cursor.x - 48}px, ${cursor.y - 48}px) scale(${cursor.down ? 0.85 : 1})`, opacity: cursor.on ? 1 : 0 }}>
        Drag
      </div>
    </div>
  );
}
