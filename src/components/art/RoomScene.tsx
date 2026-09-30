import type { ReactNode } from "react";
import { disc, makeRoom, pathOf, pts, quads, rng, type Pt, type View } from "./geometry";
import { CHAR, CORAL, EMERALD, INK, LABEL_STYLE, LAV, MUSTARD, PAPER, WHITE } from "./palette";

export type Mode = "idea" | "material" | "space";
export type Hotspot = { id: string; n: number; label: string; u: number; v: number; d: number };

type Props = {
  mode: Mode;
  view?: View;
  /** 0 = low raking light, 1 = high overhead light. */
  light?: number;
  variant?: "lounge" | "villa";
  annotate?: boolean;
  hotspots?: Hotspot[];
  selected?: string | null;
  onSelect?: (id: string) => void;
  uid: string;
};

const fade = (on: boolean): React.CSSProperties => ({ opacity: on ? 1 : 0, transition: "opacity .9s cubic-bezier(.22,.8,.3,1)" });

function Face({ p, fill, o = 1 }: { p: Pt[]; fill: string; o?: number }) {
  return <polygon points={pts(...p)} fill={fill} fillOpacity={o} stroke={INK} strokeWidth="1" strokeLinejoin="round" />;
}

function Callout({ x, y, tx, ty, text, anchor = "start" }: { x: number; y: number; tx: number; ty: number; text: string; anchor?: "start" | "end" }) {
  return (
    <g>
      <path d={`M${x} ${y}L${tx} ${ty}`} stroke={INK} strokeWidth="1" fill="none" />
      <circle cx={x} cy={y} r="3" fill={INK} />
      <text x={tx + (anchor === "start" ? 6 : -6)} y={ty + 4} textAnchor={anchor} style={LABEL_STYLE} fill={INK} stroke={PAPER} strokeWidth="4" paintOrder="stroke">
        {text}
      </text>
    </g>
  );
}

