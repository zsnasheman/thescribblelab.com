import { CORAL, INK, LABEL_STYLE, LAV, MUSTARD, PAPER, WHITE } from "./palette";

/**
 * A retail window with a visible mechanism. `t` runs 0 to 1 to 0 through one movement (0 = closed, 1 = open).
 * Panels have real thickness (a side face and a shadow on the back wall), hang from carriages on a rail,
 * and the pendant disc lifts and swings. The same drawing serves the live demo and the static plate.
 */
export function KineticScene({ t, uid, labels = false }: { t: number; uid: string; labels?: boolean }) {
  const aX = 62 * t; // upper panel slides right
  const bX = -84 * t; // lower panel slides left
  const lift = -44 * t;
  const swing = -15 + 30 * t;
  const T = { ...LABEL_STYLE, fontSize: 10 } as const;
  const shadowShift = 6 + t * 3;
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-glass`}><rect x="34" y="20" width="332" height="226" /></clipPath>
        <linearGradient id={`${uid}-ref`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={WHITE} stopOpacity=".16" /><stop offset=".5" stopColor={WHITE} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${uid}-beam`} cx=".5" cy="0" r="1">
          <stop offset="0" stopColor={MUSTARD} stopOpacity={0.3 + t * 0.35} /><stop offset="1" stopColor={MUSTARD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#231746" />
      {/* pavement and floor, with receding lines for depth */}
      <rect y="246" width="400" height="54" fill="#1A1138" />
      {[40, 110, 180, 250, 320, 380].map((x) => <line key={x} x1={x} y1="246" x2={200 + (x - 200) * 1.9} y2="300" stroke={WHITE} strokeOpacity=".09" />)}
      <line x1="0" y1="246" x2="400" y2="246" stroke={WHITE} strokeOpacity=".3" />
      <g clipPath={`url(#${uid}-glass)`}>
        <rect x="34" y="20" width="332" height="226" fill="#2F2058" />
        {/* back wall shelf and shadow pools */}
        <rect x="34" y="196" width="332" height="50" fill="#231746" />
        <rect x="34" y="194" width="332" height="3" fill={WHITE} fillOpacity=".12" />
        {/* light cone from the disc */}
        <polygon points={`200,${106 + lift} 120,246 280,246`} fill={`url(#${uid}-beam)`} />
        {/* shadows of the panels on the back wall, offset by their depth */}
        <rect x={76 + aX + shadowShift} y="68" width="86" height="82" fill="#000" fillOpacity=".3" />
        <rect x={232 + bX + shadowShift} y="174" width="98" height="64" fill="#000" fillOpacity=".3" />
        {/* lower panel on floor rail: face, thickness, top edge */}
        <g transform={`translate(${bX} 0)`}>
          <polygon points="232,174 330,174 338,170 240,170" fill={LAV} fillOpacity=".7" />
          <rect x="232" y="174" width="98" height="64" fill={LAV} />
          <polygon points="330,174 338,170 338,234 330,238" fill="#4c3a72" />
          <rect x="232" y="174" width="98" height="64" fill="none" stroke={INK} strokeWidth="1" />
          <path d="M240 186h82M240 196h60" stroke={WHITE} strokeOpacity=".3" />
        </g>
        {/* upper panel hanging from carriages */}
        <g transform={`translate(${aX} 0)`}>
          <polygon points="76,68 162,68 170,64 84,64" fill={CORAL} fillOpacity=".7" />
          <rect x="76" y="68" width="86" height="82" fill={CORAL} />
          <polygon points="162,68 170,64 170,146 162,150" fill="#E5502A" />
          <rect x="76" y="68" width="86" height="82" fill="none" stroke={INK} strokeWidth="1" />
          <rect x="88" y="80" width="62" height="6" fill={INK} fillOpacity=".25" />
          {/* carriages and hangers */}
          {[92, 140].map((x) => (<g key={x}><rect x={x - 7} y="56" width="14" height="10" fill={MUSTARD} stroke={INK} strokeWidth=".8" /><line x1={x} y1="66" x2={x} y2="72" stroke={WHITE} strokeWidth="2" /></g>))}
        </g>
        {/* pendant: lifts, then swings on its cord */}
        <g transform={`translate(0 ${lift})`}>
          <g transform={`rotate(${swing} 200 26)`}>
            <line x1="200" y1="26" x2="200" y2="102" stroke={WHITE} strokeWidth="1.6" />
            <circle cx="200" cy="116" r="20" fill={MUSTARD} stroke={INK} strokeWidth="1" />
            <ellipse cx="194" cy="110" rx="6" ry="4" fill={WHITE} fillOpacity=".5" />
          </g>
        </g>
        {/* plinth and object */}
        <rect x="172" y="206" width="56" height="40" fill={PAPER} stroke={INK} strokeWidth="1" />
        <polygon points="228,206 236,202 236,242 228,246" fill="#C9C0D8" />
        <circle cx="200" cy="194" r="11" fill="#1E9E74" />
        {/* top rail and drive housing, floor rail */}
        <rect x="34" y="50" width="332" height="6" fill="#B9B0CC" />
        <rect x="34" y="50" width="332" height="2" fill={WHITE} fillOpacity=".5" />
        <rect x="320" y="42" width="40" height="18" fill="#1A1138" stroke={WHITE} strokeOpacity=".4" />
        <circle cx="332" cy="51" r="3" fill={MUSTARD} /><circle cx="348" cy="51" r="3" fill={MUSTARD} />
        {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={56 + i * 28} cy="53" r="1.4" fill={INK} />)}
        <rect x="34" y="238" width="332" height="5" fill="#B9B0CC" />
        {/* glass reflection */}
        <rect x="34" y="20" width="332" height="226" fill={`url(#${uid}-ref)`} />
      </g>
      {/* frame */}
      <rect x="34" y="20" width="332" height="226" fill="none" stroke={WHITE} strokeWidth="4" />
      <rect x="28" y="14" width="344" height="238" fill="none" stroke={WHITE} strokeOpacity=".35" strokeWidth="1" />
      {labels && (
        <g style={T} fill={WHITE} stroke="#231746" strokeWidth="3" paintOrder="stroke">
          <text x="40" y="44">Rail</text><text x="306" y="38">Drive</text>
          <text x="84" y="44">Carriage</text><text x="236" y="262">Floor guide</text>
        </g>
      )}
    </g>
  );
}
