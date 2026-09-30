import Link from "next/link";
import { Bubbles } from "./ui";
import { processStages } from "@/content/process";

/** A compact, linked view of the five stages. The full explanation lives on Our approach. */
export function ProcessStrip() {
  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {processStages.map((s, i) => (
        <li key={s.id} className="group relative">
          <Link href={`/approach#stage-${s.id}`} className="block h-full rounded-xl border border-indigo/15 p-5 no-underline transition-colors hover:border-indigo hover:bg-white focus-visible:border-indigo">
            <Bubbles active={i + 1} size={7} />
            <p className="t-label mt-4 text-lavender">Stage <span className="tabular-nums">{i + 1}</span></p>
            <p className="t-h2 mt-1">{s.name}</p>
            <p className="t-caption mt-2 text-indigo-80">{s.line}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