export function RoomScene({ mode, view = { ox: 0, oy: 0 }, light = 0.6, variant = "lounge", annotate = true, hotspots = [], selected, onSelect, uid }: Props) {
  const R = makeRoom(view);
  const { proj } = R;
  const Q = quads(R);
  const idea = mode === "idea";
  const showFill = mode !== "idea";
  const showSpace = mode === "space";
  const L = light;
  const villa = variant === "villa";

  // ── Planes ────────────────────────────────────────────────────────────────
  const floor = Q.floor(-1, 1, 0, 1);
  const ceil = Q.ceil(-1, 1, 0, 1);
  const leftWall = Q.wallL(0, 1, 0, 1);
  const rightWall = Q.wallR(0, 1, 0, 1);
  const backWall = Q.back(-1, 1, 0, 1);

  // ── Floor: terrazzo chips, joints, brass inlay ────────────────────────────
  const chipRand = rng(11);
  const chips = Array.from({ length: 460 }, () => {
    const u = chipRand() * 2 - 1;
    const d = 0.015 + chipRand() * 0.985;
    const s = 0.0035 + chipRand() * 0.0085;
    const c = proj(u, 0, d);
    const e = proj(u + s, 0, d);
    const rx = Math.abs(e[0] - c[0]);
    const n = proj(u, 0, d + 0.012);
    const ry = Math.max(0.5, Math.abs(n[1] - c[1]) * (0.45 + chipRand() * 0.6));
    const pick = chipRand();
    const fill = pick < 0.5 ? LAV : pick < 0.68 ? INK : pick < 0.78 ? CORAL : pick < 0.84 ? MUSTARD : pick < 0.88 ? CHAR : WHITE;
    return { c, rx, ry, fill, rot: chipRand() * 180, o: fill === WHITE ? 0.9 : 0.55 + chipRand() * 0.35 };
  });
  const rows = [0.06, 0.13, 0.21, 0.3, 0.4, 0.52, 0.66, 0.82];
  const cols = [-0.75, -0.5, -0.25, 0.25, 0.5, 0.75];

  // ── Left wall: battens with a niche (joinery) ─────────────────────────────
  const pitch = 0.03;
  const battens = Array.from({ length: 31 }, (_, i) => 0.05 + i * pitch).filter((d) => d < 0.6 || d > 0.8);
  const niche = Q.wallL(0.62, 0.78, 0.33, 0.63);
  const nicheBack = Q.wallL(0.62, 0.78, 0.33, 0.63, -0.94);

  // ── Right wall: glazing ───────────────────────────────────────────────────
  const panes = Array.from({ length: 5 }, (_, i) => ({ d0: 0.12 + i * 0.136 + 0.006, d1: 0.12 + (i + 1) * 0.136 - 0.006 }));
  const rightCoral = Q.wallR(0.81, 1, 0, 0.9);

  // ── Back wall: arch and courtyard ─────────────────────────────────────────
  const archR = { u: 0.3, v: 0.27 };
  const springV = 0.5;
  const arch: Pt[] = [
    proj(-archR.u, 0, 1),
    proj(-archR.u, springV, 1),
    ...Array.from({ length: 19 }, (_, i) => {
      const a = Math.PI - (i / 18) * Math.PI;
      return proj(Math.cos(a) * archR.u, springV + Math.sin(a) * archR.v, 1);
    }),
    proj(archR.u, 0, 1),
  ];
  const archPath = pathOf(arch);
  const flutes = [-0.92, -0.86, -0.8, -0.74, -0.68, -0.62, -0.56, -0.5, -0.44, 0.44, 0.5, 0.56, 0.62, 0.68, 0.74, 0.8, 0.86, 0.92];

  // ── Light on the floor from the glazed wall ───────────────────────────────
  const reach = 0.42 + (1 - L) * 1.0;
  const shear = 0.05 + (1 - L) * 0.11;
  const patches = panes.map((p) => [proj(0.97, 0, p.d0), proj(0.97, 0, p.d1), proj(Math.max(0.97 - reach, -0.78), 0, p.d1 + shear), proj(Math.max(0.97 - reach, -0.78), 0, p.d0 + shear)]);

  // ── Furniture ────────────────────────────────────────────────────────────
  const sofaBase = Q.box(-0.95, -0.42, 0.28, 0.66, 0, 0.12);
  const sofaSeat = Q.box(-0.86, -0.43, 0.3, 0.64, 0.12, 0.18);
  const sofaBack = Q.box(-0.95, -0.86, 0.28, 0.66, 0.12, 0.32);
  const arm = Q.box(0.38, 0.62, 0.34, 0.44, 0, 0.13);
  const armCush = Q.box(0.4, 0.6, 0.35, 0.43, 0.13, 0.17);
  const bench = Q.box(-0.92, -0.4, 0.9, 1.0, 0, 0.13);
  const consoleBox = Q.box(-0.98, -0.84, 0.22, 0.74, 0, 0.26);
  const villaBench = Q.box(-0.85, 0.85, 0.82, 0.96, 0, 0.12);
  const tableTop = disc(R, -0.1, 0.46, 0.11, 0.07, 0.1);
  const tableShadow = disc(R, -0.1, 0.47, 0.13, 0.08, 0);
  const rug = Q.floor(-0.62, 0.22, 0.2, 0.64);
  const pendantTop = proj(0, 1, 0.56);
  const pendantShade = proj(0, 0.6, 0.56);
  const shadeL = proj(-0.07, 0.6, 0.56);
  const shadeR = proj(0.07, 0.6, 0.56);
  const shadeTopL = proj(-0.028, 0.66, 0.56);
  const shadeTopR = proj(0.028, 0.66, 0.56);
  const slotL = Q.ceil(-0.47, -0.42, 0.06, 0.96);
  const slotR = Q.ceil(0.42, 0.47, 0.06, 0.96);
  const pot = Q.box(0.76, 0.92, 0.84, 0.97, 0, 0.12);
  const plantC = proj(0.84, 0.25, 0.9);
  const inlay = Q.floor(-0.008, 0.008, 0.02, 1);

  const line = { stroke: INK, strokeWidth: 1.25, fill: "none", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const thin = { ...line, strokeWidth: 0.8 };

  return (
    <g>
      <defs>
        <clipPath id={`${uid}-arch`}>
          <path d={archPath} />
        </clipPath>
        <clipPath id={`${uid}-floor`}>
          <polygon points={pts(...floor)} />
        </clipPath>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor={MUSTARD} stopOpacity=".55" />
          <stop offset="1" stopColor={MUSTARD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Paper ground */}
      <rect x="-80" y="-40" width="1360" height="780" fill={PAPER} />

      {/* ───────────── MATERIAL: cut-paper fills ───────────── */}
      <g style={fade(showFill)}>
        <polygon points={pts(...ceil)} fill={WHITE} />
        <polygon points={pts(...floor)} fill="#ECE6F4" />
        <g clipPath={`url(#${uid}-floor)`}>
          {chips.map((c, i) => (
            <ellipse key={i} cx={c.c[0]} cy={c.c[1]} rx={c.rx} ry={c.ry} transform={`rotate(${c.rot} ${c.c[0]} ${c.c[1]})`} fill={c.fill} fillOpacity={c.o} />
          ))}
        </g>
        <polygon points={pts(...Q.floor(-0.008, 0.008, 0.02, 1))} fill={MUSTARD} />
        {/* left wall: lacquered battens over a dark backing */}
        <polygon points={pts(...leftWall)} fill={INK} />
        {battens.map((d) => (
          <polygon key={d} points={pts(...Q.wallL(d, d + 0.021, 0, 0.93))} fill={LAV} fillOpacity={0.96} />
        ))}
        <polygon points={pts(...Q.wallL(0, 1, 0.93, 1))} fill={WHITE} />
        <polygon points={pts(...nicheBack)} fill={INK} />
        <polygon points={pts(...niche)} fill="#231746" />
        {/* right wall: plaster, glazing, coral panel */}
        <polygon points={pts(...rightWall)} fill="#F1ECF7" />
        {panes.map((p, i) => (
          <polygon key={i} points={pts(...Q.wallR(p.d0, p.d1, 0.1, 0.88))} fill={WHITE} />
        ))}
        <polygon points={pts(...rightCoral)} fill={CORAL} />
        {/* back wall */}
        <polygon points={pts(...backWall)} fill="#F6F3FA" />
        <polygon points={pts(...Q.back(-1, -0.3, 0, 1))} fill="#E1DCE9" />
        <polygon points={pts(...Q.back(0.3, 1, 0, 1))} fill="#E1DCE9" />
        <path d={archPath} fill={WHITE} />
      </g>

      {/* ───────────── SPACE: light, courtyard, furniture ───────────── */}
      <g style={fade(showSpace)}>
        {/* courtyard seen through the arch */}
        <g clipPath={`url(#${uid}-arch)`}>
          <rect x="300" y="200" width="420" height="260" fill="#E1DCE9" fillOpacity=".7" />
          <polygon points={pts(...Q.back(-0.3, 0.3, 0, 0.3))} fill="#F6F3FA" />
          <polygon points={pts(...Q.back(-0.3, 0.3, 0, 0.12))} fill="#ECE6F4" />
          {/* a slim trunk and canopy, a low wall and a bench beyond */}
          <line x1={proj(-0.06, 0, 1)[0]} y1={proj(0, 0.12, 1)[1]} x2={proj(-0.06, 0, 1)[0]} y2={proj(0, 0.52, 1)[1]} stroke={INK} strokeWidth="2" />
          <circle cx={proj(-0.06, 0, 1)[0]} cy={proj(0, 0.56, 1)[1]} r="26" fill={EMERALD} fillOpacity=".9" />
          <circle cx={proj(0.06, 0, 1)[0]} cy={proj(0, 0.5, 1)[1]} r="17" fill={EMERALD} fillOpacity=".7" />
          <circle cx={proj(-0.18, 0, 1)[0]} cy={proj(0, 0.46, 1)[1]} r="15" fill={EMERALD} fillOpacity=".6" />
          <polygon points={pts(...Q.back(0.08, 0.3, 0.12, 0.2))} fill={WHITE} stroke={INK} strokeWidth=".8" />
          <circle cx={proj(0.2, 0.6, 1)[0]} cy={proj(0, 0.6, 1)[1]} r="9" fill={MUSTARD} />
        </g>
        {/* shadows and light on the floor */}
        <g clipPath={`url(#${uid}-floor)`}>
          {!villa && (<g>
          <polygon points={pts(...tableShadow)} fill={INK} fillOpacity=".16" />
          <polygon points={pts(...Q.floor(-0.96, -0.4, 0.3, 0.7))} fill={INK} fillOpacity=".18" />
          <polygon points={pts(...Q.floor(0.36, 0.66, 0.33, 0.47))} fill={INK} fillOpacity=".16" />
          </g>)}
          {patches.map((p, i) => (
            <polygon key={i} points={pts(...p)} fill={WHITE} fillOpacity=".62" />
          ))}
        </g>
        {/* rug */}
        {!villa && <polygon points={pts(...rug)} fill={LAV} fillOpacity=".28" stroke={INK} strokeWidth=".8" />}
        <polygon points={pts(...Q.ceil(-0.55, -0.34, 0.04, 0.98))} fill={MUSTARD} fillOpacity=".1" />
        <polygon points={pts(...Q.ceil(0.34, 0.55, 0.04, 0.98))} fill={MUSTARD} fillOpacity=".1" />
        {/* ceiling light slots and their glow */}
        <polygon points={pts(...slotL)} fill={WHITE} />
        <polygon points={pts(...slotR)} fill={WHITE} />
        {/* pendant */}
        <line x1={pendantTop[0]} y1={pendantTop[1]} x2={pendantShade[0]} y2={pendantShade[1] - 18} stroke={INK} strokeWidth="1.2" />
        <circle cx={pendantShade[0]} cy={pendantShade[1] + 10} r="64" fill={`url(#${uid}-glow)`} />
        <polygon points={pts(shadeTopL, shadeTopR, shadeR, shadeL)} fill={MUSTARD} stroke={INK} strokeWidth="1" />
        {/* back bench or villa bench */}
        {villa ? (
          <g>
            <Face p={villaBench.side} fill="#ECE6F4" />
            <Face p={villaBench.front} fill={WHITE} />
            <Face p={villaBench.top} fill={PAPER} />
          </g>
        ) : (
          <g>
            <Face p={bench.side} fill="#ECE6F4" />
            <Face p={bench.front} fill={WHITE} />
            <Face p={bench.top} fill={PAPER} />
          </g>
        )}
        {!villa && (<g>
        <Face p={sofaBack.side} fill={INK} />
        <Face p={sofaBack.front} fill="#231746" />
        <Face p={sofaBack.top} fill={INK} />
        <Face p={sofaBase.side} fill="#231746" />
        <Face p={sofaBase.front} fill={INK} />
        <Face p={sofaSeat.side} fill={LAV} />
        <Face p={sofaSeat.front} fill={LAV} />
        <Face p={sofaSeat.top} fill="#8A72B0" />
        </g>)}
        {!villa && (<g>
        {/* armchair in coral */}
        <Face p={arm.side} fill="#E5502A" />
        <Face p={arm.front} fill={CORAL} />
        <Face p={armCush.top} fill={CORAL} />
        <Face p={armCush.front} fill="#FF8563" />
        </g>)}
        {villa && (<g>
          <polygon points={pts(...Q.floor(-0.22, 0.22, 0.04, 0.86))} fill={LAV} fillOpacity=".3" stroke={INK} strokeWidth=".8" />
          <Face p={consoleBox.side} fill="#231746" />
          <Face p={consoleBox.front} fill={INK} />
          <Face p={consoleBox.top} fill={LAV} />
          <circle cx={proj(-0.9, 0.3, 0.42)[0]} cy={proj(-0.9, 0.3, 0.42)[1]} r="11" fill={EMERALD} />
          <circle cx={proj(-0.9, 0.27, 0.66)[0]} cy={proj(-0.9, 0.27, 0.66)[1]} r="8" fill={CORAL} />
        </g>)}
        {/* table */}
        {!villa && (<g>
        <line x1={proj(-0.1, 0, 0.47)[0]} y1={proj(-0.1, 0, 0.47)[1]} x2={proj(-0.1, 0.1, 0.47)[0]} y2={proj(-0.1, 0.1, 0.47)[1]} stroke={INK} strokeWidth="3" />
        <polygon points={pts(...tableTop)} fill={WHITE} stroke={INK} strokeWidth="1" />
        <circle cx={proj(-0.1, 0.14, 0.46)[0]} cy={proj(-0.1, 0.14, 0.46)[1]} r="7" fill={EMERALD} />
        </g>)}
        {/* corner planter */}
        <Face p={pot.side} fill="#231746" />
        <Face p={pot.front} fill={INK} />
        <circle cx={plantC[0]} cy={plantC[1]} r="38" fill={EMERALD} />
        <circle cx={plantC[0] + 26} cy={plantC[1] + 14} r="22" fill={EMERALD} fillOpacity=".85" />
        <circle cx={plantC[0] - 24} cy={plantC[1] + 18} r="18" fill={EMERALD} fillOpacity=".8" />
        {/* daylight through the glazing */}
        {panes.map((p, i) => (
          <polygon key={i} points={pts(...Q.wallR(p.d0, p.d1, 0.1, 0.88))} fill={WHITE} fillOpacity=".9" />
        ))}
        {/* light edge on each batten */}
        {battens.map((d) => {
          const a = proj(-1, 0, d + 0.021);
          const b = proj(-1, 0.93, d + 0.021);
          return <line key={d} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={WHITE} strokeOpacity=".3" strokeWidth=".8" />;
        })}
      </g>

      {/* ───────────── Material samples (material state) ───────────── */}
      <g style={fade(mode === "material")}>
        {[
          { c: INK, n: "Lacquer" },
          { c: LAV, n: "Plaster" },
          { c: "#ECE6F4", n: "Terrazzo", chips: true },
          { c: MUSTARD, n: "Brass" },
          { c: CORAL, n: "Paint" },
        ].map((s, i) => (
          <g key={s.n} transform={`translate(${440 + i * 66} 642) rotate(${[-3, 2, -2, 3, -1][i]} 26 26)`}>
            <rect width="54" height="54" fill={s.c} stroke={INK} strokeWidth="1" />
            {s.chips && [[12, 14, 3], [32, 10, 2], [40, 34, 4], [18, 40, 2.5], [28, 26, 2]].map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} fill={[LAV, CORAL, INK, MUSTARD, INK][k]} />)}
            <text x="27" y="70" textAnchor="middle" style={{ ...LABEL_STYLE, fontSize: 11 }} fill={INK}>{s.n}</text>
          </g>
        ))}
      </g>

      {/* ───────────── Linework ───────────── */}
      <g style={{ opacity: idea ? 1 : showSpace ? 0.3 : 0.55, transition: "opacity .9s" }}>
        <polygon points={pts(...floor)} {...line} />
        <polygon points={pts(...ceil)} {...line} />
        <polygon points={pts(...backWall)} {...line} />
        <path d={archPath} {...line} strokeWidth={1.6} />
        {/* construction rays to the vanishing point (idea only) */}
        <g style={fade(idea)}>
          {[[-80, -30], [1280, -30], [-80, 730], [1280, 730]].map(([x, y], i) => (
            <line key={i} x1={x} y1={y} x2={R.vp[0]} y2={R.vp[1]} stroke={INK} strokeWidth=".6" strokeDasharray="5 5" opacity=".45" />
          ))}
          <line x1="-80" y1={R.vp[1]} x2="1280" y2={R.vp[1]} stroke={INK} strokeWidth=".6" strokeDasharray="2 5" opacity=".5" />
          <circle cx={R.vp[0]} cy={R.vp[1]} r="4" fill="none" stroke={INK} strokeWidth="1" />
          <path d={`M${R.vp[0] - 9} ${R.vp[1]}h18M${R.vp[0]} ${R.vp[1] - 9}v18`} stroke={INK} strokeWidth="1" />
        </g>
        {/* floor joints and brass inlay */}
        {rows.map((d) => (
          <polyline key={d} points={pts(proj(-1, 0, d), proj(1, 0, d))} {...thin} opacity={0.55} />
        ))}
        {cols.map((u) => (
          <polyline key={u} points={pts(proj(u, 0, 0), proj(u, 0, 1))} {...thin} opacity={0.4} />
        ))}
        <polygon points={pts(...inlay)} {...thin} />
        {/* battens */}
        {battens.map((d) => {
          const a = Q.wallL(d, d + 0.021, 0, 0.93);
          return <polygon key={d} points={pts(...a)} {...thin} />;
        })}
        <polyline points={pts(proj(-1, 0.93, 0), proj(-1, 0.93, 1))} {...line} />
        <polygon points={pts(...niche)} {...line} />
        <polyline points={pts(proj(-0.94, 0.63, 0.62), proj(-0.94, 0.63, 0.78), proj(-0.94, 0.33, 0.78))} {...thin} />
        {/* glazing */}
        {panes.map((p, i) => (
          <polygon key={i} points={pts(...Q.wallR(p.d0, p.d1, 0.1, 0.88))} {...line} />
        ))}
        <polyline points={pts(proj(1, 0.6, 0.12), proj(1, 0.6, 0.8))} {...thin} />
        <polygon points={pts(...rightCoral)} {...line} />
        {/* pilasters */}
        {flutes.map((u) => (
          <polyline key={u} points={pts(proj(u, 0, 1), proj(u, 1, 1))} {...thin} opacity={0.35} />
        ))}
        <polyline points={pts(proj(-1, 0.14, 1), proj(-0.3, 0.14, 1))} {...thin} />
        {/* ceiling slots and pendant outline (idea) */}
        <polygon points={pts(...slotL)} {...thin} />
        <polygon points={pts(...slotR)} {...thin} />
        <g style={fade(!showSpace)}>
          <line x1={pendantTop[0]} y1={pendantTop[1]} x2={pendantShade[0]} y2={pendantShade[1]} {...thin} />
          <polygon points={pts(shadeTopL, shadeTopR, shadeR, shadeL)} {...thin} />
          {!villa && (<g>
          <polygon points={pts(...sofaBase.front)} {...thin} />
          <polygon points={pts(...sofaBase.side)} {...thin} />
          <polygon points={pts(...sofaBack.top)} {...thin} />
          <polygon points={pts(...arm.front)} {...thin} />
          <polygon points={pts(...arm.side)} {...thin} />
          <polygon points={pts(...tableTop)} {...thin} />
          </g>)}
        </g>
      </g>

      {/* ───────────── Annotation (idea state) ───────────── */}
      {annotate && (
        <g style={fade(idea)} aria-hidden="true">
          <Callout x={proj(-1, 0.75, 0.24)[0]} y={proj(-1, 0.75, 0.24)[1]} tx={proj(-1, 0.75, 0.24)[0] - 10} ty={proj(-1, 0.75, 0.24)[1] - 74} text="Battened joinery wall" anchor="start" />
          <Callout x={proj(0.3, 0, 0.14)[0]} y={proj(0.3, 0, 0.14)[1]} tx={proj(0.3, 0, 0.14)[0] + 40} ty={proj(0.3, 0, 0.14)[1] - 56} text="Terrazzo floor, brass inlay" />
          <Callout x={proj(0.2, 0.74, 1)[0]} y={proj(0.2, 0.74, 1)[1]} tx={proj(0.2, 0.74, 1)[0] + 70} ty={proj(0.2, 0.74, 1)[1] - 34} text="Arched opening to courtyard" />
          {/* dimensions */}
          <g stroke={INK} strokeWidth="1" fill="none">
            <path d={`M${R.back.x0} ${R.back.y1 + 20}H${R.back.x1}M${R.back.x0} ${R.back.y1 + 13}v14M${R.back.x1} ${R.back.y1 + 13}v14`} />
            <path d={`M${R.back.x0 - 22} ${R.back.y0}V${R.back.y1}M${R.back.x0 - 29} ${R.back.y0}h14M${R.back.x0 - 29} ${R.back.y1}h14`} />
          </g>
          <text x={(R.back.x0 + R.back.x1) / 2} y={R.back.y1 + 38} textAnchor="middle" style={{ ...LABEL_STYLE, fontSize: 11 }} fill={INK}>6 000</text>
          <text x={R.back.x0 - 34} y={(R.back.y0 + R.back.y1) / 2} textAnchor="middle" transform={`rotate(-90 ${R.back.x0 - 34} ${(R.back.y0 + R.back.y1) / 2})`} style={{ ...LABEL_STYLE, fontSize: 11 }} fill={INK}>3 200</text>
        </g>
      )}

      {/* ───────────── Inspectable details ───────────── */}
      {hotspots.map((h) => {
        const p = proj(h.u, h.v, h.d);
        const on = selected === h.id;
        return (
          <g
            key={h.id}
            role="button"
            tabIndex={0}
            aria-label={`Inspect detail ${h.n}: ${h.label}`}
            aria-pressed={on}
            onClick={() => onSelect?.(h.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(h.id); } }}
            className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-[5] [&:focus-visible>circle:first-child]:stroke-coral"
            style={{ transition: "transform .6s cubic-bezier(.22,.8,.3,1)" }}
          >
            <circle cx={p[0]} cy={p[1]} r="27" fill={on ? CORAL : WHITE} stroke={INK} strokeWidth="2.5" />
            <circle cx={p[0]} cy={p[1]} r="34" fill="none" stroke={INK} strokeOpacity=".3" strokeWidth="1.5" />
            <text x={p[0]} y={p[1] + 6} textAnchor="middle" style={{ fontFamily: "var(--font-josefin)", fontWeight: 700, fontSize: 20 }} fill={INK}>{h.n}</text>
          </g>
        );
      })}
    </g>
  );
}

export type { ReactNode };
