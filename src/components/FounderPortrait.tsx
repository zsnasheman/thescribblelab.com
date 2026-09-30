import { INK, LAV, PAPER } from "./art/palette";

/**
 * An honest, elegant stand-in for the founder's approved portrait: an arched frame on a drawing sheet.
 * Replace with /public/people/nasheman-portrait.jpg (4:5, portrait) when supplied.
 */
export function FounderPortrait({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <svg viewBox="0 0 400 500" role="img" aria-label="Placeholder frame for the founder's portrait" className="block h-auto w-full rounded-lg">
        <rect width="400" height="500" fill={PAPER} />
        <rect x="14" y="14" width="372" height="472" fill="none" stroke={INK} strokeWidth="1" />
        {[[14, 14], [386, 14], [14, 486], [386, 486]].map(([x, y], i) => <path key={i} d={`M${x - 10 * Math.sign(x - 200)} ${y}h${20 * Math.sign(x - 200)}M${x} ${y - 10 * Math.sign(y - 250)}v${20 * Math.sign(y - 250)}`} stroke={INK} strokeWidth="1.4" />)}
        <path d="M90 440V230a110 110 0 0 1 220 0V440Z" fill={LAV} fillOpacity=".22" stroke={INK} strokeWidth="1.6" />
        <path d="M112 440V236a88 88 0 0 1 176 0V440" fill="none" stroke={INK} strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="200" cy="228" r="42" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="3 5" />
        <path d="M130 440c6-60 34-96 70-96s64 36 70 96" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="3 5" />
        <path d="M50 470h300M50 464v12M350 464v12" stroke={INK} strokeWidth="1" />
        <text x="200" y="74" textAnchor="middle" style={{ fontFamily: "var(--font-figtree)", fontSize: 13, fontWeight: 600, letterSpacing: "0.14em" }} fill={INK}>PORTRAIT TO BE SUPPLIED</text>
        <text x="200" y="458" textAnchor="middle" style={{ fontFamily: "var(--font-figtree)", fontSize: 11 }} fill={INK}>4 : 5 · portrait orientation</text>
      </svg>
    </figure>
  );
}
