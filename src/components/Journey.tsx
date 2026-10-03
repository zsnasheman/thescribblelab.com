"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { BLOB } from "@/content/guide";
import type { Featured } from "@/content/featured";
import { arch, ease, lerpPts, place, seg, smoothPath } from "@/lib/morph";

/** World = a real design render (2000 x 1000). The window in it is the aperture; its arch outline is the guide's last form. */
const IMG = { w: 2000, h: 1000 };
const ARCH_W = { cx: 1190, top: 350, w: 330, h: 430 };
const ANCHOR = { cx: ARCH_W.cx, cy: ARCH_W.top + ARCH_W.h / 2 };

type L = { W: number; H: number; k: number; sx: number; sy: number; bs: number; mobile: boolean };

function layout(W: number, H: number): L {
  const mobile = W < 900;
  const k = Math.max(W / IMG.w, H / IMG.h);
  return mobile
    ? { W, H, k, sx: W * 0.5, sy: H * 0.7, bs: Math.min(W * 0.7, H * 0.36), mobile }
    : { W, H, k, sx: W * 0.64, sy: H * 0.52, bs: Math.min(W * 0.34, H * 0.62), mobile };
}

const SCRIBBLE =
  "M-0.36 0.07L-0.31 0.02L-0.27 0.11L-0.22 -0.01L-0.18 0.12L-0.13 -0.04C-0.11 -0.22 -0.04 -0.25 -0.01 -0.12C0.02 0.04 -0.03 0.2 -0.07 0.2C-0.15 0.2 -0.08 -0.17 0 -0.24C0.09 -0.29 0.12 0 0.09 0.14C0.07 0.24 0.02 0.25 0.01 0.2C0.04 -0.1 0.14 -0.27 0.2 -0.21C0.23 -0.18 0.26 -0.22 0.3 -0.2";

/** Real material crops from the supplied renders, placed as an arranged board in the colour beat. */
const CHIPS = [
  { src: "/projects/m-timber.webp", w: 320, h: 320, x: 0.05, y: 0.7, r: -4, s: 0.13 },
  { src: "/projects/m-moss.webp", w: 320, h: 336, x: 0.17, y: 0.79, r: 3, s: 0.12 },
  { src: "/projects/m-travertine.webp", w: 320, h: 168, x: 0.77, y: 0.8, r: 4, s: 0.15 },
  { src: "/projects/m-lattice.webp", w: 320, h: 352, x: 0.9, y: 0.66, r: -3, s: 0.1 },
] as const;

