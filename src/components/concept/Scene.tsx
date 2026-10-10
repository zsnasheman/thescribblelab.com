import type { CSSProperties, Ref } from "react";

/** The one world the camera moves through: a sheet (the floor) carrying the logo-inspired mark, the plan drawn over it, and the volumes that rise from it. */

const COUNT = 7;
const PATHS = {
  coral: "M590 240 C640 215 760 300 820 340 C850 365 800 400 810 440 C830 480 790 540 740 560 C690 580 650 540 640 470 C630 400 580 330 590 240 Z",
  indigo: "M150 300 C140 230 200 215 270 225 C330 232 360 270 410 265 C460 262 480 230 500 190 C505 120 540 90 600 90 C680 90 720 120 790 100 C850 85 880 130 860 175 C840 215 760 215 680 222 C640 226 610 250 620 300 C640 380 690 440 690 520 C690 600 620 660 560 690 C500 710 470 670 440 620 C400 560 330 520 250 490 C170 460 155 380 150 300 Z",
  mustard: "M40 330 C90 320 130 350 200 375 C260 395 330 410 370 450 C400 500 440 540 470 590 C440 620 360 600 300 580 C240 550 190 500 150 440 C110 400 60 380 40 330 Z",
};
const SCRIBBLE = "M240 385 L275 372 L290 395 L320 365 L345 400 L370 340 C395 300 420 330 410 380 C405 420 380 440 365 400 C350 350 380 300 420 330 C440 345 440 400 425 425 C410 440 385 430 375 395 C370 360 400 320 440 325 L470 322";

function Slab({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      {Array.from({ length: COUNT }, (_, i) => (
        <svg key={i} viewBox="0 0 1000 750" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" style={{ transform: `translateZ(calc(var(--lift) * var(--W) * ${0.0105 * i}))`, opacity: "var(--fill)" }}>
          <path d={d} fill={fill} stroke="none" />
        </svg>
      ))}
    </>
  );
}

export function Scene({ rigRef, roomRef, style, className = "" }: { rigRef?: Ref<HTMLDivElement>; roomRef?: Ref<HTMLDivElement>; style?: CSSProperties; className?: string }) {
  return (
    <div className={`concept-world ${className}`} style={style} aria-hidden="true">
      <div ref={rigRef} className="concept-rig">
        {/* sheet */}
        <div className="absolute inset-0 rounded-[2.2%] bg-white shadow-[0_30px_80px_rgba(47,32,88,.18)] ring-1 ring-indigo/10" />
        <div className="dashes absolute inset-0 rounded-[2.2%] opacity-60" />
        {/* plan: drawn over the mark */}
        <svg viewBox="0 0 1000 750" className="absolute inset-0 h-full w-full" style={{ opacity: "var(--plan)", transform: "translateZ(1px)" }}>
          <g fill="none" stroke="#2f2058" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" pathLength={1}>
            <path d="M70 70 H930 V680 H70 Z" strokeDasharray="14 8" />
            <path d="M520 70 V250 M70 360 H300 M780 250 H930 M300 680 V560" />
            <path d="M520 250 a60 60 0 0 1 60 60" strokeWidth="1.6" /><path d="M300 560 a60 60 0 0 0 -60 -60" strokeWidth="1.6" />
            <path d="M70 710 H930 M70 700 V720 M930 700 V720" strokeWidth="1.4" />
          </g>
        </svg>
        {/* the mark's volumes */}
        <Slab d={PATHS.mustard} fill="url(#stripes)" />
        <Slab d={PATHS.coral} fill="#ff663e" />
        <Slab d={PATHS.indigo} fill="#2f2058" />
        <svg viewBox="0 0 1000 750" className="absolute inset-0 h-full w-full overflow-visible" style={{ transform: "translateZ(calc(var(--lift) * var(--W) * 0.075))" }}>
          <defs><pattern id="stripes" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)"><rect width="34" height="34" fill="#fff" /><rect width="17" height="34" fill="#d99a12" /></pattern></defs>
          <g fill="#6b5291"><circle cx="345" cy="215" r="22" /><circle cx="415" cy="205" r="35" /><circle cx="478" cy="188" r="18" /><circle cx="440" cy="155" r="12" /></g>
          <circle cx="372" cy="155" r="22" fill="#1e9e74" />
          <path d={SCRIBBLE} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" className="concept-scribble" />
        </svg>
        {/* the room the camera is heading for */}
        <div ref={roomRef} className="absolute rounded-[1.2%] border-2 border-dashed border-indigo/70 bg-white/60" style={{ left: "61%", top: "58%", width: "26%", height: "29%", transform: "translateZ(calc(var(--lift) * var(--W) * 0.075))" }} />
      </div>
    </div>
  );
}
