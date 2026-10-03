import Link from "next/link";
import { Attitude } from "@/components/Attitude";
import { Closing } from "@/components/Closing";
import { HomeHero } from "@/components/HomeHero";
import { Orbit } from "@/components/Orbit";
import { ProcessList } from "@/components/ProcessList";
import { ServiceCutouts } from "@/components/ServiceCutouts";
import { Slide } from "@/components/Slide";
import { Arrow } from "@/components/ui";
import { WHY } from "@/content/showcase";

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <HomeHero />

      <section aria-labelledby="att-h" className="container-x py-20 md:py-32">
        <h2 id="att-h" className="sr-only">About the studio</h2>
        <Attitude />
      </section>

      <section id="work" aria-labelledby="work-h" className="container-x pb-16 md:pb-28">
        <Slide from="left">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-label text-lavender">Selected work</p>
              <h2 id="work-h" className="t-lux mt-3 max-w-[14ch] !text-[clamp(2.4rem,1rem+5vw,5.5rem)]">Our work, in orbit.</h2>
            </div>
            <Link href="/work" className="btn btn-outline">All work <Arrow /></Link>
          </div>
        </Slide>
        <Orbit />
      </section>

      <section id="breadth" aria-labelledby="practice-h" className="container-x py-16 md:py-28">
        <Slide from="right"><h2 id="practice-h" className="t-lux mb-12 max-w-[14ch] !text-[clamp(2.4rem,1rem+5vw,5.5rem)] md:mb-20">Five ways to shape a space.</h2></Slide>
        <ServiceCutouts />
      </section>

      <section aria-labelledby="why-h" className="container-x py-16 md:py-28">
        <Slide from="left">
          <p className="t-label text-lavender">Why The Scribble Lab</p>
          <h2 id="why-h" className="t-lux mb-10 mt-3 max-w-[16ch] !text-[clamp(2.2rem,1rem+4.2vw,4.75rem)]">Work that gets remembered.</h2>
        </Slide>
        <dl className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (<Slide key={w.t} from="up" delay={i * 90}><div className="border-t-2 border-indigo pt-4"><dt className="font-[family-name:var(--font-display)] text-2xl">{w.t}</dt><dd className="mt-3 text-indigo-80">{w.d}</dd></div></Slide>))}
        </dl>
      </section>

      <section aria-labelledby="delivery-h" className="container-x py-16 md:py-28"><ProcessList /></section>

      <Closing />
    </div>
  );
}