export function Journey({ featured }: { featured: Featured }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [els] = useState<Record<string, SVGElement | HTMLElement | null>>(() => ({}));
  const set = (k: string) => (n: SVGElement | HTMLElement | null) => { els[k] = n; };

  useEffect(() => {
    const rootEl = root.current, stageEl = stage.current;
    if (!rootEl || !stageEl) return;
    const E = els as Record<string, SVGElement & HTMLElement>;
    let L = layout(stageEl.clientWidth, stageEl.clientHeight);
    let ptr = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 };
    let p = 0;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const vis = (n: HTMLElement | SVGElement, o: number) => {
      n.style.opacity = String(o);
      (n.style as CSSStyleDeclaration).visibility = o < 0.02 ? "hidden" : "visible";
    };

    const apply = () => {
      raf = 0;
      if (!E.world || !E.body) return;
      const { W, H, k, sx, sy, bs } = L;
      const now = performance.now();
      const intro = ease(Math.min(1, (now - t0) / 2600));
      if (intro < 1) schedule();
      // slow dolly: the camera eases back as the story advances
      const sc = k * (1 + 0.14 * (1 - ease(seg(p, 0, 0.62))));
      let ox = sx - ANCHOR.cx * sc + cur.x * -8, oy = sy - ANCHOR.cy * sc + cur.y * -5;
      ox = Math.min(0, Math.max(W - IMG.w * sc, ox)); oy = Math.min(0, Math.max(H - IMG.h * sc, oy));
      const w2s = (x: number, y: number): [number, number] => [ox + x * sc, oy + y * sc];
      E.world.setAttribute("transform", `translate(${ox} ${oy}) scale(${sc})`);

      // The guide: blob outline -> arch outline -> aperture
      const [ac, at] = w2s(ARCH_W.cx, ARCH_W.top);
      const toArch = ease(seg(p, 0.08, 0.3));
      const ap = ease(seg(p, 0.6, 0.86));
      const archPts = arch(ac, at, ARCH_W.w * sc, ARCH_W.h * sc);
      const [cx0, cy0] = w2s(ANCHOR.cx, ANCHOR.cy);
      const big = arch(W / 2, -W * 0.34, W * 1.3, H + W * 0.34 + H * 0.2);
      const pts = lerpPts(lerpPts(place(BLOB, cx0, cy0, bs), archPts, toArch), big, ap);
      const d = smoothPath(pts);
      E.body.setAttribute("d", d);
      E.clip.setAttribute("d", d);
      E.body.style.opacity = String((1 - seg(p, 0.84, 0.92)) * intro);
      E.scribbleG.setAttribute("transform", `translate(${cx0} ${cy0}) scale(${bs * 0.9})`);
      E.scribbleG.style.opacity = String(1 - seg(p, 0.1, 0.26));

      // Line drawing of the real render draws itself on load; the render itself develops from it
      const wc = ease(seg(p, 0.34, 0.56));
      E.inkClip.setAttribute("width", String(IMG.w * 1.01 * intro));
      E.colorClip.setAttribute("width", String(IMG.w * 1.01 * wc));
      const front = wc > 0.001 && wc < 0.999 ? wc : intro < 0.999 ? intro : 0;
      E.front.setAttribute("x1", String(IMG.w * 1.01 * front)); E.front.setAttribute("x2", String(IMG.w * 1.01 * front));
      E.front.style.opacity = front > 0 ? "1" : "0";
      E.ink.style.opacity = String(1 - seg(p, 0.5, 0.64) * 0.85);

      // Real material samples settle around the drawing
      CHIPS.forEach((c, i) => {
        const n = E["chip" + i]; const t = ease(seg(seg(p, 0.42, 0.58), i * 0.15, 0.55 + i * 0.15));
        vis(n, t * (1 - seg(p, 0.62, 0.72)));
        n.style.transform = `translate(0, ${(1 - t) * 24}px) rotate(${c.r}deg)`;
      });

      // The arch opens onto the project layer
      E.project.style.opacity = String(seg(p, 0.5, 0.58));

      // Copy sits on a calm paper surface that clears as the project takes over
      vis(E.shade, 1 - seg(p, 0.44, 0.58));
      vis(E.beatA, 1 - seg(p, 0.06, 0.12));
      vis(E.beatB, seg(p, 0.13, 0.19) * (1 - seg(p, 0.33, 0.39)));
      vis(E.beatC, seg(p, 0.4, 0.46) * (1 - seg(p, 0.49, 0.55)));
      vis(E.beatD, seg(p, 0.84, 0.92));
      vis(E.scrim, seg(p, 0.8, 0.9));
      vis(E.cue, 1 - seg(p, 0.02, 0.08));
      E.bar.style.transform = `scaleX(${p})`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };

    const onScroll = () => {
      const r = rootEl.getBoundingClientRect();
      const span = rootEl.offsetHeight - window.innerHeight;
      p = Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
      schedule();
    };
    const onMove = (e: PointerEvent) => {
      if (p > 0.1) return;
      const r = stageEl.getBoundingClientRect();
      ptr = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
      cur = { x: ptr.x, y: ptr.y };
      schedule();
    };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ro = new ResizeObserver(() => { L = layout(stageEl.clientWidth, stageEl.clientHeight); onScroll(); schedule(); });
    ro.observe(stageEl);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) { window.addEventListener("scroll", onScroll, { passive: true }); if (fine) window.addEventListener("pointermove", onMove, { passive: true }); onScroll(); }
      else { window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onMove); }
    }, { rootMargin: "200px" });
    io.observe(rootEl);
    onScroll(); schedule();
    return () => { ro.disconnect(); io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [els]);

  const scene = (id: string) => `url(#${id})`;
  return (
    <div ref={root} className="journey-live relative" style={{ height: "430svh" }} data-journey>
      <div ref={stage} className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
        {/* The guide and the scene. Decorative; the copy below carries the meaning. */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <clipPath id="jc-ap"><path ref={set("clip")} /></clipPath>
            <clipPath id="jc-ink"><rect ref={set("inkClip")} x="0" y="0" width="0" height={IMG.h} /></clipPath>
            <clipPath id="jc-color"><rect ref={set("colorClip")} x="0" y="0" width="0" height={IMG.h} /></clipPath>
          </defs>
          <g ref={set("world")}>
            <g ref={set("ink")} clipPath={scene("jc-ink")}><image href="/projects/reception-ink.webp" width={IMG.w} height={IMG.h} preserveAspectRatio="none" /></g>
            <g clipPath={scene("jc-color")}><image href="/projects/reception-full.webp" width={IMG.w} height={IMG.h} preserveAspectRatio="none" /></g>
            <line ref={set("front")} x1="0" x2="0" y1="0" y2={IMG.h} stroke="#ff663e" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ opacity: 0 }} />
          </g>
          <g ref={set("scribbleG")}>
            <path d={SCRIBBLE} pathLength={1} fill="none" stroke="#ff663e" strokeWidth={0.02} strokeLinecap="round" strokeLinejoin="round" className="scribble-draw" />
          </g>
          <path data-guide="body" ref={set("body")} fill="none" stroke="#ff663e" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
          {/* The project layer, seen through the aperture */}
          <g ref={set("project")} clipPath={scene("jc-ap")} style={{ opacity: 0 }}>
            <rect width="100%" height="100%" fill={featured.kind !== "concept" ? "#2b2b2e" : "url(#jc-dusk)"} />
            <image href={featured.src} preserveAspectRatio={featured.kind !== "concept" ? "xMidYMid slice" : "xMidYMax meet"} x={featured.kind !== "concept" ? "0" : "5%"} y={featured.kind !== "concept" ? "0" : "4%"} width={featured.kind !== "concept" ? "100%" : "90%"} height={featured.kind !== "concept" ? "100%" : "92%"} />
          </g>
        </svg>

        {/* Material samples */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {CHIPS.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={c.src} ref={set("chip" + i)} src={c.src} alt="" width={c.w} height={c.h} loading="lazy" className="absolute rounded-md border-2 border-white object-cover shadow-[0_8px_24px_rgba(20,10,50,.35)]"
              style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, width: `clamp(56px, ${c.s * 100}vmin, 150px)`, aspectRatio: `${c.w}/${c.h}`, opacity: 0, visibility: "hidden" }} />
          ))}
        </div>

        <div ref={set("shade")} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(246,243,250,.96)_0%,rgba(246,243,250,.9)_38%,rgba(246,243,250,0)_66%)] md:bg-[linear-gradient(90deg,rgba(246,243,250,.97)_0%,rgba(246,243,250,.9)_30%,rgba(246,243,250,0)_64%)]" />
        <div ref={set("scrim")} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-indigo/85 via-indigo/45 to-transparent" style={{ opacity: 0, visibility: "hidden" }} />

        {/* Copy: one block position, so the story never stacks paragraphs under images */}
        <div className="container-x pointer-events-none absolute inset-x-0 top-[10.75rem] z-20 sm:top-[12rem] lg:top-[13rem]">
          <div ref={set("beatA")} className="pointer-events-auto max-w-[44rem]">
            <h1 className="t-hero">
              <span className="block">Small scribbles.</span>
              <span className="block">Extraordinary spaces.</span>
            </h1>
            <p className="t-lead mt-5 max-w-[30rem]">The Scribble Lab designs and builds creative spaces and experiences: interiors, exhibitions, events, brand activations and kinetic windows.</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/work" className="btn btn-indigo btn-lg">Explore our work <Arrow /></Link>
              <a href="#breadth" className="draw-link py-2 font-semibold">Skip the story</a>
            </div>
          </div>
          <div ref={set("beatB")} className="absolute left-4 top-0 max-w-[26rem] sm:left-auto md:left-[clamp(1rem,4vw,3.5rem)]" style={{ opacity: 0, visibility: "hidden" }}>
            <p className="t-label text-lavender">01 · The idea</p>
            <p className="t-h1 mt-3 !text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)]">It starts as a line.</p>
            <p className="t-lead mt-3">We follow that line from the first sketch until it can be built.</p>
          </div>
          <div ref={set("beatC")} className="absolute left-4 top-0 max-w-[26rem] md:left-[clamp(1rem,4vw,3.5rem)]" style={{ opacity: 0, visibility: "hidden" }}>
            <p className="t-label text-lavender">02 · Material</p>
            <p className="t-h1 mt-3 !text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)]">Then it gets a surface.</p>
            <p className="t-lead mt-3">Colour, texture and light enter the drawing. Samples are chosen against the sketch, not after it.</p>
          </div>
        </div>

        {/* The reveal caption */}
        <div ref={set("beatD")} className="container-x pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-10 text-white md:pb-14" style={{ opacity: 0, visibility: "hidden" }}>
          <div className="pointer-events-auto max-w-[34rem]">
            <p className="t-label text-white/90">03 · The space{featured.kind === "concept" ? " · Concept study" : featured.kind === "placeholder" ? " · Placeholder image" : ""}</p>
            <p className="t-h1 mt-2 !text-[clamp(1.75rem,1.2rem+2vw,3rem)]">{featured.title}</p>
            <p className="mt-2 text-white/95">{featured.line}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href={featured.href} className="btn btn-coral">{featured.kind === "built" ? "Explore the project" : featured.kind === "placeholder" ? "See interiors work" : "Read the study"} <Arrow /></Link>
              <a href="#breadth" className="btn btn-outline text-white">Keep exploring</a>
            </div>
          </div>
        </div>

        <div ref={set("cue")} className="pointer-events-none absolute bottom-6 left-4 z-20 hidden items-center gap-3 text-indigo-80 sm:flex md:left-[clamp(1rem,4vw,3.5rem)]">
          <span className="t-label">Scroll</span><span aria-hidden="true" className="h-px w-16 bg-indigo/50" />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-30 h-[3px] bg-transparent"><div ref={set("bar")} className="h-full origin-left bg-coral" style={{ transform: "scaleX(0)" }} /></div>
      </div>
    </div>
  );
}
