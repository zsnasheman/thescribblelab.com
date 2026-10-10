"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { STRIP } from "@/content/concept";
import { categoryName, projectBySlug, type PortfolioProject } from "@/content/portfolio";
import { SITE } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Rect = { top: number; left: number; width: number; height: number };
const PROJECTS = STRIP.map((s) => projectBySlug(s)).filter(Boolean) as PortfolioProject[];

/** Selected project grows from its card into a focused view. Esc, the close button or a click outside returns it. */
function Focus({ p, from, onClose }: { p: PortfolioProject; from: Rect; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const img = p.images[0];
  const closeRef = useRef<HTMLButtonElement>(null);
  const target = (): Rect => {
    const w = window.innerWidth, h = window.innerHeight, m = w < 768;
    return m ? { top: 72, left: 16, width: w - 32, height: Math.min(h * 0.42, (w - 32) * (img.h / img.w)) }
      : { top: 96, left: w * 0.06, width: w * 0.56, height: h - 150 };
  };
  const close = () => { setOpen(false); setTimeout(onClose, 520); };
  useLayoutEffect(() => { const id = requestAnimationFrame(() => setOpen(true)); return () => cancelAnimationFrame(id); }, []);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", key);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = prev; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const r = open ? target() : from;
  return (
    <div role="dialog" aria-modal="true" aria-label={p.title} className="fixed inset-0 z-[60]">
      <div className={`dashes absolute inset-0 bg-white transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} onClick={close} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} alt={p.alt || p.title} className="absolute object-cover shadow-[0_30px_80px_rgba(47,32,88,.3)]" style={{ top: r.top, left: r.left, width: r.width, height: r.height, borderRadius: open ? 18 : 12, transition: "all .55s cubic-bezier(.2,.8,.2,1)" }} />
      <div className={`absolute bottom-0 right-0 flex flex-col justify-center p-6 transition-all duration-500 md:top-24 md:w-[34vw] md:pr-[5vw] ${open ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-4"} max-md:left-0 max-md:top-[calc(72px+42svh+1.5rem)]`}>
        <p className="cap text-coral">{categoryName(p.category)}{p.where ? ` · ${p.where}` : ""}</p>
        <h3 className="cond mt-2 text-[clamp(2.2rem,1rem+3vw,4.4rem)] text-indigo">{p.title}</h3>
        <p className="mt-3 max-w-[40ch] text-indigo-80">{p.summary}</p>
        <div className="mt-5 flex flex-wrap gap-3"><Link href={`/work/${p.slug}`} className="btn btn-coral">View project</Link><button type="button" onClick={close} className="btn btn-outline">Back to projects</button></div>
      </div>
      <button ref={closeRef} type="button" onClick={close} aria-label="Close project" className="absolute right-4 top-4 z-10 h-11 w-11 rounded-full bg-indigo text-xl text-white">×</button>
    </div>
  );
}

export function ConceptProjects() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<{ p: PortfolioProject; from: Rect; opener: HTMLElement } | null>(null);

  useEffect(() => {
    const el = root.current, tr = track.current;
    if (!el || !tr || reduced) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, el.offsetHeight - window.innerHeight)));
      tr.style.transform = `translate3d(${-p * Math.max(0, tr.scrollWidth - window.innerWidth)}px,0,0)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on); apply();
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [reduced]);

  // Keyboard users can tab along the strip: bring a focused card into view by scrolling the page to its position.
  const reveal = useCallback((card: HTMLElement) => {
    const el = root.current, tr = track.current; if (!el || !tr || reduced) return;
    const vw = window.innerWidth, max = Math.max(1, tr.scrollWidth - vw);
    const c = card.offsetLeft + card.offsetWidth / 2;
    const p = Math.min(1, Math.max(0, (c - vw / 2) / max));
    window.scrollTo({ top: el.offsetTop + p * (el.offsetHeight - window.innerHeight) });
  }, [reduced]);

  const open = (p: PortfolioProject, btn: HTMLElement) => {
    const im = btn.querySelector("img")!.getBoundingClientRect();
    setSel({ p, from: { top: im.top, left: im.left, width: im.width, height: im.height }, opener: btn });
  };
  const closeSel = () => { sel?.opener.focus({ preventScroll: true }); setSel(null); };

  const card = (p: PortfolioProject, i: number) => (
    <button key={p.slug} type="button" onClick={(e) => open(p, e.currentTarget)} onFocus={(e) => reveal(e.currentTarget)} className="group block w-[clamp(15rem,27vw,26rem)] shrink-0 text-left" style={{ marginTop: reduced ? 0 : i % 2 ? "9svh" : 0 }} aria-label={`${p.title}, open project`}>
      <span className="block overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(47,32,88,.16)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.images[0].thumb} alt="" width={820} height={600} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      </span>
      <span className="cap mt-3 block text-coral">{categoryName(p.category)}</span>
      <span className="cond block text-[clamp(1.5rem,1rem+1.2vw,2.3rem)] text-indigo">{p.title}</span>
    </button>
  );

  return (
    <>
      <section id="projects" aria-labelledby="cp-h" data-counter="work" className="scroll-mt-0">
        {reduced ? (
          <div className="dashes bg-white py-20"><div className="container-x"><h2 id="cp-h" className="cond mb-8 text-5xl text-indigo">Selected work</h2><div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{PROJECTS.map(card)}</div></div></div>
        ) : (
          <div ref={root} className="relative" style={{ height: `${PROJECTS.length * 52 + 120}svh` }}>
            <div className="dashes sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden bg-white pb-20">
              <div className="container-x mb-6"><h2 id="cp-h" className="cond text-[clamp(2.6rem,1rem+5vw,6rem)] text-indigo">Selected work</h2><p className="text-indigo-80">Scroll to browse. Choose a project to open it.</p></div>
              <div ref={track} className="flex w-max gap-[clamp(1.2rem,3vw,3rem)] px-[5vw] will-change-transform">{PROJECTS.map(card)}</div>
            </div>
          </div>
        )}
      </section>
      <section data-counter="contact" className="container-x py-24 text-center" aria-labelledby="cc-h">
        <h2 id="cc-h" className="cond text-[clamp(2.4rem,1rem+5vw,6rem)] text-indigo">Have a project in mind?</h2>
        <p className="mx-auto mt-3 max-w-[40ch] text-indigo-80">Call {SITE.contact.phone}, message us on WhatsApp, or tell us what you are imagining.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/start-a-project" className="btn btn-coral btn-lg">Start a project</Link><a href={SITE.contact.whatsappHref} className="btn btn-outline btn-lg" rel="noopener">WhatsApp</a></div>
      </section>
      {sel && <Focus p={sel.p} from={sel.from} onClose={closeSel} />}
    </>
  );
}
