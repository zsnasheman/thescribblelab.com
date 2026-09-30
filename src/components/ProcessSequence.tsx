"use client";

import { useEffect, useState } from "react";
import { ProcessVisual } from "./ProcessVisual";
import { Reveal } from "./Reveal";
import { C } from "@/lib/colors";
import { processStages } from "@/content/process";

const POS = [
  { x: 12, y: 30, r: 8 },
  { x: 40, y: 22, r: 10 },
  { x: 72, y: 26, r: 13 },
  { x: 106, y: 16, r: 8 },
  { x: 132, y: 8, r: 7 },
];

/** Five-bubble progress marker: four lavender, one emerald; filled bubbles show progress. */
function Progress({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 146 54" aria-hidden="true" className="h-10 w-auto">
      {POS.map((p, i) => {
        const on = i <= active;
        const col = i === 4 ? C.emerald : C.lavender;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y + 14}
            r={p.r}
            fill={on ? col : "transparent"}
            stroke={col}
            strokeWidth={on ? 0 : 2}
            style={{ transition: "fill 0.5s" }}
          />
        );
      })}
    </svg>
  );
}

export function ProcessSequence() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = processStages
      .map((s) => document.getElementById(`stage-${s.id}`))
      .filter(Boolean) as HTMLElement[];
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = processStages.findIndex((s) => `stage-${s.id}` === e.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      {/* Sticky marker: progress only, never a pinned scroll trap */}
      <div className="sticky top-[4.25rem] z-20 -mx-4 border-y border-indigo/10 bg-paper/95 px-4 py-3 backdrop-blur-sm sm:mx-0 sm:rounded-full sm:border sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Progress active={active} />
          <ol className="hidden gap-5 sm:flex" aria-label="Process stages">
            {processStages.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#stage-${s.id}`}
                  aria-current={i === active ? "step" : undefined}
                  className={`t-caption font-semibold ${i === active ? "link" : "no-underline opacity-75 hover:opacity-100"}`}
                >
                  <span className="tabular-nums text-lavender">{i + 1}</span> {s.name}
                </a>
              </li>
            ))}
          </ol>
          <p className="t-caption font-semibold sm:hidden" aria-live="polite">
            {active + 1} of 5 · {processStages[active].name}
          </p>
        </div>
      </div>

      <ol className="mt-10 space-y-16 md:space-y-24">
        {processStages.map((s, i) => (
          <li key={s.id} id={`stage-${s.id}`} className="scroll-mt-40">
            <Reveal className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
              <div className={`md:col-span-5 ${i % 2 ? "md:order-2" : ""}`}>
                <p className="t-label text-lavender">
                  Stage <span className="tabular-nums">{i + 1}</span> of 5
                </p>
                <h3 className="t-h1 mt-3">{s.name}</h3>
                <p className="t-lead mt-4 font-medium">{s.line}</p>
                <p className="t-body mt-3 measure text-indigo-80">{s.body}</p>
              </div>
              <div className={`md:col-span-7 ${i % 2 ? "md:order-1" : ""}`}>
                <div className="rounded-md border border-indigo/10 bg-white p-3 shadow-[8px_8px_0_var(--color-indigo-10)]">
                  <ProcessVisual id={s.id} label={s.visualLabel} />
                  <p className="t-caption px-1 pb-1 pt-3 text-indigo-80">
                    Illustration: {s.visualLabel.toLowerCase()}.
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
