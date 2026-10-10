"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export const CHARS = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+.@&?-";

function Cell({ ch }: { ch: string }) {
  const idx = Math.max(0, CHARS.indexOf(ch.toUpperCase()));
  const spring = useSpring(idx, { stiffness: 90, damping: 18, mass: 0.9 });
  useEffect(() => { spring.set(idx); }, [idx, spring]);
  const y = useTransform(spring, (v) => `${-v * 1.5}em`);
  return (
    <span className="relative inline-block overflow-hidden rounded-[0.18em] bg-[#fbf9ff] shadow-[inset_0_0.06em_0.1em_rgba(47,32,88,.25)]" style={{ width: "0.74em", height: "1.5em" }}>
      <motion.span className="absolute inset-x-0 top-0 flex flex-col" style={{ y }}>
        {[...CHARS].map((c, i) => <span key={i} className="flex items-center justify-center text-indigo" style={{ height: "1.5em" }}>{c === " " ? "" : c}</span>)}
      </motion.span>
      <span className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(47,32,88,.38) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 72%, rgba(47,32,88,.38) 100%)" }} />
    </span>
  );
}

/** Rolling letter tiles for a phrase, centred in a fixed number of slots. Decorative: pair with a readable label. */
export function RollingText({ text, slots, className = "" }: { text: string; slots: number; className?: string }) {
  const left = Math.max(0, Math.floor((slots - text.length) / 2));
  const padded = (" ".repeat(left) + text).padEnd(slots, " ");
  return (
    <div aria-hidden="true" className={`flex gap-[0.22em] rounded-[0.7em] bg-indigo p-[0.3em] font-[family-name:var(--font-display)] font-semibold leading-none ${className}`}>
      {[...padded].map((c, k) => <Cell key={k} ch={c} />)}
    </div>
  );
}
