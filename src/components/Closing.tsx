"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { Patch } from "./Cutout";
import { SITE } from "@/lib/site";

/** The invitation as an envelope: it opens as it scrolls into view (or on hover or focus), and the letter asks about the project. */
export function Closing() {
  const c = SITE.contact;
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOpen(true); }, { threshold: 0.6 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <section aria-labelledby="close-h" className="relative overflow-hidden pb-20 pt-24 md:pb-32 md:pt-36">
      <Patch shape="blob-b" color="#ffe0d8" className="-left-[8%] top-[6%] -z-10 h-[70%] w-[42%]" />
      <Patch shape="blob-c" color="#e1dce9" className="-right-[10%] bottom-[0%] -z-10 h-[70%] w-[46%]" />
      <div className="container-x text-center">
        <p className="t-label text-lavender">The conversation</p>
        <div ref={ref} className={`relative mx-auto mt-10 w-full max-w-[44rem] ${open ? "env-open" : ""}`} onPointerEnter={() => setOpen(true)} onFocus={() => setOpen(true)} style={{ perspective: "1200px" }}>
          <div className="relative mx-auto aspect-[1.5/1] w-full">
            {/* back of the envelope */}
            <div className="absolute inset-0 rounded-2xl bg-coral shadow-[0_20px_50px_rgba(47,32,88,.18)]" />
            {/* the letter */}
            <div className="env-letter absolute inset-x-[6%] bottom-[8%] top-[6%] z-10 flex flex-col items-center justify-center rounded-xl bg-white px-6 text-center shadow-[0_6px_20px_rgba(47,32,88,.15)]">
              <h2 id="close-h" className="font-[family-name:var(--font-display)] text-[clamp(2rem,1rem+3.6vw,4.2rem)] leading-[1.02]">Have a project in mind?</h2>
              <p className="mt-2 text-indigo-80">Tell us what you are imagining. A person reads every message.</p>
            </div>
            {/* front pocket */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[62%] overflow-hidden rounded-b-2xl" aria-hidden="true">
              <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="h-full w-full"><path d="M0 0 50 38 100 0V62H0Z" fill="#ff7a57" /><path d="M0 62 44 28M100 62 56 28" stroke="#2f2058" strokeOpacity=".15" strokeWidth=".4" fill="none" /></svg>
            </div>
            {/* flap */}
            <div className="env-flap pointer-events-none absolute inset-x-0 top-0 z-30 h-[56%]" style={{ transformStyle: "preserve-3d", zIndex: open ? 5 : 30 }} aria-hidden="true">
              <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="h-full w-full"><path d="M0 0H100L50 56Z" fill="#ff663e" stroke="#2f2058" strokeOpacity=".15" strokeWidth=".4" /></svg>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/start-a-project" className="btn btn-coral btn-lg">Start a project <Arrow /></Link>
          <Link href="/contact" className="btn btn-outline btn-lg">Contact us</Link>
        </div>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-semibold">
          <a className="link" href={c.phoneHref}>{c.phone}</a>
          <a className="link" href={c.whatsappHref} rel="noopener">WhatsApp</a>
          <a className="link" href={`mailto:${c.email}`}>{c.email}</a>
        </p>
      </div>
    </section>
  );
}
