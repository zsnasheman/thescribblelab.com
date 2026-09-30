import type { Metadata } from "next";
import Link from "next/link";
import { FounderPortrait } from "@/components/FounderPortrait";
import { FounderStory } from "@/components/FounderStory";
import { Arrow } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.founder.name}, founder`,
  description: `${SITE.founder.name} founded The Scribble Lab in ${SITE.founder.established}. Her story, her background and her approach.`,
};

export default function FounderPage() {
  return (
    <>
      <header className="container-x grid items-center gap-10 pb-10 pt-10 md:pb-14 md:pt-14 lg:grid-cols-12">
        <div className="mx-auto w-full max-w-xs lg:col-span-3 lg:max-w-none"><FounderPortrait /></div>
        <div className="lg:col-span-9">
          <nav aria-label="Breadcrumb" className="t-caption"><Link className="link" href="/studio">Studio</Link></nav>
          <p className="t-label mt-5 text-lavender">The founder</p>
          <h1 className="t-display mt-3 !text-[clamp(2.25rem,1.4rem+3.4vw,4rem)]">{SITE.founder.name}</h1>
          <p className="t-label mt-3">{SITE.founder.role} · The Scribble Lab, established {SITE.founder.established}</p>
          <p className="t-lead mt-6 max-w-[60ch]">
            Nasheman founded The Scribble Lab after a career in interior design and fit-out, and leads it as Founder &amp; Design Director. This is her story in six short chapters: where the studio&rsquo;s thinking comes from, what she learned, and where she wants it to go.
          </p>
        </div>
      </header>
      <section aria-label="Her story" className="container-x pb-14"><FounderStory /></section>
      <section className="container-x pb-12">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border-2 border-indigo p-8 md:p-10">
          <div><h2 className="t-h2">Continue</h2><p className="t-body mt-2 measure">Read how the studio works, or talk to us about a project.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/approach" className="btn btn-indigo">Our approach <Arrow /></Link><Link href="/studio" className="btn btn-outline">The studio</Link><Link href="/contact" className="btn btn-outline">Contact us</Link></div>
        </div>
      </section>
    </>
  );
}
