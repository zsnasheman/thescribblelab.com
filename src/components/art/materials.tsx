import type { MaterialId } from "@/content/types";
import { CORAL, INK, LAV, MUSTARD, PAPER, WHITE } from "./palette";

export const MATERIALS: Record<MaterialId, { name: string; note: string }> = {
  lacquer: { name: "Lacquered timber", note: "A deep, even finish over timber battens or panels." },
  plaster: { name: "Plaster", note: "A soft, matt wall finish with a hand-trowelled surface." },
  terrazzo: { name: "Terrazzo", note: "Chips of mixed size in a pale matrix, cast and polished." },
  travertine: { name: "Travertine", note: "Warm pale stone with a fine, pitted grain." },
  brass: { name: "Brushed brass", note: "Used in thin strips and edges as a small, warm accent." },
  felt: { name: "Acoustic felt", note: "A soft, sound-absorbing surface for panels and linings." },
  "coral-paint": { name: "Coral paint", note: "A single saturated accent on a feature panel." },
  ply: { name: "Birch ply", note: "Layered sheet material with a visible, honest edge." },
};

/** A square material sample drawn as a paper chip. */
export function Swatch({ id, className, x, y, size }: { id: MaterialId; className?: string; x?: number; y?: number; size?: number }) {
  const m = MATERIALS[id];
  return (
    <svg viewBox="0 0 120 120" x={x} y={y} width={size} height={size} role="img" aria-label={`${m.name} sample`} className={className}>
      {id === "lacquer" && (<><rect width="120" height="120" fill={INK} /><path d="M0 34C40 20 80 50 120 30" stroke={WHITE} strokeOpacity=".14" strokeWidth="12" fill="none" /><path d="M0 90C30 80 90 100 120 84" stroke={WHITE} strokeOpacity=".08" strokeWidth="8" fill="none" /></>)}
      {id === "plaster" && (<><rect width="120" height="120" fill={LAV} />{[[20, 30], [70, 20], [40, 70], [95, 80], [20, 100], [80, 50]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q18-14 36 0`} stroke={WHITE} strokeOpacity=".22" strokeWidth="3" fill="none" strokeLinecap="round" />)}</>)}
      {id === "terrazzo" && (<><rect width="120" height="120" fill="#ECE6F4" />{[[20, 24, 7, LAV], [60, 16, 5, INK], [96, 30, 8, CORAL], [34, 62, 9, INK], [84, 70, 6, LAV], [18, 100, 6, MUSTARD], [62, 98, 8, LAV], [102, 104, 5, INK], [50, 44, 3, WHITE], [108, 58, 3, WHITE]].map(([x, y, r, c], i) => <ellipse key={i} cx={x as number} cy={y as number} rx={r as number} ry={(r as number) * 0.7} transform={`rotate(${i * 41} ${x} ${y})`} fill={c as string} />)}</>)}
      {id === "travertine" && (<><rect width="120" height="120" fill={PAPER} />{[14, 38, 62, 86, 108].map((y, i) => <path key={y} d={`M${6 + i * 6} ${y}h${50 + i * 8}M${70 - i * 4} ${y + 6}h${36}`} stroke={INK} strokeOpacity=".35" strokeWidth="1.6" strokeDasharray="6 5" />)}</>)}
      {id === "brass" && (<><rect width="120" height="120" fill={MUSTARD} />{Array.from({ length: 16 }, (_, i) => <line key={i} x1="0" y1={4 + i * 7.5} x2="120" y2={i * 7.5} stroke={WHITE} strokeOpacity=".22" />)}</>)}
      {id === "felt" && (<><rect width="120" height="120" fill={LAV} fillOpacity=".75" />{Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i * 37) % 118 + 1} cy={(i * 53) % 118 + 1} r="1.2" fill={WHITE} fillOpacity=".35" />)}</>)}
      {id === "coral-paint" && (<><rect width="120" height="120" fill={CORAL} /><path d="M0 100L120 20" stroke={WHITE} strokeOpacity=".16" strokeWidth="10" /></>)}
      {id === "ply" && (<><rect width="120" height="120" fill={PAPER} />{Array.from({ length: 11 }, (_, i) => <rect key={i} x="0" y={6 + i * 10} width="120" height={i % 2 ? 2 : 4} fill={i % 3 ? LAV : INK} fillOpacity={i % 3 ? 0.35 : 0.55} />)}</>)}
      <rect x=".5" y=".5" width="119" height="119" fill="none" stroke={INK} strokeOpacity=".5" />
    </svg>
  );
}
