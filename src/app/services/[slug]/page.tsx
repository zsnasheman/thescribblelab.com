import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plate, plateAspect } from "@/components/art/Plates";
import { ServiceSpecial } from "@/components/ServiceSpecial";
import { SPECIAL_TITLE } from "@/content/serviceSpecial";
import { WorkCard } from "@/components/WorkCard";
import { Arrow } from "@/components/ui";
import { processStages, projectsForService, serviceBySlug, services } from "@/content";
import type { Service, ServiceSlug } from "@/content/types";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  return s ? { title: s.name, description: s.summary } : {};
}

type Key = "special" | "briefs" | "scope" | "process" | "work" | "faq";
// Each discipline leads with what matters most for it, so the pages are not the same page re-titled.
const ORDER: Record<ServiceSlug, Key[]> = {
  interiors: ["special", "briefs", "scope", "process", "work", "faq"],
  exhibitions: ["briefs", "special", "scope", "process", "work", "faq"],
  events: ["special", "scope", "briefs", "process", "faq", "work"],
  "brand-activations": ["briefs", "scope", "special", "process", "work", "faq"],
  "kinetic-windows": ["special", "briefs", "scope", "process", "faq", "work"],
};

const Section = ({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) => (
  <section aria-labelledby={id} className="container-x border-t border-indigo/15 py-12 md:py-16">
    <p className="t-label text-lavender">{label}</p>
    <h2 id={id} className="t-h1 mt-3 max-w-[26ch]">{title}</h2>
    <div className="mt-8">{children}</div>
  </section>
);
const Dot = ({ c = "bg-emerald" }: { c?: string }) => <span aria-hidden="true" className={`mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full ${c}`} />;

function render(key: Key, s: Service) {
  const related = projectsForService(s.slug);
  switch (key) {
    case "special": {
      const t = SPECIAL_TITLE[s.slug];
      return <Section key={key} id="special-h" label={t.label} title={t.title}><p className="t-body mb-6 text-indigo-80">{t.note}</p><ServiceSpecial slug={s.slug} /></Section>;
    }
    case "briefs":
      return (
        <Section key={key} id="briefs-h" label="Briefs we take on" title={`What brings people to ${s.name.toLowerCase()}.`}>
          <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">{s.briefs.map((b) => <li key={b} className="flex gap-3 border-t border-indigo/15 pt-4"><Dot c="bg-lavender" />{b}</li>)}</ul>
        </Section>
      );
    case "scope":
      return (
        <Section key={key} id="scope-h" label="Scope and deliverables" title="What the work covers, and what you receive.">
          <div className="grid gap-10 md:grid-cols-2">
            <div><h3 className="t-h3">Scope</h3><ul className="mt-4 space-y-2">{s.scope.map((x) => <li key={x} className="flex gap-3"><Dot />{x}</li>)}</ul></div>
            <div><h3 className="t-h3">Deliverables</h3><ul className="mt-4 space-y-2">{s.deliverables.map((x) => <li key={x} className="flex gap-3"><Dot />{x}</li>)}</ul></div>
          </div>
        </Section>
      );
    case "process":
      return (
        <Section key={key} id="process-h" label="How the stages apply" title={`The five stages, for ${s.name.toLowerCase()}.`}>
          <ol className="divide-y divide-indigo/15 border-y border-indigo/15">
            {s.processNotes.map((n, i) => {
              const st = processStages.find((p) => p.id === n.stage)!;
              return (
                <li key={n.stage} className="grid gap-2 py-4 md:grid-cols-[11rem_1fr] md:gap-8">
                  <Link href={`/approach#stage-${st.id}`} className="t-h3 no-underline"><span className="tabular-nums text-lavender">0{i + 1}</span> <span className="draw-link">{st.name}</span></Link>
                  <p className="text-indigo-80">{n.note}</p>
                </li>
              );
            })}
          </ol>
          <p className="mt-6"><Link href="/approach" className="btn btn-outline">Read our full approach <Arrow /></Link></p>
        </Section>
      );
    case "work":
      return (
        <Section key={key} id="work-h" label="Related work" title={related.length ? "Work in this discipline." : "Work in this discipline is on its way."}>
          {related.length ? (
            <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <li key={p.slug}><WorkCard p={p} ratio="landscape" /></li>)}</ul>
          ) : (<p className="t-body measure">No {s.name.toLowerCase()} projects are published yet. <Link className="link" href="/work">See all work</Link>.</p>)}
        </Section>
      );
    case "faq":
      return (
        <Section key={key} id="faq-h" label="Questions" title="Useful answers.">
          <div className="max-w-3xl divide-y divide-indigo/15 border-y border-indigo/15">
            {s.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}<span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-current leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="t-body mt-3 max-w-[62ch] text-indigo-80">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      );
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  return (
    <>
      <div className="on-dark bg-indigo text-white">
        <div className="container-x grid items-center gap-10 py-10 md:py-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <nav aria-label="Breadcrumb" className="t-caption text-white/85"><Link className="link" href="/services">What we do</Link></nav>
            <h1 className="t-display mt-4 !text-[clamp(2.25rem,1.4rem+3.4vw,4rem)]">{s.name}</h1>
            <p className="t-lead mt-5 max-w-[44ch] text-white/90">{s.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/start-a-project?type=${s.slug}`} className="btn btn-coral">Start a project <Arrow /></Link>
              <Link href={`/work?service=${s.slug}`} className="btn btn-outline text-white">See related work</Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl bg-paper"><Plate kind={s.plate} uid={`sv-${s.slug}`} label={`${s.name}: drawn composition`} className={`block w-full ${plateAspect(s.plate)}`} /></div>
          </div>
        </div>
      </div>
      {ORDER[s.slug].map((k) => render(k, s))}
      <section aria-labelledby="next-h" className="container-x py-12">
        <div className="rounded-xl border-2 border-indigo p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-10">
          <div><h2 id="next-h" className="t-h2">Next step</h2><p className="t-body mt-2 measure">{s.nextStep}</p></div>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-0"><Link href={`/start-a-project?type=${s.slug}`} className="btn btn-coral">Start a project <Arrow /></Link><Link href="/contact" className="btn btn-outline">Or send a quick message</Link></div>
        </div>
      </section>
    </>
  );
}
