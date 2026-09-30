"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  BUDGET_OPTIONS,
  SCALE_OPTIONS,
  TIMING_OPTIONS,
  TYPE_OPTIONS,
  labelOf,
  stepSchemas,
  type InquiryResult,
} from "@/lib/inquiry";
import { SITE } from "@/lib/site";
import { submitInquiry } from "@/app/start-a-project/actions";
import { Bubbles } from "./ui";

type Data = {
  types: string[];
  location: string;
  scale: string;
  sizeNote: string;
  brief: string;
  budget: string;
  timing: string;
  timingNote: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  consent: boolean;
  website: string;
};
type StepId = keyof typeof stepSchemas;

const STEPS: { id: StepId; title: string; short: string }[] = [
  { id: "type", title: "What are you planning?", short: "Project type" },
  { id: "place", title: "Where, and roughly how big?", short: "Location and scale" },
  { id: "brief", title: "Tell us about it", short: "Brief and budget" },
  { id: "timing", title: "When do you need it?", short: "Timing" },
  { id: "contact", title: "Your details, then review", short: "Contact and review" },
];

const FIELDS: Record<StepId, (keyof Data)[]> = {
  type: ["types"],
  place: ["location", "scale", "sizeNote"],
  brief: ["brief", "budget"],
  timing: ["timing", "timingNote"],
  contact: ["name", "email", "phone", "company", "consent"],
};

const empty = (types: string[]): Data => ({
  types, location: "", scale: "", sizeNote: "", brief: "", budget: "", timing: "", timingNote: "",
  name: "", email: "", phone: "", company: "", consent: false, website: "",
});

const fid = (k: string) => `f-${k}`;

