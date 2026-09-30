import Link from "next/link";
import { Depth } from "./Depth";
import { Arrow } from "./ui";

/** Opening: copy on a calm surface, the sketch-becomes-space scene running under and beyond the navigation. */
export function Hero() {
  return (
    <section aria-labelledby="hero-h" data-hero className="relative overflow-hidden pb-2 lg:pb-0">
      <div className="container-x relative z-10 pb-2 pt-masthead lg:pb-16 xl:pb-20">
        <div className="max-w-[44rem] lg:min-h-[23rem]">
          <h1 id="hero-h" className="t-hero">
            <span className="block">Small scribbles.</span>
            <span className="block">Extraordinary spaces.</span>
          </h1>
          <p className="t-lead mt-5 max-w-[30rem] lg:max-w-[26rem] xl:max-w-[30rem]">We design and build interiors, exhibitions, events, brand activations and kinetic windows.</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/work" className="btn btn-indigo btn-lg">Explore our work <Arrow /></Link>
            <Link href="/founder" className="draw-link py-2 font-semibold">Meet the founder</Link>
          </div>
        </div>
      </div>
      {/* Artwork. Lives behind the copy, never intercepts pointer or touch. */}
      <div aria-hidden="true" className="pointer-events-none -mt-6 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[58%] xl:w-[60%]">
        <Depth host="[data-hero]" className="lg:h-full">
          <div className="art-stack lg:h-full">
            <div className="hero-art hero-ink art-ink ink-settle" />
            <div className="hero-art hero-color art-color paint-in" />
          </div>
        </Depth>
      </div>

      <p className="t-caption pointer-events-none relative z-10 px-4 pb-3 text-right text-indigo-80 sm:px-8 lg:absolute lg:bottom-4 lg:right-8 lg:p-0"><span className="rounded-full bg-paper/90 px-3 py-1">Concept illustration, not a completed project</span></p>
    </section>
  );
}
