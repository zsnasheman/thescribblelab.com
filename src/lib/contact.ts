import { z } from "zod";

export const TOPICS = [
  { value: "general", label: "A general question" },
  { value: "interiors", label: "Interiors" },
  { value: "exhibitions", label: "Exhibitions" },
  { value: "events", label: "Events" },
  { value: "brand-activations", label: "Brand activations" },
  { value: "kinetic-windows", label: "Kinetic windows" },
  { value: "other", label: "Something else" },
] as const;
const topicValues = TOPICS.map((t) => t.value) as [string, ...string[]];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please add your name.").max(100, "Keep this under 100 characters."),
  email: z.string().trim().email("Enter an email address we can reply to.").max(200),
  phone: z.string().trim().max(30, "Keep this under 30 characters.").regex(/^[+0-9()\-\s]*$/, "Use digits, spaces, + and - only.").optional().or(z.literal("")),
  topic: z.enum(topicValues, { message: "Choose what your message is about." }),
  message: z.string().trim().min(10, "A sentence or two is enough, at least 10 characters.").max(2000, "Please keep the message under 2,000 characters."),
  consent: z.literal(true, { message: "Please confirm so we can store and reply to your message." }),
  idempotencyKey: z.string().uuid(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;
export type ContactResult =
  | { status: "ok"; reference: string; duplicate?: boolean }
  | { status: "invalid"; fieldErrors: ContactFieldErrors }
  | { status: "rate_limited" }
  | { status: "unavailable" }
  | { status: "error" };
