"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categoryName, projectBySlug } from "@/content/portfolio";
import { FEATURED } from "@/content/showcase";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

// Closed: a single row of small thumbnails under the title (as in the showreel reference). Open: they fan out into a swirling ring of flat cards around the title.
const ASPECT = [0.78, 1.3, 0.9, 1.15, 0.8, 1.25, 0.95, 1.1, 0.78, 1.3, 0.9, 1.15];
const SIZE = [1.05, 0.85, 0.95, 1.1, 0.8, 1, 0.9, 1.05, 0.85, 1, 0.95, 0.8];

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
  const title = useRef<HTMLDivElement>(null);
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
      const rowW = Math.min(W * 0.84, 62 * N);
      for (let i = 0; i < N; i++) {
        const c = cards.current[i]; if (!c) continue;
        c.style.left = "0"; c.style.top = "0";
        const a = (i / N) * Math.PI * 2 + theta + (1 - e) * 2.2;
        const R = Math.min(W * 0.3, H * 0.31) * (0.2 + 0.8 * e);
        const ox = W / 2 + Math.cos(a) * R * 1.25, oy = H * 0.47 + Math.sin(a) * R;
        const depth = Math.sin(a);
        const rx = W / 2 - rowW / 2 + (rowW / (N - 1)) * i, ry = H * 0.56;
        const x = rx * (1 - e) + ox * e, y = ry * (1 - e) + oy * e;
        const base = 0.36 * (1 - e) + (SIZE[i] * (0.82 + 0.22 * depth)) * e;
        c.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${base})`;
        c.style.zIndex = String(Math.round(depth * 10 + 10));
        if (depth > best) { best = depth; front = i; }
      }
      if (title.current) { title.current.style.transform = `translateY(${(-1 + e) * 0}px)`; title.current.style.top = `${(30 + 20 * e).toFixed(1)}%`; title.current.style.opacity = String(1 - e * 0.15); }
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
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((slug) => { const p = projectBySlug(slug)!; const im = p.images[0]; return (
          <li key={slug}><Link href={`/work/${slug}`} className="block no-underline"><img src={im.thumb} width={820} height={600} alt={p.title} loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" /><span className="mt-3 block font-[family-name:var(--font-display)] text-xl">{p.title}</span></Link></li>
        ); })}
      </ul>
    );
  }

  return (
    <div>
      <div ref={stage} onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(true); }} onPointerLeave={(e) => { if (e.pointerType === "mouse") setOpen(false); }}
        className="relative h-[34rem] w-full overflow-hidden rounded-2xl bg-[#f1eef6] md:h-[42rem]" data-orbit data-open={open}>
        <div ref={title} className="pointer-events-none absolute inset-x-0 z-[15] text-center font-[family-name:var(--font-display)] uppercase leading-[0.9] text-[clamp(2.2rem,1rem+5vw,6rem)] mix-blend-multiply" style={{ top: "30%", transform: "translateY(-50%)" }} aria-hidden="true">
          Selected<br />work
        </div>
        <ul>
          {FEATURED.map((slug, i) => {
            const p = projectBySlug(slug)!; const im = p.images[0];
            return (
              <li key={slug}>
                <Link ref={(n) => { cards.current[i] = n; }} href={`/work/${slug}`} aria-label={`${p.title}, ${categoryName(p.category)}`} onFocus={() => setOpen(true)}
                  className="absolute left-0 top-0 block w-[8.5rem] no-underline will-change-transform md:w-[12rem]" style={{ left: `${8 + i * 7.6}%`, top: "56%", transform: "translate(-50%, -50%) scale(0.36)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.thumb} width={820} height={600} alt="" loading="lazy" decoding="async" className="w-full rounded-md object-cover shadow-[0_8px_24px_rgba(47,32,88,.18)]" style={{ aspectRatio: String(ASPECT[i % ASPECT.length]) }} />
                </Link>
              </li>
            );
          })}
        </ul>
        <p ref={label} aria-live="off" className="pointer-events-none absolute inset-x-0 bottom-2 z-20 text-center font-[family-name:var(--font-display)] text-2xl md:text-3xl" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <button type="button" aria-pressed={open} onClick={() => setOpen((v) => !v)} className="btn btn-outline">{open ? "Close the orbit" : "Open the orbit"}</button>
        <p className="t-caption text-indigo-80">Move over the row to open it. Select any picture to see the project.</p>
      </div>
    </div>
  );
}
