import Link from "next/link";
import { Fragment } from "@/components/art/Plates";
import { FounderPortrait } from "@/components/FounderPortrait";
import { KineticDemo } from "@/components/KineticDemo";
import { MaterialBoard } from "@/components/MaterialBoard";
import { SectionHead } from "@/components/PageHeader";
import { ProcessStrip } from "@/components/ProcessStrip";
import { Reveal } from "@/components/Reveal";
import { SpatialHero } from "@/components/SpatialHero";
import { WorkCard } from "@/components/WorkCard";
import { Arrow } from "@/components/ui";
import { background, founderPreview } from "@/content/founder";
import { allProjects, projectBySlug } from "@/content";
import { SITE } from "@/lib/site";

const benefits = [
  { t: "One conversation, not four hand-offs", d: "Concept, design development, fabrication and installation stay connected, so a decision made on paper survives on site." },
  { t: "Details are drawn before they are built", d: "Joints, finishes and fixings are resolved on drawings first. That is where most surprises are cheapest to fix." },
  { t: "Plain answers", d: "We explain options, trade-offs and next steps in plain English, and say what we do not yet know." },
];
const strip = [
  { k: "plan-interior", label: "Plan" },
  { k: "joinery-section", label: "Detail" },
  { k: "kit", label: "Kit of parts" },
  { k: "rail-elevation", label: "Mechanism" },
] as const;

export default function Home() {
  const lead = projectBySlug("concept-courtyard-lounge");
  const second = projectBySlug("concept-hall-stand");
  const third = projectBySlug("concept-sliding-window");
  const hasWork = allProjects().length > 0;

  return (
    <>
      {/* 1. Opening: a drawing that becomes a place */}
      <SpatialHero />

      {/* 2. What the studio does and why it helps */}
      <section aria-labelledby="intro-h" className="container-x py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="t-label text-lavender">The studio</p>
            <h2 id="intro-h" className="t-h1 mt-3">From the first line to the finished space, with one team.</h2>
            <p className="t-lead mt-5">The Scribble Lab is a Dubai-based design and build studio. We draw the idea, resolve the details and see it built, so what you approve on paper is what stands in the space.</p>
            <Link href="/studio" className="btn btn-outline mt-7">About the studio <Arrow /></Link>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <dl className="divide-y divide-indigo/15 border-y border-indigo/15">
              {benefits.map((b) => (
                <div key={b.t} className="grid gap-1 py-5 md:grid-cols-[14rem_1fr] md:gap-8"><dt className="t-h3">{b.t}</dt><dd className="text-indigo-80">{b.d}</dd></div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={80} className="mt-12">
          <p className="t-label text-lavender">One piece of work, four kinds of drawing</p>
          <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
            {strip.map((s, i) => (
              <li key={s.k} className="relative">
                <div className="overflow-hidden rounded-lg border border-indigo/15"><Fragment kind={s.k} uid={`hs-${s.k}`} className="block w-full" /></div>
                <p className="t-caption mt-2 font-semibold"><span className="tabular-nums text-lavender">0{i + 1}</span> {s.label}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* 3. Material board */}
      <section aria-labelledby="board-h" className="container-x pb-16 md:pb-24">
        <SectionHead id="board-h" label="Five disciplines" title="Choose a discipline to bring it into focus.">
          Each one is a composition of a drawing, a detail and the materials it is made from.
        </SectionHead>
        <MaterialBoard />
      </section>

      {/* 4. Selected work */}
      {hasWork && lead && second && third && (
        <section aria-labelledby="work-h" className="container-x pb-16 md:pb-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="work-h" label="Selected work" title="Concepts that show how we think." />
            <Link href="/work" className="btn btn-outline mb-10">All work <Arrow /></Link>
          </div>
          <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-7"><WorkCard p={lead} lead /></Reveal>
            <Reveal delay={100} className="lg:col-span-5 lg:pt-10"><WorkCard p={second} ratio="landscape" /></Reveal>
            <Reveal delay={60} className="lg:col-span-5"><WorkCard p={third} ratio="landscape" /></Reveal>
            <Reveal delay={140} className="lg:col-span-7 lg:pt-6">
              <h3 className="t-h2">What every project page shows</h3>
              <p className="t-body mt-3 max-w-[58ch] text-indigo-80">Each project is written up in the same order, so you can compare them and see how decisions were made.</p>
              <ol className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {["The brief", "The design response", "Material and spatial decisions", "Development", "Execution", "Gallery, drawings and video", "Verified outcomes, where evidenced"].map((t, i) => (
                  <li key={t} className="flex gap-3 border-t border-indigo/15 pt-3"><span className="t-label mt-1 tabular-nums text-lavender">0{i + 1}</span>{t}</li>
                ))}
              </ol>
            </Reveal>
          </div>
          <p className="t-caption mt-10 max-w-2xl text-indigo-80">These are concept drawings, not commissioned projects. Completed projects will appear here with photographs, drawings and their verified details as they are approved for publication.</p>
        </section>
      )}

      {/* 5. The founder */}
      <section aria-labelledby="founder-h" className="on-dark bg-indigo py-16 text-white md:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="mx-auto w-full max-w-sm lg:col-span-4 lg:max-w-none"><FounderPortrait /></div>
          <div className="lg:col-span-8">
            <p className="t-label text-white/85">The founder</p>
            <h2 id="founder-h" className="t-h1 mt-3">{SITE.founder.name}</h2>
            <p className="t-label mt-2 text-white/85">{SITE.founder.role} · Established {SITE.founder.established}</p>
            <p className="t-lead mt-6 max-w-[58ch] text-white/95">{founderPreview.lead}</p>
            <p className="t-body mt-4 max-w-[58ch] text-white/90">{founderPreview.body}</p>
            <p className="t-caption mt-6 text-white/85">Her professional background includes {background.join(", ")}. These are part of her own career, not clients of the studio.</p>
            <Link href="/founder" className="btn btn-coral mt-8">Read her story <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* 6. Process, compact */}
      <section aria-labelledby="process-h" className="container-x py-16 md:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <SectionHead id="process-h" label="Our approach" title="Listen, sketch, develop, build, hand over." />
          <Link href="/approach" className="btn btn-outline mb-10">The full approach <Arrow /></Link>
        </div>
        <ProcessStrip />
      </section>

      {/* 7. Kinetic window */}
      <section aria-label="Kinetic windows" className="on-dark bg-indigo py-16 text-white md:py-24">
        <div className="container-x"><KineticDemo /></div>
      </section>
    </>
  );
}
