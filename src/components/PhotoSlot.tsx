import { INK, PAPER } from "./art/palette";

/**
 * An honest stand-in for a photograph that has not been supplied yet.
 * It says what is needed, in what shape, and where the file goes.
 */
export function PhotoSlot({ title, file, ratio = "4 : 3", note, className = "" }: { title: string; file: string; ratio?: string; note?: string; className?: string }) {
  return (
    <figure className={className}>
      <svg viewBox="0 0 400 300" role="img" aria-label={`Placeholder: ${title}`} className="block h-auto w-full rounded-lg">
        <rect width="400" height="300" fill={PAPER} />
        <rect x="12" y="12" width="376" height="276" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="6 5" />
        {[[12, 12], [388, 12], [12, 288], [388, 288]].map(([x, y], i) => <path key={i} d={`M${x} ${y + (y < 150 ? 18 : -18)}V${y}H${x + (x < 200 ? 18 : -18)}`} fill="none" stroke={INK} strokeWidth="2" />)}
        <path d="M150 190l36-44 26 30 18-22 40 36Z" fill="none" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        <circle cx="196" cy="116" r="11" fill="none" stroke={INK} strokeWidth="1.4" />
        <text x="200" y="232" textAnchor="middle" style={{ fontFamily: "var(--font-figtree)", fontSize: 14, fontWeight: 600 }} fill={INK}>{title}</text>
        <text x="200" y="254" textAnchor="middle" style={{ fontFamily: "var(--font-figtree)", fontSize: 11 }} fill={INK}>{ratio} · {file}</text>
      </svg>
      {note && <figcaption className="t-caption mt-2 text-indigo-80">{note}</figcaption>}
    </figure>
  );
}
