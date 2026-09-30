import type { FragmentKind, PlateKind } from "@/content/types";
import { disc, makeRoom, pts, quads, type Pt } from "./geometry";
import { JoineryInset } from "./Insets";
import { makeIso } from "./iso";
import { KineticScene } from "./KineticScene";
import { RoomScene } from "./RoomScene";
import { CHAR, CORAL, EMERALD, INK, LABEL_STYLE, LAV, MUSTARD, PAPER, WHITE } from "./palette";

const L = { ...LABEL_STYLE, fontSize: 11 } as const;

type Tone = { top: string; left: string; right: string };
const TONES = {
  paper: { top: WHITE, left: "#E1DCE9", right: "#CFC7DE" },
  indigo: { top: "#4c3a72", left: INK, right: "#231746" },
  lav: { top: "#8A72B0", left: LAV, right: "#58417b" },
  coral: { top: "#FF8563", left: CORAL, right: "#E5502A" },
  green: { top: "#3FB48F", left: EMERALD, right: "#157A5A" },
  mustard: { top: "#E9B84A", left: MUSTARD, right: "#AE7A0E" },
} satisfies Record<string, Tone>;

function IsoBox({ b, tone, stroke = INK }: { b: ReturnType<ReturnType<typeof makeIso>["box"]>; tone: Tone; stroke?: string }) {
  const f = { stroke, strokeWidth: 0.9, strokeLinejoin: "round" as const };
  return (
    <g>
      <polygon points={pts(...b.left)} fill={tone.left} {...f} />
      <polygon points={pts(...b.right)} fill={tone.right} {...f} />
      <polygon points={pts(...b.top)} fill={tone.top} {...f} />
    </g>
  );
}

