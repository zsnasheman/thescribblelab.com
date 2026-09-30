import type { ServiceSlug } from "./types";

export const SPECIAL_TITLE: Record<ServiceSlug, { label: string; title: string; note: string }> = {
  interiors: { label: "Four kinds of interior", title: "The same care, a different brief", note: "Choose a kind of interior to see what changes." },
  exhibitions: { label: "How a stand meets the aisle", title: "Open sides decide the design", note: "Choose a stand type. Coral edges are open to an aisle." },
  events: { label: "A run of show", title: "From concept to strike", note: "Select a phase to see what happens in it." },
  "brand-activations": { label: "A kit of parts", title: "Built to be rebuilt", note: "Explode the kit to see how the parts fit together." },
  "kinetic-windows": { label: "Anatomy of the mechanism", title: "What moves, and what holds it", note: "Select a part to see where it sits and what it does." },
};
