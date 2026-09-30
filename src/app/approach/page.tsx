import type { Metadata } from "next";
import Link from "next/link";
import { ApproachStages } from "@/components/ApproachStages";
import { PageHeader, SectionHead } from "@/components/PageHeader";
import { Arrow } from "@/components/ui";
import { processStages, services } from "@/content";

export const metadata: Metadata = {
  title: "Our approach",
  description: "How a project moves from first idea to finished space: listen, sketch, develop, build and hand over.",
};

export default function ApproachPage() {
  return (
    <>
      <PageHeader label="Our approach" title="From the first idea to the finished space." lead="Every project moves through five stages. For each one, here is what happens, what you see, and where the decisions are made. Nothing here is a promise of time or price: those depend on the project, and we discuss them with you."  art={{ src: "/art/v-brand.webp", w: 580, h: 432, alt: "" }} />
      <section aria-label="The five stages" className="container-x pb-16 md:pb-24"><ApproachStages /></section>

      <section aria-labelledby="by-h" className="container-x border-t border-indigo/15 py-14 md:py-20">
        <SectionHead id="by-h" label="Across the disciplines" title="The same five stages, applied to each kind of work.">Select a discipline to read how it works there.</SectionHead>
        <div className="overflow-x-auto rounded-xl border border-indigo/15">
          <table className="w-full min-w-[60rem] border-collapse text-left">
            <caption className="sr-only">How each of the five stages applies to each discipline</caption>
            <thead><tr className="bg-indigo text-white"><th scope="col" className="t-label px-4 py-4">Discipline</th>{processStages.map((s) => <th scope="col" key={s.id} className="t-label px-4 py-4">{s.name}</th>)}</tr></thead>
            <tbody>
              {services.map((sv) => (
                <tr key={sv.slug} className="border-t border-indigo/15 align-top odd:bg-white">
                  <th scope="row" className="px-4 py-4 font-normal"><Link className="t-h3 no-underline" href={`/services/${sv.slug}`}><span className="draw-link">{sv.name}</span></Link></th>
                  {processStages.map((st) => <td key={st.id} className="px-4 py-4 text-[0.9rem] text-indigo-80">{sv.processNotes.find((n) => n.stage === st.id)?.note}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-x pb-12">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border-2 border-indigo p-8 md:p-10">
          <div><h2 className="t-h2">See how the studio works</h2><p className="t-body mt-2 measure">Meet the people behind the approach, or read about the studio as a whole.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/studio" className="btn btn-indigo">The studio <Arrow /></Link><Link href="/founder" className="btn btn-outline">The founder</Link><Link href="/start-a-project" className="btn btn-coral">Start a project</Link></div>
        </div>
      </section>
    </>
  );
}
