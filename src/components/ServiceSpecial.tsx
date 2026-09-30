"use client";

import { useId, useState } from "react";
import { Fragment, Plate } from "./art/Plates";
import { KineticScene } from "./art/KineticScene";
import { CORAL, INK, LAV, PAPER, WHITE, EMERALD, LABEL_STYLE } from "./art/palette";
import type { ServiceSlug } from "@/content/types";

const T = { ...LABEL_STYLE, fontSize: 11 } as const;

function Tabs<T extends string>({ items, value, onChange, label }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  const uid = useId();
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((i) => (
        <button key={i.id} id={`${uid}-${i.id}`} type="button" aria-pressed={value === i.id} onClick={() => onChange(i.id)} className={`btn !min-h-11 !px-5 !py-2 ${value === i.id ? "btn-indigo" : "btn-outline"}`}>{i.label}</button>
      ))}
    </div>
  );
}

// ── Interiors: four sectors ──────────────────────────────────────────────
type Sector = "residential" | "commercial" | "retail" | "fb";
const SECTORS: Record<Sector, { label: string; lead: string; points: string[] }> = {
  residential: { label: "Residential", lead: "Homes and villas, where the brief is how people live.", points: ["Layout for living, sleeping and storage", "Joinery that hides what should be hidden", "Materials that age well and are easy to care for"] },
  commercial: { label: "Commercial", lead: "Offices and workplaces, where the brief is how a team works.", points: ["Desks, meeting rooms and quiet areas planned together", "Acoustics and lighting for long days", "A fit-out that can be adjusted as the team grows"] },
  retail: { label: "Retail", lead: "Shops, where the brief is how a customer moves and looks.", points: ["A path that shows product and leads to the till", "Display joinery and lighting", "A look that holds up under daily use"] },
  fb: { label: "Food and beverage", lead: "Cafés and restaurants, where the brief is service as much as style.", points: ["Seating, bar and service routes planned together", "Finishes chosen for cleaning and wear", "Lighting and acoustics that set the atmosphere"] },
};
function SectorPlan({ k }: { k: Sector }) {
  return (
    <svg viewBox="0 0 400 260" role="img" aria-label={`Sketch plan for a ${SECTORS[k].label.toLowerCase()} interior`} className="block h-auto w-full">
      <rect width="400" height="260" fill={PAPER} />
      <rect x="20" y="20" width="360" height="220" fill="none" stroke={INK} strokeWidth="5" />
      {k === "residential" && (<g stroke={INK} fill="none" strokeWidth="1.3"><path d="M20 120H200M200 20V120M200 160V240" strokeWidth="3" /><rect x="40" y="150" width="110" height="36" fill={INK} /><circle cx="250" cy="70" r="22" fill={WHITE} /><rect x="230" y="190" width="120" height="30" fill={LAV} fillOpacity=".4" /><rect x="300" y="40" width="60" height="30" fill={CORAL} /></g>)}
      {k === "commercial" && (<g stroke={INK} fill="none" strokeWidth="1.3">{Array.from({ length: 3 }, (_, r) => Array.from({ length: 4 }, (_, c) => <rect key={`${r}${c}`} x={40 + c * 62} y={40 + r * 46} width="46" height="26" fill={LAV} fillOpacity=".35" />))}<rect x="290" y="40" width="70" height="90" fill={WHITE} /><rect x="290" y="150" width="70" height="70" fill={INK} /></g>)}
      {k === "retail" && (<g stroke={INK} fill="none" strokeWidth="1.3"><rect x="34" y="34" width="14" height="190" fill={INK} /><rect x="34" y="34" width="330" height="14" fill={INK} /><rect x="90" y="90" width="40" height="110" fill={LAV} fillOpacity=".4" /><rect x="170" y="90" width="40" height="110" fill={LAV} fillOpacity=".4" /><rect x="290" y="170" width="70" height="40" fill={CORAL} /><path d="M40 224H70C90 224 70 70 150 70S250 210 280 190" strokeDasharray="6 5" /></g>)}
      {k === "fb" && (<g stroke={INK} fill="none" strokeWidth="1.3"><rect x="34" y="34" width="332" height="36" fill={INK} /><rect x="240" y="70" width="126" height="170" fill={WHITE} />{[[70, 110], [150, 110], [70, 180], [150, 180]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="18" fill={WHITE} /><circle cx={x - 26} cy={y} r="6" fill={LAV} /><circle cx={x + 26} cy={y} r="6" fill={LAV} /></g>)}<circle cx="200" cy="160" r="8" fill={EMERALD} /></g>)}
    </svg>
  );
}
function InteriorsSectors() {
  const [k, setK] = useState<Sector>("residential");
  const s = SECTORS[k];
  return (
    <div>
      <Tabs label="Choose a kind of interior" value={k} onChange={setK} items={(Object.keys(SECTORS) as Sector[]).map((id) => ({ id, label: SECTORS[id].label }))} />
      <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-indigo/15"><SectorPlan k={k} /></div>
        <div aria-live="polite"><p className="t-h3">{s.lead}</p><ul className="mt-4 space-y-2">{s.points.map((p) => <li key={p} className="flex gap-3"><span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />{p}</li>)}</ul></div>
      </div>
    </div>
  );
}

