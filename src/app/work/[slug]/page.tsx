import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <section aria-labelledby={id} className="grid gap-4 border-t border-indigo/20 py-8 md:grid-cols-12 md:gap-10">
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
  const media = p.media.filter((m) => m.permissionToPublish);
  return (
    <article className="container-x pb-10 pt-masthead">
      <nav aria-label="Breadcrumb" className="t-caption"><Link className="link" href="/work">Work</Link><span aria-hidden="true"> / </span><Link className="link" href={`/work?service=${p.service}`}>{svc?.name}</Link></nav>
      <h1 className="t-lux mt-4 !text-[clamp(2.4rem,1rem+5vw,5.5rem)]">{p.title}</h1>
      <p className="t-lead mt-4 measure">{p.overview}</p>
      <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
        <div><dt className="t-label text-lavender">Discipline</dt><dd className="mt-1 font-semibold">{svc?.name}</dd></div>
        {p.location && <div><dt className="t-label text-lavender">Location</dt><dd className="mt-1 font-semibold">{p.location}</dd></div>}
        {p.year && <div><dt className="t-label text-lavender">Year</dt><dd className="mt-1 font-semibold">{p.year}</dd></div>}
      </dl>
      <div className="mt-10 grid gap-4">
        {media.map((m, i) => (
          <figure key={i}>
            {m.kind === "video" ? (
              <video src={m.src} poster={m.poster} controls preload="none" playsInline className="w-full rounded-2xl" aria-label={m.alt} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.src} width={m.width} height={m.height} alt={m.alt} className="w-full rounded-2xl" />
            )}
            <figcaption className="t-caption mt-2 text-indigo-80">{m.caption}{m.attribution ? ` Photo: ${m.attribution}.` : ""}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-12">
        <Block id="brief" title="The brief"><p className="t-body measure">{p.brief}</p></Block>
        <Block id="response" title="The design move"><p className="t-body measure">{p.response}</p></Block>
        {p.outcomes.length > 0 && <Block id="outcomes" title="Outcomes"><ul className="space-y-2">{p.outcomes.map((o) => <li key={o}>{o}</li>)}</ul></Block>}
      </div>
      <p className="mt-8"><Link href="/work" className="btn btn-outline">Back to all work <Arrow /></Link></p>
    </article>
  );
}
