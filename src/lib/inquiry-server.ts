import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";

/** A short, readable reference such as SL-2026-MYK3Y. */
export function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const code = Array.from(randomBytes(5), (b) => alphabet[b % alphabet.length]).join("");
  return `SL-${new Date().getUTCFullYear()}-${code}`;
}

/** The visitor's IP, hashed with a salt, so rate limiting works without storing the address. */
export async function visitorFingerprint(): Promise<{ ipHash: string; userAgent: string }> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const salt = process.env.INQUIRY_HASH_SALT ?? "scribble-lab";
  return {
    ipHash: createHash("sha256").update(`${salt}:${ip}`).digest("hex"),
    userAgent: (h.get("user-agent") ?? "").slice(0, 300),
  };
}

export const MAX_PER_HOUR = 5;

/** Database errors that mean "the backend is not ready", not "the visitor did something wrong". */
export const NOT_READY_CODES = new Set(["42P01", "42501", "PGRST205", "42703", "23502", "PGRST204"]);
