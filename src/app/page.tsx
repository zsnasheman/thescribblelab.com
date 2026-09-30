import Link from "next/link";
import { Closing } from "@/components/Closing";
import { DisciplineBoard } from "@/components/DisciplineBoard";
import { FounderScene } from "@/components/FounderScene";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SketchToSite } from "@/components/SketchToSite";
import { WorkStories } from "@/components/WorkStories";
import { Arrow } from "@/components/ui";
import { founderPreview } from "@/content/founder";
import { projectBySlug } from "@/content";
import { SITE } from "@/lib/site";
import type { Project } from "@/content/types";

/** A drawn line that carries the eye from one chapter to the next. Decorative. */
function Thread({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 90" preserveAspectRatio="none" className={`pointer-events-none block h-14 w-full md:h-[5.5rem] ${flip ? "-scale-x-100" : ""}`} fill="none">
      <path d="M-10 18C220 100 420 -10 700 40S1180 96 1450 20" stroke="#ff663e" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const stories = ["concept-courtyard-lounge", "concept-hall-stand", "concept-launch-stage"]
    .map((s) => projectBySlug(s))
    .filter((p): p is Project => Boolean(p));

  return (
    <>
      {/* 1. The idea */}
      <Hero />

      {/* 2. The practice */}
      <section aria-labelledby="practice-h" className="container-x pb-10 pt-10 md:pb-16 md:pt-16">
        <h2 id="practice-h" className="t-h1 mb-10 max-w-[18ch] !text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] md:mb-14">Five ways to shape a space.</h2>
        <DisciplineBoard />
      </section>
      <Thread />

      {/* 3. The evidence */}
      {stories.length > 0 && (
        <section id="work" aria-labelledby="work-h" className="container-x py-10 md:py-16">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
            <h2 id="work-h" className="t-h1 max-w-[16ch] !text-[clamp(2rem,1.3rem+2.6vw,3.5rem)]">Ideas, worked through.</h2>
            <Link href="/work" className="btn btn-outline">All work <Arrow /></Link>
          </div>
          <WorkStories projects={stories} />
        </section>
      )}

      {/* 4. The person behind the practice */}
      <section aria-labelledby="founder-h" className="relative py-16 md:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="mx-auto w-full max-w-md lg:col-span-5 lg:mx-0"><FounderScene stage={-1} /></Reveal>
          <Reveal delay={100} className="lg:col-span-7">
            <p className="t-label text-lavender">The founder</p>
            <h2 id="founder-h" className="t-h1 mt-3 !text-[clamp(2rem,1.3rem+2.6vw,3.5rem)]">{SITE.founder.name}</h2>
            <p className="t-label mt-3">{SITE.founder.role} · Established {SITE.founder.established}</p>
            <p className="t-lead mt-6 max-w-[56ch]">{founderPreview.lead}</p>
            <p className="mt-4 max-w-[56ch]">{founderPreview.body}</p>
            <Link href="/founder" className="btn btn-indigo btn-lg mt-8">Read her story <Arrow /></Link>
          </Reveal>
        </div>
      </section>
      <Thread flip />

      {/* 5. The delivery */}
      <section aria-labelledby="delivery-h" className="container-x py-10 md:py-16">
        <h2 id="delivery-h" className="t-h1 mb-10 max-w-[18ch] !text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] md:mb-14">From sketch to site.</h2>
        <SketchToSite />
      </section>

      {/* 6. The conversation */}
      <Closing />
    </>
  );
}
