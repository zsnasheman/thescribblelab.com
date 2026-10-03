import type { Metadata } from "next";
import Link from "next/link";
import { DisciplineIndex } from "@/components/DisciplineIndex";
import { PageHeader, SectionHead } from "@/components/PageHeader";
import { Arrow } from "@/components/ui";
import { services } from "@/content";

export const metadata: Metadata = {
  title: "What we do",
  description: "Interiors, exhibitions, events, brand activations and kinetic windows, designed and built by one team.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader label="What we do" title="Five disciplines, one way of working." lead="Design, fabrication and installation are connected, so the idea you approve is the thing that gets built. Choose a discipline, or compare them below." />
      <section aria-label="Disciplines" className="container-x pb-16"><DisciplineIndex /></section>

      <section aria-labelledby="compare-h" className="container-x pb-16 md:pb-24">
        <SectionHead id="compare-h" label="At a glance" title="Compare the five disciplines." />
        <div className="overflow-x-auto rounded-xl border border-indigo/15">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">Typical briefs, scope and deliverables for each discipline</caption>
            <thead>
              <tr className="bg-indigo text-white">
                <th scope="col" className="t-label px-5 py-4">Discipline</th><th scope="col" className="t-label px-5 py-4">A typical brief</th><th scope="col" className="t-label px-5 py-4">What the work covers</th><th scope="col" className="t-label px-5 py-4">What you receive</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.slug} className="border-t border-indigo/15 align-top odd:bg-white">
                  <th scope="row" className="px-5 py-5 font-normal"><Link href={`/services/${s.slug}`} className="t-h3 no-underline"><span className="draw-link">{s.name}</span></Link></th>
                  <td className="px-5 py-5 text-indigo-80">{s.briefs[0]}</td>
                  <td className="px-5 py-5 text-indigo-80">{s.scope.slice(0, 2).join(". ")}.</td>
                  <td className="px-5 py-5 text-indigo-80">{s.deliverables.slice(0, 2).join(". ")}.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8"><Link href="/approach" className="btn btn-outline">How we work across all five <Arrow /></Link></p>
      </section>
    </>
  );
}
