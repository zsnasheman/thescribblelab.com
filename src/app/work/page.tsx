import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { allProjects, services } from "@/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Interiors, exhibitions, events, brand activations and kinetic windows by The Scribble Lab.",
};

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.service) ? sp.service[0] : sp.service;
  const active = services.find((s) => s.slug === raw);
  const all = allProjects();
  const list = raw ? all.filter((p) => p.service === raw) : all;
  const hasDemo = all.some((p) => p.isDemo);

  return (
    <>
      <PageHeader
        label="Work"
        title="Spaces, stands, stages and windows."
        lead="Filter by the kind of space. Every page can be shared with a direct link."
      />
      <section aria-label="Work index" className="container-x pb-12">
        <nav aria-label="Filter work by service" className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/work"
            aria-current={!raw ? "true" : undefined}
            className={`btn !min-h-11 !px-5 !py-2 ${!raw ? "btn-indigo" : "btn-outline"}`}
          >
            All
          </Link>
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/work?service=${s.slug}`}
              aria-current={raw === s.slug ? "true" : undefined}
              className={`btn !min-h-11 !px-5 !py-2 ${raw === s.slug ? "btn-indigo" : "btn-outline"}`}
            >
              {s.name}
            </Link>
          ))}
        </nav>

        {hasDemo && (
          <p className="t-caption mb-8 max-w-2xl rounded-md border border-indigo/20 bg-white px-4 py-3">
            <strong>Illustrative concepts.</strong> Approved case studies will replace these as they
            are published. None of the entries below is a completed client project.
          </p>
        )}

        <p className="t-caption mb-6 text-indigo-80" aria-live="polite">
          {list.length} {list.length === 1 ? "entry" : "entries"}
          {active ? ` in ${active.name.toLowerCase()}` : ""}
        </p>

        {list.length === 0 ? (
          <div className="rounded-md border border-indigo/15 bg-white p-8 md:p-12">
            <h2 className="t-h2">
              {raw && !active
                ? "We do not have a category with that name."
                : `No ${active ? active.name.toLowerCase() : ""} work published yet.`}
            </h2>
            <p className="t-body mt-3 measure">
              New projects are added as they are approved for publication. If you are planning
              something in this area, we would still like to hear about it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/work" className="btn btn-outline">Clear filter</Link>
              <Link href="/start-a-project" className="btn btn-coral">Start a project</Link>
            </div>
          </div>
        ) : (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.slug}>
                <ProjectCard p={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
