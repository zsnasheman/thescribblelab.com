"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { BLOB, CORAL, DOTS } from "@/content/guide";
import type { Featured } from "@/content/featured";
import { SAMPLES } from "@/content/art";
import { arch, ease, lerp, lerpPts, place, seg, smoothPath } from "@/lib/morph";

/** World = the hero scene image (884 x 744). The arch that opens onto the skyline in that image is the aperture. */
const IMG = { w: 884, h: 744 };
const ARCH_W = { cx: 697, top: 338, w: 96, h: 210 };

type L = { W: number; H: number; k: number; x0: number; y0: number; bx: number; by: number; bs: number; mobile: boolean };

function layout(W: number, H: number): L {
  const mobile = W < 900;
  if (!mobile) {
    const k = Math.min((H * 0.9) / IMG.h, (W * 0.64) / IMG.w);
    return { W, H, k, x0: W - IMG.w * k + W * 0.02, y0: H * 0.07, bx: W * 0.7, by: H * 0.54, bs: Math.min(W * 0.5, H * 1.0), mobile };
  }
  const k = (H * 0.5) / IMG.h;
  return { W, H, k, x0: W - IMG.w * k * 0.93, y0: H * 0.47, bx: W * 0.56, by: H * 0.755, bs: Math.min(W * 0.9, H * 0.5), mobile };
}

const SCRIBBLE =
  "M-0.36 0.07L-0.31 0.02L-0.27 0.11L-0.22 -0.01L-0.18 0.12L-0.13 -0.04C-0.11 -0.22 -0.04 -0.25 -0.01 -0.12C0.02 0.04 -0.03 0.2 -0.07 0.2C-0.15 0.2 -0.08 -0.17 0 -0.24C0.09 -0.29 0.12 0 0.09 0.14C0.07 0.24 0.02 0.25 0.01 0.2C0.04 -0.1 0.14 -0.27 0.2 -0.21C0.23 -0.18 0.26 -0.22 0.3 -0.2";

