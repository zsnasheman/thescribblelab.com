"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const subscribeMq = (q: string) => (cb: () => void) => {
  const mq = window.matchMedia(q);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True on devices with a precise hovering pointer (a mouse or trackpad). Server assumes false. */
export function useFinePointer(): boolean {
  const q = "(hover: hover) and (pointer: fine)";
  return useSyncExternalStore(subscribeMq(q), () => window.matchMedia(q).matches, () => false);
}

/** True while the element is (nearly) on screen, so continuous work can stop when it is not. */
export function useInView<T extends Element>(ref: RefObject<T | null>, margin = "120px"): boolean {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return on;
}

/**
 * Eases a value toward a target on animation frames, only while `active`.
 * The loop stops when it arrives, and when the scene is off screen, so the work stays proportional.
 */
export function useEased(target: { x: number; y: number }, active: boolean, k = 0.14) {
  const [v, setV] = useState({ x: target.x, y: target.y });
  const cur = useRef({ x: target.x, y: target.y });
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const step = () => {
      const dx = target.x - cur.current.x;
      const dy = target.y - cur.current.y;
      if (Math.abs(dx) < 0.002 && Math.abs(dy) < 0.002) {
        cur.current = { x: target.x, y: target.y };
        setV({ ...cur.current });
        return;
      }
      cur.current = { x: cur.current.x + dx * k, y: cur.current.y + dy * k };
      setV({ ...cur.current });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target.x, target.y, active, k]);
  return active ? v : target;
}
