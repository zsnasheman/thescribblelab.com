import Link from "next/link";
import { Arrow } from "./ui";
import { VIGNETTES } from "@/content/art";

const v = VIGNETTES.events;

/** The closing invitation, used once on the homepage. */
export function Closing() {
  return (
    <section aria-labelledby="close-h" className="relative overflow-hidden pb-12 pt-16 md:pb-16 md:pt-24">
      <div aria-hidden="true" className="blob blob-3 pointer-events-none absolute -right-[8%] top-[6%] h-[78%] w-[50%] opacity-40" style={{ backgroundImage: "url(/art/t-wash.webp)" }} />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="t-label text-lavender">The conversation</p>
          <h2 id="close-h" className="t-mega mt-4">Let&rsquo;s make a place.</h2>
          <p className="t-lead mt-5 max-w-[34rem]">Tell us what you are imagining, in a short message or a full brief. A person reads every one.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/start-a-project" className="btn btn-coral btn-lg">Start a project <Arrow /></Link>
            <Link href="/contact" className="btn btn-outline btn-lg">Contact us</Link>
          </div>
        </div>
        <div className="pointer-events-none lg:col-span-6">
          <div className="art-stack mx-auto max-w-[36rem]" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.color} width={v.w} height={v.h} alt="" loading="lazy" decoding="async" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