// ── Exhibition stand, axonometric ───────────────────────────────────────────
function Stand({ uid, exploded = false }: { uid: string; exploded?: boolean }) {
  const { P, box } = makeIso(16, 186, 152);
  const lift = exploded ? 1.4 : 0;
  const floor: Pt[] = [P(0, 0, 0), P(10, 0, 0), P(10, 8, 0), P(0, 8, 0)];
  return (
    <g>
      <rect width="400" height="300" fill={PAPER} />
      <defs>
        <pattern id={`${uid}-st`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <rect width="8" height="8" fill={WHITE} /><rect width="8" height="4" fill={MUSTARD} />
        </pattern>
      </defs>
      <polygon points={pts(...floor)} fill="#ECE6F4" stroke={INK} strokeWidth="1" />
      {[2, 4, 6, 8].map((x) => <polyline key={x} points={pts(P(x, 0, 0), P(x, 8, 0))} stroke={INK} strokeOpacity=".15" />)}
      {[2, 4, 6].map((y) => <polyline key={y} points={pts(P(0, y, 0), P(10, y, 0))} stroke={INK} strokeOpacity=".15" />)}
      {/* carpet */}
      <polygon points={pts(P(2.2, 1.7, 0), P(8, 1.7, 0), P(8, 6.3, 0), P(2.2, 6.3, 0))} fill={LAV} fillOpacity=".28" stroke={INK} strokeOpacity=".5" strokeWidth=".7" />
      {/* back and side walls */}
      <IsoBox b={box(2, 1.5, 0 + lift * 0, 6, 0.25, 4.4)} tone={TONES.paper} />
      <IsoBox b={box(2, 1.5, 0, 0.25, 5, 4.4)} tone={TONES.indigo} />
      {/* coral feature panel on the back wall */}
      <polygon points={pts(P(4.1, 1.76, 0.9 + lift), P(7.2, 1.76, 0.9 + lift), P(7.2, 1.76, 3.6 + lift), P(4.1, 1.76, 3.6 + lift))} fill={CORAL} stroke={INK} strokeWidth=".9" />
      {/* meeting level on posts */}
      {[[2.4, 2], [4.6, 2], [2.4, 5.8], [4.6, 5.8]].map(([x, y], i) => <IsoBox key={i} b={box(x, y, 0, 0.2, 0.2, 3 + lift)} tone={TONES.paper} />)}
      <IsoBox b={box(2.25, 1.75, 3 + lift, 3, 4.5, 0.25)} tone={TONES.lav} />
      {/* fascia with stripe band */}
      <IsoBox b={box(2, 1.5, 4.4 + lift * 1.6, 6, 0.3, 1.6)} tone={TONES.indigo} />
      <polygon points={pts(P(2.05, 1.85, 4.45 + lift * 1.6), P(8, 1.85, 4.45 + lift * 1.6), P(8, 1.85, 4.85 + lift * 1.6), P(2.05, 1.85, 4.85 + lift * 1.6))} fill={`url(#${uid}-st)`} stroke={INK} strokeWidth=".6" />
      {/* reception counter, plinth, figures */}
      <IsoBox b={box(5.6, 5.3, 0, 2.2, 0.8, 1.1)} tone={TONES.green} />
      <IsoBox b={box(6.6, 2.3, 0, 1, 1, 1.25)} tone={TONES.paper} />
      <circle cx={P(7.1, 2.8, 1.7)[0]} cy={P(7.1, 2.8, 1.7)[1]} r="6" fill={CORAL} stroke={INK} strokeWidth=".8" />
      {[[8.6, 6.8], [9.2, 5.6]].map(([x, y], i) => (<g key={i}><ellipse cx={P(x, y, 0)[0]} cy={P(x, y, 0)[1]} rx="6" ry="2.5" fill={INK} fillOpacity=".2" /><rect x={P(x, y, 0)[0] - 3.5} y={P(x, y, 1.4)[1]} width="7" height="20" rx="3.5" fill={i ? LAV : INK} /><circle cx={P(x, y, 1.8)[0]} cy={P(x, y, 1.8)[1]} r="4.3" fill={i ? LAV : INK} /></g>))}
      {/* aisle arrows */}
      <g stroke={INK} strokeDasharray="4 4" fill="none" opacity=".6">
        <polyline points={pts(P(9.4, 7.6, 0), P(9.4, 0.8, 0))} /><polyline points={pts(P(8.6, 7.4, 0), P(1.4, 7.4, 0))} />
      </g>
    </g>
  );
}

// ── Pop-up kit, axonometric ─────────────────────────────────────────────────
function Popup({ uid, exploded = false }: { uid: string; exploded?: boolean }) {
  const { P, box } = makeIso(20, 196, 170);
  const e = exploded ? 1.6 : 0;
  return (
    <g>
      <rect width="400" height="300" fill={PAPER} />
      <defs>
        <pattern id={`${uid}-pp`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <rect width="10" height="10" fill={WHITE} /><rect width="10" height="5" fill={MUSTARD} />
        </pattern>
      </defs>
      <polygon points={pts(P(-1, -1, 0), P(8, -1, 0), P(8, 7, 0), P(-1, 7, 0))} fill="#ECE6F4" stroke={INK} strokeWidth="1" />
      {/* two rear modules, two counter modules */}
      <IsoBox b={box(0, 0, 0, 3, 1.4, 3.4)} tone={TONES.indigo} />
      <IsoBox b={box(3.2 + e * 0.4, 0, 0, 3, 1.4, 3.4)} tone={TONES.lav} />
      <IsoBox b={box(0, 1.6 + e * 0.5, 0, 3, 1.2, 1.1)} tone={TONES.paper} />
      <IsoBox b={box(3.2 + e * 0.4, 1.6 + e * 0.5, 0, 3, 1.2, 1.1)} tone={TONES.coral} />
      {/* coral logo panel and display cut-out */}
      <polygon points={pts(P(0.4, 1.42, 1.6), P(2.6, 1.42, 1.6), P(2.6, 1.42, 3), P(0.4, 1.42, 3))} fill={CORAL} stroke={INK} strokeWidth=".8" />
      <polygon points={pts(P(3.6 + e * 0.4, 1.42, 1.4), P(5.6 + e * 0.4, 1.42, 1.4), P(5.6 + e * 0.4, 1.42, 3), P(3.6 + e * 0.4, 1.42, 3))} fill={WHITE} stroke={INK} strokeWidth=".8" />
      <circle cx={P(4.6 + e * 0.4, 1.42, 2.2)[0]} cy={P(4.6 + e * 0.4, 1.42, 2.2)[1]} r="9" fill={MUSTARD} stroke={INK} strokeWidth=".8" />
      {/* striped canopy */}
      <g>
        <polygon points={pts(P(-0.3, -0.3, 3.4 + e * 1.4), P(6.5 + e * 0.4, -0.3, 3.4 + e * 1.4), P(6.5 + e * 0.4, 3.1 + e * 0.5, 3.4 + e * 1.4), P(-0.3, 3.1 + e * 0.5, 3.4 + e * 1.4))} fill={`url(#${uid}-pp)`} stroke={INK} strokeWidth="1" />
        <polygon points={pts(P(-0.3, 3.1 + e * 0.5, 3.4 + e * 1.4), P(6.5 + e * 0.4, 3.1 + e * 0.5, 3.4 + e * 1.4), P(6.5 + e * 0.4, 3.1 + e * 0.5, 3.15 + e * 1.4), P(-0.3, 3.1 + e * 0.5, 3.15 + e * 1.4))} fill={INK} />
      </g>
      {exploded && (
        <g stroke={INK} strokeDasharray="3 4" opacity=".6">
          {[[0.5, 0.5], [3.7, 0.5], [0.5, 2.2], [3.7, 2.2]].map(([x, y], i) => <line key={i} x1={P(x, y, 0)[0]} y1={P(x, y, 0)[1]} x2={P(x, y, 3.4 + e * 1.4)[0]} y2={P(x, y, 3.4 + e * 1.4)[1]} />)}
        </g>
      )}
    </g>
  );
}

// ── Launch stage, one-point perspective ─────────────────────────────────────
function Stage() {
  const R = makeRoom({ ox: 0, oy: 18 });
  const Q = quads(R);
  const { proj } = R;
  const rows = [0.04, 0.1, 0.17, 0.25, 0.34, 0.44];
  return (
    <g>
      <rect width="1200" height="700" fill={PAPER} />
      <polygon points={pts(...Q.back(-1, 1, 0, 1))} fill={INK} />
      <polygon points={pts(...Q.floor(-1, 1, 0, 1))} fill="#ECE6F4" />
      <polygon points={pts(...Q.wallL(0, 1, 0, 1))} fill="#231746" />
      <polygon points={pts(...Q.wallR(0, 1, 0, 1))} fill="#231746" />
      <polygon points={pts(...Q.ceil(-1, 1, 0, 1))} fill="#1A1138" />
      {/* light cones */}
      {[-0.5, 0, 0.5].map((u) => <polygon key={u} points={pts(proj(u - 0.04, 0.9, 0.86), proj(u + 0.04, 0.9, 0.86), proj(u * 0.3 + 0.12, 0.1, 0.9), proj(u * 0.3 - 0.12, 0.1, 0.9))} fill={WHITE} fillOpacity=".16" />)}
      {/* truss frame */}
      {[[-0.78, 0.12, -0.78, 0.94], [0.78, 0.12, 0.78, 0.94], [-0.78, 0.94, 0.78, 0.94], [-0.78, 0.86, 0.78, 0.86]].map(([u0, v0, u1, v1], i) => (
        <polyline key={i} points={pts(proj(u0, v0, 0.86), proj(u1, v1, 0.86))} stroke={WHITE} strokeWidth="3" />
      ))}
      {Array.from({ length: 16 }, (_, i) => -0.78 + (i * 1.56) / 15).map((u, i, a) => i < a.length - 1 && <polyline key={i} points={pts(proj(u, 0.86, 0.86), proj(a[i + 1], 0.94, 0.86))} stroke={WHITE} strokeOpacity=".7" strokeWidth="1.2" />)}
      {/* stage and plinth */}
      {(() => { const s = Q.box(-0.8, 0.8, 0.78, 0.96, 0, 0.1); return (<g><polygon points={pts(...s.front)} fill="#4c3a72" stroke={WHITE} strokeOpacity=".5" /><polygon points={pts(...s.top)} fill={LAV} stroke={WHITE} strokeOpacity=".5" /></g>); })()}
      {(() => { const b = Q.box(-0.12, 0.12, 0.86, 0.94, 0.1, 0.32); return (<g><polygon points={pts(...b.front)} fill={CORAL} /><polygon points={pts(...b.top)} fill="#FF8563" /></g>); })()}
      <circle cx={proj(0, 0.4, 0.9)[0]} cy={proj(0, 0.4, 0.9)[1]} r="11" fill={WHITE} />
      {/* raked audience, seen from behind */}
      {rows.map((d, ri) => {
        const n = 10 - ri % 2;
        return Array.from({ length: n }, (_, i) => {
          const u = -0.86 + ((i + 0.5) * 1.72) / n;
          const p = proj(u, 0.16 + ri * 0.012, d);
          const scale = 1 - d * 0.75;
          return <circle key={`${ri}-${i}`} cx={p[0]} cy={p[1]} r={15 * scale + 3} fill={(ri * 7 + i * 3) % 11 === 0 ? EMERALD : (ri + i) % 2 ? INK : LAV} stroke={PAPER} strokeWidth="1.4" />;
        });
      })}
    </g>
  );
}

// ── Public components ───────────────────────────────────────────────────────
/** The natural aspect of each plate, so wide crops never clip a drawing. */
export const plateAspect = (kind: PlateKind) => (kind === "interior" || kind === "villa" || kind === "stage" ? "aspect-[12/7]" : "aspect-[4/3]");

export function Plate({ kind, uid, label, className }: { kind: PlateKind; uid: string; label: string; className?: string }) {
  const wide = kind === "interior" || kind === "villa" || kind === "stage";
  return (
    <svg viewBox={wide ? "0 0 1200 700" : "0 0 400 300"} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} className={className}>
      {kind === "interior" && <RoomScene uid={uid} mode="space" annotate={false} light={0.5} view={{ ox: -18, oy: 0 }} />}
      {kind === "villa" && <RoomScene uid={uid} mode="space" variant="villa" annotate={false} light={0.25} view={{ ox: 22, oy: -4 }} />}
      {kind === "stage" && <Stage />}
      {kind === "stand" && <Stand uid={uid} />}
      {kind === "popup" && <Popup uid={uid} />}
      {kind === "window" && <KineticScene t={0.4} uid={uid} />}
    </svg>
  );
}

function Sheet({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <>
      <title>{label}</title>
      <rect width="400" height="300" fill={PAPER} />
      {children}
    </>
  );
}

/** A small drawing fragment: a plan, section or detail. Used beside plates and on project pages. */
export function Fragment({ kind, uid, className }: { kind: FragmentKind; uid: string; className?: string }) {
  const label = {
    "plan-interior": "Plan of a room with an arched opening", "plan-stand": "Plan of a stand meeting two aisles",
    "section-stage": "Section of a stage with raked seating and a sightline", kit: "A kit of parts, exploded",
    "rail-elevation": "Elevation of a rail with carriages and panels", "joinery-section": "Section through a battened wall",
  }[kind];
  if (kind === "joinery-section") return <div className={className}><JoineryInset /></div>;
  if (kind === "kit") return <svg viewBox="0 0 400 300" role="img" aria-label={label} className={className}><Popup uid={uid} exploded /></svg>;
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className={className}>
      <Sheet label={label}>
        {kind === "plan-interior" && (
          <g stroke={INK} fill="none" strokeWidth="1.2">
            <path d="M50 40H350V250H50Z" strokeWidth="5" />
            <path d="M170 40h60" stroke={PAPER} strokeWidth="7" /><path d="M170 40v0" />
            <path d="M170 34a30 30 0 0 1 60 0" strokeWidth="1" strokeDasharray="3 3" transform="translate(0 -4)" />
            <path d="M172 40a28 28 0 0 0 56 0" strokeWidth="1" />
            <rect x="64" y="150" width="120" height="44" fill={INK} />
            <rect x="64" y="150" width="22" height="44" fill="#231746" />
            <circle cx="222" cy="172" r="18" fill={WHITE} />
            <rect x="196" y="126" width="76" height="92" fill={LAV} fillOpacity=".22" strokeDasharray="4 3" />
            <rect x="290" y="160" width="40" height="28" fill={CORAL} stroke={INK} />
            <circle cx="318" cy="76" r="14" fill={EMERALD} stroke={INK} />
            <path d="M50 270h300M50 264v12M350 264v12" strokeWidth="1" /><path d="M30 40v210M24 40h12M24 250h12" strokeWidth="1" />
          </g>
        )}
        {kind === "plan-stand" && (
          <g stroke={INK} fill="none" strokeWidth="1.2">
            <rect x="20" y="20" width="360" height="260" fill="#ECE6F4" stroke="none" />
            <rect x="20" y="20" width="360" height="56" fill={WHITE} stroke="none" /><rect x="324" y="20" width="56" height="260" fill={WHITE} stroke="none" />
            <text x="34" y="52" style={L} fill={INK} stroke="none">AISLE</text><text x="342" y="150" style={L} fill={INK} stroke="none" transform="rotate(90 342 150)">AISLE</text>
            <rect x="60" y="100" width="230" height="150" fill={PAPER} strokeWidth="1" />
            <path d="M60 100H290M60 100V250" strokeWidth="5" />
            <rect x="200" y="210" width="80" height="26" fill={EMERALD} /><rect x="70" y="112" width="60" height="70" fill={LAV} fillOpacity=".4" strokeDasharray="4 3" />
            <path d="M336 160C320 160 300 170 280 175" strokeDasharray="5 4" /><path d="M250 76C250 90 250 96 246 110" strokeDasharray="5 4" />
            <text x="80" y="210" style={L} fill={INK} stroke="none">Meeting stair above</text>
          </g>
        )}
        {kind === "section-stage" && (
          <g stroke={INK} fill="none" strokeWidth="1.2">
            <path d="M20 250H380" strokeWidth="2" />
            <rect x="290" y="210" width="80" height="40" fill={LAV} /><rect x="322" y="170" width="16" height="40" fill={CORAL} />
            <rect x="282" y="84" width="96" height="10" fill={WHITE} strokeWidth="2" />
            <path d="M40 250V240H110V222H150V204H190V186H230V168" strokeWidth="2" />
            <circle cx="220" cy="156" r="7" fill={INK} /><path d="M220 156L330 176" strokeDasharray="5 4" />
            <path d="M330 96L300 170M330 96L356 170" strokeOpacity=".4" fill={MUSTARD} fillOpacity=".12" />
            <text x="40" y="280" style={L} fill={INK} stroke="none">Sightline from the back row to the plinth</text>
          </g>
        )}
        {kind === "rail-elevation" && (
          <g stroke={INK} fill="none" strokeWidth="1.2">
            <rect x="24" y="58" width="352" height="9" fill={MUSTARD} fillOpacity=".6" />
            {[70, 160].map((x) => <rect key={x} x={x} y="48" width="18" height="12" fill={WHITE} />)}
            <rect x="60" y="67" width="100" height="90" fill={CORAL} /><path d="M70 92h78" stroke={WHITE} strokeOpacity=".6" />
            <rect x="24" y="226" width="352" height="6" fill={INK} fillOpacity=".5" />
            <rect x="190" y="170" width="110" height="62" fill={LAV} />
            <path d="M60 120h100M60 114v12M160 114v12" transform="translate(0 76)" strokeWidth="1" /><path d="M190 170h110" transform="translate(0 -26)" strokeWidth="1" />
            <path d="M160 100h120" stroke={INK} strokeDasharray="5 4" /><path d="M276 96l8 4-8 4" />
            <text x="30" y="36" style={L} fill={INK} stroke="none">Rail, carriages and travelling panels</text>
          </g>
        )}
      </Sheet>
    </svg>
  );
}

export { disc, CHAR };
