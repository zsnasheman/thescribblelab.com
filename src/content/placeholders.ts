// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY PLACEHOLDER PHOTOGRAPHY.
// Free-to-use web photos (Unsplash licence) standing in until Scribble Lab's own
// project photography is supplied. They are NOT Scribble Lab projects.
// Replace each entry with a file in /public/work/... and set placeholder: false.
// If any image looks wrong, change its id here: one place, nothing else to edit.
// ─────────────────────────────────────────────────────────────────────────────
import type { Photo } from "./types";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

const p = (id: string, alt: string): Photo => ({
  src: u(id),
  alt,
  credit: "Unsplash",
  placeholder: true,
});

export const PH = {
  hero: p("1618221195710-dd6b41faaea6", "A modern living room with a sofa, warm light and a considered material palette"),
  interiors: p("1600210492486-724fe5c67fb0", "A luxury interior with warm timber, soft lighting and a generous seating area"),
  exhibitions: p("1540575467063-178a50c2df87", "A large exhibition hall with a built stand and visitors"),
  events: p("1505373877841-8d25f7d46678", "A conference stage with lighting and an audience"),
  activations: p("1441986300917-64674bd600d8", "A retail pop-up space with displays and shoppers"),
  windows: p("1441984904996-e0b6ba687e04", "A shop window display seen from the street"),
  lounge: p("1586023492125-27b2c045efd7", "A bright lounge with a large sofa and natural light"),
  stand: p("1475721027785-f74eccf877e2", "A trade-fair hall with a designed stand"),
  stage: p("1470229722913-7c0e2dbbafd3", "A stage washed in coloured light"),
  popup: p("1556742049-0cfed4f6a45d", "A small retail pop-up with product displays"),
  window: p("1567401893414-76b7b1e5a7a5", "A lit shop window at dusk"),
  villa: p("1600607687939-ce8a6c25118c", "A villa entrance hall with timber and stone"),
  listen: p("1454165804606-c3d57bc86b40", "A desk with notes, a laptop and a brief being discussed"),
  sketch: p("1503387762-592deb58ef4e", "An architect's hand drawing a plan on paper"),
  develop: p("1513694203232-719a280e022f", "Material and finish samples laid out on a table"),
  build: p("1504307651254-35680f356dfd", "A workshop with timber and tools, a piece being built"),
  handover: p("1616486338812-3dadae4b4ace", "A finished living space with plants and furniture"),
  studio: p("1497366216548-37526070297c", "A bright design studio with a long table and people working"),
} as const;
