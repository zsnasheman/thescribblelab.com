import Link from "next/link";
import { Arrow } from "./ui";
import { Reveal } from "./Reveal";
import { SITE } from "@/lib/site";

const SCRIBBLE =
  "M-0.36 0.07L-0.31 0.02L-0.27 0.11L-0.22 -0.01L-0.18 0.12L-0.13 -0.04C-0.11 -0.22 -0.04 -0.25 -0.01 -0.12C0.02 0.04 -0.03 0.2 -0.07 0.2C-0.15 0.2 -0.08 -0.17 0 -0.24C0.09 -0.29 0.12 0 0.09 0.14C0.07 0.24 0.02 0.25 0.01 0.2C0.04 -0.1 0.14 -0.27 0.2 -0.21C0.23 -0.18 0.26 -0.22 0.3 -0.2";

/** The invitation: the guide returns, redraws once as a ring, and frames the way to get in touch. */
export function Closing() {
  const c = SITE.contact;
  return (
    <section aria-labelledby="close-h" className="relative overflow-hidden pb-14 pt-16 md:pb-20 md:pt-24">
      <Reveal className="container-x relative">
        {/* The aperture returns as a frame around the invitation; the scribble redraws once as its keystone */}
        <div className="arch-frame relative mx-auto max-w-4xl rounded-t-[999px] border-[3px] border-b-0 border-coral px-5 pb-14 pt-24 text-center sm:px-10 md:pt-40">
          <svg aria-hidden="true" viewBox="-0.45 -0.35 0.9 0.6" className="absolute left-1/2 top-6 h-14 w-24 -translate-x-1/2 md:top-12 md:h-20 md:w-32" fill="none">
            <path d={SCRIBBLE} pathLength={1} className="ring" stroke="#2f2058" strokeWidth="0.04" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="t-label text-lavender">The conversation</p>
          <h2 id="close-h" className="t-mega mt-4">Let&rsquo;s make a place.</h2>
          <p className="t-lead mx-auto mt-5 max-w-[34rem]">Tell us what you are imagining, in a short message or a full brief. A person reads every one.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/start-a-project" className="btn btn-coral btn-lg">Start a project <Arrow /></Link>
            <Link href="/contact" className="btn btn-outline btn-lg">Contact us</Link>
          </div>
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-semibold">
            <a className="link" href={c.phoneHref}>{c.phone}</a>
            <a className="link" href={c.whatsappHref} rel="noopener">WhatsApp</a>
            <a className="link" href={`mailto:${c.email}`}>{c.email}</a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