const CHIPS = [
  { id: "timber", x: 0.06, y: 0.7, r: -5, s: 0.1 },
  { id: "travertine", x: 0.2, y: 0.76, r: 3, s: 0.12 },
  { id: "wash", x: 0.74, y: 0.76, r: 4, s: 0.1 },
  { id: "granite", x: 0.88, y: 0.68, r: -3, s: 0.075 },
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

    const vis = (n: HTMLElement | SVGElement, o: number) => {
      n.style.opacity = String(o);
      (n.style as CSSStyleDeclaration).visibility = o < 0.02 ? "hidden" : "visible";
    };

    const apply = () => {
      raf = 0;
      const { W, H, k, x0, y0, bx, by, bs } = L;
      const bPos = { x: bx + cur.x * 10, y: by + cur.y * 7 };
      const toArch = ease(seg(p, 0.08, 0.28));
      const ap = ease(seg(p, 0.6, 0.86));

      // The guide's body: blob -> arch -> aperture
      const archPts = arch(x0 + ARCH_W.cx * k, y0 + ARCH_W.top * k, ARCH_W.w * k, ARCH_W.h * k);
      const big = arch(W / 2, -W * 0.34, W * 1.3, H + W * 0.34 + H * 0.2);
      const blobPts = place(BLOB, bPos.x, bPos.y, bs);
      const pts = lerpPts(lerpPts(blobPts, archPts, toArch), big, ap);
      const d = smoothPath(pts);
      E.body.setAttribute("d", d);
      E.clip.setAttribute("d", d);
      E.outline.setAttribute("d", d);
      E.body.style.opacity = String(1 - seg(p, 0.25, 0.31));
      E.outline.style.opacity = String(seg(p, 0.25, 0.31) * (1 - seg(p, 0.8, 0.92)));

      // Coral partner shape and dots recede as the mark becomes spatial
      const co = 1 - seg(p, 0.1, 0.24);
      E.coral.setAttribute("d", smoothPath(place(CORAL, bPos.x, bPos.y, bs)));
      E.coral.style.opacity = String(co);
      E.dots.style.opacity = String(co);
      E.dots.setAttribute("transform", `translate(${bPos.x} ${bPos.y}) scale(${bs})`);

      // The scribble draws itself on load, then hands its line on
      E.scribbleG.setAttribute("transform", `translate(${bPos.x} ${bPos.y}) scale(${bs})`);
      E.scribbleG.style.opacity = String(1 - seg(p, 0.12, 0.24));

      // Connector: the scribble's tail runs to the arch, then the sketch follows it
      const tail = [bPos.x + 0.3 * bs, bPos.y - 0.2 * bs], target = [archPts[archPts.length - 12][0], archPts[archPts.length - 12][1]];
      E.connector.setAttribute("d", `M${tail[0]} ${tail[1]}C${tail[0] + (target[0] - tail[0]) * 0.2} ${tail[1] - 90} ${target[0] - 140} ${target[1] + 60} ${target[0]} ${target[1]}`);
      const draw = seg(p, 0.1, 0.24);
      E.connector.style.strokeDashoffset = String(1 - draw);
      E.connector.style.opacity = String(seg(p, 0.1, 0.14) * (1 - seg(p, 0.36, 0.46)));

      // Sketch, then colour, wipe across the scene; a coral line leads each reveal
      E.world.setAttribute("transform", `translate(${x0 + cur.x * 6} ${y0 + cur.y * 4}) scale(${k})`);
      const wi = ease(seg(p, 0.16, 0.36)), wc = ease(seg(p, 0.36, 0.54));
      E.inkClip.setAttribute("width", String(IMG.w * 1.02 * wi));
      E.colorClip.setAttribute("width", String(IMG.w * 1.02 * wc));
      const front = wc > 0.001 && wc < 0.999 ? wc : wi > 0.001 && wi < 0.999 ? wi : 0;
      E.front.setAttribute("transform", `translate(${IMG.w * 1.02 * front} 0)`);
      E.front.style.opacity = String(front > 0 ? 1 : 0);

      // Material samples settle around the drawing
      const chips = seg(p, 0.42, 0.58);
      CHIPS.forEach((c, i) => {
        const n = E["chip" + i]; const t = ease(seg(chips, i * 0.15, 0.55 + i * 0.15));
        vis(n, t * (1 - seg(p, 0.62, 0.72)));
        n.style.transform = `translate(0, ${(1 - t) * 24}px) rotate(${c.r}deg)`;
      });

      // The arch opens onto the project layer
      const projIn = seg(p, 0.5, 0.58);
      E.project.style.opacity = String(projIn);

      // Text beats
      vis(E.beatA, 1 - seg(p, 0.06, 0.12));
      vis(E.beatB, seg(p, 0.13, 0.19) * (1 - seg(p, 0.33, 0.39)));
      vis(E.beatC, seg(p, 0.4, 0.46) * (1 - seg(p, 0.55, 0.62)));
      vis(E.beatD, seg(p, 0.84, 0.92));
      vis(E.scrim, seg(p, 0.8, 0.9));
      vis(E.cue, 1 - seg(p, 0.02, 0.08));
      E.bar.style.transform = `scaleX(${p})`;
      void lerp;
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
            <linearGradient id="jc-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f2058" /><stop offset=".55" stopColor="#6b5291" /><stop offset="1" stopColor="#ffb08f" /></linearGradient>
          </defs>
          <g ref={set("world")}>
            <g clipPath={scene("jc-ink")}><image href="/art/hero-ink.webp" width={IMG.w} height={IMG.h} /></g>
            <g clipPath={scene("jc-color")}><image href="/art/hero.webp" width={IMG.w} height={IMG.h} /></g>
            <g ref={set("front")} style={{ opacity: 0 }}><path d={`M0 -20C14 90 -14 190 0 300S14 520 0 ${IMG.h + 20}`} fill="none" stroke="#ff663e" strokeWidth={4 } strokeLinecap="round" vectorEffect="non-scaling-stroke" /></g>
          </g>
          <path ref={set("coral")} fill="#ff663e" />
          <path ref={set("body")} fill="#2f2058" />
          <g ref={set("dots")}>{DOTS.map(([x, y, r, c], i) => <circle key={i} cx={x} cy={y} r={r} fill={c === "g" ? "#1e9e74" : "#6b5291"} />)}</g>
          <g ref={set("scribbleG")}>
            <path d={SCRIBBLE} pathLength={1} fill="none" stroke="#fff" strokeWidth={0.036} strokeLinecap="round" strokeLinejoin="round" className="scribble-draw" />
          </g>
          <path ref={set("connector")} pathLength={1} fill="none" stroke="#ff663e" strokeWidth={3} strokeLinecap="round" strokeDasharray="1" style={{ strokeDashoffset: 1 }} vectorEffect="non-scaling-stroke" />
          {/* The project layer, seen through the aperture */}
          <g ref={set("project")} clipPath={scene("jc-ap")} style={{ opacity: 0 }}>
            <rect width="100%" height="100%" fill={featured.kind !== "concept" ? "#2b2b2e" : "url(#jc-dusk)"} />
            <image href={featured.src} preserveAspectRatio={featured.kind !== "concept" ? "xMidYMid slice" : "xMidYMax meet"} x={featured.kind !== "concept" ? "0" : "5%"} y={featured.kind !== "concept" ? "0" : "4%"} width={featured.kind !== "concept" ? "100%" : "90%"} height={featured.kind !== "concept" ? "100%" : "92%"} />
          </g>
          <path ref={set("outline")} fill="none" stroke="#ff663e" strokeWidth={4} vectorEffect="non-scaling-stroke" style={{ opacity: 0 }} />
        </svg>

        {/* Material samples */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {CHIPS.map((c, i) => {
            const m = SAMPLES[c.id];
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={c.id} ref={set("chip" + i)} src={m.src} alt="" width={m.w} height={m.h} loading="lazy" className="absolute aspect-square rounded-md border-2 border-white object-cover shadow-[0_6px_18px_rgba(47,32,88,.25)]"
                style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, width: `clamp(48px, ${c.s * 100}vmin, 120px)`, opacity: 0, visibility: "hidden" }} />
            );
          })}
        </div>

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
