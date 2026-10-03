import Link from "next/link";
import { Reveal } from "./Reveal";
import { Arrow } from "./ui";
import { processStages } from "@/content";

/** Thinking and delivery as five large steps: what happens, and what you receive. */
export function ProcessList() {
  return (
    <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <p className="t-label text-lavender">Thinking and delivery</p>
          <h2 id="delivery-h" className="t-lux mt-3 !text-[clamp(2.2rem,1rem+3.8vw,4.5rem)]">From sketch to site.</h2>
          <p className="t-lead mt-5 max-w-[30ch]">One team carries the idea from the first line to the handover.</p>
          <Link href="/approach" className="btn btn-outline mt-7">The full approach <Arrow /></Link>
        </div>
      </div>
      <ol className="lg:col-span-8">
        {processStages.map((s, i) => (
          <li key={s.id} className="border-t border-indigo/25 py-8 first:border-t-0 first:pt-0 md:py-10">
            <Reveal>
              <div className="grid gap-x-8 gap-y-2 md:grid-cols-[5rem_1fr]">
                <span className="font-[family-name:var(--font-display)] text-5xl font-light tabular-nums text-lavender">0{i + 1}</span>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] font-light">{s.name}</h3>
                  <p className="mt-2 max-w-[48ch] text-lg">{s.line}</p>
                  <p className="mt-3 text-indigo-80"><span className="font-semibold text-indigo">You receive:</span> {s.clientSees[0]}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
