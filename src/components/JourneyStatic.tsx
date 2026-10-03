import Link from "next/link";
import { Arrow } from "./ui";
import type { Featured } from "@/content/featured";

/** The same story as the scroll journey, as an ordinary page: for reduced motion, no JavaScript and print. */
export function JourneyStatic({ featured }: { featured: Featured }) {
  return (
    <div className="journey-static">
      <section aria-labelledby="hero-h" className="relative overflow-hidden">
        <div className="container-x pb-8 pt-masthead">
          <h1 id="hero-h" className="t-hero"><span className="block">Small scribbles.</span><span className="block">Extraordinary spaces.</span></h1>
          <p className="t-lead mt-5 max-w-[34rem]">The Scribble Lab designs and builds creative spaces and experiences: interiors, exhibitions, events, brand activations and kinetic windows.</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"><Link href="/work" className="btn btn-indigo btn-lg">Explore our work <Arrow /></Link><a href="#breadth" className="draw-link py-2 font-semibold">Skip the story</a></div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/projects/reception-full.webp" width={2000} height={1000} alt="Design visual of a reception with a moss wall, a brass lattice screen and a navy front desk." className="w-full object-cover" />
      </section>
      <section aria-label="The idea and the material" className="container-x grid gap-10 py-12 md:py-20 lg:grid-cols-2">
        <div>
          <p className="t-label text-lavender">01 · The idea</p>
          <p className="t-h1 mt-3">It starts as a line.</p>
          <p className="t-lead mt-3 max-w-[34ch]">We follow that line from the first sketch until it can be built.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/projects/reception-ink.webp" width={1600} height={800} alt="A line drawing of the reception interior." loading="lazy" className="mt-6 w-full" />
        </div>
        <div>
          <p className="t-label text-lavender">02 · Material</p>
          <p className="t-h1 mt-3">Then it gets a surface.</p>
          <p className="t-lead mt-3 max-w-[34ch]">Colour, texture and light enter the drawing. Samples are chosen against the sketch, not after it.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/projects/reception-full.webp" width={2000} height={1000} alt="The same reception with timber, moss, brass and stone." loading="lazy" className="mt-6 w-full rounded-xl" />
          <ul className="mt-4 flex gap-3" aria-label="Material samples">
            {(["timber", "moss", "travertine", "lattice"] as const).map((id) => (
              <li key={id}><img src={`/projects/m-${id}.webp`} alt={`${id} sample from the render`} width={320} height={320} loading="lazy" className="h-14 w-14 rounded-md border-2 border-white object-cover shadow" /></li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-label="The space" className="relative overflow-hidden bg-indigo py-12 text-white md:py-20 on-dark">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div className={`mx-auto w-full max-w-md overflow-hidden rounded-t-[999px] ${featured.kind === "concept" ? "bg-gradient-to-b from-indigo via-lavender to-[#ffb08f] px-4 pt-16" : "aspect-[3/4]"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.src} alt={featured.alt} width={featured.w} height={featured.h} loading="lazy" className={featured.kind === "concept" ? "w-full" : "h-full w-full object-cover"} />
          </div>
          <div>
            <p className="t-label text-white/90">03 · The space{featured.kind === "concept" ? " · Concept study" : featured.kind === "placeholder" ? " · Placeholder image" : ""}</p>
            <p className="t-h1 mt-2">{featured.title}</p>
            <p className="t-lead mt-3 max-w-[40ch] text-white/95">{featured.line}</p>
            <Link href={featured.href} className="btn btn-coral mt-6">{featured.kind === "built" ? "Explore the project" : featured.kind === "placeholder" ? "See interiors work" : "Read the study"} <Arrow /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
