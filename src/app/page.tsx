import Link from "next/link";
import { Closing } from "@/components/Closing";
import { DisciplineIndex } from "@/components/DisciplineIndex";
import { ExpandReel } from "@/components/ExpandReel";
import { FlyReel } from "@/components/FlyReel";
import { Hero3D } from "@/components/Hero3D";
import { ProcessList } from "@/components/ProcessList";
import { ProjectReel } from "@/components/ProjectReel";
import { StatementReveal } from "@/components/StatementReveal";
import { WHY } from "@/content/showcase";
import { Arrow } from "@/components/ui";

export default function Home() {
  return (
    <>
      <Hero3D />
      <FlyReel />
      <div className="dark-scope">

      <section aria-labelledby="stmt-h" className="container-x py-24 md:py-40">
        <h2 id="stmt-h" className="t-label mb-8 text-lavender">The studio</h2>
        <div className="max-w-5xl">
          <StatementReveal text="We’re a Dubai-based creative agency that concepts, builds and activates spaces and experiences people actually remember. We do it all, and we do it bold." />
        </div>
        <Link href="/studio" className="btn btn-outline mt-10">About the studio <Arrow /></Link>
      </section>

      <ExpandReel slug="the-juice-beauty" index={0} />

      <section id="breadth" aria-labelledby="practice-h" className="container-x py-20 md:py-32">
        <p className="t-label text-lavender">The practice</p>
        <h2 id="practice-h" className="t-lux mb-12 mt-3 max-w-[14ch] !text-[clamp(2.2rem,1rem+4.5vw,5rem)]">Five ways to shape a space.</h2>
        <DisciplineIndex />
      </section>

      <section id="work" aria-labelledby="work-h" className="container-x overflow-hidden pb-20 md:pb-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 id="work-h" className="t-lux max-w-[14ch] !text-[clamp(2.2rem,1rem+4.5vw,5rem)]">Selected work.</h2>
          <Link href="/work" className="btn btn-outline">All work <Arrow /></Link>
        </div>
        <ProjectReel />
      </section>

      <section aria-labelledby="why-h" className="container-x pb-10 pt-4 md:pb-24">
        <p className="t-label text-lavender">Why The Scribble Lab</p>
        <h2 id="why-h" className="t-lux mb-10 mt-3 max-w-[16ch] !text-[clamp(2.2rem,1rem+4.2vw,4.75rem)]">Work that gets remembered.</h2>
        <dl className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (<div key={w.t} className="border-t border-indigo/30 pt-4"><dt className="font-[family-name:var(--font-display)] text-2xl">{w.t}</dt><dd className="mt-3 text-indigo-80">{w.d}</dd></div>))}
        </dl>
      </section>

      <section aria-labelledby="delivery-h" className="container-x py-20 md:py-32"><ProcessList /></section>

      <Closing />
      </div>
    </>
  );
}
