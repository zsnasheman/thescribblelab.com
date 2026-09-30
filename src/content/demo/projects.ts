// ─────────────────────────────────────────────────────────────────────────────
// DEMO CONTENT — ILLUSTRATIVE CONCEPTS ONLY.
// Nothing in this file is a real client, project, result or date.
// Delete this folder (and set SHOW_DEMO_CONTENT to false in ../index.ts)
// before launch. Real projects belong in ../projects.ts once approved.
// ─────────────────────────────────────────────────────────────────────────────
import type { Project } from "../types";
import { PH } from "../placeholders";

const illus = (alt: string, caption: string) => [
  {
    kind: "image" as const,
    alt,
    caption,
    attribution: "Unsplash",
    permissionToPublish: true,
  },
];

export const demoProjects: Project[] = [
  {
    slug: "concept-courtyard-lounge",
    title: "Courtyard lounge",
    service: "interiors",
    status: "concept",
    isDemo: true,
    ratio: "landscape",
    summary: "A calm residential lounge organised around one arched opening.",
    brief:
      "Illustrative brief: a family lounge that feels quiet in the day and warm in the evening, with storage that disappears.",
    response:
      "One arched opening frames the room. Joinery runs wall to wall in a single tone so the eye rests on the coral feature panel.",
    materials: ["Indigo lacquered joinery", "Lime plaster walls", "Brushed brass details"],
    execution:
      "Illustrative only. A real project page describes the fabrication sequence, fixings and site programme here.",
    outcomes: [],
    media: illus(
      "Illustration of a lounge with an arched opening and a coral feature wall",
      "Placeholder photo and illustrative concept. Not a completed Scribble Lab project.",
    ),
    photo: PH.lounge,
  },
  {
    slug: "concept-hall-stand",
    title: "Hall 4 stand",
    service: "exhibitions",
    status: "concept",
    isDemo: true,
    ratio: "portrait",
    summary: "A two-storey stand with an open ground floor and a quiet meeting loft.",
    brief:
      "Illustrative brief: a stand that draws people off a busy aisle and gives private meetings somewhere to happen.",
    response:
      "A tall indigo fascia signals the stand from far down the hall. The ground floor stays open; meetings move upstairs.",
    materials: ["Painted MDF fascia", "Acoustic felt panels", "Demountable aluminium frame"],
    execution:
      "Illustrative only. A real project page covers shipping, install nights and dismantle.",
    outcomes: [],
    media: illus(
      "Illustration of an exhibition stand with a tall fascia and plinths",
      "Placeholder photo and illustrative concept. Not a completed Scribble Lab project.",
    ),
    photo: PH.stand,
  },
  {
    slug: "concept-launch-stage",
    title: "Launch stage",
    service: "events",
    status: "concept",
    isDemo: true,
    ratio: "landscape",
    summary: "A single reveal moment staged for a room of four hundred.",
    brief:
      "Illustrative brief: one product reveal, seen clearly from every seat, with a fast load-in.",
    response:
      "A raised coral plinth sits inside a simple truss frame. Everything else stays quiet so the reveal lands.",
    materials: ["Scenic flats", "Truss frame", "Warm white LED wash"],
    execution:
      "Illustrative only. A real project page covers rigging, load-in times and show support.",
    outcomes: [],
    media: illus(
      "Illustration of a stage with a coral plinth and truss frame",
      "Placeholder photo and illustrative concept. Not a completed Scribble Lab project.",
    ),
    photo: PH.stage,
  },
  {
    slug: "concept-corner-popup",
    title: "Corner pop-up",
    service: "brand-activations",
    status: "concept",
    isDemo: true,
    ratio: "square",
    summary: "A small, modular pop-up that opens on two sides.",
    brief:
      "Illustrative brief: a pop-up that can be rebuilt in a mall atrium, a street market and a hotel lobby.",
    response:
      "Four identical modules lock together. A striped canopy gives it a recognisable roofline wherever it lands.",
    materials: ["Birch ply modules", "Printed fabric canopy", "Cast-rubber feet"],
    execution:
      "Illustrative only. A real project page covers transport, rebuild time and servicing.",
    outcomes: [],
    media: illus(
      "Illustration of a modular pop-up with a striped canopy",
      "Placeholder photo and illustrative concept. Not a completed Scribble Lab project.",
    ),
    photo: PH.popup,
  },
  {
    slug: "concept-sliding-window",
    title: "Sliding panel window",
    service: "kinetic-windows",
    status: "concept",
    isDemo: true,
    ratio: "portrait",
    summary: "A retail window where three panels slowly rearrange a scene.",
    brief:
      "Illustrative brief: a window that changes as people walk past, with a full cycle of about fourteen seconds.",
    response:
      "Two panels slide on rails while a pendant disc rises and swings. The mechanism is visible and quiet.",
    materials: ["Powder-coated steel rails", "Brushless motors", "Painted aluminium panels"],
    execution:
      "Illustrative only. A real project page covers testing, installation after hours and servicing.",
    outcomes: [],
    media: illus(
      "Illustration of a shop window with sliding panels and a pendant disc",
      "Placeholder photo and illustrative concept. Not a completed Scribble Lab project.",
    ),
    photo: PH.window,
  },
  {
    slug: "concept-garden-villa",
    title: "Garden villa entrance",
    service: "interiors",
    status: "concept",
    isDemo: true,
    ratio: "landscape",
    summary: "A villa entrance hall that moves from courtyard light to a warm interior.",
    brief:
      "Illustrative brief: an entrance that feels generous without adding square metres.",
    response:
      "A long bench, a pendant and a green planter stage the arrival. A single stripe detail adds craft without noise.",
    materials: ["Terrazzo floor", "Oak bench", "Brass pendant"],
    execution:
      "Illustrative only. A real project page covers sequencing with trades and finishes.",
    outcomes: [],
    media: illus(
      "Illustration of a villa entrance with a bench, pendant and planter",
      "Placeholder photo and illustrative concept. Not a completed Scribble Lab project.",
    ),
    photo: PH.villa,
  },
];
