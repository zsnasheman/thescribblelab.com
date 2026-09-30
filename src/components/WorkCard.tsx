import Link from "next/link";
import { ViewTransition } from "react";
import { projectArt } from "@/content/art";
import { serviceBySlug } from "@/content/services";
import type { Project } from "@/content/types";

const ASPECT = { landscape: "aspect-[4/3]", portrait: "aspect-[4/3]", square: "aspect-[4/3]" } as const;

/** A project card. Concept illustrations are labelled Concept study so they are never mistaken for completed work. */
export function WorkCard({ p, ratio, lead = false }: { p: Project; ratio?: keyof typeof ASPECT; lead?: boolean }) {
  const art = projectArt(p.slug, p.service);
  return (
    <article className="group">
      <Link href={`/work/${p.slug}`} className="block">
        <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
          <div className={`relative overflow-hidden rounded-2xl bg-lavender-20/70 ${ASPECT[ratio ?? p.ratio]}`}>
            <div className="art-stack absolute inset-0 grid place-items-center p-[4%] transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art.color} width={art.w} height={art.h} alt={art.alt} loading="lazy" decoding="async" className="max-h-full w-full object-contain" />
            </div>
            <span className="t-label absolute left-3 top-3 rounded-full bg-paper px-3 py-2 text-[0.625rem] text-indigo shadow-sm">{p.status === "concept" ? "Concept study" : "Completed"}</span>
          </div>
        </ViewTransition>
        <p className="t-label mt-4 text-lavender">{serviceBySlug(p.service)?.name}</p>
        <h3 className={`${lead ? "t-h1" : "t-h2"} mt-2`}><span className="draw-link">{p.title}</span></h3>
        <p className="t-body mt-2 max-w-[52ch] text-indigo-80">{p.summary}</p>
      </Link>
    </article>
  );
}
