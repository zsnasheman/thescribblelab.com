import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", description: "What The Scribble Lab collects through its forms, why, and who can see it." };

const Sec = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section aria-labelledby={id} className="border-t border-indigo/15 py-8 md:grid md:grid-cols-12 md:gap-10">
    <h2 id={id} className="t-h3 md:col-span-4">{title}</h2>
    <div className="mt-3 space-y-3 md:col-span-8 md:mt-0">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <>
      <PageHeader label="Privacy" title="What we collect, and why." lead="This page describes what the two forms on this website collect and how it is used. It is a draft for the studio owner to review before launch." />
      <div className="container-x max-w-5xl pb-16">
        <Sec id="who" title="Who is responsible">
          <p>The Scribble Lab, {SITE.contact.studio.join(", ")}. You can contact us at <a className="link" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.</p>
        </Sec>
        <Sec id="contact-form" title="The contact form">
          <p>When you send a short message we collect your name, email address, an optional phone number, the topic you chose and your message.</p>
        </Sec>
        <Sec id="brief-form" title="The project brief">
          <p>When you send a project brief we collect the kind of project, its location, an approximate scale and size, your brief, an optional budget range, your timing and any fixed date, your name, email address, an optional phone number and an optional company name.</p>
          <p>Budget and size are optional and are not treated as quotes or commitments.</p>
        </Sec>
        <Sec id="technical" title="Technical information">
          <p>To limit spam, each submission is stored with a one-way scrambled form of your IP address (not the address itself) and the name of your browser. The scrambled value cannot be turned back into your IP address. It is used only to count how many messages come from one connection in an hour.</p>
          <p>A hidden field in each form catches automated submissions. It does not collect anything from you.</p>
        </Sec>
        <Sec id="use" title="How it is used">
          <p>We use it to read and reply to your message or brief. We do not add you to a mailing list, and we do not sell your details.</p>
        </Sec>
        <Sec id="where" title="Where it is stored and who can see it">
          <p>Submissions are stored in a database provided by Supabase. The database is set so that website visitors cannot read or change stored submissions. Only the studio&rsquo;s authorised team can read them.</p>
          <p>No email notification is sent when a form is submitted, so the studio reads submissions in the database until a notification service is set up.</p>
        </Sec>
        <Sec id="keep" title="How long we keep it and your choices">
          <p>The retention period has not yet been set. <strong>Owner decision needed:</strong> how long to keep messages and briefs that do not lead to a project.</p>
          <p>You can ask us to show, correct or delete what you sent by writing to <a className="link" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a> and quoting the reference shown after you submitted.</p>
        </Sec>
        <Sec id="cookies" title="Cookies and analytics">
          <p>This website does not currently set advertising or analytics cookies. If that changes, this page will be updated first.</p>
        </Sec>
        <p className="t-caption mt-8 text-indigo-80">This draft describes how the website works today. It has not been reviewed by a lawyer. <Link href="/contact" className="link">Questions?</Link></p>
      </div>
    </>
  );
}
