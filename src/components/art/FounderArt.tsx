import { Swatch } from "./materials";
import { CORAL, INK, LABEL_STYLE, LAV, MUSTARD, PAPER, WHITE } from "./palette";

/** Stage index: 0 person, 1 roots, 2 practice, 3 starting, 4 approach, 5 next. -1 = one static composition. */
export type FounderStage = -1 | 0 | 1 | 2 | 3 | 4 | 5;

const fade = (o: number): React.CSSProperties => ({ opacity: o, transition: "opacity 1s cubic-bezier(.22,.8,.3,1)" });
const par = (px: number, py: number, k: number): React.CSSProperties => ({ transform: `translate(${px * k}px, ${py * k * 0.6}px)`, transition: "transform .5s cubic-bezier(.22,.8,.3,1)" });

function leaf(cx: number, cy: number, r: number, rot = 0) {
  const pts: string[] = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 4 === 0 ? r : i % 2 === 0 ? r * 0.55 : r * 0.82;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.92).toFixed(1)}`);
  }
  return <g transform={`rotate(${rot} ${cx} ${cy})`}><polygon points={pts.join(" ")} fill={CORAL} fillOpacity=".9" stroke={INK} strokeWidth="1" strokeLinejoin="round" /><line x1={cx} y1={cy - r * 0.6} x2={cx} y2={cy + r * 1.15} stroke={INK} strokeWidth="1" /></g>;
}

export function FounderArt({ stage, px = 0, py = 0, uid }: { stage: FounderStage; px?: number; py?: number; uid: string }) {
  const s = stage;
  const K = s === -1 ? 0.75 : [0.16, 1, 0.3, 0.26, 0.22, 0.5][s];
  const D = s === -1 ? 0.9 : [0.14, 0, 0.95, 1, 0.9, 0.6][s];
  const F = s === -1 ? 0.55 : [0, 0, 0, 0, 0, 0.75][s];
  const grid = s === 2 || s === 4 ? 1 : 0;
  const ffe = s === 2 ? 1 : 0;
  const table = s === 3 || s === 4 ? 1 : 0;
  const mats = s === 4 ? 1 : 0;

  return (
    <g>
      <defs>
        <pattern id={`${uid}-dots`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill={INK} fillOpacity=".16" /></pattern>
        <clipPath id={`${uid}-wall`}><rect x="205" y="515" width="110" height="65" /></clipPath>
        <clipPath id={`${uid}-screen`}><rect x="388" y="505" width="92" height="95" /></clipPath>
        <clipPath id={`${uid}-below`}><rect x="0" y="600" width="800" height="120" /></clipPath>
      </defs>
      <rect width="800" height="900" fill={PAPER} />
      <rect width="800" height="900" fill={`url(#${uid}-dots)`} />
      {/* horizon, ground and sun: present in every stage */}
      <rect y="600" width="800" height="300" fill="#ECE6F4" />
      <line x1="0" y1="600" x2="800" y2="600" stroke={INK} strokeWidth="1.5" />
      <circle cx="610" cy="236" r="24" fill={MUSTARD} style={par(px, py, 4)} />
      {[650, 690, 740, 800].map((y, i) => <line key={y} x1="0" y1={y} x2="800" y2={y} stroke={INK} strokeOpacity={0.12 - i * 0.02} />)}

      {/* ───────────── Kashmir-inspired forms ───────────── */}
      <g style={{ ...fade(K), ...par(px, py, -9) }}>
        <path d="M0 560L90 470 170 520 260 420 360 500 450 440 560 520 660 470 800 540V600H0Z" fill={LAV} fillOpacity=".3" stroke={INK} strokeWidth="1" />
        <path d="M0 600V545L120 500 220 552 330 482 450 562 560 512 700 572 800 532V600Z" fill={LAV} fillOpacity=".5" stroke={INK} strokeWidth="1" />
        {[[260, 420], [450, 440], [90, 470], [660, 470]].map(([x, y], i) => <polygon key={i} points={`${x},${y} ${x - 22},${y + 34} ${x - 8},${y + 30} ${x},${y + 40} ${x + 10},${y + 30} ${x + 22},${y + 34}`} fill={WHITE} stroke={INK} strokeWidth=".8" />)}
        {/* tiered timber roofs over a lattice-screened wall */}
        <rect x="190" y="580" width="140" height="20" fill={INK} />
        <rect x="205" y="515" width="110" height="65" fill={WHITE} stroke={INK} strokeWidth="1.2" />
        <g clipPath={`url(#${uid}-wall)`} stroke={INK} strokeOpacity=".55" strokeWidth=".8">
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={205 + i * 10} y1="515" x2={205 + i * 10 - 65} y2="580" />)}
          {Array.from({ length: 22 }, (_, i) => <line key={i} x1={195 + i * 10} y1="515" x2={195 + i * 10 + 65} y2="580" />)}
        </g>
        {[["M158 522Q260 506 362 522L332 481H188Z", 1], ["M184 482Q260 468 336 482L314 449H206Z", 1], ["M208 450Q260 438 312 450L292 421H228Z", 1]].map(([d], i) => <path key={i} d={d as string} fill={INK} stroke={INK} strokeWidth="1.2" />)}
        <line x1="260" y1="421" x2="260" y2="376" stroke={INK} strokeWidth="1.6" />
        <circle cx="260" cy="372" r="5" fill={MUSTARD} stroke={INK} strokeWidth="1" />
        {[230, 260, 290].map((x) => <path key={x} d={`M${x - 9} 580V548a9 9 0 0 1 18 0V580`} fill="none" stroke={INK} strokeWidth="1.2" />)}
        {/* a pinjra-style lattice screen */}
        <rect x="388" y="505" width="92" height="95" fill={WHITE} stroke={INK} strokeWidth="1.4" />
        <g clipPath={`url(#${uid}-screen)`} stroke={INK} strokeWidth="1" fill="none">
          {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 }, (_, c) => <path key={`${r}${c}`} d={`M${388 + c * 23} ${505 + r * 19}l11.5 9.5 11.5-9.5M${388 + c * 23} ${524 + r * 19}l11.5-9.5 11.5 9.5`} />))}
        </g>
        {/* a cusped arch */}
        <path d="M40 600V540q0-40 28-56 28 16 28 56V600" fill="none" stroke={INK} strokeWidth="1.6" />
        <path d="M52 600V548q0-26 16-38 16 12 16 38V600" fill="none" stroke={INK} strokeWidth="1" />
        {leaf(118, 268, 30, -14)}{leaf(176, 332, 20, 18)}{leaf(84, 372, 16, -30)}
        <g clipPath={`url(#${uid}-below)`} opacity=".22"><g transform="translate(0 1200) scale(1 -1)"><path d="M158 522Q260 506 362 522L332 481H188ZM184 482Q260 468 336 482L314 449H206Z" fill={INK} /><rect x="205" y="515" width="110" height="65" fill={INK} /></g></g>
        {[614, 624, 634].map((y, i) => <line key={y} x1={200 + i * 14} y1={y} x2={320 - i * 14} y2={y} stroke={INK} strokeOpacity=".3" strokeDasharray="6 5" />)}
      </g>

      {/* ───────────── Dubai architecture ───────────── */}
      <g style={{ ...fade(D), ...par(px, py, 7) }}>
        <polygon points="610,600 610,420 622,420 622,330 634,330 634,250 640,250 640,150 644,150 644,250 650,250 650,330 662,330 662,420 674,420 674,600" fill={INK} stroke={INK} strokeWidth="1" />
        {[[428, 470], [338, 400], [258, 330]].map(([y, w], i) => <line key={i} x1={642 - w / 6} y1={y} x2={642 + w / 6} y2={y} stroke={WHITE} strokeOpacity=".5" />)}
        <path d="M700 600V338Q700 268 772 246V600Z" fill={LAV} stroke={INK} strokeWidth="1.2" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${710 + i * 9} 600V${330 - i * 12}`} stroke={WHITE} strokeOpacity=".4" />)}
        <rect x="520" y="330" width="68" height="270" fill={INK} />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={528 + i * 7} y1="330" x2={528 + i * 7} y2="600" stroke={WHITE} strokeOpacity=".3" />)}
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x="532" y={346 + i * 21} width="44" height="7" fill={WHITE} fillOpacity=".6" />)}
        <rect x="448" y="440" width="62" height="160" fill={LAV} stroke={INK} strokeWidth="1.2" />
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1="448" y1={452 + i * 15} x2="510" y2={452 + i * 15} stroke={WHITE} strokeOpacity=".5" />)}
        {/* a wind-tower: a heritage form in the same skyline */}
        <path d="M494 600V512l10-18 10 18V600Z" fill={WHITE} stroke={INK} strokeWidth="1.2" transform="translate(-50 0)" />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={444} y1={524 + i * 12} x2={464} y2={524 + i * 12} stroke={INK} strokeWidth="1" />)}
      </g>

      {/* construction grid and fit-out overlay (practice, approach) */}
      <g style={fade(grid * 0.6)}>
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={420 + i * 40} y1="120" x2={420 + i * 40} y2="600" stroke={INK} strokeOpacity=".22" strokeDasharray="3 5" />)}
        {Array.from({ length: 13 }, (_, i) => <line key={i} x1="420" y1={120 + i * 40} x2="800" y2={120 + i * 40} stroke={INK} strokeOpacity=".22" strokeDasharray="3 5" />)}
        <path d="M448 440L510 600M510 440L448 600" stroke={INK} strokeOpacity=".5" />
      </g>
      <g style={fade(ffe)}>
        <g transform="translate(470 650) rotate(-2)">
          <rect width="250" height="180" fill={WHITE} stroke={INK} strokeWidth="1.2" />
          <rect x="14" y="14" width="222" height="152" fill="none" stroke={INK} strokeWidth="3" />
          <rect x="28" y="110" width="74" height="26" fill={INK} /><circle cx="146" cy="70" r="14" fill={WHITE} stroke={INK} /><rect x="168" y="100" width="46" height="26" fill={CORAL} stroke={INK} />
          {[[38, 40], [60, 40], [82, 40]].map(([x, y], i) => <rect key={i} x={x} y={y} width="14" height="14" fill={LAV} stroke={INK} />)}
          <text x="14" y="196" style={{ ...LABEL_STYLE, fontSize: 12 }} fill={INK}>FF&amp;E plan</text>
        </g>
      </g>

      {/* ───────────── Future forms: faint, unlabelled ───────────── */}
      <g style={{ ...fade(F), ...par(px, py, 12) }} fill="none" stroke={INK} strokeDasharray="6 6" strokeWidth="1.3">
        <g strokeOpacity=".85"><polygon points="70,420 70,200 130,120 190,200 190,420" /><polygon points="100,236 160,236 160,310 100,310" /><path d="M70 200H190M130 120V200" /></g>
        <g strokeOpacity=".4"><path d="M300 420Q340 260 420 300Q380 330 300 420Z" /><path d="M420 420Q470 300 540 330Q500 350 420 420Z" /></g>
        <g strokeOpacity=".4"><polygon points="590,420 590,340 640,290 690,340 690,420" /><path d="M590 340L690 420M690 340L590 420M640 290V420" /></g>
      </g>

      {/* ───────────── Studio table and material study ───────────── */}
      <g style={fade(table)}>
        <polygon points="0,900 800,900 770,786 30,786" fill={LAV} fillOpacity=".55" stroke={INK} strokeWidth="1.2" />
        <polygon points="120,880 420,880 400,810 140,810" fill={WHITE} stroke={INK} strokeWidth="1.2" />
        <path d="M150 870V824H230V844H290V824H380" fill="none" stroke={INK} strokeWidth="1.6" />
        <text x="140" y="804" style={{ ...LABEL_STYLE, fontSize: 12 }} fill={INK}>December 2021</text>
        <rect x="470" y="826" width="170" height="8" fill={MUSTARD} stroke={INK} strokeWidth=".8" transform="rotate(-12 470 826)" />
      </g>
      <g style={fade(mats)}>
        {(["lacquer", "plaster", "terrazzo", "brass", "coral-paint"] as const).map((m, i) => (
          <g key={m} transform={`rotate(${[-4, 3, -2, 4, -3][i]} ${450 + i * 60} 830)`}><Swatch id={m} x={428 + i * 58} y={806} size={48} /></g>
        ))}
        <path d="M618 130V600" stroke={INK} strokeWidth="1" strokeDasharray="10 4 2 4" />
        {[130, 600].map((y) => <circle key={y} cx="618" cy={y} r="10" fill={WHITE} stroke={INK} />)}
        <text x="613" y="134" style={{ ...LABEL_STYLE, fontSize: 11 }} fill={INK}>A</text><text x="613" y="604" style={{ ...LABEL_STYLE, fontSize: 11 }} fill={INK}>A</text>
      </g>
    </g>
  );
}
