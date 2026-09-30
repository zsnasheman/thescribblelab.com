import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Plate, plateAspect } from "@/components/art/Plates";
import { MATERIALS, Swatch } from "@/components/art/materials";
import { ProjectInspector } from "@/components/ProjectInspector";
import { Arrow } from "@/components/ui";
import { allProjects, projectBySlug, serviceBySlug } from "@/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allProjects().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-indigo/15 py-8 md:grid-cols-12 md:gap-10">
      <h2 id={id} className="t-h3 md:col-span-3">{title}</h2>
      <div className="md:col-span-8 md:col-start-5">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  const svc = serviceBySlug(p.service);
  const all = allProjects();
  const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length];

  return (
    <article className="container-x pb-10 pt-8 md:pt-12">
      <nav aria-label="Breadcrumb" className="t-caption">
        <Link className="link" href="/work">Work</Link><span aria-hidden="true"> / </span><Link className="link" href={`/work?service=${p.service}`}>{svc?.name}</Link>
      </nav>
      <header className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h1 className="t-display !text-[clamp(2.25rem,1.4rem+3.4vw,4rem)]">{p.title}</h1>
          <p className="t-lead mt-4 measure">{p.overview}</p>
        </div>
        <dl className="t-caption grid grid-cols-2 gap-x-6 gap-y-3 md:col-span-4">
          <div><dt className="t-label text-lavender">Status</dt><dd className="mt-1 font-semibold">{p.status === "concept" ? "Concept" : "Completed"}</dd></div>
          <div><dt className="t-label text-lavender">Discipline</dt><dd className="mt-1 font-semibold">{svc?.name}</dd></div>
          {p.location && <div><dt className="t-label text-lavender">Location</dt><dd className="mt-1 font-semibold">{p.location}</dd></div>}
          {p.year && <div><dt className="t-label text-lavender">Year</dt><dd className="mt-1 font-semibold">{p.year}</dd></div>}
          {p.client && p.clientPermission && <div><dt className="t-label text-lavender">Client</dt><dd className="mt-1 font-semibold">{p.client}</dd></div>}
        </dl>
      </header>
      {p.isDemo && <p className="t-caption mt-5 max-w-3xl text-indigo-80">An original concept drawing, made to show the kind of project the studio takes on. It is not commissioned work, and it has no client, scale or results.</p>}

      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div className="relative mt-8 overflow-hidden rounded-xl border border-indigo/15 bg-paper">
          <Plate kind={p.plate} uid={`pp-${p.slug}`} label={`${p.title}: concept drawing`} className={`block w-full ${plateAspect(p.plate)} lg:max-h-[38rem]`} />
        </div>
      </ViewTransition>

      <div className="mt-12">
        <Block id="brief" title="The brief"><p className="t-body measure">{p.brief}</p></Block>
        <Block id="response" title="Design response"><p className="t-body measure">{p.response}</p></Block>
        <Block id="materials" title="Material and spatial decisions">
          <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {p.materials.map((m) => (
              <li key={m} className="flex items-center gap-3"><Swatch id={m} className="h-12 w-12 shrink-0" /><span><span className="block font-semibold">{MATERIALS[m].name}</span><span className="t-caption text-indigo-80">{MATERIALS[m].note}</span></span></li>
            ))}
          </ul>
        </Block>
        <Block id="development" title="Development"><p className="t-body measure">{p.development}</p></Block>
        <Block id="execution" title="Execution"><p className="t-body measure">{p.execution}</p></Block>
        <Block id="inspect" title="Inspect"><ProjectInspector p={p} /></Block>
        <Block id="outcomes" title="Outcomes">
          {p.outcomes.length ? (<ul className="space-y-2">{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>) : (<p className="t-body measure text-indigo-80">No verified outcomes have been published for this entry.</p>)}
        </Block>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-6 border-t border-indigo/15 pt-8">
        <Link href="/work" className="btn btn-outline">Back to all work</Link>
        <Link href={`/work/${next.slug}`} className="t-h3 inline-flex items-center gap-2 no-underline"><span className="draw-link">Next: {next.title}</span> <Arrow /></Link>
      </div>
    </article>
  );
}
