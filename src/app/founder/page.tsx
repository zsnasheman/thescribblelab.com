import type { Metadata } from "next";
import Link from "next/link";
import { FounderStory } from "@/components/FounderStory";
import { Arrow } from "@/components/ui";
import { founderFacts } from "@/content/founder";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.founder.name}, founder`,
  description: `${SITE.founder.name} founded The Scribble Lab in ${SITE.founder.established}. Her roots, her professional practice, the founding of the studio and where it is heading.`,
};

export default function FounderPage() {
  return (
    <>
      <header className="container-x pb-8 pt-masthead md:pb-12">
        <p className="t-label text-lavender">The founder</p>
        <h1 className="t-display mt-3 max-w-[16ch]">{SITE.founder.name}</h1>
        <p className="t-lead mt-5 max-w-[56ch]">
          Nasheman founded The Scribble Lab after a career in interior design and fit-out. This is her story in four short chapters: where the studio&rsquo;s thinking comes from, what she learned, how the studio began and where it is going.
        </p>
        <dl className="mt-8 grid max-w-2xl gap-x-8 gap-y-4 sm:grid-cols-3">
          {founderFacts.map((f) => (
            <div key={f.label} className="border-t-2 border-indigo pt-3"><dt className="t-label text-lavender">{f.label}</dt><dd className="mt-1 font-semibold">{f.value}</dd></div>
          ))}
        </dl>
      </header>
      <section aria-label="Her story" className="container-x pb-14"><FounderStory /></section>
      <section className="container-x pb-12">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-indigo p-8 text-white md:p-10 on-dark">
          <div><h2 className="t-h2">See how the studio works</h2><p className="t-body mt-2 measure text-white/90">Read the approach, or talk to us about a project.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/approach" className="btn btn-coral">Our approach <Arrow /></Link><Link href="/contact" className="btn btn-outline">Contact us</Link></div>
        </div>
      </section>
    </>
  );
}
