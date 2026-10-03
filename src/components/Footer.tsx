import Link from "next/link";
import { FooterCta } from "./FooterCta";
import { StudioClock } from "./StudioClock";
import { SITE } from "@/lib/site";
import { services } from "@/content";

export function Footer() {
  const c = SITE.contact;
  return (
    <footer className="mt-20">
      <FooterCta />
      <div className="on-dark bg-indigo text-white">
        <div className="container-x grid gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-balance font-[family-name:var(--font-display)] text-2xl font-light leading-snug">{SITE.tagline}</p>
            <div className="mt-6"><StudioClock /></div>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 md:col-span-8">
            <div>
              <h2 className="t-label text-white/80">Studio</h2>
              <address className="mt-4 not-italic leading-relaxed">
                {c.studio.map((l) => (<span key={l} className="block">{l}</span>))}
              </address>
              <p className="t-caption mt-4 text-white/80">Warehouse</p>
              <address className="not-italic leading-relaxed">{c.warehouse.map((l) => (<span key={l} className="block">{l}</span>))}</address>
              <p className="mt-2"><a className="link t-caption" href={c.mapHref} target="_blank" rel="noopener noreferrer">Open in Maps<span className="sr-only"> (opens in a new tab)</span></a></p>
              <p className="mt-4"><a className="link" href={c.phoneHref}>{c.phone}</a></p>
              <p><a className="link" href={c.whatsappHref} rel="noopener">WhatsApp</a></p>
              <p><a className="link break-all" href={`mailto:${c.email}`}>{c.email}</a></p>
            </div>
            <div>
              <h2 className="t-label text-white/80">What we do</h2>
              <ul className="mt-4 space-y-2">{services.map((s) => (<li key={s.slug}><Link className="link" href={`/services/${s.slug}`}>{s.name}</Link></li>))}</ul>
            </div>
            <div>
              <h2 className="t-label text-white/80">The studio</h2>
              <ul className="mt-4 space-y-2">
                <li><Link className="link" href="/studio">Studio</Link></li>
                <li><Link className="link" href="/founder">Founder</Link></li>
                <li><Link className="link" href="/approach">Our approach</Link></li>
                <li><Link className="link" href="/work">Work</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="t-label text-white/80">Get in touch</h2>
              <ul className="mt-4 space-y-2">
                <li><Link className="link" href="/contact">Contact us</Link></li>
                <li><Link className="link" href="/start-a-project">Start a project</Link></li>
                <li><Link className="link" href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="container-x py-6"><p className="t-caption text-white/80">© {new Date().getFullYear()} The Scribble Lab. Dubai, UAE.</p></div>
        </div>
      </div>
    </footer>
  );
}
