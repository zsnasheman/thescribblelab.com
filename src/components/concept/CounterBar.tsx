"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COUNTER, type CounterKey } from "@/content/concept";
import { RollingText } from "./RollingText";

/** Fixed bottom counter. It reads the section under the middle of the screen (`data-counter="key"`) and rolls to that phrase. */
export function CounterBar() {
  const [key, setKey] = useState<CounterKey>("idea");
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let cur: CounterKey | null = null;
      document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) cur = el.dataset.counter as CounterKey;
      });
      if (cur) setKey(cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on); tick();
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  const text = COUNTER.phrases[key];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 md:bottom-5">
      <Link href="/start-a-project" className="pointer-events-auto rounded-[1rem] bg-coral p-[0.35rem] no-underline shadow-[0_14px_36px_rgba(47,32,88,.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo" aria-label={`${text}. Start a project`}>
        <RollingText text={text} slots={COUNTER.slots} className="text-[clamp(.85rem,.3rem+2.9vw,1.35rem)]" />
      </Link>
    </div>
  );
}
