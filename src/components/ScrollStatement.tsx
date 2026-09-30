"use client";

import { useEffect, useRef } from "react";

const TEXT =
  "We are a design and build studio. One team draws the idea, builds it in our own workshop and installs it on site, so what you approve on paper is exactly what stands in the space.";

/** Words light up as you read down the page. Fully readable without scrolling or with reduced motion. */
export function ScrollStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = p * words.length * 1.15;
      words.forEach((w, i) => { w.style.opacity = String(Math.min(1, Math.max(0.16, 0.16 + (lit - i) * 0.6))); });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <p ref={ref} className="t-h1 max-w-[26ch] sm:max-w-[30ch] lg:max-w-[34ch]">
      {TEXT.split(" ").map((w, i) => (
        <span key={i} data-w style={{ opacity: 1, transition: "opacity .25s linear" }}>{w}{" "}</span>
      ))}
    </p>
  );
}
