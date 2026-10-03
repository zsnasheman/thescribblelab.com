import Link from "next/link";
import { Hero } from "./Hero";
import { Arrow } from "./ui";
import { SAMPLES } from "@/content/art";
import type { Featured } from "@/content/featured";

/** The same story as the scroll journey, as an ordinary page: for reduced motion, no JavaScript and print. */
export function JourneyStatic({ featured }: { featured: Featured }) {
  return (
    <div className="journey-static">
      <Hero />
      <section aria-label="The idea and the material" className="container-x grid gap-10 py-12 md:py-20 lg:grid-cols-2">
        <div>
          <p className="t-label text-lavender">01 · The idea</p>
          <p className="t-h1 mt-3">It starts as a line.</p>
          <p className="t-lead mt-3 max-w-[34ch]">We follow that line from the first sketch until it can be built.</p>
          <div className="art-stack mt-6"><div className="hero-art hero-ink" role="img" aria-label="A line drawing of an arched pavilion beside a pool." /></div>
        </div>
        <div>
          <p className="t-label text-lavender">02 · Material</p>
          <p className="t-h1 mt-3">Then it gets a surface.</p>
          <p className="t-lead mt-3 max-w-[34ch]">Colour, texture and light enter the drawing. Samples are chosen against the sketch, not after it.</p>
          <div className="art-stack mt-6"><div className="hero-art hero-color" role="img" aria-label="The same pavilion with timber, travertine and colour." /></div>
          <ul className="mt-4 flex gap-3" aria-label="Material samples">
            {(["timber", "travertine", "wash", "granite"] as const).map((id) => (
              <li key={id}><img src={SAMPLES[id].src} alt={SAMPLES[id].name} width={SAMPLES[id].w} height={SAMPLES[id].h} loading="lazy" className="h-14 w-14 rounded-md border-2 border-white object-cover shadow" /></li>
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
