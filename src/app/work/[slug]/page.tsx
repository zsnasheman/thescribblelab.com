import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/ui";
import { PORTFOLIO, categoryName, projectBySlug } from "@/content/portfolio";
import { serviceBySlug } from "@/content/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PORTFOLIO.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  const svc = serviceBySlug(p.service);
  const i = PORTFOLIO.findIndex((x) => x.slug === p.slug);
  const next = PORTFOLIO[(i + 1) % PORTFOLIO.length];
  const li = Math.max(0, p.images.findIndex((im) => im.w >= im.h));
  const lead = p.images[li];
  const rest = p.images.filter((_, k) => k !== li);
  const alt = `${p.title}${p.where ? `, ${p.where}` : ""}`;
  return (
    <article>
      <header className="container-x pb-8 pt-masthead">
        <nav aria-label="Breadcrumb" className="t-caption"><Link className="link" href="/work">Work</Link><span aria-hidden="true"> / </span><Link className="link" href={`/work?category=${p.category}`}>{categoryName(p.category)}</Link></nav>
        <h1 className="t-lux mt-4 max-w-[18ch] !text-[clamp(2.4rem,1rem+5.2vw,5.75rem)]">{p.title}</h1>
        <dl className="mt-8 grid gap-x-10 gap-y-4 border-t border-indigo/20 pt-5 sm:grid-cols-2 lg:grid-cols-5">
          {p.client && <div><dt className="cap text-lavender">Client</dt><dd className="mt-1 font-semibold">{p.client}</dd></div>}
          <div><dt className="cap text-lavender">Category</dt><dd className="mt-1 font-semibold">{categoryName(p.category)}</dd></div>
          {p.label && <div><dt className="cap text-lavender">Scope</dt><dd className="mt-1 font-semibold">{p.label}</dd></div>}
          {p.where && <div><dt className="cap text-lavender">Place</dt><dd className="mt-1 font-semibold">{p.where}</dd></div>}
          {p.year && <div><dt className="cap text-lavender">Year</dt><dd className="mt-1 font-semibold">{p.year}</dd></div>}
        </dl>
      </header>

      <div className="container-x">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lead.src} width={lead.w} height={lead.h} alt={alt} fetchPriority="high" className="w-full rounded-2xl" />
      </div>

      <section aria-label="About the project" className="container-x grid gap-10 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4"><p className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] leading-tight">{p.summary}</p></div>
        <div className="space-y-5 lg:col-span-7 lg:col-start-6">
          {p.paragraphs.map((t, k) => (<p key={k} className="t-lead">{t}</p>))}
          <p className="pt-2"><Link href={`/start-a-project?type=${p.service}`} className="btn btn-coral">Start a project like this <Arrow /></Link></p>
        </div>
      </section>

      {rest.length > 0 && (
        <section aria-label="Gallery" className="container-x pb-16">
          <ul className="grid gap-4 md:grid-cols-2">
            {rest.map((im, k) => (
              <li key={im.src} className={rest.length % 2 === 1 && k === 0 ? "md:col-span-2" : ""}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.src} width={im.w} height={im.h} alt={`${alt}, view ${k + 2}`} loading="lazy" decoding="async" className="w-full rounded-2xl" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="More projects" className="container-x flex flex-wrap items-center justify-between gap-6 border-t border-indigo/20 py-10">
        <Link href={`/services/${p.service}`} className="btn btn-outline">About {svc?.name.toLowerCase()}</Link>
        <Link href={`/work/${next.slug}`} className="font-[family-name:var(--font-display)] text-2xl no-underline md:text-3xl"><span className="draw-link">Next: {next.title}</span> <Arrow className="inline" /></Link>
      </nav>
    </article>
  );
}