// ── Exhibitions: how a stand meets the aisle ─────────────────────────────
type StandT = "inline" | "corner" | "peninsula" | "island";
const STANDS: Record<StandT, { label: string; open: number; text: string; rect: [number, number, number, number]; sides: ("t" | "r" | "b" | "l")[] }> = {
  inline: { label: "Inline", open: 1, text: "One open side to a single aisle. Visitors see the stand from the front only, so the fascia and the front edge do the work.", rect: [110, 50, 180, 110], sides: ["b"] },
  corner: { label: "Corner", open: 2, text: "Two open sides where two aisles meet. The stand can be approached from two directions and read from further away.", rect: [60, 50, 170, 100], sides: ["b", "r"] },
  peninsula: { label: "Peninsula", open: 3, text: "Three open sides, with the back against a neighbour. More frontage to use, and more views to design for.", rect: [100, 40, 170, 90], sides: ["l", "r", "b"] },
  island: { label: "Island", open: 4, text: "Open on all four sides, with aisles all round. The stand has no back, so every face is seen and is part of the design.", rect: [110, 60, 170, 100], sides: ["t", "r", "b", "l"] },
};
function StandTypes() {
  const [k, setK] = useState<StandT>("corner");
  const s = STANDS[k];
  const [x, y, w, h] = s.rect;
  const edge = (side: "t" | "r" | "b" | "l") => ({ t: [x, y, x + w, y], r: [x + w, y, x + w, y + h], b: [x, y + h, x + w, y + h], l: [x, y, x, y + h] })[side];
  return (
    <div>
      <Tabs label="Choose a stand type" value={k} onChange={setK} items={(Object.keys(STANDS) as StandT[]).map((id) => ({ id, label: STANDS[id].label }))} />
      <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-indigo/15">
          <svg viewBox="0 0 400 240" role="img" aria-label={`Plan of a ${s.label.toLowerCase()} stand with ${s.open} open ${s.open === 1 ? "side" : "sides"}`} className="block h-auto w-full">
            <rect width="400" height="240" fill="#ECE6F4" />
            {/* aisles run along every open side */}
            {s.sides.includes("t") && <rect x="0" y={y - 50} width="400" height="50" fill={WHITE} />}
            {s.sides.includes("b") && <rect x="0" y={y + h} width="400" height="50" fill={WHITE} />}
            {s.sides.includes("l") && <rect x={x - 50} y="0" width="50" height="240" fill={WHITE} />}
            {s.sides.includes("r") && <rect x={x + w} y="0" width="50" height="240" fill={WHITE} />}
            {s.sides.map((sd) => { const c = { t: [200, y - 25], b: [200, y + h + 25], l: [x - 25, 120], r: [x + w + 25, 120] }[sd]; return <text key={sd} x={c[0]} y={c[1] + 4} textAnchor="middle" style={{ ...T, fontSize: 10 }} fill={INK} opacity=".6" transform={sd === "l" || sd === "r" ? `rotate(90 ${c[0]} ${c[1]})` : undefined}>AISLE</text>; })}
            <rect x={x} y={y} width={w} height={h} fill={PAPER} stroke={INK} strokeWidth="1.4" />
            {(["t", "r", "b", "l"] as const).map((sd) => { const [x1, y1, x2, y2] = edge(sd); const open = s.sides.includes(sd); return <line key={sd} x1={x1} y1={y1} x2={x2} y2={y2} stroke={open ? CORAL : INK} strokeWidth={open ? 5 : 7} />; })}
            <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" style={T} fill={INK}>{s.label}</text>
            <text x="14" y="228" style={T} fill={INK}>Coral edges are open to an aisle</text>
          </svg>
        </div>
        <div aria-live="polite"><p className="t-label text-lavender"><span className="tabular-nums">{s.open}</span> open {s.open === 1 ? "side" : "sides"}</p><p className="t-h3 mt-2">{s.label} stand</p><p className="t-body mt-3 measure">{s.text}</p></div>
      </div>
    </div>
  );
}