function briefText(d: Data) {
  return [
    `Project type: ${d.types.map((t) => labelOf(TYPE_OPTIONS, t)).join(", ")}`,
    `Location: ${d.location}`,
    `Scale: ${labelOf(SCALE_OPTIONS, d.scale)}${d.sizeNote ? ` (${d.sizeNote})` : ""}`,
    `Budget: ${d.budget ? labelOf(BUDGET_OPTIONS, d.budget) : "Not provided"}`,
    `Timing: ${labelOf(TIMING_OPTIONS, d.timing)}${d.timingNote ? ` (${d.timingNote})` : ""}`,
    "",
    "Brief:",
    d.brief,
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone || "Not provided"}`,
    `Company: ${d.company || "Not provided"}`,
  ].join("\n");
}

function Field({
  k, label, hint, error, optional, children,
}: {
  k: string; label: string; hint?: string; error?: string; optional?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={fid(k)} className="t-h3 block">
        {label}
        {optional && <span className="t-caption ml-2 font-normal text-indigo-80">Optional</span>}
      </label>
      {hint && <p id={`${fid(k)}-hint`} className="t-caption mt-1 text-indigo-80">{hint}</p>}
      <div className="mt-3">{children}</div>
      {error && (
        <p id={`${fid(k)}-err`} className="mt-2 flex gap-2 font-semibold text-[#9b1c1c]">
          <span aria-hidden="true">●</span> {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border-2 border-indigo/30 bg-white px-4 py-3 text-base text-indigo placeholder:text-indigo-80/70 focus:border-indigo aria-[invalid=true]:border-[#9b1c1c]";

function describe(k: string, hasHint: boolean, hasErr: boolean) {
  return [hasHint && `${fid(k)}-hint`, hasErr && `${fid(k)}-err`].filter(Boolean).join(" ") || undefined;
}

function Choice({
  type, name, value, checked, onChange, label, hint,
}: {
  type: "checkbox" | "radio"; name: string; value: string; checked: boolean; onChange: () => void; label: string; hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border-2 border-indigo/20 bg-white p-4 transition-colors hover:border-indigo/50 has-[:checked]:border-indigo has-[:checked]:bg-lavender-20 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 shrink-0 accent-[#2f2058]"
      />
      <span>
        <span className="block font-semibold">{label}</span>
        {hint && <span className="t-caption block text-indigo-80">{hint}</span>}
      </span>
    </label>
  );
}

export function InquiryForm({ initialType }: { initialType?: string }) {
  const startTypes = TYPE_OPTIONS.some((o) => o.value === initialType) ? [initialType as string] : [];
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(() => empty(startTypes));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const keyRef = useRef<string>("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const formId = useId();

  useEffect(() => {
    if (!keyRef.current) keyRef.current = crypto.randomUUID();
  }, []);

  useEffect(() => {
    if (mounted.current) headingRef.current?.focus();
    mounted.current = true;
  }, [step, result]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k as string]) setErrors((e) => { const n = { ...e }; delete n[k as string]; return n; });
  };

  const validate = (id: StepId): Record<string, string> => {
    const pick = Object.fromEntries(FIELDS[id].map((k) => [k, data[k]]));
    const r = stepSchemas[id].safeParse(pick);
    if (r.success) return {};
    const out: Record<string, string> = {};
    for (const i of r.error.issues) { const k = String(i.path[0]); if (!out[k]) out[k] = i.message; }
    return out;
  };

  const focusFirst = (errs: Record<string, string>, id: StepId) => {
    const first = FIELDS[id].find((k) => errs[k]);
    if (first) requestAnimationFrame(() => document.getElementById(fid(first))?.focus());
  };

  const next = () => {
    const id = STEPS[step].id;
    const errs = validate(id);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirst(errs, id);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  const submit = async () => {
    if (pending) return;
    // Re-check every step so nothing invalid reaches the server.
    for (let i = 0; i < STEPS.length; i++) {
      const errs = validate(STEPS[i].id);
      if (Object.keys(errs).length) {
        setErrors(errs);
        setStep(i);
        return focusFirst(errs, STEPS[i].id);
      }
    }
    setPending(true);
    try {
      const res = await submitInquiry({ ...data, idempotencyKey: keyRef.current });
      if (res.status === "invalid") {
        const errs = Object.fromEntries(Object.entries(res.fieldErrors).map(([k, v]) => [k, v as string]));
        setErrors(errs);
        const idx = STEPS.findIndex((s) => FIELDS[s.id].some((k) => errs[k]));
        if (idx >= 0) setStep(idx);
      } else {
        setResult(res);
      }
    } catch {
      setResult({ status: "error" });
    } finally {
      setPending(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) next();
    else submit();
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText(data));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard unavailable; the text is still shown */ }
  };

  const errCount = Object.keys(errors).length;
  const mailto = `mailto:${SITE.contact.email}?subject=${encodeURIComponent("Project brief")}&body=${encodeURIComponent(briefText(data))}`;

  // ───────── Result panels ─────────
  if (result?.status === "ok") {
    return (
      <div className="rounded-xl bg-white p-8 md:p-12" role="status">
        <Bubbles size={12} />
        <h2 ref={headingRef} tabIndex={-1} className="t-h1 mt-6 outline-none">Brief received.</h2>
        <p className="t-lead mt-4 measure">
          Thank you, {data.name.split(" ")[0]}. We will read it and reply to <strong>{data.email}</strong>.
        </p>
        <p className="t-body mt-4">
          Your reference is <span className="border-b-2 border-emerald font-semibold tabular-nums">{result.reference}</span>
          {result.duplicate ? " (this brief had already been received, so nothing was duplicated)" : ""}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-indigo">Back to the homepage</Link>
          <Link href="/work" className="btn btn-outline">See our work</Link>
        </div>
      </div>
    );
  }

  if (result && result.status !== "invalid") {
    const copy =
      result.status === "unavailable"
        ? "This page cannot send briefs right now. Nothing has been sent."
        : result.status === "rate_limited"
          ? "We have received several briefs from this connection in the last hour, so this one was not sent. Nothing has been sent."
          : "Something went wrong and we could not confirm that your brief was received. Nothing has been confirmed as sent.";
    return (
      <div className="rounded-md border-2 border-coral bg-white p-8 md:p-12" role="alert">
        <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">Your brief has not been sent</h2>
        <p className="t-body mt-3 measure">{copy} Your answers are still here, so nothing is lost.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={mailto} className="btn btn-coral">Email it to us instead</a>
          <button type="button" className="btn btn-outline" onClick={copyBrief}>
            {copied ? "Copied" : "Copy your brief"}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setResult(null)}>
            Go back and try again
          </button>
        </div>
        <p className="t-body mt-6">
          Or call <a className="link" href={SITE.contact.phoneHref}>{SITE.contact.phone}</a> or write to{" "}
          <a className="link" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
        </p>
      </div>
    );
  }

  // ───────── Form ─────────
  const cur = STEPS[step];
  const E = errors;

  return (
    <form id={formId} noValidate onSubmit={onSubmit} aria-labelledby={`${formId}-h`}>
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-indigo/15 pb-5">
        <Bubbles active={step + 1} size={11} />
        <p className="t-caption font-semibold" aria-live="polite">
          Step <span className="tabular-nums">{step + 1}</span> of {STEPS.length} · {cur.short}
        </p>
      </div>

      <h2 id={`${formId}-h`} ref={headingRef} tabIndex={-1} className="t-h1 outline-none">{cur.title}</h2>

      {errCount > 0 && (
        <p role="alert" className="mt-5 rounded-md border-2 border-[#9b1c1c] bg-white px-4 py-3 font-semibold text-[#9b1c1c]">
          Please check {errCount === 1 ? "one answer" : `${errCount} answers`} on this step.
        </p>
      )}

      <div className="mt-8 space-y-8">
        {cur.id === "type" && (
          <fieldset aria-describedby={E.types ? fid("types-err") : undefined}>
            <legend className="t-body mb-3">Choose everything that applies.</legend>
            <div id={fid("types")} tabIndex={-1} className="grid gap-3 sm:grid-cols-2">
              {TYPE_OPTIONS.map((o) => (
                <Choice
                  key={o.value}
                  type="checkbox"
                  name="types"
                  value={o.value}
                  label={o.label}
                  hint={o.hint}
                  checked={data.types.includes(o.value)}
                  onChange={() => {
                    const has = data.types.includes(o.value);
                    let next = has ? data.types.filter((t) => t !== o.value) : [...data.types, o.value];
                    if (!has && o.value === "not-sure") next = ["not-sure"];
                    if (!has && o.value !== "not-sure") next = next.filter((t) => t !== "not-sure");
                    set("types", next);
                  }}
                />
              ))}
            </div>
            {E.types && <p id={fid("types-err")} className="mt-3 flex gap-2 font-semibold text-[#9b1c1c]"><span aria-hidden="true">●</span> {E.types}</p>}
          </fieldset>
        )}

        {cur.id === "place" && (
          <>
            <Field k="location" label="City or site" hint="Where will the project happen?" error={E.location}>
              <input id={fid("location")} className={inputCls} value={data.location} autoComplete="off"
                aria-invalid={!!E.location} aria-describedby={describe("location", true, !!E.location)}
                onChange={(e) => set("location", e.target.value)} placeholder="For example: Riyadh, or Dubai Design District" />
            </Field>
            <fieldset aria-describedby={E.scale ? fid("scale-err") : undefined}>
              <legend className="t-h3 mb-3">Approximate scale</legend>
              <div id={fid("scale")} tabIndex={-1} className="grid gap-3 sm:grid-cols-2">
                {SCALE_OPTIONS.map((o) => (
                  <Choice key={o.value} type="radio" name="scale" value={o.value} label={o.label} hint={o.hint}
                    checked={data.scale === o.value} onChange={() => set("scale", o.value)} />
                ))}
              </div>
              {E.scale && <p id={fid("scale-err")} className="mt-3 flex gap-2 font-semibold text-[#9b1c1c]"><span aria-hidden="true">●</span> {E.scale}</p>}
            </fieldset>
            <Field k="sizeNote" label="Size, if you know it" optional error={E.sizeNote}>
              <input id={fid("sizeNote")} className={inputCls} value={data.sizeNote} aria-invalid={!!E.sizeNote}
                aria-describedby={describe("sizeNote", false, !!E.sizeNote)}
                onChange={(e) => set("sizeNote", e.target.value)} placeholder="For example: 120 m², or a 6 m shopfront" />
            </Field>
          </>
        )}

        {cur.id === "brief" && (
          <>
            <Field k="brief" label="Your brief" hint="What is it, who is it for and what should it do? A few sentences is plenty." error={E.brief}>
              <textarea id={fid("brief")} rows={7} className={inputCls} value={data.brief} aria-invalid={!!E.brief}
                aria-describedby={describe("brief", true, !!E.brief)} maxLength={3000}
                onChange={(e) => set("brief", e.target.value)} />
              <p className="t-caption mt-1 text-right text-indigo-80 tabular-nums">{data.brief.length} / 3000</p>
            </Field>
            <Field k="budget" label="Approximate budget" optional hint="A range helps us suggest what is realistic. We do not quote from this form." error={E.budget}>
              <select id={fid("budget")} className={inputCls} value={data.budget}
                aria-describedby={describe("budget", true, !!E.budget)}
                onChange={(e) => set("budget", e.target.value)}>
                {BUDGET_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </Field>
          </>
        )}

        {cur.id === "timing" && (
          <>
            <fieldset aria-describedby={E.timing ? fid("timing-err") : undefined}>
              <legend className="t-h3 mb-3">When would you like it finished?</legend>
              <div id={fid("timing")} tabIndex={-1} className="grid gap-3 sm:grid-cols-2">
                {TIMING_OPTIONS.map((o) => (
                  <Choice key={o.value} type="radio" name="timing" value={o.value} label={o.label}
                    checked={data.timing === o.value} onChange={() => set("timing", o.value)} />
                ))}
              </div>
              {E.timing && <p id={fid("timing-err")} className="mt-3 flex gap-2 font-semibold text-[#9b1c1c]"><span aria-hidden="true">●</span> {E.timing}</p>}
            </fieldset>
            <Field k="timingNote" label="Any fixed date" optional hint="An event date, a show opening or a handover deadline." error={E.timingNote}>
              <input id={fid("timingNote")} className={inputCls} value={data.timingNote} aria-invalid={!!E.timingNote}
                aria-describedby={describe("timingNote", true, !!E.timingNote)}
                onChange={(e) => set("timingNote", e.target.value)} />
            </Field>
          </>
        )}

        {cur.id === "contact" && (
          <>
            <div className="grid gap-8 sm:grid-cols-2">
              <Field k="name" label="Your name" error={E.name}>
                <input id={fid("name")} className={inputCls} value={data.name} autoComplete="name" aria-invalid={!!E.name}
                  aria-describedby={describe("name", false, !!E.name)} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field k="email" label="Email" error={E.email}>
                <input id={fid("email")} type="email" inputMode="email" className={inputCls} value={data.email} autoComplete="email"
                  aria-invalid={!!E.email} aria-describedby={describe("email", false, !!E.email)} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field k="phone" label="Phone" optional error={E.phone}>
                <input id={fid("phone")} type="tel" inputMode="tel" className={inputCls} value={data.phone} autoComplete="tel"
                  aria-invalid={!!E.phone} aria-describedby={describe("phone", false, !!E.phone)} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field k="company" label="Company" optional error={E.company}>
                <input id={fid("company")} className={inputCls} value={data.company} autoComplete="organization"
                  aria-invalid={!!E.company} aria-describedby={describe("company", false, !!E.company)} onChange={(e) => set("company", e.target.value)} />
              </Field>
            </div>

            {/* Honeypot: hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>Website<input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} /></label>
            </div>

            {/* Review sheet, set like a drawing title block */}
            <section aria-labelledby={`${formId}-review`} className="rounded-md border-2 border-indigo bg-white">
              <div className="flex items-center justify-between border-b-2 border-indigo px-4 py-3">
                <h3 id={`${formId}-review`} className="t-label">Brief sheet · Review</h3>
                <span className="t-caption text-indigo-80">Not sent yet</span>
              </div>
              <dl className="divide-y divide-indigo/15">
                {[
                  { k: "Project", v: data.types.map((t) => labelOf(TYPE_OPTIONS, t)).join(", "), s: 0 },
                  { k: "Location", v: data.location, s: 1 },
                  { k: "Scale", v: `${labelOf(SCALE_OPTIONS, data.scale)}${data.sizeNote ? `, ${data.sizeNote}` : ""}`, s: 1 },
                  { k: "Brief", v: data.brief, s: 2 },
                  { k: "Budget", v: data.budget ? labelOf(BUDGET_OPTIONS, data.budget) : "Not provided", s: 2 },
                  { k: "Timing", v: `${labelOf(TIMING_OPTIONS, data.timing)}${data.timingNote ? `, ${data.timingNote}` : ""}`, s: 3 },
                ].map((r) => (
                  <div key={r.k} className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr_auto] sm:items-start sm:gap-4">
                    <dt className="t-label text-lavender">{r.k}</dt>
                    <dd className="whitespace-pre-line break-words">{r.v}</dd>
                    <dd>
                      <button type="button" className="link t-caption font-semibold" onClick={() => { setErrors({}); setStep(r.s); }}>
                        Edit<span className="sr-only"> {r.k.toLowerCase()}</span>
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input id={fid("consent")} type="checkbox" checked={data.consent}
                  aria-invalid={!!E.consent} aria-describedby={describe("consent", false, !!E.consent)}
                  onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#2f2058]" />
                <span>
                  I agree that The Scribble Lab may store this brief and use my details to reply to it.
                  <span className="t-caption block text-indigo-80">We will not add you to a mailing list. <Link href="/privacy" className="link">How we handle your details</Link>.</span>
                </span>
              </label>
              {E.consent && <p id={fid("consent-err")} className="mt-2 flex gap-2 font-semibold text-[#9b1c1c]"><span aria-hidden="true">●</span> {E.consent}</p>}
            </div>
          </>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-indigo/15 pt-6">
        {step > 0 && (<button type="button" className="btn btn-outline" onClick={back} disabled={pending}>Back</button>)}
        {step < STEPS.length - 1 ? (
          <button type="submit" className="btn btn-indigo">Next: {STEPS[step + 1].short.toLowerCase()}</button>
        ) : (
          <button type="submit" className="btn btn-coral" disabled={pending} aria-disabled={pending}>
            {pending ? "Sending…" : "Send brief"}
          </button>
        )}
      </div>
    </form>
  );
}
