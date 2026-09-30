import { z } from "zod";

export const TYPE_OPTIONS = [
  { value: "interiors", label: "Interiors", hint: "Residential or commercial design and fit-out" },
  { value: "exhibitions", label: "Exhibitions", hint: "A stand or pavilion" },
  { value: "events", label: "Events", hint: "A launch, set or staging" },
  { value: "brand-activations", label: "Brand activations", hint: "A pop-up or participatory experience" },
  { value: "kinetic-windows", label: "Kinetic windows", hint: "A retail window that moves" },
  { value: "not-sure", label: "Not sure yet", hint: "We can work it out together" },
] as const;

export const SCALE_OPTIONS = [
  { value: "small", label: "Small", hint: "A room, a single window or a small stand" },
  { value: "medium", label: "Medium", hint: "A floor, a mid-size stand or one event" },
  { value: "large", label: "Large", hint: "A pavilion, a venue or several sites" },
  { value: "not-sure", label: "Not sure yet", hint: "" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "under-50k", label: "Under AED 50,000" },
  { value: "50k-150k", label: "AED 50,000 to 150,000" },
  { value: "150k-500k", label: "AED 150,000 to 500,000" },
  { value: "500k-plus", label: "AED 500,000 and above" },
  { value: "to-discuss", label: "Happy to discuss" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const TIMING_OPTIONS = [
  { value: "within-1-month", label: "Within a month" },
  { value: "1-3-months", label: "In one to three months" },
  { value: "3-6-months", label: "In three to six months" },
  { value: "6-plus-months", label: "More than six months away" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

const typeValues = TYPE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const scaleValues = SCALE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const budgetValues = BUDGET_OPTIONS.map((o) => o.value) as [string, ...string[]];
const timingValues = TIMING_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const stepSchemas = {
  type: z.object({
    types: z.array(z.enum(typeValues)).min(1, "Choose at least one, or “Not sure yet”."),
  }),
  place: z.object({
    location: z.string().trim().min(2, "Tell us the city or site.").max(120, "Keep this under 120 characters."),
    scale: z.enum(scaleValues, { message: "Choose the closest scale, or “Not sure yet”." }),
    sizeNote: z.string().trim().max(120, "Keep this under 120 characters.").optional().or(z.literal("")),
  }),
  brief: z.object({
    brief: z
      .string()
      .trim()
      .min(20, "A couple of sentences is enough, at least 20 characters.")
      .max(3000, "Please keep the brief under 3,000 characters."),
    budget: z.enum(budgetValues).optional().or(z.literal("")),
  }),
  timing: z.object({
    timing: z.enum(timingValues, { message: "Choose the closest timing, or “Not sure yet”." }),
    timingNote: z.string().trim().max(200, "Keep this under 200 characters.").optional().or(z.literal("")),
  }),
  contact: z.object({
    name: z.string().trim().min(2, "Please add your name.").max(100),
    email: z.string().trim().email("Enter an email address we can reply to.").max(200),
    phone: z
      .string()
      .trim()
      .max(30)
      .regex(/^[+0-9()\-\s]*$/, "Use digits, spaces, + and - only.")
      .optional()
      .or(z.literal("")),
    company: z.string().trim().max(120).optional().or(z.literal("")),
    consent: z.literal(true, { message: "Please confirm so we can store and reply to your brief." }),
  }),
} as const;

export const inquirySchema = stepSchemas.type
  .extend(stepSchemas.place.shape)
  .extend(stepSchemas.brief.shape)
  .extend(stepSchemas.timing.shape)
  .extend(stepSchemas.contact.shape)
  .extend({
    idempotencyKey: z.string().uuid(),
    // Honeypot: real people never fill this in.
    website: z.string().max(0).optional().or(z.literal("")),
  });

export type InquiryInput = z.infer<typeof inquirySchema>;
export type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

export type InquiryResult =
  | { status: "ok"; reference: string; duplicate?: boolean }
  | { status: "invalid"; fieldErrors: FieldErrors }
  | { status: "rate_limited" }
  | { status: "unavailable" }
  | { status: "error" };

export const labelOf = (
  opts: readonly { value: string; label: string }[],
  v: string | undefined,
) => opts.find((o) => o.value === v)?.label ?? (v || "Not provided");
