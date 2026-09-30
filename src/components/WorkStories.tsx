import Link from "next/link";
import { Reveal } from "./Reveal";
import { Arrow } from "./ui";
import { projectArt } from "@/content/art";
import { serviceBySlug } from "@/content/services";
import type { Project } from "@/content/types";

const BLOB = ["blob-1", "blob-2", "blob-3"] as const;
const TEX = ["/art/t-wash.webp", "/art/t-wash.webp", "/art/t-wash.webp"] as const;

/** Fewer, larger stories: the brief, the key design move and the spatial result. */
export function WorkStories({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {projects.map((p, i) => {
        const art = projectArt(p.slug, p.service);
        const flip = i % 2 === 1;
        return (
          <Reveal key={p.slug} as="article" className="grid items-center gap-x-14 gap-y-8 lg:grid-cols-12">
            <Link href={`/work/${p.slug}`} aria-label={`${p.title}, concept study`} className={`group relative block lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
              <div aria-hidden="true" className={`blob ${BLOB[i % 3]} absolute inset-[-4%_-2%_-6%_-4%] opacity-40`} style={{ backgroundImage: `url(${TEX[i % 3]})` }} />
              <div className="art-stack relative px-[6%] py-[4%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art.color} width={art.w} height={art.h} alt={art.alt} loading="lazy" decoding="async" className="w-full" />
              </div>
              <span className="t-label absolute left-3 top-3 rounded-full bg-paper px-3 py-2 text-[0.625rem] text-indigo shadow-sm">Concept study</span>
            </Link>
            <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
              <p className="t-label text-lavender">{serviceBySlug(p.service)?.name}</p>
              <h3 className="t-h1 mt-3"><Link href={`/work/${p.slug}`} className="no-underline"><span className="draw-link">{p.title}</span></Link></h3>
              <dl className="mt-6 space-y-5">
                <div><dt className="t-label text-indigo-80">The brief</dt><dd className="mt-1.5 max-w-[46ch]">{p.brief}</dd></div>
                <div><dt className="t-label text-indigo-80">The design move</dt><dd className="mt-1.5 max-w-[46ch]">{p.response}</dd></div>
                <div><dt className="t-label text-indigo-80">The space</dt><dd className="mt-1.5 max-w-[46ch]">{p.summary}</dd></div>
              </dl>
              <Link href={`/work/${p.slug}`} className="btn btn-outline mt-7">Read the study <Arrow /></Link>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
