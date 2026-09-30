"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Photo } from "./Photo";
import { Arrow, Magnetic } from "./ui";
import { PH } from "@/content/placeholders";

const WORDS = ["Every", "space", "starts", "as", "a", "scribble."];

export function Hero() {
  const wrap = useRef<HTMLDivElement>(null);

  // Pointer-responsive depth: a layered enhancement, never required.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
      el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    const leave = () => { el.style.setProperty("--px", "0"); el.style.setProperty("--py", "0"); };
    window.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <section aria-labelledby="hero-title" className="on-dark relative overflow-hidden bg-indigo text-white">
      <div className="container-x grid items-center gap-10 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="t-label text-white/85">Design and build · Dubai</p>
          <h1 id="hero-title" className="t-mega mt-6 !text-[clamp(3rem,0.5rem+8.4vw,7.25rem)]">
            {WORDS.map((w, i) => (
              <span key={i}>
                <span className="word-mask">
                  <span className="word-rise" style={{ "--d": `${120 + i * 90}ms` } as React.CSSProperties}>{w}</span>
                </span>
                {i < WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <p className="t-lead mt-8 max-w-[40ch] text-white/90">
            We design and build interiors, exhibitions, events, brand activations and kinetic windows.
            One team, from the first sketch to the finished space.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic><Link href="/work" className="btn btn-coral btn-lg">Explore our work <Arrow /></Link></Magnetic>
            <Magnetic><Link href="/start-a-project" className="btn btn-outline btn-lg text-white">Start a project</Link></Magnetic>
          </div>
        </div>

        {/* Photo inside a cut-paper shape, layered with a coral shape and a stripe shape */}
        <div ref={wrap} className="relative mx-auto w-full max-w-[34rem] lg:col-span-4 lg:max-w-none" style={{ "--px": 0, "--py": 0 } as React.CSSProperties}>
          <div className="relative aspect-[5/6]">
            <div
              aria-hidden="true"
              className="blob-c absolute -right-[8%] -top-[6%] h-[62%] w-[70%] bg-coral transition-transform duration-500 ease-out"
              style={{ transform: "translate(calc(var(--px) * 18px), calc(var(--py) * 14px))" }}
            />
            <div
              aria-hidden="true"
              className="blob-a stripes absolute -bottom-[6%] -left-[10%] h-[44%] w-[58%] transition-transform duration-500 ease-out"
              style={{ transform: "translate(calc(var(--px) * -22px), calc(var(--py) * -16px))" }}
            />
            <div className="blob-b absolute inset-[6%] overflow-hidden bg-lavender">
              <div
                className="absolute -inset-[8%] transition-transform duration-500 ease-out"
                style={{ transform: "translate(calc(var(--px) * -12px), calc(var(--py) * -10px))" }}
              >
                <Photo photo={PH.hero} sizes="(min-width:1024px) 34vw, 90vw" priority />
              </div>
            </div>
            {/* Rotating caption badge (decorative) */}
            <svg aria-hidden="true" viewBox="0 0 120 120" className="spin-slow absolute -bottom-4 right-[4%] h-28 w-28 md:h-32 md:w-32">
              <circle cx="60" cy="60" r="58" fill="#FF663E" />
              <defs><path id="badge-path" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
              <text fontSize="11.5" fontWeight="600" letterSpacing="3.2" fill="#2F2058" style={{ fontFamily: "var(--font-figtree)" }}>
                <textPath href="#badge-path">DESIGN · BUILD · INSTALL ·</textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