// ── Events: a run of show ────────────────────────────────────────────────
const PHASES = [
  { id: "concept", label: "Concept", text: "We agree the moment the room should see, then test ideas against the venue and the run of show." },
  { id: "design", label: "Design", text: "Sections and sightlines are drawn, and the set is broken into pieces that can be made and carried." },
  { id: "fabrication", label: "Fabrication", text: "Scenic pieces are built and finished ahead of time and checked against the drawings." },
  { id: "loadin", label: "Load-in", text: "The set goes into the venue within its access rules, in the order it will be assembled." },
  { id: "show", label: "Show", text: "The set is checked before doors open, and the team stays on hand while the event runs." },
  { id: "strike", label: "Strike", text: "The set comes down in a planned order, and reusable pieces are packed for storage." },
] as const;
function RunOfShow() {
  const [i, setI] = useState(3);
  return (
    <div>
      <ol className="grid grid-cols-3 gap-2 md:grid-cols-6" aria-label="Phases of an event, in order">
        {PHASES.map((p, n) => (
          <li key={p.id}>
            <button type="button" aria-pressed={i === n} onClick={() => setI(n)} className={`w-full rounded-lg border-2 px-2 py-3 text-center font-semibold transition-colors ${i === n ? "border-indigo bg-indigo text-white" : "border-indigo/25 hover:border-indigo/60"}`}>
              <span className="t-label block tabular-nums opacity-70">0{n + 1}</span><span className="mt-1 block text-[0.9rem]">{p.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-2 h-1 rounded-full bg-indigo/15" aria-hidden="true"><div className="h-full rounded-full bg-coral transition-all duration-500" style={{ width: `${((i + 1) / 6) * 100}%` }} /></div>
      <p className="t-body mt-5 measure" aria-live="polite"><strong>{PHASES[i].label}.</strong> {PHASES[i].text}</p>
    </div>
  );
}

// ── Brand activations: a kit of parts ────────────────────────────────────
function ModularKit() {
  const uid = useId().replace(/:/g, "");
  const [ex, setEx] = useState(false);
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-lg border border-indigo/15 bg-paper">
        <div className={ex ? "hidden" : "block"}><Plate kind="popup" uid={`${uid}a`} label="Assembled modular pop-up" className="block aspect-[4/3] w-full" /></div>
        <div className={ex ? "block" : "hidden"}><Fragment kind="kit" uid={`${uid}b`} className="block aspect-[4/3] w-full" /></div>
      </div>
      <div>
        <button type="button" aria-pressed={ex} onClick={() => setEx((v) => !v)} className="btn btn-indigo">{ex ? "Put it back together" : "Explode the kit"}</button>
        <ul className="mt-5 space-y-2" aria-live="polite">
          {["Two rear modules carry graphics and display", "Two counter modules take product and service", "A striped canopy sets the roofline", ex ? "Every part is drawn to fit a standard vehicle and is labelled for assembly" : "Modules lock together without tools where the design allows"].map((t) => <li key={t} className="flex gap-3"><span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />{t}</li>)}
        </ul>
      </div>
    </div>
  );
}

// ── Kinetic windows: anatomy of the mechanism ────────────────────────────
const PARTS = [
  { id: "rail", label: "Rail", x: 200, y: 52, text: "A fixed rail above the glass carries everything that moves. It is drawn first, because the scene is designed around it." },
  { id: "carriage", label: "Carriages", x: 100, y: 62, text: "Carriages roll along the rail and hold each panel by a hanger. They share the load so the movement stays smooth and quiet." },
  { id: "drive", label: "Drive", x: 340, y: 51, text: "A drive housing at one end moves the carriages. It is placed where it can be reached for servicing." },
  { id: "panel", label: "Panels", x: 118, y: 112, text: "Panels have real thickness and cast their own shadow. Their depth is drawn so they pass each other without touching." },
  { id: "pendant", label: "Pendant disc", x: 200, y: 118, text: "A disc on a cord lifts and swings as the panels travel, adding a second, slower movement." },
  { id: "guide", label: "Floor guide", x: 284, y: 240, text: "A guide at the base keeps the lower panel straight and stops it swinging." },
] as const;
function MechanismAnatomy() {
  const uid = useId().replace(/:/g, "");
  const [k, setK] = useState<(typeof PARTS)[number]["id"]>("rail");
  const part = PARTS.find((p) => p.id === k)!;
  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 overflow-hidden rounded-lg bg-[#231746]">
        <svg viewBox="0 0 400 300" role="img" aria-label={`Anatomy of a kinetic window. Highlighted part: ${part.label}`} className="block h-auto w-full">
          <KineticScene t={0.45} uid={uid} />
          <circle cx={part.x} cy={part.y} r="20" fill="none" stroke={CORAL} strokeWidth="3" />
          <circle cx={part.x} cy={part.y} r="27" fill="none" stroke={WHITE} strokeOpacity=".5" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="lg:col-span-5">
        <ul className="grid grid-cols-2 gap-2">
          {PARTS.map((p) => (<li key={p.id}><button type="button" aria-pressed={k === p.id} onClick={() => setK(p.id)} className={`w-full rounded-lg border-2 px-3 py-3 text-left font-semibold ${k === p.id ? "border-indigo bg-indigo text-white" : "border-indigo/25 hover:border-indigo/60"}`}>{p.label}</button></li>))}
        </ul>
        <div className="mt-5" aria-live="polite"><p className="t-h3">{part.label}</p><p className="t-body mt-2 measure">{part.text}</p></div>
      </div>
    </div>
  );
}

export function ServiceSpecial({ slug }: { slug: ServiceSlug }) {
  switch (slug) {
    case "interiors": return <InteriorsSectors />;
    case "exhibitions": return <StandTypes />;
    case "events": return <RunOfShow />;
    case "brand-activations": return <ModularKit />;
    case "kinetic-windows": return <MechanismAnatomy />;
  }
}

