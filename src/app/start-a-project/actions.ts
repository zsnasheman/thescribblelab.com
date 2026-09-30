"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { inquirySchema, type FieldErrors, type InquiryResult } from "@/lib/inquiry";
import { MAX_PER_HOUR, NOT_READY_CODES, makeReference, visitorFingerprint } from "@/lib/inquiry-server";

/**
 * Validates on the server, then stores the brief with the service-role client.
 * Returns "ok" only after the database confirms the insert. Public visitors have
 * no read access to the table (see supabase/migrations).
 */
export async function submitInquiry(raw: unknown): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0]) as keyof FieldErrors;
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    // A filled honeypot is silently treated as a generic failure, not described to bots.
    if (fieldErrors.website) return { status: "error" };
    return { status: "invalid", fieldErrors };
  }
  const d = parsed.data;

  const db = createAdminClient();
  if (!db) return { status: "unavailable" };

  const { ipHash, userAgent } = await visitorFingerprint();

  try {
    // Duplicate submission (double click, retry): return the original reference.
    const existing = await db
      .from("inquiries")
      .select("reference")
      .eq("idempotency_key", d.idempotencyKey)
      .maybeSingle();
    if (existing.data?.reference) {
      return { status: "ok", reference: existing.data.reference, duplicate: true };
    }

    // Simple abuse protection: limit briefs per hashed IP.
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await db
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (!recent.error && (recent.count ?? 0) >= MAX_PER_HOUR) return { status: "rate_limited" };

    const reference = makeReference();
    const { error } = await db.from("inquiries").insert({
      reference,
      types: d.types,
      location: d.location,
      scale: d.scale,
      size_note: d.sizeNote || null,
      brief: d.brief,
      budget: d.budget || null,
      timing: d.timing,
      timing_note: d.timingNote || null,
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      company: d.company || null,
      consent: true,
      idempotency_key: d.idempotencyKey,
      ip_hash: ipHash,
      user_agent: userAgent,
    });

    if (error) {
      // Unique violation on idempotency_key: a parallel duplicate won the race.
      if (error.code === "23505") {
        const again = await db.from("inquiries").select("reference").eq("idempotency_key", d.idempotencyKey).maybeSingle();
        if (again.data?.reference) return { status: "ok", reference: again.data.reference, duplicate: true };
      }
      // Missing table or permissions: the backend is not ready, so say so honestly.
      if (error.code && NOT_READY_CODES.has(error.code)) {
        return { status: "unavailable" };
      }
      return { status: "error" };
    }
    return { status: "ok", reference };
  } catch {
    return { status: "error" };
  }
}
