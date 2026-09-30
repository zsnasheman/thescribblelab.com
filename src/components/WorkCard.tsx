import Link from "next/link";
import { ViewTransition } from "react";
import { Plate } from "./art/Plates";
import { serviceBySlug } from "@/content/services";
import type { Project } from "@/content/types";

const ASPECT = { landscape: "aspect-[4/3]", portrait: "aspect-[4/5]", square: "aspect-square" } as const;

/** A project card. The drawing is named so it can morph into the project page. */
export function WorkCard({ p, ratio, lead = false }: { p: Project; ratio?: keyof typeof ASPECT; lead?: boolean }) {
  return (
    <article className="group">
      <Link href={`/work/${p.slug}`} className="block">
        <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
          <div className={`relative overflow-hidden rounded-lg border border-indigo/15 bg-paper transition-[border-color,transform] duration-500 group-hover:border-indigo/40 group-hover:-translate-y-0.5 ${ASPECT[ratio ?? p.ratio]}`}>
            <Plate kind={p.plate} uid={`wc-${p.slug}`} label={`${p.title}: ${p.status === "concept" ? "concept drawing" : "project image"}`} className="absolute inset-0 h-full w-full transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
            <span className="t-label absolute left-3 top-3 rounded-full bg-indigo px-3 py-2 text-[0.625rem] text-white">{p.status === "concept" ? "Concept" : "Completed"}</span>
          </div>
        </ViewTransition>
        <p className="t-label mt-4 text-lavender">{serviceBySlug(p.service)?.name}</p>
        <h3 className={`${lead ? "t-h1" : "t-h2"} mt-2`}><span className="draw-link">{p.title}</span></h3>
        <p className="t-body mt-2 max-w-[52ch] text-indigo-80">{p.summary}</p>
      </Link>
    </article>
  );
}
