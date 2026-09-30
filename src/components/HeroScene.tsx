"use client";

import { useEffect, useRef, useState } from "react";
import { C } from "@/lib/colors";

type State = "idea" | "material" | "space";

const STATES: { id: State; label: string; caption: string; alt: string }[] = [
  {
    id: "idea",
    label: "Idea",
    caption: "A first drawing: proportions, openings and where the light comes in.",
    alt: "A pencil-style elevation drawing of a room with an arched opening, on a sheet of dot-grid paper",
  },
  {
    id: "material",
    label: "Material",
    caption: "Finishes chosen against the drawing: lacquer, plaster, stripe and terrazzo.",
    alt: "The same elevation with cut-paper material panels laid over it: lavender wall, coral feature panel, terrazzo floor",
  },
  {
    id: "space",
    label: "Space",
    caption: "The drawing resolved into a place people can use.",
    alt: "The finished room: an arched opening to a sunlit courtyard, a sofa, a pendant lamp and a planter",
  },
];

export function HeroScene() {
  const [state, setState] = useState<State>("idea");
  const [drawKey, setDrawKey] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const current = STATES.find((s) => s.id === state)!;

  // Pointer-responsive depth: an enhancement only, never required.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
      el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    const leave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const choose = (s: State) => {
    if (s === state) return;
    setState(s);
    if (s === "idea") setDrawKey((k) => k + 1);
  };

  const showMaterial = state !== "idea";
  const showSpace = state === "space";

  return (
    <div>
      <div ref={wrap} className="relative">
        <svg
          viewBox="0 0 560 420"
          role="img"
          aria-label={current.alt}
          data-state={state}
          className="block h-auto w-full"
        >
          <defs>
            <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill={C.indigo} opacity=".16" />
            </pattern>
            <pattern id="terrazzo" width="44" height="30" patternUnits="userSpaceOnUse">
              <rect width="44" height="30" fill="#ece6f4" />
              <circle cx="8" cy="8" r="2.6" fill={C.lavender} />
              <circle cx="28" cy="6" r="1.8" fill={C.coral} />
              <circle cx="36" cy="22" r="2.8" fill={C.indigo} opacity=".75" />
              <circle cx="16" cy="22" r="1.6" fill={C.mustard} />
              <circle cx="3" cy="27" r="1.4" fill={C.indigo} opacity=".5" />
            </pattern>
            <pattern id="stripeS" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
              <rect width="14" height="14" fill="#fff" />
              <rect width="14" height="7" fill={C.mustard} />
            </pattern>
            <clipPath id="arch">
              <path d="M190 300V170a70 70 0 0 1 140 0v130Z" />
            </clipPath>
          </defs>

          {/* drawing plane: paper sheet with a flat offset, slightly turned */}
          <g className="scene-parallax" style={{ "--k": 3 } as React.CSSProperties}>
            <g transform="rotate(-1.4 280 210)">
              <rect x="30" y="30" width="520" height="380" rx="6" fill="#d9d2e6" />
              <rect x="20" y="20" width="520" height="380" rx="6" fill={C.paper} />
              <rect x="20" y="20" width="520" height="380" rx="6" fill="url(#dots)" />
            </g>
          </g>

          <g transform="rotate(-1.4 280 210)">
            {/* five ideas rising (always five, one emerald) */}
            <g className="scene-layer scene-parallax" style={{ "--k": 9, transform: state === "idea" ? "translateY(8px)" : "translateY(0)" } as React.CSSProperties}>
              <circle cx="446" cy="58" r="8" fill={C.lavender} />
              <circle cx="468" cy="44" r="11" fill={C.lavender} />
              <circle cx="494" cy="52" r="14" fill={C.lavender} />
              <circle cx="514" cy="36" r="8" fill={C.lavender} />
              <circle cx="478" cy="26" r="7" fill={C.emerald} />
            </g>

            {/* MATERIAL: cut-paper panels laid over the drawing */}
            <g
              className="scene-layer scene-parallax"
              style={{ "--k": 5, opacity: showMaterial ? 1 : 0, transform: showMaterial ? "translateY(0)" : "translateY(14px)" } as React.CSSProperties}
            >
              <rect x="60" y="70" width="130" height="230" fill={C.lavender} />
              <rect x="330" y="70" width="40" height="230" fill={C.indigo} />
              <rect x="370" y="90" width="100" height="210" fill={C.coral} />
              <rect x="470" y="70" width="30" height="230" fill={C.indigo} />
              <rect x="190" y="70" width="140" height="30" fill={C.indigo} />
              <rect x="60" y="300" width="440" height="32" fill="url(#terrazzo)" />
              {/* stripe sample, inside a blob, as a material tag */}
              <path
                d="M70 356c10-14 38-18 58-8 18 9 20 26 6 36-16 11-50 10-62-2-6-6-6-16-2-26Z"
                fill="url(#stripeS)"
              />
              <rect x="150" y="350" width="26" height="26" rx="3" fill={C.lavender} />
              <rect x="182" y="350" width="26" height="26" rx="3" fill={C.coral} />
              <rect x="214" y="350" width="26" height="26" rx="3" fill="url(#terrazzo)" />
            </g>

            {/* SPACE: the finished room */}
            <g
              className="scene-layer scene-parallax"
              style={{ "--k": 7, opacity: showSpace ? 1 : 0, transform: showSpace ? "translateY(0)" : "translateY(14px)" } as React.CSSProperties}
            >
              <g clipPath="url(#arch)">
                <rect x="190" y="100" width="140" height="200" fill="#fff" />
                <circle cx="290" cy="150" r="17" fill={C.mustard} />
                <circle cx="222" cy="252" r="30" fill={C.emerald} />
                <circle cx="252" cy="270" r="24" fill={C.emerald} opacity=".8" />
                <rect x="190" y="282" width="140" height="18" fill="#ece6f4" />
              </g>
              {/* sofa */}
              <rect x="74" y="236" width="104" height="64" rx="14" fill={C.indigo} />
              <rect x="74" y="222" width="104" height="30" rx="12" fill={C.indigo} />
              <rect x="88" y="252" width="76" height="16" rx="7" fill={C.lavender} />
              {/* pendant */}
              <line x1="260" y1="70" x2="260" y2="112" stroke={C.indigo} strokeWidth="2" />
              <path d="M240 140a20 20 0 0 1 40 0Z" fill={C.mustard} />
              {/* planter */}
              <rect x="388" y="268" width="26" height="32" rx="3" fill={C.indigo} />
              <circle cx="401" cy="252" r="18" fill={C.emerald} />
              <circle cx="415" cy="262" r="11" fill={C.emerald} />
            </g>

            {/* IDEA: architectural line work, always present, redrawn on returning to Idea */}
            <g
              key={drawKey}
              className={`scene-layer ${drawKey ? "draw-anim" : ""}`}
              fill="none"
              stroke={C.indigo}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: state === "space" ? 0.55 : 1 }}
            >
              {/* construction lines */}
              <path pathLength={1} d="M40 170H540" strokeWidth="1" strokeDasharray="6 5" opacity=".4" style={drawKey ? { strokeDasharray: 1 } : undefined} />
              <path pathLength={1} d="M260 50V350" strokeWidth="1" opacity=".4" style={drawKey ? { strokeDasharray: 1 } : undefined} />
              {/* room */}
              <path pathLength={1} d="M60 300V70H500V300" strokeWidth="2.4" />
              <path pathLength={1} d="M40 300H520" strokeWidth="2.4" />
              {/* arched opening */}
              <path pathLength={1} d="M190 300V170a70 70 0 0 1 140 0V300" strokeWidth="2.4" />
              {/* feature panel */}
              <path pathLength={1} d="M370 90H470V300M370 90V300" strokeWidth="1.8" />
              {/* sofa, pendant, planter */}
              <path pathLength={1} d="M80 300V244a12 12 0 0 1 12-12h70a12 12 0 0 1 12 12v56M92 232V222a10 10 0 0 1 10-10h50a10 10 0 0 1 10 10v10" strokeWidth="1.8" />
              <path pathLength={1} d="M260 70V118M240 140a20 20 0 0 1 40 0Z" strokeWidth="1.8" />
              <path pathLength={1} d="M388 300V268h26v32M401 268V250" strokeWidth="1.8" />
              {/* dimensions */}
              <path pathLength={1} d="M60 334V344M500 334V344M60 339H500" strokeWidth="1.2" />
              <path pathLength={1} d="M38 70H28M38 300H28M33 70V300" strokeWidth="1.2" />
            </g>
            <text x="280" y="362" textAnchor="middle" fontSize="11" fill={C.indigo} opacity=".7" style={{ fontFamily: "var(--font-figtree)" }}>
              4 200
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div role="group" aria-label="Show the scene as an idea, a material study or a finished space" className="flex flex-wrap gap-2">
          {STATES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={state === s.id}
              onClick={() => choose(s.id)}
              className={`btn !min-h-11 !px-5 !py-2 ${
                state === s.id ? "btn-coral" : "btn-outline text-white"
              }`}
            >
              <span aria-hidden="true" className="tabular-nums opacity-70">{i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>
        <p className="t-body min-h-[3.25rem] max-w-[34ch] text-white/90" aria-live="polite">
          <span className="sr-only">{current.label}: </span>
          {current.caption}
        </p>
      </div>
    </div>
  );
}
