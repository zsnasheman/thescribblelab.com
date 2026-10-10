/**
 * Copy and media for the /concept homepage prototype. Edit text here; nothing below is hard-coded in the animation.
 */
import { SITE } from "@/lib/site";

/** Bottom counter: the phrase it rolls to for each moment of the journey. Keep each phrase at or under `slots` characters
 *  (letters A–Z, digits, space, + . @ & ? -). */
export const COUNTER = {
  slots: 16,
  phrases: {
    idea: "AN IDEA",
    sketch: "ON PAPER",
    form: "TAKES SHAPE",
    built: "BUILT FOR REAL",
    work: "SEE THE WORK",
    contact: SITE.contact.phone,
  },
} as const;
export type CounterKey = keyof typeof COUNTER.phrases;

export const OPENING = {
  eyebrow: "The Scribble Lab · Dubai",
  headline: ["We design & build", "spaces people", "remember"],
  sub: "Interiors, exhibitions, events and brand activations, from first scribble to finished space.",
};

/** The three steps the camera reveals, in order. */
export const STEPS = [
  { key: "sketch", n: "01", title: "A scribble becomes a plan", body: "Every space starts on paper. We draw until the idea makes sense." },
  { key: "form", n: "02", title: "The plan takes form", body: "Zones turn into volumes, materials and light." },
  { key: "built", n: "03", title: "Then we build it", body: "The same team that designs it makes it real." },
] as const;

/**
 * The built-result moment and the project strip use project photography already in the repository.
 * TO SWAP IN THE NEW PROJECT IMAGES: put optimised files in public/concept/ and replace `src`/`thumb` below
 * (BUILT.image for the full-bleed moment, and the matching entries in STRIP). Title and caption are provisional until confirmed.
 */
export const BUILT = {
  slug: "laduree-ramadan-tent",
  image: { src: "/work/laduree-ramadan-tent/01.webp", w: 1425, h: 1070 },
  alt: "Ladurée Ramadan tent, designed and built by The Scribble Lab",
  // Provisional text: taken from the project's existing entry. Confirm wording with the studio.
  caption: "Ladurée Ramadan tent",
};

/** Projects in the browsing strip: slugs from src/content/portfolio.ts. */
export const STRIP = [
  "laduree-ramadan-tent", "fifa-arab-cup-qatar", "chopard-kinetic-windows", "roche-riyadh", "dt1-downtown", "al-haramain-beauty-world",
  "wandr-jlt", "stanley-automechanika", "ahmed-al-maghribi-launch", "huda-beauty-bowling",
];
