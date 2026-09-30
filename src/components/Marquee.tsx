"use client";

import { useState } from "react";

/** Slow ticker of the five worlds. Pauses on hover, has a visible pause control and stops for reduced motion. */
export function Marquee({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t + hidden} className="flex items-center">
          <span className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,1.2rem+4.5vw,5rem)] font-light leading-none tracking-tight">{t}</span>
          <span aria-hidden="true" className="mx-[clamp(1.25rem,3vw,3rem)] h-3 w-3 shrink-0 rounded-full bg-indigo md:h-4 md:w-4" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative bg-coral py-6 text-indigo md:py-8">
      <div className="marquee overflow-hidden" data-paused={paused} role="group" aria-label="The five worlds we work in">
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}
        className="t-label absolute bottom-1.5 right-3 rounded-full border border-indigo/50 px-3 py-1.5 text-[0.625rem] hover:bg-indigo hover:text-white md:right-6">
        {paused ? "Play ticker" : "Pause ticker"}
      </button>
    </div>
  );
}
