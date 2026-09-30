import { C } from "@/lib/colors";
import { Art } from "./Art";
import type { ProcessStage } from "@/content/types";

/** Five honest illustrations, one per stage. They show the kind of thing each stage produces. */
export function ProcessVisual({ id, label }: { id: ProcessStage["id"]; label: string }) {
  if (id === "handover") {
    return <Art variant="villa" tone="lavender" label={label} className="aspect-[4/3] w-full rounded-sm" />;
  }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className="aspect-[4/3] w-full rounded-sm">
      <rect width="400" height="300" fill={C.paper} />
      <pattern id={`d-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill={C.indigo} opacity=".18" />
      </pattern>
      <rect width="400" height="300" fill={`url(#d-${id})`} />
      {id === "listen" && (
        <g>
          <rect x="60" y="34" width="210" height="236" rx="6" fill="#fff" stroke={C.indigo} strokeWidth="2" />
          {[76, 100, 124, 148, 172, 196].map((y, i) => (
            <line key={y} x1="82" y1={y} x2={i === 2 ? 190 : 248} y2={y} stroke={C.indigo} strokeWidth="2" opacity=".35" strokeLinecap="round" />
          ))}
          <path d="M82 226h120M82 220v12M202 220v12" stroke={C.indigo} strokeWidth="2" fill="none" />
          <text x="142" y="250" textAnchor="middle" fontSize="12" fill={C.indigo} style={{ fontFamily: "var(--font-figtree)" }}>6 400 mm</text>
          <rect x="230" y="120" width="110" height="80" fill={C.coral} transform="rotate(4 285 160)" />
          <line x1="246" y1="146" x2="320" y2="150" stroke={C.indigo} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="246" y1="168" x2="300" y2="171" stroke={C.indigo} strokeWidth="2.5" strokeLinecap="round" />
          <rect x="300" y="44" width="14" height="110" rx="2" fill={C.mustard} transform="rotate(24 307 99)" />
        </g>
      )}
      {id === "sketch" && (
        <g fill="none" stroke={C.indigo} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 40h180v120H40zM120 40v50M40 100h80M150 160v-28h40" />
          <path d="M60 210V300M60 230h160V300M140 230v70" opacity=".9" />
          <path d="M240 60h120v70M240 60v200h120" strokeDasharray="6 5" opacity=".6" />
          <path d="M240 280h120M240 272v16M360 272v16" strokeWidth="1.4" />
          <circle cx="300" cy="170" r="22" />
          <path d="M254 232a48 48 0 0 1 92 0" />
        </g>
      )}
      {id === "develop" && (
        <g>
          <circle cx="110" cy="110" r="58" fill={C.lavender} />
          <rect x="190" y="52" width="84" height="116" fill={C.coral} />
          <path d="M296 70c20-14 66-8 76 24 8 26-14 52-50 54-34 2-50-26-40-48 4-12 8-20 14-30Z" fill={C.indigo} />
          <pattern id="sw-stripe" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
            <rect width="14" height="14" fill="#fff" /><rect width="14" height="7" fill={C.mustard} />
          </pattern>
          <path d="M48 196c8-18 52-26 88-14 28 10 30 38 6 52-30 18-84 14-100-6-6-8-6-20 6-32Z" fill="url(#sw-stripe)" />
          <rect x="170" y="196" width="88" height="60" rx="4" fill="#ece6f4" />
          {[[190, 214, 4], [214, 226, 3], [238, 210, 5], [226, 240, 3], [196, 242, 2.5]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={[C.lavender, C.coral, C.indigo, C.mustard, C.indigo][i]} />
          ))}
          <rect x="284" y="186" width="80" height="10" rx="2" fill={C.indigo} opacity=".25" />
          <rect x="284" y="206" width="56" height="10" rx="2" fill={C.indigo} opacity=".25" />
          <rect x="284" y="226" width="68" height="10" rx="2" fill={C.indigo} opacity=".25" />
        </g>
      )}
      {id === "build" && (
        <g>
          <rect x="30" y="210" width="340" height="18" fill={C.indigo} />
          <rect x="44" y="228" width="12" height="60" fill={C.indigo} />
          <rect x="344" y="228" width="12" height="60" fill={C.indigo} />
          <rect x="60" y="92" width="210" height="118" fill={C.lavender} />
          <rect x="60" y="92" width="210" height="118" fill="none" stroke={C.indigo} strokeWidth="2" />
          {[84, 130, 176, 222].map((x) => (
            <g key={x}><circle cx={x + 12} cy="116" r="5" fill={C.paper} /><circle cx={x + 12} cy="186" r="5" fill={C.paper} /></g>
          ))}
          <rect x="280" y="112" width="36" height="98" fill={C.coral} />
          <rect x="280" y="100" width="58" height="12" fill={C.indigo} />
          <rect x="286" y="60" width="10" height="44" fill={C.indigo} />
          <path d="M60 70h210M60 62v16M270 62v16" stroke={C.indigo} strokeWidth="2" fill="none" />
          <text x="165" y="58" textAnchor="middle" fontSize="12" fill={C.indigo} style={{ fontFamily: "var(--font-figtree)" }}>2 400</text>
        </g>
      )}
    </svg>
  );
}
