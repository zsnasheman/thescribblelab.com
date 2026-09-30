"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { FinishInset, JoineryInset, LightInset } from "./art/Insets";
import { RoomScene, type Hotspot, type Mode } from "./art/RoomScene";
import { Arrow } from "./ui";
import { useEased, useFinePointer, useInView } from "@/lib/hooks";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const MODES: { id: Mode; label: string; caption: string }[] = [
  { id: "idea", label: "Idea", caption: "A drawing first: one viewpoint, the proportions, the openings and where the light will enter." },
  { id: "material", label: "Material", caption: "The same room in cut-paper materials: lacquered battens, terrazzo with a brass inlay, plaster and a coral panel." },
  { id: "space", label: "Space", caption: "The resolved space, with daylight through the glazing, a pendant, furniture and a courtyard beyond." },
];

const HOTSPOTS: Hotspot[] = [
  { id: "joinery", n: 1, label: "Joinery detail", u: -1, v: 0.48, d: 0.7 },
  { id: "finish", n: 2, label: "Terrazzo finish", u: 0.2, v: 0, d: 0.2 },
  { id: "light", n: 3, label: "Daylight", u: 1, v: 0.5, d: 0.72 },
];

const DETAILS: Record<string, { title: string; text: string }> = {
  joinery: { title: "Joinery detail", text: "Battens sit proud of a dark, felt-backed panel so the gaps read as shadow. The niche is cut into the same rhythm, and its light is tucked above the opening." },
  finish: { title: "Terrazzo finish", text: "Chips of mixed size in a pale matrix. The brass strip sits on a movement joint, so the floor can shift without cracking and the line still looks intentional." },
  light: { title: "Daylight", text: "The glazed wall throws light across the floor. Move the Light control to change the sun's height and see how far the light reaches into the room." },
};

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export function SpatialHero() {
  const uid = useId().replace(/:/g, "");
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);

  const [mode, setMode] = useState<Mode>("idea");
  const [touched, setTouched] = useState(false);
  const [slider, setSlider] = useState(0);
  const [light, setLight] = useState(0.55);
  const [selected, setSelected] = useState<string | null>(null);
  const [ptr, setPtr] = useState<{ x: number; y: number } | null>(null);

  // One gentle pass from drawing to materials to space, then it stops. Any interaction cancels it.
  useEffect(() => {
    if (touched || reduced || !inView) return;
    const a = setTimeout(() => setMode("material"), 2400);
    const b = setTimeout(() => setMode("space"), 4800);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [touched, reduced, inView]);

  const target = ptr ?? { x: slider, y: 0 };
  const eased = useEased(target, inView && !reduced);
  const view = { ox: eased.x * 72, oy: eased.y * 30 };
  const lightEff = clamp(light + (ptr ? ptr.x * 0.12 : 0), 0, 1);

  const interact = () => setTouched(true);
  const choose = (m: Mode) => { interact(); setMode(m); };
  const pick = (id: string) => { interact(); setSelected((s) => (s === id ? null : id)); };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPtr({ x: clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1), y: clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1) });
  };

  // With reduced motion the room simply starts resolved; nothing animates on its own.
  const shown: Mode = reduced && !touched ? "space" : mode;
  const cur = MODES.find((m) => m.id === shown)!;
  const detail = selected ? DETAILS[selected] : null;

  return (
    <section aria-labelledby="hero-title" className="on-dark bg-indigo text-white">
      <div className="container-x grid gap-x-12 gap-y-8 py-10 md:py-14 lg:grid-cols-12 lg:py-16">
        <div className="order-1 lg:col-span-5">
          <p className="t-label text-white/85">Design and build · Dubai</p>
          <h1 id="hero-title" className="t-display mt-4 !text-[clamp(2.25rem,1.5rem+2.9vw,3.75rem)]">Every space starts as a scribble.</h1>
          <p className="t-lead mt-5 max-w-[42ch] text-white/90">
            We design and build interiors, exhibitions, events, brand activations and kinetic windows, from the first sketch to the finished space.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-coral">See our work <Arrow /></Link>
            <Link href="/start-a-project" className="btn btn-outline text-white">Start a project</Link>
          </div>
        </div>

        {/* The scene and its controls */}
        <div className="order-2 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <div ref={wrap} className="relative">
            <div aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl bg-white/15 sm:translate-x-3 sm:translate-y-3" />
            <div
              onPointerMove={fine ? onMove : undefined}
              onPointerLeave={() => setPtr(null)}
              onPointerDown={interact}
              className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper text-indigo sm:aspect-[5/4] lg:aspect-[12/7]"
            >
              <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" role="group" aria-label="An interactive architectural perspective of a room. Use the controls below, or select the numbered details." className="absolute inset-0 h-full w-full">
                <RoomScene uid={uid} mode={shown} view={view} light={lightEff} hotspots={HOTSPOTS} selected={selected} onSelect={pick} />
              </svg>
              <p className="t-label pointer-events-none absolute left-3 top-3 rounded-full bg-indigo px-3 py-2 text-[0.65rem] text-white">
                {cur.label}
              </p>
            </div>
          </div>

          {/* Controls: equal in every input mode */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div role="group" aria-label="Show the room as an idea, a material study or a finished space" className="grid grid-cols-3 gap-2 sm:col-span-2">
              {MODES.map((m, i) => (
                <button key={m.id} type="button" aria-pressed={shown === m.id} onClick={() => choose(m.id)}
                  className={`btn !min-h-12 !px-2 ${shown === m.id ? "btn-coral" : "btn-outline text-white"}`}>
                  <span aria-hidden="true" className="tabular-nums opacity-70">{i + 1}</span>{m.label}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor={`${uid}-view`} className="t-label text-white/85">View angle</label>
              <input id={`${uid}-view`} type="range" min={-100} max={100} step={1} value={Math.round(slider * 100)}
                onChange={(e) => { interact(); setSlider(Number(e.target.value) / 100); }}
                aria-valuetext={slider < -0.05 ? "Looking from the left" : slider > 0.05 ? "Looking from the right" : "Centred"}
                className="mt-2 h-10 w-full accent-[#FF663E]" />
            </div>
            <div>
              <label htmlFor={`${uid}-light`} className="t-label text-white/85">Light</label>
              <input id={`${uid}-light`} type="range" min={0} max={100} step={1} value={Math.round(light * 100)}
                onChange={(e) => { interact(); setLight(Number(e.target.value) / 100); setMode("space"); }}
                aria-valuetext={light > 0.66 ? "High sun" : light > 0.33 ? "Mid-height sun" : "Low, raking sun"}
                className="mt-2 h-10 w-full accent-[#FF663E]" />
            </div>
          </div>
          <p className="t-body mt-2 min-h-[3.25rem] text-white/90" aria-live="polite">{cur.caption}</p>
        </div>

        {/* Inspectable details */}
        <div className="order-3 lg:col-span-5 lg:row-start-2">
          <h2 className="t-label text-white/85">Inspect a detail</h2>
          <ul className="mt-3 grid gap-2">
            {HOTSPOTS.map((h) => (
              <li key={h.id}>
                <button type="button" aria-pressed={selected === h.id} onClick={() => pick(h.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left font-semibold transition-colors ${selected === h.id ? "border-coral bg-white/10" : "border-white/30 hover:border-white/70"}`}>
                  <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-indigo">{h.n}</span>
                  {h.label}
                </button>
              </li>
            ))}
          </ul>
          {detail && selected && (
            <div className="mt-4 overflow-hidden rounded-lg bg-paper text-indigo" role="region" aria-label={detail.title}>
              <div className="border-b border-indigo/15">
                {selected === "joinery" && <JoineryInset />}
                {selected === "finish" && <FinishInset />}
                {selected === "light" && <LightInset light={light} />}
              </div>
              <div className="p-4">
                <p className="t-h3">{detail.title}</p>
                <p className="t-body mt-1 text-indigo-80">{detail.text}</p>
                <p className="t-caption mt-2 text-indigo-80">Illustrative detail, drawn for this scene.</p>
                <button type="button" className="btn btn-outline mt-3 !min-h-10 !py-2" onClick={() => setSelected(null)}>Close detail</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
