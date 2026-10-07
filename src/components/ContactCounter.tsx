"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";

const CHARS = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+.@&?-";
const H = 1; // each cell is one em of the display height

function Cell({ ch, h }: { ch: string; h: number }) {
  const idx = Math.max(0, CHARS.indexOf(ch.toUpperCase()));
  const spring = useSpring(idx, { stiffness: 90, damping: 18, mass: 0.9 });
  useEffect(() => { spring.set(idx); }, [idx, spring]);
  const y: MotionValue<string> = useTransform(spring, (v) => `${-v * h}em`);
  return (
    <span className="relative inline-block overflow-hidden rounded-[0.18em] bg-[#fbf9ff] shadow-[inset_0_0.06em_0.1em_rgba(47,32,88,.25),inset_0_-0.06em_0.1em_rgba(47,32,88,.12)]" style={{ width: "0.74em", height: `${h}em` }}>
      <motion.span className="absolute inset-x-0 top-0 flex flex-col" style={{ y }} aria-hidden="true">
        {[...CHARS].map((c, i) => (
          <span key={i} className="flex items-center justify-center text-indigo" style={{ height: `${h}em` }}>{c === " " ? "" : c}</span>
        ))}
      </motion.span>
      {/* cylinder shading */}
      <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(47,32,88,.38) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 72%, rgba(47,32,88,.38) 100%)" }} />
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-indigo/20" />
    </span>
  );
}

const SLOTS = 16;
const pad = (s: string) => {
  const left = Math.floor((SLOTS - s.length) / 2);
  return (" ".repeat(left) + s).padEnd(SLOTS, " ");
};

/** A rolling-counter display that spins through the ways to reach the studio. The real details sit in plain text beneath it. */
export function ContactCounter({ lines, intervalMs = 3200 }: { lines: string[]; intervalMs?: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % lines.length), intervalMs);
    return () => clearInterval(t);
  }, [paused, lines.length, intervalMs]);
  const text = pad(lines[i]);
  return (
    <div
      role="group" aria-label={`Contact the studio: ${lines.join(", ")}`}
      className="mx-auto inline-flex max-w-full flex-col items-center"
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
    >
      <div className="rounded-[1.4rem] bg-coral p-[clamp(.6rem,1.6vw,1.2rem)] shadow-[0_24px_60px_rgba(47,32,88,.22)]">
        <div className="flex gap-[0.22em] rounded-[1rem] bg-indigo p-[0.3em] font-[family-name:var(--font-display)] font-semibold text-[clamp(1.2rem,0.1rem+5vw,3.6rem)] leading-none" aria-hidden="true">
          {[...text].map((c, k) => <Cell key={k} ch={c} h={1.5 * H} />)}
        </div>
      </div>
      <div className="mt-5 flex gap-2" aria-hidden="true">
        {lines.map((_, k) => (
          <button key={k} type="button" tabIndex={-1} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-coral" : "w-2 bg-indigo/25"}`} />
        ))}
      </div>
    </div>
  );
}
