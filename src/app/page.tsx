import { Hero } from "@/components/Hero";
import { StudioBoard } from "@/components/StudioBoard";
import { WorkShowcase } from "@/components/WorkShowcase";
import { ProcessSequence } from "@/components/ProcessSequence";
import { KineticWindow } from "@/components/KineticWindow";
import { ClosingCta, FounderBlock } from "@/components/PeopleCta";
import { Reveal } from "@/components/Reveal";

function Head({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="t-label text-lavender">{label}</p>
      <h2 className="t-h1 mt-4">{title}</h2>
      {children && <p className="t-lead mt-5 measure">{children}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <section aria-labelledby="worlds-title" className="container-x py-20 md:py-28">
        <Reveal>
          <div className="mb-12 max-w-3xl">
            <p className="t-label text-lavender">Five worlds</p>
            <h2 id="worlds-title" className="t-h1 mt-4">One studio, five ways a space gets made.</h2>
            <p className="t-lead mt-5 measure">
              Choose a world to look closer. Each one is designed, built and installed by the same team.
            </p>
          </div>
        </Reveal>
        <StudioBoard />
      </section>

      <section aria-labelledby="work-title" className="container-x py-12 md:py-20">
        <Reveal>
          <div className="mb-12 max-w-3xl">
            <p className="t-label text-lavender">Work</p>
            <h2 id="work-title" className="t-h1 mt-4">Let the projects carry the proof.</h2>
            <p className="t-lead mt-5 measure">
              Approved case studies will appear here as they are published. Until then, these are
              clearly labelled illustrative concepts.
            </p>
          </div>
        </Reveal>
        <WorkShowcase />
      </section>

      <section aria-label="Process" className="container-x py-20 md:py-28">
        <Head label="Process" title="From first line to final handover.">
          Five stages, one team. Scroll to follow a project from brief to finished space.
        </Head>
        <ProcessSequence />
      </section>

      <section aria-label="Kinetic windows" className="on-dark my-12 bg-indigo py-20 text-white md:py-28">
        <div className="container-x">
          <KineticWindow />
        </div>
      </section>

      <section aria-label="The people" className="container-x py-16 md:py-24">
        <FounderBlock />
      </section>

      <section aria-label="Start a project" className="container-x py-12 md:py-20">
        <ClosingCta />
      </section>
    </>
  );
}
