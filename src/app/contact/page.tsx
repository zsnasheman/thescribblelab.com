import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { Arrow } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact us", description: "Call, message or write to The Scribble Lab in Dubai, or send a quick message." };

export default function ContactPage() {
  const c = SITE.contact;
  const ways = [
    { label: "Call", value: c.phone, href: c.phoneHref, note: "Speak to the studio." },
    { label: "WhatsApp", value: c.phone, href: c.whatsappHref, note: "Send a message or a few photographs." },
    { label: "Email", value: c.email, href: `mailto:${c.email}`, note: "Write to us directly." },
  ];
  return (
    <>
      <PageHeader label="Contact us" title="Say hello." lead="A quick question, a first idea or a place you would like us to see. Reach us in whichever way is easiest, and a person will read it." />
      <section className="container-x grid gap-12 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="t-h2">Send a short message</h2>
          <p className="t-body mt-2 max-w-[56ch] text-indigo-80">For a quick conversation. If you already know the scope, the detailed brief helps us more.</p>
          <div className="mt-8"><ContactForm /></div>
        </div>
        <aside className="lg:col-span-5" aria-label="Other ways to reach us">
          <h2 className="t-h2">Or reach us directly</h2>
          <ul className="mt-6 grid gap-3">
            {ways.map((w) => (
              <li key={w.label}>
                <a href={w.href} rel={w.label === "WhatsApp" ? "noopener" : undefined} className="group flex items-center justify-between gap-4 rounded-xl border-2 border-indigo/25 p-4 no-underline transition-colors hover:border-indigo">
                  <span><span className="t-label block text-lavender">{w.label}</span><span className="t-h3 mt-1 block break-all">{w.value}</span><span className="t-caption text-indigo-80">{w.note}</span></span>
                  <Arrow className="shrink-0" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl bg-white p-6">
            <h3 className="t-label text-lavender">Studio</h3>
            <address className="mt-3 not-italic">{c.studio.map((l) => (<span key={l} className="block">{l}</span>))}</address>
            <p className="mt-3"><a className="link" href={c.mapHref} target="_blank" rel="noopener noreferrer">Open in Maps<span className="sr-only"> (opens in a new tab)</span></a></p>
          </div>
          <div className="mt-8 border-t border-indigo/15 pt-6">
            <h3 className="t-h3">Ready to share scope?</h3>
            <p className="t-body mt-2 text-indigo-80">The project brief takes five short steps and lets you say what, where, how big and when.</p>
            <Link href="/start-a-project" className="btn btn-coral mt-4">Start a project <Arrow /></Link>
          </div>
        </aside>
      </section>
    </>
  );
}
