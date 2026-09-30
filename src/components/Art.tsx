import { useId } from "react";
import { C } from "@/lib/colors";
import type { ArtTone, ArtVariant } from "@/content/types";

/**
 * Honest, original illustrations drawn in code. Used for demo concepts,
 * service tiles and the process visuals until approved photography exists.
 * They are never presented as completed projects.
 */
type Palette = { bg: string; floor: string; panel: string; accent: string; line: string; soft: string };

const tones: Record<ArtTone, Palette> = {
  indigo: { bg: C.indigo, floor: "#231746", panel: C.lavender, accent: C.coral, line: "#FFFFFF", soft: "#4a3b78" },
  coral: { bg: C.coral, floor: "#e6552f", panel: C.indigo, accent: C.paper, line: C.indigo, soft: "#ff8563" },
  lavender: { bg: C.lavender, floor: "#58417b", panel: C.indigo, accent: C.coral, line: "#FFFFFF", soft: "#8a72b0" },
  paper: { bg: C.paper, floor: "#e7e1ef", panel: C.indigo, accent: C.coral, line: C.indigo, soft: "#ddd5ea" },
};

export function Art({
  variant,
  tone,
  label,
  className,
}: {
  variant: ArtVariant;
  tone: ArtTone;
  label: string;
  className?: string;
}) {
  const p = tones[tone];
  const id = useId();
  const stripe = `${id}-s`;
  const common = (
    <defs>
      <pattern id={stripe} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
        <rect width="12" height="12" fill="#fff" />
        <rect width="12" height="6" fill={C.mustard} />
      </pattern>
    </defs>
  );
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label={label}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      {common}
      <rect width="400" height="300" fill={p.bg} />
      {variant === "lounge" && <Lounge p={p} />}
      {variant === "stand" && <Stand p={p} stripe={stripe} />}
      {variant === "launch" && <Launch p={p} />}
      {variant === "popup" && <Popup p={p} stripe={stripe} />}
      {variant === "window" && <WindowArt p={p} />}
      {variant === "villa" && <Villa p={p} stripe={stripe} />}
    </svg>
  );
}

function Lounge({ p }: { p: Palette }) {
  return (
    <g>
      <rect y="228" width="400" height="72" fill={p.floor} />
      {/* arched opening to courtyard light */}
      <path d="M130 228V120a70 70 0 0 1 140 0v108Z" fill={C.paper} />
      <circle cx="230" cy="112" r="16" fill={C.mustard} />
      <path d="M130 228V120a70 70 0 0 1 140 0v108" fill="none" stroke={p.line} strokeWidth="3" opacity=".6" />
      {/* coral feature panel */}
      <rect x="296" y="46" width="76" height="182" rx="2" fill={p.accent} />
      <rect x="296" y="46" width="76" height="182" rx="2" fill="none" stroke={p.line} strokeWidth="1.5" opacity=".4" />
      {/* sofa */}
      <rect x="28" y="182" width="120" height="46" rx="12" fill={p.panel} />
      <rect x="28" y="168" width="120" height="26" rx="10" fill={p.panel} />
      <rect x="40" y="196" width="96" height="14" rx="6" fill={p.soft} opacity=".8" />
      {/* pendant */}
      <line x1="88" y1="0" x2="88" y2="96" stroke={p.line} strokeWidth="2" />
      <path d="M68 118a20 20 0 0 1 40 0Z" fill={C.mustard} />
      {/* planter */}
      <rect x="262" y="206" width="22" height="22" rx="3" fill={p.panel} />
      <circle cx="273" cy="198" r="13" fill={C.emerald} />
    </g>
  );
}

function Stand({ p, stripe }: { p: Palette; stripe: string }) {
  return (
    <g>
      <rect y="236" width="400" height="64" fill={p.floor} />
      {/* fascia */}
      <rect x="92" y="34" width="216" height="64" fill={p.panel} />
      <rect x="92" y="84" width="216" height="14" fill={`url(#${stripe})`} />
      {/* columns and loft */}
      <rect x="100" y="98" width="10" height="138" fill={p.line} opacity=".85" />
      <rect x="290" y="98" width="10" height="138" fill={p.line} opacity=".85" />
      <rect x="92" y="136" width="216" height="8" fill={p.line} opacity=".85" />
      <rect x="120" y="108" width="60" height="28" fill={p.accent} />
      {/* reception counter */}
      <rect x="170" y="196" width="100" height="40" rx="3" fill={C.emerald} />
      {/* plinths */}
      <rect x="40" y="200" width="36" height="36" fill={p.soft} />
      <rect x="326" y="190" width="36" height="46" fill={p.soft} />
      <circle cx="58" cy="188" r="10" fill={p.accent} />
      <rect x="337" y="170" width="14" height="20" fill={p.accent} />
    </g>
  );
}

