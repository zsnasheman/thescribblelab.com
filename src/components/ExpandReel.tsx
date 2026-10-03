"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Arrow } from "./ui";
import { mediaById } from "@/content/media";

/** A framed image that opens to the full screen as you scroll (normal scrolling, pinned only while it opens). */
export function ExpandReel({ imageId = "reception" }: { imageId?: string }) {
  const m = mediaById(imageId);
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, fr = frame.current, im = img.current, cp = copy.current, lb = label.current;
    if (!el || !fr || !im || !cp || !lb) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const p = reduce ? 1 : Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
      const e = Math.min(1, p / 0.7);
      const t = 1 - Math.pow(1 - e, 3);
      const mobile = window.innerWidth < 768;
      const it = (mobile ? 30 : 26) * (1 - t), ib = (mobile ? 16 : 10) * (1 - t), ix = (mobile ? 6 : 22) * (1 - t);
      fr.style.clipPath = `inset(${it}% ${ix}% ${ib}% ${ix}% round ${34 * (1 - t)}px)`;
      im.style.transform = `scale(${1.22 - 0.22 * t})`;
      const c = Math.min(1, Math.max(0, (p - 0.62) / 0.25));
      cp.style.opacity = String(c); cp.style.transform = `translateY(${(1 - c) * 24}px)`;
      cp.style.visibility = c < 0.02 ? "hidden" : "visible";
      lb.style.opacity = String(1 - Math.min(1, p / 0.35));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); onScroll(); }
      else { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
    }, { rootMargin: "200px" });
    io.observe(el); apply();
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={root} className="relative" style={{ height: "260svh" }} data-expand>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-paper">
        <div ref={label} className="container-x pointer-events-none absolute inset-x-0 top-24 z-10 text-center md:top-28">
          <p className="t-label text-lavender">Interiors</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-light">Every space starts with a line.</p>
        </div>
        <div ref={frame} className="scrub-img absolute inset-0" style={{ clipPath: "inset(26% 22% 10% 22% round 34px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={img} src={m.src} width={m.w} height={m.h} alt={m.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ transform: "scale(1.22)" }} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,50,0)_45%,rgba(20,10,50,.78)_100%)]" />
        </div>
        <div ref={copy} className="container-x on-dark absolute inset-x-0 bottom-0 z-10 pb-12 text-white md:pb-16" style={{ opacity: 0, visibility: "hidden" }}>
          <p className="t-label text-white/90">{m.kind === "photograph" ? "Photograph" : "Design visual"} · Placeholder image</p>
          <p className="t-lux mt-3 !text-[clamp(2rem,1rem+4vw,4.5rem)]">Residential, commercial, retail and hospitality interiors.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/interiors" className="btn btn-coral">About interiors <Arrow /></Link>
            <Link href="/work?service=interiors" className="btn btn-outline text-white">See the work</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
