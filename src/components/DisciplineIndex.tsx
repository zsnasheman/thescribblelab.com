import Link from "next/link";
import { Reveal } from "./Reveal";
import { Arrow } from "./ui";
import { services } from "@/content";

/** The breadth of the studio as a typographic index: each row goes straight to that discipline. */
export function DisciplineIndex() {
  return (
    <ol className="border-t border-indigo/25">
      {services.map((s, i) => (
        <li key={s.slug} className="border-b border-indigo/25">
          <Reveal>
            <Link href={`/services/${s.slug}`} className="group grid items-center gap-x-8 gap-y-2 py-6 no-underline md:grid-cols-[4rem_1fr_1.1fr_auto] md:py-9">
              <span className="t-label tabular-nums text-lavender">0{i + 1}</span>
              <span className="font-[family-name:var(--font-display)] text-[clamp(1.9rem,1rem+3.2vw,4rem)] font-light leading-none transition-transform duration-500 group-hover:translate-x-2 group-focus-visible:translate-x-2">{s.name}</span>
              <span className="max-w-[44ch] text-indigo-80">{s.short}</span>
              <span className="hidden h-12 w-12 place-items-center rounded-full border-2 border-indigo transition-colors group-hover:bg-indigo group-hover:text-white md:grid" aria-hidden="true"><Arrow /></span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
