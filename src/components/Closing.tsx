import Link from "next/link";
import { Arrow } from "./ui";
import { shot } from "@/content/showcase";
import { SITE } from "@/lib/site";

/** The invitation: a full-bleed image, a clear action and the verified details. */
export function Closing() {
  const c = SITE.contact;
  const m = shot("al-hilal-bank-youth-centre", 0);
  return (
    <section aria-labelledby="close-h" className="relative isolate overflow-hidden bg-ink py-24 text-white md:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.image.src} width={m.image.w} height={m.image.h} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/80" />
      </div>
      <div className="container-x text-center">
        <p className="t-label text-white/90">The conversation</p>
        <h2 id="close-h" className="t-lux mx-auto mt-4 max-w-[12ch]">Let&rsquo;s make a place.</h2>
        <p className="mx-auto mt-6 max-w-[34rem] text-lg text-white/95">Tell us what you are imagining, in a short message or a full brief. A person reads every one.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/start-a-project" className="btn btn-coral btn-lg">Start a project <Arrow /></Link>
          <Link href="/contact" className="btn btn-outline btn-lg text-white">Contact us</Link>
        </div>
        <p className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-semibold">
          <a className="link" href={c.phoneHref}>{c.phone}</a>
          <a className="link" href={c.whatsappHref} rel="noopener">WhatsApp</a>
          <a className="link" href={`mailto:${c.email}`}>{c.email}</a>
        </p>
      </div>
    </section>
  );
}
