import Link from "next/link";
import { categoryName, type PortfolioProject } from "@/content/portfolio";

export function ProjectCard({ p, eager = false }: { p: PortfolioProject; eager?: boolean }) {
  const img = p.images[0];
  return (
    <article className="group">
      <Link href={`/work/${p.slug}`} className="block no-underline">
        <span className="block overflow-hidden rounded-2xl bg-indigo/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.thumb} width={820} height={Math.round((820 * img.h) / img.w)} alt={`${p.title}${p.where ? `, ${p.where}` : ""}`} loading={eager ? "eager" : "lazy"} decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]" />
        </span>
        <span className="mt-4 block cap text-lavender">{categoryName(p.category)}{p.label ? ` · ${p.label}` : ""}</span>
        <span className="mt-1 block font-[family-name:var(--font-display)] text-[1.7rem] leading-tight"><span className="draw-link">{p.title}</span></span>
        {(p.where || p.year) && <span className="mt-1 block text-indigo-80">{[p.where, p.year].filter(Boolean).join(" · ")}</span>}
      </Link>
    </article>
  );
}
