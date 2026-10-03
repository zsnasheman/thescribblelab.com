import Link from "next/link";
import { Cutout, Patch, STRIPES } from "./Cutout";
import { Arrow } from "./ui";
import { shot } from "@/content/showcase";

const A = shot("the-juice-beauty", 0), B = shot("ariel-platinum-gel", 0), C = shot("chopard-kinetic-windows", 0), D = shot("huda-beauty-bowling", 0);

/** White opening: headline on the left, project cutouts and logo-colour patches composed on the right. */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-h" data-hero className="relative overflow-hidden pb-14 pt-masthead lg:pb-20">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-6">
          <h1 id="hero-h">
            <span className="block font-[family-name:var(--font-display)] text-[clamp(1.6rem,0.9rem+2.2vw,2.8rem)] italic leading-none">Small scribbles.</span>
            <span className="mt-2 block font-[family-name:var(--font-display)] text-[clamp(2.4rem,0.4rem+6.4vw,7.4rem)] uppercase leading-[0.9] tracking-[-0.01em]">Extraordinary</span>
            <span className="block font-[family-name:var(--font-display)] text-[clamp(2.2rem,0.8rem+4.8vw,6rem)] italic leading-[0.95] text-lavender">spaces.</span>
          </h1>
          <p className="t-lead mt-6 max-w-[32rem]">We design and build interiors, exhibitions, events, brand activations and kinetic windows. We concept. We build. We leave a mark.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/work" className="btn btn-indigo btn-lg">Explore our work <Arrow /></Link>
            <Link href="/start-a-project" className="btn btn-coral btn-lg">Start a project</Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[40rem] lg:col-span-6 lg:max-w-none" aria-label="Selected project images">
          <Patch shape="blob-b" color="#e1dce9" className="inset-[-4%_-6%_-2%_6%]" />
          <Patch shape="circle" color="#2f2058" className="left-[44%] top-[44%] h-[16%] w-[16%]" />
          <Patch shape="pill" color={STRIPES} className="bottom-[2%] left-[8%] h-[11%] w-[30%] opacity-90" />
          <Patch shape="circle" color="#1e9e74" className="left-[2%] top-[4%] h-[7%] w-[7%]" />
          <Cutout src={A.image.src} alt={A.alt} shape="blob-a" patch="#ff663e" width={A.image.w} height={A.image.h} className="float-a absolute left-[2%] top-[8%] w-[62%]" eager />
          <Cutout src={B.image.thumb} alt={B.alt} shape="circle" patch="#6b5291" width={820} height={600} className="float-b absolute right-[0%] top-[0%] w-[36%]" eager />
          <Cutout src={C.image.thumb} alt={C.alt} shape="arch" patch="#1e9e74" ratio="4 / 5" width={820} height={600} className="float-a absolute bottom-[6%] right-[4%] w-[36%]" />
          <Cutout src={D.image.thumb} alt={D.alt} shape="pill" patch="#d99a12" ratio="1.6 / 1" width={820} height={600} className="float-b absolute bottom-[10%] left-[4%] w-[40%]" />
        </div>
      </div>
    </section>
  );
}
