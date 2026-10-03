import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { CATEGORIES, PORTFOLIO } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Work",
  description: "Events, exhibitions, brand activations, kinetic windows, retail, commercial, residential and food and beverage projects by The Scribble Lab.",
};

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ category?: string | string[]; service?: string | string[] }> }) {
  const sp = await searchParams;
  const one = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const svc = one(sp.service);
  const cat = one(sp.category);
  const active = CATEGORIES.find((c) => c.id === cat);
  const list = PORTFOLIO.filter((p) => (!cat || p.category === cat) && (!svc || p.service === svc));
  const chip = (on: boolean) => `btn !min-h-11 !px-5 !py-2 ${on ? "btn-indigo" : "btn-outline"}`;
  return (
    <>
      <PageHeader label="Work" title="Spaces, stands, stages and windows." lead="Events, exhibitions, brand activations, kinetic windows and interiors. Choose a category to filter." />
      <section aria-label="Work index" className="container-x pb-20">
        <nav aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2 border-y border-indigo/20 py-5">
          <Link href="/work" aria-current={!cat && !svc ? "true" : undefined} className={chip(!cat && !svc)}>All work</Link>
          {CATEGORIES.map((c) => (<Link key={c.id} href={`/work?category=${c.id}`} aria-current={cat === c.id ? "true" : undefined} className={chip(cat === c.id)}>{c.name}</Link>))}
        </nav>
        <p className="t-caption mb-6 text-indigo-80" aria-live="polite">{list.length} {list.length === 1 ? "project" : "projects"}{active ? ` · ${active.name}` : ""}</p>
        {list.length ? (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{list.map((p, i) => (<li key={p.slug}><ProjectCard p={p} eager={i < 3} /></li>))}</ul>
        ) : (
          <div className="rounded-2xl border border-indigo/20 p-8 md:p-12">
            <h2 className="t-h2">Nothing matches that filter.</h2>
            <p className="t-body mt-3 measure">Clear the filter to see every project, or tell us about what you are planning.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/work" className="btn btn-outline">Show all work</Link><Link href="/start-a-project" className="btn btn-coral">Start a project</Link></div>
          </div>
        )}
      </section>
    </>
  );
}
