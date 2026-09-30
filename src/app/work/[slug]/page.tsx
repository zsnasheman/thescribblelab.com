import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaFigure } from "@/components/MediaFigure";
import { Arrow } from "@/components/shapes";
import { allProjects, projectBySlug, serviceBySlug } from "@/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return { title: p.title, description: p.summary };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-indigo/15 py-8 md:grid md:grid-cols-12 md:gap-10">
      <h2 className="t-h3 md:col-span-4">{title}</h2>
      <div className="mt-3 md:col-span-8 md:mt-0">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  const svc = serviceBySlug(p.service);
  const all = allProjects();
  const i = all.findIndex((x) => x.slug === p.slug);
  const next = all[(i + 1) % all.length];

  return (
    <article className="container-x pb-12 pt-10 md:pt-16">
      <nav aria-label="Breadcrumb" className="t-caption mb-8">
        <Link className="link" href="/work">Work</Link>
        <span aria-hidden="true"> / </span>
        <Link className="link" href={`/work?service=${p.service}`}>{svc?.name}</Link>
      </nav>

      <header className="max-w-4xl">
        <p className="t-label text-lavender">{svc?.name}</p>
        <h1 className="t-display mt-4">{p.title}</h1>
        <p className="t-lead mt-5 measure">{p.summary}</p>
        <dl className="t-caption mt-6 flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <dt className="t-label text-indigo-80">Status</dt>
            <dd className="mt-1 font-semibold">{p.status === "concept" ? "Illustrative concept" : "Completed"}</dd>
          </div>
          {p.location && (<div><dt className="t-label text-indigo-80">Location</dt><dd className="mt-1 font-semibold">{p.location}</dd></div>)}
          {p.year && (<div><dt className="t-label text-indigo-80">Year</dt><dd className="mt-1 font-semibold">{p.year}</dd></div>)}
          {p.client && p.clientPermission && (<div><dt className="t-label text-indigo-80">Client</dt><dd className="mt-1 font-semibold">{p.client}</dd></div>)}
        </dl>
      </header>

      {p.isDemo && (
        <p className="mt-8 max-w-3xl rounded-md border border-coral bg-coral-20 px-4 py-3 font-medium">
          This page is an illustrative concept. It is not a completed project, and the client, scale
          and results are not real.
        </p>
      )}

      <div className="mt-10 grid gap-8">
        {p.media.map((m, idx) => (
          <MediaFigure key={idx} m={m} art={p.art} />
        ))}
      </div>

      <div className="mt-14">
        <Block title="The brief"><p className="t-body measure">{p.brief}</p></Block>
        <Block title="Our response"><p className="t-body measure">{p.response}</p></Block>
        <Block title="Materials and design decisions">
          <ul className="space-y-2">
            {p.materials.map((m) => (
              <li key={m} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                {m}
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Execution"><p className="t-body measure">{p.execution}</p></Block>
        <Block title="Verified outcomes">
          {p.outcomes.length ? (
            <ul className="space-y-2">{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
          ) : (
            <p className="t-body measure text-indigo-80">
              No verified outcomes have been published for this entry.
            </p>
          )}
        </Block>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-indigo/15 pt-8">
        <Link href="/work" className="btn btn-outline">Back to all work</Link>
        <Link href={`/work/${next.slug}`} className="link t-h3 inline-flex items-center gap-2 no-underline">
          Next: {next.title} <Arrow />
        </Link>
      </div>
    </article>
  );
}
