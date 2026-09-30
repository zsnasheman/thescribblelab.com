import Link from "next/link";
import { HeroScene } from "./HeroScene";
import { Blob, StripeBlob } from "./shapes";
import { C } from "@/lib/colors";
import { Arrow } from "./shapes";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative overflow-hidden bg-indigo text-white"
    >
      {/* two decorative shapes, bleeding off the edges */}
      <Blob
        kind="c"
        color={C.coral}
        className="pointer-events-none absolute -left-16 -top-14 h-36 w-56 md:h-44 md:w-72"
      />
      <StripeBlob
        kind="d"
        className="pointer-events-none absolute -right-24 top-24 hidden h-56 w-72 lg:block"
      />
      <div className="container-x relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-5">
          <p className="t-label text-white/80">Design and build · Dubai</p>
          <h1 id="hero-title" className="t-display mt-5">
            Every space starts as a scribble.
          </h1>
          <p className="t-lead mt-6 max-w-[38ch] text-white/90">
            We design and build interiors, exhibitions, events, brand activations and kinetic
            windows. One team, from the first sketch to the finished space.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-coral">
              Explore our work <Arrow />
            </Link>
            <Link href="/start-a-project" className="btn btn-outline text-white">
              Start a project
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
