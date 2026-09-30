import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FounderBlock } from "@/components/PeopleCta";
import { Bubbles, StripeBlob } from "@/components/shapes";
import { Arrow } from "@/components/shapes";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description: "A Dubai design and build studio. Who we are, how we work and how to reach us.",
};

const values = [
  { name: "Crafted", body: "We sweat the joinery, the finish and the last millimetre." },
  { name: "Bold", body: "We pitch the idea that makes people stop walking." },
  { name: "Curious", body: "We test materials, mechanisms and new technology." },
  { name: "Borderless", body: "Creative talent without borders, one studio across many cities." },
];

export default function StudioPage() {
  return (
    <>
      <PageHeader
        label="Studio"
        title="Makers who draw, and drawers who make."
        lead="The Scribble Lab is a creative design and build agency headquartered in Dubai. We take ideas from the first sketch to finished spaces."
      />

      <section className="container-x py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="t-h2">Purpose</h2>
            <p className="t-lead mt-4">To turn ideas into places people remember.</p>
          </div>
          <div className="md:col-span-7">
            <h2 className="t-h2">How we work</h2>
            <p className="t-body mt-4 measure">
              One team handles design, fabrication and installation. We design boldly, build precisely
              and deliver on time, whether the brief is one shop window or a hundred-city rollout.
            </p>
            <p className="t-body mt-4 measure">
              We lean playful and bold, and the build side keeps us grounded. For luxury clients we
              move one step toward serious and quiet.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Values" className="on-dark relative overflow-hidden bg-indigo py-16 text-white md:py-24">
        <StripeBlob kind="c" className="pointer-events-none absolute -right-16 -top-10 h-44 w-64 opacity-95" />
        <div className="container-x relative">
          <h2 className="t-h1">What we care about</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.name} className="border-t border-white/30 pt-4">
                <dt className="t-h3">{v.name}</dt>
                <dd className="t-body mt-2 text-white/90">{v.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <FounderBlock />
      </section>

      <section aria-labelledby="visit" className="container-x pb-12">
        <div className="grid gap-10 rounded-md bg-white p-8 shadow-[8px_8px_0_var(--color-indigo-10)] md:grid-cols-12 md:p-12">
          <div className="md:col-span-5">
            <h2 id="visit" className="t-h2">Find the studio</h2>
            <Bubbles size={10} className="mt-5" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:col-span-7">
            <div>
              <h3 className="t-label text-lavender">Studio</h3>
              <address className="mt-3 not-italic">
                {SITE.contact.studio.map((l) => (<span key={l} className="block">{l}</span>))}
              </address>
            </div>
            <div>
              <h3 className="t-label text-lavender">Contact</h3>
              <p className="mt-3"><a className="link" href={SITE.contact.phoneHref}>{SITE.contact.phone}</a></p>
              <p><a className="link break-all" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a></p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Link href="/start-a-project" className="btn btn-coral">Start a project <Arrow /></Link>
        </div>
      </section>
    </>
  );
}
