import type { ServiceSlug } from "./types";

/** Concept illustration layers cut from the supplied art direction (see docs/ART_DIRECTION.md). Illustrative, not completed work. */
export type SampleId = "granite" | "travertine" | "timber" | "wash";

export const SAMPLES: Record<SampleId, { src: string; w: number; h: number; name: string }> = {
  granite: { src: "/art/t-granite.webp", w: 222, h: 204, name: "Speckled granite" },
  travertine: { src: "/art/t-travertine.webp", w: 432, h: 150, name: "Travertine" },
  timber: { src: "/art/t-timber.webp", w: 360, h: 126, name: "Fluted timber" },
  wash: { src: "/art/t-wash.webp", w: 570, h: 144, name: "Lavender plaster wash" },
};

export type Vignette = {
  color: string;
  ink: string;
  w: number;
  h: number;
  alt: string;
  /** Where the drawing detail is taken from the line version, as background-position percentages. */
  detail: { x: number; y: number; zoom: number };
  samples: SampleId[];
};

export const VIGNETTES: Record<ServiceSlug, Vignette> = {
  interiors: {
    color: "/art/v-interiors.webp", ink: "/art/v-interiors-ink.webp", w: 596, h: 404,
    alt: "Concept illustration: a lounge with timber slats, pendant lights and a travertine block beside a material board.",
    detail: { x: 70, y: 40, zoom: 1.7 }, samples: ["travertine", "timber"],
  },
  exhibitions: {
    color: "/art/v-exhibitions.webp", ink: "/art/v-exhibitions-ink.webp", w: 650, h: 432,
    alt: "Concept illustration: a sculptural fabric canopy over an exhibition hall with visitors under it.",
    detail: { x: 55, y: 30, zoom: 1.7 }, samples: ["wash", "timber"],
  },
  events: {
    color: "/art/v-events.webp", ink: "/art/v-events-ink.webp", w: 620, h: 492,
    alt: "Concept illustration: a lit arched arcade for an event, with the Dubai skyline behind it at dusk.",
    detail: { x: 40, y: 60, zoom: 1.7 }, samples: ["wash", "travertine"],
  },
  "brand-activations": {
    color: "/art/v-brand.webp", ink: "/art/v-brand-ink.webp", w: 580, h: 432,
    alt: "Concept illustration: a brand pavilion of timber fins around a circular opening in a stone wall.",
    detail: { x: 35, y: 55, zoom: 1.7 }, samples: ["travertine", "timber"],
  },
  "kinetic-windows": {
    color: "/art/v-kinetic.webp", ink: "/art/v-kinetic-ink.webp", w: 496, h: 432,
    alt: "Concept illustration: a shop window of tall vertical louvres that turn to reveal a display.",
    detail: { x: 50, y: 40, zoom: 1.7 }, samples: ["granite", "timber"],
  },
};

/** One line of what each discipline's board piece shows, for the focused view. */
export const FOCUS_NOTE: Record<ServiceSlug, string> = {
  interiors: "A drawn plan, a room and the materials it is made from, decided together.",
  exhibitions: "A form that draws people in, and a layout that keeps them moving.",
  events: "A temporary place with its own architecture, lit and staged for an evening.",
  "brand-activations": "A brand made physical: one clear gesture people can walk into.",
  "kinetic-windows": "A window that moves, so a display can change what it says.",
};

export type ArtRef = { color: string; ink: string; w: number; h: number; alt: string };

/** Which concept illustration stands in for each concept project. Completed work will carry real media instead. */
export function projectArt(slug: string, service: ServiceSlug): ArtRef {
  if (slug === "concept-garden-villa") {
    return { color: "/art/hero-m.webp", ink: "/art/hero-m-ink.webp", w: 794, h: 688, alt: "Concept illustration: an arched entrance opening to a courtyard and skyline, with a timber lattice canopy." };
  }
  return VIGNETTES[service];
}
