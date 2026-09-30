import type { Metadata } from "next";
import Link from "next/link";
import { MATERIALS, Swatch } from "@/components/art/materials";
import { PageHeader, SectionHead } from "@/components/PageHeader";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Arrow, Bubbles } from "@/components/ui";
import { allProjects, services } from "@/content";
import { capabilities, howItConnects, roles, studioIntro, values } from "@/content/studio";
import { SITE } from "@/lib/site";
import type { MaterialId } from "@/content/types";

export const metadata: Metadata = {
  title: "Studio",
  description: "A Dubai design and build studio: who we work with, how the practice has developed, what we value and how the work is made.",
};

export default function StudioPage() {
  const mats = Object.keys(MATERIALS) as MaterialId[];
  return (
    <>
      <PageHeader label="Studio" title="A design and build studio in Dubai." lead={studioIntro.lead} art={{ src: "/art/hero-m.webp", w: 794, h: 688, alt: "" }} />

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

      <section aria-labelledby="shop-h" className="container-x border-t border-indigo/15 py-14 md:py-20">
        <SectionHead id="shop-h" label="Workshop and materials" title="Where pieces are made, and what they are made from.">Photographs of the workshop, samples and installations will go here. Until then, these are the materials the studio works with, drawn as samples.</SectionHead>
        <div className="grid gap-6 lg:grid-cols-12">
          <PhotoSlot className="lg:col-span-5" title="Workshop photograph" file="public/studio/workshop-01.jpg" ratio="4 : 3 · landscape" note="Fabrication in progress, shot from standing height." />
          <PhotoSlot className="lg:col-span-4" title="Material close-up" file="public/studio/materials-01.jpg" ratio="4 : 3 · landscape" note="A macro of a joint, finish or sample board." />
          <PhotoSlot className="lg:col-span-3" title="Installation night" file="public/studio/install-01.jpg" ratio="4 : 3 · landscape" note="A team on site." />
        </div>
        <ul className="mt-10 grid grid-cols-4 gap-4 sm:grid-cols-8">
          {mats.map((m) => (<li key={m}><Swatch id={m} className="w-full" /><p className="t-caption mt-1.5 font-semibold">{MATERIALS[m].name}</p></li>))}
        </ul>
      </section>

      <section className="container-x pb-12">
        <div className="grid gap-8 rounded-xl border-2 border-indigo p-8 md:grid-cols-12 md:p-10">
          <div className="md:col-span-7">
            <h2 className="t-h2">Where to go next</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link className="link" href="/founder">The founder: {SITE.founder.firstName}&rsquo;s story</Link></li>
              <li><Link className="link" href="/approach">Our approach</Link></li>
              <li><Link className="link" href="/work">Work ({allProjects().length})</Link></li>
              <li><Link className="link" href="/services">What we do ({services.length} disciplines)</Link></li>
            </ul>
          </div>
          <div className="flex flex-wrap items-start gap-3 md:col-span-5 md:justify-end"><Link href="/contact" className="btn btn-outline">Contact us</Link><Link href="/start-a-project" className="btn btn-coral">Start a project</Link></div>
        </div>
      </section>
    </>
  );
}
