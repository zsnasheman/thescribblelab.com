"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Cutout, type Shape } from "./Cutout";
import { categoryName, projectBySlug } from "@/content/portfolio";
import { FEATURED } from "@/content/showcase";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const SHAPES: Shape[] = ["blob-a", "circle", "arch", "blob-b", "pill", "blob-c", "circle", "arch"];
const PATCH = ["#ff663e", "#6b5291", "#1e9e74", "#d99a12", "#ff663e", "#6b5291", "#1e9e74", "#d99a12"];
// Material-board layout: scattered, tilted, overlapping (percent of the stage, rotation, scale)
const BOARD = [
  { x: 14, y: 30, r: -7, s: 1.15 }, { x: 40, y: 20, r: 5, s: 0.85 }, { x: 62, y: 34, r: -4, s: 1.05 }, { x: 84, y: 24, r: 8, s: 0.8 },
  { x: 26, y: 70, r: 6, s: 0.9 }, { x: 50, y: 66, r: -6, s: 1.1 }, { x: 74, y: 74, r: 4, s: 0.85 }, { x: 90, y: 60, r: -9, s: 0.7 },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Projects as a material board that deploys into an orbit when the pointer moves onto it
 * (or when "Open the orbit" is pressed, for touch and keyboard). Every card is a link to its project.
 */
export function Orbit() {
  const reduced = usePrefersReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const label = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  useEffect(() => { openRef.current = open; }, [open]);

  useEffect(() => {
    const el = stage.current;
    if (!el || reduced) return;
    let blend = 0, theta = 0, last = performance.now(), raf = 0, visible = true;
    const N = FEATURED.length;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const target = openRef.current ? 1 : 0;
      blend += (target - blend) * Math.min(1, dt * 4.2);
      if (Math.abs(target - blend) < 0.002) blend = target;
      if (blend > 0.05) theta += dt * 0.28 * blend;
      const W = el.clientWidth, H = el.clientHeight;
      const e = ease(blend);
      let front = -1, best = -9;
      for (let i = 0; i < N; i++) {
        const c = cards.current[i]; if (!c) continue;
        c.style.left = "0"; c.style.top = "0";
        const b = BOARD[i];
        const a = (i / N) * Math.PI * 2 + theta + (1 - e) * 1.6;
        const rx = W * 0.4 * (0.35 + 0.65 * e), ry = H * 0.2 * (0.35 + 0.65 * e);
        const ox = W / 2 + Math.cos(a) * rx, oy = H * 0.5 + Math.sin(a) * ry;
        const depth = Math.sin(a); // -1 far .. 1 near
        const x = (b.x / 100) * W * (1 - e) + ox * e, y = (b.y / 100) * H * (1 - e) + oy * e;
        const sc = b.s * (1 - e) + (0.7 + 0.3 * (depth * 0.5 + 0.5) + 0.12) * e;
        const rot = b.r * (1 - e);
        c.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`;
        c.style.zIndex = String(e > 0.5 ? Math.round(depth * 10 + 10) : 10 - i);
        c.style.opacity = String(1 - e * (0.35 - 0.35 * (depth * 0.5 + 0.5)));
        if (depth > best) { best = depth; front = i; }
      }
      if (label.current) label.current.textContent = e > 0.9 && front >= 0 ? (projectBySlug(FEATURED[front])?.title ?? "") : "";
      if (visible && (blend !== target || blend > 0.05)) raf = requestAnimationFrame(frame);
    };
    const kick = () => { last = performance.now(); if (!raf) raf = requestAnimationFrame(frame); };
    kick();
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); });
    io.observe(el);
    const ro = new ResizeObserver(kick); ro.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [reduced, open]);

  if (reduced) {
    return (
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((slug, i) => { const p = projectBySlug(slug)!; const im = p.images[0]; return (
          <li key={slug}><Link href={`/work/${slug}`} className="block no-underline"><Cutout src={im.thumb} alt={p.title} shape={SHAPES[i]} patch={PATCH[i]} width={820} height={600} ratio="1 / 1" /><span className="mt-3 block font-[family-name:var(--font-display)] text-xl">{p.title}</span></Link></li>
        ); })}
      </ul>
    );
  }

  return (
    <div>
      <div ref={stage} onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(true); }} onPointerLeave={(e) => { if (e.pointerType === "mouse") setOpen(false); }}
        className="relative h-[34rem] w-full overflow-hidden md:h-[40rem]" data-orbit data-open={open}>
        <ul>
          {FEATURED.map((slug, i) => {
            const p = projectBySlug(slug)!; const im = p.images[0];
            return (
              <li key={slug}>
                <Link ref={(n) => { cards.current[i] = n; }} href={`/work/${slug}`} aria-label={`${p.title}, ${categoryName(p.category)}`} onFocus={() => setOpen(true)}
                  className="absolute left-0 top-0 block w-[9.5rem] no-underline will-change-transform md:w-[13rem]" style={{ left: `${BOARD[i].x}%`, top: `${BOARD[i].y}%`, transform: `translate(-50%, -50%) rotate(${BOARD[i].r}deg) scale(${BOARD[i].s})` }}>
                  <Cutout src={im.thumb} shape={SHAPES[i]} patch={PATCH[i]} width={820} height={600} ratio={SHAPES[i] === "arch" ? "4 / 5" : "1 / 1"} />
                </Link>
              </li>
            );
          })}
        </ul>
        <p ref={label} aria-live="off" className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-[family-name:var(--font-display)] text-3xl md:text-4xl" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <button type="button" aria-pressed={open} onClick={() => setOpen((v) => !v)} className="btn btn-outline">{open ? "Close the orbit" : "Open the orbit"}</button>
        <p className="t-caption text-indigo-80">Move over the board to open it. Select any piece to see the project.</p>
      </div>
    </div>
  );
}
