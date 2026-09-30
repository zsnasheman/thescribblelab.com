"use client";

import { useEffect, useId, useRef, useState } from "react";
import { KineticScene } from "./art/KineticScene";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { useInView } from "@/lib/hooks";

const CYCLE_MS = 14000; // the Brand Book suggests looping every 8 to 20 seconds

function explain(t: number) {
  if (t < 0.06) return { head: "At rest", text: "Both panels are closed and the pendant disc hangs low. This is where every cycle starts and ends." };
  if (t < 0.92) return { head: "In motion", text: "The upper panel travels right, carried on two carriages under the rail. The lower panel slides left along its floor guide. The disc lifts, then swings on its cord, and its light grows." };
  return { head: "Fully open", text: "The panels have passed each other and the object on the plinth is revealed. The mechanism now reverses smoothly back to rest." };
}

/** Move the window by hand with the slider, or press play. The drawing reads the same position either way. */
export function KineticDemo() {
  const uid = useId().replace(/:/g, "");
  const reduced = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const [p, setP] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [labels, setLabels] = useState(true);
  const last = useRef(0);

  useEffect(() => {
    if (!playing || reduced || !inView) return;
    let raf = 0;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last.current, 80);
      last.current = now;
      setP((v) => (v + dt / CYCLE_MS) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced, inView]);

  const t = (1 - Math.cos(p * Math.PI * 2)) / 2;
  const pct = Math.round(t * 100);
  const info = explain(t);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <p className="t-label text-white/85">Kinetic windows</p>
        <h2 className="t-h1 mt-4">Move the window yourself.</h2>
        <p className="t-lead mt-5 max-w-[44ch] text-white/90">
          A kinetic window is part set design, part engineering. Drag the handle to move the mechanism, or let it run. One full cycle takes fourteen seconds, so a passer-by catches the whole change.
        </p>
        <div className="mt-7 rounded-lg border border-white/25 p-4" aria-live="polite">
          <p className="t-label text-white/85">{info.head} · <span className="tabular-nums">{pct}%</span> open</p>
          <p className="t-body mt-2 text-white/90">{info.text}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {!reduced && (
            <button type="button" className="btn btn-coral" onClick={() => setPlaying((v) => !v)} aria-pressed={playing}>
              {playing ? "Pause" : "Play"}
            </button>
          )}
          <button type="button" className="btn btn-outline text-white" onClick={() => { setPlaying(false); setP(0); }} disabled={p === 0 && !playing}>Reset</button>
          <button type="button" className="btn btn-outline text-white" aria-pressed={labels} onClick={() => setLabels((v) => !v)}>{labels ? "Hide labels" : "Show labels"}</button>
        </div>
        <p className="t-caption mt-5 text-white/80">A designed demonstration of capability: an illustration, not a completed client installation.</p>
      </div>

      <div ref={box} className="lg:col-span-7">
        <div className="overflow-hidden rounded-xl bg-[#231746]">
          <svg viewBox="0 0 400 300" role="img" aria-label={`Illustration of a shop window with a rail and two sliding panels. The panels are ${pct} percent open.`} className="block h-auto w-full">
            <KineticScene t={t} uid={uid} labels={labels} />
          </svg>
          <div className="border-t border-white/15 px-4 pb-4 pt-4 text-white md:px-6">
            <label htmlFor={`${uid}-range`} className="t-label text-white/85">Drag to move the window</label>
            <input id={`${uid}-range`} type="range" min={0} max={1000} step={1} value={Math.round(p * 1000)}
              onChange={(e) => { setPlaying(false); setP(Number(e.target.value) / 1000); }}
              aria-valuetext={`${pct} percent open`} className="mt-2 h-11 w-full cursor-grab accent-[#FF663E] active:cursor-grabbing" />
          </div>
        </div>
      </div>
    </div>
  );
}
