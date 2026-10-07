import Link from "next/link";
import { CategoryPan } from "@/components/CategoryPan";
import { Closing } from "@/components/Closing";
import { Orbit } from "@/components/Orbit";
import { ProcessList } from "@/components/ProcessList";
import { Slide } from "@/components/Slide";
import { SlideCoral, SlideFollows, SlideHero, SlideLandscape, SlideLavender, SlideLoupe, SlideStats } from "@/components/HomeSlides";
import { Arrow } from "@/components/ui";

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <SlideHero />
      <SlideCoral />
      <SlideLandscape />
      <CategoryPan />
      <SlideFollows />
      <SlideLavender />
        <SlideLoupe />
      <SlideStats />

      <section id="work" aria-labelledby="work-h" className="container-x py-20 md:py-28">
        <Slide from="left">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <h2 id="work-h" className="cond text-[clamp(2.6rem,1rem+6vw,6.5rem)] text-indigo">Featured projects</h2>
            <Link href="/work" className="btn btn-outline">View all <Arrow /></Link>
          </div>
        </Slide>
        <Orbit />
      </section>

      <section aria-labelledby="delivery-h" className="container-x py-16 md:py-28"><ProcessList /></section>
      <Closing />
    </div>
  );
}
