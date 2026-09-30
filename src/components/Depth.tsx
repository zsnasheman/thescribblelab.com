"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { useFinePointer } from "@/lib/hooks";

/**
 * Pointer depth for selected artwork: at most 8 px across, 5 px down. Text is never inside it.
 * Listens only while the area is on screen, only for a fine pointer, never under reduced motion.
 */
export function Depth({ children, className = "", host }: { children: React.ReactNode; className?: string; host?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;
    const area = (host ? el.closest(host) : el.parentElement) as HTMLElement | null;
    if (!area) return;
    let raf = 0;
    let on = false;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = area.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
        const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
        el.style.setProperty("--dx", (-x).toFixed(3));
        el.style.setProperty("--dy", (-y).toFixed(3));
      });
    };
    const start = () => { if (!on) { on = true; window.addEventListener("pointermove", move, { passive: true }); } };
    const stop = () => { if (on) { on = false; window.removeEventListener("pointermove", move); } };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(area);
    return () => { io.disconnect(); stop(); cancelAnimationFrame(raf); };
  }, [reduced, fine, host]);
  return <div ref={ref} className={`depth ${className}`}>{children}</div>;
}
