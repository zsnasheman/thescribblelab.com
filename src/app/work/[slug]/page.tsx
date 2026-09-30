import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { projectArt } from "@/content/art";
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
  const art = projectArt(p.slug, p.service);
  const all = allProjects();
  const next = all[(all.findIndex((x) => x.slug === p.slug) + 1) % all.length];

  return (
    <article className="container-x pb-10 pt-masthead">
      <nav aria-label="Breadcrumb" className="t-caption">
        <Link className="link" href="/work">Work</Link><span aria-hidden="true"> / </span><Link className="link" href={`/work?service=${p.service}`}>{svc?.name}</Link>
      </nav>
      <header className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="t-label text-lavender">{p.status === "concept" ? "Concept study" : "Completed project"}</p>
          <h1 className="t-display mt-3 !text-[clamp(2.25rem,1.4rem+3.4vw,4rem)]">{p.title}</h1>
          <p className="t-lead mt-4 measure">{p.overview}</p>
        </div>
        <dl className="t-caption grid grid-cols-2 gap-x-6 gap-y-3 md:col-span-4">
          <div><dt className="t-label text-lavender">Discipline</dt><dd className="mt-1 font-semibold">{svc?.name}</dd></div>
          {p.location && <div><dt className="t-label text-lavender">Location</dt><dd className="mt-1 font-semibold">{p.location}</dd></div>}
          {p.year && <div><dt className="t-label text-lavender">Year</dt><dd className="mt-1 font-semibold">{p.year}</dd></div>}
          {p.client && p.clientPermission && <div><dt className="t-label text-lavender">Client</dt><dd className="mt-1 font-semibold">{p.client}</dd></div>}
        </dl>
      </header>

      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div className="relative mt-8 overflow-hidden rounded-2xl bg-lavender-20/70 p-[3%]">
          <div className="art-stack mx-auto max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art.color} width={art.w} height={art.h} alt={art.alt} decoding="async" className="w-full" />
          </div>
          {p.isDemo && <span className="t-label absolute left-3 top-3 rounded-full bg-paper px-3 py-2 text-[0.625rem] shadow-sm">Concept study: an original illustration, not commissioned work</span>}
        </div>
      </ViewTransition>

      <div className="mt-12">
        <Block id="brief" title="The brief"><p className="t-body measure">{p.brief}</p></Block>
        <Block id="response" title="The design move"><p className="t-body measure">{p.response}</p></Block>
        <Block id="development" title="Development and execution"><p className="t-body measure">{p.development}</p><p className="t-body mt-4 measure">{p.execution}</p></Block>
        <Block id="inspect" title="Drawings and materials"><ProjectInspector p={p} /></Block>
        {p.outcomes.length > 0 && <Block id="outcomes" title="Outcomes"><ul className="space-y-2">{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ul></Block>}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-6 border-t border-indigo/15 pt-8">
        <Link href="/work" className="btn btn-outline">Back to all work</Link>
        <Link href={`/work/${next.slug}`} className="t-h3 inline-flex items-center gap-2 no-underline"><span className="draw-link">Next: {next.title}</span> <Arrow /></Link>
      </div>
    </article>
  );
}
