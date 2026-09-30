import Link from "next/link";
import { Photo } from "./Photo";
import { serviceBySlug } from "@/content/services";
import type { Project } from "@/content/types";

const ASPECT = { landscape: "aspect-[4/3]", portrait: "aspect-[4/5]", square: "aspect-square" } as const;

export function ProjectCard({ p, ratio }: { p: Project; ratio?: keyof typeof ASPECT }) {
  return (
    <article className="group">
      <Link href={`/work/${p.slug}`} className="block">
        <div className={`relative overflow-hidden rounded-lg bg-indigo-10 ${ASPECT[ratio ?? p.ratio]}`}>
          <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
            <Photo photo={p.photo} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
          </div>
        </div>
        <p className="t-label mt-5 text-lavender">{serviceBySlug(p.service)?.name}</p>
        <h3 className="t-h2 mt-2"><span className="draw-link">{p.title}</span></h3>
        <p className="t-body mt-1 text-indigo-80">{p.summary}</p>
        <p className="t-caption mt-3 inline-block rounded-full border border-indigo/25 px-3 py-1 font-semibold">
          {p.status === "concept" ? "Illustrative concept" : "Completed"}
        </p>
      </Link>
    </article>
  );
}
