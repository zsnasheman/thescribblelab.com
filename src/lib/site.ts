// One consistent contact record and one founder record. Every page reads from here.
// Values come from the Brand Book v1.1 and the owner's brief; each is listed in
// docs/CONTENT_CHECKLIST.md for confirmation.

const studioLines = ["UNBOX Community, Building 4, 2nd Floor", "Bay Square, Business Bay", "Dubai, UAE"] as const;

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
    whatsappHref: "https://wa.me/971522815209",
    email: "hello@thescribblelab.com",
    studio: studioLines,
    warehouse: ["Warehouse No. 215, Sheikh Saeed Al Maktoum Warehouses", "Mena Jabal Ali, Industrial 1, Dubai"] as readonly string[],
    // A search link built from the address text. The pin itself still needs owner confirmation.
    mapHref:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("UNBOX Community, Building 4, Bay Square, Business Bay, Dubai, UAE"),
    // The workshop address and opening hours are deliberately not published until confirmed.
  },
  founder: {
    name: "Nasheman Sahiba Zargar",
    firstName: "Nasheman",
    role: "Founder & Design Director",
    established: "December 2021",
  },
  timezone: "Asia/Dubai",
} as const;

/** Search engines are kept out until launch is deliberately switched on. */
export const INDEXING_ENABLED = process.env.NEXT_PUBLIC_SITE_INDEXING === "on";
