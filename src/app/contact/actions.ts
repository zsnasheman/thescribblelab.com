"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema, type ContactFieldErrors, type ContactResult } from "@/lib/contact";
import { MAX_PER_HOUR, NOT_READY_CODES, makeReference, visitorFingerprint } from "@/lib/inquiry-server";

/**
 * Stores a short contact message in the same protected table as detailed briefs,
 * marked source = 'contact'. Success is returned only after the database confirms the insert.
 * Until supabase/migrations/20261001000000_contact_source.sql has been run, the insert is
 * refused by the database and the visitor sees the honest "not sent" state.
 */
export async function submitContact(raw: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0]) as keyof ContactFieldErrors;
      if (!fieldErrors[k]) fieldErrors[k] = i.message;
    }
    if (fieldErrors.website) return { status: "error" };
    return { status: "invalid", fieldErrors };
  }
  const d = parsed.data;

  const db = createAdminClient();
  if (!db) return { status: "unavailable" };
  const { ipHash, userAgent } = await visitorFingerprint();

  try {
    const existing = await db.from("inquiries").select("reference").eq("idempotency_key", d.idempotencyKey).maybeSingle();
    if (existing.data?.reference) return { status: "ok", reference: existing.data.reference, duplicate: true };

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await db.from("inquiries").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if (!recent.error && (recent.count ?? 0) >= MAX_PER_HOUR) return { status: "rate_limited" };

    const reference = makeReference();
    const { error } = await db.from("inquiries").insert({
      source: "contact",
      reference,
      topic: d.topic,
      message: d.message,
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      consent: true,
      idempotency_key: d.idempotencyKey,
      ip_hash: ipHash,
      user_agent: userAgent,
    });
    if (error) {
      if (error.code === "23505") {
        const again = await db.from("inquiries").select("reference").eq("idempotency_key", d.idempotencyKey).maybeSingle();
        if (again.data?.reference) return { status: "ok", reference: again.data.reference, duplicate: true };
      }
      if (error.code && NOT_READY_CODES.has(error.code)) return { status: "unavailable" };
      return { status: "error" };
    }
    return { status: "ok", reference };
  } catch {
    return { status: "error" };
  }
}
