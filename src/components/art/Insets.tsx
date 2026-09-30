import { CORAL, INK, LABEL_STYLE, LAV, MUSTARD, PAPER, WHITE } from "./palette";

const T = { ...LABEL_STYLE, fontSize: 11 } as const;

/** Section through a battened panel. */
export function JoineryInset() {
  const battens = Array.from({ length: 6 }, (_, i) => 50 + i * 40);
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Section through a battened wall: timber battens set proud of a felt-backed panel with shadow gaps between them" className="block h-auto w-full">
      <rect width="400" height="300" fill={PAPER} />
      <rect x="30" y="170" width="340" height="18" fill={INK} />
      <rect x="30" y="188" width="340" height="14" fill={LAV} fillOpacity=".5" stroke={INK} strokeWidth="1" />
      {battens.map((x) => <rect key={x} x={x} y="92" width="26" height="78" fill={LAV} stroke={INK} strokeWidth="1.2" />)}
      {battens.map((x) => <path key={x} d={`M${x + 26} 92v78`} stroke={WHITE} strokeOpacity=".5" />)}
      <path d={`M${battens[1] + 26} 70h14M${battens[1] + 26} 64v12M${battens[1] + 40} 64v12`} stroke={INK} strokeWidth="1" fill="none" />
      <path d="M96 60h18M96 54v12M114 54v12" stroke={INK} strokeWidth="1" fill="none" transform="translate(-30 0)" />
      <g style={T} fill={INK}>
        <text x="66" y="50">Batten</text><text x="136" y="50">Shadow gap</text>
        <text x="36" y="226">Felt-backed panel</text><text x="36" y="246">Fixing rail behind, hidden from view</text>
      </g>
      <path d="M96 52L96 90M166 52L152 90" stroke={INK} strokeWidth=".8" />
      <circle cx="108" cy="178" r="3" fill={MUSTARD} /><circle cx="228" cy="178" r="3" fill={MUSTARD} />
    </svg>
  );
}

/** Terrazzo with a brass movement-joint inlay. */
export function FinishInset() {
  const chips = [[60, 70, 14], [130, 120, 9], [200, 60, 16], [90, 180, 11], [170, 200, 8], [40, 130, 7], [230, 150, 12], [120, 50, 6], [260, 210, 9], [310, 70, 13], [340, 140, 8], [300, 190, 10], [350, 230, 7], [70, 240, 9], [250, 100, 7]];
  const cols = [LAV, INK, CORAL, LAV, INK, WHITE, LAV, INK, LAV, CORAL, INK, LAV, LAV, INK, WHITE];
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Terrazzo close-up: chips of several sizes in a pale matrix, divided by a thin brass strip" className="block h-auto w-full">
      <rect width="400" height="300" fill="#ECE6F4" />
      {chips.map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.72} transform={`rotate(${i * 37} ${x} ${y})`} fill={cols[i]} fillOpacity={cols[i] === WHITE ? 1 : 0.8} />)}
      <rect x="268" y="0" width="9" height="300" fill={MUSTARD} stroke={INK} strokeWidth=".8" />
      <g style={T} fill={INK} stroke={PAPER} strokeWidth="4" paintOrder="stroke">
        <text x="286" y="40">Brass strip</text><text x="286" y="56">on a movement joint</text>
        <text x="20" y="284">Chips of mixed size in a pale matrix</text>
      </g>
      <path d="M284 64L274 110" stroke={INK} strokeWidth=".8" />
    </svg>
  );
}

/** Daylight reach, tied to the Light control. */
export function LightInset({ light }: { light: number }) {
  const reach = 70 + (1 - light) * 200;
  const sunY = 60 - light * 28;
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Section of the room: daylight enters the glazed wall and reaches ${light > 0.66 ? "a short" : light > 0.33 ? "a medium" : "a long"} way across the floor`} className="block h-auto w-full">
      <rect width="400" height="300" fill={PAPER} />
      <path d="M40 240H370V40" stroke={INK} strokeWidth="1.6" fill="none" />
      <path d="M370 80h-16v110h16" stroke={INK} strokeWidth="1.6" fill={WHITE} />
      <polygon points={`${354},${80} ${354 - reach},240 ${354 - reach + 40},240 ${354},${190}`} fill={MUSTARD} fillOpacity=".18" />
      <path d={`M354 80L${354 - reach} 240M354 190L${354 - reach + 40} 240`} stroke={MUSTARD} strokeWidth="1.4" strokeDasharray="5 4" />
      <rect x={354 - reach} y="238" width="40" height="5" fill={MUSTARD} />
      <circle cx="388" cy={sunY} r="9" fill={MUSTARD} />
      <g style={T} fill={INK}>
        <text x="60" y="270">Floor</text><text x="268" y="26">Glazed wall</text>
        <text x={Math.max(50, 354 - reach - 6)} y="228">Reach of daylight</text>
      </g>
    </svg>
  );
}
