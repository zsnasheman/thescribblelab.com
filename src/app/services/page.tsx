import type { Metadata } from "next";
import Link from "next/link";
import { Art } from "@/components/Art";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Arrow } from "@/components/shapes";
import { services } from "@/content";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "Interiors, exhibitions, events, brand activations and kinetic windows, designed and built by one team.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="What we do"
        title="Five worlds, one team."
        lead="Design, fabrication and installation under one roof, so the idea you approve is the thing that gets built."
      />
      <section aria-label="Services" className="container-x space-y-16 pb-12 md:space-y-24">
        {services.map((s, i) => (
          <Reveal key={s.slug} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
            <Link
              href={`/services/${s.slug}`}
              aria-hidden="true"
              tabIndex={-1}
              className={`block md:col-span-6 ${i % 2 ? "md:order-2" : ""}`}
            >
              <Art variant={s.art} tone={s.tone} label="" className="aspect-[4/3] w-full rounded-sm" />
            </Link>
            <div className={`md:col-span-6 ${i % 2 ? "md:order-1" : ""}`}>
              <p className="t-label text-lavender">0{i + 1}</p>
              <h2 className="t-h1 mt-3">{s.name}</h2>
              <p className="t-lead mt-4 measure">{s.summary}</p>
              <Link href={`/services/${s.slug}`} className="btn btn-indigo mt-7">
                About {s.name.toLowerCase()} <Arrow />
              </Link>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
