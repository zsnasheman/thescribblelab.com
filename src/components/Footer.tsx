import Link from "next/link";
import { Logo } from "./Logo";
import { Magnetic, Arrow } from "./ui";
import { StudioClock } from "./StudioClock";
import { SITE } from "@/lib/site";
import { services } from "@/content";

export function Footer() {
  return (
    <footer className="mt-24">
      {/* Light panel: the full-colour logo always sits on a light field, with clear space */}
      <div className="container-x grid items-center gap-10 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="t-label text-lavender">Start a project</p>
          <h2 className="t-mega mt-5">What are you imagining?</h2>
          <div className="mt-10"><Magnetic><Link href="/start-a-project" className="btn btn-coral btn-lg">Start a project <Arrow /></Link></Magnetic></div>
        </div>
        <div className="md:col-span-5 md:justify-self-end"><Logo width={320} /></div>
      </div>

      <div className="on-dark bg-indigo text-white">
        <div className="container-x grid gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-balance font-[family-name:var(--font-display)] text-2xl font-light leading-snug md:text-3xl">{SITE.tagline}</p>
            <div className="mt-8"><StudioClock /></div>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 md:col-span-7">
            <div>
              <h2 className="t-label text-white/80">Studio</h2>
              <address className="mt-4 not-italic leading-relaxed">
                {SITE.contact.studio.map((l) => (<span key={l} className="block">{l}</span>))}
              </address>
              <p className="mt-4"><a className="link" href={SITE.contact.phoneHref}>{SITE.contact.phone}</a></p>
              <p><a className="link break-all" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a></p>
            </div>
            <div>
              <h2 className="t-label text-white/80">What we do</h2>
              <ul className="mt-4 space-y-2">
                {services.map((s) => (<li key={s.slug}><Link className="link" href={`/services/${s.slug}`}>{s.name}</Link></li>))}
              </ul>
            </div>
            <div>
              <h2 className="t-label text-white/80">Explore</h2>
              <ul className="mt-4 space-y-2">
                <li><Link className="link" href="/work">Work</Link></li>
                <li><Link className="link" href="/studio">Studio</Link></li>
                <li><Link className="link" href="/start-a-project">Start a project</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="container-x flex flex-col gap-2 py-6 sm:flex-row sm:justify-between">
            <p className="t-caption text-white/80">© {new Date().getFullYear()} The Scribble Lab. Dubai, UAE.</p>
            <p className="t-caption text-white/70">Photography shown is temporary placeholder imagery.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
