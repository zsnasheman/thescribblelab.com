import Link from "next/link";
import { Art } from "./Art";
import { serviceBySlug } from "@/content/services";
import type { Project } from "@/content/types";

const ASPECT = { landscape: "aspect-[4/3]", portrait: "aspect-[4/5]", square: "aspect-square" } as const;

export function ProjectCard({ p }: { p: Project }) {
  const svc = serviceBySlug(p.service);
  return (
    <article className="group">
      <Link href={`/work/${p.slug}`} className="block">
        <div className="overflow-hidden rounded-sm bg-indigo-10">
          <Art
            variant={p.art.variant}
            tone={p.art.tone}
            label={p.media[0]?.alt ?? p.title}
            className={`w-full transition-transform duration-[900ms] ease-[var(--ease-paper)] group-hover:scale-[1.035] group-focus-visible:scale-[1.035] ${ASPECT[p.ratio]}`}
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="t-label text-lavender">{svc?.name}</p>
            <h3 className="t-h3 mt-2 group-hover:underline group-hover:decoration-emerald group-hover:decoration-2 group-hover:underline-offset-4">
              {p.title}
            </h3>
            <p className="t-body mt-1 text-indigo-80">{p.summary}</p>
          </div>
        </div>
        <p className="t-caption mt-3 inline-block rounded-full border border-indigo/25 px-3 py-1 font-semibold">
          {p.status === "concept" ? "Illustrative concept" : "Completed"}
        </p>
      </Link>
    </article>
  );
}
