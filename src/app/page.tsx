import Link from "next/link";
import { Closing } from "@/components/Closing";
import { DisciplineBoard } from "@/components/DisciplineBoard";
import { Journey } from "@/components/Journey";
import { JourneyStatic } from "@/components/JourneyStatic";
import { SketchToSite } from "@/components/SketchToSite";
import { WorkStories } from "@/components/WorkStories";
import { Arrow } from "@/components/ui";
import { featuredProject } from "@/content/featured";
import { projectBySlug } from "@/content";
import type { Project } from "@/content/types";

export default function Home() {
  const featured = featuredProject();
  const stories = ["concept-courtyard-lounge", "concept-hall-stand", "concept-launch-stage"]
    .map((s) => projectBySlug(s))
    .filter((p): p is Project => Boolean(p));

  return (
    <>
      {/* A to D: one line becomes an idea, a space, and a real project (scroll journey, or a static stack) */}
      <Journey featured={featured} />
      <JourneyStatic featured={featured} />

      {/* E: the breadth of the studio */}
      <section id="breadth" aria-labelledby="practice-h" className="container-x pb-10 pt-16 md:pb-16 md:pt-24">
        <p className="t-label text-lavender">The practice</p>
        <h2 id="practice-h" className="t-h1 mb-10 mt-3 max-w-[18ch] !text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] md:mb-14">Five ways to shape a space.</h2>
        <DisciplineBoard />
      </section>

      {stories.length > 0 && (
        <section id="work" aria-labelledby="work-h" className="container-x py-10 md:py-16">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
            <h2 id="work-h" className="t-h1 max-w-[16ch] !text-[clamp(2rem,1.3rem+2.6vw,3.5rem)]">Ideas, worked through.</h2>
            <Link href="/work" className="btn btn-outline">All work <Arrow /></Link>
          </div>
          <WorkStories projects={stories} />
        </section>
      )}

      {/* F: thinking and delivery */}
      <section aria-labelledby="delivery-h" className="container-x py-10 md:py-16">
        <h2 id="delivery-h" className="t-h1 mb-10 max-w-[18ch] !text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] md:mb-14">From sketch to site.</h2>
        <SketchToSite />
      </section>

      {/* G: the invitation */}
      <Closing />
    </>
  );
}
