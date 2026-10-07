import Link from "next/link";
import { Patch } from "./Cutout";
import { Slide } from "./Slide";
import { Arrow } from "./ui";
import { WHY } from "@/content/showcase";
import { PORTFOLIO } from "@/content/portfolio";

const NAVY = "#2f2058", CORAL = "#ff663e", LAV = "#6b5291", MINT = "#bfe8da", PINK = "#ffe0d8", MUSTARD = "#d99a12";

/** 1. White opening: big condensed headline between curved colour blocks (the logo's language of blobs and block colour). */
export function SlideHero() {
  return (
    <section aria-labelledby="hero-h" data-hero className="slide bg-white">
      <Patch shape="blob-a" color={PINK} className="-left-[12%] -top-[14%] h-[62%] w-[44%]" />
      <Patch shape="blob-c" color={NAVY} className="-bottom-[34%] -left-[10%] h-[50%] w-[80%]" />
      <Patch shape="blob-b" color={MUSTARD} className="-bottom-[10%] -right-[10%] h-[70%] w-[30%] rotate-[18deg]" />
      <Patch shape="circle" color={CORAL} className="right-[14%] top-[16%] h-[7vmin] w-[7vmin]" />
      <div className="container-x relative z-10 pb-20 pt-masthead">
        <h1 id="hero-h">
          <span className="cond block text-[clamp(3rem,0.5rem+8.4vw,9rem)] text-[#333]">We design &amp; build spaces</span>
          <span className="cond-light mt-3 block text-[clamp(1.6rem,0.8rem+2.4vw,3rem)] text-[#333]">that people remember</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[34rem] text-lg text-indigo-80">Interiors, exhibitions, events, brand activations and kinetic windows. We concept. We build. We leave a mark.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/work" className="btn btn-coral btn-lg">Explore our work <Arrow /></Link>
          <Link href="/start-a-project" className="btn btn-outline btn-lg bg-white">Start a project</Link>
        </div>
      </div>
    </section>
  );
}

/** 2. Full colour block statement. */
export function SlideCoral() {
  return (
    <section aria-labelledby="coral-h" className="slide bg-coral text-indigo">
      <Patch shape="blob-b" color={NAVY} className="-bottom-[26%] -left-[10%] h-[60%] w-[46%]" />
      <Patch shape="blob-c" color="#ffb08f" className="-right-[8%] -top-[18%] h-[60%] w-[44%]" />
      <Slide from="up" className="container-x relative z-10">
        <p className="cond-light text-[clamp(1.5rem,0.8rem+2.2vw,2.8rem)]">we start with a scribble</p>
        <h2 id="coral-h" className="cond mt-2 text-[clamp(2.8rem,0.6rem+8vw,9rem)]">Nothing gets built<br />without one</h2>
        <p className="mx-auto mt-6 max-w-[40rem] text-lg">The scribble always comes before the structure. We take ideas from napkin to reality: concepting, designing and building end to end so nothing gets lost in translation.</p>
      </Slide>
    </section>
  );
}

/** 3. Contour landscape with the studio line. */
export function SlideLandscape() {
  return (
    <section aria-labelledby="land-h" className="slide contours bg-white">
      <Slide from="up" className="container-x relative z-10 -mt-16">
        <h2 id="land-h" className="cond text-[clamp(2.4rem,0.6rem+6.4vw,7rem)] text-[#333]">Small scribbles.<br />Extraordinary spaces.</h2>
        <p className="cond-light mt-4 text-[clamp(1.2rem,0.8rem+1.2vw,2rem)] text-[#333]">A Dubai-based creative agency that concepts, builds and activates</p>
      </Slide>
    </section>
  );
}

/** 5. Words that move apart, with floating blobs. */
export function SlideFollows() {
  return (
    <section aria-labelledby="fol-h" className="slide contours bg-white">
      <Patch shape="blob-c" color={MINT} className="left-[6%] top-[4%] h-[30%] w-[32%]" />
      <Patch shape="blob-a" color={PINK} className="right-[8%] top-[26%] h-[26%] w-[20%] rotate-12" />
      <Patch shape="blob-b" color={MUSTARD} className="bottom-[16%] left-[18%] h-[28%] w-[22%] -rotate-12" />
      <h2 id="fol-h" className="cond relative z-10 text-[clamp(2.4rem,0.6rem+6.4vw,7rem)] text-indigo">
        <Slide from="left"><span className="block">Sketch</span></Slide>
        <Slide from="right" delay={120}><span className="cond-light block py-2 text-[clamp(1.2rem,0.8rem+1.4vw,2.2rem)] text-indigo-80 normal-case">becomes</span></Slide>
        <Slide from="left" delay={240}><span className="block text-right md:ml-[28vw] md:text-left">Structure</span></Slide>
      </h2>
    </section>
  );
}

/** 6. Lavender philosophy block with a navy curved base. */
export function SlideLavender() {
  return (
    <section aria-labelledby="lav-h" className="slide bg-lavender text-white on-dark">
      <Patch shape="blob-c" color={NAVY} className="-bottom-[30%] -right-[8%] h-[62%] w-[70%]" />
      <Patch shape="blob-b" color="#8a73b3" className="-left-[10%] -top-[22%] h-[56%] w-[34%]" />
      <Slide from="left" className="container-x relative z-10 text-left">
        <p id="lav-h" className="cond-light max-w-[24ch] text-[clamp(2rem,0.8rem+3.4vw,4.6rem)] !leading-[1.04]">We don’t hire people who colour inside the lines. We hire people who question why there are lines in the first place.</p>
        <p className="cond mt-6 text-[clamp(1.4rem,0.8rem+1.6vw,2.4rem)] text-[#ffe0d8]">We call ourselves Scribblers</p>
      </Slide>
    </section>
  );
}

/** 7. Facts from the studio's own portfolio, in outlined numerals. */
export function SlideStats() {
  const places = new Set(PORTFOLIO.flatMap((p) => p.where.split(",").slice(-1).map((x) => x.trim()).filter(Boolean)));
  const stats = [
    { n: String(PORTFOLIO.length), l: "Projects in this portfolio" },
    { n: "8", l: "Disciplines, from events to residential" },
    { n: "2021", l: "Studio established, December" },
    { n: "UAE · KSA · Qatar", l: "Where the work has been built or shown", small: true },
  ];
  void places;
  return (
    <section aria-label="The studio in numbers" className="relative bg-white py-20 md:py-28">
      <div className="container-x">
        <dl className="grid gap-x-12 gap-y-10 border-b border-indigo/20 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Slide key={s.l} from="up" delay={i * 90}>
              <div><dd className={`num-outline ${s.small ? "text-[clamp(2rem,1rem+2.4vw,3.2rem)]" : "text-[clamp(3.4rem,1.6rem+5vw,6.5rem)]"}`}>{s.n}</dd><dt className="cond mt-3 text-xl text-indigo">{s.l}</dt></div>
            </Slide>
          ))}
        </dl>
        <ul className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Slide key={w.t} from="up" delay={i * 90}><li className="list-none"><p className="cond text-2xl text-indigo">{w.t}</p><p className="mt-2 text-indigo-80">{w.d}</p></li></Slide>
          ))}
        </ul>
      </div>
    </section>
  );
}
