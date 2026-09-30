import Link from "next/link";
import { FounderBlock } from "@/components/FounderBlock";
import { Hero } from "@/components/Hero";
import { KineticWindow } from "@/components/KineticWindow";
import { Marquee } from "@/components/Marquee";
import { ProcessAccordion } from "@/components/ProcessAccordion";
import { Reveal } from "@/components/Reveal";
import { ScrollStatement } from "@/components/ScrollStatement";
import { ServicesStack } from "@/components/ServicesStack";
import { Arrow } from "@/components/ui";
import { WorkCarousel } from "@/components/WorkCarousel";
import { allProjects, services } from "@/content";

export default function Home() {
  const work = allProjects();
  return (
    <>
      <Hero />
      <Marquee items={services.map((s) => s.name)} />

      <section aria-label="About the studio" className="container-x py-24 md:py-40">
        <ScrollStatement />
      </section>

      <section aria-labelledby="worlds-title" className="container-x pb-24 md:pb-32">
        <Reveal>
          <p className="t-label text-lavender">Five worlds</p>
          <h2 id="worlds-title" className="t-display mt-4 max-w-[16ch]">One studio, five ways a space gets made.</h2>
        </Reveal>
        <div className="mt-14"><ServicesStack /></div>
      </section>

      <section aria-labelledby="work-title" className="overflow-hidden py-16 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="t-label text-lavender">Work</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
              <h2 id="work-title" className="t-display max-w-[14ch]">Let the projects do the talking.</h2>
              <Link href="/work" className="btn btn-outline">See all work <Arrow /></Link>
            </div>
            <p className="t-body mt-5 max-w-[60ch] text-indigo-80">
              Approved case studies will appear here as they are published. Until then these are placeholder photos and illustrative concepts, clearly labelled.
            </p>
          </Reveal>
          <div className="mt-12"><WorkCarousel projects={work} /></div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="container-x py-24 md:py-32">
        <Reveal>
          <p className="t-label text-lavender">Process</p>
          <h2 id="process-title" className="t-display mt-4 max-w-[16ch]">From first line to final handover.</h2>
        </Reveal>
        <div className="mt-14"><ProcessAccordion /></div>
      </section>

      <section aria-label="Kinetic windows" className="on-dark bg-indigo py-24 text-white md:py-32">
        <div className="container-x"><KineticWindow /></div>
      </section>

      <section aria-label="The people" className="container-x py-24 md:py-32">
        <FounderBlock />
      </section>
    </>
  );
}
