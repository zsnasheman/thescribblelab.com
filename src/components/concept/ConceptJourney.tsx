"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BUILT, OPENING, STEPS } from "@/content/concept";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { Scene } from "./Scene";

type Pose = { s: number; tx: number; ty: number; rx: number; rz: number; lift: number; plan: number; fill: number };
// Camera keyframes: [progress, pose]. tx/ty are fractions of the sheet width.
const DESK: [number, Pose][] = [
  [0, { s: 1.25, tx: 0.27, ty: -0.02, rx: 0, rz: 0, lift: 0, plan: 0, fill: 1 }],          // intimate: the mark, close
  [0.22, { s: 1.0, tx: 0.2, ty: 0, rx: 0, rz: 0, lift: 0, plan: 1, fill: 0.16 }],        // overhead: the plan
  [0.46, { s: 1.12, tx: 0.2, ty: 0.03, rx: 58, rz: -28, lift: 1, plan: 0.5, fill: 1 }],  // angled: volumes rise
  [0.68, { s: 2.9, tx: -0.55, ty: -0.27, rx: 0, rz: 0, lift: 1, plan: 0, fill: 1 }],    // swings square and arrives at the room
  [1, { s: 2.9, tx: -0.55, ty: -0.27, rx: 0, rz: 0, lift: 1, plan: 0, fill: 1 }],
];
const MOB: [number, Pose][] = [
  [0, { s: 1.15, tx: 0.05, ty: -0.3, rx: 0, rz: 0, lift: 0, plan: 0, fill: 1 }],
  [0.22, { s: 0.78, tx: 0, ty: -0.16, rx: 0, rz: 0, lift: 0, plan: 1, fill: 0.16 }],
  [0.46, { s: 0.88, tx: 0, ty: -0.12, rx: 58, rz: -28, lift: 1, plan: 0.5, fill: 1 }],
  [0.68, { s: 3.0, tx: -0.62, ty: -0.5, rx: 0, rz: 0, lift: 1, plan: 0, fill: 1 }],
  [1, { s: 3.0, tx: -0.62, ty: -0.5, rx: 0, rz: 0, lift: 1, plan: 0, fill: 1 }],
];
const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
function poseAt(keys: [number, Pose][], p: number): Pose {
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, pa] = keys[i], [b, pb] = keys[i + 1];
    if (p <= b) {
      const t = ease(clamp((p - a) / (b - a)));
      const o = {} as Pose;
      (Object.keys(pa) as (keyof Pose)[]).forEach((k) => { o[k] = pa[k] + (pb[k] - pa[k]) * t; });
      return o;
    }
  }
  return keys[keys.length - 1][1];
}
const vars = (o: Pose) => ({ "--s": o.s, "--tx": o.tx, "--ty": o.ty, "--rx": o.rx, "--rz": o.rz, "--lift": o.lift, "--plan": o.plan, "--fill": o.fill }) as React.CSSProperties;
/** Moments on the scroll: where each counter phrase and each text step begins. */
const MARK = { sketch: 0.2, form: 0.44, built: 0.68, result: 0.9 };

function Headline() {
  return (
    <h1 className="cond text-[clamp(2.3rem,1rem+4.4vw,5.6rem)] !leading-[.94] text-indigo">
      {OPENING.headline.map((l) => <span key={l} className="block">{l}</span>)}
    </h1>
  );
}

