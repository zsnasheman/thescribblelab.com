import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { WorkGallery } from "@/components/WorkGallery";
import { allProjects, services } from "@/content";
import { PLACEHOLDER_IMAGES } from "@/content/placeholders";

export const metadata: Metadata = {
  title: "Work",
  description: "Interiors, exhibitions, events, brand activations and kinetic windows by The Scribble Lab.",
};

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
  const sp = await searchParams;
  const svc = Array.isArray(sp.service) ? sp.service[0] : sp.service;
  const active = services.find((s) => s.slug === svc);
  const items = !svc || svc === "interiors" ? PLACEHOLDER_IMAGES : [];
  const projects = allProjects().filter((p) => !svc || p.service === svc);
  const chip = (on: boolean) => `btn !min-h-11 !px-5 !py-2 ${on ? "btn-indigo" : "btn-outline"}`;
  return (
    <>
      <PageHeader label="Work" title="Spaces, stands, stages and windows." lead="A selection of interior work. Choose a discipline to filter." />
      <section aria-label="Work index" className="container-x pb-16">
        <nav aria-label="Filter by discipline" className="mb-10 flex flex-wrap gap-2 border-y border-indigo/20 py-5">
          <Link href="/work" aria-current={!svc ? "true" : undefined} className={chip(!svc)}>All disciplines</Link>
          {services.map((s) => (<Link key={s.slug} href={`/work?service=${s.slug}`} aria-current={svc === s.slug ? "true" : undefined} className={chip(svc === s.slug)}>{s.name}</Link>))}
        </nav>
        {projects.length > 0 && (
          <ul className="mb-10 grid gap-3 sm:grid-cols-2">{projects.map((p) => (<li key={p.slug}><Link className="link t-h3" href={`/work/${p.slug}`}>{p.title}</Link></li>))}</ul>
        )}
        {items.length > 0 ? <WorkGallery items={items} /> : (
          <div className="rounded-2xl border border-indigo/20 p-8 md:p-12">
            <h2 className="t-h2">{svc && !active ? "We do not have a discipline with that name." : `${active?.name ?? "This discipline"}: more soon.`}</h2>
            <p className="t-body mt-3 measure">Read what this discipline covers, or tell us about what you are planning.</p>
            <div className="mt-6 flex flex-wrap gap-3">{active && <Link href={`/services/${active.slug}`} className="btn btn-outline">About {active.name.toLowerCase()}</Link>}<Link href="/start-a-project" className="btn btn-coral">Start a project</Link></div>
          </div>
        )}
      </section>
    </>
  );
}
