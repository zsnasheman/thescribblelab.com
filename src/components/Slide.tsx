"use client";

import { useEffect, useRef } from "react";

/** Slides into place from the side (or rises) as it enters the viewport. Content is visible without JavaScript or motion. */
export function Slide({ children, from = "left", className = "", delay = 0 }: { children: React.ReactNode; from?: "left" | "right" | "up"; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} data-slide={from} className={className} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
