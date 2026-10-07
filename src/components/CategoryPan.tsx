"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Patch } from "./Cutout";
import { CATEGORIES, projectBySlug, type Category } from "@/content/portfolio";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Item = { id: Category; slug: string; img: number; x: number; y: number; w: number; shape: "blob-a" | "blob-b" | "blob-c" | "circle" | "arch" | "pill"; patch: string; label: "up" | "down" };
// Positions are in "landscape widths" (1 = one screen), so the scene reads left to right as you scroll.
const ITEMS: Item[] = [
  { id: "food-and-beverage", slug: "hitchki-mirdif", img: 0, x: 0.08, y: 46, w: 24, shape: "blob-a", patch: "#ffe0d8", label: "up" },
  { id: "commercial", slug: "roche-riyadh", img: 0, x: 0.44, y: 38, w: 22, shape: "arch", patch: "#2f2058", label: "up" },
  { id: "retail", slug: "the-juice-beauty", img: 0, x: 0.78, y: 48, w: 24, shape: "blob-b", patch: "#d99a12", label: "up" },
  { id: "residential", slug: "dt1-downtown", img: 3, x: 1.14, y: 36, w: 22, shape: "circle", patch: "#bfe8da", label: "up" },
  { id: "events", slug: "ahmed-al-maghribi-launch", img: 3, x: 1.5, y: 46, w: 24, shape: "blob-c", patch: "#ff663e", label: "up" },
  { id: "exhibitions", slug: "laduree-expex", img: 0, x: 1.86, y: 38, w: 22, shape: "blob-b", patch: "#6b5291", label: "up" },
  { id: "brand-activations", slug: "fifa-arab-cup-qatar", img: 0, x: 2.2, y: 46, w: 24, shape: "blob-a", patch: "#2f2058", label: "up" },
  { id: "kinetic-windows", slug: "chopard-kinetic-windows", img: 0, x: 2.56, y: 38, w: 22, shape: "circle", patch: "#ff663e", label: "up" },
];
const CUTS = [
  { src: "/cut/ariel.webp", w: 1426, h: 777, x: 1.02, wv: 30, alt: "Ariel Platinum Gel activation, concept design" },
  { src: "/cut/bowl.webp", w: 1160, h: 727, x: 1.98, wv: 26, alt: "Huda Beauty bowling alley activation, concept design" },
  { src: "/cut/ariel-kiosk.webp", w: 863, h: 788, x: 2.36, wv: 20, alt: "Ariel retail kiosk, concept design" },
];

/** A scroll-driven pan across a contour landscape: each discipline is a grey photograph (colour on hover) in a curved shape, with a link label. */
export function CategoryPan() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, tr = track.current;
    if (!el || !tr || reduced) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      const max = tr.scrollWidth - window.innerWidth;
      tr.style.transform = `translate3d(${-p * max}px,0,0)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on); on(); } else { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); } }, { rootMargin: "200px" });
    io.observe(el); apply();
    return () => { io.disconnect(); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [reduced]);

  if (reduced) {
    return (
      <section aria-labelledby="cats-h" className="dashes bg-white py-20">
        <div className="container-x"><h2 id="cats-h" className="cond mb-8 text-5xl text-indigo">Our work</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{ITEMS.map((it) => { const p = projectBySlug(it.slug)!; return (<li key={it.id}><Link href={`/work?category=${it.id}`} className="block no-underline"><span className="cond text-2xl text-indigo">{CATEGORIES.find((c) => c.id === it.id)?.name} ▸</span>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.images[it.img].thumb} alt={p.title} width={820} height={600} className="bw mt-2 aspect-[4/3] w-full rounded-2xl object-cover" /></Link></li>); })}</ul></div>
      </section>
    );
  }
  return (
    <div ref={root} className="relative" style={{ height: "380svh" }} data-pan>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-white">
        <h2 id="cats-h" className="sr-only">Our work by discipline</h2>
        <div ref={track} className="dashes absolute inset-y-0 left-0 will-change-transform" style={{ width: "calc(var(--u) * 340)", ["--u" as string]: "max(1vw, 6.2px)" }}>
          <Patch shape="blob-c" color="#e1dce9" className="left-[calc(var(--u)*4)] top-[6%] h-[24%] w-[calc(var(--u)*26)] opacity-80" />
          <Patch shape="blob-a" color="#ffe0d8" className="left-[calc(var(--u)*150)] top-[8%] h-[22%] w-[calc(var(--u)*24)]" />
          <Patch shape="blob-b" color="#bfe8da" className="left-[calc(var(--u)*250)] top-[6%] h-[24%] w-[calc(var(--u)*26)]" />
          {CUTS.map((c) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={c.src} src={c.src} width={c.w} height={c.h} alt={c.alt} loading="lazy" className="pointer-events-none absolute bottom-[3%] z-10 h-auto" style={{ left: `calc(var(--u) * ${c.x * 100})`, width: `calc(var(--u) * ${c.wv})`, minWidth: 200 }} />
          ))}
          {ITEMS.map((it) => {
            const p = projectBySlug(it.slug)!; const im = p.images[it.img] ?? p.images[0];
            const name = CATEGORIES.find((c) => c.id === it.id)?.name ?? it.id;
            return (
              <Link key={it.id} href={`/work?category=${it.id}`} className="cat group absolute z-20 block -translate-y-0 no-underline" style={{ left: `calc(var(--u) * ${it.x * 100})`, bottom: `${100 - it.y - 36}%`, width: `calc(var(--u) * ${it.w})`, minWidth: 170 }}>
                <span className="cond mb-3 flex items-center gap-2 text-[clamp(1.4rem,0.8rem+1.6vw,2.4rem)] text-indigo">{name}<span aria-hidden="true" className="inline-block h-0 w-0 border-y-[0.38em] border-l-[0.6em] border-y-transparent border-l-coral" /></span>
                <span className="relative block" style={{ aspectRatio: it.shape === "arch" ? "4 / 5" : it.shape === "pill" ? "1.5 / 1" : "1 / 1" }}>
                  <span aria-hidden="true" className="absolute inset-0 translate-x-[6%] translate-y-[5%] scale-[1.02]" style={{ WebkitMaskImage: `url(/shapes/${it.shape}.svg)`, maskImage: `url(/shapes/${it.shape}.svg)`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", background: it.patch }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.thumb} alt={`${p.title}, ${name}`} width={820} height={600} loading="lazy" className="bw absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" style={{ WebkitMaskImage: `url(/shapes/${it.shape}.svg)`, maskImage: `url(/shapes/${it.shape}.svg)`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
                </span>
              </Link>
            );
          })}
        </div>
        <p className="cap pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-indigo-80">Scroll →</p>
      </div>
    </div>
  );
}
