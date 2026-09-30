"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { submitContact } from "@/app/contact/actions";
import { contactSchema, TOPICS, type ContactResult } from "@/lib/contact";
import { SITE } from "@/lib/site";

type Data = { name: string; email: string; phone: string; topic: string; message: string; consent: boolean; website: string };
const empty: Data = { name: "", email: "", phone: "", topic: "", message: "", consent: false, website: "" };
const inputCls = "w-full rounded-md border-2 border-indigo/30 bg-white px-4 py-3 text-base text-indigo placeholder:text-indigo-80/70 focus:border-indigo aria-[invalid=true]:border-[#9b1c1c]";
const fid = (id: string, k: string) => `${id}-${k}`;

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={`${id}-err`} className="mt-2 flex gap-2 font-semibold text-[#9b1c1c]"><span aria-hidden="true">●</span> {msg}</p> : null;
}

export function ContactForm() {
  const id = useId().replace(/:/g, "");
  const [d, setD] = useState<Data>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);
  const [copied, setCopied] = useState(false);
  const key = useRef("");
  const headRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => { if (!key.current) key.current = crypto.randomUUID(); }, []);
  useEffect(() => { if (first.current) { first.current = false; return; } headRef.current?.focus(); }, [result]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    if (errors[k as string]) setErrors((e) => { const n = { ...e }; delete n[k as string]; return n; });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    const parsed = contactSchema.safeParse({ ...d, idempotencyKey: key.current || crypto.randomUUID() });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) { const k = String(i.path[0]); if (!errs[k]) errs[k] = i.message; }
      delete errs.idempotencyKey;
      setErrors(errs);
      const firstKey = ["name", "email", "phone", "topic", "message", "consent"].find((k) => errs[k]);
      if (firstKey) requestAnimationFrame(() => document.getElementById(fid(id, firstKey))?.focus());
      return;
    }
    setPending(true);
    try {
      const res = await submitContact({ ...d, idempotencyKey: key.current });
      if (res.status === "invalid") setErrors(Object.fromEntries(Object.entries(res.fieldErrors).map(([k, v]) => [k, v as string])));
      else setResult(res);
    } catch { setResult({ status: "error" }); }
    finally { setPending(false); }
  };

  const text = `Topic: ${TOPICS.find((t) => t.value === d.topic)?.label ?? d.topic}\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "Not provided"}\n\n${d.message}`;
  const mailto = `mailto:${SITE.contact.email}?subject=${encodeURIComponent("Message from the website")}&body=${encodeURIComponent(text)}`;
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* the text is still on screen */ } };

  if (result?.status === "ok") {
    return (
      <div role="status" className="rounded-xl border-2 border-indigo p-8">
        <h2 ref={headRef} tabIndex={-1} className="t-h1 outline-none">Message received.</h2>
        <p className="t-lead mt-4 measure">Thank you, {d.name.split(" ")[0]}. We will read it and reply to <strong>{d.email}</strong>.</p>
        <p className="t-body mt-3">Your reference is <span className="border-b-2 border-emerald font-semibold tabular-nums">{result.reference}</span>{result.duplicate ? " (this message had already been received, so nothing was duplicated)" : ""}.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link href="/" className="btn btn-indigo">Back to the homepage</Link><Link href="/work" className="btn btn-outline">See our work</Link></div>
      </div>
    );
  }
  if (result && result.status !== "invalid") {
    const why = result.status === "unavailable" ? "This page cannot send messages right now." : result.status === "rate_limited" ? "Several messages have come from this connection in the last hour, so this one was not sent." : "Something went wrong and we could not confirm that your message was received.";
    return (
      <div role="alert" className="rounded-xl border-2 border-coral p-8">
        <h2 ref={headRef} tabIndex={-1} className="t-h2 outline-none">Your message has not been sent</h2>
        <p className="t-body mt-3 measure">{why} Nothing has been confirmed as sent, and your words are still here.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={mailto} className="btn btn-coral">Email it instead</a>
          <button type="button" className="btn btn-outline" onClick={copy}>{copied ? "Copied" : "Copy your message"}</button>
          <button type="button" className="btn btn-outline" onClick={() => setResult(null)}>Go back and try again</button>
        </div>
        <p className="t-body mt-5">Or call <a className="link" href={SITE.contact.phoneHref}>{SITE.contact.phone}</a>, or message us on <a className="link" href={SITE.contact.whatsappHref} rel="noopener">WhatsApp</a>.</p>
      </div>
    );
  }

  const n = Object.keys(errors).length;
  const fieldDesc = (k: string) => (errors[k] ? `${fid(id, k)}-err` : undefined);
  return (
    <form noValidate onSubmit={submit} aria-label="Send us a message">
      {n > 0 && <p role="alert" className="mb-6 rounded-md border-2 border-[#9b1c1c] px-4 py-3 font-semibold text-[#9b1c1c]">Please check {n === 1 ? "one answer" : `${n} answers`} below.</p>}
      <div className="grid gap-6 sm:grid-cols-2">
        <div><label htmlFor={fid(id, "name")} className="t-h3 block">Your name</label>
          <input id={fid(id, "name")} className={`${inputCls} mt-2`} value={d.name} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={fieldDesc("name")} onChange={(e) => set("name", e.target.value)} /><Err id={fid(id, "name")} msg={errors.name} /></div>
        <div><label htmlFor={fid(id, "email")} className="t-h3 block">Email</label>
          <input id={fid(id, "email")} type="email" inputMode="email" className={`${inputCls} mt-2`} value={d.email} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={fieldDesc("email")} onChange={(e) => set("email", e.target.value)} /><Err id={fid(id, "email")} msg={errors.email} /></div>
        <div><label htmlFor={fid(id, "phone")} className="t-h3 block">Phone <span className="t-caption font-normal text-indigo-80">Optional</span></label>
          <input id={fid(id, "phone")} type="tel" inputMode="tel" className={`${inputCls} mt-2`} value={d.phone} autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={fieldDesc("phone")} onChange={(e) => set("phone", e.target.value)} /><Err id={fid(id, "phone")} msg={errors.phone} /></div>
        <div><label htmlFor={fid(id, "topic")} className="t-h3 block">What is it about?</label>
          <select id={fid(id, "topic")} className={`${inputCls} mt-2`} value={d.topic} aria-invalid={!!errors.topic} aria-describedby={fieldDesc("topic")} onChange={(e) => set("topic", e.target.value)}>
            <option value="">Choose a topic</option>{TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select><Err id={fid(id, "topic")} msg={errors.topic} /></div>
      </div>
      <div className="mt-6"><label htmlFor={fid(id, "message")} className="t-h3 block">Your message</label>
        <textarea id={fid(id, "message")} rows={6} maxLength={2000} className={`${inputCls} mt-2`} value={d.message} aria-invalid={!!errors.message} aria-describedby={fieldDesc("message")} onChange={(e) => set("message", e.target.value)} />
        <p className="t-caption mt-1 text-right tabular-nums text-indigo-80">{d.message.length} / 2000</p><Err id={fid(id, "message")} msg={errors.message} /></div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input tabIndex={-1} autoComplete="off" value={d.website} onChange={(e) => set("website", e.target.value)} /></label></div>

      <div className="mt-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input id={fid(id, "consent")} type="checkbox" checked={d.consent} aria-invalid={!!errors.consent} aria-describedby={fieldDesc("consent")} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#2f2058]" />
          <span>I agree that The Scribble Lab may store this message and use my details to reply to it. <Link href="/privacy" className="link">How we handle your details</Link>.</span>
        </label>
        <Err id={fid(id, "consent")} msg={errors.consent} />
      </div>
      <div className="mt-8"><button type="submit" className="btn btn-indigo" disabled={pending} aria-disabled={pending}>{pending ? "Sending…" : "Send message"}</button></div>
    </form>
  );
}
