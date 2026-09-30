import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/Photo";
import { ProjectCard } from "@/components/ProjectCard";
import { Arrow } from "@/components/ui";
import { projectsForService, serviceBySlug, services } from "@/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  return s ? { title: s.name, description: s.summary } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  const related = projectsForService(s.slug);

  return (
    <>
      <header className="on-dark bg-indigo text-white">
        <div className="container-x grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb" className="t-caption mb-6 text-white/85">
              <Link className="link" href="/services">What we do</Link>
            </nav>
            <h1 className="t-mega">{s.name}</h1>
            <p className="t-lead mt-6 max-w-[40ch] text-white/90">{s.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/start-a-project?type=${s.slug}`} className="btn btn-coral">
                Start a {s.name.toLowerCase()} project <Arrow />
              </Link>
              <Link href={`/work?service=${s.slug}`} className="btn btn-outline text-white">
                See related work
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Photo photo={s.photo} sizes="(min-width:1024px) 50vw, 100vw" priority /></div>
          </div>
        </div>
      </header>

      <section className="container-x grid gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="t-h2">What the work covers</h2>
          <ul className="mt-6 space-y-3">
            {s.covers.map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="t-h2">What we usually ask first</h2>
          <ul className="mt-6 space-y-3">
            {s.firstQuestions.map((q) => (
              <li key={q} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-lavender" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="related" className="container-x pb-12">
        <h2 id="related" className="t-h2">Related work</h2>
        {related.length ? (
          <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}><ProjectCard p={p} /></li>
            ))}
          </ul>
        ) : (
          <p className="t-body mt-4 measure">No {s.name.toLowerCase()} projects are published yet.</p>
        )}
      </section>

      <section className="container-x py-12">
        <div className="rounded-xl bg-white p-8 md:flex md:items-center md:justify-between md:gap-10 md:p-12">
          <div>
            <h2 className="t-h2">Have a {s.name.toLowerCase()} project in mind?</h2>
            <p className="t-body mt-2 measure">A short brief is enough to begin.</p>
          </div>
          <Link href={`/start-a-project?type=${s.slug}`} className="btn btn-coral mt-6 md:mt-0">
            Start a project <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
