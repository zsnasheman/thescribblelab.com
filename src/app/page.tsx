import Link from "next/link";
import { Closing } from "@/components/Closing";
import { DisciplineIndex } from "@/components/DisciplineIndex";
import { ExpandReel } from "@/components/ExpandReel";
import { HeroReel } from "@/components/HeroReel";
import { ProcessList } from "@/components/ProcessList";
import { ProjectReel } from "@/components/ProjectReel";
import { StatementReveal } from "@/components/StatementReveal";
import { Arrow } from "@/components/ui";

export default function Home() {
  return (
    <>
      <HeroReel />

      <section aria-labelledby="stmt-h" className="container-x py-24 md:py-40">
        <h2 id="stmt-h" className="t-label mb-8 text-lavender">The studio</h2>
        <div className="max-w-5xl">
          <StatementReveal text="We design and build spaces people remember: interiors, exhibitions, events, brand activations and kinetic windows. One team, from the first line to the finished room." />
        </div>
        <Link href="/studio" className="btn btn-outline mt-10">About the studio <Arrow /></Link>
      </section>

      <ExpandReel imageId="reception" />

      <section id="breadth" aria-labelledby="practice-h" className="container-x py-20 md:py-32">
        <p className="t-label text-lavender">The practice</p>
        <h2 id="practice-h" className="t-lux mb-12 mt-3 max-w-[14ch] !text-[clamp(2.2rem,1rem+4.5vw,5rem)]">Five ways to shape a space.</h2>
        <DisciplineIndex />
      </section>

      <section id="work" aria-labelledby="work-h" className="container-x overflow-hidden pb-20 md:pb-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 id="work-h" className="t-lux max-w-[14ch] !text-[clamp(2.2rem,1rem+4.5vw,5rem)]">Selected interiors.</h2>
          <Link href="/work" className="btn btn-outline">All work <Arrow /></Link>
        </div>
        <ProjectReel />
      </section>

      <section aria-labelledby="delivery-h" className="container-x py-20 md:py-32"><ProcessList /></section>

      <Closing />
    </>
  );
}
