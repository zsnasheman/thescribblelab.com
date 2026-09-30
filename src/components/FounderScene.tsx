"use client";

/**
 * Roots become practice: one illustration that gains detail as the story advances.
 * 0 roots (hand-drawn ridge line, tiered timber roof, lattice screen, chinar leaves)
 * 1 professional practice (the architectural sketch grows behind it)
 * 2 founding the studio (the sketch is painted in; a material board sits on the desk)
 * 3 future direction (faint, unlabelled forms beyond the skyline: an ambition, not offices)
 * stage -1 draws everything, for reduced motion and for the static homepage use.
 */
export type FounderStage = -1 | 0 | 1 | 2 | 3;

const INK = "#2f2058";

function Leaf({ x, y, r, rot = 0 }: { x: number; y: number; r: number; rot?: number }) {
  const pts: string[] = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 4 === 0 ? r : i % 2 === 0 ? r * 0.55 : r * 0.82;
    pts.push(`${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr * 0.92).toFixed(1)}`);
  }
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <polygon points={pts.join(" ")} fill="#ff663e" fillOpacity=".92" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      <path d={`M${x} ${y - r * 0.6}V${y + r * 1.2}`} stroke={INK} strokeWidth="1" />
    </g>
  );
}

function Roots() {
  return (
    <svg viewBox="0 0 260 240" className="block h-full w-full" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M0 150 38 100 60 120 104 52 150 124 178 94 260 162" />
      <path d="M0 162 30 128 52 140 92 92 128 138" strokeOpacity=".55" />
      <path d="M104 52 96 74 104 70 112 82 108 62M178 94 172 108 180 104 186 114" strokeOpacity=".7" />
      <path d="M24 122l8 14M44 112l6 12M92 96l-6 18M112 96l6 18M150 124l-8 16M164 112l8 12" strokeOpacity=".4" />
      {/* lake */}
      <path d="M8 196H252M26 206H230M52 216H206M84 226H176" strokeOpacity=".4" strokeDasharray="14 7" />
      {/* tiered timber roof */}
      <path d="M86 170Q150 158 214 170L202 150Q150 142 98 150Z" fill="#6b5291" fillOpacity=".9" />
      <path d="M108 150Q150 140 192 150L182 134Q150 128 118 134Z" fill="#6b5291" fillOpacity=".9" />
      <path d="M126 134Q150 126 174 134L166 120Q150 116 134 120Z" fill="#2f2058" fillOpacity=".92" />
      <path d="M150 118V94M146 96h8" />
      <path d="M102 170V192M126 170V192M150 170V192M174 170V192M198 170V192" />
      <path d="M126 176 150 192M150 176 126 192M150 176 174 192M174 176 150 192M126 180h48" strokeOpacity=".6" />
      <path d="M96 192H204" strokeWidth="1.8" />
      <Leaf x={36} y={64} r={12} rot={-14} />
      <Leaf x={58} y={38} r={8} rot={20} />
      <Leaf x={222} y={44} r={10} rot={10} />
    </svg>
  );
}

function Future() {
  return (
    <svg viewBox="0 0 200 180" className="block h-full w-full" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round" aria-hidden="true">
      <path d="M8 170V96L26 84V58L44 46V170M56 170V112H82V170M94 170V70L108 56V20L118 8 128 20V56L142 70V170M154 170V104L176 90V170" />
      <path d="M26 96h18M26 112h18M26 128h18M70 130h12M108 80h20M108 100h20M108 120h20" strokeOpacity=".5" />
      <path d="M0 176C60 168 120 164 200 150" stroke="#ff663e" strokeWidth="2" strokeDasharray="1 7" />
    </svg>
  );
}

const fade = (on: boolean, extra = ""): React.CSSProperties => ({ opacity: on ? 1 : 0, transition: "opacity .9s cubic-bezier(.22,.8,.3,1), transform .9s cubic-bezier(.22,.8,.3,1)", transform: `${extra}${on ? "" : " translateY(10px)"}`.trim() || undefined });

export function FounderScene({ stage, className = "" }: { stage: FounderStage; className?: string }) {
  const s = stage === -1 ? 9 : stage;
  return (
    <div className={`blob blob-2 relative isolate aspect-[4/5] w-full overflow-hidden ${className}`} role="img"
      aria-label="Illustration: a Kashmir-inspired timber roof and lattice screen, a drawn sketch of a pavilion growing behind them, then painted in, with faint unlabelled forms beyond the skyline. An interpretation, not a biography.">
      {/* lavender plaster field */}
      <div aria-hidden="true" className="absolute inset-0 bg-lavender-20/60" />
      <div aria-hidden="true" className="blob blob-1 absolute -left-[8%] top-[34%] h-[70%] w-[96%]" style={{ backgroundImage: "url(/art/t-wash.webp)", opacity: 0.85 }} />
      <div aria-hidden="true" className="blob blob-3 absolute -right-[6%] top-[2%] h-[26%] w-[62%] opacity-50" style={{ backgroundImage: "url(/art/t-wash.webp)" }} />

      {/* 1 practice: the sketch */}
      <div aria-hidden="true" className="art-stack absolute -right-[30%] bottom-[2%] w-[150%]" style={fade(s >= 1)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/hero-ink.webp" alt="" width={884} height={744} loading="lazy" />
      </div>
      {/* 2 founding: painted in */}
      <div aria-hidden="true" className="art-stack absolute -right-[30%] bottom-[2%] w-[150%]">
        <div className="wipe" data-on={s >= 2} style={{ opacity: s >= 2 ? 1 : 0, transition: "opacity .4s" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art/hero.webp" alt="" width={884} height={744} loading="lazy" />
        </div>
      </div>
      <div aria-hidden="true" className="art-stack absolute -bottom-[1%] left-[2%] w-[56%]" style={fade(s >= 2, "rotate(-3deg)")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/v-interiors.webp" alt="" width={596} height={404} loading="lazy" />
      </div>

      {/* 0 roots */}
      <div aria-hidden="true" className="absolute left-[2%] top-[2%] h-[52%] w-[66%]" style={fade(true)}><Roots /></div>
      <div aria-hidden="true" className="absolute left-[6%] top-[46%] aspect-square w-[30%] overflow-hidden rounded-full border-2 border-indigo shadow-[0_6px_18px_rgba(47,32,88,.25)]"
        style={{ backgroundImage: "url(/art/hero.webp)", backgroundSize: "310%", backgroundPosition: "47.6% 12.7%", ...fade(s >= 0) }} />

      {/* 3 future: faint, unlabelled */}
      <div aria-hidden="true" className="absolute right-[2%] top-[6%] h-[30%] w-[38%]" style={{ opacity: s >= 3 ? 0.75 : 0, transition: "opacity 1.2s" }}><Future /></div>
    </div>
  );
}
