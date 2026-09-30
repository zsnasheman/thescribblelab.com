"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { Fragment } from "./art/Plates";
import { MATERIALS, Swatch } from "./art/materials";
import { CompareSlider } from "./CompareSlider";
import type { Project } from "@/content/types";

type Tab = "drawing" | "materials" | "built";

/** Inspect the drawings, the materials and, when real assets exist, the completed work. */
export function ProjectInspector({ p }: { p: Project }) {
  const uid = useId().replace(/:/g, "");
  const hasBuilt = Boolean(p.compare) || p.media.some((m) => m.permissionToPublish);
  const tabs: { id: Tab; label: string }[] = [
    { id: "drawing", label: "Drawings" },
    { id: "materials", label: "Materials" },
    ...(hasBuilt ? [{ id: "built" as Tab, label: "Completed work" }] : []),
  ];
  const [tab, setTab] = useState<Tab>("drawing");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const n = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[n].id);
    refs.current[tabs[n].id]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Inspect this project" className="flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[t.id] = el; }} role="tab" id={`${uid}-tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`${uid}-panel-${t.id}`} tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)} className={`btn !min-h-11 !px-5 !py-2 ${tab === t.id ? "btn-indigo" : "btn-outline"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${uid}-panel-drawing`} aria-labelledby={`${uid}-tab-drawing`} hidden={tab !== "drawing"} className="mt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {p.drawings.map((d, i) => (
            <figure key={i}>
              <div className="overflow-hidden rounded-lg border border-indigo/15"><Fragment kind={d.fragment} uid={`${uid}-d${i}`} className="block w-full" /></div>
              <figcaption className="t-caption mt-2 text-indigo-80">{d.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div role="tabpanel" id={`${uid}-panel-materials`} aria-labelledby={`${uid}-tab-materials`} hidden={tab !== "materials"} className="mt-6">
        <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {p.materials.map((m) => (
            <li key={m} className="flex items-center gap-4 border-t border-indigo/15 pt-4">
              <Swatch id={m} className="h-20 w-20 shrink-0" />
              <span><span className="t-h3 block">{MATERIALS[m].name}</span><span className="t-caption text-indigo-80">{MATERIALS[m].note}</span></span>
            </li>
          ))}
        </ul>
      </div>

      {hasBuilt && (
      <div role="tabpanel" id={`${uid}-panel-built`} aria-labelledby={`${uid}-tab-built`} hidden={tab !== "built"} className="mt-6">
        {p.compare && <div className="mb-8"><CompareSlider before={p.compare.before} after={p.compare.after} caption={p.compare.caption} /></div>}
        {p.media.filter((m) => m.permissionToPublish).length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {p.media.filter((m) => m.permissionToPublish).map((m, i) => (
              <figure key={i}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-indigo-10">
                  {m.kind === "video" ? (
                    <video src={m.src} poster={m.poster} controls preload="none" playsInline className="h-full w-full object-cover" aria-label={m.alt} />
                  ) : (
                    <Image src={m.src} alt={m.alt} fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
                  )}
                </div>
                <figcaption className="t-caption mt-2 text-indigo-80">{m.caption}{m.attribution ? ` Photo: ${m.attribution}.` : ""}</figcaption>
              </figure>
            ))}
          </div>
        ) : null}
        </div>
      )}
    </div>
  );
}
