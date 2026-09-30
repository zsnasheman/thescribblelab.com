import { C } from "@/lib/colors";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false" className={className}
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

/** The five-bubble motif: four lavender, one emerald. `active` fills bubbles up to that count. */
export function Bubbles({ active, size = 11, className }: { active?: number; size?: number; className?: string }) {
  const pos = [
    { x: 12, y: 40, r: 9 }, { x: 34, y: 28, r: 11 }, { x: 60, y: 34, r: 14 },
    { x: 86, y: 22, r: 8 }, { x: 106, y: 10, r: 7 },
  ];
  return (
    <svg viewBox="0 0 120 56" aria-hidden="true" focusable="false" className={className} style={{ height: size * 4, width: "auto" }}>
      {pos.map((p, i) => {
        const col = i === 4 ? C.emerald : C.lavender;
        const on = active === undefined || i < active;
        return <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={on ? col : "transparent"} stroke={col} strokeWidth={on ? 0 : 2} />;
      })}
    </svg>
  );
}
