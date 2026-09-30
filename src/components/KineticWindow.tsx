"use client";

import { useEffect, useRef, useState } from "react";
import { C } from "@/lib/colors";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const CYCLE_MS = 14000; // brand book: loop every 8 to 20 seconds

/** Move the window by hand with the slider, or press play. The scene reads the same position either way. */
export function KineticWindow() {
  const reduced = usePrefersReducedMotion();
  const [p, setP] = useState(0); // 0..1 through one full cycle
  const [playing, setPlaying] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    if (!playing || reduced) return;
    let raf = 0;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = now - last.current;
      last.current = now;
      setP((v) => (v + dt / CYCLE_MS) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced]);

  const t = (1 - Math.cos(p * Math.PI * 2)) / 2; // 0 → 1 → 0, eased
  const pct = Math.round(t * 100);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <p className="t-label text-white/85">Signature capability</p>
        <h2 className="t-display mt-4">Move the window yourself.</h2>
        <p className="t-lead mt-6 max-w-[38ch] text-white/90">
          Kinetic windows are part set design, part engineering. Two panels slide on rails while a
          pendant disc rises and swings. Drag the handle, or let it run: one full cycle takes
          fourteen seconds, so a passer-by catches the whole change.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {!reduced && (
            <button type="button" className="btn btn-coral" onClick={() => setPlaying((v) => !v)} aria-pressed={playing}>
              {playing ? "Pause" : "Set it in motion"}
            </button>
          )}
          <button type="button" className="btn btn-outline text-white" onClick={() => { setPlaying(false); setP(0); }} disabled={p === 0 && !playing}>
            Reset
          </button>
        </div>
        <p className="t-caption mt-5 text-white/80">This is an illustration of a kinetic window, not a completed client installation.</p>
      </div>

      <div className="lg:col-span-7">
        <div className="overflow-hidden rounded-xl bg-[#231746] p-3 md:p-5">
          <svg viewBox="0 0 400 300" role="img" aria-label={`Illustration of a shop window. The panels are ${pct} percent open.`} className="block h-auto w-full">
            <rect width="400" height="300" fill="#231746" />
            {/* floor with receding lines */}
            <path d="M0 250h400" stroke="#fff" strokeOpacity=".18" />
            {[60, 130, 200, 270, 340].map((x) => (<path key={x} d={`M${x} 250L${200 + (x - 200) * 1.7} 300`} stroke="#fff" strokeOpacity=".1" />))}
            <circle cx="200" cy="124" r={60 + t * 12} fill={C.paper} opacity={0.08 + t * 0.12} />
            <rect x="52" y="60" width="296" height="3" fill="#fff" opacity=".7" />
            <rect x="52" y="160" width="296" height="3" fill="#fff" opacity=".7" />
            <g data-kin style={{ transform: `translateX(${62 * t}px)` }}><rect x="74" y="63" width="86" height="92" fill={C.coral} /></g>
            <g data-kin style={{ transform: `translateX(${-74 * t}px)` }}><rect x="236" y="168" width="98" height="68" fill={C.lavender} /></g>
            <g data-kin style={{ transform: `translateY(${-46 * t}px)` }}>
              <g data-kin style={{ transformOrigin: "50% 0%", transform: `rotate(${-16 + 32 * t}deg)` }}>
                <line x1="200" y1="24" x2="200" y2="104" stroke="#fff" strokeWidth="2" />
                <circle cx="200" cy="120" r="22" fill={C.mustard} />
              </g>
            </g>
            <rect x="170" y="208" width="60" height="42" fill={C.paper} />
            <circle cx="200" cy="196" r="10" fill={C.emerald} />
            <rect x="40" y="18" width="320" height="232" fill="none" stroke="#fff" strokeWidth="3" />
          </svg>
          <div className="px-2 pb-2 pt-5 text-white">
            <label htmlFor="kin-range" className="t-label text-white/85">Drag to move the window</label>
            <input id="kin-range" type="range" min={0} max={1000} step={1} value={Math.round(p * 1000)}
              onChange={(e) => { setPlaying(false); setP(Number(e.target.value) / 1000); }}
              aria-valuetext={`Panels ${pct} percent open`}
              className="mt-3 h-10 w-full cursor-grab accent-[#FF663E] active:cursor-grabbing" />
          </div>
        </div>
      </div>
    </div>
  );
}
