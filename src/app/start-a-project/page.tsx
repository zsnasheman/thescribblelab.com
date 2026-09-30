import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHeader } from "@/components/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell The Scribble Lab about your space, stand, event, activation or window. A short brief is enough to begin.",
};

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const sp = await searchParams;
  const type = Array.isArray(sp.type) ? sp.type[0] : sp.type;

  return (
    <>
      <PageHeader
        label="Start a project"
        title="What are you imagining?"
        lead="Five short steps. You can go back and change anything before you send it."
      />
      <div className="container-x grid gap-12 pb-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <InquiryForm initialType={type} />
        </div>
        <aside aria-label="Prefer to talk?" className="lg:col-span-4">
          <div className="rounded-xl bg-white p-6 lg:sticky lg:top-28">
            <h2 className="t-h3">Prefer to talk?</h2>
            <p className="t-body mt-2">Call, message or write to us directly.</p>
            <p className="mt-4"><a className="link" href={SITE.contact.phoneHref}>{SITE.contact.phone}</a></p>
            <p><a className="link" href={SITE.contact.whatsappHref} rel="noopener">WhatsApp</a></p>
            <p><a className="link break-all" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a></p>
            <address className="t-caption mt-4 not-italic text-indigo-80">
              {SITE.contact.studio.map((l) => (<span key={l} className="block">{l}</span>))}
            </address>
          </div>
        </aside>
      </div>
    </>
  );
}
