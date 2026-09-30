import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. Server-only: never import from a client component,
 * and never log or return its key. Returns null when not configured so callers
 * can show an honest "unavailable" state.
 */
export function createAdminClient() {
  // SUPABASE_URL is read at runtime. NEXT_PUBLIC_SUPABASE_URL (inlined at build) is the fallback.
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
