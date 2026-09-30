// Configurable site-wide details. Contact values come from the Brand Book v1.1
// and are flagged for confirmation in docs/content-checklist.md.

export const SITE = {
  name: "The Scribble Lab",
  shortName: "Scribble Lab",
  tagline: "Ideas. People. Places. A brighter tomorrow.",
  story: "Every space starts as a scribble.",
  description:
    "The Scribble Lab is a Dubai-based creative design and build agency creating interiors, exhibitions, events, brand activations and kinetic window displays.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thescribblelab.com",
  contact: {
    phone: "+971 52 281 5209",
    phoneHref: "tel:+971522815209",
    email: "nash@thescribblelab.com",
    studio: ["UNBOX Community, Building 4, 2nd Floor", "Bay Square, Business Bay", "Dubai, UAE"],
    // Workshop address intentionally left out of public pages until confirmed.
  },
  founder: {
    // Name as printed in Brand Book v1.1. Display spelling to be confirmed.
    name: "Nashemman Sahiba Zargar",
    role: "Founder & Design Director",
  },
  timezone: "Asia/Dubai",
} as const;

/** Search engines are kept out until launch is deliberately switched on. */
export const INDEXING_ENABLED = process.env.NEXT_PUBLIC_SITE_INDEXING === "on";
