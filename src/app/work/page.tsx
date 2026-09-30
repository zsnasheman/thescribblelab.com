import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { WorkCard } from "@/components/WorkCard";
import { allProjects, services } from "@/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Interiors, exhibitions, events, brand activations and kinetic windows by The Scribble Lab.",
};

const STATUS = [
  { id: "concept", label: "Concept studies" },
  { id: "completed", label: "Completed" },
] as const;

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ service?: string | string[]; status?: string | string[] }> }) {
  const sp = await searchParams;
  const one = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const svc = one(sp.service);
  const st = one(sp.status);
  const activeSvc = services.find((s) => s.slug === svc);
  const activeSt = STATUS.find((s) => s.id === st);
  const all = allProjects();
  const list = all.filter((p) => (!svc || p.service === svc) && (!st || p.status === st));
  const href = (service?: string, status?: string) => {
    const q = new URLSearchParams();
    if (service) q.set("service", service);
    if (status) q.set("status", status);
    const s = q.toString();
    return s ? `/work?${s}` : "/work";
  };
  const hasDemo = all.some((p) => p.isDemo);
  const hasCompleted = all.some((p) => p.status === "completed");
  const chip = (on: boolean) => `btn !min-h-11 !px-5 !py-2 ${on ? "btn-indigo" : "btn-outline"}`;

  return (
    <>
      <PageHeader label="Work" title="Spaces, stands, stages and windows." lead="Each study shows the brief, the key design move and the space that results." art={{ src: "/art/v-exhibitions.webp", w: 650, h: 432, alt: "" }} />
      <section aria-label="Work index" className="container-x pb-10">
        <div className={`grid gap-6 border-y border-indigo/15 py-6 md:items-center ${hasCompleted ? "md:grid-cols-[1fr_auto]" : ""}`}>
          <nav aria-label="Filter by discipline" className="flex flex-wrap gap-2">
            <Link href={href(undefined, st)} aria-current={!svc ? "true" : undefined} className={chip(!svc)}>All disciplines</Link>
            {services.map((s) => (
              <Link key={s.slug} href={href(s.slug, st)} aria-current={svc === s.slug ? "true" : undefined} className={chip(svc === s.slug)}>{s.name}</Link>
            ))}
          </nav>
          {hasCompleted && <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
            <Link href={href(svc, undefined)} aria-current={!st ? "true" : undefined} className={chip(!st)}>Any status</Link>
            {STATUS.map((s) => (<Link key={s.id} href={href(svc, s.id)} aria-current={st === s.id ? "true" : undefined} className={chip(st === s.id)}>{s.label}</Link>))}
          </nav>}
        </div>

        {hasDemo && (
          <p className="t-caption mt-6 max-w-3xl text-indigo-80">
            <strong className="text-indigo">Concept studies</strong> are original illustrations that show the kind of project the studio takes on. They are not commissioned work.
          </p>
        )}
        <p className="t-caption mt-4 text-indigo-80" aria-live="polite">
          {list.length} {list.length === 1 ? "entry" : "entries"}{activeSvc ? ` · ${activeSvc.name}` : ""}{activeSt ? ` · ${activeSt.label.toLowerCase()}` : ""}
        </p>

        {list.length === 0 ? (
          <div className="mt-6 rounded-xl border border-indigo/20 p-8 md:p-12">
            <h2 className="t-h2">{svc && !activeSvc ? "We do not have a discipline with that name." : "Nothing matches those filters."}</h2>
            <p className="t-body mt-3 measure">Clear the filters to see every study, or tell us about what you are planning.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/work" className="btn btn-outline">Clear filters</Link>
              <Link href="/start-a-project" className="btn btn-coral">Start a project</Link>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (<li key={p.slug}><WorkCard p={p} /></li>))}
          </ul>
        )}
      </section>
    </>
  );
}
