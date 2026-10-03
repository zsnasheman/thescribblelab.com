import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHead } from "@/components/PageHeader";
import { Arrow, Bubbles } from "@/components/ui";
import { PORTFOLIO, services } from "@/content";
import { CLIENT_LIST } from "@/content/showcase";
import { capabilities, howItConnects, roles, studioIntro, values } from "@/content/studio";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description: "A Dubai design and build studio: who we work with, how the practice has developed, what we value and how the work is made.",
};

export default function StudioPage() {
  return (
    <>
      <PageHeader label="Studio" title="A design and build studio in Dubai." lead={studioIntro.lead} />

      <section aria-labelledby="who-h" className="container-x grid gap-12 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="who-h" className="t-h2">Who we work with</h2>
          <p className="t-body mt-4 measure">{studioIntro.serves}</p>
          <h3 className="t-h3 mt-8">What the practice covers</h3>
          <ul className="mt-4 space-y-2">{capabilities.map((c) => <li key={c} className="flex gap-3"><span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />{c}</li>)}</ul>
        </div>
        <div className="lg:col-span-6">
          <h2 className="t-h2">How the practice has developed</h2>
          <ol className="mt-4 space-y-4">{studioIntro.evolution.map((e, i) => <li key={e} className="flex gap-4 border-t border-indigo/15 pt-4"><span className="t-label mt-1 tabular-nums text-lavender">0{i + 1}</span><span>{e}</span></li>)}</ol>
          <p className="mt-6"><Link href="/founder" className="btn btn-outline">Read the founder&rsquo;s story <Arrow /></Link></p>
        </div>
      </section>

      <section aria-labelledby="values-h" className="on-dark bg-indigo py-14 text-white md:py-20">
        <div className="container-x">
          <p className="t-label text-white/85">Values</p>
          <h2 id="values-h" className="t-h1 mt-3 max-w-[22ch]">What we care about, and how it shows up.</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {values.map((v) => (
              <div key={v.name} className="border-t border-white/30 pt-5">
                <dt className="t-h2">{v.name}</dt>
                <dd className="mt-2 text-white/85"><span className="font-[family-name:var(--font-display)] text-lg font-light italic">{v.brandLine}</span></dd>
                <dd className="t-body mt-3 text-white/95">{v.behaviour}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="connect-h" className="container-x py-14 md:py-20">
        <SectionHead id="connect-h" label="How the work connects" title="Concept, development, fabrication, coordination and installation.">Each step hands something real to the next. Nothing is thrown over a wall.</SectionHead>
        <ol className="grid gap-3 md:grid-cols-5">
          {howItConnects.map((h, i) => (
            <li key={h.label} className="rounded-xl border border-indigo/15 p-5"><Bubbles active={i + 1} size={7} /><p className="t-label mt-4 text-lavender">Step <span className="tabular-nums">{i + 1}</span></p><p className="t-h3 mt-1">{h.label}</p><p className="t-caption mt-2 text-indigo-80">{h.text}</p></li>
          ))}
        </ol>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {roles.map((r) => (<div key={r.name} className="border-t-2 border-indigo pt-4"><h3 className="t-h3">{r.name}</h3><p className="t-body mt-2 text-indigo-80">{r.text}</p></div>))}
        </div>
        <p className="mt-8"><Link href="/approach" className="btn btn-indigo">Our approach in detail <Arrow /></Link></p>
      </section>

      <section aria-labelledby="scribblers-h" className="container-x border-t border-indigo/15 py-14 md:py-20">
        <p className="t-label text-lavender">Who are Scribblers</p>
        <h2 id="scribblers-h" className="t-lux mt-3 max-w-[18ch] !text-[clamp(2.2rem,1rem+4vw,4.5rem)]">We call ourselves Scribblers.</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-14">
          <p className="t-lead">We walk into a blank space and see the finished room. We look at a brief and sketch something nobody asked for but everybody needed. We lose sleep over the angle of a spotlight and the texture of a wall that most people will never notice but will always feel.</p>
          <p className="t-lead">Sharp minds. Restless energy. An almost unreasonable commitment to bold. We don’t hire people who colour inside the lines. We hire people who question why there are lines in the first place.</p>
        </div>
      </section>

      <section aria-labelledby="clients-h" className="container-x border-t border-indigo/15 py-14 md:py-20">
        <SectionHead id="clients-h" label="Our clients" title="Projects across the region." />
        <ul className="divide-y divide-indigo/15 border-y border-indigo/15">
          {CLIENT_LIST.map(([name, role, place, year]) => (
            <li key={name} className="grid gap-x-6 gap-y-1 py-4 md:grid-cols-[1.6fr_1.2fr_1fr_5rem]"><span className="font-semibold">{name}</span><span className="text-indigo-80">{role}</span><span className="text-indigo-80">{place}</span><span className="tabular-nums text-indigo-80 md:text-right">{year}</span></li>
          ))}
        </ul>
      </section>

      <section className="container-x pb-12">
        <div className="grid gap-8 rounded-xl border-2 border-indigo p-8 md:grid-cols-12 md:p-10">
          <div className="md:col-span-7">
            <h2 className="t-h2">Where to go next</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link className="link" href="/founder">The founder: {SITE.founder.firstName}&rsquo;s story</Link></li>
              <li><Link className="link" href="/approach">Our approach</Link></li>
              <li><Link className="link" href="/work">Work ({PORTFOLIO.length})</Link></li>
              <li><Link className="link" href="/services">What we do ({services.length} disciplines)</Link></li>
            </ul>
          </div>
          <div className="flex flex-wrap items-start gap-3 md:col-span-5 md:justify-end"><Link href="/contact" className="btn btn-outline">Contact us</Link><Link href="/start-a-project" className="btn btn-coral">Start a project</Link></div>
        </div>
      </section>
    </>
  );
}
