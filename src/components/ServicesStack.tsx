import Link from "next/link";
import { Photo } from "./Photo";
import { Arrow } from "./ui";
import { services } from "@/content";

// Card backgrounds keep indigo dominant; coral is the spark; text colours follow the contrast table.
const SKIN = [
  { bg: "bg-indigo text-white on-dark", sub: "text-white/85", line: "border-white/25" },
  { bg: "bg-coral text-indigo", sub: "text-indigo/90", line: "border-indigo/30" },
  { bg: "bg-lavender text-white on-dark", sub: "text-white/90", line: "border-white/30" },
  { bg: "bg-indigo text-white on-dark", sub: "text-white/85", line: "border-white/25" },
  { bg: "bg-white text-indigo border border-indigo/15", sub: "text-indigo-80", line: "border-indigo/20" },
];

/** Cards stack as you scroll (normal scrolling, nothing is pinned for long). Plain stack on mobile. */
export function ServicesStack() {
  return (
    <ol className="space-y-6 md:space-y-0">
      {services.map((s, i) => {
        const k = SKIN[i];
        return (
          <li key={s.slug} className="md:sticky md:pb-6" style={{ top: `calc(5.5rem + ${i * 1.1}rem)` }}>
            <article className={`group grid overflow-hidden rounded-xl md:min-h-[32rem] md:grid-cols-12 ${k.bg}`}>
              <div className="flex flex-col justify-between p-6 md:col-span-6 md:p-12">
                <div className="flex items-start justify-between gap-6">
                  <span className="t-label tabular-nums">0{i + 1} / 05</span>
                </div>
                <div className="mt-10 md:mt-20">
                  <h3 className="t-display">{s.name}</h3>
                  <p className={`t-lead mt-5 max-w-[42ch] ${k.sub}`}>{s.summary}</p>
                  <ul className={`mt-6 divide-y ${k.line} border-y ${k.line}`}>
                    {s.covers.slice(0, 3).map((c) => (<li key={c} className="py-2.5">{c}</li>))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href={`/services/${s.slug}`} className="btn btn-outline">About {s.name.toLowerCase()} <Arrow /></Link>
                    <Link href={`/work?service=${s.slug}`} className="draw-link self-center font-semibold no-underline">See related work</Link>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[18rem] overflow-hidden md:col-span-6 md:min-h-full">
                <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]">
                  <Photo photo={s.photo} sizes="(min-width:768px) 50vw, 100vw" />
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
