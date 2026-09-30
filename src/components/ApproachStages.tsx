"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import { Fragment } from "./art/Plates";
import { Bubbles } from "./ui";
import { processStages } from "@/content/process";

const subscribeHash = (cb: () => void) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };
const readHash = () => window.location.hash.replace("#stage-", "");

/** Five stages you can step through. A link such as /approach#stage-build opens that stage directly. */
export function ApproachStages() {
  const uid = useId().replace(/:/g, "");
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const [picked, setPicked] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const fromHash = processStages.find((s) => s.id === hash)?.id;
  const activeId = picked ?? fromHash ?? processStages[0].id;
  const idx = processStages.findIndex((s) => s.id === activeId);
  const s = processStages[idx];

  const choose = (id: string, focus = false) => {
    setPicked(id);
    history.replaceState(null, "", `#stage-${id}`);
    if (focus) refs.current[id]?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = processStages.length - 1;
    const map: Record<string, number> = { ArrowDown: Math.min(i + 1, last), ArrowRight: Math.min(i + 1, last), ArrowUp: Math.max(i - 1, 0), ArrowLeft: Math.max(i - 1, 0), Home: 0, End: last };
    if (!(e.key in map)) return;
    e.preventDefault();
    choose(processStages[map[e.key]].id, true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Bubbles active={idx + 1} size={10} />
          <p className="t-caption font-semibold" aria-live="polite">Stage <span className="tabular-nums">{idx + 1}</span> of 5</p>
        </div>
        <div role="tablist" aria-label="The five stages" aria-orientation="vertical" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {processStages.map((st, i) => (
            <button key={st.id} ref={(el) => { refs.current[st.id] = el; }} role="tab" id={`stage-${st.id}`} aria-selected={st.id === activeId} aria-controls={`${uid}-panel`} tabIndex={st.id === activeId ? 0 : -1}
              onClick={() => choose(st.id)} onKeyDown={(e) => onKey(e, i)}
              className={`flex shrink-0 items-baseline gap-4 rounded-xl border-2 px-5 py-4 text-left transition-colors lg:w-full ${st.id === activeId ? "border-indigo bg-indigo text-white" : "border-indigo/25 hover:border-indigo/60"}`}>
              <span className="t-label tabular-nums opacity-75">0{i + 1}</span>
              <span className="font-[family-name:var(--font-display)] text-2xl font-light">{st.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`stage-${s.id}`} tabIndex={0} className="min-w-0 lg:col-span-8">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-lg border border-indigo/15"><Fragment kind={s.fragment} uid={`${uid}-${s.id}`} className="block w-full" /></div>
            <p className="t-caption mt-2 text-indigo-80">An illustrative drawing of the kind of thing this stage produces.</p>
          </div>
          <div className="md:col-span-3">
            <h3 className="t-h1">{s.name}</h3>
            <p className="t-lead mt-3 font-medium">{s.line}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {([["What happens", s.what], ["What you see", s.clientSees], ["Where decisions are made", s.decisions]] as const).map(([t, items]) => (
            <div key={t} className="border-t-2 border-indigo pt-4">
              <h4 className="t-label text-lavender">{t}</h4>
              <ul className="mt-3 space-y-2">{items.map((x) => <li key={x} className="flex gap-3"><span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />{x}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          <button type="button" className="btn btn-outline" disabled={idx === 0} onClick={() => choose(processStages[idx - 1].id)}>Previous stage</button>
          <button type="button" className="btn btn-indigo" disabled={idx === processStages.length - 1} onClick={() => choose(processStages[idx + 1].id)}>Next stage</button>
        </div>
      </div>
    </div>
  );
}
