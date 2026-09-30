"use client";

import { useState } from "react";
import { Photo } from "./Photo";
import { Bubbles } from "./ui";
import { processStages } from "@/content/process";

/** Hover, tap or focus a stage to open it. Five bubbles track progress; labels never rely on colour alone. */
export function ProcessAccordion() {
  const [active, setActive] = useState(0);
  const fine = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-indigo/20 pb-5">
          <Bubbles active={active + 1} size={11} />
          <p className="t-caption font-semibold" aria-live="polite">Stage <span className="tabular-nums">{active + 1}</span> of 5: {processStages[active].name}</p>
        </div>
        <ol>
          {processStages.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.id} className="border-b border-indigo/20" onMouseEnter={() => fine() && setActive(i)}>
                <h3>
                  <button type="button" id={`stage-btn-${s.id}`} aria-expanded={on} aria-controls={`stage-panel-${s.id}`}
                    onClick={() => setActive(i)} onFocus={() => setActive(i)}
                    className="group flex w-full items-baseline justify-between gap-6 py-5 text-left md:py-7">
                    <span className="flex items-baseline gap-5 md:gap-8">
                      <span className="t-label w-6 tabular-nums text-lavender">0{i + 1}</span>
                      <span className={`font-[family-name:var(--font-display)] text-[clamp(2.25rem,1.3rem+4vw,4.75rem)] font-light leading-none tracking-tight transition-all duration-500 ${on ? "translate-x-2" : "opacity-50 group-hover:opacity-100"}`}>
                        {s.name}
                      </span>
                    </span>
                    <span aria-hidden="true" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-current text-xl leading-none transition-transform duration-500 ${on ? "rotate-45" : ""}`}>+</span>
                  </button>
                </h3>
                <div id={`stage-panel-${s.id}`} role="region" aria-labelledby={`stage-btn-${s.id}`} hidden={!on}
                  className="pb-8 pl-11 md:pl-[3.75rem]">
                  <p className="t-lead font-medium">{s.line}</p>
                  <p className="t-body measure mt-3 text-indigo-80">{s.body}</p>
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-lg lg:hidden">
                    <Photo photo={s.photo} sizes="100vw" />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Desktop: the photo for the open stage crossfades beside the list */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div className="blob-b relative aspect-[5/6] overflow-hidden bg-lavender">
            {processStages.map((s, i) => (
              <div key={s.id} aria-hidden={i !== active} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === active ? 1 : 0 }}>
                <Photo photo={s.photo} sizes="36vw" tag={i === active} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
