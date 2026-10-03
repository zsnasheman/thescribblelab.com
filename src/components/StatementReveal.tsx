"use client";

import { useEffect, useRef } from "react";

/** A large statement whose words come into focus as it scrolls through the viewport. All words are readable without motion. */
export function StatementReveal({ text, id }: { text: string; id?: string }) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".stmt-w"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { spans.forEach((s) => (s.style.opacity = "1")); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55 + r.height * 0.6)));
      spans.forEach((s, i) => { s.style.opacity = String(0.16 + 0.84 * Math.min(1, Math.max(0, p * (spans.length + 6) - i) / 4)); });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); }
      else window.removeEventListener("scroll", onScroll);
    }, { rootMargin: "100px" });
    io.observe(el);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <p id={id} ref={root} className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,0.9rem+3.4vw,4rem)] font-light leading-[1.12] tracking-[-0.01em]">
      {words.map((w, i) => (<span key={i} className="stmt-w">{w}{i < words.length - 1 ? " " : ""}</span>))}
    </p>
  );
}