function Launch({ p }: { p: Palette }) {
  return (
    <g>
      <rect y="250" width="400" height="50" fill={p.floor} />
      {/* spotlight */}
      <polygon points="200,0 120,236 280,236" fill={C.paper} opacity=".22" />
      {/* truss frame */}
      <rect x="72" y="36" width="256" height="200" fill="none" stroke={p.line} strokeWidth="5" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M${72 + i * 32} 36l16 14 16-14`} fill="none" stroke={p.line} strokeWidth="2" opacity=".7" />
      ))}
      {/* stage and plinth */}
      <rect x="40" y="236" width="320" height="22" fill={p.soft} />
      <rect x="168" y="178" width="64" height="58" fill={p.accent} />
      <circle cx="200" cy="158" r="18" fill={C.paper} />
      {/* audience */}
      {[30, 74, 118, 162, 206, 250, 294, 338].map((x, i) => (
        <circle key={x} cx={x + 8} cy={282 + (i % 2) * 4} r="11" fill={i === 5 ? C.emerald : p.panel} />
      ))}
    </g>
  );
}

function Popup({ p, stripe }: { p: Palette; stripe: string }) {
  return (
    <g>
      <rect y="230" width="400" height="70" fill={p.floor} />
      {/* canopy */}
      <path d="M80 92h240l-24-50H104Z" fill={`url(#${stripe})`} />
      <rect x="80" y="92" width="240" height="8" fill={p.panel} />
      {/* modules */}
      <rect x="92" y="100" width="108" height="130" fill={p.panel} />
      <rect x="200" y="100" width="108" height="130" fill={p.soft} />
      <rect x="110" y="126" width="72" height="34" fill={p.accent} />
      <rect x="222" y="168" width="64" height="62" fill={p.panel} />
      <circle cx="254" cy="138" r="14" fill={C.paper} />
      {/* people */}
      <circle cx="44" cy="206" r="10" fill={p.panel} />
      <rect x="34" y="216" width="20" height="36" rx="10" fill={p.panel} />
      <circle cx="354" cy="200" r="10" fill={C.emerald} />
      <rect x="344" y="210" width="20" height="42" rx="10" fill={C.emerald} />
    </g>
  );
}

function WindowArt({ p }: { p: Palette }) {
  return (
    <g>
      <rect y="236" width="400" height="64" fill={p.floor} />
      <rect x="56" y="24" width="288" height="212" fill={C.paper} opacity=".14" />
      {/* rails */}
      <rect x="64" y="64" width="272" height="4" fill={p.line} opacity=".7" />
      <rect x="64" y="150" width="272" height="4" fill={p.line} opacity=".7" />
      {/* panels */}
      <rect x="90" y="68" width="82" height="76" fill={p.accent} />
      <rect x="220" y="158" width="92" height="70" fill={p.panel} />
      <rect x="220" y="158" width="92" height="70" fill="none" stroke={p.line} strokeWidth="1.5" opacity=".4" />
      {/* pendant disc */}
      <line x1="200" y1="24" x2="200" y2="96" stroke={p.line} strokeWidth="2" />
      <circle cx="200" cy="108" r="22" fill={C.mustard} />
      {/* glazing frame */}
      <rect x="56" y="24" width="288" height="212" fill="none" stroke={p.line} strokeWidth="4" />
    </g>
  );
}

function Villa({ p, stripe }: { p: Palette; stripe: string }) {
  return (
    <g>
      <rect y="224" width="400" height="76" fill={p.floor} />
      {[...Array(14)].map((_, i) => (
        <circle key={i} cx={20 + i * 28 + (i % 3) * 6} cy={244 + (i % 4) * 14} r={2 + (i % 3)} fill={C.paper} opacity=".35" />
      ))}
      {/* door arch with courtyard */}
      <path d="M250 224V110a54 54 0 0 1 108 0v114Z" fill={C.paper} />
      <rect x="250" y="150" width="108" height="10" fill={`url(#${stripe})`} />
      {/* bench */}
      <rect x="40" y="196" width="170" height="14" rx="3" fill={p.panel} />
      <rect x="52" y="210" width="10" height="18" fill={p.panel} />
      <rect x="188" y="210" width="10" height="18" fill={p.panel} />
      {/* pendant */}
      <line x1="126" y1="0" x2="126" y2="74" stroke={p.line} strokeWidth="2" />
      <path d="M100 100a26 26 0 0 1 52 0Z" fill={C.mustard} />
      {/* planter */}
      <rect x="216" y="198" width="22" height="30" rx="3" fill={p.accent} />
      <circle cx="227" cy="186" r="14" fill={C.emerald} />
    </g>
  );
}