export function ConceptJourney() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const room = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const el = root.current, st = stage.current, rg = rig.current, rm = room.current, ph = photo.current;
    if (!el || !st || !rg || !rm || !ph || reduced) return;
    let raf = 0, last = -1;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, el.offsetHeight - window.innerHeight));
      const keys = window.innerWidth < 768 ? MOB : DESK;
      const o = poseAt(keys, p);
      const w = st.querySelector<HTMLElement>(".concept-world")!;
      Object.entries({ "--s": o.s, "--tx": o.tx, "--ty": o.ty, "--rx": o.rx, "--rz": o.rz, "--lift": o.lift, "--plan": o.plan, "--fill": o.fill }).forEach(([k, v]) => w.style.setProperty(k, String(v)));
      // the built room opens: its footprint grows until the photograph fills the frame
      const q = ease(clamp((p - 0.7) / 0.2));
      const win = clamp((p - 0.62) / 0.06);
      const sr = st.getBoundingClientRect(), rr = rm.getBoundingClientRect();
      const t = Math.max(0, rr.top - sr.top) * (1 - q), l = Math.max(0, rr.left - sr.left) * (1 - q);
      const b = Math.max(0, sr.bottom - rr.bottom) * (1 - q), ri = Math.max(0, sr.right - rr.right) * (1 - q);
      ph.style.clipPath = `inset(${t}px ${ri}px ${b}px ${l}px round ${14 * (1 - q)}px)`;
      ph.style.opacity = String(p < 0.62 ? 0 : Math.max(win, q));
      const s = p < MARK.sketch ? -1 : p < MARK.form ? 0 : p < MARK.built ? 1 : p < MARK.result ? 2 : 3;
      if (s !== last) { last = s; setStep(s); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on); apply();
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [reduced]);

  const Cta = (
    <div className="mt-4 flex flex-wrap gap-2 md:mt-6 md:gap-3">
      <a href="#projects" className="btn btn-coral md:btn-lg">Explore work</a>
      <Link href="/start-a-project" className="btn btn-outline md:btn-lg">Start a project</Link>
    </div>
  );

  if (reduced) {
    const frames = [
      { pose: DESK[0][1], title: null as string | null, body: OPENING.sub },
      { pose: DESK[1][1], title: STEPS[0].title, body: STEPS[0].body, n: STEPS[0].n },
      { pose: DESK[2][1], title: STEPS[1].title, body: STEPS[1].body, n: STEPS[1].n },
    ];
    return (
      <div className="dashes bg-white pb-16" data-counter="idea">
        <section className="container-x pt-44"><p className="t-label text-lavender">{OPENING.eyebrow}</p><Headline />{Cta}</section>
        {frames.map((f, i) => (
          <section key={i} className="container-x mt-12" aria-label={f.title ?? "The idea"} data-counter={(["idea", "sketch", "form"] as const)[i]}>
            <div className="relative h-[58svh] overflow-hidden rounded-3xl bg-white/70"><Scene style={vars(f.pose)} /></div>
            <p className="cond mt-4 text-3xl text-indigo">{"n" in f ? `${f.n} ` : ""}{f.title ?? "An idea"}</p><p className="text-indigo-80">{f.body}</p>
          </section>
        ))}
        <section className="container-x mt-12" data-counter="built">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BUILT.image.src} width={BUILT.image.w} height={BUILT.image.h} alt={BUILT.alt} className="w-full rounded-3xl" />
          <p className="cond mt-4 text-3xl text-indigo">{STEPS[2].n} {STEPS[2].title}</p><p className="text-indigo-80">{STEPS[2].body}</p>
        </section>
      </div>
    );
  }

  const text = "pointer-events-none absolute z-20 transition-[opacity,transform] duration-500 ease-out";
  const show = (on: boolean) => (on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4");
  return (
    <div ref={root} className="relative" style={{ height: "720svh" }} data-journey>
      {(["idea", "sketch", "form", "built"] as const).map((k, i) => {
        const a = [0, MARK.sketch, MARK.form, MARK.built][i], b = [MARK.sketch, MARK.form, MARK.built, 1][i];
        return <div key={k} aria-hidden="true" data-counter={k} className="pointer-events-none absolute inset-x-0" style={{ top: `${a * 100}%`, height: `${(b - a) * 100}%` }} />;
      })}
      <div ref={stage} className="dashes sticky top-0 h-[100svh] overflow-hidden bg-white">
        <Scene rigRef={rig} roomRef={room} style={vars(DESK[0][1])} />
        {/* the built result */}
        <div ref={photo} className="pointer-events-none absolute inset-0 z-10" style={{ opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BUILT.image.src} width={BUILT.image.w} height={BUILT.image.h} alt="" className="h-full w-full object-cover object-[60%_65%]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-indigo/85 to-transparent" />
        </div>
        {/* opening */}
        <div className={`${text} left-[5vw] right-[5vw] bottom-[6.2rem] md:right-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 ${step === -1 ? "pointer-events-auto opacity-100" : "opacity-0 -translate-y-6"}`} aria-hidden={step !== -1}>
          <p className="t-label text-lavender">{OPENING.eyebrow}</p>
          <div className="mt-3 rounded-2xl bg-white/90 p-4 md:max-w-[46vw]"><Headline /><p className="mt-3 max-w-[38ch] text-indigo-80 max-md:hidden">{OPENING.sub}</p>{Cta}</div>
        </div>
        {/* steps */}
        {STEPS.map((s, i) => (
          <div key={s.key} className={`${text} left-[5vw] right-[5vw] bottom-[6.2rem] md:right-auto md:bottom-auto md:top-1/2 md:max-w-[26vw] md:-translate-y-1/2 ${i === 2 ? "" : ""} ${show(step === i)} ${i === 2 && step === 2 ? "!text-white" : ""}`} aria-hidden={step !== i}>
            <div className={`rounded-2xl p-4 ${i === 2 ? "bg-indigo text-white" : "bg-white/92 text-indigo"}`}>
              <p className="cap text-coral">{s.n}</p>
              <p className="cond mt-1 text-[clamp(1.9rem,1rem+2.2vw,3.2rem)]">{s.title}</p>
              <p className={`mt-2 ${i === 2 ? "text-white/85" : "text-indigo-80"}`}>{s.body}</p>
            </div>
          </div>
        ))}
        <div className={`${text} inset-x-[5vw] bottom-[6.2rem] z-20 text-white md:bottom-[7rem] ${show(step === 3)} ${step === 3 ? "pointer-events-auto" : ""}`} aria-hidden={step !== 3}>
          <p className="cap">03 · Built</p>
          <p className="cond text-[clamp(2.2rem,1rem+4vw,5rem)] !leading-none">{BUILT.caption}</p>
          <Link href={`/work/${BUILT.slug}`} className="btn btn-coral mt-3" tabIndex={step === 3 ? 0 : -1}>View project</Link>
        </div>
        <a href="#projects" className="absolute right-[4vw] top-[11rem] z-30 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-indigo no-underline shadow md:bottom-7 md:top-auto">Skip to projects ↓</a>
      </div>
      {/* screen-reader order of the story */}
      <ol className="sr-only"><li>{OPENING.headline.join(" ")}</li>{STEPS.map((s) => <li key={s.key}>{s.title}. {s.body}</li>)}<li>{BUILT.caption}</li></ol>
    </div>
  );
}
